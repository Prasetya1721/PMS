/**
 * WorkOrderItemsTable.jsx
 * Diekstrak dari WorkOrderModal.jsx (baris 688-873).
 * Sumber: 4. Tabel item permintaan: tambah/hapus baris, nama, qty, satuan, keterangan
 */
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export const WorkOrderItemsTable = ({
  CATALOG_PRESETS,
  formData,
  handleAddManualItem,
  handleAddPresetItem,
  handleRemoveItem,
  items,
  manualItem,
  setManualItem,
}) => {
  return (
    <div style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          Daftar Kebutuhan Barang ke Gudang
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Pilih barang dari katalog cepat {formData.mainCategory} atau ketik manual di bawah.
                        </p>
                      </div>
                      <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                        {items.length} Barang Siap Diminta
                      </span>
                    </div>

                    {/* A. Katalog Cepat (Presets) */}
                    <div style={{ marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', display: 'block', marginBottom: '0.35rem' }}>
                        📦 PILIH CEPAT DARI KATALOG {formData.mainCategory.toUpperCase()}:
                      </span>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', maxHeight: '110px', overflowY: 'auto', padding: '0.2rem' }}>
                        {CATALOG_PRESETS[formData.mainCategory].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleAddPresetItem(preset)}
                            className="badge"
                            style={{
                              fontSize: '0.72rem',
                              padding: '0.35rem 0.65rem',
                              background: 'rgba(56, 189, 248, 0.08)',
                              color: 'var(--text-primary)',
                              border: '1px solid rgba(56, 189, 248, 0.25)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              transition: 'all 0.15s ease'
                            }}
                            title={`Klik untuk menambahkan: ${preset.name} (${preset.unit})`}
                          >
                            <Plus size={12} color="#38bdf8" />
                            <span>{preset.name}</span>
                            <span style={{ fontSize: '0.62rem', opacity: 0.7 }}>[{preset.unit}]</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* B. Form Input Manual Barang */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 80px 100px 2fr auto',
                      gap: '0.5rem',
                      alignItems: 'flex-end',
                      background: 'rgba(0, 0, 0, 0.2)',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-glass)'
                    }}>
                      <div>
                        <label className="field-label" style={{ fontSize: '0.72rem' }}>Nama Barang (Manual) *</label>
                        <input
                          type="text"
                          placeholder="Ketik nama barang yang diminta..."
                          value={manualItem.name}
                          onChange={(e) => setManualItem(prev => ({ ...prev, name: e.target.value }))}
                          className="input-control"
                          style={{ fontSize: '0.8rem', padding: '0.45rem 0.65rem' }}
                        />
                      </div>

                      <div>
                        <label className="field-label" style={{ fontSize: '0.72rem' }}>Jumlah *</label>
                        <input
                          type="number"
                          min="1"
                          value={manualItem.qty}
                          onChange={(e) => setManualItem(prev => ({ ...prev, qty: e.target.value }))}
                          className="input-control mono"
                          style={{ fontSize: '0.8rem', padding: '0.45rem 0.5rem' }}
                        />
                      </div>

                      <div>
                        <label className="field-label" style={{ fontSize: '0.72rem' }}>Satuan *</label>
                        <select
                          value={manualItem.unit}
                          onChange={(e) => setManualItem(prev => ({ ...prev, unit: e.target.value }))}
                          className="select-control"
                          style={{ fontSize: '0.8rem', padding: '0.45rem 0.4rem' }}
                        >
                          {['Pcs', 'Drum', 'Liter', 'Zak', 'Kg', 'Roll', 'Kaleng', 'Pail', 'Box', 'Dus', 'Set', 'Pasang', 'Lusin', 'Galon', 'Meter'].map(u => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="field-label" style={{ fontSize: '0.72rem' }}>Keterangan / Spesifikasi</label>
                        <input
                          type="text"
                          placeholder="Contoh: Untuk Main Engine / Ransum 14 hari"
                          value={manualItem.notes}
                          onChange={(e) => setManualItem(prev => ({ ...prev, notes: e.target.value }))}
                          className="input-control"
                          style={{ fontSize: '0.8rem', padding: '0.45rem 0.65rem' }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleAddManualItem}
                        className="btn btn-primary btn-sm"
                        style={{ height: '36px', display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}
                      >
                        <Plus size={14} />
                        <span>+ Tambah</span>
                      </button>
                    </div>

                    {/* C. Tabel Daftar Barang yang Akan Dikirim */}
                    <div style={{ marginTop: '0.85rem', overflowX: 'auto' }}>
                      <table className="pms-table" style={{ fontSize: '0.825rem' }}>
                        <thead>
                          <tr>
                            <th style={{ width: '40px' }}>No</th>
                            <th>Nama Barang / Material</th>
                            <th style={{ width: '120px' }}>Jumlah</th>
                            <th>Kategori</th>
                            <th>Keterangan / Spesifikasi</th>
                            <th style={{ width: '60px', textAlign: 'center' }}>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.length === 0 ? (
                            <tr>
                              <td colSpan={6} style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                                Belum ada barang yang ditambahkan. Silakan klik katalog di atas atau input manual.
                              </td>
                            </tr>
                          ) : (
                            items.map((item, index) => (
                              <tr key={item.id}>
                                <td className="mono" style={{ color: 'var(--text-muted)' }}>{index + 1}</td>
                                <td>
                                  <strong style={{ color: 'var(--text-primary)' }}>{item.name}</strong>
                                </td>
                                <td className="mono">
                                  <span style={{ fontWeight: 700, color: '#38bdf8' }}>{item.qty}</span> {item.unit}
                                </td>
                                <td>
                                  <span className="badge" style={{
                                    fontSize: '0.68rem',
                                    background: item.category === 'Kebutuhan Crew' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                                    color: item.category === 'Kebutuhan Crew' ? '#10b981' : '#38bdf8'
                                  }}>
                                    {item.category}
                                  </span>
                                </td>
                                <td style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                                  {item.notes || '-'}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="btn-icon"
                                    style={{ color: '#ef4444', padding: '4px' }}
                                    title="Hapus Barang"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
  );
};
