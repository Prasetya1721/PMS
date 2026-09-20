import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Shield,
  Save,
  RotateCcw,
  Palette,
  Layers,
  Check,
  AlertCircle
} from 'lucide-react';
import { ROLE_DEFINITIONS, ROLE_PERMISSIONS } from '../../utils/rbac';

const ALL_MODULES = [
  { id: 'dashboard', label: 'Dashboard Utama & Ringkasan', desc: 'Statistik armada, peta radar kapal, grafik operasional' },
  { id: 'fleet', label: 'Daftar Armada Kapal', desc: 'Database kapal tunda (tugboat), tongkang, sertifikat & spesifikasi' },
  { id: 'equipment', label: 'Peralatan & Running Hours', desc: 'Jam kerja mesin utama, genset, kompresor, dan pompa' },
  { id: 'maintenance', label: 'Maintenance & Work Orders', desc: 'Jadwal servis berkala, checklist perawatan, penugasan teknisi' },
  { id: 'spareparts', label: 'Inventaris & Spare Parts', desc: 'Stok suku cadang kamar mesin, minimum buffer, purchasing request' },
  { id: 'costs', label: 'Manajemen Biaya & Anggaran', desc: 'Pencatatan pengeluaran servis, docking, spareparts per kapal' },
  { id: 'crew', label: 'Manajemen Kru & Personalia', desc: 'Data nakhoda, ABK, KKM, mutasi kru, dan absensi harian' },
  { id: 'documents', label: 'Radar Sertifikat & Dokumen', desc: 'Pelacak masa berlaku sertifikat kapal (BKI, Hubla) & kru (STCW)' },
  { id: 'audit', label: 'Audit ISM & Safety Internal', desc: 'Checklist kepatuhan ISM Code, temuan inspeksi kapal, verifikasi' },
  { id: 'notifications', label: 'Reminder & Notifikasi WA', desc: 'Pengingat otomatis sertifikat expired dan servis mesin lewat WA' },
  { id: 'reports', label: 'Laporan & Ekspor Data', desc: 'Ekspor laporan operasional bulanan format PDF & Excel' },
  { id: 'master', label: 'Data Master (Admin)', desc: 'Pengaturan master kapal, jenis peralatan, dan template dokumen' }
];

export const SidebarManagementAdmin = () => {
  const {
    sidebarOverrides,
    updateSidebarOverrides,
    setActiveTab,
    showToast
  } = usePMS();

  const [localOverrides, setLocalOverrides] = useState({ ...sidebarOverrides });
  const [isSaved, setIsSaved] = useState(false);

  // Exclude Super Admin since Super Admin always has 100% full access
  const roles = Object.keys(ROLE_DEFINITIONS).filter(r => r !== 'Super Admin');

  const isModuleEnabledForRole = (role, moduleId) => {
    const defaultPerms = ROLE_PERMISSIONS[role] || [];
    const override = localOverrides[role];
    if (override && Array.isArray(override)) {
      return override.includes(moduleId);
    }
    return defaultPerms.includes(moduleId);
  };

  const toggleModuleForRole = (role, moduleId) => {
    const currentPerms = localOverrides[role] || [...(ROLE_PERMISSIONS[role] || [])];
    let newPerms;
    if (currentPerms.includes(moduleId)) {
      newPerms = currentPerms.filter(m => m !== moduleId);
    } else {
      newPerms = [...currentPerms, moduleId];
    }
    setLocalOverrides(prev => ({ ...prev, [role]: newPerms }));
  };

  const handleSave = () => {
    updateSidebarOverrides(localOverrides);
    setIsSaved(true);
    showToast('Hak akses modul sidebar berhasil disimpan dan aktif!', 'success');
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleResetDefault = () => {
    if (window.confirm('Kembalikan seluruh hak akses modul sidebar ke default sistem PT Baharimas?')) {
      const resetObj = {};
      roles.forEach(r => {
        resetObj[r] = [...(ROLE_PERMISSIONS[r] || [])];
      });
      setLocalOverrides(resetObj);
      updateSidebarOverrides(resetObj);
      showToast('Hak akses sidebar dikembalikan ke default.', 'info');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '1.25rem 1.75rem',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(37, 99, 235, 0.3)'
          }}>
            <Shield size={24} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Manajemen Hak Akses Sidebar (Role-Based Matrix)
            </h1>
            <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
              Atur menu navigasi apa saja yang dapat dilihat oleh setiap jabatan operasional kapal dan kantor PT. Baharimas.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#1e3a8a',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
            onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
          >
            <Palette size={15} color="#2563eb" />
            <span>Buka CMS Tampilan Login</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefault}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
          >
            <RotateCcw size={15} />
            <span>Reset Default RBAC</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1.35rem',
              borderRadius: '8px',
              border: 'none',
              background: isSaved ? '#16a34a' : '#1e3a8a',
              color: '#ffffff',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            {isSaved ? <Check size={16} /> : <Save size={16} />}
            <span>{isSaved ? 'Hak Akses Tersimpan!' : 'Simpan Hak Akses'}</span>
          </button>
        </div>
      </div>

      {/* Info Notice Banner */}
      <div style={{
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '12px',
        padding: '0.9rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <AlertCircle size={18} color="#2563eb" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.825rem', color: '#1e3a8a', lineHeight: 1.5 }}>
            <strong>Super Admin</strong> memiliki akses absolut ke 100% modul sistem dan tidak dapat dinonaktifkan demi keamanan. Centang atau hapus centang di bawah untuk mengatur visibilitas modul bagi masing-masing peran staf lainnya.
          </span>
        </div>
        <span style={{ fontSize: '0.72rem', background: '#dbeafe', color: '#1d4ed8', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontWeight: 700 }}>
          {roles.length} Peran Dikonfigurasi
        </span>
      </div>

      {/* Main Permissions Matrix Table Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="#2563eb" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Matriks Modul & Visibilitas Peran
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Total {ALL_MODULES.length} Modul Operasional
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '0.9rem 1.25rem', color: '#334155', fontWeight: 700, minWidth: '260px' }}>
                  Nama Modul Sistem
                </th>
                {roles.map(r => {
                  const roleDef = ROLE_DEFINITIONS[r] || {};
                  return (
                    <th key={r} style={{ textAlign: 'center', padding: '0.9rem 0.75rem', color: '#1e293b', fontWeight: 700, minWidth: '130px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                        <span>{roleDef.shortLabel || r}</span>
                        <span style={{
                          fontSize: '0.65rem',
                          padding: '0.1rem 0.45rem',
                          borderRadius: '4px',
                          background: `${roleDef.color || '#2563eb'}18`,
                          color: roleDef.color || '#2563eb',
                          fontWeight: 700
                        }}>
                          {r.split('/')[0].trim()}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {ALL_MODULES.map((mod, idx) => (
                <tr
                  key={mod.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    background: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#ffffff' : '#fafafa'}
                >
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>
                      {mod.label}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.15rem' }}>
                      {mod.desc}
                    </div>
                  </td>
                  {roles.map(role => {
                    const enabled = isModuleEnabledForRole(role, mod.id);
                    return (
                      <td key={role} style={{ textAlign: 'center', padding: '0.85rem 0.75rem' }}>
                        <label style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '0.25rem' }}>
                          <input
                            type="checkbox"
                            checked={enabled}
                            onChange={() => toggleModuleForRole(role, mod.id)}
                            style={{
                              width: '18px',
                              height: '18px',
                              accentColor: '#2563eb',
                              cursor: 'pointer'
                            }}
                          />
                        </label>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          padding: '1.25rem 1.5rem',
          borderTop: '1px solid #e2e8f0',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            💡 Centang modul untuk memberikan izin tampil di navigasi kiri masing-masing akun staf.
          </span>
          <button
            type="button"
            onClick={handleSave}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              background: '#1e3a8a',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)'
            }}
          >
            <Save size={16} />
            <span>Simpan Perubahan Hak Akses</span>
          </button>
        </div>
      </div>
    </div>
  );
};
