/**
 * WorkOrderNotesField.jsx
 * Diekstrak dari WorkOrderModal.jsx (baris 876-886).
 * Sumber: 5. Catatan tambahan untuk gudang
 */
import React from 'react';

export const WorkOrderNotesField = ({
  formData,
  setFormData,
}) => {
  return (
    <div>
                    <label className="field-label">Catatan / Instruksi Tambahan untuk Petugas Gudang</label>
                    <textarea
                      rows="2"
                      placeholder="Catatan tambahan seperti jam penyerahan, kontak agen pelabuhan, dll."
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      className="input-control"
                      style={{ fontSize: '0.825rem' }}
                    />
                  </div>
  );
};
