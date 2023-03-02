/*
  Warnings:

  - You are about to drop the column `isAdminReviewed` on the `request` table. All the data in the column will be lost.
  - You are about to drop the column `isCancelled` on the `request` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subscriber_id]` on the table `employee` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `employee` ADD COLUMN `subscriber_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `request` DROP COLUMN `isAdminReviewed`,
    DROP COLUMN `isCancelled`,
    ADD COLUMN `is_admin_reviewed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is_cancelled` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `employee_subscriber_id_key` ON `employee`(`subscriber_id`);
