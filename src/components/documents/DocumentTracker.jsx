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
    exportMultiIntervalICS,
    h30ExpiringCount,
    h1ExpiringCount,
    h7ExpiringCount,
    h365ExpiringCount
  } = usePMS();

  const [docTypeTab, setDocTypeTab] = useState('all'); // 'all' | 'crew' | 'ship'
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'H-1' | 'H-7' | 'H-30' | 'H-365' | 'Expired' | 'Due Soon' | 'Active'
  const [search, setSearch] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);

  // Modals for G-Cal and WA interval pickers
  const [calModalDoc, setCalModalDoc] = useState(null);
  const [calOffset, setCalOffset] = useState(30);
  const [calCustomDays, setCalCustomDays] = useState(14);
  const [calTime, setCalTime] = useState('08:00');

  const [waModalDoc, setWaModalDoc] = useState(null);
  const [waModalOffset, setWaModalOffset] = useState(30);

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
    if (statusFilter === 'H-1') {
      matchStatus = item.daysUntilExpiry !== undefined && item.daysUntilExpiry <= 1 && item.daysUntilExpiry >= 0;
    } else if (statusFilter === 'H-7') {
      matchStatus = item.daysUntilExpiry !== undefined && item.daysUntilExpiry <= 7 && item.daysUntilExpiry >= 0;
    } else if (statusFilter === 'H-30') {
      matchStatus = item.daysUntilExpiry !== undefined && item.daysUntilExpiry <= 30 && item.daysUntilExpiry >= 0;
    } else if (statusFilter === 'H-365') {
      matchStatus = item.daysUntilExpiry !== undefined && item.daysUntilExpiry <= 365 && item.daysUntilExpiry >= 0;
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
          <button onClick={() => exportMultiIntervalICS()} className="btn btn-secondary btn-sm" title="Ekspor .ics multi-alarm untuk Google Calendar">
            <CalendarPlus size={14} />
            <span>Ekspor Kalender Multi-Alarm (.ics)</span>
          </button>
          {h1ExpiringCount > 0 && (
            <span className="badge badge-danger-pulse" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
              <Clock size={14} />
              <span>{h1ExpiringCount} H-1 Hari</span>
            </span>
          )}
          {h7ExpiringCount > 0 && (
            <span className="badge badge-warning" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
              <Clock size={14} />
              <span>{h7ExpiringCount} H-1 Minggu</span>
            </span>
          )}
          <span className="badge badge-info" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
            <Calendar size={14} />
            <span>{h30ExpiringCount} H-1 Bulan</span>
          </span>
          <span className="badge badge-danger" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
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
              { id: 'H-1', label: '1 Hari (H-1)', badge: h1ExpiringCount },
              { id: 'H-7', label: '1 Minggu (H-7)', badge: h7ExpiringCount },
              { id: 'H-30', label: '1 Bulan (H-30)', badge: h30ExpiringCount },
              { id: 'H-365', label: '1 Tahun (H-365)', badge: h365ExpiringCount },
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
                {st.badge !== undefined && st.badge > 0 && (
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
                          onClick={() => {
                            setCalModalDoc(item);
                            setCalOffset(item.daysUntilExpiry <= 1 ? 1 : item.daysUntilExpiry <= 7 ? 7 : item.daysUntilExpiry <= 30 ? 30 : 365);
                          }}
                          className="btn btn-secondary btn-sm"
                          title="Pilih Jadwal Google Calendar (1 Hari, 1 Minggu, 1 Bulan, 1 Tahun, Kustom)"
                          style={{ padding: '0.35rem 0.55rem', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}
                        >
                          <CalendarPlus size={13} />
                          <span>G-Cal</span>
                        </button>
                        <button
                          onClick={() => {
                            setWaModalDoc(item);
                            setWaModalOffset(item.daysUntilExpiry <= 1 ? 1 : item.daysUntilExpiry <= 7 ? 7 : item.daysUntilExpiry <= 30 ? 30 : 365);
                          }}
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
                  setCalModalDoc(previewDoc);
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
                  setWaModalDoc(previewDoc);
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

      {/* MODAL 1: Google Calendar Customizer Dialog in DocumentTracker */}
      {calModalDoc && (
        <div className="modal-overlay" onClick={() => setCalModalDoc(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CalendarPlus size={20} color="#38bdf8" />
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Jadwalkan ke Google Calendar</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Pilih waktu & interval pengingat untuk: {calModalDoc.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCalModalDoc(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ padding: '0.75rem 1rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{calModalDoc.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Jatuh Tempo: <strong className="mono" style={{ color: '#38bdf8' }}>{calModalDoc.expiryDate}</strong> ({calModalDoc.daysUntilExpiry} hari lagi)
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Pilih Jadwal Pengingat:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setCalOffset(1)}
                    className={`btn btn-sm ${calOffset === 1 ? 'btn-danger' : 'btn-secondary'}`}
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    📅 1 Hari Sebelum (H-1)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalOffset(7)}
                    className={`btn btn-sm ${calOffset === 7 ? 'btn-warning' : 'btn-secondary'}`}
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    📅 1 Minggu Sebelum (H-7)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalOffset(30)}
                    className={`btn btn-sm ${calOffset === 30 ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    📅 1 Bulan Sebelum (H-30)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalOffset(365)}
                    className={`btn btn-sm ${calOffset === 365 ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    📅 1 Tahun Sebelum (H-365)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalOffset(0)}
                    className={`btn btn-sm ${calOffset === 0 ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    📅 Hari-H Jatuh Tempo
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalOffset('custom')}
                    className={`btn btn-sm ${calOffset === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    📅 Kustom Hari
                  </button>
                </div>

                {calOffset === 'custom' && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ingatkan:</span>
                    <input
                      type="number"
                      min="1"
                      max="1825"
                      value={calCustomDays}
                      onChange={(e) => setCalCustomDays(Number(e.target.value))}
                      className="input-control mono"
                      style={{ width: '90px' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>hari sebelum jatuh tempo</span>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Waktu / Jam Pengingat (WIB):
                </label>
                <input
                  type="time"
                  value={calTime}
                  onChange={(e) => setCalTime(e.target.value)}
                  className="input-control mono"
                  style={{ width: '130px' }}
                />
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => exportMultiIntervalICS()}
                className="btn btn-secondary btn-sm"
              >
                <Download size={14} />
                <span>Unduh .ics Semua Alarm</span>
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setCalModalDoc(null)} className="btn btn-secondary btn-sm">
                  Batal
                </button>
                <button
                  onClick={() => {
                    const days = calOffset === 'custom' ? calCustomDays : calOffset;
                    openGoogleCalendar(calModalDoc, {
                      offsetDays: days,
                      eventTime: calTime
                    });
                    setCalModalDoc(null);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  <CalendarPlus size={14} />
                  <span>Buka Google Calendar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: WhatsApp Dialog in DocumentTracker */}
      {waModalDoc && (
        <div className="modal-overlay" onClick={() => setWaModalDoc(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Send size={20} color="#22c55e" />
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Kirim Peringatan WhatsApp Resmi</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Pilih konteks peringatan untuk {waModalDoc.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWaModalDoc(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Kategori Template Sesuai Interval:
                </label>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setWaModalOffset(1)}
                    className={`btn btn-sm ${waModalOffset === 1 ? 'btn-danger' : 'btn-secondary'}`}
                  >
                    🚨 1 Hari (Darurat H-1)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaModalOffset(7)}
                    className={`btn btn-sm ${waModalOffset === 7 ? 'btn-warning' : 'btn-secondary'}`}
                  >
                    ⚠️ 1 Minggu (Kritis H-7)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaModalOffset(30)}
                    className={`btn btn-sm ${waModalOffset === 30 ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    🔔 1 Bulan (H-30)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaModalOffset(365)}
                    className={`btn btn-sm ${waModalOffset === 365 ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    📋 1 Tahun (H-365)
                  </button>
                </div>
              </div>

              <div style={{ padding: '0.85rem', background: '#0b141a', borderRadius: '8px', border: '1px solid #1f2c34', color: '#e9edef', fontSize: '0.8rem', lineHeight: 1.45, whiteSpace: 'pre-wrap' }}>
                {`*${
                  waModalOffset === 1
                    ? '🚨 PERINGATAN DARURAT H-1 (HARI TERAKHIR)'
                    : waModalOffset === 7
                    ? '⚠️ PERINGATAN KRITIS H-1 MINGGU (H-7)'
                    : waModalOffset === 30
                    ? '🔔 PEMBERITAHUAN JATUH TEMPO H-1 BULAN (H-30)'
                    : '📋 PERSIAPAN ANGGARAN DINI H-1 TAHUN (H-365)'
                } - SISTEM PMS BAHARIMAS*\n\n` +
                `Dokumen: ${waModalDoc.name}\n` +
                `Nomor: ${waModalDoc.certificateNo || waModalDoc.documentNo}\n` +
                `Jatuh Tempo: ${waModalDoc.expiryDate} (${waModalDoc.daysUntilExpiry} hari lagi).\n\n` +
                `_Pusat Pengendali Armada PMS PT. Pelayaran Baharimas Kalimantan_`}
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button onClick={() => setWaModalDoc(null)} className="btn btn-secondary btn-sm">
                Batal
              </button>
              <button
                onClick={() => {
                  sendWhatsAppReminder(
                    waModalDoc,
                    waModalDoc.crewName ? 'crew_cert' : 'ship_doc',
                    { offsetDays: waModalOffset }
                  );
                  setWaModalDoc(null);
                }}
                className="btn btn-whatsapp btn-sm"
              >
                <Send size={14} />
                <span>Buka WhatsApp Web / App</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
