/**
 * NotifAuditNCListCard.jsx
 * Diekstrak dari NotifTabAuditNC.jsx (baris 267-577).
 * Sumber: Daftar kartu temuan audit beserta rentang waktu NC, kanal notifikasi, dan tombol kirim
 */
import React from 'react';
import { ArrowRight, Building2, CheckCircle2, Clock, Printer, Send, ShieldAlert, Ship } from 'lucide-react';
import { calculateNCRange } from '../../../../utils/auditTimeUtils';

export const NotifAuditNCListCard = ({
  filteredAuditFindingsList,
  sendAuditWhatsAppNotification,
  setAuditNotifModalFinding,
  setAuditPrintFinding,
  setPMSActiveTab,
  setSelectedVesselId,
  theme,
  vessels,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {filteredAuditFindingsList.map(finding => {
                        const ncRange = calculateNCRange(finding);
                        const vessel = vessels.find(v => v.id === finding.vesselId);
                        const vesselDisplayName = finding.targetName || vessel?.name || 'Kantor Pusat PT. PBK';
                        const isDoc = !finding.vesselId || finding.standard === 'DOC';

                        return (
                          <div
                            key={finding.id}
                            className="glass-card"
                            style={{
                              padding: '1.25rem 1.4rem',
                              borderLeft: `5px solid ${ncRange.color}`,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.75rem',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {/* Top Metadata Row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                                {isDoc ? (
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.35rem',
                                      padding: '0.2rem 0.6rem',
                                      borderRadius: '6px',
                                      background: 'rgba(147, 51, 234, 0.15)',
                                      color: '#c084fc',
                                      fontSize: '0.75rem',
                                      fontWeight: 700
                                    }}
                                  >
                                    <Building2 size={13} />
                                    <span>DOC Kantor Pusat</span>
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.35rem',
                                      padding: '0.2rem 0.6rem',
                                      borderRadius: '6px',
                                      background: 'rgba(2, 132, 199, 0.15)',
                                      color: '#38bdf8',
                                      fontSize: '0.75rem',
                                      fontWeight: 700
                                    }}
                                  >
                                    <Ship size={13} />
                                    <span>{vesselDisplayName}</span>
                                  </span>
                                )}

                                <strong className="mono" style={{ fontSize: '0.92rem', fontWeight: 800 }}>
                                  {finding.findingNo || finding.code || 'NC-ISM'}
                                </strong>

                                <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                                  {finding.clauseCode || 'ISM'}: {finding.clauseName || 'Klausul ISM Code'}
                                </span>

                                <span
                                  className={`badge ${finding.category === 'Major NC' ? 'badge-danger' : finding.category === 'Minor NC' ? 'badge-warning' : 'badge-info'}`}
                                  style={{ fontSize: '0.72rem' }}
                                >
                                  {finding.category || 'Temuan'}
                                </span>
                              </div>

                              {/* Status Badge */}
                              <div>
                                {ncRange.isClosed ? (
                                  <span
                                    className="badge badge-success"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}
                                  >
                                    <CheckCircle2 size={14} />
                                    <span>NC CLOSE (Tuntas)</span>
                                  </span>
                                ) : ncRange.isSubmitted ? (
                                  <span
                                    className="badge badge-warning"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}
                                  >
                                    <Clock size={14} />
                                    <span>Eviden Submitted</span>
                                  </span>
                                ) : (
                                  <span
                                    className="badge badge-danger"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.35rem',
                                      fontSize: '0.78rem',
                                      padding: '0.3rem 0.75rem',
                                      animation: ncRange.isOverdue ? 'pulse 1.8s infinite' : 'none'
                                    }}
                                  >
                                    <ShieldAlert size={14} />
                                    <span>{ncRange.isOverdue ? 'NC OPEN (OVERDUE)' : 'NC OPEN'}</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Description & Evidence snippet */}
                            <div>
                              <p style={{ fontSize: '0.88rem', fontWeight: 500, lineHeight: 1.5, margin: 0 }}>
                                {finding.description}
                              </p>
                              {finding.objectiveEvidence && (
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontStyle: 'italic', margin: '0.35rem 0 0 0' }}>
                                  Bukti Objektif: {finding.objectiveEvidence}
                                </p>
                              )}
                            </div>

                            {/* RENTANG WAKTU (TIMELINE & PROGRESS BAR) */}
                            <div
                              style={{
                                background: theme === 'light' ? '#f8fafc' : 'rgba(15, 23, 42, 0.65)',
                                border: `1px solid ${ncRange.borderColor}`,
                                borderRadius: '10px',
                                padding: '0.85rem 1.1rem'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.55rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', fontWeight: 700 }}>
                                  <Clock size={15} color={ncRange.color} />
                                  <span>Rentang Waktu ISM:</span>
                                  <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>
                                    {ncRange.openDateStr} s/d {ncRange.isClosed ? ncRange.closedDateStr : ncRange.dueDateStr}
                                  </span>
                                </div>
                                <span className={`badge ${ncRange.badgeClass}`} style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                                  {ncRange.badgeText}
                                </span>
                              </div>

                              {/* Visual Timeline Bar */}
                              <div style={{ marginBottom: '0.55rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                  <span>Ditemukan: {ncRange.openDateStr}</span>
                                  {ncRange.isClosed ? (
                                    <span style={{ color: '#10b981', fontWeight: 600 }}>
                                      Selesai: {ncRange.closedDateStr} ({ncRange.resolutionDays} Hari)
                                    </span>
                                  ) : (
                                    <span style={{ color: ncRange.isOverdue ? '#ef4444' : '#f59e0b', fontWeight: 600 }}>
                                      Target Batas: {ncRange.dueDateStr} {ncRange.isOverdue ? `(Overdue ${Math.abs(ncRange.remainingDays)}h)` : `(Sisa ${ncRange.remainingDays}h)`}
                                    </span>
                                  )}
                                </div>
                                <div style={{ width: '100%', height: '8px', background: theme === 'light' ? '#e2e8f0' : 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                  <div
                                    style={{
                                      width: `${ncRange.percentUsed}%`,
                                      height: '100%',
                                      borderRadius: '4px',
                                      background: ncRange.isClosed
                                        ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                                        : ncRange.isOverdue
                                        ? 'linear-gradient(90deg, #f87171 0%, #ef4444 100%)'
                                        : 'linear-gradient(90deg, #0284c7 0%, #f59e0b 100%)',
                                      transition: 'width 0.4s ease'
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Timeline Detail Metrics */}
                              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.78rem' }}>
                                {ncRange.isClosed ? (
                                  <>
                                    <span style={{ color: 'var(--text-muted)' }}>
                                      ⏱️ Total Rentang Waktu: <strong style={{ color: '#10b981' }}>{ncRange.resolutionDays} Hari Kalender</strong>
                                    </span>
                                    <span style={{ color: 'var(--text-muted)' }}>
                                      🎯 Kinerja Target: <strong style={{ color: ncRange.isAheadOfSchedule ? '#10b981' : '#f59e0b' }}>{ncRange.varianceText}</strong>
                                    </span>
                                    <span style={{ color: 'var(--text-muted)' }}>
                                      🛡️ Auditor: <strong style={{ color: 'var(--text-main)' }}>{finding.auditor || 'DPA PT. PBK'}</strong>
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span style={{ color: 'var(--text-muted)' }}>
                                      ⏱️ Hari Aktif Berjalan: <strong style={{ color: 'var(--text-main)' }}>{ncRange.activeDays} Hari</strong>
                                    </span>
                                    <span style={{ color: 'var(--text-muted)' }}>
                                      ⏳ Sisa Waktu CAP: <strong style={{ color: ncRange.isOverdue ? '#ef4444' : '#38bdf8' }}>
                                        {ncRange.isOverdue ? `Melewati batas ${Math.abs(ncRange.remainingDays)} Hari!` : `${ncRange.remainingDays} Hari Lagi`}
                                      </strong>
                                    </span>
                                    <span style={{ color: 'var(--text-muted)' }}>
                                      👤 PIC: <strong style={{ color: 'var(--text-main)' }}>{finding.assignedTo || 'Nakhoda & KKM'}</strong>
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* ACTION BUTTONS: WhatsApp & Navigation */}
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '0.75rem',
                                paddingTop: '0.5rem',
                                borderTop: '1px solid var(--border-subtle)'
                              }}
                            >
                              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                {/* Interactive WhatsApp Sender Modal */}
                                <button
                                  type="button"
                                  onClick={() => setAuditNotifModalFinding(finding)}
                                  className="btn btn-whatsapp btn-sm"
                                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                  title="Buka dialog notifikasi WhatsApp dengan pemilihan penerima dan preview pesan"
                                >
                                  <Send size={14} />
                                  <span>Notifikasi WA ({ncRange.isClosed ? 'NC Close' : 'NC Open'})</span>
                                </button>

                                {/* Fast Quick Dispatch Buttons */}
                                {ncRange.isOpen || ncRange.isSubmitted ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => sendAuditWhatsAppNotification(finding, 'audit_nc_open', { recipientRole: 'Nakhoda Kapal' })}
                                      className="btn btn-secondary btn-sm"
                                      style={{ fontSize: '0.75rem' }}
                                      title="Kirim peringatan cepat ke Nakhoda via WhatsApp"
                                    >
                                      WA Nakhoda
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => sendAuditWhatsAppNotification(finding, 'audit_nc_open', { recipientRole: 'Kepala Kamar Mesin (KKM)' })}
                                      className="btn btn-secondary btn-sm"
                                      style={{ fontSize: '0.75rem' }}
                                      title="Kirim peringatan cepat ke KKM via WhatsApp"
                                    >
                                      WA KKM
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => setAuditPrintFinding(finding)}
                                      className="btn btn-secondary btn-sm"
                                      style={{ fontSize: '0.75rem', color: '#0284c7', borderColor: 'rgba(2, 132, 199, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700 }}
                                      title="Cetak Laporan Penutupan NC Resmi Sesuai Standar ISM Code (NCR Close-Out Form)"
                                    >
                                      <Printer size={13} color="#0284c7" />
                                      <span>🖨️ Cetak Laporan NC Close</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => sendAuditWhatsAppNotification(finding, 'audit_nc_close', { recipientRole: 'Designated Person Ashore (DPA)' })}
                                      className="btn btn-secondary btn-sm"
                                      style={{ fontSize: '0.75rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}
                                      title="Kirim konfirmasi penutupan resmi ke DPA"
                                    >
                                      WA DPA
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => sendAuditWhatsAppNotification(finding, 'audit_nc_close', { recipientRole: 'Nakhoda Kapal' })}
                                      className="btn btn-secondary btn-sm"
                                      style={{ fontSize: '0.75rem' }}
                                      title="Kirim konfirmasi ke Nakhoda bahwa NC telah Close"
                                    >
                                      WA Nakhoda
                                    </button>
                                  </>
                                )}
                              </div>

                              {/* Direct jump to Audit Portal */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (finding.vesselId) {
                                    setSelectedVesselId(finding.vesselId);
                                  }
                                  setPMSActiveTab('audit');
                                }}
                                className="btn btn-secondary btn-sm"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}
                                title="Buka menu Manajemen Audit kapal untuk melihat eviden lengkap"
                              >
                                <span>Buka di Audit Portal</span>
                                <ArrowRight size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
  );
};
