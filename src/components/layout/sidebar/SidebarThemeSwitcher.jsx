/**
 * SidebarThemeSwitcher.jsx
 * Diekstrak dari Sidebar.jsx.orig (baris 437-469).
 * Sumber: Tombol pengalih tema terang dan gelap
 */
import React from 'react';
import { Moon, Sun } from 'lucide-react';

export const SidebarThemeSwitcher = ({
  theme,
  toggleTheme,
}) => {
  return (
    <button
              onClick={toggleTheme}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: theme === 'light' ? '#f8fafc' : 'rgba(255, 255, 255, 0.04)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                fontSize: '0.78rem',
                transition: 'all 0.15s ease'
              }}
              title="Ganti Mode Terang / Gelap"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                {theme === 'dark' ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color="#0284c7" />}
                <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Tema Tampilan</span>
              </div>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                background: theme === 'light' ? '#0284c7' : 'rgba(56, 189, 248, 0.2)',
                color: '#ffffff'
              }}>
                {theme === 'dark' ? 'Dark' : 'Light (Putih)'}
              </span>
            </button>
  );
};
