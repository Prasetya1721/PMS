import React from 'react';
import { usePMS } from '../../context/PMSContext';
import { AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

export const UrgencyBanner = () => {
  const { overdueWOCount, expiredDocsCount, dueSoonDocsCount, setActiveTab } = usePMS();

  if (overdueWOCount === 0 && expiredDocsCount === 0 && dueSoonDocsCount === 0) {
    return null;
  }

  return (
    <div className="urgency-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <ShieldAlert size={18} color="#ef4444" />
        <div>
          <span style={{ fontWeight: 700, color: '#fecaca' }}>Peringatan Operasional:</span>{' '}
          {expiredDocsCount > 0 && (
            <span style={{ color: '#f87171', fontWeight: 600 }}>
              {expiredDocsCount} dokumen/sertifikat EXPIRED!{' '}
            </span>
          )}
          {overdueWOCount > 0 && (
            <span style={{ color: '#fbbf24', fontWeight: 500 }}>
              {overdueWOCount} Work Order melewati batas jam operasional (Overdue).{' '}
            </span>
          )}
          {dueSoonDocsCount > 0 && (
            <span style={{ color: '#e2e8f0', opacity: 0.9 }}>
              ({dueSoonDocsCount} dokumen mendekati jatuh tempo).
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={() => setActiveTab('notifications')}
          className="btn btn-sm btn-danger"
          style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', fontWeight: 600 }}
        >
          <span>Kirim Notifikasi WA</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
