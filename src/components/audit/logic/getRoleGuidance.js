/**
 * getRoleGuidance.js
 * Diekstrak dari AuditManager.jsx (baris 209-279).
 * Sumber: Panduan tanggung jawab peran (DPA / auditee) per tahap audit, terpisah untuk standar SMC dan DOC
 *
 * Dependensi closure induk diangkat menjadi PARAMETER eksplisit:
 *   (tidak ada — fungsi murni)
 */
export const getRoleGuidance = (tab, role, standard = 'SMC') => {
    const isDoc = standard === 'DOC';

    if (isDoc) {
      // PANDUAN DEDIKASI AUDIT DOC (KANTOR PUSAT PERUSAHAAN PT. PBK)
      if (role === 'dpa') {
        switch (tab) {
          case 'sessions':
            return 'DPA & Lead Auditor merencanakan audit Sistem Manajemen Keselamatan (SMS) Kantor Pusat PT. PBK, menyusun Audit Plan tiap departemen darat (Direksi, HR/Crewing, Teknis, Logistik, HSSE), dan menetapkan jadwal Opening Meeting.';
          case 'checklist':
            return 'Auditor mengevaluasi pemenuhan 13 Seksi ISM Code Standar BKI F23.14.05 Rev 06 untuk Kantor Pusat: memverifikasi manual SMS darat, komitmen direksi, kualifikasi personel, kesiapsiagaan ERT darat, dan pengadaan logistik kapal.';
          case 'findings':
            return 'Auditor merumuskan temuan audit kantor (Major NC, Minor NC, atau Observation) terhadap kesenjangan prosedur darat dengan implementasi nyata pada berkas administrasi dan dukungan armada.';
          case 'capa':
            return 'DPA mengevaluasi usulan CAPA dari Kepala Departemen darat, memastikan akar masalah (RCA) prosedural tertangani, memverifikasi revisi SOP/rekaman darat, dan mengesahkan penutupan temuan (Close NC).';
          case 'reporting':
            return 'Lead Auditor & DPA menerbitkan Laporan Resmi Audit DOC Kantor Pusat, mempresentasikan evaluasi SMS pada Rapat Tinjauan Manajemen (Management Review), dan merekomendasikan penerbitan/pembaruan sertifikat DOC ke BKI / Ditjen Hubla.';
          default:
            return 'DPA memantau kepatuhan tata kelola SMS darat, pemenuhan audit internal departemen, dan sertifikasi DOC perusahaan.';
        }
      } else {
        switch (tab) {
          case 'sessions':
            return 'Kepala Departemen Darat & Manajemen menghadiri Opening Meeting, menyiapkan rekaman kerja (HR/Crewing, Logistik, Teknis, HSSE), dan menugaskan PIC pendamping auditor di kantor pusat.';
          case 'checklist':
            return 'Kepala Departemen Darat menyajikan bukti objektif implementasi SMS kantor: berkas rekrutmen/evaluasi kru, rekaman drill darat (ERT), approval purchase order kapal, dan laporan supervisi superintendent.';
          case 'findings':
            return 'Kepala Departemen Darat menerima dan membahas temuan ketidaksesuaian prosedur operasional kantor bersama auditor, mengklarifikasi fakta, dan menandatangani lembar konfirmasi temuan NCR.';
          case 'capa':
            return 'Kepala Departemen Darat menganalisis akar masalah (Root Cause Analysis), memperbarui instruksi kerja/SOP kantor, mengunggah bukti perbaikan rekaman darat, dan menyerahkan berkas CAPA kepada DPA.';
          case 'reporting':
            return 'Manajemen Darat & Direksi menghadiri Closing Meeting, menyetujui hasil evaluasi efektivitas SMS, menindaklanjuti rekomendasi pada Rapat Tinjauan Manajemen, serta mengarsipkan laporan audit DOC.';
          default:
            return 'Manajemen Darat memastikan seluruh departemen kantor pusat mematuhi regulasi ISM Code dan memberikan dukungan penuh bagi keselamatan kapal di laut.';
        }
      }
    } else {
      // PANDUAN DEDIKASI AUDIT SMC (KAPAL ARMADA ONBOARD)
      if (role === 'dpa') {
        switch (tab) {
          case 'sessions':
            return 'DPA merencanakan audit internal SMC kapal armada, menetapkan Lead Auditor independen, menentukan tanggal kedatangan di pelabuhan/galangan, dan mengirimkan notifikasi resmi ke Nakhoda.';
          case 'checklist':
            return 'DPA / Auditor memverifikasi pemenuhan 74 Butir Klausul SMC Kapal Standar BKI F23.14.06 Rev 05: uji fungsi fisik navigasi anjungan, mesin, LSA/FFA, drill darurat awak kapal, dan kesesuaian logbook dengan PMS.';
          case 'findings':
            return 'DPA / Auditor meninjau daftar temuan fisik maupun operasional kapal, menetapkan derajat ketidaksesuaian (Major/Minor/Obs), menentukan target batas waktu (Due Date), dan menerbitkan form NCR ke Nakhoda.';
          case 'capa':
            return 'DPA memeriksa bukti foto/video fisik perbaikan yang dikirimkan oleh Nakhoda dari kapal, mengevaluasi efektivitas tindakan perbaikan (CAPA), dan mengesahkan penutupan temuan (Close NC).';
          case 'reporting':
            return 'DPA menetapkan Deklarasi Kelaiklautan (Fit to Sail / SMC Full Compliance), mengunci sesi audit kapal menjadi Completed, dan menandatangani Laporan Eksekutif SMC.';
          default:
            return 'DPA memantau kepatuhan sertifikat statutory kapal dan ketersediaan suku cadang kritis armada.';
        }
      } else {
        switch (tab) {
          case 'sessions':
            return 'Nakhoda bertindak selaku Auditee Resmi Onboard, menyelenggarakan Opening Meeting di kapal, mengonfirmasi kesiapan kru kapal, dan menyiapkan dokumen SMS di anjungan.';
          case 'checklist':
            return 'Nakhoda mendampingi auditor saat inspeksi fisik geladak, kamar mesin, pengujian alat keselamatan (LSA/FFA), peragaan drill darurat, serta verifikasi logbook navigasi dan perawatan PMS.';
          case 'findings':
            return 'Nakhoda menerima daftar ketidaksesuaian yang ditemukan auditor di kapal, memahami butir klausul yang terlanggar, dan menandatangani Berita Acara Temuan Lapangan.';
          case 'capa':
            return 'Nakhoda memimpin perbaikan fisik onboard (Correction), menganalisis akar masalah (RCA), menyusun langkah pencegahan, melampirkan foto bukti pengerjaan, dan mengirimkan eviden ke DPA.';
          case 'reporting':
            return 'Nakhoda menghadiri Closing Meeting di anjungan, menandatangani lembar penerimaan laporan audit, mengonfirmasi status Fit to Sail, dan mengarsipkan dokumen di anjungan kapal.';
          default:
            return 'Nakhoda memastikan masa berlaku sertifikat kapal aktif dan permintaan logistik suku cadang telah diajukan ke kantor darat.';
        }
      }
    }
  };
