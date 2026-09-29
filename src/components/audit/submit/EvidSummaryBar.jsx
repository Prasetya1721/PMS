/**
 * EvidSummaryBar.jsx
 * Diekstrak dari SubmitEvidenceModal.jsx (baris 327-349).
 * Sumber: Baris ringkasan alur tanggung jawab Nakhoda dan DPA
 */
import React from 'react';

export const EvidSummaryBar = ({
}) => {
  return (
    <div style={{
                padding: '0.65rem 0.95rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(2, 132, 199, 0.08) 100%)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
                fontSize: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-success" style={{ fontSize: '0.68rem', fontWeight: 800 }}>🚢 Bagian 1: Nakhoda</span>
                  <span style={{ color: 'var(--text-muted)' }}>➔ Tindakan Koreksi, RCA & Eviden Fisik</span>
                  <span style={{ color: 'var(--border-subtle)' }}>|</span>
                  <span className="badge badge-info" style={{ fontSize: '0.68rem', fontWeight: 800 }}>🏢 Bagian 2: DPA</span>
                  <span style={{ color: 'var(--text-muted)' }}>➔ Verifikasi Efektivitas & Otorisasi Tutup NC</span>
                </div>
                <div style={{ color: 'var(--text-subtle)', fontSize: '0.72rem' }}>
                  Standar Regulasi: <strong>ISM Code Klausul 9 (Laporan Ketidaksesuaian & Tindakan Korektif)</strong>
                </div>
              </div>
  );
};
