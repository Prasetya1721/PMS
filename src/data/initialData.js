// Clean State Data for PT. Pelayaran Baharimas Kalimantan
// Seluruh data dummy telah dikosongkan untuk pengujian input sistem dari awal (clean test)
// Data login pengguna dan pengaturan ambang batas notifikasi tetap dipertahankan.

import { createDefaultShipParticulars } from './shipParticularsData.js';
import { buildComprehensiveFleetDocuments } from './shipCertificatesMaster.js';

// 1. Armada Kapal (Vessels) - Kosong
const RAW_INITIAL_VESSELS = [];

export const INITIAL_VESSELS = RAW_INITIAL_VESSELS.map(v => ({
  ...v,
  particulars: createDefaultShipParticulars(v)
}));

// 2. Peralatan & Mesin (Equipment) - Kosong
export const INITIAL_EQUIPMENT = [];

// 3. Aturan Interval Jadwal PMS - Kosong
export const INITIAL_MAINTENANCE_SCHEDULES = [];

// 4. Perintah Kerja (Work Orders) - Kosong
export const INITIAL_WORK_ORDERS = [];

// 5. Inventaris Suku Cadang & Logistik (Spareparts) - Kosong
export const INITIAL_SPAREPARTS = [];

// 6. Pengajuan Barang & SPBK (Requisitions) - Kosong
export const INITIAL_REQUISITIONS = [];

// 7. Pagu Anggaran Kapal (Vessel Budgets) - Kosong
export const INITIAL_VESSEL_BUDGETS = [];

// 8. Buku Kas & Realisasi Biaya (Costs) - Kosong
export const INITIAL_COSTS = [];

// 9. Personel Awak Kapal (Crew) - Kosong
export const INITIAL_CREW = [];

// 10. Pengajuan Cuti Kru (Leaves) - Kosong
export const INITIAL_LEAVES = [];

// 11. Riwayat Safety Drill (Drills) - Kosong
export const INITIAL_DRILLS = [];

// 12. Sertifikat Awak Kapal STCW (Crew Certificates) - Kosong
export const INITIAL_CREW_CERTIFICATES = [];

// 13. Dokumen & Sertifikat Kapal (Ship Documents) - Kosong
export const RAW_INITIAL_SHIP_DOCUMENTS = [];
export const INITIAL_SHIP_DOCUMENTS = buildComprehensiveFleetDocuments(RAW_INITIAL_SHIP_DOCUMENTS, INITIAL_VESSELS);

// 14. Pengaturan Ambang Batas Notifikasi (Notification Settings) - Dipertahankan
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
        "Email",
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
        "Email",
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
        "Email",
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
        "Email",
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
        "Email",
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
        "Email",
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
      "email": true,
      "googleCalendar": true,
      "browserNotification": true
    },
    "whatsappGateway": {
      "provider": "Wablas API",
      "apiUrl": "https://kalsel.wablas.com/api/send-message",
      "apiKey": "",
      "senderPhone": "081250000000"
    },
    "emailGateway": {
      "provider": "Backend API",
      "apiUrl": "/api/notifications/email",
      "apiKey": "",
      "fromName": "PMS Baharimas",
      "fromEmail": "noreply@baharimas.co.id",
      "replyTo": "fleet.ops@baharimas.co.id",
      "defaultRecipients": ["fleet.ops@baharimas.co.id"]
    },
    "lastRunDate": ""
  },
  "whatsappApiProvider": "Wablas / Twilio WhatsApp Business API",
  "escalationRules": {
    "unacknowledgedDaysThreshold": 3,
    "escalateTo": "Fleet Manager & Direktur Operasional"
  }
};

// 15. Riwayat Log Notifikasi (Notification Logs) - Kosong
export const INITIAL_NOTIFICATION_LOGS = [];

// 16. Akun Login Pengguna (Users) - Dipertahankan untuk Uji Coba Semua Peran (Password Demo: 123)
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
