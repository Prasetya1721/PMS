import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { usePMS } from '../../context/PMSContext';
import { getRoleGuidance } from './logic/getRoleGuidance';
import { handleLoadSampleSMCAudit } from './logic/handleLoadSampleSMCAudit';
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
import { makeId } from '../../utils/idUtils';

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
      id: makeId('custom'),
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
            handleLoadSampleSMCAudit={() => handleLoadSampleSMCAudit(
              isAuditorOrDPA,
              showToast,
              currentTarget,
              activeChecklistItems,
              addAuditSession,
              addAuditFinding,
              setVesselChecklistResults,
              setVesselChecklistNotes,
              setVesselTab
            )}
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

