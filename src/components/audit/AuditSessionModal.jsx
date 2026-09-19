import React, { useState, useEffect } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  X,
  ShieldCheck,
  Building2,
  Ship,
  Calendar,
  UserCheck,
  Users,
  FileCheck,
  AlertCircle,
  Save,
  Clock
} from 'lucide-react';

export const AuditSessionModal = ({ session, onClose }) => {
  const {
    vessels,
    selectedVesselId,
    addAuditSession,
    updateAuditSession,
    currentUser
  } = usePMS();

  const isEdit = Boolean(session);

  const [auditType, setAuditType] = useState(session?.auditType || 'Internal');
  const [standard, setStandard] = useState(session?.standard || 'DOC');
  const [targetType, setTargetType] = useState(session?.targetType || (session?.standard === 'SMC' ? 'Vessel' : 'Office'));
  const [vesselId, setVesselId] = useState(
    session?.vesselId ||
    (selectedVesselId && selectedVesselId !== 'all' ? selectedVesselId : vessels[0]?.id || '')
  );
  const [auditNo, setAuditNo] = useState(session?.auditNo || '');
  const [leadAuditor, setLeadAuditor] = useState(session?.leadAuditor || '');
  const [auditTeam, setAuditTeam] = useState(
    session?.auditTeam ? (Array.isArray(session.auditTeam) ? session.auditTeam.join(', ') : session.auditTeam) : ''
  );
  const [auditee, setAuditee] = useState(session?.auditee || '');
  const [auditDate, setAuditDate] = useState(session?.auditDate || new Date().toISOString().split('T')[0]);
  const [targetCloseDate, setTargetCloseDate] = useState(
    session?.targetCloseDate ||
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [scope, setScope] = useState(session?.scope || '');
  const [status, setStatus] = useState(session?.status || 'In Progress');

  // Auto-fill sensible defaults when auditType or standard changes (if not editing)
  useEffect(() => {
    if (!isEdit) {
      const year = new Date().getFullYear();
      const randNum = Math.floor(Math.random() * 900 + 100);
      const prefix = auditType === 'Internal' ? 'INT' : 'EXT';
      setAuditNo(`AUD-${prefix}-${standard}-${year}/${randNum}`);

      if (standard === 'DOC') {
        setTargetType('Office');
        setAuditee('Direktur Operasional, DPA & Manager Logistik');
        setScope('Evaluasi kepatuhan ISM Code klausul 1 s/d 16 pada operasional kantor pusat PT. Pelayaran Baharimas Kalimantan');
        if (auditType === 'Internal') {
          setLeadAuditor('Capt. Bambang Suryono, M.Mar (Lead Auditor DPA)');
          setAuditTeam('Ir. H. Syamsul Bahri (QHSE), Dimas Wicaksono (Fleet Supt)');
        } else {
          setLeadAuditor('Surveyor BKI Cabang Utama Samarinda / Auditor Ditjen Hubla');
          setAuditTeam('Tim Auditor Eksternal Statutory Flag State');
        }
      } else {
        setTargetType('Vessel');
        const vObj = vessels.find(v => v.id === vesselId) || vessels[0];
        setAuditee(`Nakhoda & KKM ${vObj?.name || 'Kapal Armada'}`);
        setScope(`Verifikasi implementasi Safety Management System (SMS) ISM Code di atas kapal ${vObj?.name || 'Armada'}`);
        if (auditType === 'Internal') {
          setLeadAuditor('Capt. Ahmad Fauzi (Marine Safety Inspector / DPA)');
          setAuditTeam('Tim Safety Officer PT. PBK');
        } else {
          setLeadAuditor('Auditor Senior Biro Klasifikasi Indonesia (BKI)');
          setAuditTeam('Surveyor Marine BKI Samarinda');
        }
      }
    }
  }, [auditType, standard, isEdit]);

  const handleVesselChange = (newVId) => {
    setVesselId(newVId);
    if (standard === 'SMC' && !isEdit) {
      const v = vessels.find(item => item.id === newVId);
      setAuditee(`Nakhoda & KKM ${v?.name || 'Kapal'}`);
      setScope(`Verifikasi implementasi Safety Management System (SMS) ISM Code di atas kapal ${v?.name || 'Armada'}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedVessel = targetType === 'Vessel' ? vessels.find(v => v.id === vesselId) : null;
    const targetName = targetType === 'Vessel'
      ? (selectedVessel?.name || 'Kapal Armada PBK')
      : 'Kantor Pusat PT. Pelayaran Baharimas Kalimantan (Samarinda)';

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
      auditDate,
      targetCloseDate,
      scope: scope.trim(),
      status
    };

    if (isEdit) {
      updateAuditSession(session.id, payload);
    } else {
      addAuditSession(payload);
    }

    onClose();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal-dialog" style={{ maxWidth: '680px' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              padding: '0.5rem',
              borderRadius: '10px',
              background: auditType === 'Internal' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(168, 85, 247, 0.15)',
              color: auditType === 'Internal' ? '#06b6d4' : '#a855f7'
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                {isEdit ? 'Edit Sesi Audit ISM Code' : 'Buat Sesi Audit Baru'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {auditType === 'Internal' ? 'Audit Internal (DPA PBK)' : 'Audit Eksternal (BKI / Ditjen Hubla)'} • Standar {standard}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.6rem' }}>
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {/* Row 1: Audit Type & Standard */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Jenis Audit (Internal / Eksternal) *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setAuditType('Internal')}
                    className={`btn btn-sm ${auditType === 'Internal' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.78rem' }}
                  >
                    <UserCheck size={13} />
                    <span>Internal PBK</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuditType('External')}
                    className={`btn btn-sm ${auditType === 'External' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.78rem' }}
                  >
                    <ShieldCheck size={13} />
                    <span>Eksternal BKI</span>
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Standar Audit (DOC / SMC) *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setStandard('DOC');
                      setTargetType('Office');
                    }}
                    className={`btn btn-sm ${standard === 'DOC' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.78rem' }}
                  >
                    <Building2 size={13} />
                    <span>DOC (Kantor)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStandard('SMC');
                      setTargetType('Vessel');
                    }}
                    className={`btn btn-sm ${standard === 'SMC' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.78rem' }}
                  >
                    <Ship size={13} />
                    <span>SMC (Kapal)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Row 2: Target & Audit No */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Nomor Register Audit *
                </label>
                <input
                  type="text"
                  required
                  value={auditNo}
                  onChange={(e) => setAuditNo(e.target.value)}
                  placeholder="contoh: AUD-INT-DOC-2026/101"
                  className="input-control mono"
                  style={{ fontWeight: 700 }}
                />
              </div>

              {targetType === 'Vessel' ? (
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Target Kapal Armada *
                  </label>
                  <select
                    value={vesselId}
                    onChange={(e) => handleVesselChange(e.target.value)}
                    className="select-control"
                  >
                    {vessels.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.type || 'Tugboat'})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Target Audit
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Kantor Pusat PT. Pelayaran Baharimas Kalimantan"
                    className="input-control"
                    style={{ opacity: 0.75, cursor: 'not-allowed' }}
                  />
                </div>
              )}
            </div>

            {/* Row 3: Lead Auditor & Team */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Lead Auditor *
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
                  Tim Auditor (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={auditTeam}
                  onChange={(e) => setAuditTeam(e.target.value)}
                  placeholder="contoh: Ir. Syamsul, Capt. Ahmad"
                  className="input-control"
                />
              </div>
            </div>

            {/* Row 4: Auditee & Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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

            {/* Row 5: Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Tanggal Pelaksanaan Audit *
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
                  Target Penutupan NC (Batas Waktu Close) *
                </label>
                <input
                  type="date"
                  required
                  value={targetCloseDate}
                  onChange={(e) => setTargetCloseDate(e.target.value)}
                  className="input-control mono"
                />
              </div>
            </div>

            {/* Scope */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                Ruang Lingkup & Sasaran Audit (Scope) *
              </label>
              <textarea
                required
                rows={3}
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                placeholder="Jelaskan sasaran dan klausul ISM Code yang diperiksa..."
                className="input-control"
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Notice Info Box */}
            <div style={{
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              background: 'rgba(2, 132, 199, 0.08)',
              border: '1px solid rgba(2, 132, 199, 0.25)',
              display: 'flex',
              gap: '0.65rem',
              alignItems: 'flex-start',
              fontSize: '0.78rem'
            }}>
              <AlertCircle size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
              <div>
                <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.15rem' }}>Ketentuan Standar ISM Code PT. PBK:</strong>
                <span style={{ color: 'var(--text-muted)' }}>
                  Sesi audit {auditType} {standard} akan mendokumentasikan temuan Non-Conformity (Major NC, Minor NC, Observasi). Temuan terbuka (NC Open) wajib diselesaikan melalui pengajuan eviden perbaikan sebelum ditutup resmi (NC Close).
                </span>
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
              <span>{isEdit ? 'Simpan Perubahan Sesi' : 'Buat Sesi Audit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
