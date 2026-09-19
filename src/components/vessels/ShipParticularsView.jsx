import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    return () => {
      document.body.classList.remove('particulars-printing-active');
    };
  }, []);

  const handlePrint = () => {
    document.body.classList.add('particulars-printing-active');
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.body.classList.remove('particulars-printing-active');
      }, 500);
    }, 50);
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
        gap: '1.75rem'
      }}>
        {/* Certificate Header / Letterhead */}
        <div className="particulars-kop" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '1.25rem',
          borderBottom: '3px double #0f172a',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#0284c7',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)',
              border: '2px solid #38bdf8',
              flexShrink: 0
            }}>
              <Ship size={28} strokeWidth={2.2} />
              <span style={{ fontSize: '5.5pt', fontWeight: 900, letterSpacing: '1px', marginTop: '1px' }}>PBK</span>
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '0.03em', color: 'var(--text-main)', margin: 0, textTransform: 'uppercase' }}>
                PT. PELAYARAN BAHARIMAS KALIMANTAN
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#0284c7', letterSpacing: '0.02em', textTransform: 'uppercase', fontWeight: 700, margin: '2px 0 0 0' }}>
                SHIP OWNER, OPERATOR & MARITIME LOGISTICS SERVICES
              </p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Kantor Pusat: Komp. Pontianak Mall Blok D No. 8-9, Jl. Tanjungpura, Kota Pontianak 78122, Kalimantan Barat • Telp: (0561) 734567
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem', borderLeft: '1px solid #cbd5e1', paddingLeft: '1rem' }}>
            <span style={{
              fontSize: '0.92rem',
              fontWeight: 900,
              color: '#0284c7',
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}>
              SPESIFIKASI TEKNIS KAPAL
            </span>
            <span className="mono" style={{ fontSize: '0.76rem', color: 'var(--text-main)', fontWeight: 800 }}>
              DOC NO: PBK-PAR-{particulars.officialNo?.split(' ')[0] || vessel.regNo || '001'}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Klasifikasi: <strong>Biro Klasifikasi Indonesia (BKI)</strong>
            </span>
            <span style={{ fontSize: '0.66rem', color: '#64748b' }}>
              Edisi / Revisi: <strong>2026 / Rev. 02</strong>
            </span>
          </div>
        </div>

        {/* Vessel Identity Showcase */}
        <div className="particulars-showcase" style={{
          display: 'grid',
          gridTemplateColumns: '250px 1fr',
          gap: '1.5rem',
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
                  <h1 style={{ fontSize: '1.85rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-main)', lineHeight: 1.1, margin: 0 }}>
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
                gap: '0.75rem',
                marginTop: '1rem'
              }}>
                <div style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', display: 'block' }}>No. Registrasi BKI</span>
                  <p className="mono" style={{ fontSize: '0.825rem', fontWeight: 800, margin: '0.1rem 0 0 0' }}>
                    {particulars.officialNo || vessel.regNo}
                  </p>
                </div>
                <div style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', display: 'block' }}>Call Sign / IMO</span>
                  <p className="mono" style={{ fontSize: '0.825rem', fontWeight: 800, margin: '0.1rem 0 0 0' }}>
                    {particulars.callSign || '-'} / {particulars.imoNumber || '-'}
                  </p>
                </div>
                <div style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', display: 'block' }}>Tonase (GT / DWT)</span>
                  <p className="mono" style={{ fontSize: '0.825rem', fontWeight: 800, color: '#10b981', margin: '0.1rem 0 0 0' }}>
                    {particulars.grossTonnage?.toLocaleString()} GT / {particulars.deadweight?.toLocaleString()} DWT
                  </p>
                </div>
                <div style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', display: 'block' }}>Daya Mesin / BHP</span>
                  <p style={{ fontSize: '0.825rem', fontWeight: 800, color: '#f59e0b', margin: '0.1rem 0 0 0' }}>
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

        {/* Category Tabs for Fast Navigation — Terlihat Semua (Flex Wrap & No Clipping) */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.45rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.75rem'
        }} className="no-print">
          <button
            onClick={() => setActiveTab('all')}
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.42rem 0.85rem',
              fontSize: '0.78rem',
              fontWeight: activeTab === 'all' ? 700 : 500,
              whiteSpace: 'nowrap',
              borderRadius: '8px'
            }}
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
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.42rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: isActive ? 700 : 500,
                  whiteSpace: 'nowrap',
                  borderRadius: '8px'
                }}
              >
                <Icon size={14} color={isActive ? '#38bdf8' : 'var(--text-subtle)'} />
                <span>{section.title}</span>
              </button>
            );
          })}
        </div>

        {/* Sections Grid Rendering — In Print mode, all sections are printed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {PARTICULAR_SECTIONS.map(section => {
            const isSelectedOnScreen = activeTab === 'all' || activeTab === section.id;
            const Icon = SECTION_ICONS[section.id] || Ship;
            return (
              <div
                key={section.id}
                className={`particular-section-block ${!isSelectedOnScreen ? 'particular-section-screen-hidden' : ''}`}
                style={{
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface-elevated)',
                  overflow: 'hidden',
                  pageBreakInside: 'avoid',
                  breakInside: 'avoid'
                }}
              >
                {/* Section Header */}
                <div
                  className="particular-section-header"
                  style={{
                    padding: '0.75rem 1.25rem',
                    background: 'rgba(2, 132, 199, 0.08)',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Icon size={17} color="#38bdf8" />
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>{section.title}</h4>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '1px 0 0 0' }}>{section.subtitle}</p>
                    </div>
                  </div>
                  <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                    {section.fields.length} Atribut
                  </span>
                </div>

                {/* Section Attributes Grid */}
                <div
                  className="particular-fields-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1px',
                    background: 'var(--border-subtle)'
                  }}
                >
                  {section.fields.map(field => {
                    const val = particulars[field.key];
                    const isFullWidth = field.type === 'textarea' || (val && String(val).length > 60);

                    return (
                      <div
                        key={field.key}
                        className="particular-field-cell"
                        style={{
                          padding: '0.65rem 1.15rem',
                          background: 'var(--bg-surface)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.15rem',
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
        <div
          className="particulars-signatures"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1.5rem',
            borderTop: '2px dashed var(--border-subtle)',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginTop: '0.5rem',
            pageBreakInside: 'avoid',
            breakInside: 'avoid'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Award size={30} color="#0284c7" />
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  VERIFIKASI TEKNIS & KELAIKLAUTAN KAPAL
                </p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Data diselaraskan dengan Surat Ukur, Akta Pendaftaran, dan Sertifikat Garis Muat BKI.
                </p>
                <p style={{ fontSize: '0.68rem', color: '#0284c7', margin: '2px 0 0 0', fontWeight: 700 }}>
                  Ditetapkan di: Pontianak, Kalimantan Barat
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2.5rem', textAlign: 'center' }}>
            <div style={{ minWidth: '130px' }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0 0 2.5rem 0' }}>
                Disetujui Nakhoda Kapal:
              </p>
              <p style={{ fontSize: '0.82rem', fontWeight: 800, borderTop: '1px solid #94a3b8', paddingTop: '0.25rem', margin: 0, textDecoration: 'underline' }}>
                {vessel.masterCaptain || 'Capt. Hendra Gunawan, M.Mar'}
              </p>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Master / Captain</span>
            </div>
            <div style={{ minWidth: '130px' }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0 0 2.5rem 0' }}>
                Chief Engineer / KKM:
              </p>
              <p style={{ fontSize: '0.82rem', fontWeight: 800, borderTop: '1px solid #94a3b8', paddingTop: '0.25rem', margin: 0, textDecoration: 'underline' }}>
                {vessel.chiefEngineer || 'Ir. Bambang Wijaya'}
              </p>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Kepala Kamar Mesin</span>
            </div>
            <div style={{ minWidth: '130px' }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0 0 2.5rem 0' }}>
                Superintendent Armada:
              </p>
              <p style={{ fontSize: '0.82rem', fontWeight: 800, borderTop: '1px solid #94a3b8', paddingTop: '0.25rem', margin: 0, textDecoration: 'underline' }}>
                Ir. Heri Prasetyo
              </p>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>PT. Pelayaran Baharimas Kalimantan</span>
            </div>
          </div>
        </div>

        {/* Document Official Footer Notes */}
        <div
          className="particulars-footer-note"
          style={{
            paddingTop: '0.5rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '6.5pt',
            color: '#64748b'
          }}
        >
          <div>
            Dokumen Teknis Resmi PT. Pelayaran Baharimas Kalimantan • Sistem Manajemen Armada PMS Cloud
          </div>
          <div>
            Distribusi: 1. Arsip Kantor Darat Pontianak | 2. Onboard {vessel.name} | 3. Arsip Syahbandar / BKI
          </div>
        </div>
      </div>
    </div>
  );
};
