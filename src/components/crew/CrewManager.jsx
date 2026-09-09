import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Users,
  CalendarCheck,
  CalendarX,
  Flame,
  LifeBuoy,
  Plus,
  CheckCircle,
  XCircle,
  Phone,
  MessageSquare,
  Clock,
  Shield,
  FileCheck
} from 'lucide-react';

export const CrewManager = () => {
  const {
    crew,
    leaves,
    drills,
    vessels,
    approveLeave,
    submitLeave,
    addDrill,
    addCrew,
    currentRole
  } = usePMS();

  const [crewTab, setCrewTab] = useState('list'); // 'list' | 'leaves' | 'drills'
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDrillModal, setShowDrillModal] = useState(false);

  // Form states
  const [leaveForm, setLeaveForm] = useState({
    crewId: crew[0]?.id || '',
    leaveType: 'Cuti Tahunan',
    startDate: '',
    endDate: '',
    daysRequested: 14,
    replacementCrew: '',
    notes: ''
  });

  const [drillForm, setDrillForm] = useState({
    vesselId: vessels[0]?.id || 'v-001',
    drillType: 'Fire Drill (Latihan Pemadam Kebakaran)',
    conductedDate: new Date().toISOString().split('T')[0],
    durationMinutes: 45,
    leadOfficer: 'Capt. Hendra Gunawan',
    attendeesCount: 16,
    performanceRating: 'Memuaskan',
    scenarioSummary: '',
    correctiveAction: ''
  });

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    const selectedCrew = crew.find(c => c.id === leaveForm.crewId);
    submitLeave({
      ...leaveForm,
      crewName: selectedCrew ? `${selectedCrew.name} (${selectedCrew.rank})` : 'Crew',
      vesselId: selectedCrew?.vesselId || 'v-001'
    });
    setShowLeaveModal(false);
  };

  const handleDrillSubmit = (e) => {
    e.preventDefault();
    addDrill(drillForm);
    setShowDrillModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Manajemen Awak Kapal (Crew & Kehadiran)</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Data personel kru, rotasi sign-on/sign-off, approval cuti berjenjang, dan riwayat safety drill
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setCrewTab('list')}
            className={`btn ${crewTab === 'list' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Users size={16} />
            <span>Daftar Awak Kapal ({crew.length})</span>
          </button>
          <button
            onClick={() => setCrewTab('leaves')}
            className={`btn ${crewTab === 'leaves' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <CalendarX size={16} />
            <span>Pengajuan Cuti ({leaves.filter(l => l.status.includes('Pending')).length})</span>
          </button>
          <button
            onClick={() => setCrewTab('drills')}
            className={`btn ${crewTab === 'drills' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <LifeBuoy size={16} />
            <span>Safety Drills & Training ({drills.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Crew Directory */}
      {crewTab === 'list' && (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div className="table-container">
            <table className="pms-table">
              <thead>
                <tr>
                  <th>Nama & Jabatan (Rank)</th>
                  <th>Kapal Penempatan</th>
                  <th>Buku Pelaut (Seaman Book)</th>
                  <th>Kontrak & Sign-On</th>
                  <th>Sisa Cuti</th>
                  <th>Status Onboard</th>
                  <th style={{ textAlign: 'right' }}>Kontak WhatsApp</th>
                </tr>
              </thead>
              <tbody>
                {crew.map(c => {
                  const shipName = vessels.find(v => v.id === c.vesselId)?.name || '-';
                  return (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={c.photo}
                            alt={c.name}
                            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700 }}>{c.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>{c.rank} • {c.department}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>{shipName}</td>
                      <td className="mono" style={{ fontSize: '0.8rem' }}>{c.seamanBookNo}</td>
                      <td>
                        <div style={{ fontSize: '0.8rem' }}>Sign-On: <strong className="mono">{c.signOnDate}</strong></div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rencana Off: {c.signOffPlanDate}</div>
                      </td>
                      <td>
                        <span className="mono" style={{ fontWeight: 700, color: '#10b981' }}>
                          {c.leaveBalanceDays} Hari
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${c.status === 'Onboard' ? 'badge-success' : 'badge-neutral'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <a
                          href={`https://wa.me/${c.whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-whatsapp btn-sm"
                          style={{ textDecoration: 'none', display: 'inline-flex' }}
                        >
                          <Phone size={13} />
                          <span>{c.phone}</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Leaves Management */}
      {crewTab === 'leaves' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowLeaveModal(true)} className="btn btn-primary">
              <Plus size={16} />
              <span>Ajukan Cuti Kru Baru</span>
            </button>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Daftar Permohonan Cuti & Alur Persetujuan
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {leaves.map(l => {
                const isPending = l.status.includes('Pending');
                return (
                  <div
                    key={l.id}
                    style={{
                      padding: '1.1rem',
                      borderRadius: '8px',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span className="mono" style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8' }}>{l.id}</span>
                        <span className="badge badge-info">{l.leaveType}</span>
                        <span className={`badge ${
                          l.status === 'Approved Fleet' ? 'badge-success' :
                          l.status === 'Rejected' ? 'badge-danger' : 'badge-warning'
                        }`}>
                          {l.status}
                        </span>
                      </div>
                      <h5 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.35rem' }}>{l.crewName}</h5>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        Periode: <strong className="mono">{l.startDate}</strong> s/d <strong className="mono">{l.endDate}</strong> ({l.daysRequested} hari)
                      </p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                        Pengganti: {l.replacementCrew} • Alasan: {l.notes}
                      </p>
                    </div>

                    {/* Approval Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {l.status === 'Pending Ship Admin' && (
                        <button
                          onClick={() => approveLeave(l.id, 'Approved Ship Admin')}
                          className="btn btn-secondary btn-sm"
                        >
                          <CheckCircle size={14} color="#38bdf8" />
                          <span>Approve Nakhoda</span>
                        </button>
                      )}
                      {(l.status === 'Approved Ship Admin' || l.status === 'Pending Ship Admin') && (
                        <button
                          onClick={() => approveLeave(l.id, 'Approved Fleet')}
                          className="btn btn-success btn-sm"
                        >
                          <CheckCircle size={14} />
                          <span>Approve Fleet Manager</span>
                        </button>
                      )}
                      {isPending && (
                        <button
                          onClick={() => approveLeave(l.id, 'Rejected')}
                          className="btn btn-danger btn-sm"
                        >
                          <XCircle size={14} />
                          <span>Tolak</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Safety Drills */}
      {crewTab === 'drills' && (
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
      )}

      {/* Modal Cuti */}
      {showLeaveModal && (
        <div className="modal-overlay" onClick={() => setShowLeaveModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Pengajuan Cuti Kru Kapal</h3>
            </div>
            <form onSubmit={handleLeaveSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Pilih Kru
                  </label>
                  <select
                    value={leaveForm.crewId}
                    onChange={(e) => setLeaveForm({ ...leaveForm, crewId: e.target.value })}
                    className="select-control"
                  >
                    {crew.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.rank}) - Sisa Cuti: {c.leaveBalanceDays} hari</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Tanggal Mulai Cuti
                    </label>
                    <input
                      type="date"
                      required
                      value={leaveForm.startDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                      className="input-control"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Tanggal Selesai Cuti
                    </label>
                    <input
                      type="date"
                      required
                      value={leaveForm.endDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                      className="input-control"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Petugas / Kru Pengganti (Reliever)
                  </label>
                  <input
                    type="text"
                    placeholder="Nama kru pengganti yang sudah ditunjuk"
                    value={leaveForm.replacementCrew}
                    onChange={(e) => setLeaveForm({ ...leaveForm, replacementCrew: e.target.value })}
                    className="input-control"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Alasan Cuti
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Keperluan keluarga, istirahat pasca masa kontrak, dll."
                    value={leaveForm.notes}
                    onChange={(e) => setLeaveForm({ ...leaveForm, notes: e.target.value })}
                    className="input-control"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowLeaveModal(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Ajukan Cuti
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Safety Drill */}
      {showDrillModal && (
        <div className="modal-overlay" onClick={() => setShowDrillModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Catat Latihan Keselamatan (Safety Drill)</h3>
            </div>
            <form onSubmit={handleDrillSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Kapal Pelaksana
                  </label>
                  <select
                    value={drillForm.vesselId}
                    onChange={(e) => setDrillForm({ ...drillForm, vesselId: e.target.value })}
                    className="select-control"
                  >
                    {vessels.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Jenis Latihan (Drill Type)
                  </label>
                  <select
                    value={drillForm.drillType}
                    onChange={(e) => setDrillForm({ ...drillForm, drillType: e.target.value })}
                    className="select-control"
                  >
                    <option value="Fire Drill (Latihan Pemadam Kebakaran)">Fire Drill (Latihan Pemadam Kebakaran)</option>
                    <option value="Abandon Ship Drill (Meninggalkan Kapal)">Abandon Ship Drill (Meninggalkan Kapal)</option>
                    <option value="Man Overboard Drill (Kru Jatuh ke Laut)">Man Overboard Drill (Kru Jatuh ke Laut)</option>
                    <option value="Enclosed Space Entry & Rescue">Enclosed Space Entry & Rescue</option>
                    <option value="Oil Spill / SOPEP Emergency Drill">Oil Spill / SOPEP Emergency Drill</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Tanggal Latihan
                    </label>
                    <input
                      type="date"
                      value={drillForm.conductedDate}
                      onChange={(e) => setDrillForm({ ...drillForm, conductedDate: e.target.value })}
                      className="input-control"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Durasi (Menit)
                    </label>
                    <input
                      type="number"
                      value={drillForm.durationMinutes}
                      onChange={(e) => setDrillForm({ ...drillForm, durationMinutes: Number(e.target.value) })}
                      className="input-control"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Ringkasan Skenario & Evaluasi
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Skenario alarm darurat berbunyi, respon regu pemadam, waktu kumpul di muster station."
                    value={drillForm.scenarioSummary}
                    onChange={(e) => setDrillForm({ ...drillForm, scenarioSummary: e.target.value })}
                    className="input-control"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowDrillModal(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Laporan Drill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
