/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `position` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `delivery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `description` VARCHAR(191) NULL,
    `has_manager` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(20) NOT NULL,
    `middle_name` VARCHAR(20) NULL,
    `last_name` VARCHAR(20) NOT NULL,
    `phone_number` VARCHAR(10) NULL,
    `date_of_birth` DATETIME(3) NULL,
    `position_id` INTEGER NOT NULL,
    `join_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `delivery_id` INTEGER NOT NULL,
    `location` JSON NULL,
    `role` ENUM('EMPLOYEE', 'DIVISION_MANAGER', 'ADMIN', 'SUPER_ADMIN') NOT NULL DEFAULT 'EMPLOYEE',
    `paid_leave_count` INTEGER NOT NULL DEFAULT 0,
    `working_status` ENUM('OFFICIAL', 'PROBATIONARY', 'TEMPORARY_LAYOFFS') NOT NULL DEFAULT 'PROBATIONARY',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Candidate` (
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

-- CreateTable
CREATE TABLE `employee_account` (
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `employee_id` INTEGER NOT NULL,

    UNIQUE INDEX `employee_account_email_key`(`email`),
    UNIQUE INDEX `employee_account_employee_id_key`(`employee_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `candidate_account` (
    `candidate_id` INTEGER NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `candidate_account_candidate_id_key`(`candidate_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `device_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `device_brand` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `device` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `device_type_id` INTEGER NOT NULL,
    `deviceBrandId` INTEGER NOT NULL,
    `option` JSON NULL,
    `description` VARCHAR(191) NULL,
    `employeeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `check_in_out` (
    `employee_id` INTEGER NOT NULL,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `gradient` INTEGER NOT NULL,

    UNIQUE INDEX `check_in_out_employee_id_time_key`(`employee_id`, `time`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `common_request` (
    `employee_id` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `duration` INTEGER NOT NULL,
    `type` ENUM('BEING_LATE', 'LEAVING_EARLY', 'OVER_TIME') NOT NULL DEFAULT 'BEING_LATE',
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',

    UNIQUE INDEX `common_request_employee_id_date_type_key`(`employee_id`, `date`, `type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `request_working_remote` (
    `employee_id` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_remote_morning` BOOLEAN NOT NULL DEFAULT false,
    `is_remote_afternoon` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',

    UNIQUE INDEX `request_working_remote_employee_id_date_key`(`employee_id`, `date`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `request_for_absent` (
    `employee_id` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` ENUM('UNPAID_LEAVE', 'PAID_LEAVE') NOT NULL DEFAULT 'UNPAID_LEAVE',
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',

    UNIQUE INDEX `request_for_absent_employee_id_date_key`(`employee_id`, `date`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recruiment_news` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content_json` JSON NULL,
    `content_html` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `educatipn_program` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `max_slot` SMALLINT NULL,
    `time` DATETIME(3) NULL,
    `average_rate` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee_education` (
    `employee_id` INTEGER NOT NULL,
    `program_id` INTEGER NOT NULL,
    `isTutor` BOOLEAN NOT NULL DEFAULT false,
    `rate` INTEGER NULL,

    UNIQUE INDEX `employee_education_employee_id_program_id_key`(`employee_id`, `program_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RecruimentNewsToTag` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RecruimentNewsToTag_AB_unique`(`A`, `B`),
    INDEX `_RecruimentNewsToTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_EducationProgramToTag` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_EducationProgramToTag_AB_unique`(`A`, `B`),
    INDEX `_EducationProgramToTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_position_id_fkey` FOREIGN KEY (`position_id`) REFERENCES `position`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_delivery_id_fkey` FOREIGN KEY (`delivery_id`) REFERENCES `delivery`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Candidate` ADD CONSTRAINT `Candidate_position_id_fkey` FOREIGN KEY (`position_id`) REFERENCES `position`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Candidate` ADD CONSTRAINT `Candidate_interviewerId_fkey` FOREIGN KEY (`interviewerId`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_account` ADD CONSTRAINT `employee_account_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `candidate_account` ADD CONSTRAINT `candidate_account_candidate_id_fkey` FOREIGN KEY (`candidate_id`) REFERENCES `Candidate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `device_device_type_id_fkey` FOREIGN KEY (`device_type_id`) REFERENCES `device_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `device_deviceBrandId_fkey` FOREIGN KEY (`deviceBrandId`) REFERENCES `device_brand`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `device_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `check_in_out` ADD CONSTRAINT `check_in_out_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `common_request` ADD CONSTRAINT `common_request_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request_working_remote` ADD CONSTRAINT `request_working_remote_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request_for_absent` ADD CONSTRAINT `request_for_absent_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_education` ADD CONSTRAINT `employee_education_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_education` ADD CONSTRAINT `employee_education_program_id_fkey` FOREIGN KEY (`program_id`) REFERENCES `educatipn_program`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RecruimentNewsToTag` ADD CONSTRAINT `_RecruimentNewsToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `recruiment_news`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RecruimentNewsToTag` ADD CONSTRAINT `_RecruimentNewsToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EducationProgramToTag` ADD CONSTRAINT `_EducationProgramToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `educatipn_program`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EducationProgramToTag` ADD CONSTRAINT `_EducationProgramToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
