/**
 * DeleteConfirmModal.jsx
 * Diekstrak dari AuditManager.jsx (baris 5533-5673).
 * Sumber: IN-APP CONFIRMATION MODAL FOR DELETION (NO BLOCKED WINDOW.CONFIRM)
 */
import React from 'react';
import { Trash2, X } from 'lucide-react';

export const DeleteConfirmModal = ({
  deleteConfirmModal,
  setDeleteConfirmModal,
}) => (
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
    onClick={() => setDeleteConfirmModal(null)}
  >
    <div
      className="glass-card"
      style={{
        maxWidth: '480px',
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
      {/* Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface-elevated)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem'
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ef4444',
          flexShrink: 0
        }}>
          <Trash2 size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
            {deleteConfirmModal.title}
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 700, margin: '0.15rem 0 0 0' }}>
            Tindakan ini permanen & tidak dapat dibatalkan
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDeleteConfirmModal(null)}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.3rem 0.5rem' }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{
          padding: '0.85rem 1rem',
          borderRadius: '8px',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
            {deleteConfirmModal.type === 'session' ? 'Nomor Sesi Audit:' : 'Nomor Temuan:'}
          </div>
          <div className="mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ef4444' }}>
            {deleteConfirmModal.code}
          </div>
          {deleteConfirmModal.targetName && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Target Armada: <strong style={{ color: 'var(--text-main)' }}>{deleteConfirmModal.targetName}</strong>
            </div>
          )}
        </div>

        <p style={{ fontSize: '0.82rem', lineHeight: '1.55', color: 'var(--text-muted)', margin: 0 }}>
          {deleteConfirmModal.details}
        </p>
      </div>

      {/* Footer */}
      <div style={{
        padding: '1rem 1.5rem',
        background: 'var(--bg-surface-elevated)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.75rem'
      }}>
        <button
          type="button"
          onClick={() => setDeleteConfirmModal(null)}
          className="btn btn-secondary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
        >
          Batal
        </button>
        <button
          type="button"
          onClick={deleteConfirmModal.onConfirm}
          className="btn"
          style={{
            background: '#ef4444',
            color: '#ffffff',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.82rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 1.25rem',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          <Trash2 size={14} />
          <span>Ya, Hapus Permanen</span>
        </button>
      </div>
    </div>
  </div>
);
