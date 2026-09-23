import React, { useState } from 'react';
import {
  X,
  Building2,
  Ship,
  Compass,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Upload,
  Printer,
  Calendar,
  Users,
  CheckSquare,
  Award,
  BookOpen
} from 'lucide-react';

export const AuditRoleFlowModal = ({
  isOpen,
  onClose,
  currentPerspective = 'dpa',
  onSelectPerspective
}) => {
  const [activeTab, setActiveTab] = useState(currentPerspective === 'nakhoda' ? 'nakhoda' : 'dpa');

  if (!isOpen) return null;

  const dpaSteps = [
    {
      step: 1,
      title: 'Inisiasi & Penjadwalan Audit (Tahap 1: Sesi & Tim)',
      ismRef: 'ISM Code Klausul 4 & 12.1',
      roleTitle: 'Tanggung Jawab DPA (Designated Person Ashore)',
      description: 'DPA merencanakan audit keselamatan periodik (internal/eksternal), menunjuk Lead Auditor dan tim inspeksi, serta menentukan target audit (armada kapal atau kantor darat).',
      actions: [
        'Menentukan jadwal audit sesuai siklus tahunan (Annual Audit Plan).',
        'Menetapkan Lead Auditor independen yang kompeten.',
        'Menerbitkan pemberitahuan jadwal audit (Audit Plan) ke kapal dan Nakhoda.',
        'Mengonfirmasi standar checklist yang digunakan (BKI SMC Rev 05 atau DOC Rev 06).'
      ],
      output: 'Nomor Registrasi Sesi Audit Resmi (misal AUD-SMC-RP2004-2026) & Surat Tugas Auditor.'
    },
    {
      step: 2,
      title: 'Monitoring Pemeriksaan Klausul (Tahap 2: Checklist Klausul)',
      ismRef: 'ISM Code Klausul 12.2 & 12.3',
      roleTitle: 'Pengawasan Kepatuhan Dokumen & Fisik',
      description: 'DPA bersama auditor memeriksa pemenuhan 74 butir klausul kapal (SMC) atau 13 seksi kantor (DOC) secara sistematis dan real-time.',
      actions: [
        'Memantau progres pemeriksaan checklist butir per butir.',
        'Memverifikasi kesesuaian prosedur SMS kantor dengan implementasi di kapal.',
        'Mencoret (strikethrough) klausul yang tidak berlaku (N/A) dengan justifikasi teknis resmi.'
      ],
      output: 'Lembar kerja checklist terisi lengkap dengan status Yes, No, atau N/A.'
    },
    {
      step: 3,
      title: 'Evaluasi & Penetapan Temuan (Tahap 3: Temuan NC)',
      ismRef: 'ISM Code Klausul 9.1 & 12.4',
      roleTitle: 'Klasifikasi Derajat Ketidaksesuaian',
      description: 'DPA dan auditor mengklasifikasikan temuan lapangan menjadi Major NC, Minor NC, atau Observation, serta menetapkan batas waktu penyelesaian (Due Date).',
      actions: [
        'Menetapkan tingkat ketidaksesuaian: Major NC (berbahaya bagi keselamatan), Minor NC (deviasi prosedur), atau Observasi.',
        'Menetapkan batas waktu penyelesaian temuan (standar: 30–90 hari).',
        'Menerbitkan Formulir Lembar Ketidaksesuaian resmi (BKI Form F23.14.07).'
      ],
      output: 'Dokumen NCR Resmi terbit dan terdistribusi ke Nakhoda kapal.'
    },
    {
      step: 4,
      title: 'Verifikasi Eviden & Otorisasi Penutupan (Tahap 4: Bukti & CAPA)',
      ismRef: 'ISM Code Klausul 9.2 & 12.5',
      roleTitle: 'Validasi Efektivitas Tindakan Koreksi (Close-Out)',
      description: 'DPA memeriksa berkas eviden perbaikan fisik, analisis akar masalah (RCA), dan tindakan pencegahan (Preventive Action) yang dikirimkan oleh Nakhoda.',
      actions: [
        'Memeriksa bukti foto fisik, formulir SOP, dan logbook perbaikan dari kapal.',
        'Mengevaluasi apakah tindakan koreksi dinilai memuaskan (Satisfactory).',
        'Mengesahkan status penutupan temuan (Close NC) dan menandatangani kolom verifikasi auditor di formulir NCR.'
      ],
      output: 'Status Temuan menjadi NC Close & Tanggal Verifikasi DPA tercatat resmi.'
    },
    {
      step: 5,
      title: 'Deklarasi Kelaiklautan & Penutupan Sesi (Tahap 5: Penutupan & Cetak)',
      ismRef: 'ISM Code Klausul 12.6 & 13',
      roleTitle: 'Pengesahan Status Kelaiklautan (Fit-to-Sail)',
      description: 'DPA mengevaluasi hasil akhir audit, mendeklarasikan kelaikan kapal (Fit-to-Sail), menutup sesi audit resmi, dan menerbitkan berkas PDF 3 dokumen lengkap.',
      actions: [
        'Menerbitkan Deklarasi Kelaiklautan: Laik Layar (Full Compliance) atau Laik Bersyarat.',
        'Mengunci sesi audit menjadi Completed (Selesai).',
        'Mencetak dan menandatangani 3 dokumen resmi: Laporan Sesi Audit, Formulir NCR Closeout, dan Checklist BKI.'
      ],
      output: 'Audit Report resmi bertanda tangan DPA & rekomendasi penerbitan/endorsement sertifikat SMC.'
    }
  ];

  const nakhodaSteps = [
    {
      step: 1,
      title: 'Penerimaan Jadwal & Opening Meeting (Tahap 1: Sesi & Tim)',
      ismRef: 'ISM Code Klausul 5.1 & 5.2',
      roleTitle: 'Tanggung Jawab Nakhoda (Master / Captain)',
      description: 'Nakhoda bertindak sebagai pimpinan tertinggi di atas kapal dan Auditee Resmi, menerima pemberitahuan audit dari DPA dan menghadiri pertemuan pembukaan (Opening Meeting).',
      actions: [
        'Memastikan perwira kapal (Chief Officer, KKM, Masinis) hadir pada Opening Meeting.',
        'Mengonfirmasi kesiapan fisik kapal dan dokumen keselamatan di anjungan & kamar mesin.',
        'Menandatangani lembar daftar hadir Opening Meeting.'
      ],
      output: 'Kesiapan kapal dan personil kru menyambut proses audit maritim.'
    },
    {
      step: 2,
      title: 'Mendampingi Inspeksi Checklist Onboard (Tahap 2: Checklist Klausul)',
      ismRef: 'ISM Code Klausul 5.1.2 & 5.1.5',
      roleTitle: 'Pendampingan Pemeriksaan Fisik & Operasional Kapal',
      description: 'Nakhoda mendampingi auditor saat memeriksa kondisi lapangan kapal sesuai butir checklist BKI SMC Rev 05.',
      actions: [
        'Menunjukkan dokumen SMS di anjungan (SOP Cuaca Buruk, Navigasi, Emergency Plan).',
        'Mendampingi pengujian fisik alat keselamatan (Lifeboat, Lifejacket, EPIRB, FFA).',
        'Mengarahkan KKM menunjukkan logbook perawatan mesin dan kartu pemeliharaan PMS kapal.'
      ],
      output: 'Akses penuh dan transparan bagi auditor dalam menguji kelaikan kapal.'
    },
    {
      step: 3,
      title: 'Meninjau & Mengakui Temuan Lapangan (Tahap 3: Temuan NC)',
      ismRef: 'ISM Code Klausul 9.1',
      roleTitle: 'Penerimaan Lembar Ketidaksesuaian (NCR Acknowledgment)',
      description: 'Nakhoda menerima daftar ketidaksesuaian yang ditemukan auditor, memahami klausul yang terlanggar, dan menandatangani pengakuan temuan.',
      actions: [
        'Menerima formulir NCR dari auditor.',
        'Mendiskusikan batas waktu penyelesaian yang realistis sebelum kapal berlayar.',
        'Membubuhkan tanda tangan penerimaan temuan selaku Auditee / Master.'
      ],
      output: 'Formulir NCR bagian 1 bertanda tangan Nakhoda & kesepakatan batas waktu (Due Date).'
    },
    {
      step: 4,
      title: 'Eksekusi Perbaikan & Kirim Eviden ke DPA (Tahap 4: Bukti & CAPA)',
      ismRef: 'ISM Code Klausul 9.2',
      roleTitle: 'Tindakan Koreksi Fisik Onboard & Submit Eviden',
      description: 'Nakhoda memimpin perbaikan langsung di atas kapal, menganalisis akar masalah bersama perwira, menyusun tindakan pencegahan, dan mengirimkan bukti fisik ke DPA.',
      actions: [
        'Melaksanakan perbaikan fisik langsung (Correction) di kapal.',
        'Menganalisis akar penyebab masalah (Root Cause Analysis - RCA).',
        'Menyusun langkah pencegahan terulang (Preventive Action).',
        'Mengambil foto bukti fisik / dokumen SOP baru dan mengunggahnya via tombol "Kirim Bukti Eviden (Submit Eviden)".'
      ],
      output: 'Eviden perbaikan lengkap terkirim ke DPA dengan status "Eviden Submitted".'
    },
    {
      step: 5,
      title: 'Closing Meeting & Pengarsipan Onboard (Tahap 5: Penutupan & Cetak)',
      ismRef: 'ISM Code Klausul 11 & 12.6',
      roleTitle: 'Penerimaan Hasil Akhir & Arsip Sertifikat Kapal',
      description: 'Nakhoda menghadiri Closing Meeting, menandatangani lembar penutupan laporan audit, menerima status kelaiklautan (Fit-to-Sail), dan mengarsipkan berkas di anjungan.',
      actions: [
        'Menghadiri Closing Meeting penutupan audit bersama auditor dan DPA.',
        'Menandatangani lembar penerimaan laporan audit eksekutif.',
        'Menyimpan salinan checklist BKI dan formulir NCR Closeout di file Safety Management Onboard.',
        'Memastikan kapal mengantongi status Fit-to-Sail sebelum berlayar (Port Clearance).'
      ],
      output: 'Berkas audit resmi tersimpan di anjungan & kapal siap berlayar secara aman dan patuh hukum.'
    }
  ];

  const raciMatrix = [
    {
      phase: 'Tahap 1: Sesi & Tim',
      task: 'Penetapan Jadwal & Tim Auditor',
      dpa: 'Accountable (Pengambil Keputusan Utama)',
      nakhoda: 'Informed & Consulted (Menerima Jadwal)',
      regulation: 'ISM Code 4 & 12.1'
    },
    {
      phase: 'Tahap 1: Sesi & Tim',
      task: 'Opening Meeting di Kapal',
      dpa: 'Consulted (Darat)',
      nakhoda: 'Responsible (Tuan Rumah & Auditee Onboard)',
      regulation: 'BKI SMC Guidance'
    },
    {
      phase: 'Tahap 2: Checklist Klausul',
      task: 'Pemeriksaan 74 Klausul SMC',
      dpa: 'Accountable (Pengawas Kepatuhan)',
      nakhoda: 'Responsible (Pendamping Lapangan Onboard)',
      regulation: 'ISM Code 12.2'
    },
    {
      phase: 'Tahap 3: Temuan NC',
      task: 'Penerbitan & Klasifikasi NCR',
      dpa: 'Accountable (Penetapan Kategori & Due Date)',
      nakhoda: 'Informed (Tanda Tangan Pengakuan)',
      regulation: 'ISM Code 9.1'
    },
    {
      phase: 'Tahap 4: Bukti & CAPA',
      task: 'Tindakan Koreksi & Foto Eviden',
      dpa: 'Consulted (Memberikan Arahan)',
      nakhoda: 'Responsible (Eksekusi Fisik di Kapal)',
      regulation: 'ISM Code 9.2'
    },
    {
      phase: 'Tahap 4: Bukti & CAPA',
      task: 'Verifikasi & Penutupan NC (Closeout)',
      dpa: 'Responsible & Accountable (Otorisasi DPA)',
      nakhoda: 'Informed (Menerima Pengesahan Tutup)',
      regulation: 'ISM Code 12.5'
    },
    {
      phase: 'Tahap 5: Penutupan & Cetak',
      task: 'Deklarasi Fit to Sail & Finalisasi Sesi',
      dpa: 'Responsible & Accountable (Tanda Tangan DPA)',
      nakhoda: 'Informed (Menerima Izin Layar)',
      regulation: 'ISM Code 12.6'
    },
    {
      phase: 'Tahap 5: Penutupan & Cetak',
      task: 'Pencetakan & Pengarsipan Berkas Onboard',
      dpa: 'Accountable (Penerbitan 3 PDF Resmi)',
      nakhoda: 'Responsible (Simpan di Anjungan Kapal)',
      regulation: 'ISM Code 11'
    }
  ];

  return (
    <div className="modal-overlay" style={{ zIndex: 12500, padding: '1rem', overflowY: 'auto' }}>
      <div
        className="modal-dialog"
        style={{
          maxWidth: '1000px',
          width: '100%',
          margin: '1.5rem auto',
          background: 'var(--bg-surface)',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          overflow: 'hidden'
        }}
      >
        {/* Header Modal */}
        <div
          style={{
            padding: '1rem 1.5rem',
            background: 'linear-gradient(135deg, var(--bg-surface-elevated) 0%, var(--bg-surface) 100%)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
              }}
            >
              <Compass size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Alur Kerja Interaktif: DPA (Darat) & Nakhoda (Kapal)</span>
                <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>Standar ISM Code & BKI</span>
              </h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                Panduan komprehensif alur kolaborasi, pembagian peran, dan serah-terima kewenangan dalam audit keselamatan maritim.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.4rem', borderRadius: '8px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            padding: '0.65rem 1.5rem',
            background: 'var(--bg-input)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.65rem'
          }}
        >
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setActiveTab('dpa')}
              className={`tab-btn ${activeTab === 'dpa' ? 'active' : ''}`}
              style={{
                padding: '0.45rem 0.95rem',
                fontSize: '0.8rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: activeTab === 'dpa' ? 800 : 600,
                color: activeTab === 'dpa' ? '#ffffff' : 'var(--text-main)',
                background: activeTab === 'dpa' ? '#0284c7' : 'transparent',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Building2 size={15} />
              <span>1. Alur Kerja DPA (Kantor Darat)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('nakhoda')}
              className={`tab-btn ${activeTab === 'nakhoda' ? 'active' : ''}`}
              style={{
                padding: '0.45rem 0.95rem',
                fontSize: '0.8rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: activeTab === 'nakhoda' ? 800 : 600,
                color: activeTab === 'nakhoda' ? '#ffffff' : 'var(--text-main)',
                background: activeTab === 'nakhoda' ? '#10b981' : 'transparent',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Ship size={15} />
              <span>2. Alur Kerja Nakhoda (Onboard Kapal)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('matrix')}
              className={`tab-btn ${activeTab === 'matrix' ? 'active' : ''}`}
              style={{
                padding: '0.45rem 0.95rem',
                fontSize: '0.8rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: activeTab === 'matrix' ? 800 : 600,
                color: activeTab === 'matrix' ? '#ffffff' : 'var(--text-main)',
                background: activeTab === 'matrix' ? '#6366f1' : 'transparent',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <CheckSquare size={15} />
              <span>3. Matriks Tanggung Jawab (RACI)</span>
            </button>
          </div>

          {/* Quick Perspective Apply Button */}
          {onSelectPerspective && (
            <button
              type="button"
              onClick={() => {
                onSelectPerspective(activeTab === 'matrix' ? 'dpa' : activeTab);
                onClose();
              }}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <span>Aktifkan Sudut Pandang {activeTab === 'nakhoda' ? 'Nakhoda' : 'DPA'}</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* TAB 1: ALUR DPA (KANTOR DARAT) */}
          {activeTab === 'dpa' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  padding: '0.85rem 1.15rem',
                  borderRadius: '10px',
                  background: 'rgba(2, 132, 199, 0.08)',
                  border: '1px solid rgba(2, 132, 199, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem'
                }}
              >
                <div style={{ padding: '0.5rem', borderRadius: '8px', background: '#0284c7', color: '#fff' }}>
                  <Building2 size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0284c7', margin: 0 }}>
                    Mandat DPA sesuai ISM Code Klausul 4:
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', margin: '0.2rem 0 0 0' }}>
                    DPA menghubungkan manajemen puncak darat dengan kapal, bertanggung jawab memantau operasional keselamatan, memastikan alokasi sumber daya memadai, memverifikasi CAPA perbaikan, dan mendeklarasikan kelaiklautan kapal.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {dpaSteps.map(step => (
                  <div
                    key={step.step}
                    className="glass-card"
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: '#0284c7',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 900
                          }}
                        >
                          {step.step}
                        </span>
                        <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>{step.title}</strong>
                      </div>
                      <span className="badge badge-info" style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                        {step.ismRef}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0', lineHeight: 1.4 }}>
                      {step.description}
                    </p>

                    <div style={{ background: 'var(--bg-surface-elevated)', borderRadius: '8px', padding: '0.65rem 0.85rem', marginTop: '0.35rem' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        Daftar Aksi DPA di Sistem:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.76rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                        {step.actions.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#0284c7', fontWeight: 700, marginTop: '0.2rem' }}>
                      <CheckCircle2 size={13} />
                      <span>Hasil / Output Dokumen: {step.output}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ALUR NAKHODA (ONBOARD KAPAL) */}
          {activeTab === 'nakhoda' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  padding: '0.85rem 1.15rem',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem'
                }}
              >
                <div style={{ padding: '0.5rem', borderRadius: '8px', background: '#10b981', color: '#fff' }}>
                  <Ship size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#10b981', margin: 0 }}>
                    Mandat Nakhoda sesuai ISM Code Klausul 5:
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', margin: '0.2rem 0 0 0' }}>
                    Nakhoda memegang kewenangan mutlak (*overriding authority*) di kapal untuk keselamatan jiwa dan perlindungan lingkungan maritim. Selaku Auditee, Nakhoda memimpin perbaikan fisik onboard dan melaporkan eviden ke DPA.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {nakhodaSteps.map(step => (
                  <div
                    key={step.step}
                    className="glass-card"
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: '#10b981',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 900
                          }}
                        >
                          {step.step}
                        </span>
                        <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>{step.title}</strong>
                      </div>
                      <span className="badge badge-success" style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                        {step.ismRef}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0', lineHeight: 1.4 }}>
                      {step.description}
                    </p>

                    <div style={{ background: 'var(--bg-surface-elevated)', borderRadius: '8px', padding: '0.65rem 0.85rem', marginTop: '0.35rem' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        Daftar Aksi Nakhoda di Kapal:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.76rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                        {step.actions.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#10b981', fontWeight: 700, marginTop: '0.2rem' }}>
                      <CheckCircle2 size={13} />
                      <span>Hasil / Output Dokumen: {step.output}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RACI MATRIX */}
          {activeTab === 'matrix' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Matriks RACI menggambarkan pembagian tanggung jawab antara <strong>DPA (Darat)</strong> dan <strong>Nakhoda (Kapal)</strong> pada setiap fase audit maritim:
                <br />
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>R = Responsible (Pelaksana) | A = Accountable (Pengambil Keputusan) | C = Consulted (Penasihat) | I = Informed (Penerima Laporan)</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }} className="table-hover">
                  <thead>
                    <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '2px solid var(--border-subtle)' }}>
                      <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 800 }}>Tahap Siklus</th>
                      <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 800 }}>Aktivitas Kunci</th>
                      <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 800, color: '#0284c7' }}>🏢 DPA (Kantor Darat)</th>
                      <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 800, color: '#10b981' }}>🚢 Nakhoda (Kapal)</th>
                      <th style={{ padding: '0.65rem 0.85rem', textAlign: 'center', fontWeight: 800 }}>Regulasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {raciMatrix.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                        <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700 }}>{row.phase}</td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>{row.task}</td>
                        <td style={{ padding: '0.65rem 0.85rem', color: '#0369a1', fontWeight: 600 }}>{row.dpa}</td>
                        <td style={{ padding: '0.65rem 0.85rem', color: '#047857', fontWeight: 600 }}>{row.nakhoda}</td>
                        <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center' }}>
                          <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>{row.regulation}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '0.85rem 1.5rem',
            background: 'var(--bg-surface-elevated)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Standar Acuan: <strong>BKI F23.14.06-2024 Rev 05 & IMO ISM Code Resolution A.741(18)</strong>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ fontWeight: 700 }}
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
