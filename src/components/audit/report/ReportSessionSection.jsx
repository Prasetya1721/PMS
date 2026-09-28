/**
 * ReportSessionSection.jsx
 * Diekstrak dari AuditReportModal.jsx (baris 738-991).
 * Sumber: BAGIAN LAPORAN SESI AUDIT
 */
import React from 'react';
import { formatIndoDate } from '../../../utils/auditTimeUtils';

export const ReportSessionSection = ({
  activeSession,
  appointedOrg,
  complianceScore,
  compliedItems,
  currentVessel,
  institutionBranding,
  isExternal,
  officialCloseDate,
  sessionFindings,
  totalChecked,
}) => {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* BAGIAN I: INFORMASI UMUM & IDENTITAS AUDIT */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '9pt', fontWeight: 800, color: '#000000', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-block', width: '4px', height: '12px', background: '#0284c7' }} />
                        BAGIAN I: INFORMASI UMUM & IDENTITAS AUDIT
                      </div>

                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8pt', border: '1px solid #000000' }}>
                        <tbody>
                          <tr style={{ background: '#f8fafc' }}>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700, width: '22%' }}>No. Registrasi Audit / ID</td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', width: '28%', fontWeight: 800, color: '#0369a1' }}>
                              {activeSession.reportId || activeSession.auditNo}
                            </td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700, width: '22%' }}>Standar Audit</td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', width: '28%', fontWeight: 700 }}>
                              ISM Code ({activeSession.standard === 'DOC' ? 'Document of Compliance' : 'Safety Management Certificate'})
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>Jenis Pelaksanaan</td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000' }}>
                              Audit {activeSession.auditType} ({isExternal ? appointedOrg : 'PT. PBK Internal'})
                            </td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>Status Pelaksanaan</td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000' }}>
                              <strong style={{ color: activeSession.status === 'Completed' ? '#047857' : '#0369a1' }}>
                                {activeSession.status === 'Completed' ? 'SELESAI (COMPLETED & CLOSED)' : activeSession.status}
                              </strong>
                            </td>
                          </tr>
                          <tr style={{ background: '#f8fafc' }}>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>Objek / Target Audit</td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 800, color: '#003b6f' }}>
                              {activeSession.targetName || currentVessel?.name}
                            </td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>
                              {activeSession.standard === 'DOC' ? 'No. Sertifikat DOC' : 'No. Sertifikat SMC'}
                            </td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700, color: '#0369a1' }}>
                              {activeSession.standard === 'DOC'
                                ? (activeSession.docCertificateNo || 'DOC-IDN-PBK/2024-R1')
                                : (activeSession.smcCertificateNo || currentVessel?.smcCertificateNo || `SMC-TB-${(currentVessel?.name || 'ARMADA').replace(/\s+/g, '')}/2024`)}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>
                              {activeSession.standard === 'DOC' ? 'Divisi / Departemen' : 'Data Teknis Kapal'}
                            </td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000' }}>
                              {activeSession.standard === 'DOC'
                                ? (activeSession.docDepartment || 'Divisi DPA, QHSE & Operasional Armada Darat')
                                : `Reg/IMO: ${currentVessel?.regNo || currentVessel?.imo || activeSession.imo || '-'} | Call Sign: ${currentVessel?.callSign || activeSession.callSign || '-'} | GT: ${currentVessel?.gt || activeSession.gt || '-'}`}
                            </td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>Pelabuhan Registrasi</td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000' }}>
                              {activeSession.standard === 'DOC' ? 'Kantor Pusat Pontianak' : (currentVessel?.portOfRegistry || activeSession.portOfRegistry || 'PONTIANAK')}
                            </td>
                          </tr>
                          <tr style={{ background: '#f8fafc' }}>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>Ruang Lingkup (Scope)</td>
                            <td colSpan={3} style={{ padding: '4px 6px', border: '1px solid #000000', lineHeight: 1.35 }}>
                              {activeSession.scope || (activeSession.standard === 'DOC'
                                ? 'Audit Kepatuhan Tahunan Sistem Manajemen Keselamatan Darat (DOC) PT. PBK mencakup 13 Seksi BKI DOC Rev 06 / ISM Code 2025.'
                                : 'Audit Kelaikan Sistem Manajemen Keselamatan (SMC) Kapal Onboard sesuai IMO Res. A.741(18) / ISM Code dan BKI SMS Shipboard Checklist Rev 05.')}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>Tanggal Pelaksanaan</td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000' }}>{formatIndoDate(activeSession.auditDate)}</td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>Target Due Date & Selesai</td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>
                              Target: {formatIndoDate(activeSession.targetCloseDate)} | Close: <strong style={{ color: '#047857' }}>{formatIndoDate(officialCloseDate)}</strong>
                            </td>
                          </tr>
                          <tr style={{ background: '#f8fafc' }}>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>Lokasi Pelaksanaan</td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000' }}>{activeSession.auditLocation || 'Dermaga Pontianak, Kalimantan Barat'}</td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>Auditee (Pihak Diaudit)</td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000' }}>{activeSession.auditee}</td>
                          </tr>
                          <tr>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>Lead Auditor</td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>{activeSession.leadAuditor}</td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>Tim Auditor Pendamping</td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000' }}>
                              {Array.isArray(activeSession.auditTeam) ? activeSession.auditTeam.join(', ') : (activeSession.auditTeam || 'Tim Auditor DPA')}
                            </td>
                          </tr>
                          <tr style={{ background: '#f8fafc' }}>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>Lembaga Auditor</td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000' }}>{isExternal ? appointedOrg : 'Internal DPA/QHSE PT. PBK'}</td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>Otoritas Pengesahan</td>
                            <td style={{ padding: '4px 6px', border: '1px solid #000000', fontSize: '7.2pt' }}>{institutionBranding.authorityTag}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* BAGIAN II: RINGKASAN TINGKAT KEPATUHAN */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '9pt', fontWeight: 800, color: '#000000', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-block', width: '4px', height: '12px', background: '#0284c7' }} />
                        BAGIAN II: RINGKASAN PEMERIKSAAN & STATUS KEPATUHAN
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '6px' }}>
                        <div style={{ border: '1px solid #000000', padding: '5px 8px', textAlign: 'center', background: '#f8fafc' }}>
                          <div style={{ fontSize: '6.8pt', fontWeight: 700, color: '#64748b' }}>TOTAL BUTIR DIKONTROL</div>
                          <div style={{ fontSize: '12pt', fontWeight: 900, color: '#000000' }}>{totalChecked}</div>
                          <div style={{ fontSize: '6pt', color: '#64748b' }}>Termasuk Klausul A - E</div>
                        </div>
                        <div style={{ border: '1px solid #000000', padding: '5px 8px', textAlign: 'center', background: '#f0fdf4' }}>
                          <div style={{ fontSize: '6.8pt', fontWeight: 700, color: '#15803d' }}>TINGKAT KEPATUHAN</div>
                          <div style={{ fontSize: '12pt', fontWeight: 900, color: '#16a34a' }}>{complianceScore}%</div>
                          <div style={{ fontSize: '6pt', color: '#15803d' }}>{compliedItems} Butir Memenuhi Standar</div>
                        </div>
                        <div style={{ border: '1px solid #000000', padding: '5px 8px', textAlign: 'center', background: '#f8fafc' }}>
                          <div style={{ fontSize: '6.8pt', fontWeight: 700, color: '#64748b' }}>TOTAL TEMUAN NC</div>
                          <div style={{ fontSize: '12pt', fontWeight: 900, color: '#d97706' }}>{sessionFindings.length}</div>
                          <div style={{ fontSize: '6pt', color: '#64748b' }}>Major: 0 | Minor: {sessionFindings.length}</div>
                        </div>
                        <div style={{ border: '1px solid #000000', padding: '5px 8px', textAlign: 'center', background: '#f0fdf4' }}>
                          <div style={{ fontSize: '6.8pt', fontWeight: 700, color: '#166534' }}>STATUS PENYELESAIAN NC</div>
                          <div style={{ fontSize: '12pt', fontWeight: 900, color: '#15803d' }}>100% CLOSED</div>
                          <div style={{ fontSize: '6pt', color: '#166534' }}>Seluruh Eviden Terverifikasi</div>
                        </div>
                      </div>
                    </div>

                    {/* BAGIAN III: TABEL TEMUAN & CAP */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '9pt', fontWeight: 800, color: '#000000', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-block', width: '4px', height: '12px', background: '#0284c7' }} />
                        BAGIAN III: DAFTAR TEMUAN KETIDAKSESUAIAN (NCR) & TINDAKAN KOREKTIF
                      </div>

                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '7.5pt', border: '1px solid #000000' }}>
                        <thead>
                          <tr style={{ background: '#0f172a', color: '#ffffff' }}>
                            <th style={{ padding: '5px', border: '1px solid #000000', width: '13%' }}>No. Temuan</th>
                            <th style={{ padding: '5px', border: '1px solid #000000', width: '10%' }}>Klausul</th>
                            <th style={{ padding: '5px', border: '1px solid #000000', width: '32%' }}>Uraian Masalah & Bukti Objektif</th>
                            <th style={{ padding: '5px', border: '1px solid #000000', width: '27%' }}>Tindakan Koreksi & RCA</th>
                            <th style={{ padding: '5px', border: '1px solid #000000', width: '18%' }}>Verifikasi & Tgl Close</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessionFindings.map((f, idx) => (
                            <tr key={f.id} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                              <td style={{ padding: '5px', border: '1px solid #000000', verticalAlign: 'top' }}>
                                <strong style={{ color: '#0369a1' }}>{f.findingNo}</strong>
                                <div style={{ fontSize: '6.5pt', color: '#64748b' }}>{f.category}</div>
                              </td>
                              <td style={{ padding: '5px', border: '1px solid #000000', verticalAlign: 'top' }}>
                                <strong>{f.clauseCode}</strong>
                              </td>
                              <td style={{ padding: '5px', border: '1px solid #000000', verticalAlign: 'top', lineHeight: '1.3' }}>
                                <div>{f.description}</div>
                                {f.objectiveEvidence && (
                                  <div style={{ color: '#475569', fontSize: '7pt', fontStyle: 'italic', marginTop: '2px' }}>
                                    Eviden: {f.objectiveEvidence}
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: '5px', border: '1px solid #000000', verticalAlign: 'top', lineHeight: '1.3' }}>
                                <div><strong>Koreksi: </strong>{f.evidence?.correction || f.evidence?.correctiveAction || '-'}</div>
                                {f.evidence?.rootCause && (
                                  <div style={{ marginTop: '2px', color: '#475569' }}>
                                    <strong>RCA: </strong>{f.evidence.rootCause}
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: '5px', border: '1px solid #000000', verticalAlign: 'top', lineHeight: '1.25' }}>
                                <div style={{ color: '#15803d', fontWeight: 800 }}>✅ {f.status}</div>
                                <div style={{ fontSize: '6.8pt' }}>Close: {formatIndoDate(f.evidence?.closedDate || officialCloseDate)}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* BAGIAN IV: KESIMPULAN & REKOMENDASI */}
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ fontSize: '9pt', fontWeight: 800, color: '#000000', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-block', width: '4px', height: '12px', background: '#0284c7' }} />
                        BAGIAN IV: KESIMPULAN & REKOMENDASI AUDITOR
                      </div>

                      <div style={{ border: '1px solid #000000', padding: '6px 10px', background: '#f8fafc', fontSize: '7.8pt', lineHeight: '1.4' }}>
                        <p style={{ margin: '0 0 4px 0' }}>
                          {activeSession.auditConclusion || (activeSession.standard === 'DOC'
                            ? `Berdasarkan hasil verifikasi audit kantor darat dan evaluasi pemenuhan 13 Seksi BKI DOC Rev 06 / ISM Code, Sistem Manajemen Keselamatan (SMS) Kantor Pusat PT. Pelayaran Baharimas Kalimantan dinilai memadai dan berjalan efektif.`
                            : `Berdasarkan hasil verifikasi audit lapangan dan evaluasi pemenuhan standar ISM Code, Sistem Manajemen Keselamatan (SMS) kapal ${activeSession.targetName || currentVessel?.name} dinilai berjalan efektif dan memenuhi kelaiklautan kapal.`
                          )}
                        </p>
                        <div style={{ fontWeight: 800, color: isExternal ? '#047857' : '#0369a1' }}>
                          REKOMENDASI: {activeSession.standard === 'DOC'
                            ? `Sertifikat DOC Kantor Perusahaan (${activeSession.targetName || 'PT. Pelayaran Baharimas Kalimantan'}) direkomendasikan tetap berlaku / disahkan oleh ${isExternal ? appointedOrg : 'Manajemen Keselamatan Perusahaan'}.`
                            : `Sertifikat SMC Kapal ${activeSession.targetName || currentVessel?.name} direkomendasikan tetap berlaku / disahkan oleh ${isExternal ? appointedOrg : 'Manajemen Keselamatan Perusahaan'}.`
                          }
                        </div>
                      </div>
                    </div>

                    {/* SIGNATURE BLOCK */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '7.8pt', marginTop: '16px', pageBreakInside: 'avoid' }}>
                      <tbody>
                        <tr>
                          <td style={{ width: '33.3%', padding: '6px', verticalAlign: 'top' }}>
                            <div style={{ fontWeight: 700, color: '#475569', marginBottom: '2px' }}>DIVERIFIKASI OLEH:</div>
                            <div style={{ fontWeight: 800 }}>LEAD AUDITOR</div>
                            <div style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ border: '1px dashed #0284c7', padding: '3px 10px', color: '#0284c7', fontSize: '7pt' }}>
                                [ TTD AUDITOR ]
                              </span>
                            </div>
                            <div style={{ fontWeight: 800, textDecoration: 'underline' }}>{activeSession.leadAuditorSign || activeSession.leadAuditor}</div>
                            <div style={{ fontSize: '6.8pt', color: '#64748b' }}>{isExternal ? appointedOrg : 'Auditor Internal PBK'}</div>
                          </td>
                          <td style={{ width: '33.3%', padding: '6px', verticalAlign: 'top' }}>
                            <div style={{ fontWeight: 700, color: '#475569', marginBottom: '2px' }}>DIKETAHUI:</div>
                            <div style={{ fontWeight: 800 }}>DESIGNATED PERSON ASHORE (DPA)</div>
                            <div style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ border: '1px dashed #10b981', padding: '3px 10px', color: '#047857', fontSize: '7pt' }}>
                                [ STEMPEL DPA ]
                              </span>
                            </div>
                            <div style={{ fontWeight: 800, textDecoration: 'underline' }}>{activeSession.dpaSign || 'DPA PT. PBK'}</div>
                            <div style={{ fontSize: '6.8pt', color: '#64748b' }}>PT. Pelayaran Baharimas Kalimantan</div>
                          </td>
                          <td style={{ width: '33.3%', padding: '6px', verticalAlign: 'top' }}>
                            <div style={{ fontWeight: 700, color: '#475569', marginBottom: '2px' }}>DITERIMA OLEH:</div>
                            <div style={{ fontWeight: 800 }}>
                              {activeSession.standard === 'DOC' ? 'PERWAKILAN AUDITEE DARAT' : 'NAKHODA / AUDITEE KAPAL'}
                            </div>
                            <div style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ border: '1px dashed #0f172a', padding: '3px 10px', color: '#0f172a', fontSize: '7pt' }}>
                                [ TTD AUDITEE ]
                              </span>
                            </div>
                            <div style={{ fontWeight: 800, textDecoration: 'underline' }}>{activeSession.auditeeSign || activeSession.auditee}</div>
                            <div style={{ fontSize: '6.8pt', color: '#64748b' }}>
                              {activeSession.standard === 'DOC' ? 'Perwakilan Manajemen PT. PBK' : `Master TB. ${activeSession.targetName || currentVessel?.name}`}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
  );
};
