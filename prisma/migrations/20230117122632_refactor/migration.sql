/*
  Warnings:

  - You are about to drop the column `question-source` on the `test_question` table. All the data in the column will be lost.
  - You are about to drop the column `question-text` on the `test_question` table. All the data in the column will be lost.
  - You are about to drop the column `topicId` on the `test_question` table. All the data in the column will be lost.
  - Added the required column `question_text` to the `test_question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic_id` to the `test_question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `test_question` DROP FOREIGN KEY `test_question_topicId_fkey`;

-- AlterTable
ALTER TABLE `employee` ADD COLUMN `avatar` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `test_question` DROP COLUMN `question-source`,
    DROP COLUMN `question-text`,
    DROP COLUMN `topicId`,
    ADD COLUMN `question_source` JSON NULL,
    ADD COLUMN `question_text` VARCHAR(191) NOT NULL,
    ADD COLUMN `topic_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `test_question` ADD CONSTRAINT `test_question_topic_id_fkey` FOREIGN KEY (`topic_id`) REFERENCES `test_topic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
