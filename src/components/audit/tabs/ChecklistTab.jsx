/**
 * ChecklistTab.jsx
 * Diekstrak dari AuditManager.jsx (baris 3409-4296).
 * Sumber: TAB 3: CHECKLIST ISM & INPUT MANUAL
 */
import React from 'react';
import { Edit2, Eye, FileText, Plus, Printer, Sparkles, Strikethrough, Trash2, Undo2, Upload, Zap } from 'lucide-react';
import { isBKIOrganization } from '../../../data/auditMasterData';
import { ChecklistTabToolbar } from './checklisttab/ChecklistTabToolbar';
import { ChecklistTabFilterBar } from './checklisttab/ChecklistTabFilterBar';
import { ChecklistTabTable } from './checklisttab/ChecklistTabTable';
import { ChecklistManualCodeForm } from './checklisttab/ChecklistManualCodeForm';

export const ChecklistTab = ({
  activeChecklistConfig,
  activeChecklistItems,
  activeSession,
  checklistEvidenceMap,
  currentTarget,
  customChecklistItems,
  getEnrichedReportSession,
  handleAddManualChecklistItem,
  handleGenerateMockVesselChecklistEvidence,
  handleOpenEditManagerItem,
  handleQuickLogNC,
  handleRemoveVesselChecklistEvidence,
  handleToggleManagerResult,
  handleToggleVesselStrikethrough,
  handleUploadVesselChecklistEvidence,
  isAuditorOrDPA,
  manualCode,
  manualCriteria,
  manualName,
  manualNotes,
  manualStatus,
  setDeleteManagerItemTarget,
  setManualCode,
  setManualCriteria,
  setManualName,
  setManualNotes,
  setManualStatus,
  setPreviewChecklistEvidence,
  setReportModalFinding,
  setReportModalMode,
  setReportModalOpen,
  setReportModalSession,
  setShowManualCodeForm,
  setVesselChecklistFilter,
  setVesselChecklistNotes,
  showManualCodeForm,
  vesselChecklistFilter,
  vesselChecklistNotes,
  vesselChecklistResults,
  vesselDeletedCodes,
  vesselItemOverrides,
  vesselStrikethroughOverrides,
}) => (
<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <ChecklistTabToolbar
      activeChecklistConfig={activeChecklistConfig}
      activeSession={activeSession}
      currentTarget={currentTarget}
      getEnrichedReportSession={getEnrichedReportSession}
      isAuditorOrDPA={isAuditorOrDPA}
      setReportModalFinding={setReportModalFinding}
      setReportModalMode={setReportModalMode}
      setReportModalOpen={setReportModalOpen}
      setReportModalSession={setReportModalSession}
      setShowManualCodeForm={setShowManualCodeForm}
      showManualCodeForm={showManualCodeForm}
    />

    {/* Checklist Filter Bar */}
    <ChecklistTabFilterBar
      activeChecklistItems={activeChecklistItems}
      checklistEvidenceMap={checklistEvidenceMap}
      customChecklistItems={customChecklistItems}
      setVesselChecklistFilter={setVesselChecklistFilter}
      vesselChecklistFilter={vesselChecklistFilter}
      vesselChecklistResults={vesselChecklistResults}
      vesselDeletedCodes={vesselDeletedCodes}
      vesselStrikethroughOverrides={vesselStrikethroughOverrides}
    />

    {/* Form Input Item Audit Manual */}
    {(showManualCodeForm) && (
      <ChecklistManualCodeForm
        currentTarget={currentTarget}
        handleAddManualChecklistItem={handleAddManualChecklistItem}
        manualCode={manualCode}
        manualCriteria={manualCriteria}
        manualName={manualName}
        manualNotes={manualNotes}
        manualStatus={manualStatus}
        setManualCode={setManualCode}
        setManualCriteria={setManualCriteria}
        setManualName={setManualName}
        setManualNotes={setManualNotes}
        setManualStatus={setManualStatus}
        setShowManualCodeForm={setShowManualCodeForm}
      />
    )}

    {/* Standard + Template Elements Table */}
    <ChecklistTabTable
      activeChecklistConfig={activeChecklistConfig}
      activeChecklistItems={activeChecklistItems}
      checklistEvidenceMap={checklistEvidenceMap}
      currentTarget={currentTarget}
      customChecklistItems={customChecklistItems}
      handleGenerateMockVesselChecklistEvidence={handleGenerateMockVesselChecklistEvidence}
      handleOpenEditManagerItem={handleOpenEditManagerItem}
      handleQuickLogNC={handleQuickLogNC}
      handleRemoveVesselChecklistEvidence={handleRemoveVesselChecklistEvidence}
      handleToggleManagerResult={handleToggleManagerResult}
      handleToggleVesselStrikethrough={handleToggleVesselStrikethrough}
      handleUploadVesselChecklistEvidence={handleUploadVesselChecklistEvidence}
      isAuditorOrDPA={isAuditorOrDPA}
      setDeleteManagerItemTarget={setDeleteManagerItemTarget}
      setPreviewChecklistEvidence={setPreviewChecklistEvidence}
      setVesselChecklistNotes={setVesselChecklistNotes}
      vesselChecklistFilter={vesselChecklistFilter}
      vesselChecklistNotes={vesselChecklistNotes}
      vesselChecklistResults={vesselChecklistResults}
      vesselDeletedCodes={vesselDeletedCodes}
      vesselItemOverrides={vesselItemOverrides}
      vesselStrikethroughOverrides={vesselStrikethroughOverrides}
    />
  </div>
);
