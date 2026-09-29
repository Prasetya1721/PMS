/**
 * handleQuickLogNC.js
 * Diekstrak dari AuditManager.jsx (baris 558-591).
 * Sumber: Pembuatan temuan NC satu klik dari butir checklist, dengan draf terisi otomatis
 *
 * Dependensi closure induk diangkat menjadi PARAMETER eksplisit:
 *   activeSession, checklistEvidenceMap, currentTarget, isAuditorOrDPA, setEditingFinding, setFindingDefaultAuditId, setFindingModalOpen, showToast, vesselChecklistNotes
 */
export const handleQuickLogNC = (item, preferredCategory = 'Minor NC', activeSession, checklistEvidenceMap, currentTarget, isAuditorOrDPA, setEditingFinding, setFindingDefaultAuditId, setFindingModalOpen, showToast, vesselChecklistNotes) => {
    if (!isAuditorOrDPA) {
      showToast('Wewenang Auditor: Pencatatan temuan NC resmi merupakan wewenang Lead Auditor saat inspeksi.', 'warning');
      return;
    }
    if (!currentTarget) return;
    const assignedPIC = currentTarget.type === 'vessel'
      ? `${currentTarget.kkm || 'KKM'} / ${currentTarget.nakhoda || 'Nakhoda'}`
      : 'Manager QHSE / DPA';

    const draftFinding = {
      isDraft: true,
      auditId: activeSession?.id || null,
      auditNo: activeSession?.auditNo || `AUD-${currentTarget.standard}-${Date.now().toString().slice(-4)}`,
      vesselId: currentTarget.type === 'vessel' ? currentTarget.id : null,
      targetName: currentTarget.name,
      standard: currentTarget.standard,
      auditType: activeSession?.auditType || 'Internal',
      externalOrganization: activeSession?.externalOrganization || 'Biro Klasifikasi Indonesia (BKI)',
      clauseCode: item.code,
      clauseName: item.name,
      elementNumberOfCode: item.code,
      description: `Ketidaksesuaian teridentifikasi pada butir ${item.code} (${item.name}): ${item.checkPoint || item.description || 'Pemeriksaan kepatuhan'}. Kondisi aktual belum memenuhi standar keselamatan ISM Code.`,
      objectiveEvidence: vesselChecklistNotes[item.code] || checklistEvidenceMap[item.code]?.fileName || 'Hasil observasi auditor saat pemeriksaan checklist lapangan.',
      category: preferredCategory === 'Major NC' ? 'Major NC' : preferredCategory === 'Observation' ? 'Observation' : 'Minor NC',
      assignedTo: assignedPIC,
      dateIdentified: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setEditingFinding(draftFinding);
    setFindingDefaultAuditId(activeSession?.id || null);
    setFindingModalOpen(true);
  };
