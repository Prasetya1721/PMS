/**
 * pmsStorage.js
 * Utilitas localStorage untuk PMS — versioning, purge, dan load/save state.
 */
import { createDefaultShipParticulars } from '../data/shipParticularsData';

export const PMS_STORAGE_VERSION = 'v15-clean-audit-bki';

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

    const saved = localStorage.getItem(`pms_${key}`);
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
    const entries = [
      ['pms_vessels',                  state.vessels],
      ['pms_equipment',                state.equipment],
      ['pms_schedules',                state.schedules],
      ['pms_workOrders',               state.workOrders],
      ['pms_technicalWorkOrders',      state.technicalWorkOrders],
      ['pms_dailyMachineryLogs',       state.dailyMachineryLogs],
      ['pms_criticalEquipmentTests',   state.criticalEquipmentTests],
      ['pms_safeManningStandards',     state.safeManningStandards],
      ['pms_spareparts',               state.spareparts],
      ['pms_requisitions',             state.requisitions],
      ['pms_costs',                    state.costs],
      ['pms_vessel_budgets',           state.vesselBudgets],
      ['pms_crew',                     state.crew],
      ['pms_leaves',                   state.leaves],
      ['pms_drills',                   state.drills],
      ['pms_crewCertificates',         state.crewCertificates],
      ['pms_shipDocuments',            state.shipDocuments],
      ['pms_certificateCategories',    state.certificateCategories],
      ['pms_documentTemplates',        state.documentTemplates],
      ['pms_notificationSettings',     state.notificationSettings],
      ['pms_notificationLogs',         state.notificationLogs],
      ['pms_users',                    state.users],
      ['pms_audits',                   state.audits],
      ['pms_auditFindings',            state.auditFindings],
      ['pms_siteConfig',               state.siteConfig],
      ['pms_sidebarOverrides',         state.sidebarOverrides],
    ];
    for (const [k, v] of entries) {
      localStorage.setItem(k, JSON.stringify(v ?? (Array.isArray(v) ? [] : {})));
    }
  } catch (err) {
    console.error('[PMS] Failed to sync state to localStorage:', err);
  }
}
