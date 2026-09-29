/**
 * InventoryAddItemModal.jsx
 * Diekstrak dari InventoryList.jsx (baris 830-1023).
 * Sumber: Modal tambah item suku cadang baru ke stok
 */
import React from 'react';
import { X } from 'lucide-react';

export const InventoryAddItemModal = ({
  handleAddNewItem,
  newItemForm,
  setNewItemForm,
  setShowAddItemModal,
}) => {
  return (
    <div className="modal-overlay" onClick={() => setShowAddItemModal(false)}>
              <div className="modal-dialog" style={{ maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Daftarkan Barang Logistik / Suku Cadang Baru</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Pendaftaran item logistik kebutuhan kapal maupun kebutuhan kru
                    </p>
                  </div>
                  <button onClick={() => setShowAddItemModal(false)} className="btn-icon">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleAddNewItem}>
                  <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '68vh', overflowY: 'auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Sasaran Penggunaan
                        </label>
                        <select
                          value={newItemForm.target}
                          onChange={e => setNewItemForm({ ...newItemForm, target: e.target.value })}
                          className="select-control"
                        >
                          <option value="Crew">Logistik Crew (BAMA & APD Awak)</option>
                          <option value="Kapal">Logistik Kapal (Deck Stores & Mesin)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Kategori Barang
                        </label>
                        <select
                          value={newItemForm.category}
                          onChange={e => setNewItemForm({ ...newItemForm, category: e.target.value })}
                          className="select-control"
                        >
                          <option value="Logistik Crew (BAMA)">Logistik Crew (BAMA / Sembako)</option>
                          <option value="Perlengkapan APD Kru">Perlengkapan APD & Seragam Kru</option>
                          <option value="Kesehatan & P3K Kru">Kesehatan & P3K Kru</option>
                          <option value="Suku Cadang Mesin">Suku Cadang Mesin</option>
                          <option value="Pelumas / Oil">Minyak Pelumas / Oli Drum</option>
                          <option value="Deck & Tali Tross">Deck Stores & Tali Tross</option>
                          <option value="Deck Stores & Cat">Cat Lambung & Epoksi</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Kode SKU/Part
                        </label>
                        <input
                          type="text"
                          placeholder="LOG-XXX"
                          value={newItemForm.code}
                          onChange={e => setNewItemForm({ ...newItemForm, code: e.target.value })}
                          className="input-control mono"
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Nama Barang
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Telur Ayam Segar 30 Butir / Cat Primer Epoxy"
                          value={newItemForm.name}
                          onChange={e => setNewItemForm({ ...newItemForm, name: e.target.value })}
                          className="input-control"
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Satuan
                        </label>
                        <input
                          type="text"
                          placeholder="Pcs/Zak/Liter"
                          value={newItemForm.unit}
                          onChange={e => setNewItemForm({ ...newItemForm, unit: e.target.value })}
                          className="input-control"
                          required
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Stok Darat
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={newItemForm.stockWarehouse}
                          onChange={e => setNewItemForm({ ...newItemForm, stockWarehouse: e.target.value })}
                          className="input-control mono"
                          required
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Stok Kapal
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={newItemForm.stockQty}
                          onChange={e => setNewItemForm({ ...newItemForm, stockQty: e.target.value })}
                          className="input-control mono"
                          required
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Batas Min
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={newItemForm.minStockQty}
                          onChange={e => setNewItemForm({ ...newItemForm, minStockQty: e.target.value })}
                          className="input-control mono"
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Estimasi Harga Satuan (IDR)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="500"
                          value={newItemForm.unitCost}
                          onChange={e => setNewItemForm({ ...newItemForm, unitCost: e.target.value })}
                          className="input-control mono"
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Lokasi Penyimpanan di Kapal
                        </label>
                        <input
                          type="text"
                          placeholder="Galley Store / Safety Locker / Deck"
                          value={newItemForm.location}
                          onChange={e => setNewItemForm({ ...newItemForm, location: e.target.value })}
                          className="input-control"
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        Supplier Rekanan / Toko Penyedia
                      </label>
                      <input
                        type="text"
                        placeholder="Nama distributor / rekanan lokal Pontianak"
                        value={newItemForm.supplier}
                        onChange={e => setNewItemForm({ ...newItemForm, supplier: e.target.value })}
                        className="input-control"
                      />
                    </div>
                  </div>

                  <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button type="button" onClick={() => setShowAddItemModal(false)} className="btn btn-secondary">
                      Batal
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Daftarkan Item ke Inventaris
                    </button>
                  </div>
                </form>
              </div>
            </div>
  );
};
