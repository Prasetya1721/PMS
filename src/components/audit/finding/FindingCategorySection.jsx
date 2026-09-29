/**
 * FindingCategorySection.jsx
 * Diekstrak dari AuditFindingModal.jsx (baris 582-639).
 * Sumber: SEKSI 3: Kategori & Tanda Tangan Awal
 */
import React from 'react';

export const FindingCategorySection = ({
  areaUnderAudit,
  auditType,
  auditee,
  auditor,
  category,
  externalOrg,
  setAuditee,
  setAuditor,
  setCategory,
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', background: 'var(--bg-surface-elevated)', backgroundColor: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', opacity: 1 }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: '0.4rem' }}>
                      Kategori Ketidaksesuaian / Category *
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {['Non-Conformity', 'Major NC', 'Observasi'].map(cat => (
                        <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="categorySelection"
                            checked={category === cat}
                            onChange={() => setCategory(cat)}
                          />
                          <span style={{ fontWeight: category === cat ? 800 : 500, color: category === cat ? '#0284c7' : 'inherit' }}>
                            {cat === 'Major NC' ? 'Major Non-Conformity (MNC)' : cat}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      Tanda tangan Auditor / Auditor's Signature *
                    </label>
                    <input
                      type="text"
                      required
                      value={auditor}
                      onChange={(e) => setAuditor(e.target.value)}
                      placeholder="Nama Auditor"
                      className="input-control"
                      style={{ fontSize: '0.8rem', fontWeight: 700 }}
                    />
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem', display: 'block' }}>
                      {auditType === 'External' ? externalOrg : 'Lead Auditor PBK'}
                    </span>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      Tanda tangan yang diaudit / Auditee's Signature *
                    </label>
                    <input
                      type="text"
                      required
                      value={auditee}
                      onChange={(e) => setAuditee(e.target.value)}
                      placeholder="Nama Nakhoda / KKM / DPA"
                      className="input-control"
                      style={{ fontSize: '0.8rem', fontWeight: 700 }}
                    />
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem', display: 'block' }}>
                      Pihak yang Diaudit (Kapal {areaUnderAudit})
                    </span>
                  </div>
                </div>
  );
};
