/**
 * ReportSignatureFooter.jsx
 * Diekstrak dari AuditReportModal.jsx (baris 1498-1520).
 * Sumber: FOOTER TANDA TANGAN
 */
import React from 'react';

export const ReportSignatureFooter = ({
  activeSession,
  currentVessel,
  institutionBranding,
  isExternal,
}) => {
  return (
    <div
                    className="audit-footer-note"
                    style={{
                      marginTop: '16px',
                      paddingTop: '6px',
                      borderTop: '1px solid #cbd5e1',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '6.2pt',
                      color: '#64748b'
                    }}
                  >
                    <div>
                      Dokumen Resmi {institutionBranding.name} • Dicetak melalui Sistem PMS Cloud Maritim Baharimas
                    </div>
                    <div>
                      Distribusi: {isExternal
                        ? `1. Asli: ${institutionBranding.shortName} | 2. Copy 1: DPA PT. PBK | 3. Copy 2: Onboard ${activeSession.targetName || currentVessel?.name}`
                        : `1. Asli: Arsip DPA Darat | 2. Copy 1: Onboard ${activeSession.targetName || currentVessel?.name} | 3. Copy 2: Arsip QHSE PBK`}
                    </div>
                  </div>
  );
};
