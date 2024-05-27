/*
  Warnings:

  - You are about to drop the column `quests` on the `Track` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Track" DROP COLUMN "quests";

-- CreateTable
CREATE TABLE "Quest" (
    "id" TEXT NOT NULL,
    "trackId" TEXT,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE SET NULL ON UPDATE CASCADE;
