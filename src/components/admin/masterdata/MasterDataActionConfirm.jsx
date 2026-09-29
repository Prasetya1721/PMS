/**
 * MasterDataActionConfirm.jsx
 * Diekstrak dari MasterDataAdmin.jsx (baris 3755-3853).
 * Sumber: Modal konfirmasi aksi in-app
 */
import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const MasterDataActionConfirm = ({
  actionConfirmModal,
  setActionConfirmModal,
}) => {
  return (
    <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(2, 6, 23, 0.82)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem',
              zIndex: 99999
            }}>
              <div className="glass-card" style={{
                maxWidth: '520px',
                width: '100%',
                background: 'var(--bg-card, #0f172a)',
                border: '1px solid var(--border-glass)',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: `${actionConfirmModal.confirmColor}22`,
                    border: `1px solid ${actionConfirmModal.confirmColor}55`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: actionConfirmModal.confirmColor,
                    flexShrink: 0
                  }}>
                    {actionConfirmModal.icon ? <actionConfirmModal.icon size={22} /> : <AlertTriangle size={22} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                      {actionConfirmModal.title}
                    </h3>
                    {actionConfirmModal.subtitle && (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem', margin: 0 }}>
                        {actionConfirmModal.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ padding: '1.5rem' }}>
                  <p style={{ fontSize: '0.875rem', lineHeight: '1.55', color: 'var(--text-main)', margin: 0 }}>
                    {actionConfirmModal.message}
                  </p>
                </div>

                <div style={{
                  padding: '1rem 1.5rem',
                  background: 'rgba(0, 0, 0, 0.25)',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.75rem'
                }}>
                  <button
                    type="button"
                    onClick={() => setActionConfirmModal(null)}
                    className="btn btn-secondary"
                    style={{ minWidth: '90px' }}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={actionConfirmModal.onConfirm}
                    className="btn"
                    style={{
                      background: actionConfirmModal.confirmColor,
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.55rem 1.25rem',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    {actionConfirmModal.confirmLabel}
                  </button>
                </div>
              </div>
            </div>
  );
};
