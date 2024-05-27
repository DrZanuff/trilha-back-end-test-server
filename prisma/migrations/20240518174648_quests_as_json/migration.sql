/*
  Warnings:

  - You are about to drop the `quests` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quests` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "quests" DROP CONSTRAINT "quests_trackId_fkey";

-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "completion_rate" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quests" JSONB NOT NULL,
ADD COLUMN     "time_played" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "quests";
