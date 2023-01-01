/*
  Warnings:

  - Added the required column `topicId` to the `TestQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TestQuestion` ADD COLUMN `topicId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `TestQuestion` ADD CONSTRAINT `TestQuestion_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `TestTopic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
