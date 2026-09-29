/**
 * CritEquipFilterBar.jsx
 * Diekstrak dari CriticalEquipmentView.jsx (baris 195-212).
 * Sumber: Bar filter hasil uji: Semua / Pass / Defective
 */
import React from 'react';

export const CritEquipFilterBar = ({
  filterResult,
  filteredTests,
  setFilterResult,
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['ALL', 'Pass', 'Defective'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilterResult(f)}
                  className={`tab-btn ${filterResult === f ? 'active' : ''}`}
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                >
                  {f === 'ALL' ? 'Semua Hasil Uji' : (f === 'Pass' ? '✅ Berfungsi Baik (Pass)' : '❌ Butuh Perbaikan (Defective)')}
                </button>
              ))}
            </div>

            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Total Tercatat: <strong>{filteredTests.length} Riwayat Pengujian</strong>
            </span>
          </div>
  );
};
