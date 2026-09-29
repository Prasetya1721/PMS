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
import { canPerformAction } from '../../utils/rbac';
import { makeId } from '../../utils/idUtils';
import { SmcSessionHeader } from './smcsession/SmcSessionHeader';
import { SmcSessionToolbar } from './smcsession/SmcSessionToolbar';
import { SmcSessionInfoBanner } from './smcsession/SmcSessionInfoBanner';
import { SmcSessionShipColumn } from './smcsession/SmcSessionShipColumn';
import { SmcSessionCrewColumn } from './smcsession/SmcSessionCrewColumn';
import { SmcSessionChecklistBanner } from './smcsession/SmcSessionChecklistBanner';
import { SmcSessionDeleteConfirm } from './smcsession/SmcSessionDeleteConfirm';

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
    currentUser,
    vessels,
    selectedVesselId,
    addAuditSession,
    updateAuditSession,
    deleteAuditSession,
    showToast
  } = usePMS();

  const userRole = currentUser?.role || 'Super Admin';
  const isAuditorOrDPA = canPerformAction(userRole, 'create_audit_session');

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

    if (!isAuditorOrDPA) {
      showToast('Akses Terbatas: Pembuatan dan pengubahan sesi audit SMC hanya berhak dilakukan oleh DPA atau Lead Auditor.', 'warning');
      return;
    }

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
      savedSession = created || { id: makeId('aud-smc'), ...payload };
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
        <SmcSessionHeader
          isEdit={isEdit}
          isFullscreen={isFullscreen}
          onClose={onClose}
          setIsFullscreen={setIsFullscreen}
        />

        {/* COMPACT CONFIGURATION BAR (TIPE AUDIT & DEMO PRESET) */}
        <SmcSessionToolbar
          applyAuditTypeSwitch={applyAuditTypeSwitch}
          applyDemoPreset={applyDemoPreset}
          auditType={auditType}
          externalOrganization={externalOrganization}
          isEdit={isEdit}
          setExternalOrganization={setExternalOrganization}
        />

        {/* MODAL BODY (FORM GRID 2-KOLOM DEDIKASI SMC) */}
        <form onSubmit={handleSave} style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* PETUNJUK KHUSUS AUDIT SMC KAPAL ARMADA */}
          <SmcSessionInfoBanner

          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>

            {/* KOLOM 1: OBJEK KAPAL ARMADA & LEGALITAS PENOMORAN */}
            <SmcSessionShipColumn
              auditNo={auditNo}
              currentSelectedVessel={currentSelectedVessel}
              handleVesselChange={handleVesselChange}
              reportId={reportId}
              setAuditNo={setAuditNo}
              setReportId={setReportId}
              setSmcCertificateNo={setSmcCertificateNo}
              setStatus={setStatus}
              smcCertificateNo={smcCertificateNo}
              status={status}
              vesselId={vesselId}
              vessels={vessels}
            />

            {/* KOLOM 2: PERSONIL AUDIT ONBOARD & JADWAL */}
            <SmcSessionCrewColumn
              auditDate={auditDate}
              auditLocation={auditLocation}
              auditTeam={auditTeam}
              auditee={auditee}
              currentSelectedVessel={currentSelectedVessel}
              leadAuditor={leadAuditor}
              scope={scope}
              setAuditDate={setAuditDate}
              setAuditLocation={setAuditLocation}
              setAuditTeam={setAuditTeam}
              setAuditee={setAuditee}
              setLeadAuditor={setLeadAuditor}
              setScope={setScope}
              setTargetCloseDate={setTargetCloseDate}
              targetCloseDate={targetCloseDate}
            />

          </div>

          {/* CHECKLIST PREVIEW BANNER */}
          <SmcSessionChecklistBanner
            checklist={checklist}
          />
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
            {isEdit && isAuditorOrDPA && (
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

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ fontWeight: 600, padding: '0.5rem 1.15rem' }}
            >
              {isAuditorOrDPA ? 'Batal' : 'Tutup'}
            </button>
            {isAuditorOrDPA ? (
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
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600 }}>
                <Clock size={14} />
                <span>Mode Tinjauan: Pembukaan sesi SMC wewenang DPA / Auditor</span>
              </div>
            )}
          </div>
        </div>

        {/* MODAL KONFIRMASI HAPUS SESI */}
        {(showDeleteConfirm) && (
          <SmcSessionDeleteConfirm
            auditNo={auditNo}
            currentSelectedVessel={currentSelectedVessel}
            deleteAuditSession={deleteAuditSession}
            onClose={onClose}
            session={session}
            setShowDeleteConfirm={setShowDeleteConfirm}
            showToast={showToast}
          />
        )}

      </div>
    </div>
  );
};
