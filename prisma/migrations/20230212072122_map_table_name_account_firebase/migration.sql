/*
  Warnings:

  - You are about to drop the `AccountFirebase` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `AccountFirebase` DROP FOREIGN KEY `AccountFirebase_email_fkey`;

-- DropTable
DROP TABLE `AccountFirebase`;

-- CreateTable
CREATE TABLE `account_firebase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uid` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `account_firebase_uid_key`(`uid`),
    UNIQUE INDEX `account_firebase_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `account_firebase` ADD CONSTRAINT `account_firebase_email_fkey` FOREIGN KEY (`email`) REFERENCES `employee_account`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
