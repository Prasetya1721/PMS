/**
 * ShipParticularsFooter.jsx
 * Diekstrak dari ShipParticularsView.jsx.orig (baris 469-530).
 * Sumber: Segel verifikasi teknis dan tiga kolom tanda tangan
 */
import React from 'react';
import { Award } from 'lucide-react';

export const ShipParticularsFooter = ({
  vessel,
}) => {
  return (
    <div
              className="particulars-signatures"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1.5rem',
                borderTop: '2px dashed var(--border-subtle)',
                flexWrap: 'wrap',
                gap: '1.5rem',
                marginTop: '0.5rem',
                pageBreakInside: 'avoid',
                breakInside: 'avoid'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Award size={30} color="#0284c7" />
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                      VERIFIKASI TEKNIS & KELAIKLAUTAN KAPAL
                    </p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                      Data diselaraskan dengan Surat Ukur, Akta Pendaftaran, dan Sertifikat Garis Muat BKI.
                    </p>
                    <p style={{ fontSize: '0.68rem', color: '#0284c7', margin: '2px 0 0 0', fontWeight: 700 }}>
                      Ditetapkan di: Pontianak, Kalimantan Barat
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '2.5rem', textAlign: 'center' }}>
                <div style={{ minWidth: '130px' }}>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0 0 2.5rem 0' }}>
                    Disetujui Nakhoda Kapal:
                  </p>
                  <p style={{ fontSize: '0.82rem', fontWeight: 800, borderTop: '1px solid #94a3b8', paddingTop: '0.25rem', margin: 0, textDecoration: 'underline' }}>
                    {vessel.masterCaptain || 'Capt. Hendra Gunawan, M.Mar'}
                  </p>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Master / Captain</span>
                </div>
                <div style={{ minWidth: '130px' }}>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0 0 2.5rem 0' }}>
                    Chief Engineer / KKM:
                  </p>
                  <p style={{ fontSize: '0.82rem', fontWeight: 800, borderTop: '1px solid #94a3b8', paddingTop: '0.25rem', margin: 0, textDecoration: 'underline' }}>
                    {vessel.chiefEngineer || 'Ir. Bambang Wijaya'}
                  </p>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Kepala Kamar Mesin</span>
                </div>
                <div style={{ minWidth: '130px' }}>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0 0 2.5rem 0' }}>
                    Superintendent Armada:
                  </p>
                  <p style={{ fontSize: '0.82rem', fontWeight: 800, borderTop: '1px solid #94a3b8', paddingTop: '0.25rem', margin: 0, textDecoration: 'underline' }}>
                    Ir. Heri Prasetyo
                  </p>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>PT. Pelayaran Baharimas Kalimantan</span>
                </div>
              </div>
            </div>
  );
};
