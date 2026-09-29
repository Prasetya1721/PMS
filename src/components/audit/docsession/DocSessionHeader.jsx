/**
 * DocSessionHeader.jsx
 * Diekstrak dari DocSessionModal.jsx (baris 271-327).
 * Sumber: Header modal (judul kantor + tombol tutup & fullscreen)
 */
import React from 'react';
import { Building2, Maximize2, Minimize2, X } from 'lucide-react';

export const DocSessionHeader = ({
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
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Building2 size={22} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                      {isEdit ? 'Edit Sesi Audit DOC Kantor Perusahaan' : 'Formulir Sesi Audit DOC Kantor Perusahaan (Document of Compliance)'}
                    </h3>
                    <span className="badge badge-warning" style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                      🏢 STANDAR DOC KANTOR
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    Tahap 1: Inisiasi data kantor pusat PT. PBK, sertifikat DOC, departemen darat, dan jadwal pemeriksaan BKI Rev 06 (13 Seksi).
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
