/**
 * MasterDataTabDocuments.jsx
 * Diekstrak dari MasterDataAdmin.jsx (baris 1665-1951).
 * Sumber: Tab 4: master dokumen & sertifikat
 */
import React from 'react';
import { usePMS } from '../../../context/PMSContext';
import { Download, Edit2, FileText, Plus, Search, Trash2, UserCheck } from 'lucide-react';

export const MasterDataTabDocuments = ({
  allDocList,
  certificateCategories,
  deleteShipDocument,
  deletingDocId,
  docCategoryFilter,
  docSearch,
  docStatusFilter,
  docVesselFilter,
  exportToCSV,
  filteredDocs,
  setDeletingDocId,
  setDocCategoryFilter,
  setDocSearch,
  setDocStatusFilter,
  setDocVesselFilter,
  setEditingDoc,
  setPreviewDoc,
  setShowDocModal,
  vessels,
}) => {
  const { canAction } = usePMS();
  const canAddCert = canAction ? canAction('add_certificate') : false;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Master Seluruh Sertifikat Kapal ({allDocList.length} Dokumen)</h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Basis data terpusat mencakup seluruh sertifikat BKI, Statutory, Asuransi, KSOP, dan Kesehatan beserta tanggal penerbitan dan masa berlaku.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      exportToCSV('master_dokumen_sertifikat_baharimas', ['ID', 'Kapal', 'Kategori', 'Nama Dokumen', 'No Dokumen', 'Penerbit', 'Tgl Penerbitan', 'Tgl Expired', 'Status'],
                        filteredDocs.map(d => [d.id, vessels.find(v => v.id === d.vesselId)?.name || d.vesselId, d.category, d.name, d.documentNo, d.issuer, d.issueDate, d.expiryDate, d.status])
                      );
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    <Download size={14} />
                    <span>Ekspor CSV</span>
                  </button>
                  {canAddCert && (
                  <button
                    onClick={() => {
                      setEditingDoc(null);
                      setShowDocModal(true);
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus size={14} />
                    <span>Tambah Dokumen Baru</span>
                  </button>
                  )}
                </div>
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Cari nama sertifikat, no dokumen, instansi..."
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                    className="input-control"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>

                <select
                  value={docVesselFilter}
                  onChange={(e) => setDocVesselFilter(e.target.value)}
                  className="select-control"
                  style={{ width: '200px' }}
                >
                  <option value="ALL">Semua Kapal</option>
                  {vessels.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>

                <select
                  value={docCategoryFilter}
                  onChange={(e) => setDocCategoryFilter(e.target.value)}
                  className="select-control"
                  style={{ width: '180px' }}
                >
                  <option value="ALL">Semua Kategori</option>
                  {(certificateCategories || []).map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>

                <select
                  value={docStatusFilter}
                  onChange={(e) => setDocStatusFilter(e.target.value)}
                  className="select-control"
                  style={{ width: '150px' }}
                >
                  <option value="ALL">Semua Status</option>
                  <option value="Active">Active</option>
                  <option value="Due Soon">Due Soon</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

              {/* Documents Table */}
              <div className="glass-card" style={{ overflow: 'hidden' }}>
                <div className="table-container">
                  <table className="pms-table">
                    <thead>
                      <tr>
                        <th>Kapal Terkait</th>
                        <th>Kategori</th>
                        <th>Nama Sertifikat</th>
                        <th>Surveyor / Auditor</th>
                        <th>Nomor Dokumen</th>
                        <th>Instansi Penerbit</th>
                        <th>Tgl Penerbitan</th>
                        <th>Tgl Expired</th>
                        <th>Berkas</th>
                        <th>Status Kelaikan</th>
                        <th style={{ textAlign: 'right' }}>Aksi Admin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocs.map(d => {
                        const ship = vessels.find(v => v.id === d.vesselId);
                        const isExpired = d.status === 'Expired' || (d.daysUntilExpiry !== undefined && d.daysUntilExpiry <= 0);
                        const isH30 = d.daysUntilExpiry !== undefined && d.daysUntilExpiry > 0 && d.daysUntilExpiry <= 30;

                        return (
                          <tr key={d.id} style={{ background: isExpired ? 'rgba(239, 68, 68, 0.04)' : isH30 ? 'rgba(245, 158, 11, 0.03)' : undefined }}>
                            <td>
                              <strong>{ship?.name || d.vesselId}</strong>
                            </td>
                            <td>
                              <span
                                className="badge"
                                style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  background: d.category === 'KSOP' ? 'rgba(245, 158, 11, 0.15)' :
                                    d.category === 'BKI' ? 'rgba(56, 189, 248, 0.15)' :
                                    d.category === 'Statutory' ? 'rgba(16, 185, 129, 0.15)' :
                                    d.category === 'Asuransi' ? 'rgba(168, 85, 247, 0.15)' :
                                    'rgba(236, 72, 153, 0.15)',
                                  color: d.category === 'KSOP' ? '#f59e0b' :
                                    d.category === 'BKI' ? '#38bdf8' :
                                    d.category === 'Statutory' ? '#10b981' :
                                    d.category === 'Asuransi' ? '#c084fc' :
                                    '#f472b6',
                                  border: d.category === 'KSOP' ? '1px solid rgba(245, 158, 11, 0.35)' :
                                    d.category === 'BKI' ? '1px solid rgba(56, 189, 248, 0.35)' :
                                    d.category === 'Statutory' ? '1px solid rgba(16, 185, 129, 0.35)' :
                                    d.category === 'Asuransi' ? '1px solid rgba(168, 85, 247, 0.35)' :
                                    '1px solid rgba(236, 72, 153, 0.35)'
                                }}
                              >
                                {d.category || 'Dokumen'}
                              </span>
                            </td>
                            <td>
                              <strong style={{ fontSize: '0.92rem' }}>{d.name}</strong>
                              {d.rawNote && (
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                                  Catatan daftar: {d.rawNote}
                                </div>
                              )}
                            </td>
                            <td style={{ minWidth: '150px' }}>
                              {d.mandatoryAuditor ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <span style={{
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '6px',
                                    background: 'rgba(56, 189, 248, 0.15)',
                                    color: '#38bdf8',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                  }}>
                                    <UserCheck size={12} />
                                  </span>
                                  <div>
                                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                      {d.mandatoryAuditor}
                                    </div>
                                    <div style={{ fontSize: '0.68rem', color: 'var(--text-subtle)' }}>
                                      Pemeriksa Resmi
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>-</span>
                              )}
                            </td>
                            <td className="mono" style={{ fontSize: '0.8rem' }}>{d.documentNo || '-'}</td>
                            <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{d.issuer || '-'}</td>
                            <td className="mono" style={{ fontSize: '0.825rem', fontWeight: 600 }}>{d.issueDate || '-'}</td>
                            <td>
                              <div className="mono" style={{ fontWeight: 700, fontSize: '0.85rem', color: isExpired ? '#ef4444' : isH30 ? '#f59e0b' : '#10b981' }}>
                                {d.expiryDate}
                              </div>
                              <div style={{ fontSize: '0.7rem', color: isExpired ? '#ef4444' : isH30 ? '#f59e0b' : 'var(--text-subtle)' }}>
                                {d.daysUntilExpiry > 0 ? `${d.daysUntilExpiry} hari lagi` : `LEWAT ${Math.abs(d.daysUntilExpiry)} HARI!`}
                              </div>
                            </td>
                            <td>
                              {d.fileUrl ? (
                                <button
                                  type="button"
                                  onClick={() => setPreviewDoc(d)}
                                  className="badge badge-info"
                                  style={{
                                    fontSize: '0.7rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    cursor: 'pointer',
                                    padding: '0.2rem 0.45rem',
                                    border: 'none',
                                    background: 'rgba(56, 189, 248, 0.15)',
                                    color: '#38bdf8'
                                  }}
                                  title={d.fileName ? `Lihat berkas: ${d.fileName}` : 'Lihat Berkas'}
                                >
                                  <FileText size={11} />
                                  <span>{d.fileName ? (d.fileName.length > 10 ? d.fileName.substring(0, 8) + '...' : d.fileName) : 'Berkas'}</span>
                                </button>
                              ) : (
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>-</span>
                              )}
                            </td>
                            <td>
                              <span className={`badge ${isExpired ? 'badge-danger-pulse' : isH30 ? 'badge-warning' : 'badge-success'}`}>
                                {d.status}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {canAddCert ? (
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                                <button
                                  onClick={() => {
                                    setEditingDoc(d);
                                    setShowDocModal(true);
                                  }}
                                  className="btn btn-secondary btn-sm"
                                  title="Edit Sertifikat"
                                  style={{ padding: '0.35rem 0.55rem' }}
                                >
                                  <Edit2 size={13} />
                                </button>
                                {deletingDocId === d.id ? (
                                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteShipDocument(d.id);
                                        setDeletingDocId(null);
                                      }}
                                      className="btn btn-danger btn-sm"
                                      style={{ padding: '0.25rem 0.45rem', fontSize: '0.7rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}
                                      title="Konfirmasi Hapus"
                                    >
                                      Yakin?
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeletingDocId(null);
                                      }}
                                      className="btn btn-secondary btn-sm"
                                      style={{ padding: '0.25rem 0.4rem', fontSize: '0.7rem', borderRadius: '4px', cursor: 'pointer' }}
                                      title="Batal"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeletingDocId(d.id);
                                    }}
                                    className="btn btn-secondary btn-sm"
                                    title="Hapus Sertifikat"
                                    style={{ padding: '0.35rem 0.55rem', color: '#ef4444' }}
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                )}
                              </div>
                              ) : (
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
  );
};
