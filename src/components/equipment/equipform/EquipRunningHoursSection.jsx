/**
 * EquipRunningHoursSection.jsx
 * Diekstrak dari EquipmentFormModal.jsx (baris 465-653).
 * Sumber: Seksi Pencatatan Jam Operasi & Target Servis beserta lencana status proyeksi
 */
import React from 'react';
import { Clock } from 'lucide-react';

export const EquipRunningHoursSection = ({
  applyPresetInterval,
  calculatedStatus,
  hoursLeft,
  lastMaintenanceHours,
  nextServiceHours,
  numNext,
  numRunning,
  percentageUsed,
  runningHours,
  setLastMaintenanceHours,
  setNextServiceHours,
  setRunningHours,
  theme,
}) => {
  return (
    <div
                  style={{
                    background: theme === 'light' ? '#f8fafc' : 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '1.25rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={18} color="#f59e0b" />
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                        Pencatatan Jam Operasi (Running Hours) & Target Servis
                      </h4>
                    </div>
                    <span className={`badge ${
                      calculatedStatus === 'Overdue' ? 'badge-danger-pulse' :
                      calculatedStatus === 'Due Soon' ? 'badge-warning' : 'badge-success'
                    }`}>
                      Status Proyeksi: {calculatedStatus}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    {/* Current Running Hours */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        Jam Operasi Saat Ini (Running Hours) <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          required
                          min="0"
                          value={runningHours}
                          onChange={(e) => setRunningHours(Number(e.target.value))}
                          className="input-control mono"
                          style={{ fontSize: '1rem', fontWeight: 700, paddingRight: '3rem' }}
                        />
                        <span style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Jam
                        </span>
                      </div>
                    </div>

                    {/* Last Maintenance Hours */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        Jam Terakhir Diservis (Last Maintenance)
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          min="0"
                          value={lastMaintenanceHours}
                          onChange={(e) => setLastMaintenanceHours(Number(e.target.value))}
                          className="input-control mono"
                          style={{ paddingRight: '3rem' }}
                        />
                        <span style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Jam
                        </span>
                      </div>
                    </div>

                    {/* Next Service Hours */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        Target Servis Berikutnya (Next Service) <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          required
                          min="1"
                          value={nextServiceHours}
                          onChange={(e) => setNextServiceHours(Number(e.target.value))}
                          className="input-control mono"
                          style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8', paddingRight: '3rem' }}
                        />
                        <span style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Jam
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Interval Preset Buttons */}
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                      Preset Tambah Interval PMS dari Jam Berjalan:
                    </span>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => applyPresetInterval(250)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                      >
                        +250 Jam (Ganti Filter/Oli)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPresetInterval(500)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                      >
                        +500 Jam (Intermediate)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPresetInterval(1000)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                      >
                        +1.000 Jam (Semi-Overhaul)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPresetInterval(2500)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                      >
                        +2.500 Jam (Mayor Service)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPresetInterval(5000)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                      >
                        +5.000 Jam (General Overhaul)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPresetInterval(10000)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                      >
                        +10.000 Jam (Survey BKI / Dok)
                      </button>
                    </div>
                  </div>

                  {/* Progress & Remaining Hours Simulation Box */}
                  <div
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      background: hoursLeft <= 0
                        ? 'rgba(239, 68, 68, 0.12)'
                        : hoursLeft <= 200
                        ? 'rgba(245, 158, 11, 0.12)'
                        : 'rgba(16, 185, 129, 0.12)',
                      border: hoursLeft <= 0
                        ? '1px solid rgba(239, 68, 68, 0.35)'
                        : hoursLeft <= 200
                        ? '1px solid rgba(245, 158, 11, 0.35)'
                        : '1px solid rgba(16, 185, 129, 0.35)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                      <span>
                        Pemakaian Jam: <strong>{numRunning.toLocaleString()} / {numNext.toLocaleString()} Jam ({percentageUsed}%)</strong>
                      </span>
                      <strong style={{
                        color: hoursLeft <= 0 ? '#ef4444' : hoursLeft <= 200 ? '#f59e0b' : '#10b981'
                      }}>
                        {hoursLeft <= 0 ? `🚨 OVERDUE ${Math.abs(hoursLeft)} Jam!` : `⏳ Sisa ${hoursLeft} Jam Menuju Servis`}
                      </strong>
                    </div>

                    <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${percentageUsed}%`,
                          height: '100%',
                          borderRadius: '4px',
                          background: hoursLeft <= 0
                            ? '#ef4444'
                            : hoursLeft <= 200
                            ? '#f59e0b'
                            : '#10b981',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                </div>
  );
};
