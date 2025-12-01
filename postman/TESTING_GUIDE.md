# Testing Guide - Electricity Bills API

## 🎯 Quick Start

1. **Import Collection**: Import file `Electricity_Bills_API.postman_collection.json`
2. **Import Environment**: Import file `Environment_Example.postman_environment.json`
3. **Select Environment**: Pastikan environment "Electricity Bills - Local Development" di-select
4. **Start Server**: Pastikan development server running (`npm run dev`)

## 📋 Testing Checklist

### ✅ Auth Testing

- [ ] **Register User** - Create user baru
- [ ] **Login** - Login dengan email dan password, verify tokens tersimpan
- [ ] **Refresh Token** - Refresh access token
- [ ] **Logout** - Logout dan invalidate token

### ✅ Panel Testing

- [ ] **Get All Panels** - Verify response berisi array panels
- [ ] **Create Panel** - Create panel baru, verify panelId tersimpan
- [ ] **Get Panel by ID** - Get panel menggunakan saved panelId
- [ ] **Update Panel** - Update nama panel
- [ ] **Delete Panel** - Delete panel

### ✅ Electricity Bills Testing

- [ ] **Get All Bills** - Get semua bills
- [ ] **Get Bills with Filters** - Test filter by userId, panelId, billingMonth
- [ ] **Create Electricity Bill** - Create bill baru, verify billId tersimpan
- [ ] **Get Bill by ID** - Get bill menggunakan saved billId
- [ ] **Update Electricity Bill** - Update status/bills
- [ ] **Delete Electricity Bill** - Delete bill

## 🔍 Test Cases

### Test Case 1: Complete CRUD Flow untuk Panel

1. **Create**: POST `/api/panel` dengan `{ "namePanel": "Test Panel CRUD" }`
   - Expected: Status 201, response dengan `id` dan `namePanel`
   
2. **Read**: GET `/api/panel/{id}`
   - Expected: Status 200, response sesuai dengan data yang dibuat
   
3. **Update**: PUT `/api/panel/{id}` dengan `{ "namePanel": "Updated Panel Name" }`
   - Expected: Status 200, `namePanel` ter-update
   
4. **Delete**: DELETE `/api/panel/{id}`
   - Expected: Status 200, message success
   
5. **Verify Delete**: GET `/api/panel/{id}`
   - Expected: Status 404 (Not Found)

### Test Case 2: Complete CRUD Flow untuk Electricity Bills

**Prerequisites**: 
- Panel dengan ID 1 sudah ada
- User dengan ID 1 sudah ada

1. **Create**: POST `/api/electricity-bills`
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
   - Expected: Status 201, response dengan `id`

2. **Read**: GET `/api/electricity-bills/{id}`
   - Expected: Status 200, response sesuai dengan data yang dibuat

3. **Update**: PUT `/api/electricity-bills/{id}`
   ```json
   {
     "statusPay": "Lunas",
     "kwhUse": 2000.00
   }
   ```
   - Expected: Status 200, data ter-update

4. **Filter**: GET `/api/electricity-bills?userId=1&panelId=1`
   - Expected: Status 200, array bills yang sesuai filter

5. **Delete**: DELETE `/api/electricity-bills/{id}`
   - Expected: Status 200, message success

### Test Case 3: Error Handling

1. **Invalid Panel ID**
   - GET `/api/panel/99999`
   - Expected: Status 404, error message "Panel not found"

2. **Invalid Bill ID**
   - GET `/api/electricity-bills/99999`
   - Expected: Status 404, error message "Electricity bill not found"

3. **Invalid Login**
   - POST `/api/auth/login` dengan password salah
   - Expected: Status 401, error message "Invalid credentials"

4. **Missing Required Fields**
   - POST `/api/panel` tanpa `namePanel`
   - Expected: Status 400/500, validation error

5. **Invalid Foreign Key**
   - POST `/api/electricity-bills` dengan `panelId` yang tidak ada
   - Expected: Status 404, error message "Panel not found"

## 🧪 Automated Tests in Postman

Collection sudah dilengkapi dengan automated tests untuk:
- ✅ Status code verification
- ✅ Response structure validation
- ✅ Auto-save tokens ke environment variables
- ✅ Auto-save IDs ke environment variables

### View Test Results

Setelah menjalankan request:
1. Klik tab **Test Results** di response panel
2. Lihat semua assertions yang pass/fail
3. Check console untuk logs

## 📊 Sample Data untuk Testing

### User Credentials (dari database setup)
- **Username/Email**: `Facility management`
- **Password**: `1234`

- **Username/Email**: `student hausing`
- **Password**: `1234`

### Sample Panel Data
```json
{
  "namePanel": "GL 01"
}
```

### Sample Electricity Bill Data
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

## 🚀 Collection Runner

Untuk menjalankan semua tests sekaligus:

1. Klik **Collection** → **Run**
2. Pilih requests yang ingin di-test
3. Atur execution order (drag & drop)
4. Klik **Run Electricity Bills API**
5. Lihat test results summary

## 💡 Tips

1. **Save Responses**: Save response sebagai example untuk dokumentasi
2. **Use Folders**: Request sudah dikelompokkan berdasarkan feature
3. **Environment Variables**: Token dan ID otomatis tersimpan setelah operations
4. **Pre-request Scripts**: Bisa ditambahkan untuk setup data sebelum request
5. **Variables**: Ubah `{{base_url}}` jika testing di environment lain

## 📝 Notes

- Base URL default: `http://localhost:3000`
- Semua endpoint tidak memerlukan authentication (bisa ditambahkan nanti)
- Dates format: `YYYY-MM-DD` atau ISO string
- Numbers: Decimal untuk `kwhUse` dan `totalBills`

