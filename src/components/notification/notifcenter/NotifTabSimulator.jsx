/**
 * NotifTabSimulator.jsx
 * Diekstrak dari NotificationCenter.jsx (baris 1632-1975).
 * Sumber: Tab 4: simulator pengiriman
 */
import React from 'react';
import { Mail, Send, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';

export const NotifTabSimulator = ({
  currentTimeStr,
  handleSendSimulatorEmail,
  handleSendSimulatorWhatsApp,
  simWaSending = false,
  simWaReport = null,
  notificationSettings,
  setSimChannel,
  setSimEmailBody,
  setSimEmailSubject,
  setSimEmailTo,
  setSimInterval,
  setSimMessage,
  setSimRecipient,
  simChannel,
  simEmailBody,
  simEmailSubject,
  simEmailTo,
  simInterval,
  simMessage,
  simRecipient,
}) => {
  const waGateway = notificationSettings?.autoSend?.whatsappGateway;
  const hasApiKey = Boolean(waGateway?.apiKey);

  return (
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  Simulator Pesan WhatsApp Sesuai Interval
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                  Pilih template nada pesan dan uji coba kirim otomatis via Wablas API Gateway:
                </p>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.3rem 0.65rem',
                borderRadius: '20px',
                background: hasApiKey ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                border: `1px solid ${hasApiKey ? 'rgba(34, 197, 94, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
                fontSize: '0.72rem',
                fontWeight: 700,
                color: hasApiKey ? '#22c55e' : '#eab308'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: hasApiKey ? '#22c55e' : '#eab308' }} />
                <span>{hasApiKey ? `Wablas Siap (${waGateway?.provider || 'API Gateway'})` : 'API Key Belum Ada'}</span>
              </div>
            </div>

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
                Nomor WhatsApp Tujuan (Format: 628... atau 08...)
              </label>
              <input
                type="text"
                value={simRecipient}
                onChange={(e) => setSimRecipient(e.target.value)}
                placeholder="Contoh: 08993507999 atau 628993507999"
                className="input-control mono"
                style={{ fontSize: '0.95rem' }}
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

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.25rem' }}>
              <button
                type="button"
                onClick={() => handleSendSimulatorWhatsApp ? handleSendSimulatorWhatsApp(true) : null}
                disabled={simWaSending}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  padding: '0.7rem 1rem',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  border: 'none',
                  cursor: simWaSending ? 'not-allowed' : 'pointer'
                }}
              >
                {simWaSending ? (
                  <>
                    <span className="spinner-border spinner-border-sm" style={{ width: '1rem', height: '1rem' }} />
                    <span>Mengirim ke Wablas Gateway...</span>
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    <span>⚡ Kirim Otomatis via API Gateway (Wablas)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSendSimulatorWhatsApp ? handleSendSimulatorWhatsApp(false) : () => {
                  const clean = simRecipient.replace(/[^0-9]/g, '');
                  const url = `https://wa.me/${clean}?text=${encodeURIComponent(simMessage)}`;
                  window.open(url, '_blank');
                }}
                className="btn btn-secondary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8rem' }}
              >
                <Send size={14} />
                <span>Buka & Kirim Manual (WhatsApp Web / App)</span>
              </button>
            </div>

            {/* Result report banner */}
            {simWaReport && (
              <div style={{
                padding: '0.85rem',
                borderRadius: '8px',
                background: simWaReport.status?.startsWith('Delivered') ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                border: `1px solid ${simWaReport.status?.startsWith('Delivered') ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                fontSize: '0.78rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, color: simWaReport.status?.startsWith('Delivered') ? '#22c55e' : '#f87171' }}>
                  {simWaReport.status?.startsWith('Delivered') ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                  <span>{simWaReport.status?.startsWith('Delivered') ? 'Pengiriman Berhasil!' : 'Pengiriman Gagal'}</span>
                </div>
                <div style={{ color: 'var(--text-main)', lineHeight: 1.4 }}>
                  {simWaReport.status?.startsWith('Delivered')
                    ? `Pesan WhatsApp berhasil dikirim ke target (+${simWaReport.phone || simRecipient}) via ${simWaReport.channel}. Periksa nomor tujuan.`
                    : `Penyebab: ${simWaReport.status || simWaReport.message}. Jika muncul "need secret key" atau "IP unauthorized", pastikan Secret Key Wablas sudah diisi di menu Developer & API Keys.`}
                </div>
              </div>
            )}
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
  );
};
