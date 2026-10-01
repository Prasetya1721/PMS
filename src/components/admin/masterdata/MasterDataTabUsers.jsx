/**
 * MasterDataTabUsers.jsx
 * Diekstrak dari MasterDataAdmin.jsx (baris 2728-3144).
 * Sumber: Tab 6: manajemen user & role
 */
import React from 'react';
import { usePMS } from '../../../context/PMSContext';
import { Download, Edit2, Eye, EyeOff, Key, Mail, Phone, RefreshCw, Search, Trash2, UserPlus, Users } from 'lucide-react';

export const MasterDataTabUsers = ({
  ROLE_CONFIGS,
  allUserList,
  canAction,
  currentUser,
  deleteUser,
  filteredUsers,
  handleExportUsersCSV,
  handleQuickResetPassword,
  handleToggleUserStatus,
  resetUsers,
  setEditingUser,
  setModalPasswordVisible,
  setShowPasswordMap,
  setShowUserModal,
  setUserFormData,
  setUserRoleFilter,
  setUserSearch,
  setUserShipFilter,
  setUserStatusFilter,
  showPasswordMap,
  showToast,
  userRoleFilter,
  userSearch,
  userShipFilter,
  userStatusFilter,
  vessels,
}) => {
  // Dialog konfirmasi in-app (pengganti window.confirm) — infrastruktur aplikasi,
  // bukan data yang dioper induk, jadi diambil dari context dan tidak lewat props.
  const confirm = usePMS().confirm;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Header Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Direktori Manajemen Pengguna (Users)</h3>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{filteredUsers.length} dari {allUserList.length} Pengguna</span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Kelola akun pengguna, hak akses per-modul, peran nakhoda/teknisi/admin, dan pembatasan akses kapal armada.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {canAction && canAction('reset_users') && (
                    <button
                      onClick={resetUsers}
                      className="btn btn-secondary btn-sm"
                      title="Reset akun ke data default sistem"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <RefreshCw size={14} />
                      <span>Reset Akun Bawaan</span>
                    </button>
                  )}
                  <button
                    onClick={handleExportUsersCSV}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Download size={14} />
                    <span>Ekspor CSV</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingUser(null);
                      setUserFormData({
                        name: '',
                        email: '',
                        password: '123',
                        role: 'Admin Kapal / Nakhoda',
                        title: 'Nakhoda',
                        shipAccess: 'All',
                        phone: '081288990011',
                        status: 'Aktif',
                        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
                      });
                      setModalPasswordVisible(false);
                      setShowUserModal(true);
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <UserPlus size={14} />
                    <span>+ Tambah Pengguna Baru</span>
                  </button>
                </div>
              </div>

              {/* User Statistics Mini-Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.75rem'
              }}>
                <div className="glass-card" style={{ padding: '0.85rem 1rem', borderLeft: '4px solid #38bdf8' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Pengguna Terdaftar</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                    <strong style={{ fontSize: '1.25rem', fontWeight: 800 }}>{allUserList.length}</strong>
                    <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>100% Terdata</span>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '0.85rem 1rem', borderLeft: '4px solid #a855f7' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administrator & Manager</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                    <strong style={{ fontSize: '1.25rem', fontWeight: 800, color: '#a855f7' }}>
                      {allUserList.filter(u => u.role === 'Super Admin' || u.role === 'Fleet Manager').length}
                    </strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Kantor Pusat</span>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '0.85rem 1rem', borderLeft: '4px solid #10b981' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Nakhoda & Awak Kapal</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                    <strong style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
                      {allUserList.filter(u => u.role.includes('Nakhoda') || u.role.includes('Engineer') || u.role.includes('ABK')).length}
                    </strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Operasional Kapal</span>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '0.85rem 1rem', borderLeft: '4px solid #ec4899' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>HR & Finance Staff</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                    <strong style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ec4899' }}>
                      {allUserList.filter(u => u.role === 'HR / Personalia' || u.role === 'Finance').length}
                    </strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Dukungan Darat</span>
                  </div>
                </div>
              </div>

              {/* Filter Bar */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Cari nama pengguna, email, jabatan, nomor telepon..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="input-control"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="select-control"
                  style={{ width: '200px' }}
                >
                  <option value="ALL">Semua Hak Akses ({allUserList.length})</option>
                  {Object.keys(ROLE_CONFIGS).map(roleName => (
                    <option key={roleName} value={roleName}>{roleName}</option>
                  ))}
                </select>

                <select
                  value={userShipFilter}
                  onChange={(e) => setUserShipFilter(e.target.value)}
                  className="select-control"
                  style={{ width: '200px' }}
                >
                  <option value="ALL">Semua Hak Akses Kapal</option>
                  <option value="All">Semua Kapal (Full Fleet Access)</option>
                  {vessels.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>

                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="select-control"
                  style={{ width: '140px' }}
                >
                  <option value="ALL">Semua Status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              {/* User Table */}
              <div className="glass-card" style={{ overflow: 'hidden' }}>
                <div className="table-container">
                  <table className="pms-table">
                    <thead>
                      <tr>
                        <th>Pengguna & Profil</th>
                        <th>Email & Kontak</th>
                        <th>Peran / Hak Akses</th>
                        <th>Akses Armada</th>
                        <th>Password Demo</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Aksi Admin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                            <Users size={36} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                            <p style={{ fontWeight: 600 }}>Tidak ada data pengguna yang sesuai dengan filter.</p>
                            <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Coba ubah kata kunci pencarian atau reset filter.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map(u => {
                          const isMe = currentUser && (currentUser.id === u.id || currentUser.email?.toLowerCase() === u.email?.toLowerCase());
                          const roleConfig = ROLE_CONFIGS[u.role] || { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.35)', desc: 'Pengguna sistem' };
                          const ship = u.shipAccess === 'All' || !u.shipAccess
                            ? null
                            : vessels.find(v => v.id === u.shipAccess);
                          const isPasswordShown = !!showPasswordMap[u.id];

                          return (
                            <tr key={u.id}>
                              {/* 1. Profile */}
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <img
                                    src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                                    alt={u.name}
                                    style={{
                                      width: '38px',
                                      height: '38px',
                                      borderRadius: '50%',
                                      objectFit: 'cover',
                                      border: `2px solid ${roleConfig.color}40`,
                                      flexShrink: 0
                                    }}
                                  />
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{u.name}</strong>
                                      {isMe && (
                                        <span
                                          className="badge"
                                          style={{
                                            fontSize: '0.62rem',
                                            background: 'rgba(16, 185, 129, 0.2)',
                                            color: '#10b981',
                                            border: '1px solid rgba(16, 185, 129, 0.4)'
                                          }}
                                        >
                                          Sesi Anda
                                        </span>
                                      )}
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                                      {u.title || 'Staff Operasional'}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* 2. Email & Contact */}
                              <td>
                                <div style={{ fontSize: '0.825rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                                    <Mail size={12} color="var(--text-muted)" />
                                    <span>{u.email}</span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                                    <Phone size={12} />
                                    <span>{u.phone || '-'}</span>
                                  </div>
                                </div>
                              </td>

                              {/* 3. Role */}
                              <td>
                                <div>
                                  <span
                                    className="badge"
                                    style={{
                                      fontSize: '0.72rem',
                                      fontWeight: 700,
                                      background: roleConfig.bg,
                                      color: roleConfig.color,
                                      border: `1px solid ${roleConfig.border}`
                                    }}
                                  >
                                    {u.role}
                                  </span>
                                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0', maxWidth: '240px', lineHeight: 1.3 }}>
                                    {roleConfig.desc}
                                  </p>
                                </div>
                              </td>

                              {/* 4. Ship Access */}
                              <td>
                                {u.shipAccess === 'All' || !u.shipAccess ? (
                                  <span
                                    className="badge"
                                    style={{
                                      fontSize: '0.72rem',
                                      background: 'rgba(56, 189, 248, 0.15)',
                                      color: '#38bdf8',
                                      border: '1px solid rgba(56, 189, 248, 0.35)'
                                    }}
                                  >
                                    🚢 Semua Kapal ({vessels.length} Armada)
                                  </span>
                                ) : (
                                  <span
                                    className="badge"
                                    style={{
                                      fontSize: '0.72rem',
                                      background: 'rgba(16, 185, 129, 0.15)',
                                      color: '#10b981',
                                      border: '1px solid rgba(16, 185, 129, 0.35)'
                                    }}
                                  >
                                    ⚓ {ship?.name || u.shipAccess}
                                  </span>
                                )}
                              </td>

                              {/* 5. Password */}
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <span style={{
                                    fontFamily: 'monospace',
                                    fontSize: '0.85rem',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '4px',
                                    letterSpacing: isPasswordShown ? 'normal' : '2px',
                                    color: isPasswordShown ? '#f59e0b' : 'var(--text-muted)'
                                  }}>
                                    {isPasswordShown ? (u.password || '123') : '••••••'}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setShowPasswordMap(prev => ({ ...prev, [u.id]: !prev[u.id] }))}
                                    title={isPasswordShown ? 'Sembunyikan Password' : 'Lihat Password'}
                                    style={{
                                      background: 'transparent',
                                      border: 'none',
                                      color: 'var(--text-muted)',
                                      cursor: 'pointer',
                                      padding: '2px',
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}
                                  >
                                    {isPasswordShown ? <EyeOff size={14} /> : <Eye size={14} />}
                                  </button>
                                </div>
                              </td>

                              {/* 6. Status */}
                              <td>
                                <button
                                  type="button"
                                  onClick={() => handleToggleUserStatus(u)}
                                  title="Klik untuk mengubah status aktif/nonaktif"
                                  style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
                                >
                                  <span
                                    className="badge"
                                    style={{
                                      fontSize: '0.7rem',
                                      background: u.status === 'Nonaktif' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                      color: u.status === 'Nonaktif' ? '#ef4444' : '#10b981',
                                      border: `1px solid ${u.status === 'Nonaktif' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`
                                    }}
                                  >
                                    {u.status === 'Nonaktif' ? '● Nonaktif' : '● Aktif'}
                                  </span>
                                </button>
                              </td>

                              {/* 7. Actions */}
                              <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                                  <button
                                    onClick={() => {
                                      setEditingUser(u);
                                      setUserFormData({
                                        name: u.name || '',
                                        email: u.email || '',
                                        password: u.password || '123',
                                        role: u.role || 'Admin Kapal / Nakhoda',
                                        title: u.title || '',
                                        shipAccess: u.shipAccess || 'All',
                                        phone: u.phone || '081288990011',
                                        status: u.status || 'Aktif',
                                        avatar: u.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
                                      });
                                      setModalPasswordVisible(false);
                                      setShowUserModal(true);
                                    }}
                                    className="btn-icon"
                                    title="Edit Data Pengguna"
                                    style={{ padding: '0.35rem' }}
                                  >
                                    <Edit2 size={14} />
                                  </button>

                                  <button
                                    onClick={() => handleQuickResetPassword(u)}
                                    className="btn-icon"
                                    title="Reset Password ke: 123"
                                    style={{ padding: '0.35rem', color: '#f59e0b' }}
                                  >
                                    <Key size={14} />
                                  </button>

                                  {canAction && canAction('delete_user') && (
                                    <button
                                      onClick={async () => {
                                        if (isMe) {
                                          showToast('Gagal: Anda tidak dapat menghapus akun yang sedang aktif digunakan!', 'error');
                                          return;
                                        }
                                        const lanjut = await confirm({
                                          variant: 'danger',
                                          title: 'Hapus Akun Pengguna',
                                          subtitle: 'Akun yang dihapus tidak dapat dikembalikan',
                                          message: `Apakah Anda yakin ingin menghapus akun pengguna "${u.name}"?`
                                        });
                                        if (lanjut) deleteUser(u.id);
                                      }}
                                      disabled={isMe}
                                      className="btn-icon"
                                      title={isMe ? 'Akun Anda sedang aktif' : 'Hapus Pengguna'}
                                      style={{
                                        padding: '0.35rem',
                                        color: isMe ? 'var(--text-subtle)' : '#ef4444',
                                        cursor: isMe ? 'not-allowed' : 'pointer',
                                        opacity: isMe ? 0.3 : 1
                                      }}
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
  );
};
