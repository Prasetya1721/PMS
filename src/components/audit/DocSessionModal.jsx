import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Building2,
  ShieldCheck,
  Calendar,
  Clock,
  User,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileText,
  X,
  Save,
  Trash2,
  Sparkles,
  Maximize2,
  Minimize2,
  MapPin,
  CheckSquare,
  Briefcase
} from 'lucide-react';
import {
  EXTERNAL_AUDIT_ORGANIZATIONS,
  BKI_DOC_CHECKLIST_TEMPLATE,
  normalizeChecklistItem
} from '../../data/auditMasterData';

const getStandardBkiDocChecklist = () => {
  return (BKI_DOC_CHECKLIST_TEMPLATE.items || []).map(normalizeChecklistItem).map(item => {
    const norm = normalizeChecklistItem(item);
    return {
      ...norm,
      result: '',
      notes: '',
      isManual: false,
      isStrikethrough: Boolean(norm.isStrikethrough),
      evidence: null
    };
  });
};

const DOC_DEPARTMENT_OPTIONS = [
  'Divisi DPA, QHSE & Operasional Armada Darat',
  'Divisi HR, Crewing & Ketenagakerjaan Pelaut',
  'Divisi Logistik, Purchasing & Suku Cadang Kapal',
  'Divisi Teknis & Pemeliharaan Armada (Superintendent)',
  'Direksi & Manajemen Puncak PT. PBK',
  'Seluruh Divisi Darat PT. Pelayaran Baharimas Kalimantan'
];

export const DocSessionModal = ({ session, onClose, onSaved }) => {
  const {
    addAuditSession,
    updateAuditSession,
    deleteAuditSession,
    showToast
  } = usePMS();

  const isEdit = Boolean(session);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Audit Type: Internal vs External
  const [auditType, setAuditType] = useState(session?.auditType || 'Internal');

  // External Organization
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

  // DOC-specific meta
  const [docDepartment, setDocDepartment] = useState(
    session?.docDepartment || 'Divisi DPA, QHSE & Operasional Armada Darat'
  );
  const [docCertificateNo, setDocCertificateNo] = useState(
    session?.docCertificateNo || `DOC-IDN-PBK/${new Date().getFullYear()}-R1`
  );

  // Identity & Registration
  const [auditNo, setAuditNo] = useState(() => {
    if (session?.auditNo) return session.auditNo;
    const year = new Date().getFullYear();
    const rand = Math.floor(Math.random() * 900 + 100);
    return `AUD-${(session?.auditType || 'Internal') === 'Internal' ? 'INT' : 'EXT'}-DOC-${year}/${rand}`;
  });

  const [reportId, setReportId] = useState(() => {
    if (session?.reportId) return session.reportId;
    return '0858-PK/ISM-DOC/2026';
  });

  const [status, setStatus] = useState(session?.status || 'In Progress');

  // Tim & Auditee Darat
  const [leadAuditor, setLeadAuditor] = useState(session?.leadAuditor || 'Auditor Senior DPA/QHSE Baharimas');
  const [auditTeam, setAuditTeam] = useState(
    session?.auditTeam ? (Array.isArray(session.auditTeam) ? session.auditTeam.join(', ') : session.auditTeam) : 'Tim Inspeksi Keselamatan Darat PBK'
  );
  const [auditee, setAuditee] = useState(
    session?.auditee || 'Direktur Operasional, DPA & Para Manager Darat PT. PBK'
  );
  const [auditLocation, setAuditLocation] = useState(
    session?.auditLocation || 'Kantor Pusat PT. Pelayaran Baharimas Kalimantan (Pontianak)'
  );

  // Jadwal & Ruang Lingkup
  const [auditDate, setAuditDate] = useState(session?.auditDate || new Date().toISOString().split('T')[0]);
  const [targetCloseDate, setTargetCloseDate] = useState(
    session?.targetCloseDate ||
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [scope, setScope] = useState(() => {
    if (session?.scope) return session.scope;
    return 'Audit Kepatuhan Tahunan Sistem Manajemen Keselamatan Darat (DOC) PT. Pelayaran Baharimas Kalimantan mencakup 13 Seksi BKI DOC Rev 06 / ISM Code 2025.';
  });

  // Interactive Checklist initialization (Pure 13 sections DOC)
  const [checklist, setChecklist] = useState(() => {
    if (session?.checklist && session.checklist.length > 0) {
      return session.checklist;
    }
    return getStandardBkiDocChecklist();
  });

  // Switch Jenis Audit (Internal vs Eksternal)
  const applyAuditTypeSwitch = (newAuditType) => {
    setAuditType(newAuditType);
    const year = new Date().getFullYear();
    const rand = Math.floor(Math.random() * 900 + 100);
    const prefix = newAuditType === 'Internal' ? 'INT' : 'EXT';

    if (!isEdit) {
      setAuditNo(`AUD-${prefix}-DOC-${year}/${rand}`);
    }

    if (newAuditType === 'Internal') {
      const intOrg = 'PT. Pelayaran Baharimas Kalimantan (Internal DPA / QHSE)';
      setExternalOrganization(intOrg);
      if (!isEdit && !leadAuditor) setLeadAuditor('Auditor Senior DPA/QHSE Baharimas');
      showToast('✓ Mode Audit Internal DOC Kantor PBK (Standar BKI Rev 06 diadopsi)', 'info');
    } else {
      const extOrg = 'Biro Klasifikasi Indonesia (BKI)';
      setExternalOrganization(extOrg);
      if (!isEdit) setLeadAuditor('Surveyor BKI Cabang Pontianak (Auditor Eksternal ISM Hubla)');
      showToast('✓ Mode Audit Eksternal DOC Kantor (BKI / Ditjen Hubla)', 'info');
    }
  };

  // Demo Preset: DOC Kantor Pusat
  const applyDemoPreset = () => {
    setAuditType('External');
    setExternalOrganization('Biro Klasifikasi Indonesia (BKI)');
    setDocCertificateNo('DOC-IDN-PBK/2025-R1');
    setAuditNo('AUD-EXT-DOC-2026/01');
    setReportId('0858-PK/ISM-DOC/2026');
    setLeadAuditor('Capt. Marine Safety Inspector BKI');
    setAuditTeam('Surveyor Madya BKI, Inspektur Keselamatan Hubla');
    setAuditee('Direktur Utama, Direktur Operasional & DPA PT. Pelayaran Baharimas Kalimantan');
    setAuditLocation('Kantor Pusat PT. Pelayaran Baharimas Kalimantan, Jl. Adisucipto Km 6.3 Pontianak');
    setAuditDate(new Date().toISOString().split('T')[0]);
    setTargetCloseDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setScope('Audit Kepatuhan Tahunan Sistem Manajemen Keselamatan Darat (DOC) PT. Pelayaran Baharimas Kalimantan mencakup 13 Seksi BKI DOC Rev 06 / ISM Code 2025.');
    showToast('✓ Contoh data sesi audit DOC Kantor berhasil dimuat!', 'success');
  };

  // Save handler
  const handleSave = (e) => {
    if (e) e.preventDefault();

    if (!auditNo.trim()) {
      showToast('Nomor registrasi audit wajib diisi!', 'warning');
      return;
    }

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
      standard: 'DOC',
      targetType: 'Office',
      targetName: 'Kantor Pusat PT. Pelayaran Baharimas Kalimantan (Pontianak)',
      vesselId: null,
      docDepartment: docDepartment.trim(),
      docCertificateNo: docCertificateNo.trim(),
      smcCertificateNo: null,
      leadAuditor: leadAuditor.trim(),
      auditTeam: teamArray.length > 0 ? teamArray : ['Tim Inspeksi Keselamatan Darat'],
      auditee: auditee.trim(),
      auditLocation: auditLocation.trim(),
      auditDate,
      targetCloseDate,
      scope: scope.trim(),
      status,
      checklist,
      totalItemsChecked: checklist.length,
      itemsComplied: checklist.filter(c => c.result === 'Complied' || c.result === 'Yes').length,
      updatedAt: new Date().toISOString()
    };

    let savedSession = null;
    if (isEdit) {
      updateAuditSession(session.id, payload);
      savedSession = { ...session, ...payload };
      showToast('✓ Sesi audit DOC berhasil diperbarui!', 'success');
    } else {
      const created = addAuditSession(payload);
      savedSession = created || { id: `aud-doc-${Date.now()}`, ...payload };
      showToast(`✓ Sesi audit DOC ${payload.auditNo} siap! Beralih ke Tahap 2: 13 Seksi BKI DOC.`, 'success');
    }

    if (onSaved) {
      onSaved(savedSession);
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div
        className={isFullscreen ? 'modal-fullscreen' : 'glass-card'}
        style={{
          width: isFullscreen ? '100vw' : '100%',
          maxWidth: isFullscreen ? '100vw' : '1040px',
          maxHeight: isFullscreen ? '100vh' : '92vh',
          height: isFullscreen ? '100vh' : 'auto',
          background: 'var(--bg-surface-card)',
          borderRadius: isFullscreen ? 0 : '14px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* MODAL HEADER */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-surface-elevated)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building2 size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  {isEdit ? 'Edit Sesi Audit DOC Kantor Perusahaan' : 'Formulir Sesi Audit DOC Kantor Perusahaan (Document of Compliance)'}
                </h3>
                <span className="badge badge-warning" style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                  🏢 STANDAR DOC KANTOR
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Tahap 1: Inisiasi data kantor pusat PT. PBK, sertifikat DOC, departemen darat, dan jadwal pemeriksaan BKI Rev 06 (13 Seksi).
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.4rem', borderRadius: '6px' }}
              title={isFullscreen ? 'Kecilkan' : 'Perbesar Layar Penuh'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.4rem', borderRadius: '6px' }}
              title="Tutup Formulir"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* COMPACT CONFIGURATION BAR */}
        <div style={{
          padding: '0.55rem 1.25rem',
          background: 'rgba(245, 158, 11, 0.05)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.6rem'
        }}>
          {/* Jenis Audit Switch */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              Jenis Audit:
            </span>
            <div style={{ display: 'inline-flex', background: 'var(--bg-surface)', padding: '2px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                onClick={() => applyAuditTypeSwitch('Internal')}
                style={{
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.74rem',
                  fontWeight: auditType === 'Internal' ? 800 : 500,
                  borderRadius: '4px',
                  border: 'none',
                  background: auditType === 'Internal' ? 'var(--primary)' : 'transparent',
                  color: auditType === 'Internal' ? '#ffffff' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                🏢 Internal DPA/QHSE
              </button>
              <button
                type="button"
                onClick={() => applyAuditTypeSwitch('External')}
                style={{
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.74rem',
                  fontWeight: auditType === 'External' ? 800 : 500,
                  borderRadius: '4px',
                  border: 'none',
                  background: auditType === 'External' ? '#f59e0b' : 'transparent',
                  color: auditType === 'External' ? '#ffffff' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                🏛️ Eksternal (BKI / Ditjen Hubla)
              </button>
            </div>

            {auditType === 'External' && (
              <select
                value={externalOrganization}
                onChange={(e) => setExternalOrganization(e.target.value)}
                className="form-control"
                style={{ fontSize: '0.74rem', padding: '0.25rem 0.5rem', height: 'auto', minWidth: '190px' }}
              >
                {EXTERNAL_AUDIT_ORGANIZATIONS.map(org => (
                  <option key={org.id} value={org.name}>{org.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Quick Demo Preset */}
          {!isEdit && (
            <button
              type="button"
              onClick={applyDemoPreset}
              className="btn btn-secondary btn-sm"
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.25rem 0.6rem',
                color: '#d97706',
                borderColor: 'rgba(245, 158, 11, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title="Muat data contoh audit resmi DOC Kantor PT. PBK"
            >
              <Sparkles size={13} color="#d97706" />
              <span>Contoh DOC Kantor</span>
            </button>
          )}
        </div>

        {/* MODAL BODY (FORM GRID 2-KOLOM DEDIKASI DOC) */}
        <form onSubmit={handleSave} style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* PETUNJUK KHUSUS AUDIT DOC KANTOR PUSAT */}
          <div style={{
            padding: '0.8rem 1rem',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.02) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#f59e0b',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '1px'
            }}>
              <Building2 size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <strong style={{ fontSize: '0.82rem', color: '#d97706' }}>
                  PETUNJUK PELAKSANAAN AUDIT DOC (DOCUMENT OF COMPLIANCE - KANTOR PUSAT)
                </strong>
                <span className="badge badge-warning" style={{ fontSize: '0.62rem' }}>BKI Rev 06 (13 Seksi)</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-main)', marginTop: '0.35rem', lineHeight: '1.5' }}>
                <div>• <strong>Fokus Pengujian:</strong> Tata kelola SMS darat PT. PBK, kebijakan keselamatan & lingkungan, kualifikasi & rekrutmen kru kapal (HR/Crewing), dukungan pemeliharaan teknis armada, sistem logistik suku cadang kritis, kesiapan Tim Tanggap Darurat Kantor (ERT), dan Rapat Tinjauan Manajemen (Management Review).</div>
                <div>• <strong>Auditee Darat:</strong> Jajaran Direksi, DPA (Designated Person Ashore), Superintendent Teknis, Kepala Departemen HR/Crewing, Logistik & Pengadaan, serta HSSE.</div>
                <div>• <strong>Hasil Sesi Tahap 1:</strong> Penetapan nomor registrasi audit DOC kantor pusat, pengesahan tim auditor independen, dan pemasangan otomatis 13 Seksi ISM Code resmi BKI F23.14.05 Rev 06.</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>

            {/* KOLOM 1: KANTOR PERUSAHAAN & LEGALITAS DOC */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="glass-card" style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building2 size={15} />
                  <span>1. Kantor Pusat Perusahaan & Sertifikat DOC</span>
                </div>

                {/* Info Kantor Pusat PBK */}
                <div style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  marginBottom: '0.85rem'
                }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 900, color: 'var(--text-main)' }}>
                    PT. PELAYARAN BAHARIMAS KALIMANTAN (KANTOR PUSAT)
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    JL. Adisucipto Km 6.30 RT.04 RW.04 Desa Sungai Raya, Pontianak - Kalimantan Barat
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', color: '#b45309', fontWeight: 700, marginTop: '4px' }}>
                    <span>IMO Perusahaan: 9049645</span>
                    <span>Tipe Sertifikasi: DOC (Document of Compliance)</span>
                  </div>
                </div>

                {/* Divisi / Departemen Darat */}
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontSize: '0.76rem', fontWeight: 700 }}>
                    Divisi / Departemen yang Diaudit <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={docDepartment}
                    onChange={(e) => setDocDepartment(e.target.value)}
                    className="form-control"
                    style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}
                  >
                    {DOC_DEPARTMENT_OPTIONS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={docDepartment}
                    onChange={(e) => setDocDepartment(e.target.value)}
                    placeholder="Atau ketik divisi spesifik..."
                    className="form-control"
                    style={{ fontSize: '0.78rem' }}
                    required
                  />
                </div>

                {/* Nomor Sertifikat DOC Perusahaan */}
                <div className="form-group" style={{ marginBottom: '0.25rem' }}>
                  <label className="form-label" style={{ fontSize: '0.76rem', fontWeight: 700 }}>
                    No. Sertifikat DOC Perusahaan (Document of Compliance) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={docCertificateNo}
                    onChange={(e) => setDocCertificateNo(e.target.value)}
                    placeholder="Contoh: DOC-IDN-PBK/2024-R1"
                    className="form-control"
                    style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0369a1' }}
                    required
                  />
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                    Sertifikat resmi izin pengoperasian armada kapal yang diterbitkan oleh Flag State / RO.
                  </span>
                </div>
              </div>

              {/* Registrasi & Legalitas Audit DOC */}
              <div className="glass-card" style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={15} color="#10b981" />
                  <span>2. Penomoran & Status Sesi Audit DOC</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '0.75rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                      No. Registrasi Audit <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={auditNo}
                      onChange={(e) => setAuditNo(e.target.value)}
                      className="form-control"
                      style={{ fontSize: '0.8rem', fontWeight: 700 }}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                      No. Laporan BKI (Report ID) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={reportId}
                      onChange={(e) => setReportId(e.target.value)}
                      placeholder="0858-PK/ISM-DOC/2026"
                      className="form-control"
                      style={{ fontSize: '0.8rem', fontWeight: 700 }}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                    Status Pelaksanaan Sesi
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="form-control"
                    style={{ fontSize: '0.8rem', fontWeight: 700 }}
                  >
                    <option value="In Progress">Sedang Berjalan (In Progress)</option>
                    <option value="Scheduled">Terjadwal (Scheduled)</option>
                    <option value="Completed">Selesai & Tertutup (Completed)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* KOLOM 2: PERSONIL AUDIT KANTOR & JADWAL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="glass-card" style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Users size={15} color="#0284c7" />
                  <span>3. Personil Auditor & Auditee Manajemen Darat</span>
                </div>

                <div className="form-group" style={{ marginBottom: '0.65rem' }}>
                  <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                    Lead Auditor (Auditor Kepala DOC) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={leadAuditor}
                    onChange={(e) => setLeadAuditor(e.target.value)}
                    placeholder="Nama Lead Auditor DOC resmi"
                    className="form-control"
                    style={{ fontSize: '0.8rem' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0.65rem' }}>
                  <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                    Tim Auditor Pendamping
                  </label>
                  <input
                    type="text"
                    value={auditTeam}
                    onChange={(e) => setAuditTeam(e.target.value)}
                    placeholder="Pisahkan dengan koma jika lebih dari satu"
                    className="form-control"
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0.65rem' }}>
                  <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                    Auditee Darat (Pihak Manajemen yang Diaudit) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={auditee}
                    onChange={(e) => setAuditee(e.target.value)}
                    placeholder="Contoh: Direktur Operasional, DPA & Para Manager Darat"
                    className="form-control"
                    style={{ fontSize: '0.8rem' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                    Lokasi Fisik Audit Kantor <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={auditLocation}
                    onChange={(e) => setAuditLocation(e.target.value)}
                    placeholder="Contoh: Kantor Pusat PT. Pelayaran Baharimas Kalimantan (Pontianak)"
                    className="form-control"
                    style={{ fontSize: '0.8rem' }}
                    required
                  />
                </div>
              </div>

              {/* Jadwal & Ruang Lingkup DOC */}
              <div className="glass-card" style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={15} color="#6366f1" />
                  <span>4. Jadwal & Ruang Lingkup Audit DOC</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '0.75rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                      Tanggal Audit <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="date"
                      value={auditDate}
                      onChange={(e) => setAuditDate(e.target.value)}
                      className="form-control"
                      style={{ fontSize: '0.8rem' }}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                      Target Due Date (Batas CAPA) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="date"
                      value={targetCloseDate}
                      onChange={(e) => setTargetCloseDate(e.target.value)}
                      className="form-control"
                      style={{ fontSize: '0.8rem' }}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700, margin: 0 }}>
                      Ruang Lingkup Pemeriksaan Kantor (Audit Scope)
                    </label>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button
                        type="button"
                        onClick={() => setScope('Audit Kepatuhan Tahunan Sistem Manajemen Keselamatan Darat (DOC) PT. Pelayaran Baharimas Kalimantan mencakup 13 Seksi BKI DOC Rev 06 / ISM Code 2025.')}
                        style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}
                      >
                        Tahunan
                      </button>
                      <button
                        type="button"
                        onClick={() => setScope('Audit Pembaruan (Renewal DOC) Sistem Manajemen Keselamatan Darat PT. Pelayaran Baharimas Kalimantan sesuai ketentuan SOLAS 1974 Bab IX dan ISM Code.')}
                        style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}
                      >
                        Pembaruan
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    rows={2}
                    className="form-control"
                    style={{ fontSize: '0.78rem', resize: 'vertical' }}
                    required
                  />
                </div>
              </div>
            </div>

          </div>

          {/* CHECKLIST PREVIEW BANNER */}
          <div style={{
            marginTop: '1.25rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckSquare size={18} color="#d97706" />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Checklist Kepatuhan Kantor DOC BKI Siap Diperiksa ({checklist.length} Seksi Terintegrasi)
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Mengadopsi standar resmi BKI F23.14.05-2025 Rev 06 mencakup Kebijakan Keselamatan, Wewenang DPA, Kesiapan Darurat, Pemeliharaan & Review Manajemen.
                </div>
              </div>
            </div>
            <span className="badge badge-warning" style={{ fontSize: '0.72rem', fontWeight: 800 }}>
              ✓ 13 Seksi DOC Terpasang
            </span>
          </div>
        </form>

        {/* MODAL FOOTER */}
        <div style={{
          padding: '0.85rem 1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface-elevated)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div>
            {isEdit && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="btn btn-secondary btn-sm"
                style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Trash2 size={14} />
                <span>Hapus Sesi DOC</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ fontWeight: 600, padding: '0.5rem 1.15rem' }}
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn btn-primary btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 800,
                padding: '0.5rem 1.35rem',
                background: '#d97706',
                borderColor: '#b45309',
                boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)'
              }}
            >
              <Save size={15} />
              <span>{isEdit ? 'Simpan Perubahan DOC' : 'Simpan & Buka 13 Seksi DOC (Tahap 2)'}</span>
            </button>
          </div>
        </div>

        {/* MODAL KONFIRMASI HAPUS SESI */}
        {showDeleteConfirm && (
          <div className="modal-overlay" style={{ zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div className="glass-card" style={{ maxWidth: '420px', padding: '1.5rem', textAlign: 'center', background: 'var(--bg-surface-card)', borderRadius: '12px' }}>
              <AlertTriangle size={42} color="#ef4444" style={{ margin: '0 auto 0.75rem' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
                Hapus Sesi Audit DOC Ini?
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Sesi audit DOC <strong>{auditNo}</strong> untuk Kantor Pusat PT. PBK akan dihapus permanen dari sistem.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteAuditSession(session.id);
                    showToast('Sesi audit DOC berhasil dihapus', 'info');
                    setShowDeleteConfirm(false);
                    onClose();
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ background: '#ef4444', borderColor: '#ef4444' }}
                >
                  Ya, Hapus Sesi
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
