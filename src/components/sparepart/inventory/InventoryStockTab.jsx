/**
 * InventoryStockTab.jsx
 * Diekstrak dari InventoryList.jsx (baris 226-473).
 * Sumber: Tab Stok Gudang Kapal: kartu ringkasan, pencarian, tabel stok, aksi transfer/pakai
 */
import React from 'react';
import { AlertTriangle, Plus, Search, Ship, ShoppingCart, Truck, Users } from 'lucide-react';

export const InventoryStockTab = ({
  canAction,
  crewItemsCount,
  criticalItemsCount,
  filteredInventory,
  formatIDR,
  openSPBKForItem,
  search,
  setConsumeQty,
  setSearch,
  setSelectedItemForAction,
  setShowAddItemModal,
  setShowConsumeModal,
  setShowTransferModal,
  setTargetFilter,
  setTransferQty,
  shipItemsCount,
  spareparts,
  targetFilter,
}) => {
  return (
    <>
              {/* Quick Metrics Bar */}
              <div className="grid-cols-4">
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total SKU Barang</span>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.35rem', color: '#38bdf8' }}>
                    {spareparts.length} Item
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
                    Katalog terdaftar darat & kapal
                  </p>
                </div>

                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Users size={16} color="#10b981" />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Logistik Kru (BAMA & APD)</span>
                  </div>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.35rem', color: '#10b981' }}>
                    {crewItemsCount} Item
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Beras, galon, telur, wearpack, sepatu
                  </p>
                </div>

                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Ship size={16} color="#38bdf8" />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Logistik Kapal & Mesin</span>
                  </div>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.35rem', color: '#38bdf8' }}>
                    {shipItemsCount} Item
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Oli pelumas, filter, tali tross, cat
                  </p>
                </div>

                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertTriangle size={16} color="#f59e0b" />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Stok Kritis / Reorder</span>
                  </div>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.35rem', color: criticalItemsCount > 0 ? '#ef4444' : '#10b981' }}>
                    {criticalItemsCount} Item
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Di bawah batas minimum kapal
                  </p>
                </div>
              </div>

              {/* Filters & Actions Bar */}
              <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setTargetFilter('ALL')}
                    className={`btn btn-sm ${targetFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    Semua Barang ({spareparts.length})
                  </button>
                  <button
                    onClick={() => setTargetFilter('Crew')}
                    className={`btn btn-sm ${targetFilter === 'Crew' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Users size={14} />
                    <span>Logistik Kru / BAMA ({crewItemsCount})</span>
                  </button>
                  <button
                    onClick={() => setTargetFilter('Kapal')}
                    className={`btn btn-sm ${targetFilter === 'Kapal' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Ship size={14} />
                    <span>Logistik Kapal / Deck</span>
                  </button>
                  <button
                    onClick={() => setTargetFilter('Sparepart')}
                    className={`btn btn-sm ${targetFilter === 'Sparepart' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    Suku Cadang Mesin
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={15} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Cari SKU, nama, lokasi..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="input-control"
                      style={{ width: '220px', paddingLeft: '2.2rem', fontSize: '0.825rem' }}
                    />
                  </div>

                  {canAction('create_purchase_request') && (
                    <button
                      onClick={() => setShowAddItemModal(true)}
                      className="btn btn-primary"
                      style={{ fontSize: '0.825rem' }}
                    >
                      <Plus size={15} />
                      <span>+ Tambah Barang Baru</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Table: Dual Warehouse & Onboard Stock */}
              <div className="glass-card" style={{ overflow: 'hidden' }}>
                <div className="table-container">
                  <table className="pms-table">
                    <thead>
                      <tr>
                        <th>SKU & Nama Barang</th>
                        <th>Sasaran</th>
                        <th>Kategori & Subkategori</th>
                        <th>Stok Gudang Darat</th>
                        <th>Stok Onboard Kapal</th>
                        <th>Batas Min</th>
                        <th>Estimasi Harga</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Aksi Logistik</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInventory.length === 0 ? (
                        <tr>
                          <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            Tidak ada data logistik sesuai filter pencarian.
                          </td>
                        </tr>
                      ) : (
                        filteredInventory.map(item => {
                          const isCrew = item.target === 'Crew';
                          const isLow = item.stockQty <= item.minStockQty;

                          return (
                            <tr key={item.id}>
                              <td>
                                <div className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>
                                  {item.code}
                                </div>
                                <strong style={{ fontSize: '0.875rem' }}>{item.name}</strong>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                                  Simpan: {item.location} • Rekanan: {item.supplier || '-'}
                                </div>
                              </td>
                              <td>
                                <span className={`badge ${isCrew ? 'badge-success' : 'badge-info'}`} style={{ fontSize: '0.7rem' }}>
                                  {isCrew ? <Users size={12} style={{ display: 'inline', marginRight: '4px' }} /> : <Ship size={12} style={{ display: 'inline', marginRight: '4px' }} />}
                                  {item.target || 'Kapal'}
                                </span>
                              </td>
                              <td>
                                <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>{item.category}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.subCategory || '-'}</div>
                              </td>
                              <td>
                                <div className="mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8' }}>
                                  {item.stockWarehouse || 0} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.unit}</span>
                                </div>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Gudang Pontianak</span>
                              </td>
                              <td>
                                <div className="mono" style={{
                                  fontSize: '0.95rem',
                                  fontWeight: 800,
                                  color: isLow ? '#ef4444' : '#10b981'
                                }}>
                                  {item.stockQty} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.unit}</span>
                                </div>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>KM. RP 2020</span>
                              </td>
                              <td className="mono" style={{ fontSize: '0.825rem' }}>
                                {item.minStockQty} {item.unit}
                              </td>
                              <td className="mono" style={{ fontSize: '0.825rem' }}>
                                {formatIDR(item.unitCost)}
                              </td>
                              <td>
                                <span className={`badge ${
                                  item.status === 'Critical' ? 'badge-danger-pulse' :
                                  item.status === 'Low Stock' ? 'badge-warning' : 'badge-success'
                                }`} style={{ fontSize: '0.7rem' }}>
                                  {item.status}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem', alignItems: 'center' }}>
                                  {/* Transfer from Warehouse to Vessel */}
                                  {canAction('transfer_warehouse_stock') && (
                                    <button
                                      onClick={() => {
                                        setSelectedItemForAction(item);
                                        setTransferQty(Math.min(item.stockWarehouse || 1, Math.max(1, (item.minStockQty || 1) - item.stockQty)));
                                        setShowTransferModal(true);
                                      }}
                                      className="btn btn-secondary btn-sm"
                                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                                      title="Transfer Mutasi dari Gudang Darat ke Kapal"
                                    >
                                      <Truck size={13} color="#38bdf8" />
                                      <span>Transfer</span>
                                    </button>
                                  )}

                                  {/* Consume Onboard */}
                                  <button
                                    onClick={() => {
                                      setSelectedItemForAction(item);
                                      setConsumeQty(1);
                                      setShowConsumeModal(true);
                                    }}
                                    className="btn btn-secondary btn-sm"
                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                                    title="Catat Pemakaian Onboard Kapal"
                                  >
                                    <span>Pakai</span>
                                  </button>

                                  {/* Create SPBK */}
                                  <button
                                    onClick={() => openSPBKForItem(item)}
                                    className="btn btn-primary btn-sm"
                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                                    title="Ajukan Surat Permintaan Barang Kapal (SPBK)"
                                  >
                                    <ShoppingCart size={13} />
                                    <span>Order SPBK</span>
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
            </>
  );
};
