/**
 * NotifTabSettings.jsx
 * Diekstrak dari NotificationCenter.jsx (baris 996-1629).
 * Sumber: Tab 3: pengaturan ambang, auto-send, jam kirim
 */
import React from 'react';
import { Mail, Plus, Smartphone, Trash2, Zap } from 'lucide-react';
import { NotifPresetCard } from './settings/NotifPresetCard';
import { NotifCustomThresholdCard } from './settings/NotifCustomThresholdCard';
import { NotifAutoSendCard } from './settings/NotifAutoSendCard';
import { NotifWhatsAppConnectorCard } from './settings/NotifWhatsAppConnectorCard';
import { NotifEmailConnectorCard } from './settings/NotifEmailConnectorCard';

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

              {/* Right Column: Auto-Send Engine & Jam Pengiriman & WhatsApp Gateway */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Auto-Send Engine Settings */}
                <NotifAutoSendCard
                  currentTimeStr={currentTimeStr}
                  handleRequestBrowserNotification={handleRequestBrowserNotification}
                  notificationSettings={notificationSettings}
                  setTestScheduleTimeNowPlusOneMinute={setTestScheduleTimeNowPlusOneMinute}
                  updateAutoSendConfig={updateAutoSendConfig}
                />

                {/* WhatsApp Gateway API Configuration */}
                <NotifWhatsAppConnectorCard
                  gatewayTesting={gatewayTesting}
                  handleTestGatewayPing={handleTestGatewayPing}
                  notificationSettings={notificationSettings}
                  updateAutoSendConfig={updateAutoSendConfig}
                />

                {/* Email Gateway API & SMTP Configuration */}
                <NotifEmailConnectorCard
                  emailGatewayTesting={emailGatewayTesting}
                  handleTestEmailGatewayPing={handleTestEmailGatewayPing}
                  notificationSettings={notificationSettings}
                  updateAutoSendConfig={updateAutoSendConfig}
                />
              </div>
            </div>
  );
};
