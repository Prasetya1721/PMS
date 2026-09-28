/**
 * ReportDocHeader.jsx
 * Diekstrak dari AuditReportModal.jsx (baris 698-733).
 * Sumber: KOP DOKUMEN LAPORAN
 */
import React from 'react';

export const ReportDocHeader = ({
  activeSession,
  institutionBranding,
  reportMode,
}) => {
  return (
    <div className="audit-report-title" style={{ textAlign: 'center', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
                    <h2
                      style={{
                        fontSize: '12pt',
                        fontWeight: 900,
                        margin: 0,
                        textTransform: 'uppercase',
                        color: '#000000',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {reportMode === 'session'
                        ? (institutionBranding.docTitleId || `LAPORAN HASIL AUDIT SISTEM MANAJEMEN KESELAMATAN (${activeSession.standard})`)
                        : reportMode === 'checklist'
                        ? `DAFTAR BUTIR PEMERIKSAAN KELAIKLAUTAN (${institutionBranding.shortName})`
                        : 'LAPORAN KETIDAKSESUAIAN / OBSERVASI'}
                    </h2>
                    <div
                      style={{
                        fontSize: '8.5pt',
                        fontWeight: 700,
                        margin: '2px 0 0',
                        color: institutionBranding.primaryColor,
                        fontStyle: reportMode === 'ncr' ? 'italic' : 'normal'
                      }}
                    >
                      {reportMode === 'session'
                        ? (institutionBranding.docTitleEn || 'STATUTORY SAFETY MANAGEMENT AUDIT REPORT')
                        : reportMode === 'checklist'
                        ? (institutionBranding.docTitleEn || 'SAFETY INSPECTION CHECKLIST')
                        : '(NON-CONFORMITY / OBSERVATION REPORT)'}
                    </div>
                    <div style={{ display: 'inline-block', borderBottom: '2px solid #000000', width: '90px', margin: '3px auto 0' }} />
                  </div>
  );
};
