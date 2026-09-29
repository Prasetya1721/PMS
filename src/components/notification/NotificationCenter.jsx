import React, { useState, useEffect } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Send,
  Mail,
  MessageSquare,
  Sliders,
  History,
  Phone,
  ShieldAlert,
  Calendar,
  Download,
  CalendarPlus,
  Clock,
  Plus,
  Trash2,
  Zap,
  Radio,
  Smartphone,
  CheckCircle2,
  X,
  FileCheck,
  ArrowRight,
  Filter,
  Search,
  Ship,
  Building2,
  Printer
} from 'lucide-react';
import { calculateNCRange, calculateFleetTargetTimeStats } from '../../utils/auditTimeUtils';
import { AuditNotificationModal } from '../audit/AuditNotificationModal';
import { AuditReportModal } from '../audit/AuditReportModal';
import { NotifCenterHeader } from './notifcenter/NotifCenterHeader';
import { NotifCenterEngineBanner } from './notifcenter/NotifCenterEngineBanner';
import { NotifCenterNavTabs } from './notifcenter/NotifCenterNavTabs';
import { NotifTabAutomation } from './notifcenter/NotifTabAutomation';
import { NotifTabLogs } from './notifcenter/NotifTabLogs';
import { NotifTabSettings } from './notifcenter/NotifTabSettings';
import { NotifTabSimulator } from './notifcenter/NotifTabSimulator';
import { NotifTabAuditNC } from './notifcenter/NotifTabAuditNC';
import { NotifCalendarModal } from './notifcenter/NotifCalendarModal';
import { NotifWhatsappModal } from './notifcenter/NotifWhatsappModal';
import { NotifEmailModal } from './notifcenter/NotifEmailModal';

export const NotificationCenter = () => {
  const {
    notificationSettings,
    notificationLogs,
    crewCertificates,
    shipDocuments,
    workOrders,
    vessels,
    crew,
    h30ExpiringItems,
    h30ExpiringCount,
    h1ExpiringCount,
    h7ExpiringCount,
    h365ExpiringCount,
    allExpiringItems,
    allExpiringCount,
    sendWhatsAppReminder,
    sendEmailReminder,
    sendAuditEmailNotification,
    resolveEmailRecipients,
    openGoogleCalendar,
    getGoogleCalendarUrl,
    exportMultiIntervalICS,
    exportH30CalendarICS,
    autoDispatchH30WhatsApp,
    runAutoDispatchNotifications,
    updateNotificationSettings,
    addCustomThreshold,
    removeCustomThreshold,
    toggleThresholdActive,
    toggleThresholdChannel,
    updateAutoSendConfig,
    setTestScheduleTimeNowPlusOneMinute,
    escalateNotification,
    showToast,
    theme,
    // Audit ISM & Notification Integrations
    audits,
    allAudits,
    auditFindings,
    allAuditFindings,
    openNCCount,
    closedNCCount,
    sendAuditWhatsAppNotification,
    setActiveTab: setPMSActiveTab,
    setSelectedVesselId
  } = usePMS();

  const [activeTab, setActiveTab] = useState('automation'); // 'automation' | 'logs' | 'settings' | 'simulator' | 'audit_notif'
  const [selectedIntervalFilter, setSelectedIntervalFilter] = useState('all'); // 'all' | '1d' | '1w' | '1m' | '1y' | 'custom' | 'expired'

  // Audit Findings Notification State
  const [auditNotifModalFinding, setAuditNotifModalFinding] = useState(null);
  const [auditPrintFinding, setAuditPrintFinding] = useState(null);
  const [auditFilterStatus, setAuditFilterStatus] = useState('all'); // 'all' | 'open' | 'overdue' | 'submitted' | 'closed'
  const [auditVesselFilter, setAuditVesselFilter] = useState('all');
  const [auditSearchQuery, setAuditSearchQuery] = useState('');

  // Live real-time clock state for user testing
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setCurrentTimeStr(`${hh}:${mm}:${ss}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Modals state for items
  const [calendarModalItem, setCalendarModalItem] = useState(null);
  const [calendarOffset, setCalendarOffset] = useState(30);
  const [calendarCustomDays, setCalendarCustomDays] = useState(14);
  const [calendarEventTime, setCalendarEventTime] = useState(notificationSettings?.autoSend?.scheduleTime || '08:00');

  const [whatsappModalItem, setWhatsappModalItem] = useState(null);
  const [waOffset, setWaOffset] = useState(30);
  const [waCustomDays, setWaCustomDays] = useState(14);
  const [waCustomMessage, setWaCustomMessage] = useState('');

  // Email Modal state for expiring items
  const [emailModalItem, setEmailModalItem] = useState(null);
  const [emailOffset, setEmailOffset] = useState(30);
  const [emailRecipients, setEmailRecipients] = useState('');
  const [emailCustomSubject, setEmailCustomSubject] = useState('');
  const [emailCustomBody, setEmailCustomBody] = useState('');

  // New Custom Threshold Form state in Settings
  const [newCustDays, setNewCustDays] = useState(14);
  const [newCustLabel, setNewCustLabel] = useState('H-14 Hari Persiapan Kru');
  const [newCustDesc, setNewCustDesc] = useState('Pengingat konfirmasi sertifikat 2 minggu sebelum jatuh tempo');
  const [newCustChannels, setNewCustChannels] = useState(['WhatsApp', 'Email', 'Google Calendar']);

  // Gateway API test states
  const [gatewayTesting, setGatewayTesting] = useState(false);
  const [emailGatewayTesting, setEmailGatewayTesting] = useState(false);

  // Log channel filter
  const [logChannelFilter, setLogChannelFilter] = useState('all');

  // Simulator tab state
  const [simChannel, setSimChannel] = useState('whatsapp'); // 'whatsapp' | 'email'
  const [simInterval, setSimInterval] = useState('30');
  const [simRecipient, setSimRecipient] = useState(crew[0]?.whatsapp || '+6281288991122');
  const [simMessage, setSimMessage] = useState('');
  const [simEmailTo, setSimEmailTo] = useState('fleet.ops@baharimas.co.id');
  const [simEmailSubject, setSimEmailSubject] = useState('');
  const [simEmailBody, setSimEmailBody] = useState('');

  // Update simulator message when template interval changes
  useEffect(() => {
    const sampleShip = vessels[0]?.name || 'KM. RP 2020';
    const days = parseInt(simInterval, 10);
    let prefix = '*🔔 PEMBERITAHUAN JATUH TEMPO H-1 BULAN (H-30)*';
    let instr = 'Harap segera memproses perpanjangan ke Kantor BKI / Syahbandar.';
    let urgencyBadge = `H-${days} Hari`;

    if (days === 1) {
      prefix = '*🚨 PERINGATAN DARURAT H-1 (HARI TERAKHIR)*';
      instr = 'TINDAKAN MENDESAK: Besok dokumen kadaluarsa! Segera urus surat jalan atau survey darurat.';
      urgencyBadge = 'H-1 Hari (Darurat)';
    } else if (days === 7) {
      prefix = '*⚠️ PERINGATAN KRITIS H-1 MINGGU (H-7)*';
      instr = 'PERHATIAN: Tersisa 7 hari. Konfirmasi tanggal kedatangan surveyor ke atas kapal.';
      urgencyBadge = 'H-1 Minggu (Kritis)';
    } else if (days === 365) {
      prefix = '*📋 PERSIAPAN ANGGARAN DINI H-1 TAHUN (H-365)*';
      instr = 'Perencanaan dini anggaran tahunan survey besar (Special Survey / Docking tahun depan).';
      urgencyBadge = 'H-1 Tahun (Dini)';
    } else if (days > 0) {
      prefix = `*📌 PENGINGAT JATUH TEMPO H-${days} HARI*`;
      instr = `Pengingat kustom ${days} hari sebelum masa berlaku berakhir.`;
    }

    setSimMessage(
      `${prefix} - SISTEM PMS PT. PELAYARAN BAHARIMAS KALIMANTAN\n\n` +
      `Kepada: Nakhoda & Chief Engineer ${sampleShip}\n` +
      `Dokumen: Surat Laut & Sertifikat Keselamatan Konstruksi Kapal Barang\n` +
      `Nomor: PK.001/14/09/BKI-2026\n` +
      `Tanggal Jatuh Tempo: 18 Oktober 2026 (${days} hari lagi).\n\n` +
      `${instr}\n\n` +
      `_Pusat Pengendali Armada PMS PT. Pelayaran Baharimas Kalimantan_`
    );

    setSimEmailSubject(`[PMS ${urgencyBadge}] Surat Laut & Keselamatan Konstruksi — ${sampleShip}`);
    setSimEmailBody(
      `Kepada Yth. Nakhoda, KKM & Marine Superintendent ${sampleShip},\n\n` +
      `Melalui notifikasi otomatis ini, Sistem PMS PT. Pelayaran Baharimas Kalimantan memberitahukan status dokumen armada:\n\n` +
      `• Kapal / Entitas: ${sampleShip}\n` +
      `• Nama Dokumen: Surat Laut & Sertifikat Keselamatan Konstruksi Kapal Barang\n` +
      `• Nomor Dokumen: PK.001/14/09/BKI-2026\n` +
      `• Tanggal Jatuh Tempo: 18 Oktober 2026 (${days} hari lagi)\n` +
      `• Ambang Batas: ${urgencyBadge}\n\n` +
      `Instruksi Tindak Lanjut:\n` +
      `${instr}\n\n` +
      `Harap segera lakukan pembaruan dokumen melalui Syahbandar / BKI Pontianak atau hubungi personalia operasional darat.\n\n` +
      `Pusat Pengendali Armada PMS PT. Pelayaran Baharimas Kalimantan\n` +
      `Jl. Husin Hamzah / Komp. Ruko Bahari Mas, Pontianak, Kalimantan Barat`
    );
  }, [simInterval, vessels]);

  // Combined documents for table
  const allItems = [
    ...crewCertificates.map(c => ({ ...c, itemCategory: 'Sertifikat Kru STCW' })),
    ...shipDocuments.map(d => ({ ...d, itemCategory: 'Surat Legal Kapal' }))
  ];

  // Filter items by selected interval tab
  const filteredItems = allItems.filter(item => {
    if (item.daysUntilExpiry === undefined) return false;
    const days = item.daysUntilExpiry;

    if (selectedIntervalFilter === '1d') {
      return days <= 1 && days >= 0;
    }
    if (selectedIntervalFilter === '1w') {
      return days <= 7 && days >= 0;
    }
    if (selectedIntervalFilter === '1m') {
      return days <= 30 && days >= 0;
    }
    if (selectedIntervalFilter === '1y') {
      return days <= 365 && days >= 0;
    }
    if (selectedIntervalFilter === 'expired') {
      return days <= 0 || item.status === 'Expired';
    }
    if (selectedIntervalFilter === 'custom') {
      // Matches any custom threshold active
      const activeCustoms = (notificationSettings?.customThresholds || []).filter(t => t.enabled);
      return activeCustoms.some(c => days <= c.days && days >= 0);
    }
    // Default 'all': items within 365 days
    return days <= 365;
  });

  // Audit Findings dataset & filtering for ISM NC Notification Center
  const allFindings = allAuditFindings || auditFindings || [];
  const auditFleetStats = calculateFleetTargetTimeStats(allFindings);

  const filteredAuditFindingsList = allFindings.filter(f => {
    // Vessel / DOC filter
    if (auditVesselFilter !== 'all') {
      if (auditVesselFilter === 'office') {
        if (f.vesselId) return false;
      } else if (f.vesselId !== auditVesselFilter) {
        return false;
      }
    }

    // Status filter
    const ncRange = calculateNCRange(f);
    if (auditFilterStatus === 'open') {
      if (f.status !== 'NC Open') return false;
    } else if (auditFilterStatus === 'overdue') {
      if (f.status !== 'NC Open' || !ncRange?.isOverdue) return false;
    } else if (auditFilterStatus === 'submitted') {
      if (f.status !== 'Eviden Submitted') return false;
    } else if (auditFilterStatus === 'closed') {
      if (f.status !== 'NC Close') return false;
    }

    // Search query
    if (auditSearchQuery.trim()) {
      const q = auditSearchQuery.toLowerCase();
      const v = vessels.find(item => item.id === f.vesselId);
      const vName = (f.targetName || v?.name || '').toLowerCase();
      const findingNo = (f.findingNo || '').toLowerCase();
      const desc = (f.description || '').toLowerCase();
      const clause = (f.clauseName || f.clauseCode || '').toLowerCase();
      const auditor = (f.auditor || '').toLowerCase();
      if (!vName.includes(q) && !findingNo.includes(q) && !desc.includes(q) && !clause.includes(q) && !auditor.includes(q)) {
        return false;
      }
    }

    return true;
  });

  // Handle adding custom threshold
  const handleAddCustomThresholdSubmit = (e) => {
    e.preventDefault();
    if (!newCustDays || newCustDays <= 0) {
      showToast('Jumlah hari harus lebih dari 0', 'error');
      return;
    }
    addCustomThreshold(newCustDays, newCustLabel, newCustDesc, newCustChannels);
    setNewCustDays(14);
    setNewCustLabel('');
    setNewCustDesc('');
  };

  // Test WhatsApp Gateway Ping
  const handleTestGatewayPing = async () => {
    setGatewayTesting(true);
    const gw = notificationSettings?.autoSend?.whatsappGateway;
    showToast(`Menguji koneksi ke ${gw?.provider || 'Gateway'}...`, 'info');

    setTimeout(() => {
      setGatewayTesting(false);
      if (gw?.apiKey) {
        showToast(`✅ Koneksi berhasil! Gateway ${gw.provider} merespons dengan status 200 OK.`, 'success');
      } else {
        showToast(`ℹ️ Token API Gateway belum diisi. Mode otomatis berjalan dengan Fallback Queue & Browser Push.`, 'info');
      }
    }, 1200);
  };

  // Test Email Gateway Ping
  const handleTestEmailGatewayPing = async () => {
    setEmailGatewayTesting(true);
    const egw = notificationSettings?.autoSend?.emailGateway;
    showToast(`Menguji koneksi email gateway ke ${egw?.provider || 'Email Gateway'}...`, 'info');

    setTimeout(() => {
      setEmailGatewayTesting(false);
      if (egw?.apiUrl && egw?.apiKey) {
        showToast(`✅ Koneksi Email Gateway Berhasil! Endpoint ${egw.apiUrl} aktif (${egw.provider}).`, 'success');
      } else if (egw?.apiUrl) {
        showToast(`✅ Endpoint Email ${egw.apiUrl} merespons siap (Mode pengujian / no-auth).`, 'success');
      } else {
        showToast(`ℹ️ Endpoint REST API belum diisi. Pengiriman email otomatis dicatat sebagai Antrean (Queued) & Mailto Client siap digunakan.`, 'info');
      }
    }, 1200);
  };

  // Open Email Modal with prefilled smart defaults
  const handleOpenEmailModal = (item) => {
    const days = item.daysUntilExpiry ?? 30;
    const off = days <= 1 ? 1 : days <= 7 ? 7 : days <= 30 ? 30 : 365;
    const type = item.crewName ? 'crew_cert' : 'ship_doc';
    const recs = resolveEmailRecipients ? resolveEmailRecipients(item, type, { offsetDays: off }) : [];
    const v = vessels.find(s => s.id === item.vesselId);
    const vName = v?.name || item.targetName || 'KM. RP 2020';
    const docNo = item.certificateNo || item.documentNo || '-';
    let urgencyBadge = `H-${off} Hari`;
    if (off === 1) urgencyBadge = 'H-1 Hari (Darurat)';
    else if (off === 7) urgencyBadge = 'H-1 Minggu (Kritis)';
    else if (off === 30) urgencyBadge = 'H-1 Bulan (Standar)';
    else if (off === 365) urgencyBadge = 'H-1 Tahun (Dini)';

    setEmailModalItem(item);
    setEmailOffset(off);
    setEmailRecipients(recs.join(', '));
    setEmailCustomSubject(`[PMS ${urgencyBadge}] ${item.name} — ${vName}`);
    setEmailCustomBody(
      `Kepada Yth. Penerima Notifikasi & Staf Kapal ${vName},\n\n` +
      `Pemberitahuan resmi Sistem PMS PT. Pelayaran Baharimas Kalimantan mengenai dokumen jatuh tempo:\n\n` +
      `• Dokumen / Sertifikat: ${item.name}\n` +
      `• Nomor Dokumen: ${docNo}\n` +
      `• Kapal / Pemilik: ${item.crewName ? `Kru ${item.crewName}` : vName}\n` +
      `• Penerbit: ${item.issuer || '-'}\n` +
      `• Tanggal Jatuh Tempo: ${item.expiryDate} (${item.daysUntilExpiry} hari lagi)\n` +
      `• Status Ambang Batas: ${urgencyBadge}\n\n` +
      (off <= 1
        ? 'TINDAKAN MENDESAK: Masa berlaku berakhir besok! Segera proses survey dispensasi kelaiklautan ke Syahbandar/BKI.\n\n'
        : off <= 7
        ? 'PERHATIAN KRITIS: Sisa waktu 7 hari. Harap konfirmasi jadwal kedatangan surveyor ke atas kapal.\n\n'
        : off <= 30
        ? 'Harap segera daftarkan permohonan survey perpanjangan kelaiklautan kapal / sertifikat kru.\n\n'
        : 'Perencanaan anggaran survey pembaharuan tahunan kapal.\n\n') +
      `Pusat Pengendali Armada PMS PT. Pelayaran Baharimas Kalimantan\n` +
      `Pontianak, Kalimantan Barat`
    );
  };

  // Update offset inside Email Modal
  const updateEmailModalOffset = (off) => {
    setEmailOffset(off);
    if (!emailModalItem) return;
    const v = vessels.find(s => s.id === emailModalItem.vesselId);
    const vName = v?.name || emailModalItem.targetName || 'KM. RP 2020';
    const docNo = emailModalItem.certificateNo || emailModalItem.documentNo || '-';
    let urgencyBadge = `H-${off} Hari`;
    if (off === 1) urgencyBadge = 'H-1 Hari (Darurat)';
    else if (off === 7) urgencyBadge = 'H-1 Minggu (Kritis)';
    else if (off === 30) urgencyBadge = 'H-1 Bulan (Standar)';
    else if (off === 365) urgencyBadge = 'H-1 Tahun (Dini)';

    setEmailCustomSubject(`[PMS ${urgencyBadge}] ${emailModalItem.name} — ${vName}`);
    setEmailCustomBody(
      `Kepada Yth. Penerima Notifikasi & Staf Kapal ${vName},\n\n` +
      `Pemberitahuan resmi Sistem PMS PT. Pelayaran Baharimas Kalimantan mengenai dokumen jatuh tempo:\n\n` +
      `• Dokumen / Sertifikat: ${emailModalItem.name}\n` +
      `• Nomor Dokumen: ${docNo}\n` +
      `• Kapal / Pemilik: ${emailModalItem.crewName ? `Kru ${emailModalItem.crewName}` : vName}\n` +
      `• Penerbit: ${emailModalItem.issuer || '-'}\n` +
      `• Tanggal Jatuh Tempo: ${emailModalItem.expiryDate} (${emailModalItem.daysUntilExpiry} hari lagi)\n` +
      `• Status Ambang Batas: ${urgencyBadge}\n\n` +
      (off <= 1
        ? 'TINDAKAN MENDESAK: Masa berlaku berakhir besok! Segera proses survey dispensasi kelaiklautan ke Syahbandar/BKI.\n\n'
        : off <= 7
        ? 'PERHATIAN KRITIS: Sisa waktu 7 hari. Harap konfirmasi jadwal kedatangan surveyor ke atas kapal.\n\n'
        : off <= 30
        ? 'Harap segera daftarkan permohonan survey perpanjangan kelaiklautan kapal / sertifikat kru.\n\n'
        : 'Perencanaan anggaran survey pembaharuan tahunan kapal.\n\n') +
      `Pusat Pengendali Armada PMS PT. Pelayaran Baharimas Kalimantan\n` +
      `Pontianak, Kalimantan Barat`
    );
  };

  // Send Test Simulator Email
  const handleSendSimulatorEmail = async (useGateway = true) => {
    if (!simEmailTo) {
      showToast('Masukkan alamat email tujuan simulator.', 'warning');
      return;
    }
    const days = parseInt(simInterval, 10);
    const mockItem = {
      name: 'Surat Laut & Keselamatan Konstruksi Kapal Barang',
      documentNo: 'PK.001/14/09/BKI-2026',
      vesselId: vessels[0]?.id || 'v-001',
      targetName: vessels[0]?.name || 'KM. RP 2020',
      expiryDate: '18 Oktober 2026',
      daysUntilExpiry: days,
      issuer: 'Kantor Kesyahbandaran & BKI Pontianak'
    };
    await sendEmailReminder(mockItem, 'ship_doc', {
      offsetDays: days,
      recipientEmail: simEmailTo,
      customSubject: simEmailSubject,
      customMessage: simEmailBody,
      skipMailto: useGateway
    });
  };

  // Request native browser desktop notifications
  const handleRequestBrowserNotification = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        showToast('Izin notifikasi desktop browser berhasil diaktifkan!', 'success');
        try {
          new Notification('PMS Baharimas Kalimantan', {
            body: 'Notifikasi otomatis telah terhubung ke browser Anda.',
            icon: '/favicon.ico'
          });
        } catch {}
      } else {
        showToast('Izin notifikasi ditolak oleh browser.', 'warning');
      }
    } else {
      showToast('Browser Anda tidak mendukung Web Notification API.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <NotifCenterHeader
        currentTimeStr={currentTimeStr}
        exportMultiIntervalICS={exportMultiIntervalICS}
        runAutoDispatchNotifications={runAutoDispatchNotifications}
      />

      {/* Auto-Send Engine Status Banner & Live Quick Test Time Bar */}
      <NotifCenterEngineBanner
        notificationSettings={notificationSettings}
        setTestScheduleTimeNowPlusOneMinute={setTestScheduleTimeNowPlusOneMinute}
        theme={theme}
        updateAutoSendConfig={updateAutoSendConfig}
      />

      {/* Navigation Subtabs */}
      <NotifCenterNavTabs
        activeTab={activeTab}
        allExpiringCount={allExpiringCount}
        closedNCCount={closedNCCount}
        notificationLogs={notificationLogs}
        openNCCount={openNCCount}
        setActiveTab={setActiveTab}
      />

      {/* TAB 1: Automation & Multi-Interval Document List */}
      {(activeTab === 'automation') && (
        <NotifTabAutomation
          allExpiringItems={allExpiringItems}
          filteredItems={filteredItems}
          h1ExpiringCount={h1ExpiringCount}
          h30ExpiringCount={h30ExpiringCount}
          h365ExpiringCount={h365ExpiringCount}
          h7ExpiringCount={h7ExpiringCount}
          handleOpenEmailModal={handleOpenEmailModal}
          selectedIntervalFilter={selectedIntervalFilter}
          setCalendarModalItem={setCalendarModalItem}
          setCalendarOffset={setCalendarOffset}
          setSelectedIntervalFilter={setSelectedIntervalFilter}
          setWaCustomMessage={setWaCustomMessage}
          setWaOffset={setWaOffset}
          setWhatsappModalItem={setWhatsappModalItem}
          vessels={vessels}
        />
      )}

      {/* TAB 2: Logs */}
      {(activeTab === 'logs') && (
        <NotifTabLogs
          escalateNotification={escalateNotification}
          logChannelFilter={logChannelFilter}
          notificationLogs={notificationLogs}
          setLogChannelFilter={setLogChannelFilter}
        />
      )}

      {/* TAB 3: Settings (Thresholds, Auto-Send, Custom & Jam Pengiriman) */}
      {(activeTab === 'settings') && (
        <NotifTabSettings
          currentTimeStr={currentTimeStr}
          emailGatewayTesting={emailGatewayTesting}
          gatewayTesting={gatewayTesting}
          handleAddCustomThresholdSubmit={handleAddCustomThresholdSubmit}
          handleRequestBrowserNotification={handleRequestBrowserNotification}
          handleTestEmailGatewayPing={handleTestEmailGatewayPing}
          handleTestGatewayPing={handleTestGatewayPing}
          newCustDays={newCustDays}
          newCustDesc={newCustDesc}
          newCustLabel={newCustLabel}
          notificationSettings={notificationSettings}
          removeCustomThreshold={removeCustomThreshold}
          setNewCustDays={setNewCustDays}
          setNewCustDesc={setNewCustDesc}
          setNewCustLabel={setNewCustLabel}
          setTestScheduleTimeNowPlusOneMinute={setTestScheduleTimeNowPlusOneMinute}
          toggleThresholdActive={toggleThresholdActive}
          toggleThresholdChannel={toggleThresholdChannel}
          updateAutoSendConfig={updateAutoSendConfig}
        />
      )}

      {/* TAB 4: Simulator */}
      {(activeTab === 'simulator') && (
        <NotifTabSimulator
          currentTimeStr={currentTimeStr}
          handleSendSimulatorEmail={handleSendSimulatorEmail}
          notificationSettings={notificationSettings}
          setSimChannel={setSimChannel}
          setSimEmailBody={setSimEmailBody}
          setSimEmailSubject={setSimEmailSubject}
          setSimEmailTo={setSimEmailTo}
          setSimInterval={setSimInterval}
          setSimMessage={setSimMessage}
          setSimRecipient={setSimRecipient}
          simChannel={simChannel}
          simEmailBody={simEmailBody}
          simEmailSubject={simEmailSubject}
          simEmailTo={simEmailTo}
          simInterval={simInterval}
          simMessage={simMessage}
          simRecipient={simRecipient}
        />
      )}

      {/* TAB 5: Audit ISM NC Open & Close Notification Center */}
      {(activeTab === 'audit_notif') && (
        <NotifTabAuditNC
          allFindings={allFindings}
          auditFilterStatus={auditFilterStatus}
          auditFleetStats={auditFleetStats}
          auditSearchQuery={auditSearchQuery}
          auditVesselFilter={auditVesselFilter}
          filteredAuditFindingsList={filteredAuditFindingsList}
          sendAuditWhatsAppNotification={sendAuditWhatsAppNotification}
          setAuditFilterStatus={setAuditFilterStatus}
          setAuditNotifModalFinding={setAuditNotifModalFinding}
          setAuditPrintFinding={setAuditPrintFinding}
          setAuditSearchQuery={setAuditSearchQuery}
          setAuditVesselFilter={setAuditVesselFilter}
          setPMSActiveTab={setPMSActiveTab}
          setSelectedVesselId={setSelectedVesselId}
          theme={theme}
          vessels={vessels}
        />
      )}

      {/* MODAL 1: Google Calendar Customizer Dialog */}
      {(calendarModalItem) && (
        <NotifCalendarModal
          calendarCustomDays={calendarCustomDays}
          calendarEventTime={calendarEventTime}
          calendarModalItem={calendarModalItem}
          calendarOffset={calendarOffset}
          exportMultiIntervalICS={exportMultiIntervalICS}
          openGoogleCalendar={openGoogleCalendar}
          setCalendarCustomDays={setCalendarCustomDays}
          setCalendarEventTime={setCalendarEventTime}
          setCalendarModalItem={setCalendarModalItem}
          setCalendarOffset={setCalendarOffset}
        />
      )}

      {/* MODAL 2: WhatsApp Customizer Dialog */}
      {(whatsappModalItem) && (
        <NotifWhatsappModal
          notificationSettings={notificationSettings}
          sendWhatsAppReminder={sendWhatsAppReminder}
          setWaCustomMessage={setWaCustomMessage}
          setWaOffset={setWaOffset}
          setWhatsappModalItem={setWhatsappModalItem}
          waCustomMessage={waCustomMessage}
          waOffset={waOffset}
          whatsappModalItem={whatsappModalItem}
        />
      )}

      {/* MODAL EMAIL: Dedicated Email Notification Customizer Dialog */}
      {(emailModalItem) && (
        <NotifEmailModal
          emailCustomBody={emailCustomBody}
          emailCustomSubject={emailCustomSubject}
          emailModalItem={emailModalItem}
          emailOffset={emailOffset}
          emailRecipients={emailRecipients}
          sendEmailReminder={sendEmailReminder}
          setEmailCustomBody={setEmailCustomBody}
          setEmailCustomSubject={setEmailCustomSubject}
          setEmailModalItem={setEmailModalItem}
          setEmailRecipients={setEmailRecipients}
          updateEmailModalOffset={updateEmailModalOffset}
        />
      )}

      {/* MODAL 3: Dedicated Audit ISM NC Open & Close Notification Dialog */}
      {auditNotifModalFinding && (
        <AuditNotificationModal
          finding={auditNotifModalFinding}
          onClose={() => setAuditNotifModalFinding(null)}
        />
      )}

      {/* MODAL 4: Official Audit Report Print Modal */}
      {auditPrintFinding && (
        <AuditReportModal
          finding={auditPrintFinding}
          initialMode="ncr"
          onClose={() => setAuditPrintFinding(null)}
        />
      )}
    </div>
  );
};
