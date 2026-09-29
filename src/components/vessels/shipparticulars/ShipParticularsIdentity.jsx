/**
 * ShipParticularsIdentity.jsx
 * Diekstrak dari ShipParticularsView.jsx.orig (baris 230-327).
 * Sumber: Blok identitas kapal: foto, status, dan empat vital utama
 */
import React from 'react';

export const ShipParticularsIdentity = ({
  isOperator,
  particulars,
  vessel,
}) => {
  return (
    <div className="particulars-showcase" style={{
              display: 'grid',
              gridTemplateColumns: '250px 1fr',
              gap: '1.5rem',
              padding: '1.25rem',
              background: 'var(--bg-surface-elevated)',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)'
            }}>
              {/* Photo */}
              <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', height: '170px' }}>
                <img
                  src={vessel.photo}
                  alt={vessel.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '0.65rem',
                  left: '0.65rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}>
                  <span className={`badge ${vessel.status?.includes('Operasional') ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.68rem' }}>
                    {vessel.status}
                  </span>
                  <span className={`badge ${isOperator ? 'badge-info' : 'badge-success'}`} style={{ fontSize: '0.68rem' }}>
                    {isOperator ? '⚙️ As Operator' : '⚓ As Owner'}
                  </span>
                </div>
              </div>

              {/* Key Vitals Highlight */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h1 style={{ fontSize: '1.85rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-main)', lineHeight: 1.1, margin: 0 }}>
                        {particulars.vesselName || vessel.name}
                      </h1>
                      <p style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 700, marginTop: '0.25rem' }}>
                        {particulars.vesselType || vessel.type}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                        Bendera: {particulars.flag || 'IDN'}
                      </span>
                      <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                        Port: {(particulars.portOfRegistry || vessel.portOfRegistry || '-').split(',')[0]}
                      </span>
                      <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                        Tahun: {particulars.yearBuilt}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '0.75rem',
                    marginTop: '1rem'
                  }}>
                    <div style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', display: 'block' }}>No. Registrasi BKI</span>
                      <p className="mono" style={{ fontSize: '0.825rem', fontWeight: 800, margin: '0.1rem 0 0 0' }}>
                        {particulars.officialNo || vessel.regNo}
                      </p>
                    </div>
                    <div style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', display: 'block' }}>Call Sign / IMO</span>
                      <p className="mono" style={{ fontSize: '0.825rem', fontWeight: 800, margin: '0.1rem 0 0 0' }}>
                        {particulars.callSign || '-'} / {particulars.imoNumber || '-'}
                      </p>
                    </div>
                    <div style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', display: 'block' }}>Tonase (GT / DWT)</span>
                      <p className="mono" style={{ fontSize: '0.825rem', fontWeight: 800, color: '#10b981', margin: '0.1rem 0 0 0' }}>
                        {particulars.grossTonnage?.toLocaleString()} GT / {particulars.deadweight?.toLocaleString()} DWT
                      </p>
                    </div>
                    <div style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', display: 'block' }}>Daya Mesin / BHP</span>
                      <p style={{ fontSize: '0.825rem', fontWeight: 800, color: '#f59e0b', margin: '0.1rem 0 0 0' }}>
                        {(particulars.totalHorsepower || '-').toString().split('(')[0] || particulars.totalHorsepower || '-'}
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '0.65rem' }}>
                  <span>Notasi Klas BKI: <strong className="mono" style={{ color: 'var(--text-main)' }}>{particulars.classNotation || '+A100 (I) P, +SM'}</strong></span>
                  <span>Galangan: <strong style={{ color: 'var(--text-main)' }}>{particulars.builder}</strong></span>
                </div>
              </div>
            </div>
  );
};
