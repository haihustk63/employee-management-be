/*
  Warnings:

  - You are about to drop the column `descripption` on the `TestTopic` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `TestTopic` DROP COLUMN `descripption`,
    ADD COLUMN `description` VARCHAR(191) NULL;
