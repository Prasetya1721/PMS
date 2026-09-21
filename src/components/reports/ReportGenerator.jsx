import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { BaharimasEmblem } from '../common/BaharimasLogo';
import {
  Printer,
  Download,
  FileCheck,
  Wrench,
  DollarSign,
  Package
} from 'lucide-react';

export const ReportGenerator = () => {
  const {
    vessels,
    workOrders,
    equipment,
    crewCertificates,
    shipDocuments,
    costs,
    spareparts,
    showToast
  } = usePMS();

  const [reportType, setReportType] = useState('maintenance');

  // CSV Generator Helper
  const downloadCSV = (filename, headers, rows) => {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Laporan ${filename} berhasil diunduh!`, 'success');
  };

  const handleExportCSV = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    if (reportType === 'maintenance') {
      const headers = ['ID Work Order', 'Kapal', 'Judul Pekerjaan', 'Kategori', 'Prioritas', 'Teknisi', 'Jam Target', 'Status'];
      const rows = workOrders.map(w => [
        w.id,
        vessels.find(v => v.id === w.vesselId)?.name || '-',
        w.title,
        w.category,
        w.priority,
        w.assignedTo,
        w.targetHours || w.dueDate,
        w.status
      ]);
      downloadCSV(`PMS_WorkOrders_${dateStr}.csv`, headers, rows);
    } else if (reportType === 'documents') {
      const headers = ['ID Dokumen', 'Kategori', 'Nama Dokumen', 'Kapal / Kru', 'Nomor Dokumen', 'Penerbit', 'Tanggal Terbit', 'Tanggal Expired', 'Status'];
      const rows = [
        ...shipDocuments.map(d => [
          d.id, 'Surat Kapal', d.name, vessels.find(v => v.id === d.vesselId)?.name || '-', d.documentNo, d.issuer, d.issueDate, d.expiryDate, d.status
        ]),
        ...crewCertificates.map(c => [
          c.id, 'Sertifikat Kru', c.name, `${c.crewName} (${vessels.find(v => v.id === c.vesselId)?.name || '-'})`, c.certificateNo, c.issuer, c.issueDate, c.expiryDate, c.status
        ])
      ];
      downloadCSV(`PMS_Dokumen_Sertifikat_${dateStr}.csv`, headers, rows);
    } else if (reportType === 'costs') {
      const headers = ['ID Biaya', 'Kapal', 'Periode', 'Kategori', 'Deskripsi', 'Vendor', 'Realisasi Aktual (IDR)', 'Anggaran (IDR)'];
      const rows = costs.map(c => [
        c.id,
        vessels.find(v => v.id === c.vesselId)?.name || '-',
        c.period,
        c.category,
        c.description,
        c.vendor,
        c.amount,
        c.budgetAllocated
      ]);
      downloadCSV(`PMS_Biaya_Perawatan_${dateStr}.csv`, headers, rows);
    } else if (reportType === 'spareparts') {
      const headers = ['Kode Part', 'Nama Part', 'Kapal', 'Equipment', 'Lokasi Rak', 'Stok Aktual', 'Batas Min', 'Status', 'Harga Satuan (IDR)'];
      const rows = spareparts.map(s => [
        s.code,
        s.name,
        vessels.find(v => v.id === s.vesselId)?.name || '-',
        s.equipmentCode,
        s.location,
        s.stockQty,
        s.minStockQty,
        s.status,
        s.unitCost
      ]);
      downloadCSV(`PMS_Inventaris_Sparepart_${dateStr}.csv`, headers, rows);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Pusat Laporan & Ekspor Data Armada</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Hasilkan ringkasan cetak (PDF Ready) dan ekspor lembar kerja CSV/Excel untuk kebutuhan audit kelaiklautan & pelaporan manajemen
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handlePrint} className="btn btn-secondary">
            <Printer size={16} />
            <span>Cetak Dokumen (Print / PDF)</span>
          </button>
          <button onClick={handleExportCSV} className="btn btn-primary">
            <Download size={16} />
            <span>Unduh File CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Cards */}
      <div className="grid-cols-4">
        {[
          { id: 'maintenance', title: 'Laporan Planned Maintenance', icon: Wrench, desc: 'Rekap work order, jam kerja, kepatuhan teknisi' },
          { id: 'documents', title: 'Laporan Dokumen & Sertifikat', icon: FileCheck, desc: 'Radar masa berlaku surat kapal & STCW kru' },
          { id: 'costs', title: 'Laporan Biaya & Anggaran', icon: DollarSign, desc: 'Analisis variance budget vs actual pengeluaran' },
          { id: 'spareparts', title: 'Laporan Inventaris Suku Cadang', icon: Package, desc: 'Stok kritis, lokasi penyimpanan, kebutuhan PO' }
        ].map(item => {
          const Icon = item.icon;
          const isSelected = reportType === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setReportType(item.id)}
              className="glass-card glass-card-interactive"
              style={{
                padding: '1.25rem',
                border: isSelected ? '2px solid #0284c7' : '1px solid var(--border-subtle)',
                background: isSelected ? 'rgba(2, 132, 199, 0.15)' : 'var(--bg-surface-card)'
              }}
            >
              <div style={{ padding: '0.6rem', borderRadius: '8px', background: isSelected ? '#0284c7' : 'var(--bg-surface-elevated)', color: '#fff', width: 'fit-content', marginBottom: '0.75rem' }}>
                <Icon size={20} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: isSelected ? '#38bdf8' : '#fff' }}>{item.title}</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Printable Report Sheet (A4 Standar Maritim Internasional) */}
      <div
        className="glass-card fleet-report-print-sheet maritime-print-sheet"
        style={{
          padding: '2.5rem 2rem',
          background: '#ffffff',
          color: '#0f172a',
          fontFamily: '"Segoe UI", Arial, sans-serif'
        }}
      >
        {/* 1. KOP SURAT RESMI PERUSAHAAN PELAYARAN */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          borderBottom: '3px double #0f172a',
          paddingBottom: '0.85rem',
          marginBottom: '1.25rem'
        }}>
          <BaharimasEmblem size={56} />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              PT. PELAYARAN BAHARIMAS KALIMANTAN
            </h2>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0369a1', margin: '2px 0 0 0', textTransform: 'uppercase' }}>
              FLEET OPERATIONS, LOGISTICS & MARINE ENGINEERING DIRECTORATE
            </p>
            <p style={{ fontSize: '0.72rem', color: '#475569', margin: '2px 0 0 0' }}>
              Jl. Rahadi Usman No. 88, Pontianak, Kalimantan Barat 78111 • Telp: (0561) 741234 • Email: management@baharimas.co.id
            </p>
            <p style={{ fontSize: '0.68rem', color: '#64748b', margin: '1px 0 0 0' }}>
              SIUPAL: B.XX-248/AL.001/DJPL • Sistem Manajemen Mutu Terverifikasi ISO 9001:2015 & IMO ISM Code
            </p>
          </div>
          <div style={{ textAlign: 'right', borderLeft: '1px solid #cbd5e1', paddingLeft: '1.25rem' }}>
            <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>KODE DOKUMEN RESMI</span>
            <strong style={{ fontSize: '0.85rem', color: '#0f172a', fontFamily: 'monospace' }}>FORM-REP-EXEC/REV.02</strong>
            <span style={{ fontSize: '0.68rem', color: '#0284c7', display: 'block', marginTop: '3px', fontWeight: 700 }}>
              EXECUTIVE REPORT
            </span>
          </div>
        </div>

        {/* 2. JUDUL DOKUMEN & METADATA */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: 900,
            color: '#0f172a',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            textDecoration: 'underline'
          }}>
            {reportType === 'maintenance' && 'LAPORAN REKAPITULASI PLANNED MAINTENANCE SYSTEM (PMS) ARMADA'}
            {reportType === 'documents' && 'LAPORAN MONITORING KELAIKLAUTAN SERTIFIKAT KAPAL & AWAK'}
            {reportType === 'costs' && 'LAPORAN REALISASI BIAYA PERAWATAN & PENGELUARAN ARMADA'}
            {reportType === 'spareparts' && 'LAPORAN INVENTARIS SUKU CADANG & PERSEDIAAN MINIMUM ARMADA'}
          </h3>
          <p style={{ fontSize: '0.82rem', fontStyle: 'italic', color: '#64748b', margin: '2px 0 0 0' }}>
            {reportType === 'maintenance' && '(FLEET SCHEDULED MAINTENANCE & WORK ORDER SUMMARY REPORT)'}
            {reportType === 'documents' && '(VESSEL STATUTORY CERTIFICATES & CREW STCW COMPLIANCE AUDIT)'}
            {reportType === 'costs' && '(VESSEL MAINTENANCE OPEX & SPARE PARTS COST REALIZATION REPORT)'}
            {reportType === 'spareparts' && '(FLEET SPARE PARTS INVENTORY & CRITICAL STOCK LEVEL REPORT)'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '6px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0369a1', fontFamily: 'monospace' }}>
              NOMOR LAPORAN: REP-PBK/{reportType.toUpperCase()}/{new Date().getFullYear()}/{String(new Date().getMonth() + 1).padStart(2, '0')}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>•</span>
            <span style={{ fontSize: '0.8rem', color: '#475569' }}>
              Tanggal Cetak: <strong>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
            </span>
          </div>
        </div>

        {/* 3. KPI RINGKASAN EKSEKUTIF */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.75rem',
          marginBottom: '1.25rem',
          textAlign: 'center'
        }}>
          <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.6rem', background: '#f8fafc' }}>
            <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Total Data Rekap</span>
            <strong style={{ fontSize: '1.1rem', color: '#0f172a', fontFamily: 'monospace' }}>
              {reportType === 'maintenance' && `${workOrders.length} Work Orders`}
              {reportType === 'documents' && `${shipDocuments.length + crewCertificates.length} Dokumen`}
              {reportType === 'costs' && `${costs.length} Transaksi`}
              {reportType === 'spareparts' && `${spareparts.length} Item Part`}
            </strong>
          </div>

          <div style={{ border: '1px solid #86efac', borderRadius: '6px', padding: '0.6rem', background: '#f0fdf4' }}>
            <span style={{ fontSize: '0.68rem', color: '#16a34a', display: 'block' }}>
              {reportType === 'maintenance' && 'WO Selesai (Completed)'}
              {reportType === 'documents' && 'Sertifikat Aktif (Valid)'}
              {reportType === 'costs' && 'Total Realisasi (IDR)'}
              {reportType === 'spareparts' && 'Stok Normal / Aman'}
            </span>
            <strong style={{ fontSize: '1.1rem', color: '#15803d', fontFamily: 'monospace' }}>
              {reportType === 'maintenance' && `${workOrders.filter(w => w.status === 'Completed').length} Selesai`}
              {reportType === 'documents' && `${[...shipDocuments, ...crewCertificates].filter(d => d.status === 'Valid').length} Aktif`}
              {reportType === 'costs' && new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(costs.reduce((sum, c) => sum + (c.amount || 0), 0))}
              {reportType === 'spareparts' && `${spareparts.filter(s => s.status === 'Normal').length} Item`}
            </strong>
          </div>

          <div style={{ border: '1px solid #fca5a5', borderRadius: '6px', padding: '0.6rem', background: '#fef2f2' }}>
            <span style={{ fontSize: '0.68rem', color: '#dc2626', display: 'block' }}>
              {reportType === 'maintenance' && 'WO Kritis / Overdue'}
              {reportType === 'documents' && 'Expired / Perlu Perpanjang'}
              {reportType === 'costs' && 'Anggaran Terpasang (IDR)'}
              {reportType === 'spareparts' && 'Stok Kritis / Kurang'}
            </span>
            <strong style={{ fontSize: '1.1rem', color: '#b91c1c', fontFamily: 'monospace' }}>
              {reportType === 'maintenance' && `${workOrders.filter(w => w.priority === 'Kritis' || w.status === 'Overdue').length} Item`}
              {reportType === 'documents' && `${[...shipDocuments, ...crewCertificates].filter(d => d.status === 'Expired' || d.status === 'Due Soon').length} Dokumen`}
              {reportType === 'costs' && new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(costs.reduce((sum, c) => sum + (c.budgetAllocated || 0), 0))}
              {reportType === 'spareparts' && `${spareparts.filter(s => s.status !== 'Normal').length} Item`}
            </strong>
          </div>

          <div style={{ border: '1px solid #7dd3fc', borderRadius: '6px', padding: '0.6rem', background: '#f0f9ff' }}>
            <span style={{ fontSize: '0.68rem', color: '#0284c7', display: 'block' }}>Cakupan Armada</span>
            <strong style={{ fontSize: '1.1rem', color: '#0369a1' }}>
              {vessels.length} Kapal Aktif
            </strong>
          </div>
        </div>

        {/* 4. TABEL DATA RESMI */}
        <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', border: '1px solid #0f172a' }}>
            <thead>
              <tr style={{ background: '#e2e8f0', color: '#0f172a', borderBottom: '1.5px solid #0f172a' }}>
                {reportType === 'maintenance' && (
                  <>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '110px' }}>NO. WO</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 10px', textAlign: 'left' }}>ARMADA KAPAL</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 10px', textAlign: 'left' }}>URAIAN PEKERJAAN</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '90px', textAlign: 'center' }}>PRIORITAS</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 10px', textAlign: 'left' }}>TEKNISI / PIC</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '100px', textAlign: 'center' }}>STATUS</th>
                  </>
                )}
                {reportType === 'documents' && (
                  <>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '100px' }}>KATEGORI</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 10px', textAlign: 'left' }}>NAMA DOKUMEN / SERTIFIKAT</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 10px', textAlign: 'left' }}>KAPAL / PEMEGANG</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 10px', textAlign: 'left' }}>NOMOR DOKUMEN</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '100px', textAlign: 'center' }}>JATUH TEMPO</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '90px', textAlign: 'center' }}>STATUS</th>
                  </>
                )}
                {reportType === 'costs' && (
                  <>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '80px' }}>ID</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 10px', textAlign: 'left' }}>ARMADA KAPAL</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 10px', textAlign: 'left' }}>KATEGORI BIAYA</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 10px', textAlign: 'left' }}>DESKRIPSI PENGELUARAN</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 10px', width: '130px', textAlign: 'right' }}>REALISASI AKTUAL</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 10px', width: '130px', textAlign: 'right' }}>ANGGARAN</th>
                  </>
                )}
                {reportType === 'spareparts' && (
                  <>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '90px' }}>KODE PART</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 10px', textAlign: 'left' }}>NAMA SUKU CADANG</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 10px', textAlign: 'left' }}>LOKASI KAPAL</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '110px', textAlign: 'center' }}>STOK / MINIMUM</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '90px', textAlign: 'center' }}>STATUS</th>
                    <th style={{ border: '1px solid #0f172a', padding: '6px 10px', width: '130px', textAlign: 'right' }}>ESTIMASI NILAI</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {reportType === 'maintenance' && workOrders.map(wo => (
                <tr key={wo.id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', fontWeight: 700, fontFamily: 'monospace' }}>{wo.id}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 10px' }}>{vessels.find(v => v.id === wo.vesselId)?.name || '-'}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 10px', fontWeight: 600 }}>{wo.title}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', textAlign: 'center' }}>{wo.priority}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 10px' }}>{wo.assignedTo}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', textAlign: 'center', fontWeight: 700 }}>{wo.status}</td>
                </tr>
              ))}

              {reportType === 'documents' && [
                ...shipDocuments.map(d => ({ ...d, cat: 'Surat Kapal', holder: vessels.find(v => v.id === d.vesselId)?.name })),
                ...crewCertificates.map(c => ({ ...c, cat: 'Sertifikat Kru', holder: c.crewName }))
              ].map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{item.cat}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 10px', fontWeight: 600 }}>{item.name}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 10px' }}>{item.holder}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 10px', fontFamily: 'monospace' }}>{item.certificateNo || item.documentNo}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', textAlign: 'center', fontWeight: 700, fontFamily: 'monospace' }}>{item.expiryDate}</td>
                  <td style={{
                    border: '1px solid #cbd5e1',
                    padding: '6px 8px',
                    textAlign: 'center',
                    fontWeight: 700,
                    color: item.status === 'Expired' ? '#b91c1c' : item.status === 'Due Soon' ? '#b45309' : '#15803d'
                  }}>
                    {item.status}
                  </td>
                </tr>
              ))}

              {reportType === 'costs' && costs.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', fontFamily: 'monospace' }}>{c.id}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 10px', fontWeight: 600 }}>{vessels.find(v => v.id === c.vesselId)?.name || '-'}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 10px' }}>{c.category}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 10px' }}>{c.description}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 10px', textAlign: 'right', fontWeight: 700, color: '#15803d', fontFamily: 'monospace' }}>
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(c.amount)}
                  </td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 10px', textAlign: 'right', color: '#64748b', fontFamily: 'monospace' }}>
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(c.budgetAllocated)}
                  </td>
                </tr>
              ))}

              {reportType === 'spareparts' && spareparts.map(sp => (
                <tr key={sp.id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', fontWeight: 700, fontFamily: 'monospace' }}>{sp.code}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 10px' }}>{sp.name}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 10px' }}>{vessels.find(v => v.id === sp.vesselId)?.name || 'Gudang Pusat'}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', textAlign: 'center', fontWeight: 700 }}>{sp.stockQty} / {sp.minStockQty} {sp.unit}</td>
                  <td style={{
                    border: '1px solid #cbd5e1',
                    padding: '6px 8px',
                    textAlign: 'center',
                    fontWeight: 700,
                    color: sp.status === 'Normal' ? '#15803d' : '#b91c1c'
                  }}>
                    {sp.status}
                  </td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 10px', textAlign: 'right', fontFamily: 'monospace' }}>
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(sp.unitCost * sp.stockQty)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5. TANDA TANGAN 3 PIHAK EKSEKUTIF MARITIM RESMI */}
        <div style={{
          marginTop: '2rem',
          borderTop: '1.5px solid #0f172a',
          paddingTop: '1.25rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          textAlign: 'center',
          fontSize: '0.78rem',
          pageBreakInside: 'avoid'
        }}>
          <div>
            <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>Dibuat & Dihimpun Oleh:</p>
            <p style={{ fontWeight: 700, margin: 0, color: '#0f172a' }}>Admin PMS Kapal & Logistik</p>
            <div style={{ height: '55px' }} />
            <p style={{ fontWeight: 800, textDecoration: 'underline', margin: 0, color: '#0f172a' }}>Dian Anggraini, S.Kom</p>
            <p style={{ fontSize: '0.7rem', color: '#64748b', margin: '2px 0 0 0' }}>Marine Logistics & Technical Admin</p>
          </div>

          <div>
            <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>Diperiksa & Diverifikasi:</p>
            <p style={{ fontWeight: 700, margin: 0, color: '#0f172a' }}>Marine Superintendent / DPA</p>
            <div style={{ height: '55px' }} />
            <p style={{ fontWeight: 800, textDecoration: 'underline', margin: 0, color: '#0f172a' }}>Ir. Heri Prasetyo</p>
            <p style={{ fontSize: '0.7rem', color: '#64748b', margin: '2px 0 0 0' }}>Head of Fleet Maintenance</p>
          </div>

          <div>
            <p style={{ color: '#64748b', margin: '0 0 4px 0' }}>Disetujui Oleh:</p>
            <p style={{ fontWeight: 700, margin: 0, color: '#0f172a' }}>General Manager Armada</p>
            <div style={{ height: '55px' }} />
            <p style={{ fontWeight: 800, textDecoration: 'underline', margin: 0, color: '#0f172a' }}>H. Prasetya Kalimantan, M.M.</p>
            <p style={{ fontSize: '0.7rem', color: '#64748b', margin: '2px 0 0 0' }}>Director of Marine Operations</p>
          </div>
        </div>

        {/* 6. FOOTER RESMI */}
        <div style={{
          marginTop: '1.25rem',
          borderTop: '1px dashed #cbd5e1',
          paddingTop: '0.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.68rem',
          color: '#64748b'
        }}>
          <span>Dicetak melalui: Sistem PMS Kapal Baharimas Terintegrasi</span>
          <span>Sertifikasi: ISO 9001:2015 & IMO ISM Code DOC-04/2026</span>
          <span>Dokumen Resmi Perusahaan</span>
        </div>
      </div>
    </div>
  );
};
