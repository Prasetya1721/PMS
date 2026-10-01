/**
 * CrewManagerHeader.jsx
 * Diekstrak dari CrewManager.jsx (baris 87-129).
 * Sumber: Kepala modul Manajemen Awak Kapal beserta tab navigasi dan tombol aksi
 */
import React from 'react';
import { CalendarX, LifeBuoy, ShieldCheck, Users } from 'lucide-react';

export const CrewManagerHeader = ({
  crew,
  crewTab,
  drills,
  leaves,
  setCrewTab,
  setShowManningModal,
}) => {
  return (
    <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Manajemen Awak Kapal (Crew & Kehadiran)</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Data personel kru, rotasi sign-on/sign-off, approval cuti berjenjang, dan riwayat safety drill
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setShowManningModal(true)}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', borderColor: '#0284c7', color: '#0284c7', fontWeight: 600 }}
                title="Inspeksi sertifikat kru & kepatuhan Safe Manning Matrix"
              >
                <ShieldCheck size={16} />
                <span>Safe Manning Matrix (STCW)</span>
              </button>

              <button
                onClick={() => setCrewTab('list')}
                className={`btn ${crewTab === 'list' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Users size={16} />
                <span>Daftar Awak Kapal ({crew.length})</span>
              </button>
              <button
                onClick={() => setCrewTab('leaves')}
                className={`btn ${crewTab === 'leaves' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <CalendarX size={16} />
                <span>Pengajuan Cuti ({leaves.filter(l => l.status.includes('Pending')).length})</span>
              </button>
              <button
                onClick={() => setCrewTab('drills')}
                className={`btn ${crewTab === 'drills' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <LifeBuoy size={16} />
                <span>Safety Drills & Training ({drills.length})</span>
              </button>
            </div>
          </div>
  );
};
