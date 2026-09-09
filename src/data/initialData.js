// Initial realistic seed data for Maritime Planned Maintenance System (PMS)
// Corresponds to PRD specifications: Ships, Equipment, Maintenance, Spareparts, Costs, Crew, Documents, Notifications

export const INITIAL_VESSELS = [
  {
    id: "v-001",
    name: "KM Nusantara Express",
    imo: "9821450",
    callSign: "YDA3421",
    type: "General Cargo / Kontainer",
    flag: "Indonesia (IDN)",
    portOfRegistry: "Tanjung Priok, Jakarta",
    gt: 4250,
    dwt: 6500,
    yearBuilt: 2018,
    builder: "PT PAL Indonesia",
    status: "Operasional (Berlayar)",
    currentLocation: "Selat Sunda (Menuju Belawan)",
    speedKnots: 12.4,
    chiefEngineer: "Ir. Bambang Wijaya",
    masterCaptain: "Capt. Hendra Gunawan, M.Mar",
    photo: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "v-002",
    name: "TB Baruna Perkasa",
    imo: "9753218",
    callSign: "YDB8812",
    type: "Tugboat (Kapal Tunda)",
    flag: "Indonesia (IDN)",
    portOfRegistry: "Batam",
    gt: 480,
    dwt: 620,
    yearBuilt: 2020,
    builder: "PT Nongsa Shipyard Batam",
    status: "Operasional (Pelabuhan)",
    currentLocation: "Perairan Tanjung Uncang, Batam",
    speedKnots: 8.5,
    chiefEngineer: "Rahmat Santoso, A.Md.T",
    masterCaptain: "Capt. Agus Supriyadi",
    photo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "v-003",
    name: "KM Samudera Sejahtera",
    imo: "9914022",
    callSign: "YDC1190",
    type: "Bulk Carrier (Curah Kering)",
    flag: "Indonesia (IDN)",
    portOfRegistry: "Surabaya",
    gt: 12800,
    dwt: 18500,
    yearBuilt: 2016,
    builder: "Oshima Shipbuilding Co.",
    status: "Docking / Perawatan Berkala",
    currentLocation: "Galangan Dok Surabaya",
    speedKnots: 0.0,
    chiefEngineer: "Dwi Prasetyo, M.T",
    masterCaptain: "Capt. Ilham Firmansyah",
    photo: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80"
  }
];

export const INITIAL_EQUIPMENT = [
  // KM Nusantara Express (v-001)
  {
    id: "eq-101",
    vesselId: "v-001",
    code: "ME-01",
    name: "Main Engine (Mesin Induk)",
    category: "Propulsi",
    model: "MAN B&W 6S35MC",
    serialNumber: "MN-9821450-ME1",
    maker: "MAN Energy Solutions",
    location: "Engine Room Deck 1",
    runningHours: 9850,
    lastMaintenanceHours: 9500,
    nextServiceHours: 10000,
    status: "Due Soon", // 150 hours left
    criticality: "Tinggi",
    installedDate: "2018-04-12",
    subComponents: ["Turbocharger", "Cylinder Liner #1-6", "Fuel Injection Pump", "Main Lubricating Oil Pump"]
  },
  {
    id: "eq-102",
    vesselId: "v-001",
    code: "AE-01",
    name: "Auxiliary Engine / Genset #1",
    category: "Kelistrikan",
    model: "Yanmar 6EY18ALW (600 kVA)",
    serialNumber: "YN-44129-AE1",
    maker: "Yanmar Co., Ltd.",
    location: "Engine Room Platform",
    runningHours: 4980,
    lastMaintenanceHours: 4500,
    nextServiceHours: 5000,
    status: "Due Soon", // 20 hours left
    criticality: "Tinggi",
    installedDate: "2018-04-15",
    subComponents: ["Alternator", "Nozzle Injector", "Air Cooler", "Oil Purifier"]
  },
  {
    id: "eq-103",
    vesselId: "v-001",
    code: "BP-01",
    name: "Main Ballast Pump",
    category: "Sistem Pompa",
    model: "Taiko Kikai ESC-200M (400 m3/h)",
    serialNumber: "TK-77821-BP1",
    maker: "Taiko Kikai Industries",
    location: "Pump Room Forward",
    runningHours: 3200,
    lastMaintenanceHours: 3000,
    nextServiceHours: 4000,
    status: "Normal",
    criticality: "Sedang",
    installedDate: "2018-05-01",
    subComponents: ["Impeller", "Mechanical Seal", "Electric Motor 45kW"]
  },
  {
    id: "eq-104",
    vesselId: "v-001",
    code: "AC-01",
    name: "Main Starting Air Compressor #1",
    category: "Pneumatik",
    model: "Sperre HL2/120 (30 bar)",
    serialNumber: "SP-88310-AC1",
    maker: "Sperre Air Power",
    location: "Engine Room Starboard",
    runningHours: 2510,
    lastMaintenanceHours: 2000,
    nextServiceHours: 2500,
    status: "Overdue", // 10 hours overdue
    criticality: "Tinggi",
    installedDate: "2018-04-20",
    subComponents: ["Valves LP/HP", "Piston Rings", "Safety Relief Valve"]
  },
  {
    id: "eq-105",
    vesselId: "v-001",
    code: "NAV-01",
    name: "X-Band Marine Radar (ARPA)",
    category: "Navigasi & Komunikasi",
    model: "Furuno FAR-2218BB",
    serialNumber: "FR-2218-9901",
    maker: "Furuno Electric",
    location: "Wheelhouse / Anjungan",
    runningHours: 14200,
    lastMaintenanceHours: 12000,
    nextServiceHours: 15000,
    status: "Normal",
    criticality: "Tinggi",
    installedDate: "2018-03-30",
    subComponents: ["Magnetron", "Scanner Unit", "Processor Unit"]
  },

  // TB Baruna Perkasa (v-002)
  {
    id: "eq-201",
    vesselId: "v-002",
    code: "ME-TUG-01",
    name: "Main Engine Port (Caterpillar 3516C)",
    category: "Propulsi",
    model: "CAT 3516C HD (2575 BHP)",
    serialNumber: "CAT-3516-P01",
    maker: "Caterpillar Marine",
    location: "Engine Room Center",
    runningHours: 6420,
    lastMaintenanceHours: 6000,
    nextServiceHours: 6500,
    status: "Due Soon",
    criticality: "Tinggi",
    installedDate: "2020-02-10",
    subComponents: ["Turbocharger", "Intercooler", "Water Jacket Pump", "Governor"]
  },
  {
    id: "eq-202",
    vesselId: "v-002",
    code: "WINCH-01",
    name: "Hydraulic Towing Winch (Bollard Pull 65 Ton)",
    category: "Deck Machinery",
    model: "Plimsoll Electro-Hydraulic 65T",
    serialNumber: "PLM-TW-65-01",
    maker: "Plimsoll Marine",
    location: "Aft Main Deck",
    runningHours: 1850,
    lastMaintenanceHours: 1500,
    nextServiceHours: 2000,
    status: "Normal",
    criticality: "Tinggi",
    installedDate: "2020-02-25",
    subComponents: ["Hydraulic Motor", "Brake Band Lining", "Wire Drum"]
  },

  // KM Samudera Sejahtera (v-003)
  {
    id: "eq-301",
    vesselId: "v-003",
    code: "ME-BULK-01",
    name: "Main Engine 2-Stroke (Hitachi MAN 6S50ME-C)",
    category: "Propulsi",
    model: "Hitachi MAN 6S50ME-C9.2",
    serialNumber: "H-MAN-6S50-8802",
    maker: "Hitachi Zosen",
    location: "Engine Room",
    runningHours: 18200,
    lastMaintenanceHours: 15000,
    nextServiceHours: 18000,
    status: "Overdue", // In Docking for major overhaul
    criticality: "Tinggi",
    installedDate: "2016-08-10",
    subComponents: ["Cylinder Heads", "Crosshead Bearings", "Exhaust Valves", "Hydraulic Power Unit"]
  },
  {
    id: "eq-302",
    vesselId: "v-003",
    code: "CRANE-01",
    name: "Deck Cargo Crane #1 (SWL 35 Ton)",
    category: "Deck Machinery",
    model: "IHI Hydraulic Jib Crane H-35022",
    serialNumber: "IHI-35T-C1",
    maker: "IHI Corporation",
    location: "Main Deck Between Hold 1 & 2",
    runningHours: 4100,
    lastMaintenanceHours: 3750,
    nextServiceHours: 4250,
    status: "Due Soon",
    criticality: "Sedang",
    installedDate: "2016-09-01",
    subComponents: ["Hoisting Motor", "Luffing Cylinder", "Slewing Bearing"]
  }
];

export const INITIAL_MAINTENANCE_SCHEDULES = [
  {
    id: "sch-01",
    equipmentId: "eq-101",
    title: "10,000 Hours Major Inspection & Overhaul",
    intervalType: "running_hours", // running_hours | calendar
    intervalHours: 5000,
    intervalDays: null,
    leadTimeDays: 14,
    description: "Inspeksi berkala ruang bakar, clearance bantalan, kalibrasi nozzle injeksi, pengujian relief valve.",
    assignedRole: "Teknisi / Chief Engineer",
    priority: "Tinggi"
  },
  {
    id: "sch-02",
    equipmentId: "eq-104",
    title: "Pembersihan Katup & Penggantian Filter Kompresor",
    intervalType: "running_hours",
    intervalHours: 500,
    intervalDays: null,
    leadTimeDays: 7,
    description: "Bongkar katup isap dan tekan LP/HP, bersihkan kerak karbon, ganti oli kompresor sintetik.",
    assignedRole: "Teknisi / Chief Engineer",
    priority: "Tinggi"
  },
  {
    id: "sch-03",
    equipmentId: "eq-102",
    title: "Servis Rutin 500 Jam Genset #1",
    intervalType: "running_hours",
    intervalHours: 500,
    intervalDays: null,
    leadTimeDays: 5,
    description: "Ganti filter oli, filter bahan bakar, periksa celah katup dan tegangan v-belt.",
    assignedRole: "Teknisi / Chief Engineer",
    priority: "Tinggi"
  },
  {
    id: "sch-04",
    equipmentId: "eq-103",
    title: "Inspeksi Berkala & Greasing Pompa Ballast",
    intervalType: "calendar",
    intervalHours: null,
    intervalDays: 90, // Triwulanan
    leadTimeDays: 10,
    description: "Pemeriksaan getaran (vibration analysis), greasing bearing motor, cek mechanical seal leakage.",
    assignedRole: "Teknisi / Chief Engineer",
    priority: "Sedang"
  },
  {
    id: "sch-05",
    equipmentId: "eq-301",
    title: "Special Survey / Dry Docking Overhaul 5 Tahun",
    intervalType: "calendar",
    intervalHours: null,
    intervalDays: 1825, // 5 Tahun
    leadTimeDays: 60,
    description: "Penarikan poros propeller, pengukuran deflection crankshaft, overhaul total mesin utama oleh Class Surveyor.",
    assignedRole: "Fleet Manager",
    priority: "Sangat Tinggi"
  }
];

export const INITIAL_WORK_ORDERS = [
  {
    id: "WO-2026-001",
    vesselId: "v-001",
    equipmentId: "eq-104",
    scheduleId: "sch-02",
    title: "Overhaul Katup & Ganti Oli Kompresor Udara #1",
    category: "Planned Preventive Maintenance",
    priority: "Tinggi",
    status: "Overdue", // Scheduled | Assigned | In Progress | Review | Completed | Overdue
    dueDate: "2026-09-05",
    currentRunningHours: 2510,
    targetHours: 2500,
    assignedTo: "Kurniawan (Masinis 2)",
    supervisor: "Ir. Bambang Wijaya (C/E)",
    laborHoursEstimated: 6,
    laborHoursActual: 0,
    costEstimated: 4500000,
    costActual: 0,
    checklist: [
      { id: "c1", text: "Lakukan Lock-Out Tag-Out (LOTO) breaker kompresor", done: true },
      { id: "c2", text: "Kuras tekanan angin sisa pada receiver dan pipa discharge", done: true },
      { id: "c3", text: "Bongkar head silinder dan inspeksi katup LP & HP", done: false },
      { id: "c4", text: "Lakukan pembersihan karbon atau ganti valve plate", done: false },
      { id: "c5", text: "Kuras dan isi oli kompresor baru SAE 100", done: false },
      { id: "c6", text: "Uji coba running selama 30 menit dan catat cut-off pressure", done: false }
    ],
    partsRequired: [
      { partId: "sp-103", name: "Valve Plate Set Sperre HL2", qty: 2, unit: "Set", cost: 1800000 },
      { partId: "sp-104", name: "Oli Kompresor Shell Corena S4 R 68", qty: 10, unit: "Liter", cost: 1200000 }
    ],
    notes: "Sudah melewati 10 jam operasional, segera selesaikan sebelum keberangkatan menuju Belawan."
  },
  {
    id: "WO-2026-002",
    vesselId: "v-001",
    equipmentId: "eq-102",
    scheduleId: "sch-03",
    title: "Servis 500 Jam Genset Yanmar #1",
    category: "Planned Preventive Maintenance",
    priority: "Tinggi",
    status: "In Progress",
    dueDate: "2026-09-12",
    currentRunningHours: 4980,
    targetHours: 5000,
    assignedTo: "Asep Sunandar (Masinis 3)",
    supervisor: "Ir. Bambang Wijaya (C/E)",
    laborHoursEstimated: 8,
    laborHoursActual: 3,
    costEstimated: 8200000,
    costActual: 4500000,
    checklist: [
      { id: "c1", text: "Transfer beban listrik ke Genset #2", done: true },
      { id: "c2", text: "Stop Genset #1 dan pasang safety warning sign", done: true },
      { id: "c3", text: "Ganti elemen filter oli pelumas", done: true },
      { id: "c4", text: "Ganti cartridge fuel oil filter primer & sekunder", done: false },
      { id: "c5", text: "Periksa kekencangan baut flywheel & coupling", done: false },
      { id: "c6", text: "Pengujian start manual dan otomatis synchronizer", done: false }
    ],
    partsRequired: [
      { partId: "sp-101", name: "Lube Oil Filter Element Yanmar 6EY", qty: 2, unit: "Pcs", cost: 2400000 },
      { partId: "sp-102", name: "Fuel Filter Cartridge", qty: 2, unit: "Pcs", cost: 1800000 }
    ],
    notes: "Filter oli sudah diganti, tinggal penggantian filter BBM dan uji sinkronisasi."
  },
  {
    id: "WO-2026-003",
    vesselId: "v-001",
    equipmentId: "eq-101",
    scheduleId: "sch-01",
    title: "Persiapan Inspeksi 10.000 Jam Mesin Utama",
    category: "Scheduled Overhaul",
    priority: "Tinggi",
    status: "Scheduled",
    dueDate: "2026-09-28",
    currentRunningHours: 9850,
    targetHours: 10000,
    assignedTo: "Tim Engine Room KM Nusantara",
    supervisor: "Ir. Bambang Wijaya (C/E)",
    laborHoursEstimated: 48,
    laborHoursActual: 0,
    costEstimated: 45000000,
    costActual: 0,
    checklist: [
      { id: "c1", text: "Koordinasi dengan kantor perihal teknisi authorized MAN", done: false },
      { id: "c2", text: "Pengecekan ketersediaan sparepart ring piston dan gasket", done: true },
      { id: "c3", text: "Pengukuran crankshaft deflection sebelum bongkar", done: false },
      { id: "c4", text: "Pencabutan piston unit silinder #3 dan #4 untuk inspeksi", done: false }
    ],
    partsRequired: [
      { partId: "sp-105", name: "Piston Ring Set MAN 6S35MC", qty: 6, unit: "Set", cost: 32000000 }
    ],
    notes: "Akan dikerjakan saat kapal tiba di Pelabuhan Belawan dan sandar selama 3 hari."
  },
  {
    id: "WO-2026-004",
    vesselId: "v-002",
    equipmentId: "eq-201",
    scheduleId: null,
    title: "Ganti Sensor Suhu Air Pendingin CAT 3516C",
    category: "Corrective Maintenance",
    priority: "Sedang",
    status: "Completed",
    dueDate: "2026-09-02",
    currentRunningHours: 6400,
    targetHours: 6400,
    assignedTo: "Rahmat Santoso",
    supervisor: "Capt. Agus Supriyadi",
    laborHoursEstimated: 3,
    laborHoursActual: 2.5,
    costEstimated: 2500000,
    costActual: 2350000,
    checklist: [
      { id: "c1", text: "Diagnosa error reading pada panel alarm", done: true },
      { id: "c2", text: "Lepas sensor lama dan pasang sensor OEM Caterpillar", done: true },
      { id: "c3", text: "Sea trial beban 80% temperatur normal 82 deg C", done: true }
    ],
    partsRequired: [
      { partId: "sp-201", name: "CAT Water Temperature Sensor #256-6453", qty: 1, unit: "Pcs", cost: 2350000 }
    ],
    notes: "Pekerjaan selesai 100%, pembacaan temperatur kembali akurat."
  },
  {
    id: "WO-2026-005",
    vesselId: "v-003",
    equipmentId: "eq-301",
    scheduleId: "sch-05",
    title: "Major Docking Overhaul Crankshaft & Propeller",
    category: "Special Survey / Dry Dock",
    priority: "Sangat Tinggi",
    status: "In Progress",
    dueDate: "2026-09-30",
    currentRunningHours: 18200,
    targetHours: 18000,
    assignedTo: "Kontraktor PT PAL & Tim Kapal",
    supervisor: "Dwi Prasetyo, M.T (C/E)",
    laborHoursEstimated: 120,
    laborHoursActual: 65,
    costEstimated: 350000000,
    costActual: 210000000,
    checklist: [
      { id: "c1", text: "Penarikan poros baling-baling (tailshaft survey)", done: true },
      { id: "c2", text: "Penggantian stern tube seal", done: true },
      { id: "c3", text: "Pembersihan dan overhaul turbocharger", done: true },
      { id: "c4", text: "Inspeksi Class Surveyor BKI / NK", done: false },
      { id: "c5", text: "Sea trial pasca docking", done: false }
    ],
    partsRequired: [
      { partId: "sp-301", name: "Stern Tube Seal Complete 650mm", qty: 1, unit: "Set", cost: 85000000 }
    ],
    notes: "Pekerjaan docking berlangsung di Surabaya, progres 60%."
  }
];

export const INITIAL_SPAREPARTS = [
  {
    id: "sp-101",
    code: "SP-YAN-FL01",
    name: "Lube Oil Filter Element Yanmar 6EY",
    equipmentCode: "AE-01",
    vesselId: "v-001",
    category: "Filter",
    stockQty: 4,
    minStockQty: 6,
    unit: "Pcs",
    location: "Rack B-02 Engine Store",
    unitCost: 1200000,
    supplier: "PT Yanmar Marine Indo",
    status: "Low Stock" // stockQty < minStockQty
  },
  {
    id: "sp-102",
    code: "SP-YAN-FF02",
    name: "Fuel Filter Cartridge Yanmar 6EY",
    equipmentCode: "AE-01",
    vesselId: "v-001",
    category: "Filter",
    stockQty: 8,
    minStockQty: 4,
    unit: "Pcs",
    location: "Rack B-03 Engine Store",
    unitCost: 900000,
    supplier: "PT Yanmar Marine Indo",
    status: "Normal"
  },
  {
    id: "sp-103",
    code: "SP-SPR-VP01",
    name: "Valve Plate Set Sperre HL2",
    equipmentCode: "AC-01",
    vesselId: "v-001",
    category: "Valve & Mechanical",
    stockQty: 1,
    minStockQty: 3,
    unit: "Set",
    location: "Cabinet C-01 Air System",
    unitCost: 900000,
    supplier: "Sperre Sparepart Asia",
    status: "Critical"
  },
  {
    id: "sp-104",
    code: "SP-OIL-COR68",
    name: "Oli Kompresor Shell Corena S4 R 68",
    equipmentCode: "AC-01",
    vesselId: "v-001",
    category: "Pelumas / Oil",
    stockQty: 40,
    minStockQty: 20,
    unit: "Liter",
    location: "Drum Storage Starboard",
    unitCost: 120000,
    supplier: "PT Shell Indonesia Maritime",
    status: "Normal"
  },
  {
    id: "sp-105",
    code: "SP-MAN-PR35",
    name: "Piston Ring Set MAN 6S35MC",
    equipmentCode: "ME-01",
    vesselId: "v-001",
    category: "Mesin Utama",
    stockQty: 6,
    minStockQty: 6,
    unit: "Set",
    location: "Rack A-01 Heavy Spares",
    unitCost: 5333000,
    supplier: "MAN Diesel PrimeServ",
    status: "Normal"
  },
  {
    id: "sp-106",
    code: "SP-MAN-INJ01",
    name: "Fuel Injector Nozzle MAN 6S35MC",
    equipmentCode: "ME-01",
    vesselId: "v-001",
    category: "Fuel Injection",
    stockQty: 2,
    minStockQty: 6,
    unit: "Pcs",
    location: "Special Box A-04",
    unitCost: 4500000,
    supplier: "MAN Diesel PrimeServ",
    status: "Low Stock"
  },
  {
    id: "sp-201",
    code: "SP-CAT-SENS01",
    name: "CAT Water Temperature Sensor #256-6453",
    equipmentCode: "ME-TUG-01",
    vesselId: "v-002",
    category: "Sensor & Elektrik",
    stockQty: 2,
    minStockQty: 2,
    unit: "Pcs",
    location: "Rack T-01 Tug Spares",
    unitCost: 2350000,
    supplier: "Trakindo Utama Caterpillar",
    status: "Normal"
  },
  {
    id: "sp-301",
    code: "SP-STERN-650",
    name: "Stern Tube Seal Complete 650mm",
    equipmentCode: "ME-BULK-01",
    vesselId: "v-003",
    category: "Shafting & Propulsion",
    stockQty: 1,
    minStockQty: 1,
    unit: "Set",
    location: "Galangan Dok Surabaya",
    unitCost: 85000000,
    supplier: "KDG Kobelco Marine",
    status: "Normal"
  }
];

export const INITIAL_REQUISITIONS = [
  {
    id: "PR-2026-081",
    vesselId: "v-001",
    requesterName: "Ir. Bambang Wijaya (Chief Engineer)",
    dateSubmitted: "2026-09-06",
    urgency: "Urgent",
    status: "Approved Fleet", // Draft | Submitted | Approved Fleet | Ordered | Received
    totalEstimatedCost: 15400000,
    items: [
      { partId: "sp-101", name: "Lube Oil Filter Element Yanmar 6EY", qty: 6, estimatedUnitCost: 1200000 },
      { partId: "sp-103", name: "Valve Plate Set Sperre HL2", qty: 4, estimatedUnitCost: 900000 },
      { partId: "sp-106", name: "Fuel Injector Nozzle MAN 6S35MC", qty: 4, estimatedUnitCost: 4500000 }
    ],
    notes: "Stok filter dan valve plate sudah di bawah minimum stock kapal. Dibutuhkan sebelum sandar di Belawan."
  },
  {
    id: "PR-2026-079",
    vesselId: "v-002",
    requesterName: "Rahmat Santoso (C/E)",
    dateSubmitted: "2026-08-28",
    urgency: "Normal",
    status: "Ordered",
    totalEstimatedCost: 7500000,
    items: [
      { partId: "sp-201", name: "CAT Impeller Raw Water Pump", qty: 2, estimatedUnitCost: 3750000 }
    ],
    notes: "Estimasi pengiriman tanggal 11 September 2026 ke Dermaga Batam."
  }
];

export const INITIAL_COSTS = [
  {
    id: "cost-01",
    vesselId: "v-001",
    period: "2026-08",
    category: "Sparepart Mesin",
    description: "Pembelian Filter & Seal Kit Servis Rutin Genset",
    amount: 14200000,
    budgetAllocated: 20000000,
    date: "2026-08-15",
    vendor: "PT Yanmar Marine Indo"
  },
  {
    id: "cost-02",
    vesselId: "v-001",
    period: "2026-08",
    category: "Jasa Servis & Inspeksi",
    description: "Jasa Kalibrasi Nozzle Injector di Workshop Darat",
    amount: 6800000,
    budgetAllocated: 8000000,
    date: "2026-08-22",
    vendor: "CV Samudera Presisi Diesel"
  },
  {
    id: "cost-03",
    vesselId: "v-002",
    period: "2026-08",
    category: "Sparepart Tugboat",
    description: "Sensor & Valve Replacement Caterpillar",
    amount: 5100000,
    budgetAllocated: 6500000,
    date: "2026-08-29",
    vendor: "PT Trakindo Utama"
  },
  {
    id: "cost-04",
    vesselId: "v-003",
    period: "2026-09",
    category: "Docking & Galangan",
    description: "Uang Muka Special Survey Dry Docking 5 Tahun",
    amount: 210000000,
    budgetAllocated: 350000000,
    date: "2026-09-01",
    vendor: "PT PAL Indonesia (Persero)"
  }
];

export const INITIAL_CREW = [
  // KM Nusantara Express
  {
    id: "crew-101",
    vesselId: "v-001",
    name: "Capt. Hendra Gunawan, M.Mar",
    rank: "Nakhoda (Master)",
    department: "Deck",
    seamanBookNo: "B-098214-ID",
    phone: "081288991122",
    whatsapp: "+6281288991122",
    status: "Onboard",
    signOnDate: "2026-03-01",
    signOffPlanDate: "2026-11-30",
    contractDurationMonths: 9,
    leaveBalanceDays: 14,
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "crew-102",
    vesselId: "v-001",
    name: "Ir. Bambang Wijaya",
    rank: "Chief Engineer (Kupala)",
    department: "Engine",
    seamanBookNo: "B-044192-ID",
    phone: "081199223344",
    whatsapp: "+6281199223344",
    status: "Onboard",
    signOnDate: "2026-02-15",
    signOffPlanDate: "2026-10-15",
    contractDurationMonths: 8,
    leaveBalanceDays: 12,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "crew-103",
    vesselId: "v-001",
    name: "Reza Fahlevi, S.St.Pel",
    rank: "Chief Officer (Mualim 1)",
    department: "Deck",
    seamanBookNo: "B-112940-ID",
    phone: "081377889900",
    whatsapp: "+6281377889900",
    status: "Onboard",
    signOnDate: "2026-04-10",
    signOffPlanDate: "2026-12-10",
    contractDurationMonths: 8,
    leaveBalanceDays: 16,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "crew-104",
    vesselId: "v-001",
    name: "Kurniawan",
    rank: "Second Engineer (Masinis 2)",
    department: "Engine",
    seamanBookNo: "B-088712-ID",
    phone: "081266554433",
    whatsapp: "+6281266554433",
    status: "Onboard",
    signOnDate: "2026-03-20",
    signOffPlanDate: "2026-11-20",
    contractDurationMonths: 8,
    leaveBalanceDays: 10,
    photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "crew-105",
    vesselId: "v-001",
    name: "Asep Sunandar",
    rank: "Third Engineer (Masinis 3)",
    department: "Engine",
    seamanBookNo: "B-144219-ID",
    phone: "081544332211",
    whatsapp: "+6281544332211",
    status: "Onboard",
    signOnDate: "2026-05-01",
    signOffPlanDate: "2027-01-01",
    contractDurationMonths: 8,
    leaveBalanceDays: 18,
    photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "crew-106",
    vesselId: "v-001",
    name: "Suryadi Pratama",
    rank: "Bosun (Kepala Kelasi)",
    department: "Deck",
    seamanBookNo: "B-033190-ID",
    phone: "081822334455",
    whatsapp: "+6281822334455",
    status: "Onboard",
    signOnDate: "2026-01-10",
    signOffPlanDate: "2026-09-10",
    contractDurationMonths: 8,
    leaveBalanceDays: 6,
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80"
  },

  // TB Baruna Perkasa
  {
    id: "crew-201",
    vesselId: "v-002",
    name: "Capt. Agus Supriyadi",
    rank: "Nakhoda (Master)",
    department: "Deck",
    seamanBookNo: "B-077192-ID",
    phone: "081299881100",
    whatsapp: "+6281299881100",
    status: "Onboard",
    signOnDate: "2026-02-01",
    signOffPlanDate: "2026-10-01",
    contractDurationMonths: 8,
    leaveBalanceDays: 14,
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "crew-202",
    vesselId: "v-002",
    name: "Rahmat Santoso, A.Md.T",
    rank: "Chief Engineer (Kupala)",
    department: "Engine",
    seamanBookNo: "B-099412-ID",
    phone: "081311224455",
    whatsapp: "+6281311224455",
    status: "Onboard",
    signOnDate: "2026-02-01",
    signOffPlanDate: "2026-10-01",
    contractDurationMonths: 8,
    leaveBalanceDays: 14,
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"
  },

  // KM Samudera Sejahtera
  {
    id: "crew-301",
    vesselId: "v-003",
    name: "Capt. Ilham Firmansyah",
    rank: "Nakhoda (Master)",
    department: "Deck",
    seamanBookNo: "B-066124-ID",
    phone: "081233445566",
    whatsapp: "+6281233445566",
    status: "Onboard",
    signOnDate: "2026-04-15",
    signOffPlanDate: "2026-12-15",
    contractDurationMonths: 8,
    leaveBalanceDays: 15,
    photo: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "crew-302",
    vesselId: "v-003",
    name: "Dwi Prasetyo, M.T",
    rank: "Chief Engineer (Kupala)",
    department: "Engine",
    seamanBookNo: "B-055198-ID",
    phone: "081788776655",
    whatsapp: "+6281788776655",
    status: "Onboard",
    signOnDate: "2026-03-01",
    signOffPlanDate: "2026-11-01",
    contractDurationMonths: 8,
    leaveBalanceDays: 11,
    photo: "https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=400&q=80"
  }
];

export const INITIAL_LEAVES = [
  {
    id: "leave-001",
    crewId: "crew-106",
    crewName: "Suryadi Pratama (Bosun)",
    vesselId: "v-001",
    leaveType: "Cuti Tahunan",
    startDate: "2026-09-15",
    endDate: "2026-09-29",
    daysRequested: 14,
    status: "Approved Fleet", // Pending Ship Admin | Approved Ship Admin | Approved Fleet | Rejected
    appliedDate: "2026-09-02",
    replacementCrew: "Hadi Santosa (Standby Pool)",
    notes: "Keperluan mendesak keluarga di Surabaya, sign off di Pelabuhan Belawan."
  },
  {
    id: "leave-002",
    crewId: "crew-104",
    crewName: "Kurniawan (Masinis 2)",
    vesselId: "v-001",
    leaveType: "Cuti Menikah",
    startDate: "2026-10-01",
    endDate: "2026-10-10",
    daysRequested: 9,
    status: "Pending Ship Admin",
    appliedDate: "2026-09-07",
    replacementCrew: "Belum ditunjuk",
    notes: "Pengajuan izin cuti pernikahan di kampung halaman."
  }
];

export const INITIAL_DRILLS = [
  {
    id: "drill-01",
    vesselId: "v-001",
    drillType: "Fire Drill & Emergency Steering (Latihan Pemadam Kebakaran)",
    conductedDate: "2026-08-28",
    location: "Main Deck & Steering Gear Room",
    durationMinutes: 45,
    leadOfficer: "Capt. Hendra Gunawan",
    attendeesCount: 16,
    performanceRating: "Memuaskan",
    scenarioSummary: "Simulasi kebakaran di workshop engine room deck 2. Regu pemadam menggelar selang dalam 2 menit 15 detik, alarm darurat berfungsi normal.",
    correctiveAction: "Ganti 1 pcs nozzle coupling selang hydrant portside yang macet."
  },
  {
    id: "drill-02",
    vesselId: "v-001",
    drillType: "Abandon Ship Drill (Latihan Meninggalkan Kapal)",
    conductedDate: "2026-08-14",
    location: "Lifeboat Station Port & Starboard",
    durationMinutes: 50,
    leadOfficer: "Reza Fahlevi (C/O)",
    attendeesCount: 16,
    performanceRating: "Sangat Baik",
    scenarioSummary: "Seluruh crew berkumpul di muster station lengkap dengan lifejacket dan immersion suit dalam 3 menit.",
    correctiveAction: "Lakukan pelumasan ulang davit wire sekoci kanan."
  },
  {
    id: "drill-03",
    vesselId: "v-002",
    drillType: "Man Overboard Drill (MOB)",
    conductedDate: "2026-08-20",
    location: "Perairan Tanjung Uncang",
    durationMinutes: 30,
    leadOfficer: "Capt. Agus Supriyadi",
    attendeesCount: 8,
    performanceRating: "Memuaskan",
    scenarioSummary: "Simulasi kru jatuh ke laut, pelemparan lifebuoy dan manuver Williamson Turn.",
    correctiveAction: "None."
  }
];

// Certificates & Ship Legal Documents (Critical Core PRD Tracker)
export const INITIAL_CREW_CERTIFICATES = [
  {
    id: "cert-c-101",
    crewId: "crew-101",
    crewName: "Capt. Hendra Gunawan",
    vesselId: "v-001",
    type: "COC (Certificate of Competency)",
    name: "Ahli Nautika Tingkat I (ANT I / Master Mariner)",
    certificateNo: "COC-ANT1-628819",
    issuer: "Ditjen Perhubungan Laut Kemenhub RI",
    issueDate: "2021-10-15",
    expiryDate: "2026-10-15", // H-36 days -> Warning Due Soon
    status: "Due Soon", // Active | Due Soon | Expired
    daysUntilExpiry: 36,
    scanFile: "sertifikat_ant1_capt_hendra.pdf"
  },
  {
    id: "cert-c-102",
    crewId: "crew-101",
    crewName: "Capt. Hendra Gunawan",
    vesselId: "v-001",
    type: "Medical Certificate",
    name: "Medical Fitness Certificate for Seafarers (STCW I/9)",
    certificateNo: "MED-SEA-2025-9912",
    issuer: "RS Pelabuhan Tanjung Priok",
    issueDate: "2024-09-14",
    expiryDate: "2026-09-14", // H-5 days -> CRITICAL DUE SOON
    status: "Due Soon",
    daysUntilExpiry: 5,
    scanFile: "medical_cert_capt_hendra.pdf"
  },
  {
    id: "cert-c-103",
    crewId: "crew-102",
    crewName: "Ir. Bambang Wijaya",
    vesselId: "v-001",
    type: "COC (Certificate of Competency)",
    name: "Ahli Teknika Tingkat I (ATT I / Chief Engineer)",
    certificateNo: "COC-ATT1-441290",
    issuer: "Ditjen Perhubungan Laut Kemenhub RI",
    issueDate: "2022-04-20",
    expiryDate: "2027-04-20",
    status: "Active",
    daysUntilExpiry: 223,
    scanFile: "sertifikat_att1_bambang.pdf"
  },
  {
    id: "cert-c-104",
    crewId: "crew-104",
    crewName: "Kurniawan",
    vesselId: "v-001",
    type: "COP (Certificate of Proficiency)",
    name: "Basic Safety Training (BST - STCW VI/1)",
    certificateNo: "COP-BST-881923",
    issuer: "Balai Besar Pendidikan Penyegaran Pelayaran",
    issueDate: "2021-08-25",
    expiryDate: "2026-08-25", // Already EXPIRED by 15 days!
    status: "Expired",
    daysUntilExpiry: -15,
    scanFile: "cop_bst_kurniawan.pdf"
  },
  {
    id: "cert-c-105",
    crewId: "crew-103",
    crewName: "Reza Fahlevi",
    vesselId: "v-001",
    type: "COP (Certificate of Proficiency)",
    name: "Advanced Fire Fighting (AFF - STCW VI/3)",
    certificateNo: "COP-AFF-331908",
    issuer: "STIP Jakarta",
    issueDate: "2023-01-10",
    expiryDate: "2028-01-10",
    status: "Active",
    daysUntilExpiry: 488,
    scanFile: "cop_aff_reza.pdf"
  },
  {
    id: "cert-c-106",
    crewId: "crew-202",
    crewName: "Rahmat Santoso",
    vesselId: "v-002",
    type: "Medical Certificate",
    name: "Medical Fitness Certificate for Seafarers",
    certificateNo: "MED-BTM-2025-412",
    issuer: "Klinik Otorita Batam",
    issueDate: "2025-08-20",
    expiryDate: "2026-09-25", // H-16 days
    status: "Due Soon",
    daysUntilExpiry: 16,
    scanFile: "medical_rahmat.pdf"
  }
];

export const INITIAL_SHIP_DOCUMENTS = [
  {
    id: "doc-s-001",
    vesselId: "v-001",
    category: "Statutory Certificate",
    name: "Safety Management Certificate (SMC / ISM Code)",
    documentNo: "SMC-IDN-9821450-21",
    issuer: "Biro Klasifikasi Indonesia (BKI)",
    issueDate: "2021-10-10",
    expiryDate: "2026-10-10", // H-31 days
    status: "Due Soon",
    daysUntilExpiry: 31,
    mandatoryAuditor: "BKI Auditor Jakarta",
    scanFile: "smc_km_nusantara.pdf"
  },
  {
    id: "doc-s-002",
    vesselId: "v-001",
    category: "Classification",
    name: "Certificate of Classification for Hull (Klas Lambung BKI)",
    documentNo: "BKI-HULL-18-0914",
    issuer: "Biro Klasifikasi Indonesia (BKI)",
    issueDate: "2023-09-08",
    expiryDate: "2026-09-08", // EXPIRED yesterday!
    status: "Expired",
    daysUntilExpiry: -1,
    mandatoryAuditor: "BKI Tanjung Priok",
    scanFile: "class_hull_km_nusantara.pdf"
  },
  {
    id: "doc-s-003",
    vesselId: "v-001",
    category: "Statutory Certificate",
    name: "Cargo Ship Safety Equipment Certificate",
    documentNo: "SEC-9821450-2022",
    issuer: "Ditjen Hubla - Syahbandar Tanjung Priok",
    issueDate: "2022-11-12",
    expiryDate: "2026-11-12", // H-64 days
    status: "Due Soon",
    daysUntilExpiry: 64,
    mandatoryAuditor: "Marine Inspector Hubla",
    scanFile: "safety_equip_km_nusantara.pdf"
  },
  {
    id: "doc-s-004",
    vesselId: "v-001",
    category: "Asuransi & P&I",
    name: "P&I Club Certificate of Entry (Protection & Indemnity)",
    documentNo: "PI-GARD-2026-8891",
    issuer: "Gard P&I Club Ltd.",
    issueDate: "2026-02-20",
    expiryDate: "2027-02-20",
    status: "Active",
    daysUntilExpiry: 164,
    mandatoryAuditor: "Gard Jakarta Correspondent",
    scanFile: "pi_cert_entry_2026.pdf"
  },
  {
    id: "doc-s-005",
    vesselId: "v-002",
    category: "Statutory Certificate",
    name: "Surat Ukur Internasional (International Tonnage Certificate)",
    documentNo: "ITC-BTM-9753218",
    issuer: "Kantor Kesyahbandaran Batam",
    issueDate: "2020-03-01",
    expiryDate: "2030-03-01",
    status: "Active",
    daysUntilExpiry: 1269,
    mandatoryAuditor: "Hubla Batam",
    scanFile: "tonnage_tb_baruna.pdf"
  },
  {
    id: "doc-s-006",
    vesselId: "v-003",
    category: "Classification",
    name: "Class Machinery Certificate (Special Survey Docking)",
    documentNo: "NK-MACH-16-1102",
    issuer: "ClassNK (Nippon Kaiji Kyokai)",
    issueDate: "2021-09-01",
    expiryDate: "2026-09-01", // Expired 8 days ago - undergoing docking survey
    status: "Expired",
    daysUntilExpiry: -8,
    mandatoryAuditor: "ClassNK Surabaya Office",
    scanFile: "class_mach_samudera.pdf"
  }
];

export const INITIAL_NOTIFICATION_SETTINGS = {
  thresholds: [
    { days: 90, label: "H-90 (Peringatan Dini / Early Warning)", enabled: true, notifyChannels: ["Email"] },
    { days: 60, label: "H-60 (Persiapan Dokumen / Requisition)", enabled: true, notifyChannels: ["Email", "WhatsApp"] },
    { days: 30, label: "H-30 (Urgensi 1 Bulan)", enabled: true, notifyChannels: ["WhatsApp", "Push Notification"] },
    { days: 14, label: "H-14 (Urgensi Tinggi / Booking Inspector)", enabled: true, notifyChannels: ["WhatsApp", "Push Notification"] },
    { days: 7,  label: "H-7 (Kritis / Eskalasi ke Fleet Manager)", enabled: true, notifyChannels: ["WhatsApp", "Push Notification", "Email"] },
    { days: 1,  label: "H-1 (Hari Terakhir Sebelum Expired)", enabled: true, notifyChannels: ["WhatsApp", "Push Notification"] }
  ],
  whatsappApiProvider: "Wablas / Twilio WhatsApp Business API",
  escalationRules: {
    unacknowledgedDaysThreshold: 3,
    escalateTo: "Fleet Manager & Direktur Operasional"
  }
};

export const INITIAL_NOTIFICATION_LOGS = [
  {
    id: "notif-001",
    timestamp: "2026-09-09 06:00:12",
    channel: "WhatsApp",
    target: "Capt. Hendra Gunawan (+6281288991122)",
    vesselName: "KM Nusantara Express",
    subject: "PERINGATAN KRITIS: Medical Certificate H-5 Kadaluarsa",
    message: "Yth. Capt. Hendra Gunawan, Medical Fitness Certificate Anda (MED-SEA-2025-9912) pada KM Nusantara Express akan kadaluarsa dalam 5 hari (14 September 2026). Mohon segera jadwalkan pemeriksaan perpanjangan untuk mencegah risiko laik laut kapal.",
    status: "Delivered", // Delivered | Pending | Escalated | Failed
    thresholdTriggered: "H-7"
  },
  {
    id: "notif-002",
    timestamp: "2026-09-09 06:00:15",
    channel: "WhatsApp & Push",
    target: "Admin Kapal & Fleet Manager",
    vesselName: "KM Nusantara Express",
    subject: "DOKUMEN EXPIRED: Certificate of Classification Hull (BKI)",
    message: "PERINGATAN: Sertifikat Klas Lambung BKI (BKI-HULL-18-0914) KM Nusantara Express telah melewati tanggal kadaluarsa (08 September 2026). Status: EXPIRED. Kapal berisiko ditahan otoritas pelabuhan!",
    status: "Escalated",
    thresholdTriggered: "H-1 / Expired"
  },
  {
    id: "notif-003",
    timestamp: "2026-09-08 06:00:10",
    channel: "WhatsApp",
    target: "Kurniawan (+6281266554433) & C/E Bambang",
    vesselName: "KM Nusantara Express",
    subject: "WORK ORDER OVERDUE: Servis Kompresor Udara #1",
    message: "Pemberitahuan: Work Order WO-2026-001 (Overhaul Katup Kompresor Udara Sperre HL2) telah melewati running hours target (2510 / 2500 jam). Harap teknisi segera melakukan servicing.",
    status: "Delivered",
    thresholdTriggered: "Overdue"
  },
  {
    id: "notif-004",
    timestamp: "2026-09-07 08:30:00",
    channel: "WhatsApp",
    target: "Fleet Manager (Ir. H. Gunawan)",
    vesselName: "KM Nusantara Express",
    subject: "STOK KRITIS: Valve Plate Sperre & Nozzle Injektor",
    message: "Alert Inventaris: Stok Sparepart Valve Plate Sperre HL2 tersisa 1 Set (Min: 3). Requisition PR-2026-081 telah diajukan dan menunggu approval PO.",
    status: "Delivered",
    thresholdTriggered: "Min Stock Alert"
  }
];

export const INITIAL_USERS = [
  { id: "u-1", name: "Capt. Robert Sitorus", email: "admin@pms-kapal.com", role: "Super Admin", shipAccess: "All" },
  { id: "u-2", name: "Ir. H. Gunawan", email: "fleet.manager@pms-kapal.com", role: "Fleet Manager", shipAccess: "All" },
  { id: "u-3", name: "Capt. Hendra Gunawan", email: "nakhoda.nusantara@pms-kapal.com", role: "Admin Kapal / Nakhoda", shipAccess: "v-001" },
  { id: "u-4", name: "Ir. Bambang Wijaya", email: "ce.nusantara@pms-kapal.com", role: "Teknisi / Chief Engineer", shipAccess: "v-001" },
  { id: "u-5", name: "Suryadi Pratama", email: "abk.nusantara@pms-kapal.com", role: "Crew / ABK", shipAccess: "v-001" },
  { id: "u-6", name: "Siti Rahmawati, S.Psi", email: "hr@pms-kapal.com", role: "HR / Personalia", shipAccess: "All" },
  { id: "u-7", name: "Michael Chandra, SE", email: "finance@pms-kapal.com", role: "Finance", shipAccess: "All" }
];
