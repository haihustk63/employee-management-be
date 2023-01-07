/*
  Warnings:

  - You are about to drop the `Job` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SkillTest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestQuestionTests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Job` DROP FOREIGN KEY `Job_position_id_fkey`;

-- DropForeignKey
ALTER TABLE `SkillTest` DROP FOREIGN KEY `SkillTest_candidate_id_fkey`;

-- DropForeignKey
ALTER TABLE `TestQuestion` DROP FOREIGN KEY `TestQuestion_topicId_fkey`;

-- DropForeignKey
ALTER TABLE `TestQuestionTests` DROP FOREIGN KEY `TestQuestionTests_question_id_fkey`;

-- DropForeignKey
ALTER TABLE `TestQuestionTests` DROP FOREIGN KEY `TestQuestionTests_test_id_fkey`;

-- DropForeignKey
ALTER TABLE `candidate` DROP FOREIGN KEY `candidate_jobId_fkey`;

-- DropTable
DROP TABLE `Job`;

-- DropTable
DROP TABLE `SkillTest`;

-- DropTable
DROP TABLE `TestQuestion`;

-- DropTable
DROP TABLE `TestQuestionTests`;

-- CreateTable
CREATE TABLE `test_question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question-text` VARCHAR(191) NOT NULL,
    `question-source` JSON NULL,
    `type` INTEGER NOT NULL DEFAULT 1,
    `level` INTEGER NOT NULL DEFAULT 1,
    `options` JSON NULL,
    `answer` JSON NULL,
    `topicId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `skill_test` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `candidate_id` INTEGER NULL,
    `score` DECIMAL(65, 30) NULL,
    `is_submitted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `skill_test_candidate_id_key`(`candidate_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test_question_tests` (
    `question_id` INTEGER NOT NULL,
    `test_id` INTEGER NOT NULL,
    `answer` JSON NULL,

    UNIQUE INDEX `test_question_tests_question_id_test_id_key`(`question_id`, `test_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `type_of_job` INTEGER NOT NULL,
    `up_to` INTEGER NULL,
    `level` INTEGER NOT NULL,
    `job_detail` LONGTEXT NULL,
    `position_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `candidate` ADD CONSTRAINT `candidate_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `job`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_question` ADD CONSTRAINT `test_question_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `TestTopic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skill_test` ADD CONSTRAINT `skill_test_candidate_id_fkey` FOREIGN KEY (`candidate_id`) REFERENCES `candidate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_question_tests` ADD CONSTRAINT `test_question_tests_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `test_question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_question_tests` ADD CONSTRAINT `test_question_tests_test_id_fkey` FOREIGN KEY (`test_id`) REFERENCES `skill_test`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `job` ADD CONSTRAINT `job_position_id_fkey` FOREIGN KEY (`position_id`) REFERENCES `position`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
