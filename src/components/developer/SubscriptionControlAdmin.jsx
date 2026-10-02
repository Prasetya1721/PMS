import React, { useState, useEffect } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  CreditCard,
  Calendar,
  AlertTriangle,
  Clock,
  Save,
  RotateCcw,
  Sparkles,
  Globe,
  Link,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Terminal,
  Code2,
  Lock,
  Unlock,
  Radio,
  ExternalLink,
  ChevronRight,
  Shield,
  Eye
} from 'lucide-react';
import {
  getSubscriptionStatusInfo,
  formatSubscriptionTickerMessage,
  REMOTE_JSON_TEMPLATE
} from '../../services/subscriptionService';

export const SubscriptionControlAdmin = () => {
  const {
    subscriptionConfig,
    updateSubscriptionConfig,
    resetSubscriptionConfig,
    syncSubscriptionFromRemote,
    showToast,
    confirm
  } = usePMS();

  const [localConfig, setLocalConfig] = useState(() => ({
    ...subscriptionConfig,
    remoteControl: {
      ...(subscriptionConfig?.remoteControl || {})
    }
  }));

  const [activeSubTab, setActiveSubTab] = useState('status'); // 'status' | 'marquee' | 'billing' | 'remote'
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedSection, setCopiedSection] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  // Sync jika context diperbarui dari luar
  useEffect(() => {
    if (subscriptionConfig) {
      setLocalConfig({
        ...subscriptionConfig,
        remoteControl: {
          ...(subscriptionConfig.remoteControl || {})
        }
      });
    }
  }, [subscriptionConfig]);

  const statusInfo = getSubscriptionStatusInfo(localConfig);
  const previewMessage = formatSubscriptionTickerMessage(localConfig, statusInfo);

  const handleFieldChange = (field, value) => {
    setLocalConfig(prev => ({
      ...prev,
      [field]: value
    }));
    setIsSaved(false);
  };

  const handleRemoteFieldChange = (field, value) => {
    setLocalConfig(prev => ({
      ...prev,
      remoteControl: {
        ...(prev.remoteControl || {}),
        [field]: value
      }
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    updateSubscriptionConfig(localConfig);
    setIsSaved(true);
    showToast('Pengaturan lisensi & running text berhasil disimpan!', 'success');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = async () => {
    const isOk = await confirm({
      title: 'Reset Konfigurasi Langganan',
      message: 'Apakah Anda yakin ingin mengembalikan seluruh pengaturan lisensi dan kontrol running text ke bawaan awal?',
      confirmText: 'Ya, Reset',
      cancelText: 'Batal',
      type: 'warning'
    });
    if (isOk) {
      resetSubscriptionConfig();
    }
  };

  const handleTestRemoteSync = async () => {
    if (!localConfig.remoteControl?.syncUrl) {
      showToast('Masukkan URL Remote Sync terlebih dahulu', 'warning');
      return;
    }
    setIsSyncing(true);
    // Simpan localConfig dulu agar syncUrl tersimpan
    updateSubscriptionConfig(localConfig);
    const result = await syncSubscriptionFromRemote(localConfig.remoteControl.syncUrl);
    setIsSyncing(false);
  };

  const copyToClipboard = (text, sectionId) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    showToast('Teks berhasil disalin ke clipboard!', 'info');
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const insertVariableToken = (token) => {
    const current = localConfig.customMessage || '';
    setLocalConfig(prev => ({
      ...prev,
      customMessage: current + (current.endsWith(' ') || current.length === 0 ? '' : ' ') + token + ' '
    }));
  };

  // Contoh URL parameter quick link
  const sampleQuickLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://pms.baharimas.co.id'}?pms_sub_status=warning&pms_sub_expiry=${localConfig.expiryDate || '2026-10-31'}&pms_sub_force=true`;

  return (
    <div className="subscription-panel-container">
      {/* Header Panel */}
      <div className="glass-card subscription-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 6px 16px rgba(245, 158, 11, 0.35)'
            }}>
              <CreditCard size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                  Kontrol Lisensi, Tagihan & Running Teks
                </h3>
                <span style={{
                  fontSize: '0.7rem',
                  padding: '0.15rem 0.6rem',
                  borderRadius: '9999px',
                  background: 'rgba(139, 92, 246, 0.2)',
                  color: '#8b5cf6',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  fontWeight: 700
                }}>
                  Khusus Akun Developer
                </span>
              </div>
              <p className="subscription-help-text" style={{ margin: '0.25rem 0 0', fontSize: '0.825rem' }}>
                Kelola status masa aktif langganan aplikasi, running text peringatan tagihan di layar pengguna, dan sinkronisasi kontrol dari web lain.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
              title="Reset ke setelan bawaan"
            >
              <RotateCcw size={14} />
              <span>Reset Standar</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="btn btn-primary btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.825rem',
                background: isSaved ? '#16a34a' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                borderColor: '#d97706',
                fontWeight: 700
              }}
            >
              {isSaved ? <Check size={15} /> : <Save size={15} />}
              <span>{isSaved ? 'Tersimpan!' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </div>

        {/* Status Metrics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '1.25rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          {/* Card 1: Status Aktif */}
          <div className="subscription-metric-card">
            <div className="subscription-metric-label">
              Status Masa Aktif
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
              <span style={{
                fontSize: '0.825rem',
                fontWeight: 800,
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                background: statusInfo.isExpired
                  ? 'rgba(239, 68, 68, 0.2)'
                  : statusInfo.severity === 'warning'
                  ? 'rgba(245, 158, 11, 0.2)'
                  : 'rgba(37, 99, 235, 0.2)',
                color: statusInfo.isExpired ? '#dc2626' : statusInfo.severity === 'warning' ? '#d97706' : '#0284c7'
              }}>
                {statusInfo.badgeLabel}
              </span>
            </div>
          </div>

          {/* Card 2: Sisa Hari */}
          <div className="subscription-metric-card">
            <div className="subscription-metric-label">
              Perhitungan Sisa Hari
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, marginTop: '0.2rem', color: statusInfo.daysLeft <= 0 ? '#ef4444' : statusInfo.daysLeft <= 14 ? '#f59e0b' : '#10b981' }}>
              {statusInfo.daysLeft > 0 ? `${statusInfo.daysLeft} Hari Lagi` : statusInfo.daysLeft === 0 ? 'Hari Ini Habis' : `Habis (${Math.abs(statusInfo.daysLeft)} Hari Lalu)`}
            </div>
          </div>

          {/* Card 3: Tanggal Kedaluwarsa */}
          <div className="subscription-metric-card">
            <div className="subscription-metric-label">
              Tanggal Jatuh Tempo
            </div>
            <div className="subscription-metric-value">
              {statusInfo.formattedDate}
            </div>
          </div>

          {/* Card 4: Status Remote Web */}
          <div className="subscription-metric-card">
            <div className="subscription-metric-label">
              Kontrol Web Lain
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem' }}>
              <Globe size={15} color={localConfig.remoteControl?.syncUrl ? '#0284c7' : '#94a3b8'} />
              <span style={{ fontSize: '0.825rem', fontWeight: 700, color: localConfig.remoteControl?.lastSyncStatus === 'success' ? '#10b981' : localConfig.remoteControl?.syncUrl ? '#0284c7' : 'var(--text-muted)' }}>
                {localConfig.remoteControl?.lastSyncStatus === 'success' ? 'Tersinkron' : localConfig.remoteControl?.syncUrl ? 'URL Terpasang' : 'Belum Diatur'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Box */}
      <div className="glass-card subscription-subcard" style={{ padding: '1.25rem', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={16} color="#f59e0b" />
            <span className="subscription-section-heading" style={{ fontSize: '0.825rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pratinjau Langsung (Live Ticker Preview di Layar Pengguna)
            </span>
          </div>
          <span className="subscription-help-text" style={{ margin: 0 }}>
            Status Banner: <strong style={{ color: statusInfo.shouldShowRunningText ? '#10b981' : '#ef4444' }}>{statusInfo.shouldShowRunningText ? 'AKTIF MUNCUL' : 'TERSEMBUNYI'}</strong>
          </span>
        </div>

        {/* Ticker Preview Component */}
        <div style={{
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          overflow: 'hidden',
          background: 'rgba(0, 0, 0, 0.25)'
        }}>
          <div
            className={`subscription-marquee-container severity-${statusInfo.severity}`}
            style={{ margin: 0 }}
          >
            <div className="subscription-badge" style={{
              background: statusInfo.isExpired
                ? 'rgba(239, 68, 68, 0.95)'
                : statusInfo.severity === 'warning'
                ? 'rgba(217, 119, 6, 0.95)'
                : 'rgba(37, 99, 235, 0.95)',
              color: '#ffffff'
            }}>
              <AlertTriangle size={13} />
              <span>{statusInfo.badgeLabel}</span>
            </div>

            <div className="subscription-marquee-track">
              <div className="subscription-marquee-content">
                <span style={{ marginRight: '3rem' }}>{previewMessage}</span>
                <span style={{ marginRight: '3rem' }} aria-hidden="true">{previewMessage}</span>
              </div>
            </div>

            <div className="subscription-actions">
              <button type="button" className="subscription-btn-pay" style={{ pointerEvents: 'none' }}>
                <CreditCard size={13} />
                <span>{localConfig.paymentButtonText || 'Rincian Tagihan & Bayar'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'status', label: '1. Status & Masa Aktif', icon: Calendar },
          { id: 'marquee', label: '2. Teks Berjalan & Desain', icon: Sparkles },
          { id: 'billing', label: '3. Tagihan & Rekening Bank', icon: CreditCard },
          { id: 'remote', label: '4. Kontrol dari Web Lain (Remote)', icon: Globe }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`btn btn-sm subscription-nav-tab ${isActive ? 'active' : 'inactive'}`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Status & Masa Aktif */}
      {activeSubTab === 'status' && (
        <div className="glass-card subscription-subcard">
          <h4 className="subscription-section-heading">
            <Calendar size={18} />
            <span>Pengaturan Status & Tanggal Masa Aktif</span>
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Status Selector */}
            <div>
              <label className="subscription-form-label">
                Status Langganan Aplikasi
              </label>
              <select
                value={localConfig.status || 'active'}
                onChange={(e) => handleFieldChange('status', e.target.value)}
                className="input-control"
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                <option value="active">🟢 Aktif Normal (Tidak memicu running text jika belum mendekati batas)</option>
                <option value="warning">🟡 Segera Berakhir / Warning (Memicu running text amber)</option>
                <option value="expired">🔴 Telah Berakhir / Expired (Memicu running text merah darurat)</option>
                <option value="grace_period">🟠 Masa Tenggang / Grace Period</option>
              </select>
              <span className="subscription-help-text">
                Pilih status langganan. Jika memilih "Segera Berakhir" atau "Expired", running text otomatis muncul di atas aplikasi.
              </span>
            </div>

            {/* Tanggal Kedaluwarsa */}
            <div>
              <label className="subscription-form-label">
                Tanggal Jatuh Tempo Lisensi (Expiry Date)
              </label>
              <input
                type="date"
                value={localConfig.expiryDate || ''}
                onChange={(e) => handleFieldChange('expiryDate', e.target.value)}
                className="input-control"
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
              <span className="subscription-help-text">
                Sistem menghitung sisa hari secara otomatis setiap hari.
              </span>
            </div>

            {/* Ambang Batas Hari Peringatan */}
            <div>
              <label className="subscription-form-label">
                Ambang Batas Peringatan Otomatis (Hari Sebelum Habis)
              </label>
              <input
                type="number"
                min="1"
                max="90"
                value={localConfig.warningDaysThreshold ?? 14}
                onChange={(e) => handleFieldChange('warningDaysThreshold', parseInt(e.target.value) || 14)}
                className="input-control"
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
              <span className="subscription-help-text">
                Running text otomatis aktif jika sisa hari kurang dari atau sama dengan angka ini (bawaan: 14 hari).
              </span>
            </div>

            {/* Tombol Teks Bayar */}
            <div>
              <label className="subscription-form-label">
                Label Tombol Tindakan pada Banner
              </label>
              <input
                type="text"
                value={localConfig.paymentButtonText || ''}
                onChange={(e) => handleFieldChange('paymentButtonText', e.target.value)}
                placeholder="Rincian Tagihan & Bayar"
                className="input-control"
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
              <span className="subscription-help-text">
                Teks tombol aksi yang berada di sebelah kanan running text.
              </span>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="subscription-toggle-box">
            {/* Toggle 1: Paksa Tampilkan Running Text */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <input
                type="checkbox"
                id="forceShowRunningText"
                checked={Boolean(localConfig.forceShowRunningText)}
                onChange={(e) => handleFieldChange('forceShowRunningText', e.target.checked)}
                style={{ marginTop: '0.25rem', width: '18px', height: '18px', cursor: 'pointer', accentColor: '#f59e0b' }}
              />
              <div>
                <label htmlFor="forceShowRunningText" className="subscription-toggle-label">
                  Paksa Tampilkan Running Teks Sekarang (Force Show)
                </label>
                <p className="subscription-help-text">
                  Aktifkan ini untuk segera menampilkan running text di layar semua pengguna, terlepas dari tanggal kedaluwarsa atau sisa hari (sangat berguna untuk broadcast pengumuman tagihan atau pengujian).
                </p>
              </div>
            </div>

            {/* Toggle 2: Kunci Akses Sistem jika Expired */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <input
                type="checkbox"
                id="isLocked"
                checked={Boolean(localConfig.isLocked)}
                onChange={(e) => handleFieldChange('isLocked', e.target.checked)}
                style={{ marginTop: '0.25rem', width: '18px', height: '18px', cursor: 'pointer', accentColor: '#ef4444' }}
              />
              <div>
                <label htmlFor="isLocked" className="subscription-toggle-danger-label">
                  Kunci Akses Sistem (Lock Mode jika Expired)
                </label>
                <p className="subscription-help-text">
                  Jika diaktifkan dan status lisensi telah habis, layar pengguna non-developer akan menampilkan dialog pemblokiran akses hingga pembayaran dikonfirmasi. Akun Developer selalu memiliki akses bypass untuk memperbaiki lisensi.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Teks Berjalan & Desain */}
      {activeSubTab === 'marquee' && (
        <div className="glass-card subscription-subcard">
          <div>
            <h4 className="subscription-section-heading">
              <Sparkles size={18} />
              <span>Kustomisasi Pesan Running Teks</span>
            </h4>
            <p className="subscription-help-text">
              Tulis kalimat kustom yang akan berjalan di layar atau gunakan variabel dinamis di bawah. Kosongkan untuk menggunakan format cerdas maritim bawaan.
            </p>
          </div>

          {/* Variable Chips */}
          <div>
            <span className="subscription-form-label" style={{ marginBottom: '0.35rem' }}>
              Klik Variabel untuk Menyisipkan ke Pesan:
            </span>
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              {[
                { token: '{daysLeft}', desc: 'Sisa hari (cth: 13)' },
                { token: '{expiryDate}', desc: 'Tanggal jatuh tempo (cth: 15 Okt 2026)' },
                { token: '{clientName}', desc: 'Nama perusahaan klien' },
                { token: '{planName}', desc: 'Nama paket lisensi' },
                { token: '{amount}', desc: 'Nominal tagihan biaya' },
                { token: '{bankInfo}', desc: 'Nama bank & no rekening' }
              ].map(item => (
                <button
                  key={item.token}
                  type="button"
                  onClick={() => insertVariableToken(item.token)}
                  className="subscription-token-btn"
                  title={item.desc}
                >
                  {item.token}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea Template */}
          <div>
            <label className="subscription-form-label">
              Template Teks Berjalan Kustom
            </label>
            <textarea
              rows={4}
              value={localConfig.customMessage || ''}
              onChange={(e) => handleFieldChange('customMessage', e.target.value)}
              placeholder="Contoh: ⚠️ PEMBERITAHUAN MASA BERLANGGANAN: Lisensi Sistem PMS Kapal Baharimas tersisa {daysLeft} hari lagi (Jatuh tempo: {expiryDate}). Mohon segera menyelesaikan pembayaran biaya langganan agar operasional armada tetap terhubung..."
              className="input-control"
              style={{ width: '100%', fontSize: '0.85rem', lineHeight: 1.5 }}
            />
            <span className="subscription-help-text">
              *Tip: Biarkan kosong jika ingin sistem menyusun kalimat peringatan resmi secara otomatis berdasarkan sisa hari dan status kedaluwarsa.
            </span>
          </div>
        </div>
      )}

      {/* Tab 3: Tagihan & Rekening Bank */}
      {activeSubTab === 'billing' && (
        <div className="glass-card subscription-subcard">
          <div>
            <h4 className="subscription-section-heading">
              <CreditCard size={18} />
              <span>Informasi Paket, Rekening Pembayaran & Kontak</span>
            </h4>
            <p className="subscription-help-text">
              Data ini ditampilkan di dalam pop-up modal "Rincian Tagihan & Bayar" yang dibuka oleh staf keuangan atau manajemen kapal.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label className="subscription-form-label">
                Nama Perusahaan Klien
              </label>
              <input
                type="text"
                value={localConfig.clientName || ''}
                onChange={(e) => handleFieldChange('clientName', e.target.value)}
                placeholder="PT. Pelayaran Baharimas Kalimantan"
                className="input-control"
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label className="subscription-form-label">
                Nama Paket Lisensi
              </label>
              <input
                type="text"
                value={localConfig.planName || ''}
                onChange={(e) => handleFieldChange('planName', e.target.value)}
                placeholder="Enterprise Maritime Fleet License (Baharimas PMS)"
                className="input-control"
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label className="subscription-form-label">
                Nominal Tagihan / Biaya
              </label>
              <input
                type="text"
                value={localConfig.billingAmount || ''}
                onChange={(e) => handleFieldChange('billingAmount', e.target.value)}
                placeholder="Rp 25.000.000 / Tahun"
                className="input-control"
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label className="subscription-form-label">
                Nama Bank Penerima
              </label>
              <input
                type="text"
                value={localConfig.bankName || ''}
                onChange={(e) => handleFieldChange('bankName', e.target.value)}
                placeholder="Bank Central Asia (BCA)"
                className="input-control"
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label className="subscription-form-label">
                Nomor Rekening Tujuan
              </label>
              <input
                type="text"
                value={localConfig.bankAccount || ''}
                onChange={(e) => handleFieldChange('bankAccount', e.target.value)}
                placeholder="880-192-8391"
                className="input-control"
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label className="subscription-form-label">
                Nama Pemilik Rekening (Atas Nama)
              </label>
              <input
                type="text"
                value={localConfig.bankAccountHolder || ''}
                onChange={(e) => handleFieldChange('bankAccountHolder', e.target.value)}
                placeholder="PT Bahari Digital Solusindo"
                className="input-control"
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label className="subscription-form-label">
                Nomor WhatsApp Konfirmasi (Format: 08... / 628...)
              </label>
              <input
                type="text"
                value={localConfig.contactPhone || ''}
                onChange={(e) => handleFieldChange('contactPhone', e.target.value)}
                placeholder="089508888778"
                className="input-control"
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label className="subscription-form-label">
                Email Billing / Finance Support
              </label>
              <input
                type="email"
                value={localConfig.contactEmail || ''}
                onChange={(e) => handleFieldChange('contactEmail', e.target.value)}
                placeholder="billing@baharimas.co.id"
                className="input-control"
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Kontrol dari Web Lain (Remote Control & Webhook) */}
      {activeSubTab === 'remote' && (
        <div className="glass-card subscription-subcard">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={20} color="#0284c7" />
              <h4 className="subscription-section-heading">
                Koneksi Kontrol dari Web Lain (Remote Web Controller)
              </h4>
            </div>
            <p className="subscription-help-text" style={{ lineHeight: 1.5 }}>
              Anda dapat mengendalikan status aktif, masa tenggang, tanggal kedaluwarsa, atau memunculkan running text secara terpusat dari website pengembang Anda (seperti portal billing, server backend, GitHub Gist, Cloudflare Worker, Google Apps Script, atau WordPress).
            </p>
          </div>

          {/* Form Endpoint Sinkronisasi */}
          <div className="subscription-subcard" style={{ padding: '1.25rem', gap: '1rem' }}>
            <div>
              <label className="subscription-form-label">
                URL Endpoint Web Lain (Remote JSON Sync URL)
              </label>
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <input
                  type="url"
                  value={localConfig.remoteControl?.syncUrl || ''}
                  onChange={(e) => handleRemoteFieldChange('syncUrl', e.target.value)}
                  placeholder="https://billing-portal.example.com/api/pms-status.json"
                  className="input-control"
                  style={{ flex: 1, minWidth: '280px', fontSize: '0.85rem', fontFamily: 'monospace' }}
                />
                <button
                  type="button"
                  onClick={handleTestRemoteSync}
                  disabled={isSyncing}
                  className="btn btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    background: '#0284c7',
                    borderColor: '#0284c7',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <RefreshCw size={14} className={isSyncing ? 'pulse-icon' : ''} />
                  <span>{isSyncing ? 'Menghubungkan...' : '🔄 Uji Tarik Data Web Lain'}</span>
                </button>
              </div>
              <span className="subscription-help-text">
                Sistem PMS akan otomatis mengambil data status lisensi dari URL ini setiap kali aplikasi dibuka atau saat tombol di atas diklik.
              </span>
            </div>

            {/* Secret Key Verifikasi */}
            <div style={{ maxWidth: '420px' }}>
              <label className="subscription-form-label">
                Kunci Rahasia (Secret Key untuk Header X-Secret-Key)
              </label>
              <input
                type="text"
                value={localConfig.remoteControl?.secretKey || 'pms_sub_sec_88921a'}
                onChange={(e) => handleRemoteFieldChange('secretKey', e.target.value)}
                className="input-control"
                style={{ width: '100%', fontSize: '0.85rem', fontFamily: 'monospace' }}
              />
            </div>

            {/* Status Sinkronisasi Terakhir */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="subscription-help-text" style={{ margin: 0 }}>Status Terakhir:</span>
                <strong style={{
                  color: localConfig.remoteControl?.lastSyncStatus === 'success'
                    ? '#10b981'
                    : localConfig.remoteControl?.lastSyncStatus === 'error'
                    ? '#ef4444'
                    : '#94a3b8'
                }}>
                  {localConfig.remoteControl?.lastSyncStatus === 'success'
                    ? '🟢 BERHASIL TERSAMBUNG'
                    : localConfig.remoteControl?.lastSyncStatus === 'error'
                    ? '🔴 GAGAL KONEKSI'
                    : '⚪ BELUM PERNAH SYNC'}
                </strong>
                {localConfig.remoteControl?.lastSyncMessage && (
                  <span className="subscription-help-text" style={{ margin: 0 }}>({localConfig.remoteControl.lastSyncMessage})</span>
                )}
              </div>
              <div className="subscription-help-text" style={{ margin: 0, fontSize: '0.72rem' }}>
                {localConfig.remoteControl?.lastSyncTime
                  ? `Waktu: ${new Date(localConfig.remoteControl.lastSyncTime).toLocaleTimeString('id-ID')} WIB`
                  : 'Belum ada waktu'}
              </div>
            </div>
          </div>

          {/* Panduan Integrasi 3 Cara Kontrol dari Web Lain */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h5 className="subscription-section-heading" style={{ fontSize: '0.875rem' }}>
              Panduan 3 Cara Mengontrol Status Lisensi & Running Teks dari Web Lain:
            </h5>

            {/* Metode 1: Host File JSON di Web Developer */}
            <div className="subscription-guide-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.825rem', color: '#0284c7' }}>
                  Metode 1: Host File JSON di Website Pengembang (Paling Praktis)
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(JSON.stringify(REMOTE_JSON_TEMPLATE, null, 2), 'json_template')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  {copiedSection === 'json_template' ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedSection === 'json_template' ? 'Tersalin' : 'Salin JSON Template'}</span>
                </button>
              </div>
              <p className="subscription-help-text" style={{ margin: '0 0 0.65rem 0' }}>
                Buat file JSON (misal <code className="mono">pms-license.json</code>) pada server web Anda atau GitHub Gist. Saat Anda ingin mematikan/menghidupkan running text, cukup ubah nilai <code className="mono">"status"</code> atau <code className="mono">"forceShowRunningText"</code> di file tersebut:
              </p>
              <pre style={{
                background: '#0f172a',
                padding: '0.85rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                overflowX: 'auto',
                color: '#7dd3fc',
                margin: 0
              }}>
                {JSON.stringify(REMOTE_JSON_TEMPLATE, null, 2)}
              </pre>
            </div>

            {/* Metode 2: Link URL Langsung (One-Click URL Query Param) */}
            <div className="subscription-guide-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.825rem', color: '#059669' }}>
                  Metode 2: Kontrol via Parameter URL Langsung (Instant One-Click Link)
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(sampleQuickLink, 'quick_link')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  {copiedSection === 'quick_link' ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedSection === 'quick_link' ? 'Tersalin' : 'Salin Link Kontrol'}</span>
                </button>
              </div>
              <p className="subscription-help-text" style={{ margin: '0 0 0.65rem 0' }}>
                Anda bisa menaruh link tombol di portal admin web lain yang langsung memperbarui status aplikasi PMS saat diklik:
              </p>
              <div style={{
                background: '#0f172a',
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                color: '#86efac',
                wordBreak: 'break-all'
              }}>
                {sampleQuickLink}
              </div>
            </div>

            {/* Metode 3: PostMessage API untuk Iframe / Cross-Window */}
            <div className="subscription-guide-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.825rem', color: '#7c3aed' }}>
                  Metode 3: Script Cross-Window / PostMessage (Iframe & Child Window)
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(`pmsWindow.postMessage({\n  type: 'PMS_REMOTE_SUBSCRIPTION_UPDATE',\n  secretKey: '${localConfig.remoteControl?.secretKey || 'pms_sub_sec_88921a'}',\n  payload: {\n    status: 'warning',\n    expiryDate: '2026-10-31',\n    forceShowRunningText: true\n  }\n}, '*');`, 'post_message')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  {copiedSection === 'post_message' ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedSection === 'post_message' ? 'Tersalin' : 'Salin Snippet'}</span>
                </button>
              </div>
              <p className="subscription-help-text" style={{ margin: '0 0 0.65rem 0' }}>
                Jika aplikasi PMS di-embed di dashboard developer via iframe atau dibuka melalui <code className="mono">window.open()</code>, jalankan baris JavaScript berikut dari web Anda:
              </p>
              <pre style={{
                background: '#0f172a',
                padding: '0.85rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                overflowX: 'auto',
                color: '#e9d5ff',
                margin: 0
              }}>
{`pmsWindow.postMessage({
  type: 'PMS_REMOTE_SUBSCRIPTION_UPDATE',
  secretKey: '${localConfig.remoteControl?.secretKey || 'pms_sub_sec_88921a'}',
  payload: {
    status: 'warning',
    expiryDate: '2026-10-31',
    forceShowRunningText: true
  }
}, '*');`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
