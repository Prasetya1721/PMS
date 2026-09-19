// Master Data Standar Audit ISM Code (DOC & SMC)
// PT. Pelayaran Baharimas Kalimantan
// Standard: IMO Resolution A.741(18) as amended (ISM Code)

export const ISM_DOC_ELEMENTS = [
  {
    code: 'ISM-1',
    name: 'Umum (General & Safety Policy)',
    description: 'Definisi, sasaran keselamatan, kebijakan perlindungan lingkungan dan implementasi sistem manajemen keselamatan di kantor pusat.',
    applicableTo: 'DOC',
    checkPoints: [
      'Apakah kebijakan keselamatan & lingkungan telah ditandatangani Direksi?',
      'Apakah kebijakan telah disosialisasikan ke seluruh karyawan darat & awak kapal?',
      'Apakah sasaran K3LH terukur dan ditinjau secara berkala?'
    ]
  },
  {
    code: 'ISM-2',
    name: 'Kebijakan Keselamatan & Perlindungan Lingkungan',
    description: 'Penyediaan instruksi dan prosedur untuk pengoperasian kapal yang aman dan perlindungan lingkungan sesuai peraturan maritim.',
    applicableTo: 'DOC',
    checkPoints: [
      'Apakah prosedur pencegahan polusi laut (MARPOL) terdokumentasi lengkap?',
      'Apakah terdapat komitmen zero accident dan zero spill?'
    ]
  },
  {
    code: 'ISM-3',
    name: 'Tanggung Jawab & Wewenang Perusahaan',
    description: 'Penetapan struktur organisasi, tanggung jawab entitas pemilik/operator, dan alokasi sumber daya darat.',
    applicableTo: 'DOC',
    checkPoints: [
      'Apakah struktur organisasi darat jelas dengan job description tertulis?',
      'Apakah tanggung jawab manajemen armada dan bagian logistik terdokumentasi?'
    ]
  },
  {
    code: 'ISM-4',
    name: 'Designated Person Ashore (DPA)',
    description: 'Akses langsung DPA ke tingkat manajemen tertinggi, pemantauan operasional keselamatan dan alokasi sumber daya.',
    applicableTo: 'DOC',
    checkPoints: [
      'Apakah penunjukan resmi DPA tertulis dengan surat keputusan Direktur?',
      'Apakah DPA memiliki akses langsung ke Direktur Utama?',
      'Apakah bukti pemantauan keselamatan kapal oleh DPA terdokumentasi?'
    ]
  },
  {
    code: 'ISM-5',
    name: 'Tanggung Jawab & Wewenang Nakhoda',
    description: 'Kewenangan mutlak Nakhoda (Overriding Authority) dalam mengambil keputusan keselamatan dan perlindungan lingkungan.',
    applicableTo: 'DOC',
    checkPoints: [
      'Apakah SMS secara tegas menyatakan kewenangan mutlak Nakhoda?',
      'Apakah Nakhoda secara berkala melakukan review SMS di kapal?'
    ]
  },
  {
    code: 'ISM-6',
    name: 'Sumber Daya & Personil (Awak Kapal & Darat)',
    description: 'Kualifikasi, sertifikasi STCW, pemeriksaan kesehatan, familiarisasi kru baru, dan pelatihan keselamatan.',
    applicableTo: 'DOC',
    checkPoints: [
      'Apakah seluruh awak kapal memiliki sertifikat kompetensi & profesi yang valid?',
      'Apakah buku pelaut (seaman book) dan medical check-up kru terdaftar resmi?',
      'Apakah checklist familiarisasi kru baru terdokumentasi sebelum kapal berlayar?'
    ]
  },
  {
    code: 'ISM-7',
    name: 'Pengembangan Prosedur Pengoperasian Kapal',
    description: 'Rencana kerja pelayaran (passage planning), prosedur olah gerak, towing tongkang, dan operasi muatan batubara.',
    applicableTo: 'DOC',
    checkPoints: [
      'Apakah voyage plan / passage planning dibuat sebelum keberangkatan kapal?',
      'Apakah checklist olah gerak dan prosedur towing tongkang tersedia di anjungan?'
    ]
  },
  {
    code: 'ISM-8',
    name: 'Kesiapan Menghadapi Keadaan Darurat',
    description: 'Identifikasi potensi situasi darurat, matriks latihan darurat (drills), dan kesiapan tim tanggap darurat kantor darat.',
    applicableTo: 'DOC',
    checkPoints: [
      'Apakah jadwal drill (kebakaran, sekoci/meninggalkan kapal, tumpahan minyak, orang jatuh ke laut) terjadwal rutin?',
      'Apakah nomor darurat kantor darat (Emergency Response Team) terpasang di kapal?'
    ]
  },
  {
    code: 'ISM-9',
    name: 'Pelaporan & Analisis Ketidaksesuaian (NC), Kecelakaan & Kejadian Berbahaya',
    description: 'Prosedur pelaporan insiden, investigasi root cause, dan tindakan perbaikan/pencegahan (CAPA).',
    applicableTo: 'DOC',
    checkPoints: [
      'Apakah formulir laporan kecelakaan dan near-miss tersedia?',
      'Apakah seluruh laporan NC dianalisis dan ditutup dengan bukti tindakan korektif?'
    ]
  },
  {
    code: 'ISM-10',
    name: 'Pemeliharaan Kapal & Perlengkapan (PMS & Critical Equipment)',
    description: 'Sistem perawatan terencana (PMS), inspeksi berkala, jam jalan mesin, uji coba perlengkapan kritis dan ketersediaan suku cadang cadangan.',
    applicableTo: 'DOC',
    checkPoints: [
      'Apakah sistem PMS kapal aktif dengan pencatatan running hours teratur?',
      'Apakah daftar perlengkapan kritis (standby steering, emergency generator, bilge pump) diuji berkala?',
      'Apakah stok spareparts kritis selalu memenuhi batas minimum?'
    ]
  },
  {
    code: 'ISM-11',
    name: 'Dokumentasi Sistem Manajemen Keselamatan',
    description: 'Pengendalian dokumen SMS, manual operasi, formulir kerja, dan distribusi salinan terkontrol.',
    applicableTo: 'DOC',
    checkPoints: [
      'Apakah manual keselamatan versi terbaru berada di kapal dan kantor darat?',
      'Apakah dokumen lama / usang segera dimusnahkan atau ditarik dari peredaran?'
    ]
  },
  {
    code: 'ISM-12',
    name: 'Verifikasi, Tinjauan & Evaluasi Perusahaan (Internal Audit)',
    description: 'Pelaksanaan audit internal tahunan untuk kantor dan seluruh armada kapal, evaluasi efektivitas SMS.',
    applicableTo: 'DOC',
    checkPoints: [
      'Apakah audit internal dilakukan minimal sekali dalam 12 bulan untuk tiap kapal?',
      'Apakah auditor internal independen dari area yang diaudit?'
    ]
  }
];

export const ISM_SMC_ELEMENTS = [
  {
    code: 'SMC-CERT',
    name: 'Kelaikan & Sertifikasi Statutori Kapal',
    description: 'Validitas Pas Besar, Surat Ukur, Sertifikat BKI (Lambung & Mesin), Safety Construction, Radio, dan Keselamatan.',
    applicableTo: 'SMC',
    checkPoints: [
      'Apakah seluruh sertifikat statutori kapal dalam masa berlaku aktif?',
      'Apakah endorsement survei tahunan BKI telah ditandatangani surveyor?'
    ]
  },
  {
    code: 'SMC-PMS',
    name: 'Penerapan PMS & Logbook Mesin di Kapal',
    description: 'Pelaksanaan checklist perawatan terencana mesin utama, genset, sistem towing, kompresor, dan pompa bilga.',
    applicableTo: 'SMC',
    checkPoints: [
      'Apakah logbook permesinan diisi setiap jam jaga dengan data suhu dan tekanan akurat?',
      'Apakah work order PMS terjadwal dikerjakan tepat waktu sesuai jam jalan mesin?'
    ]
  },
  {
    code: 'SMC-REQ',
    name: 'Permintaan Barang & Suku Cadang Kritis Gudang',
    description: 'Pengajuan surat permintaan barang (SPB) ke gudang untuk perbaikan mesin, safety gear, dan material operasional.',
    applicableTo: 'SMC',
    checkPoints: [
      'Apakah suku cadang yang rusak segera dibuatkan permintaan barang ke gudang darat?',
      'Apakah barang yang diterima dari gudang telah diverifikasi fisik dan kualitasnya?'
    ]
  },
  {
    code: 'SMC-DRILL',
    name: 'Latihan Darurat & Perlengkapan Keselamatan Kapal',
    description: 'Kesiapan fisik Inflatable Life Raft (ILR), hydrostatic release unit (HRU), alat pemadam api (APAR), EEBD, dan pyrotechnics.',
    applicableTo: 'SMC',
    checkPoints: [
      'Apakah sertifikat servis ILR dan HRU masih berlaku?',
      'Apakah botol pemadam kebakaran (APAR & CO2 System) dalam tekanan normal?',
      'Apakah latihan abandone ship dan fire drill dicatat dalam logbook kapal?'
    ]
  },
  {
    code: 'SMC-NAV',
    name: 'Navigasi, Radio & Komunikasi Kapal',
    description: 'Kelaikan Radar, GPS, AIS, Echo Sounder, Radio VHF/MF, EPIRB, SART, dan peta laut terkoreksi (Notices to Mariners).',
    applicableTo: 'SMC',
    checkPoints: [
      'Apakah alat navigasi elektronik berfungsi normal tanpa alarm kegagalan?',
      'Apakah baterai EPIRB dan SART masih dalam masa aktif?'
    ]
  },
  {
    code: 'SMC-CREW',
    name: 'Kondisi Kerja, Akomodasi & Kesehatan Awak Kapal',
    description: 'Kelaikan kotak P3K (Medicine Chest), sertifikat sanitasi kapal (SSCEC), kebersihan dapur/makanan, dan jam istirahat kru (MLC 2006).',
    applicableTo: 'SMC',
    checkPoints: [
      'Apakah Buku Kesehatan Kapal dan SSCEC terbitan Balai Karantina Kesehatan masih berlaku?',
      'Apakah jam kerja dan istirahat awak kapal memenuhi konvensi maritim?'
    ]
  }
];

// Seed Data Audit Realistis PT. Pelayaran Baharimas Kalimantan
export const INITIAL_AUDITS = [
  {
    id: 'aud-doc-001',
    auditNo: 'AUD-INT-DOC-2026/01',
    auditType: 'Internal',
    standard: 'DOC',
    targetType: 'Office',
    targetName: 'Kantor Pusat PT. Pelayaran Baharimas Kalimantan (Samarinda)',
    vesselId: null,
    leadAuditor: 'Capt. Bambang Suryono (Lead Auditor Internal ISM)',
    auditTeam: ['Ir. Heri Prasetyo (Marine Superintendent)', 'Dian Anggraini (Safety Officer)'],
    auditee: 'Direktur Operasional & Seluruh Manager Darat (DPA, Logistik, HRD, Teknik)',
    auditDate: '2026-08-15',
    targetCloseDate: '2026-09-30',
    scope: 'Audit Internal Tahunan Sistem Manajemen Keselamatan Kantor Pusat mencakup Elemen ISM 1 sampai 12.',
    status: 'In Progress', // 'Scheduled' | 'In Progress' | 'Completed'
    totalItemsChecked: 24,
    itemsComplied: 21,
    findingsSummary: {
      majorNC: 0,
      minorNC: 2,
      observation: 1,
      totalOpen: 1,
      totalClosed: 2
    }
  },
  {
    id: 'aud-smc-001',
    auditNo: 'AUD-EXT-SMC-BKI-2026/04',
    auditType: 'External',
    standard: 'SMC',
    targetType: 'Vessel',
    targetName: 'RP 2020',
    vesselId: 'v-001',
    leadAuditor: 'Surveyor BKI Cabang Samarinda (Auditor Eksternal ISM Hubla)',
    auditTeam: ['Marine Inspector KSOP Samarinda'],
    auditee: 'Capt. Hendra Gunawan, M.Mar & Ir. Bambang Wijaya (KKM RP 2020)',
    auditDate: '2026-07-20',
    targetCloseDate: '2026-09-10',
    scope: 'Audit Eksternal Antara (Intermediate Audit) Safety Management Certificate (SMC) di atas kapal RP 2020.',
    status: 'Completed',
    totalItemsChecked: 32,
    itemsComplied: 30,
    findingsSummary: {
      majorNC: 0,
      minorNC: 1,
      observation: 1,
      totalOpen: 0,
      totalClosed: 2
    }
  },
  {
    id: 'aud-smc-002',
    auditNo: 'AUD-INT-SMC-2026/08',
    auditType: 'Internal',
    standard: 'SMC',
    targetType: 'Vessel',
    targetName: 'KP. MARIANA',
    vesselId: 'v-003',
    leadAuditor: 'DPA PT. Pelayaran Baharimas Kalimantan',
    auditTeam: ['Staff Teknis Perkapalan PBK'],
    auditee: 'Capt. Heru Setiawan & KKM KP. Mariana',
    auditDate: '2026-09-05',
    targetCloseDate: '2026-10-05',
    scope: 'Audit Internal SMC Tahunan Penerapan Prosedur PMS, Alat Keselamatan, dan Kesiapan Awak Kapal.',
    status: 'In Progress',
    totalItemsChecked: 28,
    itemsComplied: 25,
    findingsSummary: {
      majorNC: 0,
      minorNC: 2,
      observation: 1,
      totalOpen: 2,
      totalClosed: 1
    }
  },
  {
    id: 'aud-doc-002',
    auditNo: 'AUD-EXT-DOC-HUBLA-2026/02',
    auditType: 'External',
    standard: 'DOC',
    targetType: 'Office',
    targetName: 'Kantor Pusat PT. Pelayaran Baharimas Kalimantan (Samarinda)',
    vesselId: null,
    leadAuditor: 'Auditor Ditjen Perhubungan Laut RI (Subdit ISM Code)',
    auditTeam: ['Auditor BKI Pusat Jakarta'],
    auditee: 'Direktur Utama & DPA PT. Pelayaran Baharimas Kalimantan',
    auditDate: '2026-05-12',
    targetCloseDate: '2026-06-25',
    scope: 'Survei Pembaruan / Renewal Audit Dokumen Kepatuhan Perusahaan (DOC) Ditjen Hubla.',
    status: 'Completed',
    totalItemsChecked: 36,
    itemsComplied: 35,
    findingsSummary: {
      majorNC: 0,
      minorNC: 1,
      observation: 0,
      totalOpen: 0,
      totalClosed: 1
    }
  },
  {
    id: 'aud-smc-003',
    auditNo: 'AUD-INT-SMC-2026/02',
    auditType: 'Internal',
    standard: 'SMC',
    targetType: 'Vessel',
    targetName: 'RP 2026',
    vesselId: 'v-002',
    leadAuditor: 'Capt. Bambang Suryono, M.Mar',
    auditTeam: ['Dimas Wicaksono (Fleet Supt)'],
    auditee: 'Capt. Agus Supriyadi & Rahmat Santoso (KKM RP 2026)',
    auditDate: '2026-08-28',
    targetCloseDate: '2026-09-28',
    scope: 'Audit Kepatuhan Operasional Navigasi & Kamar Mesin TB RP 2026',
    status: 'In Progress',
    totalItemsChecked: 30,
    itemsComplied: 28,
    findingsSummary: {
      majorNC: 0,
      minorNC: 1,
      observation: 1,
      totalOpen: 1,
      totalClosed: 0
    }
  },
  {
    id: 'aud-smc-004',
    auditNo: 'AUD-INT-SMC-2026/04',
    auditType: 'Internal',
    standard: 'SMC',
    targetType: 'Vessel',
    targetName: 'KP. PARIT TOKAYA',
    vesselId: 'v-004',
    leadAuditor: 'DPA PT. PBK Samarinda',
    auditTeam: ['Tim Inspeksi Galangan'],
    auditee: 'Capt. Budi Raharjo & Zainal Abidin (KKM)',
    auditDate: '2026-09-02',
    targetCloseDate: '2026-10-02',
    scope: 'Audit Periodik Docking & Safety Equipment KP. Parit Tokaya',
    status: 'In Progress',
    totalItemsChecked: 28,
    itemsComplied: 26,
    findingsSummary: {
      majorNC: 0,
      minorNC: 1,
      observation: 1,
      totalOpen: 1,
      totalClosed: 0
    }
  },
  {
    id: 'aud-smc-005',
    auditNo: 'AUD-EXT-SMC-BKI-2026/05',
    auditType: 'External',
    standard: 'SMC',
    targetType: 'Vessel',
    targetName: 'KP. KUMAI',
    vesselId: 'v-005',
    leadAuditor: 'Surveyor Senior BKI Cabang Banjarmasin',
    auditTeam: ['Marine Inspector KSOP Kumai'],
    auditee: 'Capt. Fajar Kurniawan & Didik Hermawan (KKM)',
    auditDate: '2026-09-12',
    targetCloseDate: '2026-10-12',
    scope: 'Survei Berkala Safety Management Certificate (SMC) KP. Kumai',
    status: 'In Progress',
    totalItemsChecked: 32,
    itemsComplied: 27,
    findingsSummary: {
      majorNC: 1,
      minorNC: 1,
      observation: 1,
      totalOpen: 2,
      totalClosed: 0
    }
  },
  {
    id: 'aud-smc-006',
    auditNo: 'AUD-INT-SMC-2026/06',
    auditType: 'Internal',
    standard: 'SMC',
    targetType: 'Vessel',
    targetName: 'DESA KAPUR',
    vesselId: 'v-006',
    leadAuditor: 'Capt. Ahmad Fauzi (Marine Safety PBK)',
    auditTeam: ['Tim Safety Inspector'],
    auditee: 'Syamsul Arifin (Barge Master) & Anton Sujarwo',
    auditDate: '2026-07-15',
    targetCloseDate: '2026-08-15',
    scope: 'Inspeksi Kelaikan Towing Gear & Alat Keselamatan Tongkang DESA KAPUR',
    status: 'Completed',
    totalItemsChecked: 22,
    itemsComplied: 22,
    findingsSummary: {
      majorNC: 0,
      minorNC: 0,
      observation: 0,
      totalOpen: 0,
      totalClosed: 1
    }
  }
];

// Seed Data Temuan Audit (Non-Conformity & Observation)
export const INITIAL_AUDIT_FINDINGS = [
  {
    id: 'nc-001',
    auditId: 'aud-doc-001',
    auditNo: 'AUD-INT-DOC-2026/01',
    findingNo: 'NC-DOC-01/2026',
    auditType: 'Internal',
    standard: 'DOC',
    targetName: 'Kantor Pusat Samarinda (Dept. Logistik & Gudang)',
    vesselId: null,
    clauseCode: 'ISM-10',
    clauseName: 'Pemeliharaan Kapal & Suku Cadang Kritis',
    category: 'Minor NC', // 'Major NC' | 'Minor NC' | 'Observation'
    status: 'NC Open', // 'NC Open' | 'Eviden Submitted' | 'NC Close'
    description: 'Catatan stok pengaman suku cadang kritis injector main engine di gudang pusat berada di bawah ambang batas minimum dan belum dilakukan pemesanan ulang terjadwal.',
    objectiveEvidence: 'Ditemukan stok injector Yanmar 6EY17W tersisa 1 unit di sistem, sedangkan standar minimum SMS adalah 4 unit.',
    dateIdentified: '2026-08-15',
    dueDate: '2026-09-25',
    assignedTo: 'Kepala Gudang & Purchasing Darat',
    auditor: 'Capt. Bambang Suryono',
    // Linked Requisitions / Permintaan Barang
    linkedRequisitionId: 'WO-REQ-002',
    linkedRequisitionTitle: 'Pengadaan Sparepart Rutin Deck & Mesin TB. Baharimas 08',
    // Linked Certificate (if applicable)
    linkedCertificateId: null,
    // Evidence submission
    evidence: {
      hasSubmitted: true,
      submissionDate: '2026-09-18',
      submittedBy: 'Ahmad Fauzi (Supervisor Gudang)',
      rootCause: 'Keterlambatan lead time import suku cadang injector dari distributor resmi Yanmar Surabaya.',
      correctiveAction: 'Telah diajukan SPB darurat WO-REQ-002 ke gudang pusat dan diterbitkan purchase order untuk 6 unit injector.',
      preventiveAction: 'Memperbarui reorder point di sistem PMS menjadi 5 unit dan menetapkan buffer stock 30 hari.',
      fileUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="#f8fafc"/><rect x="20" y="20" width="560" height="360" fill="none" stroke="#0284c7" stroke-width="2"/><text x="300" y="60" font-family="Arial" font-size="16" font-weight="bold" fill="#0369a1" text-anchor="middle">BUKTI EVIDEN TINDAKAN KOREKTIF (CAP)</text><text x="300" y="90" font-family="Arial" font-size="12" fill="#64748b" text-anchor="middle">PO Pembelian Suku Cadang Kritis Injector Yanmar</text><line x1="50" y1="110" x2="550" y2="110" stroke="#cbd5e1"/><text x="60" y="150" font-family="Arial" font-size="12" fill="#0f172a">Nomor SPB: WO-REQ-002</text><text x="60" y="180" font-family="Arial" font-size="12" fill="#0f172a">Vendor: PT. Yanmar Diesel Indonesia</text><text x="60" y="210" font-family="Arial" font-size="12" fill="#0f172a">Status Pengiriman: On Delivery ke Samarinda</text><text x="300" y="320" font-family="Arial" font-size="12" font-weight="bold" fill="#10b981" text-anchor="middle">EVIDEN RESMI TERSIMPAN DI SISTEM CLOUD PMS</text></svg>`),
      fileName: 'Eviden_PO_Injector_Yanmar.svg',
      fileSize: '1.1 MB',
      auditorReviewNotes: 'Eviden sedang ditinjau oleh Lead Auditor. Menunggu barang fisik tiba di gudang sebelum status NC diubah ke Close.',
      closedDate: null
    }
  },
  {
    id: 'nc-002',
    auditId: 'aud-smc-002',
    auditNo: 'AUD-INT-SMC-2026/08',
    findingNo: 'NC-SMC-01/2026',
    auditType: 'Internal',
    standard: 'SMC',
    targetName: 'KP. MARIANA',
    vesselId: 'v-003',
    clauseCode: 'SMC-CERT',
    clauseName: 'Sertifikasi Statutori & Kelaikan Kapal',
    category: 'Minor NC',
    status: 'NC Open',
    description: 'Sertifikat servis keselamatan tabung pemadam api (PMK) dan Inflatable Life Raft (ILR) kapal mendekati masa jatuh tempo (H-15) namun belum ada laporan pengajuan jadwal servis dari kapal.',
    objectiveEvidence: 'Sertifikat servis PMK nomor PMK-SRV-20481 akan expired dalam waktu dekat.',
    dateIdentified: '2026-09-05',
    dueDate: '2026-09-28',
    assignedTo: 'Nakhoda & Chief Officer KP. Mariana',
    auditor: 'DPA PT. PBK',
    linkedRequisitionId: null,
    linkedCertificateId: 'doc-s-003-ilr',
    evidence: {
      hasSubmitted: false,
      submissionDate: null,
      submittedBy: null,
      rootCause: null,
      correctiveAction: null,
      preventiveAction: null,
      fileUrl: null,
      fileName: null,
      fileSize: null,
      auditorReviewNotes: null,
      closedDate: null
    }
  },
  {
    id: 'nc-003',
    auditId: 'aud-smc-001',
    auditNo: 'AUD-EXT-SMC-BKI-2026/04',
    findingNo: 'NC-SMC-BKI-01/2026',
    auditType: 'External',
    standard: 'SMC',
    targetName: 'RP 2020',
    vesselId: 'v-001',
    clauseCode: 'SMC-PMS',
    clauseName: 'Penerapan PMS Mesin & Logbook',
    category: 'Minor NC',
    status: 'NC Close',
    description: 'Catatan running hours pompa bilga darurat (emergency bilge pump) belum tercatat terpisah pada buku jurnal harian kamar mesin.',
    objectiveEvidence: 'Logbook kamar mesin per 15 Juli 2026 tidak mencantumkan running hours spesifik pengetesan pompa bilga darurat.',
    dateIdentified: '2026-07-20',
    dueDate: '2026-08-20',
    assignedTo: 'KKM Ir. Bambang Wijaya (RP 2020)',
    auditor: 'Surveyor BKI Cabang Samarinda',
    linkedRequisitionId: null,
    linkedCertificateId: null,
    evidence: {
      hasSubmitted: true,
      submissionDate: '2026-08-10',
      submittedBy: 'Ir. Bambang Wijaya (KKM)',
      rootCause: 'Format logbook lama belum memiliki kolom terpisah untuk jam running test emergency bilge pump.',
      correctiveAction: 'Telah dibuat lembar logbook terstandarisasi PMS baru dan dilakukan pengujian fisik pompa bilga disaksikan Masinis II.',
      preventiveAction: 'SOP pengujian mingguan pompa darurat ditempel di ruang kontrol mesin (ECR) dan dicatat tiap hari Senin.',
      fileUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="#f8fafc"/><rect x="20" y="20" width="560" height="360" fill="none" stroke="#10b981" stroke-width="2"/><text x="300" y="60" font-family="Arial" font-size="16" font-weight="bold" fill="#047857" text-anchor="middle">BUKTI VERIFIKASI PERBAIKAN (NC CLOSED)</text><text x="300" y="90" font-family="Arial" font-size="12" fill="#64748b" text-anchor="middle">Dokumentasi Logbook Uji Pompa Bilga Darurat RP 2020</text><line x1="50" y1="110" x2="550" y2="110" stroke="#cbd5e1"/><text x="60" y="150" font-family="Arial" font-size="12" fill="#0f172a">Kapal: TB. RP 2020</text><text x="60" y="180" font-family="Arial" font-size="12" fill="#0f172a">Tgl Verifikasi: 14 Agustus 2026</text><text x="60" y="210" font-family="Arial" font-size="12" fill="#0f172a">Status Auditor BKI: NC Resmi Ditutup (CLOSED)</text><circle cx="480" cy="270" r="45" fill="none" stroke="#10b981" stroke-width="3"/><text x="480" y="265" font-family="Arial" font-size="11" font-weight="bold" fill="#10b981" text-anchor="middle">VERIFIED</text><text x="480" y="280" font-family="Arial" font-size="10" font-weight="bold" fill="#10b981" text-anchor="middle">BKI AUDIT</text></svg>`),
      fileName: 'Eviden_Closing_Pompa_Bilga_RP2020.svg',
      fileSize: '950 KB',
      auditorReviewNotes: 'Verifikasi fisik dan logbook baru telah sesuai persyaratan ISM Code 10.3. Temuan resmi DITUTUP (CLOSED).',
      closedDate: '2026-08-14'
    }
  },
  {
    id: 'nc-004',
    auditId: 'aud-doc-002',
    auditNo: 'AUD-EXT-DOC-HUBLA-2026/02',
    findingNo: 'NC-EXT-DOC-01/2026',
    auditType: 'External',
    standard: 'DOC',
    targetName: 'Kantor Pusat PT. PBK (Divisi HRD & Crewing)',
    vesselId: null,
    clauseCode: 'ISM-6',
    clauseName: 'Sumber Daya & Personil (Awak Kapal)',
    category: 'Minor NC',
    status: 'NC Close',
    description: 'Catatan sertifikat Basic Safety Training (BST) untuk 2 orang juru mudi kapal cadangan belum diperbarui dalam database digital darat.',
    objectiveEvidence: 'Database crewing belum memuat scan terbaru pembaruan BST yang telah terbit.',
    dateIdentified: '2026-05-12',
    dueDate: '2026-06-12',
    assignedTo: 'Crewing Manager PT. PBK',
    auditor: 'Auditor Ditjen Perhubungan Laut RI',
    linkedRequisitionId: null,
    linkedCertificateId: null,
    evidence: {
      hasSubmitted: true,
      submissionDate: '2026-05-28',
      submittedBy: 'Crewing Manager',
      rootCause: 'Keterlambatan kru menyerahkan scan berkas fisik setelah revalidasi di balai diklat perhubungan.',
      correctiveAction: 'Kedua sertifikat BST telah diverifikasi online di portal Ditjen Hubla dan diunggah ke PMS Cloud.',
      preventiveAction: 'Diterapkan sistem otomatis notifikasi H-60 revalidasi sertifikat awak kapal.',
      fileUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="#f8fafc"/><rect x="20" y="20" width="560" height="360" fill="none" stroke="#10b981" stroke-width="2"/><text x="300" y="60" font-family="Arial" font-size="16" font-weight="bold" fill="#047857" text-anchor="middle">BUKTI PEMBARUAN BST CREW (NC CLOSED)</text><text x="300" y="90" font-family="Arial" font-size="12" fill="#64748b" text-anchor="middle">Verifikasi Portal Pelaut Dephub</text><circle cx="480" cy="270" r="45" fill="none" stroke="#10b981" stroke-width="3"/><text x="480" y="275" font-family="Arial" font-size="11" font-weight="bold" fill="#10b981" text-anchor="middle">CLOSED</text></svg>`),
      fileName: 'Eviden_Revalidasi_BST_Dephub.svg',
      fileSize: '820 KB',
      auditorReviewNotes: 'Dokumen revalidasi terverifikasi sah. Sertifikat DOC diperpanjang resmi.',
      closedDate: '2026-06-02'
    }
  },
  {
    id: 'nc-005',
    auditId: 'aud-smc-003',
    auditNo: 'AUD-INT-SMC-2026/02',
    findingNo: 'NC-SMC-02/2026',
    auditType: 'Internal',
    standard: 'SMC',
    targetName: 'RP 2026',
    vesselId: 'v-002',
    clauseCode: 'SMC-EMERG',
    clauseName: 'Kesiapan Tanggap Darurat & Emergency Steering',
    category: 'Minor NC',
    status: 'NC Open',
    description: 'Pengecekan kemudi darurat (Emergency Steering Gear drill) pada kuartal berjalan belum tercatat dalam logbook resmi anjungan.',
    objectiveEvidence: 'Logbook anjungan tidak mencatat tanggal pengujian kemudi darurat selama 45 hari terakhir.',
    dateIdentified: '2026-08-28',
    dueDate: '2026-09-28',
    assignedTo: 'Capt. Agus Supriyadi (Nakhoda)',
    auditor: 'Capt. Bambang Suryono',
    linkedRequisitionId: null,
    linkedCertificateId: null,
    evidence: {
      hasSubmitted: false
    }
  },
  {
    id: 'nc-006',
    auditId: 'aud-smc-004',
    auditNo: 'AUD-INT-SMC-2026/04',
    findingNo: 'NC-SMC-03/2026',
    auditType: 'Internal',
    standard: 'SMC',
    targetName: 'KP. PARIT TOKAYA',
    vesselId: 'v-004',
    clauseCode: 'SMC-HULL',
    clauseName: 'Kondisi Lambung & Sea Chest Valves',
    category: 'Minor NC',
    status: 'Eviden Submitted',
    description: 'Katup laut (sea chest valve) pompa pendingin utama memerlukan pembersihan dan uji kedap air saat naik dok.',
    objectiveEvidence: 'Hasil inspeksi visual menunjukkan kerak tiram pada kisi-kisi saringan laut.',
    dateIdentified: '2026-09-02',
    dueDate: '2026-10-02',
    assignedTo: 'Zainal Abidin (KKM)',
    auditor: 'DPA PT. PBK Samarinda',
    linkedRequisitionId: null,
    linkedCertificateId: null,
    evidence: {
      hasSubmitted: true,
      submissionDate: '2026-09-15',
      submittedBy: 'Zainal Abidin (KKM)',
      rootCause: 'Akumulasi biota laut selama operasional di perairan estuari.',
      correctiveAction: 'Telah dilakukan scrapping, hydrotesting, dan penggantian gasket sea chest valve di galangan dok.',
      preventiveAction: 'Pemasangan sacrificial zinc anode baru pada kotak sea chest.',
      fileName: 'Eviden_Overhaul_SeaChest_ParitTokaya.pdf',
      fileSize: '1.4 MB',
      fileUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=600&q=80',
      auditorReviewNotes: 'Eviden telah diterima dan sedang menunggu peninjauan fisik akhir oleh DPA sebelum penutupan status.'
    }
  },
  {
    id: 'nc-007',
    auditId: 'aud-smc-005',
    auditNo: 'AUD-EXT-SMC-BKI-2026/05',
    findingNo: 'NC-EXT-SMC-01/2026',
    auditType: 'External',
    standard: 'SMC',
    targetName: 'KP. KUMAI',
    vesselId: 'v-005',
    clauseCode: 'SMC-CERT',
    clauseName: 'Sertifikasi Statutori & Kelaikan Kapal',
    category: 'Major NC',
    status: 'NC Open',
    description: 'Sertifikat Keselamatan Radio Kapal Barang (Cargo Ship Safety Radio Certificate) mendekati masa tenggang dan belum dilakukan survei tahunan oleh Radio Surveyor yang berwenang.',
    objectiveEvidence: 'Sertifikat radio kapal nomor SR-KM-91823 jatuh tempo dalam waktu kurang dari 7 hari.',
    dateIdentified: '2026-09-12',
    dueDate: '2026-09-22',
    assignedTo: 'Capt. Fajar Kurniawan (Nakhoda)',
    auditor: 'Surveyor Senior BKI Banjarmasin',
    linkedRequisitionId: null,
    linkedCertificateId: null,
    evidence: {
      hasSubmitted: false
    }
  },
  {
    id: 'nc-008',
    auditId: 'aud-smc-005',
    auditNo: 'AUD-EXT-SMC-BKI-2026/05',
    findingNo: 'NC-EXT-SMC-02/2026',
    auditType: 'External',
    standard: 'SMC',
    targetName: 'KP. KUMAI',
    vesselId: 'v-005',
    clauseCode: 'SMC-NAV',
    clauseName: 'Peralatan Navigasi & Sinyal',
    category: 'Minor NC',
    status: 'NC Open',
    description: 'Bohlam cadangan lampu navigasi tiang agung (Masthead Light) belum tersedia di lemari penyimpanan anjungan.',
    objectiveEvidence: 'Hanya tersedia 1 unit bohlam cadangan dari ketentuan minimal 2 unit.',
    dateIdentified: '2026-09-12',
    dueDate: '2026-09-27',
    assignedTo: 'Mualim 1 (Chief Officer)',
    auditor: 'Surveyor Senior BKI Banjarmasin',
    linkedRequisitionId: null,
    linkedCertificateId: null,
    evidence: {
      hasSubmitted: false
    }
  },
  {
    id: 'nc-009',
    auditId: 'aud-smc-006',
    auditNo: 'AUD-INT-SMC-2026/06',
    findingNo: 'NC-SMC-04/2026',
    auditType: 'Internal',
    standard: 'SMC',
    targetName: 'DESA KAPUR',
    vesselId: 'v-006',
    clauseCode: 'SMC-DECK',
    clauseName: 'Peralatan Tambat & Towing Gear',
    category: 'Minor NC',
    status: 'NC Close',
    description: 'Bollard dan fairlead pada haluan tongkang menunjukkan indikasi korosi permukaan yang perlu pembersihan dan pengecatan pelindung.',
    objectiveEvidence: 'Ketebalan cat pelindung pada bollard nomor 1 dan 2 telah menipis.',
    dateIdentified: '2026-07-15',
    dueDate: '2026-08-15',
    assignedTo: 'Syamsul Arifin (Barge Master)',
    auditor: 'Capt. Ahmad Fauzi',
    linkedRequisitionId: null,
    linkedCertificateId: null,
    evidence: {
      hasSubmitted: true,
      submissionDate: '2026-08-05',
      submittedBy: 'Syamsul Arifin',
      rootCause: 'Gesekan tali kawat baja saat manuver penambatan tongkang.',
      correctiveAction: 'Telah dilakukan wire-brushing, pelapisan primer anti-karat, dan pengecatan 2 lapis marine paint.',
      preventiveAction: 'Pemasangan kanvas pelindung (chafing guard) pada tali tambat.',
      fileName: 'Eviden_Pengecatan_Bollard_DesaKapur.jpg',
      fileSize: '890 KB',
      auditorReviewNotes: 'Hasil rekondisi bollard telah diverifikasi dan memenuhi standar SMS. NC DITUTUP.',
      closedDate: '2026-08-10'
    }
  }
];
