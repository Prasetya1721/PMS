/**
 * DocSessionChecklistBanner.jsx
 * Diekstrak dari DocSessionModal.jsx (baris 733-759).
 * Sumber: Banner preview checklist BKI DOC
 */
import React from 'react';
import { CheckSquare } from 'lucide-react';

export const DocSessionChecklistBanner = ({
  checklist,
}) => {
  return (
    <div style={{
                marginTop: '1.25rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckSquare size={18} color="#d97706" />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      Checklist Kepatuhan Kantor DOC BKI Siap Diperiksa ({checklist.length} Seksi Terintegrasi)
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Mengadopsi standar resmi BKI F23.14.05-2025 Rev 06 mencakup Kebijakan Keselamatan, Wewenang DPA, Kesiapan Darurat, Pemeliharaan & Review Manajemen.
                    </div>
                  </div>
                </div>
                <span className="badge badge-warning" style={{ fontSize: '0.72rem', fontWeight: 800 }}>
                  ✓ 13 Seksi DOC Terpasang
                </span>
              </div>
  );
};
