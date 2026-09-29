/**
 * RoleFlowFooter.jsx
 * Diekstrak dari AuditRoleFlowModal.jsx (baris 982-1011).
 * Sumber: Footer modal
 */
import React from 'react';

export const RoleFlowFooter = ({
  isDoc,
  onClose,
}) => {
  return (
    <div
              style={{
                padding: '0.85rem 1.5rem',
                background: 'var(--bg-surface-elevated)',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Standar Acuan:{' '}
                <strong>
                  {isDoc
                    ? 'BKI F23.14.05-2025 Rev 06 & IMO ISM Code Resolution A.741(18) (13 Seksi DOC Kantor)'
                    : 'BKI F23.14.06-2024 Rev 05 & IMO ISM Code Resolution A.741(18) (74 Klausul SMC Shipboard)'}
                </strong>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary btn-sm"
                style={{ fontWeight: 700 }}
              >
                Tutup Panduan
              </button>
            </div>
  );
};
