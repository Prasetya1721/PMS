import React, { useState, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  ShieldCheck,
  Building2,
  Ship,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  FileCheck,
  Package,
  Calendar,
  User,
  ExternalLink,
  Edit,
  Trash2,
  FileText,
  Upload,
  Check,
  ChevronRight,
  Eye,
  BookOpen,
  SlidersHorizontal,
  ChevronDown,
  Info
} from 'lucide-react';
import { AuditSessionModal } from './AuditSessionModal';
import { AuditFindingModal } from './AuditFindingModal';
import { SubmitEvidenceModal } from './SubmitEvidenceModal';

export const AuditManager = () => {
  const {
    audits,
    allAudits,
    auditFindings,
    allAuditFindings,
    deleteAuditSession,
    deleteAuditFinding,
    closeAuditFinding,
    vessels,
    selectedVesselId,
    setSelectedVesselId,
    shipDocuments,
    requisitions,
    ISM_DOC_ELEMENTS,
    ISM_SMC_ELEMENTS,
    openNCCount,
    closedNCCount,
    currentUser
  } = usePMS();

  // Modals state
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  const [findingModalOpen, setFindingModalOpen] = useState(false);
  const [editingFinding, setEditingFinding] = useState(null);
  const [findingDefaultAuditId, setFindingDefaultAuditId] = useState(null);

  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [evidenceTargetFinding, setEvidenceTargetFinding] = useState(null);

  // Active view tab: 'findings' | 'sessions' | 'checklist'
  const [activeView, setActiveView] = useState('findings');

  // Filters
  const [typeFilter, setTypeFilter] = useState('ALL'); // ALL, Internal, External, DOC, SMC
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, NC Open, Eviden Submitted, NC Close
  const [severityFilter, setSeverityFilter] = useState('ALL'); // ALL, Major NC, Minor NC, Observation
  const [searchQuery, setSearchQuery] = useState('');

  // Source findings based on vessel selection
  const rawFindings = selectedVesselId === 'all' ? allAuditFindings : auditFindings;
  const rawAudits = selectedVesselId === 'all' ? allAudits : audits;

  // Filtered Findings
  const filteredFindings = useMemo(() => {
    return (rawFindings || []).filter(finding => {
      // Type / Standard filter
      if (typeFilter === 'Internal' && finding.auditType !== 'Internal') return false;
      if (typeFilter === 'External' && finding.auditType !== 'External') return false;
      if (typeFilter === 'DOC' && finding.standard !== 'DOC') return false;
      if (typeFilter === 'SMC' && finding.standard !== 'SMC') return false;

      // Status filter
      if (statusFilter === 'NC Open' && finding.status !== 'NC Open') return false;
      if (statusFilter === 'Eviden Submitted' && finding.status !== 'Eviden Submitted') return false;
      if (statusFilter === 'NC Close' && finding.status !== 'NC Close') return false;

      // Severity filter
      if (severityFilter !== 'ALL' && finding.category !== severityFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNo = finding.findingNo?.toLowerCase().includes(q);
        const matchCode = finding.clauseCode?.toLowerCase().includes(q);
        const matchName = finding.clauseName?.toLowerCase().includes(q);
        const matchDesc = finding.description?.toLowerCase().includes(q);
        const matchTarget = finding.targetName?.toLowerCase().includes(q);
        const matchAuditor = finding.auditor?.toLowerCase().includes(q);
        const matchPIC = finding.assignedTo?.toLowerCase().includes(q);
        return matchNo || matchCode || matchName || matchDesc || matchTarget || matchAuditor || matchPIC;
      }

      return true;
    });
  }, [rawFindings, typeFilter, statusFilter, severityFilter, searchQuery]);

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    return (rawAudits || []).filter(session => {
      if (typeFilter === 'Internal' && session.auditType !== 'Internal') return false;
      if (typeFilter === 'External' && session.auditType !== 'External') return false;
      if (typeFilter === 'DOC' && session.standard !== 'DOC') return false;
      if (typeFilter === 'SMC' && session.standard !== 'SMC') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNo = session.auditNo?.toLowerCase().includes(q);
        const matchAuditor = session.leadAuditor?.toLowerCase().includes(q);
        const matchTarget = session.targetName?.toLowerCase().includes(q);
        const matchScope = session.scope?.toLowerCase().includes(q);
        return matchNo || matchAuditor || matchTarget || matchScope;
      }

      return true;
    });
  }, [rawAudits, typeFilter, searchQuery]);

  // Overall statistics
  const stats = useMemo(() => {
    const totalFindings = (rawFindings || []).length;
    const majorCount = (rawFindings || []).filter(f => f.category === 'Major NC').length;
    const minorCount = (rawFindings || []).filter(f => f.category === 'Minor NC').length;
    const obsCount = (rawFindings || []).filter(f => f.category === 'Observation').length;

    const openCount = (rawFindings || []).filter(f => f.status === 'NC Open').length;
    const submittedCount = (rawFindings || []).filter(f => f.status === 'Eviden Submitted').length;
    const closedCount = (rawFindings || []).filter(f => f.status === 'NC Close').length;

    const totalSessions = (rawAudits || []).length;
    const intSessions = (rawAudits || []).filter(a => a.auditType === 'Internal').length;
    const extSessions = (rawAudits || []).filter(a => a.auditType === 'External').length;
    const docSessions = (rawAudits || []).filter(a => a.standard === 'DOC').length;
    const smcSessions = (rawAudits || []).filter(a => a.standard === 'SMC').length;

    return {
      totalFindings,
      majorCount,
      minorCount,
      obsCount,
      openCount,
      submittedCount,
      closedCount,
      totalSessions,
      intSessions,
      extSessions,
      docSessions,
      smcSessions
    };
  }, [rawFindings, rawAudits]);

  const handleOpenAddFindingForAudit = (auditId) => {
    setFindingDefaultAuditId(auditId);
    setEditingFinding(null);
    setFindingModalOpen(true);
  };

  const handleQuickFindingFromChecklist = (standardType, elem) => {
    setEditingFinding({
      standard: standardType,
      clauseCode: elem.code,
      clauseName: elem.name,
      description: `Temuan ketidaksesuaian pada pemeriksaan checklist: ${elem.name}`,
      category: 'Minor NC'
    });
    setFindingDefaultAuditId(null);
    setFindingModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      {/* Hero Header Banner */}
      <div className="audit-hero-banner glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{
            padding: '0.85rem',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
          }}>
            <ShieldCheck size={32} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Audit & Kepatuhan ISM Code</h2>
              <span className="badge badge-info" style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}>
                DOC Kantor & SMC 28 Kapal
              </span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.3rem', maxWidth: '750px', lineHeight: '1.5' }}>
              Manajemen Audit Keselamatan Maritim (Internal DPA PT. PBK & Eksternal BKI / Ditjen Hubla) sesuai Standar IMO ISM Code Resolusi A.741(18).
              Pantau status <strong>NC Open</strong>, <strong>Eviden Perbaikan</strong>, dan <strong>NC Close</strong> secara terintegrasi dengan sertifikat kapal & logistik gudang.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => {
              setEditingSession(null);
              setSessionModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
          >
            <Plus size={15} color="#38bdf8" />
            <span>Sesi Audit Baru</span>
          </button>
          <button
            onClick={() => {
              setEditingFinding(null);
              setFindingDefaultAuditId(null);
              setFindingModalOpen(true);
            }}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
          >
            <AlertTriangle size={15} />
            <span>Catat Temuan NC Manual</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Scorecard */}
      <div className="audit-kpi-grid">
        {/* Card 1: Sesi Audit */}
        <div className="audit-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sesi Audit ISM</span>
            <ShieldCheck size={18} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.35rem' }}>
            {stats.totalSessions}
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem' }}>
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>{stats.intSessions} Internal</span>
            <span>•</span>
            <span style={{ color: '#a78bfa', fontWeight: 700 }}>{stats.extSessions} Eksternal</span>
          </div>
        </div>

        {/* Card 2: Total Temuan */}
        <div className="audit-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Temuan</span>
            <FileText size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.35rem' }}>
            {stats.totalFindings}
          </div>
          <div style={{ display: 'flex', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem' }}>
            <span style={{ color: '#f87171', fontWeight: 700 }}>{stats.majorCount} Major</span>
            <span>•</span>
            <span style={{ color: '#f59e0b', fontWeight: 700 }}>{stats.minorCount} Minor</span>
            <span>•</span>
            <span style={{ color: '#60a5fa', fontWeight: 700 }}>{stats.obsCount} Obs</span>
          </div>
        </div>

        {/* Card 3: NC OPEN */}
        <div className="audit-card audit-card-danger">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#f87171', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
              NC OPEN
            </span>
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ef4444', marginTop: '0.35rem' }}>
            {stats.openCount}
          </div>
          <p style={{ fontSize: '0.72rem', color: '#fca5a5', marginTop: '0.4rem', borderTop: '1px solid rgba(239, 68, 68, 0.2)', paddingTop: '0.4rem' }}>
            Perlu tindakan perbaikan & bukti eviden
          </p>
        </div>

        {/* Card 4: EVIDEN SUBMITTED */}
        <div className="audit-card audit-card-warning">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 800 }}>EVIDEN DIAJUKAN</span>
            <Upload size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.35rem' }}>
            {stats.submittedCount}
          </div>
          <p style={{ fontSize: '0.72rem', color: '#fde68a', marginTop: '0.4rem', borderTop: '1px solid rgba(245, 158, 11, 0.2)', paddingTop: '0.4rem' }}>
            Menunggu verifikasi Lead Auditor / DPA
          </p>
        </div>

        {/* Card 5: NC CLOSE */}
        <div className="audit-card audit-card-success">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 800 }}>NC CLOSE</span>
            <CheckCircle2 size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#10b981', marginTop: '0.35rem' }}>
            {stats.closedCount}
          </div>
          <p style={{ fontSize: '0.72rem', color: '#a7f3d0', marginTop: '0.4rem', borderTop: '1px solid rgba(16, 185, 129, 0.2)', paddingTop: '0.4rem' }}>
            Selesai diverifikasi & resmi ditutup
          </p>
        </div>
      </div>

      {/* Main View Mode Selector & Filters Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Row 1: View Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveView('findings')}
              className={`btn btn-sm ${activeView === 'findings' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
            >
              <AlertTriangle size={14} />
              <span>Daftar Temuan NC & Eviden ({filteredFindings.length})</span>
            </button>
            <button
              onClick={() => setActiveView('sessions')}
              className={`btn btn-sm ${activeView === 'sessions' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
            >
              <ShieldCheck size={14} />
              <span>Sesi Audit ISM ({filteredSessions.length})</span>
            </button>
            <button
              onClick={() => setActiveView('checklist')}
              className={`btn btn-sm ${activeView === 'checklist' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
            >
              <BookOpen size={14} />
              <span>Checklist Standar DOC & SMC</span>
            </button>
          </div>

          {/* Quick Vessel Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter Kapal:</span>
            <select
              value={selectedVesselId}
              onChange={(e) => setSelectedVesselId(e.target.value)}
              className="select-control"
              style={{ width: '230px', fontSize: '0.8rem', padding: '0.4rem 2rem 0.4rem 0.75rem' }}
            >
              <option value="all">🌐 Semua Armada & Kantor (Fleet-wide)</option>
              {vessels.map(v => (
                <option key={v.id} value={v.id}>🚢 {v.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Secondary Filter Pills & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', marginRight: '0.25rem' }}>
              <Filter size={13} />
              <span>Standar:</span>
            </span>
            {[
              { id: 'ALL', label: 'Semua Standar' },
              { id: 'Internal', label: 'Internal PBK' },
              { id: 'External', label: 'Eksternal (BKI/Gov)' },
              { id: 'DOC', label: 'DOC (Kantor)' },
              { id: 'SMC', label: 'SMC (Kapal)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id)}
                className={`btn btn-sm ${typeFilter === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
              >
                {tab.label}
              </button>
            ))}

            {activeView === 'findings' && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: '0.5rem', paddingLeft: '0.5rem', borderLeft: '1px solid var(--border-subtle)' }}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="select-control"
                  style={{ width: '175px', fontSize: '0.75rem', padding: '0.35rem 1.8rem 0.35rem 0.65rem' }}
                >
                  <option value="ALL">Semua Status NC</option>
                  <option value="NC Open">🔴 NC Open</option>
                  <option value="Eviden Submitted">🟡 Eviden Submitted</option>
                  <option value="NC Close">🟢 NC Close</option>
                </select>

                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="select-control"
                  style={{ width: '165px', fontSize: '0.75rem', padding: '0.35rem 1.8rem 0.35rem 0.65rem' }}
                >
                  <option value="ALL">Semua Tingkat Keparahan</option>
                  <option value="Major NC">Major NC</option>
                  <option value="Minor NC">Minor NC</option>
                  <option value="Observation">Observasi</option>
                </select>
              </div>
            )}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={14} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari klausul, no temuan, auditor..."
              className="input-control"
              style={{ paddingLeft: '2.2rem', fontSize: '0.8rem', padding: '0.45rem 0.75rem 0.45rem 2.2rem' }}
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: DAFTAR TEMUAN & EVIDEN */}
      {/* ========================================================================= */}
      {activeView === 'findings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredFindings.length === 0 ? (
            <div className="glass-card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
              <ShieldCheck size={48} color="#10b981" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Tidak Ada Temuan Ketidaksesuaian Ditemukan</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.3rem', maxWidth: '440px', margin: '0.3rem auto 1.25rem' }}>
                Semua item audit sesuai kriteria filter atau belum ada temuan yang dicatat. Anda dapat mencatat temuan manual kapan saja.
              </p>
              <button
                onClick={() => {
                  setEditingFinding(null);
                  setFindingModalOpen(true);
                }}
                className="btn btn-primary btn-sm"
              >
                + Catat Temuan Baru Sekarang
              </button>
            </div>
          ) : (
            filteredFindings.map(finding => {
              const isClosed = finding.status === 'NC Close';
              const isSubmitted = finding.status === 'Eviden Submitted';
              const isOpen = finding.status === 'NC Open';

              const linkedDoc = finding.linkedCertificateId
                ? shipDocuments.find(d => d.id === finding.linkedCertificateId)
                : null;

              const linkedReq = finding.linkedRequisitionId
                ? requisitions.find(r => r.id === finding.linkedRequisitionId)
                : null;

              const statusClass = isClosed ? 'status-closed' : isSubmitted ? 'status-submitted' : 'status-open';

              return (
                <div key={finding.id} className={`audit-finding-item ${statusClass}`}>
                  {/* Top Bar: Finding No, Status, Category, Standard */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                      <span className="mono" style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        {finding.findingNo}
                      </span>

                      {/* Status Badge */}
                      <span className={`badge ${
                        isClosed ? 'badge-success' : isSubmitted ? 'badge-warning' : 'badge-danger-pulse'
                      }`}>
                        {finding.status}
                      </span>

                      {/* Category Badge */}
                      <span className={`badge ${
                        finding.category === 'Major NC' ? 'badge-danger' :
                        finding.category === 'Minor NC' ? 'badge-warning' : 'badge-info'
                      }`}>
                        {finding.category}
                      </span>

                      {/* Standard & Type Badge */}
                      <span className="badge badge-neutral">
                        {finding.auditType} {finding.standard}
                      </span>
                    </div>

                    {/* Right side: Due Date & Action Icons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={13} color="var(--text-subtle)" />
                        <span>Batas Waktu: <strong className="mono" style={{ color: '#f59e0b' }}>{finding.dueDate}</strong></span>
                      </span>

                      <button
                        onClick={() => {
                          setEditingFinding(finding);
                          setFindingModalOpen(true);
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.3rem 0.55rem' }}
                        title="Edit Temuan"
                      >
                        <Edit size={13} />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Hapus temuan ${finding.findingNo}?`)) {
                            deleteAuditFinding(finding.id);
                          }
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.3rem 0.55rem', color: '#ef4444' }}
                        title="Hapus Temuan"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Middle Content: Clause, Target, Description */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', fontSize: '0.825rem' }}>
                      <span className="mono" style={{ fontWeight: 800, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', padding: '0.15rem 0.5rem', borderRadius: '6px' }}>
                        {finding.clauseCode}
                      </span>
                      <strong style={{ color: 'var(--text-main)' }}>{finding.clauseName}</strong>
                      <span style={{ color: 'var(--text-subtle)' }}>•</span>
                      <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {finding.standard === 'DOC' ? <Building2 size={14} color="#10b981" /> : <Ship size={14} color="#38bdf8" />}
                        <span>Target: <strong style={{ color: 'var(--text-main)' }}>{finding.targetName}</strong></span>
                      </span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                      {finding.description}
                    </p>

                    {finding.objectiveEvidence && (
                      <div style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600, marginBottom: '0.2rem' }}>
                          Bukti Objektif Auditor:
                        </span>
                        <span className="mono" style={{ color: 'var(--text-main)' }}>{finding.objectiveEvidence}</span>
                      </div>
                    )}
                  </div>

                  {/* Linked Data Badges (Ship Certificate & Warehouse Requisition) */}
                  {(linkedDoc || linkedReq || finding.linkedCertificateTitle || finding.linkedRequisitionTitle) && (
                    <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', paddingTop: '0.25rem' }}>
                      {(linkedDoc || finding.linkedCertificateTitle) && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.75rem', color: '#10b981' }}>
                          <FileCheck size={14} />
                          <span>Sertifikat Terkait: <strong style={{ color: 'var(--text-main)' }}>{linkedDoc?.name || linkedDoc?.type || finding.linkedCertificateTitle}</strong></span>
                        </div>
                      )}

                      {(linkedReq || finding.linkedRequisitionTitle) && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '0.75rem', color: '#f59e0b' }}>
                          <Package size={14} />
                          <span>Permintaan Gudang: <strong style={{ color: 'var(--text-main)' }}>{linkedReq?.requisitionNumber || linkedReq?.id || finding.linkedRequisitionTitle}</strong></span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bottom Bar: Action Buttons for Evidence Submission & Close */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <User size={13} color="var(--text-subtle)" />
                      <span>Auditor: <strong style={{ color: 'var(--text-main)' }}>{finding.auditor}</strong></span>
                      <span>•</span>
                      <span>PIC: <strong style={{ color: 'var(--text-main)' }}>{finding.assignedTo}</strong></span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button
                        onClick={() => {
                          setEvidenceTargetFinding(finding);
                          setEvidenceModalOpen(true);
                        }}
                        className={`btn btn-sm ${isClosed ? 'btn-secondary' : 'btn-primary'}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                      >
                        <Upload size={14} />
                        <span>{isClosed ? 'Lihat Bukti Eviden' : isSubmitted ? 'Verifikasi / Update Eviden' : 'Submit Bukti Eviden'}</span>
                      </button>

                      {!isClosed && (
                        <button
                          onClick={() => closeAuditFinding(finding.id)}
                          className="btn btn-success btn-sm"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                        >
                          <CheckCircle2 size={14} />
                          <span>Close NC</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: SESI AUDIT ISM */}
      {/* ========================================================================= */}
      {activeView === 'sessions' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.25rem' }}>
          {filteredSessions.map(session => {
            const isInt = session.auditType === 'Internal';
            const isDoc = session.standard === 'DOC';

            const sessionFindings = (allAuditFindings || []).filter(f => f.auditId === session.id);
            const openCount = sessionFindings.filter(f => f.status !== 'NC Close').length;
            const closedCount = sessionFindings.filter(f => f.status === 'NC Close').length;

            return (
              <div key={session.id} className="glass-card" style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* Top Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span className="mono" style={{ fontWeight: 800, fontSize: '0.95rem' }}>{session.auditNo}</span>
                        <span className={`badge ${isInt ? 'badge-info' : 'badge-neutral'}`}>{session.auditType}</span>
                        <span className={`badge ${isDoc ? 'badge-success' : 'badge-warning'}`}>{session.standard}</span>
                      </div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.35rem' }}>{session.targetName}</h4>
                    </div>

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        onClick={() => {
                          setEditingSession(session);
                          setSessionModalOpen(true);
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.3rem 0.5rem' }}
                        title="Edit Sesi"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus sesi audit ${session.auditNo} beserta semua temuannya?`)) {
                            deleteAuditSession(session.id);
                          }
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.3rem 0.5rem', color: '#ef4444' }}
                        title="Hapus Sesi"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {session.scope}
                  </p>

                  {/* Details Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', fontSize: '0.75rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '0.7rem' }}>Lead Auditor:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{session.leadAuditor}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '0.7rem' }}>Auditee:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{session.auditee}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '0.7rem' }}>Tanggal Audit:</span>
                      <span className="mono" style={{ color: 'var(--text-muted)' }}>{session.auditDate}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '0.7rem' }}>Target Close:</span>
                      <span className="mono" style={{ color: '#f59e0b', fontWeight: 700 }}>{session.targetCloseDate}</span>
                    </div>
                  </div>

                  {/* Summary Counters */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Status Temuan Sesi Ini:</span>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <span className="badge badge-danger" style={{ fontSize: '0.72rem' }}>{openCount} Open</span>
                      <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>{closedCount} Close</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <span className={`badge ${session.status === 'Completed' ? 'badge-success' : 'badge-info'}`}>
                    {session.status}
                  </span>

                  <button
                    onClick={() => handleOpenAddFindingForAudit(session.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
                  >
                    <Plus size={13} color="#38bdf8" />
                    <span>Tambah Temuan</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: CHECKLIST STANDAR ISM */}
      {/* ========================================================================= */}
      {activeView === 'checklist' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* DOC Elements */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.65rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Checklist Standar DOC (Document of Compliance - Kantor Pusat)</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Klausul 1 s/d 12 ISM Code IMO Res. A.741(18) untuk Sistem Manajemen Keselamatan Operasional Darat
                  </p>
                </div>
              </div>
              <span className="badge badge-success">12 Elemen Standar</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1rem' }}>
              {ISM_DOC_ELEMENTS.map(elem => (
                <div key={elem.code} style={{ padding: '1.15rem', borderRadius: '10px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div>
                      <span className="mono" style={{ fontWeight: 800, color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem' }}>
                        {elem.code}
                      </span>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.35rem' }}>{elem.name}</h4>
                    </div>
                    <button
                      onClick={() => handleQuickFindingFromChecklist('DOC', elem)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Plus size={12} color="#38bdf8" />
                      <span>Temuan</span>
                    </button>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {elem.description}
                  </p>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 700 }}>Poin Verifikasi Auditor:</span>
                    {elem.checkPoints?.map((cp, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-main)' }}>
                        <Check size={13} color="#10b981" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                        <span>{cp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SMC Elements */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.65rem', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                  <Ship size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Checklist Standar SMC (Safety Management Certificate - Armada Kapal)</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Pemeriksaan kepatuhan implementasi ISM Code di atas kapal (Sertifikat, PMS Mesin, Gudang, Drill, Navigasi)
                  </p>
                </div>
              </div>
              <span className="badge badge-info">6 Area Verifikasi Kapal</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1rem' }}>
              {ISM_SMC_ELEMENTS.map(elem => (
                <div key={elem.code} style={{ padding: '1.15rem', borderRadius: '10px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div>
                      <span className="mono" style={{ fontWeight: 800, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem' }}>
                        {elem.code}
                      </span>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.35rem' }}>{elem.name}</h4>
                    </div>
                    <button
                      onClick={() => handleQuickFindingFromChecklist('SMC', elem)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Plus size={12} color="#38bdf8" />
                      <span>Temuan</span>
                    </button>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {elem.description}
                  </p>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 700 }}>Poin Verifikasi Auditor:</span>
                    {elem.checkPoints?.map((cp, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-main)' }}>
                        <Check size={13} color="#38bdf8" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                        <span>{cp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {sessionModalOpen && (
        <AuditSessionModal
          session={editingSession}
          onClose={() => {
            setSessionModalOpen(false);
            setEditingSession(null);
          }}
        />
      )}

      {findingModalOpen && (
        <AuditFindingModal
          finding={editingFinding}
          defaultAuditId={findingDefaultAuditId}
          onClose={() => {
            setFindingModalOpen(false);
            setEditingFinding(null);
            setFindingDefaultAuditId(null);
          }}
        />
      )}

      {evidenceModalOpen && evidenceTargetFinding && (
        <SubmitEvidenceModal
          finding={evidenceTargetFinding}
          onClose={() => {
            setEvidenceModalOpen(false);
            setEvidenceTargetFinding(null);
          }}
        />
      )}
    </div>
  );
};
