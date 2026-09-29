/**
 * NotifTabAuditNC.jsx
 * Diekstrak dari NotificationCenter.jsx (baris 1978-2530).
 * Sumber: Tab 5: audit ISM NC open & close notification center
 */
import React from 'react';
import { ArrowRight, Building2, CheckCircle2, Clock, FileCheck, Printer, Search, Send, ShieldAlert, Ship, X } from 'lucide-react';
import { calculateNCRange } from '../../../utils/auditTimeUtils';

export const NotifTabAuditNC = ({
  allFindings,
  auditFilterStatus,
  auditFleetStats,
  auditSearchQuery,
  auditVesselFilter,
  filteredAuditFindingsList,
  sendAuditWhatsAppNotification,
  setAuditFilterStatus,
  setAuditNotifModalFinding,
  setAuditPrintFinding,
  setAuditSearchQuery,
  setAuditVesselFilter,
  setPMSActiveTab,
  setSelectedVesselId,
  theme,
  vessels,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Top KPI Cards for Audit NC */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div
                  className="glass-card"
                  style={{
                    padding: '1rem 1.25rem',
                    borderLeft: '4px solid #0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(2, 132, 199, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
                    <FileCheck size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Temuan Audit ISM</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{allFindings.length}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>SMC Kapal & DOC Kantor</div>
                  </div>
                </div>

                <div
                  className="glass-card"
                  style={{
                    padding: '1rem 1.25rem',
                    borderLeft: '4px solid #ef4444',
                    background: auditFleetStats.overdueCount > 0 ? 'rgba(239, 68, 68, 0.08)' : undefined,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                    <ShieldAlert size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NC OPEN (Tindakan Diperlukan)</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444' }}>
                      {auditFleetStats.openCount}
                      {auditFleetStats.overdueCount > 0 && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, marginLeft: '0.4rem', color: '#ef4444' }}>
                          ({auditFleetStats.overdueCount} Overdue!)
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {auditFleetStats.minDaysLeft !== null
                        ? auditFleetStats.minDaysLeft < 0
                          ? `🚨 Overdue ${Math.abs(auditFleetStats.minDaysLeft)} hari`
                          : `⏳ Deadline terdekat: ${auditFleetStats.minDaysLeft} hari`
                        : 'Tidak ada NC open aktif'}
                    </div>
                  </div>
                </div>

                <div
                  className="glass-card"
                  style={{
                    padding: '1rem 1.25rem',
                    borderLeft: '4px solid #f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Eviden Terkirim (Review)</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>
                      {allFindings.filter(f => f.status === 'Eviden Submitted').length}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Menunggu Verifikasi DPA</div>
                  </div>
                </div>

                <div
                  className="glass-card"
                  style={{
                    padding: '1rem 1.25rem',
                    borderLeft: '4px solid #10b981',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NC CLOSE (Terselesaikan)</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
                      {auditFleetStats.closedCount}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
                      ⏱️ Rata-rata Rentang: {auditFleetStats.avgResolutionDays} Hari
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div
                className="glass-card"
                style={{
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {/* Status Filter Pills */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginRight: '0.3rem' }}>
                      Status NC:
                    </span>
                    <button
                      type="button"
                      onClick={() => setAuditFilterStatus('all')}
                      className={`btn btn-sm ${auditFilterStatus === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      Semua ({allFindings.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuditFilterStatus('open')}
                      className={`btn btn-sm ${auditFilterStatus === 'open' ? 'btn-danger' : 'btn-secondary'}`}
                      style={auditFilterStatus === 'open' ? { background: '#ef4444' } : {}}
                    >
                      🚨 NC Open ({allFindings.filter(f => f.status === 'NC Open').length})
                    </button>
                    {auditFleetStats.overdueCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setAuditFilterStatus('overdue')}
                        className={`btn btn-sm ${auditFilterStatus === 'overdue' ? 'btn-danger' : 'btn-secondary'}`}
                        style={auditFilterStatus === 'overdue' ? { background: '#b91c1c' } : { color: '#ef4444' }}
                      >
                        ⚠️ Overdue Target ({auditFleetStats.overdueCount})
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setAuditFilterStatus('submitted')}
                      className={`btn btn-sm ${auditFilterStatus === 'submitted' ? 'btn-warning' : 'btn-secondary'}`}
                      style={auditFilterStatus === 'submitted' ? { background: '#f59e0b' } : {}}
                    >
                      ⏳ Eviden Review ({allFindings.filter(f => f.status === 'Eviden Submitted').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuditFilterStatus('closed')}
                      className={`btn btn-sm ${auditFilterStatus === 'closed' ? 'btn-success' : 'btn-secondary'}`}
                      style={auditFilterStatus === 'closed' ? { background: '#10b981' } : {}}
                    >
                      ✅ NC Close ({allFindings.filter(f => f.status === 'NC Close').length})
                    </button>
                  </div>

                  {/* Vessel Selector Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Kapal / Target:</span>
                    <select
                      value={auditVesselFilter}
                      onChange={(e) => setAuditVesselFilter(e.target.value)}
                      className="input-control"
                      style={{ width: '180px', padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                    >
                      <option value="all">Semua Armada & Kantor</option>
                      <option value="office">🏢 Kantor Pusat (DOC)</option>
                      {vessels.map(v => (
                        <option key={v.id} value={v.id}>🚢 {v.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Search Input */}
                <div style={{ position: 'relative' }}>
                  <Search
                    size={15}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    placeholder="Cari nomor temuan, klausul ISM, deskripsi ketidaksesuaian, atau nama kapal..."
                    value={auditSearchQuery}
                    onChange={(e) => setAuditSearchQuery(e.target.value)}
                    className="input-control"
                    style={{ paddingLeft: '2.4rem', fontSize: '0.85rem' }}
                  />
                  {auditSearchQuery && (
                    <button
                      onClick={() => setAuditSearchQuery('')}
                      style={{
                        position: 'absolute',
                        right: '0.8rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>

              {/* List of Finding Notification Cards */}
              {filteredAuditFindingsList.length === 0 ? (
                <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                  <CheckCircle2 size={42} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    Tidak Ada Temuan Audit Sesuai Kriteria
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1rem auto' }}>
                    Semua temuan audit ISM Code telah terverifikasi dan memenuhi standar kepatuhan maritim PT. Pelayaran Baharimas Kalimantan.
                  </p>
                  <button
                    onClick={() => {
                      setAuditFilterStatus('all');
                      setAuditVesselFilter('all');
                      setAuditSearchQuery('');
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
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
              )}
            </div>
  );
};
