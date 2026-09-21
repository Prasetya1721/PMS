import React, { useState, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Save,
  X,
  Activity
} from 'lucide-react';

export const DailyMachineryLogModal = ({ initialVesselId, onClose }) => {
  const {
    vessels,
    allEquipment,
    batchLogMachineryHours,
    showToast
  } = usePMS();

  const [selectedVesselId, setSelectedVesselId] = useState(
    initialVesselId || vessels[0]?.id || 'v-001'
  );
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [loggedBy, setLoggedBy] = useState('Kurniawan (Masinis 2)');
  const [chiefEngineer, setChiefEngineer] = useState('Ir. Bambang Wijaya (KKM)');

  const currentVessel = vessels.find(v => v.id === selectedVesselId) || vessels[0];

  const vesselEquipment = useMemo(() => {
    return (allEquipment || []).filter(e => e.vesselId === selectedVesselId);
  }, [allEquipment, selectedVesselId]);

  // Table rows for all active equipment
  const [rows, setRows] = useState(() => {
    return vesselEquipment.map(eq => ({
      equipmentId: eq.id,
      name: eq.name,
      code: eq.code,
      currentHours: eq.runningHours || 0,
      addedHours: eq.category === 'Propulsi' ? 12 : (eq.category === 'Kelistrikan' ? 18 : 2),
      oilPressure: eq.category === 'Propulsi' ? 4.8 : (eq.category === 'Kelistrikan' ? 4.5 : 4.0),
      waterTemp: eq.category === 'Propulsi' ? 78 : (eq.category === 'Kelistrikan' ? 80 : 65),
      exhaustTemp: eq.category === 'Propulsi' ? 340 : (eq.category === 'Kelistrikan' ? 290 : 70),
      notes: 'Operasi normal pelayaran'
    }));
  });

  const handleRowChange = (index, field, val) => {
    setRows(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleApplyPresetAll = (hours) => {
    setRows(prev => prev.map(r => ({ ...r, addedHours: Number(hours) || 0 })));
    showToast(`Disetel +${hours} jam untuk seluruh mesin`, 'info');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rows.length === 0) {
      showToast('Tidak ada peralatan mesin yang dipilih untuk kapal ini.', 'warning');
      return;
    }

    const entries = rows.map(r => ({
      equipmentId: r.equipmentId,
      name: r.name,
      addedHours: Number(r.addedHours) || 0,
      cumulativeHours: (r.currentHours || 0) + (Number(r.addedHours) || 0),
      oilPressure: Number(r.oilPressure) || 0,
      waterTemp: Number(r.waterTemp) || 0,
      exhaustTemp: Number(r.exhaustTemp) || 0,
      notes: r.notes || ''
    }));

    batchLogMachineryHours(selectedVesselId, logDate, entries, {
      loggedBy,
      chiefEngineer
    });

    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(10, 16, 30, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '1040px',
        maxHeight: '92vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.65)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(to right, rgba(2, 132, 199, 0.12), rgba(15, 23, 42, 0.6))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Activity size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  Buku Jurnal Harian Mesin (Daily Machinery Logbook)
                </h3>
                <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                  Input Cepat Multi-Mesin
                </span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                Pencatatan jam jalan harian dan parameter fisik mesin kamar mesin dalam 1 kali simpan serentak.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header Bar: Kapal, Tanggal, PIC */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            padding: '1rem',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                Pilih Kapal
              </label>
              <select
                value={selectedVesselId}
                onChange={(e) => {
                  setSelectedVesselId(e.target.value);
                  const eqList = (allEquipment || []).filter(x => x.vesselId === e.target.value);
                  setRows(eqList.map(eq => ({
                    equipmentId: eq.id,
                    name: eq.name,
                    code: eq.code,
                    currentHours: eq.runningHours || 0,
                    addedHours: eq.category === 'Propulsi' ? 12 : (eq.category === 'Kelistrikan' ? 18 : 2),
                    oilPressure: 4.5,
                    waterTemp: 78,
                    exhaustTemp: 320,
                    notes: 'Operasi normal'
                  })));
                }}
                className="input-base"
                style={{ width: '100%' }}
              >
                {vessels.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.type})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                Tanggal Jurnal Logbook
              </label>
              <input
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="input-base"
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                Masinis Jaga (Logged By)
              </label>
              <input
                type="text"
                value={loggedBy}
                onChange={(e) => setLoggedBy(e.target.value)}
                className="input-base"
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                Verifikasi KKM (Chief Engineer)
              </label>
              <input
                type="text"
                value={chiefEngineer}
                onChange={(e) => setChiefEngineer(e.target.value)}
                className="input-base"
                style={{ width: '100%' }}
                required
              />
            </div>
          </div>

          {/* Preset Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Setel Jam Jalan Cepat untuk Seluruh Mesin:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleApplyPresetAll(12)}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                +12 Jam (Tug Half Day)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPresetAll(24)}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                +24 Jam (Full Day Towing)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPresetAll(0)}
                className="btn btn-neutral"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                Reset 0 Jam
              </button>
            </div>
          </div>

          {/* Table of Machinery Entries */}
          <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Mesin / Peralatan</th>
                  <th style={{ padding: '0.75rem 1rem', width: '110px' }}>Jam Awal</th>
                  <th style={{ padding: '0.75rem 1rem', width: '110px' }}>+Jam Hari Ini</th>
                  <th style={{ padding: '0.75rem 1rem', width: '120px' }}>Total Jam Akhir</th>
                  <th style={{ padding: '0.75rem 1rem', width: '110px' }}>Tek. Oli (bar)</th>
                  <th style={{ padding: '0.75rem 1rem', width: '100px' }}>Suhu Air (°C)</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Catatan Pengamatan</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => {
                  const endHours = (Number(row.currentHours) || 0) + (Number(row.addedHours) || 0);
                  return (
                    <tr key={row.equipmentId} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <strong style={{ display: 'block', fontSize: '0.875rem' }}>{row.name}</strong>
                        <span className="mono" style={{ fontSize: '0.75rem', color: '#38bdf8' }}>{row.code}</span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
                        {row.currentHours.toLocaleString()} Jam
                      </td>
                      <td style={{ padding: '0.5rem 0.75rem' }}>
                        <input
                          type="number"
                          min="0"
                          max="24"
                          step="0.5"
                          value={row.addedHours}
                          onChange={(e) => handleRowChange(idx, 'addedHours', e.target.value)}
                          className="input-base"
                          style={{ width: '90px', padding: '0.4rem', fontWeight: 700, color: '#10b981' }}
                        />
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: '#38bdf8' }}>
                        {endHours.toLocaleString()} Jam
                      </td>
                      <td style={{ padding: '0.5rem 0.75rem' }}>
                        <input
                          type="number"
                          step="0.1"
                          value={row.oilPressure}
                          onChange={(e) => handleRowChange(idx, 'oilPressure', e.target.value)}
                          className="input-base"
                          style={{ width: '85px', padding: '0.4rem' }}
                        />
                      </td>
                      <td style={{ padding: '0.5rem 0.75rem' }}>
                        <input
                          type="number"
                          value={row.waterTemp}
                          onChange={(e) => handleRowChange(idx, 'waterTemp', e.target.value)}
                          className="input-base"
                          style={{ width: '80px', padding: '0.4rem' }}
                        />
                      </td>
                      <td style={{ padding: '0.5rem 0.75rem' }}>
                        <input
                          type="text"
                          value={row.notes}
                          onChange={(e) => handleRowChange(idx, 'notes', e.target.value)}
                          className="input-base"
                          style={{ width: '100%', minWidth: '150px', padding: '0.4rem' }}
                          placeholder="Kondisi normal / observasi"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-neutral"
            >
              Batal
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Save size={18} />
              <span>Simpan Buku Jurnal Harian & Update Jam Mesin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
