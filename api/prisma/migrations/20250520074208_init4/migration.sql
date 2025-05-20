-- CreateEnum
CREATE TYPE "ParkStatus" AS ENUM ('OCCUPIED', 'FREE', 'RESERVED');

-- AlterTable
ALTER TABLE "Park" ADD COLUMN     "status" "ParkStatus" NOT NULL DEFAULT 'FREE';
