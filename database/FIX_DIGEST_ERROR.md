# Fix Error: function digest(text, unknown) does not exist

## 🔴 Error yang Terjadi

```
ERROR: function digest(text, unknown) does not exist
HINT: No function matches the given name and argument types.
```

## ✅ Solusi

Error ini terjadi karena PostgreSQL memerlukan extension `pgcrypto` untuk menggunakan function `digest()`.

### Langkah Perbaikan

1. **Enable Extension pgcrypto**

   Jalankan query berikut di pgAdmin Query Tool:

   ```sql
   CREATE EXTENSION IF NOT EXISTS pgcrypto;
   ```

2. **Jalankan Ulang schema.sql**

   Setelah extension dibuat, jalankan kembali `database/schema.sql`

### Atau Perbaiki Manual

Jika tidak bisa create extension, gunakan hash yang sudah dihitung sebelumnya:

```sql
-- Password: 1234
-- SHA-256 Hash: 03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4

INSERT INTO "User" ("Username", "Password", "Role", "name") 
VALUES ('Facility management', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 'USER', 'Facility Management');

INSERT INTO "User" ("Username", "Password", "Role", "name") 
VALUES ('student hausing', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 'USER', 'Student Housing');
```

## 📝 File yang Sudah Diperbaiki

File `database/schema.sql` sudah diupdate untuk:
1. Create extension pgcrypto terlebih dahulu
2. Baru kemudian create function sha256_hash()

Jalankan `schema.sql` sekali lagi setelah perbaikan ini.

