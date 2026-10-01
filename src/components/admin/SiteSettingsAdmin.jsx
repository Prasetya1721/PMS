import React, { useState, useRef } from 'react';
import { usePMS } from '../../context/PMSContext';
import { SiteSettingsHeader } from './sitesettings/SiteSettingsHeader';
import { SiteSettingsNavTabs } from './sitesettings/SiteSettingsNavTabs';
import { SiteSettingsPreview } from './sitesettings/SiteSettingsPreview';
import { TabBackground } from './sitesettings/TabBackground';
import { TabBranding } from './sitesettings/TabBranding';
import { TabForm } from './sitesettings/TabForm';
import { TabDev } from './sitesettings/TabDev';
import { BaharimasEmblem } from '../common/BaharimasLogo';
import {
  Palette,
  Layout,
  Sliders,
  RotateCcw,
  Save,
  Check,
  Sparkles,
  Target,
  Image as ImageIcon,
  Lock,
  Mail,
  Eye,
  Shield,
  Copy,
  RefreshCw,
  Upload,
  MapPin,
  ChevronRight
} from 'lucide-react';

/**
 * Compress image using HTML5 Canvas to safely store in localStorage
 */
const compressImage = (file, maxWidth = 1600, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const SiteSettingsAdmin = () => {
  const {
    siteConfig,
    updateSiteConfig,
    resetSiteConfig,
    canAction,
    showToast,
    confirm,
    setActiveTab: setNavTab
  } = usePMS();

  const [activeTab, setActiveTab] = useState('background');
  const [formData, setFormData] = useState({ ...siteConfig });
  const [isSaved, setIsSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const wallpaperInputRef = useRef(null);
  const logoInputRef = useRef(null);

  // Sync state if siteConfig changes from outside
  React.useEffect(() => {
    setFormData({ ...siteConfig });
  }, [siteConfig]);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = async (e, fieldKey) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const compressedUrl = await compressImage(file);
      handleChange(fieldKey, compressedUrl);
      if (fieldKey === 'wallpaperUrl') {
        handleChange('bgType', 'wallpaper');
      }
      showToast('Gambar berhasil diunggah dan langsung diterapkan!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal memproses gambar. Gunakan gambar berformat JPG atau PNG.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    updateSiteConfig(formData);
    setIsSaved(true);
    showToast('Konfigurasi CMS tampilan login berhasil disimpan!', 'success');
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleResetBaharimas = async () => {
    const lanjut = await confirm({
      variant: 'reset',
      title: 'Kembalikan ke Standar Baharimas',
      subtitle: 'Konfigurasi CMS tampilan login',
      message: 'Kembalikan konfigurasi login & branding ke Standar PT. Pelayaran Baharimas Kalimantan?',
      confirmLabel: 'Kembalikan'
    });
    if (lanjut) {
      resetSiteConfig();
      setFormData({
        bgType: 'wallpaper',
        solidColor: '#0c1a30',
        gradientFrom: '#0c1a30',
        gradientVia: '#0f2942',
        gradientTo: '#060d19',
        gradientDirection: 'to bottom right',
        wallpaperUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
        wallpaperBlur: 0,
        wallpaperOverlay: 40,
        glowBlobs: true,
        glowColor1: 'rgba(2, 132, 199, 0.25)',
        glowColor2: 'rgba(6, 182, 212, 0.2)',
        textColorTheme: 'light',
        logoMode: 'baharimas',
        customLogoUrl: '',
        companyBadge: 'MARITIME FLEET MANAGEMENT SYSTEM',
        systemTitle: 'PT PELAYARAN BAHARIMAS KALIMANTAN',
        companySubtitle: 'Fleet Management & Marine Shipping Lines',
        portalDescription: 'Pusat sistem digital operasional armada kapal tunda (tugboat), tongkang, dan kapal kargo niaga perairan Kalimantan Barat dan jalur pelayaran Nusantara.',
        officeAddress: 'Jl. Adi Sucipto KM 6, Kompleks Bahari Permai No. 2, RT. 004 / RW. 004, Desa Sungai Raya, Kec. Sungai Raya, Kab. Kubu Raya - Pontianak, Kalimantan Barat',
        officePhone: '(0561) 531016 / 732194',
        officeEmail: 'pt.baharimas@hotmail.com',
        formCardStyle: 'dark_glass',
        formTitle: 'Masuk ke Portal PMS',
        formSubtitle: 'Gunakan akun korporat PT. Pelayaran Baharimas Kalimantan',
        usernamePlaceholder: 'admin@baharimas.co.id',
        passwordPlaceholder: 'Kata sandi akun...',
        buttonText: 'Masuk ke Sistem PMS →',
        showQuickLogin: true,
        quickLoginLabel: '⚡ Akses Cepat Demo (Klik Akun):',
        quickAccounts: [
          { name: 'Capt. Robert Sitorus', role: 'Super Admin', email: 'admin@baharimas.co.id' },
          { name: 'Ir. H. Gunawan', role: 'Fleet Manager', email: 'fleet.ops@baharimas.co.id' },
          { name: 'Capt. Hendra Gunawan', role: 'Admin Kapal / Nakhoda', email: 'nakhoda@baharimas.co.id' },
          { name: 'Ir. Bambang Wijaya (KKM)', role: 'Teknisi / Chief Engineer', email: 'kkm@baharimas.co.id' },
          { name: 'Suryadi Pratama', role: 'Crew / ABK', email: 'abk@baharimas.co.id' },
          { name: 'Siti Rahmawati', role: 'HR / Personalia', email: 'hr@baharimas.co.id' }
        ],
        formFooterNotice: '🔒 Portal Resmi PT. Pelayaran Baharimas Kalimantan • ISM Code Compliant',
        footerText: '© 2026 PT. Pelayaran Baharimas Kalimantan • All Rights Reserved'
      });
      showToast('Konfigurasi dikembalikan ke default Baharimas.', 'info');
    }
  };

  // Theme check: Is Light Mode or Dark Mode?
  const isLight = formData.textColorTheme === 'light';

  // Dynamic Background computation
  const getPreviewBackground = () => {
    const type = formData.bgType || 'wallpaper';
    if (type === 'solid') {
      return { backgroundColor: formData.solidColor || (isLight ? '#f8fafc' : '#0c1a30') };
    }
    if (type === 'gradasi') {
      const dir = formData.gradientDirection || 'to bottom right';
      return {
        backgroundImage: `linear-gradient(${dir}, ${formData.gradientFrom || (isLight ? '#f8fafc' : '#0c1a30')}, ${formData.gradientVia || (isLight ? '#e0f2fe' : '#0f2942')}, ${formData.gradientTo || (isLight ? '#f1f5f9' : '#060d19')})`
      };
    }
    if (type === 'wallpaper') {
      const overlayVal = (formData.wallpaperOverlay ?? 40) / 100;
      const imgUrl = formData.wallpaperUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80';
      const lightOpacity = Math.max(0.78, Math.min(0.96, 0.70 + (overlayVal * 0.26)));
      const darkOpacity = Math.max(0.40, Math.min(0.90, 0.35 + (overlayVal * 0.45)));
      const overlayColor = isLight ? `rgba(248, 250, 252, ${lightOpacity})` : `rgba(6, 13, 25, ${darkOpacity})`;
      return {
        backgroundImage: `linear-gradient(${overlayColor}, ${overlayColor}), url("${imgUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    // Bawaan
    if (isLight) {
      return {
        backgroundColor: '#f1f5f9',
        backgroundImage: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 40%, #f8fafc 100%)'
      };
    }
    return {
      backgroundImage: 'radial-gradient(ellipse at top, #0c1a30 0%, #060d19 100%)'
    };
  };

  const demoUsersList = formData.quickAccounts && formData.quickAccounts.length > 0
    ? formData.quickAccounts
    : [
        { name: 'Capt. Robert Sitorus', role: 'Super Admin' },
        { name: 'Ir. H. Gunawan', role: 'Fleet Manager' },
        { name: 'Capt. Hendra Gunawan', role: 'Admin Kapal / Nakhoda' },
        { name: 'Ir. Bambang Wijaya (KKM)', role: 'Teknisi / Chief Engineer' },
        { name: 'Suryadi Pratama', role: 'Crew / ABK' },
        { name: 'Siti Rahmawati', role: 'HR / Personalia' }
      ];

  // Dynamic card styling based on formCardStyle and isLight
  const isGlass = formData.formCardStyle === 'dark_glass';
  const cardBackground = isLight
    ? (isGlass ? 'rgba(255, 255, 255, 0.92)' : '#ffffff')
    : (isGlass ? 'rgba(12, 21, 38, 0.85)' : '#0c1a30');
  const cardBorder = isLight
    ? (isGlass ? '1px solid rgba(255, 255, 255, 0.85)' : '1px solid #cbd5e1')
    : (isGlass ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid #1e293b');
  const cardBackdrop = isGlass ? 'blur(16px)' : 'none';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Top Header */}
      <SiteSettingsHeader
        canAction={canAction}
        handleResetBaharimas={handleResetBaharimas}
        handleSave={handleSave}
        isSaved={isSaved}
        setNavTab={setNavTab}
      />

      {/* Main 2-Column Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(460px, 1.05fr) minmax(500px, 1.35fr)',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Settings Tabs & Controls */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          {/* Navigation Tabs Header: 4 Columns Grid (NO OVERFLOW SCROLL, 100% VISIBLE) */}
          <SiteSettingsNavTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Tab Content Area */}
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* TAB 1: LATAR BELAKANG */}
            {(activeTab === 'background') && (
              <TabBackground
                formData={formData}
                handleChange={handleChange}
                handleFileUpload={handleFileUpload}
                isLight={isLight}
                isUploading={isUploading}
                setFormData={setFormData}
                wallpaperInputRef={wallpaperInputRef}
              />
            )}

            {/* TAB 2: PANEL KIRI (BRANDING) */}
            {(activeTab === 'branding') && (
              <TabBranding
                formData={formData}
                handleChange={handleChange}
                handleFileUpload={handleFileUpload}
                logoInputRef={logoInputRef}
              />
            )}

            {/* TAB 3: PANEL KANAN (FORM) */}
            {(activeTab === 'form') && (
              <TabForm
                formData={formData}
                handleChange={handleChange}
              />
            )}

            {/* TAB 4: ALAT DEV */}
            {(activeTab === 'dev') && (
              <TabDev
                formData={formData}
                showToast={showToast}
              />
            )}
          </div>
        </div>

        {/* Right Column: Live Preview Mockup Halaman Login DYNAMICALLY RESPONSIVE TO CONTRAST & BACKGROUND */}
        <SiteSettingsPreview
          cardBackdrop={cardBackdrop}
          cardBackground={cardBackground}
          cardBorder={cardBorder}
          demoUsersList={demoUsersList}
          formData={formData}
          getPreviewBackground={getPreviewBackground}
          isLight={isLight}
        />
      </div>
    </div>
  );
};
