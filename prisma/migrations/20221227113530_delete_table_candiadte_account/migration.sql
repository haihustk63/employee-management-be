/*
  Warnings:

  - You are about to drop the `candidate_account` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `candidate_account` DROP FOREIGN KEY `candidate_account_candidate_id_fkey`;

-- AlterTable
ALTER TABLE `employee_account` MODIFY `employee_id` INTEGER NULL;

-- DropTable
DROP TABLE `candidate_account`;
