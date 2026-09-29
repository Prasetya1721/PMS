/**
 * DocTrackerPreviewModal.jsx
 * Diekstrak dari DocumentTracker.jsx (baris 541-663).
 * Sumber: Modal pratinjau berkas scan sertifikat resmi
 */
import React from 'react';
import { CalendarPlus, FileCheck, QrCode, Send, X } from 'lucide-react';

export const DocTrackerPreviewModal = ({
  previewDoc,
  setCalModalDoc,
  setPreviewDoc,
  setWaModalDoc,
  vessels,
}) => {
  return (
    <div className="modal-overlay" onClick={() => setPreviewDoc(null)}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <FileCheck size={20} color="#10b981" />
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Dokumen Scan Sertifikat Resmi</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Verifikasi Digital Cloud PMS • ID: {previewDoc.id}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewDoc(null)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Certificate Canvas Mock */}
                  <div style={{
                    background: '#ffffff',
                    color: '#0f172a',
                    padding: '2rem',
                    borderRadius: '8px',
                    border: '4px double #cbd5e1',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                    position: 'relative'
                  }}>
                    <div style={{ textAlign: 'center', borderBottom: '2px solid #0284c7', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.1em', color: '#0369a1', textTransform: 'uppercase' }}>
                        REPUBLIK INDONESIA - KEMENTERIAN PERHUBUNGAN
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        DIREKTORAT JENDERAL PERHUBUNGAN LAUT / BIRO KLASIFIKASI INDONESIA
                      </div>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.5rem', color: '#0f172a' }}>
                        {previewDoc.name}
                      </h4>
                      <div className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7' }}>
                        NO: {previewDoc.certificateNo || previewDoc.documentNo}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Diberikan Kepada:</span>
                        <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                          {previewDoc.crewName || vessels.find(v => v.id === previewDoc.vesselId)?.name}
                        </p>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Instansi Penerbit:</span>
                        <p style={{ fontWeight: 600 }}>{previewDoc.issuer}</p>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Tanggal Terbit:</span>
                        <p className="mono">{previewDoc.issueDate}</p>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Tanggal Kadaluarsa (Expiry):</span>
                        <p className="mono" style={{ fontWeight: 800, color: previewDoc.status === 'Expired' ? '#ef4444' : '#0284c7' }}>
                          {previewDoc.expiryDate}
                        </p>
                      </div>
                    </div>

                    {/* Stamp & QR Verification */}
                    <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <QrCode size={40} color="#0f172a" />
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          Verified Authentic<br />Ditjen Hubla System
                        </div>
                      </div>
                      <div style={{
                        padding: '0.35rem 0.85rem',
                        border: '2px solid #10b981',
                        color: '#059669',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        borderRadius: '4px',
                        transform: 'rotate(-5deg)',
                        textTransform: 'uppercase'
                      }}>
                        REGISTERED OFFICIAL
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button onClick={() => setPreviewDoc(null)} className="btn btn-secondary">
                    Tutup
                  </button>
                  <button
                    onClick={() => {
                      setCalModalDoc(previewDoc);
                      setPreviewDoc(null);
                    }}
                    className="btn btn-secondary"
                    style={{ color: '#38bdf8' }}
                  >
                    <CalendarPlus size={14} />
                    <span>+ Google Calendar</span>
                  </button>
                  <button
                    onClick={() => {
                      setWaModalDoc(previewDoc);
                      setPreviewDoc(null);
                    }}
                    className="btn btn-whatsapp"
                  >
                    <Send size={14} />
                    <span>Kirim Notifikasi WA</span>
                  </button>
                </div>
              </div>
            </div>
  );
};
