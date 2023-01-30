/*
  Warnings:

  - You are about to drop the `TestTopicQuestion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `topicId` to the `TestQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `TestTopicQuestion` DROP FOREIGN KEY `TestTopicQuestion_question_id_fkey`;

-- DropForeignKey
ALTER TABLE `TestTopicQuestion` DROP FOREIGN KEY `TestTopicQuestion_topic_id_fkey`;

-- AlterTable
ALTER TABLE `TestQuestion` ADD COLUMN `topicId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `TestTopicQuestion`;

-- AddForeignKey
ALTER TABLE `TestQuestion` ADD CONSTRAINT `TestQuestion_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `TestTopic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
