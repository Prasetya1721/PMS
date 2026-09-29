/**
 * SafeManningPrintSheet.jsx
 * Diekstrak dari SafeManningMatrixModal.jsx (baris 356-663).
 * Sumber: Cabang cetak: lembar A4 resmi Safe Manning beserta kop surat, tabel formasi, dan blok tanda tangan
 */
import React from 'react';
import { Users } from 'lucide-react';
import { BaharimasEmblem } from '../../common/BaharimasLogo';

export const SafeManningPrintSheet = ({
  captainName,
  chiefName,
  chiefOfficerName,
  currentVessel,
  matrixEvaluation,
  onboardCrew,
}) => {
  return (
    <div
                  className="particulars-sheet safe-manning-print-sheet maritime-print-sheet"
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
                        FLEET MANNING & CREWING MANAGEMENT DIVISION
                      </p>
                      <p style={{ fontSize: '0.72rem', color: '#475569', margin: '2px 0 0 0' }}>
                        Jl. Rahadi Usman No. 88, Pontianak, Kalimantan Barat 78111 • Telp: (0561) 741234 • Email: crewing@baharimas.co.id
                      </p>
                      <p style={{ fontSize: '0.68rem', color: '#64748b', margin: '1px 0 0 0' }}>
                        SIUPAL: B.XX-248/AL.001/DJPL • Sesuai Standar Ditjen Perhubungan Laut RI & Konvensi Internasional STCW 1978/2010
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', borderLeft: '1px solid #cbd5e1', paddingLeft: '1.25rem' }}>
                      <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>KODE FORMULIR RESMI</span>
                      <strong style={{ fontSize: '0.85rem', color: '#0f172a', fontFamily: 'monospace' }}>FORM-STCW-SM/REV.02</strong>
                      <span style={{ fontSize: '0.68rem', color: '#0284c7', display: 'block', marginTop: '3px', fontWeight: 700 }}>
                        SOLAS REG. I/14
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
                      SURAT KETERANGAN EVALUASI KELAIKLAUTAN PENGAWAKAN KAPAL
                    </h3>
                    <p style={{ fontSize: '0.82rem', fontStyle: 'italic', color: '#64748b', margin: '2px 0 0 0' }}>
                      (MINIMUM SAFE MANNING COMPLIANCE REPORT & CREW STCW AUDIT)
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '6px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0369a1', fontFamily: 'monospace' }}>
                        NOMOR: SM-DJPL/2026/PBK-{currentVessel?.id?.toUpperCase() || '001'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>•</span>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: matrixEvaluation.isCompliant ? '#dcfce7' : '#fee2e2',
                        color: matrixEvaluation.isCompliant ? '#15803d' : '#b91c1c',
                        border: matrixEvaluation.isCompliant ? '1px solid #86efac' : '1px solid #fca5a5'
                      }}>
                        STATUS: {matrixEvaluation.isCompliant ? 'MEMENUHI SYARAT KELAIKLAUTAN' : 'NON-COMPLIANT / DEFISIENSI'}
                      </span>
                    </div>
                  </div>

                  {/* 3. METADATA KAPAL & SERTIFIKAT SAFE MANNING */}
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
                        <span style={{ width: '140px', color: '#64748b' }}>Gross Tonnage (GT):</span>
                        <strong style={{ color: '#0f172a' }}>{currentVessel?.particulars?.grossTonnage || '185'} GT</strong>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <span style={{ width: '140px', color: '#64748b' }}>Tenaga Mesin (BHP):</span>
                        <strong style={{ color: '#0f172a' }}>{currentVessel?.particulars?.mainEnginePower || '2x 1200'} BHP</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <div style={{ display: 'flex' }}>
                        <span style={{ width: '150px', color: '#64748b' }}>Daerah Pelayaran:</span>
                        <strong style={{ color: '#0f172a' }}>Kawasan Indonesia / Near Coastal</strong>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <span style={{ width: '150px', color: '#64748b' }}>Sertifikat DJPL No:</span>
                        <strong style={{ color: '#0369a1', fontFamily: 'monospace' }}>SM-DJPL/2025/PBK</strong>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <span style={{ width: '150px', color: '#64748b' }}>Total Kru Onboard:</span>
                        <strong style={{ color: '#0f172a' }}>{onboardCrew.length} Orang Awak</strong>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <span style={{ width: '150px', color: '#64748b' }}>Tanggal Audit:</span>
                        <strong style={{ color: '#0f172a' }}>
                          {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* 4. TABEL MATRIKS FORMASI AWAK */}
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
                      <Users size={14} color="#0284c7" />
                      <span>Matriks Formasi Jabatan, Standar Ijazah STCW, & Evaluasi Kelaiklautan</span>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', border: '1px solid #0f172a' }}>
                      <thead>
                        <tr style={{ background: '#e2e8f0', color: '#0f172a', borderBottom: '1.5px solid #0f172a' }}>
                          <th style={{ border: '1px solid #0f172a', padding: '6px', width: '30px', textAlign: 'center' }}>NO</th>
                          <th style={{ border: '1px solid #0f172a', padding: '6px 8px', textAlign: 'left' }}>JABATAN (STCW RANK)</th>
                          <th style={{ border: '1px solid #0f172a', padding: '6px 8px', textAlign: 'left', width: '160px' }}>SYARAT IJAZAH (COC / COP)</th>
                          <th style={{ border: '1px solid #0f172a', padding: '6px', width: '60px', textAlign: 'center' }}>WAJIB</th>
                          <th style={{ border: '1px solid #0f172a', padding: '6px', width: '60px', textAlign: 'center' }}>RIIL</th>
                          <th style={{ border: '1px solid #0f172a', padding: '6px 8px', textAlign: 'left' }}>AWAK KAPAL ONBOARD & SERTIFIKAT</th>
                          <th style={{ border: '1px solid #0f172a', padding: '6px', width: '90px', textAlign: 'center' }}>EVALUASI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matrixEvaluation.items.map((pos, idx) => (
                          <tr key={pos.id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                            <td style={{ border: '1px solid #cbd5e1', padding: '6px', textAlign: 'center', fontFamily: 'monospace' }}>
                              {idx + 1}
                            </td>
                            <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>
                              <strong style={{ display: 'block', color: '#0f172a' }}>{pos.rankTitle}</strong>
                              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Dept. {pos.department}</span>
                            </td>
                            <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>
                              <span style={{ fontWeight: 700, color: '#0369a1', display: 'block' }}>{pos.requiredCoc}</span>
                              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{pos.requiredCop}</span>
                            </td>
                            <td style={{ border: '1px solid #cbd5e1', padding: '6px', textAlign: 'center', fontWeight: 700 }}>
                              {pos.count}
                            </td>
                            <td style={{
                              border: '1px solid #cbd5e1',
                              padding: '6px',
                              textAlign: 'center',
                              fontWeight: 800,
                              color: pos.isSatisfied ? '#15803d' : '#b91c1c'
                            }}>
                              {pos.presentCount}
                            </td>
                            <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>
                              {pos.matchedCrew.length === 0 ? (
                                <span style={{ color: '#b91c1c', fontStyle: 'italic', fontWeight: 600 }}>
                                  [BELUM TERISI / VACANT]
                                </span>
                              ) : (
                                pos.matchedCrew.map((c, i) => (
                                  <div key={i} style={{ fontSize: '0.75rem', color: '#0f172a' }}>
                                    • <strong>{c.name}</strong>
                                    {c.hasExpiredCert && (
                                      <span style={{ color: '#b91c1c', fontWeight: 700, marginLeft: '4px' }}>
                                        (STCW EXPIRED!)
                                      </span>
                                    )}
                                  </div>
                                ))
                              )}
                            </td>
                            <td style={{
                              border: '1px solid #cbd5e1',
                              padding: '6px',
                              textAlign: 'center',
                              fontWeight: 700,
                              fontSize: '0.72rem',
                              background: pos.isSatisfied ? '#f0fdf4' : '#fef2f2',
                              color: pos.isSatisfied ? '#15803d' : '#b91c1c'
                            }}>
                              {pos.isSatisfied ? 'MEMENUHI' : 'DEFISIENSI'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* 5. KESIMPULAN & PERNYATAAN KELAIKLAUTAN */}
                  <div style={{
                    border: '1px solid #0f172a',
                    borderRadius: '6px',
                    padding: '0.85rem 1rem',
                    marginBottom: '1.5rem',
                    background: matrixEvaluation.isCompliant ? '#f8fafc' : '#fff1f2'
                  }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px', textTransform: 'uppercase' }}>
                      PERNYATAAN RESMI KELAIKLAUTAN PENGAWAKAN (SEAWORTHINESS DECLARATION):
                    </div>
                    <p style={{ margin: 0, fontSize: '0.76rem', lineHeight: 1.5, color: '#334155' }}>
                      {matrixEvaluation.isCompliant ? (
                        <>
                          Berdasarkan hasil pemeriksaan dokumen dan verifikasi fisik terhadap awak kapal <strong>{currentVessel?.name}</strong>,
                          dinyatakan bahwa kapal telah diawaki oleh personil yang memenuhi kualifikasi standar kompetensi minimum kepelautan (STCW 1978/2010),
                          sehat jasmani/rohani, dan memiliki sertifikat keahlian serta keterampilan yang masih berlaku.
                          Kapal dinyatakan <strong>LAIK LAUT (SEAWORTHY)</strong> dari segi formasi keselamatan pengawakan untuk melakukan pelayaran.
                        </>
                      ) : (
                        <>
                          Berdasarkan hasil pemeriksaan dokumen, terdapat <strong>defisiensi / ketidaksesuaian formasi</strong> di atas kapal <strong>{currentVessel?.name}</strong>.
                          Kapal dinyatakan <strong>BELUM MEMENUHI KELAIKLAUTAN PENGAWAKAN</strong> hingga seluruh kekurangan personil wajib dan/atau pembaruan sertifikat STCW dipenuhi.
                          Pemberitahuan resmi diteruskan ke Crewing & Marine Superintendent untuk mobilisasi segera.
                        </>
                      )}
                    </p>
                  </div>

                  {/* 6. KOLOM TANDA TANGAN 4 PIHAK MARITIM RESMI */}
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
                      <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>Diperiksa Oleh:</p>
                      <p style={{ fontWeight: 700, margin: 0, color: '#0f172a' }}>Perwira Geladak (Mualim I)</p>
                      <div style={{ height: '55px' }} />
                      <p style={{ fontWeight: 800, textDecoration: 'underline', margin: 0, color: '#0f172a' }}>{chiefOfficerName}</p>
                      <p style={{ fontSize: '0.68rem', color: '#64748b', margin: '2px 0 0 0' }}>Chief Officer</p>
                    </div>

                    <div>
                      <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>Diperiksa Oleh:</p>
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
                      <p style={{ fontWeight: 800, textDecoration: 'underline', margin: 0, color: '#0f172a' }}>Capt. Bambang Suryono</p>
                      <p style={{ fontSize: '0.68rem', color: '#64748b', margin: '2px 0 0 0' }}>DPA PT. Baharimas K.</p>
                    </div>
                  </div>

                  {/* 7. FOOTER NOTE */}
                  <div style={{
                    marginTop: '1.25rem',
                    borderTop: '1px dashed #cbd5e1',
                    paddingTop: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.68rem',
                    color: '#64748b'
                  }}>
                    <span>Dicetak melalui: Sistem PMS Kapal Baharimas Terintegrasi</span>
                    <span>Standar Mutu: ISM Code DOC-04/2026 • Port Clearance Compliant</span>
                    <span>Halaman 1 dari 1</span>
                  </div>
                </div>
  );
};
