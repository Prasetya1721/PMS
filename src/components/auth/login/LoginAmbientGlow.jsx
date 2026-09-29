/**
 * LoginAmbientGlow.jsx
 * Diekstrak dari LoginPage.jsx.orig (baris 160-168).
 * Sumber: Lapisan latar belakang wallpaper beserta efek blur
 */
import React from 'react';

export const LoginAmbientGlow = ({
  cfg,
  getContainerBackground,
}) => {
  return (
    <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            ...getContainerBackground(),
            filter: (cfg.bgType === 'wallpaper' && cfg.wallpaperBlur) ? `blur(${cfg.wallpaperBlur}px)` : 'none',
            transform: (cfg.bgType === 'wallpaper' && cfg.wallpaperBlur) ? 'scale(1.05)' : 'none',
            transition: 'all 0.3s ease'
          }} />
  );
};
