/**
 * SiteSettingsNavTabs.jsx
 * Diekstrak dari SiteSettingsAdmin.jsx (baris 355-400).
 * Sumber: Strip navigasi 4 tab pengaturan situs
 */
import React from 'react';
import { Layout, Palette, RefreshCw, Sliders } from 'lucide-react';

export const SiteSettingsNavTabs = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                borderBottom: '1px solid #e2e8f0',
                background: '#f8fafc',
                padding: '0.35rem',
                gap: '0.35rem'
              }}>
                {[
                  { id: 'background', label: 'Latar Belakang', icon: Palette },
                  { id: 'branding', label: 'Panel Kiri (Branding)', icon: Layout },
                  { id: 'form', label: 'Panel Kanan (Form)', icon: Sliders },
                  { id: 'dev', label: 'Alat Dev', icon: RefreshCw },
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem',
                        padding: '0.65rem 0.35rem',
                        fontSize: '0.78rem',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#1d4ed8' : '#64748b',
                        background: isActive ? '#ffffff' : 'transparent',
                        borderRadius: '8px',
                        border: isActive ? '1px solid #cbd5e1' : '1px solid transparent',
                        boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Icon size={16} color={isActive ? '#1d4ed8' : '#94a3b8'} />
                      <span style={{ lineHeight: 1.2 }}>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
  );
};
