/**
 * FindingDeleteConfirm.jsx
 * Diekstrak dari AuditFindingModal.jsx (baris 980-1051).
 * Sumber: Dialog konfirmasi hapus temuan
 */
import React from 'react';
import { Trash2, X } from 'lucide-react';

export const FindingDeleteConfirm = ({
  deleteAuditFinding,
  finding,
  onClose,
  setShowDeleteConfirm,
}) => {
  return (
    <div
              className="modal-overlay"
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 15000,
                background: 'rgba(3, 7, 18, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem'
              }}
              onClick={() => setShowDeleteConfirm(false)}
            >
              <div
                className="glass-card"
                style={{
                  maxWidth: '460px',
                  width: '100%',
                  background: 'var(--bg-surface-card)',
                  backgroundColor: 'var(--bg-surface-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.75)',
                  overflow: 'hidden',
                  opacity: 1
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                    <Trash2 size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Hapus Temuan Ketidaksesuaian</h3>
                    <p style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700, margin: '0.15rem 0 0 0' }}>Tindakan ini tidak dapat dibatalkan</p>
                  </div>
                  <button type="button" onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.5rem' }}>
                    <X size={15} />
                  </button>
                </div>
                <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Nomor Temuan (NCR):</div>
                    <div className="mono" style={{ fontSize: '1rem', fontWeight: 800, color: '#ef4444' }}>{finding?.findingNo}</div>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                    Catatan temuan ini beserta seluruh data rencana tindakan koreksi dan eviden yang terlampir akan dihapus permanen.
                  </p>
                </div>
                <div style={{ padding: '0.85rem 1.5rem', background: 'var(--bg-surface-elevated)', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary btn-sm" style={{ padding: '0.45rem 1rem' }}>
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteAuditFinding(finding?.id || finding?.findingNo);
                      setShowDeleteConfirm(false);
                      onClose();
                    }}
                    className="btn btn-sm"
                    style={{ background: '#ef4444', color: '#fff', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 1.1rem' }}
                  >
                    <Trash2 size={14} />
                    <span>Ya, Hapus Temuan</span>
                  </button>
                </div>
              </div>
            </div>
  );
};
