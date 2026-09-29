/**
 * EquipListHeader.jsx
 * Diekstrak dari EquipmentList.jsx (baris 86-125).
 * Sumber: Kepala modul Master Equipment beserta jumlah mesin terdaftar dan tombol aksi
 */
import React from 'react';
import { BookOpen, Plus } from 'lucide-react';

export const EquipListHeader = ({
  setEditingEquipment,
  setIsDailyLogModalOpen,
  setIsFormModalOpen,
  totalCount,
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Master Equipment & Jam Operasi (Running Hours)</h2>
                <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                  {totalCount} Mesin Terdaftar
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Pelacakan jam kerja mesin, interval servis PMS terstandarisasi, pengujian mesin kritis ISM Code 10.3, dan log harian
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setIsDailyLogModalOpen(true)}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 1.1rem', fontWeight: 600 }}
                title="Catat jam kerja harian serentak untuk semua mesin di kapal"
              >
                <BookOpen size={17} color="#0284c7" />
                <span>Buku Jurnal Harian (Daily Log)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingEquipment(null);
                  setIsFormModalOpen(true);
                }}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 1.1rem', fontWeight: 700 }}
              >
                <Plus size={18} />
                <span>Tambah Equipment Baru</span>
              </button>
            </div>
          </div>
  );
};
