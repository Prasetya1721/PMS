/**
 * ChecklistTabTable.jsx
 * Diekstrak dari ChecklistTab.jsx (baris 269-936).
 * Sumber: Kartu tabel checklist ISM lengkap dengan thead dan seluruh baris item
 */
import React from 'react';
import { Edit2, Eye, FileText, Sparkles, Strikethrough, Trash2, Undo2, Upload, Zap } from 'lucide-react';

export const ChecklistTabTable = ({
  activeChecklistConfig,
  activeChecklistItems,
  checklistEvidenceMap,
  currentTarget,
  customChecklistItems,
  handleGenerateMockVesselChecklistEvidence,
  handleOpenEditManagerItem,
  handleQuickLogNC,
  handleRemoveVesselChecklistEvidence,
  handleToggleManagerResult,
  handleToggleVesselStrikethrough,
  handleUploadVesselChecklistEvidence,
  isAuditorOrDPA,
  setDeleteManagerItemTarget,
  setPreviewChecklistEvidence,
  setVesselChecklistNotes,
  vesselChecklistFilter,
  vesselChecklistNotes,
  vesselChecklistResults,
  vesselDeletedCodes,
  vesselItemOverrides,
  vesselStrikethroughOverrides,
}) => {
  return (
    <div className="glass-card" style={{ padding: '0.75rem', overflowX: 'auto' }}>
          <table className="pms-table" style={{ width: '100%', fontSize: '0.78rem' }}>
            <thead>
              <tr>
                <th style={{ width: '90px', textAlign: 'center' }}>Kode</th>
                <th>Area Pemeriksaan ISM Code</th>
                <th>Kriteria / Check Point</th>
                <th style={{ width: '52px', textAlign: 'center' }} title="Complied / Sesuai (Yes)">Yes</th>
                <th style={{ width: '52px', textAlign: 'center' }} title="Non-Conformity / Tidak Sesuai (No)">No</th>
                <th style={{ width: '52px', textAlign: 'center' }} title="Not Applicable / Tidak Berlaku (N/A)">N/A</th>
                <th style={{ width: '150px' }}>Catatan</th>
                <th style={{ width: '180px' }}>Upload Bukti Audit</th>
                <th style={{ width: '180px', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {/* Custom items */}
              {customChecklistItems
                .filter(item => !vesselDeletedCodes.includes(item.code))
                .filter(item => {
                  const isStrikethrough = vesselStrikethroughOverrides[item.code] !== undefined
                    ? vesselStrikethroughOverrides[item.code]
                    : Boolean(item.isStrikethrough);
                  const resultVal = vesselChecklistResults[item.code] !== undefined
                    ? vesselChecklistResults[item.code]
                    : (isStrikethrough ? 'N/A' : (item.result || ''));
                  const isYes = !isStrikethrough && (resultVal === 'Complied' || resultVal === 'Yes');
                  const isNo = !isStrikethrough && ['Minor NC', 'Major NC', 'Observation', 'No'].includes(resultVal);
                  const isNA = isStrikethrough || resultVal === 'N/A';

                  if (vesselChecklistFilter === 'CORE') return !isStrikethrough;
                  if (vesselChecklistFilter === 'STRIKETHROUGH') return isStrikethrough;
                  if (vesselChecklistFilter === 'HAS_EVIDENCE') return Boolean(checklistEvidenceMap[item.code]);
                  if (vesselChecklistFilter === 'YES') return isYes;
                  if (vesselChecklistFilter === 'NO') return isNo;
                  if (vesselChecklistFilter === 'NA') return isNA;
                  return true;
                })
                .map(item => {
                  const isStrikethrough = vesselStrikethroughOverrides[item.code] !== undefined
                    ? vesselStrikethroughOverrides[item.code]
                    : Boolean(item.isStrikethrough);
                  const resultVal = vesselChecklistResults[item.code] !== undefined
                    ? vesselChecklistResults[item.code]
                    : (isStrikethrough ? 'N/A' : (item.result || ''));
                  const isYes = !isStrikethrough && (resultVal === 'Complied' || resultVal === 'Yes');
                  const isNo = !isStrikethrough && ['Minor NC', 'Major NC', 'Observation', 'No'].includes(resultVal);
                  const isNA = isStrikethrough || resultVal === 'N/A';
                  const currentNotes = vesselChecklistNotes[item.code] !== undefined
                    ? vesselChecklistNotes[item.code]
                    : (item.notes || '');

                  return (
                    <tr key={item.id} style={{ background: isStrikethrough ? 'rgba(239, 68, 68, 0.03)' : 'rgba(2, 132, 199, 0.04)' }}>
                      <td style={{ textAlign: 'center', verticalAlign: 'top' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                          <span className="badge badge-info mono" style={{ fontWeight: 800 }}>
                            {item.code}
                          </span>
                          <span className="badge badge-neutral" style={{ fontSize: '0.62rem' }}>Manual</span>
                          {isStrikethrough ? (
                            <button
                              type="button"
                              onClick={() => handleToggleVesselStrikethrough(item.code)}
                              className="badge badge-warning"
                              style={{ fontSize: '0.58rem', padding: '0.08rem 0.35rem', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', width: 'fit-content' }}
                              title="Klik untuk lepas coret klausul"
                            >
                              <Undo2 size={9} />
                              <span>Dicoret (N/A)</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleVesselStrikethrough(item.code)}
                              style={{ fontSize: '0.58rem', padding: '0.05rem 0.3rem', border: '1px dashed var(--border-subtle)', background: 'transparent', color: 'var(--text-muted)', borderRadius: '3px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', width: 'fit-content' }}
                              title="Coret klausul ini jika tidak digunakan pada kapal"
                            >
                              <Strikethrough size={9} />
                              <span>Coret</span>
                            </button>
                          )}
                        </div>
                      </td>
                      <td style={{ verticalAlign: 'top' }}>
                        <div style={{ textDecoration: isStrikethrough ? 'line-through' : 'none', color: isStrikethrough ? 'var(--text-muted)' : 'var(--text-main)' }}>
                          <strong>{item.name}</strong>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)', verticalAlign: 'top' }}>
                        <span>{item.checkPoint}</span>
                        {isNo && (
                          <div style={{ marginTop: '0.35rem' }}>
                            <button
                              type="button"
                              onClick={() => handleQuickLogNC(item, 'Minor NC')}
                              className="btn btn-warning btn-sm"
                              style={{
                                fontSize: '0.68rem',
                                padding: '0.2rem 0.5rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontWeight: 700
                              }}
                              title="Catat langsung temuan NC untuk butir manual ini"
                            >
                              <Zap size={11} fill="currentColor" />
                              <span>Catat Temuan NC Langsung</span>
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Yes */}
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        <div
                          className={`audit-checkbox-box ${isYes ? 'active-yes' : ''}`}
                          title={isYes ? 'Batal pilih Yes (Kosongkan)' : 'Tandai: Complied / Yes'}
                          onClick={() => !isStrikethrough && handleToggleManagerResult(item.code, 'Complied')}
                          style={{ cursor: isStrikethrough ? 'not-allowed' : 'pointer' }}
                        >
                          {isYes && <span style={{ fontSize: '13px', fontWeight: 900, lineHeight: 1 }}>✕</span>}
                        </div>
                      </td>

                      {/* No */}
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        <div
                          className={`audit-checkbox-box ${isNo ? 'active-no' : ''}`}
                          title={isNo ? 'Batal pilih No (Kosongkan)' : 'Tandai: Minor NC / No'}
                          onClick={() => !isStrikethrough && handleToggleManagerResult(item.code, 'Minor NC')}
                          style={{ cursor: isStrikethrough ? 'not-allowed' : 'pointer' }}
                        >
                          {isNo && <span style={{ fontSize: '13px', fontWeight: 900, lineHeight: 1 }}>✕</span>}
                        </div>
                      </td>

                      {/* N/A */}
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        <div
                          className={`audit-checkbox-box ${isNA ? 'active-na' : ''}`}
                          title={isNA ? 'Batal pilih N/A (Kosongkan)' : 'Tandai: N/A (Tidak Berlaku)'}
                          onClick={() => !isStrikethrough && handleToggleManagerResult(item.code, 'N/A')}
                          style={{ cursor: isStrikethrough ? 'not-allowed' : 'pointer' }}
                        >
                          {isNA && <span style={{ fontSize: '13px', fontWeight: 900, lineHeight: 1 }}>✕</span>}
                        </div>
                      </td>

                      {/* Catatan / Remark */}
                      <td style={{ verticalAlign: 'middle' }}>
                        <input
                          type="text"
                          value={currentNotes}
                          onChange={(e) => setVesselChecklistNotes(prev => ({ ...prev, [item.code]: e.target.value }))}
                          placeholder="Catatan temuan..."
                          className="input-control"
                          style={{ fontSize: '0.74rem', padding: '0.25rem 0.5rem' }}
                        />
                      </td>

                      {/* Evidence */}
                      <td style={{ verticalAlign: 'middle' }}>
                        {checklistEvidenceMap[item.code] ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.3rem 0.5rem', borderRadius: '6px', background: 'rgba(2, 132, 199, 0.12)', border: '1px solid rgba(2, 132, 199, 0.3)' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0284c7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '110px' }} title={checklistEvidenceMap[item.code].fileName}>
                              📎 {checklistEvidenceMap[item.code].fileName}
                            </span>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                              <button
                                type="button"
                                onClick={() => setPreviewChecklistEvidence(checklistEvidenceMap[item.code])}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.15rem 0.35rem', fontSize: '0.65rem' }}
                              >
                                <Eye size={11} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveVesselChecklistEvidence(item.code)}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.15rem 0.35rem', color: '#ef4444' }}
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', fontSize: '0.68rem', padding: '0.2rem 0.45rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                              <Upload size={11} />
                              <span>Upload</span>
                              <input type="file" accept="image/*,application/pdf" style={{ display: 'none' }} onChange={(e) => handleUploadVesselChecklistEvidence(item.code, e.target.files?.[0])} />
                            </label>
                            <button
                              type="button"
                              onClick={() => handleGenerateMockVesselChecklistEvidence(item.code, item.name, currentTarget.name)}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.68rem', padding: '0.2rem 0.4rem', color: '#0284c7' }}
                            >
                              <Sparkles size={11} />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Aksi */}
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        {isAuditorOrDPA ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEditManagerItem(item)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.2rem 0.45rem', fontSize: '0.68rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#0284c7', borderColor: 'rgba(2, 132, 199, 0.3)' }}
                              title="Edit butir manual ini"
                            >
                              <Edit2 size={11} />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteManagerItemTarget(item)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.2rem 0.45rem', fontSize: '0.68rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                              title="Hapus butir manual ini"
                            >
                              <Trash2 size={11} />
                              <span>Hapus</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleVesselStrikethrough(item.code)}
                              className={`btn btn-sm ${isStrikethrough ? 'btn-warning' : 'btn-secondary'}`}
                              style={{
                                fontSize: '0.68rem',
                                padding: '0.2rem 0.45rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontWeight: 600
                              }}
                              title={isStrikethrough ? 'Lepas coret klausul' : 'Coret klausul (Tandai N/A)'}
                            >
                              {isStrikethrough ? (
                                <>
                                  <Undo2 size={11} />
                                  <span>Lepas</span>
                                </>
                              ) : (
                                <>
                                  <Strikethrough size={11} />
                                  <span>Coret</span>
                                </>
                              )}
                            </button>
                            {!isStrikethrough && (
                              <button
                                type="button"
                                onClick={() => handleQuickLogNC(item, 'Minor NC')}
                                className="btn btn-secondary btn-sm"
                                style={{ fontSize: '0.68rem', padding: '0.2rem 0.45rem', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)', fontWeight: 700 }}
                                title="Buat temuan NC untuk klausul manual ini"
                              >
                                + NC
                              </button>
                            )}
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.68rem', color: isStrikethrough ? '#f59e0b' : '#10b981', fontWeight: 700 }}>
                            {isStrikethrough ? '✂️ Dicoret (N/A)' : '✓ Butir Manual'}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}

              {/* Butir checklist standar / template (DOC Rev 06 & SMC Rev 05) */}
              {activeChecklistItems
                .filter(el => !vesselDeletedCodes.includes(el.code))
                .filter(el => {
                  const isStriked = vesselStrikethroughOverrides[el.code] !== undefined
                    ? vesselStrikethroughOverrides[el.code]
                    : Boolean(el.isStrikethrough);
                  const itemOverride = vesselItemOverrides[el.code] || {};
                  const effectiveResult = vesselChecklistResults[el.code] !== undefined
                    ? vesselChecklistResults[el.code]
                    : (isStriked ? 'N/A' : (itemOverride.result || el.result || ''));
                  const isYes = !isStriked && (effectiveResult === 'Complied' || effectiveResult === 'Yes');
                  const isNo = !isStriked && ['Minor NC', 'Major NC', 'Observation', 'No'].includes(effectiveResult);
                  const isNA = isStriked || effectiveResult === 'N/A';

                  if (vesselChecklistFilter === 'CORE') return !isStriked;
                  if (vesselChecklistFilter === 'STRIKETHROUGH') return isStriked;
                  if (vesselChecklistFilter === 'HAS_EVIDENCE') return Boolean(checklistEvidenceMap[el.code]);
                  if (vesselChecklistFilter === 'YES') return isYes;
                  if (vesselChecklistFilter === 'NO') return isNo;
                  if (vesselChecklistFilter === 'NA') return isNA;
                  return true;
                })
                .map(el => {
                  const isStrikethrough = vesselStrikethroughOverrides[el.code] !== undefined
                    ? vesselStrikethroughOverrides[el.code]
                    : Boolean(el.isStrikethrough);
                  const itemOverride = vesselItemOverrides[el.code] || {};
                  const effectiveItem = { ...el, ...itemOverride };
                  const effectiveResult = vesselChecklistResults[el.code] !== undefined
                    ? vesselChecklistResults[el.code]
                    : (isStrikethrough ? 'N/A' : (itemOverride.result || el.result || ''));
                  const isYes = !isStrikethrough && (effectiveResult === 'Complied' || effectiveResult === 'Yes');
                  const isNo = !isStrikethrough && ['Minor NC', 'Major NC', 'Observation', 'No'].includes(effectiveResult);
                  const isNA = isStrikethrough || effectiveResult === 'N/A';
                  const currentNotes = vesselChecklistNotes[el.code] !== undefined
                    ? vesselChecklistNotes[el.code]
                    : (itemOverride.notes || el.notes || '');
                  const evidence = checklistEvidenceMap[el.code];

                  function isStriked() {
                    return isStrikethrough;
                  }

                  return (
                    <tr key={el.code} style={{ background: isStrikethrough ? 'rgba(239, 68, 68, 0.03)' : undefined }}>
                      {/* Kode */}
                      <td style={{ textAlign: 'center', verticalAlign: 'top' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                          <span className="badge badge-neutral mono" style={{ fontWeight: 800, color: isStrikethrough ? '#94a3b8' : '#10b981' }}>
                            {effectiveItem.code}
                          </span>
                          {isStrikethrough ? (
                            isAuditorOrDPA ? (
                              <button
                                type="button"
                                onClick={() => handleToggleVesselStrikethrough(el.code)}
                                className="badge badge-warning"
                                style={{ fontSize: '0.58rem', padding: '0.08rem 0.35rem', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', width: 'fit-content' }}
                                title="Klik untuk melepas coret klausul"
                              >
                                <Undo2 size={9} />
                                <span>Dicoret (N/A)</span>
                              </button>
                            ) : (
                              <span className="badge badge-warning" style={{ fontSize: '0.58rem', padding: '0.08rem 0.35rem', whiteSpace: 'nowrap' }}>
                                Dicoret (N/A)
                              </span>
                            )
                          ) : (
                            isAuditorOrDPA && (
                              <button
                                type="button"
                                onClick={() => handleToggleVesselStrikethrough(el.code)}
                                style={{ fontSize: '0.58rem', padding: '0.05rem 0.3rem', border: '1px dashed var(--border-subtle)', background: 'transparent', color: 'var(--text-muted)', borderRadius: '3px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', width: 'fit-content' }}
                                title="Coret klausul ini (Tandai N/A jika tidak digunakan pada kapal)"
                              >
                                <Strikethrough size={9} />
                                <span>Coret</span>
                              </button>
                            )
                          )}
                        </div>
                      </td>

                      {/* Area Pemeriksaan */}
                      <td style={{ verticalAlign: 'top' }}>
                        <div style={{ textDecoration: isStrikethrough ? 'line-through' : 'none', color: isStrikethrough ? 'var(--text-muted)' : 'var(--text-main)' }}>
                          <strong style={{ display: 'block' }}>{effectiveItem.name}</strong>
                        </div>
                        {isStrikethrough && (
                          <span style={{ fontSize: '0.67rem', color: '#f59e0b', fontWeight: 600 }}>
                            ⚠️ Klausul tidak digunakan / dicoret oleh auditor (N/A)
                          </span>
                        )}
                      </td>

                      {/* Kriteria / Check Point */}
                      <td style={{ color: 'var(--text-muted)', verticalAlign: 'top' }}>
                        <span style={{ display: 'block', lineHeight: 1.5 }}>
                          {effectiveItem.checkPoint || effectiveItem.checkPoints?.[0] || effectiveItem.description || '-'}
                        </span>
                        {(effectiveItem.remark || effectiveItem.ismCode) && (
                          <span style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                            {effectiveItem.ismCode && (
                              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#0284c7', background: 'rgba(2,132,199,0.1)', borderRadius: '4px', padding: '0.05rem 0.3rem' }}>
                                ISM §{effectiveItem.ismCode}
                              </span>
                            )}
                            {effectiveItem.remark && effectiveItem.remark !== effectiveItem.checkPoint && (
                              <span style={{ fontSize: '0.62rem', color: '#64748b', fontStyle: 'italic' }}>
                                {effectiveItem.remark}
                              </span>
                            )}
                          </span>
                        )}
                        {isNo && isAuditorOrDPA && (
                          <div style={{ marginTop: '0.4rem' }}>
                            <button
                              type="button"
                              onClick={() => handleQuickLogNC(effectiveItem, effectiveResult === 'Major NC' ? 'Major NC' : effectiveResult === 'Observation' ? 'Observation' : 'Minor NC')}
                              className="btn btn-warning btn-sm"
                              style={{
                                fontSize: '0.68rem',
                                padding: '0.2rem 0.55rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontWeight: 700
                              }}
                              title="Catat langsung temuan NC untuk klausul ini"
                            >
                              <Zap size={11} fill="currentColor" />
                              <span>Catat Temuan NC Langsung</span>
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Yes */}
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        <div
                          className={`audit-checkbox-box ${isYes ? 'active-yes' : ''}`}
                          title={!isAuditorOrDPA ? 'Hanya Auditor / DPA yang berwenang mengevaluasi checklist' : isYes ? 'Batal pilih Yes (Kosongkan)' : 'Tandai: Complied / Yes'}
                          onClick={() => !isStrikethrough && handleToggleManagerResult(el.code, 'Complied')}
                          style={{ cursor: !isAuditorOrDPA || isStrikethrough ? 'not-allowed' : 'pointer' }}
                        >
                          {isYes && <span style={{ fontSize: '13px', fontWeight: 900, lineHeight: 1 }}>✕</span>}
                        </div>
                      </td>

                      {/* No */}
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        <div
                          className={`audit-checkbox-box ${isNo ? 'active-no' : ''}`}
                          title={!isAuditorOrDPA ? 'Hanya Auditor / DPA yang berwenang mengevaluasi checklist' : isNo ? 'Batal pilih No (Kosongkan)' : 'Tandai: Minor NC / No'}
                          onClick={() => !isStrikethrough && handleToggleManagerResult(el.code, 'Minor NC')}
                          style={{ cursor: !isAuditorOrDPA || isStrikethrough ? 'not-allowed' : 'pointer' }}
                        >
                          {isNo && <span style={{ fontSize: '13px', fontWeight: 900, lineHeight: 1 }}>✕</span>}
                        </div>
                      </td>

                      {/* N/A */}
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        <div
                          className={`audit-checkbox-box ${isNA ? 'active-na' : ''}`}
                          title={!isAuditorOrDPA ? 'Hanya Auditor / DPA yang berwenang mengevaluasi checklist' : isNA ? 'Batal pilih N/A (Kosongkan)' : 'Tandai: N/A (Tidak Berlaku)'}
                          onClick={() => !isStrikethrough && handleToggleManagerResult(el.code, 'N/A')}
                          style={{ cursor: !isAuditorOrDPA || isStrikethrough ? 'not-allowed' : 'pointer' }}
                        >
                          {isNA && <span style={{ fontSize: '13px', fontWeight: 900, lineHeight: 1 }}>✕</span>}
                        </div>
                      </td>

                      {/* Catatan / Remark */}
                      <td style={{ verticalAlign: 'middle' }}>
                        <input
                          type="text"
                          value={currentNotes}
                          disabled={!isAuditorOrDPA}
                          onChange={(e) => setVesselChecklistNotes(prev => ({ ...prev, [el.code]: e.target.value }))}
                          placeholder={isAuditorOrDPA ? "Catatan temuan..." : "Catatan auditor..."}
                          className="input-control"
                          style={{
                            fontSize: '0.74rem',
                            padding: '0.25rem 0.5rem',
                            background: !isAuditorOrDPA ? 'var(--bg-surface-elevated)' : undefined,
                            cursor: !isAuditorOrDPA ? 'not-allowed' : undefined
                          }}
                        />
                      </td>

                      {/* Upload Bukti Audit Field */}
                      <td style={{ verticalAlign: 'middle' }}>
                        {evidence ? (
                          <div style={{
                            padding: '0.3rem 0.5rem',
                            borderRadius: '6px',
                            background: 'rgba(2, 132, 199, 0.12)',
                            border: '1px solid rgba(2, 132, 199, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.3rem'
                          }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0284c7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '110px' }} title={evidence.fileName}>
                              📎 {evidence.fileName}
                            </span>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                              <button
                                type="button"
                                onClick={() => setPreviewChecklistEvidence(evidence)}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.15rem 0.35rem', fontSize: '0.65rem' }}
                                title="Lihat Bukti"
                              >
                                <Eye size={11} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveVesselChecklistEvidence(el.code)}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.15rem 0.35rem', color: '#ef4444' }}
                                title="Hapus Bukti"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                            <label
                              className="btn btn-secondary btn-sm"
                              style={{
                                cursor: 'pointer',
                                fontSize: '0.68rem',
                                padding: '0.2rem 0.45rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                                color: 'var(--text-main)'
                              }}
                              title="Unggah Foto/Dokumen Bukti Audit"
                            >
                              <Upload size={11} />
                              <span>Upload</span>
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                style={{ display: 'none' }}
                                onChange={(e) => handleUploadVesselChecklistEvidence(el.code, e.target.files?.[0])}
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => handleGenerateMockVesselChecklistEvidence(el.code, el.name, currentTarget.name)}
                              className="btn btn-secondary btn-sm"
                              style={{
                                fontSize: '0.68rem',
                                padding: '0.2rem 0.4rem',
                                color: '#0284c7',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.2rem'
                              }}
                              title="Lampirkan Dokumen Bukti Simulasi Cepat"
                            >
                              <Sparkles size={11} />
                              <span>Simulasi</span>
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Aksi */}
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        {isAuditorOrDPA ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEditManagerItem(effectiveItem)}
                              className="btn btn-secondary btn-sm"
                              style={{
                                padding: '0.2rem 0.45rem',
                                fontSize: '0.68rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                                color: '#0284c7',
                                borderColor: 'rgba(2, 132, 199, 0.3)'
                              }}
                              title="Edit butir klausul ini"
                            >
                              <Edit2 size={11} />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteManagerItemTarget(effectiveItem)}
                              className="btn btn-secondary btn-sm"
                              style={{
                                padding: '0.2rem 0.45rem',
                                fontSize: '0.68rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                                color: '#ef4444',
                                borderColor: 'rgba(239, 68, 68, 0.3)'
                              }}
                              title="Hapus butir klausul ini"
                            >
                              <Trash2 size={11} />
                              <span>Hapus</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleVesselStrikethrough(el.code)}
                              className={`btn btn-sm ${isStrikethrough ? 'btn-warning' : 'btn-secondary'}`}
                              style={{
                                fontSize: '0.68rem',
                                padding: '0.2rem 0.45rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontWeight: 600
                              }}
                              title={isStrikethrough ? 'Lepas coret klausul (aktifkan kembali)' : 'Coret klausul (Tandai N/A jika tidak dipakai)'}
                            >
                              {isStrikethrough ? (
                                <>
                                  <Undo2 size={11} />
                                  <span>Lepas</span>
                                </>
                              ) : (
                                <>
                                  <Strikethrough size={11} />
                                  <span>Coret</span>
                                </>
                              )}
                            </button>

                            {!isStrikethrough && (
                              <button
                                type="button"
                                onClick={() => handleQuickLogNC(effectiveItem, effectiveResult === 'Major NC' ? 'Major NC' : effectiveResult === 'Observation' ? 'Observation' : 'Minor NC')}
                                className="btn btn-secondary btn-sm"
                                style={{ fontSize: '0.68rem', padding: '0.2rem 0.45rem', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)', fontWeight: 700 }}
                                title="Buat temuan NC untuk klausul ini"
                              >
                                + NC
                              </button>
                            )}
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.68rem', color: isStrikethrough ? '#f59e0b' : '#10b981', fontWeight: 700 }}>
                            {isStrikethrough ? '✂️ Dicoret (N/A)' : '✓ Klausul Standar'}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}

              {/* Empty state: lembaga belum punya template checklist */}
              {activeChecklistItems.length === 0 && customChecklistItems.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={32} color="#94a3b8" />
                      <strong style={{ fontSize: '0.85rem' }}>
                        Belum ada butir checklist untuk {activeChecklistConfig.organizationName || 'lembaga ini'}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '460px', lineHeight: 1.6 }}>
                        {activeChecklistConfig.note || 'Isi checklist setiap lembaga audit berbeda-beda, sehingga butir pemeriksaan perlu disusun sesuai regulasi lembaga terkait.'}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Gunakan panel <strong>Input Item Audit Manual</strong> di atas untuk menambahkan butir pemeriksaan.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
  );
};
