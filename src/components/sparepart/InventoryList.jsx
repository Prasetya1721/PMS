import React, { useState, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle,
  ShoppingCart,
  Truck,
  Ship,
  Users,
  X,
  Check
} from 'lucide-react';
import { InventoryTabsBar } from './inventory/InventoryTabsBar';
import { InventoryStockTab } from './inventory/InventoryStockTab';
import { InventoryRequisitionsTab } from './inventory/InventoryRequisitionsTab';
import { InventoryTransferModal } from './inventory/InventoryTransferModal';
import { InventoryConsumeModal } from './inventory/InventoryConsumeModal';
import { InventoryAddItemModal } from './inventory/InventoryAddItemModal';
import { InventoryCreateSPBKModal } from './inventory/InventoryCreateSPBKModal';

export const InventoryList = () => {
  const {
    spareparts,
    requisitions,
    vessels,
    allEquipment,
    updateSparepartStock,
    transferStockToVessel,
    consumeStockOnboard,
    addLogisticItem,
    updateLogisticItem,
    deleteLogisticItem,
    addLogisticRequisition,
    updateRequisitionStatus,
    receiveRequisitionItems,
    canAction,
    currentRole,
    currentUser
  } = usePMS();

  const [activeSubTab, setActiveSubTab] = useState('inventory'); // 'inventory' | 'requisitions'
  const [targetFilter, setTargetFilter] = useState('ALL'); // 'ALL' | 'Crew' | 'Kapal' | 'Sparepart'
  const [search, setSearch] = useState('');

  // Modals
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showConsumeModal, setShowConsumeModal] = useState(false);
  const [showCreateSPBKModal, setShowCreateSPBKModal] = useState(false);
  const [selectedItemForAction, setSelectedItemForAction] = useState(null);

  // Form: Transfer Stock from Warehouse to Ship
  const [transferQty, setTransferQty] = useState(1);

  // Form: Consume Stock Onboard
  const [consumeQty, setConsumeQty] = useState(1);
  const [consumeReason, setConsumeReason] = useState('');

  // Form: Add New Logistic Item
  const [newItemForm, setNewItemForm] = useState({
    code: '',
    name: '',
    target: 'Crew',
    category: 'Logistik Crew (BAMA)',
    subCategory: 'Ransum Pokok Dapur (Galley)',
    vesselId: 'v-001',
    stockWarehouse: 10,
    stockQty: 5,
    minStockQty: 3,
    unit: 'Zak',
    unitCost: 150000,
    location: 'Galley Dry Store',
    supplier: 'Distributor Sembako Pontianak'
  });

  // Form: Create SPBK (Requisition)
  const [spbkForm, setSpbkForm] = useState({
    vesselId: 'v-001',
    title: '',
    targetType: 'Logistik Crew',
    requesterName: currentUser?.name || 'Awak Kapal KM. RP 2020',
    requesterRole: currentRole,
    urgency: 'Normal',
    notes: '',
    items: [
      {
        partId: spareparts[0]?.id || '',
        name: spareparts[0]?.name || '',
        qty: 2,
        unit: spareparts[0]?.unit || 'Pcs',
        estimatedUnitCost: spareparts[0]?.unitCost || 100000
      }
    ]
  });

  // Filtered Inventory List
  const filteredInventory = spareparts.filter(item => {
    const matchTarget =
      targetFilter === 'ALL' ||
      (targetFilter === 'Crew' && item.target === 'Crew') ||
      (targetFilter === 'Kapal' && item.target === 'Kapal' && item.category !== 'Suku Cadang Mesin') ||
      (targetFilter === 'Sparepart' && item.category === 'Suku Cadang Mesin');

    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(search.toLowerCase())) ||
      (item.location && item.location.toLowerCase().includes(search.toLowerCase())) ||
      (item.supplier && item.supplier.toLowerCase().includes(search.toLowerCase()));

    return matchTarget && matchSearch;
  });

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  // Handlers
  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!selectedItemForAction) return;
    transferStockToVessel(selectedItemForAction.id, transferQty);
    setShowTransferModal(false);
    setSelectedItemForAction(null);
  };

  const handleConsumeSubmit = (e) => {
    e.preventDefault();
    if (!selectedItemForAction) return;
    consumeStockOnboard(selectedItemForAction.id, consumeQty, consumeReason);
    setShowConsumeModal(false);
    setSelectedItemForAction(null);
    setConsumeReason('');
  };

  const handleAddNewItem = (e) => {
    e.preventDefault();
    addLogisticItem(newItemForm);
    setShowAddItemModal(false);
    setNewItemForm({
      code: '',
      name: '',
      target: 'Crew',
      category: 'Logistik Crew (BAMA)',
      subCategory: 'Ransum Pokok Dapur (Galley)',
      vesselId: 'v-001',
      stockWarehouse: 10,
      stockQty: 5,
      minStockQty: 3,
      unit: 'Zak',
      unitCost: 150000,
      location: 'Galley Dry Store',
      supplier: 'Distributor Sembako Pontianak'
    });
  };

  const handleCreateSPBK = (e) => {
    e.preventDefault();
    const totalCost = spbkForm.items.reduce((sum, it) => sum + (Number(it.qty) || 0) * (Number(it.estimatedUnitCost) || 0), 0);
    addLogisticRequisition({
      ...spbkForm,
      totalEstimatedCost: totalCost,
      status: 'Diajukan'
    });
    setShowCreateSPBKModal(false);
  };

  // Quick action from item row to create SPBK
  const openSPBKForItem = (item) => {
    setSpbkForm({
      vesselId: item.vesselId || 'v-001',
      title: `Permintaan Restock ${item.name} (${item.code})`,
      targetType: item.target === 'Crew' ? 'Logistik Crew' : 'Logistik Kapal',
      requesterName: currentUser?.name || 'Petugas Onboard KM. RP 2020',
      requesterRole: currentRole,
      urgency: item.status === 'Critical' ? 'Urgent' : 'Normal',
      notes: `Restock logistik karena stok onboard sisa ${item.stockQty} ${item.unit} (Batas Min: ${item.minStockQty}).`,
      items: [
        {
          partId: item.id,
          name: item.name,
          qty: Math.max(1, (item.minStockQty || 1) - (item.stockQty || 0) + 2),
          unit: item.unit,
          estimatedUnitCost: item.unitCost
        }
      ]
    });
    setShowCreateSPBKModal(true);
  };

  const crewItemsCount = spareparts.filter(s => s.target === 'Crew').length;
  const shipItemsCount = spareparts.filter(s => s.target === 'Kapal').length;
  const criticalItemsCount = spareparts.filter(s => s.status === 'Critical' || s.status === 'Low Stock').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <InventoryTabsBar
        activeSubTab={activeSubTab}
        requisitions={requisitions}
        setActiveSubTab={setActiveSubTab}
      />

      {/* SUBTAB 1: INVENTORY CATALOG */}
      {(activeSubTab === 'inventory') && (
        <InventoryStockTab
          canAction={canAction}
          crewItemsCount={crewItemsCount}
          criticalItemsCount={criticalItemsCount}
          filteredInventory={filteredInventory}
          formatIDR={formatIDR}
          openSPBKForItem={openSPBKForItem}
          search={search}
          setConsumeQty={setConsumeQty}
          setSearch={setSearch}
          setSelectedItemForAction={setSelectedItemForAction}
          setShowAddItemModal={setShowAddItemModal}
          setShowConsumeModal={setShowConsumeModal}
          setShowTransferModal={setShowTransferModal}
          setTargetFilter={setTargetFilter}
          setTransferQty={setTransferQty}
          shipItemsCount={shipItemsCount}
          spareparts={spareparts}
          targetFilter={targetFilter}
        />
      )}

      {/* SUBTAB 2: REQUISITIONS (SPBK) */}
      {(activeSubTab === 'requisitions') && (
        <InventoryRequisitionsTab
          canAction={canAction}
          currentRole={currentRole}
          currentUser={currentUser}
          formatIDR={formatIDR}
          receiveRequisitionItems={receiveRequisitionItems}
          requisitions={requisitions}
          setShowCreateSPBKModal={setShowCreateSPBKModal}
          setSpbkForm={setSpbkForm}
          spareparts={spareparts}
          updateRequisitionStatus={updateRequisitionStatus}
        />
      )}

      {/* MODAL 1: TRANSFER WAREHOUSE TO VESSEL */}
      {(showTransferModal && selectedItemForAction) && (
        <InventoryTransferModal
          handleTransferSubmit={handleTransferSubmit}
          selectedItemForAction={selectedItemForAction}
          setShowTransferModal={setShowTransferModal}
          setTransferQty={setTransferQty}
          transferQty={transferQty}
        />
      )}

      {/* MODAL 2: CONSUME STOCK ONBOARD */}
      {(showConsumeModal && selectedItemForAction) && (
        <InventoryConsumeModal
          consumeQty={consumeQty}
          consumeReason={consumeReason}
          handleConsumeSubmit={handleConsumeSubmit}
          selectedItemForAction={selectedItemForAction}
          setConsumeQty={setConsumeQty}
          setConsumeReason={setConsumeReason}
          setShowConsumeModal={setShowConsumeModal}
        />
      )}

      {/* MODAL 3: TAMBAH BARANG LOGISTIK BARU */}
      {(showAddItemModal) && (
        <InventoryAddItemModal
          handleAddNewItem={handleAddNewItem}
          newItemForm={newItemForm}
          setNewItemForm={setNewItemForm}
          setShowAddItemModal={setShowAddItemModal}
        />
      )}

      {/* MODAL 4: BUAT SPBK / PERMINTAAN LOGISTIK BARU */}
      {(showCreateSPBKModal) && (
        <InventoryCreateSPBKModal
          formatIDR={formatIDR}
          handleCreateSPBK={handleCreateSPBK}
          setShowCreateSPBKModal={setShowCreateSPBKModal}
          setSpbkForm={setSpbkForm}
          spareparts={spareparts}
          spbkForm={spbkForm}
        />
      )}
    </div>
  );
};
