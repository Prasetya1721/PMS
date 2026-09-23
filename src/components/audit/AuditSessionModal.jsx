import React from 'react';
import { SmcSessionModal } from './SmcSessionModal';
import { DocSessionModal } from './DocSessionModal';

export { SmcSessionModal, DocSessionModal };

/**
 * Smart Router untuk Formulir Sesi Audit:
 * - Standar SMC (Kapal Armada): Membuka SmcSessionModal khusus kapal, IMO, GT, SMC cert, Nakhoda onboard.
 * - Standar DOC (Kantor Darat): Membuka DocSessionModal khusus kantor pusat PBK, DOC cert, DPA, departemen darat.
 * Masing-masing modal terisolasi mandiri sehingga tidak ada field yang bertabrakan.
 */
export const AuditSessionModal = ({ session, onClose, defaultVesselId, defaultStandard, onSaved }) => {
  const isDoc = session?.standard === 'DOC' || defaultStandard === 'DOC' || defaultVesselId === 'office';

  if (isDoc) {
    return (
      <DocSessionModal
        session={session}
        onClose={onClose}
        onSaved={onSaved}
      />
    );
  }

  return (
    <SmcSessionModal
      session={session}
      onClose={onClose}
      defaultVesselId={defaultVesselId}
      onSaved={onSaved}
    />
  );
};

export default AuditSessionModal;
