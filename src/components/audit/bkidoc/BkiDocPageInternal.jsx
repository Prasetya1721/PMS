/**
 * BkiDocPageInternal.jsx
 * Diekstrak dari BkiDocChecklistReport.jsx.orig (baris 314-366).
 * Sumber: PAGE 3: audit internal dan tinjauan manajemen
 */
import React from 'react';

export const BkiDocPageInternal = ({
  pageStyle,
  renderColumnHeaders,
  renderRow,
  renderRunningHeader,
  renderSectionHeader,
  renderSubsectionHeader,
  tableStyle,
}) => {
  return (
    <div id="doc-page-3" style={{ ...pageStyle, marginTop: '8px' }}>
            {renderRunningHeader()}
            <table style={tableStyle}>
              <thead>{renderColumnHeaders()}</thead>
              <tbody>
                {renderSectionHeader('(6) Audit Internal / Internal Audit')}
                {renderSubsectionHeader('6.1 Pelaksanaan Audit Internal')}
                {renderRow('6.1', 'Apakah perusahaan melaksanakan audit keselamatan internal untuk memverifikasi kepatuhan kegiatan keselamatan dan pencegahan pencemaran terhadap SMS?', '12.1')}
                {renderRow('6.2', 'Apakah audit internal untuk seluruh departemen dan kapal direncanakan dalam interval tidak lebih dari 12 bulan?', '12.1')}
                {renderRow('6.3', 'Apakah tersedia prosedur dan kriteria perpanjangan audit internal dalam 3 bulan pada keadaan luar biasa?', '12.4')}
                {renderRow('6.4', 'Apakah seluruh audit internal telah dilaksanakan dalam 12 bulan sejak tanggal audit sebelumnya?', '12.1')}
                {renderRow('6.5', 'Apakah perpanjangan audit internal dilaksanakan sesuai manual/prosedur SMS?', '12.4')}
                {renderSubsectionHeader('6.2 Tindak Lanjut Audit Internal')}
                {renderRow('6.6', 'Apakah audit internal dilaksanakan sesuai manual/prosedur SMS?', '12.4')}
                {renderRow('6.7', 'Apakah permintaan tindakan korektif dan koreksi untuk NC, serta verifikasi efektivitasnya dilaksanakan secara berurutan?', '12.6')}
                {renderRow('6.8', 'Apakah hasil audit internal dilaporkan kepada manajemen puncak sesuai prosedur?', '12.1')}
                {renderRow('6.9', 'Apakah hasil audit internal disampaikan kepada seluruh departemen dan kapal?', '12.1')}
                {renderSubsectionHeader('6.3 Isi Checklist Audit Internal - Kantor')}
                {renderRow('6.10', 'Status rekaman yang disiapkan oleh kantor dan rekaman dari kapal.', '12.1')}
                {renderRow('6.11', 'Status pengelolaan dokumen terkontrol dan publikasi (termasuk penghapusan dokumen lama).', '12.1')}
                {renderRow('6.12', 'Tanggapan terhadap permintaan dari Nakhoda kapal.', '12.1')}
                {renderRow('6.13', 'Tanggapan terhadap laporan kerusakan dari Nakhoda kapal.', '12.1')}
                {renderRow('6.14', 'Kinerja agen kepegawaian dan pengendalian sertifikat awak kapal.', '12.1')}
                {renderRow('6.15', 'Pelatihan pra-naik kapal (pre-joining training), instruksi penting, dan kebutuhan pelatihan.', '12.1')}
                {renderRow('6.16', 'Latihan gabungan keadaan darurat dan evaluasinya.', '12.1')}
                {renderSubsectionHeader('6.4 Isi Checklist Audit Internal - Kapal')}
                {renderRow('6.17', 'Pengisian Buku Harian Resmi Deck (Official/Deck Log Book).', '12.1')}
                {renderRow('6.18', 'Latihan darurat (kebakaran, sekoci, dll.) sesuai SOLAS Bab III Reg. 19.', '12.1')}
                {renderRow('6.19', 'Motivasi awak kapal terhadap SMS Perusahaan oleh Nakhoda.', '12.1')}
                {renderRow('6.20', 'Plakat yang terpasang (Standing Order Nakhoda, jadwal jaga, Muster List, pengendalian sampah, larangan merokok).', '12.1')}
                {renderRow('6.21', 'Verifikasi Nakhoda atas rencana pelayaran (voyage & passage plan) dan koreksi peta laut.', '12.1')}
                {renderRow('6.22', 'Konfirmasi prosedur penanganan ECDIS dalam SMS mengenai cara memperbarui ENC.', '12.1')}
                {renderRow('6.23', 'Tinjauan Nakhoda terhadap SMS dan pelaporan kekurangannya kepada manajemen darat.', '12.1')}
                {renderRow('6.24', 'Pelatihan familiarisasi dan instruksi penting untuk awak kapal yang baru bergabung.', '12.1')}
                {renderRow('6.25', 'Kebutuhan pelatihan pengoperasian dan perawatan lambung, permesinan, dan peralatan.', '12.1')}
                {renderRow('6.26', 'Kesadaran awak kapal terhadap SMS (bahasa, pendidikan, dan komunikasi).', '12.1')}
                {renderRow('6.27', 'Kinerja awak kapal: komunikasi, perilaku, dan aktivitas di atas kapal.', '12.1')}
                {renderRow('6.28', 'Buku Harian Deck & Mesin sesuai manual/prosedur SMS.', '12.1')}
                {renderRow('6.29', 'Buku Catatan Sampah (Garbage Record Book).', '12.1')}
                {renderRow('6.30', 'Latihan, pelatihan, dan instruksi di atas kapal sesuai jadwal tahunan.', '12.1')}
                {renderRow('6.31', 'Peluncuran sekoci/rescue boat; penahanan/kekurangan PSC dan NC/OBS pada audit eksternal.', '12.1')}
                {renderRow('6.32', 'Pemantauan kemajuan dan pelaporan pemeliharaan terencana (PMS).', '12.1')}
                {renderRow('6.33', 'Koreksi dan tindakan pencegahan terhadap laporan kerusakan.', '12.1')}
                {renderRow('6.34', 'Pengelolaan dokumen terkontrol dan buku/publikasi hukum.', '12.1')}
                {renderRow('6.35', 'Pengelolaan surat masuk/keluar dan rekaman terkontrol.', '12.1')}
                {renderSubsectionHeader('6.5 Verifikasi Periodik')}
                {renderRow('6.36', 'Apakah terdapat prosedur untuk memverifikasi secara berkala apakah semua pihak yang mengemban tugas ISM bertindak sesuai tanggung jawab Perusahaan?', '12.2')}
                {renderRow('6.37', 'Apakah verifikasi periodik direncanakan minimal sekali dalam setahun?', '12.2')}
                {renderRow('6.38', 'Apakah verifikasi periodik dilaksanakan sesuai manual/prosedur SMS?', '12.2')}
              </tbody>
            </table>
            <div style={{ textAlign: 'right', fontSize: '6pt', color: '#64748b', marginTop: '4px' }}>F23.14.05-2025 Rev 06 / Document Revision 00 &nbsp;&nbsp; 3/7</div>
          </div>
  );
};
