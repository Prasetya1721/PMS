/**
 * NotifTabSettings.jsx
 * Diekstrak dari NotificationCenter.jsx (baris 996-1629).
 * Sumber: Tab 3: pengaturan ambang, auto-send, jam kirim
 */
import React from 'react';
import { Mail, Plus, Smartphone, Trash2, Zap } from 'lucide-react';

export const NotifTabSettings = ({
  currentTimeStr,
  emailGatewayTesting,
  gatewayTesting,
  handleAddCustomThresholdSubmit,
  handleRequestBrowserNotification,
  handleTestEmailGatewayPing,
  handleTestGatewayPing,
  newCustDays,
  newCustDesc,
  newCustLabel,
  notificationSettings,
  removeCustomThreshold,
  setNewCustDays,
  setNewCustDesc,
  setNewCustLabel,
  setTestScheduleTimeNowPlusOneMinute,
  toggleThresholdActive,
  toggleThresholdChannel,
  updateAutoSendConfig,
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem' }}>
              {/* Left Column: Presets & Custom Thresholds */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Preset Thresholds */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                      Pengaturan Ambang Batas Inti (Core Interval Presets)
                    </h4>
                    <span className="badge badge-info">1 Hari, 1 Mgg, 1 Bln, 1 Thn</span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    Tentukan interval pengingat yang aktif beserta kanal notifikasi (WhatsApp & Google Calendar) untuk setiap ambang batas:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {(notificationSettings.thresholds || []).map((th) => (
                      <div
                        key={th.id}
                        style={{
                          padding: '1rem',
                          borderRadius: '8px',
                          background: 'var(--bg-surface-elevated)',
                          border: th.enabled ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid var(--border-subtle)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.75rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <input
                            type="checkbox"
                            checked={th.enabled}
                            onChange={() => toggleThresholdActive(th.id, false)}
                            style={{ width: '18px', height: '18px', accentColor: '#0284c7', cursor: 'pointer' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: th.enabled ? 'var(--text-main)' : 'var(--text-muted)' }}>
                              {th.label}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {th.description}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          {/* Channel toggles */}
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={th.notifyChannels.includes('WhatsApp')}
                              onChange={() => toggleThresholdChannel(th.id, 'WhatsApp', false)}
                              disabled={!th.enabled}
                              style={{ accentColor: '#22c55e' }}
                            />
                            <span>WA</span>
                          </label>

                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={th.notifyChannels.includes('Email')}
                              onChange={() => toggleThresholdChannel(th.id, 'Email', false)}
                              disabled={!th.enabled}
                              style={{ accentColor: '#0ea5e9' }}
                            />
                            <span style={{ color: '#38bdf8', fontWeight: 600 }}>Email</span>
                          </label>

                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={th.notifyChannels.includes('Google Calendar')}
                              onChange={() => toggleThresholdChannel(th.id, 'Google Calendar', false)}
                              disabled={!th.enabled}
                              style={{ accentColor: '#38bdf8' }}
                            />
                            <span>G-Cal</span>
                          </label>

                          <span className="badge badge-info mono" style={{ fontSize: '0.72rem' }}>
                            {th.days} Hari
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Thresholds Section */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Plus size={18} color="#38bdf8" />
                      <span>Ambang Batas Kustom (Custom Days)</span>
                    </h4>
                    <span className="badge badge-neutral">Fleksibel</span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    Tambahkan jumlah hari khusus sesuai standar operasional PT. Pelayaran Baharimas Kalimantan (contoh: H-14, H-60, H-90, atau lainnya):
                  </p>

                  {/* List of existing custom thresholds */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {(notificationSettings.customThresholds || []).map((cth) => (
                      <div
                        key={cth.id}
                        style={{
                          padding: '0.85rem 1rem',
                          borderRadius: '8px',
                          background: 'var(--bg-surface-elevated)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.5rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <input
                            type="checkbox"
                            checked={cth.enabled}
                            onChange={() => toggleThresholdActive(cth.id, true)}
                            style={{ width: '17px', height: '17px', accentColor: '#0284c7', cursor: 'pointer' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{cth.label}</div>
                            <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{cth.description}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={cth.notifyChannels.includes('WhatsApp')}
                              onChange={() => toggleThresholdChannel(cth.id, 'WhatsApp', true)}
                              disabled={!cth.enabled}
                              style={{ accentColor: '#22c55e' }}
                            />
                            <span>WA</span>
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={cth.notifyChannels.includes('Email')}
                              onChange={() => toggleThresholdChannel(cth.id, 'Email', true)}
                              disabled={!cth.enabled}
                              style={{ accentColor: '#0ea5e9' }}
                            />
                            <span style={{ color: '#38bdf8', fontWeight: 600 }}>Email</span>
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={cth.notifyChannels.includes('Google Calendar')}
                              onChange={() => toggleThresholdChannel(cth.id, 'Google Calendar', true)}
                              disabled={!cth.enabled}
                              style={{ accentColor: '#38bdf8' }}
                            />
                            <span>G-Cal</span>
                          </label>

                          <span className="badge badge-neutral mono" style={{ fontSize: '0.72rem' }}>
                            H-{cth.days}
                          </span>

                          <button
                            onClick={() => removeCustomThreshold(cth.id)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#ef4444', padding: '0.2rem 0.45rem' }}
                            title="Hapus ambang batas kustom"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Form to Add New Custom Threshold */}
                  <form
                    onSubmit={handleAddCustomThresholdSubmit}
                    style={{
                      padding: '1rem',
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: '8px',
                      border: '1px dashed var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#38bdf8' }}>
                      + Tambah Ambang Batas Kustom Baru
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                          Jumlah Hari:
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="1825"
                          value={newCustDays}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewCustDays(val);
                            setNewCustLabel(`H-${val} Hari (Kustom)`);
                          }}
                          className="input-control mono"
                          placeholder="14"
                          required
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                          Label Notifikasi:
                        </label>
                        <input
                          type="text"
                          value={newCustLabel}
                          onChange={(e) => setNewCustLabel(e.target.value)}
                          className="input-control"
                          placeholder="Contoh: H-14 Hari Persiapan Kru"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        Deskripsi Tujuan Pengingat:
                      </label>
                      <input
                        type="text"
                        value={newCustDesc}
                        onChange={(e) => setNewCustDesc(e.target.value)}
                        className="input-control"
                        placeholder="Contoh: Konfirmasi kesiapan kru dan survey kapal"
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                      <button type="submit" className="btn btn-secondary btn-sm" style={{ color: '#38bdf8' }}>
                        <Plus size={14} />
                        <span>Tambahkan ke Sistem</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column: Auto-Send Engine & Jam Pengiriman & WhatsApp Gateway */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Auto-Send Engine Settings */}
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Zap size={18} color="#f59e0b" />
                      <span>Mesin Kirim Otomatis (Auto-Send Bot)</span>
                    </h4>
                    <span className="badge badge-warning">Realtime Clock</span>
                  </div>

                  {/* Master Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Status Pengiriman Otomatis</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Otomatis kirim Email, WhatsApp & sinkron Google Calendar
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings?.autoSend?.enabled}
                      onChange={(e) => updateAutoSendConfig({ enabled: e.target.checked })}
                      style={{ width: '22px', height: '22px', accentColor: '#22c55e', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Auto-Send Active Channels Toggle */}
                  <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      Kanal Aktif Mesin Pengiriman Otomatis:
                    </span>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={notificationSettings?.autoSend?.channels?.email ?? true}
                          onChange={(e) => updateAutoSendConfig({
                            channels: { ...(notificationSettings?.autoSend?.channels || {}), email: e.target.checked }
                          })}
                          style={{ accentColor: '#0ea5e9' }}
                        />
                        <span style={{ fontWeight: 700, color: '#38bdf8' }}>Email Otomatis (SMTP/REST)</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={notificationSettings?.autoSend?.channels?.whatsapp ?? true}
                          onChange={(e) => updateAutoSendConfig({
                            channels: { ...(notificationSettings?.autoSend?.channels || {}), whatsapp: e.target.checked }
                          })}
                          style={{ accentColor: '#22c55e' }}
                        />
                        <span>WhatsApp</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={notificationSettings?.autoSend?.channels?.googleCalendar ?? true}
                          onChange={(e) => updateAutoSendConfig({
                            channels: { ...(notificationSettings?.autoSend?.channels || {}), googleCalendar: e.target.checked }
                          })}
                          style={{ accentColor: '#38bdf8' }}
                        />
                        <span>Google Calendar</span>
                      </label>
                    </div>
                  </div>

                  {/* Jam Pengiriman Configuration */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Jam Eksekusi Pengiriman Otomatis (WIB)
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="time"
                        value={notificationSettings?.autoSend?.scheduleTime || '08:00'}
                        onChange={(e) => updateAutoSendConfig({ scheduleTime: e.target.value })}
                        className="input-control mono"
                        style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}
                      />
                      <button
                        onClick={setTestScheduleTimeNowPlusOneMinute}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#f59e0b', whiteSpace: 'nowrap' }}
                        title="Uji coba otomatis: atur jam ke menit berikutnya"
                      >
                        ⚡ Test Sekarang (+1 Menit)
                      </button>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      Jam lokal saat ini: <strong className="mono" style={{ color: '#fff' }}>{currentTimeStr}</strong> WIB. Setiap kali jarum jam mencapai waktu ini, bot secara otomatis memindai dan mengirimkan notifikasi.
                    </p>
                  </div>

                  {/* Desktop Browser Notification Toggle */}
                  <div style={{ padding: '0.9rem', background: 'rgba(2, 132, 199, 0.08)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#38bdf8' }}>
                        Notifikasi Desktop Browser (Push Chime)
                      </div>
                      <button
                        onClick={handleRequestBrowserNotification}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}
                      >
                        Aktifkan Izin Browser
                      </button>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Memberikan peringatan pop-up audio chime langsung di komputer admin/nakhoda saat ada dokumen yang menyentuh ambang batas.
                    </p>
                  </div>
                </div>

                {/* WhatsApp Gateway API Configuration */}
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

                {/* Email Gateway API & SMTP Configuration */}
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
              </div>
            </div>
  );
};
