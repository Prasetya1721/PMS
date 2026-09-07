# Dashboard PMS Kapal (PRD v1.0 — Fase 0 s/d 4 versi runnable lokal)

Tanpa dependensi npm / tanpa Docker / tanpa PostgreSQL — langsung jalan di Node 22+.

## Cara jalan
```powershell
# terminal 1 — API
node "d:\6. Project Cuan\Sistem PMS Kapal\apps\api\server.js"
# terminal 2 — Web
node "d:\6. Project Cuan\Sistem PMS Kapal\apps\web\server.js"
# buka http://localhost:3000
```

## Login demo (password semua: pms-demo)
superadmin, fleet, nakhoda, teknisi, hr, finance

## Cakupan vs PRD
- Fase 1: master kapal+equipment, schedule hours/calendar, WO, sparepart+min-stock, biaya+budget vs actual — OK
- Fase 2: crew, sertifikat+status expired, attendance, cuti, activities, ship documents — OK
- Fase 3: scheduler harian + tombol "Jalankan Reminder", threshold config, log notifikasi (mock WA/push, siap diganti provider Wablas/Qontak/Twilio + FCM) — OK mock
- Fase 4: dashboard fleet sortir urgensi, dashboard kapal, laporan biaya + export CSV — OK (PDF/Excel penuh butuh library, CSV dulu)
- RBAC: filter per kapal untuk admin-kapal/teknisi; super/fleet/hr/finance lihat semua — OK dasar
- Audit trail: tiap login/create/update/delete tercatat di /api/audit-logs — OK

## Batasan asumsi (eksplisit)
1. DB memakai file `apps/api/data.json` (bukan PostgreSQL) agar langsung runnable tanpa install. Skema 1:1 dengan 17 entitas PRD, migrasi ke Postgres+Prisma tinggal ganti layer store.js.
2. Frontend HTML+CSS+JS polos (bukan React+Vite) agar tanpa `npm install`. Struktur halaman 1:1 dengan rancangan React (Fleet, Kapal, Crew, Dok, WO, Biaya, Notifikasi) — siap di-porting.
3. Notifikasi WA/push masih MOCK (status terkirim-mock). Interface sudah abstrak di `runScheduler()` — tinggal sambung provider asli di Fase 3 penuh.
4. Export PDF/Excel diganti CSV dulu (tanpa library). Data sama, format tinggal upgrade.
5. Tanpa Docker (Docker tidak terinstall di mesin ini).
