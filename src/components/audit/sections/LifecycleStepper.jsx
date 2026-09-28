/**
 * LifecycleStepper.jsx
 * Diekstrak dari AuditManager.jsx (baris 2391-2731).
 * Sumber: ALUR KERJA TERPADU: LIFECYCLE STEPPER 5 TAHAP AUDIT MARITIM
 */
import React from 'react';
import { AlertTriangle, BookOpen, Building2, Compass, FileCheck, Package, Play, Printer, ShieldCheck, Ship, Sparkles, Upload, Users } from 'lucide-react';

export const LifecycleStepper = ({
  activeSession,
  auditRolePerspective,
  checklistProgress,
  currentTarget,
  currentTargetCertificates,
  currentTargetRequisitions,
  getRoleGuidance,
  handleLoadSampleSMCAudit,
  handleQuickLaunchSession,
  isAuditorOrDPA,
  setAuditRolePerspective,
  setShowRoleFlowModal,
  setStatusFilter,
  setVesselTab,
  vesselTab,
}) => (
<div className="glass-card" style={{
  padding: '1rem 1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.85rem',
  background: 'linear-gradient(135deg, var(--bg-surface-card) 0%, var(--bg-surface-elevated) 100%)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '12px'
}}>
  {/* Header Stepper & Active Session Indicator */}
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtle)' }}>
        Alur Siklus Audit ISM (Lifecycle)
      </span>
      {activeSession ? (
        <span className="badge badge-info mono" style={{ fontSize: '0.72rem', fontWeight: 800 }}>
          Sesi Aktif: {activeSession.auditNo} ({activeSession.status})
        </span>
      ) : (
        <span className="badge badge-warning" style={{ fontSize: '0.72rem', fontWeight: 700 }}>
          Belum Ada Sesi Aktif
        </span>
      )}
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
      {/* Role Switcher Pill */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '2px',
        gap: '2px'
      }}>
        <button
          type="button"
          onClick={() => setAuditRolePerspective('dpa')}
          style={{
            border: 'none',
            background: auditRolePerspective === 'dpa' ? (currentTarget.standard === 'DOC' ? '#d97706' : '#0284c7') : 'transparent',
            color: auditRolePerspective === 'dpa' ? '#ffffff' : 'var(--text-muted)',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '0.25rem 0.55rem',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            transition: 'all 0.15s ease'
          }}
          title={currentTarget.standard === 'DOC'
            ? "Aktifkan sudut pandang Auditor & DPA (Kantor Darat): Perencanaan Audit DOC, Evaluasi 13 Seksi, dan Otorisasi CAPA"
            : "Aktifkan sudut pandang DPA (Kantor Darat): Perencanaan, Evaluasi Temuan, Otorisasi CAPA, dan Deklarasi Kelaiklautan"}
        >
          <Building2 size={12} />
          <span>{currentTarget.standard === 'DOC' ? 'Auditor & DPA' : 'DPA (Darat)'}</span>
        </button>
        <button
          type="button"
          onClick={() => setAuditRolePerspective('nakhoda')}
          style={{
            border: 'none',
            background: auditRolePerspective === 'nakhoda' ? '#10b981' : 'transparent',
            color: auditRolePerspective === 'nakhoda' ? '#ffffff' : 'var(--text-muted)',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '0.25rem 0.55rem',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            transition: 'all 0.15s ease'
          }}
          title={currentTarget.standard === 'DOC'
            ? "Aktifkan sudut pandang Divisi Darat & Direksi (Auditee DOC): HR/Crewing, Superintendent Teknis, Logistik, HSSE"
            : "Aktifkan sudut pandang Nakhoda (Kapal Onboard): Auditee Resmi, Pendampingan Checklist 74 Butir, Eksekusi Perbaikan & Kirim Eviden Foto"}
        >
          {currentTarget.standard === 'DOC' ? <Users size={12} /> : <Ship size={12} />}
          <span>{currentTarget.standard === 'DOC' ? 'Divisi Darat (Auditee)' : 'Nakhoda (Kapal)'}</span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => setShowRoleFlowModal(true)}
        className="btn btn-secondary btn-sm"
        style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          color: currentTarget.standard === 'DOC' ? '#d97706' : '#8b5cf6',
          borderColor: currentTarget.standard === 'DOC' ? 'rgba(217, 119, 6, 0.35)' : 'rgba(139, 92, 246, 0.35)',
          background: currentTarget.standard === 'DOC' ? 'rgba(217, 119, 6, 0.08)' : 'rgba(139, 92, 246, 0.08)'
        }}
        title={currentTarget.standard === 'DOC'
          ? "Lihat petunjuk dan alur kerja audit DOC Kantor Pusat (Auditor/DPA vs Divisi Darat) dan Matriks RACI"
          : "Lihat petunjuk dan alur kerja audit SMC Kapal Armada (DPA vs Nakhoda) dan Matriks RACI"}
      >
        <Compass size={13} />
        <span>{currentTarget.standard === 'DOC' ? 'Petunjuk & Alur DOC' : 'Petunjuk & Alur SMC'}</span>
      </button>

      {!activeSession && isAuditorOrDPA && (
        <button
          type="button"
          onClick={handleQuickLaunchSession}
          className="btn btn-primary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 800 }}
        >
          <Play size={13} fill="currentColor" />
          <span>Mulai Sesi Cepat</span>
        </button>
      )}
      {isAuditorOrDPA && (
        <button
          type="button"
          onClick={handleLoadSampleSMCAudit}
          className="btn btn-secondary btn-sm"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#0284c7',
            borderColor: 'rgba(2, 132, 199, 0.4)',
            background: 'rgba(2, 132, 199, 0.08)'
          }}
          title="Muat contoh simulasi lengkap audit SMC (Sesi BKI, 74 checklist terisi, temuan NC 10.3, dan CAPA)"
        >
          <Sparkles size={13} />
          <span>Contoh SMC</span>
        </button>
      )}
      <button
        type="button"
        onClick={() => setVesselTab('integrations')}
        className={`btn btn-sm ${vesselTab === 'integrations' ? 'btn-primary' : 'btn-secondary'}`}
        style={{ fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
        title="Sertifikat Statutori & Permintaan Suku Cadang Terkait"
      >
        <Package size={13} />
        <span>Sertifikat & Logistik ({currentTargetCertificates.length + currentTargetRequisitions.length})</span>
      </button>
    </div>
  </div>

  {/* Visual Stepper 5 Tahap */}
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '0.65rem'
  }}>
    {[
      {
        id: 'sessions',
        step: 1,
        title: '1. Sesi & Tim',
        desc: activeSession ? `${activeSession.status} • ${activeSession.auditType}` : 'Inisiasi / Riwayat Sesi',
        icon: ShieldCheck,
        badge: currentTarget.audits.length > 0 ? `${currentTarget.audits.length} Sesi` : 'Baru'
      },
      {
        id: 'checklist',
        step: 2,
        title: currentTarget.standard === 'DOC' ? '2. Checklist 13 Seksi' : '2. Checklist 74 Klausul',
        desc: `${checklistProgress.answered}/${checklistProgress.total} Butir (${checklistProgress.percent}%)`,
        icon: FileCheck,
        badge: checklistProgress.percent === 100 ? '100% Selesai' : `${checklistProgress.percent}%`
      },
      {
        id: 'findings',
        step: 3,
        title: '3. Temuan NC',
        desc: currentTarget.openNC > 0 ? `${currentTarget.openNC} NC Belum Tuntas` : 'Bebas Temuan Open',
        icon: AlertTriangle,
        badge: currentTarget.openNC > 0 ? `${currentTarget.openNC} NC Open` : '0 Open',
        alert: currentTarget.openNC > 0
      },
      {
        id: 'capa',
        step: 4,
        title: '4. Bukti & CAPA',
        desc: currentTarget.submittedNC > 0 ? `${currentTarget.submittedNC} Siap Verifikasi` : `${currentTarget.closedNC} NC Closed`,
        icon: Upload,
        badge: currentTarget.submittedNC > 0 ? `${currentTarget.submittedNC} Review` : 'Monitoring'
      },
      {
        id: 'reporting',
        step: 5,
        title: currentTarget.standard === 'DOC' ? '5. Tinjauan & Cetak' : '5. Penutupan & Cetak',
        desc: currentTarget.standard === 'DOC' ? 'Signoff & Rekomendasi DOC' : 'Fit to Sail & Hub Laporan',
        icon: Printer,
        badge: 'Cetak Dokumen'
      }
    ].map(st => {
      const Icon = st.icon;
      const isActive = vesselTab === st.id;
      return (
        <button
          key={st.id}
          type="button"
          onClick={() => {
            setVesselTab(st.id);
            if (st.id === 'findings') setStatusFilter('ALL');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.65rem 0.85rem',
            borderRadius: '10px',
            border: isActive ? (currentTarget.standard === 'DOC' ? '2px solid #d97706' : '2px solid #0284c7') : '1px solid var(--border-subtle)',
            background: isActive ? (currentTarget.standard === 'DOC' ? 'rgba(217, 119, 6, 0.12)' : 'rgba(2, 132, 199, 0.12)') : 'var(--bg-surface-elevated)',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: isActive ? (currentTarget.standard === 'DOC' ? '#d97706' : '#0284c7') : 'var(--bg-surface)',
            color: isActive ? '#fff' : 'var(--text-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.825rem',
            flexShrink: 0
          }}>
            <Icon size={16} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.3rem' }}>
              <strong style={{ fontSize: '0.8rem', color: isActive ? (currentTarget.standard === 'DOC' ? '#f59e0b' : '#38bdf8') : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {st.title}
              </strong>
              {st.badge && (
                <span className={`badge ${st.alert ? 'badge-danger-pulse' : 'badge-neutral'}`} style={{ fontSize: '0.6rem', padding: '0.05rem 0.35rem' }}>
                  {st.badge}
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '0.1rem' }}>
              {st.desc}
            </div>
          </div>
        </button>
      );
    })}
  </div>

  {/* Contextual Role Guidance Ribbon */}
  <div style={{
    marginTop: '0.75rem',
    padding: '0.65rem 0.95rem',
    borderRadius: '8px',
    background: auditRolePerspective === 'dpa'
      ? (currentTarget.standard === 'DOC'
          ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.09), rgba(245, 158, 11, 0.02))'
          : 'linear-gradient(135deg, rgba(2, 132, 199, 0.09), rgba(2, 132, 199, 0.02))')
      : 'linear-gradient(135deg, rgba(16, 185, 129, 0.09), rgba(16, 185, 129, 0.02))',
    border: auditRolePerspective === 'dpa'
      ? (currentTarget.standard === 'DOC'
          ? '1px solid rgba(245, 158, 11, 0.35)'
          : '1px solid rgba(2, 132, 199, 0.3)')
      : '1px solid rgba(16, 185, 129, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
    flexWrap: 'wrap'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: '280px' }}>
      <div style={{
        padding: '0.3rem 0.6rem',
        borderRadius: '6px',
        fontSize: '0.72rem',
        fontWeight: 800,
        background: auditRolePerspective === 'dpa'
          ? (currentTarget.standard === 'DOC' ? '#d97706' : '#0284c7')
          : '#10b981',
        color: '#ffffff',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        flexShrink: 0
      }}>
        {auditRolePerspective === 'dpa' ? (
          <Building2 size={13} />
        ) : (
          currentTarget.standard === 'DOC' ? <Users size={13} /> : <Ship size={13} />
        )}
        <span>
          {auditRolePerspective === 'dpa'
            ? (currentTarget.standard === 'DOC' ? 'PETUNJUK AUDITOR / DPA (DOC)' : 'FOKUS TUGAS DPA (SMC)')
            : (currentTarget.standard === 'DOC' ? 'TANGGUNG JAWAB DIVISI DARAT (DOC)' : 'TANGGUNG JAWAB NAKHODA (SMC)')}
        </span>
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: '1.45' }}>
        {getRoleGuidance(vesselTab, auditRolePerspective, currentTarget.standard)}
      </div>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
      <button
        type="button"
        onClick={() => setShowRoleFlowModal(true)}
        className="btn btn-secondary btn-sm"
        style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          padding: '0.3rem 0.65rem'
        }}
        title={currentTarget.standard === 'DOC'
          ? "Buka panduan lengkap alur audit DOC kantor pusat, peran divisi, dan matriks RACI"
          : "Buka panduan lengkap alur audit SMC kapal, peran DPA vs Nakhoda, dan matriks RACI"}
      >
        <BookOpen size={12} />
        <span>{currentTarget.standard === 'DOC' ? 'Pelajari Petunjuk DOC' : 'Pelajari Petunjuk SMC'}</span>
      </button>
    </div>
  </div>
</div>
);
