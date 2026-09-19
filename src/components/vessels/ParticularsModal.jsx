import React, { useState, useEffect } from 'react';
import {
  Ship,
  X,
  Save,
  RotateCcw,
  Maximize2,
  Cpu,
  Fuel,
  Anchor,
  Radio,
  Shield,
  Users,
  Search,
  Check,
  AlertCircle
} from 'lucide-react';
import { PARTICULAR_SECTIONS, createDefaultShipParticulars } from '../../data/shipParticularsData';

const SECTION_ICONS = {
  general: Ship,
  dimensions: Maximize2,
  machinery: Cpu,
  tanks: Fuel,
  deck: Anchor,
  navigation: Radio,
  safety: Shield,
  accommodation: Users
};

export const ParticularsModal = ({ vessel, isOpen, onClose, onSave }) => {
  if (!isOpen || !vessel) return null;

  const [activeSection, setActiveSection] = useState('general');
  const [searchFilter, setSearchFilter] = useState('');
  const [formData, setFormData] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Initialize or update form data when vessel changes
  useEffect(() => {
    const existing = vessel.particulars || createDefaultShipParticulars(vessel);
    setFormData({ ...existing });
    setIsDirty(false);
  }, [vessel]);

  const handleFieldChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
    setIsDirty(true);
  };

  const handleResetToDefault = () => {
    if (window.confirm(`Kembalikan data particular ${vessel.name} ke spesifikasi standar bawaan armada?`)) {
      const defaults = createDefaultShipParticulars(vessel);
      setFormData(defaults);
      setIsDirty(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(vessel.id, formData);
    setIsDirty(false);
    onClose();
  };

  // Filter fields if search query is provided
  const filterQuery = searchFilter.toLowerCase().trim();

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(2, 6, 23, 0.82)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '1.25rem'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '1050px',
        height: '92vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-surface-elevated)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(2, 132, 199, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Ship size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                  Edit Data Particular Kapal: {vessel.name}
                </h3>
                <span className={`badge ${vessel.ownershipStatus === 'As Operator' ? 'badge-info' : 'badge-success'}`} style={{ fontSize: '0.72rem' }}>
                  {vessel.ownershipStatus || 'As Owner'}
                </span>
                {isDirty && (
                  <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                    Ada Perubahan Belum Disimpan
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                No. Reg BKI: <strong className="mono" style={{ color: 'var(--text-main)' }}>{vessel.regNo || vessel.imo}</strong> • {vessel.type}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Quick Search */}
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={14} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Cari spesifikasi..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="input-control"
                style={{ paddingLeft: '2.2rem', paddingRight: '0.75rem', fontSize: '0.78rem', height: '34px' }}
              />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ width: '34px', height: '34px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body: Sidebar Sections & Form Area */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', flex: 1, minHeight: 0 }}>
          {/* Section Navigation Column */}
          <div style={{
            borderRight: '1px solid var(--border-subtle)',
            background: 'rgba(0, 0, 0, 0.15)',
            padding: '1rem 0.75rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.5rem 0.4rem' }}>
              Kategori Spesifikasi
            </span>
            {PARTICULAR_SECTIONS.map(section => {
              const Icon = SECTION_ICONS[section.id] || Ship;
              const isActive = activeSection === section.id && !filterQuery;

              // Count matches if filtering
              const matchCount = filterQuery
                ? section.fields.filter(f => f.label.toLowerCase().includes(filterQuery) || (formData[f.key] && String(formData[f.key]).toLowerCase().includes(filterQuery))).length
                : 0;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => {
                    setActiveSection(section.id);
                    setSearchFilter('');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: isActive
                      ? 'linear-gradient(90deg, rgba(2, 132, 199, 0.2) 0%, rgba(2, 132, 199, 0.05) 100%)'
                      : 'transparent',
                    color: isActive ? '#38bdf8' : 'var(--text-main)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    borderLeft: isActive ? '3px solid #38bdf8' : '3px solid transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Icon size={16} color={isActive ? '#38bdf8' : 'var(--text-subtle)'} />
                    <span>{section.title}</span>
                  </div>
                  {filterQuery && matchCount > 0 && (
                    <span className="badge badge-info" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                      {matchCount}
                    </span>
                  )}
                </button>
              );
            })}

            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}
              >
                <RotateCcw size={13} />
                <span>Reset ke Standar Kapal</span>
              </button>
            </div>
          </div>

          {/* Form Content Area */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem 2rem' }}>
              {filterQuery ? (
                // Filtered Results View across all sections
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    <Search size={15} />
                    <span>Hasil pencarian spesifikasi untuk: "<strong>{filterQuery}</strong>"</span>
                  </div>

                  {PARTICULAR_SECTIONS.map(section => {
                    const matchedFields = section.fields.filter(f =>
                      f.label.toLowerCase().includes(filterQuery) ||
                      (formData[f.key] && String(formData[f.key]).toLowerCase().includes(filterQuery))
                    );

                    if (matchedFields.length === 0) return null;

                    return (
                      <div key={section.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.35rem' }}>
                          {section.title}
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                          {matchedFields.map(field => (
                            <FieldInput
                              key={field.key}
                              field={field}
                              value={formData[field.key]}
                              onChange={(val) => handleFieldChange(field.key, val)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Normal Section View
                (() => {
                  const currentSectionConfig = PARTICULAR_SECTIONS.find(s => s.id === activeSection) || PARTICULAR_SECTIONS[0];
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                          {currentSectionConfig.title}
                        </h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {currentSectionConfig.subtitle}
                        </p>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: currentSectionConfig.fields.length > 8 ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
                        gap: '1.15rem'
                      }}>
                        {currentSectionConfig.fields.map(field => (
                          <FieldInput
                            key={field.key}
                            field={field}
                            value={formData[field.key]}
                            onChange={(val) => handleFieldChange(field.key, val)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            {/* Modal Action Footer */}
            <div style={{
              padding: '1rem 1.75rem',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface-elevated)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {formData.lastUpdated ? (
                  <span>Terakhir diperbarui: {new Date(formData.lastUpdated).toLocaleString('id-ID')}</span>
                ) : (
                  <span>Spesifikasi teknis resmi BKI & PT. Pelayaran Baharimas Kalimantan</span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 1.15rem', fontSize: '0.825rem' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1.35rem',
                    fontSize: '0.825rem',
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
                  }}
                >
                  <Save size={15} />
                  <span>Simpan Perubahan Particular</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Reusable individual field input component
const FieldInput = ({ field, value, onChange }) => {
  const isFullWidth = field.type === 'textarea';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.35rem',
      gridColumn: isFullWidth ? 'span 2' : 'span 1'
    }}>
      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
        <span>
          {field.label} {field.required && <strong style={{ color: '#ef4444' }}>*</strong>}
        </span>
        {field.unit && (
          <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>({field.unit})</span>
        )}
      </label>

      {field.type === 'textarea' ? (
        <textarea
          rows={3}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="input-control"
          style={{ resize: 'vertical', fontSize: '0.825rem', lineHeight: '1.4' }}
        />
      ) : field.type === 'select' ? (
        <select
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="select-control"
          style={{ fontSize: '0.825rem' }}
        >
          {field.options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={field.type || 'text'}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          className="input-control"
          style={{ fontSize: '0.825rem' }}
        />
      )}
    </div>
  );
};
