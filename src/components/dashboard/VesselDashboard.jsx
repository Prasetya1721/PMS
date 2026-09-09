import React, { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { RunningHoursModal } from '../equipment/RunningHoursModal';
import { WorkOrderModal } from '../maintenance/WorkOrderModal';

export const VesselDashboard = () => {
  const {
    vessels,
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
    setActiveTab,
    sendWhatsAppReminder,
    openGoogleCalendar,
    updateWorkOrderStatus,
    toggleChecklist,
    addCrew,
    addShipDocument
  } = usePMS();

  const [activeSubTab, setActiveSubTab] = useState('overview'); // overview | crew | documents | equipment | workorders | spareparts
  const [selectedEqForHours, setSelectedEqForHours] = useState(null);
  const [showNewWOModal, setShowNewWOModal] = useState(false);
  const [showAddCrewModal, setShowAddCrewModal] = useState(false);
  const [showAddDocModal, setShowAddDocModal] = useState(false);

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

  // New Ship Doc Form State
  const [newDocData, setNewDocData] = useState({
    name: '',
    category: 'Classification',
    documentNo: '',
    issuer: 'Biro Klasifikasi Indonesia (BKI)',
    expiryDate: '2027-06-30'
  });

  // Current vessel with safe fallback
  const currentShip = (vessels && vessels.find(v => v.id === selectedVesselId)) || (vessels && vessels[0]) || {
    id: 'v-001',
    name: 'RP 2020',
    type: 'Tugboat (Kapal Tunda Twin Screw 3200 BHP)',
    ownershipStatus: 'As Owner',
    imo: '24587',
    regNo: '24587',
    callSign: 'YDB2458',
    portOfRegistry: 'Samarinda, Kalimantan Timur',
    builder: 'PT Dok & Perkapalan Baharimas Samarinda',
    yearBuilt: 2020,
    speedKnots: 7.8,
    gt: 310,
    status: 'Operasional (Berlayar)',
    currentLocation: 'Muara Berau (Towing Tongkang)',
    photo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
  };

  // Specific data filtered for THIS ship with defensive checks
  const shipCrew = (allCrew || []).filter(c => c.vesselId === currentShip.id);
  const shipCrewCerts = (allCrewCertificates || crewCertificates || []).filter(c => c.vesselId === currentShip.id);
  const shipDocs = (allShipDocuments || []).filter(d => d.vesselId === currentShip.id);
  const shipEquipment = (allEquipment || []).filter(e => e.vesselId === currentShip.id);
  const shipWOs = (allWorkOrders || []).filter(w => w.vesselId === currentShip.id);
  const shipParts = (allSpareparts || []).filter(s => s.vesselId === currentShip.id);

  const overdueWO = shipWOs.filter(w => w.status === 'Overdue');
  const inProgressWO = shipWOs.filter(w => w.status === 'In Progress');
  const expiredDocs = shipDocs.filter(d => d.status === 'Expired');
  const dueSoonDocs = shipDocs.filter(d => d.status === 'Due Soon');
  const urgentCerts = [
    ...shipCrewCerts.filter(c => c.status !== 'Active'),
    ...shipDocs.filter(d => d.status !== 'Active')
  ];

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

  const handleCreateDoc = (e) => {
    e.preventDefault();
    if (!newDocData.name.trim()) return;

    addShipDocument({
      ...newDocData,
      vesselId: currentShip.id,
      documentNo: newDocData.documentNo || `BKI-${currentShip.regNo || 'DOC'}-${Date.now().toString().slice(-4)}`
    });

    setShowAddDocModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Vessel Profile Hero Card */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '360px 1fr',
          minHeight: '230px'
        }}>
          {/* Photo & Status */}
          <div style={{ position: 'relative' }}>
            <img
              src={currentShip.photo}
              alt={currentShip.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, transparent 60%, rgba(15, 28, 53, 0.95) 100%)'
            }} />
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span className={`badge ${currentShip.status?.includes('Operasional') ? 'badge-success' : 'badge-warning'}`}>
                {currentShip.status}
              </span>
              <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                {currentShip.ownershipStatus || 'As Owner'}
              </span>
            </div>
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
                    No. Reg BKI: <strong className="mono" style={{ color: '#fff' }}>{currentShip.regNo || currentShip.imo}</strong> • Call Sign:{' '}
                    <strong className="mono" style={{ color: '#fff' }}>{currentShip.callSign}</strong> • Pelabuhan Pendaftaran:{' '}
                    <strong style={{ color: '#fff' }}>{currentShip.portOfRegistry}</strong> • Galangan: <strong>{currentShip.builder} ({currentShip.yearBuilt})</strong>
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
                    <optgroup label="⚓ AS OWNER (17 Kapal Milik)">
                      {vessels.filter(v => !v.id.startsWith('v-op-') && v.ownershipStatus !== 'As Operator').map(v => (
                        <option key={v.id} value={v.id}>
                          🚢 {v.name} ({v.type.split(' ')[0]}) [Owner]
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="⚙️ AS OPERATOR (11 Kapal Operasional)">
                      {vessels.filter(v => v.id.startsWith('v-op-') || v.ownershipStatus === 'As Operator').map(v => (
                        <option key={v.id} value={v.id}>
                          ⚙️ {v.name} ({v.type.split(' ')[0]}) [Operator]
                        </option>
                      ))}
                    </optgroup>
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
              <button onClick={() => setShowNewWOModal(true)} className="btn btn-primary btn-sm">
                <Plus size={14} />
                <span>Buat Work Order Kapal Ini</span>
              </button>
              <button onClick={() => setShowAddCrewModal(true)} className="btn btn-secondary btn-sm">
                <Users size={14} />
                <span>Tambah Kru</span>
              </button>
              <button onClick={() => setShowAddDocModal(true)} className="btn btn-secondary btn-sm">
                <FileCheck size={14} />
                <span>Tambah Sertifikat BKI</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dedicated Navigation Sub-Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.25rem',
          padding: '0.5rem 1.5rem',
          background: 'rgba(2, 6, 23, 0.6)',
          borderTop: '1px solid var(--border-glass)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'overview', label: 'Ringkasan & Vital Status', icon: Compass, badge: null },
            { id: 'crew', label: 'Awak Kapal (Crew Roster)', icon: Users, badge: shipCrew.length },
            { id: 'documents', label: 'Sertifikat & Survei BKI', icon: FileCheck, badge: shipDocs.length, alert: expiredDocs.length > 0 },
            { id: 'equipment', label: 'Equipment & Jam Mesin', icon: Wrench, badge: shipEquipment.length },
            { id: 'workorders', label: 'Work Orders & Servis', icon: Clock, badge: shipWOs.length, alert: overdueWO.length > 0 },
            { id: 'spareparts', label: 'Inventaris Sparepart', icon: Package, badge: shipParts.length }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`tab-btn ${isActive ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1rem',
                  fontSize: '0.825rem',
                  fontWeight: isActive ? 700 : 500
                }}
              >
                <Icon size={15} color={isActive ? '#38bdf8' : 'var(--text-subtle)'} />
                <span>{tab.label}</span>
                {tab.badge !== null && (
                  <span className={`badge ${tab.alert ? 'badge-danger-pulse' : isActive ? 'badge-info' : 'badge-neutral'}`} style={{ fontSize: '0.68rem', padding: '0.05rem 0.4rem' }}>
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
            {/* Work Orders List */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Work Orders Aktif ({shipWOs.length})</h4>
                <button onClick={() => setActiveSubTab('workorders')} className="btn btn-secondary btn-sm">
                  Lihat Semua
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {shipWOs.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
                    <p>Tidak ada work order yang tertunda untuk kapal ini.</p>
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
                            wo.priority === 'Sangat Tinggi' || wo.priority === 'Tinggi' ? 'badge-danger' : 'badge-warning'
                          }`} style={{ fontSize: '0.65rem' }}>
                            {wo.priority}
                          </span>
                        </div>
                        <h5 style={{ fontSize: '0.88rem', fontWeight: 600, marginTop: '0.25rem' }}>{wo.title}</h5>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Ditugaskan: <strong>{wo.assignedTo}</strong>
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                        <span className={`badge ${
                          wo.status === 'Completed' ? 'badge-success' :
                          wo.status === 'In Progress' ? 'badge-info' :
                          wo.status === 'Overdue' ? 'badge-danger-pulse' :
                          'badge-neutral'
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

      {/* SUB-TAB 2: AWAK KAPAL (CREW ROSTER) */}
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

      {/* SUB-TAB 3: SERTIFIKAT & SURVEI BKI (STATUTORY RADAR) */}
      {activeSubTab === 'documents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                Sertifikat & Catatan Survei BKI: {currentShip.name}
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Seluruh sertifikasi survei berkala Biro Klasifikasi Indonesia (Special Survey, Annual, Docking, Load Line, Poros Propeller)
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setShowAddDocModal(true)} className="btn btn-primary btn-sm">
                <Plus size={14} />
                <span>Tambah Sertifikat Baru</span>
              </button>
            </div>
          </div>

          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div className="table-container">
              <table className="pms-table">
                <thead>
                  <tr>
                    <th>Jenis Survei / Kategori</th>
                    <th>Nama Survei & Sertifikat</th>
                    <th>Nomor Dokumen BKI</th>
                    <th>Instansi Pemeriksa</th>
                    <th>Jatuh Tempo (Expiry)</th>
                    <th>Sisa Hari</th>
                    <th>Status Kelaikan</th>
                    <th style={{ textAlign: 'right' }}>Aksi Reminder</th>
                  </tr>
                </thead>
                <tbody>
                  {shipDocs.map(d => {
                    const isExpired = d.status === 'Expired' || d.daysUntilExpiry <= 0;
                    const isH30 = d.daysUntilExpiry > 0 && d.daysUntilExpiry <= 30;

                    return (
                      <tr key={d.id} style={{ background: isExpired ? 'rgba(239, 68, 68, 0.04)' : isH30 ? 'rgba(245, 158, 11, 0.03)' : undefined }}>
                        <td>
                          <span className={`badge ${d.category === 'Statutory Certificate' ? 'badge-info' : 'badge-neutral'}`} style={{ fontSize: '0.7rem' }}>
                            {d.category}
                          </span>
                        </td>
                        <td>
                          <strong style={{ fontSize: '0.92rem' }}>{d.name}</strong>
                          {d.rawNote && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                              Catatan daftar: {d.rawNote}
                            </div>
                          )}
                        </td>
                        <td className="mono" style={{ fontSize: '0.8rem' }}>{d.documentNo}</td>
                        <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{d.issuer}</td>
                        <td>
                          <strong className="mono" style={{ fontSize: '0.85rem', color: isExpired ? '#ef4444' : isH30 ? '#f59e0b' : '#10b981' }}>
                            {d.expiryDate}
                          </strong>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: isExpired ? '#ef4444' : isH30 ? '#f59e0b' : 'var(--text-muted)' }}>
                            {d.daysUntilExpiry > 0 ? `${d.daysUntilExpiry} hari lagi` : `LEWAT ${Math.abs(d.daysUntilExpiry)} HARI!`}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${isExpired ? 'badge-danger-pulse' : isH30 ? 'badge-warning' : 'badge-success'}`}>
                            {d.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
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

      {/* SUB-TAB 5: WORK ORDERS & PERAWATAN */}
      {activeSubTab === 'workorders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                Work Orders & Pemeliharaan: {currentShip.name}
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Daftar instruksi kerja perawatan berkala, perbaikan darurat, dan checklist pengerjaan teknisi
              </p>
            </div>

            <button onClick={() => setShowNewWOModal(true)} className="btn btn-primary btn-sm">
              <Plus size={14} />
              <span>Buat Work Order Baru</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {shipWOs.length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <CheckCircle size={40} color="#10b981" style={{ margin: '0 auto 0.75rem' }} />
                <h4>Semua Tugas Perawatan Selesai!</h4>
                <p style={{ fontSize: '0.85rem' }}>Tidak ada pekerjaan perawatan yang tertunda pada kapal ini.</p>
              </div>
            ) : (
              shipWOs.map(wo => (
                <div key={wo.id} className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>{wo.id}</span>
                        <span className={`badge ${
                          wo.priority === 'Sangat Tinggi' || wo.priority === 'Tinggi' ? 'badge-danger' : 'badge-warning'
                        }`}>
                          {wo.priority}
                        </span>
                        <span className="badge badge-neutral">{wo.category}</span>
                      </div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '0.4rem' }}>{wo.title}</h4>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Ditugaskan: <strong>{wo.assignedTo}</strong> • Supervisor: <strong>{wo.supervisor}</strong> • Batas Target: <strong>{wo.dueDate || `${wo.targetHours} Jam`}</strong>
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <select
                        value={wo.status}
                        onChange={(e) => updateWorkOrderStatus(wo.id, e.target.value)}
                        className="select-control"
                        style={{ width: '150px', fontSize: '0.8rem', fontWeight: 600 }}
                      >
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Overdue">Overdue</option>
                      </select>

                      {wo.status === 'Overdue' && (
                        <button
                          onClick={() => sendWhatsAppReminder(wo, 'work_order')}
                          className="btn btn-whatsapp btn-sm"
                        >
                          <Send size={13} />
                          <span>Alert WA</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Checklist */}
                  {wo.checklist && wo.checklist.length > 0 && (
                    <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>CHECKLIST PENGERJAAN:</span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem', marginTop: '0.5rem' }}>
                        {wo.checklist.map(item => (
                          <label
                            key={item.id}
                            onClick={() => toggleChecklist(wo.id, item.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.6rem',
                              padding: '0.5rem 0.75rem',
                              background: item.done ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-surface-elevated)',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.825rem',
                              border: item.done ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)'
                            }}
                          >
                            <input type="checkbox" checked={item.done} onChange={() => {}} />
                            <span style={{ textDecoration: item.done ? 'line-through' : 'none', color: item.done ? 'var(--text-muted)' : '#fff' }}>
                              {item.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

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

      {/* Modal: Tambah Sertifikat Baru */}
      {showAddDocModal && (
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
              Tambah Sertifikat / Survei: {currentShip.name}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Catat sertifikat klasifikasi BKI atau statutory baru untuk kapal ini
            </p>

            <form onSubmit={handleCreateDoc} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="field-label">Nama Sertifikat / Jenis Survei *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Annual Survey (AS)"
                  value={newDocData.name}
                  onChange={(e) => setNewDocData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Kategori</label>
                  <select
                    value={newDocData.category}
                    onChange={(e) => setNewDocData(prev => ({ ...prev, category: e.target.value }))}
                    className="select-control"
                  >
                    <option value="Classification">Classification (Klas BKI)</option>
                    <option value="Statutory Certificate">Statutory Certificate (Pemerintah)</option>
                    <option value="Asuransi & P&I">Asuransi & P&I</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Nomor Dokumen</label>
                  <input
                    type="text"
                    placeholder="Contoh: BKI-30937-AS"
                    value={newDocData.documentNo}
                    onChange={(e) => setNewDocData(prev => ({ ...prev, documentNo: e.target.value }))}
                    className="input-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Instansi Penerbit</label>
                  <input
                    type="text"
                    placeholder="Biro Klasifikasi Indonesia (BKI)"
                    value={newDocData.issuer}
                    onChange={(e) => setNewDocData(prev => ({ ...prev, issuer: e.target.value }))}
                    className="input-control"
                  />
                </div>
                <div>
                  <label className="field-label">Tanggal Jatuh Tempo (Expiry) *</label>
                  <input
                    type="date"
                    required
                    value={newDocData.expiryDate}
                    onChange={(e) => setNewDocData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="input-control"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button type="button" onClick={() => setShowAddDocModal(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Sertifikat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Existing Modals */}
      {selectedEqForHours && (
        <RunningHoursModal
          equipment={selectedEqForHours}
          onClose={() => setSelectedEqForHours(null)}
        />
      )}

      {showNewWOModal && (
        <WorkOrderModal
          vesselId={currentShip.id}
          onClose={() => setShowNewWOModal(false)}
        />
      )}
    </div>
  );
};
