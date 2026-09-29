/**
 * getGoogleCalendarUrl.js
 * Diekstrak dari PMSContext.jsx (baris 2539-2608).
 * Sumber: Bangun tautan Google Calendar untuk satu item yang mendekati jatuh tempo
 *
 * Dependensi closure induk diangkat menjadi PARAMETER eksplisit:
 *   notificationSettings, vessels
 */
export const getGoogleCalendarUrl = (item, options = {}, notificationSettings, vessels) => {
    // options: { offsetDays: 0 | 1 | 7 | 30 | 365 | number, eventTime: '08:00' }
    const offsetDays = options.offsetDays !== undefined ? Number(options.offsetDays) : 30;
    const eventTime = options.eventTime || notificationSettings.autoSend?.scheduleTime || '08:00';
    const [evHH, evMM] = eventTime.split(':').map(Number);

    const vessel = vessels.find(v => v.id === item.vesselId);
    const vesselName = vessel?.name || 'Armada Kapal';
    const docNo = item.certificateNo || item.documentNo || '-';
    const holder = item.crewName ? `Kru: ${item.crewName}` : `Kapal: ${vesselName}`;

    let startIso = '';
    let endIso = '';

    if (item.expiryDate) {
      const [year, month, day] = item.expiryDate.split('-').map(Number);
      const targetDate = new Date(year, month - 1, day);

      if (offsetDays > 0) {
        targetDate.setDate(targetDate.getDate() - offsetDays);
      }

      const tYear = targetDate.getFullYear();
      const tMonth = String(targetDate.getMonth() + 1).padStart(2, '0');
      const tDay = String(targetDate.getDate()).padStart(2, '0');

      const startH = String(evHH || 8).padStart(2, '0');
      const startM = String(evMM || 0).padStart(2, '0');
      const endH = String(Math.min(23, (evHH || 8) + 1)).padStart(2, '0');
      const endM = startM;

      startIso = `${tYear}${tMonth}${tDay}T${startH}${startM}00`;
      endIso = `${tYear}${tMonth}${tDay}T${endH}${endM}00`;
    }

    let intervalLabel = 'H-30 (1 Bulan)';
    if (offsetDays === 1) intervalLabel = 'H-1 (1 Hari Terakhir)';
    else if (offsetDays === 7) intervalLabel = 'H-7 (1 Minggu)';
    else if (offsetDays === 30) intervalLabel = 'H-30 (1 Bulan)';
    else if (offsetDays === 365) intervalLabel = 'H-365 (1 Tahun Persiapan)';
    else if (offsetDays === 0) intervalLabel = 'JATUH TEMPO HARI-H';
    else if (offsetDays > 0) intervalLabel = `H-${offsetDays} Hari`;

    const title = `[PMS ${intervalLabel}] ${item.name} (${vesselName})`;
    const details = `PENGINGAT RESMI SISTEM PMS PT. PELAYARAN BAHARIMAS KALIMANTAN:\n` +
      `----------------------------------------\n` +
      `Kategori Peringatan: ${intervalLabel}\n` +
      `Waktu Pengingat: Jam ${eventTime} WIB\n` +
      `Nama Dokumen/Sertifikat: ${item.name}\n` +
      `Nomor Dokumen: ${docNo}\n` +
      `Subjek/Pemilik: ${holder}\n` +
      `Kapal: ${vesselName}\n` +
      `Instansi Penerbit: ${item.issuer || '-'}\n` +
      `Tanggal Jatuh Tempo: ${item.expiryDate} (${item.daysUntilExpiry} hari lagi)\n` +
      `Status Kelaikan: ${item.status}\n\n` +
      `INSTRUKSI TINDAK LANJUT:\n` +
      (offsetDays === 1
        ? `🚨 DARURAT: Hari ini/besok masa berlaku habis! Segera hubungi Syahbandar/BKI untuk dispensasi atau survey mendesak.`
        : offsetDays === 7
        ? `⚠️ KRITIS: Tersisa 7 hari. Pastikan surveyor telah ditunjuk dan dokumen persiapan kapal siap di pelabuhan.`
        : offsetDays === 30
        ? `🔔 FORMAL: Masuk jendela survei perpanjangan 30 hari. Hubungi Bagian Legal Armada & BKI Surveyor.`
        : offsetDays === 365
        ? `📋 TAHUNAN: Rencanakan anggaran docking & survey pembaharuan (Renewal Survey) tahun depan.`
        : `Segera tindak lanjuti sebelum batas toleransi survey habis.`);

    const location = `${vesselName}, Pelabuhan Pendaftaran ${vessel?.portOfRegistry || 'Pontianak, Kalimantan Barat'}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startIso}/${endIso}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  };
