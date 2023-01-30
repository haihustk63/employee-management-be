/*
  Warnings:

  - You are about to drop the column `isTutor` on the `employee_education` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `employee_education` DROP COLUMN `isTutor`,
    ADD COLUMN `is_tutor` BOOLEAN NOT NULL DEFAULT false;
