/**
 * BkiDocPageHeader.jsx
 * Diekstrak dari BkiDocChecklistReport.jsx.orig (baris 158-280).
 * Sumber: PAGE 1: kop BKI, nomor laporan, jenis audit, dan data pra-audit
 */
import React from 'react';
import { BaharimasReportLogo } from '../AuditInstitutionHeader';

export const BkiDocPageHeader = ({
  auditDateStr,
  auditLocation,
  auditorName,
  companyAddress,
  companyName,
  dpaName,
  imoCompanyNo,
  infoTd,
  pageStyle,
  renderColumnHeaders,
  renderRow,
  renderSectionHeader,
  renderSubsectionHeader,
  reportNo,
  session,
  tableStyle,
}) => {
  return (
    <div id="doc-page-1" style={pageStyle}>
            {/* Header BKI */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px', marginBottom: '6px' }}>
                <div style={{ flex: '0 0 auto', marginRight: '12px' }}>
                  <BaharimasReportLogo />
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '9pt', letterSpacing: '0.5px', textTransform: 'uppercase', color: '#1e3a5f' }}>
                    CHECKLIST UNTUK SISTEM MANAJEMEN KESELAMATAN PERUSAHAAN
                  </div>
                  <div style={{ fontSize: '7.5pt', color: '#374151', marginTop: '2px' }}>
                    CHECKLIST FOR COMPANY SAFETY MANAGEMENT SYSTEM
                  </div>
                  <div style={{ fontSize: '6.5pt', color: '#374151', marginTop: '3px' }}>
                    Audit berdasarkan ketentuan INTERNATIONAL CONVENTION FOR THE SAFETY OF LIFE AT SEA, 1974<br />
                    Chapter IX dan ISM Code — Document of Compliance (DOC)
                  </div>
                </div>
                <div style={{ flex: '0 0 auto', textAlign: 'right', fontSize: '6.5pt', color: '#374151' }}>
                  <div><strong>F23.14.05-2025 Rev 06</strong></div>
                  <div>Document Revision 00</div>
                </div>
              </div>
              {(() => {
                const scopeLower = String(session?.scope || session?.auditNo || '').toLowerCase();
                const isAwal = scopeLower.includes('awal') || scopeLower.includes('initial');
                const isAntara = scopeLower.includes('antara') || scopeLower.includes('interim') || scopeLower.includes('intermediate');
                const isTambahan = scopeLower.includes('tambahan') || scopeLower.includes('additional');
                const isTahunan = !isAwal && !isAntara && !isTambahan;

                return (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.8pt' }}>
                    <tbody>
                      <tr>
                        <td style={{ ...infoTd, width: '20%' }}><strong>No. Laporan / Report Number</strong></td>
                        <td style={{ ...infoTd, width: '30%', fontWeight: 700 }}>{reportNo}</td>
                        <td style={{ ...infoTd, width: '20%' }}><strong>Jenis Audit / Type of Audit</strong></td>
                        <td style={{ ...infoTd, width: '30%', fontWeight: 700 }}>
                          <span>{isTahunan ? '\u2612' : '\u2610'} Tahunan</span> &nbsp;
                          <span>{isAwal ? '\u2612' : '\u2610'} Awal</span> &nbsp;
                          <span>{isAntara ? '\u2612' : '\u2610'} Antara</span> &nbsp;
                          <span>{isTambahan ? '\u2612' : '\u2610'} Tambahan</span>
                        </td>
                      </tr>
                      <tr>
                        <td style={infoTd}><strong>Nama Perusahaan / Company Name</strong></td>
                        <td style={{ ...infoTd, fontWeight: 700 }}>{companyName}</td>
                        <td style={infoTd}><strong>No. Sertifikat DOC</strong></td>
                        <td style={{ ...infoTd, fontWeight: 700, color: '#0369a1' }}>
                          {session?.docCertificateNo || 'DOC-IDN-PBK/2024-R1'}
                        </td>
                      </tr>
                      <tr>
                        <td style={infoTd}><strong>Alamat / Address</strong></td>
                        <td style={infoTd}>{companyAddress}</td>
                        <td style={infoTd}><strong>Divisi / Departemen</strong></td>
                        <td style={{ ...infoTd, fontWeight: 600 }}>
                          {session?.docDepartment || 'Divisi DPA, QHSE & Operasional Armada Darat'}
                        </td>
                      </tr>
                      <tr>
                        <td style={infoTd}><strong>No. IMO Perusahaan</strong></td>
                        <td style={infoTd}>{imoCompanyNo}</td>
                        <td style={infoTd}><strong>Tanggal Audit / Date of Audit</strong></td>
                        <td style={infoTd}>{auditDateStr}</td>
                      </tr>
                      <tr>
                        <td style={infoTd}><strong>Auditor</strong></td>
                        <td style={infoTd}>{auditorName}</td>
                        <td style={infoTd}><strong>Tempat Audit / Location</strong></td>
                        <td style={infoTd}>{auditLocation}</td>
                      </tr>
                      <tr>
                        <td style={infoTd}><strong>DPA / Perwakilan Perusahaan</strong></td>
                        <td colSpan={3} style={infoTd}>{dpaName}</td>
                      </tr>
                      <tr>
                        <td style={infoTd}><strong>Negara Bendera / Flag State</strong></td>
                        <td style={infoTd}>INDONESIA</td>
                        <td style={infoTd}><strong>Persyaratan Pemerintah</strong></td>
                        <td style={infoTd}>Yes</td>
                      </tr>
                    </tbody>
                  </table>
                );
              })()}
            </div>

            <table style={tableStyle}>
              <thead>{renderColumnHeaders()}</thead>
              <tbody>
                {renderSectionHeader('(1) Item yang Diperiksa Sebelum Audit / Items to be checked prior to audit')}
                {renderSubsectionHeader('0. Persiapan Pra-Audit')}
                {renderRow('0.1', 'Apakah terdapat perubahan kapal yang dikelola perusahaan?', '3.1')}
                {renderRow('0.2', 'Apakah terdapat perubahan nama atau alamat perusahaan?', '3.1')}
                {renderRow('0.3', 'Konfirmasi tipe kapal yang tercantum dalam lingkup DOC perusahaan.', '3.1')}
                {renderRow('0.4', 'Konfirmasi bendera kapal yang tercantum dalam lingkup DOC perusahaan.', '3.1')}
                {renderRow('0.5', 'Konfirmasi laporan kepada otoritas bendera (Flag State) untuk setiap kapal.', '3.1')}
                {renderSectionHeader('(2) Jumlah & Tipe Kapal Tanggung Jawab Perusahaan')}
                {renderSubsectionHeader('Jumlah & Tipe Kapal')}
                {renderRow('PRE-1', 'Daftar kapal yang menjadi tanggung jawab perusahaan beserta tipe dan jumlahnya.', '3.1')}
                {renderRow('PRE-2', 'Konfirmasi kapal yang dijadikan sampel audit (minimal 1 kapal per tipe).', '3.1')}
                {renderSubsectionHeader('Kebangsaan & Bahasa Awak')}
                {renderRow('PRE-3', 'Konfirmasi kebangsaan aktif awak kapal (Nakhoda, Perwira Dek, Perwira Mesin, Kelasi, Juru Minyak, Koki).', '6.6')}
                {renderRow('PRE-4', 'Konfirmasi bahasa kerja resmi yang digunakan di atas kapal dan dalam manual SMS.', '6.6')}
                {renderSectionHeader('(3) Wawancara dengan Manajemen Puncak / Interview with Top Management')}
                {renderSubsectionHeader('3. Tinjauan Manajemen Puncak')}
                {renderRow('3.1', 'Apakah terdapat manfaat yang dirasakan sejak perusahaan menerapkan SMS?', '12.3')}
                {renderRow('3.2', 'Bagaimana pendapat manajemen mengenai kegiatan SMS seluruh personil?', '12.3')}
                {renderRow('3.3', 'Apa saja hal yang baru-baru ini dilaporkan DPA kepada manajemen puncak terkait SMS?', '12.3')}
                {renderRow('3.4', 'Bagaimana pemikiran manajemen mengenai poin-poin utama Management Review?', '4')}
                {renderRow('3.5', 'Bagaimana pendapat manajemen mengenai kecelakaan laut beberapa tahun terakhir di industri?', '12.3')}
                {renderSectionHeader('(4) Designated Person Ashore (DPA)')}
                {renderSubsectionHeader('4. Tanggung Jawab & Wewenang DPA')}
                {renderRow('4.1', 'Apakah DPA memahami tanggung jawab dan wewenangnya sesuai ISM Code Bagian 4?', '4')}
                {renderRow('4.2', 'Apakah identitas dan kontak DPA diketahui oleh seluruh Nakhoda dan perwira armada?', '4')}
                {renderRow('4.3', 'Apakah DPA memiliki akses langsung kepada manajemen puncak perusahaan?', '4')}
                {renderRow('4.4', 'Apakah DPA secara aktif memantau aspek keselamatan dan pencegahan pencemaran di seluruh armada?', '4')}
              </tbody>
            </table>
            <div style={{ textAlign: 'right', fontSize: '6pt', color: '#64748b', marginTop: '4px' }}>F23.14.05-2025 Rev 06 / Document Revision 00 &nbsp;&nbsp; 1/7</div>
          </div>
  );
};
