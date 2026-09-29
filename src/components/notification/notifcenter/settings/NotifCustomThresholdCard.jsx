/**
 * NotifCustomThresholdCard.jsx
 * Diekstrak dari NotifTabSettings.jsx (baris 124-288).
 * Sumber: Kartu Ambang Batas Kustom: daftar H-N buatan sendiri beserta tambah/hapus
 */
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export const NotifCustomThresholdCard = ({
  handleAddCustomThresholdSubmit,
  newCustDays,
  newCustDesc,
  newCustLabel,
  notificationSettings,
  removeCustomThreshold,
  setNewCustDays,
  setNewCustDesc,
  setNewCustLabel,
  toggleThresholdActive,
  toggleThresholdChannel,
}) => {
  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Plus size={18} color="#38bdf8" />
                          <span>Ambang Batas Kustom (Custom Days)</span>
                        </h4>
                        <span className="badge badge-neutral">Fleksibel</span>
                      </div>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                        Tambahkan jumlah hari khusus sesuai standar operasional PT. Pelayaran Baharimas Kalimantan (contoh: H-14, H-60, H-90, atau lainnya):
                      </p>

                      {/* List of existing custom thresholds */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        {(notificationSettings.customThresholds || []).map((cth) => (
                          <div
                            key={cth.id}
                            style={{
                              padding: '0.85rem 1rem',
                              borderRadius: '8px',
                              background: 'var(--bg-surface-elevated)',
                              border: '1px solid var(--border-subtle)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: '0.5rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <input
                                type="checkbox"
                                checked={cth.enabled}
                                onChange={() => toggleThresholdActive(cth.id, true)}
                                style={{ width: '17px', height: '17px', accentColor: '#0284c7', cursor: 'pointer' }}
                              />
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{cth.label}</div>
                                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{cth.description}</div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={cth.notifyChannels.includes('WhatsApp')}
                                  onChange={() => toggleThresholdChannel(cth.id, 'WhatsApp', true)}
                                  disabled={!cth.enabled}
                                  style={{ accentColor: '#22c55e' }}
                                />
                                <span>WA</span>
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={cth.notifyChannels.includes('Email')}
                                  onChange={() => toggleThresholdChannel(cth.id, 'Email', true)}
                                  disabled={!cth.enabled}
                                  style={{ accentColor: '#0ea5e9' }}
                                />
                                <span style={{ color: '#38bdf8', fontWeight: 600 }}>Email</span>
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={cth.notifyChannels.includes('Google Calendar')}
                                  onChange={() => toggleThresholdChannel(cth.id, 'Google Calendar', true)}
                                  disabled={!cth.enabled}
                                  style={{ accentColor: '#38bdf8' }}
                                />
                                <span>G-Cal</span>
                              </label>

                              <span className="badge badge-neutral mono" style={{ fontSize: '0.72rem' }}>
                                H-{cth.days}
                              </span>

                              <button
                                onClick={() => removeCustomThreshold(cth.id)}
                                className="btn btn-secondary btn-sm"
                                style={{ color: '#ef4444', padding: '0.2rem 0.45rem' }}
                                title="Hapus ambang batas kustom"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Form to Add New Custom Threshold */}
                      <form
                        onSubmit={handleAddCustomThresholdSubmit}
                        style={{
                          padding: '1rem',
                          background: 'rgba(0,0,0,0.2)',
                          borderRadius: '8px',
                          border: '1px dashed var(--border-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem'
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#38bdf8' }}>
                          + Tambah Ambang Batas Kustom Baru
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.75rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                              Jumlah Hari:
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="1825"
                              value={newCustDays}
                              onChange={(e) => {
                                const val = e.target.value;
                                setNewCustDays(val);
                                setNewCustLabel(`H-${val} Hari (Kustom)`);
                              }}
                              className="input-control mono"
                              placeholder="14"
                              required
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                              Label Notifikasi:
                            </label>
                            <input
                              type="text"
                              value={newCustLabel}
                              onChange={(e) => setNewCustLabel(e.target.value)}
                              className="input-control"
                              placeholder="Contoh: H-14 Hari Persiapan Kru"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                            Deskripsi Tujuan Pengingat:
                          </label>
                          <input
                            type="text"
                            value={newCustDesc}
                            onChange={(e) => setNewCustDesc(e.target.value)}
                            className="input-control"
                            placeholder="Contoh: Konfirmasi kesiapan kru dan survey kapal"
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                          <button type="submit" className="btn btn-secondary btn-sm" style={{ color: '#38bdf8' }}>
                            <Plus size={14} />
                            <span>Tambahkan ke Sistem</span>
                          </button>
                        </div>
                      </form>
                    </div>
  );
};
