/*
  Warnings:

  - You are about to drop the column `candidate_id` on the `skill_test` table. All the data in the column will be lost.
  - You are about to drop the column `is_submitted` on the `skill_test` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `skill_test` table. All the data in the column will be lost.
  - You are about to drop the `test_question_tests` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[candidate_id]` on the table `employee_account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `skill_test` DROP FOREIGN KEY `skill_test_candidate_id_fkey`;

-- DropForeignKey
ALTER TABLE `test_question_tests` DROP FOREIGN KEY `test_question_tests_question_id_fkey`;

-- DropForeignKey
ALTER TABLE `test_question_tests` DROP FOREIGN KEY `test_question_tests_test_id_fkey`;

-- AlterTable
ALTER TABLE `employee_account` ADD COLUMN `candidate_id` INTEGER NULL,
    ADD PRIMARY KEY (`email`);

-- AlterTable
ALTER TABLE `skill_test` DROP COLUMN `candidate_id`,
    DROP COLUMN `is_submitted`,
    DROP COLUMN `score`;

-- DropTable
DROP TABLE `test_question_tests`;

-- CreateTable
CREATE TABLE `skill_test_account` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `test_id` INTEGER NOT NULL,
    `score` DECIMAL(65, 30) NULL DEFAULT 0,

    UNIQUE INDEX `skill_test_account_email_test_id_key`(`email`, `test_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test_question_skill_test` (
    `question_id` INTEGER NOT NULL,
    `test_id` INTEGER NOT NULL,

    UNIQUE INDEX `test_question_skill_test_question_id_test_id_key`(`question_id`, `test_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `skill_test_session_answer` (
    `session_id` INTEGER NOT NULL,
    `question_id` INTEGER NOT NULL,
    `answer` JSON NULL,

    UNIQUE INDEX `skill_test_session_answer_session_id_question_id_key`(`session_id`, `question_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `employee_account_candidate_id_key` ON `employee_account`(`candidate_id`);

-- AddForeignKey
ALTER TABLE `employee_account` ADD CONSTRAINT `employee_account_candidate_id_fkey` FOREIGN KEY (`candidate_id`) REFERENCES `candidate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skill_test_account` ADD CONSTRAINT `skill_test_account_test_id_fkey` FOREIGN KEY (`test_id`) REFERENCES `skill_test`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skill_test_account` ADD CONSTRAINT `skill_test_account_email_fkey` FOREIGN KEY (`email`) REFERENCES `employee_account`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_question_skill_test` ADD CONSTRAINT `test_question_skill_test_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `test_question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_question_skill_test` ADD CONSTRAINT `test_question_skill_test_test_id_fkey` FOREIGN KEY (`test_id`) REFERENCES `skill_test`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skill_test_session_answer` ADD CONSTRAINT `skill_test_session_answer_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `skill_test_account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skill_test_session_answer` ADD CONSTRAINT `skill_test_session_answer_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `test_question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
