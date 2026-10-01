/**
 * SiteSettingsHeader.jsx
 * Diekstrak dari SiteSettingsAdmin.jsx (baris 220-337).
 * Sumber: Header modul: judul, deskripsi, tombol reset & Fernandez
 */
import React from 'react';
import { Check, Palette, RotateCcw, Save, Shield } from 'lucide-react';

export const SiteSettingsHeader = ({
  canAction,
  handleResetBaharimas,
  handleSave,
  isSaved,
  setNavTab,
}) => {
  return (
    <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '1.25rem 1.75rem',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(99, 102, 241, 0.35)'
              }}>
                <Palette size={26} color="#ffffff" />
              </div>
              <div>
                <h1 style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  CMS Tampilan Login & Latar Belakang (Developer)
                </h1>
                <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                  Atur branding panel, logo, formulir, teks, dan desain latar belakang layar login secara langsung.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {/* Quick link button to separate Sidebar Management */}
              <button
                type="button"
                onClick={() => setNavTab('sidebar_management')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #bfdbfe',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#dbeafe'}
                onMouseLeave={e => e.currentTarget.style.background = '#eff6ff'}
                title="Buka Halaman Terpisah Manajemen Hak Akses Sidebar"
              >
                <Shield size={15} />
                <span>Manajemen Sidebar →</span>
              </button>

              {canAction && canAction('reset_site_config') && (
                <button
                  type="button"
                  onClick={handleResetBaharimas}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.55rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#334155',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
                >
                  <RotateCcw size={15} />
                  <span>Reset Standar Baharimas</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSave}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: isSaved ? '#16a34a' : '#1e3a8a',
                  color: '#ffffff',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                {isSaved ? <Check size={16} /> : <Save size={16} />}
                <span>{isSaved ? 'Tersimpan!' : 'Simpan Konfigurasi'}</span>
              </button>
            </div>
          </div>
  );
};
