/**
 * BkiDocPageReporting.jsx
 * Diekstrak dari BkiDocChecklistReport.jsx.orig (baris 413-454).
 * Sumber: PAGE 5: pelaporan NC, kecelakaan, dan pemeliharaan
 */
import React from 'react';

export const BkiDocPageReporting = ({
  pageStyle,
  renderColumnHeaders,
  renderRow,
  renderRunningHeader,
  renderSectionHeader,
  renderSubsectionHeader,
  tableStyle,
}) => {
  return (
    <div id="doc-page-5" style={{ ...pageStyle, marginTop: '8px' }}>
            {renderRunningHeader()}
            <table style={tableStyle}>
              <thead>{renderColumnHeaders()}</thead>
              <tbody>
                {renderSectionHeader('(9) Pelaporan & Analisis NC / Kecelakaan / Reporting & Analysis of NC, Accidents & Hazardous Occurrences')}
                {renderSubsectionHeader('9.1 Pelaporan NC & Tindakan Perbaikan')}
                {renderRow('9.1', 'Apakah definisi ketidaksesuaian (NC/Deficiency) ditetapkan secara jelas dalam SMS?', '9.1')}
                {renderRow('9.2', 'Apakah kekurangan yang teridentifikasi pada pemeriksaan PSC dilaporkan kepada perusahaan?', '9.1')}
                {renderRow('9.3', 'Apakah NC dan OBS yang teridentifikasi pada audit eksternal dilaporkan kepada perusahaan?', '9.1')}
                {renderRow('9.4', 'Apakah awak kapal yang tidak kompeten dan klaim dari pihak luar dilaporkan kepada perusahaan?', '9.1')}
                {renderRow('9.5', 'Apakah tidak ada kekurangan rekaman PSC di perusahaan dibandingkan riwayat PSC yang diperoleh dari auditor?', '9.1')}
                {renderRow('9.6', 'Apakah laporan kepada perusahaan memuat usulan tindakan korektif?', '9.2')}
                {renderRow('9.7', 'Apakah laporan-laporan tersebut diinvestigasi dan dianalisis oleh perusahaan?', '9.2')}
                {renderRow('9.8', 'Apakah hal-hal tersebut beserta tindakan pencegahannya telah disampaikan kepada kapal lain yang terkait?', '9.2')}
                {renderSubsectionHeader('9.2 Pelaporan Kecelakaan & Insiden')}
                {renderRow('9.9', 'Apakah terdapat kecelakaan atau insiden? Apakah hal tersebut dilaporkan kepada perusahaan?', '9.1')}
                {renderRow('9.10', 'Apakah laporan-laporan tersebut diinvestigasi dan dianalisis oleh perusahaan?', '9.2')}
                {renderRow('9.11', 'Apakah hal-hal tersebut telah disampaikan kepada kapal lain yang terkait?', '9.2')}
                {renderSubsectionHeader('9.3 Pelaporan Kejadian Nyaris Celaka (Near Miss)')}
                {renderRow('9.12', 'Apakah kejadian nyaris celaka (near miss) dilaporkan kepada perusahaan?', '9.1')}
                {renderRow('9.13', 'Apakah laporan near miss diinvestigasi dan dianalisis oleh perusahaan?', '9.2')}
                {renderRow('9.14', 'Apakah hal-hal tersebut beserta tindakan pencegahannya telah disampaikan kepada kapal lain yang terkait?', '9.2')}
                {renderSectionHeader('(10) Pemeliharaan Kapal & Peralatan / Maintenance of the Ship & Equipment')}
                {renderSubsectionHeader('10.1 Sertifikat & Rekaman Survey')}
                {renderRow('10.1', 'Apakah masa berlaku sertifikat dan pengaturan survei dikelola dengan baik?', '10.1')}
                {renderSubsectionHeader('10.2 Perawatan Terencana (Planned Maintenance System)')}
                {renderRow('10.2', 'Apakah item dan interval perawatan terencana (PMS) telah disusun dengan benar?', '10.2.1')}
                {renderRow('10.3', 'Apakah revisi standar perawatan dan rencana pemeliharaan dilakukan secara teratur?', '10.2.1')}
                {renderRow('10.4', 'Apakah pemantauan kemajuan perawatan terencana dilaksanakan dengan baik?', '10.2.1')}
                {renderSubsectionHeader('10.3 Dukungan dari Darat')}
                {renderRow('10.5', 'Apakah penanggung jawab merespons laporan kerusakan dari kapal secara cepat?', '10.2.3')}
                {renderRow('10.6', 'Apakah kemungkinan penyebab dicantumkan dalam laporan kerusakan?', '10.2.2')}
                {renderRow('10.7', 'Apakah tindakan korektif yang tepat terhadap laporan kerusakan telah diambil?', '10.2.3')}
                {renderRow('10.8', 'Apakah informasi yang diperlukan seperti revisi konvensi dan pemberitahuan teknis dari pabrikan diberikan kepada kapal?', '6.1.3')}
                {renderSubsectionHeader('10.4 Peralatan & Sistem Kritis')}
                {renderRow('10.9', 'Apakah langkah-langkah khusus untuk meningkatkan keandalan peralatan dan sistem kritis tersedia?', '10.3')}
                {renderRow('10.10', 'Apakah pengujian berkala terhadap pengaturan siaga (standby) dan peralatan/sistem teknis yang tidak beroperasi terus-menerus tercakup dalam PMS?', '10.3')}
              </tbody>
            </table>
            <div style={{ textAlign: 'right', fontSize: '6pt', color: '#64748b', marginTop: '4px' }}>F23.14.05-2025 Rev 06 / Document Revision 00 &nbsp;&nbsp; 5/7</div>
          </div>
  );
};
