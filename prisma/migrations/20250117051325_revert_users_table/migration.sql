/*
  Warnings:

  - You are about to drop the `agent_referral` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `parent_id` INTEGER NULL;

-- DropTable
DROP TABLE `agent_referral`;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
