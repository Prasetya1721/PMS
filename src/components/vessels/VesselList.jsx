import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Ship,
  Wrench,
  Users,
  Anchor,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const VesselList = () => {
  const { vessels, allEquipment, allCrew, allWorkOrders, setSelectedVesselId, setActiveTab } = usePMS();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Master Armada Kapal (Fleet Directory)</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Daftar seluruh kapal niaga dalam armada perusahaan, sertifikasi kelas, kapasitas muat, dan perwira penanggung jawab
        </p>
      </div>

      {/* Grid of Vessels */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {vessels.map(v => {
          const shipEquipment = allEquipment.filter(e => e.vesselId === v.id);
          const shipCrew = allCrew.filter(c => c.vesselId === v.id);
          const shipWO = allWorkOrders.filter(w => w.vesselId === v.id);
          const overdueCount = shipWO.filter(w => w.status === 'Overdue').length;
          const totalHours = shipEquipment.reduce((sum, e) => sum + (e.runningHours || 0), 0);

          return (
            <div key={v.id} className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '320px 1fr',
                minHeight: '220px'
              }}>
                {/* Photo */}
                <div style={{ position: 'relative' }}>
                  <img
                    src={v.photo}
                    alt={v.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                    <span className={`badge ${v.status.includes('Operasional') ? 'badge-success' : 'badge-warning'}`}>
                      {v.status}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{v.name}</h3>
                          <span className="badge badge-info">{v.type}</span>
                        </div>
                        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          Bendera: <strong style={{ color: '#fff' }}>{v.flag}</strong> • Pelabuhan Pendaftaran:{' '}
                          <strong style={{ color: '#fff' }}>{v.portOfRegistry}</strong> • Galangan:{' '}
                          <strong style={{ color: '#fff' }}>{v.builder} ({v.yearBuilt})</strong>
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedVesselId(v.id);
                          setActiveTab('dashboard');
                        }}
                        className="btn btn-primary btn-sm"
                      >
                        <span>Buka Dashboard Kapal</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>

                    {/* Technical Specs */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1.25rem' }}>
                      <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Nomor IMO / Call Sign</span>
                        <p className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '0.15rem' }}>
                          {v.imo} / {v.callSign}
                        </p>
                      </div>
                      <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Tonase (GT / DWT)</span>
                        <p className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '0.15rem' }}>
                          {v.gt.toLocaleString()} GT / {v.dwt.toLocaleString()} DWT
                        </p>
                      </div>
                      <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Nakhoda & Chief Engineer</span>
                        <p style={{ fontSize: '0.825rem', fontWeight: 600, marginTop: '0.15rem' }}>
                          {v.masterCaptain} / {v.chiefEngineer.split(' ')[0]}
                        </p>
                      </div>
                      <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Posisi Saat Ini</span>
                        <p style={{ fontSize: '0.825rem', fontWeight: 600, color: '#38bdf8', marginTop: '0.15rem' }}>
                          {v.currentLocation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Stats */}
                  <div style={{
                    marginTop: '1.25rem',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid var(--border-glass)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.825rem'
                  }}>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                      <span><strong>{shipEquipment.length}</strong> Unit Equipment</span>
                      <span><strong>{shipCrew.length}</strong> Awak Kapal (Crew)</span>
                      <span>Total Jam Kerja: <strong className="mono">{totalHours.toLocaleString()} Jam</strong></span>
                    </div>

                    <div>
                      {overdueCount > 0 ? (
                        <span className="badge badge-danger-pulse">
                          {overdueCount} Work Order Overdue
                        </span>
                      ) : (
                        <span className="badge badge-success">
                          Kondisi Mesin Prima
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
