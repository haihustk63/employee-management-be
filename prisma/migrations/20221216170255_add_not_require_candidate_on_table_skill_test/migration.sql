-- DropForeignKey
ALTER TABLE `SkillTest` DROP FOREIGN KEY `SkillTest_candidate_id_fkey`;

-- AlterTable
ALTER TABLE `SkillTest` MODIFY `candidate_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `SkillTest` ADD CONSTRAINT `SkillTest_candidate_id_fkey` FOREIGN KEY (`candidate_id`) REFERENCES `candidate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
