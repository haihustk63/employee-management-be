/*
  Warnings:

  - You are about to drop the `educatipn_program` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `employee_education` DROP FOREIGN KEY `employee_education_program_id_fkey`;

-- DropTable
DROP TABLE `educatipn_program`;

-- CreateTable
CREATE TABLE `education_program` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NULL,
    `max_slot` INTEGER NULL,
    `time` DATETIME(3) NULL,
    `average_rate` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `employee_education` ADD CONSTRAINT `employee_education_program_id_fkey` FOREIGN KEY (`program_id`) REFERENCES `education_program`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
