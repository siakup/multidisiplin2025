-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('PUTRA', 'PUTRI', 'CAMPUR');

-- CreateEnum
CREATE TYPE "PanelCategory" AS ENUM ('FACILITY_MANAGEMENT', 'STUDENT_HOUSING');

-- CreateTable
CREATE TABLE "User" (
    "id_User" SERIAL NOT NULL,
    "Role" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Email" TEXT,
    "Name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_User")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Panel" (
    "id_Panel" SERIAL NOT NULL,
    "Name_Panel" TEXT NOT NULL,
    "category" "PanelCategory" NOT NULL DEFAULT 'FACILITY_MANAGEMENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Panel_pkey" PRIMARY KEY ("id_Panel")
);

-- CreateTable
CREATE TABLE "Electricity_Bills" (
    "id_Bills" SERIAL NOT NULL,
    "id_Panel" INTEGER NOT NULL,
    "id_User" INTEGER NOT NULL,
    "Billing_month" TIMESTAMP(3) NOT NULL,
    "kwh_use" DECIMAL(10,2) NOT NULL,
    "VA_status" TEXT,
    "Total_Bills" DECIMAL(10,2) NOT NULL,
    "Status_Pay" TEXT NOT NULL DEFAULT 'Belum Lunas',
    "Created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Electricity_Bills_pkey" PRIMARY KEY ("id_Bills")
);

-- CreateTable
CREATE TABLE "DormRecord" (
    "id" TEXT NOT NULL,
    "period" TIMESTAMP(3) NOT NULL,
    "dormName" TEXT NOT NULL,
    "totalKwh" DOUBLE PRECISION NOT NULL,
    "billAmount" DOUBLE PRECISION NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DormRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dorm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "powerCapacity" INTEGER NOT NULL,
    "capacity" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dorm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Role_key" ON "User"("Role");

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_refreshToken_key" ON "Session"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "Panel_Name_Panel_key" ON "Panel"("Name_Panel");

-- CreateIndex
CREATE INDEX "Electricity_Bills_id_Panel_idx" ON "Electricity_Bills"("id_Panel");

-- CreateIndex
CREATE INDEX "Electricity_Bills_id_User_idx" ON "Electricity_Bills"("id_User");

-- CreateIndex
CREATE INDEX "Electricity_Bills_Billing_month_idx" ON "Electricity_Bills"("Billing_month");

-- CreateIndex
CREATE UNIQUE INDEX "Electricity_Bills_id_Panel_Billing_month_key" ON "Electricity_Bills"("id_Panel", "Billing_month");

-- CreateIndex
CREATE UNIQUE INDEX "Dorm_name_key" ON "Dorm"("name");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id_User") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Electricity_Bills" ADD CONSTRAINT "Electricity_Bills_id_Panel_fkey" FOREIGN KEY ("id_Panel") REFERENCES "Panel"("id_Panel") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Electricity_Bills" ADD CONSTRAINT "Electricity_Bills_id_User_fkey" FOREIGN KEY ("id_User") REFERENCES "User"("id_User") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DormRecord" ADD CONSTRAINT "DormRecord_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id_User") ON DELETE RESTRICT ON UPDATE CASCADE;
