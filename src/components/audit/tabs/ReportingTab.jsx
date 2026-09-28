/**
 * ReportingTab.jsx
 * Diekstrak dari AuditManager.jsx (baris 4665-4989).
 * Sumber: TAB 5: PENUTUPAN & CETAK LAPORAN (TAHAP 5 LIFECYCLE AUDIT)
 */
import React from 'react';
import { AlertTriangle, CheckCircle2, CheckSquare, Clock, FileText, Printer } from 'lucide-react';
import { formatIndoDate } from '../../../utils/auditTimeUtils';

export const ReportingTab = ({
  activeSession,
  checklistProgress,
  currentTarget,
  getEnrichedReportSession,
  isAuditorOrDPA,
  setReportModalFinding,
  setReportModalMode,
  setReportModalOpen,
  setReportModalSession,
  showToast,
  updateAuditSession,
}) => (
<div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
    {/* Header */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
      <div>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Printer size={18} color="#0284c7" />
          <span>Tahap 5: Penutupan Audit & Pusat Cetak Dokumen Resmi (Reporting Hub)</span>
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Evaluasi kelaikan sistem manajemen keselamatan (Fit-to-Sail), finalisasi pengesahan sesi audit, dan hub cetak 1-pintu berstandar BKI / ISM Code.
        </p>
      </div>

      {activeSession?.status === 'In Progress' && (
        isAuditorOrDPA ? (
          <button
            type="button"
            onClick={() => {
              updateAuditSession(activeSession.id, {
                status: 'Completed',
                targetCloseDate: new Date().toISOString().split('T')[0],
                closeDate: new Date().toISOString().split('T')[0]
              });
              showToast(`✓ Sesi Audit ${activeSession.auditNo} berhasil diselesaikan dan ditutup!`, 'success');
            }}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, background: '#10b981', borderColor: '#10b981' }}
          >
            <CheckCircle2 size={15} />
            <span>Finalisasi & Tutup Sesi Audit</span>
          </button>
        ) : (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem', borderRadius: '6px', background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7', fontSize: '0.75rem', fontWeight: 600 }}>
            <Clock size={14} />
            <span>Menunggu Pengesahan Penutupan oleh Auditor / DPA</span>
          </div>
        )
      )}
    </div>

    {/* Status Rekomendasi Kepatuhan & Kelaikan Kapal (Fit to Sail) */}
    <div className="glass-card" style={{
      padding: '1.25rem',
      borderRadius: '12px',
      border: '1px solid var(--border-subtle)',
      background: 'linear-gradient(135deg, var(--bg-surface-card) 0%, var(--bg-surface-elevated) 100%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtle)' }}>
            Status Rekomendasi Kepatuhan ISM Code & Kelaikan Kelaiklautan
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
            {currentTarget.majorNC === 0 && currentTarget.openNC === 0 ? (
              <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem', fontWeight: 800 }}>
                ✓ LAIK LAYAR / FULL COMPLIANCE (FIT TO SAIL)
              </span>
            ) : currentTarget.majorNC === 0 && currentTarget.openNC > 0 ? (
              <span className="badge badge-warning" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem', fontWeight: 800 }}>
                ⚠️ LAIK BERSYARAT (INTERIM / MINOR NC PENDING CAPA)
              </span>
            ) : (
              <span className="badge badge-danger" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem', fontWeight: 800 }}>
                🚨 TIDAK LAIK (MAJOR NC WAJIB TUNTAS SEBELUM SAILING)
              </span>
            )}
            <span className="badge badge-neutral mono" style={{ fontSize: '0.75rem' }}>
              Standar: {currentTarget.standard} ({currentTarget.type === 'vessel' ? 'Kapal Armada' : 'Kantor Pusat'})
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Progres Checklist Pemeriksaan</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284c7' }}>
            {checklistProgress.percent}% Selesai ({checklistProgress.answered}/{checklistProgress.total} Butir)
          </div>
        </div>
      </div>

      {/* Grid Status Sesi & Sign-off Preview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '0.85rem',
        marginTop: '0.25rem'
      }}>
        {/* Info Sesi */}
        <div style={{ padding: '0.85rem', borderRadius: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284c7', marginBottom: '0.35rem' }}>
            DATA SESI AUDIT AKTIF
          </div>
          <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div><strong>Nomor Audit:</strong> <span className="mono">{activeSession?.auditNo || 'AUD-DEFAULT-2026'}</span></div>
            <div><strong>Tipe & Lembaga:</strong> {activeSession?.auditType || 'Internal'} • {activeSession?.externalOrganization || 'PT. PBK Internal'}</div>
            <div><strong>Tanggal Pelaksanaan:</strong> {formatIndoDate(activeSession?.auditDate || new Date().toISOString().split('T')[0])}</div>
            <div><strong>Status Sesi:</strong> <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{activeSession?.status || 'Scheduled'}</span></div>
          </div>
        </div>

        {/* Tim Auditor */}
        <div style={{ padding: '0.85rem', borderRadius: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', marginBottom: '0.35rem' }}>
            LEAD AUDITOR & VERIFIKATOR DPA
          </div>
          <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div><strong>Lead Auditor:</strong> {activeSession?.leadAuditor || 'Capt. Marine Safety Inspector'}</div>
            <div><strong>Tim Pendamping:</strong> {Array.isArray(activeSession?.auditTeam) ? activeSession.auditTeam.join(', ') : 'DPA / Safety Officer'}</div>
            <div><strong>Pengesahan:</strong> <span style={{ color: '#10b981', fontWeight: 700 }}>✓ Ditandatangani Elektronik (DPA Verified)</span></div>
          </div>
        </div>

        {/* Auditee / Nakhoda */}
        <div style={{ padding: '0.85rem', borderRadius: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.35rem' }}>
            PERWAKILAN AUDITEE (KAPAL/KANTOR)
          </div>
          <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div><strong>Perwakilan Penerima:</strong> {activeSession?.auditee || `${currentTarget.nakhoda || 'Nakhoda'} & ${currentTarget.kkm || 'KKM'}`}</div>
            <div><strong>Lokasi Penutupan:</strong> {activeSession?.auditLocation || `Onboard ${currentTarget.name}`}</div>
            <div><strong>Status Closing Meeting:</strong> <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Selesai Dipaparkan</span></div>
          </div>
        </div>
      </div>
    </div>

    {/* 3 Print Hub Cards */}
    <div>
      <h5 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Printer size={15} />
        <span>Pusat Cetak Formulir & Dokumen Audit Resmi (Format BKI / ISM Code)</span>
      </h5>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem'
      }}>
        {/* Card 1: Executive Audit Report */}
        <div className="glass-card" style={{
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ padding: '0.45rem', borderRadius: '8px', background: 'rgba(2, 132, 199, 0.12)', color: '#0284c7' }}>
                <FileText size={20} />
              </div>
              <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>Dokumen 1</span>
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.35rem 0' }}>
              1. Laporan Sesi Audit (Audit Report)
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Dokumen komprehensif audit berstandar resmi DOC/SMC. Berisi ringkasan eksekutif kepatuhan, data kapal/kantor, daftar auditor, rekapitulasi klausul, dan lembar tanda tangan pengesahan.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setReportModalSession(getEnrichedReportSession(activeSession || currentTarget.lastAudit));
              setReportModalFinding(null);
              setReportModalMode('session');
              setReportModalOpen(true);
            }}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 700, width: '100%', padding: '0.5rem' }}
          >
            <Printer size={14} />
            <span>Cetak Dokumen 1: Sesi Audit</span>
          </button>
        </div>

        {/* Card 2: NCR Close-Out Form */}
        <div className="glass-card" style={{
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ padding: '0.45rem', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
                <AlertTriangle size={20} />
              </div>
              <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Dokumen 2</span>
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.35rem 0' }}>
              2. Formulir Ketidaksesuaian (NCR Form)
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Formulir resmi penutupan temuan NC per butir pemeriksaan. Menyajikan deskripsi temuan, analisis akar masalah (RCA), tindakan korektif/preventif (CAPA), dan verifikasi Lead Auditor.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const firstFinding = currentTarget.findings[0] || null;
              setReportModalSession(getEnrichedReportSession(activeSession || currentTarget.lastAudit));
              setReportModalFinding(firstFinding);
              setReportModalMode('ncr');
              setReportModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 700, width: '100%', padding: '0.5rem', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)' }}
          >
            <Printer size={14} />
            <span>Cetak Dokumen 2: Lembar NCR</span>
          </button>
        </div>

        {/* Card 3: BKI Checklist Report */}
        <div className="glass-card" style={{
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ padding: '0.45rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                <CheckSquare size={20} />
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                Dokumen 3 ({currentTarget.standard === 'DOC' ? 'DOC Rev 06' : 'SMC Rev 05'})
              </span>
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.35rem 0' }}>
              3. Checklist Resmi BKI (A4 Printable)
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Formulir cetak lembar kerja audit {currentTarget.standard === 'DOC' ? 'DOC (13 Seksi)' : 'SMC Shipboard (74 Butir)'} lengkap dengan tanda silang Yes/No/NA, klausul dicoret, dan catatan bukti fisik.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setReportModalSession(getEnrichedReportSession(activeSession || currentTarget.lastAudit));
              setReportModalFinding(null);
              setReportModalMode('checklist');
              setReportModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 700, width: '100%', padding: '0.5rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}
          >
            <Printer size={14} />
            <span>Cetak Dokumen 3: Lembar Checklist</span>
          </button>
        </div>
      </div>

      {/* Option to Print All as a Complete Audit Pack Bundle */}
      <div style={{
        marginTop: '0.85rem',
        padding: '0.85rem 1.25rem',
        borderRadius: '10px',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7' }}>
            <FileText size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Opsi Cetak Bundel: Ingin mencetak seluruh berkas sekaligus?
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Anda dapat mencetak masing-masing dokumen di atas secara mandiri, atau klik tombol di samping untuk mencetak bundel 3 dokumen berurutan.
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setReportModalSession(getEnrichedReportSession(activeSession || currentTarget.lastAudit));
            setReportModalFinding(currentTarget.findings[0] || null);
            setReportModalMode('all');
            setReportModalOpen(true);
          }}
          className="btn btn-secondary btn-sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontWeight: 800,
            fontSize: '0.76rem',
            padding: '0.45rem 0.9rem',
            color: '#0284c7',
            borderColor: 'rgba(2, 132, 199, 0.4)'
          }}
        >
          <FileText size={14} />
          <span>Cetak Semua (Bundle 3 Dokumen)</span>
        </button>
      </div>
    </div>
  </div>
);
