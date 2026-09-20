import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  INITIAL_VESSELS,
  INITIAL_EQUIPMENT,
  INITIAL_MAINTENANCE_SCHEDULES,
  INITIAL_WORK_ORDERS,
  INITIAL_SPAREPARTS,
  INITIAL_REQUISITIONS,
  INITIAL_VESSEL_BUDGETS,
  INITIAL_COSTS,
  INITIAL_CREW,
  INITIAL_LEAVES,
  INITIAL_DRILLS,
  INITIAL_CREW_CERTIFICATES,
  INITIAL_SHIP_DOCUMENTS,
  INITIAL_NOTIFICATION_SETTINGS,
  INITIAL_NOTIFICATION_LOGS,
  INITIAL_USERS
} from '../data/initialData';
import { createDefaultShipParticulars } from '../data/shipParticularsData';
import {
  CERTIFICATE_CATEGORIES,
  STANDARD_CERTIFICATE_TEMPLATES,
  DEFAULT_MASTER_SURVEY_TYPES,
  DEFAULT_MASTER_CERTIFICATE_NAMES
} from '../data/shipCertificatesMaster';
import {
  INITIAL_AUDITS,
  INITIAL_AUDIT_FINDINGS,
  ISM_DOC_ELEMENTS,
  ISM_SMC_ELEMENTS
} from '../data/auditMasterData';
import * as DEMO_DATA from '../data/sampleSeedData';
import { calculateNCRange } from '../utils/auditTimeUtils';
import {
  DEFAULT_EMAIL_GATEWAY,
  buildEmailPayload,
  sendEmailViaBackend,
  buildMailtoUrl,
  stripWhatsappMarkdown,
  buildEmailHtml,
  normalizeEmailList,
} from '../services/emailService';
import {
  hasAccess,
  getAllowedTabs,
  canPerformAction,
  ROLE_DEFINITIONS,
  ROLE_PERMISSIONS
} from '../utils/rbac';

const PMSContext = createContext();

const PMS_STORAGE_VERSION = 'v14-clean-input-testing';

// Auto-purge stale localStorage if version mismatch occurs
if (typeof window !== 'undefined') {
  try {
    const currentVersion = localStorage.getItem('pms_fleet_version');
    if (currentVersion !== PMS_STORAGE_VERSION) {
      console.log(`[PMS] Purging stale localStorage version (${currentVersion}) -> ${PMS_STORAGE_VERSION}`);
      const preservedUser = localStorage.getItem('pms_current_user');
      localStorage.clear();
      if (preservedUser) {
        localStorage.setItem('pms_current_user', preservedUser);
      }
      localStorage.setItem('pms_fleet_version', PMS_STORAGE_VERSION);
    }

    // Bersihkan data master template agar kosong default sesuai permintaan user
    const isMasterCleaned = localStorage.getItem('pms_master_templates_cleaned_v3');
    if (!isMasterCleaned) {
      localStorage.setItem('pms_documentTemplates', JSON.stringify([]));
      localStorage.setItem('pms_master_templates_cleaned_v3', 'true');
    }
  } catch (err) {
    console.error('[PMS] Storage purge check error:', err);
  }
}

export const PMSProvider = ({ children }) => {
  // Load state from localStorage or fallback to initial data
  const loadStored = (key, fallback) => {
    try {
      const version = localStorage.getItem('pms_fleet_version');
      if (version !== PMS_STORAGE_VERSION) {
        return fallback;
      }
      const saved = localStorage.getItem(`pms_${key}`);
      if (!saved) return fallback;
      const sanitized = saved
        .replace(/Samarinda/gi, 'Pontianak')
        .replace(/Balikpapan/gi, 'Ketapang')
        .replace(/Muara Berau/gi, 'Muara Jungkat')
        .replace(/Kalimantan Timur/gi, 'Kalimantan Barat')
        .replace(/Sungai Mahakam/gi, 'Sungai Kapuas');
      const parsed = JSON.parse(sanitized);

      if (key === 'vessels') {
        if (!Array.isArray(parsed)) return fallback;
        return parsed.map(v => {
          let photo = v.photo;
          if (!photo || photo.includes('photo-1544620347-c4fd4a3d5957')) {
            photo = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80';
          }
          return {
            ...v,
            photo,
            particulars: v.particulars || createDefaultShipParticulars(v)
          };
        });
      }

      if (key === 'notificationSettings') {
        if (!parsed || !parsed.thresholds || !parsed.autoSend || !parsed.thresholds.some(t => t.id === 'th-1d')) {
          return fallback;
        }
        const ensureEmailChannel = (list) => (list || []).map(t => ({
          ...t,
          notifyChannels: Array.from(new Set([...(t.notifyChannels || []), 'Email'])),
        }));
        return {
          ...fallback,
          ...parsed,
          thresholds: ensureEmailChannel(parsed.thresholds || fallback.thresholds),
          customThresholds: ensureEmailChannel(parsed.customThresholds || fallback.customThresholds),
          autoSend: {
            ...fallback.autoSend,
            ...(parsed.autoSend || {}),
            channels: {
              ...(fallback.autoSend?.channels || {}),
              ...((parsed.autoSend || {}).channels || {}),
            },
            emailGateway: {
              ...(fallback.autoSend?.emailGateway || {}),
              ...((parsed.autoSend || {}).emailGateway || {}),
            },
          }
        };
      }
      return parsed;
    } catch {
      return fallback;
    }
  };

  const [vessels, setVessels] = useState(() => loadStored('vessels', INITIAL_VESSELS));
  const [equipment, setEquipment] = useState(() => loadStored('equipment', INITIAL_EQUIPMENT));
  const [schedules, setSchedules] = useState(() => loadStored('schedules', INITIAL_MAINTENANCE_SCHEDULES));
  const [workOrders, setWorkOrders] = useState(() => loadStored('workOrders', INITIAL_WORK_ORDERS));
  const [spareparts, setSpareparts] = useState(() => loadStored('spareparts', INITIAL_SPAREPARTS));
  const [requisitions, setRequisitions] = useState(() => loadStored('requisitions', INITIAL_REQUISITIONS));
  const [costs, setCosts] = useState(() => loadStored('costs', INITIAL_COSTS));
  const [vesselBudgets, setVesselBudgets] = useState(() => loadStored('vesselBudgets', INITIAL_VESSEL_BUDGETS));
  const [crew, setCrew] = useState(() => loadStored('crew', INITIAL_CREW));
  const [leaves, setLeaves] = useState(() => loadStored('leaves', INITIAL_LEAVES));
  const [drills, setDrills] = useState(() => loadStored('drills', INITIAL_DRILLS));
  const [crewCertificates, setCrewCertificates] = useState(() => loadStored('crewCertificates', INITIAL_CREW_CERTIFICATES));
  const [shipDocuments, setShipDocuments] = useState(() => loadStored('shipDocuments', INITIAL_SHIP_DOCUMENTS));
  const [certificateCategories, setCertificateCategories] = useState(() => {
    const stored = loadStored('certificateCategories', null);
    if (Array.isArray(stored)) {
      return stored;
    }
    return CERTIFICATE_CATEGORIES || [];
  });
  const [documentTemplates, setDocumentTemplates] = useState(() => {
    const stored = loadStored('documentTemplates', null);
    if (Array.isArray(stored)) {
      return stored;
    }
    return DEFAULT_MASTER_CERTIFICATE_NAMES || [];
  });
  const [masterSurveyTypes, setMasterSurveyTypes] = useState(() => {
    // Migration: user requested "master data jenis survey kosongkan dulu nanti akan di isi lagi"
    // Pastikan jika ada data lama 40 item di browser pengguna langsung di-reset bersih ke []
    const migrationKey = 'pms_survey_empty_v3';
    if (!localStorage.getItem(migrationKey)) {
      localStorage.setItem(migrationKey, 'true');
      localStorage.setItem('pms_masterSurveyTypes', JSON.stringify([]));
      return [];
    }
    const stored = loadStored('masterSurveyTypes', null);
    if (Array.isArray(stored)) {
      return stored;
    }
    return DEFAULT_MASTER_SURVEY_TYPES || [];
  });
  const [notificationSettings, setNotificationSettings] = useState(() => loadStored('notificationSettings', INITIAL_NOTIFICATION_SETTINGS));
  const [notificationLogs, setNotificationLogs] = useState(() => loadStored('notificationLogs', INITIAL_NOTIFICATION_LOGS));
  const [users, setUsers] = useState(() => loadStored('users', INITIAL_USERS));
  const [audits, setAudits] = useState(() => loadStored('audits', INITIAL_AUDITS));
  const [auditFindings, setAuditFindings] = useState(() => loadStored('auditFindings', INITIAL_AUDIT_FINDINGS));

  // CMS Site Configuration (login page content, branding, backgrounds)
  // CMS Site Configuration (login page content, branding, backgrounds)
  const DEFAULT_SITE_CONFIG = {
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

  const [siteConfig, setSiteConfig] = useState(() => {
    const stored = loadStored('siteConfig', null);
    if (stored && typeof stored === 'object') {
      if (stored.systemTitle?.includes('Nota Debit') || stored.logoMode === 'bki_group') {
        localStorage.setItem('pms_siteConfig', JSON.stringify(DEFAULT_SITE_CONFIG));
        return DEFAULT_SITE_CONFIG;
      }
      return { ...DEFAULT_SITE_CONFIG, ...stored };
    }
    return DEFAULT_SITE_CONFIG;
  });

  const updateSiteConfig = (updates) => {
    setSiteConfig(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('pms_siteConfig', JSON.stringify(updated));
      return updated;
    });
    showToast('Konfigurasi situs berhasil disimpan!', 'success');
  };

  const resetSiteConfig = () => {
    setSiteConfig(DEFAULT_SITE_CONFIG);
    localStorage.setItem('pms_siteConfig', JSON.stringify(DEFAULT_SITE_CONFIG));
    showToast('Konfigurasi dikembalikan ke standar PT. Baharimas.', 'info');
  };

  // Sidebar Visibility Overrides (Super Admin controls which modules each role can see)
  const [sidebarOverrides, setSidebarOverrides] = useState(() => {
    const stored = loadStored('sidebarOverrides', null);
    return stored && typeof stored === 'object' ? stored : {};
  });

  const updateSidebarOverrides = (newOverrides) => {
    setSidebarOverrides(newOverrides);
    localStorage.setItem('pms_sidebarOverrides', JSON.stringify(newOverrides));
    showToast('Pengaturan sidebar berhasil disimpan!', 'success');
  };

  // User Profile Update
  const updateUserProfile = (userId, profileData) => {
    setUsers(prev => {
      const updated = prev.map(u => u.id === userId ? { ...u, ...profileData } : u);
      localStorage.setItem('pms_users', JSON.stringify(updated));
      return updated;
    });
    // Also update currentUser if it's the same user
    if (currentUser && currentUser.id === userId) {
      const updatedUser = { ...currentUser, ...profileData };
      setCurrentUser(updatedUser);
      if (profileData.role) {
        setCurrentRoleState(profileData.role);
      }
      localStorage.setItem('pms_current_user', JSON.stringify(updatedUser));
    }
    showToast('Profil berhasil diperbarui!', 'success');
  };

  // Master Data Tipe Kapal & Pelabuhan Pendaftaran (Bisa Ditambah Otomatis Saat Input Manual Disimpan)
  const DEFAULT_VESSEL_TYPES = [
    'Tugboat',
    'Tongkang 300 Feet',
    'Tongkang 330 Feet',
    'LCT (Landing Craft Tank)',
    'Kapal Kargo / SPOB',
    'Speedboat Patroli',
    'Oil Barge (Tongkang Minyak)'
  ];

  const DEFAULT_MASTER_PORTS = [
    'Pontianak',
    'Ketapang',
    'Kendawangan',
    'Banjarmasin',
    'Samarinda',
    'Balikpapan',
    'Jakarta',
    'Surabaya',
    'Batam',
    'Kumai',
    'Sampit'
  ];

  const [vesselTypes, setVesselTypes] = useState(() => loadStored('vesselTypes', DEFAULT_VESSEL_TYPES));
  const [portLocations, setPortLocations] = useState(() => loadStored('portLocations', DEFAULT_MASTER_PORTS));

  useEffect(() => {
    localStorage.setItem('pms_vesselTypes', JSON.stringify(vesselTypes));
  }, [vesselTypes]);

  useEffect(() => {
    localStorage.setItem('pms_portLocations', JSON.stringify(portLocations));
  }, [portLocations]);

  const addMasterVesselType = (type) => {
    if (!type || typeof type !== 'string') return;
    const clean = type.trim();
    if (!clean) return;
    setVesselTypes(prev => {
      const exists = (prev || []).some(t => t.toLowerCase() === clean.toLowerCase());
      if (!exists) {
        const updated = [clean, ...(prev || [])];
        localStorage.setItem('pms_vesselTypes', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  const deleteMasterVesselType = (typeToDelete) => {
    setVesselTypes(prev => {
      const updated = (prev || []).filter(t => t.toLowerCase() !== typeToDelete.toLowerCase());
      localStorage.setItem('pms_vesselTypes', JSON.stringify(updated));
      return updated;
    });
  };

  const addMasterPort = (port) => {
    if (!port || typeof port !== 'string') return;
    const clean = port.trim();
    if (!clean) return;
    setPortLocations(prev => {
      const exists = (prev || []).some(p => p.toLowerCase() === clean.toLowerCase());
      if (!exists) {
        const updated = [clean, ...(prev || [])];
        localStorage.setItem('pms_portLocations', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  const deleteMasterPort = (portToDelete) => {
    setPortLocations(prev => {
      const updated = (prev || []).filter(p => p.toLowerCase() !== portToDelete.toLowerCase());
      localStorage.setItem('pms_portLocations', JSON.stringify(updated));
      return updated;
    });
  };

  // Authentication state for PT. Pelayaran Baharimas Kalimantan
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pms_current_user');
      return saved ? JSON.parse(saved) : (INITIAL_USERS[0] || null);
    } catch {
      return INITIAL_USERS[0] || null;
    }
  });

  // Global App Controls & Role Management
  const [selectedVesselId, setSelectedVesselId] = useState('all'); // 'all' or 'v-001' etc.
  const [currentRole, setCurrentRoleState] = useState(() => {
    try {
      const saved = localStorage.getItem('pms_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.role) return parsed.role;
      }
    } catch {}
    return 'Super Admin';
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Set Current Role with RBAC sync and auto-redirect
  const setCurrentRole = (newRole) => {
    setCurrentRoleState(newRole);
    // Find representative user for this role
    const matchedUser = (users || INITIAL_USERS).find(u => u.role === newRole);
    if (matchedUser) {
      setCurrentUser(matchedUser);
      try {
        localStorage.setItem('pms_current_user', JSON.stringify(matchedUser));
      } catch {}
    }
    // If current activeTab is not allowed, auto redirect to 'dashboard'
    if (!hasAccess(newRole, activeTab)) {
      setActiveTab('dashboard');
      showToast(`Beralih ke peran ${newRole}. Menampilkan modul yang diizinkan.`, 'info');
    } else {
      showToast(`Peran aktif: ${newRole}`, 'info');
    }
  };

  const hasPermission = (moduleId) => hasAccess(currentRole, moduleId);
  const canAction = (action) => canPerformAction(currentRole, action);

  const login = (userData) => {
    setCurrentUser(userData);
    if (userData.role) {
      setCurrentRoleState(userData.role);
      if (!hasAccess(userData.role, activeTab)) {
        setActiveTab('dashboard');
      }
    }
    localStorage.setItem('pms_current_user', JSON.stringify(userData));
    showToast(`Selamat datang, ${userData.name}! Anda masuk sebagai ${userData.role}.`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pms_current_user');
    showToast('Anda telah keluar dari sesi PT. Pelayaran Baharimas Kalimantan.', 'info');
  };

  // Theme Mode: 'light' | 'dark' (defaults to 'light' with pure white background)
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('pms_theme_mode');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      return 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('pms_theme_mode', theme);
      localStorage.setItem('pms_theme', theme);
    } catch (err) {
      console.error('[PMS] Failed to persist theme:', err);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === 'light' ? 'dark' : 'light';
      showToast(`Mode dialihkan ke: ${nextTheme === 'light' ? '☀️ Mode Terang (Latar Belakang Putih)' : '🌙 Mode Gelap (Dark Mode)'}`, 'info');
      return nextTheme;
    });
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pms_fleet_version', PMS_STORAGE_VERSION);
      localStorage.setItem('pms_vessels', JSON.stringify(vessels || []));
      localStorage.setItem('pms_equipment', JSON.stringify(equipment || []));
      localStorage.setItem('pms_schedules', JSON.stringify(schedules || []));
      localStorage.setItem('pms_workOrders', JSON.stringify(workOrders || []));
      localStorage.setItem('pms_spareparts', JSON.stringify(spareparts || []));
      localStorage.setItem('pms_requisitions', JSON.stringify(requisitions || []));
      localStorage.setItem('pms_costs', JSON.stringify(costs || []));
      localStorage.setItem('pms_vessel_budgets', JSON.stringify(vesselBudgets || []));
      localStorage.setItem('pms_crew', JSON.stringify(crew || []));
      localStorage.setItem('pms_leaves', JSON.stringify(leaves || []));
      localStorage.setItem('pms_drills', JSON.stringify(drills || []));
      localStorage.setItem('pms_crewCertificates', JSON.stringify(crewCertificates || []));
      localStorage.setItem('pms_shipDocuments', JSON.stringify(shipDocuments || []));
      localStorage.setItem('pms_certificateCategories', JSON.stringify(certificateCategories || []));
      localStorage.setItem('pms_documentTemplates', JSON.stringify(documentTemplates || []));
      localStorage.setItem('pms_notificationSettings', JSON.stringify(notificationSettings || {}));
      localStorage.setItem('pms_notificationLogs', JSON.stringify(notificationLogs || []));
      localStorage.setItem('pms_users', JSON.stringify(users || []));
      localStorage.setItem('pms_audits', JSON.stringify(audits || []));
      localStorage.setItem('pms_auditFindings', JSON.stringify(auditFindings || []));
      localStorage.setItem('pms_siteConfig', JSON.stringify(siteConfig || {}));
      localStorage.setItem('pms_sidebarOverrides', JSON.stringify(sidebarOverrides || {}));
    } catch (err) {
      console.error('[PMS] Failed to sync state to localStorage:', err);
    }
  }, [
    vessels, equipment, schedules, workOrders, spareparts, requisitions,
    costs, vesselBudgets, crew, leaves, drills, crewCertificates, shipDocuments,
    certificateCategories, documentTemplates, notificationSettings, notificationLogs, users,
    audits, auditFindings, siteConfig, sidebarOverrides
  ]);


  const showToast = (msg, type = 'info') => {
    setToastMessage({ message: msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Equipment Actions
  const updateRunningHours = (equipmentId, addedOrTotalHours, isAbsolute = false) => {
    setEquipment(prev => prev.map(eq => {
      if (eq.id !== equipmentId) return eq;
      const newHours = isAbsolute ? Number(addedOrTotalHours) : eq.runningHours + Number(addedOrTotalHours);
      const hoursToNext = eq.nextServiceHours - newHours;
      let newStatus = 'Normal';
      if (hoursToNext <= 0) {
        newStatus = 'Overdue';
      } else if (hoursToNext <= 200) {
        newStatus = 'Due Soon';
      }

      return {
        ...eq,
        runningHours: newHours,
        status: newStatus
      };
    }));
    showToast(`Running hours berhasil diperbarui untuk equipment!`, 'success');
  };

  const addEquipment = (equipmentData) => {
    const running = Number(equipmentData.runningHours) || 0;
    const nextService = Number(equipmentData.nextServiceHours) || (running + 500);
    const lastMaintenance = Number(equipmentData.lastMaintenanceHours) || 0;
    const hoursToNext = nextService - running;

    let status = equipmentData.status || 'Normal';
    if (!equipmentData.status || equipmentData.status === 'Normal') {
      if (hoursToNext <= 0) {
        status = 'Overdue';
      } else if (hoursToNext <= 200) {
        status = 'Due Soon';
      } else {
        status = 'Normal';
      }
    }

    const newEq = {
      id: `eq-${Date.now()}`,
      vesselId: equipmentData.vesselId || (vessels[0]?.id || 'v-001'),
      code: equipmentData.code?.trim() || `EQ-${Math.floor(100 + Math.random() * 900)}`,
      name: equipmentData.name?.trim() || 'Equipment Baru',
      category: equipmentData.category || 'Propulsi',
      model: equipmentData.model?.trim() || '-',
      serialNumber: equipmentData.serialNumber?.trim() || '-',
      maker: equipmentData.maker?.trim() || '-',
      location: equipmentData.location?.trim() || 'Engine Room',
      runningHours: running,
      lastMaintenanceHours: lastMaintenance,
      nextServiceHours: nextService,
      status,
      criticality: equipmentData.criticality || 'Tinggi',
      installedDate: equipmentData.installedDate || new Date().toISOString().split('T')[0],
      subComponents: Array.isArray(equipmentData.subComponents) ? equipmentData.subComponents : [],
      notes: equipmentData.notes || ''
    };

    setEquipment(prev => [newEq, ...prev]);
    showToast(`Equipment ${newEq.name} (${newEq.code}) berhasil ditambahkan ke database!`, 'success');
    return newEq;
  };

  const updateEquipment = (equipmentId, updatedData) => {
    setEquipment(prev => prev.map(eq => {
      if (eq.id !== equipmentId) return eq;

      const running = updatedData.runningHours !== undefined ? Number(updatedData.runningHours) : eq.runningHours;
      const nextService = updatedData.nextServiceHours !== undefined ? Number(updatedData.nextServiceHours) : eq.nextServiceHours;
      const hoursToNext = nextService - running;

      let status = updatedData.status || eq.status;
      if (!updatedData.status) {
        if (hoursToNext <= 0) {
          status = 'Overdue';
        } else if (hoursToNext <= 200) {
          status = 'Due Soon';
        } else {
          status = 'Normal';
        }
      }

      return {
        ...eq,
        ...updatedData,
        runningHours: running,
        nextServiceHours: nextService,
        status
      };
    }));
    showToast(`Data equipment berhasil diperbarui!`, 'success');
  };

  const deleteEquipment = (equipmentId) => {
    setEquipment(prev => {
      const eq = prev.find(e => e.id === equipmentId);
      const next = prev.filter(e => e.id !== equipmentId);
      showToast(`Equipment ${eq?.name || equipmentId} berhasil dihapus.`, 'info');
      return next;
    });
  };

  // 2. Work Order Actions
  const toggleChecklist = (woId, checkId) => {
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id !== woId) return wo;
      // support both new items format and legacy checklist
      if (wo.items && wo.items.length > 0) {
        const updatedItems = wo.items.map(item =>
          item.id === checkId ? { ...item, received: !item.received } : item
        );
        return { ...wo, items: updatedItems };
      }
      const updatedChecklist = (wo.checklist || []).map(item =>
        item.id === checkId ? { ...item, done: !item.done } : item
      );
      return { ...wo, checklist: updatedChecklist };
    }));
  };

  const updateWorkOrderStatus = (woId, newStatus) => {
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id !== woId) return wo;
      return { ...wo, status: newStatus };
    }));
    if (newStatus === 'Completed' || newStatus === 'Diterima di Kapal (Selesai)' || newStatus === 'Diterima di Kapal') {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      showToast(`Permintaan ${woId} berhasil diselesaikan & diterima di kapal!`, 'success');
    } else {
      showToast(`Status permintaan ${woId} diperbarui: ${newStatus}`, 'info');
    }
  };

  const updateWorkOrder = (woId, updatedData) => {
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id !== woId) return wo;
      return { ...wo, ...updatedData };
    }));
    showToast(`Data permintaan ${woId} berhasil diperbarui!`, 'success');
  };

  const addWorkOrder = (newWO) => {
    const generated = {
      ...newWO,
      id: newWO.id || `REQ-2026-${String(workOrders.length + 1).padStart(3, '0')}`,
      status: newWO.status || 'Diajukan',
      items: newWO.items || []
    };
    setWorkOrders(prev => [generated, ...prev]);
    showToast(`Permintaan barang baru berhasil dibuat: ${generated.id}`, 'success');
  };

  // 3. Sparepart, Logistics & Inventory Actions
  const updateSparepartStock = (partId, delta) => {
    setSpareparts(prev => prev.map(sp => {
      if (sp.id !== partId) return sp;
      const newStock = Math.max(0, sp.stockQty + delta);
      let status = 'Normal';
      if (newStock === 0) status = 'Critical';
      else if (newStock < sp.minStockQty) status = 'Low Stock';
      return { ...sp, stockQty: newStock, status };
    }));
    showToast(`Stok onboard telah disesuaikan`, 'info');
  };

  const transferStockToVessel = (itemId, qty) => {
    const transferQty = Math.max(1, Number(qty) || 1);
    let success = false;
    setSpareparts(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const currentWarehouse = item.stockWarehouse || 0;
      if (currentWarehouse < transferQty) {
        showToast(`Stok gudang darat (${currentWarehouse}) tidak mencukupi untuk transfer ${transferQty} unit!`, 'warning');
        return item;
      }
      success = true;
      const newWarehouse = currentWarehouse - transferQty;
      const newVessel = (item.stockQty || 0) + transferQty;
      let status = 'Normal';
      if (newVessel === 0) status = 'Critical';
      else if (newVessel < item.minStockQty) status = 'Low Stock';

      showToast(`Berhasil mutasi ${transferQty} ${item.unit} ${item.name} dari Gudang Darat ke Onboard KM. RP 2020!`, 'success');
      return {
        ...item,
        stockWarehouse: newWarehouse,
        stockQty: newVessel,
        status
      };
    }));
    return success;
  };

  const consumeStockOnboard = (itemId, qty, reason = '') => {
    const consumeQty = Math.max(1, Number(qty) || 1);
    setSpareparts(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const currentVessel = item.stockQty || 0;
      const newVessel = Math.max(0, currentVessel - consumeQty);
      let status = 'Normal';
      if (newVessel === 0) status = 'Critical';
      else if (newVessel < item.minStockQty) status = 'Low Stock';

      showToast(`Pemakaian ${consumeQty} ${item.unit} ${item.name} dicatat (${reason || 'Onboard KM. RP 2020'}).`, 'info');
      return {
        ...item,
        stockQty: newVessel,
        status
      };
    }));
  };

  const addLogisticItem = (itemData) => {
    const targetType = itemData.target || (itemData.category?.toLowerCase().includes('crew') || itemData.category?.toLowerCase().includes('bama') || itemData.category?.toLowerCase().includes('apd') ? 'Crew' : 'Kapal');
    const newItem = {
      ...itemData,
      id: `log-${Date.now()}`,
      code: itemData.code?.trim() || `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      vesselId: itemData.vesselId || 'v-001',
      target: targetType,
      stockQty: Number(itemData.stockQty) || 0,
      stockWarehouse: Number(itemData.stockWarehouse) || 0,
      minStockQty: Number(itemData.minStockQty) || 1,
      unitCost: Number(itemData.unitCost) || 0,
      status: Number(itemData.stockQty) === 0 ? 'Critical' : (Number(itemData.stockQty) < Number(itemData.minStockQty) ? 'Low Stock' : 'Normal')
    };
    setSpareparts(prev => [newItem, ...prev]);
    showToast(`Item logistik baru (${newItem.name}) berhasil didaftarkan ke sistem!`, 'success');
    return newItem;
  };

  const updateLogisticItem = (itemId, updatedData) => {
    setSpareparts(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const stockQty = updatedData.stockQty !== undefined ? Number(updatedData.stockQty) : item.stockQty;
      const minStockQty = updatedData.minStockQty !== undefined ? Number(updatedData.minStockQty) : item.minStockQty;
      let status = updatedData.status || item.status;
      if (stockQty === 0) status = 'Critical';
      else if (stockQty < minStockQty) status = 'Low Stock';
      else status = 'Normal';

      return {
        ...item,
        ...updatedData,
        stockQty,
        minStockQty,
        status
      };
    }));
    showToast(`Data barang logistik berhasil diperbarui!`, 'success');
  };

  const deleteLogisticItem = (itemId) => {
    setSpareparts(prev => {
      const it = prev.find(i => i.id === itemId);
      const next = prev.filter(i => i.id !== itemId);
      showToast(`Barang ${it?.name || itemId} berhasil dihapus dari inventaris.`, 'info');
      return next;
    });
  };

  // Requisitions & SPBK
  const addRequisition = (req) => {
    const newReq = {
      ...req,
      id: `SPBK-2026-${String(requisitions.length + 1).padStart(3, '0')}`,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: req.status || 'Diajukan',
      items: req.items || []
    };
    setRequisitions(prev => [newReq, ...prev]);
    showToast(`Surat Permintaan Barang Kapal (${newReq.id}) berhasil diajukan!`, 'success');
    return newReq;
  };

  const addLogisticRequisition = addRequisition;

  const updateRequisitionStatus = (reqId, newStatus, meta = {}) => {
    setRequisitions(prev => prev.map(req => {
      if (req.id !== reqId) return req;
      return {
        ...req,
        status: newStatus,
        lastStatusUpdate: new Date().toISOString().split('T')[0],
        ...meta
      };
    }));
    showToast(`Status SPBK ${reqId} diperbarui: ${newStatus}`, 'info');
  };

  const receiveRequisitionItems = (reqId) => {
    const targetReq = requisitions.find(r => r.id === reqId);
    if (!targetReq) return;

    // Update status to received
    setRequisitions(prev => prev.map(r => {
      if (r.id !== reqId) return r;
      return {
        ...r,
        status: 'Selesai Diterima di Kapal',
        receivedDate: new Date().toISOString().split('T')[0],
        items: (r.items || []).map(it => ({ ...it, received: true }))
      };
    }));

    // Increment onboard stock for matched items in catalog
    if (targetReq.items && targetReq.items.length > 0) {
      setSpareparts(prev => prev.map(sp => {
        const matchedItem = targetReq.items.find(it => it.partId === sp.id || it.name.toLowerCase() === sp.name.toLowerCase());
        if (!matchedItem) return sp;
        const addQty = Number(matchedItem.qty) || 0;
        const newVesselStock = sp.stockQty + addQty;
        let status = 'Normal';
        if (newVesselStock === 0) status = 'Critical';
        else if (newVesselStock < sp.minStockQty) status = 'Low Stock';
        return {
          ...sp,
          stockQty: newVesselStock,
          status
        };
      }));
    }

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    showToast(`Barang SPBK ${reqId} telah resmi diterima di atas kapal KM. RP 2020! Stok onboard bertambah.`, 'success');
  };

  // 3B. Finance & Vessel Budget Management Actions
  const updateVesselBudget = (budgetId, updatedBudgetData) => {
    setVesselBudgets(prev => {
      const exists = prev.some(b => b.id === budgetId || b.vesselId === updatedBudgetData.vesselId);
      if (!exists) {
        return [
          {
            ...updatedBudgetData,
            id: budgetId || `bud-${Date.now()}`,
            lastUpdated: new Date().toISOString().split('T')[0]
          },
          ...prev
        ];
      }
      return prev.map(b => {
        if (b.id !== budgetId && b.vesselId !== updatedBudgetData.vesselId) return b;
        return {
          ...b,
          ...updatedBudgetData,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      });
    });
    const shipName = updatedBudgetData.vesselName || 'kapal';
    showToast(`Pagu anggaran ${shipName} berhasil diperbarui oleh Finance!`, 'success');
  };

  const addExpenseTransaction = (expenseData) => {
    const newCost = {
      ...expenseData,
      id: expenseData.id || `cost-${Date.now().toString().slice(-4)}`,
      date: expenseData.date || new Date().toISOString().split('T')[0],
      amount: Number(expenseData.amount) || 0,
      vesselId: expenseData.vesselId || 'v-001'
    };

    // Add to costs
    setCosts(prev => [newCost, ...prev]);

    // Automatically update the matching budget category in vesselBudgets
    setVesselBudgets(prev => prev.map(b => {
      if (b.vesselId !== newCost.vesselId) return b;
      const updatedCategories = (b.categories || []).map(cat => {
        const matchCode = newCost.budgetCategoryCode && cat.code === newCost.budgetCategoryCode;
        const matchName = cat.name.toLowerCase().includes(newCost.category?.toLowerCase() || '') ||
                          newCost.category?.toLowerCase().includes(cat.name.toLowerCase());
        if (matchCode || matchName) {
          return {
            ...cat,
            spent: (cat.spent || 0) + newCost.amount
          };
        }
        return cat;
      });
      return {
        ...b,
        categories: updatedCategories,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
    }));

    showToast(`Pengeluaran riil Rp ${new Intl.NumberFormat('id-ID').format(newCost.amount)} berhasil dicatat & memotong pagu anggaran kapal!`, 'success');
    return newCost;
  };

  const deleteExpenseTransaction = (costId) => {
    const targetCost = costs.find(c => c.id === costId);
    if (!targetCost) return;

    // Deduct spent from budget
    setVesselBudgets(prev => prev.map(b => {
      if (b.vesselId !== targetCost.vesselId) return b;
      const updatedCategories = (b.categories || []).map(cat => {
        const matchCode = targetCost.budgetCategoryCode && cat.code === targetCost.budgetCategoryCode;
        const matchName = cat.name.toLowerCase().includes(targetCost.category?.toLowerCase() || '') ||
                          targetCost.category?.toLowerCase().includes(cat.name.toLowerCase());
        if (matchCode || matchName) {
          return {
            ...cat,
            spent: Math.max(0, (cat.spent || 0) - targetCost.amount)
          };
        }
        return cat;
      });
      return { ...b, categories: updatedCategories };
    }));

    setCosts(prev => prev.filter(c => c.id !== costId));
    showToast(`Transaksi pengeluaran ${costId} berhasil dibatalkan.`, 'info');
  };

  // 4. Crew & Leaves Actions
  const addCrew = (newCrewMember) => {
    const c = {
      ...newCrewMember,
      id: `crew-${Date.now()}`,
      leaveBalanceDays: newCrewMember.leaveBalanceDays || 14,
      status: newCrewMember.status || 'Onboard'
    };
    setCrew(prev => [c, ...prev]);
    showToast(`Crew baru ${c.name} berhasil didaftarkan`, 'success');
  };

  const updateCrew = (crewId, updatedFields) => {
    setCrew(prev => {
      const next = prev.map(c => c.id === crewId ? { ...c, ...updatedFields } : c);
      localStorage.setItem('pms_crew', JSON.stringify(next));
      return next;
    });
    showToast('Data crew berhasil diperbarui!', 'success');
  };

  const deleteCrew = (crewId) => {
    const crewMember = crew.find(c => c.id === crewId);
    setCrew(prev => {
      const next = prev.filter(c => c.id !== crewId);
      localStorage.setItem('pms_crew', JSON.stringify(next));
      return next;
    });
    showToast(`Crew ${crewMember?.name || crewId} berhasil dihapus.`, 'info');
  };

  const approveLeave = (leaveId, newStatus) => {
    setLeaves(prev => prev.map(l => l.id === leaveId ? { ...l, status: newStatus } : l));
    showToast(`Pengajuan cuti telah diperbarui: ${newStatus}`, 'success');
  };

  const submitLeave = (leaveData) => {
    const newLeave = {
      ...leaveData,
      id: `leave-${Date.now()}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending Ship Admin'
    };
    setLeaves(prev => [newLeave, ...prev]);
    showToast(`Pengajuan cuti diajukan untuk approval`, 'info');
  };

  const addDrill = (drillData) => {
    const d = {
      ...drillData,
      id: `drill-${Date.now()}`,
      conductedDate: drillData.conductedDate || new Date().toISOString().split('T')[0]
    };
    setDrills(prev => [d, ...prev]);
    showToast(`Laporan latihan keselamatan (Safety Drill) berhasil dicatat`, 'success');
  };

  // 4c. User Management Actions
  const addUser = (userData) => {
    const newId = `u-${Date.now()}`;
    const newUser = {
      id: newId,
      name: userData.name?.trim() || 'Pengguna Baru',
      email: userData.email?.toLowerCase().trim() || `user_${Date.now()}@baharimas.co.id`,
      password: userData.password || '123',
      role: userData.role || 'Admin Kapal / Nakhoda',
      title: userData.title?.trim() || 'Staff Operasional PT. PBK',
      shipAccess: userData.shipAccess || 'All',
      phone: userData.phone || '081288990011',
      status: userData.status || 'Aktif',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      createdAt: new Date().toISOString()
    };

    setUsers(prev => {
      const next = [newUser, ...prev];
      localStorage.setItem('pms_users', JSON.stringify(next));
      return next;
    });
    showToast(`Pengguna ${newUser.name} (${newUser.role}) berhasil didaftarkan!`, 'success');
    return newUser;
  };

  const updateUser = (userId, updatedFields) => {
    setUsers(prev => {
      const next = prev.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            ...updatedFields
          };
        }
        return u;
      });
      localStorage.setItem('pms_users', JSON.stringify(next));
      return next;
    });

    if (currentUser && currentUser.id === userId) {
      const updatedCurrent = { ...currentUser, ...updatedFields };
      setCurrentUser(updatedCurrent);
      if (updatedFields.role) {
        setCurrentRole(updatedFields.role);
      }
      localStorage.setItem('pms_current_user', JSON.stringify(updatedCurrent));
    }

    showToast('Data akun pengguna berhasil diperbarui!', 'success');
  };

  const deleteUser = (userId) => {
    if (currentUser && currentUser.id === userId) {
      showToast('Gagal: Anda tidak dapat menghapus akun yang sedang aktif digunakan!', 'error');
      return false;
    }

    const targetUser = users.find(u => u.id === userId);
    setUsers(prev => {
      const next = prev.filter(u => u.id !== userId);
      localStorage.setItem('pms_users', JSON.stringify(next));
      return next;
    });
    showToast(`Akun ${targetUser?.name || userId} berhasil dihapus dari sistem.`, 'info');
    return true;
  };

  const resetUsers = () => {
    setUsers(INITIAL_USERS);
    localStorage.setItem('pms_users', JSON.stringify(INITIAL_USERS));
    showToast('Daftar pengguna berhasil direset ke akun bawaan!', 'info');
  };

  // 4b. Vessel & Ship Document Actions
  const addVessel = (vesselData) => {
    try {
      const newId = `v-${Date.now()}`;
      const typeStr = String(vesselData?.type || 'Tugboat Twin Screw');
      const isBarge = typeStr.toLowerCase().includes('tongkang') || typeStr.toLowerCase().includes('barge');
      const cleanReg = String(vesselData?.regNo || '').trim();
      const baseNewVessel = {
        ...vesselData,
        id: newId,
        name: String(vesselData?.name || 'Kapal Baru').trim(),
        type: typeStr,
        regNo: cleanReg,
        imo: String(vesselData?.imo || '').trim(),
        callSign: String(vesselData?.callSign || '').trim() || (isBarge ? '-' : (cleanReg ? `YDB${cleanReg.replace(/[^A-Za-z0-9]/g, '').slice(0, 4)}` : '-')),
        gt: Number(vesselData?.gt) || (isBarge ? 3500 : 300),
        dwt: Number(vesselData?.dwt) || (isBarge ? 8500 : 450),
        yearBuilt: Number(vesselData?.yearBuilt) || new Date().getFullYear(),
        speedKnots: Number(vesselData?.speedKnots) || (isBarge ? 0 : 8.0),
        flag: vesselData?.flag || "Indonesia (IDN)",
        portOfRegistry: vesselData?.portOfRegistry || "Pontianak, Kalimantan Barat",
        status: vesselData?.status || "Operasional (Berlayar)",
        ownershipStatus: vesselData?.ownershipStatus || "As Owner & Operator",
        currentLocation: vesselData?.currentLocation || "Sungai Kapuas, Pontianak",
        builder: vesselData?.builder || "PT Dok & Perkapalan Baharimas",
        masterCaptain: vesselData?.masterCaptain || "",
        chiefEngineer: vesselData?.chiefEngineer || "",
        photo: vesselData?.photo || (
          isBarge
            ? "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80"
            : "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
        )
      };

      const newVessel = {
        ...baseNewVessel,
        particulars: vesselData?.particulars || createDefaultShipParticulars(baseNewVessel)
      };

      setVessels(prev => [newVessel, ...(prev || [])]);
      // Simpan nilai baru ke Data Master jika belum ada
      if (vesselData?.type) addMasterVesselType(vesselData.type);
      if (vesselData?.portOfRegistry) addMasterPort(vesselData.portOfRegistry);

      showToast(`Kapal ${newVessel.name} berhasil didaftarkan ke sistem armada!`, 'success');
      return newVessel;
    } catch (err) {
      console.error('[PMS] Failed to add vessel:', err);
      showToast('Gagal mendaftarkan kapal: ' + err.message, 'error');
      return null;
    }
  };

  const updateVesselParticulars = (vesselId, updatedParticulars) => {
    setVessels(prev => {
      const next = prev.map(v => {
        if (v.id === vesselId) {
          const currentParticulars = v.particulars || createDefaultShipParticulars(v);
          const newParticulars = {
            ...currentParticulars,
            ...updatedParticulars,
            lastUpdated: new Date().toISOString()
          };

          return {
            ...v,
            name: newParticulars.vesselName || v.name,
            gt: newParticulars.grossTonnage !== undefined ? Number(newParticulars.grossTonnage) || v.gt : v.gt,
            dwt: newParticulars.deadweight !== undefined ? Number(newParticulars.deadweight) || v.dwt : v.dwt,
            flag: newParticulars.flag || v.flag,
            portOfRegistry: newParticulars.portOfRegistry || v.portOfRegistry,
            callSign: newParticulars.callSign || v.callSign,
            imo: newParticulars.imoNumber || v.imo,
            regNo: newParticulars.officialNo?.split(' ')[0] || v.regNo,
            builder: newParticulars.builder || v.builder,
            yearBuilt: newParticulars.yearBuilt ? Number(newParticulars.yearBuilt) : v.yearBuilt,
            particulars: newParticulars
          };
        }
        return v;
      });
      localStorage.setItem('pms_vessels', JSON.stringify(next));
      return next;
    });

    if (updatedParticulars?.vesselType) addMasterVesselType(updatedParticulars.vesselType);
    if (updatedParticulars?.portOfRegistry) addMasterPort(updatedParticulars.portOfRegistry);

    try {
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.65 } });
    } catch {}

    showToast('Data Particular Kapal berhasil diperbarui & disimpan!', 'success');
  };

  const updateVessel = (vesselId, updatedFields) => {
    setVessels(prev => {
      const next = prev.map(v => {
        if (v.id === vesselId) {
          return {
            ...v,
            ...updatedFields,
            particulars: updatedFields.particulars
              ? { ...(v.particulars || {}), ...updatedFields.particulars }
              : v.particulars
          };
        }
        return v;
      });
      localStorage.setItem('pms_vessels', JSON.stringify(next));
      return next;
    });

    if (updatedFields?.type) addMasterVesselType(updatedFields.type);
    if (updatedFields?.portOfRegistry) addMasterPort(updatedFields.portOfRegistry);

    showToast('Data Kapal berhasil diperbarui!', 'success');
  };

  const deleteVessel = (vesselId) => {
    const vessel = vessels.find(v => v.id === vesselId);
    setVessels(prev => {
      const next = prev.filter(v => v.id !== vesselId);
      localStorage.setItem('pms_vessels', JSON.stringify(next));
      return next;
    });
    showToast(`Kapal ${vessel?.name || vesselId} berhasil dihapus dari armada.`, 'info');
  };

  const addShipDocument = (docData) => {
    const expiry = docData.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const issue = docData.issueDate || new Date().toISOString().split('T')[0];
    const todayRef = new Date('2026-09-09T00:00:00Z');
    const expDate = new Date(expiry + 'T00:00:00Z');
    const days = Math.round((expDate.getTime() - todayRef.getTime()) / (1000 * 60 * 60 * 24));
    let status = 'Active';
    if (days <= 0) status = 'Expired';
    else if (days <= 30) status = 'Due Soon';

    const newDoc = {
      ...docData,
      id: `doc-s-${Date.now()}`,
      category: docData.category || 'KSOP',
      issueDate: issue,
      expiryDate: expiry,
      status: docData.status || status,
      daysUntilExpiry: days,
      issuer: docData.issuer || (docData.category === 'KSOP' ? 'Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP)' : 'Biro Klasifikasi Indonesia (BKI) / Ditjen Hubla'),
      mandatoryAuditor: docData.mandatoryAuditor || (docData.category === 'KSOP' ? 'Syahbandar KSOP' : 'Surveyor BKI'),
      fileUrl: docData.fileUrl || null,
      fileName: docData.fileName || null,
      fileSize: docData.fileSize || null,
      fileType: docData.fileType || null,
      uploadedAt: docData.uploadedAt || (docData.fileUrl ? new Date().toISOString() : null)
    };

    // Auto-save new certificate name to master templates if not already present
    if (newDoc.name && newDoc.name.trim()) {
      const trimmedName = newDoc.name.trim();
      const docCat = newDoc.category || 'BKI';
      setDocumentTemplates(prev => {
        const exists = (prev || []).some(
          t => t.name && t.name.trim().toLowerCase() === trimmedName.toLowerCase() && (!docCat || t.category?.toLowerCase() === docCat.toLowerCase())
        );
        if (!exists) {
          const newTmpl = {
            name: trimmedName,
            category: docCat,
            defaultValidityYears: 1,
            issuer: newDoc.issuer || (docCat === 'BKI' ? 'Biro Klasifikasi Indonesia (BKI)' : 'Instansi Penerbit Terkait'),
            docPrefix: trimmedName.substring(0, 4).toUpperCase(),
            isCustom: true
          };
          const next = [...(prev || []), newTmpl];
          localStorage.setItem('pms_documentTemplates', JSON.stringify(next));
          return next;
        }
        return prev;
      });
    }

    setShipDocuments(prev => [newDoc, ...prev]);
    showToast(`Sertifikat ${newDoc.name} (${newDoc.category}) berhasil ditambahkan!`, 'success');
    return newDoc;
  };

  const updateShipDocument = (docId, updatedFields) => {
    setShipDocuments(prev => {
      const next = prev.map(d => {
        if (d.id === docId) {
          const expiry = updatedFields.expiryDate || d.expiryDate;
          const issue = updatedFields.issueDate || d.issueDate;
          const todayRef = new Date('2026-09-09T00:00:00Z');
          const expDate = new Date(expiry + 'T00:00:00Z');
          const days = Math.round((expDate.getTime() - todayRef.getTime()) / (1000 * 60 * 60 * 24));
          let status = 'Active';
          if (days <= 0) status = 'Expired';
          else if (days <= 30) status = 'Due Soon';

          return {
            ...d,
            ...updatedFields,
            issueDate: issue,
            expiryDate: expiry,
            daysUntilExpiry: days,
            status: updatedFields.status || status
          };
        }
        return d;
      });
      localStorage.setItem('pms_shipDocuments', JSON.stringify(next));
      return next;
    });
    showToast('Dokumen sertifikat kapal berhasil diperbarui!', 'success');
  };

  const deleteShipDocument = (docId) => {
    setShipDocuments(prev => {
      const next = prev.filter(d => d.id !== docId);
      localStorage.setItem('pms_shipDocuments', JSON.stringify(next));
      return next;
    });
    showToast('Dokumen sertifikat berhasil dihapus.', 'info');
  };

  // Certificate Categories Management Actions (BKI, Statutory, Asuransi, KSOP, Kesehatan + Custom)
  const addCertificateCategory = (newCat) => {
    const catId = newCat.id || (newCat.label || newCat.name || 'CUSTOM').replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
    const colorPalette = ['#38bdf8', '#10b981', '#a855f7', '#f59e0b', '#ec4899', '#06b6d4', '#84cc16', '#f97316'];
    const assignedColor = newCat.color || colorPalette[certificateCategories.length % colorPalette.length];

    const created = {
      id: catId,
      label: newCat.label || newCat.name || catId,
      code: newCat.code || catId,
      description: newCat.description || `Kategori dokumen ${newCat.label || catId}`,
      badgeClass: newCat.badgeClass || 'badge-info',
      color: assignedColor,
      borderColor: `${assignedColor}59`,
      bgColor: `${assignedColor}1f`,
      isCustom: true
    };

    setCertificateCategories(prev => {
      if (prev.some(c => c.id.toLowerCase() === catId.toLowerCase())) {
        return prev;
      }
      const next = [...prev, created];
      localStorage.setItem('pms_certificateCategories', JSON.stringify(next));
      return next;
    });
    showToast(`Kategori baru "${created.label}" berhasil ditambahkan!`, 'success');
    return created;
  };

  const deleteCertificateCategory = (catId) => {
    if (!catId) return false;
    const target = String(catId).trim().toLowerCase();

    // Find category to delete for toast message
    const catToDelete = (certificateCategories || []).find(c => {
      const cId = c.id ? String(c.id).trim().toLowerCase() : '';
      const cCode = c.code ? String(c.code).trim().toLowerCase() : '';
      const cLabel = c.label ? String(c.label).trim().toLowerCase() : '';
      return cId === target || cCode === target || cLabel === target;
    });

    const deletedLabel = catToDelete ? catToDelete.label : catId;

    setCertificateCategories(prev => {
      const next = (prev || []).filter(c => {
        const cId = c.id ? String(c.id).trim().toLowerCase() : '';
        const cCode = c.code ? String(c.code).trim().toLowerCase() : '';
        const cLabel = c.label ? String(c.label).trim().toLowerCase() : '';
        return cId !== target && cCode !== target && cLabel !== target;
      });
      localStorage.setItem('pms_certificateCategories', JSON.stringify(next));
      return next;
    });

    showToast(`Kategori "${deletedLabel}" berhasil dihapus.`, 'info');
    return true;
  };

  // =========================================================================
  // Master Data Nama Sertifikat (Document Templates)
  // =========================================================================
  const addDocumentTemplate = (newTmpl) => {
    if (!newTmpl || !newTmpl.name) return null;
    const name = newTmpl.name.trim();
    const category = newTmpl.category || 'BKI';
    const id = newTmpl.id || `cn-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const created = {
      id,
      name,
      category,
      defaultValidityYears: Number(newTmpl.defaultValidityYears) || 1,
      issuer: newTmpl.issuer || (category === 'KSOP' ? 'Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP)' : category === 'BKI' ? 'Biro Klasifikasi Indonesia (BKI)' : 'Instansi Penerbit Terkait'),
      description: newTmpl.description?.trim() || `Sertifikat resmi ${name}`,
      docPrefix: newTmpl.docPrefix || name.substring(0, 4).toUpperCase(),
      isCustom: true
    };

    setDocumentTemplates(prev => {
      if ((prev || []).some(t => t.name.toLowerCase() === name.toLowerCase() && (t.category || '').toLowerCase() === category.toLowerCase())) {
        return prev;
      }
      const next = [...(prev || []), created];
      localStorage.setItem('pms_documentTemplates', JSON.stringify(next));
      return next;
    });

    showToast(`Nama sertifikat "${created.name}" (${created.category}) berhasil disimpan ke Data Master!`, 'success');
    return created;
  };

  const deleteDocumentTemplate = (idOrName, category = null) => {
    if (!idOrName) return false;
    const target = String(idOrName).trim().toLowerCase();

    setDocumentTemplates(prev => {
      const next = (prev || []).filter(t => {
        const tId = (t.id || '').toLowerCase();
        const tName = (t.name || '').toLowerCase();
        const matchesTarget = tId === target || tName === target;
        if (!matchesTarget) return true;
        if (category && (t.category || '').toLowerCase() !== category.toLowerCase()) return true;
        return false;
      });
      localStorage.setItem('pms_documentTemplates', JSON.stringify(next));
      return next;
    });
    showToast(`Nama sertifikat berhasil dihapus dari Data Master.`, 'info');
    return true;
  };

  const clearDocumentTemplates = () => {
    setDocumentTemplates([]);
    localStorage.setItem('pms_documentTemplates', JSON.stringify([]));
    showToast('Seluruh master data nama sertifikat berhasil dikosongkan.', 'info');
  };

  // =========================================================================
  // Master Data Jenis Survey / Siklus Pemeriksaan Kapal
  // =========================================================================
  const addMasterSurveyType = (newSurvey) => {
    if (!newSurvey || !newSurvey.name) return null;
    const name = newSurvey.name.trim();
    const category = newSurvey.category || 'BKI';
    const intervalYears = newSurvey.intervalYears !== undefined ? Number(newSurvey.intervalYears) : 1;
    const id = newSurvey.id || `st-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const created = {
      id,
      name,
      category,
      intervalYears,
      description: newSurvey.description?.trim() || `Jenis pemeriksaan ${name}`,
      isCustom: true
    };

    setMasterSurveyTypes(prev => {
      if ((prev || []).some(s => s.name.toLowerCase() === name.toLowerCase() && (s.category || '').toLowerCase() === category.toLowerCase())) {
        return prev;
      }
      const next = [...(prev || []), created];
      localStorage.setItem('pms_masterSurveyTypes', JSON.stringify(next));
      return next;
    });

    showToast(`Jenis survey "${created.name}" (${created.category}) berhasil ditambahkan ke Data Master!`, 'success');
    return created;
  };

  const deleteMasterSurveyType = (idOrName, category = null) => {
    if (!idOrName) return false;
    const target = String(idOrName).trim().toLowerCase();

    setMasterSurveyTypes(prev => {
      const next = (prev || []).filter(s => {
        const sId = (s.id || '').toLowerCase();
        const sName = (s.name || '').toLowerCase();
        const matchesTarget = sId === target || sName === target;
        if (!matchesTarget) return true;
        if (category && (s.category || '').toLowerCase() !== category.toLowerCase()) return true;
        return false;
      });
      localStorage.setItem('pms_masterSurveyTypes', JSON.stringify(next));
      return next;
    });
    showToast(`Jenis survey berhasil dihapus dari Data Master.`, 'info');
    return true;
  };

  const clearMasterSurveyTypes = () => {
    setMasterSurveyTypes([]);
    localStorage.setItem('pms_masterSurveyTypes', JSON.stringify([]));
    showToast('Seluruh master data jenis survey berhasil dikosongkan.', 'info');
  };

  // =========================================================================
  // 6. ISM Code Audit System (DOC & SMC, Internal & External, NC Open/Close)
  // =========================================================================

  const addAuditSession = (auditData) => {
    const isInt = auditData.auditType === 'Internal';
    const std = auditData.standard || 'DOC';
    const year = new Date().getFullYear();
    const randomCode = Math.floor(Math.random() * 900 + 100);
    const auditNo = auditData.auditNo?.trim() || `AUD-${isInt ? 'INT' : 'EXT'}-${std}-${year}/${randomCode}`;

    const newAudit = {
      ...auditData,
      id: `aud-${Date.now()}`,
      auditNo,
      auditType: auditData.auditType || 'Internal',
      standard: std,
      targetType: auditData.targetType || (std === 'DOC' ? 'Office' : 'Vessel'),
      targetName: auditData.targetName || (auditData.vesselId ? (vessels.find(v => v.id === auditData.vesselId)?.name || 'Kapal Armada') : 'Kantor Pusat PT. Pelayaran Baharimas Kalimantan (Pontianak)'),
      vesselId: auditData.vesselId || null,
      leadAuditor: auditData.leadAuditor || (isInt ? 'DPA / Lead Auditor Internal PT. PBK' : 'Surveyor BKI / Ditjen Hubla'),
      auditTeam: Array.isArray(auditData.auditTeam) ? auditData.auditTeam : (auditData.auditTeam ? [auditData.auditTeam] : ['Tim Inspektor Keselamatan']),
      auditee: auditData.auditee || (std === 'DOC' ? 'Direktur Operasional & DPA' : 'Nakhoda & KKM'),
      auditDate: auditData.auditDate || new Date().toISOString().split('T')[0],
      targetCloseDate: auditData.targetCloseDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      scope: auditData.scope || `Audit ${auditData.auditType || 'Internal'} Kepatuhan ISM Code Standar ${std}.`,
      status: auditData.status || 'In Progress',
      totalItemsChecked: Number(auditData.totalItemsChecked) || 20,
      itemsComplied: Number(auditData.itemsComplied) || 18,
      findingsSummary: auditData.findingsSummary || {
        majorNC: 0,
        minorNC: 0,
        observation: 0,
        totalOpen: 0,
        totalClosed: 0
      }
    };

    setAudits(prev => {
      const next = [newAudit, ...prev];
      localStorage.setItem('pms_audits', JSON.stringify(next));
      return next;
    });

    showToast(`Sesi audit ${newAudit.auditNo} (${newAudit.auditType} - ${newAudit.standard}) berhasil dibuat!`, 'success');
    return newAudit;
  };

  const updateAuditSession = (auditId, updatedFields) => {
    setAudits(prev => {
      const next = prev.map(a => (a.id === auditId ? { ...a, ...updatedFields } : a));
      localStorage.setItem('pms_audits', JSON.stringify(next));
      return next;
    });
    showToast('Data sesi audit berhasil diperbarui!', 'success');
  };

  const deleteAuditSession = (auditId) => {
    const target = audits.find(a => a.id === auditId);
    setAudits(prev => {
      const next = prev.filter(a => a.id !== auditId);
      localStorage.setItem('pms_audits', JSON.stringify(next));
      return next;
    });
    setAuditFindings(prev => {
      const next = prev.filter(f => f.auditId !== auditId);
      localStorage.setItem('pms_auditFindings', JSON.stringify(next));
      return next;
    });
    showToast(`Sesi audit ${target?.auditNo || auditId} berhasil dihapus.`, 'info');
  };

  const addAuditFinding = (findingData) => {
    const std = findingData.standard || 'DOC';
    const randomNum = Math.floor(Math.random() * 9000 + 1000);
    const findingNo = findingData.findingNo?.trim() || `NC-${std}-${randomNum}`;

    const newFinding = {
      ...findingData,
      id: `nc-${Date.now()}`,
      findingNo,
      auditId: findingData.auditId || (audits[0]?.id || 'aud-doc-001'),
      auditNo: findingData.auditNo || (audits.find(a => a.id === findingData.auditId)?.auditNo || 'AUD-ISM'),
      auditType: findingData.auditType || 'Internal',
      standard: std,
      targetName: findingData.targetName || (findingData.vesselId ? (vessels.find(v => v.id === findingData.vesselId)?.name) : 'Kantor Pusat'),
      vesselId: findingData.vesselId || null,
      clauseCode: findingData.clauseCode || 'ISM-10',
      clauseName: findingData.clauseName || 'Pemeliharaan Kapal & Perlengkapan',
      category: findingData.category || 'Minor NC',
      status: 'NC Open',
      description: findingData.description || '',
      objectiveEvidence: findingData.objectiveEvidence || '',
      dateIdentified: findingData.dateIdentified || new Date().toISOString().split('T')[0],
      dueDate: findingData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedTo: findingData.assignedTo || 'PIC Terkait',
      auditor: findingData.auditor || 'Lead Auditor',
      linkedRequisitionId: findingData.linkedRequisitionId || null,
      linkedRequisitionTitle: findingData.linkedRequisitionTitle || null,
      linkedCertificateId: findingData.linkedCertificateId || null,
      evidence: {
        hasSubmitted: false,
        submissionDate: null,
        submittedBy: null,
        rootCause: null,
        correctiveAction: null,
        preventiveAction: null,
        fileUrl: null,
        fileName: null,
        fileSize: null,
        auditorReviewNotes: null,
        closedDate: null
      }
    };

    setAuditFindings(prev => {
      const next = [newFinding, ...prev];
      localStorage.setItem('pms_auditFindings', JSON.stringify(next));
      return next;
    });

    if (newFinding.auditId) {
      setAudits(prev => prev.map(a => {
        if (a.id === newFinding.auditId) {
          const currentSummary = a.findingsSummary || { majorNC: 0, minorNC: 0, observation: 0, totalOpen: 0, totalClosed: 0 };
          return {
            ...a,
            findingsSummary: {
              ...currentSummary,
              majorNC: newFinding.category === 'Major NC' ? currentSummary.majorNC + 1 : currentSummary.majorNC,
              minorNC: newFinding.category === 'Minor NC' ? currentSummary.minorNC + 1 : currentSummary.minorNC,
              observation: newFinding.category === 'Observation' ? currentSummary.observation + 1 : currentSummary.observation,
              totalOpen: currentSummary.totalOpen + 1
            }
          };
        }
        return a;
      }));
    }

    showToast(`Temuan ${newFinding.findingNo} (${newFinding.category}) berhasil dicatat sebagai NC OPEN!`, 'warning');
    return newFinding;
  };

  const updateAuditFinding = (findingId, updatedFields) => {
    setAuditFindings(prev => {
      const next = prev.map(f => (f.id === findingId ? { ...f, ...updatedFields } : f));
      localStorage.setItem('pms_auditFindings', JSON.stringify(next));
      return next;
    });
    showToast('Data temuan audit berhasil diperbarui!', 'success');
  };

  const deleteAuditFinding = (findingId) => {
    const target = auditFindings.find(f => f.id === findingId);
    setAuditFindings(prev => {
      const next = prev.filter(f => f.id !== findingId);
      localStorage.setItem('pms_auditFindings', JSON.stringify(next));
      return next;
    });
    showToast(`Temuan ${target?.findingNo || findingId} berhasil dihapus.`, 'info');
  };

  const submitAuditEvidence = (findingId, evidenceData) => {
    setAuditFindings(prev => {
      const next = prev.map(f => {
        if (f.id === findingId) {
          return {
            ...f,
            status: 'Eviden Submitted',
            evidence: {
              ...f.evidence,
              ...evidenceData,
              hasSubmitted: true,
              submissionDate: new Date().toISOString().split('T')[0]
            }
          };
        }
        return f;
      });
      localStorage.setItem('pms_auditFindings', JSON.stringify(next));
      return next;
    });
    showToast('Bukti eviden perbaikan berhasil diajukan! Menunggu verifikasi auditor.', 'info');
  };

  const closeAuditFinding = (findingId, auditorReviewNotes) => {
    const todayStr = new Date().toISOString().split('T')[0];
    let findingName = '';

    setAuditFindings(prev => {
      const next = prev.map(f => {
        if (f.id === findingId) {
          findingName = f.findingNo;
          return {
            ...f,
            status: 'NC Close',
            evidence: {
              ...f.evidence,
              auditorReviewNotes: auditorReviewNotes || 'Tindakan perbaikan dan bukti eviden telah diverifikasi memenuhi ISM Code.',
              closedDate: todayStr
            }
          };
        }
        return f;
      });
      localStorage.setItem('pms_auditFindings', JSON.stringify(next));
      return next;
    });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    showToast(`Temuan ${findingName} resmi diverifikasi & DITUTUP (NC CLOSE)!`, 'success');
  };

  const reopenAuditFinding = (findingId, reasonNotes) => {
    let findingName = '';
    setAuditFindings(prev => {
      const next = prev.map(f => {
        if (f.id === findingId) {
          findingName = f.findingNo;
          return {
            ...f,
            status: 'NC Open',
            evidence: {
              ...f.evidence,
              auditorReviewNotes: reasonNotes || 'Eviden belum memadai, temuan dibuka kembali untuk perbaikan lanjutan.',
              closedDate: null
            }
          };
        }
        return f;
      });
      localStorage.setItem('pms_auditFindings', JSON.stringify(next));
      return next;
    });
    showToast(`Temuan ${findingName} dibuka kembali (NC OPEN) untuk revisi eviden.`, 'warning');
  };

  // 5. WhatsApp & Notification Engine (Multi-Interval: 1 Hari, 1 Minggu, 1 Bulan, 1 Tahun, Kustom & Auto-Send)
  const updateNotificationSettings = (newSettings) => {
    setNotificationSettings(prev => {
      const updated = typeof newSettings === 'function' ? newSettings(prev) : { ...prev, ...newSettings };
      localStorage.setItem('pms_notificationSettings', JSON.stringify(updated));
      return updated;
    });
    showToast('Konfigurasi notifikasi & auto-send berhasil disimpan!', 'success');
  };

  const addCustomThreshold = (days, label, description, notifyChannels) => {
    const numDays = Math.max(1, parseInt(days, 10) || 1);
    const newTh = {
      id: `th-custom-${Date.now()}`,
      days: numDays,
      unit: 'custom',
      label: label?.trim() || `H-${numDays} Hari (Kustom)`,
      description: description?.trim() || `Pengingat kustom ${numDays} hari sebelum jatuh tempo`,
      enabled: true,
      notifyChannels: notifyChannels || ['WhatsApp', 'Email', 'Google Calendar']
    };

    setNotificationSettings(prev => {
      const updated = {
        ...prev,
        customThresholds: [...(prev.customThresholds || []), newTh]
      };
      localStorage.setItem('pms_notificationSettings', JSON.stringify(updated));
      return updated;
    });
    showToast(`Ambang batas kustom H-${numDays} hari berhasil ditambahkan!`, 'success');
    return newTh;
  };

  const removeCustomThreshold = (id) => {
    setNotificationSettings(prev => {
      const updated = {
        ...prev,
        customThresholds: (prev.customThresholds || []).filter(t => t.id !== id)
      };
      localStorage.setItem('pms_notificationSettings', JSON.stringify(updated));
      return updated;
    });
    showToast('Ambang batas kustom berhasil dihapus.', 'info');
  };

  const toggleThresholdActive = (id, isCustom = false) => {
    setNotificationSettings(prev => {
      let updated;
      if (isCustom) {
        updated = {
          ...prev,
          customThresholds: (prev.customThresholds || []).map(t =>
            t.id === id ? { ...t, enabled: !t.enabled } : t
          )
        };
      } else {
        updated = {
          ...prev,
          thresholds: (prev.thresholds || []).map(t =>
            t.id === id ? { ...t, enabled: !t.enabled } : t
          )
        };
      }
      localStorage.setItem('pms_notificationSettings', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleThresholdChannel = (id, channelName, isCustom = false) => {
    setNotificationSettings(prev => {
      const updateList = (list) => list.map(t => {
        if (t.id !== id) return t;
        const exists = t.notifyChannels.includes(channelName);
        const nextChannels = exists
          ? t.notifyChannels.filter(c => c !== channelName)
          : [...t.notifyChannels, channelName];
        return { ...t, notifyChannels: nextChannels };
      });

      const updated = isCustom
        ? { ...prev, customThresholds: updateList(prev.customThresholds || []) }
        : { ...prev, thresholds: updateList(prev.thresholds || []) };

      localStorage.setItem('pms_notificationSettings', JSON.stringify(updated));
      return updated;
    });
  };

  const updateAutoSendConfig = (partial) => {
    setNotificationSettings(prev => {
      const updated = {
        ...prev,
        autoSend: {
          ...prev.autoSend,
          ...partial
        }
      };
      localStorage.setItem('pms_notificationSettings', JSON.stringify(updated));
      return updated;
    });
    showToast('Pengaturan jam & parameter Auto-Send berhasil diperbarui!', 'success');
  };

  // Helper quick test: set scheduled time to now + 1 minute
  const setTestScheduleTimeNowPlusOneMinute = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const newTime = `${hh}:${mm}`;

    setNotificationSettings(prev => {
      const updated = {
        ...prev,
        autoSend: {
          ...prev.autoSend,
          enabled: true,
          scheduleTime: newTime,
          lastRunDate: '' // Reset so it will fire on this minute
        }
      };
      localStorage.setItem('pms_notificationSettings', JSON.stringify(updated));
      return updated;
    });

    showToast(`⏱️ Waktu kirim otomatis diatur ke ${newTime} WIB (+1 menit)! Sistem akan mengeksekusi otomatis saat jarum jam mencapai ${newTime}.`, 'info');
    return newTime;
  };

  // WhatsApp Sender with tailored messages per interval & optional direct API Gateway
  const sendWhatsAppReminder = async (item, type = 'crew_cert', options = {}) => {
    let phone = '6281200000000';
    let recipientName = 'Crew / Admin';
    const offsetDays = options.offsetDays !== undefined ? Number(options.offsetDays) : (item.daysUntilExpiry || 30);

    const v = vessels.find(ship => ship.id === item.vesselId);
    const vesselName = v?.name || 'Fleet';

    if (type === 'crew_cert') {
      const targetCrew = crew.find(c => c.id === item.crewId);
      phone = targetCrew?.whatsapp || '6281288991122';
      recipientName = targetCrew?.name || item.crewName;
    } else if (type === 'ship_doc') {
      recipientName = `Admin Kapal & Nakhoda ${vesselName}`;
      phone = '6281288991122';
    } else if (type === 'work_order') {
      recipientName = item.assignedTo || 'Teknisi / Chief Engineer';
      phone = '6281288991122';
    } else if (type === 'audit_nc_open') {
      recipientName = options.recipientName || item.assignedTo || `Nakhoda & KKM ${item.targetName || vesselName}`;
      phone = options.phone || '6281288991122';
    } else if (type === 'audit_nc_close') {
      recipientName = options.recipientName || 'DPA & Marine Superintendent PBK';
      phone = options.phone || '6281288991122';
    }

    let headerPrefix = '*🔔 PEMBERITAHUAN JATUH TEMPO DOKUMEN*';
    let urgencyBadge = 'Rentang 30 Hari';
    if (offsetDays === 1) {
      headerPrefix = '*🚨 PERINGATAN DARURAT H-1 (HARI TERAKHIR)*';
      urgencyBadge = 'H-1 Hari';
    } else if (offsetDays === 7) {
      headerPrefix = '*⚠️ PERINGATAN KRITIS H-1 MINGGU (H-7)*';
      urgencyBadge = 'H-1 Minggu';
    } else if (offsetDays === 30) {
      headerPrefix = '*🔔 PEMBERITAHUAN JATUH TEMPO H-1 BULAN (H-30)*';
      urgencyBadge = 'H-1 Bulan';
    } else if (offsetDays === 365) {
      headerPrefix = '*📋 PERSIAPAN ANGGARAN DINI H-1 TAHUN (H-365)*';
      urgencyBadge = 'H-1 Tahun';
    } else if (offsetDays > 0) {
      headerPrefix = `*📌 PENGINGAT JATUH TEMPO H-${offsetDays} HARI*`;
      urgencyBadge = `H-${offsetDays} Hari`;
    }

    let msg = options.customMessage;
    if (!msg) {
      if (type === 'audit_nc_open') {
        const range = calculateNCRange(item);
        const lateInfo = range?.isOverdue
          ? `🚨 STATUS: MELEWATI BATAS WAKTU (${Math.abs(range.remainingDays)} Hari Overdue)!`
          : `⏳ STATUS: NC TERBUKA (Berjalan ${range?.activeDays} hari, sisa ${range?.remainingDays} hari)`;

        msg = `*🚨 NOTIFIKASI TEMUAN AUDIT ISM CODE (NC OPEN)*\n` +
          `_PT. Pelayaran Baharimas Kalimantan - Sistem PMS & SMS_\n\n` +
          `Kepada Yth: *${recipientName}*\n` +
          `Kapal / Entitas: *${item.targetName || vesselName}*\n` +
          `No. Temuan: *${item.findingNo}* [${item.category}]\n` +
          `Klausul ISM: *${item.clauseCode} - ${item.clauseName}*\n` +
          `Standar Audit: *${item.standard} (ISM Code)*\n\n` +
          `*Deskripsi Ketidaksesuaian:*\n"${item.description}"\n\n` +
          `*📅 RENTANG WAKTU TINDAKAN KOREKTIF (CAP):*\n` +
          `• Tanggal Audit Terbuka: *${range?.openDateStr || item.dateIdentified}*\n` +
          `• Target Batas Close: *${range?.dueDateStr || item.dueDate}*\n` +
          `• ${lateInfo}\n\n` +
          `*INSTRUKSI AUDITEE KAPAL:*\n` +
          `Harap segera mengajukan rencana tindakan korektif (CAP) dan mengunggah dokumen/foto eviden perbaikan di Portal PMS Baharimas sebelum batas waktu berakhir.\n\n` +
          `_Pusat Pengendali Kepatuhan Armada PT. Pelayaran Baharimas Kalimantan_`;
        urgencyBadge = range?.isOverdue ? 'NC Overdue' : 'NC Open';
      } else if (type === 'audit_nc_close') {
        const range = calculateNCRange(item);
        msg = `*✅ NOTIFIKASI PENUTUPAN TEMUAN AUDIT (NC CLOSE)*\n` +
          `_PT. Pelayaran Baharimas Kalimantan - Sistem PMS & SMS_\n\n` +
          `Kepada Yth: *${recipientName}*\n` +
          `Kapal / Entitas: *${item.targetName || vesselName}*\n` +
          `No. Temuan: *${item.findingNo}* [${item.category}]\n` +
          `Klausul ISM: *${item.clauseCode} - ${item.clauseName}*\n` +
          `Standar Audit: *${item.standard} (ISM Code)*\n\n` +
          `*HASIL VERIFIKASI & CLOSING:*\n` +
          `Tindakan koreksi dan dokumen eviden perbaikan telah diverifikasi efektif oleh Lead Auditor DPA / Surveyor BKI. Status temuan resmi dinyatakan *NC CLOSE (TUNTAS)*.\n\n` +
          `*⏱️ LAPORAN EFISIENSI RENTANG WAKTU (LEAD TIME):*\n` +
          `• Tanggal Dibuka: *${range?.openDateStr || item.dateIdentified}*\n` +
          `• Target Awal: *${range?.dueDateStr || item.dueDate}*\n` +
          `• Tanggal Ditutup Resmi: *${range?.closedDateStr || 'Selesai'}*\n` +
          `• Durasi Penyelesaian: *${range?.resolutionDays || 1} Hari* (${range?.varianceText || 'Sesuai Target'})\n\n` +
          `Status Kepatuhan: *100% COMPLIANT (IMO ISM CODE & BKI)*\n\n` +
          `_Pusat Pengendali Kepatuhan Armada PT. Pelayaran Baharimas Kalimantan_`;
        urgencyBadge = 'NC Close Tuntas';
      } else if (type === 'crew_cert') {
        msg = `${headerPrefix} - SISTEM PMS PT. PELAYARAN BAHARIMAS KALIMANTAN\n\n` +
          `Yth. *${recipientName}*,\n` +
          `Sertifikat Anda: *${item.name}* (No: ${item.certificateNo})\n` +
          `Tanggal Jatuh Tempo: *${item.expiryDate}* (${item.daysUntilExpiry} hari lagi).\n\n` +
          (offsetDays <= 1
            ? `PENTING: Besok adalah hari terakhir masa berlaku! Harap segera lapor Nakhoda untuk pengurusan darurat kelaiklautan.\n\n`
            : offsetDays <= 7
            ? `PENTING: Tersisa 1 minggu sebelum sertifikat habis masa berlaku. Mohon koordinasikan dengan personalia kapal.\n\n`
            : offsetDays <= 30
            ? `Harap segera memproses perpanjangan sertifikasi ke Bagian Personalia agar kelaiklautan kapal tetap terjaga.\n\n`
            : offsetDays <= 365
            ? `Pemberitahuan awal 1 tahun untuk persiapan pembaharuan sertifikat kepelautan STCW.\n\n`
            : `Harap koordinasikan pembaruan dokumen ini tepat waktu.\n\n`) +
          `_Sistem PMS PT. Pelayaran Baharimas Kalimantan_`;
      } else if (type === 'ship_doc') {
        msg = `${headerPrefix} - SISTEM PMS BAHARIMAS\n\n` +
          `Kepada: *${recipientName}*\n` +
          `Dokumen: *${item.name}* (No: ${item.documentNo})\n` +
          `Kapal: *${vesselName}*\n` +
          `Tanggal Jatuh Tempo: *${item.expiryDate}* (${item.daysUntilExpiry} hari lagi).\n\n` +
          (offsetDays <= 1
            ? `TINDAKAN MENDESAK: Sertifikat akan kadaluarsa besok! Pastikan dispensasi atau survey BKI/Syahbandar telah terkonfirmasi.\n\n`
            : offsetDays <= 7
            ? `PERHATIAN KRITIS: Tersisa 7 hari. Konfirmasi jadwal kedatangan surveyor BKI/Syahbandar ke atas kapal.\n\n`
            : offsetDays <= 30
            ? `Segera daftarkan permohonan survey ke Kantor BKI / Syahbandar terdekat.\n\n`
            : offsetDays <= 365
            ? `Perencanaan anggaran survey besar & pembaharuan sertifikat kelas untuk tahun anggaran mendatang.\n\n`
            : `Segera tindak lanjuti sebelum batas toleransi habis.\n\n`) +
          `_Pusat Pengendali Armada PMS PT. Pelayaran Baharimas Kalimantan_`;
      } else {
        msg = `*PERINGATAN WORK ORDER OVERDUE*\n\nKepada: *${recipientName}*\nWork Order: *${item.title}* (ID: ${item.id})\nStatus: OVERDUE\nTarget: ${item.targetHours} Jam (Saat ini: ${item.currentRunningHours} Jam).\n\nHarap segera menindaklanjuti servicing.`;
      }
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;

    const gateway = notificationSettings.autoSend?.whatsappGateway;
    let deliveryStatus = 'Delivered';
    let channelLabel = 'WhatsApp Direct';

    // Direct API Gateway dispatch if API key provided and requested
    if (options.useGatewayApi && gateway?.apiKey && gateway?.apiUrl) {
      try {
        await fetch(gateway.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': gateway.apiKey },
          body: JSON.stringify({ phone: cleanPhone, message: msg })
        });
        deliveryStatus = `Delivered (${gateway.provider})`;
        channelLabel = `WhatsApp API (${gateway.provider})`;
      } catch (err) {
        console.warn('API Gateway send error, falling back to URL:', err);
      }
    }

    // Log to notification audit
    const newLog = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID'),
      channel: channelLabel,
      target: `${recipientName} (${phone})`,
      vesselName: item.targetName || vesselName,
      subject: type === 'audit_nc_open'
        ? `Notifikasi NC Open: ${item.findingNo} (${item.targetName || vesselName})`
        : type === 'audit_nc_close'
        ? `Notifikasi NC Close: ${item.findingNo} (${item.targetName || vesselName})`
        : `Reminder ${urgencyBadge}: ${item.name || item.title}`,
      message: msg,
      status: deliveryStatus,
      thresholdTriggered: urgencyBadge
    };

    setNotificationLogs(prev => [newLog, ...prev]);

    if (!options.silent) {
      if (!options.useGatewayApi || !gateway?.apiKey) {
        window.open(waUrl, '_blank');
      }
      showToast(`Pesan WhatsApp telah disiapkan & dibuka ke ${recipientName} (${urgencyBadge})`, 'success');
    }

    return newLog;
  };

  // Helper specifically for sending Audit NC Open / Close WhatsApp notifications
  const sendAuditWhatsAppNotification = async (finding, notificationType = 'open', options = {}) => {
    const type = notificationType === 'open' ? 'audit_nc_open' : 'audit_nc_close';
    return await sendWhatsAppReminder(finding, type, options);
  };

  // Email recipient resolver (backend-ready: uses users + gateway defaults)
  const resolveEmailRecipients = (item, type = 'crew_cert', options = {}) => {
    const gateway = { ...DEFAULT_EMAIL_GATEWAY, ...(notificationSettings.autoSend?.emailGateway || {}) };
    const defaults = normalizeEmailList(gateway.defaultRecipients?.length ? gateway.defaultRecipients : ['fleet.ops@baharimas.co.id']);
    if (options.to) return normalizeEmailList(options.to);
    if (options.recipientEmail) return normalizeEmailList(options.recipientEmail);
    const userEmailByRole = (keyword) => {
      const u = (users || []).find(x => (x.role || '').toLowerCase().includes(keyword.toLowerCase()));
      return u?.email || null;
    };
    if (type === 'crew_cert') {
      const targetCrew = crew.find(c => c.id === item.crewId);
      const crewEmail = targetCrew?.email || null;
      return normalizeEmailList([crewEmail, userEmailByRole('HR'), userEmailByRole('Nakhoda'), ...defaults].filter(Boolean));
    }
    if (type === 'ship_doc') return normalizeEmailList([userEmailByRole('Nakhoda'), userEmailByRole('Fleet'), 'nakhoda@baharimas.co.id', ...defaults]);
    if (type === 'work_order') return normalizeEmailList([userEmailByRole('Teknisi'), userEmailByRole('Chief'), 'kkm@baharimas.co.id', ...defaults]);
    if (type === 'audit_nc_open') return normalizeEmailList([options.email || null, userEmailByRole('Nakhoda'), userEmailByRole('Fleet'), ...defaults].filter(Boolean));
    if (type === 'audit_nc_close') return normalizeEmailList([options.email || null, userEmailByRole('Super Admin'), 'admin@baharimas.co.id', ...defaults].filter(Boolean));
    return defaults;
  };

  // Email Sender — otomatis + backend-ready (mailto fallback saat backend belum ada)
  const sendEmailReminder = async (item, type = 'crew_cert', options = {}) => {
    const offsetDays = options.offsetDays !== undefined ? Number(options.offsetDays) : (item.daysUntilExpiry ?? 30);
    const v = vessels.find(ship => ship.id === item.vesselId);
    const vesselName = v?.name || item.targetName || 'Fleet';
    const gateway = { ...DEFAULT_EMAIL_GATEWAY, ...(notificationSettings.autoSend?.emailGateway || {}) };
    const toList = resolveEmailRecipients(item, type, options);
    if (!toList.length) {
      if (!options.silent) showToast('Alamat email penerima tidak ditemukan. Isi Email Gateway / data user dulu.', 'warning');
      return null;
    }
    let urgencyBadge = `H-${offsetDays} Hari`;
    if (offsetDays === 1) urgencyBadge = 'H-1 Hari';
    else if (offsetDays === 7) urgencyBadge = 'H-1 Minggu';
    else if (offsetDays === 30) urgencyBadge = 'H-1 Bulan';
    else if (offsetDays === 365) urgencyBadge = 'H-1 Tahun';

    const docNo = item.certificateNo || item.documentNo || item.findingNo || '-';
    let subject = options.customSubject;
    let textBody = options.customMessage ? stripWhatsappMarkdown(options.customMessage) : '';
    if (!subject) {
      if (type === 'audit_nc_open') subject = `[NC OPEN] ${item.findingNo} — ${item.targetName || vesselName}`;
      else if (type === 'audit_nc_close') subject = `[NC CLOSE] ${item.findingNo} — ${item.targetName || vesselName}`;
      else if (type === 'work_order') subject = `[WO OVERDUE] ${item.title} — ${vesselName}`;
      else subject = `[PMS ${urgencyBadge}] ${item.name} — ${vesselName} (Jatuh tempo ${item.expiryDate})`;
    }
    if (!textBody) {
      if (type === 'audit_nc_open' || type === 'audit_nc_close') {
        textBody = `Kepada Yth. Penerima,\n\nTemuan audit ${item.findingNo} (${item.category || ''}) pada ${item.targetName || vesselName} — status ${type === 'audit_nc_open' ? 'NC OPEN' : 'NC CLOSE'}.\nKlausul: ${item.clauseCode || ''} - ${item.clauseName || ''}\nDeskripsi: ${item.description || ''}\nTarget close: ${item.dueDate || '-'}\n\nMohon tindak lanjut via Portal PMS Baharimas.\n\n_Sistem PMS PT. Pelayaran Baharimas Kalimantan_`;
      } else if (type === 'work_order') {
        textBody = `Kepada Teknisi,\n\nWork Order ${item.title} (ID: ${item.id}) status OVERDUE.\nTarget: ${item.targetHours} jam (saat ini ${item.currentRunningHours} jam).\nKapal: ${vesselName}\n\nHarap segera menindaklanjuti servicing.\n\n_Sistem PMS Baharimas_`;
      } else {
        textBody = `Kepada Yth. Penerima,\n\nDokumen/Sertifikat: ${item.name} (No: ${docNo})\nKapal/Pemilik: ${item.crewName ? `Kru ${item.crewName}` : vesselName}\nJatuh tempo: ${item.expiryDate} (${item.daysUntilExpiry ?? offsetDays} hari lagi) — ${urgencyBadge}\nPenerbit: ${item.issuer || '-'}\n\nMohon segera proses perpanjangan ke BKI/Syahbandar/personalia sebelum batas toleransi habis.\n\n_Pusat Pengendali Armada PMS PT. Pelayaran Baharimas Kalimantan_`;
      }
    }
    const html = buildEmailHtml({
      preheader: subject,
      title: subject,
      badge: urgencyBadge,
      rows: [
        { label: 'Kapal / Entitas', value: vesselName },
        { label: 'Dokumen / Temuan', value: `${item.name || item.title || item.findingNo || '-'}` },
        { label: 'Nomor', value: docNo },
        { label: 'Jatuh Tempo', value: `${item.expiryDate || item.dueDate || '-'}` },
      ],
      bodyText: textBody,
    });
    const payload = buildEmailPayload({ to: toList, cc: options.cc, bcc: options.bcc, subject, text: textBody, html, meta: { type, vesselName, offsetDays } });
    // Coba backend dulu (otomatis, tanpa buka tab). Kalau backend belum ada -> status Queued.
    const backendRes = await sendEmailViaBackend(payload, gateway);
    const channelLabel = backendRes.ok ? `Email Auto (${gateway.provider})` : 'Email Auto';
    const newLog = {
      id: `notif-email-${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID'),
      channel: channelLabel,
      target: payload.to.join(', '),
      vesselName: item.targetName || vesselName,
      subject,
      message: textBody,
      status: backendRes.status,
      thresholdTriggered: urgencyBadge,
    };
    setNotificationLogs(prev => [newLog, ...prev]);
    if (!options.silent) {
      if (backendRes.ok) {
        showToast(`Email otomatis terkirim ke ${payload.to.join(', ')} (${urgencyBadge})`, 'success');
      } else {
        // Fallback frontend-only: buka aplikasi email agar user bisa kirim sekarang,
        // log tetap tercatat sebagai Queued agar tidak hilang saat backend hadir.
        if (!options.skipMailto) window.open(buildMailtoUrl(payload.to, subject, textBody), '_self');
        showToast(`Backend email belum aktif — draf email dibuka & dicatat sebagai antrean (${payload.to.join(', ')})`, 'info');
      }
    }
    return { ...newLog, backend: backendRes, payload };
  };

  const sendAuditEmailNotification = async (finding, notificationType = 'open', options = {}) => {
    const type = notificationType === 'open' ? 'audit_nc_open' : 'audit_nc_close';
    return await sendEmailReminder(finding, type, options);
  };

  // Google Calendar URL Generator with custom offset days and scheduled hour
  const getGoogleCalendarUrl = (item, options = {}) => {
    // options: { offsetDays: 0 | 1 | 7 | 30 | 365 | number, eventTime: '08:00' }
    const offsetDays = options.offsetDays !== undefined ? Number(options.offsetDays) : 30;
    const eventTime = options.eventTime || notificationSettings.autoSend?.scheduleTime || '08:00';
    const [evHH, evMM] = eventTime.split(':').map(Number);

    const vessel = vessels.find(v => v.id === item.vesselId);
    const vesselName = vessel?.name || 'Armada Kapal';
    const docNo = item.certificateNo || item.documentNo || '-';
    const holder = item.crewName ? `Kru: ${item.crewName}` : `Kapal: ${vesselName}`;

    let startIso = '';
    let endIso = '';

    if (item.expiryDate) {
      const [year, month, day] = item.expiryDate.split('-').map(Number);
      const targetDate = new Date(year, month - 1, day);

      if (offsetDays > 0) {
        targetDate.setDate(targetDate.getDate() - offsetDays);
      }

      const tYear = targetDate.getFullYear();
      const tMonth = String(targetDate.getMonth() + 1).padStart(2, '0');
      const tDay = String(targetDate.getDate()).padStart(2, '0');

      const startH = String(evHH || 8).padStart(2, '0');
      const startM = String(evMM || 0).padStart(2, '0');
      const endH = String(Math.min(23, (evHH || 8) + 1)).padStart(2, '0');
      const endM = startM;

      startIso = `${tYear}${tMonth}${tDay}T${startH}${startM}00`;
      endIso = `${tYear}${tMonth}${tDay}T${endH}${endM}00`;
    }

    let intervalLabel = 'H-30 (1 Bulan)';
    if (offsetDays === 1) intervalLabel = 'H-1 (1 Hari Terakhir)';
    else if (offsetDays === 7) intervalLabel = 'H-7 (1 Minggu)';
    else if (offsetDays === 30) intervalLabel = 'H-30 (1 Bulan)';
    else if (offsetDays === 365) intervalLabel = 'H-365 (1 Tahun Persiapan)';
    else if (offsetDays === 0) intervalLabel = 'JATUH TEMPO HARI-H';
    else if (offsetDays > 0) intervalLabel = `H-${offsetDays} Hari`;

    const title = `[PMS ${intervalLabel}] ${item.name} (${vesselName})`;
    const details = `PENGINGAT RESMI SISTEM PMS PT. PELAYARAN BAHARIMAS KALIMANTAN:\n` +
      `----------------------------------------\n` +
      `Kategori Peringatan: ${intervalLabel}\n` +
      `Waktu Pengingat: Jam ${eventTime} WIB\n` +
      `Nama Dokumen/Sertifikat: ${item.name}\n` +
      `Nomor Dokumen: ${docNo}\n` +
      `Subjek/Pemilik: ${holder}\n` +
      `Kapal: ${vesselName}\n` +
      `Instansi Penerbit: ${item.issuer || '-'}\n` +
      `Tanggal Jatuh Tempo: ${item.expiryDate} (${item.daysUntilExpiry} hari lagi)\n` +
      `Status Kelaikan: ${item.status}\n\n` +
      `INSTRUKSI TINDAK LANJUT:\n` +
      (offsetDays === 1
        ? `🚨 DARURAT: Hari ini/besok masa berlaku habis! Segera hubungi Syahbandar/BKI untuk dispensasi atau survey mendesak.`
        : offsetDays === 7
        ? `⚠️ KRITIS: Tersisa 7 hari. Pastikan surveyor telah ditunjuk dan dokumen persiapan kapal siap di pelabuhan.`
        : offsetDays === 30
        ? `🔔 FORMAL: Masuk jendela survei perpanjangan 30 hari. Hubungi Bagian Legal Armada & BKI Surveyor.`
        : offsetDays === 365
        ? `📋 TAHUNAN: Rencanakan anggaran docking & survey pembaharuan (Renewal Survey) tahun depan.`
        : `Segera tindak lanjuti sebelum batas toleransi survey habis.`);

    const location = `${vesselName}, Pelabuhan Pendaftaran ${vessel?.portOfRegistry || 'Pontianak, Kalimantan Barat'}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startIso}/${endIso}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  };

  const openGoogleCalendar = (item, options = {}) => {
    const url = getGoogleCalendarUrl(item, options);
    const vesselName = vessels.find(v => v.id === item.vesselId)?.name || 'Armada';
    const offsetDays = options.offsetDays !== undefined ? options.offsetDays : 30;
    const eventTime = options.eventTime || notificationSettings.autoSend?.scheduleTime || '08:00';

    let tagLabel = `H-${offsetDays}`;
    if (offsetDays === 1) tagLabel = 'H-1 Hari';
    else if (offsetDays === 7) tagLabel = 'H-1 Minggu';
    else if (offsetDays === 30) tagLabel = 'H-1 Bulan';
    else if (offsetDays === 365) tagLabel = 'H-1 Tahun';

    const newLog = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID'),
      channel: 'Google Calendar Sync',
      target: `Google Calendar (${item.crewName || vesselName})`,
      vesselName,
      subject: `Sinkron Kalender (${tagLabel} @ ${eventTime} WIB): ${item.name}`,
      message: `Event pengingat jatuh tempo ${tagLabel} berhasil dijadwalkan di Google Calendar untuk tanggal ${item.expiryDate} pukul ${eventTime} WIB`,
      status: 'Delivered',
      thresholdTriggered: `${tagLabel} G-Cal`
    };

    setNotificationLogs(prev => [newLog, ...prev]);
    window.open(url, '_blank');
    showToast(`Google Calendar dibuka untuk event pengingat ${tagLabel} pukul ${eventTime} WIB: ${item.name}`, 'success');
  };

  // Export .ics calendar file with multi-alarm (1 Hari, 1 Minggu, 1 Bulan, 1 Tahun, Kustom)
  const exportMultiIntervalICS = (filterOffset = null) => {
    const activeThresholds = [
      ...(notificationSettings.thresholds || []).filter(t => t.enabled),
      ...(notificationSettings.customThresholds || []).filter(t => t.enabled)
    ];

    const allItems = [
      ...crewCertificates.map(c => ({ ...c, itemCategory: 'crew_cert' })),
      ...shipDocuments.map(d => ({ ...d, itemCategory: 'ship_doc' }))
    ];

    let targetItems = allItems;
    if (filterOffset !== null) {
      targetItems = allItems.filter(i => i.daysUntilExpiry !== undefined && i.daysUntilExpiry <= filterOffset && i.daysUntilExpiry >= -30);
    } else {
      const maxDays = Math.max(...activeThresholds.map(t => t.days), 365);
      targetItems = allItems.filter(i => i.daysUntilExpiry !== undefined && i.daysUntilExpiry <= maxDays && i.daysUntilExpiry >= -30);
    }

    if (targetItems.length === 0) {
      showToast('Tidak ada dokumen yang cocok dengan ambang batas yang dipilih.', 'info');
      return;
    }

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//PT. Pelayaran Baharimas Kalimantan//PMS Statutory Multi-Alarm Calendar//ID',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:PT. Pelayaran Baharimas Kalimantan - Dokumen & Sertifikat Kapal',
      'X-WR-TIMEZONE:Asia/Jakarta'
    ];

    targetItems.forEach((item, idx) => {
      const vessel = vessels.find(v => v.id === item.vesselId);
      const vesselName = vessel?.name || 'Kapal';
      const cleanDate = item.expiryDate ? item.expiryDate.replace(/-/g, '') : '20260918';
      const eventTime = notificationSettings.autoSend?.scheduleTime?.replace(':', '') || '0800';

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:pms-cert-${item.id}-${idx}@baharimas.co.id`,
        `DTSTAMP:${cleanDate}T${eventTime}00Z`,
        `DTSTART;VALUE=DATE:${cleanDate}`,
        `SUMMARY:[PMS JATUH TEMPO] ${item.name} (${vesselName})`,
        `DESCRIPTION:Pengingat jatuh tempo dokumen ${item.name} (No: ${item.certificateNo || item.documentNo}). Pemegang: ${item.crewName || vesselName}. Segera lakukan perpanjangan kelaiklautan kapal.`,
        `LOCATION:${vesselName}, ${vessel?.portOfRegistry || 'Indonesia'}`
      );

      // Add VALARM for each active threshold
      activeThresholds.forEach(th => {
        icsContent.push(
          'BEGIN:VALARM',
          'ACTION:DISPLAY',
          `DESCRIPTION:Pengingat ${th.label} - Dokumen ${item.name}`,
          `TRIGGER:-P${th.days}D`,
          'END:VALARM'
        );
      });

      icsContent.push('END:VEVENT');
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `PMS_MultiAlarm_Calendar_${new Date().toISOString().split('T')[0]}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`File .ics multi-alarm berhasil diunduh (${targetItems.length} dokumen dengan alarm 1 hari, 1 minggu, 1 bulan, 1 tahun)!`, 'success');
  };

  // Alias for backward compatibility
  const exportH30CalendarICS = () => exportMultiIntervalICS(30);

  // Automated Dispatch Engine: Scans all items matching enabled intervals and dispatches
  const runAutoDispatchNotifications = async (isManual = false) => {
    const activeThresholds = [
      ...(notificationSettings.thresholds || []).filter(t => t.enabled),
      ...(notificationSettings.customThresholds || []).filter(t => t.enabled)
    ];

    const allItems = [
      ...crewCertificates.map(c => ({ ...c, itemCategory: 'crew_cert' })),
      ...shipDocuments.map(d => ({ ...d, itemCategory: 'ship_doc' }))
    ];

    const matchedDispatches = [];

    activeThresholds.forEach(th => {
      const matched = allItems.filter(item => {
        if (item.daysUntilExpiry === undefined) return false;
        if (th.days === 1) return item.daysUntilExpiry <= 1 && item.daysUntilExpiry >= 0;
        if (th.days === 7) return item.daysUntilExpiry <= 7 && item.daysUntilExpiry > 1;
        if (th.days === 30) return item.daysUntilExpiry <= 30 && item.daysUntilExpiry > 7;
        if (th.days === 365) return item.daysUntilExpiry <= 365 && item.daysUntilExpiry > 30;
        return item.daysUntilExpiry <= th.days && item.daysUntilExpiry >= 0;
      });

      matched.forEach(item => {
        matchedDispatches.push({
          item,
          threshold: th
        });
      });
    });

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const timeStr = notificationSettings.autoSend?.scheduleTime || '08:00';
    const runKey = `${todayStr}_${timeStr}`;

    const waEnabled = notificationSettings.autoSend?.channels?.whatsapp !== false;
    const emailEnabled = notificationSettings.autoSend?.channels?.email !== false;
    const emailGateway = { ...DEFAULT_EMAIL_GATEWAY, ...(notificationSettings.autoSend?.emailGateway || {}) };

    const newLogs = [];
    for (const m of matchedDispatches) {
      const v = vessels.find(ship => ship.id === m.item.vesselId);
      const recipient = m.item.crewName || `Nakhoda & Admin ${v?.name || ''}`;
      const wantsWA = waEnabled && (m.threshold.notifyChannels || []).includes('WhatsApp');
      const wantsEmail = emailEnabled && (m.threshold.notifyChannels || []).includes('Email');
      if (wantsWA) {
        newLogs.push({
          id: `notif-auto-wa-${Date.now()}-${m.item.id}-${m.threshold.days}`,
          timestamp: new Date().toLocaleString('id-ID'),
          channel: `WhatsApp Auto (${m.threshold.label})`,
          target: recipient,
          vesselName: v?.name || 'Fleet',
          subject: `[Auto Bot ${m.threshold.label}] ${m.item.name}`,
          message: `Pemberitahuan Otomatis ${m.threshold.label}: Dokumen ${m.item.name} akan jatuh tempo pada ${m.item.expiryDate} (${m.item.daysUntilExpiry} hari lagi).`,
          status: 'Delivered',
          thresholdTriggered: m.threshold.label
        });
      }
      if (wantsEmail) {
        const toList = resolveEmailRecipients(m.item, m.item.itemCategory || 'ship_doc', { offsetDays: m.threshold.days });
        const subject = `[PMS ${m.threshold.label}] ${m.item.name} — ${v?.name || 'Fleet'} (Jatuh tempo ${m.item.expiryDate})`;
        const textBody = `Pemberitahuan Otomatis ${m.threshold.label}: Dokumen ${m.item.name} akan jatuh tempo pada ${m.item.expiryDate} (${m.item.daysUntilExpiry} hari lagi).\nKapal: ${v?.name || 'Fleet'}\nNomor: ${m.item.certificateNo || m.item.documentNo || '-'}\n\nMohon tindak lanjut sebelum batas toleransi habis.\n\n_Sistem PMS PT. Pelayaran Baharimas Kalimantan_`;
        let emailStatus = 'Queued (Menunggu Backend)';
        try {
          const payload = buildEmailPayload({
            to: toList,
            subject,
            text: textBody,
            html: buildEmailHtml({ preheader: subject, title: subject, badge: m.threshold.label, bodyText: textBody }),
            meta: { auto: true, threshold: m.threshold.label, itemId: m.item.id },
          });
          const res = await sendEmailViaBackend(payload, emailGateway);
          emailStatus = res.status;
        } catch (e) {
          emailStatus = 'Queued (Menunggu Backend)';
        }
        newLogs.push({
          id: `notif-auto-email-${Date.now()}-${m.item.id}-${m.threshold.days}`,
          timestamp: new Date().toLocaleString('id-ID'),
          channel: `Email Auto (${m.threshold.label})`,
          target: (toList.length ? toList.join(', ') : recipient),
          vesselName: v?.name || 'Fleet',
          subject,
          message: textBody,
          status: emailStatus,
          thresholdTriggered: m.threshold.label
        });
      }
    }

    if (newLogs.length > 0) {
      setNotificationLogs(prev => [...newLogs, ...prev]);
    }

    // Mark as executed for this schedule slot
    setNotificationSettings(prev => {
      const updated = {
        ...prev,
        autoSend: {
          ...prev.autoSend,
          lastRunDate: runKey
        }
      };
      localStorage.setItem('pms_notificationSettings', JSON.stringify(updated));
      return updated;
    });

    // Native Browser Notification API if enabled
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('PMS PT. Pelayaran Baharimas Kalimantan', {
          body: `🤖 Auto-Send Selesai (${timeStr} WIB): ${matchedDispatches.length} dokumen jatuh tempo telah diproses.`,
          icon: '/favicon.ico'
        });
      } catch (e) {
        console.log('Browser notification skipped:', e);
      }
    }

    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch {}

    const breakdownText = activeThresholds.map(t => {
      const count = matchedDispatches.filter(m => m.threshold.id === t.id).length;
      return `${t.label}: ${count}`;
    }).join(' • ');

    showToast(
      isManual
        ? `🤖 Eksekusi Manual Selesai! ${matchedDispatches.length} item diproses (${breakdownText}). Log riwayat telah diperbarui.`
        : `🤖 Eksekusi Otomatis Berhasil (${timeStr} WIB)! ${matchedDispatches.length} item diproses (${breakdownText}).`,
      'success'
    );

    return matchedDispatches;
  };

  // Backward compatibility wrapper for autoDispatchH30WhatsApp
  const autoDispatchH30WhatsApp = () => runAutoDispatchNotifications(true);

  // Background Cron Scheduler: checks current time against autoSend.scheduleTime
  useEffect(() => {
    if (!notificationSettings?.autoSend?.enabled) return;

    const checkSchedulerTick = () => {
      const now = new Date();
      const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const todayDate = now.toISOString().split('T')[0];
      const targetTime = notificationSettings.autoSend.scheduleTime || '08:00';
      const runKey = `${todayDate}_${targetTime}`;

      if (currentHHMM === targetTime && notificationSettings.autoSend.lastRunDate !== runKey) {
        console.log(`[PMS Scheduler] Auto-send matched ${targetTime} WIB. Executing automated dispatch...`);
        runAutoDispatchNotifications(false);
      }
    };

    const intervalId = setInterval(checkSchedulerTick, 5000);
    return () => clearInterval(intervalId);
  }, [notificationSettings, shipDocuments, crewCertificates]);

  const escalateNotification = (logId) => {
    setNotificationLogs(prev => prev.map(log => {
      if (log.id === logId) {
        return {
          ...log,
          status: 'Escalated',
          target: `${log.target} -> Eskalasi ke Fleet Manager`
        };
      }
      return log;
    }));
    showToast(`Peringatan berhasil dieskalasi ke Fleet Manager!`, 'warning');
  };

  // Clear all operational & master dummy data to clean state
  const clearAllData = () => {
    setVessels([]);
    setEquipment([]);
    setSchedules([]);
    setWorkOrders([]);
    setSpareparts([]);
    setRequisitions([]);
    setCosts([]);
    setVesselBudgets([]);
    setCrew([]);
    setLeaves([]);
    setDrills([]);
    setCrewCertificates([]);
    setShipDocuments([]);
    setCertificateCategories([]);
    setDocumentTemplates([]);
    setMasterSurveyTypes([]);
    setNotificationLogs([]);
    setAudits([]);
    setAuditFindings([]);
    setSelectedVesselId('all');

    localStorage.setItem('pms_vessels', JSON.stringify([]));
    localStorage.setItem('pms_equipment', JSON.stringify([]));
    localStorage.setItem('pms_schedules', JSON.stringify([]));
    localStorage.setItem('pms_workOrders', JSON.stringify([]));
    localStorage.setItem('pms_spareparts', JSON.stringify([]));
    localStorage.setItem('pms_requisitions', JSON.stringify([]));
    localStorage.setItem('pms_costs', JSON.stringify([]));
    localStorage.setItem('pms_vessel_budgets', JSON.stringify([]));
    localStorage.setItem('pms_crew', JSON.stringify([]));
    localStorage.setItem('pms_leaves', JSON.stringify([]));
    localStorage.setItem('pms_drills', JSON.stringify([]));
    localStorage.setItem('pms_crewCertificates', JSON.stringify([]));
    localStorage.setItem('pms_shipDocuments', JSON.stringify([]));
    localStorage.setItem('pms_certificateCategories', JSON.stringify([]));
    localStorage.setItem('pms_documentTemplates', JSON.stringify([]));
    localStorage.setItem('pms_masterSurveyTypes', JSON.stringify([]));
    localStorage.setItem('pms_notificationLogs', JSON.stringify([]));
    localStorage.setItem('pms_audits', JSON.stringify([]));
    localStorage.setItem('pms_auditFindings', JSON.stringify([]));

    showToast('Seluruh data dummy berhasil dikosongkan. Sistem bersih dan siap diinput dari nol!', 'info');
  };

  // Load demo seed data for evaluation / review
  const loadDemoData = () => {
    const dVessels = DEMO_DATA.INITIAL_VESSELS || [];
    const dEquip = DEMO_DATA.INITIAL_EQUIPMENT || [];
    const dSched = DEMO_DATA.INITIAL_MAINTENANCE_SCHEDULES || [];
    const dWO = DEMO_DATA.INITIAL_WORK_ORDERS || [];
    const dParts = DEMO_DATA.INITIAL_SPAREPARTS || [];
    const dReq = DEMO_DATA.INITIAL_REQUISITIONS || [];
    const dCosts = DEMO_DATA.INITIAL_COSTS || [];
    const dBudgets = DEMO_DATA.INITIAL_VESSEL_BUDGETS || [];
    const dCrew = DEMO_DATA.INITIAL_CREW || [];
    const dLeaves = DEMO_DATA.INITIAL_LEAVES || [];
    const dDrills = DEMO_DATA.INITIAL_DRILLS || [];
    const dCrewCerts = DEMO_DATA.INITIAL_CREW_CERTIFICATES || [];
    const dShipDocs = DEMO_DATA.INITIAL_SHIP_DOCUMENTS || [];
    const dCategories = DEMO_DATA.DEMO_CERTIFICATE_CATEGORIES || [];
    const dTemplates = DEMO_DATA.DEMO_STANDARD_CERTIFICATE_TEMPLATES || [];
    const dLogs = DEMO_DATA.INITIAL_NOTIFICATION_LOGS || [];
    const dAudits = DEMO_DATA.DEMO_AUDITS || [];
    const dFindings = DEMO_DATA.DEMO_AUDIT_FINDINGS || [];

    setVessels(dVessels);
    setEquipment(dEquip);
    setSchedules(dSched);
    setWorkOrders(dWO);
    setSpareparts(dParts);
    setRequisitions(dReq);
    setCosts(dCosts);
    setVesselBudgets(dBudgets);
    setCrew(dCrew);
    setLeaves(dLeaves);
    setDrills(dDrills);
    setCrewCertificates(dCrewCerts);
    setShipDocuments(dShipDocs);
    setCertificateCategories(dCategories);
    setDocumentTemplates(dTemplates);
    setMasterSurveyTypes(DEFAULT_MASTER_SURVEY_TYPES);
    setNotificationLogs(dLogs);
    setAudits(dAudits);
    setAuditFindings(dFindings);

    localStorage.setItem('pms_vessels', JSON.stringify(dVessels));
    localStorage.setItem('pms_equipment', JSON.stringify(dEquip));
    localStorage.setItem('pms_schedules', JSON.stringify(dSched));
    localStorage.setItem('pms_workOrders', JSON.stringify(dWO));
    localStorage.setItem('pms_spareparts', JSON.stringify(dParts));
    localStorage.setItem('pms_requisitions', JSON.stringify(dReq));
    localStorage.setItem('pms_costs', JSON.stringify(dCosts));
    localStorage.setItem('pms_vessel_budgets', JSON.stringify(dBudgets));
    localStorage.setItem('pms_crew', JSON.stringify(dCrew));
    localStorage.setItem('pms_leaves', JSON.stringify(dLeaves));
    localStorage.setItem('pms_drills', JSON.stringify(dDrills));
    localStorage.setItem('pms_crewCertificates', JSON.stringify(dCrewCerts));
    localStorage.setItem('pms_shipDocuments', JSON.stringify(dShipDocs));
    localStorage.setItem('pms_certificateCategories', JSON.stringify(dCategories));
    localStorage.setItem('pms_documentTemplates', JSON.stringify(dTemplates));
    localStorage.setItem('pms_masterSurveyTypes', JSON.stringify(DEFAULT_MASTER_SURVEY_TYPES));
    localStorage.setItem('pms_notificationLogs', JSON.stringify(dLogs));
    localStorage.setItem('pms_audits', JSON.stringify(dAudits));
    localStorage.setItem('pms_auditFindings', JSON.stringify(dFindings));

    showToast('Data contoh/demo berhasil dimuat ke sistem!', 'success');
  };

  const resetToSeedData = clearAllData;

  // Filtered views by selected vessel
  const filteredEquipment = selectedVesselId === 'all'
    ? equipment
    : equipment.filter(e => e.vesselId === selectedVesselId);

  const filteredWorkOrders = selectedVesselId === 'all'
    ? workOrders
    : workOrders.filter(w => w.vesselId === selectedVesselId);

  const filteredSpareparts = selectedVesselId === 'all'
    ? spareparts
    : spareparts.filter(s => s.vesselId === selectedVesselId);

  const filteredCrew = selectedVesselId === 'all'
    ? crew
    : crew.filter(c => c.vesselId === selectedVesselId);

  const filteredCrewCerts = selectedVesselId === 'all'
    ? crewCertificates
    : crewCertificates.filter(c => c.vesselId === selectedVesselId);

  const filteredShipDocs = selectedVesselId === 'all'
    ? shipDocuments
    : shipDocuments.filter(d => d.vesselId === selectedVesselId);

  const filteredCosts = selectedVesselId === 'all'
    ? costs
    : costs.filter(c => c.vesselId === selectedVesselId);

  const filteredVesselBudgets = selectedVesselId === 'all'
    ? vesselBudgets
    : vesselBudgets.filter(b => b.vesselId === selectedVesselId);

  const filteredDrills = selectedVesselId === 'all'
    ? drills
    : drills.filter(d => d.vesselId === selectedVesselId);

  // Filtered audits & findings (DOC is fleet/office-wide, SMC is vessel-specific)
  const filteredAudits = selectedVesselId === 'all'
    ? audits
    : audits.filter(a => a.scope === 'DOC' || a.vesselId === selectedVesselId);

  const filteredAuditFindings = selectedVesselId === 'all'
    ? auditFindings
    : auditFindings.filter(f => {
        if (f.vesselId) return f.vesselId === selectedVesselId;
        const parentAudit = audits.find(a => a.id === f.auditId);
        if (parentAudit && parentAudit.scope === 'DOC') return true;
        return parentAudit?.vesselId === selectedVesselId;
      });

  // Critical counters
  const overdueWOCount = filteredWorkOrders.filter(w => w.status === 'Overdue').length;
  const expiredDocsCount = filteredShipDocs.filter(d => d.status === 'Expired').length +
                           filteredCrewCerts.filter(c => c.status === 'Expired').length;
  const dueSoonDocsCount = filteredShipDocs.filter(d => d.status === 'Due Soon').length +
                           filteredCrewCerts.filter(c => c.status === 'Due Soon').length;
  const lowStockCount = filteredSpareparts.filter(s => s.status === 'Low Stock' || s.status === 'Critical').length;
  const openNCCount = filteredAuditFindings.filter(f => f.status === 'NC Open' || f.status === 'Eviden Submitted').length;
  const closedNCCount = filteredAuditFindings.filter(f => f.status === 'NC Close').length;

  // Items within 1 month (H-30) of expiry: daysUntilExpiry <= 30
  const h30ExpiringItems = [
    ...filteredCrewCerts.filter(c => c.daysUntilExpiry !== undefined && c.daysUntilExpiry <= 30),
    ...filteredShipDocs.filter(d => d.daysUntilExpiry !== undefined && d.daysUntilExpiry <= 30)
  ];
  const h30ExpiringCount = h30ExpiringItems.length;

  // Multi-interval items & counters
  const h1ExpiringItems = [
    ...filteredCrewCerts.filter(c => c.daysUntilExpiry !== undefined && c.daysUntilExpiry <= 1),
    ...filteredShipDocs.filter(d => d.daysUntilExpiry !== undefined && d.daysUntilExpiry <= 1)
  ];
  const h1ExpiringCount = h1ExpiringItems.length;

  const h7ExpiringItems = [
    ...filteredCrewCerts.filter(c => c.daysUntilExpiry !== undefined && c.daysUntilExpiry <= 7),
    ...filteredShipDocs.filter(d => d.daysUntilExpiry !== undefined && d.daysUntilExpiry <= 7)
  ];
  const h7ExpiringCount = h7ExpiringItems.length;

  const h365ExpiringItems = [
    ...filteredCrewCerts.filter(c => c.daysUntilExpiry !== undefined && c.daysUntilExpiry <= 365),
    ...filteredShipDocs.filter(d => d.daysUntilExpiry !== undefined && d.daysUntilExpiry <= 365)
  ];
  const h365ExpiringCount = h365ExpiringItems.length;

  const allExpiringItems = [
    ...filteredCrewCerts.filter(c => c.daysUntilExpiry !== undefined && c.daysUntilExpiry <= 365),
    ...filteredShipDocs.filter(d => d.daysUntilExpiry !== undefined && d.daysUntilExpiry <= 365)
  ];
  const allExpiringCount = allExpiringItems.length;

  const ownerVessels = vessels.filter(v => !v.id.startsWith('v-op-') && v.ownershipStatus !== 'As Operator');
  const operatorVessels = vessels.filter(v => v.id.startsWith('v-op-') || v.ownershipStatus === 'As Operator');

  return (
    <PMSContext.Provider
      value={{
        // Data
        vessels,
        ownerVessels,
        operatorVessels,
        equipment: filteredEquipment,
        allEquipment: equipment,
        schedules,
        workOrders: filteredWorkOrders,
        allWorkOrders: workOrders,
        spareparts: filteredSpareparts,
        allSpareparts: spareparts,
        requisitions,
        costs: filteredCosts,
        allCosts: costs,
        vesselBudgets: filteredVesselBudgets,
        allVesselBudgets: vesselBudgets,
        crew: filteredCrew,
        allCrew: crew,
        leaves,
        drills: filteredDrills,
        crewCertificates: filteredCrewCerts,
        allCrewCertificates: crewCertificates,
        shipDocuments: filteredShipDocs,
        allShipDocuments: shipDocuments,
        audits: filteredAudits,
        allAudits: audits,
        auditFindings: filteredAuditFindings,
        allAuditFindings: auditFindings,
        ISM_DOC_ELEMENTS,
        ISM_SMC_ELEMENTS,
        notificationSettings,
        notificationLogs,
        users,
        addUser,
        updateUser,
        deleteUser,
        resetUsers,
        currentUser,
        login,
        logout,
        updateUserProfile,

        // Site Config (CMS)
        siteConfig,
        updateSiteConfig,
        resetSiteConfig,

        // Sidebar Overrides
        sidebarOverrides,
        updateSidebarOverrides,

        // Theme Mode
        theme,
        setTheme,
        toggleTheme,

        // Filters, RBAC & Navigation
        selectedVesselId,
        setSelectedVesselId,
        currentRole,
        setCurrentRole,
        hasPermission,
        canAction,
        rolePermissions: ROLE_PERMISSIONS,
        roleDefinitions: ROLE_DEFINITIONS,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        toastMessage,

        // Counters
        overdueWOCount,
        expiredDocsCount,
        dueSoonDocsCount,
        lowStockCount,
        h30ExpiringCount,
        h30ExpiringItems,
        h1ExpiringCount,
        h1ExpiringItems,
        h7ExpiringCount,
        h7ExpiringItems,
        h365ExpiringCount,
        h365ExpiringItems,
        allExpiringCount,
        allExpiringItems,
        openNCCount,
        closedNCCount,

        // Actions
        updateRunningHours,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        toggleChecklist,
        updateWorkOrderStatus,
        addWorkOrder,
        updateWorkOrder,
        updateSparepartStock,
        transferStockToVessel,
        consumeStockOnboard,
        addLogisticItem,
        updateLogisticItem,
        deleteLogisticItem,
        addRequisition,
        addLogisticRequisition,
        updateRequisitionStatus,
        receiveRequisitionItems,
        updateVesselBudget,
        addExpenseTransaction,
        deleteExpenseTransaction,
        addVessel,
        updateVessel,
        deleteVessel,
        updateVesselParticulars,
        setVessels,
        vesselTypes,
        setVesselTypes,
        addMasterVesselType,
        deleteMasterVesselType,
        portLocations,
        setPortLocations,
        addMasterPort,
        deleteMasterPort,
        addShipDocument,
        updateShipDocument,
        deleteShipDocument,
        certificateCategories,
        addCertificateCategory,
        deleteCertificateCategory,
        documentTemplates,
        addDocumentTemplate,
        deleteDocumentTemplate,
        clearDocumentTemplates,
        masterCertificateNames: documentTemplates,
        addMasterCertificateName: addDocumentTemplate,
        deleteMasterCertificateName: deleteDocumentTemplate,
        masterSurveyTypes,
        addMasterSurveyType,
        deleteMasterSurveyType,
        clearMasterSurveyTypes,
        addCrew,
        updateCrew,
        deleteCrew,
        approveLeave,
        submitLeave,
        addDrill,
        sendWhatsAppReminder,
        sendAuditWhatsAppNotification,
        sendEmailReminder,
        sendAuditEmailNotification,
        resolveEmailRecipients,
        escalateNotification,
        openGoogleCalendar,
        getGoogleCalendarUrl,
        exportH30CalendarICS,
        exportMultiIntervalICS,
        autoDispatchH30WhatsApp,
        runAutoDispatchNotifications,
        updateNotificationSettings,
        addCustomThreshold,
        removeCustomThreshold,
        toggleThresholdActive,
        toggleThresholdChannel,
        updateAutoSendConfig,
        setTestScheduleTimeNowPlusOneMinute,
        resetToSeedData,
        clearAllData,
        loadDemoData,
        showToast,

        // Audit Actions
        addAuditSession,
        updateAuditSession,
        deleteAuditSession,
        addAuditFinding,
        updateAuditFinding,
        deleteAuditFinding,
        submitAuditEvidence,
        closeAuditFinding,
        reopenAuditFinding
      }}
    >
      {children}
    </PMSContext.Provider>
  );
};

export const usePMS = () => {
  const context = useContext(PMSContext);
  if (!context) throw new Error('usePMS must be used within a PMSProvider');
  return context;
};
