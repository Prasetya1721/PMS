/**
 * CostBudgetTab.jsx
 * Diekstrak dari CostOverview.jsx (baris 196-451).
 * Sumber: Sub-tab Anggaran: pemilih kapal, ringkasan pagu, tabel alokasi anggaran per kapal
 */
import React from 'react';
import { AlertTriangle, Calendar, Edit2, Plus, Ship, Users } from 'lucide-react';

export const CostBudgetTab = ({
  absorptionRate,
  canAction,
  categoriesList,
  currentBudget,
  expenseForm,
  formatIDR,
  getStatusBadge,
  openEditBudgetModal,
  selectedVesselId,
  setExpenseForm,
  setSelectedVesselId,
  setShowAddExpenseModal,
  totalAllocated,
  totalSpent,
  totalVariance,
  vessels,
}) => {
  return (
    <>
              {/* Controls Bar: Vessel Selector & Action Buttons */}
              <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Ship size={18} color="#38bdf8" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Pilih Kapal:</span>
                    <select
                      value={selectedVesselId}
                      onChange={(e) => setSelectedVesselId(e.target.value)}
                      className="select-control"
                      style={{ width: '220px' }}
                    >
                      {vessels.map(v => (
                        <option key={v.id} value={v.id}>{v.name} ({v.type})</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <Calendar size={15} />
                    <span>{currentBudget?.period || 'Tahun Anggaran 2026'}</span>
                    <span>•</span>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>{currentBudget?.status || 'Disahkan Finance'}</span>
                  </div>
                </div>

                {/* Action Buttons for Finance */}
                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  {canAction('record_actual_expense') && (
                    <button
                      onClick={() => {
                        setExpenseForm({ ...expenseForm, vesselId: selectedVesselId });
                        setShowAddExpenseModal(true);
                      }}
                      className="btn btn-secondary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <Plus size={15} color="#10b981" />
                      <span>+ Catat Pengeluaran Baru</span>
                    </button>
                  )}

                  {canAction('edit_vessel_budget') && (
                    <button
                      onClick={openEditBudgetModal}
                      className="btn btn-primary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <Edit2 size={15} />
                      <span>Atur / Edit Pagu Anggaran Kapal</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Budget KPI Cards */}
              <div className="grid-cols-4">
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Total Pagu Anggaran (Budget)
                  </span>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.35rem', color: '#38bdf8' }}>
                    {formatIDR(totalAllocated)}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
                    Alokasi disahkan untuk {currentBudget?.vesselName || 'KM. RP 2020'}
                  </p>
                </div>

                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Realisasi Pengeluaran (Actual)
                  </span>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.35rem', color: '#10b981' }}>
                    {formatIDR(totalSpent)}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Total pengeluaran riil terverifikasi invoice
                  </p>
                </div>

                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Sisa Pagu Anggaran (Variance)
                  </span>
                  <h3 style={{
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    marginTop: '0.35rem',
                    color: totalVariance >= 0 ? '#38bdf8' : '#ef4444'
                  }}>
                    {formatIDR(totalVariance)}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    {totalVariance >= 0 ? 'Surplus / Dalam kendali' : 'Pagu Terlampaui (Overbudget)!'}
                  </p>
                </div>

                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Tingkat Penyerapan
                    </span>
                    <span className={`badge ${
                      absorptionRate >= 100 ? 'badge-danger-pulse' :
                      absorptionRate >= 85 ? 'badge-warning' : 'badge-success'
                    }`} style={{ fontSize: '0.7rem' }}>
                      {absorptionRate >= 100 ? 'Overbudget' : absorptionRate >= 85 ? 'Waspada' : 'Aman'}
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    marginTop: '0.35rem',
                    color: absorptionRate >= 100 ? '#ef4444' : absorptionRate >= 85 ? '#f59e0b' : '#10b981'
                  }}>
                    {absorptionRate}%
                  </h3>
                  <div className="progress-bar-container" style={{ marginTop: '0.5rem' }}>
                    <div
                      className={`progress-bar-fill ${
                        absorptionRate >= 100 ? 'progress-red' :
                        absorptionRate >= 85 ? 'progress-amber' : 'progress-emerald'
                      }`}
                      style={{ width: `${Math.min(100, absorptionRate)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Alert Banner if Approaching or Exceeding Budget */}
              {absorptionRate >= 85 && (
                <div style={{
                  padding: '0.9rem 1.25rem',
                  borderRadius: '8px',
                  background: absorptionRate >= 100 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                  border: `1px solid ${absorptionRate >= 100 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <AlertTriangle size={20} color={absorptionRate >= 100 ? '#ef4444' : '#f59e0b'} />
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: absorptionRate >= 100 ? '#ef4444' : '#f59e0b' }}>
                      {absorptionRate >= 100
                        ? 'Peringatan Finance: Anggaran Kapal Ini Telah Melebihi Pagu (Overbudget)!'
                        : 'Pemberitahuan Finance: Penyerapan Anggaran Telah Mencapai Ambang Batas Waspada (>85%)'}
                    </strong>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      Mohon tinjau realisasi pengeluaran pada pos-pos terkait dan koordinasikan dengan Fleet Manager sebelum menyetujui Purchase Order baru.
                    </p>
                  </div>
                </div>
              )}

              {/* Breakdown Table: 7 Pos Anggaran Kapal */}
              <div className="glass-card" style={{ overflow: 'hidden' }}>
                <div style={{
                  padding: '1.25rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Rincian Alokasi Pagu Anggaran per Pos Biaya</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Breakdown pagu biaya operasional kapal & provisi logistik awak kapal KM. RP 2020
                    </p>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                    Terakhir Diperbarui: <strong className="mono">{currentBudget?.lastUpdated || '-'}</strong>
                  </div>
                </div>

                <div className="table-container">
                  <table className="pms-table">
                    <thead>
                      <tr>
                        <th>Kode Akun</th>
                        <th>Pos / Komponen Anggaran</th>
                        <th>Sasaran</th>
                        <th>Pagu Anggaran (Budget)</th>
                        <th>Realisasi (Actual)</th>
                        <th>Sisa (Variance)</th>
                        <th>Rasio Penyerapan (%)</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoriesList.map(cat => {
                        const ratio = cat.allocated > 0 ? Math.round((cat.spent / cat.allocated) * 100) : 0;
                        const variance = cat.allocated - cat.spent;
                        const status = getStatusBadge(cat.spent, cat.allocated);
                        const isCrewTarget = cat.target === 'Crew';

                        return (
                          <tr key={cat.id || cat.code}>
                            <td className="mono" style={{ fontWeight: 700, color: '#38bdf8' }}>
                              {cat.code}
                            </td>
                            <td>
                              <strong style={{ fontSize: '0.9rem' }}>{cat.name}</strong>
                            </td>
                            <td>
                              <span className={`badge ${isCrewTarget ? 'badge-success' : 'badge-info'}`} style={{ fontSize: '0.7rem' }}>
                                {isCrewTarget ? <Users size={12} style={{ display: 'inline', marginRight: '4px' }} /> : <Ship size={12} style={{ display: 'inline', marginRight: '4px' }} />}
                                {cat.target || 'Kapal'}
                              </span>
                            </td>
                            <td className="mono" style={{ fontWeight: 600 }}>
                              {formatIDR(cat.allocated)}
                            </td>
                            <td className="mono" style={{ fontWeight: 700, color: '#10b981' }}>
                              {formatIDR(cat.spent)}
                            </td>
                            <td className="mono" style={{
                              fontWeight: 700,
                              color: variance >= 0 ? 'var(--text-main)' : '#ef4444'
                            }}>
                              {formatIDR(variance)}
                            </td>
                            <td style={{ width: '180px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div className="progress-bar-container" style={{ flex: 1 }}>
                                  <div
                                    className={`progress-bar-fill ${
                                      ratio >= 100 ? 'progress-red' :
                                      ratio >= 85 ? 'progress-amber' : 'progress-emerald'
                                    }`}
                                    style={{ width: `${Math.min(100, ratio)}%` }}
                                  />
                                </div>
                                <span className="mono" style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                                  {ratio}%
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${status.class}`}>
                                {status.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
  );
};
