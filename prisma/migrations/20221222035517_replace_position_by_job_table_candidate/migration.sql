/*
  Warnings:

  - You are about to drop the column `position_id` on the `candidate` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `candidate` DROP FOREIGN KEY `candidate_position_id_fkey`;

-- AlterTable
ALTER TABLE `candidate` DROP COLUMN `position_id`;
