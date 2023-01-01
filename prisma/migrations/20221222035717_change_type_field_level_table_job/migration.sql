/*
  Warnings:

  - Added the required column `level` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Job` DROP COLUMN `level`,
    ADD COLUMN `level` INTEGER NOT NULL;
