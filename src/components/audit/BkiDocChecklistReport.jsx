import React from 'react';
import { BaharimasReportLogo } from './AuditInstitutionHeader';
import { formatIndoDate } from '../../utils/auditTimeUtils';
import { BkiDocPageHeader } from './bkidoc/BkiDocPageHeader';
import { BkiDocPageSystem } from './bkidoc/BkiDocPageSystem';
import { BkiDocPageInternal } from './bkidoc/BkiDocPageInternal';
import { BkiDocPageOperational } from './bkidoc/BkiDocPageOperational';
import { BkiDocPageReporting } from './bkidoc/BkiDocPageReporting';
import { BkiDocPageDocumentation } from './bkidoc/BkiDocPageDocumentation';
import { BkiDocPageOfficeTour } from './bkidoc/BkiDocPageOfficeTour';

/**
 * Komponen Cetak Resmi Checklist BKI DOC (Document of Compliance)
 * Dokumen Acuan:
 * 00143pk26_F23_14_05-2025 Rev06 Company checklist.pdf
 * Standar: F23.14.05-2025 Rev 06 / Document Revision 00
 * Audit Sistem Manajemen Keselamatan Perusahaan (DOC)
 */
export const BkiDocChecklistReport = ({
  session,
  vessel,
  liveChecklist = null,
  findings = []
}) => {
  const companyName = 'PT. BAHARIMAS KALIMANTAN';
  const companyAddress = 'JL. ADI SUCIPTO KM 6+30 m RT.04 RW.04 SUNGAI RAYA KAB. KUBU RAYA';
  const imoCompanyNo = session?.imoCompanyNo || '1672810';
  const reportNo = session?.reportId || session?.auditNo || '00111-PK/ISM-DOC/2026';
  const auditDateStr = session?.auditDate ? formatIndoDate(session.auditDate) : 'February 7, 2026';
  const auditorName = session?.leadAuditor || session?.leadAuditorSign || 'MUHSON NURROCHMAT S';
  const dpaName = session?.auditee || 'DPA PT. BAHARIMAS KALIMANTAN';
  const auditLocation = session?.auditLocation || 'Kantor Pusat';
  const runningHeaderTitle = `Report id: ${companyName} - ${reportNo}`;

  // Sumber checklist efektif: prioritaskan liveChecklist lalu session.checklist
  const effectiveList = (Array.isArray(liveChecklist) && liveChecklist.length > 0)
    ? liveChecklist
    : (Array.isArray(session?.checklist) && session.checklist.length > 0)
    ? session.checklist
    : [];

  const getResultBoxes = (item) => {
    const isStriked = Boolean(item?.isStrikethrough);
    const res = item?.result || '';
    const isYes = !isStriked && (res === 'Yes' || res === 'Complied');
    const isNo = !isStriked && ['No', 'Minor NC', 'Major NC', 'Observation'].includes(res);
    const isNA = isStriked || res === 'N/A';
    return {
      yesBox: isYes ? '\u2612' : '\u2610',
      noBox: isNo ? '\u2612' : '\u2610',
      naBox: isNA ? '\u2612' : '\u2610',
      isStriked, isNo, res
    };
  };

  const findItem = (no) => {
    if (effectiveList.length > 0) {
      const match = effectiveList.find(c =>
        c.no === no || c.code === no || c.id === no ||
        c.id === `doc-${no}` ||
        String(c.code || '').trim().toLowerCase() === String(no).trim().toLowerCase() ||
        String(c.no || '').trim().toLowerCase() === String(no).trim().toLowerCase()
      );
      if (match) return match;
    }
    return { no, result: '', isStrikethrough: false, remark: '' };
  };

  const renderRow = (no, text, ismCode = '', customRemark = '', subChecks = null, isStrikethroughForced = false) => {
    const item = findItem(no);
    const { yesBox, noBox, isNo, isStriked } = getResultBoxes(item);
    const finalStriked = isStrikethroughForced || isStriked;
    const relatedFinding = findings.find(f => {
      const fCode = String(f.clauseCode || f.elementNumberOfCode || '').trim();
      const noStr = String(no || '').trim();
      const itemCode = String(item?.code || '').trim();
      return (fCode && (fCode === noStr || fCode === itemCode || fCode.startsWith(`${noStr}.`) || noStr.startsWith(`${fCode}.`)));
    });
    const remarkContent = relatedFinding
      ? `See NC ${relatedFinding.findingNo || '1/4'}`
      : (item?.notes ? item.notes : (finalStriked ? 'N/A' : (customRemark || item?.remark || '')));

    return (
      <tr key={no} style={{ background: finalStriked ? '#fcfcfc' : isNo ? '#fff5f5' : '#ffffff' }}>
        <td style={{ padding: '3px 4px', border: '1px solid #000', textAlign: 'center', verticalAlign: 'middle', fontWeight: 600, fontSize: '6.8pt', width: '6%' }}>
          <span style={{ textDecoration: finalStriked ? 'line-through' : 'none', color: finalStriked ? '#64748b' : '#000' }}>{no}</span>
        </td>
        <td style={{ padding: '3px 6px', border: '1px solid #000', verticalAlign: 'top', fontSize: '6.8pt', lineHeight: 1.35, width: '46%' }}>
          <div style={{ textDecoration: finalStriked ? 'line-through' : 'none', color: finalStriked ? '#64748b' : '#000' }}>
            {item?.checkPoint ? (
              <div>
                <span style={{ fontWeight: 600 }}>{item.checkPoint}</span>
                {text && text !== item.checkPoint && (
                  <span style={{ fontSize: '6pt', color: finalStriked ? '#94a3b8' : '#64748b', fontStyle: 'italic', display: 'block', marginTop: '1px' }}>{text}</span>
                )}
              </div>
            ) : text}
          </div>
          {subChecks && (
            <div style={{ marginTop: '2px', fontSize: '6.2pt', color: finalStriked ? '#94a3b8' : '#334155' }}>
              {subChecks.map((sc, i) => <div key={i} style={{ marginTop: '1px' }}>{sc}</div>)}
            </div>
          )}
        </td>
        <td style={{ padding: '3px 4px', border: '1px solid #000', textAlign: 'center', verticalAlign: 'middle', fontSize: '6.8pt', width: '9%' }}>
          <span style={{ textDecoration: finalStriked ? 'line-through' : 'none', color: finalStriked ? '#64748b' : '#000' }}>{ismCode}</span>
        </td>
        <td style={{ padding: '3px 6px', border: '1px solid #000', textAlign: 'center', verticalAlign: 'middle', fontSize: '9pt', width: '10%' }}>
          <span style={{ marginRight: '4px' }}>{yesBox}</span>
          <span>{noBox}</span>
        </td>
        <td style={{ padding: '3px 6px', border: '1px solid #000', verticalAlign: 'top', fontSize: '6.5pt', lineHeight: 1.3, width: '29%', color: finalStriked ? '#64748b' : isNo ? '#b91c1c' : '#374151' }}>
          {remarkContent}
        </td>
      </tr>
    );
  };

  const thStyle = { background: '#1e3a5f', color: '#fff', padding: '4px 6px', border: '1.5px solid #000', textAlign: 'center', fontSize: '7pt', fontWeight: 700 };

  const renderSectionHeader = (title) => (
    <tr>
      <td colSpan={5} style={{ background: '#1e3a5f', color: '#fff', fontWeight: 700, fontSize: '7.5pt', padding: '5px 8px', border: '1px solid #000', textAlign: 'left' }}>{title}</td>
    </tr>
  );

  const renderSubsectionHeader = (title) => (
    <tr>
      <td colSpan={5} style={{ background: '#dbeafe', color: '#1e3a5f', fontWeight: 700, fontSize: '7pt', padding: '3px 8px', border: '1px solid #000', textAlign: 'left', fontStyle: 'italic' }}>{title}</td>
    </tr>
  );

  const pageStyle = {
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '7pt', lineHeight: 1.4, color: '#000', background: '#fff',
    width: '210mm', minHeight: '297mm', margin: '0 auto',
    padding: '12mm 14mm 14mm 14mm', boxSizing: 'border-box'
  };

  const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '7pt', tableLayout: 'fixed' };

  const renderColumnHeaders = () => (
    <tr>
      <th style={{ ...thStyle, width: '6%' }}>No.</th>
      <th style={{ ...thStyle, width: '46%' }}>Items to be verified (Butir Pemeriksaan)</th>
      <th style={{ ...thStyle, width: '9%' }}>ISM Code</th>
      <th style={{ ...thStyle, width: '10%' }}>Check<br />Y &nbsp; N</th>
      <th style={{ ...thStyle, width: '29%' }}>Remarks (Catatan)</th>
    </tr>
  );

  const renderRunningHeader = () => (
    <div style={{ fontSize: '6pt', color: '#374151', borderBottom: '1px solid #cbd5e1', marginBottom: '4px', paddingBottom: '2px', display: 'flex', justifyContent: 'space-between' }}>
      <span>{runningHeaderTitle}</span>
      <span>F23.14.05-2025 Rev 06</span>
    </div>
  );

  const infoTd = { padding: '2px 4px', border: '1px solid #9ca3af' };

  return (
    <div id="bki-doc-report-root" style={{ background: '#f1f5f9', padding: '16px' }}>

      {/* PAGE 1: HEADER & PRA-AUDIT */}
      <BkiDocPageHeader
        auditDateStr={auditDateStr}
        auditLocation={auditLocation}
        auditorName={auditorName}
        companyAddress={companyAddress}
        companyName={companyName}
        dpaName={dpaName}
        imoCompanyNo={imoCompanyNo}
        infoTd={infoTd}
        pageStyle={pageStyle}
        renderColumnHeaders={renderColumnHeaders}
        renderRow={renderRow}
        renderSectionHeader={renderSectionHeader}
        renderSubsectionHeader={renderSubsectionHeader}
        reportNo={reportNo}
        session={session}
        tableStyle={tableStyle}
      />

      {/* PAGE 2: TINJAUAN SISTEM */}
      <BkiDocPageSystem
        pageStyle={pageStyle}
        renderColumnHeaders={renderColumnHeaders}
        renderRow={renderRow}
        renderRunningHeader={renderRunningHeader}
        renderSectionHeader={renderSectionHeader}
        renderSubsectionHeader={renderSubsectionHeader}
        tableStyle={tableStyle}
      />

      {/* PAGE 3: AUDIT INTERNAL */}
      <BkiDocPageInternal
        pageStyle={pageStyle}
        renderColumnHeaders={renderColumnHeaders}
        renderRow={renderRow}
        renderRunningHeader={renderRunningHeader}
        renderSectionHeader={renderSectionHeader}
        renderSubsectionHeader={renderSubsectionHeader}
        tableStyle={tableStyle}
      />

      {/* PAGE 4: OPERASIONAL & DARURAT */}
      <BkiDocPageOperational
        pageStyle={pageStyle}
        renderColumnHeaders={renderColumnHeaders}
        renderRow={renderRow}
        renderRunningHeader={renderRunningHeader}
        renderSectionHeader={renderSectionHeader}
        renderSubsectionHeader={renderSubsectionHeader}
        tableStyle={tableStyle}
      />

      {/* PAGE 5: PELAPORAN NC & PEMELIHARAAN */}
      <BkiDocPageReporting
        pageStyle={pageStyle}
        renderColumnHeaders={renderColumnHeaders}
        renderRow={renderRow}
        renderRunningHeader={renderRunningHeader}
        renderSectionHeader={renderSectionHeader}
        renderSubsectionHeader={renderSubsectionHeader}
        tableStyle={tableStyle}
      />

      {/* PAGE 6: DOKUMENTASI & PENGAWAKAN */}
      <BkiDocPageDocumentation
        pageStyle={pageStyle}
        renderColumnHeaders={renderColumnHeaders}
        renderRow={renderRow}
        renderRunningHeader={renderRunningHeader}
        renderSectionHeader={renderSectionHeader}
        renderSubsectionHeader={renderSubsectionHeader}
        tableStyle={tableStyle}
      />

      {/* PAGE 7: OFFICE TOUR & PENGESAHAN */}
      <BkiDocPageOfficeTour
        auditDateStr={auditDateStr}
        auditLocation={auditLocation}
        auditorName={auditorName}
        dpaName={dpaName}
        findings={findings}
        pageStyle={pageStyle}
        renderColumnHeaders={renderColumnHeaders}
        renderRow={renderRow}
        renderRunningHeader={renderRunningHeader}
        renderSectionHeader={renderSectionHeader}
        renderSubsectionHeader={renderSubsectionHeader}
        session={session}
        tableStyle={tableStyle}
        thStyle={thStyle}
      />
    </div>
  );
};

export default BkiDocChecklistReport;
