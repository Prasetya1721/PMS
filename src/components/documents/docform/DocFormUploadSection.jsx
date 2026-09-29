/**
 * DocFormUploadSection.jsx
 * Diekstrak dari DocumentFormModal.jsx (baris 2221-2388).
 * Sumber: Blok 6: unggah berkas scan sertifikat
 */
import React from 'react';
import { Eye, FileCheck, FileUp, Sparkles, Trash2, UploadCloud } from 'lucide-react';

export const DocFormUploadSection = ({
  fileInputRef,
  formData,
  handleFileUpload,
  handleRemoveFile,
  handleUseSamplePDF,
  setPreviewDoc,
  uploadError,
}) => {
  return (
    <div style={{
                padding: '1.1rem 1.25rem',
                borderRadius: '12px',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <UploadCloud size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span>Upload Berkas / Dokumen Scan Sertifikat</span>
                        {formData.fileUrl && (
                          <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                            ✓ Berkas Tersedia
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                        Unggah file scan PDF atau foto dokumen asli kapal (maksimal 15 MB).
                      </div>
                    </div>
                  </div>

                  {!formData.fileUrl && (
                    <button
                      type="button"
                      onClick={handleUseSamplePDF}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      title="Gunakan contoh berkas scan sertifikat digital untuk demonstrasi"
                    >
                      <Sparkles size={12} />
                      <span>Pasang Contoh PDF Resmi</span>
                    </button>
                  )}
                </div>

                {/* Upload Area / File Display */}
                {formData.fileUrl ? (
                  <div style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {formData.fileUrl && (formData.fileType?.includes('image') || formData.fileUrl.startsWith('data:image/')) ? (
                        <img
                          src={formData.fileUrl}
                          alt="Thumbnail"
                          onClick={() => setPreviewDoc(formData)}
                          style={{
                            width: '38px',
                            height: '38px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            border: '1px solid rgba(16, 185, 129, 0.4)',
                            cursor: 'pointer'
                          }}
                          title="Klik untuk melihat pratinjau dokumen"
                        />
                      ) : (
                        <FileCheck size={26} color="#10b981" />
                      )}
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {formData.fileName || 'Berkas_Sertifikat.pdf'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                          Ukuran: {formData.fileSize || '1.2 MB'} • Diunggah: {formData.uploadedAt ? new Date(formData.uploadedAt).toLocaleTimeString('id-ID') : 'Baru saja'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.fileUrl) {
                            setPreviewDoc({
                              ...formData,
                              name: formData.name || 'Dokumen Sertifikat'
                            });
                          }
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8' }}
                      >
                        <Eye size={13} />
                        <span>Lihat Berkas</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <Trash2 size={13} />
                        <span>Hapus Berkas</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,image/*,.doc,.docx"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                      id="doc-file-upload-input"
                    />
                    <label
                      htmlFor="doc-file-upload-input"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1.25rem 1rem',
                        borderRadius: '8px',
                        border: '2px dashed var(--border-subtle)',
                        background: 'rgba(0, 0, 0, 0.15)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'center'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10b981'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                    >
                      <FileUp size={28} color="#94a3b8" style={{ marginBottom: '0.4rem' }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        Klik untuk Pilih File Dokumen (PDF, JPG, PNG)
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                        Tersimpan otomatis ke sistem Cloud PMS dan dapat diunduh langsung dari tabel sertifikat
                      </span>
                    </label>
                  </div>
                )}

                {uploadError && (
                  <span style={{ fontSize: '0.72rem', color: '#ef4444' }}>
                    ⚠️ {uploadError}
                  </span>
                )}
              </div>
  );
};
