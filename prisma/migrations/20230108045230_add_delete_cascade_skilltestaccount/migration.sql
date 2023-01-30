-- DropForeignKey
ALTER TABLE `skill_test_account` DROP FOREIGN KEY `skill_test_account_email_fkey`;

-- AddForeignKey
ALTER TABLE `skill_test_account` ADD CONSTRAINT `skill_test_account_email_fkey` FOREIGN KEY (`email`) REFERENCES `employee_account`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;
