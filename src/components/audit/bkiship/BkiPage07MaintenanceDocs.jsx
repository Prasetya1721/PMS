/**
 * BkiPage07MaintenanceDocs.jsx
 * Diekstrak dari BkiShipboardChecklistReport.jsx (baris 727-780).
 * Sumber: HALAMAN 7 DARI 10: 9.5 s/d 11.8 (MAINTENANCE & DOCUMENTATION)
 */
import React from 'react';

export const BkiPage07MaintenanceDocs = ({
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
                {renderRow('9.5', 'Have any deficiencies identified at inspections by third parties (charterers, P&I club) since last audit?', '9.1', 'If Yes, go to 9.5 up to 9.7')}
                {renderRow('9.6', 'Have all NCs, accidents and hazardous occurrences which were to be reported, informed to Company?', '9.1')}
                {renderRow('9.7', 'Has company responded to the deficiencies reported?', '9.1')}
                {renderRow('9.8', 'Have corrective actions to the deficiencies reported been taken?', '9.2')}

                {/* 10. Maintenance of Ship & Equipment */}
                <tr style={{ background: '#1e293b', color: '#ffffff' }}>
                  <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>10</td>
                  <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                    MAINTENANCE OF THE SHIP AND EQUIPMENT
                  </td>
                </tr>
                {renderRow('10.1', 'Is Ship maintained sufficiently in accordance with relevant rules and Company\'s requirements?', '10.2.1')}
                {renderRow('10.2', 'Has maintenance for ship and equipment been carried out as per plan established?', '10.2.1')}
                {renderRow('10.3', 'Have maintenance works performed been properly recorded?', '10.2.4')}
                {renderRow('10.4', 'Have specific measures for important equipment/technical system identified been taken as per procedures?', '10.3')}
                {renderRow('10.5', 'Are maintenance manuals and documents for lifeboats and launching appliances controlled properly?', '10.2.1')}
                {renderRow('10.6', 'Have weekly/monthly inspections for lifeboats conducted under senior officer supervision?', '10.2.1')}
                {renderRow('10.7', 'Are records of inspections/repairs for lifeboats signed by person who carried out and Master?', '10.2.4')}
                {renderRow('10.8', 'Is there any technical deficiency report which has been reported to the Company?', '10.2.2', 'If Yes, go to 10.9 up to 10.10')}
                {renderRow('10.9', 'Has company responded to deficiency reported?', '10.2.3')}
                {renderRow('10.10', 'Have corrective actions to deficiency reported been taken?', '10.2.3')}
                {renderRow('10.11', 'Have deficiencies found during shipboard tour by auditor been found by crew members already?', '-', 'If Yes, go to 10.12 to 10.14')}
                {renderRow('10.12', 'Have these deficiencies been reported to the Company?', '10.2.2')}
                {renderRow('10.13', 'If temporary repair applied, did repair procedure, timing follow instruction from Company?', '10.2.2')}
                {renderRow('10.14', 'Are these defective items being involved in ship\'s maintenance plan established?', '10.1 or 10.2.1')}
                {renderRow('10.15', 'What was result of last ship\'s regular inspection for these defective items?', '10.1')}

                {/* 11. Documentation */}
                <tr style={{ background: '#1e293b', color: '#ffffff' }}>
                  <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>11</td>
                  <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                    DOCUMENTATION
                  </td>
                </tr>
                {renderRow('11.1', 'Are all documents and data controlled as per the Company\'s SMS?', '11.1')}
                {renderRow('11.2', 'Are ship\'s SMS manuals of updated version? Rev. status: [TEXT]', '11.2.1')}
                {renderRow('11.3', 'Have revisions of the SMS manuals been properly recorded?', '11.2.2')}
                {renderRow('11.4', 'Have obsolete documents been properly removed?', '11.2.3')}
                {renderRow('11.5', 'Are the SMS manuals available at all relevant locations?', '11.2.1')}
                {renderRow('11.6', 'Have company\'s circular letters or information been filed properly and easily identified?', '11.1')}
                {renderRow('11.7', 'Have publications to be provided under the SMS been updated?', '11.2.1')}
                {renderRow('11.8', 'Are as-Built Construction Drawings and structural alterations plans available on board?', '11.2.1')}
              </tbody>
            </table>

            {renderBkiPageFooter(7)}
          </div>
  );
};
