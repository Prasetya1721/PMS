/**
 * ReportNcrDetail.jsx
 * Diekstrak dari AuditReportModal.jsx (baris 1026-1339).
 * Sumber: DETAIL TEMUAN NCR (terbesar)
 */
import React from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { formatIndoDate } from '../../../utils/auditTimeUtils';

export const ReportNcrDetail = ({
  activeFinding,
  activeSession,
  appointedOrg,
  currentVessel,
  isExternal,
  officialCloseDate,
}) => {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* 4-PART TABULAR FORM REPLICA OF THE SCANNED IMAGE */}
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '8pt',
                        border: '1.5px solid #000000',
                        marginBottom: '10px'
                      }}
                    >
                      <tbody>
                        {/* ROW 1: Area Under Audit & Report ID */}
                        <tr>
                          <td style={{ width: '50%', padding: '5px 8px', border: '1px solid #000000', verticalAlign: 'top' }}>
                            <div style={{ fontSize: '7.5pt', color: '#1e293b' }}>
                              Area yang diaudit / <em>Area under audit</em>:
                            </div>
                            <div style={{ fontSize: '9pt', fontWeight: 800, marginTop: '2px', color: '#000000' }}>
                              {activeFinding.targetName || currentVessel?.name || 'Armada Kapal'}
                            </div>
                          </td>
                          <td style={{ width: '50%', padding: '5px 8px', border: '1px solid #000000', verticalAlign: 'top' }}>
                            <div style={{ fontSize: '7.5pt', color: '#1e293b' }}>
                              No. Laporan / <em>Report ID</em>:
                            </div>
                            <div style={{ fontSize: '9pt', fontWeight: 800, marginTop: '2px', color: '#000000' }}>
                              {activeFinding.reportId || activeSession.reportId || '0859-PK/ISM-SMC/2026'}
                            </div>
                          </td>
                        </tr>

                        {/* ROW 2: Non-Conformity No. & Element Number of Code */}
                        <tr>
                          <td style={{ width: '50%', padding: '5px 8px', border: '1px solid #000000', verticalAlign: 'top' }}>
                            <div style={{ fontSize: '7.5pt', color: '#1e293b' }}>
                              No. Ketidaksesuaian / <em>Non-Conformity No.</em>:
                            </div>
                            <div style={{ fontSize: '9.5pt', fontWeight: 900, marginTop: '2px', color: '#0369a1' }}>
                              {activeFinding.findingNo}
                            </div>
                          </td>
                          <td style={{ width: '50%', padding: '5px 8px', border: '1px solid #000000', verticalAlign: 'top' }}>
                            <div style={{ fontSize: '7.5pt', color: '#1e293b' }}>
                              Nomor Elemen dari ISM Code / <em>Element Number of Code</em>:
                            </div>
                            <div style={{ fontSize: '9.5pt', fontWeight: 900, marginTop: '2px', color: '#000000' }}>
                              {activeFinding.clauseCode || activeFinding.elementNumberOfCode || '5.1.5'}
                              {activeFinding.clauseName && (
                                <span style={{ fontSize: '7.8pt', fontWeight: 600, color: '#475569', marginLeft: '6px' }}>
                                  — {activeFinding.clauseName}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* ROW 3: Details of Deficiency */}
                        <tr>
                          <td colSpan={2} style={{ padding: '8px 10px', border: '1px solid #000000', verticalAlign: 'top' }}>
                            <div style={{ fontSize: '8pt', fontWeight: 700, color: '#000000', marginBottom: '4px' }}>
                              Rincian Ketidaksesuaian / <em>Details of deficiency</em>:
                            </div>
                            <div style={{ minHeight: '55px', lineHeight: '1.45', fontSize: '8.5pt', color: '#0f172a' }}>
                              {activeFinding.description}
                            </div>
                            {activeFinding.objectiveEvidence && (
                              <div style={{ fontSize: '7.5pt', color: '#475569', marginTop: '4px', fontStyle: 'italic' }}>
                                Bukti Objektif: {activeFinding.objectiveEvidence}
                              </div>
                            )}

                            {/* Grade checkboxes */}
                            <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px dashed #94a3b8', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '7.5pt', fontWeight: 700 }}>Tingkat Ketidaksesuaian / <em>Grade of Deficiency</em>:</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '7.5pt' }}>
                                {activeFinding.category === 'Major NC' ? <CheckSquare size={13} color="#dc2626" /> : <Square size={13} />}
                                <span>Ketidaksesuaian Mayor / <em>Major Non-Conformity</em> (MNC)</span>
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '7.5pt' }}>
                                {activeFinding.category === 'Minor NC' ? <CheckSquare size={13} color="#0284c7" /> : <Square size={13} />}
                                <span style={{ fontWeight: activeFinding.category === 'Minor NC' ? 800 : 400 }}>
                                  Ketidaksesuaian / <em>Non-Conformity</em> (NC)
                                </span>
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '7.5pt' }}>
                                {activeFinding.category === 'Observation' ? <CheckSquare size={13} color="#059669" /> : <Square size={13} />}
                                <span>Observasi / <em>Observation</em> (OBS)</span>
                              </span>
                            </div>
                          </td>
                        </tr>

                        {/* ROW 4: Signatures after Deficiency Issued */}
                        <tr>
                          <td style={{ width: '50%', padding: '6px 8px', border: '1px solid #000000', verticalAlign: 'top' }}>
                            <div style={{ fontSize: '7.5pt', fontWeight: 700 }}>Auditor Kepala / <em>Lead Auditor</em>:</div>
                            <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ borderBottom: '1px solid #000000', padding: '2px 20px', fontStyle: 'italic', fontSize: '8pt' }}>
                                {activeFinding.auditor || activeSession.leadAuditor}
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.2pt', color: '#334155' }}>
                              <span>Nama: <strong>{activeFinding.auditor || activeSession.leadAuditor}</strong></span>
                              <span>Tgl: <strong>{formatIndoDate(activeFinding.dateIdentified)}</strong></span>
                            </div>
                          </td>
                          <td style={{ width: '50%', padding: '6px 8px', border: '1px solid #000000', verticalAlign: 'top' }}>
                            <div style={{ fontSize: '7.5pt', fontWeight: 700 }}>
                              Nakhoda/Perwakilan Perusahaan / <em>Master/Company's Rep</em>:
                            </div>
                            <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ borderBottom: '1px solid #000000', padding: '2px 20px', fontStyle: 'italic', fontSize: '8pt' }}>
                                {activeFinding.assignedTo || activeFinding.auditee || 'Capt. Ekhsan'}
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.2pt', color: '#334155' }}>
                              <span>Nama: <strong>{activeFinding.assignedTo || activeFinding.auditee || 'Capt. Ekhsan'}</strong></span>
                              <span>Tgl: <strong>{formatIndoDate(activeFinding.dateIdentified)}</strong></span>
                            </div>
                          </td>
                        </tr>

                        {/* ROW 5: SECTION 2 - Correction & Root Cause Analysis */}
                        <tr>
                          <td colSpan={2} style={{ padding: '8px 10px', border: '1.5px solid #000000', verticalAlign: 'top', background: '#fafafa' }}>
                            <div style={{ fontSize: '8pt', fontWeight: 800, color: '#000000', textTransform: 'uppercase', marginBottom: '6px', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px' }}>
                              TINDAKAN OLEH PERUSAHAAN / KAPAL (<em>ACTION BY COMPANY / SHIP</em>)
                            </div>

                            {/* Perbaikan / Correction */}
                            <div style={{ marginBottom: '8px' }}>
                              <div style={{ fontSize: '7.8pt', fontWeight: 700, color: '#000000' }}>
                                Perbaikan / <em>Correction</em>:
                              </div>
                              <div style={{ fontSize: '8.2pt', lineHeight: '1.4', marginTop: '2px', color: '#0f172a' }}>
                                {activeFinding.evidence?.correction ||
                                  activeFinding.correction ||
                                  activeFinding.evidence?.correctiveAction ||
                                  activeFinding.correctiveAction ||
                                  'Nakhoda telah melengkapi instruksi pengoperasian kapal dalam cuaca buruk pada formulir No. Dok. SMS/PBK-SOP/NAV-09 dan disosialisasikan kepada seluruh perwira jaga deck.'}
                              </div>
                            </div>

                            {/* Analisa Penyebab Masalah / Root cause analysis */}
                            <div>
                              <div style={{ fontSize: '7.8pt', fontWeight: 700, color: '#000000' }}>
                                Analisa Penyebab Masalah / <em>Root cause analysis</em>:
                              </div>
                              <div style={{ fontSize: '8.2pt', lineHeight: '1.4', marginTop: '2px', color: '#0f172a' }}>
                                {activeFinding.evidence?.rootCause ||
                                  activeFinding.evidence?.rootCauseAnalysis ||
                                  activeFinding.rootCause ||
                                  'Kurangnya pemahaman dan ketelitian personil dalam implementasi prosedur standar ISM Code.'}
                              </div>
                            </div>
                          </td>
                        </tr>

                        {/* ROW 6: SECTION 3 - Corrective Action & Agreed Date */}
                        <tr>
                          <td colSpan={2} style={{ padding: '8px 10px', border: '1.5px solid #000000', verticalAlign: 'top' }}>
                            <div style={{ fontSize: '7.8pt', fontWeight: 700, color: '#000000' }}>
                              Tindakan Korektif / <em>Corrective Action</em>:
                            </div>
                            <div style={{ fontSize: '8.2pt', lineHeight: '1.4', marginTop: '2px', color: '#0f172a' }}>
                              {activeFinding.evidence?.correctiveAction ||
                                activeFinding.correctiveAction ||
                                'Memastikan seluruh SOP dan instruksi kerja navigasi cuaca buruk telah terpasang di anjungan, dilakukan briefing rutin bulanan sebelum pelayaran, serta verifikasi oleh DPA saat inspeksi triwulan.'}
                            </div>

                            {(activeFinding.evidence?.preventiveAction || activeFinding.preventiveAction) && (
                              <div style={{ fontSize: '7.8pt', color: '#334155', marginTop: '4px' }}>
                                <strong>Tindakan Pencegahan: </strong>{activeFinding.evidence?.preventiveAction || activeFinding.preventiveAction}
                              </div>
                            )}

                            <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                              <div>
                                <span style={{ fontSize: '7.5pt', fontWeight: 700 }}>
                                  Tanggal penyelesaian yang disetujui / <em>Agreed date of completion</em>:
                                </span>
                                <span style={{ fontSize: '8.5pt', fontWeight: 800, marginLeft: '6px', color: '#0369a1' }}>
                                  {formatIndoDate(activeFinding.evidence?.agreedDate || activeFinding.agreedDate || activeFinding.dueDate)}
                                </span>
                                <span style={{ fontSize: '7pt', color: '#64748b', marginLeft: '6px' }}>
                                  (Maksimal 3 Bulan sejak tanggal audit)
                                </span>
                              </div>

                              {(activeFinding.evidence?.fileName || activeFinding.fileName) && (
                                <div style={{ fontSize: '7.2pt', color: '#047857', fontWeight: 700 }}>
                                  📎 Dokumen Eviden: {activeFinding.evidence?.fileName || activeFinding.fileName} {activeFinding.evidence?.fileSize ? `(${activeFinding.evidence.fileSize})` : ''}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* ROW 7: Signatures after CAP agreed */}
                        <tr>
                          <td style={{ width: '50%', padding: '6px 8px', border: '1px solid #000000', verticalAlign: 'top' }}>
                            <div style={{ fontSize: '7.5pt', fontWeight: 700 }}>Auditor Kepala / <em>Lead Auditor</em>:</div>
                            <div style={{ height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ borderBottom: '1px solid #000000', padding: '2px 20px', fontStyle: 'italic', fontSize: '8pt' }}>
                                {activeFinding.auditor || activeSession.leadAuditor}
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.2pt', color: '#334155' }}>
                              <span>Nama: <strong>{activeFinding.auditor || activeSession.leadAuditor}</strong></span>
                              <span>Tgl: <strong>{formatIndoDate(activeFinding.dateIdentified)}</strong></span>
                            </div>
                          </td>
                          <td style={{ width: '50%', padding: '6px 8px', border: '1px solid #000000', verticalAlign: 'top' }}>
                            <div style={{ fontSize: '7.5pt', fontWeight: 700 }}>
                              Nakhoda/Perwakilan Perusahaan / <em>Master/Company's Rep</em>:
                            </div>
                            <div style={{ height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ borderBottom: '1px solid #000000', padding: '2px 20px', fontStyle: 'italic', fontSize: '8pt' }}>
                                {activeFinding.evidence?.submittedBy || activeFinding.assignedTo || activeFinding.auditee || 'Capt. Ekhsan'}
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.2pt', color: '#334155' }}>
                              <span>Nama: <strong>{activeFinding.evidence?.submittedBy || activeFinding.assignedTo || activeFinding.auditee || 'Capt. Ekhsan'}</strong></span>
                              <span>Tgl: <strong>{formatIndoDate(activeFinding.evidence?.submissionDate || activeFinding.dateIdentified)}</strong></span>
                            </div>
                          </td>
                        </tr>

                        {/* ROW 8: SECTION 4 - Auditor Verification of Corrective Action */}
                        <tr>
                          <td colSpan={2} style={{ padding: '8px 10px', border: '1.5px solid #000000', verticalAlign: 'top', background: '#f0fdf4' }}>
                            <div style={{ fontSize: '8pt', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '6px', borderBottom: '1px solid #bbf7d0', paddingBottom: '3px' }}>
                              VERIFIKASI TINDAKAN PERBAIKAN OLEH AUDITOR (<em>AUDITOR VERIFICATION OF CORRECTIVE ACTION</em>)
                            </div>

                            <div style={{ fontSize: '8.2pt', lineHeight: '1.45', color: '#0f172a', marginBottom: '8px' }}>
                              {activeFinding.evidence?.auditorReviewNotes ||
                                activeFinding.auditorReviewNotes ||
                                (activeFinding.status === 'NC Close'
                                  ? 'Telah dilakukan verifikasi bukti dokumen SOP Navigasi dan tindakan perbaikan kapal. Tindakan dinilai efektif memenuhi klausul ISM Code.'
                                  : 'Dalam proses pemantauan dan penyelesaian tindakan perbaikan (CAPA).')}
                            </div>

                            {/* Verification Checkboxes */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '6px', borderTop: '1px dashed #86efac' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '7.5pt' }}>
                                {(activeFinding.evidence?.verifiedUpgradeDowngrade || activeFinding.verifiedUpgradeDowngrade) ? <CheckSquare size={13} color="#0369a1" /> : <Square size={13} />}
                                <span>Diturunkan / Dinaikkan tingkatnya (<em>Upgrade / Downgrade</em>): [ ] MNC [ ] NC</span>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '7.5pt' }}>
                                <span style={{ fontWeight: 800 }}>Memuaskan / <em>Satisfactory</em>:</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 800, color: '#15803d' }}>
                                  {(activeFinding.evidence?.verifiedSatisfactory !== false && activeFinding.verifiedSatisfactory !== false) ? <CheckSquare size={14} color="#15803d" /> : <Square size={13} />}
                                  <span>Ya / <em>Yes</em></span>
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#64748b' }}>
                                  {(activeFinding.evidence?.verifiedSatisfactory === false || activeFinding.verifiedSatisfactory === false) ? <CheckSquare size={14} color="#dc2626" /> : <Square size={13} />}
                                  <span>Tidak / <em>No</em></span>
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>

                        {/* ROW 9: Lead Auditor Closeout Sign */}
                        <tr>
                          <td colSpan={2} style={{ padding: '6px 10px', border: '1px solid #000000', verticalAlign: 'top', background: '#ffffff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                              <div>
                                <div style={{ fontSize: '7.5pt', fontWeight: 700 }}>Auditor Kepala / <em>Lead Auditor</em>:</div>
                                <div style={{ fontSize: '8.5pt', fontWeight: 900, color: '#000000', marginTop: '2px' }}>
                                  {activeFinding.evidence?.verifiedAuditor || activeFinding.verifiedAuditor || activeFinding.auditor || activeSession.leadAuditor}
                                </div>
                                <div style={{ fontSize: '6.8pt', color: '#64748b' }}>
                                  {isExternal ? appointedOrg : 'Auditor ISM PT. Pelayaran Baharimas Kalimantan'}
                                </div>
                              </div>

                              {(() => {
                                const isClose = activeFinding.status === 'NC Close';
                                const isSubmitted = activeFinding.status === 'Eviden Submitted';
                                const statusColor = isClose ? '#15803d' : isSubmitted ? '#0284c7' : '#d97706';
                                const statusBg = isClose ? '#f0fdf4' : isSubmitted ? '#f0f9ff' : '#fffbeb';
                                const statusText = isClose
                                  ? 'STATUS: NC CLOSED (TERVERIFIKASI & SELESAI)'
                                  : isSubmitted
                                  ? 'STATUS: EVIDEN SUBMITTED (MENUNGGU VERIFIKASI AUDITOR)'
                                  : 'STATUS: NC OPEN (DALAM PENGERJAAN CAPA OLEH NAKHODA)';

                                return (
                                  <div style={{ textAlign: 'center' }}>
                                    <div style={{ border: `1.5px solid ${statusColor}`, background: statusBg, borderRadius: '4px', padding: '3px 12px', color: statusColor, fontWeight: 800, fontSize: '7.2pt' }}>
                                      {statusText}
                                    </div>
                                  </div>
                                );
                              })()}

                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '7.5pt', color: '#334155' }}>Tanggal Verifikasi / <em>Verification Date</em>:</div>
                                <div style={{ fontSize: '8.5pt', fontWeight: 900, color: activeFinding.status === 'NC Close' ? '#15803d' : '#0369a1', marginTop: '2px' }}>
                                  {formatIndoDate(activeFinding.evidence?.closedDate || activeFinding.dateClosed || activeFinding.evidence?.submissionDate || officialCloseDate)}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
  );
};
