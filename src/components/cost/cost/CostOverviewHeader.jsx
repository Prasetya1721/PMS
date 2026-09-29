/**
 * CostOverviewHeader.jsx
 * Diekstrak dari CostOverview.jsx (baris 163-193).
 * Sumber: Kepala modul Biaya & Anggaran: judul, lencana modul Finance, dan navigasi sub-tab
 */
import React from 'react';
import { FileSpreadsheet, PieChart } from 'lucide-react';

export const CostOverviewHeader = ({
  activeSubTab,
  costs,
  setActiveSubTab,
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Biaya & Manajemen Anggaran Kapal (Vessel Budgeting)</h2>
                <span className="badge badge-purple" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                  Modul Finance
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Pengalokasian pagu anggaran operasional per kapal, kontrol realisasi pengeluaran riil, dan analisis penyerapan anggaran armada
              </p>
            </div>

            {/* Subtab Navigation */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                onClick={() => setActiveSubTab('budget')}
                className={`btn ${activeSubTab === 'budget' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <PieChart size={16} />
                <span>Pagu Anggaran per Kapal</span>
              </button>
              <button
                onClick={() => setActiveSubTab('ledger')}
                className={`btn ${activeSubTab === 'ledger' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <FileSpreadsheet size={16} />
                <span>Buku Besar Pengeluaran ({costs.length})</span>
              </button>
            </div>
          </div>
  );
};
