import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  CalendarClock,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  Calendar,
  Send,
  SlidersHorizontal
} from 'lucide-react';
import { WorkOrderModal } from './WorkOrderModal';

export const MaintenanceList = () => {
  const {
    workOrders,
    schedules,
    vessels,
    allEquipment,
    selectedVesselId,
    sendWhatsAppReminder
  } = usePMS();

  const [statusTab, setStatusTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedWO, setSelectedWO] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showScheduleRules, setShowScheduleRules] = useState(false);

  const filteredWO = workOrders.filter(wo => {
    const matchStatus = statusTab === 'ALL' || wo.status === statusTab;
    const matchSearch = wo.title.toLowerCase().includes(search.toLowerCase()) ||
                        wo.id.toLowerCase().includes(search.toLowerCase()) ||
                        wo.assignedTo.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Planned Maintenance System (PMS) & Work Orders</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Jadwal perawatan berkala berbasis running hours & kalender, manajemen checklist, dan penugasan teknisi
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setShowScheduleRules(!showScheduleRules)}
            className="btn btn-secondary"
          >
            <Calendar size={16} />
            <span>{showScheduleRules ? 'Sembunyikan Aturan Servis' : 'Lihat Master Jadwal Servis'}</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Buat Work Order Baru</span>
          </button>
        </div>
      </div>

      {/* Master Schedule Rules Collapsible */}
      {showScheduleRules && (
        <div className="glass-card" style={{ padding: '1.25rem', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SlidersHorizontal size={18} color="#38bdf8" />
              <span>Master Aturan Interval Perawatan (Maintenance Interval Rules)</span>
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Sesuai manual maker engine & standar SOLAS/ISM Code
            </span>
          </div>

          <div className="grid-cols-3">
            {schedules.map(sch => {
              const eq = allEquipment.find(e => e.id === sch.equipmentId);
              return (
                <div
                  key={sch.id}
                  style={{
                    padding: '0.9rem',
                    borderRadius: '8px',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                      {sch.intervalType === 'running_hours' ? `${sch.intervalHours} Jam Operasi` : `${sch.intervalDays} Hari`}
                    </span>
                    <span className={`badge ${sch.priority === 'Sangat Tinggi' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                      {sch.priority}
                    </span>
                  </div>
                  <h5 style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.4rem' }}>{sch.title}</h5>
                  <p style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '0.15rem' }}>
                    Equipment: {eq?.name || 'Semua'}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    {sch.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter & Tabs Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'Semua WO', count: workOrders.length },
              { id: 'Overdue', label: 'Overdue', count: workOrders.filter(w => w.status === 'Overdue').length, badgeType: 'danger' },
              { id: 'In Progress', label: 'In Progress', count: workOrders.filter(w => w.status === 'In Progress').length, badgeType: 'info' },
              { id: 'Scheduled', label: 'Scheduled', count: workOrders.filter(w => w.status === 'Scheduled').length },
              { id: 'Completed', label: 'Completed', count: workOrders.filter(w => w.status === 'Completed').length, badgeType: 'success' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusTab(tab.id)}
                className={`tab-btn ${statusTab === tab.id ? 'active' : ''}`}
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
              >
                <span>{tab.label}</span>
                <span className={`badge ${
                  tab.badgeType === 'danger' ? 'badge-danger' :
                  tab.badgeType === 'success' ? 'badge-success' :
                  tab.badgeType === 'info' ? 'badge-info' : 'badge-neutral'
                }`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Cari nomor WO, teknisi, judul..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-control"
              style={{ paddingLeft: '2.4rem', fontSize: '0.825rem' }}
            />
          </div>
        </div>
      </div>

      {/* Work Orders Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div className="table-container">
          <table className="pms-table">
            <thead>
              <tr>
                <th>No. Work Order</th>
                <th>Kapal & Mesin</th>
                <th>Judul Pekerjaan</th>
                <th>Prioritas</th>
                <th>Teknisi Bertugas</th>
                <th>Target Servis</th>
                <th>Checklist</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredWO.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    Tidak ada Work Order yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredWO.map(wo => {
                  const vesselName = vessels.find(v => v.id === wo.vesselId)?.name || '-';
                  const eqName = allEquipment.find(e => e.id === wo.equipmentId)?.name || '-';
                  const doneChecklist = wo.checklist?.filter(c => c.done).length || 0;
                  const totalChecklist = wo.checklist?.length || 0;

                  return (
                    <tr key={wo.id}>
                      <td className="mono" style={{ fontWeight: 700, color: '#38bdf8' }}>
                        {wo.id}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{vesselName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{eqName}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{wo.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{wo.category}</div>
                      </td>
                      <td>
                        <span className={`badge ${
                          wo.priority === 'Sangat Tinggi' || wo.priority === 'Tinggi' ? 'badge-danger' : 'badge-warning'
                        }`}>
                          {wo.priority}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>{wo.assignedTo}</div>
                      </td>
                      <td className="mono" style={{ fontSize: '0.8rem' }}>
                        {wo.targetHours ? `${wo.targetHours.toLocaleString()} Jam` : wo.dueDate}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}>
                          <span className="mono">{doneChecklist}/{totalChecklist}</span>
                          <div className="progress-bar-container" style={{ width: '60px', height: '6px' }}>
                            <div
                              className="progress-bar-fill progress-green"
                              style={{ width: `${totalChecklist > 0 ? (doneChecklist / totalChecklist) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          wo.status === 'Completed' ? 'badge-success' :
                          wo.status === 'In Progress' ? 'badge-info' :
                          wo.status === 'Overdue' ? 'badge-danger-pulse' :
                          'badge-neutral'
                        }`}>
                          {wo.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                          {wo.status === 'Overdue' && (
                            <button
                              onClick={() => sendWhatsAppReminder(wo, 'work_order')}
                              className="btn btn-whatsapp btn-sm"
                              title="Kirim Peringatan WA ke Teknisi"
                            >
                              <Send size={13} />
                              <span>WA</span>
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedWO(wo)}
                            className="btn btn-secondary btn-sm"
                          >
                            <span>Detail</span>
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

      {/* Modals */}
      {selectedWO && (
        <WorkOrderModal
          workOrder={selectedWO}
          onClose={() => setSelectedWO(null)}
        />
      )}

      {showCreateModal && (
        <WorkOrderModal
          vesselId={selectedVesselId}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};
