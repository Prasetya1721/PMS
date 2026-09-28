/**
 * StandardSwitcher.jsx
 * Diekstrak dari AuditManager.jsx (baris 1372-1496).
 * Sumber: TOP ISM MODULE SELECTOR: SMC KAPAL vs DOC KANTOR
 */
import React from 'react';
import { Building2, Ship } from 'lucide-react';

export const StandardSwitcher = ({
  activeStandard,
  activeTargetId,
  assignedVesselId,
  docOpenNCCount,
  isAuditorOrDPA,
  setActiveStandard,
  setActiveTargetId,
  setVesselTab,
  showToast,
  smcOpenNCCount,
}) => (
<div className="glass-card" style={{
  padding: '0.85rem 1.25rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '0.85rem',
  border: '1px solid var(--border-subtle)',
  background: 'var(--bg-surface-card)'
}}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
    <div style={{
      width: '38px',
      height: '38px',
      borderRadius: '9px',
      background: 'rgba(2, 132, 199, 0.15)',
      color: '#0284c7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {activeStandard === 'DOC' || activeTargetId === 'office' ? <Building2 size={20} /> : <Ship size={20} />}
    </div>
    <div>
      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Modul Audit & Kepatuhan ISM Code Aktif:
      </span>
      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.1rem' }}>
        {activeStandard === 'DOC' || activeTargetId === 'office'
          ? '🏢 Audit DOC (Document of Compliance) — Kantor Pusat PT. PBK'
          : '🚢 Audit SMC (Safety Management Certificate) — Armada Kapal'}
      </div>
    </div>
  </div>

  {/* Segmented Switcher Buttons */}
  <div style={{
    display: 'flex',
    background: 'var(--bg-surface-elevated)',
    padding: '4px',
    borderRadius: '10px',
    border: '1px solid var(--border-subtle)',
    gap: '4px'
  }}>
    <button
      type="button"
      onClick={() => {
        setActiveStandard('SMC');
        if (activeTargetId === 'office') {
          setActiveTargetId(assignedVesselId || null);
        }
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.45rem 0.95rem',
        borderRadius: '7px',
        border: 'none',
        fontSize: '0.8rem',
        fontWeight: (activeStandard === 'SMC' && activeTargetId !== 'office') ? 800 : 500,
        cursor: 'pointer',
        background: (activeStandard === 'SMC' && activeTargetId !== 'office')
          ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
          : 'transparent',
        color: (activeStandard === 'SMC' && activeTargetId !== 'office') ? '#ffffff' : 'var(--text-muted)',
        boxShadow: (activeStandard === 'SMC' && activeTargetId !== 'office') ? '0 2px 8px rgba(2, 132, 199, 0.35)' : 'none',
        transition: 'all 0.15s ease'
      }}
    >
      <Ship size={15} />
      <span>Audit SMC Kapal</span>
      {smcOpenNCCount > 0 && (
        <span className="badge badge-warning" style={{ fontSize: '0.62rem', padding: '0.1rem 0.38rem' }}>
          {smcOpenNCCount} NC
        </span>
      )}
    </button>

    <button
      type="button"
      disabled={!isAuditorOrDPA}
      onClick={() => {
        if (!isAuditorOrDPA) {
          showToast('Akses dibatasi: Audit DOC (Document of Compliance Kantor) hanya dapat diakses oleh DPA / Lead Auditor Darat.', 'warning');
          return;
        }
        setActiveStandard('DOC');
        setActiveTargetId('office');
        setVesselTab('findings');
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.45rem 0.95rem',
        borderRadius: '7px',
        border: 'none',
        fontSize: '0.8rem',
        fontWeight: (activeStandard === 'DOC' || activeTargetId === 'office') ? 800 : 500,
        cursor: !isAuditorOrDPA ? 'not-allowed' : 'pointer',
        opacity: !isAuditorOrDPA ? 0.5 : 1,
        background: (activeStandard === 'DOC' || activeTargetId === 'office')
          ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
          : 'transparent',
        color: (activeStandard === 'DOC' || activeTargetId === 'office') ? '#ffffff' : 'var(--text-muted)',
        boxShadow: (activeStandard === 'DOC' || activeTargetId === 'office') ? '0 2px 8px rgba(2, 132, 199, 0.35)' : 'none',
        transition: 'all 0.15s ease'
      }}
      title={!isAuditorOrDPA ? "Wewenang terbatas: Audit DOC Kantor hanya dapat diakses oleh DPA / Lead Auditor" : "Beralih ke Audit DOC Kantor Pusat"}
    >
      <Building2 size={15} />
      <span>Audit DOC Kantor</span>
      {!isAuditorOrDPA && <span style={{ fontSize: '0.65rem' }}>🔒</span>}
      {docOpenNCCount > 0 && isAuditorOrDPA && (
        <span className="badge badge-info" style={{ fontSize: '0.62rem', padding: '0.1rem 0.38rem' }}>
          {docOpenNCCount} NC
        </span>
      )}
    </button>
  </div>
</div>
);
