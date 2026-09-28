/**
 * EditChecklistItemModal.jsx
 * Diekstrak dari AuditManager.jsx (baris 5264-5450).
 * Sumber: MODAL EDIT BUTIR CHECKLIST AUDIT
 */
import React from 'react';
import { Edit2, Save, X } from 'lucide-react';

export const EditChecklistItemModal = ({
  currentTarget,
  editManagerCheckPoint,
  editManagerCode,
  editManagerIsmCode,
  editManagerName,
  editManagerNotes,
  editManagerResult,
  handleSaveEditManagerItem,
  setEditManagerCheckPoint,
  setEditManagerCode,
  setEditManagerIsmCode,
  setEditManagerName,
  setEditManagerNotes,
  setEditManagerResult,
  setEditingManagerItem,
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
      maxWidth: '680px',
      background: 'var(--bg-surface-card)',
      backgroundColor: 'var(--bg-surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '14px',
      padding: '1.5rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      maxHeight: '90vh',
      overflowY: 'auto',
      opacity: 1
    }}>
      {/* Modal Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ padding: '0.45rem', borderRadius: '8px', background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7' }}>
            <Edit2 size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
              Edit Butir Pemeriksaan Checklist
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Target: <strong style={{ color: 'var(--text-main)' }}>{currentTarget?.name}</strong>
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setEditingManagerItem(null)}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.35rem 0.5rem' }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Modal Form */}
      <form onSubmit={handleSaveEditManagerItem} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr 130px', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              No. / Kode *
            </label>
            <input
              type="text"
              required
              value={editManagerCode}
              onChange={(e) => setEditManagerCode(e.target.value)}
              className="input-control mono"
              style={{ fontWeight: 800, color: '#0284c7' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Area Pemeriksaan / Items to be checked *
            </label>
            <input
              type="text"
              required
              value={editManagerName}
              onChange={(e) => setEditManagerName(e.target.value)}
              className="input-control"
              style={{ fontWeight: 700 }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Ref. ISM Code
            </label>
            <input
              type="text"
              value={editManagerIsmCode}
              onChange={(e) => setEditManagerIsmCode(e.target.value)}
              placeholder="cth: 10, 5.1"
              className="input-control mono"
              style={{ color: '#0284c7' }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
            Kriteria Verifikasi / Check Point Pemeriksaan
          </label>
          <textarea
            rows={3}
            value={editManagerCheckPoint}
            onChange={(e) => setEditManagerCheckPoint(e.target.value)}
            placeholder="Detail dokumen, peralatan, sertifikat, atau prosedur yang diverifikasi..."
            className="input-control"
            style={{ fontSize: '0.8rem', lineHeight: '1.4', resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
            Hasil Evaluasi (Checklist)
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { id: 'Complied', label: '✅ Yes (Sesuai)', bg: '#10b981' },
              { id: 'Minor NC', label: '⚠️ Minor NC (No)', bg: '#f59e0b' },
              { id: 'Major NC', label: '🚨 Major NC (No)', bg: '#dc2626' },
              { id: 'Observation', label: '👁️ Observasi', bg: '#6366f1' },
              { id: 'N/A', label: '⚪ N/A (Tidak Berlaku)', bg: '#64748b' },
              { id: '', label: '⭕ Kosongkan', bg: 'var(--border-subtle)' }
            ].map(opt => {
              const isSelected = editManagerResult === opt.id || (opt.id === 'Complied' && editManagerResult === 'Yes');
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setEditManagerResult(opt.id)}
                  style={{
                    padding: '0.3rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: isSelected ? 800 : 500,
                    cursor: 'pointer',
                    border: isSelected ? `2px solid ${opt.bg}` : '1px solid var(--border-subtle)',
                    background: isSelected ? opt.bg : 'var(--bg-surface-elevated)',
                    color: isSelected ? '#ffffff' : 'var(--text-main)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
            Catatan / Temuan Bukti Fisik
          </label>
          <textarea
            rows={2}
            value={editManagerNotes}
            onChange={(e) => setEditManagerNotes(e.target.value)}
            placeholder="Catatan temuan atau catatan fisik..."
            className="input-control"
            style={{ fontSize: '0.8rem', resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => setEditingManagerItem(null)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.45rem 1rem' }}
          >
            Batal
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            style={{ padding: '0.45rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
          >
            <Save size={14} />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>
    </div>
  </div>
);
