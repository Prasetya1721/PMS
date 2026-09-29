/**
 * sendEmailReminder.js
 * Diekstrak dari PMSContext.jsx (baris 2458-2531).
 * Sumber: Kirim pengingat jatuh tempo lewat email dan catat hasilnya ke log notifikasi
 *
 * Dependensi closure induk diangkat menjadi PARAMETER eksplisit:
 *   notificationSettings, vessels, resolveEmailRecipients, setNotificationLogs, showToast
 */
import { DEFAULT_EMAIL_GATEWAY } from '../../services/emailService';
import { buildEmailHtml } from '../../services/emailService';
import { buildEmailPayload } from '../../services/emailService';
import { buildMailtoUrl } from '../../services/emailService';
import { makeId } from '../../utils/idUtils';
import { sendEmailViaBackend } from '../../services/emailService';
import { stripWhatsappMarkdown } from '../../services/emailService';
export const sendEmailReminder = async (item, type = 'crew_cert', options = {}, notificationSettings, vessels, resolveEmailRecipients, setNotificationLogs, showToast) => {
    const offsetDays = options.offsetDays !== undefined ? Number(options.offsetDays) : (item.daysUntilExpiry ?? 30);
    const v = vessels.find(ship => ship.id === item.vesselId);
    const vesselName = v?.name || item.targetName || 'Fleet';
    const gateway = { ...DEFAULT_EMAIL_GATEWAY, ...(notificationSettings.autoSend?.emailGateway || {}) };
    const toList = resolveEmailRecipients(item, type, options);
    if (!toList.length) {
      if (!options.silent) showToast('Alamat email penerima tidak ditemukan. Isi Email Gateway / data user dulu.', 'warning');
      return null;
    }
    let urgencyBadge = `H-${offsetDays} Hari`;
    if (offsetDays === 1) urgencyBadge = 'H-1 Hari';
    else if (offsetDays === 7) urgencyBadge = 'H-1 Minggu';
    else if (offsetDays === 30) urgencyBadge = 'H-1 Bulan';
    else if (offsetDays === 365) urgencyBadge = 'H-1 Tahun';

    const docNo = item.certificateNo || item.documentNo || item.findingNo || '-';
    let subject = options.customSubject;
    let textBody = options.customMessage ? stripWhatsappMarkdown(options.customMessage) : '';
    if (!subject) {
      if (type === 'audit_nc_open') subject = `[NC OPEN] ${item.findingNo} — ${item.targetName || vesselName}`;
      else if (type === 'audit_nc_close') subject = `[NC CLOSE] ${item.findingNo} — ${item.targetName || vesselName}`;
      else if (type === 'work_order') subject = `[WO OVERDUE] ${item.title} — ${vesselName}`;
      else subject = `[PMS ${urgencyBadge}] ${item.name} — ${vesselName} (Jatuh tempo ${item.expiryDate})`;
    }
    if (!textBody) {
      if (type === 'audit_nc_open' || type === 'audit_nc_close') {
        textBody = `Kepada Yth. Penerima,\n\nTemuan audit ${item.findingNo} (${item.category || ''}) pada ${item.targetName || vesselName} — status ${type === 'audit_nc_open' ? 'NC OPEN' : 'NC CLOSE'}.\nKlausul: ${item.clauseCode || ''} - ${item.clauseName || ''}\nDeskripsi: ${item.description || ''}\nTarget close: ${item.dueDate || '-'}\n\nMohon tindak lanjut via Portal PMS Baharimas.\n\n_Sistem PMS PT. Pelayaran Baharimas Kalimantan_`;
      } else if (type === 'work_order') {
        textBody = `Kepada Teknisi,\n\nWork Order ${item.title} (ID: ${item.id}) status OVERDUE.\nTarget: ${item.targetHours} jam (saat ini ${item.currentRunningHours} jam).\nKapal: ${vesselName}\n\nHarap segera menindaklanjuti servicing.\n\n_Sistem PMS Baharimas_`;
      } else {
        textBody = `Kepada Yth. Penerima,\n\nDokumen/Sertifikat: ${item.name} (No: ${docNo})\nKapal/Pemilik: ${item.crewName ? `Kru ${item.crewName}` : vesselName}\nJatuh tempo: ${item.expiryDate} (${item.daysUntilExpiry ?? offsetDays} hari lagi) — ${urgencyBadge}\nPenerbit: ${item.issuer || '-'}\n\nMohon segera proses perpanjangan ke BKI/Syahbandar/personalia sebelum batas toleransi habis.\n\n_Pusat Pengendali Armada PMS PT. Pelayaran Baharimas Kalimantan_`;
      }
    }
    const html = buildEmailHtml({
      preheader: subject,
      title: subject,
      badge: urgencyBadge,
      rows: [
        { label: 'Kapal / Entitas', value: vesselName },
        { label: 'Dokumen / Temuan', value: `${item.name || item.title || item.findingNo || '-'}` },
        { label: 'Nomor', value: docNo },
        { label: 'Jatuh Tempo', value: `${item.expiryDate || item.dueDate || '-'}` },
      ],
      bodyText: textBody,
    });
    const payload = buildEmailPayload({ to: toList, cc: options.cc, bcc: options.bcc, subject, text: textBody, html, meta: { type, vesselName, offsetDays } });
    // Coba backend dulu (otomatis, tanpa buka tab). Kalau backend belum ada -> status Queued.
    const backendRes = await sendEmailViaBackend(payload, gateway);
    const channelLabel = backendRes.ok ? `Email Auto (${gateway.provider})` : 'Email Auto';
    const newLog = {
      id: makeId('notif-email'),
      timestamp: new Date().toLocaleString('id-ID'),
      channel: channelLabel,
      target: payload.to.join(', '),
      vesselName: item.targetName || vesselName,
      subject,
      message: textBody,
      status: backendRes.status,
      thresholdTriggered: urgencyBadge,
    };
    setNotificationLogs(prev => [newLog, ...prev]);
    if (!options.silent) {
      if (backendRes.ok) {
        showToast(`Email otomatis terkirim ke ${payload.to.join(', ')} (${urgencyBadge})`, 'success');
      } else {
        // Fallback frontend-only: buka aplikasi email agar user bisa kirim sekarang,
        // log tetap tercatat sebagai Queued agar tidak hilang saat backend hadir.
        if (!options.skipMailto) window.open(buildMailtoUrl(payload.to, subject, textBody), '_self');
        showToast(`Backend email belum aktif — draf email dibuka & dicatat sebagai antrean (${payload.to.join(', ')})`, 'info');
      }
    }
    return { ...newLog, backend: backendRes, payload };
  };
