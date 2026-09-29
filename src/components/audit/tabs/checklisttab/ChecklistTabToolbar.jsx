/**
 * ChecklistTabToolbar.jsx
 * Diekstrak dari ChecklistTab.jsx (baris 55-108).
 * Sumber: Toolbar atas: judul checklist per organisasi dan tombol aksi ekspor/tambah
 */
import React from 'react';
import { Plus, Printer } from 'lucide-react';
import { isBKIOrganization } from '../../../../data/auditMasterData';

export const ChecklistTabToolbar = ({
  activeChecklistConfig,
  activeSession,
  currentTarget,
  getEnrichedReportSession,
  isAuditorOrDPA,
  setReportModalFinding,
  setReportModalMode,
  setReportModalOpen,
  setReportModalSession,
  setShowManualCodeForm,
  showManualCodeForm,
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              {isBKIOrganization(activeChecklistConfig.organizationId) || activeChecklistConfig.organizationId === 'internal' ? (
                <>
                  <span>Checklist {activeChecklistConfig.organizationId === 'internal' ? 'Audit Internal' : 'Resmi BKI'} ({currentTarget.standard === 'DOC' ? 'DOC Rev 06' : 'SMS Shipboard Rev 05'})</span>
                  <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>Standar BKI ({currentTarget.standard === 'DOC' ? '13 Seksi' : '74 Butir'})</span>
                </>
              ) : (
                <>
                  <span>Checklist Audit {activeChecklistConfig.organizationName}</span>
                  <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>Format Mandiri (Non-BKI)</span>
                </>
              )}
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {isBKIOrganization(activeChecklistConfig.organizationId) || activeChecklistConfig.organizationId === 'internal'
                ? (currentTarget.standard === 'DOC'
                    ? 'Pemeriksaan kepatuhan kantor pusat PT. PBK mengadopsi standar resmi BKI F23.14.05-2025 Rev 06 (13 seksi ISM Code).'
                    : `Pemeriksaan komprehensif seluruh area operasional kapal ${currentTarget.name} mengadopsi standar BKI F23.14.06-2024 Rev 05 (74 butir checklist).`)
                : `Format checklist pemeriksaan untuk ${activeChecklistConfig.organizationName} disesuaikan secara mandiri. Template resmi BKI dipisahkan agar tidak terpakai oleh lembaga ini.`}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setReportModalSession(getEnrichedReportSession(activeSession || currentTarget.lastAudit));
                setReportModalFinding(null);
                setReportModalMode('checklist');
                setReportModalOpen(true);
              }}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#0284c7' }}
              title={isBKIOrganization(activeChecklistConfig.organizationId)
                ? "Cetak Formulir Resmi BKI SMS Shipboard Checklist Rev 05 format A4 / PDF"
                : `Cetak Formulir Checklist Audit ${activeChecklistConfig.organizationName}`}
            >
              <Printer size={14} />
              <span>Cetak Checklist (PDF)</span>
            </button>

            {isAuditorOrDPA && (
              <button
                onClick={() => setShowManualCodeForm(!showManualCodeForm)}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
              >
                <Plus size={14} />
                <span>{showManualCodeForm ? 'Tutup Form' : 'Tambah Item Manual'}</span>
              </button>
            )}
          </div>
        </div>
  );
};
