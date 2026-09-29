/**
 * EvidNCRangePanel.jsx
 * Diekstrak dari SubmitEvidenceModal.jsx (baris 237-324).
 * Sumber: Panel rentang waktu NC: target, PIC, tanggal temuan, tenggat, dan hitungan hari
 */
import React from 'react';
import { Building2, Clock, Ship } from 'lucide-react';
import { calculateNCRange } from '../../../utils/auditTimeUtils';

export const EvidNCRangePanel = ({
  finding,
  linkedDoc,
  linkedReq,
}) => {
  const range = calculateNCRange(finding);
              return (
                <div style={{ padding: '1rem 1.15rem', borderRadius: '10px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {finding.standard === 'DOC' ? <Building2 size={13} color="#10b981" /> : <Ship size={13} color="#38bdf8" />}
                      <span>Target: <strong style={{ color: 'var(--text-main)' }}>{finding.targetName}</strong></span>
                    </div>
                    <div>
                      <span>PIC: <strong style={{ color: 'var(--text-main)' }}>{finding.assignedTo}</strong></span>
                    </div>
                  </div>

                  {/* Timeline Rentang Waktu Box */}
                  {range && (
                    <div style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      background: range.bgLight,
                      border: `1px solid ${range.borderColor}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: range.color }}>
                          <Clock size={14} />
                          <span>{range.isClosed ? 'Rentang Waktu Penutupan (Lead Time Close):' : 'Rentang Waktu Penyelesaian (Open to Due Date):'}</span>
                        </div>
                        <span className={`badge ${range.badgeClass}`} style={{ fontSize: '0.7rem', fontWeight: 800 }}>
                          {range.badgeText}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.72rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Open: <strong style={{ color: 'var(--text-main)' }}>{range.openDateStr}</strong></span>
                        <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${range.percentUsed}%`,
                            background: range.isClosed ? '#10b981' : range.isOverdue ? '#ef4444' : '#f59e0b',
                            borderRadius: '3px'
                          }} />
                        </div>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {range.isClosed ? `Close: ${range.closedDateStr}` : `Due: ${range.dueDateStr}`}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {range.timelineSummary}
                      </div>
                    </div>
                  )}

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 700, display: 'block' }}>Deskripsi Ketidaksesuaian:</span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.15rem', lineHeight: '1.4' }}>{finding.description}</p>
              </div>

              {finding.objectiveEvidence && (
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 700, display: 'block' }}>Bukti Objektif Auditor:</span>
                  <p className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{finding.objectiveEvidence}</p>
                </div>
              )}

              {/* Linked Certificate & Requisition Badges */}
              {(linkedDoc || linkedReq || finding.linkedCertificateTitle || finding.linkedRequisitionTitle) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', borderTop: '1px solid var(--border-glass)', paddingTop: '0.65rem' }}>
                  {(linkedDoc || finding.linkedCertificateTitle) && (
                    <div style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.75rem' }}>
                      <span style={{ color: '#10b981', fontWeight: 700, display: 'block' }}>Data Sertifikat Terkait:</span>
                      <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{linkedDoc?.name || linkedDoc?.type || finding.linkedCertificateTitle}</span>
                    </div>
                  )}
                  {(linkedReq || finding.linkedRequisitionTitle) && (
                    <div style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '0.75rem' }}>
                      <span style={{ color: '#f59e0b', fontWeight: 700, display: 'block' }}>Permintaan Gudang Terkait:</span>
                      <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{linkedReq?.requisitionNumber || linkedReq?.id || finding.linkedRequisitionTitle}</span>
                    </div>
                  )}
                </div>
              )}
                </div>
              );
};
