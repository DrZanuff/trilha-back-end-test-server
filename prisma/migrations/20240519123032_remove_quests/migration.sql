/*
  Warnings:

  - You are about to drop the `Quest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Quest" DROP CONSTRAINT "Quest_trackId_fkey";

-- DropTable
DROP TABLE "Quest";
