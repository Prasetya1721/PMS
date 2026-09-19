import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  INITIAL_VESSELS,
  INITIAL_EQUIPMENT,
  INITIAL_MAINTENANCE_SCHEDULES,
  INITIAL_WORK_ORDERS,
  INITIAL_SPAREPARTS,
  INITIAL_REQUISITIONS,
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
import { CERTIFICATE_CATEGORIES, STANDARD_CERTIFICATE_TEMPLATES } from '../data/shipCertificatesMaster';

const PMSContext = createContext();

const PMS_STORAGE_VERSION = 'v8-fleet-28-categories-dates';

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
      const parsed = JSON.parse(saved);
      // Extra safeguard: if stored vessels array doesn't have 28 items or lacks v-op-, force reload fallback
      if (key === 'vessels') {
        if (!Array.isArray(parsed) || parsed.length !== fallback.length || !parsed.some(v => v.id?.startsWith('v-op-'))) {
          return fallback;
        }
        return parsed.map(v => {
          const fallbackVessel = fallback.find(fb => fb.id === v.id) || {};
          let photo = v.photo || fallbackVessel.photo;
          if (!photo || photo.includes('photo-1544620347-c4fd4a3d5957')) {
            photo = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80';
          }
          return {
            ...fallbackVessel,
            ...v,
            photo,
            particulars: v.particulars || fallbackVessel.particulars || createDefaultShipParticulars(v)
          };
        });
      }
      if (key === 'shipDocuments' && (!Array.isArray(parsed) || parsed.length < 215)) {
        return fallback;
      }
      if (key === 'notificationSettings') {
        if (!parsed || !parsed.thresholds || !parsed.autoSend || !parsed.thresholds.some(t => t.id === 'th-1d')) {
          return fallback;
        }
        return {
          ...fallback,
          ...parsed,
          thresholds: parsed.thresholds || fallback.thresholds,
          customThresholds: parsed.customThresholds || fallback.customThresholds,
          autoSend: {
            ...fallback.autoSend,
            ...(parsed.autoSend || {})
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
  const [crew, setCrew] = useState(() => loadStored('crew', INITIAL_CREW));
  const [leaves, setLeaves] = useState(() => loadStored('leaves', INITIAL_LEAVES));
  const [drills, setDrills] = useState(() => loadStored('drills', INITIAL_DRILLS));
  const [crewCertificates, setCrewCertificates] = useState(() => loadStored('crewCertificates', INITIAL_CREW_CERTIFICATES));
  const [shipDocuments, setShipDocuments] = useState(() => loadStored('shipDocuments', INITIAL_SHIP_DOCUMENTS));
  const [certificateCategories, setCertificateCategories] = useState(() => loadStored('certificateCategories', CERTIFICATE_CATEGORIES));
  const [documentTemplates, setDocumentTemplates] = useState(() => loadStored('documentTemplates', STANDARD_CERTIFICATE_TEMPLATES));
  const [notificationSettings, setNotificationSettings] = useState(() => loadStored('notificationSettings', INITIAL_NOTIFICATION_SETTINGS));
  const [notificationLogs, setNotificationLogs] = useState(() => loadStored('notificationLogs', INITIAL_NOTIFICATION_LOGS));
  const [users, setUsers] = useState(() => loadStored('users', INITIAL_USERS));

  // Global App Controls
  const [selectedVesselId, setSelectedVesselId] = useState('all'); // 'all' or 'v-001' etc.
  const [currentRole, setCurrentRole] = useState('Super Admin');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Authentication state for PT. Pelayaran Baharimas Kalimantan
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pms_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    setCurrentUser(userData);
    if (userData.role) {
      setCurrentRole(userData.role);
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
    localStorage.setItem('pms_fleet_version', PMS_STORAGE_VERSION);
    localStorage.setItem('pms_vessels', JSON.stringify(vessels));
    localStorage.setItem('pms_equipment', JSON.stringify(equipment));
    localStorage.setItem('pms_schedules', JSON.stringify(schedules));
    localStorage.setItem('pms_workOrders', JSON.stringify(workOrders));
    localStorage.setItem('pms_spareparts', JSON.stringify(spareparts));
    localStorage.setItem('pms_requisitions', JSON.stringify(requisitions));
    localStorage.setItem('pms_costs', JSON.stringify(costs));
    localStorage.setItem('pms_crew', JSON.stringify(crew));
    localStorage.setItem('pms_leaves', JSON.stringify(leaves));
    localStorage.setItem('pms_drills', JSON.stringify(drills));
    localStorage.setItem('pms_crewCertificates', JSON.stringify(crewCertificates));
    localStorage.setItem('pms_shipDocuments', JSON.stringify(shipDocuments));
    localStorage.setItem('pms_certificateCategories', JSON.stringify(certificateCategories));
    localStorage.setItem('pms_documentTemplates', JSON.stringify(documentTemplates));
    localStorage.setItem('pms_notificationSettings', JSON.stringify(notificationSettings));
    localStorage.setItem('pms_notificationLogs', JSON.stringify(notificationLogs));
    localStorage.setItem('pms_users', JSON.stringify(users));
  }, [
    vessels, equipment, schedules, workOrders, spareparts, requisitions,
    costs, crew, leaves, drills, crewCertificates, shipDocuments,
    certificateCategories, documentTemplates, notificationSettings, notificationLogs, users
  ]);

  // Auto-heal state immediately if stale fleet data is present in memory
  useEffect(() => {
    const isStale =
      vessels.length === 0 ||
      !vessels.some(v => v.id?.startsWith('v-op-')) ||
      vessels.some(v => v.ownershipStatus === 'As Owner & Operator');

    if (isStale) {
      console.log('Synchronizing fleet database to 28 vessels and standard documents...');
      setVessels(INITIAL_VESSELS);
      setEquipment(INITIAL_EQUIPMENT);
      setSchedules(INITIAL_MAINTENANCE_SCHEDULES);
      setWorkOrders(INITIAL_WORK_ORDERS);
      setSpareparts(INITIAL_SPAREPARTS);
      setRequisitions(INITIAL_REQUISITIONS);
      setCosts(INITIAL_COSTS);
      setCrew(INITIAL_CREW);
      setLeaves(INITIAL_LEAVES);
      setDrills(INITIAL_DRILLS);
      setCrewCertificates(INITIAL_CREW_CERTIFICATES);
      setShipDocuments(INITIAL_SHIP_DOCUMENTS);
      setNotificationSettings(INITIAL_NOTIFICATION_SETTINGS);
      setNotificationLogs(INITIAL_NOTIFICATION_LOGS);

      localStorage.setItem('pms_fleet_version', PMS_STORAGE_VERSION);
      localStorage.setItem('pms_vessels', JSON.stringify(INITIAL_VESSELS));
      localStorage.setItem('pms_equipment', JSON.stringify(INITIAL_EQUIPMENT));
      localStorage.setItem('pms_schedules', JSON.stringify(INITIAL_MAINTENANCE_SCHEDULES));
      localStorage.setItem('pms_workOrders', JSON.stringify(INITIAL_WORK_ORDERS));
      localStorage.setItem('pms_spareparts', JSON.stringify(INITIAL_SPAREPARTS));
      localStorage.setItem('pms_requisitions', JSON.stringify(INITIAL_REQUISITIONS));
      localStorage.setItem('pms_costs', JSON.stringify(INITIAL_COSTS));
      localStorage.setItem('pms_crew', JSON.stringify(INITIAL_CREW));
      localStorage.setItem('pms_leaves', JSON.stringify(INITIAL_LEAVES));
      localStorage.setItem('pms_drills', JSON.stringify(INITIAL_DRILLS));
      localStorage.setItem('pms_crewCertificates', JSON.stringify(INITIAL_CREW_CERTIFICATES));
      localStorage.setItem('pms_shipDocuments', JSON.stringify(INITIAL_SHIP_DOCUMENTS));
    }
  }, [vessels, shipDocuments, equipment, crew]);

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

  // 3. Sparepart & Inventory Actions
  const updateSparepartStock = (partId, delta) => {
    setSpareparts(prev => prev.map(sp => {
      if (sp.id !== partId) return sp;
      const newStock = Math.max(0, sp.stockQty + delta);
      let status = 'Normal';
      if (newStock === 0) status = 'Critical';
      else if (newStock < sp.minStockQty) status = 'Low Stock';
      return { ...sp, stockQty: newStock, status };
    }));
    showToast(`Stok sparepart telah disesuaikan`, 'info');
  };

  const addRequisition = (req) => {
    const newReq = {
      ...req,
      id: `PR-2026-${String(requisitions.length + 1).padStart(3, '0')}`,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'Submitted'
    };
    setRequisitions(prev => [newReq, ...prev]);
    showToast(`Pengajuan sparepart ${newReq.id} berhasil dikirim ke armada`, 'success');
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
    const newId = `v-${Date.now()}`;
    const isBarge = vesselData.type?.toLowerCase().includes('tongkang') || vesselData.type?.toLowerCase().includes('barge');
    const baseNewVessel = {
      ...vesselData,
      id: newId,
      gt: Number(vesselData.gt) || (isBarge ? 3500 : 300),
      dwt: Number(vesselData.dwt) || (isBarge ? 8500 : 450),
      yearBuilt: Number(vesselData.yearBuilt) || new Date().getFullYear(),
      speedKnots: Number(vesselData.speedKnots) || (isBarge ? 0 : 8.0),
      flag: vesselData.flag || "Indonesia (IDN)",
      portOfRegistry: vesselData.portOfRegistry || "Samarinda, Kalimantan Timur",
      status: vesselData.status || "Operasional (Berlayar)",
      ownershipStatus: vesselData.ownershipStatus || "As Owner & Operator",
      photo: vesselData.photo || (
        isBarge
          ? "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80"
          : "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
      )
    };

    const newVessel = {
      ...baseNewVessel,
      particulars: vesselData.particulars || createDefaultShipParticulars(baseNewVessel)
    };

    setVessels(prev => [newVessel, ...prev]);

    // Automatically create initial equipment for this newly added ship
    if (isBarge) {
      setEquipment(prev => [
        {
          id: `eq-${Date.now()}-1`,
          vesselId: newId,
          code: 'AW-01',
          name: 'Diesel Engine Anchor Windlass (Mesin Jangkar)',
          category: 'Deck Machinery',
          model: 'Dongnam Hydraulic/Diesel 15T',
          serialNumber: `DN-AW-${newVessel.regNo || 'NEW'}`,
          maker: 'Dongnam Marine',
          location: 'Forecastle Deck',
          runningHours: 100,
          lastMaintenanceHours: 0,
          nextServiceHours: 500,
          status: 'Normal',
          criticality: 'Tinggi',
          installedDate: new Date().toISOString().split('T')[0],
          subComponents: ['Brake Band', 'Hydraulic Motor']
        },
        {
          id: `eq-${Date.now()}-2`,
          vesselId: newId,
          code: 'FP-01',
          name: 'Emergency Diesel Fire Pump',
          category: 'Sistem Keselamatan',
          model: 'Portable Fire Pump 50 m3/h',
          serialNumber: `FP-${newVessel.regNo || 'NEW'}`,
          maker: 'Koshin Marine',
          location: 'Forward Store',
          runningHours: 40,
          lastMaintenanceHours: 0,
          nextServiceHours: 250,
          status: 'Normal',
          criticality: 'Tinggi',
          installedDate: new Date().toISOString().split('T')[0],
          subComponents: ['Impeller', 'Diesel Engine Starter']
        },
        ...prev
      ]);
    } else {
      setEquipment(prev => [
        {
          id: `eq-${Date.now()}-1`,
          vesselId: newId,
          code: 'ME-01',
          name: 'Main Engine Portside (Mesin Induk Kiri)',
          category: 'Propulsi',
          model: 'Marine Diesel Engine (1600 BHP)',
          serialNumber: `ME-${newVessel.regNo || 'NEW'}-P`,
          maker: 'Yanmar / Caterpillar',
          location: 'Engine Room Port',
          runningHours: 450,
          lastMaintenanceHours: 0,
          nextServiceHours: 1000,
          status: 'Normal',
          criticality: 'Tinggi',
          installedDate: new Date().toISOString().split('T')[0],
          subComponents: ['Turbocharger', 'Fuel Injection Pump', 'Cylinder Liners']
        },
        {
          id: `eq-${Date.now()}-2`,
          vesselId: newId,
          code: 'ME-02',
          name: 'Main Engine Starboard (Mesin Induk Kanan)',
          category: 'Propulsi',
          model: 'Marine Diesel Engine (1600 BHP)',
          serialNumber: `ME-${newVessel.regNo || 'NEW'}-S`,
          maker: 'Yanmar / Caterpillar',
          location: 'Engine Room Starboard',
          runningHours: 450,
          lastMaintenanceHours: 0,
          nextServiceHours: 1000,
          status: 'Normal',
          criticality: 'Tinggi',
          installedDate: new Date().toISOString().split('T')[0],
          subComponents: ['Turbocharger', 'Fuel Injection Pump', 'Cylinder Liners']
        },
        {
          id: `eq-${Date.now()}-3`,
          vesselId: newId,
          code: 'AE-01',
          name: 'Auxiliary Generator #1 (Genset Kiri)',
          category: 'Kelistrikan',
          model: 'Diesel Genset 120 kVA',
          serialNumber: `AE-${newVessel.regNo || 'NEW'}-1`,
          maker: 'Cummins Marine',
          location: 'Engine Room Platform',
          runningHours: 350,
          lastMaintenanceHours: 0,
          nextServiceHours: 1000,
          status: 'Normal',
          criticality: 'Tinggi',
          installedDate: new Date().toISOString().split('T')[0],
          subComponents: ['Alternator', 'Injectors']
        },
        {
          id: `eq-${Date.now()}-4`,
          vesselId: newId,
          code: 'TW-01',
          name: 'Hydraulic Towing Winch 45T',
          category: 'Deck Machinery',
          model: 'Plimsoll Hydraulic 45T',
          serialNumber: `TW-${newVessel.regNo || 'NEW'}`,
          maker: 'Plimsoll Marine',
          location: 'Aft Main Deck',
          runningHours: 200,
          lastMaintenanceHours: 0,
          nextServiceHours: 1000,
          status: 'Normal',
          criticality: 'Tinggi',
          installedDate: new Date().toISOString().split('T')[0],
          subComponents: ['Hydraulic Motor', 'Brake Band']
        },
        ...prev
      ]);
    }

    // Automatically create initial Captain & Chief Engineer crew for this new vessel
    if (newVessel.masterCaptain) {
      setCrew(prev => [
        {
          id: `crew-${Date.now()}-cap`,
          vesselId: newId,
          name: newVessel.masterCaptain,
          rank: isBarge ? "Barge Master" : "Nakhoda (Master)",
          department: "Deck",
          seamanBookNo: `B-${Math.floor(100000 + Math.random() * 900000)}-ID`,
          phone: "081288990011",
          whatsapp: "+6281288990011",
          status: "Onboard",
          signOnDate: new Date().toISOString().split('T')[0],
          signOffPlanDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          contractDurationMonths: 6,
          leaveBalanceDays: 14,
          photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
        },
        ...prev
      ]);
    }

    if (newVessel.chiefEngineer) {
      setCrew(prev => [
        {
          id: `crew-${Date.now()}-kkm`,
          vesselId: newId,
          name: newVessel.chiefEngineer,
          rank: isBarge ? "Teknisi Tongkang / Juru Mesin" : "Chief Engineer (KKM)",
          department: "Engine",
          seamanBookNo: `B-${Math.floor(100000 + Math.random() * 900000)}-ID`,
          phone: "081377881122",
          whatsapp: "+6281377881122",
          status: "Onboard",
          signOnDate: new Date().toISOString().split('T')[0],
          signOffPlanDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          contractDurationMonths: 6,
          leaveBalanceDays: 14,
          photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
        },
        ...prev
      ]);
    }

    // Automatically create initial Special Survey & Annual Survey document templates
    setShipDocuments(prev => [
      {
        id: `doc-s-${Date.now()}-ss`,
        vesselId: newId,
        category: "Classification",
        name: "Special Survey (SS) - Pembaruan Kelas BKI",
        documentNo: `BKI-SS-${newVessel.regNo || 'NEW'}`,
        issuer: "Biro Klasifikasi Indonesia (BKI)",
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "Active",
        daysUntilExpiry: 1825,
        mandatoryAuditor: `BKI Surveyor ${newVessel.portOfRegistry?.split(',')[0] || 'Samarinda'}`,
        scanFile: `bki_${newVessel.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_ss.pdf`
      },
      {
        id: `doc-s-${Date.now()}-as`,
        vesselId: newId,
        category: "Classification",
        name: "Annual Survey (AS) - Survei Tahunan Lambung & Mesin",
        documentNo: `BKI-AS-${newVessel.regNo || 'NEW'}`,
        issuer: "Biro Klasifikasi Indonesia (BKI)",
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "Active",
        daysUntilExpiry: 365,
        mandatoryAuditor: `BKI Surveyor ${newVessel.portOfRegistry?.split(',')[0] || 'Samarinda'}`,
        scanFile: `bki_${newVessel.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_as.pdf`
      },
      ...prev
    ]);

    showToast(`Kapal ${newVessel.name} berhasil ditambahkan manual ke database armada!`, 'success');
    return newVessel;
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
    const coreIds = ['BKI', 'Statutory', 'Asuransi', 'KSOP', 'Kesehatan'];
    if (coreIds.includes(catId)) {
      showToast(`Kategori standar maritim ${catId} tidak dapat dihapus.`, 'warning');
      return false;
    }
    setCertificateCategories(prev => {
      const next = prev.filter(c => c.id !== catId);
      localStorage.setItem('pms_certificateCategories', JSON.stringify(next));
      return next;
    });
    showToast('Kategori kustom berhasil dihapus.', 'info');
    return true;
  };

  // Master Document Templates Management (Auto-save new templates to Data Master)
  const addDocumentTemplate = (newTmpl) => {
    if (!newTmpl || !newTmpl.name) return null;
    const name = newTmpl.name.trim();
    const category = newTmpl.category || 'KSOP';

    const created = {
      name,
      category,
      defaultValidityYears: Number(newTmpl.defaultValidityYears) || 1,
      issuer: newTmpl.issuer || (category === 'KSOP' ? 'Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP)' : category === 'BKI' ? 'Biro Klasifikasi Indonesia (BKI)' : 'Instansi Penerbit Terkait'),
      docPrefix: newTmpl.docPrefix || name.substring(0, 4).toUpperCase(),
      mandatoryAuditor: newTmpl.mandatoryAuditor || (category === 'KSOP' ? 'Syahbandar KSOP' : category === 'BKI' ? 'Surveyor BKI' : 'Auditor / Surveyor Resmi'),
      isCustom: true
    };

    setDocumentTemplates(prev => {
      if (prev.some(t => t.name.toLowerCase() === name.toLowerCase() && t.category.toLowerCase() === category.toLowerCase())) {
        return prev;
      }
      const next = [...prev, created];
      localStorage.setItem('pms_documentTemplates', JSON.stringify(next));
      return next;
    });

    showToast(`Template dokumen "${created.name}" (${created.category}) otomatis tersimpan di Data Master!`, 'success');
    return created;
  };

  const deleteDocumentTemplate = (tmplName, category) => {
    setDocumentTemplates(prev => {
      const next = prev.filter(t => !(t.name.toLowerCase() === tmplName.toLowerCase() && (!category || t.category.toLowerCase() === category.toLowerCase())));
      localStorage.setItem('pms_documentTemplates', JSON.stringify(next));
      return next;
    });
    showToast(`Template "${tmplName}" berhasil dihapus dari Data Master.`, 'info');
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
      notifyChannels: notifyChannels || ['WhatsApp', 'Google Calendar']
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
      if (type === 'crew_cert') {
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
      vesselName,
      subject: `Reminder ${urgencyBadge}: ${item.name || item.title}`,
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

    const location = `${vesselName}, Pelabuhan Pendaftaran ${vessel?.portOfRegistry || 'Samarinda / Banjarmasin'}`;

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

    const newLogs = matchedDispatches.map(m => {
      const v = vessels.find(ship => ship.id === m.item.vesselId);
      const recipient = m.item.crewName || `Nakhoda & Admin ${v?.name || ''}`;
      return {
        id: `notif-auto-${Date.now()}-${m.item.id}-${m.threshold.days}`,
        timestamp: new Date().toLocaleString('id-ID'),
        channel: `WhatsApp Auto (${m.threshold.label})`,
        target: recipient,
        vesselName: v?.name || 'Fleet',
        subject: `[Auto Bot ${m.threshold.label}] ${m.item.name}`,
        message: `Pemberitahuan Otomatis ${m.threshold.label}: Dokumen ${m.item.name} akan jatuh tempo pada ${m.item.expiryDate} (${m.item.daysUntilExpiry} hari lagi).`,
        status: 'Delivered',
        thresholdTriggered: m.threshold.label
      };
    });

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

  // Reset to default seed data
  const resetToSeedData = () => {
    setVessels(INITIAL_VESSELS);
    setEquipment(INITIAL_EQUIPMENT);
    setSchedules(INITIAL_MAINTENANCE_SCHEDULES);
    setWorkOrders(INITIAL_WORK_ORDERS);
    setSpareparts(INITIAL_SPAREPARTS);
    setRequisitions(INITIAL_REQUISITIONS);
    setCosts(INITIAL_COSTS);
    setCrew(INITIAL_CREW);
    setLeaves(INITIAL_LEAVES);
    setDrills(INITIAL_DRILLS);
    setCrewCertificates(INITIAL_CREW_CERTIFICATES);
    setShipDocuments(INITIAL_SHIP_DOCUMENTS);
    setNotificationSettings(INITIAL_NOTIFICATION_SETTINGS);
    setNotificationLogs(INITIAL_NOTIFICATION_LOGS);
    setUsers(INITIAL_USERS);

    const preservedUser = localStorage.getItem('pms_current_user');
    localStorage.clear();
    if (preservedUser) {
      localStorage.setItem('pms_current_user', preservedUser);
    }
    localStorage.setItem('pms_fleet_version', PMS_STORAGE_VERSION);
    localStorage.setItem('pms_vessels', JSON.stringify(INITIAL_VESSELS));
    localStorage.setItem('pms_equipment', JSON.stringify(INITIAL_EQUIPMENT));
    localStorage.setItem('pms_schedules', JSON.stringify(INITIAL_MAINTENANCE_SCHEDULES));
    localStorage.setItem('pms_workOrders', JSON.stringify(INITIAL_WORK_ORDERS));
    localStorage.setItem('pms_spareparts', JSON.stringify(INITIAL_SPAREPARTS));
    localStorage.setItem('pms_requisitions', JSON.stringify(INITIAL_REQUISITIONS));
    localStorage.setItem('pms_costs', JSON.stringify(INITIAL_COSTS));
    localStorage.setItem('pms_crew', JSON.stringify(INITIAL_CREW));
    localStorage.setItem('pms_leaves', JSON.stringify(INITIAL_LEAVES));
    localStorage.setItem('pms_drills', JSON.stringify(INITIAL_DRILLS));
    localStorage.setItem('pms_crewCertificates', JSON.stringify(INITIAL_CREW_CERTIFICATES));
    localStorage.setItem('pms_shipDocuments', JSON.stringify(INITIAL_SHIP_DOCUMENTS));
    localStorage.setItem('pms_users', JSON.stringify(INITIAL_USERS));

    showToast('Seluruh data armada (28 kapal & 215 dokumen BKI) berhasil di-sinkronisasi ulang!', 'info');
  };

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

  const filteredDrills = selectedVesselId === 'all'
    ? drills
    : drills.filter(d => d.vesselId === selectedVesselId);

  // Critical counters
  const overdueWOCount = filteredWorkOrders.filter(w => w.status === 'Overdue').length;
  const expiredDocsCount = filteredShipDocs.filter(d => d.status === 'Expired').length +
                           filteredCrewCerts.filter(c => c.status === 'Expired').length;
  const dueSoonDocsCount = filteredShipDocs.filter(d => d.status === 'Due Soon').length +
                           filteredCrewCerts.filter(c => c.status === 'Due Soon').length;
  const lowStockCount = filteredSpareparts.filter(s => s.status === 'Low Stock' || s.status === 'Critical').length;

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
        crew: filteredCrew,
        allCrew: crew,
        leaves,
        drills: filteredDrills,
        crewCertificates: filteredCrewCerts,
        allCrewCertificates: crewCertificates,
        shipDocuments: filteredShipDocs,
        allShipDocuments: shipDocuments,
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

        // Theme Mode
        theme,
        setTheme,
        toggleTheme,

        // Filters & Navigation
        selectedVesselId,
        setSelectedVesselId,
        currentRole,
        setCurrentRole,
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

        // Actions
        updateRunningHours,
        toggleChecklist,
        updateWorkOrderStatus,
        addWorkOrder,
        updateWorkOrder,
        updateSparepartStock,
        addRequisition,
        addVessel,
        updateVessel,
        deleteVessel,
        updateVesselParticulars,
        setVessels,
        addShipDocument,
        updateShipDocument,
        deleteShipDocument,
        certificateCategories,
        addCertificateCategory,
        deleteCertificateCategory,
        documentTemplates,
        addDocumentTemplate,
        deleteDocumentTemplate,
        addCrew,
        updateCrew,
        deleteCrew,
        approveLeave,
        submitLeave,
        addDrill,
        sendWhatsAppReminder,
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
        showToast
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
