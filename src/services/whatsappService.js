/**
 * whatsappService.js
 * Layanan komunikasi WhatsApp Gateway (Wablas API, Fonnte, Twilio, dll).
 * Menangani normalisasi nomor telepon, sanitasi URL endpoint, penanganan CORS via proxy,
 * serta diagnosa detail respons dari server gateway WhatsApp.
 */

/**
 * Normalisasi nomor HP ke format internasional WhatsApp (628xxx)
 * Contoh: 0895-0888-8778 -> 6289508888778
 *          +62 812 3456 789 -> 628123456789
 */
export function normalizePhoneNumber(phone) {
  if (!phone) return '';
  let clean = String(phone).replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  } else if (clean.startsWith('8')) {
    clean = '62' + clean;
  }
  return clean;
}

/**
 * Normalisasi URL Wablas agar selalu menunjuk ke path /api/send-message
 */
export function normalizeWablasUrl(url) {
  if (!url || typeof url !== 'string') {
    return 'https://jkt.wablas.com/api/send-message';
  }
  let trimmed = url.trim().replace(/\/+$/, '');
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    trimmed = 'https://' + trimmed;
  }
  if (!trimmed.includes('/api/')) {
    trimmed = trimmed + '/api/send-message';
  }
  return trimmed;
}

/**
 * Format Authorization header untuk Wablas
 * Wablas mendukung:
 * 1. {token}.{secret_key} (jika akun memiliki secret key)
 * 2. {token} (jika akun tanpa secret key)
 */
export function buildWablasAuthHeader(apiKey, secretKey) {
  const token = (apiKey || '').trim();
  const secret = (secretKey || '').trim();

  if (!token) return '';
  if (token.includes('.')) {
    // Pengguna sudah memasukkan format gabungan token.secret
    return token;
  }
  if (secret) {
    return `${token}.${secret}`;
  }
  return token;
}

/**
 * Mengirim pesan WhatsApp melalui Gateway API (dengan fallback Proxy dev server untuk memotong CORS)
 */
export async function sendWhatsAppViaGateway({
  apiUrl,
  apiKey,
  secretKey = '',
  phone,
  message,
  provider = 'Wablas API'
}) {
  const cleanPhone = normalizePhoneNumber(phone);
  const targetUrl = normalizeWablasUrl(apiUrl);
  const authHeader = buildWablasAuthHeader(apiKey, secretKey);

  if (!cleanPhone || cleanPhone.length < 9) {
    return {
      success: false,
      message: 'Nomor telepon tujuan tidak valid atau kosong. Pastikan nomor berformat 08... atau 628...',
      error: 'INVALID_PHONE'
    };
  }

  if (!authHeader) {
    return {
      success: false,
      message: 'API Key / Token WhatsApp belum diisi. Masukkan token di Developer & API Keys.',
      error: 'NO_API_KEY'
    };
  }

  // 1. Coba melalui backend proxy dev server terlebih dahulu untuk memotong CORS browser
  try {
    const proxyRes = await fetch('/api/proxy/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetUrl,
        authHeader,
        phone: cleanPhone,
        message,
        provider
      })
    });

    if (proxyRes.ok) {
      const result = await proxyRes.json();
      return parseGatewayResponse(result, provider);
    }
  } catch (proxyErr) {
    console.warn('[WhatsAppService] Proxy dev server tidak merespons, mencoba koneksi langsung:', proxyErr);
  }

  // 2. Fallback: kirim langsung via browser fetch
  try {
    const directRes = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        phone: cleanPhone,
        message: message
      })
    });

    const data = await directRes.json();
    return parseGatewayResponse({ ok: directRes.ok, status: directRes.status, body: data }, provider);
  } catch (directErr) {
    return {
      success: false,
      message: `Gagal mengirim ke gateway: ${directErr.message}. Kemungkinan diblokir kebijakan CORS browser.`,
      error: 'CORS_OR_NETWORK_ERROR',
      raw: directErr
    };
  }
}

/**
 * Menganalisis dan menafsirkan respons dari API Wablas / Gateway
 */
function parseGatewayResponse(result, provider) {
  const body = result.body || result.data || result;
  const isOk = result.ok !== false && (result.status >= 200 && result.status < 300 || result.httpStatus === 200);

  // Wablas format: { status: true/false, message: "...", data: {...} }
  if (body && typeof body === 'object') {
    if (body.status === true) {
      return {
        success: true,
        message: body.message || 'Pesan berhasil diterima server Wablas dan masuk ke antrean pengiriman WhatsApp.',
        data: body.data || body,
        raw: result
      };
    }

    const msg = body.message || body.error || 'Server gateway menolak pengiriman.';
    let humanExplanation = msg;

    if (/need secret key|not authorized/i.test(msg)) {
      humanExplanation = 'Wablas mewajibkan Secret Key untuk otorisasi pengiriman. Silakan salin Secret Key dari dashboard Wablas Anda (klik tombol oranye "Secret baru" atau ikon salin di baris Secret key pada screenshot Anda), lalu masukkan ke kolom "Wablas Secret Key" di menu Developer.';
    } else if (/secret key invalid/i.test(msg)) {
      humanExplanation = 'Secret Key Wablas yang dimasukkan tidak sesuai. Silakan klik tombol "Secret baru" di dashboard Wablas Anda untuk menghasilkan Secret Key baru, lalu masukkan ke kolom Wablas Secret Key.';
    } else if (/token invalid or device expired/i.test(msg)) {
      humanExplanation = 'Token Wablas tidak valid ATAU status perangkat WhatsApp di dashboard Wablas terputus (Device Expired). Silakan buka dashboard Wablas, scan QR ulang perangkat, dan pastikan status "Connected". Jika akun Anda menggunakan Secret Key, isi juga kolom Secret Key.';
    } else if (/token invalid/i.test(msg)) {
      humanExplanation = 'Token API Wablas tidak dikenali oleh server. Pastikan Token disalin utuh dari menu API Settings di dashboard Wablas dan domain server sesuai (misal: jkt.wablas.com).';
    } else if (/device not found/i.test(msg)) {
      humanExplanation = 'Perangkat tidak ditemukan di server Wablas ini. Pastikan domain server URL sesuai dengan server akun Anda (misal jkt.wablas.com, solo.wablas.com, jogja.wablas.com).';
    } else if (/param invalid|phone/i.test(msg)) {
      humanExplanation = `Parameter nomor telepon atau pesan tidak sesuai format: ${msg}`;
    }

    return {
      success: false,
      message: humanExplanation,
      error: msg,
      raw: result
    };
  }

  if (isOk) {
    return {
      success: true,
      message: 'Pesan berhasil dikirim ke gateway API.',
      raw: result
    };
  }

  return {
    success: false,
    message: `Gateway merespons HTTP ${result.status || result.httpStatus || 500}: ${JSON.stringify(body)}`,
    error: 'HTTP_ERROR',
    raw: result
  };
}
