/**
 * BkiDocPageDocumentation.jsx
 * Diekstrak dari BkiDocChecklistReport.jsx.orig (baris 457-499).
 * Sumber: PAGE 6: pengendalian dokumen dan pengawakan kapal
 */
import React from 'react';

export const BkiDocPageDocumentation = ({
  pageStyle,
  renderColumnHeaders,
  renderRow,
  renderRunningHeader,
  renderSectionHeader,
  renderSubsectionHeader,
  tableStyle,
}) => {
  return (
    <div id="doc-page-6" style={{ ...pageStyle, marginTop: '8px' }}>
            {renderRunningHeader()}
            <table style={tableStyle}>
              <thead>{renderColumnHeaders()}</thead>
              <tbody>
                {renderSectionHeader('(11) Dokumentasi SMS / Documentation')}
                {renderSubsectionHeader('11.1 Pengelolaan Dokumen Terkontrol')}
                {renderRow('11.1', 'Apakah revisi manual dan prosedur dilaksanakan sesuai prosedur yang berlaku?', '11.2.2')}
                {renderRow('11.2', 'Apakah distribusi dokumen yang direvisi dilaksanakan sesuai prosedur?', '11.2.1')}
                {renderRow('11.3', 'Apakah dokumen yang sudah tidak berlaku dihapus/ditarik sesuai prosedur?', '11.2.3')}
                {renderSubsectionHeader('11.2 Buku & Publikasi Hukum/Statutori')}
                {renderRow('11.4', 'Apakah daftar buku dan publikasi yang harus ada di kantor dan di atas kapal tersedia?', '11.2.1')}
                {renderRow('11.5', 'Apakah konfirmasi terhadap edisi terbaru buku hukum dilaksanakan sesuai prosedur?', '11.2.1')}
                {renderSubsectionHeader('11.3 Surat & Korespondensi Resmi')}
                {renderRow('11.6', 'Apakah surat-surat resmi dan korespondensi perusahaan dikendalikan dengan baik sesuai prosedur?', '11.2.1')}
                {renderRow('11.7', 'Apakah surat dan dokumen yang masuk dari pihak luar dikendalikan dengan baik sesuai prosedur?', '11.2.1')}
                {renderSubsectionHeader('11.4 Gambar Konstruksi Kapal')}
                {renderRow('11.8', 'Apakah gambar konstruksi terbaru (as-built drawings) setiap kapal tersedia di kantor?', '11.2.1')}
                {renderSectionHeader('(12) Pengawakan / Manning')}
                {renderSubsectionHeader('12.1 Sertifikat & Kesehatan Awak')}
                {renderRow('12.1', 'Apakah salinan Sertifikat Pengawakan Aman (Safe Manning Certificate) setiap kapal tersedia?', '6.2.2')}
                {renderRow('12.2', 'Apakah salinan Sertifikat Keahlian (COC) Nakhoda dan perwira tersedia?', '6.2.1')}
                {renderRow('12.3', 'Apakah salinan Sertifikat Kecakapan (COP) yang dipersyaratkan STCW untuk kelasi/juru tersedia?', '6.2.1')}
                {renderRow('12.4', 'Bagaimana cara penanggung jawab memeriksa keaslian sertifikat awak kapal?', '6.2.1')}
                {renderRow('12.5', 'Apakah data personil termasuk salinan sertifikat medis yang masih berlaku untuk seluruh awak bertugas tersedia?', '6.2.1')}
                {renderSubsectionHeader('12.2 Penugasan & Evaluasi Nakhoda')}
                {renderRow('12.6', 'Siapa yang bertanggung jawab atas penugasan Nakhoda dan bagaimana prosedurnya?', '6.1.1')}
                {renderRow('12.7', 'Siapa yang bertanggung jawab menilai familiarisasi Nakhoda terhadap SMS dan bagaimana prosedurnya?', '6.1.2')}
                {renderRow('12.8', 'Siapa yang bertanggung jawab menilai kemampuan dan kinerja Nakhoda serta bagaimana prosedurnya?', '6.1.1')}
                {renderSubsectionHeader('12.3 Penilaian & Pelatihan Awak Kapal')}
                {renderRow('12.9', 'Apakah pelatihan familiarisasi untuk awak kapal yang baru bergabung/pindah dilaksanakan dengan baik?', '6.4')}
                {renderRow('12.10', 'Apakah pelatihan penyegaran (refresh training) untuk awak kapal termasuk awak cadangan dilaksanakan dengan baik?', '6.5')}
                {renderRow('12.11', 'Bagaimana penanganannya jika ada awak yang tidak dapat membaca manual/prosedur?', '6.6')}
                {renderRow('12.12', 'Bagaimana penanganannya jika terdapat awak kapal multinasional di atas kapal?', '6.7')}
                {renderRow('12.13', 'Apakah prosedur untuk mencegah penggunaan kembali awak yang tidak kompeten telah ditetapkan?', '6.2.1')}
                {renderRow('12.14', 'Apakah terdapat prosedur untuk mengawaki kapal secara memadai guna mencakup seluruh aspek keselamatan operasional?', '6.2.2')}
                {renderSubsectionHeader('12.4 Evaluasi Agen Kepegawaian')}
                {renderRow('12.15', 'Materi pelatihan apa yang diberikan kepada agen kepegawaian untuk awak kapal?', '6.2.1')}
                {renderRow('12.16', 'Apakah evaluasi kinerja agen kepegawaian dilakukan secara berkala dan tepat?', '12.2')}
              </tbody>
            </table>
            <div style={{ textAlign: 'right', fontSize: '6pt', color: '#64748b', marginTop: '4px' }}>F23.14.05-2025 Rev 06 / Document Revision 00 &nbsp;&nbsp; 6/7</div>
          </div>
  );
};
