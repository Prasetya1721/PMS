import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Ship,
  Wrench,
  Users,
  Anchor,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  FileCheck,
  X
} from 'lucide-react';

export const VesselList = () => {
  const {
    vessels,
    allEquipment,
    allCrew,
    allWorkOrders,
    allShipDocuments,
    setSelectedVesselId,
    setActiveTab,
    addVessel
  } = usePMS();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL | OWNER | OPERATOR | TUGBOAT | BARGE
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for Manual Ship Entry
  const [formData, setFormData] = useState({
    name: '',
    regNo: '',
    callSign: '',
    type: 'Tugboat (Kapal Tunda Twin Screw 3200 BHP)',
    ownershipStatus: 'As Owner & Operator',
    status: 'Operasional (Berlayar)',
    flag: 'Indonesia (IDN)',
    portOfRegistry: 'Pontianak, Kalimantan Barat',
    gt: 320,
    dwt: 450,
    yearBuilt: new Date().getFullYear(),
    builder: 'PT Dok & Perkapalan Baharimas',
    currentLocation: 'Sungai Kapuas, Pontianak',
    speedKnots: 8.0,
    masterCaptain: '',
    chiefEngineer: '',
    photo: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newShip = addVessel({
      ...formData,
      imo: formData.regNo || `${Math.floor(10000 + Math.random() * 90000)}`,
      callSign: formData.callSign || `YDB${(formData.regNo || '9999').substring(0, 4)}`
    });

    setShowAddModal(false);
    // Automatically select the new ship and switch to its dashboard!
    setSelectedVesselId(newShip.id);
    setActiveTab('dashboard');
  };

  // Filter and Search logic
  const filteredVessels = vessels.filter(v => {
    let matchFilter = true;
    if (filterType === 'OWNER') matchFilter = !v.id.startsWith('v-op-') && v.ownershipStatus !== 'As Operator';
    else if (filterType === 'OPERATOR') matchFilter = v.id.startsWith('v-op-') || v.ownershipStatus === 'As Operator';
    else if (filterType === 'TUGBOAT') matchFilter = v.type?.toLowerCase().includes('tugboat') || v.type?.toLowerCase().includes('tunda') || v.type?.toLowerCase().includes('penarik');
    else if (filterType === 'BARGE') matchFilter = v.type?.toLowerCase().includes('tongkang') || v.type?.toLowerCase().includes('barge');

    const matchSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      (v.regNo && v.regNo.toLowerCase().includes(search.toLowerCase())) ||
      (v.imo && v.imo.toLowerCase().includes(search.toLowerCase())) ||
      (v.callSign && v.callSign.toLowerCase().includes(search.toLowerCase())) ||
      (v.portOfRegistry && v.portOfRegistry.toLowerCase().includes(search.toLowerCase())) ||
      (v.ownershipStatus && v.ownershipStatus.toLowerCase().includes(search.toLowerCase())) ||
      (v.masterCaptain && v.masterCaptain.toLowerCase().includes(search.toLowerCase()));

    return matchFilter && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Master Armada Kapal (Fleet Directory)</h2>
            <span className="badge badge-info" style={{ fontSize: '0.78rem' }}>
              PT. Pelayaran Baharimas Kalimantan
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Daftar resmi 28 armada kapal niaga terpisah (17 As Owner & 11 As Operator), manajemen sertifikasi survei BKI, perwira penanggung jawab, dan penambahan kapal manual
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)' }}
          >
            <Plus size={16} />
            <span>Tambah Kapal Manual</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'Semua Armada', count: vessels.length },
            { id: 'OWNER', label: '⚓ As Owner (17 Milik)', count: vessels.filter(v => !v.id.startsWith('v-op-') && v.ownershipStatus !== 'As Operator').length },
            { id: 'OPERATOR', label: '⚙️ As Operator (11 Operasi)', count: vessels.filter(v => v.id.startsWith('v-op-') || v.ownershipStatus === 'As Operator').length },
            { id: 'TUGBOAT', label: 'Tugboat', count: vessels.filter(v => v.type?.toLowerCase().includes('tugboat') || v.type?.toLowerCase().includes('tunda') || v.type?.toLowerCase().includes('penarik')).length },
            { id: 'BARGE', label: 'Tongkang / Barge', count: vessels.filter(v => v.type?.toLowerCase().includes('tongkang') || v.type?.toLowerCase().includes('barge')).length }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`tab-btn ${filterType === f.id ? 'active' : ''}`}
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span>{f.label}</span>
              <span className="badge badge-neutral" style={{ fontSize: '0.68rem', padding: '0.05rem 0.4rem' }}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={15} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Cari nama kapal, No Reg, status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-control"
            style={{ paddingLeft: '2.4rem', fontSize: '0.825rem' }}
          />
        </div>
      </div>

      {/* Fleet Verification Banner */}
      <div style={{
        padding: '0.85rem 1.25rem',
        borderRadius: '10px',
        background: 'rgba(2, 132, 199, 0.08)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        fontSize: '0.825rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <ShieldCheck size={18} color="#38bdf8" />
          <span>
            <strong>Pemisahan Master Kapal Sesuai Dokumen:</strong> Terdaftar total <strong>28 entitas kapal</strong> yang dipisahkan menjadi <strong>17 Kapal As Owner</strong> (Milik Sendiri) dan <strong>11 Kapal As Operator</strong> (Pengoperasian), dengan total <strong>215 Dokumen Survei BKI</strong>.
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>17 Kapal As Owner</span>
          <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>11 Kapal As Operator</span>
          <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>215 Sertifikat BKI</span>
        </div>
      </div>

      {/* Grid of Vessels */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filteredVessels.map(v => {
          const shipWO = allWorkOrders.filter(w => w.vesselId === v.id);
          const shipEquipment = allEquipment.filter(e => e.vesselId === v.id);
          const shipCrew = allCrew.filter(c => c.vesselId === v.id);
          const shipDocs = allShipDocuments.filter(d => d.vesselId === v.id);

          const overdueCount = shipWO.filter(w => w.status === 'Overdue').length;
          const expiredDocs = shipDocs.filter(d => d.status === 'Expired').length;
          const dueSoonDocs = shipDocs.filter(d => d.status === 'Due Soon').length;
          const totalHours = shipEquipment.reduce((sum, e) => sum + (e.runningHours || 0), 0);

          const isOperator = v.ownershipStatus === 'As Operator';

          return (
            <div key={v.id} className="glass-card" style={{
              overflow: 'hidden',
              border: isOperator ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(16, 185, 129, 0.35)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '320px 1fr',
                minHeight: '220px'
              }}>
                {/* Photo */}
                <div style={{ position: 'relative' }}>
                  <img
                    src={v.photo}
                    alt={v.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '0.85rem', left: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <span className={`badge ${v.status?.includes('Operasional') ? 'badge-success' : 'badge-warning'}`}>
                      {v.status}
                    </span>
                    <span
                      className="badge"
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: isOperator ? 'rgba(2, 132, 199, 0.9)' : 'rgba(5, 150, 105, 0.9)',
                        color: '#fff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                      }}
                    >
                      {isOperator ? '⚙️ As Operator' : '⚓ As Owner'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <h3 style={{ fontSize: '1.55rem', fontWeight: 800 }}>{v.name}</h3>
                          <span
                            className="badge"
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: isOperator ? 'rgba(2, 132, 199, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              color: isOperator ? '#38bdf8' : '#34d399',
                              border: isOperator ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(52, 211, 153, 0.4)'
                            }}
                          >
                            {isOperator ? '⚙️ Kapal Pengoperasian (Operator)' : '⚓ Kapal Milik Sendiri (Owner)'}
                          </span>
                          <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>{v.type}</span>
                        </div>
                        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          No. Reg BKI: <strong className="mono" style={{ color: 'var(--text-main)' }}>{v.regNo || v.imo}</strong> • Bendera: <strong style={{ color: 'var(--text-main)' }}>{v.flag}</strong> • Pelabuhan Pendaftaran:{' '}
                          <strong style={{ color: 'var(--text-main)' }}>{v.portOfRegistry}</strong> • Galangan:{' '}
                          <strong style={{ color: 'var(--text-main)' }}>{v.builder} ({v.yearBuilt})</strong>
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedVesselId(v.id);
                          setActiveTab('dashboard');
                        }}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 1.15rem' }}
                      >
                        <span>Buka Dashboard Kapal</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>

                    {/* Technical Specs Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1.25rem' }}>
                      <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>No. Registrasi / Call Sign</span>
                        <p className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '0.15rem' }}>
                          Reg: {v.regNo || v.imo} / {v.callSign}
                        </p>
                      </div>
                      <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Tonase (GT / DWT)</span>
                        <p className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '0.15rem' }}>
                          {v.gt?.toLocaleString()} GT / {v.dwt?.toLocaleString()} DWT
                        </p>
                      </div>
                      <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Nakhoda & Chief Engineer</span>
                        <p style={{ fontSize: '0.825rem', fontWeight: 600, marginTop: '0.15rem' }}>
                          {v.masterCaptain || '-'} / {v.chiefEngineer?.split(' ')[0] || '-'}
                        </p>
                      </div>
                      <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Posisi Saat Ini</span>
                        <p style={{ fontSize: '0.825rem', fontWeight: 600, color: '#38bdf8', marginTop: '0.15rem' }}>
                          {v.currentLocation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Stats */}
                  <div style={{
                    marginTop: '1.25rem',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid var(--border-glass)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.825rem'
                  }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Wrench size={14} color="#38bdf8" />
                        <strong>{shipEquipment.length}</strong> Equipment
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Users size={14} color="#a78bfa" />
                        <strong>{shipCrew.length}</strong> Awak Kapal (Crew)
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <FileCheck size={14} color="#34d399" />
                        <strong>{shipDocs.length}</strong> Sertifikat Survei BKI
                      </span>
                      {totalHours > 0 && (
                        <span>Total Jam Kerja: <strong className="mono">{totalHours.toLocaleString()} Jam</strong></span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {expiredDocs > 0 && (
                        <span className="badge badge-danger-pulse" style={{ fontSize: '0.72rem' }}>
                          {expiredDocs} Survei Expired!
                        </span>
                      )}
                      {dueSoonDocs > 0 && (
                        <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
                          {dueSoonDocs} Survei H-30
                        </span>
                      )}
                      {overdueCount > 0 && (
                        <span className="badge badge-danger-pulse" style={{ fontSize: '0.72rem' }}>
                          {overdueCount} WO Overdue
                        </span>
                      )}
                      {expiredDocs === 0 && dueSoonDocs === 0 && overdueCount === 0 && (
                        <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                          Kondisi Kelaiklautan Prima
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Ship Creation Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '750px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', pb: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Ship size={24} color="#38bdf8" />
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Tambah Kapal Baru Manual</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Daftarkan kapal niaga baru ke dalam sistem PMS PT. Pelayaran Baharimas Kalimantan
                  </p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Nama Kapal (Nama Resmi) *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Contoh: TB. BAHARIMAS 09"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-control"
                  />
                </div>
                <div>
                  <label className="field-label">No. Registrasi / IMO *</label>
                  <input
                    type="text"
                    name="regNo"
                    required
                    placeholder="Contoh: 31890"
                    value={formData.regNo}
                    onChange={handleInputChange}
                    className="input-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="field-label">Call Sign</label>
                  <input
                    type="text"
                    name="callSign"
                    placeholder="Contoh: YDB3189"
                    value={formData.callSign}
                    onChange={handleInputChange}
                    className="input-control"
                  />
                </div>
                <div>
                  <label className="field-label">Tipe / Jenis Kapal</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="select-control"
                  >
                    <option value="Tugboat (Kapal Tunda Twin Screw 3200 BHP)">Tugboat Twin Screw</option>
                    <option value="Tugboat (Kapal Tunda Single Screw 1800 BHP)">Tugboat Single Screw</option>
                    <option value="Tongkang (Barge Batubara 300 Feet)">Tongkang Batubara 300 Feet</option>
                    <option value="Tongkang (Barge Batubara 330 Feet)">Tongkang Batubara 330 Feet</option>
                    <option value="Kapal Kargo / SPOB">Kapal Kargo / SPOB</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Status Kepemilikan</label>
                  <select
                    name="ownershipStatus"
                    value={formData.ownershipStatus}
                    onChange={handleInputChange}
                    className="select-control"
                  >
                    <option value="As Owner & Operator">As Owner & Operator</option>
                    <option value="As Owner">As Owner Only</option>
                    <option value="As Operator (Charter)">As Operator (Charter)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="field-label">Pelabuhan Pendaftaran</label>
                  <select
                    name="portOfRegistry"
                    value={formData.portOfRegistry}
                    onChange={handleInputChange}
                    className="select-control"
                  >
                    <option value="Samarinda, Kalimantan Timur">Samarinda, Kalimantan Timur</option>
                    <option value="Banjarmasin, Kalimantan Selatan">Banjarmasin, Kalimantan Selatan</option>
                    <option value="Pontianak, Kalimantan Barat">Pontianak, Kalimantan Barat</option>
                    <option value="Balikpapan, Kalimantan Timur">Balikpapan, Kalimantan Timur</option>
                    <option value="Kumai, Kalimantan Tengah">Kumai, Kalimantan Tengah</option>
                    <option value="Surabaya, Jawa Timur">Surabaya, Jawa Timur</option>
                    <option value="Batam, Kepulauan Riau">Batam, Kepulauan Riau</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Gross Tonnage (GT)</label>
                  <input
                    type="number"
                    name="gt"
                    placeholder="310"
                    value={formData.gt}
                    onChange={handleInputChange}
                    className="input-control"
                  />
                </div>
                <div>
                  <label className="field-label">Deadweight Tonnage (DWT)</label>
                  <input
                    type="number"
                    name="dwt"
                    placeholder="450"
                    value={formData.dwt}
                    onChange={handleInputChange}
                    className="input-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="field-label">Tahun Pembuatan</label>
                  <input
                    type="number"
                    name="yearBuilt"
                    placeholder="2022"
                    value={formData.yearBuilt}
                    onChange={handleInputChange}
                    className="input-control"
                  />
                </div>
                <div>
                  <label className="field-label">Galangan Pembuat (Shipyard)</label>
                  <input
                    type="text"
                    name="builder"
                    placeholder="PT Dok Baharimas"
                    value={formData.builder}
                    onChange={handleInputChange}
                    className="input-control"
                  />
                </div>
                <div>
                  <label className="field-label">Status Operasional</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="select-control"
                  >
                    <option value="Operasional (Berlayar)">Operasional (Berlayar)</option>
                    <option value="Operasional (Pelabuhan)">Operasional (Pelabuhan)</option>
                    <option value="Docking / Perawatan Berkala">Docking / Perawatan Berkala</option>
                    <option value="Standby Docking">Standby Docking</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Posisi / Lokasi Saat Ini</label>
                  <input
                    type="text"
                    name="currentLocation"
                    placeholder="Contoh: Muara Berau Anchorage"
                    value={formData.currentLocation}
                    onChange={handleInputChange}
                    className="input-control"
                  />
                </div>
                <div>
                  <label className="field-label">Kecepatan Rata-Rata (Knots)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="speedKnots"
                    placeholder="7.8"
                    value={formData.speedKnots}
                    onChange={handleInputChange}
                    className="input-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Nakhoda / Barge Master (Captain)</label>
                  <input
                    type="text"
                    name="masterCaptain"
                    placeholder="Contoh: Capt. Agus Supriyadi, M.Mar"
                    value={formData.masterCaptain}
                    onChange={handleInputChange}
                    className="input-control"
                  />
                </div>
                <div>
                  <label className="field-label">Chief Engineer / KKM (Kepala Kamar Mesin)</label>
                  <input
                    type="text"
                    name="chiefEngineer"
                    placeholder="Contoh: Ir. Bambang Wijaya (KKM)"
                    value={formData.chiefEngineer}
                    onChange={handleInputChange}
                    className="input-control"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                >
                  <Plus size={16} />
                  <span>Simpan & Buka Dashboard Kapal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
