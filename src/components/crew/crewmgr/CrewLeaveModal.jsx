/**
 * CrewLeaveModal.jsx
 * Diekstrak dari CrewManager.jsx (baris 402-490).
 * Sumber: Modal pengajuan cuti kru kapal
 */
import React from 'react';

export const CrewLeaveModal = ({
  crew,
  handleLeaveSubmit,
  leaveForm,
  setLeaveForm,
  setShowLeaveModal,
}) => {
  return (
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
  );
};
