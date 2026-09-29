/**
 * MasterDataTabCertNames.jsx
 * Diekstrak dari MasterDataAdmin.jsx (baris 2436-2723).
 * Sumber: Tab 5C: master nama sertifikat / dokumen resmi
 */
import React from 'react';
import { FileText, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';

export const MasterDataTabCertNames = ({
  allCertNamesList,
  allDocList,
  certNameCatFilter,
  certNameSearch,
  certificateCategories,
  deleteDocumentTemplate,
  deletingCertNameId,
  filteredCertNames,
  handleClearCertNames,
  handleCreateCertName,
  handleResetCertNames,
  newCertNameData,
  setCertNameCatFilter,
  setCertNameSearch,
  setDeletingCertNameId,
  setNewCertNameData,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Master Nama Sertifikat & Dokumen Resmi Kapal</h3>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                      {filteredCertNames.length} dari {allCertNamesList.length} Nama Sertifikat
                    </span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Kelola daftar nama baku sertifikat kapal armada (BKI, KSOP, Statutory, Kesehatan, Asuransi). Setiap nama baru yang diketik di form juga otomatis tersimpan ke master data ini.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleResetCertNames}
                    className="btn btn-secondary btn-sm"
                    title="Kembalikan master nama sertifikat ke data standar maritim"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <RefreshCw size={14} />
                    <span>Reset Standar Maritim</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearCertNames}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                    title="Kosongkan master sertifikat"
                  >
                    <Trash2 size={14} />
                    <span>Kosongkan Master Sertifikat</span>
                  </button>
                </div>
              </div>

              {/* Form Tambah Nama Sertifikat Baru */}
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Plus size={16} color="#38bdf8" />
                  <span>Tambah Nama Sertifikat Baru ke Data Master</span>
                </h4>
                <form onSubmit={handleCreateCertName} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr 1.2fr auto', gap: '0.75rem', alignItems: 'end' }}>
                  <div>
                    <label className="field-label">Nama Sertifikat / Dokumen *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Sertifikat Garis Muat Lambung Timbul"
                      value={newCertNameData.name}
                      onChange={(e) => setNewCertNameData(prev => ({ ...prev, name: e.target.value }))}
                      className="input-control"
                    />
                  </div>

                  <div>
                    <label className="field-label">Kategori Sertifikat *</label>
                    <select
                      value={newCertNameData.category}
                      onChange={(e) => setNewCertNameData(prev => ({ ...prev, category: e.target.value }))}
                      className="select-control"
                    >
                      {(certificateCategories || []).map(c => (
                        <option key={c.id || c.code} value={c.id || c.code}>{c.label || c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="field-label">Masa Berlaku Standar *</label>
                    <select
                      value={newCertNameData.defaultValidityYears}
                      onChange={(e) => setNewCertNameData(prev => ({ ...prev, defaultValidityYears: Number(e.target.value) }))}
                      className="select-control"
                    >
                      <option value={1}>1 Tahun (Tahunan)</option>
                      <option value={2.5}>2.5 Tahun (Intermediate)</option>
                      <option value={5}>5 Tahun (Standar Solas / BKI)</option>
                      <option value={10}>10 Tahun (Surat Ukur)</option>
                      <option value={0.5}>6 Bulan (SSCEC Port Health)</option>
                      <option value={0}>Permanen / Tetap</option>
                    </select>
                  </div>

                  <div>
                    <label className="field-label">Instansi Penerbit Bawaan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Biro Klasifikasi Indonesia"
                      value={newCertNameData.issuer}
                      onChange={(e) => setNewCertNameData(prev => ({ ...prev, issuer: e.target.value }))}
                      className="input-control"
                    />
                  </div>

                  <div>
                    <label className="field-label">Keterangan / Fungsi</label>
                    <input
                      type="text"
                      placeholder="Keterangan singkat fungsi sertifikat..."
                      value={newCertNameData.description}
                      onChange={(e) => setNewCertNameData(prev => ({ ...prev, description: e.target.value }))}
                      className="input-control"
                    />
                  </div>

                  <div>
                    <button type="submit" className="btn btn-primary" style={{ height: '38px', whiteSpace: 'nowrap' }}>
                      Simpan Sertifikat
                    </button>
                  </div>
                </form>
              </div>

              {/* Filters & Search */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Cari nama sertifikat, penerbit, keterangan..."
                    value={certNameSearch}
                    onChange={(e) => setCertNameSearch(e.target.value)}
                    className="input-control"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>

                <select
                  value={certNameCatFilter}
                  onChange={(e) => setCertNameCatFilter(e.target.value)}
                  className="select-control"
                  style={{ width: '220px' }}
                >
                  <option value="ALL">Semua Kategori ({allCertNamesList.length})</option>
                  {(certificateCategories || []).map(c => {
                    const cnt = allCertNamesList.filter(t => (t.category || '').toLowerCase() === (c.id || c.code || '').toLowerCase()).length;
                    return (
                      <option key={c.id || c.code} value={c.id || c.code}>
                        {c.label || c.name} ({cnt})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Certificate Names Table */}
              <div className="glass-card" style={{ overflow: 'hidden' }}>
                <div className="table-container">
                  <table className="pms-table">
                    <thead>
                      <tr>
                        <th>Nama Sertifikat / Dokumen Resmi</th>
                        <th>Kategori</th>
                        <th>Masa Berlaku Standar</th>
                        <th>Instansi Penerbit Bawaan</th>
                        <th>Keterangan</th>
                        <th>Terpakai di Dokumen</th>
                        <th style={{ textAlign: 'right' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCertNames.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-subtle)' }}>
                            <FileText size={36} style={{ opacity: 0.35, margin: '0 auto 0.5rem auto', display: 'block', color: '#38bdf8' }} />
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                              Tidak Ada Data Nama Sertifikat
                            </div>
                            <p style={{ fontSize: '0.8rem', maxWidth: '420px', margin: '0 auto' }}>
                              {certNameSearch || certNameCatFilter !== 'ALL'
                                ? 'Tidak ada nama sertifikat yang cocok dengan kriteria pencarian/filter.'
                                : 'Master data nama sertifikat saat ini kosong. Gunakan form di atas untuk menambah atau klik "Reset Standar Maritim" untuk memuat daftar baku.'}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredCertNames.map(t => {
                          const matchedCat = (certificateCategories || []).find(
                            c => (c.id || c.code || '').toLowerCase() === (t.category || '').toLowerCase()
                          );
                          const usedCount = allDocList.filter(
                            d => (d.name || '').trim().toLowerCase() === (t.name || '').trim().toLowerCase()
                          ).length;

                          const validityText = t.defaultValidityYears === 0
                            ? 'Permanen'
                            : t.defaultValidityYears === 0.5
                            ? '6 Bulan'
                            : t.defaultValidityYears === 2.5
                            ? '2.5 Tahun'
                            : `${t.defaultValidityYears || 1} Tahun`;

                          return (
                            <tr key={t.id || t.name}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <FileText size={16} color={matchedCat?.color || '#38bdf8'} />
                                  <strong style={{ fontSize: '0.88rem' }}>{t.name}</strong>
                                </div>
                              </td>
                              <td>
                                <span
                                  className="badge"
                                  style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    background: matchedCat?.bgColor || 'rgba(56, 189, 248, 0.15)',
                                    color: matchedCat?.color || '#38bdf8',
                                    border: `1px solid ${matchedCat?.borderColor || 'rgba(56, 189, 248, 0.35)'}`
                                  }}
                                >
                                  {matchedCat?.label || t.category}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${t.defaultValidityYears === 0 ? 'badge-neutral' : t.defaultValidityYears <= 1 ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: '0.75rem' }}>
                                  {validityText}
                                </span>
                              </td>
                              <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                                {t.issuer || '-'}
                              </td>
                              <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                                {t.description || '-'}
                              </td>
                              <td>
                                <span className="badge badge-neutral" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                                  {usedCount} Dokumen
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                {deletingCertNameId === (t.id || t.name) ? (
                                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>Yakin?</span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteDocumentTemplate(t.id || t.name, t.category);
                                        setDeletingCertNameId(null);
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
                                        setDeletingCertNameId(null);
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
                                      setDeletingCertNameId(t.id || t.name);
                                    }}
                                    className="btn btn-secondary btn-sm"
                                    style={{ color: '#ef4444', padding: '0.35rem 0.55rem' }}
                                    title={`Hapus sertifikat ${t.name}`}
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
