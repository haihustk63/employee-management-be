/*
  Warnings:

  - Made the column `email` on table `candidate` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `candidate` MODIFY `phone` VARCHAR(10) NULL,
    MODIFY `email` VARCHAR(30) NOT NULL;
