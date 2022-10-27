/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `candidate_account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `candidate_account_username_key` ON `candidate_account`(`username`);
