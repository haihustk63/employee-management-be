-- DropForeignKey
ALTER TABLE `candidate` DROP FOREIGN KEY `candidate_interviewer_id_fkey`;

-- AlterTable
ALTER TABLE `candidate` MODIFY `interviewer_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `candidate` ADD CONSTRAINT `candidate_interviewer_id_fkey` FOREIGN KEY (`interviewer_id`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
