/**
 * MasterDataUserModal.jsx
 * Diekstrak dari MasterDataAdmin.jsx (baris 3486-3744).
 * Sumber: Modal tambah / edit pengguna
 */
import React from 'react';
import { Eye, EyeOff, Save, UserCheck, X } from 'lucide-react';

export const MasterDataUserModal = ({
  PRESET_AVATARS,
  ROLE_CONFIGS,
  editingUser,
  handleSaveUser,
  modalPasswordVisible,
  setEditingUser,
  setModalPasswordVisible,
  setShowUserModal,
  setUserFormData,
  userFormData,
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
              <div className="glass-card" style={{ width: '100%', maxWidth: '640px', padding: '1.75rem', borderRadius: '16px', maxHeight: '90vh', overflowY: 'auto' }}>
                {/* Modal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <UserCheck size={20} color="#a855f7" />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                      {editingUser ? `Edit Pengguna: ${editingUser.name}` : 'Tambah Pengguna Sistem Baru'}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserModal(false);
                      setEditingUser(null);
                    }}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Row 1: Nama & Jabatan */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="field-label">Nama Lengkap & Gelar *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Capt. Hendra Gunawan, M.Mar"
                        value={userFormData.name}
                        onChange={(e) => setUserFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="input-control"
                      />
                    </div>

                    <div>
                      <label className="field-label">Jabatan / Title Perusahaan *</label>
                      <input
                        type="text"
                        required
                        placeholder="Nakhoda / Chief Engineer / Staff"
                        value={userFormData.title}
                        onChange={(e) => setUserFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="input-control"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & Password */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="field-label">Email Login Baharimas *</label>
                      <input
                        type="email"
                        required
                        placeholder="nama@baharimas.co.id"
                        value={userFormData.email}
                        onChange={(e) => setUserFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="input-control"
                      />
                    </div>

                    <div>
                      <label className="field-label">Kata Sandi Login *</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={modalPasswordVisible ? 'text' : 'password'}
                          required
                          placeholder="Password (demo: 123)"
                          value={userFormData.password}
                          onChange={(e) => setUserFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="input-control"
                          style={{ paddingRight: '2.5rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => setModalPasswordVisible(!modalPasswordVisible)}
                          style={{
                            position: 'absolute',
                            right: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer'
                          }}
                        >
                          {modalPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Role / Hak Akses */}
                  <div>
                    <label className="field-label">Peran & Hak Akses (Role) *</label>
                    <select
                      value={userFormData.role}
                      onChange={(e) => setUserFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="select-control"
                    >
                      {Object.keys(ROLE_CONFIGS).map(roleName => (
                        <option key={roleName} value={roleName}>{roleName}</option>
                      ))}
                    </select>
                    {ROLE_CONFIGS[userFormData.role] && (
                      <div style={{
                        marginTop: '0.45rem',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        background: ROLE_CONFIGS[userFormData.role].bg,
                        border: `1px solid ${ROLE_CONFIGS[userFormData.role].border}`,
                        fontSize: '0.78rem',
                        color: ROLE_CONFIGS[userFormData.role].color
                      }}>
                        <strong>Hak Akses {userFormData.role}:</strong> {ROLE_CONFIGS[userFormData.role].desc}
                      </div>
                    )}
                  </div>

                  {/* Row 4: Akses Kapal & No HP */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="field-label">Hak Akses Armada Kapal *</label>
                      <select
                        value={userFormData.shipAccess}
                        onChange={(e) => setUserFormData(prev => ({ ...prev, shipAccess: e.target.value }))}
                        className="select-control"
                      >
                        <option value="All">🚢 Semua Kapal (Full Fleet Access - {vessels.length} Armada)</option>
                        <optgroup label="Pilih Kapal Spesifik:">
                          {vessels.map(v => (
                            <option key={v.id} value={v.id}>⚓ {v.name} ({v.ownershipStatus || 'Owner'})</option>
                          ))}
                        </optgroup>
                      </select>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>
                        {userFormData.shipAccess === 'All'
                          ? 'Pengguna dapat mengelola seluruh armada kapal Baharimas.'
                          : 'Pengguna hanya dibatasi pada data dan logbook kapal ini.'}
                      </span>
                    </div>

                    <div>
                      <label className="field-label">Nomor WhatsApp / HP</label>
                      <input
                        type="text"
                        placeholder="081288990011"
                        value={userFormData.phone}
                        onChange={(e) => setUserFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="input-control"
                      />
                    </div>
                  </div>

                  {/* Row 5: Status Akun */}
                  <div>
                    <label className="field-label">Status Akun</label>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                        <input
                          type="radio"
                          name="status"
                          value="Aktif"
                          checked={userFormData.status === 'Aktif'}
                          onChange={() => setUserFormData(prev => ({ ...prev, status: 'Aktif' }))}
                        />
                        <span style={{ color: '#10b981', fontWeight: 600 }}>● Aktif (Bisa Login)</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                        <input
                          type="radio"
                          name="status"
                          value="Nonaktif"
                          checked={userFormData.status === 'Nonaktif'}
                          onChange={() => setUserFormData(prev => ({ ...prev, status: 'Nonaktif' }))}
                        />
                        <span style={{ color: '#ef4444', fontWeight: 600 }}>● Nonaktif (Akses Ditutup)</span>
                      </label>
                    </div>
                  </div>

                  {/* Row 6: Avatar & Quick Presets */}
                  <div>
                    <label className="field-label">Foto Profil / Avatar</label>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <img
                        src={userFormData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                        alt="Preview"
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8' }}
                      />
                      <div style={{ flex: 1 }}>
                        <input
                          type="text"
                          placeholder="URL Foto Avatar (Unsplash / Hosted)"
                          value={userFormData.avatar}
                          onChange={(e) => setUserFormData(prev => ({ ...prev, avatar: e.target.value }))}
                          className="input-control"
                          style={{ fontSize: '0.8rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Pilih Cepat:</span>
                      {PRESET_AVATARS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setUserFormData(prev => ({ ...prev, avatar: p.url }))}
                          className="badge"
                          style={{
                            fontSize: '0.68rem',
                            cursor: 'pointer',
                            background: userFormData.avatar === p.url ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                            border: `1px solid ${userFormData.avatar === p.url ? '#38bdf8' : 'var(--border-subtle)'}`,
                            color: userFormData.avatar === p.url ? '#38bdf8' : 'var(--text-secondary)'
                          }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserModal(false);
                        setEditingUser(null);
                      }}
                      className="btn btn-secondary"
                    >
                      Batal
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Save size={14} />
                      <span>{editingUser ? 'Simpan Perubahan User' : 'Daftarkan Pengguna'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
  );
};
