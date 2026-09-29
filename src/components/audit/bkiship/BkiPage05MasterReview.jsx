/**
 * BkiPage05MasterReview.jsx
 * Diekstrak dari BkiShipboardChecklistReport.jsx (baris 615-667).
 * Sumber: HALAMAN 5 DARI 10: 5.3 s/d 7.4 (MASTER REVIEW, PERSONNEL, OPERATIONS)
 */
import React from 'react';

export const BkiPage05MasterReview = ({
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
                {renderRow('5.3', 'How did the Master motivate the crew to respect the Company policy?', '5.1.2')}
                {renderRow('5.4', 'How did the Master issue appropriate orders and instructions in a clear and simple manner?', '5.1.3')}
                {renderRow('5.5', 'How did the Master verify that specified requirements have been observed?', '5.1.4')}
                {renderRow('5.6', 'Has the Master reviewed the SMS and reported its deficiencies to the company?', '5.1.5', 'NC 1/4 (Peninjauan Kembali SMK)')}
                {renderRow('5.7', 'Is the Master aware of the Overriding authority and authority to request company\'s assistance?', '5.2')}
                {renderRow('5.8', 'Has the Master carried out Risk Assessment according to the SMS procedure established by the Company?', '1.2.2.2')}

                {/* 6. Resources & Personnel */}
                <tr style={{ background: '#1e293b', color: '#ffffff' }}>
                  <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>6</td>
                  <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                    RESOURCES AND PERSONNEL
                  </td>
                </tr>
                {renderRow('6.1', 'Is Master familiar with requirements of SMS relating to Section 6 of ISM Code?', '6.1.2')}
                {renderRow('6.2', 'Have all crew members received Pre-joining training as per procedures?', '6.1.2 or 6.5')}
                {renderRow('6.3', 'The ship is manned with qualified, certificated and medically fit seafarers in accordance with regulations?', '6.2')}
                {renderRow('6.4', 'Have on-board training and instructions been conducted as per Manual/Procedures?', '6.5')}
                {renderRow('6.5', 'Have newly joined crew members received Familiarization training required by STCW?', '6.3')}
                {renderRow('6.6', 'Is evidence available that all personnel involved in SMS have adequate understanding of rules?', '6.4')}
                {renderRow('6.7', 'Have newly joined crew received Familiarization required by SOLAS within 2 weeks after joining?', '6.5')}
                {renderRow('6.8', 'Have On-board trainings and instructions required by SOLAS conducted regularly?', '6.5')}
                {renderRow('6.9', 'Is working language specified by company recorded in ship\'s log-book? (☐English, ☒Other: Indonesia)', '6.6', 'SOLAS V/14')}
                {renderRow('6.10', 'Are SMS related documents given in a language understood by ship\'s crew?', '6.6')}
                {renderRow('6.11', 'Are all crew able to read and understand the SMS manual?', '6.6')}
                {renderRow('6.12', 'Has company established plan/measure to cope where some crew unable to read manual?', '6.6', 'If No, go to 6.10')}
                {renderRow('6.13', 'Are crews able to communicate effectively in execution of their duties?', '6.7')}
                {renderRow('6.14', 'Is Master\'s SMS awareness on acceptable level? (judged at end of audit)', '6.1.2')}
                {renderRow('6.15', 'Is Master given necessary support so that master\'s duties safely performed?', '6.1.3')}
                {renderRow('6.16', 'Interview with Master & Crew has been conducted?', '')}

                {/* 7. Shipboard Operations */}
                <tr style={{ background: '#1e293b', color: '#ffffff' }}>
                  <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900 }}>7</td>
                  <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                    SHIPBOARD OPERATIONS
                  </td>
                </tr>
                {renderRow('7.1', 'Have the shipboard operations been carried out as per Company\'s SMS?', '7')}
                {renderRow('7.2', 'Have operations during departure been performed as per procedures? (Voyage Plan)', '7', 'SOLAS V/34')}
                {renderRow('7.3', 'Are Daily Reports (position, course, speed) sent to Company indicated on DOC every day?', '7', 'SOLAS V/28')}
                {renderRow('7.4', 'Have arrival operations been performed as per the procedures?', '7')}
              </tbody>
            </table>

            {renderBkiPageFooter(5)}
          </div>
  );
};
