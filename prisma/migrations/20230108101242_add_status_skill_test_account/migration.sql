/*
  Warnings:

  - You are about to drop the column `attempted` on the `skill_test_account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `skill_test_account` DROP COLUMN `attempted`,
    ADD COLUMN `status` INTEGER NOT NULL DEFAULT 1;
