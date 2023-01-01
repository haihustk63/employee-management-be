/*
  Warnings:

  - You are about to drop the column `description` on the `educatipn_program` table. All the data in the column will be lost.
  - You are about to drop the column `content_html` on the `recruiment_news` table. All the data in the column will be lost.
  - You are about to drop the column `content_json` on the `recruiment_news` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `educatipn_program` DROP COLUMN `description`,
    ADD COLUMN `content` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `recruiment_news` DROP COLUMN `content_html`,
    DROP COLUMN `content_json`,
    ADD COLUMN `content` VARCHAR(191) NULL;
