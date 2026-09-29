/**
 * BkiPage09GasChemicalBulk.jsx
 * Diekstrak dari BkiShipboardChecklistReport.jsx (baris 858-920).
 * Sumber: HALAMAN 9 DARI 10: GAS CONT., CHEMICAL, BULK CARRIER
 */
import React from 'react';

export const BkiPage09GasChemicalBulk = ({
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
                {/* B. Gas Carrier lanjutan */}
                {renderRow('B.5', 'In event of change of cargo gas, tank cleaning carried out according to procedure?', 'IGC Code 18.2')}
                {renderRow('B.6', 'In event of simultaneous carriage of cargo gases, possibility of dangerous reaction investigated?', 'IGC Code 18.2')}
                {renderRow('B.7', 'Are MARPOL Annex II cargo handling operations recorded in Cargo Record Book?', 'MARPOL Annex II')}

                {/* C. CHEMICAL TANKER */}
                {(() => {
                  const isStrikedC = ['C.1', 'C.2', 'C.3', 'C.4'].some(n => findItem(n)?.isStrikethrough);
                  return (
                    <tr style={{ background: '#f8fafc' }}>
                      <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>C</td>
                      <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900, textDecoration: isStrikedC ? 'line-through' : 'none' }}>
                        CHEMICAL TANKER {isStrikedC ? '(Dicoret — tidak berlaku untuk tipe kapal Tugboat / Other Cargo Ship)' : ''}
                      </td>
                    </tr>
                  );
                })()}
                {renderRow('C.1', 'Is crew in charge of cargo operation adequately trained for safe handling including emergency?', 'IBC Code 16.3')}
                {renderRow('C.2', 'Does crew understand Company procedure for opening & entering into cargo tanks?', 'IBC Code 16.4')}
                {renderRow('C.3', 'Are MARPOL Annex II cargo handling operations recorded in Cargo Record Book?', 'MARPOL Annex II')}
                {renderRow('C.4', 'In event of carriage of mixed cargoes, total hazard assessed by specialist before loading?', 'IBC Code 16.2.2')}

                {/* D. BULK CARRIER */}
                {(() => {
                  const isStrikedD = ['D.1', 'D.2', 'D.3'].some(n => findItem(n)?.isStrikethrough);
                  return (
                    <tr style={{ background: '#f8fafc' }}>
                      <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>D</td>
                      <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900, textDecoration: isStrikedD ? 'line-through' : 'none' }}>
                        BULK CARRIER ( INCLUDING BULK CARRIER OTHER THAN CHAPTER IX OF SOLAS ) {isStrikedD ? '(Dicoret)' : ''}
                      </td>
                    </tr>
                  );
                })()}
                {renderRow('D.1', 'Did crew training and drills carried out according to evacuation procedure for cargo hold flooding?', 'SOLAS Reg. XII/9')}
                {renderRow('D.2', 'Are "Hatch Cover Maintenance Plans" in accordance with MSC 169 (79) incorporated into SMS?', 'SOLAS Reg. XII/7.2')}
                {renderRow('D.3', 'Is ship provided with procedures for handling cargo which may liquefy (eg: Nickel concentrate)?', '')}

                {/* E. Self-unloading Bulk Carriers */}
                {(() => {
                  const isStrikedE = ['E.1', 'E.2', 'E.3', 'E.4', 'E.5', 'E.6', 'E.7', 'E.8'].some(n => findItem(n)?.isStrikethrough);
                  return (
                    <tr style={{ background: '#f8fafc' }}>
                      <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>E</td>
                      <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900, textDecoration: isStrikedE ? 'line-through' : 'none' }}>
                        Self-unloading bulk carriers featuring internally installed conveyor systems - Fire Safety Risk Assessment (IMSBC Code 3.1.2) {isStrikedE ? '(Dicoret)' : ''}
                      </td>
                    </tr>
                  );
                })()}
                {renderRow('E.1', 'Have you procedures for fire safety risk assessment in SMS? (Identification of risk, safeguards)', '')}
                {renderRow('E.2', 'What is scope of fire safety risk assessment for vessel? (Cargo handling areas on self-unloading)', '')}
              </tbody>
            </table>

            {renderBkiPageFooter(9)}
          </div>
  );
};
