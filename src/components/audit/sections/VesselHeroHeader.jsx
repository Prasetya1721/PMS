/**
 * VesselHeroHeader.jsx
 * Diekstrak dari AuditManager.jsx (baris 2086-2151).
 * Sumber: Dedicated Vessel Hero Header
 */
import React from 'react';
import { Building2, ShieldCheck, Ship } from 'lucide-react';

export const VesselHeroHeader = ({
  currentTarget,
}) => (
<div className="glass-card" style={{
  padding: '1.25rem 1.5rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1.25rem',
  background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-elevated) 100%)',
  border: '1px solid var(--border-subtle)'
}}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
    <div style={{
      width: '56px',
      height: '56px',
      borderRadius: '12px',
      background: currentTarget.type === 'office' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'linear-gradient(135deg, #0284c7 0%, #0284c7 100%)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
      flexShrink: 0
    }}>
      {currentTarget.type === 'office' ? <Building2 size={30} /> : <Ship size={30} />}
    </div>
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>{currentTarget.name}</h2>
        <span className={`badge ${currentTarget.ownership === 'As Owner' ? 'badge-primary' : currentTarget.ownership === 'Head Office' ? 'badge-info' : 'badge-neutral'}`}>
          {currentTarget.ownership}
        </span>
        <span className={`badge ${currentTarget.standard === 'DOC' ? 'badge-success' : 'badge-warning'}`}>
          Standar {currentTarget.standard}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
        <span>Call Sign: <strong className="mono" style={{ color: 'var(--text-main)' }}>{currentTarget.callSign}</strong></span>
        <span>IMO / Reg: <strong className="mono" style={{ color: 'var(--text-main)' }}>{currentTarget.imo}</strong></span>
        <span>Tonase: <strong>{currentTarget.gt !== '-' ? `${currentTarget.gt} GT` : 'Kantor Pusat'}</strong></span>
        <span>Nakhoda: <strong>{currentTarget.nakhoda}</strong></span>
        <span>KKM: <strong>{currentTarget.kkm}</strong></span>
      </div>
    </div>
  </div>

  {/* Vessel Status Quick Summary */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.45rem 0.85rem',
      borderRadius: '8px',
      background: 'var(--bg-surface-elevated)',
      border: '1px solid var(--border-subtle)',
      fontSize: '0.78rem'
    }}>
      <ShieldCheck size={16} color={currentTarget.openNC === 0 ? '#10b981' : '#ef4444'} />
      <span style={{ color: 'var(--text-muted)' }}>Status Kepatuhan:</span>
      <strong style={{ color: currentTarget.openNC === 0 ? '#10b981' : '#ef4444' }}>
        {currentTarget.openNC === 0 ? 'Bebas NC (Terkendali)' : `${currentTarget.openNC} NC Perlu Tindakan`}
      </strong>
    </div>
  </div>
</div>
);
