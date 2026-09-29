/**
 * ShipParticularsLetterhead.jsx
 * Diekstrak dari ShipParticularsView.jsx.orig (baris 168-227).
 * Sumber: Kop resmi PT Pelayaran Baharimas Kalimantan dengan nomor dokumen BKI
 */
import React from 'react';
import { Ship } from 'lucide-react';

export const ShipParticularsLetterhead = ({
  particulars,
  vessel,
}) => {
  return (
    <div className="particulars-kop" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '1.25rem',
              borderBottom: '3px double #0f172a',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#0284c7',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)',
                  border: '2px solid #38bdf8',
                  flexShrink: 0
                }}>
                  <Ship size={28} strokeWidth={2.2} />
                  <span style={{ fontSize: '5.5pt', fontWeight: 900, letterSpacing: '1px', marginTop: '1px' }}>PBK</span>
                </div>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '0.03em', color: 'var(--text-main)', margin: 0, textTransform: 'uppercase' }}>
                    PT. PELAYARAN BAHARIMAS KALIMANTAN
                  </h2>
                  <p style={{ fontSize: '0.78rem', color: '#0284c7', letterSpacing: '0.02em', textTransform: 'uppercase', fontWeight: 700, margin: '2px 0 0 0' }}>
                    SHIP OWNER, OPERATOR & MARITIME LOGISTICS SERVICES
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                    Kantor Pusat: Komp. Pontianak Mall Blok D No. 8-9, Jl. Tanjungpura, Kota Pontianak 78122, Kalimantan Barat • Telp: (0561) 734567
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem', borderLeft: '1px solid #cbd5e1', paddingLeft: '1rem' }}>
                <span style={{
                  fontSize: '0.92rem',
                  fontWeight: 900,
                  color: '#0284c7',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}>
                  SPESIFIKASI TEKNIS KAPAL
                </span>
                <span className="mono" style={{ fontSize: '0.76rem', color: 'var(--text-main)', fontWeight: 800 }}>
                  DOC NO: PBK-PAR-{(particulars.officialNo || vessel.regNo || '001').toString().split(' ')[0]}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Klasifikasi: <strong>Biro Klasifikasi Indonesia (BKI)</strong>
                </span>
                <span style={{ fontSize: '0.66rem', color: '#64748b' }}>
                  Edisi / Revisi: <strong>2026 / Rev. 02</strong>
                </span>
              </div>
            </div>
  );
};
