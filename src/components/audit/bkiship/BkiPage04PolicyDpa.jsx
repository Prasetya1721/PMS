/**
 * BkiPage04PolicyDpa.jsx
 * Diekstrak dari BkiShipboardChecklistReport.jsx (baris 548-610).
 * Sumber: HALAMAN 4 DARI 10: 1.5.18 s/d 5.2 (POLICY, COMPANY, DPA, MASTER)
 */
import React from 'react';

export const BkiPage04PolicyDpa = ({
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
                {renderRow('1.5.18', 'Are necessary entries made to Garbage Record Book?', '7', 'MARPOL V, MEPC.201(62)')}
                {renderRow('1.5.19', 'Is adequate information on safety and pollution prevention given to master by the company?', '6.1.3')}
                {renderRow('1.5.20', 'Have the revisions of mandatory rules, such as IMO conventions, been taken into SMS?', '1.2.3.1', 'eg. Cyber security, MARPOL VI CII/EEXI')}
                {renderRow('1.5.21', 'Does the ship comply with the flag state requirements? (Cyber security SE 35/2020: SMK 7.28.3, Covid-19 SE 14/2020: SMK 7.27.3)', '1.2.3.1')}
                {renderRow('1.6', 'All identified risks to its ships, personnel and the environment has been assessed and appropriate safeguards provided?', '1.2.2.2')}
                {renderRow('1.7', 'Good overall impression of housekeeping and the condition of the ship and equipment?', '')}
                {renderRow('1.8', 'Are there any weather conditions preventing safe access to certain areas?', '')}

                {/* 2. Safety and Environmental Protection Policy */}
                <tr style={{ background: '#1e293b', color: '#ffffff' }}>
                  <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>2</td>
                  <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                    SAFETY AND ENVIRONMENTAL PROTECTION POLICY
                  </td>
                </tr>
                {renderRow('2.1', 'Is safety and environmental protection policy available?', '')}
                {renderRow('2.2', 'Is policy known by shipboard personnel?', '')}
                {renderRow('2.3', 'Is policy implemented and maintained at all levels on board?', '')}

                {/* 3. Company Responsibilities & Authorities */}
                <tr style={{ background: '#1e293b', color: '#ffffff' }}>
                  <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>3</td>
                  <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                    COMPANY RESPONSIBILITIES &amp; AUTHORITIES
                  </td>
                </tr>
                {renderRow('3.1.1', 'Is the Company indicated on DOC identical with the owner or the entity reported according to the ISM Code 3.1?', '3.1 or 13.1')}
                {renderRow('3.1.2', 'Personnel concerned with the SMS has clearly worded, unambiguous definitions of their responsibilities and authority?', '')}
                {renderRow('3.2', 'Level of competence for the tasks involved is defined?', '')}
                {renderRow('3.3', 'Officers do ensure that personnel are adequately qualified and experienced to undertake their duties?', '')}
                {renderRow('3.4', 'Adequate resources is provided to the ship from shore (eg: spare parts, provision, etc)?', '')}

                {/* 4. Designated Person(s) Ashore */}
                <tr style={{ background: '#1e293b', color: '#ffffff' }}>
                  <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>4</td>
                  <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                    DESIGNATED PERSON(S) ASHORE
                  </td>
                </tr>
                {renderRow('4.1', 'Are the monitoring activities by DPA on the safety and pollution aspect found sufficient?', '4')}
                {renderRow('4.2', 'Is DPA known by master and officers?', '4')}
                {renderRow('4.3', 'Is the role of DPA known by Master and officers?', '4')}

                {/* 5. Master's Responsibilities & Authority */}
                <tr style={{ background: '#1e293b', color: '#ffffff' }}>
                  <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>5</td>
                  <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                    MASTER&apos;S RESPONSIBILITIES AND AUTHORITY
                  </td>
                </tr>
                {renderRow('5.1', 'Is the Master familiar with his responsibilities and authority required by ISM Code Section 5?', '6.1.2')}
                {renderRow('5.2', 'Has the Master implemented the safety and environmental protection Policy of the Company?', '5.1.1')}
              </tbody>
            </table>

            {renderBkiPageFooter(4)}
          </div>
  );
};
