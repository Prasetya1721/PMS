/**
 * DocFormNotifSection.jsx
 * Diekstrak dari DocumentFormModal.jsx (baris 2391-2636).
 * Sumber: Blok 7: pengaturan notifikasi & pengingat expired
 */
import React from 'react';
import { BellRing, Clock, Mail } from 'lucide-react';
import { calculateReminderDate } from './docFormHelpers';
import { formatIndonesianDate } from './docFormHelpers';

export const DocFormNotifSection = ({
  effectiveReminder,
  formData,
  manualAmount,
  manualCustomDate,
  manualUnit,
  reminderMode,
  setFormData,
  setManualAmount,
  setManualCustomDate,
  setManualUnit,
  setReminderMode,
  updateReminderChannel,
}) => {
  return (
    <div style={{
                padding: '1rem 1.25rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(56, 189, 248, 0.05) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                {/* Header Section with Title & Master Toggle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '8px',
                      background: 'rgba(245, 158, 11, 0.2)',
                      color: '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <BellRing size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span>Pengaturan Notifikasi & Pengingat Expired</span>
                        <span className="badge" style={{ fontSize: '0.65rem', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                          Dropdown & Manual
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                        Pilih interval notifikasi sebelum dokumen jatuh tempo (pilih cepat atau ketik manual).
                      </div>
                    </div>
                  </div>

                  {/* Master Toggle */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={formData.notificationReminders?.enabled !== false}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setFormData(prev => ({
                          ...prev,
                          notificationReminders: {
                            ...prev.notificationReminders,
                            enabled: val
                          }
                        }));
                      }}
                      style={{ width: '15px', height: '15px', accentColor: '#f59e0b', cursor: 'pointer' }}
                    />
                    <span style={{ color: formData.notificationReminders?.enabled !== false ? '#10b981' : 'var(--text-muted)' }}>
                      {formData.notificationReminders?.enabled !== false ? '● Notifikasi Aktif' : '○ Nonaktif'}
                    </span>
                  </label>
                </div>

                {formData.notificationReminders?.enabled !== false && (
                  <>
                    {/* Single Row: Simple Dropdown & Manual Input Controls */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: (reminderMode === 'MANUAL_INTERVAL' || reminderMode === 'MANUAL_DATE') ? '1.2fr 1.1fr' : '1fr',
                      gap: '0.75rem',
                      alignItems: 'flex-end'
                    }}>
                      {/* Dropdown Selector */}
                      <div>
                        <label className="field-label" style={{ fontSize: '0.75rem', marginBottom: '0.3rem', color: '#f59e0b' }}>
                          Waktu Pengingat Sebelum Expired *
                        </label>
                        <select
                          value={reminderMode}
                          onChange={(e) => setReminderMode(e.target.value)}
                          className="select-control"
                          style={{ fontWeight: 600, background: 'var(--bg-surface)' }}
                        >
                          <optgroup label="Pilihan Pengingat (Standar)">
                            <option value="1y">1 Tahun Sebelumnya (H-365)</option>
                            <option value="6m">6 Bulan Sebelumnya (H-180)</option>
                            <option value="3m">3 Bulan Sebelumnya (H-90)</option>
                            <option value="1m">1 Bulan Sebelumnya (H-30)</option>
                            <option value="2w">2 Minggu Sebelumnya (H-14)</option>
                            <option value="1w">1 Minggu Sebelumnya (H-7)</option>
                            <option value="3d">3 Hari Sebelumnya (H-3)</option>
                            <option value="1d">1 Hari Sebelumnya (H-1)</option>
                          </optgroup>
                          <optgroup label="✍️ Isi Manual (Kustom Bebas)">
                            <option value="MANUAL_INTERVAL">✍️ Isi Manual: Tentukan Jumlah Hari / Minggu / Bulan / Tahun...</option>
                            <option value="MANUAL_DATE">📅 Isi Manual: Pilih Tanggal Pengingat Kalender Sendiri...</option>
                          </optgroup>
                        </select>
                      </div>

                      {/* Manual Interval Input */}
                      {reminderMode === 'MANUAL_INTERVAL' && (
                        <div>
                          <label className="field-label" style={{ fontSize: '0.75rem', marginBottom: '0.3rem', color: '#38bdf8' }}>
                            Isi Manual: Mau Berapa Lama Sebelum Expired?
                          </label>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <input
                              type="number"
                              min="1"
                              max="3650"
                              value={manualAmount}
                              onChange={(e) => setManualAmount(Math.max(1, parseInt(e.target.value) || 1))}
                              className="input-control mono"
                              style={{ width: '85px', fontWeight: 700, textAlign: 'center' }}
                              placeholder="45"
                            />
                            <select
                              value={manualUnit}
                              onChange={(e) => setManualUnit(e.target.value)}
                              className="select-control"
                              style={{ flex: 1, fontWeight: 600 }}
                            >
                              <option value="day">Hari Sebelum Expired</option>
                              <option value="week">Minggu Sebelum Expired</option>
                              <option value="month">Bulan Sebelum Expired</option>
                              <option value="year">Tahun Sebelum Expired</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Manual Calendar Date Input */}
                      {reminderMode === 'MANUAL_DATE' && (
                        <div>
                          <label className="field-label" style={{ fontSize: '0.75rem', marginBottom: '0.3rem', color: '#38bdf8' }}>
                            Pilih Tanggal Pengingat Kalender:
                          </label>
                          <input
                            type="date"
                            value={manualCustomDate || calculateReminderDate(formData.expiryDate, 'month', 1) || ''}
                            onClick={(e) => {
                              try { e.target.showPicker(); } catch (_) {}
                            }}
                            onChange={(e) => setManualCustomDate(e.target.value)}
                            className="input-control mono"
                            style={{ fontWeight: 700, cursor: 'pointer' }}
                            title="Klik untuk memilih tanggal dari kalender"
                          />
                        </div>
                      )}
                    </div>

                    {/* Status Hasil Kalkulasi & Channels */}
                    <div style={{
                      padding: '0.55rem 0.85rem',
                      borderRadius: '8px',
                      background: 'rgba(0, 0, 0, 0.25)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      fontSize: '0.75rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                        <Clock size={13} color="#f59e0b" />
                        <span>Jadwal Notifikasi:</span>
                        <strong style={{ color: '#38bdf8', fontSize: '0.82rem' }}>
                          🔔 {formatIndonesianDate(effectiveReminder.alertDate)}
                        </strong>
                        {effectiveReminder.daysBefore !== undefined && (
                          <span style={{ color: effectiveReminder.daysBefore > 0 ? '#10b981' : '#ef4444', fontSize: '0.7rem' }}>
                            ({effectiveReminder.daysBefore > 0 ? `${effectiveReminder.daysBefore} hari sebelum jatuh tempo` : 'Hari H / Lewat'})
                          </span>
                        )}
                      </div>

                      {/* Saluran Notifikasi */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', color: '#22c55e', fontWeight: 600 }}>
                          <input
                            type="checkbox"
                            checked={formData.notificationReminders?.channels?.whatsapp !== false}
                            onChange={(e) => updateReminderChannel('whatsapp', e.target.checked)}
                            style={{ accentColor: '#22c55e', cursor: 'pointer' }}
                          />
                          <span>WhatsApp WA</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', color: '#0ea5e9', fontWeight: 600 }}>
                          <input
                            type="checkbox"
                            checked={formData.notificationReminders?.channels?.email !== false}
                            onChange={(e) => updateReminderChannel('email', e.target.checked)}
                            style={{ accentColor: '#0ea5e9', cursor: 'pointer' }}
                          />
                          <span>Email</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', color: '#38bdf8', fontWeight: 600 }}>
                          <input
                            type="checkbox"
                            checked={formData.notificationReminders?.channels?.googleCalendar !== false}
                            onChange={(e) => updateReminderChannel('googleCalendar', e.target.checked)}
                            style={{ accentColor: '#38bdf8', cursor: 'pointer' }}
                          />
                          <span>Google Calendar</span>
                        </label>
                      </div>
                    </div>

                    {/* Optional Email Recipient Field when Email Notification is enabled */}
                    {formData.notificationReminders?.channels?.email !== false && (
                      <div style={{
                        padding: '0.45rem 0.75rem',
                        borderRadius: '8px',
                        background: 'rgba(14, 165, 233, 0.08)',
                        border: '1px solid rgba(14, 165, 233, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.75rem'
                      }}>
                        <Mail size={14} color="#0ea5e9" style={{ flexShrink: 0 }} />
                        <span style={{ color: 'var(--text-subtle)', whiteSpace: 'nowrap', fontWeight: 600 }}>
                          Alamat Email Notifikasi:
                        </span>
                        <input
                          type="email"
                          value={formData.notificationReminders?.emailRecipient || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              notificationReminders: {
                                ...prev.notificationReminders,
                                emailRecipient: val
                              }
                            }));
                          }}
                          placeholder="Default otomatis (admin / operasional kapal) atau ketik email khusus..."
                          className="input-control mono"
                          style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', height: '28px', flex: 1 }}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
  );
};
