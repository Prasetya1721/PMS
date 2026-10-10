/**
 * api/health.js
 * Pemeriksaan kesehatan server: memastikan fungsi API benar-benar hidup dan
 * konfigurasi server (tanpa membocorkan nilainya).
 */

import { sendJson, setCors } from './_lib/http.js';

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return sendJson(res, 405, { success: false, error: `Metode ${req.method} tidak didukung` });
  }

  const emailConfigured = Boolean(String(process.env.PMS_EMAIL_API_KEY || '').trim() && String(process.env.PMS_EMAIL_FROM || '').trim());
  const allowedHosts = String(process.env.PMS_GATEWAY_ALLOWED_HOSTS || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return sendJson(res, 200, {
    success: true,
    status: 'ok',
    service: 'pms-baharimas-api',
    time: new Date().toISOString(),
    endpoints: ['/api/health', '/api/subscription', '/api/proxy/whatsapp', '/api/notifications/email'],
    config: {
      emailGateway: emailConfigured ? 'configured' : 'not_configured',
      gatewayHostAllowlist: allowedHosts.length > 0 ? allowedHosts : 'open (https publik saja)',
    },
  });
}
