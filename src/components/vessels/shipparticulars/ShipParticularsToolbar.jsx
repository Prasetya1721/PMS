/**
 * ShipParticularsToolbar.jsx
 * Diekstrak dari ShipParticularsView.jsx.orig (baris 85-155).
 * Sumber: Toolbar aksi: salin ringkasan, cetak/PDF, dan tombol edit data particular
 */
import React from 'react';
import { Check, Copy, Edit3, FileText, Printer } from 'lucide-react';

export const ShipParticularsToolbar = ({
  copied,
  handleCopySummary,
  handlePrint,
  onEdit,
  vessel,
}) => {
  return (
    <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '0.85rem 1.25rem',
            borderRadius: '12px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)'
          }} className="no-print">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(2, 132, 199, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8'
              }}>
                <FileText size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                    Spesifikasi Teknis (Ship Particulars Sheet)
                  </h3>
                  <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                    BKI Verified
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Lembar data teknis kelaiklautan dan karakteristik operasional armada {vessel.name}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <button
                onClick={handleCopySummary}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem' }}
                title="Salin ringkasan spesifikasi ke clipboard"
              >
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                <span>{copied ? 'Tersalin!' : 'Salin Ringkasan'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem' }}
                title="Cetak lembar particular resmi ini"
              >
                <Printer size={14} />
                <span>Cetak / PDF</span>
              </button>

              <button
                onClick={onEdit}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)' }}
              >
                <Edit3 size={14} />
                <span>Edit Data Particular</span>
              </button>
            </div>
          </div>
  );
};
