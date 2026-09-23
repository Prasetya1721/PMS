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
import { getChecklistConfigForSession, EXTERNAL_AUDIT_ORGANIZATIONS } from '../../data/auditMasterData';

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
  // HANYA BKI yang memiliki template resmi — lembaga lain menghasilkan items=[]
  const checklistConfig = getChecklistConfigForSession(activeSession.externalOrganization || activeSession.standard);
  const isBKISession = checklistConfig.organizationId === 'bki';

  // Prioritas data checklist:
  // 1. liveChecklist (real-time dari AuditSessionModal — jika bukan BKI dan SMC, buang template BKI)
  // 2. activeSession.checklist (tersimpan di object sesi — jika bukan BKI dan SMC, buang template BKI)
  // 3. Template statis dari checklistConfig (hanya terisi jika BKI, kosong [] untuk lembaga lain)
  const resolveSessionChecklist = () => {
    if (Array.isArray(liveChecklist)) {
      if (activeSession.standard === 'SMC' && !isBKISession) {
        return liveChecklist.filter(item => item.isManual);
      }
      return liveChecklist;
    }
    if (Array.isArray(activeSession.checklist) && activeSession.checklist.length > 0) {
      if (activeSession.standard === 'SMC' && !isBKISession) {
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
    (vessels || []).find(v => v.name?.toLowerCase().includes('rp 2004')) ||
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

  // Dynamic Institution Branding: Internal PBK vs Appointed External Organization
  const rawAppointedOrg = activeSession.externalOrganization || activeFinding?.externalOrganization;
  const appointedOrg = typeof rawAppointedOrg === 'object' && rawAppointedOrg !== null
    ? (rawAppointedOrg.name || rawAppointedOrg.shortName || 'Badan Klasifikasi Terakreditasi')
    : (rawAppointedOrg || 'Badan Klasifikasi Terakreditasi');
  const isExternal = activeSession.auditType === 'External' || activeFinding?.auditType === 'External';

  // Institution details for Kop Surat
  const institutionDetails = isExternal
    ? {
        name: appointedOrg.toUpperCase(),
        tagline: 'AUTHORIZED RECOGNIZED ORGANIZATION (RO) / MARITIME STATUTORY AUDIT',
        address: 'Kantor Operasional / Wilayah Pelabuhan Pontianak & Wilayah Barat Indonesia',
        contact: 'Pemeriksaan Statutori Sertifikasi SMC / DOC ISM Code (IMO Res. A.741(18))',
        logoText: appointedOrg.length <= 6 ? appointedOrg : 'RO-AUDIT',
        formDoc: activeSession.reportId || activeFinding?.reportId || '0859-PK/ISM-SMC/2026',
        revNo: 'Rev 05 / 2026',
        authorityTag: appointedOrg
      }
    : {
        name: 'PT. PELAYARAN BAHARIMAS KALIMANTAN',
        tagline: 'SAFETY MANAGEMENT SYSTEM (SMS) • DPA & QHSE DEPARTMENT',
        address: 'Komp. Pontianak Mall Blok D No. 8-9, Jl. Tanjungpura, Kota Pontianak 78122, Kalimantan Barat',
        contact: 'Telp: (0561) 734567 • Email: dpa.baharimas@gmail.com / ism.safety@baharimas.co.id',
        logoText: 'PBK',
        formDoc: reportMode === 'checklist' ? '00954PK26_F23_14_06-2024 Rev05' : reportMode === 'session' ? 'PBK-SMM/FORM-AUD/08' : 'PBK-SMM/FORM-NCR/02',
        revNo: 'Rev 05 / 2026',
        authorityTag: 'Internal Pelayaran Baharimas Kalimantan'
      };

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
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.74rem',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: reportMode === 'session' ? 700 : 500
                }}
              >
                1. Sesi Audit
              </button>
              <button
                type="button"
                onClick={() => setReportMode('ncr')}
                className={`tab-btn ${reportMode === 'ncr' ? 'active' : ''}`}
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.74rem',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: reportMode === 'ncr' ? 700 : 500
                }}
              >
                2. Lembar NC / Observasi (Scanned Form)
              </button>
              <button
                type="button"
                onClick={() => setReportMode('checklist')}
                className={`tab-btn ${reportMode === 'checklist' ? 'active' : ''}`}
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.74rem',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: reportMode === 'checklist' ? 700 : 500
                }}
              >
                3. SMS Shipboard Checklist (PDF)
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
            className="audit-report-sheet maritime-print-sheet"
            style={{
              width: '100%',
              maxWidth: '860px',
              margin: '0 auto',
              background: '#ffffff',
              color: '#0f172a',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
              padding: '2cm 1.8cm',
              boxSizing: 'border-box',
              fontFamily: "'Arial', 'Segoe UI', sans-serif",
              fontSize: '10pt',
              lineHeight: '1.4',
              position: 'relative'
            }}
          >
            {/* Watermark Stamp: VERIFIED CLOSED */}
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

            {/* ===================================================================== */}
            {/* 1. OFFICIAL KOP SURAT (SESUAI INTERNAL BAHARIMAS ATAU EKSTERNAL)      */}
            {/* ===================================================================== */}
            <div
              className="audit-report-kop"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '10px',
                borderBottom: '2.5px solid #000000',
                marginBottom: '14px',
                position: 'relative',
                zIndex: 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Logo Seal */}
                <div
                  style={{
                    width: '58px',
                    height: '58px',
                    borderRadius: isExternal ? '6px' : '50%',
                    background: isExternal ? '#047857' : '#0369a1',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #000000',
                    flexShrink: 0
                  }}
                >
                  {isExternal ? <ShieldCheck size={28} /> : <Ship size={28} />}
                  <span style={{ fontSize: '5.5pt', fontWeight: 900, letterSpacing: '0.5px', marginTop: '1px' }}>
                    {institutionDetails.logoText}
                  </span>
                </div>

                <div>
                  <h1
                    style={{
                      fontSize: '13pt',
                      fontWeight: 900,
                      margin: 0,
                      color: '#000000',
                      letterSpacing: '0.3px',
                      textTransform: 'uppercase'
                    }}
                  >
                    {institutionDetails.name}
                  </h1>
                  <p style={{ fontSize: '8pt', fontWeight: 700, margin: '2px 0', color: isExternal ? '#047857' : '#0369a1' }}>
                    {institutionDetails.tagline}
                  </p>
                  <p style={{ fontSize: '7pt', margin: 0, color: '#334155', lineHeight: '1.25' }}>
                    {institutionDetails.address}<br />
                    {institutionDetails.contact}
                  </p>
                </div>
              </div>

              {/* Document Code & Reference */}
              <div style={{ textAlign: 'right', fontSize: '7.5pt', color: '#1e293b', borderLeft: '1px solid #cbd5e1', paddingLeft: '10px' }}>
                <div style={{ fontWeight: 800, color: '#000000', fontSize: '8pt' }}>FORMULIR RESMI AUDIT</div>
                <div>Doc No: {institutionDetails.formDoc}</div>
                <div>Revisi: {institutionDetails.revNo}</div>
                <div>Lembaga: <strong>{institutionDetails.authorityTag}</strong></div>
              </div>
            </div>

            {/* ===================================================================== */}
            {/* 2. DOCUMENT TITLE HEADER                                              */}
            {/* ===================================================================== */}
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
                  ? `LAPORAN HASIL AUDIT SISTEM MANAJEMEN KESELAMATAN (${activeSession.standard})`
                  : reportMode === 'checklist'
                  ? 'SMS SHIPBOARD CHECKLIST'
                  : 'LAPORAN KETIDAKSESUAIAN / OBSERVASI'}
              </h2>
              <div
                style={{
                  fontSize: '8.5pt',
                  fontWeight: 700,
                  margin: '2px 0 0',
                  color: isExternal ? '#047857' : '#0369a1',
                  fontStyle: reportMode === 'ncr' ? 'italic' : 'normal'
                }}
              >
                {reportMode === 'session'
                  ? 'STANDAR ISM CODE — IMO RESOLUTION A.741(18) SEBAGAIMANA TELAH DIUBAH'
                  : reportMode === 'checklist'
                  ? (isBKISession
                      ? '00954PK26_F23_14_06-2024 Rev05 • KEPATUHAN KAPAL DI LAUT (TERMASUK KLAUSUL A - E)'
                      : `DAFTAR BUTIR PEMERIKSAAN AUDIT • ${checklistConfig.organizationName.toUpperCase()}`)
                  : '(NON-CONFORMITY / OBSERVATION REPORT)'}
              </div>
              <div style={{ display: 'inline-block', borderBottom: '2px solid #000000', width: '90px', margin: '3px auto 0' }} />
            </div>

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
                            ? `Reg: ${currentVessel?.regNo || currentVessel?.imo || '1672810'} | Call Sign: ${currentVessel?.callSign || 'YD 4180'} | GT: ${currentVessel?.gt || 174}`
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
                          {activeFinding.targetName || currentVessel?.name || 'TB. RP 2004'}
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
            {/* MODE 3: SMS SHIPBOARD CHECKLIST (PERSIS FORMAT PDF 10 HALAMAN)        */}
            {/* ===================================================================== */}
            {reportMode === 'checklist' && (
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* DATA PARTICULARS KAPAL (PERSIS HALAMAN 1 PDF) */}
                <div style={{ marginBottom: '10px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '7.5pt', border: '1.5px solid #000000' }}>
                    <tbody>
                      <tr style={{ background: '#f8fafc' }}>
                        <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700, width: '22%' }}>Nama Kapal / <em>Vessel's Name</em></td>
                        <td style={{ padding: '4px 6px', border: '1px solid #000000', width: '28%', fontWeight: 900, color: '#0369a1' }}>
                          {activeSession.targetName || currentVessel?.name || 'TB. RP 2004'}
                        </td>
                        <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700, width: '22%' }}>Tanda Panggilan / <em>Call Sign</em></td>
                        <td style={{ padding: '4px 6px', border: '1px solid #000000', width: '28%', fontWeight: 800 }}>
                          {currentVessel?.callSign || 'YD 4180'}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>Nomor IMO / <em>IMO or Reg No.</em></td>
                        <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 800 }}>
                          {currentVessel?.imo || currentVessel?.regNo || '1672810'}
                        </td>
                        <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>Tonase Kotor / <em>Gross Tonnage (GT)</em></td>
                        <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 800 }}>
                          {currentVessel?.gt || '174'}
                        </td>
                      </tr>
                      <tr style={{ background: '#f8fafc' }}>
                        <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>Jenis Kapal / <em>Type of Ship</em></td>
                        <td style={{ padding: '4px 6px', border: '1px solid #000000' }}>
                          {currentVessel?.type || 'Tug Boat'} (Towing Oil Barge)
                        </td>
                        <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>Pelabuhan Pendaftaran / <em>Port of Registry</em></td>
                        <td style={{ padding: '4px 6px', border: '1px solid #000000' }}>
                          {currentVessel?.portOfRegistry || 'PONTIANAK'}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>Nakhoda / <em>Master</em></td>
                        <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>
                          {currentVessel?.masterCaptain || activeSession.auditee || 'CAPT. EKHSAN'}
                        </td>
                        <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>Tanggal Audit / <em>Audit Date</em></td>
                        <td style={{ padding: '4px 6px', border: '1px solid #000000' }}>
                          {formatIndoDate(activeSession.auditDate)}
                        </td>
                      </tr>
                      <tr style={{ background: '#f8fafc' }}>
                        <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>Tempat Audit / <em>Place of Audit</em></td>
                        <td style={{ padding: '4px 6px', border: '1px solid #000000' }}>
                          {activeSession.auditLocation || 'Dermaga Pontianak, Kalimantan Barat'}
                        </td>
                        <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700 }}>Lembaga Auditor</td>
                        <td style={{ padding: '4px 6px', border: '1px solid #000000', fontWeight: 700, color: isExternal ? '#047857' : '#0369a1' }}>
                          {isExternal ? appointedOrg : 'PT. Pelayaran Baharimas Kalimantan (Internal)'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* NOTICE TENTANG KLAUSUL YANG DICORET */}
                {(() => {
                  const dynamicStruck = reportChecklistItems.filter(c => Boolean(c.isStrikethrough)).length;
                  const dynamicCore = reportChecklistItems.length - dynamicStruck;
                  const hasStruck = dynamicStruck > 0;
                  const isChecked = isBKISession;
                  return (
                    <div style={{
                      padding: '5px 8px',
                      background: hasStruck ? '#fef3c7' : isChecked ? '#dcfce7' : '#e0f2fe',
                      border: `1px solid ${hasStruck ? '#f59e0b' : isChecked ? '#16a34a' : '#0284c7'}`,
                      borderRadius: '4px',
                      marginBottom: '8px',
                      fontSize: '7pt',
                      color: hasStruck ? '#92400e' : isChecked ? '#166534' : '#075985',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <AlertTriangle size={13} color={hasStruck ? '#b45309' : isChecked ? '#15803d' : '#0369a1'} />
                      <span>
                        {isChecked ? (
                          <>
                            <strong>Catatan Pemenuhan Format PDF:</strong> Seluruh item checklist pada PDF {checklistConfig.docNumber || 'F23.14.06-2024 Rev 05'} diikutsertakan secara lengkap, termasuk bagian tambahan yang dicoret pada halaman 8-10, diberi tanda penanda coret dan status N/A. <em>({dynamicCore} butir aktif + {dynamicStruck} butir dicoret)</em>
                          </>
                        ) : (
                          <>
                            <strong>Checklist Lembaga {checklistConfig.organizationName}:</strong> {checklistConfig.note || 'Belum ada template checklist untuk lembaga ini karena format tiap lembaga berbeda.'}
                          </>
                        )}
                      </span>
                    </div>
                  );
                })()}


                {/* TABEL CHECKLIST FORMAT BKI — PERSIS PDF F23.14.06-2024 Rev 05 */}
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '7pt', border: '1.5px solid #000000', marginBottom: '10px' }}>
                  <thead>
                    {/* Header Row 1: Kolom utama */}
                    <tr style={{ background: '#f0f0f0' }}>
                      <th rowSpan={2} style={{ padding: '4px 3px', border: '1px solid #000000', width: '6%', textAlign: 'center', verticalAlign: 'middle', fontWeight: 800, fontSize: '7pt' }}>No.</th>
                      <th rowSpan={2} style={{ padding: '4px 6px', border: '1px solid #000000', width: '40%', textAlign: 'center', verticalAlign: 'middle', fontWeight: 800, fontSize: '7pt' }}>Items to be checked</th>
                      <th colSpan={3} style={{ padding: '3px 2px', border: '1px solid #000000', width: '15%', textAlign: 'center', fontWeight: 800, fontSize: '7pt' }}>Result</th>
                      <th rowSpan={2} style={{ padding: '4px 5px', border: '1px solid #000000', width: '27%', textAlign: 'center', verticalAlign: 'middle', fontWeight: 800, fontSize: '7pt' }}>
                        Remark<br />
                        <span style={{ fontWeight: 400, fontSize: '6pt', fontStyle: 'italic' }}>(details are to be specified in the field if the result is NO)</span>
                      </th>
                      <th rowSpan={2} style={{ padding: '4px 3px', border: '1px solid #000000', width: '12%', textAlign: 'center', verticalAlign: 'middle', fontWeight: 800, fontSize: '7pt' }}>ISM Code</th>
                    </tr>
                    {/* Header Row 2: Sub-kolom Yes / No / N/A */}
                    <tr style={{ background: '#f0f0f0' }}>
                      <th style={{ padding: '3px 2px', border: '1px solid #000000', width: '5%', textAlign: 'center', fontWeight: 700, fontSize: '6.5pt' }}>Yes</th>
                      <th style={{ padding: '3px 2px', border: '1px solid #000000', width: '5%', textAlign: 'center', fontWeight: 700, fontSize: '6.5pt' }}>No</th>
                      <th style={{ padding: '3px 2px', border: '1px solid #000000', width: '5%', textAlign: 'center', fontWeight: 700, fontSize: '6.5pt' }}>N/A</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Notice row — sesuai teks pada PDF BKI */}
                    <tr>
                      <td colSpan={7} style={{ padding: '3px 6px', border: '1px solid #000000', fontSize: '6.5pt', color: '#374151', fontStyle: 'italic', background: '#fffbeb' }}>
                        Notice: The parts of checklist which are not used during audit should be deleted by lines appropriate according to the audit scope.
                      </td>
                    </tr>

                    {reportChecklistItems.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ padding: '10px', border: '1px solid #000000', textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
                          Belum ada butir checklist untuk lembaga <strong>{checklistConfig.organizationName}</strong>. Format checklist antar lembaga berbeda, sehingga butir pemeriksaan perlu disusun terlebih dahulu pada modul Audit.
                        </td>
                      </tr>
                    )}

                    {(() => {
                      let lastSection = null;
                      let lastSubsection = null;
                      const rows = [];

                      reportChecklistItems.forEach((chk, idx) => {
                        const isStriked = Boolean(chk.isStrikethrough);
                        const section = chk.section || '';
                        const subsection = chk.subsection || '';
                        const no = chk.no || String(idx + 1);
                        const resultVal = chk.result || chk.defaultResult || 'Yes';
                        const isYes = !isStriked && (resultVal === 'Yes' || resultVal === 'Complied');
                        const isNo = !isStriked && ['No', 'Major NC', 'Minor NC', 'Observation'].includes(resultVal);
                        const isNA = isStriked || resultVal === 'N/A';
                        const relatedFinding = sessionFindings.find(f =>
                          f.clauseCode === chk.code || f.clauseCode === no
                        );
                        const isNC = Boolean(relatedFinding);

                        // ── SECTION HEADER (dark navy, mis. "1  SHIPBOARD TOUR & GENERAL REQUIREMENT") ──
                        if (section && section !== lastSection) {
                          lastSection = section;
                          lastSubsection = null;
                          const secMatch = section.match(/^([\d.]+\.?)\s*(.*)/);
                          rows.push(
                            <tr key={`sec-${idx}`} style={{ background: '#1e293b' }}>
                              <td style={{ padding: '4px 5px', border: '1px solid #374151', fontWeight: 900, color: '#ffffff', textAlign: 'center', fontSize: '7.5pt', verticalAlign: 'middle' }}>
                                {secMatch ? secMatch[1] : ''}
                              </td>
                              <td colSpan={6} style={{ padding: '4px 8px', border: '1px solid #374151', fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '7.5pt' }}>
                                {secMatch ? secMatch[2] : section}
                              </td>
                            </tr>
                          );
                        }

                        // ── SUBSECTION HEADER (light blue, mis. "1.1  Bridge") ──
                        if (subsection && subsection !== lastSubsection) {
                          lastSubsection = subsection;
                          const subMatch = subsection.match(/^([\d.]+)\s*(.*)/);
                          rows.push(
                            <tr key={`sub-${idx}`} style={{ background: '#dbeafe' }}>
                              <td style={{ padding: '3px 5px', border: '1px solid #000000', fontWeight: 800, color: '#1e3a8a', textAlign: 'center', fontSize: '7pt', verticalAlign: 'middle' }}>
                                {subMatch ? subMatch[1] : ''}
                              </td>
                              <td colSpan={6} style={{ padding: '3px 8px', border: '1px solid #000000', fontWeight: 800, color: '#1e3a8a', fontSize: '7pt' }}>
                                {subMatch ? subMatch[2] : subsection}
                              </td>
                            </tr>
                          );
                        }

                        // ── ITEM ROW ──
                        const rowBg = isStriked ? '#fffbeb' : isNC ? '#fff1f2' : idx % 2 === 0 ? '#ffffff' : '#f8fafc';
                        rows.push(
                          <tr key={chk.id || `r${idx}`} style={{ background: rowBg }}>
                            {/* No. */}
                            <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 600, verticalAlign: 'middle', color: isStriked ? '#94a3b8' : '#374151', fontSize: '7pt', whiteSpace: 'nowrap' }}>
                              <span style={{ textDecoration: isStriked ? 'line-through' : 'none' }}>{no}</span>
                            </td>

                            {/* Items to be checked */}
                            <td style={{ padding: '3px 6px', border: '1px solid #000000', verticalAlign: 'top', lineHeight: '1.45', color: isStriked ? '#94a3b8' : '#111827', fontSize: '7pt' }}>
                              <span style={{ textDecoration: isStriked ? 'line-through' : 'none' }}>
                                {chk.item || chk.checkPoint || chk.name || '—'}
                              </span>
                              {isNC && (
                                <div style={{ fontSize: '6pt', color: '#dc2626', fontWeight: 700, marginTop: '2px' }}>
                                  ★ NC — Ref. Formulir NCR No. {relatedFinding?.findingNo}
                                </div>
                              )}
                            </td>

                            {/* Yes */}
                            <td style={{ padding: '2px', border: '1px solid #000000', textAlign: 'center', verticalAlign: 'middle', width: '5%' }}>
                              {isYes && !isNC
                                ? <span style={{ fontSize: '12pt', color: '#15803d', lineHeight: 1 }}>⊠</span>
                                : <span style={{ fontSize: '12pt', color: '#94a3b8', lineHeight: 1 }}>□</span>}
                            </td>

                            {/* No */}
                            <td style={{ padding: '2px', border: '1px solid #000000', textAlign: 'center', verticalAlign: 'middle', width: '5%' }}>
                              {(isNo || isNC) && !isStriked
                                ? <span style={{ fontSize: '12pt', color: '#dc2626', lineHeight: 1 }}>⊠</span>
                                : <span style={{ fontSize: '12pt', color: '#94a3b8', lineHeight: 1 }}>□</span>}
                            </td>

                            {/* N/A */}
                            <td style={{ padding: '2px', border: '1px solid #000000', textAlign: 'center', verticalAlign: 'middle', width: '5%' }}>
                              {isNA
                                ? <span style={{ fontSize: '12pt', color: '#64748b', lineHeight: 1 }}>⊠</span>
                                : <span style={{ fontSize: '12pt', color: '#94a3b8', lineHeight: 1 }}>□</span>}
                            </td>

                            {/* Remark */}
                            <td style={{ padding: '3px 5px', border: '1px solid #000000', verticalAlign: 'top', fontSize: '6.5pt', color: isNC ? '#b91c1c' : '#374151', fontStyle: isStriked ? 'italic' : 'normal', lineHeight: '1.35' }}>
                              {isStriked
                                ? <span style={{ color: '#92400e' }}>Dicoret — tidak berlaku untuk tipe kapal ini</span>
                                : isNC
                                  ? <strong>Lihat Formulir NCR No. {relatedFinding?.findingNo}</strong>
                                  : (chk.remark || chk.notes || '')}
                            </td>

                            {/* ISM Code */}
                            <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 700, fontSize: '7pt', verticalAlign: 'middle', color: '#0369a1', whiteSpace: 'nowrap' }}>
                              {chk.ismCode || ''}
                            </td>
                          </tr>
                        );
                      });
                      return rows;
                    })()}
                  </tbody>
                </table>


                {/* SIGNATURES SECTION AT THE END OF CHECKLIST */}
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '7.5pt', marginTop: '10px', pageBreakInside: 'avoid' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '50%', padding: '6px', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: 700, color: '#475569', marginBottom: '2px' }}>AUDITOR KEPALA / <em>LEAD AUDITOR</em>:</div>
                        <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ borderBottom: '1px solid #000000', padding: '2px 25px', fontStyle: 'italic' }}>
                            {activeSession.leadAuditorSign || activeSession.leadAuditor}
                          </span>
                        </div>
                        <div style={{ fontWeight: 800 }}>{activeSession.leadAuditorSign || activeSession.leadAuditor}</div>
                        <div style={{ fontSize: '6.8pt', color: '#64748b' }}>{isExternal ? appointedOrg : 'Auditor ISM PBK'}</div>
                      </td>
                      <td style={{ width: '50%', padding: '6px', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: 700, color: '#475569', marginBottom: '2px' }}>NAKHODA KAPAL / <em>MASTER</em>:</div>
                        <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ borderBottom: '1px solid #000000', padding: '2px 25px', fontStyle: 'italic' }}>
                            {activeSession.auditeeSign || 'Capt. Ekhsan'}
                          </span>
                        </div>
                        <div style={{ fontWeight: 800 }}>{activeSession.auditeeSign || 'CAPT. EKHSAN'}</div>
                        <div style={{ fontSize: '6.8pt', color: '#64748b' }}>Master TB. {activeSession.targetName || currentVessel?.name}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* ===================================================================== */}
            {/* DOCUMENT FOOTER NOTES (DISTRIBUSI SESUAI INTERNAL ATAU EKSTERNAL)     */}
            {/* ===================================================================== */}
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
                Dokumen Resmi {institutionDetails.name} • Dicetak melalui Sistem PMS Cloud Maritim Baharimas
              </div>
              <div>
                Distribusi: {isExternal
                  ? `1. Asli: ${appointedOrg} | 2. Copy 1: DPA PT. PBK | 3. Copy 2: Onboard ${activeSession.targetName || currentVessel?.name}`
                  : `1. Asli: Arsip DPA Darat | 2. Copy 1: Onboard ${activeSession.targetName || currentVessel?.name} | 3. Copy 2: Arsip QHSE PBK`}
              </div>
            </div>
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
