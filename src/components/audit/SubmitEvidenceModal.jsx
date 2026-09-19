import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileText,
  FileCheck,
  Package,
  Ship,
  Building2,
  User,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Check,
  Eye,
  Camera,
  Maximize2,
  Minimize2,
  Clock
} from 'lucide-react';
import { calculateNCRange } from '../../utils/auditTimeUtils';

export const SubmitEvidenceModal = ({ finding, onClose }) => {
  const {
    submitAuditEvidence,
    closeAuditFinding,
    reopenAuditFinding,
    shipDocuments,
    requisitions,
    currentUser
  } = usePMS();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const evidence = finding?.evidence || {};

  const [rootCause, setRootCause] = useState(
    evidence.rootCause ||
    'Prosedur operasional belum terkoordinasi secara efektif antara departemen logistik dan personil kapal saat pergantian jadwal.'
  );
  const [correctiveAction, setCorrectiveAction] = useState(
    evidence.correctiveAction ||
    'Telah dilakukan perbaikan langsung, penataan ulang dokumen catatan dan inspeksi fisik menyeluruh oleh tim penanggung jawab.'
  );
  const [preventiveAction, setPreventiveAction] = useState(
    evidence.preventiveAction ||
    'Menetapkan jadwal briefing rutin mingguan, audit silang internal, dan pembaruan checklist kepatuhan standar ISM Code.'
  );
  const [submittedBy, setSubmittedBy] = useState(
    evidence.submittedBy || currentUser?.name || finding?.assignedTo || 'Auditee PT. Pelayaran Baharimas Kalimantan'
  );

  const [fileName, setFileName] = useState(evidence.fileName || '');
  const [fileUrl, setFileUrl] = useState(evidence.fileUrl || '');
  const [fileSize, setFileSize] = useState(evidence.fileSize || '');

  const [auditorNotes, setAuditorNotes] = useState(
    evidence.auditorReviewNotes ||
    'Tindakan koreksi dan dokumen bukti perbaikan telah diverifikasi oleh Lead Auditor. Implementasi dinyatakan efektif dan sesuai standar ISM Code.'
  );

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${(file.size / 1024).toFixed(1)} KB`);
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        setFileUrl(loadEvt.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateMockEvidence = () => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <rect width="100%" height="100%" fill="#0f172a"/>
      <rect x="20" y="20" width="560" height="360" rx="12" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
      <circle cx="300" cy="110" r="45" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-width="3"/>
      <path d="M280 110 L295 125 L325 95" stroke="#10b981" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <text x="300" y="190" font-family="sans-serif" font-size="20" font-weight="bold" fill="#f8fafc" text-anchor="middle">BUKTI EVIDEN PERBAIKAN ISM CODE</text>
      <text x="300" y="220" font-family="sans-serif" font-size="14" fill="#38bdf8" text-anchor="middle">PT. PELAYARAN BAHARIMAS KALIMANTAN</text>
      <text x="300" y="250" font-family="monospace" font-size="13" fill="#cbd5e1" text-anchor="middle">Temuan: ${finding.findingNo} | Klausul: ${finding.clauseCode}</text>
      <text x="300" y="280" font-family="sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">Lokasi: ${finding.targetName || 'Kantor Pusat / Kapal Armada'}</text>
      <rect x="180" y="315" width="240" height="35" rx="6" fill="#047857"/>
      <text x="300" y="338" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">VERIFIED AUDIT EVIDENCE</text>
    </svg>`;
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
    setFileName(`EVIDEN_${finding.findingNo}_PERBAIKAN_PBK.svg`);
    setFileSize('18.4 KB');
    setFileUrl(dataUrl);
  };

  const handleSubmitEvidence = (e) => {
    e.preventDefault();
    submitAuditEvidence(finding.id, {
      rootCauseAnalysis: rootCause,
      correctiveAction,
      preventiveAction,
      submittedBy,
      fileName: fileName || `EVIDEN_PERBAIKAN_${finding.findingNo}.pdf`,
      fileUrl: fileUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=600&q=80',
      fileSize: fileSize || '245 KB'
    });
    onClose();
  };

  const handleCloseNC = () => {
    closeAuditFinding(finding.id, {
      closedBy: currentUser?.name || 'Lead Auditor DPA',
      auditorNotes
    });
    onClose();
  };

  const handleReopenNC = () => {
    reopenAuditFinding(finding.id, {
      auditorNotes
    });
    onClose();
  };

  const linkedDoc = finding.linkedCertificateId
    ? shipDocuments.find(d => d.id === finding.linkedCertificateId)
    : null;

  const linkedReq = finding.linkedRequisitionId
    ? requisitions.find(r => r.id === finding.linkedRequisitionId)
    : null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div
        className={isFullscreen ? 'modal-fullscreen' : 'modal-dialog modal-dialog-large'}
        style={{
          maxWidth: isFullscreen ? '98vw' : '820px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              padding: '0.5rem',
              borderRadius: '10px',
              background: finding.status === 'NC Close' ? 'rgba(16, 185, 129, 0.15)' : finding.status === 'Eviden Submitted' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: finding.status === 'NC Close' ? '#10b981' : finding.status === 'Eviden Submitted' ? '#f59e0b' : '#ef4444'
            }}>
              {finding.status === 'NC Close' ? <CheckCircle2 size={24} /> : <ShieldCheck size={24} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h3 className="mono" style={{ fontSize: '1.15rem', fontWeight: 800 }}>{finding.findingNo}</h3>
                <span className={`badge ${
                  finding.status === 'NC Close' ? 'badge-success' : finding.status === 'Eviden Submitted' ? 'badge-warning' : 'badge-danger-pulse'
                }`}>
                  {finding.status}
                </span>
                <span className="badge badge-neutral">{finding.category}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Klausul: <strong className="mono" style={{ color: '#0284c7' }}>{finding.clauseCode}</strong> - {finding.clauseName}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.6rem' }}
              title={isFullscreen ? 'Kecilkan Layar' : 'Layar Penuh (Fullscreen)'}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              <span style={{ fontSize: '0.75rem' }}>{isFullscreen ? 'Normal' : 'Fullscreen'}</span>
            </button>
            <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.6rem' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Finding Context Card */}
          {(() => {
            const range = calculateNCRange(finding);
            return (
              <div style={{ padding: '1rem 1.15rem', borderRadius: '10px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {finding.standard === 'DOC' ? <Building2 size={13} color="#10b981" /> : <Ship size={13} color="#38bdf8" />}
                    <span>Target: <strong style={{ color: 'var(--text-main)' }}>{finding.targetName}</strong></span>
                  </div>
                  <div>
                    <span>PIC: <strong style={{ color: 'var(--text-main)' }}>{finding.assignedTo}</strong></span>
                  </div>
                </div>

                {/* Timeline Rentang Waktu Box */}
                {range && (
                  <div style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    background: range.bgLight,
                    border: `1px solid ${range.borderColor}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: range.color }}>
                        <Clock size={14} />
                        <span>{range.isClosed ? 'Rentang Waktu Penutupan (Lead Time Close):' : 'Rentang Waktu Penyelesaian (Open to Due Date):'}</span>
                      </div>
                      <span className={`badge ${range.badgeClass}`} style={{ fontSize: '0.7rem', fontWeight: 800 }}>
                        {range.badgeText}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.72rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Open: <strong style={{ color: 'var(--text-main)' }}>{range.openDateStr}</strong></span>
                      <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${range.percentUsed}%`,
                          background: range.isClosed ? '#10b981' : range.isOverdue ? '#ef4444' : '#f59e0b',
                          borderRadius: '3px'
                        }} />
                      </div>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {range.isClosed ? `Close: ${range.closedDateStr}` : `Due: ${range.dueDateStr}`}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {range.timelineSummary}
                    </div>
                  </div>
                )}

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 700, display: 'block' }}>Deskripsi Ketidaksesuaian:</span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.15rem', lineHeight: '1.4' }}>{finding.description}</p>
            </div>

            {finding.objectiveEvidence && (
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 700, display: 'block' }}>Bukti Objektif Auditor:</span>
                <p className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{finding.objectiveEvidence}</p>
              </div>
            )}

            {/* Linked Certificate & Requisition Badges */}
            {(linkedDoc || linkedReq || finding.linkedCertificateTitle || finding.linkedRequisitionTitle) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', borderTop: '1px solid var(--border-glass)', paddingTop: '0.65rem' }}>
                {(linkedDoc || finding.linkedCertificateTitle) && (
                  <div style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.75rem' }}>
                    <span style={{ color: '#10b981', fontWeight: 700, display: 'block' }}>Data Sertifikat Terkait:</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{linkedDoc?.name || linkedDoc?.type || finding.linkedCertificateTitle}</span>
                  </div>
                )}
                {(linkedReq || finding.linkedRequisitionTitle) && (
                  <div style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '0.75rem' }}>
                    <span style={{ color: '#f59e0b', fontWeight: 700, display: 'block' }}>Permintaan Gudang Terkait:</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{linkedReq?.requisitionNumber || linkedReq?.id || finding.linkedRequisitionTitle}</span>
                  </div>
                )}
              </div>
            )}
              </div>
            );
          })()}

          {/* Form: Submisi Bukti Eviden Perbaikan */}
          <form onSubmit={handleSubmitEvidence} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={16} color="#0284c7" />
                <span>Formulir Tindakan Korektif & Bukti Eviden (Auditee)</span>
              </h4>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Langkah 1: Submit Perbaikan</span>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                1. Analisa Penyebab Utama (Root Cause Analysis - RCA) *
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

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                2. Tindakan Perbaikan Segera (Immediate Corrective Action) *
              </label>
              <textarea
                required
                rows={2}
                value={correctiveAction}
                onChange={(e) => setCorrectiveAction(e.target.value)}
                placeholder="Tindakan fisik atau administratif yang telah diselesaikan..."
                className="input-control"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                3. Tindakan Pencegahan Terulang (Preventive Action) *
              </label>
              <textarea
                required
                rows={2}
                value={preventiveAction}
                onChange={(e) => setPreventiveAction(e.target.value)}
                placeholder="Langkah atau SOP pencegahan agar tidak terulang..."
                className="input-control"
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Evidence File Upload / Mock Generator */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  4. Dokumen Bukti Eviden (Foto / Berita Acara / Laporan PDF)
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

          {/* Section 2: Auditor Verification & Close */}
          <div style={{
            padding: '1.25rem',
            borderRadius: '10px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={18} color="#10b981" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Verifikasi Auditor ISM & Penutupan Temuan (Close NC)</h4>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Langkah 2: Verifikasi Resmi</span>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                Catatan Evaluasi / Telaah Auditor
              </label>
              <textarea
                rows={2}
                value={auditorNotes}
                onChange={(e) => setAuditorNotes(e.target.value)}
                placeholder="Evaluasi kecukupan bukti perbaikan..."
                className="input-control"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.4rem' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {finding.status === 'NC Close' ? (
                  <span style={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={15} />
                    <span>Temuan telah ditutup resmi</span>
                  </span>
                ) : (
                  <span>Status saat ini: <strong style={{ color: '#f59e0b' }}>{finding.status}</strong></span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {finding.status === 'NC Close' ? (
                  <button
                    type="button"
                    onClick={handleReopenNC}
                    className="btn btn-danger btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
                  >
                    <RotateCcw size={13} />
                    <span>Buka Kembali Temuan (Reopen NC)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCloseNC}
                    className="btn btn-success"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                  >
                    <CheckCircle2 size={15} />
                    <span>Verifikasi & Tutup Temuan (CLOSE NC)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Tutup Jendela
          </button>
        </div>
      </div>
    </div>
  );
};
