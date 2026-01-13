-- ============================================
-- Insert Users Script
-- ============================================
-- This script inserts users with hashed passwords using SHA-256
-- Password akan di-hash otomatis menggunakan function sha256_hash()
-- Password asli: 1234
-- ============================================

-- Pastikan extension pgcrypto dan function sha256_hash sudah ada
-- Jika belum, jalankan schema.sql dulu untuk setup
-- Extension pgcrypto: CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- Function sha256_hash sudah dibuat di schema.sql

-- Insert User: Facility management
-- Password: 1234 (akan di-hash otomatis dengan SHA-256 saat insert)
INSERT INTO "User" ("Username", "Password", "Role", "name") 
VALUES ('Facility Management', sha256_hash('1234'), 'USER', 'Facility Management')
ON CONFLICT ("Username") DO UPDATE 
SET "Password" = EXCLUDED."Password",
    "Role" = EXCLUDED."Role",
    "name" = EXCLUDED."name";

-- Insert User: student hausing
-- Password: 1234 (akan di-hash otomatis dengan SHA-256 saat insert)
INSERT INTO "User" ("Username", "Password", "Role", "name") 
VALUES ('Student Housing', sha256_hash('1234'), 'USER', 'Student Housing')
ON CONFLICT ("Username") DO UPDATE 
SET "Password" = EXCLUDED."Password",
    "Role" = EXCLUDED."Role",
    "name" = EXCLUDED."name";

-- Verify inserted users
SELECT "id_User", "Username", "Role", "name" FROM "User" WHERE "Username" IN ('Facility Management', 'Student Housing');
