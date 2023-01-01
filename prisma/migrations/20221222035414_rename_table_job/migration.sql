/*
  Warnings:

  - You are about to drop the `Jobs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Jobs` DROP FOREIGN KEY `Jobs_position_id_fkey`;

-- AlterTable
ALTER TABLE `candidate` ADD COLUMN `jobId` INTEGER NULL;

-- DropTable
DROP TABLE `Jobs`;

-- CreateTable
CREATE TABLE `Job` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `type_of_job` INTEGER NOT NULL,
    `up_to` INTEGER NULL,
    `level` JSON NULL,
    `job_detail` VARCHAR(191) NULL,
    `position_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `candidate` ADD CONSTRAINT `candidate_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Job` ADD CONSTRAINT `Job_position_id_fkey` FOREIGN KEY (`position_id`) REFERENCES `position`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
