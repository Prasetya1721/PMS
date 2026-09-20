// Master Ship Certificates & Document Categorization
// PT. Pelayaran Baharimas Kalimantan
// Categories: BKI, Statutory, Asuransi, KSOP, Kesehatan

export const DEMO_CERTIFICATE_CATEGORIES = [
  {
    id: 'BKI',
    label: 'BKI (Biro Klasifikasi Indonesia)',
    code: 'BKI',
    description: 'Sertifikat klasifikasi lambung, mesin, dan survei periodik BKI',
    badgeClass: 'badge-info',
    color: '#38bdf8',
    borderColor: 'rgba(56, 189, 248, 0.35)',
    bgColor: 'rgba(2, 132, 199, 0.12)'
  },
  {
    id: 'Statutory',
    label: 'Statutory (Konvensi & Keselamatan)',
    code: 'STATUTORY',
    description: 'Sertifikat keselamatan konstruksi, radio, perlengkapan, dan pencegahan polusi',
    badgeClass: 'badge-success',
    color: '#10b981',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    bgColor: 'rgba(16, 185, 129, 0.12)'
  },
  {
    id: 'Asuransi',
    label: 'Asuransi (Insurance & CLC)',
    code: 'ASURANSI',
    description: 'Sertifikat jaminan ganti rugi, penyingkiran kerangka kapal (Wreck Removal) & CLC Bunker',
    badgeClass: 'badge-neutral',
    color: '#a855f7',
    borderColor: 'rgba(168, 85, 247, 0.35)',
    bgColor: 'rgba(168, 85, 247, 0.12)'
  },
  {
    id: 'KSOP',
    label: 'KSOP (Kesyahbandaran & Otoritas Pelabuhan)',
    code: 'KSOP',
    description: 'Pas Besar, Surat Ukur, Izin Trayek RPT/PPKA, ISRKL, dan sertifikat servis keselamatan kapal',
    badgeClass: 'badge-warning',
    color: '#f59e0b',
    borderColor: 'rgba(245, 158, 11, 0.35)',
    bgColor: 'rgba(245, 158, 11, 0.12)'
  },
  {
    id: 'Kesehatan',
    label: 'Kesehatan (Port Health / KKP)',
    code: 'KESEHATAN',
    description: 'Sertifikat Sanitasi Kapal (SSCEC), Buku Kesehatan Kapal, dan P3K',
    badgeClass: 'badge-danger',
    color: '#ec4899',
    borderColor: 'rgba(236, 72, 153, 0.35)',
    bgColor: 'rgba(236, 72, 153, 0.12)'
  }
];

// 19 Official Certificates from Authority Checklist & Health Standards
export const DEMO_STANDARD_CERTIFICATE_TEMPLATES = [
  // 1. KSOP
  {
    name: 'Pas Besar',
    category: 'KSOP',
    defaultValidityYears: 5,
    issuer: 'Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP)',
    docPrefix: 'PK.201/KSOP'
  },
  {
    name: 'Surat Ukur',
    category: 'KSOP',
    defaultValidityYears: 10,
    issuer: 'Direktorat Jenderal Perhubungan Laut / KSOP',
    docPrefix: 'SU.102/KSOP'
  },
  {
    name: 'Izin Stasiun Radio Kapal Laut (ISRKL)',
    category: 'KSOP',
    defaultValidityYears: 5,
    issuer: 'Ditjen SDPPI Kominfo / Ditjen Hubla',
    docPrefix: 'ISRKL-HUB'
  },
  {
    name: 'ILR Sertifikat',
    category: 'KSOP',
    defaultValidityYears: 1,
    issuer: 'Stasiun Servis Inflatable Life Raft Terakreditasi KSOP',
    docPrefix: 'ILR-SRV'
  },
  {
    name: 'HRU Sertifikat',
    category: 'KSOP',
    defaultValidityYears: 2,
    issuer: 'Stasiun Servis Keselamatan Maritim KSOP',
    docPrefix: 'HRU-EXP'
  },
  {
    name: 'PMK Sertifikat',
    category: 'KSOP',
    defaultValidityYears: 1,
    issuer: 'Dinas Pemadam & Balai Pengujian Keselamatan KSOP',
    docPrefix: 'PMK-SRV'
  },
  {
    name: 'Ijin Trayek ; RPT/PPKA/PKKA',
    category: 'KSOP',
    defaultValidityYears: 1,
    issuer: 'Direktorat Lalu Lintas Angkutan Laut / KSOP',
    docPrefix: 'RPT/PPKA'
  },

  // 2. BKI
  {
    name: 'Certificate hull / lambung',
    category: 'BKI',
    defaultValidityYears: 5,
    issuer: 'Biro Klasifikasi Indonesia (BKI)',
    docPrefix: 'BKI-HULL'
  },
  {
    name: 'Certificate Machinery / Mesin',
    category: 'BKI',
    defaultValidityYears: 5,
    issuer: 'Biro Klasifikasi Indonesia (BKI)',
    docPrefix: 'BKI-MACH'
  },

  // 3. STATUTORY
  {
    name: 'Cargo Ship Safety Construction Certificate',
    category: 'Statutory',
    defaultValidityYears: 5,
    issuer: 'Ditjen Hubla / BKI Statutory Department',
    docPrefix: 'SAFCON'
  },
  {
    name: 'Cargo Ship Safety Equipment Certificate',
    category: 'Statutory',
    defaultValidityYears: 2,
    issuer: 'Ditjen Hubla / BKI Statutory Department',
    docPrefix: 'SAFEQ'
  },
  {
    name: 'Cargo Ship Safety Radio Certificate',
    category: 'Statutory',
    defaultValidityYears: 5,
    issuer: 'Ditjen Hubla / KSOP Radio Inspection',
    docPrefix: 'SAFRAD'
  },
  {
    name: 'Document Of Compliance (DOC)',
    category: 'Statutory',
    defaultValidityYears: 5,
    issuer: 'Direktorat Jenderal Perhubungan Laut (ISM Code)',
    docPrefix: 'DOC-ISM'
  },
  {
    name: 'Minimum Safe Manning Certificate',
    category: 'Statutory',
    defaultValidityYears: 5,
    issuer: 'Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP)',
    docPrefix: 'MSMC'
  },
  {
    name: 'National Pollution Prevention Certificate',
    category: 'Statutory',
    defaultValidityYears: 5,
    issuer: 'Ditjen Hubla / BKI Statutory (MARPOL)',
    docPrefix: 'SNPP'
  },
  {
    name: 'Anti Fouling Certificate',
    category: 'Statutory',
    defaultValidityYears: 5,
    issuer: 'Ditjen Hubla / BKI (AFS Convention)',
    docPrefix: 'AFS-CERT'
  },
  {
    name: 'Load Line Certificate / Garis Muat',
    category: 'Statutory',
    defaultValidityYears: 5,
    issuer: 'Ditjen Hubla / BKI (PM 39)',
    docPrefix: 'LLC-PM39'
  },

  // 4. ASURANSI
  {
    name: 'Civil Liability For Bunker Pollution Damage Certificate (CLC Bunker)',
    category: 'Asuransi',
    defaultValidityYears: 1,
    issuer: 'Direktorat Jenderal Perhubungan Laut / Club Penjamin',
    docPrefix: 'CLC-BUNKER'
  },
  {
    name: 'Wreck Removal / Asuransi',
    category: 'Asuransi',
    defaultValidityYears: 1,
    issuer: 'PT. Asuransi Jasa Indonesia (Jasindo) / P&I Club',
    docPrefix: 'WRECK-INS'
  },

  // 5. KESEHATAN
  {
    name: 'Ship Sanitation Control Exemption Certificate (SSCEC)',
    category: 'Kesehatan',
    defaultValidityYears: 0.5,
    issuer: 'Balai Karantina Kesehatan / KKP Kelas II',
    docPrefix: 'KKP-SSCEC'
  },
  {
    name: 'Buku Kesehatan Kapal (Medicine Chest)',
    category: 'Kesehatan',
    defaultValidityYears: 1,
    issuer: 'Balai Karantina Kesehatan / KKP Kelas II',
    docPrefix: 'KKP-MED'
  }
];

// Clean state default: Kosong untuk diinput manual oleh pengguna
export const CERTIFICATE_CATEGORIES = [];
export const STANDARD_CERTIFICATE_TEMPLATES = [];

// Helper to determine status and days until expiry relative to system reference date
export const calculateDocStatus = (expiryDateStr, issueDateStr) => {
  if (!expiryDateStr) return { status: 'Active', daysUntilExpiry: 365 };

  const todayRef = new Date('2026-09-09T00:00:00Z');
  const expDate = new Date(expiryDateStr + 'T00:00:00Z');
  const daysUntilExpiry = Math.round((expDate.getTime() - todayRef.getTime()) / (1000 * 60 * 60 * 24));

  let status = 'Active';
  if (daysUntilExpiry <= 0) {
    status = 'Expired';
  } else if (daysUntilExpiry <= 30) {
    status = 'Due Soon';
  }

  return { status, daysUntilExpiry };
};

// Map existing raw BKI survey categories to normalized 'BKI' or 'Statutory'
export const normalizeDocCategory = (doc) => {
  const cat = (doc.category || '').toLowerCase();
  const name = (doc.name || '').toLowerCase();

  if (cat.includes('ksop') || name.includes('pas besar') || name.includes('surat ukur') || name.includes('ilr') || name.includes('hru') || name.includes('pmk') || name.includes('trayek') || name.includes('radio kapal') || name.includes('isrkl')) {
    return 'KSOP';
  }
  if (cat.includes('kesehatan') || name.includes('sanitasi') || name.includes('sscec') || name.includes('buku kesehatan') || name.includes('medicine')) {
    return 'Kesehatan';
  }
  if (cat.includes('asuransi') || name.includes('wreck') || name.includes('clc') || name.includes('insurance') || name.includes('p&i')) {
    return 'Asuransi';
  }
  if (name.includes('load line') || name.includes('garis muat') || name.includes('safety') || name.includes('manning') || name.includes('pollution') || name.includes('snpp') || name.includes('anti fouling') || name.includes('compliance') || name.includes('doc')) {
    return 'Statutory';
  }
  return 'BKI';
};

// Builder to produce enriched certificate list across all vessels covering BKI, Statutory, Asuransi, KSOP, and Kesehatan
export const buildComprehensiveFleetDocuments = (existingBkiSurveys = [], vessels = [], templates = STANDARD_CERTIFICATE_TEMPLATES) => {
  // 1. Normalize existing surveys to BKI or Statutory with issueDate and expiryDate
  const normalizedSurveys = (existingBkiSurveys || []).map(doc => {
    const category = normalizeDocCategory(doc);
    const { status, daysUntilExpiry } = calculateDocStatus(doc.expiryDate, doc.issueDate);
    let issueDate = doc.issueDate;
    if (!issueDate && doc.expiryDate) {
      const exp = new Date(doc.expiryDate + 'T00:00:00Z');
      exp.setFullYear(exp.getFullYear() - 1);
      issueDate = exp.toISOString().split('T')[0];
    }
    return {
      ...doc,
      category,
      issueDate: issueDate || '2024-01-15',
      status: doc.status || status,
      daysUntilExpiry: doc.daysUntilExpiry !== undefined ? doc.daysUntilExpiry : daysUntilExpiry
    };
  });

  // 2. For each vessel, generate the official certificates from the standard templates
  const additionalDocs = [];

  (vessels || []).forEach(vessel => {
    const existingNames = new Set(
      normalizedSurveys
        .filter(d => d.vesselId === vessel.id)
        .map(d => d.name.toLowerCase().trim())
    );

    (templates || []).forEach((tmpl, idx) => {
      // Don't duplicate if already present in BKI surveys
      const isAlreadyPresent = Array.from(existingNames).some(n =>
        n.includes(tmpl.name.toLowerCase()) || tmpl.name.toLowerCase().includes(n)
      );
      if (isAlreadyPresent) return;

      const reg = vessel.regNo || vessel.imo || '24587';
      const portName = vessel.portOfRegistry?.split(',')[0] || 'Pontianak';

      let issueYear = 2024;
      let expiryYear = issueYear + tmpl.defaultValidityYears;
      let month = ((idx * 3 + parseInt(reg.slice(-1) || '1')) % 12) + 1;
      let day = ((idx * 7 + 10) % 28) + 1;

      // Realistic audit triggers for active monitoring
      if (idx === 0 && vessel.id === 'v-001') {
        // Pas Besar Due Soon in 19 days (H-30)
        expiryYear = 2026;
        month = 9;
        day = 28;
      } else if (idx === 3 && vessel.id === 'v-002') {
        // ILR Sertifikat Due Soon in 5 days (H-7)
        expiryYear = 2026;
        month = 9;
        day = 14;
      } else if (idx === 5 && vessel.id === 'v-004') {
        // PMK Sertifikat Expired
        expiryYear = 2026;
        month = 8;
        day = 20;
      } else if (idx === 19 && vessel.id === 'v-003') {
        // SSCEC Kesehatan Due Soon
        expiryYear = 2026;
        month = 9;
        day = 25;
      } else if (expiryYear < 2026) {
        expiryYear = 2027 + (idx % 3);
      }

      const issueMonthStr = String(month).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const issueDate = `${issueYear}-${issueMonthStr}-${dayStr}`;
      const expiryDate = `${expiryYear}-${issueMonthStr}-${dayStr}`;

      const { status, daysUntilExpiry } = calculateDocStatus(expiryDate, issueDate);

      const issuer = tmpl.issuer.includes('KSOP')
        ? `KSOP Kelas II ${portName}`
        : tmpl.issuer.includes('KKP')
        ? `Kantor Kesehatan Pelabuhan (KKP) ${portName}`
        : tmpl.issuer;

      additionalDocs.push({
        id: `doc-std-${vessel.id}-${idx + 1}`,
        vesselId: vessel.id,
        category: tmpl.category,
        name: tmpl.name,
        documentNo: `${tmpl.docPrefix}-${reg}-${expiryYear}`,
        issuer,
        issueDate,
        expiryDate,
        status,
        daysUntilExpiry,
        mandatoryAuditor: tmpl.category === 'KSOP' ? `Syahbandar KSOP ${portName}` : tmpl.category === 'Kesehatan' ? `Petugas Sanitasi KKP ${portName}` : `Surveyor ${tmpl.category}`,
        scanFile: `${tmpl.category.toLowerCase()}_${vessel.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${tmpl.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`
      });
    });
  });

  return [...normalizedSurveys, ...additionalDocs];
};
