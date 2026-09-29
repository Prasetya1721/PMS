/**
 * SmcSessionCrewColumn.jsx
 * Diekstrak dari SmcSessionModal.jsx (baris 609-745).
 * Sumber: Kolom 2: personil audit onboard & jadwal
 */
import React from 'react';
import { Calendar, Users } from 'lucide-react';

export const SmcSessionCrewColumn = ({
  auditDate,
  auditLocation,
  auditTeam,
  auditee,
  currentSelectedVessel,
  leadAuditor,
  scope,
  setAuditDate,
  setAuditLocation,
  setAuditTeam,
  setAuditee,
  setLeadAuditor,
  setScope,
  setTargetCloseDate,
  targetCloseDate,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="glass-card" style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Users size={15} color="#f59e0b" />
                      <span>3. Personil Tim Auditor & Nakhoda Kapal</span>
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.65rem' }}>
                      <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                        Lead Auditor (Auditor Kepala) <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={leadAuditor}
                        onChange={(e) => setLeadAuditor(e.target.value)}
                        placeholder="Nama Lead Auditor resmi"
                        className="form-control"
                        style={{ fontSize: '0.8rem' }}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.65rem' }}>
                      <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                        Tim Auditor Pendamping
                      </label>
                      <input
                        type="text"
                        value={auditTeam}
                        onChange={(e) => setAuditTeam(e.target.value)}
                        placeholder="Pisahkan dengan koma jika lebih dari satu"
                        className="form-control"
                        style={{ fontSize: '0.8rem' }}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.65rem' }}>
                      <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                        Auditee (Nakhoda / Chief Engineer yang Diaudit) <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={auditee}
                        onChange={(e) => setAuditee(e.target.value)}
                        placeholder="Contoh: Capt. Ekhsan (Nakhoda) & KKM"
                        className="form-control"
                        style={{ fontSize: '0.8rem' }}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                        Lokasi Fisik Audit Kapal <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={auditLocation}
                        onChange={(e) => setAuditLocation(e.target.value)}
                        placeholder="Contoh: Onboard TB. RP 2004 (Dermaga Pontianak)"
                        className="form-control"
                        style={{ fontSize: '0.8rem' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Jadwal & Ruang Lingkup SMC */}
                  <div className="glass-card" style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={15} color="#6366f1" />
                      <span>4. Jadwal & Ruang Lingkup Audit SMC</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '0.75rem' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                          Tanggal Audit <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="date"
                          value={auditDate}
                          onChange={(e) => setAuditDate(e.target.value)}
                          className="form-control"
                          style={{ fontSize: '0.8rem' }}
                          required
                        />
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                          Target Due Date (Batas CAPA) <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="date"
                          value={targetCloseDate}
                          onChange={(e) => setTargetCloseDate(e.target.value)}
                          className="form-control"
                          style={{ fontSize: '0.8rem' }}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <label className="form-label" style={{ fontSize: '0.74rem', fontWeight: 700, margin: 0 }}>
                          Ruang Lingkup Pemeriksaan Kapal (Audit Scope)
                        </label>
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                          <button
                            type="button"
                            onClick={() => setScope(`Audit Kelaikan Pembaruan Sistem Manajemen Keselamatan (SMC) Kapal ${currentSelectedVessel?.name || 'Kapal'} Onboard sesuai IMO Res. A.741(18) dan BKI SMS Shipboard Checklist Rev 05 (74 Klausul).`)}
                            style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}
                          >
                            Pembaruan
                          </button>
                          <button
                            type="button"
                            onClick={() => setScope(`Audit Antara (Interim SMC) Sistem Manajemen Keselamatan Kapal ${currentSelectedVessel?.name || 'Kapal'} Onboard sesuai ISM Code klausul 1 s.d. 12.`)}
                            style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}
                          >
                            Antara
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={scope}
                        onChange={(e) => setScope(e.target.value)}
                        rows={2}
                        className="form-control"
                        style={{ fontSize: '0.78rem', resize: 'vertical' }}
                        required
                      />
                    </div>
                  </div>
                </div>
  );
};
