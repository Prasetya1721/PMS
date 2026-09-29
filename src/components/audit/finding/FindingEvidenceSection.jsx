/**
 * FindingEvidenceSection.jsx
 * Diekstrak dari AuditFindingModal.jsx (baris 837-892).
 * Sumber: SEKSI 8: Upload Bukti Eviden
 */
import React from 'react';
import { Upload } from 'lucide-react';

export const FindingEvidenceSection = ({
  evidenceFileName,
  evidenceFileSize,
  handleFileUpload,
  setEvidenceFileName,
  setEvidenceFileSize,
  setEvidenceFileUrl,
}) => {
  return (
    <div style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  background: 'var(--bg-surface-elevated)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  opacity: 1
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Upload size={14} color="#0284c7" />
                      <span>Lampiran Dokumen Bukti Eviden Perbaikan (PDF / Scan / Foto):</span>
                    </span>
                    {evidenceFileName && (
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                        ✓ Terlampir: {evidenceFileName} ({evidenceFileSize})
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <input
                      type="file"
                      id="findingEvidenceUpload"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                      accept=".pdf,.jpg,.jpeg,.png,.svg,.doc,.docx"
                    />
                    <label
                      htmlFor="findingEvidenceUpload"
                      className="btn btn-secondary btn-sm"
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <Upload size={14} />
                      <span>Pilih File Eviden dari Komputer</span>
                    </label>

                    {evidenceFileName && (
                      <button
                        type="button"
                        onClick={() => {
                          setEvidenceFileName('');
                          setEvidenceFileSize('');
                          setEvidenceFileUrl('');
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#ef4444' }}
                      >
                        Hapus File
                      </button>
                    )}
                  </div>
                </div>
  );
};
