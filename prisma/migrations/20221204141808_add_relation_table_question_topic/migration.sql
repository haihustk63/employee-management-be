/*
  Warnings:

  - You are about to drop the column `topicId` on the `TestQuestion` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `TestQuestion` DROP FOREIGN KEY `TestQuestion_topicId_fkey`;

-- AlterTable
ALTER TABLE `TestQuestion` DROP COLUMN `topicId`;

-- CreateTable
CREATE TABLE `TestTopicQuestion` (
    `question_id` INTEGER NOT NULL,
    `topic_id` INTEGER NOT NULL,

    UNIQUE INDEX `TestTopicQuestion_question_id_topic_id_key`(`question_id`, `topic_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TestTopicQuestion` ADD CONSTRAINT `TestTopicQuestion_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `TestQuestion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TestTopicQuestion` ADD CONSTRAINT `TestTopicQuestion_topic_id_fkey` FOREIGN KEY (`topic_id`) REFERENCES `TestTopic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
