# Swagger API Documentation

Dokumentasi API untuk sistem Electricity Bills menggunakan Swagger/OpenAPI 3.0.

## Cara Mengakses Dokumentasi

### 1. Menjalankan Development Server

Pastikan server development berjalan:

```bash
npm run dev
```

### 2. Membuka Swagger UI

Buka browser dan akses:

```
http://localhost:3000/docs
```

Atau untuk mengakses JSON spec langsung:

```
http://localhost:3000/api/docs/swagger.json
```

## Struktur API

### Authentication Endpoints

- **POST** `/api/auth/login` - Login user
- **POST** `/api/auth/register` - Register user baru
- **POST** `/api/auth/logout` - Logout user
- **POST** `/api/auth/refresh` - Refresh access token

### Panel Endpoints

- **GET** `/api/panel` - List semua panel
- **POST** `/api/panel` - Buat panel baru (requires auth)
- **GET** `/api/panel/{id}` - Get panel by ID
- **PUT** `/api/panel/{id}` - Update panel (requires auth)
- **DELETE** `/api/panel/{id}` - Delete panel (requires auth)

### Electricity Bills Endpoints

- **GET** `/api/electricity-bills` - List semua tagihan (requires auth)
  - Query params: `userId`, `panelId`, `billingMonth`
- **POST** `/api/electricity-bills` - Buat tagihan baru (requires auth)
- **GET** `/api/electricity-bills/{id}` - Get tagihan by ID
- **PUT** `/api/electricity-bills/{id}` - Update tagihan
- **DELETE** `/api/electricity-bills/{id}` - Delete tagihan

## Autentikasi

API menggunakan JWT Bearer Token untuk autentikasi.

### Cara Menggunakan Token di Swagger UI

1. Klik tombol **"Authorize"** di bagian atas Swagger UI
2. Masukkan token dalam format: `Bearer <your_token>`
3. Klik **"Authorize"** dan **"Close"**

### Mendapatkan Token

1. Gunakan endpoint `/api/auth/login` dengan kredensial:
   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```
2. Copy `accessToken` dari response
3. Gunakan token untuk authorize di Swagger UI

## Menambahkan Dokumentasi ke Endpoint Baru

Untuk menambahkan dokumentasi Swagger ke endpoint baru, gunakan JSDoc dengan format berikut:

```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   get:
 *     tags:
 *       - Your Tag
 *     summary: Brief description
 *     description: Detailed description
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID parameter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/YourSchema'
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YourResponseSchema'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(req: NextRequest) {
  // Your implementation
}
```

## Menambahkan Schema Baru

Schema didefinisikan di `src/lib/swagger.config.ts` dalam section `components.schemas`.

Contoh menambahkan schema baru:

```typescript
YourNewSchema: {
  type: 'object',
  required: ['field1', 'field2'],
  properties: {
    field1: {
      type: 'string',
      description: 'Description of field1',
      example: 'Example value',
    },
    field2: {
      type: 'integer',
      description: 'Description of field2',
      example: 123,
    },
  },
},
```

## Dependencies

Package yang digunakan untuk Swagger:

- `swagger-jsdoc` - Generate OpenAPI spec dari JSDoc comments
- `swagger-ui-react` - React component untuk Swagger UI
- `yamljs` - YAML parser (optional)

## Troubleshooting

### Swagger UI tidak muncul

1. Pastikan server development berjalan
2. Clear browser cache
3. Periksa console browser untuk error
4. Pastikan semua dependencies terinstall: `npm install`

### Endpoint tidak muncul di Swagger

1. Pastikan JSDoc comment dimulai dengan `@swagger`
2. Pastikan path pattern di `swagger.config.ts` mencakup file route Anda
3. Restart development server

### Token tidak bekerja

1. Pastikan format token adalah `Bearer <token>` (dengan spasi)
2. Pastikan token belum expired
3. Generate token baru dengan login

## Best Practices

1. **Selalu tambahkan dokumentasi** untuk setiap endpoint baru
2. **Gunakan schema reference** (`$ref`) untuk menghindari duplikasi
3. **Dokumentasikan semua response codes** yang mungkin dikembalikan
4. **Tambahkan contoh** di schema untuk memperjelas expected format
5. **Group endpoints** dengan tags yang sesuai
6. **Dokumentasikan security requirements** untuk protected endpoints

## Export/Import Swagger Spec

### Export Swagger JSON

```bash
curl http://localhost:3000/api/docs/swagger.json > swagger-spec.json
```

### Import ke Postman

1. Buka Postman
2. File > Import
3. Pilih file `swagger-spec.json`
4. Collection akan dibuat otomatis

## Referensi

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [swagger-jsdoc Documentation](https://github.com/Surnet/swagger-jsdoc)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
