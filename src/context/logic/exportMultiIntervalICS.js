/**
 * exportMultiIntervalICS.js
 * Diekstrak dari PMSContext.jsx (baris 2640-2715).
 * Sumber: Ekspor berkas ICS berisi beberapa pengingat interval sekaligus untuk kalender
 *
 * Dependensi closure induk diangkat menjadi PARAMETER eksplisit:
 *   notificationSettings, vessels, crewCertificates, shipDocuments, showToast
 */
export const exportMultiIntervalICS = (filterOffset = null, notificationSettings, vessels, crewCertificates, shipDocuments, showToast) => {
    const activeThresholds = [
      ...(notificationSettings.thresholds || []).filter(t => t.enabled),
      ...(notificationSettings.customThresholds || []).filter(t => t.enabled)
    ];

    const allItems = [
      ...crewCertificates.map(c => ({ ...c, itemCategory: 'crew_cert' })),
      ...shipDocuments.map(d => ({ ...d, itemCategory: 'ship_doc' }))
    ];

    let targetItems = allItems;
    if (filterOffset !== null) {
      targetItems = allItems.filter(i => i.daysUntilExpiry !== undefined && i.daysUntilExpiry <= filterOffset && i.daysUntilExpiry >= -30);
    } else {
      const maxDays = Math.max(...activeThresholds.map(t => t.days), 365);
      targetItems = allItems.filter(i => i.daysUntilExpiry !== undefined && i.daysUntilExpiry <= maxDays && i.daysUntilExpiry >= -30);
    }

    if (targetItems.length === 0) {
      showToast('Tidak ada dokumen yang cocok dengan ambang batas yang dipilih.', 'info');
      return;
    }

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//PT. Pelayaran Baharimas Kalimantan//PMS Statutory Multi-Alarm Calendar//ID',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:PT. Pelayaran Baharimas Kalimantan - Dokumen & Sertifikat Kapal',
      'X-WR-TIMEZONE:Asia/Jakarta'
    ];

    targetItems.forEach((item, idx) => {
      const vessel = vessels.find(v => v.id === item.vesselId);
      const vesselName = vessel?.name || 'Kapal';
      const cleanDate = item.expiryDate ? item.expiryDate.replace(/-/g, '') : '20260918';
      const eventTime = notificationSettings.autoSend?.scheduleTime?.replace(':', '') || '0800';

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:pms-cert-${item.id}-${idx}@baharimas.co.id`,
        `DTSTAMP:${cleanDate}T${eventTime}00Z`,
        `DTSTART;VALUE=DATE:${cleanDate}`,
        `SUMMARY:[PMS JATUH TEMPO] ${item.name} (${vesselName})`,
        `DESCRIPTION:Pengingat jatuh tempo dokumen ${item.name} (No: ${item.certificateNo || item.documentNo}). Pemegang: ${item.crewName || vesselName}. Segera lakukan perpanjangan kelaiklautan kapal.`,
        `LOCATION:${vesselName}, ${vessel?.portOfRegistry || 'Indonesia'}`
      );

      // Add VALARM for each active threshold
      activeThresholds.forEach(th => {
        icsContent.push(
          'BEGIN:VALARM',
          'ACTION:DISPLAY',
          `DESCRIPTION:Pengingat ${th.label} - Dokumen ${item.name}`,
          `TRIGGER:-P${th.days}D`,
          'END:VALARM'
        );
      });

      icsContent.push('END:VEVENT');
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `PMS_MultiAlarm_Calendar_${new Date().toISOString().split('T')[0]}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`File .ics multi-alarm berhasil diunduh (${targetItems.length} dokumen dengan alarm 1 hari, 1 minggu, 1 bulan, 1 tahun)!`, 'success');
  };
