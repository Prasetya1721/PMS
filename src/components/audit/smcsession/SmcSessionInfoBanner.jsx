/**
 * SmcSessionInfoBanner.jsx
 * Diekstrak dari SmcSessionModal.jsx (baris 444-480).
 * Sumber: Banner petunjuk khusus audit SMC kapal armada
 */
import React from 'react';
import { Ship } from 'lucide-react';

export const SmcSessionInfoBanner = ({
}) => {
  return (
    <div style={{
                padding: '0.8rem 1rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(2, 132, 199, 0.02) 100%)',
                border: '1px solid rgba(2, 132, 199, 0.25)',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#0284c7',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px'
                }}>
                  <Ship size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '0.82rem', color: '#0284c7' }}>
                      PETUNJUK PELAKSANAAN AUDIT SMC (SAFETY MANAGEMENT CERTIFICATE - KAPAL ARMADA)
                    </strong>
                    <span className="badge badge-primary" style={{ fontSize: '0.62rem' }}>BKI Rev 05 (74 Klausul)</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-main)', marginTop: '0.35rem', lineHeight: '1.5' }}>
                    <div>• <strong>Fokus Pengujian:</strong> Kelaiklautan fisik kapal, operasional navigasi di anjungan, kesiapan mesin & generator, uji fungsi alat keselamatan (LSA/FFA), drill darurat awak kapal, dan kesesuaian logbook kapal dengan sistem PMS.</div>
                    <div>• <strong>Auditee Onboard:</strong> Nakhoda (Master), KKM (Chief Engineer), dan seluruh awak kapal yang bertugas di atas kapal armada.</div>
                    <div>• <strong>Hasil Sesi Tahap 1:</strong> Penetapan nomor registrasi audit kapal, pengesahan Lead Auditor independen, dan pemasangan otomatis 74 butir checklist resmi BKI SMS Shipboard Rev 05.</div>
                  </div>
                </div>
              </div>
  );
};
