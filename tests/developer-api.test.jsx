import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ROLE_DEFINITIONS, ROLE_PERMISSIONS, hasAccess, hasAccessWithOverrides, canPerformAction } from '../src/utils/rbac';
import { INITIAL_API_KEYS, INITIAL_USERS } from '../src/data/initialData';
import { Header } from '../src/components/layout/Header';
import { Sidebar } from '../src/components/layout/Sidebar';
import { SidebarManagementAdmin } from '../src/components/admin/SidebarManagementAdmin';

let mockContextValue = {};

vi.mock('../src/context/PMSContext', () => ({
  usePMS: () => mockContextValue,
}));

describe('Developer Access & API Key Configuration', () => {
  beforeEach(() => {
    mockContextValue = {
      vessels: [{ id: 'v-001', name: 'TB. Trans Power 201' }],
      selectedVesselId: 'all',
      setSelectedVesselId: vi.fn(),
      currentRole: 'Developer',
      setCurrentRole: vi.fn(),
      searchQuery: '',
      setSearchQuery: vi.fn(),
      overdueWOCount: 0,
      expiredDocsCount: 0,
      lowStockCount: 0,
      openNCCount: 0,
      smcOpenNCCount: 0,
      docOpenNCCount: 0,
      loadDemoData: vi.fn(),
      clearAllData: vi.fn(),
      confirm: vi.fn(),
      setActiveTab: vi.fn(),
      theme: 'dark',
      toggleTheme: vi.fn(),
      toggleMobileSidebar: vi.fn(),
      closeMobileSidebar: vi.fn(),
      isMobileSidebarOpen: false,
      sidebarOverrides: {},
      siteConfig: { companyName: 'PT Baharimas Perdana' },
      currentUser: { name: 'Dev Account', role: 'Developer' },
      logout: vi.fn(),
      updateSidebarOverrides: vi.fn(),
      showToast: vi.fn(),
    };
  });

  it('mendefinisikan peran Developer dalam ROLE_DEFINITIONS', () => {
    expect(ROLE_DEFINITIONS['Developer']).toBeDefined();
    expect(ROLE_DEFINITIONS['Developer'].label).toContain('Developer');
    expect(ROLE_DEFINITIONS['Developer'].color).toBe('#8b5cf6');
  });

  it('memberikan akses modul developer_api secara eksklusif HANYA untuk Developer', () => {
    expect(hasAccess('Developer', 'developer_api')).toBe(true);
    expect(hasAccess('Developer', 'notifications')).toBe(true);
    expect(hasAccess('Developer', 'settings')).toBe(true);
    expect(hasAccess('Developer', 'master')).toBe(true);

    // Super Admin dan semua role operasional TIDAK boleh mengakses developer_api
    expect(hasAccess('Super Admin', 'developer_api')).toBe(false);
    expect(hasAccess('Fleet Manager', 'developer_api')).toBe(false);
    expect(hasAccess('Admin Kapal / Nakhoda', 'developer_api')).toBe(false);
    expect(hasAccess('Teknisi / Chief Engineer', 'developer_api')).toBe(false);
    expect(hasAccess('Crew / ABK', 'developer_api')).toBe(false);
    expect(hasAccess('HR / Personalia', 'developer_api')).toBe(false);
    expect(hasAccess('Finance', 'developer_api')).toBe(false);
  });

  it('hasAccessWithOverrides menolak developer_api dan sidebar_management untuk non-developer meskipun ada override', () => {
    expect(hasAccessWithOverrides('Super Admin', 'developer_api', { 'Super Admin': ['developer_api'] })).toBe(false);
    expect(hasAccessWithOverrides('Super Admin', 'sidebar_management', { 'Super Admin': ['sidebar_management'] })).toBe(false);
    expect(hasAccessWithOverrides('Fleet Manager', 'developer_api', { 'Fleet Manager': ['developer_api'] })).toBe(false);
    expect(hasAccessWithOverrides('Developer', 'developer_api', {})).toBe(true);
    expect(hasAccessWithOverrides('Developer', 'sidebar_management', {})).toBe(true);
  });

  it('menyembunyikan menu Developer & API Keys serta Manajemen Sidebar di Sidebar untuk Super Admin dan menampilkan untuk Developer', () => {
    // Render sebagai Super Admin -> menu Developer & API Keys dan Manajemen Sidebar tersembunyi
    mockContextValue.currentRole = 'Super Admin';
    const { unmount, queryByText } = render(<Sidebar />);
    expect(queryByText(/Developer & API Keys/i)).toBeNull();
    expect(queryByText(/Manajemen Sidebar/i)).toBeNull();
    unmount();

    // Render sebagai Developer -> kedua menu tampil
    mockContextValue.currentRole = 'Developer';
    const { queryByText: queryByTextDev } = render(<Sidebar />);
    expect(queryByTextDev(/Developer & API Keys/i)).not.toBeNull();
    expect(queryByTextDev(/Manajemen Sidebar/i)).not.toBeNull();
  });

  it('menyembunyikan kolom Developer dan modul developer_api dari tabel Manajemen Sidebar, namun Super Admin dapat dikonfigurasi', () => {
    mockContextValue.currentRole = 'Developer';

    const { container } = render(<SidebarManagementAdmin />);

    // Header tabel tidak boleh memuat 'Developer' sebagai kolom peran
    const thElements = Array.from(container.querySelectorAll('th'));
    const devTh = thElements.find(th => th.textContent.includes('Developer'));
    expect(devTh).toBeUndefined();

    // Modul developer_api tidak boleh ada dalam daftar baris tabel
    expect(container.textContent).not.toContain('Developer & Konfigurasi API');

    // Kolom Super Admin kini dapat dikonfigurasi oleh Developer
    const saTh = thElements.find(th => th.textContent.includes('Super Admin'));
    expect(saTh).toBeDefined();
  });

  it('memberikan wewenang configure_api_keys hanya kepada Developer (Super Admin ditolak)', () => {
    expect(canPerformAction('Developer', 'configure_api_keys')).toBe(true);
    expect(canPerformAction('Super Admin', 'configure_api_keys')).toBe(false);
    expect(canPerformAction('Fleet Manager', 'configure_api_keys')).toBe(false);
    expect(canPerformAction('Crew / ABK', 'configure_api_keys')).toBe(false);
    expect(canPerformAction('HR / Personalia', 'configure_api_keys')).toBe(false);
  });

  it('Super Admin hanya boleh menambah dan mengedit sertifikat/dokumen, tetapi dilarang menghapus (hanya Developer)', () => {
    // Super Admin & Developer diizinkan tambah dan edit
    expect(canPerformAction('Super Admin', 'add_certificate')).toBe(true);
    expect(canPerformAction('Super Admin', 'add_ship_document')).toBe(true);
    expect(canPerformAction('Super Admin', 'edit_certificate')).toBe(true);
    expect(canPerformAction('Super Admin', 'edit_ship_document')).toBe(true);

    // Hapus sertifikat & dokumen DITOLAK untuk Super Admin, HANYA Developer yang berwenang
    expect(canPerformAction('Super Admin', 'delete_certificate')).toBe(false);
    expect(canPerformAction('Super Admin', 'delete_ship_document')).toBe(false);
    expect(canPerformAction('Developer', 'delete_certificate')).toBe(true);
    expect(canPerformAction('Developer', 'delete_ship_document')).toBe(true);

    // Semua peran operasional lain DITOLAK
    expect(canPerformAction('Fleet Manager', 'add_certificate')).toBe(false);
    expect(canPerformAction('Admin Kapal / Nakhoda', 'add_certificate')).toBe(false);
    expect(canPerformAction('Teknisi / Chief Engineer', 'add_certificate')).toBe(false);
    expect(canPerformAction('Crew / ABK', 'add_certificate')).toBe(false);
    expect(canPerformAction('HR / Personalia', 'add_certificate')).toBe(false);
    expect(canPerformAction('Finance', 'add_certificate')).toBe(false);
  });

  it('membuka semua akses modul dan semua aksi untuk akun Developer (full unrestricted access)', () => {
    const testModules = ['dashboard', 'fleet', 'audit', 'documents', 'equipment', 'maintenance', 'spareparts', 'costs', 'crew', 'notifications', 'reports', 'master', 'settings', 'sidebar_management', 'developer_api'];
    testModules.forEach(mod => {
      expect(hasAccess('Developer', mod)).toBe(true);
    });

    const testActions = ['manage_users', 'edit_master_data', 'approve_po', 'edit_budget', 'record_actual_expense', 'create_audit_session', 'close_audit_nc', 'delete_audit_finding', 'approve_leave'];
    testActions.forEach(act => {
      expect(canPerformAction('Developer', act)).toBe(true);
    });
  });

  it('memiliki konfigurasi INITIAL_API_KEYS lengkap (WA, Email, AIS, Cuaca, AI Assistant, BKI, Webhook)', () => {
    expect(INITIAL_API_KEYS.whatsapp).toBeDefined();
    expect(INITIAL_API_KEYS.email).toBeDefined();
    expect(INITIAL_API_KEYS.aisTracking).toBeDefined();
    expect(INITIAL_API_KEYS.marineWeather).toBeDefined();
    expect(INITIAL_API_KEYS.aiAssistant).toBeDefined();
    expect(INITIAL_API_KEYS.bkiExchange).toBeDefined();
    expect(INITIAL_API_KEYS.webhookSecret).toBeDefined();
  });

  it('memuat akun pengguna default Developer (Alex Pratama)', () => {
    const devUser = INITIAL_USERS.find(u => u.role === 'Developer');
    expect(devUser).toBeDefined();
    expect(devUser.email).toBe('dev@baharimas.co.id');
  });

  it('menampilkan opsi Developer pada pilihan ganti peran di Header', () => {
    render(<Header />);
    const roleSelect = screen.getByLabelText(/Ganti Peran/i);
    expect(roleSelect).toBeTruthy();

    const devOption = screen.getByRole('option', { name: /Developer/i });
    expect(devOption).toBeTruthy();
    expect(devOption.value).toBe('Developer');
  });

  describe('Fungsi Berbahaya — Pembatasan Khusus Developer', () => {
    const dangerousDevOnlyActions = ['reset_all_data', 'load_demo_data', 'reset_users', 'reset_site_config'];
    const dangerousAdminActions = ['delete_vessel', 'delete_user'];
    const nonPrivilegedRoles = ['Fleet Manager', 'Admin Kapal / Nakhoda', 'Teknisi / Chief Engineer', 'Crew / ABK', 'HR / Personalia', 'Finance'];

    it('membatasi reset_all_data, load_demo_data, reset_users, reset_site_config HANYA untuk Developer', () => {
      dangerousDevOnlyActions.forEach(action => {
        // Developer diizinkan
        expect(canPerformAction('Developer', action)).toBe(true);
        // Super Admin ditolak (hanya editor konten)
        expect(canPerformAction('Super Admin', action)).toBe(false);
        // Semua role operasional DITOLAK
        nonPrivilegedRoles.forEach(role => {
          expect(canPerformAction(role, action)).toBe(false);
        });
      });
    });

    it('membatasi delete_vessel dan delete_user HANYA untuk Developer (Super Admin ditolak)', () => {
      dangerousAdminActions.forEach(action => {
        expect(canPerformAction('Developer', action)).toBe(true);
        expect(canPerformAction('Super Admin', action)).toBe(false);
        nonPrivilegedRoles.forEach(role => {
          expect(canPerformAction(role, action)).toBe(false);
        });
      });
    });

    it('Developer memiliki akses ke SEMUA aksi tanpa terkecuali', () => {
      const allActions = [
        ...dangerousDevOnlyActions,
        ...dangerousAdminActions,
        'configure_api_keys', 'manage_developer_tools',
        'add_certificate', 'edit_certificate', 'delete_certificate',
        'manage_users', 'edit_master_data',
        'edit_budget', 'approve_po', 'record_actual_expense',
        'create_audit_session', 'delete_audit_session', 'close_audit_nc',
        'approve_leave', 'submit_leave',
        'create_work_order', 'create_purchase_request',
        'manage_bot_gateway',
      ];
      allActions.forEach(action => {
        expect(canPerformAction('Developer', action)).toBe(true);
      });
    });
  });
});
