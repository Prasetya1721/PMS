import React, { useState, useEffect, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  X,
  AlertTriangle,
  Save,
  Code,
  Link,
  Maximize2,
  Minimize2,
  Clock,
  Building2,
  Ship,
  Sparkles,
  Upload,
  CheckCircle2,
  FileText,
  Trash2
} from 'lucide-react';
import {
  BKI_AUDIT_MASTER,
  NON_BKI_AUDIT_ORGANIZATIONS,
  EXTERNAL_AUDIT_ORGANIZATIONS
} from '../../data/auditMasterData';
import { canPerformAction } from '../../utils/rbac';
import { FindingModalHeader } from './finding/FindingModalHeader';
import { FindingAuditTypeSection } from './finding/FindingAuditTypeSection';
import { FindingInfoSection } from './finding/FindingInfoSection';
import { FindingDetailSection } from './finding/FindingDetailSection';
import { FindingCategorySection } from './finding/FindingCategorySection';
import { FindingVerificationSection } from './finding/FindingVerificationSection';
import { FindingEvidenceSection } from './finding/FindingEvidenceSection';
import { FindingLinksSection } from './finding/FindingLinksSection';
import { FindingModalFooter } from './finding/FindingModalFooter';
import { FindingDeleteConfirm } from './finding/FindingDeleteConfirm';
import { FindingCapaSection } from './finding/FindingCapaSection';

export const AuditFindingModal = ({ finding, defaultAuditId, defaultVesselId, onClose }) => {
  const {
    currentUser,
    audits,
    allAudits,
    vessels,
    shipDocuments,
    crewCertificates,
    requisitions,
    addAuditFinding,
    updateAuditFinding,
    deleteAuditFinding,
    showToast
  } = usePMS();

  const userRole = currentUser?.role || 'Super Admin';
  const isAuditorOrDPA = canPerformAction(userRole, 'create_audit_finding');

  const isEdit = Boolean(finding && finding.id && !finding.isDraft);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const availableAudits = audits.length > 0 ? audits : allAudits;
  const vesselMatchedAudit = defaultVesselId && defaultVesselId !== 'office'
    ? availableAudits.find(a => a.vesselId === defaultVesselId)
    : defaultVesselId === 'office'
    ? availableAudits.find(a => a.standard === 'DOC')
    : null;

  const [auditId, setAuditId] = useState(
    finding?.auditId || defaultAuditId || vesselMatchedAudit?.id || availableAudits[0]?.id || ''
  );

  const currentAudit = availableAudits.find(a => a.id === auditId) || availableAudits[0];

  const standard = currentAudit?.standard || 'SMC';
  
  // Dynamic Institution Settings (Internal = Baharimas, External = Lembaga Ditunjuk Perusahaan)
  const [auditType, setAuditType] = useState(finding?.auditType || currentAudit?.auditType || 'External');
  const rawInitOrg = finding?.externalOrganization || currentAudit?.externalOrganization;
  const initialOrgStr = typeof rawInitOrg === 'object' && rawInitOrg !== null
    ? (rawInitOrg.name || 'Biro Klasifikasi Indonesia (BKI)')
    : (rawInitOrg || 'Biro Klasifikasi Indonesia (BKI)');
  const [externalOrg, setExternalOrg] = useState(initialOrgStr);
  const [customExternalOrg, setCustomExternalOrg] = useState('');

  // Report Reference & Document Identifiers
  const [reportId, setReportId] = useState(finding?.reportId || currentAudit?.reportId || '');
  const [findingNo, setFindingNo] = useState(finding?.findingNo || '');
  const [areaUnderAudit, setAreaUnderAudit] = useState(
    finding?.areaUnderAudit || finding?.targetName || currentAudit?.targetName || ''
  );
  const [vesselId, setVesselId] = useState(finding?.vesselId || currentAudit?.vesselId || (vessels[0]?.id || ''));
  const [dateOfAudit, setDateOfAudit] = useState(
    finding?.dateIdentified || currentAudit?.auditDate || new Date().toISOString().split('T')[0]
  );
  const [elementNumberOfCode, setElementNumberOfCode] = useState(
    finding?.elementNumberOfCode || finding?.clauseCode || ''
  );
  const [clauseCode, setClauseCode] = useState(finding?.clauseCode || '');
  const [clauseName, setClauseName] = useState(
    finding?.clauseName || ''
  );
  const [isManualClause, setIsManualClause] = useState(true);

  // Deficiency Details & Objective Evidence
  const [description, setDescription] = useState(
    finding?.description || ''
  );
  const [objectiveEvidence, setObjectiveEvidence] = useState(
    finding?.objectiveEvidence || ''
  );
  const [category, setCategory] = useState(finding?.category || 'Non-Conformity');

  // Signatures Stage 1 (Initial Report)
  const [auditor, setAuditor] = useState(finding?.auditor || currentAudit?.leadAuditor || '');
  const [auditee, setAuditee] = useState(finding?.auditee || currentAudit?.auditee || '');
  const [assignedTo, setAssignedTo] = useState(finding?.assignedTo || '');

  // Correction & CAP (By Auditee)
  const [correction, setCorrection] = useState(
    finding?.correction || finding?.evidence?.correction || ''
  );
  const [rootCause, setRootCause] = useState(
    finding?.rootCause || finding?.evidence?.rootCause || ''
  );
  const [correctiveAction, setCorrectiveAction] = useState(
    finding?.correctiveAction || finding?.evidence?.correctiveAction || ''
  );
  const [agreedDate, setAgreedDate] = useState(
    finding?.agreedDate || finding?.dueDate || ''
  );
  const [auditeeSignatureDate, setAuditeeSignatureDate] = useState(
    finding?.auditeeSignatureDate || ''
  );

  // Verification Stage (By Auditor)
  const [verifiedUpgradeDowngrade, setVerifiedUpgradeDowngrade] = useState(
    finding?.verifiedUpgradeDowngrade || 'NC' // null | 'MJ' | 'NC'
  );
  const [verifiedSatisfactory, setVerifiedSatisfactory] = useState(
    finding?.verifiedSatisfactory !== undefined ? finding.verifiedSatisfactory : true
  );
  const [auditorSignatureDate, setAuditorSignatureDate] = useState(
    finding?.auditorSignatureDate || ''
  );
  const [auditorReviewNotes, setAuditorReviewNotes] = useState(
    finding?.evidence?.auditorReviewNotes || ''
  );

  // File Attachment for Evidence
  const [evidenceFileName, setEvidenceFileName] = useState(finding?.evidence?.fileName || '');
  const [evidenceFileSize, setEvidenceFileSize] = useState(finding?.evidence?.fileSize || '');
  const [evidenceFileUrl, setEvidenceFileUrl] = useState(finding?.evidence?.fileUrl || '');

  // Integrations
  const [linkedCertificateId, setLinkedCertificateId] = useState(finding?.linkedCertificateId || '');
  const [linkedRequisitionId, setLinkedRequisitionId] = useState(finding?.linkedRequisitionId || '');

  // Quick Preset for Example Case RP 2004 (from User Scan PNG & PDF)
  const handleLoadSampleRP2004 = () => {
    setAuditType('External');
    setExternalOrg('Biro Klasifikasi Indonesia (BKI)');
    setReportId('0859 - PK/ISM- SMC /2026');
    setFindingNo('1/4 - 0859 - PK/ISM- SMC /2026');
    setAreaUnderAudit('RP 2004');
    setDateOfAudit('2026-08-18');
    setElementNumberOfCode('5.1.5 or other');
    setClauseCode('5.1.5');
    setClauseName('Tanggung Jawab & Wewenang Nakhoda (Peninjauan Kembali SMK)');
    setIsManualClause(true);
    setDescription('Nakhoda belum memahami semua tanggung jawab dan wewenangnya yang telah didokumentasikan menyangkut hal peninjauan kembali SMK dan melaporkan kekurangannya kepada manajemen didarat secara berkala');
    setObjectiveEvidence('- Master review tahun 2025 tidak ditemukan saat audit\n- Tidak ditemukan master night order, analisa risiko untuk pekerjaan deck maupun permesinan dan penilaian crew periode semester I tahun 2026 pada saat diaudit');
    setCategory('Non-Conformity');
    setAuditor('MUHSON NURROCHMAT S');
    setAuditee('CAPT. EKHSAN');
    setAssignedTo('Nakhoda / Master TB. RP 2004');
    setCorrection('Melakukan penyusunan formulir Master Review 2025/2026, menerbitkan Master Night Order dan Analisa Risiko (Risk Assessment) pekerjaan deck maupun permesinan serta form penilaian crew semester I tahun 2026.');
    setRootCause('Nakhoda belum sepenuhnya memahami prosedur peninjauan berkala sistem manajemen keselamatan dan pergantian dokumen master di atas kapal.');
    setCorrectiveAction('Pihak manajemen darat memberikan penyegaran prosedur ISM Code klausul 5 serta melengkapi template baku Master Review dan checklist verifikasi berkala.');
    setAgreedDate('2026-11-17');
    setAuditeeSignatureDate('2026-11-17');
    setVerifiedUpgradeDowngrade('NC');
    setVerifiedSatisfactory(true);
    setAuditorSignatureDate('2026-11-17');
    setAuditorReviewNotes('Dokumen Master Review dan form Analisa Risiko telah diperiksa. Pelaksanaan tindakan korektif memuaskan.');
    setEvidenceFileName('Eviden_Master_Review_Risk_Assessment_RP2004.pdf');
    setEvidenceFileSize('1.4 MB');
    setEvidenceFileUrl('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22400%22%20viewBox%3D%220%200%20600%20400%22%3E%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22%23f8fafc%22%2F%3E%3Crect%20x%3D%2220%22%20y%3D%2220%22%20width%3D%22560%22%20height%3D%22360%22%20fill%3D%22none%22%20stroke%3D%22%230284c7%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%22300%22%20y%3D%2260%22%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-weight%3D%22bold%22%20fill%3D%22%230369a1%22%20text-anchor%3D%22middle%22%3EDOKUMEN%20BUKTI%20PERBAIKAN%20ISM%20CODE%3C%2Ftext%3E%3Ctext%20x%3D%22300%22%20y%3D%2290%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%2364748b%22%20text-anchor%3D%22middle%22%3EMASTER%20REVIEW%20%26%20RISK%20ASSESSMENT%20RP%202004%3C%2Ftext%3E%3C%2Fsvg%3E');
    showToast('✓ Data laporan contoh RP 2004 berhasil dimuat ke formulir!', 'success');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEvidenceFileName(file.name);
      setEvidenceFileSize(`${(file.size / 1024).toFixed(1)} KB`);
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        setEvidenceFileUrl(loadEvt.target.result);
      };
      reader.readAsDataURL(file);
      showToast(`✓ File bukti ${file.name} berhasil diunggah!`, 'success');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isAuditorOrDPA) {
      showToast('Akses Terbatas: Hanya Auditor dan DPA yang berwenang menerbitkan atau mengubah lembar NCR resmi.', 'warning');
      return;
    }

    const linkedReqObj = requisitions.find(r => r.id === linkedRequisitionId);
    const linkedDocObj = shipDocuments.find(d => d.id === linkedCertificateId);

    const isCustom = externalOrg === 'custom' ||
      externalOrg === 'Lembaga Audit Eksternal Lainnya (Input Manual)' ||
      (typeof externalOrg === 'string' && externalOrg.includes('Lainnya'));

    const activeExternalOrg = auditType === 'External' 
      ? (isCustom ? (customExternalOrg.trim() || 'Lembaga Eksternal Ditunjuk') : (typeof externalOrg === 'string' ? externalOrg : externalOrg?.name || 'Biro Klasifikasi Indonesia (BKI)'))
      : null;

    const payload = {
      findingNo: findingNo.trim() || `NC-5.1.5-${Math.floor(Math.random() * 9000 + 1000)}`,
      reportId: reportId.trim() || '0859 - PK/ISM- SMC /2026',
      auditId: currentAudit?.id || auditId,
      auditNo: currentAudit?.auditNo || reportId,
      auditType,
      externalOrganization: activeExternalOrg,
      standard: currentAudit?.standard || standard,
      areaUnderAudit: areaUnderAudit.trim(),
      targetName: areaUnderAudit.trim(),
      vesselId: vesselId || currentAudit?.vesselId || null,
      elementNumberOfCode: elementNumberOfCode.trim(),
      clauseCode: clauseCode.trim(),
      clauseName: clauseName.trim(),
      category,
      description: description.trim(),
      objectiveEvidence: objectiveEvidence.trim(),
      dateIdentified: dateOfAudit,
      dueDate: agreedDate,
      agreedDate,
      assignedTo: assignedTo.trim() || 'Nakhoda / Master',
      auditor: auditor.trim() || 'Auditor ISM',
      auditee: auditee.trim() || 'Auditee',
      correction: correction.trim(),
      rootCause: rootCause.trim(),
      correctiveAction: correctiveAction.trim(),
      verifiedUpgradeDowngrade,
      verifiedSatisfactory,
      auditorSignatureDate,
      auditeeSignatureDate,
      linkedCertificateId: linkedCertificateId || null,
      linkedCertificateTitle: linkedDocObj ? `${linkedDocObj.name || linkedDocObj.type} (${linkedDocObj.documentNumber || 'No. Reg'})` : null,
      linkedRequisitionId: linkedRequisitionId || null,
      linkedRequisitionTitle: linkedReqObj ? `${linkedReqObj.requisitionNumber || linkedReqObj.id} - ${linkedReqObj.title || linkedReqObj.department || 'Permintaan Gudang'}` : null,
      evidence: {
        hasSubmitted: Boolean(correction || correctiveAction),
        submissionDate: auditeeSignatureDate || new Date().toISOString().split('T')[0],
        submittedBy: auditee,
        correction,
        rootCause,
        correctiveAction,
        fileName: evidenceFileName,
        fileSize: evidenceFileSize,
        fileUrl: evidenceFileUrl,
        auditorReviewNotes,
        verifiedUpgradeDowngrade,
        verifiedSatisfactory,
        closedDate: verifiedSatisfactory ? auditorSignatureDate : null
      }
    };

    if (isEdit) {
      updateAuditFinding(finding.id, payload);
    } else {
      addAuditFinding(payload);
    }

    onClose();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div
        className={isFullscreen ? 'modal-fullscreen' : 'modal-dialog'}
        style={{
          maxWidth: isFullscreen ? '98vw' : '880px',
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
        <FindingModalHeader
          auditType={auditType}
          externalOrg={externalOrg}
          handleLoadSampleRP2004={handleLoadSampleRP2004}
          isFullscreen={isFullscreen}
          onClose={onClose}
          reportId={reportId}
          setIsFullscreen={setIsFullscreen}
        />

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="modal-body" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem', background: 'var(--bg-surface-card)', backgroundColor: 'var(--bg-surface-card)', opacity: 1 }}>
            
            {/* KONTROL JENIS AUDIT & LEMBAGA (SESUAI ATURAN USER) */}
            <FindingAuditTypeSection
              auditType={auditType}
              customExternalOrg={customExternalOrg}
              externalOrg={externalOrg}
              reportId={reportId}
              setAuditType={setAuditType}
              setCustomExternalOrg={setCustomExternalOrg}
              setExternalOrg={setExternalOrg}
              setReportId={setReportId}
            />

            {/* SEKSI 1: INFORMASI KETIDAKSESUAIAN / NON-CONFORMITY INFORMATION */}
            <FindingInfoSection
              areaUnderAudit={areaUnderAudit}
              dateOfAudit={dateOfAudit}
              elementNumberOfCode={elementNumberOfCode}
              findingNo={findingNo}
              setAreaUnderAudit={setAreaUnderAudit}
              setClauseCode={setClauseCode}
              setDateOfAudit={setDateOfAudit}
              setElementNumberOfCode={setElementNumberOfCode}
              setFindingNo={setFindingNo}
            />

            {/* SEKSI 2: RINCIAN KETIDAKSESUAIAN & BUKTI OBJEKTIF */}
            <FindingDetailSection
              description={description}
              objectiveEvidence={objectiveEvidence}
              setDescription={setDescription}
              setObjectiveEvidence={setObjectiveEvidence}
            />

            {/* SEKSI 3: KATEGORI KETIDAKSESUAIAN & TANDA TANGAN AWAL */}
            <FindingCategorySection
              areaUnderAudit={areaUnderAudit}
              auditType={auditType}
              auditee={auditee}
              auditor={auditor}
              category={category}
              externalOrg={externalOrg}
              setAuditee={setAuditee}
              setAuditor={setAuditor}
              setCategory={setCategory}
            />

            <FindingCapaSection
              agreedDate={agreedDate}
              auditeeSignatureDate={auditeeSignatureDate}
              correction={correction}
              correctiveAction={correctiveAction}
              rootCause={rootCause}
              setAgreedDate={setAgreedDate}
              setAuditeeSignatureDate={setAuditeeSignatureDate}
              setCorrection={setCorrection}
              setCorrectiveAction={setCorrectiveAction}
              setRootCause={setRootCause}
            />

            {/* SEKSI 7: TINDAKAN PERBAIKAN TELAH DIVERIFIKASI (diisi oleh Auditor) / CORRECTIVE ACTION VERIFIED */}
            <FindingVerificationSection
              auditorReviewNotes={auditorReviewNotes}
              auditorSignatureDate={auditorSignatureDate}
              setAuditorReviewNotes={setAuditorReviewNotes}
              setAuditorSignatureDate={setAuditorSignatureDate}
              setVerifiedSatisfactory={setVerifiedSatisfactory}
              setVerifiedUpgradeDowngrade={setVerifiedUpgradeDowngrade}
              verifiedSatisfactory={verifiedSatisfactory}
              verifiedUpgradeDowngrade={verifiedUpgradeDowngrade}
            />

            {/* SEKSI 8: UPLOAD BUKTI EVIDEN PERBAIKAN */}
            <FindingEvidenceSection
              evidenceFileName={evidenceFileName}
              evidenceFileSize={evidenceFileSize}
              handleFileUpload={handleFileUpload}
              setEvidenceFileName={setEvidenceFileName}
              setEvidenceFileSize={setEvidenceFileSize}
              setEvidenceFileUrl={setEvidenceFileUrl}
            />

            {/* SEKSI 9: INTEGRASI SPB GUDANG & SERTIFIKAT */}
            <FindingLinksSection
              linkedCertificateId={linkedCertificateId}
              linkedRequisitionId={linkedRequisitionId}
              requisitions={requisitions}
              setLinkedCertificateId={setLinkedCertificateId}
              setLinkedRequisitionId={setLinkedRequisitionId}
              shipDocuments={shipDocuments}
            />

          </div>

          {/* Footer */}
          <FindingModalFooter
            isAuditorOrDPA={isAuditorOrDPA}
            isEdit={isEdit}
            onClose={onClose}
            setShowDeleteConfirm={setShowDeleteConfirm}
          />
        </form>
      </div>

      {/* In-app Confirm Delete Finding Modal */}
      {(showDeleteConfirm) && (
        <FindingDeleteConfirm
          deleteAuditFinding={deleteAuditFinding}
          finding={finding}
          onClose={onClose}
          setShowDeleteConfirm={setShowDeleteConfirm}
        />
      )}
    </div>
  );
};
