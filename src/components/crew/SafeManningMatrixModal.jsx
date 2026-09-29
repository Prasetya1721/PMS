import React, { useState, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
import { BaharimasEmblem } from '../common/BaharimasLogo';
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  CheckCircle2,
  AlertTriangle,
  Printer,
  X,
  ArrowLeft
} from 'lucide-react';
import { SafeManningHeader } from './safemanning/SafeManningHeader';
import { SafeManningInteractiveTab } from './safemanning/SafeManningInteractiveTab';
import { SafeManningPrintSheet } from './safemanning/SafeManningPrintSheet';

export const SafeManningMatrixModal = ({ selectedVesselId, onClose }) => {
  const {
    vessels,
    allCrew,
    crew,
    allCrewCertificates,
    safeManningStandards
  } = usePMS();

  const [viewMode, setViewMode] = useState('interactive'); // 'interactive' | 'print_preview'

  const currentVessel = useMemo(() => {
    return vessels.find(v => v.id === selectedVesselId) || vessels[0] || null;
  }, [vessels, selectedVesselId]);

  // Find standard for vessel type
  const vesselTypeStandard = useMemo(() => {
    if (!currentVessel) return null;
    const vType = currentVessel.type?.toLowerCase() || '';
    const standards = safeManningStandards || [];

    const found = standards.find(s => {
      const stType = s.vesselType.toLowerCase();
      if (vType.includes('tug') && stType.includes('tug')) return true;
      if (vType.includes('tongkang') && stType.includes('tongkang')) return true;
      if (vType.includes('lct') && stType.includes('lct')) return true;
      return stType === vType;
    });

    return found || standards[0];
  }, [currentVessel, safeManningStandards]);

  // Onboard crew for this vessel
  const onboardCrew = useMemo(() => {
    return (allCrew || crew || []).filter(c => c.vesselId === currentVessel?.id && c.status === 'Onboard');
  }, [allCrew, crew, currentVessel]);

  // Key Officers for Signatures
  const captainName = useMemo(() => {
    return (
      currentVessel?.masterCaptain ||
      currentVessel?.particulars?.masterCaptain ||
      onboardCrew.find(c => c.rank?.toLowerCase().includes('nakhoda') || c.rank?.toLowerCase().includes('master'))?.name ||
      'Capt. Hendra Gunawan, M.Mar'
    );
  }, [currentVessel, onboardCrew]);

  const chiefName = useMemo(() => {
    return (
      currentVessel?.chiefEngineer ||
      currentVessel?.particulars?.chiefEngineer ||
      onboardCrew.find(c => c.rank?.toLowerCase().includes('kkm') || c.rank?.toLowerCase().includes('chief engineer'))?.name ||
      'Ir. Bambang Wijaya (KKM)'
    );
  }, [currentVessel, onboardCrew]);

  const chiefOfficerName = useMemo(() => {
    return (
      onboardCrew.find(c => c.rank?.toLowerCase().includes('mualim') || c.rank?.toLowerCase().includes('chief officer'))?.name ||
      'M. Yusuf Pratama, S.Tr.Pel'
    );
  }, [onboardCrew]);

  // Evaluate positions
  const matrixEvaluation = useMemo(() => {
    if (!vesselTypeStandard?.positions) return { items: [], isCompliant: true, deficiencies: [] };

    const deficiencies = [];
    const items = vesselTypeStandard.positions.map(reqPos => {
      // Find crew matching this rank
      const matchedCrew = onboardCrew.filter(c => {
        const cRank = c.rank.toLowerCase();
        const pTitle = reqPos.rankTitle.toLowerCase();
        if (pTitle.includes('nakhoda') && (cRank.includes('nakhoda') || cRank.includes('master'))) return true;
        if (pTitle.includes('mualim') && (cRank.includes('mualim') || cRank.includes('chief mate'))) return true;
        if (pTitle.includes('kkm') && (cRank.includes('kkm') || cRank.includes('chief engineer'))) return true;
        if (pTitle.includes('masinis') && cRank.includes('masinis')) return true;
        if (pTitle.includes('juru mudi') && (cRank.includes('juru mudi') || cRank.includes('kelasi') || cRank.includes('abk'))) return true;
        if (pTitle.includes('juru minyak') && (cRank.includes('juru minyak') || cRank.includes('oiler'))) return true;
        if (pTitle.includes('koki') && (cRank.includes('koki') || cRank.includes('cook'))) return true;
        return cRank === pTitle;
      });

      const countPresent = matchedCrew.length;
      const isCountMet = countPresent >= reqPos.count;

      // Check certificate expiry for matched crew
      const crewWithCertStatus = matchedCrew.map(c => {
        const certs = (allCrewCertificates || []).filter(cert => cert.crewId === c.id);
        const hasExpired = certs.some(cert => cert.status === 'Expired' || cert.daysUntilExpiry <= 0);
        return {
          ...c,
          hasExpiredCert: hasExpired,
          certificatesCount: certs.length
        };
      });

      const hasInvalidCrew = crewWithCertStatus.some(c => c.hasExpiredCert);

      if (!isCountMet && reqPos.mandatory) {
        deficiencies.push(`Kekurangan ${reqPos.rankTitle}: dibutuhkan ${reqPos.count}, terisi ${countPresent}`);
      }
      if (hasInvalidCrew && reqPos.mandatory) {
        deficiencies.push(`Sertifikat STCW perwira ${reqPos.rankTitle} telah kadaluarsa`);
      }

      return {
        ...reqPos,
        presentCount: countPresent,
        isSatisfied: isCountMet && !hasInvalidCrew,
        matchedCrew: crewWithCertStatus
      };
    });

    const isCompliant = deficiencies.length === 0;
    return { items, isCompliant, deficiencies };
  }, [vesselTypeStandard, onboardCrew, allCrewCertificates]);

  const handlePrint = () => {
    setViewMode('print_preview');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(10, 16, 30, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.25rem'
    }}>
      <div className="modal-dialog modal-dialog-large glass-card" style={{
        width: '100%',
        maxWidth: viewMode === 'print_preview' ? '920px' : '980px',
        maxHeight: '92vh',
        overflowY: 'auto',
        borderRadius: '16px',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header (No-Print) */}
        <SafeManningHeader
          currentVessel={currentVessel}
          handlePrint={handlePrint}
          matrixEvaluation={matrixEvaluation}
          onClose={onClose}
          setViewMode={setViewMode}
          viewMode={viewMode}
        />

        {/* Content Body: INTERACTIVE SCREEN MODE */}
        {viewMode === 'interactive' ? (
          <SafeManningInteractiveTab
            matrixEvaluation={matrixEvaluation}
            onboardCrew={onboardCrew}
          />
        ) : (
          /* ========================================================================= */
          /* PRINT PREVIEW / FORMAL A4 DOCUMENT SHEET                                 */
          /* ========================================================================= */
          <div style={{ padding: '1.5rem', background: '#ffffff', color: '#0f172a' }}>
            <SafeManningPrintSheet
              captainName={captainName}
              chiefName={chiefName}
              chiefOfficerName={chiefOfficerName}
              currentVessel={currentVessel}
              matrixEvaluation={matrixEvaluation}
              onboardCrew={onboardCrew}
            />
          </div>
        )}
      </div>
    </div>
  );
};
