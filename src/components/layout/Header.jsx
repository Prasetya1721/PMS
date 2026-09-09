import React from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Ship,
  UserCheck,
  Search,
  Bell,
  RefreshCw,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

export const Header = () => {
  const {
    vessels,
    selectedVesselId,
    setSelectedVesselId,
    currentRole,
    setCurrentRole,
    searchQuery,
    setSearchQuery,
    overdueWOCount,
    expiredDocsCount,
    resetToSeedData,
    setActiveTab
  } = usePMS();

  const totalUrgent = overdueWOCount + expiredDocsCount;

  return (
    <header style={{
      height: '70px',
      background: 'var(--bg-header)',
      backdropFilter: 'var(--glass-blur)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem'
    }}>
      {/* Left: Vessel Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Ship size={20} color="#38bdf8" />
          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>Kapal:</span>
          <select
            value={selectedVesselId}
            onChange={(e) => setSelectedVesselId(e.target.value)}
            className="select-control"
            style={{ width: '240px', fontWeight: 600, background: 'var(--bg-surface)' }}
          >
            <option value="all">🌐 Seluruh Armada (Fleet Level)</option>
            {vessels.map(v => (
              <option key={v.id} value={v.id}>
                🚢 {v.name} ({v.type.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>

        {/* Global Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Cari equipment, crew, dokumen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-control"
            style={{ paddingLeft: '2.4rem', fontSize: '0.825rem' }}
          />
        </div>
      </div>

      {/* Right: Role Switcher, Reset, Alert Bell */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Role Switcher (RBAC Tester) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-surface-elevated)', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <UserCheck size={16} color="#06b6d4" />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>Peran:</span>
          <select
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#38bdf8',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="Super Admin" style={{ background: '#0f1c35' }}>Super Admin</option>
            <option value="Fleet Manager" style={{ background: '#0f1c35' }}>Fleet Manager</option>
            <option value="Admin Kapal / Nakhoda" style={{ background: '#0f1c35' }}>Admin Kapal / Nakhoda</option>
            <option value="Teknisi / Chief Engineer" style={{ background: '#0f1c35' }}>Teknisi / Chief Engineer</option>
            <option value="Crew / ABK" style={{ background: '#0f1c35' }}>Crew / ABK</option>
            <option value="HR / Personalia" style={{ background: '#0f1c35' }}>HR / Personalia</option>
            <option value="Finance" style={{ background: '#0f1c35' }}>Finance</option>
          </select>
        </div>

        {/* Reset Seed Button */}
        <button
          onClick={resetToSeedData}
          className="btn btn-secondary btn-sm"
          title="Reset ke data awal maritim"
          style={{ padding: '0.45rem 0.75rem', fontSize: '0.78rem' }}
        >
          <RefreshCw size={14} />
          <span>Reset Data</span>
        </button>

        {/* Urgent Notification Bell */}
        <button
          onClick={() => setActiveTab('notifications')}
          style={{
            position: 'relative',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-main)',
            transition: 'all 0.15s ease'
          }}
          title={`${totalUrgent} item mendesak / expired`}
        >
          <Bell size={18} />
          {totalUrgent > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#ef4444',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 800,
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
            }}>
              {totalUrgent}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
