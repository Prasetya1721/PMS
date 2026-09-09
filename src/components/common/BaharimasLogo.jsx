import React from 'react';

/**
 * Official Vector Emblem of PT. Pelayaran Baharimas Kalimantan
 * Infinitely scalable, pixel-perfect, crisp vector graphic.
 */
export const BaharimasEmblem = ({ size = 48, className = '', style = {} }) => {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.15)}
      viewBox="0 0 100 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', flexShrink: 0, ...style }}
    >
      {/* Top Green Triangle */}
      <polygon points="50,4 14,52 86,52" fill="#04930d" />

      {/* Bottom Blue Hull / Crescent */}
      <path d="M 2,60 L 98,60 A 48,50 0 0,1 2,60 Z" fill="#0607f8" />

      {/* Bottom Yellow Semicircle */}
      <path d="M 9,60 L 91,60 A 41,43 0 0,1 9,60 Z" fill="#fdfa08" />
    </svg>
  );
};

/**
 * Official Corporate Logo & Typography Component for PT. Pelayaran Baharimas Kalimantan
 * Designed for ultra-sharp, professional corporate presentation.
 */
export const BaharimasLogo = ({
  variant = 'white', // 'white' | 'dark'
  size = 'lg', // 'sm' | 'md' | 'lg' | 'xl'
  showText = true,
  className = '',
  style = {}
}) => {
  // Dimension presets
  const config = {
    sm: { emblemSize: 28, fontSize: '1.05rem', gap: '0.6rem', letterSpacing: '0.03em' },
    md: { emblemSize: 38, fontSize: '1.45rem', gap: '0.85rem', letterSpacing: '0.03em' },
    lg: { emblemSize: 52, fontSize: '1.95rem', gap: '1.15rem', letterSpacing: '0.035em' },
    xl: { emblemSize: 64, fontSize: '2.35rem', gap: '1.35rem', letterSpacing: '0.04em' }
  }[size] || { emblemSize: 52, fontSize: '1.95rem', gap: '1.15rem', letterSpacing: '0.035em' };

  const textColor = variant === 'dark' ? '#0f172a' : '#ffffff';

  return (
    <div
      className={`baharimas-brand-logo ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: config.gap,
        userSelect: 'none',
        lineHeight: 1,
        ...style
      }}
    >
      {/* Vector Emblem */}
      <BaharimasEmblem size={config.emblemSize} />

      {/* Corporate Typography */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span
            style={{
              fontFamily: "'Oswald', 'Bebas Neue', 'Impact', sans-serif",
              fontSize: config.fontSize,
              fontWeight: 700,
              letterSpacing: config.letterSpacing,
              lineHeight: 1,
              color: textColor,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              textShadow: variant === 'white' ? '0 2px 12px rgba(0, 0, 0, 0.5)' : 'none'
            }}
          >
            PT PELAYARAN BAHARIMAS KALIMANTAN
          </span>
        </div>
      )}
    </div>
  );
};
