/**
 * TabForm.jsx
 * Diekstrak dari SiteSettingsAdmin.jsx (baris 989-1131).
 * Sumber: TAB 3: panel kanan form
 */
import React from 'react';

export const TabForm = ({
  formData,
  handleChange,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Judul Form:</label>
                        <input
                          type="text"
                          value={formData.formTitle || ''}
                          onChange={e => handleChange('formTitle', e.target.value)}
                          placeholder="Masuk ke Portal PMS"
                          className="input-control"
                          style={{ fontSize: '0.85rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Teks Tombol Masuk:</label>
                        <input
                          type="text"
                          value={formData.buttonText || ''}
                          onChange={e => handleChange('buttonText', e.target.value)}
                          placeholder="Masuk ke Sistem PMS →"
                          className="input-control"
                          style={{ fontSize: '0.85rem', fontWeight: 700 }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Sub-Judul Petunjuk Form:</label>
                      <input
                        type="text"
                        value={formData.formSubtitle || ''}
                        onChange={e => handleChange('formSubtitle', e.target.value)}
                        placeholder="Gunakan akun korporat PT. Pelayaran Baharimas Kalimantan"
                        className="input-control"
                        style={{ fontSize: '0.825rem' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Placeholder Email:</label>
                        <input
                          type="text"
                          value={formData.usernamePlaceholder || ''}
                          onChange={e => handleChange('usernamePlaceholder', e.target.value)}
                          placeholder="admin@baharimas.co.id"
                          className="input-control"
                          style={{ fontSize: '0.8rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Placeholder Sandi:</label>
                        <input
                          type="text"
                          value={formData.passwordPlaceholder || ''}
                          onChange={e => handleChange('passwordPlaceholder', e.target.value)}
                          placeholder="Kata sandi akun..."
                          className="input-control"
                          style={{ fontSize: '0.8rem' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Gaya Box Formulir:</label>
                      <select
                        value={formData.formCardStyle || 'dark_glass'}
                        onChange={e => handleChange('formCardStyle', e.target.value)}
                        className="input-control"
                        style={{ fontSize: '0.8rem' }}
                      >
                        <option value="dark_glass">Dark Glassmorphism (Efek Kaca Transparan & Blur)</option>
                        <option value="clean_white">Clean Solid Box (Warna Solid & Bersih)</option>
                      </select>
                    </div>

                    {/* Masuk Cepat / Quick Login Settings */}
                    <div style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      background: '#f8fafc',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                          Fitur Akses Cepat Demo (Klik Akun)
                        </span>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                          <input
                            type="checkbox"
                            checked={formData.showQuickLogin !== false}
                            onChange={e => handleChange('showQuickLogin', e.target.checked)}
                            style={{ accentColor: '#2563eb' }}
                          />
                          <span>Tampilkan</span>
                        </label>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Label Akses Cepat:</label>
                        <input
                          type="text"
                          value={formData.quickLoginLabel || ''}
                          onChange={e => handleChange('quickLoginLabel', e.target.value)}
                          placeholder="⚡ Akses Cepat Demo (Klik Akun):"
                          className="input-control"
                          style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>
                        Menampilkan 6 role staf & crew armada (Capt. Robert Sitorus, Ir. H. Gunawan, Capt. Hendra Gunawan, Ir. Bambang Wijaya, Suryadi Pratama, Siti Rahmawati).
                      </p>
                    </div>

                    {/* Footer notices */}
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Catatan Keamanan Footer Form:</label>
                      <input
                        type="text"
                        value={formData.formFooterNotice || ''}
                        onChange={e => handleChange('formFooterNotice', e.target.value)}
                        placeholder="🔒 Portal Resmi PT. Pelayaran Baharimas Kalimantan • ISM Code Compliant"
                        className="input-control"
                        style={{ fontSize: '0.8rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Teks Hak Cipta Global (Footer):</label>
                      <input
                        type="text"
                        value={formData.footerText || ''}
                        onChange={e => handleChange('footerText', e.target.value)}
                        placeholder="© 2026 PT. Pelayaran Baharimas Kalimantan • All Rights Reserved"
                        className="input-control"
                        style={{ fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>
  );
};
