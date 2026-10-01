/**
 * sendWhatsAppReminder.js
 * Diekstrak dari PMSContext.jsx.
 * Sumber: Kirim pengingat jatuh tempo lewat WhatsApp (gateway API atau tautan wa.me) dan catat log
 *
 * Dependensi closure induk diangkat menjadi PARAMETER eksplisit:
 *   notificationSettings, vessels, crew, setNotificationLogs, showToast
 */
import { calculateNCRange } from '../../utils/auditTimeUtils';
import { makeId } from '../../utils/idUtils';
import { normalizePhoneNumber, sendWhatsAppViaGateway } from '../../services/whatsappService';

export const sendWhatsAppReminder = async (item, type = 'crew_cert', options = {}, notificationSettings, vessels, crew, setNotificationLogs, showToast) => {
    let phone = '6281200000000';
    let recipientName = 'Crew / Admin';
    const offsetDays = options.offsetDays !== undefined ? Number(options.offsetDays) : (item.daysUntilExpiry || 30);

    const v = vessels?.find(ship => ship.id === item.vesselId);
    const vesselName = v?.name || 'Fleet';
    const gateway = notificationSettings?.autoSend?.whatsappGateway;
    const defaultFallbackPhone = options.phone || options.recipientPhone || gateway?.senderPhone || '6281288991122';

    if (type === 'crew_cert') {
      const targetCrew = crew?.find(c => c.id === item.crewId);
      phone = options.phone || options.recipientPhone || targetCrew?.whatsapp || defaultFallbackPhone;
      recipientName = options.recipientName || targetCrew?.name || item.crewName || 'Pelaut Baharimas';
    } else if (type === 'ship_doc') {
      recipientName = options.recipientName || `Admin Kapal & Nakhoda ${vesselName}`;
      phone = options.phone || options.recipientPhone || defaultFallbackPhone;
    } else if (type === 'work_order') {
      recipientName = options.recipientName || item.assignedTo || 'Teknisi / Chief Engineer';
      phone = options.phone || options.recipientPhone || defaultFallbackPhone;
    } else if (type === 'audit_nc_open') {
      recipientName = options.recipientName || item.assignedTo || `Nakhoda & KKM ${item.targetName || vesselName}`;
      phone = options.phone || options.recipientPhone || defaultFallbackPhone;
    } else if (type === 'audit_nc_close') {
      recipientName = options.recipientName || 'DPA & Marine Superintendent PBK';
      phone = options.phone || options.recipientPhone || defaultFallbackPhone;
    }

    let headerPrefix = '*🔔 PEMBERITAHUAN JATUH TEMPO DOKUMEN*';
    let urgencyBadge = 'Rentang 30 Hari';
    if (offsetDays === 1) {
      headerPrefix = '*🚨 PERINGATAN DARURAT H-1 (HARI TERAKHIR)*';
      urgencyBadge = 'H-1 Hari';
    } else if (offsetDays === 7) {
      headerPrefix = '*⚠️ PERINGATAN KRITIS H-1 MINGGU (H-7)*';
      urgencyBadge = 'H-1 Minggu';
    } else if (offsetDays === 30) {
      headerPrefix = '*🔔 PEMBERITAHUAN JATUH TEMPO H-1 BULAN (H-30)*';
      urgencyBadge = 'H-1 Bulan';
    } else if (offsetDays === 365) {
      headerPrefix = '*📋 PERSIAPAN ANGGARAN DINI H-1 TAHUN (H-365)*';
      urgencyBadge = 'H-1 Tahun';
    } else if (offsetDays > 0) {
      headerPrefix = `*📌 PENGINGAT JATUH TEMPO H-${offsetDays} HARI*`;
      urgencyBadge = `H-${offsetDays} Hari`;
    }

    let msg = options.customMessage;
    if (!msg) {
      if (type === 'audit_nc_open') {
        const range = calculateNCRange(item);
        const lateInfo = range?.isOverdue
          ? `🚨 STATUS: MELEWATI BATAS WAKTU (${Math.abs(range.remainingDays)} Hari Overdue)!`
          : `⏳ STATUS: NC TERBUKA (Berjalan ${range?.activeDays} hari, sisa ${range?.remainingDays} hari)`;

        msg = `*🚨 NOTIFIKASI TEMUAN AUDIT ISM CODE (NC OPEN)*\n` +
          `_PT. Pelayaran Baharimas Kalimantan - Sistem PMS & SMS_\n\n` +
          `Kepada Yth: *${recipientName}*\n` +
          `Kapal / Entitas: *${item.targetName || vesselName}*\n` +
          `No. Temuan: *${item.findingNo}* [${item.category}]\n` +
          `Klausul ISM: *${item.clauseCode} - ${item.clauseName}*\n` +
          `Standar Audit: *${item.standard} (ISM Code)*\n\n` +
          `*Deskripsi Ketidaksesuaian:*\n"${item.description}"\n\n` +
          `*📅 RENTANG WAKTU TINDAKAN KOREKTIF (CAP):*\n` +
          `• Tanggal Audit Terbuka: *${range?.openDateStr || item.dateIdentified}*\n` +
          `• Target Batas Close: *${range?.dueDateStr || item.dueDate}*\n` +
          `• ${lateInfo}\n\n` +
          `*INSTRUKSI AUDITEE KAPAL:*\n` +
          `Harap segera mengajukan rencana tindakan korektif (CAP) dan mengunggah dokumen/foto eviden perbaikan di Portal PMS Baharimas sebelum batas waktu berakhir.\n\n` +
          `_Pusat Pengendali Kepatuhan Armada PT. Pelayaran Baharimas Kalimantan_`;
        urgencyBadge = range?.isOverdue ? 'NC Overdue' : 'NC Open';
      } else if (type === 'audit_nc_close') {
        const range = calculateNCRange(item);
        msg = `*✅ NOTIFIKASI PENUTUPAN TEMUAN AUDIT (NC CLOSE)*\n` +
          `_PT. Pelayaran Baharimas Kalimantan - Sistem PMS & SMS_\n\n` +
          `Kepada Yth: *${recipientName}*\n` +
          `Kapal / Entitas: *${item.targetName || vesselName}*\n` +
          `No. Temuan: *${item.findingNo}* [${item.category}]\n` +
          `Klausul ISM: *${item.clauseCode} - ${item.clauseName}*\n` +
          `Standar Audit: *${item.standard} (ISM Code)*\n\n` +
          `*HASIL VERIFIKASI & CLOSING:*\n` +
          `Tindakan koreksi dan dokumen eviden perbaikan telah diverifikasi efektif oleh Lead Auditor DPA / Surveyor BKI. Status temuan resmi dinyatakan *NC CLOSE (TUNTAS)*.\n\n` +
          `*⏱️ LAPORAN EFISIENSI RENTANG WAKTU (LEAD TIME):*\n` +
          `• Tanggal Dibuka: *${range?.openDateStr || item.dateIdentified}*\n` +
          `• Target Awal: *${range?.dueDateStr || item.dueDate}*\n` +
          `• Tanggal Ditutup Resmi: *${range?.closedDateStr || 'Selesai'}*\n` +
          `• Durasi Penyelesaian: *${range?.resolutionDays || 1} Hari* (${range?.varianceText || 'Sesuai Target'})\n\n` +
          `Status Kepatuhan: *100% COMPLIANT (IMO ISM CODE & BKI)*\n\n` +
          `_Pusat Pengendali Kepatuhan Armada PT. Pelayaran Baharimas Kalimantan_`;
        urgencyBadge = 'NC Close Tuntas';
      } else if (type === 'crew_cert') {
        msg = `${headerPrefix} - SISTEM PMS PT. PELAYARAN BAHARIMAS KALIMANTAN\n\n` +
          `Yth. *${recipientName}*,\n` +
          `Sertifikat Anda: *${item.name}* (No: ${item.certificateNo})\n` +
          `Tanggal Jatuh Tempo: *${item.expiryDate}* (${item.daysUntilExpiry} hari lagi).\n\n` +
          (offsetDays <= 1
            ? `PENTING: Besok adalah hari terakhir masa berlaku! Harap segera lapor Nakhoda untuk pengurusan darurat kelaiklautan.\n\n`
            : offsetDays <= 7
            ? `PENTING: Tersisa 1 minggu sebelum sertifikat habis masa berlaku. Mohon koordinasikan dengan personalia kapal.\n\n`
            : offsetDays <= 30
            ? `Harap segera memproses perpanjangan sertifikasi ke Bagian Personalia agar kelaiklautan kapal tetap terjaga.\n\n`
            : offsetDays <= 365
            ? `Pemberitahuan awal 1 tahun untuk persiapan pembaharuan sertifikat kepelautan STCW.\n\n`
            : `Harap koordinasikan pembaruan dokumen ini tepat waktu.\n\n`) +
          `_Sistem PMS PT. Pelayaran Baharimas Kalimantan_`;
      } else if (type === 'ship_doc') {
        msg = `${headerPrefix} - SISTEM PMS BAHARIMAS\n\n` +
          `Kepada: *${recipientName}*\n` +
          `Dokumen: *${item.name}* (No: ${item.documentNo})\n` +
          `Kapal: *${vesselName}*\n` +
          `Tanggal Jatuh Tempo: *${item.expiryDate}* (${item.daysUntilExpiry} hari lagi).\n\n` +
          (offsetDays <= 1
            ? `TINDAKAN MENDESAK: Sertifikat akan kadaluarsa besok! Pastikan dispensasi atau survey BKI/Syahbandar telah terkonfirmasi.\n\n`
            : offsetDays <= 7
            ? `PERHATIAN KRITIS: Tersisa 7 hari. Konfirmasi jadwal kedatangan surveyor BKI/Syahbandar ke atas kapal.\n\n`
            : offsetDays <= 30
            ? `Segera daftarkan permohonan survey ke Kantor BKI / Syahbandar terdekat.\n\n`
            : offsetDays <= 365
            ? `Perencanaan anggaran survey besar & pembaharuan sertifikat kelas untuk tahun anggaran mendatang.\n\n`
            : `Segera tindak lanjuti sebelum batas toleransi habis.\n\n`) +
          `_Pusat Pengendali Armada PMS PT. Pelayaran Baharimas Kalimantan_`;
      } else {
        msg = `*PERINGATAN WORK ORDER OVERDUE*\n\nKepada: *${recipientName}*\nWork Order: *${item.title}* (ID: ${item.id})\nStatus: OVERDUE\nTarget: ${item.targetHours} Jam (Saat ini: ${item.currentRunningHours} Jam).\n\nHarap segera menindaklanjuti servicing.`;
      }
    }

    const cleanPhone = normalizePhoneNumber(phone);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;

    let deliveryStatus = 'Delivered';
    let channelLabel = 'WhatsApp Direct';

    // Direct API Gateway dispatch if API key provided and requested
    if (options.useGatewayApi) {
      if (gateway?.apiKey) {
        const gwResult = await sendWhatsAppViaGateway({
          apiUrl: gateway.apiUrl,
          apiKey: gateway.apiKey,
          secretKey: gateway.secretKey,
          phone: cleanPhone,
          message: msg,
          provider: gateway.provider || 'Wablas API'
        });

        if (gwResult.success) {
          deliveryStatus = `Delivered (${gateway.provider || 'Wablas API'})`;
          channelLabel = `WhatsApp API (${gateway.provider || 'Wablas API'})`;
          if (!options.silent) {
            showToast(`✅ Pesan WhatsApp berhasil dikirim ke +${cleanPhone} via ${gateway.provider || 'Wablas API'}!`, 'success');
          }
        } else {
          deliveryStatus = `Failed (${gwResult.error || gwResult.message})`;
          channelLabel = `WhatsApp API (Gagal)`;
          if (!options.silent) {
            showToast(`⚠️ Gateway WhatsApp: ${gwResult.message}`, 'error');
            if (typeof window !== 'undefined' && window.confirm(`Pengiriman otomatis via Gateway Wablas gagal:\n"${gwResult.message}"\n\nBuka WhatsApp Web / App secara manual ke nomor ${cleanPhone}?`)) {
              window.open(waUrl, '_blank');
            }
          }
        }
      } else {
        deliveryStatus = 'Failed: API Key Wablas belum dikonfigurasi';
        channelLabel = 'WhatsApp API (Belum Dikonfigurasi)';
        if (!options.silent) {
          showToast('⚠️ API Key Wablas belum dikonfigurasi. Silakan buka menu Developer & API Keys.', 'warning');
        }
      }
    } else {
      if (!options.silent) {
        window.open(waUrl, '_blank');
        showToast(`Pesan WhatsApp telah disiapkan & dibuka ke ${recipientName} (${urgencyBadge})`, 'success');
      }
    }

    // Log to notification audit
    const newLog = {
      id: makeId('notif'),
      timestamp: new Date().toLocaleString('id-ID'),
      channel: channelLabel,
      target: `${recipientName} (+${cleanPhone})`,
      vesselName: item.targetName || vesselName,
      subject: type === 'audit_nc_open'
        ? `Notifikasi NC Open: ${item.findingNo} (${item.targetName || vesselName})`
        : type === 'audit_nc_close'
        ? `Notifikasi NC Close: ${item.findingNo} (${item.targetName || vesselName})`
        : `Reminder ${urgencyBadge}: ${item.name || item.title}`,
      message: msg,
      status: deliveryStatus,
      thresholdTriggered: urgencyBadge
    };

    setNotificationLogs(prev => [newLog, ...prev]);
    return newLog;
  };
