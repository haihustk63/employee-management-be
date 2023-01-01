-- DropForeignKey
ALTER TABLE `TestQuestionTests` DROP FOREIGN KEY `TestQuestionTests_test_id_fkey`;

-- AddForeignKey
ALTER TABLE `TestQuestionTests` ADD CONSTRAINT `TestQuestionTests_test_id_fkey` FOREIGN KEY (`test_id`) REFERENCES `SkillTest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
