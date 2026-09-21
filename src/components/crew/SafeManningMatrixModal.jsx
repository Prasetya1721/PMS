import React, { useState, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
import { BaharimasEmblem } from '../common/BaharimasLogo';
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  CheckCircle2,
  AlertTriangle,
  Printer,
  X,
  ArrowLeft
} from 'lucide-react';

export const SafeManningMatrixModal = ({ selectedVesselId, onClose }) => {
  const {
    vessels,
    allCrew,
    crew,
    allCrewCertificates,
    safeManningStandards
  } = usePMS();

  const [viewMode, setViewMode] = useState('interactive'); // 'interactive' | 'print_preview'

  const currentVessel = useMemo(() => {
    return vessels.find(v => v.id === selectedVesselId) || vessels[0] || null;
  }, [vessels, selectedVesselId]);

  // Find standard for vessel type
  const vesselTypeStandard = useMemo(() => {
    if (!currentVessel) return null;
    const vType = currentVessel.type?.toLowerCase() || '';
    const standards = safeManningStandards || [];

    const found = standards.find(s => {
      const stType = s.vesselType.toLowerCase();
      if (vType.includes('tug') && stType.includes('tug')) return true;
      if (vType.includes('tongkang') && stType.includes('tongkang')) return true;
      if (vType.includes('lct') && stType.includes('lct')) return true;
      return stType === vType;
    });

    return found || standards[0];
  }, [currentVessel, safeManningStandards]);

  // Onboard crew for this vessel
  const onboardCrew = useMemo(() => {
    return (allCrew || crew || []).filter(c => c.vesselId === currentVessel?.id && c.status === 'Onboard');
  }, [allCrew, crew, currentVessel]);

  // Key Officers for Signatures
  const captainName = useMemo(() => {
    return (
      currentVessel?.masterCaptain ||
      currentVessel?.particulars?.masterCaptain ||
      onboardCrew.find(c => c.rank?.toLowerCase().includes('nakhoda') || c.rank?.toLowerCase().includes('master'))?.name ||
      'Capt. Hendra Gunawan, M.Mar'
    );
  }, [currentVessel, onboardCrew]);

  const chiefName = useMemo(() => {
    return (
      currentVessel?.chiefEngineer ||
      currentVessel?.particulars?.chiefEngineer ||
      onboardCrew.find(c => c.rank?.toLowerCase().includes('kkm') || c.rank?.toLowerCase().includes('chief engineer'))?.name ||
      'Ir. Bambang Wijaya (KKM)'
    );
  }, [currentVessel, onboardCrew]);

  const chiefOfficerName = useMemo(() => {
    return (
      onboardCrew.find(c => c.rank?.toLowerCase().includes('mualim') || c.rank?.toLowerCase().includes('chief officer'))?.name ||
      'M. Yusuf Pratama, S.Tr.Pel'
    );
  }, [onboardCrew]);

  // Evaluate positions
  const matrixEvaluation = useMemo(() => {
    if (!vesselTypeStandard?.positions) return { items: [], isCompliant: true, deficiencies: [] };

    const deficiencies = [];
    const items = vesselTypeStandard.positions.map(reqPos => {
      // Find crew matching this rank
      const matchedCrew = onboardCrew.filter(c => {
        const cRank = c.rank.toLowerCase();
        const pTitle = reqPos.rankTitle.toLowerCase();
        if (pTitle.includes('nakhoda') && (cRank.includes('nakhoda') || cRank.includes('master'))) return true;
        if (pTitle.includes('mualim') && (cRank.includes('mualim') || cRank.includes('chief mate'))) return true;
        if (pTitle.includes('kkm') && (cRank.includes('kkm') || cRank.includes('chief engineer'))) return true;
        if (pTitle.includes('masinis') && cRank.includes('masinis')) return true;
        if (pTitle.includes('juru mudi') && (cRank.includes('juru mudi') || cRank.includes('kelasi') || cRank.includes('abk'))) return true;
        if (pTitle.includes('juru minyak') && (cRank.includes('juru minyak') || cRank.includes('oiler'))) return true;
        if (pTitle.includes('koki') && (cRank.includes('koki') || cRank.includes('cook'))) return true;
        return cRank === pTitle;
      });

      const countPresent = matchedCrew.length;
      const isCountMet = countPresent >= reqPos.count;

      // Check certificate expiry for matched crew
      const crewWithCertStatus = matchedCrew.map(c => {
        const certs = (allCrewCertificates || []).filter(cert => cert.crewId === c.id);
        const hasExpired = certs.some(cert => cert.status === 'Expired' || cert.daysUntilExpiry <= 0);
        return {
          ...c,
          hasExpiredCert: hasExpired,
          certificatesCount: certs.length
        };
      });

      const hasInvalidCrew = crewWithCertStatus.some(c => c.hasExpiredCert);

      if (!isCountMet && reqPos.mandatory) {
        deficiencies.push(`Kekurangan ${reqPos.rankTitle}: dibutuhkan ${reqPos.count}, terisi ${countPresent}`);
      }
      if (hasInvalidCrew && reqPos.mandatory) {
        deficiencies.push(`Sertifikat STCW perwira ${reqPos.rankTitle} telah kadaluarsa`);
      }

      return {
        ...reqPos,
        presentCount: countPresent,
        isSatisfied: isCountMet && !hasInvalidCrew,
        matchedCrew: crewWithCertStatus
      };
    });

    const isCompliant = deficiencies.length === 0;
    return { items, isCompliant, deficiencies };
  }, [vesselTypeStandard, onboardCrew, allCrewCertificates]);

  const handlePrint = () => {
    setViewMode('print_preview');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(10, 16, 30, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.25rem'
    }}>
      <div className="modal-dialog modal-dialog-large glass-card" style={{
        width: '100%',
        maxWidth: viewMode === 'print_preview' ? '920px' : '980px',
        maxHeight: '92vh',
        overflowY: 'auto',
        borderRadius: '16px',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header (No-Print) */}
        <div className="no-print" style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(to right, rgba(2, 132, 199, 0.12), rgba(15, 23, 42, 0.6))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: matrixEvaluation.isCompliant ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: matrixEvaluation.isCompliant ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: matrixEvaluation.isCompliant ? '#10b981' : '#f87171'
            }}>
              {matrixEvaluation.isCompliant ? <ShieldCheck size={26} /> : <ShieldAlert size={26} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  {viewMode === 'print_preview'
                    ? 'Format Cetak Lembar Evaluasi Safe Manning'
                    : 'Kepatuhan Formasi Awak Kapal (Safe Manning Matrix)'}
                </h3>
                <span className={`badge ${matrixEvaluation.isCompliant ? 'badge-success' : 'badge-danger'}`}>
                  {matrixEvaluation.isCompliant ? 'Memenuhi Syarat Kelaiklautan' : 'Non-Compliant (Formasi Tidak Lengkap)'}
                </span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                Kapal: <strong style={{ color: 'var(--text-main)' }}>{currentVessel?.name}</strong> ({currentVessel?.type}) • Standar Kemenhub DJPL & STCW 2010.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {viewMode === 'interactive' ? (
              <button
                type="button"
                onClick={handlePrint}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
              >
                <Printer size={15} />
                <span>Format Cetak A4 / PDF</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setViewMode('interactive')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                >
                  <ArrowLeft size={15} />
                  <span>Kembali ke Matrix</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-primary"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', fontWeight: 700 }}
                >
                  <Printer size={15} />
                  <span>Cetak Dokumen Sekarang</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Content Body: INTERACTIVE SCREEN MODE */}
        {viewMode === 'interactive' ? (
          <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Status Alert Banner */}
            {!matrixEvaluation.isCompliant ? (
              <div style={{
                padding: '1rem 1.25rem',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem'
              }}>
                <AlertTriangle size={20} color="#f87171" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#f87171', fontSize: '0.9rem', display: 'block', marginBottom: '4px' }}>
                    PERINGATAN: Formasi Pengawakan Kapal Belum Memenuhi Syarat Kelaiklautan!
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.825rem', color: 'var(--text-main)' }}>
                    {matrixEvaluation.deficiencies.map((d, i) => (
                      <li key={i} style={{ marginBottom: '2px' }}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div style={{
                padding: '0.85rem 1.25rem',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <CheckCircle2 size={18} color="#10b981" />
                <span style={{ fontSize: '0.85rem', color: '#10b981' }}>
                  Seluruh formasi jabatan wajib di atas kapal telah terisi oleh perwira/ABK berijazah sah dan sertifikat STCW aktif.
                </span>
              </div>
            )}

            {/* Table Matrix */}
            <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Jabatan Pengawakan</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Syarat Ijazah (COC / COP)</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', width: '100px' }}>Wajib Formasi</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', width: '100px' }}>Onboard Riil</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Awak Kapal Bertugas</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', width: '110px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {matrixEvaluation.items.map((pos) => (
                    <tr key={pos.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <strong style={{ display: 'block', fontSize: '0.875rem' }}>{pos.rankTitle}</strong>
                        <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                          Dept. {pos.department} {pos.mandatory ? '• Wajib' : '• Opsional'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ color: '#38bdf8', fontWeight: 600, display: 'block' }}>{pos.requiredCoc}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{pos.requiredCop}</span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 700 }}>
                        {pos.count} Orang
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 800, color: pos.isSatisfied ? '#10b981' : '#f87171' }}>
                        {pos.presentCount} Orang
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        {pos.matchedCrew.length === 0 ? (
                          <span style={{ color: '#f87171', fontStyle: 'italic', fontSize: '0.78rem' }}>
                            [KOSONG / BELUM ADA AWAK]
                          </span>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            {pos.matchedCrew.map((c, i) => (
                              <div key={c.id || i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>• {c.name}</span>
                                {c.hasExpiredCert && (
                                  <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>
                                    Sertifikat STCW Expired!
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                        <span className={`badge ${pos.isSatisfied ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.72rem' }}>
                          {pos.isSatisfied ? 'Lengkap' : 'Deficiency'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span>Berdasarkan: <strong>Safe Manning Certificate No. SM-DJPL/2025/PBK</strong></span>
              <span>Total Kru Onboard Saat Ini: <strong>{onboardCrew.length} Orang</strong></span>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* PRINT PREVIEW / FORMAL A4 DOCUMENT SHEET                                 */
          /* ========================================================================= */
          <div style={{ padding: '1.5rem', background: '#ffffff', color: '#0f172a' }}>
            <div
              className="particulars-sheet safe-manning-print-sheet maritime-print-sheet"
              style={{
                background: '#ffffff',
                color: '#0f172a',
                padding: '2.5rem 2rem',
                fontFamily: '"Segoe UI", Arial, sans-serif',
                margin: '0 auto',
                maxWidth: '920px'
              }}
            >
              {/* 1. KOP SURAT RESMI */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                borderBottom: '3px double #0f172a',
                paddingBottom: '0.85rem',
                marginBottom: '1.25rem'
              }}>
                <BaharimasEmblem size={56} />
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    PT. PELAYARAN BAHARIMAS KALIMANTAN
                  </h2>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0369a1', margin: '2px 0 0 0', textTransform: 'uppercase' }}>
                    FLEET MANNING & CREWING MANAGEMENT DIVISION
                  </p>
                  <p style={{ fontSize: '0.72rem', color: '#475569', margin: '2px 0 0 0' }}>
                    Jl. Rahadi Usman No. 88, Pontianak, Kalimantan Barat 78111 • Telp: (0561) 741234 • Email: crewing@baharimas.co.id
                  </p>
                  <p style={{ fontSize: '0.68rem', color: '#64748b', margin: '1px 0 0 0' }}>
                    SIUPAL: B.XX-248/AL.001/DJPL • Sesuai Standar Ditjen Perhubungan Laut RI & Konvensi Internasional STCW 1978/2010
                  </p>
                </div>
                <div style={{ textAlign: 'right', borderLeft: '1px solid #cbd5e1', paddingLeft: '1.25rem' }}>
                  <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>KODE FORMULIR RESMI</span>
                  <strong style={{ fontSize: '0.85rem', color: '#0f172a', fontFamily: 'monospace' }}>FORM-STCW-SM/REV.02</strong>
                  <span style={{ fontSize: '0.68rem', color: '#0284c7', display: 'block', marginTop: '3px', fontWeight: 700 }}>
                    SOLAS REG. I/14
                  </span>
                </div>
              </div>

              {/* 2. JUDUL DOKUMEN */}
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  color: '#0f172a',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  textDecoration: 'underline'
                }}>
                  SURAT KETERANGAN EVALUASI KELAIKLAUTAN PENGAWAKAN KAPAL
                </h3>
                <p style={{ fontSize: '0.82rem', fontStyle: 'italic', color: '#64748b', margin: '2px 0 0 0' }}>
                  (MINIMUM SAFE MANNING COMPLIANCE REPORT & CREW STCW AUDIT)
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0369a1', fontFamily: 'monospace' }}>
                    NOMOR: SM-DJPL/2026/PBK-{currentVessel?.id?.toUpperCase() || '001'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>•</span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: matrixEvaluation.isCompliant ? '#dcfce7' : '#fee2e2',
                    color: matrixEvaluation.isCompliant ? '#15803d' : '#b91c1c',
                    border: matrixEvaluation.isCompliant ? '1px solid #86efac' : '1px solid #fca5a5'
                  }}>
                    STATUS: {matrixEvaluation.isCompliant ? 'MEMENUHI SYARAT KELAIKLAUTAN' : 'NON-COMPLIANT / DEFISIENSI'}
                  </span>
                </div>
              </div>

              {/* 3. METADATA KAPAL & SERTIFIKAT SAFE MANNING */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem',
                fontSize: '0.8rem',
                background: '#f8fafc',
                padding: '0.85rem 1rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex' }}>
                    <span style={{ width: '140px', color: '#64748b' }}>Nama Kapal:</span>
                    <strong style={{ color: '#0f172a' }}>{currentVessel?.name} ({currentVessel?.type})</strong>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <span style={{ width: '140px', color: '#64748b' }}>Call Sign / IMO:</span>
                    <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>{currentVessel?.callSign || '-'} / {currentVessel?.imo || '-'}</strong>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <span style={{ width: '140px', color: '#64748b' }}>Gross Tonnage (GT):</span>
                    <strong style={{ color: '#0f172a' }}>{currentVessel?.particulars?.grossTonnage || '185'} GT</strong>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <span style={{ width: '140px', color: '#64748b' }}>Tenaga Mesin (BHP):</span>
                    <strong style={{ color: '#0f172a' }}>{currentVessel?.particulars?.mainEnginePower || '2x 1200'} BHP</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex' }}>
                    <span style={{ width: '150px', color: '#64748b' }}>Daerah Pelayaran:</span>
                    <strong style={{ color: '#0f172a' }}>Kawasan Indonesia / Near Coastal</strong>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <span style={{ width: '150px', color: '#64748b' }}>Sertifikat DJPL No:</span>
                    <strong style={{ color: '#0369a1', fontFamily: 'monospace' }}>SM-DJPL/2025/PBK</strong>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <span style={{ width: '150px', color: '#64748b' }}>Total Kru Onboard:</span>
                    <strong style={{ color: '#0f172a' }}>{onboardCrew.length} Orang Awak</strong>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <span style={{ width: '150px', color: '#64748b' }}>Tanggal Audit:</span>
                    <strong style={{ color: '#0f172a' }}>
                      {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </strong>
                  </div>
                </div>
              </div>

              {/* 4. TABEL MATRIKS FORMASI AWAK */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#0f172a',
                  marginBottom: '0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <Users size={14} color="#0284c7" />
                  <span>Matriks Formasi Jabatan, Standar Ijazah STCW, & Evaluasi Kelaiklautan</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', border: '1px solid #0f172a' }}>
                  <thead>
                    <tr style={{ background: '#e2e8f0', color: '#0f172a', borderBottom: '1.5px solid #0f172a' }}>
                      <th style={{ border: '1px solid #0f172a', padding: '6px', width: '30px', textAlign: 'center' }}>NO</th>
                      <th style={{ border: '1px solid #0f172a', padding: '6px 8px', textAlign: 'left' }}>JABATAN (STCW RANK)</th>
                      <th style={{ border: '1px solid #0f172a', padding: '6px 8px', textAlign: 'left', width: '160px' }}>SYARAT IJAZAH (COC / COP)</th>
                      <th style={{ border: '1px solid #0f172a', padding: '6px', width: '60px', textAlign: 'center' }}>WAJIB</th>
                      <th style={{ border: '1px solid #0f172a', padding: '6px', width: '60px', textAlign: 'center' }}>RIIL</th>
                      <th style={{ border: '1px solid #0f172a', padding: '6px 8px', textAlign: 'left' }}>AWAK KAPAL ONBOARD & SERTIFIKAT</th>
                      <th style={{ border: '1px solid #0f172a', padding: '6px', width: '90px', textAlign: 'center' }}>EVALUASI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matrixEvaluation.items.map((pos, idx) => (
                      <tr key={pos.id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                        <td style={{ border: '1px solid #cbd5e1', padding: '6px', textAlign: 'center', fontFamily: 'monospace' }}>
                          {idx + 1}
                        </td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>
                          <strong style={{ display: 'block', color: '#0f172a' }}>{pos.rankTitle}</strong>
                          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Dept. {pos.department}</span>
                        </td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>
                          <span style={{ fontWeight: 700, color: '#0369a1', display: 'block' }}>{pos.requiredCoc}</span>
                          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{pos.requiredCop}</span>
                        </td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '6px', textAlign: 'center', fontWeight: 700 }}>
                          {pos.count}
                        </td>
                        <td style={{
                          border: '1px solid #cbd5e1',
                          padding: '6px',
                          textAlign: 'center',
                          fontWeight: 800,
                          color: pos.isSatisfied ? '#15803d' : '#b91c1c'
                        }}>
                          {pos.presentCount}
                        </td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>
                          {pos.matchedCrew.length === 0 ? (
                            <span style={{ color: '#b91c1c', fontStyle: 'italic', fontWeight: 600 }}>
                              [BELUM TERISI / VACANT]
                            </span>
                          ) : (
                            pos.matchedCrew.map((c, i) => (
                              <div key={i} style={{ fontSize: '0.75rem', color: '#0f172a' }}>
                                • <strong>{c.name}</strong>
                                {c.hasExpiredCert && (
                                  <span style={{ color: '#b91c1c', fontWeight: 700, marginLeft: '4px' }}>
                                    (STCW EXPIRED!)
                                  </span>
                                )}
                              </div>
                            ))
                          )}
                        </td>
                        <td style={{
                          border: '1px solid #cbd5e1',
                          padding: '6px',
                          textAlign: 'center',
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          background: pos.isSatisfied ? '#f0fdf4' : '#fef2f2',
                          color: pos.isSatisfied ? '#15803d' : '#b91c1c'
                        }}>
                          {pos.isSatisfied ? 'MEMENUHI' : 'DEFISIENSI'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 5. KESIMPULAN & PERNYATAAN KELAIKLAUTAN */}
              <div style={{
                border: '1px solid #0f172a',
                borderRadius: '6px',
                padding: '0.85rem 1rem',
                marginBottom: '1.5rem',
                background: matrixEvaluation.isCompliant ? '#f8fafc' : '#fff1f2'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px', textTransform: 'uppercase' }}>
                  PERNYATAAN RESMI KELAIKLAUTAN PENGAWAKAN (SEAWORTHINESS DECLARATION):
                </div>
                <p style={{ margin: 0, fontSize: '0.76rem', lineHeight: 1.5, color: '#334155' }}>
                  {matrixEvaluation.isCompliant ? (
                    <>
                      Berdasarkan hasil pemeriksaan dokumen dan verifikasi fisik terhadap awak kapal <strong>{currentVessel?.name}</strong>,
                      dinyatakan bahwa kapal telah diawaki oleh personil yang memenuhi kualifikasi standar kompetensi minimum kepelautan (STCW 1978/2010),
                      sehat jasmani/rohani, dan memiliki sertifikat keahlian serta keterampilan yang masih berlaku.
                      Kapal dinyatakan <strong>LAIK LAUT (SEAWORTHY)</strong> dari segi formasi keselamatan pengawakan untuk melakukan pelayaran.
                    </>
                  ) : (
                    <>
                      Berdasarkan hasil pemeriksaan dokumen, terdapat <strong>defisiensi / ketidaksesuaian formasi</strong> di atas kapal <strong>{currentVessel?.name}</strong>.
                      Kapal dinyatakan <strong>BELUM MEMENUHI KELAIKLAUTAN PENGAWAKAN</strong> hingga seluruh kekurangan personil wajib dan/atau pembaruan sertifikat STCW dipenuhi.
                      Pemberitahuan resmi diteruskan ke Crewing & Marine Superintendent untuk mobilisasi segera.
                    </>
                  )}
                </p>
              </div>

              {/* 6. KOLOM TANDA TANGAN 4 PIHAK MARITIM RESMI */}
              <div style={{
                marginTop: '1.5rem',
                borderTop: '1.5px solid #0f172a',
                paddingTop: '1rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                textAlign: 'center',
                fontSize: '0.75rem',
                pageBreakInside: 'avoid'
              }}>
                <div>
                  <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>Diperiksa Oleh:</p>
                  <p style={{ fontWeight: 700, margin: 0, color: '#0f172a' }}>Perwira Geladak (Mualim I)</p>
                  <div style={{ height: '55px' }} />
                  <p style={{ fontWeight: 800, textDecoration: 'underline', margin: 0, color: '#0f172a' }}>{chiefOfficerName}</p>
                  <p style={{ fontSize: '0.68rem', color: '#64748b', margin: '2px 0 0 0' }}>Chief Officer</p>
                </div>

                <div>
                  <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>Diperiksa Oleh:</p>
                  <p style={{ fontWeight: 700, margin: 0, color: '#0f172a' }}>Kepala Kamar Mesin</p>
                  <div style={{ height: '55px' }} />
                  <p style={{ fontWeight: 800, textDecoration: 'underline', margin: 0, color: '#0f172a' }}>{chiefName}</p>
                  <p style={{ fontSize: '0.68rem', color: '#64748b', margin: '2px 0 0 0' }}>Chief Engineer</p>
                </div>

                <div>
                  <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>Mengetahui & Menyetujui:</p>
                  <p style={{ fontWeight: 700, margin: 0, color: '#0f172a' }}>Nakhoda Kapal</p>
                  <div style={{ height: '55px' }} />
                  <p style={{ fontWeight: 800, textDecoration: 'underline', margin: 0, color: '#0f172a' }}>{captainName}</p>
                  <p style={{ fontSize: '0.68rem', color: '#64748b', margin: '2px 0 0 0' }}>Master / Captain</p>
                </div>

                <div>
                  <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>Divalidasi Kantor Pusat:</p>
                  <p style={{ fontWeight: 700, margin: 0, color: '#0f172a' }}>Marine Superintendent / DPA</p>
                  <div style={{ height: '55px' }} />
                  <p style={{ fontWeight: 800, textDecoration: 'underline', margin: 0, color: '#0f172a' }}>Capt. Bambang Suryono</p>
                  <p style={{ fontSize: '0.68rem', color: '#64748b', margin: '2px 0 0 0' }}>DPA PT. Baharimas K.</p>
                </div>
              </div>

              {/* 7. FOOTER NOTE */}
              <div style={{
                marginTop: '1.25rem',
                borderTop: '1px dashed #cbd5e1',
                paddingTop: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.68rem',
                color: '#64748b'
              }}>
                <span>Dicetak melalui: Sistem PMS Kapal Baharimas Terintegrasi</span>
                <span>Standar Mutu: ISM Code DOC-04/2026 • Port Clearance Compliant</span>
                <span>Halaman 1 dari 1</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
