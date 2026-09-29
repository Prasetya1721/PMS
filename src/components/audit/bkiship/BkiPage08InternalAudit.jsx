/**
 * BkiPage08InternalAudit.jsx
 * Diekstrak dari BkiShipboardChecklistReport.jsx (baris 785-853).
 * Sumber: HALAMAN 8 DARI 10: 12. INTERNAL AUDIT & TANKER/GAS (DICORET JIKA TUGBOAT)
 */
import React from 'react';

export const BkiPage08InternalAudit = ({
  findItem,
  renderBkiPageFooter,
  renderBkiTableHeader,
  renderBkiTopBar,
  renderRow,
}) => {
  return (
    <div className="bki-print-page" style={{ marginBottom: '25px', paddingBottom: '10px' }}>
            {renderBkiTopBar()}
            {renderBkiTableHeader()}

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.8pt', border: '1px solid #000000', borderTop: 'none' }}>
              <tbody>
                {/* 12. Company Verification, Review & Evaluation */}
                <tr style={{ background: '#1e293b', color: '#ffffff' }}>
                  <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>12</td>
                  <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                    COMPANY VERIFICATION, REVIEW AND EVALUATION
                  </td>
                </tr>
                {renderRow('12.1', 'Are Internal Audits carried out as per Company\'s SMS?', '12.1')}
                {renderRow('12.2', 'Are procedure and criteria to extend internal audit within 3 months under exceptional circumstances established?', '12.1')}
                {renderRow('12.3', 'Is last internal audit carried out at interval not exceeding 12 months? Previous: 05 August 2025, Latest: 06 July 2026', '12.1', 'If No, go to 12.4')}
                {renderRow('12.4', 'When Internal audit was extended, have extension conducted in accordance with SMS?', '12.1')}
                {renderRow('12.5', 'Have internal audit and corrective actions carried out as per documented procedures?', '12.4')}
                {renderRow('12.6', 'Have Internal Audits been carried out by person(s) not onboard the ship?', '12.5')}
                {renderRow('12.7', 'Have internal audit records been kept onboard the ship?', '12.6')}
                {renderRow('12.8', 'Have Master and officers been aware of result of internal audit?', '12.6')}
                {renderRow('12.9', 'Have non-conformities been raised at the audit?', '12.7')}
                {renderRow('12.10', 'Have timely corrective actions for non-conformities been taken?', '12.7')}
                {renderRow('12.11', 'Has company notified ship of result of management review?', '12.6')}

                {/* KLAUSUL TAMBAHAN KHUSUS TIPE KAPAL (DICORET KARENA TUG BOAT) */}
                <tr style={{ background: '#e2e8f0', fontWeight: 900 }}>
                  <td colSpan={7} style={{ padding: '3px 6px', border: '1px solid #000000', color: '#1e293b' }}>
                    ADDITIONAL CHECK ITEM BY SHIP TYPES (BAGIAN KHUSUS TIPE KAPAL TERTENTU)
                  </td>
                </tr>

                {/* A. OIL TANKER */}
                {(() => {
                  const isStrikedA = ['A.1', 'A.2', 'A.3'].some(n => findItem(n)?.isStrikethrough);
                  return (
                    <tr style={{ background: '#f8fafc' }}>
                      <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>A</td>
                      <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900, textDecoration: isStrikedA ? 'line-through' : 'none' }}>
                        OIL TANKER {isStrikedA ? '(Dicoret — tidak berlaku untuk tipe kapal Tugboat / Other Cargo Ship)' : ''}
                      </td>
                    </tr>
                  );
                })()}
                {renderRow('A.1', 'Has instrument for measuring flammable gas concentration been properly calibrated?', 'SOLAS II-2/4-5.7')}
                {renderRow('A.2', 'Are records of discharging of slop, valve closing operations in Oil Record Book Part II?', 'MARPOL Annex I')}
                {renderRow('A.3', 'Are there records of COW operations in Oil Record Book Part II?', 'MARPOL Annex I')}

                {/* B. GAS CARRIER */}
                {(() => {
                  const isStrikedB = ['B.1', 'B.2', 'B.3', 'B.4', 'B.5', 'B.6', 'B.7'].some(n => findItem(n)?.isStrikethrough);
                  return (
                    <tr style={{ background: '#f8fafc' }}>
                      <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>B</td>
                      <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900, textDecoration: isStrikedB ? 'line-through' : 'none' }}>
                        GAS CARRIER {isStrikedB ? '(Dicoret — tidak berlaku untuk tipe kapal Tugboat / Other Cargo Ship)' : ''}
                      </td>
                    </tr>
                  );
                })()}
                {renderRow('B.1', 'Have portable and fixed gas concentration measurement instruments properly calibrated?', 'IGC Code 13.6.6')}
                {renderRow('B.2', 'Is crew in charge of cargo operation adequately trained for safe handling?', 'IGC Code 18.3')}
                {renderRow('B.3', 'Does crew understand Company procedure for entering cargo holds, tanks, enclosed spaces?', 'IGC Code 18.4')}
                {renderRow('B.4', 'Has ship been loaded with cargo gas listed in Annex of Gas Fitness Certificate?', 'IGC Code 18.2')}
              </tbody>
            </table>

            {renderBkiPageFooter(8)}
          </div>
  );
};
