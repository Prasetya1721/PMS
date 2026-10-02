import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Lock,
  CreditCard,
  Phone,
  Building2,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Terminal,
  Copy,
  Check
} from 'lucide-react';
import { getSubscriptionStatusInfo } from '../../services/subscriptionService';
import { SubscriptionPaymentModal } from './SubscriptionPaymentModal';

export const SubscriptionLockOverlay = () => {
  const { subscriptionConfig, currentRole, setCurrentRole } = usePMS();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!subscriptionConfig) return null;

  const statusInfo = getSubscriptionStatusInfo(subscriptionConfig);

  // Lock hanya berlaku jika isLocked === true dan status lisensi expired/habis, serta BUKAN Developer
  if (!subscriptionConfig.isLocked || !statusInfo.isExpired || currentRole === 'Developer') {
    return null;
  }

  const handleCopyAccount = () => {
    const acc = subscriptionConfig.bankAccount || '880-192-8391';
    navigator.clipboard.writeText(acc.replace(/[^0-9]/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const defaultWaUrl = `https://wa.me/${(subscriptionConfig.contactPhone || '089508888778').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Halo Dev, masa aktif lisensi aplikasi Sistem PMS Kapal Baharimas telah habis dan sistem terkunci. Kami ingin segera menyelesaikan pembayaran biaya perpanjangan lisensi. Mohon dibantu aktivasi.`
  )}`;

  return (
    <>
      <div
        className="modal-overlay no-print"
        style={{
          zIndex: 99999,
          backgroundColor: 'rgba(15, 23, 42, 0.94)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}
      >
        <div
          className="glass-card subscription-card"
          style={{
            maxWidth: '560px',
            width: '100%',
            textAlign: 'center',
            padding: '2.5rem 2rem',
            borderRadius: '20px',
            border: '2px solid rgba(239, 68, 68, 0.5)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(239, 68, 68, 0.3)'
          }}
        >
          {/* Lock Icon */}
          <div style={{
            width: '74px',
            height: '74px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '2px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: '#ef4444',
            boxShadow: '0 0 25px rgba(239, 68, 68, 0.4)'
          }}>
            <Lock size={38} />
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, marginBottom: '0.4rem', color: '#dc2626' }}>
            Masa Aktif Lisensi Aplikasi Berakhir
          </h2>
          <p className="subscription-help-text" style={{ fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            {subscriptionConfig.lockMessage ||
              'Akses operasional sistem saat ini ditangguhkan karena masa aktif lisensi tahunan telah habis. Harap selesaikan pembayaran biaya perpanjangan untuk membuka kembali modul armada.'}
          </p>

          {/* Kotak Rincian Tagihan */}
          <div className="subscription-subcard" style={{
            padding: '1.25rem',
            textAlign: 'left',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="subscription-metric-label">Pelanggan:</span>
              <strong style={{ fontSize: '0.85rem' }}>
                {subscriptionConfig.clientName || 'PT. Pelayaran Baharimas Kalimantan'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="subscription-metric-label">Total Tagihan:</span>
              <strong style={{ fontSize: '1rem', color: '#0284c7', fontWeight: 800 }}>
                {subscriptionConfig.billingAmount || 'Rp 25.000.000 / Tahun'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div>
                <div className="subscription-metric-label">
                  Transfer ke: {subscriptionConfig.bankName || 'BCA'}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#d97706', fontFamily: 'monospace' }}>
                  {subscriptionConfig.bankAccount || '880-192-8391'}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyAccount}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  background: copied ? '#10b981' : '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {copied ? 'Tersalin' : 'Salin Rekening'}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a
              href={subscriptionConfig.paymentUrl || defaultWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.5rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: '0.925rem',
                boxShadow: '0 8px 20px rgba(22, 163, 74, 0.4)'
              }}
            >
              <Phone size={18} />
              <span>Konfirmasi Pembayaran via WhatsApp</span>
              <ExternalLink size={15} />
            </a>

            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <CreditCard size={16} />
              <span>Lihat Rincian Invoice & Faktur Lengkap</span>
            </button>
          </div>

          {/* Bypass Link untuk Akun Developer */}
          <div style={{ marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              type="button"
              onClick={() => setCurrentRole('Developer')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#8b5cf6',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                textDecoration: 'underline'
              }}
            >
              <Terminal size={13} />
              <span>Login / Masuk sebagai Developer (Bypass & Kelola Lisensi)</span>
            </button>
          </div>
        </div>
      </div>

      <SubscriptionPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        config={subscriptionConfig}
      />
    </>
  );
};
