/*
  Warnings:

  - You are about to drop the column `test_link` on the `candidate` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[candidate_id]` on the table `SkillTest` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `TestQuestionTests` DROP FOREIGN KEY `TestQuestionTests_question_id_fkey`;

-- AlterTable
ALTER TABLE `candidate` DROP COLUMN `test_link`;

-- CreateIndex
CREATE UNIQUE INDEX `SkillTest_candidate_id_key` ON `SkillTest`(`candidate_id`);

-- AddForeignKey
ALTER TABLE `TestQuestionTests` ADD CONSTRAINT `TestQuestionTests_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `TestQuestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
