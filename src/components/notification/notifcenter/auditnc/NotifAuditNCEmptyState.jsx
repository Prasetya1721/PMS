/**
 * NotifAuditNCEmptyState.jsx
 * Diekstrak dari NotifTabAuditNC.jsx (baris 247-265).
 * Sumber: Tampilan saat tidak ada temuan audit yang cocok dengan kriteria filter
 */
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const NotifAuditNCEmptyState = ({
  setAuditFilterStatus,
  setAuditSearchQuery,
  setAuditVesselFilter,
}) => {
  return (
    <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                      <CheckCircle2 size={42} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                        Tidak Ada Temuan Audit Sesuai Kriteria
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1rem auto' }}>
                        Semua temuan audit ISM Code telah terverifikasi dan memenuhi standar kepatuhan maritim PT. Pelayaran Baharimas Kalimantan.
                      </p>
                      <button
                        onClick={() => {
                          setAuditFilterStatus('all');
                          setAuditVesselFilter('all');
                          setAuditSearchQuery('');
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        Reset Filter
                      </button>
                    </div>
  );
};
