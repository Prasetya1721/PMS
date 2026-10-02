/**
 * subscriptionService.js
 * Layanan kalkulasi status lisensi, formatting running text, dan sinkronisasi kontrol dari web lain.
 */

/**
 * Menghitung sisa hari dari tanggal sekarang ke tanggal kedaluwarsa
 * @param {string|Date} expiryDateString - format YYYY-MM-DD
 * @returns {number} sisa hari (bisa negatif jika sudah terlewati)
 */
export const calculateDaysLeft = (expiryDateString) => {
  if (!expiryDateString) return 999;
  
  // Parse komponen YYYY-MM-DD secara lokal agar tidak tergeser oleh UTC offset
  let year, month, day;
  if (typeof expiryDateString === 'string' && expiryDateString.includes('-')) {
    const parts = expiryDateString.split('T')[0].split('-');
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[2], 10);
  } else {
    const d = new Date(expiryDateString);
    year = d.getFullYear();
    month = d.getMonth();
    day = d.getDate();
  }

  const expiry = new Date(year, month, day, 0, 0, 0, 0);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  if (isNaN(expiry.getTime())) return 999;

  const diffTime = expiry.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Memformat tanggal ke format Indonesia yang mudah dibaca (misal: 15 Okt 2026)
 * @param {string|Date} dateString
 * @returns {string}
 */
export const formatExpiryDateID = (dateString) => {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return String(dateString);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return String(dateString);
  }
};

/**
 * Menghitung status lengkap lisensi aplikasi dan apakah running text harus tampil
 * @param {object} config - subscriptionConfig
 * @returns {object}
 */
export const getSubscriptionStatusInfo = (config = {}) => {
  const daysLeft = calculateDaysLeft(config.expiryDate);
  const threshold = typeof config.warningDaysThreshold === 'number' ? config.warningDaysThreshold : 14;

  const isExpired = config.status === 'expired' || daysLeft <= 0;
  const isExpiringSoon = !isExpired && (config.status === 'warning' || daysLeft <= threshold);
  const isGracePeriod = config.status === 'grace_period';

  // Running text harus tampil jika dipaksa tampil, atau sedang mendekati habis, atau sudah habis/grace period
  const shouldShowRunningText = Boolean(
    config.forceShowRunningText ||
    isExpiringSoon ||
    isExpired ||
    isGracePeriod
  );

  let severity = 'info';
  let badgeLabel = 'Lisensi Aktif';

  if (isExpired) {
    severity = 'danger';
    badgeLabel = daysLeft < 0 ? `Lisensi Habis (${Math.abs(daysLeft)} Hari Lalu)` : 'Lisensi Jatuh Tempo Hari Ini';
  } else if (isGracePeriod) {
    severity = 'danger';
    badgeLabel = 'Masa Tenggang Pembayaran';
  } else if (isExpiringSoon) {
    severity = 'warning';
    badgeLabel = `Segera Berakhir (${daysLeft} Hari Lagi)`;
  } else if (config.forceShowRunningText) {
    severity = 'info';
    badgeLabel = 'Pemberitahuan Lisensi';
  }

  return {
    daysLeft,
    formattedDate: formatExpiryDateID(config.expiryDate),
    isExpired,
    isExpiringSoon,
    isGracePeriod,
    shouldShowRunningText,
    severity,
    badgeLabel
  };
};

/**
 * Memformat pesan teks berjalan (running text ticker) dengan variabel template dinamis
 * @param {object} config - subscriptionConfig
 * @param {object} statusInfo - output dari getSubscriptionStatusInfo
 * @returns {string}
 */
export const formatSubscriptionTickerMessage = (config = {}, statusInfo) => {
  const info = statusInfo || getSubscriptionStatusInfo(config);
  const formattedDays = info.daysLeft > 0 ? info.daysLeft : 0;
  const formattedDate = info.formattedDate;
  const client = config.clientName || 'PT. Pelayaran Baharimas Kalimantan';
  const plan = config.planName || 'Enterprise Maritime Fleet License';
  const amount = config.billingAmount || 'Rp 25.000.000 / Tahun';
  const bank = `${config.bankName || 'BCA'} ${config.bankAccount || '880-192-8391'} a.n ${config.bankAccountHolder || 'PT Bahari Digital Solusindo'}`;

  // Jika developer mengisi pesan kustom, gunakan dengan token replacement
  if (config.customMessage && config.customMessage.trim().length > 0) {
    return config.customMessage
      .replace(/\{daysLeft\}/g, String(formattedDays))
      .replace(/\{expiryDate\}/g, formattedDate)
      .replace(/\{clientName\}/g, client)
      .replace(/\{planName\}/g, plan)
      .replace(/\{amount\}/g, amount)
      .replace(/\{billingAmount\}/g, amount)
      .replace(/\{bankInfo\}/g, bank);
  }

  // Pesan bawaan cerdas berdasarkan tingkat urgensi
  if (info.isExpired) {
    return `🚨 PERINGATAN KRITIS: Masa aktif lisensi aplikasi Sistem PMS Kapal (${client}) telah BERAKHIR sejak ${formattedDate}. Mohon segera menyelesaikan pembayaran biaya perpanjangan lisensi (${amount}) via transfer ${bank} agar operasional data armada tidak dihentikan sementara. Hubungi tim pengembang via tombol di samping untuk konfirmasi aktivasi instan.`;
  }

  if (info.isGracePeriod) {
    return `⚠️ MASA TENGGANG PEMBAYARAN: Masa aktif langganan ${plan} telah jatuh tempo. Sistem beroperasi dalam masa tenggang darurat. Silakan selesaikan tagihan perpanjangan (${amount}) segera untuk menghindari pemutusan akses modul kapal.`;
  }

  if (info.isExpiringSoon) {
    return `⚠️ PEMBERITAHUAN MASA BERLANGGANAN: Masa aktif lisensi aplikasi Sistem PMS Kapal tersisa ${formattedDays} hari lagi (Jatuh tempo: ${formattedDate}). Mohon bagian keuangan & manajemen segera memproses pembayaran biaya perpanjangan lisensi (${amount}) agar sistem operasional kapal tetap terhubung tanpa kendala.`;
  }

  return `📢 INFORMASI LISENSI: Sistem PMS Kapal Baharimas aktif hingga ${formattedDate}. Pembayaran biaya langganan periode berikutnya dapat dikonfirmasikan melalui pengembang sistem.`;
};

/**
 * Kode template JSON untuk di-host pada web pengembang lain
 */
export const REMOTE_JSON_TEMPLATE = {
  status: "warning",
  expiryDate: "2026-10-25",
  warningDaysThreshold: 14,
  forceShowRunningText: true,
  billingAmount: "Rp 25.000.000 / Tahun",
  customMessage: "⚠️ PEMBERITAHUAN MASA AKTIF: Lisensi aplikasi Sistem PMS Kapal Baharimas tersisa {daysLeft} hari lagi (Jatuh tempo: {expiryDate}). Mohon segera menyelesaikan pembayaran biaya langganan agar operasional tetap berjalan normal.",
  bankName: "Bank Central Asia (BCA)",
  bankAccount: "880-192-8391",
  bankAccountHolder: "PT Bahari Digital Solusindo",
  contactPhone: "089508888778",
  paymentUrl: "https://wa.me/6289508888778?text=Konfirmasi%20Perpanjangan%20PMS",
  isLocked: false
};
