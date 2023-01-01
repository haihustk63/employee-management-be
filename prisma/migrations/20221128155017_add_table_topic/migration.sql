-- CreateTable
CREATE TABLE `TestTopic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `descripption` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TestQuestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question-text` VARCHAR(191) NOT NULL,
    `question-source` VARCHAR(191) NULL,
    `type` ENUM('ONE_CHOICE', 'MULTIPLE_CHOICE', 'ESSAYS') NOT NULL DEFAULT 'ONE_CHOICE',
    `level` ENUM('EASY', 'MEDIUM', 'HARD') NOT NULL DEFAULT 'EASY',
    `options` JSON NULL,
    `answer` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
