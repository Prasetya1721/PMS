#!/usr/bin/env node
/**
 * scripts/verify-api.mjs
 * Verifikasi pasca-deploy untuk endpoint API PMS.
 *
 * Memeriksa hal yang paling mudah salah setelah deploy:
 *   1. /api/health membalas JSON (bukan HTML aplikasi)
 *   2. endpoint API yang tidak ada membalas 404 JSON (bukan 200 HTML)
 *   3. /api/subscription membalas JSON
 *   4. rute SPA dalam tetap membalas HTML 200
 *
 * Pakai:
 *   node scripts/verify-api.mjs                          # situs produksi
 *   node scripts/verify-api.mjs http://127.0.0.1:4173    # preview lokal
 */
const base = (process.argv[2] || 'https://pms-baharimas.vercel.app').replace(/\/+$/, '');
const TIMEOUT_MS = 20_000;

const results = [];
let failed = 0;

async function probe(name, path, { method = 'GET', expectJson = null, expectStatus = 200, body } = {}) {
  const url = `${base}${path}`;
  let res;
  try {
    res = await fetch(url, {
      method,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}),
    });
  } catch (err) {
    failed += 1;
    results.push({ name, ok: false, detail: `tidak dapat dihubungi: ${err.message}` });
    return null;
  }

  const text = await res.text().catch(() => '');
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  let json = null;
  if (isJson) {
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
  }

  const problems = [];
  if (res.status !== expectStatus) problems.push(`status ${res.status}, diharapkan ${expectStatus}`);
  if (expectJson === true && !isJson) problems.push(`bukan JSON (content-type: ${contentType || 'kosong'})`);
  if (expectJson === false && isJson) problems.push('seharusnya HTML, bukan JSON');
  if (expectJson === true && isJson && json === null) problems.push('JSON tidak dapat diurai');

  const ok = problems.length === 0;
  if (!ok) failed += 1;
  results.push({
    name,
    ok,
    detail: ok ? `${res.status} ${contentType.split(';')[0]}` : problems.join('; '),
    sample: ok ? undefined : text.slice(0, 120).replace(/\s+/g, ' '),
  });
  return json;
}

console.log(`Verifikasi endpoint API: ${base}\n`);

const isLocal = /^https?:\/\/(127\.0\.0\.1|localhost)/.test(base);

const health = await probe('health JSON', '/api/health', { expectJson: true });
await probe('endpoint tidak dikenal -> 404', '/api/tidak-ada', { expectStatus: 404, expectJson: true });
await probe('subscription JSON', '/api/subscription', { expectJson: true });
await probe('proxy WhatsApp menolak body kosong', '/api/proxy/whatsapp', { method: 'POST', expectStatus: 400, expectJson: true, body: {} });
await probe('email belum dikonfigurasi -> 501', '/api/notifications/email', { method: 'POST', expectStatus: 501, expectJson: true, body: { to: 'fleet.ops@baharimas.co.id', subject: 'cek', text: 'cek' } });
if (isLocal) {
  console.log('  --    rute SPA dalam tetap HTML        dilewati (harness lokal hanya menyajikan API)');
} else {
  await probe('rute SPA dalam tetap HTML', '/vessels', { expectJson: false });
}

for (const r of results) {
  console.log(`${r.ok ? '  OK  ' : ' GAGAL'}  ${r.name.padEnd(38)} ${r.detail}`);
  if (r.sample) console.log(`         contoh balasan: ${r.sample}`);
}

if (health?.config) {
  console.log(`\nKonfigurasi server: email=${health.config.emailGateway}, allowlist=${JSON.stringify(health.config.gatewayHostAllowlist)}`);
}

console.log(failed === 0 ? '\nSemua pemeriksaan lulus.' : `\n${failed} pemeriksaan gagal.`);
process.exit(failed === 0 ? 0 : 1);
