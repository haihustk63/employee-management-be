/*
  Warnings:

  - You are about to drop the column `has_manager` on the `delivery` table. All the data in the column will be lost.
  - You are about to drop the column `delivery_id` on the `employee` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `employee_delivery_id_fkey`;

-- AlterTable
ALTER TABLE `delivery` DROP COLUMN `has_manager`;

-- AlterTable
ALTER TABLE `employee` DROP COLUMN `delivery_id`;

-- CreateTable
CREATE TABLE `delivery_employee` (
    `delivery_id` INTEGER NOT NULL,
    `employee_id` INTEGER NOT NULL,
    `is_manager` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `delivery_employee_employee_id_key`(`employee_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `delivery_employee` ADD CONSTRAINT `delivery_employee_delivery_id_fkey` FOREIGN KEY (`delivery_id`) REFERENCES `delivery`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delivery_employee` ADD CONSTRAINT `delivery_employee_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
