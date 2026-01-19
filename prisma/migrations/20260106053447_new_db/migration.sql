/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Role]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `userId` on the `Session` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `Password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('PUTRA', 'PUTRI', 'CAMPUR');

-- CreateEnum
CREATE TYPE "PanelCategory" AS ENUM ('FACILITY_MANAGEMENT', 'STUDENT_HOUSING');

-- DropForeignKey
ALTER TABLE "public"."Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropIndex
DROP INDEX "public"."User_email_key";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "email",
DROP COLUMN "id",
DROP COLUMN "name",
DROP COLUMN "passwordHash",
DROP COLUMN "role",
ADD COLUMN     "Password" TEXT NOT NULL,
ADD COLUMN     "Role" TEXT NOT NULL,
ADD COLUMN     "id_User" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id_User");

-- DropEnum
DROP TYPE "public"."UserRole";

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

-- CreateIndex
CREATE UNIQUE INDEX "User_Role_key" ON "User"("Role");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id_User") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Electricity_Bills" ADD CONSTRAINT "Electricity_Bills_id_Panel_fkey" FOREIGN KEY ("id_Panel") REFERENCES "Panel"("id_Panel") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Electricity_Bills" ADD CONSTRAINT "Electricity_Bills_id_User_fkey" FOREIGN KEY ("id_User") REFERENCES "User"("id_User") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DormRecord" ADD CONSTRAINT "DormRecord_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id_User") ON DELETE RESTRICT ON UPDATE CASCADE;
