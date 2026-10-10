/**
 * api/proxy/whatsapp.js
 * Proxy server untuk pengiriman WhatsApp (Wablas dan gateway lain).
 *
 * Kenapa ada: browser tidak bisa memanggil API Wablas langsung karena CORS, dan
 * token tidak boleh ikut terkirim lintas origin. Frontend
 * (src/services/whatsappService.js) memanggil endpoint ini lebih dulu dan baru
 * jatuh ke koneksi langsung kalau proxy tidak tersedia.
 *
 * Kontrak:
 *   POST { targetUrl, authHeader, phone, message, provider? }
 *   -> { success, message, ... } mengikuti bentuk balasan Wablas agar
 *      parseGatewayResponse() di frontend bekerja tanpa perubahan.
 */

import { checkOutboundUrl, fetchWithTimeout, readJsonBody, readUpstreamBody, sendJson, setCors } from '../_lib/http.js';

const MAX_MESSAGE_CHARS = 4096;
const MIN_PHONE_DIGITS = 9;

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return sendJson(res, 405, { success: false, error: `Metode ${req.method} tidak didukung` });
  }

  const parsed = await readJsonBody(req);
  if (!parsed.ok) return sendJson(res, parsed.status, { success: false, error: parsed.error });

  const { targetUrl, authHeader, phone, message } = parsed.body;

  // Normalisasi yang sama dengan klien (0…/8… -> 62…), supaya endpoint ini tetap
  // benar walau dipanggil pemanggil lain yang belum menormalkan nomornya.
  let cleanPhone = String(phone || '').replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) cleanPhone = `62${cleanPhone.slice(1)}`;
  else if (cleanPhone.startsWith('8')) cleanPhone = `62${cleanPhone}`;
  if (cleanPhone.length < MIN_PHONE_DIGITS) {
    return sendJson(res, 400, {
      success: false,
      error: 'INVALID_PHONE',
      message: 'Nomor telepon tujuan tidak valid atau kosong. Pastikan berformat 08... atau 628...',
    });
  }

  const text = String(message || '');
  if (!text.trim()) {
    return sendJson(res, 400, { success: false, error: 'EMPTY_MESSAGE', message: 'Isi pesan kosong.' });
  }
  if (text.length > MAX_MESSAGE_CHARS) {
    return sendJson(res, 413, {
      success: false,
      error: 'MESSAGE_TOO_LONG',
      message: `Isi pesan melebihi ${MAX_MESSAGE_CHARS} karakter.`,
    });
  }

  const token = String(authHeader || '').trim();
  if (!token) {
    return sendJson(res, 400, {
      success: false,
      error: 'NO_API_KEY',
      message: 'API Key / Token WhatsApp belum diisi. Masukkan token di Developer & API Keys.',
    });
  }

  const target = checkOutboundUrl(targetUrl);
  if (!target.ok) {
    return sendJson(res, 400, { success: false, error: 'BLOCKED_TARGET', message: target.error });
  }

  let upstream;
  try {
    upstream = await fetchWithTimeout(target.url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        Accept: 'application/json',
      },
      body: JSON.stringify({ phone: cleanPhone, message: text }),
    });
  } catch (err) {
    const aborted = err?.name === 'AbortError';
    return sendJson(res, 502, {
      success: false,
      error: aborted ? 'GATEWAY_TIMEOUT' : 'GATEWAY_UNREACHABLE',
      message: aborted
        ? 'Gateway WhatsApp tidak merespons dalam batas waktu.'
        : `Tidak dapat menghubungi gateway: ${err?.message || String(err)}`,
    });
  }

  const { text: bodyText, json } = await readUpstreamBody(upstream);

  // Diteruskan apa adanya: frontend (parseGatewayResponse) yang menafsirkan
  // bentuk balasan tiap provider dan memberi penjelasan yang bisa dibaca operator.
  if (json !== null) {
    return sendJson(res, 200, { ok: upstream.ok, status: upstream.status, body: json });
  }
  return sendJson(res, 200, {
    ok: upstream.ok,
    status: upstream.status,
    body: { status: upstream.ok, message: bodyText.slice(0, 500) || 'Gateway tidak mengirim body.' },
  });
}
