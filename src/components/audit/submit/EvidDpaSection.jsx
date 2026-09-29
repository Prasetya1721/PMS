/**
 * EvidDpaSection.jsx
 * Diekstrak dari SubmitEvidenceModal.jsx (baris 551-736).
 * Sumber: Bagian II: otorisasi DPA / auditor darat atas bukti yang diserahkan
 */
import React from 'react';
import { CheckCircle2, Printer, RotateCcw, ShieldCheck } from 'lucide-react';

export const EvidDpaSection = ({
  auditorNotes,
  finding,
  handleCloseNC,
  handleReopenNC,
  isAuditorOrDPA,
  setAuditorNotes,
  setShowPrintReport,
  setVerificationDate,
  setVerifiedSatisfactory,
  setVerifiedUpgradeDowngrade,
  verificationDate,
  verifiedSatisfactory,
  verifiedUpgradeDowngrade,
}) => {
  return (
    <div style={{
                padding: '1.25rem',
                borderRadius: '10px',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-info" style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                        🏢 Otorisasi DPA / Auditor Darat
                      </span>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                        <ShieldCheck size={18} color="#0284c7" />
                        <span>Bagian II: Verifikasi Eviden & Otorisasi Penutupan (Close NC)</span>
                      </h4>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
                      DPA memeriksa berkas perbaikan dari kapal, mengevaluasi efektivitas pemenuhan klausul, dan mengesahkan penutupan resmi.
                    </span>
                  </div>
                  <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>Formulir BKI F23.14.07</span>
                </div>

                {/* Verifikasi Status Upgrade / Downgrade / Tetap */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', opacity: isAuditorOrDPA ? 1 : 0.85 }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                      Tindakan perbaikan telah diverifikasi dan: {!isAuditorOrDPA && <span style={{ color: '#f59e0b' }}>(Wewenang Auditor)</span>}
                    </label>
                    <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                      {['Tetap', 'Ditingkatkan', 'Diturunkan'].map(opt => (
                        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', cursor: isAuditorOrDPA ? 'pointer' : 'not-allowed' }}>
                          <input
                            type="radio"
                            name="upgradeDowngrade"
                            value={opt}
                            checked={verifiedUpgradeDowngrade === opt}
                            disabled={!isAuditorOrDPA}
                            onChange={() => setVerifiedUpgradeDowngrade(opt)}
                          />
                          <span>{opt === 'Ditingkatkan' ? 'Ditingkatkan ke Mayor NC' : opt === 'Diturunkan' ? 'Diturunkan ke NC' : 'Tetap Sesuai Kategori'}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                      Memuaskan (Satisfactory): {!isAuditorOrDPA && <span style={{ color: '#f59e0b' }}>(Wewenang Auditor)</span>}
                    </label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', cursor: isAuditorOrDPA ? 'pointer' : 'not-allowed', color: '#10b981', fontWeight: 700 }}>
                        <input
                          type="radio"
                          name="satisfactory"
                          checked={verifiedSatisfactory === true}
                          disabled={!isAuditorOrDPA}
                          onChange={() => setVerifiedSatisfactory(true)}
                        />
                        <span>✅ Ya (Memuaskan)</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', cursor: isAuditorOrDPA ? 'pointer' : 'not-allowed', color: '#ef4444', fontWeight: 700 }}>
                        <input
                          type="radio"
                          name="satisfactory"
                          checked={verifiedSatisfactory === false}
                          disabled={!isAuditorOrDPA}
                          onChange={() => setVerifiedSatisfactory(false)}
                        />
                        <span>❌ Tidak (Belum Memuaskan)</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Auditor Notes & Verification Date */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                      Catatan Evaluasi / Telaah Auditor {!isAuditorOrDPA && <span style={{ color: '#f59e0b' }}>(Diisi Auditor / DPA)</span>}
                    </label>
                    <textarea
                      rows={2}
                      value={auditorNotes}
                      disabled={!isAuditorOrDPA}
                      onChange={(e) => setAuditorNotes(e.target.value)}
                      placeholder={isAuditorOrDPA ? "Evaluasi kecukupan bukti perbaikan..." : "Belum ada catatan evaluasi dari Auditor / DPA."}
                      className="input-control"
                      style={{ resize: 'vertical', background: !isAuditorOrDPA ? 'var(--bg-surface)' : undefined, cursor: !isAuditorOrDPA ? 'not-allowed' : undefined }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                      Tanggal Verifikasi Auditor
                    </label>
                    <input
                      type="date"
                      value={verificationDate}
                      disabled={!isAuditorOrDPA}
                      onChange={(e) => setVerificationDate(e.target.value)}
                      className="input-control mono"
                      style={{ cursor: !isAuditorOrDPA ? 'not-allowed' : undefined }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.4rem' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {finding.status === 'NC Close' ? (
                      <span style={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <CheckCircle2 size={15} />
                        <span>Temuan telah ditutup resmi</span>
                      </span>
                    ) : (
                      <span>Status saat ini: <strong style={{ color: '#f59e0b' }}>{finding.status}</strong></span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {finding.status === 'NC Close' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setShowPrintReport(true)}
                          className="btn btn-primary btn-sm"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            fontWeight: 800,
                            background: '#0284c7',
                            borderColor: '#0284c7',
                            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)'
                          }}
                          title="Cetak Lembar Verifikasi Penutupan NC Resmi (NCR Close-Out Form Standar Resmi)"
                        >
                          <Printer size={15} />
                          <span>🖨️ Cetak Laporan NC Close</span>
                        </button>
                        {isAuditorOrDPA && (
                          <button
                            type="button"
                            onClick={handleReopenNC}
                            className="btn btn-danger btn-sm"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
                          >
                            <RotateCcw size={13} />
                            <span>Buka Kembali Temuan (Reopen NC)</span>
                          </button>
                        )}
                      </>
                    ) : isAuditorOrDPA ? (
                      <button
                        type="button"
                        onClick={handleCloseNC}
                        className="btn btn-success"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                      >
                        <CheckCircle2 size={15} />
                        <span>Verifikasi & Tutup Temuan (CLOSE NC)</span>
                      </button>
                    ) : (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.45rem 0.85rem',
                        borderRadius: '7px',
                        background: 'rgba(2, 132, 199, 0.08)',
                        border: '1px solid rgba(2, 132, 199, 0.3)',
                        fontSize: '0.74rem',
                        color: '#0284c7',
                        fontWeight: 600
                      }}>
                        <ShieldCheck size={14} />
                        <span>Otorisasi Close NC Wewenang DPA / Lead Auditor</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
  );
};
