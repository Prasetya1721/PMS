/**
 * CrewDrillModal.jsx
 * Diekstrak dari CrewManager.jsx (baris 493-583).
 * Sumber: Modal pencatatan pelaksanaan safety drill
 */
import React from 'react';

export const CrewDrillModal = ({
  drillForm,
  handleDrillSubmit,
  setDrillForm,
  setShowDrillModal,
  vessels,
}) => {
  return (
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
  );
};
