/**
 * DocFormSubmitBar.jsx
 * Diekstrak dari DocumentFormModal.jsx (baris 2639-2687).
 * Sumber: Blok 8: bilah aksi simpan / kembali
 */
import React from 'react';
import { ArrowLeft, Save } from 'lucide-react';

export const DocFormSubmitBar = ({
  isEditing,
  onClose,
  setFormStep,
}) => {
  return (
    <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0.5rem',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1.25rem',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setFormStep(1)}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}
                  >
                    <ArrowLeft size={14} />
                    <span>Pilih Kategori Lain</span>
                  </button>
                ) : (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    * Perubahan tersimpan di Master Data dan armada Baharimas
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-secondary"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
                    }}
                  >
                    <Save size={15} />
                    <span>{isEditing ? 'Simpan Perubahan Sertifikat' : 'Simpan Sertifikat Dokumen'}</span>
                  </button>
                </div>
              </div>
  );
};
