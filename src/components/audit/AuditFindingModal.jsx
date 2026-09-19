import React, { useState, useEffect } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  X,
  AlertTriangle,
  FileCheck,
  Package,
  Ship,
  Building2,
  Calendar,
  User,
  Save,
  Tag,
  Code,
  FileText,
  HelpCircle,
  Link,
  ChevronDown
} from 'lucide-react';

export const AuditFindingModal = ({ finding, defaultAuditId, onClose }) => {
  const {
    audits,
    allAudits,
    vessels,
    shipDocuments,
    crewCertificates,
    requisitions,
    addAuditFinding,
    updateAuditFinding,
    ISM_DOC_ELEMENTS,
    ISM_SMC_ELEMENTS
  } = usePMS();

  const isEdit = Boolean(finding);

  // Available audit sessions
  const availableAudits = audits.length > 0 ? audits : allAudits;

  // Selected audit session
  const [auditId, setAuditId] = useState(
    finding?.auditId || defaultAuditId || availableAudits[0]?.id || ''
  );

  const currentAudit = availableAudits.find(a => a.id === auditId) || availableAudits[0];

  // Standard & Type inherited from currentAudit, or overridable
  const standard = currentAudit?.standard || 'DOC';
  const auditType = currentAudit?.auditType || 'Internal';

  // Manual vs Standard Clause Selection mode
  const [isManualClause, setIsManualClause] = useState(false);
  const [clauseCode, setClauseCode] = useState(finding?.clauseCode || 'ISM-10');
  const [clauseName, setClauseName] = useState(finding?.clauseName || 'Pemeliharaan Kapal & Perlengkapan');

  // Finding Details
  const [findingNo, setFindingNo] = useState(finding?.findingNo || '');
  const [category, setCategory] = useState(finding?.category || 'Minor NC');
  const [description, setDescription] = useState(finding?.description || '');
  const [objectiveEvidence, setObjectiveEvidence] = useState(finding?.objectiveEvidence || '');
  const [assignedTo, setAssignedTo] = useState(finding?.assignedTo || '');
  const [auditor, setAuditor] = useState(finding?.auditor || currentAudit?.leadAuditor || '');
  const [dueDate, setDueDate] = useState(
    finding?.dueDate ||
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [dateIdentified, setDateIdentified] = useState(
    finding?.dateIdentified || new Date().toISOString().split('T')[0]
  );

  // Linked Certificate (Data Sertifikat)
  const [linkedCertificateId, setLinkedCertificateId] = useState(finding?.linkedCertificateId || '');

  // Linked Material Requisition (Permintaan Barang ke Gudang)
  const [linkedRequisitionId, setLinkedRequisitionId] = useState(finding?.linkedRequisitionId || '');

  // Auto-generate findingNo if creating new
  useEffect(() => {
    if (!isEdit && !findingNo) {
      const rand = Math.floor(Math.random() * 9000 + 1000);
      setFindingNo(`NC-${standard}-${rand}`);
    }
  }, [isEdit, standard, findingNo]);

  // Update default auditor & assignedTo when audit changes
  useEffect(() => {
    if (currentAudit && !isEdit) {
      if (currentAudit.leadAuditor) setAuditor(currentAudit.leadAuditor);
      if (currentAudit.standard === 'DOC') {
        setAssignedTo('Manager QHSE / Staff Logistik Darat');
      } else {
        const v = vessels.find(item => item.id === currentAudit.vesselId);
        setAssignedTo(`KKM / Masinis 1 (${v?.name || 'Kapal'})`);
      }
    }
  }, [currentAudit, isEdit, vessels]);

  // Handle standard clause selection
  const handleStandardClauseChange = (code) => {
    setClauseCode(code);
    const elementsList = standard === 'DOC' ? ISM_DOC_ELEMENTS : ISM_SMC_ELEMENTS;
    const matched = elementsList.find(e => e.code === code);
    if (matched) {
      setClauseName(matched.name);
    }
  };

  // Filter certificates relevant to this finding / vessel
  const relevantCertificates = (shipDocuments || []).filter(doc => {
    if (currentAudit?.standard === 'DOC') {
      return doc.type?.toLowerCase().includes('doc') || doc.type?.toLowerCase().includes('compliance') || doc.vesselId === 'all';
    }
    if (currentAudit?.vesselId) {
      return doc.vesselId === currentAudit.vesselId;
    }
    return true;
  });

  // Filter requisitions relevant to this finding / vessel
  const relevantRequisitions = (requisitions || []).filter(req => {
    if (currentAudit?.vesselId) {
      return req.vesselId === currentAudit.vesselId;
    }
    return true;
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const linkedReqObj = requisitions.find(r => r.id === linkedRequisitionId);
    const linkedDocObj = shipDocuments.find(d => d.id === linkedCertificateId);

    const payload = {
      findingNo: findingNo.trim() || `NC-${standard}-${Math.floor(Math.random() * 9000 + 1000)}`,
      auditId: currentAudit?.id || auditId,
      auditNo: currentAudit?.auditNo || 'AUD-ISM',
      auditType: currentAudit?.auditType || auditType,
      standard: currentAudit?.standard || standard,
      targetName: currentAudit?.targetName || (currentAudit?.vesselId ? (vessels.find(v => v.id === currentAudit.vesselId)?.name) : 'Kantor Pusat'),
      vesselId: currentAudit?.vesselId || null,
      clauseCode: clauseCode.trim(),
      clauseName: clauseName.trim(),
      category,
      description: description.trim(),
      objectiveEvidence: objectiveEvidence.trim(),
      dateIdentified,
      dueDate,
      assignedTo: assignedTo.trim() || 'PIC Terkait',
      auditor: auditor.trim() || currentAudit?.leadAuditor || 'Auditor ISM',
      linkedCertificateId: linkedCertificateId || null,
      linkedCertificateTitle: linkedDocObj ? `${linkedDocObj.name || linkedDocObj.type} (${linkedDocObj.documentNumber || 'No. Reg'})` : null,
      linkedRequisitionId: linkedRequisitionId || null,
      linkedRequisitionTitle: linkedReqObj ? `${linkedReqObj.requisitionNumber || linkedReqObj.id} - ${linkedReqObj.title || linkedReqObj.department || 'Permintaan Gudang'}` : null
    };

    if (isEdit) {
      updateAuditFinding(finding.id, payload);
    } else {
      addAuditFinding(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl text-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              category === 'Major NC'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : category === 'Minor NC'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                {isEdit ? `Edit Temuan Audit (${finding?.findingNo})` : 'Catat Temuan Ketidaksesuaian (NC Open)'}
              </h3>
              <p className="text-xs text-slate-400">
                Audit {currentAudit?.auditType} • Standar {currentAudit?.standard} ({currentAudit?.targetName})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Row 1: Sesi Audit & Finding No */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Pilih Sesi Audit ISM <span className="text-rose-400">*</span>
              </label>
              <select
                value={auditId}
                disabled={isEdit}
                onChange={(e) => setAuditId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-60"
              >
                {availableAudits.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.auditNo} - {a.auditType} {a.standard} ({a.targetName?.slice(0, 22)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nomor Temuan (NC Code) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={findingNo}
                onChange={(e) => setFindingNo(e.target.value)}
                placeholder="contoh: NC-DOC-102"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Row 2: Category & Clause Mode Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kategori Temuan (Severity) <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCategory('Major NC')}
                  className={`py-2 px-2 text-xs font-bold rounded-lg border transition text-center ${
                    category === 'Major NC'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 ring-1 ring-rose-500'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  Major NC
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('Minor NC')}
                  className={`py-2 px-2 text-xs font-bold rounded-lg border transition text-center ${
                    category === 'Minor NC'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  Minor NC
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('Observation')}
                  className={`py-2 px-2 text-xs font-bold rounded-lg border transition text-center ${
                    category === 'Observation'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300 ring-1 ring-blue-500'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  Observasi
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Mode Klausul ISM Code
                </label>
                <button
                  type="button"
                  onClick={() => setIsManualClause(!isManualClause)}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
                >
                  <Code className="w-3.5 h-3.5" />
                  {isManualClause ? 'Gunakan Checklist Standar' : '✍️ Input Manual Klausul'}
                </button>
              </div>

              {isManualClause ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    value={clauseCode}
                    onChange={(e) => setClauseCode(e.target.value)}
                    placeholder="Kode Klausul Manual (cth: ISM-10.3 / SOLAS-II)"
                    className="w-full bg-slate-950 border border-blue-600/50 rounded-lg px-3 py-2 text-sm text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    required
                    value={clauseName}
                    onChange={(e) => setClauseName(e.target.value)}
                    placeholder="Judul / Deskripsi Klausul"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
              ) : (
                <select
                  value={clauseCode}
                  onChange={(e) => handleStandardClauseChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {(standard === 'DOC' ? ISM_DOC_ELEMENTS : ISM_SMC_ELEMENTS).map(elem => (
                    <option key={elem.code} value={elem.code}>
                      {elem.code} - {elem.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Row 3: Description of Non-Conformity */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Uraian Ketidaksesuaian (Description of Non-Conformity) <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan kondisi ketidaksesuaian yang ditemukan terhadap prosedur ISM Code..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Row 4: Objective Evidence */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Bukti Objektif Auditor (Objective Evidence) <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={objectiveEvidence}
              onChange={(e) => setObjectiveEvidence(e.target.value)}
              placeholder="Fakta fisik, catatan dokumen, atau hasil wawancara yang menjadi dasar temuan..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Row 5: Linked Certificate & Linked Requisition */}
          <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Link className="w-3.5 h-3.5 text-blue-400" />
              Integrasi Data Kapal & Logistik Gudang:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Linked Ship Certificate */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Tautan Data Sertifikat Kapal
                </label>
                <select
                  value={linkedCertificateId}
                  onChange={(e) => setLinkedCertificateId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Tidak Terkait Sertifikat Spesifik --</option>
                  {relevantCertificates.slice(0, 30).map(cert => (
                    <option key={cert.id} value={cert.id}>
                      {cert.name || cert.type} ({cert.documentNumber || 'No. Dok'})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Pilih sertifikat kapal yang terkait temuan (DOC BKI, SMC, SAFCON, dll.)
                </p>
              </div>

              {/* Linked Warehouse Requisition */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-amber-400" />
                  Tautan Permintaan Barang ke Gudang
                </label>
                <select
                  value={linkedRequisitionId}
                  onChange={(e) => setLinkedRequisitionId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Belum Ada / Input Nanti --</option>
                  {relevantRequisitions.map(req => (
                    <option key={req.id} value={req.id}>
                      {req.requisitionNumber || req.id} - {req.title || req.department || 'Material Requisition'}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Hubungkan dengan nomor surat permintaan barang jika butuh sparepart untuk closing NC
                </p>
              </div>
            </div>
          </div>

          {/* Row 6: PIC, Auditor, Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                PIC Penanggung Jawab
              </label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="cth: KKM / Safety Supt"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Auditor ISM
              </label>
              <input
                type="text"
                value={auditor}
                onChange={(e) => setAuditor(e.target.value)}
                placeholder="Nama Auditor"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Batas Waktu Close (Due Date) <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white shadow-lg shadow-amber-500/20 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isEdit ? 'Simpan Perubahan Temuan' : 'Catat Temuan (NC Open)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
