/**
 * pmsStorage.js
 * Utilitas localStorage untuk PMS — versioning, purge, dan load/save state.
 */
import { createDefaultShipParticulars } from '../data/shipParticularsData';

export const PMS_STORAGE_VERSION = 'v15-clean-audit-bki';

/**
 * Nama kunci localStorage per field state - SATU sumber kebenaran.
 *
 * Dibaca dan ditulis lewat peta ini supaya nama kunci tidak bisa lagi menyimpang
 * antara loadStored() dan persistAllState(). Sebelumnya keduanya menuliskan
 * literal sendiri-sendiri, dan satu kunci menyimpang tanpa terdeteksi:
 * persistAllState menulis `pms_vessel_budgets` sementara loadStored membaca
 * `pms_vesselBudgets`, sehingga data anggaran kapal kembali ke nilai bawaan
 * setiap kali halaman dimuat ulang.
 */
export const STORAGE_KEYS = {
  vessels: 'pms_vessels',
  equipment: 'pms_equipment',
  schedules: 'pms_schedules',
  workOrders: 'pms_workOrders',
  technicalWorkOrders: 'pms_technicalWorkOrders',
  dailyMachineryLogs: 'pms_dailyMachineryLogs',
  criticalEquipmentTests: 'pms_criticalEquipmentTests',
  safeManningStandards: 'pms_safeManningStandards',
  spareparts: 'pms_spareparts',
  requisitions: 'pms_requisitions',
  costs: 'pms_costs',
  vesselBudgets: 'pms_vesselBudgets',
  crew: 'pms_crew',
  leaves: 'pms_leaves',
  drills: 'pms_drills',
  crewCertificates: 'pms_crewCertificates',
  shipDocuments: 'pms_shipDocuments',
  certificateCategories: 'pms_certificateCategories',
  documentTemplates: 'pms_documentTemplates',
  notificationSettings: 'pms_notificationSettings',
  notificationLogs: 'pms_notificationLogs',
  users: 'pms_users',
  audits: 'pms_audits',
  auditFindings: 'pms_auditFindings',
  siteConfig: 'pms_siteConfig',
  sidebarOverrides: 'pms_sidebarOverrides',
  masterSurveyTypes: 'pms_masterSurveyTypes',
  vesselTypes: 'pms_vesselTypes',
  portLocations: 'pms_portLocations',
  apiKeysConfig: 'pms_api_keys',
};

/**
 * Field yang ditulis persistAllState. Sengaja lebih sedikit daripada STORAGE_KEYS:
 * `masterSurveyTypes`, `vesselTypes`, dan `portLocations` punya jalur simpan
 * sendiri di PMSContext, dan menuliskannya dari sini akan menimpanya dengan
 * nilai kosong.
 */
export const PERSISTED_FIELDS = [
  'vessels', 'equipment', 'schedules', 'workOrders', 'technicalWorkOrders',
  'dailyMachineryLogs', 'criticalEquipmentTests', 'safeManningStandards',
  'spareparts', 'requisitions', 'costs', 'vesselBudgets', 'crew', 'leaves',
  'drills', 'crewCertificates', 'shipDocuments', 'certificateCategories',
  'documentTemplates', 'notificationSettings', 'notificationLogs', 'users',
  'audits', 'auditFindings', 'siteConfig', 'sidebarOverrides', 'apiKeysConfig',
];

/** Kunci localStorage untuk sebuah field state. */
export function storageKeyFor(field) {
  return STORAGE_KEYS[field] || `pms_${field}`;
}

/**
 * Purge localStorage jika versi berubah, dengan menjaga data user aktif.
 * Dipanggil sekali saat modul di-load (side effect yang disengaja).
 */
export function initStorageVersion() {
  if (typeof window === 'undefined') return;
  try {
    const currentVersion = localStorage.getItem('pms_fleet_version');
    if (currentVersion !== PMS_STORAGE_VERSION) {
      const preservedUser = localStorage.getItem('pms_current_user');
      localStorage.clear();
      if (preservedUser) localStorage.setItem('pms_current_user', preservedUser);
      localStorage.setItem('pms_fleet_version', PMS_STORAGE_VERSION);
    }

    // Bersihkan data master template agar kosong default
    // Migrasi kunci lama. `pms_vessel_budgets` pernah ditulis oleh persistAllState
    // dan dua jalur seed, tetapi selalu dibaca sebagai `pms_vesselBudgets` - jadi
    // data anggaran kapal hilang setiap reload. Salin sekali ke kunci yang benar,
    // lalu buang yang lama supaya tidak ada dua salinan yang bisa menyimpang.
    const legacyBudgets = localStorage.getItem('pms_vessel_budgets');
    if (legacyBudgets !== null) {
      if (localStorage.getItem('pms_vesselBudgets') === null) {
        localStorage.setItem('pms_vesselBudgets', legacyBudgets);
      }
      localStorage.removeItem('pms_vessel_budgets');
    }

    const isMasterCleaned = localStorage.getItem('pms_master_templates_cleaned_v3');
    if (!isMasterCleaned) {
      localStorage.setItem('pms_documentTemplates', JSON.stringify([]));
      localStorage.setItem('pms_master_templates_cleaned_v3', 'true');
    }
  } catch (err) {
    console.error('[PMS] Storage purge check error:', err);
  }
}

/**
 * Load satu key dari localStorage dengan fallback ke data awal.
 * Menangani sanitasi data regional dan normalisasi per-key.
 */
export function loadStored(key, fallback, INITIAL_NOTIFICATION_SETTINGS) {
  try {
    const version = localStorage.getItem('pms_fleet_version');
    if (version !== PMS_STORAGE_VERSION) return fallback;

    const saved = localStorage.getItem(storageKeyFor(key));
    if (!saved) return fallback;

    const sanitized = saved
      .replace(/Samarinda/gi, 'Pontianak')
      .replace(/Balikpapan/gi, 'Ketapang')
      .replace(/Muara Berau/gi, 'Muara Jungkat')
      .replace(/Kalimantan Timur/gi, 'Kalimantan Barat')
      .replace(/Sungai Mahakam/gi, 'Sungai Kapuas');

    const parsed = JSON.parse(sanitized);

    if (key === 'vessels') {
      if (!Array.isArray(parsed)) return fallback;
      return parsed.map(v => {
        let photo = v.photo;
        if (!photo || photo.includes('photo-1544620347-c4fd4a3d5957')) {
          photo = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80';
        }
        return { ...v, photo, particulars: v.particulars || createDefaultShipParticulars(v) };
      });
    }

    if (key === 'notificationSettings' && INITIAL_NOTIFICATION_SETTINGS) {
      if (!parsed?.thresholds || !parsed?.autoSend || !parsed.thresholds.some(t => t.id === 'th-1d')) {
        return fallback;
      }
      const ensureEmailChannel = (list) =>
        (list || []).map(t => ({
          ...t,
          notifyChannels: Array.from(new Set([...(t.notifyChannels || []), 'Email'])),
        }));
      return {
        ...fallback,
        ...parsed,
        thresholds: ensureEmailChannel(parsed.thresholds || fallback.thresholds),
        customThresholds: ensureEmailChannel(parsed.customThresholds || fallback.customThresholds),
        autoSend: {
          ...fallback.autoSend,
          ...(parsed.autoSend || {}),
          channels: { ...(fallback.autoSend?.channels || {}), ...((parsed.autoSend || {}).channels || {}) },
          emailGateway: { ...(fallback.autoSend?.emailGateway || {}), ...((parsed.autoSend || {}).emailGateway || {}) },
        },
      };
    }

    return parsed;
  } catch {
    return fallback;
  }
}

/**
 * Simpan seluruh state PMS ke localStorage sekaligus.
 */
export function persistAllState(state) {
  try {
    localStorage.setItem('pms_fleet_version', PMS_STORAGE_VERSION);
    for (const field of PERSISTED_FIELDS) {
      const v = state[field];
      localStorage.setItem(
        storageKeyFor(field),
        JSON.stringify(v ?? (Array.isArray(v) ? [] : {}))
      );
    }
  } catch (err) {
    console.error('[PMS] Failed to sync state to localStorage:', err);
  }
}
