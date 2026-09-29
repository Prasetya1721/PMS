/**
 * __useMemo_227_325.js
 * Diekstrak dari MasterDataAdmin.jsx (baris 227-325).
 * Sumber: Mesin audit data master: skor integritas + daftar anomali tiap entitas
 *
 * Dependensi closure induk diangkat menjadi PARAMETER eksplisit:
 *   allCrew, allEquipment, allShipDocuments, certificateCategories, crew, equipment, shipDocuments, spareparts, users, vessels, workOrders
 */
export const hitungAuditDataMaster = (allCrew, allEquipment, allShipDocuments, certificateCategories, crew, equipment, shipDocuments, spareparts, users, vessels, workOrders) => {
    const todayRef = new Date('2026-09-09T00:00:00Z');

    // Audit Vessels
    const totalVessels = vessels.length;
    const ownerVessels = vessels.filter(v => v.ownershipStatus === 'As Owner' || (!v.id.startsWith('v-op-') && v.ownershipStatus !== 'As Operator')).length;
    const operatorVessels = vessels.filter(v => v.ownershipStatus === 'As Operator' || v.id.startsWith('v-op-')).length;
    const vesselsWithParticulars = vessels.filter(v => v.particulars && v.particulars.dimensions).length;
    const vesselsMissingReg = vessels.filter(v => !v.regNo && !v.imo);
    const vesselIntegrityPass = totalVessels > 0 && vesselsMissingReg.length === 0;

    // Audit Crew
    const totalCrew = (allCrew || crew || []).length;
    const crewUnassigned = (allCrew || crew || []).filter(c => !c.vesselId || !vessels.some(v => v.id === c.vesselId));
    const crewMissingContact = (allCrew || crew || []).filter(c => !c.phone && !c.whatsapp);
    const crewIntegrityPass = totalCrew > 0 && crewUnassigned.length === 0;

    // Audit Documents
    const docs = allShipDocuments || shipDocuments || [];
    const totalDocs = docs.length;
    const docsMissingCategory = docs.filter(d => !d.category);
    const docsMissingIssueDate = docs.filter(d => !d.issueDate);
    const docsMissingExpiryDate = docs.filter(d => !d.expiryDate);
    const docsInvalidStatus = docs.filter(d => {
      if (!d.expiryDate) return true;
      const exp = new Date(d.expiryDate + 'T00:00:00Z');
      const diff = Math.round((exp.getTime() - todayRef.getTime()) / (1000 * 60 * 60 * 24));
      let expStatus = 'Active';
      if (diff <= 0) expStatus = 'Expired';
      else if (diff <= 30) expStatus = 'Due Soon';
      return d.status !== expStatus;
    });
    const docIntegrityPass = totalDocs > 0 && docsMissingCategory.length === 0 && docsMissingIssueDate.length === 0 && docsMissingExpiryDate.length === 0;

    // Audit Categories
    const categoriesCount = (certificateCategories || []).length;
    const hasCoreCategories = ['BKI', 'Statutory', 'Asuransi', 'KSOP', 'Kesehatan'].every(id =>
      (certificateCategories || []).some(c => c.id === id)
    );

    // Audit Equipment & Work Orders
    const totalEq = (allEquipment || equipment || []).length;
    const eqMissingHours = (allEquipment || equipment || []).filter(e => typeof e.runningHours !== 'number');
    const totalWO = (workOrders || []).length;
    const totalParts = (spareparts || []).length;

    // Audit Users
    const userList = users || [];
    const totalUsers = userList.length;
    const usersMissingEmail = userList.filter(u => !u.email || !u.email.includes('@'));
    const usersMissingRole = userList.filter(u => !u.role);
    const usersMissingPassword = userList.filter(u => !u.password);
    const superAdminCount = userList.filter(u => u.role === 'Super Admin').length;
    const userIntegrityPass = totalUsers > 0 && usersMissingEmail.length === 0 && usersMissingRole.length === 0 && superAdminCount > 0;

    // Overall Score Calculation (out of 100)
    let score = 100;
    if (totalVessels === 0) score -= 10;
    if (vesselsMissingReg.length > 0) score -= 5;
    if (crewUnassigned.length > 0) score -= 5;
    if (docsMissingCategory.length > 0) score -= 10;
    if (docsMissingIssueDate.length > 0) score -= 10;
    if (docsMissingExpiryDate.length > 0) score -= 10;
    if (!hasCoreCategories) score -= 10;
    if (totalUsers === 0 || !userIntegrityPass) score -= 5;
    if (score < 0) score = 0;

    return {
      score,
      totalVessels,
      ownerVessels,
      operatorVessels,
      vesselsWithParticulars,
      vesselsMissingReg,
      vesselIntegrityPass,
      totalCrew,
      crewUnassigned,
      crewMissingContact,
      crewIntegrityPass,
      totalDocs,
      docsMissingCategory,
      docsMissingIssueDate,
      docsMissingExpiryDate,
      docsInvalidStatus,
      docIntegrityPass,
      categoriesCount,
      hasCoreCategories,
      totalEq,
      eqMissingHours,
      totalWO,
      totalParts,
      totalUsers,
      superAdminCount,
      usersMissingEmail,
      usersMissingRole,
      usersMissingPassword,
      userIntegrityPass
    };
  };
