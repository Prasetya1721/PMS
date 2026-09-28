/**
 * DeleteChecklistItemModal.jsx
 * Diekstrak dari AuditManager.jsx (baris 5453-5530).
 * Sumber: MODAL KONFIRMASI HAPUS BUTIR CHECKLIST
 */
import React from 'react';
import { Trash2 } from 'lucide-react';

export const DeleteChecklistItemModal = ({
  currentTarget,
  deleteManagerItemTarget,
  handleConfirmDeleteManagerItem,
  setDeleteManagerItemTarget,
}) => (
<div style={{
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(4px)',
    zIndex: 16000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
  }}>
    <div className="glass-card" style={{
      width: '100%',
      maxWidth: '440px',
      background: 'var(--bg-surface-card)',
      backgroundColor: 'var(--bg-surface-card)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '14px',
      padding: '1.5rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      opacity: 1
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
          <Trash2 size={22} />
        </div>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
            Hapus Butir Checklist?
          </h4>
          <span className="mono" style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700 }}>
            {deleteManagerItemTarget.code} - {deleteManagerItemTarget.name}
          </span>
        </div>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
        Butir pemeriksaan ini akan dihapus dari daftar checklist {currentTarget?.name}. Apakah Anda yakin?
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.35rem' }}>
        <button
          type="button"
          onClick={() => setDeleteManagerItemTarget(null)}
          className="btn btn-secondary btn-sm"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={handleConfirmDeleteManagerItem}
          className="btn btn-sm"
          style={{
            background: '#ef4444',
            color: '#ffffff',
            border: 'none',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.45rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          <Trash2 size={13} />
          <span>Ya, Hapus Butir</span>
        </button>
      </div>
    </div>
  </div>
);
