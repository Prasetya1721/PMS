/* ═══════════════════════════════════════════════════════════════════
   PMS Kapal - Vercel Serverless Handler
   Simplified & Robust for Vercel deployment
   ═══════════════════════════════════════════════════════════════════ */

import crypto from 'node:crypto';

// ── In-memory data store (ephemeral per cold start) ────────────────
let db = null;
const sessions = new Map();

const SEED_DATA = {
  roles: [
    { id: 'super-admin', name: 'Super Admin' },
    { id: 'fleet-manager', name: 'Fleet Manager' },
    { id: 'admin-kapal', name: 'Admin Kapal' },
    { id: 'teknisi', name: 'Teknisi' },
    { id: 'crew', name: 'Crew' },
    { id: 'hr', name: 'HR' },
    { id: 'finance', name: 'Finance' }
  ],
  users: [
    { id: 'u1', username: 'superadmin', password: 'pms-demo', name: 'Super Admin', roleId: 'super-admin', shipId: null },
    { id: 'u2', username: 'fleet', password: 'pms-demo', name: 'Fleet Manager', roleId: 'fleet-manager', shipId: null },
    { id: 'u3', username: 'nakhoda', password: 'pms-demo', name: 'Nakhoda', roleId: 'admin-kapal', shipId: 'ship-1' },
    { id: 'u4', username: 'teknisi', password: 'pms-demo', name: 'Teknisi', roleId: 'teknisi', shipId: 'ship-1' }
  ],
  ships: [
    { id: 'ship-1', name: 'KM Nusantara 01', imo: 'IMO-9012345', type: 'Cargo', flag: 'Indonesia', size: '3500 GT', photo: '' },
    { id: 'ship-2', name: 'KM Nusantara 02', imo: 'IMO-9076543', type: 'Tanker', flag: 'Indonesia', size: '5000 GT', photo: '' }
  ],
  equipments: [
    { id: 'eq-1', shipId: 'ship-1', name: 'Main Engine', category: 'Mesin', parentId: null, runningHours: 12500 },
    { id: 'eq-2', shipId: 'ship-1', name: 'Genset 1', category: 'Genset', parentId: null, runningHours: 8300 }
  ],
  schedules: [
    { id: 'sch-1', equipmentId: 'eq-1', title: 'Overhaul', basis: 'hours', intervalHours: 2000, nextDueAt: new Date(Date.now() + 5 * 86400000).toISOString(), status: 'due-soon' },
    { id: 'sch-2', equipmentId: 'eq-2', title: 'Ganti oli', basis: 'calendar', intervalDays: 90, nextDueAt: new Date(Date.now() - 10 * 86400000).toISOString(), status: 'overdue' }
  ],
  workOrders: [
    { id: 'wo-1', shipId: 'ship-1', title: 'Ganti oli Genset 1', assignee: 'Chief Engineer', status: 'open', createdAt: new Date().toISOString() }
  ],
  spareparts: [
    { id: 'sp-1', shipId: 'ship-1', code: 'SP-ME-001', name: 'Fuel Injector', stock: 4, minStock: 6 },
    { id: 'sp-2', shipId: 'ship-1', code: 'SP-GE-010', name: 'Oil Filter', stock: 20, minStock: 10 }
  ],
  sparepartUsages: [],
  costs: [
    { id: 'c-1', shipId: 'ship-1', kind: 'sparepart', amount: 3500000, date: new Date().toISOString(), note: 'Oil filter' },
    { id: 'c-2', shipId: 'ship-1', kind: 'jasa', amount: 5000000, date: new Date().toISOString(), note: 'Jasa teknisi' }
  ],
  budgets: [{ id: 'b-1', shipId: 'ship-1', period: '2026', amount: 500000000 }],
  crews: [
    { id: 'cr-1', shipId: 'ship-1', name: 'Ahmad Prasetyo', rank: 'Nakhoda', phone: '6281110001', status: 'onboard', photo: '', contracts: [] },
    { id: 'cr-2', shipId: 'ship-1', name: 'Budi Santoso', rank: 'KKM', phone: '6281110002', status: 'onboard', photo: '', contracts: [] }
  ],
  crewCertificates: [
    { id: 'cc-1', crewId: 'cr-1', type: 'COC Nautika', issuedAt: new Date(Date.now() - 700 * 86400000).toISOString(), expiredAt: new Date(Date.now() + 20 * 86400000).toISOString() },
    { id: 'cc-2', crewId: 'cr-2', type: 'Medical', issuedAt: new Date(Date.now() - 300 * 86400000).toISOString(), expiredAt: new Date(Date.now() - 2 * 86400000).toISOString() }
  ],
  attendances: [],
  leaves: [{ id: 'lv-1', crewId: 'cr-2', startDate: new Date(Date.now() + 30 * 86400000).toISOString(), endDate: new Date(Date.now() + 44 * 86400000).toISOString(), status: 'pending', reason: 'Cuti tahunan' }],
  activities: [{ id: 'act-1', shipId: 'ship-1', type: 'drill', title: 'Fire drill', date: new Date(Date.now() - 7 * 86400000).toISOString() }],
  shipDocuments: [
    { id: 'doc-1', shipId: 'ship-1', type: 'SMC', issuedAt: new Date(Date.now() - 800 * 86400000).toISOString(), expiredAt: new Date(Date.now() + 55 * 86400000).toISOString() },
    { id: 'doc-2', shipId: 'ship-1', type: 'Class Certificate', issuedAt: new Date(Date.now() - 900 * 86400000).toISOString(), expiredAt: new Date(Date.now() + 6 * 86400000).toISOString() }
  ],
  notificationConfigs: [
    { id: 'nc-1', targetType: 'crew-certificate', thresholds: [90, 60, 30, 14, 7, 1] },
    { id: 'nc-2', targetType: 'ship-document', thresholds: [90, 60, 30, 14, 7, 1] },
    { id: 'nc-3', targetType: 'maintenance', thresholds: [14, 7, 1] }
  ],
  notificationLogs: [],
  auditLogs: [],
  attachments: [],
  provider: { wa: 'mock', push: 'mock' },
  workOrderChecks: [],
  workOrderApprovals: []
};

function initDb() {
  if (!db) {
    db = JSON.parse(JSON.stringify(SEED_DATA));
  }
  return db;
}

function expiryStatus(expiredAt) {
  try {
    const diff = Math.ceil((new Date(expiredAt) - new Date()) / 86400000);
    if (diff < 0) return { status: 'expired', sisaHari: diff };
    if (diff <= 30) return { status: 'mendekati-expired', sisaHari: diff };
    return { status: 'aktif', sisaHari: diff };
  } catch {
    return { status: 'aktif', sisaHari: 999 };
  }
}

function auth(req) {
  try {
    const t = (req.headers.authorization || '').replace('Bearer ', '').trim();
    if (!t) return null;
    const id = sessions.get(t);
    return id ? db.users.find(u => u.id === id) : null;
  } catch {
    return null;
  }
}

// ══════════════════════════════════════════════════════════════════
// Main Serverless Handler
// ══════════════════════════════════════════════════════════════════
export default async function handler(req, res) {
  try {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Content-Type', 'application/json');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    db = initDb();
    
    // Parse URL path
    const path = (req.url || '').split('?')[0].split('/').filter(Boolean);
    
    // Health check
    if (path[path.length - 1] === 'health') {
      return res.status(200).json({ ok: true, platform: 'vercel', time: new Date().toISOString() });
    }

    // Login endpoint
    if (path[path.length - 1] === 'login') {
      const body = req.body || {};
      const u = db.users.find(x => x.username === body.username && x.password === body.password);
      if (!u) {
        return res.status(401).json({ error: 'Username/password salah' });
      }
      const token = crypto.randomBytes(16).toString('hex');
      sessions.set(token, u.id);
      return res.status(200).json({
        token,
        user: { id: u.id, username: u.username, name: u.name, roleId: u.roleId, shipId: u.shipId }
      });
    }

    // Protected endpoints
    const user = auth(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - token required' });
    }

    // Dashboard fleet
    if (path.includes('dashboard') && path.includes('fleet')) {
      const ships = db.ships.map(s => {
        const docs = db.shipDocuments.filter(d => d.shipId === s.id).map(d => ({ ...d, ...expiryStatus(d.expiredAt) }));
        const certs = db.crewCertificates.filter(c => db.crews.find(x => x.id === c.crewId)?.shipId === s.id).map(c => ({ ...c, ...expiryStatus(c.expiredAt) }));
        const overdue = db.schedules.filter(x => db.equipments.find(e => e.id === x.equipmentId)?.shipId === s.id && x.status === 'overdue').length;
        const low = db.spareparts.filter(p => p.shipId === s.id && p.stock <= p.minStock).length;
        const urgency = docs.filter(d => d.status !== 'aktif').length + certs.filter(c => c.status !== 'aktif').length + overdue + low;
        return {
          ...s,
          expiredDocs: docs.filter(d => d.status !== 'aktif').length,
          expiredCerts: certs.filter(c => c.status !== 'aktif').length,
          overdue,
          lowStock: low,
          urgency
        };
      }).sort((a, b) => b.urgency - a.urgency);
      return res.status(200).json({ ships });
    }

    // Dashboard ship
    if (path.includes('dashboard') && path.includes('ship')) {
      const shipIdx = path.indexOf('ship');
      const id = path[shipIdx + 1] || user.shipId || 'ship-1';
      const docs = db.shipDocuments.filter(d => d.shipId === id).map(d => ({ ...d, ...expiryStatus(d.expiredAt) }));
      const crews = db.crews.filter(c => c.shipId === id).map(c => ({
        ...c,
        certificates: db.crewCertificates.filter(x => x.crewId === c.id).map(x => ({ ...x, ...expiryStatus(x.expiredAt) }))
      }));
      const eqs = db.equipments.filter(e => e.shipId === id).map(e => ({
        ...e,
        schedules: db.schedules.filter(s => s.equipmentId === e.id)
      }));
      const costs = db.costs.filter(c => c.shipId === id);
      const total = costs.reduce((a, c) => a + Number(c.amount || 0), 0);
      return res.status(200).json({
        ship: db.ships.find(s => s.id === id),
        documents: docs,
        crews,
        equipments: eqs,
        spareparts: db.spareparts.filter(p => p.shipId === id).map(p => ({ ...p, low: p.stock <= p.minStock })),
        workOrders: db.workOrders.filter(w => w.shipId === id),
        costs,
        budget: db.budgets.find(x => x.shipId === id) || null,
        totalBiaya: total,
        leaves: db.leaves.filter(l => db.crews.find(c => c.id === l.crewId)?.shipId === id),
        activities: db.activities.filter(a => a.shipId === id)
      });
    }

    // KPI
    if (path.includes('reports') && path.includes('kpi')) {
      const totalWO = db.workOrders.length;
      const doneOnTime = db.workOrders.filter(w => w.status === 'completed').length;
      return res.status(200).json({
        kepatuhanMaintenance: totalWO ? Math.round((doneOnTime / totalWO) * 100) : 100,
        targetMaintenance: 95,
        sertifikatExpiredTanpaNotif: 0,
        suratExpiredTanpaNotif: 0,
        targetNol: 0,
        totalWO,
        doneOnTime,
        totalNotif: db.notificationLogs.length
      });
    }

    // Cost reports
    if (path.includes('reports') && path.includes('costs')) {
      const query = new URL(req.url, `http://${req.headers.host}`).searchParams;
      const s = query.get('shipId') || user.shipId || 'ship-1';
      const list = db.costs.filter(c => c.shipId === s);
      const total = list.reduce((a, c) => a + Number(c.amount || 0), 0);
      const bg = db.budgets.find(x => x.shipId === s);
      return res.status(200).json({
        shipId: s,
        items: list,
        total,
        budget: bg?.amount || 0,
        sisa: (bg?.amount || 0) - total
      });
    }

    // Ships endpoint
    if (path.includes('ships')) {
      if (req.method === 'GET') {
        return res.status(200).json(db.ships);
      }
    }

    // Roles
    if (path.includes('roles')) {
      return res.status(200).json(db.roles);
    }

    // Notification configs
    if (path.includes('notification-configs')) {
      return res.status(200).json(db.notificationConfigs);
    }

    // Notification logs
    if (path.includes('notification-logs')) {
      return res.status(200).json(db.notificationLogs);
    }

    // Work order checks
    if (path.includes('work-order-checks')) {
      return res.status(200).json(db.workOrderChecks);
    }

    // Work order approvals
    if (path.includes('work-order-approvals')) {
      return res.status(200).json(db.workOrderApprovals);
    }

    // Audit logs
    if (path.includes('audit-logs')) {
      return res.status(200).json(db.auditLogs);
    }

    // Users (super-admin only)
    if (path.includes('users')) {
      if (user.roleId === 'super-admin') {
        return res.status(200).json(db.users.map(u => ({ ...u, password: '***' })));
      }
      return res.status(403).json({ error: 'Forbidden - super-admin only' });
    }

    // Backup
    if (path.includes('backup')) {
      if (user.roleId !== 'super-admin' && user.roleId !== 'fleet-manager') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      return res.status(200).json({
        at: new Date().toISOString(),
        by: user.username,
        data: db
      });
    }

    // Scheduler
    if (path.includes('scheduler')) {
      return res.status(200).json({ checked: true, sent: 0, logs: [] });
    }

    // Notifications provider
    if (path.includes('notifications') && path.includes('provider')) {
      return res.status(200).json(db.provider || { wa: 'mock', push: 'mock' });
    }

    // Default: return error
    return res.status(404).json({ error: 'Endpoint not found', path: req.url });

  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
