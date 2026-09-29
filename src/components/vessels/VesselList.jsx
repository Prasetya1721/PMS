import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Ship,
  Wrench,
  Users,
  ArrowRight,
  ShieldCheck,
  Plus,
  Search,
  Filter,
  FileCheck,
  FileText,
  X
} from 'lucide-react';
import { ParticularsModal } from './ParticularsModal';
import { MasterCombobox } from '../common/MasterCombobox';
import { VesselListHeader } from './vessellist/VesselListHeader';
import { VesselListFilterBar } from './vessellist/VesselListFilterBar';
import { VesselListInfoBar } from './vessellist/VesselListInfoBar';
import { VesselCardGrid } from './vessellist/VesselCardGrid';
import { VesselAddModal } from './vessellist/VesselAddModal';

export const VesselList = () => {
  const {
    vessels,
    allEquipment,
    allCrew,
    allWorkOrders,
    allShipDocuments,
    setSelectedVesselId,
    setActiveTab,
    addVessel,
    updateVesselParticulars,
    vesselTypes,
    portLocations,
    showToast
  } = usePMS();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL | OWNER | OPERATOR | TUGBOAT | BARGE
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVesselForParticulars, setSelectedVesselForParticulars] = useState(null);

  // Form State for Manual Ship Entry
  const [formData, setFormData] = useState({
    name: '',
    regNo: '',
    imo: '',
    callSign: '',
    type: '',
    ownershipStatus: 'As Owner & Operator',
    status: 'Operasional (Berlayar)',
    flag: 'Indonesia (IDN)',
    portOfRegistry: '',
    gt: 320,
    dwt: 450,
    yearBuilt: new Date().getFullYear(),
    builder: 'PT Dok & Perkapalan Baharimas',
    currentLocation: 'Sungai Kapuas, Pontianak',
    speedKnots: 8.0,
    masterCaptain: '',
    chiefEngineer: '',
    photo: ''
  });

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      regNo: '',
      imo: '',
      callSign: '',
      type: '',
      ownershipStatus: 'As Owner & Operator',
      status: 'Operasional (Berlayar)',
      flag: 'Indonesia (IDN)',
      portOfRegistry: '',
      gt: 320,
      dwt: 450,
      yearBuilt: new Date().getFullYear(),
      builder: 'PT Dok & Perkapalan Baharimas',
      currentLocation: 'Sungai Kapuas, Pontianak',
      speedKnots: 8.0,
      masterCaptain: '',
      chiefEngineer: '',
      photo: ''
    });
    setShowAddModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showToast('Nama resmi kapal wajib diisi!', 'warning');
      return;
    }

    try {
      const cleanReg = formData.regNo?.trim() || '';
      const cleanType = formData.type?.trim() || 'Tugboat Twin Screw';
      const isBarge = cleanType.toLowerCase().includes('tongkang') || cleanType.toLowerCase().includes('barge');

      const newShip = addVessel({
        ...formData,
        name: formData.name.trim(),
        type: cleanType,
        portOfRegistry: formData.portOfRegistry?.trim() || 'Pontianak, Kalimantan Barat',
        regNo: cleanReg,
        imo: formData.imo?.trim() || '',
        callSign: formData.callSign?.trim() || (isBarge ? '-' : (cleanReg ? `YDB${cleanReg.replace(/[^A-Za-z0-9]/g, '').slice(0, 4)}` : '-'))
      });

      if (newShip) {
        setShowAddModal(false);
        // Automatically select the new ship and switch to its dashboard!
        setSelectedVesselId(newShip.id);
        setActiveTab('dashboard');
      }
    } catch (err) {
      console.error('Submit ship form error:', err);
      showToast('Gagal menyimpan kapal: ' + err.message, 'error');
    }
  };

  // Filter and Search logic
  const filteredVessels = vessels.filter(v => {
    let matchFilter = true;
    if (filterType === 'OWNER') matchFilter = !v.id.startsWith('v-op-') && v.ownershipStatus !== 'As Operator';
    else if (filterType === 'OPERATOR') matchFilter = v.id.startsWith('v-op-') || v.ownershipStatus === 'As Operator';
    else if (filterType === 'TUGBOAT') matchFilter = v.type?.toLowerCase().includes('tugboat') || v.type?.toLowerCase().includes('tunda') || v.type?.toLowerCase().includes('penarik');
    else if (filterType === 'BARGE') matchFilter = v.type?.toLowerCase().includes('tongkang') || v.type?.toLowerCase().includes('barge');

    const matchSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      (v.regNo && v.regNo.toLowerCase().includes(search.toLowerCase())) ||
      (v.imo && v.imo.toLowerCase().includes(search.toLowerCase())) ||
      (v.callSign && v.callSign.toLowerCase().includes(search.toLowerCase())) ||
      (v.portOfRegistry && v.portOfRegistry.toLowerCase().includes(search.toLowerCase())) ||
      (v.ownershipStatus && v.ownershipStatus.toLowerCase().includes(search.toLowerCase())) ||
      (v.masterCaptain && v.masterCaptain.toLowerCase().includes(search.toLowerCase()));

    return matchFilter && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <VesselListHeader
        handleOpenAddModal={handleOpenAddModal}
        vessels={vessels}
      />

      {/* Filter and Search Bar */}
      <VesselListFilterBar
        filterType={filterType}
        search={search}
        setFilterType={setFilterType}
        setSearch={setSearch}
        vessels={vessels}
      />

      {/* Fleet Verification Banner */}
      <VesselListInfoBar
        allShipDocuments={allShipDocuments}
        vessels={vessels}
      />

      {/* Grid of Vessels */}
      <VesselCardGrid
        allCrew={allCrew}
        allEquipment={allEquipment}
        allShipDocuments={allShipDocuments}
        allWorkOrders={allWorkOrders}
        filteredVessels={filteredVessels}
        handleOpenAddModal={handleOpenAddModal}
        search={search}
        setActiveTab={setActiveTab}
        setSelectedVesselForParticulars={setSelectedVesselForParticulars}
        setSelectedVesselId={setSelectedVesselId}
      />

      {/* Manual Ship Creation Modal */}
      {(showAddModal) && (
        <VesselAddModal
          formData={formData}
          handleFormSubmit={handleFormSubmit}
          handleInputChange={handleInputChange}
          portLocations={portLocations}
          setShowAddModal={setShowAddModal}
          vesselTypes={vesselTypes}
        />
      )}

      {/* Edit Vessel Particulars Modal */}
      {selectedVesselForParticulars && (
        <ParticularsModal
          vessel={selectedVesselForParticulars}
          isOpen={!!selectedVesselForParticulars}
          onClose={() => setSelectedVesselForParticulars(null)}
          onSave={(shipId, updatedData) => {
            updateVesselParticulars(shipId, updatedData);
            setSelectedVesselForParticulars(prev => prev ? ({ ...prev, particulars: updatedData }) : null);
          }}
        />
      )}
    </div>
  );
};
