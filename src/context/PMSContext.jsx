import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PMS_STORAGE_VERSION, initStorageVersion, loadStored, persistAllState } from '../utils/pmsStorage';
import {
  INITIAL_VESSELS,
  INITIAL_EQUIPMENT,
  INITIAL_MAINTENANCE_SCHEDULES,
  INITIAL_TECHNICAL_WORK_ORDERS,
  INITIAL_WORK_ORDERS,
  INITIAL_DAILY_MACHINERY_LOGS,
  INITIAL_CRITICAL_EQUIPMENT_TESTS,
  DEFAULT_SAFE_MANNING_STANDARDS,
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
// Lima fungsi notifikasi dipindah ke ./logic/ dengan dependensi closure induk
// diangkat menjadi PARAMETER. Diimpor dengan alias `Raw`, lalu di bawah dibuat
// wrapper bernama sama yang mengikat parameter itu. Dengan begitu:
//   * API ke konsumen (nilai context) tidak berubah sama sekali
//   * semua call site internal yang sudah ada tetap valid tanpa disentuh
import { resolveEmailRecipients as resolveEmailRecipientsRaw } from './logic/resolveEmailRecipients';
import { getGoogleCalendarUrl as getGoogleCalendarUrlRaw } from './logic/getGoogleCalendarUrl';
import { sendEmailReminder as sendEmailReminderRaw } from './logic/sendEmailReminder';
import { sendWhatsAppReminder as sendWhatsAppReminderRaw } from './logic/sendWhatsAppReminder';
import { exportMultiIntervalICS as exportMultiIntervalICSRaw } from './logic/exportMultiIntervalICS';
import { DEFAULT_SITE_CONFIG } from './logic/DEFAULT_SITE_CONFIG';
import { DEFAULT_MASTER_PORTS } from './logic/DEFAULT_MASTER_PORTS';
import {
  CERTIFICATE_CATEGORIES,
  DEFAULT_MASTER_SURVEY_TYPES,
  DEFAULT_MASTER_CERTIFICATE_NAMES
} from '../data/shipCertificatesMaster';
import {
  INITIAL_AUDITS,
  INITIAL_AUDIT_FINDINGS,
  ISM_DOC_ELEMENTS,
  BKI_SMC_CHECKLIST_TEMPLATE,
  ISM_SMC_ELEMENTS,
  EXTERNAL_AUDIT_ORGANIZATIONS
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
  canPerformAction,
  ROLE_DEFINITIONS,
  ROLE_PERMISSIONS
} from '../utils/rbac';
import { makeId } from '../utils/idUtils';

const PMSContext = createContext();

// Inisialisasi versi storage — purge otomatis jika versi berubah
initStorageVersion();

export const PMSProvider = ({ children }) => {
  // Load state from localStorage or fallback to initial data
  const load = (key, fallback) => loadStored(key, fallback, INITIAL_NOTIFICATION_SETTINGS);

  const [vessels, setVessels] = useState(() => {
    const loaded = load('vessels', INITIAL_VESSELS);
    if (Array.isArray(loaded) && !loaded.some(v => v.name?.includes('RP 2004'))) {
      const rp2004 = DEMO_DATA.INITIAL_VESSELS?.find(v => v.name?.includes('RP 2004'));
      if (rp2004) return [...loaded, rp2004];
    }
    return loaded;
  });
  const [equipment, setEquipment] = useState(() => load('equipment', INITIAL_EQUIPMENT));
  const [schedules, setSchedules] = useState(() => load('schedules', INITIAL_MAINTENANCE_SCHEDULES));
  const [workOrders, setWorkOrders] = useState(() => load('workOrders', INITIAL_WORK_ORDERS));
  const [technicalWorkOrders, setTechnicalWorkOrders] = useState(() => {
    const stored = load('technicalWorkOrders', null);
    if (Array.isArray(stored)) return stored;
    return DEMO_DATA.INITIAL_TECHNICAL_WORK_ORDERS || INITIAL_TECHNICAL_WORK_ORDERS || [];
  });
  const [dailyMachineryLogs, setDailyMachineryLogs] = useState(() => {
    const stored = load('dailyMachineryLogs', null);
    if (Array.isArray(stored)) return stored;
    return DEMO_DATA.INITIAL_DAILY_MACHINERY_LOGS || INITIAL_DAILY_MACHINERY_LOGS || [];
  });
  const [criticalEquipmentTests, setCriticalEquipmentTests] = useState(() => {
    const stored = load('criticalEquipmentTests', null);
    if (Array.isArray(stored)) return stored;
    return DEMO_DATA.INITIAL_CRITICAL_EQUIPMENT_TESTS || INITIAL_CRITICAL_EQUIPMENT_TESTS || [];
  });
  const [safeManningStandards, setSafeManningStandards] = useState(() => {
    const stored = load('safeManningStandards', null);
    if (Array.isArray(stored)) return stored;
    return DEFAULT_SAFE_MANNING_STANDARDS || [];
  });
  const [spareparts, setSpareparts] = useState(() => load('spareparts', INITIAL_SPAREPARTS));
  const [requisitions, setRequisitions] = useState(() => load('requisitions', INITIAL_REQUISITIONS));
  const [costs, setCosts] = useState(() => load('costs', INITIAL_COSTS));
  const [vesselBudgets, setVesselBudgets] = useState(() => load('vesselBudgets', INITIAL_VESSEL_BUDGETS));
  const [crew, setCrew] = useState(() => load('crew', INITIAL_CREW));
  const [leaves, setLeaves] = useState(() => load('leaves', INITIAL_LEAVES));
  const [drills, setDrills] = useState(() => load('drills', INITIAL_DRILLS));
  const [crewCertificates, setCrewCertificates] = useState(() => load('crewCertificates', INITIAL_CREW_CERTIFICATES));
  const [shipDocuments, setShipDocuments] = useState(() => load('shipDocuments', INITIAL_SHIP_DOCUMENTS));
  const [certificateCategories, setCertificateCategories] = useState(() => {
    const stored = load('certificateCategories', null);
    if (Array.isArray(stored)) {
      return stored;
    }
    return CERTIFICATE_CATEGORIES || [];
  });
  const [documentTemplates, setDocumentTemplates] = useState(() => {
    const stored = load('documentTemplates', null);
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
    const stored = load('masterSurveyTypes', null);
    if (Array.isArray(stored)) {
      return stored;
    }
    return DEFAULT_MASTER_SURVEY_TYPES || [];
  });
  const [notificationSettings, setNotificationSettings] = useState(() => load('notificationSettings', INITIAL_NOTIFICATION_SETTINGS));
  const [notificationLogs, setNotificationLogs] = useState(() => load('notificationLogs', INITIAL_NOTIFICATION_LOGS));
  const [users, setUsers] = useState(() => load('users', INITIAL_USERS));
  const [audits, setAudits] = useState(() => {
    // Migration: user requested default audit session kosong dan bersih
    const migrationKey = 'pms_audits_clean_v4';
    if (!localStorage.getItem(migrationKey)) {
      localStorage.setItem(migrationKey, 'true');
      localStorage.setItem('pms_audits', JSON.stringify([]));
      localStorage.setItem('pms_auditFindings', JSON.stringify([]));
      return [];
    }
    const loaded = load('audits', INITIAL_AUDITS);
    if (Array.isArray(loaded)) {
      return loaded.map(a => ({
        ...a,
        externalOrganization: typeof a.externalOrganization === 'object' && a.externalOrganization !== null
          ? (a.externalOrganization.name || a.externalOrganization.shortName || 'Biro Klasifikasi Indonesia (BKI)')
          : a.externalOrganization
      }));
    }
    return INITIAL_AUDITS;
  });
  const [auditFindings, setAuditFindings] = useState(() => {
    const loaded = load('auditFindings', INITIAL_AUDIT_FINDINGS);
    if (Array.isArray(loaded)) {
      return loaded.map(f => ({
        ...f,
        externalOrganization: typeof f.externalOrganization === 'object' && f.externalOrganization !== null
          ? (f.externalOrganization.name || f.externalOrganization.shortName || 'Biro Klasifikasi Indonesia (BKI)')
          : f.externalOrganization
      }));
    }
    return INITIAL_AUDIT_FINDINGS;
  });

  // CMS Site Configuration (login page content, branding, backgrounds)
  // CMS Site Configuration (login page content, branding, backgrounds)
  

  const [siteConfig, setSiteConfig] = useState(() => {
    const stored = load('siteConfig', null);
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
    const stored = load('sidebarOverrides', null);
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

  

  const [vesselTypes, setVesselTypes] = useState(() => load('vesselTypes', DEFAULT_VESSEL_TYPES));
  const [portLocations, setPortLocations] = useState(() => load('portLocations', DEFAULT_MASTER_PORTS));

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
  const [activeTab, setActiveTabRaw] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => setIsMobileSidebarOpen(prev => !prev);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);
  const openMobileSidebar = () => setIsMobileSidebarOpen(true);

  const setActiveTab = (tab) => {
    setActiveTabRaw(tab);
    setIsMobileSidebarOpen(false); // Auto close sidebar on mobile navigation
  };

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
    persistAllState({
      vessels, equipment, schedules, workOrders, technicalWorkOrders,
      dailyMachineryLogs, criticalEquipmentTests, safeManningStandards,
      spareparts, requisitions, costs, vesselBudgets, crew, leaves, drills,
      crewCertificates, shipDocuments, certificateCategories, documentTemplates,
      notificationSettings, notificationLogs, users, audits, auditFindings,
      siteConfig, sidebarOverrides,
    });
  }, [
    vessels, equipment, schedules, workOrders, technicalWorkOrders, dailyMachineryLogs, criticalEquipmentTests, safeManningStandards,
    spareparts, requisitions, costs, vesselBudgets, crew, leaves, drills, crewCertificates, shipDocuments,
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
      id: makeId('eq'),
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

  // 2B. Technical Work Orders (Closed-Loop Maintenance System)
  const addTechnicalWorkOrder = (newWO) => {
    const nextId = `WO-${new Date().getFullYear()}-${String(technicalWorkOrders.length + 1).padStart(3, '0')}`;
    const item = {
      ...newWO,
      id: newWO.id || nextId,
      status: newWO.status || 'Scheduled',
      createdAt: new Date().toISOString()
    };
    setTechnicalWorkOrders(prev => [item, ...prev]);
    showToast(`Perintah kerja servis teknis ${item.id} berhasil diterbitkan!`, 'success');
    return item;
  };

  const updateTechnicalWorkOrder = (woId, updatedData) => {
    setTechnicalWorkOrders(prev => prev.map(w => w.id === woId ? { ...w, ...updatedData } : w));
    showToast(`Data Work Order ${woId} berhasil diperbarui!`, 'success');
  };

  const completeTechnicalWorkOrder = (woId, completionData) => {
    const targetWO = technicalWorkOrders.find(w => w.id === woId);
    const eqId = targetWO?.equipmentId || completionData.equipmentId;

    // 1. Update WO status to 'Completed'
    setTechnicalWorkOrders(prev => prev.map(w => {
      if (w.id !== woId) return w;
      return {
        ...w,
        ...completionData,
        status: 'Completed',
        completionDate: completionData.completionDate || new Date().toISOString().split('T')[0]
      };
    }));

    // 2. Closed-loop: Update target equipment running hours and next service hours
    if (eqId) {
      setEquipment(prev => prev.map(eq => {
        if (eq.id !== eqId) return eq;
        const executedHours = Number(completionData.executedRunningHours) || eq.runningHours || 0;
        const sched = schedules.find(s => s.id === targetWO?.scheduleId);
        const interval = sched?.intervalHours || 500;
        const nextService = executedHours + interval;

        return {
          ...eq,
          runningHours: executedHours,
          lastMaintenanceHours: executedHours,
          nextServiceHours: nextService,
          status: 'Normal'
        };
      }));
    }

    // 3. Closed-loop: Consume onboard spareparts
    if (completionData.sparepartsConsumed && completionData.sparepartsConsumed.length > 0) {
      completionData.sparepartsConsumed.forEach(part => {
        if (part.sparepartId && part.qty > 0) {
          consumeStockOnboard(part.sparepartId, part.qty, `Servis ${woId} (${targetWO?.title || ''})`);
        }
      });
    }

    // 4. Closed-loop: Post service cost to vessel expense transactions if cost > 0
    if (completionData.serviceCost > 0) {
      const vId = targetWO?.vesselId || selectedVesselId;
      addExpenseTransaction({
        vesselId: vId,
        transactionDate: completionData.completionDate || new Date().toISOString().split('T')[0],
        category: 'Perawatan & Servis Kapal',
        description: `Jasa servis/teknisi eksternal WO ${woId}: ${targetWO?.title || ''}`,
        amount: Number(completionData.serviceCost) || 0,
        linkedWorkOrderId: woId
      });
    }

    confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
    showToast(`Work Order ${woId} berhasil diselesaikan! Siklus servis mesin & stok suku cadang telah disinkronkan.`, 'success');
  };

  const deleteTechnicalWorkOrder = (woId) => {
    setTechnicalWorkOrders(prev => prev.filter(w => w.id !== woId));
    showToast(`Work Order ${woId} berhasil dihapus.`, 'info');
  };

  // 2C. Buku Jurnal Harian Mesin (Daily Machinery Logs Batch Entry)
  const batchLogMachineryHours = (vesselId, logDate, entries, metadata = {}) => {
    let overdueCount = 0;

    // Update running hours on each equipment
    setEquipment(prev => prev.map(eq => {
      const entry = entries.find(e => e.equipmentId === eq.id);
      if (!entry) return eq;

      const added = Number(entry.addedHours) || 0;
      const newHours = (eq.runningHours || 0) + added;
      const hoursToNext = eq.nextServiceHours - newHours;
      let newStatus = 'Normal';
      if (hoursToNext <= 0) {
        newStatus = 'Overdue';
        overdueCount++;
      } else if (hoursToNext <= 200) {
        newStatus = 'Due Soon';
      }

      return {
        ...eq,
        runningHours: newHours,
        status: newStatus
      };
    }));

    // Record log into dailyMachineryLogs
    const newLog = {
      id: makeId('dml'),
      vesselId,
      logDate,
      loggedBy: metadata.loggedBy || 'Masinis Jaga',
      chiefEngineer: metadata.chiefEngineer || 'Chief Engineer',
      verifiedByCaptain: false,
      entries
    };

    setDailyMachineryLogs(prev => [newLog, ...prev]);

    if (overdueCount > 0) {
      showToast(`Buku jurnal harian disimpan! PERHATIAN: ${overdueCount} mesin telah mencapai batas servis berkala (Overdue).`, 'warning');
    } else {
      showToast(`Buku jurnal harian ${logDate} berhasil disimpan! Jam jalan ${entries.length} mesin diperbarui.`, 'success');
    }
  };

  // 2D. Critical Equipment & Emergency Standby Test (ISM 10.3)
  const logCriticalEquipmentTest = (testData) => {
    const newTest = {
      ...testData,
      id: makeId('cet'),
      recordedAt: new Date().toISOString()
    };
    setCriticalEquipmentTests(prev => [newTest, ...prev]);

    const isPass = testData.testResult?.includes('Pass');
    if (isPass) {
      showToast(`Uji darurat ${testData.testTitle} tercatat: BERFUNGSI BAIK (PASS).`, 'success');
    } else {
      showToast(`PERINGATAN: Uji darurat ${testData.testTitle} dinyatakan DEFECTIVE. Harap segera terbitkan Work Order perbaikan!`, 'danger');
    }
    return newTest;
  };

  // 2E. Safe Manning Compliance Evaluation
  const getSafeManningStatus = (vId) => {
    const targetVessel = vessels.find(v => v.id === vId);
    if (!targetVessel) return { isCompliant: true, deficiencies: [], totalRequired: 0, totalOnboard: 0 };

    const vType = targetVessel.type?.toLowerCase() || '';
    const standards = safeManningStandards || [];

    const foundStandard = standards.find(s => {
      const stType = s.vesselType.toLowerCase();
      if (vType.includes('tug') && stType.includes('tug')) return true;
      if (vType.includes('tongkang') && stType.includes('tongkang')) return true;
      if (vType.includes('lct') && stType.includes('lct')) return true;
      return stType === vType;
    }) || standards[0];

    if (!foundStandard?.positions) return { isCompliant: true, deficiencies: [], totalRequired: 0, totalOnboard: 0 };

    const onboard = (crew || []).filter(c => c.vesselId === vId && c.status === 'Onboard');
    const deficiencies = [];
    let totalReq = 0;

    foundStandard.positions.forEach(reqPos => {
      if (reqPos.mandatory) totalReq += reqPos.count;
      const matched = onboard.filter(c => {
        const cRank = c.rank.toLowerCase();
        const pTitle = reqPos.rankTitle.toLowerCase();
        if (pTitle.includes('nakhoda') && (cRank.includes('nakhoda') || cRank.includes('master'))) return true;
        if (pTitle.includes('mualim') && (cRank.includes('mualim') || cRank.includes('chief mate'))) return true;
        if (pTitle.includes('kkm') && (cRank.includes('kkm') || cRank.includes('chief engineer'))) return true;
        if (pTitle.includes('masinis') && cRank.includes('masinis')) return true;
        if (pTitle.includes('juru mudi') && (cRank.includes('juru mudi') || cRank.includes('kelasi') || cRank.includes('abk'))) return true;
        if (pTitle.includes('juru minyak') && (cRank.includes('juru minyak') || cRank.includes('oiler'))) return true;
        return cRank === pTitle;
      });

      if (matched.length < reqPos.count && reqPos.mandatory) {
        deficiencies.push(`Kekurangan ${reqPos.rankTitle} (dibutuhkan ${reqPos.count}, ada ${matched.length})`);
      }
    });

    return {
      isCompliant: deficiencies.length === 0,
      deficiencies,
      totalRequired: totalReq,
      totalOnboard: onboard.length,
      vesselName: targetVessel.name
    };
  };

  // 2F. Ship-to-Shore Sync & Full Database Backup/Restore
  const exportShipSyncPackage = (vId) => {
    const vessel = vessels.find(v => v.id === vId) || vessels[0];
    const vesselEquipmentList = (equipment || []).filter(e => e.vesselId === vId);
    const vesselWOs = (technicalWorkOrders || []).filter(w => w.vesselId === vId);
    const vesselLogs = (dailyMachineryLogs || []).filter(l => l.vesselId === vId);
    const vesselTests = (criticalEquipmentTests || []).filter(t => t.vesselId === vId);
    const vesselSparepartsList = (spareparts || []).filter(s => s.vesselId === vId);

    const syncPackage = {
      packageType: 'PMS_VESSEL_SYNC_PACKAGE',
      version: PMS_STORAGE_VERSION,
      timestamp: new Date().toISOString(),
      vesselId: vId,
      vesselName: vessel?.name,
      equipment: vesselEquipmentList,
      technicalWorkOrders: vesselWOs,
      dailyMachineryLogs: vesselLogs,
      criticalEquipmentTests: vesselTests,
      spareparts: vesselSparepartsList
    };

    const blob = new Blob([JSON.stringify(syncPackage, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `PMS_SYNC_${(vessel?.name || 'VESSEL').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Paket sinkronisasi kapal ${vessel?.name} berhasil diekspor!`, 'success');
  };

  const exportFullDatabaseBackup = () => {
    const fullBackup = {
      backupType: 'PMS_FULL_SYSTEM_BACKUP',
      version: PMS_STORAGE_VERSION,
      timestamp: new Date().toISOString(),
      vessels,
      equipment,
      schedules,
      technicalWorkOrders,
      workOrders,
      dailyMachineryLogs,
      criticalEquipmentTests,
      safeManningStandards,
      spareparts,
      requisitions,
      costs,
      vesselBudgets,
      crew,
      leaves,
      drills,
      crewCertificates,
      shipDocuments,
      certificateCategories,
      documentTemplates,
      masterSurveyTypes,
      notificationSettings,
      notificationLogs,
      users,
      audits,
      auditFindings
    };

    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `PMS_FULL_BACKUP_BAHARIMAS_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Cadangan penuh basis data berhasil diunduh!', 'success');
  };

  const importSyncPackage = (pkg) => {
    if (!pkg || typeof pkg !== 'object') {
      showToast('Paket sinkronisasi tidak valid!', 'danger');
      return;
    }

    if (pkg.packageType === 'PMS_VESSEL_SYNC_PACKAGE') {
      const vId = pkg.vesselId;
      if (pkg.equipment && Array.isArray(pkg.equipment)) {
        setEquipment(prev => {
          const other = prev.filter(e => e.vesselId !== vId);
          return [...other, ...pkg.equipment];
        });
      }
      if (pkg.technicalWorkOrders && Array.isArray(pkg.technicalWorkOrders)) {
        setTechnicalWorkOrders(prev => {
          const other = prev.filter(w => w.vesselId !== vId);
          return [...other, ...pkg.technicalWorkOrders];
        });
      }
      if (pkg.dailyMachineryLogs && Array.isArray(pkg.dailyMachineryLogs)) {
        setDailyMachineryLogs(prev => {
          const other = prev.filter(l => l.vesselId !== vId);
          return [...other, ...pkg.dailyMachineryLogs];
        });
      }
      if (pkg.criticalEquipmentTests && Array.isArray(pkg.criticalEquipmentTests)) {
        setCriticalEquipmentTests(prev => {
          const other = prev.filter(t => t.vesselId !== vId);
          return [...other, ...pkg.criticalEquipmentTests];
        });
      }
      if (pkg.spareparts && Array.isArray(pkg.spareparts)) {
        setSpareparts(prev => {
          const other = prev.filter(s => s.vesselId !== vId);
          return [...other, ...pkg.spareparts];
        });
      }

      showToast(`Pembaruan data kapal ${pkg.vesselName || vId} berhasil digabungkan ke sistem kantor darat!`, 'success');
    } else {
      showToast('Tipe paket tidak dikenali untuk sinkronisasi kapal.', 'warning');
    }
  };

  const restoreFullDatabase = (backup) => {
    if (!backup || typeof backup !== 'object') {
      showToast('File backup database tidak valid!', 'danger');
      return;
    }

    if (backup.vessels) setVessels(backup.vessels);
    if (backup.equipment) setEquipment(backup.equipment);
    if (backup.schedules) setSchedules(backup.schedules);
    if (backup.technicalWorkOrders) setTechnicalWorkOrders(backup.technicalWorkOrders);
    if (backup.workOrders) setWorkOrders(backup.workOrders);
    if (backup.dailyMachineryLogs) setDailyMachineryLogs(backup.dailyMachineryLogs);
    if (backup.criticalEquipmentTests) setCriticalEquipmentTests(backup.criticalEquipmentTests);
    if (backup.safeManningStandards) setSafeManningStandards(backup.safeManningStandards);
    if (backup.spareparts) setSpareparts(backup.spareparts);
    if (backup.requisitions) setRequisitions(backup.requisitions);
    if (backup.costs) setCosts(backup.costs);
    if (backup.vesselBudgets) setVesselBudgets(backup.vesselBudgets);
    if (backup.crew) setCrew(backup.crew);
    if (backup.leaves) setLeaves(backup.leaves);
    if (backup.drills) setDrills(backup.drills);
    if (backup.crewCertificates) setCrewCertificates(backup.crewCertificates);
    if (backup.shipDocuments) setShipDocuments(backup.shipDocuments);
    if (backup.audits) setAudits(backup.audits);
    if (backup.auditFindings) setAuditFindings(backup.auditFindings);

    showToast('Seluruh database berhasil dipulihkan dari file backup!', 'success');
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
      id: makeId('log'),
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
            id: budgetId || makeId('bud'),
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
      id: expenseData.id || makeId('cost'),
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
      id: makeId('crew'),
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
      id: makeId('leave'),
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending Ship Admin'
    };
    setLeaves(prev => [newLeave, ...prev]);
    showToast(`Pengajuan cuti diajukan untuk approval`, 'info');
  };

  const addDrill = (drillData) => {
    const d = {
      ...drillData,
      id: makeId('drill'),
      conductedDate: drillData.conductedDate || new Date().toISOString().split('T')[0]
    };
    setDrills(prev => [d, ...prev]);
    showToast(`Laporan latihan keselamatan (Safety Drill) berhasil dicatat`, 'success');
  };

  // 4c. User Management Actions
  const addUser = (userData) => {
    const newId = makeId('u');
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
      const newId = makeId('v');
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
      id: makeId('doc-s'),
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
    const id = newTmpl.id || makeId(`cn-${Math.floor(Math.random() * 1000)}`);

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
    const id = newSurvey.id || makeId(`st-${Math.floor(Math.random() * 1000)}`);

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
      id: makeId('aud'),
      auditNo,
      reportId: auditData.reportId || `PT. PELAYARAN BAHARIMAS KALIMANTAN - ${auditData.targetName || 'RP'} - ${auditNo}`,
      docRevision: auditData.docRevision || 'F23.14.06-2024 Rev 05',
      auditType: auditData.auditType || 'Internal',
      externalOrganization: auditData.externalOrganization || (auditData.auditType === 'External' ? 'Biro Klasifikasi Indonesia (BKI)' : null),
      standard: std,
      targetType: auditData.targetType || (std === 'DOC' ? 'Office' : 'Vessel'),
      targetName: auditData.targetName || (auditData.vesselId ? (vessels.find(v => v.id === auditData.vesselId)?.name || 'Kapal Armada') : 'Kantor Pusat PT. Pelayaran Baharimas Kalimantan (Pontianak)'),
      areaUnderAudit: auditData.areaUnderAudit || auditData.targetName || '',
      vesselId: auditData.vesselId || null,
      leadAuditor: auditData.leadAuditor || (isInt ? 'DPA / Lead Auditor Internal PT. PBK' : 'MUHSON NURROCHMAT S'),
      auditTeam: Array.isArray(auditData.auditTeam) ? auditData.auditTeam : (auditData.auditTeam ? [auditData.auditTeam] : ['Tim Inspektor Keselamatan']),
      auditee: auditData.auditee || (std === 'DOC' ? 'Direktur Operasional & DPA' : 'CAPT. EKHSAN (Nakhoda)'),
      auditLocation: auditData.auditLocation || 'PULANG PISAU',
      auditDate: auditData.auditDate || new Date().toISOString().split('T')[0],
      targetCloseDate: auditData.targetCloseDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      scope: auditData.scope || `Audit ${auditData.auditType || 'Internal'} Kepatuhan ISM Code Standar ${std}.`,
      status: auditData.status || 'In Progress',
      totalItemsChecked: Number(auditData.totalItemsChecked) || 20,
      itemsComplied: Number(auditData.itemsComplied) || 18,
      checklist: auditData.checklist || [],
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
    if (!auditId) return;
    const cleanId = String(auditId).trim().toLowerCase();
    let deletedLabel = String(auditId).trim();

    setAudits(prev => {
      const target = prev.find(a =>
        String(a.id || '').trim().toLowerCase() === cleanId ||
        String(a.auditNo || '').trim().toLowerCase() === cleanId
      );
      const targetId = target?.id ? String(target.id).trim().toLowerCase() : cleanId;
      const targetNo = target?.auditNo ? String(target.auditNo).trim().toLowerCase() : cleanId;
      if (target?.auditNo) deletedLabel = target.auditNo;

      const next = prev.filter(a => {
        const aId = String(a.id || '').trim().toLowerCase();
        const aNo = String(a.auditNo || '').trim().toLowerCase();
        if (aId === targetId || aId === cleanId) return false;
        if (aNo === targetNo || aNo === cleanId) return false;
        return true;
      });

      try {
        localStorage.setItem('pms_audits', JSON.stringify(next));
      } catch (err) {
        console.error('Failed saving pms_audits:', err);
      }
      return next;
    });

    setAuditFindings(prev => {
      const next = prev.filter(f => {
        const fAuditId = String(f.auditId || '').trim().toLowerCase();
        const fAuditNo = String(f.auditNo || '').trim().toLowerCase();
        if (fAuditId === cleanId) return false;
        if (deletedLabel && fAuditNo === deletedLabel.toLowerCase()) return false;
        return true;
      });

      try {
        localStorage.setItem('pms_auditFindings', JSON.stringify(next));
      } catch (err) {
        console.error('Failed saving pms_auditFindings:', err);
      }
      return next;
    });

    showToast(`✓ Sesi audit "${deletedLabel}" berhasil dihapus.`, 'info');
  };

  const addAuditFinding = (findingData) => {
    const std = findingData.standard || 'DOC';
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 9000 + 1000);
    const findingNo = findingData.findingNo?.trim() || `NC-${std}-${randomNum}`;

    const newFinding = {
      ...findingData,
      id: makeId('nc'),
      findingNo,
      reportId: findingData.reportId || `0859 - PK/ISM- SMC /${year}`,
      areaUnderAudit: findingData.areaUnderAudit || findingData.targetName || (findingData.vesselId ? (vessels.find(v => v.id === findingData.vesselId)?.name) : 'Kantor Pusat'),
      elementNumberOfCode: findingData.elementNumberOfCode || findingData.clauseCode || '5.1.5',
      auditId: findingData.auditId || (audits[0]?.id || 'aud-doc-001'),
      auditNo: findingData.auditNo || (audits.find(a => a.id === findingData.auditId)?.auditNo || 'AUD-ISM'),
      auditType: findingData.auditType || 'Internal',
      externalOrganization: findingData.externalOrganization || null,
      standard: std,
      targetName: findingData.targetName || (findingData.vesselId ? (vessels.find(v => v.id === findingData.vesselId)?.name) : 'Kantor Pusat'),
      vesselId: findingData.vesselId || null,
      clauseCode: findingData.clauseCode || '5.1.5',
      clauseName: findingData.clauseName || 'Tanggung Jawab & Wewenang Nakhoda',
      category: findingData.category || 'Non-Conformity',
      status: findingData.status || 'NC Open',
      description: findingData.description || '',
      objectiveEvidence: findingData.objectiveEvidence || '',
      dateIdentified: findingData.dateIdentified || new Date().toISOString().split('T')[0],
      dueDate: findingData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      agreedDate: findingData.agreedDate || findingData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedTo: findingData.assignedTo || 'Nakhoda / Master',
      auditor: findingData.auditor || 'MUHSON NURROCHMAT S',
      auditee: findingData.auditee || 'CAPT. EKHSAN',
      correction: findingData.correction || '',
      rootCause: findingData.rootCause || '',
      correctiveAction: findingData.correctiveAction || '',
      verifiedUpgradeDowngrade: findingData.verifiedUpgradeDowngrade || null,
      verifiedSatisfactory: findingData.verifiedSatisfactory ?? null,
      auditorSignatureDate: findingData.auditorSignatureDate || null,
      auditeeSignatureDate: findingData.auditeeSignatureDate || null,
      linkedRequisitionId: findingData.linkedRequisitionId || null,
      linkedRequisitionTitle: findingData.linkedRequisitionTitle || null,
      linkedCertificateId: findingData.linkedCertificateId || null,
      evidence: {
        hasSubmitted: findingData.evidence?.hasSubmitted || false,
        submissionDate: findingData.evidence?.submissionDate || null,
        submittedBy: findingData.evidence?.submittedBy || null,
        correction: findingData.evidence?.correction || findingData.correction || null,
        rootCause: findingData.evidence?.rootCause || findingData.rootCause || null,
        correctiveAction: findingData.evidence?.correctiveAction || findingData.correctiveAction || null,
        preventiveAction: findingData.evidence?.preventiveAction || null,
        fileUrl: findingData.evidence?.fileUrl || null,
        fileName: findingData.evidence?.fileName || null,
        fileSize: findingData.evidence?.fileSize || null,
        auditorReviewNotes: findingData.evidence?.auditorReviewNotes || null,
        closedDate: findingData.evidence?.closedDate || null,
        verifiedUpgradeDowngrade: findingData.evidence?.verifiedUpgradeDowngrade || null,
        verifiedSatisfactory: findingData.evidence?.verifiedSatisfactory ?? null
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
    if (!findingId) return;
    const cleanId = String(findingId).trim().toLowerCase();
    let deletedLabel = String(findingId).trim();

    setAuditFindings(prev => {
      const target = prev.find(f =>
        String(f.id || '').trim().toLowerCase() === cleanId ||
        String(f.findingNo || '').trim().toLowerCase() === cleanId
      );
      const targetId = target?.id ? String(target.id).trim().toLowerCase() : cleanId;
      const targetNo = target?.findingNo ? String(target.findingNo).trim().toLowerCase() : cleanId;
      if (target?.findingNo) deletedLabel = target.findingNo;

      const next = prev.filter(f => {
        const fId = String(f.id || '').trim().toLowerCase();
        const fNo = String(f.findingNo || '').trim().toLowerCase();
        if (fId === targetId || fId === cleanId) return false;
        if (fNo === targetNo || fNo === cleanId) return false;
        return true;
      });

      try {
        localStorage.setItem('pms_auditFindings', JSON.stringify(next));
      } catch (err) {
        console.error('Failed saving pms_auditFindings:', err);
      }
      return next;
    });

    showToast(`✓ Temuan "${deletedLabel}" berhasil dihapus.`, 'info');
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
      id: makeId('th-custom'),
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



  // ---- Wrapper pengikat untuk fungsi notifikasi yang dipindah ke ./logic/ ----
  // Badan fungsi kini tinggal di modul sendiri dan menerima dependensi induk
  // sebagai parameter; di sini parameter itu diikat sekali. Tanda tangan yang
  // dilihat pemanggil TIDAK berubah, jadi konsumen context tidak perlu diubah.
  const resolveEmailRecipients = (item, type = 'crew_cert', options = {}) =>
    resolveEmailRecipientsRaw(item, type, options, notificationSettings, users, crew);

  const getGoogleCalendarUrl = (item, options = {}) =>
    getGoogleCalendarUrlRaw(item, options, notificationSettings, vessels);

  const sendEmailReminder = async (item, type = 'crew_cert', options = {}) =>
    sendEmailReminderRaw(item, type, options, notificationSettings, vessels, resolveEmailRecipients, setNotificationLogs, showToast);

  const sendWhatsAppReminder = async (item, type = 'crew_cert', options = {}) =>
    sendWhatsAppReminderRaw(item, type, options, notificationSettings, vessels, crew, setNotificationLogs, showToast);

  const exportMultiIntervalICS = (filterOffset = null) =>
    exportMultiIntervalICSRaw(filterOffset, notificationSettings, vessels, crewCertificates, shipDocuments, showToast);

  // Helper specifically for sending Audit NC Open / Close WhatsApp notifications
  const sendAuditWhatsAppNotification = async (finding, notificationType = 'open', options = {}) => {
    const type = notificationType === 'open' ? 'audit_nc_open' : 'audit_nc_close';
    return await sendWhatsAppReminder(finding, type, options);
  };





  const sendAuditEmailNotification = async (finding, notificationType = 'open', options = {}) => {
    const type = notificationType === 'open' ? 'audit_nc_open' : 'audit_nc_close';
    return await sendEmailReminder(finding, type, options);
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
      id: makeId('notif'),
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
          id: makeId(`notif-auto-wa-${m.item.id}-${m.threshold.days}`),
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
          id: makeId(`notif-auto-email-${m.item.id}-${m.threshold.days}`),
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
    localStorage.setItem('pms_technicalWorkOrders', JSON.stringify([]));
    localStorage.setItem('pms_dailyMachineryLogs', JSON.stringify([]));
    localStorage.setItem('pms_criticalEquipmentTests', JSON.stringify([]));

    showToast('Seluruh data dummy berhasil dikosongkan. Sistem bersih dan siap diinput dari nol!', 'info');
  };

  // Load demo seed data for evaluation / review
  const loadDemoData = () => {
    const dVessels = DEMO_DATA.INITIAL_VESSELS || [];
    const dEquip = DEMO_DATA.INITIAL_EQUIPMENT || [];
    const dSched = DEMO_DATA.INITIAL_MAINTENANCE_SCHEDULES || [];
    const dWO = DEMO_DATA.INITIAL_WORK_ORDERS || [];
    const dTechWO = DEMO_DATA.INITIAL_TECHNICAL_WORK_ORDERS || [];
    const dDailyLogs = DEMO_DATA.INITIAL_DAILY_MACHINERY_LOGS || [];
    const dCritTests = DEMO_DATA.INITIAL_CRITICAL_EQUIPMENT_TESTS || [];
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
    setTechnicalWorkOrders(dTechWO);
    setDailyMachineryLogs(dDailyLogs);
    setCriticalEquipmentTests(dCritTests);
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
    localStorage.setItem('pms_technicalWorkOrders', JSON.stringify(dTechWO));
    localStorage.setItem('pms_dailyMachineryLogs', JSON.stringify(dDailyLogs));
    localStorage.setItem('pms_criticalEquipmentTests', JSON.stringify(dCritTests));
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
  const smcOpenNCCount = (auditFindings || []).filter(f => (f.standard === 'SMC' || f.vesselId) && (f.status === 'NC Open' || f.status === 'Eviden Submitted')).length;
  const docOpenNCCount = (auditFindings || []).filter(f => (f.standard === 'DOC' || !f.vesselId) && (f.status === 'NC Open' || f.status === 'Eviden Submitted')).length;

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
        technicalWorkOrders: selectedVesselId === 'all' ? technicalWorkOrders : technicalWorkOrders.filter(w => w.vesselId === selectedVesselId),
        allTechnicalWorkOrders: technicalWorkOrders,
        dailyMachineryLogs: selectedVesselId === 'all' ? dailyMachineryLogs : dailyMachineryLogs.filter(l => l.vesselId === selectedVesselId),
        allDailyMachineryLogs: dailyMachineryLogs,
        criticalEquipmentTests: selectedVesselId === 'all' ? criticalEquipmentTests : criticalEquipmentTests.filter(t => t.vesselId === selectedVesselId),
        allCriticalEquipmentTests: criticalEquipmentTests,
        safeManningStandards,
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
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        toggleMobileSidebar,
        closeMobileSidebar,
        openMobileSidebar,
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
        smcOpenNCCount,
        docOpenNCCount,

        // Actions
        updateRunningHours,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        toggleChecklist,
        updateWorkOrderStatus,
        addWorkOrder,
        updateWorkOrder,
        addTechnicalWorkOrder,
        updateTechnicalWorkOrder,
        completeTechnicalWorkOrder,
        deleteTechnicalWorkOrder,
        batchLogMachineryHours,
        logCriticalEquipmentTest,
        setSafeManningStandards,
        getSafeManningStatus,
        exportShipSyncPackage,
        exportFullDatabaseBackup,
        importSyncPackage,
        restoreFullDatabase,
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
        reopenAuditFinding,

        // Audit Masters
        ISM_DOC_ELEMENTS,
        BKI_SMC_CHECKLIST_TEMPLATE,
        ISM_SMC_ELEMENTS,
        EXTERNAL_AUDIT_ORGANIZATIONS
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
