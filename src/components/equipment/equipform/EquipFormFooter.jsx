/**
 * EquipFormFooter.jsx
 * Diekstrak dari EquipmentFormModal.jsx (baris 796-828).
 * Sumber: Kaki modal: tombol batal dan simpan
 */
import React from 'react';
import { Save } from 'lucide-react';

export const EquipFormFooter = ({
  isEdit,
  onClose,
}) => {
  return (
    <div
                className="modal-footer"
                style={{
                  padding: '1rem 1.5rem',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg-surface)'
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Data tersimpan otomatis di database cloud PMS PT. Pelayaran Baharimas Kalimantan
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-secondary"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: '140px', justifyContent: 'center' }}
                  >
                    <Save size={16} />
                    <span>{isEdit ? 'Simpan Perubahan' : 'Simpan Equipment'}</span>
                  </button>
                </div>
              </div>
  );
};
