/**
 * CrewLeavesTab.jsx
 * Diekstrak dari CrewManager.jsx (baris 245-343).
 * Sumber: Tab Pengajuan Cuti: daftar cuti dengan approval berjenjang
 */
import React from 'react';
import { CheckCircle, Plus, XCircle } from 'lucide-react';

export const CrewLeavesTab = ({
  approveLeave,
  canAction,
  leaves,
  setShowLeaveModal,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowLeaveModal(true)} className="btn btn-primary">
                  <Plus size={16} />
                  <span>Ajukan Cuti Kru Baru</span>
                </button>
              </div>

              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
                  Daftar Permohonan Cuti & Alur Persetujuan
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {leaves.map(l => {
                    const isPending = l.status.includes('Pending');
                    return (
                      <div
                        key={l.id}
                        style={{
                          padding: '1.1rem',
                          borderRadius: '8px',
                          background: 'var(--bg-surface-elevated)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '1rem'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span className="mono" style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8' }}>{l.id}</span>
                            <span className="badge badge-info">{l.leaveType}</span>
                            <span className={`badge ${
                              l.status === 'Approved Fleet' ? 'badge-success' :
                              l.status === 'Rejected' ? 'badge-danger' : 'badge-warning'
                            }`}>
                              {l.status}
                            </span>
                          </div>
                          <h5 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.35rem' }}>{l.crewName}</h5>
                          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                            Periode: <strong className="mono">{l.startDate}</strong> s/d <strong className="mono">{l.endDate}</strong> ({l.daysRequested} hari)
                          </p>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                            Pengganti: {l.replacementCrew} • Alasan: {l.notes}
                          </p>
                        </div>

                        {/* Approval Buttons or Status indicator */}
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          {canAction('approve_leave') ? (
                            <>
                              {l.status === 'Pending Ship Admin' && (
                                <button
                                  onClick={() => approveLeave(l.id, 'Approved Ship Admin')}
                                  className="btn btn-secondary btn-sm"
                                >
                                  <CheckCircle size={14} color="#38bdf8" />
                                  <span>Approve Nakhoda</span>
                                </button>
                              )}
                              {(l.status === 'Approved Ship Admin' || l.status === 'Pending Ship Admin') && (
                                <button
                                  onClick={() => approveLeave(l.id, 'Approved Fleet')}
                                  className="btn btn-success btn-sm"
                                >
                                  <CheckCircle size={14} />
                                  <span>Approve Fleet Manager</span>
                                </button>
                              )}
                              {isPending && (
                                <button
                                  onClick={() => approveLeave(l.id, 'Rejected')}
                                  className="btn btn-danger btn-sm"
                                >
                                  <XCircle size={14} />
                                  <span>Tolak</span>
                                </button>
                              )}
                            </>
                          ) : (
                            isPending && (
                              <span className="badge badge-warning" style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
                                Menunggu Otorisasi Atasan
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
  );
};
