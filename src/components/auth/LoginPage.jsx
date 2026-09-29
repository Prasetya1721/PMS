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
import { makeId } from '../../utils/idUtils';
import { LoginAmbientGlow } from './login/LoginAmbientGlow';
import { LoginBrandPanel } from './login/LoginBrandPanel';
import { LoginFormCard } from './login/LoginFormCard';
import { LoginFooterNotice } from './login/LoginFooterNotice';
import { LoginGlowBlobs } from './login/LoginGlowBlobs';
import { LoginErrorBanner } from './login/LoginErrorBanner';
import { LoginQuickAccounts } from './login/LoginQuickAccounts';

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
          id: makeId('u'),
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
      <LoginAmbientGlow
        cfg={cfg}
        getContainerBackground={getContainerBackground}
      />

      {/* Ambient Glow Blobs */}
      {(cfg.glowBlobs !== false) && (
        <LoginGlowBlobs
          cfg={cfg}
          isLight={isLight}
        />
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
        <LoginBrandPanel
          cfg={cfg}
          isLight={isLight}
        />

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

          {(errorMsg) && (
            <LoginErrorBanner
              errorMsg={errorMsg}
            />
          )}

          <LoginFormCard
            cfg={cfg}
            email={email}
            handleSubmit={handleSubmit}
            isLight={isLight}
            isLoading={isLoading}
            password={password}
            rememberMe={rememberMe}
            setEmail={setEmail}
            setPassword={setPassword}
            setRememberMe={setRememberMe}
            setShowPassword={setShowPassword}
            showPassword={showPassword}
          />

          {/* Quick Demo Role Accounts (2 columns x 3 rows) */}
          {(cfg.showQuickLogin !== false) && (
            <LoginQuickAccounts
              cfg={cfg}
              demoAccounts={demoAccounts}
              handleQuickLogin={handleQuickLogin}
              isLight={isLight}
            />
          )}

          {/* Form Footer Notice */}
          {cfg.formFooterNotice && (
            <LoginFooterNotice
              cfg={cfg}
              isLight={isLight}
            />
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
