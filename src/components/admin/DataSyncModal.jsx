import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Download,
  Upload,
  RefreshCw,
  Database,
  AlertTriangle,
  X,
  Ship,
  HardDrive
} from 'lucide-react';

export const DataSyncModal = ({ onClose }) => {
  const {
    vessels,
    exportShipSyncPackage,
    exportFullDatabaseBackup,
    importSyncPackage,
    restoreFullDatabase,
    showToast
  } = usePMS();

  const [activeTab, setActiveTab] = useState('vessel_sync'); // 'vessel_sync' | 'full_backup'
  const [selectedVesselId, setSelectedVesselId] = useState(vessels[0]?.id || 'v-001');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExportVessel = () => {
    exportShipSyncPackage(selectedVesselId);
  };

  const handleExportFullBackup = () => {
    exportFullDatabaseBackup();
  };

  const handleFileUpload = (e, isFullRestore = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (isFullRestore) {
          if (window.confirm('PERINGATAN: Memulihkan database penuh akan menimpa seluruh data sistem saat ini dengan data cadangan. Lanjutkan?')) {
            restoreFullDatabase(parsed);
            onClose();
          }
        } else {
          importSyncPackage(parsed);
          onClose();
        }
      } catch (err) {
        showToast('Format file paket sinkronisasi tidak valid (harus file JSON).', 'danger');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(10, 16, 30, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.25rem'
    }}>
      <div className="glass-card" style={{
        width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto',
        borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.35)',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'linear-gradient(to right, rgba(2, 132, 199, 0.12), rgba(15, 23, 42, 0.6))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <RefreshCw size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                Sinkronisasi Data Kapal-Darat & Cadangan Basis Data
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                Fasilitas transmisi data antar komputer kapal (*Offline Onboard*) dan server kantor pusat Pontianak.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 1.75rem', background: 'rgba(255,255,255,0.01)' }}>
          <button
            onClick={() => setActiveTab('vessel_sync')}
            className={`tab-btn ${activeTab === 'vessel_sync' ? 'active' : ''}`}
            style={{ padding: '0.85rem 1.25rem', fontSize: '0.875rem' }}
          >
            <Ship size={16} />
            <span>Paket Sinkronisasi Kapal (Ship-to-Shore Sync)</span>
          </button>
          <button
            onClick={() => setActiveTab('full_backup')}
            className={`tab-btn ${activeTab === 'full_backup' ? 'active' : ''}`}
            style={{ padding: '0.85rem 1.25rem', fontSize: '0.875rem' }}
          >
            <Database size={16} />
            <span>Cadangan Penuh Database (Full Backup / Restore)</span>
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {activeTab === 'vessel_sync' ? (
            <>
              <div style={{
                padding: '1.25rem',
                borderRadius: '12px',
                background: 'rgba(2, 132, 199, 0.06)',
                border: '1px solid rgba(2, 132, 199, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Download size={18} color="#38bdf8" />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                    1. Di Kapal: Ekspor Paket Sinkronisasi Kapal (*Ship-Side Export*)
                  </h4>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                  Gunakan saat kru di atas kapal selesai menginput jam jalan mesin, log servis, atau temuan harian secara *offline*. Unduh file paket data ini lalu kirimkan via email/WhatsApp saat kapal merapat atau tersambung internet.
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <select
                    value={selectedVesselId}
                    onChange={(e) => setSelectedVesselId(e.target.value)}
                    className="input-base"
                    style={{ flex: 1, minWidth: '220px' }}
                  >
                    {vessels.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.type})</option>
                    ))}
                  </select>

                  <button
                    onClick={handleExportVessel}
                    className="btn btn-primary"
                    style={{ padding: '0.6rem 1.25rem' }}
                  >
                    <Download size={16} />
                    <span>Unduh Paket Sinkronisasi (.json)</span>
                  </button>
                </div>
              </div>

              <div style={{
                padding: '1.25rem',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.06)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Upload size={18} color="#10b981" />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                    2. Di Kantor Darat: Impor & Gabungkan Pembaruan Kapal (*Shore-Side Merge*)
                  </h4>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                  Unggah file `.json` yang dikirim dari kapal. Sistem kantor pusat akan secara cerdas memperbarui jam mesin, riwayat servis, dan pemakaian sparepart tanpa menghapus data kapal lain.
                </p>

                <label className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content', cursor: 'pointer' }}>
                  <Upload size={16} />
                  <span>Pilih & Impor File Paket Kapal</span>
                  <input
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e, false)}
                  />
                </label>
              </div>
            </>
          ) : (
            <>
              <div style={{
                padding: '1.25rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HardDrive size={18} color="#f59e0b" />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                    Ekspor Cadangan Penuh (Full Database Backup)
                  </h4>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                  Mengunduh seluruh database sistem (armada, mesin, dokumen, kru, keuangan, audit, inventaris) menjadi 1 file cadangan lengkap berstempel tanggal.
                </p>

                <button
                  onClick={handleExportFullBackup}
                  className="btn btn-primary"
                  style={{ width: 'fit-content', padding: '0.6rem 1.25rem' }}
                >
                  <Download size={16} />
                  <span>Unduh File Cadangan Penuh (.json)</span>
                </button>
              </div>

              <div style={{
                padding: '1.25rem',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={18} color="#f87171" />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#f87171' }}>
                    Pemulihan Database (Restore Database)
                  </h4>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                  Menimpa seluruh data sistem saat ini dengan file cadangan. Digunakan saat migrasi komputer atau pemulihan setelah kegagalan perangkat keras.
                </p>

                <label className="btn btn-neutral" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content', cursor: 'pointer', borderColor: '#f87171', color: '#f87171' }}>
                  <Upload size={16} />
                  <span>Pilih File Backup untuk Di-Restore</span>
                  <input
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e, true)}
                  />
                </label>
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <button
              onClick={onClose}
              className="btn btn-neutral"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
