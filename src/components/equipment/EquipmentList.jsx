import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Clock,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Cpu,
  Edit2,
  Trash2,
  Ship,
  CheckCircle2,
  Activity,
  AlertCircle,
  BookOpen,
  ShieldAlert
} from 'lucide-react';
import { RunningHoursModal } from './RunningHoursModal';
import { EquipmentFormModal } from './EquipmentFormModal';
import { DailyMachineryLogModal } from './DailyMachineryLogModal';
import { CriticalEquipmentView } from './CriticalEquipmentView';

export const EquipmentList = () => {
  const { equipment, vessels, selectedVesselId, deleteEquipment, theme } = usePMS();
  const [activeTab, setActiveTab] = useState('machinery'); // 'machinery' | 'critical'
  const [isDailyLogModalOpen, setIsDailyLogModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [vesselFilter, setVesselFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedEqForHours, setSelectedEqForHours] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);

  const categories = [
    'ALL',
    'Propulsi',
    'Kelistrikan',
    'Sistem Pompa',
    'Pneumatik',
    'Deck Machinery',
    'Navigasi & Komunikasi',
    'Sistem Keselamatan',
    'Penanganan Muatan'
  ];

  // Filtering
  const filtered = equipment.filter(eq => {
    // Search
    const q = search.toLowerCase();
    const matchSearch =
      (eq.name || '').toLowerCase().includes(q) ||
      (eq.code || '').toLowerCase().includes(q) ||
      (eq.maker || '').toLowerCase().includes(q) ||
      (eq.model || '').toLowerCase().includes(q) ||
      (eq.location || '').toLowerCase().includes(q);

    // Category
    const matchCat = categoryFilter === 'ALL' || eq.category === categoryFilter;

    // Vessel filter
    const matchVessel = vesselFilter === 'ALL' || eq.vesselId === vesselFilter;

    // Status filter
    const matchStatus = statusFilter === 'ALL' || eq.status === statusFilter;

    return matchSearch && matchCat && matchVessel && matchStatus;
  });

  // KPI Statistics
  const totalCount = equipment.length;
  const normalCount = equipment.filter(e => e.status === 'Normal').length;
  const dueSoonCount = equipment.filter(e => e.status === 'Due Soon').length;
  const overdueCount = equipment.filter(e => e.status === 'Overdue').length;

  const handleDelete = (eq) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus equipment "${eq.name}" (${eq.code}) dari database?`)) {
      deleteEquipment(eq.id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
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

      {/* Sub Tabs: Machinery List vs Critical Equipment (ISM Code 10.3) */}
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

      {/* Render active subtab */}
      {activeTab === 'critical' ? (
        <CriticalEquipmentView selectedVesselId={selectedVesselId} />
      ) : (
        <>

      {/* KPI Cards Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div
          className="glass-card"
          style={{
            padding: '1rem 1.25rem',
            borderLeft: '4px solid #0284c7',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(2, 132, 199, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
            <Cpu size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Unit Equipment</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{totalCount}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Armada Kapal & Tongkang</div>
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '1rem 1.25rem',
            borderLeft: '4px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Kondisi Normal (Aman)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>{normalCount}</div>
            <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>Di bawah ambang batas servis</div>
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '1rem 1.25rem',
            borderLeft: '4px solid #f59e0b',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mendekati Servis (Due Soon)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>{dueSoonCount}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sisa &le; 200 Jam Kerja</div>
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '1rem 1.25rem',
            borderLeft: '4px solid #ef4444',
            background: overdueCount > 0 ? 'rgba(239, 68, 68, 0.08)' : undefined,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Melewati Batas (Overdue)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444' }}>
              {overdueCount}
              {overdueCount > 0 && <span style={{ fontSize: '0.72rem', marginLeft: '0.35rem' }}>🚨 Butuh Servis!</span>}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Segera Terbitkan Work Order</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
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

      {/* Equipment Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div className="table-container">
          <table className="pms-table">
            <thead>
              <tr>
                <th>Kode & Nama Equipment</th>
                <th>Kapal Armada</th>
                <th>Kategori & Lokasi</th>
                <th>Maker & Model</th>
                <th>Jam Operasi (Running Hours)</th>
                <th>Kritikalitas</th>
                <th>Status Servis</th>
                <th style={{ textAlign: 'right', minWidth: '150px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                      <AlertCircle size={36} color="var(--text-muted)" />
                      <div style={{ fontSize: '1rem', fontWeight: 700 }}>Tidak ada equipment yang sesuai filter</div>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                        Coba ubah kata kunci pencarian atau daftarkan mesin baru.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingEquipment(null);
                          setIsFormModalOpen(true);
                        }}
                        className="btn btn-primary btn-sm"
                        style={{ marginTop: '0.5rem' }}
                      >
                        <Plus size={14} />
                        <span>Tambah Equipment Baru</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(eq => {
                  const vessel = vessels.find(v => v.id === eq.vesselId);
                  const vesselName = vessel?.name || '-';
                  const hoursLeft = eq.nextServiceHours - eq.runningHours;
                  const percentageUsed = eq.nextServiceHours > 0
                    ? Math.min(100, Math.max(0, Math.round((eq.runningHours / eq.nextServiceHours) * 100)))
                    : 0;

                  return (
                    <tr key={eq.id}>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span className="mono" style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>
                            {eq.code}
                          </span>
                          <strong style={{ fontSize: '0.92rem', marginTop: '0.1rem' }}>{eq.name}</strong>
                          {eq.subComponents && eq.subComponents.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                              {eq.subComponents.slice(0, 3).map((sub, idx) => (
                                <span
                                  key={idx}
                                  style={{
                                    fontSize: '0.68rem',
                                    padding: '0.1rem 0.4rem',
                                    borderRadius: '4px',
                                    background: 'rgba(255,255,255,0.06)',
                                    color: 'var(--text-muted)'
                                  }}
                                >
                                  {sub}
                                </span>
                              ))}
                              {eq.subComponents.length > 3 && (
                                <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)' }}>
                                  +{eq.subComponents.length - 3} lagi
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: 600 }}>{vesselName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{vessel?.type || 'Armada'}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>{eq.category}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{eq.location}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>{eq.maker || '-'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{eq.model || '-'}</div>
                        {eq.serialNumber && eq.serialNumber !== '-' && (
                          <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                            S/N: {eq.serialNumber}
                          </div>
                        )}
                      </td>
                      <td style={{ minWidth: '200px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                          <span className="mono" style={{ fontWeight: 700, color: 'var(--text-main)' }}>
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
                        <div style={{ fontSize: '0.72rem', marginTop: '0.3rem', color: hoursLeft <= 0 ? '#ef4444' : hoursLeft <= 200 ? '#f59e0b' : 'var(--text-muted)', fontWeight: 600 }}>
                          {hoursLeft <= 0 ? `🚨 Overdue ${Math.abs(hoursLeft)} Jam!` : `⏳ Tersisa ${hoursLeft} Jam`}
                        </div>
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            fontSize: '0.7rem',
                            background:
                              eq.criticality === 'Kritis' ? 'rgba(239, 68, 68, 0.15)' :
                              eq.criticality === 'Tinggi' ? 'rgba(245, 158, 11, 0.15)' :
                              'rgba(56, 189, 248, 0.15)',
                            color:
                              eq.criticality === 'Kritis' ? '#ef4444' :
                              eq.criticality === 'Tinggi' ? '#f59e0b' :
                              '#38bdf8'
                          }}
                        >
                          {eq.criticality || 'Normal'}
                        </span>
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
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                          <button
                            type="button"
                            onClick={() => setSelectedEqForHours(eq)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                            title="Log jam kerja mesin harian"
                          >
                            <Clock size={13} />
                            <span>Log Jam</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingEquipment(eq);
                              setIsFormModalOpen(true);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.35rem 0.5rem', color: '#38bdf8' }}
                            title="Edit data teknis & spesifikasi mesin"
                          >
                            <Edit2 size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(eq)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.35rem 0.5rem', color: '#ef4444' }}
                            title="Hapus equipment"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

        </>
      )}

      {/* MODAL 1: Log Running Hours Modal */}
      {selectedEqForHours && (
        <RunningHoursModal
          equipment={selectedEqForHours}
          onClose={() => setSelectedEqForHours(null)}
        />
      )}

      {/* MODAL 2: Create & Edit Equipment Modal */}
      {isFormModalOpen && (
        <EquipmentFormModal
          equipment={editingEquipment}
          defaultVesselId={selectedVesselId !== 'all' ? selectedVesselId : vesselFilter !== 'ALL' ? vesselFilter : undefined}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingEquipment(null);
          }}
        />
      )}

      {/* MODAL 3: Batch Daily Machinery Logbook Modal */}
      {isDailyLogModalOpen && (
        <DailyMachineryLogModal
          initialVesselId={selectedVesselId !== 'all' ? selectedVesselId : undefined}
          onClose={() => setIsDailyLogModalOpen(false)}
        />
      )}
    </div>
  );
};
