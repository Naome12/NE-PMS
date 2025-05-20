-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ATTENDANT');

-- CreateEnum
CREATE TYPE "ParkStatus" AS ENUM ('OCCUPIED', 'FREE', 'RESERVED');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('ENTRIES', 'EXITS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Park" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "availableSpaces" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "feePerHour" DECIMAL(10,2) NOT NULL,
    "status" "ParkStatus" NOT NULL DEFAULT 'FREE',
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Park_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "parkingCode" TEXT NOT NULL,
    "entryTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exitTime" TIMESTAMP(3),
    "chargedAmount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "attendantId" TEXT NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "issueTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "carId" TEXT NOT NULL,
    "parkingCode" TEXT NOT NULL,
    "attendantId" TEXT NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startRange" TIMESTAMP(3) NOT NULL,
    "endRange" TIMESTAMP(3) NOT NULL,
    "type" "ReportType" NOT NULL,
    "totalCars" INTEGER NOT NULL,
    "totalCharged" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "generatedById" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Car_plateNumber_key" ON "Car"("plateNumber");

-- AddForeignKey
ALTER TABLE "Park" ADD CONSTRAINT "Park_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_attendantId_fkey" FOREIGN KEY ("attendantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_parkingCode_fkey" FOREIGN KEY ("parkingCode") REFERENCES "Park"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_parkingCode_fkey" FOREIGN KEY ("parkingCode") REFERENCES "Park"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_attendantId_fkey" FOREIGN KEY ("attendantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_generatedById_fkey" FOREIGN KEY ("generatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
