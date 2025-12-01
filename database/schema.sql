-- ============================================
-- Database Schema for Electricity Bills System
-- ============================================
-- This file contains the DDL and initial data
-- Run this script in pgAdmin or psql
-- ============================================

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS "Session" CASCADE;
DROP TABLE IF EXISTS "Electricity_Bills" CASCADE;
DROP TABLE IF EXISTS "Panel" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- ============================================
-- Enable Extension: pgcrypto
-- ============================================
-- Extension ini diperlukan untuk function digest() (SHA-256)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- Create Function: SHA-256 Hash
-- ============================================
-- Function untuk menghash password menggunakan SHA-256
CREATE OR REPLACE FUNCTION sha256_hash(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(digest(input_text, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Create Table: User
-- ============================================
CREATE TABLE "User" (
    "id_User" SERIAL PRIMARY KEY,
    "Username" VARCHAR(255) UNIQUE,
    "Password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE,
    "name" VARCHAR(255),
    "Role" VARCHAR(50) NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Create Table: Panel
-- ============================================
CREATE TABLE "Panel" (
    "id_Panel" SERIAL PRIMARY KEY,
    "Name_Panel" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Create Table: Electricity_Bills
-- ============================================
CREATE TABLE "Electricity_Bills" (
    "id_Bills" SERIAL PRIMARY KEY,
    "id_Panel" INTEGER NOT NULL,
    "id_User" INTEGER NOT NULL,
    "Billing_month" DATE NOT NULL,
    "kwh_use" DECIMAL(10, 2) NOT NULL,
    "VA_status" VARCHAR(255),
    "Total_Bills" DECIMAL(10, 2) NOT NULL,
    "Status_Pay" VARCHAR(255) NOT NULL,
    "Created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_panel" FOREIGN KEY ("id_Panel") REFERENCES "Panel"("id_Panel") ON DELETE CASCADE,
    CONSTRAINT "fk_user" FOREIGN KEY ("id_User") REFERENCES "User"("id_User") ON DELETE CASCADE
);

-- ============================================
-- Create Table: Session
-- ============================================
CREATE TABLE "Session" (
    "id" TEXT PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "refreshToken" TEXT UNIQUE NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_session_user" FOREIGN KEY ("userId") REFERENCES "User"("id_User") ON DELETE CASCADE
);

-- ============================================
-- Create Indexes for Performance
-- ============================================
CREATE INDEX "idx_electricity_bills_panel" ON "Electricity_Bills"("id_Panel");
CREATE INDEX "idx_electricity_bills_user" ON "Electricity_Bills"("id_User");
CREATE INDEX "idx_electricity_bills_billing_month" ON "Electricity_Bills"("Billing_month");
CREATE INDEX "idx_session_user" ON "Session"("userId");
CREATE INDEX "idx_session_refresh_token" ON "Session"("refreshToken");

-- ============================================
-- Insert Initial Users
-- ============================================
-- Password akan di-hash otomatis menggunakan function sha256_hash()
-- Password asli: 1234
-- Username: Facility management
INSERT INTO "User" ("Username", "Password", "Role", "name") 
VALUES ('Facility management', sha256_hash('1234'), 'USER', 'Facility Management');

-- Username: student hausing
INSERT INTO "User" ("Username", "Password", "Role", "name") 
VALUES ('student hausing', sha256_hash('1234'), 'USER', 'Student Housing');

-- ============================================
-- Insert Initial Panels
-- ============================================
INSERT INTO "Panel" ("Name_Panel") VALUES ('GL 01');
INSERT INTO "Panel" ("Name_Panel") VALUES ('GL 02');
INSERT INTO "Panel" ("Name_Panel") VALUES ('GOR 01');
INSERT INTO "Panel" ("Name_Panel") VALUES ('GOR 02');
INSERT INTO "Panel" ("Name_Panel") VALUES ('Modular 01');

-- ============================================
-- Verify Data
-- ============================================
SELECT * FROM "User";
SELECT * FROM "Panel";
