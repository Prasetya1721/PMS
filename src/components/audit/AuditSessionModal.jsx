import React, { useState, useEffect, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  X,
  ShieldCheck,
  Building2,
  Ship,
  UserCheck,
  FileCheck,
  Save,
  Maximize2,
  Minimize2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Package,
  Code,
  Printer,
  Upload,
  FileText,
  Eye,
  Paperclip,
  Sparkles,
  FileSpreadsheet,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Layers,
  Check,
  Anchor,
  Info,
  Strikethrough,
  Undo2,
  RotateCcw
} from 'lucide-react';
import { AuditReportModal } from './AuditReportModal';
import {
  BKI_AUDIT_MASTER,
  BKI_SMC_CHECKLIST_TEMPLATE,
  NON_BKI_AUDIT_ORGANIZATIONS,
  EXTERNAL_AUDIT_ORGANIZATIONS,
  isBKIOrganization,
  getChecklistConfigForSession,
  normalizeChecklistItem
} from '../../data/auditMasterData';

/**
 * Bangun baris checklist interaktif dari registry checklist lembaga audit.
 *
 * HANYA BKI yang memiliki template resmi (F23.14.06-2024 Rev 05).
 * Lembaga lain mengembalikan array KOSONG — auditor menyusun butir manual.
 * Default: result = '', notes = '' (kosong untuk diisi auditor).
 *
 * @param {string|object} organization - lembaga audit eksternal pada sesi
 * @returns {Array} baris checklist siap pakai (kosong jika bukan BKI)
 */
const buildChecklistFromOrganization = (organization) => {
  // Guard mutlak: jika bukan BKI, segera kembalikan array kosong
  if (!isBKIOrganization(organization)) return [];

  const { organizationId, items } = getChecklistConfigForSession(organization);

  // Guard cadangan: hanya BKI yang punya template checklist standar
  if (organizationId !== 'bki' || !items || items.length === 0) return [];

  return items.map(el => {
    const norm = normalizeChecklistItem(el);
    return {
      id: norm.code || norm.id,
      code: norm.code,
      name: norm.name,
      checkPoint: norm.checkPoint,
      remark: '',
      ismCode: norm.ismCode || '',
      result: norm.isStrikethrough ? 'N/A' : (el.defaultResult || ''),
      notes: '',
      isManual: false,
      isStrikethrough: Boolean(norm.isStrikethrough),
      evidence: null
    };
  });
};

export const AuditSessionModal = ({ session, onClose, defaultVesselId, defaultStandard }) => {
  const {
    vessels,
    selectedVesselId,
    addAuditSession,
    updateAuditSession,
    deleteAuditSession,
    allAuditFindings,
    addAuditFinding,
    shipDocuments,
    requisitions,
    ISM_DOC_ELEMENTS,
    showToast
  } = usePMS();

  const isEdit = Boolean(session);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Screen State: Step 0 (Pre-Selection / Setup) vs Step 1 (Full Form 5 Tabs)
  // New sessions start at Setup Step (Step 0) so the user selects Internal/External & DOC/SMC first.
  const [isSetupStep, setIsSetupStep] = useState(!isEdit);

  // Fullscreen toggle state (defaults to true for rich workstation comfort)
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [showPrintReport, setShowPrintReport] = useState(false);

  // Active form subtab (when inside the full form)
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'integrations' | 'checklist' | 'findings' | 'signoff'

  // Standard & Target defaults
  const initialStandard = session?.standard || defaultStandard || (defaultVesselId && defaultVesselId !== 'office' ? 'SMC' : 'DOC');
  const initialTargetType = session?.targetType || (defaultVesselId && defaultVesselId !== 'office' ? 'Vessel' : (initialStandard === 'SMC' ? 'Vessel' : 'Office'));
  const initialVesselId = session?.vesselId || (defaultVesselId && defaultVesselId !== 'office' ? defaultVesselId : (selectedVesselId && selectedVesselId !== 'all' ? selectedVesselId : vessels[0]?.id || ''));

  // Core Audit Parameters
  const [auditType, setAuditType] = useState(session?.auditType || 'Internal'); // 'Internal' | 'External'
  const [standard, setStandard] = useState(initialStandard); // 'DOC' | 'SMC'
  const [targetType, setTargetType] = useState(initialTargetType); // 'Office' | 'Vessel'
  const [vesselId, setVesselId] = useState(initialVesselId);

  // Organization handling
  const rawSessionOrg = session?.externalOrganization;
  const initialOrgStr = typeof rawSessionOrg === 'object' && rawSessionOrg !== null
    ? (rawSessionOrg.name || 'Biro Klasifikasi Indonesia (BKI)')
    : (rawSessionOrg || ((session?.auditType === 'Internal' || (!session))
        ? 'PT. Pelayaran Baharimas Kalimantan (Internal DPA / QHSE)'
        : 'Biro Klasifikasi Indonesia (BKI)'));

  const [externalOrganization, setExternalOrganization] = useState(initialOrgStr);
  const isKnownOrg = EXTERNAL_AUDIT_ORGANIZATIONS.some(org => org.name === initialOrgStr || org.id === initialOrgStr);
  const [customExternalOrg, setCustomExternalOrg] = useState(
    initialOrgStr && !isKnownOrg ? initialOrgStr : ''
  );

  // DOC-specific and SMC-specific meta
  const [docDepartment, setDocDepartment] = useState(
    session?.docDepartment || ''
  );
  const [docCertificateNo, setDocCertificateNo] = useState(
    session?.docCertificateNo || ''
  );
  const [smcCertificateNo, setSmcCertificateNo] = useState(
    session?.smcCertificateNo || ''
  );

  // Identity & Registration
  const [reportId, setReportId] = useState(
    session?.reportId || ''
  );
  const [auditNo, setAuditNo] = useState(session?.auditNo || '');
  const [leadAuditor, setLeadAuditor] = useState(session?.leadAuditor || '');
  const [auditTeam, setAuditTeam] = useState(
    session?.auditTeam ? (Array.isArray(session.auditTeam) ? session.auditTeam.join(', ') : session.auditTeam) : ''
  );
  const [auditee, setAuditee] = useState(session?.auditee || '');
  const [auditLocation, setAuditLocation] = useState(session?.auditLocation || '');
  const [auditDate, setAuditDate] = useState(session?.auditDate || new Date().toISOString().split('T')[0]);
  const [targetCloseDate, setTargetCloseDate] = useState(
    session?.targetCloseDate ||
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [scope, setScope] = useState(session?.scope || '');
  const [status, setStatus] = useState(session?.status || 'In Progress');

  // Tab 2: Linked Certificates & Requisitions
  const [selectedCertificateIds, setSelectedCertificateIds] = useState(session?.selectedCertificateIds || []);
  const [selectedRequisitionIds, setSelectedRequisitionIds] = useState(session?.selectedRequisitionIds || []);

  // Sync current vessel object
  const currentSelectedVessel = useMemo(() => {
    return vessels.find(v => v.id === vesselId) || vessels[0];
  }, [vessels, vesselId]);

  // Tab 3: Interactive Checklist (bersumber dari registry checklist per lembaga)
  // HANYA BKI yang memiliki template — lembaga lain mulai dengan daftar kosong
  const [checklist, setChecklist] = useState(() => {
    if (session?.checklist && session.checklist.length > 0) {
      if (initialStandard === 'SMC') {
        const orgId = getChecklistConfigForSession(initialOrgStr).organizationId;
        if (orgId !== 'bki') {
          // Hanya pertahankan butir manual jika ada, template BKI dibuang
          return session.checklist.filter(item => item.isManual);
        }
      }
      // Sinkronkan klausul dengan template resmi Bahasa Indonesia terbaru
      return session.checklist.map(item => {
        const tpl = BKI_SMC_CHECKLIST_TEMPLATE.find(t =>
          t.id === item.id || t.no === item.code || t.no === item.id
        );
        if (tpl) {
          return {
            ...item,
            name: tpl.subsection || tpl.section || item.name,
            checkPoint: tpl.item || item.checkPoint,
            ismCode: tpl.ismCode || item.ismCode,
            remark: '',
            notes: (item.notes === item.remark || item.notes === tpl.remark) ? '' : (item.notes || '')
          };
        }
        return item;
      });
    }
    if (initialStandard === 'SMC') {
      // Hanya muat template jika lembaga adalah BKI
      return buildChecklistFromOrganization(initialOrgStr);
    }
    return ISM_DOC_ELEMENTS.map(el => ({
      id: el.code,
      code: el.code,
      name: el.name,
      checkPoint: el.checkPoints?.[0] || el.description,
      result: '',
      notes: '',
      isManual: false,
      isStrikethrough: false,
      evidence: null
    }));
  });

  // Modal preview evidence
  const [previewEvidence, setPreviewEvidence] = useState(null);

  // Filter checklist in table
  const [checklistFilter, setChecklistFilter] = useState('ALL'); // ALL | CORE | STRIKETHROUGH | HAS_EVIDENCE

  // Manual Checklist Item input form state
  const [manualCode, setManualCode] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualCriteria, setManualCriteria] = useState('');
  const [manualResult, setManualResult] = useState('');
  const [manualNotes, setManualNotes] = useState('');
  const [showManualItemForm, setShowManualItemForm] = useState(false);

  // Tab 4: Inline New Finding form state
  const [findingsList, setFindingsList] = useState(() => {
    if (session?.id) {
      return (allAuditFindings || []).filter(f => f.auditId === session.id);
    }
    return [];
  });
  const [showAddFindingForm, setShowAddFindingForm] = useState(false);
  const [newFindingCategory, setNewFindingCategory] = useState('Minor NC');
  const [newFindingClause, setNewFindingClause] = useState(initialStandard === 'DOC' ? 'ISM-1' : '1.1');
  const [newFindingDesc, setNewFindingDesc] = useState('');
  const [newFindingEvidence, setNewFindingEvidence] = useState('');
  const [newFindingPIC, setNewFindingPIC] = useState('');

  // Tab 5: Summary & Sign-off
  const [auditConclusion, setAuditConclusion] = useState(
    session?.auditConclusion || ''
  );
  const [leadAuditorSign, setLeadAuditorSign] = useState(session?.leadAuditorSign || '');
  const [auditeeSign, setAuditeeSign] = useState(session?.auditeeSign || '');

  // Helper to switch Standard (DOC vs SMC) cleanly
  const applyStandardSwitch = (newStandard, forcedAuditType = auditType, forcedVesselId = vesselId) => {
    setStandard(newStandard);
    const year = new Date().getFullYear();
    const randNum = Math.floor(Math.random() * 900 + 100);
    const prefix = forcedAuditType === 'Internal' ? 'INT' : 'EXT';
    if (!isEdit && !session?.auditNo) {
      setAuditNo(`AUD-${prefix}-${newStandard}-${year}/${randNum}`);
    }

    if (newStandard === 'DOC') {
      setTargetType('Office');
      setNewFindingClause('ISM-1');

      // Load DOC checklist
      setChecklist(ISM_DOC_ELEMENTS.map(el => ({
        id: el.code,
        code: el.code,
        name: el.name,
        checkPoint: el.checkPoints?.[0] || el.description,
        result: '',
        notes: '',
        isManual: false,
        isStrikethrough: false,
        evidence: null
      })));
    } else {
      // SMC Standard
      setTargetType('Vessel');
      setNewFindingClause('1.1');

      // Load checklist sesuai lembaga audit:
      // BKI → template resmi Rev 05; lembaga lain / internal → kosong (isi manual)
      const currentOrg = forcedAuditType === 'Internal'
        ? 'PT. Pelayaran Baharimas Kalimantan (Internal DPA / QHSE)'
        : externalOrganization;
      setChecklist(buildChecklistFromOrganization(currentOrg));
    }
  };

  // Helper to switch Audit Type (Internal vs External)
  const applyAuditTypeSwitch = (newAuditType) => {
    setAuditType(newAuditType);
    const year = new Date().getFullYear();
    const randNum = Math.floor(Math.random() * 900 + 100);
    const prefix = newAuditType === 'Internal' ? 'INT' : 'EXT';
    if (!isEdit && !session?.auditNo) {
      setAuditNo(`AUD-${prefix}-${standard}-${year}/${randNum}`);
    }

    if (newAuditType === 'Internal') {
      setExternalOrganization('PT. Pelayaran Baharimas Kalimantan (Internal DPA / QHSE)');
      // Audit internal tidak memakai template BKI — kosongkan checklist
      setChecklist([]);
    } else {
      // External: Set default ke BKI dan muat template BKI
      const defaultExtOrg = externalOrganization && externalOrganization !== 'PT. Pelayaran Baharimas Kalimantan (Internal DPA / QHSE)'
        ? externalOrganization
        : 'Biro Klasifikasi Indonesia (BKI)';
      setExternalOrganization(defaultExtOrg);
      // Muat template jika lembaga adalah BKI
      if (standard === 'SMC') {
        if (isBKIOrganization(defaultExtOrg)) {
          setChecklist(buildChecklistFromOrganization(defaultExtOrg));
        } else {
          setChecklist(prev => prev.filter(item => item.isManual));
        }
      }
    }
  };

  // Helper opsional untuk memuat contoh demo simulasi (RP 2004 / PBK) jika diinginkan
  const handleLoadSampleDemo = () => {
    if (standard === 'DOC') {
      setDocDepartment('Seluruh Divisi Darat (DPA, QHSE, Ops, Crewing, Logistik)');
      setDocCertificateNo('DOC-IDN-PBK/2024-R1');
      setReportId('0859 - PK/ISM- DOC /2026');
      setAuditLocation('Kantor Pusat PT. Pelayaran Baharimas Kalimantan (Pontianak)');
      setAuditee('Direktur Operasional, DPA & Para Manager Divisi Darat');
      setScope('Evaluasi menyeluruh implementasi ISM Code klausul 1 s/d 16 pada operasional kantor darat PT. Pelayaran Baharimas Kalimantan');
      setLeadAuditor('Auditor Ditjen Perhubungan Laut / Surveyor RO Ditunjuk');
      setAuditTeam('Tim Surveyor Statutory Flag State');
      setLeadAuditorSign('Auditor RO / Ditjen Hubla');
      setAuditeeSign('Direktur Operasional / DPA PT. PBK');
      setAuditConclusion('Sistem Manajemen Keselamatan (SMS) Kantor Darat PT. Pelayaran Baharimas Kalimantan telah diimplementasikan secara konsisten dan memenuhi standar ISM Code IMO Res. A.741(18). Sertifikat DOC Perusahaan direkomendasikan dipertahankan.');
    } else {
      const v = vessels.find(item => item.id === vesselId) || vessels[0];
      const vName = v?.name || 'RP 2004';
      setSmcCertificateNo(`SMC-TB-${vName.replace(/\s+/g, '')}/2024`);
      setReportId('0859 - PK/ISM- SMC /2026');
      setAuditLocation(`Onboard ${vName} (Pelabuhan Dwikora Pontianak / Sungai Kapuas)`);
      setAuditee(`Nakhoda (Capt. Master) & KKM ${vName}`);
      setScope(`Verifikasi kepatuhan Safety Management System (SMS) ISM Code dan pemeliharaan alat keselamatan di atas kapal ${vName}`);
      setLeadAuditor('Auditor Senior Biro Klasifikasi Indonesia (BKI Pontianak)');
      setAuditTeam('Surveyor Marine BKI Cabang Pontianak');
      setLeadAuditorSign('Surveyor Senior BKI');
      setAuditeeSign(`Nakhoda ${vName}`);
      setAuditConclusion(`Implementasi keselamatan maritim di atas kapal ${vName} berjalan efektif. Seluruh peralatan navigasi, mesin, dan latihan darurat (drills) terverifikasi. Sertifikat SMC kapal direkomendasikan untuk diperpanjang/dipertahankan.`);
    }
    showToast('✓ Contoh data demo berhasil dimuat ke formulir!', 'info');
  };

  // Helper perubahan lembaga audit eksternal:
  // - Jika BKI: muat otomatis template resmi Rev 05 (74 klausul)
  // - Jika selain BKI (KSOP, Hubla, LR, BV, dll): KOSONGKAN daftar checklist (hanya pertahankan butir manual jika ada)
  const handleExternalOrgChange = (newOrg) => {
    setExternalOrganization(newOrg);

    if (standard === 'SMC') {
      if (isBKIOrganization(newOrg)) {
        setChecklist(buildChecklistFromOrganization(newOrg));
        showToast('✓ Template resmi BKI (F23.14.06-2024 Rev 05) dimuat otomatis.', 'info');
      } else {
        // Kosongkan template BKI untuk lembaga selain BKI (KSOP, Hubla, LR, BV, dll.)
        // Pertahankan hanya butir pemeriksaan manual jika auditor sudah menambahkan item manual
        setChecklist(prev => prev.filter(item => item.isManual));
        const orgInfo = getChecklistConfigForSession(newOrg);
        showToast(
          `ℹ️ Lembaga "${orgInfo.organizationName}" dipilih. Checklist BKI dikosongkan (format audit disesuaikan lembaga).`,
          'info'
        );
      }
    }
  };

  // One-time initial setup on mount if not editing
  useEffect(() => {
    if (!isEdit && !session?.auditNo) {
      const year = new Date().getFullYear();
      const randNum = Math.floor(Math.random() * 900 + 100);
      const prefix = auditType === 'Internal' ? 'INT' : 'EXT';
      setAuditNo(`AUD-${prefix}-${initialStandard}-${year}/${randNum}`);
    }
  }, []);

  // Proceed from Setup Step to Form View
  const handleProceedFromSetup = () => {
    if (standard === 'SMC' && !vesselId) {
      showToast('Harap pilih target kapal armada terlebih dahulu!', 'warning');
      return;
    }

    if (auditType === 'External') {
      const isCustom = externalOrganization === 'Lembaga Audit Eksternal Lainnya (Input Manual)' ||
        externalOrganization === 'Lainnya / Lembaga Lain' ||
        (typeof externalOrganization === 'string' && externalOrganization.includes('Lainnya'));
      if (isCustom && !customExternalOrg.trim()) {
        showToast('Harap tuliskan nama lembaga audit eksternal yang ditunjuk!', 'warning');
        return;
      }
    }

    setIsSetupStep(false);
    showToast(`✓ Masuk ke Formulir Audit ${standard} (${auditType === 'Internal' ? 'Internal Baharimas' : 'Eksternal'})`, 'info');
  };

  // Handle Checklist Change
  const handleChecklistChange = (id, field, value) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Handle Checklist Upload Evidence
  const handleUploadChecklistEvidence = (itemId, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileUrl = e.target.result;
      const evidenceObj = {
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        fileUrl,
        uploadedAt: new Date().toISOString()
      };
      setChecklist(prev => prev.map(item => item.id === itemId ? { ...item, evidence: evidenceObj } : item));
      showToast(`✓ Bukti audit untuk "${itemId}" berhasil diunggah!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  // Mock Evidence Generator for instant testing
  const handleGenerateMockChecklistEvidence = (item) => {
    const rawOrgName = typeof externalOrganization === 'object' && externalOrganization !== null
      ? (externalOrganization.name || 'LEMBAGA AUDIT')
      : externalOrganization;
    const orgLabel = auditType === 'Internal' ? 'PT. PELAYARAN BAHARIMAS KALIMANTAN' : (rawOrgName || 'LEMBAGA AUDIT EKSTERNAL');
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="420" viewBox="0 0 600 420">
      <rect width="100%" height="100%" fill="#0f172a"/>
      <rect x="20" y="20" width="560" height="380" rx="12" fill="#1e293b" stroke="#0284c7" stroke-width="2"/>
      <circle cx="300" cy="100" r="42" fill="#0284c7" fill-opacity="0.2" stroke="#0284c7" stroke-width="3"/>
      <path d="M282 100 L295 113 L325 85" stroke="#10b981" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <text x="300" y="175" font-family="sans-serif" font-size="18" font-weight="bold" fill="#f8fafc" text-anchor="middle">BUKTI VERIFIKASI CEKLIST AUDIT ISM</text>
      <text x="300" y="205" font-family="sans-serif" font-size="13" font-weight="bold" fill="#38bdf8" text-anchor="middle">${orgLabel}</text>
      <text x="300" y="240" font-family="monospace" font-size="13" fill="#e2e8f0" text-anchor="middle">Klausul: ${item.code} - ${item.name}</text>
      <text x="300" y="270" font-family="sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">Target: ${targetType === 'Vessel' ? currentSelectedVessel?.name : 'Kantor Pusat'} | Sesi: ${auditNo}</text>
      <text x="300" y="295" font-family="sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">Kriteria: ${item.checkPoint?.substring(0, 50)}...</text>
      <rect x="180" y="325" width="240" height="36" rx="6" fill="#0369a1"/>
      <text x="300" y="348" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">OFFICIAL AUDIT EVIDENCE ATTACHED</text>
    </svg>`;
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
    const evidenceObj = {
      fileName: `BUKTI_AUDIT_${item.code.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now().toString().slice(-4)}.svg`,
      fileSize: '14.8 KB',
      fileUrl: dataUrl,
      uploadedAt: new Date().toISOString()
    };
    setChecklist(prev => prev.map(i => i.id === item.id ? { ...i, evidence: evidenceObj } : i));
    showToast(`✓ Simulasi bukti audit untuk ${item.code} dilampirkan!`, 'info');
  };

  // Remove evidence from item
  const handleRemoveChecklistEvidence = (itemId) => {
    setChecklist(prev => prev.map(item => item.id === itemId ? { ...item, evidence: null } : item));
    showToast('Bukti audit dilepas dari checklist', 'info');
  };

  // Toggle Coret / Lepas Coret pada klausul checklist
  const handleToggleChecklistStrikethrough = (itemId) => {
    let nextStrikedState = false;
    let targetCode = '';

    setChecklist(prev => prev.map(item => {
      if (item.id !== itemId && item.code !== itemId) return item;
      const nextStriked = !item.isStrikethrough;
      nextStrikedState = nextStriked;
      targetCode = item.code || item.id;
      const nextResult = nextStriked ? 'N/A' : (item.result === 'N/A' ? 'Complied' : item.result);
      const nextNotes = nextStriked
        ? (item.notes || 'Klausul khusus / tidak digunakan (dicoret oleh auditor)')
        : (item.notes === 'Klausul khusus / tidak digunakan (dicoret oleh auditor)' ? '' : item.notes);
      return {
        ...item,
        isStrikethrough: nextStriked,
        result: nextResult,
        notes: nextNotes
      };
    }));

    showToast(
      nextStrikedState
        ? `✂️ Klausul ${targetCode} berhasil dicoret (status diset N/A)`
        : `✓ Klausul ${targetCode} dilepas coret (status aktif)`,
      nextStrikedState ? 'info' : 'success'
    );
  };

  // Reload checklist sesuai lembaga audit eksternal aktif
  const handleLoadSMSChecklistTemplate = () => {
    const config = getChecklistConfigForSession(externalOrganization);
    const loaded = buildChecklistFromOrganization(externalOrganization);
    if (loaded.length === 0) {
      showToast(
        `⚠️ Lembaga "${config.organizationName}" belum memiliki template checklist. Formatnya berbeda dari BKI, silakan tambahkan butir pemeriksaan secara manual.`,
        'warning'
      );
      return;
    }
    setChecklist(loaded);
    const struckCount = loaded.filter(i => i.isStrikethrough).length;
    showToast(
      `✓ Berhasil memuat ${loaded.length} butir checklist ${config.organizationName} (${struckCount} butir coret ikut disertakan)!`,
      'success'
    );
  };

  // Kosongkan seluruh pilihan hasil (Yes/No/NA) dan catatan pada checklist
  const handleClearAllResults = () => {
    setChecklist(prev => prev.map(item => ({
      ...item,
      result: '',
      notes: ''
    })));
    showToast('✓ Seluruh pilihan checklist dan catatan berhasil dikosongkan.', 'info');
  };

  // Add Manual Checklist Item
  const handleAddManualChecklistItem = (e) => {
    e.preventDefault();
    if (!manualCode.trim() || !manualName.trim()) {
      showToast('Harap isi kode klausul dan nama item checklist!', 'warning');
      return;
    }

    const newItem = {
      id: `manual-${Date.now()}`,
      code: manualCode.trim().toUpperCase(),
      name: manualName.trim(),
      checkPoint: manualCriteria.trim() || 'Kriteria pemeriksaan kepatuhan ISM Code kustom',
      result: manualResult,
      notes: manualNotes.trim(),
      isManual: true,
      isStrikethrough: false,
      evidence: null
    };

    setChecklist(prev => [...prev, newItem]);
    setManualCode('');
    setManualName('');
    setManualCriteria('');
    setManualNotes('');
    setShowManualItemForm(false);
    showToast(`✓ Item checklist manual "${newItem.code}" berhasil ditambahkan!`, 'success');
  };

  const handleDeleteChecklistItem = (id) => {
    setChecklist(prev => prev.filter(item => item.id !== id));
    showToast('Item checklist berhasil dihapus!', 'info');
  };

  // Add Finding Inline
  const handleAddFindingInline = (e) => {
    e.preventDefault();
    if (!newFindingDesc.trim()) {
      showToast('Harap lengkapi uraian temuan ketidaksesuaian!', 'warning');
      return;
    }

    const rand = Math.floor(Math.random() * 9000 + 1000);
    const newFinding = {
      id: `nc-${Date.now()}`,
      findingNo: `NC-${standard}-${rand}`,
      auditId: session?.id || `temp-audit`,
      auditNo: auditNo,
      auditType,
      standard,
      targetName: targetType === 'Vessel' ? currentSelectedVessel?.name : 'Kantor Pusat PT. Pelayaran Baharimas Kalimantan',
      vesselId: targetType === 'Vessel' ? vesselId : null,
      clauseCode: newFindingClause,
      clauseName: checklist.find(c => c.code === newFindingClause)?.name || (standard === 'DOC' ? 'Elemen ISM Darat' : 'Klausul SMS Kapal'),
      category: newFindingCategory,
      status: 'NC Open',
      description: newFindingDesc,
      objectiveEvidence: newFindingEvidence || 'Hasil observasi auditor pada sesi audit',
      dateIdentified: auditDate,
      dueDate: targetCloseDate,
      assignedTo: newFindingPIC || (targetType === 'Vessel' ? 'KKM Kapal' : 'Manager QHSE'),
      auditor: leadAuditor,
      linkedCertificateId: selectedCertificateIds[0] || null,
      linkedRequisitionId: selectedRequisitionIds[0] || null
    };

    setFindingsList(prev => [newFinding, ...prev]);
    if (isEdit && session?.id) {
      addAuditFinding(newFinding);
    }
    setNewFindingDesc('');
    setNewFindingEvidence('');
    setNewFindingPIC('');
    setShowAddFindingForm(false);
    showToast(`✓ Temuan ${newFinding.findingNo} dicatat sebagai NC OPEN!`, 'warning');
  };

  // Relevant Certificates & Documents
  const relevantCertificates = useMemo(() => {
    if (standard === 'DOC') {
      return (shipDocuments || []).filter(d =>
        d.type?.toLowerCase().includes('doc') ||
        d.category === 'Company' ||
        d.category === 'Statutory' ||
        d.vesselId === 'all' ||
        d.vesselId === 'office'
      );
    }
    return (shipDocuments || []).filter(d => d.vesselId === vesselId);
  }, [shipDocuments, standard, vesselId]);

  // Relevant Requisitions
  const relevantRequisitions = useMemo(() => {
    if (standard === 'DOC') {
      return requisitions || [];
    }
    return (requisitions || []).filter(r => r.vesselId === vesselId);
  }, [requisitions, standard, vesselId]);

  // Stats Calculation
  const checklistStats = useMemo(() => {
    const total = checklist.length;
    const answered = checklist.filter(c => c.result && c.result !== '').length;
    const complied = checklist.filter(c => c.result === 'Complied' || c.result === 'Yes').length;
    const obs = checklist.filter(c => c.result === 'Observation').length;
    const minorNC = checklist.filter(c => c.result === 'Minor NC' || c.result === 'No').length;
    const majorNC = checklist.filter(c => c.result === 'Major NC').length;
    const na = checklist.filter(c => c.result === 'N/A' || c.isStrikethrough).length;
    const effectiveTotal = total - na > 0 ? total - na : total;
    const score = effectiveTotal > 0 && answered > 0 ? Math.round((complied / effectiveTotal) * 100) : 0;
    return { total, answered, complied, obs, minorNC, majorNC, na, score };
  }, [checklist]);

  // Submit complete session
  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedVessel = targetType === 'Vessel' ? vessels.find(v => v.id === vesselId) : null;
    const targetName = targetType === 'Vessel'
      ? (selectedVessel?.name || 'Kapal Armada PBK')
      : 'Kantor Pusat PT. Pelayaran Baharimas Kalimantan (Pontianak)';

    const teamArray = auditTeam.split(',').map(s => s.trim()).filter(Boolean);

    const isCustom = externalOrganization === 'Lembaga Audit Eksternal Lainnya (Input Manual)' ||
      externalOrganization === 'Lainnya / Lembaga Lain' ||
      (typeof externalOrganization === 'string' && externalOrganization.includes('Lainnya'));

    const resolvedExternalOrg = auditType === 'External'
      ? (isCustom
          ? (customExternalOrg.trim() || 'Lembaga Audit Ditunjuk')
          : (typeof externalOrganization === 'string' ? externalOrganization : externalOrganization?.name || 'Biro Klasifikasi Indonesia (BKI)'))
      : 'PT. Pelayaran Baharimas Kalimantan (Internal DPA / QHSE)';

    const payload = {
      auditNo: auditNo.trim(),
      reportId: reportId.trim(),
      auditType,
      externalOrganization: resolvedExternalOrg,
      standard,
      targetType,
      targetName,
      vesselId: targetType === 'Vessel' ? vesselId : null,
      docDepartment: standard === 'DOC' ? docDepartment : null,
      docCertificateNo: standard === 'DOC' ? docCertificateNo : null,
      smcCertificateNo: standard === 'SMC' ? smcCertificateNo : null,
      leadAuditor: leadAuditor.trim(),
      auditTeam: teamArray.length > 0 ? teamArray : ['Tim Inspeksi Keselamatan'],
      auditee: auditee.trim(),
      auditLocation: auditLocation.trim(),
      auditDate,
      targetCloseDate,
      scope: scope.trim(),
      status,
      selectedCertificateIds,
      selectedRequisitionIds,
      checklist,
      auditConclusion: auditConclusion.trim(),
      leadAuditorSign: leadAuditorSign.trim(),
      auditeeSign: auditeeSign.trim(),
      totalItemsChecked: checklist.length,
      itemsComplied: checklistStats.complied,
      findingsSummary: {
        majorNC: checklistStats.majorNC,
        minorNC: checklistStats.minorNC,
        observation: checklistStats.obs,
        totalOpen: checklistStats.majorNC + checklistStats.minorNC + checklistStats.obs,
        totalClosed: 0
      }
    };

    if (isEdit) {
      updateAuditSession(session.id, payload);
      showToast('✓ Sesi audit berhasil diperbarui!', 'success');
    } else {
      const created = addAuditSession(payload);
      if (findingsList.length > 0) {
        findingsList.forEach(f => {
          addAuditFinding({ ...f, auditId: created.id, auditNo: created.auditNo });
        });
      }
      showToast(`✓ Sesi audit ${payload.auditNo} resmi diterbitkan!`, 'success');
    }

    onClose();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div
        className={isFullscreen ? 'modal-fullscreen' : 'modal-dialog modal-dialog-large'}
        style={{
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
        {/* ========================================================================= */}
        {/* MODAL HEADER WITH CONTROLS                                               */}
        {/* ========================================================================= */}
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.5rem', background: 'var(--bg-surface-elevated)', backgroundColor: 'var(--bg-surface-elevated)', opacity: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              padding: '0.55rem',
              borderRadius: '10px',
              background: standard === 'DOC' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(2, 132, 199, 0.15)',
              color: standard === 'DOC' ? '#10b981' : '#0284c7'
            }}>
              {standard === 'DOC' ? <Building2 size={24} /> : <Ship size={24} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  {isSetupStep
                    ? 'Langkah Awal: Pemilihan Kategori & Standar Sesi Audit ISM'
                    : standard === 'DOC'
                    ? `Formulir Audit DOC (Document of Compliance) - Kantor Pusat`
                    : `Formulir Audit SMC (Safety Management Certificate) - ${currentSelectedVessel?.name || 'Kapal Armada'}`}
                </h3>
                <span className={`badge ${auditType === 'Internal' ? 'badge-info' : 'badge-neutral'}`} style={{ fontSize: '0.7rem' }}>
                  {auditType === 'Internal' ? 'Internal Baharimas' : 'Eksternal (Lembaga Ditunjuk)'}
                </span>
                <span className={`badge ${standard === 'DOC' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>
                  Standar {standard}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                {isSetupStep
                  ? 'Konfigurasikan jenis pelaksana dan kepatuhan audit sebelum formulir resmi dibuat'
                  : standard === 'DOC'
                  ? 'Audit Sistem Manajemen Keselamatan Darat • PT. Pelayaran Baharimas Kalimantan (Pontianak)'
                  : `Audit Kelaikan Onboard Kapal • ${currentSelectedVessel?.name} (${currentSelectedVessel?.type || 'Tugboat'}) • IMO Res. A.741(18)`}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* If inside form, allow button to go back to Setup */}
            {!isSetupStep && (
              <button
                type="button"
                onClick={() => setIsSetupStep(true)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0284c7', fontWeight: 700, padding: '0.35rem 0.65rem' }}
                title="Kembali ke langkah awal pemilihan jenis audit dan standar DOC/SMC"
              >
                <RefreshCw size={13} />
                <span>Ubah Jenis / Standar Audit</span>
              </button>
            )}

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.65rem' }}
              title={isFullscreen ? 'Kecilkan Layar' : 'Layar Penuh (Fullscreen)'}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              <span>{isFullscreen ? 'Normal' : 'Fullscreen'}</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.35rem 0.65rem' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: STEP 0 / PRE-SELECTION WIZARD                                    */}
        {/* ========================================================================= */}
        {isSetupStep ? (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflowY: 'auto', padding: '1.75rem', background: 'var(--bg-app)', backgroundColor: 'var(--bg-app)', opacity: 1 }}>
            <div style={{ maxWidth: '960px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Progress Indicator Card */}
              <div style={{
                padding: '0.9rem 1.25rem',
                borderRadius: '12px',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0284c7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                    1
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>Tahap Konfigurasi Awal Sesi Audit</h4>
                    <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>Pilih Pihak Pelaksana (Internal/Eksternal) dan Standar Kepatuhan (DOC/SMC)</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                  <span className="badge badge-info" style={{ padding: '0.25rem 0.6rem' }}>
                    Langkah 1 dari 2: Setup Kategori
                  </span>
                </div>
              </div>

              {/* SECTION 1: PIHAK PELAKSANA AUDIT (INTERNAL / EKSTERNAL) */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
                  <UserCheck size={16} color="#0284c7" />
                  <span>1. Pilih Pihak Pelaksana Audit (Internal Baharimas vs Eksternal) *</span>
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                  {/* Card Internal */}
                  <div
                    onClick={() => applyAuditTypeSwitch('Internal')}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: auditType === 'Internal' ? '2px solid #0284c7' : '1px solid var(--border-subtle)',
                      background: auditType === 'Internal' ? 'rgba(2, 132, 199, 0.08)' : 'var(--bg-surface)',
                      boxShadow: auditType === 'Internal' ? '0 8px 25px rgba(2, 132, 199, 0.15)' : 'none',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7' }}>
                          <UserCheck size={20} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: auditType === 'Internal' ? '#0284c7' : 'var(--text-main)' }}>
                            Audit Internal Baharimas
                          </h4>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PT. Pelayaran Baharimas Kalimantan</span>
                        </div>
                      </div>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: auditType === 'Internal' ? '6px solid #0284c7' : '2px solid var(--border-subtle)',
                        background: '#ffffff'
                      }} />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                      Dilaksanakan secara independen oleh Tim Auditor Internal DPA (Designated Person Ashore) & QHSE Department PT. Pelayaran Baharimas Kalimantan.
                    </p>
                    <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>✓ Tanpa Lembaga Luar</span>
                      <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>Mandiri DPA / QHSE PBK</span>
                    </div>
                  </div>

                  {/* Card External */}
                  <div
                    onClick={() => applyAuditTypeSwitch('External')}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: auditType === 'External' ? '2px solid #a855f7' : '1px solid var(--border-subtle)',
                      background: auditType === 'External' ? 'rgba(168, 85, 247, 0.08)' : 'var(--bg-surface)',
                      boxShadow: auditType === 'External' ? '0 8px 25px rgba(168, 85, 247, 0.15)' : 'none',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: auditType === 'External' ? '#a855f7' : 'var(--text-main)' }}>
                            Audit Eksternal (Lembaga Ditunjuk)
                          </h4>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Badan Klasifikasi / Flag State</span>
                        </div>
                      </div>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: auditType === 'External' ? '6px solid #a855f7' : '2px solid var(--border-subtle)',
                        background: '#ffffff'
                      }} />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                      Dilaksanakan oleh badan resmi eksternal yang ditunjuk resmi perusahaan (Biro Klasifikasi Indonesia, Ditjen Perhubungan Laut, KSOP, atau Recognized Organization).
                    </p>
                    <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>🏛️ Memilih Lembaga Ditunjuk</span>
                      <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>Statutory Flag State</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: STANDAR KEPATUHAN AUDIT (DOC vs SMC) */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
                  <Layers size={16} color="#10b981" />
                  <span>2. Pilih Standar Kepatuhan Audit (DOC Kantor Pusat vs SMC Kapal Armada) *</span>
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                  {/* Card DOC */}
                  <div
                    onClick={() => applyStandardSwitch('DOC')}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: standard === 'DOC' ? '2px solid #10b981' : '1px solid var(--border-subtle)',
                      background: standard === 'DOC' ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)',
                      boxShadow: standard === 'DOC' ? '0 8px 25px rgba(16, 185, 129, 0.15)' : 'none',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                          <Building2 size={20} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: standard === 'DOC' ? '#10b981' : 'var(--text-main)' }}>
                            DOC (Document of Compliance)
                          </h4>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Kantor Pusat & Manajemen Darat</span>
                        </div>
                      </div>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: standard === 'DOC' ? '6px solid #10b981' : '2px solid var(--border-subtle)',
                        background: '#ffffff'
                      }} />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                      Audit kepatuhan sistem manajemen keselamatan di kantor pusat: struktur direksi, DPA, penanganan tanggap darurat kantor, kualifikasi crewing darat, pengadaan logistik terpusat.
                    </p>
                    <div style={{ marginTop: '0.85rem', padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'var(--bg-surface-elevated)', fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                      🏢 Target: <strong>Kantor Pusat PT. PBK Pontianak</strong> • 12 Elemen Darat ISM Code
                    </div>
                  </div>

                  {/* Card SMC */}
                  <div
                    onClick={() => applyStandardSwitch('SMC')}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: standard === 'SMC' ? '2px solid #0284c7' : '1px solid var(--border-subtle)',
                      background: standard === 'SMC' ? 'rgba(2, 132, 199, 0.08)' : 'var(--bg-surface)',
                      boxShadow: standard === 'SMC' ? '0 8px 25px rgba(2, 132, 199, 0.15)' : 'none',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7' }}>
                          <Ship size={20} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: standard === 'SMC' ? '#0284c7' : 'var(--text-main)' }}>
                            SMC (Safety Management Certificate)
                          </h4>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Armada Kapal di Laut (Shipboard)</span>
                        </div>
                      </div>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: standard === 'SMC' ? '6px solid #0284c7' : '2px solid var(--border-subtle)',
                        background: '#ffffff'
                      }} />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                      Audit kepatuhan onboard nakhoda & awak kapal menggunakan <strong>SMS Shipboard Checklist (Rev 05)</strong>: kelaikan navigasi, mesin, PMS, LSA/FFA, drill darurat, serta klausul coret A-E.
                    </p>
                    <div style={{ marginTop: '0.85rem', padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'var(--bg-surface-elevated)', fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                      🚢 Target: <strong>28 Kapal Armada Baharimas</strong> • SMS Shipboard Checklist Rev 05
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: KONDISIONAL PILIHAN LEMBAGA */}
              {/* ATURAN: Jika Internal (termasuk SMC Internal), JANGAN KELUAR pilihan lembaga! Hanya keluar jika Eksternal. */}
              {auditType === 'Internal' ? (
                <div style={{
                  padding: '1.15rem 1.35rem',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem'
                }}>
                  <div style={{ padding: '0.45rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', flexShrink: 0 }}>
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#10b981', margin: 0 }}>
                      Audit Internal PT. Pelayaran Baharimas Kalimantan — Tanpa Lembaga Luar
                    </h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                      Sesuai ketentuan, karena Anda memilih <strong>Audit {standard} Internal</strong>, maka audit dilaksanakan secara mandiri oleh Tim Internal DPA & QHSE Department PT. Pelayaran Baharimas Kalimantan. Pilihan lembaga eksternal ditiadakan.
                    </p>
                  </div>
                </div>
              ) : (
                /* Muncul jika Audit Eksternal */
                <div className="glass-card" style={{ padding: '1.25rem', border: '1.5px solid #a855f7', background: 'rgba(168, 85, 247, 0.06)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
                    <ShieldCheck size={20} color="#a855f7" />
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#a855f7', margin: 0 }}>
                      Pilih Lembaga / Badan Audit Eksternal yang Ditunjuk Perusahaan *
                    </h5>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                    Pilih lembaga resmi atau Recognized Organization (RO) yang ditunjuk oleh PT. Pelayaran Baharimas Kalimantan:
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.85rem' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                        Nama Badan / Otoritas Ditunjuk *
                      </label>
                      <select
                        value={typeof externalOrganization === 'string' ? externalOrganization : externalOrganization?.name || ''}
                        onChange={(e) => handleExternalOrgChange(e.target.value)}
                        className="select-control"
                        style={{ fontWeight: 700, borderColor: '#a855f7' }}
                      >
                        <optgroup label="Standar BKI (Template Resmi F23.14.06-2024 Rev 05 — 74 Butir)">
                          <option value={BKI_AUDIT_MASTER.name}>
                            {BKI_AUDIT_MASTER.name} (Checklist Resmi 74 Butir)
                          </option>
                        </optgroup>
                        <optgroup label="Lembaga Lain (Format Mandiri / Manual — Checklist Kosong)">
                          {NON_BKI_AUDIT_ORGANIZATIONS.map(org => (
                            <option key={org.id || org.name} value={org.name}>
                              {org.name}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    {(externalOrganization === 'Lembaga Audit Eksternal Lainnya (Input Manual)' ||
                      externalOrganization === 'Lainnya / Lembaga Lain' ||
                      (typeof externalOrganization === 'string' && externalOrganization.includes('Lainnya'))) && (
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                          Tuliskan Nama Lembaga / Otoritas *
                        </label>
                        <input
                          type="text"
                          required
                          value={customExternalOrg}
                          onChange={(e) => setCustomExternalOrg(e.target.value)}
                          placeholder="cth: Lloyd's Register (LR) / Bureau Veritas (BV) / ClassNK / RINA..."
                          className="input-control"
                          style={{ borderColor: '#a855f7' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION 4: SASARAN ENTITAS (KAPAL vs KANTOR PUSAT) */}
              <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '12px' }}>
                <h5 style={{ fontSize: '0.88rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  {standard === 'DOC' ? <Building2 size={16} color="#10b981" /> : <Ship size={16} color="#0284c7" />}
                  <span>3. Sasaran Entitas yang Di-audit ({standard === 'DOC' ? 'Kantor Darat' : 'Kapal Armada'}) *</span>
                </h5>

                {standard === 'DOC' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                        Entitas Darat Terdaftar
                      </label>
                      <input
                        type="text"
                        disabled
                        value="Kantor Pusat PT. Pelayaran Baharimas Kalimantan (Pontianak)"
                        className="input-control"
                        style={{ opacity: 0.9, cursor: 'not-allowed', fontWeight: 700 }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                        Divisi Darat Utama yang Diaudit *
                      </label>
                      <select
                        value={docDepartment}
                        onChange={(e) => setDocDepartment(e.target.value)}
                        className="select-control"
                      >
                        <option value="Seluruh Divisi Darat (DPA, QHSE, Ops, Crewing, Logistik)">Seluruh Divisi Darat (Kantor Pusat Terpadu)</option>
                        <option value="Divisi DPA & QHSE (Safety Management & K3LH)">Divisi DPA & QHSE (Safety Management & K3LH)</option>
                        <option value="Divisi Operasional Armada & Pemeliharaan Mesin">Divisi Operasional Armada & Pemeliharaan Mesin</option>
                        <option value="Divisi Human Capital, Crewing & Sertifikasi Pelaut">Divisi Human Capital, Crewing & Sertifikasi Pelaut</option>
                        <option value="Divisi Logistik, Purchasing & Gudang Darat">Divisi Logistik, Purchasing & Gudang Darat</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '0.85rem' }}>
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                          Pilih Kapal Armada Baharimas (28 Unit Kapal) *
                        </label>
                        <select
                          value={vesselId}
                          onChange={(e) => {
                            setVesselId(e.target.value);
                          }}
                          className="select-control"
                          style={{ fontWeight: 700 }}
                        >
                          {vessels.map(v => (
                            <option key={v.id} value={v.id}>
                              🚢 {v.name} ({v.type || 'Tugboat'}) - {v.ownershipStatus || 'As Owner'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                          Nomor Sertifikat SMC Kapal
                        </label>
                        <input
                          type="text"
                          value={smcCertificateNo}
                          onChange={(e) => setSmcCertificateNo(e.target.value)}
                          placeholder="contoh: SMC-TB-RP2004/2024"
                          className="input-control mono"
                          style={{ fontWeight: 700 }}
                        />
                      </div>
                    </div>

                    {/* Snapshot info kapal terpilih */}
                    {currentSelectedVessel && (
                      <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.65rem', fontSize: '0.74rem' }}>
                        <div>
                          <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Nomor Register / IMO:</span>
                          <strong className="mono" style={{ color: 'var(--text-main)' }}>{currentSelectedVessel.regNo || currentSelectedVessel.imo || '-'}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Call Sign & Tipe:</span>
                          <strong className="mono" style={{ color: 'var(--text-main)' }}>{currentSelectedVessel.callSign || '-'} • {currentSelectedVessel.type}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Gross Tonnage:</span>
                          <strong className="mono" style={{ color: '#0284c7' }}>{currentSelectedVessel.gt?.toLocaleString() || '174'} GT</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Pelabuhan Registrasi:</span>
                          <strong style={{ color: 'var(--text-main)' }}>{currentSelectedVessel.portOfRegistry || 'Pontianak'}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons Setup Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={handleProceedFromSetup}
                  className="btn btn-primary btn-sm"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.55rem 1.4rem',
                    fontWeight: 800,
                    fontSize: '0.85rem'
                  }}
                >
                  <span>Lanjutkan ke Formulir Audit {standard} ({auditType})</span>
                  <ArrowRight size={16} />
                </button>
              </div>

            </div>
          </div>
        ) : (
          /* ======================================================================= */
          /* VIEW 2: FORMULIR SESI AUDIT LENGKAP (5 TABS DIBEDAKAN DOC vs SMC)       */
          /* ======================================================================= */
          <>
            {/* SUBTABS NAVIGATION BAR */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.4rem',
              padding: '0.65rem 1.5rem',
              background: 'var(--bg-surface-elevated)',
              borderBottom: '1px solid var(--border-subtle)',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.4rem' }}>
                {[
                  {
                    id: 'general',
                    label: standard === 'DOC' ? '1. Identitas Audit DOC Darat' : '1. Identitas Audit SMC Kapal',
                    icon: standard === 'DOC' ? Building2 : Ship,
                    badge: null
                  },
                  {
                    id: 'integrations',
                    label: standard === 'DOC' ? '2. Legalitas SIUPAL & Logistik' : '2. Sertifikat Kapal & Gudang',
                    icon: FileCheck,
                    badge: `${selectedCertificateIds.length + selectedRequisitionIds.length}`
                  },
                  {
                    id: 'checklist',
                    label: standard === 'DOC' ? '3. Checklist 12 Elemen Darat' : '3. SMS Shipboard Checklist (Rev 05)',
                    icon: Code,
                    badge: `${checklist.length} Item`
                  },
                  {
                    id: 'findings',
                    label: '4. Rekapitulasi Temuan NC',
                    icon: AlertTriangle,
                    badge: `${checklistStats.minorNC + checklistStats.majorNC + checklistStats.obs} NC`,
                    alert: checklistStats.majorNC > 0
                  },
                  {
                    id: 'signoff',
                    label: '5. Kesimpulan & Pengesahan',
                    icon: CheckCircle2,
                    badge: `${checklistStats.score}%`
                  }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`tab-btn ${isActive ? 'active' : ''}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.5rem 0.95rem',
                        fontSize: '0.8rem',
                        fontWeight: isActive ? 700 : 500,
                        borderRadius: '8px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Icon size={14} color={isActive ? '#38bdf8' : 'var(--text-subtle)'} />
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <span className={`badge ${tab.alert ? 'badge-danger-pulse' : isActive ? 'badge-info' : 'badge-neutral'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick Summary Pill & Re-setup button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                  Target: {targetType === 'Vessel' ? currentSelectedVessel?.name : 'Kantor Pusat'}
                </span>
                <button
                  type="button"
                  onClick={handleLoadSampleDemo}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#0284c7' }}
                  title="Muat contoh isian data simulasi jika diperlukan"
                >
                  <Sparkles size={12} />
                  <span>Isi Contoh</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSetupStep(true)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  title="Ganti Pilihan Audit Internal/Eksternal atau DOC/SMC"
                >
                  <RefreshCw size={12} />
                  <span>Ganti Mode</span>
                </button>
              </div>
            </div>

            {/* FORM BODY CONTAINER */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <div className="modal-body" style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>

                {/* ----------------------------------------------------------------- */}
                {/* TAB 1: DATA POKOK (DIBEDAKAN UNTUK DOC VS SMC)                   */}
                {/* ----------------------------------------------------------------- */}
                {activeTab === 'general' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {standard === 'DOC' ? <Building2 size={18} color="#10b981" /> : <Ship size={18} color="#0284c7" />}
                        <span>
                          {standard === 'DOC'
                            ? 'Identitas & Legalitas Sesi Audit DOC (Kantor Pusat PT. PBK)'
                            : `Identitas & Legalitas Sesi Audit SMC Onboard (${currentSelectedVessel?.name})`}
                        </span>
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Status: {auditType === 'Internal' ? 'Internal Baharimas (Mandiri DPA)' : `Eksternal (${externalOrganization})`}
                      </span>
                    </div>

                    {/* Banner Parameter Terpilih */}
                    <div style={{
                      padding: '0.85rem 1.15rem',
                      borderRadius: '10px',
                      background: standard === 'DOC' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(2, 132, 199, 0.08)',
                      border: standard === 'DOC' ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(2, 132, 199, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span className={`badge ${auditType === 'Internal' ? 'badge-info' : 'badge-neutral'}`}>
                          {auditType === 'Internal' ? '🏢 Pelaksana: Internal Baharimas (DPA/QHSE)' : `🏛️ Pelaksana: ${externalOrganization}`}
                        </span>
                        <span className={`badge ${standard === 'DOC' ? 'badge-success' : 'badge-warning'}`}>
                          {standard === 'DOC' ? 'Standar: DOC (Kantor Darat)' : 'Standar: SMC (Kapal Laut)'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsSetupStep(true)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                      >
                        Ubah di Setup Awal ↺
                      </button>
                    </div>

                    {/* Lembaga Eksternal: HANYA MUNCUL JIKA EKSTERNAL */}
                    {auditType === 'External' && (
                      <div className="glass-card" style={{ padding: '1rem', border: '1px solid #a855f7', background: 'rgba(168, 85, 247, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                          <ShieldCheck size={18} color="#a855f7" />
                          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#a855f7', margin: 0 }}>
                            Lembaga / Badan Audit Eksternal yang Ditunjuk Perusahaan *
                          </label>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                          <div>
                            <select
                              value={typeof externalOrganization === 'string' ? externalOrganization : externalOrganization?.name || ''}
                              onChange={(e) => handleExternalOrgChange(e.target.value)}
                              className="select-control"
                              style={{ fontWeight: 700 }}
                            >
                              <optgroup label="Standar BKI (Template Resmi F23.14.06-2024 Rev 05 — 74 Butir)">
                                <option value={BKI_AUDIT_MASTER.name}>
                                  {BKI_AUDIT_MASTER.name} (Checklist Resmi 74 Butir)
                                </option>
                              </optgroup>
                              <optgroup label="Lembaga Lain (Format Mandiri / Manual — Checklist Kosong)">
                                {NON_BKI_AUDIT_ORGANIZATIONS.map(org => (
                                  <option key={org.id || org.name} value={org.name}>
                                    {org.name}
                                  </option>
                                ))}
                              </optgroup>
                            </select>
                          </div>
                          {(externalOrganization === 'Lembaga Audit Eksternal Lainnya (Input Manual)' ||
                            externalOrganization === 'Lainnya / Lembaga Lain' ||
                            (typeof externalOrganization === 'string' && externalOrganization.includes('Lainnya'))) && (
                            <div>
                              <input
                                type="text"
                                required
                                value={customExternalOrg}
                                onChange={(e) => setCustomExternalOrg(e.target.value)}
                                placeholder="cth: Lloyd's Register (LR) / Bureau Veritas (BV) / ClassNK / RINA..."
                                className="input-control"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Bagian Khusus DOC vs SMC */}
                    {standard === 'DOC' ? (
                      /* KHUSUS FORM DOC DARAT */
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                            Target Entitas Darat
                          </label>
                          <input
                            type="text"
                            disabled
                            value="Kantor Pusat PT. Pelayaran Baharimas Kalimantan (Pontianak)"
                            className="input-control"
                            style={{ opacity: 0.9, cursor: 'not-allowed', fontWeight: 700 }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                            Divisi Darat yang Diaudit *
                          </label>
                          <input
                            type="text"
                            required
                            value={docDepartment}
                            onChange={(e) => setDocDepartment(e.target.value)}
                            placeholder="cth: Divisi DPA & QHSE, Operasional Armada..."
                            className="input-control"
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                            Nomor Sertifikat / Izin DOC Perusahaan *
                          </label>
                          <input
                            type="text"
                            required
                            value={docCertificateNo}
                            onChange={(e) => setDocCertificateNo(e.target.value)}
                            placeholder="contoh: DOC-IDN-PBK/2024-R1"
                            className="input-control mono"
                            style={{ fontWeight: 700 }}
                          />
                        </div>
                      </div>
                    ) : (
                      /* KHUSUS FORM SMC KAPAL */
                      <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '0.85rem' }}>
                          <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                              Target Kapal Armada (28 Unit) *
                            </label>
                            <select
                              value={vesselId}
                              onChange={(e) => {
                                setVesselId(e.target.value);
                              }}
                              className="select-control"
                              style={{ fontWeight: 700 }}
                            >
                              {vessels.map(v => (
                                <option key={v.id} value={v.id}>
                                  🚢 {v.name} ({v.type || 'Tugboat'}) - {v.ownershipStatus || 'As Owner'}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                              Nomor Sertifikat SMC Kapal *
                            </label>
                            <input
                              type="text"
                              required
                              value={smcCertificateNo}
                              onChange={(e) => setSmcCertificateNo(e.target.value)}
                              placeholder="contoh: SMC-TB-RP2004/2024"
                              className="input-control mono"
                              style={{ fontWeight: 700 }}
                            />
                          </div>
                        </div>

                        {/* Snapshot Spesifikasi Teknis Kapal */}
                        {currentSelectedVessel && (
                          <div style={{ padding: '0.85rem 1.15rem', borderRadius: '10px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.75rem' }}>
                            <div>
                              <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Nomor Register BKI / IMO:</span>
                              <strong className="mono" style={{ color: 'var(--text-main)' }}>{currentSelectedVessel.regNo || currentSelectedVessel.imo || '-'}</strong>
                            </div>
                            <div>
                              <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Call Sign & Tipe:</span>
                              <strong className="mono" style={{ color: 'var(--text-main)' }}>{currentSelectedVessel.callSign || '-'} • {currentSelectedVessel.type}</strong>
                            </div>
                            <div>
                              <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Gross Tonnage (GT):</span>
                              <strong className="mono" style={{ color: '#0284c7' }}>{currentSelectedVessel.gt?.toLocaleString()} GT</strong>
                            </div>
                            <div>
                              <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Pelabuhan Registrasi:</span>
                              <strong style={{ color: 'var(--text-main)' }}>{currentSelectedVessel.portOfRegistry || 'Pontianak'}</strong>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Nomor Register Sesi & Nomor Laporan Audit */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                          Nomor Register Sesi Audit *
                        </label>
                        <input
                          type="text"
                          required
                          value={auditNo}
                          onChange={(e) => setAuditNo(e.target.value)}
                          placeholder={`contoh: AUD-${auditType === 'Internal' ? 'INT' : 'EXT'}-${standard}-2026/101`}
                          className="input-control mono"
                          style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0284c7' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                          Nomor Laporan Audit Resmi (Report ID) *
                        </label>
                        <input
                          type="text"
                          required
                          value={reportId}
                          onChange={(e) => setReportId(e.target.value)}
                          placeholder={`contoh: 0859 - PK/ISM- ${standard} /2026`}
                          className="input-control mono"
                          style={{ fontWeight: 800, fontSize: '0.9rem', color: '#10b981' }}
                        />
                      </div>
                    </div>

                    {/* Auditor, Team, Auditee, Location */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                          Lead Auditor (Ketua Tim Audit) *
                        </label>
                        <input
                          type="text"
                          required
                          value={leadAuditor}
                          onChange={(e) => setLeadAuditor(e.target.value)}
                          placeholder="Nama Lead Auditor / Instansi"
                          className="input-control"
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                          Tim Auditor (Anggota)
                        </label>
                        <input
                          type="text"
                          value={auditTeam}
                          onChange={(e) => setAuditTeam(e.target.value)}
                          placeholder="contoh: Ir. Syamsul, Capt. Ahmad"
                          className="input-control"
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                          Pihak Auditee (Yang Di-audit) *
                        </label>
                        <input
                          type="text"
                          required
                          value={auditee}
                          onChange={(e) => setAuditee(e.target.value)}
                          placeholder={standard === 'DOC' ? 'Direktur Operasional, DPA, Manager' : 'Nakhoda, KKM'}
                          className="input-control"
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                          Lokasi Pelaksanaan Audit *
                        </label>
                        <input
                          type="text"
                          required
                          value={auditLocation}
                          onChange={(e) => setAuditLocation(e.target.value)}
                          placeholder="contoh: Dermaga Dwikora Pontianak / Kantor Pusat"
                          className="input-control"
                        />
                      </div>
                    </div>

                    {/* Tanggal & Status */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                          Tanggal Audit *
                        </label>
                        <input
                          type="date"
                          required
                          value={auditDate}
                          onChange={(e) => setAuditDate(e.target.value)}
                          className="input-control mono"
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                          Target Penutupan NC (Due Date) *
                        </label>
                        <input
                          type="date"
                          required
                          value={targetCloseDate}
                          onChange={(e) => setTargetCloseDate(e.target.value)}
                          className="input-control mono"
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                          Status Sesi Audit
                        </label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="select-control"
                        >
                          <option value="Scheduled">Terjadwal (Scheduled)</option>
                          <option value="In Progress">Sedang Berlangsung (In Progress)</option>
                          <option value="Completed">Selesai (Completed)</option>
                        </select>
                      </div>
                    </div>

                    {/* Ruang Lingkup (Scope) */}
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                        Ruang Lingkup & Dasar Regulasi (Scope) *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={scope}
                        onChange={(e) => setScope(e.target.value)}
                        placeholder="Tuliskan ruang lingkup klausul ISM Code dan sasaran audit ini..."
                        className="input-control"
                        style={{ resize: 'vertical' }}
                      />
                    </div>
                  </div>
                )}

                {/* ----------------------------------------------------------------- */}
                {/* TAB 2: SERTIFIKAT & LOGISTIK GUDANG (DIBEDAKAN DOC vs SMC)        */}
                {/* ----------------------------------------------------------------- */}
                {activeTab === 'integrations' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>
                        {standard === 'DOC'
                          ? 'Dokumen Legalitas SIUPAL, Sertifikat DOC & Logistik Terpusat Darat'
                          : `Sertifikat Statutori Kapal (${currentSelectedVessel?.name}) & Permintaan Barang Gudang`}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {standard === 'DOC' ? 'Kepatuhan Regulasi Manajemen Kantor' : 'Kelaikan Statutori Kapal di Laut'}
                      </span>
                    </div>

                    {/* Section A: Dokumen & Sertifikat */}
                    <div className="glass-card" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FileCheck size={18} color="#10b981" />
                          <h5 style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                            {standard === 'DOC'
                              ? 'Pilih Dokumen Legalitas Perusahaan, Izin SIUPAL & Manual SMS Darat'
                              : `Pilih Sertifikat Statutori Kapal ${currentSelectedVessel?.name || ''} yang Diperiksa`}
                          </h5>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {selectedCertificateIds.length} Dokumen Dipilih
                        </span>
                      </div>

                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        {standard === 'DOC'
                          ? 'Centang dokumen legalitas perusahaan (DOC Darat, Surat Izin Usaha SIUPAL, Penunjukan DPA, Polis Asuransi Armada) yang diverifikasi keabsahannya.'
                          : 'Centang sertifikat statutory kapal (SMC Kapal, SAFCON, Safety Equipment, Radio, Garis Muat, IOPP, Pas Besar, Sertifikat Mesin BKI, Servis ILR, APAR) yang diperiksa.'}
                      </p>

                      <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.5rem' }}>
                        {relevantCertificates.length === 0 ? (
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', padding: '1rem', textAlign: 'center' }}>
                            Tidak ada dokumen khusus ditemukan untuk target ini.
                          </p>
                        ) : (
                          relevantCertificates.map(doc => {
                            const isChecked = selectedCertificateIds.includes(doc.id);
                            return (
                              <label
                                key={doc.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '0.5rem 0.75rem',
                                  borderRadius: '6px',
                                  background: isChecked ? 'rgba(2, 132, 199, 0.12)' : 'var(--bg-surface-elevated)',
                                  border: isChecked ? '1px solid #0284c7' : '1px solid transparent',
                                  cursor: 'pointer',
                                  fontSize: '0.78rem'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedCertificateIds(prev => [...prev, doc.id]);
                                      } else {
                                        setSelectedCertificateIds(prev => prev.filter(id => id !== doc.id));
                                      }
                                    }}
                                  />
                                  <div>
                                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{doc.name || doc.type}</span>
                                    <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginLeft: '0.5rem' }}>
                                      No: {doc.documentNumber || 'REG-DOC'}
                                    </span>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span className={`badge ${doc.status === 'Active' ? 'badge-success' : doc.status === 'Due Soon' ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: '0.65rem' }}>
                                    {doc.status}
                                  </span>
                                  <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                    Exp: {doc.expiryDate}
                                  </span>
                                </div>
                              </label>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Section B: Logistik & Gudang */}
                    <div className="glass-card" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Package size={18} color="#f59e0b" />
                          <h5 style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                            {standard === 'DOC'
                              ? 'Hubungkan Surat Pengadaan & Pembelian Suku Cadang Terpusat Gudang'
                              : `Hubungkan Surat Permintaan Barang (Material Requisition) ${currentSelectedVessel?.name || 'Kapal'} ke Gudang`}
                          </h5>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {selectedRequisitionIds.length} Permintaan Ditautkan
                        </span>
                      </div>

                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        {standard === 'DOC'
                          ? 'Pilih dokumen pengadaan barang/suku cadang logistik darat untuk memastikan dukungan kantor terhadap keandalan kapal armada.'
                          : `Pilih surat permintaan barang (SPB) kapal ${currentSelectedVessel?.name} untuk perbaikan mesin, safety gear, atau perlengkapan navigasi.`}
                      </p>

                      <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.5rem' }}>
                        {relevantRequisitions.length === 0 ? (
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', padding: '1rem', textAlign: 'center' }}>
                            Tidak ada surat permintaan barang terdaftar untuk target ini.
                          </p>
                        ) : (
                          relevantRequisitions.map(req => {
                            const isChecked = selectedRequisitionIds.includes(req.id);
                            return (
                              <label
                                key={req.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '0.5rem 0.75rem',
                                  borderRadius: '6px',
                                  background: isChecked ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-surface-elevated)',
                                  border: isChecked ? '1px solid #f59e0b' : '1px solid transparent',
                                  cursor: 'pointer',
                                  fontSize: '0.78rem'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedRequisitionIds(prev => [...prev, req.id]);
                                      } else {
                                        setSelectedRequisitionIds(prev => prev.filter(id => id !== req.id));
                                      }
                                    }}
                                  />
                                  <div>
                                    <span className="mono" style={{ fontWeight: 800, color: '#f59e0b' }}>{req.requisitionNumber || req.id}</span>
                                    <span style={{ fontWeight: 600, color: 'var(--text-main)', marginLeft: '0.5rem' }}>
                                      {req.title || req.department || 'Material Requisition'}
                                    </span>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                                    {req.status || 'In Warehouse'}
                                  </span>
                                  <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                    {req.requestDate || req.createdAt?.split('T')[0]}
                                  </span>
                                </div>
                              </label>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ----------------------------------------------------------------- */}
                {/* TAB 3: CHECKLIST AUDIT (DIBEDAKAN DOC 12 ELEMEN vs SMC REV 05)     */}
                {/* ----------------------------------------------------------------- */}
                {activeTab === 'checklist' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                      <div>
                        {(() => {
                          const orgConfig = getChecklistConfigForSession(externalOrganization);
                          const isBKI = isBKIOrganization(externalOrganization);
                          return (
                            <>
                              <h4 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>
                                  {standard === 'DOC'
                                    ? 'Checklist Audit ISM Code Darat (12 Elemen Kantor Pusat PT. PBK)'
                                    : isBKI
                                      ? 'Pemeriksaan Checklist Resmi BKI (SMS Shipboard Checklist Rev 05)'
                                      : `Pemeriksaan Checklist Audit ${orgConfig.organizationName}`}
                                </span>
                                {standard === 'SMC' && isBKI ? (
                                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Template Resmi BKI</span>
                                ) : standard === 'SMC' ? (
                                  <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>Format Mandiri (Non-BKI)</span>
                                ) : (
                                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>DOC Standar Baharimas</span>
                                )}
                              </h4>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                                {standard === 'DOC'
                                  ? 'Standar IMO ISM Code Resolusi A.741(18) untuk manajemen operasional kantor darat. Setiap butir dapat dinilai dan dilampiri bukti audit.'
                                  : isBKI
                                    ? 'Formulir Resmi BKI 00954PK26_F23_14_06-2024 Rev 05 — 74 Klausul lengkap (termasuk klausul khusus tipe kapal A s/d E).'
                                    : `Format checklist untuk ${orgConfig.organizationName} disesuaikan secara mandiri. Template resmi BKI dipisahkan dan tidak terpakai oleh lembaga ini.`}
                              </p>
                            </>
                          );
                        })()}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {standard === 'SMC' && isBKIOrganization(externalOrganization) && (
                          <button
                            type="button"
                            onClick={handleLoadSMSChecklistTemplate}
                            className="btn btn-secondary btn-sm"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#0284c7' }}
                            title="Muat 10 Halaman Lengkap SMS Shipboard Checklist (Rev 05) termasuk klausul dicoret A-E"
                          >
                            <FileSpreadsheet size={14} />
                            <span>Muat SMS Checklist Rev 05 Lengkap</span>
                          </button>
                        )}

                        {checklist.length > 0 && (
                          <button
                            type="button"
                            onClick={handleClearAllResults}
                            className="btn btn-secondary btn-sm"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--text-muted)' }}
                            title="Kosongkan seluruh pilihan Yes/No/N/A dan catatan pada checklist"
                          >
                            <RotateCcw size={13} />
                            <span>Kosongkan Pilihan (Reset)</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setShowManualItemForm(!showManualItemForm)}
                          className="btn btn-primary btn-sm"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                        >
                          <Plus size={14} />
                          <span>+ Tambah Item Manual</span>
                        </button>
                      </div>
                    </div>

                    {/* Banner: Non-BKI empty state — hanya tampil jika SMC dan bukan BKI */}
                    {standard === 'SMC' && !isBKIOrganization(externalOrganization) && (
                      <div style={{
                        padding: '1.5rem 1.75rem',
                        borderRadius: '10px',
                        border: '1.5px dashed #f59e0b',
                        background: 'rgba(245,158,11,0.07)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.75rem',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>📋</div>
                        <div>
                          <h5 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#d97706', marginBottom: '0.35rem' }}>
                            Template Checklist Tidak Tersedia untuk {getChecklistConfigForSession(externalOrganization).organizationName}
                          </h5>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '520px' }}>
                            Formulir checklist SMS Shipboard <strong>hanya tersedia untuk BKI</strong> (Biro Klasifikasi Indonesia) berdasarkan standar F23.14.06-2024 Rev 05.
                            Setiap lembaga audit memiliki format dan standar pemeriksaan yang berbeda.
                          </p>
                          <p style={{ fontSize: '0.78rem', color: '#d97706', marginTop: '0.4rem', fontWeight: 600 }}>
                            Silakan gunakan tombol <strong>&quot;+ Tambah Item Manual&quot;</strong> untuk menyusun butir pemeriksaan sesuai standar lembaga yang ditunjuk.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowManualItemForm(true)}
                          className="btn btn-primary btn-sm"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                        >
                          <Plus size={14} />
                          <span>+ Mulai Tambah Butir Pemeriksaan Manual</span>
                        </button>
                      </div>
                    )}

                    {/* Filter Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {[
                        { id: 'ALL', label: `Semua Butir (${checklist.length})` },
                        { id: 'CORE', label: `Klausul Aktif (${checklist.filter(c => !c.isStrikethrough).length})` },
                        { id: 'STRIKETHROUGH', label: `Klausul Dicoret (${checklist.filter(c => c.isStrikethrough).length})` },
                        { id: 'HAS_EVIDENCE', label: `Memiliki Bukti Audit (${checklist.filter(c => Boolean(c.evidence)).length})` }
                      ].map(f => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setChecklistFilter(f.id)}
                          className={`btn btn-sm ${checklistFilter === f.id ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem' }}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>

                    {/* Manual Item Creator Form */}
                    {showManualItemForm && (
                      <div className="glass-card" style={{ padding: '1.25rem', border: '1px solid #0284c7', background: 'rgba(2, 132, 199, 0.06)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                          <h5 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Code size={15} />
                            <span>Form Input Item / Klausul Audit Manual</span>
                          </h5>
                          <button type="button" onClick={() => setShowManualItemForm(false)} className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.45rem' }}>
                            <X size={14} />
                          </button>
                        </div>

                        {/* Baris 1: No./Kode | Items to be checked | ISM Code */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <div>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                              No. / Kode Klausul *
                            </label>
                            <input
                              type="text"
                              required
                              value={manualCode}
                              onChange={(e) => setManualCode(e.target.value)}
                              placeholder={standard === 'DOC' ? 'ISM-DOC-13' : 'ISM-10.3 / SOLAS-II'}
                              className="input-control mono"
                              style={{ fontWeight: 800, color: '#0284c7' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                              Items to be checked *
                            </label>
                            <input
                              type="text"
                              required
                              value={manualName}
                              onChange={(e) => setManualName(e.target.value)}
                              placeholder="Uraian judul / pertanyaan item audit..."
                              className="input-control"
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                              ISM Code / Ref.
                            </label>
                            <input
                              type="text"
                              placeholder="cth: 10, 8.2, MARPOL V"
                              className="input-control mono"
                              style={{ color: '#0284c7' }}
                              id="manualIsmCode"
                            />
                          </div>
                        </div>

                        {/* Baris 2: Kriteria Verifikasi | Remark / Catatan */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <div>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                              Kriteria Verifikasi / Detail Pemeriksaan
                            </label>
                            <input
                              type="text"
                              value={manualCriteria}
                              onChange={(e) => setManualCriteria(e.target.value)}
                              placeholder="Bukti atau fakta yang dicek..."
                              className="input-control"
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                              Remark / Catatan Temuan
                            </label>
                            <input
                              type="text"
                              value={manualNotes}
                              onChange={(e) => setManualNotes(e.target.value)}
                              placeholder="Catatan temuan bila ada..."
                              className="input-control"
                            />
                          </div>
                        </div>

                        {/* Baris 3: Result — Yes / No / N/A toggle visual */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem', padding: '0.6rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.25rem' }}>Result:</span>

                          {/* Yes */}
                          <button
                            type="button"
                            onClick={() => setManualResult('Complied')}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '0.3rem',
                              padding: '0.3rem 0.75rem', borderRadius: '6px',
                              border: manualResult === 'Complied' ? '2px solid #16a34a' : '1px solid var(--border-subtle)',
                              background: manualResult === 'Complied' ? 'rgba(22,163,74,0.12)' : 'transparent',
                              cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem',
                              color: manualResult === 'Complied' ? '#16a34a' : 'var(--text-muted)'
                            }}
                          >
                            <span style={{ fontSize: '16px', lineHeight: 1 }}>{manualResult === 'Complied' ? '⊠' : '□'}</span>
                            <span>Yes</span>
                          </button>

                          {/* No */}
                          <button
                            type="button"
                            onClick={() => setManualResult('Minor NC')}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '0.3rem',
                              padding: '0.3rem 0.75rem', borderRadius: '6px',
                              border: ['Minor NC', 'Major NC', 'Observation'].includes(manualResult) ? '2px solid #dc2626' : '1px solid var(--border-subtle)',
                              background: ['Minor NC', 'Major NC', 'Observation'].includes(manualResult) ? 'rgba(220,38,38,0.1)' : 'transparent',
                              cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem',
                              color: ['Minor NC', 'Major NC', 'Observation'].includes(manualResult) ? '#dc2626' : 'var(--text-muted)'
                            }}
                          >
                            <span style={{ fontSize: '16px', lineHeight: 1 }}>{['Minor NC', 'Major NC', 'Observation'].includes(manualResult) ? '⊠' : '□'}</span>
                            <span>No</span>
                          </button>

                          {/* N/A */}
                          <button
                            type="button"
                            onClick={() => setManualResult('N/A')}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '0.3rem',
                              padding: '0.3rem 0.75rem', borderRadius: '6px',
                              border: manualResult === 'N/A' ? '2px solid #64748b' : '1px solid var(--border-subtle)',
                              background: manualResult === 'N/A' ? 'rgba(100,116,139,0.1)' : 'transparent',
                              cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem',
                              color: manualResult === 'N/A' ? '#64748b' : 'var(--text-muted)'
                            }}
                          >
                            <span style={{ fontSize: '16px', lineHeight: 1 }}>{manualResult === 'N/A' ? '⊠' : '□'}</span>
                            <span>N/A</span>
                          </button>

                          {/* Jika No, tampilkan sub-pilihan severity */}
                          {['Minor NC', 'Major NC', 'Observation'].includes(manualResult) && (
                            <div style={{ marginLeft: '0.5rem', display: 'flex', gap: '0.35rem', alignItems: 'center', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '0.5rem' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Tingkat:</span>
                              {['Minor NC', 'Major NC', 'Observation'].map(opt => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setManualResult(opt)}
                                  style={{
                                    padding: '0.15rem 0.45rem', borderRadius: '5px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer',
                                    border: manualResult === opt ? '2px solid #dc2626' : '1px solid var(--border-subtle)',
                                    background: manualResult === opt ? '#dc2626' : 'transparent',
                                    color: manualResult === opt ? '#fff' : 'var(--text-muted)'
                                  }}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}

                          <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            {manualResult === 'Complied' ? '✅ Memenuhi syarat' : manualResult === 'N/A' ? '⚪ Tidak berlaku' : `⚠️ ${manualResult}`}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button type="button" onClick={() => setShowManualItemForm(false)} className="btn btn-secondary btn-sm">
                            Batal
                          </button>
                          <button type="button" onClick={handleAddManualChecklistItem} className="btn btn-primary btn-sm">
                            Simpan ke Daftar Checklist
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Scorecard Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>
                        Total Item Ditampilkan: <strong style={{ color: 'var(--text-main)' }}>{checklist.length}</strong>
                      </span>
                      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                        <span style={{ color: '#10b981', fontWeight: 700 }}>{checklistStats.complied} Complied</span>
                        <span>•</span>
                        <span style={{ color: '#60a5fa', fontWeight: 700 }}>{checklistStats.obs} Observasi</span>
                        <span>•</span>
                        <span style={{ color: '#f59e0b', fontWeight: 700 }}>{checklistStats.minorNC} Minor NC</span>
                        <span>•</span>
                        <span style={{ color: '#f87171', fontWeight: 700 }}>{checklistStats.majorNC} Major NC</span>
                        <span>•</span>
                        <span style={{ color: '#0284c7', fontWeight: 700 }}>{checklist.filter(c => Boolean(c.evidence)).length} Bukti Terunggah</span>
                      </div>
                      <span className="badge badge-info" style={{ fontWeight: 800 }}>
                        Skor: {checklistStats.score}%
                      </span>
                    </div>

                    {/* Checklist Table */}
                    <div className="table-container">
                      <table className="pms-table">
                        <thead>
                          <tr>
                            <th style={{ width: '90px', textAlign: 'center' }}>No.</th>
                            <th>Items to be checked</th>
                            <th style={{ width: '52px', textAlign: 'center' }}>Yes</th>
                            <th style={{ width: '52px', textAlign: 'center' }}>No</th>
                            <th style={{ width: '52px', textAlign: 'center' }}>N/A</th>
                            <th>Remark / Catatan</th>
                            <th style={{ width: '200px' }}>Upload Bukti Audit</th>
                            <th style={{ width: '100px', textAlign: 'center' }}>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {checklist.length === 0 && (
                            <tr>
                              <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>📋</div>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                  Daftar Butir Pemeriksaan Kosong
                                </div>
                                <div style={{ fontSize: '0.78rem' }}>
                                  {isBKIOrganization(externalOrganization)
                                    ? 'Klik tombol "Muat SMS Checklist Rev 05 Lengkap" di atas untuk memuat template resmi BKI.'
                                    : `Format checklist untuk ${getChecklistConfigForSession(externalOrganization).organizationName} disesuaikan secara manual. Klik "+ Tambah Item Manual" untuk mulai menambah butir pemeriksaan.`}
                                </div>
                              </td>
                            </tr>
                          )}
                          {checklist
                            .filter(item => {
                              if (checklistFilter === 'CORE') return !item.isStrikethrough;
                              if (checklistFilter === 'STRIKETHROUGH') return item.isStrikethrough;
                              if (checklistFilter === 'HAS_EVIDENCE') return Boolean(item.evidence);
                              return true;
                            })
                            .map((item, idx) => {
                              const resultVal = item.result || '';
                              const isYes = resultVal === 'Complied' || resultVal === 'Yes';
                              const isNo = ['No', 'Major NC', 'Minor NC', 'Observation'].includes(resultVal);
                              const isNA = resultVal === 'N/A';

                              return (
                                <tr key={item.id} style={{ background: item.isStrikethrough ? 'rgba(239, 68, 68, 0.03)' : undefined }}>
                                  {/* No. + Kode */}
                                  <td style={{ textAlign: 'center', verticalAlign: 'top' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                                      <span className="mono" style={{ fontWeight: 800, fontSize: '0.78rem', color: item.isManual ? '#0284c7' : item.isStrikethrough ? '#94a3b8' : '#10b981' }}>
                                        {item.code}
                                      </span>
                                      {item.isManual && (
                                        <span className="badge badge-neutral" style={{ fontSize: '0.58rem', padding: '0.05rem 0.3rem' }}>Manual</span>
                                      )}
                                      {item.isStrikethrough ? (
                                        <button
                                          type="button"
                                          onClick={() => handleToggleChecklistStrikethrough(item.id)}
                                          className="badge badge-warning"
                                          style={{ fontSize: '0.56rem', padding: '0.1rem 0.3rem', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.15rem', width: 'fit-content' }}
                                          title="Lepas coret klausul ini"
                                        >
                                          <Undo2 size={8} /><span>Lepas Coret</span>
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => handleToggleChecklistStrikethrough(item.id)}
                                          style={{ fontSize: '0.56rem', padding: '0.05rem 0.28rem', border: '1px dashed var(--border-subtle)', background: 'transparent', color: 'var(--text-muted)', borderRadius: '3px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.15rem', width: 'fit-content' }}
                                          title="Coret klausul ini (N/A)"
                                        >
                                          <Strikethrough size={8} /><span>Coret</span>
                                        </button>
                                      )}
                                    </div>
                                  </td>

                                  {/* Items to be checked */}
                                  <td style={{ verticalAlign: 'top' }}>
                                    <div style={{ textDecoration: item.isStrikethrough ? 'line-through' : 'none', color: item.isStrikethrough ? 'var(--text-muted)' : 'var(--text-main)' }}>
                                      <strong style={{ fontSize: '0.82rem', display: 'block' }}>{item.name}</strong>
                                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.15rem', lineHeight: 1.5 }}>
                                        {item.checkPoint}
                                      </span>
                                      {item.ismCode && (
                                        <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#0284c7', background: 'rgba(2,132,199,0.1)', borderRadius: '4px', padding: '0.05rem 0.3rem', display: 'inline-block', marginTop: '0.2rem' }}>
                                          ISM §{item.ismCode}
                                        </span>
                                      )}
                                    </div>
                                    {item.isStrikethrough && (
                                      <div style={{ fontSize: '0.68rem', color: '#f59e0b', marginTop: '0.2rem', fontWeight: 600 }}>
                                        ⚠️ Klausul dicoret auditor (N/A)
                                      </div>
                                    )}
                                  </td>

                                  {/* Yes */}
                                  <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    <div
                                      className={`audit-checkbox-box ${isYes ? 'active-yes' : ''}`}
                                      title={isYes ? 'Batal pilih Yes (Kosongkan)' : 'Tandai: Complied / Yes'}
                                      onClick={() => !item.isStrikethrough && handleChecklistChange(item.id, 'result', isYes ? '' : 'Complied')}
                                      style={{ cursor: item.isStrikethrough ? 'not-allowed' : 'pointer' }}
                                    >
                                      {isYes && <span style={{ fontSize: '13px', fontWeight: 900, lineHeight: 1 }}>✕</span>}
                                    </div>
                                  </td>

                                  {/* No */}
                                  <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    <div
                                      className={`audit-checkbox-box ${isNo ? 'active-no' : ''}`}
                                      title={isNo ? 'Batal pilih No (Kosongkan)' : 'Tandai: Minor NC / No'}
                                      onClick={() => !item.isStrikethrough && handleChecklistChange(item.id, 'result', isNo ? '' : 'Minor NC')}
                                      style={{ cursor: item.isStrikethrough ? 'not-allowed' : 'pointer' }}
                                    >
                                      {isNo && <span style={{ fontSize: '13px', fontWeight: 900, lineHeight: 1 }}>✕</span>}
                                    </div>
                                  </td>

                                  {/* N/A */}
                                  <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    <div
                                      className={`audit-checkbox-box ${isNA ? 'active-na' : ''}`}
                                      title={isNA ? 'Batal pilih N/A (Kosongkan)' : 'Tandai: N/A (Tidak Berlaku)'}
                                      onClick={() => !item.isStrikethrough && handleChecklistChange(item.id, 'result', isNA ? '' : 'N/A')}
                                      style={{ cursor: item.isStrikethrough ? 'not-allowed' : 'pointer' }}
                                    >
                                      {isNA && <span style={{ fontSize: '13px', fontWeight: 900, lineHeight: 1 }}>✕</span>}
                                    </div>
                                  </td>

                                  {/* Remark / Catatan */}
                                  <td style={{ verticalAlign: 'middle' }}>
                                    <input
                                      type="text"
                                      value={item.notes || ''}
                                      onChange={(e) => handleChecklistChange(item.id, 'notes', e.target.value)}
                                      placeholder="Catatan temuan / bukti fisik..."
                                      className="input-control"
                                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                                    />
                                  </td>

                                  {/* Upload Bukti Audit */}
                                  <td style={{ verticalAlign: 'middle' }}>
                                    {item.evidence ? (
                                      <div style={{ padding: '0.35rem 0.55rem', borderRadius: '6px', background: 'rgba(2,132,199,0.12)', border: '1px solid rgba(2,132,199,0.3)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.3rem' }}>
                                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0284c7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }} title={item.evidence.fileName}>
                                            📎 {item.evidence.fileName}
                                          </span>
                                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{item.evidence.fileSize}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'flex-end' }}>
                                          <button type="button" onClick={() => setPreviewEvidence(item.evidence)} className="btn btn-secondary btn-sm" style={{ padding: '0.15rem 0.4rem', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                            <Eye size={11} /><span>Lihat</span>
                                          </button>
                                          <button type="button" onClick={() => handleRemoveChecklistEvidence(item.id)} className="btn btn-secondary btn-sm" style={{ padding: '0.15rem 0.35rem', color: '#ef4444' }}>
                                            <Trash2 size={11} />
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                                        <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', fontSize: '0.7rem', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }} title="Unggah Foto/Dokumen Bukti Audit">
                                          <Upload size={12} /><span>Upload Bukti</span>
                                          <input type="file" accept="image/*,application/pdf" style={{ display: 'none' }} onChange={(e) => handleUploadChecklistEvidence(item.id, e.target.files?.[0])} />
                                        </label>
                                        <button type="button" onClick={() => handleGenerateMockChecklistEvidence(item)} className="btn btn-secondary btn-sm" style={{ fontSize: '0.68rem', padding: '0.25rem 0.45rem', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '0.2rem' }} title="Lampirkan Dokumen Bukti Simulasi Cepat">
                                          <Sparkles size={11} /><span>Simulasi</span>
                                        </button>
                                      </div>
                                    )}
                                  </td>

                                  {/* Aksi */}
                                  <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                                      {item.isManual && (
                                        <button type="button" onClick={() => handleDeleteChecklistItem(item.id)} className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.35rem', color: '#ef4444' }} title="Hapus item manual">
                                          <Trash2 size={12} />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ----------------------------------------------------------------- */}
                {/* TAB 4: REKAPITULASI TEMUAN NC (DIBEDAKAN DOC vs SMC)              */}
                {/* ----------------------------------------------------------------- */}
                {activeTab === 'findings' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>
                          {standard === 'DOC'
                            ? 'Daftar Temuan Ketidaksesuaian Manajemen Darat (DOC NC)'
                            : `Daftar Temuan Ketidaksesuaian Onboard Kapal (${currentSelectedVessel?.name})`}
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Temuan ketidaksesuaian (NC Open & NC Close) yang teridentifikasi pada sesi audit ini
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowAddFindingForm(!showAddFindingForm)}
                        className="btn btn-primary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                      >
                        <Plus size={14} />
                        <span>+ Catat Temuan Baru Sesi Ini</span>
                      </button>
                    </div>

                    {/* Inline Add Finding Form */}
                    {showAddFindingForm && (
                      <div className="glass-card" style={{ padding: '1.25rem', border: '1px solid #f59e0b', background: 'rgba(245, 158, 11, 0.06)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                          <h5 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <AlertTriangle size={15} />
                            <span>Form Catat Temuan Ketidaksesuaian Baru ({standard})</span>
                          </h5>
                          <button type="button" onClick={() => setShowAddFindingForm(false)} className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.45rem' }}>
                            <X size={14} />
                          </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <div>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                              Pilih Klausul {standard} Terkait *
                            </label>
                            <select
                              value={newFindingClause}
                              onChange={(e) => setNewFindingClause(e.target.value)}
                              className="select-control"
                            >
                              {checklist.length > 0 ? (
                                checklist.map(c => (
                                  <option key={c.code} value={c.code}>
                                    {c.code} - {c.name}
                                  </option>
                                ))
                              ) : (
                                <option value="GENERAL">Klausul Umum / Belum Terdaftar di Checklist</option>
                              )}
                            </select>
                          </div>

                          <div>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                              Kategori Temuan (Severity) *
                            </label>
                            <select
                              value={newFindingCategory}
                              onChange={(e) => setNewFindingCategory(e.target.value)}
                              className="select-control"
                            >
                              <option value="Minor NC">Minor NC (Koreksi Bertahap)</option>
                              <option value="Major NC">Major NC (Kritis / Stop Ops)</option>
                              <option value="Observation">Observasi (Saran Mutu)</option>
                            </select>
                          </div>

                          <div>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                              PIC Penanggung Jawab
                            </label>
                            <input
                              type="text"
                              value={newFindingPIC}
                              onChange={(e) => setNewFindingPIC(e.target.value)}
                              placeholder={standard === 'DOC' ? 'cth: Manager QHSE / DPA / Crewing' : 'cth: KKM / Nakhoda Kapal'}
                              className="input-control"
                            />
                          </div>
                        </div>

                        <div style={{ marginBottom: '0.75rem' }}>
                          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                            Uraian Ketidaksesuaian (Description) *
                          </label>
                          <textarea
                            rows={2}
                            required
                            value={newFindingDesc}
                            onChange={(e) => setNewFindingDesc(e.target.value)}
                            placeholder="Jelaskan ketidaksesuaian yang ditemukan terhadap prosedur ISM Code..."
                            className="input-control"
                          />
                        </div>

                        <div style={{ marginBottom: '0.75rem' }}>
                          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                            Bukti Objektif Auditor (Objective Evidence)
                          </label>
                          <input
                            type="text"
                            value={newFindingEvidence}
                            onChange={(e) => setNewFindingEvidence(e.target.value)}
                            placeholder="Fakta fisik, catatan logbook, arsip darat, atau observasi langsung..."
                            className="input-control"
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button type="button" onClick={() => setShowAddFindingForm(false)} className="btn btn-secondary btn-sm">
                            Batal
                          </button>
                          <button type="button" onClick={handleAddFindingInline} className="btn btn-primary btn-sm">
                            Catat Temuan (NC Open)
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Findings Table */}
                    <div className="table-container">
                      <table className="pms-table">
                        <thead>
                          <tr>
                            <th>No. Temuan</th>
                            <th>Klausul</th>
                            <th>Kategori</th>
                            <th>Uraian Ketidaksesuaian</th>
                            <th>Batas Waktu</th>
                            <th>Status NC</th>
                            <th>PIC</th>
                          </tr>
                        </thead>
                        <tbody>
                          {findingsList.length === 0 ? (
                            <tr>
                              <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                Belum ada temuan yang tercatat untuk sesi audit ini. Klik tombol "+ Catat Temuan Baru Sesi Ini" di atas untuk menambahkan.
                              </td>
                            </tr>
                          ) : (
                            findingsList.map(f => (
                              <tr key={f.id}>
                                <td>
                                  <strong className="mono" style={{ color: '#0284c7' }}>{f.findingNo}</strong>
                                </td>
                                <td>
                                  <span className="mono" style={{ fontWeight: 700 }}>{f.clauseCode}</span>
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>{f.clauseName}</span>
                                </td>
                                <td>
                                  <span className={`badge ${f.category === 'Major NC' ? 'badge-danger' : f.category === 'Minor NC' ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: '0.65rem' }}>
                                    {f.category}
                                  </span>
                                </td>
                                <td style={{ maxWidth: '280px', fontSize: '0.78rem' }}>{f.description}</td>
                                <td className="mono" style={{ fontSize: '0.75rem', color: '#f59e0b' }}>{f.dueDate}</td>
                                <td>
                                  <span className={`badge ${f.status === 'NC Close' ? 'badge-success' : f.status === 'Eviden Submitted' ? 'badge-warning' : 'badge-danger-pulse'}`} style={{ fontSize: '0.65rem' }}>
                                    {f.status}
                                  </span>
                                </td>
                                <td style={{ fontSize: '0.75rem' }}>{f.assignedTo}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ----------------------------------------------------------------- */}
                {/* TAB 5: KESIMPULAN & PENGESAHAN (DIBEDAKAN DOC vs SMC)             */}
                {/* ----------------------------------------------------------------- */}
                {activeTab === 'signoff' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>
                        {standard === 'DOC'
                          ? 'Kesimpulan & Pengesahan Sesi Audit DOC (Document of Compliance)'
                          : `Kesimpulan & Pengesahan Sesi Audit SMC Kapal (${currentSelectedVessel?.name})`}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Evaluasi akhir kepatuhan ISM Code dan pengesahan para pihak
                      </span>
                    </div>

                    {/* Compliance Result Scorecard */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div className="glass-card" style={{ padding: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Indeks Kepatuhan {standard}:</span>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: checklistStats.score >= 80 ? '#10b981' : '#f59e0b', marginTop: '0.25rem' }}>
                          {checklistStats.score}%
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {checklistStats.complied} dari {checklistStats.total} item dinyatakan patuh
                        </p>
                      </div>

                      <div className="glass-card" style={{ padding: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Temuan Major NC:</span>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: checklistStats.majorNC > 0 ? '#ef4444' : '#10b981', marginTop: '0.25rem' }}>
                          {checklistStats.majorNC}
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {checklistStats.majorNC > 0 ? 'Perlu tindakan mitigasi darurat!' : 'Nol Major Non-Conformity'}
                        </p>
                      </div>

                      <div className="glass-card" style={{ padding: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Temuan Minor NC:</span>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.25rem' }}>
                          {checklistStats.minorNC}
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          Wajib diselesaikan sebelum target due date
                        </p>
                      </div>

                      <div className="glass-card" style={{ padding: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Observasi (Saran Mutu):</span>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#60a5fa', marginTop: '0.25rem' }}>
                          {checklistStats.obs}
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          Rekomendasi peningkatan efisiensi
                        </p>
                      </div>
                    </div>

                    {/* Conclusion Textarea */}
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                        Kesimpulan & Rekomendasi Lead Auditor ({standard}) *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={auditConclusion}
                        onChange={(e) => setAuditConclusion(e.target.value)}
                        placeholder="Tuliskan kesimpulan akhir evaluasi sistem manajemen keselamatan..."
                        className="input-control"
                        style={{ resize: 'vertical' }}
                      />
                    </div>

                    {/* Signatures Box */}
                    <div style={{ padding: '1.25rem', borderRadius: '10px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '1rem' }}>
                        Pengesahan Para Pihak (Lead Auditor & Perwakilan Auditee)
                      </span>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        {/* Auditor Signature */}
                        <div style={{ padding: '1rem', border: '1px dashed var(--border-subtle)', borderRadius: '8px', textAlign: 'center', background: 'var(--bg-input)' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', display: 'block' }}>
                            Lead Auditor ({auditType === 'Internal' ? 'Internal DPA/QHSE Baharimas' : (typeof externalOrganization === 'string' ? externalOrganization : externalOrganization?.name || 'Lembaga Ditunjuk')}):
                          </span>
                          <div style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0' }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.9rem', color: '#0284c7' }}>
                              [ TANDATANGAN RESMI AUDITOR ]
                            </span>
                          </div>
                          <input
                            type="text"
                            value={leadAuditorSign}
                            onChange={(e) => setLeadAuditorSign(e.target.value)}
                            className="input-control"
                            style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.8rem' }}
                          />
                          <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                            Tanggal Pengesahan: {auditDate}
                          </span>
                        </div>

                        {/* Auditee Signature */}
                        <div style={{ padding: '1rem', border: '1px dashed var(--border-subtle)', borderRadius: '8px', textAlign: 'center', background: 'var(--bg-input)' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', display: 'block' }}>
                            {standard === 'DOC' ? 'Perwakilan Manajemen Darat:' : `Perwakilan Auditee (${currentSelectedVessel?.name}):`}
                          </span>
                          <div style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0' }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.9rem', color: '#10b981' }}>
                              [ TANDATANGAN RESMI AUDITEE ]
                            </span>
                          </div>
                          <input
                            type="text"
                            value={auditeeSign}
                            onChange={(e) => setAuditeeSign(e.target.value)}
                            className="input-control"
                            style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.8rem' }}
                          />
                          <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                            {standard === 'DOC' ? 'Direktur Operasional / DPA PT. PBK' : `Nakhoda / KKM ${currentSelectedVessel?.name || 'Kapal'}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* MODAL FOOTER FIXED ACTIONS */}
              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.5rem', background: 'var(--bg-surface-elevated)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                    Standar: {standard} ({auditType})
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {checklistStats.complied}/{checklistStats.total} Patuh ({checklistStats.score}%)
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                  {isEdit && (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="btn btn-secondary btn-sm"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        color: '#ef4444',
                        borderColor: 'rgba(239, 68, 68, 0.4)',
                        fontWeight: 700
                      }}
                      title="Hapus Sesi Audit Ini Beserta Temuannya"
                    >
                      <Trash2 size={14} />
                      <span>Hapus Sesi</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowPrintReport(true)}
                    className="btn btn-secondary btn-sm"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontWeight: 700,
                      color: '#0284c7'
                    }}
                    title="Pratinjau & Cetak Laporan Lengkap Sesi Audit Sesuai Standar ISM Code (A4 Print / PDF)"
                  >
                    <Printer size={15} color="#0284c7" />
                    <span>🖨️ Cetak Laporan Audit Resmi</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-secondary btn-sm"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
                  >
                    <Save size={15} />
                    <span>{isEdit ? 'Simpan Seluruh Perubahan Sesi' : `Simpan & Terbitkan Sesi Audit ${standard}`}</span>
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Official Audit Report Print Modal */}
      {showPrintReport && (
        <AuditReportModal
          session={{
            id: session?.id || 'aud-preview',
            auditNo: auditNo || `AUD-${auditType === 'Internal' ? 'INT' : 'EXT'}-${standard}-2026/PREVIEW`,
            reportId: reportId || `0859-PK/ISM-${standard}/2026`,
            auditType,
            externalOrganization: auditType === 'External'
              ? (typeof externalOrganization === 'string' ? externalOrganization : externalOrganization?.name || 'Biro Klasifikasi Indonesia (BKI)')
              : 'PT. Pelayaran Baharimas Kalimantan (Internal DPA / QHSE)',
            standard,
            targetType,
            targetName: targetType === 'Vessel' ? (currentSelectedVessel?.name || 'Kapal Armada PBK') : 'Kantor Pusat PT. Pelayaran Baharimas Kalimantan (Pontianak)',
            vesselId: targetType === 'Vessel' ? vesselId : null,
            leadAuditor,
            auditTeam: Array.isArray(auditTeam) ? auditTeam : (typeof auditTeam === 'string' ? auditTeam.split(',').map(s => s.trim()).filter(Boolean) : ['Tim Auditor']),
            auditee,
            auditLocation,
            auditDate,
            targetCloseDate,
            scope,
            status,
            checklist,
            totalItemsChecked: checklist.length,
            itemsComplied: checklistStats.complied,
            findingsSummary: {
              majorNC: checklistStats.majorNC,
              minorNC: checklistStats.minorNC,
              observation: checklistStats.obs,
              totalOpen: checklistStats.majorNC + checklistStats.minorNC + checklistStats.obs,
              totalClosed: 0
            },
            auditConclusion,
            leadAuditorSign,
            auditeeSign
          }}
          liveChecklist={checklist}
          initialMode="checklist"
          onClose={() => setShowPrintReport(false)}
        />
      )}

      {/* Modal Preview Bukti Audit */}
      {previewEvidence && (
        <div
          className="modal-overlay"
          style={{ zIndex: 12000, background: 'rgba(0,0,0,0.75)' }}
          onClick={() => setPreviewEvidence(null)}
        >
          <div
            className="modal-dialog"
            style={{ maxWidth: '720px', width: '90%', background: 'var(--bg-surface)', borderRadius: '12px', overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={18} color="#0284c7" />
                <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Pratinjau Bukti Audit: {previewEvidence.fileName}</h4>
              </div>
              <button
                type="button"
                onClick={() => setPreviewEvidence(null)}
                className="btn btn-secondary btn-sm"
              >
                <X size={15} />
              </button>
            </div>
            <div style={{ padding: '1.25rem', textAlign: 'center', background: 'var(--bg-input)' }}>
              {previewEvidence.fileUrl?.startsWith('data:image') || previewEvidence.fileName?.endsWith('.svg') || previewEvidence.fileName?.endsWith('.png') || previewEvidence.fileName?.endsWith('.jpg') ? (
                <img
                  src={previewEvidence.fileUrl}
                  alt="Bukti Audit"
                  style={{ maxWidth: '100%', maxHeight: '480px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
                />
              ) : (
                <div style={{ padding: '2rem', background: 'var(--bg-surface)', borderRadius: '8px' }}>
                  <FileText size={48} color="#0284c7" style={{ margin: '0 auto 1rem' }} />
                  <p style={{ fontWeight: 700 }}>{previewEvidence.fileName}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ukuran Berkas: {previewEvidence.fileSize}</p>
                  <a
                    href={previewEvidence.fileUrl}
                    download={previewEvidence.fileName}
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
                onClick={() => setPreviewEvidence(null)}
                className="btn btn-secondary btn-sm"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
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
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
              overflow: 'hidden',
              opacity: 1
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
                flexShrink: 0
              }}>
                <Trash2 size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Hapus Sesi Audit Ini?</h3>
                <p style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700, margin: '0.15rem 0 0 0' }}>Tindakan ini tidak dapat dibatalkan</p>
              </div>
              <button type="button" onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.5rem' }}>
                <X size={15} />
              </button>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Nomor Sesi:</div>
                <div className="mono" style={{ fontSize: '1rem', fontWeight: 800, color: '#ef4444' }}>
                  {session?.auditNo}
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Seluruh data evaluasi checklist dan temuan yang tertaut pada sesi ini akan dihapus permanen dari sistem.
              </p>
            </div>
            <div style={{ padding: '0.85rem 1.5rem', background: 'var(--bg-surface-elevated)', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary btn-sm" style={{ padding: '0.45rem 1rem' }}>
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteAuditSession(session?.id || session?.auditNo);
                  setShowDeleteConfirm(false);
                  onClose();
                }}
                className="btn btn-sm"
                style={{ background: '#ef4444', color: '#fff', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 1.1rem' }}
              >
                <Trash2 size={13} />
                <span>Ya, Hapus Sesi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
