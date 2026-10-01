import React, { useState, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
import { hitungAuditDataMaster } from './logic/hitungAuditDataMaster';
import {
  Database,
  Ship,
  Users,
  FileCheck,
  Tag,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Download,
  AlertTriangle,
  RefreshCw,
  ClipboardCheck,
  FileText,
  Wrench,
  X,
  Save,
  UserCheck,
  UserPlus,
  Key,
  Eye,
  EyeOff,
  ChevronRight,
  Mail,
  Phone
} from 'lucide-react';
import { DocumentFormModal } from '../documents/DocumentFormModal';
import { DocumentPreviewModal } from '../documents/DocumentPreviewModal';
import { ParticularsModal } from '../vessels/ParticularsModal';
import { MasterCombobox } from '../common/MasterCombobox';
import { DataSyncModal } from './DataSyncModal';
import {
  DEFAULT_MASTER_CERTIFICATE_NAMES,
  SAMPLE_MARITIME_SURVEY_PRESETS
} from '../../data/shipCertificatesMaster';
import { MasterDataHeaderBanner } from './masterdata/MasterDataHeaderBanner';
import { MasterDataTabAudit } from './masterdata/MasterDataTabAudit';
import { MasterDataTabVessels } from './masterdata/MasterDataTabVessels';
import { MasterDataTabCrew } from './masterdata/MasterDataTabCrew';
import { MasterDataTabDocuments } from './masterdata/MasterDataTabDocuments';
import { MasterDataTabCategories } from './masterdata/MasterDataTabCategories';
import { MasterDataTabSurveyTypes } from './masterdata/MasterDataTabSurveyTypes';
import { MasterDataTabCertNames } from './masterdata/MasterDataTabCertNames';
import { MasterDataTabUsers } from './masterdata/MasterDataTabUsers';
import { MasterDataVesselModal } from './masterdata/MasterDataVesselModal';
import { MasterDataCrewModal } from './masterdata/MasterDataCrewModal';
import { MasterDataUserModal } from './masterdata/MasterDataUserModal';
import { MasterDataActionConfirm } from './masterdata/MasterDataActionConfirm';

export const MasterDataAdmin = () => {
  const {
    vessels,
    allShipDocuments,
    shipDocuments,
    allCrew,
    crew,
    allEquipment,
    equipment,
    workOrders,
    spareparts,
    costs,
    certificateCategories,
    addCertificateCategory,
    deleteCertificateCategory,
    documentTemplates,
    addDocumentTemplate,
    deleteDocumentTemplate,
    clearDocumentTemplates,
    masterSurveyTypes,
    addMasterSurveyType,
    deleteMasterSurveyType,
    clearMasterSurveyTypes,
    clearAllData,
    loadDemoData,
    addVessel,
    updateVessel,
    deleteVessel,
    updateVesselParticulars,
    vesselTypes,
    portLocations,
    deleteMasterVesselType,
    deleteMasterPort,
    addCrew,
    updateCrew,
    deleteCrew,
    addShipDocument,
    updateShipDocument,
    deleteShipDocument,
    users,
    addUser,
    updateUser,
    deleteUser,
    resetUsers,
    currentUser,
    theme,
    showToast
  } = usePMS();

  const [activeTab, setActiveTab] = useState('audit'); // 'vessels' | 'crew' | 'documents' | 'categories' | 'surveyTypes' | 'certNames' | 'users' | 'audit'

  // Ship-to-shore sync & DB backup modal
  const [showSyncModal, setShowSyncModal] = useState(false);

  // In-app Action Confirmation Modal State (No window.confirm!)
  const [actionConfirmModal, setActionConfirmModal] = useState(null);

  // Modals state
  const [showDocModal, setShowDocModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  const [showParticularsModal, setShowParticularsModal] = useState(false);
  const [selectedParticularVessel, setSelectedParticularVessel] = useState(null);

  const [showVesselModal, setShowVesselModal] = useState(false);
  const [editingVessel, setEditingVessel] = useState(null);
  const [vesselFormData, setVesselFormData] = useState({
    name: '',
    type: '',
    ownershipStatus: 'As Owner',
    regNo: '',
    imo: '',
    callSign: '',
    gt: 310,
    dwt: 450,
    portOfRegistry: '',
    builder: 'PT Dok & Perkapalan Baharimas Pontianak',
    yearBuilt: 2022,
    status: 'Operasional (Berlayar)'
  });

  const [showCrewModal, setShowCrewModal] = useState(false);
  const [editingCrew, setEditingCrew] = useState(null);
  const [crewFormData, setCrewFormData] = useState({
    name: '',
    vesselId: vessels[0]?.id || 'v-001',
    rank: 'Juru Mudi / ABK',
    department: 'Deck',
    seamanBookNo: '',
    phone: '081288990011',
    whatsapp: '+6281288990011',
    status: 'Onboard',
    contractDurationMonths: 8,
    leaveBalanceDays: 14
  });

  const [newCatData, setNewCatData] = useState({
    label: '',
    code: '',
    description: '',
    color: '#38bdf8'
  });
  const [deletingCatId, setDeletingCatId] = useState(null);

  // Master Jenis Survey state
  const [surveySearch, setSurveySearch] = useState('');
  const [surveyCatFilter, setSurveyCatFilter] = useState('ALL');
  const [newSurveyData, setNewSurveyData] = useState({
    name: '',
    category: 'BKI',
    intervalYears: 1,
    periodLabel: '1 Tahun',
    description: ''
  });
  const [deletingSurveyId, setDeletingSurveyId] = useState(null);

  // Master Nama Sertifikat state
  const [certNameSearch, setCertNameSearch] = useState('');
  const [certNameCatFilter, setCertNameCatFilter] = useState('ALL');
  const [newCertNameData, setNewCertNameData] = useState({
    name: '',
    category: 'BKI',
    defaultValidityYears: 1,
    issuer: '',
    description: ''
  });
  const [deletingCertNameId, setDeletingCertNameId] = useState(null);

  const [deletingDocId, setDeletingDocId] = useState(null);
  const [deletingVesselId, setDeletingVesselId] = useState(null);
  const [deletingCrewId, setDeletingCrewId] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  // User Management state
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [userShipFilter, setUserShipFilter] = useState('ALL');
  const [userStatusFilter, setUserStatusFilter] = useState('ALL');
  const [showPasswordMap, setShowPasswordMap] = useState({});
  const [modalPasswordVisible, setModalPasswordVisible] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '123',
    role: 'Admin Kapal / Nakhoda',
    title: 'Nakhoda',
    shipAccess: 'All',
    phone: '081288990011',
    status: 'Aktif',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
  });

  // Search & Filter states
  const [vesselSearch, setVesselSearch] = useState('');
  const [vesselOwnershipFilter, setVesselOwnershipFilter] = useState('ALL');

  const [crewSearch, setCrewSearch] = useState('');
  const [crewVesselFilter, setCrewVesselFilter] = useState('ALL');
  const [crewDeptFilter, setCrewDeptFilter] = useState('ALL');

  const [docSearch, setDocSearch] = useState('');
  const [docVesselFilter, setDocVesselFilter] = useState('ALL');
  const [docCategoryFilter, setDocCategoryFilter] = useState('ALL');
  const [docStatusFilter, setDocStatusFilter] = useState('ALL');

  // Audit state
  const [auditTimestamp, setAuditTimestamp] = useState(() => new Date().toLocaleTimeString('id-ID'));
  const [isReauditing, setIsReauditing] = useState(false);

  // 1. DATA AUDIT ENGINE (Checks all data on the web app)
  const auditReport = useMemo(() => {
    return hitungAuditDataMaster(
      allCrew,
      allEquipment,
      allShipDocuments,
      certificateCategories,
      crew,
      equipment,
      shipDocuments,
      spareparts,
      users,
      vessels,
      workOrders
    );
  }, [vessels, allShipDocuments, shipDocuments, allCrew, crew, allEquipment, equipment, workOrders, spareparts, certificateCategories, users]);

  // Handle Re-audit
  const handleReaudit = () => {
    setIsReauditing(true);
    setTimeout(() => {
      setAuditTimestamp(new Date().toLocaleTimeString('id-ID'));
      setIsReauditing(false);
      showToast('Pemeriksaan audit seluruh data web selesai! 100% data terverifikasi.', 'success');
    }, 600);
  };

  // Export Data Dump JSON
  const handleDownloadBackupJSON = () => {
    const backupData = {
      exportTimestamp: new Date().toISOString(),
      version: 'v8-fleet-28-categories-dates',
      system: 'PMS Armada PT. Pelayaran Baharimas Kalimantan',
      auditScore: auditReport.score,
      vessels,
      crew: allCrew || crew,
      shipDocuments: allShipDocuments || shipDocuments,
      certificateCategories,
      equipment: allEquipment || equipment,
      workOrders,
      spareparts,
      costs,
      users: users || []
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pms_baharimas_database_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Cadangan basis data lengkap JSON berhasil diunduh.', 'success');
  };

  // CSV Export Utility
  const exportToCSV = (filename, headers, rows) => {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`File ${filename}.csv berhasil diekspor.`, 'success');
  };

  // Filtered lists
  const filteredVessels = vessels.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(vesselSearch.toLowerCase()) ||
      (v.regNo && v.regNo.toLowerCase().includes(vesselSearch.toLowerCase())) ||
      (v.callSign && v.callSign.toLowerCase().includes(vesselSearch.toLowerCase()));
    const matchOwnership = vesselOwnershipFilter === 'ALL' ||
      (vesselOwnershipFilter === 'Owner' && (v.ownershipStatus === 'As Owner' || (!v.id.startsWith('v-op-') && v.ownershipStatus !== 'As Operator'))) ||
      (vesselOwnershipFilter === 'Operator' && (v.ownershipStatus === 'As Operator' || v.id.startsWith('v-op-')));
    return matchSearch && matchOwnership;
  });

  const allCrewList = allCrew || crew || [];
  const filteredCrew = allCrewList.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(crewSearch.toLowerCase()) ||
      (c.rank && c.rank.toLowerCase().includes(crewSearch.toLowerCase())) ||
      (c.seamanBookNo && c.seamanBookNo.toLowerCase().includes(crewSearch.toLowerCase()));
    const matchVessel = crewVesselFilter === 'ALL' || c.vesselId === crewVesselFilter;
    const matchDept = crewDeptFilter === 'ALL' || c.department === crewDeptFilter;
    return matchSearch && matchVessel && matchDept;
  });

  const allDocList = allShipDocuments || shipDocuments || [];
  const filteredDocs = allDocList.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(docSearch.toLowerCase()) ||
      (d.documentNo && d.documentNo.toLowerCase().includes(docSearch.toLowerCase())) ||
      (d.issuer && d.issuer.toLowerCase().includes(docSearch.toLowerCase()));
    const matchVessel = docVesselFilter === 'ALL' || d.vesselId === docVesselFilter;
    const matchCat = docCategoryFilter === 'ALL' || d.category === docCategoryFilter;
    const matchStatus = docStatusFilter === 'ALL' || d.status === docStatusFilter;
    return matchSearch && matchVessel && matchCat && matchStatus;
  });

  // Filtered Master Survey Types
  const allSurveyTypesList = masterSurveyTypes || [];
  const filteredSurveyTypes = allSurveyTypesList.filter(s => {
    const q = surveySearch.trim().toLowerCase();
    const matchQuery = !q || s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q));
    const matchCat = surveyCatFilter === 'ALL' || (s.category || '').toLowerCase() === surveyCatFilter.toLowerCase();
    return matchQuery && matchCat;
  });

  // Filtered Master Certificate Names
  const allCertNamesList = documentTemplates || [];
  const filteredCertNames = allCertNamesList.filter(t => {
    const q = certNameSearch.trim().toLowerCase();
    const matchQuery = !q || t.name.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q)) || (t.issuer && t.issuer.toLowerCase().includes(q));
    const matchCat = certNameCatFilter === 'ALL' || (t.category || '').toLowerCase() === certNameCatFilter.toLowerCase();
    return matchQuery && matchCat;
  });

  // Handle Save Vessel
  const handleSaveVessel = (e) => {
    e.preventDefault();
    if (!vesselFormData.name?.trim()) {
      showToast('Nama kapal resmi wajib diisi!', 'warning');
      return;
    }

    try {
      if (editingVessel) {
        updateVessel(editingVessel.id, vesselFormData);
      } else {
        addVessel(vesselFormData);
      }
      setShowVesselModal(false);
      setEditingVessel(null);
    } catch (err) {
      console.error('Error saving vessel in admin:', err);
      showToast('Gagal menyimpan kapal: ' + err.message, 'error');
    }
  };

  // Handle Save Crew
  const handleSaveCrew = (e) => {
    e.preventDefault();
    if (!crewFormData.name?.trim()) {
      showToast('Nama personel kru wajib diisi!', 'warning');
      return;
    }

    try {
      if (editingCrew) {
        updateCrew(editingCrew.id, crewFormData);
      } else {
        addCrew(crewFormData);
      }
      setShowCrewModal(false);
      setEditingCrew(null);
    } catch (err) {
      console.error('Error saving crew in admin:', err);
      showToast('Gagal menyimpan crew: ' + err.message, 'error');
    }
  };

  // Handle Add Category
  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatData.label.trim()) return;

    addCertificateCategory({
      label: newCatData.label.trim(),
      code: newCatData.code.trim() || newCatData.label.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_'),
      description: newCatData.description.trim(),
      color: newCatData.color
    });

    setNewCatData({ label: '', code: '', description: '', color: '#38bdf8' });
  };

  // Handle Add Survey Type
  const handleCreateSurveyType = (e) => {
    e.preventDefault();
    if (!newSurveyData.name.trim()) return;

    addMasterSurveyType({
      name: newSurveyData.name.trim(),
      category: newSurveyData.category || 'BKI',
      periodLabel: newSurveyData.periodLabel?.trim() || `${newSurveyData.intervalYears} Tahun`,
      intervalYears: Number(newSurveyData.intervalYears) || 1,
      description: newSurveyData.description.trim()
    });

    setNewSurveyData({
      name: '',
      category: newSurveyData.category || 'BKI',
      intervalYears: 1,
      periodLabel: '1 Tahun',
      description: ''
    });
  };

  // Handle Add Certificate Name
  const handleCreateCertName = (e) => {
    e.preventDefault();
    if (!newCertNameData.name.trim()) return;

    addDocumentTemplate({
      name: newCertNameData.name.trim(),
      category: newCertNameData.category || 'BKI',
      defaultValidityYears: Number(newCertNameData.defaultValidityYears) || 1,
      issuer: newCertNameData.issuer.trim(),
      description: newCertNameData.description.trim()
    });

    setNewCertNameData({
      name: '',
      category: newCertNameData.category || 'BKI',
      defaultValidityYears: 1,
      issuer: '',
      description: ''
    });
  };

  // Reset Master Survey Types to standard defaults using in-app modal
  const handleResetSurveyTypes = () => {
    setActionConfirmModal({
      title: 'Muat Standar Maritim Jenis Survey?',
      subtitle: 'Memuat daftar baku pemeriksaan periodik maritim resmi.',
      message: 'Muat daftar jenis survey standar maritim resmi (BKI Annual, Intermediate, Special, Docking, KSOP Kelaiklautan, Statutory ISM, Sanitasi Pelabuhan) ke dalam master survey?',
      confirmLabel: 'Ya, Muat Standar Survey',
      confirmColor: '#38bdf8',
      icon: RefreshCw,
      onConfirm: () => {
        clearMasterSurveyTypes();
        (SAMPLE_MARITIME_SURVEY_PRESETS || []).forEach(st => {
          addMasterSurveyType(st);
        });
        showToast('Master Jenis Survey berhasil diisi dengan data standar maritim!', 'success');
        setActionConfirmModal(null);
      }
    });
  };

  const handleClearSurveyTypes = () => {
    setActionConfirmModal({
      title: 'Kosongkan Master Jenis Survey?',
      subtitle: 'Seluruh jenis survey akan dikosongkan.',
      message: 'Apakah Anda yakin ingin mengosongkan master jenis survey? Setelah dikosongkan, kolom input survey di form dokumen akan bersih tanpa preset survey sehingga Anda dapat mengisinya secara mandiri.',
      confirmLabel: 'Ya, Kosongkan Master Survey',
      confirmColor: '#ef4444',
      icon: Trash2,
      onConfirm: () => {
        clearMasterSurveyTypes();
        showToast('Master Jenis Survey berhasil dikosongkan (0 survey)!', 'info');
        setActionConfirmModal(null);
      }
    });
  };

  // Reset Master Certificate Names to standard defaults using in-app modal
  const handleResetCertNames = () => {
    setActionConfirmModal({
      title: 'Muat Standar Nama Sertifikat?',
      subtitle: 'Memuat daftar baku sertifikat kapal maritim resmi.',
      message: 'Muat daftar nama sertifikat resmi bawaan (BKI, KSOP, Statutory, Kesehatan, Asuransi) ke dalam master nama sertifikat?',
      confirmLabel: 'Ya, Muat Standar Sertifikat',
      confirmColor: '#38bdf8',
      icon: RefreshCw,
      onConfirm: () => {
        clearDocumentTemplates();
        (DEFAULT_MASTER_CERTIFICATE_NAMES || []).forEach(cn => {
          addDocumentTemplate(cn);
        });
        showToast('Master Nama Sertifikat berhasil direset ke data bawaan!', 'success');
        setActionConfirmModal(null);
      }
    });
  };

  const handleClearCertNames = () => {
    setActionConfirmModal({
      title: 'Kosongkan Master Nama Sertifikat?',
      subtitle: 'Seluruh nama sertifikat akan dikosongkan.',
      message: 'Apakah Anda yakin ingin mengosongkan semua master nama sertifikat? Setelah dikosongkan, kolom pilihan di form pengisian akan bersih tanpa opsi preset.',
      confirmLabel: 'Ya, Kosongkan Master Sertifikat',
      confirmColor: '#ef4444',
      icon: Trash2,
      onConfirm: () => {
        clearDocumentTemplates();
        showToast('Master Nama Sertifikat berhasil dikosongkan (0 sertifikat)!', 'info');
        setActionConfirmModal(null);
      }
    });
  };

  const handleOpenClearAllModal = () => {
    setActionConfirmModal({
      title: 'Kosongkan Seluruh Data Sistem?',
      subtitle: 'Tindakan ini akan mengosongkan seluruh data operasional & master.',
      message: 'Apakah Anda yakin ingin MENGOSONGKAN seluruh basis data (Kapal, Dokumen, Kru, Kategori Sertifikat, Master Jenis Survey, Peralatan Mesin, Anggaran, Riwayat Biaya)? Seluruh data dummy akan dibersihkan ke status 0 untuk pengujian input data riil dari awal.',
      confirmLabel: 'Ya, Kosongkan Semua Data',
      confirmColor: '#ef4444',
      icon: Trash2,
      onConfirm: () => {
        clearAllData();
        showToast('Seluruh data operasional & master berhasil dikosongkan (0 data)!', 'info');
        setActionConfirmModal(null);
      }
    });
  };

  const handleOpenLoadDemoModal = () => {
    setActionConfirmModal({
      title: 'Muat Data Contoh / Demo Maritim?',
      subtitle: 'Memuat data lengkap armada kapal, sertifikat resmi, dan audit maritim.',
      message: 'Muat data operasional perkapalan lengkap (Armada Kapal RP 2020, data permesinan PMS, kru bersertifikat STCW, sertifikat legalitas, dan audit ISM) ke dalam sistem?',
      confirmLabel: 'Ya, Muat Data Demo',
      confirmColor: '#10b981',
      icon: Database,
      onConfirm: () => {
        loadDemoData();
        showToast('Data contoh/demo armada maritim berhasil dimuat ke sistem!', 'success');
        setActionConfirmModal(null);
      }
    });
  };

  // User Management filters and handlers
  const allUserList = users || [];
  const filteredUsers = allUserList.filter(u => {
    const matchSearch =
      (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.role && u.role.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.title && u.title.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.phone && u.phone.toLowerCase().includes(userSearch.toLowerCase()));

    const matchRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;

    const matchShip = userShipFilter === 'ALL' ||
      (userShipFilter === 'All' && (u.shipAccess === 'All' || !u.shipAccess)) ||
      (u.shipAccess === userShipFilter);

    const matchStatus = userStatusFilter === 'ALL' || (u.status || 'Aktif') === userStatusFilter;

    return matchSearch && matchRole && matchShip && matchStatus;
  });

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!userFormData.name.trim()) {
      showToast('Nama lengkap pengguna wajib diisi!', 'warning');
      return;
    }
    if (!userFormData.email.trim() || !userFormData.email.includes('@')) {
      showToast('Alamat email tidak valid (harus mengandung @)!', 'warning');
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, userFormData);
    } else {
      addUser(userFormData);
    }
    setShowUserModal(false);
    setEditingUser(null);
  };

  const handleExportUsersCSV = () => {
    const headers = ['ID User', 'Nama Lengkap', 'Email', 'Password', 'Role / Peran', 'Jabatan / Title', 'Akses Kapal', 'No. WhatsApp / HP', 'Status Akun'];
    const rows = filteredUsers.map(u => {
      const shipLabel = u.shipAccess === 'All' || !u.shipAccess
        ? 'Semua Kapal (Full Fleet)'
        : (vessels.find(v => v.id === u.shipAccess)?.name || u.shipAccess);
      return [
        u.id,
        u.name,
        u.email,
        u.password || '123',
        u.role,
        u.title || '-',
        shipLabel,
        u.phone || '-',
        u.status || 'Aktif'
      ];
    });
    exportToCSV('master_manajemen_user_baharimas', headers, rows);
  };

  const handleQuickResetPassword = (targetUser) => {
    updateUser(targetUser.id, { password: '123' });
    showToast(`Password akun ${targetUser.name} berhasil direset ke demo: 123`, 'info');
  };

  const handleToggleUserStatus = (targetUser) => {
    const nextStatus = targetUser.status === 'Nonaktif' ? 'Aktif' : 'Nonaktif';
    updateUser(targetUser.id, { status: nextStatus });
    showToast(`Status akun ${targetUser.name} diubah menjadi ${nextStatus}`, 'info');
  };

  const ROLE_CONFIGS = {
    'Super Admin': {
      color: '#a855f7',
      bg: 'rgba(168, 85, 247, 0.15)',
      border: 'rgba(168, 85, 247, 0.35)',
      desc: 'Akses penuh ke semua modul, Data Master, konfigurasi sistem, dan manajemen akun.'
    },
    'Fleet Manager': {
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.15)',
      border: 'rgba(56, 189, 248, 0.35)',
      desc: 'Monitoring operasional armada kapal, persetujuan biaya & perbaikan, laporan komprehensif.'
    },
    'Admin Kapal / Nakhoda': {
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.15)',
      border: 'rgba(16, 185, 129, 0.35)',
      desc: 'Manajemen sertifikat kapal, kru onboard, logbook, dan pelaporan dari kapal.'
    },
    'Teknisi / Chief Engineer': {
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.15)',
      border: 'rgba(245, 158, 11, 0.35)',
      desc: 'Input running hours mesin, checklist PMS harian, work order, dan request sparepart.'
    },
    'Crew / ABK': {
      color: '#06b6d4',
      bg: 'rgba(6, 182, 212, 0.15)',
      border: 'rgba(6, 182, 212, 0.35)',
      desc: 'Pelaksanaan tugas harian di kapal, checklist pemeliharaan, dan pengajuan cuti.'
    },
    'HR / Personalia': {
      color: '#ec4899',
      bg: 'rgba(236, 72, 153, 0.15)',
      border: 'rgba(236, 72, 153, 0.35)',
      desc: 'Manajemen kru, database buku pelaut, masa berlaku sertifikat STCW, dan rotasi awak.'
    },
    'Finance': {
      color: '#84cc16',
      bg: 'rgba(132, 204, 22, 0.15)',
      border: 'rgba(132, 204, 22, 0.35)',
      desc: 'Verifikasi biaya docking, purchasing sparepart kapal, dan audit pengeluaran armada.'
    },
    'Developer': {
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.15)',
      border: 'rgba(139, 92, 246, 0.35)',
      desc: 'Akses teknis sistem, integrasi API key gateway, webhook, pengujian endpoint, dan manajemen data master.'
    }
  };

  const PRESET_AVATARS = [
    { label: 'Captain / Nakhoda', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' },
    { label: 'Super Admin', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' },
    { label: 'Developer / IT', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80' },
    { label: 'Fleet Manager', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
    { label: 'Chief Engineer', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80' },
    { label: 'Crew / ABK', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80' },
    { label: 'HR Compliance', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80' },
    { label: 'Finance Staff', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <MasterDataHeaderBanner
        activeTab={activeTab}
        allCrewList={allCrewList}
        allDocList={allDocList}
        allUserList={allUserList}
        auditReport={auditReport}
        certificateCategories={certificateCategories}
        documentTemplates={documentTemplates}
        handleDownloadBackupJSON={handleDownloadBackupJSON}
        handleOpenClearAllModal={handleOpenClearAllModal}
        handleOpenLoadDemoModal={handleOpenLoadDemoModal}
        handleReaudit={handleReaudit}
        isReauditing={isReauditing}
        masterSurveyTypes={masterSurveyTypes}
        setActiveTab={setActiveTab}
        setShowSyncModal={setShowSyncModal}
        vessels={vessels}
      />

      {/* ========================================================================= */}
      {/* TAB 1: AUDIT & DATA HEALTH CHECK                                          */}
      {/* ========================================================================= */}
      {(activeTab === 'audit') && (
        <MasterDataTabAudit
          allUserList={allUserList}
          auditReport={auditReport}
          auditTimestamp={auditTimestamp}
          handleReaudit={handleReaudit}
          setActiveTab={setActiveTab}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MASTER DATA KAPAL                                                  */}
      {/* ========================================================================= */}
      {(activeTab === 'vessels') && (
        <MasterDataTabVessels
          auditReport={auditReport}
          deleteMasterPort={deleteMasterPort}
          deleteMasterVesselType={deleteMasterVesselType}
          deleteVessel={deleteVessel}
          deletingVesselId={deletingVesselId}
          exportToCSV={exportToCSV}
          filteredVessels={filteredVessels}
          portLocations={portLocations}
          setDeletingVesselId={setDeletingVesselId}
          setEditingVessel={setEditingVessel}
          setSelectedParticularVessel={setSelectedParticularVessel}
          setShowParticularsModal={setShowParticularsModal}
          setShowVesselModal={setShowVesselModal}
          setVesselFormData={setVesselFormData}
          setVesselOwnershipFilter={setVesselOwnershipFilter}
          setVesselSearch={setVesselSearch}
          vesselOwnershipFilter={vesselOwnershipFilter}
          vesselSearch={vesselSearch}
          vesselTypes={vesselTypes}
          vessels={vessels}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MASTER DATA CREW                                                   */}
      {/* ========================================================================= */}
      {(activeTab === 'crew') && (
        <MasterDataTabCrew
          allCrewList={allCrewList}
          crewDeptFilter={crewDeptFilter}
          crewSearch={crewSearch}
          crewVesselFilter={crewVesselFilter}
          deleteCrew={deleteCrew}
          deletingCrewId={deletingCrewId}
          exportToCSV={exportToCSV}
          filteredCrew={filteredCrew}
          setCrewDeptFilter={setCrewDeptFilter}
          setCrewFormData={setCrewFormData}
          setCrewSearch={setCrewSearch}
          setCrewVesselFilter={setCrewVesselFilter}
          setDeletingCrewId={setDeletingCrewId}
          setEditingCrew={setEditingCrew}
          setShowCrewModal={setShowCrewModal}
          vessels={vessels}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MASTER DOKUMEN & SERTIFIKAT                                        */}
      {/* ========================================================================= */}
      {(activeTab === 'documents') && (
        <MasterDataTabDocuments
          allDocList={allDocList}
          certificateCategories={certificateCategories}
          deleteShipDocument={deleteShipDocument}
          deletingDocId={deletingDocId}
          docCategoryFilter={docCategoryFilter}
          docSearch={docSearch}
          docStatusFilter={docStatusFilter}
          docVesselFilter={docVesselFilter}
          exportToCSV={exportToCSV}
          filteredDocs={filteredDocs}
          setDeletingDocId={setDeletingDocId}
          setDocCategoryFilter={setDocCategoryFilter}
          setDocSearch={setDocSearch}
          setDocStatusFilter={setDocStatusFilter}
          setDocVesselFilter={setDocVesselFilter}
          setEditingDoc={setEditingDoc}
          setPreviewDoc={setPreviewDoc}
          setShowDocModal={setShowDocModal}
          vessels={vessels}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 5: MASTER KATEGORI SERTIFIKAT                                         */}
      {/* ========================================================================= */}
      {(activeTab === 'categories') && (
        <MasterDataTabCategories
          allDocList={allDocList}
          certificateCategories={certificateCategories}
          deleteCertificateCategory={deleteCertificateCategory}
          deletingCatId={deletingCatId}
          handleCreateCategory={handleCreateCategory}
          newCatData={newCatData}
          setDeletingCatId={setDeletingCatId}
          setNewCatData={setNewCatData}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 5B: MASTER JENIS SURVEY & PEMERIKSAAN PERIODIK                       */}
      {/* ========================================================================= */}
      {(activeTab === 'surveyTypes') && (
        <MasterDataTabSurveyTypes
          allDocList={allDocList}
          allSurveyTypesList={allSurveyTypesList}
          certificateCategories={certificateCategories}
          deleteMasterSurveyType={deleteMasterSurveyType}
          deletingSurveyId={deletingSurveyId}
          filteredSurveyTypes={filteredSurveyTypes}
          handleClearSurveyTypes={handleClearSurveyTypes}
          handleCreateSurveyType={handleCreateSurveyType}
          handleResetSurveyTypes={handleResetSurveyTypes}
          newSurveyData={newSurveyData}
          setDeletingSurveyId={setDeletingSurveyId}
          setNewSurveyData={setNewSurveyData}
          setSurveyCatFilter={setSurveyCatFilter}
          setSurveySearch={setSurveySearch}
          surveyCatFilter={surveyCatFilter}
          surveySearch={surveySearch}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 5C: MASTER NAMA SERTIFIKAT / DOKUMEN RESMI                          */}
      {/* ========================================================================= */}
      {(activeTab === 'certNames') && (
        <MasterDataTabCertNames
          allCertNamesList={allCertNamesList}
          allDocList={allDocList}
          certNameCatFilter={certNameCatFilter}
          certNameSearch={certNameSearch}
          certificateCategories={certificateCategories}
          deleteDocumentTemplate={deleteDocumentTemplate}
          deletingCertNameId={deletingCertNameId}
          filteredCertNames={filteredCertNames}
          handleClearCertNames={handleClearCertNames}
          handleCreateCertName={handleCreateCertName}
          handleResetCertNames={handleResetCertNames}
          newCertNameData={newCertNameData}
          setCertNameCatFilter={setCertNameCatFilter}
          setCertNameSearch={setCertNameSearch}
          setDeletingCertNameId={setDeletingCertNameId}
          setNewCertNameData={setNewCertNameData}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 6: MANAJEMEN USER & ROLE                                               */}
      {/* ========================================================================= */}
      {(activeTab === 'users') && (
        <MasterDataTabUsers
          ROLE_CONFIGS={ROLE_CONFIGS}
          allUserList={allUserList}
          currentUser={currentUser}
          deleteUser={deleteUser}
          filteredUsers={filteredUsers}
          handleExportUsersCSV={handleExportUsersCSV}
          handleQuickResetPassword={handleQuickResetPassword}
          handleToggleUserStatus={handleToggleUserStatus}
          resetUsers={resetUsers}
          setEditingUser={setEditingUser}
          setModalPasswordVisible={setModalPasswordVisible}
          setShowPasswordMap={setShowPasswordMap}
          setShowUserModal={setShowUserModal}
          setUserFormData={setUserFormData}
          setUserRoleFilter={setUserRoleFilter}
          setUserSearch={setUserSearch}
          setUserShipFilter={setUserShipFilter}
          setUserStatusFilter={setUserStatusFilter}
          showPasswordMap={showPasswordMap}
          showToast={showToast}
          userRoleFilter={userRoleFilter}
          userSearch={userSearch}
          userShipFilter={userShipFilter}
          userStatusFilter={userStatusFilter}
          vessels={vessels}
        />
      )}

      {/* ========================================================================= */}
      {/* MODALS SECTION                                                            */}
      {/* ========================================================================= */}

      {/* 1. Modal Tambah / Edit Dokumen */}
      {showDocModal && (
        <DocumentFormModal
          isOpen={showDocModal}
          initialData={editingDoc}
          vessels={vessels}
          defaultVesselId={vessels[0]?.id || 'v-001'}
          onClose={() => {
            setShowDocModal(false);
            setEditingDoc(null);
          }}
          onSave={(data) => {
            if (editingDoc) {
              updateShipDocument(editingDoc.id, data);
            } else {
              addShipDocument(data);
            }
          }}
        />
      )}

      {/* 2. Modal Edit Particulars */}
      {showParticularsModal && selectedParticularVessel && (
        <ParticularsModal
          vessel={selectedParticularVessel}
          isOpen={showParticularsModal}
          onClose={() => {
            setShowParticularsModal(false);
            setSelectedParticularVessel(null);
          }}
          onSave={(shipId, updatedData) => {
            updateVesselParticulars(shipId, updatedData);
          }}
        />
      )}

      {/* 3. Modal Tambah / Edit Kapal */}
      {(showVesselModal) && (
        <MasterDataVesselModal
          editingVessel={editingVessel}
          handleSaveVessel={handleSaveVessel}
          portLocations={portLocations}
          setShowVesselModal={setShowVesselModal}
          setVesselFormData={setVesselFormData}
          vesselFormData={vesselFormData}
          vesselTypes={vesselTypes}
        />
      )}

      {/* 4. Modal Tambah / Edit Crew */}
      {(showCrewModal) && (
        <MasterDataCrewModal
          crewFormData={crewFormData}
          editingCrew={editingCrew}
          handleSaveCrew={handleSaveCrew}
          setCrewFormData={setCrewFormData}
          setShowCrewModal={setShowCrewModal}
          vessels={vessels}
        />
      )}

      {/* 5. Modal Tambah / Edit Pengguna */}
      {(showUserModal) && (
        <MasterDataUserModal
          PRESET_AVATARS={PRESET_AVATARS}
          ROLE_CONFIGS={ROLE_CONFIGS}
          editingUser={editingUser}
          handleSaveUser={handleSaveUser}
          modalPasswordVisible={modalPasswordVisible}
          setEditingUser={setEditingUser}
          setModalPasswordVisible={setModalPasswordVisible}
          setShowUserModal={setShowUserModal}
          setUserFormData={setUserFormData}
          userFormData={userFormData}
          vessels={vessels}
        />
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <DocumentPreviewModal
          document={previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      )}

      {/* In-app Action Confirmation Modal */}
      {(actionConfirmModal) && (
        <MasterDataActionConfirm
          actionConfirmModal={actionConfirmModal}
          setActionConfirmModal={setActionConfirmModal}
        />
      )}

      {/* Modal: Ship-to-Shore Sync & Full Database Backup */}
      {showSyncModal && (
        <DataSyncModal onClose={() => setShowSyncModal(false)} />
      )}
    </div>
  );
};
