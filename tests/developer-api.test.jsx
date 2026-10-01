import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ROLE_DEFINITIONS, ROLE_PERMISSIONS, hasAccess, canPerformAction } from '../src/utils/rbac';
import { INITIAL_API_KEYS, INITIAL_USERS } from '../src/data/initialData';
import { Header } from '../src/components/layout/Header';

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
      openNCCount: 0,
      loadDemoData: vi.fn(),
      clearAllData: vi.fn(),
      confirm: vi.fn(),
      setActiveTab: vi.fn(),
      theme: 'dark',
      toggleTheme: vi.fn(),
      toggleMobileSidebar: vi.fn(),
      isMobileSidebarOpen: false,
      sidebarOverrides: {},
    };
  });

  it('mendefinisikan peran Developer dalam ROLE_DEFINITIONS', () => {
    expect(ROLE_DEFINITIONS['Developer']).toBeDefined();
    expect(ROLE_DEFINITIONS['Developer'].label).toContain('Developer');
    expect(ROLE_DEFINITIONS['Developer'].color).toBe('#8b5cf6');
  });

  it('memberikan akses modul developer_api, notifications, dan settings untuk Developer', () => {
    expect(hasAccess('Developer', 'developer_api')).toBe(true);
    expect(hasAccess('Developer', 'notifications')).toBe(true);
    expect(hasAccess('Developer', 'settings')).toBe(true);
    expect(hasAccess('Developer', 'master')).toBe(true);

    // Non-developer/non-admin tidak boleh akses developer_api
    expect(hasAccess('Crew / ABK', 'developer_api')).toBe(false);
    expect(hasAccess('Finance', 'developer_api')).toBe(false);
  });

  it('memberikan wewenang configure_api_keys kepada Super Admin dan Developer saja', () => {
    expect(canPerformAction('Super Admin', 'configure_api_keys')).toBe(true);
    expect(canPerformAction('Developer', 'configure_api_keys')).toBe(true);
    expect(canPerformAction('Fleet Manager', 'configure_api_keys')).toBe(false);
    expect(canPerformAction('Crew / ABK', 'configure_api_keys')).toBe(false);
    expect(canPerformAction('HR / Personalia', 'configure_api_keys')).toBe(false);
  });

  it('membatasi tambah, ubah, dan hapus sertifikat kapal hanya untuk Super Admin dan Developer', () => {
    // Super Admin & Developer diizinkan
    expect(canPerformAction('Super Admin', 'add_certificate')).toBe(true);
    expect(canPerformAction('Super Admin', 'add_ship_document')).toBe(true);
    expect(canPerformAction('Super Admin', 'edit_certificate')).toBe(true);
    expect(canPerformAction('Super Admin', 'delete_certificate')).toBe(true);
    expect(canPerformAction('Developer', 'add_certificate')).toBe(true);

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
        // Super Admin juga diizinkan (early return in canPerformAction)
        expect(canPerformAction('Super Admin', action)).toBe(true);
        // Semua role operasional DITOLAK
        nonPrivilegedRoles.forEach(role => {
          expect(canPerformAction(role, action)).toBe(false);
        });
      });
    });

    it('membatasi delete_vessel dan delete_user hanya untuk Super Admin dan Developer', () => {
      dangerousAdminActions.forEach(action => {
        expect(canPerformAction('Developer', action)).toBe(true);
        expect(canPerformAction('Super Admin', action)).toBe(true);
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
