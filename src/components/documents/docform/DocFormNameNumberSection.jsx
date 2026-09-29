/**
 * DocFormNameNumberSection.jsx
 * Diekstrak dari DocumentFormModal.jsx (baris 1942-1972).
 * Sumber: Blok 4: nama & nomor dokumen
 */
import React from 'react';
import { MasterCombobox } from '../../common/MasterCombobox';

export const DocFormNameNumberSection = ({
  availableDocumentNames,
  currentProfile,
  formData,
  setFormData,
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Nama Sertifikat / Dokumen *</label>
                  <MasterCombobox
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    options={availableDocumentNames}
                    placeholder="Pilih dari master data atau ketik nama sertifikat baru..."
                    required
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.25rem', display: 'block' }}>
                    Ketik nama resmi sertifikat kapal secara manual. Setiap nama baru otomatis tersimpan ke Data Master dan muncul di pilihan dropdown.
                  </span>
                </div>

                <div>
                  <label className="field-label">Nomor Sertifikat / Dokumen *</label>
                  <input
                    type="text"
                    required
                    placeholder={currentProfile.docNoPlaceholder || 'Contoh: PK.201/KSOP-24587-2026'}
                    value={formData.documentNo}
                    onChange={(e) => setFormData(prev => ({ ...prev, documentNo: e.target.value }))}
                    className="input-control mono"
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
                    Nomor registrasi dokumen resmi yang tercantum pada fisik sertifikat.
                  </span>
                </div>
              </div>
  );
};
