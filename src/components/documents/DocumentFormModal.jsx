import React, { useState, useEffect } from 'react';
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
  Clock
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

export const DocumentFormModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  vessels = [],
  defaultVesselId = null
}) => {
  if (!isOpen) return null;

  const { certificateCategories: contextCategories, addCertificateCategory } = usePMS();
  const activeCategories = contextCategories && contextCategories.length > 0 ? contextCategories : CERTIFICATE_CATEGORIES;

  const isEditing = !!initialData?.id;
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isAddingNewCat, setIsAddingNewCat] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Simplified notification state (dropdown + manual input)
  const [reminderMode, setReminderMode] = useState('1m');
  const [manualAmount, setManualAmount] = useState(30);
  const [manualUnit, setManualUnit] = useState('day');
  const [manualCustomDate, setManualCustomDate] = useState('');

  const [formData, setFormData] = useState({
    vesselId: defaultVesselId || vessels[0]?.id || 'v-001',
    category: 'KSOP',
    name: '',
    documentNo: '',
    issuer: 'Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP)',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    mandatoryAuditor: 'Syahbandar KSOP',
    status: 'Active',
    notificationReminders: DEFAULT_REMINDERS
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
        notificationReminders: existingReminders
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
        vesselId: defaultVesselId || vessels[0]?.id || 'v-001',
        category: 'KSOP',
        name: '',
        documentNo: '',
        issuer: 'Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP)',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        mandatoryAuditor: 'Syahbandar KSOP',
        status: 'Active',
        notificationReminders: DEFAULT_REMINDERS
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

  const handleTemplateSelect = (tmpl) => {
    const selectedVessel = vessels.find(v => v.id === formData.vesselId);
    const port = selectedVessel?.portOfRegistry?.split(',')[0] || 'Samarinda';
    const reg = selectedVessel?.regNo || 'REG';
    const now = new Date();
    const issueStr = now.toISOString().split('T')[0];

    const exp = new Date();
    exp.setFullYear(exp.getFullYear() + tmpl.defaultValidityYears);
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

    setFormData(prev => ({
      ...prev,
      category: tmpl.category,
      name: tmpl.name,
      documentNo: `${tmpl.docPrefix}-${reg}-${exp.getFullYear()}`,
      issuer,
      issueDate: issueStr,
      expiryDate: expStr,
      mandatoryAuditor: tmpl.category === 'KSOP' ? `Syahbandar KSOP ${port}` : tmpl.category === 'Kesehatan' ? `Petugas Sanitasi KKP ${port}` : `Surveyor ${tmpl.category}`,
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
    let defaultAuditor = 'Syahbandar KSOP';

    if (newCat === 'BKI') {
      defaultIssuer = 'Biro Klasifikasi Indonesia (BKI)';
      defaultAuditor = 'Surveyor BKI Cabang';
    } else if (newCat === 'Statutory') {
      defaultIssuer = 'Direktorat Jenderal Perhubungan Laut / BKI Statutory';
      defaultAuditor = 'Marine Inspector Ditjen Hubla';
    } else if (newCat === 'Asuransi') {
      defaultIssuer = 'PT. Asuransi Jasa Indonesia (Jasindo) / P&I Club';
      defaultAuditor = 'Underwriter Asuransi Maritim';
    } else if (newCat === 'Kesehatan') {
      defaultIssuer = 'Balai Karantina Kesehatan / KKP Kelas II';
      defaultAuditor = 'Petugas Pengawas Sanitasi KKP';
    }

    setFormData(prev => ({
      ...prev,
      category: newCat,
      issuer: defaultIssuer,
      mandatoryAuditor: defaultAuditor
    }));
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
      background: 'rgba(2, 6, 23, 0.82)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '1.25rem'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '750px',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '16px',
        border: `1px solid ${selectedCategoryMeta.borderColor || 'rgba(56, 189, 248, 0.35)'}`,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
        padding: '1.75rem 2rem'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: selectedCategoryMeta.bgColor,
              border: `1px solid ${selectedCategoryMeta.borderColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: selectedCategoryMeta.color
            }}>
              <FileText size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {isEditing ? `Edit Dokumen: ${formData.name}` : 'Tambah Dokumen / Sertifikat Baru'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Kategori Maritim: <strong>BKI, Statutory, Asuransi, KSOP, Kesehatan</strong>
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
          {/* Quick Template Picker (Dropdown) */}
          {!isEditing && (
            <div style={{
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>⚡ Pilih Cepat Dokumen Resmi (Daftar Standar KSOP / BKI / Statutory / Kesehatan):</span>
              </label>
              <select
                className="select-control"
                value={selectedTemplate}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedTemplate(val);
                  if (val && val !== 'MANUAL') {
                    const tmpl = STANDARD_CERTIFICATE_TEMPLATES.find(t => t.name === val);
                    if (tmpl) handleTemplateSelect(tmpl);
                  }
                }}
                style={{ background: 'var(--bg-surface)', fontWeight: 600 }}
              >
                <option value="">-- Klik untuk Pilih dari Checklist Standar (19+ Sertifikat Maritim) --</option>
                <optgroup label="📋 DOKUMEN KSOP (Checklist Standar Kesyahbandaran)">
                  {STANDARD_CERTIFICATE_TEMPLATES.filter(t => t.category === 'KSOP').map(t => (
                    <option key={t.name} value={t.name}>📋 {t.name} (KSOP)</option>
                  ))}
                </optgroup>
                <optgroup label="⚓ SERTIFIKAT KLASIFIKASI BKI">
                  {STANDARD_CERTIFICATE_TEMPLATES.filter(t => t.category === 'BKI').map(t => (
                    <option key={t.name} value={t.name}>⚓ {t.name} (BKI)</option>
                  ))}
                </optgroup>
                <optgroup label="🛡️ STATUTORY CERTIFICATES (KESELAMATAN & POLUSI)">
                  {STANDARD_CERTIFICATE_TEMPLATES.filter(t => t.category === 'Statutory').map(t => (
                    <option key={t.name} value={t.name}>🛡️ {t.name} (Statutory)</option>
                  ))}
                </optgroup>
                <optgroup label="⚖️ ASURANSI & CLC BUNKER / WRECK REMOVAL">
                  {STANDARD_CERTIFICATE_TEMPLATES.filter(t => t.category === 'Asuransi').map(t => (
                    <option key={t.name} value={t.name}>⚖️ {t.name} (Asuransi)</option>
                  ))}
                </optgroup>
                <optgroup label="🏥 SANITASI & KESEHATAN KAPAL (KKP)">
                  {STANDARD_CERTIFICATE_TEMPLATES.filter(t => t.category === 'Kesehatan').map(t => (
                    <option key={t.name} value={t.name}>🏥 {t.name} (Kesehatan)</option>
                  ))}
                </optgroup>
                <option value="MANUAL">✍️ Dokumen Lainnya (Input Bebas / Manual)</option>
              </select>
            </div>
          )}

          {/* Vessel & Category Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
            <div>
              <label className="field-label">Kapal Terkait *</label>
              <select
                value={formData.vesselId}
                onChange={(e) => setFormData(prev => ({ ...prev, vesselId: e.target.value }))}
                className="select-control"
                required
              >
                <optgroup label="⚓ AS OWNER (17 Kapal Milik)">
                  {vessels.filter(v => !v.id.startsWith('v-op-') && v.ownershipStatus !== 'As Operator').map(v => (
                    <option key={v.id} value={v.id}>🚢 {v.name} [Owner]</option>
                  ))}
                </optgroup>
                <optgroup label="⚙️ AS OPERATOR (11 Kapal Operasional)">
                  {vessels.filter(v => v.id.startsWith('v-op-') || v.ownershipStatus === 'As Operator').map(v => (
                    <option key={v.id} value={v.id}>⚙️ {v.name} [Operator]</option>
                  ))}
                </optgroup>
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
                  required
                >
                  <optgroup label="Kategori Standar & Tersedia">
                    {activeCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
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
                      placeholder="Ketik kategori baru (contoh: Bea Cukai / Komersial)"
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
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    Kategori baru akan otomatis tersimpan & muncul di semua filter.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Name & Document No */}
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

          {/* DATES: Tanggal Penerbitan & Tanggal Expired (Crucial User Requirement) */}
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

          {/* PENGATURAN NOTIFIKASI & PENGINGAT EXPIRED (LEBIH SIMPLE DROPDOWN + MANUAL) */}
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

          {/* Issuer & Auditor */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
            <div>
              <label className="field-label">Instansi Penerbit (Issuer) *</label>
              <input
                type="text"
                required
                placeholder="Contoh: KSOP Kelas II Samarinda / BKI"
                value={formData.issuer}
                onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
                className="input-control"
              />
            </div>

            <div>
              <label className="field-label">Petugas / Auditor / Syahbandar</label>
              <input
                type="text"
                placeholder="Contoh: Syahbandar KSOP / Surveyor BKI"
                value={formData.mandatoryAuditor}
                onChange={(e) => setFormData(prev => ({ ...prev, mandatoryAuditor: e.target.value }))}
                className="input-control"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '0.5rem',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.25rem'
          }}>
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
        </form>
      </div>
    </div>
  );
};
