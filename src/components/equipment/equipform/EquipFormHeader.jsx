/**
 * EquipFormHeader.jsx
 * Diekstrak dari EquipmentFormModal.jsx (baris 195-249).
 * Sumber: Kepala modal: ikon mode tambah/edit, judul, subjudul, tombol tutup
 */
import React from 'react';
import { Cpu, Maximize2, Minimize2, Wrench, X } from 'lucide-react';

export const EquipFormHeader = ({
  equipment,
  isEdit,
  isFullscreen,
  onClose,
  setIsFullscreen,
}) => {
  return (
    <div className="modal-header" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: isEdit ? 'rgba(56, 189, 248, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isEdit ? '#38bdf8' : '#10b981'
                  }}
                >
                  {isEdit ? <Wrench size={22} /> : <Cpu size={22} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                    {isEdit ? `Edit Master Equipment: ${equipment.name}` : 'Tambah Master Equipment & Mesin Baru'}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                    {isEdit
                      ? `Pembaruan data teknis, spesifikasi, dan ambang jam operasi ${equipment.code}`
                      : 'Pendaftaran mesin baru ke database PMS armada PT. Pelayaran Baharimas Kalimantan'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsFullscreen(prev => !prev)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.35rem 0.6rem' }}
                  title={isFullscreen ? 'Keluar dari layar penuh' : 'Layar penuh'}
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
  );
};
