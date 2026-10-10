/**
 * api/_lib/http.js
 * Helper bersama untuk Vercel Serverless Function di direktori api/.
 * Berkas di dalam folder _lib tidak dipetakan menjadi rute oleh Vercel.
 */

/** Batas ukuran body request (byte) — cukup untuk payload notifikasi, bukan unggahan. */
export const MAX_BODY_BYTES = 64 * 1024;

/** Batas waktu panggilan ke gateway pihak ketiga (ms). */
export const UPSTREAM_TIMEOUT_MS = 15_000;

/** Header CORS standar, sama dengan api/subscription.js supaya konsisten. */
export function setCors(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-Secret-Key'
  );
}

/** Balasan JSON dengan bentuk yang seragam: { success, message|error, ... }. */
export function sendJson(res, status, payload) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json(payload);
}

/**
 * Membaca body JSON dari request.
 * Vercel bisa saja sudah mengurai `req.body`; kalau belum, stream dibaca manual
 * dengan batas ukuran supaya permintaan besar tidak menghabiskan memori.
 */
export async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return { ok: true, body: req.body };
  }

  const chunks = [];
  let size = 0;
  try {
    for await (const chunk of req) {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        return { ok: false, status: 413, error: 'Payload terlalu besar.' };
      }
      chunks.push(chunk);
    }
  } catch {
    return { ok: false, status: 400, error: 'Body permintaan tidak dapat dibaca.' };
  }

  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return { ok: true, body: {} };
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { ok: false, status: 400, error: 'Body harus berupa objek JSON.' };
    }
    return { ok: true, body: parsed };
  } catch {
    return { ok: false, status: 400, error: 'Body bukan JSON yang valid.' };
  }
}

const PRIVATE_HOST = /^(localhost|.*\.local|.*\.internal)$/i;
const PRIVATE_IPV4 = /^(10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.|0\.)/;

/**
 * Penjaga SSRF untuk URL tujuan yang dikirim klien.
 * Wajib https dan host publik, supaya server ini tidak bisa dipakai memanggil
 * jaringan internal (metadata cloud, layanan lokal, dsb).
 */
export function checkOutboundUrl(rawUrl) {
  let url;
  try {
    url = new URL(String(rawUrl || ''));
  } catch {
    return { ok: false, error: 'URL gateway tidak valid.' };
  }
  if (url.protocol !== 'https:') {
    return { ok: false, error: 'URL gateway harus memakai https.' };
  }
  const host = url.hostname;
  if (PRIVATE_HOST.test(host) || PRIVATE_IPV4.test(host) || host.includes(':') || host === '') {
    return { ok: false, error: `Host tujuan "${host}" tidak diizinkan (jaringan privat/internal).` };
  }
  const allowed = String(process.env.PMS_GATEWAY_ALLOWED_HOSTS || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  if (allowed.length > 0) {
    const matches = allowed.some((rule) => (rule.startsWith('*.') ? host.toLowerCase().endsWith(rule.slice(1)) : host.toLowerCase() === rule));
    if (!matches) return { ok: false, error: `Host tujuan "${host}" tidak ada di daftar izin (PMS_GATEWAY_ALLOWED_HOSTS).` };
  }
  return { ok: true, url };
}

/** fetch dengan timeout, supaya fungsi tidak menggantung sampai batas Vercel. */
export async function fetchWithTimeout(url, options = {}, timeoutMs = UPSTREAM_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Membaca balasan upstream sebagai teks, lalu coba urai sebagai JSON.
 * Selalu mengembalikan teks mentah supaya pemanggil bisa memberi pesan galat
 * yang jujur saat gateway mengirim HTML (mis. halaman login WAF).
 */
export async function readUpstreamBody(response) {
  const text = await response.text().catch(() => '');
  const trimmed = text.trim();
  if (!trimmed) return { text: '', json: null };
  try {
    return { text: trimmed, json: JSON.parse(trimmed) };
  } catch {
    return { text: trimmed, json: null };
  }
}
