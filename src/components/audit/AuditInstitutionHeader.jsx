import React from 'react';
import { isBKIOrganization } from '../../data/auditMasterData';
import { BaharimasEmblem, BaharimasReportLogo } from '../common/BaharimasLogo';

export { BaharimasReportLogo };

// =============================================================================
// LOGO RESMI MASING-MASING LEMBAGA (VEKTOR SVG PRESIFI TINGGI)
// =============================================================================

/**
 * Logo Resmi Biro Klasifikasi Indonesia (BKI)
 * Warna Navy Blue khas BKI dengan aksen titik oranye
 */
export const BkiLogo = ({ width = 85, height = 40 }) => (
  <svg width={width} height={height} viewBox="0 0 125 50" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <g fill="#003b6f">
      {/* b */}
      <path d="M10 4v42h11v-4.5c2.8 3.5 7.2 5.5 12 5.5 10 0 17-7.8 17-18s-7-18-17-18c-4.8 0-9.2 2-12 5.5V4H10zm16 16c4.5 0 8 3.6 8 9s-3.5 9-8 9-8-3.6-8-9 3.5-9 8-9z" />
      {/* k */}
      <path d="M57 4v42h11V29.5l12.5 16.5H95L78.5 24 93.5 11H79.5L68 22.5V4H57z" />
      {/* i */}
      <path d="M102 11v35h11V11h-11z" />
    </g>
    {/* Dot of 'i' in BKI vibrant orange */}
    <circle cx="107.5" cy="5.5" r="5.5" fill="#f97316" />
  </svg>
);

/**
 * Logo Resmi Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP / Kemenhub)
 * Lambang Kemaritiman Kemenhub: Lingkaran Biru Navy, Jangkar Emas, Sayap Navigasi
 */
export const KsopLogo = ({ width = 55, height = 55 }) => (
  <svg width={width} height={height} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <circle cx="30" cy="30" r="28" fill="#0f2b5c" stroke="#d97706" strokeWidth="2" />
    <circle cx="30" cy="30" r="24" fill="#ffffff" />
    {/* Bintang Emas Puncak */}
    <path d="M30 8l1.5 3.5h3.5l-2.8 2 1 3.5-3.2-2.2-3.2 2.2 1-3.5-2.8-2h3.5L30 8z" fill="#d97706" />
    {/* Jangkar Kesyahbandaran Emas */}
    <circle cx="30" cy="19" r="3" stroke="#d97706" strokeWidth="2" fill="none" />
    <path d="M30 22v22M23 27h14" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M18 35c2.5 7 7.5 9 12 9s9.5-2 12-9" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
    {/* Sayap Navigasi Biru */}
    <path d="M14 28c3-1 7 1 10 3M46 28c-3-1-7 1-10 3" stroke="#0f2b5c" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="30" cy="44" r="2" fill="#d97706" />
  </svg>
);

/**
 * Logo Resmi Direktorat Jenderal Perhubungan Laut (Ditjen Hubla)
 * Lambang Garuda / Perhubungan Laut Kenegaraan Emas & Biru Tua
 */
export const HublaLogo = ({ width = 55, height = 55 }) => (
  <svg width={width} height={height} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <circle cx="30" cy="30" r="28" fill="#f8fafc" stroke="#b45309" strokeWidth="2" />
    {/* Sayap Garuda Emas */}
    <path d="M30 11l3 6h7l-5.5 4.5 2 7-6.5-4-6.5 4 2-7-5.5-4.5h7l3-6z" fill="#d97706" />
    {/* Perisai Perhubungan */}
    <path d="M18 29c3-2 8-3 12-1 4-2 9-1 12 1-2 9-6 16-12 19-6-3-10-10-12-19z" fill="#0f2b5c" stroke="#d97706" strokeWidth="1.5" />
    {/* Jangkar Putih Dalam Perisai */}
    <path d="M30 32v12M24 37h12" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M22 40c2 4 5 5 8 5s6-1 8-5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

/**
 * Logo Resmi PT. Pelayaran Baharimas Kalimantan (PBK)
 * Menggunakan Vector Emblem Resmi Baharimas
 */
export const PbkLogo = ({ width = 52, height = 52, size }) => (
  <BaharimasEmblem size={size || Math.min(width, height)} />
);

/**
 * Logo Recognized Organization (RO) / Lembaga Ditunjuk Lainnya
 */
export const CustomRoLogo = ({ width = 55, height = 55, name = 'RO' }) => (
  <svg width={width} height={height} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <path d="M30 6L10 16v18c0 14 20 22 20 22s20-8 20-22V16L30 6z" fill="#047857" stroke="#065f46" strokeWidth="2" />
    <circle cx="30" cy="27" r="10" fill="#ffffff" />
    <path d="M25 27l3 3 7-7" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <text x="30" y="52" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
      {String(name).substring(0, 8).toUpperCase()}
    </text>
  </svg>
);

// =============================================================================
// RESOLVER BRANDING LEMBAGA AUDIT
// =============================================================================

export const getInstitutionBranding = (session, finding) => {
  const rawOrg = session?.externalOrganization || finding?.externalOrganization || '';
  const isExternal = session?.auditType === 'External' || finding?.auditType === 'External';

  const orgStr = typeof rawOrg === 'object' && rawOrg !== null
    ? (rawOrg.name || rawOrg.shortName || '')
    : String(rawOrg || '');

  const isBKI = isBKIOrganization(orgStr) || (isExternal && /bki/i.test(orgStr));
  const isKSOP = /ksop|kesyahbandaran/i.test(orgStr);
  const isHubla = /hubla|perhubungan laut|kemenhub/i.test(orgStr) && !isKSOP;
  const isInternal = !isExternal || /internal|baharimas|pbk/i.test(orgStr);

  if (isBKI) {
    return {
      type: 'BKI',
      isBKI: true,
      name: 'BIRO KLASIFIKASI INDONESIA',
      shortName: 'BKI',
      headerStyle: 'bki',
      docTitleId: 'CHECKLIST UNTUK SISTEM MANAJEMEN KESELAMATAN KAPAL',
      docTitleEn: 'CHECKLIST FOR SHIPBOARD SAFETY MANAGEMENT SYSTEM',
      legalBasisId: 'Audit berdasarkan ketentuan INTERNATIONAL CONVENTION FOR THE SAFETY OF LIFE AT SEA, 1974 Chapter IX dan ISM Code.',
      legalBasisEn: 'Audit under the provisions of the INTERNATIONAL CONVENTION FOR THE SAFETY OF LIFE AT SEA, 1974 Chapter IX and ISM Code.',
      docCode: 'F23.14.06-2024 Rev 05',
      docRevision: 'Document Revision 00',
      formNumber: session?.reportId || '00954PK26_F23_14_06-2024 Rev05',
      address: 'Kantor Pusat: Jl. Yos Sudarso No. 38-40, Tanjung Priok, Jakarta 14320 / Cabang Pontianak',
      contact: 'Telp: (021) 4301017 • Email: smc@bki.co.id • Web: www.bki.co.id',
      primaryColor: '#003b6f',
      accentColor: '#f97316',
      authorityTag: 'Biro Klasifikasi Indonesia (Recognized Organization)',
      LogoComponent: BaharimasReportLogo
    };
  }

  if (isKSOP) {
    return {
      type: 'KSOP',
      isBKI: false,
      ministry: 'KEMENTERIAN PERHUBUNGAN',
      directorate: 'DIREKTORAT JENDERAL PERHUBUNGAN LAUT',
      name: 'KANTOR KESYAHBANDARAN DAN OTORITAS PELABUHAN KELAS II PONTIANAK',
      shortName: 'KSOP Pontianak',
      headerStyle: 'government',
      docTitleId: 'LAPORAN PEMERIKSAAN KELAIKLAUTAN KAPAL & KESELAMATAN STATUTORI',
      docTitleEn: 'PORT STATE & STATUTORY MARITIME SAFETY INSPECTION REPORT',
      legalBasisId: 'Berdasarkan UU No. 17 Tahun 2008 tentang Pelayaran dan Regulasi Statutori Kelaiklautan Kapal.',
      legalBasisEn: 'Under the Provisions of Shipping Act No. 17 / 2008 and Statutory Maritime Regulations.',
      docCode: 'KSOP-PK/STAT-AUD/2026',
      docRevision: 'Rev 02 / 2026',
      formNumber: session?.reportId || 'KSOP-PTK/INSP-SMC/2026',
      address: 'Jl. Rahadi Usman No. 1, Kota Pontianak, Kalimantan Barat 78111',
      contact: 'Telp: (0561) 732284 • Email: ksop_pontianak@dephub.go.id',
      primaryColor: '#0f2b5c',
      accentColor: '#d97706',
      authorityTag: 'KSOP Kelas II Pontianak (Flag State Maritime Authority)',
      LogoComponent: KsopLogo
    };
  }

  if (isHubla) {
    return {
      type: 'HUBLA',
      isBKI: false,
      ministry: 'KEMENTERIAN PERHUBUNGAN REPUBLIK INDONESIA',
      directorate: 'DIREKTORAT JENDERAL PERHUBUNGAN LAUT',
      name: 'DIREKTORAT PERKAPALAN DAN KEPELAUTAN',
      shortName: 'Ditjen Hubla',
      headerStyle: 'government',
      docTitleId: 'LAPORAN AUDIT SERTIFIKASI SISTEM MANAJEMEN KESELAMATAN (ISM CODE)',
      docTitleEn: 'OFFICIAL FLAG STATE SAFETY MANAGEMENT AUDIT REPORT',
      legalBasisId: 'Berdasarkan Keputusan Direktur Jenderal Perhubungan Laut dan Konvensi SOLAS 1974 Bab IX.',
      legalBasisEn: 'In Accordance with Directorate General of Sea Transportation Decrees & SOLAS 1974 Chapter IX.',
      docCode: 'HUBLA-DIRKAPEL/ISM-DOC-SMC/2026',
      docRevision: 'Rev 01 / 2026',
      formNumber: session?.reportId || 'HUBLA/AUDIT-ISM/2026',
      address: 'Gedung Karya Lt. 12-17, Jl. Medan Merdeka Barat No. 8, Jakarta Pusat 10110',
      contact: 'Telp: (021) 3811308 • Website: hubla.dephub.go.id',
      primaryColor: '#0f2b5c',
      accentColor: '#b45309',
      authorityTag: 'Ditjen Hubla (Direktorat Perkapalan dan Kepelautan)',
      LogoComponent: HublaLogo
    };
  }

  if (!isInternal) {
    // Custom Lembaga Audit Eksternal Lainnya (Input Manual)
    const displayName = orgStr || 'LEMBAGA AUDIT EKSTERNAL RESMI';
    return {
      type: 'CUSTOM',
      isBKI: false,
      ministry: 'RECOGNIZED ORGANIZATION (RO) / STATUTORY AUDIT',
      directorate: 'MARITIME SAFETY CERTIFICATION DIVISION',
      name: displayName.toUpperCase(),
      shortName: displayName,
      headerStyle: 'custom_ro',
      docTitleId: 'LAPORAN RESMI AUDIT EKSTERNAL SISTEM MANAJEMEN KESELAMATAN',
      docTitleEn: 'OFFICIAL STATUTORY MARITIME SAFETY MANAGEMENT AUDIT REPORT',
      legalBasisId: 'Pelaksanaan Audit Statutori Kelaiklautan ISM Code (IMO Res. A.741(18)).',
      legalBasisEn: 'Statutory Verification under IMO Resolution A.741(18) as amended.',
      docCode: session?.reportId || 'EXT-RO/AUDIT/2026',
      docRevision: 'Rev 01 / 2026',
      formNumber: session?.reportId || 'AUD-EXT-SMC/2026',
      address: 'Kantor Operasional Penunjukan / Wilayah Kerja Maritim',
      contact: 'Statutory Safety Verification & Marine Inspection',
      primaryColor: '#047857',
      accentColor: '#059669',
      authorityTag: displayName,
      LogoComponent: (props) => <CustomRoLogo {...props} name={displayName} />
    };
  }

  // Internal PBK (PT. Pelayaran Baharimas Kalimantan)
  return {
    type: 'INTERNAL',
    isBKI: false,
    ministry: null,
    directorate: 'SAFETY MANAGEMENT SYSTEM (SMS) • DPA & QHSE DEPARTMENT',
    name: 'PT. PELAYARAN BAHARIMAS KALIMANTAN',
    shortName: 'PT. PBK (Internal)',
    headerStyle: 'internal',
    docTitleId: 'LAPORAN AUDIT INTERNAL SISTEM MANAJEMEN KESELAMATAN (ISM CODE)',
    docTitleEn: 'INTERNAL SAFETY MANAGEMENT SYSTEM AUDIT REPORT',
    legalBasisId: 'Berdasarkan Kebijakan K3LH & Prosedur Manual ISM Code PT. Pelayaran Baharimas Kalimantan.',
    legalBasisEn: 'Pursuant to Company SMS Manual & Safety Policy (IMO Res. A.741(18)).',
    docCode: session?.standard === 'DOC' ? 'PBK-SMM/FORM-AUD/08' : 'PBK-SMM/FORM-SMC/04',
    docRevision: 'Rev 05 / 2026',
    formNumber: session?.reportId || 'PBK-INT-AUD/2026',
    address: 'Komp. Pontianak Mall Blok D No. 8-9, Jl. Tanjungpura, Kota Pontianak 78122, Kalimantan Barat',
    contact: 'Telp: (0561) 734567 • Email: dpa.baharimas@gmail.com / ism.safety@baharimas.co.id',
    primaryColor: '#0284c7',
    accentColor: '#0369a1',
    authorityTag: 'PT. Pelayaran Baharimas Kalimantan (Internal DPA / QHSE)',
    LogoComponent: BaharimasReportLogo
  };
};

// =============================================================================
// KOMPONEN KOP SURAT RESMI SESUAI STANDAR MASING-MASING LEMBAGA
// =============================================================================

export const AuditInstitutionHeader = ({ branding, session, vessel }) => {
  const { LogoComponent } = branding;

  // 1. KOP RESMI KHUSUS BKI (Sesuai F23.14.06-2024 Rev 05)
  if (branding.type === 'BKI') {
    return (
      <div className="bki-kop-wrapper" style={{ marginBottom: '10px' }}>
        {/* Top bar: Navy blue with orange wedge on right */}
        <div style={{ height: '14px', background: '#003b6f', position: 'relative', marginBottom: '8px', borderRadius: '2px 2px 0 0', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '90px', background: '#ff6600', transform: 'skewX(-25deg)', transformOrigin: 'top right' }} />
        </div>

        {/* Report ID running text */}
        <div style={{ textAlign: 'right', fontSize: '7pt', color: '#000000', marginBottom: '4px', fontWeight: 600 }}>
          Report id: PT. PELAYARAN BAHARIMAS KALIMANTAN - {vessel?.name || session?.targetName || 'Armada Kapal'} – {session?.reportId || '0859-PK/ISM-SMC/2026'}
        </div>

        {/* Header Box: Logo PT Pelayaran Baharimas at left, Title table at right */}
        <div style={{ display: 'flex', alignItems: 'stretch', gap: '10px', border: '1.5px solid #000000', padding: '6px 10px', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '125px', padding: '4px 6px', borderRight: '1px solid #cbd5e1' }}>
            <BaharimasReportLogo />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '9pt', fontWeight: 900, color: '#000000', letterSpacing: '0.2px', textTransform: 'uppercase' }}>
              {branding.docTitleId}
            </div>
            <div style={{ fontSize: '7.5pt', fontWeight: 800, color: '#1e3a8a', fontStyle: 'italic', marginBottom: '3px' }}>
              {branding.docTitleEn}
            </div>
            <div style={{ fontSize: '6.5pt', color: '#1e293b', lineHeight: 1.3 }}>
              {branding.legalBasisId}<br />
              <span style={{ fontStyle: 'italic', color: '#475569' }}>{branding.legalBasisEn}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. KOP RESMI PEMERINTAH (KSOP / HUBLA KEMENHUB)
  if (branding.headerStyle === 'government') {
    return (
      <div className="gov-kop-wrapper" style={{ marginBottom: '14px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', paddingBottom: '8px' }}>
          <div style={{ flexShrink: 0 }}>
            <LogoComponent width={55} height={55} />
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            {branding.ministry && (
              <div style={{ fontSize: '10pt', fontWeight: 800, color: '#000000', letterSpacing: '1px' }}>
                {branding.ministry}
              </div>
            )}
            {branding.directorate && (
              <div style={{ fontSize: '9pt', fontWeight: 800, color: '#0f2b5c', letterSpacing: '0.5px' }}>
                {branding.directorate}
              </div>
            )}
            <div style={{ fontSize: '11pt', fontWeight: 900, color: '#000000', margin: '2px 0', letterSpacing: '0.5px' }}>
              {branding.name}
            </div>
            <div style={{ fontSize: '7pt', color: '#334155', lineHeight: 1.3 }}>
              {branding.address} • {branding.contact}
            </div>
          </div>
        </div>
        {/* Double black line for government official letterhead */}
        <div style={{ borderTop: '2.5px solid #000000', borderBottom: '1px solid #000000', height: '2px', margin: '2px 0 10px 0' }} />
      </div>
    );
  }

  // 3. KOP RESMI INTERNAL PT. BAHARIMAS KALIMANTAN (PBK)
  if (branding.headerStyle === 'internal') {
    return (
      <div className="pbk-kop-wrapper" style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '2.5px solid #0284c7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ flexShrink: 0 }}>
              <LogoComponent width={52} height={52} />
            </div>
            <div>
              <div style={{ fontSize: '12pt', fontWeight: 900, color: '#0369a1', letterSpacing: '0.3px' }}>
                {branding.name}
              </div>
              <div style={{ fontSize: '8pt', fontWeight: 800, color: '#0c4a6e', margin: '1px 0' }}>
                {branding.directorate}
              </div>
              <div style={{ fontSize: '7pt', color: '#475569', lineHeight: 1.3 }}>
                {branding.address}<br />
                {branding.contact}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '7pt', color: '#334155', borderLeft: '1px solid #cbd5e1', paddingLeft: '10px' }}>
            <div style={{ fontWeight: 800, color: '#0369a1', fontSize: '7.5pt' }}>FORMULIR RESMI DPA PBK</div>
            <div>Doc No: <strong>{branding.docCode}</strong></div>
            <div>Revisi: {branding.docRevision}</div>
            <div>Status: Terakreditasi ISM</div>
          </div>
        </div>
      </div>
    );
  }

  // 4. KOP RESMI LEMBAGA EKSTERNAL LAINNYA (CUSTOM RO)
  return (
    <div className="custom-ro-kop-wrapper" style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '2.5px solid #047857' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flexShrink: 0 }}>
            <LogoComponent width={50} height={50} />
          </div>
          <div>
            <div style={{ fontSize: '11pt', fontWeight: 900, color: '#047857', letterSpacing: '0.3px' }}>
              {branding.name}
            </div>
            <div style={{ fontSize: '7.5pt', fontWeight: 800, color: '#065f46' }}>
              {branding.ministry} • {branding.directorate}
            </div>
            <div style={{ fontSize: '7pt', color: '#475569' }}>
              {branding.address} • {branding.contact}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '7pt', color: '#334155', borderLeft: '1px solid #cbd5e1', paddingLeft: '10px' }}>
          <div style={{ fontWeight: 800, color: '#047857' }}>STATUTORY MARITIME REPORT</div>
          <div>Report No: <strong>{branding.formNumber}</strong></div>
          <div>Lembaga: {branding.shortName}</div>
        </div>
      </div>
    </div>
  );
};
