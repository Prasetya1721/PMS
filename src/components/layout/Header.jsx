import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { BaharimasEmblem } from '../common/BaharimasLogo';
import { hasAccessWithOverrides, canPerformAction } from '../../utils/rbac';
import {
  Ship,
  UserCheck,
  Search,
  Bell,
  RefreshCw,
  Sun,
  Moon,
  Menu,
  X,
  Database,
  Trash2,
  AlertTriangle
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
    loadDemoData,
    clearAllData,
    exportFullDatabaseBackup,
    confirm,
    setActiveTab,
    theme,
    toggleTheme,
    toggleMobileSidebar,
    isMobileSidebarOpen,
    sidebarOverrides
  } = usePMS();

  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const totalUrgent = overdueWOCount + expiredDocsCount + openNCCount;

  // Izin aksi pembersihan data — hanya Super Admin atau peran dengan hak edit master data
  const canClearData = canPerformAction(currentRole, 'edit_master_data') ||
    hasAccessWithOverrides(currentRole, 'master_data', sidebarOverrides);

  const handleLoadDemo = async () => {
    const ok = await confirm({
      variant: 'info',
      icon: 'reset',
      title: 'Muat Data Demo Armada?',
      subtitle: 'Memuat data percontohan armada, peralatan, dan dokumen',
      message: 'Sistem akan memuat data percontohan resmi PT. Pelayaran Baharimas Kalimantan (17 kapal armada, peralatan mesin, log harian, sertifikat STCW & statutoria, dan audit ISM/BKI).\n\nData yang belum tersimpan akan tertimpa. Lanjutkan?',
      confirmLabel: 'Muat Demo',
      cancelLabel: 'Batal'
    });
    if (ok && loadDemoData) {
      loadDemoData();
    }
  };

  const handleClearData = async () => {
    // 1. Gerbang keamanan ketik HAPUS (aksi paling merusak di aplikasi)
    const confirmed = await confirm({
      variant: 'danger',
      icon: 'danger',
      title: 'Bersihkan Seluruh Data Sistem?',
      subtitle: 'Tindakan ini menghapus seluruh basis data operasional',
      message: 'Perhatian: Seluruh data kapal armada, peralatan mesin, jam operasi, sertifikat, work order, dan temuan audit akan dihapus permanen ke kondisi 0 data.\n\nKetik HAPUS untuk mengonfirmasi pembersihan data.',
      requireText: 'HAPUS',
      confirmLabel: 'Bersihkan Semua Data',
      cancelLabel: 'Batal'
    });

    if (!confirmed) return;

    // 2. Tawarkan ekspor backup pengaman sebelum benar-benar dihapus
    const wantBackup = await confirm({
      variant: 'info',
      icon: 'info',
      title: 'Simpan Salinan Cadangan (Backup)?',
      subtitle: 'Pengamanan arsip sebelum database dikosongkan',
      message: 'Apakah Anda ingin mengunduh salinan cadangan database (format JSON) sebelum data dibersihkan? File cadangan dapat dipulihkan sewaktu-waktu dari menu Data Master.',
      confirmLabel: 'Unduh Cadangan & Bersihkan',
      cancelLabel: 'Bersihkan Tanpa Cadangan'
    });

    if (wantBackup && exportFullDatabaseBackup) {
      exportFullDatabaseBackup();
    }

    if (clearAllData) {
      clearAllData();
    }
  };

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
              style={{ paddingLeft: '2.5rem', paddingRight: '2.2rem' }}
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
              <option value="Developer">Developer / IT Engineer</option>
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

          {/* Tombol Muat Data Demo (Desktop) */}
          <button
            onClick={handleLoadDemo}
            className="btn btn-secondary btn-sm header-reset-btn desktop-reset"
            title="Muat data contoh / demo armada maritim"
            type="button"
          >
            <Database size={14} color="#10b981" />
            <span className="header-action-label">Muat Demo</span>
          </button>

          {/* Tombol Bersihkan Semua Data (Desktop) — Hanya peran berwenang */}
          {canClearData && (
            <button
              onClick={handleClearData}
              className="btn btn-secondary btn-sm header-reset-btn desktop-reset"
              title="Kosongkan seluruh data operasional ke kondisi 0"
              style={{ color: '#ef4444' }}
              type="button"
            >
              <Trash2 size={14} />
              <span className="header-action-label">Bersihkan Data</span>
            </button>
          )}

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
            onClick={handleLoadDemo}
            className="mobile-reset-btn"
            title="Muat data contoh / demo armada"
            type="button"
            aria-label="Muat Data Demo"
          >
            <Database size={13} color="#10b981" />
          </button>
          {canClearData && (
            <button
              onClick={handleClearData}
              className="mobile-reset-btn"
              title="Bersihkan semua data sistem"
              type="button"
              aria-label="Bersihkan Semua Data"
              style={{ color: '#ef4444' }}
            >
              <Trash2 size={13} />
            </button>
          )}
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
