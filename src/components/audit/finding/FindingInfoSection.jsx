/**
 * FindingInfoSection.jsx
 * Diekstrak dari AuditFindingModal.jsx (baris 461-546).
 * Sumber: SEKSI 1: Informasi Ketidaksesuaian
 */
import React from 'react';

export const FindingInfoSection = ({
  areaUnderAudit,
  dateOfAudit,
  elementNumberOfCode,
  findingNo,
  setAreaUnderAudit,
  setClauseCode,
  setDateOfAudit,
  setElementNumberOfCode,
  setFindingNo,
}) => {
  return (
    <div style={{
                  borderRadius: '10px',
                  border: '1.5px solid var(--border-subtle)',
                  background: 'var(--bg-surface-elevated)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  overflow: 'hidden',
                  opacity: 1
                }}>
                  <div style={{
                    background: 'var(--bg-surface-hover)',
                    color: 'var(--text-main)',
                    padding: '0.5rem 0.85rem',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    letterSpacing: '0.5px'
                  }}>
                    INFORMASI KETIDAKSESUAIAN / NON-CONFORMITY INFORMATION
                  </div>

                  <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        LINGKUP AUDIT / Area under Audit *
                      </label>
                      <input
                        type="text"
                        required
                        value={areaUnderAudit}
                        onChange={(e) => setAreaUnderAudit(e.target.value)}
                        placeholder="contoh: RP 2004 atau Kantor Pusat PBK"
                        className="input-control"
                        style={{ fontWeight: 800, fontSize: '0.9rem' }}
                      />
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem', display: 'block' }}>
                        Nama kapal atau departemen darat yang diaudit
                      </span>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        No. Lap. Ketidaksesuaian / NCR No. *
                      </label>
                      <input
                        type="text"
                        required
                        value={findingNo}
                        onChange={(e) => setFindingNo(e.target.value)}
                        placeholder="contoh: 1/4 - 0859 - PK/ISM- SMC /2026"
                        className="input-control mono"
                        style={{ fontWeight: 800, color: '#ef4444', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Tgl. Audit / Date of Audit *
                      </label>
                      <input
                        type="date"
                        required
                        value={dateOfAudit}
                        onChange={(e) => setDateOfAudit(e.target.value)}
                        className="input-control mono"
                        style={{ fontWeight: 700 }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        No. Elemen dari Koda / Element Number of Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={elementNumberOfCode}
                        onChange={(e) => {
                          setElementNumberOfCode(e.target.value);
                          setClauseCode(e.target.value.split(' ')[0]);
                        }}
                        placeholder="contoh: 5.1.5 or other"
                        className="input-control mono"
                        style={{ fontWeight: 800, color: '#0284c7' }}
                      />
                    </div>
                  </div>
                </div>
  );
};
