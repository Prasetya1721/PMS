import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  BellRing,
  Send,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Sliders,
  History,
  Phone,
  ArrowUpRight,
  ShieldAlert,
  Play,
  Calendar,
  Download,
  CalendarPlus,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';

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
    sendWhatsAppReminder,
    openGoogleCalendar,
    exportH30CalendarICS,
    autoDispatchH30WhatsApp,
    escalateNotification,
    showToast
  } = usePMS();

  const [activeTab, setActiveTab] = useState('h30_automation'); // 'h30_automation' | 'logs' | 'settings' | 'simulator'
  const [testRecipient, setTestRecipient] = useState(crew[0]?.whatsapp || '+6281288991122');
  const [testMessage, setTestMessage] = useState(
    'Yth. Nakhoda & Chief Engineer, berikut ringkasan status PMS harian KM Nusantara Express: 1 Work Order Overdue, 1 Dokumen expired. Harap tindak lanjuti segera.'
  );

  const runDailySchedulerSimulation = () => {
    showToast('Simulasi Cron Job Harian dijalankan: Memindai seluruh tanggal jatuh tempo H-90 s/d H-1...', 'info');

    setTimeout(() => {
      showToast(`Pengecekan selesai! Ditemukan ${h30ExpiringCount} item dalam rentang 30 hari. Bot WhatsApp dan Google Calendar siap!`, 'success');
    }, 1200);
  };

  const handleDirectSendCustomWA = () => {
    const clean = testRecipient.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${clean}?text=${encodeURIComponent(testMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            Pusat Notifikasi, WhatsApp & Google Calendar Sync
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Pengingat otomatis jatuh tempo rentang 1 bulan (H-30), integrasi Google Calendar, dan bot notifikasi WhatsApp resmi
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={runDailySchedulerSimulation}
            className="btn btn-secondary"
            title="Jalankan simulasi cron job 06:00"
          >
            <Play size={16} />
            <span>Simulasi Cek Harian (06:00 WIB)</span>
          </button>
          <button
            onClick={autoDispatchH30WhatsApp}
            className="btn btn-whatsapp"
          >
            <Send size={16} />
            <span>Kirim WA Otomatis (H-30)</span>
          </button>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="glass-card" style={{ padding: '0.75rem 1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('h30_automation')}
          className={`tab-btn ${activeTab === 'h30_automation' ? 'active' : ''}`}
        >
          <Calendar size={16} />
          <span>Otomatisasi H-30 (WA & Google Calendar)</span>
          {h30ExpiringCount > 0 && (
            <span className="badge badge-warning" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
              {h30ExpiringCount}
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
          <span>Konfigurasi Threshold (H-90 s/d H-1)</span>
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`tab-btn ${activeTab === 'simulator' ? 'active' : ''}`}
        >
          <MessageSquare size={16} />
          <span>Simulator Pesan WhatsApp</span>
        </button>
      </div>

      {/* Tab: H-30 Automation & Google Calendar Sync */}
      {activeTab === 'h30_automation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Banner Explanation & Batch Action */}
          <div className="glass-card" style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(15, 28, 53, 0.8) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className="badge badge-warning">Fitur Prioritas Kelaiklautan</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ambang Batas H-30 (1 Bulan)</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                Otomatisasi Peringatan Jatuh Tempo Rentang 1 Bulan
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '750px', marginTop: '0.25rem' }}>
                Sistem secara otomatis mendeteksi seluruh sertifikat kru dan surat legal kapal yang akan kadaluarsa dalam waktu 30 hari ke depan. Peringatan dapat langsung dikirim ke WhatsApp kru/admin dan disinkronkan ke <strong>Google Calendar</strong> sebagai event alarm agar tidak terlewat.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={exportH30CalendarICS} className="btn btn-secondary">
                <Download size={16} />
                <span>Download .ics Google Calendar</span>
              </button>
              <button onClick={autoDispatchH30WhatsApp} className="btn btn-whatsapp">
                <Send size={16} />
                <span>Kirim WA Otomatis Massal</span>
              </button>
            </div>
          </div>

          {/* List of Expiring Items in H-30 Range */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} color="#f59e0b" />
                <span>Daftar Dokumen dalam Rentang 1 Bulan Sebelum Expired ({h30ExpiringItems.length})</span>
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Klik tombol aksi untuk sinkron ke Google Calendar atau kirim WA
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {h30ExpiringItems.map(item => {
                const vessel = vessels.find(v => v.id === item.vesselId);
                const isExpired = item.status === 'Expired' || item.daysUntilExpiry <= 0;
                const isDueSoon = !isExpired && item.daysUntilExpiry <= 30;

                return (
                  <div
                    key={item.id}
                    style={{
                      padding: '1.1rem 1.25rem',
                      borderRadius: '10px',
                      background: 'var(--bg-surface-elevated)',
                      border: isExpired
                        ? '1px solid rgba(239, 68, 68, 0.4)'
                        : '1px solid rgba(245, 158, 11, 0.4)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span className={`badge ${isExpired ? 'badge-danger-pulse' : 'badge-warning'}`}>
                          {isExpired ? `LEWAT ${Math.abs(item.daysUntilExpiry)} HARI` : `H-${item.daysUntilExpiry} HARI LAGI`}
                        </span>
                        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                          {item.crewName ? 'Sertifikat Kru STCW' : 'Surat Legal Kapal'}
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
                        <strong className="mono" style={{ color: isExpired ? '#ef4444' : '#f59e0b' }}>
                          {item.expiryDate}
                        </strong>
                      </p>
                    </div>

                    {/* Action Buttons: Google Calendar + WhatsApp */}
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                      <button
                        onClick={() => openGoogleCalendar(item)}
                        className="btn btn-secondary btn-sm"
                        style={{ border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
                        title="Buka Google Calendar untuk menjadwalkan event reminder"
                      >
                        <CalendarPlus size={15} />
                        <span>+ Google Calendar</span>
                      </button>

                      <button
                        onClick={() => sendWhatsAppReminder(item, item.crewName ? 'crew_cert' : 'ship_doc')}
                        className="btn btn-whatsapp btn-sm"
                        title="Kirim notifikasi peringatan resmi melalui WhatsApp"
                      >
                        <Send size={15} />
                        <span>Kirim WA</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Logs */}
      {activeTab === 'logs' && (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div className="table-container">
            <table className="pms-table">
              <thead>
                <tr>
                  <th>Waktu Terkirim</th>
                  <th>Channel</th>
                  <th>Target Penerima</th>
                  <th>Kapal</th>
                  <th>Perihal / Trigger Item</th>
                  <th>Status Pengiriman</th>
                  <th style={{ textAlign: 'right' }}>Aksi Eskalasi</th>
                </tr>
              </thead>
              <tbody>
                {notificationLogs.map(log => (
                  <tr key={log.id}>
                    <td className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {log.timestamp}
                    </td>
                    <td>
                      <span className={`badge ${log.channel.includes('Calendar') ? 'badge-info' : 'badge-success'}`} style={{ fontSize: '0.7rem' }}>
                        {log.channel}
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
                        log.status === 'Delivered' ? 'badge-success' : 'badge-warning'
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

      {/* Tab 3: Threshold Settings */}
      {activeTab === 'settings' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Aturan Ambang Batas Pengingat (Reminder Threshold Rules)
            </h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Sistem akan otomatis mengevaluasi tanggal kadaluarsa setiap hari pukul 06:00 WIB dan mengirimkan notifikasi pada interval berikut:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {notificationSettings.thresholds.map((th, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <input
                      type="checkbox"
                      defaultChecked={th.enabled}
                      style={{ width: '18px', height: '18px', accentColor: '#0284c7' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{th.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Channel: {th.notifyChannels.join(' • ')}
                      </div>
                    </div>
                  </div>

                  <span className="badge badge-info mono" style={{ fontSize: '0.75rem' }}>
                    T-{th.days} Hari
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Konfigurasi Gateway & Kalender</h4>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Sinkronisasi Kalender
              </label>
              <select className="select-control" defaultValue="Google Calendar">
                <option value="Google Calendar">Google Calendar (Direct Web & .ics)</option>
                <option value="Outlook">Microsoft Outlook 365</option>
                <option value="Apple Calendar">Apple iCal</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Provider WhatsApp Business API
              </label>
              <select className="select-control" defaultValue="Wablas API">
                <option value="Wablas API">Wablas Gateway API (Indonesia)</option>
                <option value="Twilio WhatsApp">Twilio WhatsApp Business API</option>
                <option value="Qontak">Qontak Omnichannel</option>
              </select>
            </div>

            <div style={{ padding: '0.9rem', background: 'rgba(245, 158, 11, 0.12)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div style={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.85rem' }}>Aturan Eskalasi Otomatis</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Jika notifikasi H-7 tidak ditindaklanjuti dalam waktu 3 hari kalender, sistem secara otomatis mengeskalasi peringatan ke Fleet Manager & Direktur Operasional.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Simulator */}
      {activeTab === 'simulator' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Simulator Pesan WhatsApp Langsung</h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Uji coba pengiriman pesan template ke nomor WhatsApp perwira kapal atau staf darat
            </p>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Nomor WhatsApp Tujuan (Format: 628...)
              </label>
              <input
                type="text"
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
                className="input-control mono"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Isi Pesan Notifikasi (Mendukung Markdown WhatsApp: *tebal*, _miring_)
              </label>
              <textarea
                rows="6"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="input-control"
              />
            </div>

            <button
              onClick={handleDirectSendCustomWA}
              className="btn btn-whatsapp"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              <Send size={16} />
              <span>Kirim Melalui WhatsApp Web / App</span>
            </button>
          </div>

          {/* Smartphone WhatsApp Preview */}
          <div className="glass-card" style={{
            padding: '1.5rem',
            background: '#0b141a',
            borderRadius: '24px',
            border: '8px solid #1f2c34',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '420px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}>
            {/* Phone Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid #202c33', paddingBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#00a884', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>
                PMS
              </div>
              <div>
                <div style={{ color: '#e9edef', fontWeight: 700, fontSize: '0.88rem' }}>PMS Kapal Bot (Official)</div>
                <div style={{ color: '#8696a0', fontSize: '0.72rem' }}>Verified Business Account</div>
              </div>
            </div>

            {/* Bubble */}
            <div style={{
              background: '#005c4b',
              color: '#e9edef',
              padding: '0.85rem 1rem',
              borderRadius: '12px 12px 0 12px',
              fontSize: '0.825rem',
              lineHeight: 1.45,
              whiteSpace: 'pre-wrap',
              margin: '1rem 0'
            }}>
              {testMessage}
              <div style={{ textAlign: 'right', fontSize: '0.65rem', color: '#8696a0', marginTop: '0.4rem' }}>
                06:00 WIB ✓✓
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#8696a0' }}>
              Pesan terenkripsi end-to-end melalui WhatsApp Business API
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
