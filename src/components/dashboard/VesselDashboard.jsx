import React, { useState, useRef, useEffect } from 'react';
import { usePMS } from '../../context/PMSContext';
import { VesselHeroCard } from './vesseldash/VesselHeroCard';
import { TabOverview } from './vesseldash/TabOverview';
import { TabCrew } from './vesseldash/TabCrew';
import { TabDocuments } from './vesseldash/TabDocuments';
import { TabEquipment } from './vesseldash/TabEquipment';
import { TabSpareparts } from './vesseldash/TabSpareparts';
import { TabAudit } from './vesseldash/TabAudit';
import { VesselAddCrewModal } from './vesseldash/VesselAddCrewModal';
import { TabWorkOrders } from './vesseldash/TabWorkOrders';
import {
  Ship,
  Wrench,
  FileCheck,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight,
  UserCheck,
  Compass,
  Users,
  Calendar,
  Send,
  CalendarPlus,
  Package,
  ShieldCheck,
  FileText,
  ChevronRight,
  Edit3,
  Edit2,
  Trash2,
  Camera,
  ShoppingBag,
  Printer,
  Search,
  CheckSquare,
  Square
} from 'lucide-react';
import { RunningHoursModal } from '../equipment/RunningHoursModal';
import { WorkOrderModal } from '../maintenance/WorkOrderModal';
import { ShipParticularsView } from '../vessels/ShipParticularsView';
import { ParticularsModal } from '../vessels/ParticularsModal';
import { EditVesselPhotoModal } from '../vessels/EditVesselPhotoModal';
import { DocumentFormModal } from '../documents/DocumentFormModal';
import { DocumentPreviewModal } from '../documents/DocumentPreviewModal';
import { AuditReportModal } from '../audit/AuditReportModal';

export const VesselDashboard = () => {
  const {
    vessels,
    certificateCategories,
    selectedVesselId,
    setSelectedVesselId,
    equipment,
    workOrders,
    crew,
    crewCertificates,
    allCrewCertificates,
    shipDocuments,
    allShipDocuments,
    allCrew,
    allEquipment,
    allWorkOrders,
    allSpareparts,
    spareparts,
    allAuditFindings,
    allAudits,
    setActiveTab,
    sendWhatsAppReminder,
    openGoogleCalendar,
    updateWorkOrderStatus,
    toggleChecklist,
    addCrew,
    addShipDocument,
    updateShipDocument,
    deleteShipDocument,
    updateVessel,
    updateVesselParticulars,
    theme
  } = usePMS();

  const [activeSubTab, setActiveSubTab] = useState('overview'); // overview | particulars | crew | documents | equipment | workorders | spareparts
  const [selectedEqForHours, setSelectedEqForHours] = useState(null);
  const [showNewWOModal, setShowNewWOModal] = useState(false);
  const [selectedWOForModal, setSelectedWOForModal] = useState(null);
  const [reqCategoryFilter, setReqCategoryFilter] = useState('ALL');
  const [reqStatusFilter, setReqStatusFilter] = useState('ALL');
  const [reqSearchQuery, setReqSearchQuery] = useState('');
  const [showAddCrewModal, setShowAddCrewModal] = useState(false);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [showParticularsModal, setShowParticularsModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [shipDocCatFilter, setShipDocCatFilter] = useState('ALL');
  const [editingShipDoc, setEditingShipDoc] = useState(null);
  const [vesselReportFinding, setVesselReportFinding] = useState(null);
  const [vesselReportSession, setVesselReportSession] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);


  // New Crew Form State
  const [newCrewData, setNewCrewData] = useState({
    name: '',
    rank: 'Juru Mudi / ABK',
    department: 'Deck',
    seamanBookNo: '',
    phone: '',
    whatsapp: '',
    contractDurationMonths: 8,
    leaveBalanceDays: 14
  });

  // Current vessel with safe fallback
  const currentShip = (vessels && vessels.find(v => v.id === selectedVesselId)) || (vessels && vessels[0]) || null;

  // Specific data filtered for THIS ship with defensive checks
  const shipCrew = currentShip ? (allCrew || []).filter(c => c.vesselId === currentShip.id) : [];
  const shipCrewCerts = currentShip ? (allCrewCertificates || crewCertificates || []).filter(c => c.vesselId === currentShip.id) : [];
  const shipDocs = currentShip ? (allShipDocuments || []).filter(d => d.vesselId === currentShip.id) : [];
  const shipEquipment = currentShip ? (allEquipment || []).filter(e => e.vesselId === currentShip.id) : [];
  const shipWOs = currentShip ? (allWorkOrders || []).filter(w => w.vesselId === currentShip.id) : [];
  const shipParts = currentShip ? (allSpareparts || []).filter(s => s.vesselId === currentShip.id) : [];

  const overdueWO = shipWOs.filter(w => w.status === 'Overdue');
  const inProgressWO = shipWOs.filter(w => w.status === 'In Progress');
  const expiredDocs = shipDocs.filter(d => d.status === 'Expired');
  const dueSoonDocs = shipDocs.filter(d => d.status === 'Due Soon');
  const urgentCerts = [
    ...shipCrewCerts.filter(c => c.status !== 'Active'),
    ...shipDocs.filter(d => d.status !== 'Active')
  ];

  const shipAuditFindings = currentShip ? (allAuditFindings || []).filter(f => f.vesselId === currentShip.id) : [];
  const shipOpenNC = shipAuditFindings.filter(f => f.status !== 'NC Close').length;
  const shipClosedNC = shipAuditFindings.filter(f => f.status === 'NC Close').length;

  const getRequisitionItems = (wo) => {
    if (wo.items && Array.isArray(wo.items) && wo.items.length > 0) {
      return wo.items;
    }
    if (wo.partsRequired && Array.isArray(wo.partsRequired) && wo.partsRequired.length > 0) {
      return wo.partsRequired.map((p, idx) => ({
        id: `it-${idx + 1}`,
        name: p.name,
        qty: p.qty || 1,
        unit: p.unit || 'Pcs',
        notes: `Pengadaan suku cadang mesin`,
        received: false
      }));
    }
    if (wo.checklist && Array.isArray(wo.checklist) && wo.checklist.length > 0) {
      return wo.checklist.map((c, idx) => ({
        id: c.id || `it-${idx + 1}`,
        name: c.text,
        qty: 1,
        unit: 'Paket / Item',
        notes: 'Kebutuhan operasional pemeliharaan',
        received: c.done || false
      }));
    }
    return [];
  };

  const handleSendWAtoWarehouse = (wo) => {
    const items = getRequisitionItems(wo);
    const lines = [
      `*SURAT PERMINTAAN BARANG KE GUDANG (MATERIAL REQUISITION)*`,
      `*PT. PELAYARAN BAHARIMAS KALIMANTAN*`,
      `═════════════════════════════════`,
      `📄 No. Dokumen: *${wo.id}*`,
      `🚢 Kapal: *${currentShip.name}*`,
      `🏷️ Kategori: *${wo.mainCategory || wo.category || 'Kebutuhan Kapal'}*`,
      `👤 PIC / Pemohon: *${wo.pic || wo.assignedTo || '-'}*`,
      `⚓ Mengetahui (Nakhoda): *${wo.captain || wo.supervisor || currentShip.masterCaptain || 'Capt. Hendra Gunawan, M.Mar'}*`,
      `📅 Tgl Permintaan: ${wo.requestDate || wo.dueDate || '-'}`,
      `⏰ Tgl Dibutuhkan: *${wo.neededDate || wo.dueDate || 'Segera'}*`,
      `⚡ Prioritas: *${wo.priority}*`,
      `📍 Lokasi Serah: ${wo.deliveryLocation || 'Dermaga Pelabuhan Dwikora Pontianak'}`,
      ``,
      `*DAFTAR BARANG YANG DIMINTA:*`,
      ...items.map((it, idx) => `${idx + 1}. *${it.name}* - ${it.qty} ${it.unit} (${it.notes || '-'})`),
      ``,
      wo.notes ? `📝 *Catatan Tambahan:* ${wo.notes}` : '',
      `═════════════════════════════════`,
      `_Mohon untuk dipersiapkan oleh Tim Logistik Gudang PBK. Terima kasih._`
    ].filter(Boolean);

    const waText = encodeURIComponent(lines.join('\n'));
    window.open(`https://api.whatsapp.com/send?phone=6281288991122&text=${waText}`, '_blank');
  };

  const handleCreateCrew = (e) => {
    e.preventDefault();
    if (!newCrewData.name.trim()) return;

    addCrew({
      ...newCrewData,
      vesselId: currentShip.id,
      phone: newCrewData.phone || '081288990011',
      whatsapp: newCrewData.whatsapp || '+6281288990011',
      seamanBookNo: newCrewData.seamanBookNo || `B-${Math.floor(100000 + Math.random() * 900000)}-ID`,
      signOnDate: new Date().toISOString().split('T')[0],
      signOffPlanDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    setShowAddCrewModal(false);
    setNewCrewData({
      name: '',
      rank: 'Juru Mudi / ABK',
      department: 'Deck',
      seamanBookNo: '',
      phone: '',
      whatsapp: '',
      contractDurationMonths: 8,
      leaveBalanceDays: 14
    });
  };

  if (!currentShip || !vessels || vessels.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8',
            margin: '0 auto 1.5rem auto'
          }}>
            <Ship size={38} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            Belum Ada Kapal Terdaftar di Sistem Armada
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            Sistem PMS saat ini dalam keadaan bersih dari data dummy dan siap untuk pengujian input manual. Daftarkan kapal pertama Anda untuk mulai mengisi data peralatan mesin, sertifikat kelaikan, kru, dan anggaran operasional.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('fleet')}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
            >
              <Plus size={18} />
              <span>+ Daftarkan Kapal Pertama</span>
            </button>
            <button
              onClick={() => setActiveTab('master')}
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', fontSize: '0.95rem' }}
            >
              <span>Buka Pusat Data Master</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Vessel Profile Hero Card */}
      <VesselHeroCard
        activeSubTab={activeSubTab}
        currentShip={currentShip}
        expiredDocs={expiredDocs}
        overdueWO={overdueWO}
        setActiveSubTab={setActiveSubTab}
        setSelectedVesselId={setSelectedVesselId}
        setShowAddCrewModal={setShowAddCrewModal}
        setShowAddDocModal={setShowAddDocModal}
        setShowNewWOModal={setShowNewWOModal}
        setShowParticularsModal={setShowParticularsModal}
        setShowPhotoModal={setShowPhotoModal}
        shipAuditFindings={shipAuditFindings}
        shipCrew={shipCrew}
        shipDocs={shipDocs}
        shipEquipment={shipEquipment}
        shipOpenNC={shipOpenNC}
        shipParts={shipParts}
        shipWOs={shipWOs}
        theme={theme}
        vessels={vessels}
      />

      {/* SUB-TAB 1: RINGKASAN (OVERVIEW) */}
      {(activeSubTab === 'overview') && (
        <TabOverview
          dueSoonDocs={dueSoonDocs}
          expiredDocs={expiredDocs}
          inProgressWO={inProgressWO}
          openGoogleCalendar={openGoogleCalendar}
          overdueWO={overdueWO}
          sendWhatsAppReminder={sendWhatsAppReminder}
          setActiveSubTab={setActiveSubTab}
          setSelectedEqForHours={setSelectedEqForHours}
          shipCrew={shipCrew}
          shipDocs={shipDocs}
          shipEquipment={shipEquipment}
          shipWOs={shipWOs}
          urgentCerts={urgentCerts}
        />
      )}

      {/* SUB-TAB 2: DATA PARTICULAR KAPAL (SHIP PARTICULARS) */}
      {activeSubTab === 'particulars' && (
        <ShipParticularsView
          vessel={currentShip}
          onEdit={() => setShowParticularsModal(true)}
          theme={theme}
        />
      )}

      {/* SUB-TAB 3: AWAK KAPAL (CREW ROSTER) */}
      {(activeSubTab === 'crew') && (
        <TabCrew
          currentShip={currentShip}
          setShowAddCrewModal={setShowAddCrewModal}
          shipCrew={shipCrew}
          shipCrewCerts={shipCrewCerts}
        />
      )}

      {/* SUB-TAB 3: SERTIFIKAT & DOKUMEN KAPAL (BKI, STATUTORY, ASURANSI, KSOP, KESEHATAN) */}
      {(activeSubTab === 'documents') && (
        <TabDocuments
          certificateCategories={certificateCategories}
          currentShip={currentShip}
          deleteShipDocument={deleteShipDocument}
          openGoogleCalendar={openGoogleCalendar}
          sendWhatsAppReminder={sendWhatsAppReminder}
          setEditingShipDoc={setEditingShipDoc}
          setPreviewDoc={setPreviewDoc}
          setShipDocCatFilter={setShipDocCatFilter}
          setShowAddDocModal={setShowAddDocModal}
          shipDocCatFilter={shipDocCatFilter}
          shipDocs={shipDocs}
        />
      )}

      {/* SUB-TAB 4: EQUIPMENT & JAM MESIN */}
      {(activeSubTab === 'equipment') && (
        <TabEquipment
          currentShip={currentShip}
          setSelectedEqForHours={setSelectedEqForHours}
          shipEquipment={shipEquipment}
        />
      )}

      {/* SUB-TAB 5: PERMINTAAN BARANG KE GUDANG (MATERIAL REQUISITION) */}
      {(activeSubTab === 'workorders') && (
        <TabWorkOrders
          currentShip={currentShip}
          getRequisitionItems={getRequisitionItems}
          handleSendWAtoWarehouse={handleSendWAtoWarehouse}
          reqCategoryFilter={reqCategoryFilter}
          reqSearchQuery={reqSearchQuery}
          reqStatusFilter={reqStatusFilter}
          setReqCategoryFilter={setReqCategoryFilter}
          setReqSearchQuery={setReqSearchQuery}
          setReqStatusFilter={setReqStatusFilter}
          setSelectedWOForModal={setSelectedWOForModal}
          setShowNewWOModal={setShowNewWOModal}
          shipWOs={shipWOs}
          toggleChecklist={toggleChecklist}
          updateWorkOrderStatus={updateWorkOrderStatus}
        />
      )}

      {/* SUB-TAB 6: INVENTARIS SPAREPARTS */}
      {(activeSubTab === 'spareparts') && (
        <TabSpareparts
          currentShip={currentShip}
          shipParts={shipParts}
        />
      )}

      {/* SUB-TAB 8: AUDIT SMC KAPAL */}
      {(activeSubTab === 'audit') && (
        <TabAudit
          currentShip={currentShip}
          setActiveTab={setActiveTab}
          setVesselReportFinding={setVesselReportFinding}
          setVesselReportSession={setVesselReportSession}
          shipAuditFindings={shipAuditFindings}
          shipClosedNC={shipClosedNC}
          shipOpenNC={shipOpenNC}
        />
      )}

      {/* Modal: Tambah Kru ke Kapal Ini */}
      {(showAddCrewModal) && (
        <VesselAddCrewModal
          currentShip={currentShip}
          handleCreateCrew={handleCreateCrew}
          newCrewData={newCrewData}
          setNewCrewData={setNewCrewData}
          setShowAddCrewModal={setShowAddCrewModal}
        />
      )}

      {/* Modal: Tambah & Edit Sertifikat (BKI, Statutory, Asuransi, KSOP, Kesehatan) */}
      <DocumentFormModal
        isOpen={showAddDocModal || !!editingShipDoc}
        onClose={() => {
          setShowAddDocModal(false);
          setEditingShipDoc(null);
        }}
        initialData={editingShipDoc}
        vessels={vessels}
        defaultVesselId={currentShip.id}
        onSave={(docData) => {
          if (editingShipDoc) {
            updateShipDocument(editingShipDoc.id, docData);
          } else {
            addShipDocument({
              ...docData,
              vesselId: currentShip.id
            });
          }
          setShowAddDocModal(false);
          setEditingShipDoc(null);
        }}
      />

      {/* Existing Modals */}
      {selectedEqForHours && (
        <RunningHoursModal
          equipment={selectedEqForHours}
          onClose={() => setSelectedEqForHours(null)}
        />
      )}

      {(showNewWOModal || selectedWOForModal) && (
        <WorkOrderModal
          workOrder={selectedWOForModal}
          vesselId={currentShip.id}
          onClose={() => {
            setShowNewWOModal(false);
            setSelectedWOForModal(null);
          }}
        />
      )}

      {/* Edit Vessel Particulars Modal */}
      {showParticularsModal && (
        <ParticularsModal
          vessel={currentShip}
          isOpen={showParticularsModal}
          onClose={() => setShowParticularsModal(false)}
          onSave={(shipId, updatedData) => {
            updateVesselParticulars(shipId, updatedData);
          }}
        />
      )}

      {/* Edit Vessel Photo Modal */}
      {showPhotoModal && (
        <EditVesselPhotoModal
          vessel={currentShip}
          isOpen={showPhotoModal}
          onClose={() => setShowPhotoModal(false)}
          onSavePhoto={(newPhotoUrl) => {
            updateVessel(currentShip.id, { photo: newPhotoUrl });
          }}
        />
      )}

      {/* Official Maritime Audit Report Print Modal */}
      {(vesselReportFinding || vesselReportSession) && (
        <AuditReportModal
          session={vesselReportSession}
          finding={vesselReportFinding}
          initialMode={vesselReportFinding ? 'ncr' : 'session'}
          onClose={() => {
            setVesselReportFinding(null);
            setVesselReportSession(null);
          }}
        />
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <DocumentPreviewModal
          document={previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </div>
  );
};
