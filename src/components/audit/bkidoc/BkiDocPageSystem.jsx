/**
 * BkiDocPageSystem.jsx
 * Diekstrak dari BkiDocChecklistReport.jsx.orig (baris 283-311).
 * Sumber: PAGE 2: tinjauan sistem manajemen keselamatan
 */
import React from 'react';

export const BkiDocPageSystem = ({
  pageStyle,
  renderColumnHeaders,
  renderRow,
  renderRunningHeader,
  renderSectionHeader,
  renderSubsectionHeader,
  tableStyle,
}) => {
  return (
    <div id="doc-page-2" style={{ ...pageStyle, marginTop: '8px' }}>
            {renderRunningHeader()}
            <table style={tableStyle}>
              <thead>{renderColumnHeaders()}</thead>
              <tbody>
                {renderSectionHeader('(5) Tinjauan Sistem Keselamatan / Management/System Review')}
                {renderSubsectionHeader('5.1 Penilaian Risiko')}
                {renderRow('5.1', 'Apakah perusahaan memiliki prosedur untuk mengidentifikasi dan menilai potensi situasi berbahaya?', '1.2.2.2')}
                {renderRow('5.2', 'Apakah risiko-risiko yang teridentifikasi terhadap kapal, personil, dan lingkungan dinilai serta ditinjau dalam rapat?', '1.2.2.2')}
                {renderRow('5.3', 'Siapakah pihak yang bertanggung jawab atas pelaksanaan penilaian risiko?', '1.2.2.2')}
                {renderRow('5.4', 'Apakah terdapat safeguard baru yang ditetapkan berdasarkan hasil evaluasi penilaian risiko?', '1.2.2.2')}
                {renderSubsectionHeader('5.2 Prosedur Tinjauan Nakhoda')}
                {renderRow('5.5', 'Apakah SMS menetapkan prosedur bagi Nakhoda untuk meninjau SMS dan melaporkan kekurangannya ke manajemen darat?', '5.1.5')}
                {renderRow('5.6', 'Apakah SMS menetapkan prosedur pelaporan kecelakaan dan ketidaksesuaian (NC)?', '9.1')}
                {renderSubsectionHeader('5.3 Rapat Tinjauan Sistem (System Review Meetings)')}
                {renderRow('5.7', 'Apakah rapat tinjauan sistem diadakan oleh perusahaan minimal sekali dalam setahun?', '12.3')}
                {renderRow('5.8', 'Apakah kebutuhan revisi SMS dibahas dalam rapat tinjauan sistem?', '12.3')}
                {renderRow('5.9', 'Apakah hasil tinjauan sistem disampaikan kepada seluruh departemen dan kapal?', '12.6')}
                {renderRow('5.10', 'Apakah kinerja dan penilaian agen kepegawaian serta kebutuhan pelatihan awak kapal dibahas dalam rapat?', '12.2')}
                {renderRow('5.11', 'Apakah penahanan/kekurangan PSC dan NC/OBS pada audit internal/eksternal dibahas dalam rapat?', '12.3')}
                {renderRow('5.12', 'Apakah hasil tinjauan SMS oleh Nakhoda dan laporan kekurangan/kerusakan dibahas dalam rapat?', '12.3')}
                {renderRow('5.13', 'Apakah tindakan penanggulangan dan revisi SMS terhadap kecelakaan serta sakit/meninggalnya awak kapal dibahas dalam rapat?', '12.3')}
                {renderSubsectionHeader('5.4 Ketidaksesuaian (NC) Lalu')}
                {renderRow('5.14', 'Verifikasi investigasi & analisis atas NC yang teridentifikasi pada audit sebelumnya.', '12')}
                {renderRow('5.15', 'Verifikasi investigasi & analisis atas penahanan PSC dan kecelakaan laut sebelumnya.', '12')}
              </tbody>
            </table>
            <div style={{ textAlign: 'right', fontSize: '6pt', color: '#64748b', marginTop: '4px' }}>F23.14.05-2025 Rev 06 / Document Revision 00 &nbsp;&nbsp; 2/7</div>
          </div>
  );
};
