async function postJSON(p, data, method) {
  return api(p, { method: method || 'POST', body: JSON.stringify(data) });
}
async function del(p) { return api(p, { method: 'DELETE' }); }
async function approveLeave(id, status) {
  await postJSON('/leaves/' + id + '/approve', { status });
  alert('Cuti ' + status); loadShip(); renderKelola();
}
async function saveThresholds() {
  const g = (id) => document.getElementById(id).value.split(',').map((x) => Number(x.trim())).filter((x) => !isNaN(x));
  for (const t of ['crew-certificate', 'ship-document', 'maintenance']) {
    const list = await api('/notification-configs');
    const cfg = list.find((x) => x.targetType === t);
    if (cfg) await api('/notification-configs/' + cfg.id, { method: 'PUT', body: JSON.stringify({ thresholds: g('th-' + t) }) });
  }
  alert('Threshold tersimpan'); loadShip();
}
async function saveProvider() {
  const j = await postJSON('/notifications/provider', { wa: document.getElementById('pv-wa').value, push: document.getElementById('pv-push').value });
  alert('Provider: WA=' + j.wa + ', Push=' + j.push);
}
async function renderKelola() {
  const id = document.getElementById('shipSel').value;
  const cfgs = await api('/notification-configs');
  const pv = await api('/notifications/provider');
  const th = (t) => (cfgs.find((x) => x.targetType === t)?.thresholds || []).join(',');
  const audits = await api('/audit-logs');
  const parts = await api('/spareparts?shipId=' + id);
  document.getElementById('c-kelola').innerHTML = '<h2>Kelola Data (kapal ' + id + ')</h2>'
    + '<form class="card" onsubmit="return addWO(event)"><b>+ Work Order</b><br><input id="f-wo-t" placeholder="Judul" required><input id="f-wo-a" placeholder="Teknisi"><button>Simpan</button></form>'
    + '<form class="card" onsubmit="return addCost(event)"><b>+ Biaya</b><br><select id="f-c-k"><option value="sparepart">sparepart</option><option value="jasa">jasa</option><option value="docking">docking</option></select><input id="f-c-n" type="number" placeholder="Nominal" required><input id="f-c-note" placeholder="Catatan"><button>Simpan</button></form>'
    + '<form class="card" onsubmit="return addPart(event)"><b>+ Sparepart</b><br><input id="f-s-code" placeholder="Kode" required><input id="f-s-n" placeholder="Nama" required><input id="f-s-st" type="number" placeholder="Stok" value="0"><input id="f-s-min" type="number" placeholder="Min" value="5"><button>Simpan</button></form>'
    + '<form class="card" onsubmit="return usePart(event)"><b>Pakai Sparepart (stok otomatis berkurang)</b><br><select id="f-u-id">' + parts.map((p) => '<option value="' + p.id + '">' + p.code + ' — ' + p.name + ' (stok ' + p.stock + ')</option>').join('') + '</select><input id="f-u-qty" type="number" value="1" min="1"><input id="f-u-note" placeholder="Untuk WO apa?"><button>Catat Pemakaian</button></form>'
    + '<form class="card" onsubmit="return closeWO(event)"><b>Tutup WO (selesai)</b><br><input id="f-w-id" placeholder="ID WO (lihat tabel WO)"><button>Tutup</button></form>'
    + '<form class="card" onsubmit="return addDoc(event)"><b>+ Surat Kapal</b><br><input id="f-d-t" placeholder="Jenis dokumen" required><input id="f-d-e" type="date" required><button>Simpan</button></form>'
    + '<div class="card"><b>Upload Scan (sertifikat/surat, maks ~2MB)</b><br><select id="f-up-t"><option value="ship-document">surat kapal</option><option value="crew-certificate">sertifikat crew</option></select><input id="f-up-ref" placeholder="ID dokumen/sertifikat"><input id="f-up-f" type="file"><button onclick="uploadScan(event)">Upload</button> <span class="small" id="up-msg"></span></div>'
    + '<div class="card"><b>Threshold Notifikasi (H-.., pisah koma)</b><br>Sertifikat crew: <input id="th-crew-certificate" value="' + th('crew-certificate') + '"><br>Surat kapal: <input id="th-ship-document" value="' + th('ship-document') + '"><br>Maintenance: <input id="th-maintenance" value="' + th('maintenance') + '"><br><button onclick="saveThresholds()">Simpan Threshold</button></div>'
    + '<div class="card"><b>Provider Notifikasi</b><br>WA: <select id="pv-wa"><option>mock</option><option>wablas</option><option>qontak</option><option>twilio</option></select> Push: <select id="pv-push"><option>mock</option><option>onesignal</option><option>fcm</option></select> <span class="small">aktif: ' + pv.wa + '/' + pv.push + '</span> <button onclick="saveProvider()">Simpan</button> <button class="ghost" onclick="backupDB()">Backup JSON</button></div>';
  document.getElementById('pv-wa').value = pv.wa; document.getElementById('pv-push').value = pv.push;
  document.getElementById('c-audit').innerHTML = '<h2>Audit Trail (' + audits.length + ')</h2><table><tr><th>Waktu</th><th>User</th><th>Aksi</th><th>Entitas</th></tr>' + audits.slice(0, 50).map((a) => '<tr><td>' + (a.at || '').slice(0, 19).replace('T', ' ') + '</td><td>' + a.user + '</td><td>' + a.action + '</td><td>' + a.entity + '/' + (a.entityId || '') + '</td></tr>').join('') + '</table>';
}
async function addWO(e) {
  e.preventDefault();
  await postJSON('/work-orders', { shipId: document.getElementById('shipSel').value, title: document.getElementById('f-wo-t').value, assignee: document.getElementById('f-wo-a').value, status: 'open', createdAt: new Date().toISOString() });
  loadShip(); renderKelola(); return false;
}
async function addCost(e) {
  e.preventDefault();
  await postJSON('/costs', { shipId: document.getElementById('shipSel').value, kind: document.getElementById('f-c-k').value, amount: Number(document.getElementById('f-c-n').value), note: document.getElementById('f-c-note').value, date: new Date().toISOString() });
  loadShip(); renderKelola(); return false;
}
async function addPart(e) {
  e.preventDefault();
  await postJSON('/spareparts', { shipId: document.getElementById('shipSel').value, code: document.getElementById('f-s-code').value, name: document.getElementById('f-s-n').value, stock: Number(document.getElementById('f-s-st').value), minStock: Number(document.getElementById('f-s-min').value) });
  loadShip(); renderKelola(); return false;
}
async function addDoc(e) {
  e.preventDefault();
  await postJSON('/ship-documents', { shipId: document.getElementById('shipSel').value, type: document.getElementById('f-d-t').value, issuedAt: new Date().toISOString(), expiredAt: new Date(document.getElementById('f-d-e').value).toISOString() });
  loadShip(); renderKelola(); return false;
}
async function usePart(e) {
  e.preventDefault();
  const r = await postJSON('/sparepart-usages', { sparepartId: document.getElementById('f-u-id').value, qty: Number(document.getElementById('f-u-qty').value), note: document.getElementById('f-u-note').value });
  alert(r.error || ('Pemakaian tercatat, sisa stok: ' + r.sisaStok));
  loadShip(); renderKelola(); return false;
}
async function closeWO(e) {
  e.preventDefault();
  const id = document.getElementById('f-w-id').value.trim();
  const r = await api('/work-orders/' + id, { method: 'PUT', body: JSON.stringify({ status: 'completed' }) });
  alert(r.error || 'WO ditutup');
  loadShip(); renderKelola(); loadKPI(); return false;
}
async function uploadScan(e) {
  e.preventDefault();
  const f = document.getElementById('f-up-f').files[0];
  if (!f) { alert('Pilih file dulu'); return false; }
  const buf = await f.arrayBuffer();
  let bin = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  const r = await postJSON('/attachments', { refType: document.getElementById('f-up-t').value, refId: document.getElementById('f-up-ref').value, name: f.name, mime: f.type, dataBase64: btoa(bin) });
  document.getElementById('up-msg').textContent = r.error || ('Tersimpan: ' + r.id);
  return false;
}
async function importCSV(kind) {
  const txt = document.getElementById('imp-' + kind).value;
  if (!txt.trim()) { alert('Tempel isi CSV dulu (lihat docs/template)'); return; }
  const r = await postJSON('/import/' + kind, { csv: txt });
  alert(r.error || ('Import OK: ' + r.imported + ' baris'));
  loadFleet(); loadShip();
}
async function addUser(e) {
  e.preventDefault();
  const r = await postJSON('/users', { username: document.getElementById('n-u').value, password: document.getElementById('n-p').value, name: document.getElementById('n-n').value, roleId: document.getElementById('n-r').value, shipId: document.getElementById('n-s').value || null });
  alert(r.error || ('User dibuat: ' + r.username));
  renderPengaturan(); return false;
}
async function delUser(id) {
  if (!confirm('Hapus user ' + id + '?')) return;
  const r = await del('/users/' + id);
  alert(r.error || 'User dihapus');
  renderPengaturan();
}
async function renderPengaturan() {
  let users = [], roles = [];
  try { users = await api('/users'); } catch (e) { users = { error: e.message }; }
  try { roles = await api('/roles'); } catch (e) { roles = []; }
  document.getElementById('c-pengaturan').innerHTML = '<h2>Pengaturan — User & Role</h2>'
    + (users.error ? '<p class="small">Modul user khusus super-admin (' + users.error + '). Role tersedia: ' + roles.map((r) => r.id).join(', ') + '</p>'
      : '<table><tr><th>Username</th><th>Nama</th><th>Role</th><th>Kapal</th><th>Aksi</th></tr>' + users.map((u) => '<tr><td>' + u.username + '</td><td>' + u.name + '</td><td>' + u.roleId + '</td><td>' + (u.shipId || 'semua') + '</td><td><button class="danger" onclick="delUser(\'' + u.id + '\')">Hapus</button></td></tr>').join('') + '</table>'
      + '<form class="card" onsubmit="return addUser(event)"><b>+ User baru</b><br><input id="n-u" placeholder="username" required><input id="n-p" placeholder="password" required><input id="n-n" placeholder="nama"><select id="n-r">' + roles.map((r) => '<option value="' + r.id + '">' + r.name + '</option>').join('') + '</select><input id="n-s" placeholder="shipId (opsional)"><button>Buat</button></form>')
    + '<div class="card"><b>Import CSV</b> (format: lihat docs/template-kapal.csv & template-crew.csv)<br>Kapal:<br><textarea id="imp-ships" rows="3" cols="60" placeholder="nama,imo,jenis,flag\nKM Baru 05,IMO-9000005,Cargo,Indonesia"></textarea><br><button onclick="importCSV(\'ships\')">Import Kapal</button><br><br>Crew:<br><textarea id="imp-crews" rows="3" cols="60" placeholder="nama,rank,phone,kapal\nJoko,ABK,62812,KM Nusantara 01"></textarea><br><button onclick="importCSV(\'crews\')">Import Crew</button></div>';
}
