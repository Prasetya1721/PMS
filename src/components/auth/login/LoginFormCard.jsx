/**
 * LoginFormCard.jsx
 * Diekstrak dari LoginPage.jsx.orig (baris 354-465).
 * Sumber: Formulir masuk: header, input surel/sandi, ingat saya, dan tombol kirim
 */
import React from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export const LoginFormCard = ({
  cfg,
  email,
  handleSubmit,
  isLight,
  isLoading,
  password,
  rememberMe,
  setEmail,
  setPassword,
  setRememberMe,
  setShowPassword,
  showPassword,
}) => {
  return (
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
  );
};
