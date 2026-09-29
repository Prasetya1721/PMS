/**
 * NotifEmailConnectorCard.jsx
 * Diekstrak dari NotifTabSettings.jsx (baris 497-660).
 * Sumber: Kartu Konektor Email Gateway API & SMTP
 */
import React from 'react';
import { Mail } from 'lucide-react';

export const NotifEmailConnectorCard = ({
  emailGatewayTesting,
  handleTestEmailGatewayPing,
  notificationSettings,
  updateAutoSendConfig,
}) => {
  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Mail size={18} color="#0ea5e9" />
                          <span>Konektor Email Gateway API & SMTP</span>
                        </h4>
                        <span className="badge badge-info">Otomatis / REST API</span>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Provider Layanan Email
                        </label>
                        <select
                          value={notificationSettings?.autoSend?.emailGateway?.provider || 'REST API / Cloud SMTP'}
                          onChange={(e) => updateAutoSendConfig({
                            emailGateway: {
                              ...notificationSettings?.autoSend?.emailGateway,
                              provider: e.target.value
                            }
                          })}
                          className="select-control"
                        >
                          <option value="REST API / Cloud SMTP">REST API Backend / Cloud Gateway (SendGrid / Brevo / Resend)</option>
                          <option value="SMTP Relay Server">SMTP Relay Server (Custom Host & Port)</option>
                          <option value="Mailgun API">Mailgun REST API</option>
                          <option value="Google Workspace / SES">Google Workspace / AWS SES API</option>
                          <option value="Direct Mailto Fallback">Direct Mailto: Fallback (Aplikasi Email Desktop)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          API Endpoint URL / Webhook
                        </label>
                        <input
                          type="text"
                          value={notificationSettings?.autoSend?.emailGateway?.apiUrl || ''}
                          onChange={(e) => updateAutoSendConfig({
                            emailGateway: {
                              ...notificationSettings?.autoSend?.emailGateway,
                              apiUrl: e.target.value
                            }
                          })}
                          className="input-control mono"
                          placeholder="https://api.baharimas.co.id/v1/email/send atau https://api.resend.com/emails"
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                            API Token / Secret Key
                          </label>
                          <input
                            type="password"
                            value={notificationSettings?.autoSend?.emailGateway?.apiKey || ''}
                            onChange={(e) => updateAutoSendConfig({
                              emailGateway: {
                                ...notificationSettings?.autoSend?.emailGateway,
                                apiKey: e.target.value
                              }
                            })}
                            className="input-control mono"
                            placeholder="Bearer token / API key"
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                            Alamat Email Pengirim (From)
                          </label>
                          <input
                            type="email"
                            value={notificationSettings?.autoSend?.emailGateway?.fromEmail || ''}
                            onChange={(e) => updateAutoSendConfig({
                              emailGateway: {
                                ...notificationSettings?.autoSend?.emailGateway,
                                fromEmail: e.target.value
                              }
                            })}
                            className="input-control mono"
                            placeholder="pms.armada@baharimas.co.id"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                            Nama Pengirim (Display Name)
                          </label>
                          <input
                            type="text"
                            value={notificationSettings?.autoSend?.emailGateway?.fromName || ''}
                            onChange={(e) => updateAutoSendConfig({
                              emailGateway: {
                                ...notificationSettings?.autoSend?.emailGateway,
                                fromName: e.target.value
                              }
                            })}
                            className="input-control"
                            placeholder="PMS PT. Pelayaran Baharimas Kalimantan"
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                            Reply-To
                          </label>
                          <input
                            type="email"
                            value={notificationSettings?.autoSend?.emailGateway?.replyTo || ''}
                            onChange={(e) => updateAutoSendConfig({
                              emailGateway: {
                                ...notificationSettings?.autoSend?.emailGateway,
                                replyTo: e.target.value
                              }
                            })}
                            className="input-control mono"
                            placeholder="operations@baharimas.co.id"
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Penerima Notifikasi Default / CC (Pisahkan koma):
                        </label>
                        <input
                          type="text"
                          value={Array.isArray(notificationSettings?.autoSend?.emailGateway?.defaultRecipients)
                            ? notificationSettings.autoSend.emailGateway.defaultRecipients.join(', ')
                            : (notificationSettings?.autoSend?.emailGateway?.defaultRecipients || '')}
                          onChange={(e) => {
                            const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            updateAutoSendConfig({
                              emailGateway: {
                                ...notificationSettings?.autoSend?.emailGateway,
                                defaultRecipients: arr
                              }
                            });
                          }}
                          className="input-control mono"
                          placeholder="fleet.ops@baharimas.co.id, dpa.baharimas@gmail.com"
                        />
                      </div>

                      <button
                        onClick={handleTestEmailGatewayPing}
                        disabled={emailGatewayTesting}
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', borderColor: 'rgba(14, 165, 233, 0.4)', color: '#38bdf8' }}
                      >
                        {emailGatewayTesting ? 'Menguji Koneksi Email...' : 'Uji Koneksi Gateway Email'}
                      </button>

                      <div style={{ padding: '0.75rem', background: 'rgba(14, 165, 233, 0.08)', borderRadius: '8px', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                        <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.78rem' }}>
                          Sistem Notifikasi Email Terpadu:
                        </div>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          Bot otomatis mengirimkan email notifikasi ke alamat penerima di atas sesuai jam kirim harian. Jika endpoint API belum diisi, pengiriman notifikasi otomatis tetap dicatat di Audit Log Antrean (Queued) dan dapat dikirim via aplikasi email default.
                        </p>
                      </div>
                    </div>
  );
};
