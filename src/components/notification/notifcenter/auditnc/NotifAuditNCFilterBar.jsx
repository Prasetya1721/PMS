/**
 * NotifAuditNCFilterBar.jsx
 * Diekstrak dari NotifTabAuditNC.jsx (baris 134-243).
 * Sumber: Bar filter status NC, kapal, standar, dan pencarian temuan
 */
import React from 'react';
import { Search, X } from 'lucide-react';

export const NotifAuditNCFilterBar = ({
  allFindings,
  auditFilterStatus,
  auditFleetStats,
  auditSearchQuery,
  auditVesselFilter,
  setAuditFilterStatus,
  setAuditSearchQuery,
  setAuditVesselFilter,
  vessels,
}) => {
  return (
    <div
                    className="glass-card"
                    style={{
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                      {/* Status Filter Pills */}
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginRight: '0.3rem' }}>
                          Status NC:
                        </span>
                        <button
                          type="button"
                          onClick={() => setAuditFilterStatus('all')}
                          className={`btn btn-sm ${auditFilterStatus === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                        >
                          Semua ({allFindings.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setAuditFilterStatus('open')}
                          className={`btn btn-sm ${auditFilterStatus === 'open' ? 'btn-danger' : 'btn-secondary'}`}
                          style={auditFilterStatus === 'open' ? { background: '#ef4444' } : {}}
                        >
                          🚨 NC Open ({allFindings.filter(f => f.status === 'NC Open').length})
                        </button>
                        {auditFleetStats.overdueCount > 0 && (
                          <button
                            type="button"
                            onClick={() => setAuditFilterStatus('overdue')}
                            className={`btn btn-sm ${auditFilterStatus === 'overdue' ? 'btn-danger' : 'btn-secondary'}`}
                            style={auditFilterStatus === 'overdue' ? { background: '#b91c1c' } : { color: '#ef4444' }}
                          >
                            ⚠️ Overdue Target ({auditFleetStats.overdueCount})
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setAuditFilterStatus('submitted')}
                          className={`btn btn-sm ${auditFilterStatus === 'submitted' ? 'btn-warning' : 'btn-secondary'}`}
                          style={auditFilterStatus === 'submitted' ? { background: '#f59e0b' } : {}}
                        >
                          ⏳ Eviden Review ({allFindings.filter(f => f.status === 'Eviden Submitted').length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setAuditFilterStatus('closed')}
                          className={`btn btn-sm ${auditFilterStatus === 'closed' ? 'btn-success' : 'btn-secondary'}`}
                          style={auditFilterStatus === 'closed' ? { background: '#10b981' } : {}}
                        >
                          ✅ NC Close ({allFindings.filter(f => f.status === 'NC Close').length})
                        </button>
                      </div>

                      {/* Vessel Selector Dropdown */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Kapal / Target:</span>
                        <select
                          value={auditVesselFilter}
                          onChange={(e) => setAuditVesselFilter(e.target.value)}
                          className="input-control"
                          style={{ width: '180px', padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                        >
                          <option value="all">Semua Armada & Kantor</option>
                          <option value="office">🏢 Kantor Pusat (DOC)</option>
                          {vessels.map(v => (
                            <option key={v.id} value={v.id}>🚢 {v.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Search Input */}
                    <div style={{ position: 'relative' }}>
                      <Search
                        size={15}
                        color="var(--text-muted)"
                        style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }}
                      />
                      <input
                        type="text"
                        placeholder="Cari nomor temuan, klausul ISM, deskripsi ketidaksesuaian, atau nama kapal..."
                        value={auditSearchQuery}
                        onChange={(e) => setAuditSearchQuery(e.target.value)}
                        className="input-control"
                        style={{ paddingLeft: '2.4rem', fontSize: '0.85rem' }}
                      />
                      {auditSearchQuery && (
                        <button
                          onClick={() => setAuditSearchQuery('')}
                          style={{
                            position: 'absolute',
                            right: '0.8rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer'
                          }}
                        >
                          <X size={15} />
                        </button>
                      )}
                    </div>
                  </div>
  );
};
