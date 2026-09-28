/**
 * ReportStatusStamp.jsx
 * Diekstrak dari AuditReportModal.jsx (baris 656-682).
 * Sumber: CAP STATUS SESI (COMPLETED)
 */
import React from 'react';

export const ReportStatusStamp = ({
}) => {
  return (
    <div
                    className="audit-watermark"
                    style={{
                      position: 'absolute',
                      top: '45%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) rotate(-25deg)',
                      border: '4px solid rgba(16, 185, 129, 0.15)',
                      color: 'rgba(16, 185, 129, 0.15)',
                      fontSize: '32pt',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '4px',
                      padding: '10px 30px',
                      borderRadius: '14px',
                      pointerEvents: 'none',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      textAlign: 'center',
                      zIndex: 0
                    }}
                  >
                    ISM CODE VERIFIED<br />
                    <span style={{ fontSize: '18pt', letterSpacing: '2px' }}>STATUS: NC CLOSED</span>
                  </div>
  );
};
