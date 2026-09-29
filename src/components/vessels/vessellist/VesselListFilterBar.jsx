/**
 * VesselListFilterBar.jsx
 * Diekstrak dari VesselList.jsx (baris 174-210).
 * Sumber: Bar filter armada: Semua / As Owner / As Operator / Tugboat / Tongkang beserta jumlahnya
 */
import React from 'react';
import { Search } from 'lucide-react';

export const VesselListFilterBar = ({
  filterType,
  search,
  setFilterType,
  setSearch,
  vessels,
}) => {
  return (
    <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            {/* Filter buttons */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[
                { id: 'ALL', label: 'Semua Armada', count: vessels.length },
                { id: 'OWNER', label: '⚓ As Owner', count: vessels.filter(v => !v.id.startsWith('v-op-') && v.ownershipStatus !== 'As Operator').length },
                ...(vessels.some(v => v.id.startsWith('v-op-') || v.ownershipStatus === 'As Operator') ? [{ id: 'OPERATOR', label: '⚙️ As Operator', count: vessels.filter(v => v.id.startsWith('v-op-') || v.ownershipStatus === 'As Operator').length }] : []),
                { id: 'TUGBOAT', label: 'Tugboat', count: vessels.filter(v => v.type?.toLowerCase().includes('tugboat') || v.type?.toLowerCase().includes('tunda') || v.type?.toLowerCase().includes('penarik')).length },
                { id: 'BARGE', label: 'Tongkang / Barge', count: vessels.filter(v => v.type?.toLowerCase().includes('tongkang') || v.type?.toLowerCase().includes('barge')).length }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={`tab-btn ${filterType === f.id ? 'active' : ''}`}
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <span>{f.label}</span>
                  <span className="badge badge-neutral" style={{ fontSize: '0.68rem', padding: '0.05rem 0.4rem' }}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={15} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Cari nama kapal, No Reg, status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-control"
                style={{ paddingLeft: '2.4rem', fontSize: '0.825rem' }}
              />
            </div>
          </div>
  );
};
