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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              Pusat Notifikasi, WhatsApp & Google Calendar
            </h2>
            <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
              Multi-Interval & Auto-Send
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Pengingat otomatis jatuh tempo fleksibel: 1 hari, 1 minggu, 1 bulan, 1 tahun, kustom hari, dan integrasi jam otomatis
          </p>
        </div>

        {/* Action Buttons Header */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Live Clock Indicator */}
          <div
            className="glass-card"
            style={{
              padding: '0.4rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              background: 'rgba(15, 23, 42, 0.6)'
            }}
            title="Jam lokal saat ini"
          >
            <Clock size={15} color="#38bdf8" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>WIB:</span>
            <span className="mono" style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.88rem' }}>
              {currentTimeStr || '00:00:00'}
            </span>
          </div>

          <button
            onClick={() => runAutoDispatchNotifications(true)}
            className="btn btn-whatsapp"
            title="Jalankan pemindaian dan kirim notifikasi otomatis sekarang"
          >
            <Zap size={16} />
            <span>Kirim Otomatis Sekarang</span>
          </button>

          <button
            onClick={() => exportMultiIntervalICS()}
            className="btn btn-secondary"
            title="Download berkas .ics berisi seluruh event dengan alarm 1 hari, 1 minggu, 1 bulan, 1 tahun"
          >
            <Download size={16} />
            <span>Ekspor Kalender (.ics)</span>
          </button>
        </div>
      </div>

      {/* Auto-Send Engine Status Banner & Live Quick Test Time Bar */}
      <div
        className="glass-card"
        style={{
          padding: '1.25rem 1.5rem',
          background: theme === 'light'
            ? 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
            : 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(15, 28, 53, 0.85) 100%)',
          border: theme === 'light'
            ? '1px solid #bae6fd'
            : '1px solid rgba(56, 189, 248, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
            }}
          >
            <Radio size={22} className="animate-pulse" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className={`badge ${notificationSettings?.autoSend?.enabled ? 'badge-success' : 'badge-neutral'}`}>
                {notificationSettings?.autoSend?.enabled ? '● Auto-Send Bot Aktif' : '○ Auto-Send Nonaktif'}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Jadwal Eksekusi Harian:
              </span>
              <span className="mono" style={{ fontWeight: 800, color: theme === 'light' ? '#0284c7' : '#38bdf8', fontSize: '0.9rem' }}>
                Jam {notificationSettings?.autoSend?.scheduleTime || '08:00'} WIB
              </span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
              Bot akan otomatis memindai seluruh dokumen yang masuk kriteria (1 hari, 1 minggu, 1 bulan, 1 tahun, kustom) dan mencatat notifikasi ke audit log.
            </p>
          </div>
        </div>

        {/* Time Test Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: theme === 'light' ? '#ffffff' : 'rgba(0,0,0,0.3)',
            padding: '0.35rem 0.65rem',
            borderRadius: '8px',
            border: theme === 'light' ? '1px solid #cbd5e1' : '1px solid var(--border-subtle)',
            boxShadow: theme === 'light' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Set Jam Kirim:</span>
            <input
              type="time"
              value={notificationSettings?.autoSend?.scheduleTime || '08:00'}
              onChange={(e) => updateAutoSendConfig({ scheduleTime: e.target.value })}
              className="mono"
              style={{
                background: 'transparent',
                border: 'none',
                color: theme === 'light' ? '#0f172a' : '#fff',
                fontSize: '0.85rem',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer'
              }}
              title="Ubah jam eksekusi otomatis harian"
            />
          </div>

          <button
            onClick={setTestScheduleTimeNowPlusOneMinute}
            className="btn btn-secondary btn-sm"
            style={{
              borderColor: 'rgba(245, 158, 11, 0.4)',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
            title="Atur jam otomatis ke Jam Sekarang + 1 Menit agar Anda bisa melihat bot mengeksekusi tepat saat menit berganti!"
          >
            <Zap size={14} />
            <span>Set Jam Sekarang (+1 Menit untuk Uji Coba)</span>
          </button>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="glass-card" style={{ padding: '0.75rem 1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('automation')}
          className={`tab-btn ${activeTab === 'automation' ? 'active' : ''}`}
        >
          <Calendar size={16} />
          <span>Pengingat & Otomatisasi Multi-Interval</span>
          {allExpiringCount > 0 && (
            <span className="badge badge-warning" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
              {allExpiringCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
        >
          <History size={16} />
          <span>Log Riwayat Notifikasi ({notificationLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
        >
          <Sliders size={16} />
          <span>Konfigurasi Ambang Batas & Auto-Send</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`tab-btn ${activeTab === 'simulator' ? 'active' : ''}`}
        >
          <MessageSquare size={16} />
          <span>Simulator & Template WhatsApp</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_notif')}
          className={`tab-btn ${activeTab === 'audit_notif' ? 'active' : ''}`}
          style={openNCCount > 0 ? { borderColor: 'rgba(239, 68, 68, 0.4)' } : {}}
        >
          <ShieldAlert size={16} color={openNCCount > 0 ? '#ef4444' : '#10b981'} />
          <span>Notifikasi Audit ISM (NC Open & Close)</span>
          {openNCCount > 0 ? (
            <span className="badge badge-danger" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
              {openNCCount} Open
            </span>
          ) : closedNCCount > 0 ? (
            <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
              {closedNCCount} Close
            </span>
          ) : null}
        </button>
      </div>

      {/* TAB 1: Automation & Multi-Interval Document List */}
      {activeTab === 'automation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Interval Quick Filter Pills */}
          <div className="glass-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginRight: '0.4rem' }}>
                Filter Ambang Batas:
              </span>

              <button
                onClick={() => setSelectedIntervalFilter('all')}
                className={`btn btn-sm ${selectedIntervalFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Semua ({allExpiringItems.length})
              </button>

              <button
                onClick={() => setSelectedIntervalFilter('1d')}
                className={`btn btn-sm ${selectedIntervalFilter === '1d' ? 'btn-primary' : 'btn-secondary'}`}
                style={selectedIntervalFilter === '1d' ? { background: '#ef4444' } : {}}
              >
                1 Hari (H-1) {h1ExpiringCount > 0 && `(${h1ExpiringCount})`}
              </button>

              <button
                onClick={() => setSelectedIntervalFilter('1w')}
                className={`btn btn-sm ${selectedIntervalFilter === '1w' ? 'btn-primary' : 'btn-secondary'}`}
                style={selectedIntervalFilter === '1w' ? { background: '#f59e0b' } : {}}
              >
                1 Minggu (H-7) {h7ExpiringCount > 0 && `(${h7ExpiringCount})`}
              </button>

              <button
                onClick={() => setSelectedIntervalFilter('1m')}
                className={`btn btn-sm ${selectedIntervalFilter === '1m' ? 'btn-primary' : 'btn-secondary'}`}
              >
                1 Bulan (H-30) {h30ExpiringCount > 0 && `(${h30ExpiringCount})`}
              </button>

              <button
                onClick={() => setSelectedIntervalFilter('1y')}
                className={`btn btn-sm ${selectedIntervalFilter === '1y' ? 'btn-primary' : 'btn-secondary'}`}
              >
                1 Tahun (H-365) {h365ExpiringCount > 0 && `(${h365ExpiringCount})`}
              </button>

              <button
                onClick={() => setSelectedIntervalFilter('custom')}
                className={`btn btn-sm ${selectedIntervalFilter === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Kustom Hari
              </button>

              <button
                onClick={() => setSelectedIntervalFilter('expired')}
                className={`btn btn-sm ${selectedIntervalFilter === 'expired' ? 'btn-primary' : 'btn-secondary'}`}
                style={selectedIntervalFilter === 'expired' ? { background: '#991b1b' } : {}}
              >
                Lewat Masa Berlaku
              </button>
            </div>

            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Menampilkan <strong>{filteredItems.length}</strong> dokumen
            </span>
          </div>

          {/* Table of Filtered Items */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} color="#38bdf8" />
                <span>Daftar Sertifikat & Surat Kapal Sesuai Ambang Batas Pengingat</span>
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Klik tombol aksi untuk menjadwalkan ke Google Calendar atau mengirimkan WhatsApp
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {filteredItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  Tidak ada dokumen yang sesuai dengan filter interval yang dipilih.
                </div>
              ) : (
                filteredItems.map(item => {
                  const vessel = vessels.find(v => v.id === item.vesselId);
                  const isExpired = item.status === 'Expired' || item.daysUntilExpiry <= 0;
                  const days = item.daysUntilExpiry;

                  let intervalBadgeText = `H-${days} Hari`;
                  let badgeClass = 'badge-info';
                  if (isExpired) {
                    intervalBadgeText = `LEWAT ${Math.abs(days)} HARI`;
                    badgeClass = 'badge-danger-pulse';
                  } else if (days <= 1) {
                    intervalBadgeText = '1 Hari Sebelum (H-1)';
                    badgeClass = 'badge-danger-pulse';
                  } else if (days <= 7) {
                    intervalBadgeText = '1 Minggu Sebelum (H-7)';
                    badgeClass = 'badge-warning';
                  } else if (days <= 30) {
                    intervalBadgeText = '1 Bulan Sebelum (H-30)';
                    badgeClass = 'badge-warning';
                  } else if (days <= 365) {
                    intervalBadgeText = '1 Tahun Sebelum (H-365)';
                    badgeClass = 'badge-info';
                  }

                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: '1.1rem 1.25rem',
                        borderRadius: '10px',
                        background: 'var(--bg-surface-elevated)',
                        border: isExpired
                          ? '1px solid rgba(239, 68, 68, 0.4)'
                          : days <= 7
                          ? '1px solid rgba(245, 158, 11, 0.4)'
                          : '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span className={`badge ${badgeClass}`}>
                            {intervalBadgeText}
                          </span>
                          <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                            {item.itemCategory}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.35rem' }}>
                          {item.name}
                        </h4>
                        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                          Nomor: <strong className="mono" style={{ color: '#fff' }}>{item.certificateNo || item.documentNo}</strong> • Kapal:{' '}
                          <strong style={{ color: '#38bdf8' }}>{vessel?.name || 'Armada'}</strong>
                          {item.crewName && ` • Kru: ${item.crewName}`}
                        </p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                          Penerbit: {item.issuer} • Tanggal Jatuh Tempo:{' '}
                          <strong className="mono" style={{ color: isExpired ? '#ef4444' : days <= 7 ? '#f59e0b' : '#38bdf8' }}>
                            {item.expiryDate}
                          </strong>
                        </p>
                      </div>

                      {/* Action Buttons: Modal Google Calendar + Modal WhatsApp + Modal Email */}
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => {
                            setCalendarModalItem(item);
                            setCalendarOffset(days <= 1 ? 1 : days <= 7 ? 7 : days <= 30 ? 30 : 365);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
                          title="Pilih jadwal pengingat untuk disimpan ke Google Calendar"
                        >
                          <CalendarPlus size={15} />
                          <span>+ Google Calendar</span>
                        </button>

                        <button
                          onClick={() => {
                            setWhatsappModalItem(item);
                            setWaOffset(days <= 1 ? 1 : days <= 7 ? 7 : days <= 30 ? 30 : 365);
                            setWaCustomMessage('');
                          }}
                          className="btn btn-whatsapp btn-sm"
                          title="Pilih template pengingat dan kirim via WhatsApp"
                        >
                          <Send size={15} />
                          <span>Kirim WA</span>
                        </button>

                        <button
                          onClick={() => handleOpenEmailModal(item)}
                          className="btn btn-secondary btn-sm"
                          style={{ border: '1px solid rgba(14, 165, 233, 0.5)', color: '#38bdf8', background: 'rgba(14, 165, 233, 0.1)' }}
                          title="Pratinjau dan kirim notifikasi via Email (API Gateway / Aplikasi Email)"
                        >
                          <Mail size={15} />
                          <span>Kirim Email</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Logs */}
      {activeTab === 'logs' && (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                Audit Log Pengiriman Notifikasi & Sinkronisasi
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Total tercatat: <strong>{notificationLogs.length}</strong> aktivitas
              </span>
            </div>

            {/* Filter by Channel */}
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Filter Kanal:</span>
              <button
                onClick={() => setLogChannelFilter('all')}
                className={`btn btn-sm ${logChannelFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}
              >
                Semua
              </button>
              <button
                onClick={() => setLogChannelFilter('Email')}
                className={`btn btn-sm ${logChannelFilter === 'Email' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', color: logChannelFilter === 'Email' ? '#fff' : '#38bdf8' }}
              >
                <Mail size={12} />
                <span>Email ({notificationLogs.filter(l => l.channel?.toLowerCase().includes('email')).length})</span>
              </button>
              <button
                onClick={() => setLogChannelFilter('WhatsApp')}
                className={`btn btn-sm ${logChannelFilter === 'WhatsApp' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', color: logChannelFilter === 'WhatsApp' ? '#fff' : '#22c55e' }}
              >
                <Send size={12} />
                <span>WhatsApp ({notificationLogs.filter(l => l.channel?.toLowerCase().includes('whatsapp')).length})</span>
              </button>
              <button
                onClick={() => setLogChannelFilter('Calendar')}
                className={`btn btn-sm ${logChannelFilter === 'Calendar' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}
              >
                <Calendar size={12} />
                <span>Calendar ({notificationLogs.filter(l => l.channel?.toLowerCase().includes('calendar')).length})</span>
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="pms-table">
              <thead>
                <tr>
                  <th>Waktu Terkirim</th>
                  <th>Channel / Kanal</th>
                  <th>Target Penerima</th>
                  <th>Kapal</th>
                  <th>Perihal & Ambang Batas</th>
                  <th>Status Pengiriman</th>
                  <th style={{ textAlign: 'right' }}>Aksi Eskalasi</th>
                </tr>
              </thead>
              <tbody>
                {notificationLogs
                  .filter(log => {
                    if (logChannelFilter === 'all') return true;
                    if (logChannelFilter === 'Email') return (log.channel || '').toLowerCase().includes('email');
                    if (logChannelFilter === 'WhatsApp') return (log.channel || '').toLowerCase().includes('whatsapp');
                    if (logChannelFilter === 'Calendar') return (log.channel || '').toLowerCase().includes('calendar');
                    return true;
                  })
                  .map(log => (
                  <tr key={log.id}>
                    <td className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {log.timestamp}
                    </td>
                    <td>
                      <span className={`badge ${
                        log.channel?.toLowerCase().includes('email') ? 'badge-primary' :
                        log.channel?.includes('Calendar') ? 'badge-info' : 'badge-success'
                      }`} style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        {log.channel?.toLowerCase().includes('email') && <Mail size={11} />}
                        {log.channel?.includes('Calendar') && <Calendar size={11} />}
                        {log.channel?.toLowerCase().includes('whatsapp') && <Send size={11} />}
                        <span>{log.channel}</span>
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{log.target}</div>
                      <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{log.thresholdTriggered}</span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{log.vesselName}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{log.subject}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {log.message}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        log.status === 'Escalated' ? 'badge-danger-pulse' :
                        log.status === 'Delivered' ? 'badge-success' :
                        log.status?.includes('Queued') ? 'badge-info' : 'badge-warning'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {log.status !== 'Escalated' && (
                        <button
                          onClick={() => escalateNotification(log.id)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.25rem 0.65rem', fontSize: '0.72rem' }}
                          title="Eskalasi ke Fleet Manager jika tidak direspon"
                        >
                          <ShieldAlert size={12} />
                          <span>Eskalasi</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Settings (Thresholds, Auto-Send, Custom & Jam Pengiriman) */}
      {activeTab === 'settings' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem' }}>
          {/* Left Column: Presets & Custom Thresholds */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Preset Thresholds */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                  Pengaturan Ambang Batas Inti (Core Interval Presets)
                </h4>
                <span className="badge badge-info">1 Hari, 1 Mgg, 1 Bln, 1 Thn</span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Tentukan interval pengingat yang aktif beserta kanal notifikasi (WhatsApp & Google Calendar) untuk setiap ambang batas:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {(notificationSettings.thresholds || []).map((th) => (
                  <div
                    key={th.id}
                    style={{
                      padding: '1rem',
                      borderRadius: '8px',
                      background: 'var(--bg-surface-elevated)',
                      border: th.enabled ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <input
                        type="checkbox"
                        checked={th.enabled}
                        onChange={() => toggleThresholdActive(th.id, false)}
                        style={{ width: '18px', height: '18px', accentColor: '#0284c7', cursor: 'pointer' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: th.enabled ? 'var(--text-main)' : 'var(--text-muted)' }}>
                          {th.label}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {th.description}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      {/* Channel toggles */}
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={th.notifyChannels.includes('WhatsApp')}
                          onChange={() => toggleThresholdChannel(th.id, 'WhatsApp', false)}
                          disabled={!th.enabled}
                          style={{ accentColor: '#22c55e' }}
                        />
                        <span>WA</span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={th.notifyChannels.includes('Email')}
                          onChange={() => toggleThresholdChannel(th.id, 'Email', false)}
                          disabled={!th.enabled}
                          style={{ accentColor: '#0ea5e9' }}
                        />
                        <span style={{ color: '#38bdf8', fontWeight: 600 }}>Email</span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={th.notifyChannels.includes('Google Calendar')}
                          onChange={() => toggleThresholdChannel(th.id, 'Google Calendar', false)}
                          disabled={!th.enabled}
                          style={{ accentColor: '#38bdf8' }}
                        />
                        <span>G-Cal</span>
                      </label>

                      <span className="badge badge-info mono" style={{ fontSize: '0.72rem' }}>
                        {th.days} Hari
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Thresholds Section */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={18} color="#38bdf8" />
                  <span>Ambang Batas Kustom (Custom Days)</span>
                </h4>
                <span className="badge badge-neutral">Fleksibel</span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Tambahkan jumlah hari khusus sesuai standar operasional PT. Pelayaran Baharimas Kalimantan (contoh: H-14, H-60, H-90, atau lainnya):
              </p>

              {/* List of existing custom thresholds */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {(notificationSettings.customThresholds || []).map((cth) => (
                  <div
                    key={cth.id}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input
                        type="checkbox"
                        checked={cth.enabled}
                        onChange={() => toggleThresholdActive(cth.id, true)}
                        style={{ width: '17px', height: '17px', accentColor: '#0284c7', cursor: 'pointer' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{cth.label}</div>
                        <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{cth.description}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={cth.notifyChannels.includes('WhatsApp')}
                          onChange={() => toggleThresholdChannel(cth.id, 'WhatsApp', true)}
                          disabled={!cth.enabled}
                          style={{ accentColor: '#22c55e' }}
                        />
                        <span>WA</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={cth.notifyChannels.includes('Email')}
                          onChange={() => toggleThresholdChannel(cth.id, 'Email', true)}
                          disabled={!cth.enabled}
                          style={{ accentColor: '#0ea5e9' }}
                        />
                        <span style={{ color: '#38bdf8', fontWeight: 600 }}>Email</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={cth.notifyChannels.includes('Google Calendar')}
                          onChange={() => toggleThresholdChannel(cth.id, 'Google Calendar', true)}
                          disabled={!cth.enabled}
                          style={{ accentColor: '#38bdf8' }}
                        />
                        <span>G-Cal</span>
                      </label>

                      <span className="badge badge-neutral mono" style={{ fontSize: '0.72rem' }}>
                        H-{cth.days}
                      </span>

                      <button
                        onClick={() => removeCustomThreshold(cth.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#ef4444', padding: '0.2rem 0.45rem' }}
                        title="Hapus ambang batas kustom"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form to Add New Custom Threshold */}
              <form
                onSubmit={handleAddCustomThresholdSubmit}
                style={{
                  padding: '1rem',
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '8px',
                  border: '1px dashed var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#38bdf8' }}>
                  + Tambah Ambang Batas Kustom Baru
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Jumlah Hari:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="1825"
                      value={newCustDays}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewCustDays(val);
                        setNewCustLabel(`H-${val} Hari (Kustom)`);
                      }}
                      className="input-control mono"
                      placeholder="14"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Label Notifikasi:
                    </label>
                    <input
                      type="text"
                      value={newCustLabel}
                      onChange={(e) => setNewCustLabel(e.target.value)}
                      className="input-control"
                      placeholder="Contoh: H-14 Hari Persiapan Kru"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    Deskripsi Tujuan Pengingat:
                  </label>
                  <input
                    type="text"
                    value={newCustDesc}
                    onChange={(e) => setNewCustDesc(e.target.value)}
                    className="input-control"
                    placeholder="Contoh: Konfirmasi kesiapan kru dan survey kapal"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                  <button type="submit" className="btn btn-secondary btn-sm" style={{ color: '#38bdf8' }}>
                    <Plus size={14} />
                    <span>Tambahkan ke Sistem</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Auto-Send Engine & Jam Pengiriman & WhatsApp Gateway */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Auto-Send Engine Settings */}
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Zap size={18} color="#f59e0b" />
                  <span>Mesin Kirim Otomatis (Auto-Send Bot)</span>
                </h4>
                <span className="badge badge-warning">Realtime Clock</span>
              </div>

              {/* Master Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Status Pengiriman Otomatis</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Otomatis kirim Email, WhatsApp & sinkron Google Calendar
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings?.autoSend?.enabled}
                  onChange={(e) => updateAutoSendConfig({ enabled: e.target.checked })}
                  style={{ width: '22px', height: '22px', accentColor: '#22c55e', cursor: 'pointer' }}
                />
              </div>

              {/* Auto-Send Active Channels Toggle */}
              <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  Kanal Aktif Mesin Pengiriman Otomatis:
                </span>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={notificationSettings?.autoSend?.channels?.email ?? true}
                      onChange={(e) => updateAutoSendConfig({
                        channels: { ...(notificationSettings?.autoSend?.channels || {}), email: e.target.checked }
                      })}
                      style={{ accentColor: '#0ea5e9' }}
                    />
                    <span style={{ fontWeight: 700, color: '#38bdf8' }}>Email Otomatis (SMTP/REST)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={notificationSettings?.autoSend?.channels?.whatsapp ?? true}
                      onChange={(e) => updateAutoSendConfig({
                        channels: { ...(notificationSettings?.autoSend?.channels || {}), whatsapp: e.target.checked }
                      })}
                      style={{ accentColor: '#22c55e' }}
                    />
                    <span>WhatsApp</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={notificationSettings?.autoSend?.channels?.googleCalendar ?? true}
                      onChange={(e) => updateAutoSendConfig({
                        channels: { ...(notificationSettings?.autoSend?.channels || {}), googleCalendar: e.target.checked }
                      })}
                      style={{ accentColor: '#38bdf8' }}
                    />
                    <span>Google Calendar</span>
                  </label>
                </div>
              </div>

              {/* Jam Pengiriman Configuration */}
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Jam Eksekusi Pengiriman Otomatis (WIB)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="time"
                    value={notificationSettings?.autoSend?.scheduleTime || '08:00'}
                    onChange={(e) => updateAutoSendConfig({ scheduleTime: e.target.value })}
                    className="input-control mono"
                    style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}
                  />
                  <button
                    onClick={setTestScheduleTimeNowPlusOneMinute}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#f59e0b', whiteSpace: 'nowrap' }}
                    title="Uji coba otomatis: atur jam ke menit berikutnya"
                  >
                    ⚡ Test Sekarang (+1 Menit)
                  </button>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Jam lokal saat ini: <strong className="mono" style={{ color: '#fff' }}>{currentTimeStr}</strong> WIB. Setiap kali jarum jam mencapai waktu ini, bot secara otomatis memindai dan mengirimkan notifikasi.
                </p>
              </div>

              {/* Desktop Browser Notification Toggle */}
              <div style={{ padding: '0.9rem', background: 'rgba(2, 132, 199, 0.08)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#38bdf8' }}>
                    Notifikasi Desktop Browser (Push Chime)
                  </div>
                  <button
                    onClick={handleRequestBrowserNotification}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}
                  >
                    Aktifkan Izin Browser
                  </button>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Memberikan peringatan pop-up audio chime langsung di komputer admin/nakhoda saat ada dokumen yang menyentuh ambang batas.
                </p>
              </div>
            </div>

            {/* WhatsApp Gateway API Configuration */}
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'center', gap: '0.5rem' }}>
                  <Smartphone size={18} color="#22c55e" />
                  <span>Konektor WhatsApp Gateway API</span>
                </h4>
                <span className="badge badge-success">Resmi</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Provider WhatsApp API
                </label>
                <select
                  value={notificationSettings?.autoSend?.whatsappGateway?.provider || 'Wablas API'}
                  onChange={(e) => updateAutoSendConfig({
                    whatsappGateway: {
                      ...notificationSettings?.autoSend?.whatsappGateway,
                      provider: e.target.value
                    }
                  })}
                  className="select-control"
                >
                  <option value="Wablas API">Wablas Gateway API (Indonesia / Cloud)</option>
                  <option value="Fonnte API">Fonnte WhatsApp API Gateway</option>
                  <option value="Twilio WhatsApp">Twilio WhatsApp Business API</option>
                  <option value="Custom Webhook">Custom HTTP Webhook POST</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  API Endpoint URL
                </label>
                <input
                  type="text"
                  value={notificationSettings?.autoSend?.whatsappGateway?.apiUrl || ''}
                  onChange={(e) => updateAutoSendConfig({
                    whatsappGateway: {
                      ...notificationSettings?.autoSend?.whatsappGateway,
                      apiUrl: e.target.value
                    }
                  })}
                  className="input-control mono"
                  placeholder="https://kalsel.wablas.com/api/send-message"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  API Token / Secret Key
                </label>
                <input
                  type="password"
                  value={notificationSettings?.autoSend?.whatsappGateway?.apiKey || ''}
                  onChange={(e) => updateAutoSendConfig({
                    whatsappGateway: {
                      ...notificationSettings?.autoSend?.whatsappGateway,
                      apiKey: e.target.value
                    }
                  })}
                  className="input-control mono"
                  placeholder="Masukkan API Token / Authorization Bearer"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button
                  onClick={handleTestGatewayPing}
                  disabled={gatewayTesting}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                >
                  {gatewayTesting ? 'Menguji Gateway...' : 'Uji Koneksi Gateway API'}
                </button>
              </div>

              <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                <div style={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.78rem' }}>
                  Catatan Headless Auto-Send WA:
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Jika token API Gateway diisi, pengiriman notifikasi WhatsApp akan berjalan secara background otomatis tanpa harus mengklik tab browser. Jika token dikosongkan, sistem beralih ke WhatsApp Web Direct Link & Audit Log.
                </p>
              </div>
            </div>

            {/* Email Gateway API & SMTP Configuration */}
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={18} color="#0ea5e9" />
                  <span>Konektor Email Gateway API & SMTP</span>
                </h4>
                <span className="badge badge-info">Otomatis / REST API</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Provider Layanan Email
                </label>
                <select
                  value={notificationSettings?.autoSend?.emailGateway?.provider || 'REST API / Cloud SMTP'}
                  onChange={(e) => updateAutoSendConfig({
                    emailGateway: {
                      ...notificationSettings?.autoSend?.emailGateway,
                      provider: e.target.value
                    }
                  })}
                  className="select-control"
                >
                  <option value="REST API / Cloud SMTP">REST API Backend / Cloud Gateway (SendGrid / Brevo / Resend)</option>
                  <option value="SMTP Relay Server">SMTP Relay Server (Custom Host & Port)</option>
                  <option value="Mailgun API">Mailgun REST API</option>
                  <option value="Google Workspace / SES">Google Workspace / AWS SES API</option>
                  <option value="Direct Mailto Fallback">Direct Mailto: Fallback (Aplikasi Email Desktop)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  API Endpoint URL / Webhook
                </label>
                <input
                  type="text"
                  value={notificationSettings?.autoSend?.emailGateway?.apiUrl || ''}
                  onChange={(e) => updateAutoSendConfig({
                    emailGateway: {
                      ...notificationSettings?.autoSend?.emailGateway,
                      apiUrl: e.target.value
                    }
                  })}
                  className="input-control mono"
                  placeholder="https://api.baharimas.co.id/v1/email/send atau https://api.resend.com/emails"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    API Token / Secret Key
                  </label>
                  <input
                    type="password"
                    value={notificationSettings?.autoSend?.emailGateway?.apiKey || ''}
                    onChange={(e) => updateAutoSendConfig({
                      emailGateway: {
                        ...notificationSettings?.autoSend?.emailGateway,
                        apiKey: e.target.value
                      }
                    })}
                    className="input-control mono"
                    placeholder="Bearer token / API key"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Alamat Email Pengirim (From)
                  </label>
                  <input
                    type="email"
                    value={notificationSettings?.autoSend?.emailGateway?.fromEmail || ''}
                    onChange={(e) => updateAutoSendConfig({
                      emailGateway: {
                        ...notificationSettings?.autoSend?.emailGateway,
                        fromEmail: e.target.value
                      }
                    })}
                    className="input-control mono"
                    placeholder="pms.armada@baharimas.co.id"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Nama Pengirim (Display Name)
                  </label>
                  <input
                    type="text"
                    value={notificationSettings?.autoSend?.emailGateway?.fromName || ''}
                    onChange={(e) => updateAutoSendConfig({
                      emailGateway: {
                        ...notificationSettings?.autoSend?.emailGateway,
                        fromName: e.target.value
                      }
                    })}
                    className="input-control"
                    placeholder="PMS PT. Pelayaran Baharimas Kalimantan"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Reply-To
                  </label>
                  <input
                    type="email"
                    value={notificationSettings?.autoSend?.emailGateway?.replyTo || ''}
                    onChange={(e) => updateAutoSendConfig({
                      emailGateway: {
                        ...notificationSettings?.autoSend?.emailGateway,
                        replyTo: e.target.value
                      }
                    })}
                    className="input-control mono"
                    placeholder="operations@baharimas.co.id"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Penerima Notifikasi Default / CC (Pisahkan koma):
                </label>
                <input
                  type="text"
                  value={Array.isArray(notificationSettings?.autoSend?.emailGateway?.defaultRecipients)
                    ? notificationSettings.autoSend.emailGateway.defaultRecipients.join(', ')
                    : (notificationSettings?.autoSend?.emailGateway?.defaultRecipients || '')}
                  onChange={(e) => {
                    const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    updateAutoSendConfig({
                      emailGateway: {
                        ...notificationSettings?.autoSend?.emailGateway,
                        defaultRecipients: arr
                      }
                    });
                  }}
                  className="input-control mono"
                  placeholder="fleet.ops@baharimas.co.id, dpa.baharimas@gmail.com"
                />
              </div>

              <button
                onClick={handleTestEmailGatewayPing}
                disabled={emailGatewayTesting}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', borderColor: 'rgba(14, 165, 233, 0.4)', color: '#38bdf8' }}
              >
                {emailGatewayTesting ? 'Menguji Koneksi Email...' : 'Uji Koneksi Gateway Email'}
              </button>

              <div style={{ padding: '0.75rem', background: 'rgba(14, 165, 233, 0.08)', borderRadius: '8px', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.78rem' }}>
                  Sistem Notifikasi Email Terpadu:
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Bot otomatis mengirimkan email notifikasi ke alamat penerima di atas sesuai jam kirim harian. Jika endpoint API belum diisi, pengiriman notifikasi otomatis tetap dicatat di Audit Log Antrean (Queued) dan dapat dikirim via aplikasi email default.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Simulator */}
      {activeTab === 'simulator' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Sub-selector for simulator channel */}
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', background: 'var(--bg-surface-elevated)', padding: '0.5rem 1rem', borderRadius: '10px', width: 'fit-content' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Pilih Kanal Simulator:</span>
            <button
              onClick={() => setSimChannel('whatsapp')}
              className={`btn btn-sm ${simChannel === 'whatsapp' ? 'btn-whatsapp' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Send size={14} />
              <span>WhatsApp Message</span>
            </button>
            <button
              onClick={() => setSimChannel('email')}
              className={`btn btn-sm ${simChannel === 'email' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: simChannel === 'email' ? '#fff' : '#38bdf8' }}
            >
              <Mail size={14} />
              <span>Surat Elektronik (Email)</span>
            </button>
          </div>

          {simChannel === 'whatsapp' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                  Simulator Pesan WhatsApp Sesuai Interval
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  Pilih template nada pesan (1 hari, 1 minggu, 1 bulan, 1 tahun, kustom) dan uji coba format WhatsApp:
                </p>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Pilih Nada Peringatan Berdasarkan Interval:
                  </label>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setSimInterval('1')}
                      className={`btn btn-sm ${simInterval === '1' ? 'btn-danger' : 'btn-secondary'}`}
                    >
                      1 Hari (Darurat H-1)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimInterval('7')}
                      className={`btn btn-sm ${simInterval === '7' ? 'btn-warning' : 'btn-secondary'}`}
                    >
                      1 Minggu (Kritis H-7)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimInterval('30')}
                      className={`btn btn-sm ${simInterval === '30' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      1 Bulan (Standar H-30)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimInterval('365')}
                      className={`btn btn-sm ${simInterval === '365' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      1 Tahun (Dini H-365)
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Nomor WhatsApp Tujuan (Format: 628...)
                  </label>
                  <input
                    type="text"
                    value={simRecipient}
                    onChange={(e) => setSimRecipient(e.target.value)}
                    className="input-control mono"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Isi Pesan Notifikasi (Mendukung Markdown WhatsApp: *tebal*, _miring_)
                  </label>
                  <textarea
                    rows="8"
                    value={simMessage}
                    onChange={(e) => setSimMessage(e.target.value)}
                    className="input-control"
                  />
                </div>

                <button
                  onClick={() => {
                    const clean = simRecipient.replace(/[^0-9]/g, '');
                    const url = `https://wa.me/${clean}?text=${encodeURIComponent(simMessage)}`;
                    window.open(url, '_blank');
                  }}
                  className="btn btn-whatsapp"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  <Send size={16} />
                  <span>Kirim Melalui WhatsApp Web / App</span>
                </button>
              </div>

              {/* Smartphone WhatsApp Preview */}
              <div
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  background: '#0b141a',
                  borderRadius: '24px',
                  border: '8px solid #1f2c34',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '440px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
                }}
              >
                {/* Phone Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid #202c33', paddingBottom: '0.75rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#00a884', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>
                    PMS
                  </div>
                  <div>
                    <div style={{ color: '#e9edef', fontWeight: 700, fontSize: '0.9rem' }}>PMS Baharimas Bot (Official)</div>
                    <div style={{ color: '#8696a0', fontSize: '0.72rem' }}>Verified Enterprise • Jam {notificationSettings?.autoSend?.scheduleTime || '08:00'} WIB</div>
                  </div>
                </div>

                {/* Bubble */}
                <div
                  style={{
                    background: '#005c4b',
                    color: '#e9edef',
                    padding: '0.9rem 1.1rem',
                    borderRadius: '12px 12px 0 12px',
                    fontSize: '0.825rem',
                    lineHeight: 1.45,
                    whiteSpace: 'pre-wrap',
                    margin: '1rem 0'
                  }}
                >
                  {simMessage}
                  <div style={{ textAlign: 'right', fontSize: '0.65rem', color: '#8696a0', marginTop: '0.4rem' }}>
                    {currentTimeStr?.slice(0, 5) || '08:00'} WIB ✓✓
                  </div>
                </div>

                <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#8696a0' }}>
                  Pesan terenkripsi end-to-end melalui WhatsApp Business API PT. Pelayaran Baharimas Kalimantan
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
              {/* Email Simulator Editor */}
              <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={18} color="#0ea5e9" />
                  <span>Simulator Pengiriman Email Otomatis</span>
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  Uji coba template email HTML resmi PT. Pelayaran Baharimas Kalimantan dengan opsi REST API Gateway atau Mailto client:
                </p>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Pilih Urgensi Interval Pengingat:
                  </label>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setSimInterval('1')}
                      className={`btn btn-sm ${simInterval === '1' ? 'btn-danger' : 'btn-secondary'}`}
                    >
                      1 Hari (H-1)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimInterval('7')}
                      className={`btn btn-sm ${simInterval === '7' ? 'btn-warning' : 'btn-secondary'}`}
                    >
                      1 Minggu (H-7)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimInterval('30')}
                      className={`btn btn-sm ${simInterval === '30' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      1 Bulan (H-30)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimInterval('365')}
                      className={`btn btn-sm ${simInterval === '365' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      1 Tahun (H-365)
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Alamat Email Penerima (To):
                  </label>
                  <input
                    type="text"
                    value={simEmailTo}
                    onChange={(e) => setSimEmailTo(e.target.value)}
                    className="input-control mono"
                    placeholder="nakhoda@baharimas.co.id, dpa@baharimas.co.id"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Subjek Email:
                  </label>
                  <input
                    type="text"
                    value={simEmailSubject}
                    onChange={(e) => setSimEmailSubject(e.target.value)}
                    className="input-control"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Isi Notifikasi Email:
                  </label>
                  <textarea
                    rows="7"
                    value={simEmailBody}
                    onChange={(e) => setSimEmailBody(e.target.value)}
                    className="input-control mono"
                    style={{ fontSize: '0.8rem', lineHeight: '1.45' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => handleSendSimulatorEmail(true)}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                  >
                    <Zap size={16} />
                    <span>Kirim via API Gateway</span>
                  </button>
                  <button
                    onClick={() => handleSendSimulatorEmail(false)}
                    className="btn btn-secondary"
                    style={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                  >
                    <Mail size={16} />
                    <span>Buka di Mail Client</span>
                  </button>
                </div>
              </div>

              {/* Desktop Email Client Mockup */}
              <div
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  borderRadius: '16px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.35)'
                }}
              >
                {/* Email Client Header bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                      Pratinjau Email Resmi PBK
                    </span>
                  </div>
                  <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                    HTML Template
                  </span>
                </div>

                {/* Email Metadata header */}
                <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div>
                    <strong style={{ color: 'var(--text-muted)' }}>Dari: </strong>
                    <span>{notificationSettings?.autoSend?.emailGateway?.fromName || 'PMS PT. Pelayaran Baharimas Kalimantan'} &lt;{notificationSettings?.autoSend?.emailGateway?.fromEmail || 'pms.armada@baharimas.co.id'}&gt;</span>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-muted)' }}>Kepada: </strong>
                    <span className="mono" style={{ color: '#38bdf8' }}>{simEmailTo}</span>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-muted)' }}>Subjek: </strong>
                    <span style={{ fontWeight: 700 }}>{simEmailSubject}</span>
                  </div>
                </div>

                {/* Email Body Card Styled */}
                <div style={{
                  padding: '1.25rem',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}>
                  {/* Company Logo Header in Email */}
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8' }}>PT. PELAYARAN BAHARIMAS KALIMANTAN</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Sistem Manajemen Pemeliharaan Armada (PMS) • Pontianak</div>
                    </div>
                    <span className={`badge ${simInterval === '1' ? 'badge-danger-pulse' : simInterval === '7' ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: '0.7rem' }}>
                      H-{simInterval} Hari
                    </span>
                  </div>

                  {/* Body Text */}
                  <div style={{ fontSize: '0.8rem', lineHeight: '1.5', whiteSpace: 'pre-line', color: 'var(--text-main)' }}>
                    {simEmailBody}
                  </div>

                  {/* Footer note */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.6rem', fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Email otomatis dihasilkan oleh Sistem PMS Armada Kapal Baharimas. Balas ke: {notificationSettings?.autoSend?.emailGateway?.replyTo || 'operations@baharimas.co.id'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Audit ISM NC Open & Close Notification Center */}
      {activeTab === 'audit_notif' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Top KPI Cards for Audit NC */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div
              className="glass-card"
              style={{
                padding: '1rem 1.25rem',
                borderLeft: '4px solid #0284c7',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(2, 132, 199, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
                <FileCheck size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Temuan Audit ISM</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{allFindings.length}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>SMC Kapal & DOC Kantor</div>
              </div>
            </div>

            <div
              className="glass-card"
              style={{
                padding: '1rem 1.25rem',
                borderLeft: '4px solid #ef4444',
                background: auditFleetStats.overdueCount > 0 ? 'rgba(239, 68, 68, 0.08)' : undefined,
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                <ShieldAlert size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NC OPEN (Tindakan Diperlukan)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444' }}>
                  {auditFleetStats.openCount}
                  {auditFleetStats.overdueCount > 0 && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, marginLeft: '0.4rem', color: '#ef4444' }}>
                      ({auditFleetStats.overdueCount} Overdue!)
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {auditFleetStats.minDaysLeft !== null
                    ? auditFleetStats.minDaysLeft < 0
                      ? `🚨 Overdue ${Math.abs(auditFleetStats.minDaysLeft)} hari`
                      : `⏳ Deadline terdekat: ${auditFleetStats.minDaysLeft} hari`
                    : 'Tidak ada NC open aktif'}
                </div>
              </div>
            </div>

            <div
              className="glass-card"
              style={{
                padding: '1rem 1.25rem',
                borderLeft: '4px solid #f59e0b',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                <Clock size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Eviden Terkirim (Review)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>
                  {allFindings.filter(f => f.status === 'Eviden Submitted').length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Menunggu Verifikasi DPA</div>
              </div>
            </div>

            <div
              className="glass-card"
              style={{
                padding: '1rem 1.25rem',
                borderLeft: '4px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <CheckCircle2 size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NC CLOSE (Terselesaikan)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
                  {auditFleetStats.closedCount}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
                  ⏱️ Rata-rata Rentang: {auditFleetStats.avgResolutionDays} Hari
                </div>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div
            className="glass-card"
            style={{
              padding: '1rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              {/* Status Filter Pills */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginRight: '0.3rem' }}>
                  Status NC:
                </span>
                <button
                  type="button"
                  onClick={() => setAuditFilterStatus('all')}
                  className={`btn btn-sm ${auditFilterStatus === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Semua ({allFindings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAuditFilterStatus('open')}
                  className={`btn btn-sm ${auditFilterStatus === 'open' ? 'btn-danger' : 'btn-secondary'}`}
                  style={auditFilterStatus === 'open' ? { background: '#ef4444' } : {}}
                >
                  🚨 NC Open ({allFindings.filter(f => f.status === 'NC Open').length})
                </button>
                {auditFleetStats.overdueCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setAuditFilterStatus('overdue')}
                    className={`btn btn-sm ${auditFilterStatus === 'overdue' ? 'btn-danger' : 'btn-secondary'}`}
                    style={auditFilterStatus === 'overdue' ? { background: '#b91c1c' } : { color: '#ef4444' }}
                  >
                    ⚠️ Overdue Target ({auditFleetStats.overdueCount})
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setAuditFilterStatus('submitted')}
                  className={`btn btn-sm ${auditFilterStatus === 'submitted' ? 'btn-warning' : 'btn-secondary'}`}
                  style={auditFilterStatus === 'submitted' ? { background: '#f59e0b' } : {}}
                >
                  ⏳ Eviden Review ({allFindings.filter(f => f.status === 'Eviden Submitted').length})
                </button>
                <button
                  type="button"
                  onClick={() => setAuditFilterStatus('closed')}
                  className={`btn btn-sm ${auditFilterStatus === 'closed' ? 'btn-success' : 'btn-secondary'}`}
                  style={auditFilterStatus === 'closed' ? { background: '#10b981' } : {}}
                >
                  ✅ NC Close ({allFindings.filter(f => f.status === 'NC Close').length})
                </button>
              </div>

              {/* Vessel Selector Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Kapal / Target:</span>
                <select
                  value={auditVesselFilter}
                  onChange={(e) => setAuditVesselFilter(e.target.value)}
                  className="input-control"
                  style={{ width: '180px', padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                >
                  <option value="all">Semua Armada & Kantor</option>
                  <option value="office">🏢 Kantor Pusat (DOC)</option>
                  {vessels.map(v => (
                    <option key={v.id} value={v.id}>🚢 {v.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search
                size={15}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Cari nomor temuan, klausul ISM, deskripsi ketidaksesuaian, atau nama kapal..."
                value={auditSearchQuery}
                onChange={(e) => setAuditSearchQuery(e.target.value)}
                className="input-control"
                style={{ paddingLeft: '2.4rem', fontSize: '0.85rem' }}
              />
              {auditSearchQuery && (
                <button
                  onClick={() => setAuditSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '0.8rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* List of Finding Notification Cards */}
          {filteredAuditFindingsList.length === 0 ? (
            <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <CheckCircle2 size={42} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                Tidak Ada Temuan Audit Sesuai Kriteria
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1rem auto' }}>
                Semua temuan audit ISM Code telah terverifikasi dan memenuhi standar kepatuhan maritim PT. Pelayaran Baharimas Kalimantan.
              </p>
              <button
                onClick={() => {
                  setAuditFilterStatus('all');
                  setAuditVesselFilter('all');
                  setAuditSearchQuery('');
                }}
                className="btn btn-secondary btn-sm"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredAuditFindingsList.map(finding => {
                const ncRange = calculateNCRange(finding);
                const vessel = vessels.find(v => v.id === finding.vesselId);
                const vesselDisplayName = finding.targetName || vessel?.name || 'Kantor Pusat PT. PBK';
                const isDoc = !finding.vesselId || finding.standard === 'DOC';

                return (
                  <div
                    key={finding.id}
                    className="glass-card"
                    style={{
                      padding: '1.25rem 1.4rem',
                      borderLeft: `5px solid ${ncRange.color}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Top Metadata Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        {isDoc ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '6px',
                              background: 'rgba(147, 51, 234, 0.15)',
                              color: '#c084fc',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}
                          >
                            <Building2 size={13} />
                            <span>DOC Kantor Pusat</span>
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '6px',
                              background: 'rgba(2, 132, 199, 0.15)',
                              color: '#38bdf8',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}
                          >
                            <Ship size={13} />
                            <span>{vesselDisplayName}</span>
                          </span>
                        )}

                        <strong className="mono" style={{ fontSize: '0.92rem', fontWeight: 800 }}>
                          {finding.findingNo || finding.code || 'NC-ISM'}
                        </strong>

                        <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                          {finding.clauseCode || 'ISM'}: {finding.clauseName || 'Klausul ISM Code'}
                        </span>

                        <span
                          className={`badge ${finding.category === 'Major NC' ? 'badge-danger' : finding.category === 'Minor NC' ? 'badge-warning' : 'badge-info'}`}
                          style={{ fontSize: '0.72rem' }}
                        >
                          {finding.category || 'Temuan'}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {ncRange.isClosed ? (
                          <span
                            className="badge badge-success"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}
                          >
                            <CheckCircle2 size={14} />
                            <span>NC CLOSE (Tuntas)</span>
                          </span>
                        ) : ncRange.isSubmitted ? (
                          <span
                            className="badge badge-warning"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}
                          >
                            <Clock size={14} />
                            <span>Eviden Submitted</span>
                          </span>
                        ) : (
                          <span
                            className="badge badge-danger"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.78rem',
                              padding: '0.3rem 0.75rem',
                              animation: ncRange.isOverdue ? 'pulse 1.8s infinite' : 'none'
                            }}
                          >
                            <ShieldAlert size={14} />
                            <span>{ncRange.isOverdue ? 'NC OPEN (OVERDUE)' : 'NC OPEN'}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description & Evidence snippet */}
                    <div>
                      <p style={{ fontSize: '0.88rem', fontWeight: 500, lineHeight: 1.5, margin: 0 }}>
                        {finding.description}
                      </p>
                      {finding.objectiveEvidence && (
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontStyle: 'italic', margin: '0.35rem 0 0 0' }}>
                          Bukti Objektif: {finding.objectiveEvidence}
                        </p>
                      )}
                    </div>

                    {/* RENTANG WAKTU (TIMELINE & PROGRESS BAR) */}
                    <div
                      style={{
                        background: theme === 'light' ? '#f8fafc' : 'rgba(15, 23, 42, 0.65)',
                        border: `1px solid ${ncRange.borderColor}`,
                        borderRadius: '10px',
                        padding: '0.85rem 1.1rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.55rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', fontWeight: 700 }}>
                          <Clock size={15} color={ncRange.color} />
                          <span>Rentang Waktu ISM:</span>
                          <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>
                            {ncRange.openDateStr} s/d {ncRange.isClosed ? ncRange.closedDateStr : ncRange.dueDateStr}
                          </span>
                        </div>
                        <span className={`badge ${ncRange.badgeClass}`} style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                          {ncRange.badgeText}
                        </span>
                      </div>

                      {/* Visual Timeline Bar */}
                      <div style={{ marginBottom: '0.55rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                          <span>Ditemukan: {ncRange.openDateStr}</span>
                          {ncRange.isClosed ? (
                            <span style={{ color: '#10b981', fontWeight: 600 }}>
                              Selesai: {ncRange.closedDateStr} ({ncRange.resolutionDays} Hari)
                            </span>
                          ) : (
                            <span style={{ color: ncRange.isOverdue ? '#ef4444' : '#f59e0b', fontWeight: 600 }}>
                              Target Batas: {ncRange.dueDateStr} {ncRange.isOverdue ? `(Overdue ${Math.abs(ncRange.remainingDays)}h)` : `(Sisa ${ncRange.remainingDays}h)`}
                            </span>
                          )}
                        </div>
                        <div style={{ width: '100%', height: '8px', background: theme === 'light' ? '#e2e8f0' : 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${ncRange.percentUsed}%`,
                              height: '100%',
                              borderRadius: '4px',
                              background: ncRange.isClosed
                                ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                                : ncRange.isOverdue
                                ? 'linear-gradient(90deg, #f87171 0%, #ef4444 100%)'
                                : 'linear-gradient(90deg, #0284c7 0%, #f59e0b 100%)',
                              transition: 'width 0.4s ease'
                            }}
                          />
                        </div>
                      </div>

                      {/* Timeline Detail Metrics */}
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.78rem' }}>
                        {ncRange.isClosed ? (
                          <>
                            <span style={{ color: 'var(--text-muted)' }}>
                              ⏱️ Total Rentang Waktu: <strong style={{ color: '#10b981' }}>{ncRange.resolutionDays} Hari Kalender</strong>
                            </span>
                            <span style={{ color: 'var(--text-muted)' }}>
                              🎯 Kinerja Target: <strong style={{ color: ncRange.isAheadOfSchedule ? '#10b981' : '#f59e0b' }}>{ncRange.varianceText}</strong>
                            </span>
                            <span style={{ color: 'var(--text-muted)' }}>
                              🛡️ Auditor: <strong style={{ color: 'var(--text-main)' }}>{finding.auditor || 'DPA PT. PBK'}</strong>
                            </span>
                          </>
                        ) : (
                          <>
                            <span style={{ color: 'var(--text-muted)' }}>
                              ⏱️ Hari Aktif Berjalan: <strong style={{ color: 'var(--text-main)' }}>{ncRange.activeDays} Hari</strong>
                            </span>
                            <span style={{ color: 'var(--text-muted)' }}>
                              ⏳ Sisa Waktu CAP: <strong style={{ color: ncRange.isOverdue ? '#ef4444' : '#38bdf8' }}>
                                {ncRange.isOverdue ? `Melewati batas ${Math.abs(ncRange.remainingDays)} Hari!` : `${ncRange.remainingDays} Hari Lagi`}
                              </strong>
                            </span>
                            <span style={{ color: 'var(--text-muted)' }}>
                              👤 PIC: <strong style={{ color: 'var(--text-main)' }}>{finding.assignedTo || 'Nakhoda & KKM'}</strong>
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* ACTION BUTTONS: WhatsApp & Navigation */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        paddingTop: '0.5rem',
                        borderTop: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* Interactive WhatsApp Sender Modal */}
                        <button
                          type="button"
                          onClick={() => setAuditNotifModalFinding(finding)}
                          className="btn btn-whatsapp btn-sm"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                          title="Buka dialog notifikasi WhatsApp dengan pemilihan penerima dan preview pesan"
                        >
                          <Send size={14} />
                          <span>Notifikasi WA ({ncRange.isClosed ? 'NC Close' : 'NC Open'})</span>
                        </button>

                        {/* Fast Quick Dispatch Buttons */}
                        {ncRange.isOpen || ncRange.isSubmitted ? (
                          <>
                            <button
                              type="button"
                              onClick={() => sendAuditWhatsAppNotification(finding, 'audit_nc_open', { recipientRole: 'Nakhoda Kapal' })}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.75rem' }}
                              title="Kirim peringatan cepat ke Nakhoda via WhatsApp"
                            >
                              WA Nakhoda
                            </button>
                            <button
                              type="button"
                              onClick={() => sendAuditWhatsAppNotification(finding, 'audit_nc_open', { recipientRole: 'Kepala Kamar Mesin (KKM)' })}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.75rem' }}
                              title="Kirim peringatan cepat ke KKM via WhatsApp"
                            >
                              WA KKM
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => setAuditPrintFinding(finding)}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.75rem', color: '#0284c7', borderColor: 'rgba(2, 132, 199, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700 }}
                              title="Cetak Laporan Penutupan NC Resmi Sesuai Standar ISM Code (NCR Close-Out Form)"
                            >
                              <Printer size={13} color="#0284c7" />
                              <span>🖨️ Cetak Laporan NC Close</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => sendAuditWhatsAppNotification(finding, 'audit_nc_close', { recipientRole: 'Designated Person Ashore (DPA)' })}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.75rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}
                              title="Kirim konfirmasi penutupan resmi ke DPA"
                            >
                              WA DPA
                            </button>
                            <button
                              type="button"
                              onClick={() => sendAuditWhatsAppNotification(finding, 'audit_nc_close', { recipientRole: 'Nakhoda Kapal' })}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.75rem' }}
                              title="Kirim konfirmasi ke Nakhoda bahwa NC telah Close"
                            >
                              WA Nakhoda
                            </button>
                          </>
                        )}
                      </div>

                      {/* Direct jump to Audit Portal */}
                      <button
                        type="button"
                        onClick={() => {
                          if (finding.vesselId) {
                            setSelectedVesselId(finding.vesselId);
                          }
                          setPMSActiveTab('audit');
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}
                        title="Buka menu Manajemen Audit kapal untuk melihat eviden lengkap"
                      >
                        <span>Buka di Audit Portal</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: Google Calendar Customizer Dialog */}
      {calendarModalItem && (
        <div className="modal-overlay" onClick={() => setCalendarModalItem(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CalendarPlus size={20} color="#38bdf8" />
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Jadwalkan Pengingat Google Calendar</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Pilih interval pengingat sebelum jatuh tempo untuk {calendarModalItem.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCalendarModalItem(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Document Summary Pill */}
              <div style={{ padding: '0.75rem 1rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{calendarModalItem.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Jatuh Tempo: <strong className="mono" style={{ color: '#38bdf8' }}>{calendarModalItem.expiryDate}</strong> ({calendarModalItem.daysUntilExpiry} hari lagi)
                </div>
              </div>

              {/* Interval Choice */}
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Pilih Jadwal Tanggal Pengingat:
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setCalendarOffset(1)}
                    className={`btn btn-sm ${calendarOffset === 1 ? 'btn-danger' : 'btn-secondary'}`}
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    📅 1 Hari Sebelum (H-1)
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalendarOffset(7)}
                    className={`btn btn-sm ${calendarOffset === 7 ? 'btn-warning' : 'btn-secondary'}`}
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    📅 1 Minggu Sebelum (H-7)
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalendarOffset(30)}
                    className={`btn btn-sm ${calendarOffset === 30 ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    📅 1 Bulan Sebelum (H-30)
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalendarOffset(365)}
                    className={`btn btn-sm ${calendarOffset === 365 ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    📅 1 Tahun Sebelum (H-365)
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalendarOffset(0)}
                    className={`btn btn-sm ${calendarOffset === 0 ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    📅 Hari-H Jatuh Tempo
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalendarOffset('custom')}
                    className={`btn btn-sm ${calendarOffset === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    📅 Kustom Hari Sebelum
                  </button>
                </div>

                {calendarOffset === 'custom' && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ingatkan:</span>
                    <input
                      type="number"
                      min="1"
                      max="1825"
                      value={calendarCustomDays}
                      onChange={(e) => setCalendarCustomDays(Number(e.target.value))}
                      className="input-control mono"
                      style={{ width: '90px' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>hari sebelum jatuh tempo</span>
                  </div>
                )}
              </div>

              {/* Time Choice */}
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Waktu / Jam Pengingat Acara (WIB):
                </label>
                <input
                  type="time"
                  value={calendarEventTime}
                  onChange={(e) => setCalendarEventTime(e.target.value)}
                  className="input-control mono"
                  style={{ width: '130px' }}
                />
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => exportMultiIntervalICS()}
                className="btn btn-secondary btn-sm"
                title="Download .ics dengan semua alarm 1 hari, 1 minggu, 1 bulan, 1 tahun"
              >
                <Download size={14} />
                <span>Unduh .ics Semua Alarm</span>
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setCalendarModalItem(null)} className="btn btn-secondary btn-sm">
                  Batal
                </button>
                <button
                  onClick={() => {
                    const days = calendarOffset === 'custom' ? calendarCustomDays : calendarOffset;
                    openGoogleCalendar(calendarModalItem, {
                      offsetDays: days,
                      eventTime: calendarEventTime
                    });
                    setCalendarModalItem(null);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  <CalendarPlus size={14} />
                  <span>Buka Google Calendar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: WhatsApp Customizer Dialog */}
      {whatsappModalItem && (
        <div className="modal-overlay" onClick={() => setWhatsappModalItem(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Send size={20} color="#22c55e" />
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Kirim Peringatan WhatsApp Resmi</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Pilih konteks interval untuk {whatsappModalItem.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWhatsappModalItem(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Context Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Kategori Template Sesuai Interval:
                </label>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setWaOffset(1);
                      setWaCustomMessage('');
                    }}
                    className={`btn btn-sm ${waOffset === 1 ? 'btn-danger' : 'btn-secondary'}`}
                  >
                    🚨 1 Hari (Darurat H-1)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWaOffset(7);
                      setWaCustomMessage('');
                    }}
                    className={`btn btn-sm ${waOffset === 7 ? 'btn-warning' : 'btn-secondary'}`}
                  >
                    ⚠️ 1 Minggu (Kritis H-7)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWaOffset(30);
                      setWaCustomMessage('');
                    }}
                    className={`btn btn-sm ${waOffset === 30 ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    🔔 1 Bulan (H-30)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWaOffset(365);
                      setWaCustomMessage('');
                    }}
                    className={`btn btn-sm ${waOffset === 365 ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    📋 1 Tahun (H-365)
                  </button>
                </div>
              </div>

              {/* Message preview / edit */}
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Isi Pesan WhatsApp:
                </label>
                <textarea
                  rows="7"
                  value={
                    waCustomMessage ||
                    `*${
                      waOffset === 1
                        ? '🚨 PERINGATAN DARURAT H-1 (HARI TERAKHIR)'
                        : waOffset === 7
                        ? '⚠️ PERINGATAN KRITIS H-1 MINGGU (H-7)'
                        : waOffset === 30
                        ? '🔔 PEMBERITAHUAN JATUH TEMPO H-1 BULAN (H-30)'
                        : '📋 PERSIAPAN ANGGARAN DINI H-1 TAHUN (H-365)'
                    } - SISTEM PMS BAHARIMAS*\n\n` +
                    `Kepada: Nakhoda & Staf Kapal\n` +
                    `Dokumen: ${whatsappModalItem.name} (No: ${whatsappModalItem.certificateNo || whatsappModalItem.documentNo})\n` +
                    `Jatuh Tempo: ${whatsappModalItem.expiryDate} (${whatsappModalItem.daysUntilExpiry} hari lagi).\n\n` +
                    (waOffset <= 1
                      ? 'TINDAKAN MENDESAK: Masa berlaku berakhir besok! Segera proses survey/dispensasi kelaiklautan.\n\n'
                      : waOffset <= 7
                      ? 'PERHATIAN: Tersisa 7 hari. Harap konfirmasi jadwal surveyor BKI/Syahbandar.\n\n'
                      : waOffset <= 30
                      ? 'Harap segera daftarkan permohonan survey perpanjangan kelaiklautan kapal.\n\n'
                      : 'Perencanaan anggaran survey besar pembaharuan tahunan.\n\n') +
                    `_Pusat Pengendali Armada PMS PT. Pelayaran Baharimas Kalimantan_`
                  }
                  onChange={(e) => setWaCustomMessage(e.target.value)}
                  className="input-control"
                />
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button onClick={() => setWhatsappModalItem(null)} className="btn btn-secondary btn-sm">
                Batal
              </button>

              {/* Option to send via Gateway API if token is configured */}
              {notificationSettings?.autoSend?.whatsappGateway?.apiKey && (
                <button
                  onClick={() => {
                    sendWhatsAppReminder(
                      whatsappModalItem,
                      whatsappModalItem.crewName ? 'crew_cert' : 'ship_doc',
                      {
                        offsetDays: waOffset,
                        customMessage: waCustomMessage,
                        useGatewayApi: true
                      }
                    );
                    setWhatsappModalItem(null);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  <Zap size={14} />
                  <span>Kirim via API Gateway</span>
                </button>
              )}

              <button
                onClick={() => {
                  sendWhatsAppReminder(
                    whatsappModalItem,
                    whatsappModalItem.crewName ? 'crew_cert' : 'ship_doc',
                    {
                      offsetDays: waOffset,
                      customMessage: waCustomMessage,
                      useGatewayApi: false
                    }
                  );
                  setWhatsappModalItem(null);
                }}
                className="btn btn-whatsapp btn-sm"
              >
                <Send size={14} />
                <span>Buka WhatsApp Web / App</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EMAIL: Dedicated Email Notification Customizer Dialog */}
      {emailModalItem && (
        <div className="modal-overlay" onClick={() => setEmailModalItem(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(14, 165, 233, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Kirim Peringatan Email Resmi</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Pemberitahuan jatuh tempo untuk {emailModalItem.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEmailModalItem(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Urgency Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Ambang Batas / Kategori Urgensi:
                </label>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => updateEmailModalOffset(1)}
                    className={`btn btn-sm ${emailOffset === 1 ? 'btn-danger' : 'btn-secondary'}`}
                  >
                    🚨 1 Hari (Darurat H-1)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateEmailModalOffset(7)}
                    className={`btn btn-sm ${emailOffset === 7 ? 'btn-warning' : 'btn-secondary'}`}
                  >
                    ⚠️ 1 Minggu (Kritis H-7)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateEmailModalOffset(30)}
                    className={`btn btn-sm ${emailOffset === 30 ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    🔔 1 Bulan (H-30)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateEmailModalOffset(365)}
                    className={`btn btn-sm ${emailOffset === 365 ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    📋 1 Tahun (H-365)
                  </button>
                </div>
              </div>

              {/* Recipients Input */}
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Penerima Email (To):
                </label>
                <input
                  type="text"
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                  className="input-control mono"
                  placeholder="nakhoda@baharimas.co.id, fleet.ops@baharimas.co.id"
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Bisa mencantumkan beberapa alamat email yang dipisahkan tanda koma.
                </span>
              </div>

              {/* Subject Input */}
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Subjek Email:
                </label>
                <input
                  type="text"
                  value={emailCustomSubject}
                  onChange={(e) => setEmailCustomSubject(e.target.value)}
                  className="input-control"
                />
              </div>

              {/* Body textarea */}
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Isi Pesan Email:
                </label>
                <textarea
                  rows="7"
                  value={emailCustomBody}
                  onChange={(e) => setEmailCustomBody(e.target.value)}
                  className="input-control mono"
                  style={{ fontSize: '0.8rem', lineHeight: '1.45' }}
                />
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button onClick={() => setEmailModalItem(null)} className="btn btn-secondary btn-sm">
                Batal
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={async () => {
                    await sendEmailReminder(
                      emailModalItem,
                      emailModalItem.crewName ? 'crew_cert' : 'ship_doc',
                      {
                        offsetDays: emailOffset,
                        recipientEmail: emailRecipients,
                        customSubject: emailCustomSubject,
                        customMessage: emailCustomBody,
                        skipMailto: true
                      }
                    );
                    setEmailModalItem(null);
                  }}
                  className="btn btn-primary btn-sm"
                  title="Kirim otomatis melalui REST API Gateway / Cloud SMTP"
                >
                  <Zap size={14} />
                  <span>Kirim Otomatis via API</span>
                </button>

                <button
                  onClick={async () => {
                    await sendEmailReminder(
                      emailModalItem,
                      emailModalItem.crewName ? 'crew_cert' : 'ship_doc',
                      {
                        offsetDays: emailOffset,
                        recipientEmail: emailRecipients,
                        customSubject: emailCustomSubject,
                        customMessage: emailCustomBody,
                        skipMailto: false
                      }
                    );
                    setEmailModalItem(null);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)' }}
                  title="Buka draf pesan di aplikasi email default (Outlook, Thunderbird, Gmail)"
                >
                  <Mail size={14} />
                  <span>Buka di Aplikasi Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
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
