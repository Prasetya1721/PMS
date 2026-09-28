/**
 * RolePermissionBar.jsx
 * Diekstrak dari AuditManager.jsx (baris 1281-1370).
 * Sumber: ROLE & PERMISSION CONTEXT BAR: ISM CODE RACI STATUS
 */
import React from 'react';
import { Compass, ShieldCheck, Ship } from 'lucide-react';

export const RolePermissionBar = ({
  assignedVesselId,
  currentTarget,
  currentUser,
  isAuditorOrDPA,
  setShowRoleFlowModal,
  userRole,
  vessels,
}) => (
<div className="glass-card" style={{
  padding: '0.9rem 1.25rem',
  borderRadius: '12px',
  border: '1px solid rgba(2, 132, 199, 0.25)',
  background: isAuditorOrDPA
    ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)'
    : 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '1rem'
}}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
    <div style={{
      width: '42px',
      height: '42px',
      borderRadius: '10px',
      background: isAuditorOrDPA ? 'rgba(16, 185, 129, 0.15)' : 'rgba(2, 132, 199, 0.15)',
      color: isAuditorOrDPA ? '#10b981' : '#0284c7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }}>
      {isAuditorOrDPA ? <ShieldCheck size={22} /> : <Ship size={22} />}
    </div>
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
          {currentUser?.name || userRole}
        </strong>
        <span className={`badge ${isAuditorOrDPA ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '0.68rem', fontWeight: 800 }}>
          {isAuditorOrDPA ? '🛡️ DPA / LEAD AUDITOR (OTORITAS PENUH)' : '⚓ AUDITEE LAPANGAN (ONBOARD KAPAL)'}
        </span>
        {assignedVesselId && (
          <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
            🔒 Terkunci Pada Kapal Tugas
          </span>
        )}
      </div>

      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span>
          <strong>Cakupan Wewenang:</strong>{' '}
          {isAuditorOrDPA
            ? `🏢 DOC Kantor Pusat + 🚢 Seluruh Armada (${vessels.length} Kapal SMC)`
            : `🚢 Terbatas Khusus Kapal Tugas (${currentTarget?.name || 'KM. RP 2020'})`}
        </span>
        <span>•</span>
        <span>
          <strong>Status Izin:</strong>{' '}
          {isAuditorOrDPA ? (
            <span style={{ color: '#10b981', fontWeight: 700 }}>
              ✓ Buka Sesi • ✓ Evaluasi Klausul • ✓ Terbitkan NC • ✓ Otorisasi Close NC • ✓ Fit-to-Sail
            </span>
          ) : (
            <span style={{ color: '#0284c7', fontWeight: 700 }}>
              ✓ Akses SMC Kapal • ✓ Lihat Checklist BKI • ✓ Ajukan Bukti Eviden (CAPA) | 🚫 Non-Aktif: Buka Sesi, Nilai Klausul, Self-Close NC
            </span>
          )}
        </span>
      </div>
    </div>
  </div>

  <button
    type="button"
    onClick={() => setShowRoleFlowModal(true)}
    className="btn btn-secondary btn-sm"
    style={{
      fontSize: '0.75rem',
      fontWeight: 800,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.45rem 0.85rem',
      color: '#0284c7',
      borderColor: 'rgba(2, 132, 199, 0.4)',
      background: 'var(--bg-surface-elevated)'
    }}
    title="Buka panduan lengkap alur audit dan Matriks Wewenang RACI ISM Code"
  >
    <Compass size={14} color="#0284c7" />
    <span>Matriks Wewenang & Alur Audit (RACI)</span>
  </button>
</div>
);
