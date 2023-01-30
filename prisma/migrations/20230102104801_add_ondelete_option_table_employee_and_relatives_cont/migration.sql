-- DropForeignKey
ALTER TABLE `delivery_employee` DROP FOREIGN KEY `delivery_employee_employee_id_fkey`;

-- AddForeignKey
ALTER TABLE `delivery_employee` ADD CONSTRAINT `delivery_employee_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
