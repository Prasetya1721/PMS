/**
 * TabEquipment.jsx
 * Diekstrak dari VesselDashboard.jsx (baris 1204-1299).
 * Sumber: SUB-TAB 4: equipment & jam mesin
 */
import React from 'react';
import { Clock } from 'lucide-react';

export const TabEquipment = ({
  currentShip,
  setSelectedEqForHours,
  shipEquipment,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                    Equipment & Jam Operasi Mesin: {currentShip.name}
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Daftar permesinan utama, genset, sistem jangkar/towing, dan pemantauan running hours kapal ini
                  </p>
                </div>
              </div>

              <div className="grid-cols-2">
                {shipEquipment.map(eq => {
                  const hoursLeft = eq.nextServiceHours - eq.runningHours;
                  const percentageUsed = Math.min(100, Math.round((eq.runningHours / eq.nextServiceHours) * 100));

                  return (
                    <div
                      key={eq.id}
                      className="glass-card"
                      style={{
                        padding: '1.25rem',
                        border: eq.status === 'Overdue' ? '1px solid rgba(239, 68, 68, 0.4)' : undefined
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="mono" style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>
                              {eq.code}
                            </span>
                            <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                              {eq.category}
                            </span>
                          </div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.25rem' }}>{eq.name}</h4>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Model: <strong>{eq.model}</strong> • S/N: <span className="mono">{eq.serialNumber}</span>
                          </p>
                        </div>

                        <span className={`badge ${
                          eq.status === 'Overdue' ? 'badge-danger-pulse' :
                          eq.status === 'Due Soon' ? 'badge-warning' : 'badge-success'
                        }`}>
                          {eq.status}
                        </span>
                      </div>

                      {/* Subcomponents */}
                      {eq.subComponents && (
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                          {eq.subComponents.map((sub, sIdx) => (
                            <span key={sIdx} className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                              {sub}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Hours Bar */}
                      <div style={{ marginTop: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Jam Kerja Aktual: <strong className="mono" style={{ color: '#fff' }}>{eq.runningHours?.toLocaleString()} Jam</strong></span>
                          <span style={{ color: 'var(--text-muted)' }}>Target Servis: <strong className="mono">{eq.nextServiceHours?.toLocaleString()} Jam</strong></span>
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                          <span style={{ fontSize: '0.78rem', color: hoursLeft <= 0 ? '#ef4444' : '#f59e0b', fontWeight: 600 }}>
                            {hoursLeft <= 0 ? `Overdue ${Math.abs(hoursLeft)} Jam Operasional!` : `Tersisa ${hoursLeft} Jam Menuju Servis`}
                          </span>
                          <button
                            onClick={() => setSelectedEqForHours(eq)}
                            className="btn btn-secondary btn-sm"
                          >
                            <Clock size={13} />
                            <span>Log Jam Mesin</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
  );
};
