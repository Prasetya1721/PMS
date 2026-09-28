/**
 * FindingsTab.jsx
 * Diekstrak dari AuditManager.jsx (baris 2733-3104).
 * Sumber: TAB 1: TEMUAN NC KAPAL INI
 */
import React from 'react';
import { CheckCircle2, Clock, Edit, MessageSquare, Plus, Printer, Trash2, Upload } from 'lucide-react';
import { calculateNCRange, formatIndoDate } from '../../../utils/auditTimeUtils';

export const FindingsTab = ({
  activeSession,
  allAudits,
  currentTarget,
  currentTargetFilteredFindings,
  deleteAuditFinding,
  getEnrichedReportSession,
  inVesselSearch,
  isAuditorOrDPA,
  setDeleteConfirmModal,
  setEditingFinding,
  setEvidenceModalOpen,
  setEvidenceTargetFinding,
  setFindingDefaultAuditId,
  setFindingModalOpen,
  setInVesselSearch,
  setNotificationModalFinding,
  setReportModalFinding,
  setReportModalMode,
  setReportModalOpen,
  setReportModalSession,
  setSeverityFilter,
  setStatusFilter,
  severityFilter,
  statusFilter,
}) => (
<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    {/* Filter Row inside findings */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`btn btn-sm ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.75rem' }}
        >
          Semua ({currentTarget.findings.length})
        </button>
        <button
          onClick={() => setStatusFilter('NC Open')}
          className={`btn btn-sm ${statusFilter === 'NC Open' ? 'btn-danger' : 'btn-secondary'}`}
          style={{ fontSize: '0.75rem', fontWeight: 700 }}
        >
          🚨 NC Open ({currentTarget.openNC})
        </button>
        <button
          onClick={() => setStatusFilter('Eviden Submitted')}
          className={`btn btn-sm ${statusFilter === 'Eviden Submitted' ? 'btn-warning' : 'btn-secondary'}`}
          style={{ fontSize: '0.75rem' }}
        >
          ⏳ Menunggu Eviden ({currentTarget.submittedNC})
        </button>
        <button
          onClick={() => setStatusFilter('NC Close')}
          className={`btn btn-sm ${statusFilter === 'NC Close' ? 'btn-success' : 'btn-secondary'}`}
          style={{ fontSize: '0.75rem' }}
        >
          ✅ NC Close ({currentTarget.closedNC})
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="select-control"
          style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
        >
          <option value="ALL">Semua Severity</option>
          <option value="Major NC">Major NC</option>
          <option value="Minor NC">Minor NC</option>
          <option value="Observation">Observasi</option>
        </select>

        <input
          type="text"
          value={inVesselSearch}
          onChange={(e) => setInVesselSearch(e.target.value)}
          placeholder="Cari klausul / temuan..."
          className="input-control"
          style={{ width: '180px', fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
        />

        {isAuditorOrDPA && (
          <button
            type="button"
            onClick={() => {
              setEditingFinding(null);
              setFindingDefaultAuditId(activeSession?.id || currentTarget.lastAudit?.id || null);
              setFindingModalOpen(true);
            }}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700 }}
            title="Catat temuan ketidaksesuaian baru untuk kapal ini"
          >
            <Plus size={14} />
            <span>Catat Temuan NC</span>
          </button>
        )}
      </div>
    </div>

    {/* Findings List */}
    {currentTargetFilteredFindings.length > 0 ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {currentTargetFilteredFindings.map(f => {
          const isOpen = f.status === 'NC Open';
          const isSubmitted = f.status === 'Eviden Submitted';
          const isClosed = f.status === 'NC Close';

          return (
            <div
              key={f.id}
              className={`audit-finding-item ${isOpen ? 'status-open' : isSubmitted ? 'status-submitted' : 'status-closed'}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span className="mono" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {f.findingNo}
                  </span>
                  <span className={`badge ${
                    f.category === 'Major NC' ? 'badge-danger' : f.category === 'Minor NC' ? 'badge-warning' : 'badge-info'
                  }`}>
                    {f.category}
                  </span>
                  <span className={`badge ${
                    isOpen ? 'badge-danger-pulse' : isSubmitted ? 'badge-warning' : 'badge-success'
                  }`}>
                    {f.status}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  {/* Evidence / Action Button */}
                  <button
                    onClick={() => {
                      setEvidenceTargetFinding(f);
                      setEvidenceModalOpen(true);
                    }}
                    className={`btn btn-sm ${isOpen ? 'btn-primary' : isSubmitted ? 'btn-warning' : 'btn-secondary'}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700 }}
                  >
                    <Upload size={13} />
                    <span>{isClosed ? 'Lihat Eviden Closing' : isSubmitted ? 'Tinjau Eviden' : 'Ajukan Eviden (CAP)'}</span>
                  </button>

                  {/* WhatsApp Notification Button */}
                  <button
                    onClick={() => setNotificationModalFinding(f)}
                    className="btn btn-secondary btn-sm"
                    title={isOpen ? 'Kirim Notifikasi WA (NC Open)' : 'Kirim Notifikasi WA (NC Close)'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.72rem',
                      color: '#16a34a',
                      fontWeight: 700,
                      padding: '0.35rem 0.55rem'
                    }}
                  >
                    <MessageSquare size={13} color="#22c55e" />
                    <span>Notif WA</span>
                  </button>

                  {/* Official Print Report Button */}
                  <button
                    onClick={() => {
                      const relatedSession = allAudits?.find(a => a.id === f.auditId || a.auditNo === f.auditNo) || activeSession || currentTarget?.lastAudit;
                      setReportModalSession(getEnrichedReportSession(relatedSession));
                      setReportModalFinding(f);
                      setReportModalMode('ncr');
                      setReportModalOpen(true);
                    }}
                    className="btn btn-secondary btn-sm"
                    title={isClosed ? 'Cetak Lembar Verifikasi Penutupan NC Resmi (NCR Close-Out Form)' : 'Cetak Laporan Temuan & Rencana Koreksi (CAP)'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.72rem',
                      color: isClosed ? '#0284c7' : 'var(--text-main)',
                      fontWeight: 700,
                      padding: '0.35rem 0.55rem'
                    }}
                  >
                    <Printer size={13} color={isClosed ? '#0284c7' : 'currentColor'} />
                    <span>{isClosed ? 'Cetak NCR Close' : 'Cetak NCR'}</span>
                  </button>

                  {isAuditorOrDPA && (
                    <>
                      <button
                        onClick={() => {
                          setEditingFinding(f);
                          setFindingModalOpen(true);
                        }}
                        className="btn btn-secondary btn-sm"
                        title="Edit Temuan"
                        style={{ padding: '0.35rem 0.5rem' }}
                      >
                        <Edit size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmModal({
                            type: 'finding',
                            id: f.id || f.findingNo,
                            code: f.findingNo,
                            title: 'Hapus Catatan Temuan (NCR)',
                            targetName: currentTarget?.name,
                            details: `Catatan temuan ketidaksesuaian "${f.findingNo}" (${f.category}) akan dihapus permanen dari sistem beserta dokumen eviden yang terlampir.`,
                            onConfirm: () => {
                              deleteAuditFinding(f.id || f.findingNo);
                              setDeleteConfirmModal(null);
                            }
                          });
                        }}
                        className="btn btn-secondary btn-sm"
                        title="Hapus Temuan Ini"
                        style={{ padding: '0.35rem 0.5rem', color: '#ef4444' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Finding Content */}
              <div>
                <div style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Klausul {f.clauseCode}: {f.clauseName}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                  {f.description}
                </p>
                {f.objectiveEvidence && (
                  <div style={{
                    marginTop: '0.45rem',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '6px',
                    background: 'var(--bg-surface-elevated)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)'
                  }}>
                    <strong>Bukti Objektif: </strong>{f.objectiveEvidence}
                  </div>
                )}
              </div>

              {/* TIMELINE RENTANG WAKTU NC OPEN / NC CLOSE */}
              {(() => {
                const ncRange = calculateNCRange(f);
                if (!ncRange) return null;

                return (
                  <div style={{
                    margin: '0.45rem 0',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    background: ncRange.bgLight,
                    border: `1px solid ${ncRange.borderColor}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem'
                  }}>
                    {/* Header Rentang */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.76rem', fontWeight: 700 }}>
                        {ncRange.isClosed ? (
                          <>
                            <CheckCircle2 size={15} color="#10b981" />
                            <span style={{ color: '#10b981' }}>RENTANG WAKTU PENUTUPAN (NC CLOSE)</span>
                          </>
                        ) : (
                          <>
                            <Clock size={15} color={ncRange.color} />
                            <span style={{ color: ncRange.color }}>
                              RENTANG WAKTU AKTIF ({ncRange.isSubmitted ? 'EVIDEN DITINJAU' : 'NC OPEN'})
                            </span>
                          </>
                        )}
                      </div>
                      <span className={`badge ${ncRange.badgeClass}`} style={{ fontSize: '0.7rem', fontWeight: 800 }}>
                        {ncRange.badgeText}
                      </span>
                    </div>

                    {/* Progress Bar Timeline */}
                    <div style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      background: 'rgba(255, 255, 255, 0.15)',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: `${ncRange.percentUsed}%`,
                        height: '100%',
                        background: ncRange.color,
                        borderRadius: '3px',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>

                    {/* Date markers & variance info */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)'
                    }}>
                      <div>
                        <span>Tgl Identifikasi (Open): </span>
                        <strong style={{ color: 'var(--text-main)' }}>{ncRange.openDateStr}</strong>
                      </div>

                      {ncRange.isClosed ? (
                        <>
                          <div>
                            <span>Tgl Penutupan Resmi (Close): </span>
                            <strong style={{ color: '#10b981' }}>{ncRange.closedDateStr}</strong>
                          </div>
                          <div style={{ color: ncRange.isAheadOfSchedule ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                            ⚡ {ncRange.varianceText} (Total: {ncRange.resolutionDays} Hari)
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <span>Target Batas Close (Due Date): </span>
                            <strong style={{ color: ncRange.isOverdue ? '#ef4444' : 'var(--text-main)' }}>
                              {ncRange.dueDateStr}
                            </strong>
                          </div>
                          <div style={{ color: ncRange.color, fontWeight: 700 }}>
                            {ncRange.isOverdue
                              ? `🚨 Terlambat ${Math.abs(ncRange.remainingDays)} hari dari target awal`
                              : `⏳ Telah berjalan ${ncRange.activeDays} dari alokasi ${ncRange.totalAllocatedDays} hari`}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Finding Footer Metas */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                paddingTop: '0.5rem',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.72rem',
                color: 'var(--text-muted)'
              }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span>PIC: <strong style={{ color: 'var(--text-main)' }}>{f.assignedTo || 'PIC Kapal'}</strong></span>
                  <span>Auditor: <strong>{f.auditor}</strong></span>
                  <span>Tgl Audit: {formatIndoDate(f.dateIdentified)}</span>
                  <span>Batas Waktu: <strong style={{ color: isOpen ? '#ef4444' : 'inherit' }}>{formatIndoDate(f.dueDate)}</strong></span>
                </div>
                {f.linkedCertificateTitle && (
                  <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                    📄 {f.linkedCertificateTitle}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="glass-card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
        <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 0.65rem' }} />
        <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Tidak ada temuan ketidaksesuaian</h4>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          {statusFilter !== 'ALL'
            ? `Tidak ada temuan dengan status "${statusFilter}".`
            : `Seluruh parameter kepatuhan pada ${currentTarget.name} terpenuhi.`}
        </p>
      </div>
    )}
  </div>
);
