import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  FileCheck,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Send,
  Eye,
  Download,
  ShieldAlert,
  ShieldCheck,
  QrCode,
  X,
  CalendarPlus,
  Calendar
} from 'lucide-react';

export const DocumentTracker = () => {
  const {
    crewCertificates,
    shipDocuments,
    vessels,
    sendWhatsAppReminder,
    openGoogleCalendar,
    exportH30CalendarICS,
    h30ExpiringCount
  } = usePMS();

  const [docTypeTab, setDocTypeTab] = useState('all'); // 'all' | 'crew' | 'ship'
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'H-30' | 'Expired' | 'Due Soon' | 'Active'
  const [search, setSearch] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);

  // Combine items for unified table
  const allItems = [
    ...crewCertificates.map(c => ({ ...c, itemCategory: 'Sertifikat Kru' })),
    ...shipDocuments.map(d => ({ ...d, itemCategory: 'Surat Legal Kapal' }))
  ];

  const filteredItems = allItems.filter(item => {
    const matchType = docTypeTab === 'all' ||
      (docTypeTab === 'crew' && item.itemCategory === 'Sertifikat Kru') ||
      (docTypeTab === 'ship' && item.itemCategory === 'Surat Legal Kapal');

    let matchStatus = true;
    if (statusFilter === 'H-30') {
      matchStatus = item.daysUntilExpiry !== undefined && item.daysUntilExpiry <= 30;
    } else if (statusFilter !== 'ALL') {
      matchStatus = item.status === statusFilter;
    }

    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.certificateNo && item.certificateNo.toLowerCase().includes(search.toLowerCase())) ||
      (item.documentNo && item.documentNo.toLowerCase().includes(search.toLowerCase())) ||
      (item.crewName && item.crewName.toLowerCase().includes(search.toLowerCase())) ||
      item.issuer.toLowerCase().includes(search.toLowerCase());

    return matchType && matchStatus && matchSearch;
  });

  const expiredCount = allItems.filter(i => i.status === 'Expired').length;
  const dueSoonCount = allItems.filter(i => i.status === 'Due Soon').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            Pelacak Sertifikat Kru & Surat Kapal (Statutory Radar)
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Monitoring masa berlaku dokumen legal kapal dan sertifikasi kru STCW dengan sinkronisasi Google Calendar & WhatsApp
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={exportH30CalendarICS} className="btn btn-secondary btn-sm">
            <CalendarPlus size={14} />
            <span>Ekspor Semua H-30 (.ics)</span>
          </button>
          <span className="badge badge-warning" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
            <Calendar size={14} />
            <span>{h30ExpiringCount} Item Rentang 1 Bulan</span>
          </span>
          <span className="badge badge-danger-pulse" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
            <ShieldAlert size={14} />
            <span>{expiredCount} Expired</span>
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Doc Type Selector */}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={() => setDocTypeTab('all')}
              className={`btn btn-sm ${docTypeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Semua ({allItems.length})
            </button>
            <button
              onClick={() => setDocTypeTab('ship')}
              className={`btn btn-sm ${docTypeTab === 'ship' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Surat Legal Kapal ({shipDocuments.length})
            </button>
            <button
              onClick={() => setDocTypeTab('crew')}
              className={`btn btn-sm ${docTypeTab === 'crew' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Sertifikat Kru ({crewCertificates.length})
            </button>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'Semua Status' },
              { id: 'H-30', label: `Rentang 1 Bulan (H-30)`, badge: h30ExpiringCount },
              { id: 'Expired', label: 'Expired', badge: expiredCount },
              { id: 'Due Soon', label: 'Due Soon', badge: dueSoonCount },
              { id: 'Active', label: 'Active' }
            ].map(st => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`tab-btn ${statusFilter === st.id ? 'active' : ''}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>{st.label}</span>
                {st.badge !== undefined && (
                  <span className="badge badge-neutral" style={{ fontSize: '0.65rem', padding: '0.05rem 0.35rem' }}>
                    {st.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={15} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Cari sertifikat, nomor, nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-control"
              style={{ paddingLeft: '2.4rem', fontSize: '0.825rem' }}
            />
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div className="table-container">
          <table className="pms-table">
            <thead>
              <tr>
                <th>Kategori & Jenis</th>
                <th>Nama Dokumen / Sertifikat</th>
                <th>Pemilik / Kapal</th>
                <th>Nomor Dokumen</th>
                <th>Instansi Penerbit (Issuer)</th>
                <th>Jatuh Tempo (Expiry)</th>
                <th>Status Kelaikan</th>
                <th style={{ textAlign: 'right' }}>Aksi Reminder & Kalender</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => {
                const ship = vessels.find(v => v.id === item.vesselId);
                const docNo = item.certificateNo || item.documentNo;
                const isExpired = item.status === 'Expired' || (item.daysUntilExpiry !== undefined && item.daysUntilExpiry <= 0);
                const isH30 = item.daysUntilExpiry !== undefined && item.daysUntilExpiry > 0 && item.daysUntilExpiry <= 30;

                return (
                  <tr key={item.id} style={{ background: isExpired ? 'rgba(239, 68, 68, 0.04)' : isH30 ? 'rgba(245, 158, 11, 0.03)' : undefined }}>
                    <td>
                      <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                        {item.itemCategory}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '0.92rem' }}>{item.name}</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                        {item.type || item.category}
                      </div>
                    </td>
                    <td>
                      {item.crewName ? (
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.crewName}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{ship?.name}</div>
                        </div>
                      ) : (
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{ship?.name}</div>
                      )}
                    </td>
                    <td className="mono" style={{ fontSize: '0.78rem' }}>{docNo}</td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{item.issuer}</td>
                    <td>
                      <div className="mono" style={{ fontWeight: 700, fontSize: '0.85rem', color: isExpired ? '#ef4444' : isH30 ? '#f59e0b' : '#10b981' }}>
                        {item.expiryDate}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: isExpired ? '#ef4444' : isH30 ? '#f59e0b' : 'var(--text-subtle)', fontWeight: isH30 ? 600 : 400 }}>
                        {item.daysUntilExpiry > 0 ? `${item.daysUntilExpiry} hari lagi` : `LEWAT ${Math.abs(item.daysUntilExpiry)} HARI!`}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        isExpired ? 'badge-danger-pulse' :
                        isH30 ? 'badge-warning' :
                        item.status === 'Due Soon' ? 'badge-warning' : 'badge-success'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button
                          onClick={() => setPreviewDoc(item)}
                          className="btn btn-secondary btn-sm"
                          title="Lihat Scan Dokumen"
                          style={{ padding: '0.35rem 0.55rem' }}
                        >
                          <Eye size={13} />
                          <span>Scan</span>
                        </button>
                        <button
                          onClick={() => openGoogleCalendar(item)}
                          className="btn btn-secondary btn-sm"
                          title="Tambah Pengingat H-30 ke Google Calendar"
                          style={{ padding: '0.35rem 0.55rem', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}
                        >
                          <CalendarPlus size={13} />
                          <span>G-Cal</span>
                        </button>
                        <button
                          onClick={() => sendWhatsAppReminder(item, item.crewName ? 'crew_cert' : 'ship_doc')}
                          className="btn btn-whatsapp btn-sm"
                          title="Kirim Reminder WhatsApp Resmi"
                          style={{ padding: '0.35rem 0.55rem' }}
                        >
                          <Send size={13} />
                          <span>WA</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulated Document Scan Viewer Modal */}
      {previewDoc && (
        <div className="modal-overlay" onClick={() => setPreviewDoc(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FileCheck size={20} color="#10b981" />
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Dokumen Scan Sertifikat Resmi</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Verifikasi Digital Cloud PMS • ID: {previewDoc.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Certificate Canvas Mock */}
              <div style={{
                background: '#ffffff',
                color: '#0f172a',
                padding: '2rem',
                borderRadius: '8px',
                border: '4px double #cbd5e1',
                boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                position: 'relative'
              }}>
                <div style={{ textAlign: 'center', borderBottom: '2px solid #0284c7', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.1em', color: '#0369a1', textTransform: 'uppercase' }}>
                    REPUBLIK INDONESIA - KEMENTERIAN PERHUBUNGAN
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    DIREKTORAT JENDERAL PERHUBUNGAN LAUT / BIRO KLASIFIKASI INDONESIA
                  </div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.5rem', color: '#0f172a' }}>
                    {previewDoc.name}
                  </h4>
                  <div className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7' }}>
                    NO: {previewDoc.certificateNo || previewDoc.documentNo}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Diberikan Kepada:</span>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      {previewDoc.crewName || vessels.find(v => v.id === previewDoc.vesselId)?.name}
                    </p>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Instansi Penerbit:</span>
                    <p style={{ fontWeight: 600 }}>{previewDoc.issuer}</p>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Tanggal Terbit:</span>
                    <p className="mono">{previewDoc.issueDate}</p>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Tanggal Kadaluarsa (Expiry):</span>
                    <p className="mono" style={{ fontWeight: 800, color: previewDoc.status === 'Expired' ? '#ef4444' : '#0284c7' }}>
                      {previewDoc.expiryDate}
                    </p>
                  </div>
                </div>

                {/* Stamp & QR Verification */}
                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <QrCode size={40} color="#0f172a" />
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      Verified Authentic<br />Ditjen Hubla System
                    </div>
                  </div>
                  <div style={{
                    padding: '0.35rem 0.85rem',
                    border: '2px solid #10b981',
                    color: '#059669',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    borderRadius: '4px',
                    transform: 'rotate(-5deg)',
                    textTransform: 'uppercase'
                  }}>
                    REGISTERED OFFICIAL
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setPreviewDoc(null)} className="btn btn-secondary">
                Tutup
              </button>
              <button
                onClick={() => {
                  openGoogleCalendar(previewDoc);
                  setPreviewDoc(null);
                }}
                className="btn btn-secondary"
                style={{ color: '#38bdf8' }}
              >
                <CalendarPlus size={14} />
                <span>+ Google Calendar</span>
              </button>
              <button
                onClick={() => {
                  sendWhatsAppReminder(previewDoc, previewDoc.crewName ? 'crew_cert' : 'ship_doc');
                  setPreviewDoc(null);
                }}
                className="btn btn-whatsapp"
              >
                <Send size={14} />
                <span>Kirim Notifikasi WA</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
