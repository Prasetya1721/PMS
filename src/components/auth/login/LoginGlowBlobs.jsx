/**
 * LoginGlowBlobs.jsx
 * Diekstrak dari LoginPage.jsx.orig (baris 171-196).
 * Sumber: Lingkaran cahaya ambien di latar belakang (dapat dimatikan lewat konfigurasi)
 */
import React from 'react';

export const LoginGlowBlobs = ({
  cfg,
  isLight,
}) => {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute',
                top: '-15%',
                left: '-10%',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: isLight ? 'rgba(2, 132, 199, 0.12)' : (cfg.glowColor1 || 'radial-gradient(circle, rgba(2, 132, 199, 0.25) 0%, transparent 70%)'),
                filter: 'blur(60px)',
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-15%',
                right: '-10%',
                width: '650px',
                height: '650px',
                borderRadius: '50%',
                background: isLight ? 'rgba(6, 182, 212, 0.1)' : (cfg.glowColor2 || 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)'),
                filter: 'blur(70px)',
                pointerEvents: 'none'
              }} />
            </div>
  );
};
