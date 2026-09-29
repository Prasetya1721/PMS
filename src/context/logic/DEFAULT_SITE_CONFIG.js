/**
 * DEFAULT_SITE_CONFIG.js
 * Diekstrak dari PMSContext.jsx (baris 175-222).
 * Sumber: Konfigurasi bawaan CMS halaman login (branding, latar, teks formulir)
 */
export const DEFAULT_SITE_CONFIG = {
    // Tipe Latar Belakang: 'bawaan' | 'solid' | 'gradasi' | 'wallpaper'
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
    // Tema Kontras: 'light' (Latar Terang) | 'dark' (Latar Gelap)
    textColorTheme: 'light',

    // Panel Kiri (Branding PT Baharimas)
    logoMode: 'baharimas',
    customLogoUrl: '',
    companyBadge: 'MARITIME FLEET MANAGEMENT SYSTEM',
    systemTitle: 'PT PELAYARAN BAHARIMAS KALIMANTAN',
    companySubtitle: 'Fleet Management & Marine Shipping Lines',
    portalDescription: 'Pusat sistem digital operasional armada kapal tunda (tugboat), tongkang, dan kapal kargo niaga perairan Kalimantan Barat dan jalur pelayaran Nusantara.',
    officeAddress: 'Jl. Adi Sucipto KM 6, Kompleks Bahari Permai No. 2, RT. 004 / RW. 004, Desa Sungai Raya, Kec. Sungai Raya, Kab. Kubu Raya - Pontianak, Kalimantan Barat',
    officePhone: '(0561) 531016 / 732194',
    officeEmail: 'pt.baharimas@hotmail.com',

    // Panel Kanan (Formulir Login)
    formCardStyle: 'dark_glass',
    formTitle: 'Masuk ke Portal PMS',
    formSubtitle: 'Gunakan akun korporat PT. Pelayaran Baharimas Kalimantan',
    usernamePlaceholder: 'admin@baharimas.co.id',
    passwordPlaceholder: '•••',
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
  };
