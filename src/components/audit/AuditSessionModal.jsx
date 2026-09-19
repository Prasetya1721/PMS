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

  // Update auditee and scope if vessel changes when standard is SMC
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl text-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${auditType === 'Internal' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                {isEdit ? 'Edit Sesi Audit ISM Code' : 'Buat Sesi Audit Baru'}
              </h3>
              <p className="text-xs text-slate-400">
                {auditType === 'Internal' ? 'Audit Internal (DPA / Auditor PBK)' : 'Audit Eksternal (BKI / Ditjen Hubla)'} • Standar {standard}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Row 1: Audit Type & Standard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Jenis Audit (Internal / Eksternal) <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAuditType('Internal')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                    auditType === 'Internal'
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Internal PBK
                </button>
                <button
                  type="button"
                  onClick={() => setAuditType('External')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                    auditType === 'External'
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Eksternal (BKI/Gov)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Standar Audit (DOC / SMC) <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStandard('DOC');
                    setTargetType('Office');
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                    standard === 'DOC'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  DOC (Kantor)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStandard('SMC');
                    setTargetType('Vessel');
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                    standard === 'SMC'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <Ship className="w-3.5 h-3.5" />
                  SMC (Kapal)
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Target & Audit No */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nomor Register Audit <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={auditNo}
                onChange={(e) => setAuditNo(e.target.value)}
                placeholder="contoh: AUD-INT-DOC-2026/101"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {targetType === 'Vessel' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target Kapal Armada <span className="text-rose-400">*</span>
                </label>
                <select
                  value={vesselId}
                  onChange={(e) => handleVesselChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
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
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target Audit (Entitas Darat)
                </label>
                <input
                  type="text"
                  disabled
                  value="Kantor Pusat PT. Pelayaran Baharimas Kalimantan"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-400 cursor-not-allowed"
                />
              </div>
            )}
          </div>

          {/* Row 3: Lead Auditor & Audit Team */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Lead Auditor <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={leadAuditor}
                onChange={(e) => setLeadAuditor(e.target.value)}
                placeholder="Nama Lead Auditor / Instansi"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tim Auditor (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={auditTeam}
                onChange={(e) => setAuditTeam(e.target.value)}
                placeholder="contoh: Ir. Syamsul, Capt. Ahmad"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Row 4: Auditee & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Pihak Auditee (Yang Di-audit) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={auditee}
                onChange={(e) => setAuditee(e.target.value)}
                placeholder="contoh: Nakhoda, KKM, DPA"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Status Sesi Audit
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Scheduled">Terjadwal (Scheduled)</option>
                <option value="In Progress">Sedang Berlangsung (In Progress)</option>
                <option value="Completed">Selesai (Completed)</option>
              </select>
            </div>
          </div>

          {/* Row 5: Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tanggal Pelaksanaan Audit <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                value={auditDate}
                onChange={(e) => setAuditDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Penutupan NC (Batas Waktu Close) <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                value={targetCloseDate}
                onChange={(e) => setTargetCloseDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Scope / Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Ruang Lingkup & Sasaran Audit (Scope) <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="Jelaskan sasaran, ruang lingkup klausul ISM Code yang diperiksa..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Notice Banner */}
          <div className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl flex items-start gap-2.5 text-xs text-blue-300">
            <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-200">Ketentuan Standar ISM Code PT. Pelayaran Baharimas Kalimantan:</p>
              <p className="text-slate-400 mt-0.5">
                Sesi audit {auditType} {standard} akan mendokumentasikan temuan Non-Conformity (Major NC, Minor NC, Observasi). Temuan terbuka (NC Open) wajib diselesaikan melalui pengajuan bukti eviden perbaikan sebelum diverifikasi & ditutup (NC Close).
              </p>
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
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/20 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isEdit ? 'Simpan Perubahan Sesi' : 'Buat Sesi Audit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
