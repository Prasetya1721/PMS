/**
 * VesselListInfoBar.jsx
 * Diekstrak dari VesselList.jsx (baris 213-238).
 * Sumber: Baris informasi ringkas jumlah armada dan status kepemilikan
 */
import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const VesselListInfoBar = ({
  allShipDocuments,
  vessels,
}) => {
  return (
    <div style={{
            padding: '0.85rem 1.25rem',
            borderRadius: '10px',
            background: 'rgba(2, 132, 199, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.825rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <ShieldCheck size={18} color="#38bdf8" />
              <span>
                <strong>Master Armada Kapal:</strong> Terdaftar total <strong>{vessels.length} entitas kapal</strong> ({vessels.filter(v => !v.id.startsWith('v-op-') && v.ownershipStatus !== 'As Operator').length} Kapal As Owner{vessels.some(v => v.id.startsWith('v-op-') || v.ownershipStatus === 'As Operator') ? `, ${vessels.filter(v => v.id.startsWith('v-op-') || v.ownershipStatus === 'As Operator').length} Kapal As Operator` : ''}), dengan total <strong>{allShipDocuments.length} Dokumen & Sertifikat BKI</strong>.
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>{vessels.filter(v => !v.id.startsWith('v-op-') && v.ownershipStatus !== 'As Operator').length} Kapal As Owner</span>
              {vessels.some(v => v.id.startsWith('v-op-') || v.ownershipStatus === 'As Operator') && (
                <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>{vessels.filter(v => v.id.startsWith('v-op-') || v.ownershipStatus === 'As Operator').length} Kapal As Operator</span>
              )}
              <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>{allShipDocuments.length} Sertifikat BKI</span>
            </div>
          </div>
  );
};
