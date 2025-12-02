# Quick Start - Testing Swagger API Documentation

## 1. Jalankan Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000` (atau port lain jika 3000 sudah digunakan).

## 2. Buka Swagger UI

Buka browser dan kunjungi:

```
http://localhost:3000/docs
```

Atau jika menggunakan port lain (misalnya 3001):

```
http://localhost:3001/docs
```

## 3. Testing API Endpoints

### A. Gunakan Credential Default (Recommended untuk Testing Cepat)

**Credential Default:**
- **Username/Email**: `Facility management`
- **Password**: `1234`
- **Role**: Facility management (memiliki akses penuh)

Langkah-langkah:
1. Buka endpoint **POST /api/auth/login**
2. Klik **"Try it out"**
3. Isi request body:
   ```json
   {
     "email": "Facility management",
     "password": "1234"
   }
   ```
4. Klik **"Execute"**
5. Copy `accessToken` dari response (lihat di Response body)
6. Lanjut ke **Section C** untuk Authorize

### B. Register User Baru (Opsional)

Jika ingin membuat user baru:

1. Buka endpoint **POST /api/auth/register**
2. Klik **"Try it out"**
3. Isi request body (pilih salah satu):
   
   **Dengan Email:**
   ```json
   {
     "email": "test@example.com",
     "password": "123456",
     "name": "Test User"
   }
   ```
   
   **Dengan Username:**
   ```json
   {
     "username": "testuser",
     "password": "123456",
     "name": "Test User"
   }
   ```
   
   **Dengan Keduanya:**
   ```json
   {
     "email": "test@example.com",
     "username": "testuser",
     "password": "123456",
     "name": "Test User"
   }
   ```
4. Klik **"Execute"**
5. Copy `accessToken` dari response
6. Lanjut ke **Section C** untuk Authorize

**Catatan:** User baru akan memiliki role default, mungkin tidak bisa mengakses semua endpoint. Gunakan credential Facility management untuk testing lengkap.

### C. Authorize dengan Token

1. Klik tombol **"Authorize"** di bagian atas Swagger UI (ikon gembok)
2. Masukkan: `Bearer <your_access_token>`
   - Contoh: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. Klik **"Authorize"**
4. Klik **"Close"**

### D. Test Protected Endpoints

Setelah authorize, Anda dapat mencoba endpoint yang memerlukan autentikasi:

#### 1. List Panels (Public - No Auth)
1. Endpoint **GET /api/panel**
2. Klik **"Try it out"** dan **"Execute"**
3. Akan menampilkan semua panel yang tersedia

#### 2. Create Panel (Requires Auth)
1. Endpoint **POST /api/panel**
2. Klik **"Try it out"**
3. Request body:
   ```json
   {
     "namePanel": "Test Panel 01"
   }
   ```
4. Klik **"Execute"**
5. **Simpan `id` dari response** untuk digunakan di testing selanjutnya

#### 3. Get Panel by ID
1. Endpoint **GET /api/panel/{id}**
2. Klik **"Try it out"**
3. Isi parameter `id` dengan ID panel yang didapat dari step sebelumnya
4. Klik **"Execute"**

#### 4. Update Panel (Requires Auth)
1. Endpoint **PUT /api/panel/{id}**
2. Klik **"Try it out"**
3. Isi parameter `id` dengan ID panel
4. Request body:
   ```json
   {
     "namePanel": "Updated Panel Name"
   }
   ```
5. Klik **"Execute"**

#### 5. Create Electricity Bill (Requires Auth - Facility Management Only)
1. Endpoint **POST /api/electricity-bills**
2. Klik **"Try it out"**
3. Request body:
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
4. Klik **"Execute"**
5. **Simpan `id` dari response** untuk testing selanjutnya

**Catatan Penting:**
- `statusPay` tidak perlu dikirim, otomatis akan di-set "Belum Lunas"
- Pastikan `panelId` dan `userId` sudah ada di database
- Format `billingMonth`: YYYY-MM-DD
- `kwhUse` dan `totalBills` gunakan angka desimal

#### 6. List Electricity Bills (Requires Auth - Facility Management Only)
1. Endpoint **GET /api/electricity-bills**
2. Klik **"Try it out"**
3. Tanpa filter - klik **"Execute"** langsung
4. Atau dengan filter:
   - `userId`: 1
   - `panelId`: 1  
   - `billingMonth`: 2024-01-01
5. Klik **"Execute"**

#### 7. Get Electricity Bill by ID
1. Endpoint **GET /api/electricity-bills/{id}**
2. Klik **"Try it out"**
3. Isi parameter `id` dengan ID bill yang didapat dari step sebelumnya
4. Klik **"Execute"**

#### 8. Update Electricity Bill
1. Endpoint **PUT /api/electricity-bills/{id}**
2. Klik **"Try it out"**
3. Isi parameter `id` dengan ID bill
4. Request body (update hanya field tertentu):
   ```json
   {
     "kwhUse": 2000.00,
     "totalBills": 3000000.00,
     "statusPay": "Lunas",
     "vaStatus": "Inactive"
   }
   ```
5. Klik **"Execute"**

#### 9. Delete Electricity Bill (Requires Auth)
1. Endpoint **DELETE /api/electricity-bills/{id}**
2. Klik **"Try it out"**
3. Isi parameter `id` dengan ID bill
4. Klik **"Execute"**

#### 10. Delete Panel (Requires Auth)
1. Endpoint **DELETE /api/panel/{id}**
2. Klik **"Try it out"**
3. Isi parameter `id` dengan ID panel
4. Klik **"Execute"**

#### 11. Logout
1. Endpoint **POST /api/auth/logout**
2. **PENTING:** Logout menggunakan refresh token, bukan access token
3. Jika menggunakan Authorize button, logout mungkin gagal
4. Untuk logout, copy `refreshToken` dari response login
5. Klik **"Execute"**

#### 12. Refresh Token
1. Endpoint **POST /api/auth/refresh**
2. Klik **"Try it out"**
3. Request body:
   ```json
   {
     "refreshToken": "paste_refresh_token_here"
   }
   ```
4. Klik **"Execute"**
5. Copy `accessToken` baru dan gunakan untuk Authorize lagi

## 4. Mengakses Raw Swagger JSON

Untuk mendapatkan OpenAPI specification dalam format JSON:

```
http://localhost:3000/api/docs/swagger.json
```

## 5. Error Handling

### Common Errors:

| Status Code | Error | Solusi |
|------------|-------|---------|
| **401 Unauthorized** | Token expired atau tidak valid | Login ulang dan dapatkan token baru |
| **401 Unauthorized** | Missing or invalid token | Pastikan sudah klik **Authorize** dan masukkan token |
| **400 Bad Request** | Validation error / data tidak lengkap | Periksa format request body, pastikan semua field required terisi |
| **404 Not Found** | Resource tidak ditemukan | Periksa ID yang digunakan, pastikan resource sudah ada di database |
| **403 Forbidden** | Tidak punya akses | Gunakan user dengan role yang sesuai (Facility management) |
| **500 Internal Server Error** | Server error | Periksa console server untuk detail error |

### Contoh Response Error:

```json
{
  "error": "Invalid credentials"
}
```

```json
{
  "error": "Panel not found"
}
```

```json
{
  "error": "Validation error: namePanel is required"
}
```

## 6. Tips Testing

### Best Practices:

1. **Gunakan Credential Default**
   - Untuk testing cepat, gunakan `Facility management` / `1234`
   - User ini memiliki akses penuh ke semua endpoint

2. **Test Sequence yang Benar**
   ```
   Login → Authorize → Create Panel → Create Bill → List Bills → Update → Delete
   ```

3. **Simpan Data Penting**
   - Simpan `accessToken` ke notepad atau text editor
   - Simpan `refreshToken` untuk refresh token
   - Simpan ID dari response create untuk testing update/delete

4. **Periksa Response**
   - Status code 200/201 = Success
   - Status code 400/401/404 = Error, baca pesan error
   - Periksa response body untuk data yang dikembalikan

5. **Gunakan Examples**
   - Swagger UI menyediakan contoh request untuk setiap endpoint
   - Pilih example yang sesuai di dropdown

6. **Filter Query Parameters**
   - Semua filter di GET requests bersifat opsional
   - Kosongkan parameter yang tidak digunakan
   - Gunakan format date yang benar: YYYY-MM-DD

7. **Debugging**
   - Buka Developer Console (F12) untuk melihat network request
   - Periksa terminal server untuk log error
   - Gunakan Postman jika Swagger UI bermasalah

## 7. Testing dengan Postman (Alternatif)

Jika lebih nyaman menggunakan Postman, sudah tersedia collection di folder `postman/`:

```
postman/Electricity_Bills_API.postman_collection.json
```

Import collection ini ke Postman untuk testing dengan environment variables yang sudah di-setup.

## File yang Telah Dibuat/Diupdate

✅ `src/app/api/docs/swagger.json/route.ts` - API route untuk generate Swagger JSON
✅ `src/app/docs/page.tsx` - Page untuk menampilkan Swagger UI (sudah ada)
✅ `src/lib/swagger.config.ts` - Konfigurasi Swagger dengan schemas (sudah ada)
✅ Semua API routes telah ditambahkan JSDoc Swagger documentation:
   - `src/app/api/auth/login/route.ts`
   - `src/app/api/auth/register/route.ts`
   - `src/app/api/auth/logout/route.ts`
   - `src/app/api/auth/refresh/route.ts`
   - `src/app/api/panel/route.ts`
   - `src/app/api/panel/[id]/route.ts`
   - `src/app/api/electricity-bills/route.ts`
   - `src/app/api/electricity-bills/[id]/route.ts`

## Dokumentasi Lengkap

Untuk dokumentasi lengkap, lihat: **SWAGGER_DOCUMENTATION.md**
