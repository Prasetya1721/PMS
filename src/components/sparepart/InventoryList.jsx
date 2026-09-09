import React, { useState } from 'react';
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
  ShoppingCart
} from 'lucide-react';

export const InventoryList = () => {
  const {
    spareparts,
    requisitions,
    vessels,
    allEquipment,
    updateSparepartStock,
    addRequisition
  } = usePMS();

  const [activeSubTab, setActiveSubTab] = useState('inventory'); // 'inventory' | 'requisitions'
  const [search, setSearch] = useState('');
  const [showReqModal, setShowReqModal] = useState(false);
  const [selectedPartForReq, setSelectedPartForReq] = useState(null);

  // Requisition Form state
  const [reqQty, setReqQty] = useState(2);
  const [reqNotes, setReqNotes] = useState('');

  const filteredSpareparts = spareparts.filter(sp => {
    return sp.name.toLowerCase().includes(search.toLowerCase()) ||
           sp.code.toLowerCase().includes(search.toLowerCase()) ||
           sp.equipmentCode.toLowerCase().includes(search.toLowerCase());
  });

  const handleCreateRequisition = (e) => {
    e.preventDefault();
    if (!selectedPartForReq) return;

    addRequisition({
      vesselId: selectedPartForReq.vesselId,
      requesterName: 'Chief Engineer',
      urgency: selectedPartForReq.status === 'Critical' ? 'Urgent' : 'Normal',
      totalEstimatedCost: (selectedPartForReq.unitCost || 1000000) * reqQty,
      items: [
        {
          partId: selectedPartForReq.id,
          name: selectedPartForReq.name,
          qty: reqQty,
          estimatedUnitCost: selectedPartForReq.unitCost
        }
      ],
      notes: reqNotes || `Pengajuan pengadaan otomatis karena stok tersisa ${selectedPartForReq.stockQty} ${selectedPartForReq.unit}.`
    });

    setShowReqModal(false);
    setSelectedPartForReq(null);
  };

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Suku Cadang & Manajemen Inventaris (Spareparts)</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Katalog suku cadang per equipment, peringatan minimum stock, dan pengajuan pembelian (Purchase Requisition)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`btn ${activeSubTab === 'inventory' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Package size={16} />
            <span>Katalog Stok Kapal</span>
          </button>
          <button
            onClick={() => setActiveSubTab('requisitions')}
            className={`btn ${activeSubTab === 'requisitions' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <ShoppingCart size={16} />
            <span>Pengajuan Requisition ({requisitions.length})</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'inventory' ? (
        <>
          {/* Search Bar */}
          <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Cari part number, nama komponen, kode mesin..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-control"
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          {/* Spareparts Table */}
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div className="table-container">
              <table className="pms-table">
                <thead>
                  <tr>
                    <th>Part Number & Deskripsi</th>
                    <th>Kapal</th>
                    <th>Equipment Terkait</th>
                    <th>Lokasi Rak / Store</th>
                    <th>Stok / Batas Min</th>
                    <th>Estimasi Harga Satuan</th>
                    <th>Status Stok</th>
                    <th style={{ textAlign: 'right' }}>Aksi Stok & Order</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSpareparts.map(sp => {
                    const vesselName = vessels.find(v => v.id === sp.vesselId)?.name || '-';
                    return (
                      <tr key={sp.id}>
                        <td>
                          <div className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>
                            {sp.code}
                          </div>
                          <strong style={{ fontSize: '0.9rem', marginTop: '0.1rem' }}>{sp.name}</strong>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Supplier: {sp.supplier}</div>
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>{vesselName}</td>
                        <td>
                          <span className="badge badge-info mono" style={{ fontSize: '0.7rem' }}>
                            {sp.equipmentCode}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{sp.location}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="mono" style={{
                              fontWeight: 700,
                              fontSize: '1rem',
                              color: sp.stockQty <= sp.minStockQty ? '#ef4444' : '#10b981'
                            }}>
                              {sp.stockQty}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              / Min: {sp.minStockQty} {sp.unit}
                            </span>
                          </div>
                        </td>
                        <td className="mono" style={{ fontSize: '0.85rem' }}>
                          {formatIDR(sp.unitCost)}
                        </td>
                        <td>
                          <span className={`badge ${
                            sp.status === 'Critical' ? 'badge-danger-pulse' :
                            sp.status === 'Low Stock' ? 'badge-warning' : 'badge-success'
                          }`}>
                            {sp.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', alignItems: 'center' }}>
                            {/* Stock Quick Adjustment */}
                            <button
                              onClick={() => updateSparepartStock(sp.id, -1)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.2rem 0.5rem' }}
                              title="Kurangi 1 (Pemakaian)"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => updateSparepartStock(sp.id, 1)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.2rem 0.5rem' }}
                              title="Tambah 1 (Restock)"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPartForReq(sp);
                                setReqQty(Math.max(2, sp.minStockQty - sp.stockQty + 2));
                                setShowReqModal(true);
                              }}
                              className="btn btn-primary btn-sm"
                              style={{ fontSize: '0.75rem' }}
                            >
                              <ShoppingCart size={13} />
                              <span>Order PO</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Requisitions Subtab */
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              Daftar Pengajuan Pengadaan Suku Cadang (Purchase Requisitions)
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {requisitions.map(req => {
              const vesselName = vessels.find(v => v.id === req.vesselId)?.name || '-';
              return (
                <div
                  key={req.id}
                  style={{
                    padding: '1.1rem',
                    borderRadius: '8px',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8' }}>
                        {req.id}
                      </span>
                      <span className={`badge ${req.urgency === 'Urgent' ? 'badge-danger' : 'badge-neutral'}`}>
                        {req.urgency}
                      </span>
                      <span className="badge badge-info">
                        {req.status}
                      </span>
                    </div>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.35rem' }}>
                      Kapal: {vesselName} • Diajukan Oleh: {req.requesterName}
                    </h5>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Tanggal Pengajuan: {req.dateSubmitted} • Catatan: {req.notes}
                    </p>

                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {req.items?.map((it, idx) => (
                        <span key={idx} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.06)' }}>
                          <strong>{it.qty}x</strong> {it.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimasi Nilai Pengadaan:</span>
                    <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10b981', marginTop: '0.15rem' }}>
                      {formatIDR(req.totalEstimatedCost)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Requisition */}
      {showReqModal && selectedPartForReq && (
        <div className="modal-overlay" onClick={() => setShowReqModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                Pengajuan Pembelian Sparepart (Purchase Requisition)
              </h3>
            </div>
            <form onSubmit={handleCreateSubmitRequisition => handleCreateRequisition(handleCreateSubmitRequisition)}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px' }}>
                  <div className="mono" style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
                    {selectedPartForReq.code}
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.15rem' }}>
                    {selectedPartForReq.name}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Stok saat ini: {selectedPartForReq.stockQty} {selectedPartForReq.unit} (Batas min: {selectedPartForReq.minStockQty})
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Jumlah Pemesanan (Qty)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={reqQty}
                    onChange={(e) => setReqQty(Number(e.target.value))}
                    className="input-control mono"
                    style={{ fontSize: '1.05rem', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Total Estimasi Biaya
                  </label>
                  <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>
                    {formatIDR((selectedPartForReq.unitCost || 1000000) * reqQty)}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Justifikasi / Kebutuhan Pelayaran
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Dibutuhkan untuk servis rutin sebelum sandar di pelabuhan tujuan."
                    value={reqNotes}
                    onChange={(e) => setReqNotes(e.target.value)}
                    className="input-control"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowReqModal(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Kirim Pengajuan ke Fleet Office
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
