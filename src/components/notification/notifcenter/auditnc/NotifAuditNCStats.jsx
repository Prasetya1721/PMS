/**
 * NotifAuditNCStats.jsx
 * Diekstrak dari NotifTabAuditNC.jsx (baris 31-131).
 * Sumber: Empat kartu statistik temuan audit: total, open, closed, dan menunggu verifikasi
 */
import React from 'react';
import { CheckCircle2, Clock, FileCheck, ShieldAlert } from 'lucide-react';

export const NotifAuditNCStats = ({
  allFindings,
  auditFleetStats,
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div
                      className="glass-card"
                      style={{
                        padding: '1rem 1.25rem',
                        borderLeft: '4px solid #0284c7',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(2, 132, 199, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
                        <FileCheck size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Temuan Audit ISM</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{allFindings.length}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>SMC Kapal & DOC Kantor</div>
                      </div>
                    </div>

                    <div
                      className="glass-card"
                      style={{
                        padding: '1rem 1.25rem',
                        borderLeft: '4px solid #ef4444',
                        background: auditFleetStats.overdueCount > 0 ? 'rgba(239, 68, 68, 0.08)' : undefined,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                        <ShieldAlert size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NC OPEN (Tindakan Diperlukan)</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444' }}>
                          {auditFleetStats.openCount}
                          {auditFleetStats.overdueCount > 0 && (
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, marginLeft: '0.4rem', color: '#ef4444' }}>
                              ({auditFleetStats.overdueCount} Overdue!)
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {auditFleetStats.minDaysLeft !== null
                            ? auditFleetStats.minDaysLeft < 0
                              ? `🚨 Overdue ${Math.abs(auditFleetStats.minDaysLeft)} hari`
                              : `⏳ Deadline terdekat: ${auditFleetStats.minDaysLeft} hari`
                            : 'Tidak ada NC open aktif'}
                        </div>
                      </div>
                    </div>

                    <div
                      className="glass-card"
                      style={{
                        padding: '1rem 1.25rem',
                        borderLeft: '4px solid #f59e0b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                        <Clock size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Eviden Terkirim (Review)</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>
                          {allFindings.filter(f => f.status === 'Eviden Submitted').length}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Menunggu Verifikasi DPA</div>
                      </div>
                    </div>

                    <div
                      className="glass-card"
                      style={{
                        padding: '1rem 1.25rem',
                        borderLeft: '4px solid #10b981',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                        <CheckCircle2 size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NC CLOSE (Terselesaikan)</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
                          {auditFleetStats.closedCount}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
                          ⏱️ Rata-rata Rentang: {auditFleetStats.avgResolutionDays} Hari
                        </div>
                      </div>
                    </div>
                  </div>
  );
};
