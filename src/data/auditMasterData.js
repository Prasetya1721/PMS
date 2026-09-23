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
  // 1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM
  // 1.1 Anjungan (Bridge)
  { id: 'chk-1.1.1', no: '1.1.1', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.1 Anjungan (Bridge)', item: 'Apakah terdapat peralatan navigasi atau peralatan radio yang tidak berfungsi atau rusak?', ismCode: '10', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.1.2', no: '1.1.2', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.1 Anjungan (Bridge)', item: 'Apakah publikasi nautika versi terbaru dan Buku Panduan IAMSAR (Volume III) tersedia di atas kapal?', ismCode: '11.2.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.1.3', no: '1.1.3', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.1 Anjungan (Bridge)', item: 'Apakah informasi keselamatan maritim (MSI) dari NAVTEX atau EGC diperiksa secara berkala?', ismCode: '7', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.1.4', no: '1.1.4', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.1 Anjungan (Bridge)', item: 'Apakah peta laut dan Berita Pelaut (Notice to Mariners) dikelola serta dikoreksi dengan benar?', ismCode: '7', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.1.5', no: '1.1.5', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.1 Anjungan (Bridge)', item: 'Apakah peta elektronik (ENC) diperbarui sesuai prosedur pengoperasian ECDIS dalam SMS?', ismCode: '7', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.1.6', no: '1.1.6', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.1 Anjungan (Bridge)', item: 'Apakah Standing Order atau Night Order diterbitkan secara berkala oleh Nakhoda?', ismCode: '7', defaultResult: '', remark: '', isStrikethrough: false },

  // 1.2 Ruang Akomodasi Awak Kapal
  { id: 'chk-1.2.1', no: '1.2.1', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.2 Ruang Akomodasi Awak Kapal', item: 'Apakah terdapat fasilitas akomodasi awak kapal yang rusak atau tidak berfungsi? (Toilet umum, shower & toilet kabin, dll.)', ismCode: '10', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.2.2', no: '1.2.2', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.2 Ruang Akomodasi Awak Kapal', item: 'Apakah Sijil Keadaan Darurat (Muster List) yang terpasang telah diperbarui? (Kamar Mesin, Akomodasi, Anjungan)', ismCode: '8.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.2.3', no: '1.2.3', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.2 Ruang Akomodasi Awak Kapal', item: 'Apakah manual pelatihan SOLAS (SOLAS Training Manual) terpelihara dengan baik? (Mess Room, Ruang Rekreasi)', ismCode: '8.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.2.4', no: '1.2.4', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.2 Ruang Akomodasi Awak Kapal', item: 'Apakah gambar rencana instalasi kapal (ship\'s drawings) dan buku petunjuk pengoperasian terkontrol dengan baik?', ismCode: '11.2.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.2.5', no: '1.2.5', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.2 Ruang Akomodasi Awak Kapal', item: 'Apakah plakat pengelolaan sampah yang terpasang menggunakan bahasa yang dipahami oleh awak kapal?', ismCode: '6.6', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.2.6', no: '1.2.6', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.2 Ruang Akomodasi Awak Kapal', item: 'Apakah tersedia tempat penampungan sampah terpilah dengan penandaan jelas untuk daur ulang?', ismCode: '6.6', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.2.7', no: '1.2.7', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.2 Ruang Akomodasi Awak Kapal', item: 'Apakah jadwal dinas jaga (watch schedule) untuk perwira dan awak jaga telah dipasang di tempat umum?', ismCode: '7', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.2.8', no: '1.2.8', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.2 Ruang Akomodasi Awak Kapal', item: 'Apakah ruang perawatan kesehatan kapal (hospital room) siap digunakan untuk keadaan darurat medis?', ismCode: '', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.2.9', no: '1.2.9', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.2 Ruang Akomodasi Awak Kapal', item: 'Apakah obat-obatan dan persediaan medis di atas kapal dikontrol dan dikelola dengan baik?', ismCode: '', defaultResult: '', remark: '', isStrikethrough: false },

  // 1.3 Area Geladak & Kamar Mesin
  { id: 'chk-1.3.1', no: '1.3.1', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.3 Area Geladak & Kamar Mesin', item: 'Apakah peralatan penutup bukaan kedap cuaca/air, alat keselamatan (LSA), dan alat pemadam kebakaran (FFA) dirawat dengan baik? (Sekoci, Rescue Boat, Fire Damper)', ismCode: '10', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.3.2', no: '1.3.2', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.3 Area Geladak & Kamar Mesin', item: 'Apakah lapisan cat pelindung pada bagian lambung kapal dan peralatan terpelihara dengan baik?', ismCode: '10', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.3.3', no: '1.3.3', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.3 Area Geladak & Kamar Mesin', item: 'Apakah terdapat bagian lambung atau peralatan yang mengalami kerusakan, korosi berat, atau berkarat?', ismCode: '10', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.3.4', no: '1.3.4', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.3 Area Geladak & Kamar Mesin', item: 'Apakah terdapat bagian peralatan atau mesin yang hanya diperbaiki secara darurat/sementara (temporary repair)?', ismCode: '10', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.3.6', no: '1.3.6', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.3 Area Geladak & Kamar Mesin', item: 'Apakah terdapat permesinan dan peralatan bantu yang fungsinya tidak beroperasi? (Pompa Pemadam, Pompa Pemadam Darurat, Sistem OWS)', ismCode: '10.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.3.7', no: '1.3.7', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.3 Area Geladak & Kamar Mesin', item: 'Apakah jalur penyelamatan diri (escape route) dan escape trunk dari kamar mesin dalam kondisi aman serta bebas hambatan?', ismCode: '8.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.3.8', no: '1.3.8', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.3 Area Geladak & Kamar Mesin', item: 'Apakah petunjuk pengoperasian pergantian kemudi darurat (steering changeover) terpasang di ruang kemudi?', ismCode: '8.2', defaultResult: '', remark: '', isStrikethrough: false },

  // 1.4 Wawancara Awak Kapal / ABK
  { id: 'chk-1.4.1', no: '1.4.1', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.4 Wawancara Awak Kapal / ABK', item: 'Wawancara dengan Awak Kapal (Geladak: Juru Mudi, Mesin: Juru Minyak, Katering: Koki) terkait penugasan dan peran di atas kapal', ismCode: '6.3', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.4.2', no: '1.4.2', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.4 Wawancara Awak Kapal / ABK', item: 'Kapan tanggal mulai bergabung (join date) masing-masing kru di atas kapal?', ismCode: '6.3', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.4.3', no: '1.4.3', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.4 Wawancara Awak Kapal / ABK', item: 'Apakah yang bersangkutan telah menjalani pelatihan familiarisasi segera setelah naik ke kapal?', ismCode: '6.3', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.4.4', no: '1.4.4', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.4 Wawancara Awak Kapal / ABK', item: 'Apakah instruksi penting sebelum berlayar (essential instructions prior to sailing) telah diberikan kepadanya?', ismCode: '8.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.4.5', no: '1.4.5', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.4 Wawancara Awak Kapal / ABK', item: 'Kapan terakhir kali yang bersangkutan mengikuti latihan meninggalkan kapal (abandon ship drill)?', ismCode: '8.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.4.6', no: '1.4.6', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.4 Wawancara Awak Kapal / ABK', item: 'Apakah yang bersangkutan memahami tugas dan tanggung jawabnya saat kondisi darurat sesuai Sijil Awak Kapal?', ismCode: '8.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.4.7', no: '1.4.7', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.4 Wawancara Awak Kapal / ABK', item: 'Apakah yang bersangkutan mampu mengenakan dan menggunakan pakaian pemadam kebakaran (fireman outfit) serta alat bantu pernapasan (EEBD/SCBA)?', ismCode: '8.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.4.8', no: '1.4.8', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.4 Wawancara Awak Kapal / ABK', item: 'Apakah yang bersangkutan memahami bunyi sinyal alarm saat terjadi berbagai jenis kondisi darurat?', ismCode: '8.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.4.9', no: '1.4.9', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.4 Wawancara Awak Kapal / ABK', item: 'Apakah pernah terjadi kecelakaan kerja atau insiden nyaris celaka (near-miss) di atas kapal?', ismCode: '9.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.4.10', no: '1.4.10', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.4 Wawancara Awak Kapal / ABK', item: 'Apakah awak kapal menerima salinan catatan jam istirahat harian (daily rest hours) yang telah disahkan oleh Nakhoda?', ismCode: '7', defaultResult: '', remark: '', isStrikethrough: false },

  // 1.5 Wawancara Nakhoda (Statutori & Pengawakan)
  { id: 'chk-1.5.1', no: '1.5.1', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.5 Wawancara Nakhoda (Master)', item: 'Apakah sertifikat statutori yang sah, Continuous Synopsis Record (CSR), dan catatan survey tersedia di atas kapal?', ismCode: '1.2.3.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.5.2', no: '1.5.2', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.5 Wawancara Nakhoda (Master)', item: 'Apakah masa berlaku sertifikat statutori kapal dilaporkan ke kantor manajemen perusahaan sesuai prosedur?', ismCode: '10.1 or 11.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.5.3', no: '1.5.3', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.5 Wawancara Nakhoda (Master)', item: 'Apakah sertifikat klasifikasi kapal dan catatan pemeriksaan yang masih berlaku tersedia lengkap di atas kapal?', ismCode: '1.2.3.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.5.4', no: '1.5.4', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.5 Wawancara Nakhoda (Master)', item: 'Apakah berkas ESP survey dan dokumen pendukung survey ESP tersedia di atas kapal?', ismCode: '1.2.3.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.5.5', no: '1.5.5', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.5 Wawancara Nakhoda (Master)', item: 'Apakah setiap pelaut dan awak kapal memegang sertifikat kesehatan pelaut (medical certificate) yang masih berlaku?', ismCode: '1.2.3.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.5.6', no: '1.5.6', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.5 Wawancara Nakhoda (Master)', item: 'Pemeriksaan jumlah dan kewarganegaraan Nakhoda, Perwira (Officers), dan Awak Kapal (Ratings) - Indonesia', ismCode: '6.2.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.5.7', no: '1.5.7', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.5 Wawancara Nakhoda (Master)', item: 'Apakah kapal diawaki sesuai dengan ketentuan Sertifikat Pengawakan Aman (Safe Manning Certificate)?', ismCode: '6.2.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.5.8', no: '1.5.8', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.5 Wawancara Nakhoda (Master)', item: 'Apakah Nakhoda dan masing-masing perwira memegang Sertifikat Keahlian Pelaut (COC) atau Dispensasi resmi sesuai STCW?', ismCode: '6.2.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.5.9', no: '1.5.9', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.5 Wawancara Nakhoda (Master)', item: 'Apabila berlayar di kapal berbendera selain negara penerbit, apakah pengesahan pengakuan (endorsement) telah dimiliki?', ismCode: '6.2.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.5.10', no: '1.5.10', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.5 Wawancara Nakhoda (Master)', item: 'Apakah dokumen asli sertifikat Nakhoda/Perwira dan surat pengesahannya tersimpan rapi di atas kapal?', ismCode: '6.2.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.5.11', no: '1.5.11', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.5 Wawancara Nakhoda (Master)', item: 'Apakah kelasi dan juru minyak yang ditugaskan dalam dinas jaga navigasi/kamar mesin telah tersertifikasi STCW?', ismCode: '6.2.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.5.12', no: '1.5.12', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.5 Wawancara Nakhoda (Master)', item: 'Apakah personil yang bertanggung jawab atas penanganan muatan tanker memegang sertifikat kompetensi penanganan kargo?', ismCode: '6.2.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.5.13', no: '1.5.13', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.5 Wawancara Nakhoda (Master)', item: 'Apakah seluruh awak yang ditugaskan menangani kargo tanker telah bersertifikat khusus?', ismCode: '6.2.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.5.14', no: '1.5.14', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.5 Wawancara Nakhoda (Master)', item: 'Apabila kapal dilengkapi ECDIS, apakah Nakhoda dan seluruh perwira deck telah menyelesaikan pelatihan Generic & Type Specific?', ismCode: '6.2.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.5.15', no: '1.5.15', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.5 Wawancara Nakhoda (Master)', item: 'Apakah hal-hal yang dipersyaratkan oleh konvensi SOLAS telah dicatat dan diisi dengan tertib pada buku harian kapal (log book)?', ismCode: '8.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.5.16', no: '1.5.16', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.5 Wawancara Nakhoda (Master)', item: 'Apakah hal-hal yang dipersyaratkan oleh SMS Perusahaan telah dicatat pada buku harian kapal (log book)?', ismCode: '7 or 8.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.5.17', no: '1.5.17', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.5 Wawancara Nakhoda (Master)', item: 'Apakah pencatatan pada Buku Catatan Minyak (Oil Record Book) terisi benar dan data memori alarm bilga 15ppm telah dibandingkan?', ismCode: '7', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.5.18', no: '1.5.18', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.5 Wawancara Nakhoda (Master)', item: 'Apakah pencatatan pada Buku Catatan Sampah (Garbage Record Book) dilaksanakan secara tertib?', ismCode: '7', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.5.19', no: '1.5.19', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.5 Wawancara Nakhoda (Master)', item: 'Apakah informasi yang memadai terkait keselamatan dan pencegahan pencemaran diberikan oleh Perusahaan kepada Nakhoda?', ismCode: '6.1.3', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.5.20', no: '1.5.20', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.5 Wawancara Nakhoda (Master)', item: 'Apakah pembaruan peraturan wajib maritim (IMO Conventions, Flag State) telah dimasukkan ke dalam SMS?', ismCode: '1.2.3.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.5.21', no: '1.5.21', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.5 Wawancara Nakhoda (Master)', item: 'Apakah kapal mematuhi instruksi otoritas Flag State (mis. Manajemen Keamanan Siber SE 35/2020 & Protokol Kesehatan SE 14/2020)?', ismCode: '1.2.3.1', defaultResult: '', remark: '', isStrikethrough: false },

  // 1.6, 1.7, 1.8 Penilaian Risiko & Kondisi Umum
  { id: 'chk-1.6', no: '1.6', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.6 Penilaian Risiko', item: 'Apakah seluruh risiko yang teridentifikasi terhadap kapal, personil, dan lingkungan telah dinilai dan safeguards yang memadai telah disediakan?', ismCode: '1.2.2.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.7', no: '1.7', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.7 Housekeeping', item: 'Apakah terdapat kesan umum penataan (housekeeping) yang baik serta kondisi fisik kapal dan peralatannya terpelihara rapi?', ismCode: '', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-1.8', no: '1.8', section: '1. TINJAUAN FISIK KAPAL & PERSYARATAN UMUM', subsection: '1.8 Kondisi Cuaca', item: 'Apakah terdapat kondisi cuaca buruk yang menghalangi akses keselamatan ke area-area tertentu di kapal selama audit?', ismCode: '', defaultResult: '', remark: '', isStrikethrough: false },

  // 2. KEBIJAKAN KESELAMATAN & PERLINDUNGAN LINGKUNGAN
  { id: 'chk-2.1', no: '2.1', section: '2. KEBIJAKAN KESELAMATAN & PERLINDUNGAN LINGKUNGAN', subsection: '2. Kebijakan K3L', item: 'Apakah Kebijakan Keselamatan dan Perlindungan Lingkungan Perusahaan tersedia di atas kapal?', ismCode: '2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-2.2', no: '2.2', section: '2. KEBIJAKAN KESELAMATAN & PERLINDUNGAN LINGKUNGAN', subsection: '2. Kebijakan K3L', item: 'Apakah Kebijakan Keselamatan dipahami oleh seluruh personil dan awak kapal?', ismCode: '2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-2.3', no: '2.3', section: '2. KEBIJAKAN KESELAMATAN & PERLINDUNGAN LINGKUNGAN', subsection: '2. Kebijakan K3L', item: 'Apakah Kebijakan Keselamatan diterapkan dan dipelihara pada semua tingkatan di atas kapal?', ismCode: '2', defaultResult: '', remark: '', isStrikethrough: false },

  // 3. TANGGUNG JAWAB & WEWENANG PERUSAHAAN
  { id: 'chk-3.1.1', no: '3.1.1', section: '3. TANGGUNG JAWAB & WEWENANG PERUSAHAAN', subsection: '3. Tanggung Jawab', item: 'Apakah nama Perusahaan yang tertera pada sertifikat DOC identik dengan pemilik kapal atau entitas yang dilaporkan sesuai ISM Code 3.1?', ismCode: '3.1 or 13.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-3.1.2', no: '3.1.2', section: '3. TANGGUNG JAWAB & WEWENANG PERUSAHAAN', subsection: '3. Tanggung Jawab', item: 'Apakah personil yang terlibat dalam SMS memiliki uraian tanggung jawab dan wewenang yang tegas dan tidak ambigu?', ismCode: '3.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-3.2', no: '3.2', section: '3. TANGGUNG JAWAB & WEWENANG PERUSAHAAN', subsection: '3. Tingkat Kompetensi', item: 'Apakah tingkat kompetensi yang dibutuhkan untuk masing-masing tugas telah ditetapkan dengan jelas?', ismCode: '3.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-3.3', no: '3.3', section: '3. TANGGUNG JAWAB & WEWENANG PERUSAHAAN', subsection: '3. Kualifikasi Kru', item: 'Apakah perwira memastikan bahwa personil memiliki kualifikasi dan pengalaman yang memadai untuk melaksanakan tugasnya?', ismCode: '3.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-3.4', no: '3.4', section: '3. TANGGUNG JAWAB & WEWENANG PERUSAHAAN', subsection: '3. Dukungan Sumber Daya', item: 'Apakah dukungan sumber daya yang memadai disediakan oleh Perusahaan dari darat ke kapal (suku cadang, logistik, dll)?', ismCode: '3.3', defaultResult: '', remark: '', isStrikethrough: false },

  // 4. PERSONEL YANG DITUNJUK DI DARAT (DPA)
  { id: 'chk-4.1', no: '4.1', section: '4. PERSONEL YANG DITUNJUK DI DARAT (DPA)', subsection: '4. Pemantauan DPA', item: 'Apakah kegiatan pemantauan oleh DPA terkait aspek keselamatan dan pencegahan pencemaran dinilai memadai?', ismCode: '4', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-4.2', no: '4.2', section: '4. PERSONEL YANG DITUNJUK DI DARAT (DPA)', subsection: '4. Identitas DPA', item: 'Apakah identitas dan jalur komunikasi DPA diketahui oleh Nakhoda dan para perwira?', ismCode: '4', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-4.3', no: '4.3', section: '4. PERSONEL YANG DITUNJUK DI DARAT (DPA)', subsection: '4. Peran DPA', item: 'Apakah peran dan tanggung jawab DPA dipahami secara baik oleh Nakhoda dan para perwira?', ismCode: '4', defaultResult: '', remark: '', isStrikethrough: false },

  // 5. TANGGUNG JAWAB & WEWENANG NAKHODA
  { id: 'chk-5.1', no: '5.1', section: "5. TANGGUNG JAWAB & WEWENANG NAKHODA", subsection: '5. Tanggung Jawab', item: 'Apakah Nakhoda memahami tanggung jawab dan wewenangnya sebagaimana dipersyaratkan oleh ISM Code Bagian 5?', ismCode: '6.1.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-5.2', no: '5.2', section: "5. TANGGUNG JAWAB & WEWENANG NAKHODA", subsection: '5. Kebijakan K3L', item: 'Apakah Nakhoda telah menerapkan Kebijakan Keselamatan dan Perlindungan Lingkungan Perusahaan di atas kapal?', ismCode: '5.1.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-5.3', no: '5.3', section: "5. TANGGUNG JAWAB & WEWENANG NAKHODA", subsection: '5. Motivasi Kru', item: 'Bagaimana cara Nakhoda memotivasi awak kapal untuk mematuhi kebijakan keselamatan Perusahaan?', ismCode: '5.1.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-5.4', no: '5.4', section: "5. TANGGUNG JAWAB & WEWENANG NAKHODA", subsection: '5. Perintah & Instruksi', item: 'Bagaimana cara Nakhoda menerbitkan perintah dan instruksi secara jelas, sederhana, dan dapat dipahami?', ismCode: '5.1.3', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-5.5', no: '5.5', section: "5. TANGGUNG JAWAB & WEWENANG NAKHODA", subsection: '5. Verifikasi Kepatuhan', item: 'Bagaimana cara Nakhoda memverifikasi bahwa persyaratan keselamatan yang ditentukan telah dipatuhi?', ismCode: '5.1.4', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-5.6', no: '5.6', section: "5. TANGGUNG JAWAB & WEWENANG NAKHODA", subsection: '5. Tinjauan SMS', item: 'Apakah Nakhoda telah melakukan peninjauan kembali (review) implementasi SMS dan melaporkan kekurangannya kepada Perusahaan?', ismCode: '5.1.5', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-5.7', no: '5.7', section: "5. TANGGUNG JAWAB & WEWENANG NAKHODA", subsection: '5. Overriding Authority', item: 'Apakah Nakhoda menyadari wewenang mutlaknya (Overriding Authority) serta wewenang meminta bantuan darat jika diperlukan?', ismCode: '5.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-5.8', no: '5.8', section: "5. TANGGUNG JAWAB & WEWENANG NAKHODA", subsection: '5. Penilaian Risiko', item: 'Apakah Nakhoda telah melaksanakan Penilaian Risiko (Risk Assessment) sesuai prosedur SMS yang ditetapkan Perusahaan?', ismCode: '1.2.2.2', defaultResult: '', remark: '', isStrikethrough: false },

  // 6. SUMBER DAYA & PERSONIL (CREWING)
  { id: 'chk-6.1', no: '6.1', section: '6. SUMBER DAYA & AWAK KAPAL (CREWING)', subsection: '6. Pemahaman Bagian 6', item: 'Apakah Nakhoda memahami persyaratan SMS terkait Bagian 6 ISM Code (Sumber Daya & Personil)?', ismCode: '6.1.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-6.2', no: '6.2', section: '6. SUMBER DAYA & AWAK KAPAL (CREWING)', subsection: '6. Pre-Joining Training', item: 'Apakah seluruh awak kapal telah menerima pelatihan sebelum naik kapal (Pre-joining training) sesuai prosedur?', ismCode: '6.1.2 or 6.5', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-6.3', no: '6.3', section: '6. SUMBER DAYA & AWAK KAPAL (CREWING)', subsection: '6. Kualifikasi & Kesehatan', item: 'Apakah kapal diawaki oleh pelaut yang berkualifikasi, bersertifikat sah, dan sehat secara medis sesuai regulasi?', ismCode: '6.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-6.4', no: '6.4', section: '6. SUMBER DAYA & AWAK KAPAL (CREWING)', subsection: '6. Pelatihan Onboard', item: 'Apakah pelatihan di atas kapal (on-board training) dan instruksi keselamatan telah dilaksanakan sesuai panduan?', ismCode: '6.5', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-6.5', no: '6.5', section: '6. SUMBER DAYA & AWAK KAPAL (CREWING)', subsection: '6. Familiarisasi STCW', item: 'Apakah awak kapal yang baru bergabung menerima pelatihan familiarisasi keselamatan yang dipersyaratkan oleh STCW?', ismCode: '6.3', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-6.6', no: '6.6', section: '6. SUMBER DAYA & AWAK KAPAL (CREWING)', subsection: '6. Pemahaman Aturan', item: 'Apakah terdapat bukti bahwa seluruh personil yang terlibat SMS memiliki pemahaman yang memadai mengenai aturan dan regulasi?', ismCode: '6.4', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-6.7', no: '6.7', section: '6. SUMBER DAYA & AWAK KAPAL (CREWING)', subsection: '6. Familiarisasi SOLAS', item: 'Apakah kru baru telah menerima familiarisasi yang dipersyaratkan SOLAS dalam waktu 2 minggu setelah bergabung?', ismCode: '6.5', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-6.8', no: '6.8', section: '6. SUMBER DAYA & AWAK KAPAL (CREWING)', subsection: '6. Latihan Wajib SOLAS', item: 'Apakah pelatihan dan instruksi di atas kapal yang dipersyaratkan oleh konvensi SOLAS dilaksanakan secara berkala?', ismCode: '6.5', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-6.9', no: '6.9', section: '6. SUMBER DAYA & AWAK KAPAL (CREWING)', subsection: '6. Bahasa Kerja Resmi', item: 'Apakah bahasa kerja resmi yang ditentukan oleh Perusahaan telah dicatat dalam buku harian kapal (Bahasa Indonesia)?', ismCode: '6.6', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-6.10', no: '6.10', section: '6. SUMBER DAYA & AWAK KAPAL (CREWING)', subsection: '6. Bahasa Dokumen SMS', item: 'Apakah dokumen dan instruksi terkait SMS disajikan dalam bahasa yang dipahami oleh seluruh awak kapal?', ismCode: '6.6', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-6.11', no: '6.11', section: '6. SUMBER DAYA & AWAK KAPAL (CREWING)', subsection: '6. Pemahaman Manual', item: 'Apakah seluruh awak kapal mampu membaca dan memahami manual SMS yang berlaku di atas kapal?', ismCode: '6.6', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-6.12', no: '6.12', section: '6. SUMBER DAYA & AWAK KAPAL (CREWING)', subsection: '6. Mitigasi Bahasa', item: 'Apakah Perusahaan menetapkan rencana/tindakan apabila ada awak kapal yang kesulitan memahami manual SMS?', ismCode: '6.6', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-6.13', no: '6.13', section: '6. SUMBER DAYA & AWAK KAPAL (CREWING)', subsection: '6. Komunikasi Efektif', item: 'Apakah para awak kapal mampu berkomunikasi secara efektif dalam melaksanakan tugas operasional mereka?', ismCode: '6.7', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-6.14', no: '6.14', section: '6. SUMBER DAYA & AWAK KAPAL (CREWING)', subsection: '6. Kesadaran SMS Nakhoda', item: 'Apakah tingkat kesadaran SMS Nakhoda berada pada batas yang memuaskan dan dapat diterima?', ismCode: '6.1.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-6.15', no: '6.15', section: '6. SUMBER DAYA & AWAK KAPAL (CREWING)', subsection: '6. Dukungan untuk Nakhoda', item: 'Apakah Nakhoda diberikan dukungan yang diperlukan oleh manajemen darat agar tugas-tugasnya terlaksana aman?', ismCode: '6.1.3', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-6.16', no: '6.16', section: '6. SUMBER DAYA & AWAK KAPAL (CREWING)', subsection: '6. Wawancara Nakhoda & Kru', item: 'Apakah wawancara langsung dengan Nakhoda dan para awak kapal telah dilaksanakan oleh auditor?', ismCode: '', defaultResult: '', remark: '', isStrikethrough: false },

  // 7. OPERASIONAL KAPAL DI LAUT (SHIPBOARD OPERATIONS)
  { id: 'chk-7.1', no: '7.1', section: '7. OPERASIONAL KAPAL DI LAUT', subsection: '7. Pengoperasian SMS', item: 'Apakah seluruh pengoperasian di atas kapal dilaksanakan sesuai dengan manual SMS Perusahaan?', ismCode: '7', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-7.2', no: '7.2', section: '7. OPERASIONAL KAPAL DI LAUT', subsection: '7. Rencana Pelayaran', item: 'Apakah persiapan dan operasional keberangkatan kapal (Voyage Plan) dilaksanakan sesuai prosedur?', ismCode: '7', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-7.3', no: '7.3', section: '7. OPERASIONAL KAPAL DI LAUT', subsection: '7. Laporan Harian Kapal', item: 'Apakah Laporan Harian (Daily Report: posisi, haluan, kecepatan) dikirimkan ke Perusahaan pemegang DOC setiap hari?', ismCode: '7', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-7.4', no: '7.4', section: '7. OPERASIONAL KAPAL DI LAUT', subsection: '7. Operasional Kedatangan', item: 'Apakah operasional saat kedatangan kapal di pelabuhan dilaksanakan sesuai prosedur SMS?', ismCode: '7', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-7.5', no: '7.5', section: '7. OPERASIONAL KAPAL DI LAUT', subsection: '7. Jenis Muatan / Towing', item: 'Jenis muatan atau penarikan tongkang apa yang ditangani oleh kapal?', ismCode: '7', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-7.6', no: '7.6', section: '7. OPERASIONAL KAPAL DI LAUT', subsection: '7. Kompatibilitas Muatan', item: 'Apakah Nakhoda memastikan kompatibilitas muatan, menandatangani, dan menyimpan Informasi Muatan (Cargo Information) dengan benar?', ismCode: '7', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-7.7', no: '7.7', section: '7. OPERASIONAL KAPAL DI LAUT', subsection: '7. Penanganan Kargo / Towing', item: 'Apakah operasional penanganan kargo / towing tongkang telah dilakukan sesuai prosedur yang ditetapkan?', ismCode: '7', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-7.8', no: '7.8', section: '7. OPERASIONAL KAPAL DI LAUT', subsection: '7. Pencegahan Pencemaran', item: 'Apakah operasional pencegahan pencemaran lingkungan laut telah dilakukan sesuai ketentuan prosedur?', ismCode: '7', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-7.9', no: '7.9', section: '7. OPERASIONAL KAPAL DI LAUT', subsection: '7. Operasi Khusus', item: 'Apakah pengoperasian khusus yang telah teridentifikasi dilaksanakan sesuai prosedur terdokumentasi?', ismCode: '7', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-7.10', no: '7.10', section: '7. OPERASIONAL KAPAL DI LAUT', subsection: '7. Dinas Jaga & Jam Istirahat', item: 'Apakah pelaksanaan dinas jaga navigasi dan kamar mesin dilaksanakan sesuai prosedur (jam istirahat, batas alkohol <0.05% BAC, BRM/ERM)?', ismCode: '7', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-7.11', no: '7.11', section: '7. OPERASIONAL KAPAL DI LAUT', subsection: '7. Observasi Lapangan', item: 'Apakah operasional kapal yang sedang berlangsung diamati secara langsung oleh auditor BKI?', ismCode: '', defaultResult: '', remark: '', isStrikethrough: false },

  // 8. KESIAPSIAGAAN KEADAAN DARURAT (EMERGENCY PREPAREDNESS)
  { id: 'chk-8.1', no: '8.1', section: '8. KESIAPSIAGAAN KEADAAN DARURAT (DRILLS)', subsection: '8. Kesiapan Darurat', item: 'Apakah kapal dalam kondisi siap menghadapi potensi situasi darurat yang telah diidentifikasi?', ismCode: '8.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-8.2', no: '8.2', section: '8. KESIAPSIAGAAN KEADAAN DARURAT (DRILLS)', subsection: '8. Kontak Darurat', item: 'Apakah Perusahaan telah menyediakan daftar kontak darurat (emergency contact list) terkini di atas kapal?', ismCode: '8.3', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-8.3', no: '8.3', section: '8. KESIAPSIAGAAN KEADAAN DARURAT (DRILLS)', subsection: '8. Pemahaman Nakhoda', item: 'Apakah Nakhoda memahami prosedur tanggap darurat untuk setiap jenis situasi darurat yang teridentifikasi?', ismCode: '8.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-8.4', no: '8.4', section: '8. KESIAPSIAGAAN KEADAAN DARURAT (DRILLS)', subsection: '8. Pelaksanaan Latihan', item: 'Apakah latihan dan simulasi keadaan darurat (drills & exercises) dilaksanakan sesuai prosedur terdokumentasi?', ismCode: '8.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-8.5', no: '8.5', section: '8. KESIAPSIAGAAN KEADAAN DARURAT (DRILLS)', subsection: '8. Sinyal Marabahaya GMDSS', item: 'Apakah personil operator radio memahami tata cara pengiriman sinyal marabahaya (distress alert) pada sistem GMDSS?', ismCode: '8.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-8.6', no: '8.6', section: '8. KESIAPSIAGAAN KEADAAN DARURAT (DRILLS)', subsection: '8. SOPEP / SMPEP', item: 'Apakah buku panduan SOPEP / SMPEP dikontrol dengan baik dan memuat daftar kontak darurat terbaru?', ismCode: '8.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-8.7', no: '8.7', section: '8. KESIAPSIAGAAN KEADAAN DARURAT (DRILLS)', subsection: '8. Towing Booklet', item: 'Apakah Buku Panduan Penundaan Darurat (Emergency Towing Booklet) spesifik kapal tersedia di Anjungan dan Haluan?', ismCode: '8.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-8.8', no: '8.8', section: '8. KESIAPSIAGAAN KEADAAN DARURAT (DRILLS)', subsection: '8. Latihan Wajib Rutin', item: 'Apakah latihan darurat wajib (kebakaran, sekoci/meninggalkan kapal) dilaksanakan secara rutin sesuai jadwal?', ismCode: '8.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-8.9', no: '8.9', section: '8. KESIAPSIAGAAN KEADAAN DARURAT (DRILLS)', subsection: '8. Riwayat Kecelakaan Laut', item: 'Apakah kapal pernah mengalami kecelakaan laut (sea casualty) atau cedera serius sejak audit terakhir?', ismCode: '-', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-8.10', no: '8.10', section: '8. KESIAPSIAGAAN KEADAAN DARURAT (DRILLS)', subsection: '8. Dukungan Perusahaan', item: 'Apakah Perusahaan memberikan dukungan yang diperlukan kepada Nakhoda sesuai prosedur saat terjadi insiden?', ismCode: '8.3', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-8.11', no: '8.11', section: '8. KESIAPSIAGAAN KEADAAN DARURAT (DRILLS)', subsection: '8. Tindakan Darurat', item: 'Apakah tanggapan dan tindakan darurat telah diambil oleh kapal sesuai dengan prosedur yang ditetapkan?', ismCode: '8.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-8.12', no: '8.12', section: '8. KESIAPSIAGAAN KEADAAN DARURAT (DRILLS)', subsection: '8. Tinjauan Pasca Insiden', item: 'Apakah sistem SMS ditinjau kembali berdasarkan hasil investigasi insiden tersebut?', ismCode: '9.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-8.13', no: '8.13', section: '8. KESIAPSIAGAAN KEADAAN DARURAT (DRILLS)', subsection: '8. Saksi Simulasi Darurat', item: 'Apakah pelaksanaan simulasi darurat (kebakaran / orang jatuh ke laut) disaksikan langsung oleh auditor BKI?', ismCode: '-', defaultResult: '', remark: '', isStrikethrough: false },

  // 9. LAPORAN & ANALISIS KETIDAKSESUAIAN (NC)
  { id: 'chk-9.1', no: '9.1', section: '9. LAPORAN & ANALISIS KETIDAKSESUAIAN (NC)', subsection: '9. Penanganan Temuan', item: 'Apakah seluruh temuan kekurangan dan ketidaksesuaian ditangani sesuai dengan ketentuan SMS Perusahaan?', ismCode: '9.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-9.2', no: '9.2', section: '9. LAPORAN & ANALISIS KETIDAKSESUAIAN (NC)', subsection: '9. Pelaporan ke Darat', item: 'Apakah terdapat laporan ketidaksesuaian (NC), kecelakaan, dan insiden nyaris celaka yang dilaporkan ke kantor darat?', ismCode: '9.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-9.3', no: '9.3', section: '9. LAPORAN & ANALISIS KETIDAKSESUAIAN (NC)', subsection: '9. Pemeriksaan PSC', item: 'Apakah kapal pernah diperiksa oleh Port State Control (PSC) sejak audit terakhir?', ismCode: '9.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-9.4', no: '9.4', section: '9. LAPORAN & ANALISIS KETIDAKSESUAIAN (NC)', subsection: '9. Catatan Riwayat PSC', item: 'Apakah seluruh catatan riwayat pemeriksaan PSC tersimpan lengkap di kapal dibandingkan riwayat resmi?', ismCode: '9.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-9.5', no: '9.5', section: '9. LAPORAN & ANALISIS KETIDAKSESUAIAN (NC)', subsection: '9. Inspeksi Pihak Ketiga', item: 'Apakah terdapat kekurangan yang diidentifikasi pada inspeksi pihak ketiga (charterer, P&I Club) sejak audit terakhir?', ismCode: '9.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-9.6', no: '9.6', section: '9. LAPORAN & ANALISIS KETIDAKSESUAIAN (NC)', subsection: '9. Kewajiban Lapor', item: 'Apakah seluruh NC, kecelakaan, dan insiden yang wajib lapor telah disampaikan kepada Perusahaan?', ismCode: '9.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-9.7', no: '9.7', section: '9. LAPORAN & ANALISIS KETIDAKSESUAIAN (NC)', subsection: '9. Respons Manajemen', item: 'Apakah Perusahaan merespons dan menindaklanjuti kekurangan yang dilaporkan dari kapal?', ismCode: '9.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-9.8', no: '9.8', section: '9. LAPORAN & ANALISIS KETIDAKSESUAIAN (NC)', subsection: '9. Tindakan Perbaikan', item: 'Apakah tindakan perbaikan terhadap kekurangan yang dilaporkan telah dilaksanakan secara efektif?', ismCode: '9.2', defaultResult: '', remark: '', isStrikethrough: false },

  // 10. PEMELIHARAAN KAPAL & PERALATAN (PMS)
  { id: 'chk-10.1', no: '10.1', section: '10. PEMELIHARAAN KAPAL & PERALATAN (PMS)', subsection: '10. Perawatan Kapal & Alat', item: 'Apakah kapal dan peralatannya dirawat secara memadai sesuai aturan statutori dan persyaratan Perusahaan?', ismCode: '10.2.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-10.2', no: '10.2', section: '10. PEMELIHARAAN KAPAL & PERALATAN (PMS)', subsection: '10. Program Terencana', item: 'Apakah pemeliharaan kapal dan perlengkapannya dilaksanakan sesuai rencana terencana (PMS) yang telah ditetapkan?', ismCode: '10.2.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-10.3', no: '10.3', section: '10. PEMELIHARAAN KAPAL & PERALATAN (PMS)', subsection: '10. Catatan Perawatan', item: 'Apakah pekerjaan perawatan yang telah dilaksanakan dicatat dan didokumentasikan dengan tertib?', ismCode: '10.2.4', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-10.4', no: '10.4', section: '10. PEMELIHARAAN KAPAL & PERALATAN (PMS)', subsection: '10. Perlengkapan Kritis', item: 'Apakah tindakan khusus untuk peralatan penting dan sistem teknis kritis (Critical Equipment) telah diambil sesuai prosedur?', ismCode: '10.3', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-10.5', no: '10.5', section: '10. PEMELIHARAAN KAPAL & PERALATAN (PMS)', subsection: '10. Manual Sekoci & Dewi-dewi', item: 'Apakah manual pemeliharaan dan dokumen pengetesan sekoci serta alat peluncurnya dikontrol dengan baik?', ismCode: '10.2.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-10.6', no: '10.6', section: '10. PEMELIHARAAN KAPAL & PERALATAN (PMS)', subsection: '10. Inspeksi Rutin Sekoci', item: 'Apakah pemeriksaan mingguan dan bulanan sekoci dilaksanakan di bawah pengawasan perwira senior?', ismCode: '10.2.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-10.7', no: '10.7', section: '10. PEMELIHARAAN KAPAL & PERALATAN (PMS)', subsection: '10. Catatan Servis Sekoci', item: 'Apakah catatan pemeriksaan dan perbaikan sekoci ditandatangani oleh pelaksana dan disahkan oleh Nakhoda?', ismCode: '10.2.4', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-10.8', no: '10.8', section: '10. PEMELIHARAAN KAPAL & PERALATAN (PMS)', subsection: '10. Laporan Kerusakan Teknis', item: 'Apakah terdapat laporan kerusakan teknis peralatan yang dilaporkan kepada manajemen Perusahaan?', ismCode: '10.2.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-10.9', no: '10.9', section: '10. PEMELIHARAAN KAPAL & PERALATAN (PMS)', subsection: '10. Respons Perbaikan', item: 'Apakah Perusahaan menanggapi dan mengirimkan dukungan perbaikan terhadap laporan kerusakan teknis tersebut?', ismCode: '10.2.3', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-10.10', no: '10.10', section: '10. PEMELIHARAAN KAPAL & PERALATAN (PMS)', subsection: '10. Penyelesaian Perbaikan', item: 'Apakah tindakan korektif terhadap laporan kerusakan teknis telah diselesaikan tuntas?', ismCode: '10.2.3', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-10.11', no: '10.11', section: '10. PEMELIHARAAN KAPAL & PERALATAN (PMS)', subsection: '10. Temuan Fisik Auditor', item: 'Apakah kekurangan yang ditemukan auditor saat tinjauan fisik kapal sudah teridentifikasi sebelumnya oleh awak kapal?', ismCode: '-', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-10.12', no: '10.12', section: '10. PEMELIHARAAN KAPAL & PERALATAN (PMS)', subsection: '10. Pelaporan Temuan Fisik', item: 'Apakah kekurangan fisik tersebut telah dilaporkan ke Perusahaan untuk proses tindak lanjut?', ismCode: '10.2.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-10.13', no: '10.13', section: '10. PEMELIHARAAN KAPAL & PERALATAN (PMS)', subsection: '10. Perbaikan Darurat', item: 'Apabila dilakukan perbaikan darurat/sementara, apakah prosedur dan jadwalnya telah mengikuti instruksi Perusahaan?', ismCode: '10.2.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-10.14', no: '10.14', section: '10. PEMELIHARAAN KAPAL & PERALATAN (PMS)', subsection: '10. Rencana Perawatan Ulang', item: 'Apakah item yang rusak tersebut tercakup dalam program perawatan terencana (PMS) kapal?', ismCode: '10.1 or 10.2.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-10.15', no: '10.15', section: '10. PEMELIHARAAN KAPAL & PERALATAN (PMS)', subsection: '10. Hasil Inspeksi Terakhir', item: 'Apa hasil pemeriksaan berkala terakhir kapal terhadap item perlengkapan yang rusak tersebut?', ismCode: '10.1', defaultResult: '', remark: '', isStrikethrough: false },

  // 11. PENDOKUMENTASIAN SISTEM (SMS)
  { id: 'chk-11.1', no: '11.1', section: '11. PENDOKUMENTASIAN SISTEM (SMS)', subsection: '11. Pengendalian Dokumen', item: 'Apakah seluruh dokumen dan data keselamatan dikontrol sesuai prosedur dokumentasi SMS Perusahaan?', ismCode: '11.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-11.2', no: '11.2', section: '11. PENDOKUMENTASIAN SISTEM (SMS)', subsection: '11. Status Edisi Manual', item: 'Apakah manual SMS yang ada di atas kapal merupakan edisi/revisi termutakhir yang berlaku?', ismCode: '11.2.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-11.3', no: '11.3', section: '11. PENDOKUMENTASIAN SISTEM (SMS)', subsection: '11. Riwayat Revisi', item: 'Apakah setiap riwayat revisi dan amandemen manual SMS telah dicatat secara tertib?', ismCode: '11.2.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-11.4', no: '11.4', section: '11. PENDOKUMENTASIAN SISTEM (SMS)', subsection: '11. Dokumen Usang', item: 'Apakah dokumen-dokumen yang sudah usang (obsolete) telah ditarik dan dimusnahkan dari peredaran?', ismCode: '11.2.3', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-11.5', no: '11.5', section: '11. PENDOKUMENTASIAN SISTEM (SMS)', subsection: '11. Ketersediaan Manual', item: 'Apakah manual SMS tersedia di seluruh lokasi penting yang relevan di atas kapal?', ismCode: '11.2.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-11.6', no: '11.6', section: '11. PENDOKUMENTASIAN SISTEM (SMS)', subsection: '11. Surat Edaran Perusahaan', item: 'Apakah surat edaran (circular letters) dari Perusahaan diarsipkan rapi dan mudah diidentifikasi?', ismCode: '11.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-11.7', no: '11.7', section: '11. PENDOKUMENTASIAN SISTEM (SMS)', subsection: '11. Publikasi Wajib', item: 'Apakah publikasi maritim wajib yang dipersyaratkan di bawah SMS telah diperbarui?', ismCode: '11.2.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-11.8', no: '11.8', section: '11. PENDOKUMENTASIAN SISTEM (SMS)', subsection: '11. Gambar Konstruksi As-Built', item: 'Apakah Gambar Konstruksi Terpasang (As-Built Drawings) dan rencana modifikasi struktur tersedia di atas kapal?', ismCode: '11.2.1', defaultResult: '', remark: '', isStrikethrough: false },

  // 12. VERIFIKASI, TINJAUAN & EVALUASI PERUSAHAAN (INTERNAL AUDIT)
  { id: 'chk-12.1', no: '12.1', section: '12. VERIFIKASI, TINJAUAN & EVALUASI PERUSAHAAN (INTERNAL AUDIT)', subsection: '12. Pelaksanaan Audit Internal', item: 'Apakah audit internal keselamatan dilaksanakan sesuai dengan ketentuan SMS Perusahaan?', ismCode: '12.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-12.2', no: '12.2', section: '12. VERIFIKASI, TINJAUAN & EVALUASI PERUSAHAAN (INTERNAL AUDIT)', subsection: '12. Perpanjangan Audit', item: 'Apakah prosedur dan kriteria perpanjangan audit internal maksimal 3 bulan pada kondisi darurat telah ditetapkan?', ismCode: '12.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-12.3', no: '12.3', section: '12. VERIFIKASI, TINJAUAN & EVALUASI PERUSAHAAN (INTERNAL AUDIT)', subsection: '12. Interval 12 Bulan', item: 'Apakah audit internal terakhir dilaksanakan dengan interval tidak melebihi 12 bulan?', ismCode: '12.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-12.4', no: '12.4', section: '12. VERIFIKASI, TINJAUAN & EVALUASI PERUSAHAAN (INTERNAL AUDIT)', subsection: '12. Prosedur Perpanjangan', item: 'Apabila pelaksanaan audit internal diperpanjang, apakah perpanjangan tersebut telah dilakukan sesuai ketentuan SMS?', ismCode: '12.1', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-12.5', no: '12.5', section: '12. VERIFIKASI, TINJAUAN & EVALUASI PERUSAHAAN (INTERNAL AUDIT)', subsection: '12. Tindakan Korektif', item: 'Apakah pelaksanaan audit internal dan tindakan perbaikannya telah dijalankan sesuai prosedur terdokumentasi?', ismCode: '12.4', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-12.6', no: '12.6', section: '12. VERIFIKASI, TINJAUAN & EVALUASI PERUSAHAAN (INTERNAL AUDIT)', subsection: '12. Auditor Independen', item: 'Apakah audit internal dilaksanakan oleh personil yang independen (bukan awak yang bertugas di kapal tersebut)?', ismCode: '12.5', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-12.7', no: '12.7', section: '12. VERIFIKASI, TINJAUAN & EVALUASI PERUSAHAAN (INTERNAL AUDIT)', subsection: '12. Arsip Laporan Audit', item: 'Apakah catatan hasil audit internal tersimpan dengan baik di atas kapal?', ismCode: '12.6', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-12.8', no: '12.8', section: '12. VERIFIKASI, TINJAUAN & EVALUASI PERUSAHAAN (INTERNAL AUDIT)', subsection: '12. Pemahaman Hasil', item: 'Apakah Nakhoda dan para perwira mengetahui serta memahami hasil temuan audit internal tersebut?', ismCode: '12.6', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-12.9', no: '12.9', section: '12. VERIFIKASI, TINJAUAN & EVALUASI PERUSAHAAN (INTERNAL AUDIT)', subsection: '12. Temuan Ketidaksesuaian', item: 'Apakah terdapat ketidaksesuaian (NC) yang diterbitkan pada pelaksanaan audit internal tersebut?', ismCode: '12.7', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-12.10', no: '12.10', section: '12. VERIFIKASI, TINJAUAN & EVALUASI PERUSAHAAN (INTERNAL AUDIT)', subsection: '12. Ketepatan Waktu CAP', item: 'Apakah tindakan korektif yang tepat waktu telah diselesaikan terhadap ketidaksesuaian tersebut?', ismCode: '12.7', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-12.11', no: '12.11', section: '12. VERIFIKASI, TINJAUAN & EVALUASI PERUSAHAAN (INTERNAL AUDIT)', subsection: '12. Hasil Tinjauan Manajemen', item: 'Apakah Perusahaan telah memberitahukan hasil tinjauan manajemen (Management Review) kepada pihak kapal?', ismCode: '12.6', defaultResult: '', remark: '', isStrikethrough: false },

  // TAMBAHAN BERDASARKAN TIPE KAPAL (BAGIAN A S/D E)
  // A. KAPAL TANKER MINYAK (OIL TANKER)
  { id: 'chk-add-A.1', no: 'A.1', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'A. Kapal Tanker Minyak (Oil Tanker)', item: 'Apakah instrumen pengukur konsentrasi gas mudah terbakar telah dikalibrasi secara benar?', ismCode: 'SOLAS II-2/4-5.7', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-add-A.2', no: 'A.2', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'A. Kapal Tanker Minyak (Oil Tanker)', item: 'Apakah catatan pembuangan slop dan penutupan katup dicatat dalam Buku Catatan Minyak Bagian II?', ismCode: 'MARPOL Annex I', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-add-A.3', no: 'A.3', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'A. Kapal Tanker Minyak (Oil Tanker)', item: 'Apakah terdapat catatan pelaksanaan pencucian minyak mentah (COW) di Buku Catatan Minyak Bagian II?', ismCode: 'MARPOL Annex I', defaultResult: '', remark: '', isStrikethrough: false },

  // B. KAPAL PENGANGKUT GAS (GAS CARRIER)
  { id: 'chk-add-B.1', no: 'B.1', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'B. Kapal Pengangkut Gas (Gas Carrier)', item: 'Apakah instrumen pengukur konsentrasi gas portabel dan tetap telah dikalibrasi secara berkala?', ismCode: 'IGC Code 13.6.6', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-add-B.2', no: 'B.2', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'B. Kapal Pengangkut Gas (Gas Carrier)', item: 'Apakah awak kapal penanggung jawab muatan telah terlatih untuk penanganan aman kargo gas dan darurat?', ismCode: 'IGC Code 18.3', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-add-B.3', no: 'B.3', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'B. Kapal Pengangkut Gas (Gas Carrier)', item: 'Apakah awak kapal memahami prosedur Perusahaan untuk memasuki palka kargo, tangki, dan ruang tertutup (enclosed space)?', ismCode: 'IGC Code 18.4', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-add-B.4', no: 'B.4', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'B. Kapal Pengangkut Gas (Gas Carrier)', item: 'Apakah muatan gas yang diangkut kapal tercantum dalam Lampiran Sertifikat Kelaikan Muat Gas (Gas Fitness Certificate)?', ismCode: 'IGC Code 18.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-add-B.5', no: 'B.5', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'B. Kapal Pengangkut Gas (Gas Carrier)', item: 'Apabila terjadi pergantian jenis muatan gas, apakah pembersihan tangki dilakukan sesuai prosedur?', ismCode: 'IGC Code 18.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-add-B.6', no: 'B.6', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'B. Kapal Pengangkut Gas (Gas Carrier)', item: 'Apabila mengangkut beberapa gas sekaligus, apakah potensi reaksi berbahaya antar gas telah diinvestigasi?', ismCode: 'IGC Code 18.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-add-B.7', no: 'B.7', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'B. Kapal Pengangkut Gas (Gas Carrier)', item: 'Apakah kegiatan penanganan kargo MARPOL Lampiran II dicatat dalam Buku Catatan Kargo (Cargo Record Book)?', ismCode: 'MARPOL Annex II', defaultResult: '', remark: '', isStrikethrough: false },

  // C. KAPAL TANKER KIMIA (CHEMICAL TANKER)
  { id: 'chk-add-C.1', no: 'C.1', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'C. Kapal Tanker Kimia (Chemical Tanker)', item: 'Apakah awak kapal yang bertugas menangani muatan kimia terlatih dengan memadai untuk penanganan aman dan darurat?', ismCode: 'IBC Code 16.3', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-add-C.2', no: 'C.2', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'C. Kapal Tanker Kimia (Chemical Tanker)', item: 'Apakah awak kapal memahami prosedur Perusahaan untuk membuka dan memasuki tangki kargo kimia?', ismCode: 'IBC Code 16.4', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-add-C.3', no: 'C.3', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'C. Kapal Tanker Kimia (Chemical Tanker)', item: 'Apakah kegiatan penanganan muatan kimia MARPOL Lampiran II dicatat dalam Buku Catatan Kargo?', ismCode: 'MARPOL Annex II', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-add-C.4', no: 'C.4', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'C. Kapal Tanker Kimia (Chemical Tanker)', item: 'Apabila mengangkut campuran muatan kimia, apakah total potensi bahaya telah dinilai ahli sebelum pemuatan?', ismCode: 'IBC Code 16.2.2', defaultResult: '', remark: '', isStrikethrough: false },

  // D. KAPAL CURAH (BULK CARRIER)
  { id: 'chk-add-D.1', no: 'D.1', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'D. Kapal Curah (Bulk Carrier)', item: 'Apakah pelatihan dan simulasi evakuasi darurat saat terjadi kebanjiran palka muat dilaksanakan sesuai prosedur?', ismCode: 'SOLAS Reg. XII/9', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-add-D.2', no: 'D.2', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'D. Kapal Curah (Bulk Carrier)', item: 'Apakah Rencana Pemeliharaan Tutup Palka (Hatch Cover Maintenance Plan) sesuai MSC 169(79) telah tercakup dalam SMS?', ismCode: 'SOLAS Reg. XII/7.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-add-D.3', no: 'D.3', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'D. Kapal Curah (Bulk Carrier)', item: 'Apakah kapal dilengkapi prosedur penanganan kargo yang berpotensi mencair (seperti konsentrat nikel)?', ismCode: 'IMSBC Code', defaultResult: '', remark: '', isStrikethrough: false },

  // E. KAPAL CURAH BONGKAR MANDIRI (SELF-UNLOADING BULK CARRIERS)
  { id: 'chk-add-E.1', no: 'E.1', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'E. Kapal Curah Bongkar Mandiri (Self-Unloading)', item: 'Apakah terdapat prosedur penilaian risiko keselamatan kebakaran sistem konveyor di dalam SMS? (IMSBC Code 3.1.2)', ismCode: 'IMSBC 3.1.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-add-E.2', no: 'E.2', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'E. Kapal Curah Bongkar Mandiri (Self-Unloading)', item: 'Apakah ruang lingkup penilaian risiko kebakaran sistem konveyor mencakup area penanganan kargo bongkar mandiri?', ismCode: 'IMSBC 3.1.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-add-E.3', no: 'E.3', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'E. Kapal Curah Bongkar Mandiri (Self-Unloading)', item: 'Apakah sistem konveyor dirawat secara berkala (perawatan bantalan rotor dan poros konveyor)?', ismCode: 'IMSBC 3.1.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-add-E.4', no: 'E.4', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'E. Kapal Curah Bongkar Mandiri (Self-Unloading)', item: 'Apakah sistem pemadam kebakaran sistem konveyor (alarm deteksi api, dll.) dalam kondisi siap beroperasi?', ismCode: 'IMSBC 3.1.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-add-E.5', no: 'E.5', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'E. Kapal Curah Bongkar Mandiri (Self-Unloading)', item: 'Apakah kondisi operasi dan pengawasan pekerjaan panas (hot work) di dekat sistem konveyor terkontrol ketat?', ismCode: 'IMSBC 3.1.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-add-E.6', no: 'E.6', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'E. Kapal Curah Bongkar Mandiri (Self-Unloading)', item: 'Siapakah pihak yang bertanggung jawab atas penerapan penilaian risiko keselamatan kebakaran sistem konveyor?', ismCode: 'IMSBC 3.1.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-add-E.7', no: 'E.7', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'E. Kapal Curah Bongkar Mandiri (Self-Unloading)', item: 'Apakah hasil penilaian risiko keselamatan kebakaran ditinjau pada pertemuan evaluasi sistem keselamatan kapal?', ismCode: 'IMSBC 3.1.2', defaultResult: '', remark: '', isStrikethrough: false },
  { id: 'chk-add-E.8', no: 'E.8', section: 'TAMBAHAN BERDASARKAN TIPE KAPAL', subsection: 'E. Kapal Curah Bongkar Mandiri (Self-Unloading)', item: 'Apakah terdapat safeguards baru yang ditetapkan berdasarkan hasil evaluasi risiko kebakaran tersebut?', ismCode: 'IMSBC 3.1.2', defaultResult: '', remark: '', isStrikethrough: false }
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
    id: 'custom',
    organizationId: 'custom',
    code: 'EXT',
    name: 'Lembaga Audit Eksternal Lainnya (Input Manual)',
    shortName: 'Lembaga Lain',
    category: 'NON_BKI',
    badgeColor: '#64748b',
    standard: 'Custom',
    hasOfficialTemplate: false,
    description: 'Auditor eksternal independen atau badan klasifikasi internasional lainnya (seperti Lloyd\'s Register, Bureau Veritas, ClassNK, RINA, dll) yang dapat diinput sendiri saat diminta bantuan.',
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
  custom: {
    ...NON_BKI_AUDIT_ORGANIZATIONS.find(o => o.id === 'custom'),
    organizationName: 'Lembaga Audit Eksternal Lainnya (Input Manual)',
    checked: false,
    note: 'Lembaga eksternal lainnya diinput manual sesuai penunjukan (seperti LR, BV, ClassNK, RINA, dll).',
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
 * - Seluruh lembaga lain (KSOP, Hubla, Custom, dll) SELALU mengembalikan array KOSONG [].
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

  // Cocokkan nama resmi di dalam string panjang (mis. "KSOP Pontianak", "Ditjen Perhubungan Laut")
  const aliasMap = [
    { id: 'hubla', keywords: ['hubla', 'perhubungan laut', 'kemenhub', 'ditjen'] },
    { id: 'ksop', keywords: ['ksop', 'kesyahbandaran', 'otoritas pelabuhan'] }
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

