/**
 * RoleFlowSubTabs.jsx
 * Diekstrak dari AuditRoleFlowModal.jsx (baris 647-722).
 * Sumber: Sub-tab Peran 1 / Peran 2 / Matriks RACI
 */
import React from 'react';
import { Building2, CheckSquare, Ship, Users } from 'lucide-react';

export const RoleFlowSubTabs = ({
  activeTab,
  isDoc,
  setActiveTab,
}) => {
  return (
    <div
              style={{
                padding: '0.55rem 1.5rem',
                background: 'var(--bg-input)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: '0.4rem',
                flexWrap: 'wrap'
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('auditor')}
                className={`tab-btn ${activeTab === 'auditor' ? 'active' : ''}`}
                style={{
                  padding: '0.45rem 0.95rem',
                  fontSize: '0.78rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: activeTab === 'auditor' ? 800 : 600,
                  color: activeTab === 'auditor' ? '#ffffff' : 'var(--text-main)',
                  background: activeTab === 'auditor' ? (isDoc ? '#d97706' : '#0284c7') : 'transparent',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Building2 size={15} />
                <span>{isDoc ? '1. Alur Lead Auditor & DPA (DOC)' : '1. Alur DPA (Darat - SMC)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('auditee')}
                className={`tab-btn ${activeTab === 'auditee' ? 'active' : ''}`}
                style={{
                  padding: '0.45rem 0.95rem',
                  fontSize: '0.78rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: activeTab === 'auditee' ? 800 : 600,
                  color: activeTab === 'auditee' ? '#ffffff' : 'var(--text-main)',
                  background: activeTab === 'auditee' ? '#10b981' : 'transparent',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                {isDoc ? <Users size={15} /> : <Ship size={15} />}
                <span>{isDoc ? '2. Alur Divisi Darat & Direksi (Auditee DOC)' : '2. Alur Nakhoda (Onboard Kapal - SMC)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('matrix')}
                className={`tab-btn ${activeTab === 'matrix' ? 'active' : ''}`}
                style={{
                  padding: '0.45rem 0.95rem',
                  fontSize: '0.78rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: activeTab === 'matrix' ? 800 : 600,
                  color: activeTab === 'matrix' ? '#ffffff' : 'var(--text-main)',
                  background: activeTab === 'matrix' ? '#6366f1' : 'transparent',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <CheckSquare size={15} />
                <span>{isDoc ? '3. Matriks RACI DOC (Kantor Darat)' : '3. Matriks RACI SMC (Kapal & DPA)'}</span>
              </button>
            </div>
  );
};
