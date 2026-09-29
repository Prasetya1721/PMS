/**
 * DocFormCategoryFields.jsx
 * Diekstrak dari DocumentFormModal.jsx (baris 319-564).
 * Sumber: CategorySpecialFields - field tambahan per kategori dokumen.
 *
 * Catatan: komponen ini TIDAK dipanggil di mana pun pada kode sumber aslinya
 * (hanya dideklarasikan). Dipindah apa adanya sebagai komponen mandiri supaya
 * deklarasinya tidak menahan file induk; tidak ada perilaku yang berubah.
 */
import React from 'react';
export const CategorySpecialFields = ({ categoryId, categoryData = {}, onChange }) => {
  const normCat = (categoryId || '').toLowerCase();

  if (normCat.includes('bki')) {
    return (
      <div style={{
        padding: '0.9rem 1.1rem',
        borderRadius: '10px',
        background: 'rgba(56, 189, 248, 0.05)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '0.85rem'
      }}>
        <div>
          <label className="field-label" style={{ color: '#38bdf8', fontSize: '0.78rem' }}>
            ⚓ Notasi Klasifikasi BKI (Class Notation)
          </label>
          <input
            type="text"
            value={categoryData.classNotation || ''}
            onChange={(e) => onChange('classNotation', e.target.value)}
            placeholder="Contoh: A100 (I) P Tug Boat / SM (Machinery)"
            className="input-control mono"
            style={{ fontSize: '0.8rem' }}
          />
          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
            Tanda lambung, mesin, dan daerah pelayaran yang disetujui BKI.
          </span>
        </div>
        <div>
          <label className="field-label" style={{ color: '#38bdf8', fontSize: '0.78rem' }}>
            Status Rekomendasi Kelas (Condition of Class)
          </label>
          <select
            value={categoryData.classRecommendation || 'Bebas Rekomendasi (Clean Class)'}
            onChange={(e) => onChange('classRecommendation', e.target.value)}
            className="select-control"
            style={{ fontSize: '0.8rem' }}
          >
            <option value="Bebas Rekomendasi (Clean Class)">✓ Bebas Rekomendasi (Clean Class / Laik)</option>
            <option value="Rekomendasi Minor (Outstanding Memo)">⚠️ Rekomendasi Minor (Ada Batas Waktu Tindak Lanjut)</option>
            <option value="Rekomendasi Perbaikan Pengedokan (Docking Due)">⚠️ Rekomendasi Perbaikan Bawah Air / Docking</option>
          </select>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
            Catatan teknis surveyor BKI terhadap kondisi fisik kapal.
          </span>
        </div>
      </div>
    );
  }

  if (normCat.includes('ksop')) {
    return (
      <div style={{
        padding: '0.9rem 1.1rem',
        borderRadius: '10px',
        background: 'rgba(245, 158, 11, 0.05)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.85rem'
      }}>
        <div>
          <label className="field-label" style={{ color: '#f59e0b', fontSize: '0.78rem' }}>
            🚢 Wilayah Kerja KSOP / Pelabuhan Pendaftaran
          </label>
          <input
            type="text"
            value={categoryData.portWorkArea || ''}
            onChange={(e) => onChange('portWorkArea', e.target.value)}
            placeholder="Contoh: KSOP Kelas II Pontianak / KSOP Banjarmasin"
            className="input-control"
            style={{ fontSize: '0.8rem' }}
          />
          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
            Kantor Kesyahbandaran tempat dokumen didaftarkan / diperiksa.
          </span>
        </div>
        <div>
          <label className="field-label" style={{ color: '#f59e0b', fontSize: '0.78rem' }}>
            No. Pengesahan / Registrasi Syahbandar
          </label>
          <input
            type="text"
            value={categoryData.endorsementNo || ''}
            onChange={(e) => onChange('endorsementNo', e.target.value)}
            placeholder="Contoh: Akta Laut No. 24587/Ba / Reg. KSOP"
            className="input-control mono"
            style={{ fontSize: '0.8rem' }}
          />
          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
            Nomor registrasi resmi di buku induk syahbandar.
          </span>
        </div>
      </div>
    );
  }

  if (normCat.includes('stat')) {
    return (
      <div style={{
        padding: '0.9rem 1.1rem',
        borderRadius: '10px',
        background: 'rgba(16, 185, 129, 0.05)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        gap: '0.85rem'
      }}>
        <div>
          <label className="field-label" style={{ color: '#10b981', fontSize: '0.78rem' }}>
            📜 Badan Terakui / RSO (Recognized Security Organization)
          </label>
          <input
            type="text"
            value={categoryData.recognizedOrg || ''}
            onChange={(e) => onChange('recognizedOrg', e.target.value)}
            placeholder="Contoh: Ditjen Hubla Langsung / BKI Statutory / RSO"
            className="input-control"
            style={{ fontSize: '0.8rem' }}
          />
          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
            Organisasi yang diberi wewenang audit statutori konvensi internasional.
          </span>
        </div>
        <div>
          <label className="field-label" style={{ color: '#10b981', fontSize: '0.78rem' }}>
            Nomor DOC (Document of Compliance) Perusahaan
          </label>
          <input
            type="text"
            value={categoryData.docCompanyNo || ''}
            onChange={(e) => onChange('docCompanyNo', e.target.value)}
            placeholder="Contoh: DOC-HUBLA/BHM/2026"
            className="input-control mono"
            style={{ fontSize: '0.8rem' }}
          />
          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
            Nomor sertifikat DOC PT. Pelayaran Baharimas Kalimantan.
          </span>
        </div>
      </div>
    );
  }

  if (normCat.includes('sehat') || normCat.includes('kkp')) {
    return (
      <div style={{
        padding: '0.9rem 1.1rem',
        borderRadius: '10px',
        background: 'rgba(236, 72, 153, 0.05)',
        border: '1px solid rgba(236, 72, 153, 0.25)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '0.85rem'
      }}>
        <div>
          <label className="field-label" style={{ color: '#ec4899', fontSize: '0.78rem' }}>
            🏥 Tipe Sertifikat Sanitasi Kapal
          </label>
          <select
            value={categoryData.sanitationStatus || 'SSCEC (Exemption - Bebas Tindakan Karantina)'}
            onChange={(e) => onChange('sanitationStatus', e.target.value)}
            className="select-control"
            style={{ fontSize: '0.8rem' }}
          >
            <option value="SSCEC (Exemption - Bebas Tindakan Karantina)">SSCEC (Bebas Tindakan / Sanitasi Prima - 6 Bulan)</option>
            <option value="SSCC (Control - Telah Dilakukan Tindakan Karantina)">SSCC (Telah Dilakukan Tindakan Sanitasi / Fumigasi)</option>
          </select>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
            Standar sertifikat IHR 2005 Balai Kekarantinaan Kesehatan Pelabuhan.
          </span>
        </div>
        <div>
          <label className="field-label" style={{ color: '#ec4899', fontSize: '0.78rem' }}>
            Status Kotak Obat P3K & Medis Kapal
          </label>
          <input
            type="text"
            value={categoryData.medicineChestStatus || ''}
            onChange={(e) => onChange('medicineChestStatus', e.target.value)}
            placeholder="Contoh: Lengkap & Sesuai Standar PM 39 / KKP"
            className="input-control"
            style={{ fontSize: '0.8rem' }}
          />
          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
            Catatan obat dan peralatan emergency medis di atas kapal.
          </span>
        </div>
      </div>
    );
  }

  if (normCat.includes('asur') || normCat.includes('insur')) {
    return (
      <div style={{
        padding: '0.9rem 1.1rem',
        borderRadius: '10px',
        background: 'rgba(168, 85, 247, 0.05)',
        border: '1px solid rgba(168, 85, 247, 0.25)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '0.85rem'
      }}>
        <div>
          <label className="field-label" style={{ color: '#a855f7', fontSize: '0.78rem' }}>
            🛡️ Nilai Pertanggungan Kapal (Sum Insured / Limit)
          </label>
          <input
            type="text"
            value={categoryData.sumInsured || ''}
            onChange={(e) => onChange('sumInsured', e.target.value)}
            placeholder="Contoh: Rp 15.000.000.000 / USD 1,000,000"
            className="input-control"
            style={{ fontSize: '0.8rem' }}
          />
          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
            Nilai pertanggungan hull & machinery atau batas tanggung jawab CLC/P&I.
          </span>
        </div>
        <div>
          <label className="field-label" style={{ color: '#a855f7', fontSize: '0.78rem' }}>
            Cakupan Jaminan Polis
          </label>
          <select
            value={categoryData.insuranceScope || 'Hull & Machinery (H&M)'}
            onChange={(e) => onChange('insuranceScope', e.target.value)}
            className="select-control"
            style={{ fontSize: '0.8rem' }}
          >
            <option value="Hull & Machinery (H&M)">Hull & Machinery (H&M) - Kerusakan Kapal</option>
            <option value="Protection & Indemnity (P&I)">Protection & Indemnity (P&I) - Pihak Ketiga & Awak</option>
            <option value="CLC Bunker 2001 (Pencemaran)">CLC Bunker 2001 - Tanggung Jawab Pencemaran</option>
            <option value="Wreck Removal (WRC 2007)">Wreck Removal - Pengangkatan Kerangka Kapal</option>
          </select>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
            Jenis perlindungan risiko pelayaran dan jaminan maritim.
          </span>
        </div>
      </div>
    );
  }

  return null;
};
