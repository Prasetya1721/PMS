import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  INITIAL_VESSELS,
  INITIAL_EQUIPMENT,
  INITIAL_MAINTENANCE_SCHEDULES,
  INITIAL_WORK_ORDERS,
  INITIAL_SPAREPARTS,
  INITIAL_REQUISITIONS,
  INITIAL_COSTS,
  INITIAL_CREW,
  INITIAL_LEAVES,
  INITIAL_DRILLS,
  INITIAL_CREW_CERTIFICATES,
  INITIAL_SHIP_DOCUMENTS,
  INITIAL_NOTIFICATION_SETTINGS,
  INITIAL_NOTIFICATION_LOGS,
  INITIAL_USERS
} from '../data/initialData';

const PMSContext = createContext();

export const PMSProvider = ({ children }) => {
  // Load state from localStorage or fallback to initial data
  const loadStored = (key, fallback) => {
    try {
      const saved = localStorage.getItem(`pms_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const [vessels, setVessels] = useState(() => loadStored('vessels', INITIAL_VESSELS));
  const [equipment, setEquipment] = useState(() => loadStored('equipment', INITIAL_EQUIPMENT));
  const [schedules, setSchedules] = useState(() => loadStored('schedules', INITIAL_MAINTENANCE_SCHEDULES));
  const [workOrders, setWorkOrders] = useState(() => loadStored('workOrders', INITIAL_WORK_ORDERS));
  const [spareparts, setSpareparts] = useState(() => loadStored('spareparts', INITIAL_SPAREPARTS));
  const [requisitions, setRequisitions] = useState(() => loadStored('requisitions', INITIAL_REQUISITIONS));
  const [costs, setCosts] = useState(() => loadStored('costs', INITIAL_COSTS));
  const [crew, setCrew] = useState(() => loadStored('crew', INITIAL_CREW));
  const [leaves, setLeaves] = useState(() => loadStored('leaves', INITIAL_LEAVES));
  const [drills, setDrills] = useState(() => loadStored('drills', INITIAL_DRILLS));
  const [crewCertificates, setCrewCertificates] = useState(() => loadStored('crewCertificates', INITIAL_CREW_CERTIFICATES));
  const [shipDocuments, setShipDocuments] = useState(() => loadStored('shipDocuments', INITIAL_SHIP_DOCUMENTS));
  const [notificationSettings, setNotificationSettings] = useState(() => loadStored('notificationSettings', INITIAL_NOTIFICATION_SETTINGS));
  const [notificationLogs, setNotificationLogs] = useState(() => loadStored('notificationLogs', INITIAL_NOTIFICATION_LOGS));

  // Global App Controls
  const [selectedVesselId, setSelectedVesselId] = useState('all'); // 'all' or 'v-001' etc.
  const [currentRole, setCurrentRole] = useState('Super Admin');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('pms_vessels', JSON.stringify(vessels));
    localStorage.setItem('pms_equipment', JSON.stringify(equipment));
    localStorage.setItem('pms_schedules', JSON.stringify(schedules));
    localStorage.setItem('pms_workOrders', JSON.stringify(workOrders));
    localStorage.setItem('pms_spareparts', JSON.stringify(spareparts));
    localStorage.setItem('pms_requisitions', JSON.stringify(requisitions));
    localStorage.setItem('pms_costs', JSON.stringify(costs));
    localStorage.setItem('pms_crew', JSON.stringify(crew));
    localStorage.setItem('pms_leaves', JSON.stringify(leaves));
    localStorage.setItem('pms_drills', JSON.stringify(drills));
    localStorage.setItem('pms_crewCertificates', JSON.stringify(crewCertificates));
    localStorage.setItem('pms_shipDocuments', JSON.stringify(shipDocuments));
    localStorage.setItem('pms_notificationSettings', JSON.stringify(notificationSettings));
    localStorage.setItem('pms_notificationLogs', JSON.stringify(notificationLogs));
  }, [
    vessels, equipment, schedules, workOrders, spareparts, requisitions,
    costs, crew, leaves, drills, crewCertificates, shipDocuments,
    notificationSettings, notificationLogs
  ]);

  const showToast = (msg, type = 'info') => {
    setToastMessage({ message: msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Equipment Actions
  const updateRunningHours = (equipmentId, addedOrTotalHours, isAbsolute = false) => {
    setEquipment(prev => prev.map(eq => {
      if (eq.id !== equipmentId) return eq;
      const newHours = isAbsolute ? Number(addedOrTotalHours) : eq.runningHours + Number(addedOrTotalHours);
      const hoursToNext = eq.nextServiceHours - newHours;
      let newStatus = 'Normal';
      if (hoursToNext <= 0) {
        newStatus = 'Overdue';
      } else if (hoursToNext <= 200) {
        newStatus = 'Due Soon';
      }

      return {
        ...eq,
        runningHours: newHours,
        status: newStatus
      };
    }));
    showToast(`Running hours berhasil diperbarui untuk equipment!`, 'success');
  };

  // 2. Work Order Actions
  const toggleChecklist = (woId, checkId) => {
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id !== woId) return wo;
      const updatedChecklist = wo.checklist.map(item =>
        item.id === checkId ? { ...item, done: !item.done } : item
      );
      return { ...wo, checklist: updatedChecklist };
    }));
  };

  const updateWorkOrderStatus = (woId, newStatus) => {
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id !== woId) return wo;
      return { ...wo, status: newStatus };
    }));
    if (newStatus === 'Completed') {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      showToast(`Work Order ${woId} berhasil diselesaikan!`, 'success');
    } else {
      showToast(`Status Work Order diperbarui menjadi ${newStatus}`, 'info');
    }
  };

  const addWorkOrder = (newWO) => {
    const generated = {
      ...newWO,
      id: `WO-2026-${String(workOrders.length + 1).padStart(3, '0')}`,
      status: newWO.status || 'Assigned',
      checklist: newWO.checklist || [
        { id: 'c1', text: 'Inspeksi awal dan keselamatan kerja', done: false },
        { id: 'c2', text: 'Eksekusi perawatan & pembersihan', done: false },
        { id: 'c3', text: 'Pengujian performa & operasional', done: false }
      ]
    };
    setWorkOrders(prev => [generated, ...prev]);
    showToast(`Work order baru berhasil dibuat: ${generated.id}`, 'success');
  };

  // 3. Sparepart & Inventory Actions
  const updateSparepartStock = (partId, delta) => {
    setSpareparts(prev => prev.map(sp => {
      if (sp.id !== partId) return sp;
      const newStock = Math.max(0, sp.stockQty + delta);
      let status = 'Normal';
      if (newStock === 0) status = 'Critical';
      else if (newStock < sp.minStockQty) status = 'Low Stock';
      return { ...sp, stockQty: newStock, status };
    }));
    showToast(`Stok sparepart telah disesuaikan`, 'info');
  };

  const addRequisition = (req) => {
    const newReq = {
      ...req,
      id: `PR-2026-${String(requisitions.length + 1).padStart(3, '0')}`,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'Submitted'
    };
    setRequisitions(prev => [newReq, ...prev]);
    showToast(`Pengajuan sparepart ${newReq.id} berhasil dikirim ke armada`, 'success');
  };

  // 4. Crew & Leaves Actions
  const addCrew = (newCrewMember) => {
    const c = {
      ...newCrewMember,
      id: `crew-${Date.now()}`,
      leaveBalanceDays: newCrewMember.leaveBalanceDays || 14,
      status: newCrewMember.status || 'Onboard'
    };
    setCrew(prev => [c, ...prev]);
    showToast(`Crew baru ${c.name} berhasil didaftarkan`, 'success');
  };

  const approveLeave = (leaveId, newStatus) => {
    setLeaves(prev => prev.map(l => l.id === leaveId ? { ...l, status: newStatus } : l));
    showToast(`Pengajuan cuti telah diperbarui: ${newStatus}`, 'success');
  };

  const submitLeave = (leaveData) => {
    const newLeave = {
      ...leaveData,
      id: `leave-${Date.now()}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending Ship Admin'
    };
    setLeaves(prev => [newLeave, ...prev]);
    showToast(`Pengajuan cuti diajukan untuk approval`, 'info');
  };

  const addDrill = (drillData) => {
    const d = {
      ...drillData,
      id: `drill-${Date.now()}`,
      conductedDate: drillData.conductedDate || new Date().toISOString().split('T')[0]
    };
    setDrills(prev => [d, ...prev]);
    showToast(`Laporan latihan keselamatan (Safety Drill) berhasil dicatat`, 'success');
  };

  // 5. WhatsApp & Notification Engine
  const sendWhatsAppReminder = (item, type = 'crew_cert') => {
    let phone = '6281200000000';
    let recipientName = 'Crew / Admin';
    let msg = '';

    if (type === 'crew_cert') {
      const targetCrew = crew.find(c => c.id === item.crewId);
      phone = targetCrew?.whatsapp || '6281288991122';
      recipientName = targetCrew?.name || item.crewName;
      msg = `*PEMBERITAHUAN RESMI SISTEM PMS KAPAL*\n\nYth. *${recipientName}*,\nSertifikat Anda: *${item.name}* (No: ${item.certificateNo}) akan segera kadaluarsa pada *${item.expiryDate}* (${item.daysUntilExpiry} hari lagi).\n\nMohon segera melapor ke Nakhoda / Bagian Personalia untuk proses perpanjangan agar kelaiklautan kapal tetap terjaga.\n\n_Sistem PMS Armada Kapal Indonesia_`;
    } else if (type === 'ship_doc') {
      const v = vessels.find(ship => ship.id === item.vesselId);
      recipientName = `Admin Kapal & Nakhoda ${v?.name || ''}`;
      msg = `*PERINGATAN DOKUMEN KAPAL - SISTEM PMS*\n\nKepada: *${recipientName}*\nDokumen: *${item.name}* (No: ${item.documentNo})\nKapal: *${v?.name}*\nTanggal Jatuh Tempo: *${item.expiryDate}* (${item.daysUntilExpiry} hari lagi).\n\nSegera hubungi Klasifikasi / Syahbandar untuk jadwal survey dan perpanjangan sertifikat.\n\n_Pusat Pengendali Armada PMS_`;
    } else if (type === 'work_order') {
      recipientName = item.assignedTo || 'Teknisi / Chief Engineer';
      msg = `*PERINGATAN WORK ORDER OVERDUE*\n\nKepada: *${recipientName}*\nWork Order: *${item.title}* (ID: ${item.id})\nStatus: OVERDUE\nTarget: ${item.targetHours} Jam (Saat ini: ${item.currentRunningHours} Jam).\n\nHarap segera menindaklanjuti pekerjaan perawatan tersebut dan update status di PMS.`;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;

    // Log to notification audit
    const newLog = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID'),
      channel: 'WhatsApp Direct',
      target: `${recipientName} (${phone})`,
      vesselName: vessels.find(v => v.id === item.vesselId)?.name || 'Fleet',
      subject: `Reminder: ${item.name || item.title}`,
      message: msg,
      status: 'Delivered',
      thresholdTriggered: item.daysUntilExpiry ? `H-${item.daysUntilExpiry}` : 'Direct Trigger'
    };

    setNotificationLogs(prev => [newLog, ...prev]);
    window.open(waUrl, '_blank');
    showToast(`Pesan WhatsApp telah disiapkan dan dibuka ke ${recipientName}`, 'success');
  };

  // Google Calendar URL Generator
  const getGoogleCalendarUrl = (item) => {
    const vessel = vessels.find(v => v.id === item.vesselId);
    const vesselName = vessel?.name || 'Armada Kapal';
    const docNo = item.certificateNo || item.documentNo || '-';
    const holder = item.crewName ? `Kru: ${item.crewName}` : `Kapal: ${vesselName}`;

    let startDate = '';
    let endDate = '';
    if (item.expiryDate) {
      const parts = item.expiryDate.split('-');
      if (parts.length === 3) {
        startDate = `${parts[0]}${parts[1]}${parts[2]}`;
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        d.setDate(d.getDate() + 1);
        const nextY = d.getFullYear();
        const nextM = String(d.getMonth() + 1).padStart(2, '0');
        const nextD = String(d.getDate()).padStart(2, '0');
        endDate = `${nextY}${nextM}${nextD}`;
      }
    }

    const title = `[PMS H-30] Jatuh Tempo: ${item.name}`;
    const details = `PERINGATAN JATUH TEMPO DOKUMEN SISTEM PMS KAPAL:\n` +
      `----------------------------------------\n` +
      `Nama Dokumen: ${item.name}\n` +
      `Nomor Dokumen: ${docNo}\n` +
      `Pemilik/Subjek: ${holder}\n` +
      `Kapal: ${vesselName}\n` +
      `Penerbit: ${item.issuer || '-'}\n` +
      `Tanggal Jatuh Tempo: ${item.expiryDate}\n` +
      `Status Kelaikan: ${item.status}\n\n` +
      `PENTING: Segera hubungi Syahbandar / Biro Klasifikasi untuk survey & perpanjangan sebelum masa berlaku habis!`;

    const location = `${vesselName}, Pelabuhan Pendaftaran ${vessel?.portOfRegistry || 'Indonesia'}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  };

  const openGoogleCalendar = (item) => {
    const url = getGoogleCalendarUrl(item);
    const vesselName = vessels.find(v => v.id === item.vesselId)?.name || 'Armada';

    const newLog = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID'),
      channel: 'Google Calendar Sync',
      target: `Google Calendar (${item.crewName || vesselName})`,
      vesselName,
      subject: `Sinkron Kalender: ${item.name}`,
      message: `Event pengingat jatuh tempo H-30 berhasil dijadwalkan di Google Calendar untuk tanggal ${item.expiryDate}`,
      status: 'Delivered',
      thresholdTriggered: 'H-30 G-Cal'
    };

    setNotificationLogs(prev => [newLog, ...prev]);
    window.open(url, '_blank');
    showToast(`Google Calendar dibuka untuk event: ${item.name}`, 'success');
  };

  // Export .ics calendar file for all H-30 items
  const exportH30CalendarICS = () => {
    const expiringItems = [
      ...crewCertificates.filter(c => c.daysUntilExpiry !== undefined && c.daysUntilExpiry <= 30 && c.daysUntilExpiry >= -30),
      ...shipDocuments.filter(d => d.daysUntilExpiry !== undefined && d.daysUntilExpiry <= 30 && d.daysUntilExpiry >= -30)
    ];

    if (expiringItems.length === 0) {
      showToast('Tidak ada dokumen yang jatuh tempo dalam rentang 1 bulan (H-30).', 'info');
      return;
    }

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Sistem PMS Kapal Enterprise//Reminder H-30//ID',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:PMS Kapal - Reminder Jatuh Tempo H-30'
    ];

    expiringItems.forEach((item, idx) => {
      const vessel = vessels.find(v => v.id === item.vesselId);
      const vesselName = vessel?.name || 'Kapal';
      const cleanDate = item.expiryDate ? item.expiryDate.replace(/-/g, '') : '20260909';

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:pms-cert-${item.id}-${idx}@pmskapal.com`,
        `DTSTAMP:${cleanDate}T000000Z`,
        `DTSTART;VALUE=DATE:${cleanDate}`,
        `SUMMARY:[PMS H-30] ${item.name} (${vesselName})`,
        `DESCRIPTION:Pengingat jatuh tempo dokumen ${item.name} (No: ${item.certificateNo || item.documentNo}). Segera lakukan perpanjangan kelaiklautan.`,
        `LOCATION:${vesselName}`,
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        'DESCRIPTION:Reminder H-30 Jatuh Tempo Dokumen PMS Kapal',
        'TRIGGER:-P30D',
        'END:VALARM',
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        'DESCRIPTION:Reminder H-7 Kritis Jatuh Tempo Dokumen PMS Kapal',
        'TRIGGER:-P7D',
        'END:VALARM',
        'END:VEVENT'
      );
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `PMS_Reminder_H30_GoogleCalendar_${new Date().toISOString().split('T')[0]}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`File .ics berhasil diunduh (${expiringItems.length} event). Siap diimpor ke Google Calendar / Outlook!`, 'success');
  };

  // Auto-send WhatsApp for all H-30 items
  const autoDispatchH30WhatsApp = () => {
    const expiringItems = [
      ...crewCertificates.filter(c => c.daysUntilExpiry !== undefined && c.daysUntilExpiry <= 30 && c.daysUntilExpiry >= -30),
      ...shipDocuments.filter(d => d.daysUntilExpiry !== undefined && d.daysUntilExpiry <= 30 && d.daysUntilExpiry >= -30)
    ];

    if (expiringItems.length === 0) {
      showToast('Tidak ada dokumen yang jatuh tempo dalam rentang 1 bulan (H-30).', 'info');
      return;
    }

    const newLogs = expiringItems.map(item => {
      const vessel = vessels.find(v => v.id === item.vesselId);
      const recipientName = item.crewName || `Nakhoda & Admin ${vessel?.name || ''}`;
      return {
        id: `notif-${Date.now()}-${item.id}`,
        timestamp: new Date().toLocaleString('id-ID'),
        channel: 'WhatsApp Auto (H-30 Bot)',
        target: recipientName,
        vesselName: vessel?.name || 'Fleet',
        subject: `[H-30 Bot] Reminder: ${item.name}`,
        message: `Pemberitahuan Otomatis Rentang 1 Bulan: Dokumen ${item.name} akan jatuh tempo pada ${item.expiryDate} (${item.daysUntilExpiry} hari lagi). Harap proses perpanjangan segera.`,
        status: 'Delivered',
        thresholdTriggered: 'H-30 Auto'
      };
    });

    setNotificationLogs(prev => [...newLogs, ...prev]);

    // Open first one in WhatsApp
    const first = expiringItems[0];
    sendWhatsAppReminder(first, first.crewName ? 'crew_cert' : 'ship_doc');
    showToast(`Otomatisasi H-30 berhasil! ${expiringItems.length} notifikasi WA dicatat di audit log.`, 'success');
  };

  const escalateNotification = (logId) => {
    setNotificationLogs(prev => prev.map(log => {
      if (log.id === logId) {
        return {
          ...log,
          status: 'Escalated',
          target: `${log.target} -> Eskalasi ke Fleet Manager`
        };
      }
      return log;
    }));
    showToast(`Peringatan berhasil dieskalasi ke Fleet Manager!`, 'warning');
  };

  // Reset to default seed data
  const resetToSeedData = () => {
    setVessels(INITIAL_VESSELS);
    setEquipment(INITIAL_EQUIPMENT);
    setSchedules(INITIAL_MAINTENANCE_SCHEDULES);
    setWorkOrders(INITIAL_WORK_ORDERS);
    setSpareparts(INITIAL_SPAREPARTS);
    setRequisitions(INITIAL_REQUISITIONS);
    setCosts(INITIAL_COSTS);
    setCrew(INITIAL_CREW);
    setLeaves(INITIAL_LEAVES);
    setDrills(INITIAL_DRILLS);
    setCrewCertificates(INITIAL_CREW_CERTIFICATES);
    setShipDocuments(INITIAL_SHIP_DOCUMENTS);
    setNotificationSettings(INITIAL_NOTIFICATION_SETTINGS);
    setNotificationLogs(INITIAL_NOTIFICATION_LOGS);
    localStorage.clear();
    showToast('Seluruh data berhasil di-reset ke data maritim awal!', 'info');
  };

  // Filtered views by selected vessel
  const filteredEquipment = selectedVesselId === 'all'
    ? equipment
    : equipment.filter(e => e.vesselId === selectedVesselId);

  const filteredWorkOrders = selectedVesselId === 'all'
    ? workOrders
    : workOrders.filter(w => w.vesselId === selectedVesselId);

  const filteredSpareparts = selectedVesselId === 'all'
    ? spareparts
    : spareparts.filter(s => s.vesselId === selectedVesselId);

  const filteredCrew = selectedVesselId === 'all'
    ? crew
    : crew.filter(c => c.vesselId === selectedVesselId);

  const filteredCrewCerts = selectedVesselId === 'all'
    ? crewCertificates
    : crewCertificates.filter(c => c.vesselId === selectedVesselId);

  const filteredShipDocs = selectedVesselId === 'all'
    ? shipDocuments
    : shipDocuments.filter(d => d.vesselId === selectedVesselId);

  const filteredCosts = selectedVesselId === 'all'
    ? costs
    : costs.filter(c => c.vesselId === selectedVesselId);

  const filteredDrills = selectedVesselId === 'all'
    ? drills
    : drills.filter(d => d.vesselId === selectedVesselId);

  // Critical counters
  const overdueWOCount = filteredWorkOrders.filter(w => w.status === 'Overdue').length;
  const expiredDocsCount = filteredShipDocs.filter(d => d.status === 'Expired').length +
                           filteredCrewCerts.filter(c => c.status === 'Expired').length;
  const dueSoonDocsCount = filteredShipDocs.filter(d => d.status === 'Due Soon').length +
                           filteredCrewCerts.filter(c => c.status === 'Due Soon').length;
  const lowStockCount = filteredSpareparts.filter(s => s.status === 'Low Stock' || s.status === 'Critical').length;

  // Items within 1 month (H-30) of expiry: daysUntilExpiry <= 30
  const h30ExpiringItems = [
    ...filteredCrewCerts.filter(c => c.daysUntilExpiry !== undefined && c.daysUntilExpiry <= 30),
    ...filteredShipDocs.filter(d => d.daysUntilExpiry !== undefined && d.daysUntilExpiry <= 30)
  ];
  const h30ExpiringCount = h30ExpiringItems.length;

  return (
    <PMSContext.Provider
      value={{
        // Data
        vessels,
        equipment: filteredEquipment,
        allEquipment: equipment,
        schedules,
        workOrders: filteredWorkOrders,
        allWorkOrders: workOrders,
        spareparts: filteredSpareparts,
        allSpareparts: spareparts,
        requisitions,
        costs: filteredCosts,
        allCosts: costs,
        crew: filteredCrew,
        allCrew: crew,
        leaves,
        drills: filteredDrills,
        crewCertificates: filteredCrewCerts,
        allCrewCertificates: crewCertificates,
        shipDocuments: filteredShipDocs,
        allShipDocuments: shipDocuments,
        notificationSettings,
        notificationLogs,
        users: INITIAL_USERS,

        // Filters & Navigation
        selectedVesselId,
        setSelectedVesselId,
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        toastMessage,

        // Counters
        overdueWOCount,
        expiredDocsCount,
        dueSoonDocsCount,
        lowStockCount,
        h30ExpiringCount,
        h30ExpiringItems,

        // Actions
        updateRunningHours,
        toggleChecklist,
        updateWorkOrderStatus,
        addWorkOrder,
        updateSparepartStock,
        addRequisition,
        addCrew,
        approveLeave,
        submitLeave,
        addDrill,
        sendWhatsAppReminder,
        escalateNotification,
        openGoogleCalendar,
        getGoogleCalendarUrl,
        exportH30CalendarICS,
        autoDispatchH30WhatsApp,
        resetToSeedData,
        showToast
      }}
    >
      {children}
    </PMSContext.Provider>
  );
};

export const usePMS = () => {
  const context = useContext(PMSContext);
  if (!context) throw new Error('usePMS must be used within a PMSProvider');
  return context;
};
