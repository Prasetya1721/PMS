/**
 * TechnicalWOSparepartsUsed.jsx
 * Diekstrak dari TechnicalWorkOrderModal.jsx (baris 600-715).
 * Sumber: Bagian 3: suku cadang yang dipakai (closed-loop inventory)
 */
import React from 'react';
import { Package, Plus, Trash2 } from 'lucide-react';

export const TechnicalWOSparepartsUsed = ({
  handleAddPart,
  handleRemovePart,
  isCompleted,
  partQty,
  partsUsed,
  selectedPartId,
  setPartQty,
  setSelectedPartId,
  vesselSpareparts,
}) => {
  return (
    <div style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Package size={18} color="#f59e0b" />
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                        3. Konsumsi Suku Cadang & Logistik Onboard (Otomatis Potong Stok)
                      </h4>
                    </div>
                    <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                      Siklus Tertutup Inventaris
                    </span>
                  </div>

                  {partsUsed.length === 0 ? (
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                      Belum ada suku cadang yang ditambahkan ke pengerjaan ini. Suku cadang yang dipilih akan langsung dipotong dari stok kapal saat WO diselesaikan.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {partsUsed.map((p, idx) => (
                        <div
                          key={p.sparepartId || idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.65rem 0.85rem',
                            borderRadius: '8px',
                            background: 'rgba(245, 158, 11, 0.06)',
                            border: '1px solid rgba(245, 158, 11, 0.25)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>{idx + 1}</span>
                            <div>
                              <strong style={{ fontSize: '0.875rem', display: 'block' }}>{p.name}</strong>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Stok Onboard Tersedia: {p.stockAvailable || 0} {p.unit}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.9rem' }}>
                              Dipakai: {p.qty} {p.unit}
                            </span>
                            {!isCompleted && (
                              <button
                                type="button"
                                onClick={() => handleRemovePart(p.sparepartId)}
                                style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!isCompleted && (
                    <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'flex-end', marginTop: '0.5rem' }}>
                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                          Pilih Suku Cadang Onboard
                        </label>
                        <select
                          value={selectedPartId}
                          onChange={(e) => setSelectedPartId(e.target.value)}
                          className="input-base"
                          style={{ width: '100%' }}
                        >
                          <option value="">-- Pilih Suku Cadang Kapal --</option>
                          {vesselSpareparts.map(sp => (
                            <option key={sp.id} value={sp.id}>
                              {sp.name} (Stok Onboard: {sp.stockQty} {sp.unit})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div style={{ width: '100px' }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                          Jumlah Pakai
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={partQty}
                          onChange={(e) => setPartQty(Math.max(1, Number(e.target.value) || 1))}
                          className="input-base"
                          style={{ width: '100%' }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleAddPart}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '0.55rem 1rem' }}
                      >
                        <Plus size={15} />
                        <span>Tambahkan Suku Cadang</span>
                      </button>
                    </div>
                  )}
                </div>
  );
};
