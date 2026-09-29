/**
 * TabBranding.jsx
 * Diekstrak dari SiteSettingsAdmin.jsx (baris 821-986).
 * Sumber: TAB 2: panel kiri branding
 */
import React from 'react';
import { Upload } from 'lucide-react';

export const TabBranding = ({
  formData,
  handleChange,
  handleFileUpload,
  logoInputRef,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                          Pilihan Logo Panel Kiri:
                        </label>
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            handleFileUpload(e, 'customLogoUrl');
                            handleChange('logoMode', 'custom');
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '6px',
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            color: '#1d4ed8',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <Upload size={12} />
                          <span>Upload File Logo</span>
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                        {[
                          { id: 'baharimas', label: 'Logo Resmi Baharimas' },
                          { id: 'combined', label: 'Baharimas + Mitra & BKI' },
                          { id: 'custom', label: 'Logo Kustom (Upload/URL)' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleChange('logoMode', opt.id)}
                            style={{
                              padding: '0.65rem 0.75rem',
                              borderRadius: '8px',
                              border: formData.logoMode === opt.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                              background: formData.logoMode === opt.id ? '#eff6ff' : '#ffffff',
                              color: formData.logoMode === opt.id ? '#1e40af' : '#334155',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      {formData.logoMode === 'custom' && (
                        <div style={{ marginTop: '0.65rem' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                            URL atau Sumber Gambar Logo Kustom:
                          </label>
                          <input
                            type="text"
                            value={formData.customLogoUrl || ''}
                            onChange={e => handleChange('customLogoUrl', e.target.value)}
                            placeholder="https://... atau hasil unggah di atas"
                            className="input-control"
                            style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Badge Atas:</label>
                      <input
                        type="text"
                        value={formData.companyBadge || ''}
                        onChange={e => handleChange('companyBadge', e.target.value)}
                        placeholder="MARITIME FLEET MANAGEMENT SYSTEM"
                        className="input-control"
                        style={{ fontSize: '0.825rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Nama Perusahaan (Headline):</label>
                      <input
                        type="text"
                        value={formData.systemTitle || ''}
                        onChange={e => handleChange('systemTitle', e.target.value)}
                        placeholder="PT PELAYARAN BAHARIMAS KALIMANTAN"
                        className="input-control"
                        style={{ fontSize: '0.85rem', fontWeight: 700 }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Sub-Judul Perusahaan (Slogan / Sub-headline):</label>
                      <input
                        type="text"
                        value={formData.companySubtitle || ''}
                        onChange={e => handleChange('companySubtitle', e.target.value)}
                        placeholder="Fleet Management & Marine Shipping Lines"
                        className="input-control"
                        style={{ fontSize: '0.825rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Deskripsi Singkat Operasional:</label>
                      <textarea
                        rows={3}
                        value={formData.portalDescription || ''}
                        onChange={e => handleChange('portalDescription', e.target.value)}
                        placeholder="Pusat sistem digital operasional armada kapal tunda (tugboat), tongkang..."
                        className="input-control"
                        style={{ fontSize: '0.825rem', resize: 'vertical' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Alamat Kantor Pusat:</label>
                      <textarea
                        rows={2}
                        value={formData.officeAddress || ''}
                        onChange={e => handleChange('officeAddress', e.target.value)}
                        className="input-control"
                        style={{ fontSize: '0.8rem' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>No. Telepon:</label>
                        <input
                          type="text"
                          value={formData.officePhone || ''}
                          onChange={e => handleChange('officePhone', e.target.value)}
                          className="input-control"
                          style={{ fontSize: '0.8rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Email Resmi:</label>
                        <input
                          type="text"
                          value={formData.officeEmail || ''}
                          onChange={e => handleChange('officeEmail', e.target.value)}
                          className="input-control"
                          style={{ fontSize: '0.8rem' }}
                        />
                      </div>
                    </div>
                  </div>
  );
};
