/**
 * CrewManningBanner.jsx
 * Diekstrak dari CrewManager.jsx (baris 132-171).
 * Sumber: Banner status Safe Manning danringkasan kepatuhan awak kapal
 */
import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export const CrewManningBanner = ({
  manningStatus,
  setShowManningModal,
  targetVesselId,
  vessels,
}) => {
  return (
    <div className="no-print" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              backgroundColor: manningStatus.isCompliant ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${manningStatus.isCompliant ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {manningStatus.isCompliant ? (
                  <CheckCircle2 size={20} color="#10b981" />
                ) : (
                  <AlertTriangle size={20} color="#ef4444" />
                )}
                <div>
                  <div style={{ fontWeight: 700 }}>
                    Status Safe Manning ({vessels.find(v => v.id === targetVesselId)?.name || 'Armada Kapal'}):
                  </div>
                  <div style={{ color: manningStatus.isCompliant ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                    {manningStatus.isCompliant
                      ? 'Kualifikasi & Jumlah Awak Memenuhi Syarat Minimum Berlayar STCW / Syahbandar'
                      : `Terdapat ${manningStatus.deficiencies.length} defisiensi formasi jabatan awak / masa berlaku sertifikat`}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowManningModal(true)}
                className="btn btn-secondary btn-sm"
                style={{ fontWeight: 700, borderColor: '#0284c7', color: '#0284c7' }}
              >
                Inspeksi Detail Matrix &rarr;
              </button>
            </div>
  );
};
