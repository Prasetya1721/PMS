import React, { useState, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  DollarSign,
  TrendingUp,
  PieChart,
  Calendar,
  Filter,
  ArrowUpRight,
  Download,
  Building2,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  Ship,
  Users,
  ShieldCheck,
  X,
  Clock,
  Sparkles
} from 'lucide-react';

export const CostOverview = () => {
  const {
    costs,
    vessels,
    vesselBudgets,
    allVesselBudgets,
    updateVesselBudget,
    addExpenseTransaction,
    deleteExpenseTransaction,
    canAction,
    currentRole
  } = usePMS();

  const [activeSubTab, setActiveSubTab] = useState('budget'); // 'budget' | 'ledger'
  const [selectedVesselId, setSelectedVesselId] = useState(vessels[0]?.id || 'v-001');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [searchLedger, setSearchLedger] = useState('');

  // Modal states
  const [showEditBudgetModal, setShowEditBudgetModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  // Active vessel budget data
  const currentBudget = useMemo(() => {
    return (vesselBudgets || allVesselBudgets || []).find(b => b.vesselId === selectedVesselId) ||
           (vesselBudgets || allVesselBudgets || [])[0] || null;
  }, [vesselBudgets, allVesselBudgets, selectedVesselId]);

  // Form State for Editing Vessel Budget
  const [editBudgetForm, setEditBudgetForm] = useState(null);

  const openEditBudgetModal = () => {
    if (!currentBudget) return;
    setEditBudgetForm({
      ...currentBudget,
      categories: (currentBudget.categories || []).map(cat => ({ ...cat }))
    });
    setShowEditBudgetModal(true);
  };

  const handleSaveBudget = (e) => {
    e.preventDefault();
    if (!editBudgetForm) return;

    // Recalculate total budget from categories
    const computedTotal = (editBudgetForm.categories || []).reduce((sum, c) => sum + (Number(c.allocated) || 0), 0);
    const updated = {
      ...editBudgetForm,
      totalBudget: computedTotal
    };

    updateVesselBudget(editBudgetForm.id, updated);
    setShowEditBudgetModal(false);
  };

  // Form State for Adding New Expense Transaction
  const [expenseForm, setExpenseForm] = useState({
    vesselId: selectedVesselId,
    categoryCode: '5101-ENG',
    description: '',
    vendor: '',
    invoiceNo: '',
    date: new Date().toISOString().split('T')[0],
    amount: ''
  });

  const handleSaveExpense = (e) => {
    e.preventDefault();
    const matchedCat = (currentBudget?.categories || []).find(c => c.code === expenseForm.categoryCode);
    const costPayload = {
      vesselId: expenseForm.vesselId,
      category: matchedCat ? matchedCat.name : 'Biaya Operasional',
      budgetCategoryCode: expenseForm.categoryCode,
      description: expenseForm.description,
      vendor: expenseForm.vendor || 'Vendor Mitra PBK',
      invoiceNo: expenseForm.invoiceNo || `INV-${Date.now().toString().slice(-4)}`,
      date: expenseForm.date,
      amount: Number(expenseForm.amount) || 0,
      budgetAllocated: matchedCat?.allocated || 0
    };

    addExpenseTransaction(costPayload);
    setShowAddExpenseModal(false);
    setExpenseForm({
      vesselId: selectedVesselId,
      categoryCode: '5101-ENG',
      description: '',
      vendor: '',
      invoiceNo: '',
      date: new Date().toISOString().split('T')[0],
      amount: ''
    });
  };

  // Calculations for current vessel budget
  const categoriesList = currentBudget?.categories || [];
  const totalAllocated = categoriesList.reduce((sum, c) => sum + (Number(c.allocated) || 0), 0);
  const totalSpent = categoriesList.reduce((sum, c) => sum + (Number(c.spent) || 0), 0);
  const totalVariance = totalAllocated - totalSpent;
  const absorptionRate = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  // Filtered expenses for Ledger tab
  const filteredCosts = costs.filter(c => {
    const matchVessel = selectedVesselId === 'all' || c.vesselId === selectedVesselId;
    const matchCategory = selectedCategoryFilter === 'ALL' || c.category === selectedCategoryFilter || c.budgetCategoryCode === selectedCategoryFilter;
    const matchSearch = c.description?.toLowerCase().includes(searchLedger.toLowerCase()) ||
                        c.vendor?.toLowerCase().includes(searchLedger.toLowerCase()) ||
                        c.id?.toLowerCase().includes(searchLedger.toLowerCase()) ||
                        c.invoiceNo?.toLowerCase().includes(searchLedger.toLowerCase());
    return matchVessel && matchCategory && matchSearch;
  });

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const getStatusBadge = (spent, allocated) => {
    if (allocated <= 0) return { label: 'Belum Diatur', class: 'badge-secondary' };
    const ratio = Math.round((spent / allocated) * 100);
    if (ratio >= 100) return { label: 'Overbudget', class: 'badge-danger-pulse' };
    if (ratio >= 85) return { label: 'Waspada (>85%)', class: 'badge-warning' };
    return { label: 'Terkendali', class: 'badge-success' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Biaya & Manajemen Anggaran Kapal (Vessel Budgeting)</h2>
            <span className="badge badge-purple" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
              Modul Finance
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Pengalokasian pagu anggaran operasional per kapal, kontrol realisasi pengeluaran riil, dan analisis penyerapan anggaran armada
          </p>
        </div>

        {/* Subtab Navigation */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={() => setActiveSubTab('budget')}
            className={`btn ${activeSubTab === 'budget' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <PieChart size={16} />
            <span>Pagu Anggaran per Kapal</span>
          </button>
          <button
            onClick={() => setActiveSubTab('ledger')}
            className={`btn ${activeSubTab === 'ledger' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <FileSpreadsheet size={16} />
            <span>Buku Besar Pengeluaran ({costs.length})</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: VESSEL BUDGET MANAGEMENT */}
      {activeSubTab === 'budget' && (
        <>
          {/* Controls Bar: Vessel Selector & Action Buttons */}
          <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Ship size={18} color="#38bdf8" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Pilih Kapal:</span>
                <select
                  value={selectedVesselId}
                  onChange={(e) => setSelectedVesselId(e.target.value)}
                  className="select-control"
                  style={{ width: '220px' }}
                >
                  {vessels.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.type})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Calendar size={15} />
                <span>{currentBudget?.period || 'Tahun Anggaran 2026'}</span>
                <span>•</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>{currentBudget?.status || 'Disahkan Finance'}</span>
              </div>
            </div>

            {/* Action Buttons for Finance */}
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              {canAction('record_actual_expense') && (
                <button
                  onClick={() => {
                    setExpenseForm({ ...expenseForm, vesselId: selectedVesselId });
                    setShowAddExpenseModal(true);
                  }}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Plus size={15} color="#10b981" />
                  <span>+ Catat Pengeluaran Baru</span>
                </button>
              )}

              {canAction('edit_vessel_budget') && (
                <button
                  onClick={openEditBudgetModal}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Edit2 size={15} />
                  <span>Atur / Edit Pagu Anggaran Kapal</span>
                </button>
              )}
            </div>
          </div>

          {/* Budget KPI Cards */}
          <div className="grid-cols-4">
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Total Pagu Anggaran (Budget)
              </span>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.35rem', color: '#38bdf8' }}>
                {formatIDR(totalAllocated)}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
                Alokasi disahkan untuk {currentBudget?.vesselName || 'KM. RP 2020'}
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Realisasi Pengeluaran (Actual)
              </span>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.35rem', color: '#10b981' }}>
                {formatIDR(totalSpent)}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Total pengeluaran riil terverifikasi invoice
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Sisa Pagu Anggaran (Variance)
              </span>
              <h3 style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                marginTop: '0.35rem',
                color: totalVariance >= 0 ? '#38bdf8' : '#ef4444'
              }}>
                {formatIDR(totalVariance)}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                {totalVariance >= 0 ? 'Surplus / Dalam kendali' : 'Pagu Terlampaui (Overbudget)!'}
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Tingkat Penyerapan
                </span>
                <span className={`badge ${
                  absorptionRate >= 100 ? 'badge-danger-pulse' :
                  absorptionRate >= 85 ? 'badge-warning' : 'badge-success'
                }`} style={{ fontSize: '0.7rem' }}>
                  {absorptionRate >= 100 ? 'Overbudget' : absorptionRate >= 85 ? 'Waspada' : 'Aman'}
                </span>
              </div>
              <h3 style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                marginTop: '0.35rem',
                color: absorptionRate >= 100 ? '#ef4444' : absorptionRate >= 85 ? '#f59e0b' : '#10b981'
              }}>
                {absorptionRate}%
              </h3>
              <div className="progress-bar-container" style={{ marginTop: '0.5rem' }}>
                <div
                  className={`progress-bar-fill ${
                    absorptionRate >= 100 ? 'progress-red' :
                    absorptionRate >= 85 ? 'progress-amber' : 'progress-emerald'
                  }`}
                  style={{ width: `${Math.min(100, absorptionRate)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Alert Banner if Approaching or Exceeding Budget */}
          {absorptionRate >= 85 && (
            <div style={{
              padding: '0.9rem 1.25rem',
              borderRadius: '8px',
              background: absorptionRate >= 100 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              border: `1px solid ${absorptionRate >= 100 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <AlertTriangle size={20} color={absorptionRate >= 100 ? '#ef4444' : '#f59e0b'} />
              <div>
                <strong style={{ fontSize: '0.85rem', color: absorptionRate >= 100 ? '#ef4444' : '#f59e0b' }}>
                  {absorptionRate >= 100
                    ? 'Peringatan Finance: Anggaran Kapal Ini Telah Melebihi Pagu (Overbudget)!'
                    : 'Pemberitahuan Finance: Penyerapan Anggaran Telah Mencapai Ambang Batas Waspada (>85%)'}
                </strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Mohon tinjau realisasi pengeluaran pada pos-pos terkait dan koordinasikan dengan Fleet Manager sebelum menyetujui Purchase Order baru.
                </p>
              </div>
            </div>
          )}

          {/* Breakdown Table: 7 Pos Anggaran Kapal */}
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div style={{
              padding: '1.25rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Rincian Alokasi Pagu Anggaran per Pos Biaya</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Breakdown pagu biaya operasional kapal & provisi logistik awak kapal KM. RP 2020
                </p>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                Terakhir Diperbarui: <strong className="mono">{currentBudget?.lastUpdated || '-'}</strong>
              </div>
            </div>

            <div className="table-container">
              <table className="pms-table">
                <thead>
                  <tr>
                    <th>Kode Akun</th>
                    <th>Pos / Komponen Anggaran</th>
                    <th>Sasaran</th>
                    <th>Pagu Anggaran (Budget)</th>
                    <th>Realisasi (Actual)</th>
                    <th>Sisa (Variance)</th>
                    <th>Rasio Penyerapan (%)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {categoriesList.map(cat => {
                    const ratio = cat.allocated > 0 ? Math.round((cat.spent / cat.allocated) * 100) : 0;
                    const variance = cat.allocated - cat.spent;
                    const status = getStatusBadge(cat.spent, cat.allocated);
                    const isCrewTarget = cat.target === 'Crew';

                    return (
                      <tr key={cat.id || cat.code}>
                        <td className="mono" style={{ fontWeight: 700, color: '#38bdf8' }}>
                          {cat.code}
                        </td>
                        <td>
                          <strong style={{ fontSize: '0.9rem' }}>{cat.name}</strong>
                        </td>
                        <td>
                          <span className={`badge ${isCrewTarget ? 'badge-success' : 'badge-info'}`} style={{ fontSize: '0.7rem' }}>
                            {isCrewTarget ? <Users size={12} style={{ display: 'inline', marginRight: '4px' }} /> : <Ship size={12} style={{ display: 'inline', marginRight: '4px' }} />}
                            {cat.target || 'Kapal'}
                          </span>
                        </td>
                        <td className="mono" style={{ fontWeight: 600 }}>
                          {formatIDR(cat.allocated)}
                        </td>
                        <td className="mono" style={{ fontWeight: 700, color: '#10b981' }}>
                          {formatIDR(cat.spent)}
                        </td>
                        <td className="mono" style={{
                          fontWeight: 700,
                          color: variance >= 0 ? 'var(--text-main)' : '#ef4444'
                        }}>
                          {formatIDR(variance)}
                        </td>
                        <td style={{ width: '180px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div className="progress-bar-container" style={{ flex: 1 }}>
                              <div
                                className={`progress-bar-fill ${
                                  ratio >= 100 ? 'progress-red' :
                                  ratio >= 85 ? 'progress-amber' : 'progress-emerald'
                                }`}
                                style={{ width: `${Math.min(100, ratio)}%` }}
                              />
                            </div>
                            <span className="mono" style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                              {ratio}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${status.class}`}>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* SUBTAB 2: EXPENSE LEDGER (BUKU BESAR PENGELUARAN) */}
      {activeSubTab === 'ledger' && (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{
            padding: '1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Buku Besar Transaksi Pengeluaran & Pembelian</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Catatan invoice, PO suku cadang, dan belanja logistik provisi BAMA yang memotong pagu anggaran kapal
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Cari deskripsi, invoice, vendor..."
                value={searchLedger}
                onChange={(e) => setSearchLedger(e.target.value)}
                className="input-control"
                style={{ width: '220px', padding: '0.45rem 0.8rem', fontSize: '0.825rem' }}
              />

              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="select-control"
                style={{ width: '200px' }}
              >
                <option value="ALL">Semua Pos Anggaran</option>
                {categoriesList.map(c => (
                  <option key={c.code} value={c.name}>{c.code} - {c.name}</option>
                ))}
              </select>

              {canAction('record_actual_expense') && (
                <button
                  onClick={() => setShowAddExpenseModal(true)}
                  className="btn btn-primary"
                  style={{ fontSize: '0.825rem' }}
                >
                  <Plus size={14} />
                  <span>+ Catat Pengeluaran</span>
                </button>
              )}
            </div>
          </div>

          <div className="table-container">
            <table className="pms-table">
              <thead>
                <tr>
                  <th>No. ID / Invoice</th>
                  <th>Kapal</th>
                  <th>Pos Anggaran Terkait</th>
                  <th>Deskripsi Belanja / Pekerjaan</th>
                  <th>Vendor Rekanan</th>
                  <th>Tanggal</th>
                  <th>Realisasi Biaya (Actual)</th>
                  {canAction('record_actual_expense') && <th style={{ textAlign: 'right' }}>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {filteredCosts.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      Tidak ditemukan catatan transaksi pengeluaran sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filteredCosts.map(cost => {
                    const vesselName = vessels.find(v => v.id === cost.vesselId)?.name || '-';
                    return (
                      <tr key={cost.id}>
                        <td>
                          <div className="mono" style={{ fontWeight: 700, color: '#38bdf8' }}>{cost.id}</div>
                          {cost.invoiceNo && (
                            <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                              {cost.invoiceNo}
                            </span>
                          )}
                        </td>
                        <td style={{ fontWeight: 600 }}>{vesselName}</td>
                        <td>
                          <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                            {cost.budgetCategoryCode ? `${cost.budgetCategoryCode} • ` : ''}{cost.category}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>{cost.description}</td>
                        <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{cost.vendor}</td>
                        <td className="mono" style={{ fontSize: '0.78rem' }}>{cost.date}</td>
                        <td className="mono" style={{ fontWeight: 700, color: '#10b981' }}>
                          {formatIDR(cost.amount)}
                        </td>
                        {canAction('record_actual_expense') && (
                          <td style={{ textAlign: 'right' }}>
                            <button
                              onClick={() => {
                                if (window.confirm(`Batalkan pengeluaran ${cost.id} (${cost.description})? Sisa pagu anggaran kapal akan dikembalikan.`)) {
                                  deleteExpenseTransaction(cost.id);
                                }
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.2rem 0.5rem', color: '#f87171' }}
                              title="Hapus / Batalkan Transaksi"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ATUR / EDIT PAGU ANGGARAN KAPAL */}
      {showEditBudgetModal && editBudgetForm && (
        <div className="modal-overlay" onClick={() => setShowEditBudgetModal(false)}>
          <div className="modal-dialog" style={{ maxWidth: '750px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Atur Pagu Anggaran Kapal (Vessel Budget Allocation)</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Alokasi batas pengeluaran operasional kapal {editBudgetForm.vesselName} - {editBudgetForm.period}
                </p>
              </div>
              <button onClick={() => setShowEditBudgetModal(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBudget}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '68vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Nama Periode Anggaran
                    </label>
                    <input
                      type="text"
                      value={editBudgetForm.period}
                      onChange={e => setEditBudgetForm({ ...editBudgetForm, period: e.target.value })}
                      className="input-control"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Pejabat Pengesah (Finance Approval)
                    </label>
                    <input
                      type="text"
                      value={editBudgetForm.approvedBy}
                      onChange={e => setEditBudgetForm({ ...editBudgetForm, approvedBy: e.target.value })}
                      className="input-control"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Alokasi Pagu Anggaran per Pos Biaya (IDR):
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {editBudgetForm.categories.map((cat, idx) => (
                      <div
                        key={cat.code}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '100px 1fr 180px',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          background: 'var(--bg-surface-elevated)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        <span className="mono" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#38bdf8' }}>
                          {cat.code}
                        </span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{cat.name}</div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                            Sasaran: {cat.target || 'Kapal'} • Realisasi Saat Ini: {formatIDR(cat.spent)}
                          </span>
                        </div>
                        <div>
                          <input
                            type="number"
                            min="0"
                            step="500000"
                            value={cat.allocated}
                            onChange={e => {
                              const nextCats = [...editBudgetForm.categories];
                              nextCats[idx].allocated = Number(e.target.value) || 0;
                              setEditBudgetForm({ ...editBudgetForm, categories: nextCats });
                            }}
                            className="input-control mono"
                            style={{ textAlign: 'right', fontWeight: 700 }}
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Computed Budget Summary */}
                <div style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Pagu Anggaran Dihitung:</span>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>
                      {formatIDR(editBudgetForm.categories.reduce((s, c) => s + (Number(c.allocated) || 0), 0))}
                    </h4>
                  </div>
                  <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                    Otoritas Finance PBK
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Catatan & Ketentuan Anggaran
                  </label>
                  <textarea
                    rows={2}
                    value={editBudgetForm.notes}
                    onChange={e => setEditBudgetForm({ ...editBudgetForm, notes: e.target.value })}
                    className="input-control"
                    placeholder="Ketentuan batas pengadaan, jadwal revisi anggaran triwulan..."
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowEditBudgetModal(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan & Sahkan Pagu Anggaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CATAT PENGELUARAN REALISASI BARU */}
      {showAddExpenseModal && (
        <div className="modal-overlay" onClick={() => setShowAddExpenseModal(false)}>
          <div className="modal-dialog" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Catat Pengeluaran Riil (Actual Expense)</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Catat invoice belanja suku cadang, provisi BAMA kru, atau servis yang memotong pagu anggaran
                </p>
              </div>
              <button onClick={() => setShowAddExpenseModal(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveExpense}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Kapal Pembebanan
                    </label>
                    <select
                      value={expenseForm.vesselId}
                      onChange={e => setExpenseForm({ ...expenseForm, vesselId: e.target.value })}
                      className="select-control"
                    >
                      {vessels.map(v => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Pos Anggaran Terkait
                    </label>
                    <select
                      value={expenseForm.categoryCode}
                      onChange={e => setExpenseForm({ ...expenseForm, categoryCode: e.target.value })}
                      className="select-control"
                    >
                      {categoriesList.map(c => (
                        <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Deskripsi Pembelian / Pekerjaan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Belanja BAMA beras & ransum dapur pelayaran September"
                    value={expenseForm.description}
                    onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
                    className="input-control"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Nomor Invoice / Kuitansi / PO
                    </label>
                    <input
                      type="text"
                      placeholder="INV-2026-XXXX"
                      value={expenseForm.invoiceNo}
                      onChange={e => setExpenseForm({ ...expenseForm, invoiceNo: e.target.value })}
                      className="input-control"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Vendor / Supplier Rekanan
                    </label>
                    <input
                      type="text"
                      placeholder="Nama toko / rekanan penyedia"
                      value={expenseForm.vendor}
                      onChange={e => setExpenseForm({ ...expenseForm, vendor: e.target.value })}
                      className="input-control"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Tanggal Transaksi / Pembayaran
                    </label>
                    <input
                      type="date"
                      value={expenseForm.date}
                      onChange={e => setExpenseForm({ ...expenseForm, date: e.target.value })}
                      className="input-control"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Nominal Pengeluaran (IDR)
                    </label>
                    <input
                      type="number"
                      min="1000"
                      step="1000"
                      placeholder="Rp 0"
                      value={expenseForm.amount}
                      onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                      className="input-control mono"
                      style={{ fontWeight: 700, color: '#10b981' }}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowAddExpenseModal(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Posting Pengeluaran ke Anggaran Kapal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
