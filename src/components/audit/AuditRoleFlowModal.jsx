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
        <div
          style={{
            padding: '1rem 1.5rem',
            background: isDoc
              ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, var(--bg-surface) 100%)'
              : 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, var(--bg-surface) 100%)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: isDoc
                  ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
                  : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: isDoc
                  ? '0 4px 14px rgba(217, 119, 6, 0.35)'
                  : '0 4px 14px rgba(2, 132, 199, 0.35)'
              }}
            >
              {isDoc ? <Building2 size={22} /> : <Ship size={22} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  {isDoc
                    ? 'Petunjuk & Alur Kerja: Audit DOC (Kantor Pusat PT. PBK)'
                    : 'Petunjuk & Alur Kerja: Audit SMC (Kapal Armada Onboard)'}
                </h3>
                <span className={`badge ${isDoc ? 'badge-warning' : 'badge-primary'}`} style={{ fontSize: '0.7rem', fontWeight: 800 }}>
                  {isDoc ? '🏢 STANDAR BKI DOC REV 06 (13 SEKSI)' : '🚢 STANDAR BKI SMC REV 05 (74 KLAUSUL)'}
                </span>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                {isDoc
                  ? 'Panduan tata kelola SMS darat perusahaan, pembagian peran Auditor/DPA vs Departemen Darat & Direksi, serta Matriks RACI DOC.'
                  : 'Panduan pengujian fisik kelaiklautan kapal, alur kolaborasi DPA (Darat) vs Nakhoda (Kapal Onboard), serta Matriks RACI SMC.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.4rem', borderRadius: '8px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* SEGMENTED TOGGLE: PILIH STANDAR PETUNJUK (SMC vs DOC)                 */}
        {/* ===================================================================== */}
        <div
          style={{
            padding: '0.65rem 1.5rem',
            background: 'var(--bg-surface-elevated)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          {/* Segmented Standard Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
              PILIH STANDAR PETUNJUK:
            </span>
            <div style={{
              display: 'inline-flex',
              background: 'var(--bg-surface)',
              padding: '3px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              gap: '4px'
            }}>
              <button
                type="button"
                onClick={() => setStandard('SMC')}
                style={{
                  border: 'none',
                  background: standard === 'SMC' ? '#0284c7' : 'transparent',
                  color: standard === 'SMC' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  padding: '0.35rem 0.85rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <Ship size={14} />
                <span>Petunjuk Audit SMC (Kapal Armada)</span>
              </button>

              <button
                type="button"
                onClick={() => setStandard('DOC')}
                style={{
                  border: 'none',
                  background: standard === 'DOC' ? '#d97706' : 'transparent',
                  color: standard === 'DOC' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  padding: '0.35rem 0.85rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <Building2 size={14} />
                <span>Petunjuk Audit DOC (Kantor Darat PT. PBK)</span>
              </button>
            </div>
          </div>

          {/* Quick Perspective Apply Button */}
          {onSelectPerspective && (
            <button
              type="button"
              onClick={() => {
                onSelectPerspective(activeTab === 'auditee' ? 'nakhoda' : 'dpa');
                onClose();
              }}
              className="btn btn-primary btn-sm"
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: isDoc && activeTab !== 'auditee' ? '#d97706' : undefined,
                borderColor: isDoc && activeTab !== 'auditee' ? '#d97706' : undefined
              }}
            >
              <span>
                Aktifkan Sudut Pandang {activeTab === 'auditee'
                  ? (isDoc ? 'Divisi Darat (Auditee)' : 'Nakhoda (Kapal)')
                  : (isDoc ? 'Auditor & DPA' : 'DPA (Darat)')}
              </span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>

        {/* ===================================================================== */}
        {/* SUB-TABS: PERAN 1 vs PERAN 2 vs MATRIKS RACI                          */}
        {/* ===================================================================== */}
        <div
          style={{
            padding: '0.55rem 1.5rem',
            background: 'var(--bg-input)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: '0.4rem',
            flexWrap: 'wrap'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('auditor')}
            className={`tab-btn ${activeTab === 'auditor' ? 'active' : ''}`}
            style={{
              padding: '0.45rem 0.95rem',
              fontSize: '0.78rem',
              borderRadius: '8px',
              border: 'none',
              fontWeight: activeTab === 'auditor' ? 800 : 600,
              color: activeTab === 'auditor' ? '#ffffff' : 'var(--text-main)',
              background: activeTab === 'auditor' ? (isDoc ? '#d97706' : '#0284c7') : 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Building2 size={15} />
            <span>{isDoc ? '1. Alur Lead Auditor & DPA (DOC)' : '1. Alur DPA (Darat - SMC)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('auditee')}
            className={`tab-btn ${activeTab === 'auditee' ? 'active' : ''}`}
            style={{
              padding: '0.45rem 0.95rem',
              fontSize: '0.78rem',
              borderRadius: '8px',
              border: 'none',
              fontWeight: activeTab === 'auditee' ? 800 : 600,
              color: activeTab === 'auditee' ? '#ffffff' : 'var(--text-main)',
              background: activeTab === 'auditee' ? '#10b981' : 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            {isDoc ? <Users size={15} /> : <Ship size={15} />}
            <span>{isDoc ? '2. Alur Divisi Darat & Direksi (Auditee DOC)' : '2. Alur Nakhoda (Onboard Kapal - SMC)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`tab-btn ${activeTab === 'matrix' ? 'active' : ''}`}
            style={{
              padding: '0.45rem 0.95rem',
              fontSize: '0.78rem',
              borderRadius: '8px',
              border: 'none',
              fontWeight: activeTab === 'matrix' ? 800 : 600,
              color: activeTab === 'matrix' ? '#ffffff' : 'var(--text-main)',
              background: activeTab === 'matrix' ? '#6366f1' : 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <CheckSquare size={15} />
            <span>{isDoc ? '3. Matriks RACI DOC (Kantor Darat)' : '3. Matriks RACI SMC (Kapal & DPA)'}</span>
          </button>
        </div>

        {/* ===================================================================== */}
        {/* MODAL SCROLLABLE BODY                                                 */}
        {/* ===================================================================== */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* ------------------------------------------------------------------- */}
          {/* TAB 1: ALUR AUDITOR / DPA                                           */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === 'auditor' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  padding: '0.85rem 1.15rem',
                  borderRadius: '10px',
                  background: isDoc ? 'rgba(245, 158, 11, 0.08)' : 'rgba(2, 132, 199, 0.08)',
                  border: isDoc ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(2, 132, 199, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem'
                }}
              >
                <div style={{ padding: '0.5rem', borderRadius: '8px', background: isDoc ? '#d97706' : '#0284c7', color: '#fff' }}>
                  <Building2 size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: isDoc ? '#d97706' : '#0284c7', margin: 0 }}>
                    {isDoc
                      ? 'Mandat Lead Auditor & DPA sesuai ISM Code Klausul 3 & 4 (Standar DOC Kantor):'
                      : 'Mandat DPA sesuai ISM Code Klausul 4 (Standar SMC Kapal):'}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', margin: '0.2rem 0 0 0', lineHeight: 1.45 }}>
                    {isDoc
                      ? 'DPA menghubungkan jajaran Direksi dengan armada dan seluruh departemen darat. Bertanggung jawab mengevaluasi efektivitas 13 Seksi SMS kantor pusat, memastikan kualifikasi staf & awak kapal memadai, memverifikasi kesiapan tanggap darurat (ERT) darat, dan merekomendasikan perpanjangan sertifikat DOC ke BKI.'
                      : 'DPA menghubungkan manajemen puncak darat dengan kapal, bertanggung jawab memantau operasional keselamatan, memastikan alokasi suku cadang kritis memadai, mengevaluasi laporan nakhoda, memverifikasi bukti perbaikan fisik onboard, dan mendeklarasikan status kelaiklautan kapal (Fit to Sail).'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {(isDoc ? docAuditorSteps : smcDpaSteps).map(step => (
                  <div
                    key={step.step}
                    className="glass-card"
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: isDoc ? '#d97706' : '#0284c7',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 900
                          }}
                        >
                          {step.step}
                        </span>
                        <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>{step.title}</strong>
                      </div>
                      <span className={`badge ${isDoc ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                        {step.ismRef}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0', lineHeight: 1.45 }}>
                      {step.description}
                    </p>

                    <div style={{ background: 'var(--bg-surface-elevated)', borderRadius: '8px', padding: '0.65rem 0.85rem', marginTop: '0.35rem' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        Daftar Aksi Sistem:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.76rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                        {step.actions.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: isDoc ? '#d97706' : '#0284c7', fontWeight: 700, marginTop: '0.2rem' }}>
                      <CheckCircle2 size={13} />
                      <span>Hasil / Output Dokumen: {step.output}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* TAB 2: ALUR AUDITEE (NAKHODA KAPAL ATAU DIVISI DARAT)                */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === 'auditee' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  padding: '0.85rem 1.15rem',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem'
                }}
              >
                <div style={{ padding: '0.5rem', borderRadius: '8px', background: '#10b981', color: '#fff' }}>
                  {isDoc ? <Users size={20} /> : <Ship size={20} />}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#10b981', margin: 0 }}>
                    {isDoc
                      ? 'Peran Kepala Departemen Darat & Direksi (Standar DOC Kantor):'
                      : 'Mandat Nakhoda sesuai ISM Code Klausul 5 (Standar SMC Kapal):'}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', margin: '0.2rem 0 0 0', lineHeight: 1.45 }}>
                    {isDoc
                      ? 'Kepala Departemen darat (Crewing, Superintendent Teknis, Logistik & Pengadaan, HSSE) bertindak sebagai Auditee Utama di kantor pusat. Bertanggung jawab membuktikan kepatuhan SOP divisi, menyediakan bukti kualifikasi kru, pengadaan suku cadang kritis, menyusun tindakan koreksi (CAPA), dan menghadiri Rapat Tinjauan Manajemen.'
                      : 'Nakhoda memegang kewenangan mutlak (overriding authority) di atas kapal untuk keselamatan jiwa dan perlindungan lingkungan laut. Selaku Auditee Utama di kapal, Nakhoda mendampingi uji fisik 74 klausul, memimpin perbaikan langsung di kapal, dan mengunggah foto eviden ke DPA.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {(isDoc ? docDepartmentSteps : smcNakhodaSteps).map(step => (
                  <div
                    key={step.step}
                    className="glass-card"
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: '#10b981',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 900
                          }}
                        >
                          {step.step}
                        </span>
                        <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>{step.title}</strong>
                      </div>
                      <span className="badge badge-success" style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                        {step.ismRef}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0', lineHeight: 1.45 }}>
                      {step.description}
                    </p>

                    <div style={{ background: 'var(--bg-surface-elevated)', borderRadius: '8px', padding: '0.65rem 0.85rem', marginTop: '0.35rem' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        Daftar Aksi Auditee:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.76rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                        {step.actions.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#10b981', fontWeight: 700, marginTop: '0.2rem' }}>
                      <CheckCircle2 size={13} />
                      <span>Hasil / Output Dokumen: {step.output}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* TAB 3: RACI MATRIX                                                  */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === 'matrix' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Matriks RACI menggambarkan pembagian wewenang dan tanggung jawab dalam pelaksanaan{' '}
                <strong>{isDoc ? 'Audit DOC Kantor Pusat PT. PBK' : 'Audit SMC Kapal Armada'}</strong>:
                <br />
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                  R = Responsible (Pelaksana) | A = Accountable (Pengambil Keputusan Utama) | C = Consulted (Penasihat/Diskusi) | I = Informed (Penerima Laporan)
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }} className="table-hover">
                  <thead>
                    <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '2px solid var(--border-subtle)' }}>
                      <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 800 }}>Tahap Siklus</th>
                      <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 800 }}>Aktivitas Kunci</th>
                      <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 800, color: isDoc ? '#d97706' : '#0284c7' }}>
                        {isDoc ? '🏢 Auditor & DPA' : '🏢 DPA (Kantor Darat)'}
                      </th>
                      <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 800, color: '#10b981' }}>
                        {isDoc ? '👥 Divisi Darat (HR/Teknis/Logistik)' : '🚢 Nakhoda (Kapal Onboard)'}
                      </th>
                      {isDoc && (
                        <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 800, color: '#8b5cf6' }}>
                          🏛️ Direksi Perusahaan
                        </th>
                      )}
                      <th style={{ padding: '0.65rem 0.85rem', textAlign: 'center', fontWeight: 800 }}>Regulasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(isDoc ? docRaciMatrix : smcRaciMatrix).map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                        <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>{row.phase}</td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>{row.task}</td>
                        <td style={{ padding: '0.65rem 0.85rem', color: isDoc ? '#b45309' : '#0369a1', fontWeight: 600 }}>{row.dpa}</td>
                        <td style={{ padding: '0.65rem 0.85rem', color: '#047857', fontWeight: 600 }}>{row.auditee}</td>
                        {isDoc && (
                          <td style={{ padding: '0.65rem 0.85rem', color: '#6d28d9', fontWeight: 600 }}>{row.mgmt}</td>
                        )}
                        <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center' }}>
                          <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>{row.regulation}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* MODAL FOOTER                                                          */}
        {/* ===================================================================== */}
        <div
          style={{
            padding: '0.85rem 1.5rem',
            background: 'var(--bg-surface-elevated)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Standar Acuan:{' '}
            <strong>
              {isDoc
                ? 'BKI F23.14.05-2025 Rev 06 & IMO ISM Code Resolution A.741(18) (13 Seksi DOC Kantor)'
                : 'BKI F23.14.06-2024 Rev 05 & IMO ISM Code Resolution A.741(18) (74 Klausul SMC Shipboard)'}
            </strong>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ fontWeight: 700 }}
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
