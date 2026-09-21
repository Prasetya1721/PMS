import React from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  LayoutDashboard,
  Ship,
  CalendarClock,
  FileCheck,
  Menu,
  X
} from 'lucide-react';

export const MobileBottomNav = () => {
  const {
    activeTab,
    setActiveTab,
    overdueWOCount,
    expiredDocsCount,
    openNCCount,
    isMobileSidebarOpen,
    toggleMobileSidebar
  } = usePMS();

  const totalUrgentIssues = overdueWOCount + expiredDocsCount + openNCCount;

  const navButtons = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      action: () => setActiveTab('dashboard'),
      isActive: activeTab === 'dashboard' && !isMobileSidebarOpen
    },
    {
      id: 'fleet',
      label: 'Armada',
      icon: Ship,
      action: () => setActiveTab('fleet'),
      isActive: activeTab === 'fleet' && !isMobileSidebarOpen
    },
    {
      id: 'maintenance',
      label: 'Servis',
      icon: CalendarClock,
      action: () => setActiveTab('maintenance'),
      isActive: activeTab === 'maintenance' && !isMobileSidebarOpen,
      badge: overdueWOCount > 0 ? overdueWOCount : null,
      badgeColor: '#ef4444'
    },
    {
      id: 'documents',
      label: 'Dokumen',
      icon: FileCheck,
      action: () => setActiveTab('documents'),
      isActive: activeTab === 'documents' && !isMobileSidebarOpen,
      badge: expiredDocsCount > 0 ? expiredDocsCount : null,
      badgeColor: '#ef4444'
    },
    {
      id: 'menu',
      label: isMobileSidebarOpen ? 'Tutup' : 'Menu',
      icon: isMobileSidebarOpen ? X : Menu,
      action: toggleMobileSidebar,
      isActive: isMobileSidebarOpen,
      badge: totalUrgentIssues > 0 && !isMobileSidebarOpen ? '!' : null,
      badgeColor: '#f59e0b'
    }
  ];

  return (
    <nav className="mobile-bottom-nav no-print" aria-label="Navigasi Bawah Ponsel">
      {navButtons.map((btn) => {
        const Icon = btn.icon;
        return (
          <button
            key={btn.id}
            onClick={btn.action}
            className={`mobile-bottom-nav-item ${btn.isActive ? 'active' : ''}`}
            type="button"
          >
            <div className="mobile-bottom-icon-wrapper">
              <Icon size={20} strokeWidth={btn.isActive ? 2.4 : 1.9} />
              {btn.badge && (
                <span
                  className="mobile-nav-badge"
                  style={{ backgroundColor: btn.badgeColor }}
                >
                  {btn.badge}
                </span>
              )}
            </div>
            <span className="mobile-bottom-label">{btn.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
