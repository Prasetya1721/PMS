/**
 * handleQuickLaunchSession.js
 * Diekstrak dari AuditManager.jsx (baris 503-553).
 * Sumber: Inisiasi cepat sesi audit satu klik: menyusun sesi lengkap dari target aktif lalu mengaktifkannya
 *
 * Dependensi closure induk diangkat menjadi PARAMETER eksplisit:
 *   activeChecklistItems, addAuditSession, currentTarget, isAuditorOrDPA, setVesselTab, showToast
 */
export const handleQuickLaunchSession = (activeChecklistItems, addAuditSession, currentTarget, isAuditorOrDPA, setVesselTab, showToast) => {
    if (!isAuditorOrDPA) {
      showToast('Wewenang DPA: Sesi audit kapal hanya dapat diinisiasi oleh Lead Auditor atau DPA dari kantor darat.', 'warning');
      return;
    }
    if (!currentTarget) return;
    const isDoc = currentTarget.standard === 'DOC';
    const rand = Math.floor(Math.random() * 900 + 100);
    const year = new Date().getFullYear();
    const newSession = {
      auditNo: `AUD-INT-${currentTarget.standard}-${year}/${rand}`,
      reportId: `0859-PK/ISM-${currentTarget.standard}/${year}`,
      auditType: 'Internal',
      externalOrganization: 'PT. Pelayaran Baharimas Kalimantan (Internal DPA / QHSE)',
      standard: currentTarget.standard,
      targetType: isDoc ? 'Office' : 'Vessel',
      targetName: currentTarget.name,
      vesselId: isDoc ? null : currentTarget.id,
      leadAuditor: 'Capt. Marine Safety Inspector (Lead Auditor DPA)',
      auditTeam: ['DPA & Marine Superintendent', 'QHSE Staff'],
      auditee: isDoc ? 'Direktur Operasional & DPA' : `${currentTarget.nakhoda || 'Nakhoda'} & ${currentTarget.kkm || 'KKM'}`,
      auditLocation: isDoc ? 'Kantor Pusat PT. PBK Pontianak' : `Onboard ${currentTarget.name} (Pelabuhan Pontianak)`,
      auditDate: new Date().toISOString().split('T')[0],
      targetCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      scope: isDoc ? 'Audit Kepatuhan Kantor Pusat ISM Code Standar DOC' : `Audit Kepatuhan Kapal ${currentTarget.name} Standar SMC ISM Code`,
      status: 'In Progress',
      selectedCertificateIds: [],
      selectedRequisitionIds: [],
      checklist: (activeChecklistItems || []).map(i => ({
        id: i.code || i.id,
        code: i.code,
        name: i.name,
        checkPoint: i.checkPoint,
        ismCode: i.ismCode || '',
        result: i.isStrikethrough ? 'N/A' : (i.defaultResult || ''),
        notes: '',
        isManual: false,
        isStrikethrough: Boolean(i.isStrikethrough),
        evidence: null
      })),
      auditConclusion: '',
      leadAuditorSign: '',
      auditeeSign: '',
      totalItemsChecked: (activeChecklistItems || []).length,
      itemsComplied: 0,
      findingsSummary: { majorNC: 0, minorNC: 0, observation: 0, totalOpen: 0, totalClosed: 0 }
    };
    addAuditSession(newSession);
    showToast(`✓ Sesi Audit ${newSession.auditNo} aktif untuk ${currentTarget.name}!`, 'success');
    setVesselTab('checklist');
  };
