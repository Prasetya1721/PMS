/**
 * VesselHeroCard.jsx
 * Diekstrak dari VesselDashboard.jsx (baris 259-520).
 * Sumber: Kartu profil kapal: foto, status, tombol aksi cepat
 */
import React from 'react';
import { Camera, Compass, Edit3, FileCheck, FileText, Package, ShieldCheck, ShoppingBag, Users, Wrench } from 'lucide-react';

export const VesselHeroCard = ({
  activeSubTab,
  currentShip,
  expiredDocs,
  overdueWO,
  setActiveSubTab,
  setSelectedVesselId,
  setShowAddCrewModal,
  setShowAddDocModal,
  setShowNewWOModal,
  setShowParticularsModal,
  setShowPhotoModal,
  shipAuditFindings,
  shipCrew,
  shipDocs,
  shipEquipment,
  shipOpenNC,
  shipParts,
  shipWOs,
  theme,
  vessels,
}) => {
  return (
    <div className="glass-card no-print" style={{ overflow: 'hidden' }}>
            <div className="vessel-hero-grid">
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
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginTop: '1.25rem', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '0.85rem' }}>
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
  );
};
