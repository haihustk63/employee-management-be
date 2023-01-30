/*
  Warnings:

  - You are about to drop the `request_for_absent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `request_for_absent` DROP FOREIGN KEY `request_for_absent_employee_id_fkey`;

-- DropTable
DROP TABLE `request_for_absent`;
