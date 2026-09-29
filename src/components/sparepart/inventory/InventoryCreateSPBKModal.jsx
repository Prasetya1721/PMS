/**
 * InventoryCreateSPBKModal.jsx
 * Diekstrak dari InventoryList.jsx (baris 1026-1245).
 * Sumber: Modal buat Surat Permintaan Barang ke Gudang (SPBK)
 */
import React from 'react';
import { X } from 'lucide-react';

export const InventoryCreateSPBKModal = ({
  formatIDR,
  handleCreateSPBK,
  setShowCreateSPBKModal,
  setSpbkForm,
  spareparts,
  spbkForm,
}) => {
  return (
    <div className="modal-overlay" onClick={() => setShowCreateSPBKModal(false)}>
              <div className="modal-dialog" style={{ maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Surat Permintaan Barang Kapal (SPBK) Baru</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Formulir pengajuan logistik provisi kru dapur, APD, maupun suku cadang mesin KM. RP 2020
                    </p>
                  </div>
                  <button onClick={() => setShowCreateSPBKModal(false)} className="btn-icon">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleCreateSPBK}>
                  <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '68vh', overflowY: 'auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Jenis Kebutuhan
                        </label>
                        <select
                          value={spbkForm.targetType}
                          onChange={e => setSpbkForm({ ...spbkForm, targetType: e.target.value })}
                          className="select-control"
                        >
                          <option value="Logistik Crew">Kebutuhan Crew (BAMA Dapur / APD Awak)</option>
                          <option value="Logistik Kapal">Kebutuhan Kapal (Sparepart Mesin / Pelumas / Deck)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Tingkat Urgensi
                        </label>
                        <select
                          value={spbkForm.urgency}
                          onChange={e => setSpbkForm({ ...spbkForm, urgency: e.target.value })}
                          className="select-control"
                        >
                          <option value="Normal">Normal (Jadwal Rutin)</option>
                          <option value="Urgent">Urgent (Sebelum Berlayar)</option>
                          <option value="Emergency">Emergency (Kritis)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        Judul Pengajuan Permintaan
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Permintaan Ransum Galley Pelayaran Towing September"
                        value={spbkForm.title}
                        onChange={e => setSpbkForm({ ...spbkForm, title: e.target.value })}
                        className="input-control"
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Nama Pemohon
                        </label>
                        <input
                          type="text"
                          value={spbkForm.requesterName}
                          onChange={e => setSpbkForm({ ...spbkForm, requesterName: e.target.value })}
                          className="input-control"
                          required
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Jabatan Pemohon
                        </label>
                        <input
                          type="text"
                          value={spbkForm.requesterRole}
                          onChange={e => setSpbkForm({ ...spbkForm, requesterRole: e.target.value })}
                          className="input-control"
                          required
                        />
                      </div>
                    </div>

                    {/* Items in SPBK */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label style={{ fontSize: '0.825rem', fontWeight: 700 }}>Daftar Barang yang Diajukan:</label>
                        <button
                          type="button"
                          onClick={() => {
                            const first = spareparts[0];
                            setSpbkForm({
                              ...spbkForm,
                              items: [
                                ...spbkForm.items,
                                {
                                  partId: first?.id || '',
                                  name: first?.name || '',
                                  qty: 1,
                                  unit: first?.unit || 'Pcs',
                                  estimatedUnitCost: first?.unitCost || 50000
                                }
                              ]
                            });
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.72rem' }}
                        >
                          + Tambah Item Barang
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {spbkForm.items.map((it, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '2fr 80px 100px 30px',
                              gap: '0.5rem',
                              alignItems: 'center',
                              padding: '0.5rem',
                              borderRadius: '6px',
                              background: 'var(--bg-surface-elevated)',
                              border: '1px solid var(--border-subtle)'
                            }}
                          >
                            <select
                              value={it.partId}
                              onChange={e => {
                                const matched = spareparts.find(s => s.id === e.target.value);
                                const nextItems = [...spbkForm.items];
                                nextItems[idx] = {
                                  ...nextItems[idx],
                                  partId: e.target.value,
                                  name: matched?.name || nextItems[idx].name,
                                  unit: matched?.unit || nextItems[idx].unit,
                                  estimatedUnitCost: matched?.unitCost || nextItems[idx].estimatedUnitCost
                                };
                                setSpbkForm({ ...spbkForm, items: nextItems });
                              }}
                              className="select-control"
                              style={{ fontSize: '0.8rem' }}
                            >
                              {spareparts.map(s => (
                                <option key={s.id} value={s.id}>
                                  [{s.target || 'Kapal'}] {s.name} ({s.stockQty} {s.unit})
                                </option>
                              ))}
                            </select>

                            <input
                              type="number"
                              min="1"
                              value={it.qty}
                              onChange={e => {
                                const nextItems = [...spbkForm.items];
                                nextItems[idx].qty = Math.max(1, Number(e.target.value) || 1);
                                setSpbkForm({ ...spbkForm, items: nextItems });
                              }}
                              className="input-control mono"
                              style={{ fontSize: '0.825rem', textAlign: 'center' }}
                              required
                            />

                            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {it.unit} • {formatIDR((it.qty || 1) * (it.estimatedUnitCost || 0))}
                            </span>

                            {spbkForm.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const nextItems = spbkForm.items.filter((_, i) => i !== idx);
                                  setSpbkForm({ ...spbkForm, items: nextItems });
                                }}
                                className="btn-icon"
                                style={{ color: '#f87171' }}
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        Keterangan & Alasan Pengajuan
                      </label>
                      <textarea
                        rows={2}
                        value={spbkForm.notes}
                        onChange={e => setSpbkForm({ ...spbkForm, notes: e.target.value })}
                        className="input-control"
                        placeholder="Contoh: Stok beras galley tinggal sedikit untuk rute towing Pontianak - Kendawangan..."
                      />
                    </div>
                  </div>

                  <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button type="button" onClick={() => setShowCreateSPBKModal(false)} className="btn btn-secondary">
                      Batal
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Kirim Pengajuan SPBK
                    </button>
                  </div>
                </form>
              </div>
            </div>
  );
};
