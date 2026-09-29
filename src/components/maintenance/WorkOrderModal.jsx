import React, { useState, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
import { BaharimasEmblem } from '../common/BaharimasLogo';
import {
  Package,
  X,
  CheckCircle,
  Plus,
  Trash2,
  Printer,
  Send,
  Copy,
  Check,
  FileText,
  Ship,
  Users,
  ArrowLeft
} from 'lucide-react';
import { makeId } from '../../utils/idUtils';
import { WorkOrderModalHeader } from './workorder/WorkOrderModalHeader';
import { WorkOrderCategorySection } from './workorder/WorkOrderCategorySection';
import { WorkOrderVesselPicSection } from './workorder/WorkOrderVesselPicSection';
import { WorkOrderScheduleSection } from './workorder/WorkOrderScheduleSection';
import { WorkOrderItemsTable } from './workorder/WorkOrderItemsTable';
import { WorkOrderNotesField } from './workorder/WorkOrderNotesField';
import { WorkOrderFormFooter } from './workorder/WorkOrderFormFooter';
import { WorkOrderLetterView } from './workorder/WorkOrderLetterView';

export const WorkOrderModal = ({ workOrder, vesselId, onClose }) => {
  const {
    vessels,
    allCrew,
    crew,
    spareparts,
    addRequisition,
    addWorkOrder,
    updateWorkOrder,
    showToast
  } = usePMS();

  const isEdit = Boolean(workOrder);

  // Current vessel target
  const initialVesselId = workOrder?.vesselId || vesselId || vessels[0]?.id || 'v-001';
  const currentVessel = vessels.find(v => v.id === initialVesselId) || vessels[0];

  // List of crew on this vessel for quick PIC selection
  const vesselCrewList = useMemo(() => {
    const list = (allCrew || crew || []).filter(c => c.vesselId === initialVesselId);
    return list;
  }, [allCrew, crew, initialVesselId]);

  // Initial Captain Name
  const captainName = useMemo(() => {
    return (
      workOrder?.captain ||
      currentVessel?.masterCaptain ||
      currentVessel?.particulars?.masterCaptain ||
      vesselCrewList.find(c => c.rank?.toLowerCase().includes('nakhoda') || c.rank?.toLowerCase().includes('master'))?.name ||
      'Capt. Hendra Gunawan, M.Mar'
    );
  }, [workOrder, currentVessel, vesselCrewList]);

  // Initial PIC / Requester
  const defaultPic = useMemo(() => {
    if (workOrder?.pic) {
      return { name: workOrder.pic, role: workOrder.picRole || 'PIC' };
    }
    if (workOrder?.assignedTo) {
      const parts = workOrder.assignedTo.split('(');
      return {
        name: parts[0]?.trim(),
        role: parts[1] ? parts[1].replace(')', '').trim() : 'PIC'
      };
    }
    const chief = vesselCrewList.find(c => c.rank?.toLowerCase().includes('chief') || c.rank?.toLowerCase().includes('kkm'));
    if (chief) {
      return { name: chief.name, role: chief.rank };
    }
    return {
      name: currentVessel?.chiefEngineer || 'Ir. Bambang Wijaya',
      role: 'Chief Engineer (KKM)'
    };
  }, [workOrder, vesselCrewList, currentVessel]);

  // View Mode: 'form' (input formulir) | 'letter' (surat permintaan resmi)
  const [viewMode, setViewMode] = useState(isEdit ? 'letter' : 'form');

  const isCrewCategory = workOrder?.mainCategory === 'Kebutuhan Crew' ||
    workOrder?.category?.toLowerCase().includes('crew') ||
    workOrder?.category?.toLowerCase().includes('awak') ||
    workOrder?.category?.toLowerCase().includes('ransum');

  // Form State
  const [formData, setFormData] = useState({
    documentNo: workOrder?.id || `REQ-PBK/2026/09/${Math.floor(100 + Math.random() * 900)}`,
    vesselId: workOrder?.vesselId || initialVesselId,
    mainCategory: workOrder?.mainCategory || (isCrewCategory ? 'Kebutuhan Crew' : 'Kebutuhan Kapal'),
    subCategory: workOrder?.subCategory || (isCrewCategory ? 'Bahan Makanan Basah & Kering (Galley / Ransum)' : 'Mesin & Sparepart (Engine Parts)'),
    picName: defaultPic.name,
    picRole: defaultPic.role,
    priority: workOrder?.priority || 'Penting (Segera)',
    requestDate: workOrder?.requestDate || workOrder?.dueDate || new Date().toISOString().split('T')[0],
    neededDate: workOrder?.neededDate || workOrder?.dueDate || new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    deliveryLocation: workOrder?.deliveryLocation || 'Dermaga Pelabuhan Dwikora Pontianak',
    notes: workOrder?.notes || workOrder?.title || 'Mohon dipersiapkan sebelum kapal menyelesaikan bongkar muat di Pontianak.'
  });

  // Requisition items table state
  const [items, setItems] = useState(() => {
    if (workOrder?.items && workOrder.items.length > 0) {
      return workOrder.items.map((it, idx) => ({
        id: it.id || `it-${idx + 1}`,
        name: it.name,
        qty: it.qty || 1,
        unit: it.unit || 'Pcs',
        category: it.category || workOrder.mainCategory || (isCrewCategory ? 'Kebutuhan Crew' : 'Kebutuhan Kapal'),
        notes: it.notes || it.keterangan || '-'
      }));
    }
    if (workOrder?.partsRequired && workOrder.partsRequired.length > 0) {
      return workOrder.partsRequired.map((p, idx) => ({
        id: `it-${idx + 1}`,
        name: p.name,
        qty: p.qty || 1,
        unit: p.unit || 'Pcs',
        category: 'Kebutuhan Kapal',
        notes: `Pengadaan suku cadang untuk ${workOrder.title || 'permesinan'}`
      }));
    }
    if (workOrder?.checklist && workOrder.checklist.length > 0) {
      return workOrder.checklist.map((c, idx) => ({
        id: c.id || `it-${idx + 1}`,
        name: c.text,
        qty: 1,
        unit: 'Paket / Set',
        category: 'Kebutuhan Kapal',
        notes: `Kebutuhan operasional: ${workOrder.title}`
      }));
    }
    return [
      {
        id: 'it-1',
        name: 'Oli Mesin Meditran SX 15W-40',
        qty: 2,
        unit: 'Drum',
        category: 'Kebutuhan Kapal',
        notes: 'Penggantian oli rutin Main Engine Portside'
      },
      {
        id: 'it-2',
        name: 'Filter Oli Fleetguard LF9009 Cummins',
        qty: 4,
        unit: 'Pcs',
        category: 'Kebutuhan Kapal',
        notes: 'Servis berkala 1000 jam kerja mesin'
      },
      {
        id: 'it-3',
        name: 'Tali Towing Polypropylene 8-Strand 55mm',
        qty: 1,
        unit: 'Roll',
        category: 'Kebutuhan Kapal',
        notes: 'Cadangan tali towing tongkang batubara'
      }
    ];
  });

  // Input state for adding manual items
  const [manualItem, setManualItem] = useState({
    name: '',
    qty: 1,
    unit: 'Pcs',
    notes: ''
  });

  const [copiedText, setCopiedText] = useState(false);

  // Catalog Presets categorized by Kebutuhan Kapal & Kebutuhan Crew
  const CATALOG_PRESETS = useMemo(() => {
    return {
      'Kebutuhan Kapal': [
        { name: 'Oli Mesin Meditran SX 15W-40 (200L)', unit: 'Drum', notes: 'Pelumas Mesin Utama / Genset' },
        { name: 'Oli Rored HDA 90/140 Gearbox', unit: 'Pail', notes: 'Pelumas Gearbox & Steering Gear' },
        { name: 'Filter Oli Fleetguard LF9009', unit: 'Pcs', notes: 'Suku Cadang Mesin Utama' },
        { name: 'Filter Solar Fleetguard FS1000', unit: 'Pcs', notes: 'Penyaring Bahan Bakar' },
        { name: 'Tali Towing Polypropylene 55mm (220M)', unit: 'Roll', notes: 'Tali Towing & Tambat Kapal' },
        { name: 'Cat Marine Anti-Fouling Red (20L)', unit: 'Pail', notes: 'Pengecatan Lambung Bawah Air' },
        { name: 'Cat Marine Alkyd Gloss White (20L)', unit: 'Pail', notes: 'Pengecatan Superstructure' },
        { name: 'Thinner A Spesial Super (5L)', unit: 'Kaleng', notes: 'Pengencer Cat Kapal' },
        { name: 'Zinc Anode Lambung 10 Kg', unit: 'Pcs', notes: 'Proteksi Katodik Korosi Lambung' },
        { name: 'Majun Putih Super (Kain Pembersih)', unit: 'Kg', notes: 'Pembersih Mesin & Kamar Mesin' },
        { name: 'Bohlam Lampu Sorot Deck 1000W Halogen', unit: 'Pcs', notes: 'Penerangan Navigasi & Deck' },
        { name: 'Lifebuoy Ring 2.5kg (Pelampung)', unit: 'Pcs', notes: 'Peralatan Keselamatan SOLAS' },
        { name: 'Elektroda Las Kobe Steel LB-52 3.2mm', unit: 'Dus', notes: 'Perbaikan & Pengelasan Konstruksi' }
      ],
      'Kebutuhan Crew': [
        { name: 'Beras Premium Ramos 25 Kg', unit: 'Zak', notes: 'Ransum Pokok Galley Kapal' },
        { name: 'Minyak Goreng Kemasan 2 Liter', unit: 'Dus', notes: 'Bahan Dapur & Masak Awak' },
        { name: 'Telur Ayam Boiler Segar (30 Butir)', unit: 'Piring', notes: 'Konsumsi Ransum Harian Kru' },
        { name: 'Daging Sapi Segar & Daging Ayam', unit: 'Kg', notes: 'Lauk Pauk Segar Pelayaran' },
        { name: 'Mie Instan Indomie Campur (40 Bks)', unit: 'Dus', notes: 'Ransum Makanan Cepat Saji' },
        { name: 'Air Minum Galon Aqua 19 Liter', unit: 'Galon', notes: 'Air Bersih Konsumsi Awak Kapal' },
        { name: 'Wearpack Pelaut Katun Logo Baharimas', unit: 'Stel', notes: 'APD Seragam Kerja Pelaut' },
        { name: 'Safety Shoes Pelaut Ujung Besi SNI', unit: 'Pasang', notes: 'Sepatu Keselamatan Kerja Deck & Mesin' },
        { name: 'Paket Obat-obatan P3K & Vitamin Maritim', unit: 'Set', notes: 'Kesehatan & P3K Standar Maritim' },
        { name: 'Sprei & Sarung Bantal Kamar Kru', unit: 'Set', notes: 'Perlengkapan Mess & Kamar Awak' },
        { name: 'Sabun Cuci Deterjen & Pembersih Lantai', unit: 'Dus', notes: 'Kebersihan Kamar & Toilet Kapal' },
        { name: 'Kopi Kapal Api & Gula Pasir 1 Kg', unit: 'Paket', notes: 'Minuman Hangat Jaga Malam Awak' }
      ]
    };
  }, []);

  const SUB_CATEGORIES = useMemo(() => {
    return {
      'Kebutuhan Kapal': [
        'Mesin & Sparepart (Engine Parts)',
        'Minyak Pelumas & Oli (Lubricants)',
        'Deck Machinery & Tali Towing',
        'Cat, Thinner & Perlengkapan Lambung',
        'Alat Keselamatan Kapal (SOLAS / LSA / FFA)',
        'Listrik & Peralatan Navigasi',
        'Consumables & Bengkel (Majun, Baut, Las)'
      ],
      'Kebutuhan Crew': [
        'Bahan Makanan Basah & Kering (Galley / Ransum)',
        'Air Minum Galon & Minuman',
        'APD & Seragam Wearpack Pelaut',
        'Perlengkapan Mess & Kamar Kru',
        'Obat-obatan P3K & Suplemen Kesehatan',
        'Sabun Cuci, Deterjen & Kebersihan Mess'
      ]
    };
  }, []);

  // Handler: Change Main Category
  const handleMainCategoryChange = (newCat) => {
    setFormData(prev => ({
      ...prev,
      mainCategory: newCat,
      subCategory: SUB_CATEGORIES[newCat][0]
    }));
  };

  // Handler: Add item from catalog preset
  const handleAddPresetItem = (preset) => {
    const newItem = {
      id: makeId(`it-${Math.floor(Math.random() * 1000)}`),
      name: preset.name,
      qty: 1,
      unit: preset.unit || 'Pcs',
      category: formData.mainCategory,
      notes: preset.notes || ''
    };
    setItems(prev => [...prev, newItem]);
    showToast(`✓ Ditambahkan ke daftar: ${preset.name}`, 'info');
  };

  // Handler: Add manual item
  const handleAddManualItem = (e) => {
    e?.preventDefault?.();
    if (!manualItem.name.trim()) {
      showToast('Nama barang wajib diisi!', 'warning');
      return;
    }
    const newItem = {
      id: makeId(`it-${Math.floor(Math.random() * 1000)}`),
      name: manualItem.name.trim(),
      qty: Number(manualItem.qty) || 1,
      unit: manualItem.unit || 'Pcs',
      category: formData.mainCategory,
      notes: manualItem.notes.trim() || '-'
    };
    setItems(prev => [...prev, newItem]);
    setManualItem({ name: '', qty: 1, unit: 'Pcs', notes: '' });
    showToast(`✓ Barang manual "${newItem.name}" ditambahkan ke daftar!`, 'success');
  };

  // Handler: Remove item
  const handleRemoveItem = (itemId) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  // Handler: Submit Form & Generate Letter
  const handleGenerateLetter = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      showToast('Mohon tambahkan minimal 1 barang ke dalam daftar permintaan!', 'warning');
      return;
    }
    if (!formData.picName.trim()) {
      showToast('Nama PIC / Pemohon wajib diisi!', 'warning');
      return;
    }

    const payload = {
      id: formData.documentNo,
      vesselId: formData.vesselId,
      title: `${formData.mainCategory}: ${items.map(i => i.name).slice(0, 2).join(', ')}${items.length > 2 ? ` (+${items.length - 2} item)` : ''}`,
      mainCategory: formData.mainCategory,
      category: formData.mainCategory,
      subCategory: formData.subCategory,
      priority: formData.priority,
      status: workOrder?.status || 'Diajukan',
      dueDate: formData.neededDate,
      neededDate: formData.neededDate,
      requestDate: formData.requestDate,
      assignedTo: `${formData.picName} (${formData.picRole})`,
      pic: formData.picName,
      picRole: formData.picRole,
      supervisor: captainName,
      captain: captainName,
      deliveryLocation: formData.deliveryLocation,
      items: items,
      notes: formData.notes
    };

    if (isEdit && updateWorkOrder) {
      updateWorkOrder(workOrder.id, payload);
    } else if (addWorkOrder) {
      addWorkOrder(payload);
    }

    // Save to system requisitions
    if (addRequisition) {
      addRequisition({
        id: formData.documentNo,
        vesselId: formData.vesselId,
        category: formData.mainCategory,
        subCategory: formData.subCategory,
        requesterName: `${formData.picName} (${formData.picRole})`,
        urgency: formData.priority,
        status: 'Submitted',
        items: items.map(i => ({
          name: i.name,
          qty: i.qty,
          unit: i.unit,
          notes: i.notes
        })),
        notes: formData.notes
      });
    }

    // Switch to letter preview
    setViewMode('letter');
    showToast('Surat Permintaan Barang ke Gudang berhasil disimpan!', 'success');
  };

  // Handler: Print
  const handlePrint = () => {
    window.print();
  };

  // Handler: WhatsApp Dispatch
  const handleSendWA = () => {
    const vesselName = currentVessel?.name || 'Kapal Armada';
    const lines = [
      `*SURAT PERMINTAAN BARANG KE GUDANG (MATERIAL REQUISITION)*`,
      `*PT. PELAYARAN BAHARIMAS KALIMANTAN*`,
      `═════════════════════════════════`,
      `📄 No. Dokumen: *${formData.documentNo}*`,
      `🚢 Kapal: *${vesselName}*`,
      `🏷️ Kategori: *${formData.mainCategory}* (${formData.subCategory})`,
      `👤 PIC / Pemohon: *${formData.picName}* (${formData.picRole})`,
      `⚓ Mengetahui (Nakhoda): *${captainName}*`,
      `📅 Tgl Permintaan: ${formData.requestDate}`,
      `⏰ Tgl Dibutuhkan: *${formData.neededDate}*`,
      `⚡ Prioritas: *${formData.priority}*`,
      `📍 Lokasi Penyerahan: ${formData.deliveryLocation}`,
      ``,
      `*DAFTAR BARANG YANG DIMINTA:*`,
      ...items.map((it, idx) => `${idx + 1}. *${it.name}* - ${it.qty} ${it.unit} (${it.notes || '-'})`),
      ``,
      formData.notes ? `📝 *Catatan Tambahan:* ${formData.notes}` : '',
      `═════════════════════════════════`,
      `_Mohon untuk dipersiapkan oleh Tim Gudang & Logistik PT. PBK. Terima kasih._`
    ].filter(Boolean);

    const waText = encodeURIComponent(lines.join('\n'));
    window.open(`https://api.whatsapp.com/send?phone=6281288991122&text=${waText}`, '_blank');
  };

  // Handler: Copy text
  const handleCopyText = () => {
    const vesselName = currentVessel?.name || 'Kapal Armada';
    const text = [
      `SURAT PERMINTAAN BARANG KE GUDANG - PT. PELAYARAN BAHARIMAS KALIMANTAN`,
      `No: ${formData.documentNo}`,
      `Kapal: ${vesselName}`,
      `Kategori: ${formData.mainCategory} (${formData.subCategory})`,
      `PIC / Pemohon: ${formData.picName} (${formData.picRole})`,
      `Nakhoda: ${captainName}`,
      `Tgl Dibutuhkan: ${formData.neededDate}`,
      `Prioritas: ${formData.priority}`,
      `Lokasi: ${formData.deliveryLocation}`,
      ``,
      `DAFTAR BARANG:`,
      ...items.map((it, idx) => `${idx + 1}. ${it.name} - ${it.qty} ${it.unit} (${it.notes || '-'})`)
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
    showToast('Teks ringkasan permintaan berhasil disalin ke clipboard!', 'info');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog modal-dialog-large"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: viewMode === 'letter' ? '860px' : '820px',
          width: '95%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* ========================================================================= */}
        {/* MODAL TOP BAR (NO-PRINT)                                                  */}
        {/* ========================================================================= */}
        <WorkOrderModalHeader
          currentVessel={currentVessel}
          formData={formData}
          onClose={onClose}
          setViewMode={setViewMode}
          viewMode={viewMode}
        />

        {/* ========================================================================= */}
        {/* VIEW 1: FORMULIR INPUT PERMINTAAN BARANG                                 */}
        {/* ========================================================================= */}
        {viewMode === 'form' && (
          <form onSubmit={handleGenerateLetter} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.25rem' }}>

              {/* 1. KATEGORI KEBUTUHAN: KAPAL & CRAW (CREW) */}
              <WorkOrderCategorySection
                SUB_CATEGORIES={SUB_CATEGORIES}
                formData={formData}
                handleMainCategoryChange={handleMainCategoryChange}
                setFormData={setFormData}
              />

              {/* 2. DATA KAPAL & PIC PEMOHON (EQUIPMENT DIHAPUS, TEKNISI DIGANTI PIC) */}
              <WorkOrderVesselPicSection
                formData={formData}
                setFormData={setFormData}
                vesselCrewList={vesselCrewList}
                vessels={vessels}
              />

              {/* 3. PRIORITAS, TANGGAL & LOKASI (TARGET JAM HILANGKAN) */}
              <WorkOrderScheduleSection
                formData={formData}
                setFormData={setFormData}
              />

              {/* 4. DAFTAR KEBUTUHAN BARANG (KATALOG CEPAT & INPUT MANUAL) */}
              <WorkOrderItemsTable
                CATALOG_PRESETS={CATALOG_PRESETS}
                formData={formData}
                handleAddManualItem={handleAddManualItem}
                handleAddPresetItem={handleAddPresetItem}
                handleRemoveItem={handleRemoveItem}
                items={items}
                manualItem={manualItem}
                setManualItem={setManualItem}
              />

              {/* 5. INSTRUKSI / CATATAN KHUSUS UNTUK GUDANG */}
              <WorkOrderNotesField
                formData={formData}
                setFormData={setFormData}
              />
            </div>

            {/* Modal Footer Form */}
            <WorkOrderFormFooter
              onClose={onClose}
            />
          </form>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: SURAT PERMINTAAN RESMI (TABEL + TTD KAPTEN & PEMOHON)            */}
        {/* ========================================================================= */}
        {(viewMode === 'letter') && (
          <WorkOrderLetterView
            captainName={captainName}
            copiedText={copiedText}
            currentVessel={currentVessel}
            formData={formData}
            handleCopyText={handleCopyText}
            handlePrint={handlePrint}
            handleSendWA={handleSendWA}
            items={items}
            onClose={onClose}
            setViewMode={setViewMode}
          />
        )}
      </div>
    </div>
  );
};
