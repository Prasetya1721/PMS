/**
 * handleGenerateMockVesselChecklistEvidence.js
 * Diekstrak dari AuditManager.jsx (baris 801-838).
 * Sumber: Pembuat bukti audit simulasi berupa SVG untuk butir checklist kapal
 *
 * Dependensi closure induk diangkat menjadi PARAMETER eksplisit:
 *   activeChecklistItems, activeSession, setChecklistEvidenceMap, showToast, updateAuditSession
 */
export const handleGenerateMockVesselChecklistEvidence = (itemCode, itemName, vesselName, activeChecklistItems, activeSession, setChecklistEvidenceMap, showToast, updateAuditSession) => {
    const targetName = vesselName || 'Kapal Armada PBK';
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <rect width="100%" height="100%" fill="#0f172a"/>
      <rect x="20" y="20" width="560" height="360" rx="12" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
      <circle cx="300" cy="100" r="40" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-width="3"/>
      <path d="M282 100 L295 113 L325 85" stroke="#10b981" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <text x="300" y="175" font-family="sans-serif" font-size="18" font-weight="bold" fill="#f8fafc" text-anchor="middle">BUKTI AUDIT CHECKLIST ONBOARD</text>
      <text x="300" y="205" font-family="sans-serif" font-size="13" font-weight="bold" fill="#38bdf8" text-anchor="middle">PT. PELAYARAN BAHARIMAS KALIMANTAN</text>
      <text x="300" y="240" font-family="monospace" font-size="13" fill="#e2e8f0" text-anchor="middle">Klausul: ${itemCode} - ${itemName?.substring(0, 35)}</text>
      <text x="300" y="270" font-family="sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">Lokasi Onboard: ${targetName}</text>
      <rect x="180" y="315" width="240" height="35" rx="6" fill="#047857"/>
      <text x="300" y="338" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">VERIFIED AUDIT EVIDENCE</text>
    </svg>`;
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
    const evidenceObj = {
      fileName: `BUKTI_${itemCode.replace(/[^a-zA-Z0-9]/g, '_')}_${targetName.replace(/\s+/g, '_')}.svg`,
      fileSize: '16.2 KB',
      fileUrl: dataUrl,
      uploadedAt: new Date().toISOString()
    };
    setChecklistEvidenceMap(prev => ({ ...prev, [itemCode]: evidenceObj }));

    if (activeSession && updateAuditSession) {
      const baseItems = activeSession.checklist && activeSession.checklist.length > 0
        ? activeSession.checklist
        : (activeChecklistItems || []);
      const updatedList = baseItems.map(it => {
        if (it.code === itemCode || it.id === itemCode) {
          return { ...it, evidence: evidenceObj };
        }
        return it;
      });
      updateAuditSession(activeSession.id, { checklist: updatedList });
    }

    showToast(`✓ Simulasi bukti audit ${itemCode} berhasil dilampirkan!`, 'info');
  };
