/*
  Warnings:

  - Made the column `completion_rate` on table `quests` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "quests" ALTER COLUMN "completion_rate" SET NOT NULL;
