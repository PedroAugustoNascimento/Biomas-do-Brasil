/*
  Warnings:

  - You are about to drop the column `climate` on the `Biome` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Biome` table. All the data in the column will be lost.
  - You are about to drop the column `fauna` on the `Biome` table. All the data in the column will be lost.
  - You are about to drop the column `flora` on the `Biome` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Biome` table. All the data in the column will be lost.
  - Added the required column `conservation` to the `Biome` table without a default value. This is not possible if the table is not empty.
  - Added the required column `environmentalProblems` to the `Biome` table without a default value. This is not possible if the table is not empty.
  - Added the required column `generalCharacteristics` to the `Biome` table without a default value. This is not possible if the table is not empty.
  - Added the required column `introduction` to the `Biome` table without a default value. This is not possible if the table is not empty.
  - Added the required column `naturalResources` to the `Biome` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Biome" DROP COLUMN "climate",
DROP COLUMN "description",
DROP COLUMN "fauna",
DROP COLUMN "flora",
DROP COLUMN "location",
ADD COLUMN     "conservation" TEXT NOT NULL,
ADD COLUMN     "environmentalProblems" TEXT NOT NULL,
ADD COLUMN     "generalCharacteristics" TEXT NOT NULL,
ADD COLUMN     "introduction" TEXT NOT NULL,
ADD COLUMN     "naturalResources" TEXT NOT NULL;
