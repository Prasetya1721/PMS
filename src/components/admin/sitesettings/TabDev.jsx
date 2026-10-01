/**
 * TabDev.jsx
 * Sumber: TAB 4: alat dev & developer API shortcuts
 */
import React from 'react';
import { Copy, KeyRound, Terminal } from 'lucide-react';
import { usePMS } from '../../../context/PMSContext';

export const TabDev = ({
  formData,
  showToast,
}) => {
  const { setActiveTab, currentRole } = usePMS();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Shortcut ke Developer API Console (Hanya tampil untuk Developer) */}
      {currentRole === 'Developer' && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(2, 132, 199, 0.1))',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(139, 92, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#a78bfa'
            }}>
              <KeyRound size={18} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700 }}>
                Pusat Konfigurasi API Key & Gateway
              </h4>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Kelola WhatsApp, Email, AIS kapal, cuaca maritim, dan Google Gemini API.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('developer_api')}
            className="btn btn-primary btn-sm"
            style={{
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'linear-gradient(135deg, #7c3aed, #0284c7)'
            }}
          >
            <Terminal size={13} />
            <span>Buka Konfigurasi API Key</span>
          </button>
        </div>
      )}

      <div>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', margin: '0 0 0.5rem 0' }}>
          Ekspor & Impor Konfigurasi CMS (JSON)
        </h4>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
              showToast('Konfigurasi berhasil disalin ke clipboard!', 'success');
            }}
            style={{
              padding: '0.55rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Copy size={14} />
            <span>Salin JSON</span>
          </button>
        </div>
        <textarea
          rows={8}
          value={JSON.stringify(formData, null, 2)}
          readOnly
          className="input-control"
          style={{ fontFamily: 'monospace', fontSize: '0.75rem', background: '#f8fafc' }}
        />
      </div>
    </div>
  );
};
