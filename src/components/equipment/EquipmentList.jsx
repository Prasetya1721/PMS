import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Clock,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Cpu,
  Edit2,
  Trash2,
  Ship,
  CheckCircle2,
  Activity,
  AlertCircle,
  BookOpen,
  ShieldAlert
} from 'lucide-react';
import { RunningHoursModal } from './RunningHoursModal';
import { EquipmentFormModal } from './EquipmentFormModal';
import { DailyMachineryLogModal } from './DailyMachineryLogModal';
import { CriticalEquipmentView } from './CriticalEquipmentView';
import { EquipListHeader } from './equiplist/EquipListHeader';
import { EquipListTabBar } from './equiplist/EquipListTabBar';
import { EquipListKpiCards } from './equiplist/EquipListKpiCards';
import { EquipListFilterBar } from './equiplist/EquipListFilterBar';
import { EquipListTable } from './equiplist/EquipListTable';

export const EquipmentList = () => {
  const { equipment, vessels, selectedVesselId, deleteEquipment, theme } = usePMS();
  const [activeTab, setActiveTab] = useState('machinery'); // 'machinery' | 'critical'
  const [isDailyLogModalOpen, setIsDailyLogModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [vesselFilter, setVesselFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedEqForHours, setSelectedEqForHours] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);

  const categories = [
    'ALL',
    'Propulsi',
    'Kelistrikan',
    'Sistem Pompa',
    'Pneumatik',
    'Deck Machinery',
    'Navigasi & Komunikasi',
    'Sistem Keselamatan',
    'Penanganan Muatan'
  ];

  // Filtering
  const filtered = equipment.filter(eq => {
    // Search
    const q = search.toLowerCase();
    const matchSearch =
      (eq.name || '').toLowerCase().includes(q) ||
      (eq.code || '').toLowerCase().includes(q) ||
      (eq.maker || '').toLowerCase().includes(q) ||
      (eq.model || '').toLowerCase().includes(q) ||
      (eq.location || '').toLowerCase().includes(q);

    // Category
    const matchCat = categoryFilter === 'ALL' || eq.category === categoryFilter;

    // Vessel filter
    const matchVessel = vesselFilter === 'ALL' || eq.vesselId === vesselFilter;

    // Status filter
    const matchStatus = statusFilter === 'ALL' || eq.status === statusFilter;

    return matchSearch && matchCat && matchVessel && matchStatus;
  });

  // KPI Statistics
  const totalCount = equipment.length;
  const normalCount = equipment.filter(e => e.status === 'Normal').length;
  const dueSoonCount = equipment.filter(e => e.status === 'Due Soon').length;
  const overdueCount = equipment.filter(e => e.status === 'Overdue').length;

  const handleDelete = (eq) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus equipment "${eq.name}" (${eq.code}) dari database?`)) {
      deleteEquipment(eq.id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <EquipListHeader
        setEditingEquipment={setEditingEquipment}
        setIsDailyLogModalOpen={setIsDailyLogModalOpen}
        setIsFormModalOpen={setIsFormModalOpen}
        totalCount={totalCount}
      />

      {/* Sub Tabs: Machinery List vs Critical Equipment (ISM Code 10.3) */}
      <EquipListTabBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Render active subtab */}
      {activeTab === 'critical' ? (
        <CriticalEquipmentView selectedVesselId={selectedVesselId} />
      ) : (
        <>

      {/* KPI Cards Summary */}
      <EquipListKpiCards
        dueSoonCount={dueSoonCount}
        normalCount={normalCount}
        overdueCount={overdueCount}
        totalCount={totalCount}
      />

      {/* Filter & Search Bar */}
      <EquipListFilterBar
        categories={categories}
        categoryFilter={categoryFilter}
        search={search}
        selectedVesselId={selectedVesselId}
        setCategoryFilter={setCategoryFilter}
        setSearch={setSearch}
        setStatusFilter={setStatusFilter}
        setVesselFilter={setVesselFilter}
        statusFilter={statusFilter}
        vesselFilter={vesselFilter}
        vessels={vessels}
      />

      {/* Equipment Table */}
      <EquipListTable
        filtered={filtered}
        handleDelete={handleDelete}
        setEditingEquipment={setEditingEquipment}
        setIsFormModalOpen={setIsFormModalOpen}
        setSelectedEqForHours={setSelectedEqForHours}
        vessels={vessels}
      />

        </>
      )}

      {/* MODAL 1: Log Running Hours Modal */}
      {selectedEqForHours && (
        <RunningHoursModal
          equipment={selectedEqForHours}
          onClose={() => setSelectedEqForHours(null)}
        />
      )}

      {/* MODAL 2: Create & Edit Equipment Modal */}
      {isFormModalOpen && (
        <EquipmentFormModal
          equipment={editingEquipment}
          defaultVesselId={selectedVesselId !== 'all' ? selectedVesselId : vesselFilter !== 'ALL' ? vesselFilter : undefined}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingEquipment(null);
          }}
        />
      )}

      {/* MODAL 3: Batch Daily Machinery Logbook Modal */}
      {isDailyLogModalOpen && (
        <DailyMachineryLogModal
          initialVesselId={selectedVesselId !== 'all' ? selectedVesselId : undefined}
          onClose={() => setIsDailyLogModalOpen(false)}
        />
      )}
    </div>
  );
};
