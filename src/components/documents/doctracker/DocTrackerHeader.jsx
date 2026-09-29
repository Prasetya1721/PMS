/**
 * DocTrackerHeader.jsx
 * Diekstrak dari DocumentTracker.jsx (baris 103-150).
 * Sumber: Kepala halaman Pelacak Sertifikat Kru & Surat Kapal beserta tombol aksi (tambah dokumen, ekspor, sinkronisasi)
 */
import React from 'react';
import { Calendar, CalendarPlus, Clock, Plus, ShieldAlert } from 'lucide-react';

export const DocTrackerHeader = ({
  expiredCount,
  exportMultiIntervalICS,
  h1ExpiringCount,
  h30ExpiringCount,
  h7ExpiringCount,
  setEditingDoc,
  setShowAddDocModal,
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                Pelacak Sertifikat Kru & Surat Kapal (Statutory Radar)
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Monitoring masa berlaku dokumen legal kapal dan sertifikasi kru STCW dengan sinkronisasi Google Calendar & WhatsApp
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => {
                  setEditingDoc(null);
                  setShowAddDocModal(true);
                }}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)' }}
              >
                <Plus size={14} />
                <span>Tambah Dokumen / Sertifikat</span>
              </button>
              <button onClick={() => exportMultiIntervalICS()} className="btn btn-secondary btn-sm" title="Ekspor .ics multi-alarm untuk Google Calendar">
                <CalendarPlus size={14} />
                <span>Ekspor Kalender (.ics)</span>
              </button>
              {h1ExpiringCount > 0 && (
                <span className="badge badge-danger-pulse" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                  <Clock size={14} />
                  <span>{h1ExpiringCount} H-1 Hari</span>
                </span>
              )}
              {h7ExpiringCount > 0 && (
                <span className="badge badge-warning" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                  <Clock size={14} />
                  <span>{h7ExpiringCount} H-1 Minggu</span>
                </span>
              )}
              <span className="badge badge-info" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                <Calendar size={14} />
                <span>{h30ExpiringCount} H-1 Bulan</span>
              </span>
              <span className="badge badge-danger" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                <ShieldAlert size={14} />
                <span>{expiredCount} Expired</span>
              </span>
            </div>
          </div>
  );
};
