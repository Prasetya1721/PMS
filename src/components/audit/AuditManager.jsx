import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  ShieldCheck,
  Building2,
  Ship,
  Users,
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
  BookOpen,
  Lock,
  Unlock,
  ShieldAlert
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
import { hasAccess } from '../../utils/rbac';

import { RolePermissionBar } from './sections/RolePermissionBar';
import { StandardSwitcher } from './sections/StandardSwitcher';
import { FleetGateway } from './sections/FleetGateway';
import { VesselNavBar } from './sections/VesselNavBar';
import { VesselHeroHeader } from './sections/VesselHeroHeader';
import { NCStatusBanner } from './sections/NCStatusBanner';
import { LifecycleStepper } from './sections/LifecycleStepper';
import { FindingsTab } from './tabs/FindingsTab';
import { SessionsTab } from './tabs/SessionsTab';
import { ChecklistTab } from './tabs/ChecklistTab';
import { CapaTab } from './tabs/CapaTab';
import { ReportingTab } from './tabs/ReportingTab';
import { IntegrationsTab } from './tabs/IntegrationsTab';
import { SessionModalHost } from './modals/SessionModalHost';
import { FindingModalHost } from './modals/FindingModalHost';
import { EvidenceModalHost } from './modals/EvidenceModalHost';
import { NotificationModalHost } from './modals/NotificationModalHost';
import { ReportModalHost } from './modals/ReportModalHost';
import { RoleFlowModalHost } from './modals/RoleFlowModalHost';
import { EvidencePreviewModal } from './modals/EvidencePreviewModal';
import { EditChecklistItemModal } from './modals/EditChecklistItemModal';
import { DeleteChecklistItemModal } from './modals/DeleteChecklistItemModal';
import { DeleteConfirmModal } from './modals/DeleteConfirmModal';

export const AuditManager = ({ initialStandard = null }) => {
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
    smcOpenNCCount,
    docOpenNCCount,
    currentUser,
    currentRole,
    canAction,
    hasPermission,
    setActiveTab,
    showToast
  } = usePMS();

  // Role & Permission Determination (ISM Code RBAC & Boundaries)
  const userRole = currentUser?.role || currentRole || '';
  const isAuditorOrDPA = userRole === 'Super Admin' || userRole === 'Fleet Manager' || (canAction && canAction('create_audit_session'));
  const isNakhoda = userRole.toLowerCase().includes('nakhoda') || userRole.toLowerCase().includes('master');
  const isChiefEngineer = userRole.toLowerCase().includes('chief') || userRole.toLowerCase().includes('kkm') || userRole.toLowerCase().includes('teknisi');
  const isShipCrew = isNakhoda || isChiefEngineer;
  const assignedVesselId = currentUser?.shipAccess && currentUser?.shipAccess !== 'All' ? currentUser?.shipAccess : null;
  const isModuleAllowed = hasAccess(currentRole, 'audit');

  // Active Standard: 'SMC' (Kapal Armada) | 'DOC' (Kantor Perusahaan)
  // Awak kapal dibatasi hanya untuk SMC dan kapal tugasnya
  const [activeStandard, setActiveStandard] = useState(() => {
    if (assignedVesselId) return 'SMC';
    return initialStandard === 'DOC' ? 'DOC' : 'SMC';
  });

  // Selected Target in Audit Gateway:
  // null = Layar Pemilihan Kapal (Gateway SMC)
  // 'office' = Kantor Pusat PT. PBK (Audit DOC)
  // 'v-xxx' = Kapal Armada tertentu (Audit SMC)
  const [activeTargetId, setActiveTargetId] = useState(() => {
    if (assignedVesselId) return assignedVesselId;
    if (initialStandard === 'DOC') return 'office';
    return null;
  });

  // Keep state synchronized if initialStandard changes or if restricted by assigned vessel
  useEffect(() => {
    if (assignedVesselId) {
      setActiveStandard('SMC');
      setActiveTargetId(assignedVesselId);
      return;
    }
    if (initialStandard === 'DOC') {
      setActiveStandard('DOC');
      setActiveTargetId('office');
    } else if (initialStandard === 'SMC') {
      setActiveStandard('SMC');
      if (activeTargetId === 'office') {
        setActiveTargetId(null);
      }
    }
  }, [initialStandard, assignedVesselId]);

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

  // Helper deskripsi tanggung jawab peran sesuai tahap aktif terpisah untuk SMC dan DOC
  const getRoleGuidance = (tab, role, standard = 'SMC') => {
    const isDoc = standard === 'DOC';

    if (isDoc) {
      // PANDUAN DEDIKASI AUDIT DOC (KANTOR PUSAT PERUSAHAAN PT. PBK)
      if (role === 'dpa') {
        switch (tab) {
          case 'sessions':
            return 'DPA & Lead Auditor merencanakan audit Sistem Manajemen Keselamatan (SMS) Kantor Pusat PT. PBK, menyusun Audit Plan tiap departemen darat (Direksi, HR/Crewing, Teknis, Logistik, HSSE), dan menetapkan jadwal Opening Meeting.';
          case 'checklist':
            return 'Auditor mengevaluasi pemenuhan 13 Seksi ISM Code Standar BKI F23.14.05 Rev 06 untuk Kantor Pusat: memverifikasi manual SMS darat, komitmen direksi, kualifikasi personel, kesiapsiagaan ERT darat, dan pengadaan logistik kapal.';
          case 'findings':
            return 'Auditor merumuskan temuan audit kantor (Major NC, Minor NC, atau Observation) terhadap kesenjangan prosedur darat dengan implementasi nyata pada berkas administrasi dan dukungan armada.';
          case 'capa':
            return 'DPA mengevaluasi usulan CAPA dari Kepala Departemen darat, memastikan akar masalah (RCA) prosedural tertangani, memverifikasi revisi SOP/rekaman darat, dan mengesahkan penutupan temuan (Close NC).';
          case 'reporting':
            return 'Lead Auditor & DPA menerbitkan Laporan Resmi Audit DOC Kantor Pusat, mempresentasikan evaluasi SMS pada Rapat Tinjauan Manajemen (Management Review), dan merekomendasikan penerbitan/pembaruan sertifikat DOC ke BKI / Ditjen Hubla.';
          default:
            return 'DPA memantau kepatuhan tata kelola SMS darat, pemenuhan audit internal departemen, dan sertifikasi DOC perusahaan.';
        }
      } else {
        switch (tab) {
          case 'sessions':
            return 'Kepala Departemen Darat & Manajemen menghadiri Opening Meeting, menyiapkan rekaman kerja (HR/Crewing, Logistik, Teknis, HSSE), dan menugaskan PIC pendamping auditor di kantor pusat.';
          case 'checklist':
            return 'Kepala Departemen Darat menyajikan bukti objektif implementasi SMS kantor: berkas rekrutmen/evaluasi kru, rekaman drill darat (ERT), approval purchase order kapal, dan laporan supervisi superintendent.';
          case 'findings':
            return 'Kepala Departemen Darat menerima dan membahas temuan ketidaksesuaian prosedur operasional kantor bersama auditor, mengklarifikasi fakta, dan menandatangani lembar konfirmasi temuan NCR.';
          case 'capa':
            return 'Kepala Departemen Darat menganalisis akar masalah (Root Cause Analysis), memperbarui instruksi kerja/SOP kantor, mengunggah bukti perbaikan rekaman darat, dan menyerahkan berkas CAPA kepada DPA.';
          case 'reporting':
            return 'Manajemen Darat & Direksi menghadiri Closing Meeting, menyetujui hasil evaluasi efektivitas SMS, menindaklanjuti rekomendasi pada Rapat Tinjauan Manajemen, serta mengarsipkan laporan audit DOC.';
          default:
            return 'Manajemen Darat memastikan seluruh departemen kantor pusat mematuhi regulasi ISM Code dan memberikan dukungan penuh bagi keselamatan kapal di laut.';
        }
      }
    } else {
      // PANDUAN DEDIKASI AUDIT SMC (KAPAL ARMADA ONBOARD)
      if (role === 'dpa') {
        switch (tab) {
          case 'sessions':
            return 'DPA merencanakan audit internal SMC kapal armada, menetapkan Lead Auditor independen, menentukan tanggal kedatangan di pelabuhan/galangan, dan mengirimkan notifikasi resmi ke Nakhoda.';
          case 'checklist':
            return 'DPA / Auditor memverifikasi pemenuhan 74 Butir Klausul SMC Kapal Standar BKI F23.14.06 Rev 05: uji fungsi fisik navigasi anjungan, mesin, LSA/FFA, drill darurat awak kapal, dan kesesuaian logbook dengan PMS.';
          case 'findings':
            return 'DPA / Auditor meninjau daftar temuan fisik maupun operasional kapal, menetapkan derajat ketidaksesuaian (Major/Minor/Obs), menentukan target batas waktu (Due Date), dan menerbitkan form NCR ke Nakhoda.';
          case 'capa':
            return 'DPA memeriksa bukti foto/video fisik perbaikan yang dikirimkan oleh Nakhoda dari kapal, mengevaluasi efektivitas tindakan perbaikan (CAPA), dan mengesahkan penutupan temuan (Close NC).';
          case 'reporting':
            return 'DPA menetapkan Deklarasi Kelaiklautan (Fit to Sail / SMC Full Compliance), mengunci sesi audit kapal menjadi Completed, dan menandatangani Laporan Eksekutif SMC.';
          default:
            return 'DPA memantau kepatuhan sertifikat statutory kapal dan ketersediaan suku cadang kritis armada.';
        }
      } else {
        switch (tab) {
          case 'sessions':
            return 'Nakhoda bertindak selaku Auditee Resmi Onboard, menyelenggarakan Opening Meeting di kapal, mengonfirmasi kesiapan kru kapal, dan menyiapkan dokumen SMS di anjungan.';
          case 'checklist':
            return 'Nakhoda mendampingi auditor saat inspeksi fisik geladak, kamar mesin, pengujian alat keselamatan (LSA/FFA), peragaan drill darurat, serta verifikasi logbook navigasi dan perawatan PMS.';
          case 'findings':
            return 'Nakhoda menerima daftar ketidaksesuaian yang ditemukan auditor di kapal, memahami butir klausul yang terlanggar, dan menandatangani Berita Acara Temuan Lapangan.';
          case 'capa':
            return 'Nakhoda memimpin perbaikan fisik onboard (Correction), menganalisis akar masalah (RCA), menyusun langkah pencegahan, melampirkan foto bukti pengerjaan, dan mengirimkan eviden ke DPA.';
          case 'reporting':
            return 'Nakhoda menghadiri Closing Meeting di anjungan, menandatangani lembar penerimaan laporan audit, mengonfirmasi status Fit to Sail, dan mengarsipkan dokumen di anjungan kapal.';
          default:
            return 'Nakhoda memastikan masa berlaku sertifikat kapal aktif dan permintaan logistik suku cadang telah diajukan ke kantor darat.';
        }
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
      const strikedMap = {};
      activeSession.checklist.forEach(item => {
        if (item.code) {
          if (item.result) resultsMap[item.code] = item.result;
          if (item.notes) notesMap[item.code] = item.notes;
          if (item.evidence) evidenceMap[item.code] = item.evidence;
          if (item.isStrikethrough !== undefined) strikedMap[item.code] = Boolean(item.isStrikethrough);
        }
      });
      setVesselChecklistResults(resultsMap);
      setVesselChecklistNotes(notesMap);
      setChecklistEvidenceMap(evidenceMap);
      setVesselStrikethroughOverrides(strikedMap);
    } else {
      // Default kosongkan jika belum ada audit atau belum ada checklist tersimpan
      setVesselChecklistResults({});
      setVesselChecklistNotes({});
      setChecklistEvidenceMap({});
      setVesselStrikethroughOverrides({});
    }
  }, [activeSession?.id, activeTargetId]);

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

  // Helper sinkronisasi data sesi audit dengan seluruh form dan state aktif (Checklist, Sertifikat, Spek Kapal/DOC)
  const getEnrichedReportSession = useCallback((baseSession = null) => {
    const raw = baseSession || activeSession || currentTarget?.lastAudit || {};
    const isDoc = (raw.standard || currentTarget?.standard) === 'DOC';

    // 1. Sinkronisasi checklist: gabungkan activeChecklistItems dengan live state (results, notes, strikethrough, evidence)
    const mergedChecklist = (activeChecklistItems || []).map(item => {
      const isStriked = vesselStrikethroughOverrides[item.code] !== undefined
        ? vesselStrikethroughOverrides[item.code]
        : (item.isStrikethrough !== undefined ? Boolean(item.isStrikethrough) : false);

      const res = vesselChecklistResults[item.code] !== undefined
        ? vesselChecklistResults[item.code]
        : (isStriked ? 'N/A' : (item.result || ''));

      const note = vesselChecklistNotes[item.code] !== undefined
        ? vesselChecklistNotes[item.code]
        : (item.notes || item.remark || '');

      const ev = checklistEvidenceMap[item.code] || item.evidence || null;

      return {
        ...item,
        result: res,
        notes: note,
        remark: note,
        isStrikethrough: Boolean(isStriked),
        evidence: ev
      };
    });

    // 2. Data kapal teknis jika SMC
    const vesselObj = currentTarget?.type !== 'office' ? currentTarget : null;

    // 3. Sertifikat & Departemen
    const docDept = raw.docDepartment || (isDoc ? 'Divisi DPA, QHSE & Operasional Armada Darat' : null);
    const docCert = raw.docCertificateNo || (isDoc ? `DOC-IDN-PBK/${new Date().getFullYear()}-R1` : null);
    const smcCert = raw.smcCertificateNo || (!isDoc && vesselObj ? (vesselObj.smcCertificateNo || `SMC-TB-${(vesselObj.name || '').replace(/\s+/g, '')}/${new Date().getFullYear()}`) : null);

    return {
      ...raw,
      id: raw.id || `aud-${currentTarget?.id || 'target'}-${Date.now()}`,
      auditNo: raw.auditNo || `AUD-${currentTarget?.standard || 'SMC'}-${(currentTarget?.name || 'TARGET').replace(/\s+/g, '')}-${new Date().getFullYear()}`,
      reportId: raw.reportId || raw.auditNo || (isDoc ? '0858-PK/ISM-DOC/2026' : '0859-PK/ISM-SMC/2026'),
      auditType: raw.auditType || 'Internal',
      externalOrganization: raw.externalOrganization || (raw.auditType === 'External' ? 'Biro Klasifikasi Indonesia (BKI)' : 'PT. Pelayaran Baharimas Kalimantan (Internal DPA / QHSE)'),
      standard: raw.standard || currentTarget?.standard || (isDoc ? 'DOC' : 'SMC'),
      targetType: raw.targetType || (isDoc ? 'Office' : 'Vessel'),
      targetName: raw.targetName || currentTarget?.name || (isDoc ? 'Kantor Pusat PT. Pelayaran Baharimas Kalimantan' : 'Armada Kapal'),
      vesselId: raw.vesselId || (isDoc ? null : currentTarget?.id),
      docDepartment: docDept,
      docCertificateNo: docCert,
      smcCertificateNo: smcCert,
      leadAuditor: raw.leadAuditor || 'Capt. Marine Safety Inspector (Lead Auditor)',
      auditTeam: raw.auditTeam && (Array.isArray(raw.auditTeam) ? raw.auditTeam.length > 0 : Boolean(raw.auditTeam))
        ? raw.auditTeam
        : ['Safety Officer PBK', 'Marine Superintendent'],
      auditee: raw.auditee || (isDoc ? 'Direktur Operasional, DPA & Para Manager Darat' : `Nakhoda & KKM ${currentTarget?.name || 'Kapal'}`),
      auditLocation: raw.auditLocation || (isDoc ? 'Kantor Pusat PT. Pelayaran Baharimas Kalimantan (Pontianak)' : `Onboard ${currentTarget?.name || 'Kapal Armada'}`),
      auditDate: raw.auditDate || new Date().toISOString().split('T')[0],
      targetCloseDate: raw.targetCloseDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      scope: raw.scope || (isDoc
        ? 'Audit Kepatuhan Tahunan Sistem Manajemen Keselamatan Darat (DOC) PT. PBK mencakup 13 Seksi BKI DOC Rev 06 / ISM Code 2025.'
        : `Audit Kelaikan Sistem Manajemen Keselamatan (SMC) Kapal Onboard sesuai IMO Res. A.741(18) / ISM Code dan BKI SMS Shipboard Checklist Rev 05.`),
      status: raw.status || 'In Progress',
      checklist: mergedChecklist.length > 0 ? mergedChecklist : (raw.checklist || []),
      totalItemsChecked: mergedChecklist.length || raw.totalItemsChecked || 0,
      itemsComplied: mergedChecklist.filter(c => c.result === 'Complied' || c.result === 'Yes').length || raw.itemsComplied || 0,
      imo: raw.imo || vesselObj?.imo || vesselObj?.regNo || '-',
      callSign: raw.callSign || vesselObj?.callSign || '-',
      gt: raw.gt || vesselObj?.gt || '-',
      portOfRegistry: raw.portOfRegistry || vesselObj?.portOfRegistry || 'PONTIANAK'
    };
  }, [
    activeSession,
    currentTarget,
    activeChecklistItems,
    vesselStrikethroughOverrides,
    vesselChecklistResults,
    vesselChecklistNotes,
    checklistEvidenceMap
  ]);

  // Handler Inisiasi Cepat Sesi Audit (1-Click Launch)
  const handleQuickLaunchSession = () => {
    if (!isAuditorOrDPA) {
      showToast('Wewenang DPA: Sesi audit kapal hanya dapat diinisiasi oleh Lead Auditor atau DPA dari kantor darat.', 'warning');
      return;
    }
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
    if (!isAuditorOrDPA) {
      showToast('Wewenang DPA: Pemuatan simulasi data audit hanya diizinkan untuk DPA / Lead Auditor.', 'warning');
      return;
    }
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
    if (!isAuditorOrDPA) {
      showToast('Wewenang Auditor: Pencatatan temuan NC resmi merupakan wewenang Lead Auditor saat inspeksi.', 'warning');
      return;
    }
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
    if (!isAuditorOrDPA) {
      showToast('Wewenang Auditor: Evaluasi checklist (Yes / No / N/A) hanya dapat diubah oleh Lead Auditor saat inspeksi.', 'warning');
      return;
    }
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
    if (!isAuditorOrDPA) {
      showToast('Wewenang Auditor: Pengubahan butir klausul hanya dapat dilakukan oleh Lead Auditor.', 'warning');
      return;
    }
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
    if (!isAuditorOrDPA) {
      showToast('Wewenang Auditor: Pengubahan butir klausul hanya dapat dilakukan oleh Lead Auditor.', 'warning');
      return;
    }
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
    if (!isAuditorOrDPA) {
      showToast('Wewenang Auditor: Penghapusan butir checklist hanya dapat dilakukan oleh Lead Auditor.', 'warning');
      return;
    }
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
    if (!isAuditorOrDPA) {
      showToast('Wewenang Auditor: Klausul checklist (N/A) hanya dapat dicoret atau diaktifkan kembali oleh Lead Auditor / DPA.', 'warning');
      return;
    }
    const item = activeChecklistItems.find(i => i.code === code) || customChecklistItems.find(i => i.code === code);
    const currentlyStriked = vesselStrikethroughOverrides[code] !== undefined
      ? vesselStrikethroughOverrides[code]
      : Boolean(item?.isStrikethrough);
    const nextStriked = !currentlyStriked;

    setVesselStrikethroughOverrides(prev => ({
      ...prev,
      [code]: nextStriked
    }));

    const nextRes = nextStriked ? 'N/A' : (vesselChecklistResults[code] === 'N/A' ? '' : (vesselChecklistResults[code] || ''));
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

  // SMC Targets (Kapal Armada only - Kantor Pusat DOC dipisahkan khusus di tab Audit DOC)
  const smcTargets = useMemo(() => {
    const list = allFleetTargets.filter(t => t.type === 'vessel');
    if (assignedVesselId) {
      return list.filter(t => t.id === assignedVesselId);
    }
    return list;
  }, [allFleetTargets, assignedVesselId]);

  // Global fleet KPI stats (Khusus armada kapal SMC pada layar gateway)
  const fleetStats = useMemo(() => {
    const totalTargets = smcTargets.length;
    const totalOpen = smcTargets.reduce((acc, t) => acc + t.openNC, 0);
    const totalSubmitted = smcTargets.reduce((acc, t) => acc + t.submittedNC, 0);
    const totalClosed = smcTargets.reduce((acc, t) => acc + t.closedNC, 0);
    const totalSessions = (allAudits || []).filter(a => a.standard !== 'DOC' && a.vesselId).length;
    const cleanTargets = smcTargets.filter(t => t.openNC === 0).length;
    const complianceRate = totalTargets > 0 ? Math.round((cleanTargets / totalTargets) * 100) : 100;
    const totalOverdue = smcTargets.reduce((acc, t) => acc + (t.timeStats?.overdueCount || 0), 0);

    // Fleet-wide average resolution days for closed NC
    let totalClosedDays = 0;
    let closedCount = 0;
    (allAuditFindings || []).filter(f => f.status === 'NC Close' && f.standard !== 'DOC' && f.vesselId).forEach(f => {
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
  }, [smcTargets, allAudits, allAuditFindings]);

  // Filtered targets for the gateway grid (Hanya kapal armada SMC)
  const filteredGatewayTargets = useMemo(() => {
    return smcTargets.filter(target => {
      // Category filter
      if (gatewayFilter === 'HAS_OPEN_NC' && target.openNC === 0) return false;
      if (gatewayFilter === 'HAS_SUBMITTED' && target.submittedNC === 0) return false;
      if (gatewayFilter === 'CLEAN' && target.openNC > 0) return false;
      if (gatewayFilter === 'OWNER' && target.ownership !== 'As Owner') return false;
      if (gatewayFilter === 'OPERATOR' && target.ownership !== 'As Operator') return false;

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
  }, [smcTargets, gatewayFilter, gatewaySearch]);

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
    if (assignedVesselId && targetId !== assignedVesselId) {
      showToast(`Akses dibatasi: Anda hanya memiliki izin akses untuk kapal tugas ${currentTarget?.name || assignedVesselId}.`, 'warning');
      return;
    }
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
    if (!isAuditorOrDPA) {
      showToast('Wewenang Auditor: Penambahan butir checklist manual hanya dapat dilakukan oleh Lead Auditor.', 'warning');
      return;
    }
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

  // If user role is completely restricted from audit module (e.g. Finance, HR, ABK without ship access)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>

      <RolePermissionBar
        assignedVesselId={assignedVesselId}
        currentTarget={currentTarget}
        currentUser={currentUser}
        isAuditorOrDPA={isAuditorOrDPA}
        setShowRoleFlowModal={setShowRoleFlowModal}
        userRole={userRole}
        vessels={vessels}
      />

      <StandardSwitcher
        activeStandard={activeStandard}
        activeTargetId={activeTargetId}
        assignedVesselId={assignedVesselId}
        docOpenNCCount={docOpenNCCount}
        isAuditorOrDPA={isAuditorOrDPA}
        setActiveStandard={setActiveStandard}
        setActiveTargetId={setActiveTargetId}
        setVesselTab={setVesselTab}
        showToast={showToast}
        smcOpenNCCount={smcOpenNCCount}
      />

      {!activeTargetId && (
        <FleetGateway
        filteredGatewayTargets={filteredGatewayTargets}
        fleetStats={fleetStats}
        gatewayFilter={gatewayFilter}
        gatewaySearch={gatewaySearch}
        handleSelectTarget={handleSelectTarget}
        isAuditorOrDPA={isAuditorOrDPA}
        operatorCount={operatorCount}
        ownerCount={ownerCount}
        setEditingFinding={setEditingFinding}
        setEditingSession={setEditingSession}
        setFindingDefaultAuditId={setFindingDefaultAuditId}
        setFindingModalOpen={setFindingModalOpen}
        setGatewayFilter={setGatewayFilter}
        setGatewaySearch={setGatewaySearch}
        setSessionModalOpen={setSessionModalOpen}
        smcTargets={smcTargets}
      />
      )}

      {activeTargetId && currentTarget && (
        <>
          <VesselNavBar
            activeStandard={activeStandard}
            activeTargetId={activeTargetId}
            assignedVesselId={assignedVesselId}
            currentTarget={currentTarget}
            handleSelectTarget={handleSelectTarget}
            setActiveStandard={setActiveStandard}
            setActiveTargetId={setActiveTargetId}
            smcTargets={smcTargets}
          />
          <VesselHeroHeader currentTarget={currentTarget} />
          <NCStatusBanner
            currentTarget={currentTarget}
            setNotificationModalFinding={setNotificationModalFinding}
            setStatusFilter={setStatusFilter}
            setVesselTab={setVesselTab}
          />
          <LifecycleStepper
            activeSession={activeSession}
            auditRolePerspective={auditRolePerspective}
            checklistProgress={checklistProgress}
            currentTarget={currentTarget}
            currentTargetCertificates={currentTargetCertificates}
            currentTargetRequisitions={currentTargetRequisitions}
            getRoleGuidance={getRoleGuidance}
            handleLoadSampleSMCAudit={handleLoadSampleSMCAudit}
            handleQuickLaunchSession={handleQuickLaunchSession}
            isAuditorOrDPA={isAuditorOrDPA}
            setAuditRolePerspective={setAuditRolePerspective}
            setShowRoleFlowModal={setShowRoleFlowModal}
            setStatusFilter={setStatusFilter}
            setVesselTab={setVesselTab}
            vesselTab={vesselTab}
          />
          {vesselTab === 'findings' && (
            <FindingsTab
            activeSession={activeSession}
            allAudits={allAudits}
            currentTarget={currentTarget}
            currentTargetFilteredFindings={currentTargetFilteredFindings}
            deleteAuditFinding={deleteAuditFinding}
            getEnrichedReportSession={getEnrichedReportSession}
            inVesselSearch={inVesselSearch}
            isAuditorOrDPA={isAuditorOrDPA}
            setDeleteConfirmModal={setDeleteConfirmModal}
            setEditingFinding={setEditingFinding}
            setEvidenceModalOpen={setEvidenceModalOpen}
            setEvidenceTargetFinding={setEvidenceTargetFinding}
            setFindingDefaultAuditId={setFindingDefaultAuditId}
            setFindingModalOpen={setFindingModalOpen}
            setInVesselSearch={setInVesselSearch}
            setNotificationModalFinding={setNotificationModalFinding}
            setReportModalFinding={setReportModalFinding}
            setReportModalMode={setReportModalMode}
            setReportModalOpen={setReportModalOpen}
            setReportModalSession={setReportModalSession}
            setSeverityFilter={setSeverityFilter}
            setStatusFilter={setStatusFilter}
            severityFilter={severityFilter}
            statusFilter={statusFilter}
          />
          )}
          {vesselTab === 'sessions' && (
            <SessionsTab
            activeSession={activeSession}
            currentTarget={currentTarget}
            deleteAuditSession={deleteAuditSession}
            getEnrichedReportSession={getEnrichedReportSession}
            isAuditorOrDPA={isAuditorOrDPA}
            setDeleteConfirmModal={setDeleteConfirmModal}
            setEditingSession={setEditingSession}
            setReportModalMode={setReportModalMode}
            setReportModalOpen={setReportModalOpen}
            setReportModalSession={setReportModalSession}
            setSessionModalOpen={setSessionModalOpen}
            setVesselTab={setVesselTab}
          />
          )}
          {vesselTab === 'checklist' && (
            <ChecklistTab
            activeChecklistConfig={activeChecklistConfig}
            activeChecklistItems={activeChecklistItems}
            activeSession={activeSession}
            checklistEvidenceMap={checklistEvidenceMap}
            currentTarget={currentTarget}
            customChecklistItems={customChecklistItems}
            getEnrichedReportSession={getEnrichedReportSession}
            handleAddManualChecklistItem={handleAddManualChecklistItem}
            handleGenerateMockVesselChecklistEvidence={handleGenerateMockVesselChecklistEvidence}
            handleOpenEditManagerItem={handleOpenEditManagerItem}
            handleQuickLogNC={handleQuickLogNC}
            handleRemoveVesselChecklistEvidence={handleRemoveVesselChecklistEvidence}
            handleToggleManagerResult={handleToggleManagerResult}
            handleToggleVesselStrikethrough={handleToggleVesselStrikethrough}
            handleUploadVesselChecklistEvidence={handleUploadVesselChecklistEvidence}
            isAuditorOrDPA={isAuditorOrDPA}
            manualCode={manualCode}
            manualCriteria={manualCriteria}
            manualName={manualName}
            manualNotes={manualNotes}
            manualStatus={manualStatus}
            setDeleteManagerItemTarget={setDeleteManagerItemTarget}
            setManualCode={setManualCode}
            setManualCriteria={setManualCriteria}
            setManualName={setManualName}
            setManualNotes={setManualNotes}
            setManualStatus={setManualStatus}
            setPreviewChecklistEvidence={setPreviewChecklistEvidence}
            setReportModalFinding={setReportModalFinding}
            setReportModalMode={setReportModalMode}
            setReportModalOpen={setReportModalOpen}
            setReportModalSession={setReportModalSession}
            setShowManualCodeForm={setShowManualCodeForm}
            setVesselChecklistFilter={setVesselChecklistFilter}
            setVesselChecklistNotes={setVesselChecklistNotes}
            showManualCodeForm={showManualCodeForm}
            vesselChecklistFilter={vesselChecklistFilter}
            vesselChecklistNotes={vesselChecklistNotes}
            vesselChecklistResults={vesselChecklistResults}
            vesselDeletedCodes={vesselDeletedCodes}
            vesselItemOverrides={vesselItemOverrides}
            vesselStrikethroughOverrides={vesselStrikethroughOverrides}
          />
          )}
          {vesselTab === 'capa' && (
            <CapaTab
            activeSession={activeSession}
            auditRolePerspective={auditRolePerspective}
            capaFilter={capaFilter}
            closeAuditFinding={closeAuditFinding}
            currentTarget={currentTarget}
            currentUser={currentUser}
            getEnrichedReportSession={getEnrichedReportSession}
            isAuditorOrDPA={isAuditorOrDPA}
            setCapaFilter={setCapaFilter}
            setEvidenceModalOpen={setEvidenceModalOpen}
            setEvidenceTargetFinding={setEvidenceTargetFinding}
            setNotificationModalFinding={setNotificationModalFinding}
            setReportModalFinding={setReportModalFinding}
            setReportModalMode={setReportModalMode}
            setReportModalOpen={setReportModalOpen}
            setReportModalSession={setReportModalSession}
            showToast={showToast}
          />
          )}
          {vesselTab === 'reporting' && (
            <ReportingTab
            activeSession={activeSession}
            checklistProgress={checklistProgress}
            currentTarget={currentTarget}
            getEnrichedReportSession={getEnrichedReportSession}
            isAuditorOrDPA={isAuditorOrDPA}
            setReportModalFinding={setReportModalFinding}
            setReportModalMode={setReportModalMode}
            setReportModalOpen={setReportModalOpen}
            setReportModalSession={setReportModalSession}
            showToast={showToast}
            updateAuditSession={updateAuditSession}
          />
          )}
          {vesselTab === 'integrations' && (
            <IntegrationsTab
            currentTarget={currentTarget}
            currentTargetCertificates={currentTargetCertificates}
            currentTargetRequisitions={currentTargetRequisitions}
          />
          )}
        </>
      )}

      {sessionModalOpen && (
        <SessionModalHost
        activeStandard={activeStandard}
        activeTargetId={activeTargetId}
        currentTarget={currentTarget}
        editingSession={editingSession}
        setActiveTargetId={setActiveTargetId}
        setEditingSession={setEditingSession}
        setSessionModalOpen={setSessionModalOpen}
        setVesselTab={setVesselTab}
        showToast={showToast}
      />
      )}

      {findingModalOpen && (
        <FindingModalHost
        activeTargetId={activeTargetId}
        editingFinding={editingFinding}
        findingDefaultAuditId={findingDefaultAuditId}
        setEditingFinding={setEditingFinding}
        setFindingDefaultAuditId={setFindingDefaultAuditId}
        setFindingModalOpen={setFindingModalOpen}
      />
      )}

      {evidenceModalOpen && evidenceTargetFinding && (
        <EvidenceModalHost
        evidenceTargetFinding={evidenceTargetFinding}
        setEvidenceModalOpen={setEvidenceModalOpen}
        setEvidenceTargetFinding={setEvidenceTargetFinding}
      />
      )}

      {notificationModalFinding && (
        <NotificationModalHost
        notificationModalFinding={notificationModalFinding}
        setNotificationModalFinding={setNotificationModalFinding}
      />
      )}

      {reportModalOpen && (
        <ReportModalHost
        reportModalFinding={reportModalFinding}
        reportModalMode={reportModalMode}
        reportModalSession={reportModalSession}
        setReportModalFinding={setReportModalFinding}
        setReportModalOpen={setReportModalOpen}
        setReportModalSession={setReportModalSession}
      />
      )}

      <RoleFlowModalHost
        activeStandard={activeStandard}
        auditRolePerspective={auditRolePerspective}
        currentTarget={currentTarget}
        setAuditRolePerspective={setAuditRolePerspective}
        setShowRoleFlowModal={setShowRoleFlowModal}
        showRoleFlowModal={showRoleFlowModal}
      />

      {previewChecklistEvidence && (
        <EvidencePreviewModal
        previewChecklistEvidence={previewChecklistEvidence}
        setPreviewChecklistEvidence={setPreviewChecklistEvidence}
      />
      )}

      {editingManagerItem && (
        <EditChecklistItemModal
        currentTarget={currentTarget}
        editManagerCheckPoint={editManagerCheckPoint}
        editManagerCode={editManagerCode}
        editManagerIsmCode={editManagerIsmCode}
        editManagerName={editManagerName}
        editManagerNotes={editManagerNotes}
        editManagerResult={editManagerResult}
        handleSaveEditManagerItem={handleSaveEditManagerItem}
        setEditManagerCheckPoint={setEditManagerCheckPoint}
        setEditManagerCode={setEditManagerCode}
        setEditManagerIsmCode={setEditManagerIsmCode}
        setEditManagerName={setEditManagerName}
        setEditManagerNotes={setEditManagerNotes}
        setEditManagerResult={setEditManagerResult}
        setEditingManagerItem={setEditingManagerItem}
      />
      )}

      {deleteManagerItemTarget && (
        <DeleteChecklistItemModal
        currentTarget={currentTarget}
        deleteManagerItemTarget={deleteManagerItemTarget}
        handleConfirmDeleteManagerItem={handleConfirmDeleteManagerItem}
        setDeleteManagerItemTarget={setDeleteManagerItemTarget}
      />
      )}

      {deleteConfirmModal && (
        <DeleteConfirmModal deleteConfirmModal={deleteConfirmModal} setDeleteConfirmModal={setDeleteConfirmModal} />
      )}
    </div>
  );
};

