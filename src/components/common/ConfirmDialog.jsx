/**
 * ConfirmDialog.jsx
 * Dialog konfirmasi in-app global — pengganti window.confirm().
 *
 * Kenapa ini ada:
 *   window.confirm() memblokir seluruh thread, tampil sebagai dialog bawaan browser
 *   (tidak bisa di-style, tidak konsisten antar browser), dan di beberapa konteks
 *   diblokir sama sekali sehingga aksi berisiko jadi tidak pernah dikonfirmasi.
 *
 * Kenapa lewat context, bukan per-komponen:
 *   window.confirm() bersifat SINKRON (langsung mengembalikan true/false), sedangkan
 *   dialog in-app bersifat ASINKRON. Menaruh satu dialog di setiap komponen berarti
 *   setiap call site harus menyimpan state, me-render dialog, dan menulis ulang
 *   alurnya menjadi callback. Menyalurkannya lewat context membuat call site cukup
 *   menulis `await confirm({...})` — satu baris, alur lurus, tanpa state tambahan.
 *
 * Pemakaian:
 *   const confirm = useConfirm();           // dari usePMS()
 *   if (!(await confirm({ title: 'Hapus?', message: '...' }))) return;
 *   doSomethingDestructive();
 */
import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Trash2, Info, LogOut, RotateCcw } from 'lucide-react';

// Ikon dipetakan dari nama string supaya pemanggil tidak perlu mengimpor komponen
// ikon hanya untuk menampilkan sebuah dialog.
const ICONS = {
  warning: AlertTriangle,
  danger: Trash2,
  info: Info,
  logout: LogOut,
  reset: RotateCcw,
};

// Warna per jenis aksi. `confirmColor` dipakai untuk tombol utama dan aksen ikon.
const VARIANTS = {
  danger:  { confirmColor: '#ef4444', icon: 'danger',  confirmLabel: 'Hapus' },
  warning: { confirmColor: '#f59e0b', icon: 'warning', confirmLabel: 'Lanjutkan' },
  info:    { confirmColor: '#0ea5e9', icon: 'info',    confirmLabel: 'Lanjutkan' },
  reset:   { confirmColor: '#f59e0b', icon: 'reset',   confirmLabel: 'Kembalikan' },
};

export const ConfirmDialog = ({ request, onResolve }) => {
  const confirmBtnRef = useRef(null);

  // Escape = batal. Dipasang hanya saat dialog terbuka, jadi tidak ada listener
  // permanen yang bisa bentrok dengan modal lain.
  useEffect(() => {
    if (!request) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onResolve(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [request, onResolve]);

  // Fokuskan tombol konfirmasi supaya Enter langsung bekerja.
  useEffect(() => {
    if (request && confirmBtnRef.current) confirmBtnRef.current.focus();
  }, [request]);

  if (!request) return null;

  const variant = VARIANTS[request.variant] || VARIANTS.warning;
  const confirmColor = request.confirmColor || variant.confirmColor;
  const Icon = ICONS[request.icon] || ICONS[variant.icon] || AlertTriangle;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(2, 6, 23, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        zIndex: 100000
      }}
      // Klik di luar kartu = batal. onMouseDown, bukan onClick, supaya seret teks
      // dari dalam kartu ke luar tidak ikut menutup dialog.
      onMouseDown={(e) => { if (e.target === e.currentTarget) onResolve(false); }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="glass-card"
        style={{
          maxWidth: '520px',
          width: '100%',
          background: 'var(--bg-card, #0f172a)',
          border: '1px solid var(--border-glass)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden'
        }}
      >
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem'
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: `${confirmColor}22`,
            border: `1px solid ${confirmColor}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: confirmColor,
            flexShrink: 0
          }}>
            <Icon size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 id="confirm-dialog-title" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {request.title || 'Konfirmasi'}
            </h3>
            {request.subtitle && (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem', margin: 0 }}>
                {request.subtitle}
              </p>
            )}
          </div>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.55', color: 'var(--text-main)', margin: 0, whiteSpace: 'pre-line' }}>
            {request.message}
          </p>
        </div>

        <div style={{
          padding: '1rem 1.5rem',
          background: 'rgba(0, 0, 0, 0.25)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem'
        }}>
          <button
            type="button"
            onClick={() => onResolve(false)}
            className="btn btn-secondary"
            style={{ minWidth: '90px' }}
          >
            {request.cancelLabel || 'Batal'}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={() => onResolve(true)}
            className="btn"
            style={{
              background: confirmColor,
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1.25rem',
              borderRadius: '6px',
              cursor: 'pointer',
              minWidth: '90px'
            }}
          >
            {request.confirmLabel || variant.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
