/**
 * DocSessionInfoBanner.jsx
 * Diekstrak dari DocSessionModal.jsx (baris 421-457).
 * Sumber: Banner petunjuk khusus audit DOC kantor pusat
 */
import React from 'react';
import { Building2 } from 'lucide-react';

export const DocSessionInfoBanner = ({
}) => {
  return (
    <div style={{
                padding: '0.8rem 1rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.02) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#f59e0b',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px'
                }}>
                  <Building2 size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '0.82rem', color: '#d97706' }}>
                      PETUNJUK PELAKSANAAN AUDIT DOC (DOCUMENT OF COMPLIANCE - KANTOR PUSAT)
                    </strong>
                    <span className="badge badge-warning" style={{ fontSize: '0.62rem' }}>BKI Rev 06 (13 Seksi)</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-main)', marginTop: '0.35rem', lineHeight: '1.5' }}>
                    <div>• <strong>Fokus Pengujian:</strong> Tata kelola SMS darat PT. PBK, kebijakan keselamatan & lingkungan, kualifikasi & rekrutmen kru kapal (HR/Crewing), dukungan pemeliharaan teknis armada, sistem logistik suku cadang kritis, kesiapan Tim Tanggap Darurat Kantor (ERT), dan Rapat Tinjauan Manajemen (Management Review).</div>
                    <div>• <strong>Auditee Darat:</strong> Jajaran Direksi, DPA (Designated Person Ashore), Superintendent Teknis, Kepala Departemen HR/Crewing, Logistik & Pengadaan, serta HSSE.</div>
                    <div>• <strong>Hasil Sesi Tahap 1:</strong> Penetapan nomor registrasi audit DOC kantor pusat, pengesahan tim auditor independen, dan pemasangan otomatis 13 Seksi ISM Code resmi BKI F23.14.05 Rev 06.</div>
                  </div>
                </div>
              </div>
  );
};
