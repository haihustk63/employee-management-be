-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `employee_position_id_fkey`;

-- AlterTable
ALTER TABLE `employee` MODIFY `position_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_position_id_fkey` FOREIGN KEY (`position_id`) REFERENCES `position`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
