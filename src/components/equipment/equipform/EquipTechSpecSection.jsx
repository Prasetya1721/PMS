/**
 * EquipTechSpecSection.jsx
 * Diekstrak dari EquipmentFormModal.jsx (baris 373-462).
 * Sumber: Seksi Spesifikasi Teknis & Pabrikan (maker, model, serial, daya)
 */
import React from 'react';
import { Cpu } from 'lucide-react';

export const EquipTechSpecSection = ({
  criticality,
  installedDate,
  maker,
  model,
  serialNumber,
  setCriticality,
  setInstalledDate,
  setMaker,
  setModel,
  setSerialNumber,
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Cpu size={18} color="#a855f7" />
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                      Spesifikasi Teknis & Pabrikan (Maker)
                    </h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {/* Maker */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        Pabrikan / Maker
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Yanmar / Caterpillar / Cummins / Sperre"
                        value={maker}
                        onChange={(e) => setMaker(e.target.value)}
                        className="input-control"
                      />
                    </div>

                    {/* Model */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        Model / Tipe Mesin
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: 6EY26W (1600 BHP) / HL2/90"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="input-control"
                      />
                    </div>

                    {/* Serial Number */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        Nomor Seri (Serial Number)
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: YN-6EY-22082-P"
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                        className="input-control mono"
                      />
                    </div>

                    {/* Criticality */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        Tingkat Kritikalitas Operasional
                      </label>
                      <select
                        value={criticality}
                        onChange={(e) => setCriticality(e.target.value)}
                        className="select-control"
                        style={{ width: '100%' }}
                      >
                        <option value="Kritis">🔴 Kritis (Critical Ship Stop)</option>
                        <option value="Tinggi">🟠 Tinggi (Major Nav & Safety)</option>
                        <option value="Sedang">🔵 Sedang (Daily Operations)</option>
                        <option value="Rendah">⚪ Rendah (Auxiliary Support)</option>
                      </select>
                    </div>

                    {/* Installed Date */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        Tanggal Pemasangan / Commissioning
                      </label>
                      <input
                        type="date"
                        value={installedDate}
                        onChange={(e) => setInstalledDate(e.target.value)}
                        className="input-control"
                      />
                    </div>
                  </div>
                </div>
  );
};
