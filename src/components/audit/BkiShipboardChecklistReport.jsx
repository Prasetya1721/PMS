import React from 'react';
import { BaharimasReportLogo } from './AuditInstitutionHeader';
import { formatIndoDate } from '../../utils/auditTimeUtils';
import { BkiPage01Cover } from './bkiship/BkiPage01Cover';
import { BkiPage02ShipboardTour } from './bkiship/BkiPage02ShipboardTour';
import { BkiPage03CrewLogbook } from './bkiship/BkiPage03CrewLogbook';
import { BkiPage04PolicyDpa } from './bkiship/BkiPage04PolicyDpa';
import { BkiPage05MasterReview } from './bkiship/BkiPage05MasterReview';
import { BkiPage06OperationsEmergency } from './bkiship/BkiPage06OperationsEmergency';
import { BkiPage07MaintenanceDocs } from './bkiship/BkiPage07MaintenanceDocs';
import { BkiPage08InternalAudit } from './bkiship/BkiPage08InternalAudit';
import { BkiPage09GasChemicalBulk } from './bkiship/BkiPage09GasChemicalBulk';
import { BkiPage10Signatures } from './bkiship/BkiPage10Signatures';

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
      <BkiPage01Cover
        auditDateStr={auditDateStr}
        auditLocation={auditLocation}
        auditorName={auditorName}
        masterName={masterName}
        renderBkiPageFooter={renderBkiPageFooter}
        renderBkiTopBar={renderBkiTopBar}
        reportNo={reportNo}
        runningHeaderTitle={runningHeaderTitle}
        session={session}
        vessel={vessel}
        vesselName={vesselName}
      />

      {/* ===================================================================== */}
      {/* HALAMAN 2 DARI 10: 1. SHIPBOARD TOUR (1.1 s/d 1.4 ABK)                */}
      {/* ===================================================================== */}
      <BkiPage02ShipboardTour
        renderBkiPageFooter={renderBkiPageFooter}
        renderBkiTableHeader={renderBkiTableHeader}
        renderBkiTopBar={renderBkiTopBar}
        renderRow={renderRow}
      />

      {/* ===================================================================== */}
      {/* HALAMAN 3 DARI 10: 1.4.4 s/d 1.5.17 (NAKHODA, CREW LIST, LOG BOOK)    */}
      {/* ===================================================================== */}
      <BkiPage03CrewLogbook
        renderBkiPageFooter={renderBkiPageFooter}
        renderBkiTableHeader={renderBkiTableHeader}
        renderBkiTopBar={renderBkiTopBar}
        renderRow={renderRow}
      />

      {/* ===================================================================== */}
      {/* HALAMAN 4 DARI 10: 1.5.18 s/d 5.2 (POLICY, COMPANY, DPA, MASTER)      */}
      {/* ===================================================================== */}
      <BkiPage04PolicyDpa
        renderBkiPageFooter={renderBkiPageFooter}
        renderBkiTableHeader={renderBkiTableHeader}
        renderBkiTopBar={renderBkiTopBar}
        renderRow={renderRow}
      />

      {/* ===================================================================== */}
      {/* HALAMAN 5 DARI 10: 5.3 s/d 7.4 (MASTER REVIEW, PERSONNEL, OPERATIONS) */}
      {/* ===================================================================== */}
      <BkiPage05MasterReview
        renderBkiPageFooter={renderBkiPageFooter}
        renderBkiTableHeader={renderBkiTableHeader}
        renderBkiTopBar={renderBkiTopBar}
        renderRow={renderRow}
      />

      {/* ===================================================================== */}
      {/* HALAMAN 6 DARI 10: 7.5 s/d 9.4 (OPERATIONS, EMERGENCY, NC REPORTS)   */}
      {/* ===================================================================== */}
      <BkiPage06OperationsEmergency
        renderBkiPageFooter={renderBkiPageFooter}
        renderBkiTableHeader={renderBkiTableHeader}
        renderBkiTopBar={renderBkiTopBar}
        renderRow={renderRow}
      />

      {/* ===================================================================== */}
      {/* HALAMAN 7 DARI 10: 9.5 s/d 11.8 (MAINTENANCE & DOCUMENTATION)         */}
      {/* ===================================================================== */}
      <BkiPage07MaintenanceDocs
        renderBkiPageFooter={renderBkiPageFooter}
        renderBkiTableHeader={renderBkiTableHeader}
        renderBkiTopBar={renderBkiTopBar}
        renderRow={renderRow}
      />

      {/* ===================================================================== */}
      {/* HALAMAN 8 DARI 10: 12. INTERNAL AUDIT & TANKER/GAS (DICORET JIKA TUGBOAT) */}
      {/* ===================================================================== */}
      <BkiPage08InternalAudit
        findItem={findItem}
        renderBkiPageFooter={renderBkiPageFooter}
        renderBkiTableHeader={renderBkiTableHeader}
        renderBkiTopBar={renderBkiTopBar}
        renderRow={renderRow}
      />

      {/* ===================================================================== */}
      {/* HALAMAN 9 DARI 10: GAS CONT., CHEMICAL, BULK CARRIER                  */}
      {/* ===================================================================== */}
      <BkiPage09GasChemicalBulk
        findItem={findItem}
        renderBkiPageFooter={renderBkiPageFooter}
        renderBkiTableHeader={renderBkiTableHeader}
        renderBkiTopBar={renderBkiTopBar}
        renderRow={renderRow}
      />

      {/* ===================================================================== */}
      {/* HALAMAN 10 DARI 10: E CONT. & TANDATANGAN PENGESAHAN RESMI            */}
      {/* ===================================================================== */}
      <BkiPage10Signatures
        auditDateStr={auditDateStr}
        auditLocation={auditLocation}
        auditorName={auditorName}
        masterName={masterName}
        renderBkiPageFooter={renderBkiPageFooter}
        renderBkiTableHeader={renderBkiTableHeader}
        renderBkiTopBar={renderBkiTopBar}
        renderRow={renderRow}
        vesselName={vesselName}
      />

    </div>
  );
};
