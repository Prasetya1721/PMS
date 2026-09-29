/**
 * SmcSessionChecklistBanner.jsx
 * Diekstrak dari SmcSessionModal.jsx (baris 750-776).
 * Sumber: Banner preview checklist BKI
 */
import React from 'react';
import { CheckSquare } from 'lucide-react';

export const SmcSessionChecklistBanner = ({
  checklist,
}) => {
  return (
    <div style={{
                marginTop: '1.25rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckSquare size={18} color="#10b981" />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      Checklist Kelaiklautan SMC Kapal Siap Diperiksa ({checklist.length} Butir Klausul Resmi)
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Mengadopsi standar BKI F23.14.06-2024 Rev 05 mencakup Bagian A s.d. E (Kamar Mesin, Geladak, Navigasi, LSA/FFA, & Dokumen Awak).
                    </div>
                  </div>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.72rem', fontWeight: 800 }}>
                  ✓ 74 Klausul Terpasang
                </span>
              </div>
  );
};
