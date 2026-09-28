/**
 * VesselNavBar.jsx
 * Diekstrak dari AuditManager.jsx (baris 1985-2084).
 * Sumber: Navigation Bar: Back Button & Target Switcher
 */
import React from 'react';
import { ArrowLeft, Building2, Ship } from 'lucide-react';

export const VesselNavBar = ({
  activeStandard,
  activeTargetId,
  assignedVesselId,
  currentTarget,
  handleSelectTarget,
  setActiveStandard,
  setActiveTargetId,
  smcTargets,
}) => (
<div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '0.75rem',
  paddingBottom: '0.25rem'
}}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
    {!assignedVesselId ? (
      <button
        onClick={() => {
          if (activeStandard === 'DOC') {
            setActiveStandard('SMC');
            setActiveTargetId(null);
          } else {
            setActiveTargetId(null);
          }
        }}
        className="btn btn-secondary btn-sm"
        style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
      >
        <ArrowLeft size={15} />
        <span>
          {activeStandard === 'DOC' ? '← Beralih ke Portal Audit SMC Kapal' : '← Kembali ke Pemilihan Armada'}
        </span>
      </button>
    ) : (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.76rem',
        fontWeight: 700,
        color: '#0284c7',
        padding: '0.35rem 0.65rem',
        borderRadius: '6px',
        background: 'rgba(2, 132, 199, 0.08)',
        border: '1px solid rgba(2, 132, 199, 0.25)'
      }}>
        <Ship size={14} />
        <span>Kapal Tugas Onboard: {currentTarget?.name}</span>
      </div>
    )}
    <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
      Portal Audit ISM <span style={{ opacity: 0.5 }}>/</span>{' '}
      <span className={`badge ${currentTarget.standard === 'DOC' ? 'badge-info' : 'badge-primary'}`} style={{ fontSize: '0.68rem', marginRight: '0.4rem' }}>
        {currentTarget.standard === 'DOC' ? 'DOC KANTOR' : 'SMC KAPAL'}
      </span>
      <strong style={{ color: 'var(--text-main)' }}>{currentTarget.name}</strong>
    </div>
  </div>

  {/* Quick Switcher Dropdown */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
      {activeStandard === 'DOC' ? 'Entitas Audit:' : 'Ganti Kapal:'}
    </span>
    {activeStandard === 'DOC' ? (
      <div style={{
        fontSize: '0.8rem',
        fontWeight: 700,
        color: 'var(--text-main)',
        padding: '0.35rem 0.75rem',
        borderRadius: '6px',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem'
      }}>
        <Building2 size={14} color="#0284c7" />
        <span>Kantor Pusat PT. PBK Pontianak</span>
      </div>
    ) : (
      <select
        value={activeTargetId}
        disabled={Boolean(assignedVesselId)}
        onChange={(e) => handleSelectTarget(e.target.value)}
        className="select-control"
        style={{
          fontSize: '0.8rem',
          padding: '0.35rem 0.65rem',
          width: '250px',
          cursor: assignedVesselId ? 'not-allowed' : 'pointer',
          opacity: assignedVesselId ? 0.8 : 1
        }}
        title={assignedVesselId ? `Akses Anda dikunci khusus untuk kapal tugas: ${currentTarget?.name}` : "Ganti kapal armada"}
      >
        {smcTargets.map(t => (
          <option key={t.id} value={t.id}>
            {t.openNC > 0 ? `🚨 [${t.openNC} NC] ` : t.submittedNC > 0 ? `⏳ [Eviden] ` : `✅ `}
            {t.name} ({t.ownership})
          </option>
        ))}
      </select>
    )}
  </div>
</div>
);
