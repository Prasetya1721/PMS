/**
 * NotifCenterEngineBanner.jsx
 * Diekstrak dari NotificationCenter.jsx (baris 505-604).
 * Sumber: Banner status auto-send engine & time bar uji cepat
 */
import React from 'react';
import { Radio, Zap } from 'lucide-react';

export const NotifCenterEngineBanner = ({
  notificationSettings,
  setTestScheduleTimeNowPlusOneMinute,
  theme,
  updateAutoSendConfig,
}) => {
  return (
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
  );
};
