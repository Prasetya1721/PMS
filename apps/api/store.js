import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __d = path.dirname(fileURLToPath(import.meta.url));
const DB = path.join(__d, 'data.json');
const D = 86400000, now = Date.now(), iso = (t) => new Date(t).toISOString();
function seed() {
  return {
    roles: [{ id: 'super-admin', name: 'Super Admin' }, { id: 'fleet-manager', name: 'Fleet Manager' }, { id: 'admin-kapal', name: 'Admin Kapal' }, { id: 'teknisi', name: 'Teknisi' }, { id: 'crew', name: 'Crew' }, { id: 'hr', name: 'HR' }, { id: 'finance', name: 'Finance' }],
    users: [{ id: 'u1', username: 'superadmin', password: 'pms-demo', name: 'Super Admin', roleId: 'super-admin', shipId: null }, { id: 'u2', username: 'fleet', password: 'pms-demo', name: 'Fleet Manager', roleId: 'fleet-manager', shipId: null }, { id: 'u3', username: 'nakhoda', password: 'pms-demo', name: 'Nakhoda KM-01', roleId: 'admin-kapal', shipId: 'ship-1' }, { id: 'u4', username: 'teknisi', password: 'pms-demo', name: 'Chief Engineer', roleId: 'teknisi', shipId: 'ship-1' }, { id: 'u5', username: 'hr', password: 'pms-demo', name: 'HR', roleId: 'hr', shipId: null }, { id: 'u6', username: 'finance', password: 'pms-demo', name: 'Finance', roleId: 'finance', shipId: null }],
    ships: [{ id: 'ship-1', name: 'KM Nusantara 01', imo: 'IMO-9012345', type: 'General Cargo', flag: 'Indonesia', size: '3500 GT', photo: '' }, { id: 'ship-2', name: 'KM Nusantara 02', imo: 'IMO-9076543', type: 'Tanker', flag: 'Indonesia', size: '5000 GT', photo: '' }],
    equipments: [{ id: 'eq-1', shipId: 'ship-1', name: 'Main Engine', category: 'Mesin', parentId: null, runningHours: 12500 }, { id: 'eq-1a', shipId: 'ship-1', name: 'Fuel Injector Assy', category: 'Mesin', parentId: 'eq-1', runningHours: 12500 }, { id: 'eq-2', shipId: 'ship-1', name: 'Genset 1', category: 'Genset', parentId: null, runningHours: 8300 }, { id: 'eq-3', shipId: 'ship-2', name: 'Main Engine', category: 'Mesin', parentId: null, runningHours: 9800 }],
    schedules: [{ id: 'sch-1', equipmentId: 'eq-1', title: 'Overhaul Top End', basis: 'hours', intervalHours: 2000, lastDoneHours: 11000, nextDueAt: iso(now + 5 * D), status: 'due-soon' }, { id: 'sch-2', equipmentId: 'eq-2', title: 'Ganti oli + filter', basis: 'calendar', intervalDays: 90, lastDoneAt: iso(now - 100 * D), nextDueAt: iso(now - 10 * D), status: 'overdue' }],
    workOrders: [{ id: 'wo-1', scheduleId: 'sch-2', shipId: 'ship-1', title: 'Ganti oli Genset 1', assignee: 'Chief Engineer', status: 'open', createdAt: iso(now - 9 * D) }],
    spareparts: [{ id: 'sp-1', shipId: 'ship-1', equipmentId: 'eq-1', code: 'SP-ME-001', name: 'Fuel Injector', stock: 4, minStock: 6, location: 'Gudang Mesin', price: 2500000 }, { id: 'sp-2', shipId: 'ship-1', equipmentId: 'eq-2', code: 'SP-GE-010', name: 'Oil Filter', stock: 20, minStock: 10, location: 'Gudang Mesin', price: 350000 }],
    sparepartUsages: [],
    sparepartRequisitions: [
      { id: 'req-1', shipId: 'ship-1', sparepartId: 'sp-1', code: 'SP-ME-001', name: 'Fuel Injector', qty: 4, estimatedCost: 10000000, reason: 'Stok kritis (tersisa 4 dari min 6)', requester: 'Chief Engineer', status: 'pending', createdAt: iso(now - 3 * D), approvedBy: null, receivedAt: null }
    ],
    costs: [{ id: 'c-1', shipId: 'ship-1', kind: 'sparepart', refId: 'sp-2', amount: 3500000, date: iso(now - 20 * D), note: 'Oil filter x10' }, { id: 'c-2', shipId: 'ship-1', kind: 'jasa', refId: 'wo-1', amount: 5000000, date: iso(now - 5 * D), note: 'Jasa teknisi' }],
    budgets: [{ id: 'b-1', shipId: 'ship-1', period: '2026', amount: 500000000 }],
    crews: [{ id: 'cr-1', shipId: 'ship-1', name: 'Ahmad Prasetyo', rank: 'Nakhoda', phone: '6281110001', status: 'onboard', photo: '', contracts: [{ signOn: iso(now - 100 * D), signOff: null, shipId: 'ship-1' }] }, { id: 'cr-2', shipId: 'ship-1', name: 'Budi Santoso', rank: 'KKM', phone: '6281110002', status: 'onboard', photo: '', contracts: [{ signOn: iso(now - 200 * D), signOff: iso(now - 110 * D), shipId: 'ship-1' }, { signOn: iso(now - 100 * D), signOff: null, shipId: 'ship-1' }] }],
    crewCertificates: [{ id: 'cc-1', crewId: 'cr-1', type: 'COC Nautika', issuedAt: iso(now - 700 * D), expiredAt: iso(now + 20 * D) }, { id: 'cc-2', crewId: 'cr-2', type: 'Medical', issuedAt: iso(now - 300 * D), expiredAt: iso(now - 2 * D) }],
    attendances: [
      { id: 'a-1', crewId: 'cr-1', crewName: 'Ahmad Prasetyo', rank: 'Nakhoda', shipId: 'ship-1', signOn: iso(now - 100 * D), signOff: null, status: 'onboard', notes: 'Penugasan aktif' },
      { id: 'a-2', crewId: 'cr-2', crewName: 'Budi Santoso', rank: 'KKM', shipId: 'ship-1', signOn: iso(now - 100 * D), signOff: null, status: 'onboard', notes: 'Penugasan aktif' }
    ],
    leaves: [{ id: 'lv-1', crewId: 'cr-2', startDate: iso(now + 30 * D), endDate: iso(now + 44 * D), status: 'pending', reason: 'Cuti tahunan' }],
    kasbon: [
      { id: 'kb-1', shipId: 'ship-1', crewId: 'cr-2', crewName: 'Budi Santoso', rank: 'KKM', amount: 3000000, date: iso(now - 4 * D), reason: 'Kebutuhan mendesak keluarga (biaya pendidikan anak)', status: 'pending', installmentMonths: 3, approvedBy: null, approvedAt: null, notes: 'Pengajuan via Admin Kapal' }
    ],
    activities: [
      { id: 'act-1', shipId: 'ship-1', type: 'drill', title: 'Fire Drill (Latihan Pemadaman Kebakaran Mesin)', date: iso(now - 7 * D), pic: 'Nakhoda & Chief Engineer', participants: 'Seluruh Awak Kapal (14 orang)', result: 'Latihan berjalan 12 menit, respon cepat sesuai SOLAS', status: 'completed' },
      { id: 'act-2', shipId: 'ship-1', type: 'drill', title: 'Abandon Ship Drill (Sekoci Penolong & Lifeboat)', date: iso(now - 14 * D), pic: 'Mualim I', participants: 'Seluruh Kru Onboard', result: 'Peluncuran life raft berhasil diverifikasi', status: 'completed' },
      { id: 'act-3', shipId: 'ship-1', type: 'meeting', title: 'Safety Committee Meeting Bulanan', date: iso(now - 2 * D), pic: 'Safety Officer', participants: 'Perwira & Perwakilan ABK', result: 'Review APD, nihil insiden keselamatan', status: 'completed' },
      { id: 'act-4', shipId: 'ship-1', type: 'training', title: 'ISM Code & MARPOL Briefing', date: iso(now + 5 * D), pic: 'DPA / Fleet Safety', participants: 'Kru Mesin & Dek', result: 'Terjadwal persiapan audit eksternal', status: 'scheduled' }
    ],
    shipDocuments: [{ id: 'doc-1', shipId: 'ship-1', type: 'SMC', issuedAt: iso(now - 800 * D), expiredAt: iso(now + 55 * D) }, { id: 'doc-2', shipId: 'ship-1', type: 'Class Certificate', issuedAt: iso(now - 900 * D), expiredAt: iso(now + 6 * D) }],
    notificationConfigs: [{ id: 'nc-1', targetType: 'crew-certificate', thresholds: [90, 60, 30, 14, 7, 1] }, { id: 'nc-2', targetType: 'ship-document', thresholds: [90, 60, 30, 14, 7, 1] }, { id: 'nc-3', targetType: 'maintenance', thresholds: [14, 7, 1] }],
    notificationLogs: [],
    auditLogs: [],
    attachments: [],
    provider: { wa: 'mock', push: 'mock' },
    workOrderChecks: [{ id: 'wc-1', workOrderId: 'wo-1', title: 'Siapkan tools & APD', done: false }, { id: 'wc-1b', workOrderId: 'wo-1', title: 'Ganti oli + filter, catat RH', done: false }],
    workOrderApprovals: []
  };
}
export function loadDb() {
  if (globalThis.__pmsDb) return globalThis.__pmsDb;
  let d;
  const tmpPath = path.join('/tmp', 'pms-data.json');
  if (fs.existsSync(tmpPath)) {
    try { d = JSON.parse(fs.readFileSync(tmpPath, 'utf8')); } catch {}
  }
  if (!d && fs.existsSync(DB)) {
    try { d = JSON.parse(fs.readFileSync(DB, 'utf8')); } catch {}
  }
  if (!d) {
    d = seed();
    try { fs.writeFileSync(DB, JSON.stringify(d, null, 2)); } catch {}
  } else {
    if (!d.attachments) d.attachments = [];
    if (!d.sparepartUsages) d.sparepartUsages = [];
    if (!d.sparepartRequisitions) d.sparepartRequisitions = [];
    if (!d.kasbon) d.kasbon = [];
    if (!d.activities) d.activities = [];
    if (!d.attendances) d.attendances = [];
    if (!d.provider) d.provider = { wa: 'mock', push: 'mock' };
    if (!d.notificationLogs) d.notificationLogs = [];
    if (!d.auditLogs) d.auditLogs = [];
    if (!d.workOrderChecks) d.workOrderChecks = [];
    if (!d.workOrderApprovals) d.workOrderApprovals = [];
    for (const s of d.ships || []) { if (s.size === undefined) s.size = ''; if (s.photo === undefined) s.photo = ''; }
    for (const e of d.equipments || []) { if (e.parentId === undefined) e.parentId = null; }
    for (const c of d.crews || []) { if (c.photo === undefined) c.photo = ''; if (!Array.isArray(c.contracts)) c.contracts = []; }
  }
  globalThis.__pmsDb = d;
  return d;
}
export function saveDb(db) {
  globalThis.__pmsDb = db;
  try {
    fs.writeFileSync(DB, JSON.stringify(db, null, 2));
  } catch (e) {
    try {
      const tmpPath = path.join('/tmp', 'pms-data.json');
      fs.writeFileSync(tmpPath, JSON.stringify(db, null, 2));
    } catch {}
  }
}
export function audit(db, user, action, entity, entityId) {
  db.auditLogs.unshift({ id: 'log-' + Date.now(), user: user?.username || 'system', action, entity, entityId, at: new Date().toISOString() });
  if (db.auditLogs.length > 500) db.auditLogs.length = 500;
}
export function expiryStatus(expiredAt, soonDays = 30) {
  const diff = Math.ceil((new Date(expiredAt) - new Date()) / 86400000);
  if (diff < 0) return { status: 'expired', sisaHari: diff };
  if (diff <= soonDays) return { status: 'mendekati-expired', sisaHari: diff };
  return { status: 'aktif', sisaHari: diff };
}
