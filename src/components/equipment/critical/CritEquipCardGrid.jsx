/**
 * CritEquipCardGrid.jsx
 * Diekstrak dari CriticalEquipmentView.jsx (baris 215-307).
 * Sumber: Grid kartu hasil ujidarurat tiap peralatan beserta tombol aksi
 */
import React from 'react';
import { Calendar, Flame, LifeBuoy, ShieldAlert, Zap } from 'lucide-react';

export const CritEquipCardGrid = ({
  filteredTests,
  vessels,
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '1rem' }}>
            {filteredTests.map(test => {
              const isPass = test.testResult?.includes('Pass');
              const testVessel = vessels.find(v => v.id === test.vesselId);

              return (
                <div
                  key={test.id}
                  className="glass-card"
                  style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: isPass ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.4)',
                    background: isPass ? 'rgba(16, 185, 129, 0.03)' : 'rgba(239, 68, 68, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: isPass ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isPass ? '#10b981' : '#f87171'
                      }}>
                        {test.testCategory?.includes('Generator') ? <Zap size={18} /> :
                         test.testCategory?.includes('Fire') ? <Flame size={18} /> :
                         test.testCategory?.includes('Steering') ? <LifeBuoy size={18} /> : <ShieldAlert size={18} />}
                      </div>
                      <div>
                        <span className="badge badge-neutral" style={{ fontSize: '0.68rem', marginBottom: '2px' }}>
                          {testVessel?.name || 'Armada Baharimas'} • {test.testCategory}
                        </span>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>
                          {test.testTitle}
                        </h4>
                      </div>
                    </div>

                    <span className={`badge ${isPass ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.72rem' }}>
                      {test.testResult}
                    </span>
                  </div>

                  <div style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.825rem',
                    color: 'var(--text-main)'
                  }}>
                    <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-muted)' }}>
                      "{test.observations}"
                    </p>
                    {test.voltageObserved && (
                      <div style={{ marginTop: '0.4rem', display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#38bdf8' }}>
                        <span>Tegangan: <strong>{test.voltageObserved} V</strong></span>
                        {test.frequencyObserved && <span>Frekuensi: <strong>{test.frequencyObserved} Hz</strong></span>}
                        {test.loadTestDurationMinutes && <span>Durasi Uji: <strong>{test.loadTestDurationMinutes} Menit</strong></span>}
                      </div>
                    )}
                    {test.pressureObservedBar && (
                      <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: '#38bdf8' }}>
                        Tekanan Pancaran Air: <strong>{test.pressureObservedBar} bar</strong>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={13} />
                      <span>Diuji: <strong>{test.testDate}</strong> (Interval: {test.intervalDays} Hari)</span>
                    </div>
                    <div>
                      Uji Berikutnya: <strong style={{ color: '#f59e0b' }}>{test.nextTestDue}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', color: 'var(--text-muted)' }}>
                    <span>Penguji: <strong>{test.conductedBy}</strong></span>
                    <span>Verifikasi: <strong>{test.verifiedByChief}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
  );
};
