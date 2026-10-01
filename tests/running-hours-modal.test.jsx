import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RunningHoursModal } from '../src/components/equipment/RunningHoursModal';

const mockUpdateRunningHours = vi.fn();
const mockConfirm = vi.fn();

vi.mock('../src/context/PMSContext', () => ({
  usePMS: () => ({
    updateRunningHours: mockUpdateRunningHours,
    confirm: mockConfirm,
  }),
}));

describe('RunningHoursModal - Form & Validasi Inline', () => {
  const dummyEquipment = {
    id: 'eq-001',
    code: 'ME-01',
    name: 'Main Engine Mitsubishi S6R2',
    category: 'Propulsi',
    model: 'S6R2-MPTA',
    serialNumber: 'SN-99812',
    runningHours: 4200,
    nextServiceHours: 4500,
  };

  it('menampilkan petunjuk batas bawah running hours dan jam terakhir dicatat', () => {
    render(<RunningHoursModal equipment={dummyEquipment} onClose={vi.fn()} />);

    // Pindah ke mode total
    const totalModeBtn = screen.getByRole('button', { name: /set total akumulasi/i });
    fireEvent.click(totalModeBtn);

    expect(screen.getByText(/batas bawah sah: > 4[,.]200 jam/i)).toBeTruthy();
  });

  it('menampilkan pesan error inline dan opsi overhaul jika teknisi memasukkan nilai lebih kecil pada mode total', () => {
    mockUpdateRunningHours.mockReturnValueOnce({
      success: false,
      reason: 'Nilai baru (4000) lebih kecil dari jam kerja saat ini (4200). Running hours wajib monoton meningkat per ISM Code. Gunakan opsi "Reset setelah overhaul" jika ini benar.',
    });

    render(<RunningHoursModal equipment={dummyEquipment} onClose={vi.fn()} />);

    const totalModeBtn = screen.getByRole('button', { name: /set total akumulasi/i });
    fireEvent.click(totalModeBtn);

    const input = screen.getByPlaceholderText(/9874/);
    fireEvent.change(input, { target: { value: '4000' } });

    const submitBtn = screen.getByRole('button', { name: /simpan jam kerja/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/running hours wajib monoton meningkat per ism code/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /reset setelah overhaul/i })).toBeTruthy();
  });
});
