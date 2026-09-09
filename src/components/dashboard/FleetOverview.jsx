import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Ship,
  Wrench,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  Package,
  Users,
  ArrowUpRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export const FleetOverview = () => {
  const {
    vessels,
    allEquipment,
    allWorkOrders,
    allSpareparts,
    allCrew,
    allCrewCertificates,
    allShipDocuments,
    allCosts,
    setSelectedVesselId,
    setActiveTab,
    overdueWOCount,
    expiredDocsCount,
    dueSoonDocsCount,
    lowStockCount
  } = usePMS();

  const [fleetScope, setFleetScope] = useState('ALL'); // ALL | OWNER | OPERATOR

  // Fleet Calculations
  const totalEquipments = allEquipment.length;
  const totalRunningHours = allEquipment.reduce((acc, curr) => acc + (curr.runningHours || 0), 0);
  const completedWO = allWorkOrders.filter(w => w.status === 'Completed').length;
  const inProgressWO = allWorkOrders.filter(w => w.status === 'In Progress').length;
  const complianceRate = Math.round((completedWO / Math.max(1, allWorkOrders.length)) * 100);

  const totalCosts = allCosts.reduce((acc, curr) => acc + curr.amount, 0);
  const totalBudget = allCosts.reduce((acc, curr) => acc + curr.budgetAllocated, 0);

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Fleet Hero Header */}
      <div className="glass-card" style={{
        padding: '1.75rem 2rem',
        background: 'linear-gradient(135deg, rgba(15, 28, 53, 0.8) 0%, rgba(2, 132, 199, 0.15) 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-info">Fleet Control Center</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Monitoring {vessels.length} Kapal (17 As Owner & 11 As Operator)
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            Dashboard Armada Maritim Terpadu
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '680px', marginTop: '0.3rem' }}>
            Pemantauan kepatuhan Planned Maintenance System (PMS), kelaiklautan dokumen legal kapal, sertifikasi kru STCW, dan ketersediaan suku cadang.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setActiveTab('maintenance')} className="btn btn-primary">
            <Wrench size={16} />
            <span>Lihat Semua Work Order</span>
          </button>
          <button onClick={() => setActiveTab('notifications')} className="btn btn-whatsapp">
            <AlertTriangle size={16} />
            <span>Kirim Reminder WA</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-cols-4">
        {/* Compliance Gauge Card */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Kepatuhan Maintenance</p>
              <h3 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.35rem', color: '#38bdf8' }}>
                {complianceRate}%
              </h3>
            </div>
            <div style={{ padding: '0.65rem', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
              <ShieldCheck size={24} />
            </div>
          </div>
          <div style={{ marginTop: '0.85rem' }}>
            <div className="progress-bar-container">
              <div className="progress-bar-fill progress-blue" style={{ width: `${complianceRate}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
              <span>{completedWO} Selesai</span>
              <span>{inProgressWO} Dalam Pengerjaan</span>
            </div>
          </div>
        </div>

        {/* Expired Docs Radar Card */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Dokumen / Sertifikat Expired</p>
              <h3 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.35rem', color: expiredDocsCount > 0 ? '#ef4444' : '#10b981' }}>
                {expiredDocsCount}
              </h3>
            </div>
            <div style={{
              padding: '0.65rem',
              borderRadius: '10px',
              background: expiredDocsCount > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: expiredDocsCount > 0 ? '#ef4444' : '#10b981'
            }}>
              <FileCheck size={24} />
            </div>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.85rem' }}>
            {dueSoonDocsCount > 0 ? (
              <span style={{ color: '#fbbf24', fontWeight: 600 }}>⚠️ {dueSoonDocsCount} dokumen H-30 jatuh tempo</span>
            ) : (
              'Tidak ada dokumen mendekati jatuh tempo'
            )}
          </p>
        </div>

        {/* Running Hours Card */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Jam Operasi Mesin</p>
              <h3 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.35rem', color: '#f59e0b' }}>
                {totalEquipments}
              </h3>
            </div>
            <div style={{ padding: '0.65rem', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <Clock size={24} />
            </div>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.85rem' }}>
            Total <strong className="mono" style={{ color: '#fff' }}>{totalRunningHours.toLocaleString('id-ID')}</strong> jam operasi tercatat di logbook armada.
          </p>
        </div>

        {/* Cost & Budget Variance Card */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Realisasi Biaya</p>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '0.35rem', color: '#10b981' }}>
                {formatIDR(totalCosts)}
              </h3>
            </div>
            <div style={{ padding: '0.65rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <DollarSign size={24} />
            </div>
          </div>
          <div style={{ marginTop: '0.85rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Anggaran:{' '}
            <strong style={{ color: 'var(--text-main)' }}>{formatIDR(totalBudget)}</strong>
            <div className="progress-bar-container" style={{ marginTop: '0.4rem' }}>
              <div
                className="progress-bar-fill progress-green"
                style={{ width: `${Math.min(100, Math.round((totalCosts / totalBudget) * 100))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Vessel Cards Showcase */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Status Armada Kapal</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Pilih kapal untuk membuka dashboard teknis dan logbook spesifik</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-surface-elevated)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              {[
                { id: 'ALL', label: `Semua (${vessels.length})` },
                { id: 'OWNER', label: `⚓ As Owner (${vessels.filter(v => !v.id.startsWith('v-op-') && v.ownershipStatus !== 'As Operator').length})` },
                { id: 'OPERATOR', label: `⚙️ As Operator (${vessels.filter(v => v.id.startsWith('v-op-') || v.ownershipStatus === 'As Operator').length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFleetScope(tab.id)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.78rem',
                    fontWeight: fleetScope === tab.id ? 700 : 500,
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    background: fleetScope === tab.id ? '#0284c7' : 'transparent',
                    color: fleetScope === tab.id ? '#fff' : 'var(--text-muted)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button onClick={() => setActiveTab('fleet')} className="btn btn-secondary btn-sm">
              <span>Kelola Detail Kapal</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        <div className="grid-cols-3">
          {vessels.filter(v => {
            if (fleetScope === 'OWNER') return !v.id.startsWith('v-op-') && v.ownershipStatus !== 'As Operator';
            if (fleetScope === 'OPERATOR') return v.id.startsWith('v-op-') || v.ownershipStatus === 'As Operator';
            return true;
          }).map(ship => {
            const shipWO = allWorkOrders.filter(w => w.vesselId === ship.id);
            const shipOverdue = shipWO.filter(w => w.status === 'Overdue').length;
            const shipEquipment = allEquipment.filter(e => e.vesselId === ship.id);
            const shipCrew = allCrew.filter(c => c.vesselId === ship.id);
            const isOperator = ship.id.startsWith('v-op-') || ship.ownershipStatus === 'As Operator';

            return (
              <div
                key={ship.id}
                className="glass-card glass-card-interactive"
                style={{
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  border: isOperator ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(16, 185, 129, 0.35)'
                }}
                onClick={() => {
                  setSelectedVesselId(ship.id);
                  setActiveTab('dashboard');
                }}
              >
                {/* Ship Photo & Badges */}
                <div style={{ position: 'relative', height: '170px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src={ship.photo}
                    alt={ship.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0.75rem',
                    display: 'flex',
                    gap: '0.4rem',
                    flexWrap: 'wrap'
                  }}>
                    <span className={`badge ${
                      ship.status.includes('Operasional') ? 'badge-success' : 'badge-warning'
                    }`}>
                      {ship.status.split(' ')[0]}
                    </span>
                    <span
                      className="badge"
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        background: isOperator ? 'rgba(2, 132, 199, 0.95)' : 'rgba(5, 150, 105, 0.95)',
                        color: '#fff',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                      }}
                    >
                      {isOperator ? '⚙️ As Operator' : '⚓ As Owner'}
                    </span>
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    insetInline: 0,
                    background: 'linear-gradient(to top, rgba(11, 20, 38, 0.95) 0%, transparent 100%)',
                    padding: '1.25rem 1rem 0.5rem'
                  }}>
                    <h4 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 800 }}>{ship.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      IMO: <span className="mono">{ship.imo}</span> • Call Sign: <span className="mono">{ship.callSign}</span>
                    </p>
                  </div>
                </div>

                {/* Ship Specs Body */}
                <div style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>
                      Tipe: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{ship.type.split('/')[0]}</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>
                      Ukuran: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{ship.gt.toLocaleString()} GT</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>
                      Lokasi: <span style={{ color: '#38bdf8', fontWeight: 500 }}>{ship.currentLocation.split('(')[0]}</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>
                      Kecepatan: <span className="mono" style={{ color: '#fff', fontWeight: 600 }}>{ship.speedKnots} kts</span>
                    </div>
                  </div>

                  <div style={{
                    borderTop: '1px solid var(--border-glass)',
                    paddingTop: '0.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.78rem'
                  }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <span><strong>{shipEquipment.length}</strong> Mesin</span>
                      <span><strong>{shipCrew.length}</strong> Kru</span>
                    </div>
                    {shipOverdue > 0 ? (
                      <span className="badge badge-danger-pulse">
                        {shipOverdue} WO Overdue
                      </span>
                    ) : (
                      <span className="badge badge-success">
                        PMS Prima
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Work Orders Activity & Priority Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Recent Work Orders */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Pekerjaan Perawatan Terkini (Work Orders)</h4>
            <button onClick={() => setActiveTab('maintenance')} className="btn btn-secondary btn-sm">
              Semua WO
            </button>
          </div>

          <div className="table-container">
            <table className="pms-table">
              <thead>
                <tr>
                  <th>No. WO</th>
                  <th>Kapal</th>
                  <th>Pekerjaan</th>
                  <th>Prioritas</th>
                  <th>Target Jam / Tgl</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allWorkOrders.slice(0, 5).map(wo => {
                  const vesselName = vessels.find(v => v.id === wo.vesselId)?.name || '-';
                  return (
                    <tr key={wo.id}>
                      <td className="mono" style={{ fontWeight: 700, color: '#38bdf8' }}>{wo.id}</td>
                      <td>{vesselName}</td>
                      <td style={{ fontWeight: 600 }}>{wo.title}</td>
                      <td>
                        <span className={`badge ${
                          wo.priority === 'Sangat Tinggi' || wo.priority === 'Tinggi' ? 'badge-danger' : 'badge-warning'
                        }`}>
                          {wo.priority}
                        </span>
                      </td>
                      <td className="mono" style={{ fontSize: '0.78rem' }}>
                        {wo.targetHours ? `${wo.targetHours} Jam` : wo.dueDate}
                      </td>
                      <td>
                        <span className={`badge ${
                          wo.status === 'Completed' ? 'badge-success' :
                          wo.status === 'In Progress' ? 'badge-info' :
                          wo.status === 'Overdue' ? 'badge-danger-pulse' :
                          'badge-neutral'
                        }`}>
                          {wo.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Urgent Action Feed */}
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} color="#f59e0b" />
            <span>Tindakan Prioritas Armada</span>
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
            {overdueWOCount > 0 && (
              <div style={{
                padding: '0.85rem',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                <div style={{ fontWeight: 700, color: '#ef4444', fontSize: '0.85rem' }}>
                  Work Order Melewati Jam Servis
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Kompresor Udara Sperre HL2 pada kapal RP 2020 telah melewati batas running hours (2510 / 2500 jam).
                </p>
                <button
                  onClick={() => setActiveTab('maintenance')}
                  className="btn btn-sm btn-danger"
                  style={{ marginTop: '0.5rem', width: '100%' }}
                >
                  Buka Work Order Overdue
                </button>
              </div>
            )}

            {expiredDocsCount > 0 && (
              <div style={{
                padding: '0.85rem',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                <div style={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.85rem' }}>
                  Sertifikat Kadaluarsa Terdeteksi
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Sertifikat Klas Lambung BKI dan BST Seafarer expired. Perlu penjadwalan survey BKI & update data crew.
                </p>
                <button
                  onClick={() => setActiveTab('documents')}
                  className="btn btn-sm btn-secondary"
                  style={{ marginTop: '0.5rem', width: '100%' }}
                >
                  Cek Dokumen & Sertifikat
                </button>
              </div>
            )}

            {lowStockCount > 0 && (
              <div style={{
                padding: '0.85rem',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.85rem' }}>
                  Stok Sparepart Kritis
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {lowStockCount} suku cadang di bawah batas minimum (Lube Oil Filter, Valve Plate).
                </p>
                <button
                  onClick={() => setActiveTab('spareparts')}
                  className="btn btn-sm btn-secondary"
                  style={{ marginTop: '0.5rem', width: '100%' }}
                >
                  Buka Pengajuan Requisition
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
