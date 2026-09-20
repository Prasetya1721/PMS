import React, { useState, useRef, useEffect } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Ship,
  Wrench,
  FileCheck,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  ArrowRight,
  UserCheck,
  Phone,
  Compass,
  MapPin,
  Anchor,
  Users,
  Calendar,
  Send,
  CalendarPlus,
  Eye,
  Package,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  FileText,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Edit3,
  Edit2,
  Trash2,
  Camera,
  ShoppingBag,
  Printer,
  Search,
  FileSpreadsheet,
  CheckSquare,
  Square
} from 'lucide-react';
import { RunningHoursModal } from '../equipment/RunningHoursModal';
import { WorkOrderModal } from '../maintenance/WorkOrderModal';
import { ShipParticularsView } from '../vessels/ShipParticularsView';
import { ParticularsModal } from '../vessels/ParticularsModal';
import { EditVesselPhotoModal } from '../vessels/EditVesselPhotoModal';
import { DocumentFormModal } from '../documents/DocumentFormModal';
import { DocumentPreviewModal } from '../documents/DocumentPreviewModal';
import { AuditReportModal } from '../audit/AuditReportModal';

export const VesselDashboard = () => {
  const {
    vessels,
    certificateCategories,
    selectedVesselId,
    setSelectedVesselId,
    equipment,
    workOrders,
    crew,
    crewCertificates,
    allCrewCertificates,
    shipDocuments,
    allShipDocuments,
    allCrew,
    allEquipment,
    allWorkOrders,
    allSpareparts,
    spareparts,
    allAuditFindings,
    allAudits,
    setActiveTab,
    sendWhatsAppReminder,
    openGoogleCalendar,
    updateWorkOrderStatus,
    toggleChecklist,
    addCrew,
    addShipDocument,
    updateShipDocument,
    deleteShipDocument,
    updateVessel,
    updateVesselParticulars,
    theme
  } = usePMS();

  const [activeSubTab, setActiveSubTab] = useState('overview'); // overview | particulars | crew | documents | equipment | workorders | spareparts
  const [selectedEqForHours, setSelectedEqForHours] = useState(null);
  const [showNewWOModal, setShowNewWOModal] = useState(false);
  const [selectedWOForModal, setSelectedWOForModal] = useState(null);
  const [reqCategoryFilter, setReqCategoryFilter] = useState('ALL');
  const [reqStatusFilter, setReqStatusFilter] = useState('ALL');
  const [reqSearchQuery, setReqSearchQuery] = useState('');
  const [showAddCrewModal, setShowAddCrewModal] = useState(false);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [showParticularsModal, setShowParticularsModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [shipDocCatFilter, setShipDocCatFilter] = useState('ALL');
  const [editingShipDoc, setEditingShipDoc] = useState(null);
  const [vesselReportFinding, setVesselReportFinding] = useState(null);
  const [vesselReportSession, setVesselReportSession] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);


  // New Crew Form State
  const [newCrewData, setNewCrewData] = useState({
    name: '',
    rank: 'Juru Mudi / ABK',
    department: 'Deck',
    seamanBookNo: '',
    phone: '',
    whatsapp: '',
    contractDurationMonths: 8,
    leaveBalanceDays: 14
  });

  // Current vessel with safe fallback
  const currentShip = (vessels && vessels.find(v => v.id === selectedVesselId)) || (vessels && vessels[0]) || null;

  // Specific data filtered for THIS ship with defensive checks
  const shipCrew = currentShip ? (allCrew || []).filter(c => c.vesselId === currentShip.id) : [];
  const shipCrewCerts = currentShip ? (allCrewCertificates || crewCertificates || []).filter(c => c.vesselId === currentShip.id) : [];
  const shipDocs = currentShip ? (allShipDocuments || []).filter(d => d.vesselId === currentShip.id) : [];
  const shipEquipment = currentShip ? (allEquipment || []).filter(e => e.vesselId === currentShip.id) : [];
  const shipWOs = currentShip ? (allWorkOrders || []).filter(w => w.vesselId === currentShip.id) : [];
  const shipParts = currentShip ? (allSpareparts || []).filter(s => s.vesselId === currentShip.id) : [];

  const overdueWO = shipWOs.filter(w => w.status === 'Overdue');
  const inProgressWO = shipWOs.filter(w => w.status === 'In Progress');
  const expiredDocs = shipDocs.filter(d => d.status === 'Expired');
  const dueSoonDocs = shipDocs.filter(d => d.status === 'Due Soon');
  const urgentCerts = [
    ...shipCrewCerts.filter(c => c.status !== 'Active'),
    ...shipDocs.filter(d => d.status !== 'Active')
  ];

  const shipAuditFindings = currentShip ? (allAuditFindings || []).filter(f => f.vesselId === currentShip.id) : [];
  const shipOpenNC = shipAuditFindings.filter(f => f.status !== 'NC Close').length;
  const shipClosedNC = shipAuditFindings.filter(f => f.status === 'NC Close').length;

  const getRequisitionItems = (wo) => {
    if (wo.items && Array.isArray(wo.items) && wo.items.length > 0) {
      return wo.items;
    }
    if (wo.partsRequired && Array.isArray(wo.partsRequired) && wo.partsRequired.length > 0) {
      return wo.partsRequired.map((p, idx) => ({
        id: `it-${idx + 1}`,
        name: p.name,
        qty: p.qty || 1,
        unit: p.unit || 'Pcs',
        notes: `Pengadaan suku cadang mesin`,
        received: false
      }));
    }
    if (wo.checklist && Array.isArray(wo.checklist) && wo.checklist.length > 0) {
      return wo.checklist.map((c, idx) => ({
        id: c.id || `it-${idx + 1}`,
        name: c.text,
        qty: 1,
        unit: 'Paket / Item',
        notes: 'Kebutuhan operasional pemeliharaan',
        received: c.done || false
      }));
    }
    return [];
  };

  const handleSendWAtoWarehouse = (wo) => {
    const items = getRequisitionItems(wo);
    const lines = [
      `*SURAT PERMINTAAN BARANG KE GUDANG (MATERIAL REQUISITION)*`,
      `*PT. PELAYARAN BAHARIMAS KALIMANTAN*`,
      `═════════════════════════════════`,
      `📄 No. Dokumen: *${wo.id}*`,
      `🚢 Kapal: *${currentShip.name}*`,
      `🏷️ Kategori: *${wo.mainCategory || wo.category || 'Kebutuhan Kapal'}*`,
      `👤 PIC / Pemohon: *${wo.pic || wo.assignedTo || '-'}*`,
      `⚓ Mengetahui (Nakhoda): *${wo.captain || wo.supervisor || currentShip.masterCaptain || 'Capt. Hendra Gunawan, M.Mar'}*`,
      `📅 Tgl Permintaan: ${wo.requestDate || wo.dueDate || '-'}`,
      `⏰ Tgl Dibutuhkan: *${wo.neededDate || wo.dueDate || 'Segera'}*`,
      `⚡ Prioritas: *${wo.priority}*`,
      `📍 Lokasi Serah: ${wo.deliveryLocation || 'Dermaga Pelabuhan Dwikora Pontianak'}`,
      ``,
      `*DAFTAR BARANG YANG DIMINTA:*`,
      ...items.map((it, idx) => `${idx + 1}. *${it.name}* - ${it.qty} ${it.unit} (${it.notes || '-'})`),
      ``,
      wo.notes ? `📝 *Catatan Tambahan:* ${wo.notes}` : '',
      `═════════════════════════════════`,
      `_Mohon untuk dipersiapkan oleh Tim Logistik Gudang PBK. Terima kasih._`
    ].filter(Boolean);

    const waText = encodeURIComponent(lines.join('\n'));
    window.open(`https://api.whatsapp.com/send?phone=6281288991122&text=${waText}`, '_blank');
  };

  const handleCreateCrew = (e) => {
    e.preventDefault();
    if (!newCrewData.name.trim()) return;

    addCrew({
      ...newCrewData,
      vesselId: currentShip.id,
      phone: newCrewData.phone || '081288990011',
      whatsapp: newCrewData.whatsapp || '+6281288990011',
      seamanBookNo: newCrewData.seamanBookNo || `B-${Math.floor(100000 + Math.random() * 900000)}-ID`,
      signOnDate: new Date().toISOString().split('T')[0],
      signOffPlanDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    setShowAddCrewModal(false);
    setNewCrewData({
      name: '',
      rank: 'Juru Mudi / ABK',
      department: 'Deck',
      seamanBookNo: '',
      phone: '',
      whatsapp: '',
      contractDurationMonths: 8,
      leaveBalanceDays: 14
    });
  };

  if (!currentShip || !vessels || vessels.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8',
            margin: '0 auto 1.5rem auto'
          }}>
            <Ship size={38} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            Belum Ada Kapal Terdaftar di Sistem Armada
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            Sistem PMS saat ini dalam keadaan bersih dari data dummy dan siap untuk pengujian input manual. Daftarkan kapal pertama Anda untuk mulai mengisi data peralatan mesin, sertifikat kelaikan, kru, dan anggaran operasional.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('fleet')}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
            >
              <Plus size={18} />
              <span>+ Daftarkan Kapal Pertama</span>
            </button>
            <button
              onClick={() => setActiveTab('master')}
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', fontSize: '0.95rem' }}
            >
              <span>Buka Pusat Data Master</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Vessel Profile Hero Card */}
      <div className="glass-card no-print" style={{ overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '360px 1fr',
          minHeight: '230px'
        }}>
          {/* Photo & Status */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <img
              src={currentShip.photo}
              alt={currentShip.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: theme === 'light'
                ? 'linear-gradient(to right, transparent 60%, rgba(255, 255, 255, 0.95) 100%)'
                : 'linear-gradient(to right, transparent 60%, rgba(15, 28, 53, 0.95) 100%)'
            }} />
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span className={`badge ${currentShip.status?.includes('Operasional') ? 'badge-success' : 'badge-warning'}`}>
                {currentShip.status}
              </span>
              <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                {currentShip.ownershipStatus || 'As Owner'}
              </span>
            </div>

            {/* Quick Edit Photo Button on image */}
            <button
              onClick={() => setShowPhotoModal(true)}
              className="btn btn-secondary btn-sm"
              style={{
                position: 'absolute',
                bottom: '0.75rem',
                left: '0.75rem',
                background: 'rgba(2, 6, 23, 0.75)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#fff',
                fontSize: '0.72rem',
                padding: '0.3rem 0.65rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                zIndex: 2
              }}
              title="Ganti / Edit Foto Kapal Ini"
            >
              <Camera size={13} color="#38bdf8" />
              <span>Ganti Foto Kapal</span>
            </button>
          </div>

          {/* Details & Specifications */}
          <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>{currentShip.name}</h2>
                    <span
                      className="badge"
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: currentShip.ownershipStatus === 'As Operator' ? 'rgba(2, 132, 199, 0.95)' : 'rgba(5, 150, 105, 0.95)',
                        color: '#fff',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                      }}
                    >
                      {currentShip.ownershipStatus === 'As Operator' ? '⚙️ Register: As Operator' : '⚓ Register: As Owner'}
                    </span>
                    <span className="badge badge-info">{currentShip.type}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    No. Reg: <strong className="mono" style={{ color: 'var(--text-main)' }}>{currentShip.regNo || '-'}</strong> {currentShip.imo ? <> • IMO: <strong className="mono" style={{ color: 'var(--text-main)' }}>{currentShip.imo}</strong></> : null} • Call Sign:{' '}
                    <strong className="mono" style={{ color: 'var(--text-main)' }}>{currentShip.callSign || '-'}</strong> • Pelabuhan Pendaftaran:{' '}
                    <strong style={{ color: 'var(--text-main)' }}>{currentShip.portOfRegistry}</strong> • Galangan: <strong style={{ color: 'var(--text-main)' }}>{currentShip.builder} ({currentShip.yearBuilt})</strong>
                  </p>
                </div>

                {/* Quick Ship Selector Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pilih Kapal:</span>
                  <select
                    value={currentShip.id}
                    onChange={(e) => setSelectedVesselId(e.target.value)}
                    className="select-control"
                    style={{ width: '250px', fontSize: '0.825rem', fontWeight: 600, background: 'var(--bg-surface)' }}
                  >
                    {vessels.some(v => !v.id.startsWith('v-op-') && v.ownershipStatus !== 'As Operator') && (
                      <optgroup label={`⚓ AS OWNER (${vessels.filter(v => !v.id.startsWith('v-op-') && v.ownershipStatus !== 'As Operator').length} Kapal)`}>
                        {vessels.filter(v => !v.id.startsWith('v-op-') && v.ownershipStatus !== 'As Operator').map(v => (
                          <option key={v.id} value={v.id}>
                            🚢 {v.name} ({(v.type || '').split(' ')[0] || v.type || 'Kapal'}) [Owner]
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {vessels.some(v => v.id.startsWith('v-op-') || v.ownershipStatus === 'As Operator') && (
                      <optgroup label={`⚙️ AS OPERATOR (${vessels.filter(v => v.id.startsWith('v-op-') || v.ownershipStatus === 'As Operator').length} Kapal)`}>
                        {vessels.filter(v => v.id.startsWith('v-op-') || v.ownershipStatus === 'As Operator').map(v => (
                          <option key={v.id} value={v.id}>
                            ⚙️ {v.name} ({(v.type || '').split(' ')[0] || v.type || 'Kapal'}) [Operator]
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>
              </div>

              {/* Quick Specs Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem', marginTop: '1.15rem' }}>
                <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Posisi Saat Ini</span>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8', marginTop: '0.15rem' }}>
                    {currentShip.currentLocation}
                  </p>
                </div>
                <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Kecepatan / Tonase</span>
                  <p className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', marginTop: '0.15rem' }}>
                    {currentShip.speedKnots} Knots • {currentShip.gt?.toLocaleString()} GT
                  </p>
                </div>
                <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Nakhoda / Barge Master</span>
                  <p style={{ fontSize: '0.825rem', fontWeight: 600, marginTop: '0.15rem' }}>
                    {currentShip.masterCaptain || '-'}
                  </p>
                </div>
                <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Chief Engineer / KKM</span>
                  <p style={{ fontSize: '0.825rem', fontWeight: 600, marginTop: '0.15rem' }}>
                    {currentShip.chiefEngineer || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '0.85rem' }}>
              <button
                onClick={() => setShowNewWOModal(true)}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                title="Formulir Permintaan Barang ke Gudang (Material Requisition)"
              >
                <Package size={14} />
                <span>Permintaan Barang ke Gudang</span>
              </button>
              <button onClick={() => setShowAddCrewModal(true)} className="btn btn-secondary btn-sm">
                <Users size={14} />
                <span>Tambah Kru</span>
              </button>
              <button onClick={() => setShowAddDocModal(true)} className="btn btn-secondary btn-sm">
                <FileCheck size={14} />
                <span>Tambah Sertifikat BKI</span>
              </button>
              <button
                onClick={() => setShowParticularsModal(true)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(56, 189, 248, 0.4)' }}
              >
                <Edit3 size={14} color="#38bdf8" />
                <span style={{ color: '#38bdf8', fontWeight: 600 }}>Edit Data Particular</span>
              </button>
              <button
                onClick={() => setShowPhotoModal(true)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                title="Ganti atau upload foto kapal"
              >
                <Camera size={14} color="#f59e0b" />
                <span>Edit Foto</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dedicated Navigation Sub-Tabs — Terlihat Semua (No clipping, No horizontal scroll) */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.65rem 0.85rem',
          background: theme === 'light' ? '#f1f5f9' : 'rgba(2, 6, 23, 0.75)',
          borderTop: '1px solid var(--border-glass)',
          borderBottom: '1px solid var(--border-glass)'
        }}>
          {[
            { id: 'overview', label: 'Ringkasan Status', icon: Compass, badge: null },
            { id: 'particulars', label: 'Data Particulars', icon: FileText, badge: 'BKI' },
            { id: 'crew', label: 'Awak Kapal (Crew)', icon: Users, badge: shipCrew.length },
            { id: 'documents', label: 'Sertifikat & Dokumen', icon: FileCheck, badge: shipDocs.length, alert: expiredDocs.length > 0 },
            { id: 'equipment', label: 'Equipment Mesin', icon: Wrench, badge: shipEquipment.length },
            { id: 'workorders', label: 'Permintaan Gudang', icon: ShoppingBag, badge: shipWOs.length, alert: overdueWO.length > 0 },
            { id: 'spareparts', label: 'Suku Cadang', icon: Package, badge: shipParts.length },
            {
              id: 'audit',
              label: 'Audit SMC',
              icon: ShieldCheck,
              badge: shipAuditFindings.length > 0 ? `${shipOpenNC} NC` : null,
              alert: shipOpenNC > 0
            }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                title={tab.label}
                className={`tab-btn ${isActive ? 'active' : ''}`}
                style={{
                  flex: '1 1 auto',
                  minWidth: 'fit-content',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 600,
                  whiteSpace: 'nowrap',
                  borderRadius: '10px',
                  border: isActive
                    ? '1px solid rgba(56, 189, 248, 0.55)'
                    : theme === 'light'
                      ? '1px solid #e2e8f0'
                      : '1px solid rgba(148, 163, 184, 0.18)',
                  background: isActive
                    ? undefined
                    : theme === 'light'
                      ? '#ffffff'
                      : 'rgba(148, 163, 184, 0.08)',
                  color: isActive
                    ? undefined
                    : theme === 'light'
                      ? '#334155'
                      : '#cbd5e1',
                  boxShadow: isActive ? undefined : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon
                  size={15}
                  color={isActive ? '#fff' : theme === 'light' ? '#0284c7' : '#7dd3fc'}
                  style={{ flexShrink: 0 }}
                />
                <span>{tab.label}</span>
                {tab.badge !== null && tab.badge !== undefined && (
                  <span className={`badge ${tab.alert ? 'badge-danger-pulse' : isActive ? 'badge-info' : 'badge-neutral'}`} style={{ fontSize: '0.68rem', padding: '0.05rem 0.4rem', flexShrink: 0 }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB 1: RINGKASAN (OVERVIEW) */}
      {activeSubTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* 4 Health Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div className="glass-card" style={{ padding: '1.15rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Personel Onboard</span>
                <Users size={18} color="#a78bfa" />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem' }}>
                {shipCrew.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-subtle)' }}>Orang</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Nakhoda & Perwira Siap Tugas
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.15rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sertifikat Survei BKI</span>
                <FileCheck size={18} color={expiredDocs.length > 0 ? '#ef4444' : '#10b981'} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem', color: expiredDocs.length > 0 ? '#ef4444' : '#fff' }}>
                {shipDocs.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-subtle)' }}>Dokumen</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: expiredDocs.length > 0 ? '#ef4444' : 'var(--text-muted)', marginTop: '0.2rem', fontWeight: expiredDocs.length > 0 ? 700 : 400 }}>
                {expiredDocs.length > 0 ? `${expiredDocs.length} Survei Expired!` : `${dueSoonDocs.length} Survei H-30 Jatuh Tempo`}
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.15rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Work Orders Aktif</span>
                <Clock size={18} color={overdueWO.length > 0 ? '#ef4444' : '#38bdf8'} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem', color: overdueWO.length > 0 ? '#ef4444' : '#fff' }}>
                {shipWOs.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-subtle)' }}>Tugas</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: overdueWO.length > 0 ? '#ef4444' : 'var(--text-muted)', marginTop: '0.2rem', fontWeight: overdueWO.length > 0 ? 700 : 400 }}>
                {overdueWO.length > 0 ? `${overdueWO.length} Overdue Batas Jam!` : `${inProgressWO.length} Sedang Dikerjakan`}
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.15rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unit Equipment Mesin</span>
                <Wrench size={18} color="#38bdf8" />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem' }}>
                {shipEquipment.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-subtle)' }}>Unit</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Tercatat di Database Kapal
              </p>
            </div>
          </div>

          {/* Running Hours Preview */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Jam Operasi Mesin & Perangkat Kapal Ini</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Monitoring running hours terhadap interval target servis berikutnya
                </p>
              </div>
              <button onClick={() => setActiveSubTab('equipment')} className="btn btn-secondary btn-sm">
                <span>Kelola Equipment</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid-cols-3">
              {shipEquipment.slice(0, 3).map(eq => {
                const hoursLeft = eq.nextServiceHours - eq.runningHours;
                const percentageUsed = Math.min(100, Math.round((eq.runningHours / eq.nextServiceHours) * 100));

                return (
                  <div
                    key={eq.id}
                    style={{
                      padding: '1.1rem',
                      borderRadius: '10px',
                      background: 'var(--bg-surface-elevated)',
                      border: eq.status === 'Overdue'
                        ? '1px solid rgba(239, 68, 68, 0.5)'
                        : eq.status === 'Due Soon'
                        ? '1px solid rgba(245, 158, 11, 0.4)'
                        : '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span className="mono" style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>
                          {eq.code}
                        </span>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.15rem' }}>{eq.name}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{eq.model}</p>
                      </div>
                      <span className={`badge ${
                        eq.status === 'Overdue' ? 'badge-danger-pulse' :
                        eq.status === 'Due Soon' ? 'badge-warning' : 'badge-success'
                      }`}>
                        {eq.status}
                      </span>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Jam Kerja: <strong className="mono" style={{ color: '#fff' }}>{eq.runningHours?.toLocaleString()}</strong></span>
                        <span style={{ color: 'var(--text-muted)' }}>Target: <strong className="mono">{eq.nextServiceHours?.toLocaleString()}</strong></span>
                      </div>
                      <div className="progress-bar-container">
                        <div
                          className={`progress-bar-fill ${
                            eq.status === 'Overdue' ? 'progress-red' :
                            eq.status === 'Due Soon' ? 'progress-amber' : 'progress-blue'
                          }`}
                          style={{ width: `${percentageUsed}%` }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.65rem' }}>
                        <span style={{ fontSize: '0.75rem', color: hoursLeft <= 0 ? '#ef4444' : '#f59e0b', fontWeight: 600 }}>
                          {hoursLeft <= 0 ? `Overdue ${Math.abs(hoursLeft)} Jam!` : `Sisa ${hoursLeft} Jam`}
                        </span>
                        <button
                          onClick={() => setSelectedEqForHours(eq)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.2rem 0.6rem', fontSize: '0.72rem' }}
                        >
                          <Clock size={12} />
                          <span>Log Jam</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Work Orders & Urgent Certificates for THIS Ship */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr', gap: '1.5rem' }}>
            {/* Work Orders / Requisitions List */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Permintaan Barang Gudang ({shipWOs.length})</h4>
                <button onClick={() => setActiveSubTab('workorders')} className="btn btn-secondary btn-sm">
                  Lihat Semua
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {shipWOs.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
                    <p>Tidak ada permintaan barang yang tertunda untuk kapal ini.</p>
                  </div>
                ) : (
                  shipWOs.map(wo => (
                    <div
                      key={wo.id}
                      style={{
                        padding: '0.85rem',
                        borderRadius: '8px',
                        background: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>{wo.id}</span>
                          <span className={`badge ${
                            wo.priority === 'Sangat Tinggi' || wo.priority === 'Tinggi' || wo.priority === 'Urgent / Darurat' ? 'badge-danger' : 'badge-warning'
                          }`} style={{ fontSize: '0.65rem' }}>
                            {wo.priority}
                          </span>
                          <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                            {wo.mainCategory || wo.category}
                          </span>
                        </div>
                        <h5 style={{ fontSize: '0.88rem', fontWeight: 600, marginTop: '0.25rem' }}>{wo.title}</h5>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          PIC: <strong>{wo.pic || wo.assignedTo}</strong> • Dibutuhkan: <strong>{wo.neededDate || wo.dueDate || 'Segera'}</strong>
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                        <span className={`badge ${
                          wo.status === 'Completed' || wo.status === 'Diterima di Kapal (Selesai)' ? 'badge-success' :
                          wo.status === 'Disetujui Gudang' || wo.status === 'Disetujui Nakhoda' ? 'badge-info' :
                          wo.status === 'Overdue' || wo.status === 'Urgent' ? 'badge-danger-pulse' :
                          'badge-warning'
                        }`}>
                          {wo.status}
                        </span>
                        {wo.status === 'Overdue' && (
                          <button
                            onClick={() => sendWhatsAppReminder(wo, 'work_order')}
                            className="btn btn-whatsapp btn-sm"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                          >
                            Alert WA
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Urgent BKI Certificates */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f87171' }}>
                  Survei BKI Butuh Perhatian
                </h4>
                <button onClick={() => setActiveSubTab('documents')} className="btn btn-secondary btn-sm">
                  Daftar Survei ({shipDocs.length})
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {urgentCerts.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
                    <p>Seluruh sertifikat survei kapal ini dalam status Aktif.</p>
                  </div>
                ) : (
                  urgentCerts.slice(0, 4).map(item => (
                    <div
                      key={item.id}
                      style={{
                        padding: '0.85rem',
                        borderRadius: '8px',
                        background: item.status === 'Expired' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                        border: item.status === 'Expired' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className={`badge ${item.status === 'Expired' ? 'badge-danger-pulse' : 'badge-warning'}`} style={{ fontSize: '0.68rem' }}>
                            {item.status}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {item.category || item.type}
                          </span>
                        </div>
                        <h5 style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem' }}>{item.name}</h5>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Jatuh Tempo: <strong className="mono" style={{ color: '#fff' }}>{item.expiryDate}</strong> ({item.daysUntilExpiry > 0 ? `${item.daysUntilExpiry} hari lagi` : `LEWAT ${Math.abs(item.daysUntilExpiry)} HARI!`})
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          onClick={() => openGoogleCalendar(item)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem' }}
                          title="Sinkron G-Cal"
                        >
                          <CalendarPlus size={13} />
                        </button>
                        <button
                          onClick={() => sendWhatsAppReminder(item, item.crewName ? 'crew_cert' : 'ship_doc')}
                          className="btn btn-whatsapp btn-sm"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }}
                        >
                          WA
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DATA PARTICULAR KAPAL (SHIP PARTICULARS) */}
      {activeSubTab === 'particulars' && (
        <ShipParticularsView
          vessel={currentShip}
          onEdit={() => setShowParticularsModal(true)}
          theme={theme}
        />
      )}

      {/* SUB-TAB 3: AWAK KAPAL (CREW ROSTER) */}
      {activeSubTab === 'crew' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                Susunan Kru & Perwira Kapal: {currentShip.name}
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Roster resmi personel yang bertugas onboard, data buku pelaut, masa kontrak, dan sertifikat kompetensi STCW
              </p>
            </div>

            <button onClick={() => setShowAddCrewModal(true)} className="btn btn-primary btn-sm">
              <Plus size={14} />
              <span>Tambah Kru ke Kapal Ini</span>
            </button>
          </div>

          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div className="table-container">
              <table className="pms-table">
                <thead>
                  <tr>
                    <th>Foto & Nama Awak</th>
                    <th>Jabatan (Rank)</th>
                    <th>Departemen</th>
                    <th>Nomor Buku Pelaut</th>
                    <th>Sign On / Sign Off</th>
                    <th>Sisa Cuti</th>
                    <th>Status Tugas</th>
                    <th style={{ textAlign: 'right' }}>Kontak & WhatsApp</th>
                  </tr>
                </thead>
                <tbody>
                  {shipCrew.map(c => {
                    const cCert = shipCrewCerts.find(cert => cert.crewId === c.id);
                    return (
                      <tr key={c.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img
                              src={c.photo}
                              alt={c.name}
                              style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(56, 189, 248, 0.3)' }}
                            />
                            <div>
                              <strong style={{ fontSize: '0.92rem' }}>{c.name}</strong>
                              {cCert && (
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                                  {cCert.name}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                            {c.rank}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: c.department === 'Deck' ? '#38bdf8' : '#fb923c' }}>
                            {c.department}
                          </span>
                        </td>
                        <td className="mono" style={{ fontSize: '0.8rem' }}>{c.seamanBookNo}</td>
                        <td style={{ fontSize: '0.8rem' }}>
                          <div>On: <strong className="mono">{c.signOnDate}</strong></div>
                          <div style={{ color: 'var(--text-muted)' }}>Off: <strong className="mono">{c.signOffPlanDate}</strong></div>
                        </td>
                        <td className="mono" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                          {c.leaveBalanceDays} Hari
                        </td>
                        <td>
                          <span className={`badge ${c.status === 'Onboard' ? 'badge-success' : 'badge-warning'}`}>
                            {c.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => {
                              const msg = `*PEMBERITAHUAN PMS KAPAL - ${currentShip.name}*\n\nYth. *${c.name}* (${c.rank}),\nHarap koordinasikan agenda perawatan rutin dan dokumen kelaiklautan kapal.\n\n_Admin Armada PT. Pelayaran Baharimas Kalimantan_`;
                              window.open(`https://wa.me/${c.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                            }}
                            className="btn btn-whatsapp btn-sm"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                          >
                            <Send size={13} />
                            <span>WhatsApp</span>
                          </button>
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

      {/* SUB-TAB 3: SERTIFIKAT & DOKUMEN KAPAL (BKI, STATUTORY, ASURANSI, KSOP, KESEHATAN) */}
      {activeSubTab === 'documents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                Sertifikat & Dokumen Legal Kapal: {currentShip.name}
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Manajemen sertifikasi kelaikan laut kapal (BKI, Statutory, Asuransi, KSOP, dan Kesehatan) sesuai checklist standar.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  setEditingShipDoc(null);
                  setShowAddDocModal(true);
                }}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Plus size={14} />
                <span>Tambah Sertifikat Baru</span>
              </button>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => setShipDocCatFilter('ALL')}
              className={`btn btn-sm ${shipDocCatFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.78rem', fontWeight: 600 }}
            >
              Semua ({shipDocs.length})
            </button>
            {(certificateCategories || []).map(cat => {
              const count = shipDocs.filter(d => d.category === cat.id).length;
              const isActive = shipDocCatFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setShipDocCatFilter(cat.id)}
                  className="btn btn-sm"
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    background: isActive ? cat.badgeColor : 'var(--bg-card)',
                    color: isActive ? '#fff' : 'var(--text-main)',
                    border: `1px solid ${isActive ? cat.badgeColor : 'var(--border-glass)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>{cat.label}</span>
                  <span
                    className="badge"
                    style={{
                      fontSize: '0.65rem',
                      background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                      color: isActive ? '#fff' : 'var(--text-muted)'
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div className="table-container">
              <table className="pms-table">
                <thead>
                  <tr>
                    <th>Kategori</th>
                    <th>Nama Sertifikat & Deskripsi</th>
                    <th>Surveyor / Auditor</th>
                    <th>Nomor Dokumen</th>
                    <th>Instansi Penerbit</th>
                    <th>Tgl Penerbitan</th>
                    <th>Tgl Expired</th>
                    <th>Berkas File</th>
                    <th>Status Kelaikan</th>
                    <th style={{ textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {shipDocs
                    .filter(d => shipDocCatFilter === 'ALL' || d.category === shipDocCatFilter)
                    .map(d => {
                      const isExpired = d.status === 'Expired' || (d.daysUntilExpiry !== undefined && d.daysUntilExpiry <= 0);
                      const isH30 = d.daysUntilExpiry !== undefined && d.daysUntilExpiry > 0 && d.daysUntilExpiry <= 30;

                      return (
                        <tr key={d.id} style={{ background: isExpired ? 'rgba(239, 68, 68, 0.04)' : isH30 ? 'rgba(245, 158, 11, 0.03)' : undefined }}>
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
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                                Catatan daftar: {d.rawNote}
                              </div>
                            )}
                            {d.notificationReminders && d.notificationReminders.enabled !== false && (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.2rem' }}>
                                <span className="badge" style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem', background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }} title="Interval Pengingat Expired Aktif">
                                  🔔 {d.notificationReminders.year?.enabled ? `${d.notificationReminders.year.value}Th ` : ''}
                                  {d.notificationReminders.month?.enabled ? `${d.notificationReminders.month.value}Bl ` : ''}
                                  {d.notificationReminders.week?.enabled ? `${d.notificationReminders.week.value}Mg ` : ''}
                                  {d.notificationReminders.day?.enabled ? `${d.notificationReminders.day.value}Hr` : ''}
                                </span>
                              </div>
                            )}
                          </td>
                          <td style={{ minWidth: '160px' }}>
                            {d.mandatoryAuditor ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                <span style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '6px',
                                  background: 'rgba(56, 189, 248, 0.15)',
                                  color: '#38bdf8',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0
                                }}>
                                  <UserCheck size={13} />
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
                          <td>
                            <div className="mono" style={{ fontSize: '0.825rem', color: 'var(--text-main)', fontWeight: 600 }}>
                              {d.issueDate || '-'}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                              Penerbitan
                            </div>
                          </td>
                          <td>
                            <strong className="mono" style={{ fontSize: '0.85rem', color: isExpired ? '#ef4444' : isH30 ? '#f59e0b' : '#10b981' }}>
                              {d.expiryDate}
                            </strong>
                            <div style={{ fontSize: '0.72rem', color: isExpired ? '#ef4444' : isH30 ? '#f59e0b' : 'var(--text-subtle)', fontWeight: isH30 ? 600 : 400 }}>
                              {d.daysUntilExpiry > 0 ? `${d.daysUntilExpiry} hari lagi` : `LEWAT ${Math.abs(d.daysUntilExpiry)} HARI!`}
                            </div>
                          </td>
                          <td>
                            {d.fileUrl ? (
                              <button
                                type="button"
                                onClick={() => setPreviewDoc(d)}
                                className="badge badge-info"
                                style={{
                                  fontSize: '0.7rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  cursor: 'pointer',
                                  padding: '0.2rem 0.5rem',
                                  border: 'none',
                                  background: 'rgba(56, 189, 248, 0.15)',
                                  color: '#38bdf8'
                                }}
                                title={d.fileName ? `Lihat berkas: ${d.fileName}` : 'Lihat Berkas Scan'}
                              >
                                <FileText size={11} />
                                <span>{d.fileName ? (d.fileName.length > 12 ? d.fileName.substring(0, 10) + '...' : d.fileName) : 'Lihat Berkas'}</span>
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Belum ada</span>
                            )}
                          </td>
                          <td>
                            <span className={`badge ${isExpired ? 'badge-danger-pulse' : isH30 ? 'badge-warning' : 'badge-success'}`}>
                              {d.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem', alignItems: 'center' }}>
                              <button
                                onClick={() => setEditingShipDoc(d)}
                                className="btn btn-secondary btn-sm"
                                title="Edit Data & Tanggal Dokumen Ini"
                                style={{ padding: '0.35rem 0.55rem' }}
                              >
                                <Edit2 size={13} />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => openGoogleCalendar(d)}
                                className="btn btn-secondary btn-sm"
                                title="Sinkron ke Google Calendar"
                                style={{ padding: '0.35rem 0.55rem', color: '#38bdf8' }}
                              >
                                <CalendarPlus size={13} />
                                <span>G-Cal</span>
                              </button>
                              <button
                                onClick={() => sendWhatsAppReminder(d, 'ship_doc')}
                                className="btn btn-whatsapp btn-sm"
                                title="Kirim Peringatan WhatsApp"
                                style={{ padding: '0.35rem 0.55rem' }}
                              >
                                <Send size={13} />
                                <span>WA</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Hapus sertifikat "${d.name}" (${d.documentNo}) dari ${currentShip.name}?`)) {
                                    deleteShipDocument(d.id);
                                  }
                                }}
                                className="btn btn-secondary btn-sm"
                                title="Hapus Dokumen"
                                style={{ padding: '0.35rem 0.55rem', color: '#ef4444' }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  {shipDocs.filter(d => shipDocCatFilter === 'ALL' || d.category === shipDocCatFilter).length === 0 && (
                    <tr>
                      <td colSpan="10" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                        <FileCheck size={36} color="var(--text-subtle)" style={{ margin: '0 auto 0.75rem' }} />
                        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Tidak ada sertifikat dalam kategori ini.</p>
                        <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Klik "Tambah Sertifikat Baru" untuk mencatat sertifikat baru untuk kapal ini.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: EQUIPMENT & JAM MESIN */}
      {activeSubTab === 'equipment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                Equipment & Jam Operasi Mesin: {currentShip.name}
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Daftar permesinan utama, genset, sistem jangkar/towing, dan pemantauan running hours kapal ini
              </p>
            </div>
          </div>

          <div className="grid-cols-2">
            {shipEquipment.map(eq => {
              const hoursLeft = eq.nextServiceHours - eq.runningHours;
              const percentageUsed = Math.min(100, Math.round((eq.runningHours / eq.nextServiceHours) * 100));

              return (
                <div
                  key={eq.id}
                  className="glass-card"
                  style={{
                    padding: '1.25rem',
                    border: eq.status === 'Overdue' ? '1px solid rgba(239, 68, 68, 0.4)' : undefined
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="mono" style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>
                          {eq.code}
                        </span>
                        <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                          {eq.category}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.25rem' }}>{eq.name}</h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Model: <strong>{eq.model}</strong> • S/N: <span className="mono">{eq.serialNumber}</span>
                      </p>
                    </div>

                    <span className={`badge ${
                      eq.status === 'Overdue' ? 'badge-danger-pulse' :
                      eq.status === 'Due Soon' ? 'badge-warning' : 'badge-success'
                    }`}>
                      {eq.status}
                    </span>
                  </div>

                  {/* Subcomponents */}
                  {eq.subComponents && (
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                      {eq.subComponents.map((sub, sIdx) => (
                        <span key={sIdx} className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Hours Bar */}
                  <div style={{ marginTop: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Jam Kerja Aktual: <strong className="mono" style={{ color: '#fff' }}>{eq.runningHours?.toLocaleString()} Jam</strong></span>
                      <span style={{ color: 'var(--text-muted)' }}>Target Servis: <strong className="mono">{eq.nextServiceHours?.toLocaleString()} Jam</strong></span>
                    </div>
                    <div className="progress-bar-container">
                      <div
                        className={`progress-bar-fill ${
                          eq.status === 'Overdue' ? 'progress-red' :
                          eq.status === 'Due Soon' ? 'progress-amber' : 'progress-blue'
                        }`}
                        style={{ width: `${percentageUsed}%` }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.78rem', color: hoursLeft <= 0 ? '#ef4444' : '#f59e0b', fontWeight: 600 }}>
                        {hoursLeft <= 0 ? `Overdue ${Math.abs(hoursLeft)} Jam Operasional!` : `Tersisa ${hoursLeft} Jam Menuju Servis`}
                      </span>
                      <button
                        onClick={() => setSelectedEqForHours(eq)}
                        className="btn btn-secondary btn-sm"
                      >
                        <Clock size={13} />
                        <span>Log Jam Mesin</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: PERMINTAAN BARANG KE GUDANG (MATERIAL REQUISITION) */}
      {activeSubTab === 'workorders' && (() => {
        const totalShipReqs = shipWOs.length;
        const kapalReqs = shipWOs.filter(w => (w.mainCategory || w.category) !== 'Kebutuhan Crew');
        const crewReqs = shipWOs.filter(w => (w.mainCategory || w.category) === 'Kebutuhan Crew');
        const pendingReqs = shipWOs.filter(w => !['Completed', 'Diterima di Kapal (Selesai)', 'Diterima di Kapal'].includes(w.status));

        const filteredShipReqs = shipWOs.filter(wo => {
          // Category Filter
          if (reqCategoryFilter === 'KAPAL' && (wo.mainCategory || wo.category) === 'Kebutuhan Crew') return false;
          if (reqCategoryFilter === 'CREW' && (wo.mainCategory || wo.category) !== 'Kebutuhan Crew') return false;

          // Status Filter
          if (reqStatusFilter === 'PENDING' && ['Completed', 'Diterima di Kapal (Selesai)', 'Diterima di Kapal'].includes(wo.status)) return false;
          if (reqStatusFilter === 'APPROVED' && !['Disetujui Nakhoda', 'Disetujui Gudang', 'Disetujui Logistik & Gudang'].includes(wo.status)) return false;
          if (reqStatusFilter === 'COMPLETED' && !['Completed', 'Diterima di Kapal (Selesai)', 'Diterima di Kapal'].includes(wo.status)) return false;

          // Search Filter
          if (reqSearchQuery.trim()) {
            const q = reqSearchQuery.toLowerCase();
            const titleMatch = (wo.title || '').toLowerCase().includes(q);
            const idMatch = (wo.id || '').toLowerCase().includes(q);
            const picMatch = (wo.pic || wo.assignedTo || '').toLowerCase().includes(q);
            const itemsMatch = getRequisitionItems(wo).some(it => (it.name || '').toLowerCase().includes(q));
            if (!titleMatch && !idMatch && !picMatch && !itemsMatch) return false;
          }

          return true;
        });

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <ShoppingBag size={22} color="#38bdf8" />
                  <span>Permintaan Barang ke Gudang: {currentShip.name}</span>
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Daftar pengajuan kebutuhan kapal & crew, status approval gudang logistik, dan cetak Surat Permintaan Barang (SPB)
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedWOForModal(null);
                  setShowNewWOModal(true);
                }}
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
              >
                <Plus size={15} />
                <span>+ Ajukan Permintaan Barang Baru</span>
              </button>
            </div>

            {/* 4 Mini Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="glass-card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #38bdf8' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Pengajuan</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.25rem' }}>
                  {totalShipReqs} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Dokumen</span>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #6366f1' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>🚢 Kebutuhan Kapal</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#818cf8', marginTop: '0.25rem' }}>
                  {kapalReqs.length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Permintaan</span>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #10b981' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>👥 Kebutuhan Crew</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399', marginTop: '0.25rem' }}>
                  {crewReqs.length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Permintaan</span>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #f59e0b' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>⏳ Menunggu Gudang</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.25rem' }}>
                  {pendingReqs.length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Pending</span>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="glass-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {/* Category Filters */}
                <button
                  onClick={() => setReqCategoryFilter('ALL')}
                  className={`btn btn-sm ${reqCategoryFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                >
                  Semua Kategori ({totalShipReqs})
                </button>
                <button
                  onClick={() => setReqCategoryFilter('KAPAL')}
                  className={`btn btn-sm ${reqCategoryFilter === 'KAPAL' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                >
                  🚢 Kebutuhan Kapal ({kapalReqs.length})
                </button>
                <button
                  onClick={() => setReqCategoryFilter('CREW')}
                  className={`btn btn-sm ${reqCategoryFilter === 'CREW' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                >
                  👥 Kebutuhan Crew ({crewReqs.length})
                </button>

                <span style={{ color: 'var(--border-subtle)', margin: '0 0.25rem' }}>|</span>

                {/* Status Filter Dropdown */}
                <select
                  value={reqStatusFilter}
                  onChange={(e) => setReqStatusFilter(e.target.value)}
                  className="select-control"
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem', height: '34px', width: '160px' }}
                >
                  <option value="ALL">Semua Status</option>
                  <option value="PENDING">⏳ Menunggu Gudang</option>
                  <option value="APPROVED">⚓ Disetujui</option>
                  <option value="COMPLETED">✅ Selesai / Diterima</option>
                </select>
              </div>

              {/* Search Box */}
              <div style={{ position: 'relative', minWidth: '240px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Cari barang, no. SPB, PIC..."
                  value={reqSearchQuery}
                  onChange={(e) => setReqSearchQuery(e.target.value)}
                  className="input-control"
                  style={{ paddingLeft: '2rem', height: '34px', fontSize: '0.8rem', width: '100%' }}
                />
              </div>
            </div>

            {/* List of Material Requisitions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredShipReqs.length === 0 ? (
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <CheckCircle size={40} color="#10b981" style={{ margin: '0 auto 0.75rem' }} />
                  <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>Tidak Ada Permintaan Barang</h4>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    {reqSearchQuery || reqCategoryFilter !== 'ALL' || reqStatusFilter !== 'ALL'
                      ? 'Tidak ditemukan data pengajuan barang yang sesuai dengan filter pencarian.'
                      : 'Belum ada pengajuan kebutuhan barang ke gudang untuk kapal ini.'}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedWOForModal(null);
                      setShowNewWOModal(true);
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: '1rem' }}
                  >
                    <Plus size={14} />
                    <span>Ajukan Permintaan Sekarang</span>
                  </button>
                </div>
              ) : (
                filteredShipReqs.map(wo => {
                  const reqItems = getRequisitionItems(wo);
                  const isCrew = (wo.mainCategory || wo.category) === 'Kebutuhan Crew';

                  return (
                    <div key={wo.id} className="glass-card" style={{ padding: '1.5rem' }}>
                      {/* Top Row: Meta Badges & Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                            <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>
                              {wo.id}
                            </span>
                            <span className={`badge ${
                              wo.priority === 'Sangat Tinggi' || wo.priority === 'Tinggi' || wo.priority === 'Urgent / Darurat'
                                ? 'badge-danger'
                                : wo.priority === 'Penting (Segera)' || wo.priority === 'Penting'
                                ? 'badge-warning'
                                : 'badge-info'
                            }`}>
                              {wo.priority}
                            </span>
                            <span
                              className="badge"
                              style={{
                                background: isCrew ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                                color: isCrew ? '#34d399' : '#818cf8',
                                border: isCrew ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
                                fontWeight: 700
                              }}
                            >
                              {isCrew ? '👥 Kebutuhan Crew' : '🚢 Kebutuhan Kapal'}
                            </span>
                            {wo.subCategory && (
                              <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                                {wo.subCategory}
                              </span>
                            )}
                          </div>

                          <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '0.5rem', color: '#f8fafc' }}>
                            {wo.title || 'Pengajuan Kebutuhan Barang Gudang'}
                          </h4>

                          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            PIC / Pemohon: <strong>{wo.pic || wo.assignedTo}</strong> • Mengetahui: <strong>{wo.captain || wo.supervisor || currentShip.masterCaptain || 'Capt. Hendra Gunawan, M.Mar'}</strong> • Tgl Permintaan: <strong>{wo.requestDate || wo.dueDate || '-'}</strong> • Target Dibutuhkan: <strong>{wo.neededDate || wo.dueDate || 'Segera'}</strong>
                          </p>
                          {wo.deliveryLocation && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.15rem' }}>
                              📍 Titik Penyerahan: {wo.deliveryLocation}
                            </p>
                          )}
                        </div>

                        {/* Action Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                          <select
                            value={wo.status}
                            onChange={(e) => updateWorkOrderStatus(wo.id, e.target.value)}
                            className="select-control"
                            style={{ width: '160px', fontSize: '0.8rem', fontWeight: 600 }}
                          >
                            <option value="Diajukan">Diajukan</option>
                            <option value="Disetujui Nakhoda">Disetujui Nakhoda</option>
                            <option value="Disetujui Gudang">Disetujui Gudang</option>
                            <option value="Sedang Dikirim">Sedang Dikirim</option>
                            <option value="Diterima di Kapal (Selesai)">Diterima di Kapal (Selesai)</option>
                            <option value="Ditolak Gudang">Ditolak Gudang</option>
                          </select>

                          {/* Print / View SPB Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedWOForModal(wo)}
                            className="btn btn-secondary btn-sm"
                            title="Lihat & Cetak Surat Permintaan Barang Resmi"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}
                          >
                            <Printer size={13} color="#38bdf8" />
                            <span>Lihat / Cetak SPB</span>
                          </button>

                          {/* Send WhatsApp to Warehouse Button */}
                          <button
                            type="button"
                            onClick={() => handleSendWAtoWarehouse(wo)}
                            className="btn btn-whatsapp btn-sm"
                            title="Kirim notifikasi daftar barang ke WA Gudang Logistik"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                          >
                            <Send size={13} />
                            <span>Kirim WA Gudang</span>
                          </button>
                        </div>
                      </div>

                      {/* DAFTAR BARANG YANG DIMINTA KE GUDANG (TABLE) */}
                      <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Package size={15} />
                            <span>DAFTAR BARANG YANG DIMINTA KE GUDANG ({reqItems.length} ITEM):</span>
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            Klik status untuk menandai barang telah tiba di kapal
                          </span>
                        </div>

                        {reqItems.length === 0 ? (
                          <div style={{ padding: '0.75rem', background: 'var(--bg-surface-elevated)', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                            Belum ada rincian item barang spesifik pada pengajuan ini.
                          </div>
                        ) : (
                          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                              <thead>
                                <tr style={{ background: 'rgba(15, 23, 42, 0.7)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                                  <th style={{ padding: '0.6rem 0.75rem', width: '45px', textAlign: 'center' }}>NO</th>
                                  <th style={{ padding: '0.6rem 0.75rem' }}>NAMA BARANG & SPESIFIKASI</th>
                                  <th style={{ padding: '0.6rem 0.75rem', width: '130px' }}>JUMLAH</th>
                                  <th style={{ padding: '0.6rem 0.75rem' }}>KETERANGAN / KEPERLUAN</th>
                                  <th style={{ padding: '0.6rem 0.75rem', width: '150px', textAlign: 'center' }}>STATUS DI KAPAL</th>
                                </tr>
                              </thead>
                              <tbody>
                                {reqItems.map((it, idx) => (
                                  <tr
                                    key={it.id || idx}
                                    style={{
                                      borderBottom: idx < reqItems.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                                      background: it.received ? 'rgba(16, 185, 129, 0.05)' : 'transparent'
                                    }}
                                  >
                                    <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)' }}>
                                      {idx + 1}
                                    </td>
                                    <td style={{ padding: '0.6rem 0.75rem' }}>
                                      <strong style={{ color: it.received ? 'var(--text-muted)' : '#f8fafc', textDecoration: it.received ? 'line-through' : 'none' }}>
                                        {it.name}
                                      </strong>
                                    </td>
                                    <td style={{ padding: '0.6rem 0.75rem' }}>
                                      <span className="badge badge-info" style={{ fontWeight: 700 }}>
                                        {it.qty} {it.unit}
                                      </span>
                                    </td>
                                    <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)' }}>
                                      {it.notes || '-'}
                                    </td>
                                    <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>
                                      <button
                                        type="button"
                                        onClick={() => toggleChecklist(wo.id, it.id)}
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '0.35rem',
                                          padding: '0.25rem 0.55rem',
                                          borderRadius: '6px',
                                          fontSize: '0.72rem',
                                          cursor: 'pointer',
                                          background: it.received ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-surface-elevated)',
                                          border: it.received ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                                          color: it.received ? '#10b981' : 'var(--text-muted)'
                                        }}
                                      >
                                        {it.received ? <CheckSquare size={13} /> : <Square size={13} />}
                                        <span>{it.received ? 'Diterima ✓' : 'Belum Tiba'}</span>
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      {/* Footer: 3-Way Signature Verification */}
                      <div style={{
                        marginTop: '1rem',
                        paddingTop: '0.85rem',
                        borderTop: '1px dashed var(--border-subtle)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '0.75rem',
                        fontSize: '0.75rem'
                      }}>
                        <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>✍️ Pemohon / PIC:</div>
                          <strong style={{ color: '#38bdf8' }}>{wo.pic || wo.assignedTo}</strong>
                          <div style={{ fontSize: '0.68rem', color: '#10b981', marginTop: '0.15rem' }}>✓ Telah Diajukan</div>
                        </div>

                        <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '6px', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>⚓ Mengetahui (Nakhoda):</div>
                          <strong style={{ color: '#818cf8' }}>{wo.captain || wo.supervisor || currentShip.masterCaptain || 'Capt. Hendra Gunawan, M.Mar'}</strong>
                          <div style={{ fontSize: '0.68rem', color: '#10b981', marginTop: '0.15rem' }}>✓ Disetujui & Distempel Kapal</div>
                        </div>

                        <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>🏢 Logistik Gudang PBK:</div>
                          <strong style={{ color: '#10b981' }}>Gudang Logistik Pontianak (Shore Base PBK)</strong>
                          <div style={{ fontSize: '0.68rem', color: ['Completed', 'Diterima di Kapal (Selesai)', 'Diterima di Kapal'].includes(wo.status) ? '#10b981' : '#f59e0b', marginTop: '0.15rem' }}>
                            {['Completed', 'Diterima di Kapal (Selesai)', 'Diterima di Kapal'].includes(wo.status) ? '✓ Selesai & Diterima di Kapal' : '⏳ Dalam Proses Gudang'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })()}

      {/* SUB-TAB 6: INVENTARIS SPAREPARTS */}
      {activeSubTab === 'spareparts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                Inventaris Suku Cadang Kapal: {currentShip.name}
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Stok sparepart yang tersimpan di gudang penyimpanan (store room) kapal ini
              </p>
            </div>
          </div>

          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div className="table-container">
              <table className="pms-table">
                <thead>
                  <tr>
                    <th>Kode Part</th>
                    <th>Nama Sparepart</th>
                    <th>Peruntukan Mesin</th>
                    <th>Lokasi Rak / Store</th>
                    <th>Stok Aktual</th>
                    <th>Min. Stok</th>
                    <th>Status Stok</th>
                    <th>Pemasok (Vendor)</th>
                  </tr>
                </thead>
                <tbody>
                  {shipParts.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        Belum ada data inventaris khusus yang dialokasikan di store room kapal ini.
                      </td>
                    </tr>
                  ) : (
                    shipParts.map(sp => (
                      <tr key={sp.id}>
                        <td className="mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8' }}>{sp.code}</td>
                        <td><strong style={{ fontSize: '0.9rem' }}>{sp.name}</strong></td>
                        <td className="mono" style={{ fontSize: '0.8rem' }}>{sp.equipmentCode || '-'}</td>
                        <td style={{ fontSize: '0.825rem' }}>{sp.location}</td>
                        <td className="mono" style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                          {sp.stockQty} {sp.unit}
                        </td>
                        <td className="mono" style={{ fontSize: '0.85rem' }}>
                          {sp.minStockQty} {sp.unit}
                        </td>
                        <td>
                          <span className={`badge ${
                            sp.status === 'Critical' ? 'badge-danger-pulse' :
                            sp.status === 'Low Stock' ? 'badge-warning' : 'badge-success'
                          }`}>
                            {sp.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sp.supplier}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 8: AUDIT SMC KAPAL */}
      {activeSubTab === 'audit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header & Status Card */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8' }}>
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Audit Safety Management Certificate (SMC) - {currentShip.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Monitoring temuan ketidaksesuaian ISM Code, bukti perbaikan eviden, dan status NC Open / NC Close kapal ini
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('audit')}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem' }}
            >
              <span>Buka Modul Audit Lengkap (DOC & SMC)</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Quick Stats for this Vessel */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div className="glass-card" style={{ padding: '1.15rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Temuan SMC</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.35rem' }}>
                {shipAuditFindings.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-subtle)' }}>Temuan</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Tercatat pada sesi audit internal & eksternal kapal
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.15rem', border: shipOpenNC > 0 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.8rem', color: shipOpenNC > 0 ? '#f87171' : 'var(--text-muted)', fontWeight: 700 }}>NC Open (Perlu Perbaikan)</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: shipOpenNC > 0 ? '#ef4444' : '#10b981', marginTop: '0.35rem' }}>
                {shipOpenNC} <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Temuan</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: shipOpenNC > 0 ? '#fca5a5' : 'var(--text-muted)', marginTop: '0.2rem' }}>
                {shipOpenNC > 0 ? 'Membutuhkan tindakan korektif & eviden' : 'Nol temuan terbuka (All Complied)'}
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.15rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>NC Close (Terverifikasi)</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginTop: '0.35rem' }}>
                {shipClosedNC} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-subtle)' }}>Temuan</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Telah ditutup & disetujui Lead Auditor / DPA
              </p>
            </div>
          </div>

          {/* Findings Table */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                Daftar Temuan Audit ISM Code Kapal {currentShip.name}
              </h4>
              <button
                onClick={() => {
                  setVesselReportSession({
                    vesselId: currentShip.id,
                    targetName: currentShip.name,
                    standard: 'SMC',
                    auditNo: `AUD-EXT-SMC-BKI-2026/04`,
                    status: 'Completed',
                    leadAuditor: 'Surveyor BKI Cabang Pontianak (Auditor Eksternal ISM Hubla)',
                    auditee: `Capt. Hendra Gunawan, M.Mar & Ir. Bambang Wijaya (KKM ${currentShip.name})`,
                    auditDate: '2026-07-20'
                  });
                }}
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.76rem', fontWeight: 700, color: '#0284c7' }}
                title="Cetak Laporan Hasil Audit ISM Code Kapal Ini (Standar A4)"
              >
                <Printer size={13} color="#0284c7" />
                <span>🖨️ Cetak Laporan Audit Kapal</span>
              </button>
            </div>

            {shipAuditFindings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={44} color="#10b981" style={{ margin: '0 auto 0.75rem' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Tidak Ada Temuan NC Terbuka untuk Kapal Ini
                </h4>
                <p style={{ fontSize: '0.825rem', marginTop: '0.3rem', maxWidth: '420px', margin: '0.3rem auto 1.25rem' }}>
                  Implementasi ISM Code dan pemeliharaan alat keselamatan di atas kapal berjalan sesuai prosedur SMS PT. Pelayaran Baharimas Kalimantan.
                </p>
                <button
                  onClick={() => setActiveTab('audit')}
                  className="btn btn-secondary btn-sm"
                >
                  Buka Modul Audit untuk Catat Temuan Baru
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>No. Temuan</th>
                      <th>Klausul ISM</th>
                      <th>Kategori</th>
                      <th>Deskripsi Ketidaksesuaian</th>
                      <th>Jatuh Tempo</th>
                      <th>Status NC</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipAuditFindings.map(finding => (
                      <tr key={finding.id}>
                        <td>
                          <span className="mono" style={{ fontWeight: 700, color: '#38bdf8' }}>
                            {finding.findingNo}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', display: 'block' }}>
                            {finding.auditType} SMC
                          </span>
                        </td>
                        <td>
                          <span className="mono" style={{ fontWeight: 700, fontSize: '0.75rem' }}>
                            {finding.clauseCode}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                            {finding.clauseName}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            finding.category === 'Major NC' ? 'badge-danger-pulse' :
                            finding.category === 'Minor NC' ? 'badge-warning' : 'badge-info'
                          }`}>
                            {finding.category}
                          </span>
                        </td>
                        <td style={{ maxWidth: '280px', fontSize: '0.8rem', lineHeight: '1.4' }}>
                          {finding.description}
                        </td>
                        <td className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {finding.dueDate}
                        </td>
                        <td>
                          <span className={`badge ${
                            finding.status === 'NC Close' ? 'badge-success' :
                            finding.status === 'Eviden Submitted' ? 'badge-warning' : 'badge-danger'
                          }`}>
                            {finding.status}
                          </span>
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                            {finding.status === 'NC Close' && (
                              <button
                                onClick={() => setVesselReportFinding(finding)}
                                className="btn btn-secondary btn-sm"
                                style={{
                                  fontSize: '0.72rem',
                                  padding: '0.25rem 0.55rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  color: '#0284c7',
                                  fontWeight: 700
                                }}
                                title="Cetak Lembar Verifikasi Penutupan NC Resmi (NCR Close-Out Form Standar BKI)"
                              >
                                <Printer size={12} color="#0284c7" />
                                <span>Cetak NCR</span>
                              </button>
                            )}
                            <button
                              onClick={() => setActiveTab('audit')}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
                            >
                              <span>Kelola Eviden</span>
                              <ChevronRight size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Tambah Kru ke Kapal Ini */}
      {showAddCrewModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '580px', padding: '1.75rem', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              Tambah Awak Baru: {currentShip.name}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Daftarkan perwira atau ABK yang mulai bertugas (Sign On) di kapal ini
            </p>

            <form onSubmit={handleCreateCrew} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="field-label">Nama Lengkap Awak *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Capt. Bambang Suherman"
                  value={newCrewData.name}
                  onChange={(e) => setNewCrewData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Jabatan (Rank)</label>
                  <select
                    value={newCrewData.rank}
                    onChange={(e) => setNewCrewData(prev => ({ ...prev, rank: e.target.value }))}
                    className="select-control"
                  >
                    <option value="Nakhoda (Master)">Nakhoda (Master)</option>
                    <option value="Chief Engineer (KKM)">Chief Engineer (KKM)</option>
                    <option value="Chief Officer (Mualim 1)">Chief Officer (Mualim 1)</option>
                    <option value="Second Engineer (Masinis 2)">Second Engineer (Masinis 2)</option>
                    <option value="Bosun (Kepala Kelasi)">Bosun (Kepala Kelasi)</option>
                    <option value="Juru Mudi / ABK">Juru Mudi / ABK</option>
                    <option value="Oiler (Juru Minyak)">Oiler (Juru Minyak)</option>
                    <option value="Barge Master">Barge Master</option>
                    <option value="Teknisi Tongkang / Juru Mesin">Teknisi Tongkang / Juru Mesin</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Departemen</label>
                  <select
                    value={newCrewData.department}
                    onChange={(e) => setNewCrewData(prev => ({ ...prev, department: e.target.value }))}
                    className="select-control"
                  >
                    <option value="Deck">Deck</option>
                    <option value="Engine">Engine</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Nomor Buku Pelaut (Seaman Book)</label>
                  <input
                    type="text"
                    placeholder="Contoh: B-449120-ID"
                    value={newCrewData.seamanBookNo}
                    onChange={(e) => setNewCrewData(prev => ({ ...prev, seamanBookNo: e.target.value }))}
                    className="input-control"
                  />
                </div>
                <div>
                  <label className="field-label">Nomor WhatsApp</label>
                  <input
                    type="text"
                    placeholder="Contoh: 081288991122"
                    value={newCrewData.phone}
                    onChange={(e) => setNewCrewData(prev => ({ ...prev, phone: e.target.value, whatsapp: `+62${e.target.value.replace(/^0/, '')}` }))}
                    className="input-control"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button type="button" onClick={() => setShowAddCrewModal(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Kru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tambah & Edit Sertifikat (BKI, Statutory, Asuransi, KSOP, Kesehatan) */}
      <DocumentFormModal
        isOpen={showAddDocModal || !!editingShipDoc}
        onClose={() => {
          setShowAddDocModal(false);
          setEditingShipDoc(null);
        }}
        initialData={editingShipDoc}
        vessels={vessels}
        defaultVesselId={currentShip.id}
        onSave={(docData) => {
          if (editingShipDoc) {
            updateShipDocument(editingShipDoc.id, docData);
          } else {
            addShipDocument({
              ...docData,
              vesselId: currentShip.id
            });
          }
          setShowAddDocModal(false);
          setEditingShipDoc(null);
        }}
      />

      {/* Existing Modals */}
      {selectedEqForHours && (
        <RunningHoursModal
          equipment={selectedEqForHours}
          onClose={() => setSelectedEqForHours(null)}
        />
      )}

      {(showNewWOModal || selectedWOForModal) && (
        <WorkOrderModal
          workOrder={selectedWOForModal}
          vesselId={currentShip.id}
          onClose={() => {
            setShowNewWOModal(false);
            setSelectedWOForModal(null);
          }}
        />
      )}

      {/* Edit Vessel Particulars Modal */}
      {showParticularsModal && (
        <ParticularsModal
          vessel={currentShip}
          isOpen={showParticularsModal}
          onClose={() => setShowParticularsModal(false)}
          onSave={(shipId, updatedData) => {
            updateVesselParticulars(shipId, updatedData);
          }}
        />
      )}

      {/* Edit Vessel Photo Modal */}
      {showPhotoModal && (
        <EditVesselPhotoModal
          vessel={currentShip}
          isOpen={showPhotoModal}
          onClose={() => setShowPhotoModal(false)}
          onSavePhoto={(newPhotoUrl) => {
            updateVessel(currentShip.id, { photo: newPhotoUrl });
          }}
        />
      )}

      {/* Official Maritime Audit Report Print Modal */}
      {(vesselReportFinding || vesselReportSession) && (
        <AuditReportModal
          session={vesselReportSession}
          finding={vesselReportFinding}
          initialMode={vesselReportFinding ? 'ncr' : 'session'}
          onClose={() => {
            setVesselReportFinding(null);
            setVesselReportSession(null);
          }}
        />
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <DocumentPreviewModal
          document={previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </div>
  );
};
