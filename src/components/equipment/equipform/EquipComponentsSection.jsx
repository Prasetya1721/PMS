/**
 * EquipComponentsSection.jsx
 * Diekstrak dari EquipmentFormModal.jsx (baris 656-766).
 * Sumber: Seksi Hierarki Komponen Kritis & Suku Cadang Terkait
 */
import React from 'react';
import { Layers, Plus, Tag, X } from 'lucide-react';

export const EquipComponentsSection = ({
  category,
  handleAddSubComponent,
  handleRemoveSubComponent,
  setSubComponents,
  setSubInput,
  subComponents,
  subInput,
  suggestedComponents,
  theme,
}) => {
  return (
    <div
                  style={{
                    background: theme === 'light' ? '#f8fafc' : 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '1.25rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <Layers size={18} color="#06b6d4" />
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                      Hierarki Komponen Kritis & Suku Cadang Terkait
                    </h4>
                  </div>

                  {/* Tag Input */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <input
                      type="text"
                      placeholder="Ketik nama komponen (misal: Fuel Injector, Turbocharger, Impeller)..."
                      value={subInput}
                      onChange={(e) => setSubInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubComponent();
                        }
                      }}
                      className="input-control"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={handleAddSubComponent}
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Plus size={15} />
                      <span>Tambah Komponen</span>
                    </button>
                  </div>

                  {/* Suggestions chips */}
                  <div style={{ marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginRight: '0.4rem' }}>
                      Saran Komponen ({category}):
                    </span>
                    <div style={{ display: 'inline-flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                      {suggestedComponents.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (!subComponents.includes(item)) {
                              setSubComponents(prev => [...prev, item]);
                            }
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}
                        >
                          + {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Current Subcomponents Badges */}
                  <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', minHeight: '36px', alignItems: 'center' }}>
                    {subComponents.length === 0 ? (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        Belum ada sub-komponen ditambahkan. Tambahkan komponen untuk memudahkan manajemen suku cadang.
                      </span>
                    ) : (
                      subComponents.map((item, idx) => (
                        <span
                          key={idx}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.3rem 0.65rem',
                            borderRadius: '6px',
                            background: 'rgba(56, 189, 248, 0.12)',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            color: '#38bdf8',
                            fontSize: '0.8rem',
                            fontWeight: 600
                          }}
                        >
                          <Tag size={12} />
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubComponent(item)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '0 0.1rem',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <X size={13} />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
  );
};
