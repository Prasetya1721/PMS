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
  Camera
} from 'lucide-react';

export const SubmitEvidenceModal = ({ finding, onClose }) => {
  const {
    submitAuditEvidence,
    closeAuditFinding,
    reopenAuditFinding,
    shipDocuments,
    requisitions,
    currentUser
  } = usePMS();

  const evidence = finding?.evidence || {};

  // Form states for auditee submission
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

  // File state
  const [fileName, setFileName] = useState(evidence.fileName || '');
  const [fileUrl, setFileUrl] = useState(evidence.fileUrl || '');
  const [fileSize, setFileSize] = useState(evidence.fileSize || '');

  // Auditor Review Notes state
  const [auditorNotes, setAuditorNotes] = useState(
    evidence.auditorReviewNotes ||
    'Tindakan koreksi dan dokumen bukti perbaikan telah diverifikasi oleh Lead Auditor. Implementasi dinyatakan efektif dan sesuai standar ISM Code.'
  );

  // File upload handler
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

  // Generate mock marine evidence document (SVG data URI)
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

  // Submit Evidence
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

  // Close NC
  const handleCloseNC = () => {
    closeAuditFinding(finding.id, {
      closedBy: currentUser?.name || 'Lead Auditor DPA',
      auditorNotes
    });
    onClose();
  };

  // Reopen NC
  const handleReopenNC = () => {
    reopenAuditFinding(finding.id, {
      auditorNotes
    });
    onClose();
  };

  // Linked Document Details
  const linkedDoc = finding.linkedCertificateId
    ? shipDocuments.find(d => d.id === finding.linkedCertificateId)
    : null;

  // Linked Requisition Details
  const linkedReq = finding.linkedRequisitionId
    ? requisitions.find(r => r.id === finding.linkedRequisitionId)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl text-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              finding.status === 'NC Close'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : finding.status === 'Eviden Submitted'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {finding.status === 'NC Close' ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <ShieldCheck className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">
                  {finding.findingNo}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  finding.status === 'NC Close'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : finding.status === 'Eviden Submitted'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {finding.status}
                </span>
                <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300">
                  {finding.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Klausul: <span className="text-cyan-300 font-mono font-bold">{finding.clauseCode}</span> - {finding.clauseName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Finding Summary Box */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-1.5">
                {finding.standard === 'DOC' ? (
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Ship className="w-3.5 h-3.5 text-blue-400" />
                )}
                <span>Target: <strong className="text-slate-200">{finding.targetName}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Batas Waktu: <strong className="text-amber-300">{finding.dueDate}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>PIC: <strong className="text-slate-200">{finding.assignedTo}</strong></span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400">Deskripsi Ketidaksesuaian:</p>
              <p className="text-sm text-slate-200 mt-0.5 leading-relaxed">{finding.description}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400">Bukti Objektif Auditor:</p>
              <p className="text-sm text-slate-300 mt-0.5 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/50 font-mono text-xs">
                {finding.objectiveEvidence || 'Tidak ada catatan bukti objektif khusus.'}
              </p>
            </div>

            {/* Linked Certificate & Linked Requisition Display */}
            {(linkedDoc || linkedReq || finding.linkedCertificateTitle || finding.linkedRequisitionTitle) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-xs">
                {(linkedDoc || finding.linkedCertificateTitle) && (
                  <div className="p-2.5 bg-emerald-950/20 border border-emerald-800/30 rounded-lg">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                      <FileCheck className="w-3.5 h-3.5" />
                      Data Sertifikat Terkait:
                    </div>
                    <p className="text-slate-200 font-medium truncate">
                      {linkedDoc?.name || linkedDoc?.type || finding.linkedCertificateTitle}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      No: {linkedDoc?.documentNumber || 'BKI-REG'} • Status: {linkedDoc?.status || 'Valid'}
                    </p>
                  </div>
                )}

                {(linkedReq || finding.linkedRequisitionTitle) && (
                  <div className="p-2.5 bg-amber-950/20 border border-amber-800/30 rounded-lg">
                    <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                      <Package className="w-3.5 h-3.5" />
                      Surat Permintaan Gudang Terkait:
                    </div>
                    <p className="text-slate-200 font-medium truncate">
                      {linkedReq?.requisitionNumber || linkedReq?.id || finding.linkedRequisitionTitle}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      {linkedReq?.title || 'Material & Spareparts Requisition'} ({linkedReq?.status || 'In Warehouse'})
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form: Submisi Bukti Eviden Perbaikan */}
          <form onSubmit={handleSubmitEvidence} className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Formulir Tindakan Korektif & Bukti Eviden (Auditee)
              </h4>
              <span className="text-xs text-slate-400">
                Langkah 1: Submit Tindakan Perbaikan
              </span>
            </div>

            {/* Root Cause Analysis (RCA) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                1. Analisa Penyebab Utama (Root Cause Analysis - RCA) <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                placeholder="Mengapa ketidaksesuaian ini bisa terjadi? (Faktor personil, sistem, peralatan)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Corrective Action */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                2. Tindakan Perbaikan Segera (Immediate Corrective Action) <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={correctiveAction}
                onChange={(e) => setCorrectiveAction(e.target.value)}
                placeholder="Tindakan koreksi fisik/administrasi yang telah diselesaikan untuk mengatasi temuan..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Preventive Action */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                3. Tindakan Pencegahan Terulang (Preventive Action) <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={preventiveAction}
                onChange={(e) => setPreventiveAction(e.target.value)}
                placeholder="Langkah sistemik atau SOP baru agar masalah serupa tidak berulang di masa mendatang..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Evidence File Upload / Mock Generator */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  4. Dokumen Bukti Eviden (Foto Fisik / Berita Acara / Laporan PDF)
                </label>
                <button
                  type="button"
                  onClick={generateMockEvidence}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Buat Dokumen Bukti Cepat
                </button>
              </div>

              <div className="p-4 bg-slate-950 border border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-blue-500/60 transition group">
                <Upload className="w-8 h-8 text-slate-500 group-hover:text-blue-400 transition" />
                <div className="text-center">
                  <p className="text-xs text-slate-300 font-medium">
                    Upload Foto / Dokumen Eviden Perbaikan
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Mendukung format JPG, PNG, PDF, atau klik tombol "Buat Dokumen Bukti Cepat" di atas
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="text-xs text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                />

                {fileName && (
                  <div className="w-full mt-2 p-2.5 bg-blue-950/40 border border-blue-800/40 rounded-lg flex items-center justify-between text-xs text-blue-200">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="truncate font-medium">{fileName}</span>
                      <span className="text-[10px] text-slate-400">({fileSize})</span>
                    </div>
                    {fileUrl && (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px] shrink-0 font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Submitted By */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Pengaju Eviden (PIC / Auditee)
                </label>
                <input
                  type="text"
                  required
                  value={submittedBy}
                  onChange={(e) => setSubmittedBy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Kirim Bukti Eviden (Submit Eviden)
                </button>
              </div>
            </div>
          </form>

          {/* Section 2: Auditor Verification & Close / Reopen */}
          <div className="p-5 bg-gradient-to-b from-slate-950/90 to-slate-900 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">
                  Verifikasi Auditor ISM & Penutupan Temuan (Close NC)
                </h4>
              </div>
              <span className="text-xs text-slate-400">
                Langkah 2: Verifikasi Resmi DPA / Auditor
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Catatan Evaluasi / Verifikasi Auditor (Auditor Review Notes)
              </label>
              <textarea
                rows={2}
                value={auditorNotes}
                onChange={(e) => setAuditorNotes(e.target.value)}
                placeholder="Tuliskan evaluasi keefektifan eviden perbaikan..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-400">
                {finding.status === 'NC Close' ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Temuan telah ditutup pada: {evidence.closedDate || new Date().toISOString().split('T')[0]}
                  </span>
                ) : (
                  <span>Status saat ini: <strong className="text-amber-300">{finding.status}</strong></span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {finding.status === 'NC Close' ? (
                  <button
                    type="button"
                    onClick={handleReopenNC}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 transition flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Buka Kembali Temuan (Reopen NC)
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCloseNC}
                    className="px-5 py-2.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Verifikasi & Tutup Temuan (CLOSE NC)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 transition"
          >
            Tutup Jendela
          </button>
        </div>
      </div>
    </div>
  );
};
