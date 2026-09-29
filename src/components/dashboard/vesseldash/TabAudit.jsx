/**
 * TabAudit.jsx
 * Diekstrak dari VesselDashboard.jsx (baris 1755-1964).
 * Sumber: SUB-TAB 8: audit SMC kapal
 */
import React from 'react';
import { ArrowRight, ChevronRight, Printer, ShieldCheck } from 'lucide-react';

export const TabAudit = ({
  currentShip,
  setActiveTab,
  setVesselReportFinding,
  setVesselReportSession,
  shipAuditFindings,
  shipClosedNC,
  shipOpenNC,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Header & Status Card */}
              <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8' }}>
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Audit Safety Management Certificate (SMC) - {currentShip.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Monitoring temuan ketidaksesuaian ISM Code, bukti perbaikan eviden, dan status NC Open / NC Close kapal ini
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('audit')}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem' }}
                >
                  <span>Buka Modul Audit Lengkap (DOC & SMC)</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Quick Stats for this Vessel */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className="glass-card" style={{ padding: '1.15rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Temuan SMC</span>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.35rem' }}>
                    {shipAuditFindings.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-subtle)' }}>Temuan</span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Tercatat pada sesi audit internal & eksternal kapal
                  </p>
                </div>

                <div className="glass-card" style={{ padding: '1.15rem', border: shipOpenNC > 0 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.8rem', color: shipOpenNC > 0 ? '#f87171' : 'var(--text-muted)', fontWeight: 700 }}>NC Open (Perlu Perbaikan)</span>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: shipOpenNC > 0 ? '#ef4444' : '#10b981', marginTop: '0.35rem' }}>
                    {shipOpenNC} <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Temuan</span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: shipOpenNC > 0 ? '#fca5a5' : 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {shipOpenNC > 0 ? 'Membutuhkan tindakan korektif & eviden' : 'Nol temuan terbuka (All Complied)'}
                  </p>
                </div>

                <div className="glass-card" style={{ padding: '1.15rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>NC Close (Terverifikasi)</span>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginTop: '0.35rem' }}>
                    {shipClosedNC} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-subtle)' }}>Temuan</span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Telah ditutup & disetujui Lead Auditor / DPA
                  </p>
                </div>
              </div>

              {/* Findings Table */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                    Daftar Temuan Audit ISM Code Kapal {currentShip.name}
                  </h4>
                  <button
                    onClick={() => {
                      setVesselReportSession({
                        vesselId: currentShip.id,
                        targetName: currentShip.name,
                        standard: 'SMC',
                        auditNo: `AUD-EXT-SMC-BKI-2026/04`,
                        reportId: `0859-PK/ISM-SMC/2026`,
                        status: 'Completed',
                        auditType: 'External',
                        externalOrganization: 'Biro Klasifikasi Indonesia (BKI)',
                        smcCertificateNo: currentShip.smcCertificateNo || `SMC-TB-${(currentShip.name || 'ARMADA').replace(/\s+/g, '')}/2026`,
                        imo: currentShip.imo || currentShip.regNo || '-',
                        callSign: currentShip.callSign || '-',
                        gt: currentShip.gt || '-',
                        portOfRegistry: currentShip.portOfRegistry || 'PONTIANAK',
                        leadAuditor: 'Surveyor BKI Cabang Pontianak (Auditor Eksternal ISM Hubla)',
                        auditTeam: ['Surveyor Madya BKI Pontianak', 'Marine Safety Inspector'],
                        auditee: `Capt. Hendra Gunawan, M.Mar & Ir. Bambang Wijaya (KKM ${currentShip.name})`,
                        auditLocation: `Onboard ${currentShip.name} (Pelabuhan Dwikora Pontianak)`,
                        auditDate: '2026-07-20',
                        targetCloseDate: '2026-10-20',
                        scope: `Audit Kelaikan Sistem Manajemen Keselamatan (SMC) Kapal Onboard sesuai IMO Res. A.741(18) / ISM Code dan BKI SMS Shipboard Checklist Rev 05.`
                      });
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.76rem', fontWeight: 700, color: '#0284c7' }}
                    title="Cetak Laporan Hasil Audit ISM Code Kapal Ini (Standar A4)"
                  >
                    <Printer size={13} color="#0284c7" />
                    <span>🖨️ Cetak Laporan Audit Kapal</span>
                  </button>
                </div>

                {shipAuditFindings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    <ShieldCheck size={44} color="#10b981" style={{ margin: '0 auto 0.75rem' }} />
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Tidak Ada Temuan NC Terbuka untuk Kapal Ini
                    </h4>
                    <p style={{ fontSize: '0.825rem', marginTop: '0.3rem', maxWidth: '420px', margin: '0.3rem auto 1.25rem' }}>
                      Implementasi ISM Code dan pemeliharaan alat keselamatan di atas kapal berjalan sesuai prosedur SMS PT. Pelayaran Baharimas Kalimantan.
                    </p>
                    <button
                      onClick={() => setActiveTab('audit')}
                      className="btn btn-secondary btn-sm"
                    >
                      Buka Modul Audit untuk Catat Temuan Baru
                    </button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>No. Temuan</th>
                          <th>Klausul ISM</th>
                          <th>Kategori</th>
                          <th>Deskripsi Ketidaksesuaian</th>
                          <th>Jatuh Tempo</th>
                          <th>Status NC</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shipAuditFindings.map(finding => (
                          <tr key={finding.id}>
                            <td>
                              <span className="mono" style={{ fontWeight: 700, color: '#38bdf8' }}>
                                {finding.findingNo}
                              </span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', display: 'block' }}>
                                {finding.auditType} SMC
                              </span>
                            </td>
                            <td>
                              <span className="mono" style={{ fontWeight: 700, fontSize: '0.75rem' }}>
                                {finding.clauseCode}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                                {finding.clauseName}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${
                                finding.category === 'Major NC' ? 'badge-danger-pulse' :
                                finding.category === 'Minor NC' ? 'badge-warning' : 'badge-info'
                              }`}>
                                {finding.category}
                              </span>
                            </td>
                            <td style={{ maxWidth: '280px', fontSize: '0.8rem', lineHeight: '1.4' }}>
                              {finding.description}
                            </td>
                            <td className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {finding.dueDate}
                            </td>
                            <td>
                              <span className={`badge ${
                                finding.status === 'NC Close' ? 'badge-success' :
                                finding.status === 'Eviden Submitted' ? 'badge-warning' : 'badge-danger'
                              }`}>
                                {finding.status}
                              </span>
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                              <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                                {finding.status === 'NC Close' && (
                                  <button
                                    onClick={() => setVesselReportFinding(finding)}
                                    className="btn btn-secondary btn-sm"
                                    style={{
                                      fontSize: '0.72rem',
                                      padding: '0.25rem 0.55rem',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.25rem',
                                      color: '#0284c7',
                                      fontWeight: 700
                                    }}
                                    title="Cetak Lembar Verifikasi Penutupan NC Resmi (NCR Close-Out Form Standar BKI)"
                                  >
                                    <Printer size={12} color="#0284c7" />
                                    <span>Cetak NCR</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => setActiveTab('audit')}
                                  className="btn btn-secondary btn-sm"
                                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
                                >
                                  <span>Kelola Eviden</span>
                                  <ChevronRight size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
  );
};
