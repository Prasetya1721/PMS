import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  FileText,
  X,
  Save,
  Calendar,
  Shield,
  Anchor,
  ShieldCheck,
  Building2,
  HeartPulse,
  CheckCircle2,
  Plus,
  Bell,
  BellRing,
  Clock,
  UploadCloud,
  FileUp,
  FileCheck,
  Eye,
  Trash2,
  Download,
  Sparkles,
  ExternalLink,
  UserCheck,
  ClipboardCheck,
  Info,
  Award
} from 'lucide-react';
import { CERTIFICATE_CATEGORIES, STANDARD_CERTIFICATE_TEMPLATES, DEMO_CERTIFICATE_CATEGORIES } from '../../data/shipCertificatesMaster';
import { usePMS } from '../../context/PMSContext';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { MasterCombobox } from '../common/MasterCombobox';

// -------------------------------------------------------------
// DYNAMIC MARITIME CATEGORY FORM PROFILES (BKI, KSOP, Statutory, Kesehatan, Asuransi)
// Form beradaptasi secara dinamis sesuai kategori maritim yang dipilih
// -------------------------------------------------------------
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
    auditorLabel: 'Surveyor BKI Pemeriksa (Lambung / Mesin) *',
    auditorPlaceholder: 'Contoh: Surveyor Lambung & Mesin BKI Pontianak',
    auditorHelper: 'Surveyor resmi Biro Klasifikasi Indonesia (BKI) yang memeriksa kondisi teknis kapal.',
    namePlaceholder: 'Contoh: Sertifikat Klasifikasi Lambung (Hull) / Mesin (Machinery)',
    docNoPlaceholder: 'Contoh: BKI.PTK-2026-HL-04812',
    surveyPlaceholder: 'Pilih jenis survey BKI atau ketik manual...',
    surveyTypes: [
      'Annual Survey (Survei Tahunan BKI)',
      'Intermediate Survey (Survei Antara BKI - 2.5 Thn)',
      'Special / Renewal Survey (Survei Pembaruan Kelas 5 Tahunan)',
      'Docking / Bottom Survey (Survei Pengedokan Bawah Air BKI)',
      'Tailshaft Survey (Survei Poros Baling-Baling BKI)',
      'Boiler Survey (Survei Ketel Uap BKI)',
      'Continuous Survey (CSM / CSH Mesin & Lambung)',
      'Occasional / Damage Survey (Survei Kerusakan / Perbaikan BKI)',
      'Non-Survey / Sertifikat Kelas Khusus'
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
    auditorLabel: 'Marine Inspector (MI) / Petugas KSOP *',
    auditorPlaceholder: 'Contoh: Capt. Hendra (Marine Inspector KSOP Kelas II Pontianak)',
    auditorHelper: 'Marine Inspector resmi Ditjen Hubla atau Petugas Syahbandar Pelabuhan.',
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
    borderColor: 'rgba(16, 185, 129, 0.45)',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    defaultIssuer: () => 'Direktorat Jenderal Perhubungan Laut (Ditjen Hubla)',
    issuerPlaceholder: 'Contoh: Direktorat Kelaiklautan & Kepelautan (Ditkapel) Ditjen Hubla',
    auditorLabel: 'Lead Auditor ISM / Auditor ISPS / Inspektur Ditkapel *',
    auditorPlaceholder: 'Contoh: Lead Auditor ISM Ditkapel / Auditor RSO BKI',
    auditorHelper: 'Auditor resmi ISM Code / ISPS Code atau Inspektur Kelaiklautan Hubla.',
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
    auditorLabel: 'Petugas Sanitarian KKP / Dokter Karantina Pelabuhan *',
    auditorPlaceholder: 'Contoh: Sanitarian Ahli Balai Kekarantinaan Kesehatan Pontianak',
    auditorHelper: 'Pejabat fungsional Sanitarian KKP atau Dokter Karantina Pelabuhan.',
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
    auditorLabel: 'Marine Risk Assessor / Adjuster / Surveyor Asuransi *',
    auditorPlaceholder: 'Contoh: Marine Surveyor Independen / Risk Adjuster Asuransi',
    auditorHelper: 'Surveyor independen atau loss adjuster yang ditunjuk oleh Underwriter asuransi.',
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
    auditorLabel: `Surveyor / Auditor Pemeriksa (${catId}) *`,
    auditorPlaceholder: `Contoh: Nama Petugas / Surveyor Pemeriksa ${catId}`,
    auditorHelper: `Petugas atau surveyor yang memeriksa dokumen ${catId}.`,
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

// Component to render specialized category-specific fields
const CategorySpecialFields = ({ categoryId, categoryData = {}, onChange }) => {
  const normCat = (categoryId || '').toLowerCase();

  if (normCat.includes('bki')) {
    return (
      <div style={{
        padding: '0.9rem 1.1rem',
        borderRadius: '10px',
        background: 'rgba(56, 189, 248, 0.05)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '0.85rem'
      }}>
        <div>
          <label className="field-label" style={{ color: '#38bdf8', fontSize: '0.78rem' }}>
            ⚓ Notasi Klasifikasi BKI (Class Notation)
          </label>
          <input
            type="text"
            value={categoryData.classNotation || ''}
            onChange={(e) => onChange('classNotation', e.target.value)}
            placeholder="Contoh: A100 (I) P Tug Boat / SM (Machinery)"
            className="input-control mono"
            style={{ fontSize: '0.8rem' }}
          />
          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
            Tanda lambung, mesin, dan daerah pelayaran yang disetujui BKI.
          </span>
        </div>
        <div>
          <label className="field-label" style={{ color: '#38bdf8', fontSize: '0.78rem' }}>
            Status Rekomendasi Kelas (Condition of Class)
          </label>
          <select
            value={categoryData.classRecommendation || 'Bebas Rekomendasi (Clean Class)'}
            onChange={(e) => onChange('classRecommendation', e.target.value)}
            className="select-control"
            style={{ fontSize: '0.8rem' }}
          >
            <option value="Bebas Rekomendasi (Clean Class)">✓ Bebas Rekomendasi (Clean Class / Laik)</option>
            <option value="Rekomendasi Minor (Outstanding Memo)">⚠️ Rekomendasi Minor (Ada Batas Waktu Tindak Lanjut)</option>
            <option value="Rekomendasi Perbaikan Pengedokan (Docking Due)">⚠️ Rekomendasi Perbaikan Bawah Air / Docking</option>
          </select>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
            Catatan teknis surveyor BKI terhadap kondisi fisik kapal.
          </span>
        </div>
      </div>
    );
  }

  if (normCat.includes('ksop')) {
    return (
      <div style={{
        padding: '0.9rem 1.1rem',
        borderRadius: '10px',
        background: 'rgba(245, 158, 11, 0.05)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.85rem'
      }}>
        <div>
          <label className="field-label" style={{ color: '#f59e0b', fontSize: '0.78rem' }}>
            🚢 Wilayah Kerja KSOP / Pelabuhan Pendaftaran
          </label>
          <input
            type="text"
            value={categoryData.portWorkArea || ''}
            onChange={(e) => onChange('portWorkArea', e.target.value)}
            placeholder="Contoh: KSOP Kelas II Pontianak / KSOP Banjarmasin"
            className="input-control"
            style={{ fontSize: '0.8rem' }}
          />
          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
            Kantor Kesyahbandaran tempat dokumen didaftarkan / diperiksa.
          </span>
        </div>
        <div>
          <label className="field-label" style={{ color: '#f59e0b', fontSize: '0.78rem' }}>
            No. Pengesahan / Registrasi Syahbandar
          </label>
          <input
            type="text"
            value={categoryData.endorsementNo || ''}
            onChange={(e) => onChange('endorsementNo', e.target.value)}
            placeholder="Contoh: Akta Laut No. 24587/Ba / Reg. KSOP"
            className="input-control mono"
            style={{ fontSize: '0.8rem' }}
          />
          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
            Nomor registrasi resmi di buku induk syahbandar.
          </span>
        </div>
      </div>
    );
  }

  if (normCat.includes('stat')) {
    return (
      <div style={{
        padding: '0.9rem 1.1rem',
        borderRadius: '10px',
        background: 'rgba(16, 185, 129, 0.05)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        gap: '0.85rem'
      }}>
        <div>
          <label className="field-label" style={{ color: '#10b981', fontSize: '0.78rem' }}>
            📜 Badan Terakui / RSO (Recognized Security Organization)
          </label>
          <input
            type="text"
            value={categoryData.recognizedOrg || ''}
            onChange={(e) => onChange('recognizedOrg', e.target.value)}
            placeholder="Contoh: Ditjen Hubla Langsung / BKI Statutory / RSO"
            className="input-control"
            style={{ fontSize: '0.8rem' }}
          />
          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
            Organisasi yang diberi wewenang audit statutori konvensi internasional.
          </span>
        </div>
        <div>
          <label className="field-label" style={{ color: '#10b981', fontSize: '0.78rem' }}>
            Nomor DOC (Document of Compliance) Perusahaan
          </label>
          <input
            type="text"
            value={categoryData.docCompanyNo || ''}
            onChange={(e) => onChange('docCompanyNo', e.target.value)}
            placeholder="Contoh: DOC-HUBLA/BHM/2026"
            className="input-control mono"
            style={{ fontSize: '0.8rem' }}
          />
          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
            Nomor sertifikat DOC PT. Pelayaran Baharimas Kalimantan.
          </span>
        </div>
      </div>
    );
  }

  if (normCat.includes('sehat') || normCat.includes('kkp')) {
    return (
      <div style={{
        padding: '0.9rem 1.1rem',
        borderRadius: '10px',
        background: 'rgba(236, 72, 153, 0.05)',
        border: '1px solid rgba(236, 72, 153, 0.25)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '0.85rem'
      }}>
        <div>
          <label className="field-label" style={{ color: '#ec4899', fontSize: '0.78rem' }}>
            🏥 Tipe Sertifikat Sanitasi Kapal
          </label>
          <select
            value={categoryData.sanitationStatus || 'SSCEC (Exemption - Bebas Tindakan Karantina)'}
            onChange={(e) => onChange('sanitationStatus', e.target.value)}
            className="select-control"
            style={{ fontSize: '0.8rem' }}
          >
            <option value="SSCEC (Exemption - Bebas Tindakan Karantina)">SSCEC (Bebas Tindakan / Sanitasi Prima - 6 Bulan)</option>
            <option value="SSCC (Control - Telah Dilakukan Tindakan Karantina)">SSCC (Telah Dilakukan Tindakan Sanitasi / Fumigasi)</option>
          </select>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
            Standar sertifikat IHR 2005 Balai Kekarantinaan Kesehatan Pelabuhan.
          </span>
        </div>
        <div>
          <label className="field-label" style={{ color: '#ec4899', fontSize: '0.78rem' }}>
            Status Kotak Obat P3K & Medis Kapal
          </label>
          <input
            type="text"
            value={categoryData.medicineChestStatus || ''}
            onChange={(e) => onChange('medicineChestStatus', e.target.value)}
            placeholder="Contoh: Lengkap & Sesuai Standar PM 39 / KKP"
            className="input-control"
            style={{ fontSize: '0.8rem' }}
          />
          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
            Catatan obat dan peralatan emergency medis di atas kapal.
          </span>
        </div>
      </div>
    );
  }

  if (normCat.includes('asur') || normCat.includes('insur')) {
    return (
      <div style={{
        padding: '0.9rem 1.1rem',
        borderRadius: '10px',
        background: 'rgba(168, 85, 247, 0.05)',
        border: '1px solid rgba(168, 85, 247, 0.25)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '0.85rem'
      }}>
        <div>
          <label className="field-label" style={{ color: '#a855f7', fontSize: '0.78rem' }}>
            🛡️ Nilai Pertanggungan Kapal (Sum Insured / Limit)
          </label>
          <input
            type="text"
            value={categoryData.sumInsured || ''}
            onChange={(e) => onChange('sumInsured', e.target.value)}
            placeholder="Contoh: Rp 15.000.000.000 / USD 1,000,000"
            className="input-control"
            style={{ fontSize: '0.8rem' }}
          />
          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
            Nilai pertanggungan hull & machinery atau batas tanggung jawab CLC/P&I.
          </span>
        </div>
        <div>
          <label className="field-label" style={{ color: '#a855f7', fontSize: '0.78rem' }}>
            Cakupan Jaminan Polis
          </label>
          <select
            value={categoryData.insuranceScope || 'Hull & Machinery (H&M)'}
            onChange={(e) => onChange('insuranceScope', e.target.value)}
            className="select-control"
            style={{ fontSize: '0.8rem' }}
          >
            <option value="Hull & Machinery (H&M)">Hull & Machinery (H&M) - Kerusakan Kapal</option>
            <option value="Protection & Indemnity (P&I)">Protection & Indemnity (P&I) - Pihak Ketiga & Awak</option>
            <option value="CLC Bunker 2001 (Pencemaran)">CLC Bunker 2001 - Tanggung Jawab Pencemaran</option>
            <option value="Wreck Removal (WRC 2007)">Wreck Removal - Pengangkatan Kerangka Kapal</option>
          </select>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
            Jenis perlindungan risiko pelayaran dan jaminan maritim.
          </span>
        </div>
      </div>
    );
  }

  return null;
};

const PRESET_INTERVAL_MAP = {
  '1y': { unit: 'year', value: 1, label: '1 Tahun Sebelum (H-365)' },
  '6m': { unit: 'month', value: 6, label: '6 Bulan Sebelum (H-180)' },
  '3m': { unit: 'month', value: 3, label: '3 Bulan Sebelum (H-90)' },
  '1m': { unit: 'month', value: 1, label: '1 Bulan Sebelum (H-30)' },
  '2w': { unit: 'week', value: 2, label: '2 Minggu Sebelum (H-14)' },
  '1w': { unit: 'week', value: 1, label: '1 Minggu Sebelum (H-7)' },
  '3d': { unit: 'day', value: 3, label: '3 Hari Sebelum (H-3)' },
  '1d': { unit: 'day', value: 1, label: '1 Hari Sebelum (H-1)' }
};

const DEFAULT_REMINDERS = {
  enabled: true,
  mode: '1m',
  label: '1 Bulan Sebelum (H-30)',
  manualAmount: 30,
  manualUnit: 'day',
  manualCustomDate: '',
  channels: {
    whatsapp: true,
    googleCalendar: true
  }
};

const calculateReminderDate = (expDateStr, unit, value) => {
  if (!expDateStr) return null;
  try {
    const d = new Date(expDateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return null;
    const target = new Date(d);
    const num = Number(value || 1);
    if (unit === 'year') {
      target.setFullYear(target.getFullYear() - num);
    } else if (unit === 'month') {
      target.setMonth(target.getMonth() - num);
    } else if (unit === 'week') {
      target.setDate(target.getDate() - (num * 7));
    } else if (unit === 'day') {
      target.setDate(target.getDate() - num);
    }
    return target.toISOString().split('T')[0];
  } catch (e) {
    return null;
  }
};

const formatIndonesianDate = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const d = parseInt(parts[2], 10);
    const m = months[parseInt(parts[1], 10) - 1];
    const y = parts[0];
    return `${d} ${m} ${y}`;
  } catch (e) {
    return dateStr;
  }
};

// Generate authentic official certificate mock data URL (SVG/image) for instant demonstration
const generateSampleCertificateFile = (name, docNo, category, vesselName, issuer) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100">
    <rect width="800" height="1100" fill="#f8fafc"/>
    <rect x="30" y="30" width="740" height="1040" fill="none" stroke="#0284c7" stroke-width="4"/>
    <rect x="40" y="40" width="720" height="1020" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="6,4"/>
    <text x="400" y="100" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#0f172a" text-anchor="middle">REPUBLIK INDONESIA - KEMENTERIAN PERHUBUNGAN</text>
    <text x="400" y="130" font-family="Arial, sans-serif" font-size="13" fill="#64748b" text-anchor="middle">DIREKTORAT JENDERAL PERHUBUNGAN LAUT / BIRO KLASIFIKASI INDONESIA</text>
    <line x1="80" y1="155" x2="720" y2="155" stroke="#0284c7" stroke-width="2"/>
    <text x="400" y="220" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#0284c7" text-anchor="middle">${(name || 'SERTIFIKAT KAPAL').toUpperCase()}</text>
    <text x="400" y="255" font-family="monospace" font-size="15" font-weight="bold" fill="#334155" text-anchor="middle">NO: ${docNo || 'CERT-BAHARIMAS-2026'}</text>
    <text x="400" y="290" font-family="Arial, sans-serif" font-size="13" fill="#64748b" text-anchor="middle">Kategori: ${category || 'STATUTORY'} • PT. Pelayaran Baharimas Kalimantan</text>
    <rect x="70" y="330" width="660" height="320" fill="#ffffff" rx="8" stroke="#cbd5e1"/>
    <text x="100" y="380" font-family="Arial, sans-serif" font-size="14" fill="#64748b">Kapal Terkait:</text>
    <text x="320" y="380" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#0f172a">${vesselName || 'TB. Baharimas'}</text>
    <text x="100" y="425" font-family="Arial, sans-serif" font-size="14" fill="#64748b">Instansi Penerbit:</text>
    <text x="320" y="425" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#0f172a">${issuer || 'KSOP / BKI'}</text>
    <text x="100" y="470" font-family="Arial, sans-serif" font-size="14" fill="#64748b">Kategori Maritim:</text>
    <text x="320" y="470" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#0284c7">${category || 'KSOP'}</text>
    <text x="100" y="515" font-family="Arial, sans-serif" font-size="14" fill="#64748b">Status Dokumen:</text>
    <text x="320" y="515" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#10b981">VERIFIED OFFICIAL / RESMI DIGITAL</text>
    <text x="100" y="560" font-family="Arial, sans-serif" font-size="14" fill="#64748b">Tgl Terbit / Expired:</text>
    <text x="320" y="560" font-family="monospace" font-size="13" fill="#334155">2026-09-19 s/d Berkelanjutan</text>
    <rect x="70" y="690" width="660" height="150" fill="#f1f5f9" rx="8"/>
    <text x="100" y="735" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">Catatan Verifikasi & Hasil Survei Lapangan:</text>
    <text x="100" y="765" font-family="Arial, sans-serif" font-size="12" fill="#475569">Dokumen sertifikat kapal ini telah memenuhi standar kelaikan laut SOLAS / ISM Code / PM 39.</text>
    <text x="100" y="790" font-family="Arial, sans-serif" font-size="12" fill="#475569">Semua pemeriksaan fisik lambung, mesin, dan perlengkapan keselamatan dinyatakan laik laut.</text>
    <circle cx="620" cy="940" r="50" fill="none" stroke="#ef4444" stroke-width="3"/>
    <text x="620" y="935" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ef4444" text-anchor="middle">KEMENTERIAN</text>
    <text x="620" y="950" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#ef4444" text-anchor="middle">PERHUBUNGAN</text>
    <text x="400" y="1030" font-family="Arial, sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">Dokumen Digital PMS Armada - PT. Pelayaran Baharimas Kalimantan</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
};

export const DocumentFormModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  vessels = [],
  defaultVesselId = null
}) => {
  if (!isOpen) return null;

  const {
    certificateCategories: contextCategories,
    addCertificateCategory,
    documentTemplates: contextTemplates,
    addDocumentTemplate
  } = usePMS();

  const activeCategories = contextCategories || [];
  const activeTemplates = contextTemplates || [];

  const isEditing = !!initialData?.id;
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isAddingNewCat, setIsAddingNewCat] = useState(!isEditing && activeCategories.length === 0);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingNewTemplate, setIsAddingNewTemplate] = useState(false);
  const [newTemplateCustomName, setNewTemplateCustomName] = useState('');
  const [newTemplateCategory, setNewTemplateCategory] = useState('');
  const [newTemplateValidity, setNewTemplateValidity] = useState(1);
  const [newTemplateIssuer, setNewTemplateIssuer] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);

  // Simplified notification state (dropdown + manual input)
  const [reminderMode, setReminderMode] = useState('1m');
  const [manualAmount, setManualAmount] = useState(30);
  const [manualUnit, setManualUnit] = useState('day');
  const [manualCustomDate, setManualCustomDate] = useState('');

  // File upload state
  const fileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState(null);

  const [formData, setFormData] = useState(() => {
    const initCat = initialData?.category || (activeCategories[0]?.id || 'BKI');
    const initProf = getCategoryProfile(initCat);
    const selVessel = vessels.find(v => v.id === (defaultVesselId || vessels[0]?.id));
    const port = selVessel?.portOfRegistry?.split(',')[0]?.trim() || 'Pontianak';
    const initIssuer = initialData?.issuer || (initProf.defaultIssuer ? initProf.defaultIssuer(port) : '');

    return {
      vesselId: defaultVesselId || vessels[0]?.id || '',
      category: initCat,
      surveyType: initialData?.surveyType || '',
      name: initialData?.name || '',
      documentNo: initialData?.documentNo || initialData?.certificateNo || '',
      issuer: initIssuer,
      issueDate: initialData?.issueDate || new Date().toISOString().split('T')[0],
      expiryDate: initialData?.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      mandatoryAuditor: initialData?.mandatoryAuditor || '',
      status: initialData?.status || 'Active',
      notificationReminders: DEFAULT_REMINDERS,
      categorySpecificData: initialData?.categorySpecificData || {},
      fileUrl: null,
      fileName: null,
      fileSize: null,
      fileType: null,
      uploadedAt: null
    };
  });

  useEffect(() => {
    const selVessel = vessels.find(v => v.id === (initialData?.vesselId || defaultVesselId || vessels[0]?.id));
    const port = selVessel?.portOfRegistry?.split(',')[0]?.trim() || 'Pontianak';

    if (initialData) {
      const existingReminders = initialData.notificationReminders || DEFAULT_REMINDERS;
      const cat = initialData.category || 'BKI';
      const prof = getCategoryProfile(cat);
      const issuer = initialData.issuer || (prof.defaultIssuer ? prof.defaultIssuer(port) : '');

      setFormData({
        vesselId: initialData.vesselId || defaultVesselId || vessels[0]?.id || 'v-001',
        category: cat,
        surveyType: initialData.surveyType || '',
        name: initialData.name || '',
        documentNo: initialData.documentNo || initialData.certificateNo || '',
        issuer,
        issueDate: initialData.issueDate || new Date().toISOString().split('T')[0],
        expiryDate: initialData.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        mandatoryAuditor: initialData.mandatoryAuditor || '',
        status: initialData.status || 'Active',
        notificationReminders: existingReminders,
        categorySpecificData: initialData.categorySpecificData || {},
        fileUrl: initialData.fileUrl || null,
        fileName: initialData.fileName || null,
        fileSize: initialData.fileSize || null,
        fileType: initialData.fileType || null,
        uploadedAt: initialData.uploadedAt || null
      });

      if (existingReminders.mode) {
        setReminderMode(existingReminders.mode);
      } else if (existingReminders.month?.enabled && existingReminders.month.value === 3) {
        setReminderMode('3m');
      } else if (existingReminders.year?.enabled) {
        setReminderMode('1y');
      } else if (existingReminders.week?.enabled) {
        setReminderMode('1w');
      } else if (existingReminders.day?.enabled) {
        setReminderMode('3d');
      } else {
        setReminderMode('1m');
      }

      if (existingReminders.manualAmount) setManualAmount(existingReminders.manualAmount);
      if (existingReminders.manualUnit) setManualUnit(existingReminders.manualUnit);
      if (existingReminders.manualCustomDate) setManualCustomDate(existingReminders.manualCustomDate);
    } else {
      const cat = activeCategories[0]?.id || 'BKI';
      const prof = getCategoryProfile(cat);
      const issuer = prof.defaultIssuer ? prof.defaultIssuer(port) : '';
      setFormData({
        vesselId: defaultVesselId || vessels[0]?.id || '',
        category: cat,
        surveyType: '',
        name: '',
        documentNo: '',
        issuer,
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        mandatoryAuditor: '',
        status: 'Active',
        notificationReminders: DEFAULT_REMINDERS,
        categorySpecificData: {},
        fileUrl: null,
        fileName: null,
        fileSize: null,
        fileType: null,
        uploadedAt: null
      });
      setReminderMode('1m');
      setManualAmount(30);
      setManualUnit('day');
      setManualCustomDate('');
    }
  }, [initialData, defaultVesselId, vessels]);

  // Documents templates that strictly belong to the currently selected category
  const categoryTemplates = activeTemplates.filter(t => t.category === formData.category);

  const updateReminderChannel = (channel, val) => {
    setFormData(prev => ({
      ...prev,
      notificationReminders: {
        ...prev.notificationReminders,
        channels: {
          ...prev.notificationReminders?.channels,
          [channel]: val
        }
      }
    }));
  };

  const handleSurveyTypeSelect = (surveyVal, validityYears = null) => {
    let years = validityYears;
    if (!years && surveyVal) {
      const lower = surveyVal.toLowerCase();
      if (lower.includes('2.5') || lower.includes('intermediate') || lower.includes('docking')) years = 2.5;
      else if (lower.includes('5 thn') || lower.includes('5 tahun') || lower.includes('special') || lower.includes('renewal')) years = 5;
      else if (lower.includes('10 thn') || lower.includes('10 tahun') || lower.includes('surat ukur')) years = 10;
      else if (lower.includes('6 bln') || lower.includes('6 bulan') || lower.includes('0.5') || lower.includes('sscec')) years = 0.5;
      else if (lower.includes('annual') || lower.includes('1 thn') || lower.includes('1 tahun') || lower.includes('tahunan') || lower.includes('kelaiklautan') || lower.includes('safety equipment') || lower.includes('radio') || lower.includes('endorsement')) years = 1;
    }

    setFormData(prev => {
      const updated = {
        ...prev,
        surveyType: surveyVal
      };

      if (years && prev.issueDate) {
        try {
          const d = new Date(prev.issueDate + 'T00:00:00');
          if (!isNaN(d.getTime())) {
            if (years === 2.5) {
              d.setMonth(d.getMonth() + 30);
            } else if (years < 1) {
              d.setMonth(d.getMonth() + Math.round(years * 12));
            } else {
              d.setFullYear(d.getFullYear() + years);
            }
            updated.expiryDate = d.toISOString().split('T')[0];
          }
        } catch {}
      }
      return updated;
    });
  };

  const handleCategoryChange = (newCat) => {
    const newProfile = getCategoryProfile(newCat);
    const selectedVessel = vessels.find(v => v.id === formData.vesselId);
    const portName = selectedVessel?.portOfRegistry?.split(',')[0]?.trim() || 'Pontianak';
    const autoIssuer = newProfile.defaultIssuer ? newProfile.defaultIssuer(portName) : `Instansi ${newCat}`;

    setFormData(prev => {
      const shouldUpdateIssuer = !prev.issuer ||
        prev.issuer.includes('Biro Klasifikasi') ||
        prev.issuer.includes('KSOP') ||
        prev.issuer.includes('Hubla') ||
        prev.issuer.includes('Karantina') ||
        prev.issuer.includes('Jasindo') ||
        prev.issuer.includes('Instansi Penerbit');

      // Auto-update surveyType if previous was empty or from standard survey list
      let nextSurvey = prev.surveyType;
      if (!nextSurvey || Object.values(CATEGORY_FORM_PROFILES).some(p => p.surveyTypes?.includes(prev.surveyType))) {
        nextSurvey = newProfile.surveyTypes ? newProfile.surveyTypes[0] : '';
      }

      // Auto-adjust default expiry for Kesehatan SSCEC (6 months)
      let nextExpiry = prev.expiryDate;
      if (newCat.toLowerCase().includes('sehat') || newCat.toLowerCase().includes('kkp')) {
        try {
          const d = new Date((prev.issueDate || new Date().toISOString().split('T')[0]) + 'T00:00:00');
          d.setMonth(d.getMonth() + 6);
          nextExpiry = d.toISOString().split('T')[0];
        } catch {}
      }

      return {
        ...prev,
        category: newCat,
        issuer: shouldUpdateIssuer ? autoIssuer : prev.issuer,
        surveyType: nextSurvey,
        expiryDate: nextExpiry
      };
    });
  };

  const updateCategorySpecific = (key, val) => {
    setFormData(prev => ({
      ...prev,
      categorySpecificData: {
        ...(prev.categorySpecificData || {}),
        [key]: val
      }
    }));
  };

  // Handle file selection from local device
  const handleFileUpload = (e) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 15MB
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 15 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result;
      const sizeStr = file.size >= 1024 * 1024
        ? (file.size / (1024 * 1024)).toFixed(2) + ' MB'
        : (file.size / 1024).toFixed(0) + ' KB';

      setFormData(prev => ({
        ...prev,
        fileUrl: base64Data,
        fileName: file.name,
        fileSize: sizeStr,
        fileType: file.type || 'application/pdf',
        uploadedAt: new Date().toISOString()
      }));
    };
    reader.onerror = () => {
      setUploadError('Gagal membaca file dari komputer.');
    };
    reader.readAsDataURL(file);
  };

  // Quick sample official PDF generator
  const handleUseSamplePDF = () => {
    const vessel = vessels.find(v => v.id === formData.vesselId);
    const sampleUrl = generateSampleCertificateFile(
      formData.name || 'Pas Besar',
      formData.documentNo || 'PK.201/KSOP-2026',
      formData.category,
      vessel?.name,
      formData.issuer
    );

    setFormData(prev => ({
      ...prev,
      fileUrl: sampleUrl,
      fileName: `Scan_${(formData.name || 'Sertifikat').replace(/\s+/g, '_')}_${vessel?.name?.replace(/\s+/g, '_') || 'Kapal'}.svg`,
      fileSize: '1.45 MB (Verified)',
      fileType: 'image/svg+xml',
      uploadedAt: new Date().toISOString()
    }));
    setUploadError(null);
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({
      ...prev,
      fileUrl: null,
      fileName: null,
      fileSize: null,
      fileType: null,
      uploadedAt: null
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getEffectiveReminder = () => {
    const expDate = formData.expiryDate;
    if (!expDate) return { alertDate: null, label: '-', daysBefore: 0, unit: 'month', value: 1 };

    if (reminderMode === 'MANUAL_DATE') {
      const alertDate = manualCustomDate || calculateReminderDate(expDate, 'month', 1) || expDate;
      const d1 = new Date(alertDate + 'T00:00:00');
      const d2 = new Date(expDate + 'T00:00:00');
      const daysBefore = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
      return {
        alertDate,
        label: `Tgl ${formatIndonesianDate(alertDate)} (${daysBefore} hr sblm)`,
        daysBefore,
        unit: 'custom_date',
        value: daysBefore
      };
    }

    if (reminderMode === 'MANUAL_INTERVAL') {
      const amt = Number(manualAmount) || 1;
      const alertDate = calculateReminderDate(expDate, manualUnit, amt);
      const unitLabel = manualUnit === 'day' ? 'Hari' : manualUnit === 'week' ? 'Minggu' : manualUnit === 'month' ? 'Bulan' : 'Tahun';
      const d1 = new Date(alertDate + 'T00:00:00');
      const d2 = new Date(expDate + 'T00:00:00');
      const daysBefore = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
      return {
        alertDate,
        label: `${amt} ${unitLabel} Sebelum (H-${daysBefore})`,
        daysBefore,
        unit: manualUnit,
        value: amt
      };
    }

    const preset = PRESET_INTERVAL_MAP[reminderMode] || PRESET_INTERVAL_MAP['1m'];
    const alertDate = calculateReminderDate(expDate, preset.unit, preset.value);
    const d1 = new Date(alertDate + 'T00:00:00');
    const d2 = new Date(expDate + 'T00:00:00');
    const daysBefore = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return {
      alertDate,
      label: preset.label,
      daysBefore,
      unit: preset.unit,
      value: preset.value
    };
  };

  const effectiveReminder = getEffectiveReminder();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const eff = getEffectiveReminder();
    const finalReminders = {
      enabled: formData.notificationReminders?.enabled !== false,
      mode: reminderMode,
      label: eff.label,
      calculatedDate: eff.alertDate,
      daysBefore: eff.daysBefore,
      manualAmount,
      manualUnit,
      manualCustomDate,
      year: { enabled: eff.unit === 'year', value: eff.unit === 'year' ? eff.value : 1 },
      month: { enabled: eff.unit === 'month', value: eff.unit === 'month' ? eff.value : 1 },
      week: { enabled: eff.unit === 'week', value: eff.unit === 'week' ? eff.value : 1 },
      day: { enabled: eff.unit === 'day' || eff.unit === 'custom_date', value: eff.daysBefore },
      channels: formData.notificationReminders?.channels || { whatsapp: true, googleCalendar: true }
    };

    onSave({
      ...formData,
      notificationReminders: finalReminders
    });
    onClose();
  };

  const currentProfile = getCategoryProfile(formData.category);

  // Hanya pertahankan BKI sesuai instruksi user ("hilangkan dulu pertahankan BKI")
  const allCategoryList = useMemo(() => {
    const list = [
      {
        id: 'BKI',
        label: 'BKI (Biro Klasifikasi Indonesia)',
        code: 'BKI',
        color: '#38bdf8',
        bgColor: 'rgba(2, 132, 199, 0.12)',
        borderColor: 'rgba(56, 189, 248, 0.35)'
      }
    ];

    // Jika sedang edit dokumen lama yang kategorinya bukan BKI, tetap sertakan agar dokumen tidak error
    if (isEditing && initialData?.category && initialData.category !== 'BKI') {
      const prof = getCategoryProfile(initialData.category);
      list.push({
        id: initialData.category,
        label: prof.label || initialData.category,
        code: initialData.category,
        color: prof.color,
        bgColor: prof.bgColor,
        borderColor: prof.borderColor
      });
    }

    return list;
  }, [isEditing, initialData]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(2, 6, 23, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '1.25rem'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '820px',
        maxHeight: '92vh',
        overflowY: 'auto',
        borderRadius: '16px',
        border: `1px solid ${currentProfile.borderColor || 'rgba(56, 189, 248, 0.35)'}`,
        boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 25px ${currentProfile.color}15`,
        padding: '1.75rem 2rem',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: currentProfile.bgColor,
              border: `1px solid ${currentProfile.borderColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: currentProfile.color,
              transition: 'all 0.25s ease'
            }}>
              {React.createElement(currentProfile.icon || FileText, { size: 24 })}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{isEditing ? `Edit Dokumen: ${formData.name}` : 'Tambah Dokumen / Sertifikat Baru'}</span>
                <span className="badge" style={{ fontSize: '0.7rem', background: currentProfile.bgColor, color: currentProfile.color, border: `1px solid ${currentProfile.borderColor}` }}>
                  {currentProfile.shortLabel}
                </span>
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Kategori Maritim: <strong style={{ color: currentProfile.color }}>{currentProfile.label}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ width: '34px', height: '34px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* 1. VESSEL SELECTION */}
          <div>
            <label className="field-label" style={{ fontWeight: 700 }}>Kapal Terkait *</label>
            <select
              value={formData.vesselId}
              onChange={(e) => {
                const newVId = e.target.value;
                const selVessel = vessels.find(v => v.id === newVId);
                const portName = selVessel?.portOfRegistry?.split(',')[0]?.trim() || 'Pontianak';
                setFormData(prev => {
                  const prof = getCategoryProfile(prev.category);
                  const autoIssuer = prof.defaultIssuer ? prof.defaultIssuer(portName) : prev.issuer;
                  return {
                    ...prev,
                    vesselId: newVId,
                    issuer: (!prev.issuer || prev.issuer.includes('KSOP') || prev.issuer.includes('BKI') || prev.issuer.includes('KKP')) ? autoIssuer : prev.issuer
                  };
                });
              }}
              className="select-control"
              required
            >
              {vessels.length === 0 ? (
                <option value="" disabled>-- Belum ada kapal (Silakan daftarkan kapal dahulu) --</option>
              ) : (
                <>
                  {vessels.some(v => v.ownershipStatus !== 'As Operator') && (
                    <optgroup label={`⚓ AS OWNER (${vessels.filter(v => v.ownershipStatus !== 'As Operator').length} Kapal)`}>
                      {vessels.filter(v => v.ownershipStatus !== 'As Operator').map(v => (
                        <option key={v.id} value={v.id}>🚢 {v.name} [Owner]</option>
                      ))}
                    </optgroup>
                  )}
                  {vessels.some(v => v.ownershipStatus === 'As Operator') && (
                    <optgroup label={`⚙️ AS OPERATOR (${vessels.filter(v => v.ownershipStatus === 'As Operator').length} Kapal)`}>
                      {vessels.filter(v => v.ownershipStatus === 'As Operator').map(v => (
                        <option key={v.id} value={v.id}>⚙️ {v.name} [Operator]</option>
                      ))}
                    </optgroup>
                  )}
                </>
              )}
            </select>
          </div>

          {/* 2. DYNAMIC CATEGORY SELECTOR TABS (BKI, KSOP, Statutory, Kesehatan, Asuransi, etc.) */}
          <div style={{
            padding: '1rem',
            borderRadius: '12px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <label className="field-label" style={{ marginBottom: '0.1rem', fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.03em', color: currentProfile.color }}>
                  KATEGORI SERTIFIKAT KAPAL
                </label>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                  Formulir khusus sertifikasi BKI (Biro Klasifikasi Indonesia) - Lambung, Mesin, dan Survei Periodik.
                </span>
              </div>

              {!isAddingNewCat && (
                <button
                  type="button"
                  onClick={() => setIsAddingNewCat(true)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.2rem 0.6rem', fontSize: '0.72rem', color: '#38bdf8', whiteSpace: 'nowrap' }}
                >
                  <Plus size={12} />
                  <span>+ Kategori Lain</span>
                </button>
              )}
            </div>

            {/* Visual Category Tab Buttons */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.55rem'
            }}>
              {allCategoryList.map(cat => {
                const prof = getCategoryProfile(cat.id);
                const isSelected = (formData.category || '').toLowerCase() === cat.id.toLowerCase();
                const IconComp = prof.icon || FileText;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      padding: '0.65rem 0.75rem',
                      borderRadius: '10px',
                      border: isSelected ? `2px solid ${prof.color}` : '1px solid var(--border-subtle)',
                      background: isSelected ? prof.bgColor : 'rgba(255, 255, 255, 0.03)',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      textAlign: 'left',
                      boxShadow: isSelected ? `0 0 16px ${prof.color}35` : 'none'
                    }}
                  >
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '8px',
                      background: isSelected ? prof.color : 'rgba(255, 255, 255, 0.08)',
                      color: isSelected ? '#0f172a' : prof.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <IconComp size={16} />
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{
                        fontSize: '0.82rem',
                        fontWeight: isSelected ? 800 : 600,
                        color: isSelected ? prof.color : 'var(--text-main)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {prof.shortLabel || cat.label}
                      </div>
                      <div style={{ fontSize: '0.67rem', color: isSelected ? 'var(--text-secondary)' : 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {cat.id === 'BKI' ? 'Survei Kelas' : cat.id === 'KSOP' ? 'Kelaiklautan' : cat.id === 'Statutory' ? 'ISM & MARPOL' : cat.id === 'Kesehatan' ? 'Sanitasi SSCEC' : cat.id === 'Asuransi' ? 'P&I / H&M / CLC' : 'Dokumen'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Manual New Category Form */}
            {isAddingNewCat && (
              <div style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-glass)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                marginTop: '0.2rem'
              }}>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Ketik nama kategori baru (contoh: Dishub / Sertifikat Radio)..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="input-control"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newCategoryName.trim()) return;
                      const created = addCertificateCategory({ label: newCategoryName.trim() });
                      handleCategoryChange(created.id);
                      setNewCategoryName('');
                      setIsAddingNewCat(false);
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ whiteSpace: 'nowrap', padding: '0.4rem 0.7rem', fontSize: '0.75rem' }}
                  >
                    Simpan Kategori
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewCat(false);
                      setNewCategoryName('');
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.4rem 0.5rem', fontSize: '0.75rem' }}
                  >
                    Batal
                  </button>
                </div>
                <span style={{ fontSize: '0.68rem', color: '#10b981' }}>
                  ✓ Kategori baru otomatis tersimpan di Data Master & tampil di form.
                </span>
              </div>
            )}

            {/* Active Mode Banner */}
            <div style={{
              padding: '0.7rem 0.95rem',
              borderRadius: '8px',
              background: currentProfile.bgColor,
              border: `1px solid ${currentProfile.borderColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              marginTop: '0.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '7px',
                  background: currentProfile.color,
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {React.createElement(currentProfile.icon || FileText, { size: 16 })}
                </div>
                <div>
                  <div style={{ fontSize: '0.83rem', fontWeight: 800, color: currentProfile.color, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>Form Mode: {currentProfile.label}</span>
                    <span className="badge" style={{ fontSize: '0.62rem', background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff' }}>
                      Aktif
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    {currentProfile.tagline}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. JENIS SURVEY / SIKLUS PEMERIKSAAN DOKUMEN KAPAL */}
          <div style={{
            padding: '1.1rem 1.25rem',
            borderRadius: '12px',
            background: 'var(--bg-surface-elevated)',
            border: `1px solid ${currentProfile.borderColor || 'var(--border-subtle)'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            transition: 'border-color 0.25s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <label style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: currentProfile.color || '#38bdf8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}>
                  <ClipboardCheck size={16} />
                  <span>JENIS SURVEY / PEMERIKSAAN {currentProfile.shortLabel.toUpperCase()} *</span>
                </label>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                  Pilih siklus pemeriksaan atau jenis survey khusus {currentProfile.shortLabel} (bisa diketik manual).
                </span>
              </div>
            </div>

            <MasterCombobox
              name="surveyType"
              value={formData.surveyType || ''}
              onChange={(e) => {
                handleSurveyTypeSelect(e.target.value);
              }}
              options={currentProfile.surveyTypes || []}
              placeholder={currentProfile.surveyPlaceholder || 'Pilih dari daftar survey atau ketik manual jenis survey...'}
            />
          </div>

          {/* 4. NAME & DOCUMENT NUMBER */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem' }}>
            <div>
              <label className="field-label">Nama Sertifikat / Dokumen *</label>
              <input
                type="text"
                required
                placeholder={currentProfile.namePlaceholder || 'Contoh: Pas Besar / Cargo Ship Safety Equipment'}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="input-control"
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
                Ketik nama resmi sertifikat kapal secara manual sesuai fisik dokumen (bebas dan tidak dipaksa sama dengan template).
              </span>

              {/* Quick Certificate Name Badges */}
              {currentProfile.quickCertificateNames && currentProfile.quickCertificateNames.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.45rem' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '0.2rem' }}>
                    Contoh Nama Sertifikat {currentProfile.shortLabel}:
                  </span>
                  {currentProfile.quickCertificateNames.map(cn => (
                    <button
                      key={cn}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, name: cn }));
                        if (cn.includes('SSCEC')) {
                          handleSurveyTypeSelect('Pembaruan Rutin SSCEC 6 Bulanan (Exemption Certificate)', 0.5);
                        } else if (cn.includes('Surat Ukur')) {
                          handleSurveyTypeSelect('Pemeriksaan Fisik Surat Ukur (Tonnage Measurement)', 10);
                        } else if (cn.includes('Pas Besar')) {
                          handleSurveyTypeSelect('Non-Survey (Pas Besar / Surat Laut / Izin Trayek RPT / Dokumen Tetap)', 5);
                        } else if (cn.includes('Lambung') || cn.includes('Mesin')) {
                          handleSurveyTypeSelect('Special / Renewal Survey (Survei Pembaruan Kelas 5 Tahunan)', 5);
                        }
                      }}
                      className="badge"
                      style={{
                        cursor: 'pointer',
                        fontSize: '0.68rem',
                        padding: '0.18rem 0.45rem',
                        background: formData.name === cn ? `${currentProfile.color}33` : 'rgba(255, 255, 255, 0.04)',
                        border: `1px solid ${formData.name === cn ? currentProfile.color : 'var(--border-subtle)'}`,
                        color: formData.name === cn ? currentProfile.color : 'var(--text-secondary)',
                        transition: 'all 0.15s ease'
                      }}
                      title={`Klik untuk mengisi nama: ${cn}`}
                    >
                      + {cn}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="field-label">Nomor Sertifikat / Dokumen *</label>
              <input
                type="text"
                required
                placeholder={currentProfile.docNoPlaceholder || 'Contoh: PK.201/KSOP-24587-2026'}
                value={formData.documentNo}
                onChange={(e) => setFormData(prev => ({ ...prev, documentNo: e.target.value }))}
                className="input-control mono"
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
                Nomor registrasi dokumen resmi yang tercantum pada fisik sertifikat.
              </span>
            </div>
          </div>

          {/* 5. SURVEYOR / AUDITOR & ISSUER ROW */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: '1rem',
            padding: '1rem',
            borderRadius: '10px',
            background: currentProfile.bgColor,
            border: `1px solid ${currentProfile.borderColor}`,
            transition: 'all 0.25s ease'
          }}>
            <div>
              <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: currentProfile.color }}>
                <UserCheck size={15} />
                <span>{currentProfile.auditorLabel || 'Surveyor / Auditor Pemeriksa *'}</span>
              </label>
              <input
                type="text"
                required
                placeholder={currentProfile.auditorPlaceholder || 'Contoh: Nama Surveyor / Marine Inspector'}
                value={formData.mandatoryAuditor}
                onChange={(e) => setFormData(prev => ({ ...prev, mandatoryAuditor: e.target.value }))}
                className="input-control"
                style={{ fontWeight: 600 }}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
                {currentProfile.auditorHelper || 'Nama surveyor yang bertugas memeriksa kapal ini (bisa berbeda-beda setiap survei, tidak disimpan di data master).'}
              </span>
            </div>

            <div>
              <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Building2 size={15} />
                <span>Instansi Penerbit (Issuer) *</span>
              </label>
              <input
                type="text"
                required
                placeholder={currentProfile.issuerPlaceholder || 'Contoh: KSOP Kelas II Pontianak / BKI'}
                value={formData.issuer}
                onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
                className="input-control"
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
                Otoritas pelabuhan atau badan sertifikasi resmi.
              </span>
            </div>
          </div>

          {/* 6. CATEGORY-SPECIFIC SPECIAL FIELDS (BKI, KSOP, STATUTORY, KESEHATAN, ASURANSI) */}
          <CategorySpecialFields
            categoryId={formData.category}
            categoryData={formData.categorySpecificData}
            onChange={updateCategorySpecific}
          />

          {/* 5. TANGGAL PENERBITAN & TANGGAL EXPIRED */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            padding: '1rem',
            borderRadius: '10px',
            background: 'rgba(2, 132, 199, 0.05)',
            border: '1px solid rgba(56, 189, 248, 0.2)'
          }}>
            <div>
              <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8' }}>
                <Calendar size={14} />
                <span>Tanggal Penerbitan (Issue Date) *</span>
              </label>
              <input
                type="date"
                required
                value={formData.issueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                className="input-control mono"
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
                Tanggal resmi dokumen diterbitkan oleh instansi
              </span>
            </div>

            <div>
              <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b' }}>
                <Calendar size={14} />
                <span>Tanggal Expired (Jatuh Tempo) *</span>
              </label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                className="input-control mono"
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
                Batas akhir masa berlaku / survei berkala
              </span>
            </div>
          </div>

          {/* 6. MENU UPLOAD DOKUMEN (FILE SCAN SERTIFIKAT) - CRUCIAL USER REQUIREMENT */}
          <div style={{
            padding: '1.1rem 1.25rem',
            borderRadius: '12px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <UploadCloud size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>Upload Berkas / Dokumen Scan Sertifikat</span>
                    {formData.fileUrl && (
                      <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                        ✓ Berkas Tersedia
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                    Unggah file scan PDF atau foto dokumen asli kapal (maksimal 15 MB).
                  </div>
                </div>
              </div>

              {!formData.fileUrl && (
                <button
                  type="button"
                  onClick={handleUseSamplePDF}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  title="Gunakan contoh berkas scan sertifikat digital untuk demonstrasi"
                >
                  <Sparkles size={12} />
                  <span>Pasang Contoh PDF Resmi</span>
                </button>
              )}
            </div>

            {/* Upload Area / File Display */}
            {formData.fileUrl ? (
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {formData.fileUrl && (formData.fileType?.includes('image') || formData.fileUrl.startsWith('data:image/')) ? (
                    <img
                      src={formData.fileUrl}
                      alt="Thumbnail"
                      onClick={() => setPreviewDoc(formData)}
                      style={{
                        width: '38px',
                        height: '38px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        cursor: 'pointer'
                      }}
                      title="Klik untuk melihat pratinjau dokumen"
                    />
                  ) : (
                    <FileCheck size={26} color="#10b981" />
                  )}
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {formData.fileName || 'Berkas_Sertifikat.pdf'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                      Ukuran: {formData.fileSize || '1.2 MB'} • Diunggah: {formData.uploadedAt ? new Date(formData.uploadedAt).toLocaleTimeString('id-ID') : 'Baru saja'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.fileUrl) {
                        setPreviewDoc({
                          ...formData,
                          name: formData.name || 'Dokumen Sertifikat'
                        });
                      }
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8' }}
                  >
                    <Eye size={13} />
                    <span>Lihat Berkas</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Trash2 size={13} />
                    <span>Hapus Berkas</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,image/*,.doc,.docx"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="doc-file-upload-input"
                />
                <label
                  htmlFor="doc-file-upload-input"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.25rem 1rem',
                    borderRadius: '8px',
                    border: '2px dashed var(--border-subtle)',
                    background: 'rgba(0, 0, 0, 0.15)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10b981'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                >
                  <FileUp size={28} color="#94a3b8" style={{ marginBottom: '0.4rem' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    Klik untuk Pilih File Dokumen (PDF, JPG, PNG)
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                    Tersimpan otomatis ke sistem Cloud PMS dan dapat diunduh langsung dari tabel sertifikat
                  </span>
                </label>
              </div>
            )}

            {uploadError && (
              <span style={{ fontSize: '0.72rem', color: '#ef4444' }}>
                ⚠️ {uploadError}
              </span>
            )}
          </div>

          {/* 7. PENGATURAN NOTIFIKASI & PENGINGAT EXPIRED */}
          <div style={{
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(56, 189, 248, 0.05) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {/* Header Section with Title & Master Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <BellRing size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>Pengaturan Notifikasi & Pengingat Expired</span>
                    <span className="badge" style={{ fontSize: '0.65rem', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                      Dropdown & Manual
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                    Pilih interval notifikasi sebelum dokumen jatuh tempo (pilih cepat atau ketik manual).
                  </div>
                </div>
              </div>

              {/* Master Toggle */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>
                <input
                  type="checkbox"
                  checked={formData.notificationReminders?.enabled !== false}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setFormData(prev => ({
                      ...prev,
                      notificationReminders: {
                        ...prev.notificationReminders,
                        enabled: val
                      }
                    }));
                  }}
                  style={{ width: '15px', height: '15px', accentColor: '#f59e0b', cursor: 'pointer' }}
                />
                <span style={{ color: formData.notificationReminders?.enabled !== false ? '#10b981' : 'var(--text-muted)' }}>
                  {formData.notificationReminders?.enabled !== false ? '● Notifikasi Aktif' : '○ Nonaktif'}
                </span>
              </label>
            </div>

            {formData.notificationReminders?.enabled !== false && (
              <>
                {/* Single Row: Simple Dropdown & Manual Input Controls */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: (reminderMode === 'MANUAL_INTERVAL' || reminderMode === 'MANUAL_DATE') ? '1.2fr 1.1fr' : '1fr',
                  gap: '0.75rem',
                  alignItems: 'flex-end'
                }}>
                  {/* Dropdown Selector */}
                  <div>
                    <label className="field-label" style={{ fontSize: '0.75rem', marginBottom: '0.3rem', color: '#f59e0b' }}>
                      Waktu Pengingat Sebelum Expired (Tahun / Bulan / Minggu / Hari) *
                    </label>
                    <select
                      value={reminderMode}
                      onChange={(e) => setReminderMode(e.target.value)}
                      className="select-control"
                      style={{ fontWeight: 600, background: 'var(--bg-surface)' }}
                    >
                      <optgroup label="⚡ Pilihan Cepat Maritim (Standar)">
                        <option value="1y">📅 1 Tahun Sebelumnya (H-365) - Survey BKI / Docking</option>
                        <option value="6m">🗓️ 6 Bulan Sebelumnya (H-180)</option>
                        <option value="3m">🗓️ 3 Bulan Sebelumnya (H-90) - Pengajuan Survey BKI/KSOP</option>
                        <option value="1m">🗓️ 1 Bulan Sebelumnya (H-30) - Standar Peringatan Maritim</option>
                        <option value="2w">⏱️ 2 Minggu Sebelumnya (H-14)</option>
                        <option value="1w">⏱️ 1 Minggu Sebelumnya (H-7) - Inspeksi Fisik</option>
                        <option value="3d">🚨 3 Hari Sebelumnya (H-3) - Peringatan Darurat</option>
                        <option value="1d">🚨 1 Hari Sebelumnya (H-1) - Batas Akhir Kritis</option>
                      </optgroup>
                      <optgroup label="✍️ Isi Manual (Kustom Bebas)">
                        <option value="MANUAL_INTERVAL">✍️ Isi Manual: Tentukan Jumlah Hari / Minggu / Bulan / Tahun...</option>
                        <option value="MANUAL_DATE">📅 Isi Manual: Pilih Tanggal Pengingat Kalender Sendiri...</option>
                      </optgroup>
                    </select>
                  </div>

                  {/* Manual Interval Input */}
                  {reminderMode === 'MANUAL_INTERVAL' && (
                    <div>
                      <label className="field-label" style={{ fontSize: '0.75rem', marginBottom: '0.3rem', color: '#38bdf8' }}>
                        Isi Manual: Mau Berapa Lama Sebelum Expired?
                      </label>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <input
                          type="number"
                          min="1"
                          max="3650"
                          value={manualAmount}
                          onChange={(e) => setManualAmount(Math.max(1, parseInt(e.target.value) || 1))}
                          className="input-control mono"
                          style={{ width: '85px', fontWeight: 700, textAlign: 'center' }}
                          placeholder="45"
                        />
                        <select
                          value={manualUnit}
                          onChange={(e) => setManualUnit(e.target.value)}
                          className="select-control"
                          style={{ flex: 1, fontWeight: 600 }}
                        >
                          <option value="day">Hari Sebelum Expired</option>
                          <option value="week">Minggu Sebelum Expired</option>
                          <option value="month">Bulan Sebelum Expired</option>
                          <option value="year">Tahun Sebelum Expired</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Manual Calendar Date Input */}
                  {reminderMode === 'MANUAL_DATE' && (
                    <div>
                      <label className="field-label" style={{ fontSize: '0.75rem', marginBottom: '0.3rem', color: '#38bdf8' }}>
                        Pilih Tanggal Pengingat Kalender:
                      </label>
                      <input
                        type="date"
                        value={manualCustomDate || calculateReminderDate(formData.expiryDate, 'month', 1) || ''}
                        onChange={(e) => setManualCustomDate(e.target.value)}
                        className="input-control mono"
                        style={{ fontWeight: 700 }}
                      />
                    </div>
                  )}
                </div>

                {/* Status Hasil Kalkulasi & Channels */}
                <div style={{
                  padding: '0.55rem 0.85rem',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  fontSize: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                    <Clock size={13} color="#f59e0b" />
                    <span>Jadwal Notifikasi:</span>
                    <strong style={{ color: '#38bdf8', fontSize: '0.82rem' }}>
                      🔔 {formatIndonesianDate(effectiveReminder.alertDate)}
                    </strong>
                    {effectiveReminder.daysBefore !== undefined && (
                      <span style={{ color: effectiveReminder.daysBefore > 0 ? '#10b981' : '#ef4444', fontSize: '0.7rem' }}>
                        ({effectiveReminder.daysBefore > 0 ? `${effectiveReminder.daysBefore} hari sebelum jatuh tempo` : 'Hari H / Lewat'})
                      </span>
                    )}
                  </div>

                  {/* Saluran Notifikasi */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', color: '#22c55e', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={formData.notificationReminders?.channels?.whatsapp !== false}
                        onChange={(e) => updateReminderChannel('whatsapp', e.target.checked)}
                        style={{ accentColor: '#22c55e', cursor: 'pointer' }}
                      />
                      <span>WhatsApp WA</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', color: '#38bdf8', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={formData.notificationReminders?.channels?.googleCalendar !== false}
                        onChange={(e) => updateReminderChannel('googleCalendar', e.target.checked)}
                        style={{ accentColor: '#38bdf8', cursor: 'pointer' }}
                      />
                      <span>Google Calendar</span>
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.5rem',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.25rem'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              * Data tersimpan terpusat di Master Data dan armada Baharimas
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
                }}
              >
                <Save size={15} />
                <span>{isEditing ? 'Simpan Perubahan Sertifikat' : 'Simpan Sertifikat Dokumen'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <DocumentPreviewModal
          document={previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </div>
  );
};
