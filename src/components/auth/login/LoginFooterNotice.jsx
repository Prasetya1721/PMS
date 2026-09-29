/**
 * LoginFooterNotice.jsx
 * Diekstrak dari LoginPage.jsx.orig (baris 533-542).
 * Sumber: Catatan kaki resmi di bawah kartu formulir
 */
import React from 'react';

export const LoginFooterNotice = ({
  cfg,
  isLight,
}) => {
  return (
    <div style={{
                  fontSize: '0.72rem',
                  color: isLight ? '#64748b' : '#94a3b8',
                  textAlign: 'center',
                  marginTop: '0.25rem',
                  borderTop: isLight ? '1px dashed #e2e8f0' : '1px dashed rgba(255,255,255,0.1)',
                  paddingTop: '0.5rem'
                }}>
                  {cfg.formFooterNotice}
                </div>
  );
};
