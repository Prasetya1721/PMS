/**
 * EquipListTable.jsx
 * Diekstrak dari EquipmentList.jsx (baris 308-499).
 * Sumber: Tabel daftar mesin beserta running hours, interval servis, dan aksi
 */
import React from 'react';
import { AlertCircle, Clock, Edit2, Plus, Trash2 } from 'lucide-react';

export const EquipListTable = ({
  filtered,
  handleDelete,
  setEditingEquipment,
  setIsFormModalOpen,
  setSelectedEqForHours,
  vessels,
}) => {
  return (
    <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div className="table-container">
              <table className="pms-table">
                <thead>
                  <tr>
                    <th>Kode & Nama Equipment</th>
                    <th>Kapal Armada</th>
                    <th>Kategori & Lokasi</th>
                    <th>Maker & Model</th>
                    <th>Jam Operasi (Running Hours)</th>
                    <th>Kritikalitas</th>
                    <th>Status Servis</th>
                    <th style={{ textAlign: 'right', minWidth: '150px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                          <AlertCircle size={36} color="var(--text-muted)" />
                          <div style={{ fontSize: '1rem', fontWeight: 700 }}>Tidak ada equipment yang sesuai filter</div>
                          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                            Coba ubah kata kunci pencarian atau daftarkan mesin baru.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingEquipment(null);
                              setIsFormModalOpen(true);
                            }}
                            className="btn btn-primary btn-sm"
                            style={{ marginTop: '0.5rem' }}
                          >
                            <Plus size={14} />
                            <span>Tambah Equipment Baru</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map(eq => {
                      const vessel = vessels.find(v => v.id === eq.vesselId);
                      const vesselName = vessel?.name || '-';
                      const hoursLeft = eq.nextServiceHours - eq.runningHours;
                      const percentageUsed = eq.nextServiceHours > 0
                        ? Math.min(100, Math.max(0, Math.round((eq.runningHours / eq.nextServiceHours) * 100)))
                        : 0;

                      return (
                        <tr key={eq.id}>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span className="mono" style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>
                                {eq.code}
                              </span>
                              <strong style={{ fontSize: '0.92rem', marginTop: '0.1rem' }}>{eq.name}</strong>
                              {eq.subComponents && eq.subComponents.length > 0 && (
                                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                                  {eq.subComponents.slice(0, 3).map((sub, idx) => (
                                    <span
                                      key={idx}
                                      style={{
                                        fontSize: '0.68rem',
                                        padding: '0.1rem 0.4rem',
                                        borderRadius: '4px',
                                        background: 'rgba(255,255,255,0.06)',
                                        color: 'var(--text-muted)'
                                      }}
                                    >
                                      {sub}
                                    </span>
                                  ))}
                                  {eq.subComponents.length > 3 && (
                                    <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)' }}>
                                      +{eq.subComponents.length - 3} lagi
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                          <td style={{ fontSize: '0.85rem' }}>
                            <div style={{ fontWeight: 600 }}>{vesselName}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{vessel?.type || 'Armada'}</div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>{eq.category}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{eq.location}</div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>{eq.maker || '-'}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{eq.model || '-'}</div>
                            {eq.serialNumber && eq.serialNumber !== '-' && (
                              <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                                S/N: {eq.serialNumber}
                              </div>
                            )}
                          </td>
                          <td style={{ minWidth: '200px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                              <span className="mono" style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                                {eq.runningHours.toLocaleString()} Jam
                              </span>
                              <span className="mono" style={{ color: 'var(--text-muted)' }}>
                                Target: {eq.nextServiceHours.toLocaleString()} Jam
                              </span>
                            </div>
                            <div className="progress-bar-container">
                              <div
                                className={`progress-bar-fill ${
                                  eq.status === 'Overdue' ? 'progress-red' :
                                  eq.status === 'Due Soon' ? 'progress-amber' : 'progress-blue'
                                }`}
                                style={{ width: `${percentageUsed}%` }}
                              />
                            </div>
                            <div style={{ fontSize: '0.72rem', marginTop: '0.3rem', color: hoursLeft <= 0 ? '#ef4444' : hoursLeft <= 200 ? '#f59e0b' : 'var(--text-muted)', fontWeight: 600 }}>
                              {hoursLeft <= 0 ? `🚨 Overdue ${Math.abs(hoursLeft)} Jam!` : `⏳ Tersisa ${hoursLeft} Jam`}
                            </div>
                          </td>
                          <td>
                            <span
                              className="badge"
                              style={{
                                fontSize: '0.7rem',
                                background:
                                  eq.criticality === 'Kritis' ? 'rgba(239, 68, 68, 0.15)' :
                                  eq.criticality === 'Tinggi' ? 'rgba(245, 158, 11, 0.15)' :
                                  'rgba(56, 189, 248, 0.15)',
                                color:
                                  eq.criticality === 'Kritis' ? '#ef4444' :
                                  eq.criticality === 'Tinggi' ? '#f59e0b' :
                                  '#38bdf8'
                              }}
                            >
                              {eq.criticality || 'Normal'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${
                              eq.status === 'Overdue' ? 'badge-danger-pulse' :
                              eq.status === 'Due Soon' ? 'badge-warning' : 'badge-success'
                            }`}>
                              {eq.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                              <button
                                type="button"
                                onClick={() => setSelectedEqForHours(eq)}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                                title="Log jam kerja mesin harian"
                              >
                                <Clock size={13} />
                                <span>Log Jam</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingEquipment(eq);
                                  setIsFormModalOpen(true);
                                }}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.35rem 0.5rem', color: '#38bdf8' }}
                                title="Edit data teknis & spesifikasi mesin"
                              >
                                <Edit2 size={13} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(eq)}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.35rem 0.5rem', color: '#ef4444' }}
                                title="Hapus equipment"
                              >
                                <Trash2 size={13} />
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
  );
};
