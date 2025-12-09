DROP TABLE IF EXISTS "DormRecord" CASCADE;
DROP TABLE IF EXISTS "Dorm" CASCADE;
DROP TABLE IF EXISTS "Session" CASCADE;
DROP TABLE IF EXISTS "Electricity_Bills" CASCADE;
DROP TABLE IF EXISTS "Panel" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

DROP TYPE IF EXISTS "PanelCategory" CASCADE;
DROP TYPE IF EXISTS "Gender" CASCADE;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION sha256_hash(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(digest(input_text, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

CREATE TYPE "PanelCategory" AS ENUM ('FACILITY_MANAGEMENT', 'STUDENT_HOUSING');
CREATE TYPE "Gender" AS ENUM ('PUTRA', 'PUTRI', 'CAMPUR');

CREATE TABLE "User" (
    "id_User" SERIAL PRIMARY KEY,
    "Role" VARCHAR(50) NOT NULL UNIQUE,  
    "Password" VARCHAR(255) NOT NULL,  
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Panel" (
    "id_Panel" SERIAL PRIMARY KEY,
    "Name_Panel" VARCHAR(255) NOT NULL,
    "category" "PanelCategory" NOT NULL DEFAULT 'FACILITY_MANAGEMENT',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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
CREATE TABLE "Session" (
    "id" TEXT PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "refreshToken" TEXT UNIQUE NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_session_user" FOREIGN KEY ("userId") REFERENCES "User"("id_User") ON DELETE CASCADE
);

CREATE INDEX "idx_electricity_bills_panel" ON "Electricity_Bills"("id_Panel");
CREATE INDEX "idx_electricity_bills_user" ON "Electricity_Bills"("id_User");
CREATE INDEX "idx_electricity_bills_billing_month" ON "Electricity_Bills"("Billing_month");
CREATE INDEX "idx_session_user" ON "Session"("userId");
CREATE INDEX "idx_session_refresh_token" ON "Session"("refreshToken");

INSERT INTO "User" ("Role", "Password") 
VALUES ('Facility Management', sha256_hash('1234'));

INSERT INTO "User" ("Role", "Password") 
VALUES ('Student Housing', sha256_hash('1234'));

INSERT INTO "Panel" ("Name_Panel", "category") VALUES ('GL 01', 'FACILITY_MANAGEMENT');
INSERT INTO "Panel" ("Name_Panel", "category") VALUES ('GL 02', 'FACILITY_MANAGEMENT');
INSERT INTO "Panel" ("Name_Panel", "category") VALUES ('GOR 01', 'FACILITY_MANAGEMENT');
INSERT INTO "Panel" ("Name_Panel", "category") VALUES ('GOR 02', 'FACILITY_MANAGEMENT');
INSERT INTO "Panel" ("Name_Panel", "category") VALUES ('Modular 01', 'FACILITY_MANAGEMENT');

CREATE TABLE "Dorm" (
    "id" TEXT PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "gender" "Gender" NOT NULL,
    "powerCapacity" INTEGER NOT NULL,
    "capacity" INTEGER,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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

CREATE INDEX "idx_dormrecord_user" ON "DormRecord"("createdBy");
CREATE INDEX "idx_dormrecord_period" ON "DormRecord"("period");

SELECT * FROM "User";
SELECT * FROM "Panel";
