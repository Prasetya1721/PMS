/**
 * FindingVerificationSection.jsx
 * Diekstrak dari AuditFindingModal.jsx (baris 740-834).
 * Sumber: SEKSI 7: Verifikasi Tindakan Perbaikan
 */
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const FindingVerificationSection = ({
  auditorReviewNotes,
  auditorSignatureDate,
  setAuditorReviewNotes,
  setAuditorSignatureDate,
  setVerifiedSatisfactory,
  setVerifiedUpgradeDowngrade,
  verifiedSatisfactory,
  verifiedUpgradeDowngrade,
}) => {
  return (
    <div style={{
                  borderRadius: '10px',
                  border: '1.5px solid #10b981',
                  background: 'var(--bg-surface-elevated)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  opacity: 1
                }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#047857', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={16} />
                    <span>TINDAKAN PERBAIKAN TELAH DIVERIFIKASI (diisi oleh Auditor) / CORRECTIVE ACTION VERIFIED</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                        Perubahan kategori ketidaksesuaian karena sebab diatas / Upgrade / Downgrade NC:
                      </span>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={verifiedUpgradeDowngrade === 'MJ'}
                            onChange={(e) => setVerifiedUpgradeDowngrade(e.target.checked ? 'MJ' : null)}
                          />
                          <span>MJ (Major NC)</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={verifiedUpgradeDowngrade === 'NC'}
                            onChange={(e) => setVerifiedUpgradeDowngrade(e.target.checked ? 'NC' : null)}
                          />
                          <span>NC (Non-Conformity)</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                        Tindakan perbaikan dilaksanakan dengan baik / Completed satisfactorily:
                      </span>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="satisfactoryRadio"
                            checked={verifiedSatisfactory === true}
                            onChange={() => setVerifiedSatisfactory(true)}
                          />
                          <strong style={{ color: '#10b981' }}>☑ Ya / Yes</strong>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="satisfactoryRadio"
                            checked={verifiedSatisfactory === false}
                            onChange={() => setVerifiedSatisfactory(false)}
                          />
                          <strong style={{ color: '#ef4444' }}>☐ Tidak / No</strong>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px dashed rgba(16, 185, 129, 0.3)' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Catatan Verifikasi Auditor ISM
                      </label>
                      <input
                        type="text"
                        value={auditorReviewNotes}
                        onChange={(e) => setAuditorReviewNotes(e.target.value)}
                        placeholder="Catatan penutupan / verifikasi fisik di lapangan..."
                        className="input-control"
                        style={{ fontSize: '0.78rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Tanggal Verifikasi Auditor / Date
                      </label>
                      <input
                        type="date"
                        value={auditorSignatureDate}
                        onChange={(e) => setAuditorSignatureDate(e.target.value)}
                        className="input-control mono"
                      />
                    </div>
                  </div>
                </div>
  );
};
