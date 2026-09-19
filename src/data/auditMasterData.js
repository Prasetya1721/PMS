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
    "id": "aud-doc-001",
    "auditNo": "AUD-INT-DOC-2026/01",
    "auditType": "Internal",
    "standard": "DOC",
    "targetType": "Office",
    "targetName": "Kantor Pusat PT. Pelayaran Baharimas Kalimantan (Pontianak)",
    "vesselId": null,
    "leadAuditor": "Capt. Bambang Suryono (Lead Auditor Internal ISM)",
    "auditTeam": [
      "Ir. Heri Prasetyo (Marine Superintendent)",
      "Dian Anggraini (Safety Officer)"
    ],
    "auditee": "Direktur Operasional & Seluruh Manager Darat (DPA, Logistik, HRD, Teknik)",
    "auditDate": "2026-08-15",
    "targetCloseDate": "2026-09-30",
    "scope": "Audit Internal Tahunan Sistem Manajemen Keselamatan Kantor Pusat mencakup Elemen ISM 1 sampai 12.",
    "status": "In Progress",
    "totalItemsChecked": 24,
    "itemsComplied": 21,
    "findingsSummary": {
      "majorNC": 0,
      "minorNC": 2,
      "observation": 1,
      "totalOpen": 1,
      "totalClosed": 2
    }
  },
  {
    "id": "aud-smc-001",
    "auditNo": "AUD-EXT-SMC-BKI-2026/04",
    "auditType": "External",
    "standard": "SMC",
    "targetType": "Vessel",
    "targetName": "RP 2020",
    "vesselId": "v-001",
    "leadAuditor": "Surveyor BKI Cabang Pontianak (Auditor Eksternal ISM Hubla)",
    "auditTeam": [
      "Marine Inspector KSOP Pontianak"
    ],
    "auditee": "Capt. Hendra Gunawan, M.Mar & Ir. Bambang Wijaya (KKM RP 2020)",
    "auditDate": "2026-07-20",
    "targetCloseDate": "2026-09-10",
    "scope": "Audit Eksternal Antara (Intermediate Audit) Safety Management Certificate (SMC) di atas kapal RP 2020.",
    "status": "Completed",
    "totalItemsChecked": 32,
    "itemsComplied": 30,
    "findingsSummary": {
      "majorNC": 0,
      "minorNC": 1,
      "observation": 1,
      "totalOpen": 0,
      "totalClosed": 2
    }
  },
  {
    "id": "aud-doc-002",
    "auditNo": "AUD-EXT-DOC-HUBLA-2026/02",
    "auditType": "External",
    "standard": "DOC",
    "targetType": "Office",
    "targetName": "Kantor Pusat PT. Pelayaran Baharimas Kalimantan (Pontianak)",
    "vesselId": null,
    "leadAuditor": "Auditor Ditjen Perhubungan Laut RI (Subdit ISM Code)",
    "auditTeam": [
      "Auditor BKI Pusat Jakarta"
    ],
    "auditee": "Direktur Utama & DPA PT. Pelayaran Baharimas Kalimantan",
    "auditDate": "2026-05-12",
    "targetCloseDate": "2026-06-25",
    "scope": "Survei Pembaruan / Renewal Audit Dokumen Kepatuhan Perusahaan (DOC) Ditjen Hubla.",
    "status": "Completed",
    "totalItemsChecked": 36,
    "itemsComplied": 35,
    "findingsSummary": {
      "majorNC": 0,
      "minorNC": 1,
      "observation": 0,
      "totalOpen": 0,
      "totalClosed": 1
    }
  }
];

export const INITIAL_AUDIT_FINDINGS = [
  {
    "id": "nc-001",
    "auditId": "aud-doc-001",
    "auditNo": "AUD-INT-DOC-2026/01",
    "findingNo": "NC-DOC-01/2026",
    "auditType": "Internal",
    "standard": "DOC",
    "targetName": "Kantor Pusat Pontianak (Dept. Logistik & Gudang)",
    "vesselId": null,
    "clauseCode": "ISM-10",
    "clauseName": "Pemeliharaan Kapal & Suku Cadang Kritis",
    "category": "Minor NC",
    "status": "NC Open",
    "description": "Catatan stok pengaman suku cadang kritis injector main engine di gudang pusat berada di bawah ambang batas minimum dan belum dilakukan pemesanan ulang terjadwal.",
    "objectiveEvidence": "Ditemukan stok injector Yanmar 6EY17W tersisa 1 unit di sistem, sedangkan standar minimum SMS adalah 4 unit.",
    "dateIdentified": "2026-08-15",
    "dueDate": "2026-09-25",
    "assignedTo": "Kepala Gudang & Purchasing Darat",
    "auditor": "Capt. Bambang Suryono",
    "linkedRequisitionId": "WO-REQ-002",
    "linkedRequisitionTitle": "Pengadaan Sparepart Rutin Deck & Mesin TB. Baharimas 08",
    "linkedCertificateId": null,
    "evidence": {
      "hasSubmitted": true,
      "submissionDate": "2026-09-18",
      "submittedBy": "Ahmad Fauzi (Supervisor Gudang)",
      "rootCause": "Keterlambatan lead time import suku cadang injector dari distributor resmi Yanmar Surabaya.",
      "correctiveAction": "Telah diajukan SPB darurat WO-REQ-002 ke gudang pusat dan diterbitkan purchase order untuk 6 unit injector.",
      "preventiveAction": "Memperbarui reorder point di sistem PMS menjadi 5 unit dan menetapkan buffer stock 30 hari.",
      "fileUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22400%22%20viewBox%3D%220%200%20600%20400%22%3E%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22%23f8fafc%22%2F%3E%3Crect%20x%3D%2220%22%20y%3D%2220%22%20width%3D%22560%22%20height%3D%22360%22%20fill%3D%22none%22%20stroke%3D%22%230284c7%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%22300%22%20y%3D%2260%22%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-weight%3D%22bold%22%20fill%3D%22%230369a1%22%20text-anchor%3D%22middle%22%3EBUKTI%20EVIDEN%20TINDAKAN%20KOREKTIF%20(CAP)%3C%2Ftext%3E%3Ctext%20x%3D%22300%22%20y%3D%2290%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%2364748b%22%20text-anchor%3D%22middle%22%3EPO%20Pembelian%20Suku%20Cadang%20Kritis%20Injector%20Yanmar%3C%2Ftext%3E%3Cline%20x1%3D%2250%22%20y1%3D%22110%22%20x2%3D%22550%22%20y2%3D%22110%22%20stroke%3D%22%23cbd5e1%22%2F%3E%3Ctext%20x%3D%2260%22%20y%3D%22150%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3ENomor%20SPB%3A%20WO-REQ-002%3C%2Ftext%3E%3Ctext%20x%3D%2260%22%20y%3D%22180%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3EVendor%3A%20PT.%20Yanmar%20Diesel%20Indonesia%3C%2Ftext%3E%3Ctext%20x%3D%2260%22%20y%3D%22210%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3EStatus%20Pengiriman%3A%20On%20Delivery%20ke%20Pontianak%3C%2Ftext%3E%3Ctext%20x%3D%22300%22%20y%3D%22320%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20font-weight%3D%22bold%22%20fill%3D%22%2310b981%22%20text-anchor%3D%22middle%22%3EEVIDEN%20RESMI%20TERSIMPAN%20DI%20SISTEM%20CLOUD%20PMS%3C%2Ftext%3E%3C%2Fsvg%3E",
      "fileName": "Eviden_PO_Injector_Yanmar.svg",
      "fileSize": "1.1 MB",
      "auditorReviewNotes": "Eviden sedang ditinjau oleh Lead Auditor. Menunggu barang fisik tiba di gudang sebelum status NC diubah ke Close.",
      "closedDate": null
    }
  },
  {
    "id": "nc-003",
    "auditId": "aud-smc-001",
    "auditNo": "AUD-EXT-SMC-BKI-2026/04",
    "findingNo": "NC-SMC-BKI-01/2026",
    "auditType": "External",
    "standard": "SMC",
    "targetName": "RP 2020",
    "vesselId": "v-001",
    "clauseCode": "SMC-PMS",
    "clauseName": "Penerapan PMS Mesin & Logbook",
    "category": "Minor NC",
    "status": "NC Close",
    "description": "Catatan running hours pompa bilga darurat (emergency bilge pump) belum tercatat terpisah pada buku jurnal harian kamar mesin.",
    "objectiveEvidence": "Logbook kamar mesin per 15 Juli 2026 tidak mencantumkan running hours spesifik pengetesan pompa bilga darurat.",
    "dateIdentified": "2026-07-20",
    "dueDate": "2026-08-20",
    "assignedTo": "KKM Ir. Bambang Wijaya (RP 2020)",
    "auditor": "Surveyor BKI Cabang Pontianak",
    "linkedRequisitionId": null,
    "linkedCertificateId": null,
    "evidence": {
      "hasSubmitted": true,
      "submissionDate": "2026-08-10",
      "submittedBy": "Ir. Bambang Wijaya (KKM)",
      "rootCause": "Format logbook lama belum memiliki kolom terpisah untuk jam running test emergency bilge pump.",
      "correctiveAction": "Telah dibuat lembar logbook terstandarisasi PMS baru dan dilakukan pengujian fisik pompa bilga disaksikan Masinis II.",
      "preventiveAction": "SOP pengujian mingguan pompa darurat ditempel di ruang kontrol mesin (ECR) dan dicatat tiap hari Senin.",
      "fileUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22400%22%20viewBox%3D%220%200%20600%20400%22%3E%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22%23f8fafc%22%2F%3E%3Crect%20x%3D%2220%22%20y%3D%2220%22%20width%3D%22560%22%20height%3D%22360%22%20fill%3D%22none%22%20stroke%3D%22%2310b981%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%22300%22%20y%3D%2260%22%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-weight%3D%22bold%22%20fill%3D%22%23047857%22%20text-anchor%3D%22middle%22%3EBUKTI%20VERIFIKASI%20PERBAIKAN%20(NC%20CLOSED)%3C%2Ftext%3E%3Ctext%20x%3D%22300%22%20y%3D%2290%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%2364748b%22%20text-anchor%3D%22middle%22%3EDokumentasi%20Logbook%20Uji%20Pompa%20Bilga%20Darurat%20RP%202020%3C%2Ftext%3E%3Cline%20x1%3D%2250%22%20y1%3D%22110%22%20x2%3D%22550%22%20y2%3D%22110%22%20stroke%3D%22%23cbd5e1%22%2F%3E%3Ctext%20x%3D%2260%22%20y%3D%22150%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3EKapal%3A%20TB.%20RP%202020%3C%2Ftext%3E%3Ctext%20x%3D%2260%22%20y%3D%22180%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3ETgl%20Verifikasi%3A%2014%20Agustus%202026%3C%2Ftext%3E%3Ctext%20x%3D%2260%22%20y%3D%22210%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3EStatus%20Auditor%20BKI%3A%20NC%20Resmi%20Ditutup%20(CLOSED)%3C%2Ftext%3E%3Ccircle%20cx%3D%22480%22%20cy%3D%22270%22%20r%3D%2245%22%20fill%3D%22none%22%20stroke%3D%22%2310b981%22%20stroke-width%3D%223%22%2F%3E%3Ctext%20x%3D%22480%22%20y%3D%22265%22%20font-family%3D%22Arial%22%20font-size%3D%2211%22%20font-weight%3D%22bold%22%20fill%3D%22%2310b981%22%20text-anchor%3D%22middle%22%3EVERIFIED%3C%2Ftext%3E%3Ctext%20x%3D%22480%22%20y%3D%22280%22%20font-family%3D%22Arial%22%20font-size%3D%2210%22%20font-weight%3D%22bold%22%20fill%3D%22%2310b981%22%20text-anchor%3D%22middle%22%3EBKI%20AUDIT%3C%2Ftext%3E%3C%2Fsvg%3E",
      "fileName": "Eviden_Closing_Pompa_Bilga_RP2020.svg",
      "fileSize": "950 KB",
      "auditorReviewNotes": "Verifikasi fisik dan logbook baru telah sesuai persyaratan ISM Code 10.3. Temuan resmi DITUTUP (CLOSED).",
      "closedDate": "2026-08-14"
    }
  },
  {
    "id": "nc-004",
    "auditId": "aud-doc-002",
    "auditNo": "AUD-EXT-DOC-HUBLA-2026/02",
    "findingNo": "NC-EXT-DOC-01/2026",
    "auditType": "External",
    "standard": "DOC",
    "targetName": "Kantor Pusat PT. PBK (Divisi HRD & Crewing)",
    "vesselId": null,
    "clauseCode": "ISM-6",
    "clauseName": "Sumber Daya & Personil (Awak Kapal)",
    "category": "Minor NC",
    "status": "NC Close",
    "description": "Catatan sertifikat Basic Safety Training (BST) untuk 2 orang juru mudi kapal cadangan belum diperbarui dalam database digital darat.",
    "objectiveEvidence": "Database crewing belum memuat scan terbaru pembaruan BST yang telah terbit.",
    "dateIdentified": "2026-05-12",
    "dueDate": "2026-06-12",
    "assignedTo": "Crewing Manager PT. PBK",
    "auditor": "Auditor Ditjen Perhubungan Laut RI",
    "linkedRequisitionId": null,
    "linkedCertificateId": null,
    "evidence": {
      "hasSubmitted": true,
      "submissionDate": "2026-05-28",
      "submittedBy": "Crewing Manager",
      "rootCause": "Keterlambatan kru menyerahkan scan berkas fisik setelah revalidasi di balai diklat perhubungan.",
      "correctiveAction": "Kedua sertifikat BST telah diverifikasi online di portal Ditjen Hubla dan diunggah ke PMS Cloud.",
      "preventiveAction": "Diterapkan sistem otomatis notifikasi H-60 revalidasi sertifikat awak kapal.",
      "fileUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22400%22%20viewBox%3D%220%200%20600%20400%22%3E%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22%23f8fafc%22%2F%3E%3Crect%20x%3D%2220%22%20y%3D%2220%22%20width%3D%22560%22%20height%3D%22360%22%20fill%3D%22none%22%20stroke%3D%22%2310b981%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%22300%22%20y%3D%2260%22%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-weight%3D%22bold%22%20fill%3D%22%23047857%22%20text-anchor%3D%22middle%22%3EBUKTI%20PEMBARUAN%20BST%20CREW%20(NC%20CLOSED)%3C%2Ftext%3E%3Ctext%20x%3D%22300%22%20y%3D%2290%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%2364748b%22%20text-anchor%3D%22middle%22%3EVerifikasi%20Portal%20Pelaut%20Dephub%3C%2Ftext%3E%3Ccircle%20cx%3D%22480%22%20cy%3D%22270%22%20r%3D%2245%22%20fill%3D%22none%22%20stroke%3D%22%2310b981%22%20stroke-width%3D%223%22%2F%3E%3Ctext%20x%3D%22480%22%20y%3D%22275%22%20font-family%3D%22Arial%22%20font-size%3D%2211%22%20font-weight%3D%22bold%22%20fill%3D%22%2310b981%22%20text-anchor%3D%22middle%22%3ECLOSED%3C%2Ftext%3E%3C%2Fsvg%3E",
      "fileName": "Eviden_Revalidasi_BST_Dephub.svg",
      "fileSize": "820 KB",
      "auditorReviewNotes": "Dokumen revalidasi terverifikasi sah. Sertifikat DOC diperpanjang resmi.",
      "closedDate": "2026-06-02"
    }
  }
];
