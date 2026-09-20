import React, { useState, useRef } from 'react';
import { usePMS } from '../../context/PMSContext';
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
    showToast,
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

  const handleResetBaharimas = () => {
    if (window.confirm('Kembalikan konfigurasi login & branding ke Standar PT. Pelayaran Baharimas Kalimantan?')) {
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
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '1.25rem 1.75rem',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(99, 102, 241, 0.35)'
          }}>
            <Palette size={26} color="#ffffff" />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#0f172a',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              CMS Tampilan Login & Latar Belakang (Developer)
            </h1>
            <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
              Atur branding panel, logo, formulir, teks, dan desain latar belakang layar login secara langsung.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Quick link button to separate Sidebar Management */}
          <button
            type="button"
            onClick={() => setNavTab('sidebar_management')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              background: '#eff6ff',
              color: '#1d4ed8',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#dbeafe'}
            onMouseLeave={e => e.currentTarget.style.background = '#eff6ff'}
            title="Buka Halaman Terpisah Manajemen Hak Akses Sidebar"
          >
            <Shield size={15} />
            <span>Manajemen Sidebar →</span>
          </button>

          <button
            type="button"
            onClick={handleResetBaharimas}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
          >
            <RotateCcw size={15} />
            <span>Reset Standar Baharimas</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: isSaved ? '#16a34a' : '#1e3a8a',
              color: '#ffffff',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            {isSaved ? <Check size={16} /> : <Save size={16} />}
            <span>{isSaved ? 'Tersimpan!' : 'Simpan Konfigurasi'}</span>
          </button>
        </div>
      </div>

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
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            borderBottom: '1px solid #e2e8f0',
            background: '#f8fafc',
            padding: '0.35rem',
            gap: '0.35rem'
          }}>
            {[
              { id: 'background', label: 'Latar Belakang', icon: Palette },
              { id: 'branding', label: 'Panel Kiri (Branding)', icon: Layout },
              { id: 'form', label: 'Panel Kanan (Form)', icon: Sliders },
              { id: 'dev', label: 'Alat Dev', icon: RefreshCw },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                    padding: '0.65rem 0.35rem',
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#1d4ed8' : '#64748b',
                    background: isActive ? '#ffffff' : 'transparent',
                    borderRadius: '8px',
                    border: isActive ? '1px solid #cbd5e1' : '1px solid transparent',
                    boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={16} color={isActive ? '#1d4ed8' : '#94a3b8'} />
                  <span style={{ lineHeight: 1.2 }}>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Area */}
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* TAB 1: LATAR BELAKANG */}
            {activeTab === 'background' && (
              <>
                {/* Tipe Latar Belakang Section */}
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#334155',
                    marginBottom: '0.75rem'
                  }}>
                    <span>🎨 Tipe Latar Belakang</span>
                  </label>

                  {/* 4 Cards Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '0.65rem'
                  }}>
                    {[
                      { id: 'bawaan', label: 'Bawaan Baharimas', icon: Sparkles, iconColor: '#f59e0b' },
                      { id: 'solid', label: 'Warna Solid', icon: Target, iconColor: '#ec4899' },
                      { id: 'gradasi', label: 'Gradasi', icon: Palette, iconColor: '#3b82f6' },
                      { id: 'wallpaper', label: 'Wallpaper', icon: ImageIcon, iconColor: '#10b981' }
                    ].map(card => {
                      const Icon = card.icon;
                      const isSelected = (formData.bgType || 'wallpaper') === card.id;
                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => handleChange('bgType', card.id)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.85rem 0.5rem',
                            borderRadius: '10px',
                            border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                            background: isSelected ? '#eff6ff' : '#f8fafc',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            textAlign: 'center'
                          }}
                        >
                          <Icon size={20} color={card.iconColor} />
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: isSelected ? 700 : 500,
                            color: isSelected ? '#1e40af' : '#475569'
                          }}>
                            {card.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sub-controls depending on bgType */}
                {formData.bgType === 'wallpaper' && (
                  <div style={{
                    background: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem'
                  }}>
                    {/* Header with Upload button */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                        URL Gambar Latar Belakang (Wallpaper):
                      </label>
                      <div>
                        <input
                          ref={wallpaperInputRef}
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileUpload(e, 'wallpaperUrl')}
                        />
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() => wallpaperInputRef.current?.click()}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.4rem 0.85rem',
                            borderRadius: '6px',
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            color: '#1d4ed8',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: isUploading ? 'wait' : 'pointer'
                          }}
                        >
                          <Upload size={14} />
                          <span>{isUploading ? 'Memproses...' : 'Unggah Gambar dari Komputer'}</span>
                        </button>
                      </div>
                    </div>

                    {/* URL Input */}
                    <input
                      type="text"
                      value={formData.wallpaperUrl || ''}
                      onChange={e => handleChange('wallpaperUrl', e.target.value)}
                      placeholder="https://images.unsplash.com/... atau unggah file di atas"
                      className="input-control"
                      style={{
                        fontSize: '0.825rem',
                        padding: '0.65rem 0.85rem',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px'
                      }}
                    />

                    {/* Preset Wallpaper Thumbnails */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Preset Gambar:</span>
                      {[
                        { label: '🚢 Tugboat Baharimas', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80' },
                        { label: '🌊 Samudra Biru', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1600&q=80' },
                        { label: '⚓ Pelabuhan Pontianak', url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80' }
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleChange('wallpaperUrl', preset.url)}
                          style={{
                            fontSize: '0.72rem',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '6px',
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            color: '#334155',
                            cursor: 'pointer'
                          }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Slider Kegelapan Overlay */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.25rem' }}>
                      <label style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600, minWidth: '120px' }}>
                        Kegelapan Overlay:
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="90"
                        value={formData.wallpaperOverlay ?? 40}
                        onChange={e => handleChange('wallpaperOverlay', Number(e.target.value))}
                        style={{
                          flex: 1,
                          accentColor: '#2563eb',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', minWidth: '35px', textAlign: 'right' }}>
                        {formData.wallpaperOverlay ?? 40}%
                      </span>
                    </div>

                    {/* Slider Efek Blur (Kabur) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <label style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600, minWidth: '120px' }}>
                        Efek Blur (Kabur):
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="16"
                        value={formData.wallpaperBlur ?? 0}
                        onChange={e => handleChange('wallpaperBlur', Number(e.target.value))}
                        style={{
                          flex: 1,
                          accentColor: '#2563eb',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', minWidth: '35px', textAlign: 'right' }}>
                        {formData.wallpaperBlur ?? 0}px
                      </span>
                    </div>
                  </div>
                )}

                {formData.bgType === 'solid' && (
                  <div style={{
                    background: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem'
                  }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                      Pilih Warna Solid Latar Belakang:
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input
                        type="color"
                        value={formData.solidColor || '#0c1a30'}
                        onChange={e => handleChange('solidColor', e.target.value)}
                        style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={formData.solidColor || '#0c1a30'}
                        onChange={e => handleChange('solidColor', e.target.value)}
                        className="input-control"
                        style={{ maxWidth: '160px', fontSize: '0.85rem' }}
                      />
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        {['#0c1a30', '#060d19', '#0f2942', '#0284c7', '#f1f5f9'].map(c => (
                          <div
                            key={c}
                            onClick={() => handleChange('solidColor', c)}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '6px',
                              background: c,
                              border: '1px solid #cbd5e1',
                              cursor: 'pointer'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {formData.bgType === 'gradasi' && (
                  <div style={{
                    background: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Warna Awal</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                          <input
                            type="color"
                            value={formData.gradientFrom || '#0c1a30'}
                            onChange={e => handleChange('gradientFrom', e.target.value)}
                            style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                          />
                          <input
                            type="text"
                            value={formData.gradientFrom || '#0c1a30'}
                            onChange={e => handleChange('gradientFrom', e.target.value)}
                            className="input-control"
                            style={{ fontSize: '0.75rem' }}
                          />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Warna Tengah</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                          <input
                            type="color"
                            value={formData.gradientVia || '#0f2942'}
                            onChange={e => handleChange('gradientVia', e.target.value)}
                            style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                          />
                          <input
                            type="text"
                            value={formData.gradientVia || '#0f2942'}
                            onChange={e => handleChange('gradientVia', e.target.value)}
                            className="input-control"
                            style={{ fontSize: '0.75rem' }}
                          />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Warna Akhir</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                          <input
                            type="color"
                            value={formData.gradientTo || '#060d19'}
                            onChange={e => handleChange('gradientTo', e.target.value)}
                            style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                          />
                          <input
                            type="text"
                            value={formData.gradientTo || '#060d19'}
                            onChange={e => handleChange('gradientTo', e.target.value)}
                            className="input-control"
                            style={{ fontSize: '0.75rem' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Efek Bola Cahaya Ambient (Glow Blobs) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.95rem 1.25rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={16} color="#f59e0b" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                      Efek Bola Cahaya Ambient (Glow Blobs)
                    </span>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
                    <input
                      type="checkbox"
                      checked={formData.glowBlobs !== false}
                      onChange={e => handleChange('glowBlobs', e.target.checked)}
                      style={{ accentColor: '#2563eb', width: '17px', height: '17px', cursor: 'pointer' }}
                    />
                    <span>Aktif</span>
                  </label>
                </div>

                {/* Text Theme Contrast Selector */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem'
                }}>
                  {/* Button 1: Teks Standar Gelap (Latar Terang) */}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        textColorTheme: 'light',
                        formCardStyle: 'clean_white'
                      }));
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.8rem 1rem',
                      borderRadius: '8px',
                      border: isLight ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      background: isLight ? '#eff6ff' : '#ffffff',
                      color: isLight ? '#1d4ed8' : '#334155',
                      fontSize: '0.82rem',
                      fontWeight: isLight ? 800 : 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isLight ? '0 2px 8px rgba(37, 99, 235, 0.15)' : 'none'
                    }}
                  >
                    <span>🌕</span>
                    <span>Teks Standar Gelap (Latar Terang)</span>
                  </button>

                  {/* Button 2: Teks Putih / Terang (Latar Gelap) */}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        textColorTheme: 'dark',
                        formCardStyle: 'dark_glass'
                      }));
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.8rem 1rem',
                      borderRadius: '8px',
                      border: !isLight ? '2px solid #0f172a' : '1px solid #cbd5e1',
                      background: !isLight ? '#0f172a' : '#ffffff',
                      color: !isLight ? '#ffffff' : '#334155',
                      fontSize: '0.82rem',
                      fontWeight: !isLight ? 800 : 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: !isLight ? '0 2px 8px rgba(15, 23, 42, 0.25)' : 'none'
                    }}
                  >
                    <span>🌙</span>
                    <span>Teks Putih / Terang (Latar Gelap)</span>
                  </button>
                </div>
              </>
            )}

            {/* TAB 2: PANEL KIRI (BRANDING) */}
            {activeTab === 'branding' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                      Pilihan Logo Panel Kiri:
                    </label>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        handleFileUpload(e, 'customLogoUrl');
                        handleChange('logoMode', 'custom');
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        color: '#1d4ed8',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <Upload size={12} />
                      <span>Upload File Logo</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    {[
                      { id: 'baharimas', label: 'Logo Resmi Baharimas' },
                      { id: 'combined', label: 'Baharimas + Mitra & BKI' },
                      { id: 'custom', label: 'Logo Kustom (Upload/URL)' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleChange('logoMode', opt.id)}
                        style={{
                          padding: '0.65rem 0.75rem',
                          borderRadius: '8px',
                          border: formData.logoMode === opt.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                          background: formData.logoMode === opt.id ? '#eff6ff' : '#ffffff',
                          color: formData.logoMode === opt.id ? '#1e40af' : '#334155',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {formData.logoMode === 'custom' && (
                    <div style={{ marginTop: '0.65rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                        URL atau Sumber Gambar Logo Kustom:
                      </label>
                      <input
                        type="text"
                        value={formData.customLogoUrl || ''}
                        onChange={e => handleChange('customLogoUrl', e.target.value)}
                        placeholder="https://... atau hasil unggah di atas"
                        className="input-control"
                        style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Badge Atas:</label>
                  <input
                    type="text"
                    value={formData.companyBadge || ''}
                    onChange={e => handleChange('companyBadge', e.target.value)}
                    placeholder="MARITIME FLEET MANAGEMENT SYSTEM"
                    className="input-control"
                    style={{ fontSize: '0.825rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Nama Perusahaan (Headline):</label>
                  <input
                    type="text"
                    value={formData.systemTitle || ''}
                    onChange={e => handleChange('systemTitle', e.target.value)}
                    placeholder="PT PELAYARAN BAHARIMAS KALIMANTAN"
                    className="input-control"
                    style={{ fontSize: '0.85rem', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Sub-Judul Perusahaan (Slogan / Sub-headline):</label>
                  <input
                    type="text"
                    value={formData.companySubtitle || ''}
                    onChange={e => handleChange('companySubtitle', e.target.value)}
                    placeholder="Fleet Management & Marine Shipping Lines"
                    className="input-control"
                    style={{ fontSize: '0.825rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Deskripsi Singkat Operasional:</label>
                  <textarea
                    rows={3}
                    value={formData.portalDescription || ''}
                    onChange={e => handleChange('portalDescription', e.target.value)}
                    placeholder="Pusat sistem digital operasional armada kapal tunda (tugboat), tongkang..."
                    className="input-control"
                    style={{ fontSize: '0.825rem', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Alamat Kantor Pusat:</label>
                  <textarea
                    rows={2}
                    value={formData.officeAddress || ''}
                    onChange={e => handleChange('officeAddress', e.target.value)}
                    className="input-control"
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>No. Telepon:</label>
                    <input
                      type="text"
                      value={formData.officePhone || ''}
                      onChange={e => handleChange('officePhone', e.target.value)}
                      className="input-control"
                      style={{ fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Email Resmi:</label>
                    <input
                      type="text"
                      value={formData.officeEmail || ''}
                      onChange={e => handleChange('officeEmail', e.target.value)}
                      className="input-control"
                      style={{ fontSize: '0.8rem' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PANEL KANAN (FORM) */}
            {activeTab === 'form' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Judul Form:</label>
                    <input
                      type="text"
                      value={formData.formTitle || ''}
                      onChange={e => handleChange('formTitle', e.target.value)}
                      placeholder="Masuk ke Portal PMS"
                      className="input-control"
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Teks Tombol Masuk:</label>
                    <input
                      type="text"
                      value={formData.buttonText || ''}
                      onChange={e => handleChange('buttonText', e.target.value)}
                      placeholder="Masuk ke Sistem PMS →"
                      className="input-control"
                      style={{ fontSize: '0.85rem', fontWeight: 700 }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Sub-Judul Petunjuk Form:</label>
                  <input
                    type="text"
                    value={formData.formSubtitle || ''}
                    onChange={e => handleChange('formSubtitle', e.target.value)}
                    placeholder="Gunakan akun korporat PT. Pelayaran Baharimas Kalimantan"
                    className="input-control"
                    style={{ fontSize: '0.825rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Placeholder Email:</label>
                    <input
                      type="text"
                      value={formData.usernamePlaceholder || ''}
                      onChange={e => handleChange('usernamePlaceholder', e.target.value)}
                      placeholder="admin@baharimas.co.id"
                      className="input-control"
                      style={{ fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Placeholder Sandi:</label>
                    <input
                      type="text"
                      value={formData.passwordPlaceholder || ''}
                      onChange={e => handleChange('passwordPlaceholder', e.target.value)}
                      placeholder="Kata sandi akun..."
                      className="input-control"
                      style={{ fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Gaya Box Formulir:</label>
                  <select
                    value={formData.formCardStyle || 'dark_glass'}
                    onChange={e => handleChange('formCardStyle', e.target.value)}
                    className="input-control"
                    style={{ fontSize: '0.8rem' }}
                  >
                    <option value="dark_glass">Dark Glassmorphism (Efek Kaca Transparan & Blur)</option>
                    <option value="clean_white">Clean Solid Box (Warna Solid & Bersih)</option>
                  </select>
                </div>

                {/* Masuk Cepat / Quick Login Settings */}
                <div style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                      Fitur Akses Cepat Demo (Klik Akun)
                    </span>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                      <input
                        type="checkbox"
                        checked={formData.showQuickLogin !== false}
                        onChange={e => handleChange('showQuickLogin', e.target.checked)}
                        style={{ accentColor: '#2563eb' }}
                      />
                      <span>Tampilkan</span>
                    </label>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Label Akses Cepat:</label>
                    <input
                      type="text"
                      value={formData.quickLoginLabel || ''}
                      onChange={e => handleChange('quickLoginLabel', e.target.value)}
                      placeholder="⚡ Akses Cepat Demo (Klik Akun):"
                      className="input-control"
                      style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}
                    />
                  </div>
                  <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>
                    Menampilkan 6 role staf & crew armada (Capt. Robert Sitorus, Ir. H. Gunawan, Capt. Hendra Gunawan, Ir. Bambang Wijaya, Suryadi Pratama, Siti Rahmawati).
                  </p>
                </div>

                {/* Footer notices */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Catatan Keamanan Footer Form:</label>
                  <input
                    type="text"
                    value={formData.formFooterNotice || ''}
                    onChange={e => handleChange('formFooterNotice', e.target.value)}
                    placeholder="🔒 Portal Resmi PT. Pelayaran Baharimas Kalimantan • ISM Code Compliant"
                    className="input-control"
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Teks Hak Cipta Global (Footer):</label>
                  <input
                    type="text"
                    value={formData.footerText || ''}
                    onChange={e => handleChange('footerText', e.target.value)}
                    placeholder="© 2026 PT. Pelayaran Baharimas Kalimantan • All Rights Reserved"
                    className="input-control"
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>
              </div>
            )}

            {/* TAB 4: ALAT DEV */}
            {activeTab === 'dev' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', margin: '0 0 0.5rem 0' }}>
                    Ekspor & Impor Konfigurasi CMS (JSON)
                  </h4>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
                        showToast('Konfigurasi berhasil disalin ke clipboard!', 'success');
                      }}
                      style={{
                        padding: '0.55rem 0.85rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Copy size={14} />
                      <span>Salin JSON</span>
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={JSON.stringify(formData, null, 2)}
                    readOnly
                    className="input-control"
                    style={{ fontFamily: 'monospace', fontSize: '0.75rem', background: '#f8fafc' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Preview Mockup Halaman Login DYNAMICALLY RESPONSIVE TO CONTRAST & BACKGROUND */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          {/* Header of Live Preview */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid #e2e8f0',
            background: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.95rem' }}>👁️</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>
                Live Preview Mockup Halaman Login
              </span>
              <span style={{
                fontSize: '0.72rem',
                padding: '0.15rem 0.5rem',
                borderRadius: '6px',
                background: isLight ? '#eff6ff' : '#0f172a',
                color: isLight ? '#1d4ed8' : '#ffffff',
                fontWeight: 700,
                marginLeft: '0.35rem'
              }}>
                {isLight ? 'Latar Terang (Teks Gelap)' : 'Latar Gelap (Teks Putih)'}
              </span>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              background: '#dcfce7',
              color: '#15803d',
              fontSize: '0.72rem',
              fontWeight: 700
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }} />
              <span>Real-time</span>
            </div>
          </div>

          {/* Scaled Mockup Body with Separated Backdrop */}
          <div style={{
            padding: '2.5rem 1.75rem 3.5rem 1.75rem',
            minHeight: '560px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Background Layer with Wallpaper Blur */}
            <div style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              ...getPreviewBackground(),
              filter: (formData.bgType === 'wallpaper' && formData.wallpaperBlur) ? `blur(${formData.wallpaperBlur}px)` : 'none',
              transform: (formData.bgType === 'wallpaper' && formData.wallpaperBlur) ? 'scale(1.05)' : 'none',
              transition: 'all 0.3s ease'
            }} />

            {/* Ambient Glow Blobs in Preview */}
            {formData.glowBlobs !== false && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute',
                  top: '-15%',
                  left: '-10%',
                  width: '320px',
                  height: '320px',
                  borderRadius: '50%',
                  background: isLight ? 'rgba(2, 132, 199, 0.12)' : (formData.glowColor1 || 'radial-gradient(circle, rgba(2, 132, 199, 0.25) 0%, transparent 70%)'),
                  filter: 'blur(50px)',
                  pointerEvents: 'none'
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '-15%',
                  right: '-10%',
                  width: '350px',
                  height: '350px',
                  borderRadius: '50%',
                  background: isLight ? 'rgba(6, 182, 212, 0.1)' : (formData.glowColor2 || 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)'),
                  filter: 'blur(60px)',
                  pointerEvents: 'none'
                }} />
              </div>
            )}

            {/* Mockup Canvas Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.05fr 1.25fr',
              gap: '1.75rem',
              alignItems: 'center',
              width: '100%',
              maxWidth: '840px',
              position: 'relative',
              zIndex: 2
            }}>
              {/* Left Column in Mockup */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Badge: MARITIME FLEET MANAGEMENT SYSTEM */}
                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    background: isLight ? '#eff6ff' : 'rgba(2, 132, 199, 0.15)',
                    border: isLight ? '1px solid #bfdbfe' : '1px solid rgba(56, 189, 248, 0.3)',
                    color: isLight ? '#1d4ed8' : '#38bdf8',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase'
                  }}>
                    {formData.companyBadge || 'MARITIME FLEET MANAGEMENT SYSTEM'}
                  </span>
                </div>

                {/* Logo & Company Name (100% Reactive to logoMode & customLogoUrl) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {formData.logoMode === 'custom' && formData.customLogoUrl ? (
                    <img
                      src={formData.customLogoUrl}
                      alt="Logo Kustom"
                      style={{
                        maxHeight: '40px',
                        maxWidth: '120px',
                        objectFit: 'contain',
                        borderRadius: '6px'
                      }}
                    />
                  ) : formData.logoMode === 'combined' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <BaharimasEmblem size={36} />
                      <div style={{ width: '1px', height: '22px', background: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.2)' }} />
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: isLight ? '#0369a1' : '#38bdf8',
                        letterSpacing: '0.05em'
                      }}>
                        BKI
                      </span>
                    </div>
                  ) : (
                    <BaharimasEmblem size={36} />
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{
                      fontFamily: "'Oswald', 'Bebas Neue', sans-serif",
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: isLight ? '#0f172a' : '#ffffff',
                      letterSpacing: '0.03em',
                      lineHeight: 1.15,
                      textTransform: 'uppercase'
                    }}>
                      {formData.systemTitle || 'PT PELAYARAN BAHARIMAS KALIMANTAN'}
                    </span>
                    {formData.companySubtitle && (
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        color: isLight ? '#0369a1' : '#38bdf8',
                        letterSpacing: '0.02em',
                        lineHeight: 1.2
                      }}>
                        {formData.companySubtitle}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p style={{
                  fontSize: '0.78rem',
                  color: isLight ? '#334155' : '#94a3b8',
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  {formData.portalDescription || 'Pusat sistem digital operasional armada kapal tunda (tugboat), tongkang, dan kapal kargo niaga perairan Kalimantan Barat dan jalur pelayaran Nusantara.'}
                </p>

                {/* Office Address Card */}
                <div style={{
                  background: isLight ? '#ffffff' : 'rgba(2, 6, 23, 0.45)',
                  border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '12px',
                  padding: '0.85rem 1.15rem',
                  fontSize: '0.72rem',
                  color: isLight ? '#475569' : '#94a3b8',
                  boxShadow: isLight ? '0 4px 14px rgba(0,0,0,0.06)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
                    <MapPin size={16} color="#0284c7" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                    <div style={{ lineHeight: 1.45 }}>
                      <strong style={{ color: isLight ? '#0f172a' : '#ffffff' }}>Alamat Kantor Pusat:</strong>{' '}
                      {formData.officeAddress || 'Jl. Adi Sucipto KM 6, Kompleks Bahari Permai No. 2, RT. 004 / RW. 004, Desa Sungai Raya, Kec. Sungai Raya, Kab. Kubu Raya - Pontianak, Kalimantan Barat'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginLeft: '1.5rem', fontSize: '0.7rem' }}>
                    <span>📞 Telp: {formData.officePhone || '(0561) 531016 / 732194'}</span>
                    <span>✉️ {formData.officeEmail || 'pt.baharimas@hotmail.com'}</span>
                  </div>
                </div>
              </div>

              {/* Right Column in Mockup: Dynamically Light or Dark Glass Card (Respects formCardStyle) */}
              <div style={{
                background: cardBackground,
                backdropFilter: cardBackdrop,
                border: cardBorder,
                borderRadius: '20px',
                padding: '1.5rem 1.35rem',
                boxShadow: isLight ? '0 20px 45px -10px rgba(0, 0, 0, 0.12)' : '0 25px 60px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}>
                {/* Title and Subtitle */}
                <div>
                  <h3 style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: isLight ? '#0f172a' : '#ffffff',
                    margin: 0
                  }}>
                    {formData.formTitle || 'Masuk ke Portal PMS'}
                  </h3>
                  <p style={{
                    fontSize: '0.72rem',
                    color: isLight ? '#64748b' : '#94a3b8',
                    margin: '0.2rem 0 0 0'
                  }}>
                    {formData.formSubtitle || 'Gunakan akun korporat PT. Pelayaran Baharimas Kalimantan'}
                  </p>
                </div>

                {/* Mock Form Inputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {/* Email Input */}
                  <div style={{
                    background: isLight ? '#f8fafc' : '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem'
                  }}>
                    <Mail size={15} color="#64748b" />
                    <span style={{ fontSize: '0.78rem', color: '#0f172a', fontWeight: 500 }}>
                      {formData.usernamePlaceholder || 'admin@baharimas.co.id'}
                    </span>
                  </div>

                  {/* Password Input */}
                  <div style={{
                    background: isLight ? '#f8fafc' : '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Lock size={15} color="#64748b" />
                      <span style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic' }}>
                        {formData.passwordPlaceholder || 'Kata sandi akun...'}
                      </span>
                    </div>
                    <Eye size={15} color="#94a3b8" />
                  </div>

                  {/* Remember Me & Demo Pass info */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', marginTop: '0.15rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: isLight ? '#475569' : '#94a3b8' }}>
                      <input type="checkbox" defaultChecked style={{ accentColor: '#0284c7' }} />
                      <span>Ingat sesi saya</span>
                    </div>
                    <span style={{ color: '#0284c7', fontWeight: 600 }}>
                      Default Sandi Demo: 123
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      background: isLight ? '#1e3a8a' : '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.825rem',
                      fontWeight: 800,
                      cursor: 'default',
                      textAlign: 'center',
                      boxShadow: isLight ? '0 4px 14px rgba(30, 58, 138, 0.35)' : '0 4px 18px rgba(2, 132, 199, 0.45)',
                      marginTop: '0.2rem'
                    }}
                  >
                    {formData.buttonText || 'Masuk ke Sistem PMS →'}
                  </button>
                </div>

                {/* Quick Demo Role Cards (Conditioned by showQuickLogin !== false) */}
                {formData.showQuickLogin !== false && (
                  <div style={{ marginTop: '0.45rem', borderTop: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.65rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: isLight ? '#b45309' : '#38bdf8' }}>
                        {formData.quickLoginLabel || '⚡ Akses Cepat Demo (Klik Akun):'}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: '#64748b' }}>
                        1-Click Role Access
                      </span>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.45rem'
                    }}>
                      {demoUsersList.map((usr, i) => (
                        <div
                          key={i}
                          style={{
                            padding: '0.45rem 0.6rem',
                            borderRadius: '8px',
                            border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
                            background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.1rem',
                            position: 'relative'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: isLight ? '#0f172a' : '#ffffff',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '100px'
                            }}>
                              {usr.name.split(',')[0]}
                            </span>
                            <ChevronRight size={12} color="#0284c7" />
                          </div>
                          <span style={{ fontSize: '0.62rem', color: isLight ? '#0369a1' : '#38bdf8', fontWeight: 600 }}>
                            {usr.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form Footer Notice */}
                {formData.formFooterNotice && (
                  <div style={{
                    fontSize: '0.65rem',
                    color: isLight ? '#64748b' : '#94a3b8',
                    textAlign: 'center',
                    marginTop: '0.2rem',
                    borderTop: isLight ? '1px dashed #e2e8f0' : '1px dashed rgba(255,255,255,0.1)',
                    paddingTop: '0.4rem'
                  }}>
                    {formData.formFooterNotice}
                  </div>
                )}
              </div>
            </div>

            {/* Global Footer in Live Preview */}
            <div style={{
              position: 'absolute',
              bottom: '0.65rem',
              left: 0,
              right: 0,
              textAlign: 'center',
              fontSize: '0.68rem',
              color: isLight ? '#475569' : '#94a3b8',
              zIndex: 3
            }}>
              {formData.footerText || '© 2026 PT. Pelayaran Baharimas Kalimantan • All Rights Reserved'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
