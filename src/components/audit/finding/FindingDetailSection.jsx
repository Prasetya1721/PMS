/**
 * FindingDetailSection.jsx
 * Diekstrak dari AuditFindingModal.jsx (baris 549-579).
 * Sumber: SEKSI 2: Rincian & Bukti Objektif
 */
import React from 'react';

export const FindingDetailSection = ({
  description,
  objectiveEvidence,
  setDescription,
  setObjectiveEvidence,
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                      Rincian Ketidaksesuaian / Non-Conformity Details *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Uraikan kondisi temuan ketidaksesuaian terhadap ketentuan ISM Code..."
                      className="input-control"
                      style={{ lineHeight: '1.45' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                      Bukti Objektif / Objective Evidence *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={objectiveEvidence}
                      onChange={(e) => setObjectiveEvidence(e.target.value)}
                      placeholder="- Poin 1 bukti objektif temuan audit...&#10;- Poin 2 catatan dokumen atau fakta lapangan..."
                      className="input-control"
                      style={{ lineHeight: '1.45', fontFamily: 'monospace', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>
  );
};
