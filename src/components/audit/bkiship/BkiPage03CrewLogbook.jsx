/**
 * BkiPage03CrewLogbook.jsx
 * Diekstrak dari BkiShipboardChecklistReport.jsx (baris 494-543).
 * Sumber: HALAMAN 3 DARI 10: 1.4.4 s/d 1.5.17 (NAKHODA, CREW LIST, LOG BOOK)
 */
import React from 'react';

export const BkiPage03CrewLogbook = ({
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
                {renderRow('1.4.4', 'Was essential instruction prior to sailing given to him?', '-', 'Reflect to 8.8 (☒Yes / ☐No)')}
                {renderRow('1.4.5', 'When did he last participate in an abandon ship drill?', '8.2', 'Deck: 24/06/2026, Eng: 24/06/2026, Cat: 24/06/2026')}
                {renderRow('1.4.6', 'Does he know his assigned duties in emergency?', '8.2', '☒Yes / ☐No')}
                {renderRow('1.4.7', 'Does he know how to donning and use fireman outfit and/or breathing apparatus (including EEBD)?', '8.2', '☒Yes / ☐No')}
                {renderRow('1.4.8', 'Does he understand what alarm signals may sound in emergency?', '-', '☒Yes / ☐No')}
                {renderRow('1.4.9', 'Have there been any accidents or hazardous occurrences (near-miss) on board?', '-', 'Reflect to 9.2')}
                {renderRow('1.4.10', 'Did he receive a copy of the records of daily rest hours endorsed by Master or person authorized?', '7', 'STCW A-VIII.7 (☒Yes / ☐No)')}

                {/* 1.5 Interview with the Master */}
                <tr style={{ background: '#e2e8f0', fontWeight: 800 }}>
                  <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center' }}>1.5</td>
                  <td colSpan={6} style={{ padding: '2px 6px', border: '1px solid #000000' }}>Interview with the Master (Statutory &amp; Crewing)</td>
                </tr>
                {renderRow('1.5.1', 'Are valid statutory certificates, Continuous Synopsis Record (CSR) and survey records available on board?', '1.2.3.1')}
                {renderRow('1.5.2', 'Is validity of statutory certificates informed to the company as per the procedures?', '10.1 or 11.1')}
                {renderRow('1.5.3', 'Are valid Classification Certificate and records available on board the ship?', '1.2.3.1')}
                {renderRow('1.5.4', 'Are ESP file including documents related to ESP survey available on board the ship?', '1.2.3.1')}
                {renderRow('1.5.5', 'Does every seafarer hold a valid medical certificate?', '1.2.3.1', 'STCW I-9 3')}

                <tr>
                  <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center' }}>1.5.6</td>
                  <td style={{ padding: '2px 6px', border: '1px solid #000000' }}>Number and Nationality of Master, Officers &amp; Ratings</td>
                  <td colSpan={4} style={{ padding: '2px 6px', border: '1px solid #000000' }}>
                    Master &amp; Officers: <strong>Indonesia (6 Org)</strong> | Ratings: <strong>Indonesia (4 Org)</strong>
                  </td>
                  <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 700 }}>-</td>
                </tr>

                {renderRow('1.5.7', 'Is the ship manned in compliance with the Safe Manning Certificate?', '6.2.2', 'SOLAS V/14')}
                {renderRow('1.5.8', 'Does each of Master or Officer hold a Certificate of competency or a Dispensation in accordance with STCW?', '6.2.1', 'STCW I-2')}
                {renderRow('1.5.9', 'When serving onboard a ship flying Flag of a Country other than Party, endorsement attesting recognition held?', '6.2.1', 'STCW I-10')}
                {renderRow('1.5.10', 'Are original copies of Master\'s or Officer\'s Certificates and Endorsements kept on board the ship?', '6.2.1')}
                {renderRow('1.5.11', 'Are ratings assigned to part of navigational or engine-room watch duly certificated?', '6.2.1', 'STCW II/4 & III/4')}
                {renderRow('1.5.12', 'Do Master, Officers and person with responsibility for cargo on tanker hold Certificates of competency?', '6.2.1', 'STCW V-1-1 & 1-2')}
                {renderRow('1.5.13', 'Are all ratings assigned to specific duties related to cargo on tanker duly certificated?', '6.2.1', 'STCW V-1-1 & 1-2')}
                {renderRow('1.5.14', 'In case where ECDIS installed, did Master and Deck Officers complete Generic training and Type specific?', '6.2.1')}
                {renderRow('1.5.15', 'Are necessary items entered as per SOLAS requirements in Log book?', '8.2')}
                {renderRow('1.5.16', 'Are necessary items entered as per the SMS in Log book?', '7 or 8.2')}
                {renderRow('1.5.17', 'Are necessary entries made to Oil Record Book? 15ppm Bilge Alarm memorized data compared.', '7')}
              </tbody>
            </table>

            {renderBkiPageFooter(3)}
          </div>
  );
};
