/**
 * FindingLinksSection.jsx
 * Diekstrak dari AuditFindingModal.jsx (baris 895-933).
 * Sumber: SEKSI 9: Integrasi SPB Gudang & Sertifikat
 */
import React from 'react';

export const FindingLinksSection = ({
  linkedCertificateId,
  linkedRequisitionId,
  requisitions,
  setLinkedCertificateId,
  setLinkedRequisitionId,
  shipDocuments,
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
                      Tautkan Sertifikat Statutori Terkait (Opsional)
                    </label>
                    <select
                      value={linkedCertificateId}
                      onChange={(e) => setLinkedCertificateId(e.target.value)}
                      className="select-control"
                      style={{ fontSize: '0.78rem' }}
                    >
                      <option value="">-- Tidak Terkait Sertifikat Spesifik --</option>
                      {(shipDocuments || []).slice(0, 25).map(cert => (
                        <option key={cert.id} value={cert.id}>
                          {cert.name || cert.type} ({cert.documentNumber || 'No. Dok'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
                      Tautkan Permintaan Suku Cadang ke Gudang (Opsional)
                    </label>
                    <select
                      value={linkedRequisitionId}
                      onChange={(e) => setLinkedRequisitionId(e.target.value)}
                      className="select-control"
                      style={{ fontSize: '0.78rem' }}
                    >
                      <option value="">-- Tidak Terkait SPB Gudang --</option>
                      {(requisitions || []).map(req => (
                        <option key={req.id} value={req.id}>
                          {req.requisitionNumber || req.id} - {req.title || req.department || 'Material Requisition'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
  );
};
