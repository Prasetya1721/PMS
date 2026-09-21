// Role-Based Access Control (RBAC) Configuration for PT. Pelayaran Baharimas Kalimantan

export const ROLE_DEFINITIONS = {
  'Super Admin': {
    label: 'Super Admin',
    shortLabel: 'Super Admin',
    description: 'Akses penuh seluruh modul, data master, administrasi pengguna, dan sistem',
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

// Matriks Hak Akses Modul per Peran (12 Modul)
// 'dashboard' | 'fleet' | 'audit' | 'documents' | 'equipment' | 'maintenance' | 'spareparts' | 'costs' | 'crew' | 'notifications' | 'reports' | 'master'
export const ROLE_PERMISSIONS = {
  'Super Admin': [
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
  if (role === 'Super Admin') return true;
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.includes(moduleId);
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
  if (role === 'Super Admin') return true;
  // If overrides exist for this role, use them instead of default
  if (sidebarOverrides && sidebarOverrides[role] && Array.isArray(sidebarOverrides[role])) {
    return sidebarOverrides[role].includes(moduleId);
  }
  // Fallback to default RBAC
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.includes(moduleId);
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
  if (role === 'Super Admin') return true;

  switch (action) {
    case 'manage_users':
    case 'edit_master_data':
      return role === 'Super Admin';

    case 'edit_budget':
    case 'edit_vessel_budget':
    case 'approve_po':
      return role === 'Super Admin' || role === 'Fleet Manager' || role === 'Finance';

    case 'record_actual_expense':
      return role === 'Super Admin' || role === 'Finance';

    case 'approve_leave':
      return role === 'Super Admin' || role === 'Fleet Manager' || role === 'Admin Kapal / Nakhoda' || role === 'HR / Personalia';

    case 'submit_leave':
      return true; // Semua kru boleh mengajukan cuti

    case 'manage_bot_gateway':
      return role === 'Super Admin' || role === 'Fleet Manager';

    case 'create_audit_finding':
    case 'close_audit_nc':
      return role === 'Super Admin' || role === 'Fleet Manager' || role === 'Admin Kapal / Nakhoda';

    case 'submit_audit_evidence':
      return role === 'Super Admin' || role === 'Fleet Manager' || role === 'Admin Kapal / Nakhoda' || role === 'Teknisi / Chief Engineer';

    case 'create_work_order':
      return role === 'Super Admin' || role === 'Fleet Manager' || role === 'Admin Kapal / Nakhoda' || role === 'Teknisi / Chief Engineer';

    case 'create_purchase_request':
      return role === 'Super Admin' || role === 'Fleet Manager' || role === 'Admin Kapal / Nakhoda' || role === 'Teknisi / Chief Engineer' || role === 'Finance';

    case 'create_crew_requisition':
      return role === 'Super Admin' || role === 'Fleet Manager' || role === 'Admin Kapal / Nakhoda' || role === 'Crew / ABK';

    case 'create_ship_requisition':
      return role === 'Super Admin' || role === 'Fleet Manager' || role === 'Admin Kapal / Nakhoda' || role === 'Teknisi / Chief Engineer';

    case 'approve_requisition_ship':
      return role === 'Super Admin' || role === 'Fleet Manager' || role === 'Admin Kapal / Nakhoda';

    case 'approve_requisition_shore':
    case 'transfer_warehouse_stock':
      return role === 'Super Admin' || role === 'Fleet Manager';

    case 'receive_onboard_goods':
      return role === 'Super Admin' || role === 'Fleet Manager' || role === 'Admin Kapal / Nakhoda' || role === 'Teknisi / Chief Engineer' || role === 'Crew / ABK';

    default:
      return false;
  }
};
