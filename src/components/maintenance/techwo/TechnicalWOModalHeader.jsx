/**
 * TechnicalWOModalHeader.jsx
 * Diekstrak dari TechnicalWorkOrderModal.jsx (baris 278-349).
 * Sumber: Header modal: ikon, judul WO, badge status, tombol tutup
 */
import React from 'react';
import { FileText, Wrench, X } from 'lucide-react';

export const TechnicalWOModalHeader = ({
  currentVessel,
  isCompleted,
  isEdit,
  onClose,
  setViewMode,
  viewMode,
  workOrder,
}) => {
  return (
    <div className="modal-header no-print" style={{
              padding: '1.25rem 1.75rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(to right, rgba(2, 132, 199, 0.12), rgba(15, 23, 42, 0.6))',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8'
                }}>
                  <Wrench size={24} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                      {isEdit ? `Work Order: ${workOrder.id}` : 'Perintah Kerja Pemeliharaan Teknis (Job Order)'}
                    </h3>
                    <span className={`badge ${
                      isCompleted ? 'badge-success' :
                      workOrder?.status === 'In Progress' ? 'badge-info' : 'badge-warning'
                    }`}>
                      {isCompleted ? 'Selesai & Tertutup' : (workOrder?.status || 'Scheduled')}
                    </span>
                    <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                      Standard ISM Code 10.1 & BKI
                    </span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                    Kapal: <strong style={{ color: 'var(--text-main)' }}>{currentVessel?.name}</strong> • Formulir pemeliharaan mesin, SOP, konsumsi suku cadang, dan penutupan siklus PMS.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {isEdit && (
                  <button
                    type="button"
                    onClick={() => setViewMode(viewMode === 'edit' ? 'print_report' : 'edit')}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                  >
                    <FileText size={15} />
                    <span>{viewMode === 'edit' ? 'Format Cetak WO' : 'Form Input'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <X size={22} />
                </button>
              </div>
            </div>
  );
};
