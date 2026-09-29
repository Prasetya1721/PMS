/**
 * SidebarProfileBox.jsx
 * Diekstrak dari Sidebar.jsx.orig (baris 471-551).
 * Sumber: Kotak profil peran aktif, tombol pengaturan profil, dan keluar
 */
import React from 'react';
import { LogOut, ShieldCheck, UserCog } from 'lucide-react';
import { ROLE_DEFINITIONS } from '../../../utils/rbac';

export const SidebarProfileBox = ({
  currentRole,
  currentUser,
  logout,
  setShowProfileModal,
  theme,
}) => {
  return (
    <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.6rem 0.75rem',
              borderRadius: '8px',
              background: theme === 'light' ? '#f8fafc' : 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden', flex: 1 }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: ROLE_DEFINITIONS[currentRole]?.color || 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  flexShrink: 0,
                  overflow: 'hidden'
                }}>
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ShieldCheck size={16} />
                  )}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {currentUser?.name ? currentUser.name.split(',')[0] : currentRole}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: theme === 'light' ? '#0284c7' : '#38bdf8', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {currentUser?.role || currentRole}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                {/* Profile Settings Button */}
                <button
                  onClick={() => setShowProfileModal(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#0284c7',
                    cursor: 'pointer',
                    padding: '0.35rem',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                  title="Pengaturan Profil"
                >
                  <UserCog size={15} />
                </button>

                <button
                  onClick={logout}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    padding: '0.35rem',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                  title="Keluar dari sistem"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>
  );
};
