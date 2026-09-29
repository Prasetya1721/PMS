/**
 * TabDev.jsx
 * Diekstrak dari SiteSettingsAdmin.jsx (baris 1134-1173).
 * Sumber: TAB 4: alat dev
 */
import React from 'react';
import { Copy } from 'lucide-react';

export const TabDev = ({
  formData,
  showToast,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
