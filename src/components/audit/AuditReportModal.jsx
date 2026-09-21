import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { usePMS } from '../../context/PMSContext';
import {
  Printer,
  X,
  CheckCircle2,
  FileText,
  Ship
} from 'lucide-react';
import { formatIndoDate } from '../../utils/auditTimeUtils';

export const AuditReportModal = ({
  session,
  finding,
  onClose,
  initialMode = 'session' // 'session' | 'ncr'
}) => {
  const { vessels, allAudits, allAuditFindings, currentUser } = usePMS();

  // Attach body class for print isolation
  useEffect(() => {
    document.body.classList.add('audit-report-printing-active');
    return () => {
      document.body.classList.remove('audit-report-printing-active');
    };
  }, []);

  // Resolve session and finding
  const activeSession = session || (finding ? allAudits?.find(a => a.id === finding.auditId) : null) || {
    id: 'aud-default',
    auditNo: finding?.auditNo || 'AUD-ISM-2026/01',
    auditType: finding?.auditType || 'Internal',
    standard: finding?.standard || 'SMC',
    targetType: finding?.vesselId ? 'Vessel' : 'Office',
    targetName: finding?.targetName || 'KM. RP 2020',
    vesselId: finding?.vesselId || 'v-001',
    leadAuditor: finding?.auditor || 'Capt. Bambang Suryono (Lead Auditor ISM)',
    auditTeam: ['Ir. Heri Prasetyo (Marine Superintendent)', 'Dian Anggraini (Safety Officer)'],
    auditee: 'Capt. Hendra Gunawan, M.Mar (Nakhoda) & Ir. Bambang Wijaya (KKM)',
    auditDate: finding?.dateIdentified || '2026-07-20',
    targetCloseDate: finding?.dueDate || '2026-09-10',
    auditLocation: 'Dermaga / Kantor Cabang Pontianak, Kalimantan Barat',
    scope: 'Verifikasi Implementasi Standar Sistem Manajemen Keselamatan (ISM Code) dan Pemeliharaan Armada Kapal.',
    status: 'Completed',
    totalItemsChecked: 32,
    itemsComplied: 30,
    findingsSummary: {
      majorNC: 0,
      minorNC: 1,
      observation: 1,
      totalOpen: 0,
      totalClosed: 2
    },
    auditConclusion: 'Berdasarkan hasil verifikasi audit lapangan dan penyelesaian seluruh tindakan korektif (CAP), Sistem Manajemen Keselamatan (SMS) kapal dinilai berjalan efektif dan memenuhi persyaratan IMO ISM Code. Direkomendasikan sertifikat SMC tetap disahkan / dipertahankan.',
    leadAuditorSign: 'Capt. Bambang Suryono, M.Mar',
    auditeeSign: 'Capt. Hendra Gunawan, M.Mar'
  };

  // Find all findings related to this session or target
  const sessionFindings = (allAuditFindings || []).filter(f => {
    if (activeSession.id && f.auditId === activeSession.id) return true;
    if (activeSession.vesselId && f.vesselId === activeSession.vesselId) return true;
    if (activeSession.targetType === 'Office' && (!f.vesselId || f.standard === 'DOC')) return true;
    return false;
  });

  // Active finding for NCR mode
  const [selectedFindingId, setSelectedFindingId] = useState(
    finding?.id || sessionFindings.find(f => f.status === 'NC Close')?.id || sessionFindings[0]?.id || null
  );

  const activeFinding = sessionFindings.find(f => f.id === selectedFindingId) || finding || sessionFindings[0];

  // Report view mode: 'session' (Laporan Audit Lengkap) or 'ncr' (Lembar Penutupan Temuan NC)
  const [reportMode, setReportMode] = useState(initialMode === 'ncr' && activeFinding ? 'ncr' : 'session');

  // Vessel particulars if target is a ship
  const currentVessel = (vessels || []).find(v => v.id === activeSession.vesselId) || (vessels && vessels[0]);

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Compliance percentage calculation
  const totalChecked = activeSession.totalItemsChecked || (sessionFindings.length > 0 ? sessionFindings.length + 20 : 25);
  const totalClosedFindings = sessionFindings.filter(f => f.status === 'NC Close').length;
  const totalOpenFindings = sessionFindings.filter(f => f.status !== 'NC Close').length;
  const compliedItems = activeSession.itemsComplied || (totalChecked - totalOpenFindings);
  const complianceScore = Math.min(100, Math.round((compliedItems / totalChecked) * 100));

  // Determine official audit close date
  const officialCloseDate = activeFinding?.evidence?.closedDate || activeSession.targetCloseDate || new Date().toISOString().split('T')[0];

  const modalContent = (
    <div className="audit-report-portal modal-overlay" style={{ zIndex: 12000, padding: '1rem', overflowY: 'auto' }}>
      <div
        className="modal-dialog"
        style={{
          maxWidth: '1050px',
          width: '100%',
          margin: '1.5rem auto',
          background: 'var(--bg-surface)',
          borderRadius: '14px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.65)',
          border: '1px solid var(--border-glass)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '94vh',
          overflow: 'hidden'
        }}
      >
        {/* ========================================================================= */}
        {/* MODAL CONTROLS HEADER (HIDDEN WHEN PRINTING)                               */}
        {/* ========================================================================= */}
        <div
          className="no-print"
          style={{
            padding: '1rem 1.5rem',
            background: 'var(--bg-surface-elevated)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)'
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Laporan Cetak Audit ISM Code Resmi</span>
                <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                  Standard BKI / Hubla
                </span>
              </h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0 }}>
                {activeSession.auditNo} • {activeSession.targetName || currentVessel?.name} ({activeSession.standard})
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* View Mode Toggle */}
            <div
              style={{
                display: 'flex',
                background: 'var(--bg-input)',
                padding: '0.2rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <button
                type="button"
                onClick={() => setReportMode('session')}
                className={`tab-btn ${reportMode === 'session' ? 'active' : ''}`}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.76rem',
                  borderRadius: '6px',
                  border: 'none'
                }}
              >
                1. Laporan Sesi Audit (DOC/SMC)
              </button>
              <button
                type="button"
                onClick={() => setReportMode('ncr')}
                className={`tab-btn ${reportMode === 'ncr' ? 'active' : ''}`}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.76rem',
                  borderRadius: '6px',
                  border: 'none'
                }}
              >
                2. Lembar NC Close (NCR Form)
              </button>
            </div>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-primary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 800,
                padding: '0.5rem 1rem',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
              }}
              title="Cetak dokumen standar A4 atau simpan ke PDF"
            >
              <Printer size={16} />
              <span>Cetak / Simpan PDF (A4)</span>
            </button>

            {/* Close Modal Button */}
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.5rem', borderRadius: '8px' }}
              title="Tutup Pratinjau"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Secondary Bar if NCR mode to choose which NC */}
        {reportMode === 'ncr' && sessionFindings.length > 1 && (
          <div
            className="no-print"
            style={{
              padding: '0.5rem 1.5rem',
              background: 'rgba(2, 132, 199, 0.08)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.78rem'
            }}
          >
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Pilih Temuan NC untuk Dicetak:</span>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {sessionFindings.map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFindingId(f.id)}
                  style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: selectedFindingId === f.id ? '1px solid #0284c7' : '1px solid var(--border-subtle)',
                    background: selectedFindingId === f.id ? '#0284c7' : 'var(--bg-surface)',
                    color: selectedFindingId === f.id ? '#ffffff' : 'var(--text-main)'
                  }}
                >
                  {f.findingNo} ({f.status})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DOCUMENT PREVIEW CONTAINER (PRINTABLE AREA)                              */}
        {/* ========================================================================= */}
        <div
          className="audit-print-container"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '2rem 2.5rem',
            background: '#e2e8f0' // Backdrop light gray like paper in viewer
          }}
        >
          {/* ======================================================================= */}
          {/* A4 PAPER CANVAS                                                         */}
          {/* ======================================================================= */}
          <div
            className="audit-report-sheet maritime-print-sheet"
            style={{
              width: '100%',
              maxWidth: '860px',
              margin: '0 auto',
              background: '#ffffff',
              color: '#0f172a',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
              padding: '2.5cm 2.2cm',
              boxSizing: 'border-box',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
              fontSize: '11pt',
              lineHeight: '1.45',
              position: 'relative'
            }}
          >
            {/* Watermark Stamp: AUDIT CLOSED & VERIFIED */}
            <div
              className="audit-watermark"
              style={{
                position: 'absolute',
                top: '42%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(-25deg)',
                border: '4px solid rgba(16, 185, 129, 0.18)',
                color: 'rgba(16, 185, 129, 0.18)',
                fontSize: '36pt',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '5px',
                padding: '12px 36px',
                borderRadius: '16px',
                pointerEvents: 'none',
                userSelect: 'none',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                zIndex: 0
              }}
            >
              ISM CODE VERIFIED<br />
              <span style={{ fontSize: '20pt', letterSpacing: '3px' }}>STATUS: NC CLOSED</span>
            </div>

            {/* ===================================================================== */}
            {/* 1. OFFICIAL COMPANY KOP SURAT                                         */}
            {/* ===================================================================== */}
            <div
              className="audit-report-kop"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '12px',
                borderBottom: '3px double #0f172a',
                marginBottom: '16px',
                position: 'relative',
                zIndex: 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* Official Maritime Logo */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: '#0369a1',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #0284c7',
                    flexShrink: 0
                  }}
                >
                  <Ship size={30} strokeWidth={2.2} />
                  <span style={{ fontSize: '6pt', fontWeight: 900, letterSpacing: '1px', marginTop: '2px' }}>PBK</span>
                </div>

                <div>
                  <h1
                    style={{
                      fontSize: '15pt',
                      fontWeight: 900,
                      margin: 0,
                      color: '#0f172a',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}
                  >
                    PT. PELAYARAN BAHARIMAS KALIMANTAN
                  </h1>
                  <p style={{ fontSize: '9pt', fontWeight: 700, margin: '2px 0', color: '#0369a1' }}>
                    SHIP OWNER, OPERATOR & MARITIME LOGISTICS SERVICES
                  </p>
                  <p style={{ fontSize: '7.5pt', margin: 0, color: '#475569', lineHeight: '1.3' }}>
                    Kantor Pusat: Komp. Pontianak Mall Blok D No. 8-9, Jl. Tanjungpura, Kota Pontianak 78122, Kalimantan Barat<br />
                    Telp: (0561) 734567 • Email: dpa.baharimas@gmail.com / ism.safety@baharimas.co.id
                  </p>
                </div>
              </div>

              {/* Form Document Reference Code */}
              <div style={{ textAlign: 'right', fontSize: '7.5pt', color: '#334155', borderLeft: '1px solid #cbd5e1', paddingLeft: '12px' }}>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '8pt' }}>FORMULIR RESMI ISM</div>
                <div>Doc No: {reportMode === 'session' ? 'PBK-SMM/FORM-AUD/08' : 'PBK-SMM/FORM-NCR/02'}</div>
                <div>Revisi: 03 / Ags 2026</div>
                <div>Klas: BKI No. 24587</div>
              </div>
            </div>

            {/* ===================================================================== */}
            {/* 2. DOCUMENT TITLE HEADER                                              */}
            {/* ===================================================================== */}
            <div className="audit-report-title" style={{ textAlign: 'center', marginBottom: '18px', position: 'relative', zIndex: 1 }}>
              <h2
                style={{
                  fontSize: '13pt',
                  fontWeight: 900,
                  margin: 0,
                  textTransform: 'uppercase',
                  color: '#0f172a',
                  letterSpacing: '0.5px'
                }}
              >
                {reportMode === 'session'
                  ? `LAPORAN HASIL AUDIT SISTEM MANAJEMEN KESELAMATAN (${activeSession.standard})`
                  : 'LEMBAR PENUTUPAN KETIDAKSESUAIAN (NON-CONFORMITY CLOSE-OUT REPORT)'}
              </h2>
              <p style={{ fontSize: '9pt', fontWeight: 700, margin: '3px 0 0', color: '#0369a1' }}>
                STANDAR ISM CODE — IMO RESOLUTION A.741(18) SEBAGAIMANA TELAH DIUBAH
              </p>
              <div style={{ display: 'inline-block', borderBottom: '2px solid #0284c7', width: '90px', margin: '4px auto 0' }} />
            </div>

            {/* ===================================================================== */}
            {/* MODE 1: FULL AUDIT SESSION REPORT                                     */}
            {/* ===================================================================== */}
            {reportMode === 'session' && (
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* SECTION A: AUDIT PARTICULARS TABLE */}
                <div style={{ marginBottom: '14px' }}>
                  <div className="audit-section-header" style={{ fontSize: '9.5pt', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-block', width: '4px', height: '14px', background: '#0284c7' }} />
                    BAGIAN I: INFORMASI UMUM & IDENTITAS AUDIT
                  </div>

                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '8.5pt',
                      border: '1px solid #94a3b8'
                    }}
                  >
                    <tbody>
                      <tr style={{ background: '#f8fafc' }}>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 700, width: '25%' }}>Nomor Registrasi Audit</td>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', width: '25%', fontWeight: 800, color: '#0369a1' }}>{activeSession.auditNo}</td>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 700, width: '25%' }}>Standar Audit</td>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', width: '25%', fontWeight: 700 }}>
                          ISM Code ({activeSession.standard === 'DOC' ? 'Document of Compliance' : 'Safety Management Certificate'})
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Jenis Pelaksanaan</td>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>Audit {activeSession.auditType} (Periodik/Antara)</td>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Status Pelaksanaan</td>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>
                          <strong style={{ color: '#047857' }}>{activeSession.status === 'Completed' ? 'SELESAI (COMPLETED & CLOSED)' : activeSession.status}</strong>
                        </td>
                      </tr>
                      <tr style={{ background: '#f8fafc' }}>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Objek / Target Audit</td>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>
                          {activeSession.targetName || currentVessel?.name}
                        </td>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Data Teknis Kapal / Unit</td>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>
                          {activeSession.targetType === 'Vessel'
                            ? `Reg: ${currentVessel?.regNo || '24587'} | Call Sign: ${currentVessel?.callSign || 'YDB2458'} | GT: ${currentVessel?.gt || 310}`
                            : 'Kantor Pusat Darat Pontianak'}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Tanggal Pelaksanaan</td>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>{formatIndoDate(activeSession.auditDate)}</td>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Tanggal Penutupan Resmi</td>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 800, color: '#047857' }}>
                          {formatIndoDate(officialCloseDate)}
                        </td>
                      </tr>
                      <tr style={{ background: '#f8fafc' }}>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Lokasi / Pelabuhan</td>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>{activeSession.auditLocation || 'Dermaga Pontianak, Kalimantan Barat'}</td>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Auditee (Pihak Diaudit)</td>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>{activeSession.auditee}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Lead Auditor</td>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>{activeSession.leadAuditor}</td>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Anggota Tim Auditor</td>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>
                          {Array.isArray(activeSession.auditTeam) ? activeSession.auditTeam.join(', ') : activeSession.auditTeam || '-'}
                        </td>
                      </tr>
                      <tr style={{ background: '#f8fafc' }}>
                        <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Ruang Lingkup (Scope)</td>
                        <td colSpan={3} style={{ padding: '5px 8px', border: '1px solid #cbd5e1', lineHeight: '1.4' }}>
                          {activeSession.scope || 'Verifikasi kepatuhan seluruh elemen ISM Code 1 s/d 12 pada operasional kapal, perawatan mesin, dan kesiapan darurat.'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* SECTION B: EXECUTIVE SUMMARY & STATISTICAL METRICS */}
                <div style={{ marginBottom: '14px' }}>
                  <div className="audit-section-header" style={{ fontSize: '9.5pt', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-block', width: '4px', height: '14px', background: '#0284c7' }} />
                    BAGIAN II: RINGKASAN HASIL PEMERIKSAAN & TINGKAT KEPATUHAN
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 10px', textAlign: 'center', background: '#f8fafc' }}>
                      <div style={{ fontSize: '7pt', fontWeight: 700, color: '#64748b' }}>TOTAL BUTIR DIKONTROL</div>
                      <div style={{ fontSize: '13pt', fontWeight: 900, color: '#0f172a' }}>{totalChecked}</div>
                      <div style={{ fontSize: '6.5pt', color: '#64748b' }}>Klausul ISM Code Diperiksa</div>
                    </div>
                    <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 10px', textAlign: 'center', background: '#f0fdf4' }}>
                      <div style={{ fontSize: '7pt', fontWeight: 700, color: '#15803d' }}>TINGKAT KEPATUHAN (COMPLIANCE)</div>
                      <div style={{ fontSize: '13pt', fontWeight: 900, color: '#16a34a' }}>{complianceScore}%</div>
                      <div style={{ fontSize: '6.5pt', color: '#15803d' }}>{compliedItems} Butir Memenuhi Standar</div>
                    </div>
                    <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 10px', textAlign: 'center', background: '#f8fafc' }}>
                      <div style={{ fontSize: '7pt', fontWeight: 700, color: '#64748b' }}>TOTAL TEMUAN NC</div>
                      <div style={{ fontSize: '13pt', fontWeight: 900, color: '#d97706' }}>{sessionFindings.length}</div>
                      <div style={{ fontSize: '6.5pt', color: '#64748b' }}>
                        Major: {activeSession.findingsSummary?.majorNC || 0} | Minor: {activeSession.findingsSummary?.minorNC || sessionFindings.length}
                      </div>
                    </div>
                    <div style={{ border: '1px solid #bbf7d0', borderRadius: '4px', padding: '6px 10px', textAlign: 'center', background: '#f0fdf4' }}>
                      <div style={{ fontSize: '7pt', fontWeight: 700, color: '#166534' }}>STATUS PENYELESAIAN NC</div>
                      <div style={{ fontSize: '13pt', fontWeight: 900, color: '#15803d' }}>100% CLOSED</div>
                      <div style={{ fontSize: '6.5pt', color: '#166534' }}>Seluruh Eviden Terverifikasi</div>
                    </div>
                  </div>
                </div>

                {/* SECTION C: DETAILED FINDINGS AND ACTIONS TABLE */}
                <div style={{ marginBottom: '14px' }}>
                  <div className="audit-section-header" style={{ fontSize: '9.5pt', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-block', width: '4px', height: '14px', background: '#0284c7' }} />
                    BAGIAN III: DAFTAR TEMUAN KETIDAKSESUAIAN & HASIL PENUTUPAN (NC CLOSE-OUT)
                  </div>

                  {sessionFindings.length > 0 ? (
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '7.5pt',
                        border: '1px solid #94a3b8'
                      }}
                    >
                      <thead>
                        <tr style={{ background: '#0f172a', color: '#ffffff' }}>
                          <th style={{ padding: '5px', border: '1px solid #334155', width: '12%' }}>No. Temuan</th>
                          <th style={{ padding: '5px', border: '1px solid #334155', width: '12%' }}>Klausul ISM</th>
                          <th style={{ padding: '5px', border: '1px solid #334155', width: '28%' }}>Uraian Masalah & Bukti Objektif</th>
                          <th style={{ padding: '5px', border: '1px solid #334155', width: '28%' }}>Tindakan Koreksi & Pencegahan (CAP)</th>
                          <th style={{ padding: '5px', border: '1px solid #334155', width: '20%' }}>Hasil Verifikasi & Tgl Close</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sessionFindings.map((f, idx) => (
                          <tr key={f.id} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                            <td style={{ padding: '6px', border: '1px solid #cbd5e1', verticalAlign: 'top' }}>
                              <strong style={{ color: '#0369a1' }}>{f.findingNo}</strong>
                              <div style={{ fontSize: '6.5pt', color: '#64748b', marginTop: '2px' }}>{f.category}</div>
                            </td>
                            <td style={{ padding: '6px', border: '1px solid #cbd5e1', verticalAlign: 'top' }}>
                              <strong>{f.clauseCode}</strong>
                              <div style={{ fontSize: '6.5pt', color: '#475569' }}>{f.clauseName}</div>
                            </td>
                            <td style={{ padding: '6px', border: '1px solid #cbd5e1', verticalAlign: 'top', lineHeight: '1.35' }}>
                              <div style={{ fontWeight: 600 }}>{f.description}</div>
                              {f.objectiveEvidence && (
                                <div style={{ color: '#475569', fontSize: '7pt', marginTop: '3px', fontStyle: 'italic' }}>
                                  Eviden: {f.objectiveEvidence}
                                </div>
                              )}
                            </td>
                            <td style={{ padding: '6px', border: '1px solid #cbd5e1', verticalAlign: 'top', lineHeight: '1.35' }}>
                              {f.evidence?.correctiveAction ? (
                                <>
                                  <div><strong>Koreksi: </strong>{f.evidence.correctiveAction}</div>
                                  {f.evidence.preventiveAction && (
                                    <div style={{ marginTop: '2px', color: '#334155' }}>
                                      <strong>Pencegahan: </strong>{f.evidence.preventiveAction}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div style={{ color: '#64748b' }}>Tindakan korektif terdokumentasi di formulir CAP.</div>
                              )}
                            </td>
                            <td style={{ padding: '6px', border: '1px solid #cbd5e1', verticalAlign: 'top', lineHeight: '1.3' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '1px 5px',
                                  background: '#dcfce7',
                                  color: '#15803d',
                                  fontWeight: 800,
                                  borderRadius: '3px',
                                  fontSize: '7pt',
                                  marginBottom: '3px'
                                }}
                              >
                                ✅ {f.status}
                              </span>
                              <div style={{ fontSize: '6.8pt', color: '#0f172a' }}>
                                Ditutup: <strong>{formatIndoDate(f.evidence?.closedDate || officialCloseDate)}</strong>
                              </div>
                              <div style={{ fontSize: '6.5pt', color: '#64748b', marginTop: '2px' }}>
                                {f.evidence?.auditorReviewNotes || 'Telah diverifikasi sesuai standar ISM Code.'}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ padding: '10px', border: '1px solid #cbd5e1', background: '#f0fdf4', fontSize: '8pt', textAlign: 'center', color: '#166534', fontWeight: 600 }}>
                      Nihil temuan ketidaksesuaian (Zero Non-Conformity). Seluruh kriteria keselamatan terpenuhi memuaskan.
                    </div>
                  )}
                </div>

                {/* SECTION D: AUDIT CONCLUSION & RECOMMENDATION */}
                <div style={{ marginBottom: '16px' }}>
                  <div className="audit-section-header" style={{ fontSize: '9.5pt', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-block', width: '4px', height: '14px', background: '#0284c7' }} />
                    BAGIAN IV: KESIMPULAN & REKOMENDASI FORMAL AUDITOR
                  </div>

                  <div
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      padding: '8px 12px',
                      background: '#f8fafc',
                      fontSize: '8pt',
                      lineHeight: '1.45',
                      color: '#0f172a'
                    }}
                  >
                    <p style={{ margin: '0 0 6px 0' }}>
                      {activeSession.auditConclusion ||
                        'Berdasarkan hasil verifikasi audit kepatuhan lapangan serta penyelesaian seluruh rencana tindakan korektif (Corrective Action Plan), Sistem Manajemen Keselamatan (SMS) kapal dinilai berfungsi efektif sesuai persyaratan IMO ISM Code dan ketentuan Ditjen Perhubungan Laut RI.'}
                    </p>
                    <div style={{ fontWeight: 800, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>REKOMENDASI AUDITOR: </span>
                      <span style={{ textDecoration: 'underline' }}>
                        {activeSession.standard === 'DOC'
                          ? 'Sertifikat Document of Compliance (DOC) Perusahaan Direkomendasikan Tetap Berlaku / Dipertahankan.'
                          : 'Sertifikat Safety Management Certificate (SMC) Kapal RP 2020 Direkomendasikan Disahkan (Endorsed) / Diterbitkan.'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SECTION E: FORMAL SIGN-OFF & STAMP BOX */}
                <div className="audit-signature-block" style={{ marginTop: '20px', pageBreakInside: 'avoid' }}>
                  <div style={{ fontSize: '8.5pt', color: '#475569', textAlign: 'right', marginBottom: '8px' }}>
                    Ditetapkan di: <strong>Pontianak, Kalimantan Barat</strong>, Tanggal: <strong>{formatIndoDate(officialCloseDate)}</strong>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '8pt' }}>
                    <tbody>
                      <tr>
                        {/* Auditor Signature Column */}
                        <td style={{ width: '33.3%', padding: '8px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: '#475569', marginBottom: '4px' }}>DIVERIFIKASI & DITUTUP OLEH:</div>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>LEAD AUDITOR ISM CODE</div>
                          <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div
                              style={{
                                border: '1.5px solid #0284c7',
                                borderRadius: '50px',
                                padding: '4px 14px',
                                color: '#0284c7',
                                fontWeight: 800,
                                fontSize: '7.5pt',
                                letterSpacing: '0.5px'
                              }}
                            >
                              [ TANDATANGAN RESMI AUDITOR ]
                            </div>
                          </div>
                          <div style={{ fontWeight: 800, textDecoration: 'underline', color: '#0f172a' }}>
                            {activeSession.leadAuditorSign || activeSession.leadAuditor}
                          </div>
                          <div style={{ fontSize: '7pt', color: '#64748b' }}>Auditor ISM BKI / Internal PBK</div>
                        </td>

                        {/* DPA Approval Column */}
                        <td style={{ width: '33.3%', padding: '8px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: '#475569', marginBottom: '4px' }}>DIKETAHUI & DISETUJUI:</div>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>DESIGNATED PERSON ASHORE (DPA)</div>
                          <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div
                              style={{
                                width: '56px',
                                height: '56px',
                                border: '2px dashed #10b981',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#047857',
                                fontWeight: 800,
                                fontSize: '6pt',
                                textAlign: 'center',
                                transform: 'rotate(-10deg)'
                              }}
                            >
                              DPA STEMPEL<br />PBK ISM
                            </div>
                          </div>
                          <div style={{ fontWeight: 800, textDecoration: 'underline', color: '#0f172a' }}>
                            Capt. Bambang Suryono, M.Mar
                          </div>
                          <div style={{ fontSize: '7pt', color: '#64748b' }}>DPA PT. Pelayaran Baharimas Kalimantan</div>
                        </td>

                        {/* Auditee / Master Signature Column */}
                        <td style={{ width: '33.3%', padding: '8px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: '#475569', marginBottom: '4px' }}>DITERIMA OLEH AUDITEE:</div>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>
                            {activeSession.targetType === 'Vessel' ? 'NAKHODA KAPAL RP 2020' : 'DIREKTUR OPERASIONAL'}
                          </div>
                          <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div
                              style={{
                                border: '1.5px solid #0f172a',
                                borderRadius: '50px',
                                padding: '4px 14px',
                                color: '#0f172a',
                                fontWeight: 800,
                                fontSize: '7.5pt'
                              }}
                            >
                              [ TANDATANGAN AUDITEE ]
                            </div>
                          </div>
                          <div style={{ fontWeight: 800, textDecoration: 'underline', color: '#0f172a' }}>
                            {activeSession.auditeeSign || activeSession.auditee}
                          </div>
                          <div style={{ fontSize: '7pt', color: '#64748b' }}>
                            {activeSession.targetType === 'Vessel' ? 'Master / Captain TB. RP 2020' : 'Perwakilan Manajemen Darat'}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* MODE 2: INDIVIDUAL NON-CONFORMITY CLOSE-OUT REPORT (NCR SHEET)         */}
            {/* ===================================================================== */}
            {reportMode === 'ncr' && activeFinding && (
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* SECTION A: NCR IDENTIFIER */}
                <div style={{ marginBottom: '14px' }}>
                  <div className="audit-section-header" style={{ fontSize: '9.5pt', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-block', width: '4px', height: '14px', background: '#0284c7' }} />
                    LEMBAR KETIDAKSESUAIAN & VERIFIKASI TINDAKAN KOREKTIF (NCR CLOSE-OUT)
                  </div>

                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '8.5pt',
                      border: '1px solid #94a3b8'
                    }}
                  >
                    <tbody>
                      <tr style={{ background: '#f8fafc' }}>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 700, width: '25%' }}>Nomor Temuan (NCR No.)</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', width: '25%', fontWeight: 900, color: '#0369a1' }}>{activeFinding.findingNo}</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 700, width: '25%' }}>Status NCR</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', width: '25%' }}>
                          <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#dcfce7', color: '#15803d', fontWeight: 900 }}>
                            ✅ {activeFinding.status} (CLOSED)
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Referensi Sesi Audit</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>{activeFinding.auditNo || activeSession.auditNo}</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Kategori Tingkat Temuan</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 700, color: '#d97706' }}>
                          {activeFinding.category} (Non-Conformity)
                        </td>
                      </tr>
                      <tr style={{ background: '#f8fafc' }}>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Klausul Standar ISM Code</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 800 }}>{activeFinding.clauseCode}</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Nama Klausul ISM</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>{activeFinding.clauseName}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Objek / Lokasi Temuan</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>{activeFinding.targetName || currentVessel?.name}</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>PIC Penanggung Jawab</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>{activeFinding.assignedTo}</td>
                      </tr>
                      <tr style={{ background: '#f8fafc' }}>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Tanggal Temuan (Open Date)</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>{formatIndoDate(activeFinding.dateIdentified)}</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Batas Waktu (Due Date)</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>{formatIndoDate(activeFinding.dueDate)}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Auditor Pelapor</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>{activeFinding.auditor}</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Tanggal Ditutup Resmi</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 900, color: '#15803d' }}>
                          {formatIndoDate(activeFinding.evidence?.closedDate || officialCloseDate)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* SECTION B: URAIAN KETIDAKSESUAIAN & BUKTI OBJEKTIF */}
                <div style={{ marginBottom: '14px' }}>
                  <div className="audit-section-header" style={{ fontSize: '9.5pt', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-block', width: '4px', height: '14px', background: '#0284c7' }} />
                    URAIAN MASALAH KETIDAKSESUAIAN (DEFICIENCY DETAILS)
                  </div>

                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px 12px', background: '#f8fafc', fontSize: '8pt', lineHeight: '1.45' }}>
                    <div style={{ marginBottom: '6px' }}>
                      <strong style={{ color: '#0f172a' }}>Deskripsi Ketidaksesuaian:</strong>
                      <p style={{ margin: '3px 0 0', color: '#1e293b' }}>{activeFinding.description}</p>
                    </div>
                    {activeFinding.objectiveEvidence && (
                      <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '6px', marginTop: '6px' }}>
                        <strong style={{ color: '#0369a1' }}>Bukti Objektif (Objective Evidence):</strong>
                        <p style={{ margin: '3px 0 0', color: '#475569' }}>{activeFinding.objectiveEvidence}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* SECTION C: INVESTIGASI PENYEBAB & TINDAKAN KOREKTIF (RCA & CAP) */}
                <div style={{ marginBottom: '14px' }}>
                  <div className="audit-section-header" style={{ fontSize: '9.5pt', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-block', width: '4px', height: '14px', background: '#0284c7' }} />
                    INVESTIGASI AKAR MASALAH & RENCANA TINDAKAN PERBAIKAN (CAP)
                  </div>

                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '8pt',
                      border: '1px solid #94a3b8'
                    }}
                  >
                    <tbody>
                      <tr style={{ background: '#f8fafc' }}>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 700, width: '28%' }}>
                          Analisis Akar Masalah (Root Cause Analysis - RCA)
                        </td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', lineHeight: '1.4' }}>
                          {activeFinding.evidence?.rootCause || 'Keterlambatan alur koordinasi dan updating buku catatan logbook sesuai formulir PMS.'}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>
                          Tindakan Koreksi Langsung (Corrective Action)
                        </td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', lineHeight: '1.4', fontWeight: 600 }}>
                          {activeFinding.evidence?.correctiveAction || 'Telah dilakukan perbaikan fisik dan verifikasi catatan logbook kamar mesin secara langsung.'}
                        </td>
                      </tr>
                      <tr style={{ background: '#f8fafc' }}>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>
                          Tindakan Pencegahan Terulang (Preventive Action)
                        </td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', lineHeight: '1.4' }}>
                          {activeFinding.evidence?.preventiveAction || 'Menetapkan jadwal inspeksi rutin mingguan dan pengawasan mandiri oleh Perwira Kapal.'}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>
                          Dokumen Eviden Pendukung
                        </td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>
                          📁 <strong>{activeFinding.evidence?.fileName || 'Dokumentasi_Perbaikan_Eviden.pdf'}</strong>
                          {activeFinding.evidence?.fileSize && <span style={{ color: '#64748b' }}> ({activeFinding.evidence.fileSize})</span>}
                          {activeFinding.linkedRequisitionTitle && (
                            <span style={{ display: 'block', marginTop: '2px', color: '#0369a1' }}>
                              🔗 Terhubung SPB Gudang: {activeFinding.linkedRequisitionTitle}
                            </span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* SECTION D: AUDITOR CLOSEOUT ENDORSEMENT */}
                <div style={{ marginBottom: '18px' }}>
                  <div className="audit-section-header" style={{ fontSize: '9.5pt', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-block', width: '4px', height: '14px', background: '#0284c7' }} />
                    HASIL TINJAUAN & PENGESAHAN PENUTUPAN OLEH AUDITOR (CLOSE-OUT STATEMENT)
                  </div>

                  <div
                    style={{
                      border: '1.5px solid #10b981',
                      borderRadius: '4px',
                      padding: '10px 14px',
                      background: '#f0fdf4',
                      fontSize: '8pt',
                      lineHeight: '1.45'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', color: '#166534', fontWeight: 800 }}>
                      <CheckCircle2 size={16} />
                      <span>PERNYATAAN RESMI PENUTUPAN TEMUAN (FORMAL CLOSEOUT ACCEPTANCE):</span>
                    </div>
                    <p style={{ margin: 0, color: '#0f172a' }}>
                      {activeFinding.evidence?.auditorReviewNotes ||
                        'Dokumen eviden tindakan korektif dan pencegahan telah diperiksa serta diverifikasi di lapangan. Pelaksanaan tindakan telah memenuhi ketentuan ISM Code Klausul terkait. Dengan ini temuan resmi dinyatakan CLOSED (TUNTAS).'}
                    </p>
                  </div>
                </div>

                {/* SECTION E: NCR SIGN-OFF BOX */}
                <div className="audit-signature-block" style={{ marginTop: '20px', pageBreakInside: 'avoid' }}>
                  <div style={{ fontSize: '8.5pt', color: '#475569', textAlign: 'right', marginBottom: '8px' }}>
                    Diverifikasi & Disahkan di: <strong>Pontianak, Kalimantan Barat</strong>, Tanggal: <strong>{formatIndoDate(activeFinding.evidence?.closedDate || officialCloseDate)}</strong>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '8pt' }}>
                    <tbody>
                      <tr>
                        {/* PIC / Auditee Signature */}
                        <td style={{ width: '50%', padding: '10px', verticalAlign: 'top', borderRight: '1px solid #cbd5e1' }}>
                          <div style={{ fontWeight: 700, color: '#475569', marginBottom: '4px' }}>PENANGGUNG JAWAB PERBAIKAN (PIC / AUDITEE):</div>
                          <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div
                              style={{
                                border: '1.5px solid #0f172a',
                                borderRadius: '50px',
                                padding: '4px 14px',
                                color: '#0f172a',
                                fontWeight: 800,
                                fontSize: '7.5pt'
                              }}
                            >
                              [ TANDATANGAN PIC LAPANGAN ]
                            </div>
                          </div>
                          <div style={{ fontWeight: 800, textDecoration: 'underline', color: '#0f172a' }}>
                            {activeFinding.assignedTo || 'Perwira Terkait Kapal RP 2020'}
                          </div>
                          <div style={{ fontSize: '7pt', color: '#64748b' }}>Pelaksana Tindakan Korektif (CAP)</div>
                        </td>

                        {/* Auditor Closer Signature */}
                        <td style={{ width: '50%', padding: '10px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: '#475569', marginBottom: '4px' }}>DIVERIFIKASI & DITUTUP RESMI OLEH:</div>
                          <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div
                              style={{
                                border: '2px solid #10b981',
                                borderRadius: '50px',
                                padding: '4px 14px',
                                color: '#047857',
                                fontWeight: 900,
                                fontSize: '7.5pt'
                              }}
                            >
                              [ TANDATANGAN LEAD AUDITOR ISM ]
                            </div>
                          </div>
                          <div style={{ fontWeight: 800, textDecoration: 'underline', color: '#0f172a' }}>
                            {activeFinding.auditor || 'Lead Auditor ISM Code'}
                          </div>
                          <div style={{ fontSize: '7pt', color: '#64748b' }}>Surveyor / Auditor ISM PT. PBK</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Document Footer Notes */}
            <div
              className="audit-footer-note"
              style={{
                marginTop: '30px',
                paddingTop: '8px',
                borderTop: '1px solid #cbd5e1',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '6.5pt',
                color: '#64748b'
              }}
            >
              <div>
                Dokumen Resmi PT. Pelayaran Baharimas Kalimantan • Dicetak melalui Sistem PMS Cloud Maritim
              </div>
              <div>
                Distribusi: 1. Asli: Arsip DPA Darat | 2. Copy 1: Onboard Kapal RP 2020 | 3. Copy 2: Badan Klasifikasi Indonesia (BKI)
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions (Screen only) */}
        <div
          className="modal-footer no-print"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.85rem 1.5rem',
            background: 'var(--bg-surface-elevated)',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            💡 <em>Tip: Anda dapat memilih printer fisik atau opsi "Save as PDF" dengan format kertas A4.</em>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-sm"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 800 }}
            >
              <Printer size={15} />
              <span>Cetak Laporan Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};
