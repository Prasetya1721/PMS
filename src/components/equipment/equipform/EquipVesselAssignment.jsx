/**
 * EquipVesselAssignment.jsx
 * Diekstrak dari EquipmentFormModal.jsx (baris 265-370).
 * Sumber: Seksi Penugasan Kapal & Identitas Utama (nama, kode, kategori, kapal)
 */
import React from 'react';
import { Ship } from 'lucide-react';

export const EquipVesselAssignment = ({
  category,
  categoryOptions,
  code,
  location,
  locationPresets,
  name,
  setCategory,
  setCode,
  setLocation,
  setName,
  setVesselId,
  theme,
  vesselId,
  vessels,
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Ship size={18} color="#38bdf8" />
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                      Penugasan Kapal & Identitas Utama
                    </h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    {/* Vessel Assignment */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        Kapal Armada <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <select
                        value={vesselId}
                        onChange={(e) => setVesselId(e.target.value)}
                        required
                        className="select-control"
                        style={{ width: '100%' }}
                      >
                        {vessels.map(v => (
                          <option key={v.id} value={v.id}>
                            {v.name} ({v.type || 'Tugboat'})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Equipment Code */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        Kode Equipment <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: ME-01, AE-01, GB-01, AW-01"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="input-control mono"
                        style={{ fontWeight: 700 }}
                      />
                    </div>

                    {/* Equipment Name */}
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        Nama Lengkap Equipment / Mesin <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Main Engine Portside (Mesin Induk Kiri)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-control"
                        style={{ fontSize: '0.95rem', fontWeight: 600 }}
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        Kategori Sistem PMS <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="select-control"
                        style={{ width: '100%' }}
                      >
                        {categoryOptions.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Location */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        Lokasi Penempatan di Kapal
                      </label>
                      <input
                        type="text"
                        list="locations-list"
                        placeholder="Contoh: Engine Room Portside"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="input-control"
                      />
                      <datalist id="locations-list">
                        {locationPresets.map((loc, idx) => (
                          <option key={idx} value={loc} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                </div>
  );
};
