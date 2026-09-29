/**
 * VesselAddModal.jsx
 * Diekstrak dari VesselList.jsx (baris 458-718).
 * Sumber: Modal pendaftaran kapal baru lengkap dengan data utama, kepemilikan, dan foto
 */
import React from 'react';
import { Plus, Ship, X } from 'lucide-react';
import { MasterCombobox } from '../../common/MasterCombobox';

export const VesselAddModal = ({
  formData,
  handleFormSubmit,
  handleInputChange,
  portLocations,
  setShowAddModal,
  vesselTypes,
}) => {
  return (
    <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1.5rem'
            }}>
              <div className="glass-card" style={{
                width: '100%',
                maxWidth: '750px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2rem',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', pb: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Ship size={24} color="#38bdf8" />
                    <div>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Tambah Kapal Baru Manual</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Daftarkan kapal niaga baru ke dalam sistem PMS PT. Pelayaran Baharimas Kalimantan
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label className="field-label">Nama Kapal Armada *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Contoh: TB. BAHARIMAS 09"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-control"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="field-label">No. Registrasi Kapal</label>
                      <input
                        type="text"
                        name="regNo"
                        placeholder="Contoh: 31890 atau PK.882/KL"
                        value={formData.regNo}
                        onChange={handleInputChange}
                        className="input-control"
                      />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>No. Akta / Tanda Selar / Buku Pendaftaran (Opsional)</span>
                    </div>
                    <div>
                      <label className="field-label">Nomor IMO</label>
                      <input
                        type="text"
                        name="imo"
                        placeholder="Contoh: 9123456 (Kosongkan jika tongkang)"
                        value={formData.imo}
                        onChange={handleInputChange}
                        className="input-control"
                      />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>7 digit International Maritime Org (Opsional)</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div>
                      <label className="field-label">Call Sign</label>
                      <input
                        type="text"
                        name="callSign"
                        placeholder="Contoh: YDB3189"
                        value={formData.callSign}
                        onChange={handleInputChange}
                        className="input-control"
                      />
                    </div>
                    <div>
                      <label className="field-label">Tipe / Jenis Kapal *</label>
                      <MasterCombobox
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        options={vesselTypes}
                        placeholder="Ketik manual jenis kapal atau pilih..."
                        required
                      />
                    </div>
                    <div>
                      <label className="field-label">Status Kepemilikan</label>
                      <select
                        name="ownershipStatus"
                        value={formData.ownershipStatus}
                        onChange={handleInputChange}
                        className="select-control"
                      >
                        <option value="As Owner & Operator">As Owner & Operator</option>
                        <option value="As Owner">As Owner Only</option>
                        <option value="As Operator (Charter)">As Operator (Charter)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div>
                      <label className="field-label">Pelabuhan Pendaftaran</label>
                      <MasterCombobox
                        name="portOfRegistry"
                        value={formData.portOfRegistry}
                        onChange={handleInputChange}
                        options={portLocations}
                        placeholder="Ketik manual nama pelabuhan atau pilih..."
                      />
                    </div>
                    <div>
                      <label className="field-label">Gross Tonnage (GT)</label>
                      <input
                        type="number"
                        name="gt"
                        placeholder="310"
                        value={formData.gt}
                        onChange={handleInputChange}
                        className="input-control"
                      />
                    </div>
                    <div>
                      <label className="field-label">Deadweight Tonnage (DWT)</label>
                      <input
                        type="number"
                        name="dwt"
                        placeholder="450"
                        value={formData.dwt}
                        onChange={handleInputChange}
                        className="input-control"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div>
                      <label className="field-label">Tahun Pembuatan</label>
                      <input
                        type="number"
                        name="yearBuilt"
                        placeholder="2022"
                        value={formData.yearBuilt}
                        onChange={handleInputChange}
                        className="input-control"
                      />
                    </div>
                    <div>
                      <label className="field-label">Galangan Pembuat (Shipyard)</label>
                      <input
                        type="text"
                        name="builder"
                        placeholder="PT Dok Baharimas"
                        value={formData.builder}
                        onChange={handleInputChange}
                        className="input-control"
                      />
                    </div>
                    <div>
                      <label className="field-label">Status Operasional</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="select-control"
                      >
                        <option value="Operasional (Berlayar)">Operasional (Berlayar)</option>
                        <option value="Operasional (Pelabuhan)">Operasional (Pelabuhan)</option>
                        <option value="Docking / Perawatan Berkala">Docking / Perawatan Berkala</option>
                        <option value="Standby Docking">Standby Docking</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="field-label">Posisi / Lokasi Saat Ini</label>
                      <input
                        type="text"
                        name="currentLocation"
                        placeholder="Contoh: Muara Jungkat / Sungai Kapuas (Pontianak)"
                        value={formData.currentLocation}
                        onChange={handleInputChange}
                        className="input-control"
                      />
                    </div>
                    <div>
                      <label className="field-label">Kecepatan Rata-Rata (Knots)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="speedKnots"
                        placeholder="7.8"
                        value={formData.speedKnots}
                        onChange={handleInputChange}
                        className="input-control"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="field-label">Nakhoda / Barge Master (Captain)</label>
                      <input
                        type="text"
                        name="masterCaptain"
                        placeholder="Contoh: Capt. Agus Supriyadi, M.Mar"
                        value={formData.masterCaptain}
                        onChange={handleInputChange}
                        className="input-control"
                      />
                    </div>
                    <div>
                      <label className="field-label">Chief Engineer / KKM (Kepala Kamar Mesin)</label>
                      <input
                        type="text"
                        name="chiefEngineer"
                        placeholder="Contoh: Ir. Bambang Wijaya (KKM)"
                        value={formData.chiefEngineer}
                        onChange={handleInputChange}
                        className="input-control"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="btn btn-secondary"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                    >
                      <Plus size={16} />
                      <span>Simpan & Buka Dashboard Kapal</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
  );
};
