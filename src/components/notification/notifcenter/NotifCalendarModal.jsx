/**
 * NotifCalendarModal.jsx
 * Diekstrak dari NotificationCenter.jsx (baris 2533-2689).
 * Sumber: Modal kalender / pilih tanggal kirim
 */
import React from 'react';
import { CalendarPlus, Download, X } from 'lucide-react';

export const NotifCalendarModal = ({
  calendarCustomDays,
  calendarEventTime,
  calendarModalItem,
  calendarOffset,
  exportMultiIntervalICS,
  openGoogleCalendar,
  setCalendarCustomDays,
  setCalendarEventTime,
  setCalendarModalItem,
  setCalendarOffset,
}) => {
  return (
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
  );
};
