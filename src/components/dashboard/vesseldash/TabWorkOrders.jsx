/**
 * TabWorkOrders.jsx
 * Diekstrak dari VesselDashboard.jsx (baris 1302-1684).
 * Sumber: SUB-TAB 5: permintaan barang ke gudang (material requisition) - dengan perhitungan filter lokal
 */
import React from 'react';
import { CheckCircle, CheckSquare, Package, Plus, Printer, Search, Send, ShoppingBag, Square } from 'lucide-react';

export const TabWorkOrders = ({
  currentShip,
  getRequisitionItems,
  handleSendWAtoWarehouse,
  reqCategoryFilter,
  reqSearchQuery,
  reqStatusFilter,
  setReqCategoryFilter,
  setReqSearchQuery,
  setReqStatusFilter,
  setSelectedWOForModal,
  setShowNewWOModal,
  shipWOs,
  toggleChecklist,
  updateWorkOrderStatus,
}) => {
  const totalShipReqs = shipWOs.length;
          const kapalReqs = shipWOs.filter(w => (w.mainCategory || w.category) !== 'Kebutuhan Crew');
          const crewReqs = shipWOs.filter(w => (w.mainCategory || w.category) === 'Kebutuhan Crew');
          const pendingReqs = shipWOs.filter(w => !['Completed', 'Diterima di Kapal (Selesai)', 'Diterima di Kapal'].includes(w.status));

          const filteredShipReqs = shipWOs.filter(wo => {
            // Category Filter
            if (reqCategoryFilter === 'KAPAL' && (wo.mainCategory || wo.category) === 'Kebutuhan Crew') return false;
            if (reqCategoryFilter === 'CREW' && (wo.mainCategory || wo.category) !== 'Kebutuhan Crew') return false;

            // Status Filter
            if (reqStatusFilter === 'PENDING' && ['Completed', 'Diterima di Kapal (Selesai)', 'Diterima di Kapal'].includes(wo.status)) return false;
            if (reqStatusFilter === 'APPROVED' && !['Disetujui Nakhoda', 'Disetujui Gudang', 'Disetujui Logistik & Gudang'].includes(wo.status)) return false;
            if (reqStatusFilter === 'COMPLETED' && !['Completed', 'Diterima di Kapal (Selesai)', 'Diterima di Kapal'].includes(wo.status)) return false;

            // Search Filter
            if (reqSearchQuery.trim()) {
              const q = reqSearchQuery.toLowerCase();
              const titleMatch = (wo.title || '').toLowerCase().includes(q);
              const idMatch = (wo.id || '').toLowerCase().includes(q);
              const picMatch = (wo.pic || wo.assignedTo || '').toLowerCase().includes(q);
              const itemsMatch = getRequisitionItems(wo).some(it => (it.name || '').toLowerCase().includes(q));
              if (!titleMatch && !idMatch && !picMatch && !itemsMatch) return false;
            }

            return true;
          });

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Header Section */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <ShoppingBag size={22} color="#38bdf8" />
                    <span>Permintaan Barang ke Gudang: {currentShip.name}</span>
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Daftar pengajuan kebutuhan kapal & crew, status approval gudang logistik, dan cetak Surat Permintaan Barang (SPB)
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedWOForModal(null);
                    setShowNewWOModal(true);
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
                >
                  <Plus size={15} />
                  <span>+ Ajukan Permintaan Barang Baru</span>
                </button>
              </div>

              {/* 4 Mini Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="glass-card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #38bdf8' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Pengajuan</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.25rem' }}>
                    {totalShipReqs} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Dokumen</span>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #6366f1' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>🚢 Kebutuhan Kapal</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#818cf8', marginTop: '0.25rem' }}>
                    {kapalReqs.length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Permintaan</span>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #10b981' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>👥 Kebutuhan Crew</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399', marginTop: '0.25rem' }}>
                    {crewReqs.length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Permintaan</span>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #f59e0b' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>⏳ Menunggu Gudang</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.25rem' }}>
                    {pendingReqs.length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Pending</span>
                  </div>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div className="glass-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {/* Category Filters */}
                  <button
                    onClick={() => setReqCategoryFilter('ALL')}
                    className={`btn btn-sm ${reqCategoryFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                  >
                    Semua Kategori ({totalShipReqs})
                  </button>
                  <button
                    onClick={() => setReqCategoryFilter('KAPAL')}
                    className={`btn btn-sm ${reqCategoryFilter === 'KAPAL' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                  >
                    🚢 Kebutuhan Kapal ({kapalReqs.length})
                  </button>
                  <button
                    onClick={() => setReqCategoryFilter('CREW')}
                    className={`btn btn-sm ${reqCategoryFilter === 'CREW' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                  >
                    👥 Kebutuhan Crew ({crewReqs.length})
                  </button>

                  <span style={{ color: 'var(--border-subtle)', margin: '0 0.25rem' }}>|</span>

                  {/* Status Filter Dropdown */}
                  <select
                    value={reqStatusFilter}
                    onChange={(e) => setReqStatusFilter(e.target.value)}
                    className="select-control"
                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem', height: '34px', width: '160px' }}
                  >
                    <option value="ALL">Semua Status</option>
                    <option value="PENDING">⏳ Menunggu Gudang</option>
                    <option value="APPROVED">⚓ Disetujui</option>
                    <option value="COMPLETED">✅ Selesai / Diterima</option>
                  </select>
                </div>

                {/* Search Box */}
                <div style={{ position: 'relative', minWidth: '240px' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Cari barang, no. SPB, PIC..."
                    value={reqSearchQuery}
                    onChange={(e) => setReqSearchQuery(e.target.value)}
                    className="input-control"
                    style={{ paddingLeft: '2rem', height: '34px', fontSize: '0.8rem', width: '100%' }}
                  />
                </div>
              </div>

              {/* List of Material Requisitions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredShipReqs.length === 0 ? (
                  <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <CheckCircle size={40} color="#10b981" style={{ margin: '0 auto 0.75rem' }} />
                    <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>Tidak Ada Permintaan Barang</h4>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      {reqSearchQuery || reqCategoryFilter !== 'ALL' || reqStatusFilter !== 'ALL'
                        ? 'Tidak ditemukan data pengajuan barang yang sesuai dengan filter pencarian.'
                        : 'Belum ada pengajuan kebutuhan barang ke gudang untuk kapal ini.'}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedWOForModal(null);
                        setShowNewWOModal(true);
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ marginTop: '1rem' }}
                    >
                      <Plus size={14} />
                      <span>Ajukan Permintaan Sekarang</span>
                    </button>
                  </div>
                ) : (
                  filteredShipReqs.map(wo => {
                    const reqItems = getRequisitionItems(wo);
                    const isCrew = (wo.mainCategory || wo.category) === 'Kebutuhan Crew';

                    return (
                      <div key={wo.id} className="glass-card" style={{ padding: '1.5rem' }}>
                        {/* Top Row: Meta Badges & Actions */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                              <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>
                                {wo.id}
                              </span>
                              <span className={`badge ${
                                wo.priority === 'Sangat Tinggi' || wo.priority === 'Tinggi' || wo.priority === 'Urgent / Darurat'
                                  ? 'badge-danger'
                                  : wo.priority === 'Penting (Segera)' || wo.priority === 'Penting'
                                  ? 'badge-warning'
                                  : 'badge-info'
                              }`}>
                                {wo.priority}
                              </span>
                              <span
                                className="badge"
                                style={{
                                  background: isCrew ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                                  color: isCrew ? '#34d399' : '#818cf8',
                                  border: isCrew ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
                                  fontWeight: 700
                                }}
                              >
                                {isCrew ? '👥 Kebutuhan Crew' : '🚢 Kebutuhan Kapal'}
                              </span>
                              {wo.subCategory && (
                                <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                                  {wo.subCategory}
                                </span>
                              )}
                            </div>

                            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '0.5rem', color: '#f8fafc' }}>
                              {wo.title || 'Pengajuan Kebutuhan Barang Gudang'}
                            </h4>

                            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                              PIC / Pemohon: <strong>{wo.pic || wo.assignedTo}</strong> • Mengetahui: <strong>{wo.captain || wo.supervisor || currentShip.masterCaptain || 'Capt. Hendra Gunawan, M.Mar'}</strong> • Tgl Permintaan: <strong>{wo.requestDate || wo.dueDate || '-'}</strong> • Target Dibutuhkan: <strong>{wo.neededDate || wo.dueDate || 'Segera'}</strong>
                            </p>
                            {wo.deliveryLocation && (
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.15rem' }}>
                                📍 Titik Penyerahan: {wo.deliveryLocation}
                              </p>
                            )}
                          </div>

                          {/* Action Controls */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                            <select
                              value={wo.status}
                              onChange={(e) => updateWorkOrderStatus(wo.id, e.target.value)}
                              className="select-control"
                              style={{ width: '160px', fontSize: '0.8rem', fontWeight: 600 }}
                            >
                              <option value="Diajukan">Diajukan</option>
                              <option value="Disetujui Nakhoda">Disetujui Nakhoda</option>
                              <option value="Disetujui Gudang">Disetujui Gudang</option>
                              <option value="Sedang Dikirim">Sedang Dikirim</option>
                              <option value="Diterima di Kapal (Selesai)">Diterima di Kapal (Selesai)</option>
                              <option value="Ditolak Gudang">Ditolak Gudang</option>
                            </select>

                            {/* Print / View SPB Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedWOForModal(wo)}
                              className="btn btn-secondary btn-sm"
                              title="Lihat & Cetak Surat Permintaan Barang Resmi"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}
                            >
                              <Printer size={13} color="#38bdf8" />
                              <span>Lihat / Cetak SPB</span>
                            </button>

                            {/* Send WhatsApp to Warehouse Button */}
                            <button
                              type="button"
                              onClick={() => handleSendWAtoWarehouse(wo)}
                              className="btn btn-whatsapp btn-sm"
                              title="Kirim notifikasi daftar barang ke WA Gudang Logistik"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                            >
                              <Send size={13} />
                              <span>Kirim WA Gudang</span>
                            </button>
                          </div>
                        </div>

                        {/* DAFTAR BARANG YANG DIMINTA KE GUDANG (TABLE) */}
                        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <Package size={15} />
                              <span>DAFTAR BARANG YANG DIMINTA KE GUDANG ({reqItems.length} ITEM):</span>
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              Klik status untuk menandai barang telah tiba di kapal
                            </span>
                          </div>

                          {reqItems.length === 0 ? (
                            <div style={{ padding: '0.75rem', background: 'var(--bg-surface-elevated)', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                              Belum ada rincian item barang spesifik pada pengajuan ini.
                            </div>
                          ) : (
                            <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                                <thead>
                                  <tr style={{ background: 'rgba(15, 23, 42, 0.7)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                                    <th style={{ padding: '0.6rem 0.75rem', width: '45px', textAlign: 'center' }}>NO</th>
                                    <th style={{ padding: '0.6rem 0.75rem' }}>NAMA BARANG & SPESIFIKASI</th>
                                    <th style={{ padding: '0.6rem 0.75rem', width: '130px' }}>JUMLAH</th>
                                    <th style={{ padding: '0.6rem 0.75rem' }}>KETERANGAN / KEPERLUAN</th>
                                    <th style={{ padding: '0.6rem 0.75rem', width: '150px', textAlign: 'center' }}>STATUS DI KAPAL</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {reqItems.map((it, idx) => (
                                    <tr
                                      key={it.id || idx}
                                      style={{
                                        borderBottom: idx < reqItems.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                                        background: it.received ? 'rgba(16, 185, 129, 0.05)' : 'transparent'
                                      }}
                                    >
                                      <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)' }}>
                                        {idx + 1}
                                      </td>
                                      <td style={{ padding: '0.6rem 0.75rem' }}>
                                        <strong style={{ color: it.received ? 'var(--text-muted)' : '#f8fafc', textDecoration: it.received ? 'line-through' : 'none' }}>
                                          {it.name}
                                        </strong>
                                      </td>
                                      <td style={{ padding: '0.6rem 0.75rem' }}>
                                        <span className="badge badge-info" style={{ fontWeight: 700 }}>
                                          {it.qty} {it.unit}
                                        </span>
                                      </td>
                                      <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)' }}>
                                        {it.notes || '-'}
                                      </td>
                                      <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>
                                        <button
                                          type="button"
                                          onClick={() => toggleChecklist(wo.id, it.id)}
                                          style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            padding: '0.25rem 0.55rem',
                                            borderRadius: '6px',
                                            fontSize: '0.72rem',
                                            cursor: 'pointer',
                                            background: it.received ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-surface-elevated)',
                                            border: it.received ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                                            color: it.received ? '#10b981' : 'var(--text-muted)'
                                          }}
                                        >
                                          {it.received ? <CheckSquare size={13} /> : <Square size={13} />}
                                          <span>{it.received ? 'Diterima ✓' : 'Belum Tiba'}</span>
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>

                        {/* Footer: 3-Way Signature Verification */}
                        <div style={{
                          marginTop: '1rem',
                          paddingTop: '0.85rem',
                          borderTop: '1px dashed var(--border-subtle)',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '0.75rem',
                          fontSize: '0.75rem'
                        }}>
                          <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>✍️ Pemohon / PIC:</div>
                            <strong style={{ color: '#38bdf8' }}>{wo.pic || wo.assignedTo}</strong>
                            <div style={{ fontSize: '0.68rem', color: '#10b981', marginTop: '0.15rem' }}>✓ Telah Diajukan</div>
                          </div>

                          <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '6px', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>⚓ Mengetahui (Nakhoda):</div>
                            <strong style={{ color: '#818cf8' }}>{wo.captain || wo.supervisor || currentShip.masterCaptain || 'Capt. Hendra Gunawan, M.Mar'}</strong>
                            <div style={{ fontSize: '0.68rem', color: '#10b981', marginTop: '0.15rem' }}>✓ Disetujui & Distempel Kapal</div>
                          </div>

                          <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>🏢 Logistik Gudang PBK:</div>
                            <strong style={{ color: '#10b981' }}>Gudang Logistik Pontianak (Shore Base PBK)</strong>
                            <div style={{ fontSize: '0.68rem', color: ['Completed', 'Diterima di Kapal (Selesai)', 'Diterima di Kapal'].includes(wo.status) ? '#10b981' : '#f59e0b', marginTop: '0.15rem' }}>
                              {['Completed', 'Diterima di Kapal (Selesai)', 'Diterima di Kapal'].includes(wo.status) ? '✓ Selesai & Diterima di Kapal' : '⏳ Dalam Proses Gudang'}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
};
