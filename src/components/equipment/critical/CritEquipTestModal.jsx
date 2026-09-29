/**
 * CritEquipTestModal.jsx
 * Diekstrak dari CriticalEquipmentView.jsx (baris 310-468).
 * Sumber: Modal input hasil uji darurат alat (ISM 10.3) lengkap dengan status dan catatan
 */
import React from 'react';
import { Save, ShieldAlert, X } from 'lucide-react';

export const CritEquipTestModal = ({
  handleSaveTest,
  handleTestCategoryChange,
  setShowTestModal,
  setTestForm,
  testForm,
}) => {
  return (
    <div style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(10, 16, 30, 0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1.25rem'
            }}>
              <div className="glass-card" style={{
                width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto',
                borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.4)',
                padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <ShieldAlert size={22} color="#ef4444" />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                      Catat Pengujian Peralatan Kritis (ISM Code 10.3)
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTestModal(false)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveTest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      Kategori Sistem Kritis
                    </label>
                    <select
                      value={testForm.testCategory}
                      onChange={(e) => handleTestCategoryChange(e.target.value)}
                      className="input-base"
                      style={{ width: '100%' }}
                    >
                      <option value="Generator Darurat (Emergency Generator)">Generator Darurat & Blackout Test (Mingguan)</option>
                      <option value="Pompa Pemadam Darurat (Fire Pump)">Pompa Pemadam Darurat & Tekanan Hydrant (2 Mingguan)</option>
                      <option value="Quick Closing Valve (QCV)">Quick Closing Valve Tangki Solar Harian (Bulanan)</option>
                      <option value="Sistem Kemudi Darurat (Emergency Steering)">Sistem Kemudi Darurat & Waktu Cikar (Bulanan)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      Judul Prosedur Pengujian
                    </label>
                    <input
                      type="text"
                      value={testForm.testTitle}
                      onChange={(e) => setTestForm({ ...testForm, testTitle: e.target.value })}
                      className="input-base"
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        Tanggal Pengujian
                      </label>
                      <input
                        type="date"
                        value={testForm.testDate}
                        onChange={(e) => setTestForm({ ...testForm, testDate: e.target.value })}
                        className="input-base"
                        style={{ width: '100%' }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        Hasil Pengujian
                      </label>
                      <select
                        value={testForm.testResult}
                        onChange={(e) => setTestForm({ ...testForm, testResult: e.target.value })}
                        className="input-base"
                        style={{ width: '100%' }}
                      >
                        <option value="Pass / Berfungsi Baik">✅ Pass / Berfungsi Baik</option>
                        <option value="Defective / Butuh Perbaikan">❌ Defective / Butuh Perbaikan Segera</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      Hasil Pengamatan & Catatan Parameter Teknis
                    </label>
                    <textarea
                      rows={3}
                      value={testForm.observations}
                      onChange={(e) => setTestForm({ ...testForm, observations: e.target.value })}
                      className="input-base"
                      style={{ width: '100%', resize: 'vertical' }}
                      placeholder="Catat waktu auto-start, tegangan, tekanan air, atau respons tuas darurat..."
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        Teknisi Pelaksana
                      </label>
                      <input
                        type="text"
                        value={testForm.conductedBy}
                        onChange={(e) => setTestForm({ ...testForm, conductedBy: e.target.value })}
                        className="input-base"
                        style={{ width: '100%' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        Verifikasi KKM / Nakhoda
                      </label>
                      <input
                        type="text"
                        value={testForm.verifiedByChief}
                        onChange={(e) => setTestForm({ ...testForm, verifiedByChief: e.target.value })}
                        className="input-base"
                        style={{ width: '100%' }}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setShowTestModal(false)}
                      className="btn btn-neutral"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ background: '#ef4444', borderColor: '#ef4444' }}
                    >
                      <Save size={16} />
                      <span>Simpan Catatan Uji Darurat</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
  );
};
