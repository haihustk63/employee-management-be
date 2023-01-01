/*
  Warnings:

  - You are about to alter the column `answer` on the `TestQuestion` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `TestQuestion` MODIFY `answer` JSON NULL;
