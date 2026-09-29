/**
 * WorkOrderScheduleSection.jsx
 * Diekstrak dari WorkOrderModal.jsx (baris 650-685).
 * Sumber: 3. Prioritas, tanggal permintaan, tanggal dibutuhkan, lokasi pengiriman
 */
import React from 'react';

export const WorkOrderScheduleSection = ({
  formData,
  setFormData,
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '0.75rem' }}>
                    <div>
                      <label className="field-label">Prioritas Pengiriman</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                        className="select-control"
                      >
                        <option value="Rutin / Normal">Rutin / Normal</option>
                        <option value="Penting (Segera)">Penting (Segera)</option>
                        <option value="Mendesak / Emergency">Mendesak / Emergency (Kritis)</option>
                      </select>
                    </div>

                    <div>
                      <label className="field-label">Batas Tgl Dibutuhkan *</label>
                      <input
                        type="date"
                        required
                        value={formData.neededDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, neededDate: e.target.value }))}
                        className="input-control"
                      />
                    </div>

                    <div>
                      <label className="field-label">Lokasi Penyerahan Barang</label>
                      <input
                        type="text"
                        placeholder="Dermaga Pelabuhan Dwikora Pontianak / Muara Jungkat"
                        value={formData.deliveryLocation}
                        onChange={(e) => setFormData(prev => ({ ...prev, deliveryLocation: e.target.value }))}
                        className="input-control"
                      />
                    </div>
                  </div>
  );
};
