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
  Share2
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
    sendWhatsAppReminder,
    escalateNotification,
    showToast
  } = usePMS();

  const [activeTab, setActiveTab] = useState('logs'); // 'logs' | 'settings' | 'simulator'
  const [testRecipient, setTestRecipient] = useState(crew[0]?.whatsapp || '+6281288991122');
  const [testMessage, setTestMessage] = useState(
    'Yth. Nakhoda & Chief Engineer, berikut ringkasan status PMS harian KM Nusantara Express: 1 Work Order Overdue, 1 Dokumen expired. Harap tindak lanjuti segera.'
  );

  const runDailySchedulerSimulation = () => {
    showToast('Simulasi Cron Job Harian dijalankan: Memindai seluruh tanggal jatuh tempo H-90 s/d H-1...', 'info');

    // Simulate scanning items
    const urgentItems = [
      ...crewCertificates.filter(c => c.status !== 'Active'),
      ...shipDocuments.filter(d => d.status !== 'Active'),
      ...workOrders.filter(w => w.status === 'Overdue')
    ];

    setTimeout(() => {
      showToast(`Pengecekan selesai! Ditemukan ${urgentItems.length} item mendesak. Notifikasi WhatsApp disiapkan.`, 'success');
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
            Pusat Notifikasi & WhatsApp Reminder Bot
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Pengingat otomatis jatuh tempo dokumen (H-90 s/d H-1), bot pesan WhatsApp resmi, dan eskalasi pimpinan
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={runDailySchedulerSimulation}
            className="btn btn-primary"
            title="Jalankan simulasi cron job 06:00"
          >
            <Play size={16} />
            <span>Simulasi Cek Harian (06:00 WIB)</span>
          </button>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="glass-card" style={{ padding: '0.75rem 1.25rem', display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('logs')}
          className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
        >
          <History size={16} />
          <span>Log Riwayat Notifikasi Terkirim ({notificationLogs.length})</span>
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

      {/* Tab 1: Logs */}
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
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
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

      {/* Tab 2: Threshold Settings */}
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
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Konfigurasi Gateway & Eskalasi</h4>

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

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Push Notification Provider
              </label>
              <select className="select-control" defaultValue="Firebase Cloud Messaging">
                <option value="Firebase Cloud Messaging">Firebase Cloud Messaging (FCM)</option>
                <option value="OneSignal">OneSignal Web & Mobile</option>
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

      {/* Tab 3: Simulator */}
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
