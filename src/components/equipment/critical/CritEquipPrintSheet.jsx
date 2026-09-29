/**
 * CritEquipPrintSheet.jsx
 * Diekstrak dari CriticalEquipmentView.jsx (baris 473-826).
 * Sumber: Modal cetak resmi Log Uji Peralatan Kritis & Siap Darurat ISM Code 10.3
 */
import React from 'react';
import { Printer, ShieldAlert, X } from 'lucide-react';
import { BaharimasEmblem } from '../../common/BaharimasLogo';

export const CritEquipPrintSheet = ({
  captainName,
  chiefName,
  currentVessel,
  setShowPrintModal,
  vesselTests,
}) => {
  return (
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
  );
};
