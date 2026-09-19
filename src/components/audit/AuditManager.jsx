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

  // Handler for opening add finding with specific audit session
  const handleOpenAddFindingForAudit = (auditId) => {
    setFindingDefaultAuditId(auditId);
    setEditingFinding(null);
    setFindingModalOpen(true);
  };

  // Handler for checklist quick finding creation
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
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-8 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Audit & Kepatuhan ISM Code
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  DOC & SMC Baharimas
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Manajemen Audit Keselamatan Maritim (Internal & Eksternal) sesuai Standar IMO ISM Code Resolusi A.741(18).
                Mencakup <strong>DOC Kantor Pusat</strong> dan <strong>SMC 28 Kapal Armada</strong>, pelacakan status <strong>NC Open & NC Close</strong>, integrasi sertifikat kapal & permintaan barang ke gudang.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                setEditingSession(null);
                setSessionModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              Sesi Audit Baru
            </button>
            <button
              onClick={() => {
                setEditingFinding(null);
                setFindingDefaultAuditId(null);
                setFindingModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white shadow-lg shadow-amber-500/20 transition flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Catat Temuan NC Manual
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Scorecard */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Total Sesi Audit */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold">Sesi Audit ISM</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{stats.totalSessions}</div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1.5 pt-1.5 border-t border-slate-800/80">
            <span className="text-cyan-400 font-semibold">{stats.intSessions} Internal</span>
            <span>•</span>
            <span className="text-purple-400 font-semibold">{stats.extSessions} Eksternal</span>
          </div>
        </div>

        {/* Card 2: Total Temuan */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold">Total Temuan ISM</span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{stats.totalFindings}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1.5 pt-1.5 border-t border-slate-800/80">
            <span className="text-rose-400 font-semibold">{stats.majorCount} Major</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">{stats.minorCount} Minor</span>
            <span>•</span>
            <span className="text-blue-400 font-semibold">{stats.obsCount} Obs</span>
          </div>
        </div>

        {/* Card 3: NC OPEN (Perlu Perbaikan) */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-800/50 text-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-xs text-rose-300 mb-1.5">
            <span className="font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              NC OPEN
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 tracking-tight">{stats.openCount}</div>
          <p className="text-[11px] text-rose-300/80 mt-1.5 pt-1.5 border-t border-rose-800/30">
            Perlu tindakan perbaikan & bukti eviden segera
          </p>
        </div>

        {/* Card 4: EVIDEN SUBMITTED */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/50 text-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-xs text-amber-300 mb-1.5">
            <span className="font-bold">EVIDEN DIAJUKAN</span>
            <Upload className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 tracking-tight">{stats.submittedCount}</div>
          <p className="text-[11px] text-amber-300/80 mt-1.5 pt-1.5 border-t border-amber-800/30">
            Menunggu verifikasi Lead Auditor / DPA
          </p>
        </div>

        {/* Card 5: NC CLOSE */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/50 text-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-xs text-emerald-300 mb-1.5">
            <span className="font-bold">NC CLOSE</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">{stats.closedCount}</div>
          <p className="text-[11px] text-emerald-300/80 mt-1.5 pt-1.5 border-t border-emerald-800/30">
            Selesai diverifikasi & ditutup resmi
          </p>
        </div>
      </div>

      {/* Main View Mode Selector & Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
        {/* Row 1: View Mode Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveView('findings')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeView === 'findings'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Daftar Temuan NC & Eviden ({filteredFindings.length})
            </button>
            <button
              onClick={() => setActiveView('sessions')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeView === 'sessions'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Sesi Audit ISM ({filteredSessions.length})
            </button>
            <button
              onClick={() => setActiveView('checklist')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeView === 'checklist'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Checklist Standar DOC & SMC
            </button>
          </div>

          {/* Quick Vessel Scope Indicator */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Filter Kapal:</span>
            <select
              value={selectedVesselId}
              onChange={(e) => setSelectedVesselId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Semua Armada & Kantor (Fleet-wide)</option>
              {vessels.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Secondary Filters & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Filter:
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
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                  typeFilter === tab.id
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}

            {/* Status Filter (Active on Findings view) */}
            {activeView === 'findings' && (
              <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-slate-800">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">Semua Status NC</option>
                  <option value="NC Open">🔴 NC Open</option>
                  <option value="Eviden Submitted">🟡 Eviden Submitted</option>
                  <option value="NC Close">🟢 NC Close</option>
                </select>

                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
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
          <div className="relative min-w-[240px] max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari klausul, no temuan, auditor..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: DAFTAR TEMUAN & EVIDEN (FINDINGS VIEW) */}
      {/* ========================================================================= */}
      {activeView === 'findings' && (
        <div className="space-y-4">
          {filteredFindings.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              <ShieldCheck className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <h3 className="text-base font-bold text-white mb-1">
                Tidak Ada Temuan Ketidaksesuaian Ditemukan
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                Semua item audit sesuai kriteria filter atau belum ada temuan yang dicatat. Anda dapat mencatat temuan manual kapan saja.
              </p>
              <button
                onClick={() => {
                  setEditingFinding(null);
                  setFindingModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-xs rounded-xl hover:opacity-95 transition"
              >
                + Catat Temuan Baru Sekarang
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredFindings.map(finding => {
                const isClosed = finding.status === 'NC Close';
                const isSubmitted = finding.status === 'Eviden Submitted';
                const isOpen = finding.status === 'NC Open';

                const linkedDoc = finding.linkedCertificateId
                  ? shipDocuments.find(d => d.id === finding.linkedCertificateId)
                  : null;

                const linkedReq = finding.linkedRequisitionId
                  ? requisitions.find(r => r.id === finding.linkedRequisitionId)
                  : null;

                return (
                  <div
                    key={finding.id}
                    className={`bg-slate-900 rounded-2xl border transition hover:border-slate-700 overflow-hidden shadow-sm ${
                      isOpen
                        ? 'border-rose-900/40 bg-gradient-to-r from-rose-950/10 via-slate-900 to-slate-900'
                        : isSubmitted
                        ? 'border-amber-900/40 bg-gradient-to-r from-amber-950/10 via-slate-900 to-slate-900'
                        : 'border-slate-800'
                    }`}
                  >
                    <div className="p-5 space-y-4">
                      {/* Top Bar: Finding No, Status, Category, Standard */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-bold text-white tracking-wide">
                            {finding.findingNo}
                          </span>

                          {/* Status Badge */}
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                            isClosed
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : isSubmitted
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isClosed ? 'bg-emerald-400' : isSubmitted ? 'bg-amber-400' : 'bg-rose-400 animate-pulse'
                            }`} />
                            {finding.status}
                          </span>

                          {/* Severity Category */}
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            finding.category === 'Major NC'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : finding.category === 'Minor NC'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {finding.category}
                          </span>

                          {/* Standard & Type */}
                          <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 font-medium">
                            {finding.auditType} {finding.standard}
                          </span>
                        </div>

                        {/* Due date & Action buttons */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            Due: <strong className="text-slate-200">{finding.dueDate}</strong>
                          </span>

                          <button
                            onClick={() => {
                              setEditingFinding(finding);
                              setFindingModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                            title="Edit Temuan"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Hapus temuan ${finding.findingNo}?`)) {
                                deleteAuditFinding(finding.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                            title="Hapus Temuan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Middle: Target, Clause, Description */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-cyan-300 font-mono font-bold">
                            {finding.clauseCode}
                          </span>
                          <span className="font-semibold text-slate-200">
                            {finding.clauseName}
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 flex items-center gap-1">
                            {finding.standard === 'DOC' ? (
                              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Ship className="w-3.5 h-3.5 text-blue-400" />
                            )}
                            Target: <strong className="text-slate-300">{finding.targetName}</strong>
                          </span>
                        </div>

                        <p className="text-sm text-slate-200 leading-relaxed">
                          {finding.description}
                        </p>

                        {finding.objectiveEvidence && (
                          <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono">
                            <span className="text-slate-500 block mb-0.5 font-sans font-semibold">Bukti Objektif:</span>
                            {finding.objectiveEvidence}
                          </div>
                        )}
                      </div>

                      {/* Linked Data Badges (Ship Certificate & Warehouse Requisition) */}
                      {(linkedDoc || linkedReq || finding.linkedCertificateTitle || finding.linkedRequisitionTitle) && (
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                          {(linkedDoc || finding.linkedCertificateTitle) && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-xs">
                              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Sertifikat: <strong>{linkedDoc?.name || linkedDoc?.type || finding.linkedCertificateTitle}</strong></span>
                            </div>
                          )}

                          {(linkedReq || finding.linkedRequisitionTitle) && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-amber-300 text-xs">
                              <Package className="w-3.5 h-3.5 text-amber-400" />
                              <span>Permintaan Gudang: <strong>{linkedReq?.requisitionNumber || linkedReq?.id || finding.linkedRequisitionTitle}</strong></span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Bottom Bar: Action Buttons for Evidence Submission & Closing */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 bg-slate-950/30 -mx-5 -mb-5 p-4 rounded-b-2xl">
                        <div className="text-xs text-slate-400 flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          <span>Auditor: <strong className="text-slate-300">{finding.auditor}</strong></span>
                          <span>•</span>
                          <span>PIC: <strong className="text-slate-300">{finding.assignedTo}</strong></span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEvidenceTargetFinding(finding);
                              setEvidenceModalOpen(true);
                            }}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                              isClosed
                                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-sm'
                            }`}
                          >
                            <Upload className="w-3.5 h-3.5" />
                            {isClosed ? 'Lihat Bukti Eviden' : isSubmitted ? 'Verifikasi / Update Eviden' : 'Submit Bukti Eviden'}
                          </button>

                          {!isClosed && (
                            <button
                              onClick={() => {
                                closeAuditFinding(finding.id);
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 transition flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Close NC
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: SESI AUDIT ISM (SESSIONS VIEW) */}
      {/* ========================================================================= */}
      {activeView === 'sessions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSessions.map(session => {
            const isInt = session.auditType === 'Internal';
            const isDoc = session.standard === 'DOC';

            // Related findings for this session
            const sessionFindings = (allAuditFindings || []).filter(f => f.auditId === session.id);
            const openCount = sessionFindings.filter(f => f.status !== 'NC Close').length;
            const closedCount = sessionFindings.filter(f => f.status === 'NC Close').length;

            return (
              <div
                key={session.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top: Audit No & Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-white">
                          {session.auditNo}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          isInt ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}>
                          {session.auditType}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          isDoc ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {session.standard}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-200 text-sm mt-1">
                        {session.targetName}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingSession(session);
                          setSessionModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title="Edit Sesi Audit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus sesi audit ${session.auditNo} beserta semua temuannya?`)) {
                            deleteAuditSession(session.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                        title="Hapus Sesi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Scope */}
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {session.scope}
                  </p>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Lead Auditor:</span>
                      <span className="font-semibold text-slate-200 truncate block">{session.leadAuditor}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Auditee:</span>
                      <span className="font-semibold text-slate-200 truncate block">{session.auditee}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Tanggal Pelaksanaan:</span>
                      <span className="font-semibold text-slate-300 block">{session.auditDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Target Close:</span>
                      <span className="font-semibold text-amber-300 block">{session.targetCloseDate}</span>
                    </div>
                  </div>

                  {/* Finding Summary Counters */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400">Status Temuan Sesi Ini:</span>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-500/20 text-rose-300">
                        {openCount} Open
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-300">
                        {closedCount} Close
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    session.status === 'Completed'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {session.status}
                  </span>

                  <button
                    onClick={() => handleOpenAddFindingForAudit(session.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-cyan-400" />
                    Tambah Temuan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: CHECKLIST STANDAR ISM (DOC & SMC REFERENCE) */}
      {/* ========================================================================= */}
      {activeView === 'checklist' && (
        <div className="space-y-6">
          {/* DOC Elements (Office) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    Checklist Standar DOC (Document of Compliance - Kantor Pusat)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Klausul 1 s/d 12 ISM Code IMO Resolution A.741(18) untuk Sistem Manajemen Keselamatan di Darat
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300">
                12 Elemen Standar
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ISM_DOC_ELEMENTS.map(elem => (
                <div
                  key={elem.code}
                  className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2.5 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {elem.code}
                      </span>
                      <h4 className="font-bold text-slate-200 text-sm mt-1">
                        {elem.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleQuickFindingFromChecklist('DOC', elem)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition shrink-0 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Temuan
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {elem.description}
                  </p>

                  <div className="space-y-1 pt-1.5 border-t border-slate-800/60">
                    <span className="text-[10px] text-slate-500 font-semibold block">Poin Verifikasi Auditor:</span>
                    {elem.checkPoints?.map((cp, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{cp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SMC Elements (Vessels) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Ship className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    Checklist Standar SMC (Safety Management Certificate - Operasional Kapal)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Pemeriksaan implementasi ISM Code di atas kapal armada Baharimas (Sertifikat, PMS Mesin, Logistik, Drill, Navigasi)
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300">
                6 Area Verifikasi Kapal
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ISM_SMC_ELEMENTS.map(elem => (
                <div
                  key={elem.code}
                  className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2.5 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                        {elem.code}
                      </span>
                      <h4 className="font-bold text-slate-200 text-sm mt-1">
                        {elem.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleQuickFindingFromChecklist('SMC', elem)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition shrink-0 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Temuan
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {elem.description}
                  </p>

                  <div className="space-y-1 pt-1.5 border-t border-slate-800/60">
                    <span className="text-[10px] text-slate-500 font-semibold block">Poin Verifikasi Auditor:</span>
                    {elem.checkPoints?.map((cp, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
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
