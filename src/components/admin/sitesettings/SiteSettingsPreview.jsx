/**
 * SiteSettingsPreview.jsx
 * Diekstrak dari SiteSettingsAdmin.jsx (baris 1178-1591).
 * Sumber: Kolom kanan: pratinjau langsung halaman login
 */
import React from 'react';
import { ChevronRight, Eye, Lock, Mail, MapPin } from 'lucide-react';
import { BaharimasEmblem } from '../../common/BaharimasLogo';

export const SiteSettingsPreview = ({
  cardBackdrop,
  cardBackground,
  cardBorder,
  demoUsersList,
  formData,
  getPreviewBackground,
  isLight,
}) => {
  return (
    <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              {/* Header of Live Preview */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderBottom: '1px solid #e2e8f0',
                background: '#ffffff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ fontSize: '0.95rem' }}>👁️</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>
                    Live Preview Mockup Halaman Login
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '6px',
                    background: isLight ? '#eff6ff' : '#0f172a',
                    color: isLight ? '#1d4ed8' : '#ffffff',
                    fontWeight: 700,
                    marginLeft: '0.35rem'
                  }}>
                    {isLight ? 'Latar Terang (Teks Gelap)' : 'Latar Gelap (Teks Putih)'}
                  </span>
                </div>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '9999px',
                  background: '#dcfce7',
                  color: '#15803d',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }} />
                  <span>Real-time</span>
                </div>
              </div>

              {/* Scaled Mockup Body with Separated Backdrop */}
              <div style={{
                padding: '2.5rem 1.75rem 3.5rem 1.75rem',
                minHeight: '560px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Background Layer with Wallpaper Blur */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 1,
                  ...getPreviewBackground(),
                  filter: (formData.bgType === 'wallpaper' && formData.wallpaperBlur) ? `blur(${formData.wallpaperBlur}px)` : 'none',
                  transform: (formData.bgType === 'wallpaper' && formData.wallpaperBlur) ? 'scale(1.05)' : 'none',
                  transition: 'all 0.3s ease'
                }} />

                {/* Ambient Glow Blobs in Preview */}
                {formData.glowBlobs !== false && (
                  <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute',
                      top: '-15%',
                      left: '-10%',
                      width: '320px',
                      height: '320px',
                      borderRadius: '50%',
                      background: isLight ? 'rgba(2, 132, 199, 0.12)' : (formData.glowColor1 || 'radial-gradient(circle, rgba(2, 132, 199, 0.25) 0%, transparent 70%)'),
                      filter: 'blur(50px)',
                      pointerEvents: 'none'
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: '-15%',
                      right: '-10%',
                      width: '350px',
                      height: '350px',
                      borderRadius: '50%',
                      background: isLight ? 'rgba(6, 182, 212, 0.1)' : (formData.glowColor2 || 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)'),
                      filter: 'blur(60px)',
                      pointerEvents: 'none'
                    }} />
                  </div>
                )}

                {/* Mockup Canvas Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1.05fr 1.25fr',
                  gap: '1.75rem',
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: '840px',
                  position: 'relative',
                  zIndex: 2
                }}>
                  {/* Left Column in Mockup */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Badge: MARITIME FLEET MANAGEMENT SYSTEM */}
                    <div>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '9999px',
                        background: isLight ? '#eff6ff' : 'rgba(2, 132, 199, 0.15)',
                        border: isLight ? '1px solid #bfdbfe' : '1px solid rgba(56, 189, 248, 0.3)',
                        color: isLight ? '#1d4ed8' : '#38bdf8',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase'
                      }}>
                        {formData.companyBadge || 'MARITIME FLEET MANAGEMENT SYSTEM'}
                      </span>
                    </div>

                    {/* Logo & Company Name (100% Reactive to logoMode & customLogoUrl) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {formData.logoMode === 'custom' && formData.customLogoUrl ? (
                        <img
                          src={formData.customLogoUrl}
                          alt="Logo Kustom"
                          style={{
                            maxHeight: '40px',
                            maxWidth: '120px',
                            objectFit: 'contain',
                            borderRadius: '6px'
                          }}
                        />
                      ) : formData.logoMode === 'combined' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <BaharimasEmblem size={36} />
                          <div style={{ width: '1px', height: '22px', background: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.2)' }} />
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            color: isLight ? '#0369a1' : '#38bdf8',
                            letterSpacing: '0.05em'
                          }}>
                            BKI
                          </span>
                        </div>
                      ) : (
                        <BaharimasEmblem size={36} />
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{
                          fontFamily: "'Oswald', 'Bebas Neue', sans-serif",
                          fontSize: '1.15rem',
                          fontWeight: 800,
                          color: isLight ? '#0f172a' : '#ffffff',
                          letterSpacing: '0.03em',
                          lineHeight: 1.15,
                          textTransform: 'uppercase'
                        }}>
                          {formData.systemTitle || 'PT PELAYARAN BAHARIMAS KALIMANTAN'}
                        </span>
                        {formData.companySubtitle && (
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            color: isLight ? '#0369a1' : '#38bdf8',
                            letterSpacing: '0.02em',
                            lineHeight: 1.2
                          }}>
                            {formData.companySubtitle}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{
                      fontSize: '0.78rem',
                      color: isLight ? '#334155' : '#94a3b8',
                      lineHeight: 1.6,
                      margin: 0
                    }}>
                      {formData.portalDescription || 'Pusat sistem digital operasional armada kapal tunda (tugboat), tongkang, dan kapal kargo niaga perairan Kalimantan Barat dan jalur pelayaran Nusantara.'}
                    </p>

                    {/* Office Address Card */}
                    <div style={{
                      background: isLight ? '#ffffff' : 'rgba(2, 6, 23, 0.45)',
                      border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(56, 189, 248, 0.25)',
                      borderRadius: '12px',
                      padding: '0.85rem 1.15rem',
                      fontSize: '0.72rem',
                      color: isLight ? '#475569' : '#94a3b8',
                      boxShadow: isLight ? '0 4px 14px rgba(0,0,0,0.06)' : 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
                        <MapPin size={16} color="#0284c7" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                        <div style={{ lineHeight: 1.45 }}>
                          <strong style={{ color: isLight ? '#0f172a' : '#ffffff' }}>Alamat Kantor Pusat:</strong>{' '}
                          {formData.officeAddress || 'Jl. Adi Sucipto KM 6, Kompleks Bahari Permai No. 2, RT. 004 / RW. 004, Desa Sungai Raya, Kec. Sungai Raya, Kab. Kubu Raya - Pontianak, Kalimantan Barat'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginLeft: '1.5rem', fontSize: '0.7rem' }}>
                        <span>📞 Telp: {formData.officePhone || '(0561) 531016 / 732194'}</span>
                        <span>✉️ {formData.officeEmail || 'pt.baharimas@hotmail.com'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column in Mockup: Dynamically Light or Dark Glass Card (Respects formCardStyle) */}
                  <div style={{
                    background: cardBackground,
                    backdropFilter: cardBackdrop,
                    border: cardBorder,
                    borderRadius: '20px',
                    padding: '1.5rem 1.35rem',
                    boxShadow: isLight ? '0 20px 45px -10px rgba(0, 0, 0, 0.12)' : '0 25px 60px rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem'
                  }}>
                    {/* Title and Subtitle */}
                    <div>
                      <h3 style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: isLight ? '#0f172a' : '#ffffff',
                        margin: 0
                      }}>
                        {formData.formTitle || 'Masuk ke Portal PMS'}
                      </h3>
                      <p style={{
                        fontSize: '0.72rem',
                        color: isLight ? '#64748b' : '#94a3b8',
                        margin: '0.2rem 0 0 0'
                      }}>
                        {formData.formSubtitle || 'Gunakan akun korporat PT. Pelayaran Baharimas Kalimantan'}
                      </p>
                    </div>

                    {/* Mock Form Inputs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                      {/* Email Input */}
                      <div style={{
                        background: isLight ? '#f8fafc' : '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '0.5rem 0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem'
                      }}>
                        <Mail size={15} color="#64748b" />
                        <span style={{ fontSize: '0.78rem', color: '#0f172a', fontWeight: 500 }}>
                          {formData.usernamePlaceholder || 'admin@baharimas.co.id'}
                        </span>
                      </div>

                      {/* Password Input */}
                      <div style={{
                        background: isLight ? '#f8fafc' : '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '0.5rem 0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <Lock size={15} color="#64748b" />
                          <span style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic' }}>
                            {formData.passwordPlaceholder || 'Kata sandi akun...'}
                          </span>
                        </div>
                        <Eye size={15} color="#94a3b8" />
                      </div>

                      {/* Remember Me & Demo Pass info */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', marginTop: '0.15rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: isLight ? '#475569' : '#94a3b8' }}>
                          <input type="checkbox" defaultChecked style={{ accentColor: '#0284c7' }} />
                          <span>Ingat sesi saya</span>
                        </div>
                        <span style={{ color: '#0284c7', fontWeight: 600 }}>
                          Default Sandi Demo: 123
                        </span>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="button"
                        style={{
                          width: '100%',
                          padding: '0.65rem',
                          borderRadius: '8px',
                          background: isLight ? '#1e3a8a' : '#0284c7',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '0.825rem',
                          fontWeight: 800,
                          cursor: 'default',
                          textAlign: 'center',
                          boxShadow: isLight ? '0 4px 14px rgba(30, 58, 138, 0.35)' : '0 4px 18px rgba(2, 132, 199, 0.45)',
                          marginTop: '0.2rem'
                        }}
                      >
                        {formData.buttonText || 'Masuk ke Sistem PMS →'}
                      </button>
                    </div>

                    {/* Quick Demo Role Cards (Conditioned by showQuickLogin !== false) */}
                    {formData.showQuickLogin !== false && (
                      <div style={{ marginTop: '0.45rem', borderTop: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.65rem' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '0.5rem'
                        }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: isLight ? '#b45309' : '#38bdf8' }}>
                            {formData.quickLoginLabel || '⚡ Akses Cepat Demo (Klik Akun):'}
                          </span>
                          <span style={{ fontSize: '0.65rem', color: '#64748b' }}>
                            1-Click Role Access
                          </span>
                        </div>

                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '0.45rem'
                        }}>
                          {demoUsersList.map((usr, i) => (
                            <div
                              key={i}
                              style={{
                                padding: '0.45rem 0.6rem',
                                borderRadius: '8px',
                                border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
                                background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.1rem',
                                position: 'relative'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  color: isLight ? '#0f172a' : '#ffffff',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: '100px'
                                }}>
                                  {usr.name.split(',')[0]}
                                </span>
                                <ChevronRight size={12} color="#0284c7" />
                              </div>
                              <span style={{ fontSize: '0.62rem', color: isLight ? '#0369a1' : '#38bdf8', fontWeight: 600 }}>
                                {usr.role}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Form Footer Notice */}
                    {formData.formFooterNotice && (
                      <div style={{
                        fontSize: '0.65rem',
                        color: isLight ? '#64748b' : '#94a3b8',
                        textAlign: 'center',
                        marginTop: '0.2rem',
                        borderTop: isLight ? '1px dashed #e2e8f0' : '1px dashed rgba(255,255,255,0.1)',
                        paddingTop: '0.4rem'
                      }}>
                        {formData.formFooterNotice}
                      </div>
                    )}
                  </div>
                </div>

                {/* Global Footer in Live Preview */}
                <div style={{
                  position: 'absolute',
                  bottom: '0.65rem',
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  fontSize: '0.68rem',
                  color: isLight ? '#475569' : '#94a3b8',
                  zIndex: 3
                }}>
                  {formData.footerText || '© 2026 PT. Pelayaran Baharimas Kalimantan • All Rights Reserved'}
                </div>
              </div>
            </div>
  );
};
