/**
 * DocFormDatesSection.jsx
 * Diekstrak dari DocumentFormModal.jsx (baris 2024-2218).
 * Sumber: Blok 5: tanggal terbit, tempat, expired & sifat sertifikat
 */
import React from 'react';
import { Anchor, Calendar, ShieldCheck } from 'lucide-react';
import { formatIndonesianDate } from './docFormHelpers';

export const DocFormDatesSection = ({
  formData,
  setFormData,
  surveyWindow,
}) => {
  return (
    <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '1.1rem 1.25rem',
                borderRadius: '12px',
                background: 'rgba(2, 132, 199, 0.05)',
                border: '1px solid rgba(56, 189, 248, 0.25)'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', marginBottom: 0 }}>
                        <Calendar size={14} />
                        <span>Tanggal Penerbitan (Issue Date) *</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const today = new Date().toISOString().split('T')[0];
                          setFormData(prev => ({ ...prev, issueDate: today }));
                        }}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', height: 'auto', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}
                        title="Set tanggal penerbitan ke hari ini"
                      >
                        Hari Ini
                      </button>
                    </div>
                    <input
                      type="date"
                      required
                      value={formData.issueDate || ''}
                      onClick={(e) => {
                        try { e.target.showPicker(); } catch (_) {}
                      }}
                      onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                      className="input-control mono"
                      style={{ cursor: 'pointer', fontWeight: 600 }}
                      title="Klik untuk memilih tanggal dari kalender"
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.3rem', fontSize: '0.72rem', flexWrap: 'wrap', gap: '0.2rem' }}>
                      <span style={{ color: 'var(--text-subtle)' }}>
                        Tanggal resmi instansi
                      </span>
                      {formData.issueDate && (
                        <span style={{ color: '#38bdf8', fontWeight: 600, background: 'rgba(56, 189, 248, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                          📅 {formatIndonesianDate(formData.issueDate)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8' }}>
                      <Anchor size={14} />
                      <span>Tempat Diterbitkan (Place of Issue)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Pontianak / Jakarta / Balikpapan"
                      value={formData.placeOfIssue || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, placeOfIssue: e.target.value }))}
                      className="input-control"
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
                      Kota / pelabuhan tempat sertifikat ditandatangani
                    </span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', marginBottom: 0 }}>
                        <Calendar size={14} />
                        <span>Tanggal Expired (Jatuh Tempo) *</span>
                      </label>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                          type="button"
                          onClick={() => {
                            try {
                              const base = new Date((formData.issueDate || new Date().toISOString().split('T')[0]) + 'T00:00:00');
                              base.setFullYear(base.getFullYear() + 1);
                              setFormData(prev => ({ ...prev, expiryDate: base.toISOString().split('T')[0] }));
                            } catch (_) {}
                          }}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.65rem', padding: '0.15rem 0.35rem', height: 'auto', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}
                          title="+1 Tahun (Annual Survey / Pas Tahunan)"
                        >
                          +1 Thn
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            try {
                              const base = new Date((formData.issueDate || new Date().toISOString().split('T')[0]) + 'T00:00:00');
                              base.setMonth(base.getMonth() + 30);
                              setFormData(prev => ({ ...prev, expiryDate: base.toISOString().split('T')[0] }));
                            } catch (_) {}
                          }}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.65rem', padding: '0.15rem 0.35rem', height: 'auto', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}
                          title="+2.5 Tahun (Intermediate Survey / Dok)"
                        >
                          +2.5 Thn
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            try {
                              const base = new Date((formData.issueDate || new Date().toISOString().split('T')[0]) + 'T00:00:00');
                              base.setFullYear(base.getFullYear() + 5);
                              setFormData(prev => ({ ...prev, expiryDate: base.toISOString().split('T')[0] }));
                            } catch (_) {}
                          }}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.65rem', padding: '0.15rem 0.35rem', height: 'auto', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}
                          title="+5 Tahun (Renewal / Special Survey / Full Term)"
                        >
                          +5 Thn
                        </button>
                      </div>
                    </div>
                    <input
                      type="date"
                      required
                      value={formData.expiryDate || ''}
                      onClick={(e) => {
                        try { e.target.showPicker(); } catch (_) {}
                      }}
                      onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className="input-control mono"
                      style={{ cursor: 'pointer', fontWeight: 600 }}
                      title="Klik untuk memilih tanggal dari kalender"
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.3rem', fontSize: '0.72rem', flexWrap: 'wrap', gap: '0.2rem' }}>
                      <span style={{ color: 'var(--text-subtle)' }}>
                        Batas akhir masa berlaku
                      </span>
                      {formData.expiryDate && (
                        <span style={{ color: '#f59e0b', fontWeight: 600, background: 'rgba(245, 158, 11, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                          📅 {formatIndonesianDate(formData.expiryDate)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a855f7' }}>
                      <ShieldCheck size={14} />
                      <span>Sifat Masa Berlaku (Certificate Term) *</span>
                    </label>
                    <select
                      value={formData.certificateTerm || 'Full Term (Definitif)'}
                      onChange={(e) => setFormData(prev => ({ ...prev, certificateTerm: e.target.value }))}
                      className="select-control"
                      style={{ fontWeight: 600 }}
                    >
                      <option value="Full Term (Definitif)">Full Term (Definitif / 5 Thn / 1 Thn Penuh)</option>
                      <option value="Interim (Sementara / Provisional)">Interim (Sementara / Provisional - Max 5 Bulan)</option>
                      <option value="Short Term / Extension">Short Term / Extension (Dispensasi Perpanjangan)</option>
                    </select>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
                      Status keabsahan: Definitif resmi atau sertifikat sementara
                    </span>
                  </div>
                </div>

                {/* Visual Helper: Jendela Survei Maritim (IMO SOLAS & BKI Survey Window ±3 Bulan) */}
                {surveyWindow && (
                  <div style={{
                    padding: '0.65rem 0.95rem',
                    borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    fontSize: '0.76rem',
                    color: 'var(--text-main)'
                  }}>
                    <Anchor size={15} color="#38bdf8" style={{ flexShrink: 0 }} />
                    <div>
                      <strong>Jendela Survei Maritim (IMO SOLAS & BKI ±3 Bulan):</strong>{' '}
                      <span style={{ color: '#38bdf8', fontWeight: 700 }}>{surveyWindow.windowStart} s/d {surveyWindow.windowEnd}</span>{' '}
                      <span style={{ color: 'var(--text-muted)' }}>(Ulang Tahun Tahunan: {surveyWindow.anniversaryLabel})</span>
                    </div>
                  </div>
                )}
              </div>
  );
};
