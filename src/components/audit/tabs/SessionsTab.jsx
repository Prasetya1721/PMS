/**
 * SessionsTab.jsx
 * Diekstrak dari AuditManager.jsx (baris 3107-3406).
 * Sumber: TAB 2: SESI AUDIT KAPAL INI
 */
import React from 'react';
import { Edit, FileCheck, Plus, Printer, ShieldCheck, Trash2 } from 'lucide-react';

export const SessionsTab = ({
  activeSession,
  currentTarget,
  deleteAuditSession,
  getEnrichedReportSession,
  isAuditorOrDPA,
  setDeleteConfirmModal,
  setEditingSession,
  setReportModalMode,
  setReportModalOpen,
  setReportModalSession,
  setSessionModalOpen,
  setVesselTab,
}) => (
<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
      <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Tahap 1: Inisiasi & Riwayat Sesi Audit Resmi: {currentTarget.name}</h4>
      <button
        onClick={() => {
          setEditingSession(null);
          setSessionModalOpen(true);
        }}
        className="btn btn-primary btn-sm"
        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
      >
        <Plus size={14} />
        <span>{currentTarget.standard === 'DOC' ? '+ Buat Sesi DOC Kantor Baru' : '+ Buat Sesi SMC Kapal Baru'}</span>
      </button>
    </div>

    {/* Active Session Workspace Card */}
    {activeSession && (
      <div
        className="glass-card"
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: '12px',
          border: '1.5px solid #0284c7',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.1) 0%, rgba(15, 23, 42, 0.7) 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 8px 24px rgba(2, 132, 199, 0.15)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(2, 132, 199, 0.2)',
              border: '1px solid rgba(2, 132, 199, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              flexShrink: 0
            }}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#38bdf8' }}>
                  Sesi Audit Aktif (Tahap 1 Terkonfirmasi)
                </span>
                <span className={`badge ${activeSession.status === 'Completed' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.68rem' }}>
                  {activeSession.status}
                </span>
              </div>
              <h3 className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.2rem 0', color: '#f8fafc' }}>
                {activeSession.auditNo}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Standar: <strong>{activeSession.standard}</strong> • Jenis: <strong>{activeSession.auditType}</strong> • Target: <strong>{activeSession.targetName || currentTarget.name}</strong>
              </p>
            </div>
          </div>

          {/* Action Buttons to seamlessly continue through Stages 2-5 */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => setVesselTab('checklist')}
              className="btn btn-primary btn-sm"
              style={{
                fontWeight: 800,
                fontSize: '0.82rem',
                padding: '0.5rem 1rem',
                background: '#0284c7',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)'
              }}
              title="Buka Tahap 2: Checklist Klausul untuk sesi ini"
            >
              <FileCheck size={16} />
              <span>📋 Lanjut ke 2. Checklist Klausul ➔</span>
            </button>

            <button
              onClick={() => {
                setEditingSession(activeSession);
                setSessionModalOpen(true);
              }}
              className="btn btn-secondary btn-sm"
              style={{
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '0.5rem 0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
              title="Edit data sesi dan tim (Tahap 1)"
            >
              <Edit size={14} />
              <span>✏️ Edit Sesi & Tim</span>
            </button>

            <button
              onClick={() => {
                setReportModalSession(getEnrichedReportSession(activeSession));
                setReportModalMode('session');
                setReportModalOpen(true);
              }}
              className="btn btn-secondary btn-sm"
              style={{
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '0.5rem 0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#38bdf8'
              }}
              title="Cetak Laporan Audit Resmi A4 / PDF"
            >
              <Printer size={14} />
              <span>🖨️ Cetak Laporan</span>
            </button>
          </div>
        </div>

        {/* Summary metadata grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.85rem',
          background: 'var(--bg-surface-elevated)',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.75rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Lead Auditor:</span>
            <strong style={{ color: 'var(--text-main)' }}>{activeSession.leadAuditor || '-'}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Auditee / Wakil:</span>
            <strong style={{ color: 'var(--text-main)' }}>{activeSession.auditee || '-'}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Tanggal Pelaksanaan:</span>
            <strong className="mono" style={{ color: 'var(--text-main)' }}>{activeSession.auditDate || '-'}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Klausul Diperiksa:</span>
            <strong style={{ color: '#10b981' }}>
              {activeSession.checklist?.filter(c => c.result)?.length || activeSession.itemsComplied || 0} / {activeSession.checklist?.length || (activeSession.standard === 'DOC' ? 13 : 74)} Klausul
            </strong>
          </div>
        </div>
      </div>
    )}

    {currentTarget.audits.length > 0 ? (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1rem' }}>
        {currentTarget.audits.map(s => (
          <div key={s.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span className="mono" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0284c7' }}>
                  {s.auditNo}
                </span>
                <span className={`badge ${s.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                  {s.status}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.6rem' }}>
                <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                  {s.auditType} PBK
                </span>
                <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                  Standar {s.standard}
                </span>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '0.6rem' }}>
                {s.scope || 'Evaluasi kepatuhan operasional kapal sesuai IMO ISM Code.'}
              </p>

              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <div>Lead Auditor: <strong style={{ color: 'var(--text-main)' }}>{s.leadAuditor}</strong></div>
                <div>Auditee: <strong>{s.auditee}</strong></div>
                <div>Pelaksanaan: {s.auditDate} • Target Close: {s.targetCloseDate}</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem' }}>
                Kepatuhan: <strong style={{ color: '#10b981' }}>{s.totalItemsChecked ? Math.round((s.itemsComplied / s.totalItemsChecked) * 100) : 0}%</strong>
              </div>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  onClick={() => setVesselTab('checklist')}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
                  title="Buka checklist butir klausul untuk sesi audit ini"
                >
                  <FileCheck size={13} />
                  <span>Buka Checklist</span>
                </button>
                {isAuditorOrDPA && (
                  <>
                    <button
                      onClick={() => {
                        setEditingSession(s);
                        setSessionModalOpen(true);
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      title="Edit data sesi audit"
                    >
                      <Edit size={12} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmModal({
                          type: 'session',
                          id: s.id || s.auditNo,
                          code: s.auditNo,
                          title: 'Hapus Sesi Audit Resmi',
                          targetName: currentTarget?.name,
                          details: `Sesi audit "${s.auditNo}" (${s.standard} - ${s.auditType}) akan dihapus dari data sistem armada kapal ${currentTarget?.name}. Seluruh ringkasan checklist dan temuan terkait sesi ini akan dibersihkan.`,
                          onConfirm: () => {
                            deleteAuditSession(s.id || s.auditNo);
                            setDeleteConfirmModal(null);
                          }
                        });
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.3rem 0.5rem', color: '#ef4444' }}
                      title="Hapus Sesi Audit Ini"
                    >
                      <Trash2 size={13} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="glass-card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
        <ShieldCheck size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.65rem' }} />
        <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Belum ada sesi audit tercatat untuk kapal ini</h4>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          {isAuditorOrDPA
            ? 'Klik tombol di bawah untuk membuat sesi audit baru (Tahap 1: Setup Sesi & Tim), kemudian lanjutkan pemeriksaan klausul di Dashboard Tahap 2.'
            : 'Sesi audit resmi untuk kapal armada dijadwalkan dan diinisiasi oleh DPA / Lead Auditor dari kantor darat.'}
        </p>
        {isAuditorOrDPA ? (
          <button
            onClick={() => {
              setEditingSession(null);
              setSessionModalOpen(true);
            }}
            className="btn btn-primary btn-sm"
            style={{ marginTop: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
          >
            <Plus size={14} />
            <span>Buat Sesi Audit Baru (Tahap 1)</span>
          </button>
        ) : (
          <div style={{
            marginTop: '0.85rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.74rem',
            color: '#0284c7',
            padding: '0.4rem 0.85rem',
            borderRadius: '6px',
            background: 'rgba(2, 132, 199, 0.08)',
            border: '1px solid rgba(2, 132, 199, 0.25)'
          }}>
            <ShieldCheck size={14} />
            <span>Sesi audit baru hanya dapat dibuat oleh DPA / Lead Auditor</span>
          </div>
        )}
      </div>
    )}
  </div>
);
