import React, { useState, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  FileText,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ShoppingCart,
  Send,
  Truck,
  Ship,
  Users,
  Building2,
  ArrowRightLeft,
  X,
  Sparkles,
  DollarSign,
  Info,
  Check
} from 'lucide-react';

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Gudang Logistik & Suku Cadang (Armada & Kru)</h2>
            <span className="badge badge-info" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
              Gudang Terpadu
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Stok fisik Gudang Darat Pontianak vs Onboard KM. RP 2020: Provisi Makanan/BAMA, APD Pelaut, Deck/Engine Stores & SPBK
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`btn ${activeSubTab === 'inventory' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Package size={16} />
            <span>Katalog Stok Gudang & Kapal</span>
          </button>
          <button
            onClick={() => setActiveSubTab('requisitions')}
            className={`btn ${activeSubTab === 'requisitions' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <ShoppingCart size={16} />
            <span>Permintaan Barang (SPBK) ({requisitions.length})</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: INVENTORY CATALOG */}
      {activeSubTab === 'inventory' && (
        <>
          {/* Quick Metrics Bar */}
          <div className="grid-cols-4">
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total SKU Barang</span>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.35rem', color: '#38bdf8' }}>
                {spareparts.length} Item
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
                Katalog terdaftar darat & kapal
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Users size={16} color="#10b981" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Logistik Kru (BAMA & APD)</span>
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.35rem', color: '#10b981' }}>
                {crewItemsCount} Item
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Beras, galon, telur, wearpack, sepatu
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Ship size={16} color="#38bdf8" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Logistik Kapal & Mesin</span>
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.35rem', color: '#38bdf8' }}>
                {shipItemsCount} Item
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Oli pelumas, filter, tali tross, cat
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertTriangle size={16} color="#f59e0b" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Stok Kritis / Reorder</span>
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.35rem', color: criticalItemsCount > 0 ? '#ef4444' : '#10b981' }}>
                {criticalItemsCount} Item
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Di bawah batas minimum kapal
              </p>
            </div>
          </div>

          {/* Filters & Actions Bar */}
          <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setTargetFilter('ALL')}
                className={`btn btn-sm ${targetFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Semua Barang ({spareparts.length})
              </button>
              <button
                onClick={() => setTargetFilter('Crew')}
                className={`btn btn-sm ${targetFilter === 'Crew' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Users size={14} />
                <span>Logistik Kru / BAMA ({crewItemsCount})</span>
              </button>
              <button
                onClick={() => setTargetFilter('Kapal')}
                className={`btn btn-sm ${targetFilter === 'Kapal' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Ship size={14} />
                <span>Logistik Kapal / Deck</span>
              </button>
              <button
                onClick={() => setTargetFilter('Sparepart')}
                className={`btn btn-sm ${targetFilter === 'Sparepart' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Suku Cadang Mesin
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={15} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Cari SKU, nama, lokasi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-control"
                  style={{ width: '220px', paddingLeft: '2.2rem', fontSize: '0.825rem' }}
                />
              </div>

              {canAction('create_purchase_request') && (
                <button
                  onClick={() => setShowAddItemModal(true)}
                  className="btn btn-primary"
                  style={{ fontSize: '0.825rem' }}
                >
                  <Plus size={15} />
                  <span>+ Tambah Barang Baru</span>
                </button>
              )}
            </div>
          </div>

          {/* Table: Dual Warehouse & Onboard Stock */}
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div className="table-container">
              <table className="pms-table">
                <thead>
                  <tr>
                    <th>SKU & Nama Barang</th>
                    <th>Sasaran</th>
                    <th>Kategori & Subkategori</th>
                    <th>Stok Gudang Darat</th>
                    <th>Stok Onboard Kapal</th>
                    <th>Batas Min</th>
                    <th>Estimasi Harga</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Aksi Logistik</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        Tidak ada data logistik sesuai filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredInventory.map(item => {
                      const isCrew = item.target === 'Crew';
                      const isLow = item.stockQty <= item.minStockQty;

                      return (
                        <tr key={item.id}>
                          <td>
                            <div className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>
                              {item.code}
                            </div>
                            <strong style={{ fontSize: '0.875rem' }}>{item.name}</strong>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                              Simpan: {item.location} • Rekanan: {item.supplier || '-'}
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${isCrew ? 'badge-success' : 'badge-info'}`} style={{ fontSize: '0.7rem' }}>
                              {isCrew ? <Users size={12} style={{ display: 'inline', marginRight: '4px' }} /> : <Ship size={12} style={{ display: 'inline', marginRight: '4px' }} />}
                              {item.target || 'Kapal'}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>{item.category}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.subCategory || '-'}</div>
                          </td>
                          <td>
                            <div className="mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8' }}>
                              {item.stockWarehouse || 0} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.unit}</span>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Gudang Pontianak</span>
                          </td>
                          <td>
                            <div className="mono" style={{
                              fontSize: '0.95rem',
                              fontWeight: 800,
                              color: isLow ? '#ef4444' : '#10b981'
                            }}>
                              {item.stockQty} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.unit}</span>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>KM. RP 2020</span>
                          </td>
                          <td className="mono" style={{ fontSize: '0.825rem' }}>
                            {item.minStockQty} {item.unit}
                          </td>
                          <td className="mono" style={{ fontSize: '0.825rem' }}>
                            {formatIDR(item.unitCost)}
                          </td>
                          <td>
                            <span className={`badge ${
                              item.status === 'Critical' ? 'badge-danger-pulse' :
                              item.status === 'Low Stock' ? 'badge-warning' : 'badge-success'
                            }`} style={{ fontSize: '0.7rem' }}>
                              {item.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem', alignItems: 'center' }}>
                              {/* Transfer from Warehouse to Vessel */}
                              {canAction('transfer_warehouse_stock') && (
                                <button
                                  onClick={() => {
                                    setSelectedItemForAction(item);
                                    setTransferQty(Math.min(item.stockWarehouse || 1, Math.max(1, (item.minStockQty || 1) - item.stockQty)));
                                    setShowTransferModal(true);
                                  }}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                                  title="Transfer Mutasi dari Gudang Darat ke Kapal"
                                >
                                  <Truck size={13} color="#38bdf8" />
                                  <span>Transfer</span>
                                </button>
                              )}

                              {/* Consume Onboard */}
                              <button
                                onClick={() => {
                                  setSelectedItemForAction(item);
                                  setConsumeQty(1);
                                  setShowConsumeModal(true);
                                }}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                                title="Catat Pemakaian Onboard Kapal"
                              >
                                <span>Pakai</span>
                              </button>

                              {/* Create SPBK */}
                              <button
                                onClick={() => openSPBKForItem(item)}
                                className="btn btn-primary btn-sm"
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                                title="Ajukan Surat Permintaan Barang Kapal (SPBK)"
                              >
                                <ShoppingCart size={13} />
                                <span>Order SPBK</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* SUBTAB 2: REQUISITIONS (SPBK) */}
      {activeSubTab === 'requisitions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Action Bar */}
          <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Daftar Surat Permintaan Barang Kapal (SPBK)</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Alur pengadaan berjenjang: Diajukan $\rightarrow$ Approval Nakhoda $\rightarrow$ Gudang Darat / Finance $\rightarrow$ Diterima Onboard
              </p>
            </div>

            <button
              onClick={() => {
                setSpbkForm({
                  vesselId: 'v-001',
                  title: '',
                  targetType: currentRole === 'Crew / ABK' ? 'Logistik Crew' : 'Logistik Kapal',
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
                setShowCreateSPBKModal(true);
              }}
              className="btn btn-primary"
            >
              <Plus size={16} />
              <span>+ Buat Permintaan Barang (SPBK) Baru</span>
            </button>
          </div>

          {/* SPBK Cards / List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {requisitions.length === 0 ? (
              <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Belum ada pengajuan SPBK yang tercatat.
              </div>
            ) : (
              requisitions.map(req => {
                const isCrewTarget = req.targetType === 'Logistik Crew';
                const isApprovedNakhoda = req.status === 'Disetujui Nakhoda' || req.status === 'Disetujui Gudang Darat' || req.status === 'Dalam Pengiriman' || req.status === 'Selesai Diterima di Kapal';
                const isApprovedGudang = req.status === 'Disetujui Gudang Darat' || req.status === 'Dalam Pengiriman' || req.status === 'Selesai Diterima di Kapal';
                const isReceived = req.status === 'Selesai Diterima di Kapal';

                return (
                  <div key={req.id} className="glass-card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <span className="mono" style={{ fontWeight: 800, fontSize: '0.95rem', color: '#38bdf8' }}>
                            {req.id}
                          </span>
                          <span className={`badge ${isCrewTarget ? 'badge-success' : 'badge-info'}`} style={{ fontSize: '0.72rem' }}>
                            {isCrewTarget ? <Users size={12} style={{ display: 'inline', marginRight: '4px' }} /> : <Ship size={12} style={{ display: 'inline', marginRight: '4px' }} />}
                            {req.targetType || 'Logistik Kapal'}
                          </span>
                          <span className={`badge ${
                            req.urgency === 'Urgent' ? 'badge-danger-pulse' : 'badge-secondary'
                          }`} style={{ fontSize: '0.72rem' }}>
                            {req.urgency}
                          </span>
                          <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                            {req.status}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.4rem' }}>{req.title}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Pemohon: <strong>{req.requesterName}</strong> ({req.requesterRole || 'Awak'}) • Tanggal: <span className="mono">{req.dateSubmitted}</span>
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Estimasi Nilai Barang</span>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>
                          {formatIDR(req.totalEstimatedCost)}
                        </h4>
                      </div>
                    </div>

                    {/* Items List */}
                    <div style={{
                      marginTop: '1rem',
                      padding: '0.85rem',
                      borderRadius: '8px',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>
                        Rincian Barang yang Diminta:
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.65rem' }}>
                        {(req.items || []).map((it, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '0.5rem 0.75rem',
                              borderRadius: '6px',
                              background: 'var(--bg-glass)',
                              border: '1px solid var(--border-glass)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div>
                              <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>{it.name}</div>
                              <span className="mono" style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
                                {it.qty} {it.unit}
                              </span>
                            </div>
                            {isReceived && (
                              <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                                <Check size={11} /> Diterima
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      {req.notes && (
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.65rem' }}>
                          <strong>Catatan Khusus:</strong> {req.notes}
                        </p>
                      )}
                    </div>

                    {/* Workflow Stepper & Approval Actions */}
                    <div style={{
                      marginTop: '1rem',
                      paddingTop: '0.85rem',
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}>
                      {/* Step Status Indicator */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span style={{ color: isApprovedNakhoda ? '#10b981' : 'inherit', fontWeight: isApprovedNakhoda ? 700 : 400 }}>
                          1. Nakhoda {isApprovedNakhoda ? '✓' : ''}
                        </span>
                        <span>$\rightarrow$</span>
                        <span style={{ color: isApprovedGudang ? '#10b981' : 'inherit', fontWeight: isApprovedGudang ? 700 : 400 }}>
                          2. Gudang/Fleet {isApprovedGudang ? '✓' : ''}
                        </span>
                        <span>$\rightarrow$</span>
                        <span style={{ color: isReceived ? '#10b981' : 'inherit', fontWeight: isReceived ? 700 : 400 }}>
                          3. Diterima Onboard {isReceived ? '✓' : ''}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {/* Step 1 Approval by Nakhoda / Master */}
                        {req.status === 'Diajukan' && canAction('approve_requisition_ship') && (
                          <button
                            onClick={() => updateRequisitionStatus(req.id, 'Disetujui Nakhoda')}
                            className="btn btn-secondary btn-sm"
                          >
                            <CheckCircle size={14} color="#38bdf8" />
                            <span>Approve Nakhoda</span>
                          </button>
                        )}

                        {/* Step 2 Approval by Shore Base / Fleet Manager */}
                        {req.status === 'Disetujui Nakhoda' && canAction('approve_requisition_shore') && (
                          <button
                            onClick={() => updateRequisitionStatus(req.id, 'Dalam Pengiriman', { dispatcher: currentUser?.name })}
                            className="btn btn-secondary btn-sm"
                          >
                            <Truck size={14} color="#f59e0b" />
                            <span>Approve & Kirim ke Dermaga</span>
                          </button>
                        )}

                        {/* Step 3 Confirmation of Receipt Onboard */}
                        {!isReceived && (req.status === 'Dalam Pengiriman' || req.status === 'Disetujui Gudang Darat' || req.status === 'Disetujui Nakhoda') && canAction('receive_onboard_goods') && (
                          <button
                            onClick={() => receiveRequisitionItems(req.id)}
                            className="btn btn-primary btn-sm"
                          >
                            <CheckCircle size={14} />
                            <span>Konfirmasi Diterima di Kapal (+Stok)</span>
                          </button>
                        )}

                        {isReceived && (
                          <span className="badge badge-success" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
                            <Check size={13} style={{ display: 'inline', marginRight: '4px' }} />
                            Barang Telah Onboard
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: TRANSFER WAREHOUSE TO VESSEL */}
      {showTransferModal && selectedItemForAction && (
        <div className="modal-overlay" onClick={() => setShowTransferModal(false)}>
          <div className="modal-dialog" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Mutasi Stok Gudang Darat ke Kapal</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Transfer persediaan dari Shore Base Pontianak ke Onboard KM. RP 2020
                </p>
              </div>
              <button onClick={() => setShowTransferModal(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  padding: '0.85rem',
                  borderRadius: '8px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div className="mono" style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
                    {selectedItemForAction.code}
                  </div>
                  <strong style={{ fontSize: '0.95rem' }}>{selectedItemForAction.name}</strong>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.825rem' }}>
                    <span>Stok Gudang Darat: <strong>{selectedItemForAction.stockWarehouse} {selectedItemForAction.unit}</strong></span>
                    <span>Stok Saat Ini di Kapal: <strong>{selectedItemForAction.stockQty} {selectedItemForAction.unit}</strong></span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Jumlah Unit yang Ditransfer ke Kapal ({selectedItemForAction.unit})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedItemForAction.stockWarehouse || 1}
                    value={transferQty}
                    onChange={e => setTransferQty(Math.max(1, Number(e.target.value) || 1))}
                    className="input-control mono"
                    style={{ fontSize: '1.1rem', fontWeight: 800 }}
                    required
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.25rem', display: 'block' }}>
                    Maksimal dapat ditransfer: {selectedItemForAction.stockWarehouse} {selectedItemForAction.unit}
                  </span>
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowTransferModal(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Proses Mutasi ke KM. RP 2020
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CONSUME STOCK ONBOARD */}
      {showConsumeModal && selectedItemForAction && (
        <div className="modal-overlay" onClick={() => setShowConsumeModal(false)}>
          <div className="modal-dialog" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Catat Pemakaian Onboard Kapal</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Pengurangan stok fisik yang digunakan di KM. RP 2020
                </p>
              </div>
              <button onClick={() => setShowConsumeModal(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConsumeSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  padding: '0.85rem',
                  borderRadius: '8px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <strong style={{ fontSize: '0.95rem' }}>{selectedItemForAction.name}</strong>
                  <div style={{ marginTop: '0.25rem', fontSize: '0.825rem' }}>
                    Sisa Stok di Kapal: <strong className="mono">{selectedItemForAction.stockQty} {selectedItemForAction.unit}</strong>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Jumlah Pemakaian ({selectedItemForAction.unit})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedItemForAction.stockQty || 1}
                    value={consumeQty}
                    onChange={e => setConsumeQty(Math.max(1, Number(e.target.value) || 1))}
                    className="input-control mono"
                    style={{ fontSize: '1.1rem', fontWeight: 800 }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Keperluan / Alasan Pemakaian
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Ransum masak dapur trip pelayaran / Servis berkala genset"
                    value={consumeReason}
                    onChange={e => setConsumeReason(e.target.value)}
                    className="input-control"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowConsumeModal(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Pemakaian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: TAMBAH BARANG LOGISTIK BARU */}
      {showAddItemModal && (
        <div className="modal-overlay" onClick={() => setShowAddItemModal(false)}>
          <div className="modal-dialog" style={{ maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Daftarkan Barang Logistik / Suku Cadang Baru</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Pendaftaran item logistik kebutuhan kapal maupun kebutuhan kru
                </p>
              </div>
              <button onClick={() => setShowAddItemModal(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddNewItem}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '68vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Sasaran Penggunaan
                    </label>
                    <select
                      value={newItemForm.target}
                      onChange={e => setNewItemForm({ ...newItemForm, target: e.target.value })}
                      className="select-control"
                    >
                      <option value="Crew">Logistik Crew (BAMA & APD Awak)</option>
                      <option value="Kapal">Logistik Kapal (Deck Stores & Mesin)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Kategori Barang
                    </label>
                    <select
                      value={newItemForm.category}
                      onChange={e => setNewItemForm({ ...newItemForm, category: e.target.value })}
                      className="select-control"
                    >
                      <option value="Logistik Crew (BAMA)">Logistik Crew (BAMA / Sembako)</option>
                      <option value="Perlengkapan APD Kru">Perlengkapan APD & Seragam Kru</option>
                      <option value="Kesehatan & P3K Kru">Kesehatan & P3K Kru</option>
                      <option value="Suku Cadang Mesin">Suku Cadang Mesin</option>
                      <option value="Pelumas / Oil">Minyak Pelumas / Oli Drum</option>
                      <option value="Deck & Tali Tross">Deck Stores & Tali Tross</option>
                      <option value="Deck Stores & Cat">Cat Lambung & Epoksi</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Kode SKU/Part
                    </label>
                    <input
                      type="text"
                      placeholder="LOG-XXX"
                      value={newItemForm.code}
                      onChange={e => setNewItemForm({ ...newItemForm, code: e.target.value })}
                      className="input-control mono"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Nama Barang
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Telur Ayam Segar 30 Butir / Cat Primer Epoxy"
                      value={newItemForm.name}
                      onChange={e => setNewItemForm({ ...newItemForm, name: e.target.value })}
                      className="input-control"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Satuan
                    </label>
                    <input
                      type="text"
                      placeholder="Pcs/Zak/Liter"
                      value={newItemForm.unit}
                      onChange={e => setNewItemForm({ ...newItemForm, unit: e.target.value })}
                      className="input-control"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Stok Darat
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newItemForm.stockWarehouse}
                      onChange={e => setNewItemForm({ ...newItemForm, stockWarehouse: e.target.value })}
                      className="input-control mono"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Stok Kapal
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newItemForm.stockQty}
                      onChange={e => setNewItemForm({ ...newItemForm, stockQty: e.target.value })}
                      className="input-control mono"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Batas Min
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newItemForm.minStockQty}
                      onChange={e => setNewItemForm({ ...newItemForm, minStockQty: e.target.value })}
                      className="input-control mono"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Estimasi Harga Satuan (IDR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={newItemForm.unitCost}
                      onChange={e => setNewItemForm({ ...newItemForm, unitCost: e.target.value })}
                      className="input-control mono"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Lokasi Penyimpanan di Kapal
                    </label>
                    <input
                      type="text"
                      placeholder="Galley Store / Safety Locker / Deck"
                      value={newItemForm.location}
                      onChange={e => setNewItemForm({ ...newItemForm, location: e.target.value })}
                      className="input-control"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Supplier Rekanan / Toko Penyedia
                  </label>
                  <input
                    type="text"
                    placeholder="Nama distributor / rekanan lokal Pontianak"
                    value={newItemForm.supplier}
                    onChange={e => setNewItemForm({ ...newItemForm, supplier: e.target.value })}
                    className="input-control"
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowAddItemModal(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Daftarkan Item ke Inventaris
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: BUAT SPBK / PERMINTAAN LOGISTIK BARU */}
      {showCreateSPBKModal && (
        <div className="modal-overlay" onClick={() => setShowCreateSPBKModal(false)}>
          <div className="modal-dialog" style={{ maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Surat Permintaan Barang Kapal (SPBK) Baru</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Formulir pengajuan logistik provisi kru dapur, APD, maupun suku cadang mesin KM. RP 2020
                </p>
              </div>
              <button onClick={() => setShowCreateSPBKModal(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSPBK}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '68vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Jenis Kebutuhan
                    </label>
                    <select
                      value={spbkForm.targetType}
                      onChange={e => setSpbkForm({ ...spbkForm, targetType: e.target.value })}
                      className="select-control"
                    >
                      <option value="Logistik Crew">Kebutuhan Crew (BAMA Dapur / APD Awak)</option>
                      <option value="Logistik Kapal">Kebutuhan Kapal (Sparepart Mesin / Pelumas / Deck)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Tingkat Urgensi
                    </label>
                    <select
                      value={spbkForm.urgency}
                      onChange={e => setSpbkForm({ ...spbkForm, urgency: e.target.value })}
                      className="select-control"
                    >
                      <option value="Normal">Normal (Jadwal Rutin)</option>
                      <option value="Urgent">Urgent (Sebelum Berlayar)</option>
                      <option value="Emergency">Emergency (Kritis)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Judul Pengajuan Permintaan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Permintaan Ransum Galley Pelayaran Towing September"
                    value={spbkForm.title}
                    onChange={e => setSpbkForm({ ...spbkForm, title: e.target.value })}
                    className="input-control"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Nama Pemohon
                    </label>
                    <input
                      type="text"
                      value={spbkForm.requesterName}
                      onChange={e => setSpbkForm({ ...spbkForm, requesterName: e.target.value })}
                      className="input-control"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Jabatan Pemohon
                    </label>
                    <input
                      type="text"
                      value={spbkForm.requesterRole}
                      onChange={e => setSpbkForm({ ...spbkForm, requesterRole: e.target.value })}
                      className="input-control"
                      required
                    />
                  </div>
                </div>

                {/* Items in SPBK */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.825rem', fontWeight: 700 }}>Daftar Barang yang Diajukan:</label>
                    <button
                      type="button"
                      onClick={() => {
                        const first = spareparts[0];
                        setSpbkForm({
                          ...spbkForm,
                          items: [
                            ...spbkForm.items,
                            {
                              partId: first?.id || '',
                              name: first?.name || '',
                              qty: 1,
                              unit: first?.unit || 'Pcs',
                              estimatedUnitCost: first?.unitCost || 50000
                            }
                          ]
                        });
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem' }}
                    >
                      + Tambah Item Barang
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {spbkForm.items.map((it, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '2fr 80px 100px 30px',
                          gap: '0.5rem',
                          alignItems: 'center',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          background: 'var(--bg-surface-elevated)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        <select
                          value={it.partId}
                          onChange={e => {
                            const matched = spareparts.find(s => s.id === e.target.value);
                            const nextItems = [...spbkForm.items];
                            nextItems[idx] = {
                              ...nextItems[idx],
                              partId: e.target.value,
                              name: matched?.name || nextItems[idx].name,
                              unit: matched?.unit || nextItems[idx].unit,
                              estimatedUnitCost: matched?.unitCost || nextItems[idx].estimatedUnitCost
                            };
                            setSpbkForm({ ...spbkForm, items: nextItems });
                          }}
                          className="select-control"
                          style={{ fontSize: '0.8rem' }}
                        >
                          {spareparts.map(s => (
                            <option key={s.id} value={s.id}>
                              [{s.target || 'Kapal'}] {s.name} ({s.stockQty} {s.unit})
                            </option>
                          ))}
                        </select>

                        <input
                          type="number"
                          min="1"
                          value={it.qty}
                          onChange={e => {
                            const nextItems = [...spbkForm.items];
                            nextItems[idx].qty = Math.max(1, Number(e.target.value) || 1);
                            setSpbkForm({ ...spbkForm, items: nextItems });
                          }}
                          className="input-control mono"
                          style={{ fontSize: '0.825rem', textAlign: 'center' }}
                          required
                        />

                        <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {it.unit} • {formatIDR((it.qty || 1) * (it.estimatedUnitCost || 0))}
                        </span>

                        {spbkForm.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const nextItems = spbkForm.items.filter((_, i) => i !== idx);
                              setSpbkForm({ ...spbkForm, items: nextItems });
                            }}
                            className="btn-icon"
                            style={{ color: '#f87171' }}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Keterangan & Alasan Pengajuan
                  </label>
                  <textarea
                    rows={2}
                    value={spbkForm.notes}
                    onChange={e => setSpbkForm({ ...spbkForm, notes: e.target.value })}
                    className="input-control"
                    placeholder="Contoh: Stok beras galley tinggal sedikit untuk rute towing Muara Berau - Surabaya..."
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowCreateSPBKModal(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Kirim Pengajuan SPBK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
