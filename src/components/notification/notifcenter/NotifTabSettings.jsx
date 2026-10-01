/**
 * NotifTabSettings.jsx
 * Sumber: Tab 3: pengaturan ambang, auto-send, jam kirim
 */
import React from 'react';
import { KeyRound, Terminal } from 'lucide-react';
import { usePMS } from '../../../context/PMSContext';
import { NotifPresetCard } from './settings/NotifPresetCard';
import { NotifCustomThresholdCard } from './settings/NotifCustomThresholdCard';
import { NotifAutoSendCard } from './settings/NotifAutoSendCard';

export const NotifTabSettings = ({
  currentTimeStr,
  emailGatewayTesting,
  gatewayTesting,
  handleAddCustomThresholdSubmit,
  handleRequestBrowserNotification,
  handleTestEmailGatewayPing,
  handleTestGatewayPing,
  newCustDays,
  newCustDesc,
  newCustLabel,
  notificationSettings,
  removeCustomThreshold,
  setNewCustDays,
  setNewCustDesc,
  setNewCustLabel,
  setTestScheduleTimeNowPlusOneMinute,
  toggleThresholdActive,
  toggleThresholdChannel,
  updateAutoSendConfig,
}) => {
  const { setActiveTab } = usePMS();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem' }}>
      {/* Left Column: Presets & Custom Thresholds */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Preset Thresholds */}
        <NotifPresetCard
          notificationSettings={notificationSettings}
          toggleThresholdActive={toggleThresholdActive}
          toggleThresholdChannel={toggleThresholdChannel}
        />

        {/* Custom Thresholds Section */}
        <NotifCustomThresholdCard
          handleAddCustomThresholdSubmit={handleAddCustomThresholdSubmit}
          newCustDays={newCustDays}
          newCustDesc={newCustDesc}
          newCustLabel={newCustLabel}
          notificationSettings={notificationSettings}
          removeCustomThreshold={removeCustomThreshold}
          setNewCustDays={setNewCustDays}
          setNewCustDesc={setNewCustDesc}
          setNewCustLabel={setNewCustLabel}
          toggleThresholdActive={toggleThresholdActive}
          toggleThresholdChannel={toggleThresholdChannel}
        />
      </div>

      {/* Right Column: Auto-Send Engine & Jam Pengiriman */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Auto-Send Engine Settings */}
        <NotifAutoSendCard
          currentTimeStr={currentTimeStr}
          handleRequestBrowserNotification={handleRequestBrowserNotification}
          notificationSettings={notificationSettings}
          setTestScheduleTimeNowPlusOneMinute={setTestScheduleTimeNowPlusOneMinute}
          updateAutoSendConfig={updateAutoSendConfig}
        />

        {/* Info Box: Konfigurasi API Gateway dipusatkan di Menu Developer */}
        <div className="glass-card" style={{
          padding: '1.25rem',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(2, 132, 199, 0.06))',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#a78bfa',
              flexShrink: 0
            }}>
              <Terminal size={16} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700 }}>
                Konfigurasi Gateway Terpusat di Menu Developer
              </h4>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Pengaturan API Token, endpoint URL, dan uji koneksi untuk WhatsApp & Email Gateway kini dikelola terpusat di menu <strong>Developer & API Keys</strong>.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('developer_api')}
            className="btn btn-secondary btn-sm"
            style={{
              alignSelf: 'flex-start',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#a78bfa',
              borderColor: 'rgba(139, 92, 246, 0.3)'
            }}
          >
            <KeyRound size={13} />
            <span>Buka Konfigurasi Developer & API Keys</span>
          </button>
        </div>
      </div>
    </div>
  );
};
