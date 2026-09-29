/**
 * DocFormStep2InfoBanner.jsx
 * Diekstrak dari DocumentFormModal.jsx (baris 1758-1814).
 * Sumber: Step 2: banner info profil kategori dokumen
 */
import React from 'react';
import { FileText, RotateCcw } from 'lucide-react';

export const DocFormStep2InfoBanner = ({
  currentProfile,
  setFormStep,
}) => {
  return (
    <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  background: currentProfile.bgColor,
                  border: `1px solid ${currentProfile.borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: currentProfile.color,
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800
                    }}>
                      {React.createElement(currentProfile.icon || FileText, { size: 18 })}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span>Kategori Terpilih: {currentProfile.label}</span>
                        <span className="badge" style={{ fontSize: '0.62rem', background: 'rgba(255, 255, 255, 0.2)', color: '#fff' }}>
                          AKTIF
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                        {currentProfile.tagline}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFormStep(1)}
                    className="btn btn-secondary btn-sm"
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.35rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      borderRadius: '6px'
                    }}
                    title="Kembali ke pemilihan kategori"
                  >
                    <RotateCcw size={13} />
                    <span>Ganti Kategori</span>
                  </button>
                </div>
  );
};
