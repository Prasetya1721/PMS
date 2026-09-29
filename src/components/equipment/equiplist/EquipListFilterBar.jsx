/**
 * EquipListFilterBar.jsx
 * Diekstrak dari EquipmentList.jsx (baris 244-305).
 * Sumber: Bar filter: pencarian, kapal, kategori, dan status equipment
 */
import React from 'react';
import { Activity, Filter, Search, Ship } from 'lucide-react';

export const EquipListFilterBar = ({
  categories,
  categoryFilter,
  search,
  selectedVesselId,
  setCategoryFilter,
  setSearch,
  setStatusFilter,
  setVesselFilter,
  statusFilter,
  vesselFilter,
  vessels,
}) => {
  return (
    <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Cari kode, nama mesin, maker (Yanmar, Sperre, dll), model, lokasi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-control"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            {/* Vessel Filter (Only if selectedVesselId is 'all') */}
            {selectedVesselId === 'all' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Ship size={15} color="var(--text-muted)" />
                <select
                  value={vesselFilter}
                  onChange={(e) => setVesselFilter(e.target.value)}
                  className="select-control"
                  style={{ width: '160px', fontSize: '0.8rem' }}
                >
                  <option value="ALL">Semua Kapal</option>
                  {vessels.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Category Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter size={15} color="var(--text-muted)" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="select-control"
                style={{ width: '170px', fontSize: '0.8rem' }}
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c === 'ALL' ? 'Semua Kategori' : c}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={15} color="var(--text-muted)" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="select-control"
                style={{ width: '140px', fontSize: '0.8rem' }}
              >
                <option value="ALL">Semua Status</option>
                <option value="Normal">🟢 Normal</option>
                <option value="Due Soon">🟡 Due Soon</option>
                <option value="Overdue">🔴 Overdue</option>
              </select>
            </div>
          </div>
  );
};
