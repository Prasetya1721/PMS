import http from 'node:http';
import crypto from 'node:crypto';
import { loadDb, saveDb, audit, expiryStatus } from './store.js';
export const PORT = process.env.PORT || 4000;
export let db = loadDb();
export const sessions = new Map();
export const uid = (p) => p + '-' + Date.now().toString(36) + Math.floor(Math.random() * 999);
export function send(res, code, data) {
  res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' });
  res.end(JSON.stringify(data));
}
export function readBody(req) {
  return new Promise((r) => { let s = ''; req.on('data', (c) => (s += c)); req.on('end', () => { try { r(s ? JSON.parse(s) : {}); } catch { r({}); } }); });
}
export function auth(req) {
  const t = (req.headers.authorization || '').replace('Bearer ', '');
  const id = sessions.get(t);
  return id ? db.users.find((u) => u.id === id) : null;
}
export async function runScheduler() {
  const logs = [];
  const cfg = (t) => db.notificationConfigs.find((x) => x.targetType === t)?.thresholds || [];
  const hitThreshold = (sisa, thresholds) => {
    if (sisa < 0) return true;
    return thresholds.some((t) => Math.abs(sisa - t) <= 1);
  };
  const alreadySentToday = (refId) => {
    const oneDay = Date.now() - 24 * 3600 * 1000;
    return db.notificationLogs.some((l) => l.refId === refId && new Date(l.at).getTime() > oneDay);
  };
  const priorCount = (refId) => db.notificationLogs.filter((l) => l.refId === refId).length;
  const push = (targetType, refId, channel, target) => {
    if (alreadySentToday(refId)) return;
    const n = priorCount(refId);
    let finalTarget = target;
    let level = 'normal';
    if (n >= 2) { finalTarget = 'fleet-manager (eskalasi dari ' + target + ')'; level = 'eskalasi'; }
    logs.unshift({ id: uid('nl'), targetType, refId, channel, target: finalTarget, level, status: 'terkirim-mock', at: new Date().toISOString() });
  };
  const thCert = cfg('crew-certificate'), thDoc = cfg('ship-document'), thMnt = cfg('maintenance');
  for (const c of db.crewCertificates) {
    const s = expiryStatus(c.expiredAt);
    if (s.status !== 'aktif' && hitThreshold(s.sisaHari, thCert)) push('crew-certificate', c.id, 'whatsapp', db.crews.find((x) => x.id === c.crewId)?.phone || '-');
  }
  for (const d of db.shipDocuments) {
    const s = expiryStatus(d.expiredAt);
    if (s.status !== 'aktif' && hitThreshold(s.sisaHari, thDoc)) push('ship-document', d.id, 'whatsapp', 'admin-kapal');
  }
  for (const s of db.schedules) {
    const dueIn = Math.ceil((new Date(s.nextDueAt) - new Date()) / 86400000);
    if ((s.status === 'overdue' || s.status === 'due-soon') && hitThreshold(dueIn, thMnt)) push('maintenance', s.id, 'push', 'teknisi');
  }
  for (const p of db.spareparts) { if (p.stock <= p.minStock) push('stock', p.id, 'push', 'admin-kapal'); }
  if (logs.length) { db.notificationLogs = [...logs, ...db.notificationLogs].slice(0, 500); saveDb(db); }
  return logs;
}
setInterval(() => runScheduler().catch(() => {}), 24 * 3600 * 1000);
export function loginHandler(b) {
  const u = db.users.find((x) => x.username === b.username && x.password === b.password);
  if (!u) return null;
  const t = crypto.randomBytes(16).toString('hex');
  sessions.set(t, u.id);
  audit(db, u, 'login', 'user', u.id); saveDb(db);
  return { token: t, user: { id: u.id, username: u.username, name: u.name, roleId: u.roleId, shipId: u.shipId } };
}
export function shipFilter(user, arr, q) {
  const admin = ['super-admin', 'fleet-manager', 'hr', 'finance'].includes(user.roleId);
  const s = q.get('shipId') || user.shipId;
  if (!s && admin) return arr;
  return arr.filter((x) => (x.shipId || '') === (s || x.shipId));
}
export function fleetDashboard() {
  const ships = db.ships.map((s) => {
    const docs = db.shipDocuments.filter((d) => d.shipId === s.id).map((d) => ({ ...d, ...expiryStatus(d.expiredAt) }));
    const certs = db.crewCertificates.filter((c) => db.crews.find((x) => x.id === c.crewId)?.shipId === s.id).map((c) => ({ ...c, ...expiryStatus(c.expiredAt) }));
    const overdue = db.schedules.filter((x) => db.equipments.find((e) => e.id === x.equipmentId)?.shipId === s.id && x.status === 'overdue').length;
    const low = db.spareparts.filter((p) => p.shipId === s.id && p.stock <= p.minStock).length;
    const urg = docs.filter((d) => d.status !== 'aktif').length + certs.filter((c) => c.status !== 'aktif').length + overdue + low;
    return { ...s, expiredDocs: docs.filter((d) => d.status !== 'aktif').length, expiredCerts: certs.filter((c) => c.status !== 'aktif').length, overdue, lowStock: low, urgency: urg };
  }).sort((a, c) => c.urgency - a.urgency);
  return { ships };
}
// RBAC tulis (PRD §5): siapa boleh create/update/delete apa
export const WRITE_PERMS = {
  'super-admin': '*',
  'fleet-manager': ['ships', 'equipments', 'schedules', 'workOrders', 'spareparts', 'costs', 'budgets', 'shipDocuments', 'leaves-approve'],
  'admin-kapal': ['equipments', 'schedules', 'workOrders', 'spareparts', 'costs', 'crews', 'crewCertificates', 'attendances', 'leaves', 'activities', 'shipDocuments', 'leaves-approve'],
  teknisi: ['workOrders', 'schedules'],
  crew: ['leaves'],
  hr: ['crews', 'crewCertificates', 'attendances', 'leaves', 'activities', 'leaves-approve'],
  finance: ['costs', 'budgets']
};
export function canWrite(user, key) {
  const p = WRITE_PERMS[user.roleId];
  if (!p) return false;
  if (p === '*') return true;
  return p.includes(key);
}
// KPI §14 PRD
export function kpiReport() {
  const totalWO = db.workOrders.length;
  const doneOnTime = db.workOrders.filter((w) => w.status === 'completed').length;
  const certNoNotif = db.crewCertificates.filter((c) => expiryStatus(c.expiredAt).status === 'expired' && !db.notificationLogs.some((l) => l.refId === c.id)).length;
  const docNoNotif = db.shipDocuments.filter((d) => expiryStatus(d.expiredAt).status === 'expired' && !db.notificationLogs.some((l) => l.refId === d.id)).length;
  return {
    kepatuhanMaintenance: totalWO ? Math.round((doneOnTime / totalWO) * 100) : 100,
    targetMaintenance: 95,
    sertifikatExpiredTanpaNotif: certNoNotif,
    suratExpiredTanpaNotif: docNoNotif,
    targetNol: 0,
    totalWO, doneOnTime,
    totalNotif: db.notificationLogs.length
  };
}
