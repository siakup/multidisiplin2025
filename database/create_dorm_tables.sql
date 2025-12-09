-- Script untuk membuat tabel Dorm dan DormRecord
-- CATATAN: Jalankan create_gender_enum.sql terlebih dahulu!

-- Drop existing tables if they exist
DROP TABLE IF EXISTS "DormRecord" CASCADE;
DROP TABLE IF EXISTS "Dorm" CASCADE;

-- Create Table: Dorm
CREATE TABLE "Dorm" (
    "id" TEXT PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "gender" "Gender" NOT NULL,
    "powerCapacity" INTEGER NOT NULL,
    "capacity" INTEGER,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Table: DormRecord
CREATE TABLE "DormRecord" (
    "id" TEXT PRIMARY KEY,
    "period" TIMESTAMP NOT NULL,
    "dormName" VARCHAR(255) NOT NULL,
    "totalKwh" DOUBLE PRECISION NOT NULL,
    "billAmount" DOUBLE PRECISION NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_dormrecord_user" FOREIGN KEY ("createdBy") REFERENCES "User"("id_User") ON DELETE CASCADE
);

-- Create Indexes for Dorm tables
CREATE INDEX "idx_dormrecord_user" ON "DormRecord"("createdBy");
CREATE INDEX "idx_dormrecord_period" ON "DormRecord"("period");

-- Verify tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('Dorm', 'DormRecord');

SELECT * FROM "Dorm";
SELECT * FROM "DormRecord";
