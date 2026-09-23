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

export const AuditFindingModal = ({ finding, defaultAuditId, defaultVesselId, onClose }) => {
  const {
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

  const isEdit = Boolean(finding);
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
  const [reportId, setReportId] = useState(finding?.reportId || currentAudit?.reportId || '0859 - PK/ISM- SMC /2026');
  const [findingNo, setFindingNo] = useState(finding?.findingNo || '1/4 - 0859 - PK/ISM- SMC /2026');
  const [areaUnderAudit, setAreaUnderAudit] = useState(
    finding?.areaUnderAudit || finding?.targetName || currentAudit?.targetName || 'RP 2004'
  );
  const [vesselId, setVesselId] = useState(finding?.vesselId || currentAudit?.vesselId || 'v-rp2004');
  const [dateOfAudit, setDateOfAudit] = useState(
    finding?.dateIdentified || currentAudit?.auditDate || '2026-08-18'
  );
  const [elementNumberOfCode, setElementNumberOfCode] = useState(
    finding?.elementNumberOfCode || finding?.clauseCode || '5.1.5 or other'
  );
  const [clauseCode, setClauseCode] = useState(finding?.clauseCode || '5.1.5');
  const [clauseName, setClauseName] = useState(
    finding?.clauseName || 'Tanggung Jawab & Wewenang Nakhoda (Peninjauan Kembali SMK)'
  );
  const [isManualClause, setIsManualClause] = useState(true);

  // Deficiency Details & Objective Evidence
  const [description, setDescription] = useState(
    finding?.description ||
    'Nakhoda belum memahami semua tanggung jawab dan wewenangnya yang telah didokumentasikan menyangkut hal peninjauan kembali SMK dan melaporkan kekurangannya kepada manajemen didarat secara berkala'
  );
  const [objectiveEvidence, setObjectiveEvidence] = useState(
    finding?.objectiveEvidence ||
    '- Master review tahun 2025 tidak ditemukan saat audit\n- Tidak ditemukan master night order, analisa risiko untuk pekerjaan deck maupun permesinan dan penilaian crew periode semester I tahun 2026 pada saat diaudit'
  );
  const [category, setCategory] = useState(finding?.category || 'Non-Conformity');

  // Signatures Stage 1 (Initial Report)
  const [auditor, setAuditor] = useState(finding?.auditor || currentAudit?.leadAuditor || 'MUHSON NURROCHMAT S');
  const [auditee, setAuditee] = useState(finding?.auditee || currentAudit?.auditee || 'CAPT. EKHSAN');
  const [assignedTo, setAssignedTo] = useState(finding?.assignedTo || 'Nakhoda / Master TB. RP 2004');

  // Correction & CAP (By Auditee)
  const [correction, setCorrection] = useState(
    finding?.correction || finding?.evidence?.correction ||
    'Melakukan penyusunan formulir Master Review 2025/2026, menerbitkan Master Night Order dan Analisa Risiko (Risk Assessment) deck dan permesinan serta penilaian crew semester I tahun 2026.'
  );
  const [rootCause, setRootCause] = useState(
    finding?.rootCause || finding?.evidence?.rootCause ||
    'Nakhoda belum sepenuhnya memahami prosedur peninjauan berkala sistem manajemen keselamatan dan pergantian dokumen master di atas kapal.'
  );
  const [correctiveAction, setCorrectiveAction] = useState(
    finding?.correctiveAction || finding?.evidence?.correctiveAction ||
    'Pihak manajemen darat memberikan penyegaran prosedur ISM Code klausul 5 serta melengkapi template baku Master Review dan checklist verifikasi berkala.'
  );
  const [agreedDate, setAgreedDate] = useState(
    finding?.agreedDate || finding?.dueDate || '2026-11-17'
  );
  const [auditeeSignatureDate, setAuditeeSignatureDate] = useState(
    finding?.auditeeSignatureDate || '2026-11-17'
  );

  // Verification Stage (By Auditor)
  const [verifiedUpgradeDowngrade, setVerifiedUpgradeDowngrade] = useState(
    finding?.verifiedUpgradeDowngrade || 'NC' // null | 'MJ' | 'NC'
  );
  const [verifiedSatisfactory, setVerifiedSatisfactory] = useState(
    finding?.verifiedSatisfactory !== undefined ? finding.verifiedSatisfactory : true
  );
  const [auditorSignatureDate, setAuditorSignatureDate] = useState(
    finding?.auditorSignatureDate || '2026-11-17'
  );
  const [auditorReviewNotes, setAuditorReviewNotes] = useState(
    finding?.evidence?.auditorReviewNotes || 'Dokumen Master Review dan form Analisa Risiko telah diperiksa. Pelaksanaan tindakan korektif memuaskan.'
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
        <div className="modal-header" style={{ borderBottom: '2px solid var(--border-subtle)', padding: '1rem 1.5rem', background: 'var(--bg-surface-elevated)', backgroundColor: 'var(--bg-surface-elevated)', opacity: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: auditType === 'Internal' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              flexShrink: 0
            }}>
              {auditType === 'Internal' ? <Ship size={24} /> : <Building2 size={24} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: 0 }}>
                  Laporan Audit ISM – Code / ISM – Code Audit Report
                </h3>
                <span className={`badge ${auditType === 'Internal' ? 'badge-info' : 'badge-warning'}`} style={{ fontWeight: 800 }}>
                  {auditType === 'Internal' ? 'INTERNAL BAHARIMAS' : `EKSTERNAL: ${externalOrg}`}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
                Format Resmi Informasi Ketidaksesuaian (NCR) • Report ID: <strong className="mono" style={{ color: 'var(--text-main)' }}>{reportId}</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleLoadSampleRP2004}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#0284c7',
                border: '1px solid #0284c7'
              }}
              title="Muat contoh lengkap sesuai foto formulir RP 2004 (Klausul 5.1.5)"
            >
              <Sparkles size={14} color="#0284c7" />
              <span>Muat Contoh RP 2004 (5.1.5)</span>
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.6rem' }}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              <span style={{ fontSize: '0.75rem' }}>{isFullscreen ? 'Normal' : 'Fullscreen'}</span>
            </button>
            <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.6rem' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="modal-body" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem', background: 'var(--bg-surface-card)', backgroundColor: 'var(--bg-surface-card)', opacity: 1 }}>
            
            {/* KONTROL JENIS AUDIT & LEMBAGA (SESUAI ATURAN USER) */}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Pilih Kategori Pelaksanaan Audit ISM Code:
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setAuditType('Internal')}
                    className={`btn btn-sm ${auditType === 'Internal' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem', fontWeight: 700 }}
                  >
                    🚢 1. Audit Internal (PT. Baharimas)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuditType('External')}
                    className={`btn btn-sm ${auditType === 'External' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem', fontWeight: 700 }}
                  >
                    🏢 2. Audit Eksternal (Lembaga Ditunjuk)
                  </button>
                </div>
              </div>

              {auditType === 'External' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-glass)' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      Lembaga Audit Eksternal yang Ditunjuk Perusahaan *
                    </label>
                    <select
                      value={externalOrg}
                      onChange={(e) => setExternalOrg(e.target.value)}
                      className="select-control"
                      style={{ fontSize: '0.8rem', fontWeight: 700, borderColor: '#7c3aed' }}
                    >
                      <optgroup label="Standar BKI (Template Resmi F23.14.06-2024 Rev 05)">
                        <option value={BKI_AUDIT_MASTER.name}>
                          {BKI_AUDIT_MASTER.name}
                        </option>
                      </optgroup>
                      <optgroup label="Lembaga Lain (Format Mandiri / Manual — Non-BKI)">
                        {NON_BKI_AUDIT_ORGANIZATIONS.map(org => (
                          <option key={org.id} value={org.name}>
                            {org.name}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {(externalOrg === 'Lembaga Audit Eksternal Lainnya (Input Manual)' ||
                    (typeof externalOrg === 'string' && externalOrg.includes('Lainnya'))) && (
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Tuliskan Nama Lembaga Ditunjuk *
                      </label>
                      <input
                        type="text"
                        required
                        value={customExternalOrg}
                        onChange={(e) => setCustomExternalOrg(e.target.value)}
                        placeholder="cth: RINA Services / KSOP Kelas II Pontianak..."
                        className="input-control"
                      />
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      Nomor Laporan / Report ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={reportId}
                      onChange={(e) => setReportId(e.target.value)}
                      placeholder="contoh: 0859 - PK/ISM- SMC /2026"
                      className="input-control mono"
                      style={{ fontWeight: 800, color: '#7c3aed', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ paddingTop: '0.35rem', fontSize: '0.75rem', color: '#0284c7' }}>
                  ℹ️ <em>Audit Internal dilaksanakan oleh Tim DPA & Safety Officer PT. Pelayaran Baharimas Kalimantan.</em>
                </div>
              )}
            </div>

            {/* SEKSI 1: INFORMASI KETIDAKSESUAIAN / NON-CONFORMITY INFORMATION */}
            <div style={{
              borderRadius: '10px',
              border: '1.5px solid var(--border-subtle)',
              background: 'var(--bg-surface-elevated)',
              backgroundColor: 'var(--bg-surface-elevated)',
              overflow: 'hidden',
              opacity: 1
            }}>
              <div style={{
                background: 'var(--bg-surface-hover)',
                color: 'var(--text-main)',
                padding: '0.5rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: 800,
                letterSpacing: '0.5px'
              }}>
                INFORMASI KETIDAKSESUAIAN / NON-CONFORMITY INFORMATION
              </div>

              <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    LINGKUP AUDIT / Area under Audit *
                  </label>
                  <input
                    type="text"
                    required
                    value={areaUnderAudit}
                    onChange={(e) => setAreaUnderAudit(e.target.value)}
                    placeholder="contoh: RP 2004 atau Kantor Pusat PBK"
                    className="input-control"
                    style={{ fontWeight: 800, fontSize: '0.9rem' }}
                  />
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem', display: 'block' }}>
                    Nama kapal atau departemen darat yang diaudit
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    No. Lap. Ketidaksesuaian / NCR No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={findingNo}
                    onChange={(e) => setFindingNo(e.target.value)}
                    placeholder="contoh: 1/4 - 0859 - PK/ISM- SMC /2026"
                    className="input-control mono"
                    style={{ fontWeight: 800, color: '#ef4444', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Tgl. Audit / Date of Audit *
                  </label>
                  <input
                    type="date"
                    required
                    value={dateOfAudit}
                    onChange={(e) => setDateOfAudit(e.target.value)}
                    className="input-control mono"
                    style={{ fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    No. Elemen dari Koda / Element Number of Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={elementNumberOfCode}
                    onChange={(e) => {
                      setElementNumberOfCode(e.target.value);
                      setClauseCode(e.target.value.split(' ')[0]);
                    }}
                    placeholder="contoh: 5.1.5 or other"
                    className="input-control mono"
                    style={{ fontWeight: 800, color: '#0284c7' }}
                  />
                </div>
              </div>
            </div>

            {/* SEKSI 2: RINCIAN KETIDAKSESUAIAN & BUKTI OBJEKTIF */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                  Rincian Ketidaksesuaian / Non-Conformity Details *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Uraikan kondisi temuan ketidaksesuaian terhadap ketentuan ISM Code..."
                  className="input-control"
                  style={{ lineHeight: '1.45' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                  Bukti Objektif / Objective Evidence *
                </label>
                <textarea
                  required
                  rows={3}
                  value={objectiveEvidence}
                  onChange={(e) => setObjectiveEvidence(e.target.value)}
                  placeholder="- Poin 1 bukti objektif temuan audit...&#10;- Poin 2 catatan dokumen atau fakta lapangan..."
                  className="input-control"
                  style={{ lineHeight: '1.45', fontFamily: 'monospace', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            {/* SEKSI 3: KATEGORI KETIDAKSESUAIAN & TANDA TANGAN AWAL */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', background: 'var(--bg-surface-elevated)', backgroundColor: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', opacity: 1 }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: '0.4rem' }}>
                  Kategori Ketidaksesuaian / Category *
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {['Non-Conformity', 'Major NC', 'Observasi'].map(cat => (
                    <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="categorySelection"
                        checked={category === cat}
                        onChange={() => setCategory(cat)}
                      />
                      <span style={{ fontWeight: category === cat ? 800 : 500, color: category === cat ? '#0284c7' : 'inherit' }}>
                        {cat === 'Major NC' ? 'Major Non-Conformity (MNC)' : cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  Tanda tangan Auditor / Auditor's Signature *
                </label>
                <input
                  type="text"
                  required
                  value={auditor}
                  onChange={(e) => setAuditor(e.target.value)}
                  placeholder="Nama Auditor"
                  className="input-control"
                  style={{ fontSize: '0.8rem', fontWeight: 700 }}
                />
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem', display: 'block' }}>
                  {auditType === 'External' ? externalOrg : 'Lead Auditor PBK'}
                </span>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  Tanda tangan yang diaudit / Auditee's Signature *
                </label>
                <input
                  type="text"
                  required
                  value={auditee}
                  onChange={(e) => setAuditee(e.target.value)}
                  placeholder="Nama Nakhoda / KKM / DPA"
                  className="input-control"
                  style={{ fontSize: '0.8rem', fontWeight: 700 }}
                />
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem', display: 'block' }}>
                  Pihak yang Diaudit (Kapal {areaUnderAudit})
                </span>
              </div>
            </div>

            {/* SEKSI 4: PERBAIKAN / CORRECTION (to be completed by auditee) */}
            <div style={{
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              padding: '0.85rem 1rem',
              background: 'var(--bg-surface-elevated)',
              backgroundColor: 'var(--bg-surface-elevated)',
              opacity: 1
            }}>
              <label style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                PERBAIKAN (diisi oleh pihak yang diaudit) / CORRECTION (to be completed by auditee)
              </label>
              <textarea
                rows={2}
                value={correction}
                onChange={(e) => setCorrection(e.target.value)}
                placeholder="Tindakan koreksi langsung atas ketidaksesuaian yang ditemukan..."
                className="input-control"
                style={{ fontSize: '0.8rem' }}
              />
            </div>

            {/* SEKSI 5: ANALISA AKAR PERMASALAHAN / ROOT CAUSE ANALYSIS (to be completed by auditee) */}
            <div style={{
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              padding: '0.85rem 1rem',
              background: 'var(--bg-surface-elevated)',
              backgroundColor: 'var(--bg-surface-elevated)',
              opacity: 1
            }}>
              <label style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                ANALISA AKAR PERMASALAHAN (diisi oleh pihak yang diaudit) / ROOT CAUSE ANALYSIS (to be completed by auditee)
              </label>
              <textarea
                rows={2}
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                placeholder="Analisa penyebab utama kenapa kekurangan/ketidaksesuaian dapat terjadi..."
                className="input-control"
                style={{ fontSize: '0.8rem' }}
              />
            </div>

            {/* SEKSI 6: TINDAKAN PERBAIKAN / CORRECTIVE ACTION (to be completed by auditee) */}
            <div style={{
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              padding: '0.85rem 1rem',
              background: 'var(--bg-surface-elevated)',
              backgroundColor: 'var(--bg-surface-elevated)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              opacity: 1
            }}>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                  TINDAKAN PERBAIKAN (diisi oleh pihak yang diaudit) / CORRECTIVE ACTION (to be completed by auditee)
                </label>
                <textarea
                  rows={2}
                  value={correctiveAction}
                  onChange={(e) => setCorrectiveAction(e.target.value)}
                  placeholder="Rencana tindakan pencegahan jangka panjang agar masalah serupa tidak terulang..."
                  className="input-control"
                  style={{ fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-subtle)' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Tanggal kesepakatan penyelesaian / Agreed date for completion *
                  </label>
                  <input
                    type="date"
                    required
                    value={agreedDate}
                    onChange={(e) => setAgreedDate(e.target.value)}
                    className="input-control mono"
                    style={{ fontWeight: 800, color: '#0284c7' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Tanggal Pengesahan Auditee / Date
                  </label>
                  <input
                    type="date"
                    value={auditeeSignatureDate}
                    onChange={(e) => setAuditeeSignatureDate(e.target.value)}
                    className="input-control mono"
                  />
                </div>
              </div>
            </div>

            {/* SEKSI 7: TINDAKAN PERBAIKAN TELAH DIVERIFIKASI (diisi oleh Auditor) / CORRECTIVE ACTION VERIFIED */}
            <div style={{
              borderRadius: '10px',
              border: '1.5px solid #10b981',
              background: 'var(--bg-surface-elevated)',
              backgroundColor: 'var(--bg-surface-elevated)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              opacity: 1
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#047857', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} />
                <span>TINDAKAN PERBAIKAN TELAH DIVERIFIKASI (diisi oleh Auditor) / CORRECTIVE ACTION VERIFIED</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Perubahan kategori ketidaksesuaian karena sebab diatas / Upgrade / Downgrade NC:
                  </span>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={verifiedUpgradeDowngrade === 'MJ'}
                        onChange={(e) => setVerifiedUpgradeDowngrade(e.target.checked ? 'MJ' : null)}
                      />
                      <span>MJ (Major NC)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={verifiedUpgradeDowngrade === 'NC'}
                        onChange={(e) => setVerifiedUpgradeDowngrade(e.target.checked ? 'NC' : null)}
                      />
                      <span>NC (Non-Conformity)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Tindakan perbaikan dilaksanakan dengan baik / Completed satisfactorily:
                  </span>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="satisfactoryRadio"
                        checked={verifiedSatisfactory === true}
                        onChange={() => setVerifiedSatisfactory(true)}
                      />
                      <strong style={{ color: '#10b981' }}>☑ Ya / Yes</strong>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="satisfactoryRadio"
                        checked={verifiedSatisfactory === false}
                        onChange={() => setVerifiedSatisfactory(false)}
                      />
                      <strong style={{ color: '#ef4444' }}>☐ Tidak / No</strong>
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px dashed rgba(16, 185, 129, 0.3)' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Catatan Verifikasi Auditor ISM
                  </label>
                  <input
                    type="text"
                    value={auditorReviewNotes}
                    onChange={(e) => setAuditorReviewNotes(e.target.value)}
                    placeholder="Catatan penutupan / verifikasi fisik di lapangan..."
                    className="input-control"
                    style={{ fontSize: '0.78rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Tanggal Verifikasi Auditor / Date
                  </label>
                  <input
                    type="date"
                    value={auditorSignatureDate}
                    onChange={(e) => setAuditorSignatureDate(e.target.value)}
                    className="input-control mono"
                  />
                </div>
              </div>
            </div>

            {/* SEKSI 8: UPLOAD BUKTI EVIDEN PERBAIKAN */}
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

            {/* SEKSI 9: INTEGRASI SPB GUDANG & SERTIFIKAT */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
                  Tautkan Sertifikat Statutori Terkait (Opsional)
                </label>
                <select
                  value={linkedCertificateId}
                  onChange={(e) => setLinkedCertificateId(e.target.value)}
                  className="select-control"
                  style={{ fontSize: '0.78rem' }}
                >
                  <option value="">-- Tidak Terkait Sertifikat Spesifik --</option>
                  {(shipDocuments || []).slice(0, 25).map(cert => (
                    <option key={cert.id} value={cert.id}>
                      {cert.name || cert.type} ({cert.documentNumber || 'No. Dok'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
                  Tautkan Permintaan Suku Cadang ke Gudang (Opsional)
                </label>
                <select
                  value={linkedRequisitionId}
                  onChange={(e) => setLinkedRequisitionId(e.target.value)}
                  className="select-control"
                  style={{ fontSize: '0.78rem' }}
                >
                  <option value="">-- Tidak Terkait SPB Gudang --</option>
                  {(requisitions || []).map(req => (
                    <option key={req.id} value={req.id}>
                      {req.requisitionNumber || req.id} - {req.title || req.department || 'Material Requisition'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="modal-footer" style={{ borderTop: '1px solid var(--border-subtle)', padding: '0.85rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface-elevated)', backgroundColor: 'var(--bg-surface-elevated)', opacity: 1 }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Batal
              </button>
              {isEdit && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn btn-secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: '#ef4444',
                    borderColor: 'rgba(239, 68, 68, 0.4)',
                    fontWeight: 700
                  }}
                  title="Hapus Temuan Ini"
                >
                  <Trash2 size={14} />
                  <span>Hapus Temuan</span>
                </button>
              )}
            </div>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 800 }}>
              <Save size={16} />
              <span>{isEdit ? 'Simpan Perubahan Laporan NCR' : 'Simpan Laporan Ketidaksesuaian (NCR)'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* In-app Confirm Delete Finding Modal */}
      {showDeleteConfirm && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 15000,
            background: 'rgba(3, 7, 18, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: '460px',
              width: '100%',
              background: 'var(--bg-surface-card)',
              backgroundColor: 'var(--bg-surface-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.75)',
              overflow: 'hidden',
              opacity: 1
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                <Trash2 size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Hapus Temuan Ketidaksesuaian</h3>
                <p style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700, margin: '0.15rem 0 0 0' }}>Tindakan ini tidak dapat dibatalkan</p>
              </div>
              <button type="button" onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.5rem' }}>
                <X size={15} />
              </button>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Nomor Temuan (NCR):</div>
                <div className="mono" style={{ fontSize: '1rem', fontWeight: 800, color: '#ef4444' }}>{finding?.findingNo}</div>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                Catatan temuan ini beserta seluruh data rencana tindakan koreksi dan eviden yang terlampir akan dihapus permanen.
              </p>
            </div>
            <div style={{ padding: '0.85rem 1.5rem', background: 'var(--bg-surface-elevated)', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary btn-sm" style={{ padding: '0.45rem 1rem' }}>
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteAuditFinding(finding?.id || finding?.findingNo);
                  setShowDeleteConfirm(false);
                  onClose();
                }}
                className="btn btn-sm"
                style={{ background: '#ef4444', color: '#fff', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 1.1rem' }}
              >
                <Trash2 size={14} />
                <span>Ya, Hapus Temuan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
