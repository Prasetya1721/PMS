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
  document.getElementById('c-kelola').innerHTML = '<h2>Kelola Data (kapal ' + id + ')</h2>'
    + '<form class="card" onsubmit="return addWO(event)"><b>+ Work Order</b><br><input id="f-wo-t" placeholder="Judul" required><input id="f-wo-a" placeholder="Teknisi"><button>Simpan</button></form>'
    + '<form class="card" onsubmit="return addCost(event)"><b>+ Biaya</b><br><select id="f-c-k"><option value="sparepart">sparepart</option><option value="jasa">jasa</option><option value="docking">docking</option></select><input id="f-c-n" type="number" placeholder="Nominal" required><input id="f-c-note" placeholder="Catatan"><button>Simpan</button></form>'
    + '<form class="card" onsubmit="return addPart(event)"><b>+ Sparepart</b><br><input id="f-s-code" placeholder="Kode" required><input id="f-s-n" placeholder="Nama" required><input id="f-s-st" type="number" placeholder="Stok" value="0"><input id="f-s-min" type="number" placeholder="Min" value="5"><button>Simpan</button></form>'
    + '<form class="card" onsubmit="return addDoc(event)"><b>+ Surat Kapal</b><br><input id="f-d-t" placeholder="Jenis dokumen" required><input id="f-d-e" type="date" required><button>Simpan</button></form>'
    + '<div class="card"><b>Threshold Notifikasi (H-.., pisah koma)</b><br>Sertifikat crew: <input id="th-crew-certificate" value="' + th('crew-certificate') + '"><br>Surat kapal: <input id="th-ship-document" value="' + th('ship-document') + '"><br>Maintenance: <input id="th-maintenance" value="' + th('maintenance') + '"><br><button onclick="saveThresholds()">Simpan Threshold</button></div>'
    + '<div class="card"><b>Provider Notifikasi</b><br>WA: <select id="pv-wa"><option>mock</option><option>wablas</option><option>qontak</option><option>twilio</option></select> Push: <select id="pv-push"><option>mock</option><option>onesignal</option><option>fcm</option></select> <span class="small">aktif: ' + pv.wa + '/' + pv.push + '</span> <button onclick="saveProvider()">Simpan</button></div>';
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
