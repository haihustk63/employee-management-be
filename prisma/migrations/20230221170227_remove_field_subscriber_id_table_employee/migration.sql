/*
  Warnings:

  - You are about to drop the column `subscriber_id` on the `employee` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `employee_subscriber_id_key` ON `employee`;

-- AlterTable
ALTER TABLE `employee` DROP COLUMN `subscriber_id`;
