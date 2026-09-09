# Dashboard Sistem PMS (Planned Maintenance System) Kapal Enterprise

Sistem terpusat berbasis web untuk manajemen armada kapal niaga, perawatan mesin & suku cadang (*Planned Maintenance System*), kepatuhan dokumen legal kapal (*Statutory Certificates*), sertifikasi awak kapal (*STCW Crew Certificates*), dan bot notifikasi proaktif (*WhatsApp Reminder*).

Aplikasi ini dibangun ulang dari awal sesuai spesifikasi komprehensif pada [prd.md](prd.md).

---

## Fitur Utama Sesuai PRD

1. **Dashboard Fleet & Multi-Kapal**:
   - Tampilan agregat armada (*Fleet Overview*) dan dashboard spesifik per kapal (*KM Nusantara Express*, *TB Baruna Perkasa*, *KM Samudera Sejahtera*).
   - Indikator KPI Kepatuhan Maintenance (Compliance Score), radar masa berlaku dokumen, dan pelacak running hours.

2. **Master Equipment & Running Hours (Jam Kerja Mesin)**:
   - Pelacakan jam operasi mesin utama, generator/aux engine, kompresor, pompa ballast, crane, dan radar.
   - Ambang batas servis otomatis: *Normal*, *Due Soon* (mendekati servis), dan *Overdue* (melewati jam servis).
   - Modal pencatatan running hours harian/per pelayaran.

3. **Planned Maintenance System (Core PMS)**:
   - Penjadwalan perawatan berbasis **running hours** (250h, 500h, 1000h, 5000h) dan **interval kalender** (bulanan, kuartalan, 5-tahunan docking).
   - Work Orders lifecycle (*Scheduled -> In Progress -> Completed / Sign-Off*).
   - Checklist interaktif teknisi, alokasi suku cadang terpakai, dan estimasi biaya perbaikan.

4. **Suku Cadang & Manajemen Inventaris**:
   - Master sparepart terhubung dengan nomor seri equipment.
   - Peringatan batas minimum stok (*Low Stock* & *Critical Alert*).
   - Pengajuan pembelian barang (*Purchase Requisition*) dan tracking PO armada.

5. **Manajemen Biaya & Anggaran (Cost Management)**:
   - Analisis *Budget vs Actual* per kapal dan per kategori biaya (sparepart, jasa teknisi, docking).
   - Visualisasi penyerapan anggaran dan variance surplus/defisit.

6. **Awak Kapal (Crew Management)**:
   - Biodata kru per kapal, jabatan (*Master, C/E, Officers, Ratings*), dan buku pelaut.
   - Pencatatan kehadiran (Attendance Onboard / Offboard).
   - Pengajuan cuti & persetujuan berjenjang (Nakhoda -> Fleet Manager).
   - Riwayat latihan keselamatan kapal (*Safety Drills: Fire Drill, Abandon Ship, Man Overboard*).

7. **Radar Dokumen Legal & Sertifikat STCW**:
   - Status visual otomatis: **Aktif (Hijau)**, **Mendekati Expired (Kuning/Oranye)**, **Expired (Merah)**.
   - Sertifikat Kru: COC (ANT/ATT), COP (BST, AFF), Medical Fitness Certificate.
   - Surat Legal Kapal: SMC (ISM Code), Class Hull & Machinery BKI/ClassNK, Safety Equipment, P&I Club.
   - Pratinjau dokumen scan sertifikat resmi dengan verifikasi QR & stempel.

8. **Pusat Notifikasi & WhatsApp Reminder Bot**:
   - Konfigurasi ambang batas pengingat otomatis: **H-90, H-60, H-30, H-14, H-7, H-1**.
   - Generator pesan WhatsApp resmi dengan link langsung kirim ke kru / perwira terkait.
   - Alur eskalasi otomatis ke Fleet Manager jika peringatan H-7 tidak ditindaklanjuti dalam 3 hari.
   - Log audit seluruh riwayat pengiriman notifikasi (*Delivered / Escalated*).

9. **Laporan & Ekspor Data**:
   - Ekspor lembar kerja CSV / Excel instan untuk Work Orders, Dokumen, Biaya, dan Sparepart.
   - Tata letak cetak ramah dokumen (Print / PDF Ready) lengkap dengan kolom tanda tangan pimpinan armada.

10. **Role-Based Access Control (RBAC)**:
    - Pengujian interaktif multi-peran: *Super Admin, Fleet Manager, Admin Kapal / Nakhoda, Teknisi / Chief Engineer, Crew / ABK, HR / Personalia, Finance*.

---

## Teknologi & Arsitektur

- **Frontend**: React 18, Vite 5, Modern CSS Maritime Cockpit Design Tokens, Lucide Icons, Canvas Confetti.
- **State Management**: Reactive React Context dengan sinkronisasi otomatis ke `localStorage` (dapat langsung digunakan tanpa setup server terpisah).
- **Hosting / Deployment**: Zero-config Vite build (`dist`), kompatibel langsung dengan Vercel SPA atau web server apa pun.

---

## Panduan Menjalankan Aplikasi

### 1. Menjalankan di Komputer Lokal (Development)

```bash
# Pastikan dependensi terpasang
npm install

# Jalankan Vite dev server
npm run dev
```

Buka browser di `http://localhost:3000`.

### 2. Membangun untuk Produksi (Production Build)

```bash
npm run build
```

Hasil build akan otomatis tersedia di folder `dist/`. Anda dapat mengujinya dengan:
```bash
npm run preview
```

### 3. Deploy ke Vercel

Repository ini telah dilengkapi dengan `vercel.json` standar:
```json
{
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
Cukup push repository ini ke GitHub / GitLab dan hubungkan ke akun Vercel Anda. Vercel akan otomatis mendeteksi framework **Vite** dan menyajikan aplikasi dengan performa maksimal.
