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
import { canPerformAction } from '../../utils/rbac';
import { makeId } from '../../utils/idUtils';
import { DocSessionHeader } from './docsession/DocSessionHeader';
import { DocSessionToolbar } from './docsession/DocSessionToolbar';
import { DocSessionInfoBanner } from './docsession/DocSessionInfoBanner';
import { DocSessionOfficeColumn } from './docsession/DocSessionOfficeColumn';
import { DocSessionPersonnelColumn } from './docsession/DocSessionPersonnelColumn';
import { DocSessionChecklistBanner } from './docsession/DocSessionChecklistBanner';
import { DocSessionDeleteConfirm } from './docsession/DocSessionDeleteConfirm';

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


export const DocSessionModal = ({ session, onClose, onSaved }) => {
  const {
    currentUser,
    addAuditSession,
    updateAuditSession,
    deleteAuditSession,
    showToast
  } = usePMS();

  const userRole = currentUser?.role || 'Super Admin';
  const isAuditorOrDPA = canPerformAction(userRole, 'access_doc_audit');

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

    if (!isAuditorOrDPA) {
      showToast('Akses Terbatas: Audit DOC Kantor Darat adalah hak eksklusif DPA dan Tim Manajemen Darat.', 'warning');
      return;
    }

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
      savedSession = created || { id: makeId('aud-doc'), ...payload };
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
        <DocSessionHeader
          isEdit={isEdit}
          isFullscreen={isFullscreen}
          onClose={onClose}
          setIsFullscreen={setIsFullscreen}
        />

        {/* COMPACT CONFIGURATION BAR */}
        <DocSessionToolbar
          applyAuditTypeSwitch={applyAuditTypeSwitch}
          applyDemoPreset={applyDemoPreset}
          auditType={auditType}
          externalOrganization={externalOrganization}
          isEdit={isEdit}
          setExternalOrganization={setExternalOrganization}
        />

        {/* MODAL BODY (FORM GRID 2-KOLOM DEDIKASI DOC) */}
        <form onSubmit={handleSave} style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* PETUNJUK KHUSUS AUDIT DOC KANTOR PUSAT */}
          <DocSessionInfoBanner

          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>

            {/* KOLOM 1: KANTOR PERUSAHAAN & LEGALITAS DOC */}
            <DocSessionOfficeColumn
              auditNo={auditNo}
              docCertificateNo={docCertificateNo}
              docDepartment={docDepartment}
              reportId={reportId}
              setAuditNo={setAuditNo}
              setDocCertificateNo={setDocCertificateNo}
              setDocDepartment={setDocDepartment}
              setReportId={setReportId}
              setStatus={setStatus}
              status={status}
            />

            {/* KOLOM 2: PERSONIL AUDIT KANTOR & JADWAL */}
            <DocSessionPersonnelColumn
              auditDate={auditDate}
              auditLocation={auditLocation}
              auditTeam={auditTeam}
              auditee={auditee}
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
          <DocSessionChecklistBanner
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
                <span>Hapus Sesi DOC</span>
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
                  background: '#d97706',
                  borderColor: '#b45309',
                  boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)'
                }}
              >
                <Save size={15} />
                <span>{isEdit ? 'Simpan Perubahan DOC' : 'Simpan & Buka 13 Seksi DOC (Tahap 2)'}</span>
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600 }}>
                <Clock size={14} />
                <span>Akses Khusus DPA: Kru kapal tidak berwenang mengelola DOC kantor</span>
              </div>
            )}
          </div>
        </div>

        {/* MODAL KONFIRMASI HAPUS SESI */}
        {(showDeleteConfirm) && (
          <DocSessionDeleteConfirm
            auditNo={auditNo}
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
