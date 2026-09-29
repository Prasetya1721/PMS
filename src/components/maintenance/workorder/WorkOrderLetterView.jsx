/**
 * WorkOrderLetterView.jsx
 * Diekstrak dari WorkOrderModal.jsx (baris 912-1259).
 * Sumber: Mode lihat: surat permintaan resmi siap cetak (kop, tabel barang, tanda tangan kapten dan pemohon)
 */
import React from 'react';
import { ArrowLeft, Check, CheckCircle, Copy, Printer, Send } from 'lucide-react';
import { BaharimasEmblem } from '../../common/BaharimasLogo';

export const WorkOrderLetterView = ({
  captainName,
  copiedText,
  currentVessel,
  formData,
  handleCopyText,
  handlePrint,
  handleSendWA,
  items,
  onClose,
  setViewMode,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
                {/* Action Bar (No-Print) */}
                <div className="no-print" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1.25rem',
                  background: 'rgba(56, 189, 248, 0.08)',
                  borderBottom: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={16} color="#10b981" />
                    <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Surat Permintaan Siap Ditandatangani & Dikirim ke Gudang
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={handleCopyText}
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}
                    >
                      {copiedText ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                      <span>{copiedText ? 'Tersalin!' : 'Salin Teks'}</span>
                    </button>

                    <button
                      onClick={handleSendWA}
                      className="btn btn-whatsapp btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}
                    >
                      <Send size={14} />
                      <span>Kirim WA ke Gudang</span>
                    </button>

                    <button
                      onClick={handlePrint}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700 }}
                    >
                      <Printer size={14} />
                      <span>Cetak Surat (Print / PDF)</span>
                    </button>
                  </div>
                </div>

                {/* PRINTABLE LETTER CONTAINER */}
                <div className="modal-body" style={{ padding: '1.25rem' }}>
                  <div
                    className="particulars-sheet maritime-print-sheet"
                    style={{
                      background: '#ffffff',
                      color: '#0f172a',
                      padding: '2rem',
                      borderRadius: '8px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                      fontFamily: '"Segoe UI", Arial, sans-serif'
                    }}
                  >
                    {/* 1. KOP SURAT RESMI */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', borderBottom: '3px double #0f172a', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
                      <BaharimasEmblem size={52} />
                      <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                          PT. PELAYARAN BAHARIMAS KALIMANTAN
                        </h2>
                        <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0369a1', margin: '2px 0 0 0', textTransform: 'uppercase' }}>
                          SHIP MANAGEMENT & FLEET LOGISTICS SUPPLY DIVISION
                        </p>
                        <p style={{ fontSize: '0.72rem', color: '#475569', margin: '2px 0 0 0' }}>
                          Jl. Rahadi Usman No. 88, Pontianak, Kalimantan Barat 78111 • Telp: (0561) 741234 • Email: logistics@baharimas.co.id
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', borderLeft: '1px solid #cbd5e1', paddingLeft: '1rem' }}>
                        <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block' }}>FORMULIR LOGISTIK</span>
                        <strong style={{ fontSize: '0.8rem', color: '#0f172a', fontFamily: 'monospace' }}>FORM-LOG-04/REV.02</strong>
                      </div>
                    </div>

                    {/* 2. JUDUL DOKUMEN & NOMOR */}
                    <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                      <h3 style={{
                        fontSize: '1.15rem',
                        fontWeight: 900,
                        color: '#0f172a',
                        margin: 0,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        textDecoration: 'underline'
                      }}>
                        SURAT PERMINTAAN BARANG KE GUDANG
                      </h3>
                      <p style={{ fontSize: '0.78rem', fontStyle: 'italic', color: '#64748b', margin: '2px 0 0 0' }}>
                        (MATERIAL / STORE REQUISITION FORM)
                      </p>
                      <p style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0369a1', margin: '4px 0 0 0', fontFamily: 'monospace' }}>
                        Nomor: {formData.documentNo}
                      </p>
                    </div>

                    {/* 3. METADATA PERMINTAAN */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.85rem',
                      marginBottom: '1.25rem',
                      fontSize: '0.8rem',
                      background: '#f8fafc',
                      padding: '0.85rem 1rem',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <div style={{ display: 'flex' }}>
                          <span style={{ width: '130px', color: '#64748b' }}>Nama Kapal:</span>
                          <strong style={{ color: '#0f172a' }}>{currentVessel?.name} ({currentVessel?.type?.split(' ')[0]})</strong>
                        </div>
                        <div style={{ display: 'flex' }}>
                          <span style={{ width: '130px', color: '#64748b' }}>Kategori Kebutuhan:</span>
                          <strong style={{ color: formData.mainCategory === 'Kebutuhan Crew' ? '#059669' : '#0284c7' }}>
                            {formData.mainCategory} ({formData.subCategory})
                          </strong>
                        </div>
                        <div style={{ display: 'flex' }}>
                          <span style={{ width: '130px', color: '#64748b' }}>PIC / Pemohon:</span>
                          <strong style={{ color: '#0f172a' }}>{formData.picName} ({formData.picRole})</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <div style={{ display: 'flex' }}>
                          <span style={{ width: '130px', color: '#64748b' }}>Tanggal Pengajuan:</span>
                          <strong style={{ color: '#0f172a' }}>{formData.requestDate}</strong>
                        </div>
                        <div style={{ display: 'flex' }}>
                          <span style={{ width: '130px', color: '#64748b' }}>Tanggal Dibutuhkan:</span>
                          <strong style={{ color: '#dc2626' }}>{formData.neededDate}</strong>
                        </div>
                        <div style={{ display: 'flex' }}>
                          <span style={{ width: '130px', color: '#64748b' }}>Prioritas / Lokasi:</span>
                          <strong style={{ color: '#0f172a' }}>{formData.priority} • {formData.deliveryLocation}</strong>
                        </div>
                      </div>
                    </div>

                    {/* 4. TABEL PERMINTAAN BARANG RESMI (SEPERTI YANG DIMINTA PENGGUNA) */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '0.8rem',
                        border: '1px solid #0f172a'
                      }}>
                        <thead>
                          <tr style={{ background: '#e2e8f0', color: '#0f172a', borderBottom: '2px solid #0f172a' }}>
                            <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '35px', textAlign: 'center' }}>NO</th>
                            <th style={{ border: '1px solid #0f172a', padding: '6px 10px', textAlign: 'left' }}>NAMA BARANG / MATERIAL</th>
                            <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '110px', textAlign: 'center' }}>JUMLAH</th>
                            <th style={{ border: '1px solid #0f172a', padding: '6px 10px', textAlign: 'left' }}>KETERANGAN / SPESIFIKASI / PERUNTUKAN</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, idx) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                              <td style={{ border: '1px solid #0f172a', padding: '6px 8px', textAlign: 'center', fontWeight: 600 }}>
                                {idx + 1}
                              </td>
                              <td style={{ border: '1px solid #0f172a', padding: '6px 10px', fontWeight: 700, color: '#0f172a' }}>
                                {item.name}
                              </td>
                              <td style={{ border: '1px solid #0f172a', padding: '6px 8px', textAlign: 'center', fontWeight: 700, color: '#0369a1' }}>
                                {item.qty} {item.unit}
                              </td>
                              <td style={{ border: '1px solid #0f172a', padding: '6px 10px', color: '#334155' }}>
                                {item.notes || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* 5. CATATAN TAMBAHAN */}
                    {formData.notes && (
                      <div style={{ marginBottom: '1.5rem', fontSize: '0.75rem', color: '#475569', fontStyle: 'italic' }}>
                        <strong>Catatan Khusus:</strong> {formData.notes}
                      </div>
                    )}

                    {/* 6. TANDA TANGAN (TTD PEMOHON & KAPTEN SEPERTI YANG DIMINTA PENGGUNA) */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '1rem',
                      marginTop: '1.75rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px dashed #cbd5e1',
                      textAlign: 'center'
                    }}>
                      {/* Kolom 1: Pemohon / PIC */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.2rem' }}>
                          Diajukan oleh (PIC):
                        </span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                          {formData.picRole || 'Pemohon'}
                        </span>
                        {/* Digital Signature Representation */}
                        <div style={{
                          height: '65px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: '"Brush Script MT", cursive, sans-serif',
                          fontSize: '1.4rem',
                          color: '#0369a1',
                          opacity: 0.85
                        }}>
                          {formData.picName.split(' ')[0]} Sign.
                        </div>
                        <strong style={{ fontSize: '0.8rem', color: '#0f172a', borderTop: '1px solid #0f172a', width: '85%', paddingTop: '3px' }}>
                          ( {formData.picName} )
                        </strong>
                        <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                          Tgl: {formData.requestDate}
                        </span>
                      </div>

                      {/* Kolom 2: Petugas Gudang (Logistik) */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.2rem' }}>
                          Diterima oleh (Gudang):
                        </span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                          Petugas Gudang & Logistik
                        </span>
                        {/* Warehouse Stamp / Sign */}
                        <div style={{
                          height: '65px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <div style={{
                            border: '2px dashed #0284c7',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.65rem',
                            color: '#0284c7',
                            fontWeight: 800,
                            transform: 'rotate(-4deg)'
                          }}>
                            LOGISTIK GUDANG PT. PBK<br/>[ TERIMA / VALIDASI ]
                          </div>
                        </div>
                        <strong style={{ fontSize: '0.8rem', color: '#0f172a', borderTop: '1px solid #0f172a', width: '85%', paddingTop: '3px' }}>
                          ( Staff Gudang Pontianak )
                        </strong>
                        <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                          Tgl: __ / __ / 2026
                        </span>
                      </div>

                      {/* Kolom 3: Mengetahui & Menyetujui: Kapten / Nakhoda */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.2rem' }}>
                          Mengetahui & Menyetujui:
                        </span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                          Nakhoda / Master Kapal
                        </span>
                        {/* Captain Round Stamp & Sign */}
                        <div style={{
                          height: '65px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative'
                        }}>
                          <div style={{
                            width: '55px',
                            height: '55px',
                            borderRadius: '50%',
                            border: '2px solid #059669',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.5rem',
                            color: '#059669',
                            fontWeight: 900,
                            textAlign: 'center',
                            lineHeight: 1.1,
                            transform: 'rotate(8deg)'
                          }}>
                            <span>★ PBK ★</span>
                            <span style={{ fontSize: '0.45rem' }}>CAPTAIN</span>
                            <span style={{ fontSize: '0.45rem' }}>RP 2020</span>
                          </div>
                        </div>
                        <strong style={{ fontSize: '0.8rem', color: '#0f172a', borderTop: '1px solid #0f172a', width: '85%', paddingTop: '3px' }}>
                          ( {captainName} )
                        </strong>
                        <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                          Reg BKI: {currentVessel?.regNo || 'B-24587-ID'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer Letter (No-Print) */}
                <div className="modal-footer no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setViewMode('form')}
                    className="btn btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <ArrowLeft size={16} />
                    <span>Ubah Daftar Barang</span>
                  </button>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn btn-secondary"
                    >
                      Selesai / Tutup
                    </button>
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="btn btn-primary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
                    >
                      <Printer size={16} />
                      <span>Cetak Surat Permintaan</span>
                    </button>
                  </div>
                </div>
              </div>
  );
};
