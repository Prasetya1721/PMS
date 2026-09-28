/**
 * FindingModalHost.jsx
 * Diekstrak dari AuditManager.jsx (baris 5136-5149).
 * Sumber: MODAL AUDIT FINDINGS (CATAT TEMUAN NC)
 */
import React from 'react';
import { AuditFindingModal } from '.././AuditFindingModal';

export const FindingModalHost = ({
  activeTargetId,
  editingFinding,
  findingDefaultAuditId,
  setEditingFinding,
  setFindingDefaultAuditId,
  setFindingModalOpen,
}) => (
<AuditFindingModal
    finding={editingFinding}
    defaultAuditId={findingDefaultAuditId}
    defaultVesselId={activeTargetId}
    onClose={() => {
      setFindingModalOpen(false);
      setEditingFinding(null);
      setFindingDefaultAuditId(null);
    }}
  />
);
