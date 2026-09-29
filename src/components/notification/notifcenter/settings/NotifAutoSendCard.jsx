/**
 * NotifAutoSendCard.jsx
 * Diekstrak dari NotifTabSettings.jsx (baris 294-406).
 * Sumber: Kartu Mesin Kirim Otomatis (Auto-Send Bot) beserta jam operasional
 */
import React from 'react';
import { Zap } from 'lucide-react';

export const NotifAutoSendCard = ({
  currentTimeStr,
  handleRequestBrowserNotification,
  notificationSettings,
  setTestScheduleTimeNowPlusOneMinute,
  updateAutoSendConfig,
}) => {
  return (
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
  );
};
