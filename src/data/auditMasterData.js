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

// (Catatan: Data Master BKI_AUDIT_MASTER, NON_BKI_AUDIT_ORGANIZATIONS, INTERNAL_AUDIT_MASTER,
// dan EXTERNAL_AUDIT_ORGANIZATIONS didefinisikan secara modular di bawah setelah template BKI_SMC_CHECKLIST_TEMPLATE)

/**
 * Checklist Lengkap Sistem Manajemen Keselamatan Kapal (SMS Shipboard Checklist)
 * Dokumen Acuan Resmi BKI:
 *   - File: 00954PK26_F23_14_06-2024 Rev05 SMS SHIPBOARD CHECKLIST.pdf
 *   - No. Formulir: F23.14.06-2024 Rev 05 (SOLAS IX / ISM Code)
 *   - Penerbit: Biro Klasifikasi Indonesia (BKI)
 *   - Standar: Safety Management Certificate (SMC)
 *
 * Diikutsertakan seluruh klausul dari Halaman 1 s/d 10 termasuk Klausul Khusus
 * Tipe Kapal A s/d E (berstatus isStrikethrough: false).
 */
export const BKI_SMC_CHECKLIST_TEMPLATE = [
  // 1. SHIPBOARD TOUR & GENERAL REQUIREMENT
  // 1.1 Bridge
  { id: 'chk-1.1.1', no: '1.1.1', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.1 Bridge', item: 'Are there any Navigation equipment or radio equipment left inoperative/ malfunctioned?', ismCode: '10', defaultResult: 'No', remark: 'If Yes, go to 10.11 up to 10.14', isStrikethrough: false },
  { id: 'chk-1.1.2', no: '1.1.2', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.1 Bridge', item: 'Are updated versions of nautical publications and IAMSAR Manual (Volume III) available?', ismCode: '11.2.1', defaultResult: 'No', remark: 'SOLAS V/21 & 27', isStrikethrough: false },
  { id: 'chk-1.1.3', no: '1.1.3', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.1 Bridge', item: 'Are maritime safety information from NAVTEX or EGC checked regularly?', ismCode: '7', defaultResult: 'Yes', remark: '', isStrikethrough: false },
  { id: 'chk-1.1.4', no: '1.1.4', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.1 Bridge', item: 'Are nautical charts and Notice to Mariners controlled properly?', ismCode: '7', defaultResult: 'Yes', remark: '', isStrikethrough: false },
  { id: 'chk-1.1.5', no: '1.1.5', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.1 Bridge', item: 'Is ENCs updated in accordance with ECDIS handling procedure in SMS properly?', ismCode: '7', defaultResult: 'N/A', remark: '', isStrikethrough: false },
  { id: 'chk-1.1.6', no: '1.1.6', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.1 Bridge', item: 'Are standing order or night order issued regularly by the master?', ismCode: '7', defaultResult: 'No', remark: 'See NC 1/4', isStrikethrough: false },

  // 1.2 Accommodation Space
  { id: 'chk-1.2.1', no: '1.2.1', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.2 Accommodation Space', item: 'Are there any crew accommodation facilities left inoperative/ malfunctioned? Common toilets, Shower & toilet in cabins etc.', ismCode: '10', defaultResult: 'No', remark: 'If Yes, go to 10.11 up to 10.14', isStrikethrough: false },
  { id: 'chk-1.2.2', no: '1.2.2', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.2 Accommodation Space', item: 'Are posted Muster lists updated? (Engine Room, Accommodation Room, Bridge)', ismCode: '8.2', defaultResult: 'No', remark: 'SOLAS III/37', isStrikethrough: false },
  { id: 'chk-1.2.3', no: '1.2.3', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.2 Accommodation Space', item: 'Is SOLAS training manual controlled properly? (Mess Room, Recreation Room)', ismCode: '8.2', defaultResult: 'No', remark: 'SOLAS III/36', isStrikethrough: false },
  { id: 'chk-1.2.4', no: '1.2.4', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.2 Accommodation Space', item: "Are ship's drawings and instruction books controlled properly?", ismCode: '11.2.1', defaultResult: 'Yes', remark: 'SOLAS II-1/3-7', isStrikethrough: false },
  { id: 'chk-1.2.5', no: '1.2.5', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.2 Accommodation Space', item: 'Is posted placard for garbage disposal written in language understood by crew?', ismCode: '6.6', defaultResult: 'Yes', remark: 'MARPOL V/9', isStrikethrough: false },
  { id: 'chk-1.2.6', no: '1.2.6', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.2 Accommodation Space', item: 'Are there distinctively marked garbage receptacles to receive garbage for recycling?', ismCode: '6.6', defaultResult: 'Yes', remark: 'MARPOL V, MEPC.201(62)', isStrikethrough: false },
  { id: 'chk-1.2.7', no: '1.2.7', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.2 Accommodation Space', item: 'Is watch schedule for watchkeeper posted?', ismCode: '7', defaultResult: 'Yes', remark: 'STCW A-VIII/1.5', isStrikethrough: false },
  { id: 'chk-1.2.8', no: '1.2.8', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.2 Accommodation Space', item: 'Is hospital accommodation ready for emergency use?', ismCode: '1.2', defaultResult: 'N/A', remark: '', isStrikethrough: false },
  { id: 'chk-1.2.9', no: '1.2.9', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.2 Accommodation Space', item: 'Are medicaments properly controlled?', ismCode: '1.2', defaultResult: 'No', remark: 'See NC 2/4', isStrikethrough: false },

  // 1.3 On Deck & Engine Room
  { id: 'chk-1.3.1', no: '1.3.1', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.3 On Deck & Machinery', item: 'Are closing appliances, L.S.A. and F.F.A maintained properly? (Lifeboat, Rescue boat, Fire damper)', ismCode: '10', defaultResult: 'Yes', remark: 'Fire damper verified', isStrikethrough: false },
  { id: 'chk-1.3.2', no: '1.3.2', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.3 On Deck & Machinery', item: 'Are coating / painting of hull parts and equipment maintained properly?', ismCode: '10', defaultResult: 'Yes', remark: '', isStrikethrough: false },
  { id: 'chk-1.3.3', no: '1.3.3', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.3 On Deck & Machinery', item: 'Are there any damaged or corroded / rusted equipment or hull parts?', ismCode: '10', defaultResult: 'No', remark: 'Minor corrosion treated', isStrikethrough: false },
  { id: 'chk-1.3.4', no: '1.3.4', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.3 On Deck & Machinery', item: 'Are there any temporarily repaired parts?', ismCode: '10', defaultResult: 'No', remark: 'Permanent repairs applied', isStrikethrough: false },
  { id: 'chk-1.3.6', no: '1.3.6', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.3 On Deck & Machinery', item: 'Are there any machinery and equipment left with their function inoperative? (Fire pump, Emergency fire pump, OWS system)', ismCode: '10.2', defaultResult: 'No', remark: 'Fire pump, emergency fire pump & OWS checked operative', isStrikethrough: false },
  { id: 'chk-1.3.7', no: '1.3.7', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.3 On Deck & Machinery', item: 'Are escape route and escape trunk from engine room secured?', ismCode: '8.2', defaultResult: 'Yes', remark: 'SOLAS II-2/13', isStrikethrough: false },
  { id: 'chk-1.3.8', no: '1.3.8', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.3 On Deck & Machinery', item: 'Is operating instruction of steering changeover posted?', ismCode: '8.2', defaultResult: 'Yes', remark: 'SOLAS V/26 3.1', isStrikethrough: false },

  // 1.4 Interview with officers and/or ratings
  { id: 'chk-1.4.1', no: '1.4.1', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.4 Crew Interview', item: 'Interview with Ratings (Deck: Juru Mudi, Engine: Juru Minyak, Catering: Koki) regarding joined date and familiarization', ismCode: '6.3', defaultResult: 'Yes', remark: 'All ratings completed familiarization', isStrikethrough: false },
  { id: 'chk-1.4.5', no: '1.4.5', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.4 Crew Interview', item: 'When did he last participate in an abandon ship drill? (Date: 24/06/2026)', ismCode: '8.2', defaultResult: 'Yes', remark: 'Verified 24/06/2026', isStrikethrough: false },
  { id: 'chk-1.4.6', no: '1.4.6', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.4 Crew Interview', item: 'Does he know his assigned duties in emergency?', ismCode: '8.2', defaultResult: 'Yes', remark: '', isStrikethrough: false },
  { id: 'chk-1.4.7', no: '1.4.7', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.4 Crew Interview', item: 'Does he know how to donning and use fireman outfit and breathing apparatus (EEBD)?', ismCode: '8.2', defaultResult: 'Yes', remark: '', isStrikethrough: false },
  { id: 'chk-1.4.9', no: '1.4.9', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.4 Crew Interview', item: 'Have there been any accidents or hazardous occurrences (near-miss) on board?', ismCode: '9.2', defaultResult: 'No', remark: 'Zero accident recorded', isStrikethrough: false },
  { id: 'chk-1.4.10', no: '1.4.10', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.4 Crew Interview', item: 'Did he receive a copy of the records of daily rest hours endorsed by Master?', ismCode: '7', defaultResult: 'Yes', remark: 'STCW A-VIII.7', isStrikethrough: false },
  { id: 'chk-1.4.8', no: '1.4.8', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.4 Crew Interview', item: 'Does he know location and operation of life-saving appliances (lifeboat, liferaft, lifebuoy) and their launching arrangement?', ismCode: '8.2', defaultResult: 'Yes', remark: 'SOLAS III/19 â€” dipulihkan dari bagian A - E formulir BKI', isStrikethrough: false },

  // 1.6 Shipboard Tour â€” Catatan Pembukaan Auditor (Bagian A s/d E pada Formulir BKI F23.14.06-2024 Rev 05)
  // Bagian A s/d E adalah "Additional Check Item by Ship Types" yang dicoret pada contoh PDF (catatan pembukaan auditor).
  // Sesuai permintaan, item yang dicoret TETAP DIMASUKKAN (isStrikethrough: false) agar dapat dipakai pada kapal
  // dengan tipe yang sesuai, dan ditandai "N/A" pada tipe kapal yang tidak relevan.
  { id: 'chk-1.6.1', no: '1.6.1', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.6 Shipboard Tour (Non-applicable â€” A s/d E Tipe Kapal)', item: 'Are there any crew accommodation facilities left inoperative/ malfunctioned (common toilets, shower & toilet in cabins)?', ismCode: '', defaultResult: 'Yes', remark: 'Bagian A - E formulir BKI (catatan pembukaan auditor)', isStrikethrough: false },
  { id: 'chk-1.6.2', no: '1.6.2', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.6 Shipboard Tour (Non-applicable â€” A s/d E Tipe Kapal)', item: 'Are posted Muster lists updated? (Engine Room, Accommodation Room, Bridge)', ismCode: '8.2', defaultResult: 'Yes', remark: 'SOLAS III/37 â€” dicoret pada contoh PDF', isStrikethrough: false },
  { id: 'chk-1.6.3', no: '1.6.3', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.6 Shipboard Tour (Non-applicable â€” A s/d E Tipe Kapal)', item: 'Is SOLAS training manual controlled properly? (Mess Room, Recreation Room)', ismCode: '8.2', defaultResult: 'Yes', remark: 'SOLAS III/36 â€” dicoret pada contoh PDF', isStrikethrough: false },
  { id: 'chk-1.6.4', no: '1.6.4', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.6 Shipboard Tour (Non-applicable â€” A s/d E Tipe Kapal)', item: 'Is hospital accommodation ready for emergency use?', ismCode: '1.2', defaultResult: 'Yes', remark: 'Dicoret pada contoh PDF', isStrikethrough: false },
  { id: 'chk-1.6.5', no: '1.6.5', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.6 Shipboard Tour (Non-applicable â€” A s/d E Tipe Kapal)', item: 'Are closing appliances, L.S.A. and F.F.A maintained properly? (Lifeboat, Rescue boat, Fire damper)', ismCode: '10', defaultResult: 'Yes', remark: 'SOLAS â€” dicoret pada contoh PDF', isStrikethrough: false },
  { id: 'chk-1.6.6', no: '1.6.6', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.6 Shipboard Tour (Non-applicable â€” A s/d E Tipe Kapal)', item: 'Are there any machinery and equipment left with their function inoperative? (Steering gear, OWS, Sewage treatment plant, Generators, Fire pumps)', ismCode: '10.2', defaultResult: 'Yes', remark: 'Dicoret pada contoh PDF', isStrikethrough: false },
  { id: 'chk-1.6.7', no: '1.6.7', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.6 Shipboard Tour (Non-applicable â€” A s/d E Tipe Kapal)', item: 'Is operating instruction of steering changeover posted?', ismCode: '8.2', defaultResult: 'Yes', remark: 'SOLAS V/26 3.1 â€” dicoret pada contoh PDF', isStrikethrough: false },
  { id: 'chk-1.6.8', no: '1.6.8', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.6 Shipboard Tour (Non-applicable â€” A s/d E Tipe Kapal)', item: 'Is the ship manned in compliance with the Safe Manning Certificate and are officers/ratings certificates valid?', ismCode: '6.2.2', defaultResult: 'Yes', remark: 'SOLAS V/14 â€” dicoret pada contoh PDF', isStrikethrough: false },
  { id: 'chk-1.6.9', no: '1.6.9', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.6 Shipboard Tour (Non-applicable â€” A s/d E Tipe Kapal)', item: 'Are necessary entries made to Oil Record Book, Garbage Record Book and Cargo Record Book?', ismCode: '7', defaultResult: 'Yes', remark: 'MARPOL â€” dicoret pada contoh PDF', isStrikethrough: false },
  { id: 'chk-1.6.10', no: '1.6.10', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.6 Shipboard Tour (Non-applicable â€” A s/d E Tipe Kapal)', item: 'Are Cargo Securing Manual / Cargo Gear Register and cargo hold bilge system records maintained and valid?', ismCode: '10', defaultResult: 'Yes', remark: 'Dicoret pada contoh PDF', isStrikethrough: false },


  // 1.5 Interview with the Master
  { id: 'chk-1.5.2', no: '1.5.2', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.5 Master Interview', item: 'Is validity of statutory certificates informed to the company as per the procedures?', ismCode: '10.1', defaultResult: 'Yes', remark: '', isStrikethrough: false },
  { id: 'chk-1.5.3', no: '1.5.3', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.5 Master Interview', item: 'Are valid Classification Certificate and records available on board the ship?', ismCode: '1.2.3.1', defaultResult: 'Yes', remark: '', isStrikethrough: false },
  { id: 'chk-1.5.5', no: '1.5.5', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.5 Master Interview', item: 'Does every seafarer hold a valid medical certificate?', ismCode: '1.2.3.1', defaultResult: 'Yes', remark: 'STCW I-9 3', isStrikethrough: false },
  { id: 'chk-1.5.6', no: '1.5.6', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.5 Master Interview', item: 'Number and Nationality of Master and Officers (6) & Ratings (4) - Indonesia', ismCode: '6.2.1', defaultResult: 'Yes', remark: 'Total 10 Indonesian crew', isStrikethrough: false },
  { id: 'chk-1.5.7', no: '1.5.7', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.5 Master Interview', item: 'Is the ship manned in compliance with the Safe Manning Certificate?', ismCode: '6.2.2', defaultResult: 'Yes', remark: 'SOLAS V/14 compliant', isStrikethrough: false },
  { id: 'chk-1.5.15', no: '1.5.15', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.5 Master Interview', item: 'Are necessary items entered as per SOLAS and SMS logbook requirements?', ismCode: '8.2', defaultResult: 'Yes', remark: '', isStrikethrough: false },
  { id: 'chk-1.5.17', no: '1.5.17', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.5 Master Interview', item: 'Are necessary entries made to Oil Record Book and Garbage Record Book?', ismCode: '7', defaultResult: 'Yes', remark: 'MEPC.201(62)', isStrikethrough: false },
  { id: 'chk-1.5.21', no: '1.5.21', section: '1. SHIPBOARD TOUR & GENERAL REQUIREMENT', subsection: '1.5 Master Interview', item: 'Flag state requirements: Cyber security (SE 35/2020 SMK 7.28.3) & Health (SE 14/2020 SMK 7.27.3)', ismCode: '1.2.3.1', defaultResult: 'Yes', remark: '', isStrikethrough: false },

  // 2. SAFETY AND ENVIRONMENTAL PROTECTION POLICY
  { id: 'chk-2.1', no: '2.1', section: '2. SAFETY AND ENVIRONMENTAL PROTECTION POLICY', subsection: '2. Policy', item: 'Is Safety and Environmental Protection Policy available, known and implemented on board?', ismCode: '2', defaultResult: 'Yes', remark: 'Signed by Company Director', isStrikethrough: false },

  // 3. COMPANY RESPONSIBILITIES & AUTHORITIES
  { id: 'chk-3.1', no: '3.1', section: '3. COMPANY RESPONSIBILITIES & AUTHORITIES', subsection: '3. Responsibilities', item: 'Is Company indicated on DOC identical with entity reported and responsibilities defined?', ismCode: '3', defaultResult: 'Yes', remark: 'PT. Pelayaran Baharimas Kalimantan', isStrikethrough: false },

  // 4. DESIGNATED PERSON(S) ASHORE (DPA)
  { id: 'chk-4.1', no: '4.1', section: '4. DESIGNATED PERSON(S) ASHORE', subsection: '4. DPA', item: 'Are monitoring activities by DPA on safety and pollution aspect sufficient and role known by Master?', ismCode: '4', defaultResult: 'Yes', remark: 'DPA: CAPT. EKHSAN', isStrikethrough: false },

  // 5. MASTERâ€™S RESPONSIBILITIES AND AUTHORITY
  { id: 'chk-5.1', no: '5.1', section: "5. MASTER'S RESPONSIBILITIES AND AUTHORITY", subsection: '5. Responsibilities', item: 'Is the Master familiar with responsibilities and overriding authority required by ISM Code Section 5?', ismCode: '5.2', defaultResult: 'Yes', remark: '', isStrikethrough: false },
  { id: 'chk-5.6', no: '5.6', section: "5. MASTER'S RESPONSIBILITIES AND AUTHORITY", subsection: '5. SMS Review', item: 'Has the Master reviewed the SMS and reported its deficiencies to the company?', ismCode: '5.1.5', defaultResult: 'No', remark: 'As sufficient period has not been passed yet as per company\'s procedure, result was subject to "NO". NC 1/4', isStrikethrough: false },
  { id: 'chk-5.8', no: '5.8', section: "5. MASTER'S RESPONSIBILITIES AND AUTHORITY", subsection: '5. Risk Assessment', item: 'Has the Master carried out Risk Assessment according to SMS procedure established by Company?', ismCode: '1.2.2.2', defaultResult: 'Yes', remark: 'Verified for deck and engine tasks', isStrikethrough: false },

  // 6. RESOURCES AND PERSONNEL
  { id: 'chk-6.1', no: '6.1', section: '6. RESOURCES AND PERSONNEL', subsection: '6. Crewing', item: 'Is the working language specified by company recorded in ship\'s log-book? (Bahasa Indonesia)', ismCode: '6.6', defaultResult: 'Yes', remark: 'Working Language: Indonesia', isStrikethrough: false },

  // 7. SHIPBOARD OPERATIONS
  { id: 'chk-7.1', no: '7.1', section: '7. SHIPBOARD OPERATIONS', subsection: '7. Operations', item: 'Have shipboard operations been carried out as per SMS? Cargo Type: Towing oil barge', ismCode: '7', defaultResult: 'Yes', remark: 'Towing oil barge operation', isStrikethrough: false },
  { id: 'chk-7.10', no: '7.10', section: '7. SHIPBOARD OPERATIONS', subsection: '7. Watchkeeping', item: 'Have Watchkeeping operations been performed as per procedures? (Rest hours, alcohol limit <0.05% BAC, voyage planning)', ismCode: '7', defaultResult: 'Yes', remark: 'STCW A-VIII', isStrikethrough: false },

  // 8. EMERGENCY PREPAREDNESS
  { id: 'chk-8.1', no: '8.1', section: '8. EMERGENCY PREPAREDNESS', subsection: '8. Drills', item: 'Has the ship been ready for Emergency Situations identified and drills conducted?', ismCode: '8.2', defaultResult: 'Yes', remark: 'Emergency drills observed during audit (Fire & MOB)', isStrikethrough: false },

  // 9. REPORTS AND ANALYSIS OF NON-CONFORMITIES
  { id: 'chk-9.1', no: '9.1', section: '9. REPORTS AND ANALYSIS OF NON-CONFORMITIES', subsection: '9. Deficiencies', item: 'Have all deficiencies and NCs been dealt with in accordance with Company SMS?', ismCode: '9.1', defaultResult: 'Yes', remark: '', isStrikethrough: false },

  // 10. MAINTENANCE OF THE SHIP AND EQUIPMENT
  { id: 'chk-10.1', no: '10.1', section: '10. MAINTENANCE OF THE SHIP AND EQUIPMENT', subsection: '10. Maintenance', item: 'Is the Ship maintained sufficiently in accordance with relevant rules and Company PMS requirements?', ismCode: '10.2.1', defaultResult: 'Yes', remark: 'PMS routine active', isStrikethrough: false },

  // 11. DOCUMENTATION
  { id: 'chk-11.1', no: '11.1', section: '11. DOCUMENTATION', subsection: '11. Documentation', item: 'Are all documents and SMS manuals controlled properly and updated?', ismCode: '11.1', defaultResult: 'Yes', remark: 'SMS Manual Rev 05', isStrikethrough: false },

  // 12. COMPANY VERIFICATION, REVIEW AND EVALUATION
  { id: 'chk-12.1', no: '12.1', section: '12. COMPANY VERIFICATION, REVIEW AND EVALUATION', subsection: '12. Internal Audit', item: 'Are Internal Audits carried out at interval not exceeding 12 months? (Previous: 05 Aug 2025, Latest: 06 Jul 2026)', ismCode: '12.1', defaultResult: 'Yes', remark: 'Interval compliant', isStrikethrough: false },

  // ADDITIONAL CHECK ITEM BY SHIP TYPES (Yang Dicoret di Formulir Tetap Diikutkan Sesuai Permintaan)
  // A. OIL TANKER
  { id: 'chk-add-A.1', no: 'A.1', section: 'ADDITIONAL CHECK ITEM BY SHIP TYPES', subsection: 'A. OIL TANKER', item: 'Has the instrument for measuring flammable gas concentration been properly calibrated?', ismCode: 'SOLAS II-2/4-5.7', defaultResult: 'N/A', remark: 'Bukan Kapal Tanker Minyak (Tugboat Towing)', isStrikethrough: false },
  { id: 'chk-add-A.2', no: 'A.2', section: 'ADDITIONAL CHECK ITEM BY SHIP TYPES', subsection: 'A. OIL TANKER', item: 'Are the records of discharging of slop, valve closing operations in Oil Record Book Part II?', ismCode: 'MARPOL I/31', defaultResult: 'N/A', remark: 'Dicoret (Non-applicable for Tugboat)', isStrikethrough: false },
  { id: 'chk-add-A.3', no: 'A.3', section: 'ADDITIONAL CHECK ITEM BY SHIP TYPES', subsection: 'A. OIL TANKER', item: 'Are there records of COW operations in Oil Record Book Part II?', ismCode: 'MARPOL I/35', defaultResult: 'N/A', remark: 'Dicoret', isStrikethrough: false },

  // B. GAS CARRIER
  { id: 'chk-add-B.1', no: 'B.1', section: 'ADDITIONAL CHECK ITEM BY SHIP TYPES', subsection: 'B. GAS CARRIER', item: 'Have portable and fixed gas concentration measurement instruments been properly calibrated?', ismCode: 'IGC Code 13.6.6', defaultResult: 'N/A', remark: 'Dicoret (Bukan Kapal Gas Carrier)', isStrikethrough: false },
  { id: 'chk-add-B.2', no: 'B.2', section: 'ADDITIONAL CHECK ITEM BY SHIP TYPES', subsection: 'B. GAS CARRIER', item: 'Is crew in charge of cargo operation adequately trained for safe handling including emergency procedures?', ismCode: 'IGC Code 18.3', defaultResult: 'N/A', remark: 'Dicoret', isStrikethrough: false },
  { id: 'chk-add-B.3', no: 'B.3', section: 'ADDITIONAL CHECK ITEM BY SHIP TYPES', subsection: 'B. GAS CARRIER', item: 'Does crew understand Company procedure for entering into cargo holds, tanks and enclosed spaces?', ismCode: 'IGC Code 18.4', defaultResult: 'N/A', remark: 'Dicoret', isStrikethrough: false },
  { id: 'chk-add-B.4', no: 'B.4', section: 'ADDITIONAL CHECK ITEM BY SHIP TYPES', subsection: 'B. GAS CARRIER', item: 'Has ship been loaded with cargo gas listed in Annex of Gas Fitness Certificate?', ismCode: 'IGC Code 18.2', defaultResult: 'N/A', remark: 'Dicoret', isStrikethrough: false },

  // C. CHEMICAL TANKER
  { id: 'chk-add-C.1', no: 'C.1', section: 'ADDITIONAL CHECK ITEM BY SHIP TYPES', subsection: 'C. CHEMICAL TANKER', item: 'Is crew in charge of cargo operation adequately trained for safe chemical handling?', ismCode: 'IBC Code 16.3', defaultResult: 'N/A', remark: 'Dicoret (Bukan Chemical Tanker)', isStrikethrough: false },
  { id: 'chk-add-C.2', no: 'C.2', section: 'ADDITIONAL CHECK ITEM BY SHIP TYPES', subsection: 'C. CHEMICAL TANKER', item: 'Are MARPOL Annex II cargo handling operations properly recorded in Cargo Record Book?', ismCode: 'MARPOL II/14', defaultResult: 'N/A', remark: 'Dicoret', isStrikethrough: false },

  // D. BULK CARRIER
  { id: 'chk-add-D.1', no: 'D.1', section: 'ADDITIONAL CHECK ITEM BY SHIP TYPES', subsection: 'D. BULK CARRIER', item: 'Did crew training and drills carried out according to evacuation procedure for cargo hold flooding?', ismCode: 'SOLAS XII/9', defaultResult: 'N/A', remark: 'Dicoret (Bukan Bulk Carrier)', isStrikethrough: false },
  { id: 'chk-add-D.2', no: 'D.2', section: 'ADDITIONAL CHECK ITEM BY SHIP TYPES', subsection: 'D. BULK CARRIER', item: 'Are "Hatch Cover Maintenance Plans" in accordance with MSC 169 (79) incorporated into SMS?', ismCode: 'SOLAS XII/7.2', defaultResult: 'N/A', remark: 'Dicoret', isStrikethrough: false },

  // E. SELF-UNLOADING BULK CARRIERS
  { id: 'chk-add-E.1', no: 'E.1', section: 'ADDITIONAL CHECK ITEM BY SHIP TYPES', subsection: 'E. SELF-UNLOADING BULK CARRIERS', item: 'Have you procedures for fire safety risk assessment in SMS? (IMSBC Code 3.1.2)', ismCode: 'IMSBC 3.1.2', defaultResult: 'N/A', remark: 'Dicoret (Non-conveyor tugboat)', isStrikethrough: false },
  { id: 'chk-add-E.2', no: 'E.2', section: 'ADDITIONAL CHECK ITEM BY SHIP TYPES', subsection: 'E. SELF-UNLOADING BULK CARRIERS', item: 'Who has responsibility for implementation of fire safety risk assessment?', ismCode: 'IMSBC 3.1.2', defaultResult: 'N/A', remark: 'Dicoret', isStrikethrough: false }
];

// Alias ekspor untuk kompatibilitas master data SMC
export const SMS_SHIPBOARD_CHECKLIST_TEMPLATE = BKI_SMC_CHECKLIST_TEMPLATE;
export const ISM_SMC_ELEMENTS = BKI_SMC_CHECKLIST_TEMPLATE;

// =============================================================================
// 1. DATA MASTER AUDIT BKI (BIRO KLASIFIKASI INDONESIA) — TEMPLATE RESMI REV 05
// =============================================================================
/**
 * Master Data Resmi Audit Badan Klasifikasi Indonesia (BKI).
 * Mengacu pada dokumen resmi:
 *   - File: 00954PK26_F23_14_06-2024 Rev05 SMS SHIPBOARD CHECKLIST.pdf
 *   - Formulir: F23.14.06-2024 Rev 05
 *   - Standar: Safety Management Certificate (SMC) SOLAS IX / ISM Code
 *
 * PERHATIAN:
 * Template resmi 74 klausul ini HANYA DAN EKSKLUSIF BERLAKU UNTUK AUDIT BKI.
 * TIDAK BOLEH dimuat atau dipakai oleh lembaga audit lain (KSOP, Hubla, LR, BV, dll).
 */
export const BKI_AUDIT_MASTER = {
  id: 'bki',
  organizationId: 'bki',
  code: 'BKI',
  name: 'Biro Klasifikasi Indonesia (BKI)',
  shortName: 'BKI',
  category: 'BKI',
  badgeColor: '#0284c7',
  standard: 'SMC',
  docNumber: 'F23.14.06-2024 Rev 05',
  docTitle: 'Checklist untuk Sistem Manajemen Keselamatan Kapal (SMS Shipboard Checklist)',
  checklistDoc: '00954PK26_F23_14_06-2024 Rev05 SMS SHIPBOARD CHECKLIST.pdf',
  revision: 'Rev 05 / Document Revision 00',
  reference: '00954PK26 — SOLAS 1974 Chapter IX dan ISM Code',
  issuedBy: 'Biro Klasifikasi Indonesia (BKI)',
  hasOfficialTemplate: true,
  description: 'Badan klasifikasi nasional yang ditunjuk pemerintah RI sebagai Recognized Organization (RO) untuk sertifikasi SMC kapal.',
  items: BKI_SMC_CHECKLIST_TEMPLATE // 74 butir klausul resmi
};

// =============================================================================
// 2. DATA MASTER AUDIT LEMBAGA LAIN (NON-BKI / STATUTORY / CLASS ASING)
// =============================================================================
/**
 * Master Data Organisasi / Lembaga Audit Eksternal Selain BKI.
 *
 * Lembaga-lembaga di bawah ini memiliki regulasi, ranah pengawasan, dan format checklist
 * yang mandiri dan berbeda dari BKI.
 *
 * KETENTUAN TEGAS:
 * - Seluruh lembaga di bawah ini memiliki `hasOfficialTemplate: false`
 * - Memiliki `items: []` (ARRAY KOSONG secara default)
 * - Template BKI TIDAK TERPAKAI oleh lembaga ini.
 * - Auditor menyusun butir checklist secara fleksibel melalui input manual per sesi audit.
 */
export const NON_BKI_AUDIT_ORGANIZATIONS = [
  {
    id: 'ksop',
    organizationId: 'ksop',
    code: 'KSOP',
    name: 'Kantor Kesyahbandaran & Otoritas Pelabuhan (KSOP)',
    shortName: 'KSOP Pontianak',
    category: 'NON_BKI',
    badgeColor: '#2563eb',
    standard: 'SMC/Statutory',
    hasOfficialTemplate: false,
    description: 'Pemeriksaan kelaiklautan kapal, keselamatan pelayaran, sertifikasi statutori & pencegahan pencemaran di wilayah pelabuhan.',
    note: 'Format checklist KSOP disusun secara mandiri sesuai ranah kelaiklautan & statutori. Template resmi BKI tidak berlaku.',
    items: []
  },
  {
    id: 'hubla',
    organizationId: 'hubla',
    code: 'HUBLA',
    name: 'Direktorat Jenderal Perhubungan Laut (Ditjen Hubla)',
    shortName: 'Hubla / Kemenhub',
    category: 'NON_BKI',
    badgeColor: '#059669',
    standard: 'DOC/SMC',
    hasOfficialTemplate: false,
    description: 'Otoritas Flag State maritim Indonesia penerbit Document of Compliance (DOC) dan pengawas kelaiklautan nasional.',
    note: 'Pemeriksaan Ditjen Hubla memakai format inspeksi kelaiklautan kementerian. Template resmi BKI tidak berlaku.',
    items: []
  },
  {
    id: 'lr',
    organizationId: 'lr',
    code: 'LR',
    name: "Lloyd's Register (LR)",
    shortName: "Lloyd's",
    category: 'NON_BKI',
    badgeColor: '#dc2626',
    standard: 'SMC/Class',
    hasOfficialTemplate: false,
    description: 'Badan klasifikasi internasional asal Inggris (IACS Member).',
    note: 'Memakai sistem audit ISM/ISPS Lloyd\'s Register tersendiri. Template resmi BKI tidak berlaku.',
    items: []
  },
  {
    id: 'bv',
    organizationId: 'bv',
    code: 'BV',
    name: 'Bureau Veritas (BV)',
    shortName: 'BV',
    category: 'NON_BKI',
    badgeColor: '#d97706',
    standard: 'SMC/Class',
    hasOfficialTemplate: false,
    description: 'Badan klasifikasi internasional asal Prancis (IACS Member).',
    note: 'Memakai sistem audit ISM Bureau Veritas tersendiri. Template resmi BKI tidak berlaku.',
    items: []
  },
  {
    id: 'classnk',
    organizationId: 'classnk',
    code: 'NK',
    name: 'Nippon Kaiji Kyokai (ClassNK)',
    shortName: 'ClassNK',
    category: 'NON_BKI',
    badgeColor: '#4f46e5',
    standard: 'SMC/Class',
    hasOfficialTemplate: false,
    description: 'Badan klasifikasi internasional asal Jepang (IACS Member).',
    note: 'Memakai sistem audit ISM ClassNK tersendiri. Template resmi BKI tidak berlaku.',
    items: []
  },
  {
    id: 'rina',
    organizationId: 'rina',
    code: 'RINA',
    name: 'RINA Services Marine',
    shortName: 'RINA',
    category: 'NON_BKI',
    badgeColor: '#7c3aed',
    standard: 'SMC/Class',
    hasOfficialTemplate: false,
    description: 'Badan klasifikasi internasional asal Italia (IACS Member).',
    note: 'Memakai sistem audit ISM RINA tersendiri. Template resmi BKI tidak berlaku.',
    items: []
  },
  {
    id: 'custom',
    organizationId: 'custom',
    code: 'EXT',
    name: 'Lembaga Audit Eksternal Lainnya (Input Manual)',
    shortName: 'Lembaga Lain',
    category: 'NON_BKI',
    badgeColor: '#64748b',
    standard: 'Custom',
    hasOfficialTemplate: false,
    description: 'Auditor eksternal independen atau otoritas maritim lainnya.',
    note: 'Format checklist disesuaikan manual oleh auditor per sesi pemeriksaan.',
    items: []
  }
];

// =============================================================================
// 3. DATA MASTER AUDIT INTERNAL PERUSAHAAN (DPA / QHSE)
// =============================================================================
export const INTERNAL_AUDIT_MASTER = {
  id: 'internal',
  organizationId: 'internal',
  code: 'PBK-INT',
  name: 'PT. Pelayaran Baharimas Kalimantan (Internal DPA / QHSE)',
  shortName: 'Internal DPA/QHSE',
  category: 'INTERNAL',
  badgeColor: '#0891b2',
  standard: 'DOC & SMC',
  hasOfficialTemplate: false,
  description: 'Tim auditor internal Designated Person Ashore (DPA) dan Departemen QHSE PT. Pelayaran Baharimas Kalimantan.',
  note: 'Audit internal perusahaan menggunakan 12 elemen ISM Code untuk DOC kantor dan kriteria keselamatan internal armada.',
  items: []
};

// Gabungan seluruh organisasi audit eksternal untuk backward compatibility
export const EXTERNAL_AUDIT_ORGANIZATIONS = [
  BKI_AUDIT_MASTER,
  ...NON_BKI_AUDIT_ORGANIZATIONS
];

// =============================================================================
// HELPER VALIDASI & IDENTIFIKASI LEMBAGA AUDIT
// =============================================================================

/**
 * Cek apakah sebuah lembaga atau sesi audit adalah BKI (Biro Klasifikasi Indonesia).
 * Digunakan untuk menjamin template 74 klausul BKI HANYA aktif pada BKI.
 *
 * @param {string|object} organization
 * @returns {boolean} true jika BKI, false untuk KSOP / Hubla / lainnya
 */
export const isBKIOrganization = (organization) => {
  if (!organization) return false;
  if (typeof organization === 'object') {
    const id = organization.id || organization.organizationId || organization.code || '';
    if (String(id).toLowerCase() === 'bki') return true;
    const name = organization.name || organization.shortName || '';
    return /bki|biro klasifikasi indonesia/i.test(String(name));
  }
  const str = String(organization).trim().toLowerCase();
  return str === 'bki' || /bki|biro klasifikasi indonesia/i.test(str);
};

/**
 * Ambil data master lembaga audit berdasarkan id / nama / objek lembaga.
 *
 * @param {string|object} organization
 * @returns {object} metadata master data lembaga
 */
export const getAuditMasterByOrganization = (organization) => {
  if (isBKIOrganization(organization)) {
    return BKI_AUDIT_MASTER;
  }
  const orgId = resolveOrganizationId(organization);
  if (orgId === 'internal') {
    return INTERNAL_AUDIT_MASTER;
  }
  const found = NON_BKI_AUDIT_ORGANIZATIONS.find(org => org.id === orgId || org.code?.toLowerCase() === orgId);
  return found || NON_BKI_AUDIT_ORGANIZATIONS[NON_BKI_AUDIT_ORGANIZATIONS.length - 1];
};

// =============================================================================
// REGISTRY CHECKLIST PER LEMBAGA AUDIT
// =============================================================================
const CHECKLIST_SOURCE_DOCUMENT = {
  bki: {
    docNumber: 'F23.14.06-2024 Rev 05',
    docTitle: 'Checklist for Shipboard Safety Management System',
    revision: 'Rev 05 / Document Revision 00',
    reference: '00954PK26 — SOLAS 1974 Chapter IX dan ISM Code',
    issuedBy: 'Biro Klasifikasi Indonesia (BKI)'
  }
};

const ORG_CHECKLIST_NOTE = 'Format checklist lembaga ini disesuaikan secara mandiri dan terpisah dari BKI. Silakan tambahkan butir pemeriksaan melalui menu "Tambah Item Manual".';

const AUDIT_CHECKLIST_REGISTRY = {
  bki: {
    ...BKI_AUDIT_MASTER,
    organizationName: BKI_AUDIT_MASTER.name,
    checked: true,
    items: BKI_SMC_CHECKLIST_TEMPLATE
  },
  hubla: {
    ...NON_BKI_AUDIT_ORGANIZATIONS.find(o => o.id === 'hubla'),
    organizationName: 'Direktorat Jenderal Perhubungan Laut (Ditjen Hubla)',
    checked: false,
    note: ORG_CHECKLIST_NOTE,
    items: []
  },
  ksop: {
    ...NON_BKI_AUDIT_ORGANIZATIONS.find(o => o.id === 'ksop'),
    organizationName: 'Kantor Kesyahbandaran & Otoritas Pelabuhan (KSOP)',
    checked: false,
    note: ORG_CHECKLIST_NOTE,
    items: []
  },
  lr: {
    ...NON_BKI_AUDIT_ORGANIZATIONS.find(o => o.id === 'lr'),
    organizationName: "Lloyd's Register (LR)",
    checked: false,
    note: ORG_CHECKLIST_NOTE,
    items: []
  },
  bv: {
    ...NON_BKI_AUDIT_ORGANIZATIONS.find(o => o.id === 'bv'),
    organizationName: 'Bureau Veritas (BV)',
    checked: false,
    note: ORG_CHECKLIST_NOTE,
    items: []
  },
  classnk: {
    ...NON_BKI_AUDIT_ORGANIZATIONS.find(o => o.id === 'classnk'),
    organizationName: 'Nippon Kaiji Kyokai (ClassNK)',
    checked: false,
    note: ORG_CHECKLIST_NOTE,
    items: []
  },
  rina: {
    ...NON_BKI_AUDIT_ORGANIZATIONS.find(o => o.id === 'rina'),
    organizationName: 'RINA Services Marine',
    checked: false,
    note: ORG_CHECKLIST_NOTE,
    items: []
  },
  custom: {
    ...NON_BKI_AUDIT_ORGANIZATIONS.find(o => o.id === 'custom'),
    organizationName: 'Lembaga Audit Eksternal Lainnya',
    checked: false,
    note: 'Lembaga belum terdaftar pada template. Silakan susun checklist manual sesuai regulasi lembaga terkait.',
    items: []
  },
  internal: {
    ...INTERNAL_AUDIT_MASTER,
    organizationName: INTERNAL_AUDIT_MASTER.name,
    checked: false,
    note: 'Audit internal perusahaan menggunakan kriteria DPA / QHSE.',
    items: []
  }
};

/**
 * Ambil daftar checklist sesuai lembaga audit.
 *
 * ATURAN MUTLAK:
 * - HANYA BKI yang mengembalikan butir template (74 klausul).
 * - Seluruh lembaga lain (KSOP, Hubla, LR, BV, dll) SELALU mengembalikan array KOSONG [].
 *
 * @param {string|object} organization - ID, nama, atau objek lembaga
 * @returns {Array} daftar butir checklist milik lembaga tersebut
 */
export const getChecklistForOrganization = (organization) => {
  if (!isBKIOrganization(organization)) {
    return []; // Lembaga selain BKI SELALU kosong!
  }
  return BKI_SMC_CHECKLIST_TEMPLATE;
};

/**
 * Ubah nama / kode lembaga audit eksternal menjadi organizationId registry.
 *
 * @param {string|object} organization - nama, kode, shortName, atau objek lembaga
 * @param {string} [fallback='custom'] - ID cadangan bila lembaga tidak dikenali
 * @returns {string} organizationId registry (mis. 'bki', 'ksop', 'hubla', 'custom')
 */
export const resolveOrganizationId = (organization, fallback = 'custom') => {
  if (organization && typeof organization === 'object') {
    const candidate =
      organization.id ||
      organization.organizationId ||
      organization.code ||
      organization.shortName ||
      organization.name ||
      organization.organizationName ||
      organization.label;
    if (!candidate) return String(fallback).toLowerCase();
    return resolveOrganizationId(candidate, fallback);
  }

  const raw = String(organization ?? '').trim();
  if (!raw) return String(fallback).toLowerCase();
  const lowered = raw.toLowerCase();

  // Audit internal perusahaan
  if (/internal|dpa|qhse|pelayaran baharimas/i.test(raw)) return 'internal';

  // BKI
  if (lowered === 'bki' || /bki|biro klasifikasi indonesia/i.test(raw)) return 'bki';

  // Cocokkan langsung terhadap id / code master non-BKI
  const matched = NON_BKI_AUDIT_ORGANIZATIONS.find(org =>
    org.id.toLowerCase() === lowered ||
    org.code.toLowerCase() === lowered
  );
  if (matched) return matched.id;

  // Cocokkan nama resmi di dalam string panjang (mis. "KSOP Pontianak")
  const aliasMap = [
    { id: 'hubla', keywords: ['hubla', 'perhubungan laut', 'kemenhub'] },
    { id: 'ksop', keywords: ['ksop', 'kesyahbandaran', 'otoritas pelabuhan'] },
    { id: 'lr', keywords: ['lloyd', 'lloyds register', 'lr '] },
    { id: 'bv', keywords: ['bureau veritas', 'bv '] },
    { id: 'classnk', keywords: ['classnk', 'class nk', 'nippon kaiji'] },
    { id: 'rina', keywords: ['rina'] }
  ];
  const aliasHit = aliasMap.find(a => a.keywords.some(k => lowered.includes(k)));
  if (aliasHit) return aliasHit.id;

  return String(fallback).toLowerCase();
};

/**
 * Ambil konfigurasi checklist siap pakai untuk sebuah sesi audit.
 *
 * Menggabungkan resolusi lembaga + pengambilan butir checklist sehingga seluruh
 * komponen audit memakai sumber tunggal yang konsisten.
 *
 * @param {string|object} organization - lembaga audit eksternal pada sesi
 * @returns {{organizationId: string, organizationName: string, checked: boolean,
 *   total: number, core: number, strikethrough: number, items: Array,
 *   note: string, docNumber: string, docTitle: string}}
 */
export const getChecklistConfigForSession = (organization) => {
  const organizationId = resolveOrganizationId(organization);
  return {
    ...getOrganizationChecklistInfo(organizationId),
    items: getChecklistForOrganization(organizationId)
  };
};

/**
 * Normalisasi butir checklist menjadi bentuk seragam untuk tabel UI AuditManager.
 *
 * Dua sumber butir memiliki bentuk berbeda:
 *   - AUDIT_CHECKLIST_REGISTRY (mis. BKI) : { no, item, remark, ismCode, isStrikethrough }
 *   - ISM_DOC_ELEMENTS                    : { code, name, checkPoints, ... }
 * Fungsi ini memetakannya ke bentuk { code, name, checkPoint, isStrikethrough }
 * sehingga satu tabel dapat merender kedua sumber tanpa percabangan di JSX.
 *
 * @param {object} el - butir checklist dari salah satu sumber
 * @returns {{id: string, code: string, name: string, checkPoint: string,
 *   isStrikethrough: boolean, source: object}}
 */
export const normalizeChecklistItem = (el) => {
  const source = el || {};
  const code = source.code || source.no || source.id || '-';

  // Bedakan sumber BKI registry (memiliki `item` = pertanyaan, `subsection` = area)
  // vs ISM_DOC_ELEMENTS (memiliki `name` = nama elemen, `checkPoints` = daftar kriteria).
  const isBKIRegistry = Boolean(source.item);

  // Kolom "Area Pemeriksaan ISM Code" = subsection (BKI) atau name (DOC)
  const name = isBKIRegistry
    ? (source.subsection || source.section || source.name || '')
    : (source.name || source.clauseName || '');

  // Kolom "Kriteria / Check Point" = pertanyaan audit (BKI) atau gabungan checkPoints (DOC)
  let checkPoint = source.checkPoint || '';
  if (!checkPoint && isBKIRegistry) {
    // BKI: gunakan field `item` (pertanyaan audit) sebagai check point utama
    checkPoint = source.item || '';
  }
  if (!checkPoint && Array.isArray(source.checkPoints)) {
    checkPoint = source.checkPoints.join(' â€¢ ');
  }

  // Catatan/referensi: remark (BKI) atau description (DOC)
  const remark = source.remark || source.description || '';

  // Kolom pendukung PDF: ISM Code, referensi, jawaban standar hasil audit.
  const ismCode = source.ismCode || source.ism || '';
  const reference = source.reference || source.ref || remark;
  const defaultResult = source.defaultResult || '';
  return {
    id: source.id || code,
    code,
    name,
    checkPoint,
    remark,
    ismCode,
    reference,
    defaultResult,
    isStrikethrough: Boolean(source.isStrikethrough),
    source
  };
};

/**
 * Ambil keterangan lembaga (nama, status, jumlah butir, catatan).
 * @param {string} organizationId
 * @returns {object}
 */
const getOrganizationChecklistInfo = (organizationId) => {
  const key = String(organizationId || '').toLowerCase();
  const entry = AUDIT_CHECKLIST_REGISTRY[key];
  const source = CHECKLIST_SOURCE_DOCUMENT[key];
  return {
    organizationId: key,
    organizationName: entry?.organizationName || key || 'Tanpa Lembaga',
    checked: Boolean(entry?.checked),
    total: entry?.items?.length || 0,
    core: (entry?.items || []).filter(i => !i.isStrikethrough).length,
    strikethrough: (entry?.items || []).filter(i => i.isStrikethrough).length,
    note: entry?.note || '',
    docNumber: source?.docNumber || '',
    docTitle: source?.docTitle || ''
  };
};

// Seed Data Demo Audit Cadangan PT. Pelayaran Baharimas Kalimantan
export const DEMO_AUDITS = [
  // Sesi Audit Kapal RP 2004 sesuai Dokumen PDF: 0859-PK/ISM-SMC/2026
  {
    "id": "aud-smc-rp2004",
    "auditNo": "0859-PK/ISM-SMC/2026",
    "reportId": "PT. PELAYARAN BAHARIMAS KALIMANTAN - RP 2004 - 0859-PK/ISM-SMC/2026",
    "docRevision": "F23.14.06-2024 Rev 05",
    "auditType": "External",
    "externalOrganization": "Biro Klasifikasi Indonesia (BKI)",
    "standard": "SMC",
    "targetType": "Vessel",
    "targetName": "RP 2004",
    "vesselId": "v-rp2004",
    "leadAuditor": "MUHSON NURROCHMAT S",
    "auditTeam": ["Tim Surveyor Badan Klasifikasi / Ditjen Hubla"],
    "auditee": "CAPT. EKHSAN (DPA / Nakhoda TB. RP 2004)",
    "auditLocation": "PULANG PISAU",
    "auditDate": "2026-08-18",
    "targetCloseDate": "2026-11-17",
    "scope": "Audit Pembaruan berdasarkan ketentuan INTERNATIONAL CONVENTION FOR THE SAFETY OF LIFE AT SEA, 1974 Chapter IX dan ISM Code.",
    "status": "In Progress",
    "totalItemsChecked": 52,
    "itemsComplied": 50,
    "findingsSummary": {
      "majorNC": 0,
      "minorNC": 1,
      "observation": 1,
      "totalOpen": 1,
      "totalClosed": 0
    },
    "auditConclusion": "Pemeriksaan SMS Shipboard Checklist pada kapal RP 2004 di Pelabuhan Pulang Pisau menunjukkan operasional keselamatan kapal secara umum memadai. Terdapat 1 temuan ketidaksesuaian (NC 1/4) pada Klausul ISM 5.1.5 yang disepakati untuk diselesaikan sebelum batas waktu 17 November 2026.",
    "leadAuditorSign": "MUHSON NURROCHMAT S",
    "auditeeSign": "CAPT. EKHSAN"
  },
  {
    "id": "aud-doc-001",
    "auditNo": "AUD-INT-DOC-2026/01",
    "reportId": "PT. PELAYARAN BAHARIMAS KALIMANTAN - DOC-INT-2026/01",
    "auditType": "Internal",
    "externalOrganization": null,
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
    "auditLocation": "Komp. Pontianak Mall Blok D No. 8-9, Jl. Tanjungpura, Kota Pontianak",
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
    "reportId": "PT. PELAYARAN BAHARIMAS KALIMANTAN - RP 2020 - AUD-EXT-SMC-2026/04",
    "auditType": "External",
    "externalOrganization": "Biro Klasifikasi Indonesia (BKI)",
    "standard": "SMC",
    "targetType": "Vessel",
    "targetName": "RP 2020",
    "vesselId": "v-001",
    "leadAuditor": "Surveyor BKI Cabang Pontianak (Auditor Eksternal ISM Hubla)",
    "auditTeam": [
      "Marine Inspector KSOP Pontianak"
    ],
    "auditee": "Capt. Hendra Gunawan, M.Mar & Ir. Bambang Wijaya (KKM RP 2020)",
    "auditLocation": "Pelabuhan Pontianak, Kalimantan Barat",
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
  }
];

export const DEMO_AUDIT_FINDINGS = [
  // Temuan NC Resmi RP 2004 sesuai Dokumen Laporan PNG (Klausul 5.1.5)
  {
    "id": "nc-rp2004-01",
    "auditId": "aud-smc-rp2004",
    "auditNo": "0859-PK/ISM-SMC/2026",
    "reportId": "0859 - PK/ISM- SMC /2026",
    "findingNo": "1/4 - 0859 - PK/ISM- SMC /2026",
    "auditType": "External",
    "externalOrganization": "Biro Klasifikasi Indonesia (BKI)",
    "standard": "SMC",
    "areaUnderAudit": "RP 2004",
    "targetName": "RP 2004",
    "vesselId": "v-rp2004",
    "elementNumberOfCode": "5.1.5",
    "clauseCode": "5.1.5",
    "clauseName": "Tanggung Jawab & Wewenang Nakhoda (Peninjauan Kembali SMK)",
    "category": "Non-Conformity",
    "status": "NC Open",
    "description": "Nakhoda belum memahami semua tanggung jawab dan wewenangnya yang telah didokumentasikan menyangkut hal peninjauan kembali SMK dan melaporkan kekurangannya kepada manajemen didarat secara berkala",
    "objectiveEvidence": "- Master review tahun 2025 tidak ditemukan saat audit\n- Tidak ditemukan master night order, analisa risiko untuk pekerjaan deck maupun permesinan dan penilaian crew periode semester I tahun 2026 pada saat diaudit",
    "dateIdentified": "2026-08-18",
    "dueDate": "2026-11-17",
    "agreedDate": "2026-11-17",
    "assignedTo": "Nakhoda / Master TB. RP 2004",
    "auditor": "MUHSON NURROCHMAT S",
    "auditee": "CAPT. EKHSAN",
    "correction": "Melakukan penyusunan formulir Master Review 2025/2026, menerbitkan Master Night Order dan Analisa Risiko (Risk Assessment) pekerjaan deck maupun permesinan serta form penilaian crew semester I tahun 2026.",
    "rootCause": "Nakhoda belum sepenuhnya memahami prosedur peninjauan berkala sistem manajemen keselamatan dan pergantian dokumen master di atas kapal.",
    "correctiveAction": "Pihak manajemen darat memberikan penyegaran prosedur ISM Code klausul 5 serta melengkapi template baku Master Review dan checklist verifikasi berkala.",
    "verifiedUpgradeDowngrade": "NC",
    "verifiedSatisfactory": true,
    "auditorSignatureDate": "2026-11-17",
    "auditeeSignatureDate": "2026-11-17",
    "evidence": {
      "hasSubmitted": true,
      "submissionDate": "2026-09-05",
      "submittedBy": "CAPT. EKHSAN (Nakhoda TB. RP 2004)",
      "rootCause": "Kurangnya pemahaman alur administrasi pelaporan berkala SMK dan dokumentasi peninjauan berkala di kapal.",
      "correctiveAction": "Telah diterbitkan Master Night Order, Analisa Risiko Deck & Engine, dan Laporan Master Review tahun berjalan.",
      "preventiveAction": "Jadwal evaluasi peninjauan SMK kapal ditetapkan tiap semester dan dimonitor oleh DPA.",
      "fileName": "Eviden_Perbaikan_Master_Review_RP2004.pdf",
      "fileSize": "1.4 MB",
      "fileUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22400%22%20viewBox%3D%220%200%20600%20400%22%3E%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22%23f8fafc%22%2F%3E%3Crect%20x%3D%2220%22%20y%3D%2220%22%20width%3D%22560%22%20height%3D%22360%22%20fill%3D%22none%22%20stroke%3D%22%230284c7%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%22300%22%20y%3D%2260%22%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-weight%3D%22bold%22%20fill%3D%22%230369a1%22%20text-anchor%3D%22middle%22%3EDOKUMEN%20BUKTI%20PERBAIKAN%20ISM%20CODE%3C%2Ftext%3E%3Ctext%20x%3D%22300%22%20y%3D%2290%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%2364748b%22%20text-anchor%3D%22middle%22%3EMASTER%20REVIEW%20%26%20RISK%20ASSESSMENT%20RP%202004%3C%2Ftext%3E%3Cline%20x1%3D%2250%22%20y1%3D%22110%22%20x2%3D%22550%22%20y2%3D%22110%22%20stroke%3D%22%23cbd5e1%22%2F%3E%3Ctext%20x%3D%2260%22%20y%3D%22150%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3ENomor%20NCR%3A%201%2F4%20-%200859%20-%20PK%2FISM-%20SMC%20%2F2026%3C%2Ftext%3E%3Ctext%20x%3D%2260%22%20y%3D%22180%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3EKlausul%20ISM%3A%205.1.5%20(Tanggung%20Jawab%20Nakhoda)%3C%2Ftext%3E%3Ctext%20x%3D%2260%22%20y%3D%22210%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%230f172a%22%3EKapal%3A%20TB.%20RP%202004%20%7C%20Lokasi%3A%20Pulang%20Pisau%3C%2Ftext%3E%3Ctext%20x%3D%22300%22%20y%3D%22330%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20font-weight%3D%22bold%22%20fill%3D%22%2310b981%22%20text-anchor%3D%22middle%22%3EBERKAS%20EVIDEN%20RESMI%20TERSIMPAN%20DI%20SISTEM%3C%2Ftext%3E%3C%2Fsvg%3E",
      "auditorReviewNotes": "Dokumen Master Review dan form Analisa Risiko telah diperiksa. Pelaksanaan tindakan korektif memuaskan.",
      "closedDate": null
    }
  },
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

// Clean state default: Kosong untuk diinput manual oleh pengguna
export const INITIAL_AUDITS = [];
export const INITIAL_AUDIT_FINDINGS = [];

