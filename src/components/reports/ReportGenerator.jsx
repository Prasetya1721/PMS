import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  FileSpreadsheet,
  Printer,
  Download,
  FileCheck,
  Wrench,
  DollarSign,
  Package,
  Calendar,
  CheckCircle
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

      {/* Printable Report Preview */}
      <div className="glass-card" style={{ padding: '2rem', background: '#ffffff', color: '#0f172a' }}>
        {/* Printable Header */}
        <div style={{ borderBottom: '2px solid #0284c7', paddingBottom: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PT PELAYARAN NASIONAL NUSANTARA (PERSERO)
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.2rem', color: '#0f172a' }}>
              {reportType === 'maintenance' && 'LAPORAN REKAPITULASI PLANNED MAINTENANCE SYSTEM (PMS)'}
              {reportType === 'documents' && 'LAPORAN KELAIKLAUTAN SERTIFIKAT KRU & SURAT KAPAL'}
              {reportType === 'costs' && 'LAPORAN REALISASI BIAYA PERAWATAN & SUKU CADANG ARMADA'}
              {reportType === 'spareparts' && 'LAPORAN INVENTARIS SUKU CADANG & MINIMUM STOCK ALERT'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Divisi Operasional & Marine Engineering • Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ padding: '0.35rem 0.75rem', borderRadius: '4px', background: '#e0f2fe', color: '#0369a1', fontWeight: 700, fontSize: '0.8rem' }}>
              DOKUMEN RESMI INTERNAL
            </span>
          </div>
        </div>

        {/* Dynamic Table Preview */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                {reportType === 'maintenance' && (
                  <>
                    <th style={{ padding: '0.65rem' }}>No. WO</th>
                    <th style={{ padding: '0.65rem' }}>Kapal</th>
                    <th style={{ padding: '0.65rem' }}>Pekerjaan</th>
                    <th style={{ padding: '0.65rem' }}>Prioritas</th>
                    <th style={{ padding: '0.65rem' }}>Teknisi</th>
                    <th style={{ padding: '0.65rem' }}>Status</th>
                  </>
                )}
                {reportType === 'documents' && (
                  <>
                    <th style={{ padding: '0.65rem' }}>Jenis</th>
                    <th style={{ padding: '0.65rem' }}>Nama Dokumen / Sertifikat</th>
                    <th style={{ padding: '0.65rem' }}>Pemilik / Kapal</th>
                    <th style={{ padding: '0.65rem' }}>No. Dokumen</th>
                    <th style={{ padding: '0.65rem' }}>Jatuh Tempo</th>
                    <th style={{ padding: '0.65rem' }}>Status</th>
                  </>
                )}
                {reportType === 'costs' && (
                  <>
                    <th style={{ padding: '0.65rem' }}>ID</th>
                    <th style={{ padding: '0.65rem' }}>Kapal</th>
                    <th style={{ padding: '0.65rem' }}>Kategori</th>
                    <th style={{ padding: '0.65rem' }}>Deskripsi</th>
                    <th style={{ padding: '0.65rem' }}>Realisasi Biaya</th>
                    <th style={{ padding: '0.65rem' }}>Anggaran</th>
                  </>
                )}
                {reportType === 'spareparts' && (
                  <>
                    <th style={{ padding: '0.65rem' }}>Kode Part</th>
                    <th style={{ padding: '0.65rem' }}>Nama Part</th>
                    <th style={{ padding: '0.65rem' }}>Kapal</th>
                    <th style={{ padding: '0.65rem' }}>Stok / Min</th>
                    <th style={{ padding: '0.65rem' }}>Status</th>
                    <th style={{ padding: '0.65rem' }}>Estimasi Nilai</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {reportType === 'maintenance' && workOrders.map(wo => (
                <tr key={wo.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.65rem', fontWeight: 700 }}>{wo.id}</td>
                  <td style={{ padding: '0.65rem' }}>{vessels.find(v => v.id === wo.vesselId)?.name}</td>
                  <td style={{ padding: '0.65rem' }}>{wo.title}</td>
                  <td style={{ padding: '0.65rem' }}>{wo.priority}</td>
                  <td style={{ padding: '0.65rem' }}>{wo.assignedTo}</td>
                  <td style={{ padding: '0.65rem', fontWeight: 600 }}>{wo.status}</td>
                </tr>
              ))}

              {reportType === 'documents' && [
                ...shipDocuments.map(d => ({ ...d, cat: 'Surat Kapal', holder: vessels.find(v => v.id === d.vesselId)?.name })),
                ...crewCertificates.map(c => ({ ...c, cat: 'Sertifikat Kru', holder: c.crewName }))
              ].map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.65rem' }}>{item.cat}</td>
                  <td style={{ padding: '0.65rem', fontWeight: 600 }}>{item.name}</td>
                  <td style={{ padding: '0.65rem' }}>{item.holder}</td>
                  <td style={{ padding: '0.65rem' }}>{item.certificateNo || item.documentNo}</td>
                  <td style={{ padding: '0.65rem', fontWeight: 700 }}>{item.expiryDate}</td>
                  <td style={{ padding: '0.65rem', fontWeight: 700, color: item.status === 'Expired' ? '#ef4444' : item.status === 'Due Soon' ? '#f59e0b' : '#10b981' }}>
                    {item.status}
                  </td>
                </tr>
              ))}

              {reportType === 'costs' && costs.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.65rem' }}>{c.id}</td>
                  <td style={{ padding: '0.65rem', fontWeight: 600 }}>{vessels.find(v => v.id === c.vesselId)?.name}</td>
                  <td style={{ padding: '0.65rem' }}>{c.category}</td>
                  <td style={{ padding: '0.65rem' }}>{c.description}</td>
                  <td style={{ padding: '0.65rem', fontWeight: 700, color: '#059669' }}>
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(c.amount)}
                  </td>
                  <td style={{ padding: '0.65rem', color: '#64748b' }}>
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(c.budgetAllocated)}
                  </td>
                </tr>
              ))}

              {reportType === 'spareparts' && spareparts.map(sp => (
                <tr key={sp.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.65rem', fontWeight: 700 }}>{sp.code}</td>
                  <td style={{ padding: '0.65rem' }}>{sp.name}</td>
                  <td style={{ padding: '0.65rem' }}>{vessels.find(v => v.id === sp.vesselId)?.name}</td>
                  <td style={{ padding: '0.65rem', fontWeight: 700 }}>{sp.stockQty} / {sp.minStockQty} {sp.unit}</td>
                  <td style={{ padding: '0.65rem', fontWeight: 700, color: sp.status === 'Normal' ? '#059669' : '#dc2626' }}>{sp.status}</td>
                  <td style={{ padding: '0.65rem' }}>
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(sp.unitCost * sp.stockQty)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signatures for Print */}
        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #cbd5e1', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', textAlign: 'center', fontSize: '0.8rem' }}>
          <div>
            <p style={{ color: '#64748b' }}>Dibuat Oleh:</p>
            <div style={{ height: '55px' }} />
            <p style={{ fontWeight: 700, textDecoration: 'underline' }}>Admin PMS Kapal</p>
            <p style={{ fontSize: '0.72rem', color: '#64748b' }}>Sistem Otomatis Terverifikasi</p>
          </div>
          <div>
            <p style={{ color: '#64748b' }}>Diperiksa Oleh:</p>
            <div style={{ height: '55px' }} />
            <p style={{ fontWeight: 700, textDecoration: 'underline' }}>Chief Engineer / Superintendent</p>
            <p style={{ fontSize: '0.72rem', color: '#64748b' }}>Divisi Teknik Armada</p>
          </div>
          <div>
            <p style={{ color: '#64748b' }}>Disetujui Oleh:</p>
            <div style={{ height: '55px' }} />
            <p style={{ fontWeight: 700, textDecoration: 'underline' }}>Fleet Manager</p>
            <p style={{ fontSize: '0.72rem', color: '#64748b' }}>Direktorat Operasi Maritim</p>
          </div>
        </div>
      </div>
    </div>
  );
};
