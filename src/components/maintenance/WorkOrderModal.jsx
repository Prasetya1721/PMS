import React, { useState, useMemo } from 'react';
import { usePMS } from '../../context/PMSContext';
import { BaharimasEmblem } from '../common/BaharimasLogo';
import {
  Package,
  X,
  CheckCircle,
  Clock,
  User,
  Plus,
  Trash2,
  Printer,
  Send,
  Copy,
  Check,
  FileText,
  Ship,
  Users,
  AlertTriangle,
  Calendar,
  MapPin,
  Sparkles,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';

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
    deliveryLocation: workOrder?.deliveryLocation || 'Dermaga Pelabuhan Samarinda',
    notes: workOrder?.notes || workOrder?.title || 'Mohon dipersiapkan sebelum kapal menyelesaikan bongkar muat di Samarinda.'
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
      id: `it-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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
      id: `it-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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
        <div className="modal-header no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Package size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                  {viewMode === 'letter'
                    ? 'Surat Permintaan Barang ke Gudang'
                    : 'Formulir Permintaan Barang ke Gudang'}
                </h3>
                <span className="badge badge-info" style={{ fontSize: '0.68rem', fontFamily: 'monospace' }}>
                  {formData.documentNo}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {currentVessel?.name} • Divisi Logistik & Gudang Armada PT. Pelayaran Baharimas Kalimantan
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {viewMode === 'letter' ? (
              <button
                type="button"
                onClick={() => setViewMode('form')}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
              >
                <ArrowLeft size={14} />
                <span>Edit Kembali Form</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setViewMode('letter')}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
              >
                <FileText size={14} />
                <span>Lihat Surat Permintaan</span>
              </button>
            )}

            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
              title="Tutup"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: FORMULIR INPUT PERMINTAAN BARANG                                 */}
        {/* ========================================================================= */}
        {viewMode === 'form' && (
          <form onSubmit={handleGenerateLetter} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.25rem' }}>

              {/* 1. KATEGORI KEBUTUHAN: KAPAL & CRAW (CREW) */}
              <div>
                <label className="field-label" style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  1. Pilih Kategori Kebutuhan *
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {/* Card Kebutuhan Kapal */}
                  <div
                    onClick={() => handleMainCategoryChange('Kebutuhan Kapal')}
                    style={{
                      padding: '0.9rem 1rem',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      border: formData.mainCategory === 'Kebutuhan Kapal'
                        ? '2px solid #38bdf8'
                        : '1px solid var(--border-subtle)',
                      background: formData.mainCategory === 'Kebutuhan Kapal'
                        ? 'rgba(56, 189, 248, 0.12)'
                        : 'rgba(255, 255, 255, 0.02)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: formData.mainCategory === 'Kebutuhan Kapal' ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)',
                      color: formData.mainCategory === 'Kebutuhan Kapal' ? '#0f172a' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Ship size={22} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.925rem', color: 'var(--text-primary)', display: 'block' }}>
                        ⚓ Kebutuhan Kapal
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Deck, Mesin, Oli/Pelumas, Cat Lambung, Tali Towing, Alat SOLAS
                      </span>
                    </div>
                  </div>

                  {/* Card Kebutuhan Crew (Craw) */}
                  <div
                    onClick={() => handleMainCategoryChange('Kebutuhan Crew')}
                    style={{
                      padding: '0.9rem 1rem',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      border: formData.mainCategory === 'Kebutuhan Crew'
                        ? '2px solid #10b981'
                        : '1px solid var(--border-subtle)',
                      background: formData.mainCategory === 'Kebutuhan Crew'
                        ? 'rgba(16, 185, 129, 0.12)'
                        : 'rgba(255, 255, 255, 0.02)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: formData.mainCategory === 'Kebutuhan Crew' ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
                      color: formData.mainCategory === 'Kebutuhan Crew' ? '#0f172a' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Users size={22} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.925rem', color: 'var(--text-primary)', display: 'block' }}>
                        👥 Kebutuhan Crew (Awak Kapal)
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Bahan Makanan/Galley, Air Minum, APD Pelaut, Mess, P3K & Sabun
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-Category Dropdown */}
                <div style={{ marginTop: '0.65rem' }}>
                  <label className="field-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Sub-Kategori Spesifikasi:
                  </label>
                  <select
                    value={formData.subCategory}
                    onChange={(e) => setFormData(prev => ({ ...prev, subCategory: e.target.value }))}
                    className="select-control"
                    style={{ fontSize: '0.825rem', fontWeight: 600 }}
                  >
                    {SUB_CATEGORIES[formData.mainCategory].map(sc => (
                      <option key={sc} value={sc}>{sc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 2. DATA KAPAL & PIC PEMOHON (EQUIPMENT DIHAPUS, TEKNISI DIGANTI PIC) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="field-label">Kapal Pemohon *</label>
                  <select
                    value={formData.vesselId}
                    onChange={(e) => setFormData(prev => ({ ...prev, vesselId: e.target.value }))}
                    className="select-control"
                  >
                    {vessels.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.ownershipStatus || 'Owner'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="field-label">PIC / Pemohon (Person In Charge) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ir. Bambang Wijaya (KKM)"
                    value={formData.picName}
                    onChange={(e) => setFormData(prev => ({ ...prev, picName: e.target.value }))}
                    className="input-control"
                  />
                  {/* Quick Crew PIC Dropdown Selector */}
                  <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.25rem', overflowX: 'auto' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Pilih Cepat:</span>
                    {vesselCrewList.slice(0, 3).map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, picName: c.name, picRole: c.rank }))}
                        className="badge"
                        style={{
                          fontSize: '0.65rem',
                          background: formData.picName === c.name ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                          color: formData.picName === c.name ? '#38bdf8' : 'var(--text-muted)',
                          border: '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {c.name.split(',')[0]} ({c.rank.split(' ')[0]})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. PRIORITAS, TANGGAL & LOKASI (TARGET JAM HILANGKAN) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '0.75rem' }}>
                <div>
                  <label className="field-label">Prioritas Pengiriman</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="select-control"
                  >
                    <option value="Rutin / Normal">Rutin / Normal</option>
                    <option value="Penting (Segera)">Penting (Segera)</option>
                    <option value="Mendesak / Emergency">Mendesak / Emergency (Kritis)</option>
                  </select>
                </div>

                <div>
                  <label className="field-label">Batas Tgl Dibutuhkan *</label>
                  <input
                    type="date"
                    required
                    value={formData.neededDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, neededDate: e.target.value }))}
                    className="input-control"
                  />
                </div>

                <div>
                  <label className="field-label">Lokasi Penyerahan Barang</label>
                  <input
                    type="text"
                    placeholder="Dermaga Pelabuhan Samarinda / Muara Berau"
                    value={formData.deliveryLocation}
                    onChange={(e) => setFormData(prev => ({ ...prev, deliveryLocation: e.target.value }))}
                    className="input-control"
                  />
                </div>
              </div>

              {/* 4. DAFTAR KEBUTUHAN BARANG (KATALOG CEPAT & INPUT MANUAL) */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      Daftar Kebutuhan Barang ke Gudang
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Pilih barang dari katalog cepat {formData.mainCategory} atau ketik manual di bawah.
                    </p>
                  </div>
                  <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                    {items.length} Barang Siap Diminta
                  </span>
                </div>

                {/* A. Katalog Cepat (Presets) */}
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', display: 'block', marginBottom: '0.35rem' }}>
                    📦 PILIH CEPAT DARI KATALOG {formData.mainCategory.toUpperCase()}:
                  </span>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', maxHeight: '110px', overflowY: 'auto', padding: '0.2rem' }}>
                    {CATALOG_PRESETS[formData.mainCategory].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddPresetItem(preset)}
                        className="badge"
                        style={{
                          fontSize: '0.72rem',
                          padding: '0.35rem 0.65rem',
                          background: 'rgba(56, 189, 248, 0.08)',
                          color: 'var(--text-primary)',
                          border: '1px solid rgba(56, 189, 248, 0.25)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          transition: 'all 0.15s ease'
                        }}
                        title={`Klik untuk menambahkan: ${preset.name} (${preset.unit})`}
                      >
                        <Plus size={12} color="#38bdf8" />
                        <span>{preset.name}</span>
                        <span style={{ fontSize: '0.62rem', opacity: 0.7 }}>[{preset.unit}]</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* B. Form Input Manual Barang */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 80px 100px 2fr auto',
                  gap: '0.5rem',
                  alignItems: 'flex-end',
                  background: 'rgba(0, 0, 0, 0.2)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-glass)'
                }}>
                  <div>
                    <label className="field-label" style={{ fontSize: '0.72rem' }}>Nama Barang (Manual) *</label>
                    <input
                      type="text"
                      placeholder="Ketik nama barang yang diminta..."
                      value={manualItem.name}
                      onChange={(e) => setManualItem(prev => ({ ...prev, name: e.target.value }))}
                      className="input-control"
                      style={{ fontSize: '0.8rem', padding: '0.45rem 0.65rem' }}
                    />
                  </div>

                  <div>
                    <label className="field-label" style={{ fontSize: '0.72rem' }}>Jumlah *</label>
                    <input
                      type="number"
                      min="1"
                      value={manualItem.qty}
                      onChange={(e) => setManualItem(prev => ({ ...prev, qty: e.target.value }))}
                      className="input-control mono"
                      style={{ fontSize: '0.8rem', padding: '0.45rem 0.5rem' }}
                    />
                  </div>

                  <div>
                    <label className="field-label" style={{ fontSize: '0.72rem' }}>Satuan *</label>
                    <select
                      value={manualItem.unit}
                      onChange={(e) => setManualItem(prev => ({ ...prev, unit: e.target.value }))}
                      className="select-control"
                      style={{ fontSize: '0.8rem', padding: '0.45rem 0.4rem' }}
                    >
                      {['Pcs', 'Drum', 'Liter', 'Zak', 'Kg', 'Roll', 'Kaleng', 'Pail', 'Box', 'Dus', 'Set', 'Pasang', 'Lusin', 'Galon', 'Meter'].map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="field-label" style={{ fontSize: '0.72rem' }}>Keterangan / Spesifikasi</label>
                    <input
                      type="text"
                      placeholder="Contoh: Untuk Main Engine / Ransum 14 hari"
                      value={manualItem.notes}
                      onChange={(e) => setManualItem(prev => ({ ...prev, notes: e.target.value }))}
                      className="input-control"
                      style={{ fontSize: '0.8rem', padding: '0.45rem 0.65rem' }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddManualItem}
                    className="btn btn-primary btn-sm"
                    style={{ height: '36px', display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}
                  >
                    <Plus size={14} />
                    <span>+ Tambah</span>
                  </button>
                </div>

                {/* C. Tabel Daftar Barang yang Akan Dikirim */}
                <div style={{ marginTop: '0.85rem', overflowX: 'auto' }}>
                  <table className="pms-table" style={{ fontSize: '0.825rem' }}>
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>No</th>
                        <th>Nama Barang / Material</th>
                        <th style={{ width: '120px' }}>Jumlah</th>
                        <th>Kategori</th>
                        <th>Keterangan / Spesifikasi</th>
                        <th style={{ width: '60px', textAlign: 'center' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                            Belum ada barang yang ditambahkan. Silakan klik katalog di atas atau input manual.
                          </td>
                        </tr>
                      ) : (
                        items.map((item, index) => (
                          <tr key={item.id}>
                            <td className="mono" style={{ color: 'var(--text-muted)' }}>{index + 1}</td>
                            <td>
                              <strong style={{ color: 'var(--text-primary)' }}>{item.name}</strong>
                            </td>
                            <td className="mono">
                              <span style={{ fontWeight: 700, color: '#38bdf8' }}>{item.qty}</span> {item.unit}
                            </td>
                            <td>
                              <span className="badge" style={{
                                fontSize: '0.68rem',
                                background: item.category === 'Kebutuhan Crew' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                                color: item.category === 'Kebutuhan Crew' ? '#10b981' : '#38bdf8'
                              }}>
                                {item.category}
                              </span>
                            </td>
                            <td style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                              {item.notes || '-'}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="btn-icon"
                                style={{ color: '#ef4444', padding: '4px' }}
                                title="Hapus Barang"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 5. INSTRUKSI / CATATAN KHUSUS UNTUK GUDANG */}
              <div>
                <label className="field-label">Catatan / Instruksi Tambahan untuk Petugas Gudang</label>
                <textarea
                  rows="2"
                  placeholder="Catatan tambahan seperti jam penyerahan, kontak agen pelabuhan, dll."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="input-control"
                  style={{ fontSize: '0.825rem' }}
                />
              </div>
            </div>

            {/* Modal Footer Form */}
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Batal
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
                >
                  <FileText size={16} />
                  <span>Terbitkan & Cetak Surat Permintaan</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: SURAT PERMINTAAN RESMI (TABEL + TTD KAPTEN & PEMOHON)            */}
        {/* ========================================================================= */}
        {viewMode === 'letter' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
            {/* Action Bar (No-Print) */}
            <div className="no-print" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1.25rem',
              background: 'rgba(56, 189, 248, 0.08)',
              borderBottom: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="#10b981" />
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Surat Permintaan Siap Ditandatangani & Dikirim ke Gudang
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleCopyText}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}
                >
                  {copiedText ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  <span>{copiedText ? 'Tersalin!' : 'Salin Teks'}</span>
                </button>

                <button
                  onClick={handleSendWA}
                  className="btn btn-whatsapp btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}
                >
                  <Send size={14} />
                  <span>Kirim WA ke Gudang</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700 }}
                >
                  <Printer size={14} />
                  <span>Cetak Surat (Print / PDF)</span>
                </button>
              </div>
            </div>

            {/* PRINTABLE LETTER CONTAINER */}
            <div className="modal-body" style={{ padding: '1.25rem' }}>
              <div
                className="particulars-sheet"
                style={{
                  background: '#ffffff',
                  color: '#0f172a',
                  padding: '2rem',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                  fontFamily: '"Segoe UI", Arial, sans-serif'
                }}
              >
                {/* 1. KOP SURAT RESMI */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', borderBottom: '3px double #0f172a', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
                  <BaharimasEmblem size={52} />
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                      PT. PELAYARAN BAHARIMAS KALIMANTAN
                    </h2>
                    <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0369a1', margin: '2px 0 0 0', textTransform: 'uppercase' }}>
                      SHIP MANAGEMENT & FLEET LOGISTICS SUPPLY DIVISION
                    </p>
                    <p style={{ fontSize: '0.72rem', color: '#475569', margin: '2px 0 0 0' }}>
                      Jl. P. Untung Suropati No. 88, Samarinda, Kalimantan Timur 75126 • Telp: (0541) 741234 • Email: logistics@baharimas.co.id
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', borderLeft: '1px solid #cbd5e1', paddingLeft: '1rem' }}>
                    <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block' }}>FORMULIR LOGISTIK</span>
                    <strong style={{ fontSize: '0.8rem', color: '#0f172a', fontFamily: 'monospace' }}>FORM-LOG-04/REV.02</strong>
                  </div>
                </div>

                {/* 2. JUDUL DOKUMEN & NOMOR */}
                <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{
                    fontSize: '1.15rem',
                    fontWeight: 900,
                    color: '#0f172a',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    textDecoration: 'underline'
                  }}>
                    SURAT PERMINTAAN BARANG KE GUDANG
                  </h3>
                  <p style={{ fontSize: '0.78rem', fontStyle: 'italic', color: '#64748b', margin: '2px 0 0 0' }}>
                    (MATERIAL / STORE REQUISITION FORM)
                  </p>
                  <p style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0369a1', margin: '4px 0 0 0', fontFamily: 'monospace' }}>
                    Nomor: {formData.documentNo}
                  </p>
                </div>

                {/* 3. METADATA PERMINTAAN */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.85rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.8rem',
                  background: '#f8fafc',
                  padding: '0.85rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex' }}>
                      <span style={{ width: '130px', color: '#64748b' }}>Nama Kapal:</span>
                      <strong style={{ color: '#0f172a' }}>{currentVessel?.name} ({currentVessel?.type?.split(' ')[0]})</strong>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <span style={{ width: '130px', color: '#64748b' }}>Kategori Kebutuhan:</span>
                      <strong style={{ color: formData.mainCategory === 'Kebutuhan Crew' ? '#059669' : '#0284c7' }}>
                        {formData.mainCategory} ({formData.subCategory})
                      </strong>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <span style={{ width: '130px', color: '#64748b' }}>PIC / Pemohon:</span>
                      <strong style={{ color: '#0f172a' }}>{formData.picName} ({formData.picRole})</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex' }}>
                      <span style={{ width: '130px', color: '#64748b' }}>Tanggal Pengajuan:</span>
                      <strong style={{ color: '#0f172a' }}>{formData.requestDate}</strong>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <span style={{ width: '130px', color: '#64748b' }}>Tanggal Dibutuhkan:</span>
                      <strong style={{ color: '#dc2626' }}>{formData.neededDate}</strong>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <span style={{ width: '130px', color: '#64748b' }}>Prioritas / Lokasi:</span>
                      <strong style={{ color: '#0f172a' }}>{formData.priority} • {formData.deliveryLocation}</strong>
                    </div>
                  </div>
                </div>

                {/* 4. TABEL PERMINTAAN BARANG RESMI (SEPERTI YANG DIMINTA PENGGUNA) */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.8rem',
                    border: '1px solid #0f172a'
                  }}>
                    <thead>
                      <tr style={{ background: '#e2e8f0', color: '#0f172a', borderBottom: '2px solid #0f172a' }}>
                        <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '35px', textAlign: 'center' }}>NO</th>
                        <th style={{ border: '1px solid #0f172a', padding: '6px 10px', textAlign: 'left' }}>NAMA BARANG / MATERIAL</th>
                        <th style={{ border: '1px solid #0f172a', padding: '6px 8px', width: '110px', textAlign: 'center' }}>JUMLAH</th>
                        <th style={{ border: '1px solid #0f172a', padding: '6px 10px', textAlign: 'left' }}>KETERANGAN / SPESIFIKASI / PERUNTUKAN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                          <td style={{ border: '1px solid #0f172a', padding: '6px 8px', textAlign: 'center', fontWeight: 600 }}>
                            {idx + 1}
                          </td>
                          <td style={{ border: '1px solid #0f172a', padding: '6px 10px', fontWeight: 700, color: '#0f172a' }}>
                            {item.name}
                          </td>
                          <td style={{ border: '1px solid #0f172a', padding: '6px 8px', textAlign: 'center', fontWeight: 700, color: '#0369a1' }}>
                            {item.qty} {item.unit}
                          </td>
                          <td style={{ border: '1px solid #0f172a', padding: '6px 10px', color: '#334155' }}>
                            {item.notes || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 5. CATATAN TAMBAHAN */}
                {formData.notes && (
                  <div style={{ marginBottom: '1.5rem', fontSize: '0.75rem', color: '#475569', fontStyle: 'italic' }}>
                    <strong>Catatan Khusus:</strong> {formData.notes}
                  </div>
                )}

                {/* 6. TANDA TANGAN (TTD PEMOHON & KAPTEN SEPERTI YANG DIMINTA PENGGUNA) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '1rem',
                  marginTop: '1.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px dashed #cbd5e1',
                  textAlign: 'center'
                }}>
                  {/* Kolom 1: Pemohon / PIC */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.2rem' }}>
                      Diajukan oleh (PIC):
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                      {formData.picRole || 'Pemohon'}
                    </span>
                    {/* Digital Signature Representation */}
                    <div style={{
                      height: '65px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: '"Brush Script MT", cursive, sans-serif',
                      fontSize: '1.4rem',
                      color: '#0369a1',
                      opacity: 0.85
                    }}>
                      {formData.picName.split(' ')[0]} Sign.
                    </div>
                    <strong style={{ fontSize: '0.8rem', color: '#0f172a', borderTop: '1px solid #0f172a', width: '85%', paddingTop: '3px' }}>
                      ( {formData.picName} )
                    </strong>
                    <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                      Tgl: {formData.requestDate}
                    </span>
                  </div>

                  {/* Kolom 2: Petugas Gudang (Logistik) */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.2rem' }}>
                      Diterima oleh (Gudang):
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                      Petugas Gudang & Logistik
                    </span>
                    {/* Warehouse Stamp / Sign */}
                    <div style={{
                      height: '65px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        border: '2px dashed #0284c7',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        color: '#0284c7',
                        fontWeight: 800,
                        transform: 'rotate(-4deg)'
                      }}>
                        LOGISTIK GUDANG PT. PBK<br/>[ TERIMA / VALIDASI ]
                      </div>
                    </div>
                    <strong style={{ fontSize: '0.8rem', color: '#0f172a', borderTop: '1px solid #0f172a', width: '85%', paddingTop: '3px' }}>
                      ( Staff Gudang Samarinda )
                    </strong>
                    <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                      Tgl: __ / __ / 2026
                    </span>
                  </div>

                  {/* Kolom 3: Mengetahui & Menyetujui: Kapten / Nakhoda */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.2rem' }}>
                      Mengetahui & Menyetujui:
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                      Nakhoda / Master Kapal
                    </span>
                    {/* Captain Round Stamp & Sign */}
                    <div style={{
                      height: '65px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: '55px',
                        height: '55px',
                        borderRadius: '50%',
                        border: '2px solid #059669',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.5rem',
                        color: '#059669',
                        fontWeight: 900,
                        textAlign: 'center',
                        lineHeight: 1.1,
                        transform: 'rotate(8deg)'
                      }}>
                        <span>★ PBK ★</span>
                        <span style={{ fontSize: '0.45rem' }}>CAPTAIN</span>
                        <span style={{ fontSize: '0.45rem' }}>RP 2020</span>
                      </div>
                    </div>
                    <strong style={{ fontSize: '0.8rem', color: '#0f172a', borderTop: '1px solid #0f172a', width: '85%', paddingTop: '3px' }}>
                      ( {captainName} )
                    </strong>
                    <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                      Reg BKI: {currentVessel?.regNo || 'B-24587-ID'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Letter (No-Print) */}
            <div className="modal-footer no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setViewMode('form')}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <ArrowLeft size={16} />
                <span>Ubah Daftar Barang</span>
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                >
                  Selesai / Tutup
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
                >
                  <Printer size={16} />
                  <span>Cetak Surat Permintaan</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
