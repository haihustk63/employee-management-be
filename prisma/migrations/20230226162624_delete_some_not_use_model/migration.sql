/*
  Warnings:

  - You are about to drop the column `location` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the `device` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `device_brand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `device_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recruiment_news` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `device` DROP FOREIGN KEY `device_deviceBrandId_fkey`;

-- DropForeignKey
ALTER TABLE `device` DROP FOREIGN KEY `device_device_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `device` DROP FOREIGN KEY `device_employeeId_fkey`;

-- AlterTable
ALTER TABLE `employee` DROP COLUMN `location`;

-- DropTable
DROP TABLE `device`;

-- DropTable
DROP TABLE `device_brand`;

-- DropTable
DROP TABLE `device_type`;

-- DropTable
DROP TABLE `recruiment_news`;
