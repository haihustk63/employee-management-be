/*
  Warnings:

  - You are about to drop the column `interviewerId` on the `candidate` table. All the data in the column will be lost.
  - Added the required column `interviewer_id` to the `candidate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `candidate` DROP FOREIGN KEY `candidate_interviewerId_fkey`;

-- AlterTable
ALTER TABLE `candidate` DROP COLUMN `interviewerId`,
    ADD COLUMN `interviewer_id` INTEGER NOT NULL,
    MODIFY `appointment_time` DATETIME(3) NULL;

-- AddForeignKey
ALTER TABLE `candidate` ADD CONSTRAINT `candidate_interviewer_id_fkey` FOREIGN KEY (`interviewer_id`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
