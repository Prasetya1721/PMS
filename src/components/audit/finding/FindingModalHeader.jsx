/**
 * FindingModalHeader.jsx
 * Diekstrak dari AuditFindingModal.jsx (baris 289-352).
 * Sumber: Header modal (judul, badge, tombol aksi)
 */
import React from 'react';
import { Building2, Maximize2, Minimize2, Ship, Sparkles, X } from 'lucide-react';

export const FindingModalHeader = ({
  auditType,
  externalOrg,
  handleLoadSampleRP2004,
  isFullscreen,
  onClose,
  reportId,
  setIsFullscreen,
}) => {
  return (
    <div className="modal-header" style={{ borderBottom: '2px solid var(--border-subtle)', padding: '1rem 1.5rem', background: 'var(--bg-surface-elevated)', backgroundColor: 'var(--bg-surface-elevated)', opacity: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: auditType === 'Internal' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  flexShrink: 0
                }}>
                  {auditType === 'Internal' ? <Ship size={24} /> : <Building2 size={24} />}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: 0 }}>
                      Laporan Audit ISM – Code / ISM – Code Audit Report
                    </h3>
                    <span className={`badge ${auditType === 'Internal' ? 'badge-info' : 'badge-warning'}`} style={{ fontWeight: 800 }}>
                      {auditType === 'Internal' ? 'INTERNAL BAHARIMAS' : `EKSTERNAL: ${externalOrg}`}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
                    Format Resmi Informasi Ketidaksesuaian (NCR) • Report ID: <strong className="mono" style={{ color: 'var(--text-main)' }}>{reportId}</strong>
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleLoadSampleRP2004}
                  className="btn btn-secondary btn-sm"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#0284c7',
                    border: '1px solid #0284c7'
                  }}
                  title="Muat contoh lengkap sesuai foto formulir RP 2004 (Klausul 5.1.5)"
                >
                  <Sparkles size={14} color="#0284c7" />
                  <span>Muat Contoh RP 2004 (5.1.5)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.6rem' }}
                >
                  {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                  <span style={{ fontSize: '0.75rem' }}>{isFullscreen ? 'Normal' : 'Fullscreen'}</span>
                </button>
                <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.6rem' }}>
                  <X size={16} />
                </button>
              </div>
            </div>
  );
};
