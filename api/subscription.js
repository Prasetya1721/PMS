/**
 * /api/subscription.js
 * Vercel Serverless Function untuk Kontrol Lisensi & Running Teks dari Web Lain
 * Mendukung GET (Query status) dan POST (Pembaruan status dari webhook / website billing pengembang)
 */

export default async function handler(req, res) {
  // CORS Headers agar bisa dipanggil dari domain website lain
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-Secret-Key'
  );

  // Tangani preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Mengambil status lisensi saat ini (bisa digunakan untuk sinkronisasi polling)
  if (req.method === 'GET') {
    // Ambil query override jika dikirimkan dari web lain
    const { status, expiry, force } = req.query || {};

    const defaultPayload = {
      status: status || 'warning', // 'active' | 'warning' | 'expired' | 'grace_period'
      planName: 'Enterprise Maritime Fleet License (Baharimas PMS)',
      clientName: 'PT. Pelayaran Baharimas Kalimantan',
      expiryDate: expiry || '2026-10-15',
      warningDaysThreshold: 14,
      forceShowRunningText: force === 'false' ? false : true,
      billingAmount: 'Rp 25.000.000 / Tahun',
      billingCycle: 'Tahunan (Annual Fleet License)',
      bankName: 'Bank Central Asia (BCA)',
      bankAccount: '880-192-8391',
      bankAccountHolder: 'PT Bahari Digital Solusindo',
      contactPerson: 'Alex Pratama (Billing & Technical Support)',
      contactPhone: '089508888778',
      contactEmail: 'billing@baharimas.co.id',
      paymentUrl: 'https://wa.me/6289508888778?text=Konfirmasi%20Perpanjangan%20PMS',
      customMessage: '',
      isLocked: false,
      timestamp: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      message: 'Status lisensi PMS berhasil diambil',
      data: defaultPayload
    });
  }

  // POST: Menerima pembaruan status lisensi langsung dari website billing pengembang lain
  if (req.method === 'POST') {
    try {
      const secret = req.headers['x-secret-key'] || req.body?.secretKey;
      const expectedSecret = process.env.PMS_SUBSCRIPTION_SECRET || 'pms_sub_sec_88921a';

      // Verifikasi secret key sederhana
      if (secret && secret !== expectedSecret) {
        return res.status(401).json({
          success: false,
          error: 'Secret key tidak valid. Autentikasi ditolak.'
        });
      }

      const payload = req.body || {};

      return res.status(200).json({
        success: true,
        message: 'Konfigurasi lisensi & running text berhasil diterima',
        updatedAt: new Date().toISOString(),
        data: {
          status: payload.status || 'warning',
          expiryDate: payload.expiryDate || '2026-10-15',
          forceShowRunningText: payload.forceShowRunningText ?? true,
          billingAmount: payload.billingAmount || 'Rp 25.000.000 / Tahun',
          customMessage: payload.customMessage || '',
          isLocked: Boolean(payload.isLocked)
        }
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: `Terjadi kesalahan server: ${err.message}`
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: `Metode ${req.method} tidak didukung`
  });
}
