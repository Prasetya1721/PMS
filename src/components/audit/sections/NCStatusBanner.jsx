/**
 * NCStatusBanner.jsx
 * Diekstrak dari AuditManager.jsx (baris 2153-2389).
 * Sumber: HIGH-VISIBILITY NOTIS NC OPEN / NC CLOSE BANNER
 */
import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, MessageSquare } from 'lucide-react';

export const NCStatusBanner = ({
  currentTarget,
  setNotificationModalFinding,
  setStatusFilter,
  setVesselTab,
}) => (
<div>
  {currentTarget.openNC > 0 ? (
    <div className="audit-notice-banner audit-notice-open">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        <div style={{
          padding: '0.65rem',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.2)',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 2s infinite',
          flexShrink: 0
        }}>
          <AlertTriangle size={26} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ef4444' }}>
              🚨 NOTIS NC OPEN: Ditemukan {currentTarget.openNC} Ketidaksesuaian Terbuka pada {currentTarget.name}!
            </h4>
            <span className="badge badge-danger-pulse" style={{ fontSize: '0.68rem' }}>
              Wajib Tindak Lanjut
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.2rem', opacity: 0.9 }}>
            Terdapat <strong>{currentTarget.openNC} temuan audit berstatus NC OPEN</strong> ({currentTarget.majorNC} Major NC, {currentTarget.minorNC} Minor NC).
            Nakhoda, KKM, atau PIC terkait wajib segera mengajukan rencana perbaikan (CAP) dan mengunggah dokumen eviden sebelum batas waktu!
          </p>

          {/* Rentang Waktu Highlight Banner */}
          {currentTarget.timeStats?.mostUrgent && (
            <div style={{
              marginTop: '0.65rem',
              padding: '0.55rem 0.85rem',
              borderRadius: '8px',
              background: currentTarget.timeStats.mostUrgent.range.bgLight,
              border: `1px solid ${currentTarget.timeStats.mostUrgent.range.borderColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
              fontSize: '0.78rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color={currentTarget.timeStats.mostUrgent.range.color} />
                <span>
                  <strong>Batas Target Terdekat ({currentTarget.timeStats.mostUrgent.finding.findingNo}): </strong>
                  Rentang {currentTarget.timeStats.mostUrgent.range.openDateStr} s/d {currentTarget.timeStats.mostUrgent.range.dueDateStr}
                  {' '}(Telah aktif {currentTarget.timeStats.mostUrgent.range.activeDays} hari)
                </span>
              </div>
              <span className={`badge ${currentTarget.timeStats.mostUrgent.range.badgeClass}`} style={{ fontSize: '0.72rem', fontWeight: 800 }}>
                {currentTarget.timeStats.mostUrgent.range.badgeText}
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
        <button
          onClick={() => {
            const targetFinding = currentTarget.timeStats?.mostUrgent?.finding || currentTarget.findings.find(f => f.status === 'NC Open');
            if (targetFinding) setNotificationModalFinding(targetFinding);
          }}
          className="btn btn-whatsapp btn-sm"
          style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <MessageSquare size={14} />
          <span>Kirim Notif WA</span>
        </button>
        <button
          onClick={() => {
            setVesselTab('findings');
            setStatusFilter('NC Open');
          }}
          className="btn btn-danger btn-sm"
          style={{ fontWeight: 700 }}
        >
          Lihat Temuan NC Open ({currentTarget.openNC})
        </button>
      </div>
    </div>
  ) : currentTarget.submittedNC > 0 ? (
    <div className="audit-notice-banner audit-notice-submitted">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        <div style={{
          padding: '0.65rem',
          borderRadius: '50%',
          background: 'rgba(245, 158, 11, 0.2)',
          color: '#f59e0b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Clock size={26} />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f59e0b' }}>
            ⏳ NOTIS VERIFIKASI: {currentTarget.submittedNC} Dokumen Eviden Menunggu Tinjauan Auditor!
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.2rem', opacity: 0.9 }}>
            Pihak auditee kapal telah mengunggah eviden perbaikan tindakan korektif. Lead Auditor wajib memverifikasi keabsahan bukti untuk mengubah status menjadi <strong>NC CLOSE</strong>.
          </p>

          {currentTarget.timeStats?.mostUrgent && (
            <div style={{
              marginTop: '0.65rem',
              padding: '0.55rem 0.85rem',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
              fontSize: '0.78rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="#f59e0b" />
                <span>
                  <strong>Eviden ({currentTarget.timeStats.mostUrgent.finding.findingNo}): </strong>
                  Diajukan & menunggu verifikasi (Telah berjalan {currentTarget.timeStats.mostUrgent.range.activeDays} hari sejak audit)
                </span>
              </div>
              <span className="badge badge-warning" style={{ fontSize: '0.72rem', fontWeight: 800 }}>
                Menunggu Tinjauan
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
        <button
          onClick={() => {
            const targetFinding = currentTarget.findings.find(f => f.status === 'Eviden Submitted');
            if (targetFinding) setNotificationModalFinding(targetFinding);
          }}
          className="btn btn-whatsapp btn-sm"
          style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <MessageSquare size={14} />
          <span>Kirim Notif WA</span>
        </button>
        <button
          onClick={() => {
            setVesselTab('findings');
            setStatusFilter('Eviden Submitted');
          }}
          className="btn btn-warning btn-sm"
          style={{ fontWeight: 700 }}
        >
          Tinjau Eviden Masuk
        </button>
      </div>
    </div>
  ) : currentTarget.closedNC > 0 ? (
    <div className="audit-notice-banner audit-notice-closed">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        <div style={{
          padding: '0.65rem',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.2)',
          color: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <CheckCircle2 size={26} />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10b981' }}>
            ✅ NOTIS NC CLOSE: Seluruh Temuan Audit Telah Diverifikasi & Berstatus CLOSED!
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.2rem', opacity: 0.9 }}>
            Seluruh temuan audit pada <strong>{currentTarget.name}</strong> ({currentTarget.closedNC} NC Close) telah dinyatakan efektif dan memenuhi ketentuan ISM Code IMO & regulasi BKI.
          </p>

          {/* Rentang Waktu Penutupan Summary */}
          {currentTarget.timeStats?.avgResolutionDays > 0 && (
            <div style={{
              marginTop: '0.65rem',
              padding: '0.55rem 0.85rem',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
              fontSize: '0.78rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#10b981" />
                <span>
                  <strong>Rata-rata Rentang Waktu Penutupan (Lead Time Close): </strong>
                  Seluruh temuan diselesaikan rata-rata dalam <strong>{currentTarget.timeStats.avgResolutionDays} Hari</strong> sejak tanggal audit dibuka.
                </span>
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.72rem', fontWeight: 800 }}>
                ✓ Kepatuhan Tuntas
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
        <button
          onClick={() => {
            const closedFinding = currentTarget.findings.find(f => f.status === 'NC Close');
            if (closedFinding) setNotificationModalFinding(closedFinding);
          }}
          className="btn btn-whatsapp btn-sm"
          style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <MessageSquare size={14} />
          <span>Laporan WA NC Close</span>
        </button>
        <span className="badge badge-success" style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}>
          100% Compliant
        </span>
      </div>
    </div>
  ) : null}
</div>
);
