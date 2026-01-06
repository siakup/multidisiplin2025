# Database Setup Files

## 📁 File SQL yang Tersedia

1. **`schema.sql`** - File lengkap untuk:
   - Create semua tabel (User, Panel, Electricity_Bills, Session)
   - Create function SHA-256 untuk hash password
   - Insert initial users (password di-hash otomatis)
   - Insert initial panels

2. **`insert_users.sql`** - Insert/update users saja
   - Password akan di-hash otomatis menggunakan function `sha256_hash()`
   - Password asli: `1234`

3. **`insert_panels.sql`** - Insert panels saja

## 🚀 Cara Menggunakan

### Setup Lengkap (Pertama Kali)

Jalankan file `schema.sql` di pgAdmin:
1. Buka pgAdmin
2. Connect ke database `electricity`
3. Query Tool → Buka `database/schema.sql`
4. Execute (F5)

### Insert Users Saja

Jika hanya ingin insert/update users:
1. Pastikan function `sha256_hash()` sudah ada (dari schema.sql)
2. Jalankan `database/insert_users.sql`

### Insert Panels Saja

Jika hanya ingin insert panels:
1. Jalankan `database/insert_panels.sql`

## 🔐 Function SHA-256 Hash

File `schema.sql` sudah membuat function PostgreSQL untuk hash SHA-256:

```sql
sha256_hash('1234') -- Akan return hash SHA-256 dari '1234'
```

Function ini digunakan saat INSERT password, jadi password asli (`1234`) akan otomatis di-hash.

## 📊 Data Initial

### Users
- **Facility management** - Password: `1234`
- **student hausing** - Password: `1234`

### Panels
- GL 01
- GL 02
- GOR 01
- GOR 02
- Modular 01

## ✅ Verifikasi

Setelah menjalankan schema.sql:

```sql
-- Cek users
SELECT "id_User", "Username", "Role", "name" FROM "User";

-- Cek panels
SELECT * FROM "Panel";
```
