/**
 * BkiPage06OperationsEmergency.jsx
 * Diekstrak dari BkiShipboardChecklistReport.jsx (baris 672-722).
 * Sumber: HALAMAN 6 DARI 10: 7.5 s/d 9.4 (OPERATIONS, EMERGENCY, NC REPORTS)
 */
import React from 'react';

export const BkiPage06OperationsEmergency = ({
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
                {renderRow('7.5', 'What kind of cargo does the ship load?', '7', 'Towing oil barge')}
                {renderRow('7.6', 'Does Master confirm compatibility then signed and properly keeps Cargo Information?', '7')}
                {renderRow('7.7', 'Have cargo handling operations been performed as per the procedures?', '7', 'Refer to Additional Check Items')}
                {renderRow('7.8', 'Have pollution prevention operations been performed as per the procedures?', '7')}
                {renderRow('7.9', 'Have special operations identified been performed as per the procedures?', '7')}
                {renderRow('7.10', 'Have Watchkeeping operations been performed as per procedures? (Rest hours STCW A-VIII, alcohol abuse limit <0.05% BAC, voyage planning, BRM/ERM)', '7')}
                {renderRow('7.11', 'Shipboard operations conducted being observed by BKI auditors?', '')}

                {/* 8. Emergency Preparedness */}
                <tr style={{ background: '#1e293b', color: '#ffffff' }}>
                  <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>8</td>
                  <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                    EMERGENCY PREPAREDNESS
                  </td>
                </tr>
                {renderRow('8.1', 'Has the ship been ready for Emergency Situations identified?', '8.2')}
                {renderRow('8.2', 'Has the company provided the ship with updated emergency contact list?', '8.3')}
                {renderRow('8.3', 'Is Master familiar with procedures to respond emergency situations identified?', '8.1')}
                {renderRow('8.4', 'Have drills and exercise for emergency situations been conducted as per procedures?', '8.2')}
                {renderRow('8.5', 'Does radio personnel aware of how to transmit distress alert under GMDSS?', '8.2')}
                {renderRow('8.6', 'Is SOPEP (SMPEP) properly controlled with latest emergency contact list?', '8.1')}
                {renderRow('8.7', 'Are ship-specific Emergency Towing Booklet controlled properly? (Bridge, Forecastle)', '8.1')}
                {renderRow('8.8', 'Have mandatory drills been conducted regularly?', '8.2')}
                {renderRow('8.9', 'Has ship encountered sea casualty and/or serious human injury since last audit?', '-', 'If Yes, go to 8.10 up to 8.12')}
                {renderRow('8.10', 'Has Company given master necessary support as per procedures?', '8.3')}
                {renderRow('8.11', 'Have responses and actions been taken by ship as per procedures?', '8.1')}
                {renderRow('8.12', 'Has SMS been reviewed based on results of investigation?', '9.1')}
                {renderRow('8.13', 'Emergency drills being observed by BKI auditors during audit?', '-', 'Fire drill & man overboard')}

                {/* 9. Reports & Analysis of NC */}
                <tr style={{ background: '#1e293b', color: '#ffffff' }}>
                  <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>9</td>
                  <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                    REPORTS AND ANALYSIS OF NON-CONFORMITIES, ACCIDENTS AND HAZARDOUS OCCURRENCES
                  </td>
                </tr>
                {renderRow('9.1', 'Have all deficiencies been dealt with in accordance with Company\'s SMS?', '9.1')}
                {renderRow('9.2', 'Were there any reports on NC, accident and hazardous occurrence sent ashore?', '9.1', 'If Yes, go to 9.5 up to 9.7')}
                {renderRow('9.3', 'Have the ship been controlled (regardless of detention or not) by PSC since last audit?', '9.1')}
                {renderRow('9.4', 'Is there any lack of PSC Records kept onboard, comparing with PSC history to auditor?', '9.1', 'If Yes, 9.5 thru 9.7 & 11.1')}
              </tbody>
            </table>

            {renderBkiPageFooter(6)}
          </div>
  );
};
