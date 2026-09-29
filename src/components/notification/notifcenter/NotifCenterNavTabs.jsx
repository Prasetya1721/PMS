/**
 * NotifCenterNavTabs.jsx
 * Diekstrak dari NotificationCenter.jsx (baris 607-662).
 * Sumber: Navigasi subtab
 */
import React from 'react';
import { Calendar, History, MessageSquare, ShieldAlert, Sliders } from 'lucide-react';

export const NotifCenterNavTabs = ({
  activeTab,
  allExpiringCount,
  closedNCCount,
  notificationLogs,
  openNCCount,
  setActiveTab,
}) => {
  return (
    <div className="glass-card" style={{ padding: '0.75rem 1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('automation')}
              className={`tab-btn ${activeTab === 'automation' ? 'active' : ''}`}
            >
              <Calendar size={16} />
              <span>Pengingat & Otomatisasi Multi-Interval</span>
              {allExpiringCount > 0 && (
                <span className="badge badge-warning" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                  {allExpiringCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
            >
              <History size={16} />
              <span>Log Riwayat Notifikasi ({notificationLogs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            >
              <Sliders size={16} />
              <span>Konfigurasi Ambang Batas & Auto-Send</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`tab-btn ${activeTab === 'simulator' ? 'active' : ''}`}
            >
              <MessageSquare size={16} />
              <span>Simulator & Template WhatsApp</span>
            </button>

            <button
              onClick={() => setActiveTab('audit_notif')}
              className={`tab-btn ${activeTab === 'audit_notif' ? 'active' : ''}`}
              style={openNCCount > 0 ? { borderColor: 'rgba(239, 68, 68, 0.4)' } : {}}
            >
              <ShieldAlert size={16} color={openNCCount > 0 ? '#ef4444' : '#10b981'} />
              <span>Notifikasi Audit ISM (NC Open & Close)</span>
              {openNCCount > 0 ? (
                <span className="badge badge-danger" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                  {openNCCount} Open
                </span>
              ) : closedNCCount > 0 ? (
                <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                  {closedNCCount} Close
                </span>
              ) : null}
            </button>
          </div>
  );
};
