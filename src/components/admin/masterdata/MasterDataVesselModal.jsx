/**
 * MasterDataVesselModal.jsx
 * Diekstrak dari MasterDataAdmin.jsx (baris 3187-3340).
 * Sumber: Modal tambah / edit kapal
 */
import React from 'react';
import { Ship, X } from 'lucide-react';
import { MasterCombobox } from '../../common/MasterCombobox';

export const MasterDataVesselModal = ({
  editingVessel,
  handleSaveVessel,
  portLocations,
  setShowVesselModal,
  setVesselFormData,
  vesselFormData,
  vesselTypes,
}) => {
  return (
    <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(2, 6, 23, 0.85)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1100,
              padding: '1.25rem'
            }}>
              <div className="glass-card" style={{ width: '100%', maxWidth: '640px', padding: '1.75rem', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Ship size={20} color="#38bdf8" />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                      {editingVessel ? `Edit Kapal: ${editingVessel.name}` : 'Tambah Kapal Baru ke Armada'}
                    </h3>
                  </div>
                  <button onClick={() => setShowVesselModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveVessel} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="field-label">Nama Kapal *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: RP 2020 / BAHARIMAS 01"
                        value={vesselFormData.name}
                        onChange={(e) => setVesselFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="input-control"
                      />
                    </div>

                    <div>
                      <label className="field-label">Status Kepemilikan *</label>
                      <select
                        value={vesselFormData.ownershipStatus}
                        onChange={(e) => setVesselFormData(prev => ({ ...prev, ownershipStatus: e.target.value }))}
                        className="select-control"
                      >
                        <option value="As Owner">⚓ As Owner (Kapal Milik)</option>
                        <option value="As Operator">⚙️ As Operator (Kapal Operasional)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="field-label">Jenis / Tipe Kapal *</label>
                      <MasterCombobox
                        name="type"
                        value={vesselFormData.type}
                        onChange={(e) => setVesselFormData(prev => ({ ...prev, type: e.target.value }))}
                        options={vesselTypes}
                        placeholder="Ketik manual jenis kapal atau pilih..."
                        required
                      />
                    </div>
                    <div>
                      <label className="field-label">No. Registrasi Kapal</label>
                      <input
                        type="text"
                        placeholder="Contoh: 24587 atau PK.882"
                        value={vesselFormData.regNo}
                        onChange={(e) => setVesselFormData(prev => ({ ...prev, regNo: e.target.value }))}
                        className="input-control"
                      />
                    </div>
                    <div>
                      <label className="field-label">Nomor IMO (Jika Ada)</label>
                      <input
                        type="text"
                        placeholder="Contoh: 9123456"
                        value={vesselFormData.imo}
                        onChange={(e) => setVesselFormData(prev => ({ ...prev, imo: e.target.value }))}
                        className="input-control"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="field-label">Call Sign</label>
                      <input
                        type="text"
                        placeholder="YDB2458"
                        value={vesselFormData.callSign}
                        onChange={(e) => setVesselFormData(prev => ({ ...prev, callSign: e.target.value }))}
                        className="input-control"
                      />
                    </div>
                    <div>
                      <label className="field-label">Gross Tonnage (GT)</label>
                      <input
                        type="number"
                        value={vesselFormData.gt}
                        onChange={(e) => setVesselFormData(prev => ({ ...prev, gt: e.target.value }))}
                        className="input-control"
                      />
                    </div>
                    <div>
                      <label className="field-label">Deadweight (DWT)</label>
                      <input
                        type="number"
                        value={vesselFormData.dwt}
                        onChange={(e) => setVesselFormData(prev => ({ ...prev, dwt: e.target.value }))}
                        className="input-control"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="field-label">Pelabuhan Pendaftaran</label>
                      <MasterCombobox
                        name="portOfRegistry"
                        value={vesselFormData.portOfRegistry}
                        onChange={(e) => setVesselFormData(prev => ({ ...prev, portOfRegistry: e.target.value }))}
                        options={portLocations}
                        placeholder="Ketik manual nama pelabuhan atau pilih..."
                      />
                    </div>
                    <div>
                      <label className="field-label">Status Operasional</label>
                      <select
                        value={vesselFormData.status}
                        onChange={(e) => setVesselFormData(prev => ({ ...prev, status: e.target.value }))}
                        className="select-control"
                      >
                        <option value="Operasional (Berlayar)">Operasional (Berlayar)</option>
                        <option value="Standby (Labuh Jangkar)">Standby (Labuh Jangkar)</option>
                        <option value="Perbaikan (Docking BKI)">Perbaikan (Docking BKI)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <button type="button" onClick={() => setShowVesselModal(false)} className="btn btn-secondary">
                      Batal
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingVessel ? 'Simpan Perubahan' : 'Tambah Kapal'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
  );
};
