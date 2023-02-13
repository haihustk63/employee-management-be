-- CreateTable
CREATE TABLE `AccountFirebase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uid` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AccountFirebase_uid_key`(`uid`),
    UNIQUE INDEX `AccountFirebase_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AccountFirebase` ADD CONSTRAINT `AccountFirebase_email_fkey` FOREIGN KEY (`email`) REFERENCES `employee_account`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
