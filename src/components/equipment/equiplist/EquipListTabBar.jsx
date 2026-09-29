/**
 * EquipListTabBar.jsx
 * Diekstrak dari EquipmentList.jsx (baris 128-148).
 * Sumber: Tab pemilih tampilan: Daftar Mesin dan Critical Equipment
 */
import React from 'react';
import { Cpu, ShieldAlert } from 'lucide-react';

export const EquipListTabBar = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setActiveTab('machinery')}
              className={`btn ${activeTab === 'machinery' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.88rem' }}
            >
              <Cpu size={16} />
              <span>Daftar Mesin & Running Hours</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('critical')}
              className={`btn ${activeTab === 'critical' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.88rem' }}
            >
              <ShieldAlert size={16} />
              <span>Peralatan Kritis & Uji Darurat (ISM 10.3)</span>
            </button>
          </div>
  );
};
