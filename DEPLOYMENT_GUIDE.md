# 🚀 Panduan Deploy API Documentation ke Public

## 📋 Daftar Isi

1. [Persiapan](#persiapan)
2. [Pilihan Platform Deployment](#pilihan-platform-deployment)
3. [Deploy ke Vercel (Recommended)](#deploy-ke-vercel-recommended)
4. [Deploy ke Railway](#deploy-ke-railway)
5. [Deploy ke VPS/Cloud Server](#deploy-ke-vpscloud-server)
6. [Custom Domain Setup](#custom-domain-setup)
7. [Environment Variables](#environment-variables)

---

## 🎯 Persiapan

### 1. Pastikan Project Siap Production

Cek file-file berikut sudah lengkap:

```bash
# .env.example untuk template environment variables
# .gitignore untuk exclude sensitive files
# README.md dengan dokumentasi
```

### 2. Test Local Dulu

```bash
# Build production
npm run build

# Test production locally
npm start
```

Pastikan tidak ada error saat build.

---

## 🏢 Pilihan Platform Deployment

### Perbandingan Platform:

| Platform | Gratis? | Domain | Database | Kemudahan |
|----------|---------|--------|----------|-----------|
| **Vercel** | ✅ Ya | vercel.app | External | ⭐⭐⭐⭐⭐ Sangat Mudah |
| **Railway** | ✅ Trial | railway.app | Built-in | ⭐⭐⭐⭐ Mudah |
| **Netlify** | ✅ Ya | netlify.app | External | ⭐⭐⭐⭐ Mudah |
| **Render** | ✅ Ya | render.com | Built-in | ⭐⭐⭐ Sedang |
| **VPS** | ❌ Bayar | Custom | Custom | ⭐⭐ Sulit |

---

## 🎨 Deploy ke Vercel (Recommended)

**Vercel adalah platform terbaik untuk Next.js karena dibuat oleh team yang sama.**

### Langkah 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Langkah 2: Login ke Vercel

```bash
vercel login
```

Pilih metode login (GitHub, GitLab, Email, dll)

### Langkah 3: Deploy

```bash
# Di folder project
cd C:\xampp\htdocs\electricity-bills

# Deploy
vercel
```

Jawab pertanyaan:
- Set up and deploy? **Y**
- Which scope? **Pilih account Anda**
- Link to existing project? **N**
- What's your project's name? **electricity-bills-api**
- In which directory is your code located? **./**
- Want to override the settings? **N**

### Langkah 4: Deploy Production

```bash
vercel --prod
```

Anda akan mendapat URL seperti: `https://electricity-bills-api.vercel.app`

### Langkah 5: Akses API Documentation

```
https://electricity-bills-api.vercel.app/docs
```

---

## 🚂 Deploy ke Railway

Railway bagus untuk project yang butuh database built-in.

### Langkah 1: Buat Account Railway

1. Kunjungi https://railway.app
2. Sign up dengan GitHub
3. Verifikasi email

### Langkah 2: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Langkah 3: Login

```bash
railway login
```

### Langkah 4: Init Project

```bash
cd C:\xampp\htdocs\electricity-bills
railway init
```

### Langkah 5: Deploy

```bash
railway up
```

### Langkah 6: Add Domain

```bash
railway domain
```

Pilih generate domain atau custom domain.

URL: `https://your-project.railway.app/docs`

---

## 🖥️ Deploy ke VPS/Cloud Server

Untuk kontrol penuh, deploy ke VPS (DigitalOcean, AWS, Linode, dll).

### Langkah 1: Sewa VPS

Pilih provider:
- **DigitalOcean** - $4/bulan
- **AWS Lightsail** - $3.50/bulan
- **Linode** - $5/bulan
- **Hostinger VPS** - Rp 60rb/bulan

### Langkah 2: Setup Server

```bash
# SSH ke server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2 (Process Manager)
npm install -g pm2

# Install Nginx
apt install -y nginx
```

### Langkah 3: Upload Project

```bash
# Di local machine
# Zip project (exclude node_modules)
tar -czf electricity-bills.tar.gz --exclude=node_modules .

# Upload ke server
scp electricity-bills.tar.gz root@your-server-ip:/var/www/

# Di server
cd /var/www
tar -xzf electricity-bills.tar.gz
cd electricity-bills
npm install
npm run build
```

### Langkah 4: Jalankan dengan PM2

```bash
# Start app
pm2 start npm --name "electricity-bills" -- start

# Save PM2 config
pm2 save

# Auto start on reboot
pm2 startup
```

### Langkah 5: Setup Nginx Reverse Proxy

```bash
# Buat config
nano /etc/nginx/sites-available/electricity-bills
```

Isi dengan:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Ganti dengan domain Anda

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan config:

```bash
ln -s /etc/nginx/sites-available/electricity-bills /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Langkah 6: Setup SSL dengan Let's Encrypt

```bash
# Install certbot
apt install -y certbot python3-certbot-nginx

# Generate SSL
certbot --nginx -d your-domain.com

# Auto renewal
certbot renew --dry-run
```

**Akses:** `https://your-domain.com/docs`

---

## 🌍 Custom Domain Setup

### Untuk Vercel:

1. Buka project di dashboard Vercel
2. Settings → Domains
3. Add domain: `api.yourdomain.com`
4. Update DNS di domain registrar:
   ```
   Type: CNAME
   Name: api
   Value: cname.vercel-dns.com
   ```

### Untuk Railway:

1. Dashboard Railway → Settings → Domains
2. Add custom domain: `api.yourdomain.com`
3. Update DNS:
   ```
   Type: CNAME
   Name: api
   Value: [railway-cname]
   ```

### Untuk VPS:

1. Beli domain (Namecheap, GoDaddy, dll)
2. Update DNS A Record:
   ```
   Type: A
   Name: @
   Value: [VPS IP Address]
   ```
3. Untuk subdomain api:
   ```
   Type: A
   Name: api
   Value: [VPS IP Address]
   ```

---

## 🔐 Environment Variables

### Setup .env untuk Production

Buat file `.env.production`:

```env
# Database
DATABASE_URL="your-production-database-url"

# JWT Secrets
JWT_ACCESS_SECRET="your-super-secret-access-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

# App
NODE_ENV=production
PORT=3000

# CORS (jika perlu)
ALLOWED_ORIGINS="https://yourapp.com,https://api.yourapp.com"
```

### Setup di Vercel:

```bash
# Via CLI
vercel env add DATABASE_URL
vercel env add JWT_ACCESS_SECRET
vercel env add JWT_REFRESH_SECRET

# Atau via Dashboard
# Project Settings → Environment Variables
```

### Setup di Railway:

```bash
# Via CLI
railway variables set DATABASE_URL="your-db-url"

# Atau via Dashboard
# Project → Variables → New Variable
```

---

## 📊 Monitoring & Analytics

### Setup Monitoring

1. **Vercel Analytics**
   ```bash
   npm install @vercel/analytics
   ```

2. **Sentry (Error Tracking)**
   ```bash
   npm install @sentry/nextjs
   ```

3. **PM2 Monitoring (untuk VPS)**
   ```bash
   pm2 install pm2-logrotate
   pm2 logs
   ```

---

## 🔒 Security Best Practices

### 1. Rate Limiting

Tambahkan rate limiting untuk API:

```bash
npm install express-rate-limit
```

### 2. CORS Configuration

Update untuk production di `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://yourapp.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
        ],
      },
    ];
  },
};
```

### 3. Environment Variables

- ✅ Jangan commit `.env` ke git
- ✅ Gunakan environment variables untuk secrets
- ✅ Gunakan `.env.example` sebagai template

### 4. HTTPS Only

Pastikan semua request melalui HTTPS di production.

---

## 🎯 Contoh URL Hasil Deploy

### Vercel:
```
https://electricity-bills-api.vercel.app
https://electricity-bills-api.vercel.app/docs
https://electricity-bills-api.vercel.app/api/docs/swagger.json
```

### Railway:
```
https://electricity-bills-api.railway.app
https://electricity-bills-api.railway.app/docs
```

### Custom Domain:
```
https://api.yourdomain.com
https://api.yourdomain.com/docs
https://api.yourdomain.com/api/docs/swagger.json
```

---

## 🚀 Quick Start - Deploy dalam 5 Menit

### Opsi Tercepat: Vercel

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
cd C:\xampp\htdocs\electricity-bills
vercel --prod

# 4. Selesai! Copy URL yang diberikan
# Contoh: https://electricity-bills-api.vercel.app/docs
```

**Total waktu: 5 menit!**

---

## 📱 Share ke Banyak Orang

Setelah deploy, Anda bisa share:

### 1. Direct Link
```
https://your-api.vercel.app/docs
```

### 2. QR Code
Generate QR code dari URL di https://www.qr-code-generator.com/

### 3. API Documentation Link
Tambahkan link di README.md:
```markdown
## 📚 API Documentation

Swagger UI: https://your-api.vercel.app/docs
OpenAPI JSON: https://your-api.vercel.app/api/docs/swagger.json
```

### 4. Embed di Website
```html
<iframe 
  src="https://your-api.vercel.app/docs" 
  width="100%" 
  height="800px"
  frameborder="0">
</iframe>
```

---

## ⚠️ Catatan Penting

### Database

Jika menggunakan SQLite lokal, Anda perlu:
1. **Migrasi ke PostgreSQL/MySQL** untuk production
2. Gunakan database cloud:
   - **Neon** (PostgreSQL) - Gratis
   - **PlanetScale** (MySQL) - Gratis
   - **Supabase** (PostgreSQL) - Gratis
   - **Railway Postgres** - Trial

### Update DATABASE_URL

```env
# SQLite (local only)
DATABASE_URL="file:./dev.db"

# PostgreSQL (production)
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# MySQL (production)
DATABASE_URL="mysql://user:password@host:3306/dbname"
```

### Prisma Migration di Production

```bash
# Deploy migrations
npx prisma migrate deploy

# Generate client
npx prisma generate
```

---

## 🎓 Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Nginx Config**: https://www.nginx.com/resources/wiki/start/

---

## 🆘 Troubleshooting

### Error: Module not found in production

**Solusi:** Pastikan dependencies ada di `dependencies`, bukan `devDependencies`:

```bash
npm install --save swagger-jsdoc swagger-ui-react
```

### Error: Database connection failed

**Solusi:** Update DATABASE_URL dengan credentials production

### Error: 502 Bad Gateway (VPS)

**Solusi:** 
```bash
# Cek PM2 status
pm2 status
pm2 logs electricity-bills

# Restart app
pm2 restart electricity-bills
```

### Port sudah digunakan

**Solusi:**
```bash
# Cek port
lsof -i :3000

# Kill process
kill -9 [PID]
```

---

## ✅ Checklist Deployment

- [ ] Build berhasil (`npm run build`)
- [ ] Test local production (`npm start`)
- [ ] Environment variables setup
- [ ] Database production ready
- [ ] Prisma migrations deployed
- [ ] Domain configured (jika custom)
- [ ] SSL/HTTPS enabled
- [ ] CORS configured
- [ ] API tested di production
- [ ] Documentation accessible
- [ ] Monitoring setup

---

**Selamat! API Documentation Anda sekarang bisa diakses publik! 🎉**

**Contoh:** `https://your-api.vercel.app/docs`
