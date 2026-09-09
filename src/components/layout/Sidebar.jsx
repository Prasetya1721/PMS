import React from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Anchor,
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
  AlertTriangle
} from 'lucide-react';

export const Sidebar = () => {
  const {
    activeTab,
    setActiveTab,
    currentRole,
    overdueWOCount,
    expiredDocsCount,
    lowStockCount
  } = usePMS();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
    { id: 'fleet', label: 'Armada Kapal', icon: Ship },
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
      label: 'Sparepart & Stok',
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : null,
      badgeType: 'warning'
    },
    { id: 'costs', label: 'Biaya & Budgeting', icon: DollarSign },
    { id: 'crew', label: 'Crew & Kehadiran', icon: Users },
    {
      id: 'documents',
      label: 'Sertifikat & Dokumen',
      icon: FileCheck,
      badge: expiredDocsCount > 0 ? expiredDocsCount : null,
      badgeType: 'danger-pulse'
    },
    { id: 'notifications', label: 'Reminder & WA Bot', icon: BellRing },
    { id: 'reports', label: 'Laporan & Ekspor', icon: FileSpreadsheet }
  ];

  return (
    <aside style={{
      width: '270px',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      minHeight: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '1.5rem 1.25rem',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem'
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)',
          color: '#ffffff'
        }}>
          <Anchor size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1.2 }}>
            PMS KAPAL
          </h1>
          <p style={{ fontSize: '0.72rem', color: 'var(--primary-light)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Enterprise Fleet
          </p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav style={{ padding: '1rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem', overflowY: 'auto' }}>
        <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Menu Navigasi
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
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
                  ? 'linear-gradient(90deg, rgba(2, 132, 199, 0.25) 0%, rgba(2, 132, 199, 0.08) 100%)'
                  : 'transparent',
                color: isActive ? '#38bdf8' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.86rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'left',
                borderLeft: isActive ? '3px solid #38bdf8' : '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
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
                <Icon size={19} color={isActive ? '#38bdf8' : 'currentColor'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`badge ${
                  item.badgeType === 'danger' ? 'badge-danger' :
                  item.badgeType === 'danger-pulse' ? 'badge-danger-pulse' :
                  'badge-warning'
                }`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Role Profile Box */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.6rem 0.75rem',
          borderRadius: '8px',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--primary-dark)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.8rem'
          }}>
            <ShieldCheck size={16} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              Peran Aktif (RBAC)
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--primary-light)', fontWeight: 500 }}>
              {currentRole}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
