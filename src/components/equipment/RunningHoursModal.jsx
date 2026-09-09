import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { Clock, X, CheckCircle, AlertTriangle } from 'lucide-react';

export const RunningHoursModal = ({ equipment, onClose }) => {
  const { updateRunningHours } = usePMS();
  const [entryMode, setEntryMode] = useState('add'); // 'add' (jam tambahan pelayaran) or 'total' (set angka odometer)
  const [hoursInput, setHoursInput] = useState('');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const currentHours = equipment.runningHours || 0;
  const numInput = Number(hoursInput) || 0;
  const projectedTotal = entryMode === 'add' ? currentHours + numInput : numInput;
  const remainingHours = equipment.nextServiceHours - projectedTotal;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hoursInput || numInput < 0) return;

    if (entryMode === 'add') {
      updateRunningHours(equipment.id, numInput, false);
    } else {
      updateRunningHours(equipment.id, numInput, true);
    }
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
                min="1"
                placeholder={entryMode === 'add' ? "Contoh: 24" : "Contoh: 9874"}
                value={hoursInput}
                onChange={(e) => setHoursInput(e.target.value)}
                className="input-control mono"
                style={{ fontSize: '1rem', fontWeight: 700 }}
              />
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
