/**
 * TechnicalWOSopChecklist.jsx
 * Diekstrak dari TechnicalWorkOrderModal.jsx (baris 512-597).
 * Sumber: Bagian 2: checklist prosedur standar operasional (SOP steps)
 */
import React from 'react';
import { CheckCircle2, Plus, Trash2 } from 'lucide-react';

export const TechnicalWOSopChecklist = ({
  handleAddSopStep,
  handleRemoveSopStep,
  handleToggleSop,
  isCompleted,
  newStepText,
  setNewStepText,
  sopSteps,
}) => {
  return (
    <div style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={18} color="#10b981" />
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>2. Checklist Langkah Kerja (SOP ISM Code)</h4>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {sopSteps.filter(s => s.done).length} dari {sopSteps.length} langkah selesai
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {sopSteps.map((step, idx) => (
                      <div
                        key={step.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          background: step.done ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                          border: step.done ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)'
                        }}
                      >
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: isCompleted ? 'default' : 'pointer', flex: 1, margin: 0 }}>
                          <input
                            type="checkbox"
                            checked={step.done}
                            disabled={isCompleted}
                            onChange={() => handleToggleSop(step.id)}
                            style={{ width: '16px', height: '16px', accentColor: '#10b981' }}
                          />
                          <span style={{
                            fontSize: '0.85rem',
                            textDecoration: step.done ? 'line-through' : 'none',
                            color: step.done ? 'var(--text-muted)' : 'var(--text-main)'
                          }}>
                            <strong style={{ marginRight: '6px' }}>{idx + 1}.</strong> {step.title}
                          </span>
                        </label>

                        {!isCompleted && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSopStep(step.id)}
                            style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {!isCompleted && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <input
                        type="text"
                        value={newStepText}
                        onChange={(e) => setNewStepText(e.target.value)}
                        placeholder="Tambah langkah checklist baru..."
                        className="input-base"
                        style={{ flex: 1 }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSopStep(); } }}
                      />
                      <button
                        type="button"
                        onClick={handleAddSopStep}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                      >
                        <Plus size={15} />
                        <span>Tambah Langkah</span>
                      </button>
                    </div>
                  )}
                </div>
  );
};
