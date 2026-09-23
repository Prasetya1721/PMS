import React from 'react';
import { BkiLogo } from './AuditInstitutionHeader';
import { formatIndoDate } from '../../utils/auditTimeUtils';

/**
 * Komponen Cetak Resmi Checklist BKI DOC (Document of Compliance)
 * Dokumen Acuan:
 * 00143pk26_F23_14_05-2025 Rev06 Company checklist.pdf
 * Standar: F23.14.05-2025 Rev 06 / Document Revision 00
 * Audit Sistem Manajemen Keselamatan Perusahaan (DOC)
 */
export const BkiDocChecklistReport = ({
  session,
  vessel,
  liveChecklist = null,
  findings = []
}) => {
  const companyName = 'PT. BAHARIMAS KALIMANTAN';
  const companyAddress = 'JL. ADI SUCIPTO KM 6+30 m RT.04 RW.04 SUNGAI RAYA KAB. KUBU RAYA';
  const imoCompanyNo = session?.imoCompanyNo || '1672810';
  const reportNo = session?.reportId || session?.auditNo || '00111-PK/ISM-DOC/2026';
  const auditDateStr = session?.auditDate ? formatIndoDate(session.auditDate) : 'February 7, 2026';
  const auditorName = session?.leadAuditor || session?.leadAuditorSign || 'MUHSON NURROCHMAT S';
  const dpaName = session?.auditee || 'DPA PT. BAHARIMAS KALIMANTAN';
  const auditLocation = session?.auditLocation || 'Kantor Pusat';
  const runningHeaderTitle = `Report id: ${companyName} - ${reportNo}`;

  const getResultBoxes = (item) => {
    const isStriked = Boolean(item?.isStrikethrough);
    const res = item?.result || '';
    const isYes = !isStriked && (res === 'Yes' || res === 'Complied');
    const isNo = !isStriked && ['No', 'Minor NC', 'Major NC', 'Observation'].includes(res);
    const isNA = isStriked || res === 'N/A';
    return {
      yesBox: isYes ? '\u2612' : '\u2610',
      noBox: isNo ? '\u2612' : '\u2610',
      naBox: isNA ? '\u2612' : '\u2610',
      isStriked, isNo, res
    };
  };

  const findItem = (no) => {
    if (Array.isArray(liveChecklist) && liveChecklist.length > 0) {
      const match = liveChecklist.find(c =>
        c.no === no || c.code === no || c.id === no ||
        c.id === `doc-${no}` ||
        String(c.code || '').trim().toLowerCase() === String(no).trim().toLowerCase() ||
        String(c.no || '').trim().toLowerCase() === String(no).trim().toLowerCase()
      );
      if (match) return match;
    }
    return { no, result: '', isStrikethrough: false, remark: '' };
  };

  const renderRow = (no, text, ismCode = '', customRemark = '', subChecks = null, isStrikethroughForced = false) => {
    const item = findItem(no);
    const { yesBox, noBox, isNo, isStriked } = getResultBoxes(item);
    const finalStriked = isStrikethroughForced || isStriked;
    const relatedFinding = findings.find(f => f.clauseCode === no || f.clauseCode === item?.code);
    const remarkContent = relatedFinding
      ? `See NC ${relatedFinding.findingNo || '1/4'}`
      : (item?.notes ? item.notes : (finalStriked ? 'N/A' : (customRemark || item?.remark || '')));

    return (
      <tr key={no} style={{ background: finalStriked ? '#fcfcfc' : isNo ? '#fff5f5' : '#ffffff' }}>
        <td style={{ padding: '3px 4px', border: '1px solid #000', textAlign: 'center', verticalAlign: 'middle', fontWeight: 600, fontSize: '6.8pt', width: '6%' }}>
          <span style={{ textDecoration: finalStriked ? 'line-through' : 'none', color: finalStriked ? '#64748b' : '#000' }}>{no}</span>
        </td>
        <td style={{ padding: '3px 6px', border: '1px solid #000', verticalAlign: 'top', fontSize: '6.8pt', lineHeight: 1.35, width: '46%' }}>
          <div style={{ textDecoration: finalStriked ? 'line-through' : 'none', color: finalStriked ? '#64748b' : '#000' }}>
            {item?.checkPoint ? (
              <div>
                <span style={{ fontWeight: 600 }}>{item.checkPoint}</span>
                {text && text !== item.checkPoint && (
                  <span style={{ fontSize: '6pt', color: finalStriked ? '#94a3b8' : '#64748b', fontStyle: 'italic', display: 'block', marginTop: '1px' }}>{text}</span>
                )}
              </div>
            ) : text}
          </div>
          {subChecks && (
            <div style={{ marginTop: '2px', fontSize: '6.2pt', color: finalStriked ? '#94a3b8' : '#334155' }}>
              {subChecks.map((sc, i) => <div key={i} style={{ marginTop: '1px' }}>{sc}</div>)}
            </div>
          )}
        </td>
        <td style={{ padding: '3px 4px', border: '1px solid #000', textAlign: 'center', verticalAlign: 'middle', fontSize: '6.8pt', width: '9%' }}>
          <span style={{ textDecoration: finalStriked ? 'line-through' : 'none', color: finalStriked ? '#64748b' : '#000' }}>{ismCode}</span>
        </td>
        <td style={{ padding: '3px 6px', border: '1px solid #000', textAlign: 'center', verticalAlign: 'middle', fontSize: '9pt', width: '10%' }}>
          <span style={{ marginRight: '4px' }}>{yesBox}</span>
          <span>{noBox}</span>
        </td>
        <td style={{ padding: '3px 6px', border: '1px solid #000', verticalAlign: 'top', fontSize: '6.5pt', lineHeight: 1.3, width: '29%', color: finalStriked ? '#64748b' : isNo ? '#b91c1c' : '#374151' }}>
          {remarkContent}
        </td>
      </tr>
    );
  };

  const thStyle = { background: '#1e3a5f', color: '#fff', padding: '4px 6px', border: '1.5px solid #000', textAlign: 'center', fontSize: '7pt', fontWeight: 700 };

  const renderSectionHeader = (title) => (
    <tr>
      <td colSpan={5} style={{ background: '#1e3a5f', color: '#fff', fontWeight: 700, fontSize: '7.5pt', padding: '5px 8px', border: '1px solid #000', textAlign: 'left' }}>{title}</td>
    </tr>
  );

  const renderSubsectionHeader = (title) => (
    <tr>
      <td colSpan={5} style={{ background: '#dbeafe', color: '#1e3a5f', fontWeight: 700, fontSize: '7pt', padding: '3px 8px', border: '1px solid #000', textAlign: 'left', fontStyle: 'italic' }}>{title}</td>
    </tr>
  );

  const pageStyle = {
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '7pt', lineHeight: 1.4, color: '#000', background: '#fff',
    width: '210mm', minHeight: '297mm', margin: '0 auto',
    padding: '12mm 14mm 14mm 14mm', boxSizing: 'border-box'
  };

  const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '7pt', tableLayout: 'fixed' };

  const renderColumnHeaders = () => (
    <tr>
      <th style={{ ...thStyle, width: '6%' }}>No.</th>
      <th style={{ ...thStyle, width: '46%' }}>Items to be verified (Butir Pemeriksaan)</th>
      <th style={{ ...thStyle, width: '9%' }}>ISM Code</th>
      <th style={{ ...thStyle, width: '10%' }}>Check<br />Y &nbsp; N</th>
      <th style={{ ...thStyle, width: '29%' }}>Remarks (Catatan)</th>
    </tr>
  );

  const renderRunningHeader = () => (
    <div style={{ fontSize: '6pt', color: '#374151', borderBottom: '1px solid #cbd5e1', marginBottom: '4px', paddingBottom: '2px', display: 'flex', justifyContent: 'space-between' }}>
      <span>{runningHeaderTitle}</span>
      <span>F23.14.05-2025 Rev 06</span>
    </div>
  );

  const infoTd = { padding: '2px 4px', border: '1px solid #9ca3af' };

  return (
    <div id="bki-doc-report-root" style={{ background: '#f1f5f9', padding: '16px' }}>

      {/* PAGE 1: HEADER & PRA-AUDIT */}
      <div id="doc-page-1" style={pageStyle}>
        {/* Header BKI */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px', marginBottom: '6px' }}>
            <div style={{ flex: '0 0 auto', marginRight: '12px' }}>
              <BkiLogo size={52} />
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '9pt', letterSpacing: '0.5px', textTransform: 'uppercase', color: '#1e3a5f' }}>
                CHECKLIST UNTUK SISTEM MANAJEMEN KESELAMATAN PERUSAHAAN
              </div>
              <div style={{ fontSize: '7.5pt', color: '#374151', marginTop: '2px' }}>
                CHECKLIST FOR COMPANY SAFETY MANAGEMENT SYSTEM
              </div>
              <div style={{ fontSize: '6.5pt', color: '#374151', marginTop: '3px' }}>
                Audit berdasarkan ketentuan INTERNATIONAL CONVENTION FOR THE SAFETY OF LIFE AT SEA, 1974<br />
                Chapter IX dan ISM Code — Document of Compliance (DOC)
              </div>
            </div>
            <div style={{ flex: '0 0 auto', textAlign: 'right', fontSize: '6.5pt', color: '#374151' }}>
              <div><strong>F23.14.05-2025 Rev 06</strong></div>
              <div>Document Revision 00</div>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6.8pt' }}>
            <tbody>
              <tr>
                <td style={{ ...infoTd, width: '20%' }}><strong>No. Laporan / Report Number</strong></td>
                <td style={{ ...infoTd, width: '30%', fontWeight: 700 }}>{reportNo}</td>
                <td style={{ ...infoTd, width: '20%' }}><strong>Jenis Audit / Type of Audit</strong></td>
                <td style={{ ...infoTd, width: '30%' }}>{'\u2612'} Audit Tahunan (Annual Audit)</td>
              </tr>
              <tr>
                <td style={infoTd}><strong>Nama Perusahaan / Company Name</strong></td>
                <td colSpan={3} style={{ ...infoTd, fontWeight: 700 }}>{companyName}</td>
              </tr>
              <tr>
                <td style={infoTd}><strong>Alamat / Address</strong></td>
                <td colSpan={3} style={infoTd}>{companyAddress}</td>
              </tr>
              <tr>
                <td style={infoTd}><strong>No. IMO Perusahaan</strong></td>
                <td style={infoTd}>{imoCompanyNo}</td>
                <td style={infoTd}><strong>Tanggal Audit / Date of Audit</strong></td>
                <td style={infoTd}>{auditDateStr}</td>
              </tr>
              <tr>
                <td style={infoTd}><strong>Auditor</strong></td>
                <td style={infoTd}>{auditorName}</td>
                <td style={infoTd}><strong>Tempat Audit / Location</strong></td>
                <td style={infoTd}>{auditLocation}</td>
              </tr>
              <tr>
                <td style={infoTd}><strong>DPA / Perwakilan Perusahaan</strong></td>
                <td colSpan={3} style={infoTd}>{dpaName}</td>
              </tr>
              <tr>
                <td style={infoTd}><strong>Negara Bendera / Flag State</strong></td>
                <td style={infoTd}>INDONESIA</td>
                <td style={infoTd}><strong>Persyaratan Pemerintah</strong></td>
                <td style={infoTd}>Yes</td>
              </tr>
            </tbody>
          </table>
        </div>

        <table style={tableStyle}>
          <thead>{renderColumnHeaders()}</thead>
          <tbody>
            {renderSectionHeader('(1) Item yang Diperiksa Sebelum Audit / Items to be checked prior to audit')}
            {renderSubsectionHeader('0. Persiapan Pra-Audit')}
            {renderRow('0.1', 'Apakah terdapat perubahan kapal yang dikelola perusahaan?', '3.1')}
            {renderRow('0.2', 'Apakah terdapat perubahan nama atau alamat perusahaan?', '3.1')}
            {renderRow('0.3', 'Konfirmasi tipe kapal yang tercantum dalam lingkup DOC perusahaan.', '3.1')}
            {renderRow('0.4', 'Konfirmasi bendera kapal yang tercantum dalam lingkup DOC perusahaan.', '3.1')}
            {renderRow('0.5', 'Konfirmasi laporan kepada otoritas bendera (Flag State) untuk setiap kapal.', '3.1')}
            {renderSectionHeader('(2) Jumlah & Tipe Kapal Tanggung Jawab Perusahaan')}
            {renderSubsectionHeader('Jumlah & Tipe Kapal')}
            {renderRow('PRE-1', 'Daftar kapal yang menjadi tanggung jawab perusahaan beserta tipe dan jumlahnya.', '3.1')}
            {renderRow('PRE-2', 'Konfirmasi kapal yang dijadikan sampel audit (minimal 1 kapal per tipe).', '3.1')}
            {renderSubsectionHeader('Kebangsaan & Bahasa Awak')}
            {renderRow('PRE-3', 'Konfirmasi kebangsaan aktif awak kapal (Nakhoda, Perwira Dek, Perwira Mesin, Kelasi, Juru Minyak, Koki).', '6.6')}
            {renderRow('PRE-4', 'Konfirmasi bahasa kerja resmi yang digunakan di atas kapal dan dalam manual SMS.', '6.6')}
            {renderSectionHeader('(3) Wawancara dengan Manajemen Puncak / Interview with Top Management')}
            {renderSubsectionHeader('3. Tinjauan Manajemen Puncak')}
            {renderRow('3.1', 'Apakah terdapat manfaat yang dirasakan sejak perusahaan menerapkan SMS?', '12.3')}
            {renderRow('3.2', 'Bagaimana pendapat manajemen mengenai kegiatan SMS seluruh personil?', '12.3')}
            {renderRow('3.3', 'Apa saja hal yang baru-baru ini dilaporkan DPA kepada manajemen puncak terkait SMS?', '12.3')}
            {renderRow('3.4', 'Bagaimana pemikiran manajemen mengenai poin-poin utama Management Review?', '4')}
            {renderRow('3.5', 'Bagaimana pendapat manajemen mengenai kecelakaan laut beberapa tahun terakhir di industri?', '12.3')}
            {renderSectionHeader('(4) Designated Person Ashore (DPA)')}
            {renderSubsectionHeader('4. Tanggung Jawab & Wewenang DPA')}
            {renderRow('4.1', 'Apakah DPA memahami tanggung jawab dan wewenangnya sesuai ISM Code Bagian 4?', '4')}
            {renderRow('4.2', 'Apakah identitas dan kontak DPA diketahui oleh seluruh Nakhoda dan perwira armada?', '4')}
            {renderRow('4.3', 'Apakah DPA memiliki akses langsung kepada manajemen puncak perusahaan?', '4')}
            {renderRow('4.4', 'Apakah DPA secara aktif memantau aspek keselamatan dan pencegahan pencemaran di seluruh armada?', '4')}
          </tbody>
        </table>
        <div style={{ textAlign: 'right', fontSize: '6pt', color: '#64748b', marginTop: '4px' }}>F23.14.05-2025 Rev 06 / Document Revision 00 &nbsp;&nbsp; 1/7</div>
      </div>

      {/* PAGE 2: TINJAUAN SISTEM */}
      <div id="doc-page-2" style={{ ...pageStyle, marginTop: '8px' }}>
        {renderRunningHeader()}
        <table style={tableStyle}>
          <thead>{renderColumnHeaders()}</thead>
          <tbody>
            {renderSectionHeader('(5) Tinjauan Sistem Keselamatan / Management/System Review')}
            {renderSubsectionHeader('5.1 Penilaian Risiko')}
            {renderRow('5.1', 'Apakah perusahaan memiliki prosedur untuk mengidentifikasi dan menilai potensi situasi berbahaya?', '1.2.2.2')}
            {renderRow('5.2', 'Apakah risiko-risiko yang teridentifikasi terhadap kapal, personil, dan lingkungan dinilai serta ditinjau dalam rapat?', '1.2.2.2')}
            {renderRow('5.3', 'Siapakah pihak yang bertanggung jawab atas pelaksanaan penilaian risiko?', '1.2.2.2')}
            {renderRow('5.4', 'Apakah terdapat safeguard baru yang ditetapkan berdasarkan hasil evaluasi penilaian risiko?', '1.2.2.2')}
            {renderSubsectionHeader('5.2 Prosedur Tinjauan Nakhoda')}
            {renderRow('5.5', 'Apakah SMS menetapkan prosedur bagi Nakhoda untuk meninjau SMS dan melaporkan kekurangannya ke manajemen darat?', '5.1.5')}
            {renderRow('5.6', 'Apakah SMS menetapkan prosedur pelaporan kecelakaan dan ketidaksesuaian (NC)?', '9.1')}
            {renderSubsectionHeader('5.3 Rapat Tinjauan Sistem (System Review Meetings)')}
            {renderRow('5.7', 'Apakah rapat tinjauan sistem diadakan oleh perusahaan minimal sekali dalam setahun?', '12.3')}
            {renderRow('5.8', 'Apakah kebutuhan revisi SMS dibahas dalam rapat tinjauan sistem?', '12.3')}
            {renderRow('5.9', 'Apakah hasil tinjauan sistem disampaikan kepada seluruh departemen dan kapal?', '12.6')}
            {renderRow('5.10', 'Apakah kinerja dan penilaian agen kepegawaian serta kebutuhan pelatihan awak kapal dibahas dalam rapat?', '12.2')}
            {renderRow('5.11', 'Apakah penahanan/kekurangan PSC dan NC/OBS pada audit internal/eksternal dibahas dalam rapat?', '12.3')}
            {renderRow('5.12', 'Apakah hasil tinjauan SMS oleh Nakhoda dan laporan kekurangan/kerusakan dibahas dalam rapat?', '12.3')}
            {renderRow('5.13', 'Apakah tindakan penanggulangan dan revisi SMS terhadap kecelakaan serta sakit/meninggalnya awak kapal dibahas dalam rapat?', '12.3')}
            {renderSubsectionHeader('5.4 Ketidaksesuaian (NC) Lalu')}
            {renderRow('5.14', 'Verifikasi investigasi & analisis atas NC yang teridentifikasi pada audit sebelumnya.', '12')}
            {renderRow('5.15', 'Verifikasi investigasi & analisis atas penahanan PSC dan kecelakaan laut sebelumnya.', '12')}
          </tbody>
        </table>
        <div style={{ textAlign: 'right', fontSize: '6pt', color: '#64748b', marginTop: '4px' }}>F23.14.05-2025 Rev 06 / Document Revision 00 &nbsp;&nbsp; 2/7</div>
      </div>

      {/* PAGE 3: AUDIT INTERNAL */}
      <div id="doc-page-3" style={{ ...pageStyle, marginTop: '8px' }}>
        {renderRunningHeader()}
        <table style={tableStyle}>
          <thead>{renderColumnHeaders()}</thead>
          <tbody>
            {renderSectionHeader('(6) Audit Internal / Internal Audit')}
            {renderSubsectionHeader('6.1 Pelaksanaan Audit Internal')}
            {renderRow('6.1', 'Apakah perusahaan melaksanakan audit keselamatan internal untuk memverifikasi kepatuhan kegiatan keselamatan dan pencegahan pencemaran terhadap SMS?', '12.1')}
            {renderRow('6.2', 'Apakah audit internal untuk seluruh departemen dan kapal direncanakan dalam interval tidak lebih dari 12 bulan?', '12.1')}
            {renderRow('6.3', 'Apakah tersedia prosedur dan kriteria perpanjangan audit internal dalam 3 bulan pada keadaan luar biasa?', '12.4')}
            {renderRow('6.4', 'Apakah seluruh audit internal telah dilaksanakan dalam 12 bulan sejak tanggal audit sebelumnya?', '12.1')}
            {renderRow('6.5', 'Apakah perpanjangan audit internal dilaksanakan sesuai manual/prosedur SMS?', '12.4')}
            {renderSubsectionHeader('6.2 Tindak Lanjut Audit Internal')}
            {renderRow('6.6', 'Apakah audit internal dilaksanakan sesuai manual/prosedur SMS?', '12.4')}
            {renderRow('6.7', 'Apakah permintaan tindakan korektif dan koreksi untuk NC, serta verifikasi efektivitasnya dilaksanakan secara berurutan?', '12.6')}
            {renderRow('6.8', 'Apakah hasil audit internal dilaporkan kepada manajemen puncak sesuai prosedur?', '12.1')}
            {renderRow('6.9', 'Apakah hasil audit internal disampaikan kepada seluruh departemen dan kapal?', '12.1')}
            {renderSubsectionHeader('6.3 Isi Checklist Audit Internal - Kantor')}
            {renderRow('6.10', 'Status rekaman yang disiapkan oleh kantor dan rekaman dari kapal.', '12.1')}
            {renderRow('6.11', 'Status pengelolaan dokumen terkontrol dan publikasi (termasuk penghapusan dokumen lama).', '12.1')}
            {renderRow('6.12', 'Tanggapan terhadap permintaan dari Nakhoda kapal.', '12.1')}
            {renderRow('6.13', 'Tanggapan terhadap laporan kerusakan dari Nakhoda kapal.', '12.1')}
            {renderRow('6.14', 'Kinerja agen kepegawaian dan pengendalian sertifikat awak kapal.', '12.1')}
            {renderRow('6.15', 'Pelatihan pra-naik kapal (pre-joining training), instruksi penting, dan kebutuhan pelatihan.', '12.1')}
            {renderRow('6.16', 'Latihan gabungan keadaan darurat dan evaluasinya.', '12.1')}
            {renderSubsectionHeader('6.4 Isi Checklist Audit Internal - Kapal')}
            {renderRow('6.17', 'Pengisian Buku Harian Resmi Deck (Official/Deck Log Book).', '12.1')}
            {renderRow('6.18', 'Latihan darurat (kebakaran, sekoci, dll.) sesuai SOLAS Bab III Reg. 19.', '12.1')}
            {renderRow('6.19', 'Motivasi awak kapal terhadap SMS Perusahaan oleh Nakhoda.', '12.1')}
            {renderRow('6.20', 'Plakat yang terpasang (Standing Order Nakhoda, jadwal jaga, Muster List, pengendalian sampah, larangan merokok).', '12.1')}
            {renderRow('6.21', 'Verifikasi Nakhoda atas rencana pelayaran (voyage & passage plan) dan koreksi peta laut.', '12.1')}
            {renderRow('6.22', 'Konfirmasi prosedur penanganan ECDIS dalam SMS mengenai cara memperbarui ENC.', '12.1')}
            {renderRow('6.23', 'Tinjauan Nakhoda terhadap SMS dan pelaporan kekurangannya kepada manajemen darat.', '12.1')}
            {renderRow('6.24', 'Pelatihan familiarisasi dan instruksi penting untuk awak kapal yang baru bergabung.', '12.1')}
            {renderRow('6.25', 'Kebutuhan pelatihan pengoperasian dan perawatan lambung, permesinan, dan peralatan.', '12.1')}
            {renderRow('6.26', 'Kesadaran awak kapal terhadap SMS (bahasa, pendidikan, dan komunikasi).', '12.1')}
            {renderRow('6.27', 'Kinerja awak kapal: komunikasi, perilaku, dan aktivitas di atas kapal.', '12.1')}
            {renderRow('6.28', 'Buku Harian Deck & Mesin sesuai manual/prosedur SMS.', '12.1')}
            {renderRow('6.29', 'Buku Catatan Sampah (Garbage Record Book).', '12.1')}
            {renderRow('6.30', 'Latihan, pelatihan, dan instruksi di atas kapal sesuai jadwal tahunan.', '12.1')}
            {renderRow('6.31', 'Peluncuran sekoci/rescue boat; penahanan/kekurangan PSC dan NC/OBS pada audit eksternal.', '12.1')}
            {renderRow('6.32', 'Pemantauan kemajuan dan pelaporan pemeliharaan terencana (PMS).', '12.1')}
            {renderRow('6.33', 'Koreksi dan tindakan pencegahan terhadap laporan kerusakan.', '12.1')}
            {renderRow('6.34', 'Pengelolaan dokumen terkontrol dan buku/publikasi hukum.', '12.1')}
            {renderRow('6.35', 'Pengelolaan surat masuk/keluar dan rekaman terkontrol.', '12.1')}
            {renderSubsectionHeader('6.5 Verifikasi Periodik')}
            {renderRow('6.36', 'Apakah terdapat prosedur untuk memverifikasi secara berkala apakah semua pihak yang mengemban tugas ISM bertindak sesuai tanggung jawab Perusahaan?', '12.2')}
            {renderRow('6.37', 'Apakah verifikasi periodik direncanakan minimal sekali dalam setahun?', '12.2')}
            {renderRow('6.38', 'Apakah verifikasi periodik dilaksanakan sesuai manual/prosedur SMS?', '12.2')}
          </tbody>
        </table>
        <div style={{ textAlign: 'right', fontSize: '6pt', color: '#64748b', marginTop: '4px' }}>F23.14.05-2025 Rev 06 / Document Revision 00 &nbsp;&nbsp; 3/7</div>
      </div>

      {/* PAGE 4: OPERASIONAL & DARURAT */}
      <div id="doc-page-4" style={{ ...pageStyle, marginTop: '8px' }}>
        {renderRunningHeader()}
        <table style={tableStyle}>
          <thead>{renderColumnHeaders()}</thead>
          <tbody>
            {renderSectionHeader('(7) Operasional Kapal & Item Khusus / Shipboard Operation, Ship Types & Flag States')}
            {renderSubsectionHeader('7.1 Rencana & Instruksi Operasional')}
            {renderRow('7.1', 'Apakah rencana dan instruksi (termasuk checklist yang sesuai) untuk operasi kunci keselamatan kapal dan pencegahan pencemaran telah ditetapkan dan dipelihara?', '7')}
            {renderRow('7.2', 'Apakah prosedur dan checklist untuk operasi kunci kapal dipelihara dengan baik?', '7')}
            {renderRow('7.3', 'Apakah tersedia prosedur penanganan muatan di luar yang tercantum dalam prosedur yang ada?', '7')}
            {renderSubsectionHeader('7.2 Dukungan Operasional Kapal')}
            {renderRow('7.4', 'Konfirmasi cara penyediaan Notice to Mariners (NtM) dan peta laut kepada kapal.', '6.1.3')}
            {renderRow('7.5', 'Surat-surat resmi apa yang telah diterbitkan perusahaan untuk memberikan informasi yang diperlukan kepada kapal?', '6.1.3')}
            {renderRow('7.6', 'Apakah Nakhoda pernah menggunakan wewenang mutlaknya (overriding authority) secara nyata?', '5.2')}
            {renderSubsectionHeader('7.3 Item Khusus Tipe Kapal')}
            {renderRow('7.7', 'Konfirmasi item khusus untuk setiap tipe kapal yang dikelola (Tanker Minyak, Kapal Barang, dll.).', '7')}
            {renderSubsectionHeader('7.4 Item Khusus Bendera Kapal (Flag States)')}
            {renderRow('7.8', 'Apakah peraturan dan sirkuler untuk setiap bendera kapal tersedia di kantor dan di setiap kapal?', '1.2.3.1')}
            {renderRow('7.9', 'Konfirmasi kepatuhan persyaratan bendera Indonesia: prosedur keamanan siber (SE 35 Tahun 2020).', '1.2.3.1')}
            {renderRow('7.10', 'Konfirmasi kepatuhan prosedur bendera Indonesia: protokol Covid-19/kesehatan awak (SE 14 Tahun 2020).', '1.2.3.1')}
            {renderSectionHeader('(8) Kesiapsiagaan Keadaan Darurat / Emergency Preparedness')}
            {renderSubsectionHeader('8.1 Identifikasi Keadaan Darurat')}
            {renderRow('8.1', 'Apakah perusahaan telah mengidentifikasi dan mendeskripsikan potensi situasi darurat di kapal serta menetapkan prosedur untuk merespons?', '8.2')}
            {renderRow('8.2', 'Apakah program latihan dan simulasi untuk mempersiapkan tindakan darurat telah ditetapkan?', '8.2')}
            {renderRow('8.3', 'Apakah organisasi perusahaan (darat) dapat merespons situasi darurat kapal sewaktu-waktu?', '8.3')}
            {renderSubsectionHeader('8.2 Prosedur Tanggap Darurat')}
            {renderRow('8.4', 'Prosedur tanggap darurat tersedia: Tabrakan (Collision)?', '8.2')}
            {renderRow('8.5', 'Prosedur tanggap darurat tersedia: Kebanjiran (Flooding)?', '8.2')}
            {renderRow('8.6', 'Prosedur tanggap darurat tersedia: Kandas (Grounding)?', '8.2')}
            {renderRow('8.7', 'Prosedur tanggap darurat tersedia: Kebakaran (Fire)?', '8.2')}
            {renderRow('8.8', 'Prosedur tanggap darurat tersedia: Pencemaran Minyak (SOPEP)?', '8.2')}
            {renderRow('8.9', 'Prosedur tanggap darurat tersedia: Pemadaman Total (Blackout)?', '8.2')}
            {renderRow('8.10', 'Prosedur tanggap darurat tersedia: Penundaan Darurat (Emergency Towing)?', '8.2')}
            {renderRow('8.11', 'Prosedur tanggap darurat tersedia: Penyelamatan Orang Jatuh ke Laut?', '8.2')}
            {renderSubsectionHeader('8.3 Latihan Darurat')}
            {renderRow('8.12', 'Apakah latihan darurat wajib SOLAS (kebakaran, sekoci/meninggalkan kapal) dijadwalkan sesuai ketentuan?', '8.2')}
            {renderRow('8.13', 'Apakah latihan kemudi darurat (steering gear) dijadwalkan sesuai SOLAS Bab V Reg. 26?', '8.2')}
            {renderRow('8.14', 'Apakah hasil evaluasi latihan darurat dikomunikasikan kepada manajemen puncak?', '8.2')}
          </tbody>
        </table>
        <div style={{ textAlign: 'right', fontSize: '6pt', color: '#64748b', marginTop: '4px' }}>F23.14.05-2025 Rev 06 / Document Revision 00 &nbsp;&nbsp; 4/7</div>
      </div>

      {/* PAGE 5: PELAPORAN NC & PEMELIHARAAN */}
      <div id="doc-page-5" style={{ ...pageStyle, marginTop: '8px' }}>
        {renderRunningHeader()}
        <table style={tableStyle}>
          <thead>{renderColumnHeaders()}</thead>
          <tbody>
            {renderSectionHeader('(9) Pelaporan & Analisis NC / Kecelakaan / Reporting & Analysis of NC, Accidents & Hazardous Occurrences')}
            {renderSubsectionHeader('9.1 Pelaporan NC & Tindakan Perbaikan')}
            {renderRow('9.1', 'Apakah definisi ketidaksesuaian (NC/Deficiency) ditetapkan secara jelas dalam SMS?', '9.1')}
            {renderRow('9.2', 'Apakah kekurangan yang teridentifikasi pada pemeriksaan PSC dilaporkan kepada perusahaan?', '9.1')}
            {renderRow('9.3', 'Apakah NC dan OBS yang teridentifikasi pada audit eksternal dilaporkan kepada perusahaan?', '9.1')}
            {renderRow('9.4', 'Apakah awak kapal yang tidak kompeten dan klaim dari pihak luar dilaporkan kepada perusahaan?', '9.1')}
            {renderRow('9.5', 'Apakah tidak ada kekurangan rekaman PSC di perusahaan dibandingkan riwayat PSC yang diperoleh dari auditor?', '9.1')}
            {renderRow('9.6', 'Apakah laporan kepada perusahaan memuat usulan tindakan korektif?', '9.2')}
            {renderRow('9.7', 'Apakah laporan-laporan tersebut diinvestigasi dan dianalisis oleh perusahaan?', '9.2')}
            {renderRow('9.8', 'Apakah hal-hal tersebut beserta tindakan pencegahannya telah disampaikan kepada kapal lain yang terkait?', '9.2')}
            {renderSubsectionHeader('9.2 Pelaporan Kecelakaan & Insiden')}
            {renderRow('9.9', 'Apakah terdapat kecelakaan atau insiden? Apakah hal tersebut dilaporkan kepada perusahaan?', '9.1')}
            {renderRow('9.10', 'Apakah laporan-laporan tersebut diinvestigasi dan dianalisis oleh perusahaan?', '9.2')}
            {renderRow('9.11', 'Apakah hal-hal tersebut telah disampaikan kepada kapal lain yang terkait?', '9.2')}
            {renderSubsectionHeader('9.3 Pelaporan Kejadian Nyaris Celaka (Near Miss)')}
            {renderRow('9.12', 'Apakah kejadian nyaris celaka (near miss) dilaporkan kepada perusahaan?', '9.1')}
            {renderRow('9.13', 'Apakah laporan near miss diinvestigasi dan dianalisis oleh perusahaan?', '9.2')}
            {renderRow('9.14', 'Apakah hal-hal tersebut beserta tindakan pencegahannya telah disampaikan kepada kapal lain yang terkait?', '9.2')}
            {renderSectionHeader('(10) Pemeliharaan Kapal & Peralatan / Maintenance of the Ship & Equipment')}
            {renderSubsectionHeader('10.1 Sertifikat & Rekaman Survey')}
            {renderRow('10.1', 'Apakah masa berlaku sertifikat dan pengaturan survei dikelola dengan baik?', '10.1')}
            {renderSubsectionHeader('10.2 Perawatan Terencana (Planned Maintenance System)')}
            {renderRow('10.2', 'Apakah item dan interval perawatan terencana (PMS) telah disusun dengan benar?', '10.2.1')}
            {renderRow('10.3', 'Apakah revisi standar perawatan dan rencana pemeliharaan dilakukan secara teratur?', '10.2.1')}
            {renderRow('10.4', 'Apakah pemantauan kemajuan perawatan terencana dilaksanakan dengan baik?', '10.2.1')}
            {renderSubsectionHeader('10.3 Dukungan dari Darat')}
            {renderRow('10.5', 'Apakah penanggung jawab merespons laporan kerusakan dari kapal secara cepat?', '10.2.3')}
            {renderRow('10.6', 'Apakah kemungkinan penyebab dicantumkan dalam laporan kerusakan?', '10.2.2')}
            {renderRow('10.7', 'Apakah tindakan korektif yang tepat terhadap laporan kerusakan telah diambil?', '10.2.3')}
            {renderRow('10.8', 'Apakah informasi yang diperlukan seperti revisi konvensi dan pemberitahuan teknis dari pabrikan diberikan kepada kapal?', '6.1.3')}
            {renderSubsectionHeader('10.4 Peralatan & Sistem Kritis')}
            {renderRow('10.9', 'Apakah langkah-langkah khusus untuk meningkatkan keandalan peralatan dan sistem kritis tersedia?', '10.3')}
            {renderRow('10.10', 'Apakah pengujian berkala terhadap pengaturan siaga (standby) dan peralatan/sistem teknis yang tidak beroperasi terus-menerus tercakup dalam PMS?', '10.3')}
          </tbody>
        </table>
        <div style={{ textAlign: 'right', fontSize: '6pt', color: '#64748b', marginTop: '4px' }}>F23.14.05-2025 Rev 06 / Document Revision 00 &nbsp;&nbsp; 5/7</div>
      </div>

      {/* PAGE 6: DOKUMENTASI & PENGAWAKAN */}
      <div id="doc-page-6" style={{ ...pageStyle, marginTop: '8px' }}>
        {renderRunningHeader()}
        <table style={tableStyle}>
          <thead>{renderColumnHeaders()}</thead>
          <tbody>
            {renderSectionHeader('(11) Dokumentasi SMS / Documentation')}
            {renderSubsectionHeader('11.1 Pengelolaan Dokumen Terkontrol')}
            {renderRow('11.1', 'Apakah revisi manual dan prosedur dilaksanakan sesuai prosedur yang berlaku?', '11.2.2')}
            {renderRow('11.2', 'Apakah distribusi dokumen yang direvisi dilaksanakan sesuai prosedur?', '11.2.1')}
            {renderRow('11.3', 'Apakah dokumen yang sudah tidak berlaku dihapus/ditarik sesuai prosedur?', '11.2.3')}
            {renderSubsectionHeader('11.2 Buku & Publikasi Hukum/Statutori')}
            {renderRow('11.4', 'Apakah daftar buku dan publikasi yang harus ada di kantor dan di atas kapal tersedia?', '11.2.1')}
            {renderRow('11.5', 'Apakah konfirmasi terhadap edisi terbaru buku hukum dilaksanakan sesuai prosedur?', '11.2.1')}
            {renderSubsectionHeader('11.3 Surat & Korespondensi Resmi')}
            {renderRow('11.6', 'Apakah surat-surat resmi dan korespondensi perusahaan dikendalikan dengan baik sesuai prosedur?', '11.2.1')}
            {renderRow('11.7', 'Apakah surat dan dokumen yang masuk dari pihak luar dikendalikan dengan baik sesuai prosedur?', '11.2.1')}
            {renderSubsectionHeader('11.4 Gambar Konstruksi Kapal')}
            {renderRow('11.8', 'Apakah gambar konstruksi terbaru (as-built drawings) setiap kapal tersedia di kantor?', '11.2.1')}
            {renderSectionHeader('(12) Pengawakan / Manning')}
            {renderSubsectionHeader('12.1 Sertifikat & Kesehatan Awak')}
            {renderRow('12.1', 'Apakah salinan Sertifikat Pengawakan Aman (Safe Manning Certificate) setiap kapal tersedia?', '6.2.2')}
            {renderRow('12.2', 'Apakah salinan Sertifikat Keahlian (COC) Nakhoda dan perwira tersedia?', '6.2.1')}
            {renderRow('12.3', 'Apakah salinan Sertifikat Kecakapan (COP) yang dipersyaratkan STCW untuk kelasi/juru tersedia?', '6.2.1')}
            {renderRow('12.4', 'Bagaimana cara penanggung jawab memeriksa keaslian sertifikat awak kapal?', '6.2.1')}
            {renderRow('12.5', 'Apakah data personil termasuk salinan sertifikat medis yang masih berlaku untuk seluruh awak bertugas tersedia?', '6.2.1')}
            {renderSubsectionHeader('12.2 Penugasan & Evaluasi Nakhoda')}
            {renderRow('12.6', 'Siapa yang bertanggung jawab atas penugasan Nakhoda dan bagaimana prosedurnya?', '6.1.1')}
            {renderRow('12.7', 'Siapa yang bertanggung jawab menilai familiarisasi Nakhoda terhadap SMS dan bagaimana prosedurnya?', '6.1.2')}
            {renderRow('12.8', 'Siapa yang bertanggung jawab menilai kemampuan dan kinerja Nakhoda serta bagaimana prosedurnya?', '6.1.1')}
            {renderSubsectionHeader('12.3 Penilaian & Pelatihan Awak Kapal')}
            {renderRow('12.9', 'Apakah pelatihan familiarisasi untuk awak kapal yang baru bergabung/pindah dilaksanakan dengan baik?', '6.4')}
            {renderRow('12.10', 'Apakah pelatihan penyegaran (refresh training) untuk awak kapal termasuk awak cadangan dilaksanakan dengan baik?', '6.5')}
            {renderRow('12.11', 'Bagaimana penanganannya jika ada awak yang tidak dapat membaca manual/prosedur?', '6.6')}
            {renderRow('12.12', 'Bagaimana penanganannya jika terdapat awak kapal multinasional di atas kapal?', '6.7')}
            {renderRow('12.13', 'Apakah prosedur untuk mencegah penggunaan kembali awak yang tidak kompeten telah ditetapkan?', '6.2.1')}
            {renderRow('12.14', 'Apakah terdapat prosedur untuk mengawaki kapal secara memadai guna mencakup seluruh aspek keselamatan operasional?', '6.2.2')}
            {renderSubsectionHeader('12.4 Evaluasi Agen Kepegawaian')}
            {renderRow('12.15', 'Materi pelatihan apa yang diberikan kepada agen kepegawaian untuk awak kapal?', '6.2.1')}
            {renderRow('12.16', 'Apakah evaluasi kinerja agen kepegawaian dilakukan secara berkala dan tepat?', '12.2')}
          </tbody>
        </table>
        <div style={{ textAlign: 'right', fontSize: '6pt', color: '#64748b', marginTop: '4px' }}>F23.14.05-2025 Rev 06 / Document Revision 00 &nbsp;&nbsp; 6/7</div>
      </div>

      {/* PAGE 7: OFFICE TOUR & PENGESAHAN */}
      <div id="doc-page-7" style={{ ...pageStyle, marginTop: '8px' }}>
        {renderRunningHeader()}
        <table style={tableStyle}>
          <thead>{renderColumnHeaders()}</thead>
          <tbody>
            {renderSectionHeader('(13) Kunjungan Keliling Kantor / Tour through the Office')}
            {renderSubsectionHeader('13. Tinjauan Fisik Kantor')}
            {renderRow('13.1', 'Apakah dokumen yang berlaku tersedia di semua lokasi yang relevan di kantor?', '11.2.1')}
            {renderRow('13.2', 'Apakah salinan seluruh sertifikat operasional kapal yang berlaku dipelihara dengan baik di kantor?', '10.1')}
            {renderRow('13.3', 'Apakah buku/publikasi hukum & statutori, sirkuler, dan gambar rencana yang dipersyaratkan dipelihara dengan baik?', '11.2.1')}
            {renderRow('13.4', 'Apakah rekaman pemeliharaan kapal (termasuk rekaman perbaikan dok) disimpan dengan baik di kantor?', '10.2.4')}
          </tbody>
        </table>

        {/* Ringkasan Temuan NC */}
        <div style={{ marginTop: '12px', border: '1px solid #000', padding: '8px 10px' }}>
          <div style={{ fontWeight: 700, fontSize: '8pt', marginBottom: '6px', color: '#1e3a5f' }}>
            REKAPITULASI TEMUAN / FINDINGS SUMMARY
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '7pt' }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: '8%' }}>No.</th>
                <th style={{ ...thStyle, width: '14%' }}>Klausul ISM</th>
                <th style={{ ...thStyle, width: '40%' }}>Uraian Temuan (NC/OBS)</th>
                <th style={{ ...thStyle, width: '20%' }}>Target Penyelesaian</th>
                <th style={{ ...thStyle, width: '18%' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {findings.length > 0 ? findings.map((f, i) => (
                <tr key={i}>
                  <td style={{ border: '1px solid #000', padding: '3px 4px', textAlign: 'center', fontSize: '7pt' }}>{i + 1}</td>
                  <td style={{ border: '1px solid #000', padding: '3px 4px', textAlign: 'center', fontSize: '7pt' }}>{f.clauseCode || '-'}</td>
                  <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '6.8pt' }}>{f.description || f.findingDetail || '-'}</td>
                  <td style={{ border: '1px solid #000', padding: '3px 4px', textAlign: 'center', fontSize: '7pt' }}>{f.targetCloseDate || '-'}</td>
                  <td style={{ border: '1px solid #000', padding: '3px 4px', textAlign: 'center', fontSize: '7pt', color: f.status === 'Closed' ? '#059669' : '#b91c1c' }}>{f.status || 'Open'}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '7pt', color: '#64748b', fontStyle: 'italic' }}>
                    Tidak ada temuan ketidaksesuaian (NC) pada sesi audit ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {session?.auditConclusion && (
          <div style={{ marginTop: '10px', border: '1px solid #000', padding: '8px 10px' }}>
            <div style={{ fontWeight: 700, fontSize: '7.5pt', marginBottom: '4px', color: '#1e3a5f' }}>KESIMPULAN & REKOMENDASI / AUDIT CONCLUSION</div>
            <div style={{ fontSize: '7pt', lineHeight: 1.5 }}>{session.auditConclusion}</div>
          </div>
        )}

        {/* Pengesahan */}
        <div style={{ marginTop: '14px', display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1, border: '1px solid #000', padding: '8px 10px', minHeight: '60px' }}>
            <div style={{ fontWeight: 700, fontSize: '7pt', marginBottom: '4px', color: '#1e3a5f' }}>Auditor BKI</div>
            <div style={{ fontSize: '6.5pt', color: '#374151', marginTop: '2px' }}>Nama: {auditorName}</div>
            <div style={{ marginTop: '24px', borderTop: '1px solid #000', paddingTop: '2px', fontSize: '6.5pt', color: '#64748b' }}>Tanda Tangan</div>
          </div>
          <div style={{ flex: 1, border: '1px solid #000', padding: '8px 10px', minHeight: '60px' }}>
            <div style={{ fontWeight: 700, fontSize: '7pt', marginBottom: '4px', color: '#1e3a5f' }}>Perwakilan Perusahaan (DPA)</div>
            <div style={{ fontSize: '6.5pt', color: '#374151', marginTop: '2px' }}>Nama: {dpaName}</div>
            <div style={{ marginTop: '24px', borderTop: '1px solid #000', paddingTop: '2px', fontSize: '6.5pt', color: '#64748b' }}>Tanda Tangan</div>
          </div>
          <div style={{ flex: 1, border: '1px solid #000', padding: '8px 10px', minHeight: '60px' }}>
            <div style={{ fontWeight: 700, fontSize: '7pt', marginBottom: '4px', color: '#1e3a5f' }}>Tanggal & Tempat</div>
            <div style={{ fontSize: '6.5pt', color: '#374151', marginTop: '2px' }}>{auditDateStr}</div>
            <div style={{ fontSize: '6.5pt', color: '#374151' }}>{auditLocation}</div>
          </div>
        </div>

        <div style={{ textAlign: 'right', fontSize: '6pt', color: '#64748b', marginTop: '8px' }}>F23.14.05-2025 Rev 06 / Document Revision 00 &nbsp;&nbsp; 7/7</div>
      </div>
    </div>
  );
};

export default BkiDocChecklistReport;
