/**
 * NotifTabAuditNC.jsx
 * Diekstrak dari NotificationCenter.jsx (baris 1978-2530).
 * Sumber: Tab 5: audit ISM NC open & close notification center
 */
import React from 'react';
import { ArrowRight, Building2, CheckCircle2, Clock, FileCheck, Printer, Search, Send, ShieldAlert, Ship, X } from 'lucide-react';
import { calculateNCRange } from '../../../utils/auditTimeUtils';
import { NotifAuditNCStats } from './auditnc/NotifAuditNCStats';
import { NotifAuditNCFilterBar } from './auditnc/NotifAuditNCFilterBar';
import { NotifAuditNCEmptyState } from './auditnc/NotifAuditNCEmptyState';
import { NotifAuditNCListCard } from './auditnc/NotifAuditNCListCard';

export const NotifTabAuditNC = ({
  allFindings,
  auditFilterStatus,
  auditFleetStats,
  auditSearchQuery,
  auditVesselFilter,
  filteredAuditFindingsList,
  sendAuditWhatsAppNotification,
  setAuditFilterStatus,
  setAuditNotifModalFinding,
  setAuditPrintFinding,
  setAuditSearchQuery,
  setAuditVesselFilter,
  setPMSActiveTab,
  setSelectedVesselId,
  theme,
  vessels,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Top KPI Cards for Audit NC */}
              <NotifAuditNCStats
                allFindings={allFindings}
                auditFleetStats={auditFleetStats}
              />

              {/* Filter & Search Bar */}
              <NotifAuditNCFilterBar
                allFindings={allFindings}
                auditFilterStatus={auditFilterStatus}
                auditFleetStats={auditFleetStats}
                auditSearchQuery={auditSearchQuery}
                auditVesselFilter={auditVesselFilter}
                setAuditFilterStatus={setAuditFilterStatus}
                setAuditSearchQuery={setAuditSearchQuery}
                setAuditVesselFilter={setAuditVesselFilter}
                vessels={vessels}
              />

              {/* List of Finding Notification Cards */}
              {filteredAuditFindingsList.length === 0 ? (
                <NotifAuditNCEmptyState
                  setAuditFilterStatus={setAuditFilterStatus}
                  setAuditSearchQuery={setAuditSearchQuery}
                  setAuditVesselFilter={setAuditVesselFilter}
                />
              ) : (
                <NotifAuditNCListCard
                  filteredAuditFindingsList={filteredAuditFindingsList}
                  sendAuditWhatsAppNotification={sendAuditWhatsAppNotification}
                  setAuditNotifModalFinding={setAuditNotifModalFinding}
                  setAuditPrintFinding={setAuditPrintFinding}
                  setPMSActiveTab={setPMSActiveTab}
                  setSelectedVesselId={setSelectedVesselId}
                  theme={theme}
                  vessels={vessels}
                />
              )}
            </div>
  );
};
