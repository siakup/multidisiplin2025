# Postman Collection untuk Electricity Bills API

## 📦 File Collection

File: `Electricity_Bills_API.postman_collection.json`

## 🚀 Cara Import ke Postman

1. Buka aplikasi **Postman**
2. Klik **Import** (tombol di kiri atas)
3. Pilih file `Electricity_Bills_API.postman_collection.json`
4. Klik **Import**
5. Collection akan muncul di sidebar kiri

## ⚙️ Setup Environment Variables

Setelah import, buat Environment baru atau edit environment yang ada:

1. Klik **Environments** di sidebar kiri
2. Buat environment baru atau edit existing
3. Tambahkan variable berikut:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:3000` | `http://localhost:3000` |
| `accessToken` | (kosong) | (akan diisi otomatis setelah login) |
| `refreshToken` | (kosong) | (akan diisi otomatis setelah login) |
| `panelId` | `1` | `1` |
| `billId` | `1` | `1` |

**PENTING**: Pastikan environment yang dibuat di-select sebelum menjalankan requests!

## 📋 Endpoints yang Tersedia

### 🔐 Auth Endpoints

1. **Register User**
   - `POST /api/auth/register`
   - Body: `{ "email": "test@example.com", "password": "123456", "name": "Test User" }`

2. **Login**
   - `POST /api/auth/login`
   - Body: `{ "email": "Facility management", "password": "1234" }`
   - Response: Mengembalikan `accessToken` dan `refreshToken` (otomatis disimpan ke environment)

3. **Refresh Token**
   - `POST /api/auth/refresh`
   - Body: `{ "refreshToken": "{{refreshToken}}" }`

4. **Logout**
   - `POST /api/auth/logout`
   - Header: `Authorization: Bearer {{refreshToken}}`

### 🔌 Panel Endpoints

1. **Get All Panels**
   - `GET /api/panel`
   - Mendapatkan semua panel

2. **Create Panel**
   - `POST /api/panel`
   - Body: `{ "namePanel": "Test Panel 01" }`
   - Response: Mengembalikan panel dengan ID (otomatis disimpan ke `panelId`)

3. **Get Panel by ID**
   - `GET /api/panel/{{panelId}}`

4. **Update Panel**
   - `PUT /api/panel/{{panelId}}`
   - Body: `{ "namePanel": "Updated Panel Name" }`

5. **Delete Panel**
   - `DELETE /api/panel/{{panelId}}`

### ⚡ Electricity Bills Endpoints

1. **Get All Bills**
   - `GET /api/electricity-bills`
   - Mendapatkan semua electricity bills

2. **Get Bills with Filters**
   - `GET /api/electricity-bills?userId=1&panelId=1&billingMonth=2024-01-01`
   - Query params:
     - `userId` (optional): Filter by user ID
     - `panelId` (optional): Filter by panel ID
     - `billingMonth` (optional): Filter by billing month (YYYY-MM-DD)

3. **Create Electricity Bill**
   - `POST /api/electricity-bills`
   - Body:
     ```json
     {
       "panelId": 1,
       "userId": 1,
       "billingMonth": "2024-01-01",
       "kwhUse": 1500.50,
       "totalBills": 2500000.00,
       "statusPay": "Belum Lunas",
       "vaStatus": "Active"
     }
     ```
   - Response: Mengembalikan bill dengan ID (otomatis disimpan ke `billId`)

4. **Get Bill by ID**
   - `GET /api/electricity-bills/{{billId}}`

5. **Update Electricity Bill**
   - `PUT /api/electricity-bills/{{billId}}`
   - Body (semua field optional):
     ```json
     {
       "kwhUse": 2000.00,
       "totalBills": 3000000.00,
       "statusPay": "Lunas",
       "vaStatus": "Inactive"
     }
     ```

6. **Delete Electricity Bill**
   - `DELETE /api/electricity-bills/{{billId}}`

## 🧪 Automated Tests

Beberapa request sudah memiliki automated tests yang akan:
- Verify status codes
- Extract dan simpan tokens ke environment variables
- Extract dan simpan IDs untuk request berikutnya

## 📝 Contoh Testing Flow

### 1. Setup Awal
1. Pastikan server running: `npm run dev`
2. Pastikan database sudah setup dengan data initial

### 2. Test Auth Flow
1. **Register User** → Dapat user ID
2. **Login** → Dapat accessToken & refreshToken (otomatis tersimpan)
3. **Refresh Token** → Dapat accessToken baru
4. **Logout** → Invalidate token

### 3. Test Panel Flow
1. **Get All Panels** → Lihat daftar panel
2. **Create Panel** → Panel ID otomatis tersimpan
3. **Get Panel by ID** → Verifikasi data
4. **Update Panel** → Update nama panel
5. **Delete Panel** → Hapus panel

### 4. Test Electricity Bills Flow
1. **Get All Bills** → Lihat semua bills
2. **Get Bills with Filters** → Filter by user/panel/month
3. **Create Electricity Bill** → Bill ID otomatis tersimpan
4. **Get Bill by ID** → Verifikasi data
5. **Update Electricity Bill** → Update status/bills
6. **Delete Electricity Bill** → Hapus bill

## 🔧 Customization

### Mengubah Base URL

Edit variable `base_url` di environment:
- Development: `http://localhost:3000`
- Production: `https://your-domain.com`

### Menambahkan Authorization Header

Untuk request yang memerlukan auth, tambahkan header:
```
Authorization: Bearer {{accessToken}}
```

## 📌 Tips

1. **Gunakan Collection Runner** untuk menjalankan semua requests secara berurutan
2. **Save responses** untuk referensi nanti
3. **Update environment variables** setelah create operations untuk mendapatkan ID yang benar
4. **Gunakan Pre-request Script** jika perlu setup data sebelum request

## 🐛 Troubleshooting

### Error: Connection refused
- Pastikan development server running (`npm run dev`)
- Cek apakah port 3000 tidak digunakan aplikasi lain

### Error: 404 Not Found
- Pastikan base_url benar
- Pastikan endpoint path sesuai dengan route di Next.js

### Error: 401 Unauthorized
- Pastikan sudah login dan accessToken valid
- Refresh token jika perlu

### Error: 400 Bad Request
- Cek body request format JSON
- Pastikan semua required fields diisi
- Cek data types (number, string, date)

## 📚 Dokumentasi API Lengkap

Untuk dokumentasi lengkap setiap endpoint, lihat:
- `src/app/api/auth/*/route.ts`
- `src/app/api/panel/*/route.ts`
- `src/app/api/electricity-bills/*/route.ts`

