/**
 * DocFormSurveyPeriodSection.jsx
 * Diekstrak dari DocumentFormModal.jsx (baris 1863-1939).
 * Sumber: Blok 3: jenis survey & periode pemeriksaan
 */
import React from 'react';
import { ClipboardCheck, Clock } from 'lucide-react';
import { MasterCombobox } from '../../common/MasterCombobox';

export const DocFormSurveyPeriodSection = ({
  availableSurveyTypes,
  currentProfile,
  formData,
  handleSurveyTypeSelect,
  setFormData,
}) => {
  return (
    <div style={{
                padding: '1.1rem 1.25rem',
                borderRadius: '12px',
                background: 'var(--bg-surface-elevated)',
                border: `1px solid ${currentProfile.borderColor || 'var(--border-subtle)'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                transition: 'border-color 0.25s ease'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.25rem',
                  alignItems: 'start'
                }}>
                  {/* Kolom 1: Jenis Survey */}
                  <div>
                    <label style={{
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      color: currentProfile.color || '#38bdf8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      marginBottom: '0.35rem'
                    }}>
                      <ClipboardCheck size={16} />
                      <span>JENIS SURVEY / PEMERIKSAAN {currentProfile.shortLabel.toUpperCase()} *</span>
                    </label>
                    <MasterCombobox
                      name="surveyType"
                      value={formData.surveyType || ''}
                      onChange={(e) => {
                        handleSurveyTypeSelect(e.target.value);
                      }}
                      options={availableSurveyTypes}
                      placeholder={currentProfile.surveyPlaceholder || 'Pilih dari daftar survey atau ketik manual jenis survey...'}
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '0.35rem', display: 'block' }}>
                      Pilih siklus pemeriksaan atau jenis survey khusus {currentProfile.shortLabel} (bisa diketik manual).
                    </span>
                  </div>

                  {/* Kolom 2: Periode (Diisi Manual) */}
                  <div>
                    <label style={{
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      color: currentProfile.color || '#38bdf8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      marginBottom: '0.35rem'
                    }}>
                      <Clock size={16} />
                      <span>PERIODE SURVEY (DIISI MANUAL) *</span>
                    </label>
                    <input
                      type="text"
                      name="surveyPeriod"
                      placeholder="Contoh: 1 Tahun / Periode 2025 - 2026 / Annual ke-2..."
                      value={formData.surveyPeriod || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, surveyPeriod: e.target.value }))}
                      className="input-control"
                      style={{ fontWeight: 600, height: '40px' }}
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '0.35rem', display: 'block' }}>
                      Ketik periode pemeriksaan atau masa berlaku survey secara manual (bebas teks).
                    </span>
                  </div>
                </div>
              </div>
  );
};
