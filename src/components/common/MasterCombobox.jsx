import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Check } from 'lucide-react';

/**
 * MasterCombobox:
 * Menggabungkan kolom ketik manual dan pilihan cepat dropdown menjadi SATU kolom.
 * Pengguna dapat mengetik bebas ATAU memilih dari daftar master data.
 * Teks baru yang belum ada di master data akan otomatis tersimpan saat form disimpan.
 */
export const MasterCombobox = ({
  name,
  value = '',
  onChange,
  options = [],
  placeholder = 'Ketik manual atau pilih...',
  required = false,
  autoComplete = 'off',
  style = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Tutup dropdown saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentValue = String(value || '');
  const filterQuery = currentValue.trim().toLowerCase();
  
  // Filter pilihan berdasarkan apa yang diketik
  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(filterQuery)
  );

  const isExactMatch = options.some(opt => opt.toLowerCase() === filterQuery);
  const showNewIndicator = filterQuery.length > 0 && !isExactMatch;

  const handleSelect = (selectedVal) => {
    onChange({ target: { name, value: selectedVal } });
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', ...style }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={currentValue}
          onChange={(e) => {
            onChange(e);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="input-control"
          style={{
            width: '100%',
            paddingRight: '2.5rem',
            fontSize: '0.85rem'
          }}
        />
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          tabIndex={-1}
          style={{
            position: 'absolute',
            right: '6px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            color: isOpen ? '#38bdf8' : 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px'
          }}
          title="Buka pilihan cepat / Master Data"
        >
          <ChevronDown
            size={16}
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.15s ease'
            }}
          />
        </button>
      </div>

      {/* Floating Menu Pilihan Cepat */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 1300,
            background: 'var(--bg-surface-elevated, #1e293b)',
            border: '1px solid rgba(56, 189, 248, 0.45)',
            borderRadius: '8px',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.6)',
            maxHeight: '220px',
            overflowY: 'auto',
            backdropFilter: 'blur(12px)'
          }}
        >
          <div style={{
            padding: '0.4rem 0.65rem',
            fontSize: '0.68rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0.2)'
          }}>
            <span>⚡ PILIHAN CEPAT MASTER ({options.length})</span>
            <span style={{ color: '#38bdf8', fontSize: '0.68rem' }}>Ketik bebas / Pilih</span>
          </div>

          <div style={{ padding: '0.25rem 0' }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = currentValue.toLowerCase() === opt.toLowerCase();
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.45rem 0.75rem',
                      fontSize: '0.8rem',
                      background: isSelected ? 'rgba(56, 189, 248, 0.18)' : 'transparent',
                      color: isSelected ? '#38bdf8' : 'var(--text-main)',
                      fontWeight: isSelected ? 600 : 400,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background 0.1s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <span>{opt}</span>
                    {isSelected && <Check size={14} color="#38bdf8" />}
                  </button>
                );
              })
            ) : (
              <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Belum ada opsi master yang cocok
              </div>
            )}

            {showNewIndicator && (
              <div style={{
                padding: '0.45rem 0.75rem',
                fontSize: '0.72rem',
                borderTop: '1px dashed var(--border-subtle)',
                marginTop: '0.2rem',
                background: 'rgba(56, 189, 248, 0.08)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <Plus size={12} />
                <span>Input Baru: <strong>"{currentValue}"</strong> (otomatis tersimpan ke Data Master saat simpan)</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
