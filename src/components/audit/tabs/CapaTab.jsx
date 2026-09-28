/**
 * CapaTab.jsx
 * Diekstrak dari AuditManager.jsx (baris 4299-4662).
 * Sumber: TAB 4: BUKTI & CAPA (TAHAP 4 LIFECYCLE AUDIT)
 */
import React from 'react';
import { CheckCircle2, Clock, MessageSquare, Printer, Upload } from 'lucide-react';
import { calculateNCRange, formatIndoDate } from '../../../utils/auditTimeUtils';

export const CapaTab = ({
  activeSession,
  auditRolePerspective,
  capaFilter,
  closeAuditFinding,
  currentTarget,
  currentUser,
  getEnrichedReportSession,
  isAuditorOrDPA,
  setCapaFilter,
  setEvidenceModalOpen,
  setEvidenceTargetFinding,
  setNotificationModalFinding,
  setReportModalFinding,
  setReportModalMode,
  setReportModalOpen,
  setReportModalSession,
  showToast,
}) => (
<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    {/* Header & Print Action */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
      <div>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Upload size={18} color="#0284c7" />
          <span>Tahap 4: Tindakan Korektif & Verifikasi Bukti (CAPA)</span>
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Monitoring tindakan koreksi fisik, analisis akar masalah (Root Cause), serta validasi dokumen eviden sebelum status temuan ditutup resmi.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => {
            const targetFinding = currentTarget.findings.find(f => f.status === 'Eviden Submitted') || currentTarget.findings[0] || null;
            setReportModalSession(getEnrichedReportSession(activeSession || currentTarget.lastAudit));
            setReportModalFinding(targetFinding);
            setReportModalMode('ncr');
            setReportModalOpen(true);
          }}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#0284c7' }}
          title="Cetak Formulir NCR Perbaikan Resmi BKI F23.14.07 format PDF"
        >
          <Printer size={14} />
          <span>Cetak Form NCR (PDF)</span>
        </button>
      </div>
    </div>

    {/* Metric Statistics Cards */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
      gap: '0.65rem'
    }}>
      <div className="glass-card" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL TEMUAN</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '0.15rem' }}>
          {currentTarget.findings.length}
        </div>
      </div>
      <div className="glass-card" style={{ padding: '0.75rem 1rem', borderLeft: '3px solid #ef4444' }}>
        <div style={{ fontSize: '0.68rem', color: '#ef4444', fontWeight: 700 }}>PERLU TINDAKAN (OPEN)</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ef4444', marginTop: '0.15rem' }}>
          {currentTarget.openNC}
        </div>
      </div>
      <div className="glass-card" style={{ padding: '0.75rem 1rem', borderLeft: '3px solid #f59e0b' }}>
        <div style={{ fontSize: '0.68rem', color: '#f59e0b', fontWeight: 700 }}>SIAP VERIFIKASI (REVIEW)</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f59e0b', marginTop: '0.15rem' }}>
          {currentTarget.submittedNC}
        </div>
      </div>
      <div className="glass-card" style={{ padding: '0.75rem 1rem', borderLeft: '3px solid #10b981' }}>
        <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700 }}>TUNTAS (CLOSED)</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10b981', marginTop: '0.15rem' }}>
          {currentTarget.closedNC}
        </div>
      </div>
      <div className="glass-card" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>CLOSURE RATE</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0284c7', marginTop: '0.15rem' }}>
          {currentTarget.findings.length > 0 ? Math.round((currentTarget.closedNC / currentTarget.findings.length) * 100) : 100}%
        </div>
      </div>
    </div>

    {/* Sub-Filters */}
    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
      {[
        { id: 'ALL', label: `Semua Temuan (${currentTarget.findings.length})` },
        { id: 'SUBMITTED', label: `Siap Diverifikasi (${currentTarget.submittedNC})` },
        { id: 'OPEN', label: `Perlu Tindakan PIC (${currentTarget.openNC})` },
        { id: 'CLOSED', label: `Sudah Ditutup (${currentTarget.closedNC})` }
      ].map(flt => (
        <button
          key={flt.id}
          type="button"
          onClick={() => setCapaFilter(flt.id)}
          className={`btn btn-sm ${capaFilter === flt.id ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem' }}
        >
          {flt.label}
        </button>
      ))}
    </div>

    {/* Findings CAPA List */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {currentTarget.findings
        .filter(f => {
          if (capaFilter === 'SUBMITTED') return f.status === 'Eviden Submitted';
          if (capaFilter === 'OPEN') return f.status === 'NC Open';
          if (capaFilter === 'CLOSED') return f.status === 'NC Close';
          return true;
        })
        .map(f => {
          const ncRange = calculateNCRange(f);
          const isClosed = f.status === 'NC Close';
          const isSubmitted = f.status === 'Eviden Submitted';

          return (
            <div
              key={f.id}
              className="glass-card"
              style={{
                padding: '1.15rem',
                borderRadius: '10px',
                border: isClosed ? '1px solid rgba(16, 185, 129, 0.3)' : isSubmitted ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-subtle)',
                background: isClosed ? 'rgba(16, 185, 129, 0.02)' : isSubmitted ? 'rgba(245, 158, 11, 0.02)' : 'var(--bg-surface-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              {/* Header Temuan */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="mono" style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0284c7' }}>
                    {f.findingNo || `NC-${f.id.slice(-4)}`}
                  </span>
                  <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                    Klausul {f.clauseCode || f.elementNumberOfCode || '-'}
                  </span>
                  <span className={`badge ${
                    f.category === 'Major NC' ? 'badge-danger-pulse' : f.category === 'Observation' ? 'badge-info' : 'badge-warning'
                  }`} style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                    {f.category}
                  </span>
                  <span className={`badge ${
                    isClosed ? 'badge-success' : isSubmitted ? 'badge-info' : 'badge-danger'
                  }`} style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                    {f.status}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {ncRange && (
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: ncRange.isClosed ? '#10b981' : ncRange.isOverdue ? '#ef4444' : '#f59e0b' }}>
                      {ncRange.statusText}
                    </span>
                  )}
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Due: {f.dueDate || '-'}
                  </span>
                </div>
              </div>

              {/* Judul & Deskripsi Temuan */}
              <div>
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                  {f.clauseName || f.standard}
                </div>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  {f.description}
                </p>
                {f.objectiveEvidence && (
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic', marginTop: '0.25rem' }}>
                    <strong>Bukti Objektif:</strong> {f.objectiveEvidence}
                  </div>
                )}
              </div>

              {/* 3 Box CAPA: Akar Masalah, Tindakan Korektif, Tindakan Pencegahan */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '0.65rem',
                background: 'var(--bg-surface-elevated)',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)'
              }}>
                {/* Akar Masalah */}
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.2rem', textTransform: 'uppercase' }}>
                    🔍 Akar Masalah (Root Cause)
                  </div>
                  <div style={{ fontSize: '0.73rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                    {f.evidence?.rootCause || f.rootCause || (
                      <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Belum diidentifikasi oleh PIC</span>
                    )}
                  </div>
                </div>

                {/* Koreksi Langsung */}
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#0284c7', marginBottom: '0.2rem', textTransform: 'uppercase' }}>
                    🛠️ Tindakan Koreksi (Correction)
                  </div>
                  <div style={{ fontSize: '0.73rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                    {f.evidence?.correction || f.correction || (
                      <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Belum dilakukan perbaikan fisik</span>
                    )}
                  </div>
                </div>

                {/* Tindakan Pencegahan */}
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#10b981', marginBottom: '0.2rem', textTransform: 'uppercase' }}>
                    🛡️ Pencegahan (Preventive Action)
                  </div>
                  <div style={{ fontSize: '0.73rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                    {f.evidence?.preventiveAction || f.evidence?.correctiveAction || f.correctiveAction || (
                      <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Belum disusun rencana pencegahan berulang</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Penutupan & Tombol Aksi Langsung */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.25rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  PIC: <strong>{f.assignedTo || 'KKM / Perwira Kapal'}</strong>
                  {f.dateClosed && (
                    <span style={{ marginLeft: '0.6rem', color: '#10b981', fontWeight: 700 }}>
                      ✓ Ditutup: {formatIndoDate(f.dateClosed)} oleh {f.closedBy || 'Lead Auditor'}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setEvidenceTargetFinding(f);
                      setEvidenceModalOpen(true);
                    }}
                    className={`btn btn-sm ${isSubmitted ? 'btn-primary' : 'btn-secondary'}`}
                    style={{
                      fontSize: '0.72rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontWeight: 700,
                      background: auditRolePerspective === 'nakhoda' && !isClosed ? '#10b981' : undefined,
                      color: auditRolePerspective === 'nakhoda' && !isClosed ? '#ffffff' : undefined,
                      border: auditRolePerspective === 'nakhoda' && !isClosed ? 'none' : undefined
                    }}
                    title={
                      auditRolePerspective === 'nakhoda'
                        ? 'Nakhoda: Unggah foto/dokumen perbaikan fisik dan kirimkan eviden ke DPA'
                        : 'DPA / Auditor: Periksa kelayakan eviden dan lakukan otorisasi penutupan NC'
                    }
                  >
                    <Upload size={12} />
                    <span>
                      {isClosed
                        ? 'Tinjau Bukti'
                        : auditRolePerspective === 'nakhoda'
                          ? isSubmitted
                            ? 'Perbarui Eviden Kapal'
                            : 'Unggah Eviden & Kirim ke DPA'
                          : isSubmitted
                            ? 'Verifikasi Eviden Masuk'
                            : 'Input / Review CAPA'}
                    </span>
                  </button>

                  {!isClosed && (
                    <>
                      <button
                        type="button"
                        onClick={() => setNotificationModalFinding(f)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                        title="Kirim pesan pengingat WA kepada PIC"
                      >
                        <MessageSquare size={12} />
                        <span>WhatsApp</span>
                      </button>

                      {isAuditorOrDPA && auditRolePerspective === 'dpa' ? (
                        <button
                          type="button"
                          onClick={() => {
                            closeAuditFinding(f.id, 'Diverifikasi langsung melalui Alur CAPA Tahap 4 (Otorisasi DPA)', currentUser?.name || 'DPA Baharimas');
                            showToast(`✓ Temuan ${f.findingNo || 'NC'} berhasil diverifikasi & disetujui tutup resmi oleh DPA!`, 'success');
                          }}
                          className="btn btn-sm"
                          style={{
                            fontSize: '0.72rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontWeight: 700,
                            background: '#10b981',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.3rem 0.65rem',
                            borderRadius: '6px'
                          }}
                          title="DPA Otorisasi: Langsung verifikasi & tutup temuan ini jika eviden telah valid"
                        >
                          <CheckCircle2 size={12} />
                          <span>Tutup NC (DPA)</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            showToast(`ℹ️ Sesuai ISM Code Klausul 12, otorisasi penutupan NC dilakukan oleh DPA setelah memeriksa bukti fisik yang dikirimkan kapal.`, 'info');
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{
                            fontSize: '0.7rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color: 'var(--text-muted)',
                            borderStyle: 'dashed'
                          }}
                          title="Klausul 12: Penutupan resmi diotorisasi oleh DPA setelah verifikasi eviden kapal"
                        >
                          <Clock size={11} />
                          <span>Verifikasi DPA</span>
                        </button>
                      )}
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setReportModalSession(getEnrichedReportSession(activeSession || currentTarget.lastAudit));
                      setReportModalFinding(f);
                      setReportModalMode('ncr');
                      setReportModalOpen(true);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#0284c7' }}
                    title="Cetak lembar NCR penutupan temuan ini"
                  >
                    <Printer size={12} />
                    <span>Cetak NCR</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

      {currentTarget.findings.length === 0 && (
        <div className="glass-card" style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
          <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 0.5rem auto' }} />
          <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'block' }}>
            Tidak Ada Temuan Ketidaksesuaian (Bebas NC)
          </strong>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0.25rem auto 0 auto' }}>
            Seluruh klausul kepatuhan {currentTarget.name} terpenuhi dengan baik. Anda dapat melanjutkan ke Tahap 5 untuk penutupan audit dan cetak laporan.
          </p>
        </div>
      )}
    </div>
  </div>
);
