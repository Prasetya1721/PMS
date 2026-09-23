import React, { useState, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  X,
  ShieldCheck,
  Building2,
  Ship,
  UserCheck,
  Save,
  Maximize2,
  Minimize2,
  Trash2,
  Sparkles,
  Calendar
} from 'lucide-react';
import {
  BKI_AUDIT_MASTER,
  BKI_SMC_CHECKLIST_TEMPLATE,
  BKI_DOC_CHECKLIST_TEMPLATE,
  NON_BKI_AUDIT_ORGANIZATIONS,
  EXTERNAL_AUDIT_ORGANIZATIONS,
  isBKIOrganization,
  normalizeChecklistItem
} from '../../data/auditMasterData';

/**
 * Bangun baris checklist interaktif dari registry checklist lembaga audit.
 * HANYA BKI dan Audit Internal Baharimas yang memiliki template resmi terstruktur.
 */
const getStandardBkiChecklist = (targetStandard = 'SMC') => {
  const template = targetStandard === 'DOC' ? BKI_DOC_CHECKLIST_TEMPLATE : BKI_SMC_CHECKLIST_TEMPLATE;
  return (template.items || []).map(normalizeChecklistItem).map(item => {
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

const buildChecklistFromOrganization = (organization, targetStandard = 'SMC', currentAuditType = 'Internal') => {
  if (currentAuditType === 'Internal' || isBKIOrganization(organization)) {
    return getStandardBkiChecklist(targetStandard);
  }
  return [];
};

export const AuditSessionModal = ({ session, onClose, defaultVesselId, defaultStandard, onSaved }) => {
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

  // Sync vessel object
  const currentSelectedVessel = useMemo(() => {
    return vessels.find(v => v.id === vesselId) || vessels[0];
  }, [vessels, vesselId]);

  // DOC-specific and SMC-specific meta
  const [docDepartment, setDocDepartment] = useState(
    session?.docDepartment || 'Divisi DPA, QHSE & Operasional Armada Darat'
  );
  const [docCertificateNo, setDocCertificateNo] = useState(
    session?.docCertificateNo || `DOC-IDN-PBK/${new Date().getFullYear()}-R1`
  );
  const [smcCertificateNo, setSmcCertificateNo] = useState(() => {
    if (session?.smcCertificateNo) return session.smcCertificateNo;
    const vName = currentSelectedVessel?.name || 'RP2004';
    return `SMC-TB-${vName.replace(/\s+/g, '')}/${new Date().getFullYear()}`;
  });

  // Identity & Registration
  const [auditNo, setAuditNo] = useState(() => {
    if (session?.auditNo) return session.auditNo;
    const year = new Date().getFullYear();
    const rand = Math.floor(Math.random() * 900 + 100);
    return `AUD-${(session?.auditType || 'Internal') === 'Internal' ? 'INT' : 'EXT'}-${initialStandard}-${year}/${rand}`;
  });

  const [reportId, setReportId] = useState(() => {
    if (session?.reportId) return session.reportId;
    return initialStandard === 'DOC' ? '0858-PK/ISM-DOC/2026' : '0859-PK/ISM-SMC/2026';
  });

  const [status, setStatus] = useState(session?.status || 'In Progress');

  // Tim & Auditee
  const [leadAuditor, setLeadAuditor] = useState(session?.leadAuditor || '');
  const [auditTeam, setAuditTeam] = useState(
    session?.auditTeam ? (Array.isArray(session.auditTeam) ? session.auditTeam.join(', ') : session.auditTeam) : ''
  );
  const [auditee, setAuditee] = useState(session?.auditee || '');
  const [auditLocation, setAuditLocation] = useState(
    session?.auditLocation || (initialStandard === 'DOC' ? 'Kantor Pusat PT. Pelayaran Baharimas Kalimantan (Pontianak)' : `Onboard ${currentSelectedVessel?.name || 'Kapal Armada'}`)
  );

  // Jadwal & Ruang Lingkup
  const [auditDate, setAuditDate] = useState(session?.auditDate || new Date().toISOString().split('T')[0]);
  const [targetCloseDate, setTargetCloseDate] = useState(
    session?.targetCloseDate ||
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [scope, setScope] = useState(() => {
    if (session?.scope) return session.scope;
    return initialStandard === 'DOC'
      ? 'Audit Kepatuhan Tahunan Sistem Manajemen Keselamatan Darat (DOC) PT. Pelayaran Baharimas Kalimantan mencakup 13 Seksi BKI DOC Rev 06 / ISM Code 2025.'
      : `Audit Kelaikan Sistem Manajemen Keselamatan (SMC) Kapal Onboard sesuai IMO Res. A.741(18) / ISM Code klausul 1 s.d. 12 dan BKI SMS Shipboard Checklist Rev 05 (74 Klausul Pemeriksaan).`;
  });

  // Interactive Checklist initialization
  const [checklist, setChecklist] = useState(() => {
    if (session?.checklist && session.checklist.length > 0) {
      return session.checklist;
    }
    return buildChecklistFromOrganization(initialOrgStr, initialStandard, session?.auditType || 'Internal');
  });

  // Switch Standar (SMC Kapal vs DOC Darat)
  const applyStandardSwitch = (newStandard) => {
    setStandard(newStandard);
    const year = new Date().getFullYear();
    const rand = Math.floor(Math.random() * 900 + 100);
    const prefix = auditType === 'Internal' ? 'INT' : 'EXT';

    if (!isEdit) {
      setAuditNo(`AUD-${prefix}-${newStandard}-${year}/${rand}`);
      setReportId(newStandard === 'DOC' ? '0858-PK/ISM-DOC/2026' : '0859-PK/ISM-SMC/2026');
    }

    if (newStandard === 'DOC') {
      setTargetType('Office');
      setAuditLocation('Kantor Pusat PT. Pelayaran Baharimas Kalimantan (Pontianak)');
      if (!isEdit && !session?.auditee) setAuditee('Direktur Operasional, DPA & Para Manager Darat');
      if (!isEdit) setScope('Audit Kepatuhan Tahunan Sistem Manajemen Keselamatan Darat (DOC) PT. Pelayaran Baharimas Kalimantan mencakup 13 Seksi BKI DOC Rev 06 / ISM Code 2025.');
      setChecklist(buildChecklistFromOrganization(externalOrganization, 'DOC', auditType));
      showToast('✓ Beralih ke Standar DOC Kantor Pusat (BKI Rev 06 - 13 Seksi)', 'info');
    } else {
      setTargetType('Vessel');
      setAuditLocation(`Onboard ${currentSelectedVessel?.name || 'Kapal Armada'}`);
      if (!isEdit && !session?.auditee) setAuditee(`Nakhoda & KKM ${currentSelectedVessel?.name || 'Kapal'}`);
      if (!isEdit) setScope(`Audit Kelaikan Sistem Manajemen Keselamatan (SMC) Kapal Onboard sesuai IMO Res. A.741(18) / ISM Code klausul 1 s.d. 12 dan BKI SMS Shipboard Checklist Rev 05 (74 Klausul).`);
      setChecklist(buildChecklistFromOrganization(externalOrganization, 'SMC', auditType));
      showToast('✓ Beralih ke Standar SMC Kapal Armada (BKI Rev 05 - 74 Klausul)', 'info');
    }
  };

  // Switch Jenis Audit (Internal vs Eksternal)
  const applyAuditTypeSwitch = (newAuditType) => {
    setAuditType(newAuditType);
    const year = new Date().getFullYear();
    const rand = Math.floor(Math.random() * 900 + 100);
    const prefix = newAuditType === 'Internal' ? 'INT' : 'EXT';

    if (!isEdit) {
      setAuditNo(`AUD-${prefix}-${standard}-${year}/${rand}`);
    }

    if (newAuditType === 'Internal') {
      const intOrg = 'PT. Pelayaran Baharimas Kalimantan (Internal DPA / QHSE)';
      setExternalOrganization(intOrg);
      setChecklist(buildChecklistFromOrganization(intOrg, standard, 'Internal'));
      if (!isEdit && !leadAuditor) setLeadAuditor('Auditor Senior DPA/QHSE Baharimas');
      showToast('✓ Mode Audit Internal Baharimas (Standar Resmi BKI diadopsi)', 'info');
    } else {
      const defaultExtOrg = externalOrganization && externalOrganization !== 'PT. Pelayaran Baharimas Kalimantan (Internal DPA / QHSE)'
        ? externalOrganization
        : 'Biro Klasifikasi Indonesia (BKI)';
      setExternalOrganization(defaultExtOrg);
      if (isBKIOrganization(defaultExtOrg)) {
        setChecklist(buildChecklistFromOrganization(defaultExtOrg, standard, 'External'));
      }
      if (!isEdit && (!leadAuditor || leadAuditor.includes('Baharimas'))) setLeadAuditor('Auditor Surveyor BKI Pontianak');
      showToast('✓ Mode Audit Eksternal RO / BKI', 'info');
    }
  };

  const handleExternalOrgChange = (newOrgName) => {
    setExternalOrganization(newOrgName);
    if (newOrgName === 'Lembaga Audit Eksternal Lainnya (Input Manual)' || newOrgName === 'Lainnya / Lembaga Lain') {
      setCustomExternalOrg('');
    }
    if (isBKIOrganization(newOrgName)) {
      setChecklist(buildChecklistFromOrganization(newOrgName, standard, auditType));
    }
  };

  const handleLoadSampleDemo = () => {
    if (standard === 'DOC') {
      setDocDepartment('Seluruh Divisi Darat (DPA, QHSE, Ops Armada, Logistik & Crewing)');
      setDocCertificateNo('DOC-IDN-PBK/2024-R1');
      setReportId('0859-PK/ISM-DOC/2026');
      setAuditLocation('Kantor Pusat PT. Pelayaran Baharimas Kalimantan (Pontianak)');
      setAuditee('Direktur Operasional, DPA & Para Manager Divisi Darat');
      setScope('Evaluasi implementasi Sistem Manajemen Keselamatan (SMS) ISM Code klausul 1 s/d 16 pada operasional kantor darat PT. PBK');
      setLeadAuditor('Capt. Marine Safety Inspector / Surveyor RO');
      setAuditTeam('Tim Surveyor Statutory BKI & Tim DPA');
    } else {
      const v = vessels.find(item => item.id === vesselId) || vessels[0];
      const vName = v?.name || 'RP 2004';
      setSmcCertificateNo(`SMC-TB-${vName.replace(/\s+/g, '')}/2024`);
      setReportId('0859-PK/ISM-SMC/2026');
      setAuditLocation(`Onboard ${vName} (Pelabuhan Dwikora Pontianak / Sungai Kapuas)`);
      setAuditee(`Nakhoda & KKM ${vName}`);
      setScope(`Verifikasi kepatuhan Safety Management System (SMS) ISM Code 74 Klausul Standar BKI Rev 05 dan pemeliharaan alat keselamatan ${vName}`);
      setLeadAuditor('Auditor Senior BKI / DPA Lead Auditor');
      setAuditTeam('Surveyor Marine BKI & Marine Superintendent');
    }
    showToast('✓ Contoh data sesi simulasi berhasil dimuat!', 'success');
  };

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
    showToast('✓ Template ruang lingkup diterapkan!', 'info');
  };

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
      checklist,
      totalItemsChecked: checklist.length,
      itemsComplied: checklist.filter(c => c.result === 'Complied' || c.result === 'Yes').length,
      updatedAt: new Date().toISOString()
    };

    let savedSession = null;
    if (isEdit) {
      updateAuditSession(session.id, payload);
      savedSession = { ...session, ...payload };
      showToast('✓ Sesi audit berhasil diperbarui!', 'success');
    } else {
      const created = addAuditSession(payload);
      savedSession = created || { id: `aud-${Date.now()}`, ...payload };
      showToast(`✓ Sesi audit ${payload.auditNo} siap! Beralih ke Tahap 2: Checklist Klausul.`, 'success');
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
          maxWidth: isFullscreen ? '100vw' : '1060px',
          maxHeight: isFullscreen ? '100vh' : '90vh',
          height: isFullscreen ? '100vh' : 'auto',
          background: 'var(--bg-surface-card)',
          backgroundColor: 'var(--bg-surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: isFullscreen ? 0 : '14px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          opacity: 1
        }}
      >
        {/* ========================================================================= */}
        {/* HEADER MODAL RAMPING                                                      */}
        {/* ========================================================================= */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.85rem 1.25rem',
            background: 'var(--bg-surface-elevated)',
            borderBottom: '1px solid var(--border-subtle)',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              background: standard === 'DOC' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(2, 132, 199, 0.15)',
              color: standard === 'DOC' ? '#10b981' : '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {standard === 'DOC' ? <Building2 size={20} /> : <Ship size={20} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  {isEdit ? `Edit Sesi Audit: ${session.auditNo}` : 'Formulir Sesi & Tim Audit (Tahap 1)'}
                </h3>
                <span className={`badge ${auditType === 'Internal' ? 'badge-info' : 'badge-neutral'}`} style={{ fontSize: '0.68rem' }}>
                  {auditType === 'Internal' ? '🏢 Internal Baharimas' : '🏛️ Eksternal (RO/BKI)'}
                </span>
                <span className={`badge ${standard === 'DOC' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.68rem' }}>
                  Standar {standard}
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.1rem 0 0 0' }}>
                Inisiasi identitas audit, penetapan tim pemeriksa & auditee • Pemeriksaan klausul dilakukan langsung di Dashboard Tahap 2
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.3rem 0.55rem', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              title={isFullscreen ? 'Kecilkan Tampilan' : 'Tampilan Penuh'}
            >
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              <span>{isFullscreen ? 'Normal' : 'Fullscreen'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.3rem 0.55rem' }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BILAH KONFIGURASI CEPAT (RAMPING & INTUITIF)                              */}
        {/* ========================================================================= */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.65rem',
          padding: '0.55rem 1.25rem',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Toggle Jenis Audit */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Jenis:</span>
              <div style={{ display: 'inline-flex', padding: '2px', borderRadius: '6px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => applyAuditTypeSwitch('Internal')}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '5px',
                    border: 'none',
                    fontSize: '0.74rem',
                    fontWeight: auditType === 'Internal' ? 800 : 600,
                    background: auditType === 'Internal' ? '#0284c7' : 'transparent',
                    color: auditType === 'Internal' ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  🏢 Internal
                </button>
                <button
                  type="button"
                  onClick={() => applyAuditTypeSwitch('External')}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '5px',
                    border: 'none',
                    fontSize: '0.74rem',
                    fontWeight: auditType === 'External' ? 800 : 600,
                    background: auditType === 'External' ? '#8b5cf6' : 'transparent',
                    color: auditType === 'External' ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  🏛️ Eksternal
                </button>
              </div>
            </div>

            {/* Toggle Standar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Standar:</span>
              <div style={{ display: 'inline-flex', padding: '2px', borderRadius: '6px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => applyStandardSwitch('SMC')}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '5px',
                    border: 'none',
                    fontSize: '0.74rem',
                    fontWeight: standard === 'SMC' ? 800 : 600,
                    background: standard === 'SMC' ? '#0284c7' : 'transparent',
                    color: standard === 'SMC' ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  🚢 SMC Kapal
                </button>
                <button
                  type="button"
                  onClick={() => applyStandardSwitch('DOC')}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '5px',
                    border: 'none',
                    fontSize: '0.74rem',
                    fontWeight: standard === 'DOC' ? 800 : 600,
                    background: standard === 'DOC' ? '#10b981' : 'transparent',
                    color: standard === 'DOC' ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  🏢 DOC Kantor
                </button>
              </div>
            </div>

            {/* Selector Lembaga RO (Kondisional Eksternal) */}
            {auditType === 'External' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase' }}>Lembaga:</span>
                <select
                  value={typeof externalOrganization === 'string' ? externalOrganization : externalOrganization?.name || ''}
                  onChange={(e) => handleExternalOrgChange(e.target.value)}
                  className="select-control"
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.74rem', height: '28px', fontWeight: 700, borderColor: '#8b5cf6' }}
                >
                  <optgroup label="Standar BKI (Template Resmi)">
                    <option value={BKI_AUDIT_MASTER.name}>{BKI_AUDIT_MASTER.name}</option>
                  </optgroup>
                  <optgroup label="Lembaga Lain (Format Mandiri)">
                    {NON_BKI_AUDIT_ORGANIZATIONS.map(org => (
                      <option key={org.id || org.name} value={org.name}>{org.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleLoadSampleDemo}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#0284c7' }}
            title="Isi cepat contoh data audit untuk simulasi"
          >
            <Sparkles size={12} />
            <span>✨ Isi Contoh Demo</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* FORM BODY CONTAINER: 2-KOLOM RAMPING & SEIMBANG                            */}
        {/* ========================================================================= */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="modal-body" style={{ flex: 1, padding: '1rem 1.25rem', overflowY: 'auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
              gap: '1rem'
            }}>

              {/* ------------------------------------------------------------------- */}
              {/* KOLOM KIRI: SASARAN & LEGALITAS PENOMORAN                           */}
              {/* ------------------------------------------------------------------- */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* KARTU 1: SASARAN ENTITAS & SERTIFIKAT */}
                <div className="glass-card" style={{ padding: '1rem', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                    {standard === 'DOC' ? <Building2 size={16} color="#10b981" /> : <Ship size={16} color="#0284c7" />}
                    <h5 style={{ fontSize: '0.86rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                      1. Sasaran Entitas & Nomor Sertifikat
                    </h5>
                  </div>

                  {standard === 'DOC' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                          Entitas Kantor Darat
                        </label>
                        <input
                          type="text"
                          disabled
                          value="Kantor Pusat PT. PBK (Pontianak)"
                          className="input-control"
                          style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem', fontWeight: 700 }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                          Nomor Sertifikat DOC Perusahaan *
                        </label>
                        <input
                          type="text"
                          required
                          value={docCertificateNo}
                          onChange={(e) => setDocCertificateNo(e.target.value)}
                          placeholder="DOC-IDN-PBK/2024-R1"
                          className="input-control mono"
                          style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem', fontWeight: 700 }}
                        />
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                          Divisi Darat yang Diaudit *
                        </label>
                        <input
                          type="text"
                          required
                          value={docDepartment}
                          onChange={(e) => setDocDepartment(e.target.value)}
                          placeholder="cth: Divisi DPA, QHSE, Operasional Armada, Crewing..."
                          className="input-control"
                          style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.65rem' }}>
                        <div>
                          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                            Pilih Kapal Armada ({vessels.length} Unit Kapal) *
                          </label>
                          <select
                            value={vesselId}
                            onChange={(e) => {
                              const newId = e.target.value;
                              setVesselId(newId);
                              const v = vessels.find(item => item.id === newId);
                              if (v) {
                                setSmcCertificateNo(`SMC-TB-${v.name.replace(/\s+/g, '')}/${new Date().getFullYear()}`);
                              }
                            }}
                            className="select-control"
                            style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem', fontWeight: 700 }}
                          >
                            {vessels.map(v => (
                              <option key={v.id} value={v.id}>
                                🚢 {v.name} ({v.type || 'Tugboat'})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                            Nomor Sertifikat SMC Kapal *
                          </label>
                          <input
                            type="text"
                            required
                            value={smcCertificateNo}
                            onChange={(e) => setSmcCertificateNo(e.target.value)}
                            placeholder="contoh: SMC-TB-RP2004/2024"
                            className="input-control mono"
                            style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem', fontWeight: 700 }}
                          />
                        </div>
                      </div>

                      {/* Ramping Snapshot Kapal Terpilih (1-baris chip) */}
                      {currentSelectedVessel && (
                        <div style={{
                          padding: '0.45rem 0.75rem',
                          borderRadius: '6px',
                          background: 'var(--bg-surface-elevated)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                          fontSize: '0.72rem',
                          color: 'var(--text-muted)'
                        }}>
                          <div>Register BKI/IMO: <strong className="mono" style={{ color: 'var(--text-main)' }}>{currentSelectedVessel.regNo || currentSelectedVessel.imo || '-'}</strong></div>
                          <div>Call Sign: <strong className="mono" style={{ color: 'var(--text-main)' }}>{currentSelectedVessel.callSign || '-'}</strong></div>
                          <div>Tonase: <strong className="mono" style={{ color: '#0284c7' }}>{currentSelectedVessel.gt?.toLocaleString() || '-'} GT</strong></div>
                          <div>Pelabuhan: <strong style={{ color: 'var(--text-main)' }}>{currentSelectedVessel.portOfRegistry || 'Pontianak'}</strong></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* KARTU 2: LEGALITAS & PENOMORAN RESMI */}
                <div className="glass-card" style={{ padding: '1rem', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                    <ShieldCheck size={16} color="#8b5cf6" />
                    <h5 style={{ fontSize: '0.86rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                      2. Legalitas & Penomoran Resmi
                    </h5>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Nomor Registrasi Audit *
                      </label>
                      <input
                        type="text"
                        required
                        value={auditNo}
                        onChange={(e) => setAuditNo(e.target.value)}
                        className="input-control mono"
                        style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem', fontWeight: 800, color: '#0284c7' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Nomor Laporan BKI / Report ID *
                      </label>
                      <input
                        type="text"
                        required
                        value={reportId}
                        onChange={(e) => setReportId(e.target.value)}
                        placeholder="0859-PK/ISM-SMC/2026"
                        className="input-control mono"
                        style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem', fontWeight: 700 }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Status Sesi Audit *
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="select-control"
                        style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem', fontWeight: 700 }}
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>

              {/* ------------------------------------------------------------------- */}
              {/* KOLOM KANAN: TIM AUDITOR, AUDITEE, JADWAL & RUANG LINGKUP           */}
              {/* ------------------------------------------------------------------- */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* KARTU 3: TIM AUDITOR & AUDITEE */}
                <div className="glass-card" style={{ padding: '1rem', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                    <UserCheck size={16} color="#10b981" />
                    <h5 style={{ fontSize: '0.86rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                      3. Personil Tim Auditor & Auditee
                    </h5>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Lead Auditor *
                      </label>
                      <input
                        type="text"
                        required
                        value={leadAuditor}
                        onChange={(e) => setLeadAuditor(e.target.value)}
                        placeholder="Nama Lead Auditor"
                        className="input-control"
                        style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem', fontWeight: 700 }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Anggota Tim Pendamping
                      </label>
                      <input
                        type="text"
                        value={auditTeam}
                        onChange={(e) => setAuditTeam(e.target.value)}
                        placeholder="Nama anggota (pisahkan koma)"
                        className="input-control"
                        style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Perwakilan Auditee *
                      </label>
                      <input
                        type="text"
                        required
                        value={auditee}
                        onChange={(e) => setAuditee(e.target.value)}
                        placeholder={standard === 'DOC' ? 'cth: Direktur Ops, DPA' : 'cth: Nakhoda & KKM'}
                        className="input-control"
                        style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem', fontWeight: 700 }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Lokasi Audit *
                      </label>
                      <input
                        type="text"
                        required
                        value={auditLocation}
                        onChange={(e) => setAuditLocation(e.target.value)}
                        placeholder={standard === 'DOC' ? 'Kantor Pusat Pontianak' : `Onboard ${currentSelectedVessel?.name || 'Kapal'}`}
                        className="input-control"
                        style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* KARTU 4: JADWAL & RUANG LINGKUP */}
                <div className="glass-card" style={{ padding: '1rem', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={16} color="#f59e0b" />
                      <h5 style={{ fontSize: '0.86rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                        4. Jadwal & Ruang Lingkup
                      </h5>
                    </div>

                    {/* Presets Cepat */}
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button
                        type="button"
                        onClick={() => applyScopePreset(standard === 'DOC' ? 'annual' : 'full')}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}
                      >
                        {standard === 'DOC' ? '13 Seksi DOC' : '74 Klausul SMC'}
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
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '0.65rem' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Tanggal Pelaksanaan *
                      </label>
                      <input
                        type="date"
                        required
                        value={auditDate}
                        onChange={(e) => setAuditDate(e.target.value)}
                        className="input-control"
                        style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem', fontWeight: 700 }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Target Due Date (Close Out) *
                      </label>
                      <input
                        type="date"
                        required
                        value={targetCloseDate}
                        onChange={(e) => setTargetCloseDate(e.target.value)}
                        className="input-control"
                        style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem', fontWeight: 700 }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      Ruang Lingkup Klausul ISM Code *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={scope}
                      onChange={(e) => setScope(e.target.value)}
                      placeholder="Tuliskan ruang lingkup klausul ISM Code..."
                      className="input-control"
                      style={{ fontSize: '0.78rem', lineHeight: '1.4', padding: '0.4rem 0.65rem', resize: 'vertical' }}
                    />
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* ======================================================================= */}
          {/* MODAL FOOTER FIXED ACTIONS (TAHAP 1 SESI & TIM)                         */}
          {/* ======================================================================= */}
          <div
            className="modal-footer"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1.25rem',
              background: 'var(--bg-surface-elevated)',
              borderTop: '1px solid var(--border-subtle)',
              flexShrink: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span className="badge badge-info" style={{ fontSize: '0.72rem', fontWeight: 800 }}>
                Tahap 1: Setup Sesi & Tim
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Langkah berikutnya: <strong>Tahap 2: Checklist Klausul</strong> di Dashboard utama.
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontWeight: 800,
                  background: '#0284c7'
                }}
              >
                <Save size={15} />
                <span>
                  {isEdit
                    ? 'Simpan Sesi & Buka Checklist di Dashboard ➔'
                    : `Simpan Sesi & Buka Checklist ${standard} di Dashboard ➔`}
                </span>
              </button>
            </div>
          </div>
        </form>
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
