/**
 * NotifTabLogs.jsx
 * Diekstrak dari NotificationCenter.jsx (baris 867-993).
 * Sumber: Tab 2: log pengiriman
 */
import React from 'react';
import { Calendar, Mail, Send, ShieldAlert } from 'lucide-react';

export const NotifTabLogs = ({
  escalateNotification,
  logChannelFilter,
  notificationLogs,
  setLogChannelFilter,
}) => {
  return (
    <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                    Audit Log Pengiriman Notifikasi & Sinkronisasi
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Total tercatat: <strong>{notificationLogs.length}</strong> aktivitas
                  </span>
                </div>

                {/* Filter by Channel */}
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Filter Kanal:</span>
                  <button
                    onClick={() => setLogChannelFilter('all')}
                    className={`btn btn-sm ${logChannelFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setLogChannelFilter('Email')}
                    className={`btn btn-sm ${logChannelFilter === 'Email' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', color: logChannelFilter === 'Email' ? '#fff' : '#38bdf8' }}
                  >
                    <Mail size={12} />
                    <span>Email ({notificationLogs.filter(l => l.channel?.toLowerCase().includes('email')).length})</span>
                  </button>
                  <button
                    onClick={() => setLogChannelFilter('WhatsApp')}
                    className={`btn btn-sm ${logChannelFilter === 'WhatsApp' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', color: logChannelFilter === 'WhatsApp' ? '#fff' : '#22c55e' }}
                  >
                    <Send size={12} />
                    <span>WhatsApp ({notificationLogs.filter(l => l.channel?.toLowerCase().includes('whatsapp')).length})</span>
                  </button>
                  <button
                    onClick={() => setLogChannelFilter('Calendar')}
                    className={`btn btn-sm ${logChannelFilter === 'Calendar' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}
                  >
                    <Calendar size={12} />
                    <span>Calendar ({notificationLogs.filter(l => l.channel?.toLowerCase().includes('calendar')).length})</span>
                  </button>
                </div>
              </div>

              <div className="table-container">
                <table className="pms-table">
                  <thead>
                    <tr>
                      <th>Waktu Terkirim</th>
                      <th>Channel / Kanal</th>
                      <th>Target Penerima</th>
                      <th>Kapal</th>
                      <th>Perihal & Ambang Batas</th>
                      <th>Status Pengiriman</th>
                      <th style={{ textAlign: 'right' }}>Aksi Eskalasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notificationLogs
                      .filter(log => {
                        if (logChannelFilter === 'all') return true;
                        if (logChannelFilter === 'Email') return (log.channel || '').toLowerCase().includes('email');
                        if (logChannelFilter === 'WhatsApp') return (log.channel || '').toLowerCase().includes('whatsapp');
                        if (logChannelFilter === 'Calendar') return (log.channel || '').toLowerCase().includes('calendar');
                        return true;
                      })
                      .map(log => (
                      <tr key={log.id}>
                        <td className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {log.timestamp}
                        </td>
                        <td>
                          <span className={`badge ${
                            log.channel?.toLowerCase().includes('email') ? 'badge-primary' :
                            log.channel?.includes('Calendar') ? 'badge-info' : 'badge-success'
                          }`} style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            {log.channel?.toLowerCase().includes('email') && <Mail size={11} />}
                            {log.channel?.includes('Calendar') && <Calendar size={11} />}
                            {log.channel?.toLowerCase().includes('whatsapp') && <Send size={11} />}
                            <span>{log.channel}</span>
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{log.target}</div>
                          <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{log.thresholdTriggered}</span>
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>{log.vesselName}</td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{log.subject}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {log.message}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${
                            log.status === 'Escalated' ? 'badge-danger-pulse' :
                            log.status === 'Delivered' ? 'badge-success' :
                            log.status?.includes('Queued') ? 'badge-info' : 'badge-warning'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {log.status !== 'Escalated' && (
                            <button
                              onClick={() => escalateNotification(log.id)}
                              className="btn btn-danger btn-sm"
                              style={{ padding: '0.25rem 0.65rem', fontSize: '0.72rem' }}
                              title="Eskalasi ke Fleet Manager jika tidak direspon"
                            >
                              <ShieldAlert size={12} />
                              <span>Eskalasi</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
  );
};
