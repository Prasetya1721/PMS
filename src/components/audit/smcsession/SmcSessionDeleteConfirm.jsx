/**
 * SmcSessionDeleteConfirm.jsx
 * Diekstrak dari SmcSessionModal.jsx (baris 839-873).
 * Sumber: Dialog konfirmasi hapus sesi audit
 */
import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const SmcSessionDeleteConfirm = ({
  auditNo,
  currentSelectedVessel,
  deleteAuditSession,
  onClose,
  session,
  setShowDeleteConfirm,
  showToast,
}) => {
  return (
    <div className="modal-overlay" style={{ zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                <div className="glass-card" style={{ maxWidth: '420px', padding: '1.5rem', textAlign: 'center', background: 'var(--bg-surface-card)', borderRadius: '12px' }}>
                  <AlertTriangle size={42} color="#ef4444" style={{ margin: '0 auto 0.75rem' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
                    Hapus Sesi Audit SMC Ini?
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    Sesi audit <strong>{auditNo}</strong> untuk kapal <strong>{currentSelectedVessel?.name}</strong> akan dihapus permanen dari sistem.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="btn btn-secondary btn-sm"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteAuditSession(session.id);
                        showToast('Sesi audit SMC berhasil dihapus', 'info');
                        setShowDeleteConfirm(false);
                        onClose();
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ background: '#ef4444', borderColor: '#ef4444' }}
                    >
                      Ya, Hapus Sesi
                    </button>
                  </div>
                </div>
              </div>
  );
};
