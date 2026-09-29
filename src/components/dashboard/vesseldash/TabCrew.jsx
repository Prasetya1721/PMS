/**
 * TabCrew.jsx
 * Diekstrak dari VesselDashboard.jsx (baris 820-919).
 * Sumber: SUB-TAB 3: awak kapal (crew roster)
 */
import React from 'react';
import { Plus, Send } from 'lucide-react';

export const TabCrew = ({
  currentShip,
  setShowAddCrewModal,
  shipCrew,
  shipCrewCerts,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                    Susunan Kru & Perwira Kapal: {currentShip.name}
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Roster resmi personel yang bertugas onboard, data buku pelaut, masa kontrak, dan sertifikat kompetensi STCW
                  </p>
                </div>

                <button onClick={() => setShowAddCrewModal(true)} className="btn btn-primary btn-sm">
                  <Plus size={14} />
                  <span>Tambah Kru ke Kapal Ini</span>
                </button>
              </div>

              <div className="glass-card" style={{ overflow: 'hidden' }}>
                <div className="table-container">
                  <table className="pms-table">
                    <thead>
                      <tr>
                        <th>Foto & Nama Awak</th>
                        <th>Jabatan (Rank)</th>
                        <th>Departemen</th>
                        <th>Nomor Buku Pelaut</th>
                        <th>Sign On / Sign Off</th>
                        <th>Sisa Cuti</th>
                        <th>Status Tugas</th>
                        <th style={{ textAlign: 'right' }}>Kontak & WhatsApp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shipCrew.map(c => {
                        const cCert = shipCrewCerts.find(cert => cert.crewId === c.id);
                        return (
                          <tr key={c.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <img
                                  src={c.photo}
                                  alt={c.name}
                                  style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(56, 189, 248, 0.3)' }}
                                />
                                <div>
                                  <strong style={{ fontSize: '0.92rem' }}>{c.name}</strong>
                                  {cCert && (
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                                      {cCert.name}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                                {c.rank}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: '0.825rem', fontWeight: 600, color: c.department === 'Deck' ? '#38bdf8' : '#fb923c' }}>
                                {c.department}
                              </span>
                            </td>
                            <td className="mono" style={{ fontSize: '0.8rem' }}>{c.seamanBookNo}</td>
                            <td style={{ fontSize: '0.8rem' }}>
                              <div>On: <strong className="mono">{c.signOnDate}</strong></div>
                              <div style={{ color: 'var(--text-muted)' }}>Off: <strong className="mono">{c.signOffPlanDate}</strong></div>
                            </td>
                            <td className="mono" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                              {c.leaveBalanceDays} Hari
                            </td>
                            <td>
                              <span className={`badge ${c.status === 'Onboard' ? 'badge-success' : 'badge-warning'}`}>
                                {c.status}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                onClick={() => {
                                  const msg = `*PEMBERITAHUAN PMS KAPAL - ${currentShip.name}*\n\nYth. *${c.name}* (${c.rank}),\nHarap koordinasikan agenda perawatan rutin dan dokumen kelaiklautan kapal.\n\n_Admin Armada PT. Pelayaran Baharimas Kalimantan_`;
                                  window.open(`https://wa.me/${c.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                                }}
                                className="btn btn-whatsapp btn-sm"
                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                              >
                                <Send size={13} />
                                <span>WhatsApp</span>
                              </button>
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
