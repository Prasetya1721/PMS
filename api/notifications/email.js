/**
 * api/notifications/email.js
 * Endpoint pengiriman email notifikasi PMS.
 *
 * Kontrak (lihat src/services/emailService.js):
 *   POST { from?, replyTo?, to, cc?, bcc?, subject, text, html?, meta? }
 *
 * Perilaku jujur: kalau kanal email belum dikonfigurasi, endpoint menjawab 501
 * dengan penjelasan — bukan 200 palsu. Frontend sudah menangani ini: status
 * berubah menjadi "Queued (Menunggu Backend)" dan operator memakai jalur
 * mailto:/unduhan. Setelah kredensial diisi, pengiriman otomatis langsung jalan.
 *
 * Konfigurasi (environment, tidak pernah dikirim ke browser):
 *   PMS_EMAIL_PROVIDER   resend | smtp  (default: resend)
 *   PMS_EMAIL_API_KEY    API key penyedia
 *   PMS_EMAIL_FROM       alamat pengirim default
 *   PMS_EMAIL_ENDPOINT   override endpoint penyedia (opsional)
 *   PMS_EMAIL_ALLOWED_TO daftar penerima yang diizinkan, dipisah koma (opsional)
 */

import { checkOutboundUrl, fetchWithTimeout, readJsonBody, readUpstreamBody, sendJson, setCors } from '../_lib/http.js';

const MAX_SUBJECT_CHARS = 200;
const MAX_RECIPIENTS = 25;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Menerima string atau array; mengembalikan daftar alamat yang valid dan unik. */
function normalizeRecipients(input) {
  const raw = Array.isArray(input) ? input : String(input || '').split(/[,;\n]+/);
  const seen = new Set();
  const out = [];
  for (const item of raw) {
    const value = String(item || '').trim().toLowerCase();
    if (!value || !EMAIL_RE.test(value) || seen.has(value)) continue;
    seen.add(value);
    out.push(value);
    if (out.length >= MAX_RECIPIENTS) break;
  }
  return out;
}

/** Menghapus tag supaya versi teks selalu bisa dibaca. */
function toPlainText(html) {
  return String(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|tr|h[1-6])>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return sendJson(res, 405, { success: false, error: `Metode ${req.method} tidak didukung` });
  }

  const parsed = await readJsonBody(req);
  if (!parsed.ok) return sendJson(res, parsed.status, { success: false, error: parsed.error });

  const body = parsed.body;
  const to = normalizeRecipients(body.to);
  if (to.length === 0) {
    return sendJson(res, 400, { success: false, error: 'NO_RECIPIENT', message: 'Tidak ada alamat penerima yang valid.' });
  }
  const cc = normalizeRecipients(body.cc);
  const bcc = normalizeRecipients(body.bcc);

  const allowList = String(process.env.PMS_EMAIL_ALLOWED_TO || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  if (allowList.length > 0) {
    const blocked = [...to, ...cc, ...bcc].filter((addr) => !allowList.includes(addr));
    if (blocked.length > 0) {
      return sendJson(res, 403, {
        success: false,
        error: 'RECIPIENT_NOT_ALLOWED',
        message: `Penerima di luar daftar izin: ${blocked.join(', ')}`,
      });
    }
  }

  const subject = String(body.subject || 'Notifikasi PMS Baharimas').slice(0, MAX_SUBJECT_CHARS);
  const text = String(body.text || toPlainText(body.html) || '');
  const html = typeof body.html === 'string' && body.html.trim() ? body.html : undefined;
  if (!text.trim() && !html) {
    return sendJson(res, 400, { success: false, error: 'EMPTY_BODY', message: 'Isi email kosong.' });
  }

  const provider = String(process.env.PMS_EMAIL_PROVIDER || 'resend').toLowerCase();
  const apiKey = String(process.env.PMS_EMAIL_API_KEY || '').trim();
  const from = String(body.from || process.env.PMS_EMAIL_FROM || '').trim();

  // Belum dikonfigurasi: katakan terus terang, jangan pura-pura terkirim.
  if (!apiKey || !from) {
    return sendJson(res, 501, {
      success: false,
      queued: true,
      error: 'EMAIL_NOT_CONFIGURED',
      message:
        'Kanal email belum dikonfigurasi di server. Set PMS_EMAIL_API_KEY dan PMS_EMAIL_FROM di environment, ' +
        'lalu coba lagi. Sementara ini gunakan tombol email (mailto) atau unduh dokumennya.',
    });
  }

  const endpoint =
    process.env.PMS_EMAIL_ENDPOINT ||
    (provider === 'smtp' ? '' : 'https://api.resend.com/emails');

  const target = checkOutboundUrl(endpoint);
  if (!target.ok) {
    return sendJson(res, 500, { success: false, error: 'BAD_EMAIL_ENDPOINT', message: target.error });
  }

  // Resend memakai bentuk { from, to, cc, bcc, subject, text, html }.
  const payload = {
    from,
    to,
    ...(cc.length ? { cc } : {}),
    ...(bcc.length ? { bcc } : {}),
    subject,
    ...(text ? { text } : {}),
    ...(html ? { html } : {}),
    ...(body.replyTo ? { reply_to: body.replyTo } : {}),
  };

  let upstream;
  try {
    upstream = await fetchWithTimeout(target.url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    const aborted = err?.name === 'AbortError';
    return sendJson(res, 502, {
      success: false,
      queued: true,
      error: aborted ? 'EMAIL_TIMEOUT' : 'EMAIL_UNREACHABLE',
      message: aborted
        ? 'Penyedia email tidak merespons dalam batas waktu.'
        : `Tidak dapat menghubungi penyedia email: ${err?.message || String(err)}`,
    });
  }

  const { text: bodyText, json } = await readUpstreamBody(upstream);
  if (!upstream.ok) {
    return sendJson(res, 502, {
      success: false,
      queued: true,
      error: 'EMAIL_REJECTED',
      message: `Penyedia email menolak pengiriman (HTTP ${upstream.status}): ${json?.message || bodyText.slice(0, 300) || 'tanpa keterangan'}`,
    });
  }

  return sendJson(res, 200, {
    success: true,
    queued: false,
    status: `Delivered (${provider})`,
    id: json?.id,
    message: 'Email diterima penyedia dan masuk antrean pengiriman.',
  });
}
