/*
  Warnings:

  - You are about to drop the column `course_id` on the `saves` table. All the data in the column will be lost.
  - You are about to drop the column `teacher_id` on the `saves` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "saves" DROP COLUMN "course_id",
DROP COLUMN "teacher_id";
