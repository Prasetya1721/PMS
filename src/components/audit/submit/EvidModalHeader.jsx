/**
 * EvidModalHeader.jsx
 * Diekstrak dari SubmitEvidenceModal.jsx (baris 192-232).
 * Sumber: Kepala modal: ikon status temuan (NC Close / Eviden Submitted / Open), judul, nomor NC, tombol tutup
 */
import React from 'react';
import { CheckCircle2, Maximize2, Minimize2, ShieldCheck, X } from 'lucide-react';

export const EvidModalHeader = ({
  finding,
  isFullscreen,
  onClose,
  setIsFullscreen,
}) => {
  return (
    <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  padding: '0.5rem',
                  borderRadius: '10px',
                  background: finding.status === 'NC Close' ? 'rgba(16, 185, 129, 0.15)' : finding.status === 'Eviden Submitted' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: finding.status === 'NC Close' ? '#10b981' : finding.status === 'Eviden Submitted' ? '#f59e0b' : '#ef4444'
                }}>
                  {finding.status === 'NC Close' ? <CheckCircle2 size={24} /> : <ShieldCheck size={24} />}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 className="mono" style={{ fontSize: '1.15rem', fontWeight: 800 }}>{finding.findingNo}</h3>
                    <span className={`badge ${
                      finding.status === 'NC Close' ? 'badge-success' : finding.status === 'Eviden Submitted' ? 'badge-warning' : 'badge-danger-pulse'
                    }`}>
                      {finding.status}
                    </span>
                    <span className="badge badge-neutral">{finding.category}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Klausul: <strong className="mono" style={{ color: '#0284c7' }}>{finding.clauseCode}</strong> - {finding.clauseName}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.6rem' }}
                  title={isFullscreen ? 'Kecilkan Layar' : 'Layar Penuh (Fullscreen)'}
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
