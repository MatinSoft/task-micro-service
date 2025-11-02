/*
  Warnings:

  - You are about to drop the column `lastRun` on the `Schedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "lastRun";
