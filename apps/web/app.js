/* ══════════════════════════════════════════════════════════════════
   PMS KAPAL — app.js (v1.1 Modernized UI/UX)
   ══════════════════════════════════════════════════════════════════ */

const API = window.__API_URL__ || (
  window.location.hostname === 'localhost' && window.location.port === '3000'
    ? 'http://localhost:4000/api'
    : (window.location.origin + '/api')
);
let token = localStorage.getItem('pms-token');
let currentUser = null;
let allShips = [];
let activeShipId = '';
let activeShipData = null;
let currentView = 'fleet';
let activeCrewSubtab = 'crews';

/* ── Helpers ────────────────────────────────────────────────────── */
const rp = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
const esc = (s) => String(s || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const badge = (s) => `<span class="badge ${s}">${s}</span>`;

/* ── Toast Notification System ──────────────────────────────────── */
function toast(msg, type = 'info', duration = 3500) {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const container = document.getElementById('toast-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
    <span class="toast-msg">${msg}</span>
    <span class="toast-close">✕</span>`;
  el.querySelector('.toast-close').onclick = (e) => { e.stopPropagation(); dismissToast(el); };
  el.onclick = () => dismissToast(el);
  container.appendChild(el);
  setTimeout(() => dismissToast(el), duration);
}

function dismissToast(el) {
  if (!el || !el.parentNode) return;
  el.style.animation = 'toastOut 0.25s ease forwards';
  setTimeout(() => el.remove(), 250);
}

/* ── Section Loading Helper ─────────────────────────────────────── */
function setLoading(viewId, label = 'Memuat data') {
  const el = document.getElementById('view-' + viewId);
  if (el) {
    el.innerHTML = `
      <div class="section-loading">
        <div class="spinner"></div>
        <span>${label}...</span>
      </div>`;
  }
}

/* ── API Wrapper with Offline Cache Fallback ────────────────────── */
async function api(p, opt = {}) {
  try {
    const r = await fetch(API + p, {
      method: opt.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: opt.body
    });
    if (r.status === 401) {
      logout();
      throw new Error('Sesi telah berakhir, silakan login kembali');
    }
    const j = await r.json();
    try {
      localStorage.setItem('pms-cache-' + p, JSON.stringify({ at: Date.now(), data: j }));
    } catch {}
    return j;
  } catch (e) {
    if (!opt.method || opt.method === 'GET') {
      try {
        const c = JSON.parse(localStorage.getItem('pms-cache-' + p) || 'null');
        if (c) {
          toast('Mode offline – menampilkan cache', 'warning', 2500);
          return c.data;
        }
      } catch {}
    }
    throw e;
  }
}

/* ── Auth ────────────────────────────────────────────────────────── */
async function login() {
  const btn = document.getElementById('btn-login');
  const errEl = document.getElementById('err');
  const u = document.getElementById('u').value.trim();
  const p = document.getElementById('p').value;

  if (!u || !p) {
    errEl.textContent = 'Harap isi username dan password';
    return;
  }

  btn.innerHTML = `
    <div class="spinner" style="width:16px;height:16px;border-width:2px;display:inline-block;"></div>
    <span>Memproses Masuk...</span>`;
  btn.disabled = true;
  errEl.textContent = '';

  try {
    const r = await fetch(API + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p })
    });
    const j = await r.json();
    if (!j.token) {
      errEl.textContent = j.error || 'Username atau password salah';
      return;
    }
    token = j.token;
    localStorage.setItem('pms-token', token);
    toast(`Selamat datang kembali, ${u}!`, 'success');
    boot();
  } catch (e) {
    errEl.textContent = 'Tidak dapat terhubung ke server API (port 4000)';
  } finally {
    btn.innerHTML = `
      <span>Masuk ke Sistem</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>`;
    btn.disabled = false;
  }
}

function quickFillUser(usr) {
  document.getElementById('u').value = usr;
  document.getElementById('p').value = 'pms-demo';
  document.getElementById('err').textContent = '';
  login();
}

function logout() {
  localStorage.removeItem('pms-token');
  toast('Anda telah keluar dari sistem', 'info');
  setTimeout(() => location.reload(), 400);
}

/* ── View Navigation (Modular View Switching) ───────────────────── */
function show(viewId) {
  currentView = viewId;

  // Tutup modal jika sedang terbuka
  if (typeof closeModal === 'function') closeModal();

  // Toggle active view container
  document.querySelectorAll('.content-view').forEach(el => el.classList.remove('active'));
  const target = document.getElementById('view-' + viewId);
  if (target) target.classList.add('active');

  // Toggle active nav in sidebar
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  const navBtn = document.querySelector(`.nav-item[data-view="${viewId}"]`);
  if (navBtn) navBtn.classList.add('active');

  // Update hash history without jump
  if (history.pushState) {
    history.pushState(null, null, '#' + viewId);
  } else {
    location.hash = viewId;
  }

  // Scroll to top of content
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Close mobile sidebar if open
  toggleSidebar(false);

  // Load view-specific data
  refreshViewData(viewId);
}

function refreshViewData(viewId) {
  switch (viewId) {
    case 'fleet':      loadFleet(); break;
    case 'kapal':      loadShip(); break;
    case 'wo':         loadWorkOrders(); break;
    case 'sparepart':  loadSpareparts(); break;
    case 'dok':        loadDocuments(); break;
    case 'crew':       loadCrew(); break;
    case 'cuti':       loadCuti(); break;
    case 'biaya':      loadBiaya(); break;
    case 'kpi':        loadKPI(); break;
    case 'notif':      loadNotifications(); break;
    case 'audit':      loadAudit(); break;
    case 'pengaturan': renderPengaturan(); break;
  }
}

function toggleSidebar(open) {
  const sb = document.getElementById('sidebar');
  const bd = document.getElementById('sidebar-backdrop');
  if (open) {
    sb.classList.add('open');
    bd.classList.remove('hidden');
  } else {
    sb.classList.remove('open');
    bd.classList.add('hidden');
  }
}

function toggleQuickMenu(force) {
  const menu = document.getElementById('quick-action-menu');
  if (typeof force === 'boolean') {
    menu.classList.toggle('hidden', !force);
  } else {
    menu.classList.toggle('hidden');
  }
}

// Close quick menu when clicking outside
document.addEventListener('click', (e) => {
  const wrap = document.querySelector('.quick-action-dropdown-wrap');
  if (wrap && !wrap.contains(e.target)) {
    toggleQuickMenu(false);
  }
});

/* ── Boot Application ────────────────────────────────────────────── */
async function boot() {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    currentUser = payload;
    renderUserInfo(payload);
  } catch {}

  document.getElementById('login').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');

  try {
    allShips = await api('/ships');
    const sel = document.getElementById('shipSel');
    sel.innerHTML = allShips.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

    if (allShips.length > 0) {
      // If user is restricted to a ship, lock to it
      if (currentUser && currentUser.shipId) {
        activeShipId = currentUser.shipId;
        sel.value = activeShipId;
        sel.disabled = true;
      } else {
        activeShipId = allShips[0].id;
        sel.value = activeShipId;
      }
      updateHeaderShipMeta();
    }
  } catch (e) {
    toast('Gagal memuat daftar kapal: ' + e.message, 'error');
  }

  // Check initial hash route
  const hash = (location.hash || '').replace('#', '');
  const validViews = ['fleet','kapal','wo','sparepart','dok','crew','cuti','biaya','kpi','notif','audit','pengaturan'];
  const startView = validViews.includes(hash) ? hash : 'fleet';

  show(startView);
  updateBadges();
}

function renderUserInfo(u) {
  const roleLabel = {
    'super-admin': 'Super Admin', 'fleet-manager': 'Fleet Manager',
    'admin-kapal': 'Admin Kapal', 'teknisi': 'Teknisi Kapal',
    'hr': 'Personalia / HR', 'finance': 'Keuangan / Finance', 'crew': 'Crew'
  };
  const initials = (u.username || 'AD').slice(0, 2).toUpperCase();
  document.getElementById('user-avatar').textContent = initials;
  document.getElementById('user-name').textContent = u.username || u.name || 'User';
  document.getElementById('user-role').textContent = roleLabel[u.roleId] || u.roleId || 'Super Admin';
}

function onShipChange() {
  activeShipId = document.getElementById('shipSel').value;
  updateHeaderShipMeta();
  toast(`Kapal aktif beralih ke: ${getCurrentShipName()}`, 'info', 2000);
  // Reload current view with new ship context
  refreshViewData(currentView);
}

function updateHeaderShipMeta() {
  const s = allShips.find(x => x.id === activeShipId);
  const imoEl = document.getElementById('header-ship-imo');
  if (imoEl) {
    imoEl.textContent = s ? `IMO ${s.imo || '—'}` : 'IMO —';
  }
}

function getCurrentShipName() {
  return allShips.find(x => x.id === activeShipId)?.name || 'Kapal';
}

/* ── Badges in Sidebar ───────────────────────────────────────────── */
async function updateBadges() {
  try {
    const fleet = await api('/dashboard/fleet');
    const totalUrgency = fleet.ships.reduce((s, x) => s + (x.urgency || 0), 0);
    const totalOverdue = fleet.ships.reduce((s, x) => s + (x.overdue || 0), 0);
    const totalLowStock = fleet.ships.reduce((s, x) => s + (x.lowStock || 0), 0);
    const totalExpired = fleet.ships.reduce((s, x) => s + (x.expiredDocs || 0), 0);

    const setBadge = (id, val, cls) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (val > 0) {
        el.textContent = val;
        el.className = 'nav-badge ' + (cls || '');
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    };

    const totalExpiredCerts = fleet.ships.reduce((s, x) => s + (x.expiredCerts || 0), 0);
    setBadge('badge-nav-fleet', totalUrgency, 'nav-badge-warning');
    setBadge('badge-nav-wo', totalOverdue, 'nav-badge-danger');
    setBadge('badge-nav-part', totalLowStock, 'nav-badge-danger');
    setBadge('badge-nav-dok', totalExpired, 'nav-badge-danger');
    setBadge('badge-nav-crew', totalExpiredCerts, 'nav-badge-warning');
  } catch {}
}

/* ══════════════════════════════════════════════════════════════════
   1. FLEET OVERVIEW VIEW
   ══════════════════════════════════════════════════════════════════ */
async function loadFleet() {
  setLoading('fleet', 'Memuat status armada kapal');
  try {
    const j = await api('/dashboard/fleet');
    const totalUrgency = j.ships.reduce((s, x) => s + x.urgency, 0);
    const totalExpiredDocs = j.ships.reduce((s, x) => s + x.expiredDocs, 0);
    const totalExpiredCerts = j.ships.reduce((s, x) => s + x.expiredCerts, 0);
    const totalOverdue = j.ships.reduce((s, x) => s + x.overdue, 0);
    const totalLow = j.ships.reduce((s, x) => s + x.lowStock, 0);

    const c = document.getElementById('view-fleet');
    c.innerHTML = `
      <div class="view-header">
        <div class="view-header-title">
          <span class="view-icon">🚢</span>
          <div>
            <h2>Dashboard Armada (Fleet Overview)</h2>
            <p class="stat-card-sub">Monitoring menyeluruh kondisi teknis dan kesiapan armada kapal</p>
          </div>
        </div>
        <div class="view-header-actions">
          <button class="btn btn-ghost" onclick="loadFleet()">🔄 Refresh Data</button>
          <button class="btn btn-primary" onclick="openModalAddWO()">🔧 Buat Work Order</button>
        </div>
      </div>

      <!-- Fleet Stats Metric Grid -->
      <div class="grid-stats">
        <div class="stat-card border-accent-blue">
          <div class="stat-card-header">
            <span class="stat-card-label">Total Armada</span>
            <div class="stat-card-icon">⚓</div>
          </div>
          <div class="stat-card-num">${j.ships.length} <span style="font-size:14px;font-weight:500;color:var(--text-muted);">Kapal</span></div>
          <div class="stat-card-sub">Seluruh armada operasional aktif</div>
        </div>

        <div class="stat-card border-accent-amber">
          <div class="stat-card-header">
            <span class="stat-card-label">Tingkat Urgensi</span>
            <div class="stat-card-icon">⚠️</div>
          </div>
          <div class="stat-card-num" style="color:var(--accent-amber);">${totalUrgency}</div>
          <div class="stat-card-sub">Skor akumulasi perlu atensi teknis</div>
        </div>

        <div class="stat-card border-accent-rose">
          <div class="stat-card-header">
            <span class="stat-card-label">Dokumen / Sertifikat Expired</span>
            <div class="stat-card-icon">📄</div>
          </div>
          <div class="stat-card-num" style="color:${totalExpiredDocs + totalExpiredCerts > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">
            ${totalExpiredDocs + totalExpiredCerts}
          </div>
          <div class="stat-card-sub">${totalExpiredDocs} surat kapal • ${totalExpiredCerts} sertifikat crew</div>
        </div>

        <div class="stat-card border-accent-rose">
          <div class="stat-card-header">
            <span class="stat-card-label">WO Overdue</span>
            <div class="stat-card-icon">⏱️</div>
          </div>
          <div class="stat-card-num" style="color:${totalOverdue > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">
            ${totalOverdue}
          </div>
          <div class="stat-card-sub">Pekerjaan perawatan lewat batas waktu</div>
        </div>

        <div class="stat-card border-accent-amber">
          <div class="stat-card-header">
            <span class="stat-card-label">Sparepart Kritis</span>
            <div class="stat-card-icon">📦</div>
          </div>
          <div class="stat-card-num" style="color:${totalLow > 0 ? 'var(--accent-amber)' : 'var(--accent-emerald)'};">
            ${totalLow}
          </div>
          <div class="stat-card-sub">Item di bawah batas stok aman</div>
        </div>
      </div>

      <!-- Filter and Ship Cards List -->
      <div class="table-card">
        <div class="table-toolbar">
          <div class="table-title">
            <span>📋 Daftar Kapal Armada (Urutan Prioritas Urgensi)</span>
          </div>
          <div class="table-controls">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input type="text" id="search-fleet" placeholder="Cari kapal / IMO..." oninput="filterFleetCards()">
            </div>
          </div>
        </div>

        <div id="fleet-cards-container" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(340px, 1fr));gap:16px;padding:18px;">
          ${j.ships.map(s => {
            const isDanger = s.urgency >= 5;
            const isWarn = s.urgency > 0 && s.urgency < 5;
            const urgencyColor = isDanger ? 'var(--accent-rose)' : isWarn ? 'var(--accent-amber)' : 'var(--accent-emerald)';
            const urgencyBg = isDanger ? 'rgba(239, 68, 68, 0.15)' : isWarn ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)';

            return `
            <div class="fleet-ship-card stat-card" data-name="${s.name.toLowerCase()}" data-imo="${s.imo.toLowerCase()}" style="border-left:4px solid ${urgencyColor};cursor:pointer;" onclick="selectShipAndOpen('${s.id}')">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
                <div>
                  <h3 style="font-size:16px;font-weight:700;color:#fff;display:flex;align-items:center;gap:6px;">
                    <span>⚓</span> ${s.name}
                  </h3>
                  <span class="mono" style="font-size:12px;color:var(--text-dim);">${s.imo}</span>
                </div>
                <div style="display:flex;flex-direction:column;align-items:flex-end;">
                  <span style="font-size:10px;text-transform:uppercase;font-weight:700;color:var(--text-dim);letter-spacing:0.5px;">Urgensi</span>
                  <div style="background:${urgencyBg};color:${urgencyColor};border:1px solid ${urgencyColor};padding:3px 12px;border-radius:12px;font-size:16px;font-weight:800;">
                    ${s.urgency}
                  </div>
                </div>
              </div>

              <!-- Mini metrics grid -->
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <div style="background:rgba(15,23,42,0.6);border:1px solid var(--border-subtle);padding:8px 10px;border-radius:8px;">
                  <div class="stat-card-sub">Surat Expired</div>
                  <div class="mono" style="font-size:16px;font-weight:700;color:${s.expiredDocs > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">
                    ${s.expiredDocs}
                  </div>
                </div>
                <div style="background:rgba(15,23,42,0.6);border:1px solid var(--border-subtle);padding:8px 10px;border-radius:8px;">
                  <div class="stat-card-sub">Sert. Crew Expired</div>
                  <div class="mono" style="font-size:16px;font-weight:700;color:${s.expiredCerts > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">
                    ${s.expiredCerts}
                  </div>
                </div>
                <div style="background:rgba(15,23,42,0.6);border:1px solid var(--border-subtle);padding:8px 10px;border-radius:8px;">
                  <div class="stat-card-sub">WO Overdue</div>
                  <div class="mono" style="font-size:16px;font-weight:700;color:${s.overdue > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">
                    ${s.overdue}
                  </div>
                </div>
                <div style="background:rgba(15,23,42,0.6);border:1px solid var(--border-subtle);padding:8px 10px;border-radius:8px;">
                  <div class="stat-card-sub">Stok Kritis</div>
                  <div class="mono" style="font-size:16px;font-weight:700;color:${s.lowStock > 0 ? 'var(--accent-amber)' : 'var(--accent-emerald)'};">
                    ${s.lowStock}
                  </div>
                </div>
              </div>

              <div style="margin-top:14px;padding-top:10px;border-top:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:12px;color:var(--accent-cyan);font-weight:600;">Lihat Detail Kapal →</span>
                <span style="font-size:11px;color:var(--text-dim);">Klik kartu</span>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>`;
  } catch (e) {
    toast('Gagal memuat fleet: ' + e.message, 'error');
  }
}

function filterFleetCards() {
  const query = (document.getElementById('search-fleet')?.value || '').toLowerCase().trim();
  document.querySelectorAll('.fleet-ship-card').forEach(card => {
    const name = card.getAttribute('data-name') || '';
    const imo = card.getAttribute('data-imo') || '';
    const match = !query || name.includes(query) || imo.includes(query);
    card.style.display = match ? 'flex' : 'none';
  });
}

function selectShipAndOpen(shipId) {
  activeShipId = shipId;
  const sel = document.getElementById('shipSel');
  if (sel) sel.value = shipId;
  updateHeaderShipMeta();
  show('kapal');
}

/* ══════════════════════════════════════════════════════════════════
   2. SHIP DETAILS & EQUIPMENT VIEW
   ══════════════════════════════════════════════════════════════════ */
async function loadShip() {
  if (!activeShipId) return;
  setLoading('kapal', `Memuat data ${getCurrentShipName()}`);

  try {
    const j = await api('/dashboard/ship/' + activeShipId);
    activeShipData = j;

    const parentOf = pid => j.equipments.find(e => e.id === pid)?.name || '';
    const budgetPct = j.budget ? Math.min(100, Math.round((j.totalBiaya / j.budget.amount) * 100)) : 0;
    const budgetClr = budgetPct > 90 ? 'var(--accent-rose)' : budgetPct > 70 ? 'var(--accent-amber)' : 'var(--accent-emerald)';

    const shipPhoto = j.ship?.photo
      ? `<img src="${j.ship.photo}" style="width:140px;height:95px;border-radius:10px;border:1px solid var(--border-card);object-fit:cover;" alt="Foto kapal">`
      : `<div style="width:140px;height:95px;border-radius:10px;background:rgba(30,41,59,0.5);border:1px dashed var(--border-subtle);display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-dim);font-size:11px;"><span>📷 Foto Belum Ada</span><button class="btn-sm btn-ghost" style="margin-top:6px;" onclick="openModalShipMeta()">+ Unggah</button></div>`;

    const c = document.getElementById('view-kapal');
    c.innerHTML = `
      <div class="view-header">
        <div class="view-header-title">
          <span class="view-icon">⚓</span>
          <div>
            <h2>${j.ship?.name || 'Kapal'}</h2>
            <p class="stat-card-sub">
              Tipe: <b>${j.ship?.type || 'General Cargo'}</b> &nbsp;•&nbsp; 
              Ukuran: <b>${j.ship?.size || '—'}</b> &nbsp;•&nbsp; 
              IMO: <b class="mono">${j.ship?.imo || '—'}</b> &nbsp;•&nbsp;
              Bendera: <b>${j.ship?.flag || 'Indonesia'}</b>
            </p>
          </div>
        </div>
        <div class="view-header-actions">
          <button class="btn btn-ghost" onclick="openModalShipMeta()">📷 Ubah Foto & Ukuran</button>
          <button class="btn btn-primary" onclick="openModalAddWO()">🔧 Buat Work Order</button>
        </div>
      </div>

      <!-- Ship Header Card with Photo -->
      <div class="stat-card" style="margin-bottom:20px;display:flex;flex-direction:row;align-items:center;gap:20px;flex-wrap:wrap;">
        ${shipPhoto}
        <div style="flex:1;min-width:240px;">
          <h3 style="font-size:17px;color:#fff;margin-bottom:4px;">Kesiapan Operasional Armada</h3>
          <p class="stat-card-sub" style="margin-bottom:10px;">Monitoring running hours mesin dan jadwal preventive maintenance berkala.</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button class="btn btn-sm btn-ghost" onclick="show('wo')">📋 Lihat Work Orders (${j.workOrders.length})</button>
            <button class="btn btn-sm btn-ghost" onclick="show('sparepart')">📦 Lihat Spareparts (${j.spareparts.length})</button>
            <button class="btn btn-sm btn-ghost" onclick="show('dok')">📄 Lihat Surat Kapal (${j.documents.length})</button>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid-stats">
        <div class="stat-card border-accent-blue">
          <div class="stat-card-header">
            <span class="stat-card-label">Total Pengeluaran</span>
            <div class="stat-card-icon">💰</div>
          </div>
          <div class="stat-card-num mono" style="color:var(--accent-cyan);">${rp(j.totalBiaya)}</div>
          <div class="stat-card-sub">Budget: ${rp(j.budget?.amount)}</div>
          ${j.budget ? `
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="background:${budgetClr};width:${budgetPct}%;"></div>
          </div>
          <div class="stat-card-sub" style="margin-top:4px;"><b>${budgetPct}%</b> terpakai</div>` : ''}
        </div>

        <div class="stat-card border-accent-blue">
          <div class="stat-card-header">
            <span class="stat-card-label">Peralatan (Equipment)</span>
            <div class="stat-card-icon">⚙️</div>
          </div>
          <div class="stat-card-num">${j.equipments.length}</div>
          <div class="stat-card-sub">Mesin utama, bantu, dan perlengkapan</div>
        </div>

        <div class="stat-card border-accent-emerald">
          <div class="stat-card-header">
            <span class="stat-card-label">Crew Bertugas</span>
            <div class="stat-card-icon">👥</div>
          </div>
          <div class="stat-card-num">${j.crews.length} <span style="font-size:14px;font-weight:500;color:var(--text-muted);">Personel</span></div>
          <div class="stat-card-sub">Nakhoda, KKM, dan kru aktif</div>
        </div>

        <div class="stat-card border-accent-amber">
          <div class="stat-card-header">
            <span class="stat-card-label">Cuti Menunggu Approval</span>
            <div class="stat-card-icon">🏖️</div>
          </div>
          <div class="stat-card-num" style="color:var(--accent-amber);">${j.leaves.filter(l => l.status === 'pending').length}</div>
          <div class="stat-card-sub">Pengajuan cuti memerlukan persetujuan</div>
        </div>
      </div>

      <!-- Equipment Table -->
      <div class="table-card">
        <div class="table-toolbar">
          <div class="table-title">
            <span>⚙️ Equipment & Jadwal Perawatan (Running Hours & Kalender)</span>
          </div>
          <div class="table-controls">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input type="text" id="search-equip" placeholder="Cari mesin / jadwal..." oninput="filterEquipTable()">
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table id="tbl-equip">
            <thead>
              <tr>
                <th>Equipment / Komponen</th>
                <th>Running Hours</th>
                <th>Jadwal Maintenance</th>
                <th>Jatuh Tempo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${j.equipments.length === 0 ? '<tr><td colspan="5" class="text-center" style="padding:24px;color:var(--text-dim);">Belum ada equipment terdaftar untuk kapal ini</td></tr>' : ''}
              ${j.equipments.map(e => {
                const isChild = !!e.parentId;
                const icon = j.equipments.some(x => x.parentId === e.id) ? '📦' : isChild ? '↳ 🔧' : '⚙️';
                const nameCell = isChild
                  ? `${icon} ${e.name} <span class="stat-card-sub" style="display:inline;">(sub: ${parentOf(e.parentId)})</span>`
                  : `${icon} <b>${e.name}</b>`;

                if (e.schedules.length) {
                  return e.schedules.map(s => `
                    <tr class="equip-row" data-text="${(e.name + ' ' + s.title).toLowerCase()}">
                      <td>${nameCell}</td>
                      <td class="mono"><b>${e.runningHours ? e.runningHours.toLocaleString('id-ID') + ' hrs' : '—'}</b></td>
                      <td><b>${s.title}</b></td>
                      <td class="mono">${(s.nextDueAt || '').slice(0, 10) || '—'}</td>
                      <td>${badge(s.status)}</td>
                    </tr>`).join('');
                }
                return `
                  <tr class="equip-row" data-text="${e.name.toLowerCase()}">
                    <td>${nameCell}</td>
                    <td class="mono"><b>${e.runningHours ? e.runningHours.toLocaleString('id-ID') + ' hrs' : '—'}</b></td>
                    <td colspan="3"><span class="stat-card-sub">Belum ada jadwal maintenance aktif</span></td>
                  </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  } catch (e) {
    toast('Gagal memuat detail kapal: ' + e.message, 'error');
  }
}

function filterEquipTable() {
  const query = (document.getElementById('search-equip')?.value || '').toLowerCase().trim();
  document.querySelectorAll('#tbl-equip tbody tr.equip-row').forEach(row => {
    const text = row.getAttribute('data-text') || '';
    row.style.display = !query || text.includes(query) ? '' : 'none';
  });
}

/* ══════════════════════════════════════════════════════════════════
   3. WORK ORDERS VIEW
   ══════════════════════════════════════════════════════════════════ */
async function loadWorkOrders() {
  setLoading('wo', 'Memuat daftar Work Order');
  try {
    const wos = await api('/work-orders?shipId=' + activeShipId);
    const checks = await api('/work-order-checks').catch(() => []);
    const approvals = await api('/work-order-approvals').catch(() => []);

    const totalOpen = wos.filter(w => w.status === 'open').length;
    const totalDone = wos.filter(w => w.status === 'completed').length;

    const c = document.getElementById('view-wo');
    c.innerHTML = `
      <div class="view-header">
        <div class="view-header-title">
          <span class="view-icon">🔧</span>
          <div>
            <h2>Work Orders & Approval Perawatan</h2>
            <p class="stat-card-sub">Kelola perintah kerja pemeliharaan, item checklist, dan persetujuan teknis di <b>${getCurrentShipName()}</b></p>
          </div>
        </div>
        <div class="view-header-actions">
          <button class="btn btn-ghost" onclick="exportWOXLS('${activeShipId}')">📥 Export Excel</button>
          <button class="btn btn-ghost" onclick="exportWOPDF('${activeShipId}')">📥 Export PDF</button>
          <button class="btn btn-primary" onclick="openModalAddWO()">➕ Buat Work Order Baru</button>
        </div>
      </div>

      <!-- WO Mini Stats -->
      <div class="grid-stats">
        <div class="stat-card border-accent-blue">
          <div class="stat-card-header">
            <span class="stat-card-label">Total Work Orders</span>
            <div class="stat-card-icon">📋</div>
          </div>
          <div class="stat-card-num">${wos.length}</div>
          <div class="stat-card-sub">Tercatat di kapal ini</div>
        </div>

        <div class="stat-card border-accent-amber">
          <div class="stat-card-header">
            <span class="stat-card-label">Status Terbuka (Open)</span>
            <div class="stat-card-icon">⏳</div>
          </div>
          <div class="stat-card-num" style="color:var(--accent-amber);">${totalOpen}</div>
          <div class="stat-card-sub">Menunggu atau sedang dikerjakan</div>
        </div>

        <div class="stat-card border-accent-emerald">
          <div class="stat-card-header">
            <span class="stat-card-label">Terselesaikan (Completed)</span>
            <div class="stat-card-icon">✅</div>
          </div>
          <div class="stat-card-num" style="color:var(--accent-emerald);">${totalDone}</div>
          <div class="stat-card-sub">Pekerjaan ditutup selesai</div>
        </div>
      </div>

      <!-- Work Order Table Card -->
      <div class="table-card">
        <div class="table-toolbar">
          <div class="table-title">
            <span>Daftar Work Orders</span>
          </div>
          <div class="table-controls">
            <div class="filter-chips-group">
              <button class="filter-chip active" onclick="filterWOStatus('all', this)">Semua</button>
              <button class="filter-chip" onclick="filterWOStatus('open', this)">Open</button>
              <button class="filter-chip" onclick="filterWOStatus('completed', this)">Completed</button>
            </div>
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input type="text" id="search-wo" placeholder="Cari WO / teknisi..." oninput="filterWOTable()">
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table id="tbl-wo">
            <thead>
              <tr>
                <th style="width:120px;">ID WO</th>
                <th>Judul Pekerjaan</th>
                <th>Teknisi / Assignee</th>
                <th>Tanggal Dibuat</th>
                <th>Status</th>
                <th>Checklist Item</th>
                <th>Persetujuan (Approval)</th>
                <th style="text-align:right;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${wos.length === 0 ? '<tr><td colspan="8" class="text-center" style="padding:28px;color:var(--text-dim);">Belum ada work order untuk kapal ini. Silakan klik tombol "+ Buat Work Order Baru".</td></tr>' : ''}
              ${wos.map(w => {
                const cl = checks.filter(ch => ch.workOrderId === w.id);
                const ap = approvals.filter(a => a.workOrderId === w.id).slice(-1)[0];

                const clHtml = cl.length
                  ? cl.map(ch => `
                    <label style="display:flex;align-items:center;gap:6px;margin:3px 0;cursor:pointer;">
                      <input type="checkbox" ${ch.done ? 'checked' : ''} onchange="toggleCheckItem('${ch.id}', ${!!ch.done})" style="width:auto;margin:0;accent-color:var(--accent-cyan);">
                      <span style="font-size:12px;${ch.done ? 'text-decoration:line-through;color:var(--text-dim);' : ''}">${esc(ch.title)}</span>
                    </label>`).join('')
                  : '<span class="stat-card-sub">Belum ada checklist</span>';

                const apHtml = ap
                  ? `<div style="font-size:11px;margin-bottom:4px;">${badge(ap.status)} oleh <b>${esc(ap.by || '')}</b></div>`
                  : '<span class="stat-card-sub">Belum ada approval</span>';

                return `
                <tr class="wo-row" data-status="${w.status}" data-text="${(w.id + ' ' + w.title + ' ' + (w.assignee || '')).toLowerCase()}">
                  <td><span class="mono" style="font-size:12px;font-weight:700;color:var(--accent-cyan);">${w.id}</span></td>
                  <td>
                    <b>${esc(w.title)}</b>
                  </td>
                  <td>${w.assignee ? `👤 <b>${esc(w.assignee)}</b>` : '<span class="stat-card-sub">—</span>'}</td>
                  <td class="mono" style="font-size:12px;">${(w.createdAt || '').slice(0, 10)}</td>
                  <td>${badge(w.status)}</td>
                  <td>
                    ${clHtml}
                    <button class="btn-sm btn-ghost" style="margin-top:6px;" onclick="openModalAddCheck('${w.id}')">+ Checklist</button>
                  </td>
                  <td>
                    ${apHtml}
                    <div style="display:flex;gap:4px;margin-top:4px;">
                      <button class="btn-sm btn-success" onclick="approveWOAction('${w.id}', 'approved')">✓ Setujui</button>
                      <button class="btn-sm btn-danger" onclick="approveWOAction('${w.id}', 'rejected')">✗ Tolak</button>
                    </div>
                  </td>
                  <td style="text-align:right;">
                    ${w.status !== 'completed' 
                      ? `<button class="btn-sm btn-primary" onclick="closeWOAction('${w.id}')">🔒 Selesai</button>` 
                      : '<span style="color:var(--accent-emerald);font-size:12px;font-weight:600;">✓ Ditutup</span>'}
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  } catch (e) {
    toast('Gagal memuat work order: ' + e.message, 'error');
  }
}

let currentWOStatusFilter = 'all';
function filterWOStatus(status, btn) {
  currentWOStatusFilter = status;
  document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  filterWOTable();
}

function filterWOTable() {
  const query = (document.getElementById('search-wo')?.value || '').toLowerCase().trim();
  document.querySelectorAll('#tbl-wo tbody tr.wo-row').forEach(row => {
    const rowStatus = row.getAttribute('data-status') || '';
    const text = row.getAttribute('data-text') || '';
    const matchStatus = (currentWOStatusFilter === 'all') || (rowStatus === currentWOStatusFilter);
    const matchQuery = !query || text.includes(query);
    row.style.display = matchStatus && matchQuery ? '' : 'none';
  });
}

/* ══════════════════════════════════════════════════════════════════
   4. SPAREPARTS & INVENTORY VIEW
   ══════════════════════════════════════════════════════════════════ */
async function loadSpareparts() {
  setLoading('sparepart', 'Memuat inventaris suku cadang dan pengadaan');
  try {
    const parts = await api('/spareparts?shipId=' + activeShipId);
    const requisitions = await api('/sparepart-requisitions?shipId=' + activeShipId).catch(() => []);
    const lowCount = parts.filter(p => p.stock <= p.minStock).length;
    const pendingReqs = requisitions.filter(r => r.status === 'pending').length;

    const c = document.getElementById('view-sparepart');
    c.innerHTML = `
      <div class="view-header">
        <div class="view-header-title">
          <span class="view-icon">📦</span>
          <div>
            <h2>Inventaris Suku Cadang & Pengadaan (Requisition)</h2>
            <p class="stat-card-sub">Manajemen ketersediaan suku cadang, batas stok minimum, dan alur pembelian suku cadang di <b>${getCurrentShipName()}</b></p>
          </div>
        </div>
        <div class="view-header-actions">
          <button class="btn btn-ghost" onclick="openModalUsePart()">📤 Catat Pemakaian</button>
          <button class="btn btn-primary" onclick="openModalAddRequisition()">🛒 Ajukan Pengadaan Part</button>
          <button class="btn btn-ghost" onclick="openModalAddPart()">➕ Tambah Part Baru</button>
        </div>
      </div>

      <div class="grid-stats">
        <div class="stat-card border-accent-blue">
          <div class="stat-card-header">
            <span class="stat-card-label">Total Item Suku Cadang</span>
            <div class="stat-card-icon">📦</div>
          </div>
          <div class="stat-card-num">${parts.length} <span style="font-size:14px;color:var(--text-muted);">Jenis</span></div>
          <div class="stat-card-sub">Katalog suku cadang kapal</div>
        </div>

        <div class="stat-card border-accent-rose">
          <div class="stat-card-header">
            <span class="stat-card-label">Peringatan Stok Kritis</span>
            <div class="stat-card-icon">⚠️</div>
          </div>
          <div class="stat-card-num" style="color:${lowCount > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">${lowCount}</div>
          <div class="stat-card-sub">${lowCount > 0 ? 'Perlu pengadaan segera' : 'Semua stok dalam batas aman'}</div>
        </div>

        <div class="stat-card border-accent-amber">
          <div class="stat-card-header">
            <span class="stat-card-label">Pengadaan Menunggu Approval</span>
            <div class="stat-card-icon">🛒</div>
          </div>
          <div class="stat-card-num" style="color:var(--accent-amber);">${pendingReqs}</div>
          <div class="stat-card-sub">${pendingReqs > 0 ? 'Menunggu review Fleet Manager' : 'Tidak ada pengajuan pending'}</div>
        </div>

        <div class="stat-card border-accent-emerald">
          <div class="stat-card-header">
            <span class="stat-card-label">Total Pengajuan (Requisitions)</span>
            <div class="stat-card-icon">📑</div>
          </div>
          <div class="stat-card-num">${requisitions.length}</div>
          <div class="stat-card-sub">Riwayat pengajuan pembelian</div>
        </div>
      </div>

      <!-- TABEL 1: DAFTAR SUKU CADANG -->
      <div class="table-card" style="margin-bottom:24px;">
        <div class="table-toolbar">
          <div class="table-title">
            <span>📦 Katalog Suku Cadang Kapal</span>
          </div>
          <div class="table-controls">
            <div class="filter-chips-group">
              <button class="filter-chip active" onclick="filterPartStock('all', this)">Semua Item</button>
              <button class="filter-chip" onclick="filterPartStock('low', this)">Hanya Stok Kritis</button>
            </div>
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input type="text" id="search-part" placeholder="Cari kode / nama..." oninput="filterPartTable()">
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table id="tbl-parts">
            <thead>
              <tr>
                <th style="width:140px;">Kode Sparepart</th>
                <th>Nama Barang / Spesifikasi</th>
                <th>Sisa Stok / Min</th>
                <th>Status Ketersediaan</th>
                <th style="text-align:right;">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody>
              ${parts.length === 0 ? '<tr><td colspan="5" class="text-center" style="padding:28px;color:var(--text-dim);">Belum ada sparepart terdaftar. Klik "+ Tambah Part Baru".</td></tr>' : ''}
              ${parts.map(p => {
                const isLow = p.stock <= p.minStock;
                return `
                <tr class="part-row" data-low="${isLow}" data-text="${(p.code + ' ' + p.name).toLowerCase()}">
                  <td><span class="mono" style="font-weight:700;color:var(--accent-cyan);">${esc(p.code)}</span></td>
                  <td><b>${esc(p.name)}</b></td>
                  <td class="mono">
                    <span style="font-size:16px;font-weight:800;color:${isLow ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">${p.stock}</span>
                    <span class="stat-card-sub"> / min ${p.minStock}</span>
                  </td>
                  <td>
                    ${isLow ? badge('low') : '<span class="badge aktif">Stok Cukup</span>'}
                  </td>
                  <td style="text-align:right;">
                    <button class="btn-sm btn-ghost" onclick="quickUsePartModal('${p.id}', '${esc(p.name)}', ${p.stock})">📤 Pakai</button>
                    ${isLow ? `<button class="btn-sm btn-primary" onclick="openModalAddRequisition()">🛒 Ajukan Beli</button>` : ''}
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- TABEL 2: PERMINTAAN SPAREPART / REQUISITIONS (PRD §7.3) -->
      <div class="table-card">
        <div class="table-toolbar">
          <div class="table-title">
            <span>🛒 Permintaan & Pengajuan Pembelian Sparepart (Requisitions)</span>
          </div>
          <button class="btn-sm btn-primary" onclick="openModalAddRequisition()">➕ Ajukan Pembelian Baru</button>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID / Tgl</th>
                <th>Barang yang Diajukan</th>
                <th>Qty Diminta</th>
                <th>Estimasi Biaya</th>
                <th>Alasan / Urgensi</th>
                <th>Pemohon</th>
                <th>Status Pengadaan</th>
                <th style="text-align:right;">Aksi Alur Pengadaan</th>
              </tr>
            </thead>
            <tbody>
              ${requisitions.length === 0 ? '<tr><td colspan="8" class="text-center" style="padding:28px;color:var(--text-dim);">Belum ada pengajuan pembelian sparepart. Klik "+ Ajukan Pembelian Baru".</td></tr>' : ''}
              ${requisitions.map(r => `
                <tr>
                  <td>
                    <span class="mono" style="font-weight:700;color:var(--accent-cyan);">${esc(r.id)}</span>
                    <div class="mono stat-card-sub">${(r.createdAt || '').slice(0, 10)}</div>
                  </td>
                  <td>
                    <b>${esc(r.name)}</b>
                    <div class="mono stat-card-sub">${esc(r.code)}</div>
                  </td>
                  <td class="mono"><b>${r.qty} unit</b></td>
                  <td class="mono" style="color:var(--accent-emerald);font-weight:700;">${r.estimatedCost ? rp(r.estimatedCost) : '—'}</td>
                  <td style="max-width:220px;font-size:13px;">${esc(r.reason || '—')}</td>
                  <td>👤 <b>${esc(r.requester || 'Teknisi')}</b></td>
                  <td>${badge(r.status)}</td>
                  <td style="text-align:right;">
                    ${r.status === 'pending' ? `
                      <button class="btn-sm btn-success" onclick="updateRequisitionStatus('${r.id}', 'approved')" title="Setujui pengadaan">✓ Setujui</button>
                      <button class="btn-sm btn-danger" onclick="updateRequisitionStatus('${r.id}', 'rejected')" title="Tolak pengadaan">✗ Tolak</button>` : ''}
                    ${r.status === 'approved' ? `
                      <button class="btn-sm btn-primary" onclick="updateRequisitionStatus('${r.id}', 'ordered')" title="Buat Purchase Order">📦 Proses Order</button>` : ''}
                    ${r.status === 'ordered' ? `
                      <button class="btn-sm btn-success" onclick="updateRequisitionStatus('${r.id}', 'received')" title="Terima barang dan tambah stok otomatis">✅ Terima & Restock</button>` : ''}
                    ${r.status === 'received' ? `
                      <span style="color:var(--accent-emerald);font-weight:600;font-size:12px;">✓ Selesai Restock</span>` : ''}
                    ${r.status === 'rejected' ? `
                      <span class="stat-card-sub">Ditolak</span>` : ''}
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  } catch (e) {
    toast('Gagal memuat sparepart: ' + e.message, 'error');
  }
}

let currentPartFilter = 'all';
function filterPartStock(val, btn) {
  currentPartFilter = val;
  document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  filterPartTable();
}

function filterPartTable() {
  const query = (document.getElementById('search-part')?.value || '').toLowerCase().trim();
  document.querySelectorAll('#tbl-parts tbody tr.part-row').forEach(row => {
    const isLow = row.getAttribute('data-low') === 'true';
    const text = row.getAttribute('data-text') || '';
    const matchFilter = (currentPartFilter === 'all') || (currentPartFilter === 'low' && isLow);
    const matchQuery = !query || text.includes(query);
    row.style.display = matchFilter && matchQuery ? '' : 'none';
  });
}

/* ══════════════════════════════════════════════════════════════════
   5. SURAT & DOKUMEN KAPAL VIEW
   ══════════════════════════════════════════════════════════════════ */
async function loadDocuments() {
  setLoading('dok', 'Memuat dokumen dan surat kapal');
  try {
    const docs = await api('/ship-documents?shipId=' + activeShipId);

    const c = document.getElementById('view-dok');
    c.innerHTML = `
      <div class="view-header">
        <div class="view-header-title">
          <span class="view-icon">📄</span>
          <div>
            <h2>Surat & Dokumen Sertifikasi Kapal</h2>
            <p class="stat-card-sub">Monitoring masa berlaku dokumen statuter dan sertifikat klas kapal <b>${getCurrentShipName()}</b></p>
          </div>
        </div>
        <div class="view-header-actions">
          <button class="btn btn-ghost" onclick="openModalUploadScan('ship-document')">📎 Upload Scan Dokumen</button>
          <button class="btn btn-primary" onclick="openModalAddDoc()">➕ Tambah Surat Kapal</button>
        </div>
      </div>

      <div class="table-card">
        <div class="table-toolbar">
          <div class="table-title">
            <span>Daftar Sertifikat & Dokumen Kapal</span>
          </div>
          <div class="table-controls">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input type="text" id="search-dok" placeholder="Cari jenis surat..." oninput="filterDokTable()">
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table id="tbl-dok">
            <thead>
              <tr>
                <th>Jenis Dokumen / Sertifikat</th>
                <th>Tanggal Terbit</th>
                <th>Berlaku s/d</th>
                <th>Sisa Waktu</th>
                <th>Status Regulasi</th>
                <th style="text-align:right;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${docs.length === 0 ? '<tr><td colspan="6" class="text-center" style="padding:28px;color:var(--text-dim);">Belum ada surat kapal. Silakan tambah dengan tombol di atas.</td></tr>' : ''}
              ${docs.map(d => {
                const sisa = d.sisaHari != null ? d.sisaHari : Math.round((new Date(d.expiredAt) - Date.now()) / (1000 * 60 * 60 * 24));
                const sisaColor = sisa < 30 ? 'var(--accent-rose)' : sisa < 90 ? 'var(--accent-amber)' : 'var(--accent-emerald)';

                return `
                <tr class="dok-row" data-text="${d.type.toLowerCase()}">
                  <td><b>${esc(d.type)}</b></td>
                  <td class="mono">${(d.issuedAt || '').slice(0, 10) || '—'}</td>
                  <td class="mono"><b>${(d.expiredAt || '').slice(0, 10)}</b></td>
                  <td>
                    <span class="mono" style="font-size:15px;font-weight:800;color:${sisaColor};">H${sisa >= 0 ? '+' : ''}${sisa}</span>
                    <span class="stat-card-sub"> hari</span>
                  </td>
                  <td>${badge(d.status)}</td>
                  <td style="text-align:right;">
                    <button class="btn-sm btn-ghost" onclick="openModalUploadScan('ship-document', '${d.id}')">📎 Upload Scan</button>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  } catch (e) {
    toast('Gagal memuat surat kapal: ' + e.message, 'error');
  }
}

function filterDokTable() {
  const query = (document.getElementById('search-dok')?.value || '').toLowerCase().trim();
  document.querySelectorAll('#tbl-dok tbody tr.dok-row').forEach(row => {
    const text = row.getAttribute('data-text') || '';
    row.style.display = !query || text.includes(query) ? '' : 'none';
  });
}

/* ══════════════════════════════════════════════════════════════════
   6. CREW & SERTIFIKAT VIEW
   ══════════════════════════════════════════════════════════════════ */
async function loadCrew() {
  setLoading('crew', 'Memuat data personalia, sertifikasi, kasbon, dan kegiatan drill');
  try {
    const crews = await api('/crews?shipId=' + activeShipId);
    const activities = await api('/activities?shipId=' + activeShipId).catch(() => []);
    const attendances = await api('/attendances?shipId=' + activeShipId).catch(() => []);
    const kasbonList = await api('/kasbon?shipId=' + activeShipId).catch(() => []);

    const totalDrills = activities.filter(a => a.type === 'drill').length;
    const completedActs = activities.filter(a => a.status === 'completed').length;
    const activeOnboard = attendances.filter(a => !a.signOff || a.status === 'onboard').length;
    const pendingKasbon = kasbonList.filter(k => k.status === 'pending').length;
    const totalNominalKasbon = kasbonList.reduce((acc, k) => acc + Number(k.amount || 0), 0);

    const c = document.getElementById('view-crew');
    c.innerHTML = `
      <div class="view-header">
        <div class="view-header-title">
          <span class="view-icon">👥</span>
          <div>
            <h2>Personalia, Sertifikasi, Kasbon & Kegiatan Kapal</h2>
            <p class="stat-card-sub">Manajemen awak kapal, sertifikat kompetensi (STCW), ijin kasbon, latihan keadaan darurat (Drills), dan log kehadiran di <b>${getCurrentShipName()}</b></p>
          </div>
        </div>
        <div class="view-header-actions">
          <button class="btn btn-primary" onclick="openModalAddKasbon()">💵 Ajukan Kasbon Kru</button>
          <button class="btn btn-ghost" onclick="openModalAddActivity()">🚨 Catat Drill / Kegiatan</button>
          <button class="btn btn-ghost" onclick="openModalAddCrewCert()">🎓 Tambah Sertifikat</button>
        </div>
      </div>

      <!-- Personalia Stats Grid -->
      <div class="grid-stats">
        <div class="stat-card border-accent-blue">
          <div class="stat-card-header">
            <span class="stat-card-label">Total Kru Bertugas</span>
            <div class="stat-card-icon">👥</div>
          </div>
          <div class="stat-card-num">${crews.length} <span style="font-size:14px;color:var(--text-muted);">Personel</span></div>
          <div class="stat-card-sub">Awak kapal aktif terdaftar</div>
        </div>

        <div class="stat-card border-accent-amber">
          <div class="stat-card-header">
            <span class="stat-card-label">Kasbon Menunggu Approval</span>
            <div class="stat-card-icon">💵</div>
          </div>
          <div class="stat-card-num" style="color:var(--accent-amber);">${pendingKasbon}</div>
          <div class="stat-card-sub">Total pengajuan: ${rp(totalNominalKasbon)}</div>
        </div>

        <div class="stat-card border-accent-emerald">
          <div class="stat-card-header">
            <span class="stat-card-label">Kru Hadir Onboard</span>
            <div class="stat-card-icon">⚓</div>
          </div>
          <div class="stat-card-num" style="color:var(--accent-emerald);">${activeOnboard || crews.length}</div>
          <div class="stat-card-sub">Sedang berlayar / di atas kapal</div>
        </div>

        <div class="stat-card border-accent-rose">
          <div class="stat-card-header">
            <span class="stat-card-label">Latihan Drill Keselamatan</span>
            <div class="stat-card-icon">🚨</div>
          </div>
          <div class="stat-card-num">${totalDrills} <span style="font-size:14px;color:var(--text-muted);">Drill</span></div>
          <div class="stat-card-sub">Fire drill, abandon ship, dll</div>
        </div>
      </div>

      <!-- Sub-Tabs Navigation for Personalia -->
      <div class="sub-tabs-nav">
        <button class="sub-tab-btn ${activeCrewSubtab === 'crews' ? 'active' : ''}" onclick="switchCrewTab('crews', this)">👤 Awak Kapal & Sertifikasi (${crews.length})</button>
        <button class="sub-tab-btn ${activeCrewSubtab === 'kasbon' ? 'active' : ''}" onclick="switchCrewTab('kasbon', this)">💵 Ijin Kasbon Kru (${kasbonList.length})</button>
        <button class="sub-tab-btn ${activeCrewSubtab === 'activities' ? 'active' : ''}" onclick="switchCrewTab('activities', this)">🚨 Kegiatan & Drill Keselamatan (${activities.length})</button>
        <button class="sub-tab-btn ${activeCrewSubtab === 'attendance' ? 'active' : ''}" onclick="switchCrewTab('attendance', this)">⚓ Log Kehadiran Onboard (${attendances.length})</button>
      </div>

      <!-- PANE 1: AWAK KAPAL & SERTIFIKASI -->
      <div id="pane-crew-crews" class="sub-pane ${activeCrewSubtab === 'crews' ? 'active' : ''}">
        <div class="table-card">
          <div class="table-toolbar">
            <div class="table-title">
              <span>Daftar Awak Kapal & Masa Berlaku Sertifikat</span>
            </div>
            <div class="table-controls">
              <button class="btn-sm btn-ghost" onclick="openModalAddContract()">📋 Catat Kontrak Sign-on</button>
              <button class="btn-sm btn-ghost" onclick="openModalCrewPhoto()">📷 Upload Foto</button>
              <div class="search-box">
                <span class="search-icon">🔍</span>
                <input type="text" id="search-crew" placeholder="Cari nama / jabatan..." oninput="filterCrewTable()">
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table id="tbl-crew">
              <thead>
                <tr>
                  <th style="width:60px;">Foto</th>
                  <th>Nama Lengkap & Jabatan</th>
                  <th>Sertifikat Kompetensi</th>
                  <th>Masa Berlaku</th>
                  <th>Status Sertifikat</th>
                  <th>Riwayat Kontrak Sign-on</th>
                  <th style="text-align:right;">Aksi</th>
                </tr>
              </thead>
              <tbody>
                ${crews.length === 0 ? '<tr><td colspan="7" class="text-center" style="padding:28px;color:var(--text-dim);">Belum ada kru bertugas di kapal ini.</td></tr>' : ''}
                ${crews.map(cr => {
                  const ctr = (cr.contracts || []).map(x =>
                    `<div class="mono stat-card-sub">${(x.signOn || '').slice(0, 10)} → ${x.signOff ? x.signOff.slice(0, 10) : '<b style="color:var(--accent-emerald)">Aktif Onboard</b>'}</div>`
                  ).join('') || '<span class="stat-card-sub">—</span>';

                  const img = cr.photo
                    ? `<img src="${cr.photo}" style="width:42px;height:42px;object-fit:cover;border-radius:50%;border:2px solid var(--border-subtle);" alt="Foto">`
                    : `<div style="width:42px;height:42px;background:rgba(30,41,59,0.7);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:1px solid var(--border-subtle);">👤</div>`;

                  const certs = cr.certificates && cr.certificates.length ? cr.certificates : [{ id: '', type: '—', expiredAt: '', status: 'aktif' }];

                  return certs.map((x, i) => `
                    <tr class="crew-row" data-text="${(cr.name + ' ' + cr.rank + ' ' + x.type).toLowerCase()}">
                      ${i === 0 ? `
                      <td rowspan="${certs.length}" style="text-align:center;">${img}</td>
                      <td rowspan="${certs.length}">
                        <b>${esc(cr.name)}</b>
                        <div class="stat-card-sub"><b>${esc(cr.rank)}</b> • <span class="mono">${cr.id}</span></div>
                      </td>` : ''}
                      <td><b>${esc(x.type)}</b></td>
                      <td class="mono">${(x.expiredAt || '').slice(0, 10) || '—'}</td>
                      <td>${x.type !== '—' ? badge(x.status) : '<span class="stat-card-sub">—</span>'}</td>
                      ${i === 0 ? `<td rowspan="${certs.length}">${ctr}</td>` : ''}
                      ${i === 0 ? `
                      <td rowspan="${certs.length}" style="text-align:right;">
                        <button class="btn-sm btn-ghost" onclick="openModalAddCrewCert()" title="Tambah sertifikat">🎓 + Sertifikat</button>
                      </td>` : ''}
                    </tr>`).join('');
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- PANE 2: IJIN KASBON AWAK KAPAL (NEW) -->
      <div id="pane-crew-kasbon" class="sub-pane ${activeCrewSubtab === 'kasbon' ? 'active' : ''}">
        <div class="table-card">
          <div class="table-toolbar">
            <div class="table-title">
              <span>💵 Daftar Permohonan Kasbon & Pinjaman Awak Kapal</span>
            </div>
            <button class="btn-sm btn-primary" onclick="openModalAddKasbon()">➕ Ajukan Kasbon Baru</button>
          </div>

          <div class="table-responsive">
            <table id="tbl-kasbon">
              <thead>
                <tr>
                  <th>ID / Tgl Pengajuan</th>
                  <th>Awak Kapal Pemohon</th>
                  <th>Nominal Kasbon</th>
                  <th>Rencana Potong Gaji</th>
                  <th>Keperluan / Alasan</th>
                  <th>Status Kasbon</th>
                  <th>Persetujuan / Pencairan</th>
                  <th style="text-align:right;">Aksi Alur Kasbon</th>
                </tr>
              </thead>
              <tbody>
                ${kasbonList.length === 0 ? '<tr><td colspan="8" class="text-center" style="padding:28px;color:var(--text-dim);">Belum ada permohonan kasbon. Klik "+ Ajukan Kasbon Baru".</td></tr>' : ''}
                ${kasbonList.map(kb => {
                  const instLabel = kb.installmentMonths > 1 ? `${kb.installmentMonths} Bulan (@ ${rp(Math.round(kb.amount / kb.installmentMonths))})` : '1x Potong Gaji';
                  const stBadge = kb.status === 'approved' ? '<span class="badge warning">✓ Disetujui</span>'
                    : kb.status === 'disbursed' ? '<span class="badge aktif">💵 Telah Dicairkan</span>'
                    : kb.status === 'rejected' ? '<span class="badge danger">✗ Ditolak</span>'
                    : '<span class="badge">⏳ Pending Review</span>';

                  return `
                  <tr>
                    <td>
                      <span class="mono" style="font-weight:700;color:var(--accent-cyan);">${esc(kb.id)}</span>
                      <div class="mono stat-card-sub">${(kb.date || '').slice(0, 10)}</div>
                    </td>
                    <td>
                      <b>${esc(kb.crewName || kb.crewId)}</b>
                      <div class="stat-card-sub"><b>${esc(kb.rank || 'ABK')}</b> • <span class="mono">${kb.crewId}</span></div>
                    </td>
                    <td class="mono" style="font-size:15px;font-weight:800;color:var(--accent-emerald);">${rp(kb.amount)}</td>
                    <td class="mono stat-card-sub"><b>${instLabel}</b></td>
                    <td style="font-size:13px;max-width:220px;line-height:1.4;">
                      ${esc(kb.reason)}
                      ${kb.notes ? `<div class="stat-card-sub" style="margin-top:2px;">NB: ${esc(kb.notes)}</div>` : ''}
                    </td>
                    <td>${stBadge}</td>
                    <td style="font-size:12px;">
                      ${kb.approvedBy ? `<div>Disetujui: <b>${esc(kb.approvedBy)}</b></div>` : ''}
                      ${kb.disbursedBy ? `<div style="color:var(--accent-emerald);">Dicairkan: <b>${esc(kb.disbursedBy)}</b></div>` : ''}
                      ${!kb.approvedBy && !kb.disbursedBy ? '<span class="stat-card-sub">—</span>' : ''}
                    </td>
                    <td style="text-align:right;">
                      ${kb.status === 'pending' ? `
                        <button class="btn-sm btn-success" onclick="updateKasbonStatus('${kb.id}', 'approved')" title="Setujui pengajuan kasbon">✓ Setujui</button>
                        <button class="btn-sm btn-danger" onclick="updateKasbonStatus('${kb.id}', 'rejected')" title="Tolak pengajuan kasbon">✗ Tolak</button>` : ''}
                      ${kb.status === 'approved' ? `
                        <button class="btn-sm btn-primary" onclick="updateKasbonStatus('${kb.id}', 'disbursed')" title="Serahkan dana & tandai dicairkan">💵 Cairkan Dana</button>` : ''}
                      ${kb.status === 'disbursed' ? `
                        <span style="color:var(--accent-emerald);font-size:12px;font-weight:600;">✓ Cair</span>` : ''}
                      ${kb.status === 'rejected' ? `
                        <span class="stat-card-sub">Ditolak</span>` : ''}
                    </td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- PANE 3: KEGIATAN & DRILL KESELAMATAN (PRD §7.5.4) -->
      <div id="pane-crew-activities" class="sub-pane">
        <div class="table-card">
          <div class="table-toolbar">
            <div class="table-title">
              <span>🚨 Kalender Latihan Darurat (Drill) & Kegiatan Keselamatan Pelayaran</span>
            </div>
            <button class="btn-sm btn-primary" onclick="openModalAddActivity()">➕ Catat Kegiatan / Drill Baru</button>
          </div>

          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Kategori</th>
                  <th>Judul / Topik Kegiatan</th>
                  <th>Instruktur / PIC</th>
                  <th>Peserta</th>
                  <th>Hasil / Evaluasi Respon</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${activities.length === 0 ? '<tr><td colspan="7" class="text-center" style="padding:28px;color:var(--text-dim);">Belum ada kegiatan/drill tercatat. Klik "+ Catat Kegiatan / Drill Baru".</td></tr>' : ''}
                ${activities.map(a => {
                  const typeBadge = a.type === 'drill' ? '<span class="badge danger">🚨 Drill Darurat</span>'
                    : a.type === 'meeting' ? '<span class="badge warning">👥 Safety Meeting</span>'
                    : a.type === 'training' ? '<span class="badge info">🎓 Pelatihan</span>'
                    : '<span class="badge">📋 Evaluasi</span>';
                  return `
                  <tr>
                    <td class="mono"><b>${(a.date || '').slice(0, 10)}</b></td>
                    <td>${typeBadge}</td>
                    <td><b>${esc(a.title)}</b></td>
                    <td>👤 ${esc(a.pic || '—')}</td>
                    <td style="font-size:12px;">${esc(a.participants || '—')}</td>
                    <td style="max-width:240px;font-size:13px;line-height:1.4;">${esc(a.result || '—')}</td>
                    <td>${a.status === 'completed' ? '<span class="badge aktif">✓ Selesai</span>' : '<span class="badge warning">📅 Terjadwal</span>'}</td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- PANE 4: LOG KEHADIRAN ONBOARD (PRD §7.5.2) -->
      <div id="pane-crew-attendance" class="sub-pane">
        <div class="table-card">
          <div class="table-toolbar">
            <div class="table-title">
              <span>⚓ Log Kehadiran Awak Kapal (Sign-On & Sign-Off History)</span>
            </div>
            <button class="btn-sm btn-primary" onclick="openModalAddAttendance()">➕ Catat Kehadiran / Mutasi</button>
          </div>

          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Awak Kapal</th>
                  <th>Jabatan</th>
                  <th>Tanggal Sign-On</th>
                  <th>Tanggal Sign-Off</th>
                  <th>Status Penugasan</th>
                  <th>Catatan / Lokasi Pelabuhan</th>
                </tr>
              </thead>
              <tbody>
                ${attendances.length === 0 ? '<tr><td colspan="6" class="text-center" style="padding:28px;color:var(--text-dim);">Belum ada log kehadiran tercatat. Klik "+ Catat Kehadiran / Mutasi".</td></tr>' : ''}
                ${attendances.map(at => {
                  const statusBadge = at.status === 'onboard' || !at.signOff 
                    ? '<span class="badge aktif">⚓ Aktif Onboard</span>' 
                    : at.status === 'standby' ? '<span class="badge warning">⏳ Standby</span>' 
                    : '<span class="badge">🚢 Signed-Off</span>';
                  return `
                  <tr>
                    <td><b>${esc(at.crewName || at.crewId)}</b></td>
                    <td><b>${esc(at.rank || 'ABK')}</b></td>
                    <td class="mono">${(at.signOn || '').slice(0, 10) || '—'}</td>
                    <td class="mono">${(at.signOff || '').slice(0, 10) || '<span style="color:var(--accent-emerald);">Sedang Bertugas</span>'}</td>
                    <td>${statusBadge}</td>
                    <td style="font-size:13px;">${esc(at.notes || '—')}</td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>`;
  } catch (e) {
    toast('Gagal memuat data crew: ' + e.message, 'error');
  }
}

function switchCrewTab(tabKey, btn) {
  activeCrewSubtab = tabKey;
  document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.sub-pane').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const pane = document.getElementById('pane-crew-' + tabKey);
  if (pane) pane.classList.add('active');
}

function filterCrewTable() {
  const query = (document.getElementById('search-crew')?.value || '').toLowerCase().trim();
  document.querySelectorAll('#tbl-crew tbody tr.crew-row').forEach(row => {
    const text = row.getAttribute('data-text') || '';
    row.style.display = !query || text.includes(query) ? '' : 'none';
  });
}

/* ══════════════════════════════════════════════════════════════════
   7. PENGAJUAN CUTI VIEW
   ══════════════════════════════════════════════════════════════════ */
async function loadCuti() {
  setLoading('cuti', 'Memuat pengajuan cuti dan kuota');
  try {
    const leaves = await api('/leaves?shipId=' + activeShipId);
    const crews = await api('/crews?shipId=' + activeShipId).catch(() => []);
    const pendingCount = leaves.filter(l => l.status === 'pending').length;
    const approvedCount = leaves.filter(l => l.status === 'approved').length;

    const c = document.getElementById('view-cuti');
    c.innerHTML = `
      <div class="view-header">
        <div class="view-header-title">
          <span class="view-icon">🏖️</span>
          <div>
            <h2>Pengajuan Cuti & Alur Persetujuan (PRD §7.5.3)</h2>
            <p class="stat-card-sub">Manajemen permohonan cuti, sisa kuota hak cuti pelaut, dan approval berjenjang di <b>${getCurrentShipName()}</b></p>
          </div>
        </div>
        <div class="view-header-actions">
          <button class="btn btn-primary" onclick="openModalAddLeave()">➕ Ajukan Cuti Baru</button>
        </div>
      </div>

      <div class="grid-stats">
        <div class="stat-card border-accent-blue">
          <div class="stat-card-header">
            <span class="stat-card-label">Total Permohonan Cuti</span>
            <div class="stat-card-icon">📋</div>
          </div>
          <div class="stat-card-num">${leaves.length} <span style="font-size:14px;color:var(--text-muted);">Pengajuan</span></div>
          <div class="stat-card-sub">Semua status pengajuan cuti</div>
        </div>

        <div class="stat-card border-accent-amber">
          <div class="stat-card-header">
            <span class="stat-card-label">Menunggu Persetujuan</span>
            <div class="stat-card-icon">⏳</div>
          </div>
          <div class="stat-card-num" style="color:var(--accent-amber);">${pendingCount}</div>
          <div class="stat-card-sub">Butuh tindakan Admin / Fleet</div>
        </div>

        <div class="stat-card border-accent-emerald">
          <div class="stat-card-header">
            <span class="stat-card-label">Telah Disetujui</span>
            <div class="stat-card-icon">✅</div>
          </div>
          <div class="stat-card-num" style="color:var(--accent-emerald);">${approvedCount}</div>
          <div class="stat-card-sub">Jadwal sign-off cuti aktif</div>
        </div>

        <div class="stat-card border-accent-cyan">
          <div class="stat-card-header">
            <span class="stat-card-label">Standar Kuota Cuti</span>
            <div class="stat-card-icon">🏖️</div>
          </div>
          <div class="stat-card-num" style="color:var(--accent-cyan);">14 <span style="font-size:14px;color:var(--text-muted);">Hari / Thn</span></div>
          <div class="stat-card-sub">Sesuai Perjanjian Kerja Laut (PKL)</div>
        </div>
      </div>

      <div class="table-card">
        <div class="table-toolbar">
          <div class="table-title">
            <span>Daftar Pengajuan Cuti Awak Kapal</span>
          </div>
          <button class="btn-sm btn-primary" onclick="openModalAddLeave()">➕ Ajukan Cuti</button>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Awak Kapal Pemohon</th>
                <th>Mulai Cuti</th>
                <th>Selesai Cuti</th>
                <th>Durasi</th>
                <th>Alasan Cuti</th>
                <th>Status</th>
                <th>Disetujui / Ditolak</th>
                <th style="text-align:right;">Aksi Keputusan</th>
              </tr>
            </thead>
            <tbody>
              ${leaves.length === 0 ? '<tr><td colspan="8" class="text-center" style="padding:28px;color:var(--text-dim);">Tidak ada pengajuan cuti saat ini. Klik "+ Ajukan Cuti Baru".</td></tr>' : ''}
              ${leaves.map(l => {
                const crewObj = crews.find(c => c.id === l.crewId);
                const sDate = new Date(l.startDate);
                const eDate = new Date(l.endDate);
                const diffDays = Math.max(1, Math.round((eDate - sDate) / 86400000));
                return `
                <tr>
                  <td>
                    <b>${esc(crewObj?.name || l.crewId)}</b>
                    <div class="stat-card-sub"><b>${esc(crewObj?.rank || 'ABK')}</b> • <span class="mono">${l.crewId}</span></div>
                  </td>
                  <td class="mono"><b>${(l.startDate || '').slice(0, 10)}</b></td>
                  <td class="mono"><b>${(l.endDate || '').slice(0, 10)}</b></td>
                  <td class="mono"><b>${diffDays} Hari</b></td>
                  <td style="font-size:13px;max-width:200px;">${esc(l.reason || 'Cuti')}</td>
                  <td>${badge(l.status)}</td>
                  <td>${l.approvedBy ? `👤 <b>${esc(l.approvedBy)}</b>` : '<span class="stat-card-sub">—</span>'}</td>
                  <td style="text-align:right;">
                    ${l.status === 'pending' ? `
                      <button class="btn-sm btn-success" onclick="approveLeaveAction('${l.id}', 'approved')" title="Setujui permohonan cuti">✓ Setujui</button>
                      <button class="btn-sm btn-danger" onclick="approveLeaveAction('${l.id}', 'rejected')" title="Tolak permohonan cuti">✗ Tolak</button>`
                      : '<span class="stat-card-sub">Selesai diproses</span>'}
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  } catch (e) {
    toast('Gagal memuat cuti: ' + e.message, 'error');
  }
}

/* ══════════════════════════════════════════════════════════════════
   8. BIAYA & BUDGET VIEW
   ══════════════════════════════════════════════════════════════════ */
async function loadBiaya() {
  setLoading('biaya', 'Memuat laporan biaya dan budget');
  try {
    const rep = await api('/reports/costs?shipId=' + activeShipId);
    const usePct = rep.budget > 0 ? Math.round((rep.total / rep.budget) * 100) : 0;
    const useClr = usePct > 90 ? 'var(--accent-rose)' : usePct > 70 ? 'var(--accent-amber)' : 'var(--accent-emerald)';

    const c = document.getElementById('view-biaya');
    c.innerHTML = `
      <div class="view-header">
        <div class="view-header-title">
          <span class="view-icon">💰</span>
          <div>
            <h2>Laporan Biaya & Realisasi Anggaran</h2>
            <p class="stat-card-sub">Monitoring pengeluaran aktual vs budget untuk <b>${getCurrentShipName()}</b></p>
          </div>
        </div>
        <div class="view-header-actions">
          <button class="btn btn-primary" onclick="openModalAddCost()">➕ Catat Biaya Baru</button>
        </div>
      </div>

      <!-- Budget Stats Grid -->
      <div class="grid-stats">
        <div class="stat-card border-accent-blue">
          <div class="stat-card-header">
            <span class="stat-card-label">Anggaran (Budget)</span>
            <div class="stat-card-icon">💵</div>
          </div>
          <div class="stat-card-num mono" style="color:var(--accent-cyan);">${rp(rep.budget)}</div>
          <div class="stat-card-sub">Pagu anggaran pemeliharaan</div>
        </div>

        <div class="stat-card border-accent-rose">
          <div class="stat-card-header">
            <span class="stat-card-label">Pengeluaran Aktual</span>
            <div class="stat-card-icon">💸</div>
          </div>
          <div class="stat-card-num mono" style="color:${rep.total > rep.budget ? 'var(--accent-rose)' : '#fff'};">${rp(rep.total)}</div>
          <div class="stat-card-sub">Total pengeluaran tercatat</div>
        </div>

        <div class="stat-card border-accent-emerald">
          <div class="stat-card-header">
            <span class="stat-card-label">Sisa Anggaran</span>
            <div class="stat-card-icon">🛡️</div>
          </div>
          <div class="stat-card-num mono" style="color:${rep.sisa < 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">${rp(rep.sisa)}</div>
          <div class="stat-card-sub">${rep.sisa < 0 ? 'Defisit anggaran' : 'Sisa pagu tersedia'}</div>
        </div>

        <div class="stat-card border-accent-amber">
          <div class="stat-card-header">
            <span class="stat-card-label">Tingkat Penyerapan</span>
            <div class="stat-card-icon">📈</div>
          </div>
          <div class="stat-card-num" style="color:${useClr};">${usePct}%</div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="background:${useClr};width:${Math.min(usePct, 100)}%;"></div>
          </div>
          <div class="stat-card-sub" style="margin-top:4px;">Dari total alokasi budget</div>
        </div>
      </div>

      <!-- Chart Card -->
      <div class="table-card" style="padding:18px;margin-bottom:24px;">
        <div class="table-title" style="margin-bottom:14px;">
          <span>📊 Grafik Distribusi Biaya per Kategori</span>
        </div>
        <div style="height:200px;position:relative;">
          <canvas id="costChart" width="800" height="200"></canvas>
        </div>
      </div>

      <!-- Detail Biaya Table -->
      <div class="table-card">
        <div class="table-toolbar">
          <div class="table-title">
            <span>Rincian Pengeluaran</span>
          </div>
          <div class="table-controls">
            <button class="btn-sm btn-ghost" onclick="exportCSV('${activeShipId}')">📥 CSV</button>
            <button class="btn-sm btn-ghost" onclick="exportXLS('${activeShipId}')">📥 Excel</button>
            <button class="btn-sm btn-ghost" onclick="exportPDF('${activeShipId}')">📥 PDF</button>
          </div>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Kategori Biaya</th>
                <th>Keterangan / Catatan</th>
                <th style="text-align:right;">Nominal</th>
              </tr>
            </thead>
            <tbody>
              ${rep.items.length === 0 ? '<tr><td colspan="4" class="text-center" style="padding:28px;color:var(--text-dim);">Belum ada catatan biaya.</td></tr>' : ''}
              ${rep.items.map(c => `
                <tr>
                  <td class="mono">${(c.date || '').slice(0, 10)}</td>
                  <td><span class="badge" style="background:rgba(37,99,235,0.2);border:1px solid rgba(56,189,248,0.3);color:var(--accent-cyan);">${esc(c.kind)}</span></td>
                  <td>${esc(c.note || '—')}</td>
                  <td class="mono" style="text-align:right;"><b>${rp(c.amount)}</b></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>`;

    drawCostChart(rep.items);
  } catch (e) {
    toast('Gagal memuat laporan biaya: ' + e.message, 'error');
  }
}

/* ══════════════════════════════════════════════════════════════════
   9. KPI KEPATUHAN VIEW (PRD §14)
   ══════════════════════════════════════════════════════════════════ */
async function loadKPI() {
  setLoading('kpi', 'Menghitung indikator KPI kepatuhan');
  try {
    const k = await api('/reports/kpi');
    const cmpClr = k.kepatuhanMaintenance >= k.targetMaintenance ? 'var(--accent-emerald)' : 'var(--accent-rose)';
    const crtClr = k.sertifikatExpiredTanpaNotif === 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)';
    const docClr = k.suratExpiredTanpaNotif === 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)';

    const c = document.getElementById('view-kpi');
    c.innerHTML = `
      <div class="view-header">
        <div class="view-header-title">
          <span class="view-icon">📊</span>
          <div>
            <h2>Key Performance Indicators (KPI Kepatuhan)</h2>
            <p class="stat-card-sub">Metrik keberhasilan operasional sistem perawatan kapal berdasarkan PRD §14</p>
          </div>
        </div>
        <div class="view-header-actions">
          <button class="btn btn-ghost" onclick="loadKPI()">🔄 Refresh Metrik</button>
        </div>
      </div>

      <div class="grid-stats">
        <div class="stat-card" style="border-left:4px solid ${cmpClr};">
          <div class="stat-card-header">
            <span class="stat-card-label">Kepatuhan Maintenance</span>
            <div class="stat-card-icon">🎯</div>
          </div>
          <div class="stat-card-num" style="color:${cmpClr};">${k.kepatuhanMaintenance}%</div>
          <div class="stat-card-sub">Target: ≥ ${k.targetMaintenance}%</div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="background:${cmpClr};width:${k.kepatuhanMaintenance}%;"></div>
          </div>
          <div class="stat-card-sub" style="margin-top:6px;"><b>${k.doneOnTime}</b> dari <b>${k.totalWO}</b> WO selesai tepat waktu</div>
        </div>

        <div class="stat-card" style="border-left:4px solid ${crtClr};">
          <div class="stat-card-header">
            <span class="stat-card-label">Sertifikat Expired Tanpa Notif</span>
            <div class="stat-card-icon">🎓</div>
          </div>
          <div class="stat-card-num" style="color:${crtClr};">${k.sertifikatExpiredTanpaNotif}</div>
          <div class="stat-card-sub">Target Standar: <b>0 Kasus</b></div>
          <div style="margin-top:8px;font-size:12px;font-weight:600;color:${crtClr};">
            ${k.sertifikatExpiredTanpaNotif === 0 ? '✓ Target Zero Expiry Tercapai' : '⚠️ Terjadi Anomali Notifikasi'}
          </div>
        </div>

        <div class="stat-card" style="border-left:4px solid ${docClr};">
          <div class="stat-card-header">
            <span class="stat-card-label">Surat Expired Tanpa Notif</span>
            <div class="stat-card-icon">📄</div>
          </div>
          <div class="stat-card-num" style="color:${docClr};">${k.suratExpiredTanpaNotif}</div>
          <div class="stat-card-sub">Target Standar: <b>0 Kasus</b></div>
          <div style="margin-top:8px;font-size:12px;font-weight:600;color:${docClr};">
            ${k.suratExpiredTanpaNotif === 0 ? '✓ Target Zero Expiry Tercapai' : '⚠️ Terjadi Anomali Notifikasi'}
          </div>
        </div>

        <div class="stat-card border-accent-blue">
          <div class="stat-card-header">
            <span class="stat-card-label">Total Notifikasi Terkirim</span>
            <div class="stat-card-icon">🔔</div>
          </div>
          <div class="stat-card-num" style="color:var(--accent-cyan);">${k.totalNotif}</div>
          <div class="stat-card-sub">Reminder H-90 s/d H-1 berhasil diproses</div>
        </div>
      </div>

      <div class="table-card" style="padding:18px;">
        <div class="table-title" style="margin-bottom:14px;">
          <span>📈 Perbandingan Hasil Realisasi vs Beban Pekerjaan</span>
        </div>
        <div style="height:200px;position:relative;">
          <canvas id="kpiChart" width="800" height="200"></canvas>
        </div>
      </div>`;

    drawKpiChart(k);
  } catch (e) {
    toast('Gagal memuat KPI: ' + e.message, 'error');
  }
}

/* ══════════════════════════════════════════════════════════════════
   10. LOG NOTIFIKASI VIEW
   ══════════════════════════════════════════════════════════════════ */
async function loadNotifications() {
  setLoading('notif', 'Memuat riwayat pengiriman notifikasi');
  try {
    const nl = await api('/notification-logs');

    const c = document.getElementById('view-notif');
    c.innerHTML = `
      <div class="view-header">
        <div class="view-header-title">
          <span class="view-icon">🔔</span>
          <div>
            <h2>Log Pengiriman Notifikasi & Reminder</h2>
            <p class="stat-card-sub">Riwayat reminder otomatis via WhatsApp, Push Notification, dan Email</p>
          </div>
        </div>
        <div class="view-header-actions">
          <button class="btn btn-primary" onclick="runSched()">⏰ Jalankan Scheduler Sekarang</button>
        </div>
      </div>

      <div class="table-card">
        <div class="table-toolbar">
          <div class="table-title">
            <span>Riwayat 50 Notifikasi Terakhir (Total: ${nl.length})</span>
          </div>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Waktu Pengiriman</th>
                <th>Jenis Entitas</th>
                <th>Target Penerima</th>
                <th>Channel Pengiriman</th>
                <th>Status Respon</th>
              </tr>
            </thead>
            <tbody>
              ${nl.length === 0 ? '<tr><td colspan="5" class="text-center" style="padding:28px;color:var(--text-dim);">Belum ada log pengiriman. Klik "Jalankan Scheduler Sekarang".</td></tr>' : ''}
              ${nl.slice(0, 50).map(n => `
                <tr>
                  <td class="mono">${(n.at || '').slice(0, 19).replace('T', ' ')}</td>
                  <td><span class="badge" style="background:rgba(30,41,59,0.8);border:1px solid var(--border-subtle);">${n.targetType}</span></td>
                  <td><b>${esc(n.target)}</b></td>
                  <td><span class="mono" style="font-size:12px;font-weight:600;color:var(--accent-cyan);">${n.channel}</span></td>
                  <td>${badge(n.status)}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  } catch (e) {
    toast('Gagal memuat log notifikasi: ' + e.message, 'error');
  }
}

/* ══════════════════════════════════════════════════════════════════
   11. AUDIT TRAIL VIEW
   ══════════════════════════════════════════════════════════════════ */
async function loadAudit() {
  setLoading('audit', 'Memuat log audit trail aktivitas');
  try {
    const audits = await api('/audit-logs');

    const c = document.getElementById('view-audit');
    c.innerHTML = `
      <div class="view-header">
        <div class="view-header-title">
          <span class="view-icon">📝</span>
          <div>
            <h2>Audit Trail Aktivitas Pengguna</h2>
            <p class="stat-card-sub">Rekam jejak setiap perubahan data (siapa, kapan, aksi, dan entitas terkait)</p>
          </div>
        </div>
      </div>

      <div class="table-card">
        <div class="table-toolbar">
          <div class="table-title">
            <span>Catatan Audit Log (Total: ${audits.length})</span>
          </div>
          <div class="table-controls">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input type="text" id="search-audit" placeholder="Cari user / aksi..." oninput="filterAuditTable()">
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table id="tbl-audit">
            <thead>
              <tr>
                <th>Waktu Kejadian</th>
                <th>Pengguna (User)</th>
                <th>Aksi Operasi</th>
                <th>Entitas Terkait</th>
              </tr>
            </thead>
            <tbody>
              ${audits.length === 0 ? '<tr><td colspan="4" class="text-center" style="padding:28px;color:var(--text-dim);">Belum ada aktivitas audit tercatat.</td></tr>' : ''}
              ${audits.slice(0, 100).map(a => `
                <tr class="audit-row" data-text="${(a.user + ' ' + a.action + ' ' + a.entity).toLowerCase()}">
                  <td class="mono">${(a.at || '').slice(0, 19).replace('T', ' ')}</td>
                  <td><span class="badge" style="background:rgba(37,99,235,0.2);border:1px solid rgba(56,189,248,0.3);color:var(--accent-cyan);">👤 ${esc(a.user)}</span></td>
                  <td><b>${esc(a.action)}</b></td>
                  <td class="mono stat-card-sub">${esc(a.entity)}${a.entityId ? '/' + esc(a.entityId) : ''}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  } catch (e) {
    toast('Gagal memuat audit log: ' + e.message, 'error');
  }
}

function filterAuditTable() {
  const query = (document.getElementById('search-audit')?.value || '').toLowerCase().trim();
  document.querySelectorAll('#tbl-audit tbody tr.audit-row').forEach(row => {
    const text = row.getAttribute('data-text') || '';
    row.style.display = !query || text.includes(query) ? '' : 'none';
  });
}

/* ══════════════════════════════════════════════════════════════════
   12. HIGH-DPI CANVAS CHARTS (RETINA SHARP)
   ══════════════════════════════════════════════════════════════════ */
function drawBarsHighDPI(cvId, labels, values, colors) {
  const cv = document.getElementById(cvId);
  if (!cv) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = cv.getBoundingClientRect();
  const W = rect.width || 600;
  const H = rect.height || 180;

  cv.width = W * dpr;
  cv.height = H * dpr;

  const ctx = cv.getContext('2d');
  ctx.scale(dpr, dpr);

  const padL = 60, padB = 36, padT = 24, padR = 20;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  ctx.clearRect(0, 0, W, H);

  const max = Math.max(1, ...values);
  const n = values.length;
  const bw = Math.min(68, Math.floor(chartW / Math.max(1, n)) - 20);
  const gap = (chartW - n * bw) / (n + 1);

  // Horizontal Grid Lines
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + chartH - (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(W - padR, y);
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    const valStep = Math.round((max / 4) * i);
    ctx.fillText(valStep.toLocaleString('id-ID'), padL - 8, y + 3);
  }

  // Draw Bars
  const defaultPalette = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  values.forEach((v, i) => {
    const bh = Math.max(4, Math.round((v / max) * chartH));
    const x = padL + gap + i * (bw + gap);
    const y = padT + chartH - bh;
    const clr = Array.isArray(colors) ? colors[i % colors.length] : (colors || defaultPalette[i % defaultPalette.length]);

    // Gradient fill for bar
    const grad = ctx.createLinearGradient(0, y, 0, y + bh);
    grad.addColorStop(0, clr);
    grad.addColorStop(1, 'rgba(15, 23, 42, 0.7)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y, bw, bh, [6, 6, 0, 0]);
    } else {
      ctx.rect(x, y, bw, bh);
    }
    ctx.fill();

    // Subtle highlight border
    ctx.strokeStyle = clr;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Value text above bar
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(v.toLocaleString('id-ID'), x + bw / 2, y - 6);

    // X-axis label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(String(labels[i] || '').slice(0, 14), x + bw / 2, H - padB + 18);
  });
}

function drawCostChart(items) {
  const byKind = {};
  (items || []).forEach(c => {
    byKind[c.kind] = (byKind[c.kind] || 0) + Number(c.amount || 0);
  });
  const labels = Object.keys(byKind);
  const vals = labels.map(l => byKind[l]);
  if (!labels.length) return;
  drawBarsHighDPI('costChart', labels, vals, ['#10b981', '#2563eb', '#f59e0b', '#ef4444']);
}

function drawKpiChart(k) {
  drawBarsHighDPI(
    'kpiChart',
    ['WO Selesai Tepat', 'Total Work Orders', 'Notifikasi Terkirim'],
    [k.doneOnTime || 0, k.totalWO || 0, k.totalNotif || 0],
    ['#10b981', '#2563eb', '#8b5cf6']
  );
}

/* ── Scheduler Runner ────────────────────────────────────────────── */
async function runSched() {
  toast('Menjalankan scheduler reminder...', 'info', 2000);
  try {
    const j = await api('/scheduler/run', { method: 'POST' });
    toast(`Reminder selesai: ${j.sent} notifikasi diproses!`, 'success');
    updateBadges();
    if (currentView === 'notif') loadNotifications();
    if (currentView === 'kpi') loadKPI();
  } catch (e) {
    toast('Gagal menjalankan reminder: ' + e.message, 'error');
  }
}

/* ── Exports & Backup ────────────────────────────────────────────── */
function dlAuth(url, name) {
  toast('Menyiapkan file unduhan...', 'info', 2000);
  fetch(url, { headers: { Authorization: 'Bearer ' + token } })
    .then(r => r.blob())
    .then(b => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.download = name;
      a.click();
      toast(`File ${name} berhasil diunduh`, 'success');
    })
    .catch(() => toast('Gagal mengunduh file', 'error'));
}

async function exportXLS(id) { dlAuth(API + '/reports/costs?shipId=' + id + '&format=xls', 'biaya-' + id + '.xls'); }
async function exportPDF(id) { dlAuth(API + '/reports/costs?shipId=' + id + '&format=pdf', 'biaya-' + id + '.pdf'); }

async function exportCSV(id) {
  try {
    const j = await api('/reports/costs?shipId=' + id);
    const csv = 'tanggal,jenis,catatan,nominal\n' +
      j.items.map(c => `${(c.date || '').slice(0, 10)},${c.kind},"${(c.note || '').replace(/"/g, '""')}",${c.amount}`).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'biaya-' + id + '.csv';
    a.click();
    toast('CSV biaya berhasil diunduh', 'success');
  } catch (e) {
    toast('Gagal ekspor CSV: ' + e.message, 'error');
  }
}

async function backupDB() {
  try {
    const j = await api('/backup');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(j, null, 2)], { type: 'application/json' }));
    a.download = 'pms-backup-' + j.at.slice(0, 10) + '.json';
    a.click();
    toast('Backup basis data berhasil diunduh', 'success');
  } catch (e) {
    toast('Gagal backup: ' + e.message, 'error');
  }
}

/* ── Boot on Load if Token Present ───────────────────────────────── */
if (token) {
  boot();
}
