/**
 * ShipParticularsNotes.jsx
 * Diekstrak dari ShipParticularsView.jsx.orig (baris 533-550).
 * Sumber: Catatan kaki dokumen resmi dan daftar distribusi
 */
import React from 'react';

export const ShipParticularsNotes = ({
  vessel,
}) => {
  return (
    <div
              className="particulars-footer-note"
              style={{
                paddingTop: '0.5rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '6.5pt',
                color: '#64748b'
              }}
            >
              <div>
                Dokumen Teknis Resmi PT. Pelayaran Baharimas Kalimantan • Sistem Manajemen Armada PMS Cloud
              </div>
              <div>
                Distribusi: 1. Arsip Kantor Darat Pontianak | 2. Onboard {vessel.name} | 3. Arsip Syahbandar / BKI
              </div>
            </div>
  );
};
