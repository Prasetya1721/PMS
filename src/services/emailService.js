// Email Notification Service — backend-ready abstraction.
// Frontend-only: kirim via `mailto:` + catat log audit.
// Nanti (ada backend): isi `autoSend.emailGateway.apiUrl` + `apiKey`,
// maka pengiriman otomatis jalan via POST tanpa buka tab email.
// Kontrak backend: POST {apiUrl} Body { to, cc?, bcc?, subject, text, html?, meta? }

export const DEFAULT_EMAIL_GATEWAY = {
  provider: 'Backend API',
  apiUrl: '/api/notifications/email',
  apiKey: '',
  fromName: 'PMS Baharimas',
  fromEmail: 'noreply@baharimas.co.id',
  replyTo: 'fleet.ops@baharimas.co.id',
  defaultRecipients: ['fleet.ops@baharimas.co.id'],
};

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const normalizeEmailList = (input) => {
  const raw = Array.isArray(input) ? input : String(input || '').split(/[,;\n]+/);
  const seen = new Set();
  const out = [];
  raw.forEach((e) => {
    const v = String(e || '').trim().toLowerCase();
    if (v && isValidEmail(v) && !seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  });
  return out;
};

export const buildEmailPayload = ({ to, cc, bcc, subject, text, html, meta }) => ({
  to: normalizeEmailList(to),
  cc: normalizeEmailList(cc),
  bcc: normalizeEmailList(bcc),
  subject: String(subject || 'Notifikasi PMS Baharimas').slice(0, 200),
  text: String(text || ''),
  html: html || undefined,
  meta: meta || {},
});
// Percobaan kirim via backend. Return { ok, queued, status, error }
export const sendEmailViaBackend = async (payload, gateway = {}) => {
  const apiUrl = String(gateway?.apiUrl || '').trim();
  if (!apiUrl) return { ok: false, queued: true, status: 'Queued', error: 'Email gateway belum dikonfigurasi' };
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(gateway?.apiKey ? { Authorization: `Bearer ${gateway.apiKey}` } : {}),
      },
      body: JSON.stringify({
        from: gateway?.fromEmail ? `${gateway?.fromName || 'PMS Baharimas'} <${gateway.fromEmail}>` : undefined,
        replyTo: gateway?.replyTo || undefined,
        ...payload,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { ok: true, queued: false, status: `Delivered (${gateway?.provider || 'Email API'})` };
  } catch (err) {
    return { ok: false, queued: true, status: 'Queued (Menunggu Backend)', error: err?.message || String(err) };
  }
};

export const buildMailtoUrl = (to, subject, body) => {
  const toStr = normalizeEmailList(to).join(',');
  return `mailto:${toStr}?subject=${encodeURIComponent(subject || '')}&body=${encodeURIComponent(body || '')}`;
};

export const stripWhatsappMarkdown = (text) => {
  if (!text) return '';
  return String(text).replace(/\*([^*]+)\*/g, '$1').replace(/_([^_]+)_/g, '$1');
};

export const buildEmailHtml = ({ preheader, title, badge, rows, bodyText, footer }) => {
  const rowHtml = (rows || []).map((r) =>
    `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0;color:#475569;font-size:12px;width:180px;background:#f8fafc;"><b>${r.label}</b></td><td style="padding:6px 10px;border:1px solid #e2e8f0;color:#0f172a;font-size:12px;">${r.value}</td></tr>`
  ).join('');
  return `<!doctype html><html><body style="margin:0;background:#f1f5f9;font-family:Arial,sans-serif;">`
    + `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader || ''}</div>`
    + `<div style="max-width:640px;margin:0 auto;padding:24px;">`
    + `<div style="background:#0c4a6e;color:#fff;border-radius:12px 12px 0 0;padding:18px 22px;">`
    + `<div style="font-size:11px;letter-spacing:1px;opacity:.8;">PT. PELAYARAN BAHARIMAS KALIMANTAN — SISTEM PMS</div>`
    + `<div style="font-size:20px;font-weight:bold;margin-top:4px;">${title || 'Notifikasi'}</div>`
    + (badge ? `<div style="display:inline-block;margin-top:8px;background:#22d3ee;color:#083344;font-size:12px;font-weight:bold;padding:4px 10px;border-radius:999px;">${badge}</div>` : '')
    + `</div><div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:20px 22px;">`
    + (rowHtml ? `<table style="border-collapse:collapse;width:100%;margin:0 0 14px 0;">${rowHtml}</table>` : '')
    + `<div style="white-space:pre-line;color:#334155;font-size:13px;line-height:1.6;">${bodyText || ''}</div>`
    + `<div style="margin-top:16px;padding-top:12px;border-top:1px dashed #cbd5e1;color:#64748b;font-size:11px;">${footer || 'Email otomatis Sistem PMS PT. Pelayaran Baharimas Kalimantan.'}</div>`
    + `</div></div></body></html>`;
};
