/**
 * ReportModalHost.jsx
 * Diekstrak dari AuditManager.jsx (baris 5175-5189).
 * Sumber: MODAL CETAK LAPORAN AUDIT RESMI (DOC/SMC, NCR CLOSEOUT & CHECKLIST)
 */
import React from 'react';
import { AuditReportModal } from '.././AuditReportModal';

export const ReportModalHost = ({
  reportModalFinding,
  reportModalMode,
  reportModalSession,
  setReportModalFinding,
  setReportModalOpen,
  setReportModalSession,
}) => (
<AuditReportModal
    session={reportModalSession}
    finding={reportModalFinding}
    initialMode={reportModalMode}
    liveChecklist={reportModalSession?.checklist}
    onClose={() => {
      setReportModalOpen(false);
      setReportModalSession(null);
      setReportModalFinding(null);
    }}
  />
);
