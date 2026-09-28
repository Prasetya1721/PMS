/**
 * NotificationModalHost.jsx
 * Diekstrak dari AuditManager.jsx (baris 5165-5172).
 * Sumber: MODAL NOTIFIKASI WHATSAPP NC OPEN / NC CLOSE
 */
import React from 'react';
import { AuditNotificationModal } from '.././AuditNotificationModal';

export const NotificationModalHost = ({
  notificationModalFinding,
  setNotificationModalFinding,
}) => (
<AuditNotificationModal
    finding={notificationModalFinding}
    onClose={() => setNotificationModalFinding(null)}
  />
);
