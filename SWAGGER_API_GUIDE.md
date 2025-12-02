# 📚 Panduan Lengkap API Documentation - Electricity Bills System

## 📖 Daftar Isi

1. [Pengenalan](#pengenalan)
2. [Cara Mengakses Swagger UI](#cara-mengakses-swagger-ui)
3. [Autentikasi](#autentikasi)
4. [Endpoints](#endpoints)
5. [Schema & Models](#schema--models)
6. [Contoh Penggunaan](#contoh-penggunaan)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Pengenalan

API Documentation ini dibangun menggunakan **OpenAPI 3.0** (Swagger) dan menyediakan interface interaktif untuk testing semua endpoint API sistem Electricity Bills.

### Fitur Utama:
- ✅ Dokumentasi lengkap untuk semua endpoints
- ✅ Try it out - test langsung dari browser
- ✅ Schema validation
- ✅ Examples untuk request dan response
- ✅ Authentication flow yang jelas
- ✅ Filter dan query parameters

---

## 🌐 Cara Mengakses Swagger UI

### 1. Jalankan Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000` (atau port lain jika 3000 sedang digunakan)

### 2. Buka Swagger UI

Akses di browser:
```
http://localhost:3000/docs
```

### 3. Akses Raw OpenAPI JSON

Untuk mendapatkan specification dalam format JSON:
```
http://localhost:3000/api/docs/swagger.json
```

---

## 🔐 Autentikasi

### JWT Bearer Authentication

Sistem menggunakan JWT (JSON Web Token) untuk autentikasi. Token diperoleh dari endpoint login/register.

### Flow Autentikasi:

```
1. POST /api/auth/login atau /api/auth/register
   ↓
2. Dapatkan accessToken dan refreshToken
   ↓
3. Klik tombol "Authorize" di Swagger UI
   ↓
4. Masukkan: Bearer <accessToken>
   ↓
5. Gunakan endpoint yang memerlukan auth
```

### Credential Default untuk Testing:

| Field | Value |
|-------|-------|
| Username/Email | `Facility management` |
| Password | `1234` |
| Role | Facility management |

**Role ini memiliki akses penuh ke semua endpoint.**

### Token Lifecycle:

- **Access Token**: Digunakan untuk autentikasi API calls, expired dalam waktu tertentu
- **Refresh Token**: Digunakan untuk mendapatkan access token baru tanpa login ulang
- Gunakan endpoint `/api/auth/refresh` untuk refresh token

---

## 📡 Endpoints

### 1️⃣ Authentication Endpoints

#### POST /api/auth/register
Mendaftarkan user baru.

**Request Body:**
```json
{
  "email": "test@example.com",      // Opsional jika username diisi
  "username": "testuser",            // Opsional jika email diisi
  "password": "123456",              // Required
  "name": "Test User"                // Opsional
}
```

**Response (201):**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "username": "testuser",
    "name": "Test User",
    "role": "User"
  }
}
```

#### POST /api/auth/login
Login dengan email atau username.

**Request Body:**
```json
{
  "email": "Facility management",    // Bisa berisi email atau username
  "password": "1234"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": null,
    "username": "Facility management",
    "name": "Facility Management",
    "role": "Facility management"
  }
}
```

#### POST /api/auth/refresh
Refresh access token menggunakan refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGc...",      // Token baru
  "refreshToken": "eyJhbGc..."      // Token baru
}
```

#### POST /api/auth/logout
Logout dan invalidate refresh token.

**Headers:**
```
Authorization: Bearer <refresh_token>
```

**Response (200):**
```json
{
  "message": "Logged out"
}
```

**⚠️ Catatan:** Gunakan refresh token di Authorization header, bukan access token!

---

### 2️⃣ Panel Endpoints

#### GET /api/panel
Mendapatkan semua panel.

**Auth:** Tidak diperlukan

**Response (200):**
```json
[
  {
    "id": 1,
    "namePanel": "Test Panel 01",
    "createdAt": "2024-01-01T10:30:00.000Z",
    "updatedAt": "2024-01-01T10:30:00.000Z"
  },
  {
    "id": 2,
    "namePanel": "Panel A",
    "createdAt": "2024-01-02T11:00:00.000Z",
    "updatedAt": "2024-01-02T11:00:00.000Z"
  }
]
```

#### POST /api/panel
Membuat panel baru.

**Auth:** Required (Bearer Token)

**Request Body:**
```json
{
  "namePanel": "Test Panel 01"
}
```

**Response (201):**
```json
{
  "id": 1,
  "namePanel": "Test Panel 01",
  "createdAt": "2024-01-01T10:30:00.000Z",
  "updatedAt": "2024-01-01T10:30:00.000Z"
}
```

#### GET /api/panel/{id}
Mendapatkan panel berdasarkan ID.

**Auth:** Tidak diperlukan

**Path Parameters:**
- `id` (integer) - Panel ID

**Response (200):**
```json
{
  "id": 1,
  "namePanel": "Test Panel 01",
  "createdAt": "2024-01-01T10:30:00.000Z",
  "updatedAt": "2024-01-01T10:30:00.000Z"
}
```

#### PUT /api/panel/{id}
Update panel berdasarkan ID.

**Auth:** Required (Bearer Token)

**Path Parameters:**
- `id` (integer) - Panel ID

**Request Body:**
```json
{
  "namePanel": "Updated Panel Name"
}
```

**Response (200):**
```json
{
  "id": 1,
  "namePanel": "Updated Panel Name",
  "createdAt": "2024-01-01T10:30:00.000Z",
  "updatedAt": "2024-01-01T15:45:00.000Z"
}
```

#### DELETE /api/panel/{id}
Menghapus panel berdasarkan ID.

**Auth:** Required (Bearer Token)

**Path Parameters:**
- `id` (integer) - Panel ID

**Response (200):**
```json
{
  "message": "Panel deleted successfully"
}
```

---

### 3️⃣ Electricity Bills Endpoints

#### GET /api/electricity-bills
Mendapatkan semua tagihan listrik dengan filter opsional.

**Auth:** Required (Bearer Token) - Facility Management Only

**Query Parameters (Opsional):**
- `userId` (integer) - Filter by user ID
- `panelId` (integer) - Filter by panel ID
- `billingMonth` (string) - Filter by billing month (format: YYYY-MM-DD)

**Contoh Request:**
```
GET /api/electricity-bills?userId=1&panelId=1&billingMonth=2024-01-01
```

**Response (200):**
```json
[
  {
    "id": 1,
    "panelId": 1,
    "userId": 1,
    "billingMonth": "2024-01-01T00:00:00.000Z",
    "kwhUse": 1500.5,
    "vaStatus": "",
    "totalBills": 2500000.0,
    "statusPay": "Belum Lunas",
    "panel": {
      "id": 1,
      "namePanel": "Test Panel 01",
      "createdAt": "2024-01-01T10:30:00.000Z",
      "updatedAt": "2024-01-01T10:30:00.000Z"
    },
    "createdAt": "2024-01-15T08:20:00.000Z",
    "updatedAt": "2024-01-15T08:20:00.000Z"
  }
]
```

#### POST /api/electricity-bills
Membuat tagihan listrik baru.

**Auth:** Required (Bearer Token) - Facility Management Only

**Request Body:**
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

**⚠️ Catatan Penting:**
- `statusPay` tidak perlu dikirim, otomatis "Belum Lunas"
- Pastikan `panelId` dan `userId` sudah ada di database
- Format `billingMonth`: YYYY-MM-DD
- `kwhUse` dan `totalBills` gunakan angka desimal

**Response (201):**
```json
{
  "id": 1,
  "panelId": 1,
  "userId": 1,
  "billingMonth": "2024-01-01T00:00:00.000Z",
  "kwhUse": 1500.5,
  "vaStatus": "",
  "totalBills": 2500000.0,
  "statusPay": "Belum Lunas",
  "createdAt": "2024-01-15T08:20:00.000Z",
  "updatedAt": "2024-01-15T08:20:00.000Z"
}
```

#### GET /api/electricity-bills/{id}
Mendapatkan tagihan berdasarkan ID.

**Auth:** Tidak diperlukan

**Path Parameters:**
- `id` (integer) - Bill ID

**Response (200):**
```json
{
  "id": 1,
  "panelId": 1,
  "userId": 1,
  "billingMonth": "2024-01-01T00:00:00.000Z",
  "kwhUse": 1500.5,
  "vaStatus": "",
  "totalBills": 2500000.0,
  "statusPay": "Belum Lunas",
  "panel": {
    "id": 1,
    "namePanel": "Test Panel 01",
    "createdAt": "2024-01-01T10:30:00.000Z",
    "updatedAt": "2024-01-01T10:30:00.000Z"
  },
  "createdAt": "2024-01-15T08:20:00.000Z",
  "updatedAt": "2024-01-15T08:20:00.000Z"
}
```

#### PUT /api/electricity-bills/{id}
Update tagihan berdasarkan ID.

**Auth:** Tidak diperlukan

**Path Parameters:**
- `id` (integer) - Bill ID

**Request Body (Semua field opsional):**
```json
{
  "kwhUse": 2000.00,
  "totalBills": 3000000.00,
  "statusPay": "Lunas",
  "vaStatus": "Inactive"
}
```

**Catatan:** Hanya field yang dikirim yang akan di-update.

**Response (200):**
```json
{
  "id": 1,
  "panelId": 1,
  "userId": 1,
  "billingMonth": "2024-01-01T00:00:00.000Z",
  "kwhUse": 2000.0,
  "vaStatus": "Inactive",
  "totalBills": 3000000.0,
  "statusPay": "Lunas",
  "createdAt": "2024-01-15T08:20:00.000Z",
  "updatedAt": "2024-01-15T14:30:00.000Z"
}
```

#### DELETE /api/electricity-bills/{id}
Menghapus tagihan berdasarkan ID.

**Auth:** Tidak diperlukan

**Path Parameters:**
- `id` (integer) - Bill ID

**Response (200):**
```json
{
  "message": "Electricity bill deleted successfully"
}
```

---

## 📋 Schema & Models

### User Schema
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username123",
  "name": "John Doe",
  "role": "User",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Panel Schema
```json
{
  "id": 1,
  "namePanel": "Test Panel 01",
  "createdAt": "2024-01-01T10:30:00.000Z",
  "updatedAt": "2024-01-01T10:30:00.000Z"
}
```

### Electricity Bill Schema
```json
{
  "id": 1,
  "panelId": 1,
  "userId": 1,
  "billingMonth": "2024-01-01T00:00:00.000Z",
  "kwhUse": 1500.5,
  "vaStatus": "",
  "totalBills": 2500000.0,
  "statusPay": "Belum Lunas",
  "panel": { /* Panel Object */ },
  "createdAt": "2024-01-15T08:20:00.000Z",
  "updatedAt": "2024-01-15T08:20:00.000Z"
}
```

### Error Response Schema
```json
{
  "error": "Error message here"
}
```

### Success Message Schema
```json
{
  "message": "Success message here"
}
```

---

## 💡 Contoh Penggunaan

### Skenario 1: Create Complete Flow

```
1. Login dengan Facility management / 1234
   POST /api/auth/login
   
2. Authorize dengan accessToken
   Click "Authorize" button
   
3. Create Panel
   POST /api/panel
   Body: {"namePanel": "Test Panel 01"}
   
4. Create Electricity Bill
   POST /api/electricity-bills
   Body: {
     "panelId": 1,
     "userId": 1,
     "billingMonth": "2024-01-01",
     "kwhUse": 1500.50,
     "totalBills": 2500000.00,
     "vaStatus": ""
   }
   
5. List Bills dengan Filter
   GET /api/electricity-bills?userId=1&panelId=1
   
6. Update Bill Status
   PUT /api/electricity-bills/1
   Body: {"statusPay": "Lunas"}
```

### Skenario 2: Testing dengan User Baru

```
1. Register User Baru
   POST /api/auth/register
   Body: {
     "email": "newuser@test.com",
     "password": "123456",
     "name": "New User"
   }
   
2. Authorize dengan token
   
3. Try Create Panel
   POST /api/panel
   (Akan berhasil jika user punya akses)
   
4. Try Create Bill
   POST /api/electricity-bills
   (Mungkin gagal jika bukan Facility management)
```

---

## 🔧 Troubleshooting

### Problem 1: 401 Unauthorized

**Penyebab:**
- Token tidak valid atau expired
- Belum authorize
- Salah memasukkan token

**Solusi:**
1. Login ulang untuk dapatkan token baru
2. Pastikan format: `Bearer <token>` (ada spasi setelah Bearer)
3. Klik tombol "Authorize" dan paste token lengkap

---

### Problem 2: 400 Bad Request - Validation Error

**Penyebab:**
- Data tidak lengkap
- Format data salah
- Field required tidak diisi

**Solusi:**
1. Periksa semua field required sudah terisi
2. Periksa format date: YYYY-MM-DD
3. Periksa tipe data (number untuk kwhUse, totalBills)
4. Lihat example di Swagger UI

---

### Problem 3: 404 Not Found

**Penyebab:**
- ID tidak ada di database
- Resource sudah dihapus

**Solusi:**
1. List dulu untuk mendapatkan ID yang valid
2. Periksa apakah resource masih ada
3. Gunakan ID yang benar di path parameter

---

### Problem 4: 403 Forbidden

**Penyebab:**
- User tidak punya akses ke endpoint
- Role tidak sesuai

**Solusi:**
1. Gunakan credential Facility management untuk testing
2. Periksa role user yang login
3. Beberapa endpoint hanya bisa diakses role tertentu

---

### Problem 5: Server Tidak Bisa Diakses

**Penyebab:**
- Server tidak jalan
- Port berbeda
- Network error

**Solusi:**
1. Pastikan server sudah jalan: `npm run dev`
2. Periksa port yang digunakan di terminal
3. Akses dengan port yang benar: `http://localhost:<port>/docs`

---

## 📝 Catatan Penting

### Role & Permissions

| Endpoint | Public | Authenticated | Facility Management |
|----------|--------|---------------|-------------------|
| GET /api/panel | ✅ | ✅ | ✅ |
| POST /api/panel | ❌ | ✅ | ✅ |
| GET /api/panel/{id} | ✅ | ✅ | ✅ |
| PUT /api/panel/{id} | ❌ | ✅ | ✅ |
| DELETE /api/panel/{id} | ❌ | ✅ | ✅ |
| GET /api/electricity-bills | ❌ | ❌ | ✅ |
| POST /api/electricity-bills | ❌ | ❌ | ✅ |
| GET /api/electricity-bills/{id} | ✅ | ✅ | ✅ |
| PUT /api/electricity-bills/{id} | ✅ | ✅ | ✅ |
| DELETE /api/electricity-bills/{id} | ✅ | ✅ | ✅ |

### Best Practices

1. **Selalu gunakan HTTPS di production**
2. **Simpan token dengan aman** (jangan commit ke git)
3. **Refresh token sebelum expired**
4. **Logout saat selesai testing**
5. **Gunakan filter untuk optimasi query**
6. **Validasi data di client sebelum kirim**

---

## 🎓 Resources

- **Postman Collection**: `postman/Electricity_Bills_API.postman_collection.json`
- **Quick Start Guide**: `QUICK_START_SWAGGER.md`
- **OpenAPI Spec**: `http://localhost:3000/api/docs/swagger.json`

---

## 📞 Support

Jika menemukan bug atau butuh bantuan, silakan hubungi API Support team.

---

**Last Updated**: December 2, 2025  
**Version**: 1.0.0  
**API Base URL**: `http://localhost:3000`
