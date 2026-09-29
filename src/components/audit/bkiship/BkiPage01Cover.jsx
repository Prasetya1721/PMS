/**
 * BkiPage01Cover.jsx
 * Diekstrak dari BkiShipboardChecklistReport.jsx (baris 201-398).
 * Sumber: HALAMAN 1 DARI 10: COVER, IDENTITAS AUDIT & KAPAL, PANDUAN SOLAS
 */
import React from 'react';
import { BaharimasReportLogo } from '../AuditInstitutionHeader';

export const BkiPage01Cover = ({
  auditDateStr,
  auditLocation,
  auditorName,
  masterName,
  renderBkiPageFooter,
  renderBkiTopBar,
  reportNo,
  runningHeaderTitle,
  session,
  vessel,
  vesselName,
}) => {
  return (
    <div className="bki-print-page" style={{ marginBottom: '25px', paddingBottom: '10px' }}>
            {renderBkiTopBar()}

            <div style={{ textAlign: 'right', fontSize: '6.8pt', color: '#000000', marginBottom: '4px', fontWeight: 600 }}>
              {runningHeaderTitle}
            </div>

            {/* HEADER COVER: LOGO PT PELAYARAN BAHARIMAS & KOTAK JUDUL BILINGUAL RESMI */}
            <div style={{ display: 'flex', alignItems: 'stretch', border: '1.5px solid #000000', marginBottom: '8px' }}>
              <div style={{ width: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #000000', padding: '6px' }}>
                <BaharimasReportLogo />
              </div>
              <div style={{ flex: 1, padding: '4px 8px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '8.5pt', fontWeight: 900, textTransform: 'uppercase', color: '#000000' }}>
                  CHECKLIST UNTUK SISTEM MANAJEMEN KESELAMATAN KAPAL
                </div>
                <div style={{ fontSize: '7.5pt', fontWeight: 800, color: '#1e3a8a', fontStyle: 'italic' }}>
                  CHECKLIST FOR SHIPBOARD SAFETY MANAGEMENT SYSTEM
                </div>
                <div style={{ fontSize: '6.2pt', color: '#1e293b', marginTop: '2px', lineHeight: 1.25 }}>
                  Audit berdasarkan ketentuan INTERNATIONAL CONVENTION FOR THE SAFETY OF LIFE AT SEA, 1974 Chapter IX dan ISM Code.<br />
                  <span style={{ fontStyle: 'italic', color: '#475569' }}>Audit under the provisions of the INTERNATIONAL CONVENTION FOR THE SAFETY OF LIFE AT SEA, 1974 Chapter IX and ISM Code.</span>
                </div>
              </div>
            </div>

            {/* TABEL DATA AUDIT (NO LAPORAN, NO SMK, TANGGAL, JENIS AUDIT, AUDITOR) */}
            {(() => {
              const scopeLower = String(session?.scope || session?.auditNo || '').toLowerCase();
              const isAwal = scopeLower.includes('awal') || scopeLower.includes('initial');
              const isAntara = scopeLower.includes('antara') || scopeLower.includes('interim') || scopeLower.includes('intermediate');
              const isTambahan = scopeLower.includes('tambahan') || scopeLower.includes('additional');
              const isPembaruan = !isAwal && !isAntara && !isTambahan;
              const resolvedSmcNo = session?.smcCertificateNo || vessel?.smcCertificateNo || (vesselName ? `SMC-TB-${vesselName.replace(/\s+/g, '')}/2026` : '—');

              return (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '7pt', border: '1px solid #000000', marginBottom: '6px' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '38%', padding: '3px 6px', border: '1px solid #000000' }}>
                        <div style={{ fontSize: '6.2pt' }}>No. Laporan / <em>Report Number</em></div>
                        <div style={{ fontWeight: 800 }}>{reportNo}</div>
                      </td>
                      <td style={{ width: '27%', padding: '3px 6px', border: '1px solid #000000' }}>
                        <div style={{ fontSize: '6.2pt' }}>No. SMK / <em>SMS No</em></div>
                        <div style={{ fontWeight: 700 }}>{resolvedSmcNo}</div>
                      </td>
                      <td style={{ width: '35%', padding: '3px 6px', border: '1px solid #000000' }}>
                        <div style={{ fontSize: '6.2pt' }}>Tanggal Audit / <em>Date of Audit</em></div>
                        <div style={{ fontWeight: 800 }}>{auditDateStr}</div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '3px 6px', border: '1px solid #000000' }}>
                        <div style={{ fontSize: '6.2pt' }}>Jenis Audit / <em>Type of Audit</em></div>
                        <div style={{ fontWeight: 700, fontSize: '6.8pt', marginTop: '1px' }}>
                          <span>{isPembaruan ? '☒' : '☐'} Audit Pembaruan</span> &nbsp;
                          <span>{isAwal ? '☒' : '☐'} Awal</span> &nbsp;
                          <span>{isAntara ? '☒' : '☐'} Antara</span> &nbsp;
                          <span>{isTambahan ? '☒' : '☐'} Tambahan</span>
                        </div>
                      </td>
                      <td colSpan={2} style={{ padding: '3px 6px', border: '1px solid #000000' }}>
                        <div style={{ fontSize: '6.2pt' }}>Auditor Yang Melaksanakan Audit: / <em>Auditor(S) Performing Audit</em></div>
                        <div style={{ fontWeight: 900, fontSize: '7.5pt', textTransform: 'uppercase' }}>{auditorName}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              );
            })()}

            {/* DENGAN INI DILAPORKAN HASIL TINDAK LANJUT AUDIT */}
            <div style={{ fontSize: '6.5pt', fontWeight: 700, marginBottom: '4px' }}>
              Dengan ini dilaporkan hasil tindak lanjut audit sebagai berikut :<br />
              <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Herewith report follow up audit as follows :</span>
            </div>

            {/* TABEL DATA PERUSAHAAN & KAPAL LENGKAP */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.8pt', border: '1px solid #000000', marginBottom: '8px' }}>
              <tbody>
                <tr>
                  <td style={{ width: '22%', padding: '3px 5px', border: '1px solid #000000', fontWeight: 600 }}>
                    Nama Perusahaan<br /><em>Name of the Company</em>
                  </td>
                  <td style={{ width: '43%', padding: '3px 5px', border: '1px solid #000000', fontWeight: 800 }}>
                    PT. PELAYARAN BAHARIMAS KALIMANTAN
                  </td>
                  <td style={{ width: '20%', padding: '3px 5px', border: '1px solid #000000', fontWeight: 600 }}>
                    Nomor IMO Perusahaan<br /><em>IMO Company Number</em>
                  </td>
                  <td style={{ width: '15%', padding: '3px 5px', border: '1px solid #000000', fontWeight: 800 }}>
                    9049645
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 5px', border: '1px solid #000000', fontWeight: 600 }}>
                    Alamat<br /><em>Address</em>
                  </td>
                  <td colSpan={3} style={{ padding: '3px 5px', border: '1px solid #000000', fontSize: '6.5pt' }}>
                    JL. ADISUCIPTO KM 6+30 RT.04 RW.04 DESA SUNGAI RAYA, KEC SUNGAI RAYA, KUBU RAYA, PONTIANAK - KALBAR
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 5px', border: '1px solid #000000', fontWeight: 600 }}>
                    Nama Kapal<br /><em>Name of Ship</em>
                  </td>
                  <td style={{ padding: '3px 5px', border: '1px solid #000000', fontWeight: 900, color: '#003b6f' }}>
                    {vesselName}
                  </td>
                  <td style={{ padding: '3px 5px', border: '1px solid #000000', fontWeight: 600 }}>
                    Nomor IMO<br /><em>IMO Number</em>
                  </td>
                  <td style={{ padding: '3px 5px', border: '1px solid #000000', fontWeight: 800 }}>
                    {vessel?.imo || session?.imo || vessel?.regNo || '-'}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 5px', border: '1px solid #000000', fontWeight: 600 }}>
                    Tipe Kapal<br /><em>Type of Ship</em>
                  </td>
                  <td style={{ padding: '3px 5px', border: '1px solid #000000' }}>
                    {vessel?.type || session?.vesselType || 'Kapal Tunda (Tugboat)'}
                  </td>
                  <td style={{ padding: '3px 5px', border: '1px solid #000000', fontWeight: 600 }}>
                    Nomor/Huruf Pengenal<br /><em>Distinctive Number/Letters</em>
                  </td>
                  <td style={{ padding: '3px 5px', border: '1px solid #000000', fontWeight: 800 }}>
                    {vessel?.callSign || session?.callSign || '-'}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 5px', border: '1px solid #000000', fontWeight: 600 }}>
                    Pelabuhan Pendaftaran<br /><em>Port of Registry</em>
                  </td>
                  <td style={{ padding: '3px 5px', border: '1px solid #000000', fontWeight: 700 }}>
                    {vessel?.portOfRegistry || session?.portOfRegistry || 'PONTIANAK'}
                  </td>
                  <td style={{ padding: '3px 5px', border: '1px solid #000000', fontWeight: 600 }}>
                    Tonase Kotor<br /><em>Gross Tonnage</em>
                  </td>
                  <td style={{ padding: '3px 5px', border: '1px solid #000000', fontWeight: 800 }}>
                    {vessel?.gt ? String(vessel.gt) : (session?.gt ? String(session.gt) : '-')}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 5px', border: '1px solid #000000', fontWeight: 600 }}>
                    Personil Pelaksana / DPA<br /><em>Person in charge or DPA</em>
                  </td>
                  <td style={{ padding: '3px 5px', border: '1px solid #000000', fontWeight: 700 }}>
                    {masterName} (Nakhoda) / DPA PT. PBK
                  </td>
                  <td style={{ padding: '3px 5px', border: '1px solid #000000', fontWeight: 600 }}>
                    Lokasi Audit<br /><em>Audit location</em>
                  </td>
                  <td style={{ padding: '3px 5px', border: '1px solid #000000', fontWeight: 700 }}>
                    {auditLocation}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* PANDUAN PENGISIAN & CATATAN DEFISIENSI PSC */}
            <div style={{ border: '1px solid #000000', padding: '5px 8px', fontSize: '6.2pt', lineHeight: 1.25, background: '#fafafa', marginBottom: '8px' }}>
              <div style={{ fontWeight: 800, marginBottom: '2px' }}>Self-Checklist for Shipboard Safety Management System</div>
              <div style={{ color: '#475569', fontStyle: 'italic', marginBottom: '4px' }}>
                Note: This Checklist indicates items to be included at least in the samples at self-checking.
              </div>
              <div style={{ marginBottom: '4px' }}>
                <strong>* Refer to SOLAS IX/1</strong><br />
                Bulk carrier: If &quot;ESP&quot; is assigned to a dry cargo ship within Class Notation, the ship is &quot;Bulk carrier&quot; in terms of the ISM Code, otherwise the ship is &quot;Other Cargo Ship&quot;.<br />
                If there is a discrepancy of the vessel types between Safety Construction/Safety Equipment and the SMC, the &quot;Explanatory Note&quot; is available from Class BKI.
              </div>
              <div>
                <strong>**Note: Detainable deficiencies by PSC.</strong> Emergency fire pumps, lifeboats, and fire-dampers are continuing to be major items with most detainable deficiencies.<br />
                <em>Focusing items during Ship Tour/Interview/Verification of documents in addition to ordinary verification:</em><br />
                <strong>1.1 Documents:</strong> a. Working/rest hours, b. Oil Record Book & Garbage book, c. Trading Cert. & Crew Cert, d. Correction Charts/Pubs, e. Voyage plan, f. Drills, g. NC reporting, h. Internal audit.<br />
                <strong>1.2 Condition & maintenance:</strong> a. MF/HF GMDSS, b. Nav & Emergency lights, c. Hatch coaming, d. Steering gear, e. Lifeboats, f. Lifebuoys, g. Fire dampers & pump, h. Remote valves, i. OWS & Sewage, j. Cleanliness.<br />
                <strong>1.3 Familiarization:</strong> a. Operation of ECDIS, b. Oil content meter MPEC 107(49), c. Boat and fire drill.
              </div>
            </div>

            {/* KOTAK VERIFIKASI AWAL AUDIT */}
            <div style={{ border: '1px solid #000000', padding: '5px 8px', fontSize: '6.5pt', lineHeight: 1.35, background: '#ffffff' }}>
              <div style={{ fontWeight: 700, marginBottom: '3px' }}>Following items to be verified at the beginning of audit:</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span style={{ fontSize: '9pt', fontWeight: 900 }}>☒</span>
                <span>Is there a copy of valid DOC placed onboard the ship? <strong>(DOC shall NOT be an Interim)</strong></span>
              </div>
              <div style={{ fontWeight: 700, marginTop: '3px' }}>In the case of Initial Audit:</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '9pt', fontWeight: 900 }}>☐</span>
                <span>Are there any records which show that SMS onboard the ship has been implemented for, at least 3 months since the issue of Interim SMC and that an internal audit has been executed?</span>
              </div>
            </div>

            {renderBkiPageFooter(1)}
          </div>
  );
};
