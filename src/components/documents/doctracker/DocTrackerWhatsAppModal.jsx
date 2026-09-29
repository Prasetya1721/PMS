/**
 * DocTrackerWhatsAppModal.jsx
 * Diekstrak dari DocumentTracker.jsx (baris 815-911).
 * Sumber: Modal pengiriman peringatan WhatsApp resmi
 */
import React from 'react';
import { Send, X } from 'lucide-react';

export const DocTrackerWhatsAppModal = ({
  sendWhatsAppReminder,
  setWaModalDoc,
  setWaModalOffset,
  waModalDoc,
  waModalOffset,
}) => {
  return (
    <div className="modal-overlay" onClick={() => setWaModalDoc(null)}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
                <div className="modal-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Send size={20} color="#22c55e" />
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Kirim Peringatan WhatsApp Resmi</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Pilih konteks peringatan untuk {waModalDoc.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setWaModalDoc(null)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Kategori Template Sesuai Interval:
                    </label>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => setWaModalOffset(1)}
                        className={`btn btn-sm ${waModalOffset === 1 ? 'btn-danger' : 'btn-secondary'}`}
                      >
                        🚨 1 Hari (Darurat H-1)
                      </button>
                      <button
                        type="button"
                        onClick={() => setWaModalOffset(7)}
                        className={`btn btn-sm ${waModalOffset === 7 ? 'btn-warning' : 'btn-secondary'}`}
                      >
                        ⚠️ 1 Minggu (Kritis H-7)
                      </button>
                      <button
                        type="button"
                        onClick={() => setWaModalOffset(30)}
                        className={`btn btn-sm ${waModalOffset === 30 ? 'btn-primary' : 'btn-secondary'}`}
                      >
                        🔔 1 Bulan (H-30)
                      </button>
                      <button
                        type="button"
                        onClick={() => setWaModalOffset(365)}
                        className={`btn btn-sm ${waModalOffset === 365 ? 'btn-primary' : 'btn-secondary'}`}
                      >
                        📋 1 Tahun (H-365)
                      </button>
                    </div>
                  </div>

                  <div style={{ padding: '0.85rem', background: '#0b141a', borderRadius: '8px', border: '1px solid #1f2c34', color: '#e9edef', fontSize: '0.8rem', lineHeight: 1.45, whiteSpace: 'pre-wrap' }}>
                    {`*${
                      waModalOffset === 1
                        ? '🚨 PERINGATAN DARURAT H-1 (HARI TERAKHIR)'
                        : waModalOffset === 7
                        ? '⚠️ PERINGATAN KRITIS H-1 MINGGU (H-7)'
                        : waModalOffset === 30
                        ? '🔔 PEMBERITAHUAN JATUH TEMPO H-1 BULAN (H-30)'
                        : '📋 PERSIAPAN ANGGARAN DINI H-1 TAHUN (H-365)'
                    } - SISTEM PMS BAHARIMAS*\n\n` +
                    `Dokumen: ${waModalDoc.name}\n` +
                    `Nomor: ${waModalDoc.certificateNo || waModalDoc.documentNo}\n` +
                    `Jatuh Tempo: ${waModalDoc.expiryDate} (${waModalDoc.daysUntilExpiry} hari lagi).\n\n` +
                    `_Pusat Pengendali Armada PMS PT. Pelayaran Baharimas Kalimantan_`}
                  </div>
                </div>

                <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button onClick={() => setWaModalDoc(null)} className="btn btn-secondary btn-sm">
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      sendWhatsAppReminder(
                        waModalDoc,
                        waModalDoc.crewName ? 'crew_cert' : 'ship_doc',
                        { offsetDays: waModalOffset }
                      );
                      setWaModalDoc(null);
                    }}
                    className="btn btn-whatsapp btn-sm"
                  >
                    <Send size={14} />
                    <span>Buka WhatsApp Web / App</span>
                  </button>
                </div>
              </div>
            </div>
  );
};
