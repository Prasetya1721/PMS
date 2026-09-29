/**
 * RoleFlowHeader.jsx
 * Diekstrak dari AuditRoleFlowModal.jsx (baris 476-539).
 * Sumber: Header modal (judul + tombol tutup)
 */
import React from 'react';
import { Building2, Ship, X } from 'lucide-react';

export const RoleFlowHeader = ({
  isDoc,
  onClose,
}) => {
  return (
    <div
              style={{
                padding: '1rem 1.5rem',
                background: isDoc
                  ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, var(--bg-surface) 100%)'
                  : 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, var(--bg-surface) 100%)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: isDoc
                      ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
                      : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: isDoc
                      ? '0 4px 14px rgba(217, 119, 6, 0.35)'
                      : '0 4px 14px rgba(2, 132, 199, 0.35)'
                  }}
                >
                  {isDoc ? <Building2 size={22} /> : <Ship size={22} />}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.12rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                      {isDoc
                        ? 'Petunjuk & Alur Kerja: Audit DOC (Kantor Pusat PT. PBK)'
                        : 'Petunjuk & Alur Kerja: Audit SMC (Kapal Armada Onboard)'}
                    </h3>
                    <span className={`badge ${isDoc ? 'badge-warning' : 'badge-primary'}`} style={{ fontSize: '0.7rem', fontWeight: 800 }}>
                      {isDoc ? '🏢 STANDAR BKI DOC REV 06 (13 SEKSI)' : '🚢 STANDAR BKI SMC REV 05 (74 KLAUSUL)'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                    {isDoc
                      ? 'Panduan tata kelola SMS darat perusahaan, pembagian peran Auditor/DPA vs Departemen Darat & Direksi, serta Matriks RACI DOC.'
                      : 'Panduan pengujian fisik kelaiklautan kapal, alur kolaborasi DPA (Darat) vs Nakhoda (Kapal Onboard), serta Matriks RACI SMC.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.4rem', borderRadius: '8px' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
  );
};
