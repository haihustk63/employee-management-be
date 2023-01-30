/*
  Warnings:

  - You are about to drop the `TestTopic` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `test_question` DROP FOREIGN KEY `test_question_topicId_fkey`;

-- DropTable
DROP TABLE `TestTopic`;

-- CreateTable
CREATE TABLE `test_topic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `test_question` ADD CONSTRAINT `test_question_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `test_topic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
