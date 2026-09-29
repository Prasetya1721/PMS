/**
 * resolveEmailRecipients.js
 * Diekstrak dari PMSContext.jsx (baris 2436-2455).
 * Sumber: Tentukan daftar penerima email pengingat berdasarkan tipe item dan pengaturan notifikasi
 *
 * Dependensi closure induk diangkat menjadi PARAMETER eksplisit:
 *   notificationSettings, users, crew
 */
import { DEFAULT_EMAIL_GATEWAY } from '../../services/emailService';
import { normalizeEmailList } from '../../services/emailService';
export const resolveEmailRecipients = (item, type = 'crew_cert', options = {}, notificationSettings, users, crew) => {
    const gateway = { ...DEFAULT_EMAIL_GATEWAY, ...(notificationSettings.autoSend?.emailGateway || {}) };
    const defaults = normalizeEmailList(gateway.defaultRecipients?.length ? gateway.defaultRecipients : ['fleet.ops@baharimas.co.id']);
    if (options.to) return normalizeEmailList(options.to);
    if (options.recipientEmail) return normalizeEmailList(options.recipientEmail);
    const userEmailByRole = (keyword) => {
      const u = (users || []).find(x => (x.role || '').toLowerCase().includes(keyword.toLowerCase()));
      return u?.email || null;
    };
    if (type === 'crew_cert') {
      const targetCrew = crew.find(c => c.id === item.crewId);
      const crewEmail = targetCrew?.email || null;
      return normalizeEmailList([crewEmail, userEmailByRole('HR'), userEmailByRole('Nakhoda'), ...defaults].filter(Boolean));
    }
    if (type === 'ship_doc') return normalizeEmailList([userEmailByRole('Nakhoda'), userEmailByRole('Fleet'), 'nakhoda@baharimas.co.id', ...defaults]);
    if (type === 'work_order') return normalizeEmailList([userEmailByRole('Teknisi'), userEmailByRole('Chief'), 'kkm@baharimas.co.id', ...defaults]);
    if (type === 'audit_nc_open') return normalizeEmailList([options.email || null, userEmailByRole('Nakhoda'), userEmailByRole('Fleet'), ...defaults].filter(Boolean));
    if (type === 'audit_nc_close') return normalizeEmailList([options.email || null, userEmailByRole('Super Admin'), 'admin@baharimas.co.id', ...defaults].filter(Boolean));
    return defaults;
  };
