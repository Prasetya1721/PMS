/**
 * TabDocuments.jsx
 * Diekstrak dari VesselDashboard.jsx (baris 922-1201).
 * Sumber: SUB-TAB 3: sertifikat & dokumen kapal (BKI, statutory, asuransi, KSOP)
 */
import React from 'react';
import { CalendarPlus, Edit2, FileCheck, FileText, Plus, Send, Trash2, UserCheck } from 'lucide-react';
import { usePMS } from '../../../context/PMSContext';

export const TabDocuments = ({
  certificateCategories,
  currentShip,
  deleteShipDocument,
  openGoogleCalendar,
  sendWhatsAppReminder,
  setEditingShipDoc,
  setPreviewDoc,
  setShipDocCatFilter,
  setShowAddDocModal,
  shipDocCatFilter,
  shipDocs,
}) => {
  // Dialog konfirmasi in-app (pengganti window.confirm) — infrastruktur aplikasi,
  // bukan data yang dioper induk, jadi diambil dari context dan tidak lewat props.
  const confirm = usePMS().confirm;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                    Sertifikat & Dokumen Legal Kapal: {currentShip.name}
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Manajemen sertifikasi kelaikan laut kapal (BKI, Statutory, Asuransi, KSOP, dan Kesehatan) sesuai checklist standar.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => {
                      setEditingShipDoc(null);
                      setShowAddDocModal(true);
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Plus size={14} />
                    <span>Tambah Sertifikat Baru</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  onClick={() => setShipDocCatFilter('ALL')}
                  className={`btn btn-sm ${shipDocCatFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.78rem', fontWeight: 600 }}
                >
                  Semua ({shipDocs.length})
                </button>
                {(certificateCategories || []).map(cat => {
                  const count = shipDocs.filter(d => d.category === cat.id).length;
                  const isActive = shipDocCatFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setShipDocCatFilter(cat.id)}
                      className="btn btn-sm"
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        background: isActive ? cat.badgeColor : 'var(--bg-card)',
                        color: isActive ? '#fff' : 'var(--text-main)',
                        border: `1px solid ${isActive ? cat.badgeColor : 'var(--border-glass)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <span>{cat.label}</span>
                      <span
                        className="badge"
                        style={{
                          fontSize: '0.65rem',
                          background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                          color: isActive ? '#fff' : 'var(--text-muted)'
                        }}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="glass-card" style={{ overflow: 'hidden' }}>
                <div className="table-container">
                  <table className="pms-table">
                    <thead>
                      <tr>
                        <th>Kategori</th>
                        <th>Nama Sertifikat & Deskripsi</th>
                        <th>Surveyor / Auditor</th>
                        <th>Nomor Dokumen</th>
                        <th>Instansi Penerbit</th>
                        <th>Tgl Penerbitan</th>
                        <th>Tgl Expired</th>
                        <th>Berkas File</th>
                        <th>Status Kelaikan</th>
                        <th style={{ textAlign: 'right' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shipDocs
                        .filter(d => shipDocCatFilter === 'ALL' || d.category === shipDocCatFilter)
                        .map(d => {
                          const isExpired = d.status === 'Expired' || (d.daysUntilExpiry !== undefined && d.daysUntilExpiry <= 0);
                          const isH30 = d.daysUntilExpiry !== undefined && d.daysUntilExpiry > 0 && d.daysUntilExpiry <= 30;

                          return (
                            <tr key={d.id} style={{ background: isExpired ? 'rgba(239, 68, 68, 0.04)' : isH30 ? 'rgba(245, 158, 11, 0.03)' : undefined }}>
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
                                  <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                                    Catatan daftar: {d.rawNote}
                                  </div>
                                )}
                                {d.notificationReminders && d.notificationReminders.enabled !== false && (
                                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.2rem' }}>
                                    <span className="badge" style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem', background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }} title="Interval Pengingat Expired Aktif">
                                      🔔 {d.notificationReminders.year?.enabled ? `${d.notificationReminders.year.value}Th ` : ''}
                                      {d.notificationReminders.month?.enabled ? `${d.notificationReminders.month.value}Bl ` : ''}
                                      {d.notificationReminders.week?.enabled ? `${d.notificationReminders.week.value}Mg ` : ''}
                                      {d.notificationReminders.day?.enabled ? `${d.notificationReminders.day.value}Hr` : ''}
                                    </span>
                                  </div>
                                )}
                              </td>
                              <td style={{ minWidth: '160px' }}>
                                {d.mandatoryAuditor ? (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                    <span style={{
                                      width: '24px',
                                      height: '24px',
                                      borderRadius: '6px',
                                      background: 'rgba(56, 189, 248, 0.15)',
                                      color: '#38bdf8',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flexShrink: 0
                                    }}>
                                      <UserCheck size={13} />
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
                              <td>
                                <div className="mono" style={{ fontSize: '0.825rem', color: 'var(--text-main)', fontWeight: 600 }}>
                                  {d.issueDate || '-'}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                                  Penerbitan
                                </div>
                              </td>
                              <td>
                                <strong className="mono" style={{ fontSize: '0.85rem', color: isExpired ? '#ef4444' : isH30 ? '#f59e0b' : '#10b981' }}>
                                  {d.expiryDate}
                                </strong>
                                <div style={{ fontSize: '0.72rem', color: isExpired ? '#ef4444' : isH30 ? '#f59e0b' : 'var(--text-subtle)', fontWeight: isH30 ? 600 : 400 }}>
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
                                      gap: '0.3rem',
                                      cursor: 'pointer',
                                      padding: '0.2rem 0.5rem',
                                      border: 'none',
                                      background: 'rgba(56, 189, 248, 0.15)',
                                      color: '#38bdf8'
                                    }}
                                    title={d.fileName ? `Lihat berkas: ${d.fileName}` : 'Lihat Berkas Scan'}
                                  >
                                    <FileText size={11} />
                                    <span>{d.fileName ? (d.fileName.length > 12 ? d.fileName.substring(0, 10) + '...' : d.fileName) : 'Lihat Berkas'}</span>
                                  </button>
                                ) : (
                                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Belum ada</span>
                                )}
                              </td>
                              <td>
                                <span className={`badge ${isExpired ? 'badge-danger-pulse' : isH30 ? 'badge-warning' : 'badge-success'}`}>
                                  {d.status}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem', alignItems: 'center' }}>
                                  <button
                                    onClick={() => setEditingShipDoc(d)}
                                    className="btn btn-secondary btn-sm"
                                    title="Edit Data & Tanggal Dokumen Ini"
                                    style={{ padding: '0.35rem 0.55rem' }}
                                  >
                                    <Edit2 size={13} />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => openGoogleCalendar(d)}
                                    className="btn btn-secondary btn-sm"
                                    title="Sinkron ke Google Calendar"
                                    style={{ padding: '0.35rem 0.55rem', color: '#38bdf8' }}
                                  >
                                    <CalendarPlus size={13} />
                                    <span>G-Cal</span>
                                  </button>
                                  <button
                                    onClick={() => sendWhatsAppReminder(d, 'ship_doc')}
                                    className="btn btn-whatsapp btn-sm"
                                    title="Kirim Peringatan WhatsApp"
                                    style={{ padding: '0.35rem 0.55rem' }}
                                  >
                                    <Send size={13} />
                                    <span>WA</span>
                                  </button>
                                  <button
                                    onClick={async () => {
                                      const lanjut = await confirm({
                                        variant: 'danger',
                                        title: 'Hapus Sertifikat',
                                        subtitle: 'Dokumen yang dihapus tidak dapat dikembalikan',
                                        message: `Hapus sertifikat "${d.name}" (${d.documentNo}) dari ${currentShip.name}?`
                                      });
                                      if (lanjut) deleteShipDocument(d.id);
                                    }}
                                    className="btn btn-secondary btn-sm"
                                    title="Hapus Dokumen"
                                    style={{ padding: '0.35rem 0.55rem', color: '#ef4444' }}
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      {shipDocs.filter(d => shipDocCatFilter === 'ALL' || d.category === shipDocCatFilter).length === 0 && (
                        <tr>
                          <td colSpan="10" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                            <FileCheck size={36} color="var(--text-subtle)" style={{ margin: '0 auto 0.75rem' }} />
                            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Tidak ada sertifikat dalam kategori ini.</p>
                            <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Klik "Tambah Sertifikat Baru" untuk mencatat sertifikat baru untuk kapal ini.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
  );
};
