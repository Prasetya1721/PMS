/**
 * CostAddExpenseModal.jsx
 * Diekstrak dari CostOverview.jsx (baris 723-858).
 * Sumber: Modal catat pengeluaran riil (invoice, PO suku cadang, provisi BAMA)
 */
import React from 'react';
import { X } from 'lucide-react';

export const CostAddExpenseModal = ({
  categoriesList,
  expenseForm,
  handleSaveExpense,
  setExpenseForm,
  setShowAddExpenseModal,
  vessels,
}) => {
  return (
    <div className="modal-overlay" onClick={() => setShowAddExpenseModal(false)}>
              <div className="modal-dialog" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Catat Pengeluaran Riil (Actual Expense)</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Catat invoice belanja suku cadang, provisi BAMA kru, atau servis yang memotong pagu anggaran
                    </p>
                  </div>
                  <button onClick={() => setShowAddExpenseModal(false)} className="btn-icon">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveExpense}>
                  <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Kapal Pembebanan
                        </label>
                        <select
                          value={expenseForm.vesselId}
                          onChange={e => setExpenseForm({ ...expenseForm, vesselId: e.target.value })}
                          className="select-control"
                        >
                          {vessels.map(v => (
                            <option key={v.id} value={v.id}>{v.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Pos Anggaran Terkait
                        </label>
                        <select
                          value={expenseForm.categoryCode}
                          onChange={e => setExpenseForm({ ...expenseForm, categoryCode: e.target.value })}
                          className="select-control"
                        >
                          {categoriesList.map(c => (
                            <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        Deskripsi Pembelian / Pekerjaan
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Belanja BAMA beras & ransum dapur pelayaran September"
                        value={expenseForm.description}
                        onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
                        className="input-control"
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Nomor Invoice / Kuitansi / PO
                        </label>
                        <input
                          type="text"
                          placeholder="INV-2026-XXXX"
                          value={expenseForm.invoiceNo}
                          onChange={e => setExpenseForm({ ...expenseForm, invoiceNo: e.target.value })}
                          className="input-control"
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Vendor / Supplier Rekanan
                        </label>
                        <input
                          type="text"
                          placeholder="Nama toko / rekanan penyedia"
                          value={expenseForm.vendor}
                          onChange={e => setExpenseForm({ ...expenseForm, vendor: e.target.value })}
                          className="input-control"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Tanggal Transaksi / Pembayaran
                        </label>
                        <input
                          type="date"
                          value={expenseForm.date}
                          onChange={e => setExpenseForm({ ...expenseForm, date: e.target.value })}
                          className="input-control"
                          required
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Nominal Pengeluaran (IDR)
                        </label>
                        <input
                          type="number"
                          min="1000"
                          step="1000"
                          placeholder="Rp 0"
                          value={expenseForm.amount}
                          onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                          className="input-control mono"
                          style={{ fontWeight: 700, color: '#10b981' }}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button type="button" onClick={() => setShowAddExpenseModal(false)} className="btn btn-secondary">
                      Batal
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Posting Pengeluaran ke Anggaran Kapal
                    </button>
                  </div>
                </form>
              </div>
            </div>
  );
};
