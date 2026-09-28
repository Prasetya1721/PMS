/**
 * ReportChecklistSection.jsx
 * Diekstrak dari AuditReportModal.jsx (baris 1359-1493).
 * Sumber: BAGIAN LAPORAN CHECKLIST
 */
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { BkiDocChecklistReport } from '../BkiDocChecklistReport';
import { BkiShipboardChecklistReport } from '../BkiShipboardChecklistReport';

export const ReportChecklistSection = ({
  activeSession,
  checklistConfig,
  currentVessel,
  institutionBranding,
  isBKI,
  reportChecklistItems,
  resolvedList,
  sessionFindings,
}) => {
  return (
    (isBKI || activeSession.auditType === 'Internal' || checklistConfig.organizationId === 'internal') ? (
                    activeSession.standard === 'DOC' ? (
                      <BkiDocChecklistReport
                        session={activeSession}
                        vessel={currentVessel}
                        liveChecklist={resolvedList}
                        findings={sessionFindings}
                      />
                    ) : (
                      <BkiShipboardChecklistReport
                        session={activeSession}
                        vessel={currentVessel}
                        liveChecklist={resolvedList}
                        findings={sessionFindings}
                      />
                    )
                  ) : (
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      {/* Notice Lembaga Non-BKI */}
                      <div style={{
                        padding: '6px 10px',
                        background: '#f0fdf4',
                        border: '1px solid #16a34a',
                        borderRadius: '4px',
                        marginBottom: '10px',
                        fontSize: '7.5pt',
                        color: '#166534',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <ShieldCheck size={16} color="#16a34a" />
                        <span>
                          <strong>Format Checklist {institutionBranding.shortName}:</strong> Pemeriksaan kelaiklautan dan keselamatan disesuaikan dengan standar regulasi {institutionBranding.authorityTag}.
                        </span>
                      </div>

                      {/* Tabel checklist Non-BKI */}
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '7.5pt', border: '1.5px solid #000000', marginBottom: '12px' }}>
                        <thead>
                          <tr style={{ background: '#f1f5f9' }}>
                            <th style={{ padding: '5px 4px', border: '1px solid #000000', width: '7%', textAlign: 'center', fontWeight: 800 }}>No.</th>
                            <th style={{ padding: '5px 8px', border: '1px solid #000000', width: '45%', textAlign: 'center', fontWeight: 800 }}>Butir Pemeriksaan / Clauses</th>
                            <th style={{ padding: '5px 4px', border: '1px solid #000000', width: '6%', textAlign: 'center', fontWeight: 800 }}>Yes</th>
                            <th style={{ padding: '5px 4px', border: '1px solid #000000', width: '6%', textAlign: 'center', fontWeight: 800 }}>No</th>
                            <th style={{ padding: '5px 4px', border: '1px solid #000000', width: '6%', textAlign: 'center', fontWeight: 800 }}>N/A</th>
                            <th style={{ padding: '5px 6px', border: '1px solid #000000', width: '22%', textAlign: 'center', fontWeight: 800 }}>Catatan / Remark</th>
                            <th style={{ padding: '5px 4px', border: '1px solid #000000', width: '8%', textAlign: 'center', fontWeight: 800 }}>Ref. ISM</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportChecklistItems.length === 0 ? (
                            <tr>
                              <td colSpan={7} style={{ padding: '25px 15px', border: '1px solid #000000', textAlign: 'center', color: '#64748b' }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>📋</div>
                                <div style={{ fontWeight: 800, fontSize: '8.5pt', marginBottom: '4px' }}>
                                  Belum Ada Butir Checklist Tersusun
                                </div>
                                <div style={{ fontSize: '7.5pt' }}>
                                  Lembaga <strong>{institutionBranding.name}</strong> tidak menggunakan template statis BKI. Butir pemeriksaan disusun melalui menu &quot;+ Tambah Item Manual&quot; pada form sesi audit.
                                </div>
                              </td>
                            </tr>
                          ) : (
                            reportChecklistItems.map((chk, idx) => {
                              const isStriked = Boolean(chk.isStrikethrough);
                              const resultVal = chk.result || chk.defaultResult || '';
                              const isYes = !isStriked && (resultVal === 'Yes' || resultVal === 'Complied');
                              const isNo = !isStriked && ['No', 'Major NC', 'Minor NC', 'Observation'].includes(resultVal);
                              const isNA = isStriked || resultVal === 'N/A';

                              return (
                                <tr key={chk.id || idx} style={{ background: isStriked ? '#fffbeb' : idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                                  <td style={{ padding: '4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 700 }}>
                                    {chk.code || chk.no || idx + 1}
                                  </td>
                                  <td style={{ padding: '4px 6px', border: '1px solid #000000', verticalAlign: 'top', lineHeight: 1.4 }}>
                                    <div style={{ fontWeight: 700 }}>{chk.name || chk.item}</div>
                                    {chk.checkPoint && chk.checkPoint !== chk.name && (
                                      <div style={{ fontSize: '6.8pt', color: '#475569', marginTop: '2px' }}>{chk.checkPoint}</div>
                                    )}
                                  </td>
                                  <td style={{ padding: '2px', border: '1px solid #000000', textAlign: 'center', verticalAlign: 'middle', fontSize: '11pt', fontWeight: 900 }}>
                                    {isYes ? '☒' : '☐'}
                                  </td>
                                  <td style={{ padding: '2px', border: '1px solid #000000', textAlign: 'center', verticalAlign: 'middle', fontSize: '11pt', fontWeight: 900, color: isNo ? '#dc2626' : undefined }}>
                                    {isNo ? '☒' : '☐'}
                                  </td>
                                  <td style={{ padding: '2px', border: '1px solid #000000', textAlign: 'center', verticalAlign: 'middle', fontSize: '11pt', fontWeight: 900, color: isNA ? '#64748b' : undefined }}>
                                    {isNA ? '☒' : '☐'}
                                  </td>
                                  <td style={{ padding: '4px 6px', border: '1px solid #000000', verticalAlign: 'top', fontSize: '7pt' }}>
                                    {chk.notes || chk.remark || '—'}
                                  </td>
                                  <td style={{ padding: '4px', border: '1px solid #000000', textAlign: 'center', verticalAlign: 'middle', fontWeight: 700 }}>
                                    {chk.ismCode || '—'}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>

                      {/* Signatures Non-BKI */}
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '7.5pt', marginTop: '12px', pageBreakInside: 'avoid' }}>
                        <tbody>
                          <tr>
                            <td style={{ width: '50%', padding: '6px', verticalAlign: 'top' }}>
                              <div style={{ fontWeight: 700, color: '#475569', marginBottom: '2px' }}>AUDITOR PELAKSANA:</div>
                              <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ borderBottom: '1px solid #000000', padding: '2px 25px', fontStyle: 'italic', fontWeight: 800 }}>
                                  {activeSession.leadAuditorSign || activeSession.leadAuditor}
                                </span>
                              </div>
                              <div style={{ fontWeight: 800 }}>{activeSession.leadAuditorSign || activeSession.leadAuditor}</div>
                              <div style={{ fontSize: '6.8pt', color: '#64748b' }}>{institutionBranding.authorityTag}</div>
                            </td>
                            <td style={{ width: '50%', padding: '6px', verticalAlign: 'top' }}>
                              <div style={{ fontWeight: 700, color: '#475569', marginBottom: '2px' }}>NAKHODA / AUDITEE:</div>
                              <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ borderBottom: '1px solid #000000', padding: '2px 25px', fontStyle: 'italic', fontWeight: 800 }}>
                                  {activeSession.auditeeSign || 'Capt. Ekhsan'}
                                </span>
                              </div>
                              <div style={{ fontWeight: 800 }}>{activeSession.auditeeSign || 'CAPT. EKHSAN'}</div>
                              <div style={{ fontSize: '6.8pt', color: '#64748b' }}>Master {activeSession.targetName || currentVessel?.name}</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )
  );
};
