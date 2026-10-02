import React, { useState } from 'react';
import {
  CreditCard,
  Building2,
  Calendar,
  Clock,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Phone,
  Mail,
  AlertTriangle,
  X,
  Sparkles
} from 'lucide-react';
import { getSubscriptionStatusInfo } from '../../services/subscriptionService';

export const SubscriptionPaymentModal = ({ isOpen, onClose, config }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !config) return null;

  const statusInfo = getSubscriptionStatusInfo(config);

  const handleCopyAccount = () => {
    const accNumber = config.bankAccount || '880-192-8391';
    navigator.clipboard.writeText(accNumber.replace(/[^0-9]/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const defaultWaUrl = `https://wa.me/${(config.contactPhone || '089508888778').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Halo Dev, kami dari ${config.clientName || 'PT. Pelayaran Baharimas Kalimantan'} ingin konfirmasi pembayaran perpanjangan lisensi Sistem PMS Kapal Baharimas untuk paket ${config.planName || 'Enterprise Maritime'}. Mohon informasinya.`
  )}`;

  const finalPaymentUrl = config.paymentUrl && config.paymentUrl.trim() ? config.paymentUrl : defaultWaUrl;

  return (
    <div
      className="modal-overlay no-print"
      style={{
        zIndex: 1100,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)'
      }}
      onClick={onClose}
    >
      <div
        className="glass-card subscription-payment-modal-card"
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: '1rem',
          padding: '0',
          borderRadius: '16px',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(245, 158, 11, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="subscription-payment-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)'
            }}>
              <CreditCard size={22} />
            </div>
            <div>
              <h3 className="subscription-payment-title">
                Rincian Tagihan & Lisensi Aplikasi
              </h3>
              <p className="subscription-payment-subtitle">
                Perpanjangan Masa Aktif Sistem Planned Maintenance System (PMS)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Tutup"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Status Alert Banner */}
          <div style={{
            padding: '1rem',
            borderRadius: '12px',
            background: statusInfo.isExpired
              ? 'rgba(239, 68, 68, 0.12)'
              : 'rgba(245, 158, 11, 0.12)',
            border: statusInfo.isExpired
              ? '1px solid rgba(239, 68, 68, 0.35)'
              : '1px solid rgba(245, 158, 11, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem'
          }}>
            <AlertTriangle
              size={24}
              color={statusInfo.isExpired ? '#ef4444' : '#f59e0b'}
              style={{ flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: statusInfo.isExpired ? '#fca5a5' : '#fde68a'
              }}>
                {statusInfo.badgeLabel}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.2rem', lineHeight: 1.5 }}>
                {statusInfo.isExpired
                  ? `Masa aktif telah jatuh tempo pada ${statusInfo.formattedDate}. Selesaikan pembayaran segera untuk mencegah pembatasan akses data operasional kapal.`
                  : `Masa aktif lisensi tersisa ${statusInfo.daysLeft} hari lagi (Jatuh tempo: ${statusInfo.formattedDate}). Harap segera proses perpanjangan.`}
              </div>
            </div>
          </div>

          {/* Rincian Paket & Biaya */}
          <div className="subscription-payment-box" style={{ borderRadius: '12px', padding: '1.1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <span className="subscription-metric-label">
                  Perusahaan Pelanggan
                </span>
                <div className="subscription-payment-box-text" style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                  <Building2 size={15} color="#0284c7" />
                  <span>{config.clientName || 'PT. Pelayaran Baharimas Kalimantan'}</span>
                </div>
              </div>

              <div>
                <span className="subscription-metric-label">
                  Paket Lisensi
                </span>
                <div className="subscription-payment-box-text" style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                  <Sparkles size={15} color="#d97706" />
                  <span>{config.planName || 'Enterprise Maritime Fleet'}</span>
                </div>
              </div>

              <div>
                <span className="subscription-metric-label">
                  Tanggal Jatuh Tempo
                </span>
                <div className="subscription-payment-box-text" style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                  <Calendar size={15} color="#10b981" />
                  <span>{statusInfo.formattedDate}</span>
                </div>
              </div>

              <div>
                <span className="subscription-metric-label">
                  Total Biaya Perpanjangan
                </span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284c7', marginTop: '0.2rem' }}>
                  {config.billingAmount || 'Rp 25.000.000 / Tahun'}
                </div>
              </div>
            </div>
          </div>

          {/* Kotak Rekening Pembayaran Resmi */}
          <div className="subscription-bank-container" style={{ borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="subscription-metric-label" style={{ fontWeight: 700 }}>
                Rekening Resmi Tujuan Transfer
              </span>
              <span style={{ fontSize: '0.7rem', background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                Terverifikasi Pengembang
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div className="subscription-bank-name" style={{ fontSize: '1rem', fontWeight: 800 }}>
                  {config.bankName || 'Bank Central Asia (BCA)'}
                </div>
                <div className="subscription-bank-acc" style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '0.08em', fontFamily: 'monospace', margin: '0.2rem 0' }}>
                  {config.bankAccount || '880-192-8391'}
                </div>
                <div className="subscription-bank-holder" style={{ fontSize: '0.8rem' }}>
                  Atas Nama: <strong>{config.bankAccountHolder || 'PT Bahari Digital Solusindo'}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyAccount}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.6rem 1.1rem',
                  borderRadius: '8px',
                  background: copied ? '#10b981' : '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Tersalin!' : 'Salin No. Rekening'}</span>
              </button>
            </div>
          </div>

          {/* Tombol Konfirmasi WhatsApp */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <a
              href={finalPaymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                padding: '0.85rem 1.5rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: '0.95rem',
                boxShadow: '0 8px 20px rgba(22, 163, 74, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <Phone size={18} />
              <span>Konfirmasi Pembayaran via WhatsApp ({config.contactPhone || '089508888778'})</span>
              <ExternalLink size={16} />
            </a>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={14} color="#10b981" />
                Aktivasi Lisensi Otomatis
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Mail size={14} color="#38bdf8" />
                {config.contactEmail || 'billing@baharimas.co.id'}
              </span>
            </div>
          </div>

          {/* Langkah Pembayaran */}
          <div style={{
            fontSize: '0.78rem',
            color: '#94a3b8',
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '0.85rem 1rem',
            borderRadius: '8px',
            border: '1px dashed rgba(255, 255, 255, 0.1)'
          }}>
            <strong style={{ color: '#e2e8f0', display: 'block', marginBottom: '0.35rem' }}>
              Alur Perpanjangan Cepat:
            </strong>
            1. Transfer sesuai nominal tagihan ke rekening resmi di atas.<br />
            2. Klik tombol WhatsApp untuk mengirimkan bukti transfer.<br />
            3. Pengembang akan langsung memperpanjang masa aktif aplikasi secara real-time via sistem kontrol lisensi.
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'flex-end',
          background: 'rgba(15, 23, 42, 0.6)'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              border: '1px solid #475569',
              background: '#334155',
              color: '#ffffff',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Tutup Dialog
          </button>
        </div>
      </div>
    </div>
  );
};
