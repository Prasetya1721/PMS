import React, { useState } from 'react';
import {
  Ship,
  Edit3,
  Printer,
  Copy,
  Check,
  Maximize2,
  Cpu,
  Fuel,
  Anchor,
  Radio,
  Shield,
  Users,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award
} from 'lucide-react';
import { PARTICULAR_SECTIONS, createDefaultShipParticulars } from '../../data/shipParticularsData';

const SECTION_ICONS = {
  general: Ship,
  dimensions: Maximize2,
  machinery: Cpu,
  tanks: Fuel,
  deck: Anchor,
  navigation: Radio,
  safety: Shield,
  accommodation: Users
};

export const ShipParticularsView = ({ vessel, onEdit, theme = 'dark' }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [copied, setCopied] = useState(false);

  if (!vessel) return null;

  const particulars = vessel.particulars || createDefaultShipParticulars(vessel);
  const isOperator = vessel.id?.startsWith('v-op-') || vessel.ownershipStatus === 'As Operator';

  const handleCopySummary = () => {
    const text = `
=== LEMBAR DATA PARTICULAR KAPAL ===
PT. PELAYARAN BAHARIMAS KALIMANTAN
Nama Kapal: ${particulars.vesselName || vessel.name}
Tipe: ${particulars.vesselType || vessel.type}
Status: ${particulars.ownershipStatus || vessel.ownershipStatus}
No. Registrasi: ${particulars.officialNo || vessel.regNo}
Call Sign: ${particulars.callSign || vessel.callSign}
Klasifikasi: ${particulars.classification || 'BKI'} (${particulars.classNotation || '-'})
Dimensi: LOA ${particulars.lengthOverall || '-'} | Breadth ${particulars.breadthMoulded || '-'} | Depth ${particulars.depthMoulded || '-'} | Draft ${particulars.designDraft || '-'}
Tonase: ${particulars.grossTonnage} GT / ${particulars.deadweight} DWT
Mesin Induk: ${particulars.mainEngine || '-'} (${particulars.totalHorsepower || '-'})
Bollard Pull: ${particulars.bollardPull || '-'}
Kapasitas BBM: ${particulars.fuelOilCapacity || '-'} | Air Tawar: ${particulars.freshWaterCapacity || '-'}
Towing Winch: ${particulars.towingWinch || '-'}
Alat Navigasi: Radar: ${particulars.marineRadar || '-'} | AIS: ${particulars.ais || '-'} | GPS: ${particulars.gpsChartplotter || '-'}
Kru / Akomodasi: ${particulars.crewComplement || '-'}
====================================
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Action Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '0.85rem 1.25rem',
        borderRadius: '12px',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)'
      }} className="no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            background: 'rgba(2, 132, 199, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8'
          }}>
            <FileText size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                Spesifikasi Teknis (Ship Particulars Sheet)
              </h3>
              <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                BKI Verified
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Lembar data teknis kelaiklautan dan karakteristik operasional armada {vessel.name}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            onClick={handleCopySummary}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem' }}
            title="Salin ringkasan spesifikasi ke clipboard"
          >
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copied ? 'Tersalin!' : 'Salin Ringkasan'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem' }}
            title="Cetak lembar particular resmi ini"
          >
            <Printer size={14} />
            <span>Cetak / PDF</span>
          </button>

          <button
            onClick={onEdit}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)' }}
          >
            <Edit3 size={14} />
            <span>Edit Data Particular</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Card Container */}
      <div className="glass-card particulars-sheet" style={{
        padding: '2rem 2.25rem',
        borderRadius: '16px',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        background: theme === 'light' ? '#ffffff' : 'var(--bg-surface-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        {/* Certificate Header / Letterhead */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '1.5rem',
          borderBottom: '2px solid rgba(2, 132, 199, 0.35)',
          position: 'relative'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                background: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)'
              }}>
                <Anchor size={26} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.04em', color: 'var(--text-main)' }}>
                  PT. PELAYARAN BAHARIMAS KALIMANTAN
                </h2>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', letterSpacing: '0.02em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Technical Marine & Fleet Maintenance Department • Pontianak - Samarinda - Banjarmasin
                </p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
            <span style={{
              fontSize: '0.92rem',
              fontWeight: 800,
              color: '#38bdf8',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
              VESSEL TECHNICAL PARTICULARS
            </span>
            <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
              DOC REF: PBK-PAR-{particulars.officialNo?.split(' ')[0] || vessel.regNo || '001'}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Klasifikasi: <strong>Biro Klasifikasi Indonesia (BKI)</strong>
            </span>
          </div>
        </div>

        {/* Vessel Identity Showcase */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '1.75rem',
          padding: '1.25rem',
          background: 'var(--bg-surface-elevated)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)'
        }}>
          {/* Photo */}
          <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', height: '170px' }}>
            <img
              src={vessel.photo}
              alt={vessel.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              top: '0.65rem',
              left: '0.65rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <span className={`badge ${vessel.status?.includes('Operasional') ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.68rem' }}>
                {vessel.status}
              </span>
              <span className={`badge ${isOperator ? 'badge-info' : 'badge-success'}`} style={{ fontSize: '0.68rem' }}>
                {isOperator ? '⚙️ As Operator' : '⚓ As Owner'}
              </span>
            </div>
          </div>

          {/* Key Vitals Highlight */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.85rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-main)', lineHeight: 1.1 }}>
                    {particulars.vesselName || vessel.name}
                  </h1>
                  <p style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 700, marginTop: '0.25rem' }}>
                    {particulars.vesselType || vessel.type}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                    Bendera: {particulars.flag || 'IDN'}
                  </span>
                  <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                    Port: {particulars.portOfRegistry?.split(',')[0]}
                  </span>
                  <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                    Tahun: {particulars.yearBuilt}
                  </span>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.85rem',
                marginTop: '1.15rem'
              }}>
                <div style={{ padding: '0.55rem 0.75rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>No. Registrasi BKI</span>
                  <p className="mono" style={{ fontSize: '0.85rem', fontWeight: 800, marginTop: '0.1rem' }}>
                    {particulars.officialNo || vessel.regNo}
                  </p>
                </div>
                <div style={{ padding: '0.55rem 0.75rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Call Sign / IMO</span>
                  <p className="mono" style={{ fontSize: '0.85rem', fontWeight: 800, marginTop: '0.1rem' }}>
                    {particulars.callSign || '-'} / {particulars.imoNumber || '-'}
                  </p>
                </div>
                <div style={{ padding: '0.55rem 0.75rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Tonase (GT / DWT)</span>
                  <p className="mono" style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981', marginTop: '0.1rem' }}>
                    {particulars.grossTonnage?.toLocaleString()} GT / {particulars.deadweight?.toLocaleString()} DWT
                  </p>
                </div>
                <div style={{ padding: '0.55rem 0.75rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Daya Mesin / BHP</span>
                  <p style={{ fontSize: '0.825rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.1rem' }}>
                    {particulars.totalHorsepower?.split('(')[0] || particulars.totalHorsepower || '-'}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '0.65rem' }}>
              <span>Notasi Klas BKI: <strong className="mono" style={{ color: 'var(--text-main)' }}>{particulars.classNotation || '+A100 (I) P, +SM'}</strong></span>
              <span>Galangan: <strong style={{ color: 'var(--text-main)' }}>{particulars.builder}</strong></span>
            </div>
          </div>
        </div>

        {/* Category Tabs for Fast Navigation */}
        <div style={{
          display: 'flex',
          gap: '0.35rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.5rem',
          overflowX: 'auto'
        }} className="no-print">
          <button
            onClick={() => setActiveTab('all')}
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem', fontWeight: activeTab === 'all' ? 700 : 500 }}
          >
            Semua Spesifikasi ({PARTICULAR_SECTIONS.length} Kategori)
          </button>
          {PARTICULAR_SECTIONS.map(section => {
            const Icon = SECTION_ICONS[section.id] || Ship;
            const isActive = activeTab === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`tab-btn ${isActive ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: isActive ? 700 : 500
                }}
              >
                <Icon size={14} color={isActive ? '#38bdf8' : 'var(--text-subtle)'} />
                <span>{section.title}</span>
              </button>
            );
          })}
        </div>

        {/* Sections Grid Rendering */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {PARTICULAR_SECTIONS.filter(s => activeTab === 'all' || activeTab === s.id).map(section => {
            const Icon = SECTION_ICONS[section.id] || Ship;
            return (
              <div key={section.id} style={{
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-elevated)',
                overflow: 'hidden'
              }}>
                {/* Section Header */}
                <div style={{
                  padding: '0.85rem 1.25rem',
                  background: 'rgba(2, 132, 199, 0.08)',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Icon size={17} color="#38bdf8" />
                    <div>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 800 }}>{section.title}</h4>
                      <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{section.subtitle}</p>
                    </div>
                  </div>
                  <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                    {section.fields.length} Atribut
                  </span>
                </div>

                {/* Section Attributes Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1px',
                  background: 'var(--border-subtle)'
                }}>
                  {section.fields.map(field => {
                    const val = particulars[field.key];
                    const isFullWidth = field.type === 'textarea' || (val && String(val).length > 60);

                    return (
                      <div
                        key={field.key}
                        style={{
                          padding: '0.75rem 1.25rem',
                          background: 'var(--bg-surface)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.2rem',
                          gridColumn: isFullWidth ? 'span 2' : 'span 1'
                        }}
                      >
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
                          {field.label}
                        </span>
                        <div style={{
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: val ? 'var(--text-main)' : 'var(--text-muted)',
                          lineHeight: 1.4
                        }}>
                          {val || '-'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Certificate Seal & Signatures Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1.75rem',
          borderTop: '2px dashed var(--border-subtle)',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginTop: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Award size={28} color="#0284c7" />
              <div>
                <p style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  VERIFIKASI TEKNIS & KELAIKLAUTAN
                </p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Data disesuaikan dengan Akta Pendaftaran Kapal, Surat Ukur, & Sertifikat Garis Muat BKI.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '3rem', textAlign: 'center' }}>
            <div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
                Disetujui Nakhoda / Perwira:
              </p>
              <p style={{ fontSize: '0.82rem', fontWeight: 800, borderTop: '1px solid var(--text-subtle)', paddingTop: '0.25rem' }}>
                {vessel.masterCaptain || 'Capt. M. Mar'}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
                Chief Engineer / KKM:
              </p>
              <p style={{ fontSize: '0.82rem', fontWeight: 800, borderTop: '1px solid var(--text-subtle)', paddingTop: '0.25rem' }}>
                {vessel.chiefEngineer || 'Chief Engineer (KKM)'}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
                Superintendent Armada:
              </p>
              <p style={{ fontSize: '0.82rem', fontWeight: 800, borderTop: '1px solid var(--text-subtle)', paddingTop: '0.25rem' }}>
                PT. Pelayaran Baharimas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
