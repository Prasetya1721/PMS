/**
 * CrewDrillsTab.jsx
 * Diekstrak dari CrewManager.jsx (baris 346-399).
 * Sumber: Tab Safety Drills: riwayat pelaksanaan latihan keselamatan
 */
import React from 'react';
import { Flame, LifeBuoy, Plus } from 'lucide-react';

export const CrewDrillsTab = ({
  drills,
  setShowDrillModal,
  vessels,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowDrillModal(true)} className="btn btn-primary">
                  <Plus size={16} />
                  <span>Catat Pelaksanaan Drill Baru</span>
                </button>
              </div>

              <div className="grid-cols-2">
                {drills.map(d => {
                  const shipName = vessels.find(v => v.id === d.vesselId)?.name || '-';
                  return (
                    <div key={d.id} className="glass-card" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {d.drillType.includes('Fire') ? <Flame size={20} color="#ef4444" /> : <LifeBuoy size={20} color="#38bdf8" />}
                          <span className="badge badge-info">{d.performanceRating}</span>
                        </div>
                        <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {d.conductedDate}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.6rem' }}>{d.drillType}</h4>
                      <p style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>{shipName} • Lokasi: {d.location}</p>

                      <div style={{ marginTop: '0.85rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        <p><strong>Skenario:</strong> {d.scenarioSummary}</p>
                        {d.correctiveAction && (
                          <p style={{ color: '#fbbf24', marginTop: '0.35rem' }}>
                            <strong>Tindakan Koreksi:</strong> {d.correctiveAction}
                          </p>
                        )}
                      </div>

                      <div style={{
                        marginTop: '1rem',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid var(--border-glass)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.75rem',
                        color: 'var(--text-subtle)'
                      }}>
                        <span>Perwira Pemimpin: <strong>{d.leadOfficer}</strong></span>
                        <span>Peserta: <strong>{d.attendeesCount} Kru</strong> ({d.durationMinutes} menit)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
  );
};
