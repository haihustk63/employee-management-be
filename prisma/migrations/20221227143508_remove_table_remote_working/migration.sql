/*
  Warnings:

  - You are about to drop the `request_working_remote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `request_working_remote` DROP FOREIGN KEY `request_working_remote_employee_id_fkey`;

-- DropTable
DROP TABLE `request_working_remote`;
