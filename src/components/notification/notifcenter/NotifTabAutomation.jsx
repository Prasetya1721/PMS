/**
 * NotifTabAutomation.jsx
 * Diekstrak dari NotificationCenter.jsx (baris 665-864).
 * Sumber: Tab 1: automation & daftar dokumen multi-interval
 */
import React from 'react';
import { CalendarPlus, Clock, Mail, Send } from 'lucide-react';

export const NotifTabAutomation = ({
  allExpiringItems,
  filteredItems,
  h1ExpiringCount,
  h30ExpiringCount,
  h365ExpiringCount,
  h7ExpiringCount,
  handleOpenEmailModal,
  selectedIntervalFilter,
  setCalendarModalItem,
  setCalendarOffset,
  setSelectedIntervalFilter,
  setWaCustomMessage,
  setWaOffset,
  setWhatsappModalItem,
  vessels,
}) => {
  return (
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
  );
};
