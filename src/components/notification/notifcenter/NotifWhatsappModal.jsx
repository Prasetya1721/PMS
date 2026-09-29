/**
 * NotifWhatsappModal.jsx
 * Diekstrak dari NotificationCenter.jsx (baris 2692-2847).
 * Sumber: Modal pratinjau pesan WhatsApp
 */
import React from 'react';
import { Send, X, Zap } from 'lucide-react';

export const NotifWhatsappModal = ({
  notificationSettings,
  sendWhatsAppReminder,
  setWaCustomMessage,
  setWaOffset,
  setWhatsappModalItem,
  waCustomMessage,
  waOffset,
  whatsappModalItem,
}) => {
  return (
    <div className="modal-overlay" onClick={() => setWhatsappModalItem(null)}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Send size={20} color="#22c55e" />
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Kirim Peringatan WhatsApp Resmi</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Pilih konteks interval untuk {whatsappModalItem.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setWhatsappModalItem(null)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Context Selector */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Kategori Template Sesuai Interval:
                    </label>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setWaOffset(1);
                          setWaCustomMessage('');
                        }}
                        className={`btn btn-sm ${waOffset === 1 ? 'btn-danger' : 'btn-secondary'}`}
                      >
                        🚨 1 Hari (Darurat H-1)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setWaOffset(7);
                          setWaCustomMessage('');
                        }}
                        className={`btn btn-sm ${waOffset === 7 ? 'btn-warning' : 'btn-secondary'}`}
                      >
                        ⚠️ 1 Minggu (Kritis H-7)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setWaOffset(30);
                          setWaCustomMessage('');
                        }}
                        className={`btn btn-sm ${waOffset === 30 ? 'btn-primary' : 'btn-secondary'}`}
                      >
                        🔔 1 Bulan (H-30)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setWaOffset(365);
                          setWaCustomMessage('');
                        }}
                        className={`btn btn-sm ${waOffset === 365 ? 'btn-primary' : 'btn-secondary'}`}
                      >
                        📋 1 Tahun (H-365)
                      </button>
                    </div>
                  </div>

                  {/* Message preview / edit */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Isi Pesan WhatsApp:
                    </label>
                    <textarea
                      rows="7"
                      value={
                        waCustomMessage ||
                        `*${
                          waOffset === 1
                            ? '🚨 PERINGATAN DARURAT H-1 (HARI TERAKHIR)'
                            : waOffset === 7
                            ? '⚠️ PERINGATAN KRITIS H-1 MINGGU (H-7)'
                            : waOffset === 30
                            ? '🔔 PEMBERITAHUAN JATUH TEMPO H-1 BULAN (H-30)'
                            : '📋 PERSIAPAN ANGGARAN DINI H-1 TAHUN (H-365)'
                        } - SISTEM PMS BAHARIMAS*\n\n` +
                        `Kepada: Nakhoda & Staf Kapal\n` +
                        `Dokumen: ${whatsappModalItem.name} (No: ${whatsappModalItem.certificateNo || whatsappModalItem.documentNo})\n` +
                        `Jatuh Tempo: ${whatsappModalItem.expiryDate} (${whatsappModalItem.daysUntilExpiry} hari lagi).\n\n` +
                        (waOffset <= 1
                          ? 'TINDAKAN MENDESAK: Masa berlaku berakhir besok! Segera proses survey/dispensasi kelaiklautan.\n\n'
                          : waOffset <= 7
                          ? 'PERHATIAN: Tersisa 7 hari. Harap konfirmasi jadwal surveyor BKI/Syahbandar.\n\n'
                          : waOffset <= 30
                          ? 'Harap segera daftarkan permohonan survey perpanjangan kelaiklautan kapal.\n\n'
                          : 'Perencanaan anggaran survey besar pembaharuan tahunan.\n\n') +
                        `_Pusat Pengendali Armada PMS PT. Pelayaran Baharimas Kalimantan_`
                      }
                      onChange={(e) => setWaCustomMessage(e.target.value)}
                      className="input-control"
                    />
                  </div>
                </div>

                <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button onClick={() => setWhatsappModalItem(null)} className="btn btn-secondary btn-sm">
                    Batal
                  </button>

                  {/* Option to send via Gateway API if token is configured */}
                  {notificationSettings?.autoSend?.whatsappGateway?.apiKey && (
                    <button
                      onClick={() => {
                        sendWhatsAppReminder(
                          whatsappModalItem,
                          whatsappModalItem.crewName ? 'crew_cert' : 'ship_doc',
                          {
                            offsetDays: waOffset,
                            customMessage: waCustomMessage,
                            useGatewayApi: true
                          }
                        );
                        setWhatsappModalItem(null);
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      <Zap size={14} />
                      <span>Kirim via API Gateway</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      sendWhatsAppReminder(
                        whatsappModalItem,
                        whatsappModalItem.crewName ? 'crew_cert' : 'ship_doc',
                        {
                          offsetDays: waOffset,
                          customMessage: waCustomMessage,
                          useGatewayApi: false
                        }
                      );
                      setWhatsappModalItem(null);
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
