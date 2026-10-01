import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { Clock, X, CheckCircle, AlertTriangle, Info, RotateCcw } from 'lucide-react';

export const RunningHoursModal = ({ equipment, onClose }) => {
  const { updateRunningHours, confirm } = usePMS();
  const [entryMode, setEntryMode] = useState('add');
  const [hoursInput, setHoursInput] = useState('');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [inlineError, setInlineError] = useState('');
  const [pendingConfirm, setPendingConfirm] = useState(null);

  const currentHours = equipment.runningHours || 0;
  const numInput = Number(hoursInput) || 0;
  const projectedTotal = entryMode === 'add' ? currentHours + numInput : numInput;
  const remainingHours = equipment.nextServiceHours - projectedTotal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInlineError('');

    if (!hoursInput || numInput <= 0) {
      setInlineError('Jam kerja harus diisi dan lebih dari 0');
      return;
    }

    const result = entryMode === 'add'
      ? updateRunningHours(equipment.id, numInput, false)
      : updateRunningHours(equipment.id, numInput, true);

    if (!result.success) {
      if (result.needsConfirm) {
        setPendingConfirm({
          type: 'large_add',
          inputHours: result.inputHours,
          isAbsolute: result.isAbsolute,
          reason: result.reason
        });
        return;
      }
      setInlineError(result.reason);
      return;
    }

    onClose();
  };

  const handleConfirmAction = async (confirmed) => {
    if (!pendingConfirm) return;
    
    if (confirmed) {
      const result = updateRunningHours(equipment.id, pendingConfirm.inputHours, pendingConfirm.isAbsolute);
      if (result.success) {
        onClose();
      } else {
        setInlineError(result.reason);
      }
    }
    setPendingConfirm(null);
  };

  // Reset setelah overhaul: generator atau mesin bisa dikembalikan ke nol setelah
  // perbaikan besar, sehingga running hours yang lebih kecil adalah kondisi nyata —
  // bukan kesalahan input. Jalur ini mewajibkan alasan tertulis supaya audit trail
  // tetap bisa dipertanggungjawabkan ke surveyor.
  const handleOverhaulReset = () => {
    const totalInput = Number(hoursInput) || 0;
    if (totalInput < 0) {
      setInlineError('Nilai jam setelah overhaul tidak boleh negatif');
      return;
    }
    setPendingConfirm({
      type: 'overhaul_reset',
      inputHours: totalInput,
      isAbsolute: true,
      reason: `Catat sebagai reset setelah overhaul: jam kerja menjadi ${totalInput} dari sebelumnya ${currentHours} jam.`
    });
  };

  const confirmOverhaulReset = () => {
    if (!pendingConfirm) return;
    updateRunningHours(equipment.id, pendingConfirm.inputHours, true, { allowDecrease: true });
    setPendingConfirm(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Clock size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              Pencatatan Jam Kerja Mesin (Running Hours)
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Target Equipment Details */}
            <div style={{ padding: '0.9rem 1.1rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="mono" style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
                  {equipment.code}
                </span>
                <span className="badge badge-info">{equipment.category}</span>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.2rem' }}>{equipment.name}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Model: {equipment.model} • S/N: {equipment.serialNumber}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)', fontSize: '0.825rem' }}>
                <span>Jam Terakhir Dicatat: <strong className="mono" style={{ color: '#fff' }}>{currentHours.toLocaleString()} Jam</strong></span>
                <span>Target Servis: <strong className="mono" style={{ color: '#38bdf8' }}>{equipment.nextServiceHours.toLocaleString()} Jam</strong></span>
              </div>
            </div>

            {/* Mode Selector */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className={`btn btn-sm ${entryMode === 'add' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
                onClick={() => setEntryMode('add')}
              >
                + Tambah Jam Operasi (Misal: 24 Jam)
              </button>
              <button
                type="button"
                className={`btn btn-sm ${entryMode === 'total' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
                onClick={() => setEntryMode('total')}
              >
                Set Total Akumulasi (Odometer Mesin)
              </button>
            </div>

            {/* Inputs */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                {entryMode === 'add' ? 'Jumlah Jam Operasional yang Ditambahkan' : 'Total Jam Operasional Baru (Total Hours)'}
              </label>
              <input
                type="number"
                required
                min={entryMode === 'total' ? "0" : "1"}
                placeholder={entryMode === 'add' ? "Contoh: 24" : "Contoh: 9874"}
                value={hoursInput}
                onChange={(e) => {
                  setHoursInput(e.target.value);
                  if (inlineError) setInlineError('');
                  if (pendingConfirm) setPendingConfirm(null);
                }}
                className="input-control mono"
                style={{ fontSize: '1rem', fontWeight: 700 }}
              />
              <span style={{ display: 'block', marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {entryMode === 'total'
                  ? `Batas bawah sah: > ${currentHours.toLocaleString()} Jam (monoton meningkat per ISM Code). Terakhir: ${currentHours.toLocaleString()} Jam.`
                  : `Maksimal penambahan wajar: ≤ 1.000 Jam per input log.`}
              </span>

              {/* Inline Error & Opsi Overhaul Reset */}
              {inlineError && (
                <div style={{
                  marginTop: '0.65rem',
                  padding: '0.75rem 0.9rem',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#ef4444',
                  fontSize: '0.825rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ lineHeight: '1.4' }}>{inlineError}</span>
                  </div>
                  {entryMode === 'total' && numInput < currentHours && (
                    <div style={{ marginTop: '0.35rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(239, 68, 68, 0.2)' }}>
                      <button
                        type="button"
                        onClick={handleOverhaulReset}
                        className="btn btn-sm"
                        style={{
                          background: 'rgba(245, 158, 11, 0.2)',
                          color: '#f59e0b',
                          border: '1px solid rgba(245, 158, 11, 0.4)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.35rem 0.75rem'
                        }}
                      >
                        <RotateCcw size={13} />
                        Catat sebagai Reset Setelah Overhaul Mesin
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Pending Confirmation Box */}
              {pendingConfirm && (
                <div style={{
                  marginTop: '0.65rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  fontSize: '0.825rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontWeight: 700 }}>
                    <AlertTriangle size={16} />
                    <span>Konfirmasi Diperlukan</span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-main)', lineHeight: '1.4' }}>
                    {pendingConfirm.reason}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.35rem' }}>
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => setPendingConfirm(null)}
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        if (pendingConfirm.type === 'overhaul_reset') {
                          confirmOverhaulReset();
                        } else {
                          handleConfirmAction(true);
                        }
                      }}
                    >
                      Konfirmasi & Simpan
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Tanggal Log / Jam Pembacaan
                </label>
                <input
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="input-control"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Proyeksi Total Jam
                </label>
                <div style={{ padding: '0.6rem 0.9rem', background: 'var(--bg-input)', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontWeight: 700 }} className="mono">
                  {projectedTotal.toLocaleString()} Jam
                </div>
              </div>
            </div>

            {/* Interval Impact Warning */}
            {hoursInput && (
              <div style={{
                padding: '0.85rem',
                borderRadius: '8px',
                background: remainingHours <= 0 ? 'rgba(239, 68, 68, 0.15)' : remainingHours <= 200 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                border: remainingHours <= 0 ? '1px solid rgba(239, 68, 68, 0.3)' : remainingHours <= 200 ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                fontSize: '0.825rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}>
                {remainingHours <= 0 ? (
                  <>
                    <AlertTriangle size={18} color="#ef4444" />
                    <span style={{ color: '#ef4444', fontWeight: 600 }}>
                      PERINGATAN: Nilai jam baru menyebabkan status OVERDUE ({Math.abs(remainingHours)} jam melewati target servis)!
                    </span>
                  </>
                ) : remainingHours <= 200 ? (
                  <>
                    <AlertTriangle size={18} color="#f59e0b" />
                    <span style={{ color: '#f59e0b', fontWeight: 600 }}>
                      Status akan menjadi DUE SOON (Tersisa {remainingHours} jam sebelum servis).
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} color="#10b981" />
                    <span style={{ color: '#10b981', fontWeight: 600 }}>
                      Kondisi normal. Masih tersisa {remainingHours} jam operasi sebelum servis berkala.
                    </span>
                  </>
                )}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Catatan Operasional / Logbook Officer
              </label>
              <textarea
                rows="2"
                placeholder="Contoh: Sea trial perairan Bangka, temperatur dan tekanan oli normal."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-control"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan Jam Kerja
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
