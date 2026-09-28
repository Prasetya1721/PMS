/**
 * SessionModalHost.jsx
 * Diekstrak dari AuditManager.jsx (baris 5110-5133).
 * Sumber: MODAL AUDIT SESSIONS
 */
import React from 'react';
import { AuditSessionModal } from '.././AuditSessionModal';

export const SessionModalHost = ({
  activeStandard,
  activeTargetId,
  currentTarget,
  editingSession,
  setActiveTargetId,
  setEditingSession,
  setSessionModalOpen,
  setVesselTab,
  showToast,
}) => (
<AuditSessionModal
    session={editingSession}
    defaultVesselId={activeTargetId}
    defaultStandard={editingSession?.standard || currentTarget?.standard || (activeStandard === 'DOC' ? 'DOC' : 'SMC')}
    onSaved={(savedSession) => {
      setSessionModalOpen(false);
      setEditingSession(null);
      if (savedSession?.vesselId && savedSession.vesselId !== activeTargetId) {
        setActiveTargetId(savedSession.vesselId);
      } else if (!savedSession?.vesselId && activeTargetId !== 'office') {
        setActiveTargetId('office');
      }
      setVesselTab('checklist');
      showToast(`✓ Sesi ${savedSession.auditNo} siap! Silakan lanjutkan pemeriksaan klausul di Dashboard Tahap 2.`, 'info');
    }}
    onClose={() => {
      setSessionModalOpen(false);
      setEditingSession(null);
    }}
  />
);
