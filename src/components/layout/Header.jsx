import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { BaharimasEmblem } from '../common/BaharimasLogo';
import {
  Ship,
  UserCheck,
  Search,
  Bell,
  RefreshCw,
  Sun,
  Moon,
  Menu,
  X
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
    openNCCount,
    resetToSeedData,
    setActiveTab,
    theme,
    toggleTheme,
    toggleMobileSidebar,
    isMobileSidebarOpen
  } = usePMS();

  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const totalUrgent = overdueWOCount + expiredDocsCount + openNCCount;

  // Render Vessel Select Options Helper
  const renderVesselOptions = () => (
    <>
      <option value="all">🌐 Seluruh Armada ({vessels.length} Kapal)</option>
      {vessels.some(v => !v.id.startsWith('v-op-') && v.ownershipStatus !== 'As Operator') && (
        <optgroup label={`⚓ AS OWNER (${vessels.filter(v => !v.id.startsWith('v-op-') && v.ownershipStatus !== 'As Operator').length} Kapal Milik)`}>
          {vessels.filter(v => !v.id.startsWith('v-op-') && v.ownershipStatus !== 'As Operator').map(v => (
            <option key={v.id} value={v.id}>
              🚢 {v.name} ({(v.type || '').split(' ')[0] || v.type || 'Kapal'}) [Owner]
            </option>
          ))}
        </optgroup>
      )}
      {vessels.some(v => v.id.startsWith('v-op-') || v.ownershipStatus === 'As Operator') && (
        <optgroup label={`⚙️ AS OPERATOR (${vessels.filter(v => v.id.startsWith('v-op-') || v.ownershipStatus === 'As Operator').length} Kapal Operasional)`}>
          {vessels.filter(v => v.id.startsWith('v-op-') || v.ownershipStatus === 'As Operator').map(v => (
            <option key={v.id} value={v.id}>
              ⚙️ {v.name} ({(v.type || '').split(' ')[0] || v.type || 'Kapal'}) [Operator]
            </option>
          ))}
        </optgroup>
      )}
    </>
  );

  return (
    <header className="app-header no-print">
      {/* Tier 1: Main Header Bar */}
      <div className="header-inner">
        {/* Left: Hamburger & Brand Emblem */}
        <div className="header-left">
          {/* Hamburger Menu Button (visible <= 1024px) */}
          <button
            onClick={toggleMobileSidebar}
            className={`header-hamburger-btn ${isMobileSidebarOpen ? 'active' : ''}`}
            aria-label="Buka Menu Navigasi"
            title="Menu Navigasi"
            type="button"
          >
            <Menu size={20} />
          </button>

          {/* Brand Logo & Name */}
          <div className="header-brand-box">
            <BaharimasEmblem size={24} />
            <div className="header-brand-text-wrapper">
              <span className="header-brand-title">BAHARIMAS</span>
              <span className="header-brand-subtitle">PMS</span>
            </div>
          </div>

          {/* Desktop/Tablet Vessel Selector */}
          <div className="header-vessel-container desktop-vessel">
            <Ship size={18} color="#38bdf8" className="header-vessel-icon" />
            <span className="header-vessel-label">Kapal:</span>
            <select
              value={selectedVesselId}
              onChange={(e) => setSelectedVesselId(e.target.value)}
              className="select-control header-vessel-select"
              aria-label="Pilih Kapal"
            >
              {renderVesselOptions()}
            </select>
          </div>

          {/* Desktop/Tablet Global Search */}
          <div className="header-search-wrapper desktop-search">
            <Search size={15} color="var(--text-subtle)" className="header-search-icon" />
            <input
              type="text"
              placeholder="Cari equipment, crew, dokumen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-control header-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="header-search-clear"
                type="button"
                aria-label="Bersihkan pencarian"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="header-right">
          {/* Mobile Search Toggle Button */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className={`btn-icon mobile-search-toggle ${showMobileSearch ? 'active' : ''}`}
            title="Cari"
            type="button"
            aria-label="Buka Pencarian"
          >
            {showMobileSearch ? <X size={17} /> : <Search size={17} />}
          </button>

          {/* Role Switcher (Desktop & Tablet) */}
          <div className="header-role-container">
            <UserCheck size={15} color="#06b6d4" />
            <span className="header-role-label">Peran:</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="header-role-select"
              aria-label="Ganti Peran"
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Fleet Manager">Fleet Manager</option>
              <option value="Admin Kapal / Nakhoda">Admin Kapal / Nakhoda</option>
              <option value="Teknisi / Chief Engineer">Teknisi / Chief Engineer</option>
              <option value="Crew / ABK">Crew / ABK</option>
              <option value="HR / Personalia">HR / Personalia</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          {/* Theme Toggle Button (Light / Dark Mode) */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm header-theme-btn"
            title={theme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            type="button"
          >
            {theme === 'dark' ? (
              <>
                <Sun size={15} color="#f59e0b" />
                <span className="header-action-label">Mode Terang</span>
              </>
            ) : (
              <>
                <Moon size={15} color="#0284c7" />
                <span className="header-action-label">Mode Gelap</span>
              </>
            )}
          </button>

          {/* Reset Seed Button (Desktop) */}
          <button
            onClick={resetToSeedData}
            className="btn btn-secondary btn-sm header-reset-btn desktop-reset"
            title="Reset ke data awal maritim"
            type="button"
          >
            <RefreshCw size={14} />
            <span className="header-action-label">Reset Data</span>
          </button>

          {/* Urgent Notification Bell */}
          <button
            onClick={() => setActiveTab('notifications')}
            className="header-bell-btn"
            title={`${totalUrgent} item mendesak / expired`}
            type="button"
            aria-label="Pusat Notifikasi"
          >
            <Bell size={18} />
            {totalUrgent > 0 && (
              <span className="header-bell-badge">
                {totalUrgent}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tier 2: Dedicated Mobile Vessel Selector Bar (Visible on mobile <= 768px) */}
      <div className="mobile-vessel-bar">
        <div className="mobile-vessel-bar-inner">
          <Ship size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
          <select
            value={selectedVesselId}
            onChange={(e) => setSelectedVesselId(e.target.value)}
            className="mobile-vessel-select"
            aria-label="Pilih Kapal Aktif"
          >
            {renderVesselOptions()}
          </select>
          <button
            onClick={resetToSeedData}
            className="mobile-reset-btn"
            title="Reset data percontohan"
            type="button"
            aria-label="Reset Data"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Mobile Expandable Search Bar Drawer */}
      {showMobileSearch && (
        <div className="mobile-search-tray">
          <Search size={16} color="var(--primary-light)" />
          <input
            type="text"
            placeholder="Cari kapal, dokumen, WO, equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mobile-search-input"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mobile-search-clear"
              type="button"
            >
              <X size={15} />
            </button>
          )}
        </div>
      )}
    </header>
  );
};
