-- DropForeignKey
ALTER TABLE `candidate` DROP FOREIGN KEY `candidate_interviewer_id_fkey`;

-- DropForeignKey
ALTER TABLE `check_in_out` DROP FOREIGN KEY `check_in_out_employee_id_fkey`;

-- DropForeignKey
ALTER TABLE `common_request` DROP FOREIGN KEY `common_request_employee_id_fkey`;

-- DropForeignKey
ALTER TABLE `device` DROP FOREIGN KEY `device_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `employee_education` DROP FOREIGN KEY `employee_education_employee_id_fkey`;

-- AddForeignKey
ALTER TABLE `candidate` ADD CONSTRAINT `candidate_interviewer_id_fkey` FOREIGN KEY (`interviewer_id`) REFERENCES `employee`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `device_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `check_in_out` ADD CONSTRAINT `check_in_out_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `common_request` ADD CONSTRAINT `common_request_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_education` ADD CONSTRAINT `employee_education_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
