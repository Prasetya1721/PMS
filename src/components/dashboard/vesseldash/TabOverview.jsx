/**
 * TabOverview.jsx
 * Diekstrak dari VesselDashboard.jsx (baris 523-808).
 * Sumber: SUB-TAB 1: ringkasan - 4 kartu metrik kesehatan + ringkasan status
 */
import React from 'react';
import { CalendarPlus, CheckCircle, ChevronRight, Clock, FileCheck, Users, Wrench } from 'lucide-react';

export const TabOverview = ({
  dueSoonDocs,
  expiredDocs,
  inProgressWO,
  openGoogleCalendar,
  overdueWO,
  sendWhatsAppReminder,
  setActiveSubTab,
  setSelectedEqForHours,
  shipCrew,
  shipDocs,
  shipEquipment,
  shipWOs,
  urgentCerts,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* 4 Health Metrics Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                <div className="glass-card" style={{ padding: '1.15rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Personel Onboard</span>
                    <Users size={18} color="#a78bfa" />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem' }}>
                    {shipCrew.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-subtle)' }}>Orang</span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Nakhoda & Perwira Siap Tugas
                  </p>
                </div>

                <div className="glass-card" style={{ padding: '1.15rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sertifikat Survei BKI</span>
                    <FileCheck size={18} color={expiredDocs.length > 0 ? '#ef4444' : '#10b981'} />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem', color: expiredDocs.length > 0 ? '#ef4444' : '#fff' }}>
                    {shipDocs.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-subtle)' }}>Dokumen</span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: expiredDocs.length > 0 ? '#ef4444' : 'var(--text-muted)', marginTop: '0.2rem', fontWeight: expiredDocs.length > 0 ? 700 : 400 }}>
                    {expiredDocs.length > 0 ? `${expiredDocs.length} Survei Expired!` : `${dueSoonDocs.length} Survei H-30 Jatuh Tempo`}
                  </p>
                </div>

                <div className="glass-card" style={{ padding: '1.15rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Work Orders Aktif</span>
                    <Clock size={18} color={overdueWO.length > 0 ? '#ef4444' : '#38bdf8'} />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem', color: overdueWO.length > 0 ? '#ef4444' : '#fff' }}>
                    {shipWOs.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-subtle)' }}>Tugas</span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: overdueWO.length > 0 ? '#ef4444' : 'var(--text-muted)', marginTop: '0.2rem', fontWeight: overdueWO.length > 0 ? 700 : 400 }}>
                    {overdueWO.length > 0 ? `${overdueWO.length} Overdue Batas Jam!` : `${inProgressWO.length} Sedang Dikerjakan`}
                  </p>
                </div>

                <div className="glass-card" style={{ padding: '1.15rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unit Equipment Mesin</span>
                    <Wrench size={18} color="#38bdf8" />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem' }}>
                    {shipEquipment.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-subtle)' }}>Unit</span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Tercatat di Database Kapal
                  </p>
                </div>
              </div>

              {/* Running Hours Preview */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Jam Operasi Mesin & Perangkat Kapal Ini</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Monitoring running hours terhadap interval target servis berikutnya
                    </p>
                  </div>
                  <button onClick={() => setActiveSubTab('equipment')} className="btn btn-secondary btn-sm">
                    <span>Kelola Equipment</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="grid-cols-3">
                  {shipEquipment.slice(0, 3).map(eq => {
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
                            <span style={{ color: 'var(--text-muted)' }}>Jam Kerja: <strong className="mono" style={{ color: '#fff' }}>{eq.runningHours?.toLocaleString()}</strong></span>
                            <span style={{ color: 'var(--text-muted)' }}>Target: <strong className="mono">{eq.nextServiceHours?.toLocaleString()}</strong></span>
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

              {/* Active Work Orders & Urgent Certificates for THIS Ship */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr', gap: '1.5rem' }}>
                {/* Work Orders / Requisitions List */}
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Permintaan Barang Gudang ({shipWOs.length})</h4>
                    <button onClick={() => setActiveSubTab('workorders')} className="btn btn-secondary btn-sm">
                      Lihat Semua
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {shipWOs.length === 0 ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
                        <p>Tidak ada permintaan barang yang tertunda untuk kapal ini.</p>
                      </div>
                    ) : (
                      shipWOs.map(wo => (
                        <div
                          key={wo.id}
                          style={{
                            padding: '0.85rem',
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
                                wo.priority === 'Sangat Tinggi' || wo.priority === 'Tinggi' || wo.priority === 'Urgent / Darurat' ? 'badge-danger' : 'badge-warning'
                              }`} style={{ fontSize: '0.65rem' }}>
                                {wo.priority}
                              </span>
                              <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                                {wo.mainCategory || wo.category}
                              </span>
                            </div>
                            <h5 style={{ fontSize: '0.88rem', fontWeight: 600, marginTop: '0.25rem' }}>{wo.title}</h5>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              PIC: <strong>{wo.pic || wo.assignedTo}</strong> • Dibutuhkan: <strong>{wo.neededDate || wo.dueDate || 'Segera'}</strong>
                            </p>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                            <span className={`badge ${
                              wo.status === 'Completed' || wo.status === 'Diterima di Kapal (Selesai)' ? 'badge-success' :
                              wo.status === 'Disetujui Gudang' || wo.status === 'Disetujui Nakhoda' ? 'badge-info' :
                              wo.status === 'Overdue' || wo.status === 'Urgent' ? 'badge-danger-pulse' :
                              'badge-warning'
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
                      ))
                    )}
                  </div>
                </div>

                {/* Urgent BKI Certificates */}
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f87171' }}>
                      Survei BKI Butuh Perhatian
                    </h4>
                    <button onClick={() => setActiveSubTab('documents')} className="btn btn-secondary btn-sm">
                      Daftar Survei ({shipDocs.length})
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {urgentCerts.length === 0 ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
                        <p>Seluruh sertifikat survei kapal ini dalam status Aktif.</p>
                      </div>
                    ) : (
                      urgentCerts.slice(0, 4).map(item => (
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
                                {item.category || item.type}
                              </span>
                            </div>
                            <h5 style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem' }}>{item.name}</h5>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Jatuh Tempo: <strong className="mono" style={{ color: '#fff' }}>{item.expiryDate}</strong> ({item.daysUntilExpiry > 0 ? `${item.daysUntilExpiry} hari lagi` : `LEWAT ${Math.abs(item.daysUntilExpiry)} HARI!`})
                            </p>
                          </div>

                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button
                              onClick={() => openGoogleCalendar(item)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem' }}
                              title="Sinkron G-Cal"
                            >
                              <CalendarPlus size={13} />
                            </button>
                            <button
                              onClick={() => sendWhatsAppReminder(item, item.crewName ? 'crew_cert' : 'ship_doc')}
                              className="btn btn-whatsapp btn-sm"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }}
                            >
                              WA
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
  );
};
