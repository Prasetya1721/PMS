/**
 * InventoryConsumeModal.jsx
 * Diekstrak dari InventoryList.jsx (baris 756-827).
 * Sumber: Modal catat pemakaian suku cadang dari stok kapal
 */
import React from 'react';
import { X } from 'lucide-react';

export const InventoryConsumeModal = ({
  consumeQty,
  consumeReason,
  handleConsumeSubmit,
  selectedItemForAction,
  setConsumeQty,
  setConsumeReason,
  setShowConsumeModal,
}) => {
  return (
    <div className="modal-overlay" onClick={() => setShowConsumeModal(false)}>
              <div className="modal-dialog" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Catat Pemakaian Onboard Kapal</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Pengurangan stok fisik yang digunakan di KM. RP 2020
                    </p>
                  </div>
                  <button onClick={() => setShowConsumeModal(false)} className="btn-icon">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleConsumeSubmit}>
                  <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{
                      padding: '0.85rem',
                      borderRadius: '8px',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <strong style={{ fontSize: '0.95rem' }}>{selectedItemForAction.name}</strong>
                      <div style={{ marginTop: '0.25rem', fontSize: '0.825rem' }}>
                        Sisa Stok di Kapal: <strong className="mono">{selectedItemForAction.stockQty} {selectedItemForAction.unit}</strong>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        Jumlah Pemakaian ({selectedItemForAction.unit})
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={selectedItemForAction.stockQty || 1}
                        value={consumeQty}
                        onChange={e => setConsumeQty(Math.max(1, Number(e.target.value) || 1))}
                        className="input-control mono"
                        style={{ fontSize: '1.1rem', fontWeight: 800 }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        Keperluan / Alasan Pemakaian
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Ransum masak dapur trip pelayaran / Servis berkala genset"
                        value={consumeReason}
                        onChange={e => setConsumeReason(e.target.value)}
                        className="input-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button type="button" onClick={() => setShowConsumeModal(false)} className="btn btn-secondary">
                      Batal
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Simpan Pemakaian
                    </button>
                  </div>
                </form>
              </div>
            </div>
  );
};
