/**
 * EvidencePreviewModal.jsx
 * Diekstrak dari AuditManager.jsx (baris 5203-5261).
 * Sumber: Modal Preview Bukti Audit Checklist Onboard
 */
import React from 'react';
import { Eye, FileText, X } from 'lucide-react';

export const EvidencePreviewModal = ({
  previewChecklistEvidence,
  setPreviewChecklistEvidence,
}) => (
<div
    className="modal-overlay"
    style={{ zIndex: 12000, background: 'rgba(0,0,0,0.75)' }}
    onClick={() => setPreviewChecklistEvidence(null)}
  >
    <div
      className="modal-dialog"
      style={{ maxWidth: '720px', width: '90%', background: 'var(--bg-surface)', borderRadius: '12px', overflow: 'hidden' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Eye size={18} color="#0284c7" />
          <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Pratinjau Bukti Audit: {previewChecklistEvidence.fileName}</h4>
        </div>
        <button
          type="button"
          onClick={() => setPreviewChecklistEvidence(null)}
          className="btn btn-secondary btn-sm"
        >
          <X size={15} />
        </button>
      </div>
      <div style={{ padding: '1.25rem', textAlign: 'center', background: 'var(--bg-input)' }}>
        {previewChecklistEvidence.fileUrl?.startsWith('data:image') || previewChecklistEvidence.fileName?.endsWith('.svg') || previewChecklistEvidence.fileName?.endsWith('.png') || previewChecklistEvidence.fileName?.endsWith('.jpg') ? (
          <img
            src={previewChecklistEvidence.fileUrl}
            alt="Bukti Audit"
            style={{ maxWidth: '100%', maxHeight: '480px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
          />
        ) : (
          <div style={{ padding: '2rem', background: 'var(--bg-surface)', borderRadius: '8px' }}>
            <FileText size={48} color="#0284c7" style={{ margin: '0 auto 1rem' }} />
            <p style={{ fontWeight: 700 }}>{previewChecklistEvidence.fileName}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ukuran Berkas: {previewChecklistEvidence.fileSize}</p>
            <a
              href={previewChecklistEvidence.fileUrl}
              download={previewChecklistEvidence.fileName}
              className="btn btn-primary btn-sm"
              style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span>Unduh Dokumen Berkas</span>
            </a>
          </div>
        )}
      </div>
      <div className="modal-footer" style={{ padding: '0.65rem 1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => setPreviewChecklistEvidence(null)}
          className="btn btn-secondary btn-sm"
        >
          Tutup Pratinjau
        </button>
      </div>
    </div>
  </div>
);
