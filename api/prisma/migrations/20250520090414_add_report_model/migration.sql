-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('ENTRIES', 'EXITS');

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

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_generatedById_fkey" FOREIGN KEY ("generatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
