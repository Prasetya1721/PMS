/**
 * ShipParticularsTabs.jsx
 * Diekstrak dari ShipParticularsView.jsx.orig (baris 330-377).
 * Sumber: Tab navigasi kategori spesifikasi beserta ikon per kategori
 */
import React from 'react';
import { Ship } from 'lucide-react';
import { PARTICULAR_SECTIONS } from '../../../data/shipParticularsData';
import { SECTION_ICONS } from './sectionIcons';

export const ShipParticularsTabs = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.45rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.75rem'
            }} className="no-print">
              <button
                onClick={() => setActiveTab('all')}
                className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.42rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: activeTab === 'all' ? 700 : 500,
                  whiteSpace: 'nowrap',
                  borderRadius: '8px'
                }}
              >
                Semua Spesifikasi ({PARTICULAR_SECTIONS.length} Kategori)
              </button>
              {PARTICULAR_SECTIONS.map(section => {
                const Icon = SECTION_ICONS[section.id] || Ship;
                const isActive = activeTab === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveTab(section.id)}
                    className={`tab-btn ${isActive ? 'active' : ''}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.42rem 0.85rem',
                      fontSize: '0.78rem',
                      fontWeight: isActive ? 700 : 500,
                      whiteSpace: 'nowrap',
                      borderRadius: '8px'
                    }}
                  >
                    <Icon size={14} color={isActive ? '#38bdf8' : 'var(--text-subtle)'} />
                    <span>{section.title}</span>
                  </button>
                );
              })}
            </div>
  );
};
