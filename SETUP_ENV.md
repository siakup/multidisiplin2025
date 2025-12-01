# Setup Environment Variables

## Quick Fix untuk Error Database Connection

Error yang muncul:
```
Can't reach database server at `db:5432`
```

**Solusi**: Buat file `.env.local` dengan konfigurasi database lokal (pgAdmin).

## Langkah Setup

### 1. Buat File `.env.local`

Di root project, buat file baru dengan nama `.env.local` dan isi dengan:

```env
NODE_ENV=development

POSTGRES_USER=postgres
POSTGRES_PASSWORD=1234
POSTGRES_DB=electricity
DATABASE_URL="postgresql://postgres:1234@localhost:5432/electricity?schema=public"

JWT_SECRET=9f2c1d1d2e1b9f7c0b72c8dbd53e6adcb17422bb4fa67c51b93e24dcb2a9c8f9
```

### 2. Verifikasi Database

Pastikan:
- ✅ PostgreSQL service sedang running
- ✅ Database `electricity` sudah dibuat di pgAdmin
- ✅ Password PostgreSQL adalah `1234`
- ✅ Port PostgreSQL adalah `5432` (default)

### 3. Restart Development Server

Setelah membuat `.env.local`, restart server:

```bash
# Stop server (Ctrl+C)
# Kemudian jalankan lagi:
npm run dev
```

## Troubleshooting

### Jika password PostgreSQL berbeda dari 1234

Ubah di `.env.local`:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/electricity?schema=public"
```

### Jika port PostgreSQL berbeda

Ubah di `.env.local`:
```env
DATABASE_URL="postgresql://postgres:1234@localhost:YOUR_PORT/electricity?schema=public"
```

### Jika database belum dibuat

Jalankan query di pgAdmin:
```sql
CREATE DATABASE electricity;
```

Kemudian jalankan file `database/schema.sql` untuk create tables.

## Perbedaan Konfigurasi

| Konfigurasi | Host | Port | Database | Penggunaan |
|------------|------|------|----------|------------|
| **Docker** | `db` | `5432` | `nextjs-template` | Untuk development dengan Docker Compose |
| **pgAdmin (Lokal)** | `localhost` | `5432` | `electricity` | Untuk development dengan pgAdmin |

File `.env.local` akan override konfigurasi default, jadi gunakan konfigurasi sesuai kebutuhan Anda.

