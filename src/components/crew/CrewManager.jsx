import React, { useState, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Users,
  CalendarX,
  Flame,
  LifeBuoy,
  Plus,
  CheckCircle,
  XCircle,
  Phone,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { SafeManningMatrixModal } from './SafeManningMatrixModal';
import { CrewManagerHeader } from './crewmgr/CrewManagerHeader';
import { CrewManningBanner } from './crewmgr/CrewManningBanner';
import { CrewListTab } from './crewmgr/CrewListTab';
import { CrewLeavesTab } from './crewmgr/CrewLeavesTab';
import { CrewDrillsTab } from './crewmgr/CrewDrillsTab';
import { CrewLeaveModal } from './crewmgr/CrewLeaveModal';
import { CrewDrillModal } from './crewmgr/CrewDrillModal';

export const CrewManager = () => {
  const {
    crew,
    leaves,
    drills,
    vessels,
    selectedVesselId,
    approveLeave,
    submitLeave,
    addDrill,
    addCrew,
    getSafeManningStatus,
    currentRole,
    canAction
  } = usePMS();

  const [crewTab, setCrewTab] = useState('list'); // 'list' | 'leaves' | 'drills'
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDrillModal, setShowDrillModal] = useState(false);
  const [showManningModal, setShowManningModal] = useState(false);

  const targetVesselId = selectedVesselId !== 'all' ? selectedVesselId : vessels[0]?.id;
  const manningStatus = useMemo(() => {
    return targetVesselId && getSafeManningStatus ? getSafeManningStatus(targetVesselId) : null;
  }, [targetVesselId, getSafeManningStatus]);

  // Form states
  const [leaveForm, setLeaveForm] = useState({
    crewId: crew[0]?.id || '',
    leaveType: 'Cuti Tahunan',
    startDate: '',
    endDate: '',
    daysRequested: 14,
    replacementCrew: '',
    notes: ''
  });

  const [drillForm, setDrillForm] = useState({
    vesselId: vessels[0]?.id || 'v-001',
    drillType: 'Fire Drill (Latihan Pemadam Kebakaran)',
    conductedDate: new Date().toISOString().split('T')[0],
    durationMinutes: 45,
    leadOfficer: 'Capt. Hendra Gunawan',
    attendeesCount: 16,
    performanceRating: 'Memuaskan',
    scenarioSummary: '',
    correctiveAction: ''
  });

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    const selectedCrew = crew.find(c => c.id === leaveForm.crewId);
    submitLeave({
      ...leaveForm,
      crewName: selectedCrew ? `${selectedCrew.name} (${selectedCrew.rank})` : 'Crew',
      vesselId: selectedCrew?.vesselId || 'v-001'
    });
    setShowLeaveModal(false);
  };

  const handleDrillSubmit = (e) => {
    e.preventDefault();
    addDrill(drillForm);
    setShowDrillModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <CrewManagerHeader
        crew={crew}
        crewTab={crewTab}
        drills={drills}
        leaves={leaves}
        setCrewTab={setCrewTab}
        setShowManningModal={setShowManningModal}
      />

      {/* Safe Manning Compliance Alert Banner */}
      {(manningStatus) && (
        <CrewManningBanner
          manningStatus={manningStatus}
          setShowManningModal={setShowManningModal}
          targetVesselId={targetVesselId}
          vessels={vessels}
        />
      )}

      {/* Tab 1: Crew Directory */}
      {(crewTab === 'list') && (
        <CrewListTab
          crew={crew}
          vessels={vessels}
        />
      )}

      {/* Tab 2: Leaves Management */}
      {(crewTab === 'leaves') && (
        <CrewLeavesTab
          approveLeave={approveLeave}
          canAction={canAction}
          leaves={leaves}
          setShowLeaveModal={setShowLeaveModal}
        />
      )}

      {/* Tab 3: Safety Drills */}
      {(crewTab === 'drills') && (
        <CrewDrillsTab
          drills={drills}
          setShowDrillModal={setShowDrillModal}
          vessels={vessels}
        />
      )}

      {/* Modal Cuti */}
      {(showLeaveModal) && (
        <CrewLeaveModal
          crew={crew}
          handleLeaveSubmit={handleLeaveSubmit}
          leaveForm={leaveForm}
          setLeaveForm={setLeaveForm}
          setShowLeaveModal={setShowLeaveModal}
        />
      )}

      {/* Modal Safety Drill */}
      {(showDrillModal) && (
        <CrewDrillModal
          drillForm={drillForm}
          handleDrillSubmit={handleDrillSubmit}
          setDrillForm={setDrillForm}
          setShowDrillModal={setShowDrillModal}
          vessels={vessels}
        />
      )}

      {/* MODAL 3: Safe Manning Matrix & STCW Certificate Modal */}
      {showManningModal && (
        <SafeManningMatrixModal
          selectedVesselId={targetVesselId}
          onClose={() => setShowManningModal(false)}
        />
      )}
    </div>
  );
};
