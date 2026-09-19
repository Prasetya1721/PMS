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
  Plus
} from 'lucide-react';
import { CERTIFICATE_CATEGORIES, STANDARD_CERTIFICATE_TEMPLATES } from '../../data/shipCertificatesMaster';
import { usePMS } from '../../context/PMSContext';

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

  const [formData, setFormData] = useState({
    vesselId: defaultVesselId || vessels[0]?.id || 'v-001',
    category: 'KSOP',
    name: '',
    documentNo: '',
    issuer: 'Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP)',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    mandatoryAuditor: 'Syahbandar KSOP',
    status: 'Active'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        vesselId: initialData.vesselId || defaultVesselId || vessels[0]?.id || 'v-001',
        category: initialData.category || 'KSOP',
        name: initialData.name || '',
        documentNo: initialData.documentNo || initialData.certificateNo || '',
        issuer: initialData.issuer || '',
        issueDate: initialData.issueDate || new Date().toISOString().split('T')[0],
        expiryDate: initialData.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        mandatoryAuditor: initialData.mandatoryAuditor || '',
        status: initialData.status || 'Active'
      });
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
        status: 'Active'
      });
    }
  }, [initialData, defaultVesselId, vessels]);

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

    setFormData(prev => ({
      ...prev,
      category: tmpl.category,
      name: tmpl.name,
      documentNo: `${tmpl.docPrefix}-${reg}-${exp.getFullYear()}`,
      issuer,
      issueDate: issueStr,
      expiryDate: expStr,
      mandatoryAuditor: tmpl.category === 'KSOP' ? `Syahbandar KSOP ${port}` : tmpl.category === 'Kesehatan' ? `Petugas Sanitasi KKP ${port}` : `Surveyor ${tmpl.category}`
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSave(formData);
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
