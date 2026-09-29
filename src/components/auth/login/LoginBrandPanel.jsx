/**
 * LoginBrandPanel.jsx
 * Diekstrak dari LoginPage.jsx.orig (baris 210-313).
 * Sumber: Kolom kiri: merek maritim, emblem resmi, deskripsi, dan kartu alamat kantor pusat
 */
import React from 'react';
import { MapPin } from 'lucide-react';
import { BaharimasEmblem } from '../../common/BaharimasLogo';

export const LoginBrandPanel = ({
  cfg,
  isLight,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', minWidth: 0 }}>
              {/* Badge: MARITIME FLEET MANAGEMENT SYSTEM */}
              <div>
                <span style={{
                  display: 'inline-block',
                  padding: '0.4rem 1rem',
                  borderRadius: '9999px',
                  background: isLight ? '#eff6ff' : 'rgba(2, 132, 199, 0.15)',
                  border: isLight ? '1px solid #bfdbfe' : '1px solid rgba(56, 189, 248, 0.3)',
                  color: isLight ? '#1d4ed8' : '#38bdf8',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}>
                  {cfg.companyBadge || 'MARITIME FLEET MANAGEMENT SYSTEM'}
                </span>
              </div>

              {/* Official Emblem & Logo (Reactive to logoMode and customLogoUrl) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {cfg.logoMode === 'custom' && cfg.customLogoUrl ? (
                  <img
                    src={cfg.customLogoUrl}
                    alt="Logo"
                    style={{ maxHeight: '48px', maxWidth: '140px', objectFit: 'contain', borderRadius: '8px' }}
                  />
                ) : cfg.logoMode === 'combined' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <BaharimasEmblem size={44} />
                    <div style={{ width: '2px', height: '28px', background: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.2)' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: isLight ? '#0369a1' : '#38bdf8', letterSpacing: '0.05em' }}>
                      BKI
                    </span>
                  </div>
                ) : (
                  <BaharimasEmblem size={44} />
                )}

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{
                    fontFamily: "'Oswald', 'Bebas Neue', sans-serif",
                    fontSize: 'clamp(1.35rem, 1.8vw, 1.65rem)',
                    fontWeight: 800,
                    color: isLight ? '#0f172a' : '#ffffff',
                    letterSpacing: '0.03em',
                    lineHeight: 1.15,
                    textTransform: 'uppercase'
                  }}>
                    {cfg.systemTitle || 'PT PELAYARAN BAHARIMAS KALIMANTAN'}
                  </span>
                  {cfg.companySubtitle && (
                    <span style={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: isLight ? '#0369a1' : '#38bdf8',
                      letterSpacing: '0.02em',
                      marginTop: '0.15rem'
                    }}>
                      {cfg.companySubtitle}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p style={{
                fontSize: '0.925rem',
                color: isLight ? '#334155' : '#94a3b8',
                lineHeight: 1.65,
                maxWidth: '520px',
                margin: 0
              }}>
                {cfg.portalDescription || 'Pusat sistem digital operasional armada kapal tunda (tugboat), tongkang, dan kapal kargo niaga perairan Kalimantan Barat dan jalur pelayaran Nusantara.'}
              </p>

              {/* Real Head Office Address Card */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.55rem',
                fontSize: '0.8rem',
                color: isLight ? '#475569' : '#94a3b8',
                background: isLight ? '#ffffff' : 'rgba(2, 6, 23, 0.45)',
                padding: '0.95rem 1.25rem',
                borderRadius: '12px',
                border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(56, 189, 248, 0.25)',
                maxWidth: '520px',
                boxShadow: isLight ? '0 4px 14px rgba(0,0,0,0.06)' : 'none',
                backdropFilter: 'blur(8px)'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <MapPin size={16} color={isLight ? '#0284c7' : '#38bdf8'} style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                  <div style={{ lineHeight: 1.5 }}>
                    <strong style={{ color: isLight ? '#0f172a' : '#ffffff' }}>Alamat Kantor Pusat:</strong>{' '}
                    {cfg.officeAddress || 'Jl. Adi Sucipto KM 6, Kompleks Bahari Permai No. 2, RT. 004 / RW. 004, Desa Sungai Raya, Kec. Sungai Raya, Kab. Kubu Raya - Pontianak, Kalimantan Barat'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.75rem', marginLeft: '1.65rem' }}>
                  <span>📞 Telp: {cfg.officePhone || '(0561) 531016 / 732194'}</span>
                  <span>✉️ {cfg.officeEmail || 'pt.baharimas@hotmail.com'}</span>
                </div>
              </div>
            </div>
  );
};
