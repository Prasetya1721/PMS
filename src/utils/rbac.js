// Role-Based Access Control (RBAC) Configuration for PT. Pelayaran Baharimas Kalimantan

export const ROLE_DEFINITIONS = {
  'Developer': {
    label: 'Developer (Otoritas Tertinggi)',
    shortLabel: 'Developer',
    description: 'Otoritas tertinggi sistem: akses mutlak seluruh modul, konfigurasi sistem, API key, database, manajemen RBAC, dan kontrol teknis penuh',
    badgeClass: 'badge-purple',
    color: '#8b5cf6',
  },
  'Super Admin': {
    label: 'Super Admin (Editor Konten)',
    shortLabel: 'Super Admin',
    description: 'Pengelolaan dan pengeditan konten operasional: mengelola data kapal, dokumen, sertifikat, personel, dan penyesuaian teks portal sistem',
    badgeClass: 'badge-danger',
    color: '#ef4444',
  },
  'Fleet Manager': {
    label: 'Fleet Manager',
    shortLabel: 'Fleet Mgr',
    description: 'Pengawasan operasional seluruh armada kapal, pemeliharaan, persediaan, dan kepatuhan ISM',
    badgeClass: 'badge-warning',
    color: '#f59e0b',
  },
  'Admin Kapal / Nakhoda': {
    label: 'Admin Kapal / Nakhoda',
    shortLabel: 'Nakhoda',
    description: 'Pengendali operasional kapal KM. RP 2020, kru pelaut, keselamatan pelayaran, dan sertifikat legalitas',
    badgeClass: 'badge-primary',
    color: '#0284c7',
  },
  'Teknisi / Chief Engineer': {
    label: 'Teknisi / Chief Engineer',
    shortLabel: 'KKM Mesin',
    description: 'Penanggung jawab teknis kamar mesin, jam kerja peralatan, servis berkala PMS, dan suku cadang',
    badgeClass: 'badge-info',
    color: '#06b6d4',
  },
  'Crew / ABK': {
    label: 'Crew / ABK',
    shortLabel: 'ABK Pelaut',
    description: 'Kru pelaut operasional: checklist tugas servis harian, kehadiran, dan status sertifikat diri',
    badgeClass: 'badge-neutral',
    color: '#94a3b8',
  },
  'HR / Personalia': {
    label: 'HR / Personalia',
    shortLabel: 'HR & Crewing',
    description: 'Manajemen personalia kru, sertifikat STCW pelaut, pengingat jatuh tempo sertifikat, dan kehadiran',
    badgeClass: 'badge-success',
    color: '#10b981',
  },
  'Finance': {
    label: 'Finance',
    shortLabel: 'Keuangan',
    description: 'Pengelolaan anggaran pemeliharaan armada, biaya Work Order, purchasing sparepart, dan laporan finansial',
    badgeClass: 'badge-purple',
    color: '#8b5cf6',
  },
};

// Matriks Hak Akses Modul per Peran
export const ROLE_PERMISSIONS = {
  'Developer': [
    'dashboard',
    'fleet',
    'audit',
    'documents',
    'equipment',
    'maintenance',
    'spareparts',
    'costs',
    'crew',
    'notifications',
    'reports',
    'master',
    'settings',
    'sidebar_management',
    'developer_api',
  ],
  'Super Admin': [
    'dashboard',
    'fleet',
    'documents',
    'equipment',
    'maintenance',
    'spareparts',
    'crew',
    'notifications',
    'reports',
    'master',
    'settings',
  ],
  'Fleet Manager': [
    'dashboard',
    'fleet',
    'audit',
    'documents',
    'equipment',
    'maintenance',
    'spareparts',
    'costs',
    'crew',
    'notifications',
    'reports',
  ],
  'Admin Kapal / Nakhoda': [
    'dashboard',
    'fleet',
    'audit',
    'documents',
    'equipment',
    'maintenance',
    'spareparts',
    'crew',
    'notifications',
    'reports',
  ],
  'Teknisi / Chief Engineer': [
    'dashboard',
    'equipment',
    'maintenance',
    'spareparts',
    'audit',
    'reports',
  ],
  'Crew / ABK': [
    'dashboard',
    'maintenance',
    'spareparts',
    'crew',
    'documents',
  ],
  'HR / Personalia': [
    'dashboard',
    'crew',
    'documents',
    'notifications',
    'reports',
  ],
  'Finance': [
    'dashboard',
    'costs',
    'spareparts',
    'maintenance',
    'reports',
  ],
};

/**
 * Periksa apakah peran tertentu diizinkan mengakses modul
 * @param {string} role Nama peran (cth: 'Super Admin')
 * @param {string} moduleId ID modul (cth: 'costs')
 * @returns {boolean}
 */
export const hasAccess = (role, moduleId) => {
  if (!role) return false;
  // developer_api dan sidebar_management eksklusif hanya untuk peran Developer
  if (moduleId === 'developer_api' || moduleId === 'sidebar_management') {
    return role === 'Developer';
  }
  // Developer adalah otoritas tertinggi sistem dengan akses mutlak tanpa batasan
  if (role === 'Developer') return true;
  const baseModule = moduleId.startsWith('audit_') ? 'audit' : moduleId;
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.includes(moduleId) || allowed.includes(baseModule);
};

/**
 * Periksa akses modul dengan mempertimbangkan sidebar overrides dari Super Admin
 * @param {string} role Nama peran
 * @param {string} moduleId ID modul
 * @param {Object} sidebarOverrides Override map { role: [moduleId, ...] }
 * @returns {boolean}
 */
export const hasAccessWithOverrides = (role, moduleId, sidebarOverrides) => {
  if (!role) return false;
  // developer_api dan sidebar_management eksklusif hanya untuk peran Developer
  if (moduleId === 'developer_api' || moduleId === 'sidebar_management') {
    return role === 'Developer';
  }
  // Developer adalah otoritas tertinggi sistem dengan akses mutlak tanpa batasan
  if (role === 'Developer') return true;
  const baseModule = moduleId.startsWith('audit_') ? 'audit' : moduleId;
  // If overrides exist for this role, use them instead of default
  if (sidebarOverrides && sidebarOverrides[role] && Array.isArray(sidebarOverrides[role])) {
    return sidebarOverrides[role].includes(moduleId) || sidebarOverrides[role].includes(baseModule);
  }
  // Fallback to default RBAC
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.includes(moduleId) || allowed.includes(baseModule);
};

/**
 * Dapatkan seluruh ID modul yang dapat diakses oleh suatu peran
 * @param {string} role
 * @returns {string[]}
 */
export const getAllowedTabs = (role) => {
  return ROLE_PERMISSIONS[role] || ['dashboard'];
};

/**
 * Periksa izin aksi spesifik di dalam aplikasi
 * @param {string} role
 * @param {string} action
 * @returns {boolean}
 */
export const canPerformAction = (role, action) => {
  if (!role) return false;
  // Developer adalah otoritas tertinggi sistem dengan hak akses mutlak tanpa batasan
  if (role === 'Developer') return true;

  switch (action) {
    // ── Fungsi Operasi Destruktif & Sistem — HANYA Developer ──────────
    // Super Admin diturunkan dan tidak diizinkan melakukan tindakan destruktif ini
    case 'reset_all_data':         // clearAllData() — hapus semua data ke 0
    case 'load_demo_data':         // loadDemoData() — timpa data dengan data demo
    case 'reset_users':            // resetUsers() — reset semua akun ke bawaan
    case 'reset_site_config':      // resetSiteConfig() — reset konfigurasi situs
    case 'delete_vessel':          // Hapus kapal dari armada
    case 'delete_user':            // Hapus akun pengguna dari sistem
    case 'delete_certificate':     // Hapus sertifikat kapal
    case 'delete_ship_document':   // Hapus dokumen kapal
    case 'configure_api_keys':     // Konfigurasi API keys gateway
    case 'manage_developer_tools':   // Tool pengembang
    case 'manage_sidebar':         // Konfigurasi matriks sidebar RBAC
    case 'manage_subscription':    // Kontrol lisensi, running text langganan & remote web
      return role === 'Developer';

    // ── Manajemen Konten & Data (Super Admin & Developer) ──────────────
    // Super Admin bertugas membantu edit konten, data kapal, dokumen, dan personel
    case 'add_certificate':
    case 'add_ship_document':
    case 'edit_certificate':
    case 'edit_ship_document':
    case 'edit_master_data':
    case 'manage_users':           // Tambah & edit data profil pengguna (tanpa hak hapus/reset)
      return role === 'Super Admin' || role === 'Developer';

    // ── Keuangan & Anggaran ────────────────────────────────────────────
    case 'edit_budget':
    case 'edit_vessel_budget':
    case 'approve_po':
      return role === 'Fleet Manager' || role === 'Finance' || role === 'Developer';

    case 'record_actual_expense':
      return role === 'Finance' || role === 'Developer';

    // ── SDM / Kru ──────────────────────────────────────────────────────
    case 'approve_leave':
      return role === 'Fleet Manager' || role === 'Admin Kapal / Nakhoda' || role === 'HR / Personalia' || role === 'Developer';

    case 'submit_leave':
      return true; // Semua kru boleh mengajukan cuti

    // ── Notifikasi & Gateway ───────────────────────────────────────────
    case 'manage_bot_gateway':
      return role === 'Fleet Manager' || role === 'Developer';

    // ── Audit ISM/SMC ──────────────────────────────────────────────────
    case 'create_audit_session':
    case 'delete_audit_session':
    case 'create_audit_finding':
    case 'delete_audit_finding':
    case 'evaluate_audit_checklist':
    case 'strike_audit_clause':
    case 'close_audit_nc':
    case 'reopen_audit_nc':
    case 'access_doc_audit':
      // Wewenang khusus DPA / Lead Auditor / Manajemen Darat & Developer
      return role === 'Fleet Manager' || role === 'Developer';

    case 'submit_audit_evidence':
      // Auditee (Nakhoda, KKM, DPA, Admin) berhak mengirimkan bukti perbaikan fisik/dokumen
      return role === 'Fleet Manager' || role === 'Admin Kapal / Nakhoda' || role === 'Teknisi / Chief Engineer' || role === 'Developer';

    // ── Work Order & Logistik ──────────────────────────────────────────
    case 'create_work_order':
      return role === 'Fleet Manager' || role === 'Admin Kapal / Nakhoda' || role === 'Teknisi / Chief Engineer' || role === 'Developer';

    case 'create_purchase_request':
      return role === 'Fleet Manager' || role === 'Admin Kapal / Nakhoda' || role === 'Teknisi / Chief Engineer' || role === 'Finance' || role === 'Developer';

    case 'create_crew_requisition':
      return role === 'Fleet Manager' || role === 'Admin Kapal / Nakhoda' || role === 'Crew / ABK' || role === 'Developer';

    case 'create_ship_requisition':
      return role === 'Fleet Manager' || role === 'Admin Kapal / Nakhoda' || role === 'Teknisi / Chief Engineer' || role === 'Developer';

    case 'approve_requisition_ship':
      return role === 'Fleet Manager' || role === 'Admin Kapal / Nakhoda' || role === 'Developer';

    case 'approve_requisition_shore':
    case 'transfer_warehouse_stock':
      return role === 'Fleet Manager' || role === 'Developer';

    case 'receive_onboard_goods':
      return role === 'Fleet Manager' || role === 'Admin Kapal / Nakhoda' || role === 'Teknisi / Chief Engineer' || role === 'Crew / ABK' || role === 'Developer';

    default:
      return false;
  }
};
