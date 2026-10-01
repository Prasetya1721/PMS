import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Header } from '../src/components/layout/Header';

// Mock context hook untuk menguji perilaku interaksi Header secara terisolasi
const mockConfirm = vi.fn();
const mockLoadDemoData = vi.fn();
const mockClearAllData = vi.fn();
const mockExportFullDatabaseBackup = vi.fn();
const mockSetSelectedVesselId = vi.fn();
const mockSetCurrentRole = vi.fn();
const mockSetSearchQuery = vi.fn();
const mockSetActiveTab = vi.fn();
const mockToggleTheme = vi.fn();
const mockToggleMobileSidebar = vi.fn();

let mockContextValue = {};

vi.mock('../src/context/PMSContext', () => ({
  usePMS: () => mockContextValue,
}));

describe('Header - Pemisahan Tombol Muat Demo & Bersihkan Data', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockContextValue = {
      vessels: [
        { id: 'v-001', name: 'TB. Trans Power 201', type: 'Tugboat', ownershipStatus: 'Owner' },
      ],
      selectedVesselId: 'all',
      setSelectedVesselId: mockSetSelectedVesselId,
      currentRole: 'Developer',
      setCurrentRole: mockSetCurrentRole,
      searchQuery: '',
      setSearchQuery: mockSetSearchQuery,
      overdueWOCount: 0,
      expiredDocsCount: 0,
      openNCCount: 0,
      loadDemoData: mockLoadDemoData,
      clearAllData: mockClearAllData,
      exportFullDatabaseBackup: mockExportFullDatabaseBackup,
      confirm: mockConfirm,
      setActiveTab: mockSetActiveTab,
      theme: 'dark',
      toggleTheme: mockToggleTheme,
      toggleMobileSidebar: mockToggleMobileSidebar,
      isMobileSidebarOpen: false,
      sidebarOverrides: {},
    };
  });

  it('menampilkan tombol "Muat Demo" dan "Bersihkan Data" di desktop & mobile, bukan tombol tunggal "Reset Data"', () => {
    render(<Header />);

    // Tombol ambigu "Reset Data" tidak boleh ada lagi
    const ambiguousButtons = screen.queryAllByRole('button', { name: /^Reset Data$/i });
    expect(ambiguousButtons.length).toBe(0);

    // Tombol Muat Demo ada di desktop dan mobile (total 2)
    const demoBtns = screen.getAllByRole('button', { name: /demo/i });
    expect(demoBtns.length).toBe(2);

    // Tombol Bersihkan Data ada di desktop dan mobile untuk Developer (total 2)
    const clearBtns = screen.getAllByRole('button', { name: /bersih|kosongkan/i });
    expect(clearBtns.length).toBe(2);
  });

  it('meminta konfirmasi sebelum memuat data demo (tidak langsung menimpa)', async () => {
    mockConfirm.mockResolvedValueOnce(false); // Pengguna membatalkan
    render(<Header />);

    const demoBtns = screen.getAllByRole('button', { name: /demo/i });
    fireEvent.click(demoBtns[0]);

    expect(mockConfirm).toHaveBeenCalledTimes(1);
    expect(mockLoadDemoData).not.toHaveBeenCalled();

    // Jika pengguna mengonfirmasi (true)
    mockConfirm.mockResolvedValueOnce(true);
    fireEvent.click(demoBtns[0]);

    await waitFor(() => {
      expect(mockLoadDemoData).toHaveBeenCalledTimes(1);
    });
  });

  it('juga meminta konfirmasi saat tombol demo di bar mobile diklik', async () => {
    mockConfirm.mockResolvedValueOnce(true);
    render(<Header />);

    const demoBtns = screen.getAllByRole('button', { name: /demo/i });
    // Tombol kedua adalah versi mobile
    fireEvent.click(demoBtns[1]);

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledTimes(1);
      expect(mockLoadDemoData).toHaveBeenCalledTimes(1);
    });
  });

  it('meminta konfirmasi destruktif dengan requireText "HAPUS" untuk membersihkan data', async () => {
    mockConfirm.mockResolvedValueOnce(false); // Pengguna batal
    render(<Header />);

    const clearBtns = screen.getAllByRole('button', { name: /bersih|kosongkan/i });
    fireEvent.click(clearBtns[0]);

    expect(mockConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'danger',
        requireText: 'HAPUS',
      })
    );
    expect(mockClearAllData).not.toHaveBeenCalled();
  });

  it('menawarkan ekspor cadangan (backup) saat pengguna mengonfirmasi pembersihan data', async () => {
    // 1. Konfirmasi destruktif pertama lolos (true)
    // 2. Dialog penawaran backup dijawab Ya (true)
    mockConfirm
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true);

    render(<Header />);

    const clearBtns = screen.getAllByRole('button', { name: /bersih|kosongkan/i });
    fireEvent.click(clearBtns[0]);

    await waitFor(() => {
      expect(mockExportFullDatabaseBackup).toHaveBeenCalledTimes(1);
      expect(mockClearAllData).toHaveBeenCalledTimes(1);
    });
  });

  it('tetap membersihkan data jika pengguna menolak ekspor cadangan tetapi sudah lolos HAPUS', async () => {
    // 1. Konfirmasi destruktif pertama lolos (true)
    // 2. Dialog penawaran backup ditolak/dilewati (false)
    mockConfirm
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    render(<Header />);

    const clearBtns = screen.getAllByRole('button', { name: /bersih|kosongkan/i });
    fireEvent.click(clearBtns[0]);

    await waitFor(() => {
      expect(mockExportFullDatabaseBackup).not.toHaveBeenCalled();
      expect(mockClearAllData).toHaveBeenCalledTimes(1);
    });
  });

  it('menyembunyikan tombol destruktif bersihkan data untuk role non-admin (misal Crew / ABK)', () => {
    mockContextValue.currentRole = 'Crew / ABK';
    render(<Header />);

    const clearBtns = screen.queryAllByRole('button', { name: /bersih|kosongkan/i });
    expect(clearBtns.length).toBe(0);
  });

  it('menyembunyikan tombol destruktif bersihkan data dan muat demo untuk Super Admin (hanya editor konten)', () => {
    mockContextValue.currentRole = 'Super Admin';
    render(<Header />);

    const clearBtns = screen.queryAllByRole('button', { name: /bersih|kosongkan/i });
    expect(clearBtns.length).toBe(0);

    const demoBtns = screen.queryAllByRole('button', { name: /demo/i });
    expect(demoBtns.length).toBe(0);
  });
});
