/**
 * FindingModalFooter.jsx
 * Diekstrak dari AuditFindingModal.jsx (baris 938-975).
 * Sumber: Footer modal (tombol submit)
 */
import React from 'react';
import { Clock, Save, Trash2 } from 'lucide-react';

export const FindingModalFooter = ({
  isAuditorOrDPA,
  isEdit,
  onClose,
  setShowDeleteConfirm,
}) => {
  return (
    <div className="modal-footer" style={{ borderTop: '1px solid var(--border-subtle)', padding: '0.85rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface-elevated)', backgroundColor: 'var(--bg-surface-elevated)', opacity: 1, flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button type="button" onClick={onClose} className="btn btn-secondary">
                    {isAuditorOrDPA ? 'Batal' : 'Tutup'}
                  </button>
                  {isEdit && isAuditorOrDPA && (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="btn btn-secondary"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        color: '#ef4444',
                        borderColor: 'rgba(239, 68, 68, 0.4)',
                        fontWeight: 700
                      }}
                      title="Hapus Temuan Ini"
                    >
                      <Trash2 size={14} />
                      <span>Hapus Temuan</span>
                    </button>
                  )}
                </div>

                {isAuditorOrDPA ? (
                  <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 800 }}>
                    <Save size={16} />
                    <span>{isEdit ? 'Simpan Perubahan Laporan NCR' : 'Simpan Laporan Ketidaksesuaian (NCR)'}</span>
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600 }}>
                    <Clock size={14} />
                    <span>Mode Tinjauan: Otorisasi penerbitan NCR wewenang Lead Auditor / DPA</span>
                  </div>
                )}
              </div>
  );
};
