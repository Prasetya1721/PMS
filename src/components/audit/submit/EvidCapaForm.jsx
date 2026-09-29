/**
 * EvidCapaForm.jsx
 * Diekstrak dari SubmitEvidenceModal.jsx (baris 352-548).
 * Sumber: Bagian I: form CAPA Nakhoda, analisis akar masalah (RCA), dan unggah bukti foto
 */
import React from 'react';
import { Eye, FileText, Sparkles, Upload } from 'lucide-react';

export const EvidCapaForm = ({
  agreedDate,
  correction,
  correctiveAction,
  fileName,
  fileSize,
  fileUrl,
  generateMockEvidence,
  handleApplyPresetRP2004,
  handleFileUpload,
  handleSubmitEvidence,
  preventiveAction,
  rootCause,
  setAgreedDate,
  setCorrection,
  setCorrectiveAction,
  setPreventiveAction,
  setRootCause,
  setSubmittedBy,
  submittedBy,
}) => {
  return (
    <form onSubmit={handleSubmitEvidence} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-success" style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                        🚢 Tanggung Jawab Nakhoda / Kapal
                      </span>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                        <FileText size={16} color="#10b981" />
                        <span>Bagian I: Rencana Tindakan Perbaikan (CAPA) & Unggah Eviden</span>
                      </h4>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
                      Nakhoda memimpin perbaikan fisik onboard, analisis akar masalah (RCA), dan melampirkan bukti foto untuk diserahkan ke DPA.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyPresetRP2004}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700 }}
                    title="Muat data contoh temuan kapal TB. RP 2004 Klausul 5.1.5"
                  >
                    <Sparkles size={12} />
                    <span>Muat Contoh RP 2004 (5.1.5)</span>
                  </button>
                </div>

                {/* 1. Perbaikan (Correction) */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    1. Perbaikan Langsung (Correction by Auditee) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={correction}
                    onChange={(e) => setCorrection(e.target.value)}
                    placeholder="Tuliskan tindakan koreksi langsung yang telah dilakukan..."
                    className="input-control"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* 2. Analisa Akar Permasalahan (RCA) */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    2. Analisa Akar Permasalahan (Root Cause Analysis - RCA) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={rootCause}
                    onChange={(e) => setRootCause(e.target.value)}
                    placeholder="Mengapa ketidaksesuaian ini bisa terjadi?..."
                    className="input-control"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* 3. Tindakan Perbaikan (Corrective Action) */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    3. Tindakan Perbaikan Jangka Panjang (Corrective Action Plan - CAP) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={correctiveAction}
                    onChange={(e) => setCorrectiveAction(e.target.value)}
                    placeholder="Tindakan sistematis agar ketidaksesuaian tidak terulang kembali..."
                    className="input-control"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* 4. Tindakan Pencegahan & Tanggal Kesepakatan */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                      4. Tindakan Pencegahan Terulang (Preventive Action) *
                    </label>
                    <input
                      type="text"
                      required
                      value={preventiveAction}
                      onChange={(e) => setPreventiveAction(e.target.value)}
                      placeholder="Langkah pencegahan berkala..."
                      className="input-control"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                      5. Tanggal Kesepakatan Penyelesaian (Agreed Date) *
                    </label>
                    <input
                      type="date"
                      required
                      value={agreedDate}
                      onChange={(e) => setAgreedDate(e.target.value)}
                      className="input-control mono"
                    />
                  </div>
                </div>

                {/* Evidence File Upload / Mock Generator */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      6. Dokumen Bukti Eviden (Foto Fisik / Dokumen PDF / Berita Acara)
                    </label>
                    <button
                      type="button"
                      onClick={generateMockEvidence}
                      style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <Sparkles size={12} />
                      <span>Buat Dokumen Bukti Cepat</span>
                    </button>
                  </div>

                  <div style={{
                    padding: '1.25rem',
                    borderRadius: '10px',
                    border: '2px dashed var(--border-subtle)',
                    background: 'var(--bg-input)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.65rem',
                    textAlign: 'center'
                  }}>
                    <Upload size={28} color="var(--text-subtle)" />
                    <div>
                      <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>Pilih File Bukti Eviden atau Gunakan Tombol Cepat</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Format JPG, PNG, PDF</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                      style={{ fontSize: '0.75rem' }}
                    />

                    {fileName && (
                      <div style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        background: 'rgba(2, 132, 199, 0.1)',
                        border: '1px solid rgba(2, 132, 199, 0.3)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.78rem',
                        color: '#0284c7',
                        marginTop: '0.4rem'
                      }}>
                        <span style={{ fontWeight: 700 }}>{fileName} ({fileSize})</span>
                        {fileUrl && (
                          <a href={fileUrl} target="_blank" rel="noreferrer" style={{ color: '#0284c7', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Eye size={13} />
                            <span>Lihat Berkas</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submitted By & Submit Button */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', alignItems: 'flex-end' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                      Nama Pengaju Eviden (PIC / Auditee)
                    </label>
                    <input
                      type="text"
                      required
                      value={submittedBy}
                      onChange={(e) => setSubmittedBy(e.target.value)}
                      className="input-control"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 700 }}
                  >
                    <Upload size={15} />
                    <span>Kirim Bukti Eviden (Submit Eviden)</span>
                  </button>
                </div>
              </form>
  );
};
