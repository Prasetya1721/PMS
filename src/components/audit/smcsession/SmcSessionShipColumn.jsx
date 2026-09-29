/**
 * SmcSessionShipColumn.jsx
 * Diekstrak dari SmcSessionModal.jsx (baris 485-606).
 * Sumber: Kolom 1: objek kapal armada & legalitas penomoran
 */
import React from 'react';
import { ShieldCheck, Ship } from 'lucide-react';

export const SmcSessionShipColumn = ({
  auditNo,
  currentSelectedVessel,
  handleVesselChange,
  reportId,
  setAuditNo,
  setReportId,
  setSmcCertificateNo,
  setStatus,
  smcCertificateNo,
  status,
  vesselId,
  vessels,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="glass-card" style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Ship size={15} />
                      <span>1. Objek Kapal Armada & Sertifikat SMC</span>
                    </div>

                    {/* Pilih Kapal Armada */}
                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label" style={{ fontSize: '0.76rem', fontWeight: 700 }}>
                        Kapal Armada Sasaran Audit <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <select
                        value={vesselId}
                        onChange={(e) => handleVesselChange(e.target.value)}
                        className="form-control"
                        style={{ fontSize: '0.82rem', fontWeight: 700 }}
                        required
                      >
                        {vessels.map(v => (
                          <option key={v.id} value={v.id}>
                            {v.name} ({v.type || 'Tugboat'}) — Port: {v.portOfRegistry || 'Pontianak'}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Chip Spesifikasi Teknis Kapal */}
                    <div style={{
                      padding: '0.45rem 0.65rem',
                      borderRadius: '6px',
                      background: 'rgba(2, 132, 199, 0.08)',
                      border: '1px solid rgba(2, 132, 199, 0.2)',
                      fontSize: '0.72rem',
                      color: 'var(--text-main)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.4rem',
                      marginBottom: '0.75rem'
                    }}>
                      <span><strong>IMO/Reg:</strong> {currentSelectedVessel?.imo || currentSelectedVessel?.regNo || '-'}</span>
                      <span><strong>Call Sign:</strong> {currentSelectedVessel?.callSign || '-'}</span>
                      <span><strong>GT:</strong> {currentSelectedVessel?.gt || '250'}</span>
                      <span><strong>Port:</strong> {currentSelectedVessel?.portOfRegistry || 'PONTIANAK'}</span>
                    </div>

                    {/* Nomor Sertifikat SMC Kapal */}
                    <div className="form-group" style={{ marginBottom: '0.25rem' }}>
                      <label className="form-label" style={{ fontSize: '0.76rem', fontWeight: 700 }}>
                        No. Sertifikat SMC Kapal (Safety Management Certificate) <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={smcCertificateNo}
                        onChange={(e) => setSmcCertificateNo(e.target.value)}
                        placeholder="Contoh: SMC-TB-RP2004/2026"
                        className="form-control"
                        style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0284c7' }}
                        required
                      />
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                        Sertifikat resmi kelaiklautan ISM Code kapal yang diverifikasi masa berlakunya.
                      </span>
                    </div>
                  </div>

                  {/* Registrasi & Legalitas Audit */}
                  <div className="glass-card" style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <ShieldCheck size={15} color="#10b981" />
                      <span>2. Penomoran & Status Sesi Audit</span>
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
                          placeholder="0859-PK/ISM-SMC/2026"
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
