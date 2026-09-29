/**
 * BkiDocPageOfficeTour.jsx
 * Diekstrak dari BkiDocChecklistReport.jsx.orig (baris 502-578).
 * Sumber: PAGE 7: office tour, ringkasan temuan NC, dan pengesahan
 */
import React from 'react';

export const BkiDocPageOfficeTour = ({
  auditDateStr,
  auditLocation,
  auditorName,
  dpaName,
  findings,
  pageStyle,
  renderColumnHeaders,
  renderRow,
  renderRunningHeader,
  renderSectionHeader,
  renderSubsectionHeader,
  session,
  tableStyle,
  thStyle,
}) => {
  return (
    <div id="doc-page-7" style={{ ...pageStyle, marginTop: '8px' }}>
            {renderRunningHeader()}
            <table style={tableStyle}>
              <thead>{renderColumnHeaders()}</thead>
              <tbody>
                {renderSectionHeader('(13) Kunjungan Keliling Kantor / Tour through the Office')}
                {renderSubsectionHeader('13. Tinjauan Fisik Kantor')}
                {renderRow('13.1', 'Apakah dokumen yang berlaku tersedia di semua lokasi yang relevan di kantor?', '11.2.1')}
                {renderRow('13.2', 'Apakah salinan seluruh sertifikat operasional kapal yang berlaku dipelihara dengan baik di kantor?', '10.1')}
                {renderRow('13.3', 'Apakah buku/publikasi hukum & statutori, sirkuler, dan gambar rencana yang dipersyaratkan dipelihara dengan baik?', '11.2.1')}
                {renderRow('13.4', 'Apakah rekaman pemeliharaan kapal (termasuk rekaman perbaikan dok) disimpan dengan baik di kantor?', '10.2.4')}
              </tbody>
            </table>

            {/* Ringkasan Temuan NC */}
            <div style={{ marginTop: '12px', border: '1px solid #000', padding: '8px 10px' }}>
              <div style={{ fontWeight: 700, fontSize: '8pt', marginBottom: '6px', color: '#1e3a5f' }}>
                REKAPITULASI TEMUAN / FINDINGS SUMMARY
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '7pt' }}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, width: '8%' }}>No.</th>
                    <th style={{ ...thStyle, width: '14%' }}>Klausul ISM</th>
                    <th style={{ ...thStyle, width: '40%' }}>Uraian Temuan (NC/OBS)</th>
                    <th style={{ ...thStyle, width: '20%' }}>Target Penyelesaian</th>
                    <th style={{ ...thStyle, width: '18%' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {findings.length > 0 ? findings.map((f, i) => (
                    <tr key={i}>
                      <td style={{ border: '1px solid #000', padding: '3px 4px', textAlign: 'center', fontSize: '7pt' }}>{i + 1}</td>
                      <td style={{ border: '1px solid #000', padding: '3px 4px', textAlign: 'center', fontSize: '7pt' }}>{f.clauseCode || '-'}</td>
                      <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '6.8pt' }}>{f.description || f.findingDetail || '-'}</td>
                      <td style={{ border: '1px solid #000', padding: '3px 4px', textAlign: 'center', fontSize: '7pt' }}>{f.targetCloseDate || '-'}</td>
                      <td style={{ border: '1px solid #000', padding: '3px 4px', textAlign: 'center', fontSize: '7pt', color: f.status === 'Closed' ? '#059669' : '#b91c1c' }}>{f.status || 'Open'}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '7pt', color: '#64748b', fontStyle: 'italic' }}>
                        Tidak ada temuan ketidaksesuaian (NC) pada sesi audit ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {session?.auditConclusion && (
              <div style={{ marginTop: '10px', border: '1px solid #000', padding: '8px 10px' }}>
                <div style={{ fontWeight: 700, fontSize: '7.5pt', marginBottom: '4px', color: '#1e3a5f' }}>KESIMPULAN & REKOMENDASI / AUDIT CONCLUSION</div>
                <div style={{ fontSize: '7pt', lineHeight: 1.5 }}>{session.auditConclusion}</div>
              </div>
            )}

            {/* Pengesahan */}
            <div style={{ marginTop: '14px', display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1, border: '1px solid #000', padding: '8px 10px', minHeight: '60px' }}>
                <div style={{ fontWeight: 700, fontSize: '7pt', marginBottom: '4px', color: '#1e3a5f' }}>Auditor BKI</div>
                <div style={{ fontSize: '6.5pt', color: '#374151', marginTop: '2px' }}>Nama: {auditorName}</div>
                <div style={{ marginTop: '24px', borderTop: '1px solid #000', paddingTop: '2px', fontSize: '6.5pt', color: '#64748b' }}>Tanda Tangan</div>
              </div>
              <div style={{ flex: 1, border: '1px solid #000', padding: '8px 10px', minHeight: '60px' }}>
                <div style={{ fontWeight: 700, fontSize: '7pt', marginBottom: '4px', color: '#1e3a5f' }}>Perwakilan Perusahaan (DPA)</div>
                <div style={{ fontSize: '6.5pt', color: '#374151', marginTop: '2px' }}>Nama: {dpaName}</div>
                <div style={{ marginTop: '24px', borderTop: '1px solid #000', paddingTop: '2px', fontSize: '6.5pt', color: '#64748b' }}>Tanda Tangan</div>
              </div>
              <div style={{ flex: 1, border: '1px solid #000', padding: '8px 10px', minHeight: '60px' }}>
                <div style={{ fontWeight: 700, fontSize: '7pt', marginBottom: '4px', color: '#1e3a5f' }}>Tanggal & Tempat</div>
                <div style={{ fontSize: '6.5pt', color: '#374151', marginTop: '2px' }}>{auditDateStr}</div>
                <div style={{ fontSize: '6.5pt', color: '#374151' }}>{auditLocation}</div>
              </div>
            </div>

            <div style={{ textAlign: 'right', fontSize: '6pt', color: '#64748b', marginTop: '8px' }}>F23.14.05-2025 Rev 06 / Document Revision 00 &nbsp;&nbsp; 7/7</div>
          </div>
  );
};
