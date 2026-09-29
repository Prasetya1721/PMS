/**
 * TabBackground.jsx
 * Diekstrak dari SiteSettingsAdmin.jsx (baris 406-818).
 * Sumber: TAB 1: latar belakang (wallpaper, solid, gradasi)
 */
import React from 'react';
import { ImageIcon, Palette, Sparkles, Target, Upload } from 'lucide-react';

export const TabBackground = ({
  formData,
  handleChange,
  handleFileUpload,
  isLight,
  isUploading,
  setFormData,
  wallpaperInputRef,
}) => {
  return (
    <>
                    {/* Tipe Latar Belakang Section */}
                    <div>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#334155',
                        marginBottom: '0.75rem'
                      }}>
                        <span>🎨 Tipe Latar Belakang</span>
                      </label>

                      {/* 4 Cards Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '0.65rem'
                      }}>
                        {[
                          { id: 'bawaan', label: 'Bawaan Baharimas', icon: Sparkles, iconColor: '#f59e0b' },
                          { id: 'solid', label: 'Warna Solid', icon: Target, iconColor: '#ec4899' },
                          { id: 'gradasi', label: 'Gradasi', icon: Palette, iconColor: '#3b82f6' },
                          { id: 'wallpaper', label: 'Wallpaper', icon: ImageIcon, iconColor: '#10b981' }
                        ].map(card => {
                          const Icon = card.icon;
                          const isSelected = (formData.bgType || 'wallpaper') === card.id;
                          return (
                            <button
                              key={card.id}
                              type="button"
                              onClick={() => handleChange('bgType', card.id)}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.85rem 0.5rem',
                                borderRadius: '10px',
                                border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                                background: isSelected ? '#eff6ff' : '#f8fafc',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                textAlign: 'center'
                              }}
                            >
                              <Icon size={20} color={card.iconColor} />
                              <span style={{
                                fontSize: '0.75rem',
                                fontWeight: isSelected ? 700 : 500,
                                color: isSelected ? '#1e40af' : '#475569'
                              }}>
                                {card.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sub-controls depending on bgType */}
                    {formData.bgType === 'wallpaper' && (
                      <div style={{
                        background: '#f8fafc',
                        padding: '1rem',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.85rem'
                      }}>
                        {/* Header with Upload button */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                            URL Gambar Latar Belakang (Wallpaper):
                          </label>
                          <div>
                            <input
                              ref={wallpaperInputRef}
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => handleFileUpload(e, 'wallpaperUrl')}
                            />
                            <button
                              type="button"
                              disabled={isUploading}
                              onClick={() => wallpaperInputRef.current?.click()}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.4rem 0.85rem',
                                borderRadius: '6px',
                                background: '#eff6ff',
                                border: '1px solid #bfdbfe',
                                color: '#1d4ed8',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: isUploading ? 'wait' : 'pointer'
                              }}
                            >
                              <Upload size={14} />
                              <span>{isUploading ? 'Memproses...' : 'Unggah Gambar dari Komputer'}</span>
                            </button>
                          </div>
                        </div>

                        {/* URL Input */}
                        <input
                          type="text"
                          value={formData.wallpaperUrl || ''}
                          onChange={e => handleChange('wallpaperUrl', e.target.value)}
                          placeholder="https://images.unsplash.com/... atau unggah file di atas"
                          className="input-control"
                          style={{
                            fontSize: '0.825rem',
                            padding: '0.65rem 0.85rem',
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '8px'
                          }}
                        />

                        {/* Preset Wallpaper Thumbnails */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Preset Gambar:</span>
                          {[
                            { label: '🚢 Tugboat Baharimas', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80' },
                            { label: '🌊 Samudra Biru', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1600&q=80' },
                            { label: '⚓ Pelabuhan Pontianak', url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80' }
                          ].map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleChange('wallpaperUrl', preset.url)}
                              style={{
                                fontSize: '0.72rem',
                                padding: '0.25rem 0.6rem',
                                borderRadius: '6px',
                                background: '#ffffff',
                                border: '1px solid #cbd5e1',
                                color: '#334155',
                                cursor: 'pointer'
                              }}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>

                        {/* Slider Kegelapan Overlay */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.25rem' }}>
                          <label style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600, minWidth: '120px' }}>
                            Kegelapan Overlay:
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="90"
                            value={formData.wallpaperOverlay ?? 40}
                            onChange={e => handleChange('wallpaperOverlay', Number(e.target.value))}
                            style={{
                              flex: 1,
                              accentColor: '#2563eb',
                              cursor: 'pointer'
                            }}
                          />
                          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', minWidth: '35px', textAlign: 'right' }}>
                            {formData.wallpaperOverlay ?? 40}%
                          </span>
                        </div>

                        {/* Slider Efek Blur (Kabur) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                          <label style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600, minWidth: '120px' }}>
                            Efek Blur (Kabur):
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="16"
                            value={formData.wallpaperBlur ?? 0}
                            onChange={e => handleChange('wallpaperBlur', Number(e.target.value))}
                            style={{
                              flex: 1,
                              accentColor: '#2563eb',
                              cursor: 'pointer'
                            }}
                          />
                          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', minWidth: '35px', textAlign: 'right' }}>
                            {formData.wallpaperBlur ?? 0}px
                          </span>
                        </div>
                      </div>
                    )}

                    {formData.bgType === 'solid' && (
                      <div style={{
                        background: '#f8fafc',
                        padding: '1rem',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem'
                      }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                          Pilih Warna Solid Latar Belakang:
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <input
                            type="color"
                            value={formData.solidColor || '#0c1a30'}
                            onChange={e => handleChange('solidColor', e.target.value)}
                            style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                          />
                          <input
                            type="text"
                            value={formData.solidColor || '#0c1a30'}
                            onChange={e => handleChange('solidColor', e.target.value)}
                            className="input-control"
                            style={{ maxWidth: '160px', fontSize: '0.85rem' }}
                          />
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            {['#0c1a30', '#060d19', '#0f2942', '#0284c7', '#f1f5f9'].map(c => (
                              <div
                                key={c}
                                onClick={() => handleChange('solidColor', c)}
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '6px',
                                  background: c,
                                  border: '1px solid #cbd5e1',
                                  cursor: 'pointer'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.bgType === 'gradasi' && (
                      <div style={{
                        background: '#f8fafc',
                        padding: '1rem',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.85rem'
                      }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                          <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Warna Awal</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                              <input
                                type="color"
                                value={formData.gradientFrom || '#0c1a30'}
                                onChange={e => handleChange('gradientFrom', e.target.value)}
                                style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                              />
                              <input
                                type="text"
                                value={formData.gradientFrom || '#0c1a30'}
                                onChange={e => handleChange('gradientFrom', e.target.value)}
                                className="input-control"
                                style={{ fontSize: '0.75rem' }}
                              />
                            </div>
                          </div>
                          <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Warna Tengah</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                              <input
                                type="color"
                                value={formData.gradientVia || '#0f2942'}
                                onChange={e => handleChange('gradientVia', e.target.value)}
                                style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                              />
                              <input
                                type="text"
                                value={formData.gradientVia || '#0f2942'}
                                onChange={e => handleChange('gradientVia', e.target.value)}
                                className="input-control"
                                style={{ fontSize: '0.75rem' }}
                              />
                            </div>
                          </div>
                          <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Warna Akhir</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                              <input
                                type="color"
                                value={formData.gradientTo || '#060d19'}
                                onChange={e => handleChange('gradientTo', e.target.value)}
                                style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                              />
                              <input
                                type="text"
                                value={formData.gradientTo || '#060d19'}
                                onChange={e => handleChange('gradientTo', e.target.value)}
                                className="input-control"
                                style={{ fontSize: '0.75rem' }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Efek Bola Cahaya Ambient (Glow Blobs) */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.95rem 1.25rem',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      background: '#ffffff'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Sparkles size={16} color="#f59e0b" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                          Efek Bola Cahaya Ambient (Glow Blobs)
                        </span>
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
                        <input
                          type="checkbox"
                          checked={formData.glowBlobs !== false}
                          onChange={e => handleChange('glowBlobs', e.target.checked)}
                          style={{ accentColor: '#2563eb', width: '17px', height: '17px', cursor: 'pointer' }}
                        />
                        <span>Aktif</span>
                      </label>
                    </div>

                    {/* Text Theme Contrast Selector */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.75rem'
                    }}>
                      {/* Button 1: Teks Standar Gelap (Latar Terang) */}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            textColorTheme: 'light',
                            formCardStyle: 'clean_white'
                          }));
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          padding: '0.8rem 1rem',
                          borderRadius: '8px',
                          border: isLight ? '2px solid #2563eb' : '1px solid #cbd5e1',
                          background: isLight ? '#eff6ff' : '#ffffff',
                          color: isLight ? '#1d4ed8' : '#334155',
                          fontSize: '0.82rem',
                          fontWeight: isLight ? 800 : 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          boxShadow: isLight ? '0 2px 8px rgba(37, 99, 235, 0.15)' : 'none'
                        }}
                      >
                        <span>🌕</span>
                        <span>Teks Standar Gelap (Latar Terang)</span>
                      </button>

                      {/* Button 2: Teks Putih / Terang (Latar Gelap) */}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            textColorTheme: 'dark',
                            formCardStyle: 'dark_glass'
                          }));
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          padding: '0.8rem 1rem',
                          borderRadius: '8px',
                          border: !isLight ? '2px solid #0f172a' : '1px solid #cbd5e1',
                          background: !isLight ? '#0f172a' : '#ffffff',
                          color: !isLight ? '#ffffff' : '#334155',
                          fontSize: '0.82rem',
                          fontWeight: !isLight ? 800 : 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          boxShadow: !isLight ? '0 2px 8px rgba(15, 23, 42, 0.25)' : 'none'
                        }}
                      >
                        <span>🌙</span>
                        <span>Teks Putih / Terang (Latar Gelap)</span>
                      </button>
                    </div>
                  </>
  );
};
