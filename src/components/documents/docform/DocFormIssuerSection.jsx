/**
 * DocFormIssuerSection.jsx
 * Diekstrak dari DocumentFormModal.jsx (baris 1975-2021).
 * Sumber: Blok 5: surveyor/auditor & issuer
 */
import React from 'react';
import { Building2, UserCheck } from 'lucide-react';

export const DocFormIssuerSection = ({
  currentProfile,
  formData,
  setFormData,
}) => {
  return (
    <div style={{
                display: 'grid',
                gridTemplateColumns: '1.1fr 1fr',
                gap: '1rem',
                padding: '1rem',
                borderRadius: '10px',
                background: currentProfile.bgColor,
                border: `1px solid ${currentProfile.borderColor}`,
                transition: 'all 0.25s ease'
              }}>
                <div>
                  <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: currentProfile.color }}>
                    <UserCheck size={15} />
                    <span>{currentProfile.auditorLabel || 'Nama Surveyor *'}</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={currentProfile.auditorPlaceholder || 'Contoh: Nama Surveyor...'}
                    value={formData.mandatoryAuditor}
                    onChange={(e) => setFormData(prev => ({ ...prev, mandatoryAuditor: e.target.value }))}
                    className="input-control"
                    style={{ fontWeight: 600 }}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
                    {currentProfile.auditorHelper || 'Nama surveyor yang bertugas memeriksa kapal ini.'}
                  </span>
                </div>

                <div>
                  <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Building2 size={15} />
                    <span>Instansi Penerbit (Issuer) *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={currentProfile.issuerPlaceholder || 'Contoh: KSOP Kelas II Pontianak / BKI'}
                    value={formData.issuer}
                    onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
                    className="input-control"
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
                    Otoritas pelabuhan atau badan sertifikasi resmi.
                  </span>
                </div>
              </div>
  );
};
