/**
 * ReportNcrSelector.jsx
 * Diekstrak dari AuditReportModal.jsx (baris 585-621).
 * Sumber: PEMILIH TEMUAN NCR (hanya tampil jika ada >1 temuan)
 */
import React from 'react';

export const ReportNcrSelector = ({
  selectedFindingId,
  sessionFindings,
  setSelectedFindingId,
}) => {
  return (
    <div
                className="no-print"
                style={{
                  padding: '0.5rem 1.25rem',
                  background: 'rgba(2, 132, 199, 0.08)',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.76rem'
                }}
              >
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Pilih Temuan NC untuk Dicetak:</span>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {sessionFindings.map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFindingId(f.id)}
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: selectedFindingId === f.id ? '1px solid #0284c7' : '1px solid var(--border-subtle)',
                        background: selectedFindingId === f.id ? '#0284c7' : 'var(--bg-surface)',
                        color: selectedFindingId === f.id ? '#ffffff' : 'var(--text-main)'
                      }}
                    >
                      {f.findingNo} ({f.clauseCode || f.status})
                    </button>
                  ))}
                </div>
              </div>
  );
};
