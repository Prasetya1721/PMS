import React from 'react';
import { BaharimasEmblem } from './BaharimasLogo';

/**
 * Scalable vector representation of BKI (Biro Klasifikasi Indonesia)
 */
export const BKILogo = ({ height = 32, className = '', style = {} }) => {
  return (
    <div
      className={`bki-logo ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', height, ...style }}
    >
      <svg
        height={height}
        viewBox="0 0 85 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', height: '100%', width: 'auto' }}
      >
        {/* b */}
        <path
          d="M6 4h7v11.5c1.8-2 4.2-3 7.2-3 5.8 0 9.8 4.2 9.8 11.2s-4 11.3-9.8 11.3c-3 0-5.4-1.1-7.2-3.1V35H6V4zm7 19.8c0 3.8 2.2 6.2 5.5 6.2 3.3 0 5.5-2.4 5.5-6.2s-2.2-6.2-5.5-6.2c-3.3 0-5.5 2.4-5.5 6.2z"
          fill="#004b87"
        />
        {/* k */}
        <path
          d="M36 4h7v13.8l9.4-9.8h9.1L49.3 20l12.7 15H52.5L43 23.5V35h-7V4z"
          fill="#004b87"
        />
        {/* i */}
        <path
          d="M66 13h7v22h-7V13z"
          fill="#004b87"
        />
        {/* Orange dot on i */}
        <circle cx="69.5" cy="6.5" r="4" fill="#f97316" />
      </svg>
    </div>
  );
};

/**
 * Scalable vector representation of IDSurvey
 */
export const IDSurveyLogo = ({ height = 30, className = '', style = {} }) => {
  return (
    <div
      className={`idsurvey-logo ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', height, ...style }}
    >
      <svg
        height={height}
        viewBox="0 0 135 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', height: '100%', width: 'auto' }}
      >
        {/* Shield with check */}
        <path
          d="M3 5.5L16 1.5l13 4v11c0 8-6 14.5-13 16.5C9 31 3 24.5 3 16.5V5.5z"
          fill="#009688"
        />
        <path
          d="M10 16l4 4 8-9"
          stroke="#ffffff"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Text IDSurvey */}
        <text
          x="36"
          y="20"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="17"
          fill="#009688"
          letterSpacing="-0.02em"
        >
          IDSurvey
        </text>
        <text
          x="37"
          y="29"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="500"
          fontSize="5.8"
          fill="#64748b"
          letterSpacing="0.04em"
        >
          Testing • Inspection • Certification
        </text>
      </svg>
    </div>
  );
};

/**
 * Scalable vector representation of Danantara Indonesia
 */
export const DanantaraLogo = ({ height = 28, className = '', style = {} }) => {
  return (
    <div
      className={`danantara-logo ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', height, ...style }}
    >
      <svg
        height={height}
        viewBox="0 0 130 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', height: '100%', width: 'auto' }}
      >
        {/* Eagle silhouette */}
        <path
          d="M4 18c3-4 8-7 14-8-4 4-5 8-5 11 3-2 6-3 9-3-4 3-7 7-8 11 5-2 10-3 14-3-6 5-11 8-18 8-4 0-6-3-6-6 0-3 1-6-2-8-3-2-2-1 2-1z"
          fill="#dc2626"
        />
        {/* Text */}
        <text
          x="33"
          y="16"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="13"
          fill="#0f172a"
          letterSpacing="-0.01em"
        >
          Danantara
        </text>
        <text
          x="33"
          y="28"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="700"
          fontSize="10"
          fill="#0f172a"
          letterSpacing="0.08em"
        >
          Indonesia
        </text>
      </svg>
    </div>
  );
};

/**
 * Combined Header Logo Group (BKI + IDSurvey + Danantara or Baharimas)
 */
export const BrandLogoGroup = ({
  mode = 'baharimas', // 'baharimas' | 'combined' | 'bki_group' | 'custom'
  customUrl = '',
  textColor = '#0f172a',
  height = 34,
  style = {}
}) => {
  if (mode === 'custom' && customUrl) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', ...style }}>
        <img src={customUrl} alt="Logo" style={{ maxHeight: height, width: 'auto', objectFit: 'contain' }} />
      </div>
    );
  }

  if (mode === 'combined') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', ...style }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <BaharimasEmblem size={Math.round(height * 1.1)} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: textColor, letterSpacing: '0.02em', lineHeight: 1.1 }}>
              BAHARIMAS
            </span>
            <span style={{ fontSize: '0.62rem', color: '#0284c7', fontWeight: 600 }}>
              Shipping Lines
            </span>
          </div>
        </div>
        <div style={{ width: '1px', height: '24px', background: 'rgba(148, 163, 184, 0.4)' }} />
        <BKILogo height={height * 0.85} />
        <IDSurveyLogo height={height * 0.8} />
      </div>
    );
  }

  if (mode === 'bki_group') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', ...style }}>
        <BKILogo height={height} />
        <IDSurveyLogo height={height * 0.9} />
        <DanantaraLogo height={height * 0.85} />
      </div>
    );
  }

  // Default: PT Pelayaran Baharimas Kalimantan
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', ...style }}>
      <BaharimasEmblem size={Math.round(height * 1.2)} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span style={{
          fontFamily: "'Oswald', 'Bebas Neue', sans-serif",
          fontSize: 'clamp(1.05rem, 1.4vw, 1.28rem)',
          fontWeight: 800,
          color: textColor,
          letterSpacing: '0.025em',
          lineHeight: 1.15
        }}>
          PT PELAYARAN BAHARIMAS KALIMANTAN
        </span>
        <span style={{
          fontSize: '0.68rem',
          fontWeight: 600,
          color: '#0284c7',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginTop: '0.2rem'
        }}>
          Fleet Management & Marine Shipping Lines
        </span>
      </div>
    </div>
  );
};
