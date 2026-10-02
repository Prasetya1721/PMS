import React from 'react';
import { X, ExternalLink, Settings } from 'lucide-react';
import { usePMS } from '../../context/PMSContext';
import { SubscriptionControlAdmin } from '../developer/SubscriptionControlAdmin';

export const SubscriptionDevModal = ({ isOpen, onClose }) => {
  const { setActiveTab, setDeveloperSubSection } = usePMS();

  if (!isOpen) return null;

  const handleOpenFullPage = () => {
    if (setDeveloperSubSection) {
      setDeveloperSubSection('subscription');
    }
    setActiveTab('developer_api');
    onClose();
  };

  return (
    <div
      className="modal-overlay no-print"
      style={{
        zIndex: 1200,
        backgroundColor: 'rgba(15, 23, 42, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        className="glass-card subscription-dev-modal-card"
        style={{
          width: '100%',
          maxWidth: '960px',
          maxHeight: '92vh',
          overflowY: 'auto',
          margin: '0.5rem',
          padding: '1.25rem',
          borderRadius: '16px',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(139, 92, 246, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
            }}>
              <Settings size={18} />
            </div>
            <div>
              <h3 className="subscription-dev-modal-title" style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>
                Panel Pengembang: Kontrol Langganan & Running Teks
              </h3>
              <span className="subscription-help-text" style={{ fontSize: '0.75rem', margin: 0 }}>
                Atur status masa aktif, running text tagihan di layar pengguna, dan sinkronisasi dari web lain
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleOpenFullPage}
              className="btn btn-secondary btn-sm"
              style={{
                fontSize: '0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title="Buka di halaman penuh modul Developer & API Keys"
            >
              <span>Halaman Penuh</span>
              <ExternalLink size={13} />
            </button>

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
              title="Tutup Modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Embedded SubscriptionControlAdmin */}
        <SubscriptionControlAdmin isModal={true} onCloseModal={onClose} />
      </div>
    </div>
  );
};
