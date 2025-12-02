import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Electricity Bills API',
      version: '1.0.0',
      description: `
# API Documentation untuk Sistem Manajemen Tagihan Listrik

API ini menyediakan endpoints untuk mengelola tagihan listrik, panel, dan autentikasi user.

## Autentikasi

Sebagian besar endpoint memerlukan autentikasi menggunakan JWT (JSON Web Token). 

### Cara Menggunakan:

1. **Register/Login**: Gunakan endpoint \`/api/auth/register\` atau \`/api/auth/login\` untuk mendapatkan token
2. **Simpan Token**: Simpan \`accessToken\` yang diterima dari response
3. **Authorize**: Klik tombol **Authorize** di bagian atas dan masukkan: \`Bearer <your_access_token>\`
4. **Gunakan API**: Setelah authorize, Anda dapat menggunakan endpoint yang memerlukan autentikasi

### Credential Default:

- **Username**: \`Facility management\`
- **Password**: \`1234\`
- **Role**: Facility management (memiliki akses ke semua endpoint)

## Hak Akses

- **Public**: Login, Register
- **Authenticated**: Panel CRUD, Electricity Bills CRUD
- **Facility Management Only**: List & Create Electricity Bills

## Tips

- Token akan expired setelah beberapa waktu. Gunakan \`/api/auth/refresh\` untuk mendapatkan token baru
- Semua response error mengikuti format: \`{"error": "pesan error"}\`
- Untuk filter di GET requests, semua parameter bersifat opsional
      `,
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.example.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Masukkan JWT token yang didapat dari endpoint login',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Pesan error',
            },
          },
        },
        MessageResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Pesan sukses',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email atau username user',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Password user',
              example: 'password123',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email user (opsional jika username diisi)',
              example: 'user@example.com',
            },
            username: {
              type: 'string',
              description: 'Username user (opsional jika email diisi)',
              example: 'username123',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Password user',
              example: 'password123',
            },
            name: {
              type: 'string',
              description: 'Nama lengkap user',
              example: 'John Doe',
            },
          },
        },
        RefreshTokenRequest: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: {
              type: 'string',
              description: 'Refresh token untuk memperbarui access token',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              description: 'JWT access token - gunakan untuk autentikasi di endpoint lain',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            },
            refreshToken: {
              type: 'string',
              description: 'JWT refresh token - gunakan untuk mendapatkan access token baru',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjE2MjM5MDIyfQ.4pcPyMD09olPSyXnrXCjTwXyr4BsezdI1AVTmud2fU4',
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  example: 1,
                  description: 'User ID',
                },
                email: {
                  type: 'string',
                  example: 'user@example.com',
                  description: 'Email user',
                },
                username: {
                  type: 'string',
                  example: 'username123',
                  description: 'Username user',
                },
                name: {
                  type: 'string',
                  example: 'John Doe',
                  description: 'Nama lengkap user',
                },
                role: {
                  type: 'string',
                  example: 'User',
                  description: 'Role user (User, Admin, Facility management, dll)',
                },
              },
            },
          },
          example: {
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjE2MjM5MDIyfQ.4pcPyMD09olPSyXnrXCjTwXyr4BsezdI1AVTmud2fU4',
            user: {
              id: 1,
              email: 'user@example.com',
              username: 'testuser',
              name: 'Test User',
              role: 'Facility management'
            }
          },
        },
        Panel: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
              description: 'Panel ID (auto-increment)',
            },
            namePanel: {
              type: 'string',
              example: 'Panel A',
              description: 'Nama panel listrik',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
              description: 'Timestamp saat panel dibuat',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
              description: 'Timestamp saat panel terakhir diupdate',
            },
          },
          example: {
            id: 1,
            namePanel: 'Test Panel 01',
            createdAt: '2024-01-01T10:30:00.000Z',
            updatedAt: '2024-01-01T10:30:00.000Z'
          },
        },
        CreatePanelRequest: {
          type: 'object',
          required: ['namePanel'],
          properties: {
            namePanel: {
              type: 'string',
              description: 'Nama panel',
              example: 'Panel A',
            },
          },
        },
        UpdatePanelRequest: {
          type: 'object',
          required: ['namePanel'],
          properties: {
            namePanel: {
              type: 'string',
              description: 'Nama panel baru',
              example: 'Panel B',
            },
          },
        },
        ElectricityBill: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
              description: 'Electricity bill ID (auto-increment)',
            },
            panelId: {
              type: 'integer',
              example: 1,
              description: 'ID panel yang digunakan (foreign key)',
            },
            userId: {
              type: 'integer',
              example: 1,
              description: 'ID user pemilik tagihan (foreign key)',
            },
            billingMonth: {
              type: 'string',
              format: 'date',
              example: '2024-01-01',
              description: 'Bulan/periode tagihan (format: YYYY-MM-DD)',
            },
            kwhUse: {
              type: 'number',
              format: 'decimal',
              example: 1500.5,
              description: 'Jumlah penggunaan listrik dalam kWh',
            },
            vaStatus: {
              type: 'string',
              example: 'Normal',
              description: 'Status VA (Virtual Account)',
            },
            totalBills: {
              type: 'number',
              format: 'decimal',
              example: 2500000.0,
              description: 'Total tagihan dalam Rupiah',
            },
            statusPay: {
              type: 'string',
              example: 'Lunas',
              enum: ['Lunas', 'Belum Lunas'],
              description: 'Status pembayaran tagihan',
            },
            panel: {
              $ref: '#/components/schemas/Panel',
              description: 'Data panel yang terkait (jika include)',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
              description: 'Timestamp saat tagihan dibuat',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
              description: 'Timestamp saat tagihan terakhir diupdate',
            },
          },
          example: {
            id: 1,
            panelId: 1,
            userId: 1,
            billingMonth: '2024-01-01T00:00:00.000Z',
            kwhUse: 1500.5,
            vaStatus: '',
            totalBills: 2500000.0,
            statusPay: 'Belum Lunas',
            panel: {
              id: 1,
              namePanel: 'Test Panel 01',
              createdAt: '2024-01-01T10:30:00.000Z',
              updatedAt: '2024-01-01T10:30:00.000Z'
            },
            createdAt: '2024-01-15T08:20:00.000Z',
            updatedAt: '2024-01-15T08:20:00.000Z'
          },
        },
        CreateElectricityBillRequest: {
          type: 'object',
          required: ['panelId', 'userId', 'billingMonth', 'kwhUse', 'totalBills', 'statusPay'],
          properties: {
            panelId: {
              type: 'integer',
              description: 'ID panel',
              example: 1,
            },
            userId: {
              type: 'integer',
              description: 'ID user',
              example: 1,
            },
            billingMonth: {
              type: 'string',
              format: 'date',
              description: 'Bulan tagihan (format: YYYY-MM-DD)',
              example: '2024-01-01',
            },
            kwhUse: {
              type: 'number',
              format: 'decimal',
              description: 'Penggunaan kWh',
              example: 150.5,
            },
            vaStatus: {
              type: 'string',
              description: 'Status VA',
              example: 'Normal',
            },
            totalBills: {
              type: 'number',
              format: 'decimal',
              description: 'Total tagihan',
              example: 500000.0,
            },
            statusPay: {
              type: 'string',
              description: 'Status pembayaran',
              example: 'Lunas',
              enum: ['Lunas', 'Belum Lunas'],
            },
          },
        },
        UpdateElectricityBillRequest: {
          type: 'object',
          properties: {
            panelId: {
              type: 'integer',
              description: 'ID panel',
              example: 1,
            },
            userId: {
              type: 'integer',
              description: 'ID user',
              example: 1,
            },
            billingMonth: {
              type: 'string',
              format: 'date',
              description: 'Bulan tagihan (format: YYYY-MM-DD)',
              example: '2024-01-01',
            },
            kwhUse: {
              type: 'number',
              format: 'decimal',
              description: 'Penggunaan kWh',
              example: 150.5,
            },
            vaStatus: {
              type: 'string',
              description: 'Status VA',
              example: 'Normal',
            },
            totalBills: {
              type: 'number',
              format: 'decimal',
              description: 'Total tagihan',
              example: 500000.0,
            },
            statusPay: {
              type: 'string',
              description: 'Status pembayaran',
              example: 'Lunas',
              enum: ['Lunas', 'Belum Lunas'],
            },
          },
        },
        ImportResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'import berhasil',
            },
            successCount: {
              type: 'integer',
              example: 10,
            },
            errorCount: {
              type: 'integer',
              example: 2,
            },
            errors: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Daftar error jika ada',
              example: ['Baris 3: Data tidak lengkap', 'Baris 5: Panel tidak ditemukan'],
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Endpoints untuk autentikasi user',
      },
      {
        name: 'Panel',
        description: 'Endpoints untuk manajemen panel',
      },
      {
        name: 'Electricity Bills',
        description: 'Endpoints untuk manajemen tagihan listrik',
      },
      {
        name: 'Export/Import',
        description: 'Endpoints untuk export dan import data',
      },
    ],
  },
  apis: [
    './src/app/api/**/*.ts', // Path to the API files
  ],
};

export const swaggerSpec = swaggerJsdoc(options);