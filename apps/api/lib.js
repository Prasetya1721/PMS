import http from 'node:http';
import https from 'node:https';
import crypto from 'node:crypto';
import net from 'node:net';
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
export async function runScheduler(fast) {
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
  const push = async (targetType, refId, channel, target, text) => {
    if (alreadySentToday(refId)) return;
    const n = priorCount(refId);
    let finalTarget = target;
    let level = 'normal';
    if (n >= 2) { finalTarget = 'fleet-manager (eskalasi dari ' + target + ')'; level = 'eskalasi'; }
    const dl = await deliverReminder(channel, target, text || ('[PMS] ' + targetType + ' ' + refId + ' butuh perhatian'), targetType, refId);
    logs.unshift({ id: uid('nl'), targetType, refId, channel, target: finalTarget, level, status: dl.status, at: new Date().toISOString() });
  };
  const thCert = cfg('crew-certificate'), thDoc = cfg('ship-document'), thMnt = cfg('maintenance');
  for (const c of db.crewCertificates) {
    const s = expiryStatus(c.expiredAt);
    if (s.status !== 'aktif' && hitThreshold(s.sisaHari, thCert)) await push('crew-certificate', c.id, 'whatsapp', db.crews.find((x) => x.id === c.crewId)?.phone || '-', '[PMS] Sertifikat ' + c.type + ' (' + (db.crews.find((x) => x.id === c.crewId)?.name || c.crewId) + ') ' + s.status + ' sisa ' + s.sisaHari + ' hari');
  }
  for (const d of db.shipDocuments) {
    const s = expiryStatus(d.expiredAt);
    if (s.status !== 'aktif' && hitThreshold(s.sisaHari, thDoc)) await push('ship-document', d.id, 'whatsapp', 'admin-kapal', '[PMS] Surat ' + d.type + ' kapal ' + d.shipId + ' ' + s.status + ' sisa ' + s.sisaHari + ' hari');
  }
  for (const s of db.schedules) {
    const dueIn = Math.ceil((new Date(s.nextDueAt) - new Date()) / 86400000);
    if ((s.status === 'overdue' || s.status === 'due-soon') && hitThreshold(dueIn, thMnt)) await push('maintenance', s.id, 'push', 'teknisi', '[PMS] Jadwal ' + s.title + ' ' + s.status + ' sisa ' + dueIn + ' hari');
  }
  for (const p of db.spareparts) { if (p.stock <= p.minStock) await push('stock', p.id, 'push', 'admin-kapal', '[PMS] Stok rendah ' + p.code + ' sisa ' + p.stock); }
  if (logs.length) { db.notificationLogs = [...logs, ...db.notificationLogs].slice(0, 500); saveDb(db); }
  return logs;
}
setInterval(() => runScheduler().catch(() => {}), 24 * 3600 * 1000);
// Scheduler harian jam 06:00 + watchdog 5 menit (KPI §14: respon ≤5 menit)
function msToNext6am() { const n = new Date(); const t = new Date(n); t.setHours(6, 0, 0, 0); if (t <= n) t.setDate(t.getDate() + 1); return t - n; }
setTimeout(function dailyTick() { runScheduler().catch(() => {}); setTimeout(dailyTick, 24 * 3600 * 1000); }, msToNext6am());
setInterval(() => runScheduler(true).catch(() => {}), 5 * 60 * 1000);
// --- Provider asli + fallback (Fase 3 penuh, tanpa deps) ---
function httpPostJson(url, payload, headers) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const body = JSON.stringify(payload);
      const req = http.request({ host: u.hostname, port: u.port || (u.protocol === 'https:' ? 443 : 80), path: u.pathname + u.search, method: 'POST', timeout: 8000, headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), ...(headers || {}) } }, (res) => { let s = ''; res.on('data', (c) => (s += c)); res.on('end', () => resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, body: s.slice(0, 300) })); });
      req.on('timeout', () => { req.destroy(); resolve({ ok: false, status: 0, body: 'timeout' }); });
      req.on('error', (e) => resolve({ ok: false, status: 0, body: String(e.message || e).slice(0, 200) }));
      req.write(body); req.end();
    } catch (e) { resolve({ ok: false, status: 0, body: String(e.message || e).slice(0, 200) }); }
  });
}
function smtpSend(cfg, to, subject, text) {
  return new Promise((resolve) => {
    try {
      const sock = net.connect(Number(cfg.port || 587), cfg.host, () => {});
      let step = 0; let buf = '';
      const write = (s) => sock.write(s + '\r\n');
      const timer = setTimeout(() => { try { sock.destroy(); } catch {} resolve({ ok: false, body: 'smtp-timeout' }); }, 9000);
      sock.on('data', (c) => {
        buf += c.toString();
        if (!buf.includes('\r\n')) return;
        const last = buf.trim(); buf = '';
        if (step === 0 && last.startsWith('220')) { write('EHLO pms-kapal'); step = 1; }
        else if (step === 1 && last.startsWith('250')) { write('MAIL FROM:<' + (cfg.user || 'pms@localhost') + '>'); step = 2; }
        else if (step === 2 && (last.startsWith('250') || last.startsWith('251'))) { write('RCPT TO:<' + to + '>'); step = 3; }
        else if (step === 3 && last.startsWith('250')) { write('DATA'); step = 4; }
        else if (step === 4 && last.startsWith('354')) { write('Subject: ' + subject + '\r\nTo: ' + to + '\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n' + text + '\r\n.'); step = 5; }
        else if (step === 5 && last.startsWith('250')) { write('QUIT'); clearTimeout(timer); try { sock.end(); } catch {} resolve({ ok: true, body: 'smtp-sent' }); }
        else if (/^[45]/.test(last)) { clearTimeout(timer); try { sock.destroy(); } catch {} resolve({ ok: false, body: last.slice(0, 200) }); }
      });
      sock.on('error', (e) => { clearTimeout(timer); resolve({ ok: false, body: String(e.message || e).slice(0, 200) }); });
    } catch (e) { resolve({ ok: false, body: String(e.message || e).slice(0, 200) }); }
  });
}
export async function deliverReminder(channel, target, text, targetType, refId) {
  const pv = db.provider || { wa: 'mock', push: 'mock' };
  let r = { ok: false, status: 'terkirim-mock' };
  try {
    if (channel === 'whatsapp') {
      if (pv.wa === 'twilio' && pv.twilio?.url && pv.twilio?.token) r = await httpPostJson(pv.twilio.url, { To: 'whatsapp:' + target, Body: text }, { Authorization: 'Basic ' + Buffer.from(pv.twilio.token).toString('base64') }).then((x) => ({ ok: x.ok, status: x.ok ? 'terkirim-twilio' : 'gagal-twilio:' + x.body }));
      else if (pv.wa === 'wablas' && pv.wablas?.url && pv.wablas?.token) r = await httpPostJson(pv.wablas.url, { phone: target, message: text }, { Authorization: pv.wablas.token }).then((x) => ({ ok: x.ok, status: x.ok ? 'terkirim-wablas' : 'gagal-wablas:' + x.body }));
      else if (pv.wa === 'qontak' && pv.qontak?.url && pv.qontak?.token) r = await httpPostJson(pv.qontak.url, { to_number: target, message: { content: text } }, { Authorization: 'Bearer ' + pv.qontak.token }).then((x) => ({ ok: x.ok, status: x.ok ? 'terkirim-qontak' : 'gagal-qontak:' + x.body }));
    } else if (channel === 'push') {
      if ((pv.push === 'onesignal' || pv.push === 'fcm') && pv.pushUrl && pv.pushKey) r = await httpPostJson(pv.pushUrl, { target, text, targetType, refId }, { Authorization: 'Key ' + pv.pushKey }).then((x) => ({ ok: x.ok, status: x.ok ? 'terkirim-' + pv.push : 'gagal-' + pv.push + ':' + x.body }));
      else if (pv.pushWebhooks?.length) {
        let okAny = false, last = '';
        for (const hook of pv.pushWebhooks.slice(0, 3)) { const x = await httpPostJson(hook, { target, text, targetType, refId }); okAny = okAny || x.ok; last = x.body; }
        r = { ok: okAny, status: okAny ? 'terkirim-webhook' : 'gagal-webhook:' + last };
      }
    }
  } catch (e) { r = { ok: false, status: 'gagal:' + String(e.message || e).slice(0, 120) }; }
  if (!r.ok && !String(r.status).startsWith('terkirim-mock') && pv.smtp?.host && pv.smtp?.to) {
    const em = await smtpSend(pv.smtp, pv.smtp.to, '[PMS] ' + targetType + ' ' + refId, text + '\nTarget: ' + target + ' (' + channel + ')');
    if (em.ok) return { ok: true, status: 'fallback-email' };
    return { ok: false, status: r.status + ' | email-gagal:' + em.body };
  }
  return r;
}
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
  'fleet-manager': ['ships', 'equipments', 'schedules', 'workOrders', 'spareparts', 'sparepartRequisitions', 'costs', 'budgets', 'shipDocuments', 'leaves-approve', 'kasbon', 'kasbon-approve'],
  'admin-kapal': ['equipments', 'schedules', 'workOrders', 'spareparts', 'sparepartRequisitions', 'costs', 'crews', 'crewCertificates', 'attendances', 'leaves', 'activities', 'shipDocuments', 'leaves-approve', 'kasbon', 'kasbon-approve'],
  teknisi: ['workOrders', 'schedules', 'spareparts', 'sparepartRequisitions'],
  crew: ['leaves', 'kasbon'],
  hr: ['crews', 'crewCertificates', 'attendances', 'leaves', 'activities', 'leaves-approve', 'kasbon', 'kasbon-approve'],
  finance: ['costs', 'budgets', 'sparepartRequisitions', 'kasbon', 'kasbon-approve']
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
