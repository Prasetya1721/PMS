/**
 * NotifEmailModal.jsx
 * Diekstrak dari NotificationCenter.jsx (baris 2850-3010).
 * Sumber: Modal pratinjau email
 */
import React from 'react';
import { Mail, X, Zap } from 'lucide-react';

export const NotifEmailModal = ({
  emailCustomBody,
  emailCustomSubject,
  emailModalItem,
  emailOffset,
  emailRecipients,
  sendEmailReminder,
  setEmailCustomBody,
  setEmailCustomSubject,
  setEmailModalItem,
  setEmailRecipients,
  updateEmailModalOffset,
}) => {
  return (
    <div className="modal-overlay" onClick={() => setEmailModalItem(null)}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
                <div className="modal-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(14, 165, 233, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Kirim Peringatan Email Resmi</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Pemberitahuan jatuh tempo untuk {emailModalItem.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEmailModalItem(null)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Urgency Selector */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Ambang Batas / Kategori Urgensi:
                    </label>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => updateEmailModalOffset(1)}
                        className={`btn btn-sm ${emailOffset === 1 ? 'btn-danger' : 'btn-secondary'}`}
                      >
                        🚨 1 Hari (Darurat H-1)
                      </button>
                      <button
                        type="button"
                        onClick={() => updateEmailModalOffset(7)}
                        className={`btn btn-sm ${emailOffset === 7 ? 'btn-warning' : 'btn-secondary'}`}
                      >
                        ⚠️ 1 Minggu (Kritis H-7)
                      </button>
                      <button
                        type="button"
                        onClick={() => updateEmailModalOffset(30)}
                        className={`btn btn-sm ${emailOffset === 30 ? 'btn-primary' : 'btn-secondary'}`}
                      >
                        🔔 1 Bulan (H-30)
                      </button>
                      <button
                        type="button"
                        onClick={() => updateEmailModalOffset(365)}
                        className={`btn btn-sm ${emailOffset === 365 ? 'btn-primary' : 'btn-secondary'}`}
                      >
                        📋 1 Tahun (H-365)
                      </button>
                    </div>
                  </div>

                  {/* Recipients Input */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Penerima Email (To):
                    </label>
                    <input
                      type="text"
                      value={emailRecipients}
                      onChange={(e) => setEmailRecipients(e.target.value)}
                      className="input-control mono"
                      placeholder="nakhoda@baharimas.co.id, fleet.ops@baharimas.co.id"
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Bisa mencantumkan beberapa alamat email yang dipisahkan tanda koma.
                    </span>
                  </div>

                  {/* Subject Input */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Subjek Email:
                    </label>
                    <input
                      type="text"
                      value={emailCustomSubject}
                      onChange={(e) => setEmailCustomSubject(e.target.value)}
                      className="input-control"
                    />
                  </div>

                  {/* Body textarea */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Isi Pesan Email:
                    </label>
                    <textarea
                      rows="7"
                      value={emailCustomBody}
                      onChange={(e) => setEmailCustomBody(e.target.value)}
                      className="input-control mono"
                      style={{ fontSize: '0.8rem', lineHeight: '1.45' }}
                    />
                  </div>
                </div>

                <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button onClick={() => setEmailModalItem(null)} className="btn btn-secondary btn-sm">
                    Batal
                  </button>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={async () => {
                        await sendEmailReminder(
                          emailModalItem,
                          emailModalItem.crewName ? 'crew_cert' : 'ship_doc',
                          {
                            offsetDays: emailOffset,
                            recipientEmail: emailRecipients,
                            customSubject: emailCustomSubject,
                            customMessage: emailCustomBody,
                            skipMailto: true
                          }
                        );
                        setEmailModalItem(null);
                      }}
                      className="btn btn-primary btn-sm"
                      title="Kirim otomatis melalui REST API Gateway / Cloud SMTP"
                    >
                      <Zap size={14} />
                      <span>Kirim Otomatis via API</span>
                    </button>

                    <button
                      onClick={async () => {
                        await sendEmailReminder(
                          emailModalItem,
                          emailModalItem.crewName ? 'crew_cert' : 'ship_doc',
                          {
                            offsetDays: emailOffset,
                            recipientEmail: emailRecipients,
                            customSubject: emailCustomSubject,
                            customMessage: emailCustomBody,
                            skipMailto: false
                          }
                        );
                        setEmailModalItem(null);
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)' }}
                      title="Buka draf pesan di aplikasi email default (Outlook, Thunderbird, Gmail)"
                    >
                      <Mail size={14} />
                      <span>Buka di Aplikasi Email</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
  );
};
