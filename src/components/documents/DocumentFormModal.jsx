import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  FileText,
  X,
  Save,
  Calendar,
  Shield,
  Anchor,
  ShieldCheck,
  ShieldAlert,
  Building2,
  HeartPulse,
  CheckCircle2,
  Plus,
  BellRing,
  Clock,
  UploadCloud,
  FileUp,
  FileCheck,
  Eye,
  Trash2,
  Sparkles,
  UserCheck,
  ClipboardCheck,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Layers,
  Tag,
  Mail
} from 'lucide-react';
import { CERTIFICATE_CATEGORIES } from '../../data/shipCertificatesMaster';
import { usePMS } from '../../context/PMSContext';
import { CATEGORY_FORM_PROFILES, getCategoryProfile } from './docform/docFormProfiles';
import {
  PRESET_INTERVAL_MAP,
  DEFAULT_REMINDERS,
  calculateReminderDate,
  normalizeDateForInput,
  formatIndonesianDate,
  generateSampleCertificateFile
} from './docform/docFormHelpers';
import { DocFormStep2Header } from './docform/DocFormStep2Header';
import { DocFormStep2InfoBanner } from './docform/DocFormStep2InfoBanner';
import { DocFormVesselSection } from './docform/DocFormVesselSection';
import { DocFormSurveyPeriodSection } from './docform/DocFormSurveyPeriodSection';
import { DocFormNameNumberSection } from './docform/DocFormNameNumberSection';
import { DocFormIssuerSection } from './docform/DocFormIssuerSection';
import { DocFormDatesSection } from './docform/DocFormDatesSection';
import { DocFormUploadSection } from './docform/DocFormUploadSection';
import { DocFormNotifSection } from './docform/DocFormNotifSection';
import { DocFormSubmitBar } from './docform/DocFormSubmitBar';
import { DocFormCategoryPicker } from './docform/DocFormCategoryPicker';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { MasterCombobox } from '../common/MasterCombobox';

// -------------------------------------------------------------
// DYNAMIC MARITIME CATEGORY FORM PROFILES (BKI, KSOP, Statutory, Kesehatan, Asuransi)
// Form beradaptasi secara dinamis sesuai kategori maritim yang dipilih
// -------------------------------------------------------------

// Component to render specialized category-specific fields

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
    canAction,
    certificateCategories: contextCategories,
    addCertificateCategory,
    deleteCertificateCategory,
    documentTemplates: contextTemplates,
    addDocumentTemplate,
    deleteDocumentTemplate,
    masterSurveyTypes,
    addMasterSurveyType,
    deleteMasterSurveyType,
    shipDocuments
  } = usePMS();

  const activeCategories = contextCategories || [];
  const activeTemplates = contextTemplates || [];

  const isEditing = !!initialData?.id;
  const [formStep, setFormStep] = useState(isEditing ? 2 : 1); // 1: Pilih Kategori, 2: Form Pengisian
  const [isAddingNewCat, setIsAddingNewCat] = useState(false);
  const [deletingCatId, setDeletingCatId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);

  // Simplified notification state (dropdown + manual input)
  const [reminderMode, setReminderMode] = useState('1m');
  const [manualAmount, setManualAmount] = useState(30);
  const [manualUnit, setManualUnit] = useState('day');
  const [manualCustomDate, setManualCustomDate] = useState('');

  // File upload state
  const fileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState(null);

  const [formData, setFormData] = useState(() => {
    const initCat = initialData?.category || (activeCategories[0]?.id || 'BKI');
    const initProf = getCategoryProfile(initCat);
    const selVessel = vessels.find(v => v.id === (defaultVesselId || vessels[0]?.id));
    const port = selVessel?.portOfRegistry?.split(',')[0]?.trim() || 'Pontianak';
    const initIssuer = initialData?.issuer || (initProf.defaultIssuer ? initProf.defaultIssuer(port) : '');

    return {
      vesselId: defaultVesselId || vessels[0]?.id || '',
      category: initCat,
      surveyType: initialData?.surveyType || '',
      surveyPeriod: initialData?.surveyPeriod || initialData?.period || '',
      name: initialData?.name || '',
      documentNo: initialData?.documentNo || initialData?.certificateNo || '',
      issuer: initIssuer,
      placeOfIssue: initialData?.placeOfIssue || (port || 'Pontianak'),
      certificateTerm: initialData?.certificateTerm || 'Full Term (Definitif)',
      issueDate: normalizeDateForInput(initialData?.issueDate) || new Date().toISOString().split('T')[0],
      expiryDate: normalizeDateForInput(initialData?.expiryDate) || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      mandatoryAuditor: initialData?.mandatoryAuditor || '',
      status: initialData?.status || 'Active',
      notificationReminders: DEFAULT_REMINDERS,
      categorySpecificData: initialData?.categorySpecificData || {},
      fileUrl: null,
      fileName: null,
      fileSize: null,
      fileType: null,
      uploadedAt: null
    };
  });

  useEffect(() => {
    const selVessel = vessels.find(v => v.id === (initialData?.vesselId || defaultVesselId || vessels[0]?.id));
    const port = selVessel?.portOfRegistry?.split(',')[0]?.trim() || 'Pontianak';

    if (initialData) {
      const existingReminders = initialData.notificationReminders || DEFAULT_REMINDERS;
      const cat = initialData.category || 'BKI';
      const prof = getCategoryProfile(cat);
      const issuer = initialData.issuer || (prof.defaultIssuer ? prof.defaultIssuer(port) : '');

      setFormData({
        vesselId: initialData.vesselId || defaultVesselId || vessels[0]?.id || 'v-001',
        category: cat,
        surveyType: initialData.surveyType || '',
        surveyPeriod: initialData.surveyPeriod || initialData.period || '',
        name: initialData.name || '',
        documentNo: initialData.documentNo || initialData.certificateNo || '',
        issuer,
        placeOfIssue: initialData.placeOfIssue || (port || 'Pontianak'),
        certificateTerm: initialData.certificateTerm || 'Full Term (Definitif)',
        issueDate: normalizeDateForInput(initialData.issueDate) || new Date().toISOString().split('T')[0],
        expiryDate: normalizeDateForInput(initialData.expiryDate) || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        mandatoryAuditor: initialData.mandatoryAuditor || '',
        status: initialData.status || 'Active',
        notificationReminders: existingReminders,
        categorySpecificData: initialData.categorySpecificData || {},
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
      const cat = activeCategories[0]?.id || 'BKI';
      const prof = getCategoryProfile(cat);
      const issuer = prof.defaultIssuer ? prof.defaultIssuer(port) : '';
      setFormData({
        vesselId: defaultVesselId || vessels[0]?.id || '',
        category: cat,
        surveyType: '',
        surveyPeriod: '',
        name: '',
        documentNo: '',
        issuer,
        placeOfIssue: port || 'Pontianak',
        certificateTerm: 'Full Term (Definitif)',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        mandatoryAuditor: '',
        status: 'Active',
        notificationReminders: DEFAULT_REMINDERS,
        categorySpecificData: {},
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

  const handleSurveyTypeSelect = (surveyVal, validityYears = null) => {
    let years = validityYears;
    let autoPeriod = '';

    if (!years && surveyVal) {
      const lower = surveyVal.toLowerCase();
      if (lower.includes('2.5') || lower.includes('intermediate') || lower.includes('docking')) {
        years = 2.5;
        autoPeriod = '2.5 Tahun';
      } else if (lower.includes('5 thn') || lower.includes('5 tahun') || lower.includes('special') || lower.includes('renewal')) {
        years = 5;
        autoPeriod = '5 Tahun';
      } else if (lower.includes('10 thn') || lower.includes('10 tahun') || lower.includes('surat ukur')) {
        years = 10;
        autoPeriod = '10 Tahun';
      } else if (lower.includes('6 bln') || lower.includes('6 bulan') || lower.includes('0.5') || lower.includes('sscec')) {
        years = 0.5;
        autoPeriod = '6 Bulan';
      } else if (lower.includes('annual') || lower.includes('1 thn') || lower.includes('1 tahun') || lower.includes('tahunan') || lower.includes('kelaiklautan') || lower.includes('safety equipment') || lower.includes('radio') || lower.includes('endorsement')) {
        years = 1;
        autoPeriod = '1 Tahun';
      }
    }

    setFormData(prev => {
      const updated = {
        ...prev,
        surveyType: surveyVal,
        // Otomatis isi periode jika kolom periode masih kosong
        surveyPeriod: prev.surveyPeriod || autoPeriod || ''
      };

      if (years && prev.issueDate) {
        try {
          const d = new Date(prev.issueDate + 'T00:00:00');
          if (!isNaN(d.getTime())) {
            if (years === 2.5) {
              d.setMonth(d.getMonth() + 30);
            } else if (years < 1) {
              d.setMonth(d.getMonth() + Math.round(years * 12));
            } else {
              d.setFullYear(d.getFullYear() + years);
            }
            updated.expiryDate = d.toISOString().split('T')[0];
          }
        } catch {}
      }
      return updated;
    });
  };

  const handleCategoryChange = (newCat) => {
    const newProfile = getCategoryProfile(newCat);
    const selectedVessel = vessels.find(v => v.id === formData.vesselId);
    const portName = selectedVessel?.portOfRegistry?.split(',')[0]?.trim() || 'Pontianak';
    const autoIssuer = newProfile.defaultIssuer ? newProfile.defaultIssuer(portName) : `Instansi ${newCat}`;

    setFormData(prev => {
      const shouldUpdateIssuer = !prev.issuer ||
        prev.issuer.includes('Biro Klasifikasi') ||
        prev.issuer.includes('KSOP') ||
        prev.issuer.includes('Hubla') ||
        prev.issuer.includes('Karantina') ||
        prev.issuer.includes('Jasindo') ||
        prev.issuer.includes('Instansi Penerbit');

      // Kolom jenis survey dibiarkan kosong default agar mudah dicari / dipilih oleh user
      const nextSurvey = isEditing ? prev.surveyType : '';
      const nextPeriod = isEditing ? (prev.surveyPeriod || '') : '';

      // Auto-adjust default expiry for Kesehatan SSCEC (6 months)
      let nextExpiry = prev.expiryDate;
      if (newCat.toLowerCase().includes('sehat') || newCat.toLowerCase().includes('kkp')) {
        try {
          const d = new Date((prev.issueDate || new Date().toISOString().split('T')[0]) + 'T00:00:00');
          d.setMonth(d.getMonth() + 6);
          nextExpiry = d.toISOString().split('T')[0];
        } catch {}
      }

      return {
        ...prev,
        category: newCat,
        issuer: shouldUpdateIssuer ? autoIssuer : prev.issuer,
        surveyType: nextSurvey,
        surveyPeriod: nextPeriod,
        expiryDate: nextExpiry
      };
    });
  };

  const updateCategorySpecific = (key, val) => {
    setFormData(prev => ({
      ...prev,
      categorySpecificData: {
        ...(prev.categorySpecificData || {}),
        [key]: val
      }
    }));
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
    if (canAction && !canAction('add_certificate')) {
      return;
    }
    if (!formData.name.trim()) return;

    const trimmedName = formData.name.trim();

    // Otomatis daftarkan nama dokumen baru ke Data Master jika belum ada
    if (addDocumentTemplate && trimmedName) {
      const exists = (contextTemplates || []).some(
        t => t.name && t.name.trim().toLowerCase() === trimmedName.toLowerCase()
      );
      if (!exists) {
        addDocumentTemplate({
          name: trimmedName,
          category: formData.category || 'BKI',
          defaultValidityYears: 1,
          issuer: formData.issuer || 'Biro Klasifikasi Indonesia (BKI)'
        });
      }
    }

    // Otomatis daftarkan jenis survey baru ke Data Master jika belum ada
    if (addMasterSurveyType && formData.surveyType?.trim()) {
      const trimmedSurvey = formData.surveyType.trim();
      const exists = (masterSurveyTypes || []).some(
        s => s.name && s.name.trim().toLowerCase() === trimmedSurvey.toLowerCase()
      );
      if (!exists) {
        addMasterSurveyType({
          name: trimmedSurvey,
          category: formData.category || 'BKI',
          periodLabel: formData.surveyPeriod?.trim() || '',
          intervalYears: 1,
          description: `Jenis survey ${trimmedSurvey}${formData.surveyPeriod?.trim() ? ` (Periode: ${formData.surveyPeriod.trim()})` : ''}`
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
      channels: formData.notificationReminders?.channels || { whatsapp: true, email: true, googleCalendar: true },
      emailRecipient: formData.notificationReminders?.emailRecipient || ''
    };

    onSave({
      ...formData,
      surveyPeriod: formData.surveyPeriod?.trim() || '',
      notificationReminders: finalReminders
    });
    onClose();
  };

  const currentProfile = getCategoryProfile(formData.category);

  // Pilihan master jenis survey (difilter berdasarkan kategori terpilih atau umum)
  const availableSurveyTypes = useMemo(() => {
    const list = [];
    const catUpper = (formData?.category || '').toUpperCase();

    // Prioritaskan dari Master Data Survey Types di Data Master
    (masterSurveyTypes || []).forEach(st => {
      const stCat = (st.category || '').toUpperCase();
      if (!stCat || stCat === catUpper || stCat === 'ALL') {
        if (st.name && !list.includes(st.name.trim())) {
          list.push(st.name.trim());
        }
      }
    });

    return list;
  }, [masterSurveyTypes, formData?.category]);

  // Pilihan nama sertifikat yang sudah ada di master templates & dokumen kapal (difilter per kategori)
  const availableDocumentNames = useMemo(() => {
    const namesSet = new Set();
    const catUpper = (formData?.category || '').toUpperCase();

    // Dari master template nama sertifikat yang sesuai kategori
    (contextTemplates || []).forEach(t => {
      const tCat = (t.category || '').toUpperCase();
      if (!tCat || tCat === catUpper || tCat === 'ALL') {
        if (t.name && t.name.trim()) namesSet.add(t.name.trim());
      }
    });

    // Tambahkan juga dari dokumen kapal yang pernah tersimpan dengan kategori ini
    (shipDocuments || []).forEach(d => {
      if ((d.category || '').toUpperCase() === catUpper) {
        if (d.name && d.name.trim()) namesSet.add(d.name.trim());
      }
    });

    // Jika belum ada yang sama persis kategori, sertakan semua nama master lainnya
    if (namesSet.size === 0) {
      (contextTemplates || []).forEach(t => {
        if (t.name && t.name.trim()) namesSet.add(t.name.trim());
      });
    }

    return Array.from(namesSet);
  }, [contextTemplates, shipDocuments, formData?.category]);

  // Kalkulasi Jendela Survei Maritim Tahunan (IMO SOLAS & BKI Annual Survey Window ±3 Bulan)
  const surveyWindow = useMemo(() => {
    if (!formData.expiryDate) return null;
    try {
      const exp = new Date(formData.expiryDate + 'T00:00:00');
      if (isNaN(exp.getTime())) return null;
      const day = exp.getDate();
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const expMonth = exp.getMonth();
      const anniversaryLabel = `${day} ${monthNames[expMonth]}`;
      const startMonthIdx = (expMonth - 3 + 12) % 12;
      const endMonthIdx = (expMonth + 3) % 12;
      return {
        anniversaryLabel,
        windowStart: `${day} ${monthNames[startMonthIdx]}`,
        windowEnd: `${day} ${monthNames[endMonthIdx]}`
      };
    } catch {
      return null;
    }
  }, [formData.expiryDate]);

  // Daftar kategori sertifikat kapal disinkronkan 100% dengan Data Master
  const allCategoryList = useMemo(() => {
    const cats = Array.isArray(contextCategories) ? contextCategories : (CERTIFICATE_CATEGORIES || []);

    const result = cats.map(cat => {
      const catId = cat.id || cat.code || cat.label;
      const prof = getCategoryProfile(catId);
      return {
        ...prof,
        ...cat,
        id: catId,
        label: cat.label || prof.label || catId,
        shortLabel: cat.shortLabel || prof.shortLabel || cat.label || catId,
        code: cat.code || prof.code || catId,
        color: cat.color || prof.color || '#38bdf8',
        bgColor: cat.bgColor || prof.bgColor || 'rgba(56, 189, 248, 0.15)',
        borderColor: cat.borderColor || prof.borderColor || 'rgba(56, 189, 248, 0.45)',
        description: cat.description || prof.tagline || `Kategori sertifikat ${cat.label || catId}`,
        tagline: cat.tagline || prof.tagline || cat.description,
        icon: prof.icon || cat.icon || FileText,
        isCustom: !!cat.isCustom
      };
    });

    // Jika sedang edit dokumen lama yang kategorinya belum ada di Data Master
    if (isEditing && initialData?.category) {
      const exists = result.some(r => (r.id || '').toLowerCase() === (initialData.category || '').toLowerCase());
      if (!exists) {
        const prof = getCategoryProfile(initialData.category);
        result.push({
          id: initialData.category,
          label: prof.label || initialData.category,
          shortLabel: prof.shortLabel || initialData.category,
          code: initialData.category,
          color: prof.color || '#38bdf8',
          bgColor: prof.bgColor || 'rgba(56, 189, 248, 0.15)',
          borderColor: prof.borderColor || 'rgba(56, 189, 248, 0.45)',
          description: prof.tagline || `Kategori sertifikat ${initialData.category}`,
          tagline: 'Kategori Dokumen',
          icon: prof.icon || FileText,
          isCustom: true
        });
      }
    }

    return result;
  }, [contextCategories, isEditing, initialData]);

  // Otomatis sinkronkan formData.category jika kategori saat ini dihapus dari Data Master
  useEffect(() => {
    if (allCategoryList.length > 0) {
      const exists = allCategoryList.some(c => (c.id || '').toLowerCase() === (formData.category || '').toLowerCase());
      if (!exists) {
        handleCategoryChange(allCategoryList[0].id);
      }
    }
  }, [allCategoryList, formData.category]);

  const canAddCert = canAction ? canAction('add_certificate') : false;

  if (!canAddCert) {
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
        <div className="glass-card" style={{ maxWidth: '460px', width: '100%', textAlign: 'center', padding: '2.5rem 2rem', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
            <ShieldAlert size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.6rem' }}>
            Akses Terbatas: Super Admin
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            Hanya pengguna dengan peran <strong>Super Admin</strong> yang memiliki hak akses untuk menambah atau mendaftarkan sertifikat / dokumen kapal baru.
          </p>
          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            Tutup
          </button>
        </div>
      </div>
    );
  }

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
        maxWidth: formStep === 1 ? '880px' : '820px',
        maxHeight: '92vh',
        overflowY: 'auto',
        borderRadius: '16px',
        border: `1px solid ${currentProfile.borderColor || 'rgba(56, 189, 248, 0.35)'}`,
        boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 25px ${currentProfile.color}15`,
        padding: '1.75rem 2rem',
        transition: 'all 0.25s ease'
      }}>
        {/* ========================================================================= */}
        {/* STEP 1: PILIH KATEGORI SERTIFIKAT KAPAL (BKI, KSOP, STATUTORY, DLL.)      */}
        {/* ========================================================================= */}
        {(formStep === 1) && (
          <DocFormCategoryPicker
            addCertificateCategory={addCertificateCategory}
            allCategoryList={allCategoryList}
            deleteCertificateCategory={deleteCertificateCategory}
            deletingCatId={deletingCatId}
            formData={formData}
            handleCategoryChange={handleCategoryChange}
            isAddingNewCat={isAddingNewCat}
            newCategoryDesc={newCategoryDesc}
            newCategoryName={newCategoryName}
            onClose={onClose}
            setDeletingCatId={setDeletingCatId}
            setFormData={setFormData}
            setFormStep={setFormStep}
            setIsAddingNewCat={setIsAddingNewCat}
            setNewCategoryDesc={setNewCategoryDesc}
            setNewCategoryName={setNewCategoryName}
            vessels={vessels}
          />
        )}

        {/* ========================================================================= */}
        {/* STEP 2: FORMULIR PENGISIAN DOKUMEN SPESIFIK KATEGORI                      */}
        {/* ========================================================================= */}
        {formStep === 2 && (
          <div>
            {/* Step 2 Header */}
            <DocFormStep2Header
              currentProfile={currentProfile}
              formData={formData}
              isEditing={isEditing}
              onClose={onClose}
            />

            {/* Active Category Context Bar with Ganti Kategori Button */}
            <DocFormStep2InfoBanner
              currentProfile={currentProfile}
              setFormStep={setFormStep}
            />

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* 1. VESSEL SELECTION */}
              <DocFormVesselSection
                formData={formData}
                setFormData={setFormData}
                vessels={vessels}
              />

          {/* 3. JENIS SURVEY & PERIODE PEMERIKSAAN DOKUMEN KAPAL */}
          <DocFormSurveyPeriodSection
            availableSurveyTypes={availableSurveyTypes}
            currentProfile={currentProfile}
            formData={formData}
            handleSurveyTypeSelect={handleSurveyTypeSelect}
            setFormData={setFormData}
          />

          {/* 4. NAME & DOCUMENT NUMBER */}
          <DocFormNameNumberSection
            availableDocumentNames={availableDocumentNames}
            currentProfile={currentProfile}
            formData={formData}
            setFormData={setFormData}
          />

          {/* 5. SURVEYOR / AUDITOR & ISSUER ROW */}
          <DocFormIssuerSection
            currentProfile={currentProfile}
            formData={formData}
            setFormData={setFormData}
          />

          {/* 5. TANGGAL PENERBITAN, TEMPAT TERBIT, EXPIRED & SIFAT SERTIFIKAT */}
          <DocFormDatesSection
            formData={formData}
            setFormData={setFormData}
            surveyWindow={surveyWindow}
          />

          {/* 6. MENU UPLOAD DOKUMEN (FILE SCAN SERTIFIKAT) - CRUCIAL USER REQUIREMENT */}
          <DocFormUploadSection
            fileInputRef={fileInputRef}
            formData={formData}
            handleFileUpload={handleFileUpload}
            handleRemoveFile={handleRemoveFile}
            handleUseSamplePDF={handleUseSamplePDF}
            setPreviewDoc={setPreviewDoc}
            uploadError={uploadError}
          />

          {/* 7. PENGATURAN NOTIFIKASI & PENGINGAT EXPIRED */}
          <DocFormNotifSection
            effectiveReminder={effectiveReminder}
            formData={formData}
            manualAmount={manualAmount}
            manualCustomDate={manualCustomDate}
            manualUnit={manualUnit}
            reminderMode={reminderMode}
            setFormData={setFormData}
            setManualAmount={setManualAmount}
            setManualCustomDate={setManualCustomDate}
            setManualUnit={setManualUnit}
            setReminderMode={setReminderMode}
            updateReminderChannel={updateReminderChannel}
          />

          {/* Action Buttons */}
          <DocFormSubmitBar
            isEditing={isEditing}
            onClose={onClose}
            setFormStep={setFormStep}
          />
        </form>
      </div>
    )}
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <DocumentPreviewModal
          document={previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </div>
  );
};
