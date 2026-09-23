import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePMS } from '../../context/PMSContext';
import {
  Printer,
  X,
  CheckCircle2,
  FileText,
  Ship,
  CheckSquare,
  Square,
  Building,
  ShieldCheck,
  Paperclip,
  Eye,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { formatIndoDate } from '../../utils/auditTimeUtils';
import {
  getChecklistConfigForSession,
  isBKIOrganization,
  EXTERNAL_AUDIT_ORGANIZATIONS
} from '../../data/auditMasterData';
import { AuditInstitutionHeader, getInstitutionBranding } from './AuditInstitutionHeader';
import { BkiShipboardChecklistReport } from './BkiShipboardChecklistReport';
import { BkiDocChecklistReport } from './BkiDocChecklistReport';

export const AuditReportModal = ({
  session,
  finding,
  onClose,
  liveChecklist = null,       // real-time checklist dari AuditSessionModal (prioritas tertinggi)
  initialMode = 'session'   // 'session' | 'ncr' | 'checklist'
}) => {
  const { vessels, allAudits, allAuditFindings, currentUser } = usePMS();

  // Attach body class for print isolation
  useEffect(() => {
    document.body.classList.add('audit-report-printing-active');
    return () => {
      document.body.classList.remove('audit-report-printing-active');
    };
  }, []);

  // Resolve active session
  const activeSession = session || (finding ? allAudits?.find(a => a.id === finding.auditId) : null) || {
    id: 'aud-default',
    auditNo: finding?.auditNo || '0859-PK/ISM-SMC/2026',
    reportId: finding?.reportId || '0859-PK/ISM-SMC/2026',
    auditType: finding?.auditType || 'Internal',
    externalOrganization: finding?.externalOrganization || '',
    standard: finding?.standard || 'SMC',
    targetType: finding?.vesselId ? 'Vessel' : 'Office',
    targetName: finding?.targetName || 'TB. RP 2004',
    vesselId: finding?.vesselId || 'v-rp2004',
    leadAuditor: finding?.auditor || 'Ir. Bambang Suryono (Lead Auditor)',
    auditTeam: ['Dian Anggraini (Safety Officer)', 'Heri Prasetyo (Marine Superintendent)'],
    auditee: 'Capt. Ekhsan (Nakhoda) & Chief Engineer',
    auditDate: finding?.dateIdentified || '2026-02-21',
    targetCloseDate: finding?.dueDate || '2026-05-21',
    auditLocation: 'Dermaga / Pelabuhan Pontianak, Kalimantan Barat',
    scope: 'Verifikasi Implementasi Standar Sistem Manajemen Keselamatan (ISM Code) dan SMS Shipboard Checklist TB. RP 2004.',
    status: 'Completed',
    totalItemsChecked: 35,
    itemsComplied: 34,
    findingsSummary: {
      majorNC: 0,
      minorNC: 1,
      observation: 0,
      totalOpen: 0,
      totalClosed: 1
    },
    auditConclusion: 'Berdasarkan hasil verifikasi audit lapangan dan penyelesaian seluruh rencana tindakan perbaikan (CAP), Sistem Manajemen Keselamatan (SMS) kapal TB. RP 2004 dinilai berjalan efektif dan memenuhi standar IMO ISM Code. Sertifikat SMC direkomendasikan tetap dipertahankan.',
    leadAuditorSign: 'Ir. Bambang Suryono',
    auditeeSign: 'Capt. Ekhsan'
  };

  // Resolusi checklist sesuai lembaga audit
  // BKI dan Audit Internal PBK memiliki template resmi (SMC: F23.14.06 Rev 05, DOC: F23.14.05 Rev 06) — lembaga non-BKI menghasilkan items=[]
  const checklistConfig = getChecklistConfigForSession(
    activeSession.externalOrganization || (activeSession.auditType === 'Internal' ? 'internal' : activeSession.standard),
    activeSession.standard || 'SMC'
  );
  const isBKISession = isBKIOrganization(activeSession.externalOrganization || checklistConfig.organizationId) ||
    activeSession.auditType === 'Internal' ||
    checklistConfig.organizationId === 'internal' ||
    String(activeSession.externalOrganization).toLowerCase().includes('internal') ||
    String(activeSession.externalOrganization).toLowerCase().includes('baharimas');

  // Prioritas data checklist:
  // 1. liveChecklist (real-time dari AuditSessionModal — jika bukan BKI & bukan Internal, buang template bawaan)
  // 2. activeSession.checklist (tersimpan di object sesi — jika bukan BKI & bukan Internal, buang template bawaan)
  // 3. Template statis dari checklistConfig (terisi untuk BKI & Internal, kosong [] untuk lembaga lain)
  const resolveSessionChecklist = () => {
    if (Array.isArray(liveChecklist)) {
      if (!isBKISession) {
        return liveChecklist.filter(item => item.isManual);
      }
      return liveChecklist;
    }
    if (Array.isArray(activeSession.checklist) && activeSession.checklist.length > 0) {
      if (!isBKISession) {
        return activeSession.checklist.filter(item => item.isManual);
      }
      return activeSession.checklist;
    }
    return isBKISession ? checklistConfig.items : [];
  };

  const resolvedList = resolveSessionChecklist();
  const reportChecklistItems = resolvedList.map((item, idx) => ({
    ...item,
    no: idx + 1,
    item: item.name || item.checkPoint || item.code,
    subsection: item.name || '',
    ismCode: item.ismCode || '',
    remark: item.notes || item.remark || '',
    isStrikethrough: Boolean(item.isStrikethrough)
  }));


  // Find all findings related to this session or target
  const sessionFindings = (allAuditFindings || []).filter(f => {
    if (activeSession.id && f.auditId === activeSession.id) return true;
    if (activeSession.vesselId && f.vesselId === activeSession.vesselId) return true;
    if (activeSession.targetType === 'Office' && (!f.vesselId || f.standard === 'DOC')) return true;
    return false;
  });

  // Active finding for NCR mode
  const [selectedFindingId, setSelectedFindingId] = useState(
    finding?.id || sessionFindings.find(f => f.status === 'NC Close')?.id || sessionFindings[0]?.id || null
  );

  const activeFinding = sessionFindings.find(f => f.id === selectedFindingId) || finding || sessionFindings[0] || {
    id: 'f-demo-rp2004',
    findingNo: '1/4 - 0859 - PK/ISM- SMC /2026',
    reportId: '0859-PK/ISM-SMC/2026',
    auditNo: '0859-PK/ISM-SMC/2026',
    auditType: activeSession.auditType,
    externalOrganization: activeSession.externalOrganization,
    standard: 'SMC',
    targetName: 'TB. RP 2004',
    vesselId: 'v-rp2004',
    clauseCode: '5.1.5',
    clauseName: "Master's Responsibility - Operating in Heavy Weather",
    category: 'Minor NC',
    status: 'NC Close',
    description: 'Pada saat pelaksanaan audit ditanyakan kepada Nakhoda mengenai instruksi pengoperasian kapal dalam cuaca buruk, Nakhoda tidak dapat menunjukkan dokumen yang relevan terkait hal tersebut.',
    objectiveEvidence: 'Dokumen instruksi pengoperasian kapal dalam cuaca buruk belum tersedia di anjungan.',
    dateIdentified: '2026-02-21',
    dueDate: '2026-05-21',
    assignedTo: 'Capt. Ekhsan (Nakhoda TB. RP 2004)',
    auditor: 'Ir. Bambang Suryono',
    evidence: {
      hasSubmitted: true,
      submissionDate: '2026-03-02',
      submittedBy: 'Capt. Ekhsan (Nakhoda)',
      correction: 'Nakhoda telah melengkapi instruksi pengoperasian kapal dalam cuaca buruk pada formulir No. Dok. SMS/PBK-SOP/NAV-09 dan disosialisasikan kepada seluruh perwira jaga deck.',
      rootCause: 'Kurangnya pemahaman dan ketelitian Nakhoda dalam pengarsipan salinan instruksi navigasi cuaca buruk saat proses serah terima jabatan (handover) nakhoda sebelumnya.',
      correctiveAction: 'Memastikan seluruh SOP dan instruksi kerja navigasi cuaca buruk telah terpasang di anjungan, dilakukan briefing rutin bulanan sebelum pelayaran, serta verifikasi oleh DPA saat inspeksi triwulan.',
      preventiveAction: 'Pemeriksaan kelengkapan checklist navigasi cuaca buruk dilakukan sebelum penerbitan Port Clearance.',
      agreedDate: '2026-05-21',
      verifiedUpgradeDowngrade: false,
      verifiedSatisfactory: true,
      verifiedAuditor: 'Ir. Bambang Suryono',
      auditorReviewNotes: 'Telah dilakukan verifikasi bukti dokumen SOP Navigasi Cuaca Buruk yang telah disosialisasikan, daftar hadir sosialisasi kru deck, serta foto penempelan instruksi di anjungan kapal TB. RP 2004. Tindakan perbaikan dinilai efektif memenuhi klausul ISM Code 5.1.5.',
      closedDate: '2026-03-10',
      fileName: 'Bukti_SOP_Cuaca_Buruk_RP2004.pdf',
      fileSize: '1.4 MB'
    }
  };

  // Report view mode: 'session' | 'ncr' | 'checklist'
  const [reportMode, setReportMode] = useState(
    initialMode === 'checklist' ? 'checklist' : initialMode === 'ncr' && activeFinding ? 'ncr' : 'session'
  );

  // Vessel particulars if target is a ship
  const currentVessel = (vessels || []).find(v => v.id === activeSession.vesselId) ||
    (vessels || []).find(v => v.id === activeFinding?.vesselId) ||
    (vessels || []).find(v => {
      const tgt = (activeFinding?.targetName || activeSession?.targetName || '').toLowerCase();
      return tgt && (v.name?.toLowerCase().includes(tgt) || tgt.includes(v.name?.toLowerCase()));
    }) ||
    (vessels && vessels[0]);

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Compliance percentage calculation
  const totalChecked = activeSession.totalItemsChecked || (sessionFindings.length > 0 ? sessionFindings.length + 20 : 35);
  const totalClosedFindings = sessionFindings.filter(f => f.status === 'NC Close').length;
  const totalOpenFindings = sessionFindings.filter(f => f.status !== 'NC Close').length;
  const compliedItems = activeSession.itemsComplied || (totalChecked - totalOpenFindings);
  const complianceScore = Math.min(100, Math.round((compliedItems / totalChecked) * 100));

  // Determine official audit close date
  const officialCloseDate = activeFinding?.evidence?.closedDate || activeSession.targetCloseDate || '2026-03-10';

  // Dynamic Institution Branding: Multi-Institution (BKI, KSOP, Ditjen Hubla, PBK, Custom)
  const institutionBranding = getInstitutionBranding(activeSession, activeFinding);
  const isBKI = institutionBranding.isBKI;
  const isExternal = activeSession.auditType === 'External' || activeFinding?.auditType === 'External';
  const appointedOrg = institutionBranding.shortName || 'Badan Klasifikasi Terakreditasi';
  const institutionDetails = institutionBranding;

  const modalContent = (
    <div className="audit-report-portal modal-overlay" style={{ zIndex: 12000, padding: '1rem', overflowY: 'auto' }}>
      <div
        className="modal-dialog"
        style={{
          maxWidth: '1050px',
          width: '100%',
          margin: '1.5rem auto',
          background: 'var(--bg-surface)',
          borderRadius: '14px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.65)',
          border: '1px solid var(--border-glass)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '94vh',
          overflow: 'hidden'
        }}
      >
        {/* ========================================================================= */}
        {/* MODAL CONTROLS HEADER (HIDDEN WHEN PRINTING)                               */}
        {/* ========================================================================= */}
        <div
          className="no-print"
          style={{
            padding: '0.85rem 1.25rem',
            background: 'var(--bg-surface-elevated)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: isExternal ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: isExternal ? '0 4px 12px rgba(5, 150, 105, 0.35)' : '0 4px 12px rgba(2, 132, 199, 0.35)'
              }}
            >
              {isExternal ? <Building size={20} /> : <Ship size={20} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Laporan Cetak Audit ISM Code Resmi</span>
                <span className={`badge ${isExternal ? 'badge-success' : 'badge-info'}`} style={{ fontSize: '0.68rem' }}>
                  {isExternal ? `Lembaga: ${appointedOrg}` : 'Internal Baharimas'}
                </span>
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                {activeSession.reportId || activeSession.auditNo} • {activeSession.targetName || currentVessel?.name} ({activeSession.standard})
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* View Mode Toggle: 3 Modes */}
            <div
              style={{
                display: 'flex',
                background: 'var(--bg-input)',
                padding: '0.2rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <button
                type="button"
                onClick={() => setReportMode('session')}
                className={`tab-btn ${reportMode === 'session' ? 'active' : ''}`}
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.76rem',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: reportMode === 'session' ? 700 : 600,
                  color: reportMode === 'session' ? '#ffffff' : 'var(--text-main)',
                  background: reportMode === 'session' ? 'var(--primary)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                1. Sesi Audit ({institutionBranding.shortName})
              </button>
              <button
                type="button"
                onClick={() => setReportMode('ncr')}
                className={`tab-btn ${reportMode === 'ncr' ? 'active' : ''}`}
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.76rem',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: reportMode === 'ncr' ? 700 : 600,
                  color: reportMode === 'ncr' ? '#ffffff' : 'var(--text-main)',
                  background: reportMode === 'ncr' ? 'var(--primary)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                2. Lembar NC / Observasi
              </button>
              <button
                type="button"
                onClick={() => setReportMode('checklist')}
                className={`tab-btn ${reportMode === 'checklist' ? 'active' : ''}`}
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.76rem',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: reportMode === 'checklist' ? 700 : 600,
                  color: reportMode === 'checklist' ? '#ffffff' : (isBKI ? '#0284c7' : 'var(--text-main)'),
                  background: reportMode === 'checklist' ? 'var(--primary)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {isBKI
                  ? (activeSession.standard === 'DOC' ? '3. Checklist Resmi DOC BKI (Persis PDF Rev 06)' : '3. Checklist Resmi BKI (Persis PDF Rev 05)')
                  : `3. Checklist Audit ${institutionBranding.shortName}`}
              </button>
            </div>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-primary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 800,
                padding: '0.45rem 0.9rem',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
              }}
              title="Cetak dokumen standar A4 atau simpan ke PDF"
            >
              <Printer size={15} />
              <span>Cetak / PDF (A4)</span>
            </button>

            {/* Close Modal Button */}
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.45rem', borderRadius: '8px' }}
              title="Tutup Pratinjau"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Secondary Bar if NCR mode to choose which NC */}
        {reportMode === 'ncr' && sessionFindings.length > 1 && (
          <div
            className="no-print"
            style={{
              padding: '0.5rem 1.25rem',
              background: 'rgba(2, 132, 199, 0.08)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.76rem'
            }}
          >
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Pilih Temuan NC untuk Dicetak:</span>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {sessionFindings.map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFindingId(f.id)}
                  style={{
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: selectedFindingId === f.id ? '1px solid #0284c7' : '1px solid var(--border-subtle)',
                    background: selectedFindingId === f.id ? '#0284c7' : 'var(--bg-surface)',
                    color: selectedFindingId === f.id ? '#ffffff' : 'var(--text-main)'
                  }}
                >
                  {f.findingNo} ({f.clauseCode || f.status})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DOCUMENT PREVIEW CONTAINER (PRINTABLE AREA)                              */}
        {/* ========================================================================= */}
        <div
          className="audit-print-container"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '2rem 1.5rem',
            background: '#e2e8f0' // Backdrop light gray like paper in viewer
          }}
        >
          {/* ======================================================================= */}
          {/* A4 PAPER CANVAS                                                         */}
          {/* ======================================================================= */}
          <div
            className={`audit-report-sheet maritime-print-sheet ${reportMode === 'checklist' && isBKI ? 'bki-sheet-mode' : ''}`}
            style={{
              width: '100%',
              maxWidth: reportMode === 'checklist' && isBKI ? '900px' : '860px',
              margin: '0 auto',
              background: '#ffffff',
              color: '#0f172a',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
              padding: reportMode === 'checklist' && isBKI ? '0.6cm 0.8cm' : '1.8cm 1.6cm',
              boxSizing: 'border-box',
              fontFamily: "'Arial', 'Segoe UI', sans-serif",
              fontSize: '10pt',
              lineHeight: '1.4',
              position: 'relative'
            }}
          >
            {/* Watermark Stamp: VERIFIED CLOSED (Hanya untuk Sesi Audit / NC Closeout) */}
            {!(reportMode === 'checklist' && isBKI) && activeSession.status === 'Completed' && (
              <div
                className="audit-watermark"
                style={{
                  position: 'absolute',
                  top: '45%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) rotate(-25deg)',
                  border: '4px solid rgba(16, 185, 129, 0.15)',
                  color: 'rgba(16, 185, 129, 0.15)',
                  fontSize: '32pt',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '4px',
                  padding: '10px 30px',
                  borderRadius: '14px',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                  zIndex: 0
                }}
              >
                ISM CODE VERIFIED<br />
                <span style={{ fontSize: '18pt', letterSpacing: '2px' }}>STATUS: NC CLOSED</span>
              </div>
            )}

            {/* ===================================================================== */}
            {/* 1. OFFICIAL KOP SURAT (SESUAI STANDAR MASING-MASING LEMBAGA: BKI, KSOP DLL) */}
            {/* ===================================================================== */}
            {!(reportMode === 'checklist' && isBKI) && (
              <AuditInstitutionHeader
                branding={institutionBranding}
                session={activeSession}
                vessel={currentVessel}
              />
            )}

            {/* ===================================================================== */}
            {/* 2. DOCUMENT TITLE HEADER                                              */}
            {/* ===================================================================== */}
            {!(reportMode === 'checklist' && isBKI) && (
              <div className="audit-report-title" style={{ textAlign: 'center', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
                <h2
                  style={{
                    fontSize: '12pt',
                    fontWeight: 900,
                    margin: 0,
                    textTransform: 'uppercase',
                    color: '#000000',
                    letterSpacing: '0.5px'
                  }}
                >
                  {reportMode === 'session'
                    ? (institutionBranding.docTitleId || `LAPORAN HASIL AUDIT SISTEM MANAJEMEN KESELAMATAN (${activeSession.standard})`)
                    : reportMode === 'checklist'
                    ? `DAFTAR BUTIR PEMERIKSAAN KELAIKLAUTAN (${institutionBranding.shortName})`
                    : 'LAPORAN KETIDAKSESUAIAN / OBSERVASI'}
                </h2>
                <div
                  style={{
                    fontSize: '8.5pt',
                    fontWeight: 700,
                    margin: '2px 0 0',
                    color: institutionBranding.primaryColor,
                    fontStyle: reportMode === 'ncr' ? 'italic' : 'normal'
                  }}
                >
                  {reportMode === 'session'
                    ? (institutionBranding.docTitleEn || 'STATUTORY SAFETY MANAGEMENT AUDIT REPORT')
                    : reportMode === 'checklist'
                    ? (institutionBranding.docTitleEn || 'SAFETY INSPECTION CHECKLIST')
                    : '(NON-CONFORMITY / OBSERVATION REPORT)'}
                </div>
                <div style={{ display: 'inline-block', borderBottom: '2px solid #000000', width: '90px', margin: '3px auto 0' }} />
              </div>
            )}

            {/* ===================================================================== */}
            {/* MODE 1: LAPORAN SESI AUDIT LENGKAP                                     */}
            {/* ===================================================================== */}
            {reportMode === 'session' && (
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* BAGIAN I: INFORMASI UMUM & IDENTITAS AUDIT */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '9pt', fontWeight: 800, color: '#000000', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-block', width: '4px', height: '12px', background: '#0284c7' }} />
                    BAGIAN I: INFORMASI UMUM & IDENTITAS AUDIT
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8pt', border: '1px solid #000000' }}>
                    <tbody>
                      <tr style={{ background: '#f8fafc' }}>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000', fontWeight: 700, width: '25%' }}>No. Registrasi Audit / ID</td>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000', width: '25%', fontWeight: 800, color: '#0369a1' }}>{activeSession.reportId || activeSession.auditNo}</td>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000', fontWeight: 700, width: '25%' }}>Standar Audit</td>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000', width: '25%', fontWeight: 700 }}>
                          ISM Code ({activeSession.standard === 'DOC' ? 'Document of Compliance' : 'Safety Management Certificate'})
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000', fontWeight: 700 }}>Jenis Pelaksanaan</td>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000' }}>
                          Audit {activeSession.auditType} ({isExternal ? appointedOrg : 'PT. PBK Internal'})
                        </td>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000', fontWeight: 700 }}>Status Pelaksanaan</td>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000' }}>
                          <strong style={{ color: '#047857' }}>{activeSession.status === 'Completed' ? 'SELESAI (COMPLETED & CLOSED)' : activeSession.status}</strong>
                        </td>
                      </tr>
                      <tr style={{ background: '#f8fafc' }}>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000', fontWeight: 700 }}>Objek / Target Audit</td>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000', fontWeight: 700 }}>
                          {activeSession.targetName || currentVessel?.name}
                        </td>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000', fontWeight: 700 }}>Data Teknis Kapal / Unit</td>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000' }}>
                          {activeSession.targetType === 'Vessel'
                            ? `Reg: ${currentVessel?.regNo || currentVessel?.imo || '-'} | Call Sign: ${currentVessel?.callSign || '-'} | GT: ${currentVessel?.gt || '-'}`
                            : 'Kantor Pusat Darat Pontianak'}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000', fontWeight: 700 }}>Tanggal Pelaksanaan</td>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000' }}>{formatIndoDate(activeSession.auditDate)}</td>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000', fontWeight: 700 }}>Tanggal Penutupan Resmi</td>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000', fontWeight: 800, color: '#047857' }}>
                          {formatIndoDate(officialCloseDate)}
                        </td>
                      </tr>
                      <tr style={{ background: '#f8fafc' }}>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000', fontWeight: 700 }}>Lokasi Pelaksanaan</td>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000' }}>{activeSession.auditLocation || 'Dermaga Pontianak, Kalimantan Barat'}</td>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000', fontWeight: 700 }}>Auditee (Pihak Diaudit)</td>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000' }}>{activeSession.auditee}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000', fontWeight: 700 }}>Lead Auditor</td>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000', fontWeight: 700 }}>{activeSession.leadAuditor}</td>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000', fontWeight: 700 }}>Lembaga Auditor</td>
                        <td style={{ padding: '5px 7px', border: '1px solid #000000' }}>{isExternal ? appointedOrg : 'Internal DPA/QHSE PT. PBK'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* BAGIAN II: RINGKASAN TINGKAT KEPATUHAN */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '9pt', fontWeight: 800, color: '#000000', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-block', width: '4px', height: '12px', background: '#0284c7' }} />
                    BAGIAN II: RINGKASAN PEMERIKSAAN & STATUS KEPATUHAN
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '6px' }}>
                    <div style={{ border: '1px solid #000000', padding: '5px 8px', textAlign: 'center', background: '#f8fafc' }}>
                      <div style={{ fontSize: '6.8pt', fontWeight: 700, color: '#64748b' }}>TOTAL BUTIR DIKONTROL</div>
                      <div style={{ fontSize: '12pt', fontWeight: 900, color: '#000000' }}>{totalChecked}</div>
                      <div style={{ fontSize: '6pt', color: '#64748b' }}>Termasuk Klausul A - E</div>
                    </div>
                    <div style={{ border: '1px solid #000000', padding: '5px 8px', textAlign: 'center', background: '#f0fdf4' }}>
                      <div style={{ fontSize: '6.8pt', fontWeight: 700, color: '#15803d' }}>TINGKAT KEPATUHAN</div>
                      <div style={{ fontSize: '12pt', fontWeight: 900, color: '#16a34a' }}>{complianceScore}%</div>
                      <div style={{ fontSize: '6pt', color: '#15803d' }}>{compliedItems} Butir Memenuhi Standar</div>
                    </div>
                    <div style={{ border: '1px solid #000000', padding: '5px 8px', textAlign: 'center', background: '#f8fafc' }}>
                      <div style={{ fontSize: '6.8pt', fontWeight: 700, color: '#64748b' }}>TOTAL TEMUAN NC</div>
                      <div style={{ fontSize: '12pt', fontWeight: 900, color: '#d97706' }}>{sessionFindings.length}</div>
                      <div style={{ fontSize: '6pt', color: '#64748b' }}>Major: 0 | Minor: {sessionFindings.length}</div>
                    </div>
                    <div style={{ border: '1px solid #000000', padding: '5px 8px', textAlign: 'center', background: '#f0fdf4' }}>
                      <div style={{ fontSize: '6.8pt', fontWeight: 700, color: '#166534' }}>STATUS PENYELESAIAN NC</div>
                      <div style={{ fontSize: '12pt', fontWeight: 900, color: '#15803d' }}>100% CLOSED</div>
                      <div style={{ fontSize: '6pt', color: '#166534' }}>Seluruh Eviden Terverifikasi</div>
                    </div>
                  </div>
                </div>

                {/* BAGIAN III: TABEL TEMUAN & CAP */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '9pt', fontWeight: 800, color: '#000000', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-block', width: '4px', height: '12px', background: '#0284c7' }} />
                    BAGIAN III: DAFTAR TEMUAN KETIDAKSESUAIAN (NCR) & TINDAKAN KOREKTIF
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '7.5pt', border: '1px solid #000000' }}>
                    <thead>
                      <tr style={{ background: '#0f172a', color: '#ffffff' }}>
                        <th style={{ padding: '5px', border: '1px solid #000000', width: '13%' }}>No. Temuan</th>
                        <th style={{ padding: '5px', border: '1px solid #000000', width: '10%' }}>Klausul</th>
                        <th style={{ padding: '5px', border: '1px solid #000000', width: '32%' }}>Uraian Masalah & Bukti Objektif</th>
                        <th style={{ padding: '5px', border: '1px solid #000000', width: '27%' }}>Tindakan Koreksi & RCA</th>
                        <th style={{ padding: '5px', border: '1px solid #000000', width: '18%' }}>Verifikasi & Tgl Close</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessionFindings.map((f, idx) => (
                        <tr key={f.id} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                          <td style={{ padding: '5px', border: '1px solid #000000', verticalAlign: 'top' }}>
                            <strong style={{ color: '#0369a1' }}>{f.findingNo}</strong>
                            <div style={{ fontSize: '6.5pt', color: '#64748b' }}>{f.category}</div>
                          </td>
                          <td style={{ padding: '5px', border: '1px solid #000000', verticalAlign: 'top' }}>
                            <strong>{f.clauseCode}</strong>
                          </td>
                          <td style={{ padding: '5px', border: '1px solid #000000', verticalAlign: 'top', lineHeight: '1.3' }}>
                            <div>{f.description}</div>
                            {f.objectiveEvidence && (
                              <div style={{ color: '#475569', fontSize: '7pt', fontStyle: 'italic', marginTop: '2px' }}>
                                Eviden: {f.objectiveEvidence}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '5px', border: '1px solid #000000', verticalAlign: 'top', lineHeight: '1.3' }}>
                            <div><strong>Koreksi: </strong>{f.evidence?.correction || f.evidence?.correctiveAction || '-'}</div>
                            {f.evidence?.rootCause && (
                              <div style={{ marginTop: '2px', color: '#475569' }}>
                                <strong>RCA: </strong>{f.evidence.rootCause}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '5px', border: '1px solid #000000', verticalAlign: 'top', lineHeight: '1.25' }}>
                            <div style={{ color: '#15803d', fontWeight: 800 }}>✅ {f.status}</div>
                            <div style={{ fontSize: '6.8pt' }}>Close: {formatIndoDate(f.evidence?.closedDate || officialCloseDate)}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* BAGIAN IV: KESIMPULAN & REKOMENDASI */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '9pt', fontWeight: 800, color: '#000000', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-block', width: '4px', height: '12px', background: '#0284c7' }} />
                    BAGIAN IV: KESIMPULAN & REKOMENDASI AUDITOR
                  </div>

                  <div style={{ border: '1px solid #000000', padding: '6px 10px', background: '#f8fafc', fontSize: '7.8pt', lineHeight: '1.4' }}>
                    <p style={{ margin: '0 0 4px 0' }}>
                      {activeSession.auditConclusion}
                    </p>
                    <div style={{ fontWeight: 800, color: isExternal ? '#047857' : '#0369a1' }}>
                      REKOMENDASI: Sertifikat SMC Kapal {activeSession.targetName || currentVessel?.name} direkomendasikan tetap berlaku / disahkan oleh {isExternal ? appointedOrg : 'Manajemen Keselamatan Perusahaan'}.
                    </div>
                  </div>
                </div>

                {/* SIGNATURE BLOCK */}
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '7.8pt', marginTop: '16px', pageBreakInside: 'avoid' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '33.3%', padding: '6px', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: 700, color: '#475569', marginBottom: '2px' }}>DIVERIFIKASI OLEH:</div>
                        <div style={{ fontWeight: 800 }}>LEAD AUDITOR</div>
                        <div style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ border: '1px dashed #0284c7', padding: '3px 10px', color: '#0284c7', fontSize: '7pt' }}>
                            [ TTD AUDITOR ]
                          </span>
                        </div>
                        <div style={{ fontWeight: 800, textDecoration: 'underline' }}>{activeSession.leadAuditorSign || activeSession.leadAuditor}</div>
                        <div style={{ fontSize: '6.8pt', color: '#64748b' }}>{isExternal ? appointedOrg : 'Auditor Internal PBK'}</div>
                      </td>
                      <td style={{ width: '33.3%', padding: '6px', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: 700, color: '#475569', marginBottom: '2px' }}>DIKETAHUI:</div>
                        <div style={{ fontWeight: 800 }}>DESIGNATED PERSON ASHORE (DPA)</div>
                        <div style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ border: '1px dashed #10b981', padding: '3px 10px', color: '#047857', fontSize: '7pt' }}>
                            [ STEMPEL DPA ]
                          </span>
                        </div>
                        <div style={{ fontWeight: 800, textDecoration: 'underline' }}>DPA PT. PBK</div>
                        <div style={{ fontSize: '6.8pt', color: '#64748b' }}>PT. Pelayaran Baharimas Kalimantan</div>
                      </td>
                      <td style={{ width: '33.3%', padding: '6px', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: 700, color: '#475569', marginBottom: '2px' }}>DITERIMA OLEH:</div>
                        <div style={{ fontWeight: 800 }}>NAKHODA / AUDITEE</div>
                        <div style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ border: '1px dashed #0f172a', padding: '3px 10px', color: '#0f172a', fontSize: '7pt' }}>
                            [ TTD NAKHODA ]
                          </span>
                        </div>
                        <div style={{ fontWeight: 800, textDecoration: 'underline' }}>{activeSession.auditeeSign || activeSession.auditee}</div>
                        <div style={{ fontSize: '6.8pt', color: '#64748b' }}>Master TB. {activeSession.targetName || currentVessel?.name}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* ===================================================================== */}
            {/* MODE 2: LEMBAR NCR / OBSERVASI (PERSIS SCANNED PNG TB. RP 2004)        */}
            {/* ===================================================================== */}
            {reportMode === 'ncr' && activeFinding && (
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* 4-PART TABULAR FORM REPLICA OF THE SCANNED IMAGE */}
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '8pt',
                    border: '1.5px solid #000000',
                    marginBottom: '10px'
                  }}
                >
                  <tbody>
                    {/* ROW 1: Area Under Audit & Report ID */}
                    <tr>
                      <td style={{ width: '50%', padding: '5px 8px', border: '1px solid #000000', verticalAlign: 'top' }}>
                        <div style={{ fontSize: '7.5pt', color: '#1e293b' }}>
                          Area yang diaudit / <em>Area under audit</em>:
                        </div>
                        <div style={{ fontSize: '9pt', fontWeight: 800, marginTop: '2px', color: '#000000' }}>
                          {activeFinding.targetName || currentVessel?.name || 'Armada Kapal'}
                        </div>
                      </td>
                      <td style={{ width: '50%', padding: '5px 8px', border: '1px solid #000000', verticalAlign: 'top' }}>
                        <div style={{ fontSize: '7.5pt', color: '#1e293b' }}>
                          No. Laporan / <em>Report ID</em>:
                        </div>
                        <div style={{ fontSize: '9pt', fontWeight: 800, marginTop: '2px', color: '#000000' }}>
                          {activeFinding.reportId || activeSession.reportId || '0859-PK/ISM-SMC/2026'}
                        </div>
                      </td>
                    </tr>

                    {/* ROW 2: Non-Conformity No. & Element Number of Code */}
                    <tr>
                      <td style={{ width: '50%', padding: '5px 8px', border: '1px solid #000000', verticalAlign: 'top' }}>
                        <div style={{ fontSize: '7.5pt', color: '#1e293b' }}>
                          No. Ketidaksesuaian / <em>Non-Conformity No.</em>:
                        </div>
                        <div style={{ fontSize: '9.5pt', fontWeight: 900, marginTop: '2px', color: '#0369a1' }}>
                          {activeFinding.findingNo}
                        </div>
                      </td>
                      <td style={{ width: '50%', padding: '5px 8px', border: '1px solid #000000', verticalAlign: 'top' }}>
                        <div style={{ fontSize: '7.5pt', color: '#1e293b' }}>
                          Nomor Elemen dari ISM Code / <em>Element Number of Code</em>:
                        </div>
                        <div style={{ fontSize: '9.5pt', fontWeight: 900, marginTop: '2px', color: '#000000' }}>
                          {activeFinding.clauseCode || '5.1.5'}
                        </div>
                      </td>
                    </tr>

                    {/* ROW 3: Details of Deficiency */}
                    <tr>
                      <td colSpan={2} style={{ padding: '8px 10px', border: '1px solid #000000', verticalAlign: 'top' }}>
                        <div style={{ fontSize: '8pt', fontWeight: 700, color: '#000000', marginBottom: '4px' }}>
                          Rincian Ketidaksesuaian / <em>Details of deficiency</em>:
                        </div>
                        <div style={{ minHeight: '55px', lineHeight: '1.45', fontSize: '8.5pt', color: '#0f172a' }}>
                          {activeFinding.description}
                        </div>
                        {activeFinding.objectiveEvidence && (
                          <div style={{ fontSize: '7.5pt', color: '#475569', marginTop: '4px', fontStyle: 'italic' }}>
                            Bukti Objektif: {activeFinding.objectiveEvidence}
                          </div>
                        )}

                        {/* Grade checkboxes */}
                        <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px dashed #94a3b8', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '7.5pt', fontWeight: 700 }}>Tingkat Ketidaksesuaian / <em>Grade of Deficiency</em>:</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '7.5pt' }}>
                            {activeFinding.category === 'Major NC' ? <CheckSquare size={13} color="#dc2626" /> : <Square size={13} />}
                            <span>Ketidaksesuaian Mayor / <em>Major Non-Conformity</em> (MNC)</span>
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '7.5pt' }}>
                            {activeFinding.category === 'Minor NC' ? <CheckSquare size={13} color="#0284c7" /> : <Square size={13} />}
                            <span style={{ fontWeight: activeFinding.category === 'Minor NC' ? 800 : 400 }}>
                              Ketidaksesuaian / <em>Non-Conformity</em> (NC)
                            </span>
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '7.5pt' }}>
                            {activeFinding.category === 'Observation' ? <CheckSquare size={13} color="#059669" /> : <Square size={13} />}
                            <span>Observasi / <em>Observation</em> (OBS)</span>
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* ROW 4: Signatures after Deficiency Issued */}
                    <tr>
                      <td style={{ width: '50%', padding: '6px 8px', border: '1px solid #000000', verticalAlign: 'top' }}>
                        <div style={{ fontSize: '7.5pt', fontWeight: 700 }}>Auditor Kepala / <em>Lead Auditor</em>:</div>
                        <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ borderBottom: '1px solid #000000', padding: '2px 20px', fontStyle: 'italic', fontSize: '8pt' }}>
                            {activeFinding.auditor || activeSession.leadAuditor}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.2pt', color: '#334155' }}>
                          <span>Nama: <strong>{activeFinding.auditor || activeSession.leadAuditor}</strong></span>
                          <span>Tgl: <strong>{formatIndoDate(activeFinding.dateIdentified)}</strong></span>
                        </div>
                      </td>
                      <td style={{ width: '50%', padding: '6px 8px', border: '1px solid #000000', verticalAlign: 'top' }}>
                        <div style={{ fontSize: '7.5pt', fontWeight: 700 }}>
                          Nakhoda/Perwakilan Perusahaan / <em>Master/Company's Rep</em>:
                        </div>
                        <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ borderBottom: '1px solid #000000', padding: '2px 20px', fontStyle: 'italic', fontSize: '8pt' }}>
                            {activeFinding.assignedTo || 'Capt. Ekhsan'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.2pt', color: '#334155' }}>
                          <span>Nama: <strong>{activeFinding.assignedTo || 'Capt. Ekhsan'}</strong></span>
                          <span>Tgl: <strong>{formatIndoDate(activeFinding.dateIdentified)}</strong></span>
                        </div>
                      </td>
                    </tr>

                    {/* ROW 5: SECTION 2 - Correction & Root Cause Analysis */}
                    <tr>
                      <td colSpan={2} style={{ padding: '8px 10px', border: '1.5px solid #000000', verticalAlign: 'top', background: '#fafafa' }}>
                        <div style={{ fontSize: '8pt', fontWeight: 800, color: '#000000', textTransform: 'uppercase', marginBottom: '6px', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px' }}>
                          TINDAKAN OLEH PERUSAHAAN / KAPAL (<em>ACTION BY COMPANY / SHIP</em>)
                        </div>

                        {/* Perbaikan / Correction */}
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ fontSize: '7.8pt', fontWeight: 700, color: '#000000' }}>
                            Perbaikan / <em>Correction</em>:
                          </div>
                          <div style={{ fontSize: '8.2pt', lineHeight: '1.4', marginTop: '2px', color: '#0f172a' }}>
                            {activeFinding.evidence?.correction ||
                              activeFinding.evidence?.correctiveAction ||
                              'Nakhoda telah melengkapi instruksi pengoperasian kapal dalam cuaca buruk pada formulir No. Dok. SMS/PBK-SOP/NAV-09 dan disosialisasikan kepada seluruh perwira jaga deck.'}
                          </div>
                        </div>

                        {/* Analisa Penyebab Masalah / Root cause analysis */}
                        <div>
                          <div style={{ fontSize: '7.8pt', fontWeight: 700, color: '#000000' }}>
                            Analisa Penyebab Masalah / <em>Root cause analysis</em>:
                          </div>
                          <div style={{ fontSize: '8.2pt', lineHeight: '1.4', marginTop: '2px', color: '#0f172a' }}>
                            {activeFinding.evidence?.rootCause ||
                              'Kurangnya pemahaman dan ketelitian Nakhoda dalam pengarsipan salinan instruksi navigasi cuaca buruk saat proses serah terima jabatan (handover) nakhoda sebelumnya.'}
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* ROW 6: SECTION 3 - Corrective Action & Agreed Date */}
                    <tr>
                      <td colSpan={2} style={{ padding: '8px 10px', border: '1.5px solid #000000', verticalAlign: 'top' }}>
                        <div style={{ fontSize: '7.8pt', fontWeight: 700, color: '#000000' }}>
                          Tindakan Korektif / <em>Corrective Action</em>:
                        </div>
                        <div style={{ fontSize: '8.2pt', lineHeight: '1.4', marginTop: '2px', color: '#0f172a' }}>
                          {activeFinding.evidence?.correctiveAction ||
                            'Memastikan seluruh SOP dan instruksi kerja navigasi cuaca buruk telah terpasang di anjungan, dilakukan briefing rutin bulanan sebelum pelayaran, serta verifikasi oleh DPA saat inspeksi triwulan.'}
                        </div>

                        {activeFinding.evidence?.preventiveAction && (
                          <div style={{ fontSize: '7.8pt', color: '#334155', marginTop: '4px' }}>
                            <strong>Tindakan Pencegahan: </strong>{activeFinding.evidence.preventiveAction}
                          </div>
                        )}

                        <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '7.5pt', fontWeight: 700 }}>
                              Tanggal penyelesaian yang disetujui / <em>Agreed date of completion</em>:
                            </span>
                            <span style={{ fontSize: '8.5pt', fontWeight: 800, marginLeft: '6px', color: '#0369a1' }}>
                              {formatIndoDate(activeFinding.evidence?.agreedDate || activeFinding.dueDate)}
                            </span>
                            <span style={{ fontSize: '7pt', color: '#64748b', marginLeft: '6px' }}>
                              (Maksimal 3 Bulan sejak tanggal audit)
                            </span>
                          </div>

                          {activeFinding.evidence?.fileName && (
                            <div style={{ fontSize: '7.2pt', color: '#047857', fontWeight: 700 }}>
                              📎 Dokumen Eviden: {activeFinding.evidence.fileName}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* ROW 7: Signatures after CAP agreed */}
                    <tr>
                      <td style={{ width: '50%', padding: '6px 8px', border: '1px solid #000000', verticalAlign: 'top' }}>
                        <div style={{ fontSize: '7.5pt', fontWeight: 700 }}>Auditor Kepala / <em>Lead Auditor</em>:</div>
                        <div style={{ height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ borderBottom: '1px solid #000000', padding: '2px 20px', fontStyle: 'italic', fontSize: '8pt' }}>
                            {activeFinding.auditor || activeSession.leadAuditor}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.2pt', color: '#334155' }}>
                          <span>Nama: <strong>{activeFinding.auditor || activeSession.leadAuditor}</strong></span>
                          <span>Tgl: <strong>{formatIndoDate(activeFinding.dateIdentified)}</strong></span>
                        </div>
                      </td>
                      <td style={{ width: '50%', padding: '6px 8px', border: '1px solid #000000', verticalAlign: 'top' }}>
                        <div style={{ fontSize: '7.5pt', fontWeight: 700 }}>
                          Nakhoda/Perwakilan Perusahaan / <em>Master/Company's Rep</em>:
                        </div>
                        <div style={{ height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ borderBottom: '1px solid #000000', padding: '2px 20px', fontStyle: 'italic', fontSize: '8pt' }}>
                            {activeFinding.assignedTo || 'Capt. Ekhsan'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.2pt', color: '#334155' }}>
                          <span>Nama: <strong>{activeFinding.assignedTo || 'Capt. Ekhsan'}</strong></span>
                          <span>Tgl: <strong>{formatIndoDate(activeFinding.dateIdentified)}</strong></span>
                        </div>
                      </td>
                    </tr>

                    {/* ROW 8: SECTION 4 - Auditor Verification of Corrective Action */}
                    <tr>
                      <td colSpan={2} style={{ padding: '8px 10px', border: '1.5px solid #000000', verticalAlign: 'top', background: '#f0fdf4' }}>
                        <div style={{ fontSize: '8pt', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '6px', borderBottom: '1px solid #bbf7d0', paddingBottom: '3px' }}>
                          VERIFIKASI TINDAKAN PERBAIKAN OLEH AUDITOR (<em>AUDITOR VERIFICATION OF CORRECTIVE ACTION</em>)
                        </div>

                        <div style={{ fontSize: '8.2pt', lineHeight: '1.45', color: '#0f172a', marginBottom: '8px' }}>
                          {activeFinding.evidence?.auditorReviewNotes ||
                            'Telah dilakukan verifikasi bukti dokumen SOP Navigasi Cuaca Buruk yang telah disosialisasikan, daftar hadir sosialisasi kru deck, serta foto penempelan instruksi di anjungan kapal TB. RP 2004. Tindakan perbaikan dinilai efektif memenuhi klausul ISM Code 5.1.5.'}
                        </div>

                        {/* Verification Checkboxes */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '6px', borderTop: '1px dashed #86efac' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '7.5pt' }}>
                            {activeFinding.evidence?.verifiedUpgradeDowngrade ? <CheckSquare size={13} /> : <Square size={13} />}
                            <span>Diturunkan / Dinaikkan tingkatnya (<em>Upgrade / Downgrade</em>): [ ] MNC [ ] NC</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '7.5pt' }}>
                            <span style={{ fontWeight: 800 }}>Memuaskan / <em>Satisfactory</em>:</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 800, color: '#15803d' }}>
                              {activeFinding.evidence?.verifiedSatisfactory !== false ? <CheckSquare size={14} color="#15803d" /> : <Square size={13} />}
                              <span>Ya / <em>Yes</em></span>
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#64748b' }}>
                              {activeFinding.evidence?.verifiedSatisfactory === false ? <CheckSquare size={14} color="#dc2626" /> : <Square size={13} />}
                              <span>Tidak / <em>No</em></span>
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* ROW 9: Lead Auditor Closeout Sign */}
                    <tr>
                      <td colSpan={2} style={{ padding: '6px 10px', border: '1px solid #000000', verticalAlign: 'top', background: '#ffffff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '7.5pt', fontWeight: 700 }}>Auditor Kepala / <em>Lead Auditor</em>:</div>
                            <div style={{ fontSize: '8.5pt', fontWeight: 900, color: '#000000', marginTop: '2px' }}>
                              {activeFinding.evidence?.verifiedAuditor || activeFinding.auditor || activeSession.leadAuditor}
                            </div>
                            <div style={{ fontSize: '6.8pt', color: '#64748b' }}>
                              {isExternal ? appointedOrg : 'Auditor ISM PT. Pelayaran Baharimas Kalimantan'}
                            </div>
                          </div>

                          <div style={{ textAlign: 'center' }}>
                            <div style={{ border: '1.5px solid #15803d', borderRadius: '4px', padding: '2px 10px', color: '#15803d', fontWeight: 800, fontSize: '7.2pt' }}>
                              STATUS: NC CLOSED
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '7.5pt', color: '#334155' }}>Tanggal Verifikasi / <em>Verification Date</em>:</div>
                            <div style={{ fontSize: '8.5pt', fontWeight: 900, color: '#15803d', marginTop: '2px' }}>
                              {formatIndoDate(activeFinding.evidence?.closedDate || officialCloseDate)}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* ===================================================================== */}
            {/* MODE 3: SMS SHIPBOARD CHECKLIST                                       */}
            {/* ===================================================================== */}
            {reportMode === 'checklist' && (
              (isBKI || activeSession.auditType === 'Internal' || checklistConfig.organizationId === 'internal') ? (
                activeSession.standard === 'DOC' ? (
                  <BkiDocChecklistReport
                    session={activeSession}
                    vessel={currentVessel}
                    liveChecklist={liveChecklist}
                    findings={sessionFindings}
                  />
                ) : (
                  <BkiShipboardChecklistReport
                    session={activeSession}
                    vessel={currentVessel}
                    liveChecklist={liveChecklist}
                    findings={sessionFindings}
                  />
                )
              ) : (
                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Notice Lembaga Non-BKI */}
                  <div style={{
                    padding: '6px 10px',
                    background: '#f0fdf4',
                    border: '1px solid #16a34a',
                    borderRadius: '4px',
                    marginBottom: '10px',
                    fontSize: '7.5pt',
                    color: '#166534',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <ShieldCheck size={16} color="#16a34a" />
                    <span>
                      <strong>Format Checklist {institutionBranding.shortName}:</strong> Pemeriksaan kelaiklautan dan keselamatan disesuaikan dengan standar regulasi {institutionBranding.authorityTag}.
                    </span>
                  </div>

                  {/* Tabel checklist Non-BKI */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '7.5pt', border: '1.5px solid #000000', marginBottom: '12px' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9' }}>
                        <th style={{ padding: '5px 4px', border: '1px solid #000000', width: '7%', textAlign: 'center', fontWeight: 800 }}>No.</th>
                        <th style={{ padding: '5px 8px', border: '1px solid #000000', width: '45%', textAlign: 'center', fontWeight: 800 }}>Butir Pemeriksaan / Clauses</th>
                        <th style={{ padding: '5px 4px', border: '1px solid #000000', width: '6%', textAlign: 'center', fontWeight: 800 }}>Yes</th>
                        <th style={{ padding: '5px 4px', border: '1px solid #000000', width: '6%', textAlign: 'center', fontWeight: 800 }}>No</th>
                        <th style={{ padding: '5px 4px', border: '1px solid #000000', width: '6%', textAlign: 'center', fontWeight: 800 }}>N/A</th>
                        <th style={{ padding: '5px 6px', border: '1px solid #000000', width: '22%', textAlign: 'center', fontWeight: 800 }}>Catatan / Remark</th>
                        <th style={{ padding: '5px 4px', border: '1px solid #000000', width: '8%', textAlign: 'center', fontWeight: 800 }}>Ref. ISM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportChecklistItems.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ padding: '25px 15px', border: '1px solid #000000', textAlign: 'center', color: '#64748b' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>📋</div>
                            <div style={{ fontWeight: 800, fontSize: '8.5pt', marginBottom: '4px' }}>
                              Belum Ada Butir Checklist Tersusun
                            </div>
                            <div style={{ fontSize: '7.5pt' }}>
                              Lembaga <strong>{institutionBranding.name}</strong> tidak menggunakan template statis BKI. Butir pemeriksaan disusun melalui menu &quot;+ Tambah Item Manual&quot; pada form sesi audit.
                            </div>
                          </td>
                        </tr>
                      ) : (
                        reportChecklistItems.map((chk, idx) => {
                          const isStriked = Boolean(chk.isStrikethrough);
                          const resultVal = chk.result || chk.defaultResult || '';
                          const isYes = !isStriked && (resultVal === 'Yes' || resultVal === 'Complied');
                          const isNo = !isStriked && ['No', 'Major NC', 'Minor NC', 'Observation'].includes(resultVal);
                          const isNA = isStriked || resultVal === 'N/A';

                          return (
                            <tr key={chk.id || idx} style={{ background: isStriked ? '#fffbeb' : idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                              <td style={{ padding: '4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 700 }}>
                                {chk.code || chk.no || idx + 1}
                              </td>
                              <td style={{ padding: '4px 6px', border: '1px solid #000000', verticalAlign: 'top', lineHeight: 1.4 }}>
                                <div style={{ fontWeight: 700 }}>{chk.name || chk.item}</div>
                                {chk.checkPoint && chk.checkPoint !== chk.name && (
                                  <div style={{ fontSize: '6.8pt', color: '#475569', marginTop: '2px' }}>{chk.checkPoint}</div>
                                )}
                              </td>
                              <td style={{ padding: '2px', border: '1px solid #000000', textAlign: 'center', verticalAlign: 'middle', fontSize: '11pt', fontWeight: 900 }}>
                                {isYes ? '☒' : '☐'}
                              </td>
                              <td style={{ padding: '2px', border: '1px solid #000000', textAlign: 'center', verticalAlign: 'middle', fontSize: '11pt', fontWeight: 900, color: isNo ? '#dc2626' : undefined }}>
                                {isNo ? '☒' : '☐'}
                              </td>
                              <td style={{ padding: '2px', border: '1px solid #000000', textAlign: 'center', verticalAlign: 'middle', fontSize: '11pt', fontWeight: 900, color: isNA ? '#64748b' : undefined }}>
                                {isNA ? '☒' : '☐'}
                              </td>
                              <td style={{ padding: '4px 6px', border: '1px solid #000000', verticalAlign: 'top', fontSize: '7pt' }}>
                                {chk.notes || chk.remark || '—'}
                              </td>
                              <td style={{ padding: '4px', border: '1px solid #000000', textAlign: 'center', verticalAlign: 'middle', fontWeight: 700 }}>
                                {chk.ismCode || '—'}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>

                  {/* Signatures Non-BKI */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '7.5pt', marginTop: '12px', pageBreakInside: 'avoid' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '50%', padding: '6px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: '#475569', marginBottom: '2px' }}>AUDITOR PELAKSANA:</div>
                          <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ borderBottom: '1px solid #000000', padding: '2px 25px', fontStyle: 'italic', fontWeight: 800 }}>
                              {activeSession.leadAuditorSign || activeSession.leadAuditor}
                            </span>
                          </div>
                          <div style={{ fontWeight: 800 }}>{activeSession.leadAuditorSign || activeSession.leadAuditor}</div>
                          <div style={{ fontSize: '6.8pt', color: '#64748b' }}>{institutionBranding.authorityTag}</div>
                        </td>
                        <td style={{ width: '50%', padding: '6px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: '#475569', marginBottom: '2px' }}>NAKHODA / AUDITEE:</div>
                          <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ borderBottom: '1px solid #000000', padding: '2px 25px', fontStyle: 'italic', fontWeight: 800 }}>
                              {activeSession.auditeeSign || 'Capt. Ekhsan'}
                            </span>
                          </div>
                          <div style={{ fontWeight: 800 }}>{activeSession.auditeeSign || 'CAPT. EKHSAN'}</div>
                          <div style={{ fontSize: '6.8pt', color: '#64748b' }}>Master {activeSession.targetName || currentVessel?.name}</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )
            )}

            {/* ===================================================================== */}
            {/* DOCUMENT FOOTER NOTES                                                 */}
            {/* ===================================================================== */}
            {!(reportMode === 'checklist' && isBKI) && (
              <div
                className="audit-footer-note"
                style={{
                  marginTop: '16px',
                  paddingTop: '6px',
                  borderTop: '1px solid #cbd5e1',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '6.2pt',
                  color: '#64748b'
                }}
              >
                <div>
                  Dokumen Resmi {institutionBranding.name} • Dicetak melalui Sistem PMS Cloud Maritim Baharimas
                </div>
                <div>
                  Distribusi: {isExternal
                    ? `1. Asli: ${institutionBranding.shortName} | 2. Copy 1: DPA PT. PBK | 3. Copy 2: Onboard ${activeSession.targetName || currentVessel?.name}`
                    : `1. Asli: Arsip DPA Darat | 2. Copy 1: Onboard ${activeSession.targetName || currentVessel?.name} | 3. Copy 2: Arsip QHSE PBK`}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODAL FOOTER ACTIONS (SCREEN ONLY)                                       */}
        {/* ========================================================================= */}
        <div
          className="modal-footer no-print"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem 1.25rem',
            background: 'var(--bg-surface-elevated)',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            💡 <em>Pilih opsi "Save as PDF" di menu cetak browser untuk menyimpan file PDF standar A4.</em>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-sm"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 800 }}
            >
              <Printer size={15} />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};
