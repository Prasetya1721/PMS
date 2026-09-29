import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  Ship,
  Compass,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Upload,
  Printer,
  Calendar,
  Users,
  CheckSquare,
  Award,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { RoleFlowHeader } from './roleflow/RoleFlowHeader';
import { RoleFlowStandardToggle } from './roleflow/RoleFlowStandardToggle';
import { RoleFlowSubTabs } from './roleflow/RoleFlowSubTabs';
import { RoleFlowFooter } from './roleflow/RoleFlowFooter';
import { RoleFlowAuditorTab } from './roleflow/RoleFlowAuditorTab';
import { RoleFlowAuditeeTab } from './roleflow/RoleFlowAuditeeTab';
import { RoleFlowMatrixTab } from './roleflow/RoleFlowMatrixTab';

export const AuditRoleFlowModal = ({
  isOpen,
  onClose,
  currentPerspective = 'dpa',
  onSelectPerspective,
  initialStandard = 'SMC'
}) => {
  const [standard, setStandard] = useState(initialStandard || 'SMC');
  const [activeTab, setActiveTab] = useState(currentPerspective === 'nakhoda' ? 'auditee' : 'auditor');

  // Sinkronisasi saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setStandard(initialStandard || 'SMC');
      setActiveTab(currentPerspective === 'nakhoda' ? 'auditee' : 'auditor');
    }
  }, [isOpen, initialStandard, currentPerspective]);

  if (!isOpen) return null;

  // =========================================================================
  // DATA PETUNJUK & ALUR AUDIT SMC (KAPAL ARMADA ONBOARD - 74 KLAUSUL BKI)
  // =========================================================================
  const smcDpaSteps = [
    {
      step: 1,
      title: 'Inisiasi & Jadwal Audit SMC Kapal (Tahap 1: Sesi & Tim)',
      ismRef: 'ISM Code Klausul 4 & 12.1',
      roleTitle: 'Tanggung Jawab DPA (Designated Person Ashore)',
      description: 'DPA merencanakan audit keselamatan periodik kapal armada, menunjuk Lead Auditor independen, menetapkan tanggal inspeksi di pelabuhan atau galangan, dan menerbitkan surat tugas resmi ke Nakhoda.',
      actions: [
        'Menentukan jadwal audit periodik kapal sesuai siklus tahunan ISM Code (Annual Audit Plan).',
        'Menunjuk Lead Auditor independen yang berkualifikasi dan tidak memiliki konflik kepentingan.',
        'Menerbitkan Audit Plan resmi dan memberitahukan Nakhoda jadwal inspeksi di atas kapal.',
        'Mengonfirmasi pemasangan standar BKI SMS Shipboard Checklist Rev 05 (74 klausul pemeriksaan).'
      ],
      output: 'Nomor Registrasi Sesi Audit SMC Resmi (cth: AUD-SMC-RP2004-2026) & Surat Tugas Auditor.'
    },
    {
      step: 2,
      title: 'Monitoring Pemeriksaan 74 Klausul Fisik & Prosedur (Tahap 2: Checklist Klausul)',
      ismRef: 'ISM Code Klausul 12.2 & 12.3',
      roleTitle: 'Pengawasan Kepatuhan Dokumen & Fisik Lapangan',
      description: 'DPA bersama auditor memantau jalannya pengujian 74 butir klausul kapal di anjungan, kamar mesin, dan geladak, serta mencoret (strikethrough) klausul N/A secara resmi.',
      actions: [
        'Memantau progres pengisian 74 checklist oleh tim auditor di atas kapal secara real-time.',
        'Memverifikasi kesesuaian SOP keselamatan darat dengan implementasi nyata kru kapal.',
        'Mencoret klausul yang tidak berlaku (N/A) dengan justifikasi teknis resmi (cth: kapal non-tanker).'
      ],
      output: 'Lembar kerja 74 butir checklist SMC terisi lengkap dengan status Yes, No, atau N/A.'
    },
    {
      step: 3,
      title: 'Penetapan & Klasifikasi Temuan Kapal (Tahap 3: Temuan NC)',
      ismRef: 'ISM Code Klausul 9.1 & 12.4',
      roleTitle: 'Klasifikasi Derajat Ketidaksesuaian Maritim',
      description: 'Auditor bersama DPA mengklasifikasikan temuan lapangan kapal menjadi Major NC (ancaman kelaiklautan), Minor NC (deviasi prosedur), atau Observation, serta menetapkan batas waktu perbaikan (Due Date).',
      actions: [
        'Menilai tingkat risiko temuan terhadap kelaiklautan kapal (Seaworthiness) dan keselamatan awak kapal.',
        'Menetapkan batas waktu penyelesaian: Major NC (wajib sebelum berlayar), Minor NC (30–90 hari).',
        'Menerbitkan Formulir Lembar Ketidaksesuaian resmi (BKI Form F23.14.07).'
      ],
      output: 'Dokumen NCR Kapal Resmi terbit dan diserahkan ke Nakhoda untuk tindakan perbaikan fisik.'
    },
    {
      step: 4,
      title: 'Verifikasi Eviden Fisik & Otorisasi Penutupan NC (Tahap 4: Bukti & CAPA)',
      ismRef: 'ISM Code Klausul 9.2 & 12.5',
      roleTitle: 'Validasi Efektivitas Perbaikan Onboard (Close-Out)',
      description: 'DPA memeriksa bukti fisik perbaikan yang dikirimkan oleh Nakhoda dari kapal, mengevaluasi analisis akar masalah (RCA), dan mengesahkan penutupan temuan (Close NC).',
      actions: [
        'Memeriksa foto sebelum dan sesudah perbaikan fisik alat keselamatan/mesin kapal.',
        'Mengevaluasi apakah tindakan perbaikan (Corrective Action) dan pencegahan (Preventive Action) memadai.',
        'Mengesahkan status penutupan temuan (Close NC) dan menandatangani kolom verifikasi auditor di formulir NCR.'
      ],
      output: 'Status Temuan menjadi NC Close & Tanggal Verifikasi DPA tercatat resmi.'
    },
    {
      step: 5,
      title: 'Deklarasi Kelaiklautan & Penutupan Sesi SMC (Tahap 5: Penutupan & Cetak)',
      ismRef: 'ISM Code Klausul 12.6 & 13',
      roleTitle: 'Pengesahan Status Kelaiklautan (Fit-to-Sail)',
      description: 'DPA mengevaluasi hasil akhir audit, mendeklarasikan kelaikan kapal (Fit-to-Sail), mengunci sesi audit menjadi Selesai (Completed), dan menerbitkan berkas PDF 3 dokumen lengkap.',
      actions: [
        'Menerbitkan Deklarasi Kelaiklautan: Laik Layar (Full Compliance) atau Laik Bersyarat.',
        'Mengunci status sesi audit kapal menjadi Completed (Selesai).',
        'Mencetak dan menandatangani 3 dokumen resmi: Laporan Sesi Audit SMC, Formulir NCR Closeout, dan Checklist BKI Rev 05.'
      ],
      output: 'Audit Report resmi bertanda tangan DPA & rekomendasi penerbitan/pembaruan sertifikat SMC kapal.'
    }
  ];

  const smcNakhodaSteps = [
    {
      step: 1,
      title: 'Penerimaan Jadwal & Opening Meeting di Kapal (Tahap 1: Sesi & Tim)',
      ismRef: 'ISM Code Klausul 5.1 & 5.2',
      roleTitle: 'Tanggung Jawab Nakhoda (Master / Captain)',
      description: 'Nakhoda bertindak selaku pimpinan tertinggi di atas kapal dan Auditee Resmi Onboard, menyelenggarakan Opening Meeting bersama tim auditor, dan memastikan kesiapan perwira kapal.',
      actions: [
        'Memastikan perwira kapal (Chief Officer, KKM, Masinis) hadir pada Opening Meeting di kapal.',
        'Mengonfirmasi kesiapan fisik kapal dan dokumen keselamatan di anjungan & kamar mesin.',
        'Menandatangani lembar daftar hadir Opening Meeting di atas kapal.'
      ],
      output: 'Kesiapan kapal dan personil awak menyambut proses audit inspeksi maritim.'
    },
    {
      step: 2,
      title: 'Mendampingi Inspeksi Fisik 74 Klausul Onboard (Tahap 2: Checklist Klausul)',
      ismRef: 'ISM Code Klausul 5.1.2 & 5.1.5',
      roleTitle: 'Pendampingan Pemeriksaan Fisik & Operasional Kapal',
      description: 'Nakhoda bersama KKM mendampingi auditor saat inspeksi fisik menyeluruh (anjungan, kamar mesin, dek kerja, dapur), demonstrasi drill darurat awak kapal, dan pemeriksaan kartu pemeliharaan PMS.',
      actions: [
        'Menunjukkan dokumen SMS di anjungan (SOP Cuaca Buruk, Rencana Darurat, Logbook Navigasi).',
        'Mendampingi pengujian fisik alat keselamatan (Lifeboat, Lifejacket, EPIRB, Pemadam FFA).',
        'Mengarahkan KKM menunjukkan logbook perawatan mesin dan kartu pemeliharaan PMS kapal.'
      ],
      output: 'Akses penuh dan transparan bagi auditor dalam menguji kelaikan fisik dan operasional kapal.'
    },
    {
      step: 3,
      title: 'Meninjau & Mengakui Temuan Lapangan Kapal (Tahap 3: Temuan NC)',
      ismRef: 'ISM Code Klausul 9.1',
      roleTitle: 'Penerimaan Lembar Ketidaksesuaian (NCR Acknowledgment)',
      description: 'Nakhoda menerima daftar ketidaksesuaian yang ditemukan auditor di kapal, memahami klausul ISM yang terlanggar, dan menandatangani Berita Acara Temuan.',
      actions: [
        'Menerima formulir NCR dari auditor di atas kapal.',
        'Mendiskusikan batas waktu penyelesaian yang realistis sebelum kapal berlayar.',
        'Membubuhkan tanda tangan penerimaan temuan selaku Auditee / Master.'
      ],
      output: 'Formulir NCR bagian 1 bertanda tangan Nakhoda & kesepakatan batas waktu (Due Date).'
    },
    {
      step: 4,
      title: 'Eksekusi Perbaikan Fisik & Kirim Eviden ke DPA (Tahap 4: Bukti & CAPA)',
      ismRef: 'ISM Code Klausul 9.2',
      roleTitle: 'Tindakan Koreksi Fisik Onboard & Submit Eviden',
      description: 'Nakhoda memimpin perbaikan fisik langsung di kapal bersama awak, menganalisis akar masalah (RCA), melampirkan foto bukti pengerjaan, dan mengajukan validasi ke DPA.',
      actions: [
        'Melaksanakan perbaikan fisik langsung (Correction) di kapal bersama kru terkait.',
        'Menganalisis akar penyebab masalah (Root Cause Analysis - RCA).',
        'Menyusun langkah pencegahan terulang (Preventive Action).',
        'Mengambil foto bukti fisik / logbook baru dan mengunggahnya via tombol "Kirim Eviden".'
      ],
      output: 'Eviden perbaikan fisik lengkap terkirim ke DPA dengan status "Eviden Submitted".'
    },
    {
      step: 5,
      title: 'Closing Meeting & Pengarsipan di Anjungan (Tahap 5: Penutupan & Cetak)',
      ismRef: 'ISM Code Klausul 11 & 12.6',
      roleTitle: 'Penerimaan Hasil Akhir & Arsip Sertifikat Kapal',
      description: 'Nakhoda menghadiri Closing Meeting di anjungan, menandatangani lembar penutupan laporan audit, menerima status kelaiklautan (Fit-to-Sail), dan mengarsipkan dokumen di lemari kapal.',
      actions: [
        'Menghadiri Closing Meeting penutupan audit bersama auditor dan perwira kapal.',
        'Menandatangani lembar penerimaan laporan audit eksekutif SMC.',
        'Menyimpan salinan checklist BKI dan formulir NCR Closeout di lemari berkas SMS anjungan.',
        'Memastikan kapal mengantongi status Fit-to-Sail sebelum berlayar (Port Clearance).'
      ],
      output: 'Berkas audit resmi tersimpan di anjungan & kapal siap berlayar secara aman dan patuh hukum.'
    }
  ];

  const smcRaciMatrix = [
    {
      phase: 'Tahap 1: Sesi & Tim',
      task: 'Penetapan Jadwal & Tim Auditor SMC',
      dpa: 'Accountable (Pengambil Keputusan Utama)',
      auditee: 'Informed & Consulted (Menerima Jadwal)',
      regulation: 'ISM Code 4 & 12.1'
    },
    {
      phase: 'Tahap 1: Sesi & Tim',
      task: 'Opening Meeting di Atas Kapal',
      dpa: 'Consulted (Darat)',
      auditee: 'Responsible (Tuan Rumah & Auditee Onboard)',
      regulation: 'BKI SMC Guidance'
    },
    {
      phase: 'Tahap 2: Checklist Klausul',
      task: 'Pemeriksaan 74 Klausul Fisik SMC Kapal',
      dpa: 'Accountable (Pengawas Kepatuhan)',
      auditee: 'Responsible (Pendamping Lapangan Onboard)',
      regulation: 'ISM Code 12.2'
    },
    {
      phase: 'Tahap 3: Temuan NC',
      task: 'Penerbitan & Klasifikasi NCR Lapangan Kapal',
      dpa: 'Accountable (Penetapan Kategori & Due Date)',
      auditee: 'Informed (Tanda Tangan Pengakuan Lapangan)',
      regulation: 'ISM Code 9.1'
    },
    {
      phase: 'Tahap 4: Bukti & CAPA',
      task: 'Eksekusi Perbaikan Fisik & Foto Eviden',
      dpa: 'Consulted (Memberikan Arahan & Dukungan Suku Cadang)',
      auditee: 'Responsible (Eksekusi Fisik Langsung di Kapal)',
      regulation: 'ISM Code 9.2'
    },
    {
      phase: 'Tahap 4: Bukti & CAPA',
      task: 'Verifikasi & Penutupan NC Onboard (Closeout)',
      dpa: 'Responsible & Accountable (Otorisasi DPA)',
      auditee: 'Informed (Menerima Pengesahan Tutup)',
      regulation: 'ISM Code 12.5'
    },
    {
      phase: 'Tahap 5: Penutupan & Cetak',
      task: 'Deklarasi Fit to Sail & Finalisasi Sesi SMC',
      dpa: 'Responsible & Accountable (Tanda Tangan DPA)',
      auditee: 'Informed (Menerima Izin Layar)',
      regulation: 'ISM Code 12.6'
    },
    {
      phase: 'Tahap 5: Penutupan & Cetak',
      task: 'Pencetakan & Pengarsipan Berkas di Anjungan',
      dpa: 'Accountable (Penerbitan 3 PDF Resmi SMC)',
      auditee: 'Responsible (Simpan di Lemari SMS Anjungan)',
      regulation: 'ISM Code 11'
    }
  ];

  // =========================================================================
  // DATA PETUNJUK & ALUR AUDIT DOC (KANTOR PUSAT PT. PBK - 13 SEKSI BKI)
  // =========================================================================
  const docAuditorSteps = [
    {
      step: 1,
      title: 'Inisiasi & Jadwal Audit DOC Kantor Pusat (Tahap 1: Sesi & Tim)',
      ismRef: 'ISM Code Klausul 3 & 4',
      roleTitle: 'Tanggung Jawab Lead Auditor & DPA',
      description: 'DPA bersama Lead Auditor merencanakan audit kepatuhan tata kelola Sistem Manajemen Keselamatan (SMS) Kantor Pusat PT. PBK, menyusun matriks jadwal wawancara untuk seluruh departemen darat, dan menerbitkan surat tugas resmi.',
      actions: [
        'Menyusun Jadwal Audit Tahunan (Annual Audit Plan) untuk Kantor Pusat PT. Pelayaran Baharimas Kalimantan.',
        'Menetapkan Lead Auditor independen yang berkualifikasi dan tidak memiliki konflik kepentingan langsung.',
        'Menerbitkan surat tugas dan jadwal audit ke Direksi serta Kepala Departemen (HR/Crewing, Teknis, Logistik, HSSE).',
        'Memasang template resmi BKI F23.14.05 Rev 06 (13 Seksi Tata Kelola Darat).'
      ],
      output: 'Nomor Registrasi Sesi Audit DOC Resmi & Surat Pemberitahuan Audit Kantor Pusat.'
    },
    {
      step: 2,
      title: 'Pemeriksaan 13 Seksi Tata Kelola SMS Darat (Tahap 2: Checklist Klausul)',
      ismRef: 'BKI DOC F23.14.05 Rev 06',
      roleTitle: 'Evaluasi Kepatuhan Sistemik & Dokumen Kantor',
      description: 'Auditor menguji implementasi 13 seksi SMS kantor: kebijakan keselamatan manajemen, kualifikasi & rekrutmen kru, pemeliharaan armada dari darat, sistem pengadaan logistik, kesiapan tanggap darurat kantor (ERT), dan tinjauan manajemen.',
      actions: [
        'Memeriksa manual SMS, komitmen tertulis Direksi, dan kebijakan perlindungan lingkungan (Seksi 1 & 2).',
        'Memverifikasi berkas kualifikasi awak kapal, buku pelaut, sertifikat STCW, dan evaluasi performa kru (Seksi 6).',
        'Memeriksa dokumen inspeksi teknis armada kapal oleh Superintendent & pemenuhan suku cadang kritis (Seksi 10).',
        'Menguji kesiapsiagaan Tim Tanggap Darurat Kantor (Emergency Response Team / ERT) dan logbook drill darat (Seksi 8).'
      ],
      output: 'Lembar kerja 13 Seksi BKI DOC terisi lengkap dengan status Yes/No/NA dan catatan bukti dokumen kantor.'
    },
    {
      step: 3,
      title: 'Perumusan Temuan NC Prosedural & Administrasi (Tahap 3: Temuan NC)',
      ismRef: 'ISM Code Klausul 9.1 & 12.4',
      roleTitle: 'Klasifikasi Deviasi Tata Kelola Prosedural Darat',
      description: 'Auditor merumuskan ketidaksesuaian tata kelola darat (Major NC, Minor NC, atau Observation), menilai dampaknya terhadap keselamatan operasional armada di laut, dan menyepakati target penyelesaian (Due Date).',
      actions: [
        'Mengidentifikasi kesenjangan antara manual prosedur kantor dengan implementasi nyata pada berkas administrasi.',
        'Menetapkan derajat ketidaksesuaian: Major NC (kegagalan sistemik kritis), Minor NC (deviasi prosedur), atau Observasi.',
        'Menerbitkan Formulir NCR Resmi Audit DOC kepada Kepala Departemen terkait.'
      ],
      output: 'Dokumen NCR Prosedural Kantor terbit dan diserahkan ke Kepala Departemen terkait.'
    },
    {
      step: 4,
      title: 'Evaluasi Tindakan Koreksi & Validasi Penutupan NC Darat (Tahap 4: Bukti & CAPA)',
      ismRef: 'ISM Code Klausul 9.2 & 12.5',
      roleTitle: 'Validasi Efektivitas Perbaikan Prosedural (Closeout)',
      description: 'DPA dan Lead Auditor mengevaluasi rencana tindakan korektif (CAPA) dari Kepala Departemen darat, memastikan akar masalah (RCA) prosedural tertangani, dan memvalidasi revisi SOP atau rekaman kerja.',
      actions: [
        'Meninjau berkas analisis akar masalah (RCA) yang diajukan oleh Kepala Departemen darat.',
        'Memverifikasi dokumen eviden: revisi instruksi kerja kantor, pembaruan prosedur rekrutmen/logistik, atau bukti drill ERT darat.',
        'Mengesahkan status penutupan temuan (Close NC) dan menandatangani formulir penutupan NCR.'
      ],
      output: 'Lembar NCR bertanda tangan DPA dengan status Closed & Rekaman Bukti Dokumen Terverifikasi.'
    },
    {
      step: 5,
      title: 'Rapat Tinjauan Manajemen & Rekomendasi Sertifikat DOC (Tahap 5: Penutupan & Cetak)',
      ismRef: 'ISM Code Klausul 12.2 & 13.2',
      roleTitle: 'Pelaporan Puncak & Rekomendasi Sertifikasi DOC',
      description: 'Lead Auditor memaparkan hasil evaluasi SMS darat kepada Direktur Utama dan jajaran manajemen dalam Rapat Tinjauan Manajemen (Management Review), menerbitkan Laporan Resmi Audit DOC, dan merekomendasikan penerbitan/endorsement sertifikat DOC ke BKI / Ditjen Hubla.',
      actions: [
        'Memimpin sesi pemaparan hasil audit pada Rapat Tinjauan Manajemen (Management Review Meeting).',
        'Menandatangani Laporan Eksekutif Audit DOC Kantor Pusat.',
        'Menerbitkan rekomendasi resmi ke BKI / Ditjen Perhubungan Laut untuk penerbitan atau perpanjangan sertifikat DOC perusahaan.',
        'Mengarsipkan berkas audit resmi di Departemen QHSE / DPA.'
      ],
      output: 'Risalah Rapat Tinjauan Manajemen, Laporan Resmi Audit DOC bertanda tangan Direksi & Rekomendasi Sertifikat DOC.'
    }
  ];

  const docDepartmentSteps = [
    {
      step: 1,
      title: 'Kesiapan Departemen Darat & Opening Meeting (Tahap 1: Sesi & Tim)',
      ismRef: 'ISM Code Klausul 1.2 & 3',
      roleTitle: 'Tanggung Jawab Kepala Departemen Darat & Direksi',
      description: 'Para Kepala Departemen (HR/Crewing, Superintendent Teknis, Logistik & Pengadaan, HSSE) bersama Direksi menghadiri Opening Meeting, menyiapkan berkas kerja, dan menugaskan narahubung (PIC) audit.',
      actions: [
        'Menghadiri pertemuan pembukaan (Opening Meeting) bersama tim auditor di ruang rapat kantor pusat.',
        'Menyiapkan seluruh manual SOP, instruksi kerja, dan rekaman pelaksanaan tugas selama periode berjalan.',
        'Menunjuk staf pendamping auditor untuk memperlancar proses pemeriksaan dokumen departemen.'
      ],
      output: 'Kesiapan berkas dan personil departemen menyambut audit sistem manajemen kantor.'
    },
    {
      step: 2,
      title: 'Penyajian Bukti Kerja & Wawancara Audit SMS (Tahap 2: Checklist Klausul)',
      ismRef: 'ISM Code 13 Seksi BKI DOC Rev 06',
      roleTitle: 'Presentasi Rekaman Implementasi Tugas Darat',
      description: 'Kepala Departemen dan staf menyajikan berkas bukti objektif implementasi SMS kepada auditor serta memberikan klarifikasi faktual selama sesi wawancara.',
      actions: [
        'Departemen Crewing: Menyajikan berkas rekrutmen, medical check-up, matrix rotasi awak, dan bukti evaluasi kinerja kru kapal.',
        'Departemen Teknis: Menunjukkan laporan inspeksi berkala superintendent ke kapal, jadwal docking, dan monitoring pemeliharaan PMS kapal.',
        'Departemen Logistik: Menunjukkan bukti realisasi purchase order (PO) suku cadang kritis dan kuitansi penerimaan barang di kapal.',
        'Departemen HSSE: Menunjukkan rekaman komunikasi darurat darat, drill ERT, dan laporan tindak lanjut insiden kapal.'
      ],
      output: 'Pembuktian transparan atas berjalannya sistem manajemen keselamatan di seluruh lini kantor darat.'
    },
    {
      step: 3,
      title: 'Penerimaan & Klarifikasi Temuan NCR Prosedural (Tahap 3: Temuan NC)',
      ismRef: 'ISM Code Klausul 9.1',
      roleTitle: 'Konfirmasi Kesenjangan Prosedur & Batas Waktu',
      description: 'Kepala Departemen terkait menelaah temuan ketidaksesuaian yang diidentifikasi auditor, memberikan klarifikasi bila ada fakta tambahan, dan menandatangani lembar konfirmasi NCR.',
      actions: [
        'Membahas temuan bersama auditor dalam forum klarifikasi temuan kantor.',
        'Memahami butir seksi SMS yang dinilai menyimpang atau belum lengkap rekamannya.',
        'Menyepakati tenggat waktu perbaikan (Due Date) dan menandatangani lembar penerimaan NCR.'
      ],
      output: 'Lembar NCR Bagian 1 terkonfirmasi dan disepakati untuk proses perbaikan sistemik.'
    },
    {
      step: 4,
      title: 'Penyusunan CAPA, Revisi SOP & Pengunggahan Eviden (Tahap 4: Bukti & CAPA)',
      ismRef: 'ISM Code Klausul 9.2',
      roleTitle: 'Eksekusi Perbaikan Prosedural & Analisis Akar Masalah (RCA)',
      description: 'Kepala Departemen memimpin analisis akar masalah penyebab ketidaksesuaian sistemik, merevisi Standar Operasional Prosedur (SOP) bila diperlukan, melengkapi rekaman dokumen, dan mengunggah berkas CAPA.',
      actions: [
        'Melakukan Root Cause Analysis (RCA) menggunakan metode 5-Why atau Fishbone untuk menemukan akar masalah prosedural.',
        'Melakukan tindakan perbaikan langsung (Correction) dan revisi dokumen instruksi kerja (Preventive Action).',
        'Mengunggah dokumen eviden (SK Direksi, SOP revisi, formulir baru, bukti pengadaan) ke sistem audit via tombol "Kirim Eviden".'
      ],
      output: 'Berkas CAPA lengkap dengan dokumen perbaikan terkirim ke DPA untuk verifikasi penutupan.'
    },
    {
      step: 5,
      title: 'Partisipasi Rapat Tinjauan Manajemen & Komitmen Direksi (Tahap 5: Penutupan & Cetak)',
      ismRef: 'ISM Code Klausul 12.2 & Seksi 13',
      roleTitle: 'Evaluasi Efektivitas SMS & Alokasi Sumber Daya',
      description: 'Manajemen Darat dan Direksi menghadiri Closing Meeting & Management Review, menyetujui rekomendasi audit, dan memastikan alokasi anggaran serta personel mencukupi bagi keselamatan armada di laut.',
      actions: [
        'Menghadiri Closing Meeting dan Rapat Tinjauan Manajemen (Management Review) yang dipimpin oleh Direktur Utama.',
        'Menandatangani notulen rapat dan lembar persetujuan Laporan Audit DOC Resmi.',
        'Menindaklanjuti program perbaikan berkelanjutan (Continuous Improvement) sesuai arahan Direksi.'
      ],
      output: 'Komitmen manajemen puncak tercatat resmi dan sistem keselamatan darat perusahaan siap diuji oleh lembaga statutori (BKI / Ditjen Hubla).'
    }
  ];

  const docRaciMatrix = [
    {
      phase: 'Tahap 1: Sesi & Tim',
      task: 'Inisiasi Audit DOC & Rencana Audit Departemen',
      dpa: 'Accountable (Pengambil Keputusan Utama)',
      auditee: 'Consulted (Para Kepala Departemen Darat)',
      mgmt: 'Informed (Direksi Menerima Notifikasi)',
      regulation: 'ISM Code 3 & 4'
    },
    {
      phase: 'Tahap 1: Sesi & Tim',
      task: 'Opening Meeting di Kantor Pusat PT. PBK',
      dpa: 'Responsible (Lead Auditor / DPA)',
      auditee: 'Responsible (Kepala HR, Teknis, Logistik, HSSE)',
      mgmt: 'Consulted (Direksi Hadir)',
      regulation: 'BKI DOC F23.14.05'
    },
    {
      phase: 'Tahap 2: Checklist Klausul',
      task: 'Pemeriksaan 13 Seksi Tata Kelola SMS Darat',
      dpa: 'Accountable (Tim Auditor Internal / Eksternal)',
      auditee: 'Responsible (Menyajikan Berkas Dokumen & SOP)',
      mgmt: 'Consulted (Dukungan Manajemen)',
      regulation: 'ISM Code 1 s.d. 13'
    },
    {
      phase: 'Tahap 3: Temuan NC',
      task: 'Penerbitan & Klarifikasi NCR Prosedural Kantor',
      dpa: 'Accountable (Auditor Menetapkan Klasifikasi & Due Date)',
      auditee: 'Responsible (Kepala Divisi Tanda Tangan Konfirmasi)',
      mgmt: 'Informed (Tembusan ke Direktur)',
      regulation: 'ISM Code 9.1'
    },
    {
      phase: 'Tahap 4: Bukti & CAPA',
      task: 'Analisis Akar Masalah (RCA) & Revisi SOP Kantor',
      dpa: 'Consulted (DPA Membimbing Standar Mutu)',
      auditee: 'Responsible (Kepala Departemen Menyusun Dokumen)',
      mgmt: 'Informed (Mengetahui Perubahan Regulasi Internal)',
      regulation: 'ISM Code 9.2'
    },
    {
      phase: 'Tahap 4: Bukti & CAPA',
      task: 'Verifikasi & Otorisasi Penutupan NC Darat',
      dpa: 'Responsible & Accountable (Otorisasi DPA)',
      auditee: 'Informed (Menerima Pengesahan Tutup)',
      mgmt: 'Informed (Laporan Ringkas ke Direksi)',
      regulation: 'ISM Code 12.5'
    },
    {
      phase: 'Tahap 5: Penutupan & Cetak',
      task: 'Rapat Tinjauan Manajemen (Management Review)',
      dpa: 'Responsible (Auditor Memaparkan Evaluasi)',
      auditee: 'Responsible (Para Manager Memaparkan KPI)',
      mgmt: 'Accountable (Direktur Utama Mengesahkan Notulen)',
      regulation: 'ISM Code 12.2'
    },
    {
      phase: 'Tahap 5: Penutupan & Cetak',
      task: 'Penerbitan Laporan DOC & Rekomendasi ke BKI',
      dpa: 'Responsible & Accountable (Penerbitan Laporan Resmi)',
      auditee: 'Informed (Arsip Departemen)',
      mgmt: 'Accountable (Pengesahan Direksi untuk Pengajuan BKI)',
      regulation: 'ISM Code 13.2'
    }
  ];

  const isDoc = standard === 'DOC';

  return (
    <div className="modal-overlay" style={{ zIndex: 12500, padding: '1rem', overflowY: 'auto' }}>
      <div
        className="modal-dialog"
        style={{
          maxWidth: '1040px',
          width: '100%',
          margin: '1.5rem auto',
          background: 'var(--bg-surface)',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          overflow: 'hidden'
        }}
      >
        {/* ===================================================================== */}
        {/* HEADER MODAL DENGAN SWITCHER STANDAR SMC vs DOC                       */}
        {/* ===================================================================== */}
        <RoleFlowHeader
          isDoc={isDoc}
          onClose={onClose}
        />

        {/* ===================================================================== */}
        {/* SEGMENTED TOGGLE: PILIH STANDAR PETUNJUK (SMC vs DOC)                 */}
        {/* ===================================================================== */}
        <RoleFlowStandardToggle
          activeTab={activeTab}
          isDoc={isDoc}
          onClose={onClose}
          onSelectPerspective={onSelectPerspective}
          setStandard={setStandard}
          standard={standard}
        />

        {/* ===================================================================== */}
        {/* SUB-TABS: PERAN 1 vs PERAN 2 vs MATRIKS RACI                          */}
        {/* ===================================================================== */}
        <RoleFlowSubTabs
          activeTab={activeTab}
          isDoc={isDoc}
          setActiveTab={setActiveTab}
        />

        {/* ===================================================================== */}
        {/* MODAL SCROLLABLE BODY                                                 */}
        {/* ===================================================================== */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* ------------------------------------------------------------------- */}
          {/* TAB 1: ALUR AUDITOR / DPA                                           */}
          {/* ------------------------------------------------------------------- */}
          {(activeTab === 'auditor') && (
            <RoleFlowAuditorTab
              docAuditorSteps={docAuditorSteps}
              isDoc={isDoc}
              smcDpaSteps={smcDpaSteps}
            />
          )}

          {/* ------------------------------------------------------------------- */}
          {/* TAB 2: ALUR AUDITEE (NAKHODA KAPAL ATAU DIVISI DARAT)                */}
          {/* ------------------------------------------------------------------- */}
          {(activeTab === 'auditee') && (
            <RoleFlowAuditeeTab
              docDepartmentSteps={docDepartmentSteps}
              isDoc={isDoc}
              smcNakhodaSteps={smcNakhodaSteps}
            />
          )}

          {/* ------------------------------------------------------------------- */}
          {/* TAB 3: RACI MATRIX                                                  */}
          {/* ------------------------------------------------------------------- */}
          {(activeTab === 'matrix') && (
            <RoleFlowMatrixTab
              docRaciMatrix={docRaciMatrix}
              isDoc={isDoc}
              smcRaciMatrix={smcRaciMatrix}
            />
          )}
        </div>

        {/* ===================================================================== */}
        {/* MODAL FOOTER                                                          */}
        {/* ===================================================================== */}
        <RoleFlowFooter
          isDoc={isDoc}
          onClose={onClose}
        />
      </div>
    </div>
  );
};
