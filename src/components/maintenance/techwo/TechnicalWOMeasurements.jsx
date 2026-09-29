/**
 * TechnicalWOMeasurements.jsx
 * Diekstrak dari TechnicalWorkOrderModal.jsx (baris 718-849).
 * Sumber: Bagian 4: pengukuran parameter teknis & penyelesaian servis
 */
import React from 'react';
import { Activity } from 'lucide-react';

export const TechnicalWOMeasurements = ({
  captainApprover,
  chiefApprover,
  executedRunningHours,
  isCompleted,
  oilPressure,
  serviceCost,
  setCaptainApprover,
  setChiefApprover,
  setExecutedRunningHours,
  setOilPressure,
  setServiceCost,
  setWaterTemp,
  setWorkDoneSummary,
  waterTemp,
  workDoneSummary,
}) => {
  return (
    <div style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(to right, rgba(16, 185, 129, 0.08), rgba(2, 132, 199, 0.05))',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(16, 185, 129, 0.25)', paddingBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Activity size={18} color="#10b981" />
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                        4. Hasil Pengukuran Parameter & Verifikasi Penutupan Work Order
                      </h4>
                    </div>
                    <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                      Auto-Reset Jam Servis
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                        Jam Mesin Saat Servis (Running Hours) *
                      </label>
                      <input
                        disabled={isCompleted}
                        type="number"
                        value={executedRunningHours}
                        onChange={(e) => setExecutedRunningHours(e.target.value)}
                        className="input-base"
                        style={{ width: '100%', fontWeight: 700, color: '#38bdf8' }}
                        required
                      />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Otomatis mereset jam mesin terakhir
                      </span>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                        Tekanan Oli Pelumas (bar)
                      </label>
                      <input
                        disabled={isCompleted}
                        type="number"
                        step="0.1"
                        value={oilPressure}
                        onChange={(e) => setOilPressure(e.target.value)}
                        className="input-base"
                        style={{ width: '100%' }}
                      />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Standar: 3.5 - 5.0 bar</span>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                        Suhu Air Pendingin (°C)
                      </label>
                      <input
                        disabled={isCompleted}
                        type="number"
                        value={waterTemp}
                        onChange={(e) => setWaterTemp(e.target.value)}
                        className="input-base"
                        style={{ width: '100%' }}
                      />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Standar: 75 - 85 °C</span>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                        Biaya Jasa / Pihak ke-3 (Rp)
                      </label>
                      <input
                        disabled={isCompleted}
                        type="number"
                        value={serviceCost}
                        onChange={(e) => setServiceCost(e.target.value)}
                        className="input-base"
                        style={{ width: '100%' }}
                        placeholder="0 jika dikerjakan kru sendiri"
                      />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Otomatis tercatat ke Buku Kas</span>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                      Ringkasan Hasil Pekerjaan (Work Done Summary)
                    </label>
                    <textarea
                      disabled={isCompleted}
                      rows={2}
                      value={workDoneSummary}
                      onChange={(e) => setWorkDoneSummary(e.target.value)}
                      className="input-base"
                      style={{ width: '100%', resize: 'vertical' }}
                      placeholder="Deskripsikan kondisi komponen setelah diperiksa, penggantian suku cadang, dan hasil uji coba..."
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                        Verifikasi KKM (Chief Engineer)
                      </label>
                      <input
                        disabled={isCompleted}
                        type="text"
                        value={chiefApprover}
                        onChange={(e) => setChiefApprover(e.target.value)}
                        className="input-base"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                        Mengetahui Nakhoda (Master Captain)
                      </label>
                      <input
                        disabled={isCompleted}
                        type="text"
                        value={captainApprover}
                        onChange={(e) => setCaptainApprover(e.target.value)}
                        className="input-base"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </div>
  );
};
