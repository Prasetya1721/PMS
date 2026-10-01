/**
 * NotifWhatsappModal.jsx
 * Modal pratinjau dan pengiriman pesan WhatsApp resmi PMS Baharimas.
 * Mendukung kustomisasi nomor HP tujuan, interval template, dan pemilihan
 * metode kirim (API Gateway otomatis atau WhatsApp Web / App langsung).
 */
import React, { useState } from 'react';
import { Send, X, Zap, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

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
  const isCrew = !!whatsappModalItem.crewName;
  const initialPhone = whatsappModalItem.whatsapp ||
    whatsappModalItem.phone ||
    notificationSettings?.autoSend?.whatsappGateway?.senderPhone ||
    '081288991122';

  const [destinationPhone, setDestinationPhone] = useState(initialPhone);
  const gateway = notificationSettings?.autoSend?.whatsappGateway;
  const isGatewayReady = !!gateway?.apiKey;

  return (
    <div className="modal-overlay" onClick={() => setWhatsappModalItem(null)}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(34, 197, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#22c55e',
              border: '1px solid rgba(34, 197, 94, 0.3)'
            }}>
              <Send size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Kirim Peringatan WhatsApp Resmi</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
                {whatsappModalItem.name} • {whatsappModalItem.crewName ? `Kru: ${whatsappModalItem.crewName}` : 'Dokumen Kapal'}
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

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Destination Phone Input */}
          <div style={{
            padding: '0.85rem 1rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '10px',
            border: '1px solid var(--border-glass)'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              <Phone size={14} color="#22c55e" />
              <span>Nomor WhatsApp Tujuan (Penerima):</span>
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                value={destinationPhone}
                onChange={(e) => setDestinationPhone(e.target.value)}
                placeholder="Contoh: 089508888778 atau 628..."
                className="input-control mono"
                style={{ fontSize: '0.875rem', fontWeight: 600 }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {destinationPhone?.startsWith('0') ? 'Format RI (08...)' : 'Format Internasional'}
              </span>
            </div>
          </div>

          {/* Context Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Pilih Interval Template:
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
              Isi Teks Pesan WhatsApp:
            </label>
            <textarea
              rows="6"
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
                `Kepada: ${whatsappModalItem.crewName || 'Nakhoda & Staf Kapal'}\n` +
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
              style={{ fontSize: '0.825rem', lineHeight: '1.4' }}
            />
          </div>

          {/* Gateway Status Badge */}
          <div style={{
            fontSize: '0.75rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            background: isGatewayReady ? 'rgba(34, 197, 94, 0.08)' : 'rgba(234, 179, 8, 0.08)',
            border: isGatewayReady ? '1px solid rgba(34, 197, 94, 0.25)' : '1px solid rgba(234, 179, 8, 0.25)',
            color: isGatewayReady ? '#86efac' : '#fde047',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {isGatewayReady ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            <span>
              {isGatewayReady
                ? `Gateway ${gateway?.provider || 'Wablas'} Aktif (${gateway?.apiUrl || 'Endpoint siap'}). Dapat kirim langsung dari server.`
                : 'API Gateway belum diisi di Developer Console. Anda dapat mengirim via WhatsApp Web / App langsung.'}
            </span>
          </div>
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setWhatsappModalItem(null)} className="btn btn-secondary btn-sm">
            Batal
          </button>

          {/* Option to send via Gateway API if token is configured */}
          {isGatewayReady && (
            <button
              onClick={() => {
                sendWhatsAppReminder(
                  whatsappModalItem,
                  isCrew ? 'crew_cert' : 'ship_doc',
                  {
                    phone: destinationPhone,
                    recipientPhone: destinationPhone,
                    offsetDays: waOffset,
                    customMessage: waCustomMessage,
                    useGatewayApi: true
                  }
                );
                setWhatsappModalItem(null);
              }}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #10b981, #0284c7)' }}
            >
              <Zap size={14} />
              <span>Kirim via API Gateway</span>
            </button>
          )}

          <button
            onClick={() => {
              sendWhatsAppReminder(
                whatsappModalItem,
                isCrew ? 'crew_cert' : 'ship_doc',
                {
                  phone: destinationPhone,
                  recipientPhone: destinationPhone,
                  offsetDays: waOffset,
                  customMessage: waCustomMessage,
                  useGatewayApi: false
                }
              );
              setWhatsappModalItem(null);
            }}
            className="btn btn-whatsapp btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Send size={14} />
            <span>Buka WhatsApp Web / App</span>
          </button>
        </div>
      </div>
    </div>
  );
};
