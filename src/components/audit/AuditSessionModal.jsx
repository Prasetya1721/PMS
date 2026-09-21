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
  CheckCircle2,
  AlertTriangle,
  Package,
  Code,
  Printer
} from 'lucide-react';
import { AuditReportModal } from './AuditReportModal';

export const AuditSessionModal = ({ session, onClose, defaultVesselId, defaultStandard }) => {
  const {
    vessels,
    selectedVesselId,
    addAuditSession,
    updateAuditSession,
    allAuditFindings,
    addAuditFinding,
    deleteAuditFinding,
    shipDocuments,
    requisitions,
    ISM_DOC_ELEMENTS,
    ISM_SMC_ELEMENTS,
    currentUser,
    showToast
  } = usePMS();

  const isEdit = Boolean(session);

  // Fullscreen state (default to true for maximum workspace comfort)
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [showPrintReport, setShowPrintReport] = useState(false);

  // Active form subtab
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'integrations' | 'checklist' | 'findings' | 'signoff'

  // Tab 1: General Info
  const initialStandard = session?.standard || defaultStandard || (defaultVesselId && defaultVesselId !== 'office' ? 'SMC' : 'DOC');
  const initialTargetType = session?.targetType || (defaultVesselId && defaultVesselId !== 'office' ? 'Vessel' : (initialStandard === 'SMC' ? 'Vessel' : 'Office'));
  const initialVesselId = session?.vesselId || (defaultVesselId && defaultVesselId !== 'office' ? defaultVesselId : (selectedVesselId && selectedVesselId !== 'all' ? selectedVesselId : vessels[0]?.id || ''));

  const [auditType, setAuditType] = useState(session?.auditType || 'Internal');
  const [standard, setStandard] = useState(initialStandard);
  const [targetType, setTargetType] = useState(initialTargetType);
  const [vesselId, setVesselId] = useState(initialVesselId);
  const [auditNo, setAuditNo] = useState(session?.auditNo || '');
  const [leadAuditor, setLeadAuditor] = useState(session?.leadAuditor || '');
  const [auditTeam, setAuditTeam] = useState(
    session?.auditTeam ? (Array.isArray(session.auditTeam) ? session.auditTeam.join(', ') : session.auditTeam) : ''
  );
  const [auditee, setAuditee] = useState(session?.auditee || '');
  const [auditLocation, setAuditLocation] = useState(
    session?.auditLocation || 'Kantor Pusat PT. PBK Pontianak'
  );
  const [auditDate, setAuditDate] = useState(session?.auditDate || new Date().toISOString().split('T')[0]);
  const [targetCloseDate, setTargetCloseDate] = useState(
    session?.targetCloseDate ||
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [scope, setScope] = useState(session?.scope || '');
  const [status, setStatus] = useState(session?.status || 'In Progress');

  // Tab 2: Linked Certificates & Linked Requisitions
  const [selectedCertificateIds, setSelectedCertificateIds] = useState(session?.selectedCertificateIds || []);
  const [selectedRequisitionIds, setSelectedRequisitionIds] = useState(session?.selectedRequisitionIds || []);

  // Tab 3: Interactive Checklist with Manual Items
  const [checklist, setChecklist] = useState(() => {
    if (session?.checklist && session.checklist.length > 0) {
      return session.checklist;
    }
    // Initialize from master data elements
    const elements = standard === 'DOC' ? ISM_DOC_ELEMENTS : ISM_SMC_ELEMENTS;
    return elements.map(el => ({
      id: el.code,
      code: el.code,
      name: el.name,
      checkPoint: el.checkPoints?.[0] || el.description,
      result: 'Complied', // 'Complied' | 'Observation' | 'Minor NC' | 'Major NC'
      notes: '',
      isManual: false
    }));
  });

  // Manual Checklist Item input form state
  const [manualCode, setManualCode] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualCriteria, setManualCriteria] = useState('');
  const [manualResult, setManualResult] = useState('Complied');
  const [manualNotes, setManualNotes] = useState('');
  const [showManualItemForm, setShowManualItemForm] = useState(false);

  // Tab 4: Inline New Finding form state
  const [findingsList, setFindingsList] = useState(() => {
    if (session?.id) {
      return (allAuditFindings || []).filter(f => f.auditId === session.id);
    }
    return [];
  });
  const [showAddFindingForm, setShowAddFindingForm] = useState(false);
  const [newFindingCategory, setNewFindingCategory] = useState('Minor NC');
  const [newFindingClause, setNewFindingClause] = useState('ISM-10');
  const [newFindingDesc, setNewFindingDesc] = useState('');
  const [newFindingEvidence, setNewFindingEvidence] = useState('');
  const [newFindingPIC, setNewFindingPIC] = useState('');

  // Tab 5: Summary & Sign-off
  const [auditConclusion, setAuditConclusion] = useState(
    session?.auditConclusion ||
    'Sistem Manajemen Keselamatan Maritim (SMS) telah diimplementasikan secara konsisten. Temuan yang dicatat wajib ditindaklanjuti sebelum batas waktu yang ditetapkan.'
  );
  const [leadAuditorSign, setLeadAuditorSign] = useState(session?.leadAuditorSign || leadAuditor || 'Capt. Bambang Suryono');
  const [auditeeSign, setAuditeeSign] = useState(session?.auditeeSign || auditee || 'Nakhoda / DPA');

  // Sync vessel info when vesselId changes
  const currentSelectedVessel = useMemo(() => {
    return vessels.find(v => v.id === vesselId) || vessels[0];
  }, [vessels, vesselId]);

  // Auto-fill defaults when creating new session
  useEffect(() => {
    if (!isEdit) {
      const year = new Date().getFullYear();
      const randNum = Math.floor(Math.random() * 900 + 100);
      const prefix = auditType === 'Internal' ? 'INT' : 'EXT';
      setAuditNo(`AUD-${prefix}-${standard}-${year}/${randNum}`);

      if (standard === 'DOC') {
        setTargetType('Office');
        setAuditLocation('Kantor Pusat PT. Pelayaran Baharimas Kalimantan (Pontianak)');
        setAuditee('Direktur Operasional, DPA & Manager Logistik');
        setScope('Evaluasi menyeluruh implementasi ISM Code klausul 1 s/d 16 pada operasional kantor pusat PT. Pelayaran Baharimas Kalimantan');
        if (auditType === 'Internal') {
          setLeadAuditor('Capt. Bambang Suryono, M.Mar (Lead Auditor DPA)');
          setAuditTeam('Ir. H. Syamsul Bahri (QHSE), Dimas Wicaksono (Fleet Supt)');
        } else {
          setLeadAuditor('Surveyor BKI Cabang Utama Pontianak / Auditor Ditjen Hubla');
          setAuditTeam('Tim Surveyor Statutory Flag State');
        }
      } else {
        setTargetType('Vessel');
        setAuditLocation(`Onboard ${currentSelectedVessel?.name || 'Kapal Armada'} (Pelabuhan Dwikora Pontianak / Sungai Kapuas)`);
        setAuditee(`Nakhoda & KKM ${currentSelectedVessel?.name || 'Kapal Armada'}`);
        setScope(`Verifikasi kepatuhan Safety Management System (SMS) ISM Code dan pemeliharaan alat keselamatan di atas kapal ${currentSelectedVessel?.name || 'Armada'}`);
        if (auditType === 'Internal') {
          setLeadAuditor('Capt. Ahmad Fauzi (Marine Safety Inspector / DPA)');
          setAuditTeam('Tim Safety Officer PT. PBK');
        } else {
          setLeadAuditor('Auditor Senior Biro Klasifikasi Indonesia (BKI Pontianak)');
          setAuditTeam('Surveyor Marine BKI');
        }
      }

      // Re-initialize standard checklist
      const elements = standard === 'DOC' ? ISM_DOC_ELEMENTS : ISM_SMC_ELEMENTS;
      setChecklist(elements.map(el => ({
        id: el.code,
        code: el.code,
        name: el.name,
        checkPoint: el.checkPoints?.[0] || el.description,
        result: 'Complied',
        notes: '',
        isManual: false
      })));
    }
  }, [auditType, standard, isEdit, currentSelectedVessel]);

  // Update checklist item result or notes
  const handleChecklistChange = (id, field, value) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
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
      isManual: true
    };

    setChecklist(prev => [...prev, newItem]);
    setManualCode('');
    setManualName('');
    setManualCriteria('');
    setManualNotes('');
    setShowManualItemForm(false);
    showToast(`✓ Item checklist manual "${newItem.code}" berhasil ditambahkan!`, 'success');
  };

  // Delete checklist item (for manual items)
  const handleDeleteChecklistItem = (id) => {
    setChecklist(prev => prev.filter(item => item.id !== id));
    showToast('Item checklist berhasil dihapus!', 'info');
  };

  // Add finding inline
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
      targetName: targetType === 'Vessel' ? currentSelectedVessel?.name : 'Kantor Pusat',
      vesselId: targetType === 'Vessel' ? vesselId : null,
      clauseCode: newFindingClause,
      clauseName: checklist.find(c => c.code === newFindingClause)?.name || 'Klausul ISM',
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

  // Relevant certificates for current target
  const relevantCertificates = useMemo(() => {
    if (standard === 'DOC') {
      return (shipDocuments || []).filter(d => d.type?.toLowerCase().includes('doc') || d.category === 'Statutory' || d.vesselId === 'all');
    }
    return (shipDocuments || []).filter(d => d.vesselId === vesselId);
  }, [shipDocuments, standard, vesselId]);

  // Relevant requisitions for current target
  const relevantRequisitions = useMemo(() => {
    if (standard === 'DOC') {
      return requisitions || [];
    }
    return (requisitions || []).filter(r => r.vesselId === vesselId);
  }, [requisitions, standard, vesselId]);

  // Stats calculation
  const checklistStats = useMemo(() => {
    const total = checklist.length;
    const complied = checklist.filter(c => c.result === 'Complied').length;
    const obs = checklist.filter(c => c.result === 'Observation').length;
    const minorNC = checklist.filter(c => c.result === 'Minor NC').length;
    const majorNC = checklist.filter(c => c.result === 'Major NC').length;
    const score = total > 0 ? Math.round((complied / total) * 100) : 100;
    return { total, complied, obs, minorNC, majorNC, score };
  }, [checklist]);

  // Submit complete session
  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedVessel = targetType === 'Vessel' ? vessels.find(v => v.id === vesselId) : null;
    const targetName = targetType === 'Vessel'
      ? (selectedVessel?.name || 'Kapal Armada PBK')
      : 'Kantor Pusat PT. Pelayaran Baharimas Kalimantan (Pontianak)';

    const teamArray = auditTeam.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      auditNo: auditNo.trim(),
      auditType,
      standard,
      targetType,
      targetName,
      vesselId: targetType === 'Vessel' ? vesselId : null,
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

    if (isEdit) {
      updateAuditSession(session.id, payload);
    } else {
      const created = addAuditSession(payload);
      // Persist any findings created during the session
      if (findingsList.length > 0) {
        findingsList.forEach(f => {
          addAuditFinding({ ...f, auditId: created.id, auditNo: created.auditNo });
        });
      }
    }

    onClose();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div
        className={isFullscreen ? 'modal-fullscreen' : 'modal-dialog modal-dialog-large'}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* ========================================================================= */}
        {/* MODAL HEADER WITH FULLSCREEN TOGGLE                                      */}
        {/* ========================================================================= */}
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              padding: '0.55rem',
              borderRadius: '10px',
              background: auditType === 'Internal' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(168, 85, 247, 0.15)',
              color: auditType === 'Internal' ? '#06b6d4' : '#a855f7'
            }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  {isEdit ? `Formulir Sesi Audit ISM: ${session?.auditNo}` : 'Formulir Lengkap Sesi Audit ISM Code'}
                </h3>
                <span className={`badge ${auditType === 'Internal' ? 'badge-info' : 'badge-neutral'}`}>
                  {auditType} PBK
                </span>
                <span className={`badge ${standard === 'DOC' ? 'badge-success' : 'badge-warning'}`}>
                  Standar {standard}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Standar IMO Resolusi A.741(18) • PT. Pelayaran Baharimas Kalimantan • {targetType === 'Vessel' ? currentSelectedVessel?.name : 'Kantor Pusat'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Fullscreen Toggle Button */}
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
        {/* SUBTABS NAVIGATION BAR                                                    */}
        {/* ========================================================================= */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.65rem 1.5rem',
          background: 'var(--bg-surface-elevated)',
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0
        }}>
          {[
            { id: 'general', label: '1. Data Pokok & Legalitas Sesi', icon: Building2, badge: null },
            { id: 'integrations', label: '2. Sertifikat & Permintaan Barang Gudang', icon: FileCheck, badge: `${selectedCertificateIds.length + selectedRequisitionIds.length}` },
            { id: 'checklist', label: '3. Checklist ISM & Input Item Manual', icon: Code, badge: `${checklist.length} Item` },
            { id: 'findings', label: '4. Rekapitulasi Temuan NC', icon: AlertTriangle, badge: `${checklistStats.minorNC + checklistStats.majorNC + checklistStats.obs} NC`, alert: checklistStats.majorNC > 0 },
            { id: 'signoff', label: '5. Kesimpulan & Tanda Tangan', icon: CheckCircle2, badge: `${checklistStats.score}%` }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn ${isActive ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 0.95rem',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 700 : 500,
                  borderRadius: '8px',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={14} color={isActive ? '#38bdf8' : 'var(--text-subtle)'} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`badge ${tab.alert ? 'badge-danger-pulse' : isActive ? 'badge-info' : 'badge-neutral'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* FORM CONTENT CONTAINER (SCROLLABLE)                                      */}
        {/* ========================================================================= */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="modal-body" style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>

            {/* --------------------------------------------------------------------- */}
            {/* TAB 1: DATA POKOK & LEGALITAS SESI AUDIT                              */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === 'general' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Identitas & Otoritas Pelaksanaan Audit</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lengkapi seluruh parameter dasar sesi audit</span>
                </div>

                {/* Jenis Audit & Standar */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  <div className="glass-card" style={{ padding: '1rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.45rem' }}>
                      Jenis Audit Maritim *
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setAuditType('Internal')}
                        className={`btn btn-sm ${auditType === 'Internal' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.8rem', fontWeight: 700 }}
                      >
                        <UserCheck size={14} />
                        <span>Internal PBK</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuditType('External')}
                        className={`btn btn-sm ${auditType === 'External' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.8rem', fontWeight: 700 }}
                      >
                        <ShieldCheck size={14} />
                        <span>Eksternal BKI/Gov</span>
                      </button>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                      {auditType === 'Internal' ? 'Dilakukan oleh DPA & Tim QHSE internal PT. PBK' : 'Dilakukan oleh Auditor Resmi BKI / Ditjen Perhubungan Laut'}
                    </p>
                  </div>

                  <div className="glass-card" style={{ padding: '1rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.45rem' }}>
                      Standar Kepatuhan Audit *
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setStandard('DOC');
                          setTargetType('Office');
                        }}
                        className={`btn btn-sm ${standard === 'DOC' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.8rem', fontWeight: 700 }}
                      >
                        <Building2 size={14} />
                        <span>DOC (Kantor Pusat)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setStandard('SMC');
                          setTargetType('Vessel');
                        }}
                        className={`btn btn-sm ${standard === 'SMC' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.8rem', fontWeight: 700 }}
                      >
                        <Ship size={14} />
                        <span>SMC (Armada Kapal)</span>
                      </button>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                      {standard === 'DOC' ? 'Document of Compliance (Klausul 1-16 Kantor Darat)' : 'Safety Management Certificate (28 Kapal Armada Baharimas)'}
                    </p>
                  </div>
                </div>

                {/* Target & Register Number */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                      Nomor Register Sesi Audit *
                    </label>
                    <input
                      type="text"
                      required
                      value={auditNo}
                      onChange={(e) => setAuditNo(e.target.value)}
                      placeholder="contoh: AUD-INT-DOC-2026/101"
                      className="input-control mono"
                      style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0284c7' }}
                    />
                  </div>

                  {targetType === 'Vessel' ? (
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                        Pilih Target Kapal Armada (28 Unit) *
                      </label>
                      <select
                        value={vesselId}
                        onChange={(e) => setVesselId(e.target.value)}
                        className="select-control"
                      >
                        {vessels.map(v => (
                          <option key={v.id} value={v.id}>
                            🚢 {v.name} ({v.type || 'Tugboat'}) - {v.ownershipStatus || 'As Owner'}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                        Target Entitas Darat
                      </label>
                      <input
                        type="text"
                        disabled
                        value="Kantor Pusat PT. Pelayaran Baharimas Kalimantan (Pontianak)"
                        className="input-control"
                        style={{ opacity: 0.8, cursor: 'not-allowed' }}
                      />
                    </div>
                  )}
                </div>

                {/* Vessel Specification Snapshot (If Vessel) */}
                {targetType === 'Vessel' && currentSelectedVessel && (
                  <div style={{ padding: '0.85rem 1.15rem', borderRadius: '10px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.75rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Nomor Register BKI / IMO:</span>
                      <strong className="mono" style={{ color: 'var(--text-main)' }}>{currentSelectedVessel.regNo || currentSelectedVessel.imo || '-'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Call Sign / Tipe:</span>
                      <strong className="mono" style={{ color: 'var(--text-main)' }}>{currentSelectedVessel.callSign || '-'} • {currentSelectedVessel.type?.split(' ')[0]}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Gross Tonnage (GT):</span>
                      <strong className="mono" style={{ color: '#10b981' }}>{currentSelectedVessel.gt?.toLocaleString()} GT</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Pelabuhan Pendaftaran:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{currentSelectedVessel.portOfRegistry || 'Pontianak'}</strong>
                    </div>
                  </div>
                )}

                {/* Auditor, Team, Auditee, Location */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                      Lead Auditor (Ketua Auditor) *
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
                      placeholder="contoh: Nakhoda, KKM, DPA"
                      className="input-control"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                      Lokasi Fisik Pelaksanaan Audit *
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

                {/* Dates & Status */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                      Tanggal Audit *
                    </label>
                    <input
                      type="date"
                      required
                      value={auditDate}
                      onChange={(e) => setAuditDate(e.target.value)}
                      className="input-control mono"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                      Target Penutupan NC (Due Date) *
                    </label>
                    <input
                      type="date"
                      required
                      value={targetCloseDate}
                      onChange={(e) => setTargetCloseDate(e.target.value)}
                      className="input-control mono"
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
                    >
                      <option value="Scheduled">Terjadwal (Scheduled)</option>
                      <option value="In Progress">Sedang Berlangsung (In Progress)</option>
                      <option value="Completed">Selesai (Completed)</option>
                    </select>
                  </div>
                </div>

                {/* Scope */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Ruang Lingkup & Dasar Regulasi (Scope) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    placeholder="Tuliskan ruang lingkup klausul ISM Code dan tujuan audit ini..."
                    className="input-control"
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 2: SERTIFIKAT KAPAL & PERMINTAAN BARANG GUDANG                   */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === 'integrations' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Integrasi Data Sertifikat Kapal & Permintaan Barang Gudang</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hubungkan sesi audit dengan dokumen statutory BKI & logistik darat</span>
                </div>

                {/* Section A: Data Sertifikat Kapal Terkait */}
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileCheck size={18} color="#10b981" />
                      <h5 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Pilih Dokumen & Sertifikat Kapal yang Diaudit</h5>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {selectedCertificateIds.length} Sertifikat Dipilih
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Centang sertifikat statutory kapal (DOC BKI, SMC, SAFCON, Radio, Load Line, Marpol) yang diperiksa keabsahan dan masa berlakunya pada sesi audit ini.
                  </p>

                  <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.5rem' }}>
                    {relevantCertificates.length === 0 ? (
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', padding: '1rem', textAlign: 'center' }}>
                        Tidak ada dokumen khusus ditemukan untuk target ini.
                      </p>
                    ) : (
                      relevantCertificates.map(doc => {
                        const isChecked = selectedCertificateIds.includes(doc.id);
                        return (
                          <label
                            key={doc.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '6px',
                              background: isChecked ? 'rgba(2, 132, 199, 0.12)' : 'var(--bg-surface-elevated)',
                              border: isChecked ? '1px solid #0284c7' : '1px solid transparent',
                              cursor: 'pointer',
                              fontSize: '0.78rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedCertificateIds(prev => [...prev, doc.id]);
                                  } else {
                                    setSelectedCertificateIds(prev => prev.filter(id => id !== doc.id));
                                  }
                                }}
                              />
                              <div>
                                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{doc.name || doc.type}</span>
                                <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginLeft: '0.5rem' }}>
                                  No: {doc.documentNumber || 'BKI-REG'}
                                </span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span className={`badge ${doc.status === 'Active' ? 'badge-success' : doc.status === 'Due Soon' ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: '0.65rem' }}>
                                {doc.status}
                              </span>
                              <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                Exp: {doc.expiryDate}
                              </span>
                            </div>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Section B: Tautan Permintaan Barang ke Gudang */}
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Package size={18} color="#f59e0b" />
                      <h5 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Hubungkan Surat Permintaan Barang ke Gudang (Logistik)</h5>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {selectedRequisitionIds.length} Permintaan Ditautkan
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Pilih surat permintaan sparepart atau alat keselamatan (Material Requisition) yang diajukan untuk pemenuhan klausul pemeliharaan kapal ISM Code.
                  </p>

                  <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.5rem' }}>
                    {relevantRequisitions.length === 0 ? (
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', padding: '1rem', textAlign: 'center' }}>
                        Tidak ada surat permintaan barang terdaftar untuk target ini.
                      </p>
                    ) : (
                      relevantRequisitions.map(req => {
                        const isChecked = selectedRequisitionIds.includes(req.id);
                        return (
                          <label
                            key={req.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '6px',
                              background: isChecked ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-surface-elevated)',
                              border: isChecked ? '1px solid #f59e0b' : '1px solid transparent',
                              cursor: 'pointer',
                              fontSize: '0.78rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedRequisitionIds(prev => [...prev, req.id]);
                                  } else {
                                    setSelectedRequisitionIds(prev => prev.filter(id => id !== req.id));
                                  }
                                }}
                              />
                              <div>
                                <span className="mono" style={{ fontWeight: 800, color: '#f59e0b' }}>{req.requisitionNumber || req.id}</span>
                                <span style={{ fontWeight: 600, color: 'var(--text-main)', marginLeft: '0.5rem' }}>
                                  {req.title || req.department || 'Material Requisition'}
                                </span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                                {req.status || 'In Warehouse'}
                              </span>
                              <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                {req.requestDate || req.createdAt?.split('T')[0]}
                              </span>
                            </div>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 3: CHECKLIST AUDIT & INPUT KLAUSUL MANUAL                         */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === 'checklist' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>
                      Pemeriksaan Checklist ISM & Input Item Audit Manual
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Nilai setiap elemen kepatuhan: Patuh (Complied), Observasi (OBS), Minor NC, atau Major NC
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowManualItemForm(!showManualItemForm)}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                  >
                    <Plus size={14} />
                    <span>+ Tambah Item Klausul Manual</span>
                  </button>
                </div>

                {/* Manual Item Creator Form */}
                {showManualItemForm && (
                  <div className="glass-card" style={{ padding: '1.25rem', border: '1px solid #0284c7', background: 'rgba(2, 132, 199, 0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <h5 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Code size={15} />
                        <span>Form Input Item / Klausul Audit Manual</span>
                      </h5>
                      <button type="button" onClick={() => setShowManualItemForm(false)} className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.45rem' }}>
                        <X size={14} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                          Kode Klausul Manual *
                        </label>
                        <input
                          type="text"
                          required
                          value={manualCode}
                          onChange={(e) => setManualCode(e.target.value)}
                          placeholder="contoh: ISM-10.3 / SOLAS-II"
                          className="input-control mono"
                          style={{ fontWeight: 800, color: '#0284c7' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                          Nama Klausul / Area Pemeriksaan *
                        </label>
                        <input
                          type="text"
                          required
                          value={manualName}
                          onChange={(e) => setManualName(e.target.value)}
                          placeholder="Uraian judul item audit..."
                          className="input-control"
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                          Hasil Pemeriksaan
                        </label>
                        <select
                          value={manualResult}
                          onChange={(e) => setManualResult(e.target.value)}
                          className="select-control"
                        >
                          <option value="Complied">🟢 Complied</option>
                          <option value="Observation">🔵 Observasi</option>
                          <option value="Minor NC">🟡 Minor NC</option>
                          <option value="Major NC">🔴 Major NC</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                          Kriteria Verifikasi Auditor
                        </label>
                        <input
                          type="text"
                          value={manualCriteria}
                          onChange={(e) => setManualCriteria(e.target.value)}
                          placeholder="Bukti atau fakta yang dicek..."
                          className="input-control"
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                          Catatan / Bukti Objektif Temuan
                        </label>
                        <input
                          type="text"
                          value={manualNotes}
                          onChange={(e) => setManualNotes(e.target.value)}
                          placeholder="Catatan temuan bila ada..."
                          className="input-control"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button type="button" onClick={() => setShowManualItemForm(false)} className="btn btn-secondary btn-sm">
                        Batal
                      </button>
                      <button type="button" onClick={handleAddManualChecklistItem} className="btn btn-primary btn-sm">
                        Simpan ke Daftar Checklist
                      </button>
                    </div>
                  </div>
                )}

                {/* Scorecard Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Total Item Diperiksa: <strong style={{ color: 'var(--text-main)' }}>{checklistStats.total}</strong>
                  </span>
                  <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>{checklistStats.complied} Complied</span>
                    <span>•</span>
                    <span style={{ color: '#60a5fa', fontWeight: 700 }}>{checklistStats.obs} Observasi</span>
                    <span>•</span>
                    <span style={{ color: '#f59e0b', fontWeight: 700 }}>{checklistStats.minorNC} Minor NC</span>
                    <span>•</span>
                    <span style={{ color: '#f87171', fontWeight: 700 }}>{checklistStats.majorNC} Major NC</span>
                  </div>
                  <span className="badge badge-info" style={{ fontWeight: 800 }}>
                    Skor: {checklistStats.score}%
                  </span>
                </div>

                {/* Checklist Table */}
                <div className="table-container">
                  <table className="pms-table">
                    <thead>
                      <tr>
                        <th style={{ width: '130px' }}>Kode Klausul</th>
                        <th>Uraian Elemen & Kriteria Audit</th>
                        <th style={{ width: '180px' }}>Hasil Pemeriksaan</th>
                        <th>Catatan / Bukti Objektif Auditor</th>
                        <th style={{ width: '70px', textAlign: 'center' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {checklist.map(item => (
                        <tr key={item.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <span className="mono" style={{ fontWeight: 800, color: item.isManual ? '#0284c7' : '#10b981' }}>
                                {item.code}
                              </span>
                              {item.isManual && (
                                <span className="badge badge-neutral" style={{ fontSize: '0.6rem', padding: '0.05rem 0.3rem' }}>
                                  Manual
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <strong style={{ fontSize: '0.825rem', display: 'block', color: 'var(--text-main)' }}>{item.name}</strong>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.checkPoint}</span>
                          </td>
                          <td>
                            <select
                              value={item.result}
                              onChange={(e) => handleChecklistChange(item.id, 'result', e.target.value)}
                              className="select-control"
                              style={{
                                fontSize: '0.75rem',
                                padding: '0.3rem 1.8rem 0.3rem 0.55rem',
                                fontWeight: 700,
                                color: item.result === 'Complied' ? '#10b981' : item.result === 'Major NC' ? '#ef4444' : '#f59e0b'
                              }}
                            >
                              <option value="Complied">🟢 Complied</option>
                              <option value="Observation">🔵 Observasi</option>
                              <option value="Minor NC">🟡 Minor NC</option>
                              <option value="Major NC">🔴 Major NC</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              value={item.notes}
                              onChange={(e) => handleChecklistChange(item.id, 'notes', e.target.value)}
                              placeholder="Catatan temuan / bukti verifikasi..."
                              className="input-control"
                              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                            />
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {item.isManual ? (
                              <button
                                type="button"
                                onClick={() => handleDeleteChecklistItem(item.id)}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.25rem 0.45rem', color: '#ef4444' }}
                                title="Hapus item manual"
                              >
                                <Trash2 size={12} />
                              </button>
                            ) : (
                              <CheckCircle2 size={16} color="#10b981" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 4: REKAPITULASI TEMUAN NC PADA SESI INI                          */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === 'findings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Daftar Temuan Ketidaksesuaian (NC Open & NC Close)</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Temuan yang teridentifikasi pada sesi audit ini dan status penyelesaiannya
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddFindingForm(!showAddFindingForm)}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                  >
                    <Plus size={14} />
                    <span>+ Catat Temuan Baru Sesi Ini</span>
                  </button>
                </div>

                {/* Inline Add Finding Form */}
                {showAddFindingForm && (
                  <div className="glass-card" style={{ padding: '1.25rem', border: '1px solid #f59e0b', background: 'rgba(245, 158, 11, 0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <h5 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <AlertTriangle size={15} />
                        <span>Form Catat Temuan Ketidaksesuaian Baru (NC OPEN)</span>
                      </h5>
                      <button type="button" onClick={() => setShowAddFindingForm(false)} className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.45rem' }}>
                        <X size={14} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                          Pilih Klausul ISM Terkait *
                        </label>
                        <select
                          value={newFindingClause}
                          onChange={(e) => setNewFindingClause(e.target.value)}
                          className="select-control"
                        >
                          {checklist.map(c => (
                            <option key={c.code} value={c.code}>
                              {c.code} - {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                          Kategori Temuan (Severity) *
                        </label>
                        <select
                          value={newFindingCategory}
                          onChange={(e) => setNewFindingCategory(e.target.value)}
                          className="select-control"
                        >
                          <option value="Minor NC">Minor NC (Koreksi Bertahap)</option>
                          <option value="Major NC">Major NC (Kritis / Stop Ops)</option>
                          <option value="Observation">Observasi (Saran Mutu)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                          PIC Penanggung Jawab
                        </label>
                        <input
                          type="text"
                          value={newFindingPIC}
                          onChange={(e) => setNewFindingPIC(e.target.value)}
                          placeholder="cth: KKM / Safety Officer"
                          className="input-control"
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Uraian Ketidaksesuaian (Description) *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={newFindingDesc}
                        onChange={(e) => setNewFindingDesc(e.target.value)}
                        placeholder="Jelaskan ketidaksesuaian yang ditemukan terhadap prosedur ISM Code..."
                        className="input-control"
                      />
                    </div>

                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Bukti Objektif Auditor (Objective Evidence)
                      </label>
                      <input
                        type="text"
                        value={newFindingEvidence}
                        onChange={(e) => setNewFindingEvidence(e.target.value)}
                        placeholder="Fakta fisik, catatan logbook, atau observasi langsung..."
                        className="input-control"
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button type="button" onClick={() => setShowAddFindingForm(false)} className="btn btn-secondary btn-sm">
                        Batal
                      </button>
                      <button type="button" onClick={handleAddFindingInline} className="btn btn-primary btn-sm">
                        Catat Temuan (NC Open)
                      </button>
                    </div>
                  </div>
                )}

                {/* Findings Table */}
                <div className="table-container">
                  <table className="pms-table">
                    <thead>
                      <tr>
                        <th>No. Temuan</th>
                        <th>Klausul</th>
                        <th>Kategori</th>
                        <th>Uraian Ketidaksesuaian</th>
                        <th>Batas Waktu</th>
                        <th>Status NC</th>
                        <th>PIC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {findingsList.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            Belum ada temuan yang tercatat untuk sesi audit ini. Klik tombol "+ Catat Temuan Baru Sesi Ini" di atas untuk menambahkan.
                          </td>
                        </tr>
                      ) : (
                        findingsList.map(f => (
                          <tr key={f.id}>
                            <td>
                              <strong className="mono" style={{ color: '#0284c7' }}>{f.findingNo}</strong>
                            </td>
                            <td>
                              <span className="mono" style={{ fontWeight: 700 }}>{f.clauseCode}</span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>{f.clauseName}</span>
                            </td>
                            <td>
                              <span className={`badge ${f.category === 'Major NC' ? 'badge-danger' : f.category === 'Minor NC' ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: '0.65rem' }}>
                                {f.category}
                              </span>
                            </td>
                            <td style={{ maxWidth: '280px', fontSize: '0.78rem' }}>{f.description}</td>
                            <td className="mono" style={{ fontSize: '0.75rem', color: '#f59e0b' }}>{f.dueDate}</td>
                            <td>
                              <span className={`badge ${f.status === 'NC Close' ? 'badge-success' : f.status === 'Eviden Submitted' ? 'badge-warning' : 'badge-danger-pulse'}`} style={{ fontSize: '0.65rem' }}>
                                {f.status}
                              </span>
                            </td>
                            <td style={{ fontSize: '0.75rem' }}>{f.assignedTo}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 5: KESIMPULAN & TANDA TANGAN AUDIT                                */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === 'signoff' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Kesimpulan Audit & Lembar Pengesahan Resmi</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Evaluasi akhir dan persetujuan penutupan sesi audit</span>
                </div>

                {/* Compliance Result Scorecard */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div className="glass-card" style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Indeks Kepatuhan ISM:</span>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: checklistStats.score >= 80 ? '#10b981' : '#f59e0b', marginTop: '0.25rem' }}>
                      {checklistStats.score}%
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {checklistStats.complied} dari {checklistStats.total} item dinyatakan patuh
                    </p>
                  </div>

                  <div className="glass-card" style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Temuan Major NC:</span>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: checklistStats.majorNC > 0 ? '#ef4444' : '#10b981', marginTop: '0.25rem' }}>
                      {checklistStats.majorNC}
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {checklistStats.majorNC > 0 ? 'Perlu tindakan mitigasi darurat!' : 'Nol Major Non-Conformity'}
                    </p>
                  </div>

                  <div className="glass-card" style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Temuan Minor NC:</span>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.25rem' }}>
                      {checklistStats.minorNC}
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Wajib diselesaikan sebelum target due date
                    </p>
                  </div>

                  <div className="glass-card" style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Observasi (Saran):</span>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#60a5fa', marginTop: '0.25rem' }}>
                      {checklistStats.obs}
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Rekomendasi peningkatan efisiensi
                    </p>
                  </div>
                </div>

                {/* Conclusion Textarea */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Kesimpulan & Rekomendasi Lead Auditor *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={auditConclusion}
                    onChange={(e) => setAuditConclusion(e.target.value)}
                    placeholder="Tuliskan kesimpulan akhir evaluasi sistem manajemen keselamatan..."
                    className="input-control"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* Signatures Box */}
                <div style={{ padding: '1.25rem', borderRadius: '10px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '1rem' }}>
                    Pengesahan Para Pihak (Auditor & Auditee)
                  </span>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    {/* Auditor Signature */}
                    <div style={{ padding: '1rem', border: '1px dashed var(--border-subtle)', borderRadius: '8px', textAlign: 'center', background: 'var(--bg-input)' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', display: 'block' }}>Lead Auditor ISM:</span>
                      <div style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.9rem', color: '#0284c7' }}>
                          [ TANDATANGAN RESMI AUDITOR ]
                        </span>
                      </div>
                      <input
                        type="text"
                        value={leadAuditorSign}
                        onChange={(e) => setLeadAuditorSign(e.target.value)}
                        className="input-control"
                        style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.8rem' }}
                      />
                      <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                        Tanggal Pengesahan: {auditDate}
                      </span>
                    </div>

                    {/* Auditee Signature */}
                    <div style={{ padding: '1rem', border: '1px dashed var(--border-subtle)', borderRadius: '8px', textAlign: 'center', background: 'var(--bg-input)' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', display: 'block' }}>Perwakilan Auditee:</span>
                      <div style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.9rem', color: '#10b981' }}>
                          [ TANDATANGAN RESMI AUDITEE ]
                        </span>
                      </div>
                      <input
                        type="text"
                        value={auditeeSign}
                        onChange={(e) => setAuditeeSign(e.target.value)}
                        className="input-control"
                        style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.8rem' }}
                      />
                      <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                        Nakhoda / KKM / DPA PT. PBK
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* ========================================================================= */}
          {/* MODAL FOOTER (FIXED ACTIONS)                                              */}
          {/* ========================================================================= */}
          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.5rem', background: 'var(--bg-surface-elevated)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                Tab: {activeTab === 'general' ? '1. Identitas Sesi' : activeTab === 'integrations' ? '2. Sertifikat & Gudang' : activeTab === 'checklist' ? '3. Checklist ISM' : activeTab === 'findings' ? '4. Temuan NC' : '5. Pengesahan'}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {checklistStats.complied}/{checklistStats.total} Patuh ({checklistStats.score}%)
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setShowPrintReport(true)}
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 700,
                  color: '#0284c7'
                }}
                title="Pratinjau & Cetak Laporan Lengkap Sesi Audit Sesuai Standar ISM Code (A4 Print / PDF)"
              >
                <Printer size={15} color="#0284c7" />
                <span>🖨️ Cetak Laporan Audit Resmi</span>
              </button>
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
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
              >
                <Save size={15} />
                <span>{isEdit ? 'Simpan Seluruh Perubahan Sesi' : 'Simpan & Terbitkan Sesi Audit'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Official Audit Report Print Modal */}
      {showPrintReport && (
        <AuditReportModal
          session={{
            id: session?.id || 'aud-preview',
            auditNo: auditNo || 'AUD-ISM-2026/PREVIEW',
            auditType,
            standard,
            targetType,
            targetName,
            vesselId: targetType === 'Vessel' ? vesselId : null,
            leadAuditor,
            auditTeam: teamArray,
            auditee,
            auditLocation,
            auditDate,
            targetCloseDate,
            scope,
            status,
            totalItemsChecked: checklist.length,
            itemsComplied: checklistStats.complied,
            findingsSummary: {
              majorNC: checklistStats.majorNC,
              minorNC: checklistStats.minorNC,
              observation: checklistStats.obs,
              totalOpen: checklistStats.majorNC + checklistStats.minorNC + checklistStats.obs,
              totalClosed: 0
            },
            auditConclusion,
            leadAuditorSign,
            auditeeSign
          }}
          initialMode="session"
          onClose={() => setShowPrintReport(false)}
        />
      )}
    </div>
  );
};
