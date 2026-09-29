/**
 * TechnicalWOFormActions.jsx
 * Diekstrak dari TechnicalWorkOrderModal.jsx (baris 852-895).
 * Sumber: Tombol aksi bawah form (simpan draf / selesaikan siklus servis)
 */
import React from 'react';
import { CheckCircle2, Save } from 'lucide-react';

export const TechnicalWOFormActions = ({
  handleCompleteWorkOrder,
  isCompleted,
  isEdit,
  onClose,
}) => {
  return (
    <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '1.25rem',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-neutral"
                  >
                    Tutup
                  </button>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {!isCompleted && (
                      <button
                        type="submit"
                        className="btn btn-secondary"
                      >
                        <Save size={16} />
                        <span>Simpan Draf WO</span>
                      </button>
                    )}

                    {!isCompleted && isEdit && (
                      <button
                        type="button"
                        onClick={handleCompleteWorkOrder}
                        className="btn btn-success"
                        style={{
                          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                          padding: '0.65rem 1.4rem'
                        }}
                      >
                        <CheckCircle2 size={18} />
                        <span>Selesaikan & Tutup Siklus Servis</span>
                      </button>
                    )}
                  </div>
                </div>
  );
};
