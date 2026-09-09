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
  X
} from 'lucide-react';

export const DocumentTracker = () => {
  const {
    crewCertificates,
    shipDocuments,
    vessels,
    sendWhatsAppReminder
  } = usePMS();

  const [docTypeTab, setDocTypeTab] = useState('all'); // 'all' | 'crew' | 'ship'
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'Expired' | 'Due Soon' | 'Active'
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

    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;

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
            Monitoring masa berlaku dokumen legal kapal dan sertifikasi kru STCW untuk mencegah penahanan otoritas (detention)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span className="badge badge-danger-pulse" style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}>
            <ShieldAlert size={14} />
            <span>{expiredCount} Dokumen Expired</span>
          </span>
          <span className="badge badge-warning" style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}>
            <Clock size={14} />
            <span>{dueSoonCount} Mendekati Expired</span>
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
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {['ALL', 'Expired', 'Due Soon', 'Active'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`tab-btn ${statusFilter === st ? 'active' : ''}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
              >
                {st === 'ALL' ? 'Semua Status' : st}
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
                <th style={{ textAlign: 'right' }}>Aksi Reminder & File</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => {
                const ship = vessels.find(v => v.id === item.vesselId);
                const docNo = item.certificateNo || item.documentNo;
                const isExpired = item.status === 'Expired';
                const isDueSoon = item.status === 'Due Soon';

                return (
                  <tr key={item.id} style={{ background: isExpired ? 'rgba(239, 68, 68, 0.04)' : undefined }}>
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
                      <div className="mono" style={{ fontWeight: 700, fontSize: '0.85rem', color: isExpired ? '#ef4444' : isDueSoon ? '#f59e0b' : '#10b981' }}>
                        {item.expiryDate}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: isExpired ? '#ef4444' : isDueSoon ? '#f59e0b' : 'var(--text-subtle)' }}>
                        {item.daysUntilExpiry > 0 ? `${item.daysUntilExpiry} hari lagi` : `LEWAT ${Math.abs(item.daysUntilExpiry)} HARI!`}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        isExpired ? 'badge-danger-pulse' :
                        isDueSoon ? 'badge-warning' : 'badge-success'
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
                        >
                          <Eye size={13} />
                          <span>Scan</span>
                        </button>
                        <button
                          onClick={() => sendWhatsAppReminder(item, item.crewName ? 'crew_cert' : 'ship_doc')}
                          className="btn btn-whatsapp btn-sm"
                          title="Kirim Reminder WhatsApp Resmi"
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
