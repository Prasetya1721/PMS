/**
 * WorkOrderFormFooter.jsx
 * Diekstrak dari WorkOrderModal.jsx (baris 890-905).
 * Sumber: Tombol aksi bawah form: batal, simpan draf, buat surat permintaan
 */
import React from 'react';
import { FileText } from 'lucide-react';

export const WorkOrderFormFooter = ({
  onClose,
}) => {
  return (
    <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button type="button" onClick={onClose} className="btn btn-secondary">
                    Batal
                  </button>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
                    >
                      <FileText size={16} />
                      <span>Terbitkan & Cetak Surat Permintaan</span>
                    </button>
                  </div>
                </div>
  );
};
