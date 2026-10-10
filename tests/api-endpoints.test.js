// @vitest-environment node
/**
 * Tes endpoint serverless di api/.
 *
 * Konteks: aplikasi ini sebelumnya memanggil tiga endpoint API yang tidak pernah
 * ada (/api/proxy/whatsapp, /api/notifications/email, /api/health) sehingga
 * selalu gagal atau menerima HTML SPA. Tes ini mengunci kontrak ketiganya,
 * termasuk pengaman SSRF pada proxy.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import health from '../api/health.js';
import emailHandler from '../api/notifications/email.js';
import whatsappProxy from '../api/proxy/whatsapp.js';
import { checkOutboundUrl } from '../api/_lib/http.js';

/** Request palsu: cukup seperti IncomingMessage untuk handler kita. */
function makeReq({ method = 'POST', body, headers = {}, stream = false } = {}) {
  const req = {
    method,
    headers,
    ...(body !== undefined && !stream ? { body } : {}),
  };
  if (stream) {
    const payload = typeof body === 'string' ? body : JSON.stringify(body ?? {});
    req[Symbol.asyncIterator] = async function* iterator() {
      yield Buffer.from(payload, 'utf8');
    };
  }
  return req;
}

/** Response palsu yang merekam status, header, dan body JSON. */
function makeRes() {
  return {
    statusCode: undefined,
    headers: {},
    payload: undefined,
    ended: false,
    setHeader(key, value) {
      this.headers[key.toLowerCase()] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
    end() {
      this.ended = true;
      return this;
    },
  };
}

const originalEnv = { ...process.env };

afterEach(() => {
  vi.unstubAllGlobals();
  process.env = { ...originalEnv };
});

describe('penjaga SSRF proxy WhatsApp', () => {
  it('menolak jaringan privat, non-https, dan URL tidak valid', () => {
    for (const url of [
      'http://jkt.wablas.com/api/send-message',
      'https://127.0.0.1/api/send-message',
      'https://localhost/api/send-message',
      'https://169.254.169.254/latest/meta-data/',
      'https://10.0.0.5/send',
      'https://192.168.1.10/send',
      'https://172.16.4.4/send',
      'https://metadata.google.internal/computeMetadata/v1/',
      'bukan-url',
    ]) {
      expect(checkOutboundUrl(url).ok, `harus ditolak: ${url}`).toBe(false);
    }
  });

  it('mengizinkan host publik lewat https', () => {
    const result = checkOutboundUrl('https://jkt.wablas.com/api/send-message');
    expect(result.ok).toBe(true);
    expect(result.url.hostname).toBe('jkt.wablas.com');
  });

  it('menegakkan daftar izin host bila PMS_GATEWAY_ALLOWED_HOSTS diisi', () => {
    process.env.PMS_GATEWAY_ALLOWED_HOSTS = '*.wablas.com,gateway.fonnte.com';
    expect(checkOutboundUrl('https://jkt.wablas.com/api/send-message').ok).toBe(true);
    expect(checkOutboundUrl('https://gateway.fonnte.com/api/send').ok).toBe(true);
    expect(checkOutboundUrl('https://situs-lain.example.com/send').ok).toBe(false);
  });
});

describe('POST /api/proxy/whatsapp', () => {
  it('menolak nomor telepon yang tidak valid', async () => {
    const res = makeRes();
    await whatsappProxy(makeReq({ body: { targetUrl: 'https://jkt.wablas.com/api/send-message', authHeader: 'tok', phone: '123', message: 'hai' } }), res);
    expect(res.statusCode).toBe(400);
    expect(res.payload.error).toBe('INVALID_PHONE');
  });

  it('menolak pesan kosong dan pesan yang terlalu panjang', async () => {
    const empty = makeRes();
    await whatsappProxy(makeReq({ body: { targetUrl: 'https://jkt.wablas.com/api/send-message', authHeader: 'tok', phone: '628123456789', message: '   ' } }), empty);
    expect(empty.statusCode).toBe(400);
    expect(empty.payload.error).toBe('EMPTY_MESSAGE');

    const long = makeRes();
    await whatsappProxy(makeReq({ body: { targetUrl: 'https://jkt.wablas.com/api/send-message', authHeader: 'tok', phone: '628123456789', message: 'x'.repeat(5000) } }), long);
    expect(long.statusCode).toBe(413);
    expect(long.payload.error).toBe('MESSAGE_TOO_LONG');
  });

  it('menolak permintaan tanpa token', async () => {
    const res = makeRes();
    await whatsappProxy(makeReq({ body: { targetUrl: 'https://jkt.wablas.com/api/send-message', authHeader: '', phone: '628123456789', message: 'hai' } }), res);
    expect(res.statusCode).toBe(400);
    expect(res.payload.error).toBe('NO_API_KEY');
  });

  it('memblokir target privat sebelum keluar jaringan', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const res = makeRes();
    await whatsappProxy(makeReq({ body: { targetUrl: 'http://169.254.169.254/latest/meta-data/', authHeader: 'tok', phone: '628123456789', message: 'hai' } }), res);
    expect(res.statusCode).toBe(400);
    expect(res.payload.error).toBe('BLOCKED_TARGET');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('meneruskan balasan sukses Wablas apa adanya', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ status: true, message: 'queued', data: { id: 'abc' } }), { status: 200, headers: { 'Content-Type': 'application/json' } })));
    const res = makeRes();
    await whatsappProxy(makeReq({ body: { targetUrl: 'https://jkt.wablas.com/api/send-message', authHeader: 'tok.secret', phone: '0895-0888-8778', message: 'hai' } }), res);
    expect(res.statusCode).toBe(200);
    expect(res.payload.ok).toBe(true);
    expect(res.payload.body).toMatchObject({ status: true, data: { id: 'abc' } });
    const [, options] = fetch.mock.calls[0];
    expect(options.headers.Authorization).toBe('tok.secret');
    expect(JSON.parse(options.body)).toEqual({ phone: '6289508888778', message: 'hai' });
  });

  it('menerjemahkan body non-JSON (mis. halaman WAF) menjadi pesan yang bisa dibaca', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('<html>Blocked</html>', { status: 200 })));
    const res = makeRes();
    await whatsappProxy(makeReq({ body: { targetUrl: 'https://jkt.wablas.com/api/send-message', authHeader: 'tok', phone: '628123456789', message: 'hai' } }), res);
    expect(res.statusCode).toBe(200);
    expect(res.payload.body.message).toContain('Blocked');
  });

  it('melaporkan gateway yang tidak dapat dihubungi sebagai 502', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('ENOTFOUND'); }));
    const res = makeRes();
    await whatsappProxy(makeReq({ body: { targetUrl: 'https://jkt.wablas.com/api/send-message', authHeader: 'tok', phone: '628123456789', message: 'hai' } }), res);
    expect(res.statusCode).toBe(502);
    expect(res.payload.error).toBe('GATEWAY_UNREACHABLE');
  });

  it('menolak metode selain POST dan menjawab preflight OPTIONS', async () => {
    const get = makeRes();
    await whatsappProxy(makeReq({ method: 'GET' }), get);
    expect(get.statusCode).toBe(405);

    const options = makeRes();
    await whatsappProxy(makeReq({ method: 'OPTIONS' }), options);
    expect(options.statusCode).toBe(200);
    expect(options.headers['access-control-allow-origin']).toBe('*');
  });

  it('membaca body dari stream dan menolak JSON yang tidak valid', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ status: true }), { status: 200 })));
    const streamed = makeRes();
    await whatsappProxy(makeReq({ stream: true, body: { targetUrl: 'https://jkt.wablas.com/api/send-message', authHeader: 'tok', phone: '628123456789', message: 'hai' } }), streamed);
    expect(streamed.statusCode).toBe(200);

    const broken = makeRes();
    await whatsappProxy(makeReq({ stream: true, body: '{bukan json' }), broken);
    expect(broken.statusCode).toBe(400);
    expect(broken.payload.error).toBe('Body bukan JSON yang valid.');
  });
});

describe('POST /api/notifications/email', () => {
  it('menolak permintaan tanpa penerima yang valid', async () => {
    const res = makeRes();
    await emailHandler(makeReq({ body: { to: 'bukan-email', subject: 'Tes', text: 'Halo' } }), res);
    expect(res.statusCode).toBe(400);
    expect(res.payload.error).toBe('NO_RECIPIENT');
  });

  it('menjawab 501 dengan jujur saat kanal email belum dikonfigurasi', async () => {
    delete process.env.PMS_EMAIL_API_KEY;
    delete process.env.PMS_EMAIL_FROM;
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const res = makeRes();
    await emailHandler(makeReq({ body: { to: 'fleet.ops@baharimas.co.id', subject: 'Tes', text: 'Halo' } }), res);
    expect(res.statusCode).toBe(501);
    expect(res.payload.error).toBe('EMAIL_NOT_CONFIGURED');
    expect(res.payload.queued).toBe(true);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('mengirim lewat penyedia saat sudah dikonfigurasi', async () => {
    process.env.PMS_EMAIL_API_KEY = 're_test';
    process.env.PMS_EMAIL_FROM = 'PMS Baharimas <noreply@baharimas.co.id>';
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ id: 'msg_1' }), { status: 200 })));
    const res = makeRes();
    await emailHandler(makeReq({ body: { to: 'fleet.ops@baharimas.co.id', cc: 'ops2@baharimas.co.id', subject: 'Pengingat', text: 'Sertifikat segera habis' } }), res);
    expect(res.statusCode).toBe(200);
    expect(res.payload.success).toBe(true);
    expect(res.payload.id).toBe('msg_1');
    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(options.headers.Authorization).toBe('Bearer re_test');
    expect(JSON.parse(options.body)).toMatchObject({ to: ['fleet.ops@baharimas.co.id'], cc: ['ops2@baharimas.co.id'], subject: 'Pengingat' });
  });

  it('menegakkan daftar izin penerima bila PMS_EMAIL_ALLOWED_TO diisi', async () => {
    process.env.PMS_EMAIL_API_KEY = 're_test';
    process.env.PMS_EMAIL_FROM = 'noreply@baharimas.co.id';
    process.env.PMS_EMAIL_ALLOWED_TO = 'fleet.ops@baharimas.co.id';
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const res = makeRes();
    await emailHandler(makeReq({ body: { to: 'orang.luar@example.com', subject: 'Tes', text: 'Halo' } }), res);
    expect(res.statusCode).toBe(403);
    expect(res.payload.error).toBe('RECIPIENT_NOT_ALLOWED');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('melaporkan penolakan penyedia sebagai 502, bukan sukses palsu', async () => {
    process.env.PMS_EMAIL_API_KEY = 're_test';
    process.env.PMS_EMAIL_FROM = 'noreply@baharimas.co.id';
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ message: 'domain not verified' }), { status: 403 })));
    const res = makeRes();
    await emailHandler(makeReq({ body: { to: 'fleet.ops@baharimas.co.id', subject: 'Tes', text: 'Halo' } }), res);
    expect(res.statusCode).toBe(502);
    expect(res.payload.error).toBe('EMAIL_REJECTED');
    expect(res.payload.message).toContain('domain not verified');
  });
});

describe('GET /api/health', () => {
  it('membalas JSON status server tanpa membocorkan rahasia', async () => {
    process.env.PMS_EMAIL_API_KEY = 're_super_secret';
    process.env.PMS_EMAIL_FROM = 'noreply@baharimas.co.id';
    const res = makeRes();
    await health(makeReq({ method: 'GET' }), res);
    expect(res.statusCode).toBe(200);
    expect(res.payload).toMatchObject({ success: true, status: 'ok', service: 'pms-baharimas-api' });
    expect(res.payload.config.emailGateway).toBe('configured');
    expect(JSON.stringify(res.payload)).not.toContain('re_super_secret');
    expect(res.payload.endpoints).toContain('/api/proxy/whatsapp');
  });

  it('menolak metode selain GET', async () => {
    const res = makeRes();
    await health(makeReq({ method: 'POST' }), res);
    expect(res.statusCode).toBe(405);
  });
});
