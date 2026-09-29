/**
 * MasterDataCrewModal.jsx
 * Diekstrak dari MasterDataAdmin.jsx (baris 3343-3483).
 * Sumber: Modal tambah / edit crew
 */
import React from 'react';
import { Users, X } from 'lucide-react';

export const MasterDataCrewModal = ({
  crewFormData,
  editingCrew,
  handleSaveCrew,
  setCrewFormData,
  setShowCrewModal,
  vessels,
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
              <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '1.75rem', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Users size={20} color="#a855f7" />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                      {editingCrew ? `Edit Awak Kapal: ${editingCrew.name}` : 'Tambah Awak Kapal Baru'}
                    </h3>
                  </div>
                  <button onClick={() => setShowCrewModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveCrew} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="field-label">Nama Lengkap *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Hendra Gunawan"
                        value={crewFormData.name}
                        onChange={(e) => setCrewFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="input-control"
                      />
                    </div>

                    <div>
                      <label className="field-label">Kapal Penugasan *</label>
                      <select
                        value={crewFormData.vesselId}
                        onChange={(e) => setCrewFormData(prev => ({ ...prev, vesselId: e.target.value }))}
                        className="select-control"
                        required
                      >
                        {vessels.map(v => (
                          <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="field-label">Jabatan / Rank *</label>
                      <input
                        type="text"
                        required
                        placeholder="Nakhoda / Chief Engineer / ABK"
                        value={crewFormData.rank}
                        onChange={(e) => setCrewFormData(prev => ({ ...prev, rank: e.target.value }))}
                        className="input-control"
                      />
                    </div>

                    <div>
                      <label className="field-label">Departemen *</label>
                      <select
                        value={crewFormData.department}
                        onChange={(e) => setCrewFormData(prev => ({ ...prev, department: e.target.value }))}
                        className="select-control"
                      >
                        <option value="Deck">Deck</option>
                        <option value="Engine">Engine</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="field-label">No. Buku Pelaut</label>
                      <input
                        type="text"
                        placeholder="B-123456-ID"
                        value={crewFormData.seamanBookNo}
                        onChange={(e) => setCrewFormData(prev => ({ ...prev, seamanBookNo: e.target.value }))}
                        className="input-control"
                      />
                    </div>

                    <div>
                      <label className="field-label">Nomor WhatsApp / HP</label>
                      <input
                        type="text"
                        placeholder="081288990011"
                        value={crewFormData.whatsapp}
                        onChange={(e) => setCrewFormData(prev => ({ ...prev, whatsapp: e.target.value, phone: e.target.value }))}
                        className="input-control"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="field-label">Status Kehadiran</label>
                      <select
                        value={crewFormData.status}
                        onChange={(e) => setCrewFormData(prev => ({ ...prev, status: e.target.value }))}
                        className="select-control"
                      >
                        <option value="Onboard">Onboard (Di Kapal)</option>
                        <option value="On Leave">On Leave (Sedang Cuti)</option>
                        <option value="Standby">Standby (Darat)</option>
                      </select>
                    </div>

                    <div>
                      <label className="field-label">Durasi Kontrak (Bulan)</label>
                      <input
                        type="number"
                        value={crewFormData.contractDurationMonths}
                        onChange={(e) => setCrewFormData(prev => ({ ...prev, contractDurationMonths: e.target.value }))}
                        className="input-control"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <button type="button" onClick={() => setShowCrewModal(false)} className="btn btn-secondary">
                      Batal
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingCrew ? 'Simpan Perubahan' : 'Tambah Kru'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
  );
};
