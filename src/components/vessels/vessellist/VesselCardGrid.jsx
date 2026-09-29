/**
 * VesselCardGrid.jsx
 * Diekstrak dari VesselList.jsx (baris 241-455).
 * Sumber: Grid kartu kapal beserta tampilan kosong dan hasil pencarian kosong
 */
import React from 'react';
import { ArrowRight, FileCheck, FileText, Plus, Ship, Users, Wrench } from 'lucide-react';

export const VesselCardGrid = ({
  allCrew,
  allEquipment,
  allShipDocuments,
  allWorkOrders,
  filteredVessels,
  handleOpenAddModal,
  search,
  setActiveTab,
  setSelectedVesselForParticulars,
  setSelectedVesselId,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredVessels.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
                <Ship size={48} style={{ opacity: 0.35, margin: '0 auto 1rem auto', color: '#38bdf8' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  {search ? 'Tidak Ditemukan Kapal yang Sesuai' : 'Belum Ada Kapal Terdaftar'}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
                  {search
                    ? `Pencarian "${search}" tidak menemukan hasil. Silakan periksa kembali ejaan atau reset filter.`
                    : 'Sistem PMS armada saat ini dalam keadaan bersih tanpa data dummy. Silakan daftarkan kapal pertama Anda untuk mulai menguji input data kapal, sertifikat, dan kru.'}
                </p>
                {!search && (
                  <button
                    onClick={handleOpenAddModal}
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}
                  >
                    <Plus size={16} />
                    <span>+ Daftarkan Kapal Baru</span>
                  </button>
                )}
              </div>
            ) : (
              filteredVessels.map(v => {
              const shipWO = allWorkOrders.filter(w => w.vesselId === v.id);
              const shipEquipment = allEquipment.filter(e => e.vesselId === v.id);
              const shipCrew = allCrew.filter(c => c.vesselId === v.id);
              const shipDocs = allShipDocuments.filter(d => d.vesselId === v.id);

              const overdueCount = shipWO.filter(w => w.status === 'Overdue').length;
              const expiredDocs = shipDocs.filter(d => d.status === 'Expired').length;
              const dueSoonDocs = shipDocs.filter(d => d.status === 'Due Soon').length;
              const totalHours = shipEquipment.reduce((sum, e) => sum + (e.runningHours || 0), 0);

              const isOperator = v.ownershipStatus === 'As Operator';

              return (
                <div key={v.id} className="glass-card" style={{
                  overflow: 'hidden',
                  border: isOperator ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(16, 185, 129, 0.35)'
                }}>
                  <div className="vessel-list-card-grid">
                    {/* Photo */}
                    <div style={{ position: 'relative' }}>
                      <img
                        src={v.photo}
                        alt={v.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', top: '0.85rem', left: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <span className={`badge ${v.status?.includes('Operasional') ? 'badge-success' : 'badge-warning'}`}>
                          {v.status}
                        </span>
                        <span
                          className="badge"
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: isOperator ? 'rgba(2, 132, 199, 0.9)' : 'rgba(5, 150, 105, 0.9)',
                            color: '#fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                          }}
                        >
                          {isOperator ? '⚙️ As Operator' : '⚓ As Owner'}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="vessel-list-card-details">
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                              <h3 style={{ fontSize: '1.45rem', fontWeight: 800 }}>{v.name}</h3>
                              <span
                                className="badge"
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  background: isOperator ? 'rgba(2, 132, 199, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                  color: isOperator ? '#38bdf8' : '#34d399',
                                  border: isOperator ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(52, 211, 153, 0.4)'
                                }}
                              >
                                {isOperator ? '⚙️ Kapal Pengoperasian (Operator)' : '⚓ Kapal Milik Sendiri (Owner)'}
                              </span>
                              <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>{v.type}</span>
                            </div>
                            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                              No. Reg: <strong className="mono" style={{ color: 'var(--text-main)' }}>{v.regNo || '-'}</strong> {v.imo ? <> • IMO: <strong className="mono" style={{ color: 'var(--text-main)' }}>{v.imo}</strong></> : null} • Bendera: <strong style={{ color: 'var(--text-main)' }}>{v.flag}</strong> • Pelabuhan Pendaftaran:{' '}
                              <strong style={{ color: 'var(--text-main)' }}>{v.portOfRegistry}</strong> • Galangan:{' '}
                              <strong style={{ color: 'var(--text-main)' }}>{v.builder} ({v.yearBuilt})</strong>
                            </p>
                          </div>

                          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => setSelectedVesselForParticulars(v)}
                              className="btn btn-secondary"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                padding: '0.55rem 1rem',
                                fontSize: '0.825rem',
                                border: '1px solid rgba(56, 189, 248, 0.35)'
                              }}
                              title="Lihat dan Edit Data Particular Lengkap Kapal Ini"
                            >
                              <FileText size={15} color="#38bdf8" />
                              <span style={{ color: '#38bdf8', fontWeight: 600 }}>Data Particular</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedVesselId(v.id);
                                setActiveTab('dashboard');
                              }}
                              className="btn btn-primary"
                              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 1.15rem' }}
                            >
                              <span>Buka Dashboard Kapal</span>
                              <ArrowRight size={15} />
                            </button>
                          </div>
                        </div>

                        {/* Technical Specs Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1.25rem' }}>
                          <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>No. Reg / IMO / Call Sign</span>
                            <p className="mono" style={{ fontSize: '0.82rem', fontWeight: 700, marginTop: '0.15rem' }}>
                              Reg: {v.regNo || '-'} {v.imo ? `• IMO: ${v.imo}` : ''} • {v.callSign || '-'}
                            </p>
                          </div>
                          <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Tonase (GT / DWT)</span>
                            <p className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '0.15rem' }}>
                              {v.gt?.toLocaleString()} GT / {v.dwt?.toLocaleString()} DWT
                            </p>
                          </div>
                          <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Nakhoda & Chief Engineer</span>
                            <p style={{ fontSize: '0.825rem', fontWeight: 600, marginTop: '0.15rem' }}>
                              {v.masterCaptain || '-'} / {(v.chiefEngineer || '-').split(' ')[0]}
                            </p>
                          </div>
                          <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
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
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Wrench size={14} color="#38bdf8" />
                            <strong>{shipEquipment.length}</strong> Equipment
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Users size={14} color="#a78bfa" />
                            <strong>{shipCrew.length}</strong> Awak Kapal (Crew)
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <FileCheck size={14} color="#34d399" />
                            <strong>{shipDocs.length}</strong> Sertifikat Survei BKI
                          </span>
                          {totalHours > 0 && (
                            <span>Total Jam Kerja: <strong className="mono">{totalHours.toLocaleString()} Jam</strong></span>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          {expiredDocs > 0 && (
                            <span className="badge badge-danger-pulse" style={{ fontSize: '0.72rem' }}>
                              {expiredDocs} Survei Expired!
                            </span>
                          )}
                          {dueSoonDocs > 0 && (
                            <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
                              {dueSoonDocs} Survei H-30
                            </span>
                          )}
                          {overdueCount > 0 && (
                            <span className="badge badge-danger-pulse" style={{ fontSize: '0.72rem' }}>
                              {overdueCount} WO Overdue
                            </span>
                          )}
                          {expiredDocs === 0 && dueSoonDocs === 0 && overdueCount === 0 && (
                            <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                              Kondisi Kelaiklautan Prima
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }))}
          </div>
  );
};
