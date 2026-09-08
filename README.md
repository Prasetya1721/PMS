# Dashboard PMS Kapal (PRD v1.1 — runnable lokal, tervalidasi live)

Tanpa dependensi npm / tanpa Docker / tanpa PostgreSQL — langsung jalan di Node 22+.

## Cara jalan (1 klik)
Klik 2x `jalan.bat`, atau manual:
```powershell
node "d:\6. Project Cuan\Sistem PMS Kapal\apps\api\server.js"
node "d:\6. Project Cuan\Sistem PMS Kapal\apps\web\server.js"
# buka http://localhost:3000
```

## Login demo (password semua: pms-demo)
superadmin, fleet, nakhoda, teknisi, hr, finance

## Cakupan vs PRD — SEMUA OK (tervalidasi live)
- Fase 1: master kapal+equipment, schedule hours/calendar, WO, sparepart+min-stock, biaya+budget vs actual
- Fase 2: crew, sertifikat+status expired, attendance, cuti + approval berjenjang (tombol Setujui/Tolak), activities, ship documents
- Fase 3: scheduler threshold H-90/60/30/14/7/1 (editable di UI) + dedup 24 jam + eskalasi otomatis ke fleet-manager + log + setting provider WA/push (mock/wablas/qontak/twilio, mock/onesignal/fcm)
- Fase 4: dashboard fleet sortir urgensi, dashboard kapal, laporan biaya + export CSV, grafik budget vs actual sederhana
- Kelola Data: tambah WO/biaya/sparepart/surat langsung dari web + pakai sparepart (stok otomatis berkurang) + tutup WO + upload scan sertifikat/surat (maks ~2MB) + backup JSON sekali klik
- RBAC: filter per kapal untuk admin-kapal/teknisi; super/fleet/hr/finance lihat semua — PLUS proteksi tulis: POST/PUT/DELETE ditolak 403 bila role tidak berhak (mis. teknisi→biaya, crew→upload, non-superadmin→users)
- Audit trail: halaman Audit Log di web + GET /api/audit-logs
- KPI §14: halaman KPI di web + GET /api/reports/kpi (kepatuhan maintenance target ≥95%, expired tanpa notif target 0)
- Pengaturan: manajemen user khusus super-admin (CRUD) + import CSV kapal/crew + template import: docs/template-kapal.csv, docs/template-crew.csv (mitigasi risiko §16)

## Batasan asumsi (eksplisit)
1. DB memakai file `apps/api/data.json` (bukan PostgreSQL) agar langsung runnable tanpa install. Skema 1:1 dengan 17 entitas PRD, migrasi ke Postgres+Prisma tinggal ganti layer store.js.
2. Frontend HTML+CSS+JS polos (bukan React+Vite) agar tanpa `npm install`. Struktur halaman 1:1 dengan rancangan React (Fleet, Kapal, Crew, Dok, WO, Biaya, Notifikasi) — siap di-porting.
3. Notifikasi WA/push masih MOCK (status terkirim-mock). Interface sudah abstrak di `runScheduler()` — tinggal sambung provider asli di Fase 3 penuh.
4. Export PDF/Excel diganti CSV dulu (tanpa library). Data sama, format tinggal upgrade.
5. Tanpa Docker (Docker tidak terinstall di mesin ini).
