import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  normalizePhoneNumber,
  normalizeWablasUrl,
  buildWablasAuthHeader,
  sendWhatsAppViaGateway
} from '../src/services/whatsappService';

describe('WhatsApp Gateway Service & Wablas Integration', () => {
  describe('normalizePhoneNumber', () => {
    it('mengubah nomor lokal format 08... menjadi format internasional 628...', () => {
      expect(normalizePhoneNumber('089508888778')).toBe('6289508888778');
      expect(normalizePhoneNumber('0812-3456-7890')).toBe('6281234567890');
    });

    it('menangani nomor dengan awalan +62 dan spasi/karakter non-digit', () => {
      expect(normalizePhoneNumber('+62 895-0888-8778')).toBe('6289508888778');
      expect(normalizePhoneNumber('6281234567890')).toBe('6281234567890');
    });

    it('menambahkan kode negara 62 jika nomor diawali angka 8 langsung', () => {
      expect(normalizePhoneNumber('89508888778')).toBe('6289508888778');
    });

    it('mengembalikan string kosong jika input null, undefined, atau kosong', () => {
      expect(normalizePhoneNumber('')).toBe('');
      expect(normalizePhoneNumber(null)).toBe('');
      expect(normalizePhoneNumber(undefined)).toBe('');
    });
  });

  describe('normalizeWablasUrl', () => {
    it('menambahkan protokol https:// dan endpoint /api/send-message jika belum ada', () => {
      expect(normalizeWablasUrl('jkt.wablas.com')).toBe('https://jkt.wablas.com/api/send-message');
      expect(normalizeWablasUrl('https://jkt.wablas.com')).toBe('https://jkt.wablas.com/api/send-message');
    });

    it('mempertahankan URL lengkap jika sudah memiliki path /api/send-message', () => {
      expect(normalizeWablasUrl('https://solo.wablas.com/api/send-message')).toBe('https://solo.wablas.com/api/send-message');
    });

    it('mengembalikan endpoint default Jakarta jika input kosong', () => {
      expect(normalizeWablasUrl('')).toBe('https://jkt.wablas.com/api/send-message');
    });
  });

  describe('buildWablasAuthHeader', () => {
    it('mengembalikan token murni jika secret key tidak disediakan', () => {
      expect(buildWablasAuthHeader('my_token_123', '')).toBe('my_token_123');
    });

    it('menggabungkan token dan secret key dengan format {token}.{secret}', () => {
      expect(buildWablasAuthHeader('my_token_123', 'sec_456')).toBe('my_token_123.sec_456');
    });

    it('tidak menduplikasi secret key jika token sudah memiliki titik format token.secret', () => {
      expect(buildWablasAuthHeader('my_token_123.sec_456', 'extra_secret')).toBe('my_token_123.sec_456');
    });
  });

  describe('sendWhatsAppViaGateway validation', () => {
    it('menolak pengiriman jika nomor telepon tidak valid atau kurang dari 9 digit', async () => {
      const res = await sendWhatsAppViaGateway({
        apiUrl: 'https://jkt.wablas.com/api/send-message',
        apiKey: 'token123',
        phone: '123',
        message: 'halo'
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe('INVALID_PHONE');
    });

    it('menolak pengiriman jika API Key / token belum diisi', async () => {
      const res = await sendWhatsAppViaGateway({
        apiUrl: 'https://jkt.wablas.com/api/send-message',
        apiKey: '',
        phone: '089508888778',
        message: 'halo'
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe('NO_API_KEY');
    });
  });

  describe('sendWhatsAppReminder with Gateway API', () => {
    it('mengirim via gateway ketika useGatewayApi: true dan apiKey tersedia', async () => {
      const { sendWhatsAppReminder } = await import('../src/context/logic/sendWhatsAppReminder.js');
      const fakeSettings = {
        autoSend: {
          whatsappGateway: {
            apiUrl: 'https://jkt.wablas.com/api/send-message',
            apiKey: 'mock_token',
            secretKey: 'mock_sec',
            provider: 'Wablas API'
          }
        }
      };

      // Mock global fetch to return success
      const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ status: true, message: 'Message sent successfully' }),
          text: () => Promise.resolve('{"status":true}')
        })
      );

      const logs = [];
      const setLogs = vi.fn(updater => {
        if (typeof updater === 'function') logs.push(...updater([]));
      });
      const showToast = vi.fn();

      const item = {
        name: 'Surat Laut Kapal',
        documentNo: 'SL-001',
        vesselId: 'v-1',
        daysUntilExpiry: 30,
        expiryDate: '2026-10-18'
      };

      const result = await sendWhatsAppReminder(
        item,
        'ship_doc',
        { offsetDays: 30, phone: '08993507999', useGatewayApi: true, silent: true },
        fakeSettings,
        [{ id: 'v-1', name: 'TB. Bahari 01' }],
        [],
        setLogs,
        showToast
      );

      expect(result.status).toContain('Delivered');
      expect(result.target).toContain('628993507999');
      fetchSpy.mockRestore();
    });

    it('gagal dengan pesan jelas jika apiKey kosong saat useGatewayApi: true', async () => {
      const { sendWhatsAppReminder } = await import('../src/context/logic/sendWhatsAppReminder.js');
      const fakeSettings = {
        autoSend: {
          whatsappGateway: {
            apiKey: ''
          }
        }
      };

      const setLogs = vi.fn();
      const showToast = vi.fn();

      const item = {
        name: 'Surat Laut Kapal',
        documentNo: 'SL-001',
        vesselId: 'v-1',
        daysUntilExpiry: 7,
        expiryDate: '2026-10-18'
      };

      const result = await sendWhatsAppReminder(
        item,
        'ship_doc',
        { offsetDays: 7, phone: '08993507999', useGatewayApi: true, silent: true },
        fakeSettings,
        [],
        [],
        setLogs,
        showToast
      );

      expect(result.status).toContain('Failed: API Key Wablas belum dikonfigurasi');
    });
  });
});
