import React, { useState, useEffect } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  User,
  Mail,
  Phone,
  Camera,
  Lock,
  Save,
  X,
  Shield,
  Eye,
  EyeOff,
  CheckCircle
} from 'lucide-react';

export const ProfileSettingsModal = ({ onClose }) => {
  const { currentUser, updateUserProfile, theme, showToast } = usePMS();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    title: '',
  });
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        avatar: currentUser.avatar || '',
        title: currentUser.title || '',
      });
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const handleSave = () => {
    if (!formData.name.trim()) {
      showToast('Nama tidak boleh kosong!', 'warning');
      return;
    }
    if (!formData.email.trim()) {
      showToast('Email tidak boleh kosong!', 'warning');
      return;
    }

    const profileUpdates = { ...formData };

    // Handle password change
    if (showPasswordSection && newPassword) {
      if (newPassword !== confirmPassword) {
        showToast('Kata sandi baru dan konfirmasi tidak cocok!', 'warning');
        return;
      }
      if (newPassword.length < 3) {
        showToast('Kata sandi minimal 3 karakter!', 'warning');
        return;
      }
      profileUpdates.password = newPassword;
    }

    updateUserProfile(currentUser.id, profileUpdates);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  const inputStyle = {
    width: '100%',
    padding: '0.65rem 0.85rem',
    paddingLeft: '2.5rem',
    borderRadius: '8px',
    border: '1px solid var(--border-subtle)',
    background: 'var(--bg-surface)',
    color: 'var(--text-main)',
    fontSize: '0.85rem',
    outline: 'none',
    transition: 'border-color 0.15s ease',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    marginBottom: '0.35rem',
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      animation: 'fadeIn 0.2s ease-out',
    }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        width: '520px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: theme === 'light' ? '#ffffff' : 'var(--bg-surface)',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
        animation: 'fadeIn 0.25s ease-out',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 1.75rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(2, 132, 199, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <User size={20} color="#0284c7" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Pengaturan Profil
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', margin: 0, marginTop: '0.1rem' }}>
                {currentUser.role}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.35rem',
            borderRadius: '6px',
            display: 'flex',
          }}>
            <X size={20} />
          </button>
        </div>

        {/* Avatar Preview */}
        <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0284c7, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: '3px solid var(--border-subtle)',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
          }}>
            {formData.avatar ? (
              <img src={formData.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
                {(formData.name || 'U').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div style={{
            padding: '0.3rem 0.75rem',
            borderRadius: '20px',
            background: 'rgba(2, 132, 199, 0.1)',
            border: '1px solid rgba(2, 132, 199, 0.25)',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}>
            <Shield size={12} />
            {currentUser.role}
          </div>
        </div>

        {/* Form Fields */}
        <div style={{ padding: '0 1.75rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>Nama Lengkap</label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input style={inputStyle} value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="Nama lengkap..." />
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={labelStyle}>Jabatan</label>
            <div style={{ position: 'relative' }}>
              <Shield size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input style={inputStyle} value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} placeholder="Jabatan..." />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input style={inputStyle} type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} placeholder="email@baharimas.co.id" />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label style={labelStyle}>Nomor Telepon</label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input style={inputStyle} value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} placeholder="+62 812-xxxx-xxxx" />
            </div>
          </div>

          {/* Avatar URL */}
          <div>
            <label style={labelStyle}>URL Foto Profil (Avatar)</label>
            <div style={{ position: 'relative' }}>
              <Camera size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input style={inputStyle} value={formData.avatar} onChange={e => setFormData(p => ({ ...p, avatar: e.target.value }))} placeholder="https://example.com/photo.jpg" />
            </div>
          </div>

          {/* Password Section */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '0.25rem' }}>
            <button
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#0284c7',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 600,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Lock size={14} />
              {showPasswordSection ? 'Batal Ubah Kata Sandi' : 'Ubah Kata Sandi'}
            </button>

            {showPasswordSection && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.85rem' }}>
                <div>
                  <label style={labelStyle}>Kata Sandi Baru</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      style={inputStyle}
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Masukkan kata sandi baru..."
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.85rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-subtle)',
                        cursor: 'pointer',
                        display: 'flex',
                      }}
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Konfirmasi Kata Sandi</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input style={inputStyle} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Ulangi kata sandi baru..." />
                  </div>
                  {confirmPassword && newPassword && confirmPassword !== newPassword && (
                    <span style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '0.25rem', display: 'block' }}>
                      ⚠ Kata sandi tidak cocok
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '1rem 1.75rem 1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'flex-end',
        }}>
          <button className="btn btn-secondary" onClick={onClose} style={{ padding: '0.6rem 1.2rem' }}>
            Batal
          </button>
          <button className="btn btn-primary" onClick={handleSave} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.6rem 1.5rem',
          }}>
            {saved ? (
              <>
                <CheckCircle size={15} />
                Tersimpan!
              </>
            ) : (
              <>
                <Save size={15} />
                Simpan Profil
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
