/**
 * DocFormCategoryPicker.jsx
 * Diekstrak dari DocumentFormModal.jsx (baris 1301-1703).
 * Sumber: Step 1: pilih kategori sertifikat kapal (BKI, KSOP, statutory)
 */
import React from 'react';
import { ArrowRight, CheckCircle2, FileText, Layers, Plus, Tag, Trash2, X } from 'lucide-react';
import { getCategoryProfile } from './docFormProfiles';

export const DocFormCategoryPicker = ({
  addCertificateCategory,
  allCategoryList,
  deleteCertificateCategory,
  deletingCatId,
  formData,
  handleCategoryChange,
  isAddingNewCat,
  newCategoryDesc,
  newCategoryName,
  onClose,
  setDeletingCatId,
  setFormData,
  setFormStep,
  setIsAddingNewCat,
  setNewCategoryDesc,
  setNewCategoryName,
  vessels,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Step 1 Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.45)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8'
                    }}>
                      <Layers size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>Pilih Kategori Sertifikat Kapal</span>
                        <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                          Langkah 1 dari 2
                        </span>
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Pilih kategori sertifikat (BKI, KSOP, Statutory, dll.) sebelum mengisi data formulir spesifik kapal.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '34px', height: '34px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Kapal Terkait Selection in Step 1 */}
                <div>
                  <label className="field-label" style={{ fontWeight: 700 }}>Kapal Terkait *</label>
                  <select
                    value={formData.vesselId}
                    onChange={(e) => {
                      const newVId = e.target.value;
                      const selVessel = vessels.find(v => v.id === newVId);
                      const portName = selVessel?.portOfRegistry?.split(',')[0]?.trim() || 'Pontianak';
                      setFormData(prev => {
                        const prof = getCategoryProfile(prev.category);
                        const autoIssuer = prof.defaultIssuer ? prof.defaultIssuer(portName) : prev.issuer;
                        return {
                          ...prev,
                          vesselId: newVId,
                          issuer: autoIssuer
                        };
                      });
                    }}
                    className="select-control"
                    required
                  >
                    {vessels.length === 0 ? (
                      <option value="" disabled>-- Belum ada kapal (Silakan daftarkan kapal dahulu) --</option>
                    ) : (
                      <>
                        {vessels.some(v => v.ownershipStatus !== 'As Operator') && (
                          <optgroup label={`⚓ AS OWNER (${vessels.filter(v => v.ownershipStatus !== 'As Operator').length} Kapal)`}>
                            {vessels.filter(v => v.ownershipStatus !== 'As Operator').map(v => (
                              <option key={v.id} value={v.id}>🚢 {v.name} [Owner]</option>
                            ))}
                          </optgroup>
                        )}
                        {vessels.some(v => v.ownershipStatus === 'As Operator') && (
                          <optgroup label={`⚙️ AS OPERATOR (${vessels.filter(v => v.ownershipStatus === 'As Operator').length} Kapal)`}>
                            {vessels.filter(v => v.ownershipStatus === 'As Operator').map(v => (
                              <option key={v.id} value={v.id}>⚙️ {v.name} [Operator]</option>
                            ))}
                          </optgroup>
                        )}
                      </>
                    )}
                  </select>
                </div>

                {/* Heading & Tambah Kategori Manual Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <label className="field-label" style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)', margin: 0 }}>
                      DAFTAR KATEGORI SERTIFIKAT TERSEDIA
                    </label>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                      Klik salah satu kategori di bawah untuk langsung menuju formulir pengisian data sertifikat.
                    </span>
                  </div>

                  {!isAddingNewCat && (
                    <button
                      type="button"
                      onClick={() => setIsAddingNewCat(true)}
                      className="btn btn-sm"
                      style={{
                        fontSize: '0.78rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: 'rgba(56, 189, 248, 0.12)',
                        color: '#38bdf8',
                        border: '1px solid rgba(56, 189, 248, 0.35)',
                        padding: '0.4rem 0.85rem',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Plus size={14} />
                      <span>+ Tambah Kategori Manual</span>
                    </button>
                  )}
                </div>

                {/* Form Tambah Kategori Manual Baru (Otomatis Tersimpan di Data Master) */}
                {isAddingNewCat && (
                  <div className="glass-card" style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    background: 'rgba(56, 189, 248, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h5 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0 }}>
                        <Plus size={16} />
                        <span>Tambah Kategori Manual Baru (Otomatis Tersimpan di Data Master)</span>
                      </h5>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr', gap: '0.75rem' }}>
                      <div>
                        <label className="field-label">Nama Kategori Baru *</label>
                        <input
                          type="text"
                          placeholder="Contoh: Bea Cukai / Dishub / Sertifikat Radio"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="input-control"
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="field-label">Keterangan Singkat (Opsional)</label>
                        <input
                          type="text"
                          placeholder="Contoh: Dokumen kepabeanan & sertifikasi perizinan"
                          value={newCategoryDesc}
                          onChange={(e) => setNewCategoryDesc(e.target.value)}
                          className="input-control"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNewCat(false);
                          setNewCategoryName('');
                          setNewCategoryDesc('');
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!newCategoryName.trim()) return;
                          const created = addCertificateCategory({
                            label: newCategoryName.trim(),
                            description: newCategoryDesc.trim() || `Kategori dokumen ${newCategoryName.trim()}`
                          });
                          handleCategoryChange(created.id);
                          setNewCategoryName('');
                          setNewCategoryDesc('');
                          setIsAddingNewCat(false);
                          setFormStep(2);
                        }}
                        className="btn btn-primary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                      >
                        <CheckCircle2 size={15} />
                        <span>Simpan ke Data Master & Lanjut ke Form</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Grid Cards of Categories */}
                {allCategoryList.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '3rem 1.5rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '12px',
                    border: '1px dashed var(--border-subtle)'
                  }}>
                    <Tag size={40} style={{ color: '#38bdf8', opacity: 0.4, margin: '0 auto 0.75rem auto', display: 'block' }} />
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                      Belum Ada Kategori di Data Master
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1rem auto' }}>
                      Semua kategori sertifikat telah dihapus dari Data Master. Silakan klik tombol <strong>+ Tambah Kategori Manual</strong> di atas untuk membuat kategori baru.
                    </p>
                    {!isAddingNewCat && (
                      <button
                        type="button"
                        onClick={() => setIsAddingNewCat(true)}
                        className="btn btn-primary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                      >
                        <Plus size={15} />
                        <span>+ Tambah Kategori Sekarang</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '0.85rem'
                  }}>
                    {allCategoryList.map(cat => {
                      const prof = getCategoryProfile(cat.id);
                      const IconComp = cat.icon || prof.icon || FileText;
                      const isSelected = (formData.category || '').toLowerCase() === cat.id.toLowerCase();

                      return (
                        <div
                          key={cat.id}
                          onClick={() => {
                            handleCategoryChange(cat.id);
                            setFormStep(2);
                          }}
                          style={{
                            padding: '1.2rem 1.1rem',
                            borderRadius: '12px',
                            border: isSelected ? `2px solid ${cat.color || prof.color}` : `1px solid ${cat.borderColor || 'var(--border-subtle)'}`,
                            background: isSelected ? (cat.bgColor || prof.bgColor) : 'rgba(255, 255, 255, 0.03)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.65rem',
                            boxShadow: isSelected ? `0 0 20px ${cat.color || prof.color}35` : 'none',
                            position: 'relative'
                          }}
                          className="category-card-item"
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '10px',
                              background: cat.color || prof.color,
                              color: '#0f172a',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800
                            }}>
                              <IconComp size={22} />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              {cat.isCustom ? (
                                <span className="badge badge-warning" style={{ fontSize: '0.65rem', fontWeight: 700 }}>
                                  Kategori Kustom
                                </span>
                              ) : (
                                <span className="badge" style={{ fontSize: '0.65rem', background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)' }}>
                                  Standar Resmi
                                </span>
                              )}

                              {/* Tombol Hapus Kategori Langsung (Sinkron ke Data Master) */}
                              {deletingCatId === cat.id ? (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    background: 'rgba(239, 68, 68, 0.15)',
                                    border: '1px solid #ef4444',
                                    padding: '0.15rem 0.35rem',
                                    borderRadius: '6px'
                                  }}
                                >
                                  <span style={{ fontSize: '0.68rem', color: '#ef4444', fontWeight: 700 }}>Hapus?</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteCertificateCategory(cat.id);
                                      setDeletingCatId(null);
                                    }}
                                    style={{
                                      background: '#ef4444',
                                      color: '#fff',
                                      border: 'none',
                                      borderRadius: '4px',
                                      padding: '0.15rem 0.35rem',
                                      fontSize: '0.65rem',
                                      fontWeight: 700,
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Ya
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeletingCatId(null);
                                    }}
                                    style={{
                                      background: 'transparent',
                                      color: 'var(--text-muted)',
                                      border: 'none',
                                      padding: '0.15rem 0.2rem',
                                      fontSize: '0.65rem',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeletingCatId(cat.id);
                                  }}
                                  title={`Hapus kategori ${cat.label} dari Data Master`}
                                  style={{
                                    background: 'rgba(239, 68, 68, 0.08)',
                                    border: '1px solid rgba(239, 68, 68, 0.25)',
                                    color: '#ef4444',
                                    borderRadius: '6px',
                                    padding: '0.2rem 0.35rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                              {cat.shortLabel || cat.label}
                            </h4>
                            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: '1.4', minHeight: '38px', margin: 0 }}>
                              {cat.description || cat.tagline || prof.tagline}
                            </p>
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: 'auto',
                            paddingTop: '0.65rem',
                            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: cat.color || prof.color
                          }}>
                            <span>Pilih Kategori Ini</span>
                            <ArrowRight size={14} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
  );
};
