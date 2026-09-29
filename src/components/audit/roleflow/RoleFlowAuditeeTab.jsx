/**
 * RoleFlowAuditeeTab.jsx
 * Diekstrak dari AuditRoleFlowModal.jsx (baris 829-921).
 * Sumber: Konten tab Peran 2 (Auditee/Nakhoda)
 */
import React from 'react';
import { CheckCircle2, Ship, Users } from 'lucide-react';

export const RoleFlowAuditeeTab = ({
  docDepartmentSteps,
  isDoc,
  smcNakhodaSteps,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div
                    style={{
                      padding: '0.85rem 1.15rem',
                      borderRadius: '10px',
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem'
                    }}
                  >
                    <div style={{ padding: '0.5rem', borderRadius: '8px', background: '#10b981', color: '#fff' }}>
                      {isDoc ? <Users size={20} /> : <Ship size={20} />}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#10b981', margin: 0 }}>
                        {isDoc
                          ? 'Peran Kepala Departemen Darat & Direksi (Standar DOC Kantor):'
                          : 'Mandat Nakhoda sesuai ISM Code Klausul 5 (Standar SMC Kapal):'}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', margin: '0.2rem 0 0 0', lineHeight: 1.45 }}>
                        {isDoc
                          ? 'Kepala Departemen darat (Crewing, Superintendent Teknis, Logistik & Pengadaan, HSSE) bertindak sebagai Auditee Utama di kantor pusat. Bertanggung jawab membuktikan kepatuhan SOP divisi, menyediakan bukti kualifikasi kru, pengadaan suku cadang kritis, menyusun tindakan koreksi (CAPA), dan menghadiri Rapat Tinjauan Manajemen.'
                          : 'Nakhoda memegang kewenangan mutlak (overriding authority) di atas kapal untuk keselamatan jiwa dan perlindungan lingkungan laut. Selaku Auditee Utama di kapal, Nakhoda mendampingi uji fisik 74 klausul, memimpin perbaikan langsung di kapal, dan mengunggah foto eviden ke DPA.'}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {(isDoc ? docDepartmentSteps : smcNakhodaSteps).map(step => (
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
                                background: '#10b981',
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
                          <span className="badge badge-success" style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                            {step.ismRef}
                          </span>
                        </div>

                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0', lineHeight: 1.45 }}>
                          {step.description}
                        </p>

                        <div style={{ background: 'var(--bg-surface-elevated)', borderRadius: '8px', padding: '0.65rem 0.85rem', marginTop: '0.35rem' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                            Daftar Aksi Auditee:
                          </div>
                          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.76rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                            {step.actions.map((act, i) => (
                              <li key={i}>{act}</li>
                            ))}
                          </ul>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#10b981', fontWeight: 700, marginTop: '0.2rem' }}>
                          <CheckCircle2 size={13} />
                          <span>Hasil / Output Dokumen: {step.output}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
  );
};
