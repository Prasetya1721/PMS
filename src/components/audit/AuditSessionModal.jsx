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
  Edit2,
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
  RotateCcw,
  Calendar,
  MapPin,
  Users
} from 'lucide-react';

import {
  BKI_AUDIT_MASTER,
  BKI_SMC_CHECKLIST_TEMPLATE,
  BKI_DOC_CHECKLIST_TEMPLATE,
  NON_BKI_AUDIT_ORGANIZATIONS,
  EXTERNAL_AUDIT_ORGANIZATIONS,
  isBKIOrganization,
  getChecklistConfigForSession,
  normalizeChecklistItem
} from '../../data/auditMasterData';

/**
 * Bangun baris checklist interaktif dari registry checklist lembaga audit.
 *
 * HANYA BKI yang memiliki template resmi.
 * Lembaga lain mengembalikan array KOSONG — auditor menyusun butir manual.
 * Default: result = '', notes = '' (kosong untuk diisi auditor).
 *
 * @param {string|object} organization - lembaga audit eksternal pada sesi
 * @param {string} [standard='SMC'] - 'DOC' untuk audit kantor, 'SMC' untuk audit kapal
 * @returns {Array} baris checklist siap pakai (kosong jika bukan BKI)
 */
const buildChecklistFromOrganization = (organization, standard = 'SMC', auditType = null) => {
  const isBki = isBKIOrganization(organization);
  const isInternal = auditType === 'Internal' ||
    organization === 'internal' ||
    !organization ||
    String(organization).toLowerCase().includes('internal') ||
    String(organization).toLowerCase().includes('baharimas');

  // Guard: jika bukan BKI dan bukan Audit Internal, kembalikan array kosong (untuk KSOP / Hubla / RO eksternal lainnya)
  if (!isBki && !isInternal) return [];

  const targetOrg = isInternal ? 'internal' : organization;
  const { items } = getChecklistConfigForSession(targetOrg, standard);

  if (!items || items.length === 0) return [];

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

export const AuditSessionModal = ({ session, onClose, defaultVesselId, defaultStandard, onSaved }) => {
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

  // Screen State: Step 0 (Pre-Selection / Setup) vs Step 1 (Formulir Sesi & Tim)
  // New sessions start at Setup Step (Step 0) only if target is not preselected.
  const [isSetupStep, setIsSetupStep] = useState(!isEdit && !defaultVesselId);

  // Fullscreen toggle state (defaults to true for rich workstation comfort)
  const [isFullscreen, setIsFullscreen] = useState(true);

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

  // Tab 1 Sub-Sections (Separated Form View & Step Navigation)
  const [formViewMode, setFormViewMode] = useState('sections'); // 'sections' (Semua Kartu Terpisah) | 'wizard' (Mode Bertahap 1-per-1)
  const [activeFormStep, setActiveFormStep] = useState(1); // 1, 2, 3, 4

  // Kelengkapan masing-masing bagian form
  const section1Complete = Boolean(
    standard === 'DOC'
      ? (docDepartment && docCertificateNo)
      : (vesselId && smcCertificateNo)
  );
  const section2Complete = Boolean(auditNo && reportId);
  const section3Complete = Boolean(leadAuditor && auditee && auditLocation);
  const section4Complete = Boolean(auditDate && targetCloseDate && scope);

  const applyScopePreset = (type) => {
    if (standard === 'DOC') {
      if (type === 'annual') {
        setScope('Audit Kepatuhan Tahunan Sistem Manajemen Keselamatan Darat (DOC) PT. Pelayaran Baharimas Kalimantan mencakup 13 Seksi BKI DOC Rev 06 / ISM Code 2025.');
      } else {
        setScope('Audit Kepatuhan Sistem Manajemen Keselamatan (DOC Darat) mencakup struktur DPA, QHSE, Crewing, Keandalan Operasional, dan Tanggap Darurat Darat.');
      }
    } else {
      if (type === 'full') {
        setScope('Audit Kelaikan Sistem Manajemen Keselamatan (SMC) Kapal Onboard sesuai IMO Res. A.741(18) / ISM Code klausul 1 s.d. 12 dan BKI SMS Shipboard Checklist Rev 05 (74 Klausul Pemeriksaan).');
      } else if (type === 'annual') {
        setScope('Audit Periodik Tahunan (Annual SMC Audit) Kelaikan Navigasi, Kamar Mesin, Pemeliharaan PMS, Pengujian Keselamatan LSA/FFA, dan Kesiapsiagaan Drills Darurat Onboard.');
      } else if (type === 'interim') {
        setScope('Audit Interim Kelaikan Keselamatan Kapal Laut dan Verifikasi Serah Terima Tanggung Jawab Operasional Nakhoda & KKM Baru.');
      }
    }
    showToast('✓ Template ruang lingkup berhasil diterapkan!', 'info');
  };

  // Tab 2: Linked Certificates & Requisitions
  const [selectedCertificateIds, setSelectedCertificateIds] = useState(session?.selectedCertificateIds || []);
  const [selectedRequisitionIds, setSelectedRequisitionIds] = useState(session?.selectedRequisitionIds || []);

  // Sync current vessel object
  const currentSelectedVessel = useMemo(() => {
    return vessels.find(v => v.id === vesselId) || vessels[0];
  }, [vessels, vesselId]);

  // Tab 3: Interactive Checklist (bersumber dari registry checklist per lembaga & audit internal)
  // BKI dan Audit Internal PBK menggunakan standar resmi BKI (DOC Rev 06 & SMC Rev 05)
  const [checklist, setChecklist] = useState(() => {
    const effectiveStandard = initialStandard || 'SMC';
    const isInternalSession = session?.auditType === 'Internal' || auditType === 'Internal' ||
      String(initialOrgStr).toLowerCase().includes('internal') ||
      String(initialOrgStr).toLowerCase().includes('baharimas');
    const isBkiSession = isBKIOrganization(initialOrgStr);
    const usesStandardTemplate = isInternalSession || isBkiSession;

    if (session?.checklist && session.checklist.length > 0) {
      if (!usesStandardTemplate) {
        // Hanya pertahankan butir manual jika ada, template BKI dibuang untuk eksternal non-BKI
        return session.checklist.filter(item => item.isManual);
      }
      // Pilih template referensi yang sesuai (DOC Rev 06 atau SMC Rev 05)
      const refTemplate = effectiveStandard === 'DOC' ? BKI_DOC_CHECKLIST_TEMPLATE : BKI_SMC_CHECKLIST_TEMPLATE;
      // Sinkronkan klausul dengan template resmi Bahasa Indonesia terbaru
      return session.checklist.map(item => {
        const tpl = refTemplate.find(t =>
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

    // Muat template standar BKI untuk sesi BKI dan seluruh Sesi Internal (DOC & SMC)
    if (usesStandardTemplate) {
      return buildChecklistFromOrganization(
        isInternalSession ? 'internal' : initialOrgStr,
        effectiveStandard,
        isInternalSession ? 'Internal' : 'External'
      );
    }

    // Eksternal non-BKI: mulai dengan daftar kosong (input manual)
    return [];
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

  // Edit & Delete Checklist Item state
  const [editingChecklistItem, setEditingChecklistItem] = useState(null);
  const [editFormCode, setEditFormCode] = useState('');
  const [editFormName, setEditFormName] = useState('');
  const [editFormCheckPoint, setEditFormCheckPoint] = useState('');
  const [editFormIsmCode, setEditFormIsmCode] = useState('');
  const [editFormResult, setEditFormResult] = useState('');
  const [editFormNotes, setEditFormNotes] = useState('');
  const [deleteChecklistItemTarget, setDeleteChecklistItemTarget] = useState(null);

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

      // Load DOC checklist: BKI atau Internal PBK → template resmi BKI DOC Rev 06; eksternal non-BKI → kosong
      const currentOrg = forcedAuditType === 'Internal'
        ? 'PT. Pelayaran Baharimas Kalimantan (Internal DPA / QHSE)'
        : externalOrganization;
      if (forcedAuditType === 'Internal' || isBKIOrganization(currentOrg)) {
        setChecklist(buildChecklistFromOrganization(currentOrg, 'DOC', forcedAuditType));
      } else {
        setChecklist([]);
      }
    } else {
      // SMC Standard
      setTargetType('Vessel');
      setNewFindingClause('1.1');

      // Load SMC checklist: BKI atau Internal PBK → template resmi BKI SMC Rev 05; eksternal non-BKI → kosong
      const currentOrg = forcedAuditType === 'Internal'
        ? 'PT. Pelayaran Baharimas Kalimantan (Internal DPA / QHSE)'
        : externalOrganization;
      if (forcedAuditType === 'Internal' || isBKIOrganization(currentOrg)) {
        setChecklist(buildChecklistFromOrganization(currentOrg, 'SMC', forcedAuditType));
      } else {
        setChecklist([]);
      }
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
      const intOrg = 'PT. Pelayaran Baharimas Kalimantan (Internal DPA / QHSE)';
      setExternalOrganization(intOrg);
      // Audit internal mengadopsi checklist standar resmi BKI (DOC Rev 06 / SMC Rev 05)
      setChecklist(buildChecklistFromOrganization(intOrg, standard, 'Internal'));
      showToast(
        standard === 'DOC'
          ? '✓ Checklist Audit Internal DOC diselaraskan dengan standar BKI (Rev 06 - 13 Seksi).'
          : '✓ Checklist Audit Internal SMC diselaraskan dengan standar BKI (Rev 05 - 74 Klausul).',
        'info'
      );
    } else {
      // External: Set default ke BKI dan muat template BKI
      const defaultExtOrg = externalOrganization && externalOrganization !== 'PT. Pelayaran Baharimas Kalimantan (Internal DPA / QHSE)'
        ? externalOrganization
        : 'Biro Klasifikasi Indonesia (BKI)';
      setExternalOrganization(defaultExtOrg);
      // Muat template jika lembaga adalah BKI
      if (isBKIOrganization(defaultExtOrg)) {
        setChecklist(buildChecklistFromOrganization(defaultExtOrg, standard, 'External'));
      } else {
        setChecklist(prev => prev.filter(item => item.isManual));
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
  // - Jika BKI: muat otomatis template resmi Rev 05 (74 klausul SMC) atau Rev 06 (DOC)
  // - Jika selain BKI (KSOP, Hubla, LR, BV, dll): KOSONGKAN daftar checklist (hanya pertahankan butir manual jika ada)
  const handleExternalOrgChange = (newOrg) => {
    setExternalOrganization(newOrg);

    if (isBKIOrganization(newOrg)) {
      setChecklist(buildChecklistFromOrganization(newOrg, standard));
      const templateLabel = standard === 'DOC'
        ? '✓ Template resmi BKI DOC (F23.14.05-2025 Rev 06) dimuat otomatis.'
        : '✓ Template resmi BKI (F23.14.06-2024 Rev 05) dimuat otomatis.';
      showToast(templateLabel, 'info');
    } else {
      // Kosongkan template BKI untuk lembaga selain BKI (KSOP, Hubla, LR, BV, dll.)
      // Pertahankan hanya butir pemeriksaan manual jika auditor sudah menambahkan item manual
      setChecklist(prev => prev.filter(item => item.isManual));
      const orgInfo = getChecklistConfigForSession(newOrg, standard);
      showToast(
        `ℹ️ Lembaga "${orgInfo.organizationName}" dipilih. Checklist BKI dikosongkan (format audit disesuaikan lembaga).`,
        'info'
      );
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

  // Reload checklist sesuai standar BKI untuk BKI & Internal PBK, atau format lembaga
  const handleLoadSMSChecklistTemplate = () => {
    const isInternal = auditType === 'Internal';
    const isBki = isBKIOrganization(externalOrganization);
    if (!isInternal && !isBki) {
      const config = getChecklistConfigForSession(externalOrganization, standard);
      showToast(
        `⚠️ Lembaga "${config.organizationName}" belum memiliki template checklist resmi. Silakan susun butir secara manual.`,
        'warning'
      );
      return;
    }
    const loaded = buildChecklistFromOrganization(isInternal ? 'internal' : externalOrganization, standard, auditType);
    if (loaded.length === 0) {
      showToast('Gagal memuat template checklist.', 'warning');
      return;
    }
    setChecklist(loaded);
    const struckCount = loaded.filter(i => i.isStrikethrough).length;
    const stdLabel = standard === 'DOC' ? 'BKI DOC Rev 06 (13 Seksi)' : 'BKI SMC Rev 05 (74 Klausul)';
    showToast(
      `✓ Berhasil memuat ${loaded.length} butir checklist standar ${stdLabel}${isInternal ? ' (Audit Internal PBK)' : ''}${struckCount > 0 ? ` (${struckCount} butir coret)` : ''}!`,
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

  const handleOpenEditChecklistItem = (item) => {
    setEditingChecklistItem(item);
    setEditFormCode(item.code || '');
    setEditFormName(item.name || '');
    setEditFormCheckPoint(item.checkPoint || '');
    setEditFormIsmCode(item.ismCode || '');
    setEditFormResult(item.result || '');
    setEditFormNotes(item.notes || '');
  };

  const handleSaveEditChecklistItem = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!editFormCode.trim() || !editFormName.trim()) {
      showToast('No./Kode klausul dan Uraian Items to be checked wajib diisi!', 'warning');
      return;
    }

    setChecklist(prev => prev.map(item => {
      if (item.id === editingChecklistItem.id) {
        return {
          ...item,
          code: editFormCode.trim(),
          name: editFormName.trim(),
          checkPoint: editFormCheckPoint.trim(),
          ismCode: editFormIsmCode.trim(),
          result: editFormResult,
          notes: editFormNotes.trim()
        };
      }
      return item;
    }));

    showToast(`✓ Butir pemeriksaan "${editFormCode.trim()}" berhasil diperbarui!`, 'success');
    setEditingChecklistItem(null);
  };

  const confirmDeleteChecklistItem = () => {
    if (!deleteChecklistItemTarget) return;
    const targetCode = deleteChecklistItemTarget.code;
    setChecklist(prev => prev.filter(item => item.id !== deleteChecklistItemTarget.id));
    setDeleteChecklistItemTarget(null);
    showToast(`✓ Butir checklist "${targetCode}" berhasil dihapus!`, 'info');
  };

  const handleDeleteChecklistItem = (id) => {
    const target = checklist.find(item => item.id === id);
    if (target) {
      setDeleteChecklistItemTarget(target);
    } else {
      setChecklist(prev => prev.filter(item => item.id !== id));
      showToast('Item checklist berhasil dihapus!', 'info');
    }
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
    const answered = checklist.filter(c => (c.result && c.result !== '') || c.isStrikethrough).length;
    const yes = checklist.filter(c => !c.isStrikethrough && (c.result === 'Complied' || c.result === 'Yes')).length;
    const no = checklist.filter(c => !c.isStrikethrough && ['No', 'Major NC', 'Minor NC', 'Observation'].includes(c.result)).length;
    const obs = checklist.filter(c => !c.isStrikethrough && c.result === 'Observation').length;
    const minorNC = checklist.filter(c => !c.isStrikethrough && (c.result === 'Minor NC' || c.result === 'No')).length;
    const majorNC = checklist.filter(c => !c.isStrikethrough && c.result === 'Major NC').length;
    const na = checklist.filter(c => c.result === 'N/A' || c.isStrikethrough).length;
    const unanswered = Math.max(0, total - answered);
    const evidenceCount = checklist.filter(c => Boolean(c.evidence)).length;
    const effectiveTotal = total - na > 0 ? total - na : total;
    const score = effectiveTotal > 0 && answered > 0 ? Math.round((yes / effectiveTotal) * 100) : 0;
    return {
      total,
      answered,
      unanswered,
      yes,
      complied: yes,
      no,
      obs,
      minorNC,
      majorNC,
      na,
      evidenceCount,
      score
    };
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

    let savedSession = null;
    if (isEdit) {
      updateAuditSession(session.id, payload);
      savedSession = { ...session, ...payload };
      showToast('✓ Sesi audit berhasil diperbarui!', 'success');
    } else {
      const created = addAuditSession(payload);
      savedSession = created || { id: `aud-${Date.now()}`, ...payload };
      if (findingsList.length > 0) {
        findingsList.forEach(f => {
          addAuditFinding({ ...f, auditId: savedSession.id, auditNo: savedSession.auditNo });
        });
      }
      showToast(`✓ Sesi audit ${payload.auditNo} resmi dibuat! Alur dialihkan ke Tahap 2: Checklist Klausul.`, 'success');
    }

    if (onSaved) {
      onSaved(savedSession);
    } else {
      onClose();
    }
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
                    ? `Formulir Sesi & Tim Audit DOC (Tahap 1) — Kantor Pusat PT. PBK`
                    : `Formulir Sesi & Tim Audit SMC (Tahap 1) — ${currentSelectedVessel?.name || 'Kapal Armada'}`}
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
                  ? 'Tahap 1: Inisiasi Sesi, Tim Auditor, Auditee & Ruang Lingkup DOC Darat • Pemeriksaan Checklist di Dashboard'
                  : `Tahap 1: Inisiasi Sesi, Tim Auditor, Auditee Onboard & Ruang Lingkup SMC • ${currentSelectedVessel?.name} • Pemeriksaan Checklist di Dashboard`}
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
                      🏢 Target: <strong>Kantor Pusat PT. PBK Pontianak</strong> • Standar BKI DOC Rev 06 (13 Seksi)
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
                      Audit kepatuhan onboard nakhoda & awak kapal menggunakan <strong>SMS Shipboard Checklist Standar BKI (Rev 05)</strong>: kelaikan navigasi, mesin, PMS, LSA/FFA, drill darurat, serta klausul coret A-E.
                    </p>
                    <div style={{ marginTop: '0.85rem', padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'var(--bg-surface-elevated)', fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                      🚢 Target: <strong>{vessels.length} Kapal Armada Baharimas</strong> • Standar BKI SMC Rev 05 (74 Klausul)
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
                      Audit Internal PT. Pelayaran Baharimas Kalimantan (Standar Resmi BKI {standard})
                    </h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                      Audit dilaksanakan secara mandiri oleh Tim Internal DPA & QHSE Department PT. Pelayaran Baharimas Kalimantan dengan mengadopsi <strong>Standar Resmi BKI {standard === 'DOC' ? 'DOC Rev 06 (F23.14.05-2025)' : 'SMC Rev 05 (F23.14.06-2024)'}</strong>.
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
                          Pilih Kapal Armada Baharimas ({vessels.length} Unit Kapal) *
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
          /* VIEW 2: FORMULIR SESI & TIM AUDIT (TAHAP 1 LIFECYCLE AUDIT ISM)          */
          /* ======================================================================= */
          <>
            {/* TAHAP 1 TOOLBAR & METADATA */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.65rem',
              padding: '0.65rem 1.5rem',
              background: 'var(--bg-surface-elevated)',
              borderBottom: '1px solid var(--border-subtle)',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <span className="badge badge-info" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', fontWeight: 800 }}>
                  Tahap 1: Setup Sesi & Tim
                </span>
                <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                  Target: <strong>{targetType === 'Vessel' ? (currentSelectedVessel?.name || 'Kapal Armada') : 'Kantor Pusat PT. PBK'}</strong>
                </span>
                <span className={`badge ${standard === 'DOC' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.72rem' }}>
                  Standar {standard} • {auditType}
                </span>
              </div>

              {/* Quick Summary Pill & Re-setup button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleLoadSampleDemo}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#0284c7' }}
                  title="Muat contoh isian data simulasi jika diperlukan"
                >
                  <Sparkles size={12} />
                  <span>Isi Contoh</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSetupStep(true)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  title="Ganti Pilihan Audit Internal/Eksternal atau DOC/SMC"
                >
                  <RefreshCw size={12} />
                  <span>Ganti Mode Sesi</span>
                </button>
              </div>
            </div>

            {/* FORM BODY CONTAINER */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <div className="modal-body" style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Header Tab 1 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                          {standard === 'DOC' ? <Building2 size={20} color="#10b981" /> : <Ship size={20} color="#0284c7" />}
                          <span>
                            {standard === 'DOC'
                              ? 'Identitas & Legalitas Sesi Audit DOC (Kantor Pusat PT. PBK)'
                              : `Identitas & Legalitas Sesi Audit SMC Onboard (${currentSelectedVessel?.name})`}
                          </span>
                        </h4>
                        <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                          Formulir telah dikelompokkan ke dalam 4 bagian terpisah agar pengisian tertib, terarah, dan mudah dikelola.
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className={`badge ${auditType === 'Internal' ? 'badge-info' : 'badge-neutral'}`} style={{ fontSize: '0.7rem' }}>
                          {auditType === 'Internal' ? '🏢 Internal (Mandiri DPA)' : `🏛️ ${externalOrganization}`}
                        </span>
                        <span className={`badge ${standard === 'DOC' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>
                          {standard === 'DOC' ? 'Standar DOC Darat' : 'Standar SMC Kapal'}
                        </span>
                      </div>
                    </div>

                    {/* Bilah Navigasi Sub-Bagian & Pemilih Tampilan Form (Cards vs Wizard) */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.65rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      {/* Step Sub-Pills */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-subtle)', marginRight: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Bagian Form:
                        </span>
                        {[
                          { step: 1, label: standard === 'DOC' ? '1. Entitas Darat' : '1. Kapal & Sertifikat', icon: standard === 'DOC' ? Building2 : Ship, isDone: section1Complete },
                          { step: 2, label: '2. Legalitas & Nomor', icon: ShieldCheck, isDone: section2Complete },
                          { step: 3, label: '3. Tim & Auditee', icon: UserCheck, isDone: section3Complete },
                          { step: 4, label: '4. Jadwal & Lingkup', icon: FileText, isDone: section4Complete }
                        ].map(s => {
                          const Icon = s.icon;
                          const isActive = activeFormStep === s.step;
                          return (
                            <button
                              key={s.step}
                              type="button"
                              onClick={() => {
                                setActiveFormStep(s.step);
                                if (formViewMode === 'sections') {
                                  const el = document.getElementById(`form-section-${s.step}`);
                                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                                }
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.35rem 0.65rem',
                                borderRadius: '6px',
                                fontSize: '0.74rem',
                                fontWeight: isActive ? 800 : 600,
                                cursor: 'pointer',
                                border: isActive ? '1px solid #0284c7' : '1px solid var(--border-subtle)',
                                background: isActive ? '#0284c7' : 'var(--bg-surface)',
                                color: isActive ? '#ffffff' : 'var(--text-main)',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <Icon size={12} />
                              <span>{s.label}</span>
                              {s.isDone ? (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '13px',
                                  height: '13px',
                                  borderRadius: '50%',
                                  background: isActive ? '#ffffff' : '#10b981',
                                  color: isActive ? '#0284c7' : '#ffffff',
                                  fontSize: '8px',
                                  fontWeight: 900
                                }}>
                                  ✓
                                </span>
                              ) : (
                                <span style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  background: '#f59e0b',
                                  display: 'inline-block'
                                }} />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Mode Tampilan Switcher */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          type="button"
                          onClick={() => setFormViewMode('sections')}
                          className={`btn btn-sm ${formViewMode === 'sections' ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ fontSize: '0.7rem', padding: '0.25rem 0.55rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                          title="Tampilkan seluruh bagian dalam bentuk kartu terpisah bertingkat"
                        >
                          <Layers size={12} />
                          <span>Mode Kartu Terpisah</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormViewMode('wizard')}
                          className={`btn btn-sm ${formViewMode === 'wizard' ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ fontSize: '0.7rem', padding: '0.25rem 0.55rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                          title="Fokus mengisi 1 bagian per langkah (Step-by-Step)"
                        >
                          <ArrowRight size={12} />
                          <span>Mode Bertahap (Step)</span>
                        </button>
                      </div>
                    </div>

                    {/* ============================================================= */}
                    {/* BAGIAN 1: SASARAN KAPAL & SERTIFIKAT                          */}
                    {/* ============================================================= */}
                    {(formViewMode === 'sections' || activeFormStep === 1) && (
                      <div
                        id="form-section-1"
                        className="glass-card"
                        style={{
                          padding: '1.25rem',
                          borderRadius: '12px',
                          border: activeFormStep === 1 ? '1.5px solid #0284c7' : '1px solid var(--border-subtle)',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1rem'
                        }}
                      >
                        {/* Header Bagian 1 */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: 'rgba(2, 132, 199, 0.15)',
                              color: '#0284c7',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              {standard === 'DOC' ? <Building2 size={18} /> : <Ship size={18} />}
                            </div>
                            <div>
                              <h5 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                                Bagian 1: {standard === 'DOC' ? 'Entitas Darat & Izin DOC' : 'Sasaran Kapal & Sertifikat SMC'}
                              </h5>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                {standard === 'DOC'
                                  ? 'Identifikasi kantor pusat PT. Pelayaran Baharimas Kalimantan dan nomor sertifikat DOC'
                                  : 'Pilih kapal armada Baharimas yang diaudit dan nomor sertifikat keselamatan statutori'}
                              </span>
                            </div>
                          </div>
                          <div>
                            {section1Complete ? (
                              <span className="badge badge-success" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Check size={11} /> Lengkap
                              </span>
                            ) : (
                              <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                                Wajib Diisi
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Fields Bagian 1 */}
                        {standard === 'DOC' ? (
                          /* FORM DOC */
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                            <div>
                              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
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
                          /* FORM SMC */
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                              <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                                  Target Kapal Armada ({vessels.length} Unit) *
                                </label>
                                <select
                                  value={vesselId}
                                  onChange={(e) => setVesselId(e.target.value)}
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
                              <div style={{
                                padding: '0.85rem 1.15rem',
                                borderRadius: '10px',
                                background: 'var(--bg-surface-elevated)',
                                border: '1px solid var(--border-subtle)',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                gap: '0.75rem',
                                fontSize: '0.75rem'
                              }}>
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

                        {/* Navigasi Wizard Bagian 1 */}
                        {formViewMode === 'wizard' && (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                            <button
                              type="button"
                              onClick={() => setActiveFormStep(2)}
                              className="btn btn-primary btn-sm"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                            >
                              <span>Lanjut: Bagian 2 (Legalitas & Nomor)</span>
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ============================================================= */}
                    {/* BAGIAN 2: LEGALITAS SESI & PENOMORAN AUDIT                    */}
                    {/* ============================================================= */}
                    {(formViewMode === 'sections' || activeFormStep === 2) && (
                      <div
                        id="form-section-2"
                        className="glass-card"
                        style={{
                          padding: '1.25rem',
                          borderRadius: '12px',
                          border: activeFormStep === 2 ? '1.5px solid #8b5cf6' : '1px solid var(--border-subtle)',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1rem'
                        }}
                      >
                        {/* Header Bagian 2 */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: 'rgba(139, 92, 246, 0.15)',
                              color: '#8b5cf6',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <ShieldCheck size={18} />
                            </div>
                            <div>
                              <h5 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                                Bagian 2: Legalitas Sesi & Penomoran Resmi
                              </h5>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                Lembaga pelaksana, kode registrasi audit, nomor laporan BKI, dan status sesi
                              </span>
                            </div>
                          </div>
                          <div>
                            {section2Complete ? (
                              <span className="badge badge-success" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Check size={11} /> Lengkap
                              </span>
                            ) : (
                              <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                                Wajib Diisi
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Lembaga Eksternal: HANYA MUNCUL JIKA EKSTERNAL */}
                        {auditType === 'External' && (
                          <div style={{ padding: '0.95rem', border: '1px solid rgba(168, 85, 247, 0.4)', background: 'rgba(168, 85, 247, 0.05)', borderRadius: '10px' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#a855f7', display: 'block', marginBottom: '0.4rem' }}>
                              🏛️ Lembaga / Recognized Organization (RO) yang Ditunjuk *
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
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

                              {(externalOrganization === 'Lembaga Audit Eksternal Lainnya (Input Manual)' ||
                                externalOrganization === 'Lainnya / Lembaga Lain' ||
                                (typeof externalOrganization === 'string' && externalOrganization.includes('Lainnya'))) && (
                                <input
                                  type="text"
                                  required
                                  value={customExternalOrg}
                                  onChange={(e) => setCustomExternalOrg(e.target.value)}
                                  placeholder="cth: Lloyd's Register (LR) / Bureau Veritas (BV) / ClassNK / RINA..."
                                  className="input-control"
                                />
                              )}
                            </div>
                          </div>
                        )}

                        {/* Fields Nomor Sesi, Nomor Laporan & Status */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
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
                              style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0284c7' }}
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
                              style={{ fontWeight: 800, fontSize: '0.88rem', color: '#10b981' }}
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
                              style={{ fontWeight: 700 }}
                            >
                              <option value="Scheduled">Terjadwal (Scheduled)</option>
                              <option value="In Progress">Sedang Berlangsung (In Progress)</option>
                              <option value="Completed">Selesai (Completed)</option>
                            </select>
                          </div>
                        </div>

                        {/* Navigasi Wizard Bagian 2 */}
                        {formViewMode === 'wizard' && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                            <button
                              type="button"
                              onClick={() => setActiveFormStep(1)}
                              className="btn btn-secondary btn-sm"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                              <ArrowLeft size={14} />
                              <span>Sebelumnya</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveFormStep(3)}
                              className="btn btn-primary btn-sm"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                            >
                              <span>Lanjut: Bagian 3 (Tim & Auditee)</span>
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ============================================================= */}
                    {/* BAGIAN 3: TIM AUDITOR & PIHAK AUDITEE                         */}
                    {/* ============================================================= */}
                    {(formViewMode === 'sections' || activeFormStep === 3) && (
                      <div
                        id="form-section-3"
                        className="glass-card"
                        style={{
                          padding: '1.25rem',
                          borderRadius: '12px',
                          border: activeFormStep === 3 ? '1.5px solid #0284c7' : '1px solid var(--border-subtle)',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1rem'
                        }}
                      >
                        {/* Header Bagian 3 */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: 'rgba(2, 132, 199, 0.15)',
                              color: '#0284c7',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <UserCheck size={18} />
                            </div>
                            <div>
                              <h5 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                                Bagian 3: Personil Tim Auditor & Pihak Auditee
                              </h5>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                Penanggung jawab audit, anggota tim independen, pihak yang di-audit, serta lokasi fisik
                              </span>
                            </div>
                          </div>
                          <div>
                            {section3Complete ? (
                              <span className="badge badge-success" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Check size={11} /> Lengkap
                              </span>
                            ) : (
                              <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                                Wajib Diisi
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Fields Tim Auditor & Auditee */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
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
                              placeholder={standard === 'DOC' ? 'Direktur Operasional, DPA, Manager' : 'Nakhoda, KKM, Mualim'}
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

                        {/* Navigasi Wizard Bagian 3 */}
                        {formViewMode === 'wizard' && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                            <button
                              type="button"
                              onClick={() => setActiveFormStep(2)}
                              className="btn btn-secondary btn-sm"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                              <ArrowLeft size={14} />
                              <span>Sebelumnya</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveFormStep(4)}
                              className="btn btn-primary btn-sm"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                            >
                              <span>Lanjut: Bagian 4 (Jadwal & Scope)</span>
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ============================================================= */}
                    {/* BAGIAN 4: JADWAL PELAKSANAAN & RUANG LINGKUP (SCOPE)          */}
                    {/* ============================================================= */}
                    {(formViewMode === 'sections' || activeFormStep === 4) && (
                      <div
                        id="form-section-4"
                        className="glass-card"
                        style={{
                          padding: '1.25rem',
                          borderRadius: '12px',
                          border: activeFormStep === 4 ? '1.5px solid #f59e0b' : '1px solid var(--border-subtle)',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1rem'
                        }}
                      >
                        {/* Header Bagian 4 */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: 'rgba(245, 158, 11, 0.15)',
                              color: '#f59e0b',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <FileText size={18} />
                            </div>
                            <div>
                              <h5 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                                Bagian 4: Jadwal Pelaksanaan & Ruang Lingkup (Scope)
                              </h5>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                Tanggal audit, batas akhir perbaikan temuan (Due Date), dan batasan sasaran regulasi
                              </span>
                            </div>
                          </div>
                          <div>
                            {section4Complete ? (
                              <span className="badge badge-success" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Check size={11} /> Lengkap
                              </span>
                            ) : (
                              <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                                Wajib Diisi
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Tanggal & Due Date */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                          <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                              Tanggal Pelaksanaan Audit *
                            </label>
                            <input
                              type="date"
                              required
                              value={auditDate}
                              onChange={(e) => setAuditDate(e.target.value)}
                              className="input-control mono"
                              style={{ fontWeight: 700 }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                              Target Penutupan NC (Due Date Penyelesaian) *
                            </label>
                            <input
                              type="date"
                              required
                              value={targetCloseDate}
                              onChange={(e) => setTargetCloseDate(e.target.value)}
                              className="input-control mono"
                              style={{ fontWeight: 700, color: '#f59e0b' }}
                            />
                          </div>
                        </div>

                        {/* Ruang Lingkup (Scope) dengan Quick Presets */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.35rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', margin: 0 }}>
                              Ruang Lingkup & Dasar Regulasi (Scope) *
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)' }}>Template Cepat:</span>
                              {standard === 'SMC' ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => applyScopePreset('full')}
                                    className="btn btn-secondary btn-sm"
                                    style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', color: '#0284c7' }}
                                  >
                                    74 Klausul BKI
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => applyScopePreset('annual')}
                                    className="btn btn-secondary btn-sm"
                                    style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}
                                  >
                                    Tahunan
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => applyScopePreset('interim')}
                                    className="btn btn-secondary btn-sm"
                                    style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}
                                  >
                                    Interim
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => applyScopePreset('annual')}
                                    className="btn btn-secondary btn-sm"
                                    style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', color: '#10b981' }}
                                  >
                                    13 Seksi BKI DOC
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => applyScopePreset('general')}
                                    className="btn btn-secondary btn-sm"
                                    style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}
                                  >
                                    Manajemen Darat
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                          <textarea
                            required
                            rows={3}
                            value={scope}
                            onChange={(e) => setScope(e.target.value)}
                            placeholder="Tuliskan ruang lingkup klausul ISM Code dan sasaran audit ini..."
                            className="input-control"
                            style={{ resize: 'vertical', fontSize: '0.8rem', lineHeight: '1.45' }}
                          />
                        </div>

                        {/* Navigasi Wizard Bagian 4 */}
                        {formViewMode === 'wizard' && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                            <button
                              type="button"
                              onClick={() => setActiveFormStep(3)}
                              className="btn btn-secondary btn-sm"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                              <ArrowLeft size={14} />
                              <span>Sebelumnya</span>
                            </button>
                            <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700 }}>
                              ✓ Seluruh 4 Bagian Form Selesai Ditinjau
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* MODAL FOOTER FIXED ACTIONS (Tahap 1 Sesi & Tim) */}
                <div
                  className="modal-footer"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.85rem 1.5rem",
                    background: "var(--bg-surface-elevated)",
                    borderTop: "1px solid var(--border-subtle)",
                    flexShrink: 0
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <span className="badge badge-info" style={{ fontSize: "0.72rem", fontWeight: 800 }}>
                      Tahap 1: Setup Sesi & Tim
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Langkah berikutnya: <strong>Tahap 2: Checklist Klausul</strong> di Dashboard utama.
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "0.65rem", alignItems: "center" }}>
                    {isEdit && (
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="btn btn-secondary btn-sm"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          color: "#ef4444",
                          borderColor: "rgba(239, 68, 68, 0.4)",
                          fontWeight: 700
                        }}
                        title="Hapus Sesi Audit Ini"
                      >
                        <Trash2 size={14} />
                        <span>Hapus Sesi</span>
                      </button>
                    )}

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
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.45rem",
                        fontWeight: 800,
                        background: "#0284c7"
                      }}
                    >
                      <Save size={15} />
                      <span>
                        {isEdit
                          ? "Simpan Sesi & Buka Checklist di Dashboard ➔"
                          : `Simpan Sesi & Buka Checklist ${standard} di Dashboard ➔`}
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>

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
