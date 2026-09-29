/**
 * BkiPage10Signatures.jsx
 * Diekstrak dari BkiShipboardChecklistReport.jsx (baris 925-994).
 * Sumber: HALAMAN 10 DARI 10: E CONT. & TANDATANGAN PENGESAHAN RESMI
 */
import React from 'react';

export const BkiPage10Signatures = ({
  auditDateStr,
  auditLocation,
  auditorName,
  masterName,
  renderBkiPageFooter,
  renderBkiTableHeader,
  renderBkiTopBar,
  renderRow,
  vesselName,
}) => {
  return (
    <div className="bki-print-page" style={{ paddingBottom: '10px' }}>
            {renderBkiTopBar()}
            {renderBkiTableHeader()}

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.8pt', border: '1px solid #000000', borderTop: 'none', marginBottom: '14px' }}>
              <tbody>
                {renderRow('E.3', 'Conveyor systems (Maintenance of rotor bearing and shaft)?', '')}
                {renderRow('E.4', 'Fire-Extinguishing system (Fire Detecting Alarm System, etc.)?', '')}
                {renderRow('E.5', 'Operating conditions and cargo? Hot work near conveyor systems?', '')}
                {renderRow('E.6', 'Who has responsibility for implementation of fire safety risk assessment?', '')}
                {renderRow('E.7', 'Are identified fire safety risks reviewed at meetings for system review?', '')}
                {renderRow('E.8', 'Are there any safeguards newly established taking accounts of results of review?', '')}
              </tbody>
            </table>

            {/* KOTAK TANDATANGAN PENGESAHAN RESMI BKI */}
            <div style={{ border: '1.5px solid #000000', padding: '8px 12px', background: '#ffffff', pageBreakInside: 'avoid', marginTop: '10px' }}>
              <div style={{ textAlign: 'center', fontSize: '7.5pt', fontWeight: 900, marginBottom: '8px', textTransform: 'uppercase' }}>
                PENGESAHAN HASIL AUDIT SISTEM MANAJEMEN KESELAMATAN KAPAL (ISM CODE)
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '7pt', textAlign: 'center' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '50%', padding: '6px', verticalAlign: 'top', borderRight: '1px solid #000000' }}>
                      <div style={{ fontSize: '6.5pt', color: '#475569', fontWeight: 700 }}>
                        AUDITOR YANG MELAKSANAKAN AUDIT /<br /><em>AUDITOR(S) PERFORMING AUDIT</em>
                      </div>
                      <div style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ borderBottom: '1px solid #000000', padding: '2px 30px', fontWeight: 800, fontStyle: 'italic' }}>
                          {auditorName}
                        </span>
                      </div>
                      <div style={{ fontWeight: 900, fontSize: '8pt', textTransform: 'uppercase' }}>
                        {auditorName}
                      </div>
                      <div style={{ fontSize: '6.2pt', color: '#003b6f', fontWeight: 700 }}>
                        Auditor Statutori SMC Biro Klasifikasi Indonesia (BKI)
                      </div>
                      <div style={{ fontSize: '6pt', color: '#64748b', marginTop: '2px' }}>
                        Tanggal: {auditDateStr}
                      </div>
                    </td>

                    <td style={{ width: '50%', padding: '6px', verticalAlign: 'top' }}>
                      <div style={{ fontSize: '6.5pt', color: '#475569', fontWeight: 700 }}>
                        NAKHODA KAPAL /<br /><em>MASTER OF THE SHIP (AUDITEE)</em>
                      </div>
                      <div style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ borderBottom: '1px solid #000000', padding: '2px 30px', fontWeight: 800, fontStyle: 'italic' }}>
                          {masterName}
                        </span>
                      </div>
                      <div style={{ fontWeight: 900, fontSize: '8pt', textTransform: 'uppercase' }}>
                        {masterName}
                      </div>
                      <div style={{ fontSize: '6.2pt', color: '#003b6f', fontWeight: 700 }}>
                        Master / Nakhoda {vesselName}
                      </div>
                      <div style={{ fontSize: '6pt', color: '#64748b', marginTop: '2px' }}>
                        Lokasi: {auditLocation}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {renderBkiPageFooter(10)}
          </div>
  );
};
