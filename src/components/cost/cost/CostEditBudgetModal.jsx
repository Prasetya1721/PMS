/**
 * CostEditBudgetModal.jsx
 * Diekstrak dari CostOverview.jsx (baris 580-720).
 * Sumber: Modal atur pagu anggaran kapal per periode
 */
import React from 'react';
import { X } from 'lucide-react';

export const CostEditBudgetModal = ({
  editBudgetForm,
  formatIDR,
  handleSaveBudget,
  setEditBudgetForm,
  setShowEditBudgetModal,
}) => {
  return (
    <div className="modal-overlay" onClick={() => setShowEditBudgetModal(false)}>
              <div className="modal-dialog" style={{ maxWidth: '750px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Atur Pagu Anggaran Kapal (Vessel Budget Allocation)</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Alokasi batas pengeluaran operasional kapal {editBudgetForm.vesselName} - {editBudgetForm.period}
                    </p>
                  </div>
                  <button onClick={() => setShowEditBudgetModal(false)} className="btn-icon">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveBudget}>
                  <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '68vh', overflowY: 'auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Nama Periode Anggaran
                        </label>
                        <input
                          type="text"
                          value={editBudgetForm.period}
                          onChange={e => setEditBudgetForm({ ...editBudgetForm, period: e.target.value })}
                          className="input-control"
                          required
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Pejabat Pengesah (Finance Approval)
                        </label>
                        <input
                          type="text"
                          value={editBudgetForm.approvedBy}
                          onChange={e => setEditBudgetForm({ ...editBudgetForm, approvedBy: e.target.value })}
                          className="input-control"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        Alokasi Pagu Anggaran per Pos Biaya (IDR):
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {editBudgetForm.categories.map((cat, idx) => (
                          <div
                            key={cat.code}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '100px 1fr 180px',
                              alignItems: 'center',
                              gap: '0.75rem',
                              padding: '0.75rem',
                              borderRadius: '8px',
                              background: 'var(--bg-surface-elevated)',
                              border: '1px solid var(--border-subtle)'
                            }}
                          >
                            <span className="mono" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#38bdf8' }}>
                              {cat.code}
                            </span>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{cat.name}</div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                                Sasaran: {cat.target || 'Kapal'} • Realisasi Saat Ini: {formatIDR(cat.spent)}
                              </span>
                            </div>
                            <div>
                              <input
                                type="number"
                                min="0"
                                step="500000"
                                value={cat.allocated}
                                onChange={e => {
                                  const nextCats = [...editBudgetForm.categories];
                                  nextCats[idx].allocated = Number(e.target.value) || 0;
                                  setEditBudgetForm({ ...editBudgetForm, categories: nextCats });
                                }}
                                className="input-control mono"
                                style={{ textAlign: 'right', fontWeight: 700 }}
                                required
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total Computed Budget Summary */}
                    <div style={{
                      padding: '1rem',
                      borderRadius: '8px',
                      background: 'rgba(56, 189, 248, 0.08)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Pagu Anggaran Dihitung:</span>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>
                          {formatIDR(editBudgetForm.categories.reduce((s, c) => s + (Number(c.allocated) || 0), 0))}
                        </h4>
                      </div>
                      <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                        Otoritas Finance PBK
                      </span>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        Catatan & Ketentuan Anggaran
                      </label>
                      <textarea
                        rows={2}
                        value={editBudgetForm.notes}
                        onChange={e => setEditBudgetForm({ ...editBudgetForm, notes: e.target.value })}
                        className="input-control"
                        placeholder="Ketentuan batas pengadaan, jadwal revisi anggaran triwulan..."
                      />
                    </div>
                  </div>

                  <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button type="button" onClick={() => setShowEditBudgetModal(false)} className="btn btn-secondary">
                      Batal
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Simpan & Sahkan Pagu Anggaran
                    </button>
                  </div>
                </form>
              </div>
            </div>
  );
};
