-- DropForeignKey
ALTER TABLE `candidate_account` DROP FOREIGN KEY `candidate_account_candidate_id_fkey`;

-- DropForeignKey
ALTER TABLE `employee_account` DROP FOREIGN KEY `employee_account_employee_id_fkey`;

-- CreateTable
CREATE TABLE `Jobs` (
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
ALTER TABLE `employee_account` ADD CONSTRAINT `employee_account_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `candidate_account` ADD CONSTRAINT `candidate_account_candidate_id_fkey` FOREIGN KEY (`candidate_id`) REFERENCES `candidate`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Jobs` ADD CONSTRAINT `Jobs_position_id_fkey` FOREIGN KEY (`position_id`) REFERENCES `position`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
