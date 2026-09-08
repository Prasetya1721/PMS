import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDb, saveDb, audit, expiryStatus } from './store.js';
import { PORT, send, readBody, auth, runScheduler, loginHandler, shipFilter, fleetDashboard, canWrite, kpiReport, uid } from './lib.js';
const db = loadDb();
const MAPS = { ships: 'ships', equipments: 'equipments', schedules: 'schedules', 'work-orders': 'workOrders', spareparts: 'spareparts', 'sparepart-usages': 'sparepartUsages', 'sparepart-requisitions': 'sparepartRequisitions', kasbon: 'kasbon', costs: 'costs', budgets: 'budgets', crews: 'crews', 'crew-certificates': 'crewCertificates', attendances: 'attendances', leaves: 'leaves', activities: 'activities', 'ship-documents': 'shipDocuments', 'notification-configs': 'notificationConfigs', 'notification-logs': 'notificationLogs', 'audit-logs': 'auditLogs', roles: 'roles', attachments: 'attachments', 'work-order-checks': 'workOrderChecks', 'work-order-approvals': 'workOrderApprovals' };
const WRITEKEY = { ships: 'ships', equipments: 'equipments', schedules: 'schedules', 'work-orders': 'workOrders', spareparts: 'spareparts', 'sparepart-usages': 'spareparts', 'sparepart-requisitions': 'sparepartRequisitions', kasbon: 'kasbon', costs: 'costs', budgets: 'budgets', crews: 'crews', 'crew-certificates': 'crewCertificates', attendances: 'attendances', leaves: 'leaves', activities: 'activities', 'ship-documents': 'shipDocuments', 'notification-configs': 'ships', attachments: 'shipDocuments', 'work-order-checks': 'workOrders', 'work-order-approvals': 'workOrders' };
const READONLY = new Set(['notification-logs', 'audit-logs']);
const SHIPKEY = new Set(['equipments', 'spareparts', 'sparepart-requisitions', 'kasbon', 'costs', 'budgets', 'crews', 'activities', 'ship-documents', 'attendances']);
function buildSimplePdf(title, lines) {
  const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)').slice(0, 120);
  let content = 'BT /F1 14 Tf 40 800 Td (' + esc(title) + ') Tj ET\n';
  let y = 780;
  for (const ln of lines.slice(0, 60)) { content += 'BT /F1 9 Tf 40 ' + y + ' Td (' + esc(ln) + ') Tj ET\n'; y -= 14; }
  const objs = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>', '<< /Length ' + content.length + ' >>\nstream\n' + content + 'endstream', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];
  let pdf = '%PDF-1.4\n'; const offs = [];
  objs.forEach((o, i) => { offs.push(pdf.length); pdf += (i + 1) + ' 0 obj\n' + o + '\nendobj\n'; });
  const xref = pdf.length;
  pdf += 'xref\n0 ' + (objs.length + 1) + '\n0000000000 65535 f \n' + offs.map((o) => String(o).padStart(10, '0') + ' 00000 n \n').join('') + 'trailer\n<< /Size ' + (objs.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF';
  return pdf;
}
const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 200, {});
  const url = new URL(req.url, 'http://x');
  const seg = url.pathname.split('/').filter(Boolean);
  const q = url.searchParams;
  if (seg[0] !== 'api') {
    const webRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '../web');
    let f = path.join(webRoot, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
    if (f.startsWith(webRoot) && fs.existsSync(f) && fs.statSync(f).isFile()) {
      const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
      res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'text/plain' });
      return fs.createReadStream(f).pipe(res);
    }
  }
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
  if (seg[0] === 'api' && seg[1] === 'reports' && seg[2] === 'kpi') return send(res, 200, kpiReport());
  if (seg[0] === 'api' && seg[1] === 'reports' && seg[2] === 'costs' && q.get('format') === 'xls') {
    const s = q.get('shipId') || user.shipId || 'ship-1';
    const list = db.costs.filter((c) => c.shipId === s);
    const rows = list.map((c) => '<Row><Cell><Data ss:Type="String">' + (c.date || '').slice(0, 10) + '</Data></Cell><Cell><Data ss:Type="String">' + c.kind + '</Data></Cell><Cell><Data ss:Type="String">' + String(c.note || '').replace(/[<>&]/g, '') + '</Data></Cell><Cell><Data ss:Type="Number">' + Number(c.amount || 0) + '</Data></Cell></Row>').join('');
    const xml = '<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Biaya"><Table><Row><Cell><Data ss:Type="String">Tanggal</Data></Cell><Cell><Data ss:Type="String">Jenis</Data></Cell><Cell><Data ss:Type="String">Catatan</Data></Cell><Cell><Data ss:Type="String">Nominal</Data></Cell></Row>' + rows + '</Table></Worksheet></Workbook>';
    res.writeHead(200, { 'Content-Type': 'application/vnd.ms-excel', 'Content-Disposition': 'attachment; filename="biaya-' + s + '.xls"', 'Access-Control-Allow-Origin': '*' });
    return res.end(xml);
  }
  if (seg[0] === 'api' && seg[1] === 'reports' && seg[2] === 'costs' && q.get('format') === 'pdf') {
    const s = q.get('shipId') || user.shipId || 'ship-1';
    const list = db.costs.filter((c) => c.shipId === s);
    const total = list.reduce((a, c) => a + Number(c.amount || 0), 0);
    const lines = list.map((c) => (c.date || '').slice(0, 10) + ' | ' + c.kind + ' | ' + String(c.note || '').slice(0, 40) + ' | Rp' + Number(c.amount || 0));
    const pdf = buildSimplePdf('Laporan Biaya ' + s, [...lines, '', 'TOTAL: Rp' + total]);
    res.writeHead(200, { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="biaya-' + s + '.pdf"', 'Access-Control-Allow-Origin': '*' });
    return res.end(Buffer.from(pdf, 'latin1'));
  }
  if (seg[0] === 'api' && seg[1] === 'reports' && seg[2] === 'costs') {
    const s = q.get('shipId') || user.shipId || 'ship-1';
    const list = db.costs.filter((c) => c.shipId === s);
    const total = list.reduce((a, c) => a + Number(c.amount || 0), 0);
    const bg = db.budgets.find((x) => x.shipId === s);
    return send(res, 200, { shipId: s, items: list, total, budget: bg?.amount || 0, sisa: (bg?.amount || 0) - total });
  }
  if (seg[0] === 'api' && seg[1] === 'reports' && seg[2] === 'work-orders' && q.get('format') === 'xls') {
    const s = q.get('shipId') || user.shipId || 'ship-1';
    const list = db.workOrders.filter((w) => w.shipId === s);
    const rows = list.map((w) => '<Row><Cell><Data ss:Type="String">' + w.id + '</Data></Cell><Cell><Data ss:Type="String">' + String(w.title || '').replace(/[<>&]/g, '') + '</Data></Cell><Cell><Data ss:Type="String">' + String(w.assignee || '-').replace(/[<>&]/g, '') + '</Data></Cell><Cell><Data ss:Type="String">' + w.status + '</Data></Cell><Cell><Data ss:Type="String">' + (w.createdAt || '').slice(0, 10) + '</Data></Cell></Row>').join('');
    const xml = '<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="WorkOrders"><Table><Row><Cell><Data ss:Type="String">ID WO</Data></Cell><Cell><Data ss:Type="String">Pekerjaan</Data></Cell><Cell><Data ss:Type="String">Teknisi</Data></Cell><Cell><Data ss:Type="String">Status</Data></Cell><Cell><Data ss:Type="String">Tanggal Dibuat</Data></Cell></Row>' + rows + '</Table></Worksheet></Workbook>';
    res.writeHead(200, { 'Content-Type': 'application/vnd.ms-excel', 'Content-Disposition': 'attachment; filename="wo-' + s + '.xls"', 'Access-Control-Allow-Origin': '*' });
    return res.end(xml);
  }
  if (seg[0] === 'api' && seg[1] === 'reports' && seg[2] === 'work-orders' && q.get('format') === 'pdf') {
    const s = q.get('shipId') || user.shipId || 'ship-1';
    const list = db.workOrders.filter((w) => w.shipId === s);
    const lines = list.map((w) => w.id + ' | ' + String(w.title || '').slice(0, 35) + ' | ' + String(w.assignee || '-').slice(0, 18) + ' | ' + w.status);
    const pdf = buildSimplePdf('Laporan Work Order Kapal ' + s, ['Total Work Order: ' + list.length, '', ...lines]);
    res.writeHead(200, { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="wo-' + s + '.pdf"', 'Access-Control-Allow-Origin': '*' });
    return res.end(Buffer.from(pdf, 'latin1'));
  }
  if (seg[0] === 'api' && seg[1] === 'reports' && seg[2] === 'work-orders') {
    const s = q.get('shipId') || user.shipId || 'ship-1';
    const list = db.workOrders.filter((w) => w.shipId === s);
    return send(res, 200, { shipId: s, items: list, total: list.length });
  }
  if (seg[0] === 'api' && seg[1] === 'backup' && req.method === 'POST') {
    if (user.roleId !== 'super-admin') return send(res, 403, { error: 'Hanya super-admin' });
    const b = await readBody(req);
    let nd = b.data || b;
    if (nd && nd.data && Array.isArray(nd.data.ships)) nd = nd.data;
    if (!nd || !Array.isArray(nd.ships) || !Array.isArray(nd.users)) return send(res, 400, { error: 'File backup tidak valid' });
    for (const k of Object.keys(nd)) db[k] = nd[k];
    if (!db.attachments) db.attachments = [];
    if (!db.sparepartUsages) db.sparepartUsages = [];
    if (!db.workOrderChecks) db.workOrderChecks = [];
    if (!db.workOrderApprovals) db.workOrderApprovals = [];
    audit(db, user, 'restore-backup', 'system', 'backup'); saveDb(db);
    return send(res, 200, { ok: true, ships: db.ships.length, users: db.users.length });
  }
  if (seg[0] === 'api' && seg[1] === 'backup') {
    if (user.roleId !== 'super-admin' && user.roleId !== 'fleet-manager') return send(res, 403, { error: 'Hanya super-admin/fleet' });
    return send(res, 200, { at: new Date().toISOString(), by: user.username, data: db });
  }
  if (seg[0] === 'api' && seg[1] === 'import' && req.method === 'POST') {
    if (!canWrite(user, 'ships') && !canWrite(user, 'crews')) return send(res, 403, { error: 'Tidak berhak import' });
    const b2 = await readBody(req);
    const lines = String(b2.csv || '').trim().split(/\r?\n/);
    if (lines.length < 2) return send(res, 400, { error: 'CSV kosong' });
    const head = lines[0].split(',').map((x) => x.trim().toLowerCase());
    let n = 0;
    if (seg[2] === 'ships') {
      if (!canWrite(user, 'ships')) return send(res, 403, { error: 'Tidak berhak import kapal' });
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((x) => x.trim());
        if (!cols[0]) continue;
        const o = {};
        head.forEach((h, j) => (o[h] = cols[j] || ''));
        db.ships.push({ id: uid('sh'), name: o.nama || o.name || cols[0], imo: o.imo || '', type: o.jenis || o.type || '', flag: o.flag || 'Indonesia' });
        n++;
      }
    } else if (seg[2] === 'crews') {
      if (!canWrite(user, 'crews')) return send(res, 403, { error: 'Tidak berhak import crew' });
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((x) => x.trim());
        if (!cols[0]) continue;
        const o = {};
        head.forEach((h, j) => (o[h] = cols[j] || ''));
        const shipName = (o.kapal || o.ship || '').toLowerCase();
        const ship = db.ships.find((s) => s.name.toLowerCase().includes(shipName) || s.id === o.shipid) || db.ships[0];
        db.crews.push({ id: uid('cr'), shipId: ship?.id || 'ship-1', name: o.nama || o.name || cols[0], rank: o.rank || cols[1] || 'ABK', phone: o.phone || cols[2] || '', status: 'onboard' });
        n++;
      }
    } else return send(res, 404, { error: 'Import tidak dikenal (ships/crews)' });
    audit(db, user, 'import', seg[2], String(n)); saveDb(db);
    return send(res, 200, { ok: true, imported: n });
  }
  if (seg[0] === 'api' && seg[1] === 'attachments' && req.method === 'POST') {
    if (user.roleId === 'crew') return send(res, 403, { error: 'Crew tidak boleh upload' });
    const b2 = await readBody(req);
    const data = String(b2.dataBase64 || '');
    if (data.length > 2800000) return send(res, 400, { error: 'File terlalu besar (maks ~2MB)' });
    const it = { id: uid('at'), refType: b2.refType || 'ship-document', refId: b2.refId || '', name: b2.name || 'scan', mime: b2.mime || 'application/octet-stream', size: data.length, dataBase64: data, by: user.username, at: new Date().toISOString() };
    db.attachments.push(it);
    audit(db, user, 'upload', 'attachments', it.id); saveDb(db);
    return send(res, 201, { ...it, dataBase64: '(tersimpan ' + it.size + ' char)' });
  }
  if (seg[0] === 'api' && seg[1] === 'users') {
    if (user.roleId !== 'super-admin') return send(res, 403, { error: 'Hanya super-admin' });
    if (req.method === 'GET' && seg.length === 2) return send(res, 200, db.users.map((u) => ({ ...u, password: '***' })));
    const b2 = (req.method === 'POST' || req.method === 'PUT') ? await readBody(req) : {};
    if (req.method === 'POST' && seg.length === 2) {
      if (!b2.username || !b2.password || !b2.roleId) return send(res, 400, { error: 'username/password/roleId wajib' });
      if (db.users.some((u) => u.username === b2.username)) return send(res, 400, { error: 'Username sudah ada' });
      const it = { id: uid('u'), username: b2.username, password: b2.password, name: b2.name || b2.username, roleId: b2.roleId, shipId: b2.shipId || null };
      db.users.push(it); audit(db, user, 'create', 'users', it.id); saveDb(db);
      return send(res, 201, { ...it, password: '***' });
    }
    if (seg.length === 3) {
      const it = db.users.find((x) => x.id === seg[2]);
      if (!it) return send(res, 404, { error: 'User tidak ditemukan' });
      if (req.method === 'PUT') { if (b2.password) it.password = b2.password; if (b2.name) it.name = b2.name; if (b2.roleId) it.roleId = b2.roleId; if ('shipId' in b2) it.shipId = b2.shipId; audit(db, user, 'update', 'users', it.id); saveDb(db); return send(res, 200, { ...it, password: '***' }); }
      if (req.method === 'DELETE') { if (it.id === user.id) return send(res, 400, { error: 'Tidak bisa hapus diri sendiri' }); db.users = db.users.filter((x) => x.id !== seg[2]); audit(db, user, 'delete', 'users', seg[2]); saveDb(db); return send(res, 200, { ok: true }); }
    }
  }
  if (seg[0] === 'api' && seg[1] === 'work-orders' && seg[3] === 'approve' && req.method === 'POST') {
    const wo = db.workOrders.find((x) => x.id === seg[2]);
    if (!wo) return send(res, 404, { error: 'WO tidak ditemukan' });
    if (!['admin-kapal', 'fleet-manager', 'super-admin'].includes(user.roleId)) return send(res, 403, { error: 'Tidak berhak approve WO' });
    const b2 = await readBody(req);
    wo.status = b2.status === 'rejected' ? 'rejected' : 'approved';
    wo.approvedBy = user.username; wo.approvedAt = new Date().toISOString();
    db.workOrderApprovals.push({ id: uid('wa'), workOrderId: wo.id, status: wo.status, note: b2.note || '', by: user.username, at: wo.approvedAt });
    audit(db, user, 'approve-wo-' + wo.status, 'workOrders', wo.id); saveDb(db);
    return send(res, 200, wo);
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
  if (seg[0] === 'api' && seg[1] === 'sparepart-requisitions' && seg[3] === 'status' && req.method === 'POST') {
    const reqItem = db.sparepartRequisitions.find((x) => x.id === seg[2]);
    if (!reqItem) return send(res, 404, { error: 'Pengajuan sparepart tidak ditemukan' });
    const b2 = await readBody(req);
    const newStatus = b2.status;
    if (!['approved', 'rejected', 'ordered', 'received'].includes(newStatus)) return send(res, 400, { error: 'Status tidak valid' });
    reqItem.status = newStatus;
    if (newStatus === 'approved') { reqItem.approvedBy = user.username; reqItem.approvedAt = new Date().toISOString(); }
    if (newStatus === 'rejected') { reqItem.rejectedBy = user.username; reqItem.rejectedAt = new Date().toISOString(); }
    if (newStatus === 'ordered') { reqItem.orderedBy = user.username; reqItem.orderedAt = new Date().toISOString(); }
    if (newStatus === 'received') {
      reqItem.receivedBy = user.username;
      reqItem.receivedAt = new Date().toISOString();
      const part = db.spareparts.find((p) => p.id === reqItem.sparepartId);
      if (part) {
        part.stock += Number(reqItem.qty || 0);
        audit(db, user, 'restock-sparepart', 'spareparts', part.id);
      }
    }
    audit(db, user, 'requisition-' + newStatus, 'sparepartRequisitions', reqItem.id);
    saveDb(db);
    return send(res, 200, reqItem);
  }
  if (seg[0] === 'api' && seg[1] === 'kasbon' && seg[3] === 'status' && req.method === 'POST') {
    const item = db.kasbon.find((x) => x.id === seg[2]);
    if (!item) return send(res, 404, { error: 'Data kasbon tidak ditemukan' });
    const b2 = await readBody(req);
    const newStatus = b2.status;
    if (!['approved', 'rejected', 'disbursed'].includes(newStatus)) return send(res, 400, { error: 'Status kasbon tidak valid' });
    item.status = newStatus;
    if (newStatus === 'approved') { item.approvedBy = user.username; item.approvedAt = new Date().toISOString(); }
    if (newStatus === 'rejected') { item.rejectedBy = user.username; item.rejectedAt = new Date().toISOString(); }
    if (newStatus === 'disbursed') { item.disbursedBy = user.username; item.disbursedAt = new Date().toISOString(); }
    audit(db, user, 'kasbon-' + newStatus, 'kasbon', item.id);
    saveDb(db);
    return send(res, 200, item);
  }
  if (seg[0] === 'api' && seg[1] === 'notifications' && seg[2] === 'provider' && req.method === 'POST') {
    const b2 = await readBody(req);
    db.provider = { ...(db.provider || {}), wa: b2.wa || 'mock', push: b2.push || 'mock', pushUrl: b2.pushUrl || '', pushKey: b2.pushKey || '', pushWebhooks: b2.pushWebhooks ? String(b2.pushWebhooks).split(',').map((s) => s.trim()).filter(Boolean) : (db.provider?.pushWebhooks || []), wablas: b2.wablasUrl ? { url: b2.wablasUrl, token: b2.wablasToken || '' } : (db.provider?.wablas || undefined), qontak: b2.qontakUrl ? { url: b2.qontakUrl, token: b2.qontakToken || '' } : (db.provider?.qontak || undefined), twilio: b2.twilioUrl ? { url: b2.twilioUrl, token: b2.twilioToken || '' } : (db.provider?.twilio || undefined), smtp: b2.smtpHost ? { host: b2.smtpHost, port: b2.smtpPort || '587', user: b2.smtpUser || '', to: b2.smtpTo || '' } : (db.provider?.smtp || undefined), updatedAt: new Date().toISOString(), by: user.username };
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
      if (seg[1] === 'sparepart-usages') { const s = q.get('shipId'); if (s) out = out.filter((x) => db.spareparts.find((p) => p.id === x.sparepartId)?.shipId === s); }
      if (seg[1] === 'attachments' && q.get('refId')) out = out.filter((x) => x.refId === q.get('refId'));
      return send(res, 200, out);
    }
    if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') && (READONLY.has(seg[1]) || !canWrite(user, WRITEKEY[seg[1]] || ''))) return send(res, 403, { error: 'Tidak berhak (RBAC ' + user.roleId + ')' });
    if (req.method === 'POST' && seg.length === 2) {
      if (seg[1] === 'sparepart-usages') {
        const part = db.spareparts.find((p) => p.id === b.sparepartId);
        if (!part) return send(res, 404, { error: 'Sparepart tidak ditemukan' });
        const qty = Number(b.qty || 0);
        if (qty <= 0) return send(res, 400, { error: 'Qty harus > 0' });
        if (part.stock < qty) return send(res, 400, { error: 'Stok kurang (sisa ' + part.stock + ')' });
        part.stock -= qty;
        const it = { id: uid('su'), sparepartId: part.id, workOrderId: b.workOrderId || null, qty, date: b.date || new Date().toISOString(), note: b.note || '', by: user.username };
        db.sparepartUsages.push(it); audit(db, user, 'use-sparepart', 'spareparts', part.id); saveDb(db);
        return send(res, 201, { ...it, sisaStok: part.stock });
      }
      if (seg[1] === 'work-orders' && seg.length === 2 && b.id === undefined) { /* fallthrough create */ }
      const it = { id: key.slice(0, 2) + '-' + Date.now().toString(36), ...b }; db[key].push(it); audit(db, user, 'create', key, it.id); saveDb(db); return send(res, 201, it);
    }
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
