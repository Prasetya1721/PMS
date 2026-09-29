/**
 * NotifCenterHeader.jsx
 * Diekstrak dari NotificationCenter.jsx (baris 447-502).
 * Sumber: Header utama modul pusat notifikasi
 */
import React from 'react';
import { Clock, Download, Zap } from 'lucide-react';

export const NotifCenterHeader = ({
  currentTimeStr,
  exportMultiIntervalICS,
  runAutoDispatchNotifications,
}) => {
  return (
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
  );
};
