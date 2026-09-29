/**
 * TechnicalWOJobIdentity.jsx
 * Diekstrak dari TechnicalWorkOrderModal.jsx (baris 355-509).
 * Sumber: Bagian 1: identitas pekerjaan & mesin
 */
import React from 'react';
import { Cpu } from 'lucide-react';

export const TechnicalWOJobIdentity = ({
  assignedTechnician,
  dueDate,
  equipmentId,
  isCompleted,
  priority,
  selectedVesselId,
  setAssignedTechnician,
  setDueDate,
  setEquipmentId,
  setPriority,
  setSelectedVesselId,
  setTargetRunningHours,
  setTitle,
  setWoType,
  targetRunningHours,
  title,
  vesselEquipment,
  vessels,
  woType,
}) => {
  return (
    <div style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                    <Cpu size={18} color="#38bdf8" />
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>1. Identitas Mesin & Jenis Pemeliharaan</h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        Armada Kapal
                      </label>
                      <select
                        disabled={isCompleted}
                        value={selectedVesselId}
                        onChange={(e) => setSelectedVesselId(e.target.value)}
                        className="input-base"
                        style={{ width: '100%' }}
                      >
                        {vessels.map(v => (
                          <option key={v.id} value={v.id}>{v.name} ({v.type})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        Mesin / Equipment Target *
                      </label>
                      <select
                        disabled={isCompleted}
                        value={equipmentId}
                        onChange={(e) => {
                          setEquipmentId(e.target.value);
                          const eq = vesselEquipment.find(x => x.id === e.target.value);
                          if (eq) {
                            setTitle(`Servis Berkala ${eq.name}`);
                            setTargetRunningHours(eq.nextServiceHours || eq.runningHours + 500);
                          }
                        }}
                        className="input-base"
                        style={{ width: '100%' }}
                        required
                      >
                        {vesselEquipment.map(e => (
                          <option key={e.id} value={e.id}>
                            {e.code} - {e.name} (Jam: {e.runningHours.toLocaleString()} Jam)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        Jenis Work Order
                      </label>
                      <select
                        disabled={isCompleted}
                        value={woType}
                        onChange={(e) => setWoType(e.target.value)}
                        className="input-base"
                        style={{ width: '100%' }}
                      >
                        <option value="Preventive Maintenance (PM)">Preventive Maintenance (PM Berbasis Jam/Hari)</option>
                        <option value="Corrective Maintenance (Breakdown)">Corrective Maintenance (Perbaikan Kerusakan)</option>
                        <option value="Class Survey Preparation">Persiapan Survey Kelas BKI / Statutory</option>
                        <option value="Condition Monitoring">Condition Monitoring & Uji Parameter</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        Tingkat Prioritas
                      </label>
                      <select
                        disabled={isCompleted}
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="input-base"
                        style={{ width: '100%' }}
                      >
                        <option value="Kritis (Emergency)">🔴 Kritis (Emergency / Breakdown)</option>
                        <option value="Tinggi">🟠 Tinggi (Jatuh Tempo Segera)</option>
                        <option value="Sedang">🟡 Sedang (Rutin Berkala)</option>
                        <option value="Rendah">🟢 Rendah (Observasi)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      Judul Perintah Kerja (Job Title) *
                    </label>
                    <input
                      disabled={isCompleted}
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="input-base"
                      style={{ width: '100%' }}
                      placeholder="Contoh: Servis Rutin 500 Jam & Penggantian Filter Mesin Induk Kiri"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        Target Jam Mesin (Running Hours)
                      </label>
                      <input
                        disabled={isCompleted}
                        type="number"
                        value={targetRunningHours}
                        onChange={(e) => setTargetRunningHours(e.target.value)}
                        className="input-base"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        Target Tanggal Selesai (Due Date)
                      </label>
                      <input
                        disabled={isCompleted}
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="input-base"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        Teknisi Pelaksana (PIC)
                      </label>
                      <input
                        disabled={isCompleted}
                        type="text"
                        value={assignedTechnician}
                        onChange={(e) => setAssignedTechnician(e.target.value)}
                        className="input-base"
                        style={{ width: '100%' }}
                        placeholder="Nama Masinis / Teknisi"
                      />
                    </div>
                  </div>
                </div>
  );
};
