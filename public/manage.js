/* ══════════════════════════════════════════════════════════════════
   PMS KAPAL — manage.js (Modals & Data Management System)
   ══════════════════════════════════════════════════════════════════ */

/* ── HTTP Helpers ───────────────────────────────────────────────── */
async function postJSON(p, data, method = 'POST') {
  return api(p, { method, body: JSON.stringify(data) });
}

async function del(p) {
  return api(p, { method: 'DELETE' });
}

function fileToDataURL(f) {
  return new Promise((res, rej) => {
    const rd = new FileReader();
    rd.onload = () => res(rd.result);
    rd.onerror = rej;
    rd.readAsDataURL(f);
  });
}

/* ── Universal Modal Controllers ────────────────────────────────── */
function openModal(title, icon, bodyHtml) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-icon').textContent = icon || '⚙️';
  document.getElementById('modal-body').innerHTML = bodyHtml;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal-body').innerHTML = '';
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('modal-overlay')) {
    closeModal();
  }
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !document.getElementById('modal-overlay').classList.contains('hidden')) {
    closeModal();
  }
});

/* ── Confirm Modal Dialog ───────────────────────────────────────── */
function confirmAction(title, message, onConfirm) {
  openModal(
    title,
    '⚠️',
    `
    <p style="font-size:14px;color:var(--text-main);margin-bottom:20px;line-height:1.6;">${message}</p>
    <div class="modal-footer" style="padding:0;background:transparent;border:0;">
      <button class="btn btn-ghost" onclick="closeModal()">Batal</button>
      <button class="btn btn-danger" id="btn-confirm-yes">Ya, Lanjutkan</button>
    </div>`
  );
  document.getElementById('btn-confirm-yes').onclick = () => {
    closeModal();
    onConfirm();
  };
}

/* ══════════════════════════════════════════════════════════════════
   MODAL OPENERS FOR APPLICATION ACTIONS
   ══════════════════════════════════════════════════════════════════ */

/* ── 1. Modal: Tambah Work Order ────────────────────────────────── */
function openModalAddWO() {
  const shipOptions = allShips.map(s => 
    `<option value="${s.id}" ${s.id === activeShipId ? 'selected' : ''}>${s.name}</option>`
  ).join('');

  openModal(
    'Buat Work Order Baru',
    '🔧',
    `
    <form onsubmit="return handleAddWO(event)">
      <div class="form-group" style="margin-bottom:14px;">
        <label class="form-label">Kapal Tujuan</label>
        <select id="m-wo-ship" class="form-select">${shipOptions}</select>
      </div>
      <div class="form-group" style="margin-bottom:14px;">
        <label class="form-label">Judul / Uraian Pekerjaan</label>
        <input id="m-wo-title" class="form-input" placeholder="Contoh: Overhaul Mesin Bantu #1" required autofocus>
      </div>
      <div class="form-group" style="margin-bottom:18px;">
        <label class="form-label">Teknisi Penanggung Jawab (Assignee)</label>
        <input id="m-wo-assignee" class="form-input" placeholder="Nama teknisi / tim mekanik">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Batal</button>
        <button type="submit" class="btn btn-primary">💾 Simpan Work Order</button>
      </div>
    </form>`
  );
}

async function handleAddWO(e) {
  e.preventDefault();
  const title = document.getElementById('m-wo-title').value.trim();
  const assignee = document.getElementById('m-wo-assignee').value.trim();
  const shipId = document.getElementById('m-wo-ship').value;

  try {
    const res = await postJSON('/work-orders', {
      shipId,
      title,
      assignee,
      status: 'open',
      createdAt: new Date().toISOString()
    });
    closeModal();
    toast(`Work Order dibuat: ${res.id}`, 'success');
    updateBadges();
    if (currentView === 'wo') loadWorkOrders();
    if (currentView === 'kapal') loadShip();
  } catch (err) {
    toast('Gagal membuat Work Order: ' + err.message, 'error');
  }
  return false;
}

/* ── 2. Modal: Tambah Checklist Work Order ──────────────────────── */
function openModalAddCheck(woId) {
  openModal(
    'Tambah Item Checklist WO',
    '✅',
    `
    <form onsubmit="return handleAddCheck(event, '${woId}')">
      <div class="form-group" style="margin-bottom:14px;">
        <label class="form-label">ID Work Order</label>
        <input class="form-input mono" value="${woId}" disabled>
      </div>
      <div class="form-group" style="margin-bottom:18px;">
        <label class="form-label">Item Checklist Pekerjaan</label>
        <input id="m-ch-title" class="form-input" placeholder="Contoh: Periksa filter oli dan kencangkan baut" required autofocus>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Batal</button>
        <button type="submit" class="btn btn-primary">💾 Tambah Checklist</button>
      </div>
    </form>`
  );
}

async function handleAddCheck(e, woId) {
  e.preventDefault();
  const title = document.getElementById('m-ch-title').value.trim();
  try {
    await postJSON('/work-order-checks', { workOrderId: woId, title });
    closeModal();
    toast('Checklist berhasil ditambahkan', 'success');
    if (currentView === 'wo') loadWorkOrders();
  } catch (err) {
    toast('Gagal menambahkan checklist: ' + err.message, 'error');
  }
  return false;
}

async function toggleCheckItem(id, done) {
  try {
    await api('/work-order-checks/' + id, {
      method: 'PUT',
      body: JSON.stringify({ done: !done })
    });
    toast('Checklist diperbarui', 'info', 1500);
    if (currentView === 'wo') loadWorkOrders();
  } catch (err) {
    toast('Gagal memperbarui checklist: ' + err.message, 'error');
  }
}

/* ── 3. Modal: Tambah Biaya ─────────────────────────────────────── */
function openModalAddCost() {
  const shipOptions = allShips.map(s => 
    `<option value="${s.id}" ${s.id === activeShipId ? 'selected' : ''}>${s.name}</option>`
  ).join('');

  openModal(
    'Catat Pengeluaran / Biaya',
    '💰',
    `
    <form onsubmit="return handleAddCost(event)">
      <div class="form-group" style="margin-bottom:14px;">
        <label class="form-label">Kapal Terkait</label>
        <select id="m-cost-ship" class="form-select">${shipOptions}</select>
      </div>
      <div class="form-group" style="margin-bottom:14px;">
        <label class="form-label">Kategori Pengeluaran</label>
        <select id="m-cost-kind" class="form-select">
          <option value="sparepart">📦 Suku Cadang (Sparepart)</option>
          <option value="jasa">🔧 Jasa Teknisi / Reparasi</option>
          <option value="docking">⚓ Docking & Perawatan Tahunan</option>
          <option value="sertifikasi">📄 Biaya Sertifikasi / Klas</option>
          <option value="operasional">⚙️ Biaya Operasional Lainnya</option>
        </select>
      </div>
      <div class="form-group" style="margin-bottom:14px;">
        <label class="form-label">Nominal Biaya (Rupiah)</label>
        <input id="m-cost-amount" type="number" class="form-input mono" placeholder="Contoh: 15000000" min="0" required>
      </div>
      <div class="form-group" style="margin-bottom:18px;">
        <label class="form-label">Catatan / Keterangan Pembelian</label>
        <textarea id="m-cost-note" class="form-textarea" rows="3" placeholder="Uraian pekerjaan atau nomor invoice..."></textarea>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Batal</button>
        <button type="submit" class="btn btn-primary">💾 Simpan Catatan Biaya</button>
      </div>
    </form>`
  );
}

async function handleAddCost(e) {
  e.preventDefault();
  const shipId = document.getElementById('m-cost-ship').value;
  const kind = document.getElementById('m-cost-kind').value;
  const amount = Number(document.getElementById('m-cost-amount').value);
  const note = document.getElementById('m-cost-note').value.trim();

  try {
    await postJSON('/costs', {
      shipId,
      kind,
      amount,
      note,
      date: new Date().toISOString()
    });
    closeModal();
    toast(`Biaya ${rp(amount)} berhasil dicatat`, 'success');
    if (currentView === 'biaya') loadBiaya();
    if (currentView === 'kapal') loadShip();
  } catch (err) {
    toast('Gagal mencatat biaya: ' + err.message, 'error');
  }
  return false;
}

/* ── 4. Modal: Tambah Sparepart ─────────────────────────────────── */
function openModalAddPart() {
  const shipOptions = allShips.map(s => 
    `<option value="${s.id}" ${s.id === activeShipId ? 'selected' : ''}>${s.name}</option>`
  ).join('');

  openModal(
    'Tambah Suku Cadang (Sparepart)',
    '📦',
    `
    <form onsubmit="return handleAddPart(event)">
      <div class="form-group" style="margin-bottom:14px;">
        <label class="form-label">Kapal Penyimpanan</label>
        <select id="m-part-ship" class="form-select">${shipOptions}</select>
      </div>
      <div class="form-group" style="margin-bottom:14px;">
        <label class="form-label">Kode Sparepart</label>
        <input id="m-part-code" class="form-input mono" placeholder="Contoh: SP-ME-002" required>
      </div>
      <div class="form-group" style="margin-bottom:14px;">
        <label class="form-label">Nama Barang / Spesifikasi</label>
        <input id="m-part-name" class="form-input" placeholder="Contoh: Piston Ring Set #3" required>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px;">
        <div>
          <label class="form-label">Jumlah Stok Awal</label>
          <input id="m-part-stock" type="number" class="form-input mono" value="5" min="0" required>
        </div>
        <div>
          <label class="form-label">Batas Stok Minimum</label>
          <input id="m-part-min" type="number" class="form-input mono" value="2" min="0" required>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Batal</button>
        <button type="submit" class="btn btn-primary">💾 Simpan Sparepart</button>
      </div>
    </form>`
  );
}

async function handleAddPart(e) {
  e.preventDefault();
  const shipId = document.getElementById('m-part-ship').value;
  const code = document.getElementById('m-part-code').value.trim();
  const name = document.getElementById('m-part-name').value.trim();
  const stock = Number(document.getElementById('m-part-stock').value);
  const minStock = Number(document.getElementById('m-part-min').value);

  try {
    await postJSON('/spareparts', { shipId, code, name, stock, minStock });
    closeModal();
    toast(`Sparepart ${name} berhasil disimpan`, 'success');
    updateBadges();
    if (currentView === 'sparepart') loadSpareparts();
  } catch (err) {
    toast('Gagal menambahkan sparepart: ' + err.message, 'error');
  }
  return false;
}

/* ── 5. Modal: Gunakan Sparepart ────────────────────────────────── */
async function openModalUsePart() {
  setLoading('sparepart', 'Menyiapkan form pemakaian suku cadang');
  try {
    const parts = await api('/spareparts?shipId=' + activeShipId);
    if (!parts.length) {
      loadSpareparts();
      toast('Belum ada sparepart di kapal ini', 'warning');
      return;
    }

    const partOptions = parts.map(p => 
      `<option value="${p.id}">${p.code} — ${p.name} (Tersedia: ${p.stock})</option>`
    ).join('');

    openModal(
      'Catat Pemakaian Suku Cadang',
      '📤',
      `
      <form onsubmit="return handleUsePart(event)">
        <div class="form-group" style="margin-bottom:14px;">
          <label class="form-label">Pilih Sparepart</label>
          <select id="m-use-id" class="form-select">${partOptions}</select>
        </div>
        <div class="form-group" style="margin-bottom:14px;">
          <label class="form-label">Jumlah Pemakaian (Unit)</label>
          <input id="m-use-qty" type="number" class="form-input mono" value="1" min="1" required>
        </div>
        <div class="form-group" style="margin-bottom:18px;">
          <label class="form-label">Keterangan / Nomor WO</label>
          <input id="m-use-note" class="form-input" placeholder="Untuk pekerjaan perawatan apa?">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost" onclick="closeModal()">Batal</button>
          <button type="submit" class="btn btn-primary">💾 Catat Pemakaian</button>
        </div>
      </form>`
    );
    loadSpareparts();
  } catch (err) {
    loadSpareparts();
    toast('Gagal memuat suku cadang: ' + err.message, 'error');
  }
}

function quickUsePartModal(partId, partName, currentStock) {
  openModal(
    'Catat Pemakaian ' + partName,
    '📤',
    `
    <form onsubmit="return handleUsePart(event)">
      <input type="hidden" id="m-use-id" value="${partId}">
      <div class="form-group" style="margin-bottom:14px;">
        <label class="form-label">Barang</label>
        <input class="form-input" value="${partName} (Tersedia: ${currentStock})" disabled>
      </div>
      <div class="form-group" style="margin-bottom:14px;">
        <label class="form-label">Jumlah Pemakaian</label>
        <input id="m-use-qty" type="number" class="form-input mono" value="1" min="1" max="${currentStock}" required autofocus>
      </div>
      <div class="form-group" style="margin-bottom:18px;">
        <label class="form-label">Keterangan / Nomor WO</label>
        <input id="m-use-note" class="form-input" placeholder="Contoh: Digunakan pada WO-2026-001">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Batal</button>
        <button type="submit" class="btn btn-primary">💾 Catat Pengurangan Stok</button>
      </div>
    </form>`
  );
}

async function handleUsePart(e) {
  e.preventDefault();
  const sparepartId = document.getElementById('m-use-id').value;
  const qty = Number(document.getElementById('m-use-qty').value);
  const note = document.getElementById('m-use-note').value.trim();

  try {
    const r = await postJSON('/sparepart-usages', { sparepartId, qty, note });
    closeModal();
    toast(`Pemakaian ${qty} unit tercatat. Sisa stok: ${r.sisaStok}`, 'success');
    updateBadges();
    if (currentView === 'sparepart') loadSpareparts();
  } catch (err) {
    toast('Gagal mencatat pemakaian: ' + err.message, 'error');
  }
  return false;
}

/* ── 6. Modal: Tambah Surat Kapal ───────────────────────────────── */
function openModalAddDoc() {
  const shipOptions = allShips.map(s => 
    `<option value="${s.id}" ${s.id === activeShipId ? 'selected' : ''}>${s.name}</option>`
  ).join('');

  openModal(
    'Tambah Surat & Dokumen Kapal',
    '📄',
    `
    <form onsubmit="return handleAddDoc(event)">
      <div class="form-group" style="margin-bottom:14px;">
        <label class="form-label">Kapal Terkait</label>
        <select id="m-doc-ship" class="form-select">${shipOptions}</select>
      </div>
      <div class="form-group" style="margin-bottom:14px;">
        <label class="form-label">Jenis Dokumen / Sertifikat Statuter</label>
        <input id="m-doc-type" class="form-input" placeholder="Contoh: Surat Ukur Kebangsaan / SMC" required autofocus>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px;">
        <div>
          <label class="form-label">Tanggal Terbit</label>
          <input id="m-doc-issued" type="date" class="form-input">
        </div>
        <div>
          <label class="form-label">Berlaku Sampai (Expired)</label>
          <input id="m-doc-expired" type="date" class="form-input" required>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Batal</button>
        <button type="submit" class="btn btn-primary">💾 Simpan Dokumen</button>
      </div>
    </form>`
  );
}

async function handleAddDoc(e) {
  e.preventDefault();
  const shipId = document.getElementById('m-doc-ship').value;
  const type = document.getElementById('m-doc-type').value.trim();
  const issuedAt = document.getElementById('m-doc-issued').value || new Date().toISOString();
  const expiredAt = new Date(document.getElementById('m-doc-expired').value).toISOString();

  try {
    await postJSON('/ship-documents', {
      shipId,
      type,
      issuedAt: new Date(issuedAt).toISOString(),
      expiredAt
    });
    closeModal();
    toast(`Surat kapal ${type} berhasil disimpan`, 'success');
    updateBadges();
    if (currentView === 'dok') loadDocuments();
  } catch (err) {
    toast('Gagal menyimpan dokumen: ' + err.message, 'error');
  }
  return false;
}

/* ── 7. Modal: Upload Scan Dokumen / Sertifikat ─────────────────── */
function openModalUploadScan(refType = 'ship-document', refId = '') {
  openModal(
    'Upload Scan Lampiran Dokumen',
    '📎',
    `
    <form onsubmit="return handleUploadScan(event)">
      <div class="form-group" style="margin-bottom:14px;">
        <label class="form-label">Kategori Dokumen</label>
        <select id="m-up-type" class="form-select">
          <option value="ship-document" ${refType === 'ship-document' ? 'selected' : ''}>📄 Surat Kapal (Ship Document)</option>
          <option value="crew-certificate" ${refType === 'crew-certificate' ? 'selected' : ''}>🎓 Sertifikat Pelaut (Crew Certificate)</option>
        </select>
      </div>
      <div class="form-group" style="margin-bottom:14px;">
        <label class="form-label">ID Dokumen / Sertifikat</label>
        <input id="m-up-ref" class="form-input mono" placeholder="Contoh: doc-1 atau cr-1" value="${refId}">
      </div>
      <div class="form-group" style="margin-bottom:18px;">
        <label class="form-label">Pilih Berkas Scan (PDF / Gambar maks 2MB)</label>
        <input id="m-up-file" type="file" class="form-input" accept="image/*,application/pdf" required>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Batal</button>
        <button type="submit" class="btn btn-primary">📤 Upload Berkas</button>
      </div>
    </form>`
  );
}

async function handleUploadScan(e) {
  e.preventDefault();
  const f = document.getElementById('m-up-file').files[0];
  if (!f) { toast('Pilih berkas terlebih dahulu', 'warning'); return false; }
  if (f.size > 2.5 * 1024 * 1024) { toast('Ukuran file melebihi batas 2.5MB', 'error'); return false; }

  const refType = document.getElementById('m-up-type').value;
  const refId = document.getElementById('m-up-ref').value.trim();

  try {
    const buf = await f.arrayBuffer();
    let bin = '';
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);

    const r = await postJSON('/attachments', {
      refType,
      refId,
      name: f.name,
      mime: f.type,
      dataBase64: btoa(bin)
    });

    closeModal();
    toast(`Scan tersimpan: ${r.id}`, 'success');
  } catch (err) {
    toast('Gagal mengunggah scan: ' + err.message, 'error');
  }
  return false;
}

/* ── 8. Modal: Sign-On Kontrak Crew ─────────────────────────────── */
async function openModalAddContract() {
  try {
    const list = await api('/crews?shipId=' + activeShipId);
    if (!list.length) {
      toast('Belum ada data crew di kapal ini', 'warning');
      return;
    }

    const crewOpts = list.map(c => `<option value="${c.id}">${c.name} (${c.rank})</option>`).join('');

    openModal(
      'Catat Kontrak & Sign-On Crew',
      '📋',
      `
      <form onsubmit="return handleAddContract(event)">
        <div class="form-group" style="margin-bottom:14px;">
          <label class="form-label">Pilih Awak Kapal</label>
          <select id="m-ct-crew" class="form-select">${crewOpts}</select>
        </div>
        <div class="form-group" style="margin-bottom:18px;">
          <label class="form-label">Tanggal Sign-On (Mulai Bertugas Onboard)</label>
          <input id="m-ct-date" type="date" class="form-input" value="${new Date().toISOString().slice(0, 10)}" required>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost" onclick="closeModal()">Batal</button>
          <button type="submit" class="btn btn-primary">💾 Catat Kontrak</button>
        </div>
      </form>`
    );
  } catch (err) {
    toast('Gagal memuat crew: ' + err.message, 'error');
  }
}

async function handleAddContract(e) {
  e.preventDefault();
  const crewId = document.getElementById('m-ct-crew').value;
  const signOnDate = document.getElementById('m-ct-date').value;

  try {
    const list = await api('/crews');
    const c = list.find(x => x.id === crewId);
    if (!c) { toast('Kru tidak ditemukan', 'error'); return false; }

    const contracts = [
      ...(c.contracts || []),
      { signOn: new Date(signOnDate).toISOString(), signOff: null, shipId: activeShipId }
    ];

    await api('/crews/' + crewId, {
      method: 'PUT',
      body: JSON.stringify({ contracts })
    });

    closeModal();
    toast('Kontrak Sign-On berhasil dicatat', 'success');
    if (currentView === 'crew') loadCrew();
  } catch (err) {
    toast('Gagal mencatat kontrak: ' + err.message, 'error');
  }
  return false;
}

/* ── 9. Modal: Crew Photo & Ship Meta ────────────────────────────── */
async function openModalCrewPhoto() {
  try {
    const list = await api('/crews?shipId=' + activeShipId);
    const crewOpts = list.map(c => `<option value="${c.id}">${c.name} (${c.rank})</option>`).join('');

    openModal(
      'Unggah Foto Awak Kapal',
      '👤',
      `
      <form onsubmit="return handleSaveCrewPhoto(event)">
        <div class="form-group" style="margin-bottom:14px;">
          <label class="form-label">Pilih Kru</label>
          <select id="m-ph-crew" class="form-select">${crewOpts}</select>
        </div>
        <div class="form-group" style="margin-bottom:18px;">
          <label class="form-label">Pilih Foto (JPG / PNG)</label>
          <input id="m-ph-file" type="file" class="form-input" accept="image/*" required>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost" onclick="closeModal()">Batal</button>
          <button type="submit" class="btn btn-primary">💾 Unggah Foto</button>
        </div>
      </form>`
    );
  } catch (err) {
    toast('Gagal memuat crew: ' + err.message, 'error');
  }
}

async function handleSaveCrewPhoto(e) {
  e.preventDefault();
  const crewId = document.getElementById('m-ph-crew').value;
  const f = document.getElementById('m-ph-file').files[0];
  if (!f) { toast('Pilih foto terlebih dahulu', 'warning'); return false; }

  try {
    const photo = await fileToDataURL(f);
    await api('/crews/' + crewId, {
      method: 'PUT',
      body: JSON.stringify({ photo })
    });
    closeModal();
    toast('Foto kru berhasil diperbarui', 'success');
    if (currentView === 'crew') loadCrew();
  } catch (err) {
    toast('Gagal menyimpan foto: ' + err.message, 'error');
  }
  return false;
}

function openModalShipMeta() {
  const curShip = allShips.find(s => s.id === activeShipId);
  openModal(
    'Ubah Data & Foto Kapal',
    '🚢',
    `
    <form onsubmit="return handleSaveShipMeta(event)">
      <div class="form-group" style="margin-bottom:14px;">
        <label class="form-label">Nama Kapal</label>
        <input class="form-input" value="${curShip?.name || ''}" disabled>
      </div>
      <div class="form-group" style="margin-bottom:14px;">
        <label class="form-label">Ukuran Kapal (Gross Tonnage / DWT)</label>
        <input id="m-ship-size" class="form-input" placeholder="Contoh: 3500 GT" value="${curShip?.size || ''}">
      </div>
      <div class="form-group" style="margin-bottom:18px;">
        <label class="form-label">Foto Kapal (Opsional)</label>
        <input id="m-ship-photo" type="file" class="form-input" accept="image/*">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Batal</button>
        <button type="submit" class="btn btn-primary">💾 Simpan Data Kapal</button>
      </div>
    </form>`
  );
}

async function handleSaveShipMeta(e) {
  e.preventDefault();
  const size = document.getElementById('m-ship-size').value.trim();
  const f = document.getElementById('m-ship-photo').files[0];

  try {
    const body = { size };
    if (f) {
      body.photo = await fileToDataURL(f);
    }
    await api('/ships/' + activeShipId, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
    closeModal();
    toast('Data kapal berhasil diperbarui', 'success');
    allShips = await api('/ships');
    if (currentView === 'kapal') loadShip();
    if (currentView === 'fleet') loadFleet();
  } catch (err) {
    toast('Gagal memperbarui data kapal: ' + err.message, 'error');
  }
  return false;
}

/* ══════════════════════════════════════════════════════════════════
   INLINE ACTIONS: APPROVAL & WORK ORDER CLOSING
   ══════════════════════════════════════════════════════════════════ */
async function approveWOAction(id, status) {
  try {
    const r = await postJSON('/work-orders/' + id + '/approve', { status });
    toast(r.error || `Work order ${id} berhasil di-${status}`, status === 'approved' ? 'success' : 'warning');
    if (currentView === 'wo') loadWorkOrders();
    if (currentView === 'kpi') loadKPI();
    updateBadges();
  } catch (err) {
    toast('Gagal memproses approval: ' + err.message, 'error');
  }
}

async function closeWOAction(id) {
  confirmAction(
    'Tutup Work Order',
    `Apakah Anda yakin pekerjaan pada <b>${id}</b> telah selesai seluruhnya dan siap ditutup?`,
    async () => {
      try {
        const r = await api('/work-orders/' + id, {
          method: 'PUT',
          body: JSON.stringify({ status: 'completed' })
        });
        toast(r.error || `Work order ${id} resmi ditutup (Completed)`, 'success');
        if (currentView === 'wo') loadWorkOrders();
        if (currentView === 'kpi') loadKPI();
        updateBadges();
      } catch (err) {
        toast('Gagal menutup WO: ' + err.message, 'error');
      }
    }
  );
}

async function approveLeaveAction(id, status) {
  try {
    await postJSON('/leaves/' + id + '/approve', { status });
    toast(`Pengajuan cuti berhasil di-${status}`, status === 'approved' ? 'success' : 'warning');
    if (currentView === 'cuti') loadCuti();
    if (currentView === 'kapal') loadShip();
  } catch (err) {
    toast('Gagal memproses cuti: ' + err.message, 'error');
  }
}

/* ══════════════════════════════════════════════════════════════════
   PENGATURAN SISTEM (TABS: USERS, PROVIDER, CSV IMPORT, BACKUP)
   ══════════════════════════════════════════════════════════════════ */
async function renderPengaturan() {
  setLoading('pengaturan', 'Memuat pengaturan sistem');
  let users = [], roles = [], cfgs = [], pv = {};

  try { users = await api('/users'); } catch (e) { users = { error: e.message }; }
  try { roles = await api('/roles'); } catch (e) { roles = []; }
  try { cfgs = await api('/notification-configs'); } catch (e) { cfgs = []; }
  try { pv = await api('/notifications/provider'); } catch (e) { pv = { wa: 'mock', push: 'mock' }; }

  const th = (t) => (cfgs.find(x => x.targetType === t)?.thresholds || []).join(', ');

  const c = document.getElementById('view-pengaturan');
  c.innerHTML = `
    <div class="view-header">
      <div class="view-header-title">
        <span class="view-icon">⚙️</span>
        <div>
          <h2>Pengaturan Sistem & Administrasi</h2>
          <p class="stat-card-sub">Manajemen akun pengguna, konfigurasi reminder gateway, impor data, dan pencadangan</p>
        </div>
      </div>
    </div>

    <!-- Sub-Tabs Navigation -->
    <div class="settings-tabs-nav">
      <button class="settings-tab-btn active" onclick="switchSettingsTab('users', this)">👤 Manajemen Pengguna</button>
      <button class="settings-tab-btn" onclick="switchSettingsTab('notif-cfg', this)">🔔 Provider & Notifikasi</button>
      <button class="settings-tab-btn" onclick="switchSettingsTab('import', this)">📥 Impor Data CSV</button>
      <button class="settings-tab-btn" onclick="switchSettingsTab('backup', this)">💾 Cadangan & Pemulihan</button>
    </div>

    <!-- PANE 1: USER MANAGEMENT -->
    <div id="pane-users" class="settings-pane active">
      ${users.error ? `
        <div class="stat-card border-accent-amber" style="margin-bottom:20px;">
          <b style="color:var(--accent-amber);">⚠️ Hak Akses Terbatas</b>
          <p class="stat-card-sub" style="margin-top:4px;">Modul manajemen pengguna hanya dapat diakses oleh role <b>super-admin</b>.</p>
        </div>
      ` : `
        <div class="table-card" style="margin-bottom:24px;">
          <div class="table-toolbar">
            <div class="table-title"><span>Daftar Pengguna Sistem</span></div>
            <button class="btn btn-sm btn-primary" onclick="openModalAddUser()">➕ Tambah Pengguna Baru</button>
          </div>
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Nama Lengkap</th>
                  <th>Hak Akses (Role)</th>
                  <th>Penugasan Kapal</th>
                  <th style="text-align:right;">Aksi</th>
                </tr>
              </thead>
              <tbody>
                ${users.map(u => `
                  <tr>
                    <td><b>${esc(u.username)}</b></td>
                    <td>${esc(u.name || '—')}</td>
                    <td><span class="badge" style="background:rgba(37,99,235,0.2);color:var(--accent-cyan);border:1px solid rgba(56,189,248,0.3);">${esc(u.roleId)}</span></td>
                    <td>${u.shipId ? `⚓ <span class="mono">${esc(u.shipId)}</span>` : '<span class="stat-card-sub">Semua Kapal (Fleet)</span>'}</td>
                    <td style="text-align:right;">
                      <button class="btn-sm btn-danger" onclick="delUserAction('${u.id}', '${esc(u.username)}')">🗑️ Hapus</button>
                    </td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `}
    </div>

    <!-- PANE 2: NOTIFIKASI & PROVIDER -->
    <div id="pane-notif-cfg" class="settings-pane">
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(360px, 1fr));gap:20px;">
        <!-- Threshold Card -->
        <div class="stat-card">
          <h3 style="font-size:16px;color:#fff;margin-bottom:6px;">⏱️ Threshold Hari Notifikasi (H-xx)</h3>
          <p class="stat-card-sub" style="margin-bottom:14px;">Tentukan jarak hari sebelum tanggal jatuh tempo untuk pengiriman reminder (pisahkan koma):</p>
          
          <div class="form-group" style="margin-bottom:12px;">
            <label class="form-label">Sertifikat Pelaut (Crew):</label>
            <input id="th-crew-certificate" class="form-input mono" value="${th('crew-certificate')}" placeholder="90, 60, 30, 14, 7, 1">
          </div>
          <div class="form-group" style="margin-bottom:12px;">
            <label class="form-label">Surat & Dokumen Kapal:</label>
            <input id="th-ship-document" class="form-input mono" value="${th('ship-document')}" placeholder="90, 60, 30, 14, 7, 1">
          </div>
          <div class="form-group" style="margin-bottom:16px;">
            <label class="form-label">Perawatan Mesin (Maintenance):</label>
            <input id="th-maintenance" class="form-input mono" value="${th('maintenance')}" placeholder="30, 14, 7, 1">
          </div>
          <button class="btn btn-primary" onclick="saveThresholdsAction()">💾 Simpan Parameter Threshold</button>
        </div>

        <!-- Provider Card -->
        <div class="stat-card">
          <h3 style="font-size:16px;color:#fff;margin-bottom:6px;">📡 Gateway Provider Notifikasi</h3>
          <p class="stat-card-sub" style="margin-bottom:14px;">Gunakan "mock" untuk pengujian simulasi, atau hubungkan ke API resmi:</p>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
            <div>
              <label class="form-label">WhatsApp Channel</label>
              <select id="pv-wa" class="form-select">
                <option value="mock" ${pv.wa==='mock'?'selected':''}>mock (Simulasi)</option>
                <option value="wablas" ${pv.wa==='wablas'?'selected':''}>wablas (API)</option>
                <option value="qontak" ${pv.wa==='qontak'?'selected':''}>qontak (API)</option>
                <option value="twilio" ${pv.wa==='twilio'?'selected':''}>twilio (API)</option>
              </select>
            </div>
            <div>
              <label class="form-label">Push Notification</label>
              <select id="pv-push" class="form-select">
                <option value="mock" ${pv.push==='mock'?'selected':''}>mock (Simulasi)</option>
                <option value="onesignal" ${pv.push==='onesignal'?'selected':''}>onesignal</option>
                <option value="fcm" ${pv.push==='fcm'?'selected':''}>fcm (Firebase)</option>
              </select>
            </div>
          </div>

          <details style="margin-top:12px;border:1px solid var(--border-subtle);border-radius:8px;padding:10px 14px;background:rgba(15,23,42,0.4);">
            <summary style="cursor:pointer;color:var(--accent-cyan);font-weight:600;font-size:12px;">⚙️ Konfigurasi URL & Token Gateway (Opsional)</summary>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px;">
              <input id="pv-wablas-url" class="form-input" placeholder="Wablas API URL">
              <input id="pv-wablas-token" class="form-input" placeholder="Wablas Token">
              <input id="pv-qontak-url" class="form-input" placeholder="Qontak API URL">
              <input id="pv-qontak-token" class="form-input" placeholder="Qontak Token">
              <input id="pv-twilio-url" class="form-input" placeholder="Twilio API URL">
              <input id="pv-twilio-token" class="form-input" placeholder="Twilio Token">
              <input id="pv-push-url" class="form-input" placeholder="Push API URL">
              <input id="pv-push-key" class="form-input" placeholder="Push API Key">
            </div>
          </details>

          <button class="btn btn-primary" style="margin-top:16px;" onclick="saveProviderAction()">💾 Simpan Konfigurasi Gateway</button>
        </div>
      </div>
    </div>

    <!-- PANE 3: CSV IMPORT -->
    <div id="pane-import" class="settings-pane">
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(360px, 1fr));gap:20px;">
        <div class="stat-card">
          <h3 style="font-size:16px;color:#fff;margin-bottom:6px;">🚢 Impor Data Kapal (CSV)</h3>
          <p class="stat-card-sub" style="margin-bottom:12px;">Format baris: <code>nama,imo,jenis,flag</code></p>
          <textarea id="imp-ships" class="form-textarea mono" rows="5" placeholder="KM Nusantara 03,IMO-9012347,General Cargo,Indonesia&#10;KM Samudra Jaya,IMO-9012348,Container,Indonesia"></textarea>
          <button class="btn btn-primary" style="margin-top:12px;" onclick="importCSVAction('ships')">📥 Impor Data Kapal</button>
        </div>

        <div class="stat-card">
          <h3 style="font-size:16px;color:#fff;margin-bottom:6px;">👥 Impor Data Kru (CSV)</h3>
          <p class="stat-card-sub" style="margin-bottom:12px;">Format baris: <code>nama,rank,phone,kapal</code></p>
          <textarea id="imp-crews" class="form-textarea mono" rows="5" placeholder="Joko Widodo,Masinis 1,62812345678,KM Nusantara 01&#10;Budi Santoso,Juru Mudi,62812987654,KM Nusantara 01"></textarea>
          <button class="btn btn-primary" style="margin-top:12px;" onclick="importCSVAction('crews')">📥 Impor Data Kru</button>
        </div>
      </div>
    </div>

    <!-- PANE 4: BACKUP & RESTORE -->
    <div id="pane-backup" class="settings-pane">
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(360px, 1fr));gap:20px;">
        <div class="stat-card">
          <h3 style="font-size:16px;color:#fff;margin-bottom:6px;">💾 Unduh Cadangan Lengkap (Backup JSON)</h3>
          <p class="stat-card-sub" style="margin-bottom:16px;">Mencadangkan seluruh armada, equipment, riwayat perawatan, crew, dan biaya ke dalam satu file JSON.</p>
          <button class="btn btn-primary" onclick="backupDB()">💾 Unduh Backup JSON Sekarang</button>
        </div>

        <div class="stat-card border-accent-rose">
          <h3 style="font-size:16px;color:var(--accent-rose);margin-bottom:6px;">⚠️ Pemulihan Data (Restore JSON)</h3>
          <p class="stat-card-sub" style="margin-bottom:14px;color:var(--accent-rose);">Perhatian: Proses pemulihan akan menimpa seluruh data sistem dengan file backup yang dipilih!</p>
          <form onsubmit="return handleRestore(event)">
            <input id="f-restore-file" type="file" class="form-input" accept=".json" required style="margin-bottom:14px;">
            <button type="submit" class="btn btn-danger">♻️ Pulihkan Seluruh Data</button>
          </form>
        </div>
      </div>
    </div>
  `;
}

function switchSettingsTab(tabKey, btn) {
  document.querySelectorAll('.settings-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.settings-pane').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const pane = document.getElementById('pane-' + tabKey);
  if (pane) pane.classList.add('active');
}

/* ── Settings Actions ───────────────────────────────────────────── */
async function saveThresholdsAction() {
  const g = (id) => document.getElementById(id).value.split(',').map(x => Number(x.trim())).filter(x => !isNaN(x));
  try {
    for (const t of ['crew-certificate', 'ship-document', 'maintenance']) {
      const list = await api('/notification-configs');
      const cfg = list.find(x => x.targetType === t);
      if (cfg) {
        await api('/notification-configs/' + cfg.id, {
          method: 'PUT',
          body: JSON.stringify({ thresholds: g('th-' + t) })
        });
      }
    }
    toast('Parameter threshold reminder berhasil disimpan', 'success');
  } catch (err) {
    toast('Gagal menyimpan threshold: ' + err.message, 'error');
  }
}

async function saveProviderAction() {
  const v = (id) => (document.getElementById(id) ? document.getElementById(id).value.trim() : '');
  try {
    const j = await postJSON('/notifications/provider', {
      wa: v('pv-wa'),
      push: v('pv-push'),
      wablasUrl: v('pv-wablas-url'),
      wablasToken: v('pv-wablas-token'),
      qontakUrl: v('pv-qontak-url'),
      qontakToken: v('pv-qontak-token'),
      twilioUrl: v('pv-twilio-url'),
      twilioToken: v('pv-twilio-token'),
      pushUrl: v('pv-push-url'),
      pushKey: v('pv-push-key')
    });
    toast(`Gateway tersimpan: WA=${j.wa}, Push=${j.push}`, 'success');
  } catch (err) {
    toast('Gagal menyimpan provider: ' + err.message, 'error');
  }
}

async function importCSVAction(kind) {
  const txt = document.getElementById('imp-' + kind).value;
  if (!txt.trim()) {
    toast('Tempelkan teks data CSV terlebih dahulu', 'warning');
    return;
  }
  try {
    const r = await postJSON('/import/' + kind, { csv: txt });
    toast(`Impor ${kind} sukses: ${r.imported} baris ditambahkan`, 'success');
    document.getElementById('imp-' + kind).value = '';
    allShips = await api('/ships');
    loadFleet();
  } catch (err) {
    toast('Gagal impor CSV: ' + err.message, 'error');
  }
}

async function handleRestore(e) {
  e.preventDefault();
  const f = document.getElementById('f-restore-file').files[0];
  if (!f) { toast('Pilih file backup JSON', 'warning'); return false; }

  confirmAction(
    'Konfirmasi Pemulihan Data',
    'Tindakan ini akan <b>MENGHAPUS dan MENIMPA</b> semua data yang ada saat ini dengan data cadangan JSON. Lanjutkan?',
    async () => {
      try {
        const txt = await f.text();
        const r = await postJSON('/backup', { data: JSON.parse(txt) });
        toast(`Pemulihan berhasil: ${r.ships} kapal dipulihkan`, 'success');
        allShips = await api('/ships');
        loadFleet();
        renderPengaturan();
      } catch (err) {
        toast('Gagal memulihkan data: ' + err.message, 'error');
      }
    }
  );
  return false;
}

/* ── User CRUD ──────────────────────────────────────────────────── */
async function openModalAddUser() {
  try {
    const roles = await api('/roles').catch(() => []);
    const shipOptions = '<option value="">— Akses Semua Kapal (Fleet) —</option>' + 
      allShips.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

    openModal(
      'Tambah Akun Pengguna Baru',
      '👤',
      `
      <form onsubmit="return handleAddUser(event)">
        <div class="form-group" style="margin-bottom:14px;">
          <label class="form-label">Username</label>
          <input id="m-usr-u" class="form-input" placeholder="contoh: joko_teknisi" required autofocus>
        </div>
        <div class="form-group" style="margin-bottom:14px;">
          <label class="form-label">Password</label>
          <input id="m-usr-p" type="password" class="form-input" placeholder="Kata sandi akun" required>
        </div>
        <div class="form-group" style="margin-bottom:14px;">
          <label class="form-label">Nama Lengkap</label>
          <input id="m-usr-n" class="form-input" placeholder="Contoh: Joko Widodo, S.T.">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px;">
          <div>
            <label class="form-label">Hak Akses (Role)</label>
            <select id="m-usr-r" class="form-select">
              ${roles.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="form-label">Kapal Ditugaskan</label>
            <select id="m-usr-s" class="form-select">${shipOptions}</select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost" onclick="closeModal()">Batal</button>
          <button type="submit" class="btn btn-primary">➕ Daftarkan Pengguna</button>
        </div>
      </form>`
    );
  } catch (err) {
    toast('Gagal menyiapkan form pengguna: ' + err.message, 'error');
  }
}

async function handleAddUser(e) {
  e.preventDefault();
  const username = document.getElementById('m-usr-u').value.trim();
  const password = document.getElementById('m-usr-p').value;
  const name = document.getElementById('m-usr-n').value.trim();
  const roleId = document.getElementById('m-usr-r').value;
  const shipId = document.getElementById('m-usr-s').value || null;

  try {
    const r = await postJSON('/users', { username, password, name, roleId, shipId });
    closeModal();
    toast(`Pengguna ${r.username} berhasil didaftarkan`, 'success');
    renderPengaturan();
  } catch (err) {
    toast('Gagal menambahkan pengguna: ' + err.message, 'error');
  }
  return false;
}

async function delUserAction(id, username) {
  confirmAction(
    'Hapus Pengguna',
    `Apakah Anda yakin ingin menghapus akun pengguna <b>${username}</b>?`,
    async () => {
      try {
        await del('/users/' + id);
        toast(`Pengguna ${username} telah dihapus`, 'info');
        renderPengaturan();
      } catch (err) {
        toast('Gagal menghapus pengguna: ' + err.message, 'error');
      }
    }
  );
}

/* ══════════════════════════════════════════════════════════════════
   NEW MODALS: SPAREPART REQUISITIONS, DRILLS/ACTIVITIES, LEAVES, CERTIFICATES
   ══════════════════════════════════════════════════════════════════ */

/* ── 10. Modal: Pengajuan Pembelian Sparepart (PRD §7.3) ───────── */
async function openModalAddRequisition() {
  try {
    const parts = await api('/spareparts?shipId=' + activeShipId);
    const shipOptions = allShips.map(s => 
      `<option value="${s.id}" ${s.id === activeShipId ? 'selected' : ''}>${s.name}</option>`
    ).join('');

    const partOptions = parts.map(p => 
      `<option value="${p.id}" data-code="${esc(p.code)}" data-name="${esc(p.name)}" data-price="${p.price || 0}">${p.code} — ${p.name} (Sisa: ${p.stock} / Min: ${p.minStock})</option>`
    ).join('');

    openModal(
      'Pengajuan Pembelian Sparepart (Requisition)',
      '🛒',
      `
      <form onsubmit="return handleAddRequisition(event)">
        <div class="form-group" style="margin-bottom:14px;">
          <label class="form-label">Kapal Pemohon</label>
          <select id="m-req-ship" class="form-select">${shipOptions}</select>
        </div>
        <div class="form-group" style="margin-bottom:14px;">
          <label class="form-label">Pilih Item Sparepart</label>
          <select id="m-req-part" class="form-select" onchange="onRequisitionPartChange()">
            <option value="">— Pilih dari katalog sparepart —</option>
            ${partOptions}
          </select>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
          <div>
            <label class="form-label">Kode Barang</label>
            <input id="m-req-code" class="form-input mono" placeholder="Kode item" required>
          </div>
          <div>
            <label class="form-label">Nama Barang</label>
            <input id="m-req-name" class="form-input" placeholder="Nama sparepart" required>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
          <div>
            <label class="form-label">Jumlah Diminta (Qty)</label>
            <input id="m-req-qty" type="number" class="form-input mono" value="2" min="1" required>
          </div>
          <div>
            <label class="form-label">Estimasi Total Biaya (Rp)</label>
            <input id="m-req-cost" type="number" class="form-input mono" placeholder="Estimasi biaya" min="0">
          </div>
        </div>
        <div class="form-group" style="margin-bottom:14px;">
          <label class="form-label">Alasan Kebutuhan / Urgensi</label>
          <textarea id="m-req-reason" class="form-textarea" rows="2" placeholder="Contoh: Stok di bawah batas aman, persiapan pelayaran panjang" required></textarea>
        </div>
        <div class="form-group" style="margin-bottom:18px;">
          <label class="form-label">Pemohon (Requester)</label>
          <input id="m-req-by" class="form-input" value="${currentUser?.name || currentUser?.username || 'Chief Engineer'}" required>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost" onclick="closeModal()">Batal</button>
          <button type="submit" class="btn btn-primary">🚀 Kirim Pengajuan</button>
        </div>
      </form>`
    );
  } catch (err) {
    toast('Gagal menyiapkan form pengajuan: ' + err.message, 'error');
  }
}

function onRequisitionPartChange() {
  const sel = document.getElementById('m-req-part');
  const opt = sel.options[sel.selectedIndex];
  if (opt && opt.dataset.code) {
    document.getElementById('m-req-code').value = opt.dataset.code;
    document.getElementById('m-req-name').value = opt.dataset.name;
    const unitPrice = Number(opt.dataset.price || 0);
    const qty = Number(document.getElementById('m-req-qty')?.value || 1);
    if (unitPrice > 0) {
      document.getElementById('m-req-cost').value = unitPrice * qty;
    }
  }
}

async function handleAddRequisition(e) {
  e.preventDefault();
  const shipId = document.getElementById('m-req-ship').value;
  const sparepartId = document.getElementById('m-req-part').value || null;
  const code = document.getElementById('m-req-code').value.trim();
  const name = document.getElementById('m-req-name').value.trim();
  const qty = Number(document.getElementById('m-req-qty').value);
  const estimatedCost = Number(document.getElementById('m-req-cost').value || 0);
  const reason = document.getElementById('m-req-reason').value.trim();
  const requester = document.getElementById('m-req-by').value.trim();

  try {
    const res = await postJSON('/sparepart-requisitions', {
      shipId,
      sparepartId,
      code,
      name,
      qty,
      estimatedCost,
      reason,
      requester,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    closeModal();
    toast(`Pengajuan ${code} (${qty} unit) berhasil dikirim`, 'success');
    updateBadges();
    if (currentView === 'sparepart') loadSpareparts();
  } catch (err) {
    toast('Gagal mengirim pengajuan: ' + err.message, 'error');
  }
  return false;
}

async function updateRequisitionStatus(id, newStatus) {
  const labels = {
    approved: 'disetujui',
    rejected: 'ditolak',
    ordered: 'diproses pemesanan (PO)',
    received: 'diterima di kapal & stok diperbarui otomatis'
  };
  try {
    const r = await postJSON('/sparepart-requisitions/' + id + '/status', { status: newStatus });
    toast(`Pengadaan ${id} telah ${labels[newStatus] || newStatus}`, 'success');
    if (currentView === 'sparepart') loadSpareparts();
    updateBadges();
  } catch (err) {
    toast('Gagal memperbarui status pengadaan: ' + err.message, 'error');
  }
}

/* ── 11. Modal: Catat Kegiatan / Drill Crew (PRD §7.5.4) ────────── */
function openModalAddActivity() {
  const shipOptions = allShips.map(s => 
    `<option value="${s.id}" ${s.id === activeShipId ? 'selected' : ''}>${s.name}</option>`
  ).join('');

  openModal(
    'Catat Kegiatan & Drill Keselamatan',
    '🚨',
    `
    <form onsubmit="return handleAddActivity(event)">
      <div class="form-group" style="margin-bottom:14px;">
        <label class="form-label">Kapal Pelaksana</label>
        <select id="m-act-ship" class="form-select">${shipOptions}</select>
      </div>
      <div class="form-group" style="margin-bottom:14px;">
        <label class="form-label">Jenis Kegiatan (ISM Code / SOLAS)</label>
        <select id="m-act-type" class="form-select">
          <option value="drill">🚨 Latihan Keadaan Darurat (Drill)</option>
          <option value="training">🎓 Pelatihan & Edukasi (Training)</option>
          <option value="meeting">👥 Rapat Keselamatan (Safety Meeting)</option>
          <option value="evaluasi">📋 Evaluasi & Penilaian Kinerja Crew</option>
        </select>
      </div>
      <div class="form-group" style="margin-bottom:14px;">
        <label class="form-label">Judul / Topik Kegiatan</label>
        <input id="m-act-title" class="form-input" placeholder="Contoh: Fire Drill Kamar Mesin / Abandon Ship" required autofocus>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
        <div>
          <label class="form-label">Tanggal Pelaksanaan</label>
          <input id="m-act-date" type="date" class="form-input" value="${new Date().toISOString().slice(0, 10)}" required>
        </div>
        <div>
          <label class="form-label">Status Pelaksanaan</label>
          <select id="m-act-status" class="form-select">
            <option value="completed">✓ Telah Selesai (Completed)</option>
            <option value="scheduled">📅 Terjadwal (Scheduled)</option>
          </select>
        </div>
      </div>
      <div class="form-group" style="margin-bottom:14px;">
        <label class="form-label">Instruktur / PIC (Person In Charge)</label>
        <input id="m-act-pic" class="form-input" placeholder="Contoh: Nakhoda & Mualim I" required>
      </div>
      <div class="form-group" style="margin-bottom:14px;">
        <label class="form-label">Peserta yang Hadir</label>
        <input id="m-act-part" class="form-input" placeholder="Contoh: Seluruh ABK Onboard (14 Personel)">
      </div>
      <div class="form-group" style="margin-bottom:18px;">
        <label class="form-label">Hasil / Catatan Evaluasi Pelaksanaan</label>
        <textarea id="m-act-result" class="form-textarea" rows="2" placeholder="Catatan kesiapan peralatan, waktu respon, atau temuan"></textarea>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Batal</button>
        <button type="submit" class="btn btn-primary">💾 Simpan Kegiatan / Drill</button>
      </div>
    </form>`
  );
}

async function handleAddActivity(e) {
  e.preventDefault();
  const shipId = document.getElementById('m-act-ship').value;
  const type = document.getElementById('m-act-type').value;
  const title = document.getElementById('m-act-title').value.trim();
  const date = new Date(document.getElementById('m-act-date').value).toISOString();
  const status = document.getElementById('m-act-status').value;
  const pic = document.getElementById('m-act-pic').value.trim();
  const participants = document.getElementById('m-act-part').value.trim();
  const result = document.getElementById('m-act-result').value.trim();

  try {
    await postJSON('/activities', {
      shipId,
      type,
      title,
      date,
      status,
      pic,
      participants,
      result
    });
    closeModal();
    toast(`Kegiatan "${title}" berhasil dicatat`, 'success');
    if (currentView === 'crew') loadCrew();
    if (currentView === 'kapal') loadShip();
  } catch (err) {
    toast('Gagal mencatat kegiatan: ' + err.message, 'error');
  }
  return false;
}

/* ── 12. Modal: Form Pengajuan Cuti Kru (PRD §7.5.3) ─────────────── */
async function openModalAddLeave() {
  try {
    const list = await api('/crews?shipId=' + activeShipId);
    if (!list.length) {
      toast('Belum ada kru di kapal ini', 'warning');
      return;
    }
    const crewOpts = list.map(c => `<option value="${c.id}">${c.name} (${c.rank})</option>`).join('');

    openModal(
      'Pengajuan Permohonan Cuti',
      '🏖️',
      `
      <form onsubmit="return handleAddLeave(event)">
        <div class="form-group" style="margin-bottom:14px;">
          <label class="form-label">Awak Kapal Pemohon</label>
          <select id="m-lv-crew" class="form-select">${crewOpts}</select>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
          <div>
            <label class="form-label">Mulai Cuti (Sign-Off Rencana)</label>
            <input id="m-lv-start" type="date" class="form-input" required>
          </div>
          <div>
            <label class="form-label">Selesai Cuti</label>
            <input id="m-lv-end" type="date" class="form-input" required>
          </div>
        </div>
        <div class="form-group" style="margin-bottom:18px;">
          <label class="form-label">Alasan Pengajuan Cuti</label>
          <textarea id="m-lv-reason" class="form-textarea" rows="2" placeholder="Contoh: Cuti tahunan berkala 14 hari" required></textarea>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost" onclick="closeModal()">Batal</button>
          <button type="submit" class="btn btn-primary">🚀 Kirim Pengajuan Cuti</button>
        </div>
      </form>`
    );
  } catch (err) {
    toast('Gagal menyiapkan form cuti: ' + err.message, 'error');
  }
}

async function handleAddLeave(e) {
  e.preventDefault();
  const crewId = document.getElementById('m-lv-crew').value;
  const startDate = new Date(document.getElementById('m-lv-start').value).toISOString();
  const endDate = new Date(document.getElementById('m-lv-end').value).toISOString();
  const reason = document.getElementById('m-lv-reason').value.trim();

  if (new Date(startDate) > new Date(endDate)) {
    toast('Tanggal mulai tidak boleh melebihi tanggal selesai', 'error');
    return false;
  }

  try {
    await postJSON('/leaves', {
      crewId,
      startDate,
      endDate,
      status: 'pending',
      reason
    });
    closeModal();
    toast('Pengajuan cuti berhasil diajukan dan menunggu approval', 'success');
    updateBadges();
    if (currentView === 'cuti') loadCuti();
  } catch (err) {
    toast('Gagal mengajukan cuti: ' + err.message, 'error');
  }
  return false;
}

/* ── 13. Modal: Tambah Sertifikat Pelaut (PRD §7.5.5) ────────────── */
async function openModalAddCrewCert() {
  try {
    const list = await api('/crews?shipId=' + activeShipId);
    if (!list.length) {
      toast('Belum ada kru di kapal ini', 'warning');
      return;
    }
    const crewOpts = list.map(c => `<option value="${c.id}">${c.name} (${c.rank})</option>`).join('');

    openModal(
      'Tambah Sertifikat Pelaut (Crew Certificate)',
      '🎓',
      `
      <form onsubmit="return handleAddCrewCert(event)">
        <div class="form-group" style="margin-bottom:14px;">
          <label class="form-label">Awak Kapal Terkait</label>
          <select id="m-cc-crew" class="form-select">${crewOpts}</select>
        </div>
        <div class="form-group" style="margin-bottom:14px;">
          <label class="form-label">Jenis Sertifikat (STCW / Mandatori)</label>
          <input id="m-cc-type" class="form-input" placeholder="Contoh: COC ANT-III / Medical Certificate / BST / AFF" required autofocus>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px;">
          <div>
            <label class="form-label">Tanggal Terbit</label>
            <input id="m-cc-issued" type="date" class="form-input" value="${new Date().toISOString().slice(0, 10)}">
          </div>
          <div>
            <label class="form-label">Tanggal Kadaluarsa (Expired)</label>
            <input id="m-cc-expired" type="date" class="form-input" required>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost" onclick="closeModal()">Batal</button>
          <button type="submit" class="btn btn-primary">💾 Simpan Sertifikat</button>
        </div>
      </form>`
    );
  } catch (err) {
    toast('Gagal menyiapkan form sertifikat: ' + err.message, 'error');
  }
}

async function handleAddCrewCert(e) {
  e.preventDefault();
  const crewId = document.getElementById('m-cc-crew').value;
  const type = document.getElementById('m-cc-type').value.trim();
  const issuedAt = new Date(document.getElementById('m-cc-issued').value || new Date()).toISOString();
  const expiredAt = new Date(document.getElementById('m-cc-expired').value).toISOString();

  try {
    await postJSON('/crew-certificates', {
      crewId,
      type,
      issuedAt,
      expiredAt
    });
    closeModal();
    toast(`Sertifikat "${type}" berhasil ditambahkan`, 'success');
    updateBadges();
    if (currentView === 'crew') loadCrew();
  } catch (err) {
    toast('Gagal menyimpan sertifikat: ' + err.message, 'error');
  }
  return false;
}

/* ── 14. Modal: Catat Kehadiran / Log Sign-On & Off (PRD §7.5.2) ─── */
async function openModalAddAttendance() {
  try {
    const list = await api('/crews?shipId=' + activeShipId);
    if (!list.length) {
      toast('Belum ada kru di kapal ini', 'warning');
      return;
    }
    const crewOpts = list.map(c => `<option value="${c.id}" data-name="${esc(c.name)}" data-rank="${esc(c.rank)}">${c.name} (${c.rank})</option>`).join('');

    openModal(
      'Catat Kehadiran & Status Onboard',
      '⚓',
      `
      <form onsubmit="return handleAddAttendance(event)">
        <div class="form-group" style="margin-bottom:14px;">
          <label class="form-label">Pilih Awak Kapal</label>
          <select id="m-att-crew" class="form-select">${crewOpts}</select>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
          <div>
            <label class="form-label">Tanggal Sign-On (Naik Kapal)</label>
            <input id="m-att-on" type="date" class="form-input" value="${new Date().toISOString().slice(0, 10)}" required>
          </div>
          <div>
            <label class="form-label">Tanggal Sign-Off (Jika Turun)</label>
            <input id="m-att-off" type="date" class="form-input">
          </div>
        </div>
        <div class="form-group" style="margin-bottom:14px;">
          <label class="form-label">Status Kehadiran</label>
          <select id="m-att-status" class="form-select">
            <option value="onboard">⚓ Bertugas Aktif Onboard</option>
            <option value="standby">⏳ Standby Darat</option>
            <option value="signed-off">🚢 Telah Sign-Off (Turun Kapal)</option>
          </select>
        </div>
        <div class="form-group" style="margin-bottom:18px;">
          <label class="form-label">Catatan / Lokasi Pelabuhan</label>
          <input id="m-att-notes" class="form-input" placeholder="Contoh: Sign-on di Pelabuhan Tanjung Priok">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost" onclick="closeModal()">Batal</button>
          <button type="submit" class="btn btn-primary">💾 Simpan Kehadiran</button>
        </div>
      </form>`
    );
  } catch (err) {
    toast('Gagal menyiapkan form kehadiran: ' + err.message, 'error');
  }
}

async function handleAddAttendance(e) {
  e.preventDefault();
  const sel = document.getElementById('m-att-crew');
  const opt = sel.options[sel.selectedIndex];
  const crewId = sel.value;
  const crewName = opt?.dataset?.name || crewId;
  const rank = opt?.dataset?.rank || 'ABK';
  const signOn = new Date(document.getElementById('m-att-on').value).toISOString();
  const signOffVal = document.getElementById('m-att-off').value;
  const signOff = signOffVal ? new Date(signOffVal).toISOString() : null;
  const status = document.getElementById('m-att-status').value;
  const notes = document.getElementById('m-att-notes').value.trim();

  try {
    await postJSON('/attendances', {
      shipId: activeShipId,
      crewId,
      crewName,
      rank,
      signOn,
      signOff,
      status,
      notes
    });
    closeModal();
    toast(`Log kehadiran ${crewName} berhasil disimpan`, 'success');
    if (currentView === 'crew') loadCrew();
  } catch (err) {
    toast('Gagal mencatat kehadiran: ' + err.message, 'error');
  }
  return false;
}

/* ── 15. Export Work Orders (Excel & PDF) ────────────────────────── */
function exportWOXLS(shipId) {
  const url = `${API}/reports/work-orders?shipId=${encodeURIComponent(shipId || activeShipId)}&format=xls`;
  toast('Mengunduh Laporan Work Order (Excel)...', 'info');
  window.open(url, '_blank');
}

function exportWOPDF(shipId) {
  const url = `${API}/reports/work-orders?shipId=${encodeURIComponent(shipId || activeShipId)}&format=pdf`;
  toast('Mengunduh Laporan Work Order (PDF)...', 'info');
  window.open(url, '_blank');
}

/* ── 16. Modal: Pengajuan Ijin Kasbon Awak Kapal ─────────────────── */
async function openModalAddKasbon() {
  try {
    const list = await api('/crews?shipId=' + activeShipId);
    if (!list.length) {
      toast('Belum ada kru di kapal ini', 'warning');
      return;
    }
    const crewOpts = list.map(c => 
      `<option value="${c.id}" data-name="${esc(c.name)}" data-rank="${esc(c.rank)}">${c.name} (${c.rank})</option>`
    ).join('');

    openModal(
      'Pengajuan Ijin Kasbon Awak Kapal',
      '💵',
      `
      <form onsubmit="return handleAddKasbon(event)">
        <div class="form-group" style="margin-bottom:14px;">
          <label class="form-label">Pilih Awak Kapal Pemohon</label>
          <select id="m-kb-crew" class="form-select">${crewOpts}</select>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
          <div>
            <label class="form-label">Nominal Kasbon (Rupiah)</label>
            <input id="m-kb-amount" type="number" class="form-input mono" placeholder="Contoh: 2000000" min="50000" step="50000" required autofocus>
          </div>
          <div>
            <label class="form-label">Rencana Potong Gaji (Cicilan)</label>
            <select id="m-kb-inst" class="form-select">
              <option value="1">1x Potong Gaji Bulan Ini</option>
              <option value="2">2 Bulan (Cicilan 50% / bln)</option>
              <option value="3" selected>3 Bulan (Cicilan 33% / bln)</option>
              <option value="6">6 Bulan (Cicilan Ringan)</option>
            </select>
          </div>
        </div>
        <div class="form-group" style="margin-bottom:14px;">
          <label class="form-label">Alasan & Keperluan Mendesak</label>
          <textarea id="m-kb-reason" class="form-textarea" rows="2" placeholder="Contoh: Kebutuhan darurat keluarga (biaya berobat / sekolah di darat)" required></textarea>
        </div>
        <div class="form-group" style="margin-bottom:18px;">
          <label class="form-label">Catatan Tambahan (Opsional)</label>
          <input id="m-kb-notes" class="form-input" placeholder="Contoh: Ditransfer ke rekening istri di darat">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost" onclick="closeModal()">Batal</button>
          <button type="submit" class="btn btn-primary">🚀 Kirim Pengajuan Kasbon</button>
        </div>
      </form>`
    );
  } catch (err) {
    toast('Gagal menyiapkan form kasbon: ' + err.message, 'error');
  }
}

async function handleAddKasbon(e) {
  e.preventDefault();
  const sel = document.getElementById('m-kb-crew');
  const opt = sel.options[sel.selectedIndex];
  const crewId = sel.value;
  const crewName = opt?.dataset?.name || crewId;
  const rank = opt?.dataset?.rank || 'ABK';
  const amount = Number(document.getElementById('m-kb-amount').value);
  const installmentMonths = Number(document.getElementById('m-kb-inst').value || 1);
  const reason = document.getElementById('m-kb-reason').value.trim();
  const notes = document.getElementById('m-kb-notes').value.trim();

  if (amount <= 0) {
    toast('Nominal kasbon harus lebih dari 0', 'error');
    return false;
  }

  try {
    await postJSON('/kasbon', {
      shipId: activeShipId,
      crewId,
      crewName,
      rank,
      amount,
      installmentMonths,
      reason,
      notes,
      status: 'pending',
      date: new Date().toISOString()
    });
    closeModal();
    toast(`Permohonan kasbon ${rp(amount)} untuk ${crewName} berhasil diajukan`, 'success');
    if (typeof activeCrewSubtab !== 'undefined') activeCrewSubtab = 'kasbon';
    if (currentView === 'crew') loadCrew();
  } catch (err) {
    toast('Gagal mengajukan kasbon: ' + err.message, 'error');
  }
  return false;
}

async function updateKasbonStatus(id, newStatus) {
  const labels = {
    approved: 'disetujui oleh Nakhoda/Finance',
    rejected: 'ditolak',
    disbursed: 'berhasil dicairkan (dana diserahkan)'
  };
  try {
    await postJSON('/kasbon/' + id + '/status', { status: newStatus });
    toast(`Kasbon ${id} telah ${labels[newStatus] || newStatus}`, newStatus === 'rejected' ? 'warning' : 'success');
    if (typeof activeCrewSubtab !== 'undefined') activeCrewSubtab = 'kasbon';
    if (currentView === 'crew') loadCrew();
  } catch (err) {
    toast('Gagal memperbarui status kasbon: ' + err.message, 'error');
  }
}

