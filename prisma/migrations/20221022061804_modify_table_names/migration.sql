/*
  Warnings:

  - You are about to drop the `Candidate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Candidate` DROP FOREIGN KEY `Candidate_interviewerId_fkey`;

-- DropForeignKey
ALTER TABLE `Candidate` DROP FOREIGN KEY `Candidate_position_id_fkey`;

-- DropForeignKey
ALTER TABLE `candidate_account` DROP FOREIGN KEY `candidate_account_candidate_id_fkey`;

-- DropTable
DROP TABLE `Candidate`;

-- CreateTable
CREATE TABLE `candidate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `phone` VARCHAR(10) NOT NULL,
    `email` VARCHAR(30) NULL,
    `appointment_time` DATETIME(3) NOT NULL,
    `cv_link` VARCHAR(191) NOT NULL,
    `position_id` INTEGER NOT NULL,
    `interviewerId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `candidate` ADD CONSTRAINT `candidate_position_id_fkey` FOREIGN KEY (`position_id`) REFERENCES `position`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `candidate` ADD CONSTRAINT `candidate_interviewerId_fkey` FOREIGN KEY (`interviewerId`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `candidate_account` ADD CONSTRAINT `candidate_account_candidate_id_fkey` FOREIGN KEY (`candidate_id`) REFERENCES `candidate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
