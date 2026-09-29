/**
 * DocFormStep2Header.jsx
 * Diekstrak dari DocumentFormModal.jsx (baris 1711-1755).
 * Sumber: Step 2: kepala form (judul dokumen + tombol tutup)
 */
import React from 'react';
import { FileText, X } from 'lucide-react';

export const DocFormStep2Header = ({
  currentProfile,
  formData,
  isEditing,
  onClose,
}) => {
  return (
    <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.25rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: currentProfile.bgColor,
                      border: `1px solid ${currentProfile.borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: currentProfile.color,
                      transition: 'all 0.25s ease'
                    }}>
                      {React.createElement(currentProfile.icon || FileText, { size: 24 })}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{isEditing ? `Edit Dokumen: ${formData.name}` : 'Form Pengisian Dokumen Kapal'}</span>
                        <span className="badge" style={{ fontSize: '0.7rem', background: currentProfile.bgColor, color: currentProfile.color, border: `1px solid ${currentProfile.borderColor}` }}>
                          {currentProfile.shortLabel}
                        </span>
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Kategori Maritim: <strong style={{ color: currentProfile.color }}>{currentProfile.label}</strong>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '34px', height: '34px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <X size={18} />
                  </button>
                </div>
  );
};
