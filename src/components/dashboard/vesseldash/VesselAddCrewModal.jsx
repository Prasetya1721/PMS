/**
 * VesselAddCrewModal.jsx
 * Diekstrak dari VesselDashboard.jsx (baris 1967-2066).
 * Sumber: Modal tambah awak kapal
 */
import React from 'react';

export const VesselAddCrewModal = ({
  currentShip,
  handleCreateCrew,
  newCrewData,
  setNewCrewData,
  setShowAddCrewModal,
}) => {
  return (
    <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1.5rem'
            }}>
              <div className="glass-card" style={{ width: '100%', maxWidth: '580px', padding: '1.75rem', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                  Tambah Awak Baru: {currentShip.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Daftarkan perwira atau ABK yang mulai bertugas (Sign On) di kapal ini
                </p>

                <form onSubmit={handleCreateCrew} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label className="field-label">Nama Lengkap Awak *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Capt. Bambang Suherman"
                      value={newCrewData.name}
                      onChange={(e) => setNewCrewData(prev => ({ ...prev, name: e.target.value }))}
                      className="input-control"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="field-label">Jabatan (Rank)</label>
                      <select
                        value={newCrewData.rank}
                        onChange={(e) => setNewCrewData(prev => ({ ...prev, rank: e.target.value }))}
                        className="select-control"
                      >
                        <option value="Nakhoda (Master)">Nakhoda (Master)</option>
                        <option value="Chief Engineer (KKM)">Chief Engineer (KKM)</option>
                        <option value="Chief Officer (Mualim 1)">Chief Officer (Mualim 1)</option>
                        <option value="Second Engineer (Masinis 2)">Second Engineer (Masinis 2)</option>
                        <option value="Bosun (Kepala Kelasi)">Bosun (Kepala Kelasi)</option>
                        <option value="Juru Mudi / ABK">Juru Mudi / ABK</option>
                        <option value="Oiler (Juru Minyak)">Oiler (Juru Minyak)</option>
                        <option value="Barge Master">Barge Master</option>
                        <option value="Teknisi Tongkang / Juru Mesin">Teknisi Tongkang / Juru Mesin</option>
                      </select>
                    </div>
                    <div>
                      <label className="field-label">Departemen</label>
                      <select
                        value={newCrewData.department}
                        onChange={(e) => setNewCrewData(prev => ({ ...prev, department: e.target.value }))}
                        className="select-control"
                      >
                        <option value="Deck">Deck</option>
                        <option value="Engine">Engine</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="field-label">Nomor Buku Pelaut (Seaman Book)</label>
                      <input
                        type="text"
                        placeholder="Contoh: B-449120-ID"
                        value={newCrewData.seamanBookNo}
                        onChange={(e) => setNewCrewData(prev => ({ ...prev, seamanBookNo: e.target.value }))}
                        className="input-control"
                      />
                    </div>
                    <div>
                      <label className="field-label">Nomor WhatsApp</label>
                      <input
                        type="text"
                        placeholder="Contoh: 081288991122"
                        value={newCrewData.phone}
                        onChange={(e) => setNewCrewData(prev => ({ ...prev, phone: e.target.value, whatsapp: `+62${e.target.value.replace(/^0/, '')}` }))}
                        className="input-control"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                    <button type="button" onClick={() => setShowAddCrewModal(false)} className="btn btn-secondary">
                      Batal
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Simpan Kru
                    </button>
                  </div>
                </form>
              </div>
            </div>
  );
};
