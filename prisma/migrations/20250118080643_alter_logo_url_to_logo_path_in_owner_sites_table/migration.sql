/*
  Warnings:

  - You are about to drop the column `logo_url` on the `owner_sites` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `owner_sites` DROP COLUMN `logo_url`,
    ADD COLUMN `logo_path` VARCHAR(191) NULL;
