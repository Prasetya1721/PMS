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
  Link,
  Maximize2,
  Minimize2
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const availableAudits = audits.length > 0 ? audits : allAudits;

  const [auditId, setAuditId] = useState(
    finding?.auditId || defaultAuditId || availableAudits[0]?.id || ''
  );

  const currentAudit = availableAudits.find(a => a.id === auditId) || availableAudits[0];

  const standard = currentAudit?.standard || 'DOC';
  const auditType = currentAudit?.auditType || 'Internal';

  const [isManualClause, setIsManualClause] = useState(false);
  const [clauseCode, setClauseCode] = useState(finding?.clauseCode || 'ISM-10');
  const [clauseName, setClauseName] = useState(finding?.clauseName || 'Pemeliharaan Kapal & Perlengkapan');

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

  const [linkedCertificateId, setLinkedCertificateId] = useState(finding?.linkedCertificateId || '');
  const [linkedRequisitionId, setLinkedRequisitionId] = useState(finding?.linkedRequisitionId || '');

  useEffect(() => {
    if (!isEdit && !findingNo) {
      const rand = Math.floor(Math.random() * 9000 + 1000);
      setFindingNo(`NC-${standard}-${rand}`);
    }
  }, [isEdit, standard, findingNo]);

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

  const handleStandardClauseChange = (code) => {
    setClauseCode(code);
    const elementsList = standard === 'DOC' ? ISM_DOC_ELEMENTS : ISM_SMC_ELEMENTS;
    const matched = elementsList.find(e => e.code === code);
    if (matched) {
      setClauseName(matched.name);
    }
  };

  const relevantCertificates = (shipDocuments || []).filter(doc => {
    if (currentAudit?.standard === 'DOC') {
      return doc.type?.toLowerCase().includes('doc') || doc.type?.toLowerCase().includes('compliance') || doc.vesselId === 'all';
    }
    if (currentAudit?.vesselId) {
      return doc.vesselId === currentAudit.vesselId;
    }
    return true;
  });

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
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div
        className={isFullscreen ? 'modal-fullscreen' : 'modal-dialog'}
        style={{
          maxWidth: isFullscreen ? '98vw' : '720px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              padding: '0.5rem',
              borderRadius: '10px',
              background: category === 'Major NC' ? 'rgba(239, 68, 68, 0.15)' : category === 'Minor NC' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(2, 132, 199, 0.15)',
              color: category === 'Major NC' ? '#ef4444' : category === 'Minor NC' ? '#f59e0b' : '#0284c7'
            }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                {isEdit ? `Edit Temuan Audit (${finding?.findingNo})` : 'Catat Temuan Ketidaksesuaian (NC Open)'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Audit {currentAudit?.auditType} • Standar {currentAudit?.standard} ({currentAudit?.targetName})
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.6rem' }}
              title={isFullscreen ? 'Kecilkan Layar' : 'Layar Penuh (Fullscreen)'}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              <span style={{ fontSize: '0.75rem' }}>{isFullscreen ? 'Normal' : 'Fullscreen'}</span>
            </button>
            <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.6rem' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="modal-body" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {/* Row 1: Audit Session & Finding No */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Pilih Sesi Audit ISM *
                </label>
                <select
                  value={auditId}
                  disabled={isEdit}
                  onChange={(e) => setAuditId(e.target.value)}
                  className="select-control"
                  style={{ opacity: isEdit ? 0.7 : 1 }}
                >
                  {availableAudits.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.auditNo} - {a.auditType} {a.standard} ({a.targetName?.slice(0, 24)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Nomor Temuan (NC Code) *
                </label>
                <input
                  type="text"
                  required
                  value={findingNo}
                  onChange={(e) => setFindingNo(e.target.value)}
                  placeholder="contoh: NC-DOC-102"
                  className="input-control mono"
                  style={{ fontWeight: 700 }}
                />
              </div>
            </div>

            {/* Row 2: Category & Clause Mode Toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Kategori Temuan (Severity) *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={() => setCategory('Major NC')}
                    className={`btn btn-sm ${category === 'Major NC' ? 'btn-danger' : 'btn-secondary'}`}
                    style={{ fontSize: '0.72rem', padding: '0.35rem 0.2rem' }}
                  >
                    Major NC
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('Minor NC')}
                    className={`btn btn-sm ${category === 'Minor NC' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.72rem', padding: '0.35rem 0.2rem' }}
                  >
                    Minor NC
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('Observation')}
                    className={`btn btn-sm ${category === 'Observation' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.72rem', padding: '0.35rem 0.2rem' }}
                  >
                    Observasi
                  </button>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Mode Klausul ISM
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsManualClause(!isManualClause)}
                    style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Code size={12} />
                    <span>{isManualClause ? 'Daftar Standar' : '✍️ Input Manual'}</span>
                  </button>
                </div>

                {isManualClause ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <input
                      type="text"
                      required
                      value={clauseCode}
                      onChange={(e) => setClauseCode(e.target.value)}
                      placeholder="Kode Klausul Manual (cth: ISM-10.3)"
                      className="input-control mono"
                      style={{ fontWeight: 700, color: '#0284c7' }}
                    />
                    <input
                      type="text"
                      required
                      value={clauseName}
                      onChange={(e) => setClauseName(e.target.value)}
                      placeholder="Judul / Deskripsi Klausul"
                      className="input-control"
                      style={{ fontSize: '0.8rem' }}
                    />
                  </div>
                ) : (
                  <select
                    value={clauseCode}
                    onChange={(e) => handleStandardClauseChange(e.target.value)}
                    className="select-control"
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

            {/* Row 3: Description */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                Uraian Ketidaksesuaian (Description of Non-Conformity) *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan kondisi ketidaksesuaian yang ditemukan terhadap prosedur ISM Code..."
                className="input-control"
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Row 4: Objective Evidence */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                Bukti Objektif Auditor (Objective Evidence) *
              </label>
              <textarea
                required
                rows={2}
                value={objectiveEvidence}
                onChange={(e) => setObjectiveEvidence(e.target.value)}
                placeholder="Fakta fisik, catatan dokumen, atau hasil observasi yang menjadi dasar temuan..."
                className="input-control"
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Row 5: Linked Certificate & Linked Requisition */}
            <div style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
                <Link size={14} color="#0284c7" />
                <span>Integrasi Data Sertifikat Kapal & Permintaan Barang Gudang:</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
                    Tautan Data Sertifikat Kapal
                  </label>
                  <select
                    value={linkedCertificateId}
                    onChange={(e) => setLinkedCertificateId(e.target.value)}
                    className="select-control"
                    style={{ fontSize: '0.78rem' }}
                  >
                    <option value="">-- Tidak Terkait Sertifikat Spesifik --</option>
                    {relevantCertificates.slice(0, 30).map(cert => (
                      <option key={cert.id} value={cert.id}>
                        {cert.name || cert.type} ({cert.documentNumber || 'No. Dok'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
                    Tautan Permintaan Barang ke Gudang
                  </label>
                  <select
                    value={linkedRequisitionId}
                    onChange={(e) => setLinkedRequisitionId(e.target.value)}
                    className="select-control"
                    style={{ fontSize: '0.78rem' }}
                  >
                    <option value="">-- Belum Ada / Input Nanti --</option>
                    {relevantRequisitions.map(req => (
                      <option key={req.id} value={req.id}>
                        {req.requisitionNumber || req.id} - {req.title || req.department || 'Material Requisition'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Row 6: PIC, Auditor, Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  PIC Penanggung Jawab
                </label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="cth: KKM / Masinis"
                  className="input-control"
                  style={{ fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Auditor ISM
                </label>
                <input
                  type="text"
                  value={auditor}
                  onChange={(e) => setAuditor(e.target.value)}
                  placeholder="Nama Auditor"
                  className="input-control"
                  style={{ fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Batas Waktu Close *
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="input-control mono"
                  style={{ fontSize: '0.8rem' }}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Batal
            </button>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Save size={15} />
              <span>{isEdit ? 'Simpan Perubahan Temuan' : 'Catat Temuan (NC Open)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
