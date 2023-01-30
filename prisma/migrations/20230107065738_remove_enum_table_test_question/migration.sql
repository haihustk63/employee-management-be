/*
  Warnings:

  - You are about to alter the column `type` on the `TestQuestion` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Int`.
  - You are about to alter the column `level` on the `TestQuestion` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Int`.

*/
-- AlterTable
ALTER TABLE `TestQuestion` MODIFY `type` INTEGER NOT NULL DEFAULT 1,
    MODIFY `level` INTEGER NOT NULL DEFAULT 1;
