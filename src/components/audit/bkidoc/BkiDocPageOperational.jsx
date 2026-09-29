/**
 * BkiDocPageOperational.jsx
 * Diekstrak dari BkiDocChecklistReport.jsx.orig (baris 369-410).
 * Sumber: PAGE 4: prosedur operasional dan kesiapan darurat
 */
import React from 'react';

export const BkiDocPageOperational = ({
  pageStyle,
  renderColumnHeaders,
  renderRow,
  renderRunningHeader,
  renderSectionHeader,
  renderSubsectionHeader,
  tableStyle,
}) => {
  return (
    <div id="doc-page-4" style={{ ...pageStyle, marginTop: '8px' }}>
            {renderRunningHeader()}
            <table style={tableStyle}>
              <thead>{renderColumnHeaders()}</thead>
              <tbody>
                {renderSectionHeader('(7) Operasional Kapal & Item Khusus / Shipboard Operation, Ship Types & Flag States')}
                {renderSubsectionHeader('7.1 Rencana & Instruksi Operasional')}
                {renderRow('7.1', 'Apakah rencana dan instruksi (termasuk checklist yang sesuai) untuk operasi kunci keselamatan kapal dan pencegahan pencemaran telah ditetapkan dan dipelihara?', '7')}
                {renderRow('7.2', 'Apakah prosedur dan checklist untuk operasi kunci kapal dipelihara dengan baik?', '7')}
                {renderRow('7.3', 'Apakah tersedia prosedur penanganan muatan di luar yang tercantum dalam prosedur yang ada?', '7')}
                {renderSubsectionHeader('7.2 Dukungan Operasional Kapal')}
                {renderRow('7.4', 'Konfirmasi cara penyediaan Notice to Mariners (NtM) dan peta laut kepada kapal.', '6.1.3')}
                {renderRow('7.5', 'Surat-surat resmi apa yang telah diterbitkan perusahaan untuk memberikan informasi yang diperlukan kepada kapal?', '6.1.3')}
                {renderRow('7.6', 'Apakah Nakhoda pernah menggunakan wewenang mutlaknya (overriding authority) secara nyata?', '5.2')}
                {renderSubsectionHeader('7.3 Item Khusus Tipe Kapal')}
                {renderRow('7.7', 'Konfirmasi item khusus untuk setiap tipe kapal yang dikelola (Tanker Minyak, Kapal Barang, dll.).', '7')}
                {renderSubsectionHeader('7.4 Item Khusus Bendera Kapal (Flag States)')}
                {renderRow('7.8', 'Apakah peraturan dan sirkuler untuk setiap bendera kapal tersedia di kantor dan di setiap kapal?', '1.2.3.1')}
                {renderRow('7.9', 'Konfirmasi kepatuhan persyaratan bendera Indonesia: prosedur keamanan siber (SE 35 Tahun 2020).', '1.2.3.1')}
                {renderRow('7.10', 'Konfirmasi kepatuhan prosedur bendera Indonesia: protokol Covid-19/kesehatan awak (SE 14 Tahun 2020).', '1.2.3.1')}
                {renderSectionHeader('(8) Kesiapsiagaan Keadaan Darurat / Emergency Preparedness')}
                {renderSubsectionHeader('8.1 Identifikasi Keadaan Darurat')}
                {renderRow('8.1', 'Apakah perusahaan telah mengidentifikasi dan mendeskripsikan potensi situasi darurat di kapal serta menetapkan prosedur untuk merespons?', '8.2')}
                {renderRow('8.2', 'Apakah program latihan dan simulasi untuk mempersiapkan tindakan darurat telah ditetapkan?', '8.2')}
                {renderRow('8.3', 'Apakah organisasi perusahaan (darat) dapat merespons situasi darurat kapal sewaktu-waktu?', '8.3')}
                {renderSubsectionHeader('8.2 Prosedur Tanggap Darurat')}
                {renderRow('8.4', 'Prosedur tanggap darurat tersedia: Tabrakan (Collision)?', '8.2')}
                {renderRow('8.5', 'Prosedur tanggap darurat tersedia: Kebanjiran (Flooding)?', '8.2')}
                {renderRow('8.6', 'Prosedur tanggap darurat tersedia: Kandas (Grounding)?', '8.2')}
                {renderRow('8.7', 'Prosedur tanggap darurat tersedia: Kebakaran (Fire)?', '8.2')}
                {renderRow('8.8', 'Prosedur tanggap darurat tersedia: Pencemaran Minyak (SOPEP)?', '8.2')}
                {renderRow('8.9', 'Prosedur tanggap darurat tersedia: Pemadaman Total (Blackout)?', '8.2')}
                {renderRow('8.10', 'Prosedur tanggap darurat tersedia: Penundaan Darurat (Emergency Towing)?', '8.2')}
                {renderRow('8.11', 'Prosedur tanggap darurat tersedia: Penyelamatan Orang Jatuh ke Laut?', '8.2')}
                {renderSubsectionHeader('8.3 Latihan Darurat')}
                {renderRow('8.12', 'Apakah latihan darurat wajib SOLAS (kebakaran, sekoci/meninggalkan kapal) dijadwalkan sesuai ketentuan?', '8.2')}
                {renderRow('8.13', 'Apakah latihan kemudi darurat (steering gear) dijadwalkan sesuai SOLAS Bab V Reg. 26?', '8.2')}
                {renderRow('8.14', 'Apakah hasil evaluasi latihan darurat dikomunikasikan kepada manajemen puncak?', '8.2')}
              </tbody>
            </table>
            <div style={{ textAlign: 'right', fontSize: '6pt', color: '#64748b', marginTop: '4px' }}>F23.14.05-2025 Rev 06 / Document Revision 00 &nbsp;&nbsp; 4/7</div>
          </div>
  );
};
