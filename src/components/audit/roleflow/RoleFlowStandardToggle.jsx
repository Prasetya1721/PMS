/**
 * RoleFlowStandardToggle.jsx
 * Diekstrak dari AuditRoleFlowModal.jsx (baris 544-642).
 * Sumber: Segmented toggle pilih standar SMC vs DOC
 */
import React from 'react';
import { ArrowRight, Building2, Ship } from 'lucide-react';

export const RoleFlowStandardToggle = ({
  activeTab,
  isDoc,
  onClose,
  onSelectPerspective,
  setStandard,
  standard,
}) => {
  return (
    <div
              style={{
                padding: '0.65rem 1.5rem',
                background: 'var(--bg-surface-elevated)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              {/* Segmented Standard Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                  PILIH STANDAR PETUNJUK:
                </span>
                <div style={{
                  display: 'inline-flex',
                  background: 'var(--bg-surface)',
                  padding: '3px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  gap: '4px'
                }}>
                  <button
                    type="button"
                    onClick={() => setStandard('SMC')}
                    style={{
                      border: 'none',
                      background: standard === 'SMC' ? '#0284c7' : 'transparent',
                      color: standard === 'SMC' ? '#ffffff' : 'var(--text-muted)',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      padding: '0.35rem 0.85rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Ship size={14} />
                    <span>Petunjuk Audit SMC (Kapal Armada)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStandard('DOC')}
                    style={{
                      border: 'none',
                      background: standard === 'DOC' ? '#d97706' : 'transparent',
                      color: standard === 'DOC' ? '#ffffff' : 'var(--text-muted)',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      padding: '0.35rem 0.85rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Building2 size={14} />
                    <span>Petunjuk Audit DOC (Kantor Darat PT. PBK)</span>
                  </button>
                </div>
              </div>

              {/* Quick Perspective Apply Button */}
              {onSelectPerspective && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectPerspective(activeTab === 'auditee' ? 'nakhoda' : 'dpa');
                    onClose();
                  }}
                  className="btn btn-primary btn-sm"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: isDoc && activeTab !== 'auditee' ? '#d97706' : undefined,
                    borderColor: isDoc && activeTab !== 'auditee' ? '#d97706' : undefined
                  }}
                >
                  <span>
                    Aktifkan Sudut Pandang {activeTab === 'auditee'
                      ? (isDoc ? 'Divisi Darat (Auditee)' : 'Nakhoda (Kapal)')
                      : (isDoc ? 'Auditor & DPA' : 'DPA (Darat)')}
                  </span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
  );
};
