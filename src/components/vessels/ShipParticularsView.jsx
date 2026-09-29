import React, { useState, useEffect } from 'react';
import { PARTICULAR_SECTIONS, createDefaultShipParticulars } from '../../data/shipParticularsData';
import { ShipParticularsToolbar } from './shipparticulars/ShipParticularsToolbar';
import { ShipParticularsLetterhead } from './shipparticulars/ShipParticularsLetterhead';
import { ShipParticularsIdentity } from './shipparticulars/ShipParticularsIdentity';
import { ShipParticularsTabs } from './shipparticulars/ShipParticularsTabs';
import { ShipParticularsSections } from './shipparticulars/ShipParticularsSections';
import { ShipParticularsFooter } from './shipparticulars/ShipParticularsFooter';
import { ShipParticularsNotes } from './shipparticulars/ShipParticularsNotes';

export const ShipParticularsView = ({ vessel, onEdit, theme = 'dark' }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [copied, setCopied] = useState(false);

  if (!vessel) return null;

  const particulars = vessel.particulars || createDefaultShipParticulars(vessel);
  const isOperator = vessel.id?.startsWith('v-op-') || vessel.ownershipStatus === 'As Operator';

  const handleCopySummary = () => {
    const text = `
=== LEMBAR DATA PARTICULAR KAPAL ===
PT. PELAYARAN BAHARIMAS KALIMANTAN
Nama Kapal: ${particulars.vesselName || vessel.name}
Tipe: ${particulars.vesselType || vessel.type}
Status: ${particulars.ownershipStatus || vessel.ownershipStatus}
No. Registrasi: ${particulars.officialNo || vessel.regNo}
Call Sign: ${particulars.callSign || vessel.callSign}
Klasifikasi: ${particulars.classification || 'BKI'} (${particulars.classNotation || '-'})
Dimensi: LOA ${particulars.lengthOverall || '-'} | Breadth ${particulars.breadthMoulded || '-'} | Depth ${particulars.depthMoulded || '-'} | Draft ${particulars.designDraft || '-'}
Tonase: ${particulars.grossTonnage} GT / ${particulars.deadweight} DWT
Mesin Induk: ${particulars.mainEngine || '-'} (${particulars.totalHorsepower || '-'})
Bollard Pull: ${particulars.bollardPull || '-'}
Kapasitas BBM: ${particulars.fuelOilCapacity || '-'} | Air Tawar: ${particulars.freshWaterCapacity || '-'}
Towing Winch: ${particulars.towingWinch || '-'}
Alat Navigasi: Radar: ${particulars.marineRadar || '-'} | AIS: ${particulars.ais || '-'} | GPS: ${particulars.gpsChartplotter || '-'}
Kru / Akomodasi: ${particulars.crewComplement || '-'}
====================================
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  useEffect(() => {
    return () => {
      document.body.classList.remove('particulars-printing-active');
    };
  }, []);

  const handlePrint = () => {
    document.body.classList.add('particulars-printing-active');
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.body.classList.remove('particulars-printing-active');
      }, 500);
    }, 50);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Action Toolbar */}
      <ShipParticularsToolbar
        copied={copied}
        handleCopySummary={handleCopySummary}
        handlePrint={handlePrint}
        onEdit={onEdit}
        vessel={vessel}
      />

      {/* Official Certificate Card Container */}
      <div className="glass-card particulars-sheet maritime-print-sheet" style={{
        padding: '2rem 2.25rem',
        borderRadius: '16px',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        background: theme === 'light' ? '#ffffff' : 'var(--bg-surface-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem'
      }}>
        {/* Certificate Header / Letterhead */}
        <ShipParticularsLetterhead
          particulars={particulars}
          vessel={vessel}
        />

        {/* Vessel Identity Showcase */}
        <ShipParticularsIdentity
          isOperator={isOperator}
          particulars={particulars}
          vessel={vessel}
        />

        {/* Category Tabs for Fast Navigation — Terlihat Semua (Flex Wrap & No Clipping) */}
        <ShipParticularsTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Sections Grid Rendering — In Print mode, all sections are printed */}
        <ShipParticularsSections
          activeTab={activeTab}
          particulars={particulars}
        />

        {/* Certificate Seal & Signatures Footer */}
        <ShipParticularsFooter
          vessel={vessel}
        />

        {/* Document Official Footer Notes */}
        <ShipParticularsNotes
          vessel={vessel}
        />
      </div>
    </div>
  );
};
