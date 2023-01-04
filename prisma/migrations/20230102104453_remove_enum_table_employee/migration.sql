/*
  Warnings:

  - You are about to alter the column `role` on the `employee` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `Int`.
  - You are about to alter the column `working_status` on the `employee` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `Int`.

*/
-- AlterTable
ALTER TABLE `employee` MODIFY `role` INTEGER NOT NULL DEFAULT 1,
    MODIFY `working_status` INTEGER NOT NULL DEFAULT 2;
