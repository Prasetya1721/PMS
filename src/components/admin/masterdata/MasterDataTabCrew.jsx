/**
 * MasterDataTabCrew.jsx
 * Diekstrak dari MasterDataAdmin.jsx (baris 1444-1660).
 * Sumber: Tab 3: master data crew
 */
import React from 'react';
import { Download, Edit2, Plus, Search, Trash2 } from 'lucide-react';

export const MasterDataTabCrew = ({
  allCrewList,
  crewDeptFilter,
  crewSearch,
  crewVesselFilter,
  deleteCrew,
  deletingCrewId,
  exportToCSV,
  filteredCrew,
  setCrewDeptFilter,
  setCrewFormData,
  setCrewSearch,
  setCrewVesselFilter,
  setDeletingCrewId,
  setEditingCrew,
  setShowCrewModal,
  vessels,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Master Data Awak Kapal (Crew Roster)</h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Pusat data pelaut, perwira, teknisi, buku pelaut, dan kontak seluruh awak kapal armada Baharimas.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      exportToCSV('master_crew_baharimas', ['ID', 'Nama', 'Jabatan', 'Departemen', 'Kapal', 'Buku Pelaut', 'HP', 'Status'],
                        filteredCrew.map(c => [c.id, c.name, c.rank, c.department, vessels.find(v => v.id === c.vesselId)?.name || c.vesselId, c.seamanBookNo, c.phone || c.whatsapp, c.status])
                      );
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    <Download size={14} />
                    <span>Ekspor CSV</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingCrew(null);
                      setCrewFormData({
                        name: '',
                        vesselId: vessels[0]?.id || 'v-001',
                        rank: 'Juru Mudi / ABK',
                        department: 'Deck',
                        seamanBookNo: '',
                        phone: '081288990011',
                        whatsapp: '+6281288990011',
                        status: 'Onboard',
                        contractDurationMonths: 8,
                        leaveBalanceDays: 14
                      });
                      setShowCrewModal(true);
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus size={14} />
                    <span>Tambah Crew Baru</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Cari nama kru, jabatan, no buku pelaut..."
                    value={crewSearch}
                    onChange={(e) => setCrewSearch(e.target.value)}
                    className="input-control"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>

                <select
                  value={crewVesselFilter}
                  onChange={(e) => setCrewVesselFilter(e.target.value)}
                  className="select-control"
                  style={{ width: '220px' }}
                >
                  <option value="ALL">Semua Kapal ({allCrewList.length} Kru)</option>
                  {vessels.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>

                <select
                  value={crewDeptFilter}
                  onChange={(e) => setCrewDeptFilter(e.target.value)}
                  className="select-control"
                  style={{ width: '150px' }}
                >
                  <option value="ALL">Semua Dept</option>
                  <option value="Deck">Deck</option>
                  <option value="Engine">Engine</option>
                </select>
              </div>

              {/* Crew Table */}
              <div className="glass-card" style={{ overflow: 'hidden' }}>
                <div className="table-container">
                  <table className="pms-table">
                    <thead>
                      <tr>
                        <th>Nama Awak Kapal</th>
                        <th>Jabatan / Rank</th>
                        <th>Kapal Penugasan</th>
                        <th>Departemen</th>
                        <th>No. Buku Pelaut</th>
                        <th>Kontak WhatsApp / HP</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Aksi Admin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCrew.map(c => {
                        const ship = vessels.find(v => v.id === c.vesselId);
                        return (
                          <tr key={c.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                {c.photo ? (
                                  <img src={c.photo} alt={c.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                                    {c.name.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <strong style={{ fontSize: '0.92rem' }}>{c.name}</strong>
                                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: {c.id}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>{c.rank}</span>
                            </td>
                            <td>
                              <strong>{ship?.name || c.vesselId}</strong>
                            </td>
                            <td>
                              <span className={`badge ${c.department === 'Deck' ? 'badge-neutral' : 'badge-warning'}`}>
                                {c.department}
                              </span>
                            </td>
                            <td className="mono" style={{ fontSize: '0.8rem' }}>{c.seamanBookNo || '-'}</td>
                            <td className="mono" style={{ fontSize: '0.8rem' }}>{c.whatsapp || c.phone || '-'}</td>
                            <td>
                              <span className={`badge ${c.status === 'Onboard' ? 'badge-success' : 'badge-warning'}`}>
                                {c.status}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                                <button
                                  onClick={() => {
                                    setEditingCrew(c);
                                    setCrewFormData({
                                      name: c.name,
                                      vesselId: c.vesselId,
                                      rank: c.rank,
                                      department: c.department,
                                      seamanBookNo: c.seamanBookNo || '',
                                      phone: c.phone || '',
                                      whatsapp: c.whatsapp || '',
                                      status: c.status || 'Onboard',
                                      contractDurationMonths: c.contractDurationMonths || 8,
                                      leaveBalanceDays: c.leaveBalanceDays || 14
                                    });
                                    setShowCrewModal(true);
                                  }}
                                  className="btn btn-secondary btn-sm"
                                  title="Edit Kru"
                                  style={{ padding: '0.35rem 0.55rem' }}
                                >
                                  <Edit2 size={13} />
                                </button>
                                {deletingCrewId === c.id ? (
                                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteCrew(c.id);
                                        setDeletingCrewId(null);
                                      }}
                                      className="btn btn-danger btn-sm"
                                      style={{ padding: '0.25rem 0.45rem', fontSize: '0.7rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}
                                      title="Konfirmasi Hapus"
                                    >
                                      Yakin?
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeletingCrewId(null);
                                      }}
                                      className="btn btn-secondary btn-sm"
                                      style={{ padding: '0.25rem 0.4rem', fontSize: '0.7rem', borderRadius: '4px', cursor: 'pointer' }}
                                      title="Batal"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeletingCrewId(c.id);
                                    }}
                                    className="btn btn-secondary btn-sm"
                                    title="Hapus Kru"
                                    style={{ padding: '0.35rem 0.55rem', color: '#ef4444' }}
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                )}
                              </div>
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
