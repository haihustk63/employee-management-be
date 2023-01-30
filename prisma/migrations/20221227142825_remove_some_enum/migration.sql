/*
  Warnings:

  - You are about to alter the column `type` on the `common_request` table. The data in that column could be lost. The data in that column will be cast from `Enum("common_request_type")` to `Int`.
  - You are about to alter the column `status` on the `common_request` table. The data in that column could be lost. The data in that column will be cast from `Enum("common_request_status")` to `Int`.
  - You are about to alter the column `type` on the `request_for_absent` table. The data in that column could be lost. The data in that column will be cast from `Enum("request_for_absent_type")` to `Int`.
  - You are about to alter the column `status` on the `request_for_absent` table. The data in that column could be lost. The data in that column will be cast from `Enum("request_for_absent_status")` to `Int`.
  - You are about to alter the column `status` on the `request_working_remote` table. The data in that column could be lost. The data in that column will be cast from `Enum("request_working_remote_status")` to `Int`.

*/
-- AlterTable
ALTER TABLE `common_request` MODIFY `duration` INTEGER NULL,
    MODIFY `type` INTEGER NOT NULL DEFAULT 1,
    MODIFY `status` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `request_for_absent` MODIFY `type` INTEGER NOT NULL DEFAULT 1,
    MODIFY `status` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `request_working_remote` MODIFY `status` INTEGER NOT NULL DEFAULT 1;
