/**
 * EquipNotesSection.jsx
 * Diekstrak dari EquipmentFormModal.jsx (baris 769-792).
 * Sumber: Seksi Catatan Teknis & Rekomendasi Operasional
 */
import React from 'react';
import { FileText } from 'lucide-react';

export const EquipNotesSection = ({
  notes,
  setNotes,
  theme,
}) => {
  return (
    <div
                  style={{
                    background: theme === 'light' ? '#f8fafc' : 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '1.25rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <FileText size={18} color="#10b981" />
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                      Catatan Teknis & Rekomendasi Operasional
                    </h4>
                  </div>

                  <textarea
                    rows="3"
                    placeholder="Contoh: Tekanan oli standar 4.5 bar, temperatur air pendingin 75-80°C. Menggunakan oli SAE 40 TBN 12. Rekomendasi servis injector tiap 1000 jam."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="input-control"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
  );
};
