import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { BaharimasEmblem } from '../common/BaharimasLogo';
import { hasAccessWithOverrides, ROLE_DEFINITIONS } from '../../utils/rbac';
import { ProfileSettingsModal } from '../admin/ProfileSettingsModal';
import {
  LayoutDashboard,
  Ship,
  Wrench,
  CalendarClock,
  Package,
  DollarSign,
  Users,
  FileCheck,
  BellRing,
  FileSpreadsheet,
  ShieldCheck,
  Building2,
  ChevronDown,
  ChevronRight,
  LogOut,
  Sun,
  Moon,
  Database,
  UserCog,
  Palette,
  Shield,
  X
} from 'lucide-react';

export const Sidebar = () => {
  const {
    activeTab,
    setActiveTab,
    currentRole,
    overdueWOCount,
    expiredDocsCount,
    lowStockCount,
    openNCCount,
    smcOpenNCCount,
    docOpenNCCount,
    currentUser,
    logout,
    theme,
    toggleTheme,
    sidebarOverrides,
    siteConfig,
    isMobileSidebarOpen,
    closeMobileSidebar
  } = usePMS();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [auditSubmenuOpen, setAuditSubmenuOpen] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
    { id: 'fleet', label: 'Armada Kapal', icon: Ship },
    {
      id: 'audit',
      label: 'Audit & Kepatuhan ISM',
      icon: ShieldCheck,
      badge: openNCCount > 0 ? `${openNCCount} NC` : null,
      badgeType: 'warning',
      subItems: [
        {
          id: 'audit_smc',
          label: 'Audit SMC Kapal',
          icon: Ship,
          badge: smcOpenNCCount > 0 ? `${smcOpenNCCount} NC` : null,
          badgeType: 'warning'
        },
        {
          id: 'audit_doc',
          label: 'Audit DOC Kantor',
          icon: Building2,
          badge: docOpenNCCount > 0 ? `${docOpenNCCount} NC` : null,
          badgeType: 'info'
        }
      ]
    },
    {
      id: 'documents',
      label: 'Sertifikat & Dokumen',
      icon: FileCheck,
      badge: expiredDocsCount > 0 ? expiredDocsCount : null,
      badgeType: 'danger-pulse'
    },
    { id: 'equipment', label: 'Equipment & Running Hours', icon: Wrench },
    {
      id: 'maintenance',
      label: 'Planned Maintenance',
      icon: CalendarClock,
      badge: overdueWOCount > 0 ? overdueWOCount : null,
      badgeType: 'danger'
    },
    {
      id: 'spareparts',
      label: 'Logistik & Suku Cadang',
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : null,
      badgeType: 'warning'
    },
    { id: 'costs', label: 'Biaya & Anggaran Kapal', icon: DollarSign },
    { id: 'crew', label: 'Crew & Kehadiran', icon: Users },
    { id: 'notifications', label: 'Reminder & WA Bot', icon: BellRing },
    { id: 'reports', label: 'Laporan & Ekspor', icon: FileSpreadsheet },
    {
      id: 'master',
      label: 'Data Master (Admin)',
      icon: Database,
      badge: 'Admin',
      badgeType: 'info'
    },
    {
      id: 'settings',
      label: 'CMS Tampilan Login',
      icon: Palette,
      badge: 'CMS',
      badgeType: 'info'
    },
    {
      id: 'sidebar_management',
      label: 'Manajemen Sidebar',
      icon: Shield,
      badge: 'RBAC',
      badgeType: 'warning'
    }
  ];

  // Use sidebar overrides for access filtering
  const filteredNavItems = navItems.filter(item => hasAccessWithOverrides(currentRole, item.id, sidebarOverrides));

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        className={`sidebar-backdrop ${isMobileSidebarOpen ? 'active' : ''}`}
        onClick={closeMobileSidebar}
        aria-hidden="true"
      />

      <aside className={`sidebar-container ${isMobileSidebarOpen ? 'open' : ''}`}>
        {/* Brand Header */}
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

      {/* Navigation Items (Filtered by Current Role + Sidebar Overrides) */}
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

      {/* Role Profile Box & Logout */}
      <div style={{
        padding: '0.85rem 1rem 1rem',
        borderTop: '1px solid var(--border-subtle)',
        background: theme === 'light' ? '#ffffff' : 'rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        flexShrink: 0
      }}>
        {/* Quick Theme Switcher */}
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
      </div>

      {/* Profile Settings Modal */}
      {showProfileModal && (
        <ProfileSettingsModal onClose={() => setShowProfileModal(false)} />
      )}
    </aside>
    </>
  );
};

