import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PMSProvider } from '../src/context/PMSContext';
import { ReportGenerator } from '../src/components/reports/ReportGenerator';
import { TechnicalWOModalHeader } from '../src/components/maintenance/techwo/TechnicalWOModalHeader';
import { TechnicalWorkOrderModal } from '../src/components/maintenance/TechnicalWorkOrderModal';
import { WorkOrderModal } from '../src/components/maintenance/WorkOrderModal';
import { SafeManningMatrixModal } from '../src/components/crew/SafeManningMatrixModal';
import { CritEquipPrintSheet } from '../src/components/equipment/critical/CritEquipPrintSheet';

describe('Sistem Cetak Dokumen & Isolasi Print Media (A4 Maritime Standards)', () => {
  beforeEach(() => {
    document.body.className = '';
  });

  afterEach(() => {
    document.body.className = '';
  });

  it('ReportGenerator menyematkan class "no-print" pada judul, tombol, dan kartu pemilih laporan', () => {
    render(
      <PMSProvider>
        <ReportGenerator />
      </PMSProvider>
    );

    // Judul & tombol cetak harus berada di dalam kontainer no-print
    const titleEl = screen.getByText('Pusat Laporan & Ekspor Data Armada');
    const headerContainer = titleEl.closest('.no-print');
    expect(headerContainer).not.toBeNull();

    // Kartu pemilih tipe laporan harus di dalam kontainer no-print
    const cardEl = screen.getByText('Laporan Planned Maintenance');
    const cardsContainer = cardEl.closest('.no-print');
    expect(cardsContainer).not.toBeNull();
  });

  it('ReportGenerator mengaktifkan class "fleet-report-printing-active" saat cetak dipicu', () => {
    const originalPrint = window.print;
    window.print = vi.fn();

    render(
      <PMSProvider>
        <ReportGenerator />
      </PMSProvider>
    );

    // Trigger beforeprint
    window.dispatchEvent(new Event('beforeprint'));
    expect(document.body.classList.contains('fleet-report-printing-active')).toBe(true);

    // Trigger afterprint
    window.dispatchEvent(new Event('afterprint'));
    expect(document.body.classList.contains('fleet-report-printing-active')).toBe(false);

    window.print = originalPrint;
  });

  it('TechnicalWOModalHeader memiliki class "no-print" sehingga header biru modal tidak bocor ke cetak', () => {
    const dummyWO = { id: 'WO-TEST-001', status: 'Scheduled' };
    const { container } = render(
      <TechnicalWOModalHeader
        currentVessel={{ name: 'TB. Trans Power 201' }}
        isCompleted={false}
        isEdit={true}
        onClose={() => {}}
        setViewMode={() => {}}
        viewMode="print"
        workOrder={dummyWO}
      />
    );

    const header = container.querySelector('.modal-header');
    expect(header).not.toBeNull();
    expect(header.classList.contains('no-print')).toBe(true);
  });

  it('TechnicalWorkOrderModal menambahkan class "technical-wo-printing-active" dan "maritime-modal-printing-active" ke body', () => {
    const { unmount } = render(
      <PMSProvider>
        <TechnicalWorkOrderModal
          workOrder={{ id: 'WO-001', vesselId: 'v-001', title: 'Test WO' }}
          initialVesselId="v-001"
          onClose={() => {}}
        />
      </PMSProvider>
    );

    expect(document.body.classList.contains('technical-wo-printing-active')).toBe(true);
    expect(document.body.classList.contains('maritime-modal-printing-active')).toBe(true);

    unmount();
    expect(document.body.classList.contains('technical-wo-printing-active')).toBe(false);
    expect(document.body.classList.contains('maritime-modal-printing-active')).toBe(false);
  });

  it('WorkOrderModal menambahkan class "work-order-printing-active" dan "maritime-modal-printing-active" ke body', () => {
    const { unmount } = render(
      <PMSProvider>
        <WorkOrderModal
          workOrder={null}
          vesselId="v-001"
          onClose={() => {}}
        />
      </PMSProvider>
    );

    expect(document.body.classList.contains('work-order-printing-active')).toBe(true);
    expect(document.body.classList.contains('maritime-modal-printing-active')).toBe(true);

    unmount();
    expect(document.body.classList.contains('work-order-printing-active')).toBe(false);
    expect(document.body.classList.contains('maritime-modal-printing-active')).toBe(false);
  });

  it('SafeManningMatrixModal menambahkan class "safe-manning-printing-active" dan "maritime-modal-printing-active" ke body', () => {
    const { unmount } = render(
      <PMSProvider>
        <SafeManningMatrixModal
          selectedVesselId="v-001"
          onClose={() => {}}
        />
      </PMSProvider>
    );

    expect(document.body.classList.contains('safe-manning-printing-active')).toBe(true);
    expect(document.body.classList.contains('maritime-modal-printing-active')).toBe(true);

    unmount();
    expect(document.body.classList.contains('safe-manning-printing-active')).toBe(false);
    expect(document.body.classList.contains('maritime-modal-printing-active')).toBe(false);
  });

  it('CritEquipPrintSheet menambahkan class "crit-equip-printing-active" dan "maritime-modal-printing-active" ke body', () => {
    const { unmount } = render(
      <CritEquipPrintSheet
        currentVessel={{ id: 'v-001', name: 'TB. Test' }}
        setShowPrintModal={() => {}}
        vesselTests={[]}
      />
    );

    expect(document.body.classList.contains('crit-equip-printing-active')).toBe(true);
    expect(document.body.classList.contains('maritime-modal-printing-active')).toBe(true);

    unmount();
    expect(document.body.classList.contains('crit-equip-printing-active')).toBe(false);
    expect(document.body.classList.contains('maritime-modal-printing-active')).toBe(false);
  });
});
