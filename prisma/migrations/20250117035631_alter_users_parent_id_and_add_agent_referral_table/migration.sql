/*
  Warnings:

  - You are about to drop the column `parent_id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[agent_code]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_parent_id_fkey`;

-- DropIndex
DROP INDEX `users_parent_id_fkey` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `parent_id`;

-- CreateTable
CREATE TABLE `agent_referral` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `agent_id` INTEGER NOT NULL,

    UNIQUE INDEX `agent_referral_code_key`(`code`),
    UNIQUE INDEX `agent_referral_agent_id_key`(`agent_id`),
    INDEX `agent_referral_code_agent_id_idx`(`code`, `agent_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_agent_code_key` ON `users`(`agent_code`);
