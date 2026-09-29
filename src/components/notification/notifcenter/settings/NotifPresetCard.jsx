/**
 * NotifPresetCard.jsx
 * Diekstrak dari NotifTabSettings.jsx (baris 35-121).
 * Sumber: Kartu Pengaturan Ambang Batas Inti: interval 1 Hari/1 Mgg/1 Bln/1 Thn beserta kanal notifikasi
 */
import React from 'react';

export const NotifPresetCard = ({
  notificationSettings,
  toggleThresholdActive,
  toggleThresholdChannel,
}) => {
  return (
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
  );
};
