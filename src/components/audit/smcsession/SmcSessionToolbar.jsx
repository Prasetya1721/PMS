/**
 * SmcSessionToolbar.jsx
 * Diekstrak dari SmcSessionModal.jsx (baris 353-439).
 * Sumber: Toolbar status audit + tombol aksi cepat
 */
import React from 'react';
import { Sparkles } from 'lucide-react';
import { EXTERNAL_AUDIT_ORGANIZATIONS } from '../../../data/auditMasterData';

export const SmcSessionToolbar = ({
  applyAuditTypeSwitch,
  applyDemoPreset,
  auditType,
  externalOrganization,
  isEdit,
  setExternalOrganization,
}) => {
  return (
    <div style={{
              padding: '0.55rem 1.25rem',
              background: 'rgba(2, 132, 199, 0.05)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.6rem'
            }}>
              {/* Jenis Audit Switch */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  Jenis Audit:
                </span>
                <div style={{ display: 'inline-flex', background: 'var(--bg-surface)', padding: '2px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <button
                    type="button"
                    onClick={() => applyAuditTypeSwitch('Internal')}
                    style={{
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.74rem',
                      fontWeight: auditType === 'Internal' ? 800 : 500,
                      borderRadius: '4px',
                      border: 'none',
                      background: auditType === 'Internal' ? 'var(--primary)' : 'transparent',
                      color: auditType === 'Internal' ? '#ffffff' : 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    🏢 Internal PBK
                  </button>
                  <button
                    type="button"
                    onClick={() => applyAuditTypeSwitch('External')}
                    style={{
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.74rem',
                      fontWeight: auditType === 'External' ? 800 : 500,
                      borderRadius: '4px',
                      border: 'none',
                      background: auditType === 'External' ? '#0284c7' : 'transparent',
                      color: auditType === 'External' ? '#ffffff' : 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    🏛️ Eksternal (BKI / Flag State)
                  </button>
                </div>

                {auditType === 'External' && (
                  <select
                    value={externalOrganization}
                    onChange={(e) => setExternalOrganization(e.target.value)}
                    className="form-control"
                    style={{ fontSize: '0.74rem', padding: '0.25rem 0.5rem', height: 'auto', minWidth: '190px' }}
                  >
                    {EXTERNAL_AUDIT_ORGANIZATIONS.map(org => (
                      <option key={org.id} value={org.name}>{org.name}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Quick Demo Preset */}
              {!isEdit && (
                <button
                  type="button"
                  onClick={applyDemoPreset}
                  className="btn btn-secondary btn-sm"
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.6rem',
                    color: '#0284c7',
                    borderColor: 'rgba(2, 132, 199, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                  title="Muat data contoh audit resmi SMC TB. RP 2004"
                >
                  <Sparkles size={13} color="#0284c7" />
                  <span>Contoh SMC RP 2004</span>
                </button>
              )}
            </div>
  );
};
