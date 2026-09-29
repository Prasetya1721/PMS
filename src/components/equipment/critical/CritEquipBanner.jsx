/**
 * CritEquipBanner.jsx
 * Diekstrak dari CriticalEquipmentView.jsx (baris 133-192).
 * Sumber: Banner merah ISM 10.3: judul, Explanation of Intent, tombol tambah uji
 */
import React from 'react';
import { Plus, Printer, ShieldAlert } from 'lucide-react';

export const CritEquipBanner = ({
  setShowPrintModal,
  setShowTestModal,
}) => {
  return (
    <div className="glass-card" style={{
            padding: '1.25rem 1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            background: 'linear-gradient(to right, rgba(239, 68, 68, 0.08), rgba(15, 23, 42, 0.5))',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f87171'
              }}>
                <ShieldAlert size={26} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#f87171' }}>
                    Peralatan Kritis & Pengujian Siap Darurat (Standar ISM Code 10.3)
                  </h3>
                  <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>
                    Mandatory ISM Audit
                  </span>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                  Peralatan teknis yang kegagalan mendadaknya dapat menimbulkan situasi bahaya navigasi atau keselamatan jiwa. Wajib diuji berkala dengan catatan bukti objektif.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <button
                onClick={() => setShowPrintModal(true)}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.5rem 0.9rem' }}
              >
                <Printer size={15} />
                <span>Format Cetak A4 / PDF</span>
              </button>

              <button
                onClick={() => setShowTestModal(true)}
                className="btn btn-primary"
                style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', background: '#ef4444', borderColor: '#ef4444' }}
              >
                <Plus size={16} />
                <span>Catat Pengujian Darurat Baru</span>
              </button>
            </div>
          </div>
  );
};
