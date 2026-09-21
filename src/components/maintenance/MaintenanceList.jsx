import React, { useState, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  CalendarClock,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Wrench,
  SlidersHorizontal,
  Package,
  Trash2
} from 'lucide-react';
import { TechnicalWorkOrderModal } from './TechnicalWorkOrderModal';
import { WorkOrderModal } from './WorkOrderModal';

export const MaintenanceList = () => {
  const {
    technicalWorkOrders,
    allTechnicalWorkOrders,
    workOrders,
    schedules,
    vessels,
    equipment,
    allEquipment,
    selectedVesselId,
    deleteTechnicalWorkOrder,
    sendWhatsAppReminder
  } = usePMS();

  const [activeMainTab, setActiveMainTab] = useState('technical_wo'); // 'technical_wo' | 'schedules' | 'requisitions'
  const [statusTab, setStatusTab] = useState('ALL');
  const [search, setSearch] = useState('');

  // Modals
  const [selectedTechWO, setSelectedTechWO] = useState(null);
  const [showCreateTechModal, setShowCreateTechModal] = useState(false);
  const [selectedReqWO, setSelectedReqWO] = useState(null);
  const [showCreateReqModal, setShowCreateReqModal] = useState(false);

  // Overdue equipment check
  const overdueEquipment = useMemo(() => {
    return (equipment || []).filter(e => e.status === 'Overdue');
  }, [equipment]);

  // Filter Technical Work Orders
  const filteredTechWO = useMemo(() => {
    return (technicalWorkOrders || allTechnicalWorkOrders || []).filter(wo => {
      const matchVessel = selectedVesselId === 'all' || wo.vesselId === selectedVesselId;
      const matchStatus = statusTab === 'ALL' || wo.status === statusTab;
      const matchSearch = (wo.title || '').toLowerCase().includes(search.toLowerCase()) ||
                          (wo.id || '').toLowerCase().includes(search.toLowerCase()) ||
                          (wo.assignedTechnician || '').toLowerCase().includes(search.toLowerCase());
      return matchVessel && matchStatus && matchSearch;
    });
  }, [technicalWorkOrders, allTechnicalWorkOrders, selectedVesselId, statusTab, search]);

  // Filter Requisition Work Orders
  const filteredReqWO = useMemo(() => {
    return (workOrders || []).filter(wo => {
      const matchVessel = selectedVesselId === 'all' || wo.vesselId === selectedVesselId;
      const matchStatus = statusTab === 'ALL' || wo.status === statusTab;
      const matchSearch = (wo.title || '').toLowerCase().includes(search.toLowerCase()) ||
                          (wo.id || '').toLowerCase().includes(search.toLowerCase()) ||
                          (wo.assignedTo || '').toLowerCase().includes(search.toLowerCase());
      return matchVessel && matchStatus && matchSearch;
    });
  }, [workOrders, selectedVesselId, statusTab, search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
            Planned Maintenance System (PMS) & Technical Work Orders
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
            Sistem pemeliharaan terencana standar IMO ISM Code 10.1 & BKI: perintah kerja servis mesin, checklist SOP, konsumsi suku cadang, dan reset siklus perawatan.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {activeMainTab === 'technical_wo' ? (
            <button
              onClick={() => setShowCreateTechModal(true)}
              className="btn btn-primary"
            >
              <Plus size={16} />
              <span>Buat Technical Work Order Baru</span>
            </button>
          ) : activeMainTab === 'requisitions' ? (
            <button
              onClick={() => setShowCreateReqModal(true)}
              className="btn btn-primary"
            >
              <Plus size={16} />
              <span>Buat Permintaan Barang (SPBK)</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Overdue Warning Banner if any equipment has reached service target */}
      {overdueEquipment.length > 0 && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={22} color="#f87171" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ color: '#f87171', fontSize: '0.9rem', display: 'block' }}>
                PERINGATAN JATUH TEMPO: {overdueEquipment.length} Mesin Kapal Telah Melewati Batas Jam Servis (Overdue)!
              </strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Mesin: {overdueEquipment.map(e => `${e.name} (${e.runningHours.toLocaleString()} / ${e.nextServiceHours.toLocaleString()} Jam)`).join(', ')}.
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowCreateTechModal(true)}
            className="btn btn-danger btn-sm"
          >
            <Wrench size={14} />
            <span>Terbitkan WO Servis Sekarang</span>
          </button>
        </div>
      )}

      {/* Main Tab Navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', gap: '0.5rem' }}>
        <button
          onClick={() => { setActiveMainTab('technical_wo'); setStatusTab('ALL'); }}
          className={`tab-btn ${activeMainTab === 'technical_wo' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}
        >
          <Wrench size={16} />
          <span>Perintah Kerja Servis Teknis ({filteredTechWO.length})</span>
        </button>

        <button
          onClick={() => setActiveMainTab('schedules')}
          className={`tab-btn ${activeMainTab === 'schedules' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}
        >
          <CalendarClock size={16} />
          <span>Master Aturan Interval Servis ({schedules.length})</span>
        </button>

        <button
          onClick={() => { setActiveMainTab('requisitions'); setStatusTab('ALL'); }}
          className={`tab-btn ${activeMainTab === 'requisitions' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}
        >
          <Package size={16} />
          <span>Permintaan Barang Gudang / SPBK ({filteredReqWO.length})</span>
        </button>
      </div>

      {/* Content for TAB 1: TECHNICAL WORK ORDERS */}
      {activeMainTab === 'technical_wo' && (
        <>
          {/* Filter Bar */}
          <div className="glass-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {['ALL', 'Scheduled', 'In Progress', 'Completed'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusTab(tab)}
                  className={`tab-btn ${statusTab === tab ? 'active' : ''}`}
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
                >
                  {tab === 'ALL' ? 'Semua Status' :
                   tab === 'Scheduled' ? '📅 Terjadwal' :
                   tab === 'In Progress' ? '⚡ Sedang Dikerjakan' : '✅ Selesai'}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={15} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Cari WO servis, teknisi, mesin..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-control"
                style={{ paddingLeft: '2.4rem', fontSize: '0.825rem' }}
              />
            </div>
          </div>

          {/* Technical Work Orders Table */}
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div className="table-container">
              <table className="pms-table">
                <thead>
                  <tr>
                    <th>No. Work Order</th>
                    <th>Kapal & Mesin</th>
                    <th>Pekerjaan Pemeliharaan</th>
                    <th>Tipe WO</th>
                    <th>Prioritas</th>
                    <th>Teknisi / PIC</th>
                    <th>Target Jam</th>
                    <th>Spareparts</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTechWO.length === 0 ? (
                    <tr>
                      <td colSpan="10" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                        Tidak ada Technical Work Order yang sesuai dengan kriteria filter.
                      </td>
                    </tr>
                  ) : (
                    filteredTechWO.map(wo => {
                      const vName = vessels.find(v => v.id === wo.vesselId)?.name || '-';
                      const eq = allEquipment.find(e => e.id === wo.equipmentId);
                      const partsCount = wo.sparepartsRequired?.length || 0;
                      const isDone = wo.status === 'Completed';

                      return (
                        <tr key={wo.id}>
                          <td className="mono" style={{ fontWeight: 800, color: '#38bdf8' }}>
                            {wo.id}
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{vName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {eq?.name || wo.equipmentName || '-'} ({eq?.code || '-'})
                            </div>
                          </td>
                          <td>
                            <strong style={{ display: 'block', fontSize: '0.875rem' }}>{wo.title}</strong>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              Batas: {wo.dueDate}
                            </span>
                          </td>
                          <td>
                            <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                              {wo.workOrderType?.split(' ')[0] || 'PM'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${
                              wo.priority?.includes('Kritis') ? 'badge-danger' :
                              wo.priority === 'Tinggi' ? 'badge-warning' : 'badge-neutral'
                            }`} style={{ fontSize: '0.7rem' }}>
                              {wo.priority}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.825rem' }}>{wo.assignedTechnician}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{wo.assignedRole}</div>
                          </td>
                          <td className="mono" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                            {wo.targetRunningHours ? `${wo.targetRunningHours.toLocaleString()} Jam` : '-'}
                          </td>
                          <td>
                            {partsCount > 0 ? (
                              <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                                {partsCount} Suku Cadang
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>-</span>
                            )}
                          </td>
                          <td>
                            <span className={`badge ${
                              isDone ? 'badge-success' :
                              wo.status === 'In Progress' ? 'badge-info' : 'badge-warning'
                            }`} style={{ fontSize: '0.72rem' }}>
                              {wo.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                              <button
                                onClick={() => setSelectedTechWO(wo)}
                                className="btn btn-secondary btn-sm"
                                title="Buka Form Eksekusi Servis Mesin"
                              >
                                <span>{isDone ? 'Lihat WO' : 'Eksekusi Servis'}</span>
                              </button>

                              <button
                                onClick={() => {
                                  if (window.confirm(`Hapus Work Order ${wo.id}?`)) {
                                    deleteTechnicalWorkOrder(wo.id);
                                  }
                                }}
                                className="btn btn-neutral btn-sm"
                                style={{ color: '#f87171', padding: '0.3rem 0.5rem' }}
                                title="Hapus Work Order"
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

      {/* Content for TAB 2: MAINTENANCE INTERVAL SCHEDULE RULES */}
      {activeMainTab === 'schedules' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <SlidersHorizontal size={18} color="#38bdf8" />
                  <span>Master Aturan Interval Servis Berkala (Maintenance Schedule Rules)</span>
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                  Interval perawatan standar pabrikan mesin (Maker Manual) dan survei klas BKI.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {schedules.map(sch => {
                const eq = allEquipment.find(e => e.id === sch.equipmentId);
                return (
                  <div
                    key={sch.id}
                    style={{
                      padding: '1.1rem',
                      borderRadius: '10px',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.75rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                          {sch.intervalType === 'running_hours' ? `${sch.intervalHours} Jam Operasi` : `${sch.intervalDays} Hari`}
                        </span>
                        <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>
                          {sch.priority || 'Tinggi'}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, marginBottom: '4px' }}>
                        {sch.title}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                        {sch.description}
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Target: <strong>{eq?.name || 'Seluruh Mesin'}</strong>
                      </span>

                      <button
                        onClick={() => {
                          setShowCreateTechModal(true);
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem' }}
                      >
                        <Wrench size={13} />
                        <span>Jadwalkan Servis</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Content for TAB 3: STORE REQUISITIONS (SPBK) */}
      {activeMainTab === 'requisitions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Surat Permintaan Barang Kapal (SPBK) ke Gudang Logistik Darat Pontianak
            </span>

            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={15} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Cari nomor SPBK, PIC..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-control"
                style={{ paddingLeft: '2.4rem', fontSize: '0.825rem' }}
              />
            </div>
          </div>

          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div className="table-container">
              <table className="pms-table">
                <thead>
                  <tr>
                    <th>No. SPBK</th>
                    <th>Kapal Pemohon</th>
                    <th>Kategori Permintaan</th>
                    <th>Pemohon (PIC)</th>
                    <th>Target Kirim</th>
                    <th>Status Gudang</th>
                    <th style={{ textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReqWO.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                        Belum ada surat permintaan barang kapal (SPBK).
                      </td>
                    </tr>
                  ) : (
                    filteredReqWO.map(wo => {
                      const vName = vessels.find(v => v.id === wo.vesselId)?.name || '-';
                      return (
                        <tr key={wo.id}>
                          <td className="mono" style={{ fontWeight: 800, color: '#f59e0b' }}>
                            {wo.id}
                          </td>
                          <td>
                            <strong>{vName}</strong>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{wo.title}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{wo.subCategory || wo.category}</div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.825rem' }}>{wo.pic || wo.assignedTo}</div>
                          </td>
                          <td>{wo.neededDate || wo.dueDate || '-'}</td>
                          <td>
                            <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                              {wo.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              onClick={() => setSelectedReqWO(wo)}
                              className="btn btn-secondary btn-sm"
                            >
                              <span>Lihat SPBK</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedTechWO && (
        <TechnicalWorkOrderModal
          workOrder={selectedTechWO}
          initialVesselId={selectedVesselId}
          onClose={() => setSelectedTechWO(null)}
        />
      )}

      {showCreateTechModal && (
        <TechnicalWorkOrderModal
          initialVesselId={selectedVesselId}
          onClose={() => setShowCreateTechModal(false)}
        />
      )}

      {selectedReqWO && (
        <WorkOrderModal
          workOrder={selectedReqWO}
          onClose={() => setSelectedReqWO(null)}
        />
      )}

      {showCreateReqModal && (
        <WorkOrderModal
          vesselId={selectedVesselId}
          onClose={() => setShowCreateReqModal(false)}
        />
      )}
    </div>
  );
};
