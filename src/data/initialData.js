// Database Seed Data for PT. Pelayaran Baharimas Kalimantan
// Single Vessel PMS: RP 2020 (As Owner - No. Reg: 24587)
// Comprehensive Maritime Technical Specifications, PMS Schedules, Equipment, Crew, and BKI Surveys

import { createDefaultShipParticulars } from './shipParticularsData.js';
import { buildComprehensiveFleetDocuments } from './shipCertificatesMaster.js';

const RAW_INITIAL_VESSELS = [
  {
    "id": "v-001",
    "name": "RP 2020",
    "regNo": "24587",
    "imo": "24587",
    "callSign": "YDB2458",
    "type": "Tugboat (Kapal Tunda Twin Screw 3200 BHP)",
    "flag": "Indonesia (IDN)",
    "portOfRegistry": "Pontianak, Kalimantan Barat",
    "gt": 310,
    "dwt": 450,
    "yearBuilt": 2020,
    "builder": "PT Dok & Perkapalan Baharimas Pontianak",
    "status": "Operasional (Berlayar)",
    "currentLocation": "Sungai Kapuas / Muara Jungkat (Pontianak)",
    "speedKnots": 7.8,
    "chiefEngineer": "Ir. Bambang Wijaya (KKM)",
    "masterCaptain": "Capt. Hendra Gunawan, M.Mar",
    "photo": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80",
    "ownershipStatus": "As Owner",
    "ownershipCategory": "Owner"
  }
];

export const INITIAL_VESSELS = RAW_INITIAL_VESSELS.map(v => ({
  ...v,
  particulars: createDefaultShipParticulars(v)
}));

export const INITIAL_EQUIPMENT = [
  {
    "id": "eq-101",
    "vesselId": "v-001",
    "code": "ME-01",
    "name": "Main Engine Port (Mesin Induk Kiri)",
    "category": "Propulsi",
    "model": "Yanmar 6EY26W (1600 BHP)",
    "serialNumber": "YN-6EY-24587-P",
    "maker": "Yanmar Co., Ltd.",
    "location": "Engine Room Portside",
    "runningHours": 4200,
    "lastMaintenanceHours": 4000,
    "nextServiceHours": 5000,
    "status": "Normal",
    "criticality": "Tinggi",
    "installedDate": "2020-01-10",
    "subComponents": [
      "Turbocharger",
      "Fuel Injection Pump",
      "Cylinder Liner #1-6",
      "Lube Oil Cooler"
    ]
  },
  {
    "id": "eq-102",
    "vesselId": "v-001",
    "code": "ME-02",
    "name": "Main Engine Starboard (Mesin Induk Kanan)",
    "category": "Propulsi",
    "model": "Yanmar 6EY26W (1600 BHP)",
    "serialNumber": "YN-6EY-24587-S",
    "maker": "Yanmar Co., Ltd.",
    "location": "Engine Room Starboard",
    "runningHours": 4350,
    "lastMaintenanceHours": 4000,
    "nextServiceHours": 5000,
    "status": "Normal",
    "criticality": "Tinggi",
    "installedDate": "2020-01-10",
    "subComponents": [
      "Turbocharger",
      "Fuel Injection Pump",
      "Cylinder Liner #1-6",
      "Lube Oil Cooler"
    ]
  },
  {
    "id": "eq-103",
    "vesselId": "v-001",
    "code": "AE-01",
    "name": "Auxiliary Generator #1 (Genset Kiri)",
    "category": "Kelistrikan",
    "model": "Cummins 6BT5.9 (120 kVA)",
    "serialNumber": "CUM-6BT-24587-1",
    "maker": "Cummins Marine",
    "location": "Engine Room Platform",
    "runningHours": 2480,
    "lastMaintenanceHours": 2000,
    "nextServiceHours": 2500,
    "status": "Due Soon",
    "criticality": "Tinggi",
    "installedDate": "2020-01-15",
    "subComponents": [
      "Alternator",
      "Fuel Injectors",
      "Cooling Radiator / Heat Exchanger"
    ]
  },
  {
    "id": "eq-104",
    "vesselId": "v-001",
    "code": "TW-01",
    "name": "Hydraulic Towing Winch (Bollard Pull 45 Ton)",
    "category": "Deck Machinery",
    "model": "Plimsoll Marine Hydraulic 45T",
    "serialNumber": "PLM-TW-24587",
    "maker": "Plimsoll Marine",
    "location": "Aft Main Deck",
    "runningHours": 1100,
    "lastMaintenanceHours": 1000,
    "nextServiceHours": 1500,
    "status": "Normal",
    "criticality": "Tinggi",
    "installedDate": "2020-02-01",
    "subComponents": [
      "Hydraulic Motor",
      "Spooling Gear",
      "Band Brake"
    ]
  },
  {
    "id": "eq-105",
    "vesselId": "v-001",
    "code": "AC-01",
    "name": "Starting Air Compressor #1",
    "category": "Pneumatik",
    "model": "Sperre HL2/90 (30 bar)",
    "serialNumber": "SP-HL2-24587",
    "maker": "Sperre Air Power",
    "location": "Engine Room Workshop",
    "runningHours": 2100,
    "lastMaintenanceHours": 2000,
    "nextServiceHours": 2500,
    "status": "Normal",
    "criticality": "Tinggi",
    "installedDate": "2020-01-20",
    "subComponents": [
      "Valves LP & HP",
      "Piston Rings",
      "Safety Valve"
    ]
  }
];

export const INITIAL_MAINTENANCE_SCHEDULES = [
  {
    "id": "sch-01",
    "equipmentId": "eq-101",
    "title": "Servis Rutin 500 Jam Mesin Utama",
    "intervalType": "running_hours",
    "intervalHours": 500,
    "intervalDays": null,
    "leadTimeDays": 7,
    "description": "Ganti filter oli pelumas, filter bahan bakar, dan periksa clearance rocker arm.",
    "assignedRole": "Teknisi / Chief Engineer",
    "priority": "Tinggi"
  },
  {
    "id": "sch-02",
    "equipmentId": "eq-105",
    "title": "Pembersihan Katup & Penggantian Filter Kompresor Udara",
    "intervalType": "running_hours",
    "intervalHours": 500,
    "intervalDays": null,
    "leadTimeDays": 5,
    "description": "Bongkar valve plate LP & HP, kuras kondensat tabung angin, ganti oli kompresor sintetik.",
    "assignedRole": "Teknisi / Chief Engineer",
    "priority": "Tinggi"
  },
  {
    "id": "sch-03",
    "equipmentId": "eq-103",
    "title": "Inspeksi Berkala & Penggantian Filter Genset #1",
    "intervalType": "running_hours",
    "intervalHours": 500,
    "intervalDays": null,
    "leadTimeDays": 5,
    "description": "Pemeriksaan sistem pengisian baterai, pembersihan saringan udara, cek putaran governor.",
    "assignedRole": "Teknisi / Chief Engineer",
    "priority": "Tinggi"
  },
  {
    "id": "sch-04",
    "equipmentId": "eq-104",
    "title": "Pelumasan Wire Towing & Greasing Bantalan Winch",
    "intervalType": "calendar",
    "intervalHours": null,
    "intervalDays": 30,
    "leadTimeDays": 5,
    "description": "Inspeksi keausan kawat towing baja 45mm, pelumasan grease marine tahan air laut pada gear drum.",
    "assignedRole": "Bosun (Kepala Kelasi)",
    "priority": "Sedang"
  }
];

export const INITIAL_WORK_ORDERS = [
  {
    "id": "REQ-2026-001",
    "vesselId": "v-001",
    "title": "Permintaan Rutin Sparepart & Oli Kompresor Udara Sperre #1",
    "mainCategory": "Kebutuhan Kapal",
    "category": "Kebutuhan Kapal",
    "subCategory": "Mesin & Sparepart (Engine Parts)",
    "priority": "Tinggi",
    "status": "Diajukan",
    "requestDate": "2026-09-01",
    "dueDate": "2026-09-05",
    "neededDate": "2026-09-05",
    "pic": "Kurniawan (Masinis 2)",
    "picRole": "Masinis 2",
    "assignedTo": "Kurniawan (Masinis 2)",
    "captain": "Capt. Hendra Gunawan, M.Mar",
    "supervisor": "Capt. Hendra Gunawan, M.Mar",
    "deliveryLocation": "Dermaga Pelabuhan Dwikora Pontianak",
    "items": [
      {
        "id": "it-101",
        "name": "Valve Plate Set Sperre HL2",
        "qty": 2,
        "unit": "Set",
        "notes": "Untuk kompresor udara #1",
        "received": true
      },
      {
        "id": "it-102",
        "name": "Oli Kompresor Shell Corena S4 R 68",
        "qty": 10,
        "unit": "Liter",
        "notes": "Penggantian oli pelumas kompresor",
        "received": true
      },
      {
        "id": "it-103",
        "name": "Packing Gasket Set Sperre HL2",
        "qty": 2,
        "unit": "Set",
        "notes": "Penggantian rutin valve plate",
        "received": false
      },
      {
        "id": "it-104",
        "name": "Majun Putih Super Bersih",
        "qty": 5,
        "unit": "Kg",
        "notes": "Pembersihan ruang mesin & komponen",
        "received": false
      }
    ],
    "notes": "Sudah lewat jam operasional servis, mohon disiapkan sebelum towing trip ke Banjarmasin."
  },
  {
    "id": "REQ-2026-002",
    "vesselId": "v-001",
    "title": "Permintaan Filter & Oli Servis Berkala Genset Cummins #1",
    "mainCategory": "Kebutuhan Kapal",
    "category": "Kebutuhan Kapal",
    "subCategory": "Minyak Pelumas & Oli (Lubricants)",
    "priority": "Tinggi",
    "status": "Disetujui Gudang",
    "requestDate": "2026-09-08",
    "dueDate": "2026-09-12",
    "neededDate": "2026-09-12",
    "pic": "Asep Sunandar (Masinis 3)",
    "picRole": "Masinis 3",
    "assignedTo": "Asep Sunandar (Masinis 3)",
    "captain": "Capt. Hendra Gunawan, M.Mar",
    "supervisor": "Capt. Hendra Gunawan, M.Mar",
    "deliveryLocation": "Muara Berau Anchorage",
    "items": [
      {
        "id": "it-201",
        "name": "Filter Oli Fleetguard LF9009 Cummins",
        "qty": 4,
        "unit": "Pcs",
        "notes": "Servis berkala genset #1 & #2",
        "received": true
      },
      {
        "id": "it-202",
        "name": "Filter Solar Fuel Separator FS1000",
        "qty": 4,
        "unit": "Pcs",
        "notes": "Water separator bahan bakar",
        "received": true
      },
      {
        "id": "it-203",
        "name": "Oli Mesin Meditran S-40 (200L)",
        "qty": 1,
        "unit": "Drum",
        "notes": "Stok pelumas genset kapal",
        "received": false
      },
      {
        "id": "it-204",
        "name": "V-Belt Alternator Cummins Heavy Duty",
        "qty": 2,
        "unit": "Pcs",
        "notes": "Cadangan darurat kamar mesin",
        "received": false
      }
    ],
    "notes": "Filter oli sudah siap di gudang, menunggu pengiriman drum oli pelumas ke dermaga."
  },
  {
    "id": "REQ-2026-004",
    "vesselId": "v-001",
    "title": "Pengajuan Ransum Logistik Dapur & APD Crew Baru",
    "mainCategory": "Kebutuhan Crew",
    "category": "Kebutuhan Crew",
    "subCategory": "Bahan Makanan Basah & Kering (Galley / Ransum)",
    "priority": "Penting (Segera)",
    "status": "Disetujui Nakhoda",
    "requestDate": "2026-09-12",
    "dueDate": "2026-09-18",
    "neededDate": "2026-09-18",
    "pic": "Dedi Mulyadi (Juru Masak / Cook)",
    "picRole": "Juru Masak (Cook)",
    "assignedTo": "Dedi Mulyadi (Juru Masak / Cook)",
    "captain": "Capt. Hendra Gunawan, M.Mar",
    "supervisor": "Capt. Hendra Gunawan, M.Mar",
    "deliveryLocation": "Dermaga Pelabuhan Dwikora Pontianak",
    "items": [
      {
        "id": "it-401",
        "name": "Beras Premium Ramos 25 Kg",
        "qty": 4,
        "unit": "Zak",
        "notes": "Ransum pokok galley pelayaran 25 hari",
        "received": true
      },
      {
        "id": "it-402",
        "name": "Minyak Goreng Kemasan 2 Liter",
        "qty": 2,
        "unit": "Dus",
        "notes": "Bahan dapur masak awak",
        "received": true
      },
      {
        "id": "it-403",
        "name": "Telur Ayam Boiler Segar (30 Butir)",
        "qty": 6,
        "unit": "Piring",
        "notes": "Konsumsi ransum harian kru",
        "received": false
      },
      {
        "id": "it-404",
        "name": "Air Minum Galon Aqua 19 Liter",
        "qty": 20,
        "unit": "Galon",
        "notes": "Air minum dispenser awak kapal",
        "received": false
      },
      {
        "id": "it-405",
        "name": "Wearpack Pelaut Katun Logo Baharimas",
        "qty": 4,
        "unit": "Stel",
        "notes": "APD kru ABK baru naik kapal",
        "received": false
      },
      {
        "id": "it-406",
        "name": "Safety Shoes Pelaut Ujung Besi SNI",
        "qty": 2,
        "unit": "Pasang",
        "notes": "Sepatu keselamatan kerja deck & mesin",
        "received": false
      }
    ],
    "notes": "Ransum konsumsi pelayaran towing Muara Berau - Surabaya dan APD kru baru join."
  }
];

export const INITIAL_SPAREPARTS = [
  {
    "id": "sp-101",
    "code": "SP-SPR-VP01",
    "name": "Valve Plate Set Sperre HL2/90",
    "equipmentCode": "AC-01",
    "vesselId": "v-001",
    "category": "Valve & Mechanical",
    "stockQty": 1,
    "minStockQty": 3,
    "unit": "Set",
    "location": "Engine Store Rack B-01",
    "unitCost": 900000,
    "supplier": "Sperre Asia Maritime",
    "status": "Critical"
  },
  {
    "id": "sp-102",
    "code": "SP-OIL-COR68",
    "name": "Oli Kompresor Shell Corena S4 R 68",
    "equipmentCode": "AC-01",
    "vesselId": "v-001",
    "category": "Pelumas / Oil",
    "stockQty": 35,
    "minStockQty": 20,
    "unit": "Liter",
    "location": "Drum Store Aft Deck",
    "unitCost": 120000,
    "supplier": "PT Shell Indonesia Maritime",
    "status": "Normal"
  },
  {
    "id": "sp-103",
    "code": "SP-CUM-FL01",
    "name": "Filter Oli Fleetguard LF9009 Cummins",
    "equipmentCode": "AE-01",
    "vesselId": "v-001",
    "category": "Filter",
    "stockQty": 3,
    "minStockQty": 6,
    "unit": "Pcs",
    "location": "Rack A-02 Engine Store",
    "unitCost": 700000,
    "supplier": "PT Cummins Marine Indonesia",
    "status": "Low Stock"
  }
];

export const INITIAL_REQUISITIONS = [
  {
    "id": "PR-2026-081",
    "vesselId": "v-001",
    "requesterName": "Ir. Bambang Wijaya (KKM)",
    "dateSubmitted": "2026-09-06",
    "urgency": "Urgent",
    "status": "Approved Fleet",
    "totalEstimatedCost": 6900000,
    "items": [
      {
        "partId": "sp-101",
        "name": "Valve Plate Set Sperre HL2/90",
        "qty": 3,
        "estimatedUnitCost": 900000
      },
      {
        "partId": "sp-103",
        "name": "Filter Oli Fleetguard LF9009 Cummins",
        "qty": 6,
        "estimatedUnitCost": 700000
      }
    ],
    "notes": "Stok valve plate dan filter genset sudah di bawah batas minimum kapal RP 2020."
  }
];

export const INITIAL_COSTS = [
  {
    "id": "cost-01",
    "vesselId": "v-001",
    "period": "2026-08",
    "category": "Sparepart Mesin",
    "description": "Pengadaan Filter & Lube Oil Yanmar & Cummins",
    "amount": 12500000,
    "budgetAllocated": 18000000,
    "date": "2026-08-15",
    "vendor": "PT Yanmar Marine Indo"
  },
  {
    "id": "cost-02",
    "vesselId": "v-001",
    "period": "2026-08",
    "category": "Jasa Servis & Kalibrasi",
    "description": "Kalibrasi Injektor Mesin Utama di Workshop Darat",
    "amount": 5800000,
    "budgetAllocated": 7000000,
    "date": "2026-08-22",
    "vendor": "CV Pontianak Presisi Diesel"
  }
];

export const INITIAL_CREW = [
  {
    "id": "crew-101",
    "vesselId": "v-001",
    "name": "Capt. Hendra Gunawan",
    "rank": "Nakhoda (Master)",
    "department": "Deck",
    "seamanBookNo": "B-853063-ID",
    "phone": "081219975265",
    "whatsapp": "+6281219975265",
    "status": "Onboard",
    "signOnDate": "2026-02-15",
    "signOffPlanDate": "2026-10-30",
    "contractDurationMonths": 8,
    "leaveBalanceDays": 12,
    "photo": "https://images.unsplash.com/photo-1500001371479?auto=format&fit=crop&w=400&q=80"
  },
  {
    "id": "crew-102",
    "vesselId": "v-001",
    "name": "Ir. Bambang Wijaya",
    "rank": "Chief Engineer (KKM)",
    "department": "Engine",
    "seamanBookNo": "B-940717-ID",
    "phone": "081220074030",
    "whatsapp": "+6281220074030",
    "status": "Onboard",
    "signOnDate": "2026-02-15",
    "signOffPlanDate": "2026-10-30",
    "contractDurationMonths": 8,
    "leaveBalanceDays": 13,
    "photo": "https://images.unsplash.com/photo-1500001385058?auto=format&fit=crop&w=400&q=80"
  },
  {
    "id": "crew-103",
    "vesselId": "v-001",
    "name": "Lukman Kusuma",
    "rank": "Chief Officer (Mualim 1)",
    "department": "Deck",
    "seamanBookNo": "B-128372-ID",
    "phone": "081220172795",
    "whatsapp": "+6281220172795",
    "status": "Onboard",
    "signOnDate": "2026-02-15",
    "signOffPlanDate": "2026-10-30",
    "contractDurationMonths": 8,
    "leaveBalanceDays": 14,
    "photo": "https://images.unsplash.com/photo-1500001398637?auto=format&fit=crop&w=400&q=80"
  },
  {
    "id": "crew-104",
    "vesselId": "v-001",
    "name": "Mulyadi Supriyanto",
    "rank": "Second Engineer (Masinis 2)",
    "department": "Engine",
    "seamanBookNo": "B-216026-ID",
    "phone": "081220271560",
    "whatsapp": "+6281220271560",
    "status": "Onboard",
    "signOnDate": "2026-02-15",
    "signOffPlanDate": "2026-10-30",
    "contractDurationMonths": 8,
    "leaveBalanceDays": 15,
    "photo": "https://images.unsplash.com/photo-1500001412216?auto=format&fit=crop&w=400&q=80"
  },
  {
    "id": "crew-105",
    "vesselId": "v-001",
    "name": "Nurhadi Hidayat",
    "rank": "Bosun (Kepala Kelasi)",
    "department": "Deck",
    "seamanBookNo": "B-303680-ID",
    "phone": "081220370325",
    "whatsapp": "+6281220370325",
    "status": "Onboard",
    "signOnDate": "2026-02-15",
    "signOffPlanDate": "2026-10-30",
    "contractDurationMonths": 8,
    "leaveBalanceDays": 16,
    "photo": "https://images.unsplash.com/photo-1500001425795?auto=format&fit=crop&w=400&q=80"
  },
  {
    "id": "crew-106",
    "vesselId": "v-001",
    "name": "Oki Setiawan",
    "rank": "Juru Mudi / ABK",
    "department": "Deck",
    "seamanBookNo": "B-391334-ID",
    "phone": "081220469090",
    "whatsapp": "+6281220469090",
    "status": "Onboard",
    "signOnDate": "2026-02-15",
    "signOffPlanDate": "2026-10-30",
    "contractDurationMonths": 8,
    "leaveBalanceDays": 12,
    "photo": "https://images.unsplash.com/photo-1500001439374?auto=format&fit=crop&w=400&q=80"
  },
  {
    "id": "crew-107",
    "vesselId": "v-001",
    "name": "Prasetyo Wijaya",
    "rank": "Oiler (Juru Minyak)",
    "department": "Engine",
    "seamanBookNo": "B-478988-ID",
    "phone": "081220567855",
    "whatsapp": "+6281220567855",
    "status": "Onboard",
    "signOnDate": "2026-02-15",
    "signOffPlanDate": "2026-10-30",
    "contractDurationMonths": 8,
    "leaveBalanceDays": 13,
    "photo": "https://images.unsplash.com/photo-1500001452953?auto=format&fit=crop&w=400&q=80"
  }
];

export const INITIAL_LEAVES = [
  {
    "id": "leave-001",
    "crewId": "crew-105",
    "crewName": "Kurniawan (Masinis 2)",
    "vesselId": "v-001",
    "leaveType": "Cuti Tahunan",
    "startDate": "2026-09-18",
    "endDate": "2026-10-02",
    "daysRequested": 14,
    "status": "Approved Fleet",
    "appliedDate": "2026-09-02",
    "replacementCrew": "Standby Pool Pontianak",
    "notes": "Keperluan keluarga di Surabaya, sign off di Muara Berau."
  },
  {
    "id": "leave-002",
    "crewId": "crew-106",
    "crewName": "Asep Sunandar (Masinis 3)",
    "vesselId": "v-001",
    "leaveType": "Cuti Alasan Penting",
    "startDate": "2026-10-05",
    "endDate": "2026-10-15",
    "daysRequested": 10,
    "status": "Pending Ship Admin",
    "appliedDate": "2026-09-07",
    "replacementCrew": "Belum ditunjuk",
    "notes": "Pengajuan izin cuti."
  }
];

export const INITIAL_DRILLS = [
  {
    "id": "drill-01",
    "vesselId": "v-001",
    "drillType": "Fire Drill & Emergency Steering (Latihan Pemadam Kebakaran)",
    "conductedDate": "2026-08-28",
    "location": "Main Deck & Steering Gear Room RP 2020",
    "durationMinutes": 45,
    "leadOfficer": "Capt. Hendra Gunawan",
    "attendeesCount": 7,
    "performanceRating": "Memuaskan",
    "scenarioSummary": "Simulasi kebakaran di engine room workshop deck 2. Regu pemadam menggelar selang dalam 2 menit 10 detik, fire pump hidup seketika.",
    "correctiveAction": "Lakukan penggantian packing nozzle hydrant portside."
  },
  {
    "id": "drill-02",
    "vesselId": "v-001",
    "drillType": "Abandon Ship Drill (Latihan Tinggalkan Kapal)",
    "conductedDate": "2026-08-14",
    "location": "Lifeboat & Inflatable Liferaft Station RP 2020",
    "durationMinutes": 40,
    "leadOfficer": "Chief Officer M. Nur",
    "attendeesCount": 7,
    "performanceRating": "Sangat Baik",
    "scenarioSummary": "Kru berkumpul di muster station lengkap dengan lifejacket dan survival suit dalam 3 menit.",
    "correctiveAction": "Pelumasan davit wire liferaft."
  }
];

export const INITIAL_CREW_CERTIFICATES = [
  {
    "id": "cert-c-101",
    "crewId": "crew-101",
    "crewName": "Capt. Hendra Gunawan",
    "vesselId": "v-001",
    "type": "COC (Certificate of Competency)",
    "name": "Ahli Nautika Tingkat II / ANT II",
    "certificateNo": "STCW-853063-ID",
    "issuer": "Ditjen Perhubungan Laut Kemenhub RI",
    "issueDate": "2022-04-10",
    "expiryDate": "2027-06-15",
    "status": "Active",
    "daysUntilExpiry": 279,
    "scanFile": "stcw_capt__hendra_gunawan.pdf"
  },
  {
    "id": "cert-c-102",
    "crewId": "crew-102",
    "crewName": "Ir. Bambang Wijaya",
    "vesselId": "v-001",
    "type": "COP (Certificate of Proficiency)",
    "name": "Ahli Teknika Tingkat II / ATT II",
    "certificateNo": "STCW-940717-ID",
    "issuer": "Ditjen Perhubungan Laut Kemenhub RI",
    "issueDate": "2022-04-10",
    "expiryDate": "2027-06-15",
    "status": "Active",
    "daysUntilExpiry": 279,
    "scanFile": "stcw_ir__bambang_wijaya.pdf"
  },
  {
    "id": "cert-c-103",
    "crewId": "crew-103",
    "crewName": "Lukman Kusuma",
    "vesselId": "v-001",
    "type": "COC (Certificate of Competency)",
    "name": "Ahli Nautika Tingkat III / ANT III",
    "certificateNo": "STCW-128372-ID",
    "issuer": "Ditjen Perhubungan Laut Kemenhub RI",
    "issueDate": "2022-04-10",
    "expiryDate": "2027-06-15",
    "status": "Active",
    "daysUntilExpiry": 279,
    "scanFile": "stcw_lukman_kusuma.pdf"
  },
  {
    "id": "cert-c-104",
    "crewId": "crew-104",
    "crewName": "Mulyadi Supriyanto",
    "vesselId": "v-001",
    "type": "COP (Certificate of Proficiency)",
    "name": "Ahli Teknika Tingkat III / ATT III",
    "certificateNo": "STCW-216026-ID",
    "issuer": "Ditjen Perhubungan Laut Kemenhub RI",
    "issueDate": "2022-04-10",
    "expiryDate": "2026-09-25",
    "status": "Due Soon",
    "daysUntilExpiry": 16,
    "scanFile": "stcw_mulyadi_supriyanto.pdf"
  },
  {
    "id": "cert-c-105",
    "crewId": "crew-105",
    "crewName": "Nurhadi Hidayat",
    "vesselId": "v-001",
    "type": "COC (Certificate of Competency)",
    "name": "Basic Safety Training (BST)",
    "certificateNo": "STCW-303680-ID",
    "issuer": "Ditjen Perhubungan Laut Kemenhub RI",
    "issueDate": "2022-04-10",
    "expiryDate": "2026-08-30",
    "status": "Expired",
    "daysUntilExpiry": -10,
    "scanFile": "stcw_nurhadi_hidayat.pdf"
  },
  {
    "id": "cert-c-106",
    "crewId": "crew-106",
    "crewName": "Oki Setiawan",
    "vesselId": "v-001",
    "type": "COC (Certificate of Competency)",
    "name": "Able Seafarer Deck (STCW II/5)",
    "certificateNo": "STCW-391334-ID",
    "issuer": "Ditjen Perhubungan Laut Kemenhub RI",
    "issueDate": "2022-04-10",
    "expiryDate": "2027-06-15",
    "status": "Active",
    "daysUntilExpiry": 279,
    "scanFile": "stcw_oki_setiawan.pdf"
  },
  {
    "id": "cert-c-107",
    "crewId": "crew-107",
    "crewName": "Prasetyo Wijaya",
    "vesselId": "v-001",
    "type": "COP (Certificate of Proficiency)",
    "name": "Able Seafarer Engine (STCW III/5)",
    "certificateNo": "STCW-478988-ID",
    "issuer": "Ditjen Perhubungan Laut Kemenhub RI",
    "issueDate": "2022-04-10",
    "expiryDate": "2027-06-15",
    "status": "Active",
    "daysUntilExpiry": 279,
    "scanFile": "stcw_prasetyo_wijaya.pdf"
  }
];

const RAW_INITIAL_SHIP_DOCUMENTS = [
  {
    "id": "doc-s-001",
    "vesselId": "v-001",
    "category": "Classification",
    "name": "Special Survey",
    "documentNo": "BKI-24587-SPECIALS",
    "issuer": "Biro Klasifikasi Indonesia (BKI) / Ditjen Hubla",
    "issueDate": "2025-04-14",
    "expiryDate": "2030-04-14",
    "status": "Active",
    "daysUntilExpiry": 1313,
    "mandatoryAuditor": "Surveyor BKI Cabang Pontianak",
    "scanFile": "bki_rp_2020_special_survey.pdf",
    "rawNote": "14 Apr 2030"
  },
  {
    "id": "doc-s-002",
    "vesselId": "v-001",
    "category": "Classification",
    "name": "Annual Survey",
    "documentNo": "BKI-24587-ANNUALSU",
    "issuer": "Biro Klasifikasi Indonesia (BKI) / Ditjen Hubla",
    "issueDate": "2026-07-14",
    "expiryDate": "2027-07-14",
    "status": "Active",
    "daysUntilExpiry": 308,
    "mandatoryAuditor": "Surveyor BKI Cabang Pontianak",
    "scanFile": "bki_rp_2020_annual_survey.pdf",
    "rawNote": "14 Jul 2027"
  },
  {
    "id": "doc-s-003",
    "vesselId": "v-001",
    "category": "Classification",
    "name": "Docking Survey",
    "documentNo": "BKI-24587-DOCKINGS",
    "issuer": "Biro Klasifikasi Indonesia (BKI) / Ditjen Hubla",
    "issueDate": "2027-03-13",
    "expiryDate": "2028-03-13",
    "status": "Active",
    "daysUntilExpiry": 550,
    "mandatoryAuditor": "Surveyor BKI Cabang Pontianak",
    "scanFile": "bki_rp_2020_docking_survey.pdf",
    "rawNote": "13 Mar 2028 / 14 Jul 2028"
  },
  {
    "id": "doc-s-004",
    "vesselId": "v-001",
    "category": "Classification",
    "name": "Intermediate Survey",
    "documentNo": "BKI-24587-INTERMED",
    "issuer": "Biro Klasifikasi Indonesia (BKI) / Ditjen Hubla",
    "issueDate": "2025-03-13",
    "expiryDate": "2030-03-13",
    "status": "Active",
    "daysUntilExpiry": 1281,
    "mandatoryAuditor": "Surveyor BKI Cabang Pontianak",
    "scanFile": "bki_rp_2020_intermediate_survey.pdf",
    "rawNote": "13 Mar 2030"
  },
  {
    "id": "doc-s-005",
    "vesselId": "v-001",
    "category": "Classification",
    "name": "Propeller Shaft (starboard-aft), Method 4",
    "documentNo": "BKI-24587-PROPELLER",
    "issuer": "Biro Klasifikasi Indonesia (BKI) / Ditjen Hubla",
    "issueDate": "2025-03-13",
    "expiryDate": "2030-03-13",
    "status": "Active",
    "daysUntilExpiry": 1281,
    "mandatoryAuditor": "Surveyor BKI Cabang Pontianak",
    "scanFile": "bki_rp_2020_propeller_shaft_(starboard-aft),_method_4.pdf",
    "rawNote": "13 Mar 2030"
  },
  {
    "id": "doc-s-006",
    "vesselId": "v-001",
    "category": "Classification",
    "name": "Propeller Shaft (portside-aft), Method 4",
    "documentNo": "BKI-24587-PROPELLER-P",
    "issuer": "Biro Klasifikasi Indonesia (BKI) / Ditjen Hubla",
    "issueDate": "2026-07-14",
    "expiryDate": "2027-07-14",
    "status": "Active",
    "daysUntilExpiry": 308,
    "mandatoryAuditor": "Surveyor BKI Cabang Pontianak",
    "scanFile": "bki_rp_2020_propeller_shaft_(portside-aft),_method_4.pdf",
    "rawNote": "14 Jul 2027"
  },
  {
    "id": "doc-s-007",
    "vesselId": "v-001",
    "category": "Statutory",
    "name": "LOAD LINE ANNUAL",
    "documentNo": "BKI-24587-LOADLINEA",
    "issuer": "Biro Klasifikasi Indonesia (BKI) / Ditjen Hubla",
    "issueDate": "2025-04-14",
    "expiryDate": "2030-04-14",
    "status": "Active",
    "daysUntilExpiry": 1313,
    "mandatoryAuditor": "Surveyor BKI Cabang Pontianak",
    "scanFile": "bki_rp_2020_load_line_annual.pdf",
    "rawNote": "14 Apr 2030"
  },
  {
    "id": "doc-s-008",
    "vesselId": "v-001",
    "category": "Statutory",
    "name": "LOAD LINE RENEWAL (PM 39)",
    "documentNo": "BKI-24587-LOADLINER",
    "issuer": "Biro Klasifikasi Indonesia (BKI) / Ditjen Hubla",
    "issueDate": "2025-04-14",
    "expiryDate": "2030-04-14",
    "status": "Active",
    "daysUntilExpiry": 1313,
    "mandatoryAuditor": "Surveyor BKI Cabang Pontianak",
    "scanFile": "bki_rp_2020_load_line_renewal_(pm_39).pdf",
    "rawNote": "(Tercantum pada daftar)"
  }
];

export const INITIAL_SHIP_DOCUMENTS = buildComprehensiveFleetDocuments(RAW_INITIAL_SHIP_DOCUMENTS, INITIAL_VESSELS);

export const INITIAL_NOTIFICATION_SETTINGS = {
  "thresholds": [
    {
      "id": "th-1d",
      "days": 1,
      "unit": "day",
      "label": "1 Hari Sebelum (H-1)",
      "description": "Peringatan darurat batas akhir sebelum dokumen kadaluarsa",
      "enabled": true,
      "notifyChannels": [
        "WhatsApp",
        "Google Calendar"
      ]
    },
    {
      "id": "th-1w",
      "days": 7,
      "unit": "week",
      "label": "1 Minggu Sebelum (H-7)",
      "description": "Peringatan kritis 7 hari untuk inspeksi teknis & finalisasi survey",
      "enabled": true,
      "notifyChannels": [
        "WhatsApp",
        "Google Calendar"
      ]
    },
    {
      "id": "th-1m",
      "days": 30,
      "unit": "month",
      "label": "1 Bulan Sebelum (H-30)",
      "description": "Urgensi 30 hari untuk pendaftaran survey BKI & Syahbandar",
      "enabled": true,
      "notifyChannels": [
        "WhatsApp",
        "Google Calendar"
      ]
    },
    {
      "id": "th-1y",
      "days": 365,
      "unit": "year",
      "label": "1 Tahun Sebelum (H-365)",
      "description": "Perencanaan dini anggaran tahunan survey besar (Special Survey / Docking)",
      "enabled": true,
      "notifyChannels": [
        "WhatsApp",
        "Google Calendar"
      ]
    }
  ],
  "customThresholds": [
    {
      "id": "th-custom-14",
      "days": 14,
      "unit": "custom",
      "label": "H-14 Hari (Kustom)",
      "description": "Pemberitahuan dua minggu sebelum jatuh tempo",
      "enabled": true,
      "notifyChannels": [
        "WhatsApp",
        "Google Calendar"
      ]
    },
    {
      "id": "th-custom-90",
      "days": 90,
      "unit": "custom",
      "label": "H-90 Hari (Kustom)",
      "description": "Peringatan dini 3 bulan kuartalan",
      "enabled": true,
      "notifyChannels": [
        "WhatsApp",
        "Google Calendar"
      ]
    }
  ],
  "autoSend": {
    "enabled": true,
    "scheduleTime": "08:00",
    "frequency": "daily",
    "channels": {
      "whatsapp": true,
      "googleCalendar": true,
      "browserNotification": true
    },
    "whatsappGateway": {
      "provider": "Wablas API",
      "apiUrl": "https://kalsel.wablas.com/api/send-message",
      "apiKey": "",
      "senderPhone": "081250000000"
    },
    "lastRunDate": ""
  },
  "whatsappApiProvider": "Wablas / Twilio WhatsApp Business API",
  "escalationRules": {
    "unacknowledgedDaysThreshold": 3,
    "escalateTo": "Fleet Manager & Direktur Operasional"
  }
};

export const INITIAL_NOTIFICATION_LOGS = [
  {
    "id": "notif-001",
    "timestamp": "2026-09-09 06:00:12",
    "channel": "WhatsApp",
    "target": "Capt. Agus Supriyadi (+6281299881100)",
    "vesselName": "RP 2026",
    "subject": "PERINGATAN KRITIS: Annual Survey BKI Expired 6 Hari Lalu",
    "message": "Yth. Capt. Agus Supriyadi, Annual Survey BKI pada kapal RP 2026 telah jatuh tempo pada 03 September 2026. Status: EXPIRED. Mohon segera koordinasikan inspeksi surveyor BKI.",
    "status": "Delivered",
    "thresholdTriggered": "H-1 / Expired"
  },
  {
    "id": "notif-002",
    "timestamp": "2026-09-09 06:00:15",
    "channel": "WhatsApp & Push",
    "target": "Fleet Manager & Nakhoda KP. PARIT TOKAYA",
    "vesselName": "KP. PARIT TOKAYA",
    "subject": "DOKUMEN EXPIRED: Seluruh Survei Kelas BKI Lewat Masa Berlaku",
    "message": "PERINGATAN: Sertifikat Special Survey, Annual Survey, dan Load Line KP. PARIT TOKAYA tercatat telah kadaluarsa. Kapal sedang dalam status docking galangan Pontianak.",
    "status": "Escalated",
    "thresholdTriggered": "Overdue Docking"
  },
  {
    "id": "notif-003",
    "timestamp": "2026-09-08 06:00:10",
    "channel": "WhatsApp",
    "target": "Kurniawan (+6281266554433) & C/E Bambang",
    "vesselName": "RP 2020",
    "subject": "WORK ORDER OVERDUE: Servis Kompresor Udara Sperre #1",
    "message": "Pemberitahuan: Work Order WO-2026-001 (Overhaul Katup Kompresor Udara Sperre HL2) pada RP 2020 telah melewati batas running hours target (2510 / 2500 jam). Harap segera servicing.",
    "status": "Delivered",
    "thresholdTriggered": "Overdue"
  }
];

export const INITIAL_USERS = [
  {
    "id": "u-1",
    "name": "Capt. Robert Sitorus, M.Mar",
    "email": "admin@baharimas.co.id",
    "password": "123",
    "role": "Super Admin",
    "title": "Head of Fleet Operations",
    "shipAccess": "All",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
  },
  {
    "id": "u-2",
    "name": "Ir. H. Gunawan, M.T",
    "email": "fleet.ops@baharimas.co.id",
    "password": "123",
    "role": "Fleet Manager",
    "title": "General Manager Armada Kalimantan",
    "shipAccess": "All",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
  },
  {
    "id": "u-3",
    "name": "Capt. Hendra Gunawan, M.Mar",
    "email": "nakhoda@baharimas.co.id",
    "password": "123",
    "role": "Admin Kapal / Nakhoda",
    "title": "Nakhoda RP 2020",
    "shipAccess": "v-001",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
  },
  {
    "id": "u-4",
    "name": "Ir. Bambang Wijaya (KKM)",
    "email": "kkm@baharimas.co.id",
    "password": "123",
    "role": "Teknisi / Chief Engineer",
    "title": "Chief Engineer (KKM) RP 2020",
    "shipAccess": "v-001",
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80"
  },
  {
    "id": "u-5",
    "name": "Suryadi Pratama",
    "email": "abk@baharimas.co.id",
    "password": "123",
    "role": "Crew / ABK",
    "title": "Juru Mudi / ABK RP 2020",
    "shipAccess": "v-001",
    "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80"
  },
  {
    "id": "u-6",
    "name": "Siti Rahmawati, S.Psi",
    "email": "hr@baharimas.co.id",
    "password": "123",
    "role": "HR / Personalia",
    "title": "Crewing & STCW Compliance",
    "shipAccess": "All",
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
  },
  {
    "id": "u-7",
    "name": "Michael Chandra, SE",
    "email": "finance@baharimas.co.id",
    "password": "123",
    "role": "Finance",
    "title": "Finance & Logistics Purchasing",
    "shipAccess": "All",
    "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80"
  }
];
