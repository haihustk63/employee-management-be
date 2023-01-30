-- DropForeignKey
ALTER TABLE `TestTopicQuestion` DROP FOREIGN KEY `TestTopicQuestion_question_id_fkey`;

-- AddForeignKey
ALTER TABLE `TestTopicQuestion` ADD CONSTRAINT `TestTopicQuestion_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `TestQuestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
