/**
 * MasterDataHeaderBanner.jsx
 * Diekstrak dari MasterDataAdmin.jsx (baris 754-903).
 * Sumber: Header banner modul data master
 */
import React from 'react';
import { Database, Download, RefreshCw, Trash2 } from 'lucide-react';

export const MasterDataHeaderBanner = ({
  activeTab,
  allCrewList,
  allDocList,
  allUserList,
  auditReport,
  certificateCategories,
  documentTemplates,
  handleDownloadBackupJSON,
  handleOpenClearAllModal,
  handleOpenLoadDemoModal,
  handleReaudit,
  isReauditing,
  masterSurveyTypes,
  setActiveTab,
  setShowSyncModal,
  vessels,
}) => {
  return (
    <div className="glass-card" style={{ padding: '1.5rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '160px',
              height: '160px',
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(56, 189, 248, 0.12) 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8'
                }}>
                  <Database size={24} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Data Master & Pusat Audit Sistem</h2>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>Admin Control Center</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Pusat kendali basis data kapal, kru, dokumen legal maritim, dan verifikasi integritas data web secara real-time.
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleOpenClearAllModal}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.35)', cursor: 'pointer' }}
                  title="Kosongkan seluruh data untuk pengujian input manual"
                >
                  <Trash2 size={14} />
                  <span>Kosongkan Seluruh Data</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenLoadDemoModal}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.35)', cursor: 'pointer' }}
                  title="Muat kembali data demo maritim lengkap"
                >
                  <Database size={14} />
                  <span>Muat Data Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowSyncModal(true)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    borderColor: '#0284c7',
                    color: '#0284c7',
                    fontWeight: 600
                  }}
                  title="Sinkronisasi paket data offline kapal-darat (IMO ISM) dan restore/backup database penuh"
                >
                  <RefreshCw size={14} />
                  <span>Sinkronisasi Kapal-Darat & Backup</span>
                </button>
                <button onClick={handleDownloadBackupJSON} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Download size={14} />
                  <span>Backup JSON Cepat</span>
                </button>
                <button onClick={handleReaudit} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <RefreshCw size={14} className={isReauditing ? 'spin-animation' : ''} />
                  <span>Cek Semua Data Web</span>
                </button>
              </div>
            </div>

            {/* Tab Navigation - Semua 8 Tab Terlihat Jelas & Responsif */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.45rem',
              marginTop: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '0.85rem'
            }}>
              {[
                { id: 'audit', label: '🔍 Cek Audit Web', count: `${auditReport.score}% Sehat`, fullLabel: '🔍 Cek Semua Data Web (Audit)' },
                { id: 'vessels', label: '🚢 Master Kapal', count: vessels.length, fullLabel: '🚢 Master Data Kapal' },
                { id: 'crew', label: '👥 Master Crew', count: allCrewList.length, fullLabel: '👥 Master Data Crew' },
                { id: 'documents', label: '📜 Dokumen Kapal', count: allDocList.length, fullLabel: '📜 Dokumen Kapal Armada' },
                { id: 'categories', label: '🏷️ Kategori Sertifikat', count: (certificateCategories || []).length, fullLabel: '🏷️ Master Kategori Sertifikat' },
                { id: 'surveyTypes', label: '📋 Jenis Survey', count: (masterSurveyTypes || []).length, fullLabel: '📋 Master Jenis Survey' },
                { id: 'certNames', label: '📜 Nama Sertifikat', count: (documentTemplates || []).length, fullLabel: '📜 Master Nama Sertifikat' },
                { id: 'users', label: '👤 Manajemen User', count: allUserList.length, fullLabel: '👤 Manajemen User' }
              ].map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab-btn ${isActive ? 'active' : ''}`}
                    title={tab.fullLabel}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.52rem 0.85rem',
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 700 : 500,
                      whiteSpace: 'nowrap',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: isActive ? '1px solid #38bdf8' : '1px solid var(--border-glass)',
                      background: isActive ? 'rgba(56, 189, 248, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                      color: isActive ? '#38bdf8' : 'var(--text-main)',
                      boxShadow: isActive ? '0 0 12px rgba(56, 189, 248, 0.22)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{tab.label}</span>
                    <span
                      className="badge"
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        background: isActive ? 'rgba(56, 189, 248, 0.35)' : 'rgba(255, 255, 255, 0.08)',
                        color: isActive ? '#ffffff' : 'var(--text-muted)',
                        border: '1px solid var(--border-glass)',
                        padding: '0.12rem 0.45rem',
                        borderRadius: '10px'
                      }}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
  );
};
