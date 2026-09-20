import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  X,
  Save,
  Calendar,
  Shield,
  Anchor,
  ShieldCheck,
  Building2,
  HeartPulse,
  CheckCircle2,
  Plus,
  Bell,
  BellRing,
  Clock,
  UploadCloud,
  FileUp,
  FileCheck,
  Eye,
  Trash2,
  Download,
  Sparkles,
  ExternalLink,
  UserCheck
} from 'lucide-react';
import { CERTIFICATE_CATEGORIES, STANDARD_CERTIFICATE_TEMPLATES } from '../../data/shipCertificatesMaster';
import { usePMS } from '../../context/PMSContext';

const PRESET_INTERVAL_MAP = {
  '1y': { unit: 'year', value: 1, label: '1 Tahun Sebelum (H-365)' },
  '6m': { unit: 'month', value: 6, label: '6 Bulan Sebelum (H-180)' },
  '3m': { unit: 'month', value: 3, label: '3 Bulan Sebelum (H-90)' },
  '1m': { unit: 'month', value: 1, label: '1 Bulan Sebelum (H-30)' },
  '2w': { unit: 'week', value: 2, label: '2 Minggu Sebelum (H-14)' },
  '1w': { unit: 'week', value: 1, label: '1 Minggu Sebelum (H-7)' },
  '3d': { unit: 'day', value: 3, label: '3 Hari Sebelum (H-3)' },
  '1d': { unit: 'day', value: 1, label: '1 Hari Sebelum (H-1)' }
};

const DEFAULT_REMINDERS = {
  enabled: true,
  mode: '1m',
  label: '1 Bulan Sebelum (H-30)',
  manualAmount: 30,
  manualUnit: 'day',
  manualCustomDate: '',
  channels: {
    whatsapp: true,
    googleCalendar: true
  }
};

const calculateReminderDate = (expDateStr, unit, value) => {
  if (!expDateStr) return null;
  try {
    const d = new Date(expDateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return null;
    const target = new Date(d);
    const num = Number(value || 1);
    if (unit === 'year') {
      target.setFullYear(target.getFullYear() - num);
    } else if (unit === 'month') {
      target.setMonth(target.getMonth() - num);
    } else if (unit === 'week') {
      target.setDate(target.getDate() - (num * 7));
    } else if (unit === 'day') {
      target.setDate(target.getDate() - num);
    }
    return target.toISOString().split('T')[0];
  } catch (e) {
    return null;
  }
};

const formatIndonesianDate = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const d = parseInt(parts[2], 10);
    const m = months[parseInt(parts[1], 10) - 1];
    const y = parts[0];
    return `${d} ${m} ${y}`;
  } catch (e) {
    return dateStr;
  }
};

// Generate authentic official certificate mock data URL (SVG/image) for instant demonstration
const generateSampleCertificateFile = (name, docNo, category, vesselName, issuer) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100">
    <rect width="800" height="1100" fill="#f8fafc"/>
    <rect x="30" y="30" width="740" height="1040" fill="none" stroke="#0284c7" stroke-width="4"/>
    <rect x="40" y="40" width="720" height="1020" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="6,4"/>
    <text x="400" y="100" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#0f172a" text-anchor="middle">REPUBLIK INDONESIA - KEMENTERIAN PERHUBUNGAN</text>
    <text x="400" y="130" font-family="Arial, sans-serif" font-size="13" fill="#64748b" text-anchor="middle">DIREKTORAT JENDERAL PERHUBUNGAN LAUT / BIRO KLASIFIKASI INDONESIA</text>
    <line x1="80" y1="155" x2="720" y2="155" stroke="#0284c7" stroke-width="2"/>
    <text x="400" y="220" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#0284c7" text-anchor="middle">${(name || 'SERTIFIKAT KAPAL').toUpperCase()}</text>
    <text x="400" y="255" font-family="monospace" font-size="15" font-weight="bold" fill="#334155" text-anchor="middle">NO: ${docNo || 'CERT-BAHARIMAS-2026'}</text>
    <text x="400" y="290" font-family="Arial, sans-serif" font-size="13" fill="#64748b" text-anchor="middle">Kategori: ${category || 'STATUTORY'} • PT. Pelayaran Baharimas Kalimantan</text>
    <rect x="70" y="330" width="660" height="320" fill="#ffffff" rx="8" stroke="#cbd5e1"/>
    <text x="100" y="380" font-family="Arial, sans-serif" font-size="14" fill="#64748b">Kapal Terkait:</text>
    <text x="320" y="380" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#0f172a">${vesselName || 'TB. Baharimas'}</text>
    <text x="100" y="425" font-family="Arial, sans-serif" font-size="14" fill="#64748b">Instansi Penerbit:</text>
    <text x="320" y="425" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#0f172a">${issuer || 'KSOP / BKI'}</text>
    <text x="100" y="470" font-family="Arial, sans-serif" font-size="14" fill="#64748b">Kategori Maritim:</text>
    <text x="320" y="470" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#0284c7">${category || 'KSOP'}</text>
    <text x="100" y="515" font-family="Arial, sans-serif" font-size="14" fill="#64748b">Status Dokumen:</text>
    <text x="320" y="515" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#10b981">VERIFIED OFFICIAL / RESMI DIGITAL</text>
    <text x="100" y="560" font-family="Arial, sans-serif" font-size="14" fill="#64748b">Tgl Terbit / Expired:</text>
    <text x="320" y="560" font-family="monospace" font-size="13" fill="#334155">2026-09-19 s/d Berkelanjutan</text>
    <rect x="70" y="690" width="660" height="150" fill="#f1f5f9" rx="8"/>
    <text x="100" y="735" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">Catatan Verifikasi & Hasil Survei Lapangan:</text>
    <text x="100" y="765" font-family="Arial, sans-serif" font-size="12" fill="#475569">Dokumen sertifikat kapal ini telah memenuhi standar kelaikan laut SOLAS / ISM Code / PM 39.</text>
    <text x="100" y="790" font-family="Arial, sans-serif" font-size="12" fill="#475569">Semua pemeriksaan fisik lambung, mesin, dan perlengkapan keselamatan dinyatakan laik laut.</text>
    <circle cx="620" cy="940" r="50" fill="none" stroke="#ef4444" stroke-width="3"/>
    <text x="620" y="935" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ef4444" text-anchor="middle">KEMENTERIAN</text>
    <text x="620" y="950" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#ef4444" text-anchor="middle">PERHUBUNGAN</text>
    <text x="400" y="1030" font-family="Arial, sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">Dokumen Digital PMS Armada - PT. Pelayaran Baharimas Kalimantan</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
};

export const DocumentFormModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  vessels = [],
  defaultVesselId = null
}) => {
  if (!isOpen) return null;

  const {
    certificateCategories: contextCategories,
    addCertificateCategory,
    documentTemplates: contextTemplates,
    addDocumentTemplate
  } = usePMS();

  const activeCategories = contextCategories || [];
  const activeTemplates = contextTemplates || [];

  const isEditing = !!initialData?.id;
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isAddingNewCat, setIsAddingNewCat] = useState(!isEditing && activeCategories.length === 0);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingNewTemplate, setIsAddingNewTemplate] = useState(false);
  const [newTemplateCustomName, setNewTemplateCustomName] = useState('');

  // Simplified notification state (dropdown + manual input)
  const [reminderMode, setReminderMode] = useState('1m');
  const [manualAmount, setManualAmount] = useState(30);
  const [manualUnit, setManualUnit] = useState('day');
  const [manualCustomDate, setManualCustomDate] = useState('');

  // File upload state
  const fileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState(null);

  const [formData, setFormData] = useState({
    vesselId: defaultVesselId || vessels[0]?.id || '',
    category: activeCategories[0]?.id || '',
    name: '',
    documentNo: '',
    issuer: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    mandatoryAuditor: '',
    status: 'Active',
    notificationReminders: DEFAULT_REMINDERS,
    fileUrl: null,
    fileName: null,
    fileSize: null,
    fileType: null,
    uploadedAt: null
  });

  useEffect(() => {
    if (initialData) {
      const existingReminders = initialData.notificationReminders || DEFAULT_REMINDERS;
      setFormData({
        vesselId: initialData.vesselId || defaultVesselId || vessels[0]?.id || 'v-001',
        category: initialData.category || 'KSOP',
        name: initialData.name || '',
        documentNo: initialData.documentNo || initialData.certificateNo || '',
        issuer: initialData.issuer || '',
        issueDate: initialData.issueDate || new Date().toISOString().split('T')[0],
        expiryDate: initialData.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        mandatoryAuditor: initialData.mandatoryAuditor || '',
        status: initialData.status || 'Active',
        notificationReminders: existingReminders,
        fileUrl: initialData.fileUrl || null,
        fileName: initialData.fileName || null,
        fileSize: initialData.fileSize || null,
        fileType: initialData.fileType || null,
        uploadedAt: initialData.uploadedAt || null
      });

      if (existingReminders.mode) {
        setReminderMode(existingReminders.mode);
      } else if (existingReminders.month?.enabled && existingReminders.month.value === 3) {
        setReminderMode('3m');
      } else if (existingReminders.year?.enabled) {
        setReminderMode('1y');
      } else if (existingReminders.week?.enabled) {
        setReminderMode('1w');
      } else if (existingReminders.day?.enabled) {
        setReminderMode('3d');
      } else {
        setReminderMode('1m');
      }

      if (existingReminders.manualAmount) setManualAmount(existingReminders.manualAmount);
      if (existingReminders.manualUnit) setManualUnit(existingReminders.manualUnit);
      if (existingReminders.manualCustomDate) setManualCustomDate(existingReminders.manualCustomDate);
    } else {
      setFormData({
        vesselId: defaultVesselId || vessels[0]?.id || '',
        category: activeCategories[0]?.id || '',
        name: '',
        documentNo: '',
        issuer: '',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        mandatoryAuditor: '',
        status: 'Active',
        notificationReminders: DEFAULT_REMINDERS,
        fileUrl: null,
        fileName: null,
        fileSize: null,
        fileType: null,
        uploadedAt: null
      });
      setReminderMode('1m');
      setManualAmount(30);
      setManualUnit('day');
      setManualCustomDate('');
    }
  }, [initialData, defaultVesselId, vessels]);

  // Documents templates that strictly belong to the currently selected category
  const categoryTemplates = activeTemplates.filter(t => t.category === formData.category);

  const updateReminderChannel = (channel, val) => {
    setFormData(prev => ({
      ...prev,
      notificationReminders: {
        ...prev.notificationReminders,
        channels: {
          ...prev.notificationReminders?.channels,
          [channel]: val
        }
      }
    }));
  };

  const handleTemplateSelect = (tmpl) => {
    if (!tmpl) return;
    const selectedVessel = vessels.find(v => v.id === formData.vesselId);
    const port = selectedVessel?.portOfRegistry?.split(',')[0] || 'Pontianak';
    const reg = selectedVessel?.regNo || 'REG';
    const now = new Date();
    const issueStr = now.toISOString().split('T')[0];

    const exp = new Date();
    exp.setFullYear(exp.getFullYear() + (tmpl.defaultValidityYears || 1));
    const expStr = exp.toISOString().split('T')[0];

    const issuer = tmpl.issuer.includes('KSOP')
      ? `KSOP Kelas II ${port}`
      : tmpl.issuer.includes('KKP')
      ? `Kantor Kesehatan Pelabuhan (KKP) ${port}`
      : tmpl.issuer;

    // Smart default reminder for template
    let autoMode = '1m';
    if (tmpl.category === 'BKI') autoMode = '3m';
    else if (tmpl.defaultValidityYears >= 5) autoMode = '1y';
    else if (tmpl.defaultValidityYears < 1) autoMode = '2w';

    setReminderMode(autoMode);
    setSelectedTemplate(tmpl.name);

    const auditor = tmpl.mandatoryAuditor || (tmpl.category === 'KSOP'
      ? `Syahbandar KSOP ${port}`
      : tmpl.category === 'Kesehatan'
      ? `Petugas Sanitasi KKP ${port}`
      : tmpl.category === 'BKI'
      ? `Surveyor BKI Cabang ${port}`
      : `Marine Inspector ${tmpl.category}`);

    setFormData(prev => ({
      ...prev,
      category: tmpl.category,
      name: tmpl.name,
      documentNo: `${tmpl.docPrefix || 'DOC'}-${reg}-${exp.getFullYear()}`,
      issuer,
      issueDate: issueStr,
      expiryDate: expStr,
      mandatoryAuditor: auditor,
      notificationReminders: {
        enabled: true,
        mode: autoMode,
        channels: {
          whatsapp: true,
          googleCalendar: true
        }
      }
    }));
  };

  const handleCategoryChange = (newCat) => {
    let defaultIssuer = 'Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP)';
    let defaultAuditor = 'Syahbandar KSOP Pontianak';

    if (newCat === 'BKI') {
      defaultIssuer = 'Biro Klasifikasi Indonesia (BKI)';
      defaultAuditor = 'Surveyor BKI Cabang Pontianak';
    } else if (newCat === 'Statutory') {
      defaultIssuer = 'Direktorat Jenderal Perhubungan Laut / BKI Statutory';
      defaultAuditor = 'Marine Inspector Ditjen Hubla';
    } else if (newCat === 'Asuransi') {
      defaultIssuer = 'PT. Asuransi Jasa Indonesia (Jasindo) / P&I Club';
      defaultAuditor = 'Underwriter Asuransi Maritim';
    } else if (newCat === 'Kesehatan') {
      defaultIssuer = 'Balai Karantina Kesehatan / KKP Kelas II';
      defaultAuditor = 'Petugas Pengawas Sanitasi KKP';
    } else {
      defaultIssuer = `Instansi Penerbit ${newCat}`;
      defaultAuditor = `Surveyor / Auditor ${newCat}`;
    }

    setFormData(prev => ({
      ...prev,
      category: newCat,
      issuer: defaultIssuer,
      mandatoryAuditor: defaultAuditor
    }));

    setSelectedTemplate(''); // Reset template dropdown when category changes
  };

  // Handle file selection from local device
  const handleFileUpload = (e) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 15MB
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 15 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result;
      const sizeStr = file.size >= 1024 * 1024
        ? (file.size / (1024 * 1024)).toFixed(2) + ' MB'
        : (file.size / 1024).toFixed(0) + ' KB';

      setFormData(prev => ({
        ...prev,
        fileUrl: base64Data,
        fileName: file.name,
        fileSize: sizeStr,
        fileType: file.type || 'application/pdf',
        uploadedAt: new Date().toISOString()
      }));
    };
    reader.onerror = () => {
      setUploadError('Gagal membaca file dari komputer.');
    };
    reader.readAsDataURL(file);
  };

  // Quick sample official PDF generator
  const handleUseSamplePDF = () => {
    const vessel = vessels.find(v => v.id === formData.vesselId);
    const sampleUrl = generateSampleCertificateFile(
      formData.name || 'Pas Besar',
      formData.documentNo || 'PK.201/KSOP-2026',
      formData.category,
      vessel?.name,
      formData.issuer
    );

    setFormData(prev => ({
      ...prev,
      fileUrl: sampleUrl,
      fileName: `Scan_${(formData.name || 'Sertifikat').replace(/\s+/g, '_')}_${vessel?.name?.replace(/\s+/g, '_') || 'Kapal'}.svg`,
      fileSize: '1.45 MB (Verified)',
      fileType: 'image/svg+xml',
      uploadedAt: new Date().toISOString()
    }));
    setUploadError(null);
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({
      ...prev,
      fileUrl: null,
      fileName: null,
      fileSize: null,
      fileType: null,
      uploadedAt: null
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getEffectiveReminder = () => {
    const expDate = formData.expiryDate;
    if (!expDate) return { alertDate: null, label: '-', daysBefore: 0, unit: 'month', value: 1 };

    if (reminderMode === 'MANUAL_DATE') {
      const alertDate = manualCustomDate || calculateReminderDate(expDate, 'month', 1) || expDate;
      const d1 = new Date(alertDate + 'T00:00:00');
      const d2 = new Date(expDate + 'T00:00:00');
      const daysBefore = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
      return {
        alertDate,
        label: `Tgl ${formatIndonesianDate(alertDate)} (${daysBefore} hr sblm)`,
        daysBefore,
        unit: 'custom_date',
        value: daysBefore
      };
    }

    if (reminderMode === 'MANUAL_INTERVAL') {
      const amt = Number(manualAmount) || 1;
      const alertDate = calculateReminderDate(expDate, manualUnit, amt);
      const unitLabel = manualUnit === 'day' ? 'Hari' : manualUnit === 'week' ? 'Minggu' : manualUnit === 'month' ? 'Bulan' : 'Tahun';
      const d1 = new Date(alertDate + 'T00:00:00');
      const d2 = new Date(expDate + 'T00:00:00');
      const daysBefore = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
      return {
        alertDate,
        label: `${amt} ${unitLabel} Sebelum (H-${daysBefore})`,
        daysBefore,
        unit: manualUnit,
        value: amt
      };
    }

    const preset = PRESET_INTERVAL_MAP[reminderMode] || PRESET_INTERVAL_MAP['1m'];
    const alertDate = calculateReminderDate(expDate, preset.unit, preset.value);
    const d1 = new Date(alertDate + 'T00:00:00');
    const d2 = new Date(expDate + 'T00:00:00');
    const daysBefore = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return {
      alertDate,
      label: preset.label,
      daysBefore,
      unit: preset.unit,
      value: preset.value
    };
  };

  const effectiveReminder = getEffectiveReminder();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    // 1. AUTO-SAVE TO MASTER DATA: Check if document template already exists in this category
    if (addDocumentTemplate) {
      const existsInTemplates = activeTemplates.some(
        t => t.name.toLowerCase() === formData.name.trim().toLowerCase() &&
             t.category.toLowerCase() === formData.category.toLowerCase()
      );
      if (!existsInTemplates) {
        addDocumentTemplate({
          name: formData.name.trim(),
          category: formData.category,
          defaultValidityYears: 1,
          issuer: formData.issuer,
          docPrefix: formData.documentNo?.split('-')[0] || formData.category,
          mandatoryAuditor: formData.mandatoryAuditor
        });
      }
    }

    const eff = getEffectiveReminder();
    const finalReminders = {
      enabled: formData.notificationReminders?.enabled !== false,
      mode: reminderMode,
      label: eff.label,
      calculatedDate: eff.alertDate,
      daysBefore: eff.daysBefore,
      manualAmount,
      manualUnit,
      manualCustomDate,
      year: { enabled: eff.unit === 'year', value: eff.unit === 'year' ? eff.value : 1 },
      month: { enabled: eff.unit === 'month', value: eff.unit === 'month' ? eff.value : 1 },
      week: { enabled: eff.unit === 'week', value: eff.unit === 'week' ? eff.value : 1 },
      day: { enabled: eff.unit === 'day' || eff.unit === 'custom_date', value: eff.daysBefore },
      channels: formData.notificationReminders?.channels || { whatsapp: true, googleCalendar: true }
    };

    onSave({
      ...formData,
      notificationReminders: finalReminders
    });
    onClose();
  };

  const selectedCategoryMeta = activeCategories.find(c => c.id === formData.category) || {
    id: formData.category,
    label: formData.category,
    color: '#38bdf8',
    bgColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: 'rgba(56, 189, 248, 0.35)'
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(2, 6, 23, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '1.25rem'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '780px',
        maxHeight: '92vh',
        overflowY: 'auto',
        borderRadius: '16px',
        border: `1px solid ${selectedCategoryMeta.borderColor || 'rgba(56, 189, 248, 0.35)'}`,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        padding: '1.75rem 2rem'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: selectedCategoryMeta.bgColor,
              border: `1px solid ${selectedCategoryMeta.borderColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: selectedCategoryMeta.color
            }}>
              <FileText size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {isEditing ? `Edit Dokumen: ${formData.name}` : 'Tambah Dokumen / Sertifikat Baru'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Kategori Maritim Terpilih: <strong style={{ color: selectedCategoryMeta.color }}>{selectedCategoryMeta.label}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ width: '34px', height: '34px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* 1. VESSEL & CATEGORY ROW (Kategori Dipilih Lebih Dulu Agar Pilihan Cepat Merujuk Sesuai Kategori) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
            <div>
              <label className="field-label">Kapal Terkait *</label>
              <select
                value={formData.vesselId}
                onChange={(e) => setFormData(prev => ({ ...prev, vesselId: e.target.value }))}
                className="select-control"
                required
              >
                {vessels.length === 0 ? (
                  <option value="" disabled>-- Belum ada kapal (Silakan daftarkan kapal dahulu) --</option>
                ) : (
                  <>
                    {vessels.some(v => v.ownershipStatus !== 'As Operator') && (
                      <optgroup label={`⚓ AS OWNER (${vessels.filter(v => v.ownershipStatus !== 'As Operator').length} Kapal)`}>
                        {vessels.filter(v => v.ownershipStatus !== 'As Operator').map(v => (
                          <option key={v.id} value={v.id}>🚢 {v.name} [Owner]</option>
                        ))}
                      </optgroup>
                    )}
                    {vessels.some(v => v.ownershipStatus === 'As Operator') && (
                      <optgroup label={`⚙️ AS OPERATOR (${vessels.filter(v => v.ownershipStatus === 'As Operator').length} Kapal)`}>
                        {vessels.filter(v => v.ownershipStatus === 'As Operator').map(v => (
                          <option key={v.id} value={v.id}>⚙️ {v.name} [Operator]</option>
                        ))}
                      </optgroup>
                    )}
                  </>
                )}
              </select>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className="field-label" style={{ marginBottom: 0 }}>Kategori Dokumen *</label>
                {!isAddingNewCat && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewCat(true)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem', color: '#38bdf8' }}
                  >
                    <Plus size={12} />
                    <span>+ Kategori Baru</span>
                  </button>
                )}
              </div>

              {!isAddingNewCat ? (
                <select
                  value={formData.category}
                  onChange={(e) => {
                    if (e.target.value === '__ADD_NEW__') {
                      setIsAddingNewCat(true);
                    } else {
                      handleCategoryChange(e.target.value);
                    }
                  }}
                  className="select-control"
                  style={{ fontWeight: 700 }}
                  required
                >
                  <optgroup label="Kategori Maritim">
                    {activeCategories.length === 0 ? (
                      <option value="" disabled>-- Belum ada kategori (Klik + Kategori Baru) --</option>
                    ) : (
                      activeCategories.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))
                    )}
                  </optgroup>
                  <option value="__ADD_NEW__">➕ + Tambah Kategori Baru (Manual)...</option>
                </select>
              ) : (
                <div style={{
                  padding: '0.5rem',
                  borderRadius: '8px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Ketik nama kategori baru..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="input-control"
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newCategoryName.trim()) return;
                        const created = addCertificateCategory({ label: newCategoryName.trim() });
                        setFormData(prev => ({ ...prev, category: created.id }));
                        setNewCategoryName('');
                        setIsAddingNewCat(false);
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ whiteSpace: 'nowrap', padding: '0.4rem 0.7rem', fontSize: '0.75rem' }}
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNewCat(false);
                        setNewCategoryName('');
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.4rem 0.5rem', fontSize: '0.75rem' }}
                    >
                      Batal
                    </button>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#10b981' }}>
                    ✓ Kategori baru otomatis tersimpan di Data Master & tampil di form.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 2. DYNAMIC QUICK DOCUMENT PICKER (Otomatis Merujuk Sesuai Kategori yang Dipilih) */}
          <div style={{
            padding: '1rem',
            borderRadius: '12px',
            background: 'var(--bg-surface-elevated)',
            border: `1px solid ${selectedCategoryMeta.borderColor || 'var(--border-subtle)'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <label style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: selectedCategoryMeta.color || 'var(--text-main)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <Sparkles size={14} />
                <span>⚡ Pilihan Cepat Dokumen Kategori [{formData.category}] ({categoryTemplates.length} Dokumen Tersedia):</span>
              </label>

              {!isAddingNewTemplate && (
                <button
                  type="button"
                  onClick={() => setIsAddingNewTemplate(true)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.2rem 0.6rem', fontSize: '0.72rem', color: '#38bdf8' }}
                >
                  <Plus size={12} />
                  <span>+ Tambah Template Dokumen</span>
                </button>
              )}
            </div>

            {/* Sub-form to quickly add template directly to master data */}
            {isAddingNewTemplate && (
              <div style={{
                padding: '0.65rem',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px dashed rgba(56, 189, 248, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder={`Nama template baru untuk kategori ${formData.category}...`}
                    value={newTemplateCustomName}
                    onChange={(e) => setNewTemplateCustomName(e.target.value)}
                    className="input-control"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newTemplateCustomName.trim()) return;
                      const newTmpl = addDocumentTemplate({
                        name: newTemplateCustomName.trim(),
                        category: formData.category,
                        defaultValidityYears: 1,
                        issuer: formData.issuer,
                        mandatoryAuditor: formData.mandatoryAuditor
                      });
                      if (newTmpl) {
                        handleTemplateSelect(newTmpl);
                      }
                      setNewTemplateCustomName('');
                      setIsAddingNewTemplate(false);
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ whiteSpace: 'nowrap', padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                  >
                    Simpan ke Master
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewTemplate(false);
                      setNewTemplateCustomName('');
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.4rem 0.5rem', fontSize: '0.75rem' }}
                  >
                    Batal
                  </button>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>
                  ✓ Template dokumen baru akan langsung tersimpan di Master Data dan selalu muncul di pilihan cepat kategori ini.
                </span>
              </div>
            )}

            {/* Dropdown Selector Filtered Strictly by Category */}
            <select
              className="select-control"
              value={selectedTemplate}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedTemplate(val);
                if (val && val !== 'MANUAL') {
                  const tmpl = activeTemplates.find(t => t.name === val && t.category === formData.category) ||
                               activeTemplates.find(t => t.name === val);
                  if (tmpl) handleTemplateSelect(tmpl);
                } else if (val === 'MANUAL') {
                  setFormData(prev => ({ ...prev, name: '' }));
                }
              }}
              style={{ background: 'var(--bg-surface)', fontWeight: 600 }}
            >
              <option value="">
                {categoryTemplates.length > 0
                  ? `-- Pilih Dokumen Standar ${formData.category} (${categoryTemplates.length} Tersedia) --`
                  : `-- Belum ada template standar untuk kategori ${formData.category} (Input nama di bawah) --`}
              </option>
              {categoryTemplates.map(t => (
                <option key={t.name} value={t.name}>
                  📄 {t.name} (Berlaku {t.defaultValidityYears} Thn)
                </option>
              ))}
              <option value="MANUAL">✍️ Dokumen Baru / Input Judul Manual (Otomatis Masuk Data Master)</option>
            </select>

            {/* Quick Interactive Chips for Click-to-Pick */}
            {categoryTemplates.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.15rem' }}>
                {categoryTemplates.map(t => {
                  const isSelected = formData.name === t.name;
                  return (
                    <button
                      key={t.name}
                      type="button"
                      onClick={() => handleTemplateSelect(t)}
                      className="btn btn-sm"
                      style={{
                        padding: '0.2rem 0.55rem',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        borderRadius: '6px',
                        background: isSelected ? selectedCategoryMeta.color : 'rgba(255, 255, 255, 0.04)',
                        color: isSelected ? '#000' : 'var(--text-main)',
                        border: isSelected ? `1px solid ${selectedCategoryMeta.color}` : '1px solid var(--border-subtle)',
                        transition: 'all 0.15s ease'
                      }}
                      title={`Klik untuk otomatis mengisi ${t.name}`}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. NAME & DOCUMENT NUMBER */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem' }}>
            <div>
              <label className="field-label">Nama Sertifikat / Dokumen *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Pas Besar / Cargo Ship Safety Equipment"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="input-control"
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
                Jika mengetik nama baru, otomatis tersimpan ke Data Master saat formulir disimpan.
              </span>
            </div>

            <div>
              <label className="field-label">Nomor Sertifikat / Dokumen *</label>
              <input
                type="text"
                required
                placeholder="Contoh: PK.201/KSOP-24587-2026"
                value={formData.documentNo}
                onChange={(e) => setFormData(prev => ({ ...prev, documentNo: e.target.value }))}
                className="input-control mono"
              />
            </div>
          </div>

          {/* 4. SURVEYOR / AUDITOR & ISSUER ROW (CRUCIAL USER REQUIREMENT) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: '1rem',
            padding: '1rem',
            borderRadius: '10px',
            background: 'rgba(56, 189, 248, 0.04)',
            border: '1px solid rgba(56, 189, 248, 0.2)'
          }}>
            <div>
              <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8' }}>
                <UserCheck size={15} />
                <span>Surveyor / Auditor Pemeriksa *</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Surveyor BKI / Syahbandar KSOP / Marine Inspector"
                value={formData.mandatoryAuditor}
                onChange={(e) => setFormData(prev => ({ ...prev, mandatoryAuditor: e.target.value }))}
                className="input-control"
                style={{ fontWeight: 600 }}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
                Nama atau jabatan surveyor pemeriksa (akan ditampilkan di kolom tabel sertifikat).
              </span>
            </div>

            <div>
              <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Building2 size={15} />
                <span>Instansi Penerbit (Issuer) *</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: KSOP Kelas II Pontianak / BKI"
                value={formData.issuer}
                onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
                className="input-control"
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
                Otoritas pelabuhan atau badan sertifikasi resmi.
              </span>
            </div>
          </div>

          {/* 5. TANGGAL PENERBITAN & TANGGAL EXPIRED */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            padding: '1rem',
            borderRadius: '10px',
            background: 'rgba(2, 132, 199, 0.05)',
            border: '1px solid rgba(56, 189, 248, 0.2)'
          }}>
            <div>
              <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8' }}>
                <Calendar size={14} />
                <span>Tanggal Penerbitan (Issue Date) *</span>
              </label>
              <input
                type="date"
                required
                value={formData.issueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                className="input-control mono"
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
                Tanggal resmi dokumen diterbitkan oleh instansi
              </span>
            </div>

            <div>
              <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b' }}>
                <Calendar size={14} />
                <span>Tanggal Expired (Jatuh Tempo) *</span>
              </label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                className="input-control mono"
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
                Batas akhir masa berlaku / survei berkala
              </span>
            </div>
          </div>

          {/* 6. MENU UPLOAD DOKUMEN (FILE SCAN SERTIFIKAT) - CRUCIAL USER REQUIREMENT */}
          <div style={{
            padding: '1.1rem 1.25rem',
            borderRadius: '12px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <UploadCloud size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>Upload Berkas / Dokumen Scan Sertifikat</span>
                    {formData.fileUrl && (
                      <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                        ✓ Berkas Tersedia
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                    Unggah file scan PDF atau foto dokumen asli kapal (maksimal 15 MB).
                  </div>
                </div>
              </div>

              {!formData.fileUrl && (
                <button
                  type="button"
                  onClick={handleUseSamplePDF}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  title="Gunakan contoh berkas scan sertifikat digital untuk demonstrasi"
                >
                  <Sparkles size={12} />
                  <span>Pasang Contoh PDF Resmi</span>
                </button>
              )}
            </div>

            {/* Upload Area / File Display */}
            {formData.fileUrl ? (
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <FileCheck size={26} color="#10b981" />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {formData.fileName || 'Berkas_Sertifikat.pdf'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                      Ukuran: {formData.fileSize || '1.2 MB'} • Diunggah: {formData.uploadedAt ? new Date(formData.uploadedAt).toLocaleTimeString('id-ID') : 'Baru saja'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.fileUrl) {
                        const win = window.open();
                        if (win) {
                          win.document.write(`<iframe src="${formData.fileUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                        }
                      }
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Eye size={13} />
                    <span>Lihat Berkas</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Trash2 size={13} />
                    <span>Hapus Berkas</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,image/*,.doc,.docx"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="doc-file-upload-input"
                />
                <label
                  htmlFor="doc-file-upload-input"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.25rem 1rem',
                    borderRadius: '8px',
                    border: '2px dashed var(--border-subtle)',
                    background: 'rgba(0, 0, 0, 0.15)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10b981'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                >
                  <FileUp size={28} color="#94a3b8" style={{ marginBottom: '0.4rem' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    Klik untuk Pilih File Dokumen (PDF, JPG, PNG)
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                    Tersimpan otomatis ke sistem Cloud PMS dan dapat diunduh langsung dari tabel sertifikat
                  </span>
                </label>
              </div>
            )}

            {uploadError && (
              <span style={{ fontSize: '0.72rem', color: '#ef4444' }}>
                ⚠️ {uploadError}
              </span>
            )}
          </div>

          {/* 7. PENGATURAN NOTIFIKASI & PENGINGAT EXPIRED */}
          <div style={{
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(56, 189, 248, 0.05) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {/* Header Section with Title & Master Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <BellRing size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>Pengaturan Notifikasi & Pengingat Expired</span>
                    <span className="badge" style={{ fontSize: '0.65rem', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                      Dropdown & Manual
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                    Pilih interval notifikasi sebelum dokumen jatuh tempo (pilih cepat atau ketik manual).
                  </div>
                </div>
              </div>

              {/* Master Toggle */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>
                <input
                  type="checkbox"
                  checked={formData.notificationReminders?.enabled !== false}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setFormData(prev => ({
                      ...prev,
                      notificationReminders: {
                        ...prev.notificationReminders,
                        enabled: val
                      }
                    }));
                  }}
                  style={{ width: '15px', height: '15px', accentColor: '#f59e0b', cursor: 'pointer' }}
                />
                <span style={{ color: formData.notificationReminders?.enabled !== false ? '#10b981' : 'var(--text-muted)' }}>
                  {formData.notificationReminders?.enabled !== false ? '● Notifikasi Aktif' : '○ Nonaktif'}
                </span>
              </label>
            </div>

            {formData.notificationReminders?.enabled !== false && (
              <>
                {/* Single Row: Simple Dropdown & Manual Input Controls */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: (reminderMode === 'MANUAL_INTERVAL' || reminderMode === 'MANUAL_DATE') ? '1.2fr 1.1fr' : '1fr',
                  gap: '0.75rem',
                  alignItems: 'flex-end'
                }}>
                  {/* Dropdown Selector */}
                  <div>
                    <label className="field-label" style={{ fontSize: '0.75rem', marginBottom: '0.3rem', color: '#f59e0b' }}>
                      Waktu Pengingat Sebelum Expired (Tahun / Bulan / Minggu / Hari) *
                    </label>
                    <select
                      value={reminderMode}
                      onChange={(e) => setReminderMode(e.target.value)}
                      className="select-control"
                      style={{ fontWeight: 600, background: 'var(--bg-surface)' }}
                    >
                      <optgroup label="⚡ Pilihan Cepat Maritim (Standar)">
                        <option value="1y">📅 1 Tahun Sebelumnya (H-365) - Survey BKI / Docking</option>
                        <option value="6m">🗓️ 6 Bulan Sebelumnya (H-180)</option>
                        <option value="3m">🗓️ 3 Bulan Sebelumnya (H-90) - Pengajuan Survey BKI/KSOP</option>
                        <option value="1m">🗓️ 1 Bulan Sebelumnya (H-30) - Standar Peringatan Maritim</option>
                        <option value="2w">⏱️ 2 Minggu Sebelumnya (H-14)</option>
                        <option value="1w">⏱️ 1 Minggu Sebelumnya (H-7) - Inspeksi Fisik</option>
                        <option value="3d">🚨 3 Hari Sebelumnya (H-3) - Peringatan Darurat</option>
                        <option value="1d">🚨 1 Hari Sebelumnya (H-1) - Batas Akhir Kritis</option>
                      </optgroup>
                      <optgroup label="✍️ Isi Manual (Kustom Bebas)">
                        <option value="MANUAL_INTERVAL">✍️ Isi Manual: Tentukan Jumlah Hari / Minggu / Bulan / Tahun...</option>
                        <option value="MANUAL_DATE">📅 Isi Manual: Pilih Tanggal Pengingat Kalender Sendiri...</option>
                      </optgroup>
                    </select>
                  </div>

                  {/* Manual Interval Input */}
                  {reminderMode === 'MANUAL_INTERVAL' && (
                    <div>
                      <label className="field-label" style={{ fontSize: '0.75rem', marginBottom: '0.3rem', color: '#38bdf8' }}>
                        Isi Manual: Mau Berapa Lama Sebelum Expired?
                      </label>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <input
                          type="number"
                          min="1"
                          max="3650"
                          value={manualAmount}
                          onChange={(e) => setManualAmount(Math.max(1, parseInt(e.target.value) || 1))}
                          className="input-control mono"
                          style={{ width: '85px', fontWeight: 700, textAlign: 'center' }}
                          placeholder="45"
                        />
                        <select
                          value={manualUnit}
                          onChange={(e) => setManualUnit(e.target.value)}
                          className="select-control"
                          style={{ flex: 1, fontWeight: 600 }}
                        >
                          <option value="day">Hari Sebelum Expired</option>
                          <option value="week">Minggu Sebelum Expired</option>
                          <option value="month">Bulan Sebelum Expired</option>
                          <option value="year">Tahun Sebelum Expired</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Manual Calendar Date Input */}
                  {reminderMode === 'MANUAL_DATE' && (
                    <div>
                      <label className="field-label" style={{ fontSize: '0.75rem', marginBottom: '0.3rem', color: '#38bdf8' }}>
                        Pilih Tanggal Pengingat Kalender:
                      </label>
                      <input
                        type="date"
                        value={manualCustomDate || calculateReminderDate(formData.expiryDate, 'month', 1) || ''}
                        onChange={(e) => setManualCustomDate(e.target.value)}
                        className="input-control mono"
                        style={{ fontWeight: 700 }}
                      />
                    </div>
                  )}
                </div>

                {/* Status Hasil Kalkulasi & Channels */}
                <div style={{
                  padding: '0.55rem 0.85rem',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  fontSize: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                    <Clock size={13} color="#f59e0b" />
                    <span>Jadwal Notifikasi:</span>
                    <strong style={{ color: '#38bdf8', fontSize: '0.82rem' }}>
                      🔔 {formatIndonesianDate(effectiveReminder.alertDate)}
                    </strong>
                    {effectiveReminder.daysBefore !== undefined && (
                      <span style={{ color: effectiveReminder.daysBefore > 0 ? '#10b981' : '#ef4444', fontSize: '0.7rem' }}>
                        ({effectiveReminder.daysBefore > 0 ? `${effectiveReminder.daysBefore} hari sebelum jatuh tempo` : 'Hari H / Lewat'})
                      </span>
                    )}
                  </div>

                  {/* Saluran Notifikasi */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', color: '#22c55e', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={formData.notificationReminders?.channels?.whatsapp !== false}
                        onChange={(e) => updateReminderChannel('whatsapp', e.target.checked)}
                        style={{ accentColor: '#22c55e', cursor: 'pointer' }}
                      />
                      <span>WhatsApp WA</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', color: '#38bdf8', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={formData.notificationReminders?.channels?.googleCalendar !== false}
                        onChange={(e) => updateReminderChannel('googleCalendar', e.target.checked)}
                        style={{ accentColor: '#38bdf8', cursor: 'pointer' }}
                      />
                      <span>Google Calendar</span>
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.5rem',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.25rem'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              * Data tersimpan terpusat di Master Data dan armada Baharimas
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
                }}
              >
                <Save size={15} />
                <span>{isEditing ? 'Simpan Perubahan Sertifikat' : 'Simpan Sertifikat Dokumen'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
