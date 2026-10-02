import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  calculateDaysLeft,
  formatExpiryDateID,
  getSubscriptionStatusInfo,
  formatSubscriptionTickerMessage
} from '../src/services/subscriptionService';
import { SubscriptionRunningBanner } from '../src/components/subscription/SubscriptionRunningBanner';
import { SubscriptionPaymentModal } from '../src/components/subscription/SubscriptionPaymentModal';
import { canPerformAction } from '../src/utils/rbac';

let mockContextValue = {};

vi.mock('../src/context/PMSContext', () => ({
  usePMS: () => mockContextValue,
}));

describe('Sistem Notifikasi Running Teks Langganan & Remote Control (SaaS License)', () => {
  beforeEach(() => {
    mockContextValue = {
      subscriptionConfig: {
        status: 'warning',
        planName: 'Enterprise Maritime Fleet License (Baharimas PMS)',
        clientName: 'PT. Pelayaran Baharimas Kalimantan',
        expiryDate: '2026-10-15',
        warningDaysThreshold: 14,
        forceShowRunningText: true,
        customMessage: '',
        billingAmount: 'Rp 25.000.000 / Tahun',
        billingCycle: 'Tahunan',
        bankName: 'Bank Central Asia (BCA)',
        bankAccount: '880-192-8391',
        bankAccountHolder: 'PT Bahari Digital Solusindo',
        contactPerson: 'Alex Pratama',
        contactPhone: '089508888778',
        contactEmail: 'billing@baharimas.co.id',
        paymentUrl: 'https://wa.me/6289508888778',
        paymentButtonText: 'Rincian Tagihan & Bayar',
        isLocked: false,
        remoteControl: {
          enabled: true,
          syncUrl: 'https://api.external-billing.com/status.json',
          secretKey: 'pms_sub_sec_88921a',
          lastSyncTime: null,
          lastSyncStatus: 'idle',
          lastSyncMessage: ''
        }
      },
      currentRole: 'Developer',
      setActiveTab: vi.fn(),
      updateSubscriptionConfig: vi.fn(),
      resetSubscriptionConfig: vi.fn(),
      syncSubscriptionFromRemote: vi.fn(),
      showToast: vi.fn()
    };
  });

  describe('1. Logika Kalkulasi & Formatting Pesan Ticker (subscriptionService)', () => {
    it('menghitung sisa hari secara tepat untuk tanggal masa depan dan masa lalu', () => {
      const formatLocalDate = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      };

      const now = new Date();

      // 5 hari ke depan
      const future = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5);
      expect(calculateDaysLeft(formatLocalDate(future))).toBe(5);

      // 3 hari yang lalu
      const past = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3);
      expect(calculateDaysLeft(formatLocalDate(past))).toBe(-3);
    });

    it('getSubscriptionStatusInfo mendeteksi kondisi kedaluwarsa (expired) jika status expired atau daysLeft <= 0', () => {
      const expiredConfig = {
        status: 'expired',
        expiryDate: '2026-09-01',
        warningDaysThreshold: 14,
        forceShowRunningText: false
      };
      const info = getSubscriptionStatusInfo(expiredConfig);
      expect(info.isExpired).toBe(true);
      expect(info.shouldShowRunningText).toBe(true);
      expect(info.severity).toBe('danger');
      expect(info.badgeLabel).toContain('Habis');
    });

    it('getSubscriptionStatusInfo mendeteksi kondisi segera berakhir (warning) saat sisa hari <= threshold', () => {
      const now = new Date();
      const nearFuture = new Date(now);
      nearFuture.setDate(nearFuture.getDate() + 7);
      const nearFutureStr = nearFuture.toISOString().split('T')[0];

      const warningConfig = {
        status: 'active',
        expiryDate: nearFutureStr,
        warningDaysThreshold: 14,
        forceShowRunningText: false
      };
      const info = getSubscriptionStatusInfo(warningConfig);
      expect(info.isExpiringSoon).toBe(true);
      expect(info.isExpired).toBe(false);
      expect(info.shouldShowRunningText).toBe(true);
      expect(info.severity).toBe('warning');
      expect(info.badgeLabel).toContain('Segera Berakhir');
    });

    it('getSubscriptionStatusInfo menyembunyikan running text jika lisensi masih lama dan forceShowRunningText false', () => {
      const now = new Date();
      const farFuture = new Date(now);
      farFuture.setDate(farFuture.getDate() + 180);
      const farFutureStr = farFuture.toISOString().split('T')[0];

      const normalConfig = {
        status: 'active',
        expiryDate: farFutureStr,
        warningDaysThreshold: 14,
        forceShowRunningText: false
      };
      const info = getSubscriptionStatusInfo(normalConfig);
      expect(info.shouldShowRunningText).toBe(false);
      expect(info.isExpiringSoon).toBe(false);
      expect(info.isExpired).toBe(false);
    });

    it('formatSubscriptionTickerMessage mengganti variabel kustom {daysLeft} dan {expiryDate}', () => {
      const config = {
        status: 'warning',
        expiryDate: '2026-10-25',
        warningDaysThreshold: 14,
        customMessage: 'Peringatan: Lisensi tinggal {daysLeft} hari lagi sampai {expiryDate}. Hubungi dev!',
        clientName: 'PT. Bahari',
        billingAmount: 'Rp 25.000.000'
      };
      const info = {
        daysLeft: 8,
        formattedDate: '25 Okt 2026',
        isExpired: false,
        isExpiringSoon: true
      };
      const msg = formatSubscriptionTickerMessage(config, info);
      expect(msg).toContain('8');
      expect(msg).toContain('25 Okt 2026');
      expect(msg).toContain('Hubungi dev!');
    });
  });

  describe('2. Komponen Banner Running Text & Modal Pembayaran (UI)', () => {
    it('merender banner running text di layar pengguna saat kondisi running text aktif', () => {
      render(<SubscriptionRunningBanner />);

      // Tombol bayar harus ada
      const payBtn = screen.getByText('Rincian Tagihan & Bayar');
      expect(payBtn).not.toBeNull();

      // Tombol kelola khusus Developer harus ada jika role adalah Developer
      const devBtn = screen.getByText('Kelola (Dev)');
      expect(devBtn).not.toBeNull();
    });

    it('menyembunyikan tombol "Kelola (Dev)" pada banner jika pengguna bukan Developer', () => {
      mockContextValue.currentRole = 'Super Admin';
      const { queryByText } = render(<SubscriptionRunningBanner />);
      expect(queryByText('Kelola (Dev)')).toBeNull();
    });

    it('membuka modal dialog rincian pembayaran saat tombol bayar diklik', () => {
      render(<SubscriptionRunningBanner />);
      const payBtn = screen.getByText('Rincian Tagihan & Bayar');
      fireEvent.click(payBtn);

      expect(screen.getByText('Rincian Tagihan & Lisensi Aplikasi')).not.toBeNull();
      expect(screen.getByText('880-192-8391')).not.toBeNull();
      expect(screen.getByText('PT. Pelayaran Baharimas Kalimantan')).not.toBeNull();
    });

    it('membuka modal cepat SubscriptionDevModal saat tombol "Kelola (Dev)" diklik', () => {
      mockContextValue.currentRole = 'Developer';
      render(<SubscriptionRunningBanner />);
      const devBtn = screen.getByRole('button', { name: /Kelola \(Dev\)/i });
      fireEvent.click(devBtn);

      expect(screen.getByText(/Panel Pengembang: Kontrol Langganan & Running Teks/i)).not.toBeNull();
      expect(screen.getByText(/Status & Tanggal Masa Aktif/i)).not.toBeNull();
    });

    it('SubscriptionPaymentModal menyediakan tombol salin nomor rekening resmi BCA', () => {
      // Mock clipboard writeText
      const writeTextMock = vi.fn().mockResolvedValue();
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock
        }
      });

      render(
        <SubscriptionPaymentModal
          isOpen={true}
          onClose={() => {}}
          config={mockContextValue.subscriptionConfig}
        />
      );

      const copyBtn = screen.getByText('Salin No. Rekening');
      expect(copyBtn).not.toBeNull();
      fireEvent.click(copyBtn);
      expect(writeTextMock).toHaveBeenCalledWith('8801928391');
    });
  });

  describe('3. Hak Akses RBAC & Proteksi Akun Developer', () => {
    it('mengizinkan wewenang manage_subscription HANYA untuk Developer', () => {
      expect(canPerformAction('Developer', 'manage_subscription')).toBe(true);

      // Role lain tidak boleh mengelola lisensi/running text
      expect(canPerformAction('Super Admin', 'manage_subscription')).toBe(false);
      expect(canPerformAction('Fleet Manager', 'manage_subscription')).toBe(false);
      expect(canPerformAction('Admin Kapal / Nakhoda', 'manage_subscription')).toBe(false);
      expect(canPerformAction('Teknisi / Chief Engineer', 'manage_subscription')).toBe(false);
      expect(canPerformAction('Crew / ABK', 'manage_subscription')).toBe(false);
      expect(canPerformAction('Finance', 'manage_subscription')).toBe(false);
      expect(canPerformAction('HR / Personalia', 'manage_subscription')).toBe(false);
    });
  });
});
