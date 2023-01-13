/*
  Warnings:

  - Made the column `score` on table `skill_test_account` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `skill_test_account` MODIFY `score` INTEGER NOT NULL DEFAULT 0;
