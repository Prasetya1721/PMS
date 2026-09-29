/**
 * ShipParticularsSections.jsx
 * Diekstrak dari ShipParticularsView.jsx.orig (baris 380-466).
 * Sumber: Grid semua kategori spesifikasi beserta atributnya
 */
import React from 'react';
import { Ship } from 'lucide-react';
import { PARTICULAR_SECTIONS } from '../../../data/shipParticularsData';
import { SECTION_ICONS } from './sectionIcons';

export const ShipParticularsSections = ({
  activeTab,
  particulars,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {PARTICULAR_SECTIONS.map(section => {
                const isSelectedOnScreen = activeTab === 'all' || activeTab === section.id;
                const Icon = SECTION_ICONS[section.id] || Ship;
                return (
                  <div
                    key={section.id}
                    className={`particular-section-block ${!isSelectedOnScreen ? 'particular-section-screen-hidden' : ''}`}
                    style={{
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-surface-elevated)',
                      overflow: 'hidden',
                      pageBreakInside: 'avoid',
                      breakInside: 'avoid'
                    }}
                  >
                    {/* Section Header */}
                    <div
                      className="particular-section-header"
                      style={{
                        padding: '0.75rem 1.25rem',
                        background: 'rgba(2, 132, 199, 0.08)',
                        borderBottom: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Icon size={17} color="#38bdf8" />
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>{section.title}</h4>
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '1px 0 0 0' }}>{section.subtitle}</p>
                        </div>
                      </div>
                      <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                        {section.fields.length} Atribut
                      </span>
                    </div>

                    {/* Section Attributes Grid */}
                    <div
                      className="particular-fields-grid"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1px',
                        background: 'var(--border-subtle)'
                      }}
                    >
                      {section.fields.map(field => {
                        const val = particulars[field.key];
                        const isFullWidth = field.type === 'textarea' || (val && String(val).length > 60);

                        return (
                          <div
                            key={field.key}
                            className="particular-field-cell"
                            style={{
                              padding: '0.65rem 1.15rem',
                              background: 'var(--bg-surface)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.15rem',
                              gridColumn: isFullWidth ? 'span 2' : 'span 1'
                            }}
                          >
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
                              {field.label}
                            </span>
                            <div style={{
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              color: val ? 'var(--text-main)' : 'var(--text-muted)',
                              lineHeight: 1.4
                            }}>
                              {val || '-'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
  );
};
