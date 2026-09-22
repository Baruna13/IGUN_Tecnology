-- CreateEnum
CREATE TYPE "SchoolLevel" AS ENUM ('SMA', 'SMK');

-- CreateEnum
CREATE TYPE "SchoolStatus" AS ENUM ('NEGERI', 'SWASTA');

-- CreateEnum
CREATE TYPE "Accreditation" AS ENUM ('A', 'B', 'C');

-- CreateTable
CREATE TABLE "schools" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "npsn" TEXT NOT NULL,
    "level" "SchoolLevel" NOT NULL DEFAULT 'SMA',
    "status" "SchoolStatus" NOT NULL DEFAULT 'NEGERI',
    "address" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "accreditation" "Accreditation" NOT NULL,
    "accreditationScore" INTEGER NOT NULL,
    "quota" INTEGER NOT NULL,
    "zoneRadiusMeters" INTEGER NOT NULL DEFAULT 1500,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_boundaries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "geometry" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_boundaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "schools_slug_key" ON "schools"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "schools_npsn_key" ON "schools"("npsn");

-- CreateIndex
CREATE UNIQUE INDEX "admin_boundaries_name_key" ON "admin_boundaries"("name");
