/**
 * docFormHelpers.js
 * Diekstrak dari DocumentFormModal.jsx (baris 566-686).
 * Sumber: PRESET_INTERVAL_MAP, DEFAULT_REMINDERS, calculateReminderDate,
 *         normalizeDateForInput, formatIndonesianDate, generateSampleCertificateFile.
 *
 * Dipindah ke modul sendiri karena dipakai komponen hasil ekstraksi
 * (DocFormDatesSection, DocFormNotifSection) sementara semuanya hanya binding
 * level modul - bukan import - sehingga tidak ikut terbawa saat komponen pindah.
 *
 * Isi fungsi TIDAK diubah: disalin byte-identik, hanya ditambah export.
 */
export const PRESET_INTERVAL_MAP = {
  '1y': { unit: 'year', value: 1, label: '1 Tahun Sebelum (H-365)' },
  '6m': { unit: 'month', value: 6, label: '6 Bulan Sebelum (H-180)' },
  '3m': { unit: 'month', value: 3, label: '3 Bulan Sebelum (H-90)' },
  '1m': { unit: 'month', value: 1, label: '1 Bulan Sebelum (H-30)' },
  '2w': { unit: 'week', value: 2, label: '2 Minggu Sebelum (H-14)' },
  '1w': { unit: 'week', value: 1, label: '1 Minggu Sebelum (H-7)' },
  '3d': { unit: 'day', value: 3, label: '3 Hari Sebelum (H-3)' },
  '1d': { unit: 'day', value: 1, label: '1 Hari Sebelum (H-1)' }
};

export const DEFAULT_REMINDERS = {
  enabled: true,
  mode: '1m',
  label: '1 Bulan Sebelum (H-30)',
  manualAmount: 30,
  manualUnit: 'day',
  manualCustomDate: '',
  channels: {
    whatsapp: true,
    email: true,
    googleCalendar: true
  },
  emailRecipient: ''
};

export const calculateReminderDate = (expDateStr, unit, value) => {
  if (!expDateStr) return null;
  try {
    const d = new Date(expDateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return null;
    const target = new Date(d);
    const num = Number(value || 1);
    if (unit === 'year') {
      target.setFullYear(target.getFullYear() - num);
    } else if (unit === 'month') {
      target.setMonth(target.getMonth() - num);
    } else if (unit === 'week') {
      target.setDate(target.getDate() - (num * 7));
    } else if (unit === 'day') {
      target.setDate(target.getDate() - num);
    }
    return target.toISOString().split('T')[0];
  } catch (e) {
    return null;
  }
};

export const normalizeDateForInput = (dateVal) => {
  if (!dateVal) return '';
  if (typeof dateVal === 'string') {
    const trimmed = dateVal.trim();
    if (trimmed.includes('T')) return trimmed.split('T')[0];
    if (trimmed.includes(' ')) return trimmed.split(' ')[0];
    const m = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (m) {
      const day = m[1].padStart(2, '0');
      const month = m[2].padStart(2, '0');
      const year = m[3];
      return `${year}-${month}-${day}`;
    }
    return trimmed;
  }
  try {
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  } catch {}
  return '';
};

export const formatIndonesianDate = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const cleanStr = typeof dateStr === 'string' && dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    const parts = cleanStr.split('-');
    if (parts.length !== 3) return dateStr;
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const d = parseInt(parts[2], 10);
    const m = months[parseInt(parts[1], 10) - 1];
    const y = parts[0];
    if (!m) return dateStr;
    return `${d} ${m} ${y}`;
  } catch (e) {
    return dateStr;
  }
};

// Generate authentic official certificate mock data URL (SVG/image) for instant demonstration
export const generateSampleCertificateFile = (name, docNo, category, vesselName, issuer) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100">
    <rect width="800" height="1100" fill="#f8fafc"/>
    <rect x="30" y="30" width="740" height="1040" fill="none" stroke="#0284c7" stroke-width="4"/>
    <rect x="40" y="40" width="720" height="1020" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="6,4"/>
    <text x="400" y="100" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#0f172a" text-anchor="middle">REPUBLIK INDONESIA - KEMENTERIAN PERHUBUNGAN</text>
    <text x="400" y="130" font-family="Arial, sans-serif" font-size="13" fill="#64748b" text-anchor="middle">DIREKTORAT JENDERAL PERHUBUNGAN LAUT / BIRO KLASIFIKASI INDONESIA</text>
    <line x1="80" y1="155" x2="720" y2="155" stroke="#0284c7" stroke-width="2"/>
    <text x="400" y="220" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#0284c7" text-anchor="middle">${(name || 'SERTIFIKAT KAPAL').toUpperCase()}</text>
    <text x="400" y="255" font-family="monospace" font-size="15" font-weight="bold" fill="#334155" text-anchor="middle">NO: ${docNo || 'CERT-BAHARIMAS-2026'}</text>
    <text x="400" y="290" font-family="Arial, sans-serif" font-size="13" fill="#64748b" text-anchor="middle">Kategori: ${category || 'STATUTORY'} • PT. Pelayaran Baharimas Kalimantan</text>
    <rect x="70" y="330" width="660" height="320" fill="#ffffff" rx="8" stroke="#cbd5e1"/>
    <text x="100" y="380" font-family="Arial, sans-serif" font-size="14" fill="#64748b">Kapal Terkait:</text>
    <text x="320" y="380" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#0f172a">${vesselName || 'TB. Baharimas'}</text>
    <text x="100" y="425" font-family="Arial, sans-serif" font-size="14" fill="#64748b">Instansi Penerbit:</text>
    <text x="320" y="425" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#0f172a">${issuer || 'KSOP / BKI'}</text>
    <text x="100" y="470" font-family="Arial, sans-serif" font-size="14" fill="#64748b">Kategori Maritim:</text>
    <text x="320" y="470" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#0284c7">${category || 'KSOP'}</text>
    <text x="100" y="515" font-family="Arial, sans-serif" font-size="14" fill="#64748b">Status Dokumen:</text>
    <text x="320" y="515" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#10b981">VERIFIED OFFICIAL / RESMI DIGITAL</text>
    <text x="100" y="560" font-family="Arial, sans-serif" font-size="14" fill="#64748b">Tgl Terbit / Expired:</text>
    <text x="320" y="560" font-family="monospace" font-size="13" fill="#334155">2026-09-19 s/d Berkelanjutan</text>
    <rect x="70" y="690" width="660" height="150" fill="#f1f5f9" rx="8"/>
    <text x="100" y="735" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">Catatan Verifikasi & Hasil Survei Lapangan:</text>
    <text x="100" y="765" font-family="Arial, sans-serif" font-size="12" fill="#475569">Dokumen sertifikat kapal ini telah memenuhi standar kelaikan laut SOLAS / ISM Code / PM 39.</text>
    <text x="100" y="790" font-family="Arial, sans-serif" font-size="12" fill="#475569">Semua pemeriksaan fisik lambung, mesin, dan perlengkapan keselamatan dinyatakan laik laut.</text>
    <circle cx="620" cy="940" r="50" fill="none" stroke="#ef4444" stroke-width="3"/>
    <text x="620" y="935" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ef4444" text-anchor="middle">KEMENTERIAN</text>
    <text x="620" y="950" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#ef4444" text-anchor="middle">PERHUBUNGAN</text>
    <text x="400" y="1030" font-family="Arial, sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">Dokumen Digital PMS Armada - PT. Pelayaran Baharimas Kalimantan</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
};
