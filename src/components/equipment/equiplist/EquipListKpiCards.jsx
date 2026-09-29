/**
 * EquipListKpiCards.jsx
 * Diekstrak dari EquipmentList.jsx (baris 157-241).
 * Sumber: Kartu ringkasan KPI equipment: total mesin, jam operasi, dan status
 */
import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, Cpu } from 'lucide-react';

export const EquipListKpiCards = ({
  dueSoonCount,
  normalCount,
  overdueCount,
  totalCount,
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div
              className="glass-card"
              style={{
                padding: '1rem 1.25rem',
                borderLeft: '4px solid #0284c7',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(2, 132, 199, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
                <Cpu size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Unit Equipment</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{totalCount}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Armada Kapal & Tongkang</div>
              </div>
            </div>

            <div
              className="glass-card"
              style={{
                padding: '1rem 1.25rem',
                borderLeft: '4px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <CheckCircle2 size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Kondisi Normal (Aman)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>{normalCount}</div>
                <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>Di bawah ambang batas servis</div>
              </div>
            </div>

            <div
              className="glass-card"
              style={{
                padding: '1rem 1.25rem',
                borderLeft: '4px solid #f59e0b',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                <Clock size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mendekati Servis (Due Soon)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>{dueSoonCount}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sisa &le; 200 Jam Kerja</div>
              </div>
            </div>

            <div
              className="glass-card"
              style={{
                padding: '1rem 1.25rem',
                borderLeft: '4px solid #ef4444',
                background: overdueCount > 0 ? 'rgba(239, 68, 68, 0.08)' : undefined,
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                <AlertTriangle size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Melewati Batas (Overdue)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444' }}>
                  {overdueCount}
                  {overdueCount > 0 && <span style={{ fontSize: '0.72rem', marginLeft: '0.35rem' }}>🚨 Butuh Servis!</span>}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Segera Terbitkan Work Order</div>
              </div>
            </div>
          </div>
  );
};
