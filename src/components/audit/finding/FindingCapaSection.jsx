/**
 * FindingCapaSection.jsx
 * Diekstrak dari AuditFindingModal.jsx (baris 641-737).
 * Sumber: SEKSI 4-6: Correction, Root Cause, Corrective Action
 */
import React from 'react';

export const FindingCapaSection = ({
  agreedDate,
  auditeeSignatureDate,
  correction,
  correctiveAction,
  rootCause,
  setAgreedDate,
  setAuditeeSignatureDate,
  setCorrection,
  setCorrectiveAction,
  setRootCause,
}) => {
  return (
    <>
      {/* SEKSI 4: PERBAIKAN / CORRECTION (to be completed by auditee) */}
                  <div style={{
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.85rem 1rem',
                    background: 'var(--bg-surface-elevated)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    opacity: 1
                  }}>
                    <label style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                      PERBAIKAN (diisi oleh pihak yang diaudit) / CORRECTION (to be completed by auditee)
                    </label>
                    <textarea
                      rows={2}
                      value={correction}
                      onChange={(e) => setCorrection(e.target.value)}
                      placeholder="Tindakan koreksi langsung atas ketidaksesuaian yang ditemukan..."
                      className="input-control"
                      style={{ fontSize: '0.8rem' }}
                    />
                  </div>

                  {/* SEKSI 5: ANALISA AKAR PERMASALAHAN / ROOT CAUSE ANALYSIS (to be completed by auditee) */}
                  <div style={{
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.85rem 1rem',
                    background: 'var(--bg-surface-elevated)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    opacity: 1
                  }}>
                    <label style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                      ANALISA AKAR PERMASALAHAN (diisi oleh pihak yang diaudit) / ROOT CAUSE ANALYSIS (to be completed by auditee)
                    </label>
                    <textarea
                      rows={2}
                      value={rootCause}
                      onChange={(e) => setRootCause(e.target.value)}
                      placeholder="Analisa penyebab utama kenapa kekurangan/ketidaksesuaian dapat terjadi..."
                      className="input-control"
                      style={{ fontSize: '0.8rem' }}
                    />
                  </div>

                  {/* SEKSI 6: TINDAKAN PERBAIKAN / CORRECTIVE ACTION (to be completed by auditee) */}
                  <div style={{
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.85rem 1rem',
                    background: 'var(--bg-surface-elevated)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    opacity: 1
                  }}>
                    <div>
                      <label style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                        TINDAKAN PERBAIKAN (diisi oleh pihak yang diaudit) / CORRECTIVE ACTION (to be completed by auditee)
                      </label>
                      <textarea
                        rows={2}
                        value={correctiveAction}
                        onChange={(e) => setCorrectiveAction(e.target.value)}
                        placeholder="Rencana tindakan pencegahan jangka panjang agar masalah serupa tidak terulang..."
                        className="input-control"
                        style={{ fontSize: '0.8rem' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-subtle)' }}>
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                          Tanggal kesepakatan penyelesaian / Agreed date for completion *
                        </label>
                        <input
                          type="date"
                          required
                          value={agreedDate}
                          onChange={(e) => setAgreedDate(e.target.value)}
                          className="input-control mono"
                          style={{ fontWeight: 800, color: '#0284c7' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                          Tanggal Pengesahan Auditee / Date
                        </label>
                        <input
                          type="date"
                          value={auditeeSignatureDate}
                          onChange={(e) => setAuditeeSignatureDate(e.target.value)}
                          className="input-control mono"
                        />
                      </div>
                    </div>
                  </div>
    </>
  );
};
