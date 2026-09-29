/**
 * DocFormVesselSection.jsx
 * Diekstrak dari DocumentFormModal.jsx (baris 1818-1860).
 * Sumber: Blok 1-2: pemilihan kapal armada
 */
import React from 'react';
import { getCategoryProfile } from './docFormProfiles';

export const DocFormVesselSection = ({
  formData,
  setFormData,
  vessels,
}) => {
  return (
    <div>
                    <label className="field-label" style={{ fontWeight: 700 }}>Kapal Terkait *</label>
                    <select
                      value={formData.vesselId}
                      onChange={(e) => {
                        const newVId = e.target.value;
                        const selVessel = vessels.find(v => v.id === newVId);
                        const portName = selVessel?.portOfRegistry?.split(',')[0]?.trim() || 'Pontianak';
                        setFormData(prev => {
                          const prof = getCategoryProfile(prev.category);
                          const autoIssuer = prof.defaultIssuer ? prof.defaultIssuer(portName) : prev.issuer;
                          return {
                            ...prev,
                            vesselId: newVId,
                            issuer: (!prev.issuer || prev.issuer.includes('KSOP') || prev.issuer.includes('BKI') || prev.issuer.includes('KKP')) ? autoIssuer : prev.issuer
                          };
                        });
                      }}
                      className="select-control"
                      required
                    >
                      {vessels.length === 0 ? (
                        <option value="" disabled>-- Belum ada kapal (Silakan daftarkan kapal dahulu) --</option>
                      ) : (
                        <>
                          {vessels.some(v => v.ownershipStatus !== 'As Operator') && (
                            <optgroup label={`⚓ AS OWNER (${vessels.filter(v => v.ownershipStatus !== 'As Operator').length} Kapal)`}>
                              {vessels.filter(v => v.ownershipStatus !== 'As Operator').map(v => (
                                <option key={v.id} value={v.id}>🚢 {v.name} [Owner]</option>
                              ))}
                            </optgroup>
                          )}
                          {vessels.some(v => v.ownershipStatus === 'As Operator') && (
                            <optgroup label={`⚙️ AS OPERATOR (${vessels.filter(v => v.ownershipStatus === 'As Operator').length} Kapal)`}>
                              {vessels.filter(v => v.ownershipStatus === 'As Operator').map(v => (
                                <option key={v.id} value={v.id}>⚙️ {v.name} [Operator]</option>
                              ))}
                            </optgroup>
                          )}
                        </>
                      )}
                    </select>
                  </div>
  );
};
