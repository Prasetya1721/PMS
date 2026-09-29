/**
 * SmcSessionHeader.jsx
 * Diekstrak dari SmcSessionModal.jsx (baris 294-350).
 * Sumber: Header modal (judul kapal + tombol tutup & fullscreen)
 */
import React from 'react';
import { Maximize2, Minimize2, Ship, X } from 'lucide-react';

export const SmcSessionHeader = ({
  isEdit,
  isFullscreen,
  onClose,
  setIsFullscreen,
}) => {
  return (
    <div style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-surface-elevated)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(2, 132, 199, 0.15)',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Ship size={22} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                      {isEdit ? 'Edit Sesi Audit SMC Kapal' : 'Formulir Sesi Audit SMC Kapal (Shipboard)'}
                    </h3>
                    <span className="badge badge-primary" style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                      🚢 STANDAR SMC KAPAL
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    Tahap 1: Inisiasi data kapal, sertifikat SMC, personil nakhoda/auditor, dan jadwal pemeriksaan BKI Rev 05.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.4rem', borderRadius: '6px' }}
                  title={isFullscreen ? 'Kecilkan' : 'Perbesar Layar Penuh'}
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.4rem', borderRadius: '6px' }}
                  title="Tutup Formulir"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
  );
};
