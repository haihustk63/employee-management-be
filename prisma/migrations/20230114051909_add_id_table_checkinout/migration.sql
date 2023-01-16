/*
  Warnings:

  - Added the required column `id` to the `check_in_out` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `check_in_out` ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);
