/**
 * IntegrationsTab.jsx
 * Diekstrak dari AuditManager.jsx (baris 4992-5105).
 * Sumber: TAB 6: SERTIFIKAT & LOGISTIK KAPAL
 */
import React from 'react';
import { FileCheck, Package } from 'lucide-react';

export const IntegrationsTab = ({
  currentTarget,
  currentTargetCertificates,
  currentTargetRequisitions,
}) => (
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.25rem' }}>
    {/* Box 1: Sertifikat Kapal */}
    <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <FileCheck size={16} color="#38bdf8" />
          <span>Sertifikat Statutori {currentTarget.name}:</span>
        </h4>
        <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
          {currentTargetCertificates.length} Sertifikat
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '420px', overflowY: 'auto' }}>
        {currentTargetCertificates.map(doc => (
          <div
            key={doc.id}
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.75rem'
            }}
          >
            <div>
              <strong style={{ color: 'var(--text-main)' }}>{doc.name || doc.type}</strong>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '0.1rem' }}>
                No: {doc.documentNumber || 'BKI/REG-PBK'} • Surveyor: {doc.mandatoryAuditor || 'BKI Pontianak'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${
                doc.status === 'Expired' ? 'badge-danger' : doc.status === 'Due Soon' ? 'badge-warning' : 'badge-success'
              }`} style={{ fontSize: '0.65rem' }}>
                {doc.status || 'Active'}
              </span>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Exp: {doc.expiryDate}
              </div>
            </div>
          </div>
        ))}
        {currentTargetCertificates.length === 0 && (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>
            Belum ada sertifikat terhubung untuk entitas ini.
          </p>
        )}
      </div>
    </div>

    {/* Box 2: Permintaan Barang ke Gudang */}
    <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Package size={16} color="#f59e0b" />
          <span>Permintaan Barang ke Gudang (Requisitions):</span>
        </h4>
        <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
          {currentTargetRequisitions.length} Surat
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '420px', overflowY: 'auto' }}>
        {currentTargetRequisitions.map(req => (
          <div
            key={req.id}
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.75rem'
            }}
          >
            <div>
              <strong className="mono" style={{ color: '#0284c7' }}>{req.requisitionNumber || req.id}</strong>
              <div style={{ color: 'var(--text-main)', marginTop: '0.1rem', fontWeight: 600 }}>
                {req.title || req.department || 'Permintaan Material Rutin'}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>
                Pemohon: {req.requestedBy || 'Chief Engineer'} • {req.dateSubmitted}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${
                req.status === 'Completed' || req.status === 'Approved' ? 'badge-success' : 'badge-warning'
              }`} style={{ fontSize: '0.65rem' }}>
                {req.status}
              </span>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                {req.items?.length || 1} Item Barang
              </div>
            </div>
          </div>
        ))}
        {currentTargetRequisitions.length === 0 && (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>
            Belum ada surat permintaan barang ke gudang untuk entitas ini.
          </p>
        )}
      </div>
    </div>
  </div>
);
