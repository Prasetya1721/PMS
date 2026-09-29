/**
 * SafeManningInteractiveTab.jsx
 * Diekstrak dari SafeManningMatrixModal.jsx (baris 242-350).
 * Sumber: Cabang interaktif: banner peringatan kekurangan awak, tabel matriks wajib vs onboard, catatan sumber sertifikat
 */
import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export const SafeManningInteractiveTab = ({
  matrixEvaluation,
  onboardCrew,
}) => {
  return (
    <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Status Alert Banner */}
                {!matrixEvaluation.isCompliant ? (
                  <div style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '10px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem'
                  }}>
                    <AlertTriangle size={20} color="#f87171" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#f87171', fontSize: '0.9rem', display: 'block', marginBottom: '4px' }}>
                        PERINGATAN: Formasi Pengawakan Kapal Belum Memenuhi Syarat Kelaiklautan!
                      </strong>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.825rem', color: 'var(--text-main)' }}>
                        {matrixEvaluation.deficiencies.map((d, i) => (
                          <li key={i} style={{ marginBottom: '2px' }}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    padding: '0.85rem 1.25rem',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <CheckCircle2 size={18} color="#10b981" />
                    <span style={{ fontSize: '0.85rem', color: '#10b981' }}>
                      Seluruh formasi jabatan wajib di atas kapal telah terisi oleh perwira/ABK berijazah sah dan sertifikat STCW aktif.
                    </span>
                  </div>
                )}

                {/* Table Matrix */}
                <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                        <th style={{ padding: '0.75rem 1rem' }}>Jabatan Pengawakan</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Syarat Ijazah (COC / COP)</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'center', width: '100px' }}>Wajib Formasi</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'center', width: '100px' }}>Onboard Riil</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Awak Kapal Bertugas</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'center', width: '110px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matrixEvaluation.items.map((pos) => (
                        <tr key={pos.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <strong style={{ display: 'block', fontSize: '0.875rem' }}>{pos.rankTitle}</strong>
                            <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                              Dept. {pos.department} {pos.mandatory ? '• Wajib' : '• Opsional'}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span style={{ color: '#38bdf8', fontWeight: 600, display: 'block' }}>{pos.requiredCoc}</span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{pos.requiredCop}</span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 700 }}>
                            {pos.count} Orang
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 800, color: pos.isSatisfied ? '#10b981' : '#f87171' }}>
                            {pos.presentCount} Orang
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            {pos.matchedCrew.length === 0 ? (
                              <span style={{ color: '#f87171', fontStyle: 'italic', fontSize: '0.78rem' }}>
                                [KOSONG / BELUM ADA AWAK]
                              </span>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                {pos.matchedCrew.map((c, i) => (
                                  <div key={c.id || i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>• {c.name}</span>
                                    {c.hasExpiredCert && (
                                      <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>
                                        Sertifikat STCW Expired!
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                            <span className={`badge ${pos.isSatisfied ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.72rem' }}>
                              {pos.isSatisfied ? 'Lengkap' : 'Deficiency'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span>Berdasarkan: <strong>Safe Manning Certificate No. SM-DJPL/2025/PBK</strong></span>
                  <span>Total Kru Onboard Saat Ini: <strong>{onboardCrew.length} Orang</strong></span>
                </div>
              </div>
  );
};
