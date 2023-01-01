/*
  Warnings:

  - You are about to drop the column `is_submited` on the `SkillTest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `SkillTest` DROP COLUMN `is_submited`,
    ADD COLUMN `is_submitted` BOOLEAN NOT NULL DEFAULT false;
