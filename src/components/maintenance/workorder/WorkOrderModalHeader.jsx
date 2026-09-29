/**
 * WorkOrderModalHeader.jsx
 * Diekstrak dari WorkOrderModal.jsx (baris 415-478).
 * Sumber: Top bar modal: ikon, judul form/surat, badge nomor dokumen, tombol ganti mode + tutup
 */
import React from 'react';
import { ArrowLeft, FileText, Package, X } from 'lucide-react';

export const WorkOrderModalHeader = ({
  currentVessel,
  formData,
  onClose,
  setViewMode,
  viewMode,
}) => {
  return (
    <div className="modal-header no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8'
                }}>
                  <Package size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                      {viewMode === 'letter'
                        ? 'Surat Permintaan Barang ke Gudang'
                        : 'Formulir Permintaan Barang ke Gudang'}
                    </h3>
                    <span className="badge badge-info" style={{ fontSize: '0.68rem', fontFamily: 'monospace' }}>
                      {formData.documentNo}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {currentVessel?.name} • Divisi Logistik & Gudang Armada PT. Pelayaran Baharimas Kalimantan
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {viewMode === 'letter' ? (
                  <button
                    type="button"
                    onClick={() => setViewMode('form')}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
                  >
                    <ArrowLeft size={14} />
                    <span>Edit Kembali Form</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setViewMode('letter')}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
                  >
                    <FileText size={14} />
                    <span>Lihat Surat Permintaan</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                  title="Tutup"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
  );
};
