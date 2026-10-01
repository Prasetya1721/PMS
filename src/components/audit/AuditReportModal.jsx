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
import { ReportNcrSelector } from './report/ReportNcrSelector';
import { ReportStatusStamp } from './report/ReportStatusStamp';
import { ReportDocHeader } from './report/ReportDocHeader';
import { ReportSessionSection } from './report/ReportSessionSection';
import { ReportNcrHeader } from './report/ReportNcrHeader';
import { ReportNcrDetail } from './report/ReportNcrDetail';
import { ReportChecklistSection } from './report/ReportChecklistSection';
import { ReportSignatureFooter } from './report/ReportSignatureFooter';

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
    document.body.classList.add('maritime-modal-printing-active');
    return () => {
      document.body.classList.remove('audit-report-printing-active');
      document.body.classList.remove('maritime-modal-printing-active');
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
    if (Array.isArray(liveChecklist) && liveChecklist.length > 0) {
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

  // Report view mode: 'session' | 'ncr' | 'checklist' | 'all'
  const [reportMode, setReportMode] = useState(
    initialMode === 'checklist' ? 'checklist' : (initialMode === 'ncr' && activeFinding) ? 'ncr' : initialMode === 'all' ? 'all' : 'session'
  );

  // Vessel particulars if target is a ship
  const currentVessel = (vessels || []).find(v => v.id === activeSession.vesselId) ||
    (vessels || []).find(v => v.id === activeFinding?.vesselId) ||
    (vessels || []).find(v => {
      const tgt = (activeFinding?.targetName || activeSession?.targetName || '').toLowerCase();
      return tgt && (v.name?.toLowerCase().includes(tgt) || tgt.includes(v.name?.toLowerCase()));
    }) ||
    (vessels && vessels[0]);

  // Handle print (dukung cetak dokumen tertentu secara mandiri atau cetak dokumen aktif)
  const handlePrint = (targetMode = null) => {
    if (targetMode && targetMode !== reportMode) {
      setReportMode(targetMode);
      setTimeout(() => {
        window.print();
      }, 150);
    } else {
      window.print();
    }
  };

  // Dynamic Institution Branding: Multi-Institution (BKI, KSOP, Ditjen Hubla, PBK, Custom)
  const institutionBranding = getInstitutionBranding(activeSession, activeFinding);
  const isBKI = institutionBranding.isBKI;
  const isExternal = activeSession.auditType === 'External' || activeFinding?.auditType === 'External';
  const appointedOrg = institutionBranding.shortName || 'Badan Klasifikasi Terakreditasi';
  const institutionDetails = institutionBranding;

  // Helper metadata dokumen aktif untuk cetak masing-masing
  const getActiveDocInfo = () => {
    if (reportMode === 'session') {
      return {
        num: '1',
        title: 'Sesi Audit',
        fullName: `Dokumen 1: Laporan Sesi Audit (${institutionBranding.shortName})`,
        shortName: '1. Sesi Audit'
      };
    }
    if (reportMode === 'ncr') {
      return {
        num: '2',
        title: 'Lembar NC',
        fullName: `Dokumen 2: Lembar NC / Observasi (${activeFinding?.findingNo || 'NCR'})`,
        shortName: '2. Lembar NC'
      };
    }
    if (reportMode === 'checklist') {
      return {
        num: '3',
        title: 'Checklist Resmi',
        fullName: isBKI
          ? (activeSession.standard === 'DOC' ? 'Dokumen 3: Checklist Resmi DOC BKI (Rev 06)' : 'Dokumen 3: Checklist Resmi BKI (Rev 05)')
          : `Dokumen 3: Checklist Audit ${institutionBranding.shortName}`,
        shortName: '3. Checklist Resmi'
      };
    }
    return {
      num: 'Semua',
      title: 'Semua Dokumen',
      fullName: 'Bundle Lengkap: 3 Dokumen Sekaligus (Sesi + NCR + Checklist)',
      shortName: 'Semua Dokumen'
    };
  };

  // Compliance percentage calculation
  const totalChecked = activeSession.totalItemsChecked || (sessionFindings.length > 0 ? sessionFindings.length + 20 : 35);
  const totalClosedFindings = sessionFindings.filter(f => f.status === 'NC Close').length;
  const totalOpenFindings = sessionFindings.filter(f => f.status !== 'NC Close').length;
  const compliedItems = activeSession.itemsComplied || (totalChecked - totalOpenFindings);
  const complianceScore = Math.min(100, Math.round((compliedItems / totalChecked) * 100));

  // Determine official audit close date
  const officialCloseDate = activeFinding?.evidence?.closedDate || activeSession.targetCloseDate || '2026-03-10';

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
            {/* View Mode & Cetak Masing-Masing Dokumen */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-input)',
                padding: '0.2rem 0.3rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                gap: '0.3rem',
                flexWrap: 'wrap'
              }}
            >
              {/* Dokumen 1: Sesi Audit */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: reportMode === 'session' ? 'var(--primary)' : 'transparent',
                  borderRadius: '6px',
                  padding: '0.15rem'
                }}
              >
                <button
                  type="button"
                  onClick={() => setReportMode('session')}
                  className={`tab-btn ${reportMode === 'session' ? 'active' : ''}`}
                  style={{
                    padding: '0.35rem 0.6rem',
                    fontSize: '0.75rem',
                    borderRadius: '5px',
                    border: 'none',
                    fontWeight: reportMode === 'session' ? 800 : 600,
                    color: reportMode === 'session' ? '#ffffff' : 'var(--text-main)',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title="Lihat Pratinjau Dokumen 1: Sesi Audit"
                >
                  1. Sesi Audit ({institutionBranding.shortName})
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrint('session');
                  }}
                  style={{
                    padding: '0.25rem 0.45rem',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    borderRadius: '4px',
                    border: reportMode === 'session' ? '1px solid rgba(255,255,255,0.4)' : '1px solid var(--border-subtle)',
                    background: reportMode === 'session' ? 'rgba(255,255,255,0.22)' : 'var(--bg-surface)',
                    color: reportMode === 'session' ? '#ffffff' : '#0284c7',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                  title="Cetak Masing-Masing: Dokumen 1 Saja (Sesi Audit)"
                >
                  <Printer size={12} />
                  <span>Cetak</span>
                </button>
              </div>

              {/* Dokumen 2: Lembar NC / Observasi */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: reportMode === 'ncr' ? 'var(--primary)' : 'transparent',
                  borderRadius: '6px',
                  padding: '0.15rem'
                }}
              >
                <button
                  type="button"
                  onClick={() => setReportMode('ncr')}
                  className={`tab-btn ${reportMode === 'ncr' ? 'active' : ''}`}
                  style={{
                    padding: '0.35rem 0.6rem',
                    fontSize: '0.75rem',
                    borderRadius: '5px',
                    border: 'none',
                    fontWeight: reportMode === 'ncr' ? 800 : 600,
                    color: reportMode === 'ncr' ? '#ffffff' : 'var(--text-main)',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title="Lihat Pratinjau Dokumen 2: Lembar NC / Observasi"
                >
                  2. Lembar NC / Observasi
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrint('ncr');
                  }}
                  style={{
                    padding: '0.25rem 0.45rem',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    borderRadius: '4px',
                    border: reportMode === 'ncr' ? '1px solid rgba(255,255,255,0.4)' : '1px solid var(--border-subtle)',
                    background: reportMode === 'ncr' ? 'rgba(255,255,255,0.22)' : 'var(--bg-surface)',
                    color: reportMode === 'ncr' ? '#ffffff' : '#f59e0b',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                  title="Cetak Masing-Masing: Dokumen 2 Saja (Lembar NC / Observasi)"
                >
                  <Printer size={12} />
                  <span>Cetak</span>
                </button>
              </div>

              {/* Dokumen 3: Checklist Resmi BKI / Lembaga */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: reportMode === 'checklist' ? 'var(--primary)' : 'transparent',
                  borderRadius: '6px',
                  padding: '0.15rem'
                }}
              >
                <button
                  type="button"
                  onClick={() => setReportMode('checklist')}
                  className={`tab-btn ${reportMode === 'checklist' ? 'active' : ''}`}
                  style={{
                    padding: '0.35rem 0.6rem',
                    fontSize: '0.75rem',
                    borderRadius: '5px',
                    border: 'none',
                    fontWeight: reportMode === 'checklist' ? 800 : 600,
                    color: reportMode === 'checklist' ? '#ffffff' : (isBKI ? '#0284c7' : 'var(--text-main)'),
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title="Lihat Pratinjau Dokumen 3: Checklist Resmi"
                >
                  {isBKI
                    ? (activeSession.standard === 'DOC' ? '3. Checklist Resmi DOC BKI (Persis PDF Rev 06)' : '3. Checklist Resmi BKI (Persis PDF Rev 05)')
                    : `3. Checklist Audit ${institutionBranding.shortName}`}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrint('checklist');
                  }}
                  style={{
                    padding: '0.25rem 0.45rem',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    borderRadius: '4px',
                    border: reportMode === 'checklist' ? '1px solid rgba(255,255,255,0.4)' : '1px solid var(--border-subtle)',
                    background: reportMode === 'checklist' ? 'rgba(255,255,255,0.22)' : 'var(--bg-surface)',
                    color: reportMode === 'checklist' ? '#ffffff' : '#10b981',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                  title="Cetak Masing-Masing: Dokumen 3 Saja (Checklist Resmi)"
                >
                  <Printer size={12} />
                  <span>Cetak</span>
                </button>
              </div>
            </div>

            {/* Print Button: Cetak Dokumen Ini Saja */}
            <button
              type="button"
              onClick={() => handlePrint()}
              className="btn btn-primary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 800,
                padding: '0.45rem 0.9rem',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
              }}
              title={`Cetak hanya ${getActiveDocInfo().fullName} (PDF A4)`}
            >
              <Printer size={15} />
              <span>Cetak {getActiveDocInfo().shortName} Saja</span>
            </button>

            {/* Secondary Option: Cetak Semua (Bundle) */}
            <button
              type="button"
              onClick={() => handlePrint('all')}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.74rem',
                fontWeight: 700,
                padding: '0.45rem 0.75rem',
                color: reportMode === 'all' ? '#0284c7' : 'var(--text-main)',
                borderColor: reportMode === 'all' ? '#0284c7' : 'var(--border-subtle)',
                background: reportMode === 'all' ? 'rgba(2, 132, 199, 0.12)' : 'transparent'
              }}
              title="Cetak seluruh berkas audit lengkap (Dokumen 1, 2, dan 3 digabung)"
            >
              <FileText size={14} />
              <span>Cetak Semua (Bundle)</span>
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

        {/* Banner Notis Mode Cetak Terpisah (Masing-Masing) */}
        <div
          className="no-print"
          style={{
            padding: '0.45rem 1.25rem',
            background: 'rgba(2, 132, 199, 0.07)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-primary" style={{ fontSize: '0.68rem', fontWeight: 800 }}>
              {reportMode === 'all' ? 'SEMUA DOKUMEN (BUNDLE)' : `DOKUMEN ${getActiveDocInfo().num} DARI 3`}
            </span>
            <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>
              {getActiveDocInfo().fullName}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
              ({reportMode === 'all' ? 'Dokumen dicetak berurutan' : 'Format resmi dicetak terpisah / mandiri'})
            </span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
            💡 Tip: Klik tombol <strong style={{ color: '#0284c7' }}>&quot;Cetak&quot;</strong> pada salah satu tab di atas untuk mencetak dokumen tersebut masing-masing.
          </div>
        </div>

        {/* Secondary Bar if NCR mode to choose which NC */}
        {(reportMode === 'ncr' && sessionFindings.length > 1) && (
          <ReportNcrSelector
            selectedFindingId={selectedFindingId}
            sessionFindings={sessionFindings}
            setSelectedFindingId={setSelectedFindingId}
          />
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
            {(!(reportMode === 'checklist' && isBKI) && activeSession.status === 'Completed') && (
              <ReportStatusStamp

              />
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
            {(!(reportMode === 'checklist' && isBKI)) && (
              <ReportDocHeader
                activeSession={activeSession}
                institutionBranding={institutionBranding}
                reportMode={reportMode}
              />
            )}

            {/* ===================================================================== */}
            {/* MODE 1: LAPORAN SESI AUDIT LENGKAP                                     */}
            {/* ===================================================================== */}
            {(reportMode === 'session' || reportMode === 'all') && (
              <ReportSessionSection
                activeSession={activeSession}
                appointedOrg={appointedOrg}
                complianceScore={complianceScore}
                compliedItems={compliedItems}
                currentVessel={currentVessel}
                institutionBranding={institutionBranding}
                isExternal={isExternal}
                officialCloseDate={officialCloseDate}
                sessionFindings={sessionFindings}
                totalChecked={totalChecked}
              />
            )}

            {/* Pemisah Halaman Cetak untuk Bundel: Transisi ke Dokumen 2 (NCR) */}
            {(reportMode === 'all' && activeFinding) && (
              <ReportNcrHeader
                activeSession={activeSession}
                currentVessel={currentVessel}
                institutionBranding={institutionBranding}
              />
            )}

            {/* ===================================================================== */}
            {/* MODE 2: LEMBAR NCR / OBSERVASI (PERSIS SCANNED PNG TB. RP 2004)        */}
            {/* ===================================================================== */}
            {((reportMode === 'ncr' || reportMode === 'all') && activeFinding) && (
              <ReportNcrDetail
                activeFinding={activeFinding}
                activeSession={activeSession}
                appointedOrg={appointedOrg}
                currentVessel={currentVessel}
                isExternal={isExternal}
                officialCloseDate={officialCloseDate}
              />
            )}

            {/* Pemisah Halaman Cetak untuk Bundel: Transisi ke Dokumen 3 (Checklist) */}
            {reportMode === 'all' && (
              <div
                className="print-page-break"
                style={{
                  pageBreakBefore: 'always',
                  breakBefore: 'page',
                  marginTop: '2.5rem',
                  marginBottom: '2rem',
                  borderTop: '1px dashed #cbd5e1',
                  paddingTop: '1.5rem'
                }}
              />
            )}

            {/* ===================================================================== */}
            {/* MODE 3: SMS SHIPBOARD CHECKLIST                                       */}
            {/* ===================================================================== */}
            {(reportMode === 'checklist' || reportMode === 'all') && (
              <ReportChecklistSection
                activeSession={activeSession}
                checklistConfig={checklistConfig}
                currentVessel={currentVessel}
                institutionBranding={institutionBranding}
                isBKI={isBKI}
                reportChecklistItems={reportChecklistItems}
                resolvedList={resolvedList}
                sessionFindings={sessionFindings}
              />
            )}

            {/* ===================================================================== */}
            {/* DOCUMENT FOOTER NOTES                                                 */}
            {/* ===================================================================== */}
            {(!(reportMode === 'checklist' && isBKI)) && (
              <ReportSignatureFooter
                activeSession={activeSession}
                currentVessel={currentVessel}
                institutionBranding={institutionBranding}
                isExternal={isExternal}
              />
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
