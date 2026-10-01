/**
 * DocTrackerTable.jsx
 * Diekstrak dari DocumentTracker.jsx (baris 262-538).
 * Sumber: Tabel dokumen: kolom identitas, tanggal, berkas, status kelaikan, dan tombol aksi per baris
 */
import React from 'react';
import { CalendarPlus, Edit2, Eye, FileText, Plus, Send, Trash2, UserCheck } from 'lucide-react';
import { usePMS } from '../../../context/PMSContext';

export const DocTrackerTable = ({
  deleteShipDocument,
  filteredItems,
  setCalModalDoc,
  setCalOffset,
  setEditingDoc,
  setPreviewDoc,
  setShowAddDocModal,
  setWaModalDoc,
  setWaModalOffset,
  vessels,
}) => {
  // Dialog konfirmasi in-app (pengganti window.confirm) — infrastruktur aplikasi,
  // bukan data yang dioper induk, jadi diambil dari context dan tidak lewat props.
  const { confirm, canAction } = usePMS();
  const canAddCert = canAction ? canAction('add_certificate') : false;
  return (
    <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div className="table-container">
              <table className="pms-table">
                <thead>
                  <tr>
                    <th>Kategori</th>
                    <th>Nama Dokumen / Sertifikat</th>
                    <th>Surveyor / Auditor</th>
                    <th>Pemilik / Kapal</th>
                    <th>Nomor Dokumen</th>
                    <th>Instansi Penerbit</th>
                    <th>Tgl Penerbitan</th>
                    <th>Tgl Expired</th>
                    <th>Berkas</th>
                    <th>Status Kelaikan</th>
                    <th style={{ textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={11} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-subtle)' }}>
                        <FileText size={42} style={{ opacity: 0.35, margin: '0 auto 0.75rem auto', display: 'block', color: '#38bdf8' }} />
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                          Belum Ada Dokumen / Sertifikat Kapal
                        </div>
                        <p style={{ fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto 1.25rem auto' }}>
                          Database dokumen armada saat ini kosong. Silakan klik tombol di bawah untuk mulai menginput dokumen kapal atau sertifikat kru secara manual.
                        </p>
                        {canAddCert ? (
                        <button
                          type="button"
                          onClick={() => setShowAddDocModal(true)}
                          className="btn btn-primary btn-sm"
                          style={{ margin: '0 auto', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                          <Plus size={14} />
                          <span>+ Tambah Dokumen / Sertifikat Pertama</span>
                        </button>
                        ) : (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: '0.5rem auto 0 auto' }}>
                            Hanya akun Super Admin yang memiliki kewenangan menambah dokumen atau sertifikat kapal.
                          </div>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map(item => {
                    const ship = vessels.find(v => v.id === item.vesselId);
                    const docNo = item.certificateNo || item.documentNo;
                    const isExpired = item.status === 'Expired' || (item.daysUntilExpiry !== undefined && item.daysUntilExpiry <= 0);
                    const isH30 = item.daysUntilExpiry !== undefined && item.daysUntilExpiry > 0 && item.daysUntilExpiry <= 30;

                    return (
                      <tr key={item.id} style={{ background: isExpired ? 'rgba(239, 68, 68, 0.04)' : isH30 ? 'rgba(245, 158, 11, 0.03)' : undefined }}>
                        <td>
                          {item.category ? (
                            <span
                              className="badge"
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                background: item.category === 'KSOP' ? 'rgba(245, 158, 11, 0.15)' :
                                  item.category === 'BKI' ? 'rgba(56, 189, 248, 0.15)' :
                                  item.category === 'Statutory' ? 'rgba(16, 185, 129, 0.15)' :
                                  item.category === 'Asuransi' ? 'rgba(168, 85, 247, 0.15)' :
                                  'rgba(236, 72, 153, 0.15)',
                                color: item.category === 'KSOP' ? '#f59e0b' :
                                  item.category === 'BKI' ? '#38bdf8' :
                                  item.category === 'Statutory' ? '#10b981' :
                                  item.category === 'Asuransi' ? '#c084fc' :
                                  '#f472b6',
                                border: item.category === 'KSOP' ? '1px solid rgba(245, 158, 11, 0.35)' :
                                  item.category === 'BKI' ? '1px solid rgba(56, 189, 248, 0.35)' :
                                  item.category === 'Statutory' ? '1px solid rgba(16, 185, 129, 0.35)' :
                                  item.category === 'Asuransi' ? '1px solid rgba(168, 85, 247, 0.35)' :
                                  '1px solid rgba(236, 72, 153, 0.35)'
                              }}
                            >
                              {item.category}
                            </span>
                          ) : (
                            <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                              {item.itemCategory}
                            </span>
                          )}
                        </td>
                        <td>
                          <strong style={{ fontSize: '0.92rem' }}>{item.name}</strong>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.15rem' }}>
                            {item.surveyType && (
                              <span className="badge" style={{ fontSize: '0.66rem', padding: '0.1rem 0.4rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.35)', fontWeight: 600 }}>
                                🔍 {item.surveyType}
                              </span>
                            )}
                            {item.surveyPeriod && (
                              <span className="badge" style={{ fontSize: '0.66rem', padding: '0.1rem 0.4rem', background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.35)', fontWeight: 600 }}>
                                ⏱️ {item.surveyPeriod}
                              </span>
                            )}
                            <span>{item.type || (item.category ? `Kategori ${item.category}` : item.itemCategory)}</span>
                          </div>
                          {item.notificationReminders && item.notificationReminders.enabled !== false && (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                              <span className="badge" style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem', background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }} title="Interval Pengingat Expired Aktif">
                                🔔 {item.notificationReminders.year?.enabled ? `${item.notificationReminders.year.value}Th ` : ''}
                                {item.notificationReminders.month?.enabled ? `${item.notificationReminders.month.value}Bl ` : ''}
                                {item.notificationReminders.week?.enabled ? `${item.notificationReminders.week.value}Mg ` : ''}
                                {item.notificationReminders.day?.enabled ? `${item.notificationReminders.day.value}Hr` : ''}
                              </span>
                              {item.notificationReminders.channels?.whatsapp !== false && (
                                <span style={{ fontSize: '0.58rem', fontWeight: 700, color: '#22c55e', background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '4px', padding: '0.05rem 0.25rem' }} title="Notifikasi WhatsApp Aktif">WA</span>
                              )}
                              {item.notificationReminders.channels?.email !== false && (
                                <span style={{ fontSize: '0.58rem', fontWeight: 700, color: '#0ea5e9', background: 'rgba(14, 165, 233, 0.12)', border: '1px solid rgba(14, 165, 233, 0.3)', borderRadius: '4px', padding: '0.05rem 0.25rem' }} title="Notifikasi Email Aktif">Email</span>
                              )}
                              {item.notificationReminders.channels?.googleCalendar !== false && (
                                <span style={{ fontSize: '0.58rem', fontWeight: 700, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '4px', padding: '0.05rem 0.25rem' }} title="Pengingat Google Calendar Aktif">Cal</span>
                              )}
                            </div>
                          )}
                        </td>
                        <td style={{ minWidth: '150px' }}>
                          {item.mandatoryAuditor ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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
                                <UserCheck size={12} />
                              </span>
                              <div>
                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                  {item.mandatoryAuditor}
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
                        <td>
                          {item.crewName ? (
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.crewName}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{ship?.name}</div>
                            </div>
                          ) : (
                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{ship?.name}</div>
                          )}
                        </td>
                        <td className="mono" style={{ fontSize: '0.78rem' }}>{docNo}</td>
                        <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{item.issuer}</td>
                        <td>
                          <div className="mono" style={{ fontSize: '0.825rem', color: 'var(--text-main)', fontWeight: 600 }}>
                            {item.issueDate || '-'}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                            Penerbitan
                          </div>
                        </td>
                        <td>
                          <div className="mono" style={{ fontWeight: 700, fontSize: '0.85rem', color: isExpired ? '#ef4444' : isH30 ? '#f59e0b' : '#10b981' }}>
                            {item.expiryDate}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: isExpired ? '#ef4444' : isH30 ? '#f59e0b' : 'var(--text-subtle)', fontWeight: isH30 ? 600 : 400 }}>
                            {item.daysUntilExpiry > 0 ? `${item.daysUntilExpiry} hari lagi` : `LEWAT ${Math.abs(item.daysUntilExpiry)} HARI!`}
                          </div>
                        </td>
                        <td>
                          {item.fileUrl ? (
                            <button
                              type="button"
                              onClick={() => setPreviewDoc(item)}
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
                              title={item.fileName ? `Lihat berkas: ${item.fileName}` : 'Lihat Berkas Scan'}
                            >
                              <FileText size={11} />
                              <span>{item.fileName ? (item.fileName.length > 10 ? item.fileName.substring(0, 8) + '...' : item.fileName) : 'Berkas'}</span>
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>-</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${
                            isExpired ? 'badge-danger-pulse' :
                            isH30 ? 'badge-warning' :
                            item.status === 'Due Soon' ? 'badge-warning' : 'badge-success'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem', alignItems: 'center' }}>
                            {item.itemCategory === 'Surat Legal Kapal' && canAddCert && (
                              <button
                                onClick={() => setEditingDoc(item)}
                                className="btn btn-secondary btn-sm"
                                title="Edit Data & Tanggal Dokumen Ini"
                                style={{ padding: '0.35rem 0.55rem' }}
                              >
                                <Edit2 size={13} />
                                <span>Edit</span>
                              </button>
                            )}
                            <button
                              onClick={() => setPreviewDoc(item)}
                              className="btn btn-secondary btn-sm"
                              title="Lihat Scan Dokumen"
                              style={{ padding: '0.35rem 0.55rem' }}
                            >
                              <Eye size={13} />
                              <span>Scan</span>
                            </button>
                            <button
                              onClick={() => {
                                setCalModalDoc(item);
                                setCalOffset(item.daysUntilExpiry <= 1 ? 1 : item.daysUntilExpiry <= 7 ? 7 : item.daysUntilExpiry <= 30 ? 30 : 365);
                              }}
                              className="btn btn-secondary btn-sm"
                              title="Pilih Jadwal Google Calendar"
                              style={{ padding: '0.35rem 0.55rem', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}
                            >
                              <CalendarPlus size={13} />
                              <span>G-Cal</span>
                            </button>
                            <button
                              onClick={() => {
                                setWaModalDoc(item);
                                setWaModalOffset(item.daysUntilExpiry <= 1 ? 1 : item.daysUntilExpiry <= 7 ? 7 : item.daysUntilExpiry <= 30 ? 30 : 365);
                              }}
                              className="btn btn-whatsapp btn-sm"
                              title="Kirim Reminder WhatsApp Resmi"
                              style={{ padding: '0.35rem 0.55rem' }}
                            >
                              <Send size={13} />
                              <span>WA</span>
                            </button>
                            {item.itemCategory === 'Surat Legal Kapal' && canAddCert && (
                              <button
                                onClick={async () => {
                                  const lanjut = await confirm({
                                    variant: 'danger',
                                    title: 'Hapus Sertifikat',
                                    subtitle: 'Dokumen yang dihapus tidak dapat dikembalikan',
                                    message: `Hapus sertifikat ${item.name}?`
                                  });
                                  if (lanjut) deleteShipDocument(item.id);
                                }}
                                className="btn btn-secondary btn-sm"
                                title="Hapus Dokumen"
                                style={{ padding: '0.35rem 0.5rem', color: '#ef4444' }}
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  }))}
                </tbody>
              </table>
            </div>
          </div>
  );
};
