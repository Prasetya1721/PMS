import React from 'react';
import { BkiLogo } from './AuditInstitutionHeader';
import { formatIndoDate } from '../../utils/auditTimeUtils';

/**
 * Komponen Cetak Resmi Checklist BKI 10 Halaman
 * Dokumen Acuan Persis 1:1:
 * 00954PK26_F23_14_06-2024 Rev05 SMS SHIPBOARD CHECKLIST.pdf
 * Standar: F23.14.06-2024 Rev 05 / Document Revision 00
 */
export const BkiShipboardChecklistReport = ({
  session,
  vessel,
  liveChecklist = null,
  findings = []
}) => {
  // Resolusi data kapal dan sesi
  const vesselName = vessel?.name || session?.targetName || 'Armada Kapal';
  const reportNo = session?.reportId || session?.auditNo || '0859-PK/ISM-SMC/2026';
  const auditDateStr = session?.auditDate ? formatIndoDate(session.auditDate) : 'August 18, 2026';
  const auditorName = session?.leadAuditor || session?.leadAuditorSign || 'MUHSON NURROCHMAT S';
  const masterName = session?.auditee || vessel?.masterCaptain || 'CAPT. EKHSAN';
  const auditLocation = session?.auditLocation || 'PULANG PISAU';

  const runningHeaderTitle = `Report id: PT. PELAYARAN BAHARIMAS KALIMANTAN - ${vesselName} – ${reportNo}`;

  // Sumber checklist efektif: prioritaskan liveChecklist lalu session.checklist
  const effectiveList = (Array.isArray(liveChecklist) && liveChecklist.length > 0)
    ? liveChecklist
    : (Array.isArray(session?.checklist) && session.checklist.length > 0)
    ? session.checklist
    : [];

  // Helper render hasil checklist (Yes / No / N/A)
  const getResultBoxes = (item) => {
    const isStriked = Boolean(item?.isStrikethrough);
    const res = item?.result || '';
    const isYes = !isStriked && (res === 'Yes' || res === 'Complied');
    const isNo = !isStriked && ['No', 'Minor NC', 'Major NC', 'Observation'].includes(res);
    const isNA = isStriked || res === 'N/A';

    return {
      yesBox: isYes ? '☒' : '☐',
      noBox: isNo ? '☒' : '☐',
      naBox: isNA ? '☒' : '☐',
      isStriked,
      isNo,
      res
    };
  };

  // Helper lookup item dari effectiveList berdasarkan nomor atau kode
  const findItem = (no) => {
    if (effectiveList.length > 0) {
      const match = effectiveList.find(c =>
        c.no === no ||
        c.code === no ||
        c.id === no ||
        c.id === `chk-${no}` ||
        c.id === `chk-add-${no}` ||
        String(c.code || '').trim().toLowerCase() === String(no).trim().toLowerCase() ||
        String(c.no || '').trim().toLowerCase() === String(no).trim().toLowerCase()
      );
      if (match) return match;
    }
    return { no, result: '', isStrikethrough: false, remark: '' };
  };

  // Helper render baris tabel checklist BKI
  const renderRow = (no, text, ismCode = '', customRemark = '', subChecks = null, isStrikethroughForced = false) => {
    const item = findItem(no);
    const { yesBox, noBox, naBox, isNo, isStriked } = getResultBoxes(item);
    const finalStriked = isStrikethroughForced || isStriked;

    // Rujukan temuan NC jika ada (pencocokan fleksibel)
    const relatedFinding = findings.find(f => {
      const fCode = String(f.clauseCode || f.elementNumberOfCode || '').trim();
      const noStr = String(no || '').trim();
      const itemCode = String(item?.code || '').trim();
      return (fCode && (fCode === noStr || fCode === itemCode || fCode.startsWith(`${noStr}.`) || noStr.startsWith(`${fCode}.`)));
    });
    const remarkContent = relatedFinding
      ? `See NC ${relatedFinding.findingNo || '1/4'}`
      : (item?.notes ? item.notes : (finalStriked ? 'Tidak berlaku (dicoret)' : (customRemark || item?.remark || '')));

    return (
      <tr key={no} style={{ background: finalStriked ? '#fcfcfc' : isNo ? '#fff5f5' : '#ffffff', position: 'relative' }}>
        {/* Kolom No */}
        <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', verticalAlign: 'middle', fontWeight: 600, fontSize: '6.8pt', width: '6%' }}>
          <span style={{ textDecoration: finalStriked ? 'line-through' : 'none', color: finalStriked ? '#64748b' : '#000000' }}>
            {no}
          </span>
        </td>

        {/* Kolom Items to be checked */}
        <td style={{ padding: '3px 6px', border: '1px solid #000000', verticalAlign: 'top', fontSize: '6.8pt', lineHeight: 1.35, width: '45%' }}>
          <div style={{ textDecoration: finalStriked ? 'line-through' : 'none', color: finalStriked ? '#64748b' : '#000000' }}>
            {item?.checkPoint ? (
              <div>
                <span style={{ fontWeight: 600 }}>{item.checkPoint}</span>
                {text && text !== item.checkPoint && (
                  <span style={{ fontSize: '6pt', color: finalStriked ? '#94a3b8' : '#64748b', fontStyle: 'italic', display: 'block', marginTop: '1px' }}>
                    {text}
                  </span>
                )}
              </div>
            ) : (
              text
            )}
          </div>
          {subChecks && (
            <div style={{ marginTop: '2px', fontSize: '6.2pt', color: finalStriked ? '#94a3b8' : '#334155' }}>
              {subChecks}
            </div>
          )}
        </td>

        {/* Kolom Result: Yes */}
        <td style={{ padding: '2px', border: '1px solid #000000', textAlign: 'center', verticalAlign: 'middle', width: '5%', fontSize: '10pt', fontWeight: 900 }}>
          {finalStriked ? '☐' : yesBox}
        </td>

        {/* Kolom Result: No */}
        <td style={{ padding: '2px', border: '1px solid #000000', textAlign: 'center', verticalAlign: 'middle', width: '5%', fontSize: '10pt', fontWeight: 900, color: isNo ? '#dc2626' : '#000000' }}>
          {finalStriked ? '☐' : noBox}
        </td>

        {/* Kolom Result: N/A */}
        <td style={{ padding: '2px', border: '1px solid #000000', textAlign: 'center', verticalAlign: 'middle', width: '5%', fontSize: '10pt', fontWeight: 900, color: finalStriked ? '#64748b' : '#000000' }}>
          {finalStriked ? '☒' : naBox}
        </td>

        {/* Kolom Remark */}
        <td style={{ padding: '3px 5px', border: '1px solid #000000', verticalAlign: 'top', fontSize: '6.5pt', lineHeight: 1.3, width: '26%', color: isNo ? '#b91c1c' : '#000000', fontWeight: isNo ? 700 : 400 }}>
          {remarkContent}
        </td>

        {/* Kolom ISM Code */}
        <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', verticalAlign: 'middle', fontSize: '6.8pt', fontWeight: 700, width: '8%' }}>
          {item?.ismCode || ismCode}
        </td>
      </tr>
    );
  };

  // Header atas bar BKI
  const renderBkiTopBar = () => (
    <div style={{ height: '14px', background: '#003b6f', position: 'relative', marginBottom: '6px', borderRadius: '2px 2px 0 0', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '90px', background: '#ff6600', transform: 'skewX(-25deg)', transformOrigin: 'top right' }} />
    </div>
  );

  // Running Header & Table Header BKI
  const renderBkiTableHeader = () => (
    <>
      <div style={{ textAlign: 'right', fontSize: '6.8pt', color: '#000000', marginBottom: '4px', fontWeight: 600 }}>
        {runningHeaderTitle}
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.8pt', border: '1.5px solid #000000' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th rowSpan={2} style={{ padding: '3px 2px', border: '1px solid #000000', width: '6%', textAlign: 'center', verticalAlign: 'middle', fontWeight: 800 }}>No.</th>
            <th rowSpan={2} style={{ padding: '3px 6px', border: '1px solid #000000', width: '45%', textAlign: 'center', verticalAlign: 'middle', fontWeight: 800 }}>Items to be checked</th>
            <th colSpan={3} style={{ padding: '2px', border: '1px solid #000000', width: '15%', textAlign: 'center', fontWeight: 800 }}>Result</th>
            <th rowSpan={2} style={{ padding: '3px 4px', border: '1px solid #000000', width: '26%', textAlign: 'center', verticalAlign: 'middle', fontWeight: 800 }}>
              Remark<br />
              <span style={{ fontWeight: 400, fontSize: '5.5pt', fontStyle: 'italic' }}>(details are to be specified in the field if the result is NO)</span>
            </th>
            <th rowSpan={2} style={{ padding: '3px 2px', border: '1px solid #000000', width: '8%', textAlign: 'center', verticalAlign: 'middle', fontWeight: 800 }}>ISM Code</th>
          </tr>
          <tr style={{ background: '#f1f5f9' }}>
            <th style={{ padding: '2px', border: '1px solid #000000', width: '5%', textAlign: 'center', fontWeight: 700, fontSize: '6.5pt' }}>Yes</th>
            <th style={{ padding: '2px', border: '1px solid #000000', width: '5%', textAlign: 'center', fontWeight: 700, fontSize: '6.5pt' }}>No</th>
            <th style={{ padding: '2px', border: '1px solid #000000', width: '5%', textAlign: 'center', fontWeight: 700, fontSize: '6.5pt' }}>N/A</th>
          </tr>
          <tr style={{ background: '#ffffff' }}>
            <td colSpan={7} style={{ padding: '2px 5px', border: '1px solid #000000', fontSize: '6pt', fontStyle: 'italic', color: '#334155' }}>
              Notice: The parts of checklist which are not used during audit should be deleted by lines appropriate according to the audit scope.
            </td>
          </tr>
        </thead>
      </table>
    </>
  );

  // Footer BKI resmi per halaman
  const renderBkiPageFooter = (pageNum) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '6.5pt', color: '#000000', paddingTop: '8px', borderTop: '1px solid #000000', marginTop: '10px' }}>
      <div>F23.14.06-2024 Rev 05</div>
      <div>Document Revision <strong>00</strong></div>
      <div><strong>{pageNum}/10</strong></div>
    </div>
  );

  return (
    <div className="bki-full-report-container" style={{ fontFamily: "'Arial', 'Segoe UI', sans-serif", color: '#000000', lineHeight: 1.3 }}>

      {/* ===================================================================== */}
      {/* HALAMAN 1 DARI 10: COVER, IDENTITAS AUDIT & KAPAL, PANDUAN SOLAS      */}
      {/* ===================================================================== */}
      <div className="bki-print-page" style={{ marginBottom: '25px', paddingBottom: '10px' }}>
        {renderBkiTopBar()}

        <div style={{ textAlign: 'right', fontSize: '6.8pt', color: '#000000', marginBottom: '4px', fontWeight: 600 }}>
          {runningHeaderTitle}
        </div>

        {/* HEADER COVER: LOGO BKI & KOTAK JUDUL BILINGUAL RESMI */}
        <div style={{ display: 'flex', alignItems: 'stretch', border: '1.5px solid #000000', marginBottom: '8px' }}>
          <div style={{ width: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #000000', padding: '6px' }}>
            <BkiLogo width={95} height={42} />
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

      {/* ===================================================================== */}
      {/* HALAMAN 2 DARI 10: 1. SHIPBOARD TOUR (1.1 s/d 1.4 ABK)                */}
      {/* ===================================================================== */}
      <div className="bki-print-page" style={{ marginBottom: '25px', paddingBottom: '10px' }}>
        {renderBkiTopBar()}
        {renderBkiTableHeader()}

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.8pt', border: '1px solid #000000', borderTop: 'none' }}>
          <tbody>
            {/* Header Seksi 1 */}
            <tr style={{ background: '#1e293b', color: '#ffffff' }}>
              <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900, width: '6%' }}>1</td>
              <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                SHIPBOARD TOUR &amp; GENERAL REQUIREMENT
              </td>
            </tr>

            {/* 1.1 Bridge */}
            <tr style={{ background: '#e2e8f0', fontWeight: 800 }}>
              <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center' }}>1.1</td>
              <td colSpan={6} style={{ padding: '2px 6px', border: '1px solid #000000' }}>Bridge</td>
            </tr>
            {renderRow('1.1.1', 'Are there any Navigation equipment or radio equipment left inoperative/ malfunctioned?', '10', 'If Yes, go to 10.11 up to 10.14')}
            {renderRow('1.1.2', 'Are updated versions of nautical publications and IAMSAR Manual (Volume III) available?', '11.2.1', 'SOLAS V/21 & 27')}
            {renderRow('1.1.3', 'Are maritime safety information from NAVTEX or EGC checked regularly?', '7')}
            {renderRow('1.1.4', 'Are nautical charts and Notice to Mariners controlled properly?', '7')}
            {renderRow('1.1.5', 'Is ENCs updated in accordance with ECDIS handling procedure in SMS properly?', '7')}
            {renderRow('1.1.6', 'Are standing order or night order issued regularly by the master?', '7')}

            {/* 1.2 Accommodation Space */}
            <tr style={{ background: '#e2e8f0', fontWeight: 800 }}>
              <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center' }}>1.2</td>
              <td colSpan={6} style={{ padding: '2px 6px', border: '1px solid #000000' }}>Accomodation Space</td>
            </tr>
            {renderRow('1.2.1', 'Are there any crew accommodation facilities left inoperative/ malfunctioned? Common toilets, Shower & toilet in cabins etc.', '10', 'If Yes, go to 10.11 up to 10.14')}
            {renderRow('1.2.2', 'Are posted Muster lists updated? (Engine Room, Accommodation Room, Bridge)', '8.2', 'SOLAS III/37')}
            {renderRow('1.2.3', 'Is SOLAS training manual controlled properly? (Mess Room, Recreation Room)', '8.2', 'SOLAS III/36')}
            {renderRow('1.2.4', 'Are ship\'s drawings and instruction books controlled properly?', '11.2.1', 'SOLAS II-1/3-7')}
            {renderRow('1.2.5', 'Is posted placard for garbage disposal written in language understood by crew?', '6.6', 'MARPOL V/9')}
            {renderRow('1.2.6', 'Are there distinctively marked garbage receptacles to receive garbage for recycling? Any receptacles on deck area secured and tight.', '6.6', 'MARPOL V, MEPC.201(62)')}
            {renderRow('1.2.7', 'Is watch schedule for watchkeeper posted?', '7', 'STCW A-VIII/1.5')}
            {renderRow('1.2.8', 'Is hospital accommodation ready for emergency use?', '')}
            {renderRow('1.2.9', 'Are medicaments properly controlled?', '')}

            {/* 1.3 On Deck & Engine Room */}
            <tr style={{ background: '#e2e8f0', fontWeight: 800 }}>
              <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center' }}>1.3</td>
              <td colSpan={6} style={{ padding: '2px 6px', border: '1px solid #000000' }}>On Deck &amp; Engine Room</td>
            </tr>
            {renderRow('1.3.1', 'Are closing appliances, L.S.A. and F.F.A maintained properly? (Lifeboat, Rescue boat, Fire damper)', '10', 'If No, go to 10.11 up to 10.14')}
            {renderRow('1.3.2', 'Are coating / painting of hull parts and equipment maintained properly?', '10', 'If Yes, go to 10.11 up to 10.14')}
            {renderRow('1.3.3', 'Are there any damaged or corroded / rusted equipment or hull parts?', '10')}
            {renderRow('1.3.4', 'Are there any temporarily repaired parts?', '10')}
            {renderRow('1.3.6', 'Are there any machinery and equipment left with their function inoperative? (Fire pump, Emergency fire pump, OWS system)', '10.2', 'If Yes, go to 10.11 up to 10.14')}
            {renderRow('1.3.7', 'Are escape route and escape trunk from engine room secured?', '8.2', 'SOLAS II-2/13')}
            {renderRow('1.3.8', 'Is operating instruction of steering changeover posted?', '8.2', 'SOLAS V/26 3.1')}

            {/* 1.4 Ratings Interview */}
            <tr style={{ background: '#e2e8f0', fontWeight: 800 }}>
              <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center' }}>1.4</td>
              <td colSpan={6} style={{ padding: '2px 6px', border: '1px solid #000000' }}>Interview with officers and/or ratings during tour through</td>
            </tr>
            <tr>
              <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center' }}>1.4.1</td>
              <td style={{ padding: '2px 6px', border: '1px solid #000000' }}>Interview with the Officer and/or Rating for</td>
              <td colSpan={5} style={{ padding: '2px 6px', border: '1px solid #000000' }}>
                Deck: <strong>Rank: Juru Mudi</strong> | Engine: <strong>Rank: Juru Minyak</strong> | Catering: <strong>Rank: Koki</strong>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center' }}>1.4.2</td>
              <td style={{ padding: '2px 6px', border: '1px solid #000000' }}>When did he join?</td>
              <td colSpan={4} style={{ padding: '2px 6px', border: '1px solid #000000' }}>
                Deck: <strong>30/05/2023</strong> | Engine: <strong>16/11/2022</strong> | Catering: <strong>30/05/2023</strong>
              </td>
              <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 700 }}>6.3</td>
            </tr>
            <tr>
              <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center' }}>1.4.3</td>
              <td style={{ padding: '2px 6px', border: '1px solid #000000' }}>Did he undergo familiarization training just after joining?</td>
              <td colSpan={4} style={{ padding: '2px 6px', border: '1px solid #000000' }}>
                Deck: ☒Yes / ☐No | Engine: ☒Yes / ☐No | Catering: ☒Yes / ☐No
              </td>
              <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 700 }}>6.3</td>
            </tr>
          </tbody>
        </table>

        {renderBkiPageFooter(2)}
      </div>

      {/* ===================================================================== */}
      {/* HALAMAN 3 DARI 10: 1.4.4 s/d 1.5.17 (NAKHODA, CREW LIST, LOG BOOK)    */}
      {/* ===================================================================== */}
      <div className="bki-print-page" style={{ marginBottom: '25px', paddingBottom: '10px' }}>
        {renderBkiTopBar()}
        {renderBkiTableHeader()}

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.8pt', border: '1px solid #000000', borderTop: 'none' }}>
          <tbody>
            {renderRow('1.4.4', 'Was essential instruction prior to sailing given to him?', '-', 'Reflect to 8.8 (☒Yes / ☐No)')}
            {renderRow('1.4.5', 'When did he last participate in an abandon ship drill?', '8.2', 'Deck: 24/06/2026, Eng: 24/06/2026, Cat: 24/06/2026')}
            {renderRow('1.4.6', 'Does he know his assigned duties in emergency?', '8.2', '☒Yes / ☐No')}
            {renderRow('1.4.7', 'Does he know how to donning and use fireman outfit and/or breathing apparatus (including EEBD)?', '8.2', '☒Yes / ☐No')}
            {renderRow('1.4.8', 'Does he understand what alarm signals may sound in emergency?', '-', '☒Yes / ☐No')}
            {renderRow('1.4.9', 'Have there been any accidents or hazardous occurrences (near-miss) on board?', '-', 'Reflect to 9.2')}
            {renderRow('1.4.10', 'Did he receive a copy of the records of daily rest hours endorsed by Master or person authorized?', '7', 'STCW A-VIII.7 (☒Yes / ☐No)')}

            {/* 1.5 Interview with the Master */}
            <tr style={{ background: '#e2e8f0', fontWeight: 800 }}>
              <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center' }}>1.5</td>
              <td colSpan={6} style={{ padding: '2px 6px', border: '1px solid #000000' }}>Interview with the Master (Statutory &amp; Crewing)</td>
            </tr>
            {renderRow('1.5.1', 'Are valid statutory certificates, Continuous Synopsis Record (CSR) and survey records available on board?', '1.2.3.1')}
            {renderRow('1.5.2', 'Is validity of statutory certificates informed to the company as per the procedures?', '10.1 or 11.1')}
            {renderRow('1.5.3', 'Are valid Classification Certificate and records available on board the ship?', '1.2.3.1')}
            {renderRow('1.5.4', 'Are ESP file including documents related to ESP survey available on board the ship?', '1.2.3.1')}
            {renderRow('1.5.5', 'Does every seafarer hold a valid medical certificate?', '1.2.3.1', 'STCW I-9 3')}

            <tr>
              <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center' }}>1.5.6</td>
              <td style={{ padding: '2px 6px', border: '1px solid #000000' }}>Number and Nationality of Master, Officers &amp; Ratings</td>
              <td colSpan={4} style={{ padding: '2px 6px', border: '1px solid #000000' }}>
                Master &amp; Officers: <strong>Indonesia (6 Org)</strong> | Ratings: <strong>Indonesia (4 Org)</strong>
              </td>
              <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 700 }}>-</td>
            </tr>

            {renderRow('1.5.7', 'Is the ship manned in compliance with the Safe Manning Certificate?', '6.2.2', 'SOLAS V/14')}
            {renderRow('1.5.8', 'Does each of Master or Officer hold a Certificate of competency or a Dispensation in accordance with STCW?', '6.2.1', 'STCW I-2')}
            {renderRow('1.5.9', 'When serving onboard a ship flying Flag of a Country other than Party, endorsement attesting recognition held?', '6.2.1', 'STCW I-10')}
            {renderRow('1.5.10', 'Are original copies of Master\'s or Officer\'s Certificates and Endorsements kept on board the ship?', '6.2.1')}
            {renderRow('1.5.11', 'Are ratings assigned to part of navigational or engine-room watch duly certificated?', '6.2.1', 'STCW II/4 & III/4')}
            {renderRow('1.5.12', 'Do Master, Officers and person with responsibility for cargo on tanker hold Certificates of competency?', '6.2.1', 'STCW V-1-1 & 1-2')}
            {renderRow('1.5.13', 'Are all ratings assigned to specific duties related to cargo on tanker duly certificated?', '6.2.1', 'STCW V-1-1 & 1-2')}
            {renderRow('1.5.14', 'In case where ECDIS installed, did Master and Deck Officers complete Generic training and Type specific?', '6.2.1')}
            {renderRow('1.5.15', 'Are necessary items entered as per SOLAS requirements in Log book?', '8.2')}
            {renderRow('1.5.16', 'Are necessary items entered as per the SMS in Log book?', '7 or 8.2')}
            {renderRow('1.5.17', 'Are necessary entries made to Oil Record Book? 15ppm Bilge Alarm memorized data compared.', '7')}
          </tbody>
        </table>

        {renderBkiPageFooter(3)}
      </div>

      {/* ===================================================================== */}
      {/* HALAMAN 4 DARI 10: 1.5.18 s/d 5.2 (POLICY, COMPANY, DPA, MASTER)      */}
      {/* ===================================================================== */}
      <div className="bki-print-page" style={{ marginBottom: '25px', paddingBottom: '10px' }}>
        {renderBkiTopBar()}
        {renderBkiTableHeader()}

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.8pt', border: '1px solid #000000', borderTop: 'none' }}>
          <tbody>
            {renderRow('1.5.18', 'Are necessary entries made to Garbage Record Book?', '7', 'MARPOL V, MEPC.201(62)')}
            {renderRow('1.5.19', 'Is adequate information on safety and pollution prevention given to master by the company?', '6.1.3')}
            {renderRow('1.5.20', 'Have the revisions of mandatory rules, such as IMO conventions, been taken into SMS?', '1.2.3.1', 'eg. Cyber security, MARPOL VI CII/EEXI')}
            {renderRow('1.5.21', 'Does the ship comply with the flag state requirements? (Cyber security SE 35/2020: SMK 7.28.3, Covid-19 SE 14/2020: SMK 7.27.3)', '1.2.3.1')}
            {renderRow('1.6', 'All identified risks to its ships, personnel and the environment has been assessed and appropriate safeguards provided?', '1.2.2.2')}
            {renderRow('1.7', 'Good overall impression of housekeeping and the condition of the ship and equipment?', '')}
            {renderRow('1.8', 'Are there any weather conditions preventing safe access to certain areas?', '')}

            {/* 2. Safety and Environmental Protection Policy */}
            <tr style={{ background: '#1e293b', color: '#ffffff' }}>
              <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>2</td>
              <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                SAFETY AND ENVIRONMENTAL PROTECTION POLICY
              </td>
            </tr>
            {renderRow('2.1', 'Is safety and environmental protection policy available?', '')}
            {renderRow('2.2', 'Is policy known by shipboard personnel?', '')}
            {renderRow('2.3', 'Is policy implemented and maintained at all levels on board?', '')}

            {/* 3. Company Responsibilities & Authorities */}
            <tr style={{ background: '#1e293b', color: '#ffffff' }}>
              <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>3</td>
              <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                COMPANY RESPONSIBILITIES &amp; AUTHORITIES
              </td>
            </tr>
            {renderRow('3.1.1', 'Is the Company indicated on DOC identical with the owner or the entity reported according to the ISM Code 3.1?', '3.1 or 13.1')}
            {renderRow('3.1.2', 'Personnel concerned with the SMS has clearly worded, unambiguous definitions of their responsibilities and authority?', '')}
            {renderRow('3.2', 'Level of competence for the tasks involved is defined?', '')}
            {renderRow('3.3', 'Officers do ensure that personnel are adequately qualified and experienced to undertake their duties?', '')}
            {renderRow('3.4', 'Adequate resources is provided to the ship from shore (eg: spare parts, provision, etc)?', '')}

            {/* 4. Designated Person(s) Ashore */}
            <tr style={{ background: '#1e293b', color: '#ffffff' }}>
              <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>4</td>
              <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                DESIGNATED PERSON(S) ASHORE
              </td>
            </tr>
            {renderRow('4.1', 'Are the monitoring activities by DPA on the safety and pollution aspect found sufficient?', '4')}
            {renderRow('4.2', 'Is DPA known by master and officers?', '4')}
            {renderRow('4.3', 'Is the role of DPA known by Master and officers?', '4')}

            {/* 5. Master's Responsibilities & Authority */}
            <tr style={{ background: '#1e293b', color: '#ffffff' }}>
              <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>5</td>
              <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                MASTER&apos;S RESPONSIBILITIES AND AUTHORITY
              </td>
            </tr>
            {renderRow('5.1', 'Is the Master familiar with his responsibilities and authority required by ISM Code Section 5?', '6.1.2')}
            {renderRow('5.2', 'Has the Master implemented the safety and environmental protection Policy of the Company?', '5.1.1')}
          </tbody>
        </table>

        {renderBkiPageFooter(4)}
      </div>

      {/* ===================================================================== */}
      {/* HALAMAN 5 DARI 10: 5.3 s/d 7.4 (MASTER REVIEW, PERSONNEL, OPERATIONS) */}
      {/* ===================================================================== */}
      <div className="bki-print-page" style={{ marginBottom: '25px', paddingBottom: '10px' }}>
        {renderBkiTopBar()}
        {renderBkiTableHeader()}

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.8pt', border: '1px solid #000000', borderTop: 'none' }}>
          <tbody>
            {renderRow('5.3', 'How did the Master motivate the crew to respect the Company policy?', '5.1.2')}
            {renderRow('5.4', 'How did the Master issue appropriate orders and instructions in a clear and simple manner?', '5.1.3')}
            {renderRow('5.5', 'How did the Master verify that specified requirements have been observed?', '5.1.4')}
            {renderRow('5.6', 'Has the Master reviewed the SMS and reported its deficiencies to the company?', '5.1.5', 'NC 1/4 (Peninjauan Kembali SMK)')}
            {renderRow('5.7', 'Is the Master aware of the Overriding authority and authority to request company\'s assistance?', '5.2')}
            {renderRow('5.8', 'Has the Master carried out Risk Assessment according to the SMS procedure established by the Company?', '1.2.2.2')}

            {/* 6. Resources & Personnel */}
            <tr style={{ background: '#1e293b', color: '#ffffff' }}>
              <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>6</td>
              <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                RESOURCES AND PERSONNEL
              </td>
            </tr>
            {renderRow('6.1', 'Is Master familiar with requirements of SMS relating to Section 6 of ISM Code?', '6.1.2')}
            {renderRow('6.2', 'Have all crew members received Pre-joining training as per procedures?', '6.1.2 or 6.5')}
            {renderRow('6.3', 'The ship is manned with qualified, certificated and medically fit seafarers in accordance with regulations?', '6.2')}
            {renderRow('6.4', 'Have on-board training and instructions been conducted as per Manual/Procedures?', '6.5')}
            {renderRow('6.5', 'Have newly joined crew members received Familiarization training required by STCW?', '6.3')}
            {renderRow('6.6', 'Is evidence available that all personnel involved in SMS have adequate understanding of rules?', '6.4')}
            {renderRow('6.7', 'Have newly joined crew received Familiarization required by SOLAS within 2 weeks after joining?', '6.5')}
            {renderRow('6.8', 'Have On-board trainings and instructions required by SOLAS conducted regularly?', '6.5')}
            {renderRow('6.9', 'Is working language specified by company recorded in ship\'s log-book? (☐English, ☒Other: Indonesia)', '6.6', 'SOLAS V/14')}
            {renderRow('6.10', 'Are SMS related documents given in a language understood by ship\'s crew?', '6.6')}
            {renderRow('6.11', 'Are all crew able to read and understand the SMS manual?', '6.6')}
            {renderRow('6.12', 'Has company established plan/measure to cope where some crew unable to read manual?', '6.6', 'If No, go to 6.10')}
            {renderRow('6.13', 'Are crews able to communicate effectively in execution of their duties?', '6.7')}
            {renderRow('6.14', 'Is Master\'s SMS awareness on acceptable level? (judged at end of audit)', '6.1.2')}
            {renderRow('6.15', 'Is Master given necessary support so that master\'s duties safely performed?', '6.1.3')}
            {renderRow('6.16', 'Interview with Master & Crew has been conducted?', '')}

            {/* 7. Shipboard Operations */}
            <tr style={{ background: '#1e293b', color: '#ffffff' }}>
              <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>7</td>
              <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                SHIPBOARD OPERATIONS
              </td>
            </tr>
            {renderRow('7.1', 'Have the shipboard operations been carried out as per Company\'s SMS?', '7')}
            {renderRow('7.2', 'Have operations during departure been performed as per procedures? (Voyage Plan)', '7', 'SOLAS V/34')}
            {renderRow('7.3', 'Are Daily Reports (position, course, speed) sent to Company indicated on DOC every day?', '7', 'SOLAS V/28')}
            {renderRow('7.4', 'Have arrival operations been performed as per the procedures?', '7')}
          </tbody>
        </table>

        {renderBkiPageFooter(5)}
      </div>

      {/* ===================================================================== */}
      {/* HALAMAN 6 DARI 10: 7.5 s/d 9.4 (OPERATIONS, EMERGENCY, NC REPORTS)   */}
      {/* ===================================================================== */}
      <div className="bki-print-page" style={{ marginBottom: '25px', paddingBottom: '10px' }}>
        {renderBkiTopBar()}
        {renderBkiTableHeader()}

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.8pt', border: '1px solid #000000', borderTop: 'none' }}>
          <tbody>
            {renderRow('7.5', 'What kind of cargo does the ship load?', '7', 'Towing oil barge')}
            {renderRow('7.6', 'Does Master confirm compatibility then signed and properly keeps Cargo Information?', '7')}
            {renderRow('7.7', 'Have cargo handling operations been performed as per the procedures?', '7', 'Refer to Additional Check Items')}
            {renderRow('7.8', 'Have pollution prevention operations been performed as per the procedures?', '7')}
            {renderRow('7.9', 'Have special operations identified been performed as per the procedures?', '7')}
            {renderRow('7.10', 'Have Watchkeeping operations been performed as per procedures? (Rest hours STCW A-VIII, alcohol abuse limit <0.05% BAC, voyage planning, BRM/ERM)', '7')}
            {renderRow('7.11', 'Shipboard operations conducted being observed by BKI auditors?', '')}

            {/* 8. Emergency Preparedness */}
            <tr style={{ background: '#1e293b', color: '#ffffff' }}>
              <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>8</td>
              <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                EMERGENCY PREPAREDNESS
              </td>
            </tr>
            {renderRow('8.1', 'Has the ship been ready for Emergency Situations identified?', '8.2')}
            {renderRow('8.2', 'Has the company provided the ship with updated emergency contact list?', '8.3')}
            {renderRow('8.3', 'Is Master familiar with procedures to respond emergency situations identified?', '8.1')}
            {renderRow('8.4', 'Have drills and exercise for emergency situations been conducted as per procedures?', '8.2')}
            {renderRow('8.5', 'Does radio personnel aware of how to transmit distress alert under GMDSS?', '8.2')}
            {renderRow('8.6', 'Is SOPEP (SMPEP) properly controlled with latest emergency contact list?', '8.1')}
            {renderRow('8.7', 'Are ship-specific Emergency Towing Booklet controlled properly? (Bridge, Forecastle)', '8.1')}
            {renderRow('8.8', 'Have mandatory drills been conducted regularly?', '8.2')}
            {renderRow('8.9', 'Has ship encountered sea casualty and/or serious human injury since last audit?', '-', 'If Yes, go to 8.10 up to 8.12')}
            {renderRow('8.10', 'Has Company given master necessary support as per procedures?', '8.3')}
            {renderRow('8.11', 'Have responses and actions been taken by ship as per procedures?', '8.1')}
            {renderRow('8.12', 'Has SMS been reviewed based on results of investigation?', '9.1')}
            {renderRow('8.13', 'Emergency drills being observed by BKI auditors during audit?', '-', 'Fire drill & man overboard')}

            {/* 9. Reports & Analysis of NC */}
            <tr style={{ background: '#1e293b', color: '#ffffff' }}>
              <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>9</td>
              <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                REPORTS AND ANALYSIS OF NON-CONFORMITIES, ACCIDENTS AND HAZARDOUS OCCURRENCES
              </td>
            </tr>
            {renderRow('9.1', 'Have all deficiencies been dealt with in accordance with Company\'s SMS?', '9.1')}
            {renderRow('9.2', 'Were there any reports on NC, accident and hazardous occurrence sent ashore?', '9.1', 'If Yes, go to 9.5 up to 9.7')}
            {renderRow('9.3', 'Have the ship been controlled (regardless of detention or not) by PSC since last audit?', '9.1')}
            {renderRow('9.4', 'Is there any lack of PSC Records kept onboard, comparing with PSC history to auditor?', '9.1', 'If Yes, 9.5 thru 9.7 & 11.1')}
          </tbody>
        </table>

        {renderBkiPageFooter(6)}
      </div>

      {/* ===================================================================== */}
      {/* HALAMAN 7 DARI 10: 9.5 s/d 11.8 (MAINTENANCE & DOCUMENTATION)         */}
      {/* ===================================================================== */}
      <div className="bki-print-page" style={{ marginBottom: '25px', paddingBottom: '10px' }}>
        {renderBkiTopBar()}
        {renderBkiTableHeader()}

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.8pt', border: '1px solid #000000', borderTop: 'none' }}>
          <tbody>
            {renderRow('9.5', 'Have any deficiencies identified at inspections by third parties (charterers, P&I club) since last audit?', '9.1', 'If Yes, go to 9.5 up to 9.7')}
            {renderRow('9.6', 'Have all NCs, accidents and hazardous occurrences which were to be reported, informed to Company?', '9.1')}
            {renderRow('9.7', 'Has company responded to the deficiencies reported?', '9.1')}
            {renderRow('9.8', 'Have corrective actions to the deficiencies reported been taken?', '9.2')}

            {/* 10. Maintenance of Ship & Equipment */}
            <tr style={{ background: '#1e293b', color: '#ffffff' }}>
              <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>10</td>
              <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                MAINTENANCE OF THE SHIP AND EQUIPMENT
              </td>
            </tr>
            {renderRow('10.1', 'Is Ship maintained sufficiently in accordance with relevant rules and Company\'s requirements?', '10.2.1')}
            {renderRow('10.2', 'Has maintenance for ship and equipment been carried out as per plan established?', '10.2.1')}
            {renderRow('10.3', 'Have maintenance works performed been properly recorded?', '10.2.4')}
            {renderRow('10.4', 'Have specific measures for important equipment/technical system identified been taken as per procedures?', '10.3')}
            {renderRow('10.5', 'Are maintenance manuals and documents for lifeboats and launching appliances controlled properly?', '10.2.1')}
            {renderRow('10.6', 'Have weekly/monthly inspections for lifeboats conducted under senior officer supervision?', '10.2.1')}
            {renderRow('10.7', 'Are records of inspections/repairs for lifeboats signed by person who carried out and Master?', '10.2.4')}
            {renderRow('10.8', 'Is there any technical deficiency report which has been reported to the Company?', '10.2.2', 'If Yes, go to 10.9 up to 10.10')}
            {renderRow('10.9', 'Has company responded to deficiency reported?', '10.2.3')}
            {renderRow('10.10', 'Have corrective actions to deficiency reported been taken?', '10.2.3')}
            {renderRow('10.11', 'Have deficiencies found during shipboard tour by auditor been found by crew members already?', '-', 'If Yes, go to 10.12 to 10.14')}
            {renderRow('10.12', 'Have these deficiencies been reported to the Company?', '10.2.2')}
            {renderRow('10.13', 'If temporary repair applied, did repair procedure, timing follow instruction from Company?', '10.2.2')}
            {renderRow('10.14', 'Are these defective items being involved in ship\'s maintenance plan established?', '10.1 or 10.2.1')}
            {renderRow('10.15', 'What was result of last ship\'s regular inspection for these defective items?', '10.1')}

            {/* 11. Documentation */}
            <tr style={{ background: '#1e293b', color: '#ffffff' }}>
              <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>11</td>
              <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                DOCUMENTATION
              </td>
            </tr>
            {renderRow('11.1', 'Are all documents and data controlled as per the Company\'s SMS?', '11.1')}
            {renderRow('11.2', 'Are ship\'s SMS manuals of updated version? Rev. status: [TEXT]', '11.2.1')}
            {renderRow('11.3', 'Have revisions of the SMS manuals been properly recorded?', '11.2.2')}
            {renderRow('11.4', 'Have obsolete documents been properly removed?', '11.2.3')}
            {renderRow('11.5', 'Are the SMS manuals available at all relevant locations?', '11.2.1')}
            {renderRow('11.6', 'Have company\'s circular letters or information been filed properly and easily identified?', '11.1')}
            {renderRow('11.7', 'Have publications to be provided under the SMS been updated?', '11.2.1')}
            {renderRow('11.8', 'Are as-Built Construction Drawings and structural alterations plans available on board?', '11.2.1')}
          </tbody>
        </table>

        {renderBkiPageFooter(7)}
      </div>

      {/* ===================================================================== */}
      {/* HALAMAN 8 DARI 10: 12. INTERNAL AUDIT & TANKER/GAS (DICORET JIKA TUGBOAT) */}
      {/* ===================================================================== */}
      <div className="bki-print-page" style={{ marginBottom: '25px', paddingBottom: '10px' }}>
        {renderBkiTopBar()}
        {renderBkiTableHeader()}

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.8pt', border: '1px solid #000000', borderTop: 'none' }}>
          <tbody>
            {/* 12. Company Verification, Review & Evaluation */}
            <tr style={{ background: '#1e293b', color: '#ffffff' }}>
              <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>12</td>
              <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                COMPANY VERIFICATION, REVIEW AND EVALUATION
              </td>
            </tr>
            {renderRow('12.1', 'Are Internal Audits carried out as per Company\'s SMS?', '12.1')}
            {renderRow('12.2', 'Are procedure and criteria to extend internal audit within 3 months under exceptional circumstances established?', '12.1')}
            {renderRow('12.3', 'Is last internal audit carried out at interval not exceeding 12 months? Previous: 05 August 2025, Latest: 06 July 2026', '12.1', 'If No, go to 12.4')}
            {renderRow('12.4', 'When Internal audit was extended, have extension conducted in accordance with SMS?', '12.1')}
            {renderRow('12.5', 'Have internal audit and corrective actions carried out as per documented procedures?', '12.4')}
            {renderRow('12.6', 'Have Internal Audits been carried out by person(s) not onboard the ship?', '12.5')}
            {renderRow('12.7', 'Have internal audit records been kept onboard the ship?', '12.6')}
            {renderRow('12.8', 'Have Master and officers been aware of result of internal audit?', '12.6')}
            {renderRow('12.9', 'Have non-conformities been raised at the audit?', '12.7')}
            {renderRow('12.10', 'Have timely corrective actions for non-conformities been taken?', '12.7')}
            {renderRow('12.11', 'Has company notified ship of result of management review?', '12.6')}

            {/* KLAUSUL TAMBAHAN KHUSUS TIPE KAPAL (DICORET KARENA TUG BOAT) */}
            <tr style={{ background: '#e2e8f0', fontWeight: 900 }}>
              <td colSpan={7} style={{ padding: '3px 6px', border: '1px solid #000000', color: '#1e293b' }}>
                ADDITIONAL CHECK ITEM BY SHIP TYPES (BAGIAN KHUSUS TIPE KAPAL TERTENTU)
              </td>
            </tr>

            {/* A. OIL TANKER */}
            {(() => {
              const isStrikedA = ['A.1', 'A.2', 'A.3'].some(n => findItem(n)?.isStrikethrough);
              return (
                <tr style={{ background: '#f8fafc' }}>
                  <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>A</td>
                  <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900, textDecoration: isStrikedA ? 'line-through' : 'none' }}>
                    OIL TANKER {isStrikedA ? '(Dicoret — tidak berlaku untuk tipe kapal Tugboat / Other Cargo Ship)' : ''}
                  </td>
                </tr>
              );
            })()}
            {renderRow('A.1', 'Has instrument for measuring flammable gas concentration been properly calibrated?', 'SOLAS II-2/4-5.7')}
            {renderRow('A.2', 'Are records of discharging of slop, valve closing operations in Oil Record Book Part II?', 'MARPOL Annex I')}
            {renderRow('A.3', 'Are there records of COW operations in Oil Record Book Part II?', 'MARPOL Annex I')}

            {/* B. GAS CARRIER */}
            {(() => {
              const isStrikedB = ['B.1', 'B.2', 'B.3', 'B.4', 'B.5', 'B.6', 'B.7'].some(n => findItem(n)?.isStrikethrough);
              return (
                <tr style={{ background: '#f8fafc' }}>
                  <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>B</td>
                  <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900, textDecoration: isStrikedB ? 'line-through' : 'none' }}>
                    GAS CARRIER {isStrikedB ? '(Dicoret — tidak berlaku untuk tipe kapal Tugboat / Other Cargo Ship)' : ''}
                  </td>
                </tr>
              );
            })()}
            {renderRow('B.1', 'Have portable and fixed gas concentration measurement instruments properly calibrated?', 'IGC Code 13.6.6')}
            {renderRow('B.2', 'Is crew in charge of cargo operation adequately trained for safe handling?', 'IGC Code 18.3')}
            {renderRow('B.3', 'Does crew understand Company procedure for entering cargo holds, tanks, enclosed spaces?', 'IGC Code 18.4')}
            {renderRow('B.4', 'Has ship been loaded with cargo gas listed in Annex of Gas Fitness Certificate?', 'IGC Code 18.2')}
          </tbody>
        </table>

        {renderBkiPageFooter(8)}
      </div>

      {/* ===================================================================== */}
      {/* HALAMAN 9 DARI 10: GAS CONT., CHEMICAL, BULK CARRIER                  */}
      {/* ===================================================================== */}
      <div className="bki-print-page" style={{ marginBottom: '25px', paddingBottom: '10px' }}>
        {renderBkiTopBar()}
        {renderBkiTableHeader()}

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.8pt', border: '1px solid #000000', borderTop: 'none' }}>
          <tbody>
            {/* B. Gas Carrier lanjutan */}
            {renderRow('B.5', 'In event of change of cargo gas, tank cleaning carried out according to procedure?', 'IGC Code 18.2')}
            {renderRow('B.6', 'In event of simultaneous carriage of cargo gases, possibility of dangerous reaction investigated?', 'IGC Code 18.2')}
            {renderRow('B.7', 'Are MARPOL Annex II cargo handling operations recorded in Cargo Record Book?', 'MARPOL Annex II')}

            {/* C. CHEMICAL TANKER */}
            {(() => {
              const isStrikedC = ['C.1', 'C.2', 'C.3', 'C.4'].some(n => findItem(n)?.isStrikethrough);
              return (
                <tr style={{ background: '#f8fafc' }}>
                  <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>C</td>
                  <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900, textDecoration: isStrikedC ? 'line-through' : 'none' }}>
                    CHEMICAL TANKER {isStrikedC ? '(Dicoret — tidak berlaku untuk tipe kapal Tugboat / Other Cargo Ship)' : ''}
                  </td>
                </tr>
              );
            })()}
            {renderRow('C.1', 'Is crew in charge of cargo operation adequately trained for safe handling including emergency?', 'IBC Code 16.3')}
            {renderRow('C.2', 'Does crew understand Company procedure for opening & entering into cargo tanks?', 'IBC Code 16.4')}
            {renderRow('C.3', 'Are MARPOL Annex II cargo handling operations recorded in Cargo Record Book?', 'MARPOL Annex II')}
            {renderRow('C.4', 'In event of carriage of mixed cargoes, total hazard assessed by specialist before loading?', 'IBC Code 16.2.2')}

            {/* D. BULK CARRIER */}
            {(() => {
              const isStrikedD = ['D.1', 'D.2', 'D.3'].some(n => findItem(n)?.isStrikethrough);
              return (
                <tr style={{ background: '#f8fafc' }}>
                  <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>D</td>
                  <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900, textDecoration: isStrikedD ? 'line-through' : 'none' }}>
                    BULK CARRIER ( INCLUDING BULK CARRIER OTHER THAN CHAPTER IX OF SOLAS ) {isStrikedD ? '(Dicoret)' : ''}
                  </td>
                </tr>
              );
            })()}
            {renderRow('D.1', 'Did crew training and drills carried out according to evacuation procedure for cargo hold flooding?', 'SOLAS Reg. XII/9')}
            {renderRow('D.2', 'Are "Hatch Cover Maintenance Plans" in accordance with MSC 169 (79) incorporated into SMS?', 'SOLAS Reg. XII/7.2')}
            {renderRow('D.3', 'Is ship provided with procedures for handling cargo which may liquefy (eg: Nickel concentrate)?', '')}

            {/* E. Self-unloading Bulk Carriers */}
            {(() => {
              const isStrikedE = ['E.1', 'E.2', 'E.3', 'E.4', 'E.5', 'E.6', 'E.7', 'E.8'].some(n => findItem(n)?.isStrikethrough);
              return (
                <tr style={{ background: '#f8fafc' }}>
                  <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>E</td>
                  <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900, textDecoration: isStrikedE ? 'line-through' : 'none' }}>
                    Self-unloading bulk carriers featuring internally installed conveyor systems - Fire Safety Risk Assessment (IMSBC Code 3.1.2) {isStrikedE ? '(Dicoret)' : ''}
                  </td>
                </tr>
              );
            })()}
            {renderRow('E.1', 'Have you procedures for fire safety risk assessment in SMS? (Identification of risk, safeguards)', '')}
            {renderRow('E.2', 'What is scope of fire safety risk assessment for vessel? (Cargo handling areas on self-unloading)', '')}
          </tbody>
        </table>

        {renderBkiPageFooter(9)}
      </div>

      {/* ===================================================================== */}
      {/* HALAMAN 10 DARI 10: E CONT. & TANDATANGAN PENGESAHAN RESMI            */}
      {/* ===================================================================== */}
      <div className="bki-print-page" style={{ paddingBottom: '10px' }}>
        {renderBkiTopBar()}
        {renderBkiTableHeader()}

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.8pt', border: '1px solid #000000', borderTop: 'none', marginBottom: '14px' }}>
          <tbody>
            {renderRow('E.3', 'Conveyor systems (Maintenance of rotor bearing and shaft)?', '')}
            {renderRow('E.4', 'Fire-Extinguishing system (Fire Detecting Alarm System, etc.)?', '')}
            {renderRow('E.5', 'Operating conditions and cargo? Hot work near conveyor systems?', '')}
            {renderRow('E.6', 'Who has responsibility for implementation of fire safety risk assessment?', '')}
            {renderRow('E.7', 'Are identified fire safety risks reviewed at meetings for system review?', '')}
            {renderRow('E.8', 'Are there any safeguards newly established taking accounts of results of review?', '')}
          </tbody>
        </table>

        {/* KOTAK TANDATANGAN PENGESAHAN RESMI BKI */}
        <div style={{ border: '1.5px solid #000000', padding: '8px 12px', background: '#ffffff', pageBreakInside: 'avoid', marginTop: '10px' }}>
          <div style={{ textAlign: 'center', fontSize: '7.5pt', fontWeight: 900, marginBottom: '8px', textTransform: 'uppercase' }}>
            PENGESAHAN HASIL AUDIT SISTEM MANAJEMEN KESELAMATAN KAPAL (ISM CODE)
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '7pt', textAlign: 'center' }}>
            <tbody>
              <tr>
                <td style={{ width: '50%', padding: '6px', verticalAlign: 'top', borderRight: '1px solid #000000' }}>
                  <div style={{ fontSize: '6.5pt', color: '#475569', fontWeight: 700 }}>
                    AUDITOR YANG MELAKSANAKAN AUDIT /<br /><em>AUDITOR(S) PERFORMING AUDIT</em>
                  </div>
                  <div style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ borderBottom: '1px solid #000000', padding: '2px 30px', fontWeight: 800, fontStyle: 'italic' }}>
                      {auditorName}
                    </span>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: '8pt', textTransform: 'uppercase' }}>
                    {auditorName}
                  </div>
                  <div style={{ fontSize: '6.2pt', color: '#003b6f', fontWeight: 700 }}>
                    Auditor Statutori SMC Biro Klasifikasi Indonesia (BKI)
                  </div>
                  <div style={{ fontSize: '6pt', color: '#64748b', marginTop: '2px' }}>
                    Tanggal: {auditDateStr}
                  </div>
                </td>

                <td style={{ width: '50%', padding: '6px', verticalAlign: 'top' }}>
                  <div style={{ fontSize: '6.5pt', color: '#475569', fontWeight: 700 }}>
                    NAKHODA KAPAL /<br /><em>MASTER OF THE SHIP (AUDITEE)</em>
                  </div>
                  <div style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ borderBottom: '1px solid #000000', padding: '2px 30px', fontWeight: 800, fontStyle: 'italic' }}>
                      {masterName}
                    </span>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: '8pt', textTransform: 'uppercase' }}>
                    {masterName}
                  </div>
                  <div style={{ fontSize: '6.2pt', color: '#003b6f', fontWeight: 700 }}>
                    Master / Nakhoda {vesselName}
                  </div>
                  <div style={{ fontSize: '6pt', color: '#64748b', marginTop: '2px' }}>
                    Lokasi: {auditLocation}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {renderBkiPageFooter(10)}
      </div>

    </div>
  );
};
