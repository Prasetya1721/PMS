/**
 * MasterDataTabVessels.jsx
 * Diekstrak dari MasterDataAdmin.jsx (baris 1128-1439).
 * Sumber: Tab 2: master data kapal
 */
import React from 'react';
import { Download, Edit2, Plus, Search, Trash2 } from 'lucide-react';
import { usePMS } from '../../../context/PMSContext';

export const MasterDataTabVessels = ({
  auditReport,
  deleteMasterPort,
  deleteMasterVesselType,
  deleteVessel,
  deletingVesselId,
  exportToCSV,
  filteredVessels,
  portLocations,
  setDeletingVesselId,
  setEditingVessel,
  setSelectedParticularVessel,
  setShowParticularsModal,
  setShowVesselModal,
  setVesselFormData,
  setVesselOwnershipFilter,
  setVesselSearch,
  vesselOwnershipFilter,
  vesselSearch,
  vesselTypes,
  vessels,
}) => {
  // Dialog konfirmasi in-app (pengganti window.confirm) — infrastruktur aplikasi,
  // bukan data yang dioper induk, jadi diambil dari context dan tidak lewat props.
  const confirm = usePMS().confirm;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Master Data Armada Kapal ({vessels.length} Kapal)</h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Daftar lengkap kapal milik ({auditReport.ownerVessels} As Owner){auditReport.operatorVessels > 0 ? ` dan ${auditReport.operatorVessels} kapal operasional (As Operator)` : ''}.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      exportToCSV('master_kapal_baharimas', ['ID', 'Nama Kapal', 'Kepemilikan', 'Tipe', 'No. Registrasi', 'Nomor IMO', 'Call Sign', 'GT', 'DWT', 'Galangan', 'Tahun', 'Status'],
                        filteredVessels.map(v => [v.id, v.name, v.ownershipStatus || 'As Owner', v.type, v.regNo || '-', v.imo || '-', v.callSign || '-', v.gt, v.dwt, v.builder, v.yearBuilt, v.status])
                      );
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    <Download size={14} />
                    <span>Ekspor CSV</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingVessel(null);
                      setVesselFormData({
                        name: '',
                        type: '',
                        ownershipStatus: 'As Owner',
                        regNo: '',
                        imo: '',
                        callSign: '',
                        gt: '',
                        dwt: '',
                        portOfRegistry: '',
                        builder: '',
                        yearBuilt: new Date().getFullYear(),
                        status: 'Operasional (Berlayar)'
                      });
                      setShowVesselModal(true);
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus size={14} />
                    <span>Tambah Kapal Baru</span>
                  </button>
                </div>
              </div>

              {/* Search & Ownership Filter */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Cari nama kapal, No. Reg BKI, Call Sign..."
                    value={vesselSearch}
                    onChange={(e) => setVesselSearch(e.target.value)}
                    className="input-control"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {['ALL', 'Owner', 'Operator'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setVesselOwnershipFilter(opt)}
                      className={`btn btn-sm ${vesselOwnershipFilter === opt ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '0.78rem' }}
                    >
                      {opt === 'ALL' ? 'Semua Armada' : opt === 'Owner' ? `⚓ As Owner (${auditReport.ownerVessels})` : `⚙️ As Operator (${auditReport.operatorVessels})`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vessels Table */}
              <div className="glass-card" style={{ overflow: 'hidden' }}>
                <div className="table-container">
                  <table className="pms-table">
                    <thead>
                      <tr>
                        <th>Nama Kapal</th>
                        <th>Status Kepemilikan</th>
                        <th>Tipe / Jenis Kapal</th>
                        <th>No. Registrasi</th>
                        <th>Nomor IMO</th>
                        <th>Call Sign</th>
                        <th>Gross Tonnage</th>
                        <th>Status Operasional</th>
                        <th style={{ textAlign: 'right' }}>Aksi Admin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVessels.map(v => (
                        <tr key={v.id}>
                          <td>
                            <strong style={{ fontSize: '0.92rem' }}>{v.name}</strong>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {v.builder} ({v.yearBuilt})
                            </div>
                          </td>
                          <td>
                            <span
                              className="badge"
                              style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                background: v.ownershipStatus === 'As Operator' ? 'rgba(2, 132, 199, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                color: v.ownershipStatus === 'As Operator' ? '#38bdf8' : '#10b981',
                                border: `1px solid ${v.ownershipStatus === 'As Operator' ? 'rgba(2, 132, 199, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`
                              }}
                            >
                              {v.ownershipStatus === 'As Operator' ? '⚙️ As Operator' : '⚓ As Owner'}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.825rem' }}>{v.type}</td>
                          <td className="mono" style={{ fontSize: '0.8rem' }}>{v.regNo || '-'}</td>
                          <td className="mono" style={{ fontSize: '0.8rem' }}>{v.imo || '-'}</td>
                          <td className="mono" style={{ fontSize: '0.8rem' }}>{v.callSign || '-'}</td>
                          <td className="mono" style={{ fontSize: '0.825rem' }}>{v.gt} GT</td>
                          <td>
                            <span className={`badge ${v.status?.includes('Operasional') ? 'badge-success' : 'badge-warning'}`}>
                              {v.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                              <button
                                onClick={() => {
                                  setSelectedParticularVessel(v);
                                  setShowParticularsModal(true);
                                }}
                                className="btn btn-secondary btn-sm"
                                title="Buka / Edit Data Particulars Lengkap"
                                style={{ padding: '0.35rem 0.55rem', color: '#38bdf8' }}
                              >
                                <span>Particulars</span>
                              </button>
                              <button
                                onClick={() => {
                                  setEditingVessel(v);
                                  setVesselFormData({
                                    name: v.name,
                                    type: v.type,
                                    ownershipStatus: v.ownershipStatus || 'As Owner',
                                    regNo: v.regNo || '',
                                    imo: v.imo || '',
                                    callSign: v.callSign || '',
                                    gt: v.gt || 310,
                                    dwt: v.dwt || 450,
                                    portOfRegistry: v.portOfRegistry || 'Pontianak',
                                    builder: v.builder || '',
                                    yearBuilt: v.yearBuilt || 2022,
                                    status: v.status || 'Operasional (Berlayar)'
                                  });
                                  setShowVesselModal(true);
                                }}
                                className="btn btn-secondary btn-sm"
                                title="Edit Data Pokok Kapal"
                                style={{ padding: '0.35rem 0.55rem' }}
                              >
                                <Edit2 size={13} />
                              </button>
                              {deletingVesselId === v.id ? (
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteVessel(v.id);
                                      setDeletingVesselId(null);
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
                                      setDeletingVesselId(null);
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
                                    setDeletingVesselId(v.id);
                                  }}
                                  className="btn btn-secondary btn-sm"
                                  title="Hapus Kapal"
                                  style={{ padding: '0.35rem 0.55rem', color: '#ef4444' }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Master Reference Badges: Tipe Kapal & Pelabuhan Pendaftaran */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.25rem' }}>
                <div className="glass-card" style={{ padding: '1.15rem 1.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span>🏷️ Master Tipe / Jenis Kapal</span>
                        <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>{vesselTypes.length} Tipe</span>
                      </h4>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        Otomatis bertambah saat Anda mengetik tipe baru dan menyimpannya.
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {vesselTypes.map(t => (
                      <span
                        key={t}
                        className="badge"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.72rem',
                          padding: '0.25rem 0.6rem',
                          background: 'rgba(56, 189, 248, 0.12)',
                          border: '1px solid rgba(56, 189, 248, 0.35)',
                          color: '#38bdf8'
                        }}
                      >
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={async () => {
                            const lanjut = await confirm({
                              variant: 'danger',
                              title: 'Hapus Tipe Kapal',
                              subtitle: 'Hapus dari master data',
                              message: `Hapus tipe kapal "${t}" dari master data?`
                            });
                            if (lanjut) deleteMasterVesselType(t);
                          }}
                          style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: '0.85rem' }}
                          title="Hapus dari master data"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '1.15rem 1.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span>⚓ Master Pelabuhan Pendaftaran</span>
                        <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>{portLocations.length} Kota</span>
                      </h4>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        Otomatis bertambah saat Anda mengetik pelabuhan baru dan menyimpannya.
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {portLocations.map(p => (
                      <span
                        key={p}
                        className="badge"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.72rem',
                          padding: '0.25rem 0.6rem',
                          background: 'rgba(16, 185, 129, 0.12)',
                          border: '1px solid rgba(16, 185, 129, 0.35)',
                          color: '#10b981'
                        }}
                      >
                        <span>{p}</span>
                        <button
                          type="button"
                          onClick={async () => {
                            const lanjut = await confirm({
                              variant: 'danger',
                              title: 'Hapus Pelabuhan',
                              subtitle: 'Hapus dari master data',
                              message: `Hapus pelabuhan "${p}" dari master data?`
                            });
                            if (lanjut) deleteMasterPort(p);
                          }}
                          style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: '0.85rem' }}
                          title="Hapus dari master data"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
  );
};
