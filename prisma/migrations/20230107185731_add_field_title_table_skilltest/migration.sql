/*
  Warnings:

  - Added the required column `title` to the `skill_test` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `skill_test` ADD COLUMN `title` VARCHAR(191) NOT NULL;
