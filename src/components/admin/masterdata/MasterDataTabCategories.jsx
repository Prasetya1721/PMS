/**
 * MasterDataTabCategories.jsx
 * Diekstrak dari MasterDataAdmin.jsx (baris 1956-2138).
 * Sumber: Tab 5: master kategori sertifikat
 */
import React from 'react';
import { Plus, Tag, Trash2 } from 'lucide-react';

export const MasterDataTabCategories = ({
  allDocList,
  certificateCategories,
  deleteCertificateCategory,
  deletingCatId,
  handleCreateCategory,
  newCatData,
  setDeletingCatId,
  setNewCatData,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Master Kategori Sertifikat & Dokumen</h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Kelola kategori sertifikat maritim dan tambahkan kategori khusus secara dinamis untuk seluruh armada.
                  </p>
                </div>
              </div>

              {/* Form Tambah Kategori Baru */}
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Plus size={16} color="#38bdf8" />
                  <span>Tambah Kategori Sertifikat Baru (Manual)</span>
                </h4>
                <form onSubmit={handleCreateCategory} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.5fr 120px auto', gap: '0.75rem', alignItems: 'end' }}>
                  <div>
                    <label className="field-label">Nama Kategori *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Bea Cukai / Navigasi / Komersial"
                      value={newCatData.label}
                      onChange={(e) => setNewCatData(prev => ({ ...prev, label: e.target.value }))}
                      className="input-control"
                    />
                  </div>

                  <div>
                    <label className="field-label">Kode Kategori</label>
                    <input
                      type="text"
                      placeholder="BEA_CUKAI / NAV"
                      value={newCatData.code}
                      onChange={(e) => setNewCatData(prev => ({ ...prev, code: e.target.value }))}
                      className="input-control"
                    />
                  </div>

                  <div>
                    <label className="field-label">Deskripsi Kategori</label>
                    <input
                      type="text"
                      placeholder="Keterangan singkat fungsi kategori ini..."
                      value={newCatData.description}
                      onChange={(e) => setNewCatData(prev => ({ ...prev, description: e.target.value }))}
                      className="input-control"
                    />
                  </div>

                  <div>
                    <label className="field-label">Warna Lencana</label>
                    <input
                      type="color"
                      value={newCatData.color}
                      onChange={(e) => setNewCatData(prev => ({ ...prev, color: e.target.value }))}
                      style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}
                    />
                  </div>

                  <div>
                    <button type="submit" className="btn btn-primary" style={{ height: '38px', whiteSpace: 'nowrap' }}>
                      Simpan Kategori
                    </button>
                  </div>
                </form>
              </div>

              {/* Categories Table */}
              <div className="glass-card" style={{ overflow: 'hidden' }}>
                <div className="table-container">
                  <table className="pms-table">
                    <thead>
                      <tr>
                        <th>Lencana Kategori</th>
                        <th>Kode / ID</th>
                        <th>Deskripsi Fungsi</th>
                        <th>Jumlah Dokumen</th>
                        <th>Tipe Kategori</th>
                        <th style={{ textAlign: 'right' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(!certificateCategories || certificateCategories.length === 0) ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-subtle)' }}>
                            <Tag size={36} style={{ opacity: 0.35, margin: '0 auto 0.5rem auto', display: 'block', color: '#38bdf8' }} />
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                              Belum Ada Kategori Sertifikat
                            </div>
                            <p style={{ fontSize: '0.8rem', maxWidth: '400px', margin: '0 auto' }}>
                              Kategori sertifikat saat ini kosong. Silakan gunakan form "Tambah Kategori Baru" di atas untuk menambahkan kategori manual.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        certificateCategories.map(c => {
                          const count = allDocList.filter(d => d.category === c.id).length;

                          return (
                            <tr key={c.id}>
                              <td>
                                <span
                                  className="badge"
                                  style={{
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    background: c.bgColor || 'rgba(56, 189, 248, 0.15)',
                                    color: c.color || '#38bdf8',
                                    border: `1px solid ${c.borderColor || 'rgba(56, 189, 248, 0.35)'}`
                                  }}
                                >
                                  {c.label}
                                </span>
                              </td>
                              <td className="mono" style={{ fontSize: '0.825rem' }}>{c.code || c.id}</td>
                              <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{c.description || '-'}</td>
                              <td>
                                <span className="badge badge-neutral" style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                                  {count} Dokumen
                                </span>
                              </td>
                              <td>
                                <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                                  {c.isCustom ? 'Kustom Tambahan' : 'Kategori Maritim'}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                {deletingCatId === (c.id || c.code || c.label) ? (
                                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>Yakin?</span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteCertificateCategory(c.id || c.code || c.label);
                                        setDeletingCatId(null);
                                      }}
                                      className="btn btn-danger btn-sm"
                                      style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}
                                    >
                                      Ya, Hapus
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeletingCatId(null);
                                      }}
                                      className="btn btn-secondary btn-sm"
                                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                      Batal
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeletingCatId(c.id || c.code || c.label);
                                    }}
                                    className="btn btn-secondary btn-sm"
                                    style={{ color: '#ef4444', padding: '0.35rem 0.55rem' }}
                                    title={`Hapus kategori ${c.label}`}
                                  >
                                    <Trash2 size={13} />
                                    <span>Hapus</span>
                                  </button>
                                )}
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
