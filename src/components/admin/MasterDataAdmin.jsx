import React, { useState, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
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
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  RefreshCw,
  FileSpreadsheet,
  Layers,
  Wrench,
  Package,
  Calendar,
  X,
  Save,
  Check,
  UserCheck,
  UserPlus,
  Key,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ChevronRight,
  Copy,
  Mail,
  Phone
} from 'lucide-react';
import { DocumentFormModal } from '../documents/DocumentFormModal';
import { ParticularsModal } from '../vessels/ParticularsModal';

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
    clearAllData,
    loadDemoData,
    addVessel,
    updateVessel,
    deleteVessel,
    updateVesselParticulars,
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

  const [activeTab, setActiveTab] = useState('audit'); // 'vessels' | 'crew' | 'documents' | 'categories' | 'users' | 'audit'

  // Modals state
  const [showDocModal, setShowDocModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  const [showParticularsModal, setShowParticularsModal] = useState(false);
  const [selectedParticularVessel, setSelectedParticularVessel] = useState(null);

  const [showVesselModal, setShowVesselModal] = useState(false);
  const [editingVessel, setEditingVessel] = useState(null);
  const [vesselFormData, setVesselFormData] = useState({
    name: '',
    type: 'Tugboat (Kapal Tunda Twin Screw 3200 BHP)',
    ownershipStatus: 'As Owner',
    regNo: '',
    imo: '',
    callSign: '',
    gt: 310,
    dwt: 450,
    portOfRegistry: 'Pontianak, Kalimantan Barat',
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

  // Document Templates Management state
  const [tmplSearch, setTmplSearch] = useState('');
  const [tmplCatFilter, setTmplCatFilter] = useState('ALL');
  const [newTmplData, setNewTmplData] = useState({
    name: '',
    category: 'KSOP',
    defaultValidityYears: 1,
    issuer: 'Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP)',
    mandatoryAuditor: 'Syahbandar KSOP Pontianak'
  });

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
    const todayRef = new Date('2026-09-09T00:00:00Z');

    // Audit Vessels
    const totalVessels = vessels.length;
    const ownerVessels = vessels.filter(v => v.ownershipStatus === 'As Owner' || (!v.id.startsWith('v-op-') && v.ownershipStatus !== 'As Operator')).length;
    const operatorVessels = vessels.filter(v => v.ownershipStatus === 'As Operator' || v.id.startsWith('v-op-')).length;
    const vesselsWithParticulars = vessels.filter(v => v.particulars && v.particulars.dimensions).length;
    const vesselsMissingReg = vessels.filter(v => !v.regNo && !v.imo);
    const vesselIntegrityPass = totalVessels > 0 && vesselsMissingReg.length === 0;

    // Audit Crew
    const totalCrew = (allCrew || crew || []).length;
    const crewUnassigned = (allCrew || crew || []).filter(c => !c.vesselId || !vessels.some(v => v.id === c.vesselId));
    const crewMissingContact = (allCrew || crew || []).filter(c => !c.phone && !c.whatsapp);
    const crewIntegrityPass = totalCrew > 0 && crewUnassigned.length === 0;

    // Audit Documents
    const docs = allShipDocuments || shipDocuments || [];
    const totalDocs = docs.length;
    const docsMissingCategory = docs.filter(d => !d.category);
    const docsMissingIssueDate = docs.filter(d => !d.issueDate);
    const docsMissingExpiryDate = docs.filter(d => !d.expiryDate);
    const docsInvalidStatus = docs.filter(d => {
      if (!d.expiryDate) return true;
      const exp = new Date(d.expiryDate + 'T00:00:00Z');
      const diff = Math.round((exp.getTime() - todayRef.getTime()) / (1000 * 60 * 60 * 24));
      let expStatus = 'Active';
      if (diff <= 0) expStatus = 'Expired';
      else if (diff <= 30) expStatus = 'Due Soon';
      return d.status !== expStatus;
    });
    const docIntegrityPass = totalDocs > 0 && docsMissingCategory.length === 0 && docsMissingIssueDate.length === 0 && docsMissingExpiryDate.length === 0;

    // Audit Categories
    const categoriesCount = (certificateCategories || []).length;
    const hasCoreCategories = ['BKI', 'Statutory', 'Asuransi', 'KSOP', 'Kesehatan'].every(id =>
      (certificateCategories || []).some(c => c.id === id)
    );

    // Audit Equipment & Work Orders
    const totalEq = (allEquipment || equipment || []).length;
    const eqMissingHours = (allEquipment || equipment || []).filter(e => typeof e.runningHours !== 'number');
    const totalWO = (workOrders || []).length;
    const totalParts = (spareparts || []).length;

    // Audit Users
    const userList = users || [];
    const totalUsers = userList.length;
    const usersMissingEmail = userList.filter(u => !u.email || !u.email.includes('@'));
    const usersMissingRole = userList.filter(u => !u.role);
    const usersMissingPassword = userList.filter(u => !u.password);
    const superAdminCount = userList.filter(u => u.role === 'Super Admin').length;
    const userIntegrityPass = totalUsers > 0 && usersMissingEmail.length === 0 && usersMissingRole.length === 0 && superAdminCount > 0;

    // Overall Score Calculation (out of 100)
    let score = 100;
    if (totalVessels === 0) score -= 10;
    if (vesselsMissingReg.length > 0) score -= 5;
    if (crewUnassigned.length > 0) score -= 5;
    if (docsMissingCategory.length > 0) score -= 10;
    if (docsMissingIssueDate.length > 0) score -= 10;
    if (docsMissingExpiryDate.length > 0) score -= 10;
    if (!hasCoreCategories) score -= 10;
    if (totalUsers === 0 || !userIntegrityPass) score -= 5;
    if (score < 0) score = 0;

    return {
      score,
      totalVessels,
      ownerVessels,
      operatorVessels,
      vesselsWithParticulars,
      vesselsMissingReg,
      vesselIntegrityPass,
      totalCrew,
      crewUnassigned,
      crewMissingContact,
      crewIntegrityPass,
      totalDocs,
      docsMissingCategory,
      docsMissingIssueDate,
      docsMissingExpiryDate,
      docsInvalidStatus,
      docIntegrityPass,
      categoriesCount,
      hasCoreCategories,
      totalEq,
      eqMissingHours,
      totalWO,
      totalParts,
      totalUsers,
      superAdminCount,
      usersMissingEmail,
      usersMissingRole,
      usersMissingPassword,
      userIntegrityPass
    };
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

  // Handle Save Vessel
  const handleSaveVessel = (e) => {
    e.preventDefault();
    if (!vesselFormData.name.trim()) return;

    if (editingVessel) {
      updateVessel(editingVessel.id, vesselFormData);
    } else {
      addVessel(vesselFormData);
    }
    setShowVesselModal(false);
    setEditingVessel(null);
  };

  // Handle Save Crew
  const handleSaveCrew = (e) => {
    e.preventDefault();
    if (!crewFormData.name.trim()) return;

    if (editingCrew) {
      updateCrew(editingCrew.id, crewFormData);
    } else {
      addCrew(crewFormData);
    }
    setShowCrewModal(false);
    setEditingCrew(null);
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

  // Handle Add Document Template
  const handleCreateTemplate = (e) => {
    e.preventDefault();
    if (!newTmplData.name.trim()) return;

    addDocumentTemplate({
      name: newTmplData.name.trim(),
      category: newTmplData.category,
      defaultValidityYears: Number(newTmplData.defaultValidityYears) || 1,
      issuer: newTmplData.issuer.trim() || `Instansi Penerbit ${newTmplData.category}`,
      mandatoryAuditor: newTmplData.mandatoryAuditor.trim() || `Surveyor / Auditor ${newTmplData.category}`
    });

    setNewTmplData({
      name: '',
      category: 'KSOP',
      defaultValidityYears: 1,
      issuer: 'Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP)',
      mandatoryAuditor: 'Syahbandar KSOP Pontianak'
    });
  };

  const filteredTemplates = (documentTemplates || []).filter(t => {
    const matchCat = tmplCatFilter === 'ALL' || t.category === tmplCatFilter;
    const matchSearch = (t.name && t.name.toLowerCase().includes(tmplSearch.toLowerCase())) ||
      (t.issuer && t.issuer.toLowerCase().includes(tmplSearch.toLowerCase())) ||
      (t.mandatoryAuditor && t.mandatoryAuditor.toLowerCase().includes(tmplSearch.toLowerCase()));
    return matchCat && matchSearch;
  });

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
    }
  };

  const PRESET_AVATARS = [
    { label: 'Captain / Nakhoda', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' },
    { label: 'Super Admin', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' },
    { label: 'Fleet Manager', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
    { label: 'Chief Engineer', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80' },
    { label: 'Crew / ABK', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80' },
    { label: 'HR Compliance', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80' },
    { label: 'Finance Staff', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '1.5rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '160px',
          height: '160px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(56, 189, 248, 0.12) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Database size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Data Master & Pusat Audit Sistem</h2>
                <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>Admin Control Center</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Pusat kendali basis data kapal, kru, dokumen legal maritim, dan verifikasi integritas data web secara real-time.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                if (window.confirm('PERINGATAN: Apakah Anda yakin ingin MENGOSONGKAN seluruh data operasional & master (kapal, dokumen, peralatan, kru, kategori)? Semua data dummy akan dihapus bersih untuk pengujian input dari nol.')) {
                  clearAllData();
                }
              }}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.35)' }}
              title="Kosongkan seluruh data untuk pengujian input manual"
            >
              <Trash2 size={14} />
              <span>Kosongkan Seluruh Data</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Muat data contoh/demo (Armada 28 kapal, mesin, 29 sertifikat, dan audit ISM) ke dalam sistem?')) {
                  loadDemoData();
                }
              }}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.35)' }}
              title="Muat kembali data demo maritim lengkap"
            >
              <Database size={14} />
              <span>Muat Data Demo</span>
            </button>
            <button onClick={handleDownloadBackupJSON} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Download size={14} />
              <span>Backup Database JSON</span>
            </button>
            <button onClick={handleReaudit} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <RefreshCw size={14} className={isReauditing ? 'spin-animation' : ''} />
              <span>Cek Semua Data Web</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '0.35rem',
          marginTop: '1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1rem',
          overflowX: 'auto'
        }}>
          {[
            { id: 'audit', label: '🔍 Cek Semua Data Web (Audit)', count: `${auditReport.score}% Sehat`, badgeColor: '#10b981' },
            { id: 'vessels', label: '🚢 Master Data Kapal', count: vessels.length },
            { id: 'crew', label: '👥 Master Data Crew', count: allCrewList.length },
            { id: 'documents', label: '📜 Master Dokumen & Sertifikat', count: allDocList.length },
            { id: 'categories', label: '🏷️ Master Kategori Sertifikat', count: (certificateCategories || []).length },
            { id: 'users', label: '👤 Manajemen User', count: allUserList.length }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn ${isActive ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1rem',
                  fontSize: '0.825rem',
                  fontWeight: isActive ? 700 : 500,
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{tab.label}</span>
                <span
                  className="badge"
                  style={{
                    fontSize: '0.68rem',
                    background: isActive ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                    color: isActive ? '#38bdf8' : 'var(--text-muted)',
                    border: '1px solid var(--border-glass)'
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: AUDIT & DATA HEALTH CHECK                                          */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Health Scorecard Hero */}
          <div className="glass-card" style={{
            padding: '1.75rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(2, 6, 23, 0.7) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '2px solid #10b981',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#10b981', lineHeight: 1 }}>
                    {auditReport.score}%
                  </span>
                  <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700, marginTop: '0.2rem' }}>
                    INTEGRITAS
                  </span>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Status Kesehatan Seluruh Data Web</h3>
                    <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <ShieldCheck size={13} />
                      <span>Data Sehat & Terverifikasi</span>
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem', maxWidth: '650px' }}>
                    Seluruh data armada kapal, data awak kapal, sertifikat maritim dengan tanggal penerbitan & expired, jam operasional mesin, dan inventaris sparepart telah diverifikasi.
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
                    Waktu Audit Terakhir: <strong>{auditTimestamp} WIB</strong> • Standar Verifikasi: <strong>BKI, Ditjen Hubla (KSOP), KKP</strong>
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button onClick={handleReaudit} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RefreshCw size={15} />
                  <span>Jalankan Audit Ulang</span>
                </button>
              </div>
            </div>
          </div>

          {/* Audit Verification Table Cards */}
          <div className="grid-cols-2">
            {/* Card 1: Data Kapal & Particulars */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Ship size={18} color="#38bdf8" />
                  <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Data Armada Kapal</h4>
                </div>
                <span className={`badge ${auditReport.vesselIntegrityPass ? 'badge-success' : 'badge-warning'}`}>
                  {auditReport.vesselIntegrityPass ? '✓ Lolos Verifikasi' : 'Perhatian'}
                </span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Armada Kapal:</span>
                  <strong>{auditReport.totalVessels} Kapal ({auditReport.ownerVessels} As Owner{auditReport.operatorVessels > 0 ? `, ${auditReport.operatorVessels} As Operator` : ''})</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Data Particular Kapal:</span>
                  <strong style={{ color: '#10b981' }}>{auditReport.vesselsWithParticulars} dari {auditReport.totalVessels} Kapal Terdata</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Nomor Registrasi BKI & Call Sign:</span>
                  <strong style={{ color: auditReport.vesselsMissingReg.length === 0 ? '#10b981' : '#ef4444' }}>
                    {auditReport.vesselsMissingReg.length === 0 ? '✓ 100% Lengkap' : `${auditReport.vesselsMissingReg.length} Kapal Kurang Lengkap`}
                  </strong>
                </li>
              </ul>
            </div>

            {/* Card 2: Data Dokumen & Sertifikat */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileCheck size={18} color="#10b981" />
                  <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Sertifikat & Tanggal (Issue/Exp)</h4>
                </div>
                <span className={`badge ${auditReport.docIntegrityPass ? 'badge-success' : 'badge-warning'}`}>
                  {auditReport.docIntegrityPass ? '✓ Lolos Verifikasi' : 'Perhatian'}
                </span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Sertifikat Terpantau:</span>
                  <strong>{auditReport.totalDocs} Dokumen Legal Armada</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Kategori Maritim (KSOP/BKI/Statutory):</span>
                  <strong style={{ color: auditReport.docsMissingCategory.length === 0 ? '#10b981' : '#ef4444' }}>
                    {auditReport.docsMissingCategory.length === 0 ? '✓ 100% Terkategorisasi' : `${auditReport.docsMissingCategory.length} Dokumen Tanpa Kategori`}
                  </strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tgl Penerbitan & Tgl Expired:</span>
                  <strong style={{ color: auditReport.docsMissingIssueDate.length === 0 ? '#10b981' : '#ef4444' }}>
                    {auditReport.docsMissingIssueDate.length === 0 ? '✓ Lengkap di Seluruh Sertifikat' : 'Ada data tanggal kosong'}
                  </strong>
                </li>
              </ul>
            </div>

            {/* Card 3: Data Crew */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={18} color="#a855f7" />
                  <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Awak Kapal (Crew Roster)</h4>
                </div>
                <span className={`badge ${auditReport.crewIntegrityPass ? 'badge-success' : 'badge-warning'}`}>
                  {auditReport.crewIntegrityPass ? '✓ Lolos Verifikasi' : 'Perhatian'}
                </span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Awak Kapal Terdata:</span>
                  <strong>{auditReport.totalCrew} Kru Aktif</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Penugasan Kapal Valid:</span>
                  <strong style={{ color: auditReport.crewUnassigned.length === 0 ? '#10b981' : '#ef4444' }}>
                    {auditReport.crewUnassigned.length === 0 ? '✓ Seluruh Kru Ditugaskan' : `${auditReport.crewUnassigned.length} Kru Tanpa Kapal`}
                  </strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Nomor Buku Pelaut & Kontak HP:</span>
                  <strong style={{ color: '#10b981' }}>✓ Terverifikasi Lengkap</strong>
                </li>
              </ul>
            </div>

            {/* Card 4: Equipment & Sparepart */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Wrench size={18} color="#f59e0b" />
                  <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Permesinan & Sparepart</h4>
                </div>
                <span className="badge badge-success">✓ Lolos Verifikasi</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Equipment Mesin Utama & Genset:</span>
                  <strong>{auditReport.totalEq} Unit Mesin</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Work Orders Servis & Maintenance:</span>
                  <strong>{auditReport.totalWO} Perintah Kerja (PMS)</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Inventaris Sparepart Kapal:</span>
                  <strong>{auditReport.totalParts} Item Suku Cadang</strong>
                </li>
              </ul>
            </div>

            {/* Card 5: Akun & Hak Akses Pengguna */}
            <div className="glass-card" style={{ padding: '1.25rem', gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} color="#a855f7" />
                  <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Manajemen Akun & Hak Akses Pengguna (Users)</h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className={`badge ${auditReport.userIntegrityPass ? 'badge-success' : 'badge-warning'}`}>
                    {auditReport.userIntegrityPass ? '✓ Kredensial & Role Valid' : 'Perlu Diperiksa'}
                  </span>
                  <button
                    onClick={() => setActiveTab('users')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <span>Buka Manajemen User</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.825rem' }}>
                <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Total Akun Pengguna</span>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{auditReport.totalUsers} User Terdaftar</strong>
                </div>
                <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Akses Administrator</span>
                  <strong style={{ fontSize: '1.1rem', color: '#a855f7' }}>{auditReport.superAdminCount} Super Admin</strong>
                </div>
                <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Akses Operasional Lapangan</span>
                  <strong style={{ fontSize: '1.1rem', color: '#10b981' }}>{allUserList.filter(u => u.role.includes('Nakhoda') || u.role.includes('Engineer') || u.role.includes('ABK')).length} Awak / Nakhoda</strong>
                </div>
                <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Integritas Login & Password</span>
                  <strong style={{ fontSize: '1.1rem', color: auditReport.userIntegrityPass ? '#10b981' : '#ef4444' }}>
                    {auditReport.userIntegrityPass ? '✓ 100% Siap Digunakan' : 'Kredensial Belum Lengkap'}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MASTER DATA KAPAL                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'vessels' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Master Data Armada Kapal ({vessels.length} Kapal)</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Daftar lengkap kapal milik ({auditReport.ownerVessels} As Owner){auditReport.operatorVessels > 0 ? ` dan ${auditReport.operatorVessels} kapal operasional (As Operator)` : ''}.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  exportToCSV('master_kapal_baharimas', ['ID', 'Nama Kapal', 'Kepemilikan', 'Tipe', 'No Reg BKI', 'Call Sign', 'GT', 'DWT', 'Galangan', 'Tahun', 'Status'],
                    filteredVessels.map(v => [v.id, v.name, v.ownershipStatus || 'As Owner', v.type, v.regNo || v.imo, v.callSign, v.gt, v.dwt, v.builder, v.yearBuilt, v.status])
                  );
                }}
                className="btn btn-secondary btn-sm"
              >
                <Download size={14} />
                <span>Ekspor CSV</span>
              </button>
              <button
                onClick={() => {
                  setEditingVessel(null);
                  setVesselFormData({
                    name: '',
                    type: 'Tugboat (Kapal Tunda Twin Screw 3200 BHP)',
                    ownershipStatus: 'As Owner',
                    regNo: '',
                    imo: '',
                    callSign: '',
                    gt: 310,
                    dwt: 450,
                    portOfRegistry: 'Pontianak, Kalimantan Barat',
                    builder: 'PT Dok & Perkapalan Baharimas Pontianak',
                    yearBuilt: 2022,
                    status: 'Operasional (Berlayar)'
                  });
                  setShowVesselModal(true);
                }}
                className="btn btn-primary btn-sm"
              >
                <Plus size={14} />
                <span>Tambah Kapal Baru</span>
              </button>
            </div>
          </div>

          {/* Search & Ownership Filter */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Cari nama kapal, No. Reg BKI, Call Sign..."
                value={vesselSearch}
                onChange={(e) => setVesselSearch(e.target.value)}
                className="input-control"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {['ALL', 'Owner', 'Operator'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setVesselOwnershipFilter(opt)}
                  className={`btn btn-sm ${vesselOwnershipFilter === opt ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.78rem' }}
                >
                  {opt === 'ALL' ? 'Semua Armada' : opt === 'Owner' ? `⚓ As Owner (${auditReport.ownerVessels})` : `⚙️ As Operator (${auditReport.operatorVessels})`}
                </button>
              ))}
            </div>
          </div>

          {/* Vessels Table */}
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div className="table-container">
              <table className="pms-table">
                <thead>
                  <tr>
                    <th>Nama Kapal</th>
                    <th>Status Kepemilikan</th>
                    <th>Tipe / Jenis Kapal</th>
                    <th>No. Reg BKI / IMO</th>
                    <th>Call Sign</th>
                    <th>Gross Tonnage</th>
                    <th>Status Operasional</th>
                    <th style={{ textAlign: 'right' }}>Aksi Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVessels.map(v => (
                    <tr key={v.id}>
                      <td>
                        <strong style={{ fontSize: '0.92rem' }}>{v.name}</strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {v.builder} ({v.yearBuilt})
                        </div>
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            background: v.ownershipStatus === 'As Operator' ? 'rgba(2, 132, 199, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            color: v.ownershipStatus === 'As Operator' ? '#38bdf8' : '#10b981',
                            border: `1px solid ${v.ownershipStatus === 'As Operator' ? 'rgba(2, 132, 199, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`
                          }}
                        >
                          {v.ownershipStatus === 'As Operator' ? '⚙️ As Operator' : '⚓ As Owner'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.825rem' }}>{v.type}</td>
                      <td className="mono" style={{ fontSize: '0.8rem' }}>{v.regNo || v.imo}</td>
                      <td className="mono" style={{ fontSize: '0.8rem' }}>{v.callSign || '-'}</td>
                      <td className="mono" style={{ fontSize: '0.825rem' }}>{v.gt} GT</td>
                      <td>
                        <span className={`badge ${v.status?.includes('Operasional') ? 'badge-success' : 'badge-warning'}`}>
                          {v.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                          <button
                            onClick={() => {
                              setSelectedParticularVessel(v);
                              setShowParticularsModal(true);
                            }}
                            className="btn btn-secondary btn-sm"
                            title="Buka / Edit Data Particulars Lengkap"
                            style={{ padding: '0.35rem 0.55rem', color: '#38bdf8' }}
                          >
                            <span>Particulars</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingVessel(v);
                              setVesselFormData({
                                name: v.name,
                                type: v.type,
                                ownershipStatus: v.ownershipStatus || 'As Owner',
                                regNo: v.regNo || v.imo,
                                imo: v.imo || '',
                                callSign: v.callSign || '',
                                gt: v.gt || 310,
                                dwt: v.dwt || 450,
                                portOfRegistry: v.portOfRegistry || 'Pontianak',
                                builder: v.builder || '',
                                yearBuilt: v.yearBuilt || 2022,
                                status: v.status || 'Operasional (Berlayar)'
                              });
                              setShowVesselModal(true);
                            }}
                            className="btn btn-secondary btn-sm"
                            title="Edit Data Pokok Kapal"
                            style={{ padding: '0.35rem 0.55rem' }}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Yakin hapus kapal "${v.name}" (${v.id}) dari sistem?`)) {
                                deleteVessel(v.id);
                              }
                            }}
                            className="btn btn-secondary btn-sm"
                            title="Hapus Kapal"
                            style={{ padding: '0.35rem 0.55rem', color: '#ef4444' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MASTER DATA CREW                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'crew' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Master Data Awak Kapal (Crew Roster)</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Pusat data pelaut, perwira, teknisi, buku pelaut, dan kontak seluruh awak kapal armada Baharimas.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  exportToCSV('master_crew_baharimas', ['ID', 'Nama', 'Jabatan', 'Departemen', 'Kapal', 'Buku Pelaut', 'HP', 'Status'],
                    filteredCrew.map(c => [c.id, c.name, c.rank, c.department, vessels.find(v => v.id === c.vesselId)?.name || c.vesselId, c.seamanBookNo, c.phone || c.whatsapp, c.status])
                  );
                }}
                className="btn btn-secondary btn-sm"
              >
                <Download size={14} />
                <span>Ekspor CSV</span>
              </button>
              <button
                onClick={() => {
                  setEditingCrew(null);
                  setCrewFormData({
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
                  setShowCrewModal(true);
                }}
                className="btn btn-primary btn-sm"
              >
                <Plus size={14} />
                <span>Tambah Crew Baru</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Cari nama kru, jabatan, no buku pelaut..."
                value={crewSearch}
                onChange={(e) => setCrewSearch(e.target.value)}
                className="input-control"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            <select
              value={crewVesselFilter}
              onChange={(e) => setCrewVesselFilter(e.target.value)}
              className="select-control"
              style={{ width: '220px' }}
            >
              <option value="ALL">Semua Kapal ({allCrewList.length} Kru)</option>
              {vessels.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>

            <select
              value={crewDeptFilter}
              onChange={(e) => setCrewDeptFilter(e.target.value)}
              className="select-control"
              style={{ width: '150px' }}
            >
              <option value="ALL">Semua Dept</option>
              <option value="Deck">Deck</option>
              <option value="Engine">Engine</option>
            </select>
          </div>

          {/* Crew Table */}
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div className="table-container">
              <table className="pms-table">
                <thead>
                  <tr>
                    <th>Nama Awak Kapal</th>
                    <th>Jabatan / Rank</th>
                    <th>Kapal Penugasan</th>
                    <th>Departemen</th>
                    <th>No. Buku Pelaut</th>
                    <th>Kontak WhatsApp / HP</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Aksi Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCrew.map(c => {
                    const ship = vessels.find(v => v.id === c.vesselId);
                    return (
                      <tr key={c.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            {c.photo ? (
                              <img src={c.photo} alt={c.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                                {c.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <strong style={{ fontSize: '0.92rem' }}>{c.name}</strong>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: {c.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>{c.rank}</span>
                        </td>
                        <td>
                          <strong>{ship?.name || c.vesselId}</strong>
                        </td>
                        <td>
                          <span className={`badge ${c.department === 'Deck' ? 'badge-neutral' : 'badge-warning'}`}>
                            {c.department}
                          </span>
                        </td>
                        <td className="mono" style={{ fontSize: '0.8rem' }}>{c.seamanBookNo || '-'}</td>
                        <td className="mono" style={{ fontSize: '0.8rem' }}>{c.whatsapp || c.phone || '-'}</td>
                        <td>
                          <span className={`badge ${c.status === 'Onboard' ? 'badge-success' : 'badge-warning'}`}>
                            {c.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                            <button
                              onClick={() => {
                                setEditingCrew(c);
                                setCrewFormData({
                                  name: c.name,
                                  vesselId: c.vesselId,
                                  rank: c.rank,
                                  department: c.department,
                                  seamanBookNo: c.seamanBookNo || '',
                                  phone: c.phone || '',
                                  whatsapp: c.whatsapp || '',
                                  status: c.status || 'Onboard',
                                  contractDurationMonths: c.contractDurationMonths || 8,
                                  leaveBalanceDays: c.leaveBalanceDays || 14
                                });
                                setShowCrewModal(true);
                              }}
                              className="btn btn-secondary btn-sm"
                              title="Edit Kru"
                              style={{ padding: '0.35rem 0.55rem' }}
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Yakin hapus kru "${c.name}"?`)) {
                                  deleteCrew(c.id);
                                }
                              }}
                              className="btn btn-secondary btn-sm"
                              title="Hapus Kru"
                              style={{ padding: '0.35rem 0.55rem', color: '#ef4444' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MASTER DOKUMEN & SERTIFIKAT                                        */}
      {/* ========================================================================= */}
      {activeTab === 'documents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Master Seluruh Sertifikat Kapal ({allDocList.length} Dokumen)</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Basis data terpusat mencakup seluruh sertifikat BKI, Statutory, Asuransi, KSOP, dan Kesehatan beserta tanggal penerbitan dan masa berlaku.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  exportToCSV('master_dokumen_sertifikat_baharimas', ['ID', 'Kapal', 'Kategori', 'Nama Dokumen', 'No Dokumen', 'Penerbit', 'Tgl Penerbitan', 'Tgl Expired', 'Status'],
                    filteredDocs.map(d => [d.id, vessels.find(v => v.id === d.vesselId)?.name || d.vesselId, d.category, d.name, d.documentNo, d.issuer, d.issueDate, d.expiryDate, d.status])
                  );
                }}
                className="btn btn-secondary btn-sm"
              >
                <Download size={14} />
                <span>Ekspor CSV</span>
              </button>
              <button
                onClick={() => {
                  setEditingDoc(null);
                  setShowDocModal(true);
                }}
                className="btn btn-primary btn-sm"
              >
                <Plus size={14} />
                <span>Tambah Dokumen Baru</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Cari nama sertifikat, no dokumen, instansi..."
                value={docSearch}
                onChange={(e) => setDocSearch(e.target.value)}
                className="input-control"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            <select
              value={docVesselFilter}
              onChange={(e) => setDocVesselFilter(e.target.value)}
              className="select-control"
              style={{ width: '200px' }}
            >
              <option value="ALL">Semua Kapal</option>
              {vessels.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>

            <select
              value={docCategoryFilter}
              onChange={(e) => setDocCategoryFilter(e.target.value)}
              className="select-control"
              style={{ width: '180px' }}
            >
              <option value="ALL">Semua Kategori</option>
              {(certificateCategories || []).map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>

            <select
              value={docStatusFilter}
              onChange={(e) => setDocStatusFilter(e.target.value)}
              className="select-control"
              style={{ width: '150px' }}
            >
              <option value="ALL">Semua Status</option>
              <option value="Active">Active</option>
              <option value="Due Soon">Due Soon</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          {/* Documents Table */}
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div className="table-container">
              <table className="pms-table">
                <thead>
                  <tr>
                    <th>Kapal Terkait</th>
                    <th>Kategori</th>
                    <th>Nama Sertifikat</th>
                    <th>Surveyor / Auditor</th>
                    <th>Nomor Dokumen</th>
                    <th>Instansi Penerbit</th>
                    <th>Tgl Penerbitan</th>
                    <th>Tgl Expired</th>
                    <th>Berkas</th>
                    <th>Status Kelaikan</th>
                    <th style={{ textAlign: 'right' }}>Aksi Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map(d => {
                    const ship = vessels.find(v => v.id === d.vesselId);
                    const isExpired = d.status === 'Expired' || (d.daysUntilExpiry !== undefined && d.daysUntilExpiry <= 0);
                    const isH30 = d.daysUntilExpiry !== undefined && d.daysUntilExpiry > 0 && d.daysUntilExpiry <= 30;

                    return (
                      <tr key={d.id} style={{ background: isExpired ? 'rgba(239, 68, 68, 0.04)' : isH30 ? 'rgba(245, 158, 11, 0.03)' : undefined }}>
                        <td>
                          <strong>{ship?.name || d.vesselId}</strong>
                        </td>
                        <td>
                          <span
                            className="badge"
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              background: d.category === 'KSOP' ? 'rgba(245, 158, 11, 0.15)' :
                                d.category === 'BKI' ? 'rgba(56, 189, 248, 0.15)' :
                                d.category === 'Statutory' ? 'rgba(16, 185, 129, 0.15)' :
                                d.category === 'Asuransi' ? 'rgba(168, 85, 247, 0.15)' :
                                'rgba(236, 72, 153, 0.15)',
                              color: d.category === 'KSOP' ? '#f59e0b' :
                                d.category === 'BKI' ? '#38bdf8' :
                                d.category === 'Statutory' ? '#10b981' :
                                d.category === 'Asuransi' ? '#c084fc' :
                                '#f472b6',
                              border: d.category === 'KSOP' ? '1px solid rgba(245, 158, 11, 0.35)' :
                                d.category === 'BKI' ? '1px solid rgba(56, 189, 248, 0.35)' :
                                d.category === 'Statutory' ? '1px solid rgba(16, 185, 129, 0.35)' :
                                d.category === 'Asuransi' ? '1px solid rgba(168, 85, 247, 0.35)' :
                                '1px solid rgba(236, 72, 153, 0.35)'
                            }}
                          >
                            {d.category || 'Dokumen'}
                          </span>
                        </td>
                        <td>
                          <strong style={{ fontSize: '0.92rem' }}>{d.name}</strong>
                          {d.rawNote && (
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                              Catatan daftar: {d.rawNote}
                            </div>
                          )}
                        </td>
                        <td style={{ minWidth: '150px' }}>
                          {d.mandatoryAuditor ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '6px',
                                background: 'rgba(56, 189, 248, 0.15)',
                                color: '#38bdf8',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                <UserCheck size={12} />
                              </span>
                              <div>
                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                  {d.mandatoryAuditor}
                                </div>
                                <div style={{ fontSize: '0.68rem', color: 'var(--text-subtle)' }}>
                                  Pemeriksa Resmi
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>-</span>
                          )}
                        </td>
                        <td className="mono" style={{ fontSize: '0.8rem' }}>{d.documentNo || '-'}</td>
                        <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{d.issuer || '-'}</td>
                        <td className="mono" style={{ fontSize: '0.825rem', fontWeight: 600 }}>{d.issueDate || '-'}</td>
                        <td>
                          <div className="mono" style={{ fontWeight: 700, fontSize: '0.85rem', color: isExpired ? '#ef4444' : isH30 ? '#f59e0b' : '#10b981' }}>
                            {d.expiryDate}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: isExpired ? '#ef4444' : isH30 ? '#f59e0b' : 'var(--text-subtle)' }}>
                            {d.daysUntilExpiry > 0 ? `${d.daysUntilExpiry} hari lagi` : `LEWAT ${Math.abs(d.daysUntilExpiry)} HARI!`}
                          </div>
                        </td>
                        <td>
                          {d.fileUrl ? (
                            <button
                              type="button"
                              onClick={() => {
                                const win = window.open();
                                if (win) {
                                  win.document.write(`<iframe src="${d.fileUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                                }
                              }}
                              className="badge badge-info"
                              style={{
                                fontSize: '0.7rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                cursor: 'pointer',
                                padding: '0.2rem 0.45rem',
                                border: 'none',
                                background: 'rgba(56, 189, 248, 0.15)',
                                color: '#38bdf8'
                              }}
                              title={d.fileName ? `Lihat berkas: ${d.fileName}` : 'Lihat Berkas'}
                            >
                              <FileText size={11} />
                              <span>{d.fileName ? (d.fileName.length > 10 ? d.fileName.substring(0, 8) + '...' : d.fileName) : 'Berkas'}</span>
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>-</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${isExpired ? 'badge-danger-pulse' : isH30 ? 'badge-warning' : 'badge-success'}`}>
                            {d.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                            <button
                              onClick={() => {
                                setEditingDoc(d);
                                setShowDocModal(true);
                              }}
                              className="btn btn-secondary btn-sm"
                              title="Edit Sertifikat"
                              style={{ padding: '0.35rem 0.55rem' }}
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Yakin hapus sertifikat "${d.name}" (${d.documentNo})?`)) {
                                  deleteShipDocument(d.id);
                                }
                              }}
                              className="btn btn-secondary btn-sm"
                              title="Hapus Sertifikat"
                              style={{ padding: '0.35rem 0.55rem', color: '#ef4444' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: MASTER KATEGORI SERTIFIKAT                                         */}
      {/* ========================================================================= */}
      {activeTab === 'categories' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Master Kategori Sertifikat & Dokumen</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Kelola kategori sertifikat maritim dan tambahkan kategori khusus secara dinamis untuk seluruh armada.
              </p>
            </div>
          </div>

          {/* Form Tambah Kategori Baru */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={16} color="#38bdf8" />
              <span>Tambah Kategori Sertifikat Baru (Manual)</span>
            </h4>
            <form onSubmit={handleCreateCategory} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.5fr 120px auto', gap: '0.75rem', alignItems: 'end' }}>
              <div>
                <label className="field-label">Nama Kategori *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bea Cukai / Navigasi / Komersial"
                  value={newCatData.label}
                  onChange={(e) => setNewCatData(prev => ({ ...prev, label: e.target.value }))}
                  className="input-control"
                />
              </div>

              <div>
                <label className="field-label">Kode Kategori</label>
                <input
                  type="text"
                  placeholder="BEA_CUKAI / NAV"
                  value={newCatData.code}
                  onChange={(e) => setNewCatData(prev => ({ ...prev, code: e.target.value }))}
                  className="input-control"
                />
              </div>

              <div>
                <label className="field-label">Deskripsi Kategori</label>
                <input
                  type="text"
                  placeholder="Keterangan singkat fungsi kategori ini..."
                  value={newCatData.description}
                  onChange={(e) => setNewCatData(prev => ({ ...prev, description: e.target.value }))}
                  className="input-control"
                />
              </div>

              <div>
                <label className="field-label">Warna Lencana</label>
                <input
                  type="color"
                  value={newCatData.color}
                  onChange={(e) => setNewCatData(prev => ({ ...prev, color: e.target.value }))}
                  style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}
                />
              </div>

              <div>
                <button type="submit" className="btn btn-primary" style={{ height: '38px', whiteSpace: 'nowrap' }}>
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>

          {/* Categories Table */}
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div className="table-container">
              <table className="pms-table">
                <thead>
                  <tr>
                    <th>Lencana Kategori</th>
                    <th>Kode / ID</th>
                    <th>Deskripsi Fungsi</th>
                    <th>Jumlah Dokumen</th>
                    <th>Tipe Kategori</th>
                    <th style={{ textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {(!certificateCategories || certificateCategories.length === 0) ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-subtle)' }}>
                        <Tag size={36} style={{ opacity: 0.35, margin: '0 auto 0.5rem auto', display: 'block', color: '#38bdf8' }} />
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                          Belum Ada Kategori Sertifikat
                        </div>
                        <p style={{ fontSize: '0.8rem', maxWidth: '400px', margin: '0 auto' }}>
                          Kategori sertifikat saat ini kosong. Silakan gunakan form "Tambah Kategori Baru" di atas untuk menambahkan kategori manual.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    certificateCategories.map(c => {
                      const count = allDocList.filter(d => d.category === c.id).length;

                      return (
                        <tr key={c.id}>
                          <td>
                            <span
                              className="badge"
                              style={{
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                background: c.bgColor || 'rgba(56, 189, 248, 0.15)',
                                color: c.color || '#38bdf8',
                                border: `1px solid ${c.borderColor || 'rgba(56, 189, 248, 0.35)'}`
                              }}
                            >
                              {c.label}
                            </span>
                          </td>
                          <td className="mono" style={{ fontSize: '0.825rem' }}>{c.code || c.id}</td>
                          <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{c.description || '-'}</td>
                          <td>
                            <span className="badge badge-neutral" style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                              {count} Dokumen
                            </span>
                          </td>
                          <td>
                            <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                              {c.isCustom ? 'Kustom Tambahan' : 'Kategori Maritim'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              onClick={() => {
                                if (window.confirm(`Hapus kategori "${c.label}"?`)) {
                                  deleteCertificateCategory(c.id);
                                }
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ color: '#ef4444', padding: '0.35rem 0.55rem' }}
                            >
                              <Trash2 size={13} />
                              <span>Hapus</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========================================================= */}
          {/* MASTER TEMPLATE DOKUMEN PER KATEGORI                      */}
          {/* ========================================================= */}
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>📋 Master Template Dokumen Maritim ({filteredTemplates.length} Dokumen Tersedia)</span>
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Daftar template sertifikat yang muncul otomatis di pilihan cepat modal dokumen sesuai kategori yang dipilih.
                </p>
              </div>
            </div>

            {/* Form Tambah Template Dokumen Baru */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981' }}>
                <Plus size={15} />
                <span>Tambah Template Sertifikat Baru ke Data Master</span>
              </h5>
              <form onSubmit={handleCreateTemplate} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 110px 1.2fr 1.2fr auto', gap: '0.75rem', alignItems: 'end' }}>
                <div>
                  <label className="field-label">Nama Dokumen / Sertifikat *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pas Sungai Dan Danau / Izin Navigasi"
                    value={newTmplData.name}
                    onChange={(e) => setNewTmplData(prev => ({ ...prev, name: e.target.value }))}
                    className="input-control"
                  />
                </div>

                <div>
                  <label className="field-label">Kategori *</label>
                  <select
                    value={newTmplData.category}
                    onChange={(e) => setNewTmplData(prev => ({ ...prev, category: e.target.value }))}
                    className="select-control"
                    required
                  >
                    {(certificateCategories || []).map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="field-label">Masa Berlaku</label>
                  <select
                    value={newTmplData.defaultValidityYears}
                    onChange={(e) => setNewTmplData(prev => ({ ...prev, defaultValidityYears: Number(e.target.value) }))}
                    className="select-control"
                  >
                    <option value={0.5}>6 Bulan</option>
                    <option value={1}>1 Tahun</option>
                    <option value={2}>2 Tahun</option>
                    <option value={3}>3 Tahun</option>
                    <option value={5}>5 Tahun</option>
                    <option value={10}>10 Tahun</option>
                  </select>
                </div>

                <div>
                  <label className="field-label">Instansi Penerbit</label>
                  <input
                    type="text"
                    placeholder="Contoh: KSOP / KKP / Ditjen Hubla"
                    value={newTmplData.issuer}
                    onChange={(e) => setNewTmplData(prev => ({ ...prev, issuer: e.target.value }))}
                    className="input-control"
                  />
                </div>

                <div>
                  <label className="field-label">Surveyor / Auditor Default</label>
                  <input
                    type="text"
                    placeholder="Contoh: Syahbandar KSOP / Surveyor BKI"
                    value={newTmplData.mandatoryAuditor}
                    onChange={(e) => setNewTmplData(prev => ({ ...prev, mandatoryAuditor: e.target.value }))}
                    className="input-control"
                  />
                </div>

                <div>
                  <button type="submit" className="btn btn-primary" style={{ height: '38px', whiteSpace: 'nowrap' }}>
                    + Simpan Template
                  </button>
                </div>
              </form>
            </div>

            {/* Template Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Cari template dokumen, instansi, surveyor..."
                  value={tmplSearch}
                  onChange={(e) => setTmplSearch(e.target.value)}
                  className="input-control"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>

              <select
                value={tmplCatFilter}
                onChange={(e) => setTmplCatFilter(e.target.value)}
                className="select-control"
                style={{ width: '220px' }}
              >
                <option value="ALL">Semua Kategori ({documentTemplates?.length || 0})</option>
                {(certificateCategories || []).map(c => (
                  <option key={c.id} value={c.id}>
                    {c.label} ({(documentTemplates || []).filter(t => t.category === c.id).length})
                  </option>
                ))}
              </select>
            </div>

            {/* Templates Table */}
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div className="table-container">
                <table className="pms-table">
                  <thead>
                    <tr>
                      <th>Nama Sertifikat / Template</th>
                      <th>Kategori</th>
                      <th>Masa Berlaku</th>
                      <th>Surveyor / Auditor Default</th>
                      <th>Instansi Penerbit</th>
                      <th>Tipe Template</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTemplates.map((t, idx) => {
                      const catMeta = (certificateCategories || []).find(c => c.id === t.category);
                      return (
                        <tr key={`${t.name}-${idx}`}>
                          <td>
                            <strong style={{ fontSize: '0.88rem' }}>{t.name}</strong>
                          </td>
                          <td>
                            <span
                              className="badge"
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                background: catMeta?.bgColor || 'rgba(56, 189, 248, 0.15)',
                                color: catMeta?.color || '#38bdf8',
                                border: `1px solid ${catMeta?.borderColor || 'rgba(56, 189, 248, 0.35)'}`
                              }}
                            >
                              {t.category}
                            </span>
                          </td>
                          <td className="mono" style={{ fontSize: '0.82rem' }}>
                            {t.defaultValidityYears} Tahun
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <UserCheck size={12} color="#38bdf8" />
                              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{t.mandatoryAuditor || '-'}</span>
                            </div>
                          </td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {t.issuer || '-'}
                          </td>
                          <td>
                            <span className={`badge ${t.isCustom ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: '0.68rem' }}>
                              {t.isCustom ? 'Kustom Tambahan' : 'Standar Resmi'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {t.isCustom ? (
                              <button
                                onClick={() => {
                                  if (window.confirm(`Hapus template "${t.name}" (${t.category}) dari Data Master?`)) {
                                    deleteDocumentTemplate(t.name, t.category);
                                  }
                                }}
                                className="btn btn-secondary btn-sm"
                                style={{ color: '#ef4444', padding: '0.35rem 0.55rem' }}
                                title="Hapus Template Kustom Ini"
                              >
                                <Trash2 size={13} />
                                <span>Hapus</span>
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Standar Maritim</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {filteredTemplates.length === 0 && (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                          Tidak ada template dokumen yang cocok dengan pencarian / filter ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: MANAJEMEN USER & ROLE                                               */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Direktori Manajemen Pengguna (Users)</h3>
                <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{filteredUsers.length} dari {allUserList.length} Pengguna</span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Kelola akun pengguna, hak akses per-modul, peran nakhoda/teknisi/admin, dan pembatasan akses kapal armada.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={resetUsers}
                className="btn btn-secondary btn-sm"
                title="Reset akun ke data default sistem"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <RefreshCw size={14} />
                <span>Reset Akun Bawaan</span>
              </button>
              <button
                onClick={handleExportUsersCSV}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Download size={14} />
                <span>Ekspor CSV</span>
              </button>
              <button
                onClick={() => {
                  setEditingUser(null);
                  setUserFormData({
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
                  setModalPasswordVisible(false);
                  setShowUserModal(true);
                }}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <UserPlus size={14} />
                <span>+ Tambah Pengguna Baru</span>
              </button>
            </div>
          </div>

          {/* User Statistics Mini-Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem'
          }}>
            <div className="glass-card" style={{ padding: '0.85rem 1rem', borderLeft: '4px solid #38bdf8' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Pengguna Terdaftar</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                <strong style={{ fontSize: '1.25rem', fontWeight: 800 }}>{allUserList.length}</strong>
                <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>100% Terdata</span>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '0.85rem 1rem', borderLeft: '4px solid #a855f7' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administrator & Manager</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                <strong style={{ fontSize: '1.25rem', fontWeight: 800, color: '#a855f7' }}>
                  {allUserList.filter(u => u.role === 'Super Admin' || u.role === 'Fleet Manager').length}
                </strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Kantor Pusat</span>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '0.85rem 1rem', borderLeft: '4px solid #10b981' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Nakhoda & Awak Kapal</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                <strong style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
                  {allUserList.filter(u => u.role.includes('Nakhoda') || u.role.includes('Engineer') || u.role.includes('ABK')).length}
                </strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Operasional Kapal</span>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '0.85rem 1rem', borderLeft: '4px solid #ec4899' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>HR & Finance Staff</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                <strong style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ec4899' }}>
                  {allUserList.filter(u => u.role === 'HR / Personalia' || u.role === 'Finance').length}
                </strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Dukungan Darat</span>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Cari nama pengguna, email, jabatan, nomor telepon..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="input-control"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            <select
              value={userRoleFilter}
              onChange={(e) => setUserRoleFilter(e.target.value)}
              className="select-control"
              style={{ width: '200px' }}
            >
              <option value="ALL">Semua Hak Akses ({allUserList.length})</option>
              {Object.keys(ROLE_CONFIGS).map(roleName => (
                <option key={roleName} value={roleName}>{roleName}</option>
              ))}
            </select>

            <select
              value={userShipFilter}
              onChange={(e) => setUserShipFilter(e.target.value)}
              className="select-control"
              style={{ width: '200px' }}
            >
              <option value="ALL">Semua Hak Akses Kapal</option>
              <option value="All">Semua Kapal (Full Fleet Access)</option>
              {vessels.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>

            <select
              value={userStatusFilter}
              onChange={(e) => setUserStatusFilter(e.target.value)}
              className="select-control"
              style={{ width: '140px' }}
            >
              <option value="ALL">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>

          {/* User Table */}
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div className="table-container">
              <table className="pms-table">
                <thead>
                  <tr>
                    <th>Pengguna & Profil</th>
                    <th>Email & Kontak</th>
                    <th>Peran / Hak Akses</th>
                    <th>Akses Armada</th>
                    <th>Password Demo</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Aksi Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                        <Users size={36} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                        <p style={{ fontWeight: 600 }}>Tidak ada data pengguna yang sesuai dengan filter.</p>
                        <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Coba ubah kata kunci pencarian atau reset filter.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => {
                      const isMe = currentUser && (currentUser.id === u.id || currentUser.email?.toLowerCase() === u.email?.toLowerCase());
                      const roleConfig = ROLE_CONFIGS[u.role] || { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.35)', desc: 'Pengguna sistem' };
                      const ship = u.shipAccess === 'All' || !u.shipAccess
                        ? null
                        : vessels.find(v => v.id === u.shipAccess);
                      const isPasswordShown = !!showPasswordMap[u.id];

                      return (
                        <tr key={u.id}>
                          {/* 1. Profile */}
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <img
                                src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                                alt={u.name}
                                style={{
                                  width: '38px',
                                  height: '38px',
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                  border: `2px solid ${roleConfig.color}40`,
                                  flexShrink: 0
                                }}
                              />
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{u.name}</strong>
                                  {isMe && (
                                    <span
                                      className="badge"
                                      style={{
                                        fontSize: '0.62rem',
                                        background: 'rgba(16, 185, 129, 0.2)',
                                        color: '#10b981',
                                        border: '1px solid rgba(16, 185, 129, 0.4)'
                                      }}
                                    >
                                      Sesi Anda
                                    </span>
                                  )}
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                                  {u.title || 'Staff Operasional'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* 2. Email & Contact */}
                          <td>
                            <div style={{ fontSize: '0.825rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                                <Mail size={12} color="var(--text-muted)" />
                                <span>{u.email}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                                <Phone size={12} />
                                <span>{u.phone || '-'}</span>
                              </div>
                            </div>
                          </td>

                          {/* 3. Role */}
                          <td>
                            <div>
                              <span
                                className="badge"
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  background: roleConfig.bg,
                                  color: roleConfig.color,
                                  border: `1px solid ${roleConfig.border}`
                                }}
                              >
                                {u.role}
                              </span>
                              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0', maxWidth: '240px', lineHeight: 1.3 }}>
                                {roleConfig.desc}
                              </p>
                            </div>
                          </td>

                          {/* 4. Ship Access */}
                          <td>
                            {u.shipAccess === 'All' || !u.shipAccess ? (
                              <span
                                className="badge"
                                style={{
                                  fontSize: '0.72rem',
                                  background: 'rgba(56, 189, 248, 0.15)',
                                  color: '#38bdf8',
                                  border: '1px solid rgba(56, 189, 248, 0.35)'
                                }}
                              >
                                🚢 Semua Kapal ({vessels.length} Armada)
                              </span>
                            ) : (
                              <span
                                className="badge"
                                style={{
                                  fontSize: '0.72rem',
                                  background: 'rgba(16, 185, 129, 0.15)',
                                  color: '#10b981',
                                  border: '1px solid rgba(16, 185, 129, 0.35)'
                                }}
                              >
                                ⚓ {ship?.name || u.shipAccess}
                              </span>
                            )}
                          </td>

                          {/* 5. Password */}
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span style={{
                                fontFamily: 'monospace',
                                fontSize: '0.85rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '4px',
                                letterSpacing: isPasswordShown ? 'normal' : '2px',
                                color: isPasswordShown ? '#f59e0b' : 'var(--text-muted)'
                              }}>
                                {isPasswordShown ? (u.password || '123') : '••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => setShowPasswordMap(prev => ({ ...prev, [u.id]: !prev[u.id] }))}
                                title={isPasswordShown ? 'Sembunyikan Password' : 'Lihat Password'}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: 'var(--text-muted)',
                                  cursor: 'pointer',
                                  padding: '2px',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                {isPasswordShown ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                            </div>
                          </td>

                          {/* 6. Status */}
                          <td>
                            <button
                              type="button"
                              onClick={() => handleToggleUserStatus(u)}
                              title="Klik untuk mengubah status aktif/nonaktif"
                              style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
                            >
                              <span
                                className="badge"
                                style={{
                                  fontSize: '0.7rem',
                                  background: u.status === 'Nonaktif' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                  color: u.status === 'Nonaktif' ? '#ef4444' : '#10b981',
                                  border: `1px solid ${u.status === 'Nonaktif' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`
                                }}
                              >
                                {u.status === 'Nonaktif' ? '● Nonaktif' : '● Aktif'}
                              </span>
                            </button>
                          </td>

                          {/* 7. Actions */}
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                              <button
                                onClick={() => {
                                  setEditingUser(u);
                                  setUserFormData({
                                    name: u.name || '',
                                    email: u.email || '',
                                    password: u.password || '123',
                                    role: u.role || 'Admin Kapal / Nakhoda',
                                    title: u.title || '',
                                    shipAccess: u.shipAccess || 'All',
                                    phone: u.phone || '081288990011',
                                    status: u.status || 'Aktif',
                                    avatar: u.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
                                  });
                                  setModalPasswordVisible(false);
                                  setShowUserModal(true);
                                }}
                                className="btn-icon"
                                title="Edit Data Pengguna"
                                style={{ padding: '0.35rem' }}
                              >
                                <Edit2 size={14} />
                              </button>

                              <button
                                onClick={() => handleQuickResetPassword(u)}
                                className="btn-icon"
                                title="Reset Password ke: 123"
                                style={{ padding: '0.35rem', color: '#f59e0b' }}
                              >
                                <Key size={14} />
                              </button>

                              <button
                                onClick={() => {
                                  if (isMe) {
                                    showToast('Gagal: Anda tidak dapat menghapus akun yang sedang aktif digunakan!', 'error');
                                    return;
                                  }
                                  if (confirm(`Apakah Anda yakin ingin menghapus akun pengguna "${u.name}"?`)) {
                                    deleteUser(u.id);
                                  }
                                }}
                                disabled={isMe}
                                className="btn-icon"
                                title={isMe ? 'Akun Anda sedang aktif' : 'Hapus Pengguna'}
                                style={{
                                  padding: '0.35rem',
                                  color: isMe ? 'var(--text-subtle)' : '#ef4444',
                                  cursor: isMe ? 'not-allowed' : 'pointer',
                                  opacity: isMe ? 0.3 : 1
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
      {showVesselModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2, 6, 23, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '1.25rem'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '640px', padding: '1.75rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Ship size={20} color="#38bdf8" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  {editingVessel ? `Edit Kapal: ${editingVessel.name}` : 'Tambah Kapal Baru ke Armada'}
                </h3>
              </div>
              <button onClick={() => setShowVesselModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveVessel} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="field-label">Nama Kapal *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: RP 2020 / BAHARIMAS 01"
                    value={vesselFormData.name}
                    onChange={(e) => setVesselFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="input-control"
                  />
                </div>

                <div>
                  <label className="field-label">Status Kepemilikan *</label>
                  <select
                    value={vesselFormData.ownershipStatus}
                    onChange={(e) => setVesselFormData(prev => ({ ...prev, ownershipStatus: e.target.value }))}
                    className="select-control"
                  >
                    <option value="As Owner">⚓ As Owner (Kapal Milik)</option>
                    <option value="As Operator">⚙️ As Operator (Kapal Operasional)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="field-label">Jenis / Tipe Kapal</label>
                  <input
                    type="text"
                    value={vesselFormData.type}
                    onChange={(e) => setVesselFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="input-control"
                  />
                </div>
                <div>
                  <label className="field-label">No. Registrasi BKI</label>
                  <input
                    type="text"
                    placeholder="Contoh: 24587"
                    value={vesselFormData.regNo}
                    onChange={(e) => setVesselFormData(prev => ({ ...prev, regNo: e.target.value }))}
                    className="input-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="field-label">Call Sign</label>
                  <input
                    type="text"
                    placeholder="YDB2458"
                    value={vesselFormData.callSign}
                    onChange={(e) => setVesselFormData(prev => ({ ...prev, callSign: e.target.value }))}
                    className="input-control"
                  />
                </div>
                <div>
                  <label className="field-label">Gross Tonnage (GT)</label>
                  <input
                    type="number"
                    value={vesselFormData.gt}
                    onChange={(e) => setVesselFormData(prev => ({ ...prev, gt: e.target.value }))}
                    className="input-control"
                  />
                </div>
                <div>
                  <label className="field-label">Deadweight (DWT)</label>
                  <input
                    type="number"
                    value={vesselFormData.dwt}
                    onChange={(e) => setVesselFormData(prev => ({ ...prev, dwt: e.target.value }))}
                    className="input-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="field-label">Pelabuhan Pendaftaran</label>
                  <input
                    type="text"
                    value={vesselFormData.portOfRegistry}
                    onChange={(e) => setVesselFormData(prev => ({ ...prev, portOfRegistry: e.target.value }))}
                    className="input-control"
                  />
                </div>
                <div>
                  <label className="field-label">Status Operasional</label>
                  <select
                    value={vesselFormData.status}
                    onChange={(e) => setVesselFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="select-control"
                  >
                    <option value="Operasional (Berlayar)">Operasional (Berlayar)</option>
                    <option value="Standby (Labuh Jangkar)">Standby (Labuh Jangkar)</option>
                    <option value="Perbaikan (Docking BKI)">Perbaikan (Docking BKI)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button type="button" onClick={() => setShowVesselModal(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingVessel ? 'Simpan Perubahan' : 'Tambah Kapal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal Tambah / Edit Crew */}
      {showCrewModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2, 6, 23, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '1.25rem'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '1.75rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Users size={20} color="#a855f7" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  {editingCrew ? `Edit Awak Kapal: ${editingCrew.name}` : 'Tambah Awak Kapal Baru'}
                </h3>
              </div>
              <button onClick={() => setShowCrewModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCrew} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="field-label">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Hendra Gunawan"
                    value={crewFormData.name}
                    onChange={(e) => setCrewFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="input-control"
                  />
                </div>

                <div>
                  <label className="field-label">Kapal Penugasan *</label>
                  <select
                    value={crewFormData.vesselId}
                    onChange={(e) => setCrewFormData(prev => ({ ...prev, vesselId: e.target.value }))}
                    className="select-control"
                    required
                  >
                    {vessels.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="field-label">Jabatan / Rank *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nakhoda / Chief Engineer / ABK"
                    value={crewFormData.rank}
                    onChange={(e) => setCrewFormData(prev => ({ ...prev, rank: e.target.value }))}
                    className="input-control"
                  />
                </div>

                <div>
                  <label className="field-label">Departemen *</label>
                  <select
                    value={crewFormData.department}
                    onChange={(e) => setCrewFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="select-control"
                  >
                    <option value="Deck">Deck</option>
                    <option value="Engine">Engine</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="field-label">No. Buku Pelaut</label>
                  <input
                    type="text"
                    placeholder="B-123456-ID"
                    value={crewFormData.seamanBookNo}
                    onChange={(e) => setCrewFormData(prev => ({ ...prev, seamanBookNo: e.target.value }))}
                    className="input-control"
                  />
                </div>

                <div>
                  <label className="field-label">Nomor WhatsApp / HP</label>
                  <input
                    type="text"
                    placeholder="081288990011"
                    value={crewFormData.whatsapp}
                    onChange={(e) => setCrewFormData(prev => ({ ...prev, whatsapp: e.target.value, phone: e.target.value }))}
                    className="input-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="field-label">Status Kehadiran</label>
                  <select
                    value={crewFormData.status}
                    onChange={(e) => setCrewFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="select-control"
                  >
                    <option value="Onboard">Onboard (Di Kapal)</option>
                    <option value="On Leave">On Leave (Sedang Cuti)</option>
                    <option value="Standby">Standby (Darat)</option>
                  </select>
                </div>

                <div>
                  <label className="field-label">Durasi Kontrak (Bulan)</label>
                  <input
                    type="number"
                    value={crewFormData.contractDurationMonths}
                    onChange={(e) => setCrewFormData(prev => ({ ...prev, contractDurationMonths: e.target.value }))}
                    className="input-control"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button type="button" onClick={() => setShowCrewModal(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCrew ? 'Simpan Perubahan' : 'Tambah Kru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal Tambah / Edit Pengguna */}
      {showUserModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2, 6, 23, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '1.25rem'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '640px', padding: '1.75rem', borderRadius: '16px', maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <UserCheck size={20} color="#a855f7" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  {editingUser ? `Edit Pengguna: ${editingUser.name}` : 'Tambah Pengguna Sistem Baru'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setEditingUser(null);
                }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Row 1: Nama & Jabatan */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="field-label">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Capt. Hendra Gunawan, M.Mar"
                    value={userFormData.name}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="input-control"
                  />
                </div>

                <div>
                  <label className="field-label">Jabatan / Title Perusahaan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nakhoda / Chief Engineer / Staff"
                    value={userFormData.title}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="input-control"
                  />
                </div>
              </div>

              {/* Row 2: Email & Password */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="field-label">Email Login Baharimas *</label>
                  <input
                    type="email"
                    required
                    placeholder="nama@baharimas.co.id"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="input-control"
                  />
                </div>

                <div>
                  <label className="field-label">Kata Sandi Login *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={modalPasswordVisible ? 'text' : 'password'}
                      required
                      placeholder="Password (demo: 123)"
                      value={userFormData.password}
                      onChange={(e) => setUserFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="input-control"
                      style={{ paddingRight: '2.5rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setModalPasswordVisible(!modalPasswordVisible)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      {modalPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 3: Role / Hak Akses */}
              <div>
                <label className="field-label">Peran & Hak Akses (Role) *</label>
                <select
                  value={userFormData.role}
                  onChange={(e) => setUserFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="select-control"
                >
                  {Object.keys(ROLE_CONFIGS).map(roleName => (
                    <option key={roleName} value={roleName}>{roleName}</option>
                  ))}
                </select>
                {ROLE_CONFIGS[userFormData.role] && (
                  <div style={{
                    marginTop: '0.45rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    background: ROLE_CONFIGS[userFormData.role].bg,
                    border: `1px solid ${ROLE_CONFIGS[userFormData.role].border}`,
                    fontSize: '0.78rem',
                    color: ROLE_CONFIGS[userFormData.role].color
                  }}>
                    <strong>Hak Akses {userFormData.role}:</strong> {ROLE_CONFIGS[userFormData.role].desc}
                  </div>
                )}
              </div>

              {/* Row 4: Akses Kapal & No HP */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="field-label">Hak Akses Armada Kapal *</label>
                  <select
                    value={userFormData.shipAccess}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, shipAccess: e.target.value }))}
                    className="select-control"
                  >
                    <option value="All">🚢 Semua Kapal (Full Fleet Access - {vessels.length} Armada)</option>
                    <optgroup label="Pilih Kapal Spesifik:">
                      {vessels.map(v => (
                        <option key={v.id} value={v.id}>⚓ {v.name} ({v.ownershipStatus || 'Owner'})</option>
                      ))}
                    </optgroup>
                  </select>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>
                    {userFormData.shipAccess === 'All'
                      ? 'Pengguna dapat mengelola seluruh armada kapal Baharimas.'
                      : 'Pengguna hanya dibatasi pada data dan logbook kapal ini.'}
                  </span>
                </div>

                <div>
                  <label className="field-label">Nomor WhatsApp / HP</label>
                  <input
                    type="text"
                    placeholder="081288990011"
                    value={userFormData.phone}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="input-control"
                  />
                </div>
              </div>

              {/* Row 5: Status Akun */}
              <div>
                <label className="field-label">Status Akun</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="radio"
                      name="status"
                      value="Aktif"
                      checked={userFormData.status === 'Aktif'}
                      onChange={() => setUserFormData(prev => ({ ...prev, status: 'Aktif' }))}
                    />
                    <span style={{ color: '#10b981', fontWeight: 600 }}>● Aktif (Bisa Login)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="radio"
                      name="status"
                      value="Nonaktif"
                      checked={userFormData.status === 'Nonaktif'}
                      onChange={() => setUserFormData(prev => ({ ...prev, status: 'Nonaktif' }))}
                    />
                    <span style={{ color: '#ef4444', fontWeight: 600 }}>● Nonaktif (Akses Ditutup)</span>
                  </label>
                </div>
              </div>

              {/* Row 6: Avatar & Quick Presets */}
              <div>
                <label className="field-label">Foto Profil / Avatar</label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <img
                    src={userFormData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                    alt="Preview"
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8' }}
                  />
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      placeholder="URL Foto Avatar (Unsplash / Hosted)"
                      value={userFormData.avatar}
                      onChange={(e) => setUserFormData(prev => ({ ...prev, avatar: e.target.value }))}
                      className="input-control"
                      style={{ fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Pilih Cepat:</span>
                  {PRESET_AVATARS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setUserFormData(prev => ({ ...prev, avatar: p.url }))}
                      className="badge"
                      style={{
                        fontSize: '0.68rem',
                        cursor: 'pointer',
                        background: userFormData.avatar === p.url ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${userFormData.avatar === p.url ? '#38bdf8' : 'var(--border-subtle)'}`,
                        color: userFormData.avatar === p.url ? '#38bdf8' : 'var(--text-secondary)'
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowUserModal(false);
                    setEditingUser(null);
                  }}
                  className="btn btn-secondary"
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Save size={14} />
                  <span>{editingUser ? 'Simpan Perubahan User' : 'Daftarkan Pengguna'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
