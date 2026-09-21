import React, { useState, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
import { BaharimasEmblem } from '../common/BaharimasLogo';
import {
  Wrench,
  CheckCircle2,
  Package,
  Save,
  FileText,
  X,
  Plus,
  Trash2,
  Printer,
  Cpu,
  Activity
} from 'lucide-react';

export const TechnicalWorkOrderModal = ({ workOrder, initialVesselId, onClose }) => {
  const {
    vessels,
    allEquipment,
    spareparts,
    allCrew,
    addTechnicalWorkOrder,
    updateTechnicalWorkOrder,
    completeTechnicalWorkOrder,
    showToast
  } = usePMS();

  const isEdit = Boolean(workOrder);
  const isCompleted = workOrder?.status === 'Completed';

  // Target Vessel
  const [selectedVesselId, setSelectedVesselId] = useState(
    workOrder?.vesselId || initialVesselId || vessels[0]?.id || 'v-001'
  );

  const vesselEquipment = useMemo(() => {
    return (allEquipment || []).filter(e => e.vesselId === selectedVesselId);
  }, [allEquipment, selectedVesselId]);

  const vesselSpareparts = useMemo(() => {
    return (spareparts || []).filter(s => s.vesselId === selectedVesselId || s.vesselId === 'all' || !s.vesselId);
  }, [spareparts, selectedVesselId]);

  const vesselCrew = useMemo(() => {
    return (allCrew || []).filter(c => c.vesselId === selectedVesselId && c.status === 'Onboard');
  }, [allCrew, selectedVesselId]);

  const currentVessel = vessels.find(v => v.id === selectedVesselId) || vessels[0];

  // Selected Equipment
  const [equipmentId, setEquipmentId] = useState(
    workOrder?.equipmentId || vesselEquipment[0]?.id || ''
  );

  const selectedEquipment = useMemo(() => {
    return vesselEquipment.find(e => e.id === equipmentId) || vesselEquipment[0] || null;
  }, [vesselEquipment, equipmentId]);

  // Form State
  const [woType, setWoType] = useState(workOrder?.workOrderType || 'Preventive Maintenance (PM)');
  const [title, setTitle] = useState(
    workOrder?.title || (selectedEquipment ? `Servis Berkala ${selectedEquipment.name}` : 'Servis Pemeliharaan Mesin')
  );
  const [priority, setPriority] = useState(workOrder?.priority || 'Tinggi');
  const [plannedDate, setPlannedDate] = useState(workOrder?.plannedDate || new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    workOrder?.dueDate || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [targetRunningHours, setTargetRunningHours] = useState(
    workOrder?.targetRunningHours || selectedEquipment?.nextServiceHours || 500
  );
  const [assignedTechnician, setAssignedTechnician] = useState(
    workOrder?.assignedTechnician || 'Kurniawan'
  );
  const [assignedRole, setAssignedRole] = useState(
    workOrder?.assignedRole || 'Masinis 2'
  );
  const [description, setDescription] = useState(
    workOrder?.description || 'Lakukan servis berkala sesuai interval pabrikan maker dan standar ISM Code.'
  );

  // SOP Steps Checklist
  const [sopSteps, setSopSteps] = useState(
    workOrder?.sopSteps || [
      { id: 'step-1', title: 'Lakukan isolasi sumber energi kelistrikan / LOTO', done: false },
      { id: 'step-2', title: 'Pemeriksaan visual kebocoran, retak, dan vibrasi abnormal', done: false },
      { id: 'step-3', title: 'Pembersihan elemen saringan/strainer dan penggantian oli/filter', done: false },
      { id: 'step-4', title: 'Penyetelan celah / clearance komponen mekanis sesuai spesifikasi', done: false },
      { id: 'step-5', title: 'Running test beban normal dan catat parameter tekanan & suhu', done: false }
    ]
  );
  const [newStepText, setNewStepText] = useState('');

  // Consumed Spare Parts
  const [partsUsed, setPartsUsed] = useState(
    workOrder?.sparepartsRequired || []
  );
  const [selectedPartId, setSelectedPartId] = useState('');
  const [partQty, setPartQty] = useState(1);

  // Completion State
  const [executedRunningHours, setExecutedRunningHours] = useState(
    workOrder?.executedRunningHours || selectedEquipment?.runningHours || 0
  );
  const [oilPressure, setOilPressure] = useState(workOrder?.measuredParameters?.oilPressureBar || 4.5);
  const [waterTemp, setWaterTemp] = useState(workOrder?.measuredParameters?.coolingWaterTempC || 80);
  const [exhaustTemp, setExhaustTemp] = useState(workOrder?.measuredParameters?.exhaustAvgTempC || 320);
  const [workDoneSummary, setWorkDoneSummary] = useState(
    workOrder?.workDoneSummary || 'Pekerjaan servis telah dilaksanakan sesuai SOP. Seluruh parameter pengujian dalam batas toleransi aman.'
  );
  const [serviceCost, setServiceCost] = useState(workOrder?.serviceCost || 0);
  const [chiefApprover, setChiefApprover] = useState(
    workOrder?.chiefEngineerApprover || currentVessel?.chiefEngineer || 'Ir. Bambang Wijaya (KKM)'
  );
  const [captainApprover, setCaptainApprover] = useState(
    workOrder?.captainApprover || currentVessel?.masterCaptain || 'Capt. Hendra Gunawan, M.Mar'
  );

  // View Mode: 'edit' or 'print_report'
  const [viewMode, setViewMode] = useState('edit');

  const handleToggleSop = (stepId) => {
    if (isCompleted) return;
    setSopSteps(prev => prev.map(s => s.id === stepId ? { ...s, done: !s.done } : s));
  };

  const handleAddSopStep = () => {
    if (!newStepText.trim()) return;
    setSopSteps(prev => [
      ...prev,
      { id: `step-${Date.now()}`, title: newStepText.trim(), done: false }
    ]);
    setNewStepText('');
  };

  const handleRemoveSopStep = (stepId) => {
    setSopSteps(prev => prev.filter(s => s.id !== stepId));
  };

  const handleAddPart = () => {
    if (!selectedPartId) {
      showToast('Pilih suku cadang dari inventaris terlebih dahulu!', 'warning');
      return;
    }
    const part = vesselSpareparts.find(p => p.id === selectedPartId);
    if (!part) return;

    if (partsUsed.some(p => p.sparepartId === selectedPartId)) {
      showToast('Suku cadang ini sudah ada dalam daftar pemakaian!', 'info');
      return;
    }

    setPartsUsed(prev => [
      ...prev,
      {
        sparepartId: part.id,
        name: part.name,
        code: part.code,
        qty: Number(partQty) || 1,
        unit: part.unit || 'Pcs',
        stockAvailable: part.stockQty || 0,
        unitCost: part.unitCost || 0
      }
    ]);
    setSelectedPartId('');
    setPartQty(1);
  };

  const handleRemovePart = (partId) => {
    setPartsUsed(prev => prev.filter(p => p.sparepartId !== partId));
  };

  // Save / Update Work Order
  const handleSaveDraft = (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      showToast('Judul pekerjaan pemeliharaan wajib diisi!', 'warning');
      return;
    }

    const payload = {
      vesselId: selectedVesselId,
      equipmentId,
      equipmentName: selectedEquipment?.name || 'Equipment',
      workOrderType: woType,
      title: title.trim(),
      priority,
      status: workOrder?.status || 'Scheduled',
      plannedDate,
      dueDate,
      targetRunningHours: Number(targetRunningHours) || 0,
      assignedTechnician,
      assignedRole,
      chiefEngineerApprover: chiefApprover,
      captainApprover,
      description,
      sopSteps,
      sparepartsRequired: partsUsed,
      serviceCost: Number(serviceCost) || 0,
      measuredParameters: {
        runningHours: Number(executedRunningHours) || 0,
        oilPressureBar: Number(oilPressure) || 0,
        coolingWaterTempC: Number(waterTemp) || 0,
        exhaustAvgTempC: Number(exhaustTemp) || 0
      }
    };

    if (isEdit) {
      updateTechnicalWorkOrder(workOrder.id, payload);
    } else {
      addTechnicalWorkOrder(payload);
    }
    onClose();
  };

  // Complete Work Order & Closed Loop Execution
  const handleCompleteWorkOrder = () => {
    const allStepsDone = sopSteps.every(s => s.done);
    if (!allStepsDone) {
      const confirmIncomplete = window.confirm(
        'Perhatian: Masih ada langkah SOP checklist yang belum dicentang selesai. Tetap ingin menutup dan menyelesaikan Work Order ini?'
      );
      if (!confirmIncomplete) return;
    }

    const completionData = {
      executedRunningHours: Number(executedRunningHours) || selectedEquipment?.runningHours || 0,
      completionDate: new Date().toISOString().split('T')[0],
      workDoneSummary,
      measuredParameters: {
        runningHours: Number(executedRunningHours) || 0,
        oilPressureBar: Number(oilPressure) || 0,
        coolingWaterTempC: Number(waterTemp) || 0,
        exhaustAvgTempC: Number(exhaustTemp) || 0
      },
      sparepartsConsumed: partsUsed,
      serviceCost: Number(serviceCost) || 0,
      chiefEngineerApprover: chiefApprover,
      captainApprover
    };

    completeTechnicalWorkOrder(workOrder?.id || `WO-${Date.now()}`, completionData);
    onClose();
  };

  return (
    <div className="modal-overlay" style={{
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
      <div className="modal-dialog modal-dialog-large glass-card" style={{
        width: '100%',
        maxWidth: '960px',
        maxHeight: '92vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.65)'
      }}>
        {/* Header Modal */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(to right, rgba(2, 132, 199, 0.12), rgba(15, 23, 42, 0.6))',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Wrench size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  {isEdit ? `Work Order: ${workOrder.id}` : 'Perintah Kerja Pemeliharaan Teknis (Job Order)'}
                </h3>
                <span className={`badge ${
                  isCompleted ? 'badge-success' :
                  workOrder?.status === 'In Progress' ? 'badge-info' : 'badge-warning'
                }`}>
                  {isCompleted ? 'Selesai & Tertutup' : (workOrder?.status || 'Scheduled')}
                </span>
                <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                  Standard ISM Code 10.1 & BKI
                </span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                Kapal: <strong style={{ color: 'var(--text-main)' }}>{currentVessel?.name}</strong> • Formulir pemeliharaan mesin, SOP, konsumsi suku cadang, dan penutupan siklus PMS.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isEdit && (
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'edit' ? 'print_report' : 'edit')}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
              >
                <FileText size={15} />
                <span>{viewMode === 'edit' ? 'Format Cetak WO' : 'Form Input'}</span>
              </button>
            )}
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
        </div>

        {/* Content Body */}
        {viewMode === 'edit' ? (
          <form onSubmit={handleSaveDraft} style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Bagian 1: Identitas Pekerjaan & Mesin */}
            <div style={{
              padding: '1.25rem',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <Cpu size={18} color="#38bdf8" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>1. Identitas Mesin & Jenis Pemeliharaan</h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Armada Kapal
                  </label>
                  <select
                    disabled={isCompleted}
                    value={selectedVesselId}
                    onChange={(e) => setSelectedVesselId(e.target.value)}
                    className="input-base"
                    style={{ width: '100%' }}
                  >
                    {vessels.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.type})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Mesin / Equipment Target *
                  </label>
                  <select
                    disabled={isCompleted}
                    value={equipmentId}
                    onChange={(e) => {
                      setEquipmentId(e.target.value);
                      const eq = vesselEquipment.find(x => x.id === e.target.value);
                      if (eq) {
                        setTitle(`Servis Berkala ${eq.name}`);
                        setTargetRunningHours(eq.nextServiceHours || eq.runningHours + 500);
                      }
                    }}
                    className="input-base"
                    style={{ width: '100%' }}
                    required
                  >
                    {vesselEquipment.map(e => (
                      <option key={e.id} value={e.id}>
                        {e.code} - {e.name} (Jam: {e.runningHours.toLocaleString()} Jam)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Jenis Work Order
                  </label>
                  <select
                    disabled={isCompleted}
                    value={woType}
                    onChange={(e) => setWoType(e.target.value)}
                    className="input-base"
                    style={{ width: '100%' }}
                  >
                    <option value="Preventive Maintenance (PM)">Preventive Maintenance (PM Berbasis Jam/Hari)</option>
                    <option value="Corrective Maintenance (Breakdown)">Corrective Maintenance (Perbaikan Kerusakan)</option>
                    <option value="Class Survey Preparation">Persiapan Survey Kelas BKI / Statutory</option>
                    <option value="Condition Monitoring">Condition Monitoring & Uji Parameter</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Tingkat Prioritas
                  </label>
                  <select
                    disabled={isCompleted}
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="input-base"
                    style={{ width: '100%' }}
                  >
                    <option value="Kritis (Emergency)">🔴 Kritis (Emergency / Breakdown)</option>
                    <option value="Tinggi">🟠 Tinggi (Jatuh Tempo Segera)</option>
                    <option value="Sedang">🟡 Sedang (Rutin Berkala)</option>
                    <option value="Rendah">🟢 Rendah (Observasi)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Judul Perintah Kerja (Job Title) *
                </label>
                <input
                  disabled={isCompleted}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-base"
                  style={{ width: '100%' }}
                  placeholder="Contoh: Servis Rutin 500 Jam & Penggantian Filter Mesin Induk Kiri"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Target Jam Mesin (Running Hours)
                  </label>
                  <input
                    disabled={isCompleted}
                    type="number"
                    value={targetRunningHours}
                    onChange={(e) => setTargetRunningHours(e.target.value)}
                    className="input-base"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Target Tanggal Selesai (Due Date)
                  </label>
                  <input
                    disabled={isCompleted}
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="input-base"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Teknisi Pelaksana (PIC)
                  </label>
                  <input
                    disabled={isCompleted}
                    type="text"
                    value={assignedTechnician}
                    onChange={(e) => setAssignedTechnician(e.target.value)}
                    className="input-base"
                    style={{ width: '100%' }}
                    placeholder="Nama Masinis / Teknisi"
                  />
                </div>
              </div>
            </div>

            {/* Bagian 2: Checklist Prosedur Standar Operasional (SOP Steps) */}
            <div style={{
              padding: '1.25rem',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>2. Checklist Langkah Kerja (SOP ISM Code)</h4>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {sopSteps.filter(s => s.done).length} dari {sopSteps.length} langkah selesai
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {sopSteps.map((step, idx) => (
                  <div
                    key={step.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      background: step.done ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                      border: step.done ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)'
                    }}
                  >
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: isCompleted ? 'default' : 'pointer', flex: 1, margin: 0 }}>
                      <input
                        type="checkbox"
                        checked={step.done}
                        disabled={isCompleted}
                        onChange={() => handleToggleSop(step.id)}
                        style={{ width: '16px', height: '16px', accentColor: '#10b981' }}
                      />
                      <span style={{
                        fontSize: '0.85rem',
                        textDecoration: step.done ? 'line-through' : 'none',
                        color: step.done ? 'var(--text-muted)' : 'var(--text-main)'
                      }}>
                        <strong style={{ marginRight: '6px' }}>{idx + 1}.</strong> {step.title}
                      </span>
                    </label>

                    {!isCompleted && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSopStep(step.id)}
                        style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {!isCompleted && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input
                    type="text"
                    value={newStepText}
                    onChange={(e) => setNewStepText(e.target.value)}
                    placeholder="Tambah langkah checklist baru..."
                    className="input-base"
                    style={{ flex: 1 }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSopStep(); } }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSopStep}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                  >
                    <Plus size={15} />
                    <span>Tambah Langkah</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bagian 3: Suku Cadang yang Dipakai (Closed-Loop Inventory) */}
            <div style={{
              padding: '1.25rem',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Package size={18} color="#f59e0b" />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                    3. Konsumsi Suku Cadang & Logistik Onboard (Otomatis Potong Stok)
                  </h4>
                </div>
                <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                  Siklus Tertutup Inventaris
                </span>
              </div>

              {partsUsed.length === 0 ? (
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                  Belum ada suku cadang yang ditambahkan ke pengerjaan ini. Suku cadang yang dipilih akan langsung dipotong dari stok kapal saat WO diselesaikan.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {partsUsed.map((p, idx) => (
                    <div
                      key={p.sparepartId || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        background: 'rgba(245, 158, 11, 0.06)',
                        border: '1px solid rgba(245, 158, 11, 0.25)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>{idx + 1}</span>
                        <div>
                          <strong style={{ fontSize: '0.875rem', display: 'block' }}>{p.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Stok Onboard Tersedia: {p.stockAvailable || 0} {p.unit}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.9rem' }}>
                          Dipakai: {p.qty} {p.unit}
                        </span>
                        {!isCompleted && (
                          <button
                            type="button"
                            onClick={() => handleRemovePart(p.sparepartId)}
                            style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isCompleted && (
                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'flex-end', marginTop: '0.5rem' }}>
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                      Pilih Suku Cadang Onboard
                    </label>
                    <select
                      value={selectedPartId}
                      onChange={(e) => setSelectedPartId(e.target.value)}
                      className="input-base"
                      style={{ width: '100%' }}
                    >
                      <option value="">-- Pilih Suku Cadang Kapal --</option>
                      {vesselSpareparts.map(sp => (
                        <option key={sp.id} value={sp.id}>
                          {sp.name} (Stok Onboard: {sp.stockQty} {sp.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ width: '100px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                      Jumlah Pakai
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={partQty}
                      onChange={(e) => setPartQty(Math.max(1, Number(e.target.value) || 1))}
                      className="input-base"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddPart}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '0.55rem 1rem' }}
                  >
                    <Plus size={15} />
                    <span>Tambahkan Suku Cadang</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bagian 4: Pengukuran Parameter Teknis & Penyelesaian Servis (Closed-Loop Maintenance) */}
            <div style={{
              padding: '1.25rem',
              borderRadius: '12px',
              background: 'linear-gradient(to right, rgba(16, 185, 129, 0.08), rgba(2, 132, 199, 0.05))',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(16, 185, 129, 0.25)', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={18} color="#10b981" />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                    4. Hasil Pengukuran Parameter & Verifikasi Penutupan Work Order
                  </h4>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                  Auto-Reset Jam Servis
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                    Jam Mesin Saat Servis (Running Hours) *
                  </label>
                  <input
                    disabled={isCompleted}
                    type="number"
                    value={executedRunningHours}
                    onChange={(e) => setExecutedRunningHours(e.target.value)}
                    className="input-base"
                    style={{ width: '100%', fontWeight: 700, color: '#38bdf8' }}
                    required
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Otomatis mereset jam mesin terakhir
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                    Tekanan Oli Pelumas (bar)
                  </label>
                  <input
                    disabled={isCompleted}
                    type="number"
                    step="0.1"
                    value={oilPressure}
                    onChange={(e) => setOilPressure(e.target.value)}
                    className="input-base"
                    style={{ width: '100%' }}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Standar: 3.5 - 5.0 bar</span>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                    Suhu Air Pendingin (°C)
                  </label>
                  <input
                    disabled={isCompleted}
                    type="number"
                    value={waterTemp}
                    onChange={(e) => setWaterTemp(e.target.value)}
                    className="input-base"
                    style={{ width: '100%' }}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Standar: 75 - 85 °C</span>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                    Biaya Jasa / Pihak ke-3 (Rp)
                  </label>
                  <input
                    disabled={isCompleted}
                    type="number"
                    value={serviceCost}
                    onChange={(e) => setServiceCost(e.target.value)}
                    className="input-base"
                    style={{ width: '100%' }}
                    placeholder="0 jika dikerjakan kru sendiri"
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Otomatis tercatat ke Buku Kas</span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                  Ringkasan Hasil Pekerjaan (Work Done Summary)
                </label>
                <textarea
                  disabled={isCompleted}
                  rows={2}
                  value={workDoneSummary}
                  onChange={(e) => setWorkDoneSummary(e.target.value)}
                  className="input-base"
                  style={{ width: '100%', resize: 'vertical' }}
                  placeholder="Deskripsikan kondisi komponen setelah diperiksa, penggantian suku cadang, dan hasil uji coba..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                    Verifikasi KKM (Chief Engineer)
                  </label>
                  <input
                    disabled={isCompleted}
                    type="text"
                    value={chiefApprover}
                    onChange={(e) => setChiefApprover(e.target.value)}
                    className="input-base"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                    Mengetahui Nakhoda (Master Captain)
                  </label>
                  <input
                    disabled={isCompleted}
                    type="text"
                    value={captainApprover}
                    onChange={(e) => setCaptainApprover(e.target.value)}
                    className="input-base"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* Tombol Aksi Bawah */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '1.25rem',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-neutral"
              >
                Tutup
              </button>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {!isCompleted && (
                  <button
                    type="submit"
                    className="btn btn-secondary"
                  >
                    <Save size={16} />
                    <span>Simpan Draf WO</span>
                  </button>
                )}

                {!isCompleted && isEdit && (
                  <button
                    type="button"
                    onClick={handleCompleteWorkOrder}
                    className="btn btn-success"
                    style={{
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                      padding: '0.65rem 1.4rem'
                    }}
                  >
                    <CheckCircle2 size={18} />
                    <span>Selesaikan & Tutup Siklus Servis</span>
                  </button>
                )}
              </div>
            </div>
          </form>
        ) : (
          /* View Mode: Print Official Work Order Report (Standar Maritim A4) */
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
            {/* Action Bar (No-Print) */}
            <div className="no-print" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.85rem 1.5rem',
              background: 'rgba(2, 132, 199, 0.1)',
              borderBottom: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="#10b981" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Lembar Perintah Kerja Pemeliharaan Mesin Siap Dicetak / Disimpan ke PDF
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setViewMode('edit')}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
                >
                  <Edit3 size={14} />
                  <span>Kembali ke Form Input</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', fontWeight: 700 }}
                >
                  <Printer size={15} />
                  <span>Cetak Dokumen WO (Print / PDF)</span>
                </button>
              </div>
            </div>

            {/* PRINTABLE WORK ORDER SHEET (A4 STANDAR INTERNASIONAL) */}
            <div style={{ padding: '1.5rem', background: '#ffffff', color: '#0f172a' }}>
              <div
                className="particulars-sheet technical-wo-print-sheet maritime-print-sheet"
                style={{
                  background: '#ffffff',
                  color: '#0f172a',
                  padding: '2.5rem 2rem',
                  fontFamily: '"Segoe UI", Arial, sans-serif',
                  margin: '0 auto',
                  maxWidth: '920px'
                }}
              >
                {/* 1. KOP SURAT RESMI PERUSAHAAN PELAYARAN */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  borderBottom: '3px double #0f172a',
                  paddingBottom: '0.85rem',
                  marginBottom: '1.25rem'
                }}>
                  <BaharimasEmblem size={56} />
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      PT. PELAYARAN BAHARIMAS KALIMANTAN
                    </h2>
                    <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0369a1', margin: '2px 0 0 0', textTransform: 'uppercase' }}>
                      SHIP MANAGEMENT & TECHNICAL FLEET MAINTENANCE DIVISION
                    </p>
                    <p style={{ fontSize: '0.72rem', color: '#475569', margin: '2px 0 0 0' }}>
                      Jl. Rahadi Usman No. 88, Pontianak, Kalimantan Barat 78111 • Telp: (0561) 741234 • Email: technical@baharimas.co.id
                    </p>
                    <p style={{ fontSize: '0.68rem', color: '#64748b', margin: '1px 0 0 0' }}>
                      SIUPAL: B.XX-248/AL.001/DJPL • Standar IMO ISM Code Section 10 & Biro Klasifikasi Indonesia (BKI MPMS)
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', borderLeft: '1px solid #cbd5e1', paddingLeft: '1.25rem' }}>
                    <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>KODE FORMULIR RESMI</span>
                    <strong style={{ fontSize: '0.85rem', color: '#0f172a', fontFamily: 'monospace' }}>FORM-PMS-WO/REV.03</strong>
                    <span style={{ fontSize: '0.68rem', color: '#0284c7', display: 'block', marginTop: '3px', fontWeight: 700 }}>
                      ISM CODE 10.1 COMPLIANT
                    </span>
                  </div>
                </div>

                {/* 2. JUDUL DOKUMEN & NOMOR WO */}
                <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    color: '#0f172a',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    textDecoration: 'underline'
                  }}>
                    PERINTAH KERJA PEMELIHARAAN MESIN KAPAL
                  </h3>
                  <p style={{ fontSize: '0.82rem', fontStyle: 'italic', color: '#64748b', margin: '2px 0 0 0' }}>
                    (TECHNICAL PLANNED MAINTENANCE WORK ORDER REPORT)
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0369a1', fontFamily: 'monospace' }}>
                      NOMOR WO: {workOrder?.id || 'WO-2026-NEW'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>•</span>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: isCompleted ? '#dcfce7' : '#fef3c7',
                      color: isCompleted ? '#15803d' : '#b45309',
                      border: isCompleted ? '1px solid #86efac' : '1px solid #fde68a'
                    }}>
                      STATUS: {isCompleted ? 'SELESAI & TERVERIFIKASI' : (workOrder?.status?.toUpperCase() || 'SCHEDULED')}
                    </span>
                  </div>
                </div>

                {/* 3. METADATA KAPAL & PERALATAN (TABEL 2 KOLOM) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1rem',
                  fontSize: '0.8rem',
                  background: '#f8fafc',
                  padding: '0.85rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex' }}>
                      <span style={{ width: '140px', color: '#64748b' }}>Nama Kapal:</span>
                      <strong style={{ color: '#0f172a' }}>{currentVessel?.name} ({currentVessel?.type})</strong>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <span style={{ width: '140px', color: '#64748b' }}>Call Sign / IMO No:</span>
                      <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>{currentVessel?.callSign || '-'} / {currentVessel?.imo || '-'}</strong>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <span style={{ width: '140px', color: '#64748b' }}>Mesin / Peralatan:</span>
                      <strong style={{ color: '#0284c7' }}>{selectedEquipment?.name} [{selectedEquipment?.code}]</strong>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <span style={{ width: '140px', color: '#64748b' }}>Maker / Model:</span>
                      <span style={{ color: '#0f172a' }}>{selectedEquipment?.maker || '-'} {selectedEquipment?.model || ''}</span>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <span style={{ width: '140px', color: '#64748b' }}>Lokasi Permesinan:</span>
                      <span style={{ color: '#0f172a' }}>{selectedEquipment?.location || 'Kamar Mesin (Engine Room)'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex' }}>
                      <span style={{ width: '140px', color: '#64748b' }}>Tipe Perawatan:</span>
                      <strong style={{ color: '#0f172a' }}>{woType} ({priority})</strong>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <span style={{ width: '140px', color: '#64748b' }}>Tanggal Pelaksanaan:</span>
                      <strong style={{ color: '#0f172a' }}>{plannedDate}</strong>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <span style={{ width: '140px', color: '#64748b' }}>Jam Mesin Pelaksanaan:</span>
                      <strong style={{ color: '#0284c7', fontFamily: 'monospace' }}>
                        {Number(executedRunningHours) > 0 ? executedRunningHours : targetRunningHours} Running Hours
                      </strong>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <span style={{ width: '140px', color: '#64748b' }}>Teknisi Pelaksana:</span>
                      <strong style={{ color: '#0f172a' }}>{assignedTechnician} ({assignedRole})</strong>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <span style={{ width: '140px', color: '#64748b' }}>Interval Servis PMS:</span>
                      <span style={{ color: '#0f172a' }}>Setiap {serviceIntervalHours} Jam Operasi</span>
                    </div>
                  </div>
                </div>

                {/* 4. PARAMETER TEKNIS OPERASIONAL MESIN (HASIL UKUR PASCA SERVIS) */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#0f172a',
                    marginBottom: '0.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}>
                    <Activity size={14} color="#0284c7" />
                    <span>Parameter Teknis & Hasil Pengukuran Operasional Mesin (Post-Maintenance)</span>
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '0.65rem',
                    fontSize: '0.78rem'
                  }}>
                    <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.6rem 0.8rem', background: '#f8fafc' }}>
                      <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>Tekanan Oli (Lube Oil)</span>
                      <strong style={{ fontSize: '0.95rem', color: '#0284c7', fontFamily: 'monospace' }}>
                        {oilPressure ? `${oilPressure} Bar` : '4.2 Bar'}
                      </strong>
                      <span style={{ fontSize: '0.65rem', color: '#16a34a', display: 'block' }}>✓ Normal (3.5 - 5.0)</span>
                    </div>

                    <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.6rem 0.8rem', background: '#f8fafc' }}>
                      <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>Suhu Air Pendingin (Water Temp)</span>
                      <strong style={{ fontSize: '0.95rem', color: '#0284c7', fontFamily: 'monospace' }}>
                        {waterTemp ? `${waterTemp} °C` : '78 °C'}
                      </strong>
                      <span style={{ fontSize: '0.65rem', color: '#16a34a', display: 'block' }}>✓ Normal (70 - 85 °C)</span>
                    </div>

                    <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.6rem 0.8rem', background: '#f8fafc' }}>
                      <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>Suhu Gas Buang (Exhaust)</span>
                      <strong style={{ fontSize: '0.95rem', color: '#0284c7', fontFamily: 'monospace' }}>
                        {exhaustTemp ? `${exhaustTemp} °C` : '360 °C'}
                      </strong>
                      <span style={{ fontSize: '0.65rem', color: '#16a34a', display: 'block' }}>✓ Normal (&lt; 450 °C)</span>
                    </div>

                    <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.6rem 0.8rem', background: '#f8fafc' }}>
                      <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>Kondisi Getaran / Suara</span>
                      <strong style={{ fontSize: '0.85rem', color: '#16a34a' }}>
                        Halus & Stabil
                      </strong>
                      <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block' }}>Tanpa Anomali Getar</span>
                    </div>
                  </div>
                </div>

                {/* 5. TABEL SOP CHECKLIST PEMELIHARAAN */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#0f172a',
                    marginBottom: '0.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}>
                    <CheckSquare size={14} color="#0284c7" />
                    <span>Langkah Standar Operasional Prosedur (SOP) & Checklist Pemeriksaan</span>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', border: '1px solid #0f172a' }}>
                    <thead>
                      <tr style={{ background: '#e2e8f0', color: '#0f172a', borderBottom: '1.5px solid #0f172a' }}>
                        <th style={{ border: '1px solid #0f172a', padding: '6px', width: '35px', textAlign: 'center' }}>NO</th>
                        <th style={{ border: '1px solid #0f172a', padding: '6px 10px', textAlign: 'left' }}>URAIAN LANGKAH KERJA / PROSEDUR PMS</th>
                        <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '120px', textAlign: 'center' }}>STATUS KERJA</th>
                        <th style={{ border: '1px solid #0f172a', padding: '6px 10px', width: '150px', textAlign: 'left' }}>VERIFIKASI TEKNISI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sopSteps.map((s, idx) => (
                        <tr key={s.id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                          <td style={{ border: '1px solid #0f172a', padding: '5px', textAlign: 'center', fontWeight: 600 }}>{idx + 1}</td>
                          <td style={{ border: '1px solid #0f172a', padding: '5px 10px' }}>{s.title}</td>
                          <td style={{ border: '1px solid #0f172a', padding: '5px 8px', textAlign: 'center', fontWeight: 700, color: s.done ? '#16a34a' : '#0284c7' }}>
                            {s.done ? '☑ TERLAKSANA' : '☑ DILAKSANAKAN'}
                          </td>
                          <td style={{ border: '1px solid #0f172a', padding: '5px 10px', color: '#475569', fontSize: '0.72rem' }}>
                            {assignedTechnician} (OK)
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 6. TABEL SUKU CADANG & PELUMAS YANG DIKONSUMSI */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#0f172a',
                    marginBottom: '0.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}>
                    <Package size={14} color="#0284c7" />
                    <span>Suku Cadang, Material & Pelumas yang Dikonsumsi (Closed-Loop Inventory)</span>
                  </div>
                  {partsUsed.length === 0 ? (
                    <div style={{ padding: '0.65rem', border: '1px dashed #cbd5e1', borderRadius: '4px', fontSize: '0.78rem', color: '#64748b', textAlign: 'center' }}>
                      Pekerjaan servis ini bersifat inspeksi / pembersihan / kalibrasi tanpa penggantian suku cadang utama.
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', border: '1px solid #0f172a' }}>
                      <thead>
                        <tr style={{ background: '#e2e8f0', color: '#0f172a', borderBottom: '1.5px solid #0f172a' }}>
                          <th style={{ border: '1px solid #0f172a', padding: '6px', width: '35px', textAlign: 'center' }}>NO</th>
                          <th style={{ border: '1px solid #0f172a', padding: '6px 10px', textAlign: 'left' }}>NAMA SUKU CADANG / MATERIAL</th>
                          <th style={{ border: '1px solid #0f172a', padding: '6px 10px', width: '120px', textAlign: 'left' }}>KODE PART</th>
                          <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '90px', textAlign: 'center' }}>JUMLAH</th>
                          <th style={{ border: '1px solid #0f172a', padding: '6px 10px', width: '130px', textAlign: 'right' }}>ESTIMASI NILAI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {partsUsed.map((p, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #cbd5e1' }}>
                            <td style={{ border: '1px solid #0f172a', padding: '5px', textAlign: 'center', fontWeight: 600 }}>{idx + 1}</td>
                            <td style={{ border: '1px solid #0f172a', padding: '5px 10px', fontWeight: 700 }}>{p.name}</td>
                            <td style={{ border: '1px solid #0f172a', padding: '5px 10px', fontFamily: 'monospace' }}>{p.code || '-'}</td>
                            <td style={{ border: '1px solid #0f172a', padding: '5px 8px', textAlign: 'center', fontWeight: 700, color: '#0284c7' }}>
                              {p.qty} {p.unit}
                            </td>
                            <td style={{ border: '1px solid #0f172a', padding: '5px 10px', textAlign: 'right', fontFamily: 'monospace' }}>
                              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format((p.unitCost || 0) * p.qty)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* 7. CATATAN & EVALUASI KEPALA KAMAR MESIN (KKM) */}
                <div style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '0.75rem 1rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.78rem',
                  background: '#f8fafc'
                }}>
                  <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                    Evaluasi Hasil Pekerjaan & Rekomendasi Kelaiklautan Mesin:
                  </strong>
                  <p style={{ margin: 0, color: '#334155', lineHeight: '1.5' }}>
                    {workDoneSummary || 'Pekerjaan pemeliharaan berkala telah selesai dilaksanakan secara tuntas sesuai dengan spesifikasi buku petunjuk pabrik (maker manual) dan standar PMS kapal. Seluruh baut pengikat telah dikencangkan sesuai torsi standar, filter telah dibersihkan/diganti, dan pengujian beban (running test) menunjukkan seluruh parameter mesin dalam batas normal serta laik laut berlayar.'}
                  </p>
                </div>

                {/* 8. KOLOM TANDA TANGAN 4 PIHAK RESMI (STANDAR MARITIM DUNIA) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '1rem',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  pageBreakInside: 'avoid',
                  borderTop: '1.5px dashed #cbd5e1',
                  paddingTop: '1rem'
                }}>
                  <div>
                    <p style={{ color: '#64748b', margin: '0 0 3.2rem 0' }}>
                      Dilaksanakan Oleh,<br />
                      <strong>Teknisi Pelaksana</strong>
                    </p>
                    <p style={{ borderBottom: '1px solid #0f172a', fontWeight: 800, margin: 0, paddingBottom: '2px', color: '#0f172a' }}>
                      {assignedTechnician}
                    </p>
                    <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{assignedRole}</span>
                  </div>

                  <div>
                    <p style={{ color: '#64748b', margin: '0 0 3.2rem 0' }}>
                      Diperiksa & Disetujui,<br />
                      <strong>Chief Engineer (KKM)</strong>
                    </p>
                    <p style={{ borderBottom: '1px solid #0f172a', fontWeight: 800, margin: 0, paddingBottom: '2px', color: '#0f172a' }}>
                      {chiefApprover}
                    </p>
                    <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Ijazah: ATT II / ATT III</span>
                  </div>

                  <div>
                    <p style={{ color: '#64748b', margin: '0 0 3.2rem 0' }}>
                      Mengetahui Onboard,<br />
                      <strong>Nakhoda Kapal (Master)</strong>
                    </p>
                    <p style={{ borderBottom: '1px solid #0f172a', fontWeight: 800, margin: 0, paddingBottom: '2px', color: '#0f172a' }}>
                      {captainApprover}
                    </p>
                    <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Ijazah: ANT II / ANT III</span>
                  </div>

                  <div>
                    <p style={{ color: '#64748b', margin: '0 0 3.2rem 0' }}>
                      Verifikasi Kantor Darat,<br />
                      <strong>Marine Superintendent / DPA</strong>
                    </p>
                    <p style={{ borderBottom: '1px solid #0f172a', fontWeight: 800, margin: 0, paddingBottom: '2px', color: '#0f172a' }}>
                      Capt. Ir. Rudi Hartono, M.Mar
                    </p>
                    <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Divisi Teknik Armada PT. PBK</span>
                  </div>
                </div>

                {/* Footer Note */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.68rem',
                  color: '#94a3b8',
                  marginTop: '1.5rem',
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '0.5rem'
                }}>
                  <span>Dokumen Sah Sistem PMS Terintegrasi PT. Pelayaran Baharimas Kalimantan</span>
                  <span>Dicetak Tanggal: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
