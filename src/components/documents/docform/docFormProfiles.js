/**
 * docFormProfiles.js
 * Diekstrak dari DocumentFormModal.jsx (baris 40-316).
 * Sumber: CATEGORY_FORM_PROFILES + getCategoryProfile().
 *
 * Dipindah ke modul sendiri karena getCategoryProfile() dipakai komponen hasil
 * ekstraksi (DocFormVesselSection, DocFormCategoryPicker) sementara ia hanya
 * binding level modul - bukan import - sehingga tidak ikut terbawa saat
 * komponen dipindah. Sudah diekspor sebagai API publik (export const).
 *
 * Isi fungsi dan data TIDAK diubah: disalin byte-identik dari sumber.
 */
import { Anchor, Building2, FileText, HeartPulse, Shield, ShieldCheck } from 'lucide-react';
export const CATEGORY_FORM_PROFILES = {
  BKI: {
    id: 'BKI',
    code: 'BKI',
    label: 'BKI (Biro Klasifikasi Indonesia)',
    shortLabel: 'BKI Klasifikasi',
    tagline: 'Khusus sertifikat klasifikasi lambung, mesin, garis muat kelas, dan siklus survei periodik 5 tahunan BKI.',
    icon: Anchor,
    color: '#38bdf8',
    borderColor: 'rgba(56, 189, 248, 0.45)',
    bgColor: 'rgba(2, 132, 199, 0.15)',
    defaultIssuer: (port) => `Biro Klasifikasi Indonesia (BKI) Cabang ${port || 'Pontianak'}`,
    issuerPlaceholder: 'Contoh: Biro Klasifikasi Indonesia (BKI) Cabang Pontianak / BKI Pusat',
    auditorLabel: 'Nama Surveyor *',
    auditorPlaceholder: 'Contoh: Nama Surveyor...',
    auditorHelper: 'Nama surveyor yang memeriksa kondisi teknis kapal.',
    namePlaceholder: 'Contoh: Sertifikat Klasifikasi Lambung (Hull) / Mesin (Machinery)',
    docNoPlaceholder: 'Contoh: BKI.PTK-2026-HL-04812',
    surveyPlaceholder: 'Pilih jenis survey BKI atau ketik manual...',
    surveyTypes: [
      'Annual Survey',
      'Intermediate Survey',
      'Special / Renewal Survey',
      'Docking / Bottom Survey',
      'Tailshaft Survey',
      'Boiler Survey',
      'Continuous Survey',
      'Occasional / Damage Survey',
      'Non-Survey'
    ],
    surveyPresets: [
      { label: 'Annual Survey (1 Thn)', full: 'Annual Survey (Survei Tahunan BKI)', years: 1 },
      { label: 'Intermediate (2.5 Thn)', full: 'Intermediate Survey (Survei Antara BKI - 2.5 Thn)', years: 2.5 },
      { label: 'Special / Renewal (5 Thn)', full: 'Special / Renewal Survey (Survei Pembaruan Kelas 5 Tahunan)', years: 5 },
      { label: 'Docking Survey (2.5 Thn)', full: 'Docking / Bottom Survey (Survei Pengedokan Bawah Air BKI)', years: 2.5 },
      { label: 'Tailshaft (5 Thn)', full: 'Tailshaft Survey (Survei Poros Baling-Baling BKI)', years: 5 },
      { label: 'Occasional / Kerusakan', full: 'Occasional / Damage Survey (Survei Kerusakan / Perbaikan BKI)', years: 1 }
    ],
    quickCertificateNames: [
      'Sertifikat Klasifikasi Lambung (Hull Certificate)',
      'Sertifikat Klasifikasi Mesin (Machinery Certificate)',
      'Sertifikat Garis Muat Lambung Timbul (Load Line BKI)',
      'Sertifikat Pengedokan / Docking BKI',
      'Sertifikat Poros Baling-Baling (Tailshaft)',
      'Sertifikat Ketel Uap (Boiler Certificate)'
    ]
  },
  KSOP: {
    id: 'KSOP',
    code: 'KSOP',
    label: 'KSOP (Kesyahbandaran & Kelaiklautan)',
    shortLabel: 'KSOP / Syahbandar',
    tagline: 'Khusus kelaiklautan kapal, pas besar/kecil, surat ukur, izin trayek, dan sertifikat keselamatan pelayaran.',
    icon: Building2,
    color: '#f59e0b',
    borderColor: 'rgba(245, 158, 11, 0.45)',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    defaultIssuer: (port) => `Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP) Kelas II ${port || 'Pontianak'}`,
    issuerPlaceholder: 'Contoh: KSOP Kelas II Pontianak / KSOP Balikpapan',
    auditorLabel: 'Nama Surveyor *',
    auditorPlaceholder: 'Contoh: Nama Surveyor / Marine Inspector...',
    auditorHelper: 'Nama surveyor atau Marine Inspector yang memeriksa kapal.',
    namePlaceholder: 'Contoh: Pas Besar / Surat Ukur / Sertifikat Keselamatan Konstruksi',
    docNoPlaceholder: 'Contoh: PK.201/KSOP-PTK/24587-2026',
    surveyPlaceholder: 'Pilih jenis pemeriksaan KSOP atau ketik manual...',
    surveyTypes: [
      'Pemeriksaan Kelaiklautan Kapal (Marine Inspection KSOP)',
      'Survei Keselamatan Konstruksi Kapal Barang (Cargo Ship Safety Construction)',
      'Survei Keselamatan Perlengkapan Kapal Barang (Cargo Ship Safety Equipment)',
      'Survei Keselamatan Radio Kapal (Cargo Ship Safety Radio)',
      'Survei Garis Muat Nasional (National Load Line Inspection)',
      'Pemeriksaan Fisik Surat Ukur (Tonnage Measurement)',
      'Pemeriksaan Sertifikat Pengawakan Aman (Safe Manning)',
      'Endorsement Tahunan Sertifikat KSOP (Pengukuhan Berkala)',
      'Non-Survey (Pas Besar / Surat Laut / Izin Trayek RPT / Dokumen Tetap)'
    ],
    surveyPresets: [
      { label: 'Kelaiklautan (1 Thn)', full: 'Pemeriksaan Kelaiklautan Kapal (Marine Inspection KSOP)', years: 1 },
      { label: 'Safety Equipment (1 Thn)', full: 'Survei Keselamatan Perlengkapan Kapal Barang (Cargo Ship Safety Equipment)', years: 1 },
      { label: 'Safety Construction (5 Thn)', full: 'Survei Keselamatan Konstruksi Kapal Barang (Cargo Ship Safety Construction)', years: 5 },
      { label: 'Surat Ukur Fisik (10 Thn)', full: 'Pemeriksaan Fisik Surat Ukur (Tonnage Measurement)', years: 10 },
      { label: 'Pas Besar / Laut (5 Thn)', full: 'Non-Survey (Pas Besar / Surat Laut / Izin Trayek RPT / Dokumen Tetap)', years: 5 },
      { label: 'Endorsement KSOP (1 Thn)', full: 'Endorsement Tahunan Sertifikat KSOP (Pengukuhan Berkala)', years: 1 }
    ],
    quickCertificateNames: [
      'Pas Besar / Pas Kapal',
      'Surat Ukur Dalam Negeri (Tonnage Certificate)',
      'Sertifikat Keselamatan Konstruksi Kapal Barang',
      'Sertifikat Keselamatan Perlengkapan Kapal Barang',
      'Sertifikat Keselamatan Radio Kapal Barang',
      'Sertifikat Garis Muat Nasional (Load Line)',
      'Surat Laut / Pas Tahunan Kapal',
      'Izin Stasiun Radio Kapal Laut (ISRKL)',
      'Sertifikat Pengawakan Kapal (Safe Manning Certificate)'
    ]
  },
  Statutory: {
    id: 'Statutory',
    code: 'STATUTORY',
    label: 'Statutory (Ditkapel / Hubla / ISM Code)',
    shortLabel: 'Statutori Hubla',
    tagline: 'Khusus Sistem Manajemen Keselamatan (ISM Code), Keamanan Kapal (ISPS), dan Pencegahan Polusi (MARPOL).',
    icon: ShieldCheck,
    color: '#10b981',
    borderColor: 'rgba(168, 85, 247, 0.45)',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    defaultIssuer: () => 'Direktorat Jenderal Perhubungan Laut (Ditjen Hubla)',
    issuerPlaceholder: 'Contoh: Direktorat Kelaiklautan & Kepelautan (Ditkapel) Ditjen Hubla',
    auditorLabel: 'Nama Surveyor *',
    auditorPlaceholder: 'Contoh: Nama Surveyor / Auditor...',
    auditorHelper: 'Nama surveyor atau auditor yang memeriksa kapal.',
    namePlaceholder: 'Contoh: Safety Management Certificate (SMC) / DOC / ISSC',
    docNoPlaceholder: 'Contoh: AL.301/SMC-HUBLA/2026',
    surveyPlaceholder: 'Pilih jenis audit / verifikasi statutori atau ketik manual...',
    surveyTypes: [
      'Initial Verification / Audit (Verifikasi Audit Pertama Kapal)',
      'Annual Verification / Audit (Verifikasi Tahunan ISM/ISPS)',
      'Intermediate Verification (Verifikasi Antara 2.5 Thn)',
      'Renewal Verification / Audit (Pembaruan Sertifikat 5 Tahunan)',
      'Additional / Follow-up Audit (Audit Tambahan / Penyelesaian Temuan NC)',
      'Survei Pencegahan Pencemaran (MARPOL / SNPP / IOPP)',
      'Non-Survey (Sertifikat Tetap Statutori Hubla)'
    ],
    surveyPresets: [
      { label: 'Initial Verification (1 Thn)', full: 'Initial Verification / Audit (Verifikasi Audit Pertama Kapal)', years: 1 },
      { label: 'Annual Verification (1 Thn)', full: 'Annual Verification / Audit (Verifikasi Tahunan ISM/ISPS)', years: 1 },
      { label: 'Intermediate (2.5 Thn)', full: 'Intermediate Verification (Verifikasi Antara 2.5 Thn)', years: 2.5 },
      { label: 'Renewal (5 Thn)', full: 'Renewal Verification / Audit (Pembaruan Sertifikat 5 Tahunan)', years: 5 },
      { label: 'Audit Tambahan (NC)', full: 'Additional / Follow-up Audit (Audit Tambahan / Penyelesaian Temuan NC)', years: 1 },
      { label: 'MARPOL / SNPP (5 Thn)', full: 'Survei Pencegahan Pencemaran (MARPOL / SNPP / IOPP)', years: 5 }
    ],
    quickCertificateNames: [
      'Safety Management Certificate (SMC - ISM Code)',
      'Document of Compliance (DOC Perusahaan Baharimas)',
      'International Ship Security Certificate (ISSC - ISPS Code)',
      'Sertifikat Nasional Pencegahan Pencemaran dari Kapal (SNPP)',
      'International Oil Pollution Prevention Certificate (IOPP)',
      'Sertifikat Pengesahan Sistem Manajemen Keamanan Kapal'
    ]
  },
  Kesehatan: {
    id: 'Kesehatan',
    code: 'KESEHATAN',
    label: 'Kesehatan (Port Health / KKP / BKK)',
    shortLabel: 'Kesehatan / KKP',
    tagline: 'Khusus pemeriksaan sanitasi kapal (SSCEC), kotak obat P3K, air minum kapal, dan karantina kesehatan pelabuhan.',
    icon: HeartPulse,
    color: '#ec4899',
    borderColor: 'rgba(236, 72, 153, 0.45)',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    defaultIssuer: (port) => `Balai Kekarantinaan Kesehatan (BKK / KKP) Pelabuhan ${port || 'Pontianak'}`,
    issuerPlaceholder: 'Contoh: Balai Kekarantinaan Kesehatan (KKP) Kelas II Pontianak',
    auditorLabel: 'Nama Surveyor *',
    auditorPlaceholder: 'Contoh: Nama Surveyor / Petugas Sanitarian...',
    auditorHelper: 'Nama surveyor atau petugas sanitarian yang memeriksa kapal.',
    namePlaceholder: 'Contoh: Ship Sanitation Control Exemption Certificate (SSCEC)',
    docNoPlaceholder: 'Contoh: KK.02.01/BKK-PTK/SSCEC-2026',
    surveyPlaceholder: 'Pilih jenis inspeksi kesehatan kapal atau ketik manual...',
    surveyTypes: [
      'Pembaruan Rutin SSCEC 6 Bulanan (Exemption Certificate)',
      'Inspeksi Sanitasi Kapal (Ship Sanitation Inspection - SSCEC)',
      'Pemeriksaan Kotak P3K & Obat Kapal (Medicine Chest Inspection)',
      'Pemeriksaan Air Minum & Sanitasi Galley / Makanan Kapal',
      'Pengawasan Fumigasi & Pembasmian Vektor Tikus (Deratting)',
      'Pemeriksaan Kesehatan Awak & Karantina Bebas (Free Pratique)',
      'Non-Survey (Buku Kesehatan Kapal / Health Book Tetap)'
    ],
    surveyPresets: [
      { label: 'SSCEC Sanitasi (6 Bulan)', full: 'Pembaruan Rutin SSCEC 6 Bulanan (Exemption Certificate)', years: 0.5 },
      { label: 'Kotak P3K & Obat (1 Thn)', full: 'Pemeriksaan Kotak P3K & Obat Kapal (Medicine Chest Inspection)', years: 1 },
      { label: 'Air Minum Kapal (6 Bulan)', full: 'Pemeriksaan Air Minum & Sanitasi Galley / Makanan Kapal', years: 0.5 },
      { label: 'Buku Kesehatan (1 Thn)', full: 'Non-Survey (Buku Kesehatan Kapal / Health Book Tetap)', years: 1 },
      { label: 'Fumigasi / Vektor', full: 'Pengawasan Fumigasi & Pembasmian Vektor Tikus (Deratting)', years: 0.5 }
    ],
    quickCertificateNames: [
      'Ship Sanitation Control Exemption Certificate (SSCEC)',
      'Ship Sanitation Control Certificate (SSCC)',
      'Buku Kesehatan Kapal (Ship Health Book)',
      'Sertifikat Pemeriksaan Kotak Obat P3K Kapal',
      'Sertifikat Pengawasan Fumigasi Kapal Bebas Hama'
    ]
  },
  Asuransi: {
    id: 'Asuransi',
    code: 'ASURANSI',
    label: 'Asuransi & Jaminan (Insurance / P&I / CLC)',
    shortLabel: 'Asuransi & Jaminan',
    tagline: 'Khusus jaminan ganti rugi pencemaran laut (CLC Bunker), penyingkiran kerangka kapal (WRC), polis Hull & Machinery, dan P&I.',
    icon: Shield,
    color: '#a855f7',
    borderColor: 'rgba(168, 85, 247, 0.45)',
    bgColor: 'rgba(168, 85, 247, 0.15)',
    defaultIssuer: () => 'PT. Asuransi Jasa Indonesia (Jasindo) / P&I Club',
    issuerPlaceholder: 'Contoh: PT. Asuransi Jasindo / The Shipowners Club / Broker Asuransi',
    auditorLabel: 'Nama Surveyor *',
    auditorPlaceholder: 'Contoh: Nama Surveyor / Risk Assessor...',
    auditorHelper: 'Nama surveyor atau risk assessor yang memeriksa kapal.',
    namePlaceholder: 'Contoh: CLC Bunker Certificate / Polis Marine H&M / P&I Club',
    docNoPlaceholder: 'Contoh: POLIS-HM/BHM/2026/0921',
    surveyPlaceholder: 'Pilih tipe inspeksi / perpanjangan asuransi atau ketik manual...',
    surveyTypes: [
      'Pembaruan Polis Asuransi Tahunan (Annual Policy Renewal)',
      'Condition Survey / Pre-Entry Survey (Survei Kondisi Kapal Sebelum Masuk Polis)',
      'Marine Warranty Survey (Survei Kelayakan Muatan / Penarikan Towing)',
      'Inspeksi Kerusakan & Klaim Asuransi (Casualty & Damage Survey)',
      'Verifikasi Sertifikat Jaminan Ganti Rugi Pencemaran (CLC Bunker)',
      'Non-Survey (Polis Asuransi Standar & Sertifikat Jaminan Resmi)'
    ],
    surveyPresets: [
      { label: 'Pembaruan Polis (1 Thn)', full: 'Pembaruan Polis Asuransi Tahunan (Annual Policy Renewal)', years: 1 },
      { label: 'Condition Survey (1 Thn)', full: 'Condition Survey / Pre-Entry Survey (Survei Kondisi Kapal Sebelum Masuk Polis)', years: 1 },
      { label: 'Warranty Survey', full: 'Marine Warranty Survey (Survei Kelayakan Muatan / Penarikan Towing)', years: 1 },
      { label: 'CLC Bunker (1 Thn)', full: 'Verifikasi Sertifikat Jaminan Ganti Rugi Pencemaran (CLC Bunker)', years: 1 },
      { label: 'Wreck Removal (1 Thn)', full: 'Pembaruan Polis Asuransi Tahunan (Annual Policy Renewal)', years: 1 },
      { label: 'Polis Standar (1 Thn)', full: 'Non-Survey (Polis Asuransi Standar & Sertifikat Jaminan Resmi)', years: 1 }
    ],
    quickCertificateNames: [
      'Civil Liability Convention (CLC) Bunker Certificate',
      'Wreck Removal Convention (WRC) Certificate',
      'Polis Marine Hull & Machinery (H&M) Kapal',
      'Certificate of Entry Protection & Indemnity (P&I Club)',
      'Polis Asuransi Tanggung Jawab Hukum Terhadap Awak Kapal (Crew PA)'
    ]
  }
};

export const getCategoryProfile = (catId) => {
  if (!catId) return CATEGORY_FORM_PROFILES.BKI;
  const key = Object.keys(CATEGORY_FORM_PROFILES).find(k => k.toLowerCase() === catId.toLowerCase()) ||
              (catId.toLowerCase().includes('bki') ? 'BKI' :
               catId.toLowerCase().includes('ksop') ? 'KSOP' :
               catId.toLowerCase().includes('stat') ? 'Statutory' :
               catId.toLowerCase().includes('sehat') || catId.toLowerCase().includes('kkp') ? 'Kesehatan' :
               catId.toLowerCase().includes('asur') || catId.toLowerCase().includes('insur') ? 'Asuransi' : null);

  if (key && CATEGORY_FORM_PROFILES[key]) {
    return CATEGORY_FORM_PROFILES[key];
  }

  // Fallback for custom categories created by user
  return {
    id: catId,
    code: catId.toUpperCase(),
    label: catId,
    shortLabel: catId,
    tagline: `Kategori dokumen & sertifikasi armada ${catId}.`,
    icon: FileText,
    color: '#0284c7',
    borderColor: 'rgba(2, 132, 199, 0.45)',
    bgColor: 'rgba(2, 132, 199, 0.15)',
    defaultIssuer: () => `Instansi Penerbit ${catId}`,
    issuerPlaceholder: `Contoh: Otoritas / Balai Penerbit ${catId}`,
    auditorLabel: 'Nama Surveyor *',
    auditorPlaceholder: 'Contoh: Nama Surveyor...',
    auditorHelper: 'Nama surveyor yang bertugas memeriksa kapal.',
    namePlaceholder: `Contoh: Nama Sertifikat / Dokumen ${catId}`,
    docNoPlaceholder: `Contoh: NO-${catId.toUpperCase()}/2026/001`,
    surveyPlaceholder: `Pilih jenis pemeriksaan ${catId} atau ketik manual...`,
    surveyTypes: [
      'Pemeriksaan Tahunan (Annual Inspection)',
      'Pemeriksaan Berkala (Periodical Inspection)',
      'Pembaruan Dokumen (Renewal)',
      'Pemeriksaan Pertama / Baru (Initial)',
      'Non-Survey (Dokumen / Izin Tetap)'
    ],
    surveyPresets: [
      { label: 'Tahunan (1 Thn)', full: 'Pemeriksaan Tahunan (Annual Inspection)', years: 1 },
      { label: 'Berkala (2.5 Thn)', full: 'Pemeriksaan Berkala (Periodical Inspection)', years: 2.5 },
      { label: 'Pembaruan (5 Thn)', full: 'Pembaruan Dokumen (Renewal)', years: 5 },
      { label: 'Non-Survey', full: 'Non-Survey (Dokumen / Izin Tetap)', years: 1 }
    ],
    quickCertificateNames: [
      `Sertifikat Resmi ${catId}`,
      `Dokumen Operasional ${catId}`
    ]
  };
};
