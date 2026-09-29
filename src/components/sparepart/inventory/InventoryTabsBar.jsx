/**
 * InventoryTabsBar.jsx
 * Diekstrak dari InventoryList.jsx (baris 194-223).
 * Sumber: Bar tab: Stok Gudang Kapal / Permintaan & Persetujuan, plus tombol aksi sesuai izin
 */
import React from 'react';
import { Package, ShoppingCart } from 'lucide-react';

export const InventoryTabsBar = ({
  activeSubTab,
  requisitions,
  setActiveSubTab,
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Gudang Logistik & Suku Cadang (Armada & Kru)</h2>
                <span className="badge badge-info" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                  Gudang Terpadu
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Stok fisik Gudang Darat Pontianak vs Onboard KM. RP 2020: Provisi Makanan/BAMA, APD Pelaut, Deck/Engine Stores & SPBK
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setActiveSubTab('inventory')}
                className={`btn ${activeSubTab === 'inventory' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Package size={16} />
                <span>Katalog Stok Gudang & Kapal</span>
              </button>
              <button
                onClick={() => setActiveSubTab('requisitions')}
                className={`btn ${activeSubTab === 'requisitions' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <ShoppingCart size={16} />
                <span>Permintaan Barang (SPBK) ({requisitions.length})</span>
              </button>
            </div>
          </div>
  );
};
