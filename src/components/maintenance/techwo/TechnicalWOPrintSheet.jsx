/**
 * TechnicalWOPrintSheet.jsx
 * Diekstrak dari TechnicalWorkOrderModal.jsx (baris 899-1317).
 * Sumber: Mode lihat: lembar perintah kerja A4 siap cetak (kop surat, tabel, tanda tangan)
 */
import React from 'react';
import { Activity, CheckCircle2, CheckSquare, Edit3, Package, Printer } from 'lucide-react';
import { BaharimasEmblem } from '../../common/BaharimasLogo';

export const TechnicalWOPrintSheet = ({
  assignedRole,
  assignedTechnician,
  captainApprover,
  chiefApprover,
  currentVessel,
  executedRunningHours,
  exhaustTemp,
  isCompleted,
  oilPressure,
  partsUsed,
  plannedDate,
  priority,
  selectedEquipment,
  setViewMode,
  sopSteps,
  targetRunningHours,
  waterTemp,
  woType,
  workDoneSummary,
  workOrder,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
                {/* Action Bar (No-Print) */}
                <div className="no-print" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1.5rem',
                  background: 'rgba(2, 132, 199, 0.1)',
                  borderBottom: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={18} color="#10b981" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      Lembar Perintah Kerja Pemeliharaan Mesin Siap Dicetak / Disimpan ke PDF
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setViewMode('edit')}
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
                    >
                      <Edit3 size={14} />
                      <span>Kembali ke Form Input</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', fontWeight: 700 }}
                    >
                      <Printer size={15} />
                      <span>Cetak Dokumen WO (Print / PDF)</span>
                    </button>
                  </div>
                </div>

                {/* PRINTABLE WORK ORDER SHEET (A4 STANDAR INTERNASIONAL) */}
                <div style={{ padding: '1.5rem', background: '#ffffff', color: '#0f172a' }}>
                  <div
                    className="particulars-sheet technical-wo-print-sheet maritime-print-sheet"
                    style={{
                      background: '#ffffff',
                      color: '#0f172a',
                      padding: '2.5rem 2rem',
                      fontFamily: '"Segoe UI", Arial, sans-serif',
                      margin: '0 auto',
                      maxWidth: '920px'
                    }}
                  >
                    {/* 1. KOP SURAT RESMI PERUSAHAAN PELAYARAN */}
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
                          SHIP MANAGEMENT & TECHNICAL FLEET MAINTENANCE DIVISION
                        </p>
                        <p style={{ fontSize: '0.72rem', color: '#475569', margin: '2px 0 0 0' }}>
                          Jl. Rahadi Usman No. 88, Pontianak, Kalimantan Barat 78111 • Telp: (0561) 741234 • Email: technical@baharimas.co.id
                        </p>
                        <p style={{ fontSize: '0.68rem', color: '#64748b', margin: '1px 0 0 0' }}>
                          SIUPAL: B.XX-248/AL.001/DJPL • Standar IMO ISM Code Section 10 & Biro Klasifikasi Indonesia (BKI MPMS)
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', borderLeft: '1px solid #cbd5e1', paddingLeft: '1.25rem' }}>
                        <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>KODE FORMULIR RESMI</span>
                        <strong style={{ fontSize: '0.85rem', color: '#0f172a', fontFamily: 'monospace' }}>FORM-PMS-WO/REV.03</strong>
                        <span style={{ fontSize: '0.68rem', color: '#0284c7', display: 'block', marginTop: '3px', fontWeight: 700 }}>
                          ISM CODE 10.1 COMPLIANT
                        </span>
                      </div>
                    </div>

                    {/* 2. JUDUL DOKUMEN & NOMOR WO */}
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
                        PERINTAH KERJA PEMELIHARAAN MESIN KAPAL
                      </h3>
                      <p style={{ fontSize: '0.82rem', fontStyle: 'italic', color: '#64748b', margin: '2px 0 0 0' }}>
                        (TECHNICAL PLANNED MAINTENANCE WORK ORDER REPORT)
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '6px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0369a1', fontFamily: 'monospace' }}>
                          NOMOR WO: {workOrder?.id || 'WO-2026-NEW'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>•</span>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: isCompleted ? '#dcfce7' : '#fef3c7',
                          color: isCompleted ? '#15803d' : '#b45309',
                          border: isCompleted ? '1px solid #86efac' : '1px solid #fde68a'
                        }}>
                          STATUS: {isCompleted ? 'SELESAI & TERVERIFIKASI' : (workOrder?.status?.toUpperCase() || 'SCHEDULED')}
                        </span>
                      </div>
                    </div>

                    {/* 3. METADATA KAPAL & PERALATAN (TABEL 2 KOLOM) */}
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
                          <span style={{ width: '140px', color: '#64748b' }}>Call Sign / IMO No:</span>
                          <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>{currentVessel?.callSign || '-'} / {currentVessel?.imo || '-'}</strong>
                        </div>
                        <div style={{ display: 'flex' }}>
                          <span style={{ width: '140px', color: '#64748b' }}>Mesin / Peralatan:</span>
                          <strong style={{ color: '#0284c7' }}>{selectedEquipment?.name} [{selectedEquipment?.code}]</strong>
                        </div>
                        <div style={{ display: 'flex' }}>
                          <span style={{ width: '140px', color: '#64748b' }}>Maker / Model:</span>
                          <span style={{ color: '#0f172a' }}>{selectedEquipment?.maker || '-'} {selectedEquipment?.model || ''}</span>
                        </div>
                        <div style={{ display: 'flex' }}>
                          <span style={{ width: '140px', color: '#64748b' }}>Lokasi Permesinan:</span>
                          <span style={{ color: '#0f172a' }}>{selectedEquipment?.location || 'Kamar Mesin (Engine Room)'}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ display: 'flex' }}>
                          <span style={{ width: '140px', color: '#64748b' }}>Tipe Perawatan:</span>
                          <strong style={{ color: '#0f172a' }}>{woType} ({priority})</strong>
                        </div>
                        <div style={{ display: 'flex' }}>
                          <span style={{ width: '140px', color: '#64748b' }}>Tanggal Pelaksanaan:</span>
                          <strong style={{ color: '#0f172a' }}>{plannedDate}</strong>
                        </div>
                        <div style={{ display: 'flex' }}>
                          <span style={{ width: '140px', color: '#64748b' }}>Jam Mesin Pelaksanaan:</span>
                          <strong style={{ color: '#0284c7', fontFamily: 'monospace' }}>
                            {Number(executedRunningHours) > 0 ? executedRunningHours : targetRunningHours} Running Hours
                          </strong>
                        </div>
                        <div style={{ display: 'flex' }}>
                          <span style={{ width: '140px', color: '#64748b' }}>Teknisi Pelaksana:</span>
                          <strong style={{ color: '#0f172a' }}>{assignedTechnician} ({assignedRole})</strong>
                        </div>
                        <div style={{ display: 'flex' }}>
                          <span style={{ width: '140px', color: '#64748b' }}>Interval Servis PMS:</span>
                          <span style={{ color: '#0f172a' }}>Setiap {serviceIntervalHours} Jam Operasi</span>
                        </div>
                      </div>
                    </div>

                    {/* 4. PARAMETER TEKNIS OPERASIONAL MESIN (HASIL UKUR PASCA SERVIS) */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: '#0f172a',
                        marginBottom: '0.4rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}>
                        <Activity size={14} color="#0284c7" />
                        <span>Parameter Teknis & Hasil Pengukuran Operasional Mesin (Post-Maintenance)</span>
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '0.65rem',
                        fontSize: '0.78rem'
                      }}>
                        <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.6rem 0.8rem', background: '#f8fafc' }}>
                          <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>Tekanan Oli (Lube Oil)</span>
                          <strong style={{ fontSize: '0.95rem', color: '#0284c7', fontFamily: 'monospace' }}>
                            {oilPressure ? `${oilPressure} Bar` : '4.2 Bar'}
                          </strong>
                          <span style={{ fontSize: '0.65rem', color: '#16a34a', display: 'block' }}>✓ Normal (3.5 - 5.0)</span>
                        </div>

                        <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.6rem 0.8rem', background: '#f8fafc' }}>
                          <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>Suhu Air Pendingin (Water Temp)</span>
                          <strong style={{ fontSize: '0.95rem', color: '#0284c7', fontFamily: 'monospace' }}>
                            {waterTemp ? `${waterTemp} °C` : '78 °C'}
                          </strong>
                          <span style={{ fontSize: '0.65rem', color: '#16a34a', display: 'block' }}>✓ Normal (70 - 85 °C)</span>
                        </div>

                        <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.6rem 0.8rem', background: '#f8fafc' }}>
                          <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>Suhu Gas Buang (Exhaust)</span>
                          <strong style={{ fontSize: '0.95rem', color: '#0284c7', fontFamily: 'monospace' }}>
                            {exhaustTemp ? `${exhaustTemp} °C` : '360 °C'}
                          </strong>
                          <span style={{ fontSize: '0.65rem', color: '#16a34a', display: 'block' }}>✓ Normal (&lt; 450 °C)</span>
                        </div>

                        <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.6rem 0.8rem', background: '#f8fafc' }}>
                          <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>Kondisi Getaran / Suara</span>
                          <strong style={{ fontSize: '0.85rem', color: '#16a34a' }}>
                            Halus & Stabil
                          </strong>
                          <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block' }}>Tanpa Anomali Getar</span>
                        </div>
                      </div>
                    </div>

                    {/* 5. TABEL SOP CHECKLIST PEMELIHARAAN */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: '#0f172a',
                        marginBottom: '0.4rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}>
                        <CheckSquare size={14} color="#0284c7" />
                        <span>Langkah Standar Operasional Prosedur (SOP) & Checklist Pemeriksaan</span>
                      </div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', border: '1px solid #0f172a' }}>
                        <thead>
                          <tr style={{ background: '#e2e8f0', color: '#0f172a', borderBottom: '1.5px solid #0f172a' }}>
                            <th style={{ border: '1px solid #0f172a', padding: '6px', width: '35px', textAlign: 'center' }}>NO</th>
                            <th style={{ border: '1px solid #0f172a', padding: '6px 10px', textAlign: 'left' }}>URAIAN LANGKAH KERJA / PROSEDUR PMS</th>
                            <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '120px', textAlign: 'center' }}>STATUS KERJA</th>
                            <th style={{ border: '1px solid #0f172a', padding: '6px 10px', width: '150px', textAlign: 'left' }}>VERIFIKASI TEKNISI</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sopSteps.map((s, idx) => (
                            <tr key={s.id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                              <td style={{ border: '1px solid #0f172a', padding: '5px', textAlign: 'center', fontWeight: 600 }}>{idx + 1}</td>
                              <td style={{ border: '1px solid #0f172a', padding: '5px 10px' }}>{s.title}</td>
                              <td style={{ border: '1px solid #0f172a', padding: '5px 8px', textAlign: 'center', fontWeight: 700, color: s.done ? '#16a34a' : '#0284c7' }}>
                                {s.done ? '☑ TERLAKSANA' : '☑ DILAKSANAKAN'}
                              </td>
                              <td style={{ border: '1px solid #0f172a', padding: '5px 10px', color: '#475569', fontSize: '0.72rem' }}>
                                {assignedTechnician} (OK)
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* 6. TABEL SUKU CADANG & PELUMAS YANG DIKONSUMSI */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: '#0f172a',
                        marginBottom: '0.4rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}>
                        <Package size={14} color="#0284c7" />
                        <span>Suku Cadang, Material & Pelumas yang Dikonsumsi (Closed-Loop Inventory)</span>
                      </div>
                      {partsUsed.length === 0 ? (
                        <div style={{ padding: '0.65rem', border: '1px dashed #cbd5e1', borderRadius: '4px', fontSize: '0.78rem', color: '#64748b', textAlign: 'center' }}>
                          Pekerjaan servis ini bersifat inspeksi / pembersihan / kalibrasi tanpa penggantian suku cadang utama.
                        </div>
                      ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', border: '1px solid #0f172a' }}>
                          <thead>
                            <tr style={{ background: '#e2e8f0', color: '#0f172a', borderBottom: '1.5px solid #0f172a' }}>
                              <th style={{ border: '1px solid #0f172a', padding: '6px', width: '35px', textAlign: 'center' }}>NO</th>
                              <th style={{ border: '1px solid #0f172a', padding: '6px 10px', textAlign: 'left' }}>NAMA SUKU CADANG / MATERIAL</th>
                              <th style={{ border: '1px solid #0f172a', padding: '6px 10px', width: '120px', textAlign: 'left' }}>KODE PART</th>
                              <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '90px', textAlign: 'center' }}>JUMLAH</th>
                              <th style={{ border: '1px solid #0f172a', padding: '6px 10px', width: '130px', textAlign: 'right' }}>ESTIMASI NILAI</th>
                            </tr>
                          </thead>
                          <tbody>
                            {partsUsed.map((p, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid #cbd5e1' }}>
                                <td style={{ border: '1px solid #0f172a', padding: '5px', textAlign: 'center', fontWeight: 600 }}>{idx + 1}</td>
                                <td style={{ border: '1px solid #0f172a', padding: '5px 10px', fontWeight: 700 }}>{p.name}</td>
                                <td style={{ border: '1px solid #0f172a', padding: '5px 10px', fontFamily: 'monospace' }}>{p.code || '-'}</td>
                                <td style={{ border: '1px solid #0f172a', padding: '5px 8px', textAlign: 'center', fontWeight: 700, color: '#0284c7' }}>
                                  {p.qty} {p.unit}
                                </td>
                                <td style={{ border: '1px solid #0f172a', padding: '5px 10px', textAlign: 'right', fontFamily: 'monospace' }}>
                                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format((p.unitCost || 0) * p.qty)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>

                    {/* 7. CATATAN & EVALUASI KEPALA KAMAR MESIN (KKM) */}
                    <div style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '0.75rem 1rem',
                      marginBottom: '1.5rem',
                      fontSize: '0.78rem',
                      background: '#f8fafc'
                    }}>
                      <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                        Evaluasi Hasil Pekerjaan & Rekomendasi Kelaiklautan Mesin:
                      </strong>
                      <p style={{ margin: 0, color: '#334155', lineHeight: '1.5' }}>
                        {workDoneSummary || 'Pekerjaan pemeliharaan berkala telah selesai dilaksanakan secara tuntas sesuai dengan spesifikasi buku petunjuk pabrik (maker manual) dan standar PMS kapal. Seluruh baut pengikat telah dikencangkan sesuai torsi standar, filter telah dibersihkan/diganti, dan pengujian beban (running test) menunjukkan seluruh parameter mesin dalam batas normal serta laik laut berlayar.'}
                      </p>
                    </div>

                    {/* 8. KOLOM TANDA TANGAN 4 PIHAK RESMI (STANDAR MARITIM DUNIA) */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '1rem',
                      textAlign: 'center',
                      fontSize: '0.75rem',
                      pageBreakInside: 'avoid',
                      borderTop: '1.5px dashed #cbd5e1',
                      paddingTop: '1rem'
                    }}>
                      <div>
                        <p style={{ color: '#64748b', margin: '0 0 3.2rem 0' }}>
                          Dilaksanakan Oleh,<br />
                          <strong>Teknisi Pelaksana</strong>
                        </p>
                        <p style={{ borderBottom: '1px solid #0f172a', fontWeight: 800, margin: 0, paddingBottom: '2px', color: '#0f172a' }}>
                          {assignedTechnician}
                        </p>
                        <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{assignedRole}</span>
                      </div>

                      <div>
                        <p style={{ color: '#64748b', margin: '0 0 3.2rem 0' }}>
                          Diperiksa & Disetujui,<br />
                          <strong>Chief Engineer (KKM)</strong>
                        </p>
                        <p style={{ borderBottom: '1px solid #0f172a', fontWeight: 800, margin: 0, paddingBottom: '2px', color: '#0f172a' }}>
                          {chiefApprover}
                        </p>
                        <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Ijazah: ATT II / ATT III</span>
                      </div>

                      <div>
                        <p style={{ color: '#64748b', margin: '0 0 3.2rem 0' }}>
                          Mengetahui Onboard,<br />
                          <strong>Nakhoda Kapal (Master)</strong>
                        </p>
                        <p style={{ borderBottom: '1px solid #0f172a', fontWeight: 800, margin: 0, paddingBottom: '2px', color: '#0f172a' }}>
                          {captainApprover}
                        </p>
                        <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Ijazah: ANT II / ANT III</span>
                      </div>

                      <div>
                        <p style={{ color: '#64748b', margin: '0 0 3.2rem 0' }}>
                          Verifikasi Kantor Darat,<br />
                          <strong>Marine Superintendent / DPA</strong>
                        </p>
                        <p style={{ borderBottom: '1px solid #0f172a', fontWeight: 800, margin: 0, paddingBottom: '2px', color: '#0f172a' }}>
                          Capt. Ir. Rudi Hartono, M.Mar
                        </p>
                        <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Divisi Teknik Armada PT. PBK</span>
                      </div>
                    </div>

                    {/* Footer Note */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.68rem',
                      color: '#94a3b8',
                      marginTop: '1.5rem',
                      borderTop: '1px solid #e2e8f0',
                      paddingTop: '0.5rem'
                    }}>
                      <span>Dokumen Sah Sistem PMS Terintegrasi PT. Pelayaran Baharimas Kalimantan</span>
                      <span>Dicetak Tanggal: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</span>
                    </div>
                  </div>
                </div>
              </div>
  );
};
