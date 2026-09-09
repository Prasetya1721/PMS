import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Wrench,
  Clock,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { RunningHoursModal } from './RunningHoursModal';

export const EquipmentList = () => {
  const { equipment, vessels, selectedVesselId } = usePMS();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedEqForHours, setSelectedEqForHours] = useState(null);

  const categories = ['ALL', 'Propulsi', 'Kelistrikan', 'Sistem Pompa', 'Pneumatik', 'Deck Machinery', 'Navigasi & Komunikasi'];

  const filtered = equipment.filter(eq => {
    const matchSearch = eq.name.toLowerCase().includes(search.toLowerCase()) ||
                        eq.code.toLowerCase().includes(search.toLowerCase()) ||
                        eq.maker.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'ALL' || eq.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Master Equipment & Jam Operasi (Running Hours)</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Pelacakan jam kerja mesin, hierarki komponen, dan ambang batas perawatan berkala
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Cari nama mesin, kode, maker (MAN, Yanmar, dll)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-control"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Kategori:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="select-control"
            style={{ width: '200px' }}
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === 'ALL' ? 'Semua Kategori' : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div className="table-container">
          <table className="pms-table">
            <thead>
              <tr>
                <th>Kode & Nama Equipment</th>
                <th>Kapal</th>
                <th>Kategori & Lokasi</th>
                <th>Maker & Spesifikasi</th>
                <th>Jam Operasi (Running Hours)</th>
                <th>Status Servis</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(eq => {
                const vesselName = vessels.find(v => v.id === eq.vesselId)?.name || '-';
                const hoursLeft = eq.nextServiceHours - eq.runningHours;
                const percentageUsed = Math.min(100, Math.round((eq.runningHours / eq.nextServiceHours) * 100));

                return (
                  <tr key={eq.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="mono" style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>
                          {eq.code}
                        </span>
                        <strong style={{ fontSize: '0.92rem', marginTop: '0.1rem' }}>{eq.name}</strong>
                        {eq.subComponents && (
                          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                            {eq.subComponents.slice(0, 2).map((sub, idx) => (
                              <span key={idx} style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                                {sub}
                              </span>
                            ))}
                            {eq.subComponents.length > 2 && (
                              <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)' }}>
                                +{eq.subComponents.length - 2} lagi
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{vesselName}</td>
                    <td>
                      <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>{eq.category}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{eq.location}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>{eq.maker}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{eq.model}</div>
                      <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>S/N: {eq.serialNumber}</div>
                    </td>
                    <td style={{ minWidth: '200px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                        <span className="mono" style={{ fontWeight: 700, color: '#fff' }}>
                          {eq.runningHours.toLocaleString()} Jam
                        </span>
                        <span className="mono" style={{ color: 'var(--text-muted)' }}>
                          Target: {eq.nextServiceHours.toLocaleString()} Jam
                        </span>
                      </div>
                      <div className="progress-bar-container">
                        <div
                          className={`progress-bar-fill ${
                            eq.status === 'Overdue' ? 'progress-red' :
                            eq.status === 'Due Soon' ? 'progress-amber' : 'progress-blue'
                          }`}
                          style={{ width: `${percentageUsed}%` }}
                        />
                      </div>
                      <div style={{ fontSize: '0.72rem', marginTop: '0.3rem', color: hoursLeft <= 0 ? '#ef4444' : '#f59e0b', fontWeight: 600 }}>
                        {hoursLeft <= 0 ? `Overdue ${Math.abs(hoursLeft)} Jam!` : `Tersisa ${hoursLeft} Jam`}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        eq.status === 'Overdue' ? 'badge-danger-pulse' :
                        eq.status === 'Due Soon' ? 'badge-warning' : 'badge-success'
                      }`}>
                        {eq.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedEqForHours(eq)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                      >
                        <Clock size={13} />
                        <span>Log Jam</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedEqForHours && (
        <RunningHoursModal
          equipment={selectedEqForHours}
          onClose={() => setSelectedEqForHours(null)}
        />
      )}
    </div>
  );
};
