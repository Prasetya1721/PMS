/**
 * WorkOrderVesselPicSection.jsx
 * Diekstrak dari WorkOrderModal.jsx (baris 598-647).
 * Sumber: 2. Armada kapal, pemohon (PIC) dan jabatannya
 */
import React from 'react';

export const WorkOrderVesselPicSection = ({
  formData,
  setFormData,
  vesselCrewList,
  vessels,
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="field-label">Kapal Pemohon *</label>
                      <select
                        value={formData.vesselId}
                        onChange={(e) => setFormData(prev => ({ ...prev, vesselId: e.target.value }))}
                        className="select-control"
                      >
                        {vessels.map(v => (
                          <option key={v.id} value={v.id}>
                            {v.name} ({v.ownershipStatus || 'Owner'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="field-label">PIC / Pemohon (Person In Charge) *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Ir. Bambang Wijaya (KKM)"
                        value={formData.picName}
                        onChange={(e) => setFormData(prev => ({ ...prev, picName: e.target.value }))}
                        className="input-control"
                      />
                      {/* Quick Crew PIC Dropdown Selector */}
                      <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.25rem', overflowX: 'auto' }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Pilih Cepat:</span>
                        {vesselCrewList.slice(0, 3).map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, picName: c.name, picRole: c.rank }))}
                            className="badge"
                            style={{
                              fontSize: '0.65rem',
                              background: formData.picName === c.name ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                              color: formData.picName === c.name ? '#38bdf8' : 'var(--text-muted)',
                              border: '1px solid var(--border-subtle)',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {c.name.split(',')[0]} ({c.rank.split(' ')[0]})
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
  );
};
