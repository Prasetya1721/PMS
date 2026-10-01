import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { PMSProvider, usePMS } from '../src/context/PMSContext';

describe('Running Hours Validation (ISM Code & Monotonic Increase)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem('pms_fleet_version', 'v15-clean-audit-bki');
    // Inisialisasi equipment dummy di localStorage
    const sampleEquipment = [
      {
        id: 'eq-test-01',
        vesselId: 'v-001',
        name: 'Main Engine #1',
        code: 'ME-01',
        runningHours: 5000,
        nextServiceHours: 5200,
        status: 'Normal',
      },
    ];
    window.localStorage.setItem('pms_equipment', JSON.stringify(sampleEquipment));
  });

  const wrapper = ({ children }) => <PMSProvider>{children}</PMSProvider>;

  it('menolak jam kerja bernilai 0 atau negatif', () => {
    const { result } = renderHook(() => usePMS(), { wrapper });

    act(() => {
      const resNeg = result.current.updateRunningHours('eq-test-01', -50, false);
      expect(resNeg.success).toBe(false);
      expect(resNeg.reason).toMatch(/tidak boleh negatif/i);

      const resZero = result.current.updateRunningHours('eq-test-01', 0, false);
      expect(resZero.success).toBe(false);
      expect(resZero.reason).toMatch(/lebih dari 0/i);
    });
  });

  it('menolak mode total (odometer) jika nilai <= jam kerja saat ini (monoton meningkat per ISM Code)', () => {
    const { result } = renderHook(() => usePMS(), { wrapper });

    act(() => {
      // Nilai sama (5000)
      const resSame = result.current.updateRunningHours('eq-test-01', 5000, true);
      expect(resSame.success).toBe(false);
      expect(resSame.reason).toMatch(/tidak ada perubahan bermakna/i);

      // Nilai lebih kecil (4500) tanpa allowDecrease
      const resLower = result.current.updateRunningHours('eq-test-01', 4500, true);
      expect(resLower.success).toBe(false);
      expect(resLower.reason).toMatch(/ISM Code/i);
      expect(resLower.reason).toMatch(/overhaul/i);
    });
  });

  it('mengizinkan nilai lebih kecil pada mode total jika flag allowDecrease diaktifkan (reset overhaul)', () => {
    const { result } = renderHook(() => usePMS(), { wrapper });

    act(() => {
      const resOverhaul = result.current.updateRunningHours('eq-test-01', 0, true, { allowDecrease: true });
      expect(resOverhaul.success).toBe(true);
      expect(resOverhaul.newHours).toBe(0);
    });

    // Cek state equipment terupdate
    const eq = result.current.equipment.find(e => e.id === 'eq-test-01');
    expect(eq.runningHours).toBe(0);
  });

  it('meminta konfirmasi tambahan (needsConfirm) bila penambahan mode add > 1000 jam', () => {
    const { result } = renderHook(() => usePMS(), { wrapper });

    act(() => {
      const resHuge = result.current.updateRunningHours('eq-test-01', 1200, false);
      expect(resHuge.success).toBe(false);
      expect(resHuge.needsConfirm).toBe(true);
      expect(resHuge.inputHours).toBe(1200);
      expect(resHuge.reason).toMatch(/batas wajar/i);
    });
  });

  it('menghitung otomatis status Due Soon dan Overdue berdasarkan target servis', () => {
    const { result } = renderHook(() => usePMS(), { wrapper });

    act(() => {
      // 5000 + 100 = 5100. Target 5200 -> sisa 100 (<= 200) -> Due Soon
      const resDueSoon = result.current.updateRunningHours('eq-test-01', 100, false);
      expect(resDueSoon.success).toBe(true);
      expect(resDueSoon.newStatus).toBe('Due Soon');
    });

    act(() => {
      // Tambah 150 lagi -> 5250. Target 5200 -> sisa <= 0 -> Overdue
      const resOverdue = result.current.updateRunningHours('eq-test-01', 150, false);
      expect(resOverdue.success).toBe(true);
      expect(resOverdue.newStatus).toBe('Overdue');
    });
  });
});
