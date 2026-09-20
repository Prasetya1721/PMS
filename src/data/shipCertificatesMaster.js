// Master Ship Certificates & Document Categorization
// PT. Pelayaran Baharimas Kalimantan
// Categories: BKI, Statutory, Asuransi, KSOP, Kesehatan

export const DEMO_CERTIFICATE_CATEGORIES = [
  {
    id: 'BKI',
    label: 'BKI (Biro Klasifikasi Indonesia)',
    code: 'BKI',
    description: 'Sertifikat klasifikasi lambung, mesin, dan survei periodik BKI',
    badgeClass: 'badge-info',
    color: '#38bdf8',
    borderColor: 'rgba(56, 189, 248, 0.35)',
    bgColor: 'rgba(2, 132, 199, 0.12)'
  },
  {
    id: 'Statutory',
    label: 'Statutory (Konvensi & Keselamatan)',
    code: 'STATUTORY',
    description: 'Sertifikat keselamatan konstruksi, radio, perlengkapan, dan pencegahan polusi',
    badgeClass: 'badge-success',
    color: '#10b981',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    bgColor: 'rgba(16, 185, 129, 0.12)'
  },
  {
    id: 'Asuransi',
    label: 'Asuransi (Insurance & CLC)',
    code: 'ASURANSI',
    description: 'Sertifikat jaminan ganti rugi, penyingkiran kerangka kapal (Wreck Removal) & CLC Bunker',
    badgeClass: 'badge-neutral',
    color: '#a855f7',
    borderColor: 'rgba(168, 85, 247, 0.35)',
    bgColor: 'rgba(168, 85, 247, 0.12)'
  },
  {
    id: 'KSOP',
    label: 'KSOP (Kesyahbandaran & Otoritas Pelabuhan)',
    code: 'KSOP',
    description: 'Pas Besar, Surat Ukur, Izin Trayek RPT/PPKA, ISRKL, dan sertifikat servis keselamatan kapal',
    badgeClass: 'badge-warning',
    color: '#f59e0b',
    borderColor: 'rgba(245, 158, 11, 0.35)',
    bgColor: 'rgba(245, 158, 11, 0.12)'
  },
  {
    id: 'Kesehatan',
    label: 'Kesehatan (Port Health / KKP)',
    code: 'KESEHATAN',
    description: 'Sertifikat Sanitasi Kapal (SSCEC), Buku Kesehatan Kapal, dan P3K',
    badgeClass: 'badge-danger',
    color: '#ec4899',
    borderColor: 'rgba(236, 72, 153, 0.35)',
    bgColor: 'rgba(236, 72, 153, 0.12)'
  }
];

// 19 Official Certificates from Authority Checklist & Health Standards
export const DEMO_STANDARD_CERTIFICATE_TEMPLATES = [
  // 1. KSOP
  {
    name: 'Pas Besar',
    category: 'KSOP',
    defaultValidityYears: 5,
    issuer: 'Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP)',
    docPrefix: 'PK.201/KSOP'
  },
  {
    name: 'Surat Ukur',
    category: 'KSOP',
    defaultValidityYears: 10,
    issuer: 'Direktorat Jenderal Perhubungan Laut / KSOP',
    docPrefix: 'SU.102/KSOP'
  },
  {
    name: 'Izin Stasiun Radio Kapal Laut (ISRKL)',
    category: 'KSOP',
    defaultValidityYears: 5,
    issuer: 'Ditjen SDPPI Kominfo / Ditjen Hubla',
    docPrefix: 'ISRKL-HUB'
  },
  {
    name: 'ILR Sertifikat',
    category: 'KSOP',
    defaultValidityYears: 1,
    issuer: 'Stasiun Servis Inflatable Life Raft Terakreditasi KSOP',
    docPrefix: 'ILR-SRV'
  },
  {
    name: 'HRU Sertifikat',
    category: 'KSOP',
    defaultValidityYears: 2,
    issuer: 'Stasiun Servis Keselamatan Maritim KSOP',
    docPrefix: 'HRU-EXP'
  },
  {
    name: 'PMK Sertifikat',
    category: 'KSOP',
    defaultValidityYears: 1,
    issuer: 'Dinas Pemadam & Balai Pengujian Keselamatan KSOP',
    docPrefix: 'PMK-SRV'
  },
  {
    name: 'Ijin Trayek ; RPT/PPKA/PKKA',
    category: 'KSOP',
    defaultValidityYears: 1,
    issuer: 'Direktorat Lalu Lintas Angkutan Laut / KSOP',
    docPrefix: 'RPT/PPKA'
  },

  // 2. BKI
  {
    name: 'Certificate hull / lambung',
    category: 'BKI',
    defaultValidityYears: 5,
    issuer: 'Biro Klasifikasi Indonesia (BKI)',
    docPrefix: 'BKI-HULL'
  },
  {
    name: 'Certificate Machinery / Mesin',
    category: 'BKI',
    defaultValidityYears: 5,
    issuer: 'Biro Klasifikasi Indonesia (BKI)',
    docPrefix: 'BKI-MACH'
  },

  // 3. STATUTORY
  {
    name: 'Cargo Ship Safety Construction Certificate',
    category: 'Statutory',
    defaultValidityYears: 5,
    issuer: 'Ditjen Hubla / BKI Statutory Department',
    docPrefix: 'SAFCON'
  },
  {
    name: 'Cargo Ship Safety Equipment Certificate',
    category: 'Statutory',
    defaultValidityYears: 2,
    issuer: 'Ditjen Hubla / BKI Statutory Department',
    docPrefix: 'SAFEQ'
  },
  {
    name: 'Cargo Ship Safety Radio Certificate',
    category: 'Statutory',
    defaultValidityYears: 5,
    issuer: 'Ditjen Hubla / KSOP Radio Inspection',
    docPrefix: 'SAFRAD'
  },
  {
    name: 'Document Of Compliance (DOC)',
    category: 'Statutory',
    defaultValidityYears: 5,
    issuer: 'Direktorat Jenderal Perhubungan Laut (ISM Code)',
    docPrefix: 'DOC-ISM'
  },
  {
    name: 'Minimum Safe Manning Certificate',
    category: 'Statutory',
    defaultValidityYears: 5,
    issuer: 'Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP)',
    docPrefix: 'MSMC'
  },
  {
    name: 'National Pollution Prevention Certificate',
    category: 'Statutory',
    defaultValidityYears: 5,
    issuer: 'Ditjen Hubla / BKI Statutory (MARPOL)',
    docPrefix: 'SNPP'
  },
  {
    name: 'Anti Fouling Certificate',
    category: 'Statutory',
    defaultValidityYears: 5,
    issuer: 'Ditjen Hubla / BKI (AFS Convention)',
    docPrefix: 'AFS-CERT'
  },
  {
    name: 'Load Line Certificate / Garis Muat',
    category: 'Statutory',
    defaultValidityYears: 5,
    issuer: 'Ditjen Hubla / BKI (PM 39)',
    docPrefix: 'LLC-PM39'
  },

  // 4. ASURANSI
  {
    name: 'Civil Liability For Bunker Pollution Damage Certificate (CLC Bunker)',
    category: 'Asuransi',
    defaultValidityYears: 1,
    issuer: 'Direktorat Jenderal Perhubungan Laut / Club Penjamin',
    docPrefix: 'CLC-BUNKER'
  },
  {
    name: 'Wreck Removal / Asuransi',
    category: 'Asuransi',
    defaultValidityYears: 1,
    issuer: 'PT. Asuransi Jasa Indonesia (Jasindo) / P&I Club',
    docPrefix: 'WRECK-INS'
  },

  // 5. KESEHATAN
  {
    name: 'Ship Sanitation Control Exemption Certificate (SSCEC)',
    category: 'Kesehatan',
    defaultValidityYears: 0.5,
    issuer: 'Balai Karantina Kesehatan / KKP Kelas II',
    docPrefix: 'KKP-SSCEC'
  },
  {
    name: 'Buku Kesehatan Kapal (Medicine Chest)',
    category: 'Kesehatan',
    defaultValidityYears: 1,
    issuer: 'Balai Karantina Kesehatan / KKP Kelas II',
    docPrefix: 'KKP-MED'
  }
];

// Core Standard Categories for Maritime Vessels (BKI, KSOP, Statutory, Kesehatan, Asuransi)
export const CERTIFICATE_CATEGORIES = DEMO_CERTIFICATE_CATEGORIES;
export const STANDARD_CERTIFICATE_TEMPLATES = [];

// Master Data Default Jenis Survey / Siklus Pemeriksaan (Tanpa tanda kurung)
export const DEFAULT_MASTER_SURVEY_TYPES = [
  // BKI
  { id: 'st-bki-1', name: 'Annual Survey Lambung & Mesin', category: 'BKI', intervalYears: 1, description: 'Survei tahunan berkala lambung dan permesinan kelas BKI' },
  { id: 'st-bki-2', name: 'Intermediate Survey', category: 'BKI', intervalYears: 2.5, description: 'Survei antara pertengahan periode kelas BKI' },
  { id: 'st-bki-3', name: 'Special Survey / Renewal', category: 'BKI', intervalYears: 5, description: 'Survei pembaharuan kelas 5 tahunan BKI' },
  { id: 'st-bki-4', name: 'Docking Survey', category: 'BKI', intervalYears: 2.5, description: 'Pemeriksaan bawah air / pengedokan berkala' },
  { id: 'st-bki-5', name: 'Propeller Shaft Survey', category: 'BKI', intervalYears: 5, description: 'Pemeriksaan poros baling-baling kapal' },
  { id: 'st-bki-6', name: 'Boiler Survey', category: 'BKI', intervalYears: 2.5, description: 'Pemeriksaan ketel uap kapal' },
  { id: 'st-bki-7', name: 'Continuous Survey Machinery', category: 'BKI', intervalYears: 5, description: 'Survei mesin berkelanjutan CSM' },
  { id: 'st-bki-8', name: 'Non-Survey', category: 'BKI', intervalYears: 0, description: 'Sertifikat tetap / catatan kelas' },

  // KSOP
  { id: 'st-ksop-1', name: 'Pemeriksaan Kelaiklautan Kapal', category: 'KSOP', intervalYears: 1, description: 'Inspeksi fisik kelaiklautan oleh Marine Inspector KSOP' },
  { id: 'st-ksop-2', name: 'Survei Keselamatan Konstruksi Kapal Barang', category: 'KSOP', intervalYears: 5, description: 'Pemeriksaan konstruksi keselamatan kapal barang' },
  { id: 'st-ksop-3', name: 'Survei Keselamatan Perlengkapan Kapal Barang', category: 'KSOP', intervalYears: 1, description: 'Pemeriksaan alat keselamatan (Lifeboat, ILR, PMK)' },
  { id: 'st-ksop-4', name: 'Survei Keselamatan Radio Kapal', category: 'KSOP', intervalYears: 1, description: 'Inspeksi perangkat komunikasi radio kapal' },
  { id: 'st-ksop-5', name: 'Survei Garis Muat Nasional', category: 'KSOP', intervalYears: 5, description: 'Inspeksi garis muat dan lambung timbul' },
  { id: 'st-ksop-6', name: 'Pemeriksaan Fisik Surat Ukur', category: 'KSOP', intervalYears: 10, description: 'Pengukuran tonase fisik kapal' },
  { id: 'st-ksop-7', name: 'Pemeriksaan Sertifikat Pengawakan Aman', category: 'KSOP', intervalYears: 5, description: 'Pemeriksaan kecukupan formasi ABK Safe Manning' },
  { id: 'st-ksop-8', name: 'Endorsement Tahunan Sertifikat KSOP', category: 'KSOP', intervalYears: 1, description: 'Pengukuhan berkala sertifikat tahunan KSOP' },
  { id: 'st-ksop-9', name: 'Non-Survey', category: 'KSOP', intervalYears: 0, description: 'Pas Besar / Surat Laut / Izin Trayek RPT' },

  // Statutory
  { id: 'st-stat-1', name: 'Initial Audit ISM Code', category: 'Statutory', intervalYears: 5, description: 'Audit awal implementasi SMC / DOC ISM Code' },
  { id: 'st-stat-2', name: 'Annual Verification Audit DOC', category: 'Statutory', intervalYears: 1, description: 'Verifikasi tahunan sertifikat DOC kantor' },
  { id: 'st-stat-3', name: 'Intermediate Audit SMC / ISSC', category: 'Statutory', intervalYears: 2.5, description: 'Audit antara SMC kapal atau keamanan ISSC' },
  { id: 'st-stat-4', name: 'Renewal Audit ISM / ISPS Code', category: 'Statutory', intervalYears: 5, description: 'Audit pembaruan 5 tahunan SMC / ISSC' },
  { id: 'st-stat-5', name: 'Survei Pencegahan Polusi Minyak IOPP', category: 'Statutory', intervalYears: 5, description: 'Inspeksi MARPOL Annex I OWS & Oil Record Book' },
  { id: 'st-stat-6', name: 'Survei Pencegahan Pencemaran Udara IAPP', category: 'Statutory', intervalYears: 5, description: 'Inspeksi MARPOL Annex VI emisi gas buang kapal' },
  { id: 'st-stat-7', name: 'Survei Sanitasi Kapal & Pencegahan Polusi Air Bersih', category: 'Statutory', intervalYears: 5, description: 'Inspeksi sewage treatment plant ISPP MARPOL Annex IV' },
  { id: 'st-stat-8', name: 'Pemeriksaan Anti-Fouling System AFS', category: 'Statutory', intervalYears: 5, description: 'Verifikasi cat lambung anti-teritip AFS' },
  { id: 'st-stat-9', name: 'Non-Survey', category: 'Statutory', intervalYears: 0, description: 'Sertifikat Tetap Hubla' },

  // Kesehatan
  { id: 'st-kes-1', name: 'Inspeksi Sanitasi Kapal SSCEC', category: 'Kesehatan', intervalYears: 0.5, description: 'Pemeriksaan sanitasi karantina kapal 6 bulanan' },
  { id: 'st-kes-2', name: 'Pemeriksaan & Fumigasi Kapal SSCC', category: 'Kesehatan', intervalYears: 0.5, description: 'Tindakan sanitasi / fumigasi pengendalian hama' },
  { id: 'st-kes-3', name: 'Inspeksi Sertifikat P3K & Perlengkapan Obat Kapal', category: 'Kesehatan', intervalYears: 1, description: 'Pemeriksaan kelengkapan obat kotak P3K kapal' },
  { id: 'st-kes-4', name: 'Pemeriksaan Sertifikat Air Minum Kapal', category: 'Kesehatan', intervalYears: 1, description: 'Uji laboratorium kualitas air minum tangki kapal' },
  { id: 'st-kes-5', name: 'Pemeriksaan Buku Kesehatan Kapal', category: 'Kesehatan', intervalYears: 1, description: 'Validasi buku riwayat kesehatan kapal' },
  { id: 'st-kes-6', name: 'Pemeriksaan Karantina Pelabuhan', category: 'Kesehatan', intervalYears: 1, description: 'Clearance kesehatan saat tiba di pelabuhan' },
  { id: 'st-kes-7', name: 'Non-Survey', category: 'Kesehatan', intervalYears: 0, description: 'Buku Kesehatan Kapal Tetap' },

  // Asuransi
  { id: 'st-asu-1', name: 'Pembaruan Polis Asuransi Tahunan', category: 'Asuransi', intervalYears: 1, description: 'Pembaruan polis asuransi tahunan H&M / P&I' },
  { id: 'st-asu-2', name: 'Condition Survey / Pre-Entry Survey', category: 'Asuransi', intervalYears: 1, description: 'Survei kondisi fisik sebelum kapal diterima asuransi' },
  { id: 'st-asu-3', name: 'Marine Warranty Survey', category: 'Asuransi', intervalYears: 1, description: 'Survei kelaikan operasi towing / muatan berat' },
  { id: 'st-asu-4', name: 'Verifikasi Sertifikat Jaminan Ganti Rugi Pencemaran CLC Bunker', category: 'Asuransi', intervalYears: 1, description: 'Pemeriksaan sertifikat jaminan pencemaran bahan bakar' },
  { id: 'st-asu-5', name: 'Pemeriksaan Sertifikat Wreck Removal WRC', category: 'Asuransi', intervalYears: 1, description: 'Pemeriksaan jaminan penyingkiran kerangka kapal' },
  { id: 'st-asu-6', name: 'Survey Klaim Kerusakan Lambung & Mesin', category: 'Asuransi', intervalYears: 1, description: 'Survei klaim asuransi akibat insiden atau kerusakan' },
  { id: 'st-asu-7', name: 'Non-Survey', category: 'Asuransi', intervalYears: 0, description: 'Polis Standar & Jaminan Resmi' }
];

// Master Data Default Nama Sertifikat Resmi Kapal
export const DEFAULT_MASTER_CERTIFICATE_NAMES = [
  // BKI
  { id: 'cn-bki-1', name: 'Sertifikat Klasifikasi Lambung', category: 'BKI', defaultValidityYears: 5, issuer: 'Biro Klasifikasi Indonesia (BKI)', description: 'Sertifikat klasifikasi konstruksi & kekuatan lambung' },
  { id: 'cn-bki-2', name: 'Sertifikat Klasifikasi Mesin', category: 'BKI', defaultValidityYears: 5, issuer: 'Biro Klasifikasi Indonesia (BKI)', description: 'Sertifikat klasifikasi instalasi mesin penggerak & bantu' },
  { id: 'cn-bki-3', name: 'Sertifikat Garis Muat Lambung Timbul', category: 'BKI', defaultValidityYears: 5, issuer: 'Biro Klasifikasi Indonesia (BKI)', description: 'Sertifikat lambung timbul garis muat kelas BKI' },
  { id: 'cn-bki-4', name: 'Sertifikat Pengedokan / Docking BKI', category: 'BKI', defaultValidityYears: 2.5, issuer: 'Biro Klasifikasi Indonesia (BKI)', description: 'Sertifikat pemeriksaan bawah air di atas dok' },
  { id: 'cn-bki-5', name: 'Sertifikat Poros Baling-Baling', category: 'BKI', defaultValidityYears: 5, issuer: 'Biro Klasifikasi Indonesia (BKI)', description: 'Sertifikat tailshaft & propeller kapal' },
  { id: 'cn-bki-6', name: 'Sertifikat Ketel Uap', category: 'BKI', defaultValidityYears: 2.5, issuer: 'Biro Klasifikasi Indonesia (BKI)', description: 'Sertifikat bejana tekan & ketel uap kapal' },

  // KSOP
  { id: 'cn-ksop-1', name: 'Pas Besar / Pas Kapal', category: 'KSOP', defaultValidityYears: 5, issuer: 'Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP)', description: 'Surat tanda kebangsaan kapal Indonesia GT 175 ke atas' },
  { id: 'cn-ksop-2', name: 'Surat Ukur Dalam Negeri', category: 'KSOP', defaultValidityYears: 10, issuer: 'Direktorat Jenderal Perhubungan Laut / KSOP', description: 'Surat penetapan tonase kotor dan bersih kapal' },
  { id: 'cn-ksop-3', name: 'Sertifikat Keselamatan Konstruksi Kapal Barang', category: 'KSOP', defaultValidityYears: 5, issuer: 'Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP)', description: 'Sertifikat keselamatan konstruksi kapal' },
  { id: 'cn-ksop-4', name: 'Sertifikat Keselamatan Perlengkapan Kapal Barang', category: 'KSOP', defaultValidityYears: 1, issuer: 'Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP)', description: 'Sertifikat alat pemadam, sekoci & liferaft kapal' },
  { id: 'cn-ksop-5', name: 'Sertifikat Keselamatan Radio Kapal Barang', category: 'KSOP', defaultValidityYears: 1, issuer: 'Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP)', description: 'Sertifikat perangkat radio komunikasi pelayaran' },
  { id: 'cn-ksop-6', name: 'Sertifikat Garis Muat Nasional', category: 'KSOP', defaultValidityYears: 5, issuer: 'Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP)', description: 'Sertifikat batas muat aman perairan Indonesia' },
  { id: 'cn-ksop-7', name: 'Izin Stasiun Radio Kapal Laut', category: 'KSOP', defaultValidityYears: 5, issuer: 'Ditjen SDPPI Kominfo / Ditjen Hubla', description: 'Lisensi frekuensi dan alokasi radio kapal laut' },
  { id: 'cn-ksop-8', name: 'Sertifikat Pengawakan Kapal Safe Manning', category: 'KSOP', defaultValidityYears: 5, issuer: 'Direktorat Jenderal Perhubungan Laut / KSOP', description: 'Sertifikat penetapan jumlah minimum awak kapal' },
  { id: 'cn-ksop-9', name: 'Izin Trayek RPT / PPKA', category: 'KSOP', defaultValidityYears: 1, issuer: 'Direktorat Jenderal Perhubungan Laut / KSOP', description: 'Rencana pengoperasian kapal trayek tetap & teratur' },
  { id: 'cn-ksop-10', name: 'Sertifikat Servis ILR', category: 'KSOP', defaultValidityYears: 1, issuer: 'Stasiun Servis Inflatable Life Raft KSOP', description: 'Sertifikat pengujian rakit penolong kembung' },
  { id: 'cn-ksop-11', name: 'Sertifikat Servis PMK / Alat Pemadam', category: 'KSOP', defaultValidityYears: 1, issuer: 'Balai Uji Keselamatan KSOP', description: 'Sertifikat pengujian tabung pemadam api kapal' },

  // Statutory
  { id: 'cn-stat-1', name: 'Safety Management Certificate (SMC)', category: 'Statutory', defaultValidityYears: 5, issuer: 'Direktorat Perkapalan dan Kepelautan (Ditkapel)', description: 'Sertifikat manajemen keselamatan operasional kapal' },
  { id: 'cn-stat-2', name: 'Document of Compliance (DOC)', category: 'Statutory', defaultValidityYears: 5, issuer: 'Direktorat Jenderal Perhubungan Laut', description: 'Sertifikat pemenuhan manajemen keselamatan perusahaan' },
  { id: 'cn-stat-3', name: 'International Ship Security Certificate (ISSC)', category: 'Statutory', defaultValidityYears: 5, issuer: 'Direktorat Jenderal Perhubungan Laut / RSO', description: 'Sertifikat sistem keamanan kapal ISPS Code' },
  { id: 'cn-stat-4', name: 'International Oil Pollution Prevention (IOPP)', category: 'Statutory', defaultValidityYears: 5, issuer: 'Direktorat Perkapalan dan Kepelautan', description: 'Sertifikat pencegahan pencemaran tumpahan minyak' },
  { id: 'cn-stat-5', name: 'International Air Pollution Prevention (IAPP)', category: 'Statutory', defaultValidityYears: 5, issuer: 'Direktorat Perkapalan dan Kepelautan', description: 'Sertifikat pencegahan polusi udara cerobong gas buang' },
  { id: 'cn-stat-6', name: 'International Sewage Pollution Prevention (ISPP)', category: 'Statutory', defaultValidityYears: 5, issuer: 'Direktorat Perkapalan dan Kepelautan', description: 'Sertifikat pencegahan pencemaran air kotor kapal' },
  { id: 'cn-stat-7', name: 'Anti-Fouling System Certificate (AFS)', category: 'Statutory', defaultValidityYears: 5, issuer: 'Direktorat Perkapalan dan Kepelautan', description: 'Sertifikat sistem anti-teritip ramah lingkungan' },

  // Kesehatan
  { id: 'cn-kes-1', name: 'Ship Sanitation Control Exemption Certificate (SSCEC)', category: 'Kesehatan', defaultValidityYears: 0.5, issuer: 'Balai Kekarantinaan Kesehatan (BKK / KKP)', description: 'Sertifikat bebas tindakan karantina & sanitasi kapal' },
  { id: 'cn-kes-2', name: 'Buku Kesehatan Kapal (Health Book)', category: 'Kesehatan', defaultValidityYears: 1, issuer: 'Kantor Kesehatan Pelabuhan (KKP)', description: 'Buku resmi catatan kesehatan & karantina pelabuhan' },
  { id: 'cn-kes-3', name: 'Sertifikat Obat & Kotak P3K Kapal (Medicine Chest)', category: 'Kesehatan', defaultValidityYears: 1, issuer: 'Kantor Kesehatan Pelabuhan (KKP)', description: 'Sertifikat kelayakan isi dan kedaluwarsa obat kapal' },
  { id: 'cn-kes-4', name: 'Sertifikat Kualitas Air Minum Kapal', category: 'Kesehatan', defaultValidityYears: 1, issuer: 'Balai Kekarantinaan Kesehatan (BKK / KKP)', description: 'Sertifikat pengujian higienitas air minum kapal' },

  // Asuransi
  { id: 'cn-asu-1', name: 'Polis Marine Hull & Machinery (H&M)', category: 'Asuransi', defaultValidityYears: 1, issuer: 'PT Asuransi Jasindo / Konsorsium Asuransi Maritim', description: 'Polis asuransi perlindungan rangka dan mesin kapal' },
  { id: 'cn-asu-2', name: 'Certificate of Entry Protection & Indemnity (P&I)', category: 'Asuransi', defaultValidityYears: 1, issuer: 'The Standard Club / P&I Club Internasional', description: 'Jaminan tanggung jawab hukum pihak ketiga armada' },
  { id: 'cn-asu-3', name: 'Civil Liability Convention (CLC) Bunker Certificate', category: 'Asuransi', defaultValidityYears: 1, issuer: 'Direktorat Jenderal Perhubungan Laut', description: 'Sertifikat jaminan ganti rugi pencemaran bahan bakar minyak' },
  { id: 'cn-asu-4', name: 'Wreck Removal Convention (WRC) Certificate', category: 'Asuransi', defaultValidityYears: 1, issuer: 'Direktorat Jenderal Perhubungan Laut', description: 'Sertifikat jaminan biaya penyingkiran kerangka kapal' },
  { id: 'cn-asu-5', name: 'Polis Asuransi Personal Accident ABK (Crew PA)', category: 'Asuransi', defaultValidityYears: 1, issuer: 'Perusahaan Asuransi Jiwa & Kecelakaan Maritim', description: 'Polis asuransi kecelakaan kerja awak kapal' }
];

// Helper to determine status and days until expiry relative to system reference date
export const calculateDocStatus = (expiryDateStr, issueDateStr) => {
  if (!expiryDateStr) return { status: 'Active', daysUntilExpiry: 365 };

  const todayRef = new Date('2026-09-09T00:00:00Z');
  const expDate = new Date(expiryDateStr + 'T00:00:00Z');
  const daysUntilExpiry = Math.round((expDate.getTime() - todayRef.getTime()) / (1000 * 60 * 60 * 24));

  let status = 'Active';
  if (daysUntilExpiry <= 0) {
    status = 'Expired';
  } else if (daysUntilExpiry <= 30) {
    status = 'Due Soon';
  }

  return { status, daysUntilExpiry };
};

// Map existing raw BKI survey categories to normalized 'BKI' or 'Statutory'
export const normalizeDocCategory = (doc) => {
  const cat = (doc.category || '').toLowerCase();
  const name = (doc.name || '').toLowerCase();

  if (cat.includes('ksop') || name.includes('pas besar') || name.includes('surat ukur') || name.includes('ilr') || name.includes('hru') || name.includes('pmk') || name.includes('trayek') || name.includes('radio kapal') || name.includes('isrkl')) {
    return 'KSOP';
  }
  if (cat.includes('kesehatan') || name.includes('sanitasi') || name.includes('sscec') || name.includes('buku kesehatan') || name.includes('medicine')) {
    return 'Kesehatan';
  }
  if (cat.includes('asuransi') || name.includes('wreck') || name.includes('clc') || name.includes('insurance') || name.includes('p&i')) {
    return 'Asuransi';
  }
  if (name.includes('load line') || name.includes('garis muat') || name.includes('safety') || name.includes('manning') || name.includes('pollution') || name.includes('snpp') || name.includes('anti fouling') || name.includes('compliance') || name.includes('doc')) {
    return 'Statutory';
  }
  return 'BKI';
};

// Builder to produce enriched certificate list across all vessels covering BKI, Statutory, Asuransi, KSOP, and Kesehatan
export const buildComprehensiveFleetDocuments = (existingBkiSurveys = [], vessels = [], templates = STANDARD_CERTIFICATE_TEMPLATES) => {
  // 1. Normalize existing surveys to BKI or Statutory with issueDate and expiryDate
  const normalizedSurveys = (existingBkiSurveys || []).map(doc => {
    const category = normalizeDocCategory(doc);
    const { status, daysUntilExpiry } = calculateDocStatus(doc.expiryDate, doc.issueDate);
    let issueDate = doc.issueDate;
    if (!issueDate && doc.expiryDate) {
      const exp = new Date(doc.expiryDate + 'T00:00:00Z');
      exp.setFullYear(exp.getFullYear() - 1);
      issueDate = exp.toISOString().split('T')[0];
    }
    return {
      ...doc,
      category,
      issueDate: issueDate || '2024-01-15',
      status: doc.status || status,
      daysUntilExpiry: doc.daysUntilExpiry !== undefined ? doc.daysUntilExpiry : daysUntilExpiry
    };
  });

  // 2. For each vessel, generate the official certificates from the standard templates
  const additionalDocs = [];

  (vessels || []).forEach(vessel => {
    const existingNames = new Set(
      normalizedSurveys
        .filter(d => d.vesselId === vessel.id)
        .map(d => d.name.toLowerCase().trim())
    );

    (templates || []).forEach((tmpl, idx) => {
      // Don't duplicate if already present in BKI surveys
      const isAlreadyPresent = Array.from(existingNames).some(n =>
        n.includes(tmpl.name.toLowerCase()) || tmpl.name.toLowerCase().includes(n)
      );
      if (isAlreadyPresent) return;

      const reg = vessel.regNo || vessel.imo || '24587';
      const portName = vessel.portOfRegistry?.split(',')[0] || 'Pontianak';

      let issueYear = 2024;
      let expiryYear = issueYear + tmpl.defaultValidityYears;
      let month = ((idx * 3 + parseInt(reg.slice(-1) || '1')) % 12) + 1;
      let day = ((idx * 7 + 10) % 28) + 1;

      // Realistic audit triggers for active monitoring
      if (idx === 0 && vessel.id === 'v-001') {
        // Pas Besar Due Soon in 19 days (H-30)
        expiryYear = 2026;
        month = 9;
        day = 28;
      } else if (idx === 3 && vessel.id === 'v-002') {
        // ILR Sertifikat Due Soon in 5 days (H-7)
        expiryYear = 2026;
        month = 9;
        day = 14;
      } else if (idx === 5 && vessel.id === 'v-004') {
        // PMK Sertifikat Expired
        expiryYear = 2026;
        month = 8;
        day = 20;
      } else if (idx === 19 && vessel.id === 'v-003') {
        // SSCEC Kesehatan Due Soon
        expiryYear = 2026;
        month = 9;
        day = 25;
      } else if (expiryYear < 2026) {
        expiryYear = 2027 + (idx % 3);
      }

      const issueMonthStr = String(month).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const issueDate = `${issueYear}-${issueMonthStr}-${dayStr}`;
      const expiryDate = `${expiryYear}-${issueMonthStr}-${dayStr}`;

      const { status, daysUntilExpiry } = calculateDocStatus(expiryDate, issueDate);

      const issuer = tmpl.issuer.includes('KSOP')
        ? `KSOP Kelas II ${portName}`
        : tmpl.issuer.includes('KKP')
        ? `Kantor Kesehatan Pelabuhan (KKP) ${portName}`
        : tmpl.issuer;

      additionalDocs.push({
        id: `doc-std-${vessel.id}-${idx + 1}`,
        vesselId: vessel.id,
        category: tmpl.category,
        name: tmpl.name,
        documentNo: `${tmpl.docPrefix}-${reg}-${expiryYear}`,
        issuer,
        issueDate,
        expiryDate,
        status,
        daysUntilExpiry,
        mandatoryAuditor: tmpl.category === 'KSOP' ? `Syahbandar KSOP ${portName}` : tmpl.category === 'Kesehatan' ? `Petugas Sanitasi KKP ${portName}` : `Surveyor ${tmpl.category}`,
        scanFile: `${tmpl.category.toLowerCase()}_${vessel.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${tmpl.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`
      });
    });
  });

  return [...normalizedSurveys, ...additionalDocs];
};
