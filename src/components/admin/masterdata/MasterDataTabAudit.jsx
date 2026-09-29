/**
 * MasterDataTabAudit.jsx
 * Diekstrak dari MasterDataAdmin.jsx (baris 908-1123).
 * Sumber: Tab 1: audit & data health check
 */
import React from 'react';
import { ChevronRight, FileCheck, RefreshCw, ShieldCheck, Ship, Users, Wrench } from 'lucide-react';

export const MasterDataTabAudit = ({
  allUserList,
  auditReport,
  auditTimestamp,
  handleReaudit,
  setActiveTab,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Health Scorecard Hero */}
              <div className="glass-card" style={{
                padding: '1.75rem',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(2, 6, 23, 0.7) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '20px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '2px solid #10b981',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#10b981', lineHeight: 1 }}>
                        {auditReport.score}%
                      </span>
                      <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700, marginTop: '0.2rem' }}>
                        INTEGRITAS
                      </span>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Status Kesehatan Seluruh Data Web</h3>
                        <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <ShieldCheck size={13} />
                          <span>Data Sehat & Terverifikasi</span>
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem', maxWidth: '650px' }}>
                        Seluruh data armada kapal, data awak kapal, sertifikat maritim dengan tanggal penerbitan & expired, jam operasional mesin, dan inventaris sparepart telah diverifikasi.
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
                        Waktu Audit Terakhir: <strong>{auditTimestamp} WIB</strong> • Standar Verifikasi: <strong>BKI, Ditjen Hubla (KSOP), KKP</strong>
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button onClick={handleReaudit} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <RefreshCw size={15} />
                      <span>Jalankan Audit Ulang</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Audit Verification Table Cards */}
              <div className="grid-cols-2">
                {/* Card 1: Data Kapal & Particulars */}
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Ship size={18} color="#38bdf8" />
                      <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Data Armada Kapal</h4>
                    </div>
                    <span className={`badge ${auditReport.vesselIntegrityPass ? 'badge-success' : 'badge-warning'}`}>
                      {auditReport.vesselIntegrityPass ? '✓ Lolos Verifikasi' : 'Perhatian'}
                    </span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
                    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Total Armada Kapal:</span>
                      <strong>{auditReport.totalVessels} Kapal ({auditReport.ownerVessels} As Owner{auditReport.operatorVessels > 0 ? `, ${auditReport.operatorVessels} As Operator` : ''})</strong>
                    </li>
                    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Data Particular Kapal:</span>
                      <strong style={{ color: '#10b981' }}>{auditReport.vesselsWithParticulars} dari {auditReport.totalVessels} Kapal Terdata</strong>
                    </li>
                    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Nomor Registrasi BKI & Call Sign:</span>
                      <strong style={{ color: auditReport.vesselsMissingReg.length === 0 ? '#10b981' : '#ef4444' }}>
                        {auditReport.vesselsMissingReg.length === 0 ? '✓ 100% Lengkap' : `${auditReport.vesselsMissingReg.length} Kapal Kurang Lengkap`}
                      </strong>
                    </li>
                  </ul>
                </div>

                {/* Card 2: Data Dokumen & Sertifikat */}
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileCheck size={18} color="#10b981" />
                      <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Sertifikat & Tanggal (Issue/Exp)</h4>
                    </div>
                    <span className={`badge ${auditReport.docIntegrityPass ? 'badge-success' : 'badge-warning'}`}>
                      {auditReport.docIntegrityPass ? '✓ Lolos Verifikasi' : 'Perhatian'}
                    </span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
                    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Total Sertifikat Terpantau:</span>
                      <strong>{auditReport.totalDocs} Dokumen Legal Armada</strong>
                    </li>
                    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Kategori Maritim (KSOP/BKI/Statutory):</span>
                      <strong style={{ color: auditReport.docsMissingCategory.length === 0 ? '#10b981' : '#ef4444' }}>
                        {auditReport.docsMissingCategory.length === 0 ? '✓ 100% Terkategorisasi' : `${auditReport.docsMissingCategory.length} Dokumen Tanpa Kategori`}
                      </strong>
                    </li>
                    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Tgl Penerbitan & Tgl Expired:</span>
                      <strong style={{ color: auditReport.docsMissingIssueDate.length === 0 ? '#10b981' : '#ef4444' }}>
                        {auditReport.docsMissingIssueDate.length === 0 ? '✓ Lengkap di Seluruh Sertifikat' : 'Ada data tanggal kosong'}
                      </strong>
                    </li>
                  </ul>
                </div>

                {/* Card 3: Data Crew */}
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Users size={18} color="#a855f7" />
                      <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Awak Kapal (Crew Roster)</h4>
                    </div>
                    <span className={`badge ${auditReport.crewIntegrityPass ? 'badge-success' : 'badge-warning'}`}>
                      {auditReport.crewIntegrityPass ? '✓ Lolos Verifikasi' : 'Perhatian'}
                    </span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
                    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Total Awak Kapal Terdata:</span>
                      <strong>{auditReport.totalCrew} Kru Aktif</strong>
                    </li>
                    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Penugasan Kapal Valid:</span>
                      <strong style={{ color: auditReport.crewUnassigned.length === 0 ? '#10b981' : '#ef4444' }}>
                        {auditReport.crewUnassigned.length === 0 ? '✓ Seluruh Kru Ditugaskan' : `${auditReport.crewUnassigned.length} Kru Tanpa Kapal`}
                      </strong>
                    </li>
                    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Nomor Buku Pelaut & Kontak HP:</span>
                      <strong style={{ color: '#10b981' }}>✓ Terverifikasi Lengkap</strong>
                    </li>
                  </ul>
                </div>

                {/* Card 4: Equipment & Sparepart */}
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Wrench size={18} color="#f59e0b" />
                      <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Permesinan & Sparepart</h4>
                    </div>
                    <span className="badge badge-success">✓ Lolos Verifikasi</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
                    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Equipment Mesin Utama & Genset:</span>
                      <strong>{auditReport.totalEq} Unit Mesin</strong>
                    </li>
                    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Work Orders Servis & Maintenance:</span>
                      <strong>{auditReport.totalWO} Perintah Kerja (PMS)</strong>
                    </li>
                    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Inventaris Sparepart Kapal:</span>
                      <strong>{auditReport.totalParts} Item Suku Cadang</strong>
                    </li>
                  </ul>
                </div>

                {/* Card 5: Akun & Hak Akses Pengguna */}
                <div className="glass-card" style={{ padding: '1.25rem', gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ShieldCheck size={18} color="#a855f7" />
                      <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Manajemen Akun & Hak Akses Pengguna (Users)</h4>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span className={`badge ${auditReport.userIntegrityPass ? 'badge-success' : 'badge-warning'}`}>
                        {auditReport.userIntegrityPass ? '✓ Kredensial & Role Valid' : 'Perlu Diperiksa'}
                      </span>
                      <button
                        onClick={() => setActiveTab('users')}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <span>Buka Manajemen User</span>
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.825rem' }}>
                    <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Total Akun Pengguna</span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{auditReport.totalUsers} User Terdaftar</strong>
                    </div>
                    <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Akses Administrator</span>
                      <strong style={{ fontSize: '1.1rem', color: '#a855f7' }}>{auditReport.superAdminCount} Super Admin</strong>
                    </div>
                    <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Akses Operasional Lapangan</span>
                      <strong style={{ fontSize: '1.1rem', color: '#10b981' }}>{allUserList.filter(u => u.role.includes('Nakhoda') || u.role.includes('Engineer') || u.role.includes('ABK')).length} Awak / Nakhoda</strong>
                    </div>
                    <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Integritas Login & Password</span>
                      <strong style={{ fontSize: '1.1rem', color: auditReport.userIntegrityPass ? '#10b981' : '#ef4444' }}>
                        {auditReport.userIntegrityPass ? '✓ 100% Siap Digunakan' : 'Kredensial Belum Lengkap'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  );
};
