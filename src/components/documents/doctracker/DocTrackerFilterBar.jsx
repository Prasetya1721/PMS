/**
 * DocTrackerFilterBar.jsx
 * Diekstrak dari DocumentTracker.jsx (baris 153-259).
 * Sumber: Bilah penyaring: pemilih jenis dokumen, pencarian, filter status kedaluwarsa dan kapal
 */
import React from 'react';
import { Filter, Search } from 'lucide-react';

export const DocTrackerFilterBar = ({
  allItems,
  categoryFilter,
  certificateCategories,
  crewCertificates,
  docTypeTab,
  dueSoonCount,
  expiredCount,
  h1ExpiringCount,
  h30ExpiringCount,
  h365ExpiringCount,
  h7ExpiringCount,
  search,
  setCategoryFilter,
  setDocTypeTab,
  setSearch,
  setStatusFilter,
  shipDocuments,
  statusFilter,
}) => {
  return (
    <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              {/* Doc Type Selector */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setDocTypeTab('all')}
                  className={`btn btn-sm ${docTypeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Semua ({allItems.length})
                </button>
                <button
                  onClick={() => setDocTypeTab('ship')}
                  className={`btn btn-sm ${docTypeTab === 'ship' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Surat Legal Kapal ({shipDocuments.length})
                </button>
                <button
                  onClick={() => setDocTypeTab('crew')}
                  className={`btn btn-sm ${docTypeTab === 'crew' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Sertifikat Kru ({crewCertificates.length})
                </button>
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'ALL', label: 'Semua Status' },
                  { id: 'H-1', label: '1 Hari (H-1)', badge: h1ExpiringCount },
                  { id: 'H-7', label: '1 Minggu (H-7)', badge: h7ExpiringCount },
                  { id: 'H-30', label: '1 Bulan (H-30)', badge: h30ExpiringCount },
                  { id: 'H-365', label: '1 Tahun (H-365)', badge: h365ExpiringCount },
                  { id: 'Expired', label: 'Expired', badge: expiredCount },
                  { id: 'Due Soon', label: 'Due Soon', badge: dueSoonCount },
                  { id: 'Active', label: 'Active' }
                ].map(st => (
                  <button
                    key={st.id}
                    onClick={() => setStatusFilter(st.id)}
                    className={`tab-btn ${statusFilter === st.id ? 'active' : ''}`}
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <span>{st.label}</span>
                    {st.badge !== undefined && st.badge > 0 && (
                      <span className="badge badge-neutral" style={{ fontSize: '0.65rem', padding: '0.05rem 0.35rem' }}>
                        {st.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={15} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Cari sertifikat, nomor, nama..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-control"
                  style={{ paddingLeft: '2.4rem', fontSize: '0.825rem' }}
                />
              </div>
            </div>

            {/* Category Tabs: BKI, Statutory, Asuransi, KSOP, Kesehatan */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginRight: '0.35rem' }}>
                <Filter size={13} />
                <span>Kategori Maritim:</span>
              </span>
              <button
                onClick={() => setCategoryFilter('ALL')}
                className={`tab-btn ${categoryFilter === 'ALL' ? 'active' : ''}`}
                style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}
              >
                Semua ({shipDocuments.length})
              </button>
              {(certificateCategories || []).map(cat => {
                const count = shipDocuments.filter(d => d.category === cat.id).length;
                const isActive = categoryFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`tab-btn ${isActive ? 'active' : ''}`}
                    style={{
                      padding: '0.3rem 0.75rem',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      border: isActive ? `1px solid ${cat.borderColor}` : '1px solid transparent',
                      background: isActive ? cat.bgColor : undefined,
                      color: isActive ? cat.color : undefined
                    }}
                  >
                    <span style={{ fontWeight: isActive ? 700 : 500 }}>{cat.label.split(' ')[0]}</span>
                    <span className="badge badge-neutral" style={{ fontSize: '0.65rem', padding: '0.05rem 0.35rem' }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
  );
};
