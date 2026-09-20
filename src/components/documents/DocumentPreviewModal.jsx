import React, { useState } from 'react';
import { X, Download, ExternalLink, FileText, ZoomIn, ZoomOut, RotateCw, CheckCircle, ShieldCheck, AlertCircle } from 'lucide-react';

export const DocumentPreviewModal = ({ document: doc, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!doc || !doc.fileUrl) return null;

  const fileUrl = doc.fileUrl;
  const fileName = doc.fileName || `${doc.name || 'Dokumen'}.pdf`;
  const fileType = doc.fileType || (fileUrl.startsWith('data:image/') ? 'image' : fileUrl.startsWith('data:application/pdf') ? 'pdf' : 'unknown');

  const isImage = fileType.includes('image') ||
    fileUrl.startsWith('data:image/') ||
    fileUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i);

  const isPdf = fileType.includes('pdf') ||
    fileUrl.startsWith('data:application/pdf') ||
    fileUrl.match(/\.pdf($|\?)/i);

  // Safe download function
  const handleDownload = () => {
    try {
      const link = window.document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
      // Fallback
      window.open(fileUrl, '_blank');
    }
  };

  // Safe open in new tab
  const handleOpenNewTab = () => {
    try {
      if (fileUrl.startsWith('data:')) {
        // Convert data URL to Blob for clean new tab viewing without browser security blocking
        const byteString = atob(fileUrl.split(',')[1]);
        const mimeString = fileUrl.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
      } else {
        window.open(fileUrl, '_blank');
      }
    } catch (err) {
      console.error('Open tab error:', err);
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        zIndex: 1300,
        backgroundColor: 'rgba(11, 20, 38, 0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div
        className="glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '95vw',
          maxWidth: '1100px',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          background: 'var(--bg-surface-elevated)'
        }}
      >
        {/* Header Bar */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'var(--bg-surface)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <FileText size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  {doc.name || 'Preview Dokumen Sertifikat'}
                </h3>
                {doc.category && (
                  <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                    {doc.category}
                  </span>
                )}
                {doc.status && (
                  <span className={`badge ${doc.status === 'Active' ? 'badge-success' : doc.status === 'Expired' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>
                    {doc.status}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                <span className="mono">{fileName}</span>
                {doc.fileSize && <span> • {doc.fileSize}</span>}
                {doc.documentNo && <span> • No: <strong className="mono">{doc.documentNo}</strong></span>}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isImage && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginRight: '0.5rem', background: 'var(--bg-surface-elevated)', padding: '0.2rem 0.4rem', borderRadius: '6px' }}>
                <button
                  type="button"
                  onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.25rem 0.5rem' }}
                  title="Perkecil Zoom"
                >
                  <ZoomOut size={14} />
                </button>
                <span style={{ fontSize: '0.75rem', minWidth: '40px', textAlign: 'center' }}>
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom(z => Math.min(3, z + 0.2))}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.25rem 0.5rem' }}
                  title="Perbesar Zoom"
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation(r => (r + 90) % 360)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.25rem 0.5rem' }}
                  title="Putar Gambar 90 Derajat"
                >
                  <RotateCw size={14} />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleDownload}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
              title="Unduh file ke perangkat"
            >
              <Download size={14} />
              <span>Unduh Berkas</span>
            </button>

            <button
              type="button"
              onClick={handleOpenNewTab}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
              title="Buka di tab browser baru"
            >
              <ExternalLink size={14} />
              <span>Buka Tab Baru</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.45rem', borderRadius: '8px', color: 'var(--text-muted)' }}
              title="Tutup Pratinjau"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '480px',
          background: '#090d16'
        }}>
          {isImage ? (
            <div style={{
              overflow: 'auto',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '480px'
            }}>
              <img
                src={fileUrl}
                alt={fileName}
                style={{
                  maxWidth: `${zoom * 100}%`,
                  maxHeight: zoom === 1 ? '72vh' : 'none',
                  transform: `rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease',
                  borderRadius: '8px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  objectFit: 'contain'
                }}
              />
            </div>
          ) : isPdf ? (
            <div style={{ width: '100%', height: '74vh', display: 'flex', flexDirection: 'column' }}>
              <iframe
                src={fileUrl}
                title={fileName}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>
          ) : (
            // Generic or SVG Viewer
            <div style={{ width: '100%', height: '74vh', display: 'flex', flexDirection: 'column' }}>
              <iframe
                src={fileUrl}
                title={fileName}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div style={{
          padding: '0.65rem 1.25rem',
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-glass)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={15} color="#10b981" />
            <span>Dokumen tersimpan aman dalam sistem PMS Armada PT. Pelayaran Baharimas Kalimantan</span>
          </div>
          <div>
            Format: <strong className="mono" style={{ color: 'var(--text-main)' }}>{isPdf ? 'PDF Dokumen Resmi' : isImage ? 'File Gambar / Scan' : 'Digital File'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
