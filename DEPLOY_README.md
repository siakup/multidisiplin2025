# 🚀 Deploy API Documentation - Quick Start

## ⚡ Deploy dalam 5 Menit ke Vercel

Vercel adalah platform terbaik untuk Next.js dan **GRATIS** untuk personal projects!

### 📋 Prerequisites

- Account Vercel (gratis, bisa pakai GitHub)
- Node.js sudah terinstall
- Git sudah terinstall

---

## 🎯 Metode 1: Deploy via Vercel Dashboard (Paling Mudah!)

### Langkah 1: Push ke GitHub

```bash
# Initialize git (jika belum)
git init
git add .
git commit -m "Initial commit"

# Push ke GitHub
git remote add origin https://github.com/username/electricity-bills.git
git push -u origin main
```

### Langkah 2: Connect ke Vercel

1. Buka https://vercel.com
2. Klik **"Add New Project"**
3. **Import** repository GitHub Anda
4. Klik **"Import"**
5. Vercel akan otomatis detect Next.js
6. Klik **"Deploy"**

### Langkah 3: Selesai! 🎉

URL Anda: `https://electricity-bills.vercel.app`

API Docs: `https://electricity-bills.vercel.app/docs`

---

## 🎯 Metode 2: Deploy via CLI (Lebih Cepat!)

### Langkah 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Langkah 2: Login

```bash
vercel login
```

Pilih login dengan:
- GitHub (recommended)
- GitLab
- Email

### Langkah 3: Deploy

#### Windows (PowerShell):
```powershell
# Run deploy script
.\deploy-vercel.ps1

# Atau manual
vercel --prod
```

#### Linux/Mac:
```bash
# Run deploy script
./deploy-vercel.sh

# Atau manual
vercel --prod
```

### Langkah 4: Selesai! 🎉

Copy URL yang diberikan, contoh:
```
https://electricity-bills-api-abc123.vercel.app
```

Akses API docs:
```
https://electricity-bills-api-abc123.vercel.app/docs
```

---

## 🔧 Setup Environment Variables di Vercel

### Via Dashboard:

1. Buka project di Vercel Dashboard
2. Settings → Environment Variables
3. Tambahkan variables:

```
DATABASE_URL = postgresql://user:pass@host:5432/db
JWT_ACCESS_SECRET = your-secret-here
JWT_REFRESH_SECRET = your-secret-here
```

### Via CLI:

```bash
# Add environment variable
vercel env add DATABASE_URL
# Paste value dan enter

vercel env add JWT_ACCESS_SECRET
vercel env add JWT_REFRESH_SECRET

# Redeploy untuk apply changes
vercel --prod
```

---

## 🗄️ Setup Database untuk Production

SQLite **TIDAK BISA** digunakan di Vercel. Gunakan database cloud:

### Opsi 1: Neon (PostgreSQL) - GRATIS

1. Buka https://neon.tech
2. Sign up (gratis)
3. Create new project
4. Copy connection string
5. Add ke Vercel environment variables:
   ```
   DATABASE_URL = postgresql://user:pass@host/db
   ```

### Opsi 2: PlanetScale (MySQL) - GRATIS

1. Buka https://planetscale.com
2. Sign up (gratis)
3. Create database
4. Copy connection string
5. Add ke Vercel:
   ```
   DATABASE_URL = mysql://user:pass@host/db
   ```

### Opsi 3: Supabase (PostgreSQL) - GRATIS

1. Buka https://supabase.com
2. Create project
3. Copy database URL
4. Add ke Vercel

### Opsi 4: Railway (PostgreSQL) - TRIAL

1. Buka https://railway.app
2. Create PostgreSQL database
3. Copy connection string
4. Add ke Vercel

### Update Prisma Schema

Ubah datasource di `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // atau "mysql"
  url      = env("DATABASE_URL")
}
```

### Run Migrations di Production

```bash
# Generate Prisma Client
npx prisma generate

# Deploy migrations
npx prisma migrate deploy
```

---

## 🌍 Custom Domain (Opsional)

### Beli Domain

Beli domain di:
- Namecheap
- GoDaddy  
- Niagahoster (Indonesia)
- Cloudflare

### Setup di Vercel

1. Dashboard → Settings → Domains
2. Add domain: `api.yourdomain.com`
3. Vercel akan kasih instruksi DNS:

```
Type: CNAME
Name: api
Value: cname.vercel-dns.com
```

4. Update DNS di domain registrar
5. Tunggu propagasi (5-30 menit)
6. ✅ Done! Akses di `https://api.yourdomain.com/docs`

---

## 🎨 Custom URL Path (Opsional)

Ingin dokumentasi di `/api/documentation` seperti contoh?

Update `src/app/api/documentation/page.tsx`:

```typescript
// Copy dari src/app/docs/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocumentationPage() {
  // Same content as docs/page.tsx
}
```

Akses: `https://your-api.vercel.app/api/documentation`

---

## 📊 Monitoring (Opsional)

### Vercel Analytics

```bash
npm install @vercel/analytics
```

Update `src/app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## ✅ Checklist Deployment

Sebelum deploy, pastikan:

- [ ] `npm run build` berhasil tanpa error
- [ ] `.env.example` sudah dibuat
- [ ] `.gitignore` include `.env` dan sensitive files
- [ ] Database production sudah ready
- [ ] Environment variables sudah di-setup
- [ ] Prisma migrations sudah di-deploy
- [ ] API sudah di-test local

---

## 🆘 Troubleshooting

### Error: Build failed

**Solusi:**
```bash
# Test build local
npm run build

# Fix errors yang muncul
# Deploy lagi
vercel --prod
```

### Error: Database connection failed

**Solusi:**
- Pastikan DATABASE_URL benar
- Pastikan database accessible dari internet
- Test connection:
  ```bash
  npx prisma db pull
  ```

### Error: Module not found

**Solusi:**
```bash
# Pastikan dependency ada di dependencies, bukan devDependencies
npm install --save swagger-jsdoc swagger-ui-react

# Commit dan push
git add package.json package-lock.json
git commit -m "Fix dependencies"
git push

# Redeploy
vercel --prod
```

### URL tidak bisa diakses

**Solusi:**
- Tunggu 1-2 menit setelah deploy
- Clear browser cache
- Coba incognito mode
- Check Vercel dashboard untuk error logs

---

## 🎓 Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Prisma Production**: https://www.prisma.io/docs/guides/deployment/deployment-guides

---

## 📞 Contoh Hasil Deploy

### URL Production:
```
https://electricity-bills-api.vercel.app
```

### API Documentation:
```
https://electricity-bills-api.vercel.app/docs
```

### Swagger JSON:
```
https://electricity-bills-api.vercel.app/api/docs/swagger.json
```

### Custom Domain:
```
https://api.yourdomain.com/docs
```

---

## 🎉 Share ke Orang Lain

Setelah deploy, share link:

```
📚 API Documentation
https://your-api.vercel.app/docs

🔗 Swagger JSON
https://your-api.vercel.app/api/docs/swagger.json

📖 Complete Guide
https://your-api.vercel.app/SWAGGER_API_GUIDE.md
```

Atau buat QR Code:
1. Buka https://www.qr-code-generator.com/
2. Paste URL
3. Download QR code
4. Share ke banyak orang!

---

## 💡 Tips

1. **Free SSL** - Vercel automatically provides HTTPS
2. **Auto Deploy** - Push to GitHub = auto deploy
3. **Preview URLs** - Every branch gets preview URL
4. **Zero Config** - Next.js detected automatically
5. **Fast CDN** - Deployed globally

---

**Selamat! API Documentation Anda sekarang bisa diakses publik! 🚀**

Need help? Check `DEPLOYMENT_GUIDE.md` for detailed instructions.
