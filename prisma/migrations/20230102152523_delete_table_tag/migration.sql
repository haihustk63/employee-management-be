/*
  Warnings:

  - You are about to drop the `_EducationProgramToTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RecruimentNewsToTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_EducationProgramToTag` DROP FOREIGN KEY `_EducationProgramToTag_A_fkey`;

-- DropForeignKey
ALTER TABLE `_EducationProgramToTag` DROP FOREIGN KEY `_EducationProgramToTag_B_fkey`;

-- DropForeignKey
ALTER TABLE `_RecruimentNewsToTag` DROP FOREIGN KEY `_RecruimentNewsToTag_A_fkey`;

-- DropForeignKey
ALTER TABLE `_RecruimentNewsToTag` DROP FOREIGN KEY `_RecruimentNewsToTag_B_fkey`;

-- DropTable
DROP TABLE `_EducationProgramToTag`;

-- DropTable
DROP TABLE `_RecruimentNewsToTag`;

-- DropTable
DROP TABLE `tag`;
