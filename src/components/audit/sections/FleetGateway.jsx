/**
 * FleetGateway.jsx
 * Diekstrak dari AuditManager.jsx (baris 1498-1977).
 * Sumber: 1. LAYAR PEMILIHAN KAPAL / FLEET SELECTION GATEWAY (activeTargetId === null)
 */
import React from 'react';
import { AlertTriangle, Building2, CheckCircle2, ChevronRight, Clock, Filter, Plus, Search, ShieldCheck, Ship } from 'lucide-react';

export const FleetGateway = ({
  filteredGatewayTargets,
  fleetStats,
  gatewayFilter,
  gatewaySearch,
  handleSelectTarget,
  isAuditorOrDPA,
  operatorCount,
  ownerCount,
  setEditingFinding,
  setEditingSession,
  setFindingDefaultAuditId,
  setFindingModalOpen,
  setGatewayFilter,
  setGatewaySearch,
  setSessionModalOpen,
  smcTargets,
}) => (
<>
    {/* Hero Banner Gateway */}
    <div className="audit-hero-banner glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{
          padding: '0.85rem',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
        }}>
          <ShieldCheck size={32} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.55rem', fontWeight: 800 }}>Portal Audit ISM Code Per Armada Kapal (SMC)</h2>
            <span className="badge badge-info" style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}>
              {smcTargets.length} Kapal Armada SMC
            </span>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.3rem', maxWidth: '780px', lineHeight: '1.5' }}>
            Silakan <strong>pilih kapal armada</strong> di bawah ini untuk mengakses ruang audit dan evaluasi <strong>SMC (Safety Management Certificate)</strong>.
            Untuk audit kantor darat perusahaan, silakan pilih tab <strong>Audit DOC Kantor</strong> di atas.
          </p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {isAuditorOrDPA ? (
          <>
            <button
              onClick={() => {
                setEditingSession(null);
                setSessionModalOpen(true);
              }}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
            >
              <Plus size={15} color="#38bdf8" />
              <span>+ Sesi Audit SMC Kapal</span>
            </button>
            <button
              onClick={() => {
                setEditingFinding(null);
                setFindingDefaultAuditId(null);
                setFindingModalOpen(true);
              }}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
            >
              <AlertTriangle size={15} />
              <span>Catat Temuan NC</span>
            </button>
          </>
        ) : (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '7px',
            background: 'rgba(2, 132, 199, 0.08)',
            border: '1px solid rgba(2, 132, 199, 0.25)',
            fontSize: '0.74rem',
            color: '#0284c7',
            fontWeight: 600
          }}>
            <ShieldCheck size={14} />
            <span>Sesi Audit & Temuan Dikelola Oleh DPA / Lead Auditor</span>
          </div>
        )}
      </div>
    </div>

    {/* Fleet Statistics KPI Bar */}
    <div className="audit-kpi-grid">
      <div className="audit-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Entitas Armada</span>
          <Ship size={18} color="#38bdf8" />
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem', color: '#38bdf8' }}>
          {smcTargets.length} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Kapal Armada (SMC)</span>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
          {ownerCount} As Owner • {operatorCount} As Operator PBK
        </p>
      </div>

      <div className="audit-card audit-card-danger">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 700 }}>Total NC Open Armada</span>
          <span className="badge badge-danger-pulse" style={{ fontSize: '0.65rem' }}>Open</span>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem', color: '#ef4444' }}>
          {fleetStats.totalOpen} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Temuan Terbuka</span>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
          {fleetStats.totalOverdue > 0 ? (
            <span style={{ color: '#ef4444', fontWeight: 700 }}>🚨 {fleetStats.totalOverdue} NC Melewati Batas Waktu!</span>
          ) : (
            'Semua temuan dalam batas rentang aman'
          )}
        </p>
      </div>

      <div className="audit-card audit-card-warning">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 700 }}>Menunggu Verifikasi</span>
          <Clock size={18} color="#f59e0b" />
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem', color: '#f59e0b' }}>
          {fleetStats.totalSubmitted} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Eviden Masuk</span>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
          Sedang ditinjau oleh Lead Auditor DPA / BKI
        </p>
      </div>

      <div className="audit-card audit-card-success">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>Total NC Close Selesai</span>
          <CheckCircle2 size={18} color="#10b981" />
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem', color: '#10b981' }}>
          {fleetStats.totalClosed} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Temuan Selesai</span>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
          {fleetStats.avgCloseDays > 0 ? (
            <span>⏱️ Rata-rata Rentang Close: <strong style={{ color: '#10b981' }}>{fleetStats.avgCloseDays} Hari</strong></span>
          ) : (
            'Kepatuhan terverifikasi dan ditutup resmi'
          )}
        </p>
      </div>
    </div>

    {/* Search & Filter Toolbar */}
    <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={17} color="#38bdf8" />
          <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Filter Pilihan Kapal Armada:</span>
        </div>
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={gatewaySearch}
            onChange={(e) => setGatewaySearch(e.target.value)}
            placeholder="Cari nama kapal, call sign, IMO..."
            className="input-control"
            style={{ paddingLeft: '2.5rem', fontSize: '0.825rem' }}
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {[
          { id: 'ALL', label: `Semua Armada SMC (${smcTargets.length})`, icon: Ship },
          { id: 'HAS_OPEN_NC', label: `🚨 Ada NC Open (${smcTargets.filter(t => t.openNC > 0).length})`, icon: AlertTriangle, highlight: true },
          { id: 'HAS_SUBMITTED', label: `⏳ Menunggu Eviden (${smcTargets.filter(t => t.submittedNC > 0).length})`, icon: Clock },
          { id: 'CLEAN', label: `✅ Bebas NC Open (${smcTargets.filter(t => t.openNC === 0).length})`, icon: CheckCircle2 },
          { id: 'OWNER', label: `⚓ As Owner (${ownerCount})`, icon: Ship },
          { id: 'OPERATOR', label: `⚙️ As Operator (${operatorCount})`, icon: Ship }
        ].map(f => {
          const isActive = gatewayFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setGatewayFilter(f.id)}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                fontSize: '0.76rem',
                padding: '0.35rem 0.75rem',
                fontWeight: isActive ? 700 : 500,
                border: f.highlight && !isActive ? '1px solid rgba(239, 68, 68, 0.4)' : undefined,
                color: f.highlight && !isActive ? '#ef4444' : undefined
              }}
            >
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>
    </div>

    {/* Grid of Vessel Cards (Interactive Gateway Cards) */}
    <div className="audit-vessel-grid">
      {filteredGatewayTargets.map(target => {
        const hasOpen = target.openNC > 0;
        const hasSubmitted = target.submittedNC > 0;
        const isClean = target.openNC === 0;

        return (
          <div
            key={target.id}
            className={`audit-vessel-card ${hasOpen ? 'has-open-nc' : isClean ? 'is-clean' : ''}`}
          >
            {/* Card Header: Photo / Badge & Name */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: target.type === 'office' ? 'rgba(2, 132, 199, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                    color: target.type === 'office' ? '#0284c7' : '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {target.type === 'office' ? <Building2 size={24} /> : <Ship size={24} />}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
                      {target.name}
                    </h4>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      {target.subtitle}
                    </p>
                  </div>
                </div>

                <span className={`badge ${target.ownership === 'As Owner' ? 'badge-primary' : target.ownership === 'Head Office' ? 'badge-info' : 'badge-neutral'}`} style={{ fontSize: '0.65rem' }}>
                  {target.ownership}
                </span>
              </div>

              {/* Technical Snapshot */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.4rem',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                background: 'var(--bg-surface-elevated)',
                fontSize: '0.72rem',
                marginBottom: '0.85rem'
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Call Sign: </span>
                  <strong className="mono">{target.callSign}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>IMO / Reg: </span>
                  <strong className="mono">{target.imo}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Tonase: </span>
                  <strong>{target.gt !== '-' ? `${target.gt} GT` : 'Kantor'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Pelabuhan: </span>
                  <span>{target.portOfRegistry?.split(',')[0]}</span>
                </div>
              </div>

              {/* PROMINENT NOTIS STATUS NC OPEN / NC CLOSE */}
              <div style={{ marginBottom: '0.5rem' }}>
                {hasOpen ? (
                  <div style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem'
                  }}>
                    <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>🚨 NOTIS: {target.openNC} NC OPEN</span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.1rem 0.35rem', background: '#ef4444', color: '#fff', borderRadius: '4px' }}>
                          Perlu Tindakan
                        </span>
                      </div>
                      <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        {target.majorNC > 0 && <span style={{ color: '#ef4444', fontWeight: 700 }}>{target.majorNC} Major NC • </span>}
                        {target.minorNC > 0 && <span>{target.minorNC} Minor NC • </span>}
                        Wajib pengajuan eviden perbaikan
                      </p>

                      {/* Rentang Waktu NC Open Terdekat */}
                      {target.timeStats?.mostUrgent && (
                        <div style={{
                          marginTop: '0.4rem',
                          paddingTop: '0.35rem',
                          borderTop: '1px dashed rgba(239, 68, 68, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.69rem'
                        }}>
                          <span style={{
                            color: target.timeStats.mostUrgent.range.color,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            <Clock size={12} />
                            {target.timeStats.mostUrgent.range.badgeText}
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
                            Target: {target.timeStats.mostUrgent.range.dueDateStr}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : hasSubmitted ? (
                  <div style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    background: 'rgba(245, 158, 11, 0.12)',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem'
                  }}>
                    <Clock size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>⏳ {target.submittedNC} Eviden Menunggu Verifikasi</span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.1rem 0.35rem', background: '#f59e0b', color: '#000', borderRadius: '4px' }}>
                          Tinjau
                        </span>
                      </div>
                      <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        Dokumen perbaikan telah dikirim ke Lead Auditor
                      </p>
                      {target.timeStats?.mostUrgent && (
                        <div style={{
                          marginTop: '0.4rem',
                          paddingTop: '0.35rem',
                          borderTop: '1px dashed rgba(245, 158, 11, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.69rem'
                        }}>
                          <span style={{ color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={12} />
                            {target.timeStats.mostUrgent.range.badgeText}
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
                            Telah aktif {target.timeStats.mostUrgent.range.activeDays} hari
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : target.closedNC > 0 ? (
                  <div style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem'
                  }}>
                    <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>✅ NOTIS: SELURUH NC CLOSE ({target.closedNC} Selesai)</span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.1rem 0.35rem', background: '#10b981', color: '#fff', borderRadius: '4px' }}>
                          Aman
                        </span>
                      </div>
                      <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        Standar SMS & ISM Code telah terpenuhi tuntas
                      </p>
                      {target.timeStats?.avgResolutionDays > 0 && (
                        <div style={{
                          marginTop: '0.4rem',
                          paddingTop: '0.35rem',
                          borderTop: '1px dashed rgba(16, 185, 129, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.69rem'
                        }}>
                          <span style={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            ✓ Rata-rata Penutupan: {target.timeStats.avgResolutionDays} Hari
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
                            Tuntas Tepat Waktu
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    background: 'rgba(2, 132, 199, 0.08)',
                    border: '1px solid rgba(2, 132, 199, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem'
                  }}>
                    <ShieldCheck size={18} color="#38bdf8" style={{ flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8' }}>
                        🛡️ STATUS AMAN: Bebas NC Open
                      </div>
                      <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        Belum ada temuan ketidaksesuaian terbuka
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer: Sesi Audit & Action Button */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <div>Sesi Terakhir:</div>
                <strong style={{ color: 'var(--text-main)' }}>
                  {target.lastAudit ? target.lastAudit.auditNo : 'Siap Dijadwalkan'}
                </strong>
              </div>

              <button
                onClick={() => handleSelectTarget(target.id)}
                className={`btn btn-sm ${hasOpen ? 'btn-danger' : 'btn-primary'}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '0.45rem 0.85rem'
                }}
              >
                <span>Masuk Menu Audit</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>

    {filteredGatewayTargets.length === 0 && (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <Ship size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Tidak ada kapal yang sesuai filter</h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
          Coba sesuaikan kata kunci pencarian atau ganti filter kategori.
        </p>
        <button
          onClick={() => {
            setGatewayFilter('ALL');
            setGatewaySearch('');
          }}
          className="btn btn-secondary btn-sm"
          style={{ marginTop: '1rem' }}
        >
          Reset Filter
        </button>
      </div>
    )}
  </>
);
