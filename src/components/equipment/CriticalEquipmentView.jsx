import React, { useState, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
import { BaharimasEmblem } from '../common/BaharimasLogo';
import {
  ShieldAlert,
  Plus,
  Printer,
  Calendar,
  Zap,
  Flame,
  LifeBuoy,
  X,
  Save
} from 'lucide-react';

export const CriticalEquipmentView = ({ selectedVesselId }) => {
  const {
    vessels,
    allEquipment,
    criticalEquipmentTests,
    logCriticalEquipmentTest,
    canAction,
    showToast
  } = usePMS();

  const [showTestModal, setShowTestModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [filterResult, setFilterResult] = useState('ALL');

  const currentVessel = vessels.find(v => v.id === selectedVesselId) || vessels[0];

  const captainName = useMemo(() => {
    return (
      currentVessel?.masterCaptain ||
      currentVessel?.particulars?.masterCaptain ||
      'Capt. Hendra Gunawan, M.Mar'
    );
  }, [currentVessel]);

  const chiefName = useMemo(() => {
    return (
      currentVessel?.chiefEngineer ||
      currentVessel?.particulars?.chiefEngineer ||
      'Ir. Bambang Wijaya (KKM)'
    );
  }, [currentVessel]);

  const vesselTests = useMemo(() => {
    return (criticalEquipmentTests || []).filter(t => {
      if (selectedVesselId && selectedVesselId !== 'all') {
        return t.vesselId === selectedVesselId;
      }
      return true;
    });
  }, [criticalEquipmentTests, selectedVesselId]);

  const filteredTests = useMemo(() => {
    if (filterResult === 'ALL') return vesselTests;
    return vesselTests.filter(t => t.testResult?.includes(filterResult));
  }, [vesselTests, filterResult]);

  // Form New Test State
  const [testForm, setTestForm] = useState({
    testCategory: 'Generator Darurat (Emergency Generator)',
    testTitle: 'Uji Mingguan Auto-Start & Beban Generator Darurat',
    equipmentName: 'Emergency Generator Cummins 120 kVA',
    testDate: new Date().toISOString().split('T')[0],
    intervalDays: 7,
    conductedBy: 'Kurniawan (Masinis 2)',
    verifiedByChief: 'Ir. Bambang Wijaya (KKM)',
    testResult: 'Pass / Berfungsi Baik',
    loadTestDurationMinutes: 30,
    voltageObserved: 380,
    observations: 'Simulasi pemadaman (blackout) berhasil. Generator darurat auto-start dalam 12 detik. Beban lampu darurat & radio bekerja normal.'
  });

  const handleTestCategoryChange = (cat) => {
    let title = '';
    let eqName = '';
    let interval = 7;
    let obs = '';

    if (cat.includes('Generator')) {
      title = 'Uji Mingguan Auto-Start & Beban Generator Darurat';
      eqName = 'Emergency Generator Cummins 120 kVA';
      interval = 7;
      obs = 'Simulasi blackout berhasil. Generator auto-start dalam 12 detik dan mensuplai switchboard darurat.';
    } else if (cat.includes('Fire Pump')) {
      title = 'Uji Pompa Pemadam Darurat & Tekanan Hydrant Geladak';
      eqName = 'Emergency Fire Pump Yanmar Diesel';
      interval = 14;
      obs = 'Pancaran air hydrant geladak utama mencapai >15 meter dengan tekanan 6.5 bar.';
    } else if (cat.includes('Quick Closing')) {
      title = 'Uji Tarik Kawat Pneumatik Emergency Fuel Shut-off';
      eqName = 'Quick Closing Valve Tangki Harian BBM';
      interval = 30;
      obs = 'Klep penutup cepat tangki solar menutup rapat seketika saat tuas luar kamar mesin ditarik.';
    } else if (cat.includes('Steering')) {
      title = 'Uji Transisi Pompa Kemudi Darurat & Waktu Cikar Kemudi';
      eqName = 'Steering Gear Dual Hydraulic Pump';
      interval = 30;
      obs = 'Waktu gerak cikar kanan 35° ke cikar kiri 30° tercapai 22 detik (standar SOLAS <28 detik).';
    }

    setTestForm(prev => ({
      ...prev,
      testCategory: cat,
      testTitle: title,
      equipmentName: eqName,
      intervalDays: interval,
      observations: obs
    }));
  };

  const handleSaveTest = (e) => {
    e.preventDefault();
    const nextDue = new Date(new Date(testForm.testDate).getTime() + testForm.intervalDays * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];

    const payload = {
      ...testForm,
      vesselId: selectedVesselId === 'all' ? (vessels[0]?.id || 'v-001') : selectedVesselId,
      nextTestDue: nextDue
    };

    logCriticalEquipmentTest(payload);
    setShowTestModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Banner ISM Code 10.3 */}
      <div className="glass-card" style={{
        padding: '1.25rem 1.5rem',
        borderRadius: '12px',
        border: '1px solid rgba(239, 68, 68, 0.35)',
        background: 'linear-gradient(to right, rgba(239, 68, 68, 0.08), rgba(15, 23, 42, 0.5))',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f87171'
          }}>
            <ShieldAlert size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#f87171' }}>
                Peralatan Kritis & Pengujian Siap Darurat (Standar ISM Code 10.3)
              </h3>
              <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>
                Mandatory ISM Audit
              </span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
              Peralatan teknis yang kegagalan mendadaknya dapat menimbulkan situasi bahaya navigasi atau keselamatan jiwa. Wajib diuji berkala dengan catatan bukti objektif.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            onClick={() => setShowPrintModal(true)}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.5rem 0.9rem' }}
          >
            <Printer size={15} />
            <span>Format Cetak A4 / PDF</span>
          </button>

          <button
            onClick={() => setShowTestModal(true)}
            className="btn btn-primary"
            style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', background: '#ef4444', borderColor: '#ef4444' }}
          >
            <Plus size={16} />
            <span>Catat Pengujian Darurat Baru</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['ALL', 'Pass', 'Defective'].map(f => (
            <button
              key={f}
              onClick={() => setFilterResult(f)}
              className={`tab-btn ${filterResult === f ? 'active' : ''}`}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
            >
              {f === 'ALL' ? 'Semua Hasil Uji' : (f === 'Pass' ? '✅ Berfungsi Baik (Pass)' : '❌ Butuh Perbaikan (Defective)')}
            </button>
          ))}
        </div>

        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Total Tercatat: <strong>{filteredTests.length} Riwayat Pengujian</strong>
        </span>
      </div>

      {/* Grid of Tests */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '1rem' }}>
        {filteredTests.map(test => {
          const isPass = test.testResult?.includes('Pass');
          const testVessel = vessels.find(v => v.id === test.vesselId);

          return (
            <div
              key={test.id}
              className="glass-card"
              style={{
                padding: '1.25rem',
                borderRadius: '12px',
                border: isPass ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.4)',
                background: isPass ? 'rgba(16, 185, 129, 0.03)' : 'rgba(239, 68, 68, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: isPass ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isPass ? '#10b981' : '#f87171'
                  }}>
                    {test.testCategory?.includes('Generator') ? <Zap size={18} /> :
                     test.testCategory?.includes('Fire') ? <Flame size={18} /> :
                     test.testCategory?.includes('Steering') ? <LifeBuoy size={18} /> : <ShieldAlert size={18} />}
                  </div>
                  <div>
                    <span className="badge badge-neutral" style={{ fontSize: '0.68rem', marginBottom: '2px' }}>
                      {testVessel?.name || 'Armada Baharimas'} • {test.testCategory}
                    </span>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>
                      {test.testTitle}
                    </h4>
                  </div>
                </div>

                <span className={`badge ${isPass ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.72rem' }}>
                  {test.testResult}
                </span>
              </div>

              <div style={{
                padding: '0.75rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.825rem',
                color: 'var(--text-main)'
              }}>
                <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-muted)' }}>
                  "{test.observations}"
                </p>
                {test.voltageObserved && (
                  <div style={{ marginTop: '0.4rem', display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#38bdf8' }}>
                    <span>Tegangan: <strong>{test.voltageObserved} V</strong></span>
                    {test.frequencyObserved && <span>Frekuensi: <strong>{test.frequencyObserved} Hz</strong></span>}
                    {test.loadTestDurationMinutes && <span>Durasi Uji: <strong>{test.loadTestDurationMinutes} Menit</strong></span>}
                  </div>
                )}
                {test.pressureObservedBar && (
                  <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: '#38bdf8' }}>
                    Tekanan Pancaran Air: <strong>{test.pressureObservedBar} bar</strong>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={13} />
                  <span>Diuji: <strong>{test.testDate}</strong> (Interval: {test.intervalDays} Hari)</span>
                </div>
                <div>
                  Uji Berikutnya: <strong style={{ color: '#f59e0b' }}>{test.nextTestDue}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', color: 'var(--text-muted)' }}>
                <span>Penguji: <strong>{test.conductedBy}</strong></span>
                <span>Verifikasi: <strong>{test.verifiedByChief}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Catat Uji Darurat Baru */}
      {showTestModal && (
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
      )}

      {/* ========================================================================= */}
      {/* MODAL CETAK RESMI: LOG UJI PERALATAN KRITIS & SIAP DARURAT (ISM CODE 10.3) */}
      {/* ========================================================================= */}
      {showPrintModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(10, 16, 30, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1.25rem'
        }}>
          <div className="modal-dialog modal-dialog-large glass-card" style={{
            width: '100%',
            maxWidth: '940px',
            maxHeight: '92vh',
            overflowY: 'auto',
            borderRadius: '16px',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Action Bar (No-Print) */}
            <div className="no-print" style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(to right, rgba(239, 68, 68, 0.12), rgba(15, 23, 42, 0.6))'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <ShieldAlert size={22} color="#f87171" />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>
                    Pratinjau Cetak Log Uji Peralatan Kritis (ISM Code 10.3)
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Kapal: {currentVessel?.name} • Bukti Obyektif Audit Keselamatan & Kelaiklautan Maritim
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => window.print()}
                  className="btn btn-primary"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.95rem', fontWeight: 700 }}
                >
                  <Printer size={15} />
                  <span>Cetak Dokumen Sekarang</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* PRINTABLE SHEET CONTAINER (A4 MARITIM) */}
            <div style={{ padding: '1.5rem', background: '#ffffff', color: '#0f172a' }}>
              <div
                className="particulars-sheet critical-equipment-print-sheet maritime-print-sheet"
                style={{
                  background: '#ffffff',
                  color: '#0f172a',
                  padding: '2.5rem 2rem',
                  fontFamily: '"Segoe UI", Arial, sans-serif',
                  margin: '0 auto',
                  maxWidth: '920px'
                }}
              >
                {/* 1. KOP SURAT RESMI */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  borderBottom: '3px double #0f172a',
                  paddingBottom: '0.85rem',
                  marginBottom: '1.25rem'
                }}>
                  <BaharimasEmblem size={56} />
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      PT. PELAYARAN BAHARIMAS KALIMANTAN
                    </h2>
                    <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0369a1', margin: '2px 0 0 0', textTransform: 'uppercase' }}>
                      SAFETY, QUALITY & TECHNICAL MARINE OPERATIONS DIVISION
                    </p>
                    <p style={{ fontSize: '0.72rem', color: '#475569', margin: '2px 0 0 0' }}>
                      Jl. Rahadi Usman No. 88, Pontianak, Kalimantan Barat 78111 • Telp: (0561) 741234 • Email: safety@baharimas.co.id
                    </p>
                    <p style={{ fontSize: '0.68rem', color: '#64748b', margin: '1px 0 0 0' }}>
                      SIUPAL: B.XX-248/AL.001/DJPL • Standar ISM Code Clause 10.3 (Maintenance of Ship and Equipment - Critical Systems)
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', borderLeft: '1px solid #cbd5e1', paddingLeft: '1.25rem' }}>
                    <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>KODE FORMULIR RESMI</span>
                    <strong style={{ fontSize: '0.85rem', color: '#0f172a', fontFamily: 'monospace' }}>FORM-ISM-10.3/REV.02</strong>
                    <span style={{ fontSize: '0.68rem', color: '#dc2626', display: 'block', marginTop: '3px', fontWeight: 700 }}>
                      MANDATORY AUDIT
                    </span>
                  </div>
                </div>

                {/* 2. JUDUL DOKUMEN */}
                <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    color: '#0f172a',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    textDecoration: 'underline'
                  }}>
                    LOG BUKTI OBYEKTIF PENGUJIAN PERALATAN KRITIS & SIAP DARURAT
                  </h3>
                  <p style={{ fontSize: '0.82rem', fontStyle: 'italic', color: '#64748b', margin: '2px 0 0 0' }}>
                    (STAND-BY ARRANGEMENTS & CRITICAL SHIP EQUIPMENT OPERATIONAL TESTING LOG)
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0369a1', fontFamily: 'monospace' }}>
                      REGISTRASI LOG: LOG-CE-2026/{currentVessel?.id?.toUpperCase() || '001'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>•</span>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: vesselTests.some(t => !t.testResult?.includes('Pass')) ? '#fee2e2' : '#dcfce7',
                      color: vesselTests.some(t => !t.testResult?.includes('Pass')) ? '#b91c1c' : '#15803d',
                      border: vesselTests.some(t => !t.testResult?.includes('Pass')) ? '1px solid #fca5a5' : '1px solid #86efac'
                    }}>
                      STATUS SISTEM: {vesselTests.some(t => !t.testResult?.includes('Pass')) ? 'PERLU TINDAKAN KOREKTIF' : '100% SIAP OPERASI DARURAT'}
                    </span>
                  </div>
                </div>

                {/* 3. METADATA KAPAL & SCOPE */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1rem',
                  fontSize: '0.8rem',
                  background: '#f8fafc',
                  padding: '0.85rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex' }}>
                      <span style={{ width: '140px', color: '#64748b' }}>Nama Kapal:</span>
                      <strong style={{ color: '#0f172a' }}>{currentVessel?.name} ({currentVessel?.type})</strong>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <span style={{ width: '140px', color: '#64748b' }}>Call Sign / IMO:</span>
                      <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>{currentVessel?.callSign || '-'} / {currentVessel?.imo || '-'}</strong>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <span style={{ width: '140px', color: '#64748b' }}>Nakhoda Kapal:</span>
                      <strong style={{ color: '#0f172a' }}>{captainName}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex' }}>
                      <span style={{ width: '150px', color: '#64748b' }}>Kepala Kamar Mesin:</span>
                      <strong style={{ color: '#0f172a' }}>{chiefName}</strong>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <span style={{ width: '150px', color: '#64748b' }}>Standar Regulasi:</span>
                      <strong style={{ color: '#0369a1' }}>IMO SOLAS 74/78 & ISM Code 10.3</strong>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <span style={{ width: '150px', color: '#64748b' }}>Tanggal Cetak Rekap:</span>
                      <strong style={{ color: '#0f172a' }}>
                        {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* 4. SUMMARY BOXES */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.6rem', background: '#f8fafc' }}>
                    <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Total Pengujian Tercatat</span>
                    <strong style={{ fontSize: '1.1rem', color: '#0f172a', fontFamily: 'monospace' }}>{vesselTests.length} Sesi</strong>
                  </div>
                  <div style={{ border: '1px solid #86efac', borderRadius: '6px', padding: '0.6rem', background: '#f0fdf4' }}>
                    <span style={{ fontSize: '0.68rem', color: '#16a34a', display: 'block' }}>Lolos Uji (Pass)</span>
                    <strong style={{ fontSize: '1.1rem', color: '#15803d', fontFamily: 'monospace' }}>
                      {vesselTests.filter(t => t.testResult?.includes('Pass')).length} Sistem
                    </strong>
                  </div>
                  <div style={{ border: '1px solid #fca5a5', borderRadius: '6px', padding: '0.6rem', background: '#fef2f2' }}>
                    <span style={{ fontSize: '0.68rem', color: '#dc2626', display: 'block' }}>Butuh Perbaikan (Defective)</span>
                    <strong style={{ fontSize: '1.1rem', color: '#b91c1c', fontFamily: 'monospace' }}>
                      {vesselTests.filter(t => !t.testResult?.includes('Pass')).length} Sistem
                    </strong>
                  </div>
                  <div style={{ border: '1px solid #7dd3fc', borderRadius: '6px', padding: '0.6rem', background: '#f0f9ff' }}>
                    <span style={{ fontSize: '0.68rem', color: '#0284c7', display: 'block' }}>Interval Pengujian</span>
                    <strong style={{ fontSize: '0.95rem', color: '#0369a1' }}>7 s/d 30 Hari</strong>
                  </div>
                </div>

                {/* 5. TABEL LOG BUKTI OBYEKTIF PENGUJIAN */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', border: '1px solid #0f172a' }}>
                    <thead>
                      <tr style={{ background: '#e2e8f0', color: '#0f172a', borderBottom: '1.5px solid #0f172a' }}>
                        <th style={{ border: '1px solid #0f172a', padding: '6px', width: '30px', textAlign: 'center' }}>NO</th>
                        <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '85px', textAlign: 'center' }}>TGL UJI</th>
                        <th style={{ border: '1px solid #0f172a', padding: '6px 8px', textAlign: 'left', width: '150px' }}>SISTEM KRITIS</th>
                        <th style={{ border: '1px solid #0f172a', padding: '6px 8px', textAlign: 'left' }}>HASIL OBSERVASI & PENGUKURAN TEKNIS</th>
                        <th style={{ border: '1px solid #0f172a', padding: '6px', width: '80px', textAlign: 'center' }}>HASIL</th>
                        <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '140px', textAlign: 'left' }}>TEKNISI & VERIFIKASI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vesselTests.map((t, idx) => {
                        const isPass = t.testResult?.includes('Pass');
                        return (
                          <tr key={t.id || idx} style={{ borderBottom: '1px solid #cbd5e1' }}>
                            <td style={{ border: '1px solid #cbd5e1', padding: '6px', textAlign: 'center', fontFamily: 'monospace' }}>
                              {idx + 1}
                            </td>
                            <td style={{ border: '1px solid #cbd5e1', padding: '6px', textAlign: 'center', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                              {t.testDate}
                            </td>
                            <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>
                              <strong style={{ display: 'block', color: '#0f172a' }}>{t.equipmentName || t.testCategory}</strong>
                              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{t.testTitle}</span>
                            </td>
                            <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>
                              <p style={{ margin: 0, color: '#334155', fontStyle: 'italic' }}>"{t.observations}"</p>
                              <div style={{ marginTop: '3px', display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.7rem', color: '#0369a1', fontWeight: 600 }}>
                                {t.voltageObserved && <span>Tegangan: {t.voltageObserved}V</span>}
                                {t.pressureObservedBar && <span>Tekanan: {t.pressureObservedBar} bar</span>}
                                {t.loadTestDurationMinutes && <span>Durasi: {t.loadTestDurationMinutes} mnt</span>}
                              </div>
                            </td>
                            <td style={{
                              border: '1px solid #cbd5e1',
                              padding: '6px',
                              textAlign: 'center',
                              fontWeight: 800,
                              fontSize: '0.72rem',
                              background: isPass ? '#f0fdf4' : '#fef2f2',
                              color: isPass ? '#15803d' : '#b91c1c'
                            }}>
                              {isPass ? 'PASS' : 'DEFECT'}
                            </td>
                            <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', fontSize: '0.72rem' }}>
                              <div>Pelaksana: <strong>{t.conductedBy}</strong></div>
                              <div style={{ color: '#64748b', marginTop: '1px' }}>Verifikasi: {t.verifiedByChief}</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* 6. PERNYATAAN EVALUASI TEKNIS & ISM COMPLIANCE */}
                <div style={{
                  border: '1px solid #0f172a',
                  borderRadius: '6px',
                  padding: '0.85rem 1rem',
                  marginBottom: '1.5rem',
                  background: '#f8fafc'
                }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px', textTransform: 'uppercase' }}>
                    EVALUASI TEKNIS & TINDAKAN KOREKTIF (ISM CODE 10.3 COMPLIANCE):
                  </div>
                  <p style={{ margin: 0, fontSize: '0.76rem', lineHeight: 1.5, color: '#334155' }}>
                    Seluruh pengujian rutin terhadap peralatan darurat (Emergency Generator, Emergency Fire Pump, Quick Closing Valve, dan Emergency Steering)
                    telah dilaksanakan dengan metode simulasi beban riil. Apabila terdeteksi kegagalan start atau parameter di luar batas toleransi,
                    tindakan perbaikan segera diterbitkan melalui Work Order Corrective Maintenance dan dicatat dalam Non-Conformity Report (NCR).
                  </p>
                </div>

                {/* 7. TANDA TANGAN 4 PIHAK MARITIM RESMI */}
                <div style={{
                  marginTop: '1.5rem',
                  borderTop: '1.5px solid #0f172a',
                  paddingTop: '1rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  pageBreakInside: 'avoid'
                }}>
                  <div>
                    <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>Teknisi Penguji:</p>
                    <p style={{ fontWeight: 700, margin: 0, color: '#0f172a' }}>Perwira Mesin (Masinis)</p>
                    <div style={{ height: '55px' }} />
                    <p style={{ fontWeight: 800, textDecoration: 'underline', margin: 0, color: '#0f172a' }}>Kurniawan, A.Md</p>
                    <p style={{ fontSize: '0.68rem', color: '#64748b', margin: '2px 0 0 0' }}>2nd Engineer</p>
                  </div>

                  <div>
                    <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>Diperiksa & Diverifikasi:</p>
                    <p style={{ fontWeight: 700, margin: 0, color: '#0f172a' }}>Kepala Kamar Mesin</p>
                    <div style={{ height: '55px' }} />
                    <p style={{ fontWeight: 800, textDecoration: 'underline', margin: 0, color: '#0f172a' }}>{chiefName}</p>
                    <p style={{ fontSize: '0.68rem', color: '#64748b', margin: '2px 0 0 0' }}>Chief Engineer</p>
                  </div>

                  <div>
                    <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>Mengetahui & Menyetujui:</p>
                    <p style={{ fontWeight: 700, margin: 0, color: '#0f172a' }}>Nakhoda Kapal</p>
                    <div style={{ height: '55px' }} />
                    <p style={{ fontWeight: 800, textDecoration: 'underline', margin: 0, color: '#0f172a' }}>{captainName}</p>
                    <p style={{ fontSize: '0.68rem', color: '#64748b', margin: '2px 0 0 0' }}>Master / Captain</p>
                  </div>

                  <div>
                    <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>Divalidasi Kantor Pusat:</p>
                    <p style={{ fontWeight: 700, margin: 0, color: '#0f172a' }}>Marine Superintendent / DPA</p>
                    <div style={{ height: '55px' }} />
                    <p style={{ fontWeight: 800, textDecoration: 'underline', margin: 0, color: '#0f172a' }}>Ir. Heri Prasetyo</p>
                    <p style={{ fontSize: '0.68rem', color: '#64748b', margin: '2px 0 0 0' }}>Technical Superintendent</p>
                  </div>
                </div>

                {/* 8. FOOTER NOTE */}
                <div style={{
                  marginTop: '1.25rem',
                  borderTop: '1px dashed #cbd5e1',
                  paddingTop: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.68rem',
                  color: '#64748b'
                }}>
                  <span>Dicetak melalui: Sistem PMS Kapal Baharimas (ISM Code Operational System)</span>
                  <span>Standar ISM: Clause 10.3 Stand-by Arrangements</span>
                  <span>Halaman 1 dari 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
