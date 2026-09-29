import React, { useState, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
import { BaharimasEmblem } from '../common/BaharimasLogo';
import {
  ShieldAlert,
  Plus,
  Printer,
  Calendar,
  Zap,
  Flame,
  LifeBuoy,
  X,
  Save
} from 'lucide-react';
import { CritEquipBanner } from './critical/CritEquipBanner';
import { CritEquipFilterBar } from './critical/CritEquipFilterBar';
import { CritEquipCardGrid } from './critical/CritEquipCardGrid';
import { CritEquipTestModal } from './critical/CritEquipTestModal';
import { CritEquipPrintSheet } from './critical/CritEquipPrintSheet';

export const CriticalEquipmentView = ({ selectedVesselId }) => {
  const {
    vessels,
    allEquipment,
    criticalEquipmentTests,
    logCriticalEquipmentTest,
    canAction,
    showToast
  } = usePMS();

  const [showTestModal, setShowTestModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [filterResult, setFilterResult] = useState('ALL');

  const currentVessel = vessels.find(v => v.id === selectedVesselId) || vessels[0];

  const captainName = useMemo(() => {
    return (
      currentVessel?.masterCaptain ||
      currentVessel?.particulars?.masterCaptain ||
      'Capt. Hendra Gunawan, M.Mar'
    );
  }, [currentVessel]);

  const chiefName = useMemo(() => {
    return (
      currentVessel?.chiefEngineer ||
      currentVessel?.particulars?.chiefEngineer ||
      'Ir. Bambang Wijaya (KKM)'
    );
  }, [currentVessel]);

  const vesselTests = useMemo(() => {
    return (criticalEquipmentTests || []).filter(t => {
      if (selectedVesselId && selectedVesselId !== 'all') {
        return t.vesselId === selectedVesselId;
      }
      return true;
    });
  }, [criticalEquipmentTests, selectedVesselId]);

  const filteredTests = useMemo(() => {
    if (filterResult === 'ALL') return vesselTests;
    return vesselTests.filter(t => t.testResult?.includes(filterResult));
  }, [vesselTests, filterResult]);

  // Form New Test State
  const [testForm, setTestForm] = useState({
    testCategory: 'Generator Darurat (Emergency Generator)',
    testTitle: 'Uji Mingguan Auto-Start & Beban Generator Darurat',
    equipmentName: 'Emergency Generator Cummins 120 kVA',
    testDate: new Date().toISOString().split('T')[0],
    intervalDays: 7,
    conductedBy: 'Kurniawan (Masinis 2)',
    verifiedByChief: 'Ir. Bambang Wijaya (KKM)',
    testResult: 'Pass / Berfungsi Baik',
    loadTestDurationMinutes: 30,
    voltageObserved: 380,
    observations: 'Simulasi pemadaman (blackout) berhasil. Generator darurat auto-start dalam 12 detik. Beban lampu darurat & radio bekerja normal.'
  });

  const handleTestCategoryChange = (cat) => {
    let title = '';
    let eqName = '';
    let interval = 7;
    let obs = '';

    if (cat.includes('Generator')) {
      title = 'Uji Mingguan Auto-Start & Beban Generator Darurat';
      eqName = 'Emergency Generator Cummins 120 kVA';
      interval = 7;
      obs = 'Simulasi blackout berhasil. Generator auto-start dalam 12 detik dan mensuplai switchboard darurat.';
    } else if (cat.includes('Fire Pump')) {
      title = 'Uji Pompa Pemadam Darurat & Tekanan Hydrant Geladak';
      eqName = 'Emergency Fire Pump Yanmar Diesel';
      interval = 14;
      obs = 'Pancaran air hydrant geladak utama mencapai >15 meter dengan tekanan 6.5 bar.';
    } else if (cat.includes('Quick Closing')) {
      title = 'Uji Tarik Kawat Pneumatik Emergency Fuel Shut-off';
      eqName = 'Quick Closing Valve Tangki Harian BBM';
      interval = 30;
      obs = 'Klep penutup cepat tangki solar menutup rapat seketika saat tuas luar kamar mesin ditarik.';
    } else if (cat.includes('Steering')) {
      title = 'Uji Transisi Pompa Kemudi Darurat & Waktu Cikar Kemudi';
      eqName = 'Steering Gear Dual Hydraulic Pump';
      interval = 30;
      obs = 'Waktu gerak cikar kanan 35° ke cikar kiri 30° tercapai 22 detik (standar SOLAS <28 detik).';
    }

    setTestForm(prev => ({
      ...prev,
      testCategory: cat,
      testTitle: title,
      equipmentName: eqName,
      intervalDays: interval,
      observations: obs
    }));
  };

  const handleSaveTest = (e) => {
    e.preventDefault();
    const nextDue = new Date(new Date(testForm.testDate).getTime() + testForm.intervalDays * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];

    const payload = {
      ...testForm,
      vesselId: selectedVesselId === 'all' ? (vessels[0]?.id || 'v-001') : selectedVesselId,
      nextTestDue: nextDue
    };

    logCriticalEquipmentTest(payload);
    setShowTestModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Banner ISM Code 10.3 */}
      <CritEquipBanner
        setShowPrintModal={setShowPrintModal}
        setShowTestModal={setShowTestModal}
      />

      {/* Filter Tabs */}
      <CritEquipFilterBar
        filterResult={filterResult}
        filteredTests={filteredTests}
        setFilterResult={setFilterResult}
      />

      {/* Grid of Tests */}
      <CritEquipCardGrid
        filteredTests={filteredTests}
        vessels={vessels}
      />

      {/* Modal: Catat Uji Darurat Baru */}
      {(showTestModal) && (
        <CritEquipTestModal
          handleSaveTest={handleSaveTest}
          handleTestCategoryChange={handleTestCategoryChange}
          setShowTestModal={setShowTestModal}
          setTestForm={setTestForm}
          testForm={testForm}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL CETAK RESMI: LOG UJI PERALATAN KRITIS & SIAP DARURAT (ISM CODE 10.3) */}
      {/* ========================================================================= */}
      {(showPrintModal) && (
        <CritEquipPrintSheet
          captainName={captainName}
          chiefName={chiefName}
          currentVessel={currentVessel}
          setShowPrintModal={setShowPrintModal}
          vesselTests={vesselTests}
        />
      )}
    </div>
  );
};
