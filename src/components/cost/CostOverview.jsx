import React, { useState, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  PieChart,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  FileSpreadsheet,
  Ship,
  Users,
  X
} from 'lucide-react';
import { CostOverviewHeader } from './cost/CostOverviewHeader';
import { CostBudgetTab } from './cost/CostBudgetTab';
import { CostLedgerTab } from './cost/CostLedgerTab';
import { CostEditBudgetModal } from './cost/CostEditBudgetModal';
import { CostAddExpenseModal } from './cost/CostAddExpenseModal';

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
    if (!currentBudget) {
      const selectedShip = vessels.find(v => v.id === selectedVesselId);
      const defaultCategories = [
        { code: '5101-ENG', name: 'Main Engine Overhaul & Maintenance', allocated: 250000000, spent: 0 },
        { code: '5102-AUX', name: 'Auxiliary Engine / Generator Service', allocated: 120000000, spent: 0 },
        { code: '5103-DECK', name: 'Deck Machinery & Hull Preservation', allocated: 180000000, spent: 0 },
        { code: '5104-ELEC', name: 'Electrical & Navigation Systems', allocated: 75000000, spent: 0 },
        { code: '5105-DOCK', name: 'BKI Special Survey / Annual Drydock', allocated: 350000000, spent: 0 }
      ];
      const initialTotal = defaultCategories.reduce((s, c) => s + c.allocated, 0);
      setEditBudgetForm({
        id: `bud-${selectedVesselId || 'v-new'}`,
        vesselId: selectedVesselId || vessels[0]?.id || '',
        vesselName: selectedShip ? selectedShip.name : 'Armada Terpilih',
        fiscalYear: new Date().getFullYear(),
        totalBudget: initialTotal,
        categories: defaultCategories
      });
      setShowEditBudgetModal(true);
      return;
    }
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
      <CostOverviewHeader
        activeSubTab={activeSubTab}
        costs={costs}
        setActiveSubTab={setActiveSubTab}
      />

      {/* SUBTAB 1: VESSEL BUDGET MANAGEMENT */}
      {(activeSubTab === 'budget') && (
        <CostBudgetTab
          absorptionRate={absorptionRate}
          canAction={canAction}
          categoriesList={categoriesList}
          currentBudget={currentBudget}
          expenseForm={expenseForm}
          formatIDR={formatIDR}
          getStatusBadge={getStatusBadge}
          openEditBudgetModal={openEditBudgetModal}
          selectedVesselId={selectedVesselId}
          setExpenseForm={setExpenseForm}
          setSelectedVesselId={setSelectedVesselId}
          setShowAddExpenseModal={setShowAddExpenseModal}
          totalAllocated={totalAllocated}
          totalSpent={totalSpent}
          totalVariance={totalVariance}
          vessels={vessels}
        />
      )}

      {/* SUBTAB 2: EXPENSE LEDGER (BUKU BESAR PENGELUARAN) */}
      {(activeSubTab === 'ledger') && (
        <CostLedgerTab
          canAction={canAction}
          categoriesList={categoriesList}
          deleteExpenseTransaction={deleteExpenseTransaction}
          filteredCosts={filteredCosts}
          formatIDR={formatIDR}
          searchLedger={searchLedger}
          selectedCategoryFilter={selectedCategoryFilter}
          setSearchLedger={setSearchLedger}
          setSelectedCategoryFilter={setSelectedCategoryFilter}
          setShowAddExpenseModal={setShowAddExpenseModal}
          vessels={vessels}
        />
      )}

      {/* MODAL 1: ATUR / EDIT PAGU ANGGARAN KAPAL */}
      {(showEditBudgetModal && editBudgetForm) && (
        <CostEditBudgetModal
          editBudgetForm={editBudgetForm}
          formatIDR={formatIDR}
          handleSaveBudget={handleSaveBudget}
          setEditBudgetForm={setEditBudgetForm}
          setShowEditBudgetModal={setShowEditBudgetModal}
        />
      )}

      {/* MODAL 2: CATAT PENGELUARAN REALISASI BARU */}
      {(showAddExpenseModal) && (
        <CostAddExpenseModal
          categoriesList={categoriesList}
          expenseForm={expenseForm}
          handleSaveExpense={handleSaveExpense}
          setExpenseForm={setExpenseForm}
          setShowAddExpenseModal={setShowAddExpenseModal}
          vessels={vessels}
        />
      )}
    </div>
  );
};
