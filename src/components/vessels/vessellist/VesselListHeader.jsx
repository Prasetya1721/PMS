/**
 * VesselListHeader.jsx
 * Diekstrak dari VesselList.jsx (baris 148-171).
 * Sumber: Kepala halaman Master Armada Kapal beserta tombol aksi
 */
import React from 'react';
import { Plus } from 'lucide-react';

export const VesselListHeader = ({
  handleOpenAddModal,
  vessels,
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Master Armada Kapal (Fleet Directory)</h2>
                <span className="badge badge-info" style={{ fontSize: '0.78rem' }}>
                  PT. Pelayaran Baharimas Kalimantan
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Daftar armada kapal niaga ({vessels.filter(v => !v.id.startsWith('v-op-') && v.ownershipStatus !== 'As Operator').length} As Owner{vessels.some(v => v.id.startsWith('v-op-') || v.ownershipStatus === 'As Operator') ? ` & ${vessels.filter(v => v.id.startsWith('v-op-') || v.ownershipStatus === 'As Operator').length} As Operator` : ''}), manajemen sertifikasi survei BKI, perwira penanggung jawab, dan penambahan kapal manual
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleOpenAddModal}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)' }}
              >
                <Plus size={16} />
                <span>Tambah Kapal Manual</span>
              </button>
            </div>
          </div>
  );
};
