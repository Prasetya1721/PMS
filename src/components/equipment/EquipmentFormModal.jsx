import React, { useState, useEffect, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  X,
  Wrench,
  Cpu,
  Clock,
  Ship,
  Save,
  Maximize2,
  Minimize2,
  Plus,
  Layers,
  Tag,
  FileText
} from 'lucide-react';

export const EquipmentFormModal = ({ equipment, defaultVesselId, onClose }) => {
  const { vessels, addEquipment, updateEquipment, showToast, theme } = usePMS();

  const isEdit = Boolean(equipment);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Form states
  const [vesselId, setVesselId] = useState(
    equipment?.vesselId || (defaultVesselId && defaultVesselId !== 'all' ? defaultVesselId : vessels[0]?.id || '')
  );
  const [code, setCode] = useState(equipment?.code || '');
  const [name, setName] = useState(equipment?.name || '');
  const [category, setCategory] = useState(equipment?.category || 'Propulsi');
  const [model, setModel] = useState(equipment?.model || '');
  const [serialNumber, setSerialNumber] = useState(equipment?.serialNumber || '');
  const [maker, setMaker] = useState(equipment?.maker || '');
  const [location, setLocation] = useState(equipment?.location || 'Engine Room Portside');
  const [runningHours, setRunningHours] = useState(equipment?.runningHours !== undefined ? equipment.runningHours : 100);
  const [lastMaintenanceHours, setLastMaintenanceHours] = useState(equipment?.lastMaintenanceHours !== undefined ? equipment.lastMaintenanceHours : 0);
  const [nextServiceHours, setNextServiceHours] = useState(equipment?.nextServiceHours !== undefined ? equipment.nextServiceHours : 500);
  const [criticality, setCriticality] = useState(equipment?.criticality || 'Tinggi');
  const [installedDate, setInstalledDate] = useState(
    equipment?.installedDate || new Date().toISOString().split('T')[0]
  );
  const [subComponents, setSubComponents] = useState(
    Array.isArray(equipment?.subComponents) ? [...equipment.subComponents] : ['Turbocharger', 'Fuel Injection Pump']
  );
  const [subInput, setSubInput] = useState('');
  const [notes, setNotes] = useState(equipment?.notes || '');

  // Standard Equipment Categories in Maritime PMS
  const categoryOptions = [
    'Propulsi',
    'Kelistrikan',
    'Sistem Pompa',
    'Pneumatik',
    'Deck Machinery',
    'Navigasi & Komunikasi',
    'Sistem Keselamatan',
    'Penanganan Muatan'
  ];

  // Standard Ship Locations
  const locationPresets = [
    'Engine Room Portside',
    'Engine Room Starboard',
    'Engine Room Center / Aft',
    'Emergency Generator Room',
    'Forecastle Deck (Haluan)',
    'Aft Main Deck (Buritan)',
    'Wheelhouse / Anjungan',
    'Forward Store / Gudang Depan',
    'Pump Room (Kamar Pompa)'
  ];

  // Auto-generate code suggestion if code is empty and category changes (for new equipment)
  useEffect(() => {
    if (!isEdit && !code) {
      const prefixes = {
        'Propulsi': 'ME-01',
        'Kelistrikan': 'AE-01',
        'Sistem Pompa': 'PP-01',
        'Pneumatik': 'AC-01',
        'Deck Machinery': 'DK-01',
        'Navigasi & Komunikasi': 'NAV-01',
        'Sistem Keselamatan': 'SAF-01',
        'Penanganan Muatan': 'CRG-01'
      };
      setCode(prefixes[category] || 'EQ-01');
    }
  }, [category, isEdit]);

  // Real-time calculation of status and remaining hours
  const numRunning = Number(runningHours) || 0;
  const numNext = Number(nextServiceHours) || 0;
  const hoursLeft = numNext - numRunning;
  const percentageUsed = numNext > 0 ? Math.min(100, Math.max(0, Math.round((numRunning / numNext) * 100))) : 0;

  const calculatedStatus = useMemo(() => {
    if (hoursLeft <= 0) return 'Overdue';
    if (hoursLeft <= 200) return 'Due Soon';
    return 'Normal';
  }, [hoursLeft]);

  // Subcomponent handlers
  const handleAddSubComponent = (e) => {
    e?.preventDefault();
    const trimmed = subInput.trim();
    if (trimmed && !subComponents.includes(trimmed)) {
      setSubComponents(prev => [...prev, trimmed]);
      setSubInput('');
    }
  };

  const handleRemoveSubComponent = (itemToRemove) => {
    setSubComponents(prev => prev.filter(item => item !== itemToRemove));
  };

  // Quick preset helper for Next Service Hours
  const applyPresetInterval = (additionalHours) => {
    const base = numRunning > 0 ? numRunning : 0;
    setNextServiceHours(base + additionalHours);
    showToast(`Target servis diatur: ${base + additionalHours} Jam (+${additionalHours} Jam dari jam operasi saat ini)`, 'info');
  };

  // Quick component suggestions based on category
  const suggestedComponents = useMemo(() => {
    switch (category) {
      case 'Propulsi':
        return ['Turbocharger', 'Fuel Injection Pump', 'Cylinder Liners', 'Lube Oil Cooler', 'Piston Rings', 'Cylinder Head'];
      case 'Kelistrikan':
        return ['Alternator', 'Governor', 'AVR Unit', 'Main Circuit Breaker', 'Starting Motor'];
      case 'Sistem Pompa':
        return ['Impeller', 'Mechanical Seal', 'Bearing Bracket', 'Suction Strainer', 'Electric Motor'];
      case 'Pneumatik':
        return ['LP Piston', 'HP Valve', 'Air Cooler', 'Safety Relief Valve', 'Pressure Switch'];
      case 'Deck Machinery':
        return ['Brake Band', 'Hydraulic Motor', 'Clutch Dog', 'Control Valve', 'Spur Gear'];
      case 'Sistem Keselamatan':
        return ['Starting Battery', 'Fuel Tank Valve', 'Impeller Pompa', 'Spark Plug'];
      default:
        return ['Sensor Unit', 'Filter Element', 'Shaft Seal', 'Coupling'];
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!code.trim() || !name.trim()) {
      showToast('Harap isi kode dan nama equipment', 'error');
      return;
    }

    const payload = {
      vesselId,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      category,
      model: model.trim() || '-',
      serialNumber: serialNumber.trim() || '-',
      maker: maker.trim() || '-',
      location: location.trim() || 'Engine Room',
      runningHours: Number(runningHours) || 0,
      lastMaintenanceHours: Number(lastMaintenanceHours) || 0,
      nextServiceHours: Number(nextServiceHours) || 1000,
      status: calculatedStatus,
      criticality,
      installedDate,
      subComponents,
      notes: notes.trim()
    };

    if (isEdit) {
      updateEquipment(equipment.id, payload);
    } else {
      addEquipment(payload);
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: isFullscreen ? '98vw' : '900px',
          maxWidth: isFullscreen ? '98vw' : '95vw',
          height: isFullscreen ? '96vh' : 'auto',
          maxHeight: isFullscreen ? '96vh' : '92vh',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.25s ease'
        }}
      >
        {/* Header */}
        <div className="modal-header" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: isEdit ? 'rgba(56, 189, 248, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isEdit ? '#38bdf8' : '#10b981'
              }}
            >
              {isEdit ? <Wrench size={22} /> : <Cpu size={22} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                {isEdit ? `Edit Master Equipment: ${equipment.name}` : 'Tambah Master Equipment & Mesin Baru'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                {isEdit
                  ? `Pembaruan data teknis, spesifikasi, dan ambang jam operasi ${equipment.code}`
                  : 'Pendaftaran mesin baru ke database PMS armada PT. Pelayaran Baharimas Kalimantan'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setIsFullscreen(prev => !prev)}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.35rem 0.6rem' }}
              title={isFullscreen ? 'Keluar dari layar penuh' : 'Layar penuh'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div
            className="modal-body"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}
          >
            {/* SECTION 1: Vessel & Basic Identity */}
            <div
              style={{
                background: theme === 'light' ? '#f8fafc' : 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Ship size={18} color="#38bdf8" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                  Penugasan Kapal & Identitas Utama
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {/* Vessel Assignment */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Kapal Armada <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={vesselId}
                    onChange={(e) => setVesselId(e.target.value)}
                    required
                    className="select-control"
                    style={{ width: '100%' }}
                  >
                    {vessels.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.type || 'Tugboat'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Equipment Code */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Kode Equipment <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: ME-01, AE-01, GB-01, AW-01"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="input-control mono"
                    style={{ fontWeight: 700 }}
                  />
                </div>

                {/* Equipment Name */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Nama Lengkap Equipment / Mesin <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Main Engine Portside (Mesin Induk Kiri)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-control"
                    style={{ fontSize: '0.95rem', fontWeight: 600 }}
                  />
                </div>

                {/* Category */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Kategori Sistem PMS <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="select-control"
                    style={{ width: '100%' }}
                  >
                    {categoryOptions.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Lokasi Penempatan di Kapal
                  </label>
                  <input
                    type="text"
                    list="locations-list"
                    placeholder="Contoh: Engine Room Portside"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input-control"
                  />
                  <datalist id="locations-list">
                    {locationPresets.map((loc, idx) => (
                      <option key={idx} value={loc} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            {/* SECTION 2: Technical Specifications & Maker */}
            <div
              style={{
                background: theme === 'light' ? '#f8fafc' : 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Cpu size={18} color="#a855f7" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                  Spesifikasi Teknis & Pabrikan (Maker)
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {/* Maker */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Pabrikan / Maker
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Yanmar / Caterpillar / Cummins / Sperre"
                    value={maker}
                    onChange={(e) => setMaker(e.target.value)}
                    className="input-control"
                  />
                </div>

                {/* Model */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Model / Tipe Mesin
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 6EY26W (1600 BHP) / HL2/90"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="input-control"
                  />
                </div>

                {/* Serial Number */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Nomor Seri (Serial Number)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: YN-6EY-22082-P"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    className="input-control mono"
                  />
                </div>

                {/* Criticality */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Tingkat Kritikalitas Operasional
                  </label>
                  <select
                    value={criticality}
                    onChange={(e) => setCriticality(e.target.value)}
                    className="select-control"
                    style={{ width: '100%' }}
                  >
                    <option value="Kritis">🔴 Kritis (Critical Ship Stop)</option>
                    <option value="Tinggi">🟠 Tinggi (Major Nav & Safety)</option>
                    <option value="Sedang">🔵 Sedang (Daily Operations)</option>
                    <option value="Rendah">⚪ Rendah (Auxiliary Support)</option>
                  </select>
                </div>

                {/* Installed Date */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Tanggal Pemasangan / Commissioning
                  </label>
                  <input
                    type="date"
                    value={installedDate}
                    onChange={(e) => setInstalledDate(e.target.value)}
                    className="input-control"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Running Hours & PMS Intervals */}
            <div
              style={{
                background: theme === 'light' ? '#f8fafc' : 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={18} color="#f59e0b" />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                    Pencatatan Jam Operasi (Running Hours) & Target Servis
                  </h4>
                </div>
                <span className={`badge ${
                  calculatedStatus === 'Overdue' ? 'badge-danger-pulse' :
                  calculatedStatus === 'Due Soon' ? 'badge-warning' : 'badge-success'
                }`}>
                  Status Proyeksi: {calculatedStatus}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                {/* Current Running Hours */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Jam Operasi Saat Ini (Running Hours) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      required
                      min="0"
                      value={runningHours}
                      onChange={(e) => setRunningHours(Number(e.target.value))}
                      className="input-control mono"
                      style={{ fontSize: '1rem', fontWeight: 700, paddingRight: '3rem' }}
                    />
                    <span style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Jam
                    </span>
                  </div>
                </div>

                {/* Last Maintenance Hours */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Jam Terakhir Diservis (Last Maintenance)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      min="0"
                      value={lastMaintenanceHours}
                      onChange={(e) => setLastMaintenanceHours(Number(e.target.value))}
                      className="input-control mono"
                      style={{ paddingRight: '3rem' }}
                    />
                    <span style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Jam
                    </span>
                  </div>
                </div>

                {/* Next Service Hours */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Target Servis Berikutnya (Next Service) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      required
                      min="1"
                      value={nextServiceHours}
                      onChange={(e) => setNextServiceHours(Number(e.target.value))}
                      className="input-control mono"
                      style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8', paddingRight: '3rem' }}
                    />
                    <span style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Jam
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Interval Preset Buttons */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  Preset Tambah Interval PMS dari Jam Berjalan:
                </span>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => applyPresetInterval(250)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    +250 Jam (Ganti Filter/Oli)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetInterval(500)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    +500 Jam (Intermediate)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetInterval(1000)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    +1.000 Jam (Semi-Overhaul)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetInterval(2500)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    +2.500 Jam (Mayor Service)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetInterval(5000)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    +5.000 Jam (General Overhaul)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetInterval(10000)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    +10.000 Jam (Survey BKI / Dok)
                  </button>
                </div>
              </div>

              {/* Progress & Remaining Hours Simulation Box */}
              <div
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  background: hoursLeft <= 0
                    ? 'rgba(239, 68, 68, 0.12)'
                    : hoursLeft <= 200
                    ? 'rgba(245, 158, 11, 0.12)'
                    : 'rgba(16, 185, 129, 0.12)',
                  border: hoursLeft <= 0
                    ? '1px solid rgba(239, 68, 68, 0.35)'
                    : hoursLeft <= 200
                    ? '1px solid rgba(245, 158, 11, 0.35)'
                    : '1px solid rgba(16, 185, 129, 0.35)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                  <span>
                    Pemakaian Jam: <strong>{numRunning.toLocaleString()} / {numNext.toLocaleString()} Jam ({percentageUsed}%)</strong>
                  </span>
                  <strong style={{
                    color: hoursLeft <= 0 ? '#ef4444' : hoursLeft <= 200 ? '#f59e0b' : '#10b981'
                  }}>
                    {hoursLeft <= 0 ? `🚨 OVERDUE ${Math.abs(hoursLeft)} Jam!` : `⏳ Sisa ${hoursLeft} Jam Menuju Servis`}
                  </strong>
                </div>

                <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${percentageUsed}%`,
                      height: '100%',
                      borderRadius: '4px',
                      background: hoursLeft <= 0
                        ? '#ef4444'
                        : hoursLeft <= 200
                        ? '#f59e0b'
                        : '#10b981',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: Sub-Components Hierarchy */}
            <div
              style={{
                background: theme === 'light' ? '#f8fafc' : 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Layers size={18} color="#06b6d4" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                  Hierarki Komponen Kritis & Suku Cadang Terkait
                </h4>
              </div>

              {/* Tag Input */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Ketik nama komponen (misal: Fuel Injector, Turbocharger, Impeller)..."
                  value={subInput}
                  onChange={(e) => setSubInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubComponent();
                    }
                  }}
                  className="input-control"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleAddSubComponent}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Plus size={15} />
                  <span>Tambah Komponen</span>
                </button>
              </div>

              {/* Suggestions chips */}
              <div style={{ marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginRight: '0.4rem' }}>
                  Saran Komponen ({category}):
                </span>
                <div style={{ display: 'inline-flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                  {suggestedComponents.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (!subComponents.includes(item)) {
                          setSubComponents(prev => [...prev, item]);
                        }
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}
                    >
                      + {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Subcomponents Badges */}
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', minHeight: '36px', alignItems: 'center' }}>
                {subComponents.length === 0 ? (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Belum ada sub-komponen ditambahkan. Tambahkan komponen untuk memudahkan manajemen suku cadang.
                  </span>
                ) : (
                  subComponents.map((item, idx) => (
                    <span
                      key={idx}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.3rem 0.65rem',
                        borderRadius: '6px',
                        background: 'rgba(56, 189, 248, 0.12)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        color: '#38bdf8',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}
                    >
                      <Tag size={12} />
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubComponent(item)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '0 0.1rem',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* SECTION 5: Technical Notes */}
            <div
              style={{
                background: theme === 'light' ? '#f8fafc' : 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <FileText size={18} color="#10b981" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                  Catatan Teknis & Rekomendasi Operasional
                </h4>
              </div>

              <textarea
                rows="3"
                placeholder="Contoh: Tekanan oli standar 4.5 bar, temperatur air pendingin 75-80°C. Menggunakan oli SAE 40 TBN 12. Rekomendasi servis injector tiap 1000 jam."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-control"
                style={{ fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Footer */}
          <div
            className="modal-footer"
            style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-surface)'
            }}
          >
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Data tersimpan otomatis di database cloud PMS PT. Pelayaran Baharimas Kalimantan
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: '140px', justifyContent: 'center' }}
              >
                <Save size={16} />
                <span>{isEdit ? 'Simpan Perubahan' : 'Simpan Equipment'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
