/**
 * SidebarBrandHeader.jsx
 * Diekstrak dari Sidebar.jsx.orig (baris 144-207).
 * Sumber: Kop merek Baharimas beserta tombol tutup untuk mobile
 */
import React from 'react';
import { X } from 'lucide-react';
import { BaharimasEmblem } from '../../common/BaharimasLogo';

export const SidebarBrandHeader = ({
  closeMobileSidebar,
  siteConfig,
  theme,
}) => {
  return (
    <div style={{
              padding: '1.25rem 1.15rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: theme === 'light' ? '#f0f9ff' : 'rgba(255, 255, 255, 0.08)',
                  border: theme === 'light' ? '1px solid #bae6fd' : '1px solid rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: theme === 'light' ? '0 2px 8px rgba(2, 132, 199, 0.15)' : '0 4px 12px rgba(0, 0, 0, 0.3)',
                  padding: '4px',
                  flexShrink: 0
                }}>
                  <BaharimasEmblem size={26} />
                </div>
                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <h1 style={{
                    fontSize: '0.94rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: theme === 'light' ? '#0f172a' : '#ffffff',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}>
                    {siteConfig?.companyName || 'PT. BAHARIMAS'}
                  </h1>
                  <p style={{
                    fontSize: '0.66rem',
                    color: theme === 'light' ? '#0284c7' : '#38bdf8',
                    fontWeight: 700,
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}>
                    {siteConfig?.companyTagline || 'Pelayaran Baharimas'}
                  </p>
                </div>
              </div>

              {/* Close button on mobile/tablet */}
              <button
                onClick={closeMobileSidebar}
                className="sidebar-close-btn"
                aria-label="Tutup Menu"
                title="Tutup Menu"
                type="button"
              >
                <X size={20} />
              </button>
            </div>
  );
};
