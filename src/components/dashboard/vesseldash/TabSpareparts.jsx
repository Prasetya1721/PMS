/**
 * TabSpareparts.jsx
 * Diekstrak dari VesselDashboard.jsx (baris 1687-1752).
 * Sumber: SUB-TAB 6: inventaris spareparts
 */
import React from 'react';

export const TabSpareparts = ({
  currentShip,
  shipParts,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                    Inventaris Suku Cadang Kapal: {currentShip.name}
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Stok sparepart yang tersimpan di gudang penyimpanan (store room) kapal ini
                  </p>
                </div>
              </div>

              <div className="glass-card" style={{ overflow: 'hidden' }}>
                <div className="table-container">
                  <table className="pms-table">
                    <thead>
                      <tr>
                        <th>Kode Part</th>
                        <th>Nama Sparepart</th>
                        <th>Peruntukan Mesin</th>
                        <th>Lokasi Rak / Store</th>
                        <th>Stok Aktual</th>
                        <th>Min. Stok</th>
                        <th>Status Stok</th>
                        <th>Pemasok (Vendor)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shipParts.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            Belum ada data inventaris khusus yang dialokasikan di store room kapal ini.
                          </td>
                        </tr>
                      ) : (
                        shipParts.map(sp => (
                          <tr key={sp.id}>
                            <td className="mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8' }}>{sp.code}</td>
                            <td><strong style={{ fontSize: '0.9rem' }}>{sp.name}</strong></td>
                            <td className="mono" style={{ fontSize: '0.8rem' }}>{sp.equipmentCode || '-'}</td>
                            <td style={{ fontSize: '0.825rem' }}>{sp.location}</td>
                            <td className="mono" style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                              {sp.stockQty} {sp.unit}
                            </td>
                            <td className="mono" style={{ fontSize: '0.85rem' }}>
                              {sp.minStockQty} {sp.unit}
                            </td>
                            <td>
                              <span className={`badge ${
                                sp.status === 'Critical' ? 'badge-danger-pulse' :
                                sp.status === 'Low Stock' ? 'badge-warning' : 'badge-success'
                              }`}>
                                {sp.status}
                              </span>
                            </td>
                            <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sp.supplier}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
  );
};
