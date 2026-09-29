/**
 * DocSessionOfficeColumn.jsx
 * Diekstrak dari DocSessionModal.jsx (baris 462-589).
 * Sumber: Kolom 1: kantor perusahaan & legalitas DOC
 */
import React from 'react';
import { Building2, ShieldCheck } from 'lucide-react';
import { DOC_DEPARTMENT_OPTIONS } from './docConstants';

export const DocSessionOfficeColumn = ({
  auditNo,
  docCertificateNo,
  docDepartment,
  reportId,
  setAuditNo,
  setDocCertificateNo,
  setDocDepartment,
  setReportId,
  setStatus,
  status,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="glass-card" style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Building2 size={15} />
                      <span>1. Kantor Pusat Perusahaan & Sertifikat DOC</span>
                    </div>

                    {/* Info Kantor Pusat PBK */}
                    <div style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      marginBottom: '0.85rem'
                    }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 900, color: 'var(--text-main)' }}>
                        PT. PELAYARAN BAHARIMAS KALIMANTAN (KANTOR PUSAT)
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        JL. Adisucipto Km 6.30 RT.04 RW.04 Desa Sungai Raya, Pontianak - Kalimantan Barat
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', color: '#b45309', fontWeight: 700, marginTop: '4px' }}>
                        <span>IMO Perusahaan: 9049645</span>
                        <span>Tipe Sertifikasi: DOC (Document of Compliance)</span>
                      </div>
                    </div>

                    {/* Divisi / Departemen Darat */}
                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label" style={{ fontSize: '0.76rem', fontWeight: 700 }}>
                        Divisi / Departemen yang Diaudit <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <select
                        value={docDepartment}
                        onChange={(e) => setDocDepartment(e.target.value)}
                        className="form-control"
                        style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}
                      >
                        {DOC_DEPARTMENT_OPTIONS.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={docDepartment}
                        onChange={(e) => setDocDepartment(e.target.value)}
                        placeholder="Atau ketik divisi spesifik..."
                        className="form-control"
                        style={{ fontSize: '0.78rem' }}
                        required
                      />
                    </div>

                    {/* Nomor Sertifikat DOC Perusahaan */}
                    <div className="form-group" style={{ marginBottom: '0.25rem' }}>
                      <label className="form-label" style={{ fontSize: '0.76rem', fontWeight: 700 }}>
                        No. Sertifikat DOC Perusahaan (Document of Compliance) <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={docCertificateNo}
                        onChange={(e) => setDocCertificateNo(e.target.value)}
                        placeholder="Contoh: DOC-IDN-PBK/2024-R1"
                        className="form-control"
                        style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0369a1' }}
                        required
                      />
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                        Sertifikat resmi izin pengoperasian armada kapal yang diterbitkan oleh Flag State / RO.
                      </span>
                    </div>
                  </div>

                  {/* Registrasi & Legalitas Audit DOC */}
                  <div className="glass-card" style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <ShieldCheck size={15} color="#10b981" />
                      <span>2. Penomoran & Status Sesi Audit DOC</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '0.75rem' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                          No. Registrasi Audit <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={auditNo}
                          onChange={(e) => setAuditNo(e.target.value)}
                          className="form-control"
                          style={{ fontSize: '0.8rem', fontWeight: 700 }}
                          required
                        />
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                          No. Laporan BKI (Report ID) <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={reportId}
                          onChange={(e) => setReportId(e.target.value)}
                          placeholder="0858-PK/ISM-DOC/2026"
                          className="form-control"
                          style={{ fontSize: '0.8rem', fontWeight: 700 }}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                        Status Pelaksanaan Sesi
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="form-control"
                        style={{ fontSize: '0.8rem', fontWeight: 700 }}
                      >
                        <option value="In Progress">Sedang Berjalan (In Progress)</option>
                        <option value="Scheduled">Terjadwal (Scheduled)</option>
                        <option value="Completed">Selesai & Tertutup (Completed)</option>
                      </select>
                    </div>
                  </div>
                </div>
  );
};
