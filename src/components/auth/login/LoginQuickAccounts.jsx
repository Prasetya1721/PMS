/**
 * LoginQuickAccounts.jsx
 * Diekstrak dari LoginPage.jsx.orig (baris 468-529).
 * Sumber: Enam akun demo cepat dalam susunan dua kolom kali tiga baris
 */
import React from 'react';
import { ChevronRight } from 'lucide-react';

export const LoginQuickAccounts = ({
  cfg,
  demoAccounts,
  handleQuickLogin,
  isLight,
}) => {
  return (
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
  );
};
