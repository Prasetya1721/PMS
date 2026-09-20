import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { BaharimasEmblem } from '../common/BaharimasLogo';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertTriangle,
  MapPin,
  ChevronRight
} from 'lucide-react';

export const LoginPage = () => {
  const { users, login, siteConfig } = usePMS();

  const cfg = siteConfig || {};
  const isLight = cfg.textColorTheme === 'light';
  const [email, setEmail] = useState('admin@baharimas.co.id');
  const [password, setPassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic Background computation responsive to contrast theme
  const getContainerBackground = () => {
    const type = cfg.bgType || 'wallpaper';
    if (type === 'solid') {
      return { backgroundColor: cfg.solidColor || (isLight ? '#f8fafc' : '#0c1a30') };
    }
    if (type === 'gradasi') {
      const dir = cfg.gradientDirection || 'to bottom right';
      return {
        backgroundImage: `linear-gradient(${dir}, ${cfg.gradientFrom || (isLight ? '#f8fafc' : '#0c1a30')}, ${cfg.gradientVia || (isLight ? '#e0f2fe' : '#0f2942')}, ${cfg.gradientTo || (isLight ? '#f1f5f9' : '#060d19')})`
      };
    }
    if (type === 'wallpaper') {
      const overlayVal = (cfg.wallpaperOverlay ?? 40) / 100;
      const imgUrl = cfg.wallpaperUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80';
      const lightOpacity = Math.max(0.78, Math.min(0.96, 0.70 + (overlayVal * 0.26)));
      const darkOpacity = Math.max(0.40, Math.min(0.90, 0.35 + (overlayVal * 0.45)));
      const overlayColor = isLight ? `rgba(248, 250, 252, ${lightOpacity})` : `rgba(6, 13, 25, ${darkOpacity})`;
      return {
        backgroundImage: `linear-gradient(${overlayColor}, ${overlayColor}), url("${imgUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    // Bawaan
    if (isLight) {
      return {
        backgroundColor: '#f1f5f9',
        backgroundImage: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 40%, #f8fafc 100%)'
      };
    }
    return {
      backgroundImage: 'radial-gradient(ellipse at top, #0c1a30 0%, #060d19 100%)'
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const query = email.trim().toLowerCase();
      const matchedUser = users.find(
        u => u.email.toLowerCase() === query || u.name.toLowerCase() === query
      );

      if (matchedUser) {
        if (password === '123' || password === matchedUser.password) {
          login(matchedUser);
        } else {
          setErrorMsg('Kata sandi salah. (Password demo: 123)');
          setIsLoading(false);
        }
      } else {
        const namePart = email.includes('@') ? email.split('@')[0] : email;
        const dynamicUser = {
          id: `u-${Date.now()}`,
          name: namePart.toUpperCase(),
          email: email.includes('@') ? email : `${namePart.toLowerCase()}@baharimas.co.id`,
          role: 'Super Admin',
          title: 'Operasional Armada PT. PBK',
          shipAccess: 'All',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
        };
        login(dynamicUser);
      }
    }, 400);
  };

  const handleQuickLogin = (usr) => {
    setIsLoading(true);
    const queryEmail = (usr.email || '').toLowerCase();
    const queryName = (usr.name || '').toLowerCase();
    const matchedUser = users.find(
      u => u.email.toLowerCase() === queryEmail || u.name.toLowerCase().includes(queryName)
    );

    setTimeout(() => {
      if (matchedUser) {
        setEmail(matchedUser.email);
        setPassword(matchedUser.password || '123');
        login(matchedUser);
      } else {
        const dynamicUser = {
          id: `u-${usr.name.toLowerCase().replace(/\s+/g, '-')}`,
          name: usr.name,
          email: usr.email || `${usr.name.toLowerCase().replace(/\s+/g, '')}@baharimas.co.id`,
          role: usr.role || 'Super Admin',
          title: `${usr.role || 'Staff'} Operasional PT. PBK`,
          shipAccess: 'All',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
        };
        setEmail(dynamicUser.email);
        setPassword('123');
        login(dynamicUser);
      }
    }, 300);
  };

  // 6 Demo Accounts matching Image 2
  const demoAccounts = (cfg.quickAccounts && cfg.quickAccounts.length > 0)
    ? cfg.quickAccounts
    : [
        { name: 'Capt. Robert Sitorus', role: 'Super Admin', email: 'admin@baharimas.co.id' },
        { name: 'Ir. H. Gunawan', role: 'Fleet Manager', email: 'fleet.ops@baharimas.co.id' },
        { name: 'Capt. Hendra Gunawan', role: 'Admin Kapal / Nakhoda', email: 'nakhoda@baharimas.co.id' },
        { name: 'Ir. Bambang Wijaya (KKM)', role: 'Teknisi / Chief Engineer', email: 'kkm@baharimas.co.id' },
        { name: 'Suryadi Pratama', role: 'Crew / ABK', email: 'abk@baharimas.co.id' },
        { name: 'Siti Rahmawati', role: 'HR / Personalia', email: 'hr@baharimas.co.id' }
      ];

  const isGlass = cfg.formCardStyle === 'dark_glass';
  const cardBackground = isLight
    ? (isGlass ? 'rgba(255, 255, 255, 0.92)' : '#ffffff')
    : (isGlass ? 'rgba(12, 21, 38, 0.85)' : '#0c1a30');
  const cardBorder = isLight
    ? (isGlass ? '1px solid rgba(255, 255, 255, 0.85)' : '1px solid #cbd5e1')
    : (isGlass ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid #1e293b');
  const cardBackdrop = isGlass ? 'blur(16px)' : 'none';

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Backdrop Layer with Wallpaper Blur (Does NOT blur content) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        ...getContainerBackground(),
        filter: (cfg.bgType === 'wallpaper' && cfg.wallpaperBlur) ? `blur(${cfg.wallpaperBlur}px)` : 'none',
        transform: (cfg.bgType === 'wallpaper' && cfg.wallpaperBlur) ? 'scale(1.05)' : 'none',
        transition: 'all 0.3s ease'
      }} />

      {/* Ambient Glow Blobs */}
      {cfg.glowBlobs !== false && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: '-15%',
            left: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: isLight ? 'rgba(2, 132, 199, 0.12)' : (cfg.glowColor1 || 'radial-gradient(circle, rgba(2, 132, 199, 0.25) 0%, transparent 70%)'),
            filter: 'blur(60px)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-15%',
            right: '-10%',
            width: '650px',
            height: '650px',
            borderRadius: '50%',
            background: isLight ? 'rgba(6, 182, 212, 0.1)' : (cfg.glowColor2 || 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)'),
            filter: 'blur(70px)',
            pointerEvents: 'none'
          }} />
        </div>
      )}

      {/* Main Container matching Image 2 */}
      <div style={{
        maxWidth: '1160px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
        gap: '3rem',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Left Column: Maritime Company Branding */}
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

        {/* Right Column: Dynamically Light or Dark Glass Card (Respects formCardStyle) */}
        <div style={{
          padding: '2.25rem',
          background: cardBackground,
          backdropFilter: cardBackdrop,
          border: cardBorder,
          borderRadius: '20px',
          boxShadow: isLight ? '0 20px 45px -10px rgba(0, 0, 0, 0.12)' : '0 25px 60px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {/* Header */}
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
              {cfg.formTitle || 'Masuk ke Portal PMS'}
            </h2>
            <p style={{ fontSize: '0.825rem', color: isLight ? '#64748b' : '#94a3b8', marginTop: '0.35rem', margin: 0 }}>
              {cfg.formSubtitle || 'Gunakan akun korporat PT. Pelayaran Baharimas Kalimantan'}
            </p>
          </div>

          {errorMsg && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <AlertTriangle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Email Input */}
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={cfg.usernamePlaceholder || 'admin@baharimas.co.id'}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: isLight ? '#f8fafc' : '#ffffff',
                  color: '#0f172a',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  outline: 'none'
                }}
                required
              />
            </div>

            {/* Password Input */}
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={cfg.passwordPlaceholder || 'Kata sandi...'}
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: isLight ? '#f8fafc' : '#ffffff',
                  color: '#0f172a',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  outline: 'none'
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Remember Me & Sandi Demo Info */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: isLight ? '#475569' : '#94a3b8' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#0284c7' }}
                />
                <span>Ingat sesi saya</span>
              </label>
              <span style={{ color: isLight ? '#0284c7' : '#38bdf8', fontSize: '0.75rem', fontWeight: 600 }}>
                Default Sandi Demo: <strong>123</strong>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.9rem',
                fontWeight: 800,
                borderRadius: '8px',
                border: 'none',
                background: isLight ? '#1e3a8a' : '#0284c7',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: isLight ? '0 4px 14px rgba(30, 58, 138, 0.35)' : '0 4px 20px rgba(2, 132, 199, 0.45)',
                transition: 'all 0.15s ease'
              }}
            >
              {isLoading ? (
                <span>Memverifikasi Otorisasi...</span>
              ) : (
                <>
                  <span>{cfg.buttonText || 'Masuk ke Sistem PMS →'}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Role Accounts (2 columns x 3 rows) */}
          {cfg.showQuickLogin !== false && (
            <div style={{ marginTop: '0.5rem', borderTop: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem'
              }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isLight ? '#b45309' : '#38bdf8', letterSpacing: '0.03em' }}>
                  {cfg.quickLoginLabel || '⚡ Akses Cepat Demo (Klik Akun):'}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  1-Click Role Access
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.55rem'
              }}>
                {demoAccounts.map((acc, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleQuickLogin(acc)}
                    style={{
                      padding: '0.55rem 0.75rem',
                      borderRadius: '8px',
                      border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
                      background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)',
                      color: isLight ? '#0f172a' : '#ffffff',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.15rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isLight ? '#eff6ff' : 'rgba(2, 132, 199, 0.18)';
                      e.currentTarget.style.borderColor = isLight ? '#93c5fd' : '#38bdf8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)';
                      e.currentTarget.style.borderColor = isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)';
                    }}
                  >
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                        {acc.name.split(',')[0]}
                      </span>
                      <ChevronRight size={12} color={isLight ? '#0284c7' : '#38bdf8'} />
                    </div>
                    <div style={{ fontSize: '0.68rem', color: isLight ? '#0369a1' : '#38bdf8', fontWeight: 600 }}>
                      {acc.role}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form Footer Notice */}
          {cfg.formFooterNotice && (
            <div style={{
              fontSize: '0.72rem',
              color: isLight ? '#64748b' : '#94a3b8',
              textAlign: 'center',
              marginTop: '0.25rem',
              borderTop: isLight ? '1px dashed #e2e8f0' : '1px dashed rgba(255,255,255,0.1)',
              paddingTop: '0.5rem'
            }}>
              {cfg.formFooterNotice}
            </div>
          )}
        </div>
      </div>

      {/* Global Footer */}
      <footer style={{
        position: 'absolute',
        bottom: '1rem',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: '0.72rem',
        color: isLight ? '#64748b' : '#94a3b8',
        zIndex: 10
      }}>
        {cfg.footerText || '© 2026 PT. Pelayaran Baharimas Kalimantan • All Rights Reserved'}
      </footer>
    </div>
  );
};
