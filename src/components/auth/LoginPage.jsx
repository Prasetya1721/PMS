import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { BaharimasLogo } from '../common/BaharimasLogo';
import {
  Ship,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Compass,
  ArrowRight,
  Clock,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export const LoginPage = () => {
  const { users, login, showToast } = usePMS();

  const [email, setEmail] = useState('admin@baharimas.co.id');
  const [password, setPassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      // Find matching user by email
      const matchedUser = users.find(
        u => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (matchedUser) {
        // Validate password
        if (password === '123' || password === matchedUser.password) {
          login(matchedUser);
        } else {
          setErrorMsg('Kata sandi yang Anda masukkan salah. (Password demo: 123)');
          setIsLoading(false);
        }
      } else {
        // If username or custom email, check if demo fallback or create session
        if (email.includes('@')) {
          login({
            id: `u-${Date.now()}`,
            name: email.split('@')[0].toUpperCase(),
            email: email,
            role: 'Super Admin',
            title: 'Staff Operasional PT. PBK',
            shipAccess: 'All',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
          });
        } else {
          setErrorMsg('Akun email tidak ditemukan dalam direktori PT. Pelayaran Baharimas Kalimantan.');
          setIsLoading(false);
        }
      }
    }, 450);
  };

  const handleQuickLogin = (targetUser) => {
    setEmail(targetUser.email);
    setPassword(targetUser.password || '123');
    setIsLoading(true);
    setTimeout(() => {
      login(targetUser);
    }, 300);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'radial-gradient(ellipse at top, #0c1a30 0%, #060d19 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Ocean Grid & Waves Background Glow */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '-10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(2, 132, 199, 0.15) 0%, transparent 70%)',
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
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none'
      }} />

      {/* Main Container */}
      <div style={{
        maxWidth: '1160px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '2.5rem',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Left Column: Maritime Company Branding */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', minWidth: 0 }}>
          {/* Logo & Company Title */}
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <span className="badge badge-info" style={{ letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.72rem', marginBottom: '0.85rem', display: 'inline-block' }}>
                Maritime Fleet Management System
              </span>
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <BaharimasLogo variant="white" size="lg" />
              </div>
            </div>

            <p style={{ fontSize: '0.925rem', color: '#94a3b8', lineHeight: 1.6, maxWidth: '520px' }}>
              Pusat sistem digital operasional armada kapal tunda (tugboat), tongkang, dan kapal kargo niaga perairan Kalimantan Barat dan jalur pelayaran Nusantara.
            </p>
          </div>

          {/* Real Head Office Address */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            fontSize: '0.8rem',
            color: '#94a3b8',
            background: 'rgba(2, 6, 23, 0.45)',
            padding: '0.85rem 1.15rem',
            borderRadius: '12px',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            maxWidth: '520px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
              <MapPin size={16} color="#38bdf8" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
              <div style={{ lineHeight: 1.5 }}>
                <strong style={{ color: '#fff' }}>Alamat Kantor Pusat:</strong>{' '}
                Jl. Adi Sucipto KM 6, Kompleks Bahari Permai No. 2, RT. 004 / RW. 004, Desa Sungai Raya, Kec. Sungai Raya, Kab. Kubu Raya - Pontianak, Kalimantan Barat
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.75rem', color: 'var(--text-subtle)', marginLeft: '1.55rem' }}>
              <span>📞 Telp: (0561) 531016 / 732194</span>
              <span>✉️ pt.baharimas@hotmail.com</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Login Box */}
        <div className="card" style={{
          padding: '2.25rem',
          background: 'rgba(12, 21, 38, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Masuk ke Portal PMS
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Gunakan akun korporat PT. Pelayaran Baharimas Kalimantan
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
              gap: '0.6rem',
              marginBottom: '1.25rem'
            }}>
              <AlertTriangle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.825rem' }}>
                Email / Akun Korporat
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@baharimas.co.id"
                  className="input-control"
                  style={{ paddingLeft: '2.5rem', fontSize: '0.875rem' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.825rem' }}>
                Kata Sandi
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi..."
                  className="input-control"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', fontSize: '0.875rem' }}
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
                    color: 'var(--text-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#0284c7' }}
                />
                <span>Ingat sesi saya</span>
              </label>
              <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 500 }}>
                Default Sandi Demo: <strong>123</strong>
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.9rem',
                fontWeight: 800,
                marginTop: '0.5rem',
                boxShadow: '0 4px 20px rgba(2, 132, 199, 0.45)'
              }}
            >
              {isLoading ? (
                <span>Memverifikasi Otorisasi...</span>
              ) : (
                <>
                  <span>Masuk ke Sistem PMS</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access (RBAC 1-Click Login) */}
          <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.85rem'
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.03em' }}>
                ⚡ Akses Cepat Demo (Klik Akun):
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                1-Click Role Access
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.6rem'
            }}>
              {users.slice(0, 6).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  style={{
                    padding: '0.6rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    color: 'var(--text-main)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(2, 132, 199, 0.15)';
                    e.currentTarget.style.borderColor = '#38bdf8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{u.name.split(',')[0]}</span>
                    <ChevronRight size={12} color="#38bdf8" />
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 600 }}>
                    {u.role}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Copyright */}
      <footer style={{
        position: 'absolute',
        bottom: '1rem',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: '0.72rem',
        color: '#64748b'
      }}>
        © 2026 PT. Pelayaran Baharimas Kalimantan • ISM Code & Biro Klasifikasi Indonesia (BKI) Compliant
      </footer>
    </div>
  );
};
