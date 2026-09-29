/**
 * NotifWhatsAppConnectorCard.jsx
 * Diekstrak dari NotifTabSettings.jsx (baris 409-494).
 * Sumber: Kartu Konektor WhatsApp Gateway API
 */
import React from 'react';
import { Smartphone } from 'lucide-react';

export const NotifWhatsAppConnectorCard = ({
  gatewayTesting,
  handleTestGatewayPing,
  notificationSettings,
  updateAutoSendConfig,
}) => {
  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'center', gap: '0.5rem' }}>
                          <Smartphone size={18} color="#22c55e" />
                          <span>Konektor WhatsApp Gateway API</span>
                        </h4>
                        <span className="badge badge-success">Resmi</span>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Provider WhatsApp API
                        </label>
                        <select
                          value={notificationSettings?.autoSend?.whatsappGateway?.provider || 'Wablas API'}
                          onChange={(e) => updateAutoSendConfig({
                            whatsappGateway: {
                              ...notificationSettings?.autoSend?.whatsappGateway,
                              provider: e.target.value
                            }
                          })}
                          className="select-control"
                        >
                          <option value="Wablas API">Wablas Gateway API (Indonesia / Cloud)</option>
                          <option value="Fonnte API">Fonnte WhatsApp API Gateway</option>
                          <option value="Twilio WhatsApp">Twilio WhatsApp Business API</option>
                          <option value="Custom Webhook">Custom HTTP Webhook POST</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          API Endpoint URL
                        </label>
                        <input
                          type="text"
                          value={notificationSettings?.autoSend?.whatsappGateway?.apiUrl || ''}
                          onChange={(e) => updateAutoSendConfig({
                            whatsappGateway: {
                              ...notificationSettings?.autoSend?.whatsappGateway,
                              apiUrl: e.target.value
                            }
                          })}
                          className="input-control mono"
                          placeholder="https://kalsel.wablas.com/api/send-message"
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          API Token / Secret Key
                        </label>
                        <input
                          type="password"
                          value={notificationSettings?.autoSend?.whatsappGateway?.apiKey || ''}
                          onChange={(e) => updateAutoSendConfig({
                            whatsappGateway: {
                              ...notificationSettings?.autoSend?.whatsappGateway,
                              apiKey: e.target.value
                            }
                          })}
                          className="input-control mono"
                          placeholder="Masukkan API Token / Authorization Bearer"
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '0.6rem' }}>
                        <button
                          onClick={handleTestGatewayPing}
                          disabled={gatewayTesting}
                          className="btn btn-secondary btn-sm"
                          style={{ width: '100%' }}
                        >
                          {gatewayTesting ? 'Menguji Gateway...' : 'Uji Koneksi Gateway API'}
                        </button>
                      </div>

                      <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                        <div style={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.78rem' }}>
                          Catatan Headless Auto-Send WA:
                        </div>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          Jika token API Gateway diisi, pengiriman notifikasi WhatsApp akan berjalan secara background otomatis tanpa harus mengklik tab browser. Jika token dikosongkan, sistem beralih ke WhatsApp Web Direct Link & Audit Log.
                        </p>
                      </div>
                    </div>
  );
};
