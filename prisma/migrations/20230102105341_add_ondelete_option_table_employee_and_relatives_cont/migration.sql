-- DropForeignKey
ALTER TABLE `candidate` DROP FOREIGN KEY `candidate_interviewer_id_fkey`;

-- DropForeignKey
ALTER TABLE `device` DROP FOREIGN KEY `device_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `employee_account` DROP FOREIGN KEY `employee_account_employee_id_fkey`;

-- DropForeignKey
ALTER TABLE `employee_education` DROP FOREIGN KEY `employee_education_employee_id_fkey`;

-- AlterTable
ALTER TABLE `device` MODIFY `employeeId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `candidate` ADD CONSTRAINT `candidate_interviewer_id_fkey` FOREIGN KEY (`interviewer_id`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_account` ADD CONSTRAINT `employee_account_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `device_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_education` ADD CONSTRAINT `employee_education_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
