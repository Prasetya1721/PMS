/**
 * FindingAuditTypeSection.jsx
 * Diekstrak dari AuditFindingModal.jsx (baris 359-458).
 * Sumber: Pemilih jenis audit & organisasi eksternal
 */
import React from 'react';
import { BKI_AUDIT_MASTER } from '../../../data/auditMasterData';
import { NON_BKI_AUDIT_ORGANIZATIONS } from '../../../data/auditMasterData';

export const FindingAuditTypeSection = ({
  auditType,
  customExternalOrg,
  externalOrg,
  reportId,
  setAuditType,
  setCustomExternalOrg,
  setExternalOrg,
  setReportId,
}) => {
  return (
    <div style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  background: 'var(--bg-surface-elevated)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  opacity: 1
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      Pilih Kategori Pelaksanaan Audit ISM Code:
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setAuditType('Internal')}
                        className={`btn btn-sm ${auditType === 'Internal' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.75rem', fontWeight: 700 }}
                      >
                        🚢 1. Audit Internal (PT. Baharimas)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuditType('External')}
                        className={`btn btn-sm ${auditType === 'External' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.75rem', fontWeight: 700 }}
                      >
                        🏢 2. Audit Eksternal (Lembaga Ditunjuk)
                      </button>
                    </div>
                  </div>

                  {auditType === 'External' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-glass)' }}>
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                          Lembaga Audit Eksternal yang Ditunjuk Perusahaan *
                        </label>
                        <select
                          value={externalOrg}
                          onChange={(e) => setExternalOrg(e.target.value)}
                          className="select-control"
                          style={{ fontSize: '0.8rem', fontWeight: 700, borderColor: '#7c3aed' }}
                        >
                          <optgroup label="Standar BKI (Template Resmi F23.14.06-2024 Rev 05)">
                            <option value={BKI_AUDIT_MASTER.name}>
                              {BKI_AUDIT_MASTER.name}
                            </option>
                          </optgroup>
                          <optgroup label="Lembaga Lain (Format Mandiri / Manual — Non-BKI)">
                            {NON_BKI_AUDIT_ORGANIZATIONS.map(org => (
                              <option key={org.id} value={org.name}>
                                {org.name}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                      </div>

                      {(externalOrg === 'Lembaga Audit Eksternal Lainnya (Input Manual)' ||
                        (typeof externalOrg === 'string' && externalOrg.includes('Lainnya'))) && (
                        <div>
                          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                            Tuliskan Nama Lembaga Ditunjuk *
                          </label>
                          <input
                            type="text"
                            required
                            value={customExternalOrg}
                            onChange={(e) => setCustomExternalOrg(e.target.value)}
                            placeholder="cth: Lloyd's Register (LR) / Bureau Veritas (BV) / ClassNK / RINA..."
                            className="input-control"
                          />
                        </div>
                      )}

                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                          Nomor Laporan / Report ID *
                        </label>
                        <input
                          type="text"
                          required
                          value={reportId}
                          onChange={(e) => setReportId(e.target.value)}
                          placeholder="contoh: 0859 - PK/ISM- SMC /2026"
                          className="input-control mono"
                          style={{ fontWeight: 800, color: '#7c3aed', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div style={{ paddingTop: '0.35rem', fontSize: '0.75rem', color: '#0284c7' }}>
                      ℹ️ <em>Audit Internal dilaksanakan oleh Tim DPA & Safety Officer PT. Pelayaran Baharimas Kalimantan.</em>
                    </div>
                  )}
                </div>
  );
};
