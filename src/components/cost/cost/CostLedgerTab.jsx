/**
 * CostLedgerTab.jsx
 * Diekstrak dari CostOverview.jsx (baris 454-577).
 * Sumber: Sub-tab Buku Besar: tabel transaksi pengeluaran dan pembelian yang memotong pagu
 */
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { usePMS } from '../../../context/PMSContext';

export const CostLedgerTab = ({
  canAction,
  categoriesList,
  deleteExpenseTransaction,
  filteredCosts,
  formatIDR,
  searchLedger,
  selectedCategoryFilter,
  setSearchLedger,
  setSelectedCategoryFilter,
  setShowAddExpenseModal,
  vessels,
}) => {
  // Dialog konfirmasi in-app (pengganti window.confirm) — infrastruktur aplikasi,
  // bukan data yang dioper induk, jadi diambil dari context dan tidak lewat props.
  const confirm = usePMS().confirm;
  return (
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
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Buku Besar Transaksi Pengeluaran & Pembelian</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Catatan invoice, PO suku cadang, dan belanja logistik provisi BAMA yang memotong pagu anggaran kapal
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Cari deskripsi, invoice, vendor..."
                    value={searchLedger}
                    onChange={(e) => setSearchLedger(e.target.value)}
                    className="input-control"
                    style={{ width: '220px', padding: '0.45rem 0.8rem', fontSize: '0.825rem' }}
                  />

                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="select-control"
                    style={{ width: '200px' }}
                  >
                    <option value="ALL">Semua Pos Anggaran</option>
                    {categoriesList.map(c => (
                      <option key={c.code} value={c.name}>{c.code} - {c.name}</option>
                    ))}
                  </select>

                  {canAction('record_actual_expense') && (
                    <button
                      onClick={() => setShowAddExpenseModal(true)}
                      className="btn btn-primary"
                      style={{ fontSize: '0.825rem' }}
                    >
                      <Plus size={14} />
                      <span>+ Catat Pengeluaran</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="table-container">
                <table className="pms-table">
                  <thead>
                    <tr>
                      <th>No. ID / Invoice</th>
                      <th>Kapal</th>
                      <th>Pos Anggaran Terkait</th>
                      <th>Deskripsi Belanja / Pekerjaan</th>
                      <th>Vendor Rekanan</th>
                      <th>Tanggal</th>
                      <th>Realisasi Biaya (Actual)</th>
                      {canAction('record_actual_expense') && <th style={{ textAlign: 'right' }}>Aksi</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCosts.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                          Tidak ditemukan catatan transaksi pengeluaran sesuai filter.
                        </td>
                      </tr>
                    ) : (
                      filteredCosts.map(cost => {
                        const vesselName = vessels.find(v => v.id === cost.vesselId)?.name || '-';
                        return (
                          <tr key={cost.id}>
                            <td>
                              <div className="mono" style={{ fontWeight: 700, color: '#38bdf8' }}>{cost.id}</div>
                              {cost.invoiceNo && (
                                <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                                  {cost.invoiceNo}
                                </span>
                              )}
                            </td>
                            <td style={{ fontWeight: 600 }}>{vesselName}</td>
                            <td>
                              <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                                {cost.budgetCategoryCode ? `${cost.budgetCategoryCode} • ` : ''}{cost.category}
                              </span>
                            </td>
                            <td style={{ fontSize: '0.85rem' }}>{cost.description}</td>
                            <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{cost.vendor}</td>
                            <td className="mono" style={{ fontSize: '0.78rem' }}>{cost.date}</td>
                            <td className="mono" style={{ fontWeight: 700, color: '#10b981' }}>
                              {formatIDR(cost.amount)}
                            </td>
                            {canAction('record_actual_expense') && (
                              <td style={{ textAlign: 'right' }}>
                                <button
                                  onClick={async () => {
                                    const lanjut = await confirm({
                                      variant: 'danger',
                                      title: 'Batalkan Transaksi',
                                      subtitle: 'Pagu anggaran kapal akan dikembalikan',
                                      message: `Batalkan pengeluaran ${cost.id} (${cost.description})?`,
                                      confirmLabel: 'Batalkan Transaksi'
                                    });
                                    if (lanjut) deleteExpenseTransaction(cost.id);
                                  }}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '0.2rem 0.5rem', color: '#f87171' }}
                                  title="Hapus / Batalkan Transaksi"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
  );
};
