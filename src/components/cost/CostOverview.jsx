import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  DollarSign,
  TrendingUp,
  PieChart,
  Calendar,
  Filter,
  ArrowUpRight,
  Download,
  Building2
} from 'lucide-react';

export const CostOverview = () => {
  const { costs, vessels } = usePMS();
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const totalActual = costs.reduce((sum, c) => sum + c.amount, 0);
  const totalBudget = costs.reduce((sum, c) => sum + c.budgetAllocated, 0);
  const remainingBudget = totalBudget - totalActual;
  const absorptionRate = Math.round((totalActual / Math.max(1, totalBudget)) * 100);

  const categories = ['ALL', 'Sparepart Mesin', 'Jasa Servis & Inspeksi', 'Sparepart Tugboat', 'Docking & Galangan'];

  const filteredCosts = costs.filter(c => {
    return selectedCategory === 'ALL' || c.category === selectedCategory;
  });

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Manajemen Biaya & Anggaran (Cost Management)</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Pelacakan realisasi biaya suku cadang, jasa teknisi pihak ketiga, docking survey vs pagu anggaran armada
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-cols-4">
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pagu Anggaran (Budget)</span>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.35rem' }}>
            {formatIDR(totalBudget)}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
            Total alokasi biaya perawatan periode aktif
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Realisasi Pengeluaran</span>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.35rem', color: '#10b981' }}>
            {formatIDR(totalActual)}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Total invoice & pemakaian tercatat
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sisa Anggaran (Variance)</span>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.35rem', color: remainingBudget >= 0 ? '#38bdf8' : '#ef4444' }}>
            {formatIDR(remainingBudget)}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            {remainingBudget >= 0 ? 'Surplus / Dalam kendali' : 'Overbudget!'}
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Penyerapan Anggaran</span>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.35rem', color: '#f59e0b' }}>
            {absorptionRate}%
          </h3>
          <div className="progress-bar-container" style={{ marginTop: '0.5rem' }}>
            <div className="progress-bar-fill progress-amber" style={{ width: `${Math.min(100, absorptionRate)}%` }} />
          </div>
        </div>
      </div>

      {/* Cost Transactions Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Rincian Transaksi Biaya Perawatan & Sparepart</h4>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Kategori:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select-control"
              style={{ width: '220px' }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'ALL' ? 'Semua Kategori' : cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="pms-table">
            <thead>
              <tr>
                <th>No. ID</th>
                <th>Kapal</th>
                <th>Kategori Biaya</th>
                <th>Deskripsi Pekerjaan / Pembelian</th>
                <th>Vendor / Galangan</th>
                <th>Tanggal</th>
                <th>Realisasi (Actual)</th>
                <th>Anggaran (Budget)</th>
              </tr>
            </thead>
            <tbody>
              {filteredCosts.map(cost => {
                const vesselName = vessels.find(v => v.id === cost.vesselId)?.name || '-';
                return (
                  <tr key={cost.id}>
                    <td className="mono" style={{ fontWeight: 700, color: '#38bdf8' }}>{cost.id}</td>
                    <td style={{ fontWeight: 600 }}>{vesselName}</td>
                    <td>
                      <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                        {cost.category}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{cost.description}</td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{cost.vendor}</td>
                    <td className="mono" style={{ fontSize: '0.78rem' }}>{cost.date}</td>
                    <td className="mono" style={{ fontWeight: 700, color: '#10b981' }}>
                      {formatIDR(cost.amount)}
                    </td>
                    <td className="mono" style={{ color: 'var(--text-muted)' }}>
                      {formatIDR(cost.budgetAllocated)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
