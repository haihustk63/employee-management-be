/*
  Warnings:

  - Made the column `role` on table `notification_topic` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `notification_topic` MODIFY `role` JSON NOT NULL;
