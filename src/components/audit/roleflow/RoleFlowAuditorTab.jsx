/**
 * RoleFlowAuditorTab.jsx
 * Diekstrak dari AuditRoleFlowModal.jsx (baris 732-824).
 * Sumber: Konten tab Peran 1 (Auditor/DPA)
 */
import React from 'react';
import { Building2, CheckCircle2 } from 'lucide-react';

export const RoleFlowAuditorTab = ({
  docAuditorSteps,
  isDoc,
  smcDpaSteps,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div
                    style={{
                      padding: '0.85rem 1.15rem',
                      borderRadius: '10px',
                      background: isDoc ? 'rgba(245, 158, 11, 0.08)' : 'rgba(2, 132, 199, 0.08)',
                      border: isDoc ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(2, 132, 199, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem'
                    }}
                  >
                    <div style={{ padding: '0.5rem', borderRadius: '8px', background: isDoc ? '#d97706' : '#0284c7', color: '#fff' }}>
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: isDoc ? '#d97706' : '#0284c7', margin: 0 }}>
                        {isDoc
                          ? 'Mandat Lead Auditor & DPA sesuai ISM Code Klausul 3 & 4 (Standar DOC Kantor):'
                          : 'Mandat DPA sesuai ISM Code Klausul 4 (Standar SMC Kapal):'}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', margin: '0.2rem 0 0 0', lineHeight: 1.45 }}>
                        {isDoc
                          ? 'DPA menghubungkan jajaran Direksi dengan armada dan seluruh departemen darat. Bertanggung jawab mengevaluasi efektivitas 13 Seksi SMS kantor pusat, memastikan kualifikasi staf & awak kapal memadai, memverifikasi kesiapan tanggap darurat (ERT) darat, dan merekomendasikan perpanjangan sertifikat DOC ke BKI.'
                          : 'DPA menghubungkan manajemen puncak darat dengan kapal, bertanggung jawab memantau operasional keselamatan, memastikan alokasi suku cadang kritis memadai, mengevaluasi laporan nakhoda, memverifikasi bukti perbaikan fisik onboard, dan mendeklarasikan status kelaiklautan kapal (Fit to Sail).'}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {(isDoc ? docAuditorSteps : smcDpaSteps).map(step => (
                      <div
                        key={step.step}
                        className="glass-card"
                        style={{
                          padding: '1rem 1.25rem',
                          borderRadius: '10px',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span
                              style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                background: isDoc ? '#d97706' : '#0284c7',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem',
                                fontWeight: 900
                              }}
                            >
                              {step.step}
                            </span>
                            <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>{step.title}</strong>
                          </div>
                          <span className={`badge ${isDoc ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                            {step.ismRef}
                          </span>
                        </div>

                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0', lineHeight: 1.45 }}>
                          {step.description}
                        </p>

                        <div style={{ background: 'var(--bg-surface-elevated)', borderRadius: '8px', padding: '0.65rem 0.85rem', marginTop: '0.35rem' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                            Daftar Aksi Sistem:
                          </div>
                          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.76rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                            {step.actions.map((act, i) => (
                              <li key={i}>{act}</li>
                            ))}
                          </ul>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: isDoc ? '#d97706' : '#0284c7', fontWeight: 700, marginTop: '0.2rem' }}>
                          <CheckCircle2 size={13} />
                          <span>Hasil / Output Dokumen: {step.output}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
  );
};
