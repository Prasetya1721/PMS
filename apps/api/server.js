import http from 'node:http';
import { loadDb, saveDb, audit, expiryStatus } from './store.js';
import { PORT, send, readBody, auth, runScheduler, loginHandler, shipFilter, fleetDashboard } from './lib.js';
const db = loadDb();
const MAPS = { ships: 'ships', equipments: 'equipments', schedules: 'schedules', 'work-orders': 'workOrders', spareparts: 'spareparts', costs: 'costs', budgets: 'budgets', crews: 'crews', 'crew-certificates': 'crewCertificates', attendances: 'attendances', leaves: 'leaves', activities: 'activities', 'ship-documents': 'shipDocuments', 'notification-configs': 'notificationConfigs', 'notification-logs': 'notificationLogs', 'audit-logs': 'auditLogs', roles: 'roles', users: 'users' };
const SHIPKEY = new Set(['equipments', 'spareparts', 'costs', 'budgets', 'crews', 'activities', 'ship-documents']);
const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 200, {});
  const url = new URL(req.url, 'http://x');
  const seg = url.pathname.split('/').filter(Boolean);
  const q = url.searchParams;
  if (seg[0] === 'api' && seg[1] === 'health') return send(res, 200, { ok: true, time: new Date().toISOString() });
  if (seg[0] === 'api' && seg[1] === 'login') { const r = loginHandler(await readBody(req)); return r ? send(res, 200, r) : send(res, 401, { error: 'Username/password salah' }); }
  if (seg[0] === 'api' && seg[1] === 'scheduler' && seg[2] === 'run') { const logs = await runScheduler(); return send(res, 200, { checked: true, sent: logs.length, logs: logs.slice(0, 20) }); }
  const user = auth(req);
  if (!user) return send(res, 401, { error: 'Butuh token login' });
  if (seg[0] === 'api' && seg[1] === 'dashboard' && seg[2] === 'fleet') return send(res, 200, fleetDashboard());
  if (seg[0] === 'api' && seg[1] === 'dashboard' && seg[2] === 'ship') {
    const id = seg[3] || user.shipId || 'ship-1';
    const docs = db.shipDocuments.filter((d) => d.shipId === id).map((d) => ({ ...d, ...expiryStatus(d.expiredAt) }));
    const crews = db.crews.filter((c) => c.shipId === id).map((c) => ({ ...c, certificates: db.crewCertificates.filter((x) => x.crewId === c.id).map((x) => ({ ...x, ...expiryStatus(x.expiredAt) })) }));
    const eqs = db.equipments.filter((e) => e.shipId === id).map((e) => ({ ...e, schedules: db.schedules.filter((s) => s.equipmentId === e.id) }));
    const costs = db.costs.filter((c) => c.shipId === id);
    const total = costs.reduce((a, c) => a + Number(c.amount || 0), 0);
    return send(res, 200, { ship: db.ships.find((s) => s.id === id), documents: docs, crews, equipments: eqs, spareparts: db.spareparts.filter((p) => p.shipId === id).map((p) => ({ ...p, low: p.stock <= p.minStock })), workOrders: db.workOrders.filter((w) => w.shipId === id), costs, budget: db.budgets.find((x) => x.shipId === id) || null, totalBiaya: total, leaves: db.leaves.filter((l) => db.crews.find((c) => c.id === l.crewId)?.shipId === id), activities: db.activities.filter((a) => a.shipId === id) });
  }
  if (seg[0] === 'api' && seg[1] === 'reports' && seg[2] === 'costs') {
    const s = q.get('shipId') || user.shipId || 'ship-1';
    const list = db.costs.filter((c) => c.shipId === s);
    const total = list.reduce((a, c) => a + Number(c.amount || 0), 0);
    const bg = db.budgets.find((x) => x.shipId === s);
    return send(res, 200, { shipId: s, items: list, total, budget: bg?.amount || 0, sisa: (bg?.amount || 0) - total });
  }
  if (seg[0] === 'api' && seg[1] === 'leaves' && seg[3] === 'approve' && req.method === 'POST') {
    const lv = db.leaves.find((x) => x.id === seg[2]);
    if (!lv) return send(res, 404, { error: 'Cuti tidak ditemukan' });
    if (!['admin-kapal', 'fleet-manager', 'super-admin', 'hr'].includes(user.roleId)) return send(res, 403, { error: 'Tidak berhak approve cuti' });
    const b2 = await readBody(req);
    lv.status = b2.status === 'rejected' ? 'rejected' : 'approved';
    lv.approvedBy = user.username; lv.approvedAt = new Date().toISOString();
    audit(db, user, 'approve-cuti-' + lv.status, 'leaves', lv.id); saveDb(db);
    return send(res, 200, lv);
  }
  if (seg[0] === 'api' && seg[1] === 'notifications' && seg[2] === 'provider' && req.method === 'POST') {
    const b2 = await readBody(req);
    db.provider = { wa: b2.wa || 'mock', push: b2.push || 'mock', updatedAt: new Date().toISOString(), by: user.username };
    audit(db, user, 'update-provider', 'notifications', 'provider'); saveDb(db);
    return send(res, 200, db.provider);
  }
  if (seg[0] === 'api' && seg[1] === 'notifications' && seg[2] === 'provider') return send(res, 200, db.provider || { wa: 'mock', push: 'mock' });
  if (seg[0] === 'api' && MAPS[seg[1]]) {
    const key = MAPS[seg[1]];
    const b = (req.method === 'POST' || req.method === 'PUT') ? await readBody(req) : {};
    if (req.method === 'GET' && seg.length === 2) {
      let out = db[key];
      if (SHIPKEY.has(seg[1])) out = shipFilter(user, out, q);
      if (seg[1] === 'crew-certificates' || seg[1] === 'leaves') { const s = q.get('shipId') || user.shipId; if (s) out = out.filter((x) => db.crews.find((c) => c.id === x.crewId)?.shipId === s); }
      return send(res, 200, out);
    }
    if (req.method === 'POST' && seg.length === 2) { const it = { id: key.slice(0, 2) + '-' + Date.now().toString(36), ...b }; db[key].push(it); audit(db, user, 'create', key, it.id); saveDb(db); return send(res, 201, it); }
    if (seg.length === 3) {
      const it = db[key].find((x) => x.id === seg[2]);
      if (!it) return send(res, 404, { error: 'Tidak ditemukan' });
      if (req.method === 'PUT') { Object.assign(it, b); audit(db, user, 'update', key, it.id); saveDb(db); return send(res, 200, it); }
      if (req.method === 'DELETE') { db[key] = db[key].filter((x) => x.id !== seg[2]); audit(db, user, 'delete', key, seg[2]); saveDb(db); return send(res, 200, { ok: true }); }
    }
  }
  return send(res, 404, { error: 'Endpoint tidak dikenal' });
});
server.listen(PORT, () => console.log('PMS API jalan di http://localhost:' + PORT));
