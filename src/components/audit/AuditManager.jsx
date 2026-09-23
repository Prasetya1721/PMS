import React, { useState, useMemo, useEffect } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  ShieldCheck,
  Building2,
  Ship,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  FileCheck,
  Package,
  Edit,
  Edit2,
  Trash2,
  Upload,
  Check,
  Save,
  ChevronRight,
  ArrowLeft,
  MessageSquare,
  Printer,
  Eye,
  Sparkles,
  FileSpreadsheet,
  FileText,
  X,
  Strikethrough,
  Undo2,
  Zap,
  Play,
  CheckSquare,
  Compass,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { AuditSessionModal } from './AuditSessionModal';
import { AuditFindingModal } from './AuditFindingModal';
import { SubmitEvidenceModal } from './SubmitEvidenceModal';
import { AuditNotificationModal } from './AuditNotificationModal';
import { AuditReportModal } from './AuditReportModal';
import { AuditRoleFlowModal } from './AuditRoleFlowModal';
import { calculateNCRange, calculateFleetTargetTimeStats, formatIndoDate } from '../../utils/auditTimeUtils';
import {
  getChecklistConfigForSession,
  normalizeChecklistItem,
  isBKIOrganization,
  BKI_AUDIT_MASTER
} from '../../data/auditMasterData';

export const AuditManager = () => {
  const {
    audits,
    allAudits,
    auditFindings,
    allAuditFindings,
    addAuditSession,
    updateAuditSession,
    deleteAuditSession,
    addAuditFinding,
    deleteAuditFinding,
    closeAuditFinding,
    vessels,
    ownerVessels,
    operatorVessels,
    selectedVesselId,
    setSelectedVesselId,
    shipDocuments,
    allShipDocuments,
    requisitions,
    ISM_DOC_ELEMENTS,
    openNCCount,
    closedNCCount,
    currentUser,
    currentRole,
    showToast
  } = usePMS();

  // Selected Target in Audit Gateway:
  // null = Layar Pemilihan Kapal (Gateway)
  // 'office' = Kantor Pusat PT. PBK (Audit DOC)
  // 'v-xxx' = Kapal Armada tertentu (Audit SMC)
  const [activeTargetId, setActiveTargetId] = useState(null);

  // Gateway filters
  const [gatewaySearch, setGatewaySearch] = useState('');
  const [gatewayFilter, setGatewayFilter] = useState('ALL'); // ALL, HAS_OPEN_NC, HAS_SUBMITTED, CLEAN, OWNER, OPERATOR, OFFICE

  // In-Vessel View Tab: 'findings' | 'sessions' | 'checklist' | 'integrations'
  const [vesselTab, setVesselTab] = useState('findings');

  // In-Vessel Filters
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, NC Open, Eviden Submitted, NC Close
  const [severityFilter, setSeverityFilter] = useState('ALL'); // ALL, Major NC, Minor NC, Observation
  const [inVesselSearch, setInVesselSearch] = useState('');
  const [capaFilter, setCapaFilter] = useState('ALL'); // ALL, SUBMITTED, OPEN, CLOSED

  // Modals state
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  const [findingModalOpen, setFindingModalOpen] = useState(false);
  const [editingFinding, setEditingFinding] = useState(null);
  const [findingDefaultAuditId, setFindingDefaultAuditId] = useState(null);

  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [evidenceTargetFinding, setEvidenceTargetFinding] = useState(null);

  const [notificationModalFinding, setNotificationModalFinding] = useState(null);

  // In-app Action Confirmation Modal State for deletion (avoiding blocked window.confirm)
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(null);

  // Official Audit Report Print Modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportModalSession, setReportModalSession] = useState(null);
  const [reportModalFinding, setReportModalFinding] = useState(null);
  const [reportModalMode, setReportModalMode] = useState('session'); // 'session' | 'ncr' | 'checklist'

  // Interactive Perspective state: 'dpa' (Kantor Darat) | 'nakhoda' (Onboard Kapal)
  const [auditRolePerspective, setAuditRolePerspective] = useState(() => {
    try {
      const userRole = (currentUser?.role || currentRole || '').toLowerCase();
      if (userRole.includes('nakhoda') || userRole.includes('master') || userRole.includes('kapal')) {
        return 'nakhoda';
      }
    } catch {}
    return 'dpa';
  });

  const [showRoleFlowModal, setShowRoleFlowModal] = useState(false);

  // Helper deskripsi tanggung jawab peran sesuai tahap aktif
  const getRoleGuidance = (tab, role) => {
    if (role === 'dpa') {
      switch (tab) {
        case 'sessions':
          return 'DPA merencanakan jadwal audit periodik, menunjuk Lead Auditor & tim independen, menetapkan tanggal pelaksanaan, dan mengirimkan surat tugas resmi ke kapal.';
        case 'checklist':
          return 'DPA / Auditor memantau evaluasi 74 butir klausul SMC kapal / 13 seksi DOC kantor, memverifikasi kesesuaian SOP darat dengan kapal, dan mencoret klausul N/A.';
        case 'findings':
          return 'DPA / Auditor meninjau daftar temuan, menetapkan derajat ketidaksesuaian (Major/Minor/Obs), menentukan target batas waktu (Due Date), dan menerbitkan form NCR.';
        case 'capa':
          return 'DPA memeriksa bukti fisik perbaikan yang dikirimkan oleh Nakhoda, mengevaluasi efektivitas tindakan perbaikan (CAPA), dan mengesahkan penutupan temuan (Close NC).';
        case 'reporting':
          return 'DPA menetapkan Deklarasi Kelaiklautan (Fit to Sail / Full Compliance), mengunci sesi audit menjadi Completed, dan menandatangani Laporan Eksekutif.';
        default:
          return 'DPA memantau kepatuhan sertifikat statutory kapal dan ketersediaan suku cadang kritis.';
      }
    } else {
      switch (tab) {
        case 'sessions':
          return 'Nakhoda bertindak selaku Auditee Resmi, menghadiri Opening Meeting bersama tim auditor, mengonfirmasi kesiapan kru kapal, dan menyiapkan dokumen SMS di anjungan.';
        case 'checklist':
          return 'Nakhoda mendampingi auditor saat inspeksi fisik geladak, kamar mesin, pengujian alat keselamatan (LSA/FFA), serta verifikasi logbook navigasi dan perawatan PMS.';
        case 'findings':
          return 'Nakhoda menerima daftar ketidaksesuaian yang ditemukan auditor di kapal, memahami butir klausul yang terlanggar, dan menandatangani pengakuan temuan lapangan.';
        case 'capa':
          return 'Nakhoda memimpin perbaikan fisik onboard (Correction), menganalisis akar masalah (RCA), menyusun langkah pencegahan, melampirkan foto bukti, dan mengirimkan eviden ke DPA.';
        case 'reporting':
          return 'Nakhoda menghadiri Closing Meeting, menandatangani lembar penerimaan laporan audit, mengonfirmasi status Fit to Sail, dan mengarsipkan dokumen di anjungan kapal.';
        default:
          return 'Nakhoda memastikan masa berlaku sertifikat kapal aktif dan permintaan logistik suku cadang telah diajukan ke kantor darat.';
      }
    }
  };

  // Manual checklist state per vessel
  const [customChecklistItems, setCustomChecklistItems] = useState([]);
  const [showManualCodeForm, setShowManualCodeForm] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualCriteria, setManualCriteria] = useState('');
  const [manualStatus, setManualStatus] = useState('Complied');
  const [manualNotes, setManualNotes] = useState('');

  // Checklist Evidence & Evaluation state per vessel
  const [checklistEvidenceMap, setChecklistEvidenceMap] = useState({});
  const [vesselChecklistResults, setVesselChecklistResults] = useState({});
  const [vesselChecklistNotes, setVesselChecklistNotes] = useState({});
  const [vesselChecklistFilter, setVesselChecklistFilter] = useState('ALL'); // ALL | CORE | STRIKETHROUGH | HAS_EVIDENCE | YES | NO | NA
  const [previewChecklistEvidence, setPreviewChecklistEvidence] = useState(null);

  // Override status coret/lepas coret pada checklist kapal
  const [vesselStrikethroughOverrides, setVesselStrikethroughOverrides] = useState({});
  const [vesselDeletedCodes, setVesselDeletedCodes] = useState([]);
  const [vesselItemOverrides, setVesselItemOverrides] = useState({});

  // Edit & Delete Checklist Item state in AuditManager
  const [editingManagerItem, setEditingManagerItem] = useState(null);
  const [editManagerCode, setEditManagerCode] = useState('');
  const [editManagerName, setEditManagerName] = useState('');
  const [editManagerCheckPoint, setEditManagerCheckPoint] = useState('');
  const [editManagerIsmCode, setEditManagerIsmCode] = useState('');
  const [editManagerResult, setEditManagerResult] = useState('');
  const [editManagerNotes, setEditManagerNotes] = useState('');
  const [deleteManagerItemTarget, setDeleteManagerItemTarget] = useState(null);

  // =========================================================================
  // TARGET DATA PREPARATION (PER VESSEL & OFFICE)
  // =========================================================================
  const allFleetTargets = useMemo(() => {
    // 1. Office Target
    const officeFindings = (allAuditFindings || []).filter(f => f.standard === 'DOC' || !f.vesselId);
    const officeAudits = (allAudits || []).filter(a => a.standard === 'DOC' || a.targetType === 'Office' || !a.vesselId);
    const officeOpenNC = officeFindings.filter(f => f.status === 'NC Open').length;
    const officeSubmittedNC = officeFindings.filter(f => f.status === 'Eviden Submitted').length;
    const officeClosedNC = officeFindings.filter(f => f.status === 'NC Close').length;
    const officeMajorNC = officeFindings.filter(f => f.category === 'Major NC' && f.status === 'NC Open').length;
    const officeMinorNC = officeFindings.filter(f => f.category === 'Minor NC' && f.status === 'NC Open').length;
    const officeTimeStats = calculateFleetTargetTimeStats(officeFindings);

    const officeTarget = {
      id: 'office',
      type: 'office',
      name: 'Kantor Pusat PT. PBK Pontianak',
      subtitle: 'Audit Kepatuhan Perusahaan (DOC Standar Kantor)',
      standard: 'DOC',
      ownership: 'Head Office',
      callSign: 'DOC-PBK',
      imo: 'DOC-BKI-2026',
      gt: '-',
      portOfRegistry: 'Pontianak, Kalimantan Barat',
      nakhoda: 'Direktur Utama PT. PBK',
      kkm: 'DPA & Marine Superintendent',
      photo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
      findings: officeFindings,
      audits: officeAudits,
      openNC: officeOpenNC,
      submittedNC: officeSubmittedNC,
      closedNC: officeClosedNC,
      majorNC: officeMajorNC,
      minorNC: officeMinorNC,
      timeStats: officeTimeStats,
      lastAudit: officeAudits[0] || null
    };

    // 2. Ships Targets (Dynamic from Data Master vessels)
    const vesselTargets = (vessels || []).map(v => {
      const shipFindings = (allAuditFindings || []).filter(f =>
        f.vesselId === v.id || (f.targetName && f.targetName.toLowerCase().includes(v.name.toLowerCase()))
      );
      const shipAudits = (allAudits || []).filter(a =>
        a.vesselId === v.id || (a.targetName && a.targetName.toLowerCase().includes(v.name.toLowerCase()))
      );
      const openNC = shipFindings.filter(f => f.status === 'NC Open').length;
      const submittedNC = shipFindings.filter(f => f.status === 'Eviden Submitted').length;
      const closedNC = shipFindings.filter(f => f.status === 'NC Close').length;
      const majorNC = shipFindings.filter(f => f.category === 'Major NC' && f.status === 'NC Open').length;
      const minorNC = shipFindings.filter(f => f.category === 'Minor NC' && f.status === 'NC Open').length;
      const shipTimeStats = calculateFleetTargetTimeStats(shipFindings);

      const isOp = v.id?.startsWith('v-op-') || v.ownershipStatus === 'As Operator';

      return {
        id: v.id,
        type: 'vessel',
        name: v.name,
        subtitle: v.type || 'Kapal Armada PBK',
        standard: 'SMC',
        ownership: isOp ? 'As Operator' : 'As Owner',
        callSign: v.callSign || 'YDB-PBK',
        imo: v.imo || v.regNo || '-',
        gt: v.gt || 250,
        portOfRegistry: v.portOfRegistry || 'Pontianak',
        nakhoda: v.masterCaptain || 'Capt. Nakhoda PBK',
        kkm: v.chiefEngineer || 'KKM Masinis PBK',
        photo: v.photo || 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80',
        findings: shipFindings,
        audits: shipAudits,
        openNC,
        submittedNC,
        closedNC,
        majorNC,
        minorNC,
        timeStats: shipTimeStats,
        lastAudit: shipAudits[0] || null
      };
    });

    return [officeTarget, ...vesselTargets];
  }, [allAuditFindings, allAudits, vessels]);

  // Active target object when selected
  const currentTarget = useMemo(() => {
    if (!activeTargetId) return null;
    return allFleetTargets.find(t => t.id === activeTargetId) || allFleetTargets[0];
  }, [activeTargetId, allFleetTargets]);

  // Checklist konfigurasi sesuai lembaga audit
  const activeChecklistConfig = useMemo(() => {
    if (!currentTarget) return getChecklistConfigForSession(null);
    const session = currentTarget.lastAudit || currentTarget.audits?.[0] || null;
    const org = session?.externalOrganization ?? (currentTarget.auditType === 'Internal' ? 'internal' : null);
    if (currentTarget.standard === 'DOC') {
      return getChecklistConfigForSession(org || 'internal', 'DOC');
    }
    return getChecklistConfigForSession(org || 'internal', currentTarget.standard || 'SMC');
  }, [currentTarget]);

  // Butir checklist siap render untuk tabel UI.
  const activeChecklistItems = useMemo(
    () => (activeChecklistConfig.items || []).map(normalizeChecklistItem),
    [activeChecklistConfig]
  );

  // Active Audit Session on current target (scheduled or in-progress, or the latest)
  const activeSession = useMemo(() => {
    if (!currentTarget || !currentTarget.audits || currentTarget.audits.length === 0) return null;
    return currentTarget.audits.find(a => a.status === 'In Progress' || a.status === 'Scheduled')
      || currentTarget.audits[0]
      || null;
  }, [currentTarget]);

  // Sync checklist dari activeSession jika sesi tersebut telah memiliki data checklist tersimpan
  useEffect(() => {
    if (activeSession?.checklist && Array.isArray(activeSession.checklist) && activeSession.checklist.length > 0) {
      const resultsMap = {};
      const notesMap = {};
      const evidenceMap = {};
      activeSession.checklist.forEach(item => {
        if (item.code) {
          if (item.result) resultsMap[item.code] = item.result;
          if (item.notes) notesMap[item.code] = item.notes;
          if (item.evidence) evidenceMap[item.code] = item.evidence;
        }
      });
      setVesselChecklistResults(prev => ({ ...prev, ...resultsMap }));
      setVesselChecklistNotes(prev => ({ ...prev, ...notesMap }));
      setChecklistEvidenceMap(prev => ({ ...prev, ...evidenceMap }));
    }
  }, [activeSession?.id]);

  // Hitung progres checklist real-time untuk lifecycle stepper
  const checklistProgress = useMemo(() => {
    const total = activeChecklistItems.length;
    let answered = 0;
    let complied = 0;
    let nc = 0;
    let na = 0;

    activeChecklistItems.forEach(el => {
      const isStriked = vesselStrikethroughOverrides[el.code] !== undefined
        ? vesselStrikethroughOverrides[el.code]
        : Boolean(el.isStrikethrough);
      const res = vesselChecklistResults[el.code] !== undefined
        ? vesselChecklistResults[el.code]
        : (isStriked ? 'N/A' : (el.result || ''));

      if (isStriked || res === 'N/A') {
        na++;
        answered++;
      } else if (res === 'Complied' || res === 'Yes') {
        complied++;
        answered++;
      } else if (['Minor NC', 'Major NC', 'Observation', 'No'].includes(res)) {
        nc++;
        answered++;
      }
    });

    const percent = total > 0 ? Math.round((answered / total) * 100) : 0;
    return { total, answered, complied, nc, na, percent };
  }, [activeChecklistItems, vesselStrikethroughOverrides, vesselChecklistResults]);

  // Handler Inisiasi Cepat Sesi Audit (1-Click Launch)
  const handleQuickLaunchSession = () => {
    if (!currentTarget) return;
    const isDoc = currentTarget.standard === 'DOC';
    const rand = Math.floor(Math.random() * 900 + 100);
    const year = new Date().getFullYear();
    const newSession = {
      auditNo: `AUD-INT-${currentTarget.standard}-${year}/${rand}`,
      reportId: `0859-PK/ISM-${currentTarget.standard}/${year}`,
      auditType: 'Internal',
      externalOrganization: 'PT. Pelayaran Baharimas Kalimantan (Internal DPA / QHSE)',
      standard: currentTarget.standard,
      targetType: isDoc ? 'Office' : 'Vessel',
      targetName: currentTarget.name,
      vesselId: isDoc ? null : currentTarget.id,
      leadAuditor: 'Capt. Marine Safety Inspector (Lead Auditor DPA)',
      auditTeam: ['DPA & Marine Superintendent', 'QHSE Staff'],
      auditee: isDoc ? 'Direktur Operasional & DPA' : `${currentTarget.nakhoda || 'Nakhoda'} & ${currentTarget.kkm || 'KKM'}`,
      auditLocation: isDoc ? 'Kantor Pusat PT. PBK Pontianak' : `Onboard ${currentTarget.name} (Pelabuhan Pontianak)`,
      auditDate: new Date().toISOString().split('T')[0],
      targetCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      scope: isDoc ? 'Audit Kepatuhan Kantor Pusat ISM Code Standar DOC' : `Audit Kepatuhan Kapal ${currentTarget.name} Standar SMC ISM Code`,
      status: 'In Progress',
      selectedCertificateIds: [],
      selectedRequisitionIds: [],
      checklist: (activeChecklistItems || []).map(i => ({
        id: i.code || i.id,
        code: i.code,
        name: i.name,
        checkPoint: i.checkPoint,
        ismCode: i.ismCode || '',
        result: i.isStrikethrough ? 'N/A' : (i.defaultResult || ''),
        notes: '',
        isManual: false,
        isStrikethrough: Boolean(i.isStrikethrough),
        evidence: null
      })),
      auditConclusion: '',
      leadAuditorSign: '',
      auditeeSign: '',
      totalItemsChecked: (activeChecklistItems || []).length,
      itemsComplied: 0,
      findingsSummary: { majorNC: 0, minorNC: 0, observation: 0, totalOpen: 0, totalClosed: 0 }
    };
    addAuditSession(newSession);
    showToast(`✓ Sesi Audit ${newSession.auditNo} aktif untuk ${currentTarget.name}!`, 'success');
    setVesselTab('checklist');
  };

  // Handler Memuat Contoh Audit SMC Lengkap & Realistis (5 Tahap Lifecycle)
  const handleLoadSampleSMCAudit = () => {
    if (!currentTarget) return;
    const isDoc = currentTarget.standard === 'DOC';
    const vesselName = isDoc ? 'TB. RP 2004' : currentTarget.name;
    const vesselId = isDoc ? 'v-rp2004' : currentTarget.id;
    const nakhoda = currentTarget.nakhoda || 'Capt. Ekhsan (Nakhoda)';
    const kkm = currentTarget.kkm || 'Ir. Bambang Wijaya (KKM)';
    const year = new Date().getFullYear();
    const todayStr = new Date().toISOString().split('T')[0];
    const dueStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const sampleSessionId = `aud-smc-sample-${Date.now().toString().slice(-6)}`;
    const sampleAuditNo = `AUD-SMC-BKI/PBK-${year}/089`;
    const sampleReportId = `0859-PK/ISM-SMC/${year}`;

    // Siapkan 74 butir checklist BKI SMC Rev 05 terisi realistis
    const resultsMap = {};
    const notesMap = {};
    const sessionChecklist = (activeChecklistItems || []).map(i => {
      let res = 'Complied';
      let note = '';

      if (i.code === '10.3' || i.code?.startsWith('10.3')) {
        res = 'Minor NC';
        note = 'Emergency Fire Pump di steering gear room mengalami delay start 45 detik saat pengujian simulasi.';
      } else if (i.code === '6.5' || i.code?.startsWith('6.5')) {
        res = 'Observation';
        note = 'Formulir familiarisasi onboard untuk 2 ABK baru belum ditandatangani Perwira Keselamatan.';
      } else if (i.code?.startsWith('10.7') || i.code?.startsWith('10.8') || i.name?.toLowerCase().includes('cargo') || i.name?.toLowerCase().includes('crane')) {
        res = 'N/A';
        note = 'Klausul N/A (Kapal jenis Tugboat / Tunda tanpa crane kargo).';
      }

      resultsMap[i.code] = res;
      if (note) notesMap[i.code] = note;

      return {
        id: i.code || i.id,
        code: i.code,
        name: i.name,
        checkPoint: i.checkPoint,
        ismCode: i.ismCode || '',
        result: res,
        notes: note,
        isManual: false,
        isStrikethrough: res === 'N/A',
        evidence: res !== 'N/A' ? {
          fileName: `EVIDEN-${i.code}-DOKUMEN-FOTO.pdf`,
          fileUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80',
          uploadedAt: new Date().toISOString()
        } : null
      };
    });

    const sampleSession = {
      id: sampleSessionId,
      auditNo: sampleAuditNo,
      reportId: sampleReportId,
      auditType: 'Internal',
      externalOrganization: 'Biro Klasifikasi Indonesia (BKI) / Internal DPA',
      standard: 'SMC',
      targetType: 'Vessel',
      targetName: vesselName,
      vesselId: vesselId,
      leadAuditor: 'Capt. Hendra Gunawan (Lead Marine Auditor ISM/DPA)',
      auditTeam: ['Ir. H. Gunawan (Marine Superintendent)', 'Dian Anggraini (QHSE Officer)'],
      auditee: `${nakhoda} & ${kkm}`,
      auditLocation: `Onboard ${vesselName} (Dermaga Pelabuhan Pontianak)`,
      auditDate: todayStr,
      targetCloseDate: dueStr,
      scope: `Audit Pemenuhan Sistem Manajemen Keselamatan ISM Code Standar SMC Kapal ${vesselName} (BKI SMS Shipboard Rev 05)`,
      status: 'In Progress',
      selectedCertificateIds: [],
      selectedRequisitionIds: [],
      checklist: sessionChecklist,
      auditConclusion: 'Operasional keselamatan kapal secara umum memenuhi ketentuan ISM Code dan BKI SMS Rev 05. Ditemukan 1 Minor NC pada pompa pemadam darurat dan 1 Observasi pada verifikasi familiarisasi kru.',
      leadAuditorSign: 'Capt. Hendra Gunawan',
      auditeeSign: nakhoda,
      totalItemsChecked: sessionChecklist.length,
      itemsComplied: sessionChecklist.filter(x => x.result === 'Complied').length,
      findingsSummary: { majorNC: 0, minorNC: 1, observation: 1, totalOpen: 1, totalClosed: 1 }
    };

    addAuditSession(sampleSession);

    // Temuan 1: Minor NC pada 10.3 (Status: Eviden Submitted / Siap Verifikasi)
    const finding1 = {
      id: `fnd-smc-${Date.now().toString().slice(-5)}-1`,
      findingNo: `NC-SMC-${year}-001`,
      auditId: sampleSessionId,
      auditNo: sampleAuditNo,
      vesselId: vesselId,
      targetName: vesselName,
      standard: 'SMC',
      auditType: 'Internal',
      externalOrganization: 'Biro Klasifikasi Indonesia (BKI)',
      clauseCode: '10.3',
      clauseName: 'Peralatan Kritis Kapal (Critical Shipboard Equipment)',
      elementNumberOfCode: '10.3',
      description: 'Saat pengetesan berkala darurat di dermaga, Emergency Fire Pump di steering gear room mengalami delay start 45 detik karena akumulasi udara pada suction line. Tekanan discharge belum stabil mencapai 2.5 bar sesuai SOLAS II-2.',
      objectiveEvidence: 'Logbook pengetesan mingguan tanggal 20 September 2026 dan pengujian fisik di hadapan Lead Auditor.',
      category: 'Minor NC',
      assignedTo: `${kkm} & Masinis II`,
      dateIdentified: todayStr,
      dueDate: dueStr,
      status: 'Eviden Submitted',
      evidence: {
        rootCause: 'Foot valve pada pipa hisap mengalami kerak karat tipis sehingga terjadi back-leakage air pancingan saat pompa standby dalam posisi siap jalan.',
        correction: 'Pembersihan dan penggantian seal foot valve, serta bleeding sistem pipa hisap hingga pompa dapat start instan dalam 5 detik dengan tekanan 3.2 bar.',
        correctiveAction: 'Menambahkan poin pemeriksaan seal foot valve ke dalam PMS 3-bulanan dan mewajibkan uji pengetesan mingguan dicatat di log book kamar mesin.',
        preventiveAction: 'Audit silang antar-kapal armada setiap 6 bulan untuk verifikasi kesiapan pompa pemadam darurat.',
        agreedDate: dueStr,
        submittedBy: `${kkm} (Chief Engineer)`,
        submissionDate: todayStr,
        attachments: [
          { name: 'BAST-PERBAIKAN-FOOTVALVE-PUMP.pdf', size: '1.4 MB' },
          { name: 'FOTO-RUNNING-TEST-PRESSURE-3.2BAR.jpg', size: '2.1 MB' }
        ]
      }
    };

    // Temuan 2: Observation pada 6.5 (Status: NC Close / Sudah Ditutup)
    const finding2 = {
      id: `fnd-smc-${Date.now().toString().slice(-5)}-2`,
      findingNo: `OBS-SMC-${year}-002`,
      auditId: sampleSessionId,
      auditNo: sampleAuditNo,
      vesselId: vesselId,
      targetName: vesselName,
      standard: 'SMC',
      auditType: 'Internal',
      externalOrganization: 'Biro Klasifikasi Indonesia (BKI)',
      clauseCode: '6.5',
      clauseName: 'Pelatihan & Familiarisasi Personil Onboard',
      elementNumberOfCode: '6.5',
      description: 'Formulir familiarisasi safety onboard untuk 2 orang ABK baru (Oiler & Kelasi) telah dilaksanakan secara lisan saat sign-on, namun lembar verifikasi checklist belum ditandatangani oleh Perwira Keselamatan (Chief Mate).',
      objectiveEvidence: 'Dokumen checklist familiarisasi FM-CREW-04 di ruang nakhoda belum dibubuhi tanda tangan.',
      category: 'Observation',
      assignedTo: `Chief Mate & ${nakhoda}`,
      dateIdentified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDate: todayStr,
      status: 'NC Close',
      dateClosed: todayStr,
      closedBy: 'Capt. Hendra Gunawan (Lead Auditor)',
      closedNotes: 'Diverifikasi langsung di kapal: seluruh formulir familiarisasi telah ditandatangani dan ABK mampu mendemonstrasikan prosedur evakuasi darurat.',
      evidence: {
        rootCause: 'Pergantian jadwal jaga saat kapal tiba di dermaga menyebabkan penandatanganan dokumen administrasi tertunda.',
        correction: 'Verifikasi ulang pemahaman keselamatan dan melengkapi tanda tangan seluruh lembar familiarisasi.',
        correctiveAction: 'SOP sign-on kru mewajibkan verifikasi dan tanda tangan selesai maksimal 24 jam sebelum kapal bertolak.',
        preventiveAction: 'Briefing safety rutin pada hari pertama pergantian kru (crew change).',
        submittedBy: `${nakhoda} (Master Captain)`,
        submissionDate: todayStr
      }
    };

    addAuditFinding(finding1);
    addAuditFinding(finding2);

    setVesselChecklistResults(resultsMap);
    setVesselChecklistNotes(notesMap);

    showToast(`✓ Contoh Audit SMC Resmi BKI (${vesselName}) berhasil dimuat lengkap dengan 5 Tahap!`, 'success');
    setVesselTab('capa');
  };

  // Handler 1-Click NC Creation dari Butir Checklist
  const handleQuickLogNC = (item, preferredCategory = 'Minor NC') => {
    if (!currentTarget) return;
    const assignedPIC = currentTarget.type === 'vessel'
      ? `${currentTarget.kkm || 'KKM'} / ${currentTarget.nakhoda || 'Nakhoda'}`
      : 'Manager QHSE / DPA';

    const draftFinding = {
      isDraft: true,
      auditId: activeSession?.id || null,
      auditNo: activeSession?.auditNo || `AUD-${currentTarget.standard}-${Date.now().toString().slice(-4)}`,
      vesselId: currentTarget.type === 'vessel' ? currentTarget.id : null,
      targetName: currentTarget.name,
      standard: currentTarget.standard,
      auditType: activeSession?.auditType || 'Internal',
      externalOrganization: activeSession?.externalOrganization || 'Biro Klasifikasi Indonesia (BKI)',
      clauseCode: item.code,
      clauseName: item.name,
      elementNumberOfCode: item.code,
      description: `Ketidaksesuaian teridentifikasi pada butir ${item.code} (${item.name}): ${item.checkPoint || item.description || 'Pemeriksaan kepatuhan'}. Kondisi aktual belum memenuhi standar keselamatan ISM Code.`,
      objectiveEvidence: vesselChecklistNotes[item.code] || checklistEvidenceMap[item.code]?.fileName || 'Hasil observasi auditor saat pemeriksaan checklist lapangan.',
      category: preferredCategory === 'Major NC' ? 'Major NC' : preferredCategory === 'Observation' ? 'Observation' : 'Minor NC',
      assignedTo: assignedPIC,
      dateIdentified: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setEditingFinding(draftFinding);
    setFindingDefaultAuditId(activeSession?.id || null);
    setFindingModalOpen(true);
  };

  // Handler toggle evaluasi Yes / No / NA dengan auto-sync ke activeSession
  const handleToggleManagerResult = (code, targetResult) => {
    const current = vesselChecklistResults[code];
    const isAlreadyTarget = current === targetResult || (targetResult === 'Complied' && current === 'Yes') || (targetResult === 'Minor NC' && (current === 'No' || current === 'Observation' || current === 'Major NC'));
    const nextVal = isAlreadyTarget ? '' : targetResult;
    setVesselChecklistResults(prev => ({
      ...prev,
      [code]: nextVal
    }));

    // Auto-sync ke Active Audit Session jika ada
    if (activeSession && updateAuditSession) {
      const baseItems = activeSession.checklist && activeSession.checklist.length > 0
        ? activeSession.checklist
        : (activeChecklistItems || []);
      const updatedList = baseItems.map(item => {
        if (item.code === code || item.id === code) {
          return { ...item, result: nextVal };
        }
        return item;
      });
      updateAuditSession(activeSession.id, { checklist: updatedList });
    }
  };

  // Handlers for Checklist Item Edit & Delete in AuditManager
  const handleOpenEditManagerItem = (item) => {
    setEditingManagerItem(item);
    setEditManagerCode(item.code || '');
    setEditManagerName(item.name || '');
    setEditManagerCheckPoint(item.checkPoint || item.checkPoints?.[0] || item.description || '');
    setEditManagerIsmCode(item.ismCode || '');
    const currentRes = vesselChecklistResults[item.code] !== undefined
      ? vesselChecklistResults[item.code]
      : (item.result || '');
    setEditManagerResult(currentRes);
    const currentNote = vesselChecklistNotes[item.code] !== undefined
      ? vesselChecklistNotes[item.code]
      : (item.notes || '');
    setEditManagerNotes(currentNote);
  };

  const handleSaveEditManagerItem = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!editManagerCode.trim() || !editManagerName.trim()) {
      showToast('Kode klausul dan Area Pemeriksaan wajib diisi!', 'warning');
      return;
    }

    const oldCode = editingManagerItem.code;
    const newCode = editManagerCode.trim();

    // If custom item
    if (editingManagerItem.id && customChecklistItems.some(i => i.id === editingManagerItem.id)) {
      setCustomChecklistItems(prev => prev.map(item => {
        if (item.id === editingManagerItem.id) {
          return {
            ...item,
            code: newCode,
            name: editManagerName.trim(),
            checkPoint: editManagerCheckPoint.trim(),
            ismCode: editManagerIsmCode.trim(),
            result: editManagerResult,
            notes: editManagerNotes.trim()
          };
        }
        return item;
      }));
    } else {
      // If template item
      setVesselItemOverrides(prev => ({
        ...prev,
        [oldCode]: {
          code: newCode,
          name: editManagerName.trim(),
          checkPoint: editManagerCheckPoint.trim(),
          ismCode: editManagerIsmCode.trim(),
          result: editManagerResult,
          notes: editManagerNotes.trim()
        }
      }));
    }

    setVesselChecklistResults(prev => ({
      ...prev,
      [newCode]: editManagerResult,
      ...(oldCode !== newCode ? { [oldCode]: undefined } : {})
    }));

    setVesselChecklistNotes(prev => ({
      ...prev,
      [newCode]: editManagerNotes.trim(),
      ...(oldCode !== newCode ? { [oldCode]: undefined } : {})
    }));

    showToast(`✓ Butir checklist "${newCode}" berhasil diperbarui!`, 'success');
    setEditingManagerItem(null);
  };

  const handleConfirmDeleteManagerItem = () => {
    if (!deleteManagerItemTarget) return;
    const targetCode = deleteManagerItemTarget.code;

    // Remove from custom items if present
    setCustomChecklistItems(prev => prev.filter(i => i.id !== deleteManagerItemTarget.id && i.code !== targetCode));

    // Add to deleted codes for template items
    setVesselDeletedCodes(prev => [...new Set([...prev, targetCode])]);

    setDeleteManagerItemTarget(null);
    showToast(`✓ Butir checklist "${targetCode}" berhasil dihapus!`, 'info');
  };

  // Handler toggle coret / lepas coret pada checklist audit kapal
  const handleToggleVesselStrikethrough = (code) => {
    const item = activeChecklistItems.find(i => i.code === code) || customChecklistItems.find(i => i.code === code);
    const currentlyStriked = vesselStrikethroughOverrides[code] !== undefined
      ? vesselStrikethroughOverrides[code]
      : Boolean(item?.isStrikethrough);
    const nextStriked = !currentlyStriked;

    setVesselStrikethroughOverrides(prev => ({
      ...prev,
      [code]: nextStriked
    }));

    const nextRes = nextStriked ? 'N/A' : (vesselChecklistResults[code] === 'N/A' ? 'Complied' : (vesselChecklistResults[code] || 'Complied'));
    setVesselChecklistResults(prev => ({
      ...prev,
      [code]: nextRes
    }));

    if (activeSession && updateAuditSession) {
      const baseItems = activeSession.checklist && activeSession.checklist.length > 0
        ? activeSession.checklist
        : (activeChecklistItems || []);
      const updatedList = baseItems.map(it => {
        if (it.code === code || it.id === code) {
          return {
            ...it,
            isStrikethrough: nextStriked,
            result: nextRes
          };
        }
        return it;
      });
      updateAuditSession(activeSession.id, { checklist: updatedList });
    }

    showToast(
      nextStriked
        ? `✂️ Klausul ${code} berhasil dicoret (status diset N/A)`
        : `✓ Klausul ${code} dilepas coret (status aktif)`,
      nextStriked ? 'info' : 'success'
    );
  };

  // Evidence Handlers for Vessel Checklist
  const handleUploadVesselChecklistEvidence = (itemCode, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const evidenceObj = {
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        fileUrl: e.target.result,
        uploadedAt: new Date().toISOString()
      };
      setChecklistEvidenceMap(prev => ({ ...prev, [itemCode]: evidenceObj }));

      if (activeSession && updateAuditSession) {
        const baseItems = activeSession.checklist && activeSession.checklist.length > 0
          ? activeSession.checklist
          : (activeChecklistItems || []);
        const updatedList = baseItems.map(it => {
          if (it.code === itemCode || it.id === itemCode) {
            return { ...it, evidence: evidenceObj };
          }
          return it;
        });
        updateAuditSession(activeSession.id, { checklist: updatedList });
      }

      showToast(`✓ Bukti audit untuk klausul ${itemCode} berhasil diunggah!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateMockVesselChecklistEvidence = (itemCode, itemName, vesselName) => {
    const targetName = vesselName || 'Kapal Armada PBK';
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <rect width="100%" height="100%" fill="#0f172a"/>
      <rect x="20" y="20" width="560" height="360" rx="12" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
      <circle cx="300" cy="100" r="40" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-width="3"/>
      <path d="M282 100 L295 113 L325 85" stroke="#10b981" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <text x="300" y="175" font-family="sans-serif" font-size="18" font-weight="bold" fill="#f8fafc" text-anchor="middle">BUKTI AUDIT CHECKLIST ONBOARD</text>
      <text x="300" y="205" font-family="sans-serif" font-size="13" font-weight="bold" fill="#38bdf8" text-anchor="middle">PT. PELAYARAN BAHARIMAS KALIMANTAN</text>
      <text x="300" y="240" font-family="monospace" font-size="13" fill="#e2e8f0" text-anchor="middle">Klausul: ${itemCode} - ${itemName?.substring(0, 35)}</text>
      <text x="300" y="270" font-family="sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">Lokasi Onboard: ${targetName}</text>
      <rect x="180" y="315" width="240" height="35" rx="6" fill="#047857"/>
      <text x="300" y="338" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">VERIFIED AUDIT EVIDENCE</text>
    </svg>`;
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
    const evidenceObj = {
      fileName: `BUKTI_${itemCode.replace(/[^a-zA-Z0-9]/g, '_')}_${targetName.replace(/\s+/g, '_')}.svg`,
      fileSize: '16.2 KB',
      fileUrl: dataUrl,
      uploadedAt: new Date().toISOString()
    };
    setChecklistEvidenceMap(prev => ({ ...prev, [itemCode]: evidenceObj }));

    if (activeSession && updateAuditSession) {
      const baseItems = activeSession.checklist && activeSession.checklist.length > 0
        ? activeSession.checklist
        : (activeChecklistItems || []);
      const updatedList = baseItems.map(it => {
        if (it.code === itemCode || it.id === itemCode) {
          return { ...it, evidence: evidenceObj };
        }
        return it;
      });
      updateAuditSession(activeSession.id, { checklist: updatedList });
    }

    showToast(`✓ Simulasi bukti audit ${itemCode} berhasil dilampirkan!`, 'info');
  };

  const handleRemoveVesselChecklistEvidence = (itemCode) => {
    setChecklistEvidenceMap(prev => {
      const next = { ...prev };
      delete next[itemCode];
      return next;
    });

    if (activeSession && updateAuditSession) {
      const baseItems = activeSession.checklist && activeSession.checklist.length > 0
        ? activeSession.checklist
        : (activeChecklistItems || []);
      const updatedList = baseItems.map(it => {
        if (it.code === itemCode || it.id === itemCode) {
          return { ...it, evidence: null };
        }
        return it;
      });
      updateAuditSession(activeSession.id, { checklist: updatedList });
    }

    showToast(`Bukti audit ${itemCode} dilepas`, 'info');
  };

  // Global fleet KPI stats
  const fleetStats = useMemo(() => {
    const totalTargets = allFleetTargets.length;
    const totalOpen = allFleetTargets.reduce((acc, t) => acc + t.openNC, 0);
    const totalSubmitted = allFleetTargets.reduce((acc, t) => acc + t.submittedNC, 0);
    const totalClosed = allFleetTargets.reduce((acc, t) => acc + t.closedNC, 0);
    const totalSessions = (allAudits || []).length;
    const cleanTargets = allFleetTargets.filter(t => t.openNC === 0).length;
    const complianceRate = totalTargets > 0 ? Math.round((cleanTargets / totalTargets) * 100) : 100;
    const totalOverdue = allFleetTargets.reduce((acc, t) => acc + (t.timeStats?.overdueCount || 0), 0);

    // Fleet-wide average resolution days for closed NC
    let totalClosedDays = 0;
    let closedCount = 0;
    (allAuditFindings || []).filter(f => f.status === 'NC Close').forEach(f => {
      const range = calculateNCRange(f);
      if (range?.resolutionDays) {
        totalClosedDays += range.resolutionDays;
        closedCount++;
      }
    });
    const avgCloseDays = closedCount > 0 ? Math.round(totalClosedDays / closedCount) : 0;

    return {
      totalTargets,
      totalOpen,
      totalSubmitted,
      totalClosed,
      totalSessions,
      cleanTargets,
      complianceRate,
      totalOverdue,
      avgCloseDays
    };
  }, [allFleetTargets, allAudits, allAuditFindings]);

  // Filtered targets for the gateway grid
  const filteredGatewayTargets = useMemo(() => {
    return allFleetTargets.filter(target => {
      // Category filter
      if (gatewayFilter === 'HAS_OPEN_NC' && target.openNC === 0) return false;
      if (gatewayFilter === 'HAS_SUBMITTED' && target.submittedNC === 0) return false;
      if (gatewayFilter === 'CLEAN' && target.openNC > 0) return false;
      if (gatewayFilter === 'OWNER' && target.ownership !== 'As Owner') return false;
      if (gatewayFilter === 'OPERATOR' && target.ownership !== 'As Operator') return false;
      if (gatewayFilter === 'OFFICE' && target.id !== 'office') return false;

      // Search query
      if (gatewaySearch.trim()) {
        const q = gatewaySearch.toLowerCase();
        const matchName = target.name.toLowerCase().includes(q);
        const matchSub = target.subtitle.toLowerCase().includes(q);
        const matchCall = target.callSign.toLowerCase().includes(q);
        const matchImo = String(target.imo).toLowerCase().includes(q);
        const matchPort = target.portOfRegistry.toLowerCase().includes(q);
        return matchName || matchSub || matchCall || matchImo || matchPort;
      }

      return true;
    });
  }, [allFleetTargets, gatewayFilter, gatewaySearch]);

  // Filtered findings for the active target view
  const currentTargetFilteredFindings = useMemo(() => {
    if (!currentTarget) return [];
    return (currentTarget.findings || []).filter(finding => {
      if (statusFilter === 'NC Open' && finding.status !== 'NC Open') return false;
      if (statusFilter === 'Eviden Submitted' && finding.status !== 'Eviden Submitted') return false;
      if (statusFilter === 'NC Close' && finding.status !== 'NC Close') return false;

      if (severityFilter !== 'ALL' && finding.category !== severityFilter) return false;

      if (inVesselSearch.trim()) {
        const q = inVesselSearch.toLowerCase();
        return (
          finding.findingNo?.toLowerCase().includes(q) ||
          finding.clauseCode?.toLowerCase().includes(q) ||
          finding.clauseName?.toLowerCase().includes(q) ||
          finding.description?.toLowerCase().includes(q) ||
          finding.assignedTo?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [currentTarget, statusFilter, severityFilter, inVesselSearch]);

  const ownerCount = useMemo(() => {
    if (Array.isArray(ownerVessels)) return ownerVessels.length;
    return (vessels || []).filter(v => !v.id?.startsWith('v-op-') && v.ownershipStatus !== 'As Operator').length;
  }, [ownerVessels, vessels]);

  const operatorCount = useMemo(() => {
    if (Array.isArray(operatorVessels)) return operatorVessels.length;
    return (vessels || []).filter(v => v.id?.startsWith('v-op-') || v.ownershipStatus === 'As Operator').length;
  }, [operatorVessels, vessels]);

  // Relevant certificates for current target
  const currentTargetCertificates = useMemo(() => {
    if (!currentTarget) return [];
    const docs = allShipDocuments || shipDocuments || [];
    if (currentTarget.id === 'office') {
      return docs.filter(d => d.type?.toLowerCase().includes('doc') || d.category === 'Statutory' || d.vesselId === 'all');
    }
    return docs.filter(d => d.vesselId === currentTarget.id);
  }, [allShipDocuments, shipDocuments, currentTarget]);

  // Relevant requisitions for current target
  const currentTargetRequisitions = useMemo(() => {
    if (!currentTarget) return [];
    if (currentTarget.id === 'office') {
      return requisitions || [];
    }
    return (requisitions || []).filter(r => r.vesselId === currentTarget.id);
  }, [requisitions, currentTarget]);

  // Handle select target
  const handleSelectTarget = (targetId) => {
    setActiveTargetId(targetId);
    setVesselTab('findings');
    setStatusFilter('ALL');
    setSeverityFilter('ALL');
    setInVesselSearch('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Add Manual Checklist item for current vessel
  const handleAddManualChecklistItem = (e) => {
    e.preventDefault();
    if (!manualCode.trim() || !manualName.trim()) {
      showToast('Harap masukkan kode klausul dan nama pemeriksaan!', 'warning');
      return;
    }

    const newItem = {
      id: `custom-${Date.now()}`,
      code: manualCode.trim().toUpperCase(),
      name: manualName.trim(),
      checkPoint: manualCriteria.trim() || 'Kriteria pemeriksaan keselamatan kapal',
      result: manualStatus,
      notes: manualNotes.trim(),
      isManual: true,
      vesselId: currentTarget?.id
    };

    setCustomChecklistItems(prev => [newItem, ...prev]);
    setManualCode('');
    setManualName('');
    setManualCriteria('');
    setManualNotes('');
    setShowManualCodeForm(false);
    showToast(`✓ Item audit manual "${newItem.code}" berhasil ditambahkan ke ${currentTarget?.name}!`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>

      {/* ========================================================================= */}
      {/* 1. LAYAR PEMILIHAN KAPAL / FLEET SELECTION GATEWAY (activeTargetId === null) */}
      {/* ========================================================================= */}
      {!activeTargetId && (
        <>
          {/* Hero Banner Gateway */}
          <div className="audit-hero-banner glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{
                padding: '0.85rem',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
              }}>
                <ShieldCheck size={32} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.55rem', fontWeight: 800 }}>Portal Audit ISM Code Per Armada Kapal</h2>
                  <span className="badge badge-info" style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}>
                    {vessels.length} Kapal & Kantor Pusat PBK
                  </span>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.3rem', maxWidth: '780px', lineHeight: '1.5' }}>
                  Silakan <strong>pilih kapal terlebih dahulu</strong> di bawah ini untuk mengakses ruang audit dan menu audit khusus masing-masing kapal.
                  Setiap kapal memiliki pencatatan temuan, eviden perbaikan, dan notis status <strong>NC Open / NC Close</strong> mandiri.
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => {
                  setEditingSession(null);
                  setSessionModalOpen(true);
                }}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
              >
                <Plus size={15} color="#38bdf8" />
                <span>Sesi Audit Baru</span>
              </button>
              <button
                onClick={() => {
                  setEditingFinding(null);
                  setFindingDefaultAuditId(null);
                  setFindingModalOpen(true);
                }}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
              >
                <AlertTriangle size={15} />
                <span>Catat Temuan NC</span>
              </button>
            </div>
          </div>

          {/* Fleet Statistics KPI Bar */}
          <div className="audit-kpi-grid">
            <div className="audit-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Entitas Armada</span>
                <Ship size={18} color="#38bdf8" />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem', color: '#38bdf8' }}>
                {vessels.length} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Kapal + 1 DOC</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                {ownerCount} As Owner • {operatorCount} As Operator PBK
              </p>
            </div>

            <div className="audit-card audit-card-danger">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 700 }}>Total NC Open Armada</span>
                <span className="badge badge-danger-pulse" style={{ fontSize: '0.65rem' }}>Open</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem', color: '#ef4444' }}>
                {fleetStats.totalOpen} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Temuan Terbuka</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                {fleetStats.totalOverdue > 0 ? (
                  <span style={{ color: '#ef4444', fontWeight: 700 }}>🚨 {fleetStats.totalOverdue} NC Melewati Batas Waktu!</span>
                ) : (
                  'Semua temuan dalam batas rentang aman'
                )}
              </p>
            </div>

            <div className="audit-card audit-card-warning">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 700 }}>Menunggu Verifikasi</span>
                <Clock size={18} color="#f59e0b" />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem', color: '#f59e0b' }}>
                {fleetStats.totalSubmitted} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Eviden Masuk</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Sedang ditinjau oleh Lead Auditor DPA / BKI
              </p>
            </div>

            <div className="audit-card audit-card-success">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>Total NC Close Selesai</span>
                <CheckCircle2 size={18} color="#10b981" />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem', color: '#10b981' }}>
                {fleetStats.totalClosed} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Temuan Selesai</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                {fleetStats.avgCloseDays > 0 ? (
                  <span>⏱️ Rata-rata Rentang Close: <strong style={{ color: '#10b981' }}>{fleetStats.avgCloseDays} Hari</strong></span>
                ) : (
                  'Kepatuhan terverifikasi dan ditutup resmi'
                )}
              </p>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={17} color="#38bdf8" />
                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Filter Pilihan Kapal Armada:</span>
              </div>
              <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={gatewaySearch}
                  onChange={(e) => setGatewaySearch(e.target.value)}
                  placeholder="Cari nama kapal, call sign, IMO..."
                  className="input-control"
                  style={{ paddingLeft: '2.5rem', fontSize: '0.825rem' }}
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {[
                { id: 'ALL', label: `Semua Armada (${allFleetTargets.length})`, icon: Ship },
                { id: 'HAS_OPEN_NC', label: `🚨 Ada NC Open (${allFleetTargets.filter(t => t.openNC > 0).length})`, icon: AlertTriangle, highlight: true },
                { id: 'HAS_SUBMITTED', label: `⏳ Menunggu Eviden (${allFleetTargets.filter(t => t.submittedNC > 0).length})`, icon: Clock },
                { id: 'CLEAN', label: `✅ Bebas NC Open (${allFleetTargets.filter(t => t.openNC === 0).length})`, icon: CheckCircle2 },
                { id: 'OWNER', label: `⚓ As Owner (${ownerCount})`, icon: Ship },
                { id: 'OPERATOR', label: `⚙️ As Operator (${operatorCount})`, icon: Ship },
                { id: 'OFFICE', label: `🏢 Kantor Pusat DOC`, icon: Building2 }
              ].map(f => {
                const isActive = gatewayFilter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setGatewayFilter(f.id)}
                    className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                    style={{
                      fontSize: '0.76rem',
                      padding: '0.35rem 0.75rem',
                      fontWeight: isActive ? 700 : 500,
                      border: f.highlight && !isActive ? '1px solid rgba(239, 68, 68, 0.4)' : undefined,
                      color: f.highlight && !isActive ? '#ef4444' : undefined
                    }}
                  >
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid of Vessel Cards (Interactive Gateway Cards) */}
          <div className="audit-vessel-grid">
            {filteredGatewayTargets.map(target => {
              const hasOpen = target.openNC > 0;
              const hasSubmitted = target.submittedNC > 0;
              const isClean = target.openNC === 0;

              return (
                <div
                  key={target.id}
                  className={`audit-vessel-card ${hasOpen ? 'has-open-nc' : isClean ? 'is-clean' : ''}`}
                >
                  {/* Card Header: Photo / Badge & Name */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          background: target.type === 'office' ? 'rgba(2, 132, 199, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                          color: target.type === 'office' ? '#0284c7' : '#38bdf8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {target.type === 'office' ? <Building2 size={24} /> : <Ship size={24} />}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
                            {target.name}
                          </h4>
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                            {target.subtitle}
                          </p>
                        </div>
                      </div>

                      <span className={`badge ${target.ownership === 'As Owner' ? 'badge-primary' : target.ownership === 'Head Office' ? 'badge-info' : 'badge-neutral'}`} style={{ fontSize: '0.65rem' }}>
                        {target.ownership}
                      </span>
                    </div>

                    {/* Technical Snapshot */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.4rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      background: 'var(--bg-surface-elevated)',
                      fontSize: '0.72rem',
                      marginBottom: '0.85rem'
                    }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Call Sign: </span>
                        <strong className="mono">{target.callSign}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>IMO / Reg: </span>
                        <strong className="mono">{target.imo}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Tonase: </span>
                        <strong>{target.gt !== '-' ? `${target.gt} GT` : 'Kantor'}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Pelabuhan: </span>
                        <span>{target.portOfRegistry?.split(',')[0]}</span>
                      </div>
                    </div>

                    {/* PROMINENT NOTIS STATUS NC OPEN / NC CLOSE */}
                    <div style={{ marginBottom: '0.5rem' }}>
                      {hasOpen ? (
                        <div style={{
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          background: 'rgba(239, 68, 68, 0.12)',
                          border: '1px solid rgba(239, 68, 68, 0.35)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.55rem'
                        }}>
                          <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span>🚨 NOTIS: {target.openNC} NC OPEN</span>
                              <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.1rem 0.35rem', background: '#ef4444', color: '#fff', borderRadius: '4px' }}>
                                Perlu Tindakan
                              </span>
                            </div>
                            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                              {target.majorNC > 0 && <span style={{ color: '#ef4444', fontWeight: 700 }}>{target.majorNC} Major NC • </span>}
                              {target.minorNC > 0 && <span>{target.minorNC} Minor NC • </span>}
                              Wajib pengajuan eviden perbaikan
                            </p>

                            {/* Rentang Waktu NC Open Terdekat */}
                            {target.timeStats?.mostUrgent && (
                              <div style={{
                                marginTop: '0.4rem',
                                paddingTop: '0.35rem',
                                borderTop: '1px dashed rgba(239, 68, 68, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '0.69rem'
                              }}>
                                <span style={{
                                  color: target.timeStats.mostUrgent.range.color,
                                  fontWeight: 700,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}>
                                  <Clock size={12} />
                                  {target.timeStats.mostUrgent.range.badgeText}
                                </span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
                                  Target: {target.timeStats.mostUrgent.range.dueDateStr}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : hasSubmitted ? (
                        <div style={{
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          background: 'rgba(245, 158, 11, 0.12)',
                          border: '1px solid rgba(245, 158, 11, 0.35)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.55rem'
                        }}>
                          <Clock size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span>⏳ {target.submittedNC} Eviden Menunggu Verifikasi</span>
                              <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.1rem 0.35rem', background: '#f59e0b', color: '#000', borderRadius: '4px' }}>
                                Tinjau
                              </span>
                            </div>
                            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                              Dokumen perbaikan telah dikirim ke Lead Auditor
                            </p>
                            {target.timeStats?.mostUrgent && (
                              <div style={{
                                marginTop: '0.4rem',
                                paddingTop: '0.35rem',
                                borderTop: '1px dashed rgba(245, 158, 11, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '0.69rem'
                              }}>
                                <span style={{ color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <Clock size={12} />
                                  {target.timeStats.mostUrgent.range.badgeText}
                                </span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
                                  Telah aktif {target.timeStats.mostUrgent.range.activeDays} hari
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : target.closedNC > 0 ? (
                        <div style={{
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          background: 'rgba(16, 185, 129, 0.12)',
                          border: '1px solid rgba(16, 185, 129, 0.35)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.55rem'
                        }}>
                          <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span>✅ NOTIS: SELURUH NC CLOSE ({target.closedNC} Selesai)</span>
                              <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.1rem 0.35rem', background: '#10b981', color: '#fff', borderRadius: '4px' }}>
                                Aman
                              </span>
                            </div>
                            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                              Standar SMS & ISM Code telah terpenuhi tuntas
                            </p>
                            {target.timeStats?.avgResolutionDays > 0 && (
                              <div style={{
                                marginTop: '0.4rem',
                                paddingTop: '0.35rem',
                                borderTop: '1px dashed rgba(16, 185, 129, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '0.69rem'
                              }}>
                                <span style={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  ✓ Rata-rata Penutupan: {target.timeStats.avgResolutionDays} Hari
                                </span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
                                  Tuntas Tepat Waktu
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          background: 'rgba(2, 132, 199, 0.08)',
                          border: '1px solid rgba(2, 132, 199, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.55rem'
                        }}>
                          <ShieldCheck size={18} color="#38bdf8" style={{ flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8' }}>
                              🛡️ STATUS AMAN: Bebas NC Open
                            </div>
                            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                              Belum ada temuan ketidaksesuaian terbuka
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Sesi Audit & Action Button */}
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <div>Sesi Terakhir:</div>
                      <strong style={{ color: 'var(--text-main)' }}>
                        {target.lastAudit ? target.lastAudit.auditNo : 'Siap Dijadwalkan'}
                      </strong>
                    </div>

                    <button
                      onClick={() => handleSelectTarget(target.id)}
                      className={`btn btn-sm ${hasOpen ? 'btn-danger' : 'btn-primary'}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        padding: '0.45rem 0.85rem'
                      }}
                    >
                      <span>Masuk Menu Audit</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredGatewayTargets.length === 0 && (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Ship size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Tidak ada kapal yang sesuai filter</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                Coba sesuaikan kata kunci pencarian atau ganti filter kategori.
              </p>
              <button
                onClick={() => {
                  setGatewayFilter('ALL');
                  setGatewaySearch('');
                }}
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '1rem' }}
              >
                Reset Filter
              </button>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* 2. MENU AUDIT MANDIRI KHUSUS KAPAL / ENTITAS (activeTargetId !== null)    */}
      {/* ========================================================================= */}
      {activeTargetId && currentTarget && (
        <>
          {/* Navigation Bar: Back Button & Target Switcher */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            paddingBottom: '0.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => setActiveTargetId(null)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
              >
                <ArrowLeft size={15} />
                <span>← Kembali ke Pemilihan Armada</span>
              </button>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Portal Audit ISM <span style={{ opacity: 0.5 }}>/</span> <strong style={{ color: 'var(--text-main)' }}>{currentTarget.name}</strong>
              </div>
            </div>

            {/* Quick Switcher Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Ganti Kapal:</span>
              <select
                value={activeTargetId}
                onChange={(e) => handleSelectTarget(e.target.value)}
                className="select-control"
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem', width: '250px' }}
              >
                {allFleetTargets.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.openNC > 0 ? `🚨 [${t.openNC} NC] ` : t.submittedNC > 0 ? `⏳ [Eviden] ` : `✅ `}
                    {t.name} ({t.ownership})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dedicated Vessel Hero Header */}
          <div className="glass-card" style={{
            padding: '1.25rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
            background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-elevated) 100%)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: currentTarget.type === 'office' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'linear-gradient(135deg, #0284c7 0%, #0284c7 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
                flexShrink: 0
              }}>
                {currentTarget.type === 'office' ? <Building2 size={30} /> : <Ship size={30} />}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>{currentTarget.name}</h2>
                  <span className={`badge ${currentTarget.ownership === 'As Owner' ? 'badge-primary' : currentTarget.ownership === 'Head Office' ? 'badge-info' : 'badge-neutral'}`}>
                    {currentTarget.ownership}
                  </span>
                  <span className={`badge ${currentTarget.standard === 'DOC' ? 'badge-success' : 'badge-warning'}`}>
                    Standar {currentTarget.standard}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                  <span>Call Sign: <strong className="mono" style={{ color: 'var(--text-main)' }}>{currentTarget.callSign}</strong></span>
                  <span>IMO / Reg: <strong className="mono" style={{ color: 'var(--text-main)' }}>{currentTarget.imo}</strong></span>
                  <span>Tonase: <strong>{currentTarget.gt !== '-' ? `${currentTarget.gt} GT` : 'Kantor Pusat'}</strong></span>
                  <span>Nakhoda: <strong>{currentTarget.nakhoda}</strong></span>
                  <span>KKM: <strong>{currentTarget.kkm}</strong></span>
                </div>
              </div>
            </div>

            {/* Vessel Status Quick Summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.78rem'
              }}>
                <ShieldCheck size={16} color={currentTarget.openNC === 0 ? '#10b981' : '#ef4444'} />
                <span style={{ color: 'var(--text-muted)' }}>Status Kepatuhan:</span>
                <strong style={{ color: currentTarget.openNC === 0 ? '#10b981' : '#ef4444' }}>
                  {currentTarget.openNC === 0 ? 'Bebas NC (Terkendali)' : `${currentTarget.openNC} NC Perlu Tindakan`}
                </strong>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* HIGH-VISIBILITY NOTIS NC OPEN / NC CLOSE BANNER                           */}
          {/* ========================================================================= */}
          <div>
            {currentTarget.openNC > 0 ? (
              <div className="audit-notice-banner audit-notice-open">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div style={{
                    padding: '0.65rem',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'pulse 2s infinite',
                    flexShrink: 0
                  }}>
                    <AlertTriangle size={26} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ef4444' }}>
                        🚨 NOTIS NC OPEN: Ditemukan {currentTarget.openNC} Ketidaksesuaian Terbuka pada {currentTarget.name}!
                      </h4>
                      <span className="badge badge-danger-pulse" style={{ fontSize: '0.68rem' }}>
                        Wajib Tindak Lanjut
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.2rem', opacity: 0.9 }}>
                      Terdapat <strong>{currentTarget.openNC} temuan audit berstatus NC OPEN</strong> ({currentTarget.majorNC} Major NC, {currentTarget.minorNC} Minor NC).
                      Nakhoda, KKM, atau PIC terkait wajib segera mengajukan rencana perbaikan (CAP) dan mengunggah dokumen eviden sebelum batas waktu!
                    </p>

                    {/* Rentang Waktu Highlight Banner */}
                    {currentTarget.timeStats?.mostUrgent && (
                      <div style={{
                        marginTop: '0.65rem',
                        padding: '0.55rem 0.85rem',
                        borderRadius: '8px',
                        background: currentTarget.timeStats.mostUrgent.range.bgLight,
                        border: `1px solid ${currentTarget.timeStats.mostUrgent.range.borderColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        fontSize: '0.78rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={16} color={currentTarget.timeStats.mostUrgent.range.color} />
                          <span>
                            <strong>Batas Target Terdekat ({currentTarget.timeStats.mostUrgent.finding.findingNo}): </strong>
                            Rentang {currentTarget.timeStats.mostUrgent.range.openDateStr} s/d {currentTarget.timeStats.mostUrgent.range.dueDateStr}
                            {' '}(Telah aktif {currentTarget.timeStats.mostUrgent.range.activeDays} hari)
                          </span>
                        </div>
                        <span className={`badge ${currentTarget.timeStats.mostUrgent.range.badgeClass}`} style={{ fontSize: '0.72rem', fontWeight: 800 }}>
                          {currentTarget.timeStats.mostUrgent.range.badgeText}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                  <button
                    onClick={() => {
                      const targetFinding = currentTarget.timeStats?.mostUrgent?.finding || currentTarget.findings.find(f => f.status === 'NC Open');
                      if (targetFinding) setNotificationModalFinding(targetFinding);
                    }}
                    className="btn btn-whatsapp btn-sm"
                    style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <MessageSquare size={14} />
                    <span>Kirim Notif WA</span>
                  </button>
                  <button
                    onClick={() => {
                      setVesselTab('findings');
                      setStatusFilter('NC Open');
                    }}
                    className="btn btn-danger btn-sm"
                    style={{ fontWeight: 700 }}
                  >
                    Lihat Temuan NC Open ({currentTarget.openNC})
                  </button>
                </div>
              </div>
            ) : currentTarget.submittedNC > 0 ? (
              <div className="audit-notice-banner audit-notice-submitted">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div style={{
                    padding: '0.65rem',
                    borderRadius: '50%',
                    background: 'rgba(245, 158, 11, 0.2)',
                    color: '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Clock size={26} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f59e0b' }}>
                      ⏳ NOTIS VERIFIKASI: {currentTarget.submittedNC} Dokumen Eviden Menunggu Tinjauan Auditor!
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.2rem', opacity: 0.9 }}>
                      Pihak auditee kapal telah mengunggah eviden perbaikan tindakan korektif. Lead Auditor wajib memverifikasi keabsahan bukti untuk mengubah status menjadi <strong>NC CLOSE</strong>.
                    </p>

                    {currentTarget.timeStats?.mostUrgent && (
                      <div style={{
                        marginTop: '0.65rem',
                        padding: '0.55rem 0.85rem',
                        borderRadius: '8px',
                        background: 'rgba(245, 158, 11, 0.12)',
                        border: '1px solid rgba(245, 158, 11, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        fontSize: '0.78rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={16} color="#f59e0b" />
                          <span>
                            <strong>Eviden ({currentTarget.timeStats.mostUrgent.finding.findingNo}): </strong>
                            Diajukan & menunggu verifikasi (Telah berjalan {currentTarget.timeStats.mostUrgent.range.activeDays} hari sejak audit)
                          </span>
                        </div>
                        <span className="badge badge-warning" style={{ fontSize: '0.72rem', fontWeight: 800 }}>
                          Menunggu Tinjauan
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                  <button
                    onClick={() => {
                      const targetFinding = currentTarget.findings.find(f => f.status === 'Eviden Submitted');
                      if (targetFinding) setNotificationModalFinding(targetFinding);
                    }}
                    className="btn btn-whatsapp btn-sm"
                    style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <MessageSquare size={14} />
                    <span>Kirim Notif WA</span>
                  </button>
                  <button
                    onClick={() => {
                      setVesselTab('findings');
                      setStatusFilter('Eviden Submitted');
                    }}
                    className="btn btn-warning btn-sm"
                    style={{ fontWeight: 700 }}
                  >
                    Tinjau Eviden Masuk
                  </button>
                </div>
              </div>
            ) : currentTarget.closedNC > 0 ? (
              <div className="audit-notice-banner audit-notice-closed">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div style={{
                    padding: '0.65rem',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <CheckCircle2 size={26} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10b981' }}>
                      ✅ NOTIS NC CLOSE: Seluruh Temuan Audit Telah Diverifikasi & Berstatus CLOSED!
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.2rem', opacity: 0.9 }}>
                      Seluruh temuan audit pada <strong>{currentTarget.name}</strong> ({currentTarget.closedNC} NC Close) telah dinyatakan efektif dan memenuhi ketentuan ISM Code IMO & regulasi BKI.
                    </p>

                    {/* Rentang Waktu Penutupan Summary */}
                    {currentTarget.timeStats?.avgResolutionDays > 0 && (
                      <div style={{
                        marginTop: '0.65rem',
                        padding: '0.55rem 0.85rem',
                        borderRadius: '8px',
                        background: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        fontSize: '0.78rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <CheckCircle2 size={16} color="#10b981" />
                          <span>
                            <strong>Rata-rata Rentang Waktu Penutupan (Lead Time Close): </strong>
                            Seluruh temuan diselesaikan rata-rata dalam <strong>{currentTarget.timeStats.avgResolutionDays} Hari</strong> sejak tanggal audit dibuka.
                          </span>
                        </div>
                        <span className="badge badge-success" style={{ fontSize: '0.72rem', fontWeight: 800 }}>
                          ✓ Kepatuhan Tuntas
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                  <button
                    onClick={() => {
                      const closedFinding = currentTarget.findings.find(f => f.status === 'NC Close');
                      if (closedFinding) setNotificationModalFinding(closedFinding);
                    }}
                    className="btn btn-whatsapp btn-sm"
                    style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <MessageSquare size={14} />
                    <span>Laporan WA NC Close</span>
                  </button>
                  <span className="badge badge-success" style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}>
                    100% Compliant
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          {/* ========================================================================= */}
          {/* ALUR KERJA TERPADU: LIFECYCLE STEPPER 5 TAHAP AUDIT MARITIM              */}
          {/* ========================================================================= */}
          <div className="glass-card" style={{
            padding: '1rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            background: 'linear-gradient(135deg, var(--bg-surface-card) 0%, var(--bg-surface-elevated) 100%)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px'
          }}>
            {/* Header Stepper & Active Session Indicator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtle)' }}>
                  Alur Siklus Audit ISM (Lifecycle)
                </span>
                {activeSession ? (
                  <span className="badge badge-info mono" style={{ fontSize: '0.72rem', fontWeight: 800 }}>
                    Sesi Aktif: {activeSession.auditNo} ({activeSession.status})
                  </span>
                ) : (
                  <span className="badge badge-warning" style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                    Belum Ada Sesi Aktif
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {/* Role Switcher Pill */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '2px',
                  gap: '2px'
                }}>
                  <button
                    type="button"
                    onClick={() => setAuditRolePerspective('dpa')}
                    style={{
                      border: 'none',
                      background: auditRolePerspective === 'dpa' ? '#0284c7' : 'transparent',
                      color: auditRolePerspective === 'dpa' ? '#ffffff' : 'var(--text-muted)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.25rem 0.55rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      transition: 'all 0.15s ease'
                    }}
                    title="Aktifkan sudut pandang DPA (Kantor Darat): Perencanaan, Evaluasi Temuan, Otorisasi CAPA, dan Deklarasi Kelaiklautan"
                  >
                    <Building2 size={12} />
                    <span>DPA (Darat)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuditRolePerspective('nakhoda')}
                    style={{
                      border: 'none',
                      background: auditRolePerspective === 'nakhoda' ? '#10b981' : 'transparent',
                      color: auditRolePerspective === 'nakhoda' ? '#ffffff' : 'var(--text-muted)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.25rem 0.55rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      transition: 'all 0.15s ease'
                    }}
                    title="Aktifkan sudut pandang Nakhoda (Kapal Onboard): Auditee Resmi, Pendampingan Checklist, Eksekusi Perbaikan & Kirim Eviden Foto"
                  >
                    <Ship size={12} />
                    <span>Nakhoda (Kapal)</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRoleFlowModal(true)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: '#8b5cf6',
                    borderColor: 'rgba(139, 92, 246, 0.35)',
                    background: 'rgba(139, 92, 246, 0.08)'
                  }}
                  title="Lihat bagan perbandingan alur kerja DPA vs Nakhoda dan Matriks RACI"
                >
                  <Compass size={13} />
                  <span>Alur DPA & Nakhoda</span>
                </button>

                {!activeSession && (
                  <button
                    type="button"
                    onClick={handleQuickLaunchSession}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 800 }}
                  >
                    <Play size={13} fill="currentColor" />
                    <span>Mulai Sesi Cepat</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleLoadSampleSMCAudit}
                  className="btn btn-secondary btn-sm"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: '#0284c7',
                    borderColor: 'rgba(2, 132, 199, 0.4)',
                    background: 'rgba(2, 132, 199, 0.08)'
                  }}
                  title="Muat contoh simulasi lengkap audit SMC (Sesi BKI, 74 checklist terisi, temuan NC 10.3, dan CAPA)"
                >
                  <Sparkles size={13} />
                  <span>Contoh SMC</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVesselTab('integrations')}
                  className={`btn btn-sm ${vesselTab === 'integrations' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  title="Sertifikat Statutori & Permintaan Suku Cadang Terkait"
                >
                  <Package size={13} />
                  <span>Sertifikat & Logistik ({currentTargetCertificates.length + currentTargetRequisitions.length})</span>
                </button>
              </div>
            </div>

            {/* Visual Stepper 5 Tahap */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.65rem'
            }}>
              {[
                {
                  id: 'sessions',
                  step: 1,
                  title: '1. Sesi & Tim',
                  desc: activeSession ? `${activeSession.status} • ${activeSession.auditType}` : 'Inisiasi / Riwayat Sesi',
                  icon: ShieldCheck,
                  badge: currentTarget.audits.length > 0 ? `${currentTarget.audits.length} Sesi` : 'Baru'
                },
                {
                  id: 'checklist',
                  step: 2,
                  title: '2. Checklist Klausul',
                  desc: `${checklistProgress.answered}/${checklistProgress.total} Butir (${checklistProgress.percent}%)`,
                  icon: FileCheck,
                  badge: checklistProgress.percent === 100 ? '100% Selesai' : `${checklistProgress.percent}%`
                },
                {
                  id: 'findings',
                  step: 3,
                  title: '3. Temuan NC',
                  desc: currentTarget.openNC > 0 ? `${currentTarget.openNC} NC Belum Tuntas` : 'Bebas Temuan Open',
                  icon: AlertTriangle,
                  badge: currentTarget.openNC > 0 ? `${currentTarget.openNC} NC Open` : '0 Open',
                  alert: currentTarget.openNC > 0
                },
                {
                  id: 'capa',
                  step: 4,
                  title: '4. Bukti & CAPA',
                  desc: currentTarget.submittedNC > 0 ? `${currentTarget.submittedNC} Siap Verifikasi` : `${currentTarget.closedNC} NC Closed`,
                  icon: Upload,
                  badge: currentTarget.submittedNC > 0 ? `${currentTarget.submittedNC} Review` : 'Monitoring'
                },
                {
                  id: 'reporting',
                  step: 5,
                  title: '5. Penutupan & Cetak',
                  desc: 'Signoff & Hub Laporan PDF',
                  icon: Printer,
                  badge: 'Cetak Dokumen'
                }
              ].map(st => {
                const Icon = st.icon;
                const isActive = vesselTab === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      setVesselTab(st.id);
                      if (st.id === 'findings') setStatusFilter('ALL');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: isActive ? '2px solid #0284c7' : '1px solid var(--border-subtle)',
                      background: isActive ? 'rgba(2, 132, 199, 0.12)' : 'var(--bg-surface-elevated)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: isActive ? '#0284c7' : 'var(--bg-surface)',
                      color: isActive ? '#fff' : 'var(--text-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.825rem',
                      flexShrink: 0
                    }}>
                      <Icon size={16} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.3rem' }}>
                        <strong style={{ fontSize: '0.8rem', color: isActive ? '#38bdf8' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {st.title}
                        </strong>
                        {st.badge && (
                          <span className={`badge ${st.alert ? 'badge-danger-pulse' : 'badge-neutral'}`} style={{ fontSize: '0.6rem', padding: '0.05rem 0.35rem' }}>
                            {st.badge}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '0.1rem' }}>
                        {st.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Contextual Role Guidance Ribbon */}
            <div style={{
              marginTop: '0.75rem',
              padding: '0.65rem 0.95rem',
              borderRadius: '8px',
              background: auditRolePerspective === 'dpa'
                ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.09), rgba(2, 132, 199, 0.02))'
                : 'linear-gradient(135deg, rgba(16, 185, 129, 0.09), rgba(16, 185, 129, 0.02))',
              border: auditRolePerspective === 'dpa'
                ? '1px solid rgba(2, 132, 199, 0.3)'
                : '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: '280px' }}>
                <div style={{
                  padding: '0.3rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  background: auditRolePerspective === 'dpa' ? '#0284c7' : '#10b981',
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  flexShrink: 0
                }}>
                  {auditRolePerspective === 'dpa' ? <Building2 size={13} /> : <Ship size={13} />}
                  <span>{auditRolePerspective === 'dpa' ? 'FOKUS TUGAS DPA' : 'TANGGUNG JAWAB NAKHODA'}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: '1.45' }}>
                  {getRoleGuidance(vesselTab, auditRolePerspective)}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => setShowRoleFlowModal(true)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.3rem 0.65rem'
                  }}
                  title="Buka panduan lengkap alur DPA, Nakhoda, dan matriks RACI"
                >
                  <BookOpen size={12} />
                  <span>Pelajari Alur Lengkap</span>
                </button>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* TAB 1: TEMUAN NC KAPAL INI                                            */}
          {/* ===================================================================== */}
          {vesselTab === 'findings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Filter Row inside findings */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button
                    onClick={() => setStatusFilter('ALL')}
                    className={`btn btn-sm ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem' }}
                  >
                    Semua ({currentTarget.findings.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('NC Open')}
                    className={`btn btn-sm ${statusFilter === 'NC Open' ? 'btn-danger' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem', fontWeight: 700 }}
                  >
                    🚨 NC Open ({currentTarget.openNC})
                  </button>
                  <button
                    onClick={() => setStatusFilter('Eviden Submitted')}
                    className={`btn btn-sm ${statusFilter === 'Eviden Submitted' ? 'btn-warning' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem' }}
                  >
                    ⏳ Menunggu Eviden ({currentTarget.submittedNC})
                  </button>
                  <button
                    onClick={() => setStatusFilter('NC Close')}
                    className={`btn btn-sm ${statusFilter === 'NC Close' ? 'btn-success' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem' }}
                  >
                    ✅ NC Close ({currentTarget.closedNC})
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="select-control"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
                  >
                    <option value="ALL">Semua Severity</option>
                    <option value="Major NC">Major NC</option>
                    <option value="Minor NC">Minor NC</option>
                    <option value="Observation">Observasi</option>
                  </select>

                  <input
                    type="text"
                    value={inVesselSearch}
                    onChange={(e) => setInVesselSearch(e.target.value)}
                    placeholder="Cari klausul / temuan..."
                    className="input-control"
                    style={{ width: '180px', fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setEditingFinding(null);
                      setFindingDefaultAuditId(activeSession?.id || currentTarget.lastAudit?.id || null);
                      setFindingModalOpen(true);
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700 }}
                    title="Catat temuan ketidaksesuaian baru untuk kapal ini"
                  >
                    <Plus size={14} />
                    <span>Catat Temuan NC</span>
                  </button>
                </div>
              </div>

              {/* Findings List */}
              {currentTargetFilteredFindings.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {currentTargetFilteredFindings.map(f => {
                    const isOpen = f.status === 'NC Open';
                    const isSubmitted = f.status === 'Eviden Submitted';
                    const isClosed = f.status === 'NC Close';

                    return (
                      <div
                        key={f.id}
                        className={`audit-finding-item ${isOpen ? 'status-open' : isSubmitted ? 'status-submitted' : 'status-closed'}`}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <span className="mono" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                              {f.findingNo}
                            </span>
                            <span className={`badge ${
                              f.category === 'Major NC' ? 'badge-danger' : f.category === 'Minor NC' ? 'badge-warning' : 'badge-info'
                            }`}>
                              {f.category}
                            </span>
                            <span className={`badge ${
                              isOpen ? 'badge-danger-pulse' : isSubmitted ? 'badge-warning' : 'badge-success'
                            }`}>
                              {f.status}
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                            {/* Evidence / Action Button */}
                            <button
                              onClick={() => {
                                setEvidenceTargetFinding(f);
                                setEvidenceModalOpen(true);
                              }}
                              className={`btn btn-sm ${isOpen ? 'btn-primary' : isSubmitted ? 'btn-warning' : 'btn-secondary'}`}
                              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700 }}
                            >
                              <Upload size={13} />
                              <span>{isClosed ? 'Lihat Eviden Closing' : isSubmitted ? 'Tinjau Eviden' : 'Ajukan Eviden (CAP)'}</span>
                            </button>

                            {/* WhatsApp Notification Button */}
                            <button
                              onClick={() => setNotificationModalFinding(f)}
                              className="btn btn-secondary btn-sm"
                              title={isOpen ? 'Kirim Notifikasi WA (NC Open)' : 'Kirim Notifikasi WA (NC Close)'}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                fontSize: '0.72rem',
                                color: '#16a34a',
                                fontWeight: 700,
                                padding: '0.35rem 0.55rem'
                              }}
                            >
                              <MessageSquare size={13} color="#22c55e" />
                              <span>Notif WA</span>
                            </button>

                            {/* Official Print Report Button */}
                            <button
                              onClick={() => {
                                setReportModalSession(null);
                                setReportModalFinding(f);
                                setReportModalMode('ncr');
                                setReportModalOpen(true);
                              }}
                              className="btn btn-secondary btn-sm"
                              title={isClosed ? 'Cetak Lembar Verifikasi Penutupan NC Resmi (NCR Close-Out Form)' : 'Cetak Laporan Temuan & Rencana Koreksi (CAP)'}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                fontSize: '0.72rem',
                                color: isClosed ? '#0284c7' : 'var(--text-main)',
                                fontWeight: 700,
                                padding: '0.35rem 0.55rem'
                              }}
                            >
                              <Printer size={13} color={isClosed ? '#0284c7' : 'currentColor'} />
                              <span>{isClosed ? 'Cetak NCR Close' : 'Cetak NCR'}</span>
                            </button>

                            <button
                              onClick={() => {
                                setEditingFinding(f);
                                setFindingModalOpen(true);
                              }}
                              className="btn btn-secondary btn-sm"
                              title="Edit Temuan"
                              style={{ padding: '0.35rem 0.5rem' }}
                            >
                              <Edit size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmModal({
                                  type: 'finding',
                                  id: f.id || f.findingNo,
                                  code: f.findingNo,
                                  title: 'Hapus Catatan Temuan (NCR)',
                                  targetName: currentTarget?.name,
                                  details: `Catatan temuan ketidaksesuaian "${f.findingNo}" (${f.category}) akan dihapus permanen dari sistem beserta dokumen eviden yang terlampir.`,
                                  onConfirm: () => {
                                    deleteAuditFinding(f.id || f.findingNo);
                                    setDeleteConfirmModal(null);
                                  }
                                });
                              }}
                              className="btn btn-secondary btn-sm"
                              title="Hapus Temuan Ini"
                              style={{ padding: '0.35rem 0.5rem', color: '#ef4444' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Finding Content */}
                        <div>
                          <div style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 700, marginBottom: '0.25rem' }}>
                            Klausul {f.clauseCode}: {f.clauseName}
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                            {f.description}
                          </p>
                          {f.objectiveEvidence && (
                            <div style={{
                              marginTop: '0.45rem',
                              padding: '0.45rem 0.75rem',
                              borderRadius: '6px',
                              background: 'var(--bg-surface-elevated)',
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)'
                            }}>
                              <strong>Bukti Objektif: </strong>{f.objectiveEvidence}
                            </div>
                          )}
                        </div>

                        {/* TIMELINE RENTANG WAKTU NC OPEN / NC CLOSE */}
                        {(() => {
                          const ncRange = calculateNCRange(f);
                          if (!ncRange) return null;

                          return (
                            <div style={{
                              margin: '0.45rem 0',
                              padding: '0.65rem 0.85rem',
                              borderRadius: '8px',
                              background: ncRange.bgLight,
                              border: `1px solid ${ncRange.borderColor}`,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.45rem'
                            }}>
                              {/* Header Rentang */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.76rem', fontWeight: 700 }}>
                                  {ncRange.isClosed ? (
                                    <>
                                      <CheckCircle2 size={15} color="#10b981" />
                                      <span style={{ color: '#10b981' }}>RENTANG WAKTU PENUTUPAN (NC CLOSE)</span>
                                    </>
                                  ) : (
                                    <>
                                      <Clock size={15} color={ncRange.color} />
                                      <span style={{ color: ncRange.color }}>
                                        RENTANG WAKTU AKTIF ({ncRange.isSubmitted ? 'EVIDEN DITINJAU' : 'NC OPEN'})
                                      </span>
                                    </>
                                  )}
                                </div>
                                <span className={`badge ${ncRange.badgeClass}`} style={{ fontSize: '0.7rem', fontWeight: 800 }}>
                                  {ncRange.badgeText}
                                </span>
                              </div>

                              {/* Progress Bar Timeline */}
                              <div style={{
                                width: '100%',
                                height: '6px',
                                borderRadius: '3px',
                                background: 'rgba(255, 255, 255, 0.15)',
                                overflow: 'hidden',
                                position: 'relative'
                              }}>
                                <div style={{
                                  width: `${ncRange.percentUsed}%`,
                                  height: '100%',
                                  background: ncRange.color,
                                  borderRadius: '3px',
                                  transition: 'width 0.3s ease'
                                }} />
                              </div>

                              {/* Date markers & variance info */}
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '0.5rem',
                                fontSize: '0.72rem',
                                color: 'var(--text-muted)'
                              }}>
                                <div>
                                  <span>Tgl Identifikasi (Open): </span>
                                  <strong style={{ color: 'var(--text-main)' }}>{ncRange.openDateStr}</strong>
                                </div>

                                {ncRange.isClosed ? (
                                  <>
                                    <div>
                                      <span>Tgl Penutupan Resmi (Close): </span>
                                      <strong style={{ color: '#10b981' }}>{ncRange.closedDateStr}</strong>
                                    </div>
                                    <div style={{ color: ncRange.isAheadOfSchedule ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                                      ⚡ {ncRange.varianceText} (Total: {ncRange.resolutionDays} Hari)
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div>
                                      <span>Target Batas Close (Due Date): </span>
                                      <strong style={{ color: ncRange.isOverdue ? '#ef4444' : 'var(--text-main)' }}>
                                        {ncRange.dueDateStr}
                                      </strong>
                                    </div>
                                    <div style={{ color: ncRange.color, fontWeight: 700 }}>
                                      {ncRange.isOverdue
                                        ? `🚨 Terlambat ${Math.abs(ncRange.remainingDays)} hari dari target awal`
                                        : `⏳ Telah berjalan ${ncRange.activeDays} dari alokasi ${ncRange.totalAllocatedDays} hari`}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Finding Footer Metas */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.75rem',
                          paddingTop: '0.5rem',
                          borderTop: '1px solid var(--border-subtle)',
                          fontSize: '0.72rem',
                          color: 'var(--text-muted)'
                        }}>
                          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <span>PIC: <strong style={{ color: 'var(--text-main)' }}>{f.assignedTo || 'PIC Kapal'}</strong></span>
                            <span>Auditor: <strong>{f.auditor}</strong></span>
                            <span>Tgl Audit: {formatIndoDate(f.dateIdentified)}</span>
                            <span>Batas Waktu: <strong style={{ color: isOpen ? '#ef4444' : 'inherit' }}>{formatIndoDate(f.dueDate)}</strong></span>
                          </div>
                          {f.linkedCertificateTitle && (
                            <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                              📄 {f.linkedCertificateTitle}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="glass-card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                  <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 0.65rem' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Tidak ada temuan ketidaksesuaian</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {statusFilter !== 'ALL'
                      ? `Tidak ada temuan dengan status "${statusFilter}".`
                      : `Seluruh parameter kepatuhan pada ${currentTarget.name} terpenuhi.`}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 2: SESI AUDIT KAPAL INI                                           */}
          {/* ===================================================================== */}
          {vesselTab === 'sessions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Tahap 1: Inisiasi & Riwayat Sesi Audit Resmi: {currentTarget.name}</h4>
                <button
                  onClick={() => {
                    setEditingSession(null);
                    setSessionModalOpen(true);
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
                >
                  <Plus size={14} />
                  <span>+ Buat Sesi Baru (Tahap 1)</span>
                </button>
              </div>

              {/* Active Session Workspace Card */}
              {activeSession && (
                <div
                  className="glass-card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderRadius: '12px',
                    border: '1.5px solid #0284c7',
                    background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.1) 0%, rgba(15, 23, 42, 0.7) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    boxShadow: '0 8px 24px rgba(2, 132, 199, 0.15)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: 'rgba(2, 132, 199, 0.2)',
                        border: '1px solid rgba(2, 132, 199, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#38bdf8',
                        flexShrink: 0
                      }}>
                        <ShieldCheck size={26} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#38bdf8' }}>
                            Sesi Audit Aktif (Tahap 1 Terkonfirmasi)
                          </span>
                          <span className={`badge ${activeSession.status === 'Completed' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.68rem' }}>
                            {activeSession.status}
                          </span>
                        </div>
                        <h3 className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.2rem 0', color: '#f8fafc' }}>
                          {activeSession.auditNo}
                        </h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                          Standar: <strong>{activeSession.standard}</strong> • Jenis: <strong>{activeSession.auditType}</strong> • Target: <strong>{activeSession.targetName || currentTarget.name}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons to seamlessly continue through Stages 2-5 */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <button
                        onClick={() => setVesselTab('checklist')}
                        className="btn btn-primary btn-sm"
                        style={{
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          padding: '0.5rem 1rem',
                          background: '#0284c7',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)'
                        }}
                        title="Buka Tahap 2: Checklist Klausul untuk sesi ini"
                      >
                        <FileCheck size={16} />
                        <span>📋 Lanjut ke 2. Checklist Klausul ➔</span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingSession(activeSession);
                          setSessionModalOpen(true);
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          padding: '0.5rem 0.85rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                        title="Edit data sesi dan tim (Tahap 1)"
                      >
                        <Edit size={14} />
                        <span>✏️ Edit Sesi & Tim</span>
                      </button>

                      <button
                        onClick={() => {
                          setReportModalSession(activeSession);
                          setReportModalMode('full');
                          setReportModalOpen(true);
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          padding: '0.5rem 0.85rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          color: '#38bdf8'
                        }}
                        title="Cetak Laporan Audit Resmi A4 / PDF"
                      >
                        <Printer size={14} />
                        <span>🖨️ Cetak Laporan</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary metadata grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '0.85rem',
                    background: 'var(--bg-surface-elevated)',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.75rem'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>Lead Auditor:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{activeSession.leadAuditor || '-'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>Auditee / Wakil:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{activeSession.auditee || '-'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>Tanggal Pelaksanaan:</span>
                      <strong className="mono" style={{ color: 'var(--text-main)' }}>{activeSession.auditDate || '-'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>Klausul Diperiksa:</span>
                      <strong style={{ color: '#10b981' }}>
                        {activeSession.checklist?.filter(c => c.result)?.length || activeSession.itemsComplied || 0} / {activeSession.checklist?.length || (activeSession.standard === 'DOC' ? 13 : 74)} Klausul
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {currentTarget.audits.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1rem' }}>
                  {currentTarget.audits.map(s => (
                    <div key={s.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.75rem' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <span className="mono" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0284c7' }}>
                            {s.auditNo}
                          </span>
                          <span className={`badge ${s.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                            {s.status}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.6rem' }}>
                          <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                            {s.auditType} PBK
                          </span>
                          <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                            Standar {s.standard}
                          </span>
                        </div>

                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '0.6rem' }}>
                          {s.scope || 'Evaluasi kepatuhan operasional kapal sesuai IMO ISM Code.'}
                        </p>

                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <div>Lead Auditor: <strong style={{ color: 'var(--text-main)' }}>{s.leadAuditor}</strong></div>
                          <div>Auditee: <strong>{s.auditee}</strong></div>
                          <div>Pelaksanaan: {s.auditDate} • Target Close: {s.targetCloseDate}</div>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.75rem' }}>
                          Kepatuhan: <strong style={{ color: '#10b981' }}>{s.totalItemsChecked ? Math.round((s.itemsComplied / s.totalItemsChecked) * 100) : 100}%</strong>
                        </div>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            onClick={() => setVesselTab('checklist')}
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
                            title="Buka checklist butir klausul untuk sesi audit ini"
                          >
                            <FileCheck size={13} />
                            <span>Buka Checklist</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingSession(s);
                              setSessionModalOpen(true);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                            title="Edit data sesi audit"
                          >
                            <Edit size={12} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmModal({
                                type: 'session',
                                id: s.id || s.auditNo,
                                code: s.auditNo,
                                title: 'Hapus Sesi Audit Resmi',
                                targetName: currentTarget?.name,
                                details: `Sesi audit "${s.auditNo}" (${s.standard} - ${s.auditType}) akan dihapus dari data sistem armada kapal ${currentTarget?.name}. Seluruh ringkasan checklist dan temuan terkait sesi ini akan dibersihkan.`,
                                onConfirm: () => {
                                  deleteAuditSession(s.id || s.auditNo);
                                  setDeleteConfirmModal(null);
                                }
                              });
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.3rem 0.5rem', color: '#ef4444' }}
                            title="Hapus Sesi Audit Ini"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                  <ShieldCheck size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.65rem' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Belum ada sesi audit tercatat untuk kapal ini</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Klik tombol di bawah untuk membuat sesi audit baru (Tahap 1: Setup Sesi & Tim), kemudian lanjutkan pemeriksaan klausul di Dashboard Tahap 2.
                  </p>
                  <button
                    onClick={() => {
                      setEditingSession(null);
                      setSessionModalOpen(true);
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
                  >
                    <Plus size={14} />
                    <span>Buat Sesi Audit Baru (Tahap 1)</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 3: CHECKLIST ISM & INPUT MANUAL                                  */}
          {/* ===================================================================== */}
          {vesselTab === 'checklist' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    {isBKIOrganization(activeChecklistConfig.organizationId) || activeChecklistConfig.organizationId === 'internal' ? (
                      <>
                        <span>Checklist {activeChecklistConfig.organizationId === 'internal' ? 'Audit Internal' : 'Resmi BKI'} ({currentTarget.standard === 'DOC' ? 'DOC Rev 06' : 'SMS Shipboard Rev 05'})</span>
                        <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>Standar BKI ({currentTarget.standard === 'DOC' ? '13 Seksi' : '74 Butir'})</span>
                      </>
                    ) : (
                      <>
                        <span>Checklist Audit {activeChecklistConfig.organizationName}</span>
                        <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>Format Mandiri (Non-BKI)</span>
                      </>
                    )}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {isBKIOrganization(activeChecklistConfig.organizationId) || activeChecklistConfig.organizationId === 'internal'
                      ? (currentTarget.standard === 'DOC'
                          ? 'Pemeriksaan kepatuhan kantor pusat PT. PBK mengadopsi standar resmi BKI F23.14.05-2025 Rev 06 (13 seksi ISM Code).'
                          : `Pemeriksaan komprehensif seluruh area operasional kapal ${currentTarget.name} mengadopsi standar BKI F23.14.06-2024 Rev 05 (74 butir checklist).`)
                      : `Format checklist pemeriksaan untuk ${activeChecklistConfig.organizationName} disesuaikan secara mandiri. Template resmi BKI dipisahkan agar tidak terpakai oleh lembaga ini.`}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      setReportModalSession(currentTarget.lastAudit || {
                        id: 'checklist-print',
                        auditNo: `AUD-SMC-${currentTarget.name.replace(/\s+/g, '')}-2026`,
                        auditType: 'Internal',
                        standard: currentTarget.standard,
                        targetName: currentTarget.name,
                        vesselId: currentTarget.id,
                        leadAuditor: 'Capt. Ahmad Fauzi (Marine Safety Inspector)',
                        auditDate: new Date().toISOString().split('T')[0]
                      });
                      setReportModalFinding(null);
                      setReportModalMode('checklist');
                      setReportModalOpen(true);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#0284c7' }}
                    title={isBKIOrganization(activeChecklistConfig.organizationId)
                      ? "Cetak Formulir Resmi BKI SMS Shipboard Checklist Rev 05 format A4 / PDF"
                      : `Cetak Formulir Checklist Audit ${activeChecklistConfig.organizationName}`}
                  >
                    <Printer size={14} />
                    <span>Cetak Checklist (PDF)</span>
                  </button>

                  <button
                    onClick={() => setShowManualCodeForm(!showManualCodeForm)}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
                  >
                    <Plus size={14} />
                    <span>{showManualCodeForm ? 'Tutup Form' : 'Tambah Item Manual'}</span>
                  </button>
                </div>
              </div>

              {/* Checklist Filter Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {(() => {
                  const activeNonDeleted = activeChecklistItems.filter(el => !vesselDeletedCodes.includes(el.code));
                  const customNonDeleted = customChecklistItems.filter(el => !vesselDeletedCodes.includes(el.code));
                  const allTargetItems = [...customNonDeleted, ...activeNonDeleted];

                  const struckCount = allTargetItems.filter(el =>
                    vesselStrikethroughOverrides[el.code] !== undefined
                      ? vesselStrikethroughOverrides[el.code]
                      : Boolean(el.isStrikethrough)
                  ).length;
                  const activeCount = allTargetItems.length - struckCount;

                  const yesCount = allTargetItems.filter(el => {
                    const isStriked = vesselStrikethroughOverrides[el.code] !== undefined
                      ? vesselStrikethroughOverrides[el.code]
                      : Boolean(el.isStrikethrough);
                    const res = vesselChecklistResults[el.code] !== undefined
                      ? vesselChecklistResults[el.code]
                      : (isStriked ? 'N/A' : (el.result || 'Complied'));
                    return !isStriked && (res === 'Complied' || res === 'Yes');
                  }).length;

                  const noCount = allTargetItems.filter(el => {
                    const isStriked = vesselStrikethroughOverrides[el.code] !== undefined
                      ? vesselStrikethroughOverrides[el.code]
                      : Boolean(el.isStrikethrough);
                    const res = vesselChecklistResults[el.code] !== undefined
                      ? vesselChecklistResults[el.code]
                      : (isStriked ? 'N/A' : (el.result || 'Complied'));
                    return !isStriked && ['Minor NC', 'Major NC', 'Observation', 'No'].includes(res);
                  }).length;

                  const naCount = allTargetItems.filter(el => {
                    const isStriked = vesselStrikethroughOverrides[el.code] !== undefined
                      ? vesselStrikethroughOverrides[el.code]
                      : Boolean(el.isStrikethrough);
                    const res = vesselChecklistResults[el.code] !== undefined
                      ? vesselChecklistResults[el.code]
                      : (isStriked ? 'N/A' : (el.result || 'Complied'));
                    return isStriked || res === 'N/A';
                  }).length;

                  return [
                    { id: 'ALL', label: `Semua Elemen (${allTargetItems.length})` },
                    { id: 'CORE', label: `Klausul Aktif (${activeCount})` },
                    { id: 'STRIKETHROUGH', label: `Klausul Dicoret (${struckCount})` },
                    { id: 'YES', label: `Yes (${yesCount})` },
                    { id: 'NO', label: `No / NC (${noCount})` },
                    { id: 'NA', label: `N/A (${naCount})` },
                    { id: 'HAS_EVIDENCE', label: `Memiliki Bukti (${Object.keys(checklistEvidenceMap).length})` }
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setVesselChecklistFilter(f.id)}
                      className={`btn btn-sm ${vesselChecklistFilter === f.id ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem' }}
                    >
                      {f.label}
                    </button>
                  ));
                })()}
              </div>

              {/* Form Input Item Audit Manual */}
              {showManualCodeForm && (
                <form onSubmit={handleAddManualChecklistItem} className="glass-card" style={{ padding: '1.25rem', border: '1px solid #0284c7', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Plus size={16} />
                    <span>Input Item Audit Manual untuk {currentTarget.name}:</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Kode Klausul Kustom *
                      </label>
                      <input
                        type="text"
                        required
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        placeholder="cth: SMC-KAPAL-01 / ISM-10.5"
                        className="input-control mono"
                        style={{ fontWeight: 700 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Nama Klausul / Area Inspeksi *
                      </label>
                      <input
                        type="text"
                        required
                        value={manualName}
                        onChange={(e) => setManualName(e.target.value)}
                        placeholder="cth: Pemeriksaan Generator Darurat & Quick Closing Valve"
                        className="input-control"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Hasil Evaluasi
                      </label>
                      <select
                        value={manualStatus}
                        onChange={(e) => setManualStatus(e.target.value)}
                        className="select-control"
                      >
                        <option value="Complied">Complied (Sesuai / Yes)</option>
                        <option value="Observation">Observasi</option>
                        <option value="Minor NC">Minor NC (No)</option>
                        <option value="Major NC">Major NC (No)</option>
                        <option value="N/A">N/A (Tidak Berlaku)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Kriteria Pemeriksaan
                      </label>
                      <input
                        type="text"
                        value={manualCriteria}
                        onChange={(e) => setManualCriteria(e.target.value)}
                        placeholder="Indikator fisik atau prosedur yang diverifikasi..."
                        className="input-control"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Catatan Auditor
                      </label>
                      <input
                        type="text"
                        value={manualNotes}
                        onChange={(e) => setManualNotes(e.target.value)}
                        placeholder="Catatan hasil temuan fisik..."
                        className="input-control"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button type="button" onClick={() => setShowManualCodeForm(false)} className="btn btn-secondary btn-sm">
                      Batal
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Simpan Item Checklist
                    </button>
                  </div>
                </form>
              )}

              {/* Standard + Template Elements Table */}
              <div className="glass-card" style={{ padding: '0.75rem', overflowX: 'auto' }}>
                <table className="pms-table" style={{ width: '100%', fontSize: '0.78rem' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '90px', textAlign: 'center' }}>Kode</th>
                      <th>Area Pemeriksaan ISM Code</th>
                      <th>Kriteria / Check Point</th>
                      <th style={{ width: '52px', textAlign: 'center' }} title="Complied / Sesuai (Yes)">Yes</th>
                      <th style={{ width: '52px', textAlign: 'center' }} title="Non-Conformity / Tidak Sesuai (No)">No</th>
                      <th style={{ width: '52px', textAlign: 'center' }} title="Not Applicable / Tidak Berlaku (N/A)">N/A</th>
                      <th style={{ width: '150px' }}>Catatan</th>
                      <th style={{ width: '180px' }}>Upload Bukti Audit</th>
                      <th style={{ width: '180px', textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Custom items */}
                    {customChecklistItems
                      .filter(item => !vesselDeletedCodes.includes(item.code))
                      .filter(item => {
                        const isStrikethrough = vesselStrikethroughOverrides[item.code] !== undefined
                          ? vesselStrikethroughOverrides[item.code]
                          : Boolean(item.isStrikethrough);
                        const resultVal = vesselChecklistResults[item.code] !== undefined
                          ? vesselChecklistResults[item.code]
                          : (isStrikethrough ? 'N/A' : (item.result || ''));
                        const isYes = !isStrikethrough && (resultVal === 'Complied' || resultVal === 'Yes');
                        const isNo = !isStrikethrough && ['Minor NC', 'Major NC', 'Observation', 'No'].includes(resultVal);
                        const isNA = isStrikethrough || resultVal === 'N/A';

                        if (vesselChecklistFilter === 'CORE') return !isStrikethrough;
                        if (vesselChecklistFilter === 'STRIKETHROUGH') return isStrikethrough;
                        if (vesselChecklistFilter === 'HAS_EVIDENCE') return Boolean(checklistEvidenceMap[item.code]);
                        if (vesselChecklistFilter === 'YES') return isYes;
                        if (vesselChecklistFilter === 'NO') return isNo;
                        if (vesselChecklistFilter === 'NA') return isNA;
                        return true;
                      })
                      .map(item => {
                        const isStrikethrough = vesselStrikethroughOverrides[item.code] !== undefined
                          ? vesselStrikethroughOverrides[item.code]
                          : Boolean(item.isStrikethrough);
                        const resultVal = vesselChecklistResults[item.code] !== undefined
                          ? vesselChecklistResults[item.code]
                          : (isStrikethrough ? 'N/A' : (item.result || ''));
                        const isYes = !isStrikethrough && (resultVal === 'Complied' || resultVal === 'Yes');
                        const isNo = !isStrikethrough && ['Minor NC', 'Major NC', 'Observation', 'No'].includes(resultVal);
                        const isNA = isStrikethrough || resultVal === 'N/A';
                        const currentNotes = vesselChecklistNotes[item.code] !== undefined
                          ? vesselChecklistNotes[item.code]
                          : (item.notes || '');

                        return (
                          <tr key={item.id} style={{ background: isStrikethrough ? 'rgba(239, 68, 68, 0.03)' : 'rgba(2, 132, 199, 0.04)' }}>
                            <td style={{ textAlign: 'center', verticalAlign: 'top' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                                <span className="badge badge-info mono" style={{ fontWeight: 800 }}>
                                  {item.code}
                                </span>
                                <span className="badge badge-neutral" style={{ fontSize: '0.62rem' }}>Manual</span>
                                {isStrikethrough ? (
                                  <button
                                    type="button"
                                    onClick={() => handleToggleVesselStrikethrough(item.code)}
                                    className="badge badge-warning"
                                    style={{ fontSize: '0.58rem', padding: '0.08rem 0.35rem', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', width: 'fit-content' }}
                                    title="Klik untuk lepas coret klausul"
                                  >
                                    <Undo2 size={9} />
                                    <span>Dicoret (N/A)</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleToggleVesselStrikethrough(item.code)}
                                    style={{ fontSize: '0.58rem', padding: '0.05rem 0.3rem', border: '1px dashed var(--border-subtle)', background: 'transparent', color: 'var(--text-muted)', borderRadius: '3px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', width: 'fit-content' }}
                                    title="Coret klausul ini jika tidak digunakan pada kapal"
                                  >
                                    <Strikethrough size={9} />
                                    <span>Coret</span>
                                  </button>
                                )}
                              </div>
                            </td>
                            <td style={{ verticalAlign: 'top' }}>
                              <div style={{ textDecoration: isStrikethrough ? 'line-through' : 'none', color: isStrikethrough ? 'var(--text-muted)' : 'var(--text-main)' }}>
                                <strong>{item.name}</strong>
                              </div>
                            </td>
                            <td style={{ color: 'var(--text-muted)', verticalAlign: 'top' }}>
                              <span>{item.checkPoint}</span>
                              {isNo && (
                                <div style={{ marginTop: '0.35rem' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleQuickLogNC(item, 'Minor NC')}
                                    className="btn btn-warning btn-sm"
                                    style={{
                                      fontSize: '0.68rem',
                                      padding: '0.2rem 0.5rem',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.25rem',
                                      fontWeight: 700
                                    }}
                                    title="Catat langsung temuan NC untuk butir manual ini"
                                  >
                                    <Zap size={11} fill="currentColor" />
                                    <span>Catat Temuan NC Langsung</span>
                                  </button>
                                </div>
                              )}
                            </td>

                            {/* Yes */}
                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                              <div
                                className={`audit-checkbox-box ${isYes ? 'active-yes' : ''}`}
                                title={isYes ? 'Batal pilih Yes (Kosongkan)' : 'Tandai: Complied / Yes'}
                                onClick={() => !isStrikethrough && handleToggleManagerResult(item.code, 'Complied')}
                                style={{ cursor: isStrikethrough ? 'not-allowed' : 'pointer' }}
                              >
                                {isYes && <span style={{ fontSize: '13px', fontWeight: 900, lineHeight: 1 }}>✕</span>}
                              </div>
                            </td>

                            {/* No */}
                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                              <div
                                className={`audit-checkbox-box ${isNo ? 'active-no' : ''}`}
                                title={isNo ? 'Batal pilih No (Kosongkan)' : 'Tandai: Minor NC / No'}
                                onClick={() => !isStrikethrough && handleToggleManagerResult(item.code, 'Minor NC')}
                                style={{ cursor: isStrikethrough ? 'not-allowed' : 'pointer' }}
                              >
                                {isNo && <span style={{ fontSize: '13px', fontWeight: 900, lineHeight: 1 }}>✕</span>}
                              </div>
                            </td>

                            {/* N/A */}
                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                              <div
                                className={`audit-checkbox-box ${isNA ? 'active-na' : ''}`}
                                title={isNA ? 'Batal pilih N/A (Kosongkan)' : 'Tandai: N/A (Tidak Berlaku)'}
                                onClick={() => !isStrikethrough && handleToggleManagerResult(item.code, 'N/A')}
                                style={{ cursor: isStrikethrough ? 'not-allowed' : 'pointer' }}
                              >
                                {isNA && <span style={{ fontSize: '13px', fontWeight: 900, lineHeight: 1 }}>✕</span>}
                              </div>
                            </td>

                            {/* Catatan / Remark */}
                            <td style={{ verticalAlign: 'middle' }}>
                              <input
                                type="text"
                                value={currentNotes}
                                onChange={(e) => setVesselChecklistNotes(prev => ({ ...prev, [item.code]: e.target.value }))}
                                placeholder="Catatan temuan..."
                                className="input-control"
                                style={{ fontSize: '0.74rem', padding: '0.25rem 0.5rem' }}
                              />
                            </td>

                            {/* Evidence */}
                            <td style={{ verticalAlign: 'middle' }}>
                              {checklistEvidenceMap[item.code] ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.3rem 0.5rem', borderRadius: '6px', background: 'rgba(2, 132, 199, 0.12)', border: '1px solid rgba(2, 132, 199, 0.3)' }}>
                                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0284c7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '110px' }} title={checklistEvidenceMap[item.code].fileName}>
                                    📎 {checklistEvidenceMap[item.code].fileName}
                                  </span>
                                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                                    <button
                                      type="button"
                                      onClick={() => setPreviewChecklistEvidence(checklistEvidenceMap[item.code])}
                                      className="btn btn-secondary btn-sm"
                                      style={{ padding: '0.15rem 0.35rem', fontSize: '0.65rem' }}
                                    >
                                      <Eye size={11} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveVesselChecklistEvidence(item.code)}
                                      className="btn btn-secondary btn-sm"
                                      style={{ padding: '0.15rem 0.35rem', color: '#ef4444' }}
                                    >
                                      <Trash2 size={11} />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                  <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', fontSize: '0.68rem', padding: '0.2rem 0.45rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                    <Upload size={11} />
                                    <span>Upload</span>
                                    <input type="file" accept="image/*,application/pdf" style={{ display: 'none' }} onChange={(e) => handleUploadVesselChecklistEvidence(item.code, e.target.files?.[0])} />
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => handleGenerateMockVesselChecklistEvidence(item.code, item.name, currentTarget.name)}
                                    className="btn btn-secondary btn-sm"
                                    style={{ fontSize: '0.68rem', padding: '0.2rem 0.4rem', color: '#0284c7' }}
                                  >
                                    <Sparkles size={11} />
                                  </button>
                                </div>
                              )}
                            </td>

                            {/* Aksi */}
                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditManagerItem(item)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '0.2rem 0.45rem', fontSize: '0.68rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#0284c7', borderColor: 'rgba(2, 132, 199, 0.3)' }}
                                  title="Edit butir manual ini"
                                >
                                  <Edit2 size={11} />
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteManagerItemTarget(item)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '0.2rem 0.45rem', fontSize: '0.68rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                                  title="Hapus butir manual ini"
                                >
                                  <Trash2 size={11} />
                                  <span>Hapus</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleVesselStrikethrough(item.code)}
                                  className={`btn btn-sm ${isStrikethrough ? 'btn-warning' : 'btn-secondary'}`}
                                  style={{
                                    fontSize: '0.68rem',
                                    padding: '0.2rem 0.45rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    fontWeight: 600
                                  }}
                                  title={isStrikethrough ? 'Lepas coret klausul' : 'Coret klausul (Tandai N/A)'}
                                >
                                  {isStrikethrough ? (
                                    <>
                                      <Undo2 size={11} />
                                      <span>Lepas</span>
                                    </>
                                  ) : (
                                    <>
                                      <Strikethrough size={11} />
                                      <span>Coret</span>
                                    </>
                                  )}
                                </button>
                                {!isStrikethrough && (
                                  <button
                                    type="button"
                                    onClick={() => handleQuickLogNC(item, 'Minor NC')}
                                    className="btn btn-secondary btn-sm"
                                    style={{ fontSize: '0.68rem', padding: '0.2rem 0.45rem', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)', fontWeight: 700 }}
                                    title="Buat temuan NC untuk klausul manual ini"
                                  >
                                    + NC
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                    {/* Butir checklist standar / template (DOC Rev 06 & SMC Rev 05) */}
                    {activeChecklistItems
                      .filter(el => !vesselDeletedCodes.includes(el.code))
                      .filter(el => {
                        const isStriked = vesselStrikethroughOverrides[el.code] !== undefined
                          ? vesselStrikethroughOverrides[el.code]
                          : Boolean(el.isStrikethrough);
                        const itemOverride = vesselItemOverrides[el.code] || {};
                        const effectiveResult = vesselChecklistResults[el.code] !== undefined
                          ? vesselChecklistResults[el.code]
                          : (isStriked ? 'N/A' : (itemOverride.result || el.result || 'Complied'));
                        const isYes = !isStriked && (effectiveResult === 'Complied' || effectiveResult === 'Yes');
                        const isNo = !isStriked && ['Minor NC', 'Major NC', 'Observation', 'No'].includes(effectiveResult);
                        const isNA = isStriked || effectiveResult === 'N/A';

                        if (vesselChecklistFilter === 'CORE') return !isStriked;
                        if (vesselChecklistFilter === 'STRIKETHROUGH') return isStriked;
                        if (vesselChecklistFilter === 'HAS_EVIDENCE') return Boolean(checklistEvidenceMap[el.code]);
                        if (vesselChecklistFilter === 'YES') return isYes;
                        if (vesselChecklistFilter === 'NO') return isNo;
                        if (vesselChecklistFilter === 'NA') return isNA;
                        return true;
                      })
                      .map(el => {
                        const isStrikethrough = vesselStrikethroughOverrides[el.code] !== undefined
                          ? vesselStrikethroughOverrides[el.code]
                          : Boolean(el.isStrikethrough);
                        const itemOverride = vesselItemOverrides[el.code] || {};
                        const effectiveItem = { ...el, ...itemOverride };
                        const effectiveResult = vesselChecklistResults[el.code] !== undefined
                          ? vesselChecklistResults[el.code]
                          : (isStrikethrough ? 'N/A' : (itemOverride.result || el.result || 'Complied'));
                        const isYes = !isStriked(effectiveResult) && (effectiveResult === 'Complied' || effectiveResult === 'Yes');
                        const isNo = !isStriked(effectiveResult) && ['Minor NC', 'Major NC', 'Observation', 'No'].includes(effectiveResult);
                        const isNA = isStrikethrough || effectiveResult === 'N/A';
                        const currentNotes = vesselChecklistNotes[el.code] !== undefined
                          ? vesselChecklistNotes[el.code]
                          : (itemOverride.notes || el.notes || '');
                        const evidence = checklistEvidenceMap[el.code];

                        function isStriked() {
                          return isStrikethrough;
                        }

                        return (
                          <tr key={el.code} style={{ background: isStrikethrough ? 'rgba(239, 68, 68, 0.03)' : undefined }}>
                            {/* Kode */}
                            <td style={{ textAlign: 'center', verticalAlign: 'top' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                                <span className="badge badge-neutral mono" style={{ fontWeight: 800, color: isStrikethrough ? '#94a3b8' : '#10b981' }}>
                                  {effectiveItem.code}
                                </span>
                                {isStrikethrough ? (
                                  <button
                                    type="button"
                                    onClick={() => handleToggleVesselStrikethrough(el.code)}
                                    className="badge badge-warning"
                                    style={{ fontSize: '0.58rem', padding: '0.08rem 0.35rem', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', width: 'fit-content' }}
                                    title="Klik untuk melepas coret klausul"
                                  >
                                    <Undo2 size={9} />
                                    <span>Dicoret (N/A)</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleToggleVesselStrikethrough(el.code)}
                                    style={{ fontSize: '0.58rem', padding: '0.05rem 0.3rem', border: '1px dashed var(--border-subtle)', background: 'transparent', color: 'var(--text-muted)', borderRadius: '3px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', width: 'fit-content' }}
                                    title="Coret klausul ini (Tandai N/A jika tidak digunakan pada kapal)"
                                  >
                                    <Strikethrough size={9} />
                                    <span>Coret</span>
                                  </button>
                                )}
                              </div>
                            </td>

                            {/* Area Pemeriksaan */}
                            <td style={{ verticalAlign: 'top' }}>
                              <div style={{ textDecoration: isStrikethrough ? 'line-through' : 'none', color: isStrikethrough ? 'var(--text-muted)' : 'var(--text-main)' }}>
                                <strong style={{ display: 'block' }}>{effectiveItem.name}</strong>
                              </div>
                              {isStrikethrough && (
                                <span style={{ fontSize: '0.67rem', color: '#f59e0b', fontWeight: 600 }}>
                                  ⚠️ Klausul tidak digunakan / dicoret oleh auditor (N/A)
                                </span>
                              )}
                            </td>

                            {/* Kriteria / Check Point */}
                            <td style={{ color: 'var(--text-muted)', verticalAlign: 'top' }}>
                              <span style={{ display: 'block', lineHeight: 1.5 }}>
                                {effectiveItem.checkPoint || effectiveItem.checkPoints?.[0] || effectiveItem.description || '-'}
                              </span>
                              {(effectiveItem.remark || effectiveItem.ismCode) && (
                                <span style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                                  {effectiveItem.ismCode && (
                                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#0284c7', background: 'rgba(2,132,199,0.1)', borderRadius: '4px', padding: '0.05rem 0.3rem' }}>
                                      ISM §{effectiveItem.ismCode}
                                    </span>
                                  )}
                                  {effectiveItem.remark && effectiveItem.remark !== effectiveItem.checkPoint && (
                                    <span style={{ fontSize: '0.62rem', color: '#64748b', fontStyle: 'italic' }}>
                                      {effectiveItem.remark}
                                    </span>
                                  )}
                                </span>
                              )}
                              {isNo && (
                                <div style={{ marginTop: '0.4rem' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleQuickLogNC(effectiveItem, effectiveResult === 'Major NC' ? 'Major NC' : effectiveResult === 'Observation' ? 'Observation' : 'Minor NC')}
                                    className="btn btn-warning btn-sm"
                                    style={{
                                      fontSize: '0.68rem',
                                      padding: '0.2rem 0.55rem',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.25rem',
                                      fontWeight: 700
                                    }}
                                    title="Catat langsung temuan NC untuk klausul ini"
                                  >
                                    <Zap size={11} fill="currentColor" />
                                    <span>Catat Temuan NC Langsung</span>
                                  </button>
                                </div>
                              )}
                            </td>

                            {/* Yes */}
                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                              <div
                                className={`audit-checkbox-box ${isYes ? 'active-yes' : ''}`}
                                title={isYes ? 'Batal pilih Yes (Kosongkan)' : 'Tandai: Complied / Yes'}
                                onClick={() => !isStrikethrough && handleToggleManagerResult(el.code, 'Complied')}
                                style={{ cursor: isStrikethrough ? 'not-allowed' : 'pointer' }}
                              >
                                {isYes && <span style={{ fontSize: '13px', fontWeight: 900, lineHeight: 1 }}>✕</span>}
                              </div>
                            </td>

                            {/* No */}
                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                              <div
                                className={`audit-checkbox-box ${isNo ? 'active-no' : ''}`}
                                title={isNo ? 'Batal pilih No (Kosongkan)' : 'Tandai: Minor NC / No'}
                                onClick={() => !isStrikethrough && handleToggleManagerResult(el.code, 'Minor NC')}
                                style={{ cursor: isStrikethrough ? 'not-allowed' : 'pointer' }}
                              >
                                {isNo && <span style={{ fontSize: '13px', fontWeight: 900, lineHeight: 1 }}>✕</span>}
                              </div>
                            </td>

                            {/* N/A */}
                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                              <div
                                className={`audit-checkbox-box ${isNA ? 'active-na' : ''}`}
                                title={isNA ? 'Batal pilih N/A (Kosongkan)' : 'Tandai: N/A (Tidak Berlaku)'}
                                onClick={() => !isStrikethrough && handleToggleManagerResult(el.code, 'N/A')}
                                style={{ cursor: isStrikethrough ? 'not-allowed' : 'pointer' }}
                              >
                                {isNA && <span style={{ fontSize: '13px', fontWeight: 900, lineHeight: 1 }}>✕</span>}
                              </div>
                            </td>

                            {/* Catatan / Remark */}
                            <td style={{ verticalAlign: 'middle' }}>
                              <input
                                type="text"
                                value={currentNotes}
                                onChange={(e) => setVesselChecklistNotes(prev => ({ ...prev, [el.code]: e.target.value }))}
                                placeholder="Catatan temuan..."
                                className="input-control"
                                style={{ fontSize: '0.74rem', padding: '0.25rem 0.5rem' }}
                              />
                            </td>

                            {/* Upload Bukti Audit Field */}
                            <td style={{ verticalAlign: 'middle' }}>
                              {evidence ? (
                                <div style={{
                                  padding: '0.3rem 0.5rem',
                                  borderRadius: '6px',
                                  background: 'rgba(2, 132, 199, 0.12)',
                                  border: '1px solid rgba(2, 132, 199, 0.3)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: '0.3rem'
                                }}>
                                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0284c7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '110px' }} title={evidence.fileName}>
                                    📎 {evidence.fileName}
                                  </span>
                                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                                    <button
                                      type="button"
                                      onClick={() => setPreviewChecklistEvidence(evidence)}
                                      className="btn btn-secondary btn-sm"
                                      style={{ padding: '0.15rem 0.35rem', fontSize: '0.65rem' }}
                                      title="Lihat Bukti"
                                    >
                                      <Eye size={11} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveVesselChecklistEvidence(el.code)}
                                      className="btn btn-secondary btn-sm"
                                      style={{ padding: '0.15rem 0.35rem', color: '#ef4444' }}
                                      title="Hapus Bukti"
                                    >
                                      <Trash2 size={11} />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                                  <label
                                    className="btn btn-secondary btn-sm"
                                    style={{
                                      cursor: 'pointer',
                                      fontSize: '0.68rem',
                                      padding: '0.2rem 0.45rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.2rem',
                                      color: 'var(--text-main)'
                                    }}
                                    title="Unggah Foto/Dokumen Bukti Audit"
                                  >
                                    <Upload size={11} />
                                    <span>Upload</span>
                                    <input
                                      type="file"
                                      accept="image/*,application/pdf"
                                      style={{ display: 'none' }}
                                      onChange={(e) => handleUploadVesselChecklistEvidence(el.code, e.target.files?.[0])}
                                    />
                                  </label>

                                  <button
                                    type="button"
                                    onClick={() => handleGenerateMockVesselChecklistEvidence(el.code, el.name, currentTarget.name)}
                                    className="btn btn-secondary btn-sm"
                                    style={{
                                      fontSize: '0.68rem',
                                      padding: '0.2rem 0.4rem',
                                      color: '#0284c7',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.2rem'
                                    }}
                                    title="Lampirkan Dokumen Bukti Simulasi Cepat"
                                  >
                                    <Sparkles size={11} />
                                    <span>Simulasi</span>
                                  </button>
                                </div>
                              )}
                            </td>

                            {/* Aksi */}
                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditManagerItem(effectiveItem)}
                                  className="btn btn-secondary btn-sm"
                                  style={{
                                    padding: '0.2rem 0.45rem',
                                    fontSize: '0.68rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.2rem',
                                    color: '#0284c7',
                                    borderColor: 'rgba(2, 132, 199, 0.3)'
                                  }}
                                  title="Edit butir klausul ini"
                                >
                                  <Edit2 size={11} />
                                  <span>Edit</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setDeleteManagerItemTarget(effectiveItem)}
                                  className="btn btn-secondary btn-sm"
                                  style={{
                                    padding: '0.2rem 0.45rem',
                                    fontSize: '0.68rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.2rem',
                                    color: '#ef4444',
                                    borderColor: 'rgba(239, 68, 68, 0.3)'
                                  }}
                                  title="Hapus butir klausul ini"
                                >
                                  <Trash2 size={11} />
                                  <span>Hapus</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleToggleVesselStrikethrough(el.code)}
                                  className={`btn btn-sm ${isStrikethrough ? 'btn-warning' : 'btn-secondary'}`}
                                  style={{
                                    fontSize: '0.68rem',
                                    padding: '0.2rem 0.45rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    fontWeight: 600
                                  }}
                                  title={isStrikethrough ? 'Lepas coret klausul (aktifkan kembali)' : 'Coret klausul (Tandai N/A jika tidak dipakai)'}
                                >
                                  {isStrikethrough ? (
                                    <>
                                      <Undo2 size={11} />
                                      <span>Lepas</span>
                                    </>
                                  ) : (
                                    <>
                                      <Strikethrough size={11} />
                                      <span>Coret</span>
                                    </>
                                  )}
                                </button>

                                {!isStrikethrough && (
                                  <button
                                    onClick={() => handleQuickLogNC(effectiveItem, effectiveResult === 'Major NC' ? 'Major NC' : effectiveResult === 'Observation' ? 'Observation' : 'Minor NC')}
                                    className="btn btn-secondary btn-sm"
                                    style={{ fontSize: '0.68rem', padding: '0.2rem 0.45rem', color: '#f59e0b' }}
                                    title="Buat temuan NC untuk klausul ini"
                                  >
                                    + NC
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                    {/* Empty state: lembaga belum punya template checklist */}
                    {activeChecklistItems.length === 0 && customChecklistItems.length === 0 && (
                      <tr>
                        <td colSpan={9} style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={32} color="#94a3b8" />
                            <strong style={{ fontSize: '0.85rem' }}>
                              Belum ada butir checklist untuk {activeChecklistConfig.organizationName || 'lembaga ini'}
                            </strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '460px', lineHeight: 1.6 }}>
                              {activeChecklistConfig.note || 'Isi checklist setiap lembaga audit berbeda-beda, sehingga butir pemeriksaan perlu disusun sesuai regulasi lembaga terkait.'}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              Gunakan panel <strong>Input Item Audit Manual</strong> di atas untuk menambahkan butir pemeriksaan.
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 4: BUKTI & CAPA (TAHAP 4 LIFECYCLE AUDIT)                          */}
          {/* ===================================================================== */}
          {vesselTab === 'capa' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Header & Print Action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Upload size={18} color="#0284c7" />
                    <span>Tahap 4: Tindakan Korektif & Verifikasi Bukti (CAPA)</span>
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Monitoring tindakan koreksi fisik, analisis akar masalah (Root Cause), serta validasi dokumen eviden sebelum status temuan ditutup resmi.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const targetFinding = currentTarget.findings.find(f => f.status === 'Eviden Submitted') || currentTarget.findings[0] || null;
                      setReportModalSession(activeSession || currentTarget.lastAudit);
                      setReportModalFinding(targetFinding);
                      setReportModalMode('ncr');
                      setReportModalOpen(true);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#0284c7' }}
                    title="Cetak Formulir NCR Perbaikan Resmi BKI F23.14.07 format PDF"
                  >
                    <Printer size={14} />
                    <span>Cetak Form NCR (PDF)</span>
                  </button>
                </div>
              </div>

              {/* Metric Statistics Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '0.65rem'
              }}>
                <div className="glass-card" style={{ padding: '0.75rem 1rem' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL TEMUAN</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                    {currentTarget.findings.length}
                  </div>
                </div>
                <div className="glass-card" style={{ padding: '0.75rem 1rem', borderLeft: '3px solid #ef4444' }}>
                  <div style={{ fontSize: '0.68rem', color: '#ef4444', fontWeight: 700 }}>PERLU TINDAKAN (OPEN)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ef4444', marginTop: '0.15rem' }}>
                    {currentTarget.openNC}
                  </div>
                </div>
                <div className="glass-card" style={{ padding: '0.75rem 1rem', borderLeft: '3px solid #f59e0b' }}>
                  <div style={{ fontSize: '0.68rem', color: '#f59e0b', fontWeight: 700 }}>SIAP VERIFIKASI (REVIEW)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f59e0b', marginTop: '0.15rem' }}>
                    {currentTarget.submittedNC}
                  </div>
                </div>
                <div className="glass-card" style={{ padding: '0.75rem 1rem', borderLeft: '3px solid #10b981' }}>
                  <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700 }}>TUNTAS (CLOSED)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10b981', marginTop: '0.15rem' }}>
                    {currentTarget.closedNC}
                  </div>
                </div>
                <div className="glass-card" style={{ padding: '0.75rem 1rem' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>CLOSURE RATE</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0284c7', marginTop: '0.15rem' }}>
                    {currentTarget.findings.length > 0 ? Math.round((currentTarget.closedNC / currentTarget.findings.length) * 100) : 100}%
                  </div>
                </div>
              </div>

              {/* Sub-Filters */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {[
                  { id: 'ALL', label: `Semua Temuan (${currentTarget.findings.length})` },
                  { id: 'SUBMITTED', label: `Siap Diverifikasi (${currentTarget.submittedNC})` },
                  { id: 'OPEN', label: `Perlu Tindakan PIC (${currentTarget.openNC})` },
                  { id: 'CLOSED', label: `Sudah Ditutup (${currentTarget.closedNC})` }
                ].map(flt => (
                  <button
                    key={flt.id}
                    type="button"
                    onClick={() => setCapaFilter(flt.id)}
                    className={`btn btn-sm ${capaFilter === flt.id ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem' }}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>

              {/* Findings CAPA List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {currentTarget.findings
                  .filter(f => {
                    if (capaFilter === 'SUBMITTED') return f.status === 'Eviden Submitted';
                    if (capaFilter === 'OPEN') return f.status === 'NC Open';
                    if (capaFilter === 'CLOSED') return f.status === 'NC Close';
                    return true;
                  })
                  .map(f => {
                    const ncRange = calculateNCRange(f);
                    const isClosed = f.status === 'NC Close';
                    const isSubmitted = f.status === 'Eviden Submitted';

                    return (
                      <div
                        key={f.id}
                        className="glass-card"
                        style={{
                          padding: '1.15rem',
                          borderRadius: '10px',
                          border: isClosed ? '1px solid rgba(16, 185, 129, 0.3)' : isSubmitted ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-subtle)',
                          background: isClosed ? 'rgba(16, 185, 129, 0.02)' : isSubmitted ? 'rgba(245, 158, 11, 0.02)' : 'var(--bg-surface-card)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem'
                        }}
                      >
                        {/* Header Temuan */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span className="mono" style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0284c7' }}>
                              {f.findingNo || `NC-${f.id.slice(-4)}`}
                            </span>
                            <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                              Klausul {f.clauseCode || f.elementNumberOfCode || '-'}
                            </span>
                            <span className={`badge ${
                              f.category === 'Major NC' ? 'badge-danger-pulse' : f.category === 'Observation' ? 'badge-info' : 'badge-warning'
                            }`} style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                              {f.category}
                            </span>
                            <span className={`badge ${
                              isClosed ? 'badge-success' : isSubmitted ? 'badge-info' : 'badge-danger'
                            }`} style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                              {f.status}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {ncRange && (
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: ncRange.isClosed ? '#10b981' : ncRange.isOverdue ? '#ef4444' : '#f59e0b' }}>
                                {ncRange.statusText}
                              </span>
                            )}
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              Due: {f.dueDate || '-'}
                            </span>
                          </div>
                        </div>

                        {/* Judul & Deskripsi Temuan */}
                        <div>
                          <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                            {f.clauseName || f.standard}
                          </div>
                          <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                            {f.description}
                          </p>
                          {f.objectiveEvidence && (
                            <div style={{ fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic', marginTop: '0.25rem' }}>
                              <strong>Bukti Objektif:</strong> {f.objectiveEvidence}
                            </div>
                          )}
                        </div>

                        {/* 3 Box CAPA: Akar Masalah, Tindakan Korektif, Tindakan Pencegahan */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                          gap: '0.65rem',
                          background: 'var(--bg-surface-elevated)',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: '1px solid var(--border-subtle)'
                        }}>
                          {/* Akar Masalah */}
                          <div>
                            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.2rem', textTransform: 'uppercase' }}>
                              🔍 Akar Masalah (Root Cause)
                            </div>
                            <div style={{ fontSize: '0.73rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                              {f.evidence?.rootCause || f.rootCause || (
                                <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Belum diidentifikasi oleh PIC</span>
                              )}
                            </div>
                          </div>

                          {/* Koreksi Langsung */}
                          <div>
                            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#0284c7', marginBottom: '0.2rem', textTransform: 'uppercase' }}>
                              🛠️ Tindakan Koreksi (Correction)
                            </div>
                            <div style={{ fontSize: '0.73rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                              {f.evidence?.correction || f.correction || (
                                <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Belum dilakukan perbaikan fisik</span>
                              )}
                            </div>
                          </div>

                          {/* Tindakan Pencegahan */}
                          <div>
                            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#10b981', marginBottom: '0.2rem', textTransform: 'uppercase' }}>
                              🛡️ Pencegahan (Preventive Action)
                            </div>
                            <div style={{ fontSize: '0.73rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                              {f.evidence?.preventiveAction || f.evidence?.correctiveAction || f.correctiveAction || (
                                <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Belum disusun rencana pencegahan berulang</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status Penutupan & Tombol Aksi Langsung */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.25rem' }}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            PIC: <strong>{f.assignedTo || 'KKM / Perwira Kapal'}</strong>
                            {f.dateClosed && (
                              <span style={{ marginLeft: '0.6rem', color: '#10b981', fontWeight: 700 }}>
                                ✓ Ditutup: {formatIndoDate(f.dateClosed)} oleh {f.closedBy || 'Lead Auditor'}
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setEvidenceTargetFinding(f);
                                setEvidenceModalOpen(true);
                              }}
                              className={`btn btn-sm ${isSubmitted ? 'btn-primary' : 'btn-secondary'}`}
                              style={{
                                fontSize: '0.72rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                fontWeight: 700,
                                background: auditRolePerspective === 'nakhoda' && !isClosed ? '#10b981' : undefined,
                                color: auditRolePerspective === 'nakhoda' && !isClosed ? '#ffffff' : undefined,
                                border: auditRolePerspective === 'nakhoda' && !isClosed ? 'none' : undefined
                              }}
                              title={
                                auditRolePerspective === 'nakhoda'
                                  ? 'Nakhoda: Unggah foto/dokumen perbaikan fisik dan kirimkan eviden ke DPA'
                                  : 'DPA / Auditor: Periksa kelayakan eviden dan lakukan otorisasi penutupan NC'
                              }
                            >
                              <Upload size={12} />
                              <span>
                                {isClosed
                                  ? 'Tinjau Bukti'
                                  : auditRolePerspective === 'nakhoda'
                                    ? isSubmitted
                                      ? 'Perbarui Eviden Kapal'
                                      : 'Unggah Eviden & Kirim ke DPA'
                                    : isSubmitted
                                      ? 'Verifikasi Eviden Masuk'
                                      : 'Input / Review CAPA'}
                              </span>
                            </button>

                            {!isClosed && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setNotificationModalFinding(f)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                                  title="Kirim pesan pengingat WA kepada PIC"
                                >
                                  <MessageSquare size={12} />
                                  <span>WhatsApp</span>
                                </button>

                                {auditRolePerspective === 'dpa' ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      closeAuditFinding(f.id, 'Diverifikasi langsung melalui Alur CAPA Tahap 4 (Otorisasi DPA)', currentUser?.name || 'DPA Baharimas');
                                      showToast(`✓ Temuan ${f.findingNo || 'NC'} berhasil diverifikasi & disetujui tutup resmi oleh DPA!`, 'success');
                                    }}
                                    className="btn btn-sm"
                                    style={{
                                      fontSize: '0.72rem',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.3rem',
                                      fontWeight: 700,
                                      background: '#10b981',
                                      color: '#fff',
                                      border: 'none',
                                      cursor: 'pointer',
                                      padding: '0.3rem 0.65rem',
                                      borderRadius: '6px'
                                    }}
                                    title="DPA Otorisasi: Langsung verifikasi & tutup temuan ini jika eviden telah valid"
                                  >
                                    <CheckCircle2 size={12} />
                                    <span>Tutup NC (DPA)</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      showToast(`ℹ️ Sesuai ISM Code Klausul 12, otorisasi penutupan NC dilakukan oleh DPA setelah memeriksa bukti fisik yang dikirimkan kapal.`, 'info');
                                    }}
                                    className="btn btn-secondary btn-sm"
                                    style={{
                                      fontSize: '0.7rem',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.25rem',
                                      color: 'var(--text-muted)',
                                      borderStyle: 'dashed'
                                    }}
                                    title="Klausul 12: Penutupan resmi diotorisasi oleh DPA setelah verifikasi eviden kapal"
                                  >
                                    <Clock size={11} />
                                    <span>Verifikasi DPA</span>
                                  </button>
                                )}
                              </>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setReportModalSession(activeSession || currentTarget.lastAudit);
                                setReportModalFinding(f);
                                setReportModalMode('ncr');
                                setReportModalOpen(true);
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#0284c7' }}
                              title="Cetak lembar NCR penutupan temuan ini"
                            >
                              <Printer size={12} />
                              <span>Cetak NCR</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {currentTarget.findings.length === 0 && (
                  <div className="glass-card" style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
                    <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 0.5rem auto' }} />
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'block' }}>
                      Tidak Ada Temuan Ketidaksesuaian (Bebas NC)
                    </strong>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0.25rem auto 0 auto' }}>
                      Seluruh klausul kepatuhan {currentTarget.name} terpenuhi dengan baik. Anda dapat melanjutkan ke Tahap 5 untuk penutupan audit dan cetak laporan.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 5: PENUTUPAN & CETAK LAPORAN (TAHAP 5 LIFECYCLE AUDIT)             */}
          {/* ===================================================================== */}
          {vesselTab === 'reporting' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Printer size={18} color="#0284c7" />
                    <span>Tahap 5: Penutupan Audit & Pusat Cetak Dokumen Resmi (Reporting Hub)</span>
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Evaluasi kelaikan sistem manajemen keselamatan (Fit-to-Sail), finalisasi pengesahan sesi audit, dan hub cetak 1-pintu berstandar BKI / ISM Code.
                  </p>
                </div>

                {activeSession?.status === 'In Progress' && (
                  <button
                    type="button"
                    onClick={() => {
                      updateAuditSession(activeSession.id, {
                        status: 'Completed',
                        targetCloseDate: new Date().toISOString().split('T')[0],
                        closeDate: new Date().toISOString().split('T')[0]
                      });
                      showToast(`✓ Sesi Audit ${activeSession.auditNo} berhasil diselesaikan dan ditutup!`, 'success');
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, background: '#10b981', borderColor: '#10b981' }}
                  >
                    <CheckCircle2 size={15} />
                    <span>Finalisasi & Tutup Sesi Audit</span>
                  </button>
                )}
              </div>

              {/* Status Rekomendasi Kepatuhan & Kelaikan Kapal (Fit to Sail) */}
              <div className="glass-card" style={{
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                background: 'linear-gradient(135deg, var(--bg-surface-card) 0%, var(--bg-surface-elevated) 100%)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtle)' }}>
                      Status Rekomendasi Kepatuhan ISM Code & Kelaikan Kelaiklautan
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                      {currentTarget.majorNC === 0 && currentTarget.openNC === 0 ? (
                        <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem', fontWeight: 800 }}>
                          ✓ LAIK LAYAR / FULL COMPLIANCE (FIT TO SAIL)
                        </span>
                      ) : currentTarget.majorNC === 0 && currentTarget.openNC > 0 ? (
                        <span className="badge badge-warning" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem', fontWeight: 800 }}>
                          ⚠️ LAIK BERSYARAT (INTERIM / MINOR NC PENDING CAPA)
                        </span>
                      ) : (
                        <span className="badge badge-danger" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem', fontWeight: 800 }}>
                          🚨 TIDAK LAIK (MAJOR NC WAJIB TUNTAS SEBELUM SAILING)
                        </span>
                      )}
                      <span className="badge badge-neutral mono" style={{ fontSize: '0.75rem' }}>
                        Standar: {currentTarget.standard} ({currentTarget.type === 'vessel' ? 'Kapal Armada' : 'Kantor Pusat'})
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Progres Checklist Pemeriksaan</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284c7' }}>
                      {checklistProgress.percent}% Selesai ({checklistProgress.answered}/{checklistProgress.total} Butir)
                    </div>
                  </div>
                </div>

                {/* Grid Status Sesi & Sign-off Preview */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '0.85rem',
                  marginTop: '0.25rem'
                }}>
                  {/* Info Sesi */}
                  <div style={{ padding: '0.85rem', borderRadius: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284c7', marginBottom: '0.35rem' }}>
                      DATA SESI AUDIT AKTIF
                    </div>
                    <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div><strong>Nomor Audit:</strong> <span className="mono">{activeSession?.auditNo || 'AUD-DEFAULT-2026'}</span></div>
                      <div><strong>Tipe & Lembaga:</strong> {activeSession?.auditType || 'Internal'} • {activeSession?.externalOrganization || 'PT. PBK Internal'}</div>
                      <div><strong>Tanggal Pelaksanaan:</strong> {formatIndoDate(activeSession?.auditDate || new Date().toISOString().split('T')[0])}</div>
                      <div><strong>Status Sesi:</strong> <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{activeSession?.status || 'Scheduled'}</span></div>
                    </div>
                  </div>

                  {/* Tim Auditor */}
                  <div style={{ padding: '0.85rem', borderRadius: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', marginBottom: '0.35rem' }}>
                      LEAD AUDITOR & VERIFIKATOR DPA
                    </div>
                    <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div><strong>Lead Auditor:</strong> {activeSession?.leadAuditor || 'Capt. Marine Safety Inspector'}</div>
                      <div><strong>Tim Pendamping:</strong> {Array.isArray(activeSession?.auditTeam) ? activeSession.auditTeam.join(', ') : 'DPA / Safety Officer'}</div>
                      <div><strong>Pengesahan:</strong> <span style={{ color: '#10b981', fontWeight: 700 }}>✓ Ditandatangani Elektronik (DPA Verified)</span></div>
                    </div>
                  </div>

                  {/* Auditee / Nakhoda */}
                  <div style={{ padding: '0.85rem', borderRadius: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.35rem' }}>
                      PERWAKILAN AUDITEE (KAPAL/KANTOR)
                    </div>
                    <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div><strong>Perwakilan Penerima:</strong> {activeSession?.auditee || `${currentTarget.nakhoda || 'Nakhoda'} & ${currentTarget.kkm || 'KKM'}`}</div>
                      <div><strong>Lokasi Penutupan:</strong> {activeSession?.auditLocation || `Onboard ${currentTarget.name}`}</div>
                      <div><strong>Status Closing Meeting:</strong> <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Selesai Dipaparkan</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Print Hub Cards */}
              <div>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Printer size={15} />
                  <span>Pusat Cetak Formulir & Dokumen Audit Resmi (Format BKI / ISM Code)</span>
                </h5>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '1rem'
                }}>
                  {/* Card 1: Executive Audit Report */}
                  <div className="glass-card" style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ padding: '0.45rem', borderRadius: '8px', background: 'rgba(2, 132, 199, 0.12)', color: '#0284c7' }}>
                          <FileText size={20} />
                        </div>
                        <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>Dokumen 1</span>
                      </div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.35rem 0' }}>
                        1. Laporan Sesi Audit (Audit Report)
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                        Dokumen komprehensif audit berstandar resmi DOC/SMC. Berisi ringkasan eksekutif kepatuhan, data kapal/kantor, daftar auditor, rekapitulasi klausul, dan lembar tanda tangan pengesahan.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setReportModalSession(activeSession || currentTarget.lastAudit || {
                          id: 'report-session',
                          auditNo: `AUD-${currentTarget.standard}-${currentTarget.name.replace(/\s+/g, '')}-2026`,
                          auditType: 'Internal',
                          standard: currentTarget.standard,
                          targetName: currentTarget.name,
                          vesselId: currentTarget.id,
                          leadAuditor: 'Capt. Marine Safety Inspector',
                          auditDate: new Date().toISOString().split('T')[0]
                        });
                        setReportModalFinding(null);
                        setReportModalMode('session');
                        setReportModalOpen(true);
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 700, width: '100%', padding: '0.5rem' }}
                    >
                      <Printer size={14} />
                      <span>Cetak Dokumen 1: Sesi Audit</span>
                    </button>
                  </div>

                  {/* Card 2: NCR Close-Out Form */}
                  <div className="glass-card" style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ padding: '0.45rem', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
                          <AlertTriangle size={20} />
                        </div>
                        <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Dokumen 2</span>
                      </div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.35rem 0' }}>
                        2. Formulir Ketidaksesuaian (NCR Form)
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                        Formulir resmi penutupan temuan NC per butir pemeriksaan. Menyajikan deskripsi temuan, analisis akar masalah (RCA), tindakan korektif/preventif (CAPA), dan verifikasi Lead Auditor.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const firstFinding = currentTarget.findings[0] || null;
                        setReportModalSession(activeSession || currentTarget.lastAudit);
                        setReportModalFinding(firstFinding);
                        setReportModalMode('ncr');
                        setReportModalOpen(true);
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 700, width: '100%', padding: '0.5rem', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)' }}
                    >
                      <Printer size={14} />
                      <span>Cetak Dokumen 2: Lembar NCR</span>
                    </button>
                  </div>

                  {/* Card 3: BKI Checklist Report */}
                  <div className="glass-card" style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ padding: '0.45rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                          <CheckSquare size={20} />
                        </div>
                        <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                          Dokumen 3 ({currentTarget.standard === 'DOC' ? 'DOC Rev 06' : 'SMC Rev 05'})
                        </span>
                      </div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.35rem 0' }}>
                        3. Checklist Resmi BKI (A4 Printable)
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                        Formulir cetak lembar kerja audit {currentTarget.standard === 'DOC' ? 'DOC (13 Seksi)' : 'SMC Shipboard (74 Butir)'} lengkap dengan tanda silang Yes/No/NA, klausul dicoret, dan catatan bukti fisik.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setReportModalSession(activeSession || currentTarget.lastAudit || {
                          id: 'checklist-print',
                          auditNo: `AUD-${currentTarget.standard}-${currentTarget.name.replace(/\s+/g, '')}-2026`,
                          auditType: 'Internal',
                          standard: currentTarget.standard,
                          targetName: currentTarget.name,
                          vesselId: currentTarget.id,
                          leadAuditor: 'Capt. Marine Safety Inspector',
                          auditDate: new Date().toISOString().split('T')[0]
                        });
                        setReportModalFinding(null);
                        setReportModalMode('checklist');
                        setReportModalOpen(true);
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 700, width: '100%', padding: '0.5rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                    >
                      <Printer size={14} />
                      <span>Cetak Dokumen 3: Lembar Checklist</span>
                    </button>
                  </div>
                </div>

                {/* Option to Print All as a Complete Audit Pack Bundle */}
                <div style={{
                  marginTop: '0.85rem',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '10px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7' }}>
                      <FileText size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        Opsi Cetak Bundel: Ingin mencetak seluruh berkas sekaligus?
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Anda dapat mencetak masing-masing dokumen di atas secara mandiri, atau klik tombol di samping untuk mencetak bundel 3 dokumen berurutan.
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setReportModalSession(activeSession || currentTarget.lastAudit);
                      setReportModalFinding(currentTarget.findings[0] || null);
                      setReportModalMode('all');
                      setReportModalOpen(true);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontWeight: 800,
                      fontSize: '0.76rem',
                      padding: '0.45rem 0.9rem',
                      color: '#0284c7',
                      borderColor: 'rgba(2, 132, 199, 0.4)'
                    }}
                  >
                    <FileText size={14} />
                    <span>Cetak Semua (Bundle 3 Dokumen)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 6: SERTIFIKAT & LOGISTIK KAPAL                                    */}
          {/* ===================================================================== */}
          {vesselTab === 'integrations' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.25rem' }}>
              {/* Box 1: Sertifikat Kapal */}
              <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileCheck size={16} color="#38bdf8" />
                    <span>Sertifikat Statutori {currentTarget.name}:</span>
                  </h4>
                  <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                    {currentTargetCertificates.length} Sertifikat
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '420px', overflowY: 'auto' }}>
                  {currentTargetCertificates.map(doc => (
                    <div
                      key={doc.id}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        background: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.75rem'
                      }}
                    >
                      <div>
                        <strong style={{ color: 'var(--text-main)' }}>{doc.name || doc.type}</strong>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '0.1rem' }}>
                          No: {doc.documentNumber || 'BKI/REG-PBK'} • Surveyor: {doc.mandatoryAuditor || 'BKI Pontianak'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className={`badge ${
                          doc.status === 'Expired' ? 'badge-danger' : doc.status === 'Due Soon' ? 'badge-warning' : 'badge-success'
                        }`} style={{ fontSize: '0.65rem' }}>
                          {doc.status || 'Active'}
                        </span>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                          Exp: {doc.expiryDate}
                        </div>
                      </div>
                    </div>
                  ))}
                  {currentTargetCertificates.length === 0 && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>
                      Belum ada sertifikat terhubung untuk entitas ini.
                    </p>
                  )}
                </div>
              </div>

              {/* Box 2: Permintaan Barang ke Gudang */}
              <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Package size={16} color="#f59e0b" />
                    <span>Permintaan Barang ke Gudang (Requisitions):</span>
                  </h4>
                  <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                    {currentTargetRequisitions.length} Surat
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '420px', overflowY: 'auto' }}>
                  {currentTargetRequisitions.map(req => (
                    <div
                      key={req.id}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        background: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.75rem'
                      }}
                    >
                      <div>
                        <strong className="mono" style={{ color: '#0284c7' }}>{req.requisitionNumber || req.id}</strong>
                        <div style={{ color: 'var(--text-main)', marginTop: '0.1rem', fontWeight: 600 }}>
                          {req.title || req.department || 'Permintaan Material Rutin'}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>
                          Pemohon: {req.requestedBy || 'Chief Engineer'} • {req.dateSubmitted}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className={`badge ${
                          req.status === 'Completed' || req.status === 'Approved' ? 'badge-success' : 'badge-warning'
                        }`} style={{ fontSize: '0.65rem' }}>
                          {req.status}
                        </span>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                          {req.items?.length || 1} Item Barang
                        </div>
                      </div>
                    </div>
                  ))}
                  {currentTargetRequisitions.length === 0 && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>
                      Belum ada surat permintaan barang ke gudang untuk entitas ini.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* MODAL AUDIT SESSIONS                                                     */}
      {/* ========================================================================= */}
      {sessionModalOpen && (
        <AuditSessionModal
          session={editingSession}
          defaultVesselId={activeTargetId}
          defaultStandard={currentTarget?.standard || 'DOC'}
          onSaved={(savedSession) => {
            setSessionModalOpen(false);
            setEditingSession(null);
            if (savedSession?.vesselId && savedSession.vesselId !== activeTargetId) {
              setActiveTargetId(savedSession.vesselId);
            } else if (!savedSession?.vesselId && activeTargetId !== 'office') {
              setActiveTargetId('office');
            }
            setVesselTab('checklist');
            showToast(`✓ Sesi ${savedSession.auditNo} siap! Silakan lanjutkan pemeriksaan klausul di Dashboard Tahap 2.`, 'info');
          }}
          onClose={() => {
            setSessionModalOpen(false);
            setEditingSession(null);
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL AUDIT FINDINGS (CATAT TEMUAN NC)                                    */}
      {/* ========================================================================= */}
      {findingModalOpen && (
        <AuditFindingModal
          finding={editingFinding}
          defaultAuditId={findingDefaultAuditId}
          defaultVesselId={activeTargetId}
          onClose={() => {
            setFindingModalOpen(false);
            setEditingFinding(null);
            setFindingDefaultAuditId(null);
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL SUBMIT EVIDEN PERBAIKAN                                             */}
      {/* ========================================================================= */}
      {evidenceModalOpen && evidenceTargetFinding && (
        <SubmitEvidenceModal
          finding={evidenceTargetFinding}
          onClose={() => {
            setEvidenceModalOpen(false);
            setEvidenceTargetFinding(null);
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL NOTIFIKASI WHATSAPP NC OPEN / NC CLOSE                              */}
      {/* ========================================================================= */}
      {notificationModalFinding && (
        <AuditNotificationModal
          finding={notificationModalFinding}
          onClose={() => setNotificationModalFinding(null)}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL CETAK LAPORAN AUDIT RESMI (DOC/SMC, NCR CLOSEOUT & CHECKLIST)       */}
      {/* ========================================================================= */}
      {reportModalOpen && (
        <AuditReportModal
          session={reportModalSession}
          finding={reportModalFinding}
          initialMode={reportModalMode}
          onClose={() => {
            setReportModalOpen(false);
            setReportModalSession(null);
            setReportModalFinding(null);
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL BAGAN ALUR KERJA DPA & NAKHODA (INTERAKTIF & MATRIKS RACI)          */}
      {/* ========================================================================= */}
      <AuditRoleFlowModal
        isOpen={showRoleFlowModal}
        onClose={() => setShowRoleFlowModal(false)}
        currentPerspective={auditRolePerspective}
        onSelectPerspective={(p) => setAuditRolePerspective(p)}
      />

      {/* Modal Preview Bukti Audit Checklist Onboard */}
      {previewChecklistEvidence && (
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
      )}

      {/* ========================================================================= */}
      {/* MODAL EDIT BUTIR CHECKLIST AUDIT                                         */}
      {/* ========================================================================= */}
      {editingManagerItem && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 16000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '680px',
            background: 'var(--bg-surface-card)',
            backgroundColor: 'var(--bg-surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '1.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxHeight: '90vh',
            overflowY: 'auto',
            opacity: 1
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ padding: '0.45rem', borderRadius: '8px', background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7' }}>
                  <Edit2 size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                    Edit Butir Pemeriksaan Checklist
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Target: <strong style={{ color: 'var(--text-main)' }}>{currentTarget?.name}</strong>
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingManagerItem(null)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.35rem 0.5rem' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEditManagerItem} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr 130px', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    No. / Kode *
                  </label>
                  <input
                    type="text"
                    required
                    value={editManagerCode}
                    onChange={(e) => setEditManagerCode(e.target.value)}
                    className="input-control mono"
                    style={{ fontWeight: 800, color: '#0284c7' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Area Pemeriksaan / Items to be checked *
                  </label>
                  <input
                    type="text"
                    required
                    value={editManagerName}
                    onChange={(e) => setEditManagerName(e.target.value)}
                    className="input-control"
                    style={{ fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Ref. ISM Code
                  </label>
                  <input
                    type="text"
                    value={editManagerIsmCode}
                    onChange={(e) => setEditManagerIsmCode(e.target.value)}
                    placeholder="cth: 10, 5.1"
                    className="input-control mono"
                    style={{ color: '#0284c7' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  Kriteria Verifikasi / Check Point Pemeriksaan
                </label>
                <textarea
                  rows={3}
                  value={editManagerCheckPoint}
                  onChange={(e) => setEditManagerCheckPoint(e.target.value)}
                  placeholder="Detail dokumen, peralatan, sertifikat, atau prosedur yang diverifikasi..."
                  className="input-control"
                  style={{ fontSize: '0.8rem', lineHeight: '1.4', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  Hasil Evaluasi (Checklist)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {[
                    { id: 'Complied', label: '✅ Yes (Sesuai)', bg: '#10b981' },
                    { id: 'Minor NC', label: '⚠️ Minor NC (No)', bg: '#f59e0b' },
                    { id: 'Major NC', label: '🚨 Major NC (No)', bg: '#dc2626' },
                    { id: 'Observation', label: '👁️ Observasi', bg: '#6366f1' },
                    { id: 'N/A', label: '⚪ N/A (Tidak Berlaku)', bg: '#64748b' },
                    { id: '', label: '⭕ Kosongkan', bg: 'var(--border-subtle)' }
                  ].map(opt => {
                    const isSelected = editManagerResult === opt.id || (opt.id === 'Complied' && editManagerResult === 'Yes');
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setEditManagerResult(opt.id)}
                        style={{
                          padding: '0.3rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: isSelected ? 800 : 500,
                          cursor: 'pointer',
                          border: isSelected ? `2px solid ${opt.bg}` : '1px solid var(--border-subtle)',
                          background: isSelected ? opt.bg : 'var(--bg-surface-elevated)',
                          color: isSelected ? '#ffffff' : 'var(--text-main)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  Catatan / Temuan Bukti Fisik
                </label>
                <textarea
                  rows={2}
                  value={editManagerNotes}
                  onChange={(e) => setEditManagerNotes(e.target.value)}
                  placeholder="Catatan temuan atau catatan fisik..."
                  className="input-control"
                  style={{ fontSize: '0.8rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => setEditingManagerItem(null)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.45rem 1rem' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ padding: '0.45rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                >
                  <Save size={14} />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL KONFIRMASI HAPUS BUTIR CHECKLIST                                   */}
      {/* ========================================================================= */}
      {deleteManagerItemTarget && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 16000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '440px',
            background: 'var(--bg-surface-card)',
            backgroundColor: 'var(--bg-surface-card)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '14px',
            padding: '1.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            opacity: 1
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                <Trash2 size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  Hapus Butir Checklist?
                </h4>
                <span className="mono" style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700 }}>
                  {deleteManagerItemTarget.code} - {deleteManagerItemTarget.name}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Butir pemeriksaan ini akan dihapus dari daftar checklist {currentTarget?.name}. Apakah Anda yakin?
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.35rem' }}>
              <button
                type="button"
                onClick={() => setDeleteManagerItemTarget(null)}
                className="btn btn-secondary btn-sm"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteManagerItem}
                className="btn btn-sm"
                style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={13} />
                <span>Ya, Hapus Butir</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* IN-APP CONFIRMATION MODAL FOR DELETION (NO BLOCKED WINDOW.CONFIRM)        */}
      {/* ========================================================================= */}
      {deleteConfirmModal && (
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
          onClick={() => setDeleteConfirmModal(null)}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: '480px',
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
            {/* Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface-elevated)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
                flexShrink: 0
              }}>
                <Trash2 size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  {deleteConfirmModal.title}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 700, margin: '0.15rem 0 0 0' }}>
                  Tindakan ini permanen & tidak dapat dibatalkan
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteConfirmModal(null)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.3rem 0.5rem' }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                  {deleteConfirmModal.type === 'session' ? 'Nomor Sesi Audit:' : 'Nomor Temuan:'}
                </div>
                <div className="mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ef4444' }}>
                  {deleteConfirmModal.code}
                </div>
                {deleteConfirmModal.targetName && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Target Armada: <strong style={{ color: 'var(--text-main)' }}>{deleteConfirmModal.targetName}</strong>
                  </div>
                )}
              </div>

              <p style={{ fontSize: '0.82rem', lineHeight: '1.55', color: 'var(--text-muted)', margin: 0 }}>
                {deleteConfirmModal.details}
              </p>
            </div>

            {/* Footer */}
            <div style={{
              padding: '1rem 1.5rem',
              background: 'var(--bg-surface-elevated)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem'
            }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmModal(null)}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={deleteConfirmModal.onConfirm}
                className="btn"
                style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={14} />
                <span>Ya, Hapus Permanen</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
