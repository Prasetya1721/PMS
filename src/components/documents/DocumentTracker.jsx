import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  FileCheck,
  FileText,
  Clock,
  Search,
  Filter,
  Send,
  Eye,
  Download,
  ShieldAlert,
  QrCode,
  X,
  CalendarPlus,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  UserCheck
} from 'lucide-react';
import { DocumentFormModal } from './DocumentFormModal';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { DocTrackerHeader } from './doctracker/DocTrackerHeader';
import { DocTrackerFilterBar } from './doctracker/DocTrackerFilterBar';
import { DocTrackerTable } from './doctracker/DocTrackerTable';
import { DocTrackerPreviewModal } from './doctracker/DocTrackerPreviewModal';
import { DocTrackerCalendarModal } from './doctracker/DocTrackerCalendarModal';
import { DocTrackerWhatsAppModal } from './doctracker/DocTrackerWhatsAppModal';

export const DocumentTracker = () => {
  const {
    crewCertificates,
    shipDocuments,
    certificateCategories,
    vessels,
    sendWhatsAppReminder,
    openGoogleCalendar,
    exportH30CalendarICS,
    exportMultiIntervalICS,
    h30ExpiringCount,
    h1ExpiringCount,
    h7ExpiringCount,
    h365ExpiringCount,
    addShipDocument,
    updateShipDocument,
    deleteShipDocument
  } = usePMS();

  const [docTypeTab, setDocTypeTab] = useState('all'); // 'all' | 'crew' | 'ship'
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL' | 'BKI' | 'Statutory' | 'Asuransi' | 'KSOP' | 'Kesehatan'
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'H-1' | 'H-7' | 'H-30' | 'H-365' | 'Expired' | 'Due Soon' | 'Active'
  const [search, setSearch] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  // Modals for G-Cal and WA interval pickers
  const [calModalDoc, setCalModalDoc] = useState(null);
  const [calOffset, setCalOffset] = useState(30);
  const [calCustomDays, setCalCustomDays] = useState(14);
  const [calTime, setCalTime] = useState('08:00');

  const [waModalDoc, setWaModalDoc] = useState(null);
  const [waModalOffset, setWaModalOffset] = useState(30);

  // Combine items for unified table
  const allItems = [
    ...crewCertificates.map(c => ({ ...c, itemCategory: 'Sertifikat Kru' })),
    ...shipDocuments.map(d => ({ ...d, itemCategory: 'Surat Legal Kapal' }))
  ];

  const filteredItems = allItems.filter(item => {
    const matchType = docTypeTab === 'all' ||
      (docTypeTab === 'crew' && item.itemCategory === 'Sertifikat Kru') ||
      (docTypeTab === 'ship' && item.itemCategory === 'Surat Legal Kapal');

    const matchCategory = categoryFilter === 'ALL' || item.category === categoryFilter;

    let matchStatus = true;
    if (statusFilter === 'H-1') {
      matchStatus = item.daysUntilExpiry !== undefined && item.daysUntilExpiry <= 1 && item.daysUntilExpiry >= 0;
    } else if (statusFilter === 'H-7') {
      matchStatus = item.daysUntilExpiry !== undefined && item.daysUntilExpiry <= 7 && item.daysUntilExpiry >= 0;
    } else if (statusFilter === 'H-30') {
      matchStatus = item.daysUntilExpiry !== undefined && item.daysUntilExpiry <= 30 && item.daysUntilExpiry >= 0;
    } else if (statusFilter === 'H-365') {
      matchStatus = item.daysUntilExpiry !== undefined && item.daysUntilExpiry <= 365 && item.daysUntilExpiry >= 0;
    } else if (statusFilter !== 'ALL') {
      matchStatus = item.status === statusFilter;
    }

    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.certificateNo && item.certificateNo.toLowerCase().includes(search.toLowerCase())) ||
      (item.documentNo && item.documentNo.toLowerCase().includes(search.toLowerCase())) ||
      (item.crewName && item.crewName.toLowerCase().includes(search.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(search.toLowerCase())) ||
      item.issuer.toLowerCase().includes(search.toLowerCase());

    return matchType && matchCategory && matchStatus && matchSearch;
  });

  const expiredCount = allItems.filter(i => i.status === 'Expired').length;
  const dueSoonCount = allItems.filter(i => i.status === 'Due Soon').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <DocTrackerHeader
        expiredCount={expiredCount}
        exportMultiIntervalICS={exportMultiIntervalICS}
        h1ExpiringCount={h1ExpiringCount}
        h30ExpiringCount={h30ExpiringCount}
        h7ExpiringCount={h7ExpiringCount}
        setEditingDoc={setEditingDoc}
        setShowAddDocModal={setShowAddDocModal}
      />

      {/* Filter Bar */}
      <DocTrackerFilterBar
        allItems={allItems}
        categoryFilter={categoryFilter}
        certificateCategories={certificateCategories}
        crewCertificates={crewCertificates}
        docTypeTab={docTypeTab}
        dueSoonCount={dueSoonCount}
        expiredCount={expiredCount}
        h1ExpiringCount={h1ExpiringCount}
        h30ExpiringCount={h30ExpiringCount}
        h365ExpiringCount={h365ExpiringCount}
        h7ExpiringCount={h7ExpiringCount}
        search={search}
        setCategoryFilter={setCategoryFilter}
        setDocTypeTab={setDocTypeTab}
        setSearch={setSearch}
        setStatusFilter={setStatusFilter}
        shipDocuments={shipDocuments}
        statusFilter={statusFilter}
      />

      {/* Documents Table */}
      <DocTrackerTable
        deleteShipDocument={deleteShipDocument}
        filteredItems={filteredItems}
        setCalModalDoc={setCalModalDoc}
        setCalOffset={setCalOffset}
        setEditingDoc={setEditingDoc}
        setPreviewDoc={setPreviewDoc}
        setShowAddDocModal={setShowAddDocModal}
        setWaModalDoc={setWaModalDoc}
        setWaModalOffset={setWaModalOffset}
        vessels={vessels}
      />

      {/* Simulated Document Scan Viewer Modal */}
      {(previewDoc) && (
        <DocTrackerPreviewModal
          previewDoc={previewDoc}
          setCalModalDoc={setCalModalDoc}
          setPreviewDoc={setPreviewDoc}
          setWaModalDoc={setWaModalDoc}
          vessels={vessels}
        />
      )}

      {/* MODAL 1: Google Calendar Customizer Dialog in DocumentTracker */}
      {(calModalDoc) && (
        <DocTrackerCalendarModal
          calCustomDays={calCustomDays}
          calModalDoc={calModalDoc}
          calOffset={calOffset}
          calTime={calTime}
          exportMultiIntervalICS={exportMultiIntervalICS}
          openGoogleCalendar={openGoogleCalendar}
          setCalCustomDays={setCalCustomDays}
          setCalModalDoc={setCalModalDoc}
          setCalOffset={setCalOffset}
          setCalTime={setCalTime}
        />
      )}

      {/* MODAL 2: WhatsApp Dialog in DocumentTracker */}
      {(waModalDoc) && (
        <DocTrackerWhatsAppModal
          sendWhatsAppReminder={sendWhatsAppReminder}
          setWaModalDoc={setWaModalDoc}
          setWaModalOffset={setWaModalOffset}
          waModalDoc={waModalDoc}
          waModalOffset={waModalOffset}
        />
      )}

      {/* Add/Edit Document Modal */}
      {(showAddDocModal || editingDoc) && (
        <DocumentFormModal
          isOpen={showAddDocModal || !!editingDoc}
          initialData={editingDoc}
          vessels={vessels}
          onClose={() => {
            setShowAddDocModal(false);
            setEditingDoc(null);
          }}
          onSave={(data) => {
            if (editingDoc) {
              updateShipDocument(editingDoc.id, data);
            } else {
              addShipDocument(data);
            }
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
