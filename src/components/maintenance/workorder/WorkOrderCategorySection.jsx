/**
 * WorkOrderCategorySection.jsx
 * Diekstrak dari WorkOrderModal.jsx (baris 488-595).
 * Sumber: 1. Kartu pilih kategori kebutuhan: Kebutuhan Kapal vs Kebutuhan Crew
 */
import React from 'react';
import { Ship, Users } from 'lucide-react';

export const WorkOrderCategorySection = ({
  SUB_CATEGORIES,
  formData,
  handleMainCategoryChange,
  setFormData,
}) => {
  return (
    <div>
                    <label className="field-label" style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      1. Pilih Kategori Kebutuhan *
                    </label>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      {/* Card Kebutuhan Kapal */}
                      <div
                        onClick={() => handleMainCategoryChange('Kebutuhan Kapal')}
                        style={{
                          padding: '0.9rem 1rem',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          border: formData.mainCategory === 'Kebutuhan Kapal'
                            ? '2px solid #38bdf8'
                            : '1px solid var(--border-subtle)',
                          background: formData.mainCategory === 'Kebutuhan Kapal'
                            ? 'rgba(56, 189, 248, 0.12)'
                            : 'rgba(255, 255, 255, 0.02)',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem'
                        }}
                      >
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          background: formData.mainCategory === 'Kebutuhan Kapal' ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)',
                          color: formData.mainCategory === 'Kebutuhan Kapal' ? '#0f172a' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Ship size={22} />
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.925rem', color: 'var(--text-primary)', display: 'block' }}>
                            ⚓ Kebutuhan Kapal
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Deck, Mesin, Oli/Pelumas, Cat Lambung, Tali Towing, Alat SOLAS
                          </span>
                        </div>
                      </div>

                      {/* Card Kebutuhan Crew (Craw) */}
                      <div
                        onClick={() => handleMainCategoryChange('Kebutuhan Crew')}
                        style={{
                          padding: '0.9rem 1rem',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          border: formData.mainCategory === 'Kebutuhan Crew'
                            ? '2px solid #10b981'
                            : '1px solid var(--border-subtle)',
                          background: formData.mainCategory === 'Kebutuhan Crew'
                            ? 'rgba(16, 185, 129, 0.12)'
                            : 'rgba(255, 255, 255, 0.02)',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem'
                        }}
                      >
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          background: formData.mainCategory === 'Kebutuhan Crew' ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
                          color: formData.mainCategory === 'Kebutuhan Crew' ? '#0f172a' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Users size={22} />
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.925rem', color: 'var(--text-primary)', display: 'block' }}>
                            👥 Kebutuhan Crew (Awak Kapal)
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Bahan Makanan/Galley, Air Minum, APD Pelaut, Mess, P3K & Sabun
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sub-Category Dropdown */}
                    <div style={{ marginTop: '0.65rem' }}>
                      <label className="field-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Sub-Kategori Spesifikasi:
                      </label>
                      <select
                        value={formData.subCategory}
                        onChange={(e) => setFormData(prev => ({ ...prev, subCategory: e.target.value }))}
                        className="select-control"
                        style={{ fontSize: '0.825rem', fontWeight: 600 }}
                      >
                        {SUB_CATEGORIES[formData.mainCategory].map(sc => (
                          <option key={sc} value={sc}>{sc}</option>
                        ))}
                      </select>
                    </div>
                  </div>
  );
};
