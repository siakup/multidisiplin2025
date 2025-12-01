# 📝 Panduan Menambahkan Electricity Bill Baru via Postman

Panduan lengkap untuk menambahkan data tagihan listrik baru menggunakan Postman API.

## 📋 Daftar Isi

1. [Persiapan](#persiapan)
2. [Langkah-langkah Menambahkan Bill](#langkah-langkah-menambahkan-bill)
3. [Format Request Body](#format-request-body)
4. [Contoh Request](#contoh-request)
5. [Response yang Diharapkan](#response-yang-diharapkan)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Persiapan

### 1. Import Collection ke Postman

1. Buka aplikasi **Postman**
2. Klik **Import** (tombol di kiri atas atau `Ctrl + O`)
3. Pilih file `Electricity_Bills_API.postman_collection.json`
4. Klik **Import**
5. Collection akan muncul di sidebar kiri dengan nama **"Electricity Bills API"**

### 2. Setup Environment Variables

1. Klik **Environments** di sidebar kiri
2. Klik **+** untuk membuat environment baru, atau gunakan environment yang sudah ada
3. Tambahkan variable berikut:

| Variable | Initial Value | Current Value | Keterangan |
|----------|---------------|---------------|------------|
| `base_url` | `http://localhost:3000` | `http://localhost:3000` | Base URL API |
| `accessToken` | (kosong) | (akan diisi otomatis) | Token untuk autentikasi |
| `refreshToken` | (kosong) | (akan diisi otomatis) | Token untuk refresh |

4. **PENTING**: Pastikan environment yang dibuat di-**select** (ditandai dengan centang) sebelum menjalankan requests!

### 3. Login Terlebih Dahulu

Sebelum bisa menambahkan bill, Anda perlu login terlebih dahulu karena endpoint Create Bill memerlukan autentikasi.

1. Buka collection **"Electricity Bills API"** → **"Auth"** → **"Login"**
2. Pastikan request body sudah benar:
   ```json
   {
     "email": "Facility management",
     "password": "1234"
   }
   ```
3. Klik **Send**
4. Jika berhasil, `accessToken` dan `refreshToken` akan otomatis tersimpan ke environment variable

---

## 📝 Langkah-langkah Menambahkan Bill

### Step 1: Pastikan Panel dan User Sudah Ada

Sebelum membuat bill baru, pastikan:
- **Panel ID** yang akan digunakan sudah ada di database
- **User ID** yang akan digunakan sudah ada di database

#### Cara Mengecek Panel yang Tersedia:

1. Buka **"Panel"** → **"Get All Panels"**
2. Klik **Send**
3. Lihat daftar panel yang tersedia, catat **ID** panel yang ingin digunakan

**Contoh Response:**
```json
[
  {
    "id": 1,
    "namePanel": "GL 01",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "namePanel": "GL 02",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Cara Mengecek User yang Tersedia:

1. Buka **"Auth"** → **"Register User"** (jika perlu user baru)
2. Atau gunakan user yang sudah ada dengan ID `1` (default user)

### Step 2: Buka Request Create Electricity Bill

1. Buka collection **"Electricity Bills API"**
2. Buka folder **"Electricity Bills"**
3. Pilih request **"Create Electricity Bill"**

### Step 3: Pastikan Authorization Header

Request ini memerlukan autentikasi. Pastikan:

1. Klik tab **"Authorization"** di request
2. Pilih Type: **"Bearer Token"**
3. Di field Token, masukkan: `{{accessToken}}`
   - Token akan otomatis diambil dari environment variable

**Atau** tambahkan manual di tab **"Headers"**:
```
Key: Authorization
Value: Bearer {{accessToken}}
```

### Step 4: Isi Request Body

Klik tab **"Body"**, pastikan:
- Pilih **"raw"**
- Pilih format **"JSON"**

Masukkan data bill yang ingin dibuat (lihat format di bawah).

### Step 5: Send Request

Klik tombol **"Send"** untuk mengirim request.

---

## 📋 Format Request Body

### Field yang Wajib Diisi

| Field | Tipe Data | Keterangan | Contoh |
|-------|-----------|------------|--------|
| `panelId` | `number` | ID Panel yang sudah ada di database | `1` |
| `userId` | `number` | ID User yang sudah ada di database | `1` |
| `billingMonth` | `string` (ISO Date) | Bulan tagihan dalam format `YYYY-MM-DD` atau ISO string | `"2024-01-01"` atau `"2024-01-01T00:00:00.000Z"` |
| `kwhUse` | `number` | Jumlah penggunaan kWh (harus positif) | `1500.50` |
| `totalBills` | `number` | Total tagihan listrik (harus positif) | `2500000.00` |

### Field yang Optional

| Field | Tipe Data | Keterangan | Default Value |
|-------|-----------|------------|---------------|
| `vaStatus` | `string` | Status VA (opsional) | `undefined` |
| `statusPay` | `string` | Status pembayaran | `"Belum Lunas"` (otomatis dari database) |

### Contoh Request Body Lengkap

```json
{
  "panelId": 1,
  "userId": 1,
  "billingMonth": "2024-01-01",
  "kwhUse": 1500.50,
  "totalBills": 2500000.00,
  "vaStatus": "",
  "statusPay": "Belum Lunas"
}
```

### Contoh Request Body Minimal (Recommended)

Karena `statusPay` akan otomatis di-set ke `"Belum Lunas"` oleh database, Anda bisa mengirim request tanpa field tersebut:

```json
{
  "panelId": 1,
  "userId": 1,
  "billingMonth": "2024-01-01",
  "kwhUse": 1500.50,
  "totalBills": 2500000.00,
  "vaStatus": ""
}
```

---

## 📝 Contoh Request

### Contoh 1: Menambahkan Bill untuk Panel GL 01

**Request Body:**
```json
{
  "panelId": 1,
  "userId": 1,
  "billingMonth": "2024-11-01",
  "kwhUse": 4000,
  "totalBills": 8000000,
  "vaStatus": ""
}
```

**Penjelasan:**
- Panel dengan ID `1` (misalnya "GL 01")
- User dengan ID `1` (user default)
- Bulan tagihan: November 2024
- Penggunaan: 4000 kWh
- Total tagihan: Rp 8.000.000
- VA Status: kosong (optional)

### Contoh 2: Menambahkan Bill dengan Data Lengkap

**Request Body:**
```json
{
  "panelId": 2,
  "userId": 1,
  "billingMonth": "2024-12-01",
  "kwhUse": 2500.75,
  "totalBills": 5000000.50,
  "vaStatus": "Active"
}
```

### Contoh 3: Multiple Bills untuk Bulan Berbeda

Untuk menambahkan beberapa bills sekaligus, jalankan request yang sama beberapa kali dengan data yang berbeda:

**Bill 1 - Januari:**
```json
{
  "panelId": 1,
  "userId": 1,
  "billingMonth": "2024-01-01",
  "kwhUse": 1500,
  "totalBills": 3000000,
  "vaStatus": ""
}
```

**Bill 2 - Februari:**
```json
{
  "panelId": 1,
  "userId": 1,
  "billingMonth": "2024-02-01",
  "kwhUse": 1800,
  "totalBills": 3600000,
  "vaStatus": ""
}
```

---

## ✅ Response yang Diharapkan

### Response Success (Status Code: 201)

```json
{
  "id": 5,
  "panelId": 1,
  "userId": 1,
  "billingMonth": "2024-01-01T00:00:00.000Z",
  "kwhUse": "1500.50",
  "totalBills": "2500000.00",
  "vaStatus": "",
  "statusPay": "Belum Lunas",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "panel": {
    "id": 1,
    "namePanel": "GL 01",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "user": {
    "id": 1,
    "username": "Facility management",
    "email": null,
    "name": null,
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Catatan:**
- Field `id` adalah ID bill yang baru dibuat (simpan untuk keperluan update/delete nanti)
- Field `statusPay` otomatis di-set menjadi `"Belum Lunas"` jika tidak dikirim
- Field `kwhUse` dan `totalBills` akan dikembalikan sebagai string (karena tipe Decimal di Prisma)

### Response Error (Status Code: 400/401/404/500)

**Error: 401 Unauthorized**
```json
{
  "error": "Unauthorized"
}
```
**Solusi:** Pastikan sudah login dan `accessToken` valid.

**Error: 400 Bad Request - Missing Required Field**
```json
{
  "error": "Panel ID must be positive"
}
```
**Solusi:** Cek semua field wajib sudah diisi dengan format yang benar.

**Error: 404 Not Found - Panel/User Not Found**
```json
{
  "error": "Panel not found"
}
```
**Solusi:** Pastikan `panelId` dan `userId` yang digunakan sudah ada di database.

---

## 🔍 Troubleshooting

### ❌ Error: "Connection refused"

**Penyebab:** Server belum running atau port salah.

**Solusi:**
1. Pastikan development server running: `npm run dev`
2. Cek apakah server berjalan di `http://localhost:3000`
3. Cek environment variable `base_url` sudah benar

### ❌ Error: 401 Unauthorized

**Penyebab:** Belum login atau token expired.

**Solusi:**
1. Login ulang menggunakan endpoint **"Login"**
2. Pastikan `accessToken` tersimpan di environment variable
3. Pastikan header `Authorization: Bearer {{accessToken}}` sudah ditambahkan

### ❌ Error: 400 Bad Request - "Panel ID must be positive"

**Penyebab:** Field `panelId` tidak valid (bukan number atau <= 0).

**Solusi:**
- Pastikan `panelId` adalah number positif (misalnya: `1`, bukan `"1"` atau `0`)
- Cek apakah panel dengan ID tersebut ada di database

### ❌ Error: 404 Not Found - "Panel not found"

**Penyebab:** Panel dengan ID yang digunakan tidak ada di database.

**Solusi:**
1. Cek daftar panel yang tersedia menggunakan **"Get All Panels"**
2. Gunakan ID panel yang valid
3. Atau buat panel baru terlebih dahulu menggunakan **"Create Panel"**

### ❌ Error: "kWh usage must be positive" atau "Total bills must be positive"

**Penyebab:** Nilai `kwhUse` atau `totalBills` tidak valid (<= 0).

**Solusi:**
- Pastikan `kwhUse` dan `totalBills` adalah number positif
- Contoh yang benar: `1500.50`, `2000`
- Contoh yang salah: `0`, `-100`, `"1500"` (string)

### ❌ Error: Invalid date format

**Penyebab:** Format `billingMonth` tidak sesuai.

**Solusi:**
- Gunakan format: `"YYYY-MM-DD"` (contoh: `"2024-01-01"`)
- Atau format ISO: `"YYYY-MM-DDTHH:mm:ss.sssZ"` (contoh: `"2024-01-01T00:00:00.000Z"`)
- Pastikan tanggal valid (tidak ada 32 Januari, dll)

---

## 💡 Tips & Best Practices

1. **Simpan Bill ID** setelah create berhasil untuk keperluan update/delete nanti
   - Bill ID akan otomatis tersimpan di environment variable `billId` jika menggunakan collection yang ada

2. **Gunakan Collection Runner** jika perlu menambahkan banyak bills sekaligus
   - Setup CSV file dengan data bills
   - Runner akan otomatis mengirim request untuk setiap baris

3. **Validasi Data Sebelum Send**
   - Pastikan semua field wajib sudah diisi
   - Pastikan tipe data benar (number untuk kwhUse/totalBills, bukan string)
   - Pastikan tanggal valid

4. **Cek Response**
   - Selalu cek status code (harus 201 untuk success)
   - Simpan response untuk dokumentasi atau debugging

5. **Organize dengan Folders**
   - Buat folder terpisah untuk test data production vs development
   - Gunakan environment variables untuk switch antara dev/staging/prod

---

## 📚 Referensi

- [Postman Documentation](https://learning.postman.com/docs/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- Collection File: `Electricity_Bills_API.postman_collection.json`
- API Route: `src/app/api/electricity-bills/route.ts`

---

**Selamat mencoba! 🚀**

Jika ada pertanyaan atau masalah, silakan buka issue di repository atau hubungi tim development.

