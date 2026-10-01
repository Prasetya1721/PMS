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
import React, { useEffect, useRef, useState } from 'react';
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
  const typedInputRef = useRef(null);
  const [typed, setTyped] = useState('');

  // Escape = batal. Dipasang hanya saat dialog terbuka, jadi tidak ada listener
  // permanen yang bisa bentrok dengan modal lain.
  useEffect(() => {
    if (!request) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onResolve(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [request, onResolve]);

  // Setiap dialog baru mulai dari ketikan kosong; tanpa ini, kata yang diketik pada
  // dialog sebelumnya akan lolos syarat pada dialog destruktif berikutnya.
  useEffect(() => { setTyped(''); }, [request]);

  // Fokuskan kolom ketikan bila ada, selain itu tombol konfirmasi — supaya Enter
  // langsung bekerja tanpa pengguna harus klik dulu.
  useEffect(() => {
    if (request && typedInputRef.current) typedInputRef.current.focus();
    else if (request && confirmBtnRef.current) confirmBtnRef.current.focus();
  }, [request]);

  if (!request) return null;

  const variant = VARIANTS[request.variant] || VARIANTS.warning;
  const confirmColor = request.confirmColor || variant.confirmColor;
  const Icon = ICONS[request.icon] || ICONS[variant.icon] || AlertTriangle;

  // Gerbang ketik-teks: dipakai aksi paling merusak (membersihkan seluruh data).
  // Tombol konfirmasi mati sampai pengguna mengetik kata yang diminta — mencegah
  // penghapusan karena klik refleks.
  const needsTyped = typeof request.requireText === 'string' && request.requireText.length > 0;
  const typedOk = !needsTyped || typed.trim().toUpperCase() === request.requireText.toUpperCase();
  const canConfirm = typedOk;

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

          {needsTyped && (
            <div style={{ marginTop: '1.25rem' }}>
              <label
                htmlFor="confirm-typed-input"
                style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}
              >
                Ketik <strong style={{ color: confirmColor, fontFamily: 'ui-monospace, monospace' }}>{request.requireText}</strong> untuk mengaktifkan tombol konfirmasi
              </label>
              <input
                id="confirm-typed-input"
                ref={typedInputRef}
                type="text"
                value={typed}
                autoComplete="off"
                onChange={(e) => setTyped(e.target.value)}
                aria-describedby="confirm-typed-hint"
                className="input-control mono"
                style={{ width: '100%', fontWeight: 700, letterSpacing: '0.08em' }}
              />
              <span
                id="confirm-typed-hint"
                aria-live="polite"
                style={{ display: 'block', marginTop: '0.35rem', fontSize: '0.75rem', color: typedOk ? '#10b981' : 'var(--text-muted)' }}
              >
                {typedOk ? 'Teks cocok — tombol konfirmasi aktif.' : `Belum cocok (${typed.trim().length} karakter).`}
              </span>
            </div>
          )}
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
            disabled={!canConfirm}
            onClick={() => onResolve(true)}
            className="btn"
            style={{
              background: canConfirm ? confirmColor : 'var(--bg-surface-elevated, #1e293b)',
              color: canConfirm ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1.25rem',
              borderRadius: '6px',
              cursor: canConfirm ? 'pointer' : 'not-allowed',
              opacity: canConfirm ? 1 : 0.6,
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
