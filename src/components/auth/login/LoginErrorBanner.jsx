/**
 * LoginErrorBanner.jsx
 * Diekstrak dari LoginPage.jsx.orig (baris 337-352).
 * Sumber: Banner peringatan ketika proses masuk gagal
 */
import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const LoginErrorBanner = ({
  errorMsg,
}) => {
  return (
    <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#f87171',
                  fontSize: '0.825rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem'
                }}>
                  <AlertTriangle size={16} />
                  <span>{errorMsg}</span>
                </div>
  );
};
