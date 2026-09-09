import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Ship,
  Wrench,
  FileCheck,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  ArrowRight,
  UserCheck,
  Phone,
  Compass,
  MapPin,
  Anchor
} from 'lucide-react';
import { RunningHoursModal } from '../equipment/RunningHoursModal';
import { WorkOrderModal } from '../maintenance/WorkOrderModal';

export const VesselDashboard = () => {
  const {
    vessels,
    selectedVesselId,
    equipment,
    workOrders,
    crew,
    crewCertificates,
    shipDocuments,
    setActiveTab,
    sendWhatsAppReminder
  } = usePMS();

  const [selectedEqForHours, setSelectedEqForHours] = useState(null);
  const [showNewWOModal, setShowNewWOModal] = useState(false);

  const currentShip = vessels.find(v => v.id === selectedVesselId) || vessels[0];

  const overdueWO = workOrders.filter(w => w.status === 'Overdue');
  const inProgressWO = workOrders.filter(w => w.status === 'In Progress');
  const urgentCerts = [
    ...crewCertificates.filter(c => c.status !== 'Active'),
    ...shipDocuments.filter(d => d.status !== 'Active')
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Vessel Profile Card */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '380px 1fr',
          minHeight: '220px'
        }}>
          {/* Photo & Ship Badge */}
          <div style={{ position: 'relative' }}>
            <img
              src={currentShip.photo}
              alt={currentShip.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, transparent 60%, rgba(15, 28, 53, 0.95) 100%)'
            }} />
            <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
              <span className={`badge ${
                currentShip.status.includes('Operasional') ? 'badge-success' : 'badge-warning'
              }`}>
                {currentShip.status}
              </span>
            </div>
          </div>

          {/* Details & Specs */}
          <div style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>{currentShip.name}</h2>
                <span className="badge badge-info">{currentShip.type}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                IMO: <strong className="mono" style={{ color: '#fff' }}>{currentShip.imo}</strong> • Call Sign:{' '}
                <strong className="mono" style={{ color: '#fff' }}>{currentShip.callSign}</strong> • Pelabuhan Pendaftaran:{' '}
                <strong style={{ color: '#fff' }}>{currentShip.portOfRegistry}</strong>
              </p>
            </div>

            {/* Quick Specs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Posisi Terkini</span>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8', marginTop: '0.15rem' }}>
                  {currentShip.currentLocation}
                </p>
              </div>
              <div style={{ padding: '0.75rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Kecepatan / Status</span>
                <p className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', marginTop: '0.15rem' }}>
                  {currentShip.speedKnots} Knots
                </p>
              </div>
              <div style={{ padding: '0.75rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Nakhoda (Master)</span>
                <p style={{ fontSize: '0.825rem', fontWeight: 600, marginTop: '0.15rem' }}>
                  {currentShip.masterCaptain}
                </p>
              </div>
              <div style={{ padding: '0.75rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Chief Engineer</span>
                <p style={{ fontSize: '0.825rem', fontWeight: 600, marginTop: '0.15rem' }}>
                  {currentShip.chiefEngineer}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
              <button onClick={() => setShowNewWOModal(true)} className="btn btn-primary btn-sm">
                <Plus size={14} />
                <span>Buat Work Order Baru</span>
              </button>
              <button onClick={() => setActiveTab('equipment')} className="btn btn-secondary btn-sm">
                <Wrench size={14} />
                <span>Update Jam Mesin</span>
              </button>
              <button onClick={() => setActiveTab('documents')} className="btn btn-secondary btn-sm">
                <FileCheck size={14} />
                <span>Cek Masa Berlaku Dokumen</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Running Hours Summary */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Status Jam Operasi Mesin (Equipment Running Hours)</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Monitoring interval servis berdasarkan jam kerja aktual vs target servis berkala
            </p>
          </div>
          <button onClick={() => setActiveTab('equipment')} className="btn btn-secondary btn-sm">
            <span>Daftar Lengkap</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid-cols-3">
          {equipment.map(eq => {
            const hoursLeft = eq.nextServiceHours - eq.runningHours;
            const percentageUsed = Math.min(100, Math.round((eq.runningHours / eq.nextServiceHours) * 100));

            return (
              <div
                key={eq.id}
                style={{
                  padding: '1.1rem',
                  borderRadius: '10px',
                  background: 'var(--bg-surface-elevated)',
                  border: eq.status === 'Overdue'
                    ? '1px solid rgba(239, 68, 68, 0.5)'
                    : eq.status === 'Due Soon'
                    ? '1px solid rgba(245, 158, 11, 0.4)'
                    : '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="mono" style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>
                      {eq.code}
                    </span>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.15rem' }}>{eq.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{eq.model}</p>
                  </div>
                  <span className={`badge ${
                    eq.status === 'Overdue' ? 'badge-danger-pulse' :
                    eq.status === 'Due Soon' ? 'badge-warning' : 'badge-success'
                  }`}>
                    {eq.status}
                  </span>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Jam Kerja: <strong className="mono" style={{ color: '#fff' }}>{eq.runningHours.toLocaleString()}</strong></span>
                    <span style={{ color: 'var(--text-muted)' }}>Target: <strong className="mono">{eq.nextServiceHours.toLocaleString()}</strong></span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className={`progress-bar-fill ${
                        eq.status === 'Overdue' ? 'progress-red' :
                        eq.status === 'Due Soon' ? 'progress-amber' : 'progress-blue'
                      }`}
                      style={{ width: `${percentageUsed}%` }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.65rem' }}>
                    <span style={{ fontSize: '0.75rem', color: hoursLeft <= 0 ? '#ef4444' : '#f59e0b', fontWeight: 600 }}>
                      {hoursLeft <= 0 ? `Overdue ${Math.abs(hoursLeft)} Jam!` : `Sisa ${hoursLeft} Jam`}
                    </span>
                    <button
                      onClick={() => setSelectedEqForHours(eq)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.2rem 0.6rem', fontSize: '0.72rem' }}
                    >
                      <Clock size={12} />
                      <span>Log Jam</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Work Orders & Urgent Certificates */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr', gap: '1.5rem' }}>
        {/* Work Orders List */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Work Orders Aktif Kapal Ini</h4>
            <button onClick={() => setActiveTab('maintenance')} className="btn btn-secondary btn-sm">
              Kelola di PMS
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {workOrders.map(wo => (
              <div
                key={wo.id}
                style={{
                  padding: '0.9rem',
                  borderRadius: '8px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>{wo.id}</span>
                    <span className={`badge ${
                      wo.priority === 'Sangat Tinggi' || wo.priority === 'Tinggi' ? 'badge-danger' : 'badge-warning'
                    }`} style={{ fontSize: '0.65rem' }}>
                      {wo.priority}
                    </span>
                  </div>
                  <h5 style={{ fontSize: '0.88rem', fontWeight: 600, marginTop: '0.25rem' }}>{wo.title}</h5>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Teknisi: {wo.assignedTo} • Target: {wo.targetHours ? `${wo.targetHours} Jam` : wo.dueDate}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                  <span className={`badge ${
                    wo.status === 'Completed' ? 'badge-success' :
                    wo.status === 'In Progress' ? 'badge-info' :
                    wo.status === 'Overdue' ? 'badge-danger-pulse' :
                    'badge-neutral'
                  }`}>
                    {wo.status}
                  </span>
                  {wo.status === 'Overdue' && (
                    <button
                      onClick={() => sendWhatsAppReminder(wo, 'work_order')}
                      className="btn btn-whatsapp btn-sm"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                    >
                      Alert WA
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Certificates */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f87171' }}>
              Dokumen & Sertifikat Butuh Perhatian
            </h4>
            <button onClick={() => setActiveTab('documents')} className="btn btn-secondary btn-sm">
              Semua Dokumen
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {urgentCerts.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
                <p>Seluruh dokumen & sertifikat kapal ini dalam status Aktif.</p>
              </div>
            ) : (
              urgentCerts.map(item => (
                <div
                  key={item.id}
                  style={{
                    padding: '0.85rem',
                    borderRadius: '8px',
                    background: item.status === 'Expired' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                    border: item.status === 'Expired' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`badge ${item.status === 'Expired' ? 'badge-danger-pulse' : 'badge-warning'}`} style={{ fontSize: '0.68rem' }}>
                        {item.status}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.crewName ? `Crew: ${item.crewName}` : 'Dokumen Kapal'}
                      </span>
                    </div>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem' }}>{item.name}</h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Expired: <strong className="mono" style={{ color: '#fff' }}>{item.expiryDate}</strong> ({item.daysUntilExpiry > 0 ? `${item.daysUntilExpiry} hari lagi` : 'LEWAT!'})
                    </p>
                  </div>

                  <button
                    onClick={() => sendWhatsAppReminder(item, item.crewName ? 'crew_cert' : 'ship_doc')}
                    className="btn btn-whatsapp btn-sm"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.72rem' }}
                  >
                    Kirim WA
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedEqForHours && (
        <RunningHoursModal
          equipment={selectedEqForHours}
          onClose={() => setSelectedEqForHours(null)}
        />
      )}

      {showNewWOModal && (
        <WorkOrderModal
          vesselId={selectedVesselId}
          onClose={() => setShowNewWOModal(false)}
        />
      )}
    </div>
  );
};
