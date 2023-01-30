-- DropForeignKey
ALTER TABLE `employee_education` DROP FOREIGN KEY `employee_education_program_id_fkey`;

-- AddForeignKey
ALTER TABLE `employee_education` ADD CONSTRAINT `employee_education_program_id_fkey` FOREIGN KEY (`program_id`) REFERENCES `education_program`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
