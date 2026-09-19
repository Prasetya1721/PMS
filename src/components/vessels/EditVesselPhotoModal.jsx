import React, { useState, useEffect } from 'react';
import { Camera, Upload, Link as LinkIcon, Image, X, Check, RefreshCw } from 'lucide-react';

const MARITIME_PRESET_PHOTOS = [
  {
    id: 'tug-ocean',
    label: 'Tugboat Samudera (Twin Screw 3200 BHP)',
    desc: 'Operasi laut lepas towing batubara',
    url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tug-port',
    label: 'Tugboat Dermaga / Pelabuhan Samarinda',
    desc: 'Kapal tunda sandar & asistensi alur',
    url: 'https://images.unsplash.com/photo-1505705694340-019e1e335916?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'barge-coal',
    label: 'Tongkang Batubara 300 Feet (Barge)',
    desc: 'Deck cargo barge muatan batubara',
    url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tug-river',
    label: 'Tugboat Alur Sungai Mahakam',
    desc: 'Kapal tunda penarik tongkang sungai',
    url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'vessel-cargo',
    label: 'Kapal Muatan & Suplai Maritim',
    desc: 'Offshore support & armada logistik',
    url: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=800&q=80'
  }
];

export const EditVesselPhotoModal = ({
  isOpen,
  onClose,
  vessel,
  onSavePhoto
}) => {
  if (!isOpen || !vessel) return null;

  const [photoUrl, setPhotoUrl] = useState(vessel.photo || '');
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | 'upload' | 'url'
  const [previewError, setPreviewError] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  useEffect(() => {
    let initial = vessel.photo || '';
    if (initial.includes('photo-1544620347-c4fd4a3d5957')) {
      initial = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80';
    }
    setPhotoUrl(initial);
    setPreviewError(false);
  }, [vessel]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      alert('Ukuran file terlalu besar. Maksimal ukuran gambar adalah 4MB.');
      return;
    }

    setIsProcessingFile(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        setPhotoUrl(dataUrl);
        setPreviewError(false);
      }
      setIsProcessingFile(false);
    };
    reader.onerror = () => {
      alert('Gagal membaca file gambar.');
      setIsProcessingFile(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!photoUrl) {
      alert('Mohon pilih atau masukkan URL foto kapal.');
      return;
    }
    onSavePhoto(photoUrl);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(2, 6, 23, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1200,
      padding: '1.25rem'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '16px',
        border: '1px solid var(--border-glass)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
        padding: '1.75rem 2rem'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(2, 132, 199, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Camera size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Edit Foto Kapal: {vessel.name}</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {vessel.type} • No. Reg: {vessel.regNo || vessel.imo}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Live Preview Container */}
        <div style={{
          marginBottom: '1.25rem',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '2px solid rgba(56, 189, 248, 0.3)',
          background: '#090d16',
          position: 'relative',
          height: '210px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {photoUrl && !previewError ? (
            <img
              src={photoUrl}
              alt={vessel.name}
              onError={() => setPreviewError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
              <Image size={40} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.85rem' }}>Pratinjau gambar tidak tersedia atau URL tidak valid.</p>
            </div>
          )}

          <div style={{
            position: 'absolute',
            bottom: '0.65rem',
            left: '0.85rem',
            background: 'rgba(2, 6, 23, 0.85)',
            padding: '0.3rem 0.65rem',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <span>🚢 {vessel.name}</span>
            <span style={{ color: '#38bdf8' }}>• Pratinjau Tampilan</span>
          </div>
        </div>

        {/* Mode Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.75rem',
          marginBottom: '1rem'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`btn btn-sm ${activeTab === 'gallery' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.78rem' }}
          >
            <Image size={14} />
            <span>Pilih dari Galeri Maritim</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`btn btn-sm ${activeTab === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.78rem' }}
          >
            <Upload size={14} />
            <span>Upload dari Komputer</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`btn btn-sm ${activeTab === 'url' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.78rem' }}
          >
            <LinkIcon size={14} />
            <span>Masukkan URL Gambar</span>
          </button>
        </div>

        {/* Tab 1: Galeri Preset */}
        {activeTab === 'gallery' && (
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '0.75rem' }}>
              Klik salah satu foto kapal laut & tongkang resmi di bawah ini untuk diterapkan:
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
              gap: '0.65rem'
            }}>
              {MARITIME_PRESET_PHOTOS.map(preset => {
                const isSelected = photoUrl === preset.url;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      setPhotoUrl(preset.url);
                      setPreviewError(false);
                    }}
                    style={{
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: isSelected ? '2px solid #38bdf8' : '1px solid var(--border-subtle)',
                      background: 'var(--bg-surface-elevated)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                  >
                    <div style={{ height: '90px', width: '100%', overflow: 'hidden' }}>
                      <img
                        src={preset.url}
                        alt={preset.label}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ padding: '0.45rem 0.55rem' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {preset.label}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                        {preset.desc}
                      </div>
                    </div>
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '0.35rem',
                        right: '0.35rem',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#38bdf8',
                        color: '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Check size={13} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Upload File Lokal */}
        {activeTab === 'upload' && (
          <div style={{
            padding: '1.75rem',
            border: '2px dashed rgba(56, 189, 248, 0.35)',
            borderRadius: '12px',
            background: 'rgba(2, 132, 199, 0.04)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(2, 132, 199, 0.15)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Upload size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Upload Foto Kapal dari Komputer</div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Format yang didukung: JPG, PNG, WEBP (Maks. 4MB)
              </p>
            </div>

            <label className="btn btn-primary" style={{ cursor: 'pointer', padding: '0.5rem 1.25rem', fontSize: '0.825rem' }}>
              <Upload size={14} />
              <span>{isProcessingFile ? 'Memproses Gambar...' : 'Pilih File Gambar'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                disabled={isProcessingFile}
              />
            </label>
          </div>
        )}

        {/* Tab 3: Input URL Gambar Langsung */}
        {activeTab === 'url' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label className="field-label">Alamat URL Foto Kapal (Direct Image Link)</label>
            <input
              type="text"
              placeholder="Contoh: https://images.unsplash.com/photo-xxx atau https://perusahaan.com/foto.jpg"
              value={photoUrl}
              onChange={(e) => {
                setPhotoUrl(e.target.value);
                setPreviewError(false);
              }}
              className="input-control"
              style={{ fontSize: '0.825rem' }}
            />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
              Pastikan tautan dapat diakses secara publik dan berformat gambar langsung.
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1rem'
        }}>
          <button
            type="button"
            onClick={() => {
              setPhotoUrl('https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80');
              setPreviewError(false);
            }}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem' }}
          >
            <RefreshCw size={13} />
            <span>Reset ke Foto Tugboat Standar</span>
          </button>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
              }}
            >
              <Check size={16} />
              <span>Simpan Foto Kapal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
