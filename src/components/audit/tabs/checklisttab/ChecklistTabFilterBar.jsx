/**
 * ChecklistTabFilterBar.jsx
 * Diekstrak dari ChecklistTab.jsx (baris 111-174).
 * Sumber: Baris filter status item checklist dan pencarian kode
 */
import React from 'react';

export const ChecklistTabFilterBar = ({
  activeChecklistItems,
  checklistEvidenceMap,
  customChecklistItems,
  setVesselChecklistFilter,
  vesselChecklistFilter,
  vesselChecklistResults,
  vesselDeletedCodes,
  vesselStrikethroughOverrides,
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(() => {
            const activeNonDeleted = activeChecklistItems.filter(el => !vesselDeletedCodes.includes(el.code));
            const customNonDeleted = customChecklistItems.filter(el => !vesselDeletedCodes.includes(el.code));
            const allTargetItems = [...customNonDeleted, ...activeNonDeleted];

            const struckCount = allTargetItems.filter(el =>
              vesselStrikethroughOverrides[el.code] !== undefined
                ? vesselStrikethroughOverrides[el.code]
                : Boolean(el.isStrikethrough)
            ).length;
            const activeCount = allTargetItems.length - struckCount;

            const yesCount = allTargetItems.filter(el => {
              const isStriked = vesselStrikethroughOverrides[el.code] !== undefined
                ? vesselStrikethroughOverrides[el.code]
                : Boolean(el.isStrikethrough);
              const res = vesselChecklistResults[el.code] !== undefined
                ? vesselChecklistResults[el.code]
                : (isStriked ? 'N/A' : (el.result || ''));
              return !isStriked && (res === 'Complied' || res === 'Yes');
            }).length;

            const noCount = allTargetItems.filter(el => {
              const isStriked = vesselStrikethroughOverrides[el.code] !== undefined
                ? vesselStrikethroughOverrides[el.code]
                : Boolean(el.isStrikethrough);
              const res = vesselChecklistResults[el.code] !== undefined
                ? vesselChecklistResults[el.code]
                : (isStriked ? 'N/A' : (el.result || ''));
              return !isStriked && ['Minor NC', 'Major NC', 'Observation', 'No'].includes(res);
            }).length;

            const naCount = allTargetItems.filter(el => {
              const isStriked = vesselStrikethroughOverrides[el.code] !== undefined
                ? vesselStrikethroughOverrides[el.code]
                : Boolean(el.isStrikethrough);
              const res = vesselChecklistResults[el.code] !== undefined
                ? vesselChecklistResults[el.code]
                : (isStriked ? 'N/A' : (el.result || ''));
              return isStriked || res === 'N/A';
            }).length;

            return [
              { id: 'ALL', label: `Semua Elemen (${allTargetItems.length})` },
              { id: 'CORE', label: `Klausul Aktif (${activeCount})` },
              { id: 'STRIKETHROUGH', label: `Klausul Dicoret (${struckCount})` },
              { id: 'YES', label: `Yes (${yesCount})` },
              { id: 'NO', label: `No / NC (${noCount})` },
              { id: 'NA', label: `N/A (${naCount})` },
              { id: 'HAS_EVIDENCE', label: `Memiliki Bukti (${Object.keys(checklistEvidenceMap).length})` }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setVesselChecklistFilter(f.id)}
                className={`btn btn-sm ${vesselChecklistFilter === f.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem' }}
              >
                {f.label}
              </button>
            ));
          })()}
        </div>
  );
};
