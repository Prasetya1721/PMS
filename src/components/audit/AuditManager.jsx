import React, { useState, useMemo } from 'react';
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
  Trash2,
  Upload,
  Check,
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
  Undo2
} from 'lucide-react';
import { AuditSessionModal } from './AuditSessionModal';
import { AuditFindingModal } from './AuditFindingModal';
import { SubmitEvidenceModal } from './SubmitEvidenceModal';
import { AuditNotificationModal } from './AuditNotificationModal';
import { AuditReportModal } from './AuditReportModal';
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
    deleteAuditSession,
    deleteAuditFinding,
    closeAuditFinding,
    vessels,
    selectedVesselId,
    setSelectedVesselId,
    shipDocuments,
    requisitions,
    ISM_DOC_ELEMENTS,
    openNCCount,
    closedNCCount,
    currentUser,
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
  const [vesselChecklistFilter, setVesselChecklistFilter] = useState('ALL'); // ALL | CORE | STRIKETHROUGH | HAS_EVIDENCE
  const [previewChecklistEvidence, setPreviewChecklistEvidence] = useState(null);


  // Override status coret/lepas coret pada checklist kapal
  const [vesselStrikethroughOverrides, setVesselStrikethroughOverrides] = useState({});

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

    setVesselChecklistResults(prev => ({
      ...prev,
      [code]: nextStriked ? 'N/A' : (prev[code] === 'N/A' ? 'Complied' : (prev[code] || 'Complied'))
    }));

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
    showToast(`✓ Simulasi bukti audit ${itemCode} berhasil dilampirkan!`, 'info');
  };

  const handleRemoveVesselChecklistEvidence = (itemCode) => {
    setChecklistEvidenceMap(prev => {
      const next = { ...prev };
      delete next[itemCode];
      return next;
    });
    showToast(`Bukti audit ${itemCode} dilepas`, 'info');
  };

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

    // 2. Ships Targets (28 vessels)
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

      return {
        id: v.id,
        type: 'vessel',
        name: v.name,
        subtitle: v.type,
        standard: 'SMC',
        ownership: v.ownershipStatus || 'As Owner',
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

  // Checklist aktif pada halaman "Formulir Checklist" target terpilih.
  //
  // Sumber butir ditentukan oleh LEMBAGA AUDIT EKSTERNAL pada sesi audit:
  //   - BKI  -> template resmi F23.14.06-2024 Rev 05 (termasuk butir bercoret)
  //   - lembaga lain -> array kosong, karena isi checklist antar lembaga berbeda
  //     dan harus disusun manual lewat "Tambah Item Manual".
  // Untuk standar DOC (audit kantor) tetap memakai elemen ISM_DOC_ELEMENTS.
  const activeChecklistConfig = useMemo(() => {
    if (!currentTarget) return getChecklistConfigForSession(null);
    const session = currentTarget.lastAudit || currentTarget.audits?.[0] || null;
    const org = session?.externalOrganization ?? null;
    if (currentTarget.standard === 'DOC') {
      if (org && isBKIOrganization(org)) {
        return getChecklistConfigForSession(org, 'DOC');
      }
      return {
        organizationId: 'dpa',
        organizationName: 'Audit Internal Kantor (DOC Standar ISM)',
        checked: true,
        items: ISM_DOC_ELEMENTS,
        note: ''
      };
    }
    return getChecklistConfigForSession(org, currentTarget.standard || 'SMC');
  }, [currentTarget, ISM_DOC_ELEMENTS]);

  // Butir checklist siap render untuk tabel UI.
  // Dinormalisasi dari activeChecklistConfig agar tabel cukup memakai
  // properti seragam (code / name / checkPoint / isStrikethrough).
  const activeChecklistItems = useMemo(
    () => (activeChecklistConfig.items || []).map(normalizeChecklistItem),
    [activeChecklistConfig]
  );

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

  // Relevant certificates for current target
  const currentTargetCertificates = useMemo(() => {
    if (!currentTarget) return [];
    if (currentTarget.id === 'office') {
      return (shipDocuments || []).filter(d => d.type?.toLowerCase().includes('doc') || d.category === 'Statutory' || d.vesselId === 'all');
    }
    return (shipDocuments || []).filter(d => d.vesselId === currentTarget.id);
  }, [shipDocuments, currentTarget]);

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
                    28 Kapal & Kantor Pusat PBK
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
                <span>+ Sesi Audit Baru</span>
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
                <span>+ Catat Temuan NC</span>
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
                28 <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Kapal + 1 DOC</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                17 As Owner • 11 As Operator PBK
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
                { id: 'OWNER', label: `⚓ As Owner (17)`, icon: Ship },
                { id: 'OPERATOR', label: `⚙️ As Operator (11)`, icon: Ship },
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

            {/* Vessel Action Buttons */}
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => {
                  const targetSession = currentTarget.audits?.find(s => s.status === 'Completed') || currentTarget.audits?.[0];
                  setReportModalSession(targetSession || null);
                  setReportModalFinding(null);
                  setReportModalMode('session');
                  setReportModalOpen(true);
                }}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#0284c7' }}
                title="Cetak Laporan Audit ISM Code Resmi (DOC/SMC Standar BKI & Ditjen Hubla)"
              >
                <Printer size={15} color="#0284c7" />
                <span>🖨️ Cetak Laporan Audit Resmi</span>
              </button>
              <button
                onClick={() => {
                  setEditingSession(null);
                  setSessionModalOpen(true);
                }}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
              >
                <Plus size={15} color="#38bdf8" />
                <span>+ Sesi Audit {currentTarget.name.split(' ')[0]}</span>
              </button>
              <button
                onClick={() => {
                  setEditingFinding(null);
                  setFindingDefaultAuditId(currentTarget.lastAudit?.id || null);
                  setFindingModalOpen(true);
                }}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
              >
                <AlertTriangle size={15} />
                <span>+ Catat Temuan NC Kapal Ini</span>
              </button>
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
            ) : (
              <div className="audit-notice-banner audit-notice-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    padding: '0.65rem',
                    borderRadius: '50%',
                    background: 'rgba(2, 132, 199, 0.2)',
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ShieldCheck size={26} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0284c7' }}>
                      🛡️ NOTIS KEPATUHAN: Status Kelaikan & Safety Management System Aman!
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.2rem', opacity: 0.9 }}>
                      Tidak ditemukan ketidaksesuaian terbuka pada <strong>{currentTarget.name}</strong>. Anda dapat menjadwalkan audit periodik atau memasukkan checklist manual.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setVesselTab('checklist')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontWeight: 700 }}
                >
                  Periksa Checklist Kapal
                </button>
              </div>
            )}
          </div>

          {/* Subtabs for this Vessel's Dedicated Menu — Terlihat Semua */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '0.65rem'
          }}>
            {[
              { id: 'findings', label: `1. Temuan NC Kapal (${currentTarget.findings.length})`, icon: AlertTriangle, badge: currentTarget.openNC > 0 ? `${currentTarget.openNC} Open` : null, alert: currentTarget.openNC > 0 },
              { id: 'sessions', label: `2. Sesi Audit Kapal (${currentTarget.audits.length})`, icon: ShieldCheck, badge: null },
              { id: 'checklist', label: '3. Checklist ISM & Input Manual', icon: FileCheck, badge: null },
              { id: 'integrations', label: `4. Sertifikat & Logistik (${currentTargetCertificates.length + currentTargetRequisitions.length})`, icon: Package, badge: null }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = vesselTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setVesselTab(tab.id)}
                  className={`tab-btn ${isActive ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.55rem 1rem',
                    fontSize: '0.825rem',
                    fontWeight: isActive ? 700 : 500,
                    borderRadius: '8px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Icon size={15} color={isActive ? '#38bdf8' : 'var(--text-subtle)'} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`badge ${tab.alert ? 'badge-danger-pulse' : 'badge-neutral'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
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
                    style={{ width: '200px', fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
                  />
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
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Riwayat Sesi Audit Resmi: {currentTarget.name}</h4>
                <button
                  onClick={() => {
                    setEditingSession(null);
                    setSessionModalOpen(true);
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
                >
                  <Plus size={14} />
                  <span>+ Buat Sesi Audit Baru</span>
                </button>
              </div>

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
                            onClick={() => {
                              setReportModalSession(s);
                              setReportModalFinding(null);
                              setReportModalMode('session');
                              setReportModalOpen(true);
                            }}
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
                            title="Cetak Laporan Lengkap Sesi Audit Sesuai Standar ISM Code (A4 Print / PDF)"
                          >
                            <Printer size={13} />
                            <span>Cetak Laporan</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingSession(s);
                              setSessionModalOpen(true);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem' }}
                          >
                            Edit Formulir (5 Tab)
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
                    Klik tombol di bawah untuk membuat sesi audit baru dengan formulir lengkap 5 tab dan mode fullscreen.
                  </p>
                  <button
                    onClick={() => {
                      setEditingSession(null);
                      setSessionModalOpen(true);
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: '0.85rem' }}
                  >
                    + Buat Sesi Audit Baru
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
                    {isBKIOrganization(activeChecklistConfig.organizationId) ? (
                      <>
                        <span>Checklist Resmi BKI (SMS Shipboard Checklist Rev 05)</span>
                        <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>Template BKI 74 Butir</span>
                      </>
                    ) : (
                      <>
                        <span>Checklist Audit {activeChecklistConfig.organizationName}</span>
                        <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>Format Mandiri (Non-BKI)</span>
                      </>
                    )}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {isBKIOrganization(activeChecklistConfig.organizationId)
                      ? `Pemeriksaan komprehensif seluruh area operasional kapal ${currentTarget.name} standar BKI F23.14.06-2024 Rev 05 (termasuk klausul khusus tipe kapal A s/d E).`
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
                    <span>Cetak Checklist (PDF / Cetak)</span>
                  </button>

                  <button
                    onClick={() => setShowManualCodeForm(!showManualCodeForm)}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
                  >
                    <Plus size={14} />
                    <span>{showManualCodeForm ? 'Tutup Form' : '+ Tambah Item Manual'}</span>
                  </button>
                </div>
              </div>

              {/* Checklist Filter Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {(() => {
                  const struckCount = activeChecklistItems.filter(el =>
                    vesselStrikethroughOverrides[el.code] !== undefined
                      ? vesselStrikethroughOverrides[el.code]
                      : Boolean(el.isStrikethrough)
                  ).length;
                  const activeCount = activeChecklistItems.length - struckCount;
                  return [
                    { id: 'ALL', label: `Semua Elemen (${activeChecklistItems.length + customChecklistItems.length})` },
                    { id: 'CORE', label: `Klausul Aktif (${activeCount})` },
                    { id: 'STRIKETHROUGH', label: `Klausul Dicoret (${struckCount})` },
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
                        <option value="Complied">Complied (Sesuai)</option>
                        <option value="Observation">Observasi</option>
                        <option value="Minor NC">Minor NC</option>
                        <option value="Major NC">Major NC</option>
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
                      <th style={{ width: '130px' }}>Kode Klausul</th>
                      <th>Area Pemeriksaan ISM Code</th>
                      <th>Kriteria / Check Point</th>
                      <th style={{ width: '140px' }}>Status Evaluasi</th>
                      <th style={{ width: '220px' }}>Upload Bukti Audit</th>
                      <th style={{ width: '160px', textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Custom items */}
                    {customChecklistItems.map(item => {
                      const isStrikethrough = vesselStrikethroughOverrides[item.code] !== undefined
                        ? vesselStrikethroughOverrides[item.code]
                        : Boolean(item.isStrikethrough);

                      return (
                        <tr key={item.id} style={{ background: isStrikethrough ? 'rgba(239, 68, 68, 0.03)' : 'rgba(2, 132, 199, 0.04)' }}>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <span className="badge badge-info mono" style={{ fontWeight: 800 }}>
                                  {item.code}
                                </span>
                                <span className="badge badge-neutral" style={{ fontSize: '0.62rem' }}>Manual</span>
                              </div>
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
                          <td>
                            <div style={{ textDecoration: isStrikethrough ? 'line-through' : 'none', color: isStrikethrough ? 'var(--text-muted)' : 'var(--text-main)' }}>
                              <strong>{item.name}</strong>
                            </div>
                          </td>
                          <td style={{ color: 'var(--text-muted)' }}>{item.checkPoint}</td>
                          <td>
                            <span className={`badge ${
                              item.result === 'Complied' ? 'badge-success' : item.result === 'Major NC' ? 'badge-danger' : 'badge-warning'
                            }`}>
                              {item.result}
                            </span>
                          </td>
                          <td>
                            {/* Custom item evidence */}
                            {checklistEvidenceMap[item.code] ? (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.3rem 0.5rem', borderRadius: '6px', background: 'rgba(2, 132, 199, 0.12)', border: '1px solid rgba(2, 132, 199, 0.3)' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0284c7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
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
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
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
                                    <span>Lepas Coret</span>
                                  </>
                                ) : (
                                  <>
                                    <Strikethrough size={11} />
                                    <span>Coret</span>
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setCustomChecklistItems(prev => prev.filter(i => i.id !== item.id));
                                  showToast('Item manual dihapus', 'info');
                                }}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.2rem 0.4rem', color: '#ef4444' }}
                                title="Hapus item manual"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {/* Butir checklist mengikuti LEMBAGA AUDIT EKSTERNAL sesi terkait.
                        BKI  -> template resmi F23.14.06-2024 Rev 05 (termasuk butir bercoret).
                        Lain -> kosong, karena isi checklist antar lembaga berbeda
                                dan disusun manual lewat "Tambah Item Manual". */}
                    {activeChecklistItems
                      .filter(el => {
                        const isStriked = vesselStrikethroughOverrides[el.code] !== undefined
                          ? vesselStrikethroughOverrides[el.code]
                          : Boolean(el.isStrikethrough);
                        if (vesselChecklistFilter === 'CORE') return !isStriked;
                        if (vesselChecklistFilter === 'STRIKETHROUGH') return isStriked;
                        if (vesselChecklistFilter === 'HAS_EVIDENCE') return Boolean(checklistEvidenceMap[el.code]);
                        return true;
                      })
                      .map(el => {
                        const isStrikethrough = vesselStrikethroughOverrides[el.code] !== undefined
                          ? vesselStrikethroughOverrides[el.code]
                          : Boolean(el.isStrikethrough);
                        const currentVal = vesselChecklistResults[el.code] || (isStrikethrough ? 'N/A' : 'Complied');
                        const evidence = checklistEvidenceMap[el.code];

                        return (
                          <tr key={el.code} style={{ background: isStrikethrough ? 'rgba(239, 68, 68, 0.03)' : undefined }}>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                <span className="badge badge-neutral mono" style={{ fontWeight: 800, color: isStrikethrough ? '#94a3b8' : '#10b981' }}>
                                  {el.code}
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
                            <td>
                              <div style={{ textDecoration: isStrikethrough ? 'line-through' : 'none', color: isStrikethrough ? 'var(--text-muted)' : 'var(--text-main)' }}>
                                <strong style={{ display: 'block' }}>{el.name}</strong>
                              </div>
                              {isStrikethrough && (
                                <span style={{ fontSize: '0.67rem', color: '#f59e0b', fontWeight: 600 }}>
                                  ⚠️ Klausul tidak digunakan / dicoret oleh auditor (N/A)
                                </span>
                              )}
                            </td>
                            <td style={{ color: 'var(--text-muted)' }}>
                              <span style={{ display: 'block', lineHeight: 1.5 }}>
                                {el.checkPoint || el.checkPoints?.[0] || el.description || '-'}
                              </span>
                              {(el.remark || el.ismCode) && (
                                <span style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                                  {el.ismCode && (
                                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#0284c7', background: 'rgba(2,132,199,0.1)', borderRadius: '4px', padding: '0.05rem 0.3rem' }}>
                                      ISM §{el.ismCode}
                                    </span>
                                  )}
                                  {el.remark && el.remark !== el.checkPoint && (
                                    <span style={{ fontSize: '0.62rem', color: '#64748b', fontStyle: 'italic' }}>
                                      {el.remark}
                                    </span>
                                  )}
                                </span>
                              )}
                            </td>
                            <td>
                              <select
                                value={currentVal}
                                onChange={(e) => setVesselChecklistResults(prev => ({ ...prev, [el.code]: e.target.value }))}
                                className="select-control"
                                style={{
                                  fontSize: '0.72rem',
                                  padding: '0.25rem 1.6rem 0.25rem 0.45rem',
                                  fontWeight: 700,
                                  color: currentVal === 'Complied' ? '#10b981' : currentVal === 'Major NC' ? '#ef4444' : currentVal === 'N/A' ? 'var(--text-muted)' : '#f59e0b'
                                }}
                              >
                                <option value="Complied">🟢 Complied</option>
                                <option value="Observation">🔵 Observasi</option>
                                <option value="Minor NC">🟡 Minor NC</option>
                                <option value="Major NC">🔴 Major NC</option>
                                <option value="N/A">⚪ N/A</option>
                              </select>
                            </td>
                            <td>
                              {/* Upload Bukti Audit Field */}
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
                                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0284c7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }} title={evidence.fileName}>
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
                            <td style={{ textAlign: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
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
                                      <span>Lepas Coret</span>
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
                                    onClick={() => {
                                      setEditingFinding({
                                        standard: currentTarget.standard,
                                        clauseCode: el.code,
                                        clauseName: el.name,
                                        description: `Catatan pemeriksaan pada ${el.name} (${currentTarget.name})`,
                                        category: 'Minor NC',
                                        vesselId: currentTarget.id,
                                        targetName: currentTarget.name
                                      });
                                      setFindingDefaultAuditId(currentTarget.lastAudit?.id || null);
                                      setFindingModalOpen(true);
                                    }}
                                    className="btn btn-secondary btn-sm"
                                    style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                                  >
                                    + Jadikan NC
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
                        <td colSpan={6} style={{ padding: '2rem 1rem', textAlign: 'center' }}>
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
          {/* TAB 4: SERTIFIKAT & LOGISTIK KAPAL                                    */}
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
