import React, { useState, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
import { TechnicalWOModalHeader } from './techwo/TechnicalWOModalHeader';
import { TechnicalWOJobIdentity } from './techwo/TechnicalWOJobIdentity';
import { TechnicalWOSopChecklist } from './techwo/TechnicalWOSopChecklist';
import { TechnicalWOSparepartsUsed } from './techwo/TechnicalWOSparepartsUsed';
import { TechnicalWOMeasurements } from './techwo/TechnicalWOMeasurements';
import { TechnicalWOFormActions } from './techwo/TechnicalWOFormActions';
import { TechnicalWOPrintSheet } from './techwo/TechnicalWOPrintSheet';
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
  Activity,
  CheckSquare,
  Edit3
} from 'lucide-react';
import { makeId } from '../../utils/idUtils';

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
      { id: makeId('step'), title: newStepText.trim(), done: false }
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
        <TechnicalWOModalHeader
          currentVessel={currentVessel}
          isCompleted={isCompleted}
          isEdit={isEdit}
          onClose={onClose}
          setViewMode={setViewMode}
          viewMode={viewMode}
          workOrder={workOrder}
        />

        {/* Content Body */}
        {viewMode === 'edit' ? (
          <form onSubmit={handleSaveDraft} style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Bagian 1: Identitas Pekerjaan & Mesin */}
            <TechnicalWOJobIdentity
              assignedTechnician={assignedTechnician}
              dueDate={dueDate}
              equipmentId={equipmentId}
              isCompleted={isCompleted}
              priority={priority}
              selectedVesselId={selectedVesselId}
              setAssignedTechnician={setAssignedTechnician}
              setDueDate={setDueDate}
              setEquipmentId={setEquipmentId}
              setPriority={setPriority}
              setSelectedVesselId={setSelectedVesselId}
              setTargetRunningHours={setTargetRunningHours}
              setTitle={setTitle}
              setWoType={setWoType}
              targetRunningHours={targetRunningHours}
              title={title}
              vesselEquipment={vesselEquipment}
              vessels={vessels}
              woType={woType}
            />

            {/* Bagian 2: Checklist Prosedur Standar Operasional (SOP Steps) */}
            <TechnicalWOSopChecklist
              handleAddSopStep={handleAddSopStep}
              handleRemoveSopStep={handleRemoveSopStep}
              handleToggleSop={handleToggleSop}
              isCompleted={isCompleted}
              newStepText={newStepText}
              setNewStepText={setNewStepText}
              sopSteps={sopSteps}
            />

            {/* Bagian 3: Suku Cadang yang Dipakai (Closed-Loop Inventory) */}
            <TechnicalWOSparepartsUsed
              handleAddPart={handleAddPart}
              handleRemovePart={handleRemovePart}
              isCompleted={isCompleted}
              partQty={partQty}
              partsUsed={partsUsed}
              selectedPartId={selectedPartId}
              setPartQty={setPartQty}
              setSelectedPartId={setSelectedPartId}
              vesselSpareparts={vesselSpareparts}
            />

            {/* Bagian 4: Pengukuran Parameter Teknis & Penyelesaian Servis (Closed-Loop Maintenance) */}
            <TechnicalWOMeasurements
              captainApprover={captainApprover}
              chiefApprover={chiefApprover}
              executedRunningHours={executedRunningHours}
              isCompleted={isCompleted}
              oilPressure={oilPressure}
              serviceCost={serviceCost}
              setCaptainApprover={setCaptainApprover}
              setChiefApprover={setChiefApprover}
              setExecutedRunningHours={setExecutedRunningHours}
              setOilPressure={setOilPressure}
              setServiceCost={setServiceCost}
              setWaterTemp={setWaterTemp}
              setWorkDoneSummary={setWorkDoneSummary}
              waterTemp={waterTemp}
              workDoneSummary={workDoneSummary}
            />

            {/* Tombol Aksi Bawah */}
            <TechnicalWOFormActions
              handleCompleteWorkOrder={handleCompleteWorkOrder}
              isCompleted={isCompleted}
              isEdit={isEdit}
              onClose={onClose}
            />
          </form>
        ) : (
          /* View Mode: Print Official Work Order Report (Standar Maritim A4) */
          <TechnicalWOPrintSheet
            assignedRole={assignedRole}
            assignedTechnician={assignedTechnician}
            captainApprover={captainApprover}
            chiefApprover={chiefApprover}
            currentVessel={currentVessel}
            executedRunningHours={executedRunningHours}
            exhaustTemp={exhaustTemp}
            isCompleted={isCompleted}
            oilPressure={oilPressure}
            partsUsed={partsUsed}
            plannedDate={plannedDate}
            priority={priority}
            selectedEquipment={selectedEquipment}
            setViewMode={setViewMode}
            sopSteps={sopSteps}
            targetRunningHours={targetRunningHours}
            waterTemp={waterTemp}
            woType={woType}
            workDoneSummary={workDoneSummary}
            workOrder={workOrder}
          />
        )}
      </div>
    </div>
  );
};
