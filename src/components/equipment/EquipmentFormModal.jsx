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
import { EquipFormHeader } from './equipform/EquipFormHeader';
import { EquipVesselAssignment } from './equipform/EquipVesselAssignment';
import { EquipTechSpecSection } from './equipform/EquipTechSpecSection';
import { EquipRunningHoursSection } from './equipform/EquipRunningHoursSection';
import { EquipComponentsSection } from './equipform/EquipComponentsSection';
import { EquipNotesSection } from './equipform/EquipNotesSection';
import { EquipFormFooter } from './equipform/EquipFormFooter';

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
        <EquipFormHeader
          equipment={equipment}
          isEdit={isEdit}
          isFullscreen={isFullscreen}
          onClose={onClose}
          setIsFullscreen={setIsFullscreen}
        />

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
            <EquipVesselAssignment
              category={category}
              categoryOptions={categoryOptions}
              code={code}
              location={location}
              locationPresets={locationPresets}
              name={name}
              setCategory={setCategory}
              setCode={setCode}
              setLocation={setLocation}
              setName={setName}
              setVesselId={setVesselId}
              theme={theme}
              vesselId={vesselId}
              vessels={vessels}
            />

            {/* SECTION 2: Technical Specifications & Maker */}
            <EquipTechSpecSection
              criticality={criticality}
              installedDate={installedDate}
              maker={maker}
              model={model}
              serialNumber={serialNumber}
              setCriticality={setCriticality}
              setInstalledDate={setInstalledDate}
              setMaker={setMaker}
              setModel={setModel}
              setSerialNumber={setSerialNumber}
              theme={theme}
            />

            {/* SECTION 3: Running Hours & PMS Intervals */}
            <EquipRunningHoursSection
              applyPresetInterval={applyPresetInterval}
              calculatedStatus={calculatedStatus}
              hoursLeft={hoursLeft}
              lastMaintenanceHours={lastMaintenanceHours}
              nextServiceHours={nextServiceHours}
              numNext={numNext}
              numRunning={numRunning}
              percentageUsed={percentageUsed}
              runningHours={runningHours}
              setLastMaintenanceHours={setLastMaintenanceHours}
              setNextServiceHours={setNextServiceHours}
              setRunningHours={setRunningHours}
              theme={theme}
            />

            {/* SECTION 4: Sub-Components Hierarchy */}
            <EquipComponentsSection
              category={category}
              handleAddSubComponent={handleAddSubComponent}
              handleRemoveSubComponent={handleRemoveSubComponent}
              setSubComponents={setSubComponents}
              setSubInput={setSubInput}
              subComponents={subComponents}
              subInput={subInput}
              suggestedComponents={suggestedComponents}
              theme={theme}
            />

            {/* SECTION 5: Technical Notes */}
            <EquipNotesSection
              notes={notes}
              setNotes={setNotes}
              theme={theme}
            />
          </div>

          {/* Footer */}
          <EquipFormFooter
            isEdit={isEdit}
            onClose={onClose}
          />
        </form>
      </div>
    </div>
  );
};
