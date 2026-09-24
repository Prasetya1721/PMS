import React, { useState, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Ship,
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
  Building2,
  MapPin,
  CheckSquare
} from 'lucide-react';
import {
  EXTERNAL_AUDIT_ORGANIZATIONS,
  BKI_SMC_CHECKLIST_TEMPLATE,
  normalizeChecklistItem
} from '../../data/auditMasterData';

const getStandardBkiSmcChecklist = () => {
  return (BKI_SMC_CHECKLIST_TEMPLATE.items || []).map(normalizeChecklistItem).map(item => {
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

export const SmcSessionModal = ({ session, onClose, defaultVesselId, onSaved }) => {
  const {
    vessels,
    selectedVesselId,
    addAuditSession,
    updateAuditSession,
    deleteAuditSession,
    showToast
  } = usePMS();

  const isEdit = Boolean(session);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Target Vessel initialization
  const initialVesselId = session?.vesselId || (defaultVesselId && defaultVesselId !== 'office' ? defaultVesselId : (selectedVesselId && selectedVesselId !== 'all' ? selectedVesselId : vessels[0]?.id || ''));
  const [vesselId, setVesselId] = useState(initialVesselId);

  // Sync vessel object
  const currentSelectedVessel = useMemo(() => {
    return vessels.find(v => v.id === vesselId) || vessels[0];
  }, [vessels, vesselId]);

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

  // SMC Certificate No
  const [smcCertificateNo, setSmcCertificateNo] = useState(() => {
    if (session?.smcCertificateNo) return session.smcCertificateNo;
    const vName = currentSelectedVessel?.name || 'RP2004';
    return `SMC-TB-${vName.replace(/\s+/g, '')}/${new Date().getFullYear()}`;
  });

  // Update certificate when vessel changes
  const handleVesselChange = (newVesselId) => {
    setVesselId(newVesselId);
    const newVessel = vessels.find(v => v.id === newVesselId);
    if (newVessel) {
      if (!isEdit) {
        setSmcCertificateNo(`SMC-TB-${(newVessel.name || 'ARMADA').replace(/\s+/g, '')}/${new Date().getFullYear()}`);
        setAuditee(`Capt. ${newVessel.masterCaptain || 'Nakhoda'} & KKM ${newVessel.chiefEngineer || 'KKM'} (${newVessel.name})`);
        setAuditLocation(`Onboard ${newVessel.name} (Pelabuhan Dwikora / Dermaga PBK)`);
        setScope(`Audit Kelaikan Sistem Manajemen Keselamatan (SMC) Kapal ${newVessel.name} Onboard sesuai IMO Res. A.741(18) / ISM Code klausul 1 s.d. 12 dan BKI SMS Shipboard Checklist Rev 05 (74 Klausul Pemeriksaan).`);
      }
    }
  };

  // Identity & Registration
  const [auditNo, setAuditNo] = useState(() => {
    if (session?.auditNo) return session.auditNo;
    const year = new Date().getFullYear();
    const rand = Math.floor(Math.random() * 900 + 100);
    return `AUD-${(session?.auditType || 'Internal') === 'Internal' ? 'INT' : 'EXT'}-SMC-${year}/${rand}`;
  });

  const [reportId, setReportId] = useState(() => {
    if (session?.reportId) return session.reportId;
    return '0859-PK/ISM-SMC/2026';
  });

  const [status, setStatus] = useState(session?.status || 'In Progress');

  // Tim & Auditee Onboard
  const [leadAuditor, setLeadAuditor] = useState(session?.leadAuditor || 'Capt. Marine Safety Inspector (Lead Auditor)');
  const [auditTeam, setAuditTeam] = useState(
    session?.auditTeam ? (Array.isArray(session.auditTeam) ? session.auditTeam.join(', ') : session.auditTeam) : 'Dian Anggraini (Safety Officer), Heri Prasetyo (Marine Superintendent)'
  );
  const [auditee, setAuditee] = useState(
    session?.auditee || `Capt. ${currentSelectedVessel?.masterCaptain || 'Ekhsan (Nakhoda)'} & KKM ${currentSelectedVessel?.chiefEngineer || 'Chief Engineer'}`
  );
  const [auditLocation, setAuditLocation] = useState(
    session?.auditLocation || `Onboard ${currentSelectedVessel?.name || 'Kapal Armada'} (Dermaga Pontianak)`
  );

  // Jadwal & Ruang Lingkup
  const [auditDate, setAuditDate] = useState(session?.auditDate || new Date().toISOString().split('T')[0]);
  const [targetCloseDate, setTargetCloseDate] = useState(
    session?.targetCloseDate ||
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [scope, setScope] = useState(() => {
    if (session?.scope) return session.scope;
    return `Audit Kelaikan Sistem Manajemen Keselamatan (SMC) Kapal ${currentSelectedVessel?.name || 'Armada'} Onboard sesuai IMO Res. A.741(18) / ISM Code klausul 1 s.d. 12 dan BKI SMS Shipboard Checklist Rev 05 (74 Klausul Pemeriksaan).`;
  });

  // Interactive Checklist initialization (Pure 74 items SMC)
  const [checklist, setChecklist] = useState(() => {
    if (session?.checklist && session.checklist.length > 0) {
      return session.checklist;
    }
    return getStandardBkiSmcChecklist();
  });

  // Switch Jenis Audit (Internal vs Eksternal)
  const applyAuditTypeSwitch = (newAuditType) => {
    setAuditType(newAuditType);
    const year = new Date().getFullYear();
    const rand = Math.floor(Math.random() * 900 + 100);
    const prefix = newAuditType === 'Internal' ? 'INT' : 'EXT';

    if (!isEdit) {
      setAuditNo(`AUD-${prefix}-SMC-${year}/${rand}`);
    }

    if (newAuditType === 'Internal') {
      const intOrg = 'PT. Pelayaran Baharimas Kalimantan (Internal DPA / QHSE)';
      setExternalOrganization(intOrg);
      if (!isEdit && !leadAuditor) setLeadAuditor('Auditor Senior DPA/QHSE Baharimas');
      showToast('✓ Mode Audit Internal SMC Baharimas (Standar Resmi BKI diadopsi)', 'info');
    } else {
      const extOrg = 'Biro Klasifikasi Indonesia (BKI)';
      setExternalOrganization(extOrg);
      if (!isEdit) setLeadAuditor('Surveyor BKI Cabang Pontianak (Auditor Eksternal Hubla)');
      showToast('✓ Mode Audit Eksternal SMC Kapal (BKI / Flag State)', 'info');
    }
  };

  // Demo Preset: Kapal TB. RP 2004
  const applyDemoPreset = () => {
    const rp2004 = vessels.find(v => v.name?.includes('2004')) || vessels[0];
    if (rp2004) setVesselId(rp2004.id);
    setAuditType('External');
    setExternalOrganization('Biro Klasifikasi Indonesia (BKI)');
    setSmcCertificateNo('SMC-TB-RP2004/2026');
    setAuditNo('AUD-EXT-SMC-2026/04');
    setReportId('0859-PK/ISM-SMC/2026');
    setLeadAuditor('MUHSON NURROCHMAT S (Surveyor BKI)');
    setAuditTeam('Heri Prasetyo (DPA PT. PBK), Dian Anggraini (Safety Officer)');
    setAuditee('CAPT. EKHSAN (Nakhoda TB. RP 2004) & Chief Engineer');
    setAuditLocation('Onboard TB. RP 2004 (Pelabuhan Dwikora Pontianak)');
    setAuditDate(new Date().toISOString().split('T')[0]);
    setTargetCloseDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setScope('Audit Kelaikan Pembaruan Sistem Manajemen Keselamatan (SMC) Kapal TB. RP 2004 Onboard sesuai IMO Res. A.741(18) / ISM Code klausul 1 s.d. 12 dan BKI SMS Shipboard Checklist Rev 05 (74 Butir).');
    showToast('✓ Contoh data sesi audit SMC TB. RP 2004 berhasil dimuat!', 'success');
  };

  // Save handler
  const handleSave = (e) => {
    if (e) e.preventDefault();

    if (!auditNo.trim()) {
      showToast('Nomor registrasi audit wajib diisi!', 'warning');
      return;
    }

    const selectedVessel = vessels.find(v => v.id === vesselId) || currentSelectedVessel;
    const targetName = selectedVessel?.name || 'Kapal Armada PBK';
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
      standard: 'SMC',
      targetType: 'Vessel',
      targetName,
      vesselId,
      docDepartment: null,
      docCertificateNo: null,
      smcCertificateNo: smcCertificateNo.trim(),
      leadAuditor: leadAuditor.trim(),
      auditTeam: teamArray.length > 0 ? teamArray : ['Tim Inspeksi Keselamatan'],
      auditee: auditee.trim(),
      auditLocation: auditLocation.trim(),
      auditDate,
      targetCloseDate,
      scope: scope.trim(),
      status,
      checklist,
      totalItemsChecked: checklist.length,
      itemsComplied: checklist.filter(c => c.result === 'Complied' || c.result === 'Yes').length,
      imo: selectedVessel?.imo || selectedVessel?.regNo || '-',
      callSign: selectedVessel?.callSign || '-',
      gt: selectedVessel?.gt || '-',
      portOfRegistry: selectedVessel?.portOfRegistry || 'PONTIANAK',
      updatedAt: new Date().toISOString()
    };

    let savedSession = null;
    if (isEdit) {
      updateAuditSession(session.id, payload);
      savedSession = { ...session, ...payload };
      showToast('✓ Sesi audit SMC berhasil diperbarui!', 'success');
    } else {
      const created = addAuditSession(payload);
      savedSession = created || { id: `aud-smc-${Date.now()}`, ...payload };
      showToast(`✓ Sesi audit SMC ${payload.auditNo} siap! Beralih ke Tahap 2: Checklist Klausul.`, 'success');
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
              background: 'rgba(2, 132, 199, 0.15)',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Ship size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  {isEdit ? 'Edit Sesi Audit SMC Kapal' : 'Formulir Sesi Audit SMC Kapal (Shipboard)'}
                </h3>
                <span className="badge badge-primary" style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                  🚢 STANDAR SMC KAPAL
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Tahap 1: Inisiasi data kapal, sertifikat SMC, personil nakhoda/auditor, dan jadwal pemeriksaan BKI Rev 05.
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

        {/* COMPACT CONFIGURATION BAR (TIPE AUDIT & DEMO PRESET) */}
        <div style={{
          padding: '0.55rem 1.25rem',
          background: 'rgba(2, 132, 199, 0.05)',
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
                🏢 Internal PBK
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
                  background: auditType === 'External' ? '#0284c7' : 'transparent',
                  color: auditType === 'External' ? '#ffffff' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                🏛️ Eksternal (BKI / Flag State)
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
                color: '#0284c7',
                borderColor: 'rgba(2, 132, 199, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title="Muat data contoh audit resmi SMC TB. RP 2004"
            >
              <Sparkles size={13} color="#0284c7" />
              <span>Contoh SMC RP 2004</span>
            </button>
          )}
        </div>

        {/* MODAL BODY (FORM GRID 2-KOLOM DEDIKASI SMC) */}
        <form onSubmit={handleSave} style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* PETUNJUK KHUSUS AUDIT SMC KAPAL ARMADA */}
          <div style={{
            padding: '0.8rem 1rem',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(2, 132, 199, 0.02) 100%)',
            border: '1px solid rgba(2, 132, 199, 0.25)',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#0284c7',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '1px'
            }}>
              <Ship size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <strong style={{ fontSize: '0.82rem', color: '#0284c7' }}>
                  PETUNJUK PELAKSANAAN AUDIT SMC (SAFETY MANAGEMENT CERTIFICATE - KAPAL ARMADA)
                </strong>
                <span className="badge badge-primary" style={{ fontSize: '0.62rem' }}>BKI Rev 05 (74 Klausul)</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-main)', marginTop: '0.35rem', lineHeight: '1.5' }}>
                <div>• <strong>Fokus Pengujian:</strong> Kelaiklautan fisik kapal, operasional navigasi di anjungan, kesiapan mesin & generator, uji fungsi alat keselamatan (LSA/FFA), drill darurat awak kapal, dan kesesuaian logbook kapal dengan sistem PMS.</div>
                <div>• <strong>Auditee Onboard:</strong> Nakhoda (Master), KKM (Chief Engineer), dan seluruh awak kapal yang bertugas di atas kapal armada.</div>
                <div>• <strong>Hasil Sesi Tahap 1:</strong> Penetapan nomor registrasi audit kapal, pengesahan Lead Auditor independen, dan pemasangan otomatis 74 butir checklist resmi BKI SMS Shipboard Rev 05.</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>

            {/* KOLOM 1: OBJEK KAPAL ARMADA & LEGALITAS PENOMORAN */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="glass-card" style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Ship size={15} />
                  <span>1. Objek Kapal Armada & Sertifikat SMC</span>
                </div>

                {/* Pilih Kapal Armada */}
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontSize: '0.76rem', fontWeight: 700 }}>
                    Kapal Armada Sasaran Audit <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={vesselId}
                    onChange={(e) => handleVesselChange(e.target.value)}
                    className="form-control"
                    style={{ fontSize: '0.82rem', fontWeight: 700 }}
                    required
                  >
                    {vessels.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.type || 'Tugboat'}) — Port: {v.portOfRegistry || 'Pontianak'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chip Spesifikasi Teknis Kapal */}
                <div style={{
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  background: 'rgba(2, 132, 199, 0.08)',
                  border: '1px solid rgba(2, 132, 199, 0.2)',
                  fontSize: '0.72rem',
                  color: 'var(--text-main)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.4rem',
                  marginBottom: '0.75rem'
                }}>
                  <span><strong>IMO/Reg:</strong> {currentSelectedVessel?.imo || currentSelectedVessel?.regNo || '-'}</span>
                  <span><strong>Call Sign:</strong> {currentSelectedVessel?.callSign || '-'}</span>
                  <span><strong>GT:</strong> {currentSelectedVessel?.gt || '250'}</span>
                  <span><strong>Port:</strong> {currentSelectedVessel?.portOfRegistry || 'PONTIANAK'}</span>
                </div>

                {/* Nomor Sertifikat SMC Kapal */}
                <div className="form-group" style={{ marginBottom: '0.25rem' }}>
                  <label className="form-label" style={{ fontSize: '0.76rem', fontWeight: 700 }}>
                    No. Sertifikat SMC Kapal (Safety Management Certificate) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={smcCertificateNo}
                    onChange={(e) => setSmcCertificateNo(e.target.value)}
                    placeholder="Contoh: SMC-TB-RP2004/2026"
                    className="form-control"
                    style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0284c7' }}
                    required
                  />
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                    Sertifikat resmi kelaiklautan ISM Code kapal yang diverifikasi masa berlakunya.
                  </span>
                </div>
              </div>

              {/* Registrasi & Legalitas Audit */}
              <div className="glass-card" style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={15} color="#10b981" />
                  <span>2. Penomoran & Status Sesi Audit</span>
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
                      placeholder="0859-PK/ISM-SMC/2026"
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

            {/* KOLOM 2: PERSONIL AUDIT ONBOARD & JADWAL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="glass-card" style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Users size={15} color="#f59e0b" />
                  <span>3. Personil Tim Auditor & Nakhoda Kapal</span>
                </div>

                <div className="form-group" style={{ marginBottom: '0.65rem' }}>
                  <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                    Lead Auditor (Auditor Kepala) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={leadAuditor}
                    onChange={(e) => setLeadAuditor(e.target.value)}
                    placeholder="Nama Lead Auditor resmi"
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
                    Auditee (Nakhoda / Chief Engineer yang Diaudit) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={auditee}
                    onChange={(e) => setAuditee(e.target.value)}
                    placeholder="Contoh: Capt. Ekhsan (Nakhoda) & KKM"
                    className="form-control"
                    style={{ fontSize: '0.8rem' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                    Lokasi Fisik Audit Kapal <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={auditLocation}
                    onChange={(e) => setAuditLocation(e.target.value)}
                    placeholder="Contoh: Onboard TB. RP 2004 (Dermaga Pontianak)"
                    className="form-control"
                    style={{ fontSize: '0.8rem' }}
                    required
                  />
                </div>
              </div>

              {/* Jadwal & Ruang Lingkup SMC */}
              <div className="glass-card" style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={15} color="#6366f1" />
                  <span>4. Jadwal & Ruang Lingkup Audit SMC</span>
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
                      Ruang Lingkup Pemeriksaan Kapal (Audit Scope)
                    </label>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button
                        type="button"
                        onClick={() => setScope(`Audit Kelaikan Pembaruan Sistem Manajemen Keselamatan (SMC) Kapal ${currentSelectedVessel?.name || 'Kapal'} Onboard sesuai IMO Res. A.741(18) dan BKI SMS Shipboard Checklist Rev 05 (74 Klausul).`)}
                        style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}
                      >
                        Pembaruan
                      </button>
                      <button
                        type="button"
                        onClick={() => setScope(`Audit Antara (Interim SMC) Sistem Manajemen Keselamatan Kapal ${currentSelectedVessel?.name || 'Kapal'} Onboard sesuai ISM Code klausul 1 s.d. 12.`)}
                        style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}
                      >
                        Antara
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
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckSquare size={18} color="#10b981" />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Checklist Kelaiklautan SMC Kapal Siap Diperiksa ({checklist.length} Butir Klausul Resmi)
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Mengadopsi standar BKI F23.14.06-2024 Rev 05 mencakup Bagian A s.d. E (Kamar Mesin, Geladak, Navigasi, LSA/FFA, & Dokumen Awak).
                </div>
              </div>
            </div>
            <span className="badge badge-success" style={{ fontSize: '0.72rem', fontWeight: 800 }}>
              ✓ 74 Klausul Terpasang
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
                <span>Hapus Sesi SMC</span>
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
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
              }}
            >
              <Save size={15} />
              <span>{isEdit ? 'Simpan Perubahan SMC' : 'Simpan & Buka Checklist (Tahap 2)'}</span>
            </button>
          </div>
        </div>

        {/* MODAL KONFIRMASI HAPUS SESI */}
        {showDeleteConfirm && (
          <div className="modal-overlay" style={{ zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div className="glass-card" style={{ maxWidth: '420px', padding: '1.5rem', textAlign: 'center', background: 'var(--bg-surface-card)', borderRadius: '12px' }}>
              <AlertTriangle size={42} color="#ef4444" style={{ margin: '0 auto 0.75rem' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
                Hapus Sesi Audit SMC Ini?
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Sesi audit <strong>{auditNo}</strong> untuk kapal <strong>{currentSelectedVessel?.name}</strong> akan dihapus permanen dari sistem.
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
                    showToast('Sesi audit SMC berhasil dihapus', 'info');
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
