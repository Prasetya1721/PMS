import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { BaharimasEmblem } from '../common/BaharimasLogo';
import { hasAccessWithOverrides, ROLE_DEFINITIONS } from '../../utils/rbac';
import { ProfileSettingsModal } from '../admin/ProfileSettingsModal';
import { SidebarBrandHeader } from './sidebar/SidebarBrandHeader';
import { SidebarNavItems } from './sidebar/SidebarNavItems';
import { SidebarThemeSwitcher } from './sidebar/SidebarThemeSwitcher';
import { SidebarProfileBox } from './sidebar/SidebarProfileBox';
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
  Terminal,
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
    },
    {
      id: 'developer_api',
      label: 'Developer & API Keys',
      icon: Terminal,
      badge: 'Dev',
      badgeType: 'purple'
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
        <SidebarBrandHeader
          closeMobileSidebar={closeMobileSidebar}
          siteConfig={siteConfig}
          theme={theme}
        />

      {/* Navigation Items (Filtered by Current Role + Sidebar Overrides) */}
      <SidebarNavItems
        activeTab={activeTab}
        auditSubmenuOpen={auditSubmenuOpen}
        filteredNavItems={filteredNavItems}
        setActiveTab={setActiveTab}
        setAuditSubmenuOpen={setAuditSubmenuOpen}
        theme={theme}
      />

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
        <SidebarThemeSwitcher
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <SidebarProfileBox
          currentRole={currentRole}
          currentUser={currentUser}
          logout={logout}
          setShowProfileModal={setShowProfileModal}
          theme={theme}
        />
      </div>

      {/* Profile Settings Modal */}
      {showProfileModal && (
        <ProfileSettingsModal onClose={() => setShowProfileModal(false)} />
      )}
    </aside>
    </>
  );
};

