# 📦 Vercel Deployment Guide - PMS Kapal

## ✅ Yang Sudah Diperbaiki

### 1. **vercel.json Configuration**
```json
{
  "version": 2,
  "builds": [
    { "src": "api/*.js", "use": "@vercel/node" },
    { "src": "public/**", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/(.*)", "dest": "/public/$1" }
  ]
}
```

### 2. **Simplified API Handler** (`api/index.js`)
- ✅ Hanya pakai Node.js built-in modules (`crypto`)
- ✅ No external dependencies
- ✅ Better error handling dengan try-catch
- ✅ Explicit path parsing
- ✅ CORS headers yang benar
- ✅ Proper status codes

### 3. **Health Check** (`api/health.js`)
Endpoint dedicated untuk health check — bisa diakses di:
```
https://your-app.vercel.app/api/health
```

## 🚀 Cara Deploy

### Auto Deploy (Recommended)
```bash
git add -A
git commit -m "your message"
git push origin master
```
Vercel akan otomatis detect push dan deploy.

### Manual Deploy
```bash
npm i -g vercel
vercel --prod
```

## 🔍 Troubleshooting

### Error: `FUNCTION_INVOCATION_FAILED`
**Penyebab:**
- Syntax error di handler
- Missing `export default function`
- Runtime error saat cold start
- Dependencies tidak tersedia

**Solusi yang sudah diterapkan:**
1. ✅ Simplified handler — no complex logic
2. ✅ Remove all external deps
3. ✅ Add comprehensive error handling
4. ✅ Explicit export default function

### Cek Logs Vercel
1. Buka https://vercel.com/dashboard
2. Pilih project PMS Kapal
3. Klik **Deployments** → pilih yang terbaru
4. Klik **View Function Logs** atau **Runtime Logs**
5. Lihat error detail di sana

### Test Endpoints

**Health Check:**
```bash
curl https://your-app.vercel.app/api/health
```

**Login:**
```bash
curl -X POST https://your-app.vercel.app/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"pms-demo"}'
```

**Dashboard Fleet (butuh token):**
```bash
curl https://your-app.vercel.app/api/dashboard/fleet \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📝 Notes

### Data Persistence
⚠️ **PENTING:** Vercel serverless functions bersifat **stateless & ephemeral**.
- Data di-reset setiap cold start
- Gunakan database external (PostgreSQL, MongoDB, etc) untuk production
- Saat ini pakai in-memory store untuk demo

### Cold Start
- First request setelah idle bisa lambat (1-2 detik)
- Subsequent requests cepat
- Vercel akan keep function warm jika traffic tinggi

### Limits (Free Plan)
- ✅ 100GB bandwidth/month
- ✅ 100 deployments/day
- ✅ 10 second function timeout
- ✅ 50MB function size

## 🎯 Next Steps untuk Production

1. **Add Real Database**
   - PostgreSQL (Vercel Postgres)
   - MongoDB Atlas
   - Supabase

2. **Add Environment Variables**
   ```bash
   vercel env add JWT_SECRET
   vercel env add DATABASE_URL
   ```

3. **Add Real Auth**
   - JWT dengan secret key
   - Hash password (bcrypt)
   - Refresh tokens

4. **Add File Upload**
   - Vercel Blob Storage
   - AWS S3
   - Cloudinary

## 🔗 Resources

- [Vercel Docs](https://vercel.com/docs)
- [Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)
