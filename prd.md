# PRD: Dashboard Sistem PMS (Planned Maintenance System) Kapal

## 1. Informasi Dokumen

| Item | Detail |
|---|---|
| Nama Produk | Dashboard PMS Kapal |
| Versi Dokumen | 1.0 |
| Tanggal | 8 September 2026 |
| Status | Draft |

---

## 2. Latar Belakang

Operasional armada kapal membutuhkan pengelolaan tiga hal krusial secara bersamaan: kondisi teknis kapal (perawatan equipment & sparepart), kepatuhan dokumen legal (surat kapal & sertifikat crew), dan ketersediaan crew yang layak berlayar (kehadiran, cuti, kegiatan). Saat ini ketiga aspek tersebut sering dikelola secara manual/terpisah (Excel, arsip fisik, WA grup informal), sehingga risiko keterlambatan perpanjangan sertifikat, kapal ditahan otoritas (detained), atau kekurangan crew bersertifikat baru diketahui saat sudah mendekati/lewat tanggal jatuh tempo.

Dashboard PMS ini dibangun sebagai sistem terpusat berbasis web yang mencakup **Planned Maintenance System (equipment & sparepart)**, **manajemen data crew per kapal**, **manajemen surat/dokumen kapal**, dan **sistem notifikasi proaktif (WhatsApp/HP)** agar tidak ada satu pun tanggal penting yang terlewat.

## 3. Tujuan Produk

1. Menyediakan satu dashboard terpusat per kapal maupun level fleet (semua kapal).
2. Memastikan seluruh jadwal perawatan equipment berjalan tepat waktu dan tercatat rapi.
3. Memastikan seluruh sertifikat crew dan surat kapal terpantau status & tanggal kadaluarsanya.
4. Mengurangi risiko denda, penahanan kapal, atau crew tidak layak berlayar akibat dokumen expired.
5. Mengotomatisasi pengingat (reminder) melalui WhatsApp dan notifikasi HP sebelum dokumen/sertifikat kadaluarsa.
6. Memberikan visibilitas biaya perawatan & sparepart untuk kontrol budget.

## 4. Ruang Lingkup

### 4.1 Dalam Lingkup
- Manajemen data master kapal & equipment
- Modul Planned Maintenance (jadwal, work order, riwayat)
- Modul sparepart & inventory
- Modul biaya sparepart dan biaya perawatan
- Modul data crew per kapal: kehadiran, cuti, kegiatan, sertifikat crew
- Modul surat/dokumen kapal
- Sistem notifikasi (WhatsApp & push notification HP) untuk reminder jatuh tempo
- Dashboard & reporting (per kapal & per fleet)
- Manajemen user, role, dan hak akses

### 4.2 Luar Lingkup (Fase Awal)
- Payroll / penggajian crew
- Sistem crewing/recruitment (rekrutmen crew baru)
- Integrasi langsung dengan sistem otoritas pelabuhan/pemerintah
- Modul voyage planning / tracking posisi kapal (AIS)

---

## 5. Pengguna & Peran (Roles)

| Role | Deskripsi | Akses Utama |
|---|---|---|
| Super Admin | Mengelola seluruh sistem, semua kapal | Full access, konfigurasi sistem |
| Fleet Manager | Memantau seluruh kapal dalam armada | Dashboard fleet, laporan lintas kapal, approval tingkat tinggi |
| Admin Kapal / Nakhoda | Mengelola data satu kapal spesifik | Input data crew, maintenance, dokumen kapal miliknya |
| Teknisi / Chief Engineer | Mengeksekusi & melaporkan pekerjaan perawatan | Work order, checklist, update status equipment |
| Crew / ABK | Melihat data pribadi (sertifikat, cuti, jadwal) | Read-only data diri, pengajuan cuti |
| HR/Personalia | Mengelola data cuti, kehadiran, kegiatan crew | CRUD modul crew |
| Finance | Memantau biaya sparepart & perawatan | Read/report modul biaya |

---

## 6. Arsitektur Teknis (Ringkasan)

| Layer | Teknologi |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js (REST API) |
| Database | PostgreSQL |
| Job Scheduler | Cron job / task queue (mis. node-cron atau BullMQ) untuk pengecekan expired harian |
| Notifikasi WhatsApp | WhatsApp Business API (mis. Twilio, Wablas, atau Qontak — dipilih saat implementasi) |
| Push Notification HP | Firebase Cloud Messaging (FCM) / OneSignal |
| Notifikasi Fallback | Email (SMTP/SendGrid) |
| Penyimpanan Dokumen | Object storage (mis. S3-compatible) untuk file scan sertifikat/surat |

> Catatan: Pemilihan provider WhatsApp Business API perlu dikonfirmasi karena berdampak pada biaya per pesan dan proses verifikasi nomor bisnis.

---

## 7. Modul & Fitur

### 7.1 Modul Master Data Kapal & Equipment
- Data kapal (nama, IMO number, jenis, flag, ukuran, foto)
- Daftar equipment per kapal (mesin, genset, pompa, dll) dengan running hours
- Struktur hierarki equipment (kategori & sub-komponen)

### 7.2 Modul Planned Maintenance (Inti PMS)
| Fitur | Deskripsi |
|---|---|
| Jadwal perawatan | Berbasis running hours (jam operasi) dan/atau kalender (interval waktu) |
| Work Order | Pembuatan, penugasan ke teknisi, checklist tugas, approval selesai |
| Riwayat perawatan | Log lengkap per equipment (kapan, siapa, apa yang dikerjakan) |
| Status maintenance | Overdue, due soon (mendekati jatuh tempo), completed |
| Dashboard maintenance | Ringkasan status seluruh equipment per kapal |

### 7.3 Modul Sparepart & Inventory
| Fitur | Deskripsi |
|---|---|
| Master sparepart | Data sparepart per equipment (kode, nama, stok, lokasi) |
| Minimum stock alert | Notifikasi saat stok di bawah ambang batas |
| Permintaan sparepart | Requisition/pengajuan pembelian sparepart |
| Riwayat pemakaian | Log pemakaian sparepart per work order |

### 7.4 Modul Biaya (Cost Management)
| Fitur | Deskripsi |
|---|---|
| Biaya sparepart | Tracking biaya per pembelian/pemakaian sparepart |
| Biaya perawatan | Biaya jasa teknisi, docking, kontraktor eksternal |
| Budget vs Actual | Perbandingan anggaran dan realisasi per kapal/periode |
| Laporan biaya | Rekap biaya per kapal, per equipment, per periode (bulanan/tahunan) |

### 7.5 Modul Data Crew per Kapal

#### 7.5.1 Master Data Crew
- Biodata (nama, jabatan/rank, kontak, foto)
- Riwayat kontrak & penempatan kapal (sign on/off history)

#### 7.5.2 Kehadiran (Attendance)
- Status onboard/tidak onboard per crew
- Log sign on & sign off per kapal
- Rekap kehadiran per periode

#### 7.5.3 Cuti
- Pengajuan cuti oleh crew
- Approval berjenjang (Admin Kapal → Fleet Manager)
- Sisa jatah cuti otomatis terhitung
- Jadwal sign off terkait cuti

#### 7.5.4 Kegiatan Crew
- Pencatatan training, drill (fire drill, abandon ship drill, dll), meeting, evaluasi
- Kalender kegiatan per kapal
- Riwayat partisipasi per crew

#### 7.5.5 Sertifikat Crew
- Master jenis sertifikat (COC, COP, medical certificate, safety training, dll)
- Tanggal terbit & tanggal kadaluarsa
- Upload dokumen scan sertifikat
- Status: aktif / mendekati expired / expired

### 7.6 Modul Surat & Dokumen Kapal
- Master dokumen kapal (Safety Management Certificate, Class Certificate, Flag Certificate, sertifikat asuransi, dll)
- Tanggal terbit, berlaku, dan kadaluarsa
- Upload dokumen scan
- Status tracking: aktif / mendekati expired / expired

### 7.7 Modul Notifikasi & Reminder (WA/HP)
| Fitur | Deskripsi |
|---|---|
| Konfigurasi threshold | Pengaturan H-90/H-60/H-30/H-14/H-7/H-1 sebelum kadaluarsa (dapat disesuaikan per jenis dokumen) |
| Channel notifikasi | WhatsApp (otomatis) dan Push Notification HP (aplikasi/web) |
| Escalation | Jika tidak ada tindak lanjut, notifikasi eskalasi ke Admin Kapal lalu Fleet Manager |
| Target notifikasi | Crew ybs (untuk sertifikat pribadi), Admin Kapal & Fleet Manager (untuk surat kapal) |
| Notifikasi maintenance | Reminder juga untuk jadwal perawatan yang overdue/mendekati jatuh tempo |
| Notifikasi stok | Alert saat stok sparepart mencapai batas minimum |
| Log notifikasi | Histori seluruh notifikasi yang terkirim, status terkirim/gagal |

### 7.8 Dashboard & Reporting
- Dashboard per kapal (status maintenance, crew, dokumen dalam satu tampilan)
- Dashboard fleet (ringkasan seluruh kapal, sortir berdasarkan urgensi)
- Export laporan (PDF/Excel)
- Grafik KPI: tingkat kepatuhan maintenance, tingkat kepatuhan sertifikat crew, dsb

### 7.9 Modul Administrasi & Keamanan
- Manajemen user & role (RBAC)
- Multi-kapal (data terpisah per kapal, dapat diakses sesuai hak akses)
- Audit trail (log siapa mengubah apa dan kapan)

---

## 8. Functional Requirements Utama

| ID | Requirement |
|---|---|
| FR-01 | Sistem dapat menyimpan data master kapal, equipment, crew, dan dokumen secara terstruktur per kapal |
| FR-02 | Sistem dapat menghasilkan jadwal perawatan otomatis berdasarkan running hours dan interval kalender |
| FR-03 | Sistem dapat mencatat pengajuan dan approval cuti crew secara berjenjang |
| FR-04 | Sistem dapat mengirim notifikasi WhatsApp dan push notification otomatis berdasarkan threshold yang dikonfigurasi |
| FR-05 | Sistem dapat menampilkan status expired/mendekati expired untuk seluruh sertifikat crew dan surat kapal |
| FR-06 | Sistem dapat menghitung dan menampilkan perbandingan budget vs actual biaya perawatan & sparepart |
| FR-07 | Sistem dapat membatasi akses data berdasarkan role dan kapal yang ditugaskan |
| FR-08 | Sistem dapat mengekspor laporan dalam format PDF/Excel |

---

## 9. Non-Functional Requirements

| Kategori | Requirement |
|---|---|
| Performance | Dashboard utama dapat dimuat dalam <3 detik untuk data hingga 50 kapal |
| Security | Role-Based Access Control (RBAC), enkripsi data sensitif, HTTPS untuk seluruh komunikasi |
| Availability | Target uptime 99.5% |
| Scalability | Mendukung penambahan kapal baru tanpa perubahan struktur sistem |
| Data Retention | Riwayat dokumen & maintenance disimpan minimal 5 tahun |
| Audit Trail | Seluruh perubahan data penting tercatat (who, what, when) |
| Localization | Antarmuka dalam Bahasa Indonesia |

---

## 10. Model Data (Entitas Utama — High Level)

`Ship`, `Equipment`, `MaintenanceSchedule`, `WorkOrder`, `Sparepart`, `SparepartUsage`, `MaintenanceCost`, `Crew`, `CrewCertificate`, `CrewLeave`, `CrewAttendance`, `CrewActivity`, `ShipDocument`, `NotificationConfig`, `NotificationLog`, `User`, `Role`

---

## 11. Integrasi Eksternal

| Integrasi | Tujuan |
|---|---|
| WhatsApp Business API (Twilio/Wablas/Qontak) | Mengirim reminder otomatis ke crew/admin |
| Firebase Cloud Messaging / OneSignal | Push notification ke aplikasi/web |
| SMTP/SendGrid | Email fallback jika WA/push gagal terkirim |
| Object storage (S3-compatible) | Penyimpanan file scan sertifikat & surat kapal |

---

## 12. Alur Notifikasi Reminder (Contoh)

1. Job scheduler berjalan setiap hari (misal jam 06:00) mengecek seluruh tanggal expired (sertifikat crew, surat kapal, jadwal maintenance).
2. Sistem membandingkan tanggal expired dengan threshold yang dikonfigurasi (H-90/60/30/14/7/1).
3. Jika threshold tercapai, sistem mengirim notifikasi ke WhatsApp dan/atau push notification HP kepada pihak terkait (crew ybs / Admin Kapal / Fleet Manager).
4. Jika tidak ada tindak lanjut dalam periode tertentu, sistem melakukan eskalasi ke level di atasnya.
5. Seluruh pengiriman (berhasil/gagal) tercatat pada log notifikasi.

---

## 13. Asumsi & Batasan

- Nomor WhatsApp crew/admin tersedia dan bersedia menerima notifikasi otomatis.
- Provider WhatsApp Business API akan ditentukan saat fase implementasi (berdampak pada biaya operasional per pesan).
- Push notification memerlukan aplikasi/web dengan izin notifikasi aktif dari pengguna.
- Data historis (jika ada) akan dimigrasi secara manual/terpisah, tidak termasuk dalam scope PRD ini.

---

## 14. Metrik Keberhasilan (KPI)

| KPI | Target |
|---|---|
| Tingkat kepatuhan jadwal maintenance | ≥ 95% selesai tepat waktu |
| Tingkat kepatuhan sertifikat crew | 0 sertifikat expired tanpa notifikasi terkirim |
| Tingkat kepatuhan surat kapal | 0 surat kapal expired tanpa notifikasi terkirim |
| Waktu respon notifikasi | Notifikasi terkirim maksimal 5 menit setelah threshold tercapai |
| Akurasi laporan biaya | Selisih budget vs actual tercatat 100% akurat sesuai input |

---

## 15. Roadmap / Fase Pengembangan

| Fase | Cakupan |
|---|---|
| Fase 1 | Master data kapal & equipment, Modul Planned Maintenance inti, Modul sparepart & biaya |
| Fase 2 | Modul data crew (kehadiran, cuti, kegiatan, sertifikat), Modul surat kapal |
| Fase 3 | Sistem notifikasi WhatsApp & push notification, escalation logic |
| Fase 4 | Dashboard fleet lanjutan, reporting & analytics, optimasi performa |

---

## 16. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Biaya WhatsApp Business API membesar sesuai jumlah pesan | Evaluasi provider & atur threshold notifikasi agar tidak berlebihan |
| Data crew/kapal tidak lengkap saat migrasi awal | Sediakan template import data (Excel) & validasi data masuk |
| Crew tidak merespons notifikasi | Mekanisme eskalasi otomatis ke Admin Kapal/Fleet Manager |
| Ketergantungan pada koneksi internet di kapal (untuk sync data) | Dukungan mode offline-first pada aplikasi input data di kapal (opsional, fase lanjutan) |