/*
  Warnings:

  - A unique constraint covering the columns `[google_email]` on the table `account_firebase` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `google_email` to the `account_firebase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `account_firebase` ADD COLUMN `google_email` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `account_firebase_google_email_key` ON `account_firebase`(`google_email`);
