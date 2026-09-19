import React, { useState, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  MessageSquare,
  Send,
  Mail,
  X,
  Copy,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Phone,
  Ship,
  Building2,
  Check,
  Zap
} from 'lucide-react';
import { calculateNCRange, formatIndoDate } from '../../utils/auditTimeUtils';

export const AuditNotificationModal = ({ finding, onClose }) => {
  const { vessels, sendAuditWhatsAppNotification, sendAuditEmailNotification, showToast, theme } = usePMS();

  if (!finding) return null;

  const isClosed = finding.status === 'NC Close';
  const isOpen = finding.status === 'NC Open';
  const isSubmitted = finding.status === 'Eviden Submitted';
  const ncRange = useMemo(() => calculateNCRange(finding), [finding]);

  const vessel = vessels.find(v => v.id === finding.vesselId);
  const vesselName = finding.targetName || vessel?.name || 'Kantor Pusat PT. PBK';

  // Available maritime recipients with both phone and email
  const recipientPresets = useMemo(() => [
    {
      id: 'nakhoda',
      label: `Nakhoda (${vessel?.masterCaptain || 'Capt. Nakhoda'})`,
      role: 'Nakhoda Kapal',
      phone: '6281234567890',
      email: 'nakhoda@baharimas.co.id'
    },
    {
      id: 'kkm',
      label: `KKM / Chief Engineer (${vessel?.chiefEngineer || 'KKM Mesin'})`,
      role: 'Kepala Kamar Mesin (KKM)',
      phone: '6281298765432',
      email: 'kkm@baharimas.co.id'
    },
    {
      id: 'dpa',
      label: 'DPA & Marine Superintendent (Pontianak)',
      role: 'Designated Person Ashore (DPA)',
      phone: '6281288991122',
      email: 'dpa.baharimas@gmail.com'
    },
    {
      id: 'pic',
      label: `PIC Penanggung Jawab (${finding.assignedTo || 'PIC Terkait'})`,
      role: finding.assignedTo || 'PIC Penanggung Jawab',
      phone: '6281344556677',
      email: 'operations@baharimas.co.id'
    },
    {
      id: 'custom',
      label: 'Penerima Kustom...',
      role: 'Penerima Kustom',
      phone: '',
      email: ''
    }
  ], [vessel, finding]);

  const [selectedChannel, setSelectedChannel] = useState('whatsapp'); // 'whatsapp' | 'email'
  const [selectedRecipientId, setSelectedRecipientId] = useState(isClosed ? 'dpa' : 'nakhoda');
  const [customPhone, setCustomPhone] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customRecipientName, setCustomRecipientName] = useState('');
  const [copied, setCopied] = useState(false);

  const activeRecipient = useMemo(() => {
    if (selectedRecipientId === 'custom') {
      return {
        role: customRecipientName.trim() || 'Penerima Khusus',
        phone: customPhone.trim() || '6281200000000',
        email: customEmail.trim() || 'fleet.ops@baharimas.co.id'
      };
    }
    const found = recipientPresets.find(p => p.id === selectedRecipientId);
    return found || recipientPresets[0];
  }, [selectedRecipientId, recipientPresets, customPhone, customEmail, customRecipientName]);

  // Formatted WhatsApp Message with full Rentang Waktu
  const generatedMessage = useMemo(() => {
    if (isClosed) {
      return `*✅ NOTIFIKASI PENUTUPAN TEMUAN AUDIT (NC CLOSE)*\n` +
        `_PT. Pelayaran Baharimas Kalimantan - Sistem PMS & SMS_\n\n` +
        `Kepada Yth: *${activeRecipient.role}*\n` +
        `Kapal / Entitas: *${vesselName}*\n` +
        `No. Temuan: *${finding.findingNo}* [${finding.category}]\n` +
        `Klausul ISM: *${finding.clauseCode} - ${finding.clauseName}*\n` +
        `Standar Audit: *${finding.standard} (ISM Code)*\n\n` +
        `*HASIL VERIFIKASI & CLOSING:*\n` +
        `Tindakan koreksi dan dokumen eviden perbaikan telah diverifikasi efektif oleh Lead Auditor DPA / Surveyor BKI. Status temuan resmi dinyatakan *NC CLOSE (TUNTAS)*.\n\n` +
        `*⏱️ LAPORAN EFISIENSI RENTANG WAKTU (LEAD TIME):*\n` +
        `• Tanggal Audit Dibuka: *${ncRange?.openDateStr || finding.dateIdentified}*\n` +
        `• Target Batas Awal: *${ncRange?.dueDateStr || finding.dueDate}*\n` +
        `• Tanggal Ditutup Resmi: *${ncRange?.closedDateStr || 'Hari ini'}*\n` +
        `• Durasi Penyelesaian: *${ncRange?.resolutionDays || 1} Hari* (${ncRange?.varianceText || 'Tepat Waktu'})\n\n` +
        `Status Kepatuhan: *100% COMPLIANT (IMO ISM CODE & BKI)*\n\n` +
        `_Pusat Pengendali Kepatuhan Armada PT. Pelayaran Baharimas Kalimantan_`;
    } else {
      const lateInfo = ncRange?.isOverdue
        ? `🚨 STATUS: MELEWATI BATAS WAKTU (${Math.abs(ncRange.remainingDays)} Hari Overdue)!`
        : `⏳ STATUS: NC TERBUKA (Berjalan ${ncRange?.activeDays} hari, sisa ${ncRange?.remainingDays} hari lagi)`;

      const subStatus = isSubmitted ? '(Eviden Perbaikan Sedang Ditinjau Auditor)' : '(Wajib Pengajuan CAP & Eviden)';

      return `*🚨 NOTIFIKASI TEMUAN AUDIT ISM CODE (NC OPEN)*\n` +
        `_PT. Pelayaran Baharimas Kalimantan - Sistem PMS & SMS_\n\n` +
        `Kepada Yth: *${activeRecipient.role}*\n` +
        `Kapal / Entitas: *${vesselName}*\n` +
        `No. Temuan: *${finding.findingNo}* [${finding.category}] ${subStatus}\n` +
        `Klausul ISM: *${finding.clauseCode} - ${finding.clauseName}*\n` +
        `Standar Audit: *${finding.standard} (ISM Code)*\n\n` +
        `*Deskripsi Temuan:*\n"${finding.description}"\n\n` +
        `*📅 RENTANG WAKTU TINDAKAN KOREKTIF (CAP):*\n` +
        `• Tanggal Audit Dibuka: *${ncRange?.openDateStr || finding.dateIdentified}*\n` +
        `• Target Batas Akhir: *${ncRange?.dueDateStr || finding.dueDate}*\n` +
        `• ${lateInfo}\n\n` +
        `*TINDAKAN DIPERLUKAN:*\n` +
        `Nakhoda & KKM wajib memastikan tindakan korektif dilaksanakan dan dokumen/foto eviden diunggah ke Portal PMS Baharimas sebelum batas waktu berakhir.\n\n` +
        `_Pusat Pengendali Kepatuhan Armada PT. Pelayaran Baharimas Kalimantan_`;
    }
  }, [isClosed, isSubmitted, activeRecipient, vesselName, finding, ncRange]);

  // Formatted Email Subject & Message for ISM NC
  const generatedEmailSubject = useMemo(() => {
    if (isClosed) {
      return `[ISM NC CLOSE] Penyelesaian Temuan Audit ${finding.findingNo} — ${vesselName} (TUNTAS)`;
    }
    return `[ISM NC OPEN] Temuan Audit ISM Code ${finding.findingNo} — ${vesselName} (${finding.category})`;
  }, [isClosed, finding, vesselName]);

  const generatedEmailMessage = useMemo(() => {
    if (isClosed) {
      return `Kepada Yth: ${activeRecipient.role}\n` +
        `PT. Pelayaran Baharimas Kalimantan - Sistem PMS & SMS\n\n` +
        `Dengan hormat,\n\n` +
        `Bersama surat elektronik ini, diberitahukan bahwa temuan audit ISM Code berikut telah dinyatakan NC CLOSE (TUNTAS):\n\n` +
        `• No. Temuan: ${finding.findingNo} [${finding.category}]\n` +
        `• Kapal / Entitas: ${vesselName}\n` +
        `• Klausul ISM: ${finding.clauseCode} - ${finding.clauseName}\n` +
        `• Standar Audit: ${finding.standard} (ISM Code & BKI)\n` +
        `• Tanggal Audit Dibuka: ${ncRange?.openDateStr || finding.dateIdentified}\n` +
        `• Target Batas Awal: ${ncRange?.dueDateStr || finding.dueDate}\n` +
        `• Tanggal Ditutup Resmi: ${ncRange?.closedDateStr || 'Hari ini'}\n` +
        `• Durasi Penyelesaian: ${ncRange?.resolutionDays || 1} Hari (${ncRange?.varianceText || 'Tepat Waktu'})\n\n` +
        `HASIL VERIFIKASI & CLOSING:\n` +
        `Tindakan koreksi dan dokumen eviden perbaikan telah diverifikasi efektif oleh Lead Auditor DPA / Surveyor BKI. Status temuan resmi dinyatakan NC CLOSE.\n\n` +
        `Status Kepatuhan: 100% COMPLIANT (IMO ISM CODE & BKI)\n\n` +
        `Pusat Pengendali Kepatuhan Armada PT. Pelayaran Baharimas Kalimantan\n` +
        `Jl. Husin Hamzah / Komp. Ruko Bahari Mas, Pontianak, Kalimantan Barat`;
    } else {
      const lateInfo = ncRange?.isOverdue
        ? `STATUS: MELEWATI BATAS WAKTU (${Math.abs(ncRange.remainingDays)} Hari Overdue)!`
        : `STATUS: NC TERBUKA (Berjalan ${ncRange?.activeDays} hari, sisa ${ncRange?.remainingDays} hari lagi)`;

      const subStatus = isSubmitted ? '(Eviden Perbaikan Sedang Ditinjau Auditor)' : '(Wajib Pengajuan CAP & Eviden)';

      return `Kepada Yth: ${activeRecipient.role}\n` +
        `PT. Pelayaran Baharimas Kalimantan - Sistem PMS & SMS\n\n` +
        `Dengan hormat,\n\n` +
        `Diberitahukan bahwa terdapat temuan audit ISM Code (Non-Conformity) yang memerlukan tindakan korektif (CAP):\n\n` +
        `• No. Temuan: ${finding.findingNo} [${finding.category}] ${subStatus}\n` +
        `• Kapal / Entitas: ${vesselName}\n` +
        `• Klausul ISM: ${finding.clauseCode} - ${finding.clauseName}\n` +
        `• Standar Audit: ${finding.standard} (ISM Code)\n\n` +
        `DESKRIPSI TEMUAN:\n` +
        `"${finding.description}"\n\n` +
        `RENTANG WAKTU TINDAKAN KOREKTIF (CAP):\n` +
        `• Tanggal Audit Dibuka: ${ncRange?.openDateStr || finding.dateIdentified}\n` +
        `• Target Batas Akhir: ${ncRange?.dueDateStr || finding.dueDate}\n` +
        `• ${lateInfo}\n\n` +
        `TINDAKAN DIPERLUKAN:\n` +
        `Nakhoda & KKM wajib memastikan tindakan korektif dilaksanakan dan dokumen/foto eviden diunggah ke Portal PMS Baharimas sebelum batas waktu berakhir.\n\n` +
        `Pusat Pengendali Kepatuhan Armada PT. Pelayaran Baharimas Kalimantan\n` +
        `Jl. Husin Hamzah / Komp. Ruko Bahari Mas, Pontianak, Kalimantan Barat`;
    }
  }, [isClosed, isSubmitted, activeRecipient, vesselName, finding, ncRange]);

  const handleCopy = () => {
    const textToCopy = selectedChannel === 'whatsapp' ? generatedMessage : `${generatedEmailSubject}\n\n${generatedEmailMessage}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showToast(`Teks notifikasi ${selectedChannel === 'whatsapp' ? 'WhatsApp' : 'Email'} berhasil disalin!`, 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    sendAuditWhatsAppNotification(finding, isClosed ? 'close' : 'open', {
      phone: activeRecipient.phone,
      recipientName: activeRecipient.role,
      customMessage: generatedMessage
    });
    onClose();
  };

  const handleSendEmail = async (skipMailto = false) => {
    await sendAuditEmailNotification(finding, isClosed ? 'close' : 'open', {
      email: activeRecipient.email,
      recipientName: activeRecipient.role,
      customSubject: generatedEmailSubject,
      customMessage: generatedEmailMessage,
      skipMailto
    });
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1200 }}>
      <div
        className="modal-dialog"
        style={{
          maxWidth: '680px',
          width: '95%',
          background: 'var(--bg-surface)',
          borderRadius: '14px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.1rem 1.4rem',
            background: isClosed
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.05) 100%)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: isClosed ? '#10b981' : '#ef4444',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isClosed ? '0 4px 12px rgba(16, 185, 129, 0.35)' : '0 4px 12px rgba(239, 68, 68, 0.35)'
            }}>
              {selectedChannel === 'email' ? <Mail size={20} /> : <MessageSquare size={20} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                {isClosed
                  ? `Kirim Notifikasi NC Close (${selectedChannel === 'email' ? 'Email' : 'WhatsApp'})`
                  : `Kirim Notifikasi NC Open (${selectedChannel === 'email' ? 'Email' : 'WhatsApp'})`}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                {finding.findingNo} • {vesselName} ({finding.category})
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.55rem' }}>
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.25rem 1.4rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Channel Selector Toggle */}
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-surface-elevated)', padding: '0.4rem', borderRadius: '8px' }}>
            <button
              type="button"
              onClick={() => setSelectedChannel('whatsapp')}
              className={`btn btn-sm ${selectedChannel === 'whatsapp' ? 'btn-whatsapp' : 'btn-secondary'}`}
              style={{ flex: 1, fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
            >
              <MessageSquare size={14} />
              <span>Kanal WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedChannel('email')}
              className={`btn btn-sm ${selectedChannel === 'email' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: selectedChannel === 'email' ? '#fff' : '#38bdf8' }}
            >
              <Mail size={14} />
              <span>Kanal Email (Resmi)</span>
            </button>
          </div>

          {/* Rentang Waktu Quick Info */}
          {ncRange && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: ncRange.bgLight,
              border: `1px solid ${ncRange.borderColor}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }}>
                {isClosed ? <CheckCircle2 size={16} color="#10b981" /> : <Clock size={16} color={ncRange.color} />}
                <span>
                  <strong>Rentang Waktu: </strong>
                  {ncRange.openDateStr} s/d {isClosed ? ncRange.closedDateStr : ncRange.dueDateStr}
                </span>
              </div>
              <span className={`badge ${ncRange.badgeClass}`} style={{ fontSize: '0.72rem', fontWeight: 800 }}>
                {ncRange.badgeText}
              </span>
            </div>
          )}

          {/* Recipient Selector */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              Pilih Tujuan Penerima Notifikasi:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
              {recipientPresets.map(preset => {
                const isSelected = selectedRecipientId === preset.id;
                const contactInfo = selectedChannel === 'email' ? preset.email : preset.phone;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedRecipientId(preset.id)}
                    style={{
                      textAlign: 'left',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '8px',
                      border: isSelected ? '1.5px solid #0284c7' : '1px solid var(--border-subtle)',
                      background: isSelected ? 'rgba(2, 132, 199, 0.12)' : 'var(--bg-surface-elevated)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isSelected ? '#0284c7' : 'var(--text-main)' }}>
                      {preset.label}
                    </div>
                    {contactInfo && (
                      <div className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {contactInfo}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedRecipientId === 'custom' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginTop: '0.65rem' }}>
                <input
                  type="text"
                  placeholder="Nama Penerima (cth: Marine Superintendent)"
                  value={customRecipientName}
                  onChange={(e) => setCustomRecipientName(e.target.value)}
                  className="input-control"
                  style={{ fontSize: '0.78rem' }}
                />
                {selectedChannel === 'email' ? (
                  <input
                    type="email"
                    placeholder="Email (cth: superintendent@baharimas.co.id)"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="input-control mono"
                    style={{ fontSize: '0.78rem' }}
                  />
                ) : (
                  <input
                    type="text"
                    placeholder="Nomor WA (cth: 6281234567890)"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    className="input-control mono"
                    style={{ fontSize: '0.78rem' }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Message Preview (WhatsApp / Email Style) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                {selectedChannel === 'email' ? 'Pratinjau Subjek & Pesan Email:' : 'Pratinjau Pesan WhatsApp Otomatis:'}
              </span>
              <button
                onClick={handleCopy}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                <span>{copied ? 'Tersalin!' : 'Salin Pesan'}</span>
              </button>
            </div>

            {selectedChannel === 'email' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', fontSize: '0.78rem' }}>
                  <strong style={{ color: 'var(--text-muted)' }}>Subjek: </strong>
                  <span style={{ fontWeight: 700, color: '#38bdf8' }}>{generatedEmailSubject}</span>
                </div>
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: '10px',
                    background: theme === 'light' ? '#f8fafc' : 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid var(--border-subtle)',
                    fontFamily: 'monospace, system-ui',
                    fontSize: '0.78rem',
                    lineHeight: '1.5',
                    color: theme === 'light' ? '#111827' : '#f8fafc',
                    whiteSpace: 'pre-line',
                    maxHeight: '220px',
                    overflowY: 'auto'
                  }}
                >
                  {generatedEmailMessage}
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  background: theme === 'light' ? '#efeae2' : 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid var(--border-subtle)',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontSize: '0.8rem',
                  lineHeight: '1.5',
                  color: theme === 'light' ? '#111827' : '#f8fafc',
                  whiteSpace: 'pre-line',
                  maxHeight: '260px',
                  overflowY: 'auto'
                }}
              >
                {generatedMessage}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1rem 1.4rem',
            background: 'var(--bg-surface-elevated)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}
        >
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ fontWeight: 600 }}>
            Batal
          </button>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={handleCopy}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}
            >
              <Copy size={14} />
              <span>Salin Teks</span>
            </button>

            {selectedChannel === 'email' ? (
              <>
                <button
                  onClick={() => handleSendEmail(true)}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
                  title="Kirim via REST API Gateway / Cloud SMTP"
                >
                  <Zap size={14} />
                  <span>Kirim via Email API</span>
                </button>
                <button
                  onClick={() => handleSendEmail(false)}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
                  title="Buka draf di aplikasi email default"
                >
                  <Mail size={14} />
                  <span>Buka Aplikasi Email</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleSendWhatsApp}
                className="btn btn-whatsapp btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontWeight: 700,
                  padding: '0.45rem 1rem'
                }}
              >
                <Send size={15} />
                <span>Kirim via WhatsApp</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
