# ⚡ QUICK FIX: Error Database Connection

## 🔴 Error
```
Can't reach database server at `db:5432`
```

## ✅ Solusi Cepat (3 Langkah)

### Langkah 1: Buat File `.env.local`

Buat file baru bernama **`.env.local`** di root project (`d:\FILE\electricity-bills\.env.local`)

Copy paste isi berikut:

```env
NODE_ENV=development

POSTGRES_USER=postgres
POSTGRES_PASSWORD=
POSTGRES_DB=electricity
DATABASE_URL="postgresql://postgres@localhost:5432/electricity?schema=public"

JWT_SECRET=9f2c1d1d2e1b9f7c0b72c8dbd53e6adcb17422bb4fa67c51b93e24dcb2a9c8f9
```

**PENTING:**
- Jika PostgreSQL Anda menggunakan password, ganti baris `DATABASE_URL` menjadi:
  ```env
  DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/electricity?schema=public"
  ```
  Ganti `YOUR_PASSWORD` dengan password PostgreSQL Anda.

### Langkah 2: Stop dan Restart Server

1. Di terminal, tekan **Ctrl+C** untuk stop server
2. Jalankan lagi:
   ```bash
   npm run dev
   ```

### Langkah 3: Verifikasi

Setelah restart, error seharusnya hilang.

---

## 🔍 Troubleshooting

### Masih Error Setelah Langkah 1-3?

**Cek 1: Pastikan file `.env.local` ada di root project**
- Lokasi: `d:\FILE\electricity-bills\.env.local`
- Pastikan namanya benar: `.env.local` (dengan titik di depan)

**Cek 2: Pastikan DATABASE_URL benar**
- Tidak boleh `db:5432` (Docker)
- Harus `localhost:5432` (pgAdmin lokal)

**Cek 3: Pastikan PostgreSQL Running**
- Windows: Cek di Services atau jalankan `psql -U postgres`
- Jika tidak running, start PostgreSQL service

**Cek 4: Pastikan Database `electricity` Sudah Dibuat**
- Di pgAdmin, pastikan database `electricity` sudah ada
- Jika belum, buat dengan: `CREATE DATABASE electricity;`

**Cek 5: Restart VS Code / Editor**
- Kadang environment variable tidak reload
- Tutup dan buka lagi VS Code, lalu restart server

---

## 📝 Contoh Isi File `.env.local`

### Tanpa Password:
```env
NODE_ENV=development
POSTGRES_USER=postgres
POSTGRES_PASSWORD=
POSTGRES_DB=electricity
DATABASE_URL="postgresql://postgres@localhost:5432/electricity?schema=public"
JWT_SECRET=9f2c1d1d2e1b9f7c0b72c8dbd53e6adcb17422bb4fa67c51b93e24dcb2a9c8f9
```

### Dengan Password (misal: 1234):
```env
NODE_ENV=development
POSTGRES_USER=postgres
POSTGRES_PASSWORD=1234
POSTGRES_DB=electricity
DATABASE_URL="postgresql://postgres:1234@localhost:5432/electricity?schema=public"
JWT_SECRET=9f2c1d1d2e1b9f7c0b72c8dbd53e6adcb17422bb4fa67c51b93e24dcb2a9c8f9
```

---

## ⚠️ Catatan

- File `.env.local` **TIDAK** akan di-commit ke git (sudah di .gitignore)
- Next.js akan membaca `.env.local` secara otomatis
- Pastikan tidak ada spasi di awal/akhir baris
- Pastikan tanda kutip pada DATABASE_URL benar

