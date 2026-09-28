/**
 * RoleFlowModalHost.jsx
 * Diekstrak dari AuditManager.jsx (baris 5192-5201).
 * Sumber: MODAL BAGAN ALUR KERJA DPA & NAKHODA (INTERAKTIF & MATRIKS RACI)
 */
import React from 'react';
import { AuditRoleFlowModal } from '.././AuditRoleFlowModal';

export const RoleFlowModalHost = ({
  activeStandard,
  auditRolePerspective,
  currentTarget,
  setAuditRolePerspective,
  setShowRoleFlowModal,
  showRoleFlowModal,
}) => (
<AuditRoleFlowModal
  isOpen={showRoleFlowModal}
  onClose={() => setShowRoleFlowModal(false)}
  currentPerspective={auditRolePerspective}
  onSelectPerspective={(p) => setAuditRolePerspective(p)}
  initialStandard={currentTarget?.standard || activeStandard || 'SMC'}
/>
);
