-- DropForeignKey
ALTER TABLE `delivery_employee` DROP FOREIGN KEY `delivery_employee_delivery_id_fkey`;

-- AddForeignKey
ALTER TABLE `delivery_employee` ADD CONSTRAINT `delivery_employee_delivery_id_fkey` FOREIGN KEY (`delivery_id`) REFERENCES `delivery`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
