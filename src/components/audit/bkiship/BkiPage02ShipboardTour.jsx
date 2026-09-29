/**
 * BkiPage02ShipboardTour.jsx
 * Diekstrak dari BkiShipboardChecklistReport.jsx (baris 403-489).
 * Sumber: HALAMAN 2 DARI 10: 1. SHIPBOARD TOUR (1.1 s/d 1.4 ABK)
 */
import React from 'react';

export const BkiPage02ShipboardTour = ({
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
                {/* Header Seksi 1 */}
                <tr style={{ background: '#1e293b', color: '#ffffff' }}>
                  <td style={{ padding: '3px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 900, width: '6%' }}>1</td>
                  <td colSpan={6} style={{ padding: '3px 6px', border: '1px solid #000000', fontWeight: 900 }}>
                    SHIPBOARD TOUR &amp; GENERAL REQUIREMENT
                  </td>
                </tr>

                {/* 1.1 Bridge */}
                <tr style={{ background: '#e2e8f0', fontWeight: 800 }}>
                  <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center' }}>1.1</td>
                  <td colSpan={6} style={{ padding: '2px 6px', border: '1px solid #000000' }}>Bridge</td>
                </tr>
                {renderRow('1.1.1', 'Are there any Navigation equipment or radio equipment left inoperative/ malfunctioned?', '10', 'If Yes, go to 10.11 up to 10.14')}
                {renderRow('1.1.2', 'Are updated versions of nautical publications and IAMSAR Manual (Volume III) available?', '11.2.1', 'SOLAS V/21 & 27')}
                {renderRow('1.1.3', 'Are maritime safety information from NAVTEX or EGC checked regularly?', '7')}
                {renderRow('1.1.4', 'Are nautical charts and Notice to Mariners controlled properly?', '7')}
                {renderRow('1.1.5', 'Is ENCs updated in accordance with ECDIS handling procedure in SMS properly?', '7')}
                {renderRow('1.1.6', 'Are standing order or night order issued regularly by the master?', '7')}

                {/* 1.2 Accommodation Space */}
                <tr style={{ background: '#e2e8f0', fontWeight: 800 }}>
                  <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center' }}>1.2</td>
                  <td colSpan={6} style={{ padding: '2px 6px', border: '1px solid #000000' }}>Accomodation Space</td>
                </tr>
                {renderRow('1.2.1', 'Are there any crew accommodation facilities left inoperative/ malfunctioned? Common toilets, Shower & toilet in cabins etc.', '10', 'If Yes, go to 10.11 up to 10.14')}
                {renderRow('1.2.2', 'Are posted Muster lists updated? (Engine Room, Accommodation Room, Bridge)', '8.2', 'SOLAS III/37')}
                {renderRow('1.2.3', 'Is SOLAS training manual controlled properly? (Mess Room, Recreation Room)', '8.2', 'SOLAS III/36')}
                {renderRow('1.2.4', 'Are ship\'s drawings and instruction books controlled properly?', '11.2.1', 'SOLAS II-1/3-7')}
                {renderRow('1.2.5', 'Is posted placard for garbage disposal written in language understood by crew?', '6.6', 'MARPOL V/9')}
                {renderRow('1.2.6', 'Are there distinctively marked garbage receptacles to receive garbage for recycling? Any receptacles on deck area secured and tight.', '6.6', 'MARPOL V, MEPC.201(62)')}
                {renderRow('1.2.7', 'Is watch schedule for watchkeeper posted?', '7', 'STCW A-VIII/1.5')}
                {renderRow('1.2.8', 'Is hospital accommodation ready for emergency use?', '')}
                {renderRow('1.2.9', 'Are medicaments properly controlled?', '')}

                {/* 1.3 On Deck & Engine Room */}
                <tr style={{ background: '#e2e8f0', fontWeight: 800 }}>
                  <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center' }}>1.3</td>
                  <td colSpan={6} style={{ padding: '2px 6px', border: '1px solid #000000' }}>On Deck &amp; Engine Room</td>
                </tr>
                {renderRow('1.3.1', 'Are closing appliances, L.S.A. and F.F.A maintained properly? (Lifeboat, Rescue boat, Fire damper)', '10', 'If No, go to 10.11 up to 10.14')}
                {renderRow('1.3.2', 'Are coating / painting of hull parts and equipment maintained properly?', '10', 'If Yes, go to 10.11 up to 10.14')}
                {renderRow('1.3.3', 'Are there any damaged or corroded / rusted equipment or hull parts?', '10')}
                {renderRow('1.3.4', 'Are there any temporarily repaired parts?', '10')}
                {renderRow('1.3.6', 'Are there any machinery and equipment left with their function inoperative? (Fire pump, Emergency fire pump, OWS system)', '10.2', 'If Yes, go to 10.11 up to 10.14')}
                {renderRow('1.3.7', 'Are escape route and escape trunk from engine room secured?', '8.2', 'SOLAS II-2/13')}
                {renderRow('1.3.8', 'Is operating instruction of steering changeover posted?', '8.2', 'SOLAS V/26 3.1')}

                {/* 1.4 Ratings Interview */}
                <tr style={{ background: '#e2e8f0', fontWeight: 800 }}>
                  <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center' }}>1.4</td>
                  <td colSpan={6} style={{ padding: '2px 6px', border: '1px solid #000000' }}>Interview with officers and/or ratings during tour through</td>
                </tr>
                <tr>
                  <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center' }}>1.4.1</td>
                  <td style={{ padding: '2px 6px', border: '1px solid #000000' }}>Interview with the Officer and/or Rating for</td>
                  <td colSpan={5} style={{ padding: '2px 6px', border: '1px solid #000000' }}>
                    Deck: <strong>Rank: Juru Mudi</strong> | Engine: <strong>Rank: Juru Minyak</strong> | Catering: <strong>Rank: Koki</strong>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center' }}>1.4.2</td>
                  <td style={{ padding: '2px 6px', border: '1px solid #000000' }}>When did he join?</td>
                  <td colSpan={4} style={{ padding: '2px 6px', border: '1px solid #000000' }}>
                    Deck: <strong>30/05/2023</strong> | Engine: <strong>16/11/2022</strong> | Catering: <strong>30/05/2023</strong>
                  </td>
                  <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 700 }}>6.3</td>
                </tr>
                <tr>
                  <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center' }}>1.4.3</td>
                  <td style={{ padding: '2px 6px', border: '1px solid #000000' }}>Did he undergo familiarization training just after joining?</td>
                  <td colSpan={4} style={{ padding: '2px 6px', border: '1px solid #000000' }}>
                    Deck: ☒Yes / ☐No | Engine: ☒Yes / ☐No | Catering: ☒Yes / ☐No
                  </td>
                  <td style={{ padding: '2px 4px', border: '1px solid #000000', textAlign: 'center', fontWeight: 700 }}>6.3</td>
                </tr>
              </tbody>
            </table>

            {renderBkiPageFooter(2)}
          </div>
  );
};
