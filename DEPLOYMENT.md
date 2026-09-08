# Panduan Deployment — Sistem PMS Kapal Enterprise

Sistem PMS Kapal dibangun dengan arsitektur **Zero External Dependencies** (murni native Node.js 20+ tanpa perlu `npm install`), sehingga proses deployment sangat cepat, ringan, andal, dan bebas dari kerentanan dependensi pihak ketiga.

Server terpadu (`server.js`) secara otomatis melayani:
- **Frontend Web UI** (HTML, CSS, Vanilla JS, Responsive Mobile & Desktop)
- **REST API Backend** (`/api/*` dengan RBAC, Audit Trail, Scheduler, dan Data Store)
- **Port Dinamis** mendukung variabel `process.env.PORT` pada lingkungan cloud.

---

## Opsi 0: Deployment Demo Gratis di Vercel (1-Klik via GitHub)

Proyek ini telah dikonfigurasi secara lengkap dengan `vercel.json`, folder `public/`, dan Serverless API di `api/index.js`. Sangat cocok untuk presentasi / live demo kepada klien.

### Langkah Deploy ke Vercel:
1. Buka dashboard [Vercel](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik tombol **"Add New..."** → pilih **"Project"**.
3. Cari repository **`Prasetya1721/PMS`**, lalu klik **"Import"**.
4. Biarkan konfigurasi default (Vercel otomatis membaca `vercel.json` dan menjalankan `node build-vercel.js`).
5. Klik **"Deploy"**.
6. Dalam waktu kurang dari 1 menit, Vercel akan memberikan domain HTTPS gratis (misalnya `https://pms-kapal-demo.vercel.app`) yang langsung bisa dibuka dan diuji secara publik!

> **Catatan Demo Vercel:** Pada lingkungan serverless Vercel, filesystem bersifat read-only sehingga perubahan data tersimpan sementara di memori/`/tmp` selama sesi instance aktif. Untuk penyimpanan permanen operasional riil, gunakan Opsi 1 (Docker VPS) atau Opsi 2 (Railway/Render).

---

## Opsi 1: Deployment dengan Docker / Docker Compose (Direkomendasikan Produksi)

Jika server produksi memiliki Docker:

```bash
# 1. Clone repository
git clone https://github.com/Prasetya1721/PMS.git
cd PMS

# 2. Jalankan container di background
docker compose up -d --build

# 3. Cek status
docker compose ps
```

Aplikasi langsung aktif di `http://<IP-SERVER>:4000`.
> **Data Persistence:** File `apps/api/data.json` di-mount ke host, sehingga seluruh data operasional kapal, kasbon, work orders, dan spareparts tetap tersimpan aman saat container di-restart atau di-update.

---

## Opsi 2: Deployment ke Cloud PaaS (Railway, Render, Fly.io)

Platform cloud modern mendeteksi file `package.json` secara otomatis:

### A. Railway (railway.app)
1. Hubungkan akun GitHub Anda ke **Railway**.
2. Pilih repo **Prasetya1721/PMS**.
3. Railway akan membaca `package.json` dan otomatis menjalankan `npm start`.
4. Tambahkan domain publik di menu *Settings* → *Networking* → *Generate Domain*.

### B. Render (render.com)
1. Buat **New Web Service** di Render dashboard.
2. Sambungkan ke repository **Prasetya1721/PMS**.
3. Konfigurasi:
   - **Environment:** `Node`
   - **Build Command:** (kosongkan / `echo build`)
   - **Start Command:** `npm start`
4. Klik **Deploy Web Service**.

---

## Opsi 3: Deployment ke Linux VPS (Ubuntu / Debian) dengan PM2 & Nginx

### Langkah 1: Pasang Node.js & PM2
```bash
# Update sistem
sudo apt update && sudo apt install -y curl git nginx

# Install Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

### Langkah 2: Setup Aplikasi & Jalankan dengan PM2
```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/Prasetya1721/PMS.git pms-kapal
cd pms-kapal

# Jalankan server menggunakan PM2
PORT=4000 pm2 start server.js --name "pms-kapal"

# Setup auto-start saat VPS reboot
pm2 startup
pm2 save
```

### Langkah 3: Konfigurasi Reverse Proxy Nginx & SSL
Buat file konfigurasi `/etc/nginx/sites-available/pms`:
```nginx
server {
    listen 80;
    server_name pms.perusahaananda.com; # Ganti domain Anda

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Aktifkan dan pasang SSL gratis Let's Encrypt:
```bash
sudo ln -s /etc/nginx/sites-available/pms /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d pms.perusahaananda.com
```

---

## Opsi 4: Deployment di Server Windows On-Premise (Kapal / Kantor Cabang)

1. Pastikan **Node.js LTS (v20+)** telah terpasang di komputer server Windows.
2. Buka folder `Sistem PMS Kapal`.
3. Klik 2x berkas `jalan.bat` untuk menjalankan aplikasi secara lokal/LAN.
4. Agar berjalan otomatis saat komputer Windows menyala sebagai Windows Service:
   ```powershell
   npm install -g pm2 pm2-windows-startup
   pm2-startup install
   pm2 start server.js --name "pms-kapal"
   pm2 save
   ```

---

## 🔒 Checklist Keamanan Sebelum Digunakan Publik

1. **Ganti Password Akun Demo:**
   Login sebagai `superadmin` (password awal: `pms-demo`) → Buka menu **Pengaturan Sistem** → Tab **Manajemen User** → Ganti password untuk semua akun operasional (`superadmin`, `fleet`, `nakhoda`, `teknisi`, `hr`, `finance`).
2. **Koneksi WhatsApp Gateway:**
   Di menu **Pengaturan Sistem** → **Provider Notifikasi**, hubungkan token API Wablas / Qontak / Twilio jika ingin notifikasi jatuh tempo sertifikat & inspeksi otomatis terkirim ke WhatsApp kru.
3. **Backup Terjadwal:**
   Gunakan menu **Pengaturan Sistem** → **Backup Database** untuk mengunduh snapshot data JSON berkala, atau pasang cronjob untuk mencadangkan file `apps/api/data.json`.
