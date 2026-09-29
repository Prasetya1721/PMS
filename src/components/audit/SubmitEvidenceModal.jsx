import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  X,
  CheckCircle2,
  Upload,
  FileText,
  Ship,
  Building2,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Eye,
  Maximize2,
  Minimize2,
  Clock,
  Printer
} from 'lucide-react';
import { calculateNCRange } from '../../utils/auditTimeUtils';
import { AuditReportModal } from './AuditReportModal';
import { EvidModalHeader } from './submit/EvidModalHeader';
import { EvidSummaryBar } from './submit/EvidSummaryBar';
import { EvidCapaForm } from './submit/EvidCapaForm';
import { EvidDpaSection } from './submit/EvidDpaSection';
import { EvidNCRangePanel } from './submit/EvidNCRangePanel';

export const SubmitEvidenceModal = ({ finding, onClose }) => {
  const {
    submitAuditEvidence,
    closeAuditFinding,
    reopenAuditFinding,
    shipDocuments,
    requisitions,
    currentUser
  } = usePMS();

  const isAuditorOrDPA = currentUser?.role === 'Super Admin' || currentUser?.role === 'Fleet Manager';
  const isShipCrew = !isAuditorOrDPA;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPrintReport, setShowPrintReport] = useState(false);
  const evidence = finding?.evidence || {};

  const [correction, setCorrection] = useState(
    evidence.correction ||
    finding?.correction ||
    'Dibuatkan instruksi kerja Nakhoda yang berkaitan dengan pemeliharaan kapal di atas kapal & telah ditandatangani oleh DPA.'
  );
  const [rootCause, setRootCause] = useState(
    evidence.rootCause ||
    finding?.rootCause ||
    'Kurangnya koordinasi dan pemahaman personil perwira terkait penyusunan instruksi kerja spesifik nakhoda sesuai klausul 5.1.5.'
  );
  const [correctiveAction, setCorrectiveAction] = useState(
    evidence.correctiveAction ||
    finding?.correctiveAction ||
    'Melakukan sosialisasi instruksi kerja Nakhoda kepada seluruh perwira kapal serta verifikasi implementasi buku catatan pemeliharaan.'
  );
  const [preventiveAction, setPreventiveAction] = useState(
    evidence.preventiveAction ||
    'Menetapkan jadwal briefing rutin mingguan, audit silang internal, dan pembaruan checklist kepatuhan standar ISM Code.'
  );
  const [agreedDate, setAgreedDate] = useState(
    evidence.agreedDate ||
    finding?.agreedDate ||
    '2026-11-17'
  );
  const [submittedBy, setSubmittedBy] = useState(
    evidence.submittedBy || currentUser?.name || finding?.assignedTo || 'PIC / Nakhoda Kapal'
  );

  const [fileName, setFileName] = useState(evidence.fileName || '');
  const [fileUrl, setFileUrl] = useState(evidence.fileUrl || '');
  const [fileSize, setFileSize] = useState(evidence.fileSize || '');

  // Auditor verification states
  const [verifiedUpgradeDowngrade, setVerifiedUpgradeDowngrade] = useState(
    evidence.verifiedUpgradeDowngrade || finding?.verifiedUpgradeDowngrade || 'Tetap'
  );
  const [verifiedSatisfactory, setVerifiedSatisfactory] = useState(
    evidence.verifiedSatisfactory !== undefined
      ? evidence.verifiedSatisfactory
      : (finding?.verifiedSatisfactory !== undefined ? finding.verifiedSatisfactory : true)
  );
  const [verificationDate, setVerificationDate] = useState(
    evidence.closedDate || finding?.auditorSignatureDate || new Date().toISOString().split('T')[0]
  );
  const [auditorNotes, setAuditorNotes] = useState(
    evidence.auditorReviewNotes ||
    'Tindakan koreksi dan dokumen bukti instruksi kerja Nakhoda telah diverifikasi oleh Lead Auditor. Implementasi dinyatakan memuaskan dan memenuhi klausul 5.1.5 ISM Code.'
  );

  const handleApplyPresetRP2004 = () => {
    setCorrection('Dibuatkan instruksi kerja Nakhoda yang berkaitan dengan pemeliharaan kapal di atas kapal & telah ditandatangani oleh DPA');
    setRootCause('Kurangnya pemahaman personil perwira terkait format instruksi kerja spesifik kapal sesuai SMS manual');
    setCorrectiveAction('Sosialisasi instruksi kerja Nakhoda kepada seluruh perwira kapal dan melengkapi arsip onboard');
    setPreventiveAction('Verifikasi silang berkala oleh DPA saat pergantian Nakhoda');
    setAgreedDate('2026-11-17');
    setSubmittedBy('CAPT. EKHSAN (Nakhoda TB. RP 2004)');
    setVerifiedUpgradeDowngrade('Tetap');
    setVerifiedSatisfactory(true);
    generateMockEvidence();
  };

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
      <text x="300" y="280" font-family="sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">Lokasi: ${finding.targetName || 'Armada Kapal'}</text>
      <rect x="180" y="315" width="240" height="35" rx="6" fill="#047857"/>
      <text x="300" y="338" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">VERIFIED AUDIT EVIDENCE</text>
    </svg>`;
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
    setFileName(`EVIDEN_${finding.findingNo.replace(/[^a-zA-Z0-9]/g, '_')}_PERBAIKAN.svg`);
    setFileSize('18.4 KB');
    setFileUrl(dataUrl);
  };

  const handleSubmitEvidence = (e) => {
    e.preventDefault();
    submitAuditEvidence(finding.id, {
      correction,
      rootCauseAnalysis: rootCause,
      correctiveAction,
      preventiveAction,
      agreedDate,
      submittedBy,
      fileName: fileName || `EVIDEN_PERBAIKAN_${finding.findingNo}.pdf`,
      fileUrl: fileUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=600&q=80',
      fileSize: fileSize || '245 KB'
    });
    onClose();
  };

  const handleCloseNC = () => {
    closeAuditFinding(finding.id, {
      closedBy: currentUser?.name || finding.auditor || 'Lead Auditor ISM',
      auditorNotes,
      closedDate: verificationDate,
      verifiedUpgradeDowngrade,
      verifiedSatisfactory
    });
    // Otomatis membuka pratinjau cetak laporan penutupan audit resmi
    setShowPrintReport(true);
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
          background: 'var(--bg-surface-card)',
          backgroundColor: 'var(--bg-surface-card)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          opacity: 1
        }}
      >
        {/* Header */}
        <EvidModalHeader
          finding={finding}
          isFullscreen={isFullscreen}
          onClose={onClose}
          setIsFullscreen={setIsFullscreen}
        />

        {/* Modal Body */}
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Finding Context Card */}
          <EvidNCRangePanel
              finding={finding}
              linkedDoc={linkedDoc}
              linkedReq={linkedReq}
          />

          {/* Kolaborasi Peran DPA & Nakhoda Ribbon */}
          <EvidSummaryBar

          />

          {/* Form: Submisi Bukti Eviden Perbaikan */}
          <EvidCapaForm
            agreedDate={agreedDate}
            correction={correction}
            correctiveAction={correctiveAction}
            fileName={fileName}
            fileSize={fileSize}
            fileUrl={fileUrl}
            generateMockEvidence={generateMockEvidence}
            handleApplyPresetRP2004={handleApplyPresetRP2004}
            handleFileUpload={handleFileUpload}
            handleSubmitEvidence={handleSubmitEvidence}
            preventiveAction={preventiveAction}
            rootCause={rootCause}
            setAgreedDate={setAgreedDate}
            setCorrection={setCorrection}
            setCorrectiveAction={setCorrectiveAction}
            setPreventiveAction={setPreventiveAction}
            setRootCause={setRootCause}
            setSubmittedBy={setSubmittedBy}
            submittedBy={submittedBy}
          />

          {/* Section 2: Auditor Verification & Close */}
          <EvidDpaSection
            auditorNotes={auditorNotes}
            finding={finding}
            handleCloseNC={handleCloseNC}
            handleReopenNC={handleReopenNC}
            isAuditorOrDPA={isAuditorOrDPA}
            setAuditorNotes={setAuditorNotes}
            setShowPrintReport={setShowPrintReport}
            setVerificationDate={setVerificationDate}
            setVerifiedSatisfactory={setVerifiedSatisfactory}
            setVerifiedUpgradeDowngrade={setVerifiedUpgradeDowngrade}
            verificationDate={verificationDate}
            verifiedSatisfactory={verifiedSatisfactory}
            verifiedUpgradeDowngrade={verifiedUpgradeDowngrade}
          />
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Tutup Jendela
          </button>
        </div>
      </div>

      {/* Official Audit Report Printout Modal */}
      {showPrintReport && (
        <AuditReportModal
          finding={{
            ...finding,
            correction,
            rootCause,
            correctiveAction,
            preventiveAction,
            agreedDate,
            assignedTo: submittedBy || finding?.assignedTo,
            status: 'NC Close',
            dateClosed: verificationDate || new Date().toISOString().split('T')[0],
            evidence: {
              ...finding.evidence,
              correction,
              rootCause,
              rootCauseAnalysis: rootCause,
              correctiveAction,
              preventiveAction,
              agreedDate,
              submittedBy,
              fileName: fileName || finding?.evidence?.fileName || `EVIDEN_${(finding?.findingNo || 'NC').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
              fileUrl,
              fileSize,
              verifiedUpgradeDowngrade,
              verifiedSatisfactory,
              auditorReviewNotes: auditorNotes,
              closedDate: verificationDate || new Date().toISOString().split('T')[0]
            }
          }}
          initialMode="ncr"
          onClose={() => {
            setShowPrintReport(false);
            onClose();
          }}
        />
      )}
    </div>
  );
};
