/**
 * SafeManningHeader.jsx
 * Diekstrak dari SafeManningMatrixModal.jsx (baris 161-238).
 * Sumber: Kepala modal no-print: ikon status kepatuhan, judul, ringkasan, tombol mode cetak dan tutup
 */
import React from 'react';
import { ArrowLeft, Printer, ShieldAlert, ShieldCheck, X } from 'lucide-react';

export const SafeManningHeader = ({
  currentVessel,
  handlePrint,
  matrixEvaluation,
  onClose,
  setViewMode,
  viewMode,
}) => {
  return (
    <div className="no-print" style={{
              padding: '1.25rem 1.75rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(to right, rgba(2, 132, 199, 0.12), rgba(15, 23, 42, 0.6))'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: matrixEvaluation.isCompliant ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: matrixEvaluation.isCompliant ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: matrixEvaluation.isCompliant ? '#10b981' : '#f87171'
                }}>
                  {matrixEvaluation.isCompliant ? <ShieldCheck size={26} /> : <ShieldAlert size={26} />}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                      {viewMode === 'print_preview'
                        ? 'Format Cetak Lembar Evaluasi Safe Manning'
                        : 'Kepatuhan Formasi Awak Kapal (Safe Manning Matrix)'}
                    </h3>
                    <span className={`badge ${matrixEvaluation.isCompliant ? 'badge-success' : 'badge-danger'}`}>
                      {matrixEvaluation.isCompliant ? 'Memenuhi Syarat Kelaiklautan' : 'Non-Compliant (Formasi Tidak Lengkap)'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                    Kapal: <strong style={{ color: 'var(--text-main)' }}>{currentVessel?.name}</strong> ({currentVessel?.type}) • Standar Kemenhub DJPL & STCW 2010.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {viewMode === 'interactive' ? (
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                  >
                    <Printer size={15} />
                    <span>Format Cetak A4 / PDF</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setViewMode('interactive')}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                    >
                      <ArrowLeft size={15} />
                      <span>Kembali ke Matrix</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="btn btn-primary"
                      style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', fontWeight: 700 }}
                    >
                      <Printer size={15} />
                      <span>Cetak Dokumen Sekarang</span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={22} />
                </button>
              </div>
            </div>
  );
};
