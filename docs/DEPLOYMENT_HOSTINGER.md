# Panduan Deployment Hostinger — PMS Armada (PT. Pelayaran Baharimas Kalimantan)

Dokumen ini adalah panduan teknis resmi untuk men-deploy aplikasi **PMS Armada** ke server hosting **Hostinger** (baik Shared Hosting / Cloud Hosting berbasis LiteSpeed/Apache, maupun VPS berbasis Nginx).

---

## 1. Arsitektur Aplikasi

- **Tipe Aplikasi:** Single Page Application (SPA) berbasis Vite + React.
- **Output Build:** File statis murni (HTML, CSS, JS, SVG, gambar) di direktori `dist/`.
- **Runtime Backend:** Tidak memerlukan runtime Node.js di server hosting. Konfigurasi runtime (konektor WhatsApp Gateway, Email Gateway, preferensi situs) dikonfigurasi melalui antarmuka Admin (Site Settings & Notification Center) dan tersimpan di `localStorage` peramban.

---

## 2. Persiapan Sebelum Deployment

1. **Build Artefak Produksi:**
   Jalankan perintah build pada lingkungan lokal atau runner CI/CD:
   ```bash
   npm run build
   ```
   Perintah ini akan mengompilasi seluruh kode ke dalam direktori `dist/`. Berkas `public/.htaccess` akan secara otomatis disalin ke `dist/.htaccess`.

2. **Pastikan Keberadaan Berkas `.htaccess`:**
   Pastikan berkas `dist/.htaccess` ada di dalam folder `dist/` sebelum diunggah ke server.

---

## 3. Opsi A: Deployment ke Hostinger Shared / Cloud Hosting (hPanel)

Hostinger Web/Cloud Hosting menggunakan web server **LiteSpeed** yang 100% kompatibel dengan direktif Apache `.htaccess`.

### Langkah-langkah Unggah:

1. **Buka hPanel Hostinger:**
   - Masuk ke dashboard Hostinger -> **Websites** -> pilih domain aplikasi.
2. **Akses File Manager:**
   - Masuk ke menu **File Manager** -> buka folder `public_html/`.
   - Jika ini instalasi baru, bersihkan berkas bawaan default Hostinger (seperti `default.php`).
3. **Unggah Berkas:**
   - Unggah **seluruh isi** direktori `dist/` ke dalam `public_html/` (bukan folder `dist`-nya, melainkan isinya: `index.html`, folder `assets/`, berkas `.htaccess`, logo, dan berkas statis lainnya).
   - *Tips:* Kompres isi `dist/` menjadi `.zip`, unggah zip tersebut ke `public_html/`, lalu ekstrak langsung di File Manager hPanel.
4. **Aktifkan SSL (HTTPS):**
   - Di hPanel, buka menu **Security** -> **SSL**.
   - Pasang Let's Encrypt SSL gratis untuk domain utama dan aktifkan fitur **Force HTTPS**.

### Fungsi Berkas `.htaccess` di Hostinger:

Berkas `.htaccess` yang telah disediakan menangani kebutuhan kritis berikut:
- **SPA Routing Fallback:** Memastikan request ke rute virtual SPA (seperti `/vessels`, `/crew`, `/maintenance`) dialihkan secara internal ke `index.html` tanpa menghasilkan error `404 Not Found`.
- **Security Headers:**
  - `X-Content-Type-Options: nosniff` (mencegah eksploitasi MIME-type sniffing).
  - `X-Frame-Options: DENY` (mencegah serangan clickjacking/framing).
  - `Referrer-Policy: strict-origin-when-cross-origin` (melindungi privasi URL saat navigasi lintas domain).
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()` (mematikan API peramban yang tidak relevan).
  - `Content-Security-Policy`: Mengizinkan Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`), gambar Unsplash (`images.unsplash.com`), koneksi runtime WhatsApp/Email API (`connect-src 'self' https:`), dan pratinjau dokumen PDF/SVG (`frame-src 'self' blob: data:`).
- **Cache-Control Cerdas:**
  - `index.html`: `public, max-age=0, must-revalidate` — pengguna selalu mendapatkan versi aplikasi terbaru saat deployment baru dilakukan.
  - `/assets/*`: `public, max-age=31536000, immutable` — file JS/CSS yang ber-hash di-cache agresif selama 1 tahun untuk kecepatan muat optimal.
- **Kompresi Gzip/Deflate:** Mempercepat transfer berkas teks, CSS, JS, dan JSON.

---

## 4. Opsi B: Deployment ke Hostinger VPS (Nginx)

Jika target produksi menggunakan Hostinger VPS berbasis Nginx, gunakan konfigurasi virtual host berikut (misalnya di `/etc/nginx/sites-available/pms-armada.conf`):

```nginx
server {
    listen 80;
    server_name pms.baharimas.co.id;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name pms.baharimas.co.id;

    # Konfigurasi Sertifikat SSL
    ssl_certificate /etc/letsencrypt/live/pms.baharimas.co.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pms.baharimas.co.id/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /var/www/pms-armada/dist;
    index index.html;

    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), browsing-topics=()" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://images.unsplash.com https:; connect-src 'self' https:; frame-src 'self' blob: data:; object-src 'none'; base-uri 'self'; form-action 'self';" always;

    # Nonaktifkan akses ke berkas tersembunyi
    location ~ /\. {
        deny all;
    }

    # Aset statis ter-hash Vite (1 tahun immutable cache)
    location ^~ /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # SPA Routing Fallback & No-Cache untuk index.html
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }

    # Kompresi Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml image/svg+xml;
}
```

---

## 5. Verifikasi Pasca-Deployment

Setelah berkas terunggah ke Hostinger, lakukan verifikasi:

1. **Uji Navigasi & Fallback Rute:**
   - Buka rute langsung pada peramban (misal `https://domain.com/vessels` atau `https://domain.com/maintenance`). Refresh halaman (`F5`) dan pastikan tidak muncul error `404 Not Found`.
2. **Periksa Header Keamanan:**
   Jalankan perintah berikut di terminal:
   ```bash
   curl -I https://domain.com
   ```
   Pastikan header `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, dan `Referrer-Policy` tercetak dengan benar.
3. **Periksa Konsol Peramban:**
   Buka Developer Tools (`F12`) -> tab **Console**. Pastikan tidak ada pesan pelanggaran CSP (*Content Security Policy violation*).
4. **Uji Integrasi Gateway:**
   - Masuk ke modul **Notification Center** -> **Pengaturan Konektor**.
   - Pastikan URL WhatsApp Gateway dan Email API dapat dihubungi tanpa terhalang oleh peramban.
