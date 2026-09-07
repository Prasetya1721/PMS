const API = 'http://localhost:4000/api';
let token = localStorage.getItem('pms-token');
const rp = (n) => 'Rp' + Number(n || 0).toLocaleString('id-ID');
const badge = (s) => '<span class="badge ' + s + '">' + s + '</span>';
async function api(p, opt) {
  opt = opt || {};
  const r = await fetch(API + p, { method: opt.method || 'GET', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: opt.body });
  if (r.status === 401) { logout(); throw new Error('sesi habis'); }
  return r.json();
}
async function login() {
  const r = await fetch(API + '/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: document.getElementById('u').value, password: document.getElementById('p').value }) });
  const j = await r.json();
  if (!j.token) { document.getElementById('err').textContent = j.error || 'gagal'; return; }
  token = j.token; localStorage.setItem('pms-token', token); boot();
}
function logout() { localStorage.removeItem('pms-token'); location.reload(); }
async function boot() {
  const ships = await api('/ships');
  document.getElementById('login').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('shipSel').innerHTML = ships.map((s) => '<option value="' + s.id + '">' + s.name + '</option>').join('');
  loadFleet(); loadShip(); renderKelola();
}
async function loadFleet() {
  const j = await api('/dashboard/fleet');
  document.getElementById('c-fleet').innerHTML = '<h2>Dashboard Fleet (' + j.ships.length + ' kapal, sortir urgensi)</h2><div class="grid">' + j.ships.map((s) => '<div class="card"><b>' + s.name + '</b><br><span class="small">' + s.imo + '</span><br>Urgensi: <b>' + s.urgency + '</b><br>Dok: ' + s.expiredDocs + ' • Sert: ' + s.expiredCerts + '<br>Overdue: ' + s.overdue + ' • Stok rendah: ' + s.lowStock + '</div>').join('') + '</div>';
}
async function loadShip() {
  const id = document.getElementById('shipSel').value; if (!id) return;
  const j = await api('/dashboard/ship/' + id);
  let eqRows = j.equipments.map((e) => (e.schedules.length ? e.schedules.map((s) => '<tr><td>' + e.name + '</td><td>' + (e.runningHours || '-') + '</td><td>' + s.title + '</td><td>' + (s.nextDueAt || '').slice(0, 10) + '</td><td>' + badge(s.status) + '</td></tr>').join('') : '<tr><td>' + e.name + '</td><td colspan="4">-</td></tr>')).join('');
  document.getElementById('c-kapal').innerHTML = '<h2>' + (j.ship ? j.ship.name : '') + '</h2><div class="grid"><div class="card">Total Biaya<br><b>' + rp(j.totalBiaya) + '</b><br><span class="small">Budget ' + rp(j.budget && j.budget.amount) + '</span></div><div class="card">Equipment<br><b>' + j.equipments.length + '</b></div><div class="card">Crew<br><b>' + j.crews.length + '</b></div><div class="card">Cuti pending<br><b>' + j.leaves.filter((l) => l.status === 'pending').length + '</b></div></div><h2>Equipment & Jadwal</h2><table><tr><th>Eq</th><th>RH</th><th>Jadwal</th><th>Due</th><th>Status</th></tr>' + eqRows + '</table><h2>Sparepart</h2><table><tr><th>Kode</th><th>Nama</th><th>Stok</th><th>Status</th></tr>' + j.spareparts.map((p) => '<tr><td>' + p.code + '</td><td>' + p.name + '</td><td>' + p.stock + '/' + p.minStock + '</td><td>' + (p.low ? badge('low') : 'ok') + '</td></tr>').join('') + '</table>';
  document.getElementById('c-crew').innerHTML = '<h2>Crew & Sertifikat</h2><table><tr><th>Crew</th><th>Sertifikat</th><th>Expired</th><th>Status</th></tr>' + j.crews.map((c) => c.certificates.map((x) => '<tr><td>' + c.name + ' (' + c.rank + ')</td><td>' + x.type + '</td><td>' + (x.expiredAt || '').slice(0, 10) + '</td><td>' + badge(x.status) + '</td></tr>').join('')).join('') + '</table>';
  document.getElementById('c-dok').innerHTML = '<h2>Surat Kapal</h2><table><tr><th>Dokumen</th><th>s/d</th><th>Status</th></tr>' + j.documents.map((d) => '<tr><td>' + d.type + '</td><td>' + (d.expiredAt || '').slice(0, 10) + ' (H' + d.sisaHari + ')</td><td>' + badge(d.status) + '</td></tr>').join('') + '</table>';
  document.getElementById('c-wo').innerHTML = '<h2>Work Order & Kegiatan</h2><table>' + j.workOrders.map((w) => '<tr><td>' + w.title + '</td><td>' + (w.assignee || '-') + '</td><td>' + badge(w.status) + '</td></tr>').join('') + '</table>';
  const rep = await api('/reports/costs?shipId=' + id);
  document.getElementById('c-biaya').innerHTML = '<h2>Biaya</h2><div class="grid"><div class="card">Budget<b><br>' + rp(rep.budget) + '</b></div><div class="card">Actual<b><br>' + rp(rep.total) + '</b></div><div class="card">Sisa<b><br>' + rp(rep.sisa) + '</b></div></div><table>' + rep.items.map((c) => '<tr><td>' + (c.date || '').slice(0, 10) + '</td><td>' + c.kind + '</td><td>' + (c.note || '') + '</td><td>' + rp(c.amount) + '</td></tr>').join('') + '</table><br><button onclick="exportCSV(\'' + id + '\')">Export CSV</button>';
  const leaves = await api('/leaves?shipId=' + id);
  document.getElementById('c-biaya').innerHTML += '<h2>Pengajuan Cuti</h2><table><tr><th>Crew</th><th>Periode</th><th>Status</th><th>Aksi</th></tr>' + leaves.map((l) => '<tr><td>' + l.crewId + '</td><td>' + (l.startDate || '').slice(0, 10) + ' s/d ' + (l.endDate || '').slice(0, 10) + '</td><td>' + l.status + '</td><td>' + (l.status === 'pending' ? '<button class="okbtn" onclick="approveLeave(\'' + l.id + '\',\'approved\')">Setujui</button> <button class="danger" onclick="approveLeave(\'' + l.id + '\',\'rejected\')">Tolak</button>' : (l.approvedBy || '')) + '</td></tr>').join('') + '</table>';
  const nl = await api('/notification-logs');
  document.getElementById('c-notif').innerHTML = '<h2>Log Notifikasi (' + nl.length + ')</h2><table>' + nl.slice(0, 30).map((n) => '<tr><td>' + (n.at || '').slice(0, 19).replace('T', ' ') + '</td><td>' + n.targetType + ' -&gt; ' + n.target + '</td><td>' + n.channel + '</td><td>' + n.status + '</td></tr>').join('') + '</table>';
}
async function runSched() { const j = await api('/scheduler/run', { method: 'POST' }); alert('Reminder mock terkirim: ' + j.sent); loadShip(); }
async function exportCSV(id) { const j = await api('/reports/costs?shipId=' + id); const csv = 'tanggal,jenis,catatan,nominal\n' + j.items.map((c) => (c.date || '').slice(0, 10) + ',' + c.kind + ',"' + (c.note || '') + '",' + c.amount).join('\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'biaya-' + id + '.csv'; a.click(); }
function show(id) { const el = document.getElementById('c-' + id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }
if (token) boot();
