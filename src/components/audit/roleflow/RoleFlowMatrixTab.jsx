/**
 * RoleFlowMatrixTab.jsx
 * Diekstrak dari AuditRoleFlowModal.jsx (baris 926-976).
 * Sumber: Konten tab Matriks RACI
 */
import React from 'react';

export const RoleFlowMatrixTab = ({
  docRaciMatrix,
  isDoc,
  smcRaciMatrix,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Matriks RACI menggambarkan pembagian wewenang dan tanggung jawab dalam pelaksanaan{' '}
                    <strong>{isDoc ? 'Audit DOC Kantor Pusat PT. PBK' : 'Audit SMC Kapal Armada'}</strong>:
                    <br />
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      R = Responsible (Pelaksana) | A = Accountable (Pengambil Keputusan Utama) | C = Consulted (Penasihat/Diskusi) | I = Informed (Penerima Laporan)
                    </span>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }} className="table-hover">
                      <thead>
                        <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '2px solid var(--border-subtle)' }}>
                          <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 800 }}>Tahap Siklus</th>
                          <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 800 }}>Aktivitas Kunci</th>
                          <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 800, color: isDoc ? '#d97706' : '#0284c7' }}>
                            {isDoc ? '🏢 Auditor & DPA' : '🏢 DPA (Kantor Darat)'}
                          </th>
                          <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 800, color: '#10b981' }}>
                            {isDoc ? '👥 Divisi Darat (HR/Teknis/Logistik)' : '🚢 Nakhoda (Kapal Onboard)'}
                          </th>
                          {isDoc && (
                            <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 800, color: '#8b5cf6' }}>
                              🏛️ Direksi Perusahaan
                            </th>
                          )}
                          <th style={{ padding: '0.65rem 0.85rem', textAlign: 'center', fontWeight: 800 }}>Regulasi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(isDoc ? docRaciMatrix : smcRaciMatrix).map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                            <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>{row.phase}</td>
                            <td style={{ padding: '0.65rem 0.85rem' }}>{row.task}</td>
                            <td style={{ padding: '0.65rem 0.85rem', color: isDoc ? '#b45309' : '#0369a1', fontWeight: 600 }}>{row.dpa}</td>
                            <td style={{ padding: '0.65rem 0.85rem', color: '#047857', fontWeight: 600 }}>{row.auditee}</td>
                            {isDoc && (
                              <td style={{ padding: '0.65rem 0.85rem', color: '#6d28d9', fontWeight: 600 }}>{row.mgmt}</td>
                            )}
                            <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center' }}>
                              <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>{row.regulation}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
  );
};
