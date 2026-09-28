/**
 * ReportNcrHeader.jsx
 * Diekstrak dari AuditReportModal.jsx (baris 994-1021).
 * Sumber: KOP HALAMAN NCR
 */
import React from 'react';
import { AuditInstitutionHeader } from '../AuditInstitutionHeader';

export const ReportNcrHeader = ({
  activeSession,
  currentVessel,
  institutionBranding,
}) => {
  return (
    <div
                    className="print-page-break"
                    style={{
                      pageBreakBefore: 'always',
                      breakBefore: 'page',
                      marginTop: '2.5rem',
                      marginBottom: '2rem',
                      borderTop: '1px dashed #cbd5e1',
                      paddingTop: '1.5rem'
                    }}
                  >
                    <AuditInstitutionHeader
                      branding={institutionBranding}
                      session={activeSession}
                      vessel={currentVessel}
                    />
                    <div className="audit-report-title" style={{ textAlign: 'center', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
                      <h2 style={{ fontSize: '12pt', fontWeight: 900, margin: 0, textTransform: 'uppercase', color: '#000000', letterSpacing: '0.5px' }}>
                        LAPORAN KETIDAKSESUAIAN / OBSERVASI
                      </h2>
                      <div style={{ fontSize: '8.5pt', fontWeight: 700, margin: '2px 0 0', color: institutionBranding.primaryColor, fontStyle: 'italic' }}>
                        (NON-CONFORMITY / OBSERVATION REPORT)
                      </div>
                      <div style={{ display: 'inline-block', borderBottom: '2px solid #000000', width: '90px', margin: '3px auto 0' }} />
                    </div>
                  </div>
  );
};
