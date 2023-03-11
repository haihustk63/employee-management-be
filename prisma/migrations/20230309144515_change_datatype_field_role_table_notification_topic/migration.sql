/*
  Warnings:

  - The `role` column on the `notification_topic` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `notification_topic` DROP COLUMN `role`,
    ADD COLUMN `role` JSON NULL;
