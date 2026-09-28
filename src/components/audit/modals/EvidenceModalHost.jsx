/**
 * EvidenceModalHost.jsx
 * Diekstrak dari AuditManager.jsx (baris 5152-5162).
 * Sumber: MODAL SUBMIT EVIDEN PERBAIKAN
 */
import React from 'react';
import { SubmitEvidenceModal } from '.././SubmitEvidenceModal';

export const EvidenceModalHost = ({
  evidenceTargetFinding,
  setEvidenceModalOpen,
  setEvidenceTargetFinding,
}) => (
<SubmitEvidenceModal
    finding={evidenceTargetFinding}
    onClose={() => {
      setEvidenceModalOpen(false);
      setEvidenceTargetFinding(null);
    }}
  />
);
