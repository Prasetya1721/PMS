/**
 * CrewListTab.jsx
 * Diekstrak dari CrewManager.jsx (baris 174-242).
 * Sumber: Tab Daftar Awak: tabel nama,ranks, penempatan, buku pelaut, dan masa berlaku sertifikat
 */
import React from 'react';
import { Phone } from 'lucide-react';

export const CrewListTab = ({
  crew,
  vessels,
}) => {
  return (
    <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div className="table-container">
                <table className="pms-table">
                  <thead>
                    <tr>
                      <th>Nama & Jabatan (Rank)</th>
                      <th>Kapal Penempatan</th>
                      <th>Buku Pelaut (Seaman Book)</th>
                      <th>Kontrak & Sign-On</th>
                      <th>Sisa Cuti</th>
                      <th>Status Onboard</th>
                      <th style={{ textAlign: 'right' }}>Kontak WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crew.map(c => {
                      const shipName = vessels.find(v => v.id === c.vesselId)?.name || '-';
                      return (
                        <tr key={c.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <img
                                src={c.photo}
                                alt={c.name}
                                style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                              />
                              <div>
                                <div style={{ fontWeight: 700 }}>{c.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>{c.rank} • {c.department}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>{shipName}</td>
                          <td className="mono" style={{ fontSize: '0.8rem' }}>{c.seamanBookNo}</td>
                          <td>
                            <div style={{ fontSize: '0.8rem' }}>Sign-On: <strong className="mono">{c.signOnDate}</strong></div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rencana Off: {c.signOffPlanDate}</div>
                          </td>
                          <td>
                            <span className="mono" style={{ fontWeight: 700, color: '#10b981' }}>
                              {c.leaveBalanceDays} Hari
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${c.status === 'Onboard' ? 'badge-success' : 'badge-neutral'}`}>
                              {c.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <a
                              href={`https://wa.me/${c.whatsapp.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-whatsapp btn-sm"
                              style={{ textDecoration: 'none', display: 'inline-flex' }}
                            >
                              <Phone size={13} />
                              <span>{c.phone}</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
  );
};
