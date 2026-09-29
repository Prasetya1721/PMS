/**
 * handleLoadSampleSMCAudit.js
 * Diekstrak dari AuditManager.jsx (baris 625-792).
 * Sumber: Muat simulasi audit SMC: 74 butir checklist BKI terisi realistis, plus sesi dan temuan contoh
 *
 * Dependensi closure induk diangkat menjadi PARAMETER eksplisit:
 *   isAuditorOrDPA, showToast, currentTarget, activeChecklistItems, addAuditSession, addAuditFinding, setVesselChecklistResults, setVesselChecklistNotes, setVesselTab
 */
import { makeId } from '../../../utils/idUtils';
export const handleLoadSampleSMCAudit = (isAuditorOrDPA, showToast, currentTarget, activeChecklistItems, addAuditSession, addAuditFinding, setVesselChecklistResults, setVesselChecklistNotes, setVesselTab) => {
    if (!isAuditorOrDPA) {
      showToast('Wewenang DPA: Pemuatan simulasi data audit hanya diizinkan untuk DPA / Lead Auditor.', 'warning');
      return;
    }
    if (!currentTarget) return;
    const isDoc = currentTarget.standard === 'DOC';
    const vesselName = isDoc ? 'TB. RP 2004' : currentTarget.name;
    const vesselId = isDoc ? 'v-rp2004' : currentTarget.id;
    const nakhoda = currentTarget.nakhoda || 'Capt. Ekhsan (Nakhoda)';
    const kkm = currentTarget.kkm || 'Ir. Bambang Wijaya (KKM)';
    const year = new Date().getFullYear();
    const todayStr = new Date().toISOString().split('T')[0];
    const dueStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const sampleSessionId = makeId('aud-smc-sample');
    const sampleAuditNo = `AUD-SMC-BKI/PBK-${year}/089`;
    const sampleReportId = `0859-PK/ISM-SMC/${year}`;

    // Siapkan 74 butir checklist BKI SMC Rev 05 terisi realistis
    const resultsMap = {};
    const notesMap = {};
    const sessionChecklist = (activeChecklistItems || []).map(i => {
      let res = 'Complied';
      let note = '';

      if (i.code === '10.3' || i.code?.startsWith('10.3')) {
        res = 'Minor NC';
        note = 'Emergency Fire Pump di steering gear room mengalami delay start 45 detik saat pengujian simulasi.';
      } else if (i.code === '6.5' || i.code?.startsWith('6.5')) {
        res = 'Observation';
        note = 'Formulir familiarisasi onboard untuk 2 ABK baru belum ditandatangani Perwira Keselamatan.';
      } else if (i.code?.startsWith('10.7') || i.code?.startsWith('10.8') || i.name?.toLowerCase().includes('cargo') || i.name?.toLowerCase().includes('crane')) {
        res = 'N/A';
        note = 'Klausul N/A (Kapal jenis Tugboat / Tunda tanpa crane kargo).';
      }

      resultsMap[i.code] = res;
      if (note) notesMap[i.code] = note;

      return {
        id: i.code || i.id,
        code: i.code,
        name: i.name,
        checkPoint: i.checkPoint,
        ismCode: i.ismCode || '',
        result: res,
        notes: note,
        isManual: false,
        isStrikethrough: res === 'N/A',
        evidence: res !== 'N/A' ? {
          fileName: `EVIDEN-${i.code}-DOKUMEN-FOTO.pdf`,
          fileUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80',
          uploadedAt: new Date().toISOString()
        } : null
      };
    });

    const sampleSession = {
      id: sampleSessionId,
      auditNo: sampleAuditNo,
      reportId: sampleReportId,
      auditType: 'Internal',
      externalOrganization: 'Biro Klasifikasi Indonesia (BKI) / Internal DPA',
      standard: 'SMC',
      targetType: 'Vessel',
      targetName: vesselName,
      vesselId: vesselId,
      leadAuditor: 'Capt. Hendra Gunawan (Lead Marine Auditor ISM/DPA)',
      auditTeam: ['Ir. H. Gunawan (Marine Superintendent)', 'Dian Anggraini (QHSE Officer)'],
      auditee: `${nakhoda} & ${kkm}`,
      auditLocation: `Onboard ${vesselName} (Dermaga Pelabuhan Pontianak)`,
      auditDate: todayStr,
      targetCloseDate: dueStr,
      scope: `Audit Pemenuhan Sistem Manajemen Keselamatan ISM Code Standar SMC Kapal ${vesselName} (BKI SMS Shipboard Rev 05)`,
      status: 'In Progress',
      selectedCertificateIds: [],
      selectedRequisitionIds: [],
      checklist: sessionChecklist,
      auditConclusion: 'Operasional keselamatan kapal secara umum memenuhi ketentuan ISM Code dan BKI SMS Rev 05. Ditemukan 1 Minor NC pada pompa pemadam darurat dan 1 Observasi pada verifikasi familiarisasi kru.',
      leadAuditorSign: 'Capt. Hendra Gunawan',
      auditeeSign: nakhoda,
      totalItemsChecked: sessionChecklist.length,
      itemsComplied: sessionChecklist.filter(x => x.result === 'Complied').length,
      findingsSummary: { majorNC: 0, minorNC: 1, observation: 1, totalOpen: 1, totalClosed: 1 }
    };

    addAuditSession(sampleSession);

    // Temuan 1: Minor NC pada 10.3 (Status: Eviden Submitted / Siap Verifikasi)
    const finding1 = {
      id: makeId('fnd-smc-1'),
      findingNo: `NC-SMC-${year}-001`,
      auditId: sampleSessionId,
      auditNo: sampleAuditNo,
      vesselId: vesselId,
      targetName: vesselName,
      standard: 'SMC',
      auditType: 'Internal',
      externalOrganization: 'Biro Klasifikasi Indonesia (BKI)',
      clauseCode: '10.3',
      clauseName: 'Peralatan Kritis Kapal (Critical Shipboard Equipment)',
      elementNumberOfCode: '10.3',
      description: 'Saat pengetesan berkala darurat di dermaga, Emergency Fire Pump di steering gear room mengalami delay start 45 detik karena akumulasi udara pada suction line. Tekanan discharge belum stabil mencapai 2.5 bar sesuai SOLAS II-2.',
      objectiveEvidence: 'Logbook pengetesan mingguan tanggal 20 September 2026 dan pengujian fisik di hadapan Lead Auditor.',
      category: 'Minor NC',
      assignedTo: `${kkm} & Masinis II`,
      dateIdentified: todayStr,
      dueDate: dueStr,
      status: 'Eviden Submitted',
      evidence: {
        rootCause: 'Foot valve pada pipa hisap mengalami kerak karat tipis sehingga terjadi back-leakage air pancingan saat pompa standby dalam posisi siap jalan.',
        correction: 'Pembersihan dan penggantian seal foot valve, serta bleeding sistem pipa hisap hingga pompa dapat start instan dalam 5 detik dengan tekanan 3.2 bar.',
        correctiveAction: 'Menambahkan poin pemeriksaan seal foot valve ke dalam PMS 3-bulanan dan mewajibkan uji pengetesan mingguan dicatat di log book kamar mesin.',
        preventiveAction: 'Audit silang antar-kapal armada setiap 6 bulan untuk verifikasi kesiapan pompa pemadam darurat.',
        agreedDate: dueStr,
        submittedBy: `${kkm} (Chief Engineer)`,
        submissionDate: todayStr,
        attachments: [
          { name: 'BAST-PERBAIKAN-FOOTVALVE-PUMP.pdf', size: '1.4 MB' },
          { name: 'FOTO-RUNNING-TEST-PRESSURE-3.2BAR.jpg', size: '2.1 MB' }
        ]
      }
    };

    // Temuan 2: Observation pada 6.5 (Status: NC Close / Sudah Ditutup)
    const finding2 = {
      id: makeId('fnd-smc-2'),
      findingNo: `OBS-SMC-${year}-002`,
      auditId: sampleSessionId,
      auditNo: sampleAuditNo,
      vesselId: vesselId,
      targetName: vesselName,
      standard: 'SMC',
      auditType: 'Internal',
      externalOrganization: 'Biro Klasifikasi Indonesia (BKI)',
      clauseCode: '6.5',
      clauseName: 'Pelatihan & Familiarisasi Personil Onboard',
      elementNumberOfCode: '6.5',
      description: 'Formulir familiarisasi safety onboard untuk 2 orang ABK baru (Oiler & Kelasi) telah dilaksanakan secara lisan saat sign-on, namun lembar verifikasi checklist belum ditandatangani oleh Perwira Keselamatan (Chief Mate).',
      objectiveEvidence: 'Dokumen checklist familiarisasi FM-CREW-04 di ruang nakhoda belum dibubuhi tanda tangan.',
      category: 'Observation',
      assignedTo: `Chief Mate & ${nakhoda}`,
      dateIdentified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDate: todayStr,
      status: 'NC Close',
      dateClosed: todayStr,
      closedBy: 'Capt. Hendra Gunawan (Lead Auditor)',
      closedNotes: 'Diverifikasi langsung di kapal: seluruh formulir familiarisasi telah ditandatangani dan ABK mampu mendemonstrasikan prosedur evakuasi darurat.',
      evidence: {
        rootCause: 'Pergantian jadwal jaga saat kapal tiba di dermaga menyebabkan penandatanganan dokumen administrasi tertunda.',
        correction: 'Verifikasi ulang pemahaman keselamatan dan melengkapi tanda tangan seluruh lembar familiarisasi.',
        correctiveAction: 'SOP sign-on kru mewajibkan verifikasi dan tanda tangan selesai maksimal 24 jam sebelum kapal bertolak.',
        preventiveAction: 'Briefing safety rutin pada hari pertama pergantian kru (crew change).',
        submittedBy: `${nakhoda} (Master Captain)`,
        submissionDate: todayStr
      }
    };

    addAuditFinding(finding1);
    addAuditFinding(finding2);

    setVesselChecklistResults(resultsMap);
    setVesselChecklistNotes(notesMap);

    showToast(`✓ Contoh Audit SMC Resmi BKI (${vesselName}) berhasil dimuat lengkap dengan 5 Tahap!`, 'success');
    setVesselTab('capa');
  };
