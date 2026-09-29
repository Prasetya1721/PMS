/**
 * ChecklistManualCodeForm.jsx
 * Diekstrak dari ChecklistTab.jsx (baris 177-266).
 * Sumber: Form input kode manual item checklist baru
 */
import React from 'react';
import { Plus } from 'lucide-react';

export const ChecklistManualCodeForm = ({
  currentTarget,
  handleAddManualChecklistItem,
  manualCode,
  manualCriteria,
  manualName,
  manualNotes,
  manualStatus,
  setManualCode,
  setManualCriteria,
  setManualName,
  setManualNotes,
  setManualStatus,
  setShowManualCodeForm,
}) => {
  return (
    <form onSubmit={handleAddManualChecklistItem} className="glass-card" style={{ padding: '1.25rem', border: '1px solid #0284c7', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={16} />
              <span>Input Item Audit Manual untuk {currentTarget.name}:</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  Kode Klausul Kustom *
                </label>
                <input
                  type="text"
                  required
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="cth: SMC-KAPAL-01 / ISM-10.5"
                  className="input-control mono"
                  style={{ fontWeight: 700 }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  Nama Klausul / Area Inspeksi *
                </label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="cth: Pemeriksaan Generator Darurat & Quick Closing Valve"
                  className="input-control"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  Hasil Evaluasi
                </label>
                <select
                  value={manualStatus}
                  onChange={(e) => setManualStatus(e.target.value)}
                  className="select-control"
                >
                  <option value="Complied">Complied (Sesuai / Yes)</option>
                  <option value="Observation">Observasi</option>
                  <option value="Minor NC">Minor NC (No)</option>
                  <option value="Major NC">Major NC (No)</option>
                  <option value="N/A">N/A (Tidak Berlaku)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  Kriteria Pemeriksaan
                </label>
                <input
                  type="text"
                  value={manualCriteria}
                  onChange={(e) => setManualCriteria(e.target.value)}
                  placeholder="Indikator fisik atau prosedur yang diverifikasi..."
                  className="input-control"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  Catatan Auditor
                </label>
                <input
                  type="text"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="Catatan hasil temuan fisik..."
                  className="input-control"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" onClick={() => setShowManualCodeForm(false)} className="btn btn-secondary btn-sm">
                Batal
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Simpan Item Checklist
              </button>
            </div>
          </form>
  );
};
