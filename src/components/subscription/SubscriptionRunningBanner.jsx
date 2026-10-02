import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  AlertTriangle,
  CreditCard,
  X,
  ExternalLink,
  Settings,
  ShieldAlert,
  Flame,
  Clock
} from 'lucide-react';
import {
  getSubscriptionStatusInfo,
  formatSubscriptionTickerMessage
} from '../../services/subscriptionService';
import { SubscriptionPaymentModal } from './SubscriptionPaymentModal';
import { SubscriptionDevModal } from './SubscriptionDevModal';

export const SubscriptionRunningBanner = () => {
  const { subscriptionConfig, currentRole, setActiveTab } = usePMS();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);

  if (!subscriptionConfig) return null;

  const statusInfo = getSubscriptionStatusInfo(subscriptionConfig);

  // Jika kondisi running text tidak terpenuhi, atau telah ditutup sementara (selama bukan expired/kritis)
  if (!statusInfo.shouldShowRunningText) {
    return null;
  }

  // Jika expired atau status darurat, banner tidak boleh ditutup
  if (isDismissed && !statusInfo.isExpired) {
    return null;
  }

  const message = formatSubscriptionTickerMessage(subscriptionConfig, statusInfo);

  return (
    <>
      <div
        className={`subscription-marquee-container severity-${statusInfo.severity} no-print`}
        role="alert"
        aria-live="polite"
      >
        {/* Badge Status & Ikon */}
        <div className="subscription-badge" style={{
          background: statusInfo.isExpired
            ? 'rgba(239, 68, 68, 0.95)'
            : statusInfo.severity === 'warning'
            ? 'rgba(217, 119, 6, 0.95)'
            : 'rgba(37, 99, 235, 0.95)',
          color: '#ffffff'
        }}>
          {statusInfo.isExpired ? (
            <Flame size={14} className="pulse-icon" />
          ) : (
            <AlertTriangle size={14} />
          )}
          <span>{statusInfo.badgeLabel}</span>
        </div>

        {/* Marquee Ticker Track (Bergerak Halus & Berhenti saat Hover Kursor) */}
        <div className="subscription-marquee-track" title="Arahkan mouse ke sini untuk menghentikan teks berjalan">
          <div className="subscription-marquee-content">
            <span style={{ marginRight: '3rem' }}>{message}</span>
            <span style={{ marginRight: '3rem' }} aria-hidden="true">{message}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="subscription-actions">
          {/* Tombol Rincian Tagihan & Pembayaran */}
          <button
            type="button"
            onClick={() => setIsPaymentModalOpen(true)}
            className="subscription-btn-pay"
            title="Buka rincian rekening pembayaran dan konfirmasi WhatsApp"
          >
            <CreditCard size={14} />
            <span>{subscriptionConfig.paymentButtonText || 'Rincian Tagihan & Bayar'}</span>
          </button>

          {/* Shortcut Khusus Akun Developer untuk langsung mengedit konfigurasi */}
          {currentRole === 'Developer' && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDevModalOpen(true);
              }}
              className="subscription-btn-dev"
              title="Buka panel cepat pengembang untuk mengubah status, tanggal, running text, atau sync remote web"
            >
              <Settings size={13} />
              <span>Kelola (Dev)</span>
            </button>
          )}

          {/* Tombol Tutup Sementara (Hanya jika belum expired) */}
          {!statusInfo.isExpired && (
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="subscription-btn-close"
              title="Tutup banner sementara untuk sesi ini"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Modal Dialog Rincian Pembayaran */}
      <SubscriptionPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        config={subscriptionConfig}
      />

      {/* Modal Cepat Kontrol Lisensi & Running Teks Khusus Akun Developer */}
      <SubscriptionDevModal
        isOpen={isDevModalOpen}
        onClose={() => setIsDevModalOpen(false)}
      />
    </>
  );
};
