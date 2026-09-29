/**
 * DocTrackerCalendarModal.jsx
 * Diekstrak dari DocumentTracker.jsx (baris 666-812).
 * Sumber: Modal penjadwalan ke Google Calendar beserta pilihan interval pengingat
 */
import React from 'react';
import { CalendarPlus, Download, X } from 'lucide-react';

export const DocTrackerCalendarModal = ({
  calCustomDays,
  calModalDoc,
  calOffset,
  calTime,
  exportMultiIntervalICS,
  openGoogleCalendar,
  setCalCustomDays,
  setCalModalDoc,
  setCalOffset,
  setCalTime,
}) => {
  return (
    <div className="modal-overlay" onClick={() => setCalModalDoc(null)}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
                <div className="modal-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <CalendarPlus size={20} color="#38bdf8" />
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Jadwalkan ke Google Calendar</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Pilih waktu & interval pengingat untuk: {calModalDoc.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCalModalDoc(null)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div style={{ padding: '0.75rem 1rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{calModalDoc.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Jatuh Tempo: <strong className="mono" style={{ color: '#38bdf8' }}>{calModalDoc.expiryDate}</strong> ({calModalDoc.daysUntilExpiry} hari lagi)
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      Pilih Jadwal Pengingat:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setCalOffset(1)}
                        className={`btn btn-sm ${calOffset === 1 ? 'btn-danger' : 'btn-secondary'}`}
                        style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                      >
                        📅 1 Hari Sebelum (H-1)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalOffset(7)}
                        className={`btn btn-sm ${calOffset === 7 ? 'btn-warning' : 'btn-secondary'}`}
                        style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                      >
                        📅 1 Minggu Sebelum (H-7)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalOffset(30)}
                        className={`btn btn-sm ${calOffset === 30 ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                      >
                        📅 1 Bulan Sebelum (H-30)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalOffset(365)}
                        className={`btn btn-sm ${calOffset === 365 ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                      >
                        📅 1 Tahun Sebelum (H-365)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalOffset(0)}
                        className={`btn btn-sm ${calOffset === 0 ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                      >
                        📅 Hari-H Jatuh Tempo
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalOffset('custom')}
                        className={`btn btn-sm ${calOffset === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                      >
                        📅 Kustom Hari
                      </button>
                    </div>

                    {calOffset === 'custom' && (
                      <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ingatkan:</span>
                        <input
                          type="number"
                          min="1"
                          max="1825"
                          value={calCustomDays}
                          onChange={(e) => setCalCustomDays(Number(e.target.value))}
                          className="input-control mono"
                          style={{ width: '90px' }}
                        />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>hari sebelum jatuh tempo</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Waktu / Jam Pengingat (WIB):
                    </label>
                    <input
                      type="time"
                      value={calTime}
                      onChange={(e) => setCalTime(e.target.value)}
                      className="input-control mono"
                      style={{ width: '130px' }}
                    />
                  </div>
                </div>

                <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    onClick={() => exportMultiIntervalICS()}
                    className="btn btn-secondary btn-sm"
                  >
                    <Download size={14} />
                    <span>Unduh .ics Semua Alarm</span>
                  </button>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => setCalModalDoc(null)} className="btn btn-secondary btn-sm">
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        const days = calOffset === 'custom' ? calCustomDays : calOffset;
                        openGoogleCalendar(calModalDoc, {
                          offsetDays: days,
                          eventTime: calTime
                        });
                        setCalModalDoc(null);
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
  );
};
