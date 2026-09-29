/**
 * MasterDataTabSurveyTypes.jsx
 * Diekstrak dari MasterDataAdmin.jsx (baris 2143-2431).
 * Sumber: Tab 5B: master jenis survey & pemeriksaan periodik
 */
import React from 'react';
import { ClipboardCheck, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';

export const MasterDataTabSurveyTypes = ({
  allDocList,
  allSurveyTypesList,
  certificateCategories,
  deleteMasterSurveyType,
  deletingSurveyId,
  filteredSurveyTypes,
  handleClearSurveyTypes,
  handleCreateSurveyType,
  handleResetSurveyTypes,
  newSurveyData,
  setDeletingSurveyId,
  setNewSurveyData,
  setSurveyCatFilter,
  setSurveySearch,
  surveyCatFilter,
  surveySearch,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Master Jenis Survey & Siklus Pemeriksaan Kapal</h3>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                      {filteredSurveyTypes.length} dari {allSurveyTypesList.length} Jenis Survey
                    </span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Kelola jenis survei periodik (Annual, Intermediate, Special/Renewal, Docking, Non-Survey) per kategori sertifikat.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleResetSurveyTypes}
                    className="btn btn-secondary btn-sm"
                    title="Kembalikan master survey ke data standar maritim"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <RefreshCw size={14} />
                    <span>Reset Standar Maritim</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearSurveyTypes}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                    title="Kosongkan master survey"
                  >
                    <Trash2 size={14} />
                    <span>Kosongkan Master Survey</span>
                  </button>
                </div>
              </div>

              {/* Form Tambah Jenis Survey Baru */}
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Plus size={16} color="#38bdf8" />
                  <span>Tambah Jenis Survey Baru ke Data Master</span>
                </h4>
                <form onSubmit={handleCreateSurveyType} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr auto', gap: '0.75rem', alignItems: 'end' }}>
                  <div>
                    <label className="field-label">Nama Jenis Survey *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Annual Survey Lambung & Mesin"
                      value={newSurveyData.name}
                      onChange={(e) => setNewSurveyData(prev => ({ ...prev, name: e.target.value }))}
                      className="input-control"
                    />
                  </div>

                  <div>
                    <label className="field-label">Kategori Sertifikat *</label>
                    <select
                      value={newSurveyData.category}
                      onChange={(e) => setNewSurveyData(prev => ({ ...prev, category: e.target.value }))}
                      className="select-control"
                    >
                      {(certificateCategories || []).map(c => (
                        <option key={c.id || c.code} value={c.id || c.code}>{c.label || c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="field-label">Periode / Siklus (Diisi Manual) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 1 Tahun / 2.5 Tahun / Bebas..."
                      value={newSurveyData.periodLabel || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        let num = 1;
                        if (val.includes('2.5')) num = 2.5;
                        else if (val.includes('5')) num = 5;
                        else if (val.includes('10')) num = 10;
                        else if (val.includes('0.5') || val.toLowerCase().includes('6 bln')) num = 0.5;
                        else if (val.toLowerCase().includes('non')) num = 0;
                        setNewSurveyData(prev => ({ ...prev, periodLabel: val, intervalYears: num }));
                      }}
                      className="input-control"
                      list="period-datalist-opts"
                    />
                    <datalist id="period-datalist-opts">
                      <option value="1 Tahun (Tahunan / Annual)" />
                      <option value="2.5 Tahun (Antara / Intermediate / Docking)" />
                      <option value="5 Tahun (Pembaruan / Renewal / Special)" />
                      <option value="10 Tahun (Surat Ukur / Jangka Panjang)" />
                      <option value="6 Bulan (SSCEC / Sanitasi)" />
                      <option value="Non-Survey (Tidak Berkala)" />
                    </datalist>
                  </div>

                  <div>
                    <label className="field-label">Keterangan / Ruang Lingkup</label>
                    <input
                      type="text"
                      placeholder="Keterangan objek inspeksi kelaiklautan..."
                      value={newSurveyData.description}
                      onChange={(e) => setNewSurveyData(prev => ({ ...prev, description: e.target.value }))}
                      className="input-control"
                    />
                  </div>

                  <div>
                    <button type="submit" className="btn btn-primary" style={{ height: '38px', whiteSpace: 'nowrap' }}>
                      Simpan Survey
                    </button>
                  </div>
                </form>
              </div>

              {/* Filters & Search */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Cari nama survey, deskripsi ruang lingkup..."
                    value={surveySearch}
                    onChange={(e) => setSurveySearch(e.target.value)}
                    className="input-control"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>

                <select
                  value={surveyCatFilter}
                  onChange={(e) => setSurveyCatFilter(e.target.value)}
                  className="select-control"
                  style={{ width: '220px' }}
                >
                  <option value="ALL">Semua Kategori ({allSurveyTypesList.length})</option>
                  {(certificateCategories || []).map(c => {
                    const cnt = allSurveyTypesList.filter(s => (s.category || '').toLowerCase() === (c.id || c.code || '').toLowerCase()).length;
                    return (
                      <option key={c.id || c.code} value={c.id || c.code}>
                        {c.label || c.name} ({cnt})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Survey Types Table */}
              <div className="glass-card" style={{ overflow: 'hidden' }}>
                <div className="table-container">
                  <table className="pms-table">
                    <thead>
                      <tr>
                        <th>Nama Jenis Survey</th>
                        <th>Kategori</th>
                        <th>Siklus / Interval</th>
                        <th>Deskripsi & Ruang Lingkup</th>
                        <th>Terpakai di Dokumen</th>
                        <th style={{ textAlign: 'right' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSurveyTypes.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-subtle)' }}>
                            <ClipboardCheck size={36} style={{ opacity: 0.35, margin: '0 auto 0.5rem auto', display: 'block', color: '#38bdf8' }} />
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                              Tidak Ada Data Jenis Survey
                            </div>
                            <p style={{ fontSize: '0.8rem', maxWidth: '420px', margin: '0 auto' }}>
                              {surveySearch || surveyCatFilter !== 'ALL'
                                ? 'Tidak ada jenis survey yang cocok dengan kriteria pencarian/filter.'
                                : 'Master data jenis survey saat ini kosong. Gunakan form di atas untuk menambah atau klik "Reset Standar Maritim" untuk memuat daftar baku.'}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredSurveyTypes.map(s => {
                          const matchedCat = (certificateCategories || []).find(
                            c => (c.id || c.code || '').toLowerCase() === (s.category || '').toLowerCase()
                          );
                          const usedCount = allDocList.filter(
                            d => (d.surveyType || '').trim().toLowerCase() === (s.name || '').trim().toLowerCase()
                          ).length;

                          const intervalText = s.periodLabel || (
                            s.intervalYears === 0
                            ? 'Non-Survey'
                            : s.intervalYears === 0.5
                            ? '6 Bulan'
                            : s.intervalYears === 2.5
                            ? '2.5 Tahun'
                            : `${s.intervalYears} Tahun`
                          );

                          return (
                            <tr key={s.id || s.name}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <ClipboardCheck size={16} color={matchedCat?.color || '#38bdf8'} />
                                  <strong style={{ fontSize: '0.88rem' }}>{s.name}</strong>
                                </div>
                              </td>
                              <td>
                                <span
                                  className="badge"
                                  style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    background: matchedCat?.bgColor || 'rgba(56, 189, 248, 0.15)',
                                    color: matchedCat?.color || '#38bdf8',
                                    border: `1px solid ${matchedCat?.borderColor || 'rgba(56, 189, 248, 0.35)'}`
                                  }}
                                >
                                  {matchedCat?.label || s.category}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${s.intervalYears === 0 ? 'badge-neutral' : s.intervalYears <= 1 ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: '0.75rem' }}>
                                  {intervalText}
                                </span>
                              </td>
                              <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                                {s.description || '-'}
                              </td>
                              <td>
                                <span className="badge badge-neutral" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                                  {usedCount} Dokumen
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                {deletingSurveyId === (s.id || s.name) ? (
                                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>Yakin?</span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteMasterSurveyType(s.id || s.name, s.category);
                                        setDeletingSurveyId(null);
                                      }}
                                      className="btn btn-danger btn-sm"
                                      style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}
                                    >
                                      Ya, Hapus
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeletingSurveyId(null);
                                      }}
                                      className="btn btn-secondary btn-sm"
                                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                      Batal
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeletingSurveyId(s.id || s.name);
                                    }}
                                    className="btn btn-secondary btn-sm"
                                    style={{ color: '#ef4444', padding: '0.35rem 0.55rem' }}
                                    title={`Hapus jenis survey ${s.name}`}
                                  >
                                    <Trash2 size={13} />
                                    <span>Hapus</span>
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
  );
};
