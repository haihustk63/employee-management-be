-- CreateTable
CREATE TABLE `SkillTest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `candidate_id` INTEGER NOT NULL,
    `score` DECIMAL(65, 30) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TestQuestionTests` (
    `question_id` INTEGER NOT NULL,
    `test_id` INTEGER NOT NULL,
    `answer` JSON NULL,

    UNIQUE INDEX `TestQuestionTests_question_id_test_id_key`(`question_id`, `test_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SkillTest` ADD CONSTRAINT `SkillTest_candidate_id_fkey` FOREIGN KEY (`candidate_id`) REFERENCES `candidate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TestQuestionTests` ADD CONSTRAINT `TestQuestionTests_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `TestQuestion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TestQuestionTests` ADD CONSTRAINT `TestQuestionTests_test_id_fkey` FOREIGN KEY (`test_id`) REFERENCES `SkillTest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
