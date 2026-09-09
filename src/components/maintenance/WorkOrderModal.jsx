import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Wrench,
  X,
  CheckCircle,
  Clock,
  User,
  Package,
  DollarSign,
  AlertTriangle,
  Plus,
  Trash2
} from 'lucide-react';

export const WorkOrderModal = ({ workOrder, vesselId, onClose }) => {
  const {
    vessels,
    allEquipment,
    spareparts,
    toggleChecklist,
    updateWorkOrderStatus,
    addWorkOrder
  } = usePMS();

  const isEdit = Boolean(workOrder);

  // Form state for creating a new WO
  const [formData, setFormData] = useState({
    title: workOrder?.title || '',
    vesselId: workOrder?.vesselId || vesselId || vessels[0]?.id || 'v-001',
    equipmentId: workOrder?.equipmentId || allEquipment[0]?.id || 'eq-101',
    category: workOrder?.category || 'Planned Preventive Maintenance',
    priority: workOrder?.priority || 'Tinggi',
    assignedTo: workOrder?.assignedTo || '',
    supervisor: workOrder?.supervisor || '',
    dueDate: workOrder?.dueDate || new Date().toISOString().split('T')[0],
    targetHours: workOrder?.targetHours || '',
    notes: workOrder?.notes || '',
    laborHoursEstimated: workOrder?.laborHoursEstimated || 4,
    costEstimated: workOrder?.costEstimated || 2500000
  });

  const [newChecklistText, setNewChecklistText] = useState('');

  const targetEquipment = allEquipment.find(e => e.id === (isEdit ? workOrder.equipmentId : formData.equipmentId));
  const targetVessel = vessels.find(v => v.id === (isEdit ? workOrder.vesselId : formData.vesselId));

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.assignedTo) return;

    addWorkOrder({
      ...formData,
      currentRunningHours: targetEquipment?.runningHours || 0,
      targetHours: formData.targetHours ? Number(formData.targetHours) : null,
      laborHoursEstimated: Number(formData.laborHoursEstimated),
      costEstimated: Number(formData.costEstimated),
      laborHoursActual: 0,
      costActual: 0
    });
    onClose();
  };

  const handleStatusChange = (newStatus) => {
    if (!workOrder) return;
    updateWorkOrderStatus(workOrder.id, newStatus);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog modal-dialog-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Wrench size={20} color="#38bdf8" />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                {isEdit ? `Work Order: ${workOrder.id}` : 'Buat Work Order Perawatan Baru'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {targetVessel?.name} • {targetEquipment?.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {isEdit ? (
          /* Detail View for existing WO */
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Status & Priority Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status Pengerjaan:</span>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                  {['Scheduled', 'In Progress', 'Completed'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className={`btn btn-sm ${workOrder.status === st ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prioritas & Target:</span>
                <div style={{ marginTop: '0.2rem' }}>
                  <span className={`badge ${
                    workOrder.priority === 'Sangat Tinggi' || workOrder.priority === 'Tinggi' ? 'badge-danger' : 'badge-warning'
                  }`}>
                    {workOrder.priority}
                  </span>
                  <span className="mono" style={{ marginLeft: '0.5rem', fontSize: '0.825rem', color: '#38bdf8' }}>
                    {workOrder.targetHours ? `${workOrder.targetHours} Jam Operasi` : workOrder.dueDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{workOrder.title}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
                {workOrder.notes || 'Tidak ada catatan tambahan.'}
              </p>
            </div>

            {/* Technician Assignment & Running Hours Specs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Teknisi Pelaksana</span>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.2rem' }}>{workOrder.assignedTo}</p>
              </div>
              <div style={{ padding: '0.75rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Supervisor / Approver</span>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.2rem' }}>{workOrder.supervisor || '-'}</p>
              </div>
              <div style={{ padding: '0.75rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Jam Operasi Aktual</span>
                <p className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', marginTop: '0.2rem' }}>
                  {workOrder.currentRunningHours || targetEquipment?.runningHours} Jam
                </p>
              </div>
            </div>

            {/* Interactive Checklist */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <h5 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                  Checklist Tugas Perawatan ({workOrder.checklist?.filter(c => c.done).length || 0}/{workOrder.checklist?.length || 0})
                </h5>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Klik item untuk mencentang pengerjaan
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {workOrder.checklist?.map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklist(workOrder.id, item.id)}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      background: item.done ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-surface-elevated)',
                      border: item.done ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => {}}
                      style={{ cursor: 'pointer', accentColor: '#10b981', width: '16px', height: '16px' }}
                    />
                    <span style={{
                      fontSize: '0.85rem',
                      color: item.done ? '#a7f3d0' : 'var(--text-main)',
                      textDecoration: item.done ? 'line-through' : 'none'
                    }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Spareparts Required */}
            {workOrder.partsRequired && workOrder.partsRequired.length > 0 && (
              <div>
                <h5 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Sparepart & Suku Cadang Terkait
                </h5>
                <div className="table-container">
                  <table className="pms-table">
                    <thead>
                      <tr>
                        <th>Nama Part</th>
                        <th>Jumlah</th>
                        <th>Estimasi Biaya</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workOrder.partsRequired.map((part, idx) => (
                        <tr key={idx}>
                          <td>{part.name}</td>
                          <td>{part.qty} {part.unit}</td>
                          <td className="mono">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(part.cost || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Form for creating new WO */
          <form onSubmit={handleCreateSubmit}>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Judul Pekerjaan Perawatan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Overhaul Katup Silinder Mesin Utama #2"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Kapal
                  </label>
                  <select
                    value={formData.vesselId}
                    onChange={(e) => setFormData({ ...formData, vesselId: e.target.value })}
                    className="select-control"
                  >
                    {vessels.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Equipment / Mesin
                  </label>
                  <select
                    value={formData.equipmentId}
                    onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
                    className="select-control"
                  >
                    {allEquipment.filter(e => e.vesselId === formData.vesselId).map(e => (
                      <option key={e.id} value={e.id}>{e.code} - {e.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Prioritas
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="select-control"
                  >
                    <option value="Rendah">Rendah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Sangat Tinggi">Sangat Tinggi (Kritis)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Teknisi yang Ditugaskan
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kurniawan (Masinis 2)"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="input-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Target Jam Operasi (Running Hours)
                  </label>
                  <input
                    type="number"
                    placeholder="Contoh: 10000"
                    value={formData.targetHours}
                    onChange={(e) => setFormData({ ...formData, targetHours: e.target.value })}
                    className="input-control mono"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Batas Tanggal (Due Date)
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="input-control"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Deskripsi / Instruksi Kerja Khusus
                </label>
                <textarea
                  rows="2"
                  placeholder="Lakukan pembersihan, pengukuran toleransi clearance dan uji coba running."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-control"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Batal
              </button>
              <button type="submit" className="btn btn-primary">
                Terbitkan Work Order
              </button>
            </div>
          </form>
        )}

        {isEdit && (
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Tutup
            </button>
            {workOrder.status !== 'Completed' && (
              <button
                type="button"
                onClick={() => {
                  handleStatusChange('Completed');
                  onClose();
                }}
                className="btn btn-success"
              >
                <CheckCircle size={16} />
                <span>Selesaikan & Sign-Off WO</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
