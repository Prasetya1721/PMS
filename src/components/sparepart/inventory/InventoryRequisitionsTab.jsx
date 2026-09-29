/**
 * InventoryRequisitionsTab.jsx
 * Diekstrak dari InventoryList.jsx (baris 476-686).
 * Sumber: Tab Permintaan & Persetujuan: daftar permintaan beserta tombol persetujuan berjenjang
 */
import React from 'react';
import { Check, CheckCircle, Plus, Ship, Truck, Users } from 'lucide-react';

export const InventoryRequisitionsTab = ({
  canAction,
  currentRole,
  currentUser,
  formatIDR,
  receiveRequisitionItems,
  requisitions,
  setShowCreateSPBKModal,
  setSpbkForm,
  spareparts,
  updateRequisitionStatus,
}) => {
  return (
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
  );
};
