/**
 * InventoryTransferModal.jsx
 * Diekstrak dari InventoryList.jsx (baris 689-753).
 * Sumber: Modal pindah stok antar gudang kapal
 */
import React from 'react';
import { X } from 'lucide-react';

export const InventoryTransferModal = ({
  handleTransferSubmit,
  selectedItemForAction,
  setShowTransferModal,
  setTransferQty,
  transferQty,
}) => {
  return (
    <div className="modal-overlay" onClick={() => setShowTransferModal(false)}>
              <div className="modal-dialog" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Mutasi Stok Gudang Darat ke Kapal</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Transfer persediaan dari Shore Base Pontianak ke Onboard KM. RP 2020
                    </p>
                  </div>
                  <button onClick={() => setShowTransferModal(false)} className="btn-icon">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleTransferSubmit}>
                  <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{
                      padding: '0.85rem',
                      borderRadius: '8px',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div className="mono" style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
                        {selectedItemForAction.code}
                      </div>
                      <strong style={{ fontSize: '0.95rem' }}>{selectedItemForAction.name}</strong>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.825rem' }}>
                        <span>Stok Gudang Darat: <strong>{selectedItemForAction.stockWarehouse} {selectedItemForAction.unit}</strong></span>
                        <span>Stok Saat Ini di Kapal: <strong>{selectedItemForAction.stockQty} {selectedItemForAction.unit}</strong></span>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        Jumlah Unit yang Ditransfer ke Kapal ({selectedItemForAction.unit})
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={selectedItemForAction.stockWarehouse || 1}
                        value={transferQty}
                        onChange={e => setTransferQty(Math.max(1, Number(e.target.value) || 1))}
                        className="input-control mono"
                        style={{ fontSize: '1.1rem', fontWeight: 800 }}
                        required
                      />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.25rem', display: 'block' }}>
                        Maksimal dapat ditransfer: {selectedItemForAction.stockWarehouse} {selectedItemForAction.unit}
                      </span>
                    </div>
                  </div>

                  <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button type="button" onClick={() => setShowTransferModal(false)} className="btn btn-secondary">
                      Batal
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Proses Mutasi ke KM. RP 2020
                    </button>
                  </div>
                </form>
              </div>
            </div>
  );
};
