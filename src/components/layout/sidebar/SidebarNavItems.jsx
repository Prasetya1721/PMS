/**
 * SidebarNavItems.jsx
 * Diekstrak dari Sidebar.jsx.orig (baris 210-424).
 * Sumber: Daftar menu navigasi tersaring per peran beserta submenu DOC dan SMC
 */
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export const SidebarNavItems = ({
  activeTab,
  auditSubmenuOpen,
  filteredNavItems,
  setActiveTab,
  setAuditSubmenuOpen,
  theme,
}) => {
  return (
    <nav style={{ padding: '1rem 0.75rem', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.6rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Menu Navigasi
              </span>
              <span className="badge badge-info mono" style={{ fontSize: '0.62rem', padding: '0.1rem 0.45rem' }}>
                {filteredNavItems.length} Modul
              </span>
            </div>
            {filteredNavItems.map(item => {
              const Icon = item.icon;
              const hasSub = Array.isArray(item.subItems) && item.subItems.length > 0;
              const isSubActive = hasSub && item.subItems.some(sub => activeTab === sub.id);
              const isActive = activeTab === item.id || isSubActive;

              if (hasSub) {
                return (
                  <div key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setAuditSubmenuOpen(prev => !prev);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: isActive
                          ? (theme === 'light'
                              ? 'linear-gradient(90deg, rgba(2, 132, 199, 0.12) 0%, rgba(2, 132, 199, 0.04) 100%)'
                              : 'linear-gradient(90deg, rgba(2, 132, 199, 0.25) 0%, rgba(2, 132, 199, 0.08) 100%)')
                          : 'transparent',
                        color: isActive ? (theme === 'light' ? '#0284c7' : '#38bdf8') : 'var(--text-muted)',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.86rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        textAlign: 'left',
                        borderLeft: isActive
                          ? `3px solid ${theme === 'light' ? '#0284c7' : '#38bdf8'}`
                          : '3px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = theme === 'light' ? '#f1f5f9' : 'rgba(255, 255, 255, 0.04)';
                          e.currentTarget.style.color = 'var(--text-main)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--text-muted)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Icon size={19} color={isActive ? (theme === 'light' ? '#0284c7' : '#38bdf8') : 'currentColor'} />
                        <span>{item.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        {item.badge && (
                          <span className={`badge ${
                            item.badgeType === 'danger' ? 'badge-danger' :
                            item.badgeType === 'danger-pulse' ? 'badge-danger-pulse' :
                            item.badgeType === 'info' ? 'badge-info' :
                            'badge-warning'
                          }`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                            {item.badge}
                          </span>
                        )}
                        <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', transition: 'transform 0.2s' }}>
                          {auditSubmenuOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </span>
                      </div>
                    </button>

                    {/* Sub Menu Items: DOC & SMC */}
                    {auditSubmenuOpen && (
                      <div style={{
                        marginLeft: '1.25rem',
                        paddingLeft: '0.65rem',
                        borderLeft: `2px solid ${theme === 'light' ? 'rgba(2, 132, 199, 0.25)' : 'rgba(56, 189, 248, 0.25)'}`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.2rem',
                        marginTop: '0.25rem',
                        marginBottom: '0.35rem'
                      }}>
                        {item.subItems.map(sub => {
                          const SubIcon = sub.icon;
                          const isCurrentSubActive = activeTab === sub.id;
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTab(sub.id);
                              }}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.45rem 0.65rem',
                                borderRadius: '6px',
                                border: isCurrentSubActive
                                  ? `1px solid ${theme === 'light' ? '#0284c7' : '#38bdf8'}`
                                  : '1px solid transparent',
                                background: isCurrentSubActive
                                  ? (theme === 'light' ? '#e0f2fe' : 'rgba(2, 132, 199, 0.25)')
                                  : 'transparent',
                                color: isCurrentSubActive
                                  ? (theme === 'light' ? '#0369a1' : '#38bdf8')
                                  : 'var(--text-muted)',
                                fontWeight: isCurrentSubActive ? 800 : 500,
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                textAlign: 'left'
                              }}
                              onMouseEnter={(e) => {
                                if (!isCurrentSubActive) {
                                  e.currentTarget.style.background = theme === 'light' ? '#f1f5f9' : 'rgba(255, 255, 255, 0.04)';
                                  e.currentTarget.style.color = 'var(--text-main)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isCurrentSubActive) {
                                  e.currentTarget.style.background = 'transparent';
                                  e.currentTarget.style.color = 'var(--text-muted)';
                                }
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                                <SubIcon size={15} color={isCurrentSubActive ? (theme === 'light' ? '#0284c7' : '#38bdf8') : 'currentColor'} />
                                <span>{sub.label}</span>
                              </div>
                              {sub.badge && (
                                <span className={`badge ${sub.badgeType === 'info' ? 'badge-info' : 'badge-warning'}`} style={{ fontSize: '0.62rem', padding: '0.1rem 0.38rem' }}>
                                  {sub.badge}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: isActive
                      ? (theme === 'light'
                          ? 'linear-gradient(90deg, rgba(2, 132, 199, 0.12) 0%, rgba(2, 132, 199, 0.04) 100%)'
                          : 'linear-gradient(90deg, rgba(2, 132, 199, 0.25) 0%, rgba(2, 132, 199, 0.08) 100%)')
                      : 'transparent',
                    color: isActive ? (theme === 'light' ? '#0284c7' : '#38bdf8') : 'var(--text-muted)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                    borderLeft: isActive
                      ? `3px solid ${theme === 'light' ? '#0284c7' : '#38bdf8'}`
                      : '3px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = theme === 'light' ? '#f1f5f9' : 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.color = 'var(--text-main)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon size={19} color={isActive ? (theme === 'light' ? '#0284c7' : '#38bdf8') : 'currentColor'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`badge ${
                      item.badgeType === 'danger' ? 'badge-danger' :
                      item.badgeType === 'danger-pulse' ? 'badge-danger-pulse' :
                      item.badgeType === 'info' ? 'badge-info' :
                      'badge-warning'
                    }`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
  );
};
